/* SVG technical illustrations – animated, theme-aware, inline */
window.ILL = (() => {

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svg(viewBox, content) {
    return `<svg xmlns="${SVG_NS}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" class="ill-svg">${content}</svg>`;
  }

  // ---------- PIR Melder ----------
  const pir = () => svg('0 0 400 240', `
    <defs>
      <linearGradient id="pirCone" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f59e0b" stop-opacity=".75"/>
        <stop offset=".5" stop-color="#fbbf24" stop-opacity=".25"/>
        <stop offset="1" stop-color="#fbbf24" stop-opacity=".08"/>
      </linearGradient>
      <radialGradient id="pirHeat" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#ef4444"/>
        <stop offset="1" stop-color="#ef4444" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Wall + sensor -->
    <rect x="0" y="0" width="20" height="240" fill="#1f3358"/>
    <rect x="20" y="100" width="22" height="36" rx="4" fill="#38bdf8"/>
    <circle cx="36" cy="118" r="6" fill="#0b1424"/>
    <circle cx="36" cy="118" r="3" fill="#22d3ee"/>
    <!-- PIR cone fan -->
    <g opacity=".85">
      <path d="M40,118 L380,30 L380,206 Z" fill="url(#pirCone)"/>
      <line x1="40" y1="118" x2="380" y2="40" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
      <line x1="40" y1="118" x2="380" y2="80" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
      <line x1="40" y1="118" x2="380" y2="118" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
      <line x1="40" y1="118" x2="380" y2="156" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
      <line x1="40" y1="118" x2="380" y2="196" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>
    </g>
    <!-- Person walking through zones -->
    <g class="ill-walker">
      <circle cx="240" cy="160" r="10" fill="url(#pirHeat)" opacity=".6"/>
      <circle cx="240" cy="158" r="8" fill="#e8edf7"/>
      <rect x="234" y="166" width="12" height="22" rx="3" fill="#38bdf8"/>
      <text x="252" y="156" font-size="11" fill="#fbbf24" font-family="system-ui">37°C IR</text>
    </g>
    <!-- Labels -->
    <text x="50" y="146" font-size="10" fill="#94a3c4" font-family="system-ui">PIR-Sensor</text>
    <text x="320" y="216" font-size="11" fill="#fbbf24" font-family="system-ui">12 m</text>
    <text x="50" y="232" font-size="11" fill="#94a3c4" font-family="system-ui">Wärmestrahlung 8–14µm | 90° Sichtfeld</text>
  `);

  // ---------- Mikrowelle / Doppler ----------
  const mw = () => svg('0 0 400 240', `
    <defs>
      <radialGradient id="mwCone" cx="0" cy=".5" r="1">
        <stop offset="0" stop-color="#22d3ee" stop-opacity=".55"/>
        <stop offset=".5" stop-color="#22d3ee" stop-opacity=".18"/>
        <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="20" height="240" fill="#1f3358"/>
    <rect x="20" y="100" width="24" height="40" rx="6" fill="#22d3ee"/>
    <circle cx="44" cy="120" r="3" fill="#0b1424"/>
    <ellipse cx="220" cy="120" rx="200" ry="90" fill="url(#mwCone)"/>
    <!-- Outgoing waves -->
    <g stroke="#22d3ee" stroke-width="1.5" fill="none" opacity=".85">
      <path class="ill-wave w1" d="M50,120 Q90,90 130,120 T210,120 T290,120 T370,120"/>
      <path class="ill-wave w2" d="M50,140 Q90,110 130,140 T210,140 T290,140 T370,140"/>
      <path class="ill-wave w3" d="M50,100 Q90,70 130,100 T210,100 T290,100 T370,100"/>
    </g>
    <!-- Target person moving away (compressed waves return) -->
    <g class="ill-target">
      <ellipse cx="290" cy="120" rx="14" ry="22" fill="#818cf8" opacity=".4"/>
      <circle cx="290" cy="105" r="8" fill="#e8edf7"/>
      <rect x="284" y="115" width="12" height="22" rx="3" fill="#818cf8"/>
      <line x1="306" y1="120" x2="338" y2="120" stroke="#22c55e" stroke-width="2" marker-end="url(#arr)"/>
    </g>
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#22c55e"/>
      </marker>
    </defs>
    <text x="50" y="156" font-size="10" fill="#94a3c4" font-family="system-ui">MW 10,525 GHz</text>
    <text x="220" y="216" font-size="11" fill="#22d3ee" font-family="system-ui" text-anchor="middle">Δf = Doppler-Verschiebung</text>
    <text x="50" y="232" font-size="11" fill="#94a3c4" font-family="system-ui">Reichweite 20×20m | durchdringt Holz/Glas</text>
  `);

  // ---------- Dualmelder ----------
  const dual = () => svg('0 0 400 240', `
    <defs>
      <linearGradient id="dPir" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f59e0b" stop-opacity=".55"/>
        <stop offset="1" stop-color="#fbbf24" stop-opacity=".1"/>
      </linearGradient>
      <linearGradient id="dMw" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#22d3ee" stop-opacity=".5"/>
        <stop offset="1" stop-color="#22d3ee" stop-opacity=".1"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="20" height="240" fill="#1f3358"/>
    <rect x="20" y="92" width="26" height="56" rx="5" fill="url(#dPir)" stroke="#fbbf24"/>
    <circle cx="33" cy="106" r="5" fill="#fbbf24"/>
    <circle cx="33" cy="134" r="5" fill="#22d3ee"/>
    <!-- PIR cone top half -->
    <path d="M46,108 L380,40 L380,118 Z" fill="url(#dPir)"/>
    <!-- MW cone bottom half -->
    <path d="M46,132 L380,122 L380,200 Z" fill="url(#dMw)"/>
    <text x="60" y="60" font-size="11" fill="#fbbf24" font-family="system-ui">PIR (Wärme)</text>
    <text x="60" y="188" font-size="11" fill="#22d3ee" font-family="system-ui">MW (Bewegung)</text>
    <!-- AND gate -->
    <g transform="translate(150,90)">
      <path d="M0,0 L30,0 Q60,0 60,30 Q60,60 30,60 L0,60 Z" fill="#162542" stroke="#22c55e" stroke-width="2"/>
      <text x="30" y="36" text-anchor="middle" font-size="13" fill="#22c55e" font-family="system-ui" font-weight="700">AND</text>
      <line x1="60" y1="30" x2="100" y2="30" stroke="#22c55e" stroke-width="2"/>
      <text x="105" y="34" font-size="12" fill="#22c55e" font-family="system-ui">ALARM</text>
    </g>
    <text x="50" y="232" font-size="11" fill="#94a3c4" font-family="system-ui">Nur wenn BEIDE auslösen → Alarm | −95% Fehlalarme</text>
  `);

  // ---------- Magnetkontakt (Reed) ----------
  const mag = () => svg('0 0 400 240', `
    <defs>
      <radialGradient id="magField" cx=".5" cy=".5" r=".6">
        <stop offset="0" stop-color="#c084fc" stop-opacity=".6"/>
        <stop offset="1" stop-color="#c084fc" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Frame -->
    <rect x="0" y="20" width="170" height="200" fill="#162542" stroke="#1f3358"/>
    <!-- Door (animated) -->
    <g class="ill-door">
      <rect x="170" y="20" width="180" height="200" fill="#0f1a2e" stroke="#1f3358"/>
      <rect x="175" y="30" width="170" height="180" fill="#111c33" stroke="#1f3358" stroke-width=".5"/>
      <circle cx="335" cy="120" r="3" fill="#fbbf24"/>
      <!-- Magnet on door -->
      <rect x="180" y="105" width="22" height="30" rx="3" fill="#c084fc"/>
      <text x="191" y="125" text-anchor="middle" font-size="10" fill="#0b1424" font-family="system-ui" font-weight="700">N</text>
    </g>
    <!-- Reed contact on frame -->
    <rect x="148" y="105" width="22" height="30" rx="3" fill="#38bdf8"/>
    <circle cx="159" cy="120" r="7" fill="url(#magField)"/>
    <!-- two reed switches lines -->
    <line x1="155" y1="115" x2="163" y2="125" stroke="#0b1424" stroke-width="2"/>
    <line x1="155" y1="125" x2="163" y2="115" stroke="#0b1424" stroke-width="2"/>
    <!-- Labels -->
    <text x="78" y="40" font-size="11" fill="#94a3c4" font-family="system-ui" text-anchor="middle">Rahmen</text>
    <text x="260" y="40" font-size="11" fill="#94a3c4" font-family="system-ui" text-anchor="middle">Tür</text>
    <text x="159" y="160" font-size="10" fill="#38bdf8" font-family="system-ui" text-anchor="middle">Reed</text>
    <text x="191" y="160" font-size="10" fill="#c084fc" font-family="system-ui" text-anchor="middle">Magnet</text>
    <!-- Status -->
    <g class="ill-status">
      <rect x="20" y="200" width="100" height="22" rx="4" fill="#0f1a2e" stroke="#22c55e"/>
      <circle cx="32" cy="211" r="4" fill="#22c55e"/>
      <text x="42" y="215" font-size="11" fill="#22c55e" font-family="system-ui">Stromkreis OK</text>
    </g>
  `);

  // ---------- Glasbruchmelder ----------
  const glass = () => svg('0 0 400 240', `
    <defs>
      <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#38bdf8" stop-opacity=".18"/>
        <stop offset="1" stop-color="#22d3ee" stop-opacity=".05"/>
      </linearGradient>
    </defs>
    <!-- Window -->
    <rect x="40" y="30" width="280" height="160" fill="url(#glassG)" stroke="#38bdf8" stroke-width="2"/>
    <line x1="180" y1="30" x2="180" y2="190" stroke="#38bdf8" stroke-width="1" opacity=".6"/>
    <line x1="40" y1="110" x2="320" y2="110" stroke="#38bdf8" stroke-width="1" opacity=".6"/>
    <!-- Crack -->
    <g class="ill-crack" stroke="#ef4444" stroke-width="1.6" fill="none">
      <path d="M210,80 L240,100 L225,130 L255,150 L240,170"/>
      <path d="M240,100 L270,90"/>
      <path d="M225,130 L200,140"/>
      <path d="M255,150 L290,145"/>
    </g>
    <!-- Sensor (passive acoustic on ceiling) -->
    <rect x="170" y="2" width="60" height="22" rx="4" fill="#162542" stroke="#22d3ee"/>
    <circle cx="200" cy="13" r="5" fill="#22d3ee"/>
    <text x="200" y="28" font-size="9" font-family="system-ui" fill="#94a3c4" text-anchor="middle">Akustischer Sensor (6m Radius)</text>
    <!-- Frequency analysis -->
    <g transform="translate(40,200)">
      <text x="0" y="0" font-size="10" fill="#94a3c4" font-family="system-ui">Tieffrequenz (Aufprall)</text>
      <path d="M0,12 Q20,2 40,12 T80,12" stroke="#fbbf24" fill="none" stroke-width="1.5"/>
      <text x="160" y="0" font-size="10" fill="#94a3c4" font-family="system-ui">Hochfrequenz (Splittern)</text>
      <path d="M160,12 q3,-8 6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0" stroke="#ef4444" fill="none" stroke-width="1.5"/>
    </g>
    <text x="180" y="230" font-size="11" fill="#22d3ee" font-family="system-ui" text-anchor="middle">Zwei-Phasen-Analyse → ALARM</text>
  `);

  // ---------- Erschütterung / Körperschall ----------
  const shake = () => svg('0 0 400 240', `
    <rect x="60" y="40" width="180" height="160" rx="6" fill="#162542" stroke="#94a3c4" stroke-width="2"/>
    <text x="150" y="120" text-anchor="middle" font-size="16" fill="#94a3c4" font-family="system-ui" font-weight="700">TRESOR</text>
    <!-- Piezo sensor -->
    <rect x="220" y="100" width="36" height="36" rx="4" fill="#38bdf8"/>
    <text x="238" y="124" text-anchor="middle" font-size="10" fill="#0b1424" font-family="system-ui" font-weight="700">PZT</text>
    <!-- Vibration waves -->
    <g class="ill-shake" stroke="#ef4444" fill="none" stroke-width="1.5">
      <path d="M260,118 q15,-10 30,0 t30,0 t30,0"/>
      <path d="M260,130 q15,8 30,0 t30,0 t30,0"/>
    </g>
    <!-- Drill -->
    <g class="ill-drill" transform="translate(20,110)">
      <rect x="0" y="0" width="50" height="20" rx="2" fill="#fbbf24"/>
      <rect x="50" y="6" width="40" height="8" fill="#94a3c4"/>
    </g>
    <text x="40" y="150" font-size="11" fill="#fbbf24" font-family="system-ui">Bohren / Stemmen</text>
    <text x="280" y="180" font-size="11" fill="#22d3ee" font-family="system-ui" text-anchor="middle">Piezo</text>
    <text x="200" y="225" font-size="11" fill="#94a3c4" font-family="system-ui" text-anchor="middle">Vibration → Spannung → Frequenz-Analyse → ALARM</text>
  `);

  // ---------- IR-Lichtschranke ----------
  const irBeam = () => svg('0 0 400 240', `
    <!-- Sender -->
    <rect x="14" y="50" width="20" height="140" rx="4" fill="#22d3ee"/>
    <text x="24" y="44" font-size="10" fill="#22d3ee" font-family="system-ui" text-anchor="middle">TX</text>
    <!-- Receiver -->
    <rect x="366" y="50" width="20" height="140" rx="4" fill="#38bdf8"/>
    <text x="376" y="44" font-size="10" fill="#38bdf8" font-family="system-ui" text-anchor="middle">RX</text>
    <!-- 4 beams animated -->
    <g class="ill-beams" stroke-width="2.5">
      <line x1="34" y1="70" x2="366" y2="70" stroke="#22d3ee" opacity=".75"/>
      <line x1="34" y1="110" x2="366" y2="110" stroke="#22d3ee" opacity=".75"/>
      <line x1="34" y1="150" x2="366" y2="150" stroke="#22d3ee" opacity=".75"/>
      <line x1="34" y1="190" x2="366" y2="190" stroke="#22d3ee" opacity=".75"/>
    </g>
    <!-- Person blocking beam -->
    <g>
      <ellipse cx="220" cy="170" rx="16" ry="32" fill="#ef4444" opacity=".25"/>
      <circle cx="220" cy="150" r="10" fill="#e8edf7"/>
      <rect x="212" y="160" width="16" height="32" rx="4" fill="#ef4444"/>
      <!-- broken beam segment -->
      <line x1="204" y1="150" x2="236" y2="150" stroke="#ef4444" stroke-width="2"/>
      <text x="220" y="36" font-size="11" fill="#ef4444" font-family="system-ui" text-anchor="middle" font-weight="700">Strahl unterbrochen!</text>
    </g>
    <text x="200" y="225" font-size="11" fill="#94a3c4" font-family="system-ui" text-anchor="middle">Codierte IR-Pulse 940nm | Multi-Strahl-Logik gegen Fehlalarm</text>
  `);

  // ---------- Brandmelder ----------
  const fire = () => svg('0 0 400 240', `
    <!-- Ceiling -->
    <rect x="0" y="0" width="400" height="14" fill="#1f3358"/>
    <!-- Smoke detector -->
    <circle cx="200" cy="34" r="22" fill="#162542" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="200" cy="34" r="14" fill="#0b1424"/>
    <circle cx="200" cy="34" r="3" fill="#ef4444"/>
    <!-- LED beam inside chamber -->
    <line x1="186" y1="34" x2="214" y2="34" stroke="#fbbf24" stroke-width="1"/>
    <text x="200" y="74" font-size="10" fill="#fbbf24" font-family="system-ui" text-anchor="middle">Optisch (Streulicht)</text>
    <!-- Smoke -->
    <g class="ill-smoke" fill="#94a3c4" opacity=".5">
      <circle cx="170" cy="110" r="14"/>
      <circle cx="195" cy="100" r="18"/>
      <circle cx="225" cy="115" r="15"/>
      <circle cx="215" cy="135" r="20"/>
      <circle cx="180" cy="140" r="16"/>
    </g>
    <!-- Fire below -->
    <g class="ill-flame">
      <path d="M190,200 Q170,160 200,140 Q220,170 210,200 Z" fill="#ef4444"/>
      <path d="M195,200 Q180,170 200,155 Q215,175 205,200 Z" fill="#fbbf24"/>
    </g>
    <!-- Floor -->
    <rect x="0" y="218" width="400" height="22" fill="#1f3358"/>
    <text x="200" y="232" font-size="11" fill="#94a3c4" font-family="system-ui" text-anchor="middle">DIN EN 54-7 | Tyndall-Effekt: Rauchpartikel streuen LED-Licht</text>
  `);

  // ---------- Zaunsensor / Perimeter ----------
  const fence = () => svg('0 0 400 240', `
    <!-- Sky -->
    <rect x="0" y="0" width="400" height="160" fill="url(#sky)"/>
    <defs>
      <linearGradient id="sky" x2="0" y2="1">
        <stop offset="0" stop-color="#162542"/>
        <stop offset="1" stop-color="#0b1424"/>
      </linearGradient>
    </defs>
    <!-- Ground -->
    <rect x="0" y="160" width="400" height="80" fill="#1f3358"/>
    <!-- Fence -->
    <g stroke="#94a3c4" stroke-width="1.5">
      <line x1="40" y1="160" x2="40" y2="60"/>
      <line x1="120" y1="160" x2="120" y2="60"/>
      <line x1="200" y1="160" x2="200" y2="60"/>
      <line x1="280" y1="160" x2="280" y2="60"/>
      <line x1="360" y1="160" x2="360" y2="60"/>
      <line x1="40" y1="80" x2="360" y2="80" stroke-dasharray="6 4"/>
      <line x1="40" y1="110" x2="360" y2="110" stroke-dasharray="6 4"/>
      <line x1="40" y1="140" x2="360" y2="140" stroke-dasharray="6 4"/>
    </g>
    <!-- Sensor cable on fence (highlighted) -->
    <path d="M40,70 L120,70 L200,70 L280,70 L360,70" stroke="#22d3ee" stroke-width="3" fill="none" class="ill-sensor-cable"/>
    <circle cx="40" cy="70" r="4" fill="#22d3ee"/>
    <circle cx="360" cy="70" r="4" fill="#22d3ee"/>
    <!-- Intruder climbing -->
    <g class="ill-intruder" transform="translate(180,98)">
      <circle cx="20" cy="0" r="8" fill="#ef4444"/>
      <rect x="14" y="8" width="12" height="22" rx="3" fill="#ef4444"/>
      <line x1="20" y1="14" x2="32" y2="6" stroke="#ef4444" stroke-width="2"/>
      <line x1="20" y1="20" x2="8" y2="14" stroke="#ef4444" stroke-width="2"/>
    </g>
    <!-- Vibration burst -->
    <g class="ill-vib" stroke="#fbbf24" fill="none" stroke-width="1.5" opacity=".8">
      <circle cx="200" cy="70" r="20"/>
      <circle cx="200" cy="70" r="32"/>
      <circle cx="200" cy="70" r="44"/>
    </g>
    <text x="200" y="50" font-size="11" font-family="system-ui" fill="#22d3ee" text-anchor="middle">Mikrophonisches Zaunmeldesystem</text>
    <text x="200" y="230" font-size="11" font-family="system-ui" fill="#94a3c4" text-anchor="middle">Detektiert Schneiden/Klettern · 600 m/Zone · VdS 2358</text>
  `);

  // ---------- Spezial - Druckmatte ----------
  const press = () => svg('0 0 400 240', `
    <!-- Floor -->
    <rect x="0" y="170" width="400" height="70" fill="#162542"/>
    <!-- Mat -->
    <rect x="80" y="160" width="240" height="14" rx="2" fill="#38bdf8" opacity=".7"/>
    <rect x="80" y="155" width="240" height="6" fill="#22d3ee"/>
    <!-- Footprints -->
    <g class="ill-foot" fill="#fbbf24" opacity=".8">
      <ellipse cx="160" cy="166" rx="14" ry="6"/>
      <ellipse cx="220" cy="166" rx="14" ry="6"/>
    </g>
    <!-- Compression arrows -->
    <g stroke="#ef4444" stroke-width="2" fill="none">
      <line x1="160" y1="138" x2="160" y2="158" marker-end="url(#a2)"/>
      <line x1="220" y1="138" x2="220" y2="158" marker-end="url(#a2)"/>
    </g>
    <defs>
      <marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/>
      </marker>
    </defs>
    <!-- Person on mat -->
    <g>
      <circle cx="190" cy="80" r="14" fill="#e8edf7"/>
      <rect x="178" y="92" width="24" height="48" rx="6" fill="#94a3c4"/>
      <line x1="178" y1="100" x2="160" y2="118" stroke="#94a3c4" stroke-width="6" stroke-linecap="round"/>
      <line x1="202" y1="100" x2="220" y2="118" stroke="#94a3c4" stroke-width="6" stroke-linecap="round"/>
    </g>
    <text x="200" y="200" font-size="11" font-family="system-ui" fill="#22d3ee" text-anchor="middle">Kontaktfolien unter Belag</text>
    <text x="200" y="225" font-size="11" font-family="system-ui" fill="#94a3c4" text-anchor="middle">Unsichtbar unter Teppich/Fliesen · SÜ 4-6</text>
  `);

  // ---------- Kapazitiv ----------
  const cap = () => svg('0 0 400 240', `
    <defs>
      <radialGradient id="capF" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#c084fc" stop-opacity=".05"/>
        <stop offset=".7" stop-color="#c084fc" stop-opacity=".4"/>
        <stop offset="1" stop-color="#c084fc" stop-opacity=".1"/>
      </radialGradient>
    </defs>
    <!-- Vase / Sculpture -->
    <rect x="140" y="60" width="120" height="160" rx="8" fill="#162542" stroke="#c084fc" stroke-width="2"/>
    <text x="200" y="146" text-anchor="middle" font-size="14" fill="#c084fc" font-family="system-ui" font-weight="700">VITRINE</text>
    <!-- Field rings -->
    <g fill="none" stroke="#c084fc" opacity=".5" stroke-width="1.2" class="ill-cap-field">
      <ellipse cx="200" cy="140" rx="80" ry="100"/>
      <ellipse cx="200" cy="140" rx="100" ry="120"/>
      <ellipse cx="200" cy="140" rx="120" ry="138"/>
    </g>
    <!-- Hand approaching -->
    <g class="ill-hand" transform="translate(340,140)">
      <path d="M0,0 L-30,-10 L-30,20 Z" fill="#fbbf24"/>
      <rect x="-30" y="-4" width="-25" height="14" rx="3" fill="#fbbf24"/>
    </g>
    <text x="320" y="170" font-size="10" font-family="system-ui" fill="#fbbf24" text-anchor="middle">Annäherung</text>
    <text x="200" y="232" font-size="11" font-family="system-ui" fill="#94a3c4" text-anchor="middle">Alarm VOR Berührung · Elektrostatisches Feld</text>
  `);

  // ---------- Onion zones (animated, with labels) ----------
  const onionAnim = () => svg('0 0 400 400', `
    <defs>
      <radialGradient id="oncore" cx=".5" cy=".5">
        <stop offset="0" stop-color="#fbbf24"/>
        <stop offset="1" stop-color="#ef4444"/>
      </radialGradient>
    </defs>
    <g class="onion-pulse">
      <circle cx="200" cy="200" r="180" fill="rgba(56,189,248,.08)" stroke="rgba(56,189,248,.5)" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="140" fill="rgba(129,140,248,.10)" stroke="rgba(129,140,248,.5)" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="100" fill="rgba(192,132,252,.12)" stroke="rgba(192,132,252,.5)" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="60"  fill="rgba(244,114,182,.16)" stroke="rgba(244,114,182,.6)" stroke-width="1.5"/>
    </g>
    <circle cx="200" cy="200" r="28" fill="url(#oncore)"/>
    <text x="200" y="206" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="800" fill="#0b1424">WERT</text>
    <text x="200" y="30" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="700" fill="#38bdf8" letter-spacing="2">ZONE 1 · PERIMETER</text>
    <text x="200" y="68" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="700" fill="#818cf8" letter-spacing="2">ZONE 2 · AUSSENHAUT</text>
    <text x="200" y="106" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="700" fill="#c084fc" letter-spacing="2">ZONE 3 · INNENRAUM</text>
    <text x="200" y="148" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="700" fill="#f472b6" letter-spacing="2">ZONE 4 · OBJEKT</text>
  `);

  // ---------- House cutaway (interactive zone map) ----------
  const houseMap = () => svg('0 0 600 320', `
    <defs>
      <linearGradient id="ground" x2="0" y2="1">
        <stop offset="0" stop-color="#1f3358"/>
        <stop offset="1" stop-color="#0f1a2e"/>
      </linearGradient>
    </defs>
    <!-- Sky -->
    <rect width="600" height="320" fill="#0b1424"/>
    <!-- Ground -->
    <rect y="240" width="600" height="80" fill="url(#ground)"/>
    <!-- Fence (Zone 1) -->
    <g data-zone="1" class="z-clk">
      <line x1="40" y1="240" x2="40" y2="200" stroke="#38bdf8" stroke-width="2"/>
      <line x1="40" y1="200" x2="560" y2="200" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 3"/>
      <line x1="560" y1="240" x2="560" y2="200" stroke="#38bdf8" stroke-width="2"/>
      <text x="50" y="194" font-family="system-ui" font-size="10" fill="#38bdf8">ZONE 1 · PERIMETER</text>
    </g>
    <!-- House body (Zone 2) -->
    <g data-zone="2" class="z-clk">
      <polygon points="160,240 160,140 300,80 440,140 440,240" fill="#162542" stroke="#818cf8" stroke-width="2"/>
      <text x="300" y="74" font-family="system-ui" font-size="11" fill="#818cf8" text-anchor="middle">ZONE 2 · AUSSENHAUT</text>
    </g>
    <!-- Interior rooms (Zone 3) -->
    <g data-zone="3" class="z-clk">
      <rect x="180" y="160" width="100" height="80" fill="#0f1a2e" stroke="#c084fc"/>
      <rect x="320" y="160" width="100" height="80" fill="#0f1a2e" stroke="#c084fc"/>
      <line x1="280" y1="200" x2="320" y2="200" stroke="#c084fc"/>
      <text x="230" y="200" text-anchor="middle" font-family="system-ui" font-size="10" fill="#c084fc">RAUM</text>
      <text x="370" y="200" text-anchor="middle" font-family="system-ui" font-size="10" fill="#c084fc">RAUM</text>
    </g>
    <!-- Vault (Zone 4) -->
    <g data-zone="4" class="z-clk">
      <rect x="370" y="186" width="44" height="50" fill="#f472b6" stroke="#f472b6" opacity=".9"/>
      <rect x="378" y="194" width="28" height="34" fill="#162542"/>
      <circle cx="392" cy="211" r="4" fill="#fbbf24"/>
      <text x="392" y="248" text-anchor="middle" font-family="system-ui" font-size="9" fill="#f472b6">ZONE 4</text>
    </g>
    <!-- Door -->
    <rect x="290" y="190" width="20" height="50" fill="#0b1424" stroke="#94a3c4"/>
    <!-- Window -->
    <rect x="200" y="180" width="22" height="20" fill="#38bdf8" opacity=".4" stroke="#94a3c4"/>
    <rect x="360" y="180" width="22" height="20" fill="#38bdf8" opacity=".4" stroke="#94a3c4"/>
    <!-- Sensors visualization -->
    <g class="ill-house-sensors">
      <!-- Outdoor PIR -->
      <circle cx="160" cy="138" r="4" fill="#fbbf24"/>
      <path d="M160,138 L100,170 L100,200 L160,180 Z" fill="#fbbf24" opacity=".25"/>
      <!-- Indoor PIR -->
      <circle cx="278" cy="165" r="3" fill="#22d3ee"/>
      <path d="M278,165 L220,210 L220,230 Z" fill="#22d3ee" opacity=".25"/>
      <!-- Magnet -->
      <circle cx="295" cy="194" r="3" fill="#c084fc"/>
      <!-- Glass -->
      <circle cx="370" cy="180" r="3" fill="#38bdf8"/>
    </g>
  `);

  // Helper: wrap a SVG string into a container element
  function asNode(svgString) {
    const wrap = document.createElement('div');
    wrap.className = 'ill-wrap';
    wrap.innerHTML = svgString;
    return wrap;
  }

  return { pir, mw, dual, mag, glass, shake, irBeam, fire, fence, press, cap, onionAnim, houseMap, asNode };
})();
