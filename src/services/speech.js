/**
 * NOVA — Robust Voice Pipeline (Stage 3)
 *
 * Implements:
 * 1. Push-to-Talk audio capture with MediaRecorder
 * 2. Real-time Voice Activity Detection (VAD) & silence handling via Web Audio API
 * 3. Transcription dispatch to backend faster-whisper worker (POST /api/voice/transcribe)
 * 4. Multilingual selection: English (en), Bengali (bn), Hindi (hi), Auto-detect (auto)
 * 5. Modular TTS output with immediate interruption cancellation
 * 6. Explicit state coordination: idle -> listening -> transcribing -> thinking -> acting -> speaking
 * 7. Graceful error recovery: denied permissions, unsupported audio, server offline
 * 8. Strict non-auto-submission: transcribed text is presented as editable preview
 */

import { api } from './apiAdapter.js';

export class VoicePipeline {
  constructor() {
    // Pipeline State: 'idle' | 'listening' | 'transcribing' | 'thinking' | 'acting' | 'speaking'
    this.state = 'idle';

    // Audio capture & VAD
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.vadCheckInterval = null;
    this.recordingStartTime = 0;
    this.maxRmsObserved = 0;

    // Multilingual configuration
    const savedLang = localStorage.getItem('nova_voice_language') || 'auto';
    this.selectedLanguage = ['auto', 'en', 'bn', 'hi'].includes(savedLang) ? savedLang : 'auto';

    // TTS Synthesis
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = localStorage.getItem('nova_voice_muted') === 'true';
    this.voices = [];

    // Callbacks
    this.onStateChange = null;            // (state: string)
    this.onAudioLevel = null;             // (rms: number)
    this.onTranscription = null;          // ({ text, language, confidence, isSilent })
    this.onSilenceDetected = null;        // (message: string)
    this.onError = null;                  // (errorMessage: string, code?: string)
    this.onVoicesChanged = null;          // (voices: Array)

    this._initVoices();
  }

  // --------------------------------------------------------------------------
  // State Machine Management
  // --------------------------------------------------------------------------
  setState(newState) {
    if (this.state === newState) return;
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  getState() {
    return this.state;
  }

  // --------------------------------------------------------------------------
  // Language Configuration (en, bn, hi, auto)
  // --------------------------------------------------------------------------
  setLanguage(lang) {
    const valid = ['auto', 'en', 'bn', 'hi'];
    if (valid.includes(lang)) {
      this.selectedLanguage = lang;
      localStorage.setItem('nova_voice_language', lang);
    }
  }

  getLanguage() {
    return this.selectedLanguage;
  }

  // --------------------------------------------------------------------------
  // Push-to-Talk & Real-Time VAD Audio Capture
  // --------------------------------------------------------------------------
  get isRecording() {
    return this.state === 'listening';
  }

  /**
   * Start Push-to-Talk audio recording with VAD analysis.
   * Cancels any active speech synthesis immediately on interruption.
   */
  async startRecording() {
    // 1. Immediately cancel active speech when user begins speaking / interrupts
    this.stopSpeaking();

    if (this.isRecording) {
      return false;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (this.onError) {
        this.onError('Microphone input is not supported in this browser.', 'MICROPHONE_UNSUPPORTED');
      }
      return false;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (permErr) {
      let msg = 'Microphone access error.';
      let code = 'MICROPHONE_ERROR';
      if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
        msg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
        code = 'PERMISSION_DENIED';
      } else if (permErr.name === 'NotFoundError' || permErr.name === 'DevicesNotFoundError') {
        msg = 'No microphone device was detected on this system.';
        code = 'DEVICE_NOT_FOUND';
      }
      this.setState('idle');
      if (this.onError) this.onError(msg, code);
      return false;
    }

    // 2. Select optimal browser audio container
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    let selectedMime = 'audio/webm';
    if (typeof MediaRecorder !== 'undefined') {
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }
    }

    this.audioChunks = [];
    this.recordingStartTime = Date.now();
    this.maxRmsObserved = 0;

    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: selectedMime,
        audioBitsPerSecond: 64000
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // 3. Set up Web Audio API Analyser for real-time VAD & RMS level monitoring
      this._setupAudioAnalyser(this.mediaStream);

      this.mediaRecorder.start(200); // 200ms slice
      this.setState('listening');
      return true;

    } catch (recorderErr) {
      this._cleanupMediaStream();
      this.setState('idle');
      if (this.onError) {
        this.onError(`Failed to initialize audio recorder: ${recorderErr.message}`, 'RECORDER_INIT_FAILED');
      }
      return false;
    }
  }

  /**
   * Setup AudioContext AnalyserNode for real-time RMS & VAD calculations
   */
  _setupAudioAnalyser(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.vadCheckInterval = setInterval(() => {
        if (!this.analyser || this.state !== 'listening') return;

        this.analyser.getByteTimeDomainData(dataArray);

        // Calculate Root Mean Square (RMS) volume
        let sumSquares = 0.0;
        for (let i = 0; i < bufferLength; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / bufferLength);
        if (rms > this.maxRmsObserved) {
          this.maxRmsObserved = rms;
        }

        if (this.onAudioLevel) {
          this.onAudioLevel(rms);
        }
      }, 80);

    } catch (e) {
      console.warn('[VoicePipeline] AudioContext analyser setup warning:', e);
    }
  }

  /**
   * Stop Push-to-Talk audio recording and send to backend faster-whisper pipeline.
   * Strictly evaluates silence and never submits blank audio automatically.
   */
  async stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) {
      return;
    }

    const durationMs = Date.now() - this.recordingStartTime;
    const maxRms = this.maxRmsObserved;

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = async () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        this._cleanupMediaStream();
        this._cleanupAudioAnalyser();

        // 1. Client-Side Silence & Short Tap Filter:
        // Audio shorter than 400ms or maximum RMS below silence threshold (~0.015)
        if (durationMs < 400 || maxRms < 0.015 || audioBlob.size < 500) {
          this.setState('idle');
          if (this.onSilenceDetected) {
            this.onSilenceDetected('Silence detected — no voice input captured.');
          }
          resolve(null);
          return;
        }

        // 2. Dispatch to Backend Faster-Whisper Pipeline
        this.setState('transcribing');

        try {
          const result = await this._dispatchTranscription(audioBlob, mimeType);
          this.setState('idle');

          if (result.isSilent || !result.text || result.text.trim().length === 0) {
            if (this.onSilenceDetected) {
              this.onSilenceDetected('No intelligible speech detected.');
            }
          } else {
            if (this.onTranscription) {
              this.onTranscription({
                text: result.text.trim(),
                language: result.language,
                languageProbability: result.languageProbability,
                duration: result.duration,
                confidence: result.confidence,
                isSilent: false
              });
            }
          }

          resolve(result);

        } catch (transcribeErr) {
          this.setState('idle');
          const errorMsg = transcribeErr.message || 'Voice transcription failed.';
          if (this.onError) {
            this.onError(errorMsg, transcribeErr.code || 'TRANSCRIPTION_ERROR');
          }
          resolve(null);
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        this._cleanupMediaStream();
        this.setState('idle');
        resolve(null);
      }
    });
  }

  /**
   * Discard current recording without transcribing
   */
  cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.onstop = null;
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    this._cleanupMediaStream();
    this._cleanupAudioAnalyser();
    this.audioChunks = [];
    this.setState('idle');
  }

  _cleanupMediaStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  _cleanupAudioAnalyser() {
    if (this.vadCheckInterval) {
      clearInterval(this.vadCheckInterval);
      this.vadCheckInterval = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    this.analyser = null;
  }

  /**
   * Upload audio blob to backend POST /api/voice/transcribe
   */
  async _dispatchTranscription(blob, mimeType) {
    const formData = new FormData();
    const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('ogg') ? 'ogg' : 'webm';
    formData.append('audio', blob, `recording.${ext}`);
    formData.append('language', this.selectedLanguage);

    const headers = {
      'X-API-Key': api.apiKey
    };
    if (api.authToken) {
      headers['Authorization'] = `Bearer ${api.authToken}`;
    }

    const response = await fetch(`${api.apiBase}/voice/transcribe`, {
      method: 'POST',
      headers,
      body: formData
    });

    const json = await response.json().catch(() => null);

    if (!response.ok || !json?.success) {
      const err = new Error(json?.error?.message || `Server transcription failed (${response.status})`);
      err.code = json?.error?.code || 'SERVER_TRANSCRIPTION_FAILED';
      err.statusCode = response.status;
      throw err;
    }

    return json.data;
  }

  // --------------------------------------------------------------------------
  // Modular Text-to-Speech (TTS) Output
  // --------------------------------------------------------------------------
  _initVoices() {
    if (!this.synth) return;

    const updateVoices = () => {
      this.voices = this.synth.getVoices();
      if (this.onVoicesChanged) {
        this.onVoicesChanged(this.voices);
      }
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  getVoices() {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    localStorage.setItem('nova_voice_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopSpeaking();
    }
  }

  cleanTextForSpeech(raw) {
    if (!raw) return '';
    // Strip code blocks completely
    let text = raw.replace(/```[\s\S]*?```/g, ' [Code omitted for audio] ');
    // Strip inline code
    text = text.replace(/`([^`]+)`/g, '$1');
    // Strip markdown formatting
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/\*([^*]+)\*/g, '$1');
    text = text.replace(/#+\s/g, '');
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    text = text.replace(/<[^>]+>/g, '');
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Speak response via SpeechSynthesis.
   * Cancels any ongoing utterance first.
   */
  speak(text, { voiceURI, rate = 1.0, pitch = 1.0 } = {}) {
    if (!this.synth || this.isMuted) {
      if (this.state === 'speaking') this.setState('idle');
      return false;
    }

    // Cancel prior speech immediately
    this.stopSpeaking();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      if (this.state === 'speaking') this.setState('idle');
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = Math.max(0.6, Math.min(1.8, rate));
      utterance.pitch = Math.max(0.6, Math.min(1.6, pitch));

      if (voiceURI) {
        const selectedVoice = this.getVoices().find(v => v.voiceURI === voiceURI);
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        this.setState('speaking');
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.state === 'speaking') this.setState('idle');
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[VoicePipeline] SpeechSynthesis error:', e);
        }
        this.currentUtterance = null;
        if (this.state === 'speaking') this.setState('idle');
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;

    } catch (e) {
      console.warn('[VoicePipeline] Could not speak text:', e);
      if (this.state === 'speaking') this.setState('idle');
      return false;
    }
  }

  /**
   * Cancel speech immediately when interrupted
   */
  stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.currentUtterance = null;
    if (this.state === 'speaking') {
      this.setState('idle');
    }
  }

  isSpeaking() {
    return this.state === 'speaking' || Boolean(this.synth && this.synth.speaking);
  }
}

export const voicePipeline = new VoicePipeline();
// Alias for backward compatibility
export const speech = voicePipeline;
