const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NeuralCore-DuIc7M_2.js","assets/three-DxUu5Q2B.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const D="modulepreload",N=function(S){return"/"+S},M={},O=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){let n=function(r){return Promise.all(r.map(l=>Promise.resolve(l).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=n(t.map(r=>{if(r=N(r),r in M)return;M[r]=!0;const l=r.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":D,l||(u.as="script"),u.crossOrigin="",u.href=r,c&&u.setAttribute("nonce",c),document.head.appendChild(u),l)return new Promise((h,m)=>{u.addEventListener("load",h),u.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${r}`)))})}))}function a(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return i.then(n=>{for(const o of n||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})};class B{constructor(e,t={}){this.container=e,this.options=Object.assign({reducedMotion:!1,themeAccent:"cyan",quality:"high",onFpsUpdate:null},t),this.state="idle",this.element=null,this.isPaused=!!this.options.reducedMotion,this.init()}init(){this.container&&(this.container.querySelectorAll(".neural-canvas, .core-fallback-container").forEach(e=>e.remove()),this.element=document.createElement("div"),this.element.className="core-fallback-container holographic-reactor-fallback",this.element.setAttribute("data-state",this.state),this.element.setAttribute("data-accent",this.options.themeAccent),this.isPaused&&this.element.classList.add("paused"),this._renderSvg(),this.container.appendChild(this.element),this.options.onFpsUpdate&&this.options.onFpsUpdate(60))}_renderSvg(){const e=this.options.themeAccent==="amber"?"#f59e0b":this.options.themeAccent==="violet"?"#a855f7":"#00f0ff",t=this.options.themeAccent==="amber"?"#fbbf24":"#38bdf8",s="#ffffff";let i="";const a=200,n=200;for(let o=0;o<72;o++){const c=o*360/72,r=o%6===0,l=o%18===0,p=l?152:r?158:164,u=172,h=c*Math.PI/180,m=(a+p*Math.cos(h)).toFixed(2),b=(n+p*Math.sin(h)).toFixed(2),f=(a+u*Math.cos(h)).toFixed(2),A=(n+u*Math.sin(h)).toFixed(2);i+=`<line x1="${m}" y1="${b}" x2="${f}" y2="${A}" stroke="${l?"#ffffff":e}" stroke-width="${l?"1.5":r?"1.2":"0.75"}" stroke-opacity="${l?"0.85":r?"0.5":"0.22"}" />`}this.element.innerHTML=`
      <svg class="fallback-svg-reactor" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Circular Holographic Reactor Fallback">
        <defs>
          <!-- Center Core Radial Glow -->
          <radialGradient id="reactorNucleusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
            <stop offset="25%" stop-color="#67e8f9" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="${e}" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>

          <!-- Outer Halo Gradient -->
          <radialGradient id="reactorAmbientHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${e}" stop-opacity="0.18"/>
            <stop offset="45%" stop-color="${t}" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>

          <!-- Linear Sweep for Orbital Beacon Trail -->
          <linearGradient id="beaconTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${e}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${e}" stop-opacity="0"/>
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
          <line x1="200" y1="14" x2="200" y2="44" stroke="${e}" stroke-width="1" />
          <line x1="200" y1="356" x2="200" y2="386" stroke="${e}" stroke-width="1" />
          <line x1="14" y1="200" x2="44" y2="200" stroke="${e}" stroke-width="1" />
          <line x1="356" y1="200" x2="386" y2="200" stroke="${e}" stroke-width="1" />
          <!-- Cardinal Degree Legends -->
          <text x="200" y="38" text-anchor="middle" fill="${e}" font-family="monospace" font-size="7" opacity="0.75">000°</text>
          <text x="362" y="203" text-anchor="start" fill="${e}" font-family="monospace" font-size="7" opacity="0.75">090°</text>
          <text x="200" y="372" text-anchor="middle" fill="${e}" font-family="monospace" font-size="7" opacity="0.75">180°</text>
          <text x="38" y="203" text-anchor="end" fill="${e}" font-family="monospace" font-size="7" opacity="0.75">270°</text>
        </g>

        <!-- Circumferential Calibration Ticks (72 procedural marks) -->
        <g class="reactor-ticks">
          ${i}
        </g>

        <!-- Outermost Hairline Reference Ring -->
        <circle cx="200" cy="200" r="172" stroke="${e}" stroke-width="0.8" stroke-opacity="0.3" fill="none"/>
        <circle cx="200" cy="200" r="154" stroke="${e}" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="2 4" fill="none"/>

        <!-- Layer 1: Outer Segmented Rotating Ring (Slow Forward) -->
        <g class="reactor-outer-ring" transform-origin="200 200">
          <circle cx="200" cy="200" r="138" stroke="${e}" stroke-width="2.5" stroke-dasharray="70 20 40 20 90 30" stroke-linecap="round" fill="none" opacity="0.85" filter="url(#reactorNeonGlow)"/>
          <circle cx="200" cy="200" r="132" stroke="${t}" stroke-width="1" stroke-dasharray="10 15" stroke-opacity="0.4" fill="none"/>
        </g>

        <!-- Layer 2: Mid Segmented Rotating Ring (Reverse Medium) -->
        <g class="reactor-mid-ring" transform-origin="200 200">
          <circle cx="200" cy="200" r="102" stroke="${t}" stroke-width="2" stroke-dasharray="45 15 25 15 60 20" stroke-linecap="round" fill="none" opacity="0.8"/>
          <circle cx="200" cy="200" r="95" stroke="#ffffff" stroke-width="0.8" stroke-dasharray="4 8" stroke-opacity="0.5" fill="none"/>
          <!-- Triangular Anchor Markers on Mid Ring -->
          <polygon points="200,97 203,105 197,105" fill="${e}" opacity="0.85"/>
          <polygon points="200,303 203,295 197,295" fill="${e}" opacity="0.85"/>
          <polygon points="97,200 105,203 105,197" fill="${e}" opacity="0.85"/>
          <polygon points="303,200 295,203 295,197" fill="${e}" opacity="0.85"/>
        </g>

        <!-- Layer 3: Tilted Orbital Ellipse with Travelling Light Beacons -->
        <g class="reactor-tilted-orbit" transform="rotate(-28 200 200)">
          <!-- Elliptical Path -->
          <ellipse cx="200" cy="200" rx="145" ry="52" stroke="${e}" stroke-width="1.2" stroke-dasharray="14 8 2 8" stroke-opacity="0.45" fill="none"/>
          <!-- Orbit Beacon 1 with Trail -->
          <g class="orbiting-beacon-1">
            <circle cx="55" cy="200" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px ${e})"/>
            <circle cx="55" cy="200" r="6" stroke="${e}" stroke-width="0.8" stroke-opacity="0.6"/>
          </g>
          <!-- Orbit Beacon 2 -->
          <g class="orbiting-beacon-2">
            <circle cx="345" cy="200" r="2.8" fill="${t}" filter="drop-shadow(0 0 5px ${e})"/>
          </g>
        </g>

        <!-- Layer 4: Inner Counter-Rotating Bracket Ring -->
        <g class="reactor-inner-ring" transform-origin="200 200">
          <circle cx="200" cy="200" r="68" stroke="${e}" stroke-width="2" stroke-dasharray="24 12" stroke-linecap="round" fill="none" opacity="0.9" filter="url(#reactorNeonGlow)"/>
          <circle cx="200" cy="200" r="56" stroke="#ffffff" stroke-width="0.75" stroke-dasharray="3 6" stroke-opacity="0.6" fill="none"/>
        </g>

        <!-- Layer 5: Bright Central Energy Nucleus -->
        <g class="reactor-nucleus-group" transform-origin="200 200">
          <!-- Concentric Energy Halo -->
          <circle cx="200" cy="200" r="42" fill="url(#reactorNucleusGlow)"/>

          <!-- Faceted Hexagonal Geometric Core -->
          <polygon class="nucleus-core-poly" points="200,168 228,184 228,216 200,232 172,216 172,184"
                   stroke="${e}" stroke-width="1.5" fill="rgba(0, 240, 255, 0.12)" stroke-opacity="0.9"/>
          <!-- Inner Diamond Core -->
          <polygon class="nucleus-inner-diamond" points="200,178 219,200 200,222 181,200"
                   stroke="#ffffff" stroke-width="1.2" fill="rgba(255, 255, 255, 0.25)"/>

          <!-- Core Point Light Flare -->
          <circle cx="200" cy="200" r="5" fill="${s}" filter="drop-shadow(0 0 10px #ffffff)"/>
          <circle cx="200" cy="200" r="1.8" fill="#ffffff"/>
        </g>
      </svg>

      <!-- Accurate, Transparent Fallback Tag -->
      <div class="fallback-reactor-badge">
        <span class="fallback-status-dot"></span>
        <span class="fallback-status-text">FALLBACK ENGINE: 2D VECTOR REACTOR (WebGL restricted/unavailable)</span>
      </div>
    `}setState(e){this.state=e,this.element&&this.element.setAttribute("data-state",e)}setReducedMotion(e){this.isPaused=!!e,this.options.reducedMotion=!!e,this.element&&this.element.classList.toggle("paused",this.isPaused)}recenterPerspective(){this.element&&(this.element.classList.add("pulse-recenter"),setTimeout(()=>{this.element&&this.element.classList.remove("pulse-recenter")},500))}setThemeAccent(e){this.options.themeAccent=e,this.element&&(this.element.setAttribute("data-accent",e),this._renderSvg())}setQuality(e){this.options.quality=e}renderSingleFrame(){}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}}const g={assistant:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="9" stroke-dasharray="4 2"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path></svg>',studio:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',history:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',settings:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',volume:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',sparkles:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>',user:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>',check:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',plus:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>',trash:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',close:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>',info:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',cpu:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>',externalLink:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>',desktop:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>',tablet:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',mobile:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',search:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>',download:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>'};function $(S){return S?S.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function I(S){if(!S)return"";const e=[];let t=S.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)```/g,(c,r,l)=>{const p=`__CODE_BLOCK_${e.length}__`;return e.push({lang:r.trim()||"plaintext",code:l.trimEnd()}),p});t=t.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)$/g,(c,r,l)=>{const p=`__CODE_BLOCK_${e.length}__`;return e.push({lang:r.trim()||"plaintext",code:l.trimEnd()}),p}),t=$(t),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g,"$1<em>$2</em>$3"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/(^|\n)&gt; (.*?)(?=\n|$)/g,"$1<blockquote>$2</blockquote>");const s=t.split(`
`),i=[];let a=!1,n=!1;for(let c=0;c<s.length;c++){const r=s[c],l=r.match(/^(\s*)[-*]\s+(.*)$/);if(l){a||(n&&(i.push("</ol>"),n=!1),i.push("<ul>"),a=!0),i.push(`<li>${l[2]}</li>`);continue}const p=r.match(/^(\s*)\d+\.\s+(.*)$/);if(p){n||(a&&(i.push("</ul>"),a=!1),i.push("<ol>"),n=!0),i.push(`<li>${p[2]}</li>`);continue}if(a&&(i.push("</ul>"),a=!1),n&&(i.push("</ol>"),n=!1),!!r.trim()){if(r.includes("__CODE_BLOCK_")){i.push(r);continue}i.push(`<p>${r}</p>`)}}a&&i.push("</ul>"),n&&i.push("</ol>");let o=i.join(`
`);for(let c=0;c<e.length;c++){const r=e[c],l=$(r.code),p=`code_${Date.now()}_${c}`,u=`
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-label">${$(r.lang)}</span>
          <button class="copy-code-btn" data-code-target="${p}" title="Copy code">
            <svg class="copy-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span class="copy-text">Copy</span>
          </button>
        </div>
        <pre><code id="${p}">${l}</code></pre>
      </div>
    `.trim();o=o.replace(`__CODE_BLOCK_${c}__`,u)}return o}const H=[{triggers:["restaurant","dining","food","michelin","menu","aura"],response:`### Neural Formulation: Celestial Gastronomy Architecture

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

All message buffers in NOVA are structured to facilitate drop-in connection to this exact Express/Fastify topology.`}];function P(S){const e=S.toLowerCase();for(const t of H)if(t.triggers.some(s=>e.includes(s)))return t.response;return`### Neural Synthesis: Query Processing Complete

Analyzing query parameters: **"${S.slice(0,60)}${S.length>60?"...":""}"**

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

Ready for next sequence. Ask a technical question, test voice commands, or explore the **Website Studio** preview.`}class q{constructor(){const e=localStorage.getItem("nova_demo_mode");this.isDemoMode=e!==null?e==="true":!0,this.apiBase="/api",this.apiKey="nova_dev_api_key_8f1c4e92",this.authToken=localStorage.getItem("nova_auth_token")||null,this.activeStreamAbort=null,this.lastBackendStatus=null}setDemoMode(e){this.isDemoMode=!!e,localStorage.setItem("nova_demo_mode",String(this.isDemoMode))}setAuthToken(e){this.authToken=e,e?localStorage.setItem("nova_auth_token",e):localStorage.removeItem("nova_auth_token")}async checkBackendStatus(){var e,t,s,i,a,n,o;try{const c=await fetch(`${this.apiBase}/health/ready`,{method:"GET",headers:{Accept:"application/json"}}),r=await c.json().catch(()=>null);c.status===200&&(r!=null&&r.success)?this.lastBackendStatus={status:"connected",ready:!0,db:"connected",host:(t=(e=r.data)==null?void 0:e.database)==null?void 0:t.host,database:(i=(s=r.data)==null?void 0:s.database)==null?void 0:i.database,message:"Backend server and MySQL database are online and ready."}:c.status===503&&((a=r==null?void 0:r.error)==null?void 0:a.code)==="DATABASE_NOT_READY"?this.lastBackendStatus={status:"connected",ready:!1,db:"disconnected",message:r.error.message,setupGuide:((n=r.error.details)==null?void 0:n.setupGuide)||"Check database credentials in backend/.env."}:this.lastBackendStatus={status:"connected",ready:!1,db:"error",message:((o=r==null?void 0:r.error)==null?void 0:o.message)||`Unexpected status code: ${c.status}`}}catch{this.lastBackendStatus={status:"offline",ready:!1,db:"unknown",message:'Backend server is not reachable on http://localhost:3001. Please run "npm start" inside backend/ directory.'}}return this.lastBackendStatus}async getChatStatus(){try{return await this._apiRequest("/chat/status")}catch(e){return{status:"unreachable",provider:"unknown",notice:e.message}}}async _apiRequest(e,t={}){var o,c,r;const s=`${this.apiBase}${e}`,i={"Content-Type":"application/json",Accept:"application/json","X-API-Key":this.apiKey,...this.authToken?{Authorization:`Bearer ${this.authToken}`}:{},...t.headers||{}},a=await fetch(s,{...t,headers:i}),n=await a.json().catch(()=>null);if(!a.ok||!(n!=null&&n.success)){const l=new Error(((o=n==null?void 0:n.error)==null?void 0:o.message)||`Request failed with status ${a.status}`);throw l.code=((c=n==null?void 0:n.error)==null?void 0:c.code)||"API_ERROR",l.details=((r=n==null?void 0:n.error)==null?void 0:r.details)||null,l.statusCode=a.status,l}return n.data}async login(e,t){const s=await this._apiRequest("/auth/login",{method:"POST",body:JSON.stringify({username:e,password:t})});return s!=null&&s.token&&this.setAuthToken(s.token),s}async createSession(e="New Neural Session"){return this._apiRequest("/sessions",{method:"POST",body:JSON.stringify({title:e})})}async getSessions(){return this._apiRequest("/sessions")}async getSession(e){return this._apiRequest(`/sessions/${e}`)}async deleteSession(e){return this._apiRequest(`/sessions/${e}`,{method:"DELETE"})}async confirmAction(e,t,s=null){return this._apiRequest(`/actions/${e}/confirm`,{method:"POST",body:JSON.stringify({confirmationToken:t,arguments:s})})}async cancelAction(e,t="Operator cancelled via dashboard"){return this._apiRequest(`/actions/${e}/cancel`,{method:"POST",body:JSON.stringify({reason:t})})}async getActions(e=null){const t=e?`?sessionId=${encodeURIComponent(e)}`:"";return this._apiRequest(`/actions${t}`)}async getAutomationStatus(){try{return await this._apiRequest("/automation/status")}catch(e){return{online:!1,status:"offline",error:e.message}}}async getAutomationCapabilities(){try{return await this._apiRequest("/automation/capabilities")}catch{return{online:!1,capabilities:[],allowedApps:[]}}}async executeAutomationAction(e,t={}){return this._apiRequest("/automation/execute",{method:"POST",body:JSON.stringify({action:e,params:t})})}async getDeviceSummary(){try{return await this._apiRequest("/devices/summary")}catch{return{android:{agentOnline:!1,adbAvailable:!1,totalConnected:0,devices:[]},homeAssistant:{configured:!1,online:!1,isSimulatedFixture:!0,entities:{mediaPlayers:[],lights:[],switches:[]}}}}}async getAndroidDevices(){return this._apiRequest("/devices/android")}async executeAndroidAction(e,t={}){return this._apiRequest("/devices/android/action",{method:"POST",body:JSON.stringify({action:e,params:t})})}async getHassStatus(){return this._apiRequest("/devices/hass/status")}async getHassEntities(e=null){const t=e?`?domain=${encodeURIComponent(e)}`:"";return this._apiRequest(`/devices/hass/entities${t}`)}async controlHassMedia({entityId:e,query:t,action:s,value:i}){return this._apiRequest("/devices/hass/media",{method:"POST",body:JSON.stringify({entityId:e,query:t,action:s,value:i})})}async controlHassLight({entityId:e,query:t,action:s,brightness:i}){return this._apiRequest("/devices/hass/light",{method:"POST",body:JSON.stringify({entityId:e,query:t,action:s,brightness:i})})}async uploadKnowledgeDocument(e){var o,c;const t=new FormData;t.append("file",e);const s=this._getStoredToken(),i={};s?i.Authorization=`Bearer ${s}`:i["X-API-Key"]=this.ownerApiKey;const a=await fetch(`${this.baseUrl}/knowledge/upload`,{method:"POST",headers:i,body:t}),n=await a.json().catch(()=>({}));if(!a.ok){const r=new Error(((o=n.error)==null?void 0:o.message)||`Upload failed with status ${a.status}`);throw r.code=((c=n.error)==null?void 0:c.code)||"UPLOAD_FAILED",r}return n.data}async getKnowledgeDocuments(){try{return(await this._apiRequest("/knowledge/documents")).documents||[]}catch{return[]}}async deleteKnowledgeDocument(e){return this._apiRequest(`/knowledge/documents/${e}`,{method:"DELETE"})}async queryKnowledgeDocuments(e,t=4){return this._apiRequest("/knowledge/query",{method:"POST",body:JSON.stringify({query:e,topK:t})})}async getPersonalMemories(e=null,t=null){const s=new URLSearchParams;e&&s.set("category",e),t&&s.set("search",t);const i=s.toString()?`?${s.toString()}`:"";try{return(await this._apiRequest(`/knowledge/memories${i}`)).memories||[]}catch{return[]}}async createPersonalMemory(e){return this._apiRequest("/knowledge/memories",{method:"POST",body:JSON.stringify(e)})}async updatePersonalMemory(e,t){return this._apiRequest(`/knowledge/memories/${e}`,{method:"PUT",body:JSON.stringify(t)})}async deletePersonalMemory(e){return this._apiRequest(`/knowledge/memories/${e}`,{method:"DELETE"})}async getWorkflows(){try{return(await this._apiRequest("/workflows")).workflows||[]}catch{return[]}}async createWorkflow(e){return this._apiRequest("/workflows",{method:"POST",body:JSON.stringify(e)})}async proposeWorkflow(e,t={}){const s=new URLSearchParams(t).toString();return this._apiRequest(`/workflows/${encodeURIComponent(e)}/propose${s?`?${s}`:""}`)}async runWorkflow(e,t={},s=!1){return this._apiRequest(`/workflows/${encodeURIComponent(e)}/run`,{method:"POST",body:JSON.stringify({params:t,confirmed:s})})}async getWorkflowRuns(e=20){try{return(await this._apiRequest(`/workflows/runs?limit=${e}`)).runs||[]}catch{return[]}}async resumeWorkflowRun(e,t={}){return this._apiRequest(`/workflows/runs/${encodeURIComponent(e)}/resume`,{method:"POST",body:JSON.stringify(t)})}async cancelWorkflowRun(e){return this._apiRequest(`/workflows/runs/${encodeURIComponent(e)}/cancel`,{method:"POST"})}async getActivityTimeline(e=25){try{return(await this._apiRequest(`/activity/timeline?limit=${e}`)).timeline||[]}catch{return[]}}sendMessageStream({prompt:e,sessionId:t=null,history:s=[],onStartThinking:i,onChunk:a,onComplete:n,onError:o}){this.activeStreamAbort&&(this.activeStreamAbort(),this.activeStreamAbort=null);let c=!1;return this.activeStreamAbort=()=>{c=!0},this.isDemoMode?((async()=>{try{i&&i();const r=Math.floor(Math.random()*250)+400;if(await new Promise(m=>setTimeout(m,r)),c)return;const p=P(e).split(" ");let u="";for(let m=0;m<p.length;m++){if(c)return;const b=p[m];u+=(m===0?"":" ")+b,a&&a(u,b);let f=18+Math.floor(Math.random()*15);(b.endsWith(".")||b.endsWith(":")||b.includes(`
`))&&(f+=35),await new Promise(A=>setTimeout(A,f))}if(c)return;const h={role:"assistant",content:u,simulated:!0,actions:[],timestamp:new Date().toISOString()};n&&n(h)}catch(r){!c&&o&&o(r.message||"Simulated streaming error")}finally{this.activeStreamAbort=null}})(),this.activeStreamAbort):(this._sendToLiveBackend({prompt:e,sessionId:t,onStartThinking:i,onChunk:a,onComplete:n,onError:o,isCancelled:()=>c}),this.activeStreamAbort)}async _sendToLiveBackend({prompt:e,sessionId:t,onStartThinking:s,onChunk:i,onComplete:a,onError:n,isCancelled:o}){var c;try{s&&s();let r=t;r||(r=(await this.createSession("New Tactical Session")).id);const l=await this._apiRequest("/chat",{method:"POST",body:JSON.stringify({sessionId:r,message:e})});if(o())return;const p=(l==null?void 0:l.message)||{role:"assistant",content:"NOVA core completed command synthesis.",timestamp:new Date().toISOString()},u=(l==null?void 0:l.actions)||[];i&&i(p.content,p.content),a&&a({...p,actions:u,simulated:!1})}catch(r){if(o())return;let l=r.message;if(r.code==="USAGE_LIMIT_EXCEEDED")l=`⚠️ Usage Rate Limit: ${r.message}`;else if(r.code==="MODEL_TIMEOUT")l="⏱️ Gateway Timeout: AI model request timed out. Please try again.";else if(r.code==="DATABASE_UNAVAILABLE"||r.code==="DATABASE_NOT_READY"){const p=((c=r.details)==null?void 0:c.setupGuide)||"Please verify MySQL configuration in backend/.env.";l=`Database Notice: ${r.message}
Setup: ${p}`}n&&n(l)}finally{this.activeStreamAbort=null}}}const y=new q;class V{constructor(){this.state="idle",this.mediaStream=null,this.mediaRecorder=null,this.audioChunks=[],this.audioContext=null,this.analyser=null,this.vadCheckInterval=null,this.recordingStartTime=0,this.maxRmsObserved=0;const e=localStorage.getItem("nova_voice_language")||"auto";this.selectedLanguage=["auto","en","bn","hi"].includes(e)?e:"auto",this.synth=typeof window<"u"?window.speechSynthesis:null,this.currentUtterance=null,this.isMuted=localStorage.getItem("nova_voice_muted")==="true",this.voices=[],this.onStateChange=null,this.onAudioLevel=null,this.onTranscription=null,this.onSilenceDetected=null,this.onError=null,this.onVoicesChanged=null,this._initVoices()}setState(e){this.state!==e&&(this.state=e,this.onStateChange&&this.onStateChange(e))}getState(){return this.state}setLanguage(e){["auto","en","bn","hi"].includes(e)&&(this.selectedLanguage=e,localStorage.setItem("nova_voice_language",e))}getLanguage(){return this.selectedLanguage}get isRecording(){return this.state==="listening"}async startRecording(){if(this.stopSpeaking(),this.isRecording)return!1;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return this.onError&&this.onError("Microphone input is not supported in this browser.","MICROPHONE_UNSUPPORTED"),!1;try{this.mediaStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0}})}catch(s){let i="Microphone access error.",a="MICROPHONE_ERROR";return s.name==="NotAllowedError"||s.name==="PermissionDeniedError"?(i="Microphone permission denied. Please allow microphone access in your browser settings.",a="PERMISSION_DENIED"):(s.name==="NotFoundError"||s.name==="DevicesNotFoundError")&&(i="No microphone device was detected on this system.",a="DEVICE_NOT_FOUND"),this.setState("idle"),this.onError&&this.onError(i,a),!1}const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4","audio/wav"];let t="audio/webm";if(typeof MediaRecorder<"u"){for(const s of e)if(MediaRecorder.isTypeSupported(s)){t=s;break}}this.audioChunks=[],this.recordingStartTime=Date.now(),this.maxRmsObserved=0;try{return this.mediaRecorder=new MediaRecorder(this.mediaStream,{mimeType:t,audioBitsPerSecond:64e3}),this.mediaRecorder.ondataavailable=s=>{s.data&&s.data.size>0&&this.audioChunks.push(s.data)},this._setupAudioAnalyser(this.mediaStream),this.mediaRecorder.start(200),this.setState("listening"),!0}catch(s){return this._cleanupMediaStream(),this.setState("idle"),this.onError&&this.onError(`Failed to initialize audio recorder: ${s.message}`,"RECORDER_INIT_FAILED"),!1}}_setupAudioAnalyser(e){try{const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.audioContext=new t;const s=this.audioContext.createMediaStreamSource(e);this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=512,s.connect(this.analyser);const i=this.analyser.frequencyBinCount,a=new Uint8Array(i);this.vadCheckInterval=setInterval(()=>{if(!this.analyser||this.state!=="listening")return;this.analyser.getByteTimeDomainData(a);let n=0;for(let c=0;c<i;c++){const r=(a[c]-128)/128;n+=r*r}const o=Math.sqrt(n/i);o>this.maxRmsObserved&&(this.maxRmsObserved=o),this.onAudioLevel&&this.onAudioLevel(o)},80)}catch(t){console.warn("[VoicePipeline] AudioContext analyser setup warning:",t)}}async stopRecording(){if(!this.isRecording||!this.mediaRecorder)return;const e=Date.now()-this.recordingStartTime,t=this.maxRmsObserved;return new Promise(s=>{this.mediaRecorder.onstop=async()=>{var n;const i=((n=this.mediaRecorder)==null?void 0:n.mimeType)||"audio/webm",a=new Blob(this.audioChunks,{type:i});if(this._cleanupMediaStream(),this._cleanupAudioAnalyser(),e<400||t<.015||a.size<500){this.setState("idle"),this.onSilenceDetected&&this.onSilenceDetected("Silence detected — no voice input captured."),s(null);return}this.setState("transcribing");try{const o=await this._dispatchTranscription(a,i);this.setState("idle"),o.isSilent||!o.text||o.text.trim().length===0?this.onSilenceDetected&&this.onSilenceDetected("No intelligible speech detected."):this.onTranscription&&this.onTranscription({text:o.text.trim(),language:o.language,languageProbability:o.languageProbability,duration:o.duration,confidence:o.confidence,isSilent:!1}),s(o)}catch(o){this.setState("idle");const c=o.message||"Voice transcription failed.";this.onError&&this.onError(c,o.code||"TRANSCRIPTION_ERROR"),s(null)}};try{this.mediaRecorder.stop()}catch{this._cleanupMediaStream(),this.setState("idle"),s(null)}})}cancelRecording(){if(this.mediaRecorder&&this.isRecording){this.mediaRecorder.onstop=null;try{this.mediaRecorder.stop()}catch{}}this._cleanupMediaStream(),this._cleanupAudioAnalyser(),this.audioChunks=[],this.setState("idle")}_cleanupMediaStream(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>e.stop()),this.mediaStream=null)}_cleanupAudioAnalyser(){if(this.vadCheckInterval&&(clearInterval(this.vadCheckInterval),this.vadCheckInterval=null),this.audioContext){try{this.audioContext.close()}catch{}this.audioContext=null}this.analyser=null}async _dispatchTranscription(e,t){var c,r;const s=new FormData,i=t.includes("wav")?"wav":t.includes("ogg")?"ogg":"webm";s.append("audio",e,`recording.${i}`),s.append("language",this.selectedLanguage);const a={"X-API-Key":y.apiKey};y.authToken&&(a.Authorization=`Bearer ${y.authToken}`);const n=await fetch(`${y.apiBase}/voice/transcribe`,{method:"POST",headers:a,body:s}),o=await n.json().catch(()=>null);if(!n.ok||!(o!=null&&o.success)){const l=new Error(((c=o==null?void 0:o.error)==null?void 0:c.message)||`Server transcription failed (${n.status})`);throw l.code=((r=o==null?void 0:o.error)==null?void 0:r.code)||"SERVER_TRANSCRIPTION_FAILED",l.statusCode=n.status,l}return o.data}_initVoices(){if(!this.synth)return;const e=()=>{this.voices=this.synth.getVoices(),this.onVoicesChanged&&this.onVoicesChanged(this.voices)};e(),this.synth.onvoiceschanged!==void 0&&(this.synth.onvoiceschanged=e)}getVoices(){return this.synth?(this.voices.length===0&&(this.voices=this.synth.getVoices()),this.voices):[]}setMuted(e){this.isMuted=!!e,localStorage.setItem("nova_voice_muted",String(this.isMuted)),this.isMuted&&this.stopSpeaking()}cleanTextForSpeech(e){if(!e)return"";let t=e.replace(/```[\s\S]*?```/g," [Code omitted for audio] ");return t=t.replace(/`([^`]+)`/g,"$1"),t=t.replace(/\*\*([^*]+)\*\*/g,"$1"),t=t.replace(/\*([^*]+)\*/g,"$1"),t=t.replace(/#+\s/g,""),t=t.replace(/\[([^\]]+)\]\([^\)]+\)/g,"$1"),t=t.replace(/<[^>]+>/g,""),t.replace(/\s+/g," ").trim()}speak(e,{voiceURI:t,rate:s=1,pitch:i=1}={}){if(!this.synth||this.isMuted)return this.state==="speaking"&&this.setState("idle"),!1;this.stopSpeaking();const a=this.cleanTextForSpeech(e);if(!a)return this.state==="speaking"&&this.setState("idle"),!1;try{const n=new SpeechSynthesisUtterance(a);if(n.rate=Math.max(.6,Math.min(1.8,s)),n.pitch=Math.max(.6,Math.min(1.6,i)),t){const o=this.getVoices().find(c=>c.voiceURI===t);o&&(n.voice=o)}return n.onstart=()=>{this.setState("speaking")},n.onend=()=>{this.currentUtterance=null,this.state==="speaking"&&this.setState("idle")},n.onerror=o=>{o.error!=="interrupted"&&o.error!=="canceled"&&console.warn("[VoicePipeline] SpeechSynthesis error:",o),this.currentUtterance=null,this.state==="speaking"&&this.setState("idle")},this.currentUtterance=n,this.synth.speak(n),!0}catch(n){return console.warn("[VoicePipeline] Could not speak text:",n),this.state==="speaking"&&this.setState("idle"),!1}}stopSpeaking(){if(this.synth)try{this.synth.cancel()}catch{}this.currentUtterance=null,this.state==="speaking"&&this.setState("idle")}isSpeaking(){return this.state==="speaking"||!!(this.synth&&this.synth.speaking)}}const U=new V,w=U,C={SESSIONS:"nova_conversations_v1",ACTIVE_SESSION:"nova_active_session_id_v1",SETTINGS:"nova_settings_v1",TELEMETRY:"nova_telemetry_v1"},_={ttsEnabled:!0,voiceURI:"",speechRate:1,speechPitch:1,quality:"high",reducedMotion:!1,particleDensity:"high",themeAccent:"cyan",showHud:!0};class G{constructor(){this.settings=this.loadSettings()}loadSettings(){try{const e=localStorage.getItem(C.SETTINGS);if(e)return{..._,...JSON.parse(e)}}catch(e){console.warn("[Storage] Failed to read settings, using defaults:",e)}return{..._}}saveSettings(e){this.settings={...this.settings,...e};try{localStorage.setItem(C.SETTINGS,JSON.stringify(this.settings))}catch(t){console.error("[Storage] Error saving settings:",t)}return this.settings}getSessions(){try{const e=localStorage.getItem(C.SESSIONS);if(e){const t=JSON.parse(e);return Array.isArray(t)?t:[]}}catch(e){console.warn("[Storage] Failed to load sessions:",e)}return[]}saveSessions(e){try{localStorage.setItem(C.SESSIONS,JSON.stringify(e))}catch(t){console.error("[Storage] Error saving sessions:",t)}}getActiveSessionId(){try{return localStorage.getItem(C.ACTIVE_SESSION)||null}catch{return null}}setActiveSessionId(e){try{localStorage.setItem(C.ACTIVE_SESSION,e)}catch(t){console.warn("[Storage] Error saving active session id:",t)}}createSession(e="New Neural Session"){const t=this.getSessions(),s={id:`session_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,title:e,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),messages:[]};return t.unshift(s),this.saveSessions(t),this.setActiveSessionId(s.id),s}getSession(e){return this.getSessions().find(s=>s.id===e)||null}updateSessionMessages(e,t){const s=this.getSessions(),i=s.findIndex(a=>a.id===e);if(i!==-1){if(s[i].messages=t,s[i].updatedAt=new Date().toISOString(),s[i].title==="New Neural Session"&&t.length>0){const a=t.find(n=>n.role==="user");if(a){const n=a.content.trim().slice(0,36);s[i].title=n+(a.content.length>36?"...":"")}}this.saveSessions(s)}}deleteSession(e){let t=this.getSessions();if(t=t.filter(s=>s.id!==e),this.saveSessions(t),this.getActiveSessionId()===e){const s=t.length>0?t[0].id:null;s?this.setActiveSessionId(s):localStorage.removeItem(C.ACTIVE_SESSION)}return t}clearAllData(){try{localStorage.removeItem(C.SESSIONS),localStorage.removeItem(C.ACTIVE_SESSION),localStorage.removeItem(C.SETTINGS),localStorage.removeItem(C.TELEMETRY),this.settings={..._}}catch(e){console.error("[Storage] Error clearing storage:",e)}}exportDataJson(){const e={exportedAt:new Date().toISOString(),app:"NOVA AI Workspace",settings:this.settings,sessions:this.getSessions()};return JSON.stringify(e,null,2)}}const v=new G;class F{constructor(){this.container=null,this.init()}init(){this.container=document.createElement("div"),this.container.className="toast-container",this.container.setAttribute("aria-live","polite"),document.body.appendChild(this.container)}show(e,t="info",s=3800){if(!this.container)return;const i=document.createElement("div");i.className=`toast toast-${t}`,i.setAttribute("role","alert");let a=g.info;t==="success"&&(a=g.check),t==="error"&&(a=g.close),t==="warning"&&(a=g.info),i.innerHTML=`
      <div class="toast-content">
        <span class="toast-icon">${a}</span>
        <span class="toast-message">${e}</span>
      </div>
      <button class="toast-close-btn" aria-label="Close notification">
        ${g.close}
      </button>
    `;const n=i.querySelector(".toast-close-btn"),o=()=>{i.classList.add("toast-fade-out"),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},250)};n.addEventListener("click",o),this.container.appendChild(i),s>0&&setTimeout(o,s)}success(e){this.show(e,"success")}error(e){this.show(e,"error",5e3)}warning(e){this.show(e,"warning",4500)}info(e){this.show(e,"info")}}const d=new F;class W{constructor({container:e,neuralCore:t,onActivityLogged:s,onSessionChanged:i}){this.container=e,this.neuralCore=t,this.onActivityLogged=s||(()=>{}),this.onSessionChanged=i||(()=>{}),this.activeSessionId=null,this.messages=[],this.isStreaming=!1,this.scrollArea=null,this.textarea=null,this.btnSend=null,this.btnMic=null,this.btnStopSpeech=null,this.previewText=null,this.previewTimestamp=null,this.conversationDrawer=null,this.btnExpandDrawer=null,this.btnCloseDrawer=null,this.btnDrawerExport=null,this.drawerMsgCount=null,this.init()}init(){this._bindDomElements(),this._bindEvents(),this._setupSpeechHooks(),this.loadActiveSession()}_bindDomElements(){this.scrollArea=document.getElementById("chatScrollArea"),this.textarea=document.getElementById("composerTextarea"),this.btnSend=document.getElementById("btnSend"),this.btnMic=document.getElementById("btnMic"),this.btnStopSpeech=document.getElementById("btnStopSpeech"),this.previewText=document.getElementById("previewText"),this.previewTimestamp=document.getElementById("previewTimestamp"),this.conversationDrawer=document.getElementById("conversationDrawer"),this.btnExpandDrawer=document.getElementById("btnExpandDrawer"),this.btnCloseDrawer=document.getElementById("btnCloseDrawer"),this.btnDrawerExport=document.getElementById("btnDrawerExport"),this.drawerMsgCount=document.getElementById("drawerMsgCount")}_bindEvents(){const e=document.getElementById("composerForm");this.btnExpandDrawer&&this.conversationDrawer&&this.btnExpandDrawer.addEventListener("click",()=>{this.openDrawer()}),this.btnCloseDrawer&&this.conversationDrawer&&this.btnCloseDrawer.addEventListener("click",()=>{this.closeDrawer()}),this.btnDrawerExport&&this.btnDrawerExport.addEventListener("click",()=>{this.exportConversation()}),this.textarea&&this.btnSend&&(this.textarea.addEventListener("input",()=>{w.isSpeaking()&&w.stopSpeaking(),this.textarea.style.height="auto";const t=Math.min(this.textarea.scrollHeight,100);this.textarea.style.height=`${t}px`,this.btnSend.disabled=!this.textarea.value.trim()||this.isStreaming}),this.textarea.addEventListener("keydown",t=>{w.isSpeaking()&&w.stopSpeaking(),t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),this.btnSend.disabled||e.dispatchEvent(new Event("submit",{cancelable:!0})))})),e&&e.addEventListener("submit",t=>{t.preventDefault();const s=this.textarea.value.trim();!s||this.isStreaming||(this.textarea.value="",this.textarea.style.height="auto",this.btnSend.disabled=!0,this.sendMessage(s))}),this.btnMic&&this.btnMic.addEventListener("click",async()=>{if(w.isRecording)await w.stopRecording();else if(await w.startRecording()){const s=w.getLanguage().toUpperCase();d.info(`Push-to-Talk active (${s}): Speak now (click mic again to transcribe)...`)}}),this.btnStopSpeech&&this.btnStopSpeech.addEventListener("click",()=>{w.stopSpeaking(),this.btnStopSpeech.classList.remove("active"),this.neuralCore&&this.neuralCore.setState("idle"),d.info("Voice synthesis halted.")}),this.scrollArea&&this.scrollArea.addEventListener("click",t=>{const s=t.target.closest(".copy-code-btn");if(s){const o=s.getAttribute("data-code-target"),c=document.getElementById(o);c&&navigator.clipboard.writeText(c.textContent).then(()=>{const r=s.querySelector(".copy-text");r&&(r.textContent="Copied!"),d.success("Code copied to clipboard."),setTimeout(()=>{r&&(r.textContent="Copy")},2e3)}).catch(()=>{d.error("Failed to copy code.")});return}const i=t.target.closest(".btn-speak-msg");if(i){const o=i.getAttribute("data-text");if(o){const c=v.loadSettings();w.speak(o,{voiceURI:c.voiceURI,rate:c.speechRate,pitch:c.speechPitch})}return}const a=t.target.closest(".btn-action-confirm");if(a){const o=a.getAttribute("data-action-id"),c=a.getAttribute("data-action-token");this._handleConfirmAction(o,c,a);return}const n=t.target.closest(".btn-action-cancel");if(n){const o=n.getAttribute("data-action-id");this._handleCancelAction(o,n);return}})}_setupSpeechHooks(){w.onStateChange=e=>{this.neuralCore&&this.neuralCore.setState(e),this.btnMic&&(this.btnMic.classList.toggle("recording",e==="listening"),this.btnMic.classList.toggle("transcribing",e==="transcribing")),this.btnStopSpeech&&this.btnStopSpeech.classList.toggle("active",e==="speaking");const t=document.getElementById("coreStatusPill");t&&t.setAttribute("data-state",e),e==="listening"?this.onActivityLogged("Acoustic sensor active: Capturing audio buffer (VAD enabled)..."):e==="transcribing"?this.onActivityLogged("Faster-Whisper worker: Transcribing audio stream..."):e==="thinking"?this.onActivityLogged("Neural Core: Reasoning across context and tool matrix..."):e==="acting"?this.onActivityLogged("Structured Action: Executing authorized tool..."):e==="speaking"&&this.onActivityLogged("Voice synthesis: Transmitting audio output...")},w.onTranscription=({text:e,language:t,confidence:s})=>{this.textarea&&(this.textarea.value=e,this.textarea.style.height="auto",this.textarea.style.height=`${Math.min(this.textarea.scrollHeight,100)}px`,this.textarea.focus(),this.btnSend&&(this.btnSend.disabled=!this.textarea.value.trim())),this.previewText&&(this.previewText.textContent=e);const i=(t||"auto").toUpperCase(),a=Math.round((s||.8)*100);d.success(`Decoded speech [${i} &bull; ${a}%]: "${e.slice(0,36)}..."`),this.onActivityLogged(`Transcript decoded [${i} &bull; ${a}%]: "${e.slice(0,36)}..."`)},w.onSilenceDetected=e=>{d.info(e),this.onActivityLogged(`Voice sensor: ${e}`)},w.onError=(e,t)=>{d.warning(e),this.onActivityLogged(`Voice sensor event [${t||"WARN"}]: ${e}`)}}openDrawer(){this.conversationDrawer&&(this.conversationDrawer.classList.add("open"),this.conversationDrawer.setAttribute("aria-hidden","false"),this._scrollToBottom())}closeDrawer(){this.conversationDrawer&&(this.conversationDrawer.classList.remove("open"),this.conversationDrawer.setAttribute("aria-hidden","true"))}loadActiveSession(){let e=v.getActiveSessionId(),t=e?v.getSession(e):null;t||(t=v.createSession("Neural Session Alpha")),this.activeSessionId=t.id,this.messages=t.messages||[],this.renderMessages(),this.onSessionChanged(t),this._updatePreviewFromMessages()}switchSession(e){const t=v.getSession(e);t&&(v.setActiveSessionId(e),this.activeSessionId=t.id,this.messages=t.messages||[],this.renderMessages(),this.onSessionChanged(t),this._updatePreviewFromMessages(),this.onActivityLogged(`Operational context shifted to: "${t.title}"`))}createNewChat(){const e=v.createSession("New Command Stream");this.activeSessionId=e.id,this.messages=[],this.renderMessages(),this.onSessionChanged(e),this._updatePreviewFromMessages(),this.onActivityLogged("Initialized fresh session stream"),d.success("Started a fresh conversation session."),this.textarea&&this.textarea.focus()}renderMessages(){this.scrollArea&&(this.messages.length===0?this._renderWelcomeScreen():(this.scrollArea.innerHTML="",this.messages.forEach(e=>{const t=this._createMessageRowElement(e);this.scrollArea.appendChild(t)}),this._scrollToBottom()),this.drawerMsgCount&&(this.drawerMsgCount.textContent=`${this.messages.length} MESSAGES`))}_renderWelcomeScreen(){this.scrollArea.innerHTML=`
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.5rem; letter-spacing: 0.08em;">
          // CONVERSATION STREAM INITIALIZED //
        </div>
        <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          No previous transmissions logged in this session. Dispatch a command from the central composer to trigger AI reasoning, notes, reminders, or action workflows.
        </p>
      </div>
    `}_createMessageRowElement(e){const t=document.createElement("div");t.className=`message-row ${e.role}`;const s=new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i=e.role==="assistant",a=i?`<div class="message-avatar" aria-label="NOVA">${g.assistant}</div>`:`<div class="message-avatar" aria-label="User">${g.user}</div>`,n=i?`
        <div class="message-meta">
          <span>NOVA CORE</span>
          <span>&bull;</span>
          <span>${s}</span>
          ${e.simulated?'<span class="simulated-pill">SIMULATED &bull; LOCAL</span>':'<span class="simulated-pill live-pill">LIVE &bull; STAGE 2</span>'}
        </div>
      `:`
        <div class="message-meta">
          <span>OPERATOR</span>
          <span>&bull;</span>
          <span>${s}</span>
        </div>
      `,o=i?I(e.content):`<p>${this._escapeHtml(e.content)}</p>`,c=i&&Array.isArray(e.actions)&&e.actions.length>0?this._renderActionCardsHtml(e.actions):"",r=i?`
        <div class="message-actions-toolbar">
          <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(e.content)}" title="Read message aloud">
            ${g.volume}
            <span>Listen</span>
          </button>
        </div>
      `:"";return t.innerHTML=`
      ${a}
      <div class="message-bubble-wrap">
        ${n}
        <div class="message-bubble">
          ${o}
          ${c}
        </div>
        ${r}
      </div>
    `,t}_renderActionCardsHtml(e){return!e||!Array.isArray(e)||e.length===0?"":`
      <div class="action-cards-container">
        ${e.map(t=>this._renderSingleActionCardHtml(t)).join("")}
      </div>
    `}_renderSingleActionCardHtml(e){var m,b,f,A,E,x;const t=e.status==="awaiting_confirmation",s=e.status==="succeeded",i=e.status==="failed",a=e.status==="cancelled";let n="status-cyan",o=e.status.toUpperCase();t?(n="status-amber",o="CONFIRMATION REQUIRED"):s?(n="status-green",o="SUCCEEDED"):i?(n="status-red",o="FAILED"):a&&(n="status-gray",o="CANCELLED");let c="";e.arguments&&Object.keys(e.arguments).length>0&&(c='<div class="action-params-box">'+Object.entries(e.arguments).map(([k,T])=>`
          <div class="param-row">
            <span class="param-key">${this._escapeHtml(k)}:</span>
            <span class="param-val">${this._escapeHtml(typeof T=="object"?JSON.stringify(T):String(T))}</span>
          </div>
        `).join("")+"</div>");let r="";if(s&&e.result)if(e.toolName==="getOperatingSystemInfo"&&typeof e.result=="object"){const k=e.result;r=`
          <div class="action-result-box">
            <div class="result-header">HOST SYSTEM TELEMETRY (GENUINE OS MEASUREMENTS):</div>
            <div class="os-telemetry-grid">
              <div class="telemetry-tile">
                <div class="telemetry-label">Host & Platform</div>
                <div class="telemetry-val">${this._escapeHtml(k.hostname||"Windows Host")} &bull; ${this._escapeHtml(k.platform||"win32")}</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">OS Version</div>
                <div class="telemetry-val">${this._escapeHtml(k.osType||"Windows_NT")} ${this._escapeHtml(k.osRelease||"")} (${this._escapeHtml(k.architecture||"x64")})</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">Processor Core</div>
                <div class="telemetry-val">${this._escapeHtml(((m=k.cpu)==null?void 0:m.model)||"CPU")} (${((b=k.cpu)==null?void 0:b.cores)||1} cores)</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">Memory Allocation</div>
                <div class="telemetry-val">${((f=k.memory)==null?void 0:f.usedGb)||0} GB / ${((A=k.memory)==null?void 0:A.totalGb)||0} GB (${((E=k.memory)==null?void 0:E.usedPercentage)||0}%)</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">System Uptime</div>
                <div class="telemetry-val">${this._escapeHtml(k.uptimeFormatted||`${k.uptimeSeconds||0}s`)}</div>
              </div>
              <div class="telemetry-tile">
                <div class="telemetry-label">Sensor Telemetry</div>
                <div class="telemetry-val">${new Date(k.systemTime||Date.now()).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        `}else if(e.toolName==="searchWorkspaceFiles"&&Array.isArray(e.result.candidates)){const k=e.result.candidates,T=e.result.isAmbiguous;r=`
          <div class="action-result-box">
            <div class="result-header">WORKSPACE FILE SEARCH [${e.result.totalFound} FOUND]:</div>
            ${T?'<div class="ambiguous-warning">⚠️ Multiple candidate files match. Specific relative path required:</div>':""}
            <div class="action-candidates-list">
              ${k.map(L=>`
                <div class="candidate-item">
                  <span class="candidate-path">📄 ${this._escapeHtml(L.relativePath||L.name)}</span>
                  <span class="candidate-meta">${(L.sizeBytes/1024).toFixed(1)} KB &bull; ${new Date(L.lastModified).toLocaleDateString()}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `}else r=`
          <div class="action-result-box">
            <div class="result-header">TOOL EXECUTION RESULT:</div>
            <pre class="result-pre">${this._escapeHtml(typeof e.result=="object"?JSON.stringify(e.result,null,2):String(e.result))}</pre>
          </div>
        `;else i&&e.errorMessage?r=`
        <div class="action-error-box">
          <div class="result-header">EXECUTION FAILED:</div>
          <div class="error-text">${this._escapeHtml(e.errorMessage)}</div>
        </div>
      `:a&&(r=`
        <div class="action-cancelled-box">
          <span>Action was cancelled by operator. No further changes applied.</span>
        </div>
      `);const l=["openConfiguredApp","searchWorkspaceFiles","openWorkspaceFile","createWorkspaceNote","deleteWorkspaceFile","openWebUrl","getOperatingSystemInfo"].includes(e.toolName),p=`
      <div class="action-cancellation-notice">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Cancellation may not undo completed operating-system actions.</span>
      </div>
    `;let u="";t?u=`
        <div class="action-buttons-row">
          <button class="btn-action-confirm" data-action-id="${e.id}" data-action-token="${e.confirmationToken||""}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            Confirm Execution
          </button>
          <button class="btn-action-cancel" data-action-id="${e.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Cancel
          </button>
        </div>
      `:e.status==="running"&&(u=`
        <div class="action-buttons-row">
          <button class="btn-action-cancel" data-action-id="${e.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Cancel Action
          </button>
        </div>
      `);const h=(x=e.meta)!=null&&x.executionTimeMs?`
      <div class="action-log-footer">
        <span>⏱️ ${e.meta.executionTimeMs}ms</span>
        <span>&bull;</span>
        <span>${new Date(e.meta.timestamp||e.updatedAt).toLocaleTimeString()}</span>
      </div>
    `:"";return`
      <div class="action-card action-status-${e.status}" id="action-card-${e.id}" data-action-id="${e.id}">
        <div class="action-card-header">
          <div class="action-title-wrap">
            <span class="action-icon">⚡</span>
            <span class="action-tool-name">${this._escapeHtml(e.toolName)}</span>
            ${e.requiresConfirmation?'<span class="destructive-badge">DESTRUCTIVE</span>':""}
            ${l?'<span class="os-badge">OS AUTOMATION</span>':""}
          </div>
          <span class="action-status-badge ${n}">${o}</span>
        </div>
        ${c}
        ${r}
        ${p}
        ${u}
        ${h}
      </div>
    `}async _handleConfirmAction(e,t,s){if(!e||!t){d.error("Missing confirmation credentials.");return}const i=document.getElementById(`action-card-${e}`);s&&(s.disabled=!0);try{this.neuralCore&&this.neuralCore.setState("acting"),this.onActivityLogged(`Authorizing confirmed action ${e.slice(0,8)}...`);const a=await y.confirmAction(e,t);if(d.success(`Action '${a.toolName}' confirmed and executed successfully.`),this.onActivityLogged(`Action '${a.toolName}' execution succeeded.`),this._updateActionInMessages(e,a),i){const n=i.parentNode,o=document.createElement("div");o.innerHTML=this._renderSingleActionCardHtml(a),n.replaceChild(o.firstElementChild,i)}}catch(a){d.error(`Confirmation failed: ${a.message}`),s&&(s.disabled=!1)}finally{this.neuralCore&&this.neuralCore.setState("idle")}}async _handleCancelAction(e,t){if(!e)return;const s=document.getElementById(`action-card-${e}`);t&&(t.disabled=!0);try{const i=await y.cancelAction(e,"Operator cancelled from command dashboard");if(d.info(`Action '${i.toolName}' was cancelled.`),this.onActivityLogged(`Action '${i.toolName}' cancelled by operator.`),this._updateActionInMessages(e,i),s){const a=s.parentNode,n=document.createElement("div");n.innerHTML=this._renderSingleActionCardHtml(i),a.replaceChild(n.firstElementChild,s)}}catch(i){d.error(`Cancel request failed: ${i.message}`),t&&(t.disabled=!1)}}_updateActionInMessages(e,t){for(const s of this.messages)if(Array.isArray(s.actions)){const i=s.actions.findIndex(a=>a.id===e);if(i!==-1){s.actions[i]=t;break}}v.updateSessionMessages(this.activeSessionId,this.messages)}_updatePreviewFromMessages(){if(!this.previewText)return;if(this.messages.length===0){this.previewText.textContent="NOVA circular holographic reactor online. Initialize technical architecture, synthesize models, or transmit instructions below.",this.previewTimestamp&&(this.previewTimestamp.textContent="Nominal");return}const e=this.messages[this.messages.length-1],t=e.content.replace(/```[\s\S]*?```/g,"[Code Snippet]").replace(/#+\s/g,"").trim();if(this.previewText.textContent=t.slice(0,160)+(t.length>160?"...":""),this.previewTimestamp){const s=new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});this.previewTimestamp.textContent=s}}sendMessage(e){if(!e.trim()||this.isStreaming)return;this.messages.length===0&&this.scrollArea&&(this.scrollArea.innerHTML="");const t={role:"user",content:e,timestamp:new Date().toISOString()};if(this.messages.push(t),v.updateSessionMessages(this.activeSessionId,this.messages),this.scrollArea){const a=this._createMessageRowElement(t);this.scrollArea.appendChild(a),this._scrollToBottom()}this.drawerMsgCount&&(this.drawerMsgCount.textContent=`${this.messages.length} MESSAGES`),this.onActivityLogged(`Command dispatched: "${e.slice(0,32)}..."`),this.isStreaming=!0,this.btnSend&&(this.btnSend.disabled=!0),this.previewText&&(this.previewText.textContent="Synthesizing response through holographic reactor core..."),this.previewTimestamp&&(this.previewTimestamp.textContent="Calculating");let s=null,i=null;if(this.scrollArea){s=document.createElement("div"),s.className="message-row assistant";const a=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});s.innerHTML=`
        <div class="message-avatar" aria-label="NOVA">${g.assistant}</div>
        <div class="message-bubble-wrap">
          <div class="message-meta">
            <span>NOVA CORE</span>
            <span>&bull;</span>
            <span>${a}</span>
            <span class="simulated-pill">${y.isDemoMode?"SIMULATED &bull; LOCAL":"LIVE &bull; STAGE 2"}</span>
          </div>
          <div class="message-bubble">
            <div class="typing-indicator">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>
      `,this.scrollArea.appendChild(s),this._scrollToBottom(),i=s.querySelector(".message-bubble")}y.sendMessageStream({prompt:e,sessionId:this.activeSessionId,history:this.messages,onStartThinking:()=>{this.neuralCore&&this.neuralCore.setState("thinking"),this.onActivityLogged("Reactor state: THINKING (Ring velocities accelerating)")},onChunk:a=>{if(i&&(i.innerHTML=I(a),this._scrollToBottom()),this.previewText){const n=a.replace(/```[\s\S]*?```/g,"[Code Snippet]").replace(/#+\s/g,"").trim();this.previewText.textContent=n.slice(0,160)+(n.length>160?"...":"")}},onComplete:a=>{this.isStreaming=!1,this.btnSend&&this.textarea&&(this.btnSend.disabled=!this.textarea.value.trim());const n=Array.isArray(a.actions)&&a.actions.length>0?this._renderActionCardsHtml(a.actions):"";if(i&&(i.innerHTML=I(a.content)+n),s){const c=s.querySelector(".simulated-pill");c&&(c.textContent=a.simulated?"SIMULATED • LOCAL":"LIVE • STAGE 2",c.className=a.simulated?"simulated-pill":"simulated-pill live-pill");const r=s.querySelector(".message-bubble-wrap"),l=document.createElement("div");l.className="message-actions-toolbar",l.innerHTML=`
            <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(a.content)}" title="Read message aloud">
              ${g.volume}
              <span>Listen</span>
            </button>
          `,r.appendChild(l)}this.messages.push(a),v.updateSessionMessages(this.activeSessionId,this.messages),this.onSessionChanged(v.getSession(this.activeSessionId)),this._updatePreviewFromMessages(),this.onActivityLogged("Transmission complete: Response synthesized"),this.drawerMsgCount&&(this.drawerMsgCount.textContent=`${this.messages.length} MESSAGES`);const o=v.loadSettings();o.ttsEnabled&&!w.isMuted?!w.speak(a.content,{voiceURI:o.voiceURI,rate:o.speechRate,pitch:o.speechPitch})&&this.neuralCore&&this.neuralCore.setState("idle"):this.neuralCore&&this.neuralCore.setState("idle")},onError:a=>{this.isStreaming=!1,this.btnSend&&this.textarea&&(this.btnSend.disabled=!this.textarea.value.trim()),i&&(i.innerHTML=`<p style="color: var(--status-error);">Error processing response: ${this._escapeHtml(a)}</p>`),this.neuralCore&&this.neuralCore.setState("idle"),d.error(`Execution error: ${a}`)}})}exportConversation(){if(this.messages.length===0){d.info("No messages to export in current session.");return}const e=v.getSession(this.activeSessionId),t=e?e.title:"NOVA_Transmission",s=JSON.stringify(this.messages,null,2),i=new Blob([s],{type:"application/json"}),a=URL.createObjectURL(i),n=document.createElement("a");n.href=a,n.download=`${t.replace(/\s+/g,"_").toLowerCase()}_${Date.now()}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(a),d.success("Conversation exported to JSON."),this.onActivityLogged(`Exported session: "${t}"`)}_scrollToBottom(){requestAnimationFrame(()=>{this.scrollArea&&(this.scrollArea.scrollTop=this.scrollArea.scrollHeight)})}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}function z(){return`<!DOCTYPE html>
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
</html>`}class j{constructor({container:e,onActivityLogged:t}){this.container=e,this.onActivityLogged=t||(()=>{}),this.currentDevice="desktop",this.sampleHtml=z(),this.init()}init(){this._renderLayout(),this._bindEvents(),this.loadSample()}_renderLayout(){this.container.innerHTML=`
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
                ${g.desktop}
                <span>Desktop</span>
              </button>
              <button class="device-btn" data-device="tablet" title="Tablet view (768px)">
                ${g.tablet}
                <span>Tablet</span>
              </button>
              <button class="device-btn" data-device="mobile" title="Mobile view (390px)">
                ${g.mobile}
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <!-- Description Prompt Input & Primary Preview Button -->
          <div class="studio-prompt-bar">
            <div class="studio-input-wrap">
              ${g.sparkles}
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
              ${g.studio}
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
            ${g.info}
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
                  ${g.refresh}
                </button>
                <button class="browser-btn" id="btnOpenNewTab" title="Open sample in new tab" aria-label="Open in new window">
                  ${g.externalLink}
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
    `}_bindEvents(){const e=this.container.querySelector("#studioPromptInput"),t=this.container.querySelector("#btnPreviewSample");this.container.querySelector("#studioIframe");const s=this.container.querySelector("#browserMockFrame"),i=this.container.querySelector("#btnReloadSample"),a=this.container.querySelector("#btnOpenNewTab"),n=this.container.querySelectorAll(".device-btn");n.forEach(c=>{c.addEventListener("click",()=>{n.forEach(l=>l.classList.remove("active")),c.classList.add("active");const r=c.getAttribute("data-device");this.currentDevice=r,s.setAttribute("data-device",r),this.onActivityLogged(`Website Studio viewport switched: ${r.toUpperCase()}`)})}),t.addEventListener("click",()=>{this.loadSample(),d.success("Loaded AURA Gastronomy sample showcase."),this.onActivityLogged("Website Studio: Rendered bundled restaurant sample")}),this.container.querySelectorAll(".studio-chip").forEach(c=>{c.addEventListener("click",()=>{const r=c.getAttribute("data-sample");r==="aura"?(e.value="Design a 3-Michelin-star luxury tasting restaurant website with reservations and celestial branding",this.loadSample(),d.info("Viewing bundled AURA Gastronomy showcase.")):r==="cyberpunk"?(e.value="Create a dystopian cyberpunk streetwear storefront with 3D product previews and neon glitch typography",d.info("Concept prompt applied. In production, this invokes live LLM code synthesis.")):r==="nexus"&&(e.value="Architect a developer-first quantum cloud computing platform with live latency telemetry",d.info("Concept prompt applied. In production, this invokes live LLM code synthesis."))})}),i.addEventListener("click",()=>{this.loadSample(),d.info("Sample frame refreshed.")}),a.addEventListener("click",()=>{const c=new Blob([this.sampleHtml],{type:"text/html"}),r=URL.createObjectURL(c);window.open(r,"_blank"),this.onActivityLogged("Opened sample website in new browser tab")})}loadSample(){const e=this.container.querySelector("#studioIframe");e&&(e.srcdoc=this.sampleHtml)}}class K{constructor({container:e,onSelectSession:t,onNewSession:s,onActivityLogged:i}){this.container=e,this.onSelectSession=t||(()=>{}),this.onNewSession=s||(()=>{}),this.onActivityLogged=i||(()=>{}),this.searchQuery="",this.init()}init(){this._renderLayout(),this._bindEvents(),this.refresh()}_renderLayout(){this.container.innerHTML=`
      <div class="modal-dialog" style="max-width: 620px; width: 100%; margin: 1.5rem auto; height: calc(100% - 3rem);">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${g.history}
            <span class="modal-title">Conversation Archive</span>
          </div>

          <button class="btn-primary" id="btnHistoryNewChat">
            ${g.plus}
            <span>New Chat</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Search Bar -->
          <div class="history-search-bar">
            ${g.search}
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
            ${g.trash}
            <span>Clear All History</span>
          </button>
        </div>
      </div>
    `}_bindEvents(){const e=this.container.querySelector("#historySearchInput"),t=this.container.querySelector("#btnHistoryNewChat"),s=this.container.querySelector("#btnClearAllHistory"),i=this.container.querySelector("#historyListContainer");e.addEventListener("input",a=>{this.searchQuery=a.target.value.toLowerCase().trim(),this.renderList()}),t.addEventListener("click",()=>{this.onNewSession()}),s.addEventListener("click",()=>{window.confirm("Are you sure you want to permanently clear all stored conversations? This cannot be undone.")&&(v.saveSessions([]),v.setActiveSessionId(null),this.onNewSession(),this.refresh(),this.onActivityLogged("Cleared all conversation history"),d.warning("All conversation records deleted."))}),i.addEventListener("click",a=>{const n=a.target.closest(".btn-delete-session");if(n){a.stopPropagation();const c=n.getAttribute("data-session-id");c&&(v.deleteSession(c),this.refresh(),this.onActivityLogged(`Deleted conversation: ${c}`),d.info("Conversation removed."));return}const o=a.target.closest(".history-item");if(o){const c=o.getAttribute("data-session-id");c&&this.onSelectSession(c)}})}refresh(){this.renderList()}renderList(){const e=this.container.querySelector("#historyListContainer"),t=this.container.querySelector("#historyTotalCount");if(!e)return;let s=v.getSessions();const i=v.getActiveSessionId();if(t&&(t.textContent=`${s.length} conversation${s.length===1?"":"s"} stored in browser`),this.searchQuery&&(s=s.filter(a=>{const n=a.title&&a.title.toLowerCase().includes(this.searchQuery),o=a.messages&&a.messages.some(c=>c.content&&c.content.toLowerCase().includes(this.searchQuery));return n||o})),s.length===0){e.innerHTML=`
        <div class="history-empty-text">
          <p>No conversations found.</p>
          <span style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.4rem; display: block;">
            Start asking NOVA questions to build your archive.
          </span>
        </div>
      `;return}e.innerHTML="",s.forEach(a=>{const n=new Date(a.updatedAt||a.createdAt).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),o=(a.messages||[]).length,c=a.id===i,r=document.createElement("div");r.className=`history-item ${c?"active":""}`,r.setAttribute("data-session-id",a.id),r.setAttribute("role","button"),r.setAttribute("tabindex","0"),r.innerHTML=`
        <div class="history-item-meta">
          <span class="history-item-title">${this._escapeHtml(a.title||"Untitled Session")}</span>
          <span class="history-item-sub">${n} &bull; ${o} message${o===1?"":"s"}${c?" &bull; [ACTIVE]":""}</span>
        </div>

        <div class="history-item-actions">
          <button
            class="icon-btn btn-delete-session"
            data-session-id="${a.id}"
            title="Delete this conversation"
            aria-label="Delete conversation"
            style="width: 28px; height: 28px; color: var(--text-dim);"
          >
            ${g.trash}
          </button>
        </div>
      `,e.appendChild(r)})}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}class Q{constructor({container:e,onActivityLogged:t}){this.container=e,this.onActivityLogged=t||(()=>{}),this.deviceSummary=null,this.isLoading=!1,this.activeTab="android",this.init()}init(){this._renderLayout(),this._bindEvents(),this.refresh()}_renderLayout(){this.container.innerHTML=`
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
              ${g.refresh}
              <span>Scan Hardware</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="devices-tabs-nav">
          <button type="button" class="devices-tab-btn active" data-tab="android">
            ${g.mobile}
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
                ${g.info}
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
                ${g.info}
                <span>Home Assistant Configuration & Access Token</span>
              </div>
            </div>
            <div class="guide-body">
              <ol class="guide-steps">
                <li>Log in to your <strong>Home Assistant</strong> dashboard.</li>
                <li>Click your profile icon at the bottom of the sidebar.</li>
                <li>Scroll to <strong>Long-Lived Access Tokens</strong> and click <em>Create Token</em>. Name it <code>NOVA</code>.</li>
                <li>Add the token and your instance URL to <code>backend/.env</code>:
                  <pre class="guide-pre">HASS_BASE_URL=http://homeassistant.local:8123
HASS_TOKEN=your_long_lived_token_here</pre>
                </li>
                <li><strong>Capability Gating:</strong> NOVA checks the <code>supported_features</code> bitmask on each media entity and will not attempt unsupported operations (e.g. setting exact volume on TVs with step-only volume).</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    `}_bindEvents(){const e=this.container.querySelectorAll(".devices-tab-btn");e.forEach(s=>{s.addEventListener("click",()=>{const i=s.getAttribute("data-tab");this.activeTab=i,e.forEach(o=>o.classList.toggle("active",o===s));const a=this.container.querySelector("#paneAndroid"),n=this.container.querySelector("#paneHass");a&&a.classList.toggle("active",i==="android"),n&&n.classList.toggle("active",i==="hass")})});const t=this.container.querySelector("#btnRefreshDevices");t&&t.addEventListener("click",()=>{this.refresh()}),this.container.addEventListener("click",s=>{const i=s.target.closest("[data-android-action]");if(i){const n=i.getAttribute("data-android-action"),o=i.getAttribute("data-serial");this._handleAndroidAction(n,o,i);return}const a=s.target.closest("[data-hass-action]");if(a){const n=a.getAttribute("data-hass-action"),o=a.getAttribute("data-entity-id");this._handleHassAction(n,o,a);return}})}async refresh(){if(!this.isLoading){this.isLoading=!0;try{this.onActivityLogged("Scanning real device connectors (Android ADB & Home Assistant)...");const e=await y.getDeviceSummary();this.deviceSummary=e,this._renderSummary(e),this.onActivityLogged("Device connectors status refreshed.")}catch(e){d.error(`Device scan failed: ${e.message}`)}finally{this.isLoading=!1}}}_renderSummary(e){var b;const t=e.android||{},s=e.homeAssistant||{},i=this.container.querySelector("#badgeAndroidCount");i&&(i.textContent=String(t.totalConnected||0));const a=this.container.querySelector("#txtAdbTitle"),n=this.container.querySelector("#txtAdbSubtitle"),o=this.container.querySelector("#dotAdbStatus"),c=this.container.querySelector("#badgeAdbState");t.adbAvailable?(a&&(a.textContent=`ADB BRIDGE ACTIVE (${t.totalConnected} DEVICES DETECTED)`),n&&(n.textContent="Local Automation Agent online on 127.0.0.1:3002"),o&&(o.className="status-dot dot-online"),c&&(c.innerHTML='<span class="panel-status-pill status-green">READY</span>')):(a&&(a.textContent="ADB BRIDGE: UNAVAILABLE"),n&&(n.textContent=t.guidance||"Android Debug Bridge (adb) binary not found on host machine."),o&&(o.className="status-dot dot-offline"),c&&(c.innerHTML='<span class="panel-status-pill status-amber">SETUP NEEDED</span>')),this._renderAndroidGrid(t.devices||[]);const r=this.container.querySelector("#badgeHassCount"),l=((b=s.entities)==null?void 0:b.totalCount)||0;r&&(r.textContent=String(l));const p=this.container.querySelector("#txtHassTitle"),u=this.container.querySelector("#txtHassSubtitle"),h=this.container.querySelector("#dotHassStatus"),m=this.container.querySelector("#badgeHassState");s.online?(p&&(p.textContent=`${(s.locationName||"HOME ASSISTANT").toUpperCase()} (${l} ENTITIES)`),u&&(u.textContent=s.message||"REST & WebSocket connected"),h&&(h.className="status-dot dot-online"),m&&(m.innerHTML=s.isSimulatedFixture?'<span class="panel-status-pill status-amber">[SIMULATED FIXTURE]</span>':'<span class="panel-status-pill status-green">CONNECTED</span>')):(p&&(p.textContent="HOME ASSISTANT: OFFLINE"),u&&(u.textContent=s.message||"Configure HASS_BASE_URL and HASS_TOKEN in backend/.env"),h&&(h.className="status-dot dot-offline"),m&&(m.innerHTML='<span class="panel-status-pill status-amber">DISCONNECTED</span>')),this._renderHassGrids(s.entities||{})}_renderAndroidGrid(e){const t=this.container.querySelector("#gridAndroidDevices");if(t){if(!e||e.length===0){t.innerHTML=`
        <div class="device-empty-state">
          No Android devices detected via ADB. Connect your device via USB or Wi-Fi with USB debugging enabled.
        </div>
      `;return}t.innerHTML=e.map(s=>{let i="status-green",a="AUTHORIZED";return s.state==="unauthorized"?(i="status-amber",a="UNAUTHORIZED (CHECK RSA PROMPT)"):s.state==="offline"&&(i="status-red",a="OFFLINE"),`
        <div class="device-card ${s.canExecute?"card-authorized":"card-disabled"}">
          <div class="device-card-header">
            <div class="device-card-title-wrap">
              <span class="device-type-icon">${g.mobile}</span>
              <div>
                <span class="device-card-name">${this._escapeHtml(s.friendlyName)}</span>
                <span class="device-card-serial">ID: ${this._escapeHtml(s.serial)} &bull; ${this._escapeHtml(s.product)}</span>
              </div>
            </div>
            <span class="panel-status-pill ${i}">${a}</span>
          </div>

          <div class="device-card-desc">
            ${this._escapeHtml(s.stateDescription)}
          </div>

          ${s.canExecute?`
            <div class="device-card-actions">
              <div class="action-btn-group">
                <button type="button" class="btn-device-action" data-android-action="media_play_pause" data-serial="${s.serial}" title="Toggle Play / Pause">
                  Play / Pause
                </button>
                <button type="button" class="btn-device-action" data-android-action="volume_up" data-serial="${s.serial}" title="Volume Up">
                  Vol +
                </button>
                <button type="button" class="btn-device-action" data-android-action="volume_down" data-serial="${s.serial}" title="Volume Down">
                  Vol -
                </button>
                <button type="button" class="btn-device-action" data-android-action="home" data-serial="${s.serial}" title="Home Key">
                  Home
                </button>
              </div>

              <div class="action-btn-group" style="margin-top: 0.4rem;">
                <button type="button" class="btn-device-action" data-android-action="launch_youtube" data-serial="${s.serial}">
                  YouTube
                </button>
                <button type="button" class="btn-device-action" data-android-action="launch_chrome" data-serial="${s.serial}">
                  Chrome
                </button>
                <button type="button" class="btn-device-action" data-android-action="launch_settings" data-serial="${s.serial}">
                  Settings
                </button>
                <button type="button" class="btn-device-action btn-action-accent" data-android-action="screenshot" data-serial="${s.serial}" title="Requires explicit consent">
                  📸 Capture Screen
                </button>
              </div>
            </div>
          `:`
            <div class="device-card-notice">
              ⚠️ Commands disabled: Device must be authorized on screen before automation is permitted.
            </div>
          `}
        </div>
      `}).join("")}}_renderHassGrids(e){const t=this.container.querySelector("#gridHassMedia"),s=this.container.querySelector("#gridHassSwitches"),i=e.mediaPlayers||[],a=[...e.lights||[],...e.switches||[]];t&&(i.length===0?t.innerHTML='<div class="device-empty-state">No media player or TV entities discovered.</div>':t.innerHTML=i.map(n=>{let o="status-green";(n.state==="off"||n.state==="standby")&&(o="status-gray"),n.isAvailable||(o="status-red");const c=n.capabilities||{},r=[c.supportsTurnOn?"Power":null,c.supportsVolumeSet?"Vol Set":null,c.supportsVolumeMute?"Mute":null,c.supportsPlay||c.supportsPause?"Playback":null,c.supportsSelectSource?"Source":null].filter(Boolean);return`
            <div class="device-card ${n.isAvailable?"":"card-unavailable"}">
              <div class="device-card-header">
                <div class="device-card-title-wrap">
                  <span class="device-type-icon">📺</span>
                  <div>
                    <span class="device-card-name">${this._escapeHtml(n.friendlyName)}</span>
                    <span class="device-card-serial">${this._escapeHtml(n.entityId)} &bull; ${n.deviceClass.toUpperCase()}</span>
                  </div>
                </div>
                <span class="panel-status-pill ${o}">${n.state.toUpperCase()}</span>
              </div>

              <div class="device-meta-row">
                <div class="cap-pills-row">
                  ${r.map(l=>`<span class="cap-pill">${l}</span>`).join("")}
                </div>
                ${n.volumeLevel!==null?`<span class="volume-tag">Vol: ${n.volumeLevel}%</span>`:""}
              </div>

              ${n.isAvailable?`
                <div class="device-card-actions">
                  <div class="action-btn-group">
                    <button type="button" class="btn-device-action" data-hass-action="power" data-entity-id="${n.entityId}">
                      Power ${n.state==="off"?"On":"Off"}
                    </button>
                    <button type="button" class="btn-device-action" data-hass-action="play_pause" data-entity-id="${n.entityId}">
                      Play / Pause
                    </button>
                    <button type="button" class="btn-device-action" data-hass-action="mute" data-entity-id="${n.entityId}">
                      ${n.isMuted?"Unmute":"Mute"}
                    </button>
                  </div>
                </div>
              `:`
                <div class="device-card-notice notice-unavailable">
                  ⚠️ Entity is currently ${n.state}. Remote commands cannot be dispatched.
                </div>
              `}
            </div>
          `}).join("")),s&&(a.length===0?s.innerHTML='<div class="device-empty-state">No lights or switches discovered.</div>':s.innerHTML=a.map(n=>{let o=n.state==="on"?"status-green":n.isAvailable?"status-gray":"status-red";const c=n.entityId.startsWith("light.");return`
            <div class="device-card ${n.isAvailable?"":"card-unavailable"}">
              <div class="device-card-header">
                <div class="device-card-title-wrap">
                  <span class="device-type-icon">${c?"💡":"🔌"}</span>
                  <div>
                    <span class="device-card-name">${this._escapeHtml(n.friendlyName)}</span>
                    <span class="device-card-serial">${this._escapeHtml(n.entityId)}</span>
                  </div>
                </div>
                <span class="panel-status-pill ${o}">${n.state.toUpperCase()}</span>
              </div>

              ${n.isAvailable?`
                <div class="device-card-actions">
                  <button type="button" class="btn-device-action" data-hass-action="toggle_switch" data-entity-id="${n.entityId}">
                    Turn ${n.state==="on"?"Off":"On"}
                  </button>
                  ${c&&n.brightnessPercent!==null?`
                    <span class="volume-tag">Brightness: ${n.brightnessPercent}%</span>
                  `:""}
                </div>
              `:`
                <div class="device-card-notice notice-unavailable">
                  ⚠️ Entity is ${n.state}.
                </div>
              `}
            </div>
          `}).join(""))}async _handleAndroidAction(e,t,s){s&&(s.disabled=!0);try{if(e==="screenshot"){if(!confirm(`CONSENT REQUIRED:
Capture screenshot of Android device (${t}) and transfer to NOVA workspace?`)){d.info("Screenshot cancelled by operator.");return}this.onActivityLogged(`Capturing authorized screenshot on Android (${t})...`);const a=await y.executeAndroidAction("androidTakeScreenshot",{serial:t,confirmed:!0});d.success(`Screenshot saved: ${a.filename}`),this.onActivityLogged(`Screenshot captured: ${a.filename} (${Math.round(a.sizeBytes/1024)} KB).`);return}if(e.startsWith("launch_")){const i=e.replace("launch_","");this.onActivityLogged(`Launching Android app '${i}' on ${t}...`),await y.executeAndroidAction("androidLaunchApp",{serial:t,appName:i}),d.success(`Launched ${i} on Android device.`);return}if(["media_play_pause","volume_up","volume_down","home"].includes(e)){let i="play_pause";e==="volume_up"&&(i="volume_up"),e==="volume_down"&&(i="volume_down"),e==="home"&&(i="home"),await y.executeAndroidAction("androidSendMediaKey",{serial:t,keycode:i}),d.info(`Sent keycode '${i}' to Android device.`);return}}catch(i){d.error(`Android action failed: ${i.message}`)}finally{s&&(s.disabled=!1)}}async _handleHassAction(e,t,s){var i,a,n,o,c,r,l,p,u,h;s&&(s.disabled=!0);try{if(e==="power"){const m=(o=(n=(a=(i=this.deviceSummary)==null?void 0:i.homeAssistant)==null?void 0:a.entities)==null?void 0:n.mediaPlayers)==null?void 0:o.find(f=>f.entityId===t),b=(m==null?void 0:m.state)==="off"?"turn_on":"turn_off";await y.controlHassMedia({entityId:t,action:b}),d.success(`Dispatched '${b}' to ${t}.`),await this.refresh();return}if(e==="play_pause"||e==="mute"){const m=e==="play_pause"?"play_pause":"volume_mute";await y.controlHassMedia({entityId:t,action:m}),d.success(`Dispatched '${m}' to ${t}.`),await this.refresh();return}if(e==="toggle_switch"){const m=[...((l=(r=(c=this.deviceSummary)==null?void 0:c.homeAssistant)==null?void 0:r.entities)==null?void 0:l.lights)||[],...((h=(u=(p=this.deviceSummary)==null?void 0:p.homeAssistant)==null?void 0:u.entities)==null?void 0:h.switches)||[]].find(f=>f.entityId===t),b=(m==null?void 0:m.state)==="on"?"turn_off":"turn_on";await y.controlHassLight({entityId:t,action:b}),d.success(`Applied '${b}' to ${t}.`),await this.refresh();return}}catch(m){d.error(`Smart home command failed: ${m.message}`)}finally{s&&(s.disabled=!1)}}_escapeHtml(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}}class J{constructor({container:e,onActivityLogged:t}){this.container=e,this.onActivityLogged=t||(()=>{}),this.activeTab="docs",this.documents=[],this.memories=[],this.workflows=[],this.timeline=[],this.activeWorkflowRun=null,this.isQuerying=!1,this.init()}init(){this._renderLayout(),this._bindEvents(),this.refresh()}_renderLayout(){this.container.innerHTML=`
      <div class="knowledge-view-wrapper">
        <!-- Holographic Section Header -->
        <div class="knowledge-header">
          <div class="knowledge-title-wrap">
            <span class="panel-bracket">[</span>
            <span class="panel-tag">COGNITIVE ARCHIVE</span>
            <span class="knowledge-main-title">PERSONAL KNOWLEDGE & WORKFLOWS</span>
            <span class="panel-bracket">]</span>
          </div>
          <div class="knowledge-header-actions">
            <button type="button" class="btn-holo-sm" id="btnRefreshKnowledge" title="Sync Knowledge & Workflows">
              ${g.refresh}
              <span>Sync Archive</span>
            </button>
          </div>
        </div>

        <!-- Subsystem Tabs -->
        <div class="knowledge-tabs-nav">
          <button type="button" class="knowledge-tab-btn active" data-tab="docs">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Document Library</span>
          </button>
          <button type="button" class="knowledge-tab-btn" data-tab="memories">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Personal Memories</span>
          </button>
          <button type="button" class="knowledge-tab-btn" data-tab="workflows">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>Reusable Workflows</span>
          </button>
          <button type="button" class="knowledge-tab-btn" data-tab="timeline">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Activity Timeline</span>
          </button>
        </div>

        <!-- Tab 1: Document Library & Grounded QA -->
        <div class="knowledge-tab-content active" id="tabContentDocs">
          <div class="knowledge-grid">
            <!-- Left: Document Ingestion & Inventory -->
            <div class="knowledge-panel upload-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">INGESTION GATE</span>
                <span class="telemetry-badge">PDF • TXT • MD (Max 25MB)</span>
              </div>

              <!-- Drag & Drop Zone -->
              <div class="drop-zone" id="docDropZone">
                <input type="file" id="docFileInput" accept=".pdf,.txt,.md" style="display:none;" />
                <div class="drop-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div class="drop-prompt">
                  <strong>Click or Drag & Drop</strong>
                  <span>Upload validated documents for neural passage indexing</span>
                </div>
              </div>

              <!-- Document List -->
              <div class="doc-list-head">
                <span class="telemetry-label">INDEXED ARCHIVES</span>
                <span class="doc-count-badge" id="docCountBadge">0 files</span>
              </div>
              <div class="doc-list-scroll" id="docListContainer">
                <div class="doc-empty-state">No personal documents indexed yet. Upload PDF, TXT, or MD files.</div>
              </div>
            </div>

            <!-- Right: Document QA & Citation Inspector -->
            <div class="knowledge-panel qa-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">DOCUMENT RETRIEVAL & CITATION ENGINE</span>
                <span class="telemetry-badge" id="sourceTypePill">AWAITING QUERY</span>
              </div>

              <div class="qa-input-wrap">
                <input type="text" id="qaQueryInput" class="holo-input" placeholder="Ask a question about your indexed personal documents..." />
                <button type="button" class="btn-holo-primary" id="btnRunQuery">
                  <span>Retrieve</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div class="qa-results-container" id="qaResultsContainer">
                <div class="qa-placeholder">
                  <p>Ask a question above to test grounded passage retrieval with filename and page citations.</p>
                  <p class="qa-hint">Answers will explicitly differentiate between <strong>[DOC-SUPPORTED]</strong> and <strong>[GENERAL-KNOWLEDGE]</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Personal Memories & Explicit Preferences -->
        <div class="knowledge-tab-content" id="tabContentMemories">
          <div class="knowledge-grid">
            <!-- Left: Add Memory Form -->
            <div class="knowledge-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">EXPLICIT MEMORY CAPTURE</span>
                <span class="telemetry-badge">PERSISTENT</span>
              </div>
              <form id="formAddMemory" class="holo-form">
                <div class="form-group">
                  <label>Category</label>
                  <select id="memCategory" class="holo-select">
                    <option value="general">General</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="preference">Preference</option>
                    <option value="fact">Personal Fact</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Topic / Key</label>
                  <input type="text" id="memKey" class="holo-input" placeholder="e.g. coding_editor, study_goal" required />
                </div>
                <div class="form-group">
                  <label>Memory Value / Instruction</label>
                  <textarea id="memValue" class="holo-textarea" rows="3" placeholder="Explicit preference or fact for NOVA to remember..." required></textarea>
                </div>
                <button type="submit" class="btn-holo-primary" id="btnSaveMemory">
                  <span>Remember Fact</span>
                </button>
              </form>
            </div>

            <!-- Right: Stored Memories -->
            <div class="knowledge-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">ACTIVE MEMORIES INVENTORY</span>
                <span class="telemetry-badge" id="memoryCountBadge">0 memories</span>
              </div>
              <div class="memory-filter-pills" id="memoryCategoryFilters">
                <button type="button" class="filter-pill active" data-cat="all">ALL</button>
                <button type="button" class="filter-pill" data-cat="study">STUDY</button>
                <button type="button" class="filter-pill" data-cat="work">WORK</button>
                <button type="button" class="filter-pill" data-cat="preference">PREFERENCES</button>
                <button type="button" class="filter-pill" data-cat="fact">FACTS</button>
              </div>
              <div class="memories-scroll" id="memoriesContainer">
                <div class="doc-empty-state">No explicit memories stored yet.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Reusable Workflows -->
        <div class="knowledge-tab-content" id="tabContentWorkflows">
          <div class="workflows-header-panel">
            <div class="panel-subhead">
              <span class="telemetry-label">WORKFLOW EXECUTION PIPELINE</span>
              <span class="telemetry-badge">FAIL-SAFE • SEQUENTIAL • CONFIRMATION-GATED</span>
            </div>
            <p class="section-desc">
              Execute multi-step tactical automation workflows across local processes, physical Android devices, and smart home appliances. If any step fails, execution halts safely immediately.
            </p>
          </div>

          <!-- Active Run Status Banner (If running or paused) -->
          <div class="workflow-active-banner hidden" id="workflowActiveBanner"></div>

          <!-- Workflow Cards Grid -->
          <div class="workflows-cards-grid" id="workflowCardsGrid"></div>
        </div>

        <!-- Tab 4: Activity Timeline -->
        <div class="knowledge-tab-content" id="tabContentTimeline">
          <div class="timeline-header-panel">
            <div class="panel-subhead">
              <span class="telemetry-label">AUDITED ACTIVITY STREAM</span>
              <span class="telemetry-badge" id="timelineCountBadge">0 events</span>
            </div>
          </div>
          <div class="timeline-scroll-container" id="timelineScrollContainer">
            <div class="doc-empty-state">No activity events recorded yet.</div>
          </div>
        </div>
      </div>
    `}_bindEvents(){const e=this.container.querySelector("#btnRefreshKnowledge");e&&e.addEventListener("click",()=>this.refresh());const t=this.container.querySelectorAll(".knowledge-tab-btn");t.forEach(r=>{r.addEventListener("click",()=>{t.forEach(p=>p.classList.remove("active")),r.classList.add("active"),this.activeTab=r.dataset.tab,this.container.querySelectorAll(".knowledge-tab-content").forEach(p=>p.classList.remove("active"));const l=this.container.querySelector(`#tabContent${r.dataset.tab.charAt(0).toUpperCase()+r.dataset.tab.slice(1)}`);l&&l.classList.add("active")})});const s=this.container.querySelector("#docDropZone"),i=this.container.querySelector("#docFileInput");s&&i&&(s.addEventListener("click",()=>i.click()),s.addEventListener("dragover",r=>{r.preventDefault(),s.classList.add("drag-over")}),s.addEventListener("dragleave",()=>s.classList.remove("drag-over")),s.addEventListener("drop",r=>{var l;r.preventDefault(),s.classList.remove("drag-over"),((l=r.dataTransfer.files)==null?void 0:l.length)>0&&this._handleFileUpload(r.dataTransfer.files[0])}),i.addEventListener("change",()=>{var r;((r=i.files)==null?void 0:r.length)>0&&(this._handleFileUpload(i.files[0]),i.value="")}));const a=this.container.querySelector("#btnRunQuery"),n=this.container.querySelector("#qaQueryInput");if(a&&n){const r=()=>this._handleKnowledgeQuery(n.value);a.addEventListener("click",r),n.addEventListener("keydown",l=>{l.key==="Enter"&&r()})}const o=this.container.querySelector("#formAddMemory");o&&o.addEventListener("submit",async r=>{var h,m,b;r.preventDefault();const l=((h=this.container.querySelector("#memCategory"))==null?void 0:h.value)||"general",p=((m=this.container.querySelector("#memKey"))==null?void 0:m.value)||"",u=((b=this.container.querySelector("#memValue"))==null?void 0:b.value)||"";if(!(!p.trim()||!u.trim()))try{await y.createPersonalMemory({category:l,keyName:p.trim(),valueText:u.trim()}),d.success(`Memory '${p}' saved.`),this.container.querySelector("#memKey").value="",this.container.querySelector("#memValue").value="",await this._loadMemories()}catch(f){d.error(`Failed to save memory: ${f.message}`)}});const c=this.container.querySelectorAll(".filter-pill");c.forEach(r=>{r.addEventListener("click",()=>{c.forEach(p=>p.classList.remove("active")),r.classList.add("active");const l=r.dataset.cat==="all"?null:r.dataset.cat;this._loadMemories(l)})})}async refresh(){await Promise.all([this._loadDocuments(),this._loadMemories(),this._loadWorkflows(),this._loadTimeline()])}async _handleFileUpload(e){if(!e)return;const t=[".pdf",".txt",".md"],s=e.name.slice(e.name.lastIndexOf(".")).toLowerCase();if(!t.includes(s)){d.error(`Unsupported format '${s}'. Allowed: .pdf, .txt, .md`);return}try{d.info(`Indexing document: ${e.name}...`);const i=await y.uploadKnowledgeDocument(e);d.success(`Indexed '${e.name}' (${i.chunkCount} passages, ${i.pageCount} pages).`),this.onActivityLogged("DOCUMENT_INGESTED",{filename:e.name,chunks:i.chunkCount}),await this._loadDocuments()}catch(i){d.error(`Upload failed: ${i.message}`)}}async _loadDocuments(){try{this.documents=await y.getKnowledgeDocuments(),this._renderDocuments()}catch(e){console.warn("Failed to load documents:",e)}}_renderDocuments(){const e=this.container.querySelector("#docCountBadge");e&&(e.textContent=`${this.documents.length} file(s)`);const t=this.container.querySelector("#docListContainer");if(t){if(this.documents.length===0){t.innerHTML='<div class="doc-empty-state">No personal documents indexed yet. Upload PDF, TXT, or MD files above.</div>';return}t.innerHTML=this.documents.map(s=>`
        <div class="doc-card" data-id="${s.id}">
          <div class="doc-card-info">
            <span class="doc-type-pill ${s.fileType}">${s.fileType.toUpperCase()}</span>
            <div class="doc-name-wrap">
              <span class="doc-name" title="${s.originalName}">${s.originalName}</span>
              <span class="doc-meta-sub">${s.pageCount} page(s) • ${s.chunkCount} chunks • ${(s.fileSize/1024).toFixed(1)} KB</span>
            </div>
          </div>
          <button type="button" class="btn-doc-delete" title="Purge from knowledge index" data-del-id="${s.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `).join(""),t.querySelectorAll(".btn-doc-delete").forEach(s=>{s.addEventListener("click",async i=>{i.stopPropagation();const a=s.dataset.delId;if(confirm("Are you sure you want to permanently delete this document and remove it from the knowledge index?"))try{await y.deleteKnowledgeDocument(a),d.success("Document deleted and purged from index."),await this._loadDocuments()}catch(n){d.error(`Delete failed: ${n.message}`)}})})}}async _handleKnowledgeQuery(e){if(!e||!e.trim())return;const t=this.container.querySelector("#qaResultsContainer"),s=this.container.querySelector("#sourceTypePill");t.innerHTML=`
      <div class="qa-loading">
        <div class="loading-spinner"></div>
        <span>Searching indexed personal passages...</span>
      </div>
    `;try{const i=await y.queryKnowledgeDocuments(e.trim());s&&(i.isDocumentSupported?(s.textContent="DOCUMENT-SUPPORTED",s.className="telemetry-badge supported"):(s.textContent="GENERAL KNOWLEDGE",s.className="telemetry-badge general"));let a="";i.citations&&i.citations.length>0&&(a=`
          <div class="citations-section">
            <span class="telemetry-label">GROUNDED SOURCE CITATIONS</span>
            <div class="citations-grid">
              ${i.citations.map(n=>`
                <div class="citation-card">
                  <div class="citation-head">
                    <span class="citation-filename">${n.filename}</span>
                    <span class="citation-page">p. ${n.page}</span>
                  </div>
                  <div class="citation-snippet">"${n.snippet}"</div>
                </div>
              `).join("")}
            </div>
          </div>
        `),t.innerHTML=`
        <div class="qa-response-card ${i.isDocumentSupported?"supported":"general"}">
          <div class="qa-badge-banner">
            <span class="qa-badge ${i.sourceType}">
              ${i.isDocumentSupported?"✓ DOCUMENT-SUPPORTED":"⚡ GENERAL-KNOWLEDGE"}
            </span>
            <span class="qa-query-echo">Query: "${i.query}"</span>
          </div>
          <div class="qa-answer-text">${i.answer.replace(/\n/g,"<br/>")}</div>
          ${a}
        </div>
      `}catch(i){t.innerHTML=`<div class="qa-error">Query failed: ${i.message}</div>`}}async _loadMemories(e=null){try{this.memories=await y.getPersonalMemories(e),this._renderMemories()}catch(t){console.warn("Failed to load memories:",t)}}_renderMemories(){const e=this.container.querySelector("#memoryCountBadge");e&&(e.textContent=`${this.memories.length} item(s)`);const t=this.container.querySelector("#memoriesContainer");if(t){if(this.memories.length===0){t.innerHTML='<div class="doc-empty-state">No personal memories in this category.</div>';return}t.innerHTML=this.memories.map(s=>`
        <div class="memory-card" data-id="${s.id}">
          <div class="mem-head">
            <span class="mem-cat-badge ${s.category}">${s.category.toUpperCase()}</span>
            <span class="mem-key">${s.keyName}</span>
            <button type="button" class="btn-mem-del" data-del-id="${s.id}" title="Forget memory">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="mem-value">${s.valueText}</div>
        </div>
      `).join(""),t.querySelectorAll(".btn-mem-del").forEach(s=>{s.addEventListener("click",async()=>{const i=s.dataset.delId;if(confirm("Permanently delete this explicit memory?"))try{await y.deletePersonalMemory(i),d.success("Memory deleted."),await this._loadMemories()}catch(a){d.error(`Delete failed: ${a.message}`)}})})}}async _loadWorkflows(){try{this.workflows=await y.getWorkflows(),this._renderWorkflows()}catch(e){console.warn("Failed to load workflows:",e)}}_renderWorkflows(){const e=this.container.querySelector("#workflowCardsGrid");e&&(e.innerHTML=this.workflows.map(t=>{var s;return`
        <div class="workflow-card" data-id="${t.id}">
          <div class="wf-card-top">
            <span class="wf-step-badge">${t.stepCount||((s=t.steps)==null?void 0:s.length)||0} Steps</span>
            <span class="wf-builtin-badge">${t.isBuiltin?"CORE TEMPLATE":"CUSTOM"}</span>
          </div>
          <div class="wf-card-title">${t.name}</div>
          <div class="wf-card-desc">${t.description}</div>
          <div class="wf-card-actions">
            <button type="button" class="btn-holo-sm btn-inspect-wf" data-wf-id="${t.id}">
              <span>Inspect Steps</span>
            </button>
            <button type="button" class="btn-holo-primary btn-run-wf" data-wf-id="${t.id}">
              <span>Run Workflow</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
        </div>
      `}).join(""),e.querySelectorAll(".btn-inspect-wf").forEach(t=>{t.addEventListener("click",async()=>{const s=t.dataset.wfId;try{const i=await y.proposeWorkflow(s),a=i.proposedSteps.map((n,o)=>`${o+1}. [${n.toolName}] ${n.name}`).join(`
`);alert(`Workflow: ${i.name}

Proposed Steps:
${a}`)}catch(i){d.error(i.message)}})}),e.querySelectorAll(".btn-run-wf").forEach(t=>{t.addEventListener("click",async()=>{const s=t.dataset.wfId;await this._executeWorkflow(s)})}))}async _executeWorkflow(e){const t=this.container.querySelector("#workflowActiveBanner");t&&(t.classList.remove("hidden"),t.innerHTML=`
        <div class="wf-banner-inner">
          <div class="loading-spinner"></div>
          <span class="wf-banner-status">Initiating sequential execution for '${e}'...</span>
        </div>
      `);try{d.info(`Executing workflow: ${e}...`);const s=await y.runWorkflow(e,{});this.activeWorkflowRun=s,this._renderActiveWorkflowStatus(s),s.status==="succeeded"?d.success(`Workflow '${s.workflowName}' succeeded! (${s.stepsCompleted}/${s.totalSteps} steps completed).`):s.status==="failed"?d.error(`Workflow stopped safely: Step ${s.failedAtStep+1} failed (${s.error}).`):s.status==="awaiting_confirmation"&&d.warn(`Workflow paused: Step ${s.pendingStep.stepIndex+1} requires operator confirmation.`),await this._loadTimeline()}catch(s){d.error(`Workflow failed to launch: ${s.message}`),t&&t.classList.add("hidden")}}_renderActiveWorkflowStatus(e){const t=this.container.querySelector("#workflowActiveBanner");if(!t||!e)return;t.classList.remove("hidden");const s=(e.steps||[]).map((c,r)=>`
        <div class="wf-step-node ${c.status}">
          <span class="wf-step-num">${r+1}</span>
          <div class="wf-step-details">
            <span class="wf-step-title">${c.name}</span>
            <span class="wf-step-sub">${c.toolName} • ${c.status.toUpperCase()}</span>
          </div>
        </div>
      `).join("");let i="";e.status==="awaiting_confirmation"&&e.pendingStep?i=`
        <div class="wf-confirm-bar">
          <span>⚠️ Step ${e.pendingStep.stepIndex+1} (${e.pendingStep.name}) requires operator confirmation.</span>
          <button type="button" class="btn-holo-primary btn-resume-wf">
            <span>Confirm & Proceed</span>
          </button>
          <button type="button" class="btn-holo-sm btn-cancel-wf">
            <span>Abort Workflow</span>
          </button>
        </div>
      `:e.status==="running"?i=`
        <button type="button" class="btn-holo-sm btn-cancel-wf">
          <span>Cancel Execution</span>
        </button>
      `:i=`
        <button type="button" class="btn-holo-sm btn-close-wf-banner">
          <span>Dismiss</span>
        </button>
      `,t.innerHTML=`
      <div class="wf-banner-card ${e.status}">
        <div class="wf-banner-top">
          <span class="wf-name">${e.workflowName||e.workflowId}</span>
          <span class="wf-status-pill ${e.status}">${(e.status||"running").toUpperCase()}</span>
        </div>
        <div class="wf-steps-track">${s}</div>
        ${i}
      </div>
    `;const a=t.querySelector(".btn-resume-wf");a&&a.addEventListener("click",async()=>{try{const c=await y.resumeWorkflowRun(e.runId,{confirmationToken:e.pendingStep.confirmationToken,confirmed:!0});this._renderActiveWorkflowStatus(c),await this._loadTimeline()}catch(c){d.error(c.message)}});const n=t.querySelector(".btn-cancel-wf");n&&n.addEventListener("click",async()=>{try{const c=await y.cancelWorkflowRun(e.runId);d.warn("Workflow execution cancelled."),this._renderActiveWorkflowStatus(c),await this._loadTimeline()}catch(c){d.error(c.message)}});const o=t.querySelector(".btn-close-wf-banner");o&&o.addEventListener("click",()=>t.classList.add("hidden"))}async _loadTimeline(){try{this.timeline=await y.getActivityTimeline(25),this._renderTimeline()}catch(e){console.warn("Failed to load timeline:",e)}}_renderTimeline(){const e=this.container.querySelector("#timelineCountBadge");e&&(e.textContent=`${this.timeline.length} event(s)`);const t=this.container.querySelector("#timelineScrollContainer");if(t){if(this.timeline.length===0){t.innerHTML='<div class="doc-empty-state">No activity events recorded yet.</div>';return}t.innerHTML=this.timeline.map(s=>`
        <div class="timeline-item ${s.status}">
          <div class="timeline-left">
            <span class="timeline-dot ${s.status}"></span>
            <span class="timeline-time">${new Date(s.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="timeline-content">
            <div class="timeline-title-row">
              <span class="timeline-title">${s.title}</span>
              <span class="timeline-status-pill ${s.status}">${(s.status||"succeeded").toUpperCase()}</span>
            </div>
            <div class="timeline-summary">${s.summary||""}</div>
          </div>
          ${s.isCancellable?`<button type="button" class="btn-timeline-cancel" data-id="${s.id}" title="Cancel operation">Cancel</button>`:""}
        </div>
      `).join("")}}}class Y{constructor({neuralCore:e,onSettingsUpdated:t,onActivityLogged:s}){this.neuralCore=e,this.onSettingsUpdated=t||(()=>{}),this.onActivityLogged=s||(()=>{}),this.backdrop=null,this.isOpen=!1,this.init()}init(){this.backdrop=document.createElement("div"),this.backdrop.className="modal-backdrop",this.backdrop.setAttribute("role","dialog"),this.backdrop.setAttribute("aria-modal","true"),this.backdrop.setAttribute("aria-label","System Settings"),this._render(),document.body.appendChild(this.backdrop),this._bindEvents()}_render(){const e=v.loadSettings();this.backdrop.innerHTML=`
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${g.settings}
            <span class="modal-title">System Settings</span>
          </div>
          <button class="icon-btn btn-modal-close" aria-label="Close settings">
            ${g.close}
          </button>
        </div>

        <div class="modal-body">
          <!-- Voice & Audio Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${g.volume}
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
                ${g.volume}
                <span style="margin-left: 0.35rem;">Test Voice Output</span>
              </button>
            </div>
          </div>

          <!-- Graphics & Animation Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${g.cpu}
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
                <span class="setting-desc">Color wavelength of HUD and sculpture glow</span>
              </div>
              <select class="setting-select" id="settingThemeAccent">
                <option value="cyan" ${e.themeAccent==="cyan"?"selected":""}>Electric Cyan (Default)</option>
                <option value="violet" ${e.themeAccent==="violet"?"selected":""}>Amethyst Violet</option>
                <option value="amber" ${e.themeAccent==="amber"?"selected":""}>Warm Amber</option>
              </select>
            </div>

            <!-- 3D Graphics Quality -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Rendering Quality</span>
                <span class="setting-desc">Resolution density and particle volume</span>
              </div>
              <select class="setting-select" id="settingQuality">
                <option value="high" ${e.quality==="high"||!e.quality?"selected":""}>High (Full DPR & Particles)</option>
                <option value="medium" ${e.quality==="medium"?"selected":""}>Medium (Balanced)</option>
                <option value="low" ${e.quality==="low"?"selected":""}>Performance (Low DPR & Battery Saver)</option>
              </select>
            </div>
          </div>

          <!-- Local Storage & Reset Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${g.history}
              <span>Data & Privacy</span>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Export Archive</span>
                <span class="setting-desc">Download all local conversations and preferences as JSON</span>
              </div>
              <button type="button" class="btn-secondary" id="btnExportData">
                ${g.download}
                <span style="margin-left: 0.35rem;">Export JSON</span>
              </button>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Reset Local Data</span>
                <span class="setting-desc">Permanently wipe conversation records and restore defaults</span>
              </div>
              <button type="button" class="btn-danger" id="btnResetData">
                ${g.trash}
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
    `,this._populateVoices()}_populateVoices(){const e=this.backdrop.querySelector("#settingVoiceSelect");if(!e)return;const t=w.getVoices(),s=v.loadSettings().voiceURI;e.innerHTML='<option value="">Default System Voice</option>',t.forEach(i=>{const a=document.createElement("option");a.value=i.voiceURI,a.textContent=`${i.name} (${i.lang})`,i.voiceURI===s&&(a.selected=!0),e.appendChild(a)})}_bindEvents(){this.backdrop.querySelectorAll(".btn-modal-close").forEach(u=>u.addEventListener("click",()=>this.close())),this.backdrop.addEventListener("click",u=>{u.target===this.backdrop&&this.close()}),window.addEventListener("keydown",u=>{u.key==="Escape"&&this.isOpen&&this.close()}),this.backdrop.querySelector("#settingTtsToggle").addEventListener("change",u=>{v.saveSettings({ttsEnabled:u.target.checked}),this.onActivityLogged(`Voice output ${u.target.checked?"enabled":"disabled"}`)}),this.backdrop.querySelector("#settingVoiceSelect").addEventListener("change",u=>{v.saveSettings({voiceURI:u.target.value}),this.onActivityLogged("Voice persona updated")});const i=this.backdrop.querySelector("#settingSpeechRate"),a=this.backdrop.querySelector("#valSpeechRate");i.addEventListener("input",u=>{const h=parseFloat(u.target.value);a.textContent=`${h.toFixed(2)}x`,v.saveSettings({speechRate:h})}),this.backdrop.querySelector("#btnTestVoice").addEventListener("click",()=>{const u=v.loadSettings();w.speak("NOVA neural audio engine operational. All acoustic parameters calibrated.",{voiceURI:u.voiceURI,rate:u.speechRate})}),this.backdrop.querySelector("#settingReducedMotion").addEventListener("change",u=>{const h=u.target.checked;v.saveSettings({reducedMotion:h}),this.neuralCore&&this.neuralCore.setReducedMotion(h),this.onActivityLogged(`Reduced motion ${h?"enabled":"disabled"}`),d.info(`3D motion ${h?"paused":"resumed"}.`)}),this.backdrop.querySelector("#settingThemeAccent").addEventListener("change",u=>{const h=u.target.value;v.saveSettings({themeAccent:h}),document.documentElement.setAttribute("data-theme-accent",h),this.neuralCore&&this.neuralCore.setThemeAccent(h),this.onSettingsUpdated({themeAccent:h}),d.info(`Theme accent changed to ${h}.`),this.onActivityLogged(`Applied theme accent: ${h}`)}),this.backdrop.querySelector("#settingQuality").addEventListener("change",u=>{const h=u.target.value;v.saveSettings({quality:h}),this.neuralCore&&this.neuralCore.setQuality(h),this.onSettingsUpdated({quality:h}),d.info(`Rendering quality set to ${h}.`),this.onActivityLogged(`Rendering quality set to: ${h}`)}),this.backdrop.querySelector("#btnExportData").addEventListener("click",()=>{const u=v.exportDataJson(),h=new Blob([u],{type:"application/json"}),m=URL.createObjectURL(h),b=document.createElement("a");b.href=m,b.download=`nova-workspace-${new Date().toISOString().slice(0,10)}.json`,b.click(),URL.revokeObjectURL(m),d.success("Workspace archive downloaded."),this.onActivityLogged("Exported local conversation archive")}),this.backdrop.querySelector("#btnResetData").addEventListener("click",()=>{window.confirm("DANGER: This will permanently wipe all local sessions, preferences, and reset NOVA to factory state. Proceed?")&&(v.clearAllData(),d.warning("All local data cleared. Refreshing workspace."),setTimeout(()=>{window.location.reload()},1200))})}open(){this._populateVoices(),this.isOpen=!0,this.backdrop.classList.add("open")}close(){this.isOpen=!1,this.backdrop.classList.remove("open"),this.onSettingsUpdated(v.loadSettings())}}class X{constructor({sidebarElement:e,onViewChange:t,onOpenSettings:s,onNewChat:i,onActivityLogged:a}){this.sidebar=e,this.onViewChange=t||(()=>{}),this.onOpenSettings=s||(()=>{}),this.onNewChat=i||(()=>{}),this.onActivityLogged=a||(()=>{}),this.activeView="assistant",this.init()}init(){this._renderLayout(),this._bindEvents()}_renderLayout(){this.sidebar.innerHTML=`
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
          <span class="nav-icon">${g.assistant}</span>
        </button>

        <!-- Website Studio Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="studio"
          title="Autonomous Website Studio"
          aria-label="Website Studio"
        >
          <span class="nav-icon">${g.studio}</span>
        </button>

        <!-- Conversation History Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="history"
          title="Conversation Archive"
          aria-label="Conversation Archive"
        >
          <span class="nav-icon">${g.history}</span>
        </button>

        <!-- Real Device Connectors Nav Item (Stage 5) -->
        <button
          type="button"
          class="nav-item"
          data-view="devices"
          title="Real Device Connectors"
          aria-label="Device Connectors"
        >
          <span class="nav-icon">${g.mobile}</span>
        </button>

        <!-- Personal Knowledge & Workflows Nav Item (Stage 6) -->
        <button
          type="button"
          class="nav-item"
          data-view="knowledge"
          title="Personal Knowledge & Workflows"
          aria-label="Knowledge & Workflows"
        >
          <span class="nav-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>
        </button>

        <!-- Settings Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-action="settings"
          title="System Preferences"
          aria-label="System Preferences"
        >
          <span class="nav-icon">${g.settings}</span>
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
          <span class="nav-icon">${g.plus}</span>
        </button>
      </div>
    `}_bindEvents(){const e=this.sidebar.querySelectorAll(".nav-item"),t=this.sidebar.querySelector("#btnSidebarNewChat");e.forEach(s=>{s.addEventListener("click",()=>{const i=s.getAttribute("data-view");if(s.getAttribute("data-action")==="settings"){this.onOpenSettings();return}i&&this.setActiveView(i)})}),t&&t.addEventListener("click",()=>{this.setActiveView("assistant"),this.onNewChat()})}setActiveView(e){if(this.activeView===e&&e!=="history")return;this.activeView=e,this.sidebar.querySelectorAll(".nav-item[data-view]").forEach(s=>{s.getAttribute("data-view")===e?s.classList.add("active"):s.classList.remove("active")}),this.onViewChange(e),this.onActivityLogged(`Navigated: ${e.toUpperCase()} View`)}}class Z{constructor(){this.activeGraphicsCore=null,this.chat=null,this.studio=null,this.historyView=null,this.devicesView=null,this.knowledgeView=null,this.settingsModal=null,this.navigation=null,this.telemetryLogs=[],this.init()}async init(){const e=v.loadSettings();e.themeAccent&&document.documentElement.setAttribute("data-theme-accent",e.themeAccent);const t=(n,o=!1)=>{this._addTelemetryLog(n,o)};t("NOVA Core bootstrap sequence initialized",!0);try{const n=document.getElementById("appSidebar");n&&(this.navigation=new X({sidebarElement:n,onViewChange:o=>this._switchView(o),onOpenSettings:()=>this._openSettings(),onNewChat:()=>{this.chat&&this.chat.createNewChat(),this._renderSessionsPanel()},onActivityLogged:t}))}catch(n){console.error("[NOVA] Navigation initialization failed:",n)}try{const n=document.getElementById("viewAssistant");n&&(this.chat=new W({container:n,neuralCore:null,onActivityLogged:t,onSessionChanged:o=>{this._renderSessionsPanel(),this.historyView&&this.historyView.refresh()}}))}catch(n){console.error("[NOVA] ChatInterface initialization failed:",n)}try{const n=document.getElementById("viewStudio");n&&(this.studio=new j({container:n,onActivityLogged:t}))}catch(n){console.error("[NOVA] WebsiteStudio initialization failed:",n)}try{const n=document.getElementById("viewHistory");n&&(this.historyView=new K({container:n,onSelectSession:o=>{this.navigation&&this.navigation.setActiveView("assistant"),this.chat&&this.chat.switchSession(o),this._renderSessionsPanel()},onNewSession:()=>{this.navigation&&this.navigation.setActiveView("assistant"),this.chat&&this.chat.createNewChat(),this._renderSessionsPanel()},onActivityLogged:t}))}catch(n){console.error("[NOVA] HistoryView initialization failed:",n)}try{const n=document.getElementById("viewDevices");n&&(this.devicesView=new Q({container:n,onActivityLogged:t}))}catch(n){console.error("[NOVA] DevicesView initialization failed:",n)}try{const n=document.getElementById("viewKnowledge");n&&(this.knowledgeView=new J({container:n,onActivityLogged:t}))}catch(n){console.error("[NOVA] KnowledgeView initialization failed:",n)}try{this.settingsModal=new Y({neuralCore:null,onSettingsUpdated:n=>{this.activeGraphicsCore&&(n.reducedMotion!==void 0&&(this.activeGraphicsCore.setReducedMotion(n.reducedMotion),this._updateReduceEffectsButtons(n.reducedMotion)),n.themeAccent!==void 0&&this.activeGraphicsCore.setThemeAccent(n.themeAccent),n.quality!==void 0&&this.activeGraphicsCore.setQuality(n.quality))},onActivityLogged:t})}catch(n){console.error("[NOVA] SettingsModal initialization failed:",n)}this._wireSurroundingPanels(t),this._setupHeaderControls(),this._setupStageInteractivity(),window.addEventListener("hashchange",()=>{const n=window.location.hash.replace("#","");["assistant","studio","history","devices"].includes(n)?this.navigation&&this.navigation.setActiveView(n):n==="settings"&&this._openSettings()});const s=window.location.hash.replace("#","");["assistant","studio","history","devices"].includes(s)?this.navigation&&this.navigation.setActiveView(s):s==="settings"&&this._openSettings();const a=new URLSearchParams(window.location.search).get("prompt");a&&this.chat&&setTimeout(()=>{this.chat.sendMessage(decodeURIComponent(a))},400),await this._loadGraphics(e)}async _loadGraphics(e){const t=document.getElementById("neuralStageContainer");if(t){this._addTelemetryLog("Initializing circular holographic energy reactor...",!0);try{const{NeuralCore:s}=await O(async()=>{const{NeuralCore:i}=await import("./NeuralCore-DuIc7M_2.js");return{NeuralCore:i}},__vite__mapDeps([0,1]));this.activeGraphicsCore=new s(t,{reducedMotion:e.reducedMotion,quality:e.quality||"high",themeAccent:e.themeAccent||"cyan",onFpsUpdate:i=>this._onFpsUpdate(i)}),this.activeGraphicsCore.fallback?(this.activeGraphicsCore=this.activeGraphicsCore.fallback,this._addTelemetryLog("Graphics: 2D vector fallback active (WebGL restricted)",!0)):this._addTelemetryLog("Graphics: WebGL 3D Holographic Reactor online",!0)}catch(s){console.warn("[NOVA] Dynamic 3D graphics loading failed, mounting vector fallback:",s),this._addTelemetryLog("Graphics: Falling back to 2D vector reactor",!0),this.activeGraphicsCore=new B(t,{reducedMotion:e.reducedMotion,themeAccent:e.themeAccent||"cyan",quality:e.quality||"high",onFpsUpdate:i=>this._onFpsUpdate(i)})}this.chat&&(this.chat.neuralCore=this.activeGraphicsCore),this.settingsModal&&(this.settingsModal.neuralCore=this.activeGraphicsCore),this._setupCoreStateSync()}}_wireSurroundingPanels(e){this._renderSessionsPanel();const t=document.getElementById("btnPanelNewSession");t&&t.addEventListener("click",()=>{this.chat&&this.chat.createNewChat(),this._renderSessionsPanel()});const s=document.getElementById("selectVoiceLanguage"),i=document.getElementById("selectVoicePersona"),a=document.getElementById("sliderSpeechRate"),n=document.getElementById("valSpeechRate"),o=document.getElementById("btnTestVoice"),c=document.getElementById("btnPanelStopSpeech");s&&(s.value=w.getLanguage(),s.addEventListener("change",f=>{w.setLanguage(f.target.value),v.saveSettings({voiceLanguage:f.target.value}),d.info(`Spoken language target set to: ${f.target.value.toUpperCase()}`),e(`Spoken language target set to: ${f.target.value.toUpperCase()}`)}));const r=f=>{if(!i||!f||f.length===0)return;const A=v.loadSettings();i.innerHTML='<option value="">NOVA Core (Default)</option>',f.forEach(E=>{const x=document.createElement("option");x.value=E.voiceURI,x.textContent=`${E.name} (${E.lang})`,A.voiceURI===E.voiceURI&&(x.selected=!0),i.appendChild(x)})};r(w.getVoices()),w.onVoicesChanged=r,i&&i.addEventListener("change",f=>{v.saveSettings({voiceURI:f.target.value}),d.info("Voice persona updated."),e("Audio persona changed")}),a&&n&&a.addEventListener("input",f=>{const A=parseFloat(f.target.value).toFixed(2);n.textContent=`${A}x`,v.saveSettings({speechRate:parseFloat(A)})}),o&&o.addEventListener("click",()=>{const f=v.loadSettings();e("Audio test: Synthesizing diagnostic audio beacon..."),w.speak("NOVA holographic acoustic synthesis nominal.",{voiceURI:f.voiceURI,rate:f.speechRate,pitch:f.speechPitch})}),c&&c.addEventListener("click",()=>{w.stopSpeaking(),this.activeGraphicsCore&&this.activeGraphicsCore.setState("idle"),d.info("Voice synthesis stopped."),e("Audio: Voice synthesis stopped by operator")});const l=document.getElementById("btnMatrixSysInfo"),p=document.getElementById("btnMatrixWorkspace"),u=document.getElementById("btnMatrixStudio"),h=document.getElementById("btnMatrixHistory"),m=document.getElementById("btnMatrixSettings"),b=document.getElementById("btnMatrixClearSession");l&&l.addEventListener("click",()=>{const f=document.getElementById("composerTextarea");if(f){f.value="system info";const A=document.getElementById("btnSend");A&&(A.disabled=!1);const E=document.getElementById("composerForm");E&&E.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))}}),p&&p.addEventListener("click",()=>{const f=document.getElementById("composerTextarea");if(f){f.value="search workspace files";const A=document.getElementById("btnSend");A&&(A.disabled=!1);const E=document.getElementById("composerForm");E&&E.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))}}),u&&u.addEventListener("click",()=>{this.navigation&&this.navigation.setActiveView("studio")}),h&&h.addEventListener("click",()=>{this.navigation&&this.navigation.setActiveView("history")}),m&&m.addEventListener("click",()=>{this._openSettings()}),b&&b.addEventListener("click",()=>{this.chat&&this.chat.createNewChat(),this._renderSessionsPanel(),d.info("Session context reset to default."),e("Operational session context reset")})}_renderSessionsPanel(){const e=document.getElementById("panelSessionList"),t=document.getElementById("panelSessionCount");if(!e)return;const s=v.getSessions(),i=v.getActiveSessionId();if(t&&(t.textContent=`${s.length} SESSIONS LOGGED`),e.innerHTML="",s.length===0){e.innerHTML=`
        <div style="font-family: var(--font-mono); font-size: 0.64rem; color: var(--text-dim); text-align: center; padding: 1rem 0;">
          NO ARCHIVED SESSIONS
        </div>
      `;return}s.slice(0,8).forEach(a=>{const n=document.createElement("div");n.className=`session-item ${a.id===i?"active":""}`;const o=new Date(a.updatedAt||a.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),c=(a.messages||[]).length;n.innerHTML=`
        <div class="session-item-main">
          <span class="session-item-title">${this._escapeHtml(a.title)}</span>
          <div class="session-item-meta">
            <span>${c} msgs</span>
            <span>&bull;</span>
            <span>${o}</span>
          </div>
        </div>
      `,n.addEventListener("click",()=>{this.chat&&this.chat.switchSession(a.id),this._renderSessionsPanel()}),e.appendChild(n)})}_addTelemetryLog(e,t=!1){const s=document.getElementById("telemetryLogStream");if(!s)return;const i=new Date,a=i.toTimeString().split(" ")[0]+"."+String(i.getMilliseconds()).padStart(3,"0"),n=document.createElement("div");for(n.className="telemetry-line",n.innerHTML=`
      <span class="telemetry-time">[${a}]</span>
      <span class="telemetry-msg ${t?"highlight":""}">${this._escapeHtml(e)}</span>
    `,s.appendChild(n);s.children.length>40;)s.removeChild(s.firstChild);s.scrollTop=s.scrollHeight}_openSettings(){this.settingsModal&&this.settingsModal.open()}_switchView(e){const t={assistant:document.getElementById("viewAssistant"),studio:document.getElementById("viewStudio"),history:document.getElementById("viewHistory"),devices:document.getElementById("viewDevices"),knowledge:document.getElementById("viewKnowledge")};Object.keys(t).forEach(s=>{t[s]&&(s===e?t[s].classList.add("active"):t[s].classList.remove("active"))}),e==="history"&&this.historyView&&this.historyView.refresh(),e==="devices"&&this.devicesView&&this.devicesView.refresh(),e==="knowledge"&&this.knowledgeView&&this.knowledgeView.refresh(),this._addTelemetryLog(`Navigated view: ${e.toUpperCase()}`)}_setupHeaderControls(){const e=document.getElementById("btnGlobalMute"),t=document.getElementById("iconMute");let s=!1;e&&t&&e.addEventListener("click",()=>{s=!s,w.setMuted(s),s?(e.classList.add("active"),t.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line>',d.info("Voice synthesis muted."),this.activeGraphicsCore&&this.activeGraphicsCore.setState("idle")):(e.classList.remove("active"),t.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',d.info("Voice synthesis active."))});const i=document.getElementById("btnHeaderSettings");i&&i.addEventListener("click",()=>{this._openSettings()});const a=document.getElementById("btnReduceEffects");a&&a.addEventListener("click",()=>{const m=!(this.activeGraphicsCore&&this.activeGraphicsCore.options.reducedMotion);this.activeGraphicsCore&&this.activeGraphicsCore.setReducedMotion(m),v.saveSettings({reducedMotion:m}),this._updateReduceEffectsButtons(m),d.info(m?"3D Motion paused (Reduced motion)":"3D Motion active")});const n=document.getElementById("btnMobileMenu"),o=document.getElementById("appSidebar");n&&o&&n.addEventListener("click",()=>{o.classList.toggle("expanded")});const c=document.getElementById("btnDemoInfo"),r=document.getElementById("demoNoticeModal"),l=document.getElementById("btnCloseDemoModal"),p=document.getElementById("btnDismissDemoModal"),u=document.getElementById("btnToggleOperatingMode"),h=document.getElementById("btnCheckBackendHealth");if(c&&r){const m=()=>{r.classList.add("open"),this._refreshBackendConnectionStatus()},b=()=>r.classList.remove("open");c.addEventListener("click",m),l&&l.addEventListener("click",b),p&&p.addEventListener("click",b),r.addEventListener("click",f=>{f.target===r&&b()}),u&&u.addEventListener("click",()=>{y.setDemoMode(!y.isDemoMode),this._refreshBackendConnectionStatus(),d.info(y.isDemoMode?"Switched to Demo Mode (Local Simulator)":"Switched to Live Backend Mode")}),h&&h.addEventListener("click",async()=>{h.disabled=!0,await this._refreshBackendConnectionStatus(),h.disabled=!1,d.info("Refreshed backend health probe.")})}this._refreshBackendConnectionStatus()}async _refreshBackendConnectionStatus(){const e=document.getElementById("btnDemoInfo"),t=document.getElementById("backendServerStatus"),s=document.getElementById("backendDbStatus"),i=document.getElementById("currentOperatingModeLabel"),a=document.getElementById("btnToggleOperatingMode"),n=document.getElementById("backendSetupNoticeBox"),o=document.getElementById("backendSetupNoticeText"),c=await y.checkBackendStatus();t&&(c.status==="connected"?(t.textContent="Online (Port 3001)",t.style.color="#10b981"):(t.textContent="Offline (Connection Refused)",t.style.color="#ef4444")),s&&(c.ready?(s.textContent=`Connected (${c.database||"nova_db"})`,s.style.color="#10b981"):c.status==="connected"?(s.textContent="Setup Needed (Check backend/.env)",s.style.color="#f59e0b"):(s.textContent="Unavailable (Server Offline)",s.style.color="#64748b")),n&&o&&(!c.ready&&c.setupGuide?(n.style.display="block",o.textContent=`Setup Guidance: ${c.setupGuide}`):n.style.display="none"),i&&(i.textContent=y.isDemoMode?"Demo Mode (Local Simulated AI)":"Live Backend Mode (Node.js/Express + MySQL)",i.style.color=y.isDemoMode?"var(--accent-amber)":"var(--accent-cyan)"),a&&(a.textContent=y.isDemoMode?"Switch to Live Backend":"Switch to Demo Mode"),e&&(y.isDemoMode?(e.innerHTML=`
          <span class="demo-beacon beacon-amber"></span>
          <span class="demo-text-long">Demo mode &bull; AI backend not connected</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">[INFO]</span>
        `,e.title="Running in simulated client demo mode. Click for backend status."):c.ready?(e.innerHTML=`
          <span class="demo-beacon beacon-emerald"></span>
          <span class="demo-text-long">Live Backend &bull; MySQL Connected</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">[LIVE]</span>
        `,e.title=`Connected to ${c.host||"127.0.0.1"}/${c.database||"nova_db"}. Click for details.`):c.status==="connected"?(e.innerHTML=`
          <span class="demo-beacon beacon-amber"></span>
          <span class="demo-text-long">Backend Online &bull; MySQL Setup Needed</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">[SETUP]</span>
        `,e.title="Backend server is running, but MySQL connection is offline. Click for setup guide."):(e.innerHTML=`
          <span class="demo-beacon beacon-crimson"></span>
          <span class="demo-text-long">Backend Offline &bull; Server Disconnected</span>
          <span style="font-size: 0.65rem; opacity: 0.85;">[OFFLINE]</span>
        `,e.title="Backend server is offline on http://localhost:3001. Click for instructions.")),await this._updateAutomationAgentStatus()}async _updateAutomationAgentStatus(){const e=document.getElementById("agentStatusIndicator");if(e)try{const t=await y.getAutomationStatus();t.online?(e.textContent=`AGENT: ONLINE [${(t.platform||"WIN32").toUpperCase()}]`,e.className="panel-status-pill status-online",e.title=`Local Automation Agent connected on ${t.host||"127.0.0.1"}:${t.port||3002}. Workspace: ${t.workspaceRoot||"NOVA/workspace"}`):(e.textContent="AGENT: OFFLINE",e.className="panel-status-pill status-offline",e.title='Local automation agent offline. Run "npm run agent:start" to enable desktop automation.')}catch{e.textContent="AGENT: OFFLINE",e.className="panel-status-pill status-offline"}}_setupStageInteractivity(){const e=document.getElementById("btnRecenterCore"),t=document.getElementById("btnToggleMotion");e&&e.addEventListener("click",()=>{this.activeGraphicsCore&&this.activeGraphicsCore.recenterPerspective(),d.info("Reactor perspective re-centered."),this._addTelemetryLog("Stage: Perspective re-centered")}),t&&t.addEventListener("click",()=>{const s=!(this.activeGraphicsCore&&this.activeGraphicsCore.options.reducedMotion);this.activeGraphicsCore&&this.activeGraphicsCore.setReducedMotion(s),v.saveSettings({reducedMotion:s}),this._updateReduceEffectsButtons(s),d.info(s?"Reactor motion paused":"Reactor motion active"),this._addTelemetryLog(`Stage: Motion ${s?"paused":"resumed"}`)})}_updateReduceEffectsButtons(e){const t=document.getElementById("labelReduceEffects"),s=document.getElementById("motionToggleLabel");t&&(t.textContent=e?"Resume Motion":"Pause Motion"),s&&(s.textContent=e?"Resume":"Pause")}_setupCoreStateSync(){const e=document.getElementById("coreStatusPill"),t=document.getElementById("coreStatusText");if(!e||!t||!this.activeGraphicsCore)return;const s=this.activeGraphicsCore.setState.bind(this.activeGraphicsCore);this.activeGraphicsCore.setState=i=>{switch(s(i),e.setAttribute("data-state",i),i){case"idle":t.textContent="REACTOR STATUS • NOMINAL COHERENCE";break;case"listening":t.textContent="ACOUSTIC SENSORS • CAPTURING SPEECH";break;case"transcribing":t.textContent="WHISPER WORKER • TRANSCRIBING AUDIO";break;case"thinking":t.textContent="NEURAL CORE • EXECUTING REACTION";break;case"acting":t.textContent="STRUCTURED ACTION • EXECUTING TOOL";break;case"speaking":t.textContent="SYNTHESIS • TRANSMITTING WAVEFORM";break}const a=document.getElementById("voiceStatusIndicator");a&&(i==="listening"?(a.textContent="RECORDING",a.style.color="#ef4444"):i==="transcribing"?(a.textContent="TRANSCRIBING",a.style.color="#00f0ff"):i==="speaking"?(a.textContent="SPEAKING",a.style.color="#10b981"):(a.textContent="READY",a.style.color="var(--accent-cyan)"))}}_onFpsUpdate(e){const t=document.getElementById("hudFpsDisplay");t&&(t.textContent=e>=15?`${e} FPS`:"")}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}function R(){try{window.novaApp=new Z}catch(S){console.error("[NOVA] Critical application bootstrap failure:",S);const e=document.getElementById("startupErrorNotice");e&&(e.style.display="block")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R();export{B as F};
//# sourceMappingURL=index-MuulOFez.js.map
