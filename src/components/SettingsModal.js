/**
 * NOVA — System Settings Modal Component
 * Manages audio/TTS, graphics/motion preferences, theme accents, and data management.
 */

import { ICONS } from '../utils/icons.js';
import { storage } from '../services/storage.js';
import { speech } from '../services/speech.js';
import { toast } from './Toast.js';

export class SettingsModal {
  constructor({ neuralCore, onSettingsUpdated, onActivityLogged }) {
    this.neuralCore = neuralCore;
    this.onSettingsUpdated = onSettingsUpdated || (() => {});
    this.onActivityLogged = onActivityLogged || (() => {});

    this.backdrop = null;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.setAttribute('role', 'dialog');
    this.backdrop.setAttribute('aria-modal', 'true');
    this.backdrop.setAttribute('aria-label', 'System Settings');

    this._render();
    document.body.appendChild(this.backdrop);
    this._bindEvents();
  }

  _render() {
    const settings = storage.loadSettings();

    this.backdrop.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${ICONS.settings}
            <span class="modal-title">System Settings</span>
          </div>
          <button class="icon-btn btn-modal-close" aria-label="Close settings">
            ${ICONS.close}
          </button>
        </div>

        <div class="modal-body">
          <!-- Voice & Audio Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${ICONS.volume}
              <span>Speech & Acoustic Synthesis</span>
            </div>

            <!-- Voice Output Toggle -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Voice Output (TTS)</span>
                <span class="setting-desc">Read assistant responses aloud automatically</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="settingTtsToggle" ${settings.ttsEnabled ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Voice Picker -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Synthetic Voice</span>
                <span class="setting-desc">Select active browser synthesis persona</span>
              </div>
              <select class="setting-select" id="settingVoiceSelect">
                <option value="">Default System Voice</option>
              </select>
            </div>

            <!-- Speech Rate Slider -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Speech Velocity</span>
                <span class="setting-desc">Rate multiplier for voice output</span>
              </div>
              <div class="slider-control-group">
                <input
                  type="range"
                  class="setting-range"
                  id="settingSpeechRate"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value="${settings.speechRate || 1.0}"
                />
                <span class="slider-val-tag" id="valSpeechRate">${settings.speechRate || 1.0}x</span>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="button" class="btn-secondary" id="btnTestVoice" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
                ${ICONS.volume}
                <span style="margin-left: 0.35rem;">Test Voice Output</span>
              </button>
            </div>
          </div>

          <!-- Graphics & Animation Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${ICONS.cpu}
              <span>3D Engine & Motion</span>
            </div>

            <!-- Reduced Motion Toggle -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Reduced Motion</span>
                <span class="setting-desc">Disable continuous 3D loop & orbital animation</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="settingReducedMotion" ${settings.reducedMotion ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Theme Accent -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Interface Accent Aura</span>
                <span class="setting-desc">Color wavelength of HUD and Neural Core glow</span>
              </div>
              <select class="setting-select" id="settingThemeAccent">
                <option value="cyan" ${settings.themeAccent === 'cyan' ? 'selected' : ''}>Ice Blue (Default)</option>
                <option value="violet" ${settings.themeAccent === 'violet' ? 'selected' : ''}>Nebula Violet</option>
                <option value="emerald" ${settings.themeAccent === 'emerald' ? 'selected' : ''}>Bioluminescent Emerald</option>
              </select>
            </div>
          </div>

          <!-- Local Storage & Reset Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${ICONS.history}
              <span>Data & Privacy</span>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Export Archive</span>
                <span class="setting-desc">Download all local conversations and preferences as JSON</span>
              </div>
              <button type="button" class="btn-secondary" id="btnExportData">
                ${ICONS.download}
                <span style="margin-left: 0.35rem;">Export JSON</span>
              </button>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Reset Local Data</span>
                <span class="setting-desc">Permanently wipe conversation records and restore defaults</span>
              </div>
              <button type="button" class="btn-danger" id="btnResetData">
                ${ICONS.trash}
                <span>Wipe All</span>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-primary btn-modal-close">
            Done
          </button>
        </div>
      </div>
    `;

    this._populateVoices();
  }

  _populateVoices() {
    const select = this.backdrop.querySelector('#settingVoiceSelect');
    if (!select) return;

    const voices = speech.getVoices();
    const currentVoiceURI = storage.loadSettings().voiceURI;

    select.innerHTML = '<option value="">Default System Voice</option>';
    voices.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      if (v.voiceURI === currentVoiceURI) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });
  }

  _bindEvents() {
    // Close buttons
    const closeBtns = this.backdrop.querySelectorAll('.btn-modal-close');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));

    // Backdrop click close
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    // Keyboard ESC to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // TTS Toggle
    const ttsToggle = this.backdrop.querySelector('#settingTtsToggle');
    ttsToggle.addEventListener('change', (e) => {
      storage.saveSettings({ ttsEnabled: e.target.checked });
      this.onActivityLogged(`Voice output ${e.target.checked ? 'enabled' : 'disabled'}`);
    });

    // Voice Select
    const voiceSelect = this.backdrop.querySelector('#settingVoiceSelect');
    voiceSelect.addEventListener('change', (e) => {
      storage.saveSettings({ voiceURI: e.target.value });
      this.onActivityLogged('Voice persona updated');
    });

    // Speech Rate Slider
    const rateSlider = this.backdrop.querySelector('#settingSpeechRate');
    const rateVal = this.backdrop.querySelector('#valSpeechRate');
    rateSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      rateVal.textContent = `${val.toFixed(2)}x`;
      storage.saveSettings({ speechRate: val });
    });

    // Test Voice
    const testBtn = this.backdrop.querySelector('#btnTestVoice');
    testBtn.addEventListener('click', () => {
      const current = storage.loadSettings();
      speech.speak('NOVA neural audio engine operational. All acoustic parameters calibrated.', {
        voiceURI: current.voiceURI,
        rate: current.speechRate
      });
    });

    // Reduced Motion Toggle
    const motionToggle = this.backdrop.querySelector('#settingReducedMotion');
    motionToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      storage.saveSettings({ reducedMotion: enabled });
      if (this.neuralCore) {
        this.neuralCore.setReducedMotion(enabled);
      }
      this.onActivityLogged(`Reduced motion ${enabled ? 'enabled' : 'disabled'}`);
      toast.info(`3D motion ${enabled ? 'paused' : 'resumed'}.`);
    });

    // Theme Accent
    const themeSelect = this.backdrop.querySelector('#settingThemeAccent');
    themeSelect.addEventListener('change', (e) => {
      const theme = e.target.value;
      storage.saveSettings({ themeAccent: theme });
      document.documentElement.setAttribute('data-theme-accent', theme);
      toast.info(`Theme accent changed to ${theme}.`);
      this.onActivityLogged(`Applied theme accent: ${theme}`);
    });

    // Export Data JSON
    const exportBtn = this.backdrop.querySelector('#btnExportData');
    exportBtn.addEventListener('click', () => {
      const dataStr = storage.exportDataJson();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nova-workspace-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Workspace archive downloaded.');
      this.onActivityLogged('Exported local conversation archive');
    });

    // Reset All Data
    const resetBtn = this.backdrop.querySelector('#btnResetData');
    resetBtn.addEventListener('click', () => {
      const confirmed = window.confirm('DANGER: This will permanently wipe all local sessions, preferences, and reset NOVA to factory state. Proceed?');
      if (confirmed) {
        storage.clearAllData();
        toast.warning('All local data cleared. Refreshing workspace.');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    });
  }

  open() {
    this._populateVoices();
    this.isOpen = true;
    this.backdrop.classList.add('open');
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('open');
    this.onSettingsUpdated(storage.loadSettings());
  }
}

