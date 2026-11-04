/**
 * NOVA — Fallback Core: "NOVA — Living Intelligence" (SVG/CSS Hardware-Accelerated)
 * Renders three interwoven twisted metallic ribbons with illuminated edges and a pearl-white crystal
 * when WebGL is unavailable or fails to initialize.
 */

export class FallbackCore {
  constructor(container) {
    this.container = container;
    this.state = 'idle';
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'core-fallback-container';
    this.element.innerHTML = `
      <svg class="fallback-svg-living" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Pearl Crystal Radial Gradient -->
          <radialGradient id="pearlCrystalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
            <stop offset="40%" stop-color="#e0f2fe" stop-opacity="0.95"/>
            <stop offset="80%" stop-color="#38bdf8" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#040714" stop-opacity="0"/>
          </radialGradient>

          <!-- Titanium Metal Gradient 1 -->
          <linearGradient id="titaniumGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="30%" stop-color="#64748b"/>
            <stop offset="70%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>

          <!-- Titanium Metal Gradient 2 -->
          <linearGradient id="titaniumGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="45%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>

          <!-- Restrained Violet Accent Gradient -->
          <linearGradient id="violetTitaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c084fc"/>
            <stop offset="40%" stop-color="#6b21a8"/>
            <stop offset="80%" stop-color="#3b0764"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>

          <!-- Ground Halo Radial -->
          <radialGradient id="fallbackGroundHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.25"/>
            <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#040714" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Faint Ground Halo -->
        <ellipse cx="130" cy="225" rx="85" ry="16" fill="url(#fallbackGroundHalo)"/>
        <ellipse cx="130" cy="225" rx="60" ry="11" stroke="rgba(0, 240, 255, 0.15)" stroke-width="1" stroke-dasharray="3 4"/>

        <!-- Ribbon 1: Upper Swirling Metallic Ribbon (Cyan Inner Edge) -->
        <g class="fallback-ribbon-1">
          <path d="M 50 140 C 40 70, 110 35, 175 55 C 220 70, 215 130, 160 145 C 115 155, 80 185, 95 210"
                stroke="url(#titaniumGrad1)" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.95"/>
          <path d="M 50 140 C 40 70, 110 35, 175 55 C 220 70, 215 130, 160 145 C 115 155, 80 185, 95 210"
                stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.9" filter="drop-shadow(0 0 4px #00f0ff)"/>
        </g>

        <!-- Ribbon 2: Counter Swirling Metallic Ribbon (Cyan Inner Edge) -->
        <g class="fallback-ribbon-2">
          <path d="M 210 130 C 220 190, 140 220, 85 195 C 40 175, 45 120, 105 105 C 150 95, 180 65, 165 40"
                stroke="url(#titaniumGrad2)" stroke-width="11" stroke-linecap="round" fill="none" opacity="0.95"/>
          <path d="M 210 130 C 220 190, 140 220, 85 195 C 40 175, 45 120, 105 105 C 150 95, 180 65, 165 40"
                stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85" filter="drop-shadow(0 0 4px #38bdf8)"/>
        </g>

        <!-- Ribbon 3: Restrained Violet Interwoven Accent Ribbon -->
        <g class="fallback-ribbon-3">
          <path d="M 70 85 C 120 40, 200 90, 180 160 C 165 215, 95 190, 115 125"
                stroke="url(#violetTitaniumGrad)" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.9"/>
          <path d="M 70 85 C 120 40, 200 90, 180 160 C 165 215, 95 190, 115 125"
                stroke="#a855f7" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85" filter="drop-shadow(0 0 5px #a855f7)"/>
        </g>

        <!-- Center Pearl-White Luminous Crystal -->
        <g class="fallback-crystal" transform="translate(130, 125)">
          <polygon points="0,-24 14,0 0,24 -14,0" fill="url(#pearlCrystalGlow)"/>
          <line x1="0" y1="-24" x2="0" y2="24" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.9"/>
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.8"/>
          <circle cx="0" cy="0" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)"/>
        </g>
      </svg>

      <div class="fallback-notice">
        <span>NOVA Living Intelligence &bull; Procedural Fallback Active</span>
      </div>
    `;

    this.container.appendChild(this.element);
  }

  setState(state) {
    this.state = state;
    if (this.element) {
      this.element.setAttribute('data-state', state);
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
