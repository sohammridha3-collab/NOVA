const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NeuralCore-C3lOjReG.js","assets/three-DxUu5Q2B.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const M="modulepreload",T=function(v){return"/"+v},E={},I=function(e,t,i){let n=Promise.resolve();if(t&&t.length>0){let s=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),r=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=s(t.map(c=>{if(c=T(c),c in E)return;E[c]=!0;const u=c.endsWith(".css"),g=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${g}`))return;const l=document.createElement("link");if(l.rel=u?"stylesheet":M,u||(l.as="script"),l.crossOrigin="",l.href=c,r&&l.setAttribute("nonce",r),document.head.appendChild(l),u)return new Promise((d,f)=>{l.addEventListener("load",d),l.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return n.then(s=>{for(const a of s||[])a.status==="rejected"&&o(a.reason);return e().catch(o)})};class R{constructor(e,t={}){this.container=e,this.options=Object.assign({reducedMotion:!1,themeAccent:"cyan",quality:"high",onFpsUpdate:null},t),this.state="idle",this.element=null,this.isPaused=!!this.options.reducedMotion,this.init()}init(){this.container&&(this.container.querySelectorAll(".neural-canvas, .core-fallback-container").forEach(e=>e.remove()),this.element=document.createElement("div"),this.element.className="core-fallback-container holographic-reactor-fallback",this.element.setAttribute("data-state",this.state),this.element.setAttribute("data-accent",this.options.themeAccent),this.isPaused&&this.element.classList.add("paused"),this._renderSvg(),this.container.appendChild(this.element),this.options.onFpsUpdate&&this.options.onFpsUpdate(60))}_renderSvg(){const e=this.options.themeAccent==="amber"?"#f59e0b":this.options.themeAccent==="violet"?"#a855f7":"#00f0ff",t=this.options.themeAccent==="amber"?"#fbbf24":"#38bdf8",i="#ffffff";let n="";const o=200,s=200;for(let a=0;a<72;a++){const r=a*360/72,c=a%6===0,u=a%18===0,g=u?152:c?158:164,l=172,d=r*Math.PI/180,f=(o+g*Math.cos(d)).toFixed(2),y=(s+g*Math.sin(d)).toFixed(2),w=(o+l*Math.cos(d)).toFixed(2),L=(s+l*Math.sin(d)).toFixed(2);n+=`<line x1="${f}" y1="${y}" x2="${w}" y2="${L}" stroke="${u?"#ffffff":e}" stroke-width="${u?"1.5":c?"1.2":"0.75"}" stroke-opacity="${u?"0.85":c?"0.5":"0.22"}" />`}this.element.innerHTML=`
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
          ${n}
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
          <circle cx="200" cy="200" r="5" fill="${i}" filter="drop-shadow(0 0 10px #ffffff)"/>
          <circle cx="200" cy="200" r="1.8" fill="#ffffff"/>
        </g>
      </svg>

      <!-- Accurate, Transparent Fallback Tag -->
      <div class="fallback-reactor-badge">
        <span class="fallback-status-dot"></span>
        <span class="fallback-status-text">FALLBACK ENGINE: 2D VECTOR REACTOR (WebGL restricted/unavailable)</span>
      </div>
    `}setState(e){this.state=e,this.element&&this.element.setAttribute("data-state",e)}setReducedMotion(e){this.isPaused=!!e,this.options.reducedMotion=!!e,this.element&&this.element.classList.toggle("paused",this.isPaused)}recenterPerspective(){this.element&&(this.element.classList.add("pulse-recenter"),setTimeout(()=>{this.element&&this.element.classList.remove("pulse-recenter")},500))}setThemeAccent(e){this.options.themeAccent=e,this.element&&(this.element.setAttribute("data-accent",e),this._renderSvg())}setQuality(e){this.options.quality=e}renderSingleFrame(){}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}}const p={assistant:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="9" stroke-dasharray="4 2"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path></svg>',studio:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',history:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',settings:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',volume:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',sparkles:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>',user:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>',check:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',plus:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>',trash:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',close:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>',info:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',cpu:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>',externalLink:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>',desktop:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>',tablet:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',mobile:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',search:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>',download:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>'};function x(v){return v?v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function k(v){if(!v)return"";const e=[];let t=v.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)```/g,(r,c,u)=>{const g=`__CODE_BLOCK_${e.length}__`;return e.push({lang:c.trim()||"plaintext",code:u.trimEnd()}),g});t=t.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)$/g,(r,c,u)=>{const g=`__CODE_BLOCK_${e.length}__`;return e.push({lang:c.trim()||"plaintext",code:u.trimEnd()}),g}),t=x(t),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g,"$1<em>$2</em>$3"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/(^|\n)&gt; (.*?)(?=\n|$)/g,"$1<blockquote>$2</blockquote>");const i=t.split(`
`),n=[];let o=!1,s=!1;for(let r=0;r<i.length;r++){const c=i[r],u=c.match(/^(\s*)[-*]\s+(.*)$/);if(u){o||(s&&(n.push("</ol>"),s=!1),n.push("<ul>"),o=!0),n.push(`<li>${u[2]}</li>`);continue}const g=c.match(/^(\s*)\d+\.\s+(.*)$/);if(g){s||(o&&(n.push("</ul>"),o=!1),n.push("<ol>"),s=!0),n.push(`<li>${g[2]}</li>`);continue}if(o&&(n.push("</ul>"),o=!1),s&&(n.push("</ol>"),s=!1),!!c.trim()){if(c.includes("__CODE_BLOCK_")){n.push(c);continue}n.push(`<p>${c}</p>`)}}o&&n.push("</ul>"),s&&n.push("</ol>");let a=n.join(`
`);for(let r=0;r<e.length;r++){const c=e[r],u=x(c.code),g=`code_${Date.now()}_${r}`,l=`
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-label">${x(c.lang)}</span>
          <button class="copy-code-btn" data-code-target="${g}" title="Copy code">
            <svg class="copy-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span class="copy-text">Copy</span>
          </button>
        </div>
        <pre><code id="${g}">${u}</code></pre>
      </div>
    `.trim();a=a.replace(`__CODE_BLOCK_${r}__`,l)}return a}const $=[{triggers:["restaurant","dining","food","michelin","menu","aura"],response:`### Neural Formulation: Celestial Gastronomy Architecture

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

All message buffers in NOVA are structured to facilitate drop-in connection to this exact Express/Fastify topology.`}];function _(v){const e=v.toLowerCase();for(const t of $)if(t.triggers.some(i=>e.includes(i)))return t.response;return`### Neural Synthesis: Query Processing Complete

Analyzing query parameters: **"${v.slice(0,60)}${v.length>60?"...":""}"**

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

Ready for next sequence. Ask a technical question, test voice commands, or explore the **Website Studio** preview.`}class D{constructor(){this.isDemoMode=!0,this.backendEndpoint="/api/chat",this.activeStreamAbort=null}sendMessageStream({prompt:e,history:t=[],onStartThinking:i,onChunk:n,onComplete:o,onError:s}){this.activeStreamAbort&&(this.activeStreamAbort(),this.activeStreamAbort=null);let a=!1;return this.activeStreamAbort=()=>{a=!0},this.isDemoMode?((async()=>{try{i&&i();const r=Math.floor(Math.random()*350)+500;if(await new Promise(d=>setTimeout(d,r)),a)return;const u=_(e).split(" ");let g="";for(let d=0;d<u.length;d++){if(a)return;const f=u[d];g+=(d===0?"":" ")+f,n&&n(g,f);let y=22+Math.floor(Math.random()*20);(f.endsWith(".")||f.endsWith(":")||f.includes(`
`))&&(y+=40),await new Promise(w=>setTimeout(w,y))}if(a)return;const l={role:"assistant",content:g,simulated:!0,timestamp:new Date().toISOString()};o&&o(l)}catch(r){!a&&s&&s(r.message||"Simulated streaming error")}finally{this.activeStreamAbort=null}})(),this.activeStreamAbort):(this._streamFromLiveBackend(e,t,i,n,o,s,()=>a),this.activeStreamAbort)}async _streamFromLiveBackend(e,t,i,n,o,s,a){try{i&&i();const r=await fetch(this.backendEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:e,history:t})});if(!r.ok)throw new Error(`HTTP Error: ${r.status}`);if((r.headers.get("content-type")||"").includes("application/json")){const d=await r.json(),f=d.reply||d.content||"";n&&n(f,f),o&&o({role:"assistant",content:f,simulated:!1,timestamp:new Date().toISOString()});return}const u=r.body.getReader(),g=new TextDecoder("utf-8");let l="";for(;;){if(a()){u.cancel();return}const{value:d,done:f}=await u.read();if(f)break;const y=g.decode(d,{stream:!0});l+=y,n&&n(l,y)}o&&o({role:"assistant",content:l,simulated:!1,timestamp:new Date().toISOString()})}catch(r){!a()&&s&&s(r.message)}}}const N=new D;class B{constructor(){this.recognition=null,this.isRecognizing=!1,this.synth=typeof window<"u"?window.speechSynthesis:null,this.currentUtterance=null,this.isMuted=!1,this.voices=[],this.onListeningStateChange=null,this.onSpeakingStateChange=null,this.onTranscript=null,this.onError=null,this.initRecognition(),this.initVoices()}initRecognition(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){this.recognition=null;return}try{this.recognition=new e,this.recognition.continuous=!1,this.recognition.interimResults=!0,this.recognition.lang="en-US",this.recognition.onstart=()=>{this.isRecognizing=!0,this.onListeningStateChange&&this.onListeningStateChange(!0)},this.recognition.onresult=t=>{let i="",n="";for(let a=t.resultIndex;a<t.results.length;++a)t.results[a].isFinal?n+=t.results[a][0].transcript:i+=t.results[a][0].transcript;const o=n||i,s=!!n;this.onTranscript&&this.onTranscript(o,s)},this.recognition.onerror=t=>{console.warn("[Speech] Recognition error:",t.error);let i="Voice recognition error.";switch(t.error){case"not-allowed":case"permission-denied":i="Microphone permission denied. Please allow microphone access in your browser settings.";break;case"no-speech":i="No speech was detected. Tap mic to retry.";break;case"network":i="Speech recognition network error.";break;case"audio-capture":i="No microphone was found on this device.";break;default:i=`Voice recognition error: ${t.error}`}this.onError&&this.onError(i),this.stopListening()},this.recognition.onend=()=>{this.isRecognizing=!1,this.onListeningStateChange&&this.onListeningStateChange(!1)}}catch(t){console.warn("[Speech] Failed to initialize SpeechRecognition:",t),this.recognition=null}}isRecognitionSupported(){return!!this.recognition}startListening(){if(!this.recognition)return this.onError&&this.onError("Voice input is not supported in this browser. Please use keyboard input."),!1;this.stopSpeaking();try{return this.recognition.start(),!0}catch(e){return e.name==="InvalidStateError"?this.recognition.stop():this.onError&&this.onError("Unable to start speech recognition."),!1}}stopListening(){if(this.recognition&&this.isRecognizing)try{this.recognition.stop()}catch{}this.isRecognizing=!1,this.onListeningStateChange&&this.onListeningStateChange(!1)}initVoices(){if(!this.synth)return;const e=()=>{this.voices=this.synth.getVoices()};e(),this.synth.onvoiceschanged!==void 0&&(this.synth.onvoiceschanged=e)}getVoices(){return this.synth?(this.voices.length===0&&(this.voices=this.synth.getVoices()),this.voices):[]}setMuted(e){this.isMuted=e,this.isMuted&&this.stopSpeaking()}cleanTextForSpeech(e){if(!e)return"";let t=e.replace(/```[\s\S]*?```/g," [Code omitted for audio] ");return t=t.replace(/`([^`]+)`/g,"$1"),t=t.replace(/\*\*([^*]+)\*\*/g,"$1"),t=t.replace(/\*([^*]+)\*/g,"$1"),t=t.replace(/\[([^\]]+)\]\([^\)]+\)/g,"$1"),t=t.replace(/<[^>]+>/g,""),t.replace(/\s+/g," ").trim()}speak(e,{voiceURI:t,rate:i=1,pitch:n=1}={}){if(!this.synth||this.isMuted)return this.onSpeakingStateChange&&this.onSpeakingStateChange(!1),!1;this.stopSpeaking();const o=this.cleanTextForSpeech(e);if(!o)return this.onSpeakingStateChange&&this.onSpeakingStateChange(!1),!1;try{const s=new SpeechSynthesisUtterance(o);if(s.rate=Math.max(.5,Math.min(2,i)),s.pitch=Math.max(.5,Math.min(1.8,n)),t){const a=this.getVoices().find(r=>r.voiceURI===t);a&&(s.voice=a)}return s.onstart=()=>{this.onSpeakingStateChange&&this.onSpeakingStateChange(!0)},s.onend=()=>{this.currentUtterance=null,this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)},s.onerror=a=>{a.error!=="interrupted"&&a.error!=="canceled"&&console.warn("[Speech] Synthesis error:",a),this.currentUtterance=null,this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)},this.currentUtterance=s,this.synth.speak(s),!0}catch(s){return console.warn("[Speech] Could not speak text:",s),this.onSpeakingStateChange&&this.onSpeakingStateChange(!1),!1}}stopSpeaking(){if(this.synth)try{this.synth.cancel()}catch{}this.currentUtterance=null,this.onSpeakingStateChange&&this.onSpeakingStateChange(!1)}isSpeaking(){return!!(this.synth&&this.synth.speaking)}}const b=new B,S={SESSIONS:"nova_conversations_v1",ACTIVE_SESSION:"nova_active_session_id_v1",SETTINGS:"nova_settings_v1",TELEMETRY:"nova_telemetry_v1"},C={ttsEnabled:!0,voiceURI:"",speechRate:1,speechPitch:1,quality:"high",reducedMotion:!1,particleDensity:"high",themeAccent:"cyan",showHud:!0};class O{constructor(){this.settings=this.loadSettings()}loadSettings(){try{const e=localStorage.getItem(S.SETTINGS);if(e)return{...C,...JSON.parse(e)}}catch(e){console.warn("[Storage] Failed to read settings, using defaults:",e)}return{...C}}saveSettings(e){this.settings={...this.settings,...e};try{localStorage.setItem(S.SETTINGS,JSON.stringify(this.settings))}catch(t){console.error("[Storage] Error saving settings:",t)}return this.settings}getSessions(){try{const e=localStorage.getItem(S.SESSIONS);if(e){const t=JSON.parse(e);return Array.isArray(t)?t:[]}}catch(e){console.warn("[Storage] Failed to load sessions:",e)}return[]}saveSessions(e){try{localStorage.setItem(S.SESSIONS,JSON.stringify(e))}catch(t){console.error("[Storage] Error saving sessions:",t)}}getActiveSessionId(){try{return localStorage.getItem(S.ACTIVE_SESSION)||null}catch{return null}}setActiveSessionId(e){try{localStorage.setItem(S.ACTIVE_SESSION,e)}catch(t){console.warn("[Storage] Error saving active session id:",t)}}createSession(e="New Neural Session"){const t=this.getSessions(),i={id:`session_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,title:e,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),messages:[]};return t.unshift(i),this.saveSessions(t),this.setActiveSessionId(i.id),i}getSession(e){return this.getSessions().find(i=>i.id===e)||null}updateSessionMessages(e,t){const i=this.getSessions(),n=i.findIndex(o=>o.id===e);if(n!==-1){if(i[n].messages=t,i[n].updatedAt=new Date().toISOString(),i[n].title==="New Neural Session"&&t.length>0){const o=t.find(s=>s.role==="user");if(o){const s=o.content.trim().slice(0,36);i[n].title=s+(o.content.length>36?"...":"")}}this.saveSessions(i)}}deleteSession(e){let t=this.getSessions();if(t=t.filter(i=>i.id!==e),this.saveSessions(t),this.getActiveSessionId()===e){const i=t.length>0?t[0].id:null;i?this.setActiveSessionId(i):localStorage.removeItem(S.ACTIVE_SESSION)}return t}clearAllData(){try{localStorage.removeItem(S.SESSIONS),localStorage.removeItem(S.ACTIVE_SESSION),localStorage.removeItem(S.SETTINGS),localStorage.removeItem(S.TELEMETRY),this.settings={...C}}catch(e){console.error("[Storage] Error clearing storage:",e)}}exportDataJson(){const e={exportedAt:new Date().toISOString(),app:"NOVA AI Workspace",settings:this.settings,sessions:this.getSessions()};return JSON.stringify(e,null,2)}}const h=new O;class V{constructor(){this.container=null,this.init()}init(){this.container=document.createElement("div"),this.container.className="toast-container",this.container.setAttribute("aria-live","polite"),document.body.appendChild(this.container)}show(e,t="info",i=3800){if(!this.container)return;const n=document.createElement("div");n.className=`toast toast-${t}`,n.setAttribute("role","alert");let o=p.info;t==="success"&&(o=p.check),t==="error"&&(o=p.close),t==="warning"&&(o=p.info),n.innerHTML=`
      <div class="toast-content">
        <span class="toast-icon">${o}</span>
        <span class="toast-message">${e}</span>
      </div>
      <button class="toast-close-btn" aria-label="Close notification">
        ${p.close}
      </button>
    `;const s=n.querySelector(".toast-close-btn"),a=()=>{n.classList.add("toast-fade-out"),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},250)};s.addEventListener("click",a),this.container.appendChild(n),i>0&&setTimeout(a,i)}success(e){this.show(e,"success")}error(e){this.show(e,"error",5e3)}warning(e){this.show(e,"warning",4500)}info(e){this.show(e,"info")}}const m=new V;class P{constructor({container:e,neuralCore:t,onActivityLogged:i,onSessionChanged:n}){this.container=e,this.neuralCore=t,this.onActivityLogged=i||(()=>{}),this.onSessionChanged=n||(()=>{}),this.activeSessionId=null,this.messages=[],this.isStreaming=!1,this.scrollArea=null,this.textarea=null,this.btnSend=null,this.btnMic=null,this.btnStopSpeech=null,this.previewText=null,this.previewTimestamp=null,this.conversationDrawer=null,this.btnExpandDrawer=null,this.btnCloseDrawer=null,this.btnDrawerExport=null,this.drawerMsgCount=null,this.init()}init(){this._bindDomElements(),this._bindEvents(),this._setupSpeechHooks(),this.loadActiveSession()}_bindDomElements(){this.scrollArea=document.getElementById("chatScrollArea"),this.textarea=document.getElementById("composerTextarea"),this.btnSend=document.getElementById("btnSend"),this.btnMic=document.getElementById("btnMic"),this.btnStopSpeech=document.getElementById("btnStopSpeech"),this.previewText=document.getElementById("previewText"),this.previewTimestamp=document.getElementById("previewTimestamp"),this.conversationDrawer=document.getElementById("conversationDrawer"),this.btnExpandDrawer=document.getElementById("btnExpandDrawer"),this.btnCloseDrawer=document.getElementById("btnCloseDrawer"),this.btnDrawerExport=document.getElementById("btnDrawerExport"),this.drawerMsgCount=document.getElementById("drawerMsgCount")}_bindEvents(){const e=document.getElementById("composerForm");this.btnExpandDrawer&&this.conversationDrawer&&this.btnExpandDrawer.addEventListener("click",()=>{this.openDrawer()}),this.btnCloseDrawer&&this.conversationDrawer&&this.btnCloseDrawer.addEventListener("click",()=>{this.closeDrawer()}),this.btnDrawerExport&&this.btnDrawerExport.addEventListener("click",()=>{this.exportConversation()}),this.textarea&&this.btnSend&&(this.textarea.addEventListener("input",()=>{this.textarea.style.height="auto";const t=Math.min(this.textarea.scrollHeight,100);this.textarea.style.height=`${t}px`,this.btnSend.disabled=!this.textarea.value.trim()||this.isStreaming}),this.textarea.addEventListener("keydown",t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),this.btnSend.disabled||e.dispatchEvent(new Event("submit",{cancelable:!0})))})),e&&e.addEventListener("submit",t=>{t.preventDefault();const i=this.textarea.value.trim();!i||this.isStreaming||(this.textarea.value="",this.textarea.style.height="auto",this.btnSend.disabled=!0,this.sendMessage(i))}),this.btnMic&&this.btnMic.addEventListener("click",()=>{b.isRecognizing?b.stopListening():b.startListening()&&m.info("Acoustic sensor active. Transmitting speech to command processor...")}),this.btnStopSpeech&&this.btnStopSpeech.addEventListener("click",()=>{b.stopSpeaking(),this.btnStopSpeech.classList.remove("active"),this.neuralCore&&this.neuralCore.setState("idle"),m.info("Voice synthesis halted.")}),this.scrollArea&&this.scrollArea.addEventListener("click",t=>{const i=t.target.closest(".copy-code-btn");if(i){const o=i.getAttribute("data-code-target"),s=document.getElementById(o);s&&navigator.clipboard.writeText(s.textContent).then(()=>{const a=i.querySelector(".copy-text");a&&(a.textContent="Copied!"),m.success("Code copied to clipboard."),setTimeout(()=>{a&&(a.textContent="Copy")},2e3)}).catch(()=>{m.error("Failed to copy code.")});return}const n=t.target.closest(".btn-speak-msg");if(n){const o=n.getAttribute("data-text");if(o){const s=h.loadSettings();b.speak(o,{voiceURI:s.voiceURI,rate:s.speechRate,pitch:s.speechPitch})}return}})}_setupSpeechHooks(){b.onListeningStateChange=e=>{e?(this.btnMic&&this.btnMic.classList.add("listening"),this.neuralCore&&this.neuralCore.setState("listening"),this.onActivityLogged("Acoustic sensor active: Listening for speech input...")):(this.btnMic&&this.btnMic.classList.remove("listening"),this.neuralCore&&this.neuralCore.state==="listening"&&this.neuralCore.setState("idle"))},b.onTranscript=(e,t)=>{this.textarea&&(this.textarea.value=e,this.textarea.style.height="auto",this.textarea.style.height=`${Math.min(this.textarea.scrollHeight,100)}px`,this.btnSend&&(this.btnSend.disabled=!this.textarea.value.trim())),t&&this.onActivityLogged(`Transcript decoded: "${e.slice(0,30)}..."`)},b.onSpeakingStateChange=e=>{e?(this.btnStopSpeech&&this.btnStopSpeech.classList.add("active"),this.neuralCore&&this.neuralCore.setState("speaking"),this.onActivityLogged("Voice synthesis: Transmitting audio output...")):(this.btnStopSpeech&&this.btnStopSpeech.classList.remove("active"),this.neuralCore&&this.neuralCore.state==="speaking"&&this.neuralCore.setState("idle"))},b.onError=e=>{m.warning(e),this.onActivityLogged(`Acoustic event: ${e}`)}}openDrawer(){this.conversationDrawer&&(this.conversationDrawer.classList.add("open"),this.conversationDrawer.setAttribute("aria-hidden","false"),this._scrollToBottom())}closeDrawer(){this.conversationDrawer&&(this.conversationDrawer.classList.remove("open"),this.conversationDrawer.setAttribute("aria-hidden","true"))}loadActiveSession(){let e=h.getActiveSessionId(),t=e?h.getSession(e):null;t||(t=h.createSession("Neural Session Alpha")),this.activeSessionId=t.id,this.messages=t.messages||[],this.renderMessages(),this.onSessionChanged(t),this._updatePreviewFromMessages()}switchSession(e){const t=h.getSession(e);t&&(h.setActiveSessionId(e),this.activeSessionId=t.id,this.messages=t.messages||[],this.renderMessages(),this.onSessionChanged(t),this._updatePreviewFromMessages(),this.onActivityLogged(`Operational context shifted to: "${t.title}"`))}createNewChat(){const e=h.createSession("New Command Stream");this.activeSessionId=e.id,this.messages=[],this.renderMessages(),this.onSessionChanged(e),this._updatePreviewFromMessages(),this.onActivityLogged("Initialized fresh session stream"),m.success("Started a fresh conversation session."),this.textarea&&this.textarea.focus()}renderMessages(){this.scrollArea&&(this.messages.length===0?this._renderWelcomeScreen():(this.scrollArea.innerHTML="",this.messages.forEach(e=>{const t=this._createMessageRowElement(e);this.scrollArea.appendChild(t)}),this._scrollToBottom()),this.drawerMsgCount&&(this.drawerMsgCount.textContent=`${this.messages.length} MESSAGES`))}_renderWelcomeScreen(){this.scrollArea.innerHTML=`
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.5rem; letter-spacing: 0.08em;">
          // CONVERSATION STREAM INITIALIZED //
        </div>
        <p style="font-size: 0.88rem; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          No previous transmissions logged in this session. Dispatch a command from the central composer to begin technical architecture synthesis.
        </p>
      </div>
    `}_createMessageRowElement(e){const t=document.createElement("div");t.className=`message-row ${e.role}`;const i=new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),n=e.role==="assistant",o=n?`<div class="message-avatar" aria-label="NOVA">${p.assistant}</div>`:`<div class="message-avatar" aria-label="User">${p.user}</div>`,s=n?`
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
      `,a=n?k(e.content):`<p>${this._escapeHtml(e.content)}</p>`,r=n?`
        <div class="message-actions-toolbar">
          <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(e.content)}" title="Read message aloud">
            ${p.volume}
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
    `,t}_updatePreviewFromMessages(){if(!this.previewText)return;if(this.messages.length===0){this.previewText.textContent="NOVA circular holographic reactor online. Initialize technical architecture, synthesize models, or transmit instructions below.",this.previewTimestamp&&(this.previewTimestamp.textContent="Nominal");return}const e=this.messages[this.messages.length-1],t=e.content.replace(/```[\s\S]*?```/g,"[Code Snippet]").replace(/#+\s/g,"").trim();if(this.previewText.textContent=t.slice(0,160)+(t.length>160?"...":""),this.previewTimestamp){const i=new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});this.previewTimestamp.textContent=i}}sendMessage(e){if(!e.trim()||this.isStreaming)return;this.messages.length===0&&this.scrollArea&&(this.scrollArea.innerHTML="");const t={role:"user",content:e,timestamp:new Date().toISOString()};if(this.messages.push(t),h.updateSessionMessages(this.activeSessionId,this.messages),this.scrollArea){const o=this._createMessageRowElement(t);this.scrollArea.appendChild(o),this._scrollToBottom()}this.drawerMsgCount&&(this.drawerMsgCount.textContent=`${this.messages.length} MESSAGES`),this.onActivityLogged(`Command dispatched: "${e.slice(0,32)}..."`),this.isStreaming=!0,this.btnSend&&(this.btnSend.disabled=!0),this.previewText&&(this.previewText.textContent="Synthesizing response through holographic reactor core..."),this.previewTimestamp&&(this.previewTimestamp.textContent="Calculating");let i=null,n=null;if(this.scrollArea){i=document.createElement("div"),i.className="message-row assistant";const o=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});i.innerHTML=`
        <div class="message-avatar" aria-label="NOVA">${p.assistant}</div>
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
      `,this.scrollArea.appendChild(i),this._scrollToBottom(),n=i.querySelector(".message-bubble")}N.sendMessageStream({prompt:e,history:this.messages,onStartThinking:()=>{this.neuralCore&&this.neuralCore.setState("thinking"),this.onActivityLogged("Reactor state: THINKING (Ring velocities accelerating)")},onChunk:o=>{if(n&&(n.innerHTML=k(o),this._scrollToBottom()),this.previewText){const s=o.replace(/```[\s\S]*?```/g,"[Code Snippet]").replace(/#+\s/g,"").trim();this.previewText.textContent=s.slice(0,160)+(s.length>160?"...":"")}},onComplete:o=>{if(this.isStreaming=!1,this.btnSend&&this.textarea&&(this.btnSend.disabled=!this.textarea.value.trim()),n&&(n.innerHTML=k(o.content)),i){const a=i.querySelector(".message-bubble-wrap"),r=document.createElement("div");r.className="message-actions-toolbar",r.innerHTML=`
            <button class="action-mini-btn btn-speak-msg" data-text="${this._escapeHtml(o.content)}" title="Read message aloud">
              ${p.volume}
              <span>Listen</span>
            </button>
          `,a.appendChild(r)}this.messages.push(o),h.updateSessionMessages(this.activeSessionId,this.messages),this.onSessionChanged(h.getSession(this.activeSessionId)),this._updatePreviewFromMessages(),this.onActivityLogged("Transmission complete: Response synthesized"),this.drawerMsgCount&&(this.drawerMsgCount.textContent=`${this.messages.length} MESSAGES`);const s=h.loadSettings();s.ttsEnabled&&!b.isMuted?!b.speak(o.content,{voiceURI:s.voiceURI,rate:s.speechRate,pitch:s.speechPitch})&&this.neuralCore&&this.neuralCore.setState("idle"):this.neuralCore&&this.neuralCore.setState("idle")},onError:o=>{this.isStreaming=!1,this.btnSend&&this.textarea&&(this.btnSend.disabled=!this.textarea.value.trim()),n&&(n.innerHTML=`<p style="color: var(--status-error);">Error processing response: ${this._escapeHtml(o)}</p>`),this.neuralCore&&this.neuralCore.setState("idle"),m.error("Simulation streaming failed.")}})}exportConversation(){if(this.messages.length===0){m.info("No messages to export in current session.");return}const e=h.getSession(this.activeSessionId),t=e?e.title:"NOVA_Transmission",i=JSON.stringify(this.messages,null,2),n=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(n),s=document.createElement("a");s.href=o,s.download=`${t.replace(/\s+/g,"_").toLowerCase()}_${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(o),m.success("Conversation exported to JSON."),this.onActivityLogged(`Exported session: "${t}"`)}_scrollToBottom(){requestAnimationFrame(()=>{this.scrollArea&&(this.scrollArea.scrollTop=this.scrollArea.scrollHeight)})}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}function H(){return`<!DOCTYPE html>
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
</html>`}class q{constructor({container:e,onActivityLogged:t}){this.container=e,this.onActivityLogged=t||(()=>{}),this.currentDevice="desktop",this.sampleHtml=H(),this.init()}init(){this._renderLayout(),this._bindEvents(),this.loadSample()}_renderLayout(){this.container.innerHTML=`
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
                ${p.desktop}
                <span>Desktop</span>
              </button>
              <button class="device-btn" data-device="tablet" title="Tablet view (768px)">
                ${p.tablet}
                <span>Tablet</span>
              </button>
              <button class="device-btn" data-device="mobile" title="Mobile view (390px)">
                ${p.mobile}
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <!-- Description Prompt Input & Primary Preview Button -->
          <div class="studio-prompt-bar">
            <div class="studio-input-wrap">
              ${p.sparkles}
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
              ${p.studio}
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
            ${p.info}
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
                  ${p.refresh}
                </button>
                <button class="browser-btn" id="btnOpenNewTab" title="Open sample in new tab" aria-label="Open in new window">
                  ${p.externalLink}
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
    `}_bindEvents(){const e=this.container.querySelector("#studioPromptInput"),t=this.container.querySelector("#btnPreviewSample");this.container.querySelector("#studioIframe");const i=this.container.querySelector("#browserMockFrame"),n=this.container.querySelector("#btnReloadSample"),o=this.container.querySelector("#btnOpenNewTab"),s=this.container.querySelectorAll(".device-btn");s.forEach(r=>{r.addEventListener("click",()=>{s.forEach(u=>u.classList.remove("active")),r.classList.add("active");const c=r.getAttribute("data-device");this.currentDevice=c,i.setAttribute("data-device",c),this.onActivityLogged(`Website Studio viewport switched: ${c.toUpperCase()}`)})}),t.addEventListener("click",()=>{this.loadSample(),m.success("Loaded AURA Gastronomy sample showcase."),this.onActivityLogged("Website Studio: Rendered bundled restaurant sample")}),this.container.querySelectorAll(".studio-chip").forEach(r=>{r.addEventListener("click",()=>{const c=r.getAttribute("data-sample");c==="aura"?(e.value="Design a 3-Michelin-star luxury tasting restaurant website with reservations and celestial branding",this.loadSample(),m.info("Viewing bundled AURA Gastronomy showcase.")):c==="cyberpunk"?(e.value="Create a dystopian cyberpunk streetwear storefront with 3D product previews and neon glitch typography",m.info("Concept prompt applied. In production, this invokes live LLM code synthesis.")):c==="nexus"&&(e.value="Architect a developer-first quantum cloud computing platform with live latency telemetry",m.info("Concept prompt applied. In production, this invokes live LLM code synthesis."))})}),n.addEventListener("click",()=>{this.loadSample(),m.info("Sample frame refreshed.")}),o.addEventListener("click",()=>{const r=new Blob([this.sampleHtml],{type:"text/html"}),c=URL.createObjectURL(r);window.open(c,"_blank"),this.onActivityLogged("Opened sample website in new browser tab")})}loadSample(){const e=this.container.querySelector("#studioIframe");e&&(e.srcdoc=this.sampleHtml)}}class G{constructor({container:e,onSelectSession:t,onNewSession:i,onActivityLogged:n}){this.container=e,this.onSelectSession=t||(()=>{}),this.onNewSession=i||(()=>{}),this.onActivityLogged=n||(()=>{}),this.searchQuery="",this.init()}init(){this._renderLayout(),this._bindEvents(),this.refresh()}_renderLayout(){this.container.innerHTML=`
      <div class="modal-dialog" style="max-width: 620px; width: 100%; margin: 1.5rem auto; height: calc(100% - 3rem);">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${p.history}
            <span class="modal-title">Conversation Archive</span>
          </div>

          <button class="btn-primary" id="btnHistoryNewChat">
            ${p.plus}
            <span>New Chat</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Search Bar -->
          <div class="history-search-bar">
            ${p.search}
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
            ${p.trash}
            <span>Clear All History</span>
          </button>
        </div>
      </div>
    `}_bindEvents(){const e=this.container.querySelector("#historySearchInput"),t=this.container.querySelector("#btnHistoryNewChat"),i=this.container.querySelector("#btnClearAllHistory"),n=this.container.querySelector("#historyListContainer");e.addEventListener("input",o=>{this.searchQuery=o.target.value.toLowerCase().trim(),this.renderList()}),t.addEventListener("click",()=>{this.onNewSession()}),i.addEventListener("click",()=>{window.confirm("Are you sure you want to permanently clear all stored conversations? This cannot be undone.")&&(h.saveSessions([]),h.setActiveSessionId(null),this.onNewSession(),this.refresh(),this.onActivityLogged("Cleared all conversation history"),m.warning("All conversation records deleted."))}),n.addEventListener("click",o=>{const s=o.target.closest(".btn-delete-session");if(s){o.stopPropagation();const r=s.getAttribute("data-session-id");r&&(h.deleteSession(r),this.refresh(),this.onActivityLogged(`Deleted conversation: ${r}`),m.info("Conversation removed."));return}const a=o.target.closest(".history-item");if(a){const r=a.getAttribute("data-session-id");r&&this.onSelectSession(r)}})}refresh(){this.renderList()}renderList(){const e=this.container.querySelector("#historyListContainer"),t=this.container.querySelector("#historyTotalCount");if(!e)return;let i=h.getSessions();const n=h.getActiveSessionId();if(t&&(t.textContent=`${i.length} conversation${i.length===1?"":"s"} stored in browser`),this.searchQuery&&(i=i.filter(o=>{const s=o.title&&o.title.toLowerCase().includes(this.searchQuery),a=o.messages&&o.messages.some(r=>r.content&&r.content.toLowerCase().includes(this.searchQuery));return s||a})),i.length===0){e.innerHTML=`
        <div class="history-empty-text">
          <p>No conversations found.</p>
          <span style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.4rem; display: block;">
            Start asking NOVA questions to build your archive.
          </span>
        </div>
      `;return}e.innerHTML="",i.forEach(o=>{const s=new Date(o.updatedAt||o.createdAt).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),a=(o.messages||[]).length,r=o.id===n,c=document.createElement("div");c.className=`history-item ${r?"active":""}`,c.setAttribute("data-session-id",o.id),c.setAttribute("role","button"),c.setAttribute("tabindex","0"),c.innerHTML=`
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
            ${p.trash}
          </button>
        </div>
      `,e.appendChild(c)})}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}class U{constructor({neuralCore:e,onSettingsUpdated:t,onActivityLogged:i}){this.neuralCore=e,this.onSettingsUpdated=t||(()=>{}),this.onActivityLogged=i||(()=>{}),this.backdrop=null,this.isOpen=!1,this.init()}init(){this.backdrop=document.createElement("div"),this.backdrop.className="modal-backdrop",this.backdrop.setAttribute("role","dialog"),this.backdrop.setAttribute("aria-modal","true"),this.backdrop.setAttribute("aria-label","System Settings"),this._render(),document.body.appendChild(this.backdrop),this._bindEvents()}_render(){const e=h.loadSettings();this.backdrop.innerHTML=`
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${p.settings}
            <span class="modal-title">System Settings</span>
          </div>
          <button class="icon-btn btn-modal-close" aria-label="Close settings">
            ${p.close}
          </button>
        </div>

        <div class="modal-body">
          <!-- Voice & Audio Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${p.volume}
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
                ${p.volume}
                <span style="margin-left: 0.35rem;">Test Voice Output</span>
              </button>
            </div>
          </div>

          <!-- Graphics & Animation Section -->
          <div class="settings-section">
            <div class="settings-section-title">
              ${p.cpu}
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
              ${p.history}
              <span>Data & Privacy</span>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Export Archive</span>
                <span class="setting-desc">Download all local conversations and preferences as JSON</span>
              </div>
              <button type="button" class="btn-secondary" id="btnExportData">
                ${p.download}
                <span style="margin-left: 0.35rem;">Export JSON</span>
              </button>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Reset Local Data</span>
                <span class="setting-desc">Permanently wipe conversation records and restore defaults</span>
              </div>
              <button type="button" class="btn-danger" id="btnResetData">
                ${p.trash}
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
    `,this._populateVoices()}_populateVoices(){const e=this.backdrop.querySelector("#settingVoiceSelect");if(!e)return;const t=b.getVoices(),i=h.loadSettings().voiceURI;e.innerHTML='<option value="">Default System Voice</option>',t.forEach(n=>{const o=document.createElement("option");o.value=n.voiceURI,o.textContent=`${n.name} (${n.lang})`,n.voiceURI===i&&(o.selected=!0),e.appendChild(o)})}_bindEvents(){this.backdrop.querySelectorAll(".btn-modal-close").forEach(l=>l.addEventListener("click",()=>this.close())),this.backdrop.addEventListener("click",l=>{l.target===this.backdrop&&this.close()}),window.addEventListener("keydown",l=>{l.key==="Escape"&&this.isOpen&&this.close()}),this.backdrop.querySelector("#settingTtsToggle").addEventListener("change",l=>{h.saveSettings({ttsEnabled:l.target.checked}),this.onActivityLogged(`Voice output ${l.target.checked?"enabled":"disabled"}`)}),this.backdrop.querySelector("#settingVoiceSelect").addEventListener("change",l=>{h.saveSettings({voiceURI:l.target.value}),this.onActivityLogged("Voice persona updated")});const n=this.backdrop.querySelector("#settingSpeechRate"),o=this.backdrop.querySelector("#valSpeechRate");n.addEventListener("input",l=>{const d=parseFloat(l.target.value);o.textContent=`${d.toFixed(2)}x`,h.saveSettings({speechRate:d})}),this.backdrop.querySelector("#btnTestVoice").addEventListener("click",()=>{const l=h.loadSettings();b.speak("NOVA neural audio engine operational. All acoustic parameters calibrated.",{voiceURI:l.voiceURI,rate:l.speechRate})}),this.backdrop.querySelector("#settingReducedMotion").addEventListener("change",l=>{const d=l.target.checked;h.saveSettings({reducedMotion:d}),this.neuralCore&&this.neuralCore.setReducedMotion(d),this.onActivityLogged(`Reduced motion ${d?"enabled":"disabled"}`),m.info(`3D motion ${d?"paused":"resumed"}.`)}),this.backdrop.querySelector("#settingThemeAccent").addEventListener("change",l=>{const d=l.target.value;h.saveSettings({themeAccent:d}),document.documentElement.setAttribute("data-theme-accent",d),this.neuralCore&&this.neuralCore.setThemeAccent(d),this.onSettingsUpdated({themeAccent:d}),m.info(`Theme accent changed to ${d}.`),this.onActivityLogged(`Applied theme accent: ${d}`)}),this.backdrop.querySelector("#settingQuality").addEventListener("change",l=>{const d=l.target.value;h.saveSettings({quality:d}),this.neuralCore&&this.neuralCore.setQuality(d),this.onSettingsUpdated({quality:d}),m.info(`Rendering quality set to ${d}.`),this.onActivityLogged(`Rendering quality set to: ${d}`)}),this.backdrop.querySelector("#btnExportData").addEventListener("click",()=>{const l=h.exportDataJson(),d=new Blob([l],{type:"application/json"}),f=URL.createObjectURL(d),y=document.createElement("a");y.href=f,y.download=`nova-workspace-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(f),m.success("Workspace archive downloaded."),this.onActivityLogged("Exported local conversation archive")}),this.backdrop.querySelector("#btnResetData").addEventListener("click",()=>{window.confirm("DANGER: This will permanently wipe all local sessions, preferences, and reset NOVA to factory state. Proceed?")&&(h.clearAllData(),m.warning("All local data cleared. Refreshing workspace."),setTimeout(()=>{window.location.reload()},1200))})}open(){this._populateVoices(),this.isOpen=!0,this.backdrop.classList.add("open")}close(){this.isOpen=!1,this.backdrop.classList.remove("open"),this.onSettingsUpdated(h.loadSettings())}}class z{constructor({sidebarElement:e,onViewChange:t,onOpenSettings:i,onNewChat:n,onActivityLogged:o}){this.sidebar=e,this.onViewChange=t||(()=>{}),this.onOpenSettings=i||(()=>{}),this.onNewChat=n||(()=>{}),this.onActivityLogged=o||(()=>{}),this.activeView="assistant",this.init()}init(){this._renderLayout(),this._bindEvents()}_renderLayout(){this.sidebar.innerHTML=`
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
          <span class="nav-icon">${p.assistant}</span>
        </button>

        <!-- Website Studio Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="studio"
          title="Autonomous Website Studio"
          aria-label="Website Studio"
        >
          <span class="nav-icon">${p.studio}</span>
        </button>

        <!-- Conversation History Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="history"
          title="Conversation Archive"
          aria-label="Conversation Archive"
        >
          <span class="nav-icon">${p.history}</span>
        </button>

        <!-- Settings Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-action="settings"
          title="System Preferences"
          aria-label="System Preferences"
        >
          <span class="nav-icon">${p.settings}</span>
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
          <span class="nav-icon">${p.plus}</span>
        </button>
      </div>
    `}_bindEvents(){const e=this.sidebar.querySelectorAll(".nav-item"),t=this.sidebar.querySelector("#btnSidebarNewChat");e.forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-view");if(i.getAttribute("data-action")==="settings"){this.onOpenSettings();return}n&&this.setActiveView(n)})}),t&&t.addEventListener("click",()=>{this.setActiveView("assistant"),this.onNewChat()})}setActiveView(e){if(this.activeView===e&&e!=="history")return;this.activeView=e,this.sidebar.querySelectorAll(".nav-item[data-view]").forEach(i=>{i.getAttribute("data-view")===e?i.classList.add("active"):i.classList.remove("active")}),this.onViewChange(e),this.onActivityLogged(`Navigated: ${e.toUpperCase()} View`)}}class F{constructor(){this.activeGraphicsCore=null,this.chat=null,this.studio=null,this.historyView=null,this.settingsModal=null,this.navigation=null,this.telemetryLogs=[],this.init()}async init(){const e=h.loadSettings();e.themeAccent&&document.documentElement.setAttribute("data-theme-accent",e.themeAccent);const t=(s,a=!1)=>{this._addTelemetryLog(s,a)};t("NOVA Core bootstrap sequence initialized",!0);try{const s=document.getElementById("appSidebar");s&&(this.navigation=new z({sidebarElement:s,onViewChange:a=>this._switchView(a),onOpenSettings:()=>this._openSettings(),onNewChat:()=>{this.chat&&this.chat.createNewChat(),this._renderSessionsPanel()},onActivityLogged:t}))}catch(s){console.error("[NOVA] Navigation initialization failed:",s)}try{const s=document.getElementById("viewAssistant");s&&(this.chat=new P({container:s,neuralCore:null,onActivityLogged:t,onSessionChanged:a=>{this._renderSessionsPanel(),this.historyView&&this.historyView.refresh()}}))}catch(s){console.error("[NOVA] ChatInterface initialization failed:",s)}try{const s=document.getElementById("viewStudio");s&&(this.studio=new q({container:s,onActivityLogged:t}))}catch(s){console.error("[NOVA] WebsiteStudio initialization failed:",s)}try{const s=document.getElementById("viewHistory");s&&(this.historyView=new G({container:s,onSelectSession:a=>{this.navigation&&this.navigation.setActiveView("assistant"),this.chat&&this.chat.switchSession(a),this._renderSessionsPanel()},onNewSession:()=>{this.navigation&&this.navigation.setActiveView("assistant"),this.chat&&this.chat.createNewChat(),this._renderSessionsPanel()},onActivityLogged:t}))}catch(s){console.error("[NOVA] HistoryView initialization failed:",s)}try{this.settingsModal=new U({neuralCore:null,onSettingsUpdated:s=>{this.activeGraphicsCore&&(s.reducedMotion!==void 0&&(this.activeGraphicsCore.setReducedMotion(s.reducedMotion),this._updateReduceEffectsButtons(s.reducedMotion)),s.themeAccent!==void 0&&this.activeGraphicsCore.setThemeAccent(s.themeAccent),s.quality!==void 0&&this.activeGraphicsCore.setQuality(s.quality))},onActivityLogged:t})}catch(s){console.error("[NOVA] SettingsModal initialization failed:",s)}this._wireSurroundingPanels(t),this._setupHeaderControls(),this._setupStageInteractivity(),window.addEventListener("hashchange",()=>{const s=window.location.hash.replace("#","");["assistant","studio","history"].includes(s)?this.navigation&&this.navigation.setActiveView(s):s==="settings"&&this._openSettings()});const i=window.location.hash.replace("#","");["assistant","studio","history"].includes(i)?this.navigation&&this.navigation.setActiveView(i):i==="settings"&&this._openSettings();const o=new URLSearchParams(window.location.search).get("prompt");o&&this.chat&&setTimeout(()=>{this.chat.sendMessage(decodeURIComponent(o))},400),await this._loadGraphics(e)}async _loadGraphics(e){const t=document.getElementById("neuralStageContainer");if(t){this._addTelemetryLog("Initializing circular holographic energy reactor...",!0);try{const{NeuralCore:i}=await I(async()=>{const{NeuralCore:n}=await import("./NeuralCore-C3lOjReG.js");return{NeuralCore:n}},__vite__mapDeps([0,1]));this.activeGraphicsCore=new i(t,{reducedMotion:e.reducedMotion,quality:e.quality||"high",themeAccent:e.themeAccent||"cyan",onFpsUpdate:n=>this._onFpsUpdate(n)}),this.activeGraphicsCore.fallback?(this.activeGraphicsCore=this.activeGraphicsCore.fallback,this._addTelemetryLog("Graphics: 2D vector fallback active (WebGL restricted)",!0)):this._addTelemetryLog("Graphics: WebGL 3D Holographic Reactor online",!0)}catch(i){console.warn("[NOVA] Dynamic 3D graphics loading failed, mounting vector fallback:",i),this._addTelemetryLog("Graphics: Falling back to 2D vector reactor",!0),this.activeGraphicsCore=new R(t,{reducedMotion:e.reducedMotion,themeAccent:e.themeAccent||"cyan",quality:e.quality||"high",onFpsUpdate:n=>this._onFpsUpdate(n)})}this.chat&&(this.chat.neuralCore=this.activeGraphicsCore),this.settingsModal&&(this.settingsModal.neuralCore=this.activeGraphicsCore),this._setupCoreStateSync()}}_wireSurroundingPanels(e){this._renderSessionsPanel();const t=document.getElementById("btnPanelNewSession");t&&t.addEventListener("click",()=>{this.chat&&this.chat.createNewChat(),this._renderSessionsPanel()});const i=document.getElementById("sliderSpeechRate"),n=document.getElementById("valSpeechRate");document.getElementById("selectVoicePersona");const o=document.getElementById("btnTestVoice"),s=document.getElementById("btnPanelStopSpeech");i&&n&&i.addEventListener("input",g=>{const l=parseFloat(g.target.value).toFixed(2);n.textContent=`${l}x`,h.saveSettings({speechRate:parseFloat(l)})}),o&&o.addEventListener("click",()=>{const g=h.loadSettings();e("Audio test: Synthesizing diagnostic audio beacon..."),b.speak("NOVA holographic acoustic synthesis nominal.",{voiceURI:g.voiceURI,rate:g.speechRate,pitch:g.speechPitch})}),s&&s.addEventListener("click",()=>{b.stopSpeaking(),this.activeGraphicsCore&&this.activeGraphicsCore.setState("idle"),m.info("Voice synthesis stopped."),e("Audio: Voice synthesis stopped by operator")});const a=document.getElementById("btnMatrixStudio"),r=document.getElementById("btnMatrixHistory"),c=document.getElementById("btnMatrixSettings"),u=document.getElementById("btnMatrixClearSession");a&&a.addEventListener("click",()=>{this.navigation&&this.navigation.setActiveView("studio")}),r&&r.addEventListener("click",()=>{this.navigation&&this.navigation.setActiveView("history")}),c&&c.addEventListener("click",()=>{this._openSettings()}),u&&u.addEventListener("click",()=>{this.chat&&this.chat.createNewChat(),this._renderSessionsPanel(),m.info("Session context reset to default."),e("Operational session context reset")})}_renderSessionsPanel(){const e=document.getElementById("panelSessionList"),t=document.getElementById("panelSessionCount");if(!e)return;const i=h.getSessions(),n=h.getActiveSessionId();if(t&&(t.textContent=`${i.length} SESSIONS LOGGED`),e.innerHTML="",i.length===0){e.innerHTML=`
        <div style="font-family: var(--font-mono); font-size: 0.64rem; color: var(--text-dim); text-align: center; padding: 1rem 0;">
          NO ARCHIVED SESSIONS
        </div>
      `;return}i.slice(0,8).forEach(o=>{const s=document.createElement("div");s.className=`session-item ${o.id===n?"active":""}`;const a=new Date(o.updatedAt||o.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),r=(o.messages||[]).length;s.innerHTML=`
        <div class="session-item-main">
          <span class="session-item-title">${this._escapeHtml(o.title)}</span>
          <div class="session-item-meta">
            <span>${r} msgs</span>
            <span>&bull;</span>
            <span>${a}</span>
          </div>
        </div>
      `,s.addEventListener("click",()=>{this.chat&&this.chat.switchSession(o.id),this._renderSessionsPanel()}),e.appendChild(s)})}_addTelemetryLog(e,t=!1){const i=document.getElementById("telemetryLogStream");if(!i)return;const n=new Date,o=n.toTimeString().split(" ")[0]+"."+String(n.getMilliseconds()).padStart(3,"0"),s=document.createElement("div");for(s.className="telemetry-line",s.innerHTML=`
      <span class="telemetry-time">[${o}]</span>
      <span class="telemetry-msg ${t?"highlight":""}">${this._escapeHtml(e)}</span>
    `,i.appendChild(s);i.children.length>40;)i.removeChild(i.firstChild);i.scrollTop=i.scrollHeight}_openSettings(){this.settingsModal&&this.settingsModal.open()}_switchView(e){const t={assistant:document.getElementById("viewAssistant"),studio:document.getElementById("viewStudio"),history:document.getElementById("viewHistory")};Object.keys(t).forEach(i=>{t[i]&&(i===e?t[i].classList.add("active"):t[i].classList.remove("active"))}),e==="history"&&this.historyView&&this.historyView.refresh(),this._addTelemetryLog(`Navigated view: ${e.toUpperCase()}`)}_setupHeaderControls(){const e=document.getElementById("btnGlobalMute"),t=document.getElementById("iconMute");let i=!1;e&&t&&e.addEventListener("click",()=>{i=!i,b.setMuted(i),i?(e.classList.add("active"),t.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line>',m.info("Voice synthesis muted."),this.activeGraphicsCore&&this.activeGraphicsCore.setState("idle")):(e.classList.remove("active"),t.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',m.info("Voice synthesis active."))});const n=document.getElementById("btnHeaderSettings");n&&n.addEventListener("click",()=>{this._openSettings()});const o=document.getElementById("btnReduceEffects");o&&o.addEventListener("click",()=>{const l=!(this.activeGraphicsCore&&this.activeGraphicsCore.options.reducedMotion);this.activeGraphicsCore&&this.activeGraphicsCore.setReducedMotion(l),h.saveSettings({reducedMotion:l}),this._updateReduceEffectsButtons(l),m.info(l?"3D Motion paused (Reduced motion)":"3D Motion active")});const s=document.getElementById("btnMobileMenu"),a=document.getElementById("appSidebar");s&&a&&s.addEventListener("click",()=>{a.classList.toggle("expanded")});const r=document.getElementById("btnDemoInfo"),c=document.getElementById("demoNoticeModal"),u=document.getElementById("btnCloseDemoModal"),g=document.getElementById("btnDismissDemoModal");if(r&&c){const l=()=>c.classList.add("open"),d=()=>c.classList.remove("open");r.addEventListener("click",l),u&&u.addEventListener("click",d),g&&g.addEventListener("click",d),c.addEventListener("click",f=>{f.target===c&&d()})}}_setupStageInteractivity(){const e=document.getElementById("btnRecenterCore"),t=document.getElementById("btnToggleMotion");e&&e.addEventListener("click",()=>{this.activeGraphicsCore&&this.activeGraphicsCore.recenterPerspective(),m.info("Reactor perspective re-centered."),this._addTelemetryLog("Stage: Perspective re-centered")}),t&&t.addEventListener("click",()=>{const i=!(this.activeGraphicsCore&&this.activeGraphicsCore.options.reducedMotion);this.activeGraphicsCore&&this.activeGraphicsCore.setReducedMotion(i),h.saveSettings({reducedMotion:i}),this._updateReduceEffectsButtons(i),m.info(i?"Reactor motion paused":"Reactor motion active"),this._addTelemetryLog(`Stage: Motion ${i?"paused":"resumed"}`)})}_updateReduceEffectsButtons(e){const t=document.getElementById("labelReduceEffects"),i=document.getElementById("motionToggleLabel");t&&(t.textContent=e?"Resume Motion":"Pause Motion"),i&&(i.textContent=e?"Resume":"Pause")}_setupCoreStateSync(){const e=document.getElementById("coreStatusPill"),t=document.getElementById("coreStatusText");if(!e||!t||!this.activeGraphicsCore)return;const i=this.activeGraphicsCore.setState.bind(this.activeGraphicsCore);this.activeGraphicsCore.setState=n=>{switch(i(n),e.setAttribute("data-state",n),n){case"idle":t.textContent="REACTOR STATUS • NOMINAL COHERENCE";break;case"listening":t.textContent="ACOUSTIC SENSORS • CAPTURING SPEECH";break;case"thinking":t.textContent="NEURAL CORE • EXECUTING REACTION";break;case"speaking":t.textContent="SYNTHESIS • TRANSMITTING WAVEFORM";break}}}_onFpsUpdate(e){const t=document.getElementById("hudFpsDisplay");t&&(t.textContent=e>=15?`${e} FPS`:"")}_escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}}function A(){try{window.novaApp=new F}catch(v){console.error("[NOVA] Critical application bootstrap failure:",v);const e=document.getElementById("startupErrorNotice");e&&(e.style.display="block")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",A):A();export{R as F};
//# sourceMappingURL=index-CPTtOKQh.js.map
