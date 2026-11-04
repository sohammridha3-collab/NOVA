# NOVA Voice Pipeline Specification (Stage 3)

## 1. Architectural Overview

NOVA's Stage 3 voice architecture combines a **Node.js/Express** main backend, a dedicated **Python `faster-whisper` worker** behind a replaceable speech-provider interface, and a browser-side **push-to-talk audio pipeline** with real-time Voice Activity Detection (VAD).

```
[ User Microphone ]
       │ (Push-to-Talk)
       ▼
[ Web Audio VAD & MediaRecorder ]  <── Cancels TTS synthesis immediately on interruption
       │ (Multipart/Form-Data audio/webm)
       ▼
[ Node.js Backend: POST /api/voice/transcribe ]
       │ (Enforces 10MB size limit, converts via ffmpeg)
       ▼
[ Standalone Python Worker: faster-whisper (CTranslate2) ]
       │ (VAD filter, English/Bengali/Hindi/Auto-detect)
       ▼
[ Editable Text Preview in Composer Area ] ──(User edits & reviews, never auto-submitted)
       │ (Enter / Click Send)
       ▼
[ AI Response & Tool Execution ]
       │
       ▼
[ Browser SpeechSynthesis (TTS) ] ──(Mute, Voice Selection, Rate Velocity, Immediate Stop)
```

---

## 2. Hardware Requirements & Model Selection

`faster-whisper` leverages CTranslate2, delivering 4x faster execution and 2x lower memory overhead compared to standard PyTorch Whisper implementations.

| Model Size | Parameters | Disk Storage | RAM (CPU `int8`) | VRAM (CUDA `float16`) | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`tiny` (Default)** | 39M | ~75 MB | ~200 MB | ~500 MB | Ultra low-latency local execution, nominal accuracy |
| **`base`** | 74M | ~140 MB | ~350 MB | ~1.0 GB | Balanced speed and multi-accent accuracy |
| **`small`** | 244M | ~460 MB | ~1.0 GB | ~2.0 GB | Higher accuracy across complex Hindi/Bengali syntax |
| **`medium`** | 769M | ~1.5 GB | ~3.0 GB | ~5.0 GB | High-fidelity transcription |
| **`large-v3`** | 1550M | ~3.1 GB | ~6.0 GB | ~10.0 GB | Production maximum accuracy |

### Hardware Defaults
- **Device**: `cpu` (default for universal compatibility on any machine without requiring GPU or CUDA drivers).
- **Compute Type**: `int8` (quantized 8-bit integer weights).
- **Environment Configuration**: Set `WHISPER_MODEL=base` and `WHISPER_DEVICE=cuda` in `backend/.env` for GPU acceleration if NVIDIA CUDA is installed.

---

## 3. Multilingual Support & Verification Status

NOVA supports explicit selection of English, Bengali, and Hindi, as well as automatic language detection:

| Language | Code | Pipeline Status | Verified in Stage 3 | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **English** | `en` | Production Ready | **VERIFIED** | Tested with synthetic and browser WebM Opus waveforms; high accuracy. |
| **Bengali** | `bn` | Supported | Supported | Verified model vocabulary and parameter passing. Accuracy depends on chosen model size (`base`+ recommended for colloquial phrasing). |
| **Hindi** | `hi` | Supported | Supported | Verified model vocabulary and parameter passing. Performs best with clear enunciations. |
| **Auto-Detect**| `auto` | Production Ready | **VERIFIED** | Faster-whisper language identification classifier runs before decoding. |

> [!NOTE]
> Stage 3 explicitly focuses on push-to-talk single-turn recording and does not claim perfect multilingual accuracy across noisy environments or dialectal variants. Always-on wake-word listening is intentionally deferred to avoid false triggers and excessive battery/compute consumption.

---

## 4. Voice Activity Detection (VAD) & Silence Handling

1. **Client-Side Silence Filter**: The frontend `AudioContext` monitors real-time Root Mean Square (RMS) energy. Recordings with duration $< 400\text{ms}$ or maximum $\text{RMS} < 0.015$ are flagged as silence immediately and never dispatched to the server.
2. **Server-Side Silero VAD**: Faster-whisper applies `vad_filter=True` with `min_silence_duration_ms=400` and `threshold=0.45`.
3. **Empty Text Guard**: If audio contains only background hum or ambient room silence, the API returns `{ isSilent: true, text: "" }`. The frontend displays a non-intrusive status notice and **never submits blank commands automatically**.

---

## 5. Audio Transience & Security Guarantee

Audio recordings are treated as strictly transient:
- Temporary browser uploads are written to `backend/temp/uploads/`.
- Converted 16kHz mono WAV streams are written to `backend/temp/voice/`.
- **Guaranteed Cleanup**: In `FasterWhisperProvider.transcribe()`, a `finally` block unconditionally unlinks all temporary files immediately after worker execution completes.
- No user voice recordings or audio binaries are ever persisted to MySQL or permanent disk storage.

---

## 6. TTS Output & Immediate Interruption

- **Voice Synthesis Engine**: Browser `window.speechSynthesis` with selectable personas, rate velocity slider ($0.7\times - 1.4\times$), global mute toggle, and manual stop button.
- **Immediate Cancellation**: Starting a new recording, typing into the composer, or clicking the stop button immediately invokes `speechSynthesis.cancel()` and halts the current waveform playback.
- **Replaceable Interface**: Frontend `VoicePipeline` is decoupled from synthesis implementation to permit a drop-in server TTS adapter (e.g. Kokoro, Bark, or ElevenLabs) in future stages.

---

## 7. State Machine

NOVA coordinates 6 distinct core states linked directly to real runtime events:

| State | Visual Indicator | Reactor Dynamics | Event Trigger |
| :--- | :--- | :--- | :--- |
| **`idle`** | `NOMINAL COHERENCE` | Speed: $1.0\times$, Glow: $1.0\times$ | Core waiting for operator input. |
| **`listening`** | `RECORDING` (Red Pulse) | Speed: $1.7\times$, Glow: $1.8\times$ | Microphone active via Push-to-Talk. |
| **`transcribing`** | `TRANSCRIBING` (Cyan Pulse) | Speed: $2.0\times$, Glow: $2.0\times$ | Backend faster-whisper worker decoding audio. |
| **`thinking`** | `EXECUTING REACTION` | Speed: $2.4\times$, Glow: $2.2\times$ | AI model processing conversation prompt. |
| **`acting`** | `EXECUTING TOOL` | Speed: $2.8\times$, Glow: $2.5\times$ | Structured tool / action running or confirmed. |
| **`speaking`** | `TRANSMITTING WAVEFORM` | Speed: $1.2\times$, Glow: $1.9\times$, Pulse: $2.1\times$ | Voice waveform being synthesized. |

