/**
 * NOVA — Website Studio Component
 * Demonstrates AI Website Generation workflow with a sandboxed preview frame,
 * device viewport switcher, and bundled luxury restaurant showcase.
 */

import { ICONS } from '../utils/icons.js';
import { getRestaurantSampleHtml } from '../templates/restaurantSample.js';
import { toast } from './Toast.js';

export class WebsiteStudio {
  constructor({ container, onActivityLogged }) {
    this.container = container;
    this.onActivityLogged = onActivityLogged || (() => {});
    this.currentDevice = 'desktop'; // 'desktop' | 'tablet' | 'mobile'
    this.sampleHtml = getRestaurantSampleHtml();

    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
    this.loadSample();
  }

  _renderLayout() {
    this.container.innerHTML = `
      <div class="studio-container">
        <!-- Studio Header & Action Bar -->
        <div class="studio-header">
          <div class="studio-title-row">
            <div class="studio-title-wrap">
              <span class="studio-title">Website Studio</span>
              <span class="studio-tag">Autonomous Web Engine</span>
            </div>

            <!-- Responsive Device Viewport Switcher -->
            <div class="studio-device-switcher">
              <button class="device-btn active" data-device="desktop" title="Desktop view (100%)">
                ${ICONS.desktop}
                <span>Desktop</span>
              </button>
              <button class="device-btn" data-device="tablet" title="Tablet view (768px)">
                ${ICONS.tablet}
                <span>Tablet</span>
              </button>
              <button class="device-btn" data-device="mobile" title="Mobile view (390px)">
                ${ICONS.mobile}
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <!-- Description Prompt Input & Primary Preview Button -->
          <div class="studio-prompt-bar">
            <div class="studio-input-wrap">
              ${ICONS.sparkles}
              <input
                type="text"
                class="studio-input"
                id="studioPromptInput"
                value="Design a 3-Michelin-star luxury tasting restaurant website with reservations and celestial branding"
                placeholder="Describe a website to architect and preview..."
                aria-label="Website description prompt"
              />
            </div>
            <button class="btn-preview-sample" id="btnPreviewSample">
              ${ICONS.studio}
              <span>Preview Sample</span>
            </button>
          </div>

          <!-- Suggested Preset Chips -->
          <div class="studio-presets">
            <span class="studio-preset-label">Templates:</span>
            <button class="studio-chip featured" data-sample="aura">
              AURA Gastronomy (Bundled Sample)
            </button>
            <button class="studio-chip" data-sample="cyberpunk">
              Cyberpunk Streetwear (Concept)
            </button>
            <button class="studio-chip" data-sample="nexus">
              NEXUS Quantum Cloud (Concept)
            </button>
          </div>
        </div>

        <!-- Sandboxed Preview Viewport -->
        <div class="studio-preview-viewport">
          <!-- Honest Sample Disclaimer Pill -->
          <div class="sample-disclaimer-pill">
            ${ICONS.info}
            <span>SAMPLE PREVIEW &bull; Curated static showcase demo. Autonomous code compilation connects to Node.js/Express backend.</span>
          </div>

          <!-- Simulated Browser Frame -->
          <div class="browser-mock-frame" id="browserMockFrame" data-device="desktop">
            <div class="browser-mock-topbar">
              <div class="browser-dots">
                <span class="browser-dot red"></span>
                <span class="browser-dot yellow"></span>
                <span class="browser-dot green"></span>
              </div>

              <div class="browser-address-bar">
                <span>https://aura-gastronomy.nova.studio</span>
              </div>

              <div class="browser-actions">
                <button class="browser-btn" id="btnReloadSample" title="Reload sample iframe" aria-label="Reload sample">
                  ${ICONS.refresh}
                </button>
                <button class="browser-btn" id="btnOpenNewTab" title="Open sample in new tab" aria-label="Open in new window">
                  ${ICONS.externalLink}
                </button>
              </div>
            </div>

            <!-- Sandboxed iframe -->
            <iframe
              id="studioIframe"
              class="sample-iframe"
              sandbox="allow-scripts allow-forms allow-modals"
              title="Website Preview"
            ></iframe>
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    const promptInput = this.container.querySelector('#studioPromptInput');
    const previewBtn = this.container.querySelector('#btnPreviewSample');
    const iframe = this.container.querySelector('#studioIframe');
    const mockFrame = this.container.querySelector('#browserMockFrame');
    const reloadBtn = this.container.querySelector('#btnReloadSample');
    const openTabBtn = this.container.querySelector('#btnOpenNewTab');

    // Device Switcher
    const deviceButtons = this.container.querySelectorAll('.device-btn');
    deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        deviceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.getAttribute('data-device');
        this.currentDevice = device;
        mockFrame.setAttribute('data-device', device);
        this.onActivityLogged(`Website Studio viewport switched: ${device.toUpperCase()}`);
      });
    });

    // Preview Sample Button
    previewBtn.addEventListener('click', () => {
      this.loadSample();
      toast.success('Loaded AURA Gastronomy sample showcase.');
      this.onActivityLogged('Website Studio: Rendered bundled restaurant sample');
    });

    // Preset chips
    const chips = this.container.querySelectorAll('.studio-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleType = chip.getAttribute('data-sample');
        if (sampleType === 'aura') {
          promptInput.value = 'Design a 3-Michelin-star luxury tasting restaurant website with reservations and celestial branding';
          this.loadSample();
          toast.info('Viewing bundled AURA Gastronomy showcase.');
        } else if (sampleType === 'cyberpunk') {
          promptInput.value = 'Create a dystopian cyberpunk streetwear storefront with 3D product previews and neon glitch typography';
          toast.info('Concept prompt applied. In production, this invokes live LLM code synthesis.');
        } else if (sampleType === 'nexus') {
          promptInput.value = 'Architect a developer-first quantum cloud computing platform with live latency telemetry';
          toast.info('Concept prompt applied. In production, this invokes live LLM code synthesis.');
        }
      });
    });

    // Reload iframe
    reloadBtn.addEventListener('click', () => {
      this.loadSample();
      toast.info('Sample frame refreshed.');
    });

    // Open in new tab
    openTabBtn.addEventListener('click', () => {
      const blob = new Blob([this.sampleHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      this.onActivityLogged('Opened sample website in new browser tab');
    });
  }

  loadSample() {
    const iframe = this.container.querySelector('#studioIframe');
    if (!iframe) return;

    // Use srcdoc for clean, sandboxed inline injection
    iframe.srcdoc = this.sampleHtml;
  }
}

