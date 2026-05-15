/* Realistic SVG "product photos" für jeden Sensortyp.
   Jedes Produkt wird als detaillierte SVG-Darstellung des realen Geräts gerendert. */

window.PHOTOS = (() => {

  function svg(viewBox, content, extra = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"
      preserveAspectRatio="xMidYMid meet" class="prod-photo" ${extra}>${content}</svg>`;
  }

  // ===== PIR (Wand-Bewegungsmelder, klassische ovale Form mit Linse) =====
  const pir = () => svg('0 0 200 240', `
    <defs>
      <linearGradient id="pirBody" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#f8fafc"/>
        <stop offset="1" stop-color="#cbd5e0"/>
      </linearGradient>
      <radialGradient id="pirLens" cx=".4" cy=".3">
        <stop offset="0" stop-color="#e2e8f0"/>
        <stop offset=".6" stop-color="#94a3b8"/>
        <stop offset="1" stop-color="#475569"/>
      </radialGradient>
    </defs>
    <!-- Wall shadow -->
    <ellipse cx="100" cy="226" rx="60" ry="6" fill="rgba(0,0,0,.25)"/>
    <!-- Body -->
    <path d="M60 30 Q60 14 76 14 L124 14 Q140 14 140 30 L140 200 Q140 218 122 218 L78 218 Q60 218 60 200 Z"
      fill="url(#pirBody)" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Lens (Fresnel pattern) -->
    <path d="M70 50 L130 50 L130 160 L70 160 Z" fill="url(#pirLens)" stroke="#475569" stroke-width=".5"/>
    <!-- Fresnel segments -->
    <g stroke="rgba(255,255,255,.3)" stroke-width=".5" fill="none">
      <line x1="70" y1="68" x2="130" y2="68"/>
      <line x1="70" y1="86" x2="130" y2="86"/>
      <line x1="70" y1="104" x2="130" y2="104"/>
      <line x1="70" y1="122" x2="130" y2="122"/>
      <line x1="70" y1="140" x2="130" y2="140"/>
      <line x1="84" y1="50" x2="84" y2="160"/>
      <line x1="100" y1="50" x2="100" y2="160"/>
      <line x1="116" y1="50" x2="116" y2="160"/>
    </g>
    <!-- LED -->
    <circle cx="100" cy="180" r="3" fill="#ef4444">
      <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <!-- Brand label -->
    <text x="100" y="200" text-anchor="middle" font-size="7" fill="#64748b" font-family="system-ui">PIR · 12 m</text>
  `);

  // ===== PIR Vorhang (kleiner, schmal) =====
  const pirVorhang = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="60" ry="6" fill="rgba(0,0,0,.25)"/>
    <rect x="80" y="14" width="40" height="204" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="86" y="50" width="28" height="120" fill="#475569"/>
    <text x="100" y="200" text-anchor="middle" font-size="7" fill="#64748b" font-family="system-ui">PIR Vorhang</text>
    <text x="100" y="40" text-anchor="middle" font-size="6" fill="#64748b" font-family="system-ui">2×20m / 6°</text>
  `);

  // ===== PIR Decke 360° =====
  const pirDecke = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="230" rx="70" ry="5" fill="rgba(0,0,0,.3)"/>
    <!-- Ceiling -->
    <rect x="20" y="20" width="160" height="14" fill="#475569"/>
    <!-- Round mount -->
    <circle cx="100" cy="80" r="48" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="100" cy="80" r="38" fill="url(#decGrad)"/>
    <circle cx="100" cy="80" r="20" fill="#334155"/>
    <circle cx="100" cy="80" r="8" fill="#64748b"/>
    <defs>
      <radialGradient id="decGrad" cx=".5" cy=".4">
        <stop offset="0" stop-color="#e2e8f0"/>
        <stop offset="1" stop-color="#94a3b8"/>
      </radialGradient>
    </defs>
    <text x="100" y="160" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">Decke 360° · Ø 12 m</text>
  `);

  // ===== Magnetkontakt (AP, klassisch zwei kleine Quader) =====
  const magnet = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="70" ry="5" fill="rgba(0,0,0,.25)"/>
    <!-- Frame piece (Reed) -->
    <rect x="40" y="70" width="40" height="100" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="50" y="85" width="20" height="60" fill="#cbd5e0"/>
    <text x="60" y="120" text-anchor="middle" font-size="8" fill="#475569" font-family="system-ui" font-weight="700">REED</text>
    <!-- Cable -->
    <path d="M58 168 Q40 180 30 175" stroke="#475569" stroke-width="1.5" fill="none"/>
    <path d="M62 168 Q42 182 32 178" stroke="#475569" stroke-width="1.5" fill="none"/>
    <!-- Door piece (Magnet) -->
    <rect x="100" y="70" width="40" height="100" rx="3" fill="#a78bfa" stroke="#7c3aed" stroke-width="1.5"/>
    <rect x="110" y="100" width="20" height="40" fill="#7c3aed"/>
    <text x="120" y="125" text-anchor="middle" font-size="10" fill="white" font-family="system-ui" font-weight="800">N</text>
    <text x="120" y="160" text-anchor="middle" font-size="8" fill="white" font-family="system-ui" font-weight="700">MAGNET</text>
  `);

  // ===== Mikrowelle (rechteckig flach, mit Mesh-Pattern) =====
  const mw = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="60" ry="6" fill="rgba(0,0,0,.25)"/>
    <rect x="50" y="30" width="100" height="180" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <rect x="60" y="40" width="80" height="120" fill="#22d3ee" opacity=".25"/>
    <!-- Mesh pattern (radar grille) -->
    <g stroke="#22d3ee" stroke-width=".7" opacity=".7">
      ${Array.from({length:6}).map((_,i)=>`<line x1="${60+i*16}" y1="40" x2="${60+i*16}" y2="160"/>`).join('')}
      ${Array.from({length:8}).map((_,i)=>`<line x1="60" y1="${40+i*15}" x2="140" y2="${40+i*15}"/>`).join('')}
    </g>
    <!-- LED ring -->
    <circle cx="100" cy="180" r="6" fill="#22d3ee" stroke="#0ea5e9" stroke-width="1.5">
      <animate attributeName="opacity" values="1;.4;1" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <text x="100" y="200" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="system-ui">10,525 GHz</text>
  `);

  // ===== Dualmelder (PIR-Form mit kleinerem MW unten) =====
  const dual = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="60" ry="6" fill="rgba(0,0,0,.25)"/>
    <path d="M60 28 Q60 12 76 12 L124 12 Q140 12 140 28 L140 210 Q140 220 130 220 L70 220 Q60 220 60 210 Z"
      fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- PIR lens (upper) -->
    <rect x="72" y="40" width="56" height="100" rx="2" fill="url(#dgr1)"/>
    <defs>
      <radialGradient id="dgr1" cx=".4" cy=".3"><stop offset="0" stop-color="#e2e8f0"/><stop offset="1" stop-color="#475569"/></radialGradient>
    </defs>
    <!-- Fresnel lines -->
    <g stroke="rgba(255,255,255,.3)" stroke-width=".5">
      <line x1="72" y1="60" x2="128" y2="60"/>
      <line x1="72" y1="80" x2="128" y2="80"/>
      <line x1="72" y1="100" x2="128" y2="100"/>
      <line x1="72" y1="120" x2="128" y2="120"/>
    </g>
    <!-- MW window (lower) - radar mesh -->
    <rect x="76" y="152" width="48" height="40" rx="2" fill="#0f172a"/>
    <g stroke="#22d3ee" stroke-width=".6" opacity=".6">
      <line x1="84" y1="152" x2="84" y2="192"/>
      <line x1="100" y1="152" x2="100" y2="192"/>
      <line x1="116" y1="152" x2="116" y2="192"/>
      <line x1="76" y1="162" x2="124" y2="162"/>
      <line x1="76" y1="172" x2="124" y2="172"/>
      <line x1="76" y1="182" x2="124" y2="182"/>
    </g>
    <!-- LEDs -->
    <circle cx="92" cy="206" r="2.5" fill="#fbbf24"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
    <circle cx="108" cy="206" r="2.5" fill="#22d3ee"><animate attributeName="opacity" values=".3;1;.3" dur="2s" repeatCount="indefinite"/></circle>
    <text x="100" y="234" text-anchor="middle" font-size="6" fill="#64748b" font-family="system-ui">DUAL · PIR + MW</text>
  `);

  // ===== Glasbruch akustisch (rund, mit Mikrofon-Gitter) =====
  const glassPassiv = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="60" ry="5" fill="rgba(0,0,0,.25)"/>
    <circle cx="100" cy="90" r="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="100" cy="90" r="50" fill="#cbd5e0"/>
    <!-- Microphone grille (dots) -->
    <g fill="#475569">
      ${(()=>{ let r='';
        for(let y=-6;y<=6;y++) for(let x=-6;x<=6;x++){
          const px=100+x*5, py=90+y*5;
          const d=Math.hypot(px-100,py-90);
          if(d<48) r+=`<circle cx="${px}" cy="${py}" r="1.5"/>`;
        }
        return r;
      })()}
    </g>
    <text x="100" y="170" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Glasbruch · Akustisch</text>
  `);

  // ===== Aktiv-Folie auf Scheibe =====
  const glassAktiv = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="60" ry="6" fill="rgba(0,0,0,.25)"/>
    <!-- Window frame -->
    <rect x="30" y="30" width="140" height="170" fill="rgba(56,189,248,.18)" stroke="#475569" stroke-width="3"/>
    <line x1="30" y1="115" x2="170" y2="115" stroke="#475569" stroke-width="2"/>
    <line x1="100" y1="30" x2="100" y2="200" stroke="#475569" stroke-width="2"/>
    <!-- Folie pattern (zigzag wire) -->
    <path d="M40 50 L160 50 L160 60 L40 60 L40 70 L160 70 L160 80 L40 80 L40 90 L160 90 L160 100 L40 100"
      stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <path d="M40 130 L160 130 L160 140 L40 140 L40 150 L160 150 L160 160 L40 160 L40 170 L160 170 L160 180 L40 180"
      stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <!-- Connection -->
    <circle cx="40" cy="50" r="3" fill="#ef4444"/>
    <circle cx="40" cy="180" r="3" fill="#22c55e"/>
    <text x="100" y="220" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Alarmfolie auf Scheibe</text>
  `);

  // ===== Erschütterungsmelder Piezo (klein, eckig) =====
  const piezo = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="50" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="60" y="70" width="80" height="90" rx="4" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
    <rect x="70" y="85" width="60" height="40" fill="#1e3a8a"/>
    <text x="100" y="110" text-anchor="middle" font-size="10" fill="white" font-family="system-ui" font-weight="800">PZT</text>
    <rect x="68" y="135" width="64" height="5" fill="#1e3a8a"/>
    <!-- Mount holes -->
    <circle cx="70" cy="150" r="3" fill="#0f172a"/>
    <circle cx="130" cy="150" r="3" fill="#0f172a"/>
    <text x="100" y="175" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Piezo · VdS 2480</text>
  `);

  // ===== Brandmelder (rund, weiß, mit Rauchöffnungen) =====
  const fire = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="60" ry="5" fill="rgba(0,0,0,.25)"/>
    <!-- Ceiling mount -->
    <ellipse cx="100" cy="100" rx="78" ry="22" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <ellipse cx="100" cy="92" rx="78" ry="22" fill="#fafafa" stroke="#94a3b8" stroke-width="2"/>
    <!-- Ventilation slots -->
    <g stroke="#94a3b8" stroke-width="1.5" fill="none">
      <ellipse cx="100" cy="92" rx="55" ry="15"/>
      <ellipse cx="100" cy="92" rx="40" ry="11"/>
    </g>
    <!-- Center LED -->
    <circle cx="100" cy="92" r="6" fill="#ef4444">
      <animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <!-- Test button -->
    <circle cx="100" cy="92" r="2.5" fill="white"/>
    <text x="100" y="150" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Optisch · DIN EN 54-7</text>
  `);

  // ===== Kamera (Bullet) =====
  const camera = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="70" ry="6" fill="rgba(0,0,0,.25)"/>
    <!-- Mount arm -->
    <rect x="92" y="14" width="16" height="40" fill="#475569"/>
    <!-- Body -->
    <rect x="50" y="50" width="100" height="60" rx="14" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <!-- Lens housing -->
    <circle cx="150" cy="80" r="32" fill="#0f172a"/>
    <circle cx="150" cy="80" r="24" fill="url(#camLens)"/>
    <circle cx="150" cy="80" r="14" fill="#000"/>
    <circle cx="150" cy="80" r="6" fill="#1e293b"/>
    <defs>
      <radialGradient id="camLens" cx=".35" cy=".35">
        <stop offset="0" stop-color="#94a3b8"/>
        <stop offset=".4" stop-color="#475569"/>
        <stop offset="1" stop-color="#000"/>
      </radialGradient>
    </defs>
    <!-- IR LEDs ring around lens -->
    <g fill="#a3e635">
      ${Array.from({length:8}).map((_,i)=>{
        const a = i*Math.PI/4;
        const x = 150 + Math.cos(a)*30;
        const y = 80 + Math.sin(a)*30;
        return `<circle cx="${x}" cy="${y}" r="2.5"><animate attributeName="opacity" values="1;.3;1" dur="2s" begin="${i*0.1}s" repeatCount="indefinite"/></circle>`;
      }).join('')}
    </g>
    <!-- LED status -->
    <circle cx="60" cy="60" r="2.5" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
    <text x="100" y="200" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">IP-Kamera · 2.7K · IR</text>
  `);

  // ===== Sirene Außen mit Blitz =====
  const sirene = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="50" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="65" y="40" width="70" height="140" rx="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
    <!-- Sound holes -->
    <g fill="#7f1d1d">
      ${Array.from({length:6}).map((_,i)=>{
        const y = 60 + i*8;
        return `<rect x="78" y="${y}" width="44" height="3" rx="1.5"/>`;
      }).join('')}
    </g>
    <!-- Flash strobe -->
    <ellipse cx="100" cy="125" rx="20" ry="14" fill="#fbbf24" opacity=".95">
      <animate attributeName="opacity" values="1;.3;1" dur="0.6s" repeatCount="indefinite"/>
    </ellipse>
    <!-- Brand label -->
    <text x="100" y="160" text-anchor="middle" font-size="10" fill="white" font-family="system-ui" font-weight="800">ALARM</text>
    <text x="100" y="200" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Außensirene + LED-Blitz</text>
  `);

  // ===== EMA-Zentrale (Box mit Display) =====
  const zentrale = () => svg('0 0 220 200', `
    <ellipse cx="110" cy="184" rx="80" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="20" y="20" width="180" height="140" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    <!-- Display -->
    <rect x="35" y="35" width="170" height="50" fill="#22d3ee" opacity=".15"/>
    <rect x="38" y="38" width="164" height="44" fill="#0c0a1a"/>
    <text x="50" y="58" font-size="11" fill="#22d3ee" font-family="monospace" font-weight="700">EMA aktiv ●</text>
    <text x="50" y="74" font-size="9" fill="#22c55e" font-family="monospace">32 Zonen · Grad 3</text>
    <!-- Keypad -->
    <g>
      ${(()=>{ let r=''; for(let i=0;i<12;i++){
        const c=i%3, ro=Math.floor(i/3);
        const x=40+c*55, y=100+ro*15;
        r+=`<rect x="${x}" y="${y}" width="50" height="11" rx="2" fill="#1e293b" stroke="#334155" stroke-width=".5"/>`;
        const ch = i===10?'0':i===9?'*':i===11?'#':(i+1);
        r+=`<text x="${x+25}" y="${y+8}" text-anchor="middle" font-size="6" fill="#cbd5e0" font-family="system-ui">${ch}</text>`;
      } return r; })()}
    </g>
  `);

  // ===== Druckmatte (Teppich-Aufsicht) =====
  const druckmatte = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="80" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="20" y="40" width="160" height="120" rx="3" fill="#475569" stroke="#1e293b" stroke-width="2"/>
    <!-- Sensor pattern -->
    <g stroke="rgba(34,211,238,.4)" stroke-width=".7" fill="none">
      ${Array.from({length:8}).map((_,i)=>`<line x1="${30+i*20}" y1="50" x2="${30+i*20}" y2="150"/>`).join('')}
      ${Array.from({length:6}).map((_,i)=>`<line x1="30" y1="${55+i*18}" x2="170" y2="${55+i*18}"/>`).join('')}
    </g>
    <!-- Connection wire -->
    <path d="M170 100 Q190 100 195 110" stroke="#22d3ee" stroke-width="2" fill="none"/>
    <text x="100" y="175" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Trittmatte · unter Belag</text>
  `);

  // ===== Thermalkamera (dicke Bullet mit Wärme-Symbol) =====
  const thermal = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="70" ry="6" fill="rgba(0,0,0,.25)"/>
    <rect x="92" y="14" width="16" height="40" fill="#475569"/>
    <rect x="40" y="50" width="120" height="70" rx="14" fill="#0c0a1a" stroke="#475569" stroke-width="2"/>
    <!-- Lens with thermal gradient -->
    <circle cx="160" cy="85" r="36" fill="#000"/>
    <circle cx="160" cy="85" r="28" fill="url(#thLens)"/>
    <defs>
      <radialGradient id="thLens" cx=".4" cy=".4">
        <stop offset="0" stop-color="#fbbf24"/>
        <stop offset=".5" stop-color="#ef4444"/>
        <stop offset="1" stop-color="#7c3aed"/>
      </radialGradient>
    </defs>
    <circle cx="160" cy="85" r="14" fill="#000"/>
    <!-- Thermal symbol -->
    <text x="80" y="80" font-size="22" fill="#ef4444" font-family="system-ui" font-weight="800">🌡</text>
    <text x="100" y="190" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Thermal · 100–2000m</text>
  `);

  // ===== Zaunsensor (Kabel mit Verstärker-Box) =====
  const zaunSensor = () => svg('0 0 200 200', `
    <!-- Fence top -->
    <g stroke="#94a3b8" stroke-width="1.5">
      <line x1="20" y1="50" x2="180" y2="50"/>
      <line x1="40" y1="40" x2="40" y2="60"/>
      <line x1="80" y1="40" x2="80" y2="60"/>
      <line x1="120" y1="40" x2="120" y2="60"/>
      <line x1="160" y1="40" x2="160" y2="60"/>
    </g>
    <!-- Sensor cable on fence -->
    <path d="M20 70 L180 70" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 70 L180 70" stroke="#67e8f9" stroke-width="1.5" stroke-dasharray="3 3">
      <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.6s" repeatCount="indefinite"/>
    </path>
    <!-- Cable to control box -->
    <path d="M100 70 Q100 100 100 110" stroke="#22d3ee" stroke-width="2" fill="none"/>
    <!-- Control box -->
    <rect x="60" y="110" width="80" height="60" rx="4" fill="#1e293b" stroke="#22d3ee" stroke-width="1.5"/>
    <rect x="68" y="118" width="64" height="14" fill="#0c0a1a"/>
    <text x="100" y="129" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace">ZONE 1 · OK</text>
    <text x="100" y="150" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="system-ui">Mikrophonisch</text>
    <text x="100" y="190" text-anchor="middle" font-size="7" fill="#64748b" font-family="system-ui">600 m/Zone</text>
  `);

  // ===== IR-Lichtschranke (zwei lange schmale Säulen) =====
  const irBeam = () => svg('0 0 220 200', `
    <ellipse cx="40" cy="184" rx="22" ry="4" fill="rgba(0,0,0,.25)"/>
    <ellipse cx="180" cy="184" rx="22" ry="4" fill="rgba(0,0,0,.25)"/>
    <!-- TX -->
    <rect x="28" y="30" width="26" height="140" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <text x="41" y="22" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="700">TX</text>
    <circle cx="41" cy="50" r="3" fill="#22d3ee"><animate attributeName="opacity" values="1;.2;1" dur="0.3s" repeatCount="indefinite"/></circle>
    <circle cx="41" cy="90" r="3" fill="#22d3ee"><animate attributeName="opacity" values="1;.2;1" dur="0.3s" begin="0.1s" repeatCount="indefinite"/></circle>
    <circle cx="41" cy="130" r="3" fill="#22d3ee"><animate attributeName="opacity" values="1;.2;1" dur="0.3s" begin="0.2s" repeatCount="indefinite"/></circle>
    <!-- RX -->
    <rect x="166" y="30" width="26" height="140" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <text x="179" y="22" text-anchor="middle" font-size="11" fill="#38bdf8" font-weight="700">RX</text>
    <!-- Beams -->
    <line x1="54" y1="50" x2="166" y2="50" stroke="#22d3ee" stroke-width="2" stroke-dasharray="6 4">
      <animate attributeName="stroke-dashoffset" values="0;-20" dur="0.5s" repeatCount="indefinite"/>
    </line>
    <line x1="54" y1="90" x2="166" y2="90" stroke="#22d3ee" stroke-width="2" stroke-dasharray="6 4">
      <animate attributeName="stroke-dashoffset" values="0;-20" dur="0.5s" begin="0.1s" repeatCount="indefinite"/>
    </line>
    <line x1="54" y1="130" x2="166" y2="130" stroke="#22d3ee" stroke-width="2" stroke-dasharray="6 4">
      <animate attributeName="stroke-dashoffset" values="0;-20" dur="0.5s" begin="0.2s" repeatCount="indefinite"/>
    </line>
  `);

  // ===== Radar (Dish) =====
  const radar = () => svg('0 0 220 200', `
    <ellipse cx="110" cy="184" rx="60" ry="5" fill="rgba(0,0,0,.25)"/>
    <!-- Pole -->
    <rect x="100" y="120" width="20" height="60" fill="#475569"/>
    <!-- Dish -->
    <path d="M40 60 Q40 30 110 30 Q180 30 180 60 L180 100 Q180 130 110 130 Q40 130 40 100 Z"
      fill="#94a3b8" stroke="#475569" stroke-width="2"/>
    <ellipse cx="110" cy="60" rx="60" ry="14" fill="#475569" opacity=".4"/>
    <!-- Feedhorn -->
    <circle cx="110" cy="80" r="10" fill="#0f172a"/>
    <circle cx="110" cy="80" r="5" fill="#22d3ee">
      <animate attributeName="r" values="3;7;3" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <text x="110" y="160" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Radar · 24/77 GHz</text>
  `);

  // ===== Codeschloss (Tastatur an Wand) =====
  const codeKey = () => svg('0 0 200 240', `
    <ellipse cx="100" cy="226" rx="60" ry="6" fill="rgba(0,0,0,.25)"/>
    <rect x="50" y="30" width="100" height="180" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <rect x="62" y="42" width="76" height="34" fill="#22d3ee" opacity=".15"/>
    <rect x="64" y="44" width="72" height="30" fill="#0c0a1a"/>
    <text x="100" y="64" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="monospace">●●●●</text>
    <!-- Keypad -->
    <g>
      ${(()=>{ let r=''; for(let i=0;i<12;i++){
        const c=i%3, ro=Math.floor(i/3);
        const x=62+c*26, y=85+ro*26;
        r+=`<circle cx="${x+13}" cy="${y+13}" r="11" fill="#334155" stroke="#475569" stroke-width=".5"/>`;
        const ch = i===10?'0':i===9?'*':i===11?'#':(i+1);
        r+=`<text x="${x+13}" y="${y+18}" text-anchor="middle" font-size="11" fill="#e2e8f0" font-family="system-ui" font-weight="700">${ch}</text>`;
      } return r; })()}
    </g>
  `);

  // ===== Wassermelder =====
  const wasser = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="60" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="50" y="60" width="100" height="100" rx="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
    <ellipse cx="100" cy="120" rx="40" ry="20" fill="#38bdf8" opacity=".4"/>
    <text x="100" y="125" text-anchor="middle" font-size="22" fill="#0ea5e9">💧</text>
    <text x="100" y="175" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Wasser-/Leckmelder</text>
  `);

  // ===== Ansaugrauchmelder ASD =====
  const asd = () => svg('0 0 220 200', `
    <ellipse cx="110" cy="184" rx="70" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="20" y="40" width="180" height="120" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    <!-- Laser chamber -->
    <rect x="30" y="55" width="80" height="80" rx="3" fill="#1e293b"/>
    <circle cx="50" cy="95" r="6" fill="#ef4444">
      <animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/>
    </circle>
    <text x="50" y="115" text-anchor="middle" font-size="6" fill="#ef4444" font-family="system-ui">LASER</text>
    <!-- Pipe ports -->
    <circle cx="160" cy="80" r="10" fill="#475569" stroke="#94a3b8"/>
    <circle cx="160" cy="110" r="10" fill="#475569" stroke="#94a3b8"/>
    <circle cx="160" cy="140" r="10" fill="#475569" stroke="#94a3b8"/>
    <!-- Display -->
    <rect x="120" y="55" width="60" height="14" fill="#22c55e" opacity=".2"/>
    <text x="150" y="65" text-anchor="middle" font-size="8" fill="#22c55e" font-family="monospace">ASD OK</text>
    <text x="110" y="195" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Ansaugrauchmelder · DIN EN 54-20</text>
  `);

  // ===== Riegelkontakt =====
  const riegel = () => svg('0 0 200 200', `
    <!-- Door edge -->
    <rect x="20" y="40" width="160" height="120" rx="3" fill="#92602a" stroke="#5a3a14" stroke-width="2"/>
    <!-- Lock body -->
    <rect x="80" y="60" width="40" height="80" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Bolt -->
    <rect x="115" y="90" width="30" height="20" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
    <!-- Schließblech with sensor -->
    <rect x="160" y="65" width="20" height="70" fill="#cbd5e0" stroke="#475569" stroke-width="1.5"/>
    <rect x="165" y="90" width="14" height="20" fill="#0f172a"/>
    <circle cx="172" cy="100" r="3" fill="#22c55e">
      <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="100" y="180" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui">Riegel-Schloss-Kontakt · VdS 2269</text>
  `);

  // ===== Schließblechkontakt (alias of riegel) =====
  // ===== Flammenmelder =====
  const flame = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="60" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="60" y="40" width="80" height="120" rx="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
    <!-- UV/IR sensors -->
    <circle cx="78" cy="80" r="12" fill="#1e1b4b" stroke="#7c3aed" stroke-width="1.5"/>
    <text x="78" y="86" text-anchor="middle" font-size="9" fill="#a78bfa" font-weight="700">UV</text>
    <circle cx="122" cy="80" r="12" fill="#1e1b4b" stroke="#ef4444" stroke-width="1.5"/>
    <text x="122" y="86" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">IR</text>
    <!-- LED -->
    <circle cx="100" cy="130" r="5" fill="#fbbf24">
      <animate attributeName="opacity" values="1;.3;1" dur="0.5s" repeatCount="indefinite"/>
    </circle>
    <text x="100" y="175" text-anchor="middle" font-size="7" fill="#64748b" font-family="system-ui">Flammenmelder UV+IR</text>
  `);

  // Mapping detector key -> renderer
  const MAP = {
    'pir-standard': pir, 'pir-vorhang': pirVorhang, 'pir-decke': pirDecke,
    'pir-longrange': pir, 'pir-tierimmun': pir, 'pir-antimask': pir, 'pir-outdoor': pir,
    'magnetkontakt': magnet, 'schliessblech': riegel,
    'mikrowelle': mw, 'dualmelder': dual,
    'ultraschall': mw,  // looks similar enough
    'glas-passiv': glassPassiv, 'glas-aktiv': glassAktiv, 'glas-piezo': piezo,
    'piezo-erschuetterung': piezo, 'koerperschall': piezo, 'seismisch': piezo,
    'kapazitiv': piezo,
    'druckmatte': druckmatte, 'wassermelder': wasser, 'gasmelder': fire,
    'neigung': piezo,
    'ir-schranke': irBeam,
    'rauch-streulicht': fire, 'waerme-max': fire, 'multisensor': fire,
    'asd': asd, 'flammenmelder': flame,
    'zaun-mikro': zaunSensor, 'zaun-fos': zaunSensor,
    'thermalkam': thermal, 'radar': radar, 'lidar': radar, 'erddruck': piezo,
    'kamera': camera, 'sirene': sirene, 'zentrale': zentrale, 'codeschloss': codeKey,
  };

  function render(key) {
    const fn = MAP[key] || pir;
    return fn();
  }

  return { render, MAP };
})();
