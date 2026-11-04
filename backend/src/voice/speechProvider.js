/**
 * NOVA Backend — Speech Provider Interface & Faster-Whisper Implementation
 * Stage 3 Voice Pipeline
 *
 * Principles:
 * - Replaceable speech-provider interface (ISpeechProvider)
 * - Supported languages: English (en), Bengali (bn), Hindi (hi), Auto-detect (auto)
 * - Audio format conversion via ffmpeg to standard 16kHz mono WAV
 * - Strict 10MB size limit and 60-second duration limit
 * - Audio is kept strictly transient: all temp files cleaned up in finally blocks
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dedicated temporary directory for transient voice clips
const TEMP_DIR = path.resolve(__dirname, '../../temp/voice');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Base Speech Provider Interface
 */
export class ISpeechProvider {
  async transcribe(options) {
    throw new Error('transcribe() must be implemented by concrete speech provider');
  }

  async getStatus() {
    throw new Error('getStatus() must be implemented by concrete speech provider');
  }
}

/**
 * Faster-Whisper Python Worker Provider
 */
export class FasterWhisperProvider extends ISpeechProvider {
  constructor() {
    super();
    this.pythonPath = process.env.PYTHON_PATH || 'python';
    this.workerPath = path.resolve(__dirname, '../../workers/transcription_worker.py');
    this.modelName = process.env.WHISPER_MODEL || 'tiny';
    this.maxSizeBytes = 10 * 1024 * 1024; // 10 MB
    this.maxDurationSeconds = 60; // 60s
    this.supportedLanguages = ['en', 'bn', 'hi', 'auto'];
  }

  /**
   * Diagnostic status of the speech worker
   */
  async getStatus() {
    let pythonAvailable = false;
    let workerAvailable = fs.existsSync(this.workerPath);
    let fasterWhisperInstalled = false;

    try {
      const checkProc = spawn(this.pythonPath, ['-c', 'import faster_whisper; print("OK")']);
      let output = '';
      for await (const chunk of checkProc.stdout) output += chunk;
      if (output.trim() === 'OK') {
        pythonAvailable = true;
        fasterWhisperInstalled = true;
      }
    } catch (e) {
      // Python not available
    }

    const ready = pythonAvailable && workerAvailable && fasterWhisperInstalled;

    return {
      provider: 'faster-whisper',
      status: ready ? 'ready' : 'unconfigured',
      ready,
      model: this.modelName,
      supportedLanguages: this.supportedLanguages,
      maxSizeBytes: this.maxSizeBytes,
      maxDurationSeconds: this.maxDurationSeconds,
      pythonAvailable,
      workerAvailable,
      fasterWhisperInstalled,
      notice: ready
        ? `Faster-Whisper active (model: ${this.modelName}, languages: en, bn, hi, auto)`
        : 'Python faster-whisper worker not ready. Install via: pip install -r backend/requirements.txt'
    };
  }

  /**
   * Transcribe an uploaded audio file buffer or file path
   *
   * @param {object} params
   * @param {Buffer} [params.buffer] - Audio raw data buffer
   * @param {string} [params.filePath] - Existing file path
   * @param {string} [params.mimeType] - e.g. 'audio/webm', 'audio/wav'
   * @param {string} [params.language] - 'en', 'bn', 'hi', 'auto'
   * @returns {Promise<object>} Standard transcription result
   */
  async transcribe({ buffer, filePath, mimeType = 'audio/webm', language = 'auto' }) {
    const rawLang = (language || 'auto').toLowerCase();
    const targetLang = this.supportedLanguages.includes(rawLang) ? rawLang : 'auto';

    const fileId = crypto.randomUUID();
    const originalTempPath = filePath || path.join(TEMP_DIR, `raw_${fileId}.tmp`);
    const convertedWavPath = path.join(TEMP_DIR, `conv_${fileId}.wav`);

    const filesToCleanup = [];

    // Track files to delete in finally
    if (!filePath && buffer) {
      fs.writeFileSync(originalTempPath, buffer);
      filesToCleanup.push(originalTempPath);
    } else if (filePath) {
      filesToCleanup.push(filePath);
    }
    filesToCleanup.push(convertedWavPath);

    try {
      // 1. Enforce size limit
      const stats = fs.statSync(originalTempPath);
      if (stats.size > this.maxSizeBytes) {
        const err = new Error(`Audio file exceeds maximum size limit of ${this.maxSizeBytes / (1024 * 1024)}MB.`);
        err.code = 'AUDIO_FILE_TOO_LARGE';
        err.statusCode = 413;
        throw err;
      }
      if (stats.size === 0) {
        return {
          text: '',
          isSilent: true,
          language: targetLang,
          confidence: 0,
          duration: 0,
          message: 'Audio payload was empty.'
        };
      }

      // 2. Convert to standard 16kHz mono WAV using ffmpeg
      await this._convertToStandardWav(originalTempPath, convertedWavPath);

      // 3. Check converted file duration
      const duration = await this._getAudioDuration(convertedWavPath);
      if (duration > this.maxDurationSeconds) {
        const err = new Error(`Audio duration (${duration.toFixed(1)}s) exceeds maximum allowed ${this.maxDurationSeconds}s.`);
        err.code = 'AUDIO_DURATION_EXCEEDED';
        err.statusCode = 413;
        throw err;
      }

      // 4. Invoke Python faster-whisper worker
      const transcriptionResult = await this._runPythonWorker(convertedWavPath, targetLang);

      return {
        text: transcriptionResult.text || '',
        isSilent: Boolean(transcriptionResult.is_silent),
        language: transcriptionResult.language || targetLang,
        languageProbability: transcriptionResult.language_probability || 1.0,
        duration: transcriptionResult.duration || duration,
        confidence: transcriptionResult.confidence || 0,
        segments: transcriptionResult.segments || []
      };

    } finally {
      // 5. TRANSIENT STORAGE ENFORCEMENT: Clean up all temporary audio files
      for (const tempFile of filesToCleanup) {
        try {
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        } catch (cleanupErr) {
          // Non-blocking cleanup warning
          console.warn(`[VoicePipeline] Failed to clean temp file ${tempFile}:`, cleanupErr.message);
        }
      }
    }
  }

  /**
   * Convert any incoming browser recording to 16kHz mono 16-bit PCM WAV using ffmpeg
   */
  async _convertToStandardWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      // ffmpeg -y -i input -ar 16000 -ac 1 -c:a pcm_s16le output.wav
      const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-i', inputPath,
        '-vn',
        '-ar', '16000',
        '-ac', '1',
        '-c:a', 'pcm_s16le',
        outputPath
      ]);

      let stderr = '';
      ffmpeg.stderr.on('data', chunk => { stderr += chunk; });

      ffmpeg.on('close', code => {
        if (code === 0 && fs.existsSync(outputPath)) {
          resolve(outputPath);
        } else {
          // If ffmpeg failed or unsupported audio
          const err = new Error(`Audio conversion failed: ${stderr.slice(-200) || 'Unsupported audio format'}`);
          err.code = 'UNSUPPORTED_AUDIO_FORMAT';
          err.statusCode = 415;
          reject(err);
        }
      });

      ffmpeg.on('error', err => {
        const error = new Error(`FFmpeg binary not found or execution failed: ${err.message}`);
        error.code = 'FFMPEG_UNAVAILABLE';
        error.statusCode = 500;
        reject(error);
      });
    });
  }

  /**
   * Probe audio duration using ffmpeg/ffprobe or file header
   */
  async _getAudioDuration(wavPath) {
    try {
      const stats = fs.statSync(wavPath);
      // For 16kHz 16-bit mono PCM: 16000 samples/sec * 2 bytes = 32000 bytes/sec
      // Minus 44 bytes WAV header
      const pcmBytes = Math.max(0, stats.size - 44);
      return pcmBytes / 32000;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Execute the standalone Python transcription worker script
   */
  async _runPythonWorker(audioPath, language) {
    return new Promise((resolve, reject) => {
      const args = [
        this.workerPath,
        '--input', audioPath,
        '--language', language,
        '--model', this.modelName,
        '--device', process.env.WHISPER_DEVICE || 'cpu',
        '--compute_type', process.env.WHISPER_COMPUTE_TYPE || 'int8'
      ];

      const proc = spawn(this.pythonPath, args);

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', chunk => { stdout += chunk; });
      proc.stderr.on('data', chunk => { stderr += chunk; });

      proc.on('close', code => {
        let parsed = null;
        try {
          parsed = JSON.parse(stdout.trim());
        } catch (jsonErr) {
          const err = new Error(`Worker returned non-JSON output. stderr: ${stderr.slice(-300) || 'none'}`);
          err.code = 'TRANSCRIPTION_WORKER_ERROR';
          err.statusCode = 500;
          return reject(err);
        }

        if (code !== 0 || !parsed.success) {
          const err = new Error(parsed?.error || `Transcription worker failed with code ${code}`);
          err.code = parsed?.code || 'TRANSCRIPTION_FAILED';
          err.statusCode = 500;
          return reject(err);
        }

        resolve(parsed);
      });

      proc.on('error', err => {
        const error = new Error(`Failed to spawn Python transcription worker: ${err.message}`);
        error.code = 'PYTHON_WORKER_SPAWN_ERROR';
        error.statusCode = 500;
        reject(error);
      });
    });
  }
}

// Default replaceable provider singleton
let currentSpeechProvider = new FasterWhisperProvider();

export function getSpeechProvider() {
  return currentSpeechProvider;
}

export function setSpeechProvider(provider) {
  if (!(provider instanceof ISpeechProvider)) {
    throw new Error('Provider must implement ISpeechProvider interface');
  }
  currentSpeechProvider = provider;
}

