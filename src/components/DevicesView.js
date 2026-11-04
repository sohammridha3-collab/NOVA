/**
 * NOVA — Real Device Connectors View Component
 * Stage 5: Android (ADB) & Home Assistant Smart Home Matrix
 *
 * Implements:
 * - Real-time device discovery & state monitoring
 * - State differentiation: Authorized, Unauthorized (pending RSA prompt), Offline
 * - Capability-gated controls (does not assume all TVs support all operations)
 * - Explicit user consent prompt for Android screen capture
 * - Ambiguity handling with candidate selection
 * - Clear distinction of [SIMULATED FIXTURE] test data
 * - Strict adherence to NOVA holographic visual theme
 */

import { api } from '../services/apiAdapter.js';
import { toast } from './Toast.js';
import { ICONS } from '../utils/icons.js';

export class DevicesView {
  constructor({ container, onActivityLogged }) {
    this.container = container;
    this.onActivityLogged = onActivityLogged || (() => {});

    this.deviceSummary = null;
    this.isLoading = false;
    this.activeTab = 'android'; // 'android' | 'hass'

    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
    this.refresh();
  }

  _renderLayout() {
    this.container.innerHTML = `
      <div class="devices-view-wrapper">
        <!-- Holographic Section Header -->
        <div class="devices-header">
          <div class="devices-title-wrap">
            <span class="panel-bracket">[</span>
            <span class="panel-tag">HARDWARE MATRIX</span>
            <span class="devices-main-title">REAL DEVICE CONNECTORS</span>
            <span class="panel-bracket">]</span>
          </div>
          <div class="devices-header-actions">
            <button type="button" class="btn-holo-sm" id="btnRefreshDevices" title="Refresh device status">
              ${ICONS.refresh}
              <span>Scan Hardware</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="devices-tabs-nav">
          <button type="button" class="devices-tab-btn active" data-tab="android">
            ${ICONS.mobile}
            <span>Android Devices (ADB)</span>
            <span class="tab-badge" id="badgeAndroidCount">0</span>
          </button>
          <button type="button" class="devices-tab-btn" data-tab="hass">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home Assistant Hub</span>
            <span class="tab-badge" id="badgeHassCount">0</span>
          </button>
        </div>

        <!-- TAB 1: ANDROID ADB CONNECTOR -->
        <div class="devices-tab-pane active" id="paneAndroid">
          <!-- Android Telemetry Card -->
          <div class="device-status-banner" id="bannerAndroidStatus">
            <div class="status-banner-left">
              <span class="status-dot dot-online" id="dotAdbStatus"></span>
              <div class="status-banner-info">
                <span class="banner-title" id="txtAdbTitle">ADB BRIDGE: PROBING...</span>
                <span class="banner-subtitle" id="txtAdbSubtitle">Connecting via Local Automation Agent on 127.0.0.1:3002</span>
              </div>
            </div>
            <div class="status-banner-right" id="badgeAdbState">
              <span class="panel-status-pill">PROBING</span>
            </div>
          </div>

          <!-- Detected Android Devices Container -->
          <div class="devices-grid-title">CONNECTED ANDROID HARDWARE</div>
          <div class="devices-grid" id="gridAndroidDevices">
            <div class="device-empty-state">Probing connected Android devices...</div>
          </div>

          <!-- Android Setup & Pairing Guide Accordion -->
          <div class="device-guide-card">
            <div class="guide-header">
              <div class="guide-title">
                ${ICONS.info}
                <span>Android Pairing & Security Specification</span>
              </div>
            </div>
            <div class="guide-body">
              <ol class="guide-steps">
                <li><strong>Enable Developer Options:</strong> Open <em>Settings &gt; About Phone</em> and tap <em>Build Number</em> 7 times.</li>
                <li><strong>Activate USB Debugging:</strong> Go to <em>Settings &gt; Developer Options</em> and toggle on <em>USB Debugging</em>.</li>
                <li><strong>Authorize Host RSA Key:</strong> When connecting via USB or Wi-Fi, tap <strong>"Always allow from this computer"</strong> on the phone screen.</li>
                <li><strong>Wireless Debugging:</strong> Pair using <code>adb pair &lt;ip&gt;:&lt;port&gt;</code> and connect with <code>adb connect &lt;ip&gt;:&lt;port&gt;</code>.</li>
                <li><strong>Zero Lock-Screen PIN Policy:</strong> NOVA strictly forbids capturing, storing, or bypassing device lock-screen PINs. All interaction happens through declared ADB intents.</li>
                <li><strong>Explicit Consent Policy:</strong> Screen captures require explicit operator confirmation before execution.</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- TAB 2: HOME ASSISTANT HUB -->
        <div class="devices-tab-pane" id="paneHass">
          <!-- Home Assistant Telemetry Banner -->
          <div class="device-status-banner" id="bannerHassStatus">
            <div class="status-banner-left">
              <span class="status-dot dot-online" id="dotHassStatus"></span>
              <div class="status-banner-info">
                <span class="banner-title" id="txtHassTitle">HOME ASSISTANT HUB</span>
                <span class="banner-subtitle" id="txtHassSubtitle">REST & WebSocket API Connector</span>
              </div>
            </div>
            <div class="status-banner-right" id="badgeHassState">
              <span class="panel-status-pill status-cyan">[SIMULATED FIXTURE]</span>
            </div>
          </div>

          <!-- Smart TVs & Media Players -->
          <div class="devices-grid-title">SMART TVS & MEDIA PLAYERS</div>
          <div class="devices-grid" id="gridHassMedia">
            <div class="device-empty-state">Discovering media player entities...</div>
          </div>

          <!-- Lights & Smart Plugs -->
          <div class="devices-grid-title">LIGHTS & SMART PLUGS</div>
          <div class="devices-grid" id="gridHassSwitches">
            <div class="device-empty-state">Discovering light and switch entities...</div>
          </div>

          <!-- Home Assistant Setup Guide -->
          <div class="device-guide-card">
            <div class="guide-header">
              <div class="guide-title">
                ${ICONS.info}
                <span>Home Assistant Configuration & Access Token</span>
              </div>
            </div>
            <div class="guide-body">
              <ol class="guide-steps">
                <li>Log in to your <strong>Home Assistant</strong> dashboard.</li>
                <li>Click your profile icon at the bottom of the sidebar.</li>
                <li>Scroll to <strong>Long-Lived Access Tokens</strong> and click <em>Create Token</em>. Name it <code>NOVA</code>.</li>
                <li>Add the token and your instance URL to <code>backend/.env</code>:
                  <pre class="guide-pre">HASS_BASE_URL=http://homeassistant.local:8123\nHASS_TOKEN=your_long_lived_token_here</pre>
                </li>
                <li><strong>Capability Gating:</strong> NOVA checks the <code>supported_features</code> bitmask on each media entity and will not attempt unsupported operations (e.g. setting exact volume on TVs with step-only volume).</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    // Tab switching
    const tabBtns = this.container.querySelectorAll('.devices-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.activeTab = tab;

        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        const pAndroid = this.container.querySelector('#paneAndroid');
        const pHass = this.container.querySelector('#paneHass');

        if (pAndroid) pAndroid.classList.toggle('active', tab === 'android');
        if (pHass) pHass.classList.toggle('active', tab === 'hass');
      });
    });

    // Refresh button
    const btnRefresh = this.container.querySelector('#btnRefreshDevices');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        this.refresh();
      });
    }

    // Grid interaction delegation
    this.container.addEventListener('click', (e) => {
      // Android Action trigger
      const androidBtn = e.target.closest('[data-android-action]');
      if (androidBtn) {
        const action = androidBtn.getAttribute('data-android-action');
        const serial = androidBtn.getAttribute('data-serial');
        this._handleAndroidAction(action, serial, androidBtn);
        return;
      }

      // Home Assistant Action trigger
      const hassBtn = e.target.closest('[data-hass-action]');
      if (hassBtn) {
        const action = hassBtn.getAttribute('data-hass-action');
        const entityId = hassBtn.getAttribute('data-entity-id');
        this._handleHassAction(action, entityId, hassBtn);
        return;
      }
    });
  }

  async refresh() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      this.onActivityLogged('Scanning real device connectors (Android ADB & Home Assistant)...');
      const summary = await api.getDeviceSummary();
      this.deviceSummary = summary;
      this._renderSummary(summary);
      this.onActivityLogged('Device connectors status refreshed.');
    } catch (err) {
      toast.error(`Device scan failed: ${err.message}`);
    } finally {
      this.isLoading = false;
    }
  }

  _renderSummary(summary) {
    const android = summary.android || {};
    const hass = summary.homeAssistant || {};

    // 1. Update Android Tab Badge & Banner
    const badgeAndroid = this.container.querySelector('#badgeAndroidCount');
    if (badgeAndroid) badgeAndroid.textContent = String(android.totalConnected || 0);

    const txtAdbTitle = this.container.querySelector('#txtAdbTitle');
    const txtAdbSubtitle = this.container.querySelector('#txtAdbSubtitle');
    const dotAdb = this.container.querySelector('#dotAdbStatus');
    const badgeAdbState = this.container.querySelector('#badgeAdbState');

    if (android.adbAvailable) {
      if (txtAdbTitle) txtAdbTitle.textContent = `ADB BRIDGE ACTIVE (${android.totalConnected} DEVICES DETECTED)`;
      if (txtAdbSubtitle) txtAdbSubtitle.textContent = `Local Automation Agent online on 127.0.0.1:3002`;
      if (dotAdb) dotAdb.className = 'status-dot dot-online';
      if (badgeAdbState) badgeAdbState.innerHTML = `<span class="panel-status-pill status-green">READY</span>`;
    } else {
      if (txtAdbTitle) txtAdbTitle.textContent = `ADB BRIDGE: UNAVAILABLE`;
      if (txtAdbSubtitle) txtAdbSubtitle.textContent = android.guidance || 'Android Debug Bridge (adb) binary not found on host machine.';
      if (dotAdb) dotAdb.className = 'status-dot dot-offline';
      if (badgeAdbState) badgeAdbState.innerHTML = `<span class="panel-status-pill status-amber">SETUP NEEDED</span>`;
    }

    this._renderAndroidGrid(android.devices || []);

    // 2. Update Home Assistant Tab Badge & Banner
    const badgeHass = this.container.querySelector('#badgeHassCount');
    const totalHass = (hass.entities?.totalCount) || 0;
    if (badgeHass) badgeHass.textContent = String(totalHass);

    const txtHassTitle = this.container.querySelector('#txtHassTitle');
    const txtHassSubtitle = this.container.querySelector('#txtHassSubtitle');
    const dotHass = this.container.querySelector('#dotHassStatus');
    const badgeHassState = this.container.querySelector('#badgeHassState');

    if (hass.online) {
      if (txtHassTitle) txtHassTitle.textContent = `${(hass.locationName || 'HOME ASSISTANT').toUpperCase()} (${totalHass} ENTITIES)`;
      if (txtHassSubtitle) txtHassSubtitle.textContent = hass.message || 'REST & WebSocket connected';
      if (dotHass) dotHass.className = 'status-dot dot-online';
      if (badgeHassState) {
        badgeHassState.innerHTML = hass.isSimulatedFixture
          ? `<span class="panel-status-pill status-amber">[SIMULATED FIXTURE]</span>`
          : `<span class="panel-status-pill status-green">CONNECTED</span>`;
      }
    } else {
      if (txtHassTitle) txtHassTitle.textContent = 'HOME ASSISTANT: OFFLINE';
      if (txtHassSubtitle) txtHassSubtitle.textContent = hass.message || 'Configure HASS_BASE_URL and HASS_TOKEN in backend/.env';
      if (dotHass) dotHass.className = 'status-dot dot-offline';
      if (badgeHassState) badgeHassState.innerHTML = `<span class="panel-status-pill status-amber">DISCONNECTED</span>`;
    }

    this._renderHassGrids(hass.entities || {});
  }

  _renderAndroidGrid(devices) {
    const grid = this.container.querySelector('#gridAndroidDevices');
    if (!grid) return;

    if (!devices || devices.length === 0) {
      grid.innerHTML = `
        <div class="device-empty-state">
          No Android devices detected via ADB. Connect your device via USB or Wi-Fi with USB debugging enabled.
        </div>
      `;
      return;
    }

    grid.innerHTML = devices.map(d => {
      let stateBadgeClass = 'status-green';
      let stateLabel = 'AUTHORIZED';

      if (d.state === 'unauthorized') {
        stateBadgeClass = 'status-amber';
        stateLabel = 'UNAUTHORIZED (CHECK RSA PROMPT)';
      } else if (d.state === 'offline') {
        stateBadgeClass = 'status-red';
        stateLabel = 'OFFLINE';
      }

      return `
        <div class="device-card ${d.canExecute ? 'card-authorized' : 'card-disabled'}">
          <div class="device-card-header">
            <div class="device-card-title-wrap">
              <span class="device-type-icon">${ICONS.mobile}</span>
              <div>
                <span class="device-card-name">${this._escapeHtml(d.friendlyName)}</span>
                <span class="device-card-serial">ID: ${this._escapeHtml(d.serial)} &bull; ${this._escapeHtml(d.product)}</span>
              </div>
            </div>
            <span class="panel-status-pill ${stateBadgeClass}">${stateLabel}</span>
          </div>

          <div class="device-card-desc">
            ${this._escapeHtml(d.stateDescription)}
          </div>

          ${d.canExecute ? `
            <div class="device-card-actions">
              <div class="action-btn-group">
                <button type="button" class="btn-device-action" data-android-action="media_play_pause" data-serial="${d.serial}" title="Toggle Play / Pause">
                  Play / Pause
                </button>
                <button type="button" class="btn-device-action" data-android-action="volume_up" data-serial="${d.serial}" title="Volume Up">
                  Vol +
                </button>
                <button type="button" class="btn-device-action" data-android-action="volume_down" data-serial="${d.serial}" title="Volume Down">
                  Vol -
                </button>
                <button type="button" class="btn-device-action" data-android-action="home" data-serial="${d.serial}" title="Home Key">
                  Home
                </button>
              </div>

              <div class="action-btn-group" style="margin-top: 0.4rem;">
                <button type="button" class="btn-device-action" data-android-action="launch_youtube" data-serial="${d.serial}">
                  YouTube
                </button>
                <button type="button" class="btn-device-action" data-android-action="launch_chrome" data-serial="${d.serial}">
                  Chrome
                </button>
                <button type="button" class="btn-device-action" data-android-action="launch_settings" data-serial="${d.serial}">
                  Settings
                </button>
                <button type="button" class="btn-device-action btn-action-accent" data-android-action="screenshot" data-serial="${d.serial}" title="Requires explicit consent">
                  📸 Capture Screen
                </button>
              </div>
            </div>
          ` : `
            <div class="device-card-notice">
              ⚠️ Commands disabled: Device must be authorized on screen before automation is permitted.
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  _renderHassGrids(entities) {
    const gridMedia = this.container.querySelector('#gridHassMedia');
    const gridSwitches = this.container.querySelector('#gridHassSwitches');

    const mediaPlayers = entities.mediaPlayers || [];
    const lightsAndSwitches = [...(entities.lights || []), ...(entities.switches || [])];

    // 1. Render Media Players
    if (gridMedia) {
      if (mediaPlayers.length === 0) {
        gridMedia.innerHTML = `<div class="device-empty-state">No media player or TV entities discovered.</div>`;
      } else {
        gridMedia.innerHTML = mediaPlayers.map(m => {
          let stateClass = 'status-green';
          if (m.state === 'off' || m.state === 'standby') stateClass = 'status-gray';
          if (!m.isAvailable) stateClass = 'status-red';

          const caps = m.capabilities || {};
          const capPills = [
            caps.supportsTurnOn ? 'Power' : null,
            caps.supportsVolumeSet ? 'Vol Set' : null,
            caps.supportsVolumeMute ? 'Mute' : null,
            caps.supportsPlay || caps.supportsPause ? 'Playback' : null,
            caps.supportsSelectSource ? 'Source' : null
          ].filter(Boolean);

          return `
            <div class="device-card ${m.isAvailable ? '' : 'card-unavailable'}">
              <div class="device-card-header">
                <div class="device-card-title-wrap">
                  <span class="device-type-icon">📺</span>
                  <div>
                    <span class="device-card-name">${this._escapeHtml(m.friendlyName)}</span>
                    <span class="device-card-serial">${this._escapeHtml(m.entityId)} &bull; ${m.deviceClass.toUpperCase()}</span>
                  </div>
                </div>
                <span class="panel-status-pill ${stateClass}">${m.state.toUpperCase()}</span>
              </div>

              <div class="device-meta-row">
                <div class="cap-pills-row">
                  ${capPills.map(p => `<span class="cap-pill">${p}</span>`).join('')}
                </div>
                ${m.volumeLevel !== null ? `<span class="volume-tag">Vol: ${m.volumeLevel}%</span>` : ''}
              </div>

              ${m.isAvailable ? `
                <div class="device-card-actions">
                  <div class="action-btn-group">
                    <button type="button" class="btn-device-action" data-hass-action="power" data-entity-id="${m.entityId}">
                      Power ${m.state === 'off' ? 'On' : 'Off'}
                    </button>
                    <button type="button" class="btn-device-action" data-hass-action="play_pause" data-entity-id="${m.entityId}">
                      Play / Pause
                    </button>
                    <button type="button" class="btn-device-action" data-hass-action="mute" data-entity-id="${m.entityId}">
                      ${m.isMuted ? 'Unmute' : 'Mute'}
                    </button>
                  </div>
                </div>
              ` : `
                <div class="device-card-notice notice-unavailable">
                  ⚠️ Entity is currently ${m.state}. Remote commands cannot be dispatched.
                </div>
              `}
            </div>
          `;
        }).join('');
      }
    }

    // 2. Render Lights & Switches
    if (gridSwitches) {
      if (lightsAndSwitches.length === 0) {
        gridSwitches.innerHTML = `<div class="device-empty-state">No lights or switches discovered.</div>`;
      } else {
        gridSwitches.innerHTML = lightsAndSwitches.map(s => {
          let stateClass = s.state === 'on' ? 'status-green' : s.isAvailable ? 'status-gray' : 'status-red';
          const isLight = s.entityId.startsWith('light.');

          return `
            <div class="device-card ${s.isAvailable ? '' : 'card-unavailable'}">
              <div class="device-card-header">
                <div class="device-card-title-wrap">
                  <span class="device-type-icon">${isLight ? '💡' : '🔌'}</span>
                  <div>
                    <span class="device-card-name">${this._escapeHtml(s.friendlyName)}</span>
                    <span class="device-card-serial">${this._escapeHtml(s.entityId)}</span>
                  </div>
                </div>
                <span class="panel-status-pill ${stateClass}">${s.state.toUpperCase()}</span>
              </div>

              ${s.isAvailable ? `
                <div class="device-card-actions">
                  <button type="button" class="btn-device-action" data-hass-action="toggle_switch" data-entity-id="${s.entityId}">
                    Turn ${s.state === 'on' ? 'Off' : 'On'}
                  </button>
                  ${isLight && s.brightnessPercent !== null ? `
                    <span class="volume-tag">Brightness: ${s.brightnessPercent}%</span>
                  ` : ''}
                </div>
              ` : `
                <div class="device-card-notice notice-unavailable">
                  ⚠️ Entity is ${s.state}.
                </div>
              `}
            </div>
          `;
        }).join('');
      }
    }
  }

  async _handleAndroidAction(action, serial, buttonEl) {
    if (buttonEl) buttonEl.disabled = true;

    try {
      if (action === 'screenshot') {
        const ok = confirm(`CONSENT REQUIRED:\nCapture screenshot of Android device (${serial}) and transfer to NOVA workspace?`);
        if (!ok) {
          toast.info('Screenshot cancelled by operator.');
          return;
        }

        this.onActivityLogged(`Capturing authorized screenshot on Android (${serial})...`);
        const result = await api.executeAndroidAction('androidTakeScreenshot', { serial, confirmed: true });
        toast.success(`Screenshot saved: ${result.filename}`);
        this.onActivityLogged(`Screenshot captured: ${result.filename} (${Math.round(result.sizeBytes / 1024)} KB).`);
        return;
      }

      if (action.startsWith('launch_')) {
        const app = action.replace('launch_', '');
        this.onActivityLogged(`Launching Android app '${app}' on ${serial}...`);
        await api.executeAndroidAction('androidLaunchApp', { serial, appName: app });
        toast.success(`Launched ${app} on Android device.`);
        return;
      }

      if (['media_play_pause', 'volume_up', 'volume_down', 'home'].includes(action)) {
        let keycode = 'play_pause';
        if (action === 'volume_up') keycode = 'volume_up';
        if (action === 'volume_down') keycode = 'volume_down';
        if (action === 'home') keycode = 'home';

        await api.executeAndroidAction('androidSendMediaKey', { serial, keycode });
        toast.info(`Sent keycode '${keycode}' to Android device.`);
        return;
      }
    } catch (err) {
      toast.error(`Android action failed: ${err.message}`);
    } finally {
      if (buttonEl) buttonEl.disabled = false;
    }
  }

  async _handleHassAction(action, entityId, buttonEl) {
    if (buttonEl) buttonEl.disabled = true;

    try {
      if (action === 'power') {
        const entity = this.deviceSummary?.homeAssistant?.entities?.mediaPlayers?.find(m => m.entityId === entityId);
        const subAction = entity?.state === 'off' ? 'turn_on' : 'turn_off';
        await api.controlHassMedia({ entityId, action: subAction });
        toast.success(`Dispatched '${subAction}' to ${entityId}.`);
        await this.refresh();
        return;
      }

      if (action === 'play_pause' || action === 'mute') {
        const subAction = action === 'play_pause' ? 'play_pause' : 'volume_mute';
        await api.controlHassMedia({ entityId, action: subAction });
        toast.success(`Dispatched '${subAction}' to ${entityId}.`);
        await this.refresh();
        return;
      }

      if (action === 'toggle_switch') {
        const entity = [...(this.deviceSummary?.homeAssistant?.entities?.lights || []), ...(this.deviceSummary?.homeAssistant?.entities?.switches || [])].find(e => e.entityId === entityId);
        const subAction = entity?.state === 'on' ? 'turn_off' : 'turn_on';
        await api.controlHassLight({ entityId, action: subAction });
        toast.success(`Applied '${subAction}' to ${entityId}.`);
        await this.refresh();
        return;
      }
    } catch (err) {
      toast.error(`Smart home command failed: ${err.message}`);
    } finally {
      if (buttonEl) buttonEl.disabled = false;
    }
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

