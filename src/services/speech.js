/**
 * NOVA — Speech Recognition & Synthesis Service
 * Provides browser Web Speech API voice input and text-to-speech voice output.
 */

export class SpeechService {
  constructor() {
    this.recognition = null;
    this.isRecognizing = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = false;
    this.voices = [];

    // Callbacks
    this.onListeningStateChange = null; // (boolean)
    this.onSpeakingStateChange = null;  // (boolean)
    this.onTranscript = null;           // (string, isFinal)
    this.onError = null;                // (string)

    this.initRecognition();
    this.initVoices();
  }

  // --------------------------------------------------------------------------
  // Speech Recognition (Voice In)
  // --------------------------------------------------------------------------
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.recognition = null;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecognizing = true;
        if (this.onListeningStateChange) this.onListeningStateChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        if (this.onTranscript) this.onTranscript(text, isFinal);
      };

      this.recognition.onerror = (event) => {
        console.warn('[Speech] Recognition error:', event.error);
        let errorMsg = 'Voice recognition error.';
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            errorMsg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
            break;
          case 'no-speech':
            errorMsg = 'No speech was detected. Tap mic to retry.';
            break;
          case 'network':
            errorMsg = 'Speech recognition network error.';
            break;
          case 'audio-capture':
            errorMsg = 'No microphone was found on this device.';
            break;
          default:
            errorMsg = `Voice recognition error: ${event.error}`;
        }
        if (this.onError) this.onError(errorMsg);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
        if (this.onListeningStateChange) this.onListeningStateChange(false);
      };
    } catch (e) {
      console.warn('[Speech] Failed to initialize SpeechRecognition:', e);
      this.recognition = null;
    }
  }

  isRecognitionSupported() {
    return Boolean(this.recognition);
  }

  startListening() {
    if (!this.recognition) {
      if (this.onError) {
        this.onError('Voice input is not supported in this browser. Please use keyboard input.');
      }
      return false;
    }

    // If currently speaking, stop speech first
    this.stopSpeaking();

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      // In case it was already running
      if (err.name === 'InvalidStateError') {
        this.recognition.stop();
      } else if (this.onError) {
        this.onError('Unable to start speech recognition.');
      }
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isRecognizing) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
    }
    this.isRecognizing = false;
    if (this.onListeningStateChange) this.onListeningStateChange(false);
  }

  // --------------------------------------------------------------------------
  // Speech Synthesis (Voice Out)
  // --------------------------------------------------------------------------
  initVoices() {
    if (!this.synth) return;

    const updateVoices = () => {
      this.voices = this.synth.getVoices();
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
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
  }

  cleanTextForSpeech(raw) {
    if (!raw) return '';
    // Strip code blocks completely for speech
    let text = raw.replace(/```[\s\S]*?```/g, ' [Code omitted for audio] ');
    // Strip inline code
    text = text.replace(/`([^`]+)`/g, '$1');
    // Strip bold/italics
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/\*([^*]+)\*/g, '$1');
    // Strip markdown links
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Strip HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // Clean extra whitespace
    return text.replace(/\s+/g, ' ').trim();
  }

  speak(text, { voiceURI, rate = 1.0, pitch = 1.0 } = {}) {
    if (!this.synth || this.isMuted) return;

    this.stopSpeaking();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      utterance.pitch = Math.max(0.5, Math.min(1.8, pitch));

      if (voiceURI) {
        const selectedVoice = this.getVoices().find(v => v.voiceURI === voiceURI);
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are standard when user clicks stop
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[Speech] Synthesis error:', e);
        }
        this.currentUtterance = null;
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('[Speech] Could not speak text:', e);
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
    }
  }

  stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignored
      }
    }
    this.currentUtterance = null;
    if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
  }

  isSpeaking() {
    return Boolean(this.synth && this.synth.speaking);
  }
}

export const speech = new SpeechService();

