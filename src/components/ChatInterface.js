/**
 * NOVA — Chat Interface Component: Holographic Command Centre
 * Manages transmission stream, markdown parsing, code copying,
 * structured action cards (confirm/cancel destructive tasks),
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
        // Cancel speech immediately when user interacts/types
        if (speech.isSpeaking()) {
          speech.stopSpeaking();
        }
        this.textarea.style.height = 'auto';
        const newHeight = Math.min(this.textarea.scrollHeight, 100);
        this.textarea.style.height = `${newHeight}px`;
        this.btnSend.disabled = !this.textarea.value.trim() || this.isStreaming;
      });

      // Enter to send, Shift+Enter for newline
      this.textarea.addEventListener('keydown', (e) => {
        if (speech.isSpeaking()) {
          speech.stopSpeaking();
        }
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

    // Push-to-Talk Microphone toggle button (Stage 3 VAD & faster-whisper)
    if (this.btnMic) {
      this.btnMic.addEventListener('click', async () => {
        if (speech.isRecording) {
          await speech.stopRecording();
        } else {
          const started = await speech.startRecording();
          if (started) {
            const lang = speech.getLanguage().toUpperCase();
            toast.info(`Push-to-Talk active (${lang}): Speak now (click mic again to transcribe)...`);
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

    // Global click delegate inside conversation scroll area
    if (this.scrollArea) {
      this.scrollArea.addEventListener('click', (e) => {
        // 1. Copy code block
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

        // 2. Read aloud message
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

        // 3. Confirm Action button
        const confirmBtn = e.target.closest('.btn-action-confirm');
        if (confirmBtn) {
          const actionId = confirmBtn.getAttribute('data-action-id');
          const token = confirmBtn.getAttribute('data-action-token');
          this._handleConfirmAction(actionId, token, confirmBtn);
          return;
        }

        // 4. Cancel Action button
        const cancelBtn = e.target.closest('.btn-action-cancel');
        if (cancelBtn) {
          const actionId = cancelBtn.getAttribute('data-action-id');
          this._handleCancelAction(actionId, cancelBtn);
          return;
        }
      });
    }
  }

  _setupSpeechHooks() {
    // 1. Pipeline State Synchronization (idle, listening, transcribing, thinking, acting, speaking)
    speech.onStateChange = (state) => {
      if (this.neuralCore) {
        this.neuralCore.setState(state);
      }

      if (this.btnMic) {
        this.btnMic.classList.toggle('recording', state === 'listening');
        this.btnMic.classList.toggle('transcribing', state === 'transcribing');
      }

      if (this.btnStopSpeech) {
        this.btnStopSpeech.classList.toggle('active', state === 'speaking');
      }

      // Live HUD state tag & telemetry logging
      const statusPill = document.getElementById('coreStatusPill');
      if (statusPill) statusPill.setAttribute('data-state', state);

      if (state === 'listening') {
        this.onActivityLogged('Acoustic sensor active: Capturing audio buffer (VAD enabled)...');
      } else if (state === 'transcribing') {
        this.onActivityLogged('Faster-Whisper worker: Transcribing audio stream...');
      } else if (state === 'thinking') {
        this.onActivityLogged('Neural Core: Reasoning across context and tool matrix...');
      } else if (state === 'acting') {
        this.onActivityLogged('Structured Action: Executing authorized tool...');
      } else if (state === 'speaking') {
        this.onActivityLogged('Voice synthesis: Transmitting audio output...');
      }
    };

    // 2. Transcription Decoded (Editable text preview — NEVER auto-submits)
    speech.onTranscription = ({ text, language, confidence }) => {
      if (this.textarea) {
        this.textarea.value = text;
        this.textarea.style.height = 'auto';
        this.textarea.style.height = `${Math.min(this.textarea.scrollHeight, 100)}px`;
        this.textarea.focus();
        if (this.btnSend) this.btnSend.disabled = !this.textarea.value.trim();
      }

      if (this.previewText) {
        this.previewText.textContent = text;
      }

      const langCode = (language || 'auto').toUpperCase();
      const confPct = Math.round((confidence || 0.8) * 100);
      toast.success(`Decoded speech [${langCode} &bull; ${confPct}%]: "${text.slice(0, 36)}..."`);
      this.onActivityLogged(`Transcript decoded [${langCode} &bull; ${confPct}%]: "${text.slice(0, 36)}..."`);
    };

    // 3. Silence / VAD Handling
    speech.onSilenceDetected = (msg) => {
      toast.info(msg);
      this.onActivityLogged(`Voice sensor: ${msg}`);
    };

    // 4. Error Recovery (Denied mic, unsupported audio, server offline)
    speech.onError = (errorMsg, code) => {
      toast.warning(errorMsg);
      this.onActivityLogged(`Voice sensor event [${code || 'WARN'}]: ${errorMsg}`);
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
          No previous transmissions logged in this session. Dispatch a command from the central composer to trigger AI reasoning, notes, reminders, or action workflows.
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
          ${msg.simulated ? '<span class="simulated-pill">SIMULATED &bull; LOCAL</span>' : '<span class="simulated-pill live-pill">LIVE &bull; STAGE 2</span>'}
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

    // Render structured action cards if present
    const actionsCardsHtml = isAssistant && Array.isArray(msg.actions) && msg.actions.length > 0
      ? this._renderActionCardsHtml(msg.actions)
      : '';

    const actionsToolbarHtml = isAssistant
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
          ${actionsCardsHtml}
        </div>
        ${actionsToolbarHtml}
      </div>
    `;

    return row;
  }

  /**
   * Render structured action cards for tool executions
   */
  _renderActionCardsHtml(actions) {
    if (!actions || !Array.isArray(actions) || actions.length === 0) return '';
    return `
      <div class="action-cards-container">
        ${actions.map(act => this._renderSingleActionCardHtml(act)).join('')}
      </div>
    `;
  }

  _renderSingleActionCardHtml(act) {
    const isAwaiting = act.status === 'awaiting_confirmation';
    const isSucceeded = act.status === 'succeeded';
    const isFailed = act.status === 'failed';
    const isCancelled = act.status === 'cancelled';

    let badgeClass = 'status-cyan';
    let statusLabel = act.status.toUpperCase();

    if (isAwaiting) {
      badgeClass = 'status-amber';
      statusLabel = 'CONFIRMATION REQUIRED';
    } else if (isSucceeded) {
      badgeClass = 'status-green';
      statusLabel = 'SUCCEEDED';
    } else if (isFailed) {
      badgeClass = 'status-red';
      statusLabel = 'FAILED';
    } else if (isCancelled) {
      badgeClass = 'status-gray';
      statusLabel = 'CANCELLED';
    }

    let paramsDisplay = '';
    if (act.arguments && Object.keys(act.arguments).length > 0) {
      paramsDisplay = `<div class="action-params-box">` +
        Object.entries(act.arguments).map(([k, v]) => `
          <div class="param-row">
            <span class="param-key">${this._escapeHtml(k)}:</span>
            <span class="param-val">${this._escapeHtml(typeof v === 'object' ? JSON.stringify(v) : String(v))}</span>
          </div>
        `).join('') +
        `</div>`;
    }

    let resultDisplay = '';
    if (isSucceeded && act.result) {
      // Special rendering: Operating System Telemetry
      if (act.toolName === 'getOperatingSystemInfo' && typeof act.result === 'object') {
        const r = act.result;
        resultDisplay = `
          <div class="action-result-box">
            <div class="result-header">HOST SYSTEM TELEMETRY (GENUINE OS MEASUREMENTS):</div>
            <div class="os-telemetry-grid">
              <div class="telemetry-tile">
                <div class="telemetry-label">Host & Platform</div>
                <div class="telemetry-val">${this._escapeHtml(r.hostname || 'Windows Host')} &bull; ${this._escapeHtml(r.platform || 'win32')}</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">OS Version</div>
                <div class="telemetry-val">${this._escapeHtml(r.osType || 'Windows_NT')} ${this._escapeHtml(r.osRelease || '')} (${this._escapeHtml(r.architecture || 'x64')})</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">Processor Core</div>
                <div class="telemetry-val">${this._escapeHtml(r.cpu?.model || 'CPU')} (${r.cpu?.cores || 1} cores)</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">Memory Allocation</div>
                <div class="telemetry-val">${r.memory?.usedGb || 0} GB / ${r.memory?.totalGb || 0} GB (${r.memory?.usedPercentage || 0}%)</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">System Uptime</div>
                <div class="telemetry-val">${this._escapeHtml(r.uptimeFormatted || `${r.uptimeSeconds || 0}s`)}</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">Sensor Telemetry</div>
                <div class="telemetry-val">${new Date(r.systemTime || Date.now()).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        `;
      }
      // Special rendering: Workspace File Search with Ambiguity Detection
      else if (act.toolName === 'searchWorkspaceFiles' && Array.isArray(act.result.candidates)) {
        const cands = act.result.candidates;
        const isAmb = act.result.isAmbiguous;
        resultDisplay = `
          <div class="action-result-box">
            <div class="result-header">WORKSPACE FILE SEARCH [${act.result.totalFound} FOUND]:</div>
            ${isAmb ? '<div class="ambiguous-warning">⚠️ Multiple candidate files match. Specific relative path required:</div>' : ''}
            <div class="action-candidates-list">
              ${cands.map(c => `
                <div class="candidate-item">
                  <span class="candidate-path">📄 ${this._escapeHtml(c.relativePath || c.name)}</span>
                  <span class="candidate-meta">${(c.sizeBytes / 1024).toFixed(1)} KB &bull; ${new Date(c.lastModified).toLocaleDateString()}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        resultDisplay = `
          <div class="action-result-box">
            <div class="result-header">TOOL EXECUTION RESULT:</div>
            <pre class="result-pre">${this._escapeHtml(typeof act.result === 'object' ? JSON.stringify(act.result, null, 2) : String(act.result))}</pre>
          </div>
        `;
      }
    } else if (isFailed) {
      const errorMsg = act.errorMessage || 'Execution encountered an unhandled error.';
      let recoveryGuide = 'Verify system status and operational dependencies.';
      if (act.toolName && ['openConfiguredApp', 'searchWorkspaceFiles', 'openWorkspaceFile', 'createWorkspaceNote', 'deleteWorkspaceFile', 'openWebUrl', 'getOperatingSystemInfo'].includes(act.toolName)) {
        recoveryGuide = 'Ensure local automation agent is running on 127.0.0.1:3002 via "npm run agent:start".';
      } else if (act.toolName && act.toolName.startsWith('android')) {
        recoveryGuide = 'Ensure ADB is installed, and device is connected with USB debugging authorized ("adb devices").';
      } else if (act.toolName && act.toolName.startsWith('hass')) {
        recoveryGuide = 'Check Home Assistant configuration (HASS_BASE_URL, HASS_TOKEN) in backend/.env.';
      } else if (act.toolName && ['saveNote', 'searchNotes', 'deleteNote', 'createReminder', 'listReminders', 'savePersonalMemory', 'deletePersonalMemory'].includes(act.toolName)) {
        recoveryGuide = 'Verify backend database connectivity or run migrations ("npm run db:migrate").';
      }

      resultDisplay = `
        <div class="action-error-box">
          <div class="result-header">EXECUTION FAILED:</div>
          <div class="error-text">${this._escapeHtml(errorMsg)}</div>
          <div class="action-recovery-guide" style="margin-top: 0.45rem; font-size: 0.74rem; color: #fbbf24; border-top: 1px dashed rgba(245, 158, 11, 0.3); padding-top: 0.35rem;">
            <strong>Suggested Recovery:</strong> ${this._escapeHtml(recoveryGuide)}
          </div>
        </div>
      `;
    } else if (isCancelled) {
      resultDisplay = `
        <div class="action-cancelled-box">
          <span>Action was cancelled by operator. No further changes applied.</span>
        </div>
      `;
    }

    // Cancellation notice explaining OS permanence
    const isOsAction = [
      'openConfiguredApp',
      'searchWorkspaceFiles',
      'openWorkspaceFile',
      'createWorkspaceNote',
      'deleteWorkspaceFile',
      'openWebUrl',
      'getOperatingSystemInfo'
    ].includes(act.toolName);

    const cancelNoticeHtml = `
      <div class="action-cancellation-notice">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Cancellation may not undo completed operating-system actions.</span>
      </div>
    `;

    let buttonsHtml = '';
    if (isAwaiting) {
      buttonsHtml = `
        <div class="action-buttons-row">
          <button class="btn-action-confirm" data-action-id="${act.id}" data-action-token="${act.confirmationToken || ''}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            Confirm Execution
          </button>
          <button class="btn-action-cancel" data-action-id="${act.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Cancel
          </button>
        </div>
      `;
    } else if (act.status === 'running') {
      buttonsHtml = `
        <div class="action-buttons-row">
          <button class="btn-action-cancel" data-action-id="${act.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Cancel Action
          </button>
        </div>
      `;
    }

    const logFooter = act.meta?.executionTimeMs ? `
      <div class="action-log-footer">
        <span>⏱️ ${act.meta.executionTimeMs}ms</span>
        <span>&bull;</span>
        <span>${new Date(act.meta.timestamp || act.updatedAt).toLocaleTimeString()}</span>
      </div>
    ` : '';

    return `
      <div class="action-card action-status-${act.status}" id="action-card-${act.id}" data-action-id="${act.id}">
        <div class="action-card-header">
          <div class="action-title-wrap">
            <span class="action-icon">⚡</span>
            <span class="action-tool-name">${this._escapeHtml(act.toolName)}</span>
            ${act.requiresConfirmation ? '<span class="destructive-badge">DESTRUCTIVE</span>' : ''}
            ${isOsAction ? '<span class="os-badge">OS AUTOMATION</span>' : ''}
          </div>
          <span class="action-status-badge ${badgeClass}">${statusLabel}</span>
        </div>
        ${paramsDisplay}
        ${resultDisplay}
        ${cancelNoticeHtml}
        ${buttonsHtml}
        ${logFooter}
      </div>
    `;
  }

  async _handleConfirmAction(actionId, token, buttonEl) {
    if (!actionId || !token) {
      toast.error('Missing confirmation credentials.');
      return;
    }

    const card = document.getElementById(`action-card-${actionId}`);
    if (buttonEl) buttonEl.disabled = true;

    try {
      if (this.neuralCore) this.neuralCore.setState('acting');
      this.onActivityLogged(`Authorizing confirmed action ${actionId.slice(0, 8)}...`);
      const updatedAction = await api.confirmAction(actionId, token);

      toast.success(`Action '${updatedAction.toolName}' confirmed and executed successfully.`);
      this.onActivityLogged(`Action '${updatedAction.toolName}' execution succeeded.`);

      // Update message state
      this._updateActionInMessages(actionId, updatedAction);

      // Re-render this specific action card
      if (card) {
        const parent = card.parentNode;
        const temp = document.createElement('div');
        temp.innerHTML = this._renderSingleActionCardHtml(updatedAction);
        parent.replaceChild(temp.firstElementChild, card);
      }
    } catch (err) {
      toast.error(`Confirmation failed: ${err.message}`);
      if (buttonEl) buttonEl.disabled = false;
    } finally {
      if (this.neuralCore) this.neuralCore.setState('idle');
    }
  }

  async _handleCancelAction(actionId, buttonEl) {
    if (!actionId) return;

    const card = document.getElementById(`action-card-${actionId}`);
    if (buttonEl) buttonEl.disabled = true;

    try {
      const updatedAction = await api.cancelAction(actionId, 'Operator cancelled from command dashboard');
      toast.info(`Action '${updatedAction.toolName}' was cancelled.`);
      this.onActivityLogged(`Action '${updatedAction.toolName}' cancelled by operator.`);

      this._updateActionInMessages(actionId, updatedAction);

      if (card) {
        const parent = card.parentNode;
        const temp = document.createElement('div');
        temp.innerHTML = this._renderSingleActionCardHtml(updatedAction);
        parent.replaceChild(temp.firstElementChild, card);
      }
    } catch (err) {
      toast.error(`Cancel request failed: ${err.message}`);
      if (buttonEl) buttonEl.disabled = false;
    }
  }

  _updateActionInMessages(actionId, updatedAction) {
    for (const msg of this.messages) {
      if (Array.isArray(msg.actions)) {
        const idx = msg.actions.findIndex(a => a.id === actionId);
        if (idx !== -1) {
          msg.actions[idx] = updatedAction;
          break;
        }
      }
    }
    storage.updateSessionMessages(this.activeSessionId, this.messages);
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
            <span class="simulated-pill">${api.isDemoMode ? 'SIMULATED &bull; LOCAL' : 'LIVE &bull; STAGE 2'}</span>
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
      sessionId: this.activeSessionId,
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

        const actionsCardsHtml = Array.isArray(finalMsg.actions) && finalMsg.actions.length > 0
          ? this._renderActionCardsHtml(finalMsg.actions)
          : '';

        if (bubble) {
          bubble.innerHTML = renderMarkdown(finalMsg.content) + actionsCardsHtml;
        }

        if (assistantRow) {
          const pill = assistantRow.querySelector('.simulated-pill');
          if (pill) {
            pill.textContent = finalMsg.simulated ? 'SIMULATED • LOCAL' : 'LIVE • STAGE 2';
            pill.className = finalMsg.simulated ? 'simulated-pill' : 'simulated-pill live-pill';
          }

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
        const shouldSpeak = (settings.ttsEnabled || finalMsg.meta?.forceSpeak || Boolean(finalMsg.meta?.speakText)) && !speech.isMuted;
        if (shouldSpeak) {
          const textToSpeak = finalMsg.meta?.speakText || finalMsg.content;
          const spoke = speech.speak(textToSpeak, {
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
        toast.error(`Execution error: ${err}`);
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
