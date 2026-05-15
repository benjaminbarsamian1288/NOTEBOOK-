/* Photorealistic SVG product renders – v2
   Override window.PHOTOS with richer, more 3D-looking representations */

(function() {
  if (!window.PHOTOS) return;

  function svg(viewBox, content) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"
      preserveAspectRatio="xMidYMid meet" class="prod-photo">${content}</svg>`;
  }

  // Generic SHADED 3D box render with rounded shadow, perspective
  function shadedBody(opts) {
    const { color = '#cbd5e0', shadow = '#475569' } = opts || {};
    return `
      <ellipse cx="100" cy="226" rx="64" ry="6" fill="rgba(0,0,0,.3)"/>
      <defs>
        <linearGradient id="bg-${color.slice(1)}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${color}"/>
          <stop offset=".5" stop-color="${color}"/>
          <stop offset="1" stop-color="${shadow}"/>
        </linearGradient>
        <radialGradient id="hl-${color.slice(1)}" cx=".3" cy=".2">
          <stop offset="0" stop-color="rgba(255,255,255,.5)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
    `;
  }

  // ============ PIR rotund body with Fresnel lens ============
  const pir = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="64" ry="6" fill="rgba(0,0,0,.35)"/>
    <defs>
      <linearGradient id="pirBg" x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color="#fafbfc"/>
        <stop offset=".5" stop-color="#dde1e8"/>
        <stop offset="1" stop-color="#9aa4b3"/>
      </linearGradient>
      <linearGradient id="pirShine" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,.8)"/>
        <stop offset=".4" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
      <linearGradient id="pirLens" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#1f2937"/>
        <stop offset=".5" stop-color="#374151"/>
        <stop offset="1" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <!-- Body -->
    <path d="M52 30 Q52 14 70 14 L130 14 Q148 14 148 30 L148 200 Q148 220 128 220 L72 220 Q52 220 52 200 Z"
      fill="url(#pirBg)" stroke="#6b7785" stroke-width="1.2"/>
    <!-- Highlight overlay -->
    <path d="M58 24 Q58 16 70 16 L130 16 Q142 16 142 26 L142 90 Q100 100 58 90 Z"
      fill="url(#pirShine)"/>
    <!-- Lens housing -->
    <path d="M64 50 L136 50 L136 158 Q100 168 64 158 Z" fill="url(#pirLens)"/>
    <!-- Fresnel pattern -->
    <g stroke="rgba(255,255,255,.15)" stroke-width=".4" fill="none">
      <ellipse cx="100" cy="104" rx="32" ry="48"/>
      <ellipse cx="100" cy="104" rx="26" ry="42"/>
      <ellipse cx="100" cy="104" rx="20" ry="36"/>
      <ellipse cx="100" cy="104" rx="14" ry="28"/>
      <line x1="68" y1="104" x2="132" y2="104"/>
      <line x1="100" y1="56" x2="100" y2="156"/>
    </g>
    <!-- Center spot -->
    <ellipse cx="100" cy="104" rx="6" ry="10" fill="#22d3ee" opacity=".4"/>
    <!-- LED -->
    <circle cx="100" cy="178" r="3.5" fill="#ef4444">
      <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <!-- Brand tag -->
    <text x="100" y="200" text-anchor="middle" font-size="6" fill="#64748b" font-family="system-ui" font-weight="600">PIR-2500</text>
  `);

  // ============ DUAL: bigger with both sensor windows ============
  const dual = () => svg('0 0 200 250', `
    <ellipse cx="100" cy="236" rx="64" ry="6" fill="rgba(0,0,0,.35)"/>
    <defs>
      <linearGradient id="dualBg" x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color="#fafbfc"/>
        <stop offset="1" stop-color="#9aa4b3"/>
      </linearGradient>
    </defs>
    <path d="M52 24 Q52 12 70 12 L130 12 Q148 12 148 24 L148 218 Q148 228 138 228 L62 228 Q52 228 52 218 Z"
      fill="url(#dualBg)" stroke="#6b7785" stroke-width="1.5"/>
    <!-- PIR lens top -->
    <path d="M60 38 L140 38 L140 130 Q100 142 60 130 Z" fill="#0f172a"/>
    <g stroke="rgba(251,191,36,.4)" stroke-width=".5" fill="none">
      <ellipse cx="100" cy="86" rx="30" ry="38"/>
      <ellipse cx="100" cy="86" rx="22" ry="30"/>
      <ellipse cx="100" cy="86" rx="14" ry="22"/>
    </g>
    <!-- MW window bottom -->
    <rect x="62" y="146" width="76" height="48" rx="3" fill="#0c0a1a"/>
    <g stroke="#22d3ee" stroke-width=".7" opacity=".6">
      ${Array.from({length:5}).map((_,i)=>`<line x1="${66+i*16}" y1="148" x2="${66+i*16}" y2="192"/>`).join('')}
      ${Array.from({length:4}).map((_,i)=>`<line x1="62" y1="${152+i*11}" x2="138" y2="${152+i*11}"/>`).join('')}
    </g>
    <!-- LEDs -->
    <circle cx="88" cy="208" r="2.5" fill="#fbbf24"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
    <circle cx="112" cy="208" r="2.5" fill="#22d3ee"><animate attributeName="opacity" values=".3;1;.3" dur="1.5s" repeatCount="indefinite"/></circle>
    <text x="100" y="244" text-anchor="middle" font-size="6" fill="#64748b" font-family="system-ui" font-weight="600">DUAL-TEC PRO</text>
  `);

  // ============ MAGNETKONTAKT (premium quality, two parts) ============
  const magnet = () => svg('0 0 200 200', `
    <ellipse cx="60" cy="174" rx="22" ry="4" fill="rgba(0,0,0,.4)"/>
    <ellipse cx="140" cy="174" rx="22" ry="4" fill="rgba(0,0,0,.4)"/>
    <defs>
      <linearGradient id="reedBg" x2="0" y2="1">
        <stop offset="0" stop-color="#fafbfc"/>
        <stop offset="1" stop-color="#cbd5e0"/>
      </linearGradient>
      <linearGradient id="magBg" x2="0" y2="1">
        <stop offset="0" stop-color="#c084fc"/>
        <stop offset="1" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <!-- Reed -->
    <rect x="36" y="60" width="50" height="110" rx="4" fill="url(#reedBg)" stroke="#6b7785" stroke-width="1.2"/>
    <rect x="46" y="72" width="30" height="76" fill="#0f172a"/>
    <text x="61" y="118" text-anchor="middle" font-size="8" fill="#22d3ee" font-family="system-ui" font-weight="800">REED</text>
    <circle cx="61" cy="80" r="2.5" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
    <!-- Cable -->
    <path d="M52 170 Q40 178 30 174" stroke="#475569" stroke-width="2" fill="none"/>
    <path d="M70 170 Q56 180 44 178" stroke="#475569" stroke-width="2" fill="none"/>
    <!-- Magnet -->
    <rect x="114" y="60" width="50" height="110" rx="4" fill="url(#magBg)" stroke="#5a21b1" stroke-width="1.2"/>
    <rect x="124" y="78" width="30" height="74" fill="rgba(0,0,0,.25)"/>
    <text x="139" y="110" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="900">N</text>
    <text x="139" y="138" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.7)" font-family="system-ui" font-weight="700">MAGNET</text>
  `);

  // ============ MIKROWELLE (industrial-looking flat box) ============
  const mw = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="62" ry="6" fill="rgba(0,0,0,.35)"/>
    <defs>
      <linearGradient id="mwBg" x2="0" y2="1">
        <stop offset="0" stop-color="#1e293b"/>
        <stop offset="1" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="mwScreen" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(34,211,238,.4)"/>
        <stop offset="1" stop-color="rgba(34,211,238,.1)"/>
      </linearGradient>
    </defs>
    <rect x="42" y="26" width="116" height="190" rx="10" fill="url(#mwBg)" stroke="#0c0a1a" stroke-width="2"/>
    <rect x="52" y="36" width="96" height="124" fill="url(#mwScreen)" stroke="#0ea5e9" stroke-width=".5"/>
    <!-- Radar mesh -->
    <g stroke="#22d3ee" stroke-width=".8" opacity=".7">
      ${Array.from({length:7}).map((_,i)=>`<line x1="${56+i*14}" y1="38" x2="${56+i*14}" y2="158"/>`).join('')}
      ${Array.from({length:9}).map((_,i)=>`<line x1="52" y1="${40+i*15}" x2="148" y2="${40+i*15}"/>`).join('')}
    </g>
    <!-- LED ring + label -->
    <circle cx="100" cy="184" r="8" fill="rgba(34,211,238,.2)"/>
    <circle cx="100" cy="184" r="5" fill="#22d3ee" stroke="#0ea5e9" stroke-width="1">
      <animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <text x="100" y="206" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="monospace">10,525 GHz</text>
  `);

  // ============ Smoke detector (high-detail round) ============
  const fire = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="68" ry="6" fill="rgba(0,0,0,.4)"/>
    <defs>
      <radialGradient id="fireBg" cx=".4" cy=".4">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset=".5" stop-color="#f8fafc"/>
        <stop offset="1" stop-color="#94a3b8"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="105" rx="80" ry="22" fill="#cbd5e0"/>
    <ellipse cx="100" cy="92" rx="80" ry="22" fill="url(#fireBg)" stroke="#94a3b8" stroke-width="2"/>
    <ellipse cx="100" cy="88" rx="80" ry="22" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1"/>
    <g stroke="#94a3b8" stroke-width="1.2" fill="none">
      <ellipse cx="100" cy="92" rx="60" ry="16"/>
      <ellipse cx="100" cy="92" rx="44" ry="11"/>
      <ellipse cx="100" cy="92" rx="28" ry="7"/>
    </g>
    <circle cx="100" cy="92" r="8" fill="#dc2626">
      <animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="100" cy="92" r="3.5" fill="white"/>
    <text x="100" y="148" text-anchor="middle" font-size="7" fill="#475569" font-family="system-ui" font-weight="700">DIN EN 54-7</text>
  `);

  // ============ Bullet camera (premium look) ============
  const camera = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="72" ry="6" fill="rgba(0,0,0,.4)"/>
    <defs>
      <linearGradient id="camBg" x2="0" y2="1">
        <stop offset="0" stop-color="#3a4858"/>
        <stop offset="1" stop-color="#1e293b"/>
      </linearGradient>
      <radialGradient id="camLensBg" cx=".4" cy=".4">
        <stop offset="0" stop-color="#cbd5e0"/>
        <stop offset=".4" stop-color="#475569"/>
        <stop offset="1" stop-color="#0a0f1a"/>
      </radialGradient>
    </defs>
    <!-- Mount arm -->
    <rect x="88" y="12" width="14" height="42" rx="2" fill="#475569"/>
    <rect x="86" y="50" width="18" height="10" rx="2" fill="#94a3b8"/>
    <!-- Body -->
    <rect x="38" y="52" width="120" height="78" rx="16" fill="url(#camBg)" stroke="#0a0f1a" stroke-width="2"/>
    <!-- Side ridges -->
    <line x1="40" y1="80" x2="155" y2="80" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
    <line x1="40" y1="100" x2="155" y2="100" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
    <!-- Lens housing -->
    <circle cx="146" cy="91" r="34" fill="#0a0f1a" stroke="#475569" stroke-width="2"/>
    <circle cx="146" cy="91" r="28" fill="url(#camLensBg)"/>
    <circle cx="146" cy="91" r="20" fill="#000"/>
    <circle cx="146" cy="91" r="14" fill="#0c1018"/>
    <ellipse cx="140" cy="85" rx="4" ry="3" fill="rgba(255,255,255,.3)"/>
    <!-- IR LEDs ring -->
    <g fill="#a3e635">
      ${Array.from({length:8}).map((_,i)=>{
        const a = i*Math.PI/4;
        const x = 146 + Math.cos(a)*32;
        const y = 91 + Math.sin(a)*32;
        return `<circle cx="${x}" cy="${y}" r="2.5"><animate attributeName="opacity" values="1;.4;1" dur="2s" begin="${i*0.15}s" repeatCount="indefinite"/></circle>`;
      }).join('')}
    </g>
    <!-- Status LED -->
    <circle cx="52" cy="68" r="3" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
    <!-- Brand -->
    <text x="100" y="160" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="monospace" font-weight="600">IP-CAM 4K · IR-NIGHT</text>
  `);

  // ============ EMA Zentrale (industrial control panel) ============
  const zentrale = () => svg('0 0 240 200', `
    <ellipse cx="120" cy="186" rx="92" ry="6" fill="rgba(0,0,0,.35)"/>
    <defs>
      <linearGradient id="zentBg" x2="0" y2="1">
        <stop offset="0" stop-color="#1e293b"/>
        <stop offset="1" stop-color="#0a0f1a"/>
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="200" height="148" rx="8" fill="url(#zentBg)" stroke="#475569" stroke-width="2"/>
    <!-- Screen -->
    <rect x="32" y="32" width="176" height="50" fill="#0a0f1a" stroke="#22d3ee" stroke-width="1"/>
    <rect x="34" y="34" width="172" height="46" fill="#000"/>
    <text x="46" y="52" font-size="10" fill="#22d3ee" font-family="monospace" font-weight="700">● EMA AKTIV</text>
    <text x="46" y="66" font-size="8" fill="#22c55e" font-family="monospace">32 Zonen · Grad 3</text>
    <text x="46" y="76" font-size="7" fill="#94a3b8" font-family="monospace">NSL: Securitas</text>
    <!-- Status LEDs -->
    <circle cx="190" cy="44" r="3" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
    <circle cx="190" cy="58" r="3" fill="#22c55e"/>
    <circle cx="190" cy="72" r="3" fill="#fbbf24"/>
    <!-- Keypad -->
    <g>
      ${(()=>{ let r=''; for(let i=0;i<12;i++){
        const c=i%4, ro=Math.floor(i/4);
        const x=34+c*44, y=92+ro*22;
        r+=`<rect x="${x}" y="${y}" width="38" height="16" rx="3" fill="#374151" stroke="#475569"/>`;
        const ch = i===10?'0':i===9?'*':i===11?'#':(i+1);
        r+=`<text x="${x+19}" y="${y+12}" text-anchor="middle" font-size="9" fill="#e2e8f0" font-family="system-ui" font-weight="700">${ch}</text>`;
      } return r; })()}
    </g>
  `);

  // ============ Sirene (red with strobe) ============
  const sirene = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="56" ry="6" fill="rgba(0,0,0,.45)"/>
    <defs>
      <linearGradient id="sirBg" x2="0" y2="1">
        <stop offset="0" stop-color="#f87171"/>
        <stop offset=".5" stop-color="#dc2626"/>
        <stop offset="1" stop-color="#7f1d1d"/>
      </linearGradient>
    </defs>
    <rect x="56" y="34" width="88" height="180" rx="8" fill="url(#sirBg)" stroke="#7f1d1d" stroke-width="2"/>
    <!-- Sound holes -->
    <g fill="rgba(0,0,0,.4)">
      ${Array.from({length:8}).map((_,i)=>`<rect x="72" y="${50+i*8}" width="56" height="3.5" rx="1.5"/>`).join('')}
    </g>
    <!-- Strobe -->
    <ellipse cx="100" cy="140" rx="24" ry="16" fill="#fef3c7" opacity=".7">
      <animate attributeName="opacity" values=".5;1;.5" dur="0.6s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="100" cy="140" rx="16" ry="10" fill="#fbbf24">
      <animate attributeName="opacity" values="1;.4;1" dur="0.6s" repeatCount="indefinite"/>
    </ellipse>
    <!-- ALARM text -->
    <rect x="64" y="170" width="72" height="20" fill="rgba(0,0,0,.4)"/>
    <text x="100" y="185" text-anchor="middle" font-size="12" fill="white" font-family="system-ui" font-weight="900">ALARM</text>
  `);

  // ============ Glasbruch Passiv (round mic grille) ============
  const glassPassiv = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="62" ry="6" fill="rgba(0,0,0,.4)"/>
    <defs>
      <radialGradient id="gpBg" cx=".4" cy=".4">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#9aa4b3"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="92" r="68" fill="url(#gpBg)" stroke="#6b7785" stroke-width="2"/>
    <circle cx="100" cy="92" r="56" fill="#cbd5e0"/>
    <!-- Mic grille (precise dot pattern) -->
    <g fill="#475569">
      ${(()=>{ let r='';
        for(let y=-7;y<=7;y++) for(let x=-7;x<=7;x++){
          const px=100+x*5, py=92+y*5;
          const d=Math.hypot(px-100,py-92);
          if(d<52 && d>0) r+=`<circle cx="${px}" cy="${py}" r="1.4"/>`;
        }
        return r;
      })()}
    </g>
    <circle cx="100" cy="92" r="4" fill="#0f172a"/>
    <text x="100" y="174" text-anchor="middle" font-size="7" fill="#475569" font-family="system-ui" font-weight="700">VdS 2332</text>
  `);

  // ============ Override the renderer ============
  const overrides = {
    'pir-standard': pir, 'pir-vorhang': pir, 'pir-decke': pir,
    'pir-longrange': pir, 'pir-tierimmun': pir, 'pir-antimask': pir, 'pir-outdoor': pir,
    'mikrowelle': mw, 'dualmelder': dual, 'ultraschall': mw,
    'magnetkontakt': magnet,
    'rauch-streulicht': fire, 'waerme-max': fire, 'multisensor': fire,
    'glas-passiv': glassPassiv,
    'kamera': camera, 'sirene': sirene, 'zentrale': zentrale,
  };
  // Merge into PHOTOS.MAP
  Object.entries(overrides).forEach(([k, fn]) => {
    PHOTOS.MAP[k] = fn;
  });
})();
