/**
 * NOVA — Right Diagnostic Drawer & Quiet Bottom Strip Controller
 * Feeds the quiet editorial bottom status strip and controls the detailed slide-out diagnostics panel.
 */

import { ICONS } from '../utils/icons.js';
import { toast } from './Toast.js';

export class RightPanel {
  constructor({ container, neuralCore, onClearChat }) {
    this.container = container;
    this.neuralCore = neuralCore;
    this.onClearChat = onClearChat || (() => {});

    this.logs = [];
    this.activeSessionTitle = 'New Neural Session';
    this.messageCount = 0;

    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
    this.logActivity('The NOVA Artifact observatory initialized');
    this.logActivity('Precision metallic segments & crystal core calibrated');
  }

  _renderLayout() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">
          ${ICONS.cpu}
          <span>Diagnostics Telemetry</span>
        </div>
        <button class="icon-btn" id="btnCloseRightPanel" title="Close diagnostics drawer" aria-label="Close telemetry">
          ${ICONS.close}
        </button>
      </div>

      <div class="panel-content">
        <!-- Live Hardware & Artifact Telemetry -->
        <div class="telemetry-card">
          <div class="telemetry-header">
            <span>Entity Diagnostics</span>
            <span class="telemetry-badge-live">
              <span class="live-dot"></span>
              <span>LIVE</span>
            </span>
          </div>

          <div class="metric-grid">
            <div class="metric-item">
              <div class="metric-label">FPS Performance</div>
              <div class="metric-value cyan" id="telemetryFps">60</div>
            </div>

            <div class="metric-item">
              <div class="metric-label">Artifact State</div>
              <div class="metric-value" id="telemetryState">IDLE</div>
            </div>

            <div class="metric-item">
              <div class="metric-label">Shell Segments</div>
              <div class="metric-value" id="telemetrySegments">6 Plates</div>
            </div>

            <div class="metric-item">
              <div class="metric-label">Beacon Orbit</div>
              <div class="metric-value amber" id="telemetryOrbit">2.65 AU</div>
            </div>
          </div>
        </div>

        <!-- Active Context & Task Details -->
        <div class="telemetry-card">
          <div class="telemetry-header">
            <span>Context Telemetry</span>
            <span>V2.4</span>
          </div>

          <div class="context-list">
            <div class="context-row">
              <span class="context-key">Session:</span>
              <span class="context-val" id="telemetrySessionTitle">New Neural Session</span>
            </div>
            <div class="context-row">
              <span class="context-key">Exchange Turns:</span>
              <span class="context-val" id="telemetryTurnCount">0 messages</span>
            </div>
            <div class="context-row">
              <span class="context-key">Engine Mode:</span>
              <span class="context-val" style="color: #fbbf24;">Simulated (Local)</span>
            </div>
            <div class="context-row">
              <span class="context-key">Backend Target:</span>
              <span class="context-val" title="Node/Express target">localhost:5000/api</span>
            </div>
          </div>
        </div>

        <!-- System Event Log Stream -->
        <div class="telemetry-card">
          <div class="telemetry-header">
            <span>Observatory Event Log</span>
            <span class="hud-hint" id="logCountLabel">0 events</span>
          </div>

          <div class="activity-log-stream" id="activityLogStream">
            <!-- Dynamic log entries injected here -->
          </div>
        </div>

        <!-- Quick Utility Actions -->
        <div class="panel-actions">
          <button class="panel-action-btn" id="btnResetCoreTilt">
            ${ICONS.refresh}
            <span>Recenter Artifact Perspective</span>
          </button>

          <button class="panel-action-btn" id="btnSnapshotCore">
            ${ICONS.camera}
            <span>Capture High-Res Visual (PNG)</span>
          </button>

          <button class="panel-action-btn" id="btnClearActiveChat">
            ${ICONS.trash}
            <span>Clear Conversation Thread</span>
          </button>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    const btnClose = this.container.querySelector('#btnCloseRightPanel');
    const btnResetCore = this.container.querySelector('#btnResetCoreTilt');
    const btnSnapshot = this.container.querySelector('#btnSnapshotCore');
    const btnClear = this.container.querySelector('#btnClearActiveChat');

    // Bottom strip quick buttons
    const stripClear = document.getElementById('stripBtnClear');
    const stripSnapshot = document.getElementById('stripBtnSnapshot');
    const stripTelemetry = document.getElementById('stripBtnTelemetry');

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.container.classList.remove('open');
      });
    }

    // Toggle telemetry from bottom strip
    if (stripTelemetry) {
      stripTelemetry.addEventListener('click', () => {
        this.container.classList.toggle('open');
      });
    }

    // Reset core tilt
    const handleReset = () => {
      if (this.neuralCore) {
        this.neuralCore.resetOrientation();
        toast.info('Artifact perspective re-centered.');
        this.logActivity('Re-centered 3D perspective orientation');
      }
    };
    if (btnResetCore) btnResetCore.addEventListener('click', handleReset);

    // Snapshot
    const handleSnapshot = () => {
      try {
        const canvas = document.querySelector('.neural-canvas');
        if (!canvas) {
          toast.warning('3D Canvas not found.');
          return;
        }

        if (this.neuralCore && this.neuralCore.renderer) {
          this.neuralCore.renderer.render(this.neuralCore.scene, this.neuralCore.camera);
        }

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `nova-artifact-${Date.now()}.png`;
        a.click();
        toast.success('Saved visual snapshot.');
        this.logActivity('Exported high-res visual snapshot');
      } catch (e) {
        toast.error('Unable to capture 3D canvas.');
      }
    };
    if (btnSnapshot) btnSnapshot.addEventListener('click', handleSnapshot);
    if (stripSnapshot) stripSnapshot.addEventListener('click', handleSnapshot);

    // Clear active chat
    const handleClear = () => {
      const confirmed = window.confirm('Clear all messages in the active conversation?');
      if (confirmed) {
        this.onClearChat();
        this.logActivity('Cleared active conversation thread');
        toast.info('Current conversation cleared.');
      }
    };
    if (btnClear) btnClear.addEventListener('click', handleClear);
    if (stripClear) stripClear.addEventListener('click', handleClear);
  }

  updateFps(fps) {
    const el = this.container.querySelector('#telemetryFps');
    if (el) el.textContent = `${fps}`;
  }

  updateCoreTelemetry(data) {
    const stateEl = this.container.querySelector('#telemetryState');
    const segsEl = this.container.querySelector('#telemetrySegments');
    const orbitEl = this.container.querySelector('#telemetryOrbit');

    if (stateEl) stateEl.textContent = (data.state || 'IDLE').toUpperCase();
    if (segsEl) segsEl.textContent = `${data.segments || 6} Plates`;
    if (orbitEl) orbitEl.textContent = `${data.orbitalRadius || '2.65 AU'}`;

    // Update bottom strip status pill text
    const stripStatus = document.getElementById('stripStatusText');
    if (stripStatus) {
      stripStatus.textContent = `ARTIFACT: ${(data.state || 'IDLE').toUpperCase()}`;
    }
  }

  updateSession(session) {
    if (!session) return;
    this.activeSessionTitle = session.title || 'New Neural Session';
    this.messageCount = (session.messages || []).length;

    const titleEl = this.container.querySelector('#telemetrySessionTitle');
    const countEl = this.container.querySelector('#telemetryTurnCount');

    if (titleEl) titleEl.textContent = this.activeSessionTitle;
    if (countEl) countEl.textContent = `${this.messageCount} message${this.messageCount === 1 ? '' : 's'}`;
  }

  logActivity(message) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logs.unshift({ time: timeStr, msg: message });
    if (this.logs.length > 50) this.logs.pop();

    const stream = this.container.querySelector('#activityLogStream');
    const countLabel = this.container.querySelector('#logCountLabel');
    const stripTicker = document.getElementById('stripActivityMsg');

    if (countLabel) countLabel.textContent = `${this.logs.length} events`;
    if (stripTicker) stripTicker.textContent = message;

    if (stream) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = `
        <span class="log-time">[${timeStr}]</span>
        <span class="log-msg">${this._escapeHtml(message)}</span>
      `;
      stream.insertBefore(entry, stream.firstChild);

      while (stream.children.length > 40) {
        stream.removeChild(stream.lastChild);
      }
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
