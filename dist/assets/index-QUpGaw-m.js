import{S as de,F as he,P as pe,W as ue,A as ge,G as j,a as me,D as P,E as ve,C as D,O as fe,M as be,b as V,c as ye,L as Se,d as we,e as xe,f as W,V as T,B as K,g as Q,h as Y,T as ke,i as Ce,j as Me,k as J,l as Ae,m as Ee,n as Le}from"./three-kYn9Lxq7.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();class q{constructor(e){this.container=e,this.state="idle",this.element=null,this.init()}init(){this.element=document.createElement("div"),this.element.className="core-fallback-container",this.element.innerHTML=`
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
    `,this.container.appendChild(this.element)}setState(e){this.state=e,this.element&&this.element.setAttribute("data-state",e)}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class z{constructor(e,t={}){this.container=e,this.options=Object.assign({reducedMotion:!1,quality:"high",themeAccent:"cyan",onFpsUpdate:null,onStateChange:null},t),this.state="idle",this.isDestroyed=!1,this.isPaused=!1,this.rafId=null,this.scene=null,this.camera=null,this.renderer=null,this.sculptureGroup=null,this.ribbonAssemblies=[],this.crystalMesh=null,this.crystalWire=null,this.crystalLight=null,this.groundHalo=null,this.particles=null,this.particlePositions=null,this.animTime=0,this.stateTimer=0,this.pointer={x:0,y:0,targetX:0,targetY:0},this.isPointerOver=!1,this.fpsLastTime=performance.now(),this.fpsFrames=0,this.measuredFps=60,this.ribbonMotionSpeed=1,this.crystalPulseIntensity=1,this.innerEdgeGlow=1,this._onPointerMove=this._onPointerMove.bind(this),this._onPointerLeave=this._onPointerLeave.bind(this),this._onResize=this._onResize.bind(this),this._onVisibilityChange=this._onVisibilityChange.bind(this),this.init()}static isWebGLAvailable(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}init(){if(this.container){if(!z.isWebGLAvailable()){console.warn("[NOVA 3D] WebGL unavailable, mounting fallback."),this.fallback=new q(this.container);return}try{this._setupScene(),this._setupLightingAndEnv(),this._buildPearlCrystal(),this._buildInterwovenRibbons(),this._buildGroundHalo(),this._buildDriftingParticles(),this._setupEvents(),this._onResize(),window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches||this.options.reducedMotion?(this.options.reducedMotion=!0,this.isPaused=!0,this._updateTransforms(.016),this.renderer.render(this.scene,this.camera)):this._startLoop()}catch(e){console.error("[NOVA 3D] Three.js init failed, mounting fallback:",e),this.fallback=new q(this.container)}}}_setupScene(){this.scene=new de,this.scene.fog=new he(263956,.04);const e=this.container.clientWidth||500,t=this.container.clientHeight||500;this.camera=new pe(35,e/t,.1,80),this.camera.position.set(0,.1,5.8),this.renderer=new ue({antialias:!0,alpha:!0,powerPreference:"high-performance"});const i=Math.min(window.devicePixelRatio||1,2);this.renderer.setPixelRatio(i),this.renderer.setSize(e,t),this.renderer.domElement.className="neural-canvas",this.renderer.toneMapping=ge,this.renderer.toneMappingExposure=1.25,this.container.appendChild(this.renderer.domElement),this.sculptureGroup=new j,this.sculptureGroup.rotation.set(.32,-.28,.22),this.scene.add(this.sculptureGroup)}_setupLightingAndEnv(){const e=new me(659744,.8);this.scene.add(e);const t=new P(16777215,2);t.position.set(4,5,4),this.scene.add(t);const i=new P(3359061,1.2);i.position.set(-4,2,-3),this.scene.add(i);const n=new P(61695,1.4);n.position.set(1,-3,-4),this.scene.add(n);const o=new P(9133302,1.1);o.position.set(-3,3.5,3),this.scene.add(o);try{const s=this._generateProceduralStudioTexture();s.mapping=ve,this.scene.environment=s}catch(s){console.warn("[NOVA 3D] Procedural environment generation fallback",s)}}_generateProceduralStudioTexture(){const e=document.createElement("canvas");e.width=128,e.height=64;const t=e.getContext("2d"),i=t.createLinearGradient(0,0,0,64);i.addColorStop(0,"#060a16"),i.addColorStop(.5,"#0b1329"),i.addColorStop(1,"#040712"),t.fillStyle=i,t.fillRect(0,0,128,64);const n=t.createRadialGradient(90,20,0,90,20,28);n.addColorStop(0,"rgba(255, 255, 255, 0.9)"),n.addColorStop(.6,"rgba(226, 232, 240, 0.35)"),n.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=n,t.fillRect(60,0,68,45);const o=t.createRadialGradient(30,48,0,30,48,22);o.addColorStop(0,"rgba(0, 240, 255, 0.85)"),o.addColorStop(.7,"rgba(0, 180, 220, 0.25)"),o.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=o,t.fillRect(0,25,60,39);const s=t.createRadialGradient(25,15,0,25,15,18);s.addColorStop(0,"rgba(139, 92, 246, 0.7)"),s.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=s,t.fillRect(5,0,40,30);const a=new D(e);return a.needsUpdate=!0,a}_buildPearlCrystal(){const e=new j,t=new fe(.38,0),i=new be({color:16317180,roughness:.12,metalness:.08,transmission:.65,thickness:.75,ior:1.52,transparent:!0,opacity:.94,emissive:16777215,emissiveIntensity:.35,clearcoat:.5,clearcoatRoughness:.1});this.crystalMesh=new V(t,i),e.add(this.crystalMesh);const n=new ye(t),o=new Se({color:16777215,transparent:!0,opacity:.45});this.crystalWire=new we(n,o),e.add(this.crystalWire),this.crystalLight=new xe(16317180,1.4,4.5),e.add(this.crystalLight),this.sculptureGroup.add(e),this.crystalGroup=e}_buildInterwovenRibbons(){this.ribbonAssemblies=[],[{phase:0,tilt:.15,baseColor:9083304,innerColor:61695,isVioletAccent:!1},{phase:Math.PI*2/3,tilt:-.22,baseColor:9675698,innerColor:61695,isVioletAccent:!1},{phase:Math.PI*4/3,tilt:.3,baseColor:9735600,innerColor:11032055,isVioletAccent:!0}].forEach((t,i)=>{const{mesh:n,innerEdge:o,curve:s}=this._createTwistedRibbon(t,i);this.sculptureGroup.add(n),this.sculptureGroup.add(o),this.ribbonAssemblies.push({mesh:n,innerEdge:o,curve:s,cfg:t,initialRotationY:i*(Math.PI*2/3)})})}_createTwistedRibbon(e,t){const n=[];for(let b=0;b<=140;b++){const S=b/140*Math.PI*2,k=1.72+.34*Math.sin(2*S+e.phase),x=k*Math.cos(S+e.phase),C=1.15*Math.sin(2*S+e.phase*1.35)+e.tilt*.4,M=k*Math.sin(S+e.phase)*.84;n.push(new T(x,C,M))}const o=new W(n,!0),s=140,a=o.computeFrenetFrames(s,!0),r=.22,l=.04,p=.01,c=r*.5,h=l*.5,f=[[-c+p,-h],[c-p,-h],[c,-h+p],[c,h-p],[c-p,h],[-c+p,h],[-c,h-p],[-c,-h+p]],m=f.length,A=[],R=[],B=[],F=[],Z=1.5;for(let b=0;b<=s;b++){const S=b/s,k=o.getPointAt(S),x=b%s,C=a.normals[x],M=a.binormals[x],L=S*Math.PI*2*Z,_=Math.cos(L),I=Math.sin(L),ae=new T().copy(C).multiplyScalar(_).addScaledVector(M,I),U=new T().copy(C).multiplyScalar(-I).addScaledVector(M,_);for(let N=0;N<m;N++){const[ce,le]=f[N],$=new T().copy(k).addScaledVector(U,ce).addScaledVector(ae,le);A.push($.x,$.y,$.z),R.push(S,N/m)}const re=new T().copy(k).addScaledVector(U,-c*.92);F.push(re)}for(let b=0;b<s;b++){const S=b*m,k=(b+1)*m;for(let x=0;x<m;x++){const C=(x+1)%m,M=S+x,L=k+x,_=k+C,I=S+C;B.push(M,L,I),B.push(L,_,I)}}const E=new K;E.setAttribute("position",new Q(A,3)),E.setAttribute("uv",new Q(R,2)),E.setIndex(B),E.computeVertexNormals();const ee=new Y({color:e.baseColor,metalness:.88,roughness:.28,envMapIntensity:1.35}),te=new V(E,ee),ie=new W(F,!0),se=new ke(ie,120,.016,6,!0),ne=new Y({color:e.innerColor,emissive:e.innerColor,emissiveIntensity:1.35,roughness:.15,metalness:.2}),oe=new V(se,ne);return{mesh:te,innerEdge:oe,curve:o}}_buildGroundHalo(){const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d"),i=t.createRadialGradient(128,128,10,128,128,128);i.addColorStop(0,"rgba(0, 240, 255, 0.22)"),i.addColorStop(.35,"rgba(56, 189, 248, 0.10)"),i.addColorStop(.7,"rgba(139, 92, 246, 0.04)"),i.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=i,t.fillRect(0,0,256,256);const n=new D(e),o=new Ce(5.2,5.2),s=new Me({map:n,transparent:!0,depthWrite:!1,blending:J});this.groundHalo=new V(o,s),this.groundHalo.rotation.x=-Math.PI/2,this.groundHalo.position.y=-2.45,this.scene.add(this.groundHalo)}_buildDriftingParticles(){const t=new Float32Array(126),i=new Float32Array(42),n=new Float32Array(42);for(let c=0;c<42;c++){const h=1.4+Math.random()*1.5,f=Math.random()*Math.PI*2,m=(Math.random()-.5)*3.2;t[c*3]=h*Math.cos(f),t[c*3+1]=m,t[c*3+2]=h*Math.sin(f),i[c]=.2+Math.random()*.3,n[c]=Math.random()*Math.PI*2}const o=new K;o.setAttribute("position",new Ae(t,3));const s=document.createElement("canvas");s.width=32,s.height=32;const a=s.getContext("2d"),r=a.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,"rgba(255, 255, 255, 0.95)"),r.addColorStop(.4,"rgba(0, 240, 255, 0.6)"),r.addColorStop(1,"rgba(0, 240, 255, 0)"),a.fillStyle=r,a.fillRect(0,0,32,32);const l=new D(s),p=new Ee({size:.08,map:l,transparent:!0,blending:J,depthWrite:!1});this.particles=new Le(o,p),this.particlePositions=t,this.particleSpeeds=i,this.particlePhases=n,this.scene.add(this.particles)}_setupEvents(){window.addEventListener("resize",this._onResize),document.addEventListener("visibilitychange",this._onVisibilityChange),this.container.addEventListener("pointermove",this._onPointerMove),this.container.addEventListener("pointerleave",this._onPointerLeave)}_onPointerMove(e){const t=this.container.getBoundingClientRect(),i=(e.clientX-t.left)/t.width*2-1,n=-((e.clientY-t.top)/t.height*2-1);this.pointer.targetX=i*.35,this.pointer.targetY=n*.25,this.isPointerOver=!0}_onPointerLeave(){this.pointer.targetX=0,this.pointer.targetY=0,this.isPointerOver=!1}_onResize(){if(!this.container||!this.renderer||!this.camera)return;const e=this.container.clientWidth,t=this.container.clientHeight;e===0||t===0||(this.camera.aspect=e/t,e<768?this.camera.position.set(0,.05,6.9):this.camera.position.set(0,.1,5.8),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t))}_onVisibilityChange(){document.hidden?this.isPaused=!0:this.options.reducedMotion||(this.isPaused=!1,this.fpsLastTime=performance.now())}setState(e){if(this.state!==e){switch(this.state=e,this.stateTimer=0,e){case"idle":this.ribbonMotionSpeed=1,this.innerEdgeGlow=1,this.crystalPulseIntensity=1;break;case"listening":this.ribbonMotionSpeed=1.25,this.innerEdgeGlow=1.8,this.crystalPulseIntensity=1.1;break;case"thinking":this.ribbonMotionSpeed=2,this.innerEdgeGlow=2.2,this.crystalPulseIntensity=1.35;break;case"speaking":this.ribbonMotionSpeed=1.1,this.innerEdgeGlow=1.5,this.crystalPulseIntensity=2.4;break}this.options.onStateChange&&this.options.onStateChange(e)}}setReducedMotion(e){this.options.reducedMotion=!!e,this.isPaused=!!e,e||(this.fpsLastTime=performance.now(),this.rafId||this._startLoop())}recenterPerspective(){this.pointer.targetX=0,this.pointer.targetY=0,this.pointer.x=0,this.pointer.y=0,this.sculptureGroup&&this.sculptureGroup.rotation.set(.32,-.28,.22)}_startLoop(){const e=t=>{if(this.isDestroyed)return;this.rafId=requestAnimationFrame(e),this.fpsFrames++;const i=t-this.fpsLastTime;i>=1e3&&(this.measuredFps=Math.round(this.fpsFrames*1e3/i),this.fpsFrames=0,this.fpsLastTime=t,this.options.onFpsUpdate&&this.options.onFpsUpdate(this.measuredFps)),this.isPaused||(this._updateTransforms(.016),this.renderer.render(this.scene,this.camera))};this.fpsLastTime=performance.now(),this.rafId=requestAnimationFrame(e)}_updateTransforms(e){this.animTime+=e*this.ribbonMotionSpeed,this.stateTimer+=e,this.pointer.x+=(this.pointer.targetX-this.pointer.x)*.05,this.pointer.y+=(this.pointer.targetY-this.pointer.y)*.05;const t=Math.sin(this.animTime*.8)*.08;if(this.sculptureGroup.position.y=t,this.sculptureGroup.rotation.x=.32+this.pointer.y*.3,this.sculptureGroup.rotation.y=-.28+this.pointer.x*.4+Math.sin(this.animTime*.25)*.05,this.crystalMesh){this.crystalMesh.rotation.y=this.animTime*.4,this.crystalMesh.rotation.x=Math.sin(this.animTime*.3)*.15,this.crystalWire&&this.crystalWire.rotation.copy(this.crystalMesh.rotation);let i=1;this.state==="speaking"?i=1+.35*Math.sin(this.animTime*6.5):this.state==="thinking"?i=1+.2*Math.sin(this.animTime*3.5):i=1+.08*Math.sin(this.animTime*1.5),this.crystalMesh.scale.setScalar(i),this.crystalLight&&(this.crystalLight.intensity=1.4*this.crystalPulseIntensity*i)}if(this.ribbonAssemblies.forEach((i,n)=>{const o=n*1.4;let s=0;this.state==="listening"?(s=Math.sin(this.animTime*3+o),i.innerEdge.material.emissiveIntensity=1.2+.9*Math.max(0,s)):this.state==="thinking"?(s=Math.sin(this.animTime*4+o),i.mesh.rotation.y=Math.sin(this.animTime*1.5+o)*.08,i.innerEdge.rotation.y=i.mesh.rotation.y,i.innerEdge.material.emissiveIntensity=1.4+1.1*Math.sin(this.animTime*3+o)):(i.innerEdge.material.emissiveIntensity=1.1+.25*Math.sin(this.animTime*1.2+o),i.mesh.rotation.y=Math.sin(this.animTime*.5+o)*.03,i.innerEdge.rotation.y=i.mesh.rotation.y)}),this.particles&&this.particlePositions){const i=this.particlePositions,n=i.length/3;for(let o=0;o<n;o++){i[o*3+1]+=this.particleSpeeds[o]*e*.35,i[o*3+1]>2&&(i[o*3+1]=-2);const s=this.animTime*.2+this.particlePhases[o];i[o*3]+=Math.sin(s)*.002,i[o*3+2]+=Math.cos(s)*.002}this.particles.geometry.attributes.position.needsUpdate=!0}if(this.groundHalo){const i=1+.04*Math.sin(this.animTime*.7);this.groundHalo.scale.set(i,i,1)}}destroy(){this.isDestroyed=!0,this.rafId&&cancelAnimationFrame(this.rafId),window.removeEventListener("resize",this._onResize),document.removeEventListener("visibilitychange",this._onVisibilityChange),this.container&&(this.container.removeEventListener("pointermove",this._onPointerMove),this.container.removeEventListener("pointerleave",this._onPointerLeave)),this.scene&&this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement))}}const d={assistant:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="9" stroke-dasharray="4 2"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path></svg>',studio:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',history:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',settings:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',mic:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>',send:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 14-7-7 14-2-5Z"></path><path d="m12 12 7-7"></path></svg>',stop:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="5" y="5" rx="2"></rect></svg>',volume:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',sparkles:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>',user:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>',check:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',plus:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>',trash:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',close:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>',info:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',cpu:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>',externalLink:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>',desktop:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>',tablet:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',mobile:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',search:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>',download:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>'};function O(g){return g?g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function G(g){if(!g)return"";const e=[];let t=g.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)```/g,(r,l,p)=>{const c=`__CODE_BLOCK_${e.length}__`;return e.push({lang:l.trim()||"plaintext",code:p.trimEnd()}),c});t=t.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)$/g,(r,l,p)=>{const c=`__CODE_BLOCK_${e.length}__`;return e.push({lang:l.trim()||"plaintext",code:p.trimEnd()}),c}),t=O(t),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g,"$1<em>$2</em>$3"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/(^|\n)&gt; (.*?)(?=\n|$)/g,"$1<blockquote>$2</blockquote>");const i=t.split(`
`),n=[];let o=!1,s=!1;for(let r=0;r<i.length;r++){const l=i[r],p=l.match(/^(\s*)[-*]\s+(.*)$/);if(p){o||(s&&(n.push("</ol>"),s=!1),n.push("<ul>"),o=!0),n.push(`<li>${p[2]}</li>`);continue}const c=l.match(/^(\s*)\d+\.\s+(.*)$/);if(c){s||(o&&(n.push("</ul>"),o=!1),n.push("<ol>"),s=!0),n.push(`<li>${c[2]}</li>`);continue}if(o&&(n.push("</ul>"),o=!1),s&&(n.push("</ol>"),s=!1),!!l.trim()){if(l.includes("__CODE_BLOCK_")){n.push(l);continue}n.push(`<p>${l}</p>`)}}o&&n.push("</ul>"),s&&n.push("</ol>");let a=n.join(`
`);for(let r=0;r<e.length;r++){const l=e[r],p=O(l.code),c=`code_${Date.now()}_${r}`,h=`
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-label">${O(l.lang)}</span>
          <button class="copy-code-btn" data-code-target="${c}" title="Copy code">
            <svg class="copy-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span class="copy-text">Copy</span>
          </button>
        </div>
        <pre><code id="${c}">${p}</code></pre>
      </div>
    `.trim();a=a.replace(`__CODE_BLOCK_${r}__`,h)}return a}const Ie=[{triggers:["restaurant","dining","food","michelin","menu","aura"],response:`### Neural Formulation: Celestial Gastronomy Architecture

For a high-end luxury dining establishment such as **AURA**, the brand identity should bridge terrestrial culinary technique with hyper-modern aesthetic restraint.

#### Core Structural Pillars:
1. **Atmospheric Hierarchy:** Deep charcoal/obsidian surfaces, champagne gold accents, and subtle volumetric lighting.
2. **Interactive Sequences:** A dynamic multi-course timeline rather than a static list of dishes.
3. **Frictionless Reservation Flow:** Sandboxed real-time seating availability with private alcove allocation.

Here is an architectural component pattern in TypeScript/Node for the reservation scheduling service:

\`\`\`typescript
interface TableReservation {
  id: string;
  guestCount: number;
  experienceType: 'SALON_14_COURSE' | 'CHEF_COUNTER_PAIRING';
  reservationTimestamp: string;
  specialDietaryFlags: string[];
}

export async function allocateDiningSlot(request: TableReservation): Promise<{ confirmed: boolean; slotId: string }> {
  // Verify seat availability across salon zones
  const isAvailable = await checkInventory(request.reservationTimestamp, request.guestCount);
  if (!isAvailable) {
    throw new Error("Zone capacity exceeded for specified window.");
  }
  return {
    confirmed: true,
    slotId: \`AURA-\${Date.now()}-\${request.guestCount}G\`
  };
}
\`\`\`

You can view the interactive working showcase in the **Website Studio** tab.`},{triggers:["quantum","entanglement","physics","cryptography","qkd"],response:`### Quantum State Telemetry: Entanglement & QKD Protocol

Quantum Key Distribution (QKD) leverages the principles of quantum mechanics—specifically the **BB84 protocol** or **E91 entanglement protocol**—to guarantee unconditional secrecy based on Heisenberg's uncertainty principle.

#### Mathematical Foundation:
The bipartite entangled Bell state ( |\\Phi^+\\rangle ) is formulated as:
\`\`\`text
|Φ⁺⟩ = (1 / √2) * (|00⟩ + |11⟩)
\`\`\`

Any eavesdropping attempt (Eve) measures the state, causing wavefunction collapse:
- If Alice and Bob measure in matching rectilinear or diagonal bases, their bits are strictly correlated.
- If Eve intercepts, the Quantum Bit Error Rate (QBER) spikes above the threshold of **11%**, aborting key distribution.

Here is a Python simulation of the photon polarization basis matching:

\`\`\`python
import random

def simulate_bb84_exchange(qubits_count=16):
    alice_bits = [random.randint(0, 1) for _ in range(qubits_count)]
    alice_bases = [random.choice(['+', 'X']) for _ in range(qubits_count)]
    bob_bases = [random.choice(['+', 'X']) for _ in range(qubits_count)]
    
    # Sifted key generation
    shared_key = [
        alice_bits[i] 
        for i in range(qubits_count) 
        if alice_bases[i] == bob_bases[i]
    ]
    
    return {
        "raw_qubits": qubits_count,
        "matching_bases": len(shared_key),
        "sifted_key": "".join(map(str, shared_key))
    }

print(simulate_bb84_exchange())
\`\`\`

System status: Quantum entropy generator running at 99.98% fidelity.`},{triggers:["react","hydration","debug","next","ssr"],response:`### Diagnostic Trace: React Hydration Mismatch Resolution

A hydration mismatch occurs when the server-rendered HTML markup differs from the initial client render tree before React attaches event listeners.

#### Common Root Causes:
1. **Client-only APIs during SSR:** Using \`window\`, \`localStorage\`, or \`navigator\` in initial component render phase.
2. **Non-deterministic values:** Calling \`Date.now()\`, \`Math.random()\`, or unsynchronized timestamps.
3. **Invalid HTML nesting:** e.g., \`<p>\` containing a \`<div>\`, or \`<table>\` without \`<tbody>\`.

#### Recommended Mitigation Pattern:

\`\`\`jsx
  import { useEffect, useState } from 'react';

  export function ClientOnlyMetric({ value }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      // Only executed on client after hydration completes
      setMounted(true);
    }, []);

    if (!mounted) {
      return <span className="skeleton-placeholder" aria-hidden="true" />;
    }

    return <span className="telemetry-value">{value}</span>;
  }
\`\`\`

*Diagnostic tip:* Run your build with \`NODE_ENV=development\` to view detailed diff trees in the browser DevTools console.`},{triggers:["architecture","microservice","system","scale","backend"],response:`### Neural System Blueprint: Resilient Event-Driven Mesh

To construct a high-throughput backend supporting real-time neural streaming and autonomous agents:

#### Architecture Topology:
- **Edge Gateway:** Envoy or Cloudflare Workers performing TLS termination and mTLS routing.
- **WebSocket / SSE Ingress:** Node.js Fastify instance managing persistent bidirectional streams.
- **Message Bus:** Apache Kafka or Redis Streams for decoupling chat ingestion from LLM inference.
- **Worker Pools:** Asynchronous Python / Go microservices processing embeddings and vector searches.

\`\`\`text
[ Client Client ] <--- SSE / WSS ---> [ API Gateway / Fastify ]
                                              |
                                      (Event Dispatch)
                                              v
                                      [ Redis Stream ]
                                              |
                    +-------------------------+-------------------------+
                    v                                                   v
           [ Agent Executor ]                                  [ Telemetry Logger ]
                    |                                                   |
                    v                                                   v
         [ Inference Engine / Vector DB ]                         [ TimeSeries DB ]
\`\`\`

All message buffers in NOVA are structured to facilitate drop-in connection to this exact Express/Fastify topology.`}];function Te(g){const e=g.toLowerCase();for(const t of Ie)if(t.triggers.some(i=>e.includes(i)))return t.response;return`### Neural Synthesis: Query Processing Complete

Analyzing query parameters: **"${g.slice(0,60)}${g.length>60?"...":""}"**

NOVA Core has verified local telemetry. In this frontend demonstration environment, all neural cognitive routines operate inside the browser's execution context.

#### Key Inferences:
- **Context Depth:** Multi-turn session states are preserved in local storage.
- **3D Neural Core:** Shader displacement and harmonic frequency reflect acoustic and cognitive states.
- **Extensibility:** The API adapter layer is modularized for rapid integration with an active Node.js/Express server.

Here is an example client integration snippet for connecting to a live backend endpoint:

\`\`\`javascript
// Seamless transition to Node.js/Express:
async function queryLiveBackend(userPrompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userPrompt })
  });
  const data = await response.json();
  return data.reply;
}
\`\`\`

Ready for next sequence. Ask a technical question, test voice commands, or explore the **Website Studio** preview.`}class Re{constructor(){this.isDemoMode=!0,this.backendEndpoint="/api/chat",this.activeStreamAbort=null}sendMessageStream({prompt:e,history:t=[],onStartThinking:i,onChunk:n,onComplete:o,onError:s}){this.activeStreamAbort&&(this.activeStreamAbort(),this.activeStreamAbort=null);let a=!1;return this.activeStreamAbort=()=>{a=!0},this.isDemoMode?((async()=>{try{i&&i();const r=Math.floor(Math.random()*350)+500;if(await new Promise(f=>setTimeout(f,r)),a)return;const p=Te(e).split(" ");let c="";for(let f=0;f<p.length;f++){if(a)return;const m=p[f];c+=(f===0?"":" ")+m,n&&n(c,m);let A=22+Math.floor(Math.random()*20);(m.endsWith(".")||m.endsWith(":")||m.includes(`
`))&&(A+=40),await new Promise(R=>setTimeout(R,A))}if(a)return;const h={role:"assistant",content:c,simulated:!0,timestamp:new Date().toISOString()};o&&o(h)}catch(r){!a&&s&&s(r.message||"Simulated streaming error")}finally{this.activeStreamAbort=null}})(),this.activeStreamAbort):(this._streamFromLiveBackend(e,t,i,n,o,s,()=>a),this.activeStreamAbort)}async _streamFromLiveBackend(e,t,i,n,o,s,a){try{i&&i();const r=await fetch(this.backendEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:e,history:t})});if(!r.ok)throw new Error(`HTTP Error: ${r.status}`);const l=r.body.getReader(),p=new TextDecoder("utf-8");let c="";for(;;){if(a()){l.cancel();return}const{value:h,done:f}=await l.read();if(f)break;const m=p.decode(h,{stream:!0});c+=m,n&&n(c,m)}o&&o({role:"assistant",content:c,simulated:!1,timestamp:new Date().toISOString()})}catch(r){!a()&&s&&s(r.message)}}}const _e=new Re;class Ne{constructor(){this.recognition=null,this.isRecognizing=!1,this.synth=typeof window<"u"?window.speechSynthesis:null,this.currentUtterance=null,this.isMuted=!1,this.voices=[],this.onListeningStateChange=null,this.onSpeakingStateChange=null,this.onTranscript=null,this.onError=null,this.initRecognition(),this.initVoices()}initRecognition(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){this.recognition=null;return}try{this.recognition=new e,this.recognition.continuous=!1,this.recognition.interimResults=!0,this.recognition.lang="en-US",this.recognition.onstart=()=>{this.isRecognizing=!0,this.onListeningStateChange&&this.onListeningStateChange(!0)},this.recognition.onresult=t=>{let i="",n="";for(let a=t.resultIndex;a<t.results.length;++a)t.results[a].isFinal?n+=t.results[a][0].transcript:i+=t.results[a][0].transcript;const o=n||i,s=!!n;this.onTranscript&&this.onTranscript(o,s)},this.recognition.onerror=t=>{console.warn("[Speech] Recognition error:",t.error);let i="Voice recognition error.";switch(t.error){case"not-allowed":case"permission-denied":i="Microphone permission denied. Please allow microphone access in your browser settings.";break;case"no-speech":i="No speech was detected. Tap mic to retry.";break;case"network":i="Speech recognition network error.";break;case"audio-capture":i="No microphone was found on this device.";break;default:i=`Voice recognition error: ${t.error}`}this.onError&&this.onError(i),this.stopListening()},this.recognition.onend=()=>{this.isRecognizing=!1,this.onListeningStateChange&&this.onListeningStateChange(!1)}}catch(t){console.warn("[Speech] Failed to initialize SpeechRecognition:",t),this.recognition=null}}isRecognitionSupported(){return!!this.recognition}startListening(){if(!this.recognition)return this.onError&&this.onError("Voice input is not supported in this browser. Please use keyboard input."),!1;this.stopSpeaking();try{return this.recognition.start(),!0}catch(e){return e.name==="InvalidStateError"?this.recognition.stop():this.onError&&this.onError("Unable to start speech recognition."),!1}}stopListening(){if(this.recognition&&this.isRecognizing)try{this.recognition.stop()}catch{}this.isRecognizing=!1,this.onListeningStateChange&&this.onListeningStateChange(!1)}initVoices(){if(!this.synth)return;const e=()=>{this.voices=this.synth.getVoices()};e(),this.synth.onvoiceschanged!==void 0&&(this.synth.onvoiceschanged=e)}getVoices(){return this.synth?(this.voices.length===0&&(this.voices=this.synth.getVoices()),this.voices):[]}setMuted(e){this.isMuted=e,this.isMuted&&this.stopSpeaking()}cleanTextForSpeech(e){if(!e)return"";let t=e.replace(/```[\s\S]*?```/g," [Code omitted for audio] ");return t=t.replace(/`([^`]+)`/g,"$1"),t=t.replace(/\*\*([^*]+)\*\*/g,"$1"),t=t.replace(/\*([^*]+)\*/g,"$1"),t=t.replace(/\[([^\]]+)\]\([^\)]+\)/g,"$1"),t=t.replace(/<[^>]+>/g,""),t.replace(/\s+/g," ").trim()}speak(e,{voiceURI:t,rate:i=1,pitch:n=1}={}){if(!this.synth||this.isMuted)return;this.stopSpeaking();const o=this.cleanTextForSpeech(e);if(o)try{const s=new SpeechSynthesisUtterance(o);if(s.rate=Math.max(.5,Math.min(2,i)),s.pitch=Math.max(.5,Math.min(1.8,n)),t){const a=this.getVoices().find(r=>r.voiceURI===t);a&&(s.voice=a)}s.onstart=()=>{this.onSpeakingStateChange&&this.onSpeakingStateChange(!0)},s.onend=()=>{this.currentUtterance=null,this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)},s.onerror=a=>{a.error!=="interrupted"&&a.error!=="canceled"&&console.warn("[Speech] Synthesis error:",a),this.currentUtterance=null,this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)},this.currentUtterance=s,this.synth.speak(s)}catch(s){console.warn("[Speech] Could not speak text:",s),this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)}}stopSpeaking(){if(this.synth)try{this.synth.cancel()}catch{}this.currentUtterance=null,this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)}isSpeaking(){return!!(this.synth&&this.synth.speaking)}}const y=new Ne,w={SESSIONS:"nova_conversations_v1",ACTIVE_SESSION:"nova_active_session_id_v1",SETTINGS:"nova_settings_v1",TELEMETRY:"nova_telemetry_v1"},H={ttsEnabled:!0,voiceURI:"",speechRate:1,speechPitch:1,quality:"high",reducedMotion:!1,particleDensity:"high",themeAccent:"cyan",showHud:!0};class Pe{constructor(){this.settings=this.loadSettings()}loadSettings(){try{const e=localStorage.getItem(w.SETTINGS);if(e)return{...H,...JSON.parse(e)}}catch(e){console.warn("[Storage] Failed to read settings, using defaults:",e)}return{...H}}saveSettings(e){this.settings={...this.settings,...e};try{localStorage.setItem(w.SETTINGS,JSON.stringify(this.settings))}catch(t){console.error("[Storage] Error saving settings:",t)}return this.settings}getSessions(){try{const e=localStorage.getItem(w.SESSIONS);if(e){const t=JSON.parse(e);return Array.isArray(t)?t:[]}}catch(e){console.warn("[Storage] Failed to load sessions:",e)}return[]}saveSessions(e){try{localStorage.setItem(w.SESSIONS,JSON.stringify(e))}catch(t){console.error("[Storage] Error saving sessions:",t)}}getActiveSessionId(){try{return localStorage.getItem(w.ACTIVE_SESSION)||null}catch{return null}}setActiveSessionId(e){try{localStorage.setItem(w.ACTIVE_SESSION,e)}catch(t){console.warn("[Storage] Error saving active session id:",t)}}createSession(e="New Neural Session"){const t=this.getSessions(),i={id:`session_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,title:e,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),messages:[]};return t.unshift(i),this.saveSessions(t),this.setActiveSessionId(i.id),i}getSession(e){return this.getSessions().find(i=>i.id===e)||null}updateSessionMessages(e,t){const i=this.getSessions(),n=i.findIndex(o=>o.id===e);if(n!==-1){if(i[n].messages=t,i[n].updatedAt=new Date().toISOString(),i[n].title==="New Neural Session"&&t.length>0){const o=t.find(s=>s.role==="user");if(o){const s=o.content.trim().slice(0,36);i[n].title=s+(o.content.length>36?"...":"")}}this.saveSessions(i)}}deleteSession(e){let t=this.getSessions();if(t=t.filter(i=>i.id!==e),this.saveSessions(t),this.getActiveSessionId()===e){const i=t.length>0?t[0].id:null;i?this.setActiveSessionId(i):localStorage.removeItem(w.ACTIVE_SESSION)}return t}clearAllData(){try{localStorage.removeItem(w.SESSIONS),localStorage.removeItem(w.ACTIVE_SESSION),localStorage.removeItem(w.SETTINGS),localStorage.removeItem(w.TELEMETRY),this.settings={...H}}catch(e){console.error("[Storage] Error clearing storage:",e)}}exportDataJson(){const e={exportedAt:new Date().toISOString(),app:"NOVA AI Workspace",settings:this.settings,sessions:this.getSessions()};return JSON.stringify(e,null,2)}}const u=new Pe;class Ve{constructor(){this.container=null,this.init()}init(){this.container=document.createElement("div"),this.container.className="toast-container",this.container.setAttribute("aria-live","polite"),document.body.appendChild(this.container)}show(e,t="info",i=3800){if(!this.container)return;const n=document.createElement("div");n.className=`toast toast-${t}`,n.setAttribute("role","alert");let o=d.info;t==="success"&&(o=d.check),t==="error"&&(o=d.close),t==="warning"&&(o=d.info),n.innerHTML=`
      <div class="toast-content">
        <span class="toast-icon">${o}</span>
        <span class="toast-message">${e}</span>
      </div>
      <button class="toast-close-btn" aria-label="Close notification">
        ${d.close}
      </button>
    `;const s=n.querySelector(".toast-close-btn"),a=()=>{n.classList.add("toast-fade-out"),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},250)};s.addEventListener("click",a),this.container.appendChild(n),i>0&&setTimeout(a,i)}success(e){this.show(e,"success")}error(e){this.show(e,"error",5e3)}warning(e){this.show(e,"warning",4500)}info(e){this.show(e,"info")}}const v=new Ve;class Be{constructor({container:e,neuralCore:t,onActivityLogged:i,onSessionChanged:n}){this.container=e,this.neuralCore=t,this.onActivityLogged=i||(()=>{}),this.onSessionChanged=n||(()=>{}),this.activeSessionId=null,this.messages=[],this.isStreaming=!1,this.scrollArea=null,this.textarea=null,this.btnSend=null,this.btnMic=null,this.btnStopSpeech=null,this.init()}init(){this._renderLayout(),this._bindEvents(),this._setupSpeechHooks(),this.loadActiveSession()}_renderLayout(){this.container.innerHTML=`
      <div class="chat-view-container">
        <!-- Scrollable Messages Area -->
        <div class="chat-messages-scroll" id="chatScrollArea">
          <!-- Dynamic messages or welcome screen will be injected here -->
        </div>

        <!-- Anchored Message Composer -->
        <div class="anchored-composer-wrapper">
          <form class="composer-box" id="composerForm">
            <textarea
              class="composer-textarea"
              id="composerTextarea"
              rows="1"
              placeholder="Ask NOVA anything, explore code, or click mic..."
              aria-label="Message input"
            ></textarea>

            <div class="composer-controls">
              <!-- Stop Speech Button (Visible while speaking) -->
              <button
                type="button"
                class="btn-stop-speech"
                id="btnStopSpeech"
                title="Stop voice output"
                aria-label="Stop speech"
              >
                ${d.stop}
                <span>Stop</span>
              </button>

              <!-- Mic Button -->
              <button
                type="button"
                class="icon-btn btn-mic"
                id="btnMic"
                title="Voice input (Speech to Text)"
                aria-label="Toggle voice input"
              >
                ${d.mic}
              </button>

              <!-- Send Button -->
              <button
                type="submit"
                class="icon-btn btn-send"
                id="btnSend"
                title="Send message"
                aria-label="Send message"
                disabled
              >
                ${d.send}
              </button>
            </div>
          </form>

          <div class="composer-footer-note">
            <span>NOVA &bull; Living Intelligence &bull; Simulated local environment</span>
            <span>Enter &crarr; Send &bull; Shift+Enter &crarr; Newline</span>
          </div>
        </div>
      </div>
    `,this.scrollArea=this.container.querySelector("#chatScrollArea"),this.textarea=this.container.querySelector("#composerTextarea"),this.btnSend=this.container.querySelector("#btnSend"),this.btnMic=this.container.querySelector("#btnMic"),this.btnStopSpeech=this.container.querySelector("#btnStopSpeech")}_bindEvents(){const e=this.container.querySelector("#composerForm");this.textarea.addEventListener("input",()=>{this.textarea.style.height="auto";const t=Math.min(this.textarea.scrollHeight,120);this.textarea.style.height=`${t}px`,this.btnSend.disabled=!this.textarea.value.trim()||this.isStreaming}),this.textarea.addEventListener("keydown",t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),this.btnSend.disabled||e.dispatchEvent(new Event("submit",{cancelable:!0})))}),e.addEventListener("submit",t=>{t.preventDefault();const i=this.textarea.value.trim();!i||this.isStreaming||(this.textarea.value="",this.textarea.style.height="auto",this.btnSend.disabled=!0,this.sendMessage(i))}),this.btnMic.addEventListener("click",()=>{y.isRecognizing?y.stopListening():y.startListening()&&v.info("Listening for speech... Speak into your microphone.")}),this.btnStopSpeech.addEventListener("click",()=>{y.stopSpeaking(),this.btnStopSpeech.classList.remove("active"),this.neuralCore&&this.neuralCore.setState("idle"),v.info("Voice output stopped.")}),this.scrollArea.addEventListener("click",t=>{const i=t.target.closest(".copy-code-btn");if(i){const s=i.getAttribute("data-code-target"),a=document.getElementById(s);a&&navigator.clipboard.writeText(a.textContent).then(()=>{const r=i.querySelector(".copy-text");r&&(r.textContent="Copied!"),v.success("Code copied to clipboard."),setTimeout(()=>{r&&(r.textContent="Copy")},2e3)}).catch(()=>{v.error("Failed to copy code.")});return}const n=t.target.closest(".starter-chip");if(n){const s=n.getAttribute("data-prompt");s&&this.sendMessage(s);return}const o=t.target.closest(".btn-speak-msg");if(o){const s=o.getAttribute("data-text");if(s){const a=u.loadSettings();y.speak(s,{voiceURI:a.voiceURI,rate:a.speechRate,pitch:a.speechPitch})}return}})}_setupSpeechHooks(){y.onListeningStateChange=e=>{e?(this.btnMic.classList.add("listening"),this.neuralCore&&this.neuralCore.setState("listening"),this.onActivityLogged("Voice input: Listening for acoustic input...")):(this.btnMic.classList.remove("listening"),this.neuralCore&&this.neuralCore.state==="listening"&&this.neuralCore.setState("idle"))},y.onTranscript=(e,t)=>{this.textarea.value=e,this.textarea.style.height="auto",this.textarea.style.height=`${Math.min(this.textarea.scrollHeight,120)}px`,this.btnSend.disabled=!this.textarea.value.trim(),t&&this.onActivityLogged(`Transcript captured: "${e.slice(0,30)}..."`)},y.onSpeakingStateChange=e=>{e?(this.btnStopSpeech.classList.add("active"),this.neuralCore&&this.neuralCore.setState("speaking"),this.onActivityLogged("Voice synthesis: Speaking response...")):(this.btnStopSpeech.classList.remove("active"),this.neuralCore&&this.neuralCore.state==="speaking"&&this.neuralCore.setState("idle"))},y.onError=e=>{v.warning(e),this.onActivityLogged(`Speech event: ${e}`)}}loadActiveSession(){let e=u.getActiveSessionId(),t=e?u.getSession(e):null;t||(t=u.createSession()),this.activeSessionId=t.id,this.messages=t.messages||[],this.renderMessages(),this.onSessionChanged(t)}switchSession(e){const t=u.getSession(e);t&&(u.setActiveSessionId(e),this.activeSessionId=t.id,this.messages=t.messages||[],this.renderMessages(),this.onSessionChanged(t),this.onActivityLogged(`Switched session: ${t.title}`))}createNewChat(){const e=u.createSession("New Neural Session");this.activeSessionId=e.id,this.messages=[],this.renderMessages(),this.onSessionChanged(e),this.onActivityLogged("Initialized new chat session"),v.success("Started a fresh conversation."),this.textarea.focus()}renderMessages(){if(this.scrollArea){if(this.messages.length===0){this._renderWelcomeScreen();return}this.scrollArea.innerHTML="",this.messages.forEach(e=>{const t=this._createMessageRowElement(e);this.scrollArea.appendChild(t)}),this._scrollToBottom()}}_renderWelcomeScreen(){this.scrollArea.innerHTML=`
      <div class="chat-welcome">
        <div class="welcome-badge">
          ${d.sparkles}
          <span>Living Intelligence</span>
        </div>
        <h2 class="welcome-title">
          What shall we <span class="title-accent">create?</span>
        </h2>
        <p class="welcome-desc">
          I am NOVA, your living intelligence workspace. Query technical architecture, explore algorithmic models, craft web interfaces, or command with voice.
        </p>

        <div class="starter-prompts">
          <div class="starter-chip" data-prompt="Create the conceptual design for a luxury Michelin-star restaurant called AURA">
            <div class="chip-title">
              <span>Luxury Restaurant Design</span>
              ${d.studio}
            </div>
            <span class="chip-subtitle">Brand identity, sequence of service, and interactive reservation flow</span>
          </div>

          <div class="starter-chip" data-prompt="Explain Quantum Key Distribution and BB84 protocol with simulation code">
            <div class="chip-title">
              <span>Quantum Cryptography</span>
              ${d.sparkles}
            </div>
            <span class="chip-subtitle">Wavefunction collapse, photon polarization, and security proofs</span>
          </div>

          <div class="starter-chip" data-prompt="Analyze the architecture of a high-throughput event-driven system">
            <div class="chip-title">
              <span>System Architecture</span>
              ${d.cpu}
            </div>
            <span class="chip-subtitle">Kafka streaming, backpressure control, and distributed consensus</span>
          </div>
        </div>
      </div>
    `}_createMessageRowElement(e){const t=document.createElement("div");t.className=`message-row ${e.role}`;const i=new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),n=e.role==="assistant",o=n?`<div class="message-avatar" aria-label="NOVA">${d.assistant}</div>`:`<div class="message-avatar" aria-label="User">${d.user}</div>`,s=n?`
        <div class="message-meta">
          <span>NOVA CORE</span>
          <span>&bull;</span>
          <span>${i}</span>
          ${e.simulated?'<span class="simulated-pill">SIMULATED &bull; LOCAL</span>':""}
        </div>
      `:`
        <div class="message-meta">
          <span>OPERATOR</span>
          <span>&bull;</span>
          <span>${i}</span>
        </div>
      `,a=n?G(e.content):`<p>${this._escapeHtml(e.content)}</p>`,r=n?`
        <div class="message-actions-toolbar">
          <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(e.content)}" title="Read message aloud">
            ${d.volume}
            <span>Listen</span>
          </button>
        </div>
      `:"";return t.innerHTML=`
      ${o}
      <div class="message-bubble-wrap">
        ${s}
        <div class="message-bubble">
          ${a}
        </div>
        ${r}
      </div>
    `,t}sendMessage(e){if(!e.trim()||this.isStreaming)return;this.messages.length===0&&(this.scrollArea.innerHTML="");const t={role:"user",content:e,timestamp:new Date().toISOString()};this.messages.push(t),u.updateSessionMessages(this.activeSessionId,this.messages);const i=this._createMessageRowElement(t);this.scrollArea.appendChild(i),this._scrollToBottom(),this.onActivityLogged(`Dispatched query: "${e.slice(0,32)}..."`),this.isStreaming=!0,this.btnSend.disabled=!0;const n=document.createElement("div");n.className="message-row assistant";const o=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});n.innerHTML=`
      <div class="message-avatar" aria-label="NOVA">${d.assistant}</div>
      <div class="message-bubble-wrap">
        <div class="message-meta">
          <span>NOVA CORE</span>
          <span>&bull;</span>
          <span>${o}</span>
          <span class="simulated-pill">SIMULATED &bull; LOCAL</span>
        </div>
        <div class="message-bubble">
          <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `,this.scrollArea.appendChild(n),this._scrollToBottom();const s=n.querySelector(".message-bubble");_e.sendMessageStream({prompt:e,history:this.messages,onStartThinking:()=>{this.neuralCore&&this.neuralCore.setState("thinking"),this.onActivityLogged("Artifact state: THINKING (Orbital sequence active)")},onChunk:a=>{s.innerHTML=G(a),this._scrollToBottom()},onComplete:a=>{this.isStreaming=!1,this.btnSend.disabled=!this.textarea.value.trim(),s.innerHTML=G(a.content);const r=n.querySelector(".message-bubble-wrap"),l=document.createElement("div");l.className="message-actions-toolbar",l.innerHTML=`
          <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(a.content)}" title="Read message aloud">
            ${d.volume}
            <span>Listen</span>
          </button>
        `,r.appendChild(l),this.messages.push(a),u.updateSessionMessages(this.activeSessionId,this.messages),this.onSessionChanged(u.getSession(this.activeSessionId)),this.onActivityLogged("Response stream complete");const p=u.loadSettings();p.ttsEnabled?y.speak(a.content,{voiceURI:p.voiceURI,rate:p.speechRate,pitch:p.speechPitch}):this.neuralCore&&this.neuralCore.setState("idle")},onError:a=>{this.isStreaming=!1,this.btnSend.disabled=!this.textarea.value.trim(),s.innerHTML=`<p style="color: var(--status-error);">Error processing response: ${this._escapeHtml(a)}</p>`,this.neuralCore&&this.neuralCore.setState("idle"),v.error("Simulation streaming failed.")}})}_scrollToBottom(){requestAnimationFrame(()=>{this.scrollArea&&(this.scrollArea.scrollTop=this.scrollArea.scrollHeight)})}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}function $e(){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURA — Gastronomy in Void</title>
  <style>
    :root {
      --bg-dark: #0a0b10;
      --bg-card: #12131b;
      --gold: #dfb15b;
      --gold-light: #f7d58d;
      --gold-glow: rgba(223, 177, 91, 0.25);
      --text: #eaeef6;
      --text-muted: #8b92a4;
      --border: rgba(223, 177, 91, 0.2);
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-dark);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Ambient Glows */
    .ambience {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background: radial-gradient(circle at 50% 10%, rgba(223, 177, 91, 0.08) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }

    /* Header */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 11, 16, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 1.1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-mark {
      width: 28px;
      height: 28px;
      border: 1px solid var(--gold);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold);
      font-size: 0.8rem;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .brand-name {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      letter-spacing: 0.2em;
      color: #ffffff;
      text-transform: uppercase;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: color 0.2s;
    }

    nav a:hover { color: var(--gold); }

    .btn-reserve {
      background: transparent;
      border: 1px solid var(--gold);
      color: var(--gold);
      padding: 0.55rem 1.4rem;
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 2px;
      transition: all 0.3s;
    }

    .btn-reserve:hover {
      background: var(--gold);
      color: var(--bg-dark);
      box-shadow: 0 0 16px var(--gold-glow);
    }

    /* Hero Section */
    .hero {
      position: relative;
      z-index: 1;
      padding: 7rem 2rem 5rem;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }

    .badge-michelin {
      display: inline-block;
      border: 1px solid var(--border);
      background: rgba(223, 177, 91, 0.08);
      color: var(--gold-light);
      padding: 0.4rem 1.1rem;
      font-size: 0.72rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border-radius: 30px;
      margin-bottom: 2rem;
    }

    .hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(2.4rem, 5vw, 4.2rem);
      font-weight: 300;
      line-height: 1.15;
      letter-spacing: 0.04em;
      color: #ffffff;
      margin-bottom: 1.5rem;
    }

    .hero h1 span {
      font-style: italic;
      color: var(--gold);
    }

    .hero p {
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 620px;
      margin: 0 auto 2.5rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1.2rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: var(--gold);
      border: 1px solid var(--gold);
      color: var(--bg-dark);
      padding: 0.85rem 2rem;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: var(--gold-light);
      box-shadow: 0 0 25px var(--gold-glow);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 0.85rem 2rem;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      border-color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    /* Tasting Menu Section */
    .section-menu {
      position: relative;
      z-index: 1;
      padding: 5rem 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3.5rem;
    }

    .section-subtitle {
      color: var(--gold);
      font-size: 0.78rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-family: var(--font-serif);
      font-size: 2.2rem;
      font-weight: 300;
      letter-spacing: 0.05em;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 2rem;
    }

    .menu-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 2rem;
      border-radius: 4px;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .menu-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .menu-card:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .menu-card:hover::before { opacity: 1; }

    .menu-course-number {
      font-size: 0.72rem;
      color: var(--gold);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 0.6rem;
    }

    .menu-card-title {
      font-family: var(--font-serif);
      font-size: 1.35rem;
      margin-bottom: 0.65rem;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .menu-card-price {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      color: var(--gold);
      font-weight: normal;
    }

    .menu-card-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 1.2rem;
    }

    .menu-card-pairing {
      font-size: 0.75rem;
      color: #9da6be;
      border-top: 1px dashed rgba(255, 255, 255, 0.08);
      padding-top: 0.8rem;
      font-style: italic;
    }

    /* Philosophy / Chef Quote */
    .philosophy-banner {
      background: #0f1017;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 5rem 2rem;
      text-align: center;
      position: relative;
      z-index: 1;
      margin-top: 2rem;
    }

    .quote-content {
      max-width: 750px;
      margin: 0 auto;
    }

    .quote-text {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      font-style: italic;
      color: #e5e9f0;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .quote-author {
      font-size: 0.85rem;
      letter-spacing: 0.18em;
      color: var(--gold);
      text-transform: uppercase;
    }

    /* Reservation Modal */
    .res-modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 200;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .res-modal-backdrop.open { display: flex; }

    .res-modal {
      background: var(--bg-card);
      border: 1px solid var(--gold);
      width: 100%;
      max-width: 480px;
      padding: 2.2rem;
      border-radius: 4px;
      position: relative;
    }

    .res-modal-close {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.4rem;
      cursor: pointer;
    }

    .res-modal h3 {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }

    .res-modal p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.2rem;
      text-align: left;
    }

    .form-group label {
      display: block;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 0.4rem;
    }

    .form-group input, .form-group select {
      width: 100%;
      background: #090a0f;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 0.65rem 0.85rem;
      font-size: 0.9rem;
      border-radius: 2px;
    }

    .form-group input:focus, .form-group select:focus {
      border-color: var(--gold);
      outline: none;
    }

    /* Footer */
    footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 3rem 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
    }

    @media (max-width: 768px) {
      nav { display: none; }
      .hero { padding: 4rem 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="ambience"></div>

  <header>
    <div class="brand">
      <div class="brand-mark">&#9672;</div>
      <div class="brand-name">AURA</div>
    </div>
    <nav>
      <a href="#menu">Tasting Menu</a>
      <a href="#experience">Philosophy</a>
      <a href="#cellar">Cellar</a>
    </nav>
    <button class="btn-reserve" onclick="openReservationModal()">Reserve Table</button>
  </header>

  <main>
    <section class="hero">
      <div class="badge-michelin">&#9733;&#9733;&#9733; Three Michelin Stars &bull; 2026</div>
      <h1>Gastronomy at the <span>Outer Horizon</span></h1>
      <p>An immersive culinary odyssey fusing heritage Japanese techniques, hyper-seasonal wild botanicals, and celestial precision.</p>
      <div class="hero-actions">
        <button class="btn-primary" onclick="openReservationModal()">Book An Experience</button>
        <button class="btn-outline" onclick="document.getElementById('menu').scrollIntoView({behavior: 'smooth'})">View Tasting Menu</button>
      </div>
    </section>

    <section id="menu" class="section-menu">
      <div class="section-header">
        <div class="section-subtitle">Spring Equinox &bull; 14 Sequences</div>
        <h2 class="section-title">The Culinary Voyage</h2>
      </div>

      <div class="menu-grid">
        <div class="menu-card">
          <div class="menu-course-number">Sequence I</div>
          <div class="menu-card-title">
            <span>Starlight Broth</span>
            <span class="menu-card-price">$48</span>
          </div>
          <p class="menu-card-desc">Charcoal-clarified dashi infused with wild morels, winter kelp pearls, and 24k gold leaf infusion.</p>
          <div class="menu-card-pairing">Pairing: Junmai Daiginjo "Celestial Echo" 2021</div>
        </div>

        <div class="menu-card">
          <div class="menu-course-number">Sequence IV</div>
          <div class="menu-card-title">
            <span>Glacial A5 Wagyu</span>
            <span class="menu-card-price">$85</span>
          </div>
          <p class="menu-card-desc">Bincho-grilled Miyazaki tenderloin smoked over volcanic cedar, black winter truffle essence, ferment jus.</p>
          <div class="menu-card-pairing">Pairing: Domaine de la Romanée-Conti 2017</div>
        </div>

        <div class="menu-card">
          <div class="menu-course-number">Sequence VII</div>
          <div class="menu-card-title">
            <span>Nebula sphere</span>
            <span class="menu-card-price">$38</span>
          </div>
          <p class="menu-card-desc">Flash-frozen passionfruit caviar in a blown isomalt orb, yuzu blossom snow, and smoked vanilla cream.</p>
          <div class="menu-card-pairing">Pairing: Château d'Yquem Sauternes 2015</div>
        </div>
      </div>
    </section>

    <section id="experience" class="philosophy-banner">
      <div class="quote-content">
        <p class="quote-text">"We do not merely plate ingredients. We craft fleeting moments of resonance between ancient earth and the quiet expanse of space."</p>
        <div class="quote-author">— Executive Chef Kaelen Vance</div>
      </div>
    </section>
  </main>

  <!-- Reservation Modal -->
  <div id="resModal" class="res-modal-backdrop">
    <div class="res-modal">
      <button class="res-modal-close" onclick="closeReservationModal()">&times;</button>
      <h3>Reserve An Evening</h3>
      <p>Tables are released 30 days in advance. Select your seating.</p>
      
      <form onsubmit="handleReserve(event)">
        <div class="form-group">
          <label>Dining Experience</label>
          <select id="resExperience">
            <option>14-Course Main Salon ($295/guest)</option>
            <option>Chef's Counter & Cellar Pairing ($440/guest)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Guests</label>
          <select id="resGuests">
            <option>2 Guests</option>
            <option>4 Guests</option>
            <option>6 Guests (Private Alcove)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Preferred Date</label>
          <input type="date" required value="2026-11-15">
        </div>
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 0.5rem;">Confirm Table Request</button>
      </form>
    </div>
  </div>

  <footer>
    <p>&copy; 2026 AURA GASTRONOMY. ALL RIGHTS RESERVED. 840 CELESTIAL WAY, SAN FRANCISCO.</p>
  </footer>

  <script>
    function openReservationModal() {
      document.getElementById('resModal').classList.add('open');
    }
    function closeReservationModal() {
      document.getElementById('resModal').classList.remove('open');
    }
    function handleReserve(e) {
      e.preventDefault();
      alert('Reservation request submitted for AURA. In a production environment, this integrates with the table management API.');
      closeReservationModal();
    }
  <\/script>
</body>
</html>`}class De{constructor({container:e,onActivityLogged:t}){this.container=e,this.onActivityLogged=t||(()=>{}),this.currentDevice="desktop",this.sampleHtml=$e(),this.init()}init(){this._renderLayout(),this._bindEvents(),this.loadSample()}_renderLayout(){this.container.innerHTML=`
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
                ${d.desktop}
                <span>Desktop</span>
              </button>
              <button class="device-btn" data-device="tablet" title="Tablet view (768px)">
                ${d.tablet}
                <span>Tablet</span>
              </button>
              <button class="device-btn" data-device="mobile" title="Mobile view (390px)">
                ${d.mobile}
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <!-- Description Prompt Input & Primary Preview Button -->
          <div class="studio-prompt-bar">
            <div class="studio-input-wrap">
              ${d.sparkles}
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
              ${d.studio}
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
            ${d.info}
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
                  ${d.refresh}
                </button>
                <button class="browser-btn" id="btnOpenNewTab" title="Open sample in new tab" aria-label="Open in new window">
                  ${d.externalLink}
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
    `}_bindEvents(){const e=this.container.querySelector("#studioPromptInput"),t=this.container.querySelector("#btnPreviewSample");this.container.querySelector("#studioIframe");const i=this.container.querySelector("#browserMockFrame"),n=this.container.querySelector("#btnReloadSample"),o=this.container.querySelector("#btnOpenNewTab"),s=this.container.querySelectorAll(".device-btn");s.forEach(r=>{r.addEventListener("click",()=>{s.forEach(p=>p.classList.remove("active")),r.classList.add("active");const l=r.getAttribute("data-device");this.currentDevice=l,i.setAttribute("data-device",l),this.onActivityLogged(`Website Studio viewport switched: ${l.toUpperCase()}`)})}),t.addEventListener("click",()=>{this.loadSample(),v.success("Loaded AURA Gastronomy sample showcase."),this.onActivityLogged("Website Studio: Rendered bundled restaurant sample")}),this.container.querySelectorAll(".studio-chip").forEach(r=>{r.addEventListener("click",()=>{const l=r.getAttribute("data-sample");l==="aura"?(e.value="Design a 3-Michelin-star luxury tasting restaurant website with reservations and celestial branding",this.loadSample(),v.info("Viewing bundled AURA Gastronomy showcase.")):l==="cyberpunk"?(e.value="Create a dystopian cyberpunk streetwear storefront with 3D product previews and neon glitch typography",v.info("Concept prompt applied. In production, this invokes live LLM code synthesis.")):l==="nexus"&&(e.value="Architect a developer-first quantum cloud computing platform with live latency telemetry",v.info("Concept prompt applied. In production, this invokes live LLM code synthesis."))})}),n.addEventListener("click",()=>{this.loadSample(),v.info("Sample frame refreshed.")}),o.addEventListener("click",()=>{const r=new Blob([this.sampleHtml],{type:"text/html"}),l=URL.createObjectURL(r);window.open(l,"_blank"),this.onActivityLogged("Opened sample website in new browser tab")})}loadSample(){const e=this.container.querySelector("#studioIframe");e&&(e.srcdoc=this.sampleHtml)}}class Oe{constructor({container:e,onSelectSession:t,onNewSession:i,onActivityLogged:n}){this.container=e,this.onSelectSession=t||(()=>{}),this.onNewSession=i||(()=>{}),this.onActivityLogged=n||(()=>{}),this.searchQuery="",this.init()}init(){this._renderLayout(),this._bindEvents(),this.refresh()}_renderLayout(){this.container.innerHTML=`
      <div class="modal-dialog" style="max-width: 620px; width: 100%; margin: 1.5rem auto; height: calc(100% - 3rem);">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${d.history}
            <span class="modal-title">Conversation Archive</span>
          </div>

          <button class="btn-primary" id="btnHistoryNewChat">
            ${d.plus}
            <span>New Chat</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Search Bar -->
          <div class="history-search-bar">
            ${d.search}
            <input
              type="text"
              class="history-search-input"
              id="historySearchInput"
              placeholder="Search past conversations..."
              aria-label="Search conversation history"
            />
          </div>

          <!-- History List Container -->
          <div class="history-list" id="historyListContainer">
            <!-- Dynamic items rendered here -->
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <span class="hud-hint" id="historyTotalCount">0 conversations saved locally</span>
          <button class="btn-danger" id="btnClearAllHistory">
            ${d.trash}
            <span>Clear All History</span>
          </button>
        </div>
      </div>
    `}_bindEvents(){const e=this.container.querySelector("#historySearchInput"),t=this.container.querySelector("#btnHistoryNewChat"),i=this.container.querySelector("#btnClearAllHistory"),n=this.container.querySelector("#historyListContainer");e.addEventListener("input",o=>{this.searchQuery=o.target.value.toLowerCase().trim(),this.renderList()}),t.addEventListener("click",()=>{this.onNewSession()}),i.addEventListener("click",()=>{window.confirm("Are you sure you want to permanently clear all stored conversations? This cannot be undone.")&&(u.saveSessions([]),u.setActiveSessionId(null),this.onNewSession(),this.refresh(),this.onActivityLogged("Cleared all conversation history"),v.warning("All conversation records deleted."))}),n.addEventListener("click",o=>{const s=o.target.closest(".btn-delete-session");if(s){o.stopPropagation();const r=s.getAttribute("data-session-id");r&&(u.deleteSession(r),this.refresh(),this.onActivityLogged(`Deleted conversation: ${r}`),v.info("Conversation removed."));return}const a=o.target.closest(".history-item");if(a){const r=a.getAttribute("data-session-id");r&&this.onSelectSession(r)}})}refresh(){this.renderList()}renderList(){const e=this.container.querySelector("#historyListContainer"),t=this.container.querySelector("#historyTotalCount");if(!e)return;let i=u.getSessions();const n=u.getActiveSessionId();if(t&&(t.textContent=`${i.length} conversation${i.length===1?"":"s"} stored in browser`),this.searchQuery&&(i=i.filter(o=>{const s=o.title&&o.title.toLowerCase().includes(this.searchQuery),a=o.messages&&o.messages.some(r=>r.content&&r.content.toLowerCase().includes(this.searchQuery));return s||a})),i.length===0){e.innerHTML=`
        <div class="history-empty-text">
          <p>No conversations found.</p>
          <span style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.4rem; display: block;">
            Start asking NOVA questions to build your archive.
          </span>
        </div>
      `;return}e.innerHTML="",i.forEach(o=>{const s=new Date(o.updatedAt||o.createdAt).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),a=(o.messages||[]).length,r=o.id===n,l=document.createElement("div");l.className=`history-item ${r?"active":""}`,l.setAttribute("data-session-id",o.id),l.setAttribute("role","button"),l.setAttribute("tabindex","0"),l.innerHTML=`
        <div class="history-item-meta">
          <span class="history-item-title">${this._escapeHtml(o.title||"Untitled Session")}</span>
          <span class="history-item-sub">${s} &bull; ${a} message${a===1?"":"s"}${r?" &bull; [ACTIVE]":""}</span>
        </div>

        <div class="history-item-actions">
          <button
            class="icon-btn btn-delete-session"
            data-session-id="${o.id}"
            title="Delete this conversation"
            aria-label="Delete conversation"
            style="width: 28px; height: 28px; color: var(--text-dim);"
          >
            ${d.trash}
          </button>
        </div>
      `,e.appendChild(l)})}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}class Ge{constructor({neuralCore:e,onSettingsUpdated:t,onActivityLogged:i}){this.neuralCore=e,this.onSettingsUpdated=t||(()=>{}),this.onActivityLogged=i||(()=>{}),this.backdrop=null,this.isOpen=!1,this.init()}init(){this.backdrop=document.createElement("div"),this.backdrop.className="modal-backdrop",this.backdrop.setAttribute("role","dialog"),this.backdrop.setAttribute("aria-modal","true"),this.backdrop.setAttribute("aria-label","System Settings"),this._render(),document.body.appendChild(this.backdrop),this._bindEvents()}_render(){const e=u.loadSettings();this.backdrop.innerHTML=`
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${d.settings}
            <span class="modal-title">System Settings</span>
          </div>
          <button class="icon-btn btn-modal-close" aria-label="Close settings">
            ${d.close}
          </button>
        </div>

        <div class="modal-body">
          <!-- Voice & Audio Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${d.volume}
              <span>Speech & Acoustic Synthesis</span>
            </div>

            <!-- Voice Output Toggle -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Voice Output (TTS)</span>
                <span class="setting-desc">Read assistant responses aloud automatically</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="settingTtsToggle" ${e.ttsEnabled?"checked":""} />
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
                  value="${e.speechRate||1}"
                />
                <span class="slider-val-tag" id="valSpeechRate">${e.speechRate||1}x</span>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="button" class="btn-secondary" id="btnTestVoice" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
                ${d.volume}
                <span style="margin-left: 0.35rem;">Test Voice Output</span>
              </button>
            </div>
          </div>

          <!-- Graphics & Animation Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${d.cpu}
              <span>3D Engine & Motion</span>
            </div>

            <!-- Reduced Motion Toggle -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Reduced Motion</span>
                <span class="setting-desc">Disable continuous 3D loop & orbital animation</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="settingReducedMotion" ${e.reducedMotion?"checked":""} />
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
                <option value="cyan" ${e.themeAccent==="cyan"?"selected":""}>Ice Blue (Default)</option>
                <option value="violet" ${e.themeAccent==="violet"?"selected":""}>Nebula Violet</option>
                <option value="emerald" ${e.themeAccent==="emerald"?"selected":""}>Bioluminescent Emerald</option>
              </select>
            </div>
          </div>

          <!-- Local Storage & Reset Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${d.history}
              <span>Data & Privacy</span>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Export Archive</span>
                <span class="setting-desc">Download all local conversations and preferences as JSON</span>
              </div>
              <button type="button" class="btn-secondary" id="btnExportData">
                ${d.download}
                <span style="margin-left: 0.35rem;">Export JSON</span>
              </button>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Reset Local Data</span>
                <span class="setting-desc">Permanently wipe conversation records and restore defaults</span>
              </div>
              <button type="button" class="btn-danger" id="btnResetData">
                ${d.trash}
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
    `,this._populateVoices()}_populateVoices(){const e=this.backdrop.querySelector("#settingVoiceSelect");if(!e)return;const t=y.getVoices(),i=u.loadSettings().voiceURI;e.innerHTML='<option value="">Default System Voice</option>',t.forEach(n=>{const o=document.createElement("option");o.value=n.voiceURI,o.textContent=`${n.name} (${n.lang})`,n.voiceURI===i&&(o.selected=!0),e.appendChild(o)})}_bindEvents(){this.backdrop.querySelectorAll(".btn-modal-close").forEach(c=>c.addEventListener("click",()=>this.close())),this.backdrop.addEventListener("click",c=>{c.target===this.backdrop&&this.close()}),window.addEventListener("keydown",c=>{c.key==="Escape"&&this.isOpen&&this.close()}),this.backdrop.querySelector("#settingTtsToggle").addEventListener("change",c=>{u.saveSettings({ttsEnabled:c.target.checked}),this.onActivityLogged(`Voice output ${c.target.checked?"enabled":"disabled"}`)}),this.backdrop.querySelector("#settingVoiceSelect").addEventListener("change",c=>{u.saveSettings({voiceURI:c.target.value}),this.onActivityLogged("Voice persona updated")});const n=this.backdrop.querySelector("#settingSpeechRate"),o=this.backdrop.querySelector("#valSpeechRate");n.addEventListener("input",c=>{const h=parseFloat(c.target.value);o.textContent=`${h.toFixed(2)}x`,u.saveSettings({speechRate:h})}),this.backdrop.querySelector("#btnTestVoice").addEventListener("click",()=>{const c=u.loadSettings();y.speak("NOVA neural audio engine operational. All acoustic parameters calibrated.",{voiceURI:c.voiceURI,rate:c.speechRate})}),this.backdrop.querySelector("#settingReducedMotion").addEventListener("change",c=>{const h=c.target.checked;u.saveSettings({reducedMotion:h}),this.neuralCore&&this.neuralCore.setReducedMotion(h),this.onActivityLogged(`Reduced motion ${h?"enabled":"disabled"}`),v.info(`3D motion ${h?"paused":"resumed"}.`)}),this.backdrop.querySelector("#settingThemeAccent").addEventListener("change",c=>{const h=c.target.value;u.saveSettings({themeAccent:h}),document.documentElement.setAttribute("data-theme-accent",h),v.info(`Theme accent changed to ${h}.`),this.onActivityLogged(`Applied theme accent: ${h}`)}),this.backdrop.querySelector("#btnExportData").addEventListener("click",()=>{const c=u.exportDataJson(),h=new Blob([c],{type:"application/json"}),f=URL.createObjectURL(h),m=document.createElement("a");m.href=f,m.download=`nova-workspace-${new Date().toISOString().slice(0,10)}.json`,m.click(),URL.revokeObjectURL(f),v.success("Workspace archive downloaded."),this.onActivityLogged("Exported local conversation archive")}),this.backdrop.querySelector("#btnResetData").addEventListener("click",()=>{window.confirm("DANGER: This will permanently wipe all local sessions, preferences, and reset NOVA to factory state. Proceed?")&&(u.clearAllData(),v.warning("All local data cleared. Refreshing workspace."),setTimeout(()=>{window.location.reload()},1200))})}open(){this._populateVoices(),this.isOpen=!0,this.backdrop.classList.add("open")}close(){this.isOpen=!1,this.backdrop.classList.remove("open"),this.onSettingsUpdated(u.loadSettings())}}class He{constructor({sidebarElement:e,onViewChange:t,onOpenSettings:i,onNewChat:n,onActivityLogged:o}){this.sidebar=e,this.onViewChange=t||(()=>{}),this.onOpenSettings=i||(()=>{}),this.onNewChat=n||(()=>{}),this.onActivityLogged=o||(()=>{}),this.activeView="assistant",this.init()}init(){this._renderLayout(),this._bindEvents()}_renderLayout(){this.sidebar.innerHTML=`
      <!-- Top Navigation Dock Items -->
      <div class="sidebar-nav-group">
        <!-- Assistant Nav Item (Default active) -->
        <button
          type="button"
          class="nav-item active"
          data-view="assistant"
          title="Command Studio & Artifact"
          aria-label="Command Studio"
        >
          <span class="nav-icon">${d.assistant}</span>
        </button>

        <!-- Website Studio Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="studio"
          title="Autonomous Website Studio"
          aria-label="Website Studio"
        >
          <span class="nav-icon">${d.studio}</span>
        </button>

        <!-- Conversation History Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="history"
          title="Conversation Archive"
          aria-label="Conversation Archive"
        >
          <span class="nav-icon">${d.history}</span>
        </button>

        <!-- Settings Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-action="settings"
          title="System Preferences"
          aria-label="System Preferences"
        >
          <span class="nav-icon">${d.settings}</span>
        </button>
      </div>

      <!-- Bottom Dock Actions -->
      <div class="sidebar-footer">
        <!-- New Chat Trigger Button -->
        <button
          type="button"
          class="nav-item"
          id="btnSidebarNewChat"
          title="Start fresh conversation"
          aria-label="New Conversation"
          style="background: rgba(0, 240, 255, 0.08); border-color: var(--border-subtle); color: var(--accent-cyan);"
        >
          <span class="nav-icon">${d.plus}</span>
        </button>
      </div>
    `}_bindEvents(){const e=this.sidebar.querySelectorAll(".nav-item"),t=this.sidebar.querySelector("#btnSidebarNewChat");e.forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-view");if(i.getAttribute("data-action")==="settings"){this.onOpenSettings();return}n&&this.setActiveView(n)})}),t&&t.addEventListener("click",()=>{this.setActiveView("assistant"),this.onNewChat()})}setActiveView(e){if(this.activeView===e&&e!=="history")return;this.activeView=e,this.sidebar.querySelectorAll(".nav-item[data-view]").forEach(i=>{i.getAttribute("data-view")===e?i.classList.add("active"):i.classList.remove("active")}),this.onViewChange(e),this.onActivityLogged(`Navigated: ${e.toUpperCase()} View`)}}class qe{constructor(){this.neuralCore=null,this.fallbackCore=null,this.chat=null,this.studio=null,this.historyView=null,this.settingsModal=null,this.navigation=null,this.init()}init(){const e=u.loadSettings();e.themeAccent&&document.documentElement.setAttribute("data-theme-accent",e.themeAccent);const t=s=>{};try{const s=document.getElementById("appSidebar");s&&(this.navigation=new He({sidebarElement:s,onViewChange:a=>this._switchView(a),onOpenSettings:()=>this._openSettings(),onNewChat:()=>{this.chat&&this.chat.createNewChat()},onActivityLogged:t}))}catch(s){console.error("[NOVA] Navigation initialization failed:",s)}try{const s=document.getElementById("chatInterfaceContainer");s&&(this.chat=new Be({container:s,neuralCore:null,onActivityLogged:t,onSessionChanged:a=>{this.historyView&&this.historyView.refresh()}}))}catch(s){console.error("[NOVA] ChatInterface initialization failed:",s)}try{const s=document.getElementById("viewStudio");s&&(this.studio=new De({container:s,onActivityLogged:t}))}catch(s){console.error("[NOVA] WebsiteStudio initialization failed:",s)}try{const s=document.getElementById("viewHistory");s&&(this.historyView=new Oe({container:s,onSelectSession:a=>{this.navigation&&this.navigation.setActiveView("assistant"),this.chat&&this.chat.switchSession(a)},onNewSession:()=>{this.navigation&&this.navigation.setActiveView("assistant"),this.chat&&this.chat.createNewChat()},onActivityLogged:t}))}catch(s){console.error("[NOVA] HistoryView initialization failed:",s)}try{this.settingsModal=new Ge({neuralCore:null,onSettingsUpdated:s=>{this.neuralCore&&(this.neuralCore.setReducedMotion(s.reducedMotion),this._updateReduceEffectsButtons(s.reducedMotion))},onActivityLogged:t})}catch(s){console.error("[NOVA] SettingsModal initialization failed:",s)}try{const s=document.getElementById("neuralStageContainer");s&&(this.neuralCore=new z(s,{reducedMotion:e.reducedMotion,quality:e.quality,themeAccent:e.themeAccent,onFpsUpdate:a=>this._onFpsUpdate(a)}),this.chat&&(this.chat.neuralCore=this.neuralCore),this.settingsModal&&(this.settingsModal.neuralCore=this.neuralCore))}catch(s){console.error("[NOVA] 3D NeuralCore initialization failed, rendering fallback:",s);const a=document.getElementById("neuralStageContainer");a&&(this.fallbackCore=new q(a))}this._setupHeaderControls(),this._setupStageInteractivity(),this._setupCoreStateSync(),window.addEventListener("hashchange",()=>{const s=window.location.hash.replace("#","");["assistant","studio","history"].includes(s)?this.navigation&&this.navigation.setActiveView(s):s==="settings"&&this._openSettings()});const i=window.location.hash.replace("#","");["assistant","studio","history"].includes(i)?this.navigation&&this.navigation.setActiveView(i):i==="settings"&&this._openSettings();const o=new URLSearchParams(window.location.search).get("prompt");o&&this.chat&&setTimeout(()=>{this.chat.sendMessage(decodeURIComponent(o))},400)}_openSettings(){this.settingsModal&&this.settingsModal.open()}_switchView(e){const t={assistant:document.getElementById("viewAssistant"),studio:document.getElementById("viewStudio"),history:document.getElementById("viewHistory")};Object.keys(t).forEach(i=>{t[i]&&(i===e?t[i].classList.add("active"):t[i].classList.remove("active"))}),e==="history"&&this.historyView&&this.historyView.refresh()}_setupHeaderControls(){const e=document.getElementById("btnGlobalMute"),t=document.getElementById("iconMute");let i=!1;e&&t&&e.addEventListener("click",()=>{i=!i,y.setMuted(i),i?(e.classList.add("active"),t.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line>',v.info("Voice synthesis muted.")):(e.classList.remove("active"),t.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',v.info("Voice synthesis active."))});const n=document.getElementById("btnHeaderSettings");n&&n.addEventListener("click",()=>{this._openSettings()});const o=document.getElementById("btnReduceEffects");o&&o.addEventListener("click",()=>{if(!this.neuralCore)return;const h=!this.neuralCore.options.reducedMotion;this.neuralCore.setReducedMotion(h),u.saveSettings({reducedMotion:h}),this._updateReduceEffectsButtons(h),v.info(h?"3D Motion paused (Reduced motion)":"3D Motion active")});const s=document.getElementById("btnMobileMenu"),a=document.getElementById("appSidebar");s&&a&&s.addEventListener("click",()=>{a.classList.toggle("expanded")});const r=document.getElementById("btnDemoInfo"),l=document.getElementById("demoNoticeModal"),p=document.getElementById("btnCloseDemoModal"),c=document.getElementById("btnDismissDemoModal");if(r&&l){const h=()=>l.classList.add("open"),f=()=>l.classList.remove("open");r.addEventListener("click",h),p&&p.addEventListener("click",f),c&&c.addEventListener("click",f),l.addEventListener("click",m=>{m.target===l&&f()})}}_setupStageInteractivity(){const e=document.getElementById("btnRecenterCore"),t=document.getElementById("btnToggleMotion");e&&this.neuralCore&&e.addEventListener("click",()=>{this.neuralCore.recenterPerspective(),v.info("Sculpture perspective re-centered.")}),t&&this.neuralCore&&t.addEventListener("click",()=>{const i=!this.neuralCore.options.reducedMotion;this.neuralCore.setReducedMotion(i),u.saveSettings({reducedMotion:i}),this._updateReduceEffectsButtons(i),v.info(i?"3D Motion paused":"3D Motion active")})}_updateReduceEffectsButtons(e){const t=document.getElementById("labelReduceEffects"),i=document.getElementById("motionToggleLabel");t&&(t.textContent=e?"Resume Motion":"Pause Motion"),i&&(i.textContent=e?"Resume":"Pause")}_setupCoreStateSync(){const e=document.getElementById("coreStatusPill"),t=document.getElementById("coreStatusText");if(!e||!t||!this.neuralCore)return;const i=this.neuralCore.setState.bind(this.neuralCore);this.neuralCore.setState=n=>{switch(i(n),e.setAttribute("data-state",n),n){case"idle":t.textContent="LIVING INTELLIGENCE • IDLE";break;case"listening":t.textContent="SENSOR • LISTENING";break;case"thinking":t.textContent="NEURAL CORE • THINKING";break;case"speaking":t.textContent="SYNTHESIS • SPEAKING";break}}}_onFpsUpdate(e){const t=document.getElementById("hudFpsDisplay");t&&(t.textContent=e>=15?`${e} FPS`:"")}}function X(){try{window.novaApp=new qe}catch(g){console.error("[NOVA] Application bootstrap error:",g)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X):X();
//# sourceMappingURL=index-QUpGaw-m.js.map
