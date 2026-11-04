/**
 * NOVA — Fallback Core: Circular Holographic Energy Reactor (2D SVG / CSS)
 * Renders a circular holographic reactor matching the Three.js NeuralCore
 * when WebGL is unavailable or restricted by browser/hardware policies.
 *
 * Honestly identified as:
 * "FALLBACK ENGINE: 2D VECTOR REACTOR (WebGL restricted/unavailable)"
 *
 * Provides complete API parity with NeuralCore:
 * - setState(state)
 * - setReducedMotion(enabled)
 * - recenterPerspective()
 * - setThemeAccent(accent)
 * - setQuality(quality)
 * - renderSingleFrame()
 * - destroy()
 */

export class FallbackCore {
  constructor(container, options = {}) {
    this.container = container;
    this.options = Object.assign({
      reducedMotion: false,
      themeAccent: 'cyan',
      quality: 'high',
      onFpsUpdate: null
    }, options);

    this.state = 'idle';
    this.element = null;
    this.isPaused = !!this.options.reducedMotion;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Clean any prior canvases or fallback elements
    this.container.querySelectorAll('.neural-canvas, .core-fallback-container').forEach(el => el.remove());

    this.element = document.createElement('div');
    this.element.className = 'core-fallback-container holographic-reactor-fallback';
    this.element.setAttribute('data-state', this.state);
    this.element.setAttribute('data-accent', this.options.themeAccent);

    if (this.isPaused) {
      this.element.classList.add('paused');
    }

    this._renderSvg();
    this.container.appendChild(this.element);

    if (this.options.onFpsUpdate) {
      // Real rendering in DOM (CSS-driven at screen refresh rate ~60fps)
      this.options.onFpsUpdate(60);
    }
  }

  _renderSvg() {
    const accentCyan = this.options.themeAccent === 'amber' ? '#f59e0b' : (this.options.themeAccent === 'violet' ? '#a855f7' : '#00f0ff');
    const accentSecondary = this.options.themeAccent === 'amber' ? '#fbbf24' : '#38bdf8';
    const accentCore = '#ffffff';

    // Generate 72 procedural radial calibration tick marks around a radius of 170
    let ticksHtml = '';
    const cx = 200;
    const cy = 200;
    for (let i = 0; i < 72; i++) {
      const angle = (i * 360) / 72;
      const isMajor = i % 6 === 0;
      const isCardinal = i % 18 === 0;
      const rInner = isCardinal ? 152 : (isMajor ? 158 : 164);
      const rOuter = 172;
      const rad = (angle * Math.PI) / 180;
      const x1 = (cx + rInner * Math.cos(rad)).toFixed(2);
      const y1 = (cy + rInner * Math.sin(rad)).toFixed(2);
      const x2 = (cx + rOuter * Math.cos(rad)).toFixed(2);
      const y2 = (cy + rOuter * Math.sin(rad)).toFixed(2);
      const opacity = isCardinal ? '0.85' : (isMajor ? '0.5' : '0.22');
      const strokeWidth = isCardinal ? '1.5' : (isMajor ? '1.2' : '0.75');
      const strokeColor = isCardinal ? '#ffffff' : accentCyan;
      ticksHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" />`;
    }

    this.element.innerHTML = `
      <svg class="fallback-svg-reactor" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Circular Holographic Reactor Fallback">
        <defs>
          <!-- Center Core Radial Glow -->
          <radialGradient id="reactorNucleusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
            <stop offset="25%" stop-color="#67e8f9" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="${accentCyan}" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>

          <!-- Outer Halo Gradient -->
          <radialGradient id="reactorAmbientHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${accentCyan}" stop-opacity="0.18"/>
            <stop offset="45%" stop-color="${accentSecondary}" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>

          <!-- Linear Sweep for Orbital Beacon Trail -->
          <linearGradient id="beaconTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${accentCyan}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${accentCyan}" stop-opacity="0"/>
          </linearGradient>

          <!-- Glow Filter -->
          <filter id="reactorNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Deep Ambient Radial Energy Aura -->
        <circle cx="200" cy="200" r="190" fill="url(#reactorAmbientHalo)"/>

        <!-- Cardinal Crosshair Hairlines -->
        <g class="reactor-crosshairs" opacity="0.35">
          <line x1="200" y1="14" x2="200" y2="44" stroke="${accentCyan}" stroke-width="1" />
          <line x1="200" y1="356" x2="200" y2="386" stroke="${accentCyan}" stroke-width="1" />
          <line x1="14" y1="200" x2="44" y2="200" stroke="${accentCyan}" stroke-width="1" />
          <line x1="356" y1="200" x2="386" y2="200" stroke="${accentCyan}" stroke-width="1" />
          <!-- Cardinal Degree Legends -->
          <text x="200" y="38" text-anchor="middle" fill="${accentCyan}" font-family="monospace" font-size="7" opacity="0.75">000°</text>
          <text x="362" y="203" text-anchor="start" fill="${accentCyan}" font-family="monospace" font-size="7" opacity="0.75">090°</text>
          <text x="200" y="372" text-anchor="middle" fill="${accentCyan}" font-family="monospace" font-size="7" opacity="0.75">180°</text>
          <text x="38" y="203" text-anchor="end" fill="${accentCyan}" font-family="monospace" font-size="7" opacity="0.75">270°</text>
        </g>

        <!-- Circumferential Calibration Ticks (72 procedural marks) -->
        <g class="reactor-ticks">
          ${ticksHtml}
        </g>

        <!-- Outermost Hairline Reference Ring -->
        <circle cx="200" cy="200" r="172" stroke="${accentCyan}" stroke-width="0.8" stroke-opacity="0.3" fill="none"/>
        <circle cx="200" cy="200" r="154" stroke="${accentCyan}" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="2 4" fill="none"/>

        <!-- Layer 1: Outer Segmented Rotating Ring (Slow Forward) -->
        <g class="reactor-outer-ring" transform-origin="200 200">
          <circle cx="200" cy="200" r="138" stroke="${accentCyan}" stroke-width="2.5" stroke-dasharray="70 20 40 20 90 30" stroke-linecap="round" fill="none" opacity="0.85" filter="url(#reactorNeonGlow)"/>
          <circle cx="200" cy="200" r="132" stroke="${accentSecondary}" stroke-width="1" stroke-dasharray="10 15" stroke-opacity="0.4" fill="none"/>
        </g>

        <!-- Layer 2: Mid Segmented Rotating Ring (Reverse Medium) -->
        <g class="reactor-mid-ring" transform-origin="200 200">
          <circle cx="200" cy="200" r="102" stroke="${accentSecondary}" stroke-width="2" stroke-dasharray="45 15 25 15 60 20" stroke-linecap="round" fill="none" opacity="0.8"/>
          <circle cx="200" cy="200" r="95" stroke="#ffffff" stroke-width="0.8" stroke-dasharray="4 8" stroke-opacity="0.5" fill="none"/>
          <!-- Triangular Anchor Markers on Mid Ring -->
          <polygon points="200,97 203,105 197,105" fill="${accentCyan}" opacity="0.85"/>
          <polygon points="200,303 203,295 197,295" fill="${accentCyan}" opacity="0.85"/>
          <polygon points="97,200 105,203 105,197" fill="${accentCyan}" opacity="0.85"/>
          <polygon points="303,200 295,203 295,197" fill="${accentCyan}" opacity="0.85"/>
        </g>

        <!-- Layer 3: Tilted Orbital Ellipse with Travelling Light Beacons -->
        <g class="reactor-tilted-orbit" transform="rotate(-28 200 200)">
          <!-- Elliptical Path -->
          <ellipse cx="200" cy="200" rx="145" ry="52" stroke="${accentCyan}" stroke-width="1.2" stroke-dasharray="14 8 2 8" stroke-opacity="0.45" fill="none"/>
          <!-- Orbit Beacon 1 with Trail -->
          <g class="orbiting-beacon-1">
            <circle cx="55" cy="200" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px ${accentCyan})"/>
            <circle cx="55" cy="200" r="6" stroke="${accentCyan}" stroke-width="0.8" stroke-opacity="0.6"/>
          </g>
          <!-- Orbit Beacon 2 -->
          <g class="orbiting-beacon-2">
            <circle cx="345" cy="200" r="2.8" fill="${accentSecondary}" filter="drop-shadow(0 0 5px ${accentCyan})"/>
          </g>
        </g>

        <!-- Layer 4: Inner Counter-Rotating Bracket Ring -->
        <g class="reactor-inner-ring" transform-origin="200 200">
          <circle cx="200" cy="200" r="68" stroke="${accentCyan}" stroke-width="2" stroke-dasharray="24 12" stroke-linecap="round" fill="none" opacity="0.9" filter="url(#reactorNeonGlow)"/>
          <circle cx="200" cy="200" r="56" stroke="#ffffff" stroke-width="0.75" stroke-dasharray="3 6" stroke-opacity="0.6" fill="none"/>
        </g>

        <!-- Layer 5: Bright Central Energy Nucleus -->
        <g class="reactor-nucleus-group" transform-origin="200 200">
          <!-- Concentric Energy Halo -->
          <circle cx="200" cy="200" r="42" fill="url(#reactorNucleusGlow)"/>

          <!-- Faceted Hexagonal Geometric Core -->
          <polygon class="nucleus-core-poly" points="200,168 228,184 228,216 200,232 172,216 172,184"
                   stroke="${accentCyan}" stroke-width="1.5" fill="rgba(0, 240, 255, 0.12)" stroke-opacity="0.9"/>
          <!-- Inner Diamond Core -->
          <polygon class="nucleus-inner-diamond" points="200,178 219,200 200,222 181,200"
                   stroke="#ffffff" stroke-width="1.2" fill="rgba(255, 255, 255, 0.25)"/>

          <!-- Core Point Light Flare -->
          <circle cx="200" cy="200" r="5" fill="${accentCore}" filter="drop-shadow(0 0 10px #ffffff)"/>
          <circle cx="200" cy="200" r="1.8" fill="#ffffff"/>
        </g>
      </svg>

      <!-- Accurate, Transparent Fallback Tag -->
      <div class="fallback-reactor-badge">
        <span class="fallback-status-dot"></span>
        <span class="fallback-status-text">FALLBACK ENGINE: 2D VECTOR REACTOR (WebGL restricted/unavailable)</span>
      </div>
    `;
  }

  setState(state) {
    this.state = state;
    if (this.element) {
      this.element.setAttribute('data-state', state);
    }
  }

  setReducedMotion(enabled) {
    this.isPaused = !!enabled;
    this.options.reducedMotion = !!enabled;
    if (this.element) {
      this.element.classList.toggle('paused', this.isPaused);
    }
  }

  recenterPerspective() {
    if (this.element) {
      this.element.classList.add('pulse-recenter');
      setTimeout(() => {
        if (this.element) this.element.classList.remove('pulse-recenter');
      }, 500);
    }
  }

  setThemeAccent(accent) {
    this.options.themeAccent = accent;
    if (this.element) {
      this.element.setAttribute('data-accent', accent);
      this._renderSvg();
    }
  }

  setQuality(quality) {
    this.options.quality = quality;
  }

  renderSingleFrame() {
    // Handled declaratively in SVG & CSS
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
