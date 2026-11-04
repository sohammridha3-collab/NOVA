/**
 * NOVA — Master Application Entry Point
 * "NOVA — Living Intelligence"
 * Wires components, state stores, 3D Living Intelligence sculpture, and accessibility features.
 */

import { NeuralCore } from './core/NeuralCore.js';
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
    this.neuralCore = null;
    this.fallbackCore = null;
    this.chat = null;
    this.studio = null;
    this.historyView = null;
    this.settingsModal = null;
    this.navigation = null;

    this.init();
  }

  init() {
    // 1. Load user settings
    const settings = storage.loadSettings();
    if (settings.themeAccent) {
      document.documentElement.setAttribute('data-theme-accent', settings.themeAccent);
    }

    const logActivity = (msg) => {
      // Activity logging hook
    };

    // 2. Initialize Navigation first (Guarantees visible dock on all viewports)
    try {
      const sidebarEl = document.getElementById('appSidebar');
      if (sidebarEl) {
        this.navigation = new Navigation({
          sidebarElement: sidebarEl,
          onViewChange: (view) => this._switchView(view),
          onOpenSettings: () => this._openSettings(),
          onNewChat: () => {
            if (this.chat) this.chat.createNewChat();
          },
          onActivityLogged: logActivity
        });
      }
    } catch (err) {
      console.error('[NOVA] Navigation initialization failed:', err);
    }

    // 3. Initialize Conversation Studio & Anchored Composer
    try {
      const chatContainer = document.getElementById('chatInterfaceContainer');
      if (chatContainer) {
        this.chat = new ChatInterface({
          container: chatContainer,
          neuralCore: null, // Will be attached once 3D mounts
          onActivityLogged: logActivity,
          onSessionChanged: (session) => {
            if (this.historyView) this.historyView.refresh();
          }
        });
      }
    } catch (err) {
      console.error('[NOVA] ChatInterface initialization failed:', err);
    }

    // 4. Initialize Website Studio View
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

    // 5. Initialize Conversation History Archive View
    try {
      const historyContainer = document.getElementById('viewHistory');
      if (historyContainer) {
        this.historyView = new HistoryView({
          container: historyContainer,
          onSelectSession: (sessionId) => {
            if (this.navigation) this.navigation.setActiveView('assistant');
            if (this.chat) this.chat.switchSession(sessionId);
          },
          onNewSession: () => {
            if (this.navigation) this.navigation.setActiveView('assistant');
            if (this.chat) this.chat.createNewChat();
          },
          onActivityLogged: logActivity
        });
      }
    } catch (err) {
      console.error('[NOVA] HistoryView initialization failed:', err);
    }

    // 6. Initialize Settings Modal
    try {
      this.settingsModal = new SettingsModal({
        neuralCore: null,
        onSettingsUpdated: (updated) => {
          if (this.neuralCore) {
            this.neuralCore.setReducedMotion(updated.reducedMotion);
            this._updateReduceEffectsButtons(updated.reducedMotion);
          }
        },
        onActivityLogged: logActivity
      });
    } catch (err) {
      console.error('[NOVA] SettingsModal initialization failed:', err);
    }

    // 7. Initialize 3D Sculpture: "NOVA — Living Intelligence"
    try {
      const stageContainer = document.getElementById('neuralStageContainer');
      if (stageContainer) {
        this.neuralCore = new NeuralCore(stageContainer, {
          reducedMotion: settings.reducedMotion,
          quality: settings.quality,
          themeAccent: settings.themeAccent,
          onFpsUpdate: (fps) => this._onFpsUpdate(fps)
        });

        // Pass neuralCore reference to chat & settings
        if (this.chat) this.chat.neuralCore = this.neuralCore;
        if (this.settingsModal) this.settingsModal.neuralCore = this.neuralCore;
      }
    } catch (err) {
      console.error('[NOVA] 3D NeuralCore initialization failed, rendering fallback:', err);
      const stageContainer = document.getElementById('neuralStageContainer');
      if (stageContainer) {
        this.fallbackCore = new FallbackCore(stageContainer);
      }
    }

    // 8. Wire Header Controls, Stage Interactivity & State Sync
    this._setupHeaderControls();
    this._setupStageInteractivity();
    this._setupCoreStateSync();

    // 9. Hash Routing Support (#assistant, #studio, #history, #settings)
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

    // 10. Deep link query prompt parameter
    const urlParams = new URLSearchParams(window.location.search);
    const autoPrompt = urlParams.get('prompt');
    if (autoPrompt && this.chat) {
      setTimeout(() => {
        this.chat.sendMessage(decodeURIComponent(autoPrompt));
      }, 400);
    }
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
        if (!this.neuralCore) return;
        const isReduced = !this.neuralCore.options.reducedMotion;
        this.neuralCore.setReducedMotion(isReduced);
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

    if (btnRecenter && this.neuralCore) {
      btnRecenter.addEventListener('click', () => {
        this.neuralCore.recenterPerspective();
        toast.info('Sculpture perspective re-centered.');
      });
    }

    if (btnToggleMotion && this.neuralCore) {
      btnToggleMotion.addEventListener('click', () => {
        const isReduced = !this.neuralCore.options.reducedMotion;
        this.neuralCore.setReducedMotion(isReduced);
        storage.saveSettings({ reducedMotion: isReduced });
        this._updateReduceEffectsButtons(isReduced);
        toast.info(isReduced ? '3D Motion paused' : '3D Motion active');
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

    if (!statusPill || !statusText || !this.neuralCore) return;

    const originalSetState = this.neuralCore.setState.bind(this.neuralCore);
    this.neuralCore.setState = (newState) => {
      originalSetState(newState);

      statusPill.setAttribute('data-state', newState);

      switch (newState) {
        case 'idle':
          statusText.textContent = 'LIVING INTELLIGENCE • IDLE';
          break;
        case 'listening':
          statusText.textContent = 'SENSOR • LISTENING';
          break;
        case 'thinking':
          statusText.textContent = 'NEURAL CORE • THINKING';
          break;
        case 'speaking':
          statusText.textContent = 'SYNTHESIS • SPEAKING';
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
}

// Robust boot check: fires immediately if DOM is already ready, or on DOMContentLoaded
function bootNovaApp() {
  try {
    window.novaApp = new NovaApp();
  } catch (err) {
    console.error('[NOVA] Application bootstrap error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootNovaApp);
} else {
  bootNovaApp();
}
