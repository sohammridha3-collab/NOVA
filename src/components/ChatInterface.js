/**
 * NOVA — Chat Interface Component
 * Manages conversation stream, safe markdown parsing, anchored composer,
 * speech recognition, and text-to-speech audio feedback.
 */

import { ICONS } from '../utils/icons.js';
import { renderMarkdown } from '../utils/markdown.js';
import { api } from '../services/apiAdapter.js';
import { speech } from '../services/speech.js';
import { storage } from '../services/storage.js';
import { toast } from './Toast.js';

export class ChatInterface {
  constructor({ container, neuralCore, onActivityLogged, onSessionChanged }) {
    this.container = container;
    this.neuralCore = neuralCore;
    this.onActivityLogged = onActivityLogged || (() => {});
    this.onSessionChanged = onSessionChanged || (() => {});

    this.activeSessionId = null;
    this.messages = [];
    this.isStreaming = false;

    // DOM Elements
    this.scrollArea = null;
    this.textarea = null;
    this.btnSend = null;
    this.btnMic = null;
    this.btnStopSpeech = null;

    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
    this._setupSpeechHooks();
    this.loadActiveSession();
  }

  _renderLayout() {
    this.container.innerHTML = `
      <div class="chat-view-container">
        <!-- Scrollable Messages Area -->
        <div class="chat-messages-scroll" id="chatScrollArea">
          <!-- Dynamic messages or welcome screen will be injected here -->
        </div>

        <!-- Anchored Message Composer -->
        <div class="anchored-composer-wrapper">
          <form class="composer-box" id="composerForm">
            <textarea
              class="composer-textarea"
              id="composerTextarea"
              rows="1"
              placeholder="Ask NOVA anything, explore code, or click mic..."
              aria-label="Message input"
            ></textarea>

            <div class="composer-controls">
              <!-- Stop Speech Button (Visible while speaking) -->
              <button
                type="button"
                class="btn-stop-speech"
                id="btnStopSpeech"
                title="Stop voice output"
                aria-label="Stop speech"
              >
                ${ICONS.stop}
                <span>Stop</span>
              </button>

              <!-- Mic Button -->
              <button
                type="button"
                class="icon-btn btn-mic"
                id="btnMic"
                title="Voice input (Speech to Text)"
                aria-label="Toggle voice input"
              >
                ${ICONS.mic}
              </button>

              <!-- Send Button -->
              <button
                type="submit"
                class="icon-btn btn-send"
                id="btnSend"
                title="Send message"
                aria-label="Send message"
                disabled
              >
                ${ICONS.send}
              </button>
            </div>
          </form>

          <div class="composer-footer-note">
            <span>NOVA &bull; Living Intelligence &bull; Simulated local environment</span>
            <span>Enter &crarr; Send &bull; Shift+Enter &crarr; Newline</span>
          </div>
        </div>
      </div>
    `;

    this.scrollArea = this.container.querySelector('#chatScrollArea');
    this.textarea = this.container.querySelector('#composerTextarea');
    this.btnSend = this.container.querySelector('#btnSend');
    this.btnMic = this.container.querySelector('#btnMic');
    this.btnStopSpeech = this.container.querySelector('#btnStopSpeech');
  }

  _bindEvents() {
    const form = this.container.querySelector('#composerForm');

    // Auto-growing textarea
    this.textarea.addEventListener('input', () => {
      this.textarea.style.height = 'auto';
      const newHeight = Math.min(this.textarea.scrollHeight, 120);
      this.textarea.style.height = `${newHeight}px`;
      this.btnSend.disabled = !this.textarea.value.trim() || this.isStreaming;
    });

    // Enter to send, Shift+Enter for newline
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!this.btnSend.disabled) {
          form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.textarea.value.trim();
      if (!text || this.isStreaming) return;

      this.textarea.value = '';
      this.textarea.style.height = 'auto';
      this.btnSend.disabled = true;

      this.sendMessage(text);
    });

    // Microphone toggle button
    this.btnMic.addEventListener('click', () => {
      if (speech.isRecognizing) {
        speech.stopListening();
      } else {
        const started = speech.startListening();
        if (started) {
          toast.info('Listening for speech... Speak into your microphone.');
        }
      }
    });

    // Stop Speech button
    this.btnStopSpeech.addEventListener('click', () => {
      speech.stopSpeaking();
      this.btnStopSpeech.classList.remove('active');
      if (this.neuralCore) this.neuralCore.setState('idle');
      toast.info('Voice output stopped.');
    });

    // Global click delegate for code block copying & starter chips
    this.scrollArea.addEventListener('click', (e) => {
      // Copy code button
      const copyBtn = e.target.closest('.copy-code-btn');
      if (copyBtn) {
        const codeId = copyBtn.getAttribute('data-code-target');
        const codeEl = document.getElementById(codeId);
        if (codeEl) {
          navigator.clipboard.writeText(codeEl.textContent).then(() => {
            const copyText = copyBtn.querySelector('.copy-text');
            if (copyText) copyText.textContent = 'Copied!';
            toast.success('Code copied to clipboard.');
            setTimeout(() => {
              if (copyText) copyText.textContent = 'Copy';
            }, 2000);
          }).catch(() => {
            toast.error('Failed to copy code.');
          });
        }
        return;
      }

      // Starter prompt chips
      const chip = e.target.closest('.starter-chip');
      if (chip) {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          this.sendMessage(prompt);
        }
        return;
      }

      // Read aloud message
      const readBtn = e.target.closest('.btn-speak-msg');
      if (readBtn) {
        const text = readBtn.getAttribute('data-text');
        if (text) {
          const settings = storage.loadSettings();
          speech.speak(text, {
            voiceURI: settings.voiceURI,
            rate: settings.speechRate,
            pitch: settings.speechPitch
          });
        }
        return;
      }
    });
  }

  _setupSpeechHooks() {
    // When browser is listening
    speech.onListeningStateChange = (isListening) => {
      if (isListening) {
        this.btnMic.classList.add('listening');
        if (this.neuralCore) this.neuralCore.setState('listening');
        this.onActivityLogged('Voice input: Listening for acoustic input...');
      } else {
        this.btnMic.classList.remove('listening');
        if (this.neuralCore && this.neuralCore.state === 'listening') {
          this.neuralCore.setState('idle');
        }
      }
    };

    // Real-time transcript incoming
    speech.onTranscript = (transcript, isFinal) => {
      this.textarea.value = transcript;
      this.textarea.style.height = 'auto';
      this.textarea.style.height = `${Math.min(this.textarea.scrollHeight, 120)}px`;
      this.btnSend.disabled = !this.textarea.value.trim();

      if (isFinal) {
        this.onActivityLogged(`Transcript captured: "${transcript.slice(0, 30)}..."`);
      }
    };

    // Speech synthesis state
    speech.onSpeakingStateChange = (isSpeaking) => {
      if (isSpeaking) {
        this.btnStopSpeech.classList.add('active');
        if (this.neuralCore) this.neuralCore.setState('speaking');
        this.onActivityLogged('Voice synthesis: Speaking response...');
      } else {
        this.btnStopSpeech.classList.remove('active');
        if (this.neuralCore && this.neuralCore.state === 'speaking') {
          this.neuralCore.setState('idle');
        }
      }
    };

    speech.onError = (errorMsg) => {
      toast.warning(errorMsg);
      this.onActivityLogged(`Speech event: ${errorMsg}`);
    };
  }

  loadActiveSession() {
    let sessionId = storage.getActiveSessionId();
    let session = sessionId ? storage.getSession(sessionId) : null;

    if (!session) {
      session = storage.createSession();
    }

    this.activeSessionId = session.id;
    this.messages = session.messages || [];
    this.renderMessages();
    this.onSessionChanged(session);
  }

  switchSession(sessionId) {
    const session = storage.getSession(sessionId);
    if (session) {
      storage.setActiveSessionId(sessionId);
      this.activeSessionId = session.id;
      this.messages = session.messages || [];
      this.renderMessages();
      this.onSessionChanged(session);
      this.onActivityLogged(`Switched session: ${session.title}`);
    }
  }

  createNewChat() {
    const newSession = storage.createSession('New Neural Session');
    this.activeSessionId = newSession.id;
    this.messages = [];
    this.renderMessages();
    this.onSessionChanged(newSession);
    this.onActivityLogged('Initialized new chat session');
    toast.success('Started a fresh conversation.');
    this.textarea.focus();
  }

  renderMessages() {
    if (!this.scrollArea) return;

    if (this.messages.length === 0) {
      this._renderWelcomeScreen();
      return;
    }

    this.scrollArea.innerHTML = '';
    this.messages.forEach((msg) => {
      const row = this._createMessageRowElement(msg);
      this.scrollArea.appendChild(row);
    });

    this._scrollToBottom();
  }

  _renderWelcomeScreen() {
    this.scrollArea.innerHTML = `
      <div class="chat-welcome">
        <div class="welcome-badge">
          ${ICONS.sparkles}
          <span>Living Intelligence</span>
        </div>
        <h2 class="welcome-title">
          What shall we <span class="title-accent">create?</span>
        </h2>
        <p class="welcome-desc">
          I am NOVA, your living intelligence workspace. Query technical architecture, explore algorithmic models, craft web interfaces, or command with voice.
        </p>

        <div class="starter-prompts">
          <div class="starter-chip" data-prompt="Create the conceptual design for a luxury Michelin-star restaurant called AURA">
            <div class="chip-title">
              <span>Luxury Restaurant Design</span>
              ${ICONS.studio}
            </div>
            <span class="chip-subtitle">Brand identity, sequence of service, and interactive reservation flow</span>
          </div>

          <div class="starter-chip" data-prompt="Explain Quantum Key Distribution and BB84 protocol with simulation code">
            <div class="chip-title">
              <span>Quantum Cryptography</span>
              ${ICONS.sparkles}
            </div>
            <span class="chip-subtitle">Wavefunction collapse, photon polarization, and security proofs</span>
          </div>

          <div class="starter-chip" data-prompt="Analyze the architecture of a high-throughput event-driven system">
            <div class="chip-title">
              <span>System Architecture</span>
              ${ICONS.cpu}
            </div>
            <span class="chip-subtitle">Kafka streaming, backpressure control, and distributed consensus</span>
          </div>
        </div>
      </div>
    `;
  }

  _createMessageRowElement(msg) {
    const row = document.createElement('div');
    row.className = `message-row ${msg.role}`;

    const timeStr = new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAssistant = msg.role === 'assistant';

    const avatarHtml = isAssistant
      ? `<div class="message-avatar" aria-label="NOVA">${ICONS.assistant}</div>`
      : `<div class="message-avatar" aria-label="User">${ICONS.user}</div>`;

    const metaHtml = isAssistant
      ? `
        <div class="message-meta">
          <span>NOVA CORE</span>
          <span>&bull;</span>
          <span>${timeStr}</span>
          ${msg.simulated ? '<span class="simulated-pill">SIMULATED &bull; LOCAL</span>' : ''}
        </div>
      `
      : `
        <div class="message-meta">
          <span>OPERATOR</span>
          <span>&bull;</span>
          <span>${timeStr}</span>
        </div>
      `;

    const contentHtml = isAssistant ? renderMarkdown(msg.content) : `<p>${this._escapeHtml(msg.content)}</p>`;

    const actionsHtml = isAssistant
      ? `
        <div class="message-actions-toolbar">
          <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(msg.content)}" title="Read message aloud">
            ${ICONS.volume}
            <span>Listen</span>
          </button>
        </div>
      `
      : '';

    row.innerHTML = `
      ${avatarHtml}
      <div class="message-bubble-wrap">
        ${metaHtml}
        <div class="message-bubble">
          ${contentHtml}
        </div>
        ${actionsHtml}
      </div>
    `;

    return row;
  }

  sendMessage(text) {
    if (!text.trim() || this.isStreaming) return;

    if (this.messages.length === 0) {
      this.scrollArea.innerHTML = '';
    }

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    this.messages.push(userMsg);
    storage.updateSessionMessages(this.activeSessionId, this.messages);

    const userRow = this._createMessageRowElement(userMsg);
    this.scrollArea.appendChild(userRow);
    this._scrollToBottom();

    this.onActivityLogged(`Dispatched query: "${text.slice(0, 32)}..."`);

    // Prepare assistant streaming placeholder
    this.isStreaming = true;
    this.btnSend.disabled = true;

    const assistantRow = document.createElement('div');
    assistantRow.className = 'message-row assistant';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    assistantRow.innerHTML = `
      <div class="message-avatar" aria-label="NOVA">${ICONS.assistant}</div>
      <div class="message-bubble-wrap">
        <div class="message-meta">
          <span>NOVA CORE</span>
          <span>&bull;</span>
          <span>${timeStr}</span>
          <span class="simulated-pill">SIMULATED &bull; LOCAL</span>
        </div>
        <div class="message-bubble">
          <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;

    this.scrollArea.appendChild(assistantRow);
    this._scrollToBottom();

    const bubble = assistantRow.querySelector('.message-bubble');

    api.sendMessageStream({
      prompt: text,
      history: this.messages,
      onStartThinking: () => {
        if (this.neuralCore) this.neuralCore.setState('thinking');
        this.onActivityLogged('Artifact state: THINKING (Orbital sequence active)');
      },
      onChunk: (accumulated) => {
        bubble.innerHTML = renderMarkdown(accumulated);
        this._scrollToBottom();
      },
      onComplete: (finalMsg) => {
        this.isStreaming = false;
        this.btnSend.disabled = !this.textarea.value.trim();

        bubble.innerHTML = renderMarkdown(finalMsg.content);

        const wrap = assistantRow.querySelector('.message-bubble-wrap');
        const actions = document.createElement('div');
        actions.className = 'message-actions-toolbar';
        actions.innerHTML = `
          <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(finalMsg.content)}" title="Read message aloud">
            ${ICONS.volume}
            <span>Listen</span>
          </button>
        `;
        wrap.appendChild(actions);

        this.messages.push(finalMsg);
        storage.updateSessionMessages(this.activeSessionId, this.messages);
        this.onSessionChanged(storage.getSession(this.activeSessionId));
        this.onActivityLogged('Response stream complete');

        const settings = storage.loadSettings();
        if (settings.ttsEnabled) {
          speech.speak(finalMsg.content, {
            voiceURI: settings.voiceURI,
            rate: settings.speechRate,
            pitch: settings.speechPitch
          });
        } else {
          if (this.neuralCore) this.neuralCore.setState('idle');
        }
      },
      onError: (err) => {
        this.isStreaming = false;
        this.btnSend.disabled = !this.textarea.value.trim();
        bubble.innerHTML = `<p style="color: var(--status-error);">Error processing response: ${this._escapeHtml(err)}</p>`;
        if (this.neuralCore) this.neuralCore.setState('idle');
        toast.error('Simulation streaming failed.');
      }
    });
  }

  _scrollToBottom() {
    requestAnimationFrame(() => {
      if (this.scrollArea) {
        this.scrollArea.scrollTop = this.scrollArea.scrollHeight;
      }
    });
  }

  _escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
