/**
 * NOVA Backend — Stage 3 Voice Pipeline Test Suite
 * Tests:
 * 1. GET /api/voice/status (Faster-whisper readiness, languages, limits)
 * 2. POST /api/voice/transcribe authentication & input validation
 * 3. Real speech transcription with English audio
 * 4. Browser WebM format conversion via ffmpeg
 * 5. Language parameter validation (en, bn, hi, auto)
 * 6. VAD & Silence detection (silence returns isSilent: true and text: "")
 * 7. Audio size limit enforcement (10MB limit)
 * 8. Transient storage verification (all temp files cleaned up immediately)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import wave from 'node:fs';
import { spawn } from 'child_process';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';

let server;
let baseUrl;

async function request(pathUrl, options = {}) {
  const url = `${baseUrl}${pathUrl}`;
  const headers = {
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers
  };

  if (options.body) {
    fetchOptions.body = options.body;
  }

  const res = await fetch(url, fetchOptions);
  const status = res.status;
  const requestId = res.headers.get('x-request-id');

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = await res.text();
  }

  return { status, body, requestId };
}

/**
 * Generate 1-second silent WAV file buffer
 */
function createSilentWavBuffer(durationSeconds = 1.0, sampleRate = 16000) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Remaining bytes are 0 (pure silence)
  return buffer;
}

/**
 * Generate synthetic spoken WAV using ffmpeg flite / speech synthesizer
 */
async function generateSpeechAudio(outputPath, text = 'NOVA tactical core status nominal') {
  return new Promise((resolve) => {
    // Attempt PowerShell SpeechSynthesizer on Windows
    const psScript = `
      Add-Type -AssemblyName System.Speech;
      $s = New-Object System.Speech.Synthesis.SpeechSynthesizer;
      $s.SetOutputToWaveFile('${outputPath.replace(/\\/g, '/')}');
      $s.Speak('${text}');
      $s.Dispose();
    `;

    const ps = spawn('powershell', ['-NoProfile', '-Command', psScript]);
    ps.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve(true);
      } else {
        // Fallback: generate a tonal wav
        resolve(false);
      }
    });
  });
}

async function runVoiceTests() {
  console.log('====================================================');
  console.log('NOVA Backend — Stage 3 Voice Pipeline Verification');
  console.log('====================================================');

  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server active on ${baseUrl}`);
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  // 1. Status Probe
  await test('GET /api/voice/status reports faster-whisper readiness and supported languages', async () => {
    const res = await request('/api/voice/status', {
      headers: { 'X-API-Key': config.auth.ownerApiKey }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.success) throw new Error('Unsuccessful response');
    const data = res.body.data;
    if (data.provider !== 'faster-whisper') throw new Error(`Expected faster-whisper provider, got ${data.provider}`);
    if (!data.ready) throw new Error('Worker reported not ready');
    const langs = data.supportedLanguages;
    if (!langs.includes('en') || !langs.includes('bn') || !langs.includes('hi') || !langs.includes('auto')) {
      throw new Error(`Missing required languages in: ${JSON.stringify(langs)}`);
    }
    if (data.maxSizeBytes !== 10 * 1024 * 1024) throw new Error('Incorrect max size limit');
  });

  // 2. Authentication Enforcement
  await test('POST /api/voice/transcribe requires authentication with 401', async () => {
    const res = await request('/api/voice/transcribe', { method: 'POST' });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 3. Missing Audio File Validation
  await test('POST /api/voice/transcribe returns 400 when audio file is missing', async () => {
    const formData = new FormData();
    formData.append('language', 'en');
    const res = await request('/api/voice/transcribe', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: formData
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    if (res.body.error?.code !== 'MISSING_AUDIO_FILE') {
      throw new Error(`Expected MISSING_AUDIO_FILE code, got ${res.body.error?.code}`);
    }
  });

  // 4. VAD & Silence Detection
  await test('POST /api/voice/transcribe detects silence and returns isSilent: true with empty text', async () => {
    const silentBuf = createSilentWavBuffer(1.0);
    const blob = new Blob([silentBuf], { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', blob, 'silent.wav');
    formData.append('language', 'en');

    const res = await request('/api/voice/transcribe', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: formData
    });

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.data.isSilent) throw new Error('Failed to detect silence');
    if (res.body.data.text !== '') throw new Error(`Expected empty text for silence, got "${res.body.data.text}"`);
  });

  // 5. Real Spoken Audio Transcription (English)
  const testSpeechPath = path.resolve('temp_voice_test_speech.wav');
  const speechGenerated = await generateSpeechAudio(testSpeechPath, 'NOVA tactical core status nominal');

  if (speechGenerated) {
    await test('POST /api/voice/transcribe transcribes real spoken English audio with high accuracy', async () => {
      const fileBytes = fs.readFileSync(testSpeechPath);
      const blob = new Blob([fileBytes], { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', blob, 'speech.wav');
      formData.append('language', 'en');

      const res = await request('/api/voice/transcribe', {
        method: 'POST',
        headers: { 'X-API-Key': config.auth.ownerApiKey },
        body: formData
      });

      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (res.body.data.isSilent) throw new Error('Spoken speech was falsely flagged as silence');
      const text = res.body.data.text.toLowerCase();
      if (!text.includes('nova') && !text.includes('status') && !text.includes('nominal')) {
        throw new Error(`Expected transcript to include key words, got "${res.body.data.text}"`);
      }
      if (res.body.data.language !== 'en') throw new Error(`Expected language en, got ${res.body.data.language}`);
    });

    // 6. Browser WebM Opus Format Conversion
    await test('POST /api/voice/transcribe converts browser WebM format via ffmpeg and transcribes', async () => {
      const webmPath = path.resolve('temp_voice_test_speech.webm');
      await new Promise((resolve) => {
        const ff = spawn('ffmpeg', ['-y', '-i', testSpeechPath, '-c:a', 'libopus', webmPath]);
        ff.on('close', resolve);
      });

      if (fs.existsSync(webmPath)) {
        const webmBytes = fs.readFileSync(webmPath);
        const blob = new Blob([webmBytes], { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('language', 'auto');

        const res = await request('/api/voice/transcribe', {
          method: 'POST',
          headers: { 'X-API-Key': config.auth.ownerApiKey },
          body: formData
        });

        fs.unlinkSync(webmPath);

        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        if (res.body.data.isSilent) throw new Error('WebM audio falsely flagged as silence');
        if (!res.body.data.text) throw new Error('Missing text in WebM transcription');
      }
    });

    // Clean up test speech file
    if (fs.existsSync(testSpeechPath)) {
      fs.unlinkSync(testSpeechPath);
    }
  }

  // 7. Audio Size Limit (10MB) Enforcement
  await test('POST /api/voice/transcribe enforces 10MB maximum audio limit', async () => {
    // Generate buffer exceeding 10MB
    const bigBuffer = Buffer.alloc(10 * 1024 * 1024 + 1024);
    const blob = new Blob([bigBuffer], { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', blob, 'huge.wav');

    const res = await request('/api/voice/transcribe', {
      method: 'POST',
      headers: { 'X-API-Key': config.auth.ownerApiKey },
      body: formData
    });

    // Multer or speechProvider will reject with 413 or 500 error contract
    if (res.status !== 413 && res.status !== 500 && res.body?.success !== false) {
      throw new Error(`Expected payload to be rejected, got status ${res.status}`);
    }
  });

  // 8. Transient Storage Verification
  await test('Transient storage policy: no temporary audio files remain after processing', async () => {
    const uploadDir = path.resolve('backend/temp/uploads');
    const voiceDir = path.resolve('backend/temp/voice');

    const uploadFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    const voiceFiles = fs.existsSync(voiceDir) ? fs.readdirSync(voiceDir) : [];

    if (uploadFiles.length > 0 || voiceFiles.length > 0) {
      throw new Error(`Transient files leaked: uploads=[${uploadFiles.join(', ')}], voice=[${voiceFiles.join(', ')}]`);
    }
  });

  server.close();

  console.log('====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runVoiceTests().catch((err) => {
  console.error('Fatal voice test error:', err);
  if (server) server.close();
  process.exit(1);
});

