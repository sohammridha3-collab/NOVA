/**
 * NOVA — Chat Interface Component: Holographic Command Centre
 * Manages transmission stream, markdown parsing, code copying,
 * latest response preview capsule, expandable conversation drawer,
 * and Web Speech STT/TTS coordination.
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
    this.previewText = null;
    this.previewTimestamp = null;
    this.conversationDrawer = null;
    this.btnExpandDrawer = null;
    this.btnCloseDrawer = null;
    this.btnDrawerExport = null;
    this.drawerMsgCount = null;

    this.init();
  }

  init() {
    this._bindDomElements();
    this._bindEvents();
    this._setupSpeechHooks();
    this.loadActiveSession();
  }

  _bindDomElements() {
    // Look up elements from existing command centre layout
    this.scrollArea = document.getElementById('chatScrollArea');
    this.textarea = document.getElementById('composerTextarea');
    this.btnSend = document.getElementById('btnSend');
    this.btnMic = document.getElementById('btnMic');
    this.btnStopSpeech = document.getElementById('btnStopSpeech');
    this.previewText = document.getElementById('previewText');
    this.previewTimestamp = document.getElementById('previewTimestamp');
    this.conversationDrawer = document.getElementById('conversationDrawer');
    this.btnExpandDrawer = document.getElementById('btnExpandDrawer');
    this.btnCloseDrawer = document.getElementById('btnCloseDrawer');
    this.btnDrawerExport = document.getElementById('btnDrawerExport');
    this.drawerMsgCount = document.getElementById('drawerMsgCount');
  }

  _bindEvents() {
    const form = document.getElementById('composerForm');

    // Drawer expand/close toggles
    if (this.btnExpandDrawer && this.conversationDrawer) {
      this.btnExpandDrawer.addEventListener('click', () => {
        this.openDrawer();
      });
    }

    if (this.btnCloseDrawer && this.conversationDrawer) {
      this.btnCloseDrawer.addEventListener('click', () => {
        this.closeDrawer();
      });
    }

    // Export conversation button
    if (this.btnDrawerExport) {
      this.btnDrawerExport.addEventListener('click', () => {
        this.exportConversation();
      });
    }

    // Auto-growing textarea
    if (this.textarea && this.btnSend) {
      this.textarea.addEventListener('input', () => {
        this.textarea.style.height = 'auto';
        const newHeight = Math.min(this.textarea.scrollHeight, 100);
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
    }

    // Form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.textarea.value.trim();
        if (!text || this.isStreaming) return;

        this.textarea.value = '';
        this.textarea.style.height = 'auto';
        this.btnSend.disabled = true;

        this.sendMessage(text);
      });
    }

    // Microphone toggle button
    if (this.btnMic) {
      this.btnMic.addEventListener('click', () => {
        if (speech.isRecognizing) {
          speech.stopListening();
        } else {
          const started = speech.startListening();
          if (started) {
            toast.info('Acoustic sensor active. Transmitting speech to command processor...');
          }
        }
      });
    }

    // Stop Speech button
    if (this.btnStopSpeech) {
      this.btnStopSpeech.addEventListener('click', () => {
        speech.stopSpeaking();
        this.btnStopSpeech.classList.remove('active');
        if (this.neuralCore) this.neuralCore.setState('idle');
        toast.info('Voice synthesis halted.');
      });
    }

    // Global click delegate for code block copying & starter chips inside drawer
    if (this.scrollArea) {
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
  }

  _setupSpeechHooks() {
    // When browser is listening
    speech.onListeningStateChange = (isListening) => {
      if (isListening) {
        if (this.btnMic) this.btnMic.classList.add('listening');
        if (this.neuralCore) this.neuralCore.setState('listening');
        this.onActivityLogged('Acoustic sensor active: Listening for speech input...');
      } else {
        if (this.btnMic) this.btnMic.classList.remove('listening');
        if (this.neuralCore && this.neuralCore.state === 'listening') {
          this.neuralCore.setState('idle');
        }
      }
    };

    // Real-time transcript incoming
    speech.onTranscript = (transcript, isFinal) => {
      if (this.textarea) {
        this.textarea.value = transcript;
        this.textarea.style.height = 'auto';
        this.textarea.style.height = `${Math.min(this.textarea.scrollHeight, 100)}px`;
        if (this.btnSend) this.btnSend.disabled = !this.textarea.value.trim();
      }

      if (isFinal) {
        this.onActivityLogged(`Transcript decoded: "${transcript.slice(0, 30)}..."`);
      }
    };

    // Speech synthesis state
    speech.onSpeakingStateChange = (isSpeaking) => {
      if (isSpeaking) {
        if (this.btnStopSpeech) this.btnStopSpeech.classList.add('active');
        if (this.neuralCore) this.neuralCore.setState('speaking');
        this.onActivityLogged('Voice synthesis: Transmitting audio output...');
      } else {
        if (this.btnStopSpeech) this.btnStopSpeech.classList.remove('active');
        if (this.neuralCore && this.neuralCore.state === 'speaking') {
          this.neuralCore.setState('idle');
        }
      }
    };

    speech.onError = (errorMsg) => {
      toast.warning(errorMsg);
      this.onActivityLogged(`Acoustic event: ${errorMsg}`);
    };
  }

  openDrawer() {
    if (this.conversationDrawer) {
      this.conversationDrawer.classList.add('open');
      this.conversationDrawer.setAttribute('aria-hidden', 'false');
      this._scrollToBottom();
    }
  }

  closeDrawer() {
    if (this.conversationDrawer) {
      this.conversationDrawer.classList.remove('open');
      this.conversationDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  loadActiveSession() {
    let sessionId = storage.getActiveSessionId();
    let session = sessionId ? storage.getSession(sessionId) : null;

    if (!session) {
      session = storage.createSession('Neural Session Alpha');
    }

    this.activeSessionId = session.id;
    this.messages = session.messages || [];
    this.renderMessages();
    this.onSessionChanged(session);
    this._updatePreviewFromMessages();
  }

  switchSession(sessionId) {
    const session = storage.getSession(sessionId);
    if (session) {
      storage.setActiveSessionId(sessionId);
      this.activeSessionId = session.id;
      this.messages = session.messages || [];
      this.renderMessages();
      this.onSessionChanged(session);
      this._updatePreviewFromMessages();
      this.onActivityLogged(`Operational context shifted to: "${session.title}"`);
    }
  }

  createNewChat() {
    const newSession = storage.createSession('New Command Stream');
    this.activeSessionId = newSession.id;
    this.messages = [];
    this.renderMessages();
    this.onSessionChanged(newSession);
    this._updatePreviewFromMessages();
    this.onActivityLogged('Initialized fresh session stream');
    toast.success('Started a fresh conversation session.');
    if (this.textarea) this.textarea.focus();
  }

  renderMessages() {
    if (!this.scrollArea) return;

    if (this.messages.length === 0) {
      this._renderWelcomeScreen();
    } else {
      this.scrollArea.innerHTML = '';
      this.messages.forEach((msg) => {
        const row = this._createMessageRowElement(msg);
        this.scrollArea.appendChild(row);
      });
      this._scrollToBottom();
    }

    if (this.drawerMsgCount) {
      this.drawerMsgCount.textContent = `${this.messages.length} MESSAGES`;
    }
  }

  _renderWelcomeScreen() {
    this.scrollArea.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.5rem; letter-spacing: 0.08em;">
          // CONVERSATION STREAM INITIALIZED //
        </div>
        <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          No previous transmissions logged in this session. Dispatch a command from the central composer to begin technical architecture synthesis.
        </p>
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

  _updatePreviewFromMessages() {
    if (!this.previewText) return;

    if (this.messages.length === 0) {
      this.previewText.textContent = 'NOVA circular holographic reactor online. Initialize technical architecture, synthesize models, or transmit instructions below.';
      if (this.previewTimestamp) this.previewTimestamp.textContent = 'Nominal';
      return;
    }

    const lastMsg = this.messages[this.messages.length - 1];
    const previewExcerpt = lastMsg.content.replace(/```[\s\S]*?```/g, '[Code Snippet]').replace(/#+\s/g, '').trim();
    this.previewText.textContent = previewExcerpt.slice(0, 160) + (previewExcerpt.length > 160 ? '...' : '');

    if (this.previewTimestamp) {
      const timeStr = new Date(lastMsg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.previewTimestamp.textContent = timeStr;
    }
  }

  sendMessage(text) {
    if (!text.trim() || this.isStreaming) return;

    if (this.messages.length === 0 && this.scrollArea) {
      this.scrollArea.innerHTML = '';
    }

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    this.messages.push(userMsg);
    storage.updateSessionMessages(this.activeSessionId, this.messages);

    if (this.scrollArea) {
      const userRow = this._createMessageRowElement(userMsg);
      this.scrollArea.appendChild(userRow);
      this._scrollToBottom();
    }

    if (this.drawerMsgCount) {
      this.drawerMsgCount.textContent = `${this.messages.length} MESSAGES`;
    }

    this.onActivityLogged(`Command dispatched: "${text.slice(0, 32)}..."`);

    // Prepare assistant streaming placeholder
    this.isStreaming = true;
    if (this.btnSend) this.btnSend.disabled = true;

    if (this.previewText) {
      this.previewText.textContent = 'Synthesizing response through holographic reactor core...';
    }
    if (this.previewTimestamp) {
      this.previewTimestamp.textContent = 'Calculating';
    }

    let assistantRow = null;
    let bubble = null;

    if (this.scrollArea) {
      assistantRow = document.createElement('div');
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
      bubble = assistantRow.querySelector('.message-bubble');
    }

    api.sendMessageStream({
      prompt: text,
      history: this.messages,
      onStartThinking: () => {
        if (this.neuralCore) this.neuralCore.setState('thinking');
        this.onActivityLogged('Reactor state: THINKING (Ring velocities accelerating)');
      },
      onChunk: (accumulated) => {
        if (bubble) {
          bubble.innerHTML = renderMarkdown(accumulated);
          this._scrollToBottom();
        }
        if (this.previewText) {
          const clean = accumulated.replace(/```[\s\S]*?```/g, '[Code Snippet]').replace(/#+\s/g, '').trim();
          this.previewText.textContent = clean.slice(0, 160) + (clean.length > 160 ? '...' : '');
        }
      },
      onComplete: (finalMsg) => {
        this.isStreaming = false;
        if (this.btnSend && this.textarea) {
          this.btnSend.disabled = !this.textarea.value.trim();
        }

        if (bubble) {
          bubble.innerHTML = renderMarkdown(finalMsg.content);
        }

        if (assistantRow) {
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
        }

        this.messages.push(finalMsg);
        storage.updateSessionMessages(this.activeSessionId, this.messages);
        this.onSessionChanged(storage.getSession(this.activeSessionId));
        this._updatePreviewFromMessages();
        this.onActivityLogged('Transmission complete: Response synthesized');

        if (this.drawerMsgCount) {
          this.drawerMsgCount.textContent = `${this.messages.length} MESSAGES`;
        }

        const settings = storage.loadSettings();
        if (settings.ttsEnabled && !speech.isMuted) {
          const spoke = speech.speak(finalMsg.content, {
            voiceURI: settings.voiceURI,
            rate: settings.speechRate,
            pitch: settings.speechPitch
          });
          if (!spoke && this.neuralCore) {
            this.neuralCore.setState('idle');
          }
        } else {
          if (this.neuralCore) this.neuralCore.setState('idle');
        }
      },
      onError: (err) => {
        this.isStreaming = false;
        if (this.btnSend && this.textarea) {
          this.btnSend.disabled = !this.textarea.value.trim();
        }
        if (bubble) {
          bubble.innerHTML = `<p style="color: var(--status-error);">Error processing response: ${this._escapeHtml(err)}</p>`;
        }
        if (this.neuralCore) this.neuralCore.setState('idle');
        toast.error('Simulation streaming failed.');
      }
    });
  }

  exportConversation() {
    if (this.messages.length === 0) {
      toast.info('No messages to export in current session.');
      return;
    }

    const session = storage.getSession(this.activeSessionId);
    const title = session ? session.title : 'NOVA_Transmission';
    const jsonStr = JSON.stringify(this.messages, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Conversation exported to JSON.');
    this.onActivityLogged(`Exported session: "${title}"`);
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
