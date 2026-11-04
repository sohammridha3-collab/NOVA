/**
 * NOVA — 3D Central Reactor: "Holographic AI Circular Reactor"
 * Full-screen blue holographic energy reactor featuring:
 * 1. Bright central energy nucleus (luminous core + translucent glass sphere + internal dual-color point lights).
 * 2. Several independently rotating segmented rings with distinct thickness and rotation velocities.
 * 3. Fine procedural calibration ticks and radial technical markings.
 * 4. Tilted orbital assembly creating visible perspective and 3D depth.
 * 5. Moving light trails / photon beacons orbiting along circular paths.
 * 6. Subtle surrounding halo and sparse drifting particles.
 * 7. Reactive states: Idle, Listening, Thinking, Speaking.
 * 8. Real FPS measurement and graceful fallback degradation.
 */

import * as THREE from 'three';
import { FallbackCore } from './FallbackCore.js';

export class NeuralCore {
  /**
   * @param {HTMLElement} container - DOM container element
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = Object.assign({
      reducedMotion: false,
      quality: 'high',
      themeAccent: 'cyan',
      onFpsUpdate: null,
      onStateChange: null
    }, options);

    this.state = 'idle'; // 'idle' | 'listening' | 'thinking' | 'speaking'
    this.isDestroyed = false;
    this.isPaused = !!this.options.reducedMotion;
    this.rafId = null;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.reactorGroup = null;
    this.resizeObserver = null;

    // Reactor Sub-assemblies
    this.nucleusGroup = null;
    this.nucleusMesh = null;
    this.nucleusOrb = null;
    this.nucleusLight = null;

    this.innerRingGroup = null;
    this.midTicksGroup = null;
    this.outerRingGroup = null;
    this.tiltedOrbitGroup = null;
    this.orbitBeacons = [];

    this.groundHalo = null;
    this.particles = null;
    this.particlePositions = null;
    this.particleSpeeds = null;

    // Timing & Animation
    this.animTime = 0;
    this.lastFrameTime = performance.now();

    // Subtle pointer parallax
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Genuine FPS tracking
    this.fpsLastTime = performance.now();
    this.fpsFrames = 0;
    this.measuredFps = 60;

    // State Dynamics
    this.speedMultiplier = 1.0;
    this.pulseMultiplier = 1.0;
    this.glowIntensity = 1.0;

    // Bound Event Handlers
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);

    this.init();
  }

  static isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return false;
      return typeof gl.getParameter === 'function';
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!this.container) return;

    // Clear any previous canvas or fallback in container
    this.container.querySelectorAll('.neural-canvas, .core-fallback-container').forEach(el => el.remove());

    if (!NeuralCore.isWebGLSupported()) {
      console.warn('[NOVA Reactor] WebGL unsupported, mounting 2D holographic fallback.');
      this.fallback = new FallbackCore(this.container, this.options);
      return;
    }

    try {
      this._setupScene();
      this._setupLighting();
      this._buildCentralNucleus();
      this._buildInnerSegmentedRing();
      this._buildCalibrationTicksRing();
      this._buildOuterSegmentedArcs();
      this._buildTiltedOrbitalAssembly();
      this._buildGroundHalo();
      this._buildDriftingParticles();
      this._setupEvents();
      this._onResize();

      // Check system reduced motion
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || this.options.reducedMotion) {
        this.options.reducedMotion = true;
        this.isPaused = true;
      }

      // Render one complete frame immediately
      this.renderSingleFrame();

      if (!this.isPaused && !document.hidden) {
        this._startLoop();
      }
    } catch (err) {
      console.error('[NOVA Reactor] Three.js initialization failed, mounting fallback:', err);
      this._cleanupPartialInit();
      this.fallback = new FallbackCore(this.container, this.options);
    }
  }

  _cleanupPartialInit() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);

    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      this.scene = null;
    }
  }

  /* --------------------------------------------------------------------------
     Scene, Camera & Renderer
     -------------------------------------------------------------------------- */
  _setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.04);

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);
    this.camera.position.set(0, 0, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this._applyDprForQuality();
    this.renderer.setSize(width, height);
    this.renderer.domElement.className = 'neural-canvas';
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    this.container.appendChild(this.renderer.domElement);

    this.reactorGroup = new THREE.Group();
    // Tilted slightly on X/Y to give 3D perspective and depth
    this.reactorGroup.rotation.set(0.18, -0.12, 0);
    this.scene.add(this.reactorGroup);
  }

  _applyDprForQuality() {
    if (!this.renderer) return;
    const dprMax = this.options.quality === 'low' ? 1.0 : (this.options.quality === 'medium' ? 1.5 : 2.0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
  }

  /* --------------------------------------------------------------------------
     Lighting Setup
     -------------------------------------------------------------------------- */
  _setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x060f26, 1.2);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 4, 5);
    this.scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 2.2);
    cyanRim.position.set(-3, -2, 4);
    this.scene.add(cyanRim);

    const backGlow = new THREE.PointLight(0x00d4ff, 2.0, 10);
    backGlow.position.set(0, 0, -1.5);
    this.scene.add(backGlow);
  }

  /* --------------------------------------------------------------------------
     1. Bright Central Energy Nucleus
     -------------------------------------------------------------------------- */
  _buildCentralNucleus() {
    this.nucleusGroup = new THREE.Group();

    // Central faceted core
    const coreGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7,
      thickness: 0.8,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.8,
      transparent: true,
      opacity: 0.95
    });
    this.nucleusMesh = new THREE.Mesh(coreGeo, coreMat);
    this.nucleusGroup.add(this.nucleusMesh);

    // Fine wireframe cage for diamond-cut brilliance
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    this.nucleusGroup.add(wire);

    // Surrounding translucent energy sphere
    const orbGeo = new THREE.SphereGeometry(0.58, 24, 24);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    this.nucleusOrb = new THREE.Mesh(orbGeo, orbMat);
    this.nucleusGroup.add(this.nucleusOrb);

    // Internal radiance point light
    this.nucleusLight = new THREE.PointLight(0x00f0ff, 2.5, 5);
    this.nucleusGroup.add(this.nucleusLight);

    this.reactorGroup.add(this.nucleusGroup);
  }

  /* --------------------------------------------------------------------------
     2. Several Independently Rotating Segmented Rings
     -------------------------------------------------------------------------- */
  _buildInnerSegmentedRing() {
    this.innerRingGroup = new THREE.Group();

    // 3 curved cylindrical arc segments with thickness
    const arcConfigs = [
      { start: 0, length: Math.PI * 0.55 },
      { start: Math.PI * 0.72, length: Math.PI * 0.55 },
      { start: Math.PI * 1.48, length: Math.PI * 0.42 }
    ];

    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.2,
      metalness: 0.85,
      roughness: 0.2,
      side: THREE.DoubleSide
    });

    arcConfigs.forEach(cfg => {
      const geo = new THREE.RingGeometry(1.16, 1.28, 48, 1, cfg.start, cfg.length);
      const mesh = new THREE.Mesh(geo, innerMat);
      this.innerRingGroup.add(mesh);
    });

    // Thin inner boundary hairline
    const borderGeo = new THREE.RingGeometry(1.14, 1.15, 64);
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    this.innerRingGroup.add(border);

    this.reactorGroup.add(this.innerRingGroup);
  }

  /* --------------------------------------------------------------------------
     3. Fine Calibration Ticks Ring
     -------------------------------------------------------------------------- */
  _buildCalibrationTicksRing() {
    this.midTicksGroup = new THREE.Group();

    const tickPositions = [];
    const tickColors = [];
    const count = 72;
    const rIn = 1.62;

    const cyanColor = new THREE.Color(0x00f0ff);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const len = isMajor ? 0.12 : 0.055;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      tickPositions.push(rIn * cos, rIn * sin, 0);
      tickPositions.push((rIn + len) * cos, (rIn + len) * sin, 0);

      const col = isMajor ? whiteColor : cyanColor;
      tickColors.push(col.r, col.g, col.b);
      tickColors.push(col.r, col.g, col.b);
    }

    const ticksGeo = new THREE.BufferGeometry();
    ticksGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
    ticksGeo.setAttribute('color', new THREE.Float32BufferAttribute(tickColors, 3));

    const ticksMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const ticksLine = new THREE.LineSegments(ticksGeo, ticksMat);
    this.midTicksGroup.add(ticksLine);

    // Hairline circular rail
    const railGeo = new THREE.RingGeometry(1.61, 1.618, 72);
    const railMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    this.midTicksGroup.add(new THREE.Mesh(railGeo, railMat));

    this.reactorGroup.add(this.midTicksGroup);
  }

  /* --------------------------------------------------------------------------
     4. Outer Segmented Arc Ring & Notched Brackets
     -------------------------------------------------------------------------- */
  _buildOuterSegmentedArcs() {
    this.outerRingGroup = new THREE.Group();

    // 4 quadrant notched arcs
    const outerConfigs = [
      { start: Math.PI * 0.05, length: Math.PI * 0.40 },
      { start: Math.PI * 0.55, length: Math.PI * 0.40 },
      { start: Math.PI * 1.05, length: Math.PI * 0.40 },
      { start: Math.PI * 1.55, length: Math.PI * 0.40 }
    ];

    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.25,
      side: THREE.DoubleSide
    });

    outerConfigs.forEach(cfg => {
      const geo = new THREE.RingGeometry(2.18, 2.30, 48, 1, cfg.start, cfg.length);
      const mesh = new THREE.Mesh(geo, outerMat);
      this.outerRingGroup.add(mesh);
    });

    // 4 Corner Brackets / Tick pointers at 45 degree angles
    for (let k = 0; k < 4; k++) {
      const angle = (k * Math.PI) / 2 + Math.PI / 4;
      const r = 2.38;
      const bGeo = new THREE.BoxGeometry(0.12, 0.035, 0.035);
      const bMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(r * Math.cos(angle), r * Math.sin(angle), 0);
      bMesh.rotation.z = angle;
      this.outerRingGroup.add(bMesh);
    }

    this.reactorGroup.add(this.outerRingGroup);
  }

  /* --------------------------------------------------------------------------
     5. Tilted Orbital Assembly with Travelling Photon Beacons
     -------------------------------------------------------------------------- */
  _buildTiltedOrbitalAssembly() {
    this.tiltedOrbitGroup = new THREE.Group();
    // Tilted on X/Y axis for unmistakable 3D depth
    this.tiltedOrbitGroup.rotation.set(0.48, 0.32, 0);

    const orbitRadius = 2.45;
    const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.012, orbitRadius + 0.012, 80);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    this.tiltedOrbitGroup.add(orbitMesh);

    // 3 Orbiting Beacons / Light trails
    this.orbitBeacons = [];
    const beaconColors = [0xffffff, 0x00f0ff, 0xf59e0b]; // White, Cyan, Restrained Amber accent

    for (let i = 0; i < 3; i++) {
      const bGroup = new THREE.Group();
      const sGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const sMat = new THREE.MeshBasicMaterial({ color: beaconColors[i] });
      const sphere = new THREE.Mesh(sGeo, sMat);
      bGroup.add(sphere);

      // Mini trail point light
      const pLight = new THREE.PointLight(beaconColors[i], 1.2, 2.0);
      bGroup.add(pLight);

      this.tiltedOrbitGroup.add(bGroup);
      this.orbitBeacons.push({
        group: bGroup,
        radius: orbitRadius,
        phase: (i * Math.PI * 2) / 3,
        speed: 0.6 + i * 0.25
      });
    }

    this.reactorGroup.add(this.tiltedOrbitGroup);
  }

  /* --------------------------------------------------------------------------
     6. Faint Ground Halo & Drifting Energy Motes
     -------------------------------------------------------------------------- */
  _buildGroundHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(0.35, 'rgba(0, 180, 240, 0.12)');
    grad.addColorStop(0.7, 'rgba(10, 25, 60, 0.04)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    const haloGeo = new THREE.PlaneGeometry(6.4, 6.4);
    const haloMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.groundHalo = new THREE.Mesh(haloGeo, haloMat);
    this.groundHalo.position.z = -0.4;
    this.reactorGroup.add(this.groundHalo);
  }

  _buildDriftingParticles() {
    const particleCount = this.options.quality === 'low' ? 12 : (this.options.quality === 'medium' ? 20 : 32);
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.0 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 1.4;

      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = z;

      speeds[i] = 0.2 + Math.random() * 0.3;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.8)');
    pGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(pGeo, pMat);
    this.particlePositions = positions;
    this.particleSpeeds = speeds;
    this.reactorGroup.add(this.particles);
  }

  /* --------------------------------------------------------------------------
     Event Handlers
     -------------------------------------------------------------------------- */
  _setupEvents() {
    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver(() => this._onResize());
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', this._onResize);
    }

    document.addEventListener('visibilitychange', this._onVisibilityChange);
    this.container.addEventListener('pointermove', this._onPointerMove);
    this.container.addEventListener('pointerleave', this._onPointerLeave);
  }

  _onPointerMove(e) {
    const rect = this.container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this.pointer.targetX = nx * 0.22;
    this.pointer.targetY = ny * 0.18;

    if (this.isPaused) {
      this.renderSingleFrame();
    }
  }

  _onPointerLeave() {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
    if (this.isPaused) {
      this.renderSingleFrame();
    }
  }

  _onResize() {
    if (!this.container || !this.renderer || !this.camera) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;

    if (width < 768) {
      this.camera.position.set(0, 0, 7.4);
    } else {
      this.camera.position.set(0, 0, 6.2);
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.isPaused) {
      this.renderSingleFrame();
    }
  }

  _onVisibilityChange() {
    if (document.hidden) {
      this.isPaused = true;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } else if (!this.options.reducedMotion) {
      this.isPaused = false;
      this.lastFrameTime = performance.now();
      this.fpsLastTime = performance.now();
      if (!this.rafId) this._startLoop();
    }
  }

  /* --------------------------------------------------------------------------
     State Machine & Control Methods
     -------------------------------------------------------------------------- */
  setState(newState) {
    if (this.state === newState) return;
    this.state = newState;

    switch (newState) {
      case 'idle':
        this.speedMultiplier = 1.0;
        this.pulseMultiplier = 1.0;
        this.glowIntensity = 1.0;
        break;
      case 'listening':
        this.speedMultiplier = 1.7;
        this.pulseMultiplier = 1.25;
        this.glowIntensity = 1.8;
        break;
      case 'thinking':
        this.speedMultiplier = 2.4;
        this.pulseMultiplier = 1.45;
        this.glowIntensity = 2.2;
        break;
      case 'speaking':
        this.speedMultiplier = 1.2;
        this.pulseMultiplier = 2.1;
        this.glowIntensity = 1.9;
        break;
    }

    if (this.isPaused) {
      this.renderSingleFrame();
    }

    if (this.options.onStateChange) {
      this.options.onStateChange(newState);
    }
  }

  setReducedMotion(enabled) {
    this.options.reducedMotion = !!enabled;
    this.isPaused = !!enabled;

    if (this.isPaused) {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.renderSingleFrame();
    } else if (!document.hidden) {
      this.lastFrameTime = performance.now();
      this.fpsLastTime = performance.now();
      if (!this.rafId) this._startLoop();
    }
  }

  recenterPerspective() {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
    this.pointer.x = 0;
    this.pointer.y = 0;
    if (this.reactorGroup) {
      this.reactorGroup.rotation.set(0.18, -0.12, 0);
    }
    this.renderSingleFrame();
  }

  setThemeAccent(accent) {
    this.options.themeAccent = accent;
    this.renderSingleFrame();
  }

  setQuality(quality) {
    this.options.quality = quality;
    this._applyDprForQuality();
    this.renderSingleFrame();
  }

  renderSingleFrame() {
    if (!this.renderer || !this.scene || !this.camera) return;
    this._updateTransforms(0.016);
    this.renderer.render(this.scene, this.camera);
  }

  /* --------------------------------------------------------------------------
     Animation Loop & Transforms
     -------------------------------------------------------------------------- */
  _startLoop() {
    const loop = (timestamp) => {
      if (this.isDestroyed || this.isPaused || document.hidden) {
        this.rafId = null;
        return;
      }

      this.rafId = requestAnimationFrame(loop);

      this.fpsFrames++;
      const deltaMs = timestamp - this.fpsLastTime;
      if (deltaMs >= 1000) {
        this.measuredFps = Math.round((this.fpsFrames * 1000) / deltaMs);
        this.fpsFrames = 0;
        this.fpsLastTime = timestamp;

        if (this.options.onFpsUpdate) {
          this.options.onFpsUpdate(this.measuredFps);
        }
      }

      const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = timestamp;

      this._updateTransforms(dt);
      this.renderer.render(this.scene, this.camera);
    };

    this.lastFrameTime = performance.now();
    this.fpsLastTime = performance.now();
    this.rafId = requestAnimationFrame(loop);
  }

  _updateTransforms(dt) {
    this.animTime += dt * this.speedMultiplier;

    // Smooth pointer parallax
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    if (this.reactorGroup) {
      this.reactorGroup.rotation.x = 0.18 + this.pointer.y * 0.25;
      this.reactorGroup.rotation.y = -0.12 + this.pointer.x * 0.35;
    }

    // 1. Central Nucleus Breathing & Pulsation
    if (this.nucleusMesh) {
      let pulse = 1.0;
      if (this.state === 'speaking') {
        pulse = 1.0 + 0.28 * Math.sin(this.animTime * 7.0);
      } else if (this.state === 'thinking') {
        pulse = 1.0 + 0.18 * Math.sin(this.animTime * 4.5);
      } else {
        pulse = 1.0 + 0.06 * Math.sin(this.animTime * 1.8);
      }

      this.nucleusMesh.scale.setScalar(pulse);
      this.nucleusMesh.rotation.y = this.animTime * 0.5;
      this.nucleusMesh.rotation.z = Math.sin(this.animTime * 0.3) * 0.15;

      if (this.nucleusOrb) {
        this.nucleusOrb.scale.setScalar(pulse * 1.05);
        this.nucleusOrb.rotation.y = -this.animTime * 0.3;
      }

      if (this.nucleusLight) {
        this.nucleusLight.intensity = 2.5 * this.pulseMultiplier * pulse;
      }
    }

    // 2. Rotating Segmented Rings
    if (this.innerRingGroup) {
      this.innerRingGroup.rotation.z = this.animTime * 0.35;
    }

    if (this.midTicksGroup) {
      this.midTicksGroup.rotation.z = -this.animTime * 0.22;
    }

    if (this.outerRingGroup) {
      this.outerRingGroup.rotation.z = this.animTime * 0.15;
    }

    // 3. Tilted Orbital Assembly & Traveling Beacons
    if (this.tiltedOrbitGroup) {
      this.tiltedOrbitGroup.rotation.z = -this.animTime * 0.08;

      this.orbitBeacons.forEach(b => {
        const theta = this.animTime * b.speed + b.phase;
        b.group.position.x = b.radius * Math.cos(theta);
        b.group.position.y = b.radius * Math.sin(theta);
      });
    }

    // 4. Subtle particles
    if (this.particles && this.particlePositions) {
      const pos = this.particlePositions;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const angle = this.animTime * this.particleSpeeds[i] * 0.2;
        const r = Math.sqrt(pos[i * 3] * pos[i * 3] + pos[i * 3 + 1] * pos[i * 3 + 1]);
        const curAngle = Math.atan2(pos[i * 3 + 1], pos[i * 3]);
        const newAngle = curAngle + dt * 0.15;

        pos[i * 3] = r * Math.cos(newAngle);
        pos[i * 3 + 1] = r * Math.sin(newAngle);
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  /* --------------------------------------------------------------------------
     Resource Cleanup & Disposal
     -------------------------------------------------------------------------- */
  destroy() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);

    if (this.container) {
      this.container.removeEventListener('pointermove', this._onPointerMove);
      this.container.removeEventListener('pointerleave', this._onPointerLeave);
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
  }
}
