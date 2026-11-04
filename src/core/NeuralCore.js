/**
 * NOVA — 3D Centrepiece: “NOVA — Living Intelligence”
 * A floating sculpture made of three interwoven, twisted metallic ribbons surrounding a luminous pearl crystal.
 *
 * Art Direction:
 * - Three interwoven, twisted ribbons with visible thickness and bevelled chamfer edges.
 * - Brushed titanium exteriors (high metalness, refined roughness, procedural studio reflections).
 * - Softly illuminated cyan inner edges on ribbons 1 & 2.
 * - One restrained violet accent ribbon (ribbon 3) with violet inner illumination.
 * - Luminous pearl-white crystal at center with soft interior radiance.
 * - Asymmetrical, diagonal composition for a distinctive, recognizable silhouette.
 * - Faint ground halo and small cluster of drifting light particles.
 * - State animations:
 *   - Idle: gentle floating oscillation and slow organic ribbon twist.
 *   - Listening: soft light traveling along the inner ribbon conduits.
 *   - Thinking: controlled rhythmic wave of motion and progressive illumination.
 *   - Speaking: subtle pearl-white crystal pulses.
 * - Genuinely measured FPS (no fake frequencies or invented measurements).
 * - Reliable procedural studio environment (no external HDR dependencies).
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
    this.isPaused = false;
    this.rafId = null;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.sculptureGroup = null;

    // Sculpture Assemblies
    this.ribbonAssemblies = []; // Array of { mesh, innerEdge, curve, baseColor, emissiveColor }
    this.crystalMesh = null;
    this.crystalWire = null;
    this.crystalLight = null;
    this.groundHalo = null;
    this.particles = null;
    this.particlePositions = null;

    // Timing & Animation
    this.animTime = 0;
    this.stateTimer = 0;

    // Pointer Interaction (Subtle Parallax)
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isPointerOver = false;

    // Real FPS Tracking
    this.fpsLastTime = performance.now();
    this.fpsFrames = 0;
    this.measuredFps = 60;

    // State Lerping Variables
    this.ribbonMotionSpeed = 1.0;
    this.crystalPulseIntensity = 1.0;
    this.innerEdgeGlow = 1.0;

    // Bound Event Handlers
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);

    this.init();
  }

  static isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!this.container) return;

    if (!NeuralCore.isWebGLAvailable()) {
      console.warn('[NOVA 3D] WebGL unavailable, mounting fallback.');
      this.fallback = new FallbackCore(this.container);
      return;
    }

    try {
      this._setupScene();
      this._setupLightingAndEnv();
      this._buildPearlCrystal();
      this._buildInterwovenRibbons();
      this._buildGroundHalo();
      this._buildDriftingParticles();
      this._setupEvents();
      this._onResize();

      // Check system reduced motion
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || this.options.reducedMotion) {
        this.options.reducedMotion = true;
        this.isPaused = true;
        this._updateTransforms(0.016);
        this.renderer.render(this.scene, this.camera);
      } else {
        this._startLoop();
      }
    } catch (err) {
      console.error('[NOVA 3D] Three.js init failed, mounting fallback:', err);
      this.fallback = new FallbackCore(this.container);
    }
  }

  /* --------------------------------------------------------------------------
     Scene, Camera & Renderer
     -------------------------------------------------------------------------- */
  _setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x040714, 0.04);

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 80);
    this.camera.position.set(0, 0.1, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    this.renderer.domElement.className = 'neural-canvas';
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.appendChild(this.renderer.domElement);

    this.sculptureGroup = new THREE.Group();
    // Diagonal orientation for asymmetrical silhouette
    this.sculptureGroup.rotation.set(0.32, -0.28, 0.22);
    this.scene.add(this.sculptureGroup);
  }

  /* --------------------------------------------------------------------------
     Studio Lighting & Procedural Environment
     -------------------------------------------------------------------------- */
  _setupLightingAndEnv() {
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x0a1120, 0.8);
    this.scene.add(ambientLight);

    // Directional Key Light (cool crisp titanium highlights)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 5, 4);
    this.scene.add(keyLight);

    // Fill Light (deep slate navy from opposite flank)
    const fillLight = new THREE.DirectionalLight(0x334155, 1.2);
    fillLight.position.set(-4, 2, -3);
    this.scene.add(fillLight);

    // Cyan Rim Light (illuminating metallic edges)
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 1.4);
    cyanRim.position.set(1, -3, -4);
    this.scene.add(cyanRim);

    // Restrained Violet Accent Light
    const violetAccent = new THREE.DirectionalLight(0x8b5cf6, 1.1);
    violetAccent.position.set(-3, 3.5, 3);
    this.scene.add(violetAccent);

    // Procedural Studio Environment Texture for instant realistic reflections
    try {
      const envTexture = this._generateProceduralStudioTexture();
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = envTexture;
    } catch (e) {
      console.warn('[NOVA 3D] Procedural environment generation fallback', e);
    }
  }

  _generateProceduralStudioTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Dark studio gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, '#060a16');
    grad.addColorStop(0.5, '#0b1329');
    grad.addColorStop(1, '#040712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 64);

    // Soft Studio Softbox 1 (White key top-right)
    const box1 = ctx.createRadialGradient(90, 20, 0, 90, 20, 28);
    box1.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    box1.addColorStop(0.6, 'rgba(226, 232, 240, 0.35)');
    box1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = box1;
    ctx.fillRect(60, 0, 68, 45);

    // Soft Studio Softbox 2 (Electric Cyan bottom-left rim)
    const box2 = ctx.createRadialGradient(30, 48, 0, 30, 48, 22);
    box2.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
    box2.addColorStop(0.7, 'rgba(0, 180, 220, 0.25)');
    box2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = box2;
    ctx.fillRect(0, 25, 60, 39);

    // Soft Studio Softbox 3 (Violet accent top-left)
    const box3 = ctx.createRadialGradient(25, 15, 0, 25, 15, 18);
    box3.addColorStop(0, 'rgba(139, 92, 246, 0.7)');
    box3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = box3;
    ctx.fillRect(5, 0, 40, 30);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /* --------------------------------------------------------------------------
     Pearl-White Crystal Core
     -------------------------------------------------------------------------- */
  _buildPearlCrystal() {
    const crystalGroup = new THREE.Group();

    // Octahedral faceted pearl crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.38, 0);

    // Pearl-white physical material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.08,
      transmission: 0.65,
      thickness: 0.75,
      ior: 1.52,
      transparent: true,
      opacity: 0.94,
      emissive: 0xffffff,
      emissiveIntensity: 0.35,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1
    });

    this.crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(this.crystalMesh);

    // Fine wireframe facet cage for crisp diamond edges
    const wireGeo = new THREE.WireframeGeometry(crystalGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45
    });
    this.crystalWire = new THREE.LineSegments(wireGeo, wireMat);
    crystalGroup.add(this.crystalWire);

    // Internal radiance light diffusing through crystal
    this.crystalLight = new THREE.PointLight(0xf8fafc, 1.4, 4.5);
    crystalGroup.add(this.crystalLight);

    this.sculptureGroup.add(crystalGroup);
    this.crystalGroup = crystalGroup;
  }

  /* --------------------------------------------------------------------------
     Three Interwoven Twisted Metallic Ribbons
     -------------------------------------------------------------------------- */
  _buildInterwovenRibbons() {
    this.ribbonAssemblies = [];

    // Ribbon configs:
    // Ribbon 0 & 1: Brushed Titanium exterior, illuminated Cyan inner edge
    // Ribbon 2: Brushed Titanium with restrained Violet accent and Violet inner edge
    const configs = [
      {
        phase: 0,
        tilt: 0.15,
        baseColor: 0x8a99a8, // Brushed Titanium
        innerColor: 0x00f0ff, // Electric Cyan
        isVioletAccent: false
      },
      {
        phase: (Math.PI * 2) / 3,
        tilt: -0.22,
        baseColor: 0x93a3b2, // Brushed Titanium
        innerColor: 0x00f0ff, // Electric Cyan
        isVioletAccent: false
      },
      {
        phase: (Math.PI * 4) / 3,
        tilt: 0.30,
        baseColor: 0x948db0, // Titanium with restrained violet undertone
        innerColor: 0xa855f7, // Restrained Violet
        isVioletAccent: true
      }
    ];

    configs.forEach((cfg, idx) => {
      const { mesh, innerEdge, curve } = this._createTwistedRibbon(cfg, idx);
      this.sculptureGroup.add(mesh);
      this.sculptureGroup.add(innerEdge);

      this.ribbonAssemblies.push({
        mesh,
        innerEdge,
        curve,
        cfg,
        initialRotationY: idx * ((Math.PI * 2) / 3)
      });
    });
  }

  _createTwistedRibbon(cfg, index) {
    const segments = 140;
    const curvePoints = [];

    // Generate smooth interwoven 3D knot curve
    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2;
      const r = 1.72 + 0.34 * Math.sin(2 * u + cfg.phase);
      const x = r * Math.cos(u + cfg.phase);
      const y = 1.15 * Math.sin(2 * u + cfg.phase * 1.35) + cfg.tilt * 0.4;
      const z = r * Math.sin(u + cfg.phase) * 0.84;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    const steps = 140;
    const frames = curve.computeFrenetFrames(steps, true);

    // Cross-section: 8-point chamfered rectangle (visible thickness & bevelled edges)
    const width = 0.22;
    const thickness = 0.040;
    const chamfer = 0.010;
    const hw = width * 0.5;
    const ht = thickness * 0.5;

    const profile = [
      [-hw + chamfer, -ht],
      [hw - chamfer, -ht],
      [hw, -ht + chamfer],
      [hw, ht - chamfer],
      [hw - chamfer, ht],
      [-hw + chamfer, ht],
      [-hw, ht - chamfer],
      [-hw, -ht + chamfer]
    ];
    const profileCount = profile.length;

    const positions = [];
    const uvs = [];
    const indices = [];

    // Inner edge track points for the softly illuminated conduit
    const innerEdgePoints = [];

    // Continuous 1.5 twist along the closed ribbon path
    const totalTwists = 1.5;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = curve.getPointAt(t);
      const frameIdx = i % steps;
      const normal = frames.normals[frameIdx];
      const binormal = frames.binormals[frameIdx];

      const twistAngle = t * Math.PI * 2 * totalTwists;
      const cosT = Math.cos(twistAngle);
      const sinT = Math.sin(twistAngle);

      const rotNormal = new THREE.Vector3()
        .copy(normal).multiplyScalar(cosT)
        .addScaledVector(binormal, sinT);
      const rotBinormal = new THREE.Vector3()
        .copy(normal).multiplyScalar(-sinT)
        .addScaledVector(binormal, cosT);

      // Add profile vertices
      for (let j = 0; j < profileCount; j++) {
        const [px, py] = profile[j];
        const vPos = new THREE.Vector3()
          .copy(pt)
          .addScaledVector(rotBinormal, px)
          .addScaledVector(rotNormal, py);

        positions.push(vPos.x, vPos.y, vPos.z);
        uvs.push(t, j / profileCount);
      }

      // Record inner edge position (at offset -hw * 0.95 along binormal)
      const innerPt = new THREE.Vector3()
        .copy(pt)
        .addScaledVector(rotBinormal, -hw * 0.92);
      innerEdgePoints.push(innerPt);
    }

    // Build ribbon faces
    for (let i = 0; i < steps; i++) {
      const r1 = i * profileCount;
      const r2 = (i + 1) * profileCount;

      for (let j = 0; j < profileCount; j++) {
        const nextJ = (j + 1) % profileCount;
        const a = r1 + j;
        const b = r2 + j;
        const c = r2 + nextJ;
        const d = r1 + nextJ;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const ribbonGeo = new THREE.BufferGeometry();
    ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    ribbonGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    ribbonGeo.setIndex(indices);
    ribbonGeo.computeVertexNormals();

    // Brushed titanium standard material
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: cfg.baseColor,
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 1.35
    });

    const mesh = new THREE.Mesh(ribbonGeo, ribbonMat);

    // Inner softly illuminated conduit (inner edge tube)
    const innerCurve = new THREE.CatmullRomCurve3(innerEdgePoints, true);
    const innerTubeGeo = new THREE.TubeGeometry(innerCurve, 120, 0.016, 6, true);
    const innerTubeMat = new THREE.MeshStandardMaterial({
      color: cfg.innerColor,
      emissive: cfg.innerColor,
      emissiveIntensity: 1.35,
      roughness: 0.15,
      metalness: 0.2
    });

    const innerEdge = new THREE.Mesh(innerTubeGeo, innerTubeMat);

    return { mesh, innerEdge, curve };
  }

  /* --------------------------------------------------------------------------
     Faint Ground Halo
     -------------------------------------------------------------------------- */
  _buildGroundHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
    grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.10)');
    grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.04)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    const haloGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const haloMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.groundHalo = new THREE.Mesh(haloGeo, haloMat);
    this.groundHalo.rotation.x = -Math.PI / 2;
    this.groundHalo.position.y = -2.45;
    this.scene.add(this.groundHalo);
  }

  /* --------------------------------------------------------------------------
     Drifting Light Particles (Small cluster: 42 particles)
     -------------------------------------------------------------------------- */
  _buildDriftingParticles() {
    const particleCount = 42;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.4 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.2;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      speeds[i] = 0.2 + Math.random() * 0.3;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle circular dot texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.6)');
    pGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(particleGeo, particleMat);
    this.particlePositions = positions;
    this.particleSpeeds = speeds;
    this.particlePhases = phases;
    this.scene.add(this.particles);
  }

  /* --------------------------------------------------------------------------
     Event Handlers & Interactivity
     -------------------------------------------------------------------------- */
  _setupEvents() {
    window.addEventListener('resize', this._onResize);
    document.addEventListener('visibilitychange', this._onVisibilityChange);

    this.container.addEventListener('pointermove', this._onPointerMove);
    this.container.addEventListener('pointerleave', this._onPointerLeave);
  }

  _onPointerMove(e) {
    const rect = this.container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this.pointer.targetX = nx * 0.35;
    this.pointer.targetY = ny * 0.25;
    this.isPointerOver = true;
  }

  _onPointerLeave() {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
    this.isPointerOver = false;
  }

  _onResize() {
    if (!this.container || !this.renderer || !this.camera) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;

    // Mobile framing adjustment: slightly further camera when screen is narrow
    if (width < 768) {
      this.camera.position.set(0, 0.05, 6.9);
    } else {
      this.camera.position.set(0, 0.1, 5.8);
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _onVisibilityChange() {
    if (document.hidden) {
      this.isPaused = true;
    } else if (!this.options.reducedMotion) {
      this.isPaused = false;
      this.fpsLastTime = performance.now();
    }
  }

  /* --------------------------------------------------------------------------
     State Machine & Meaningful Motion
     -------------------------------------------------------------------------- */
  setState(newState) {
    if (this.state === newState) return;
    this.state = newState;
    this.stateTimer = 0;

    switch (newState) {
      case 'idle':
        this.ribbonMotionSpeed = 1.0;
        this.innerEdgeGlow = 1.0;
        this.crystalPulseIntensity = 1.0;
        break;
      case 'listening':
        // Soft traveling wave along ribbons
        this.ribbonMotionSpeed = 1.25;
        this.innerEdgeGlow = 1.8;
        this.crystalPulseIntensity = 1.1;
        break;
      case 'thinking':
        // Controlled harmonic wave of motion
        this.ribbonMotionSpeed = 2.0;
        this.innerEdgeGlow = 2.2;
        this.crystalPulseIntensity = 1.35;
        break;
      case 'speaking':
        // Crystal pulses with light
        this.ribbonMotionSpeed = 1.1;
        this.innerEdgeGlow = 1.5;
        this.crystalPulseIntensity = 2.4;
        break;
    }

    if (this.options.onStateChange) {
      this.options.onStateChange(newState);
    }
  }

  setReducedMotion(enabled) {
    this.options.reducedMotion = !!enabled;
    this.isPaused = !!enabled;
    if (!enabled) {
      this.fpsLastTime = performance.now();
      if (!this.rafId) this._startLoop();
    }
  }

  recenterPerspective() {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
    this.pointer.x = 0;
    this.pointer.y = 0;
    if (this.sculptureGroup) {
      this.sculptureGroup.rotation.set(0.32, -0.28, 0.22);
    }
  }

  /* --------------------------------------------------------------------------
     Animation Loop & Genuine FPS Measurement
     -------------------------------------------------------------------------- */
  _startLoop() {
    const loop = (timestamp) => {
      if (this.isDestroyed) return;

      this.rafId = requestAnimationFrame(loop);

      // Measure genuine FPS
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

      if (!this.isPaused) {
        this._updateTransforms(0.016);
        this.renderer.render(this.scene, this.camera);
      }
    };

    this.fpsLastTime = performance.now();
    this.rafId = requestAnimationFrame(loop);
  }

  _updateTransforms(dt) {
    this.animTime += dt * this.ribbonMotionSpeed;
    this.stateTimer += dt;

    // Smooth pointer parallax easing
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    // Base sculpture gentle diagonal bob & parallax tilt
    const baseBob = Math.sin(this.animTime * 0.8) * 0.08;
    this.sculptureGroup.position.y = baseBob;
    this.sculptureGroup.rotation.x = 0.32 + this.pointer.y * 0.3;
    this.sculptureGroup.rotation.y = -0.28 + this.pointer.x * 0.4 + Math.sin(this.animTime * 0.25) * 0.05;

    // Pearl-White Crystal rotation & state pulsation
    if (this.crystalMesh) {
      this.crystalMesh.rotation.y = this.animTime * 0.4;
      this.crystalMesh.rotation.x = Math.sin(this.animTime * 0.3) * 0.15;
      if (this.crystalWire) {
        this.crystalWire.rotation.copy(this.crystalMesh.rotation);
      }

      // Speaking state or idle breathing pulsation
      let pulse = 1.0;
      if (this.state === 'speaking') {
        pulse = 1.0 + 0.35 * Math.sin(this.animTime * 6.5);
      } else if (this.state === 'thinking') {
        pulse = 1.0 + 0.20 * Math.sin(this.animTime * 3.5);
      } else {
        pulse = 1.0 + 0.08 * Math.sin(this.animTime * 1.5);
      }

      this.crystalMesh.scale.setScalar(pulse);
      if (this.crystalLight) {
        this.crystalLight.intensity = 1.4 * this.crystalPulseIntensity * pulse;
      }
    }

    // Ribbon Assemblies: smooth breathing and dynamic state motion
    this.ribbonAssemblies.forEach((item, idx) => {
      const phaseOffset = idx * 1.4;

      // Gentle organic ribbon twist/bob
      let wave = 0;
      if (this.state === 'listening') {
        // Light travels along ribbons with traveling emissive pulse
        wave = Math.sin(this.animTime * 3.0 + phaseOffset);
        item.innerEdge.material.emissiveIntensity = 1.2 + 0.9 * Math.max(0, wave);
      } else if (this.state === 'thinking') {
        // Harmonic progressive wave across the ribbons
        wave = Math.sin(this.animTime * 4.0 + phaseOffset);
        item.mesh.rotation.y = Math.sin(this.animTime * 1.5 + phaseOffset) * 0.08;
        item.innerEdge.rotation.y = item.mesh.rotation.y;
        item.innerEdge.material.emissiveIntensity = 1.4 + 1.1 * Math.sin(this.animTime * 3.0 + phaseOffset);
      } else {
        // Idle state: subtle breathing
        item.innerEdge.material.emissiveIntensity = 1.1 + 0.25 * Math.sin(this.animTime * 1.2 + phaseOffset);
        item.mesh.rotation.y = Math.sin(this.animTime * 0.5 + phaseOffset) * 0.03;
        item.innerEdge.rotation.y = item.mesh.rotation.y;
      }
    });

    // Drifting light particles gentle motion
    if (this.particles && this.particlePositions) {
      const pos = this.particlePositions;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        // Gentle upward drift & orbit
        pos[i * 3 + 1] += this.particleSpeeds[i] * dt * 0.35;
        // Wrap around vertically
        if (pos[i * 3 + 1] > 2.0) pos[i * 3 + 1] = -2.0;

        // Subtle radial sway
        const angle = this.animTime * 0.2 + this.particlePhases[i];
        pos[i * 3] += Math.sin(angle) * 0.002;
        pos[i * 3 + 2] += Math.cos(angle) * 0.002;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Faint ground halo gentle breathing
    if (this.groundHalo) {
      const haloScale = 1.0 + 0.04 * Math.sin(this.animTime * 0.7);
      this.groundHalo.scale.set(haloScale, haloScale, 1.0);
    }
  }

  /* --------------------------------------------------------------------------
     Resource Cleanup & Disposal
     -------------------------------------------------------------------------- */
  destroy() {
    this.isDestroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);

    if (this.container) {
      this.container.removeEventListener('pointermove', this._onPointerMove);
      this.container.removeEventListener('pointerleave', this._onPointerLeave);
    }

    // Dispose geometries & materials
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
