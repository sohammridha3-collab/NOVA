/**
 * NOVA — Master Application Entry Point
 * "NOVA — Holographic Command Centre"
 *
 * Startup Architecture:
 * - Statically loads essential UI modules (Navigation, Chat, Studio, History, Settings, Fallback).
 * - Mounts the 4 surrounding holographic command panels with live reactive data.
 * - Dynamically imports Three.js 3D NeuralCore in an isolated try/catch.
 * - Mounts FallbackCore (2D SVG Circular Holographic Reactor) seamlessly if WebGL is restricted.
 * - Unified graphics interface guarantees controls always work regardless of engine.
 */

import { FallbackCore } from './core/FallbackCore.js';
import { ChatInterface } from './components/ChatInterface.js';
import { WebsiteStudio } from './components/WebsiteStudio.js';
import { HistoryView } from './components/HistoryView.js';
import { SettingsModal } from './components/SettingsModal.js';
import { Navigation } from './components/Navigation.js';
import { speech } from './services/speech.js';
import { storage } from './services/storage.js';
import { toast } from './components/Toast.js';

class NovaApp {
  constructor() {
    this.activeGraphicsCore = null;
    this.chat = null;
    this.studio = null;
    this.historyView = null;
    this.settingsModal = null;
    this.navigation = null;
    this.telemetryLogs = [];

    this.init();
  }

  async init() {
    // 1. Load and apply user settings
    const settings = storage.loadSettings();
    if (settings.themeAccent) {
      document.documentElement.setAttribute('data-theme-accent', settings.themeAccent);
    }

    // 2. Setup Telemetry Logging Subsystem
    const logActivity = (msg, isHighlight = false) => {
      this._addTelemetryLog(msg, isHighlight);
    };

    logActivity('NOVA Core bootstrap sequence initialized', true);

    // 3. Initialize Navigation first (Guarantees visible dock on all viewports)
    try {
      const sidebarEl = document.getElementById('appSidebar');
      if (sidebarEl) {
        this.navigation = new Navigation({
          sidebarElement: sidebarEl,
          onViewChange: (view) => this._switchView(view),
          onOpenSettings: () => this._openSettings(),
          onNewChat: () => {
            if (this.chat) this.chat.createNewChat();
            this._renderSessionsPanel();
          },
          onActivityLogged: logActivity
        });
      }
    } catch (err) {
      console.error('[NOVA] Navigation initialization failed:', err);
    }

    // 4. Initialize Conversation Studio & Command Composer
    try {
      const viewAssistant = document.getElementById('viewAssistant');
      if (viewAssistant) {
        this.chat = new ChatInterface({
          container: viewAssistant,
          neuralCore: null,
          onActivityLogged: logActivity,
          onSessionChanged: (session) => {
            this._renderSessionsPanel();
            if (this.historyView) this.historyView.refresh();
          }
        });
      }
    } catch (err) {
      console.error('[NOVA] ChatInterface initialization failed:', err);
    }

    // 5. Initialize Website Studio View
    try {
      const studioContainer = document.getElementById('viewStudio');
      if (studioContainer) {
        this.studio = new WebsiteStudio({
          container: studioContainer,
          onActivityLogged: logActivity
        });
      }
    } catch (err) {
      console.error('[NOVA] WebsiteStudio initialization failed:', err);
    }

    // 6. Initialize Conversation History Archive View
    try {
      const historyContainer = document.getElementById('viewHistory');
      if (historyContainer) {
        this.historyView = new HistoryView({
          container: historyContainer,
          onSelectSession: (sessionId) => {
            if (this.navigation) this.navigation.setActiveView('assistant');
            if (this.chat) this.chat.switchSession(sessionId);
            this._renderSessionsPanel();
          },
          onNewSession: () => {
            if (this.navigation) this.navigation.setActiveView('assistant');
            if (this.chat) this.chat.createNewChat();
            this._renderSessionsPanel();
          },
          onActivityLogged: logActivity
        });
      }
    } catch (err) {
      console.error('[NOVA] HistoryView initialization failed:', err);
    }

    // 7. Initialize Settings Modal
    try {
      this.settingsModal = new SettingsModal({
        neuralCore: null,
        onSettingsUpdated: (updated) => {
          if (this.activeGraphicsCore) {
            if (updated.reducedMotion !== undefined) {
              this.activeGraphicsCore.setReducedMotion(updated.reducedMotion);
              this._updateReduceEffectsButtons(updated.reducedMotion);
            }
            if (updated.themeAccent !== undefined) {
              this.activeGraphicsCore.setThemeAccent(updated.themeAccent);
            }
            if (updated.quality !== undefined) {
              this.activeGraphicsCore.setQuality(updated.quality);
            }
          }
        },
        onActivityLogged: logActivity
      });
    } catch (err) {
      console.error('[NOVA] SettingsModal initialization failed:', err);
    }

    // 8. Wire the 4 Surrounding Holographic Panels
    this._wireSurroundingPanels(logActivity);

    // 9. Wire Header Controls & Stage Interactivity
    this._setupHeaderControls();
    this._setupStageInteractivity();

    // 10. Hash Routing Support (#assistant, #studio, #history, #settings)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (['assistant', 'studio', 'history'].includes(hash)) {
        if (this.navigation) this.navigation.setActiveView(hash);
      } else if (hash === 'settings') {
        this._openSettings();
      }
    });

    const initialHash = window.location.hash.replace('#', '');
    if (['assistant', 'studio', 'history'].includes(initialHash)) {
      if (this.navigation) this.navigation.setActiveView(initialHash);
    } else if (initialHash === 'settings') {
      this._openSettings();
    }

    // 11. Deep-link query prompt parameter
    const urlParams = new URLSearchParams(window.location.search);
    const autoPrompt = urlParams.get('prompt');
    if (autoPrompt && this.chat) {
      setTimeout(() => {
        this.chat.sendMessage(decodeURIComponent(autoPrompt));
      }, 400);
    }

    // 12. Dynamically & Resiliently Load Graphics (3D with Three.js or Vector Fallback)
    await this._loadGraphics(settings);
  }

  async _loadGraphics(settings) {
    const stageContainer = document.getElementById('neuralStageContainer');
    if (!stageContainer) return;

    this._addTelemetryLog('Initializing circular holographic energy reactor...', true);

    try {
      // Dynamic import prevents module resolution failures from crashing essential UI
      const { NeuralCore } = await import('./core/NeuralCore.js');

      this.activeGraphicsCore = new NeuralCore(stageContainer, {
        reducedMotion: settings.reducedMotion,
        quality: settings.quality || 'high',
        themeAccent: settings.themeAccent || 'cyan',
        onFpsUpdate: (fps) => this._onFpsUpdate(fps)
      });

      // If Three.js initialized fallback internally due to WebGL unavailability
      if (this.activeGraphicsCore.fallback) {
        this.activeGraphicsCore = this.activeGraphicsCore.fallback;
        this._addTelemetryLog('Graphics: 2D vector fallback active (WebGL restricted)', true);
      } else {
        this._addTelemetryLog('Graphics: WebGL 3D Holographic Reactor online', true);
      }
    } catch (err) {
      console.warn('[NOVA] Dynamic 3D graphics loading failed, mounting vector fallback:', err);
      this._addTelemetryLog('Graphics: Falling back to 2D vector reactor', true);
      this.activeGraphicsCore = new FallbackCore(stageContainer, {
        reducedMotion: settings.reducedMotion,
        themeAccent: settings.themeAccent || 'cyan',
        quality: settings.quality || 'high',
        onFpsUpdate: (fps) => this._onFpsUpdate(fps)
      });
    }

    // Synchronize active graphics engine with Chat & Settings
    if (this.chat) this.chat.neuralCore = this.activeGraphicsCore;
    if (this.settingsModal) this.settingsModal.neuralCore = this.activeGraphicsCore;

    // Attach state synchronization
    this._setupCoreStateSync();
  }

  _wireSurroundingPanels(logActivity) {
    // -------------------------------------------------------------
    // PANEL 1: SESSIONS ARCHIVE
    // -------------------------------------------------------------
    this._renderSessionsPanel();
    const btnNewSession = document.getElementById('btnPanelNewSession');
    if (btnNewSession) {
      btnNewSession.addEventListener('click', () => {
        if (this.chat) this.chat.createNewChat();
        this._renderSessionsPanel();
      });
    }

    // -------------------------------------------------------------
    // PANEL 2: ACOUSTIC SYNTHESIS
    // -------------------------------------------------------------
    const sliderSpeechRate = document.getElementById('sliderSpeechRate');
    const valSpeechRate = document.getElementById('valSpeechRate');
    const selectPersona = document.getElementById('selectVoicePersona');
    const btnTestVoice = document.getElementById('btnTestVoice');
    const btnPanelStop = document.getElementById('btnPanelStopSpeech');

    if (sliderSpeechRate && valSpeechRate) {
      sliderSpeechRate.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(2);
        valSpeechRate.textContent = `${val}x`;
        storage.saveSettings({ speechRate: parseFloat(val) });
      });
    }

    if (btnTestVoice) {
      btnTestVoice.addEventListener('click', () => {
        const settings = storage.loadSettings();
        logActivity('Audio test: Synthesizing diagnostic audio beacon...');
        speech.speak('NOVA holographic acoustic synthesis nominal.', {
          voiceURI: settings.voiceURI,
          rate: settings.speechRate,
          pitch: settings.speechPitch
        });
      });
    }

    if (btnPanelStop) {
      btnPanelStop.addEventListener('click', () => {
        speech.stopSpeaking();
        if (this.activeGraphicsCore) this.activeGraphicsCore.setState('idle');
        toast.info('Voice synthesis stopped.');
        logActivity('Audio: Voice synthesis stopped by operator');
      });
    }

    // -------------------------------------------------------------
    // PANEL 4: COMMAND MATRIX
    // -------------------------------------------------------------
    const btnStudio = document.getElementById('btnMatrixStudio');
    const btnHistory = document.getElementById('btnMatrixHistory');
    const btnSettings = document.getElementById('btnMatrixSettings');
    const btnClear = document.getElementById('btnMatrixClearSession');

    if (btnStudio) {
      btnStudio.addEventListener('click', () => {
        if (this.navigation) this.navigation.setActiveView('studio');
      });
    }

    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        if (this.navigation) this.navigation.setActiveView('history');
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        this._openSettings();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (this.chat) this.chat.createNewChat();
        this._renderSessionsPanel();
        toast.info('Session context reset to default.');
        logActivity('Operational session context reset');
      });
    }
  }

  _renderSessionsPanel() {
    const listEl = document.getElementById('panelSessionList');
    const countEl = document.getElementById('panelSessionCount');
    if (!listEl) return;

    const sessions = storage.getSessions();
    const activeId = storage.getActiveSessionId();

    if (countEl) {
      countEl.textContent = `${sessions.length} SESSIONS LOGGED`;
    }

    listEl.innerHTML = '';

    if (sessions.length === 0) {
      listEl.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 0.64rem; color: var(--text-dim); text-align: center; padding: 1rem 0;">
          NO ARCHIVED SESSIONS
        </div>
      `;
      return;
    }

    sessions.slice(0, 8).forEach((session) => {
      const item = document.createElement('div');
      item.className = `session-item ${session.id === activeId ? 'active' : ''}`;
      
      const timeStr = new Date(session.updatedAt || session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgCount = (session.messages || []).length;

      item.innerHTML = `
        <div class="session-item-main">
          <span class="session-item-title">${this._escapeHtml(session.title)}</span>
          <div class="session-item-meta">
            <span>${msgCount} msgs</span>
            <span>&bull;</span>
            <span>${timeStr}</span>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (this.chat) this.chat.switchSession(session.id);
        this._renderSessionsPanel();
      });

      listEl.appendChild(item);
    });
  }

  _addTelemetryLog(msg, isHighlight = false) {
    const stream = document.getElementById('telemetryLogStream');
    if (!stream) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const line = document.createElement('div');
    line.className = 'telemetry-line';
    line.innerHTML = `
      <span class="telemetry-time">[${timeStr}]</span>
      <span class="telemetry-msg ${isHighlight ? 'highlight' : ''}">${this._escapeHtml(msg)}</span>
    `;

    stream.appendChild(line);
    while (stream.children.length > 40) {
      stream.removeChild(stream.firstChild);
    }
    stream.scrollTop = stream.scrollHeight;
  }

  _openSettings() {
    if (this.settingsModal) {
      this.settingsModal.open();
    }
  }

  _switchView(viewName) {
    const views = {
      assistant: document.getElementById('viewAssistant'),
      studio: document.getElementById('viewStudio'),
      history: document.getElementById('viewHistory')
    };

    Object.keys(views).forEach((key) => {
      if (views[key]) {
        if (key === viewName) {
          views[key].classList.add('active');
        } else {
          views[key].classList.remove('active');
        }
      }
    });

    if (viewName === 'history' && this.historyView) {
      this.historyView.refresh();
    }

    this._addTelemetryLog(`Navigated view: ${viewName.toUpperCase()}`);
  }

  _setupHeaderControls() {
    // Global Mute Toggle
    const btnMute = document.getElementById('btnGlobalMute');
    const iconMute = document.getElementById('iconMute');
    let isMuted = false;

    if (btnMute && iconMute) {
      btnMute.addEventListener('click', () => {
        isMuted = !isMuted;
        speech.setMuted(isMuted);

        if (isMuted) {
          btnMute.classList.add('active');
          iconMute.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line>`;
          toast.info('Voice synthesis muted.');
          if (this.activeGraphicsCore) {
            this.activeGraphicsCore.setState('idle');
          }
        } else {
          btnMute.classList.remove('active');
          iconMute.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>`;
          toast.info('Voice synthesis active.');
        }
      });
    }

    // Direct Header Settings Button
    const btnHeaderSettings = document.getElementById('btnHeaderSettings');
    if (btnHeaderSettings) {
      btnHeaderSettings.addEventListener('click', () => {
        this._openSettings();
      });
    }

    // Reduce Effects / Motion Header Button
    const btnReduceEffects = document.getElementById('btnReduceEffects');
    if (btnReduceEffects) {
      btnReduceEffects.addEventListener('click', () => {
        const isReduced = !(this.activeGraphicsCore && this.activeGraphicsCore.options.reducedMotion);
        if (this.activeGraphicsCore) {
          this.activeGraphicsCore.setReducedMotion(isReduced);
        }
        storage.saveSettings({ reducedMotion: isReduced });
        this._updateReduceEffectsButtons(isReduced);
        toast.info(isReduced ? '3D Motion paused (Reduced motion)' : '3D Motion active');
      });
    }

    // Mobile Hamburger Menu Button
    const btnMobile = document.getElementById('btnMobileMenu');
    const sidebarEl = document.getElementById('appSidebar');
    if (btnMobile && sidebarEl) {
      btnMobile.addEventListener('click', () => {
        sidebarEl.classList.toggle('expanded');
      });
    }

    // Demo Notice Modal
    const btnDemoInfo = document.getElementById('btnDemoInfo');
    const demoModal = document.getElementById('demoNoticeModal');
    const btnCloseDemo = document.getElementById('btnCloseDemoModal');
    const btnDismissDemo = document.getElementById('btnDismissDemoModal');

    if (btnDemoInfo && demoModal) {
      const openDemoModal = () => demoModal.classList.add('open');
      const closeDemoModal = () => demoModal.classList.remove('open');

      btnDemoInfo.addEventListener('click', openDemoModal);
      if (btnCloseDemo) btnCloseDemo.addEventListener('click', closeDemoModal);
      if (btnDismissDemo) btnDismissDemo.addEventListener('click', closeDemoModal);
      demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) closeDemoModal();
      });
    }
  }

  _setupStageInteractivity() {
    const btnRecenter = document.getElementById('btnRecenterCore');
    const btnToggleMotion = document.getElementById('btnToggleMotion');

    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        if (this.activeGraphicsCore) {
          this.activeGraphicsCore.recenterPerspective();
        }
        toast.info('Reactor perspective re-centered.');
        this._addTelemetryLog('Stage: Perspective re-centered');
      });
    }

    if (btnToggleMotion) {
      btnToggleMotion.addEventListener('click', () => {
        const isReduced = !(this.activeGraphicsCore && this.activeGraphicsCore.options.reducedMotion);
        if (this.activeGraphicsCore) {
          this.activeGraphicsCore.setReducedMotion(isReduced);
        }
        storage.saveSettings({ reducedMotion: isReduced });
        this._updateReduceEffectsButtons(isReduced);
        toast.info(isReduced ? 'Reactor motion paused' : 'Reactor motion active');
        this._addTelemetryLog(`Stage: Motion ${isReduced ? 'paused' : 'resumed'}`);
      });
    }
  }

  _updateReduceEffectsButtons(isReduced) {
    const headerLabel = document.getElementById('labelReduceEffects');
    const stageLabel = document.getElementById('motionToggleLabel');
    if (headerLabel) headerLabel.textContent = isReduced ? 'Resume Motion' : 'Pause Motion';
    if (stageLabel) stageLabel.textContent = isReduced ? 'Resume' : 'Pause';
  }

  _setupCoreStateSync() {
    const statusPill = document.getElementById('coreStatusPill');
    const statusText = document.getElementById('coreStatusText');

    if (!statusPill || !statusText || !this.activeGraphicsCore) return;

    const originalSetState = this.activeGraphicsCore.setState.bind(this.activeGraphicsCore);
    this.activeGraphicsCore.setState = (newState) => {
      originalSetState(newState);

      statusPill.setAttribute('data-state', newState);

      switch (newState) {
        case 'idle':
          statusText.textContent = 'REACTOR STATUS • NOMINAL COHERENCE';
          break;
        case 'listening':
          statusText.textContent = 'ACOUSTIC SENSORS • CAPTURING SPEECH';
          break;
        case 'thinking':
          statusText.textContent = 'NEURAL CORE • EXECUTING REACTION';
          break;
        case 'speaking':
          statusText.textContent = 'SYNTHESIS • TRANSMITTING WAVEFORM';
          break;
      }
    };
  }

  _onFpsUpdate(fps) {
    const hudFps = document.getElementById('hudFpsDisplay');
    if (hudFps) {
      hudFps.textContent = fps >= 15 ? `${fps} FPS` : '';
    }
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

// Resilient application bootstrap
function bootNovaApp() {
  try {
    window.novaApp = new NovaApp();
  } catch (err) {
    console.error('[NOVA] Critical application bootstrap failure:', err);
    const notice = document.getElementById('startupErrorNotice');
    if (notice) {
      notice.style.display = 'block';
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootNovaApp);
} else {
  bootNovaApp();
}
