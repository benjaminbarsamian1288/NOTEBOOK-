/* Explainer-"Videos" – langsame, deutlich animierte Sequenzen mit SMIL-Loop-Animationen */
window.EXPL = (() => {
  const { el } = U;

  /* Inline SMIL building helpers */
  // Continuous motion: walker/drill etc.
  // We use both SMIL <animate> inside SVG (for continuous motion) AND step-based opacity reveals.

  const EXPLAINERS = {

    // ============== PIR ==============
    'pir-standard': {
      title: 'PIR-Melder · Funktionsprinzip',
      intro: 'Passiv-Infrarot · Erfasst Wärmestrahlung 8–14 µm bewegter Wärmequellen',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="pirZone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#fbbf24" stop-opacity=".7"/>
              <stop offset="1" stop-color="#fbbf24" stop-opacity=".05"/>
            </linearGradient>
            <radialGradient id="pirHeatGrad" cx=".5" cy=".5" r=".5">
              <stop offset="0" stop-color="#ef4444"/>
              <stop offset="1" stop-color="#ef4444" stop-opacity="0"/>
            </radialGradient>
            <filter id="pirGlow"><feGaussianBlur stdDeviation="2"/></filter>
          </defs>

          <!-- Wall -->
          <rect x="0" y="0" width="22" height="340" fill="#1f3358"/>

          <!-- Sensor housing (always visible) -->
          <g id="sensor-housing">
            <rect x="22" y="148" width="32" height="50" rx="6" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="38" cy="172" r="9" fill="#0b1424"/>
            <circle id="sensor-eye" cx="38" cy="172" r="5" fill="#22d3ee">
              <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="38" y="220" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">PIR-Sensor</text>
          </g>

          <!-- Fresnel lens zones -->
          <g id="fresnel" opacity="0">
            <path d="M54,172 L580,40 L580,90 Z" fill="url(#pirZone)" opacity=".6"/>
            <path d="M54,172 L580,100 L580,140 Z" fill="url(#pirZone)" opacity=".6"/>
            <path d="M54,172 L580,150 L580,190 Z" fill="url(#pirZone)" opacity=".6"/>
            <path d="M54,172 L580,200 L580,240 Z" fill="url(#pirZone)" opacity=".6"/>
            <path d="M54,172 L580,250 L580,300 Z" fill="url(#pirZone)" opacity=".6"/>
          </g>
          <text id="fresnel-label" x="320" y="24" font-size="13" fill="#fbbf24" font-family="system-ui" text-anchor="middle" opacity="0" font-weight="600">⌖ Fresnel-Linse teilt Sichtfeld in Zonen</text>

          <!-- Walker (always present but invisible until step 3, then auto-walks via SMIL) -->
          <g id="walker" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                from="570 240" to="120 240"
                begin="walker.click; 0s" dur="9s" repeatCount="indefinite"/>
              <circle cx="0" cy="0" r="18" fill="url(#pirHeatGrad)" opacity=".6"/>
              <circle cx="0" cy="-4" r="11" fill="#e8edf7"/>
              <rect x="-9" y="4" width="18" height="32" rx="4" fill="#38bdf8"/>
              <text x="22" y="-12" font-size="13" fill="#fbbf24" font-family="system-ui" font-weight="600">37°C IR</text>
              <!-- IR rays -->
              <g opacity=".8">
                <path d="M-22,-4 L-30,-12" stroke="#ef4444" stroke-width="1.6"/>
                <path d="M-22,0 L-32,0" stroke="#ef4444" stroke-width="1.6"/>
                <path d="M-22,4 L-30,12" stroke="#ef4444" stroke-width="1.6"/>
                <path d="M22,-4 L30,-12" stroke="#ef4444" stroke-width="1.6"/>
                <path d="M22,0 L32,0" stroke="#ef4444" stroke-width="1.6"/>
                <path d="M22,4 L30,12" stroke="#ef4444" stroke-width="1.6"/>
              </g>
            </g>
          </g>

          <!-- Pyro element close-up -->
          <g id="pyro" transform="translate(80, 280)" opacity="0">
            <rect x="0" y="0" width="240" height="50" rx="6" fill="#162542" stroke="#94a3c4"/>
            <text x="120" y="14" font-size="10" fill="#94a3c4" font-family="system-ui" text-anchor="middle" font-weight="600">PYROELEKTRISCHES ELEMENT (LiTaO₃)</text>
            <rect x="10" y="20" width="105" height="24" fill="#0b1424" stroke="#fbbf24"/>
            <text x="62" y="38" font-size="14" fill="#fbbf24" font-family="system-ui" text-anchor="middle" font-weight="800">+
              <animate attributeName="opacity" values="1;.3;1" dur="1.2s" repeatCount="indefinite"/>
            </text>
            <rect x="125" y="20" width="105" height="24" fill="#0b1424" stroke="#fbbf24"/>
            <text x="177" y="38" font-size="14" fill="#fbbf24" font-family="system-ui" text-anchor="middle" font-weight="800">−
              <animate attributeName="opacity" values=".3;1;.3" dur="1.2s" repeatCount="indefinite"/>
            </text>
          </g>

          <!-- Voltage diagram -->
          <g id="voltage" transform="translate(340, 280)" opacity="0">
            <rect x="0" y="0" width="240" height="50" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="120" y="14" font-size="10" fill="#22c55e" font-family="system-ui" text-anchor="middle" font-weight="700">Δ-SPANNUNG</text>
            <path d="M10,38 Q40,38 60,22 T130,38 T200,38 T230,38" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round">
              <animate attributeName="stroke-dasharray" values="0,400;400,0" dur="2.5s" repeatCount="indefinite"/>
            </path>
          </g>

          <!-- Alarm flash -->
          <g id="alarm" opacity="0">
            <rect x="240" y="50" width="140" height="38" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="310" y="74" text-anchor="middle" font-size="16" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['sensor-housing'],            text: '① Der PIR-Sensor (Passiv-Infrarot) sitzt an der Wand und schaut in den Raum. Er sendet KEINE Strahlung aus — er empfängt nur.' },
        { t: 3500,  h: ['fresnel', 'fresnel-label'], text: '② Die Fresnel-Linse vor dem Sensor teilt das Sichtfeld in viele schmale Erfassungs-Zonen (typisch 5–15 Zonen bei 90° Winkel).' },
        { t: 7000,  h: ['walker'],                    text: '③ Ein Mensch (Körpertemperatur ~37 °C) strahlt unsichtbares Infrarot 8–14 µm ab und bewegt sich durch die Zonen.' },
        { t: 10500, h: ['pyro'],                      text: '④ Das pyroelektrische Element (LiTaO₃-Kristall) besteht aus zwei gegenpolig geschalteten Feldern: + und −.' },
        { t: 14000, h: ['voltage'],                   text: '⑤ Tritt die Wärmequelle nacheinander in die Zonen, entsteht eine wechselnde Spannungsdifferenz (Δ-Signal) am Ausgang.' },
        { t: 17500, h: ['alarm'],                     text: '⑥ Der Signalprozessor erkennt Amplitude und Frequenz des Δ-Signals → bei Bewegungs-Muster: ALARM!' },
      ],
      cycle: 21000,
    },

    // ============== MIKROWELLE ==============
    'mikrowelle': {
      title: 'Mikrowellenmelder · Doppler-Radar',
      intro: 'Aktiver Sensor · 10,525 GHz · Frequenz-Verschiebung erkennt Bewegung',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="0" y="0" width="22" height="340" fill="#1f3358"/>

          <!-- Sensor -->
          <g id="mw-sensor">
            <rect x="22" y="150" width="36" height="55" rx="6" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="40" cy="180" r="6" fill="#22d3ee">
              <animate attributeName="r" values="6;9;6" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="40" y="222" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">10,525 GHz</text>
          </g>

          <!-- Outgoing waves (continuous) -->
          <g id="mw-out" opacity="0" stroke="#22d3ee" stroke-width="2.2" fill="none">
            <path d="M58,180 Q100,150 150,180 T250,180 T350,180 T450,180 T560,180" stroke-dasharray="200" stroke-dashoffset="0">
              <animate attributeName="stroke-dashoffset" values="200;-200" dur="2s" repeatCount="indefinite"/>
            </path>
            <path d="M58,160 Q100,130 150,160 T250,160 T350,160 T450,160 T560,160" opacity=".7" stroke-dasharray="200">
              <animate attributeName="stroke-dashoffset" values="200;-200" dur="2.2s" repeatCount="indefinite"/>
            </path>
            <path d="M58,200 Q100,170 150,200 T250,200 T350,200 T450,200 T560,200" opacity=".7" stroke-dasharray="200">
              <animate attributeName="stroke-dashoffset" values="200;-200" dur="2.4s" repeatCount="indefinite"/>
            </path>
          </g>
          <text id="mw-out-label" x="300" y="90" text-anchor="middle" font-size="14" fill="#22d3ee" font-family="system-ui" font-weight="600" opacity="0">f₀ = 10,525 GHz</text>

          <!-- Static reflection -->
          <g id="mw-static" opacity="0">
            <rect x="450" y="130" width="55" height="100" fill="#94a3c4"/>
            <text x="477" y="125" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui">WAND</text>
            <path d="M450,180 Q400,150 350,180 T250,180 T150,180 T54,180" stroke="#94a3c4" stroke-width="2" stroke-dasharray="4 4" fill="none"/>
            <text x="300" y="280" text-anchor="middle" font-size="12" fill="#94a3c4" font-family="system-ui">f₁ = f₀ · gleiche Frequenz → KEIN Signal</text>
          </g>

          <!-- Moving person + compressed reflection -->
          <g id="mw-moving" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                from="450 220" to="200 220" dur="8s" repeatCount="indefinite"/>
              <circle cx="0" cy="-10" r="12" fill="#e8edf7"/>
              <rect x="-9" y="2" width="18" height="32" rx="4" fill="#818cf8"/>
              <text x="0" y="-26" font-size="14" fill="#818cf8" font-family="system-ui" text-anchor="middle">←</text>
            </g>
            <path d="M200,180 q-25,-22 -50,0 q-25,22 -50,0 q-25,-22 -50,0 q-25,22 -50,0" stroke="#ef4444" stroke-width="2.2" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-50" dur="0.8s" repeatCount="indefinite"/>
            </path>
            <text x="300" y="305" text-anchor="middle" font-size="13" fill="#ef4444" font-family="system-ui" font-weight="600">f₁ ≠ f₀ → Δf = Doppler-Verschiebung!</text>
          </g>

          <!-- Mixer -->
          <g id="mw-mixer" opacity="0">
            <rect x="380" y="60" width="180" height="56" rx="8" fill="#162542" stroke="#22c55e" stroke-width="2"/>
            <text x="470" y="84" text-anchor="middle" font-size="13" fill="#22c55e" font-family="system-ui" font-weight="800">⨯ Mischer</text>
            <text x="470" y="104" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui">f₁ − f₀ = Bewegungssignal</text>
          </g>

          <!-- Alarm -->
          <g id="mw-alarm" opacity="0">
            <rect x="380" y="14" width="180" height="38" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="470" y="38" text-anchor="middle" font-size="16" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['mw-sensor'],                  text: '① Der MW-Melder ist AKTIV — er sendet permanent Mikrowellen bei 10,525 GHz im X-Band aus.' },
        { t: 3500,  h: ['mw-out', 'mw-out-label'],     text: '② Die Wellen breiten sich in den Raum aus mit der konstanten Sende-Frequenz f₀.' },
        { t: 7000,  h: ['mw-static'],                  text: '③ Ruhende Objekte (Wand, Möbel) reflektieren mit IDENTISCHER Frequenz f₁ = f₀ → kein Bewegungssignal.' },
        { t: 10500, h: ['mw-moving'],                  text: '④ Ein bewegtes Objekt reflektiert mit VERSCHOBENER Frequenz — der Doppler-Effekt. Δf ist proportional zur Geschwindigkeit.' },
        { t: 14000, h: ['mw-mixer'],                   text: '⑤ Der Mischer subtrahiert die Frequenzen: f₁ − f₀ = Δf = Bewegungssignal.' },
        { t: 17500, h: ['mw-alarm'],                   text: '⑥ Die Auswerteinheit erkennt das Bewegungs-Muster → ALARM!' },
      ],
      cycle: 21000,
    },

    // ============== DUALMELDER ==============
    'dualmelder': {
      title: 'Dualmelder · PIR + MW · AND-Verknüpfung',
      intro: 'Zwei unabhängige Sensoren · −95 % Fehlalarme durch AND-Logik',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="0" y="0" width="22" height="340" fill="#1f3358"/>

          <!-- Sensor with TWO eyes -->
          <g id="dual-sensor">
            <rect x="22" y="130" width="46" height="90" rx="6" fill="#162542" stroke="#94a3c4" stroke-width="2"/>
            <circle id="d-pir" cx="45" cy="150" r="8" fill="#fbbf24">
              <animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="80" y="153" font-size="10" fill="#fbbf24" font-family="system-ui" font-weight="600">PIR</text>
            <circle id="d-mw"  cx="45" cy="200" r="8" fill="#22d3ee">
              <animate attributeName="opacity" values=".3;1;.3" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="80" y="204" font-size="10" fill="#22d3ee" font-family="system-ui" font-weight="600">MW</text>
            <text x="45" y="238" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">Dualmelder</text>
          </g>

          <!-- Two cones -->
          <g id="dual-pir-cone" opacity="0">
            <path d="M68,150 L560,40 L560,150 Z" fill="#fbbf24" opacity=".25"/>
            <text x="540" y="100" text-anchor="end" font-size="13" fill="#fbbf24" font-family="system-ui" font-weight="600">PIR (Wärme)</text>
          </g>
          <g id="dual-mw-cone" opacity="0">
            <path d="M68,200 L560,170 L560,290 Z" fill="#22d3ee" opacity=".25"/>
            <text x="540" y="255" text-anchor="end" font-size="13" fill="#22d3ee" font-family="system-ui" font-weight="600">MW (Bewegung)</text>
          </g>

          <!-- AND-Gate -->
          <g id="dual-and" transform="translate(290, 100)" opacity="0">
            <path d="M0,0 L40,0 Q90,0 90,50 Q90,100 40,100 L0,100 Z" fill="#162542" stroke="#22c55e" stroke-width="2.5"/>
            <text x="45" y="58" text-anchor="middle" font-size="20" font-family="system-ui" font-weight="800" fill="#22c55e">AND</text>
            <line x1="-50" y1="20" x2="0" y2="20" stroke="#fbbf24" stroke-width="2.5"/>
            <line x1="-50" y1="80" x2="0" y2="80" stroke="#22d3ee" stroke-width="2.5"/>
            <line x1="90" y1="50" x2="170" y2="50" stroke="#22c55e" stroke-width="2.5"/>
            <text id="d-pir-state" x="-58" y="14" text-anchor="end" font-size="11" fill="#fbbf24" font-family="monospace" font-weight="700">0</text>
            <text id="d-mw-state"  x="-58" y="74" text-anchor="end" font-size="11" fill="#22d3ee" font-family="monospace" font-weight="700">0</text>
            <text id="d-out-state" x="180" y="44" font-size="12" fill="#22c55e" font-family="monospace" font-weight="700">→ 0</text>
          </g>

          <!-- Case 1: heat only -->
          <g id="d-case1" opacity="0">
            <circle cx="470" cy="105" r="24" fill="#ef4444">
              <animate attributeName="r" values="22;26;22" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="470" y="148" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui">Heizkörper</text>
            <text x="470" y="162" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">Wärme, keine Bewegung</text>
            <text x="470" y="180" text-anchor="middle" font-size="12" fill="#94a3c4" font-family="system-ui">PIR=1, MW=0 → KEIN Alarm</text>
          </g>

          <!-- Case 2: motion only -->
          <g id="d-case2" opacity="0">
            <path d="M460,90 q15,15 0,40 q-15,15 0,40 q15,15 0,30" stroke="#94a3c4" stroke-width="3.5" fill="none">
              <animateTransform attributeName="transform" type="translate" values="0,0; 10,0; 0,0" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <text x="460" y="230" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui">Vorhang im Wind</text>
            <text x="460" y="244" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">Bewegung, kalt</text>
            <text x="460" y="262" text-anchor="middle" font-size="12" fill="#94a3c4" font-family="system-ui">PIR=0, MW=1 → KEIN Alarm</text>
          </g>

          <!-- Case 3: real intruder -->
          <g id="d-case3" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="500,200; 380,200; 500,200" dur="6s" repeatCount="indefinite"/>
              <circle cx="0" cy="-12" r="12" fill="#e8edf7"/>
              <rect x="-9" y="0" width="18" height="32" rx="4" fill="#ef4444"/>
              <circle cx="0" cy="-12" r="22" fill="#ef4444" opacity=".15"/>
            </g>
            <text x="440" y="290" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="600">Einbrecher · Wärme + Bewegung</text>
            <text x="440" y="306" text-anchor="middle" font-size="12" fill="#ef4444" font-family="system-ui" font-weight="700">PIR=1 AND MW=1 → ALARM!</text>
          </g>

          <!-- Final alarm -->
          <g id="d-alarm" opacity="0">
            <rect x="240" y="20" width="140" height="38" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="310" y="44" text-anchor="middle" font-size="16" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['dual-sensor'],                                  text: '① Der Dualmelder hat ZWEI Sensoren in einem Gehäuse: oben PIR (Wärme), unten Mikrowelle (Bewegung).' },
        { t: 3500,  h: ['dual-pir-cone', 'dual-mw-cone'],                text: '② Beide Sensoren erfassen das gleiche Raumvolumen — aber jeder mit seiner eigenen Physik.' },
        { t: 7000,  h: ['dual-and'],                                     text: '③ Die Ausgänge werden mit AND verknüpft. Alarm gibt es NUR wenn BEIDE gleichzeitig auslösen.' },
        { t: 10500, h: ['d-case1'],                                      text: '④ Test 1: Heizkörper sendet IR → PIR=1, aber keine Bewegung → MW=0. 1 AND 0 = 0. KEIN Alarm.' },
        { t: 14000, h: ['d-case2'],                                      text: '⑤ Test 2: Vorhang bewegt sich → MW=1, aber keine Wärme → PIR=0. 0 AND 1 = 0. KEIN Alarm.' },
        { t: 17500, h: ['d-case3', 'd-alarm'],                           text: '⑥ Test 3: Echter Einbrecher: Wärme UND Bewegung → PIR=1 AND MW=1 = 1 → ALARM! 95 % weniger Fehlalarme.' },
      ],
      cycle: 22000,
    },

    // ============== MAGNETKONTAKT ==============
    'magnetkontakt': {
      title: 'Magnetkontakt · Reed-Schalter',
      intro: 'Ruhestrom-Prinzip · Permanentmagnet schließt Reed-Kontakt',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <radialGradient id="magField" cx=".5" cy=".5" r=".5">
              <stop offset="0" stop-color="#c084fc" stop-opacity=".9"/>
              <stop offset="1" stop-color="#c084fc" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Frame -->
          <rect x="0" y="50" width="240" height="240" fill="#162542" stroke="#1f3358"/>
          <text x="120" y="44" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui" font-weight="600">RAHMEN (fest)</text>

          <!-- Reed contact -->
          <g id="reed">
            <rect x="210" y="150" width="32" height="42" rx="4" fill="#162542" stroke="#22d3ee" stroke-width="2.5"/>
            <text x="226" y="212" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">REED</text>
            <g id="reed-contacts">
              <line x1="218" y1="158" x2="234" y2="186" stroke="#fbbf24" stroke-width="2"/>
              <line x1="234" y1="158" x2="218" y2="186" stroke="#fbbf24" stroke-width="2"/>
            </g>
          </g>

          <!-- Door (animated open/close cycle) -->
          <g id="door">
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0,0; 80,0; 80,0; 0,0" keyTimes="0; 0.4; 0.55; 0.75; 1"
              dur="14s" repeatCount="indefinite"/>
            <rect x="240" y="50" width="240" height="240" fill="#0f1a2e" stroke="#1f3358"/>
            <rect x="250" y="60" width="220" height="220" fill="#111c33"/>
            <circle cx="460" cy="170" r="6" fill="#fbbf24"/>
            <text x="360" y="44" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui" font-weight="600">TÜR (beweglich)</text>

            <!-- Magnet -->
            <g id="magnet">
              <rect x="248" y="160" width="28" height="34" rx="3" fill="#c084fc"/>
              <text x="262" y="180" text-anchor="middle" font-size="13" fill="#0b1424" font-family="system-ui" font-weight="800">N</text>
              <text x="262" y="205" text-anchor="middle" font-size="10" fill="#c084fc" font-family="system-ui">Magnet</text>
            </g>
            <circle id="mag-field" cx="225" cy="170" r="28" fill="url(#magField)">
              <animate attributeName="r" values="22;30;22" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Circuit indicator -->
          <g id="circuit" transform="translate(30, 280)">
            <rect x="0" y="0" width="200" height="55" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="100" y="18" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">STROMKREIS</text>
            <text id="circuit-status" x="100" y="40" text-anchor="middle" font-size="15" fill="#22c55e" font-family="system-ui" font-weight="800">GESCHLOSSEN ✓</text>
          </g>

          <!-- Alarm box (appears when door open) -->
          <g id="reed-alarm" transform="translate(270, 280)" opacity="0">
            <rect x="0" y="0" width="220" height="55" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="110" y="36" text-anchor="middle" font-size="16" fill="white" font-family="system-ui" font-weight="800">⚠ EINBRUCH-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['reed','magnet'],          text: '① Reed-Kontakt im Türrahmen + Permanentmagnet an der Tür. Beide gegenüber positioniert, wenn die Tür zu ist.' },
        { t: 4000,  h: ['mag-field'],              text: '② Bei geschlossener Tür erreicht das Magnetfeld den Reed-Kontakt → die magnetischen Zungen schließen sich.' },
        { t: 8000,  h: ['circuit'],                text: '③ Stromkreis geschlossen, Ruhestrom fließt permanent. EMA-Zentrale sieht alles OK.' },
        { t: 12000, h: ['door'],                   text: '④ Tür wird geöffnet → Magnet entfernt sich → das Magnetfeld am Reed verschwindet.' },
        { t: 16000, h: ['circuit','reed-alarm'],   text: '⑤ Reed-Zungen federn auseinander → Stromkreis unterbrochen → sofort ALARM. Auch bei Kabelriss oder Sabotage.' },
      ],
      cycle: 20000,
    },

    // ============== GLASBRUCH (Passiv-akustisch) ==============
    'glas-passiv': {
      title: 'Passiv-akustischer Glasbruchmelder',
      intro: 'Zwei-Phasen-Analyse: Tieffrequenz + Hochfrequenz',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="gpg" x2="0" y2="1">
              <stop offset="0" stop-color="#38bdf8" stop-opacity=".25"/>
              <stop offset="1" stop-color="#22d3ee" stop-opacity=".05"/>
            </linearGradient>
          </defs>

          <!-- Window pane -->
          <rect x="60" y="60" width="330" height="200" fill="url(#gpg)" stroke="#38bdf8" stroke-width="2.5"/>
          <line x1="225" y1="60" x2="225" y2="260" stroke="#38bdf8" opacity=".6"/>
          <line x1="60" y1="160" x2="390" y2="160" stroke="#38bdf8" opacity=".6"/>

          <!-- Crack: appears in phases -->
          <g id="crack-low" stroke="#fbbf24" stroke-width="2.5" fill="none" opacity="0">
            <path d="M235,120 L260,160"/>
          </g>
          <g id="crack-high" stroke="#ef4444" stroke-width="2" fill="none" opacity="0">
            <path d="M260,160 L285,185 L268,210 L295,235"/>
            <path d="M285,185 L320,180"/>
            <path d="M268,210 L240,225"/>
            <path d="M260,160 L210,150"/>
            <path d="M260,160 L220,200"/>
          </g>

          <!-- Detector -->
          <g id="gb-detector">
            <rect x="195" y="14" width="90" height="32" rx="4" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="240" cy="30" r="7" fill="#22d3ee">
              <animate attributeName="r" values="6;8;6" dur="1.6s" repeatCount="indefinite"/>
            </circle>
            <text x="240" y="56" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="600">Akustischer Sensor (6m Radius)</text>
          </g>

          <!-- Phase 1: Low frequency -->
          <g id="phase1" transform="translate(420, 80)" opacity="0">
            <rect x="0" y="0" width="170" height="70" rx="6" fill="#0b1424" stroke="#fbbf24" stroke-width="2"/>
            <text x="85" y="18" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="system-ui" font-weight="700">PHASE 1: TIEFFREQUENZ</text>
            <path d="M5,46 Q25,18 45,46 T85,46 T125,46 L165,46" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round">
              <animate attributeName="stroke-dasharray" values="0,400;400,0" dur="2s" repeatCount="indefinite"/>
            </path>
            <text x="85" y="63" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">≈ 100 Hz · Aufprall</text>
          </g>

          <!-- Phase 2: High frequency -->
          <g id="phase2" transform="translate(420, 170)" opacity="0">
            <rect x="0" y="0" width="170" height="70" rx="6" fill="#0b1424" stroke="#ef4444" stroke-width="2"/>
            <text x="85" y="18" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui" font-weight="700">PHASE 2: HOCHFREQUENZ</text>
            <path d="M5,46 q3,-14 6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0" stroke="#ef4444" stroke-width="1.8" fill="none">
              <animate attributeName="stroke-dasharray" values="0,400;400,0" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <text x="85" y="63" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">≈ 100 kHz · Splittern</text>
          </g>

          <!-- Decision -->
          <g id="gb-decision" transform="translate(420, 260)" opacity="0">
            <rect x="0" y="0" width="170" height="60" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".6;1;.6" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="85" y="22" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="700">Beide Phasen ✓</text>
            <text x="85" y="46" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['gb-detector'],             text: '① Der passiv-akustische Sensor sitzt an Decke oder Wand und horcht in den Raum mit 6 m Radius. Er deckt mehrere Scheiben gleichzeitig ab.' },
        { t: 4000,  h: ['crack-low','phase1'],      text: '② Phase 1: Etwas trifft die Scheibe → niederfrequente Vibration (~100 Hz). Der Sensor erkennt die Aufprall-/Biegungs-Signatur.' },
        { t: 8500,  h: ['crack-high','phase2'],     text: '③ Phase 2: Glas zerbricht → hochfrequentes Splittern (~100 kHz). Charakteristische Bruchschall-Signatur.' },
        { t: 13000, h: ['gb-decision'],             text: '④ Logik: NUR wenn BEIDE Phasen in der richtigen Reihenfolge auftreten → ALARM. Schützt gegen Fehlalarm durch laute Geräusche.' },
      ],
      cycle: 17500,
    },

    // ============== ERSCHÜTTERUNG ==============
    'piezo-erschuetterung': {
      title: 'Piezo-Erschütterungsmelder',
      intro: 'Piezokeramik wandelt mechanische Vibration in Spannung',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tresor -->
          <rect x="40" y="60" width="290" height="230" rx="10" fill="#162542" stroke="#94a3c4" stroke-width="4"/>
          <rect x="60" y="80" width="250" height="190" fill="#0b1424"/>
          <text x="185" y="190" text-anchor="middle" font-size="34" font-weight="800" fill="#94a3c4" font-family="system-ui">TRESOR</text>
          <circle cx="240" cy="220" r="16" fill="#fbbf24" opacity=".7"/>

          <!-- Piezo sensor -->
          <g id="piezo-sensor">
            <rect x="320" y="150" width="50" height="50" rx="5" fill="#38bdf8" stroke="#22d3ee" stroke-width="2.5"/>
            <text x="345" y="178" text-anchor="middle" font-size="13" fill="#0b1424" font-family="system-ui" font-weight="800">PZT</text>
            <text x="345" y="216" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="600">Piezo</text>
          </g>

          <!-- Drill animated back/forth -->
          <g id="drill" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="500 170; 400 170; 500 170" dur="3.5s" repeatCount="indefinite"/>
              <rect x="0" y="-8" width="70" height="22" rx="3" fill="#fbbf24"/>
              <rect x="70" y="0" width="50" height="6" fill="#94a3c4"/>
              <text x="35" y="-14" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="600">Bohrer</text>
            </g>
          </g>

          <!-- Vibration waves emanating from drill point (animated dash) -->
          <g id="vibration" opacity="0" stroke="#ef4444" stroke-width="2" fill="none">
            <path d="M370,170 q-30,-15 -60,0 t-60,0 t-60,0">
              <animate attributeName="stroke-dashoffset" values="0;-60" dur="0.7s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="6 6" begin="0s"/>
            </path>
            <path d="M370,180 q-30,15 -60,0 t-60,0 t-60,0">
              <animate attributeName="stroke-dashoffset" values="0;-60" dur="0.9s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="6 6" begin="0s"/>
            </path>
            <path d="M370,160 q-30,-18 -60,0 t-60,0 t-60,0">
              <animate attributeName="stroke-dashoffset" values="0;-60" dur="0.8s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="6 6" begin="0s"/>
            </path>
          </g>

          <!-- Voltage output -->
          <g id="piezo-output" transform="translate(400, 240)" opacity="0">
            <rect x="0" y="0" width="190" height="65" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="95" y="16" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">SPANNUNG aus Piezo</text>
            <path d="M5,42 L20,42 L25,12 L30,58 L35,18 L40,52 L45,22 L50,48 L55,28 L60,42 L80,42 L100,42 L105,15 L110,58 L115,22 L120,42 L190,42"
              stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round">
              <animate attributeName="stroke-dasharray" values="0,500;500,0" dur="2s" repeatCount="indefinite"/>
            </path>
            <text x="95" y="60" text-anchor="middle" font-size="9" fill="#94a3c4" font-family="system-ui">Amplitude + Dauer ↑</text>
          </g>

          <!-- Alarm -->
          <g id="piezo-alarm" transform="translate(400, 50)" opacity="0">
            <rect x="0" y="0" width="190" height="46" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="95" y="30" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ TRESOR-ANGRIFF</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['piezo-sensor'],         text: '① Der Piezo-Sensor wird DIREKT auf den Tresor geschraubt — Reichweite ~2 m auf derselben Materialfläche.' },
        { t: 4000,  h: ['drill','vibration'],    text: '② Angreifer bohrt, stemmt oder flext den Tresor → mechanische Vibration breitet sich durch das Metall aus.' },
        { t: 8000,  h: ['piezo-output'],         text: '③ Die Piezokeramik (PZT-Kristall) wandelt mechanische Verformung in elektrische Spannung — ein Vibration-zu-Strom-Umsetzer.' },
        { t: 12000, h: ['piezo-alarm'],          text: '④ Auswerteinheit: Wenn Amplitude UND Dauer den Schwellwert überschreiten → ALARM. Schützt gegen kurze Stöße als Fehlalarm.' },
      ],
      cycle: 17000,
    },

    // ============== IR-LICHTSCHRANKE ==============
    'ir-schranke': {
      title: 'IR-Lichtschranke · Mehrstrahl-System',
      intro: 'Codierte IR-Pulse 940 nm · Strahl-Unterbrechung = Alarm',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Sender -->
          <g id="ir-tx">
            <rect x="20" y="50" width="38" height="240" rx="6" fill="#162542" stroke="#22d3ee" stroke-width="2.5"/>
            <text x="39" y="40" text-anchor="middle" font-size="14" fill="#22d3ee" font-family="system-ui" font-weight="800">TX</text>
            <text x="39" y="304" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui">Sender</text>
            <circle cx="39" cy="100" r="4" fill="#22d3ee"><animate attributeName="opacity" values="1;.3;1" dur="0.3s" repeatCount="indefinite"/></circle>
            <circle cx="39" cy="160" r="4" fill="#22d3ee"><animate attributeName="opacity" values=".3;1;.3" dur="0.3s" repeatCount="indefinite"/></circle>
            <circle cx="39" cy="220" r="4" fill="#22d3ee"><animate attributeName="opacity" values="1;.3;1" dur="0.3s" begin="0.1s" repeatCount="indefinite"/></circle>
            <circle cx="39" cy="280" r="4" fill="#22d3ee"><animate attributeName="opacity" values=".3;1;.3" dur="0.3s" begin="0.1s" repeatCount="indefinite"/></circle>
          </g>

          <!-- Receiver -->
          <g id="ir-rx">
            <rect x="542" y="50" width="38" height="240" rx="6" fill="#162542" stroke="#38bdf8" stroke-width="2.5"/>
            <text x="561" y="40" text-anchor="middle" font-size="14" fill="#38bdf8" font-family="system-ui" font-weight="800">RX</text>
            <text x="561" y="304" text-anchor="middle" font-size="10" fill="#38bdf8" font-family="system-ui">Empfänger</text>
          </g>

          <!-- 4 beams with animated dashes -->
          <g id="ir-beams" stroke-width="3">
            <line x1="58" y1="100" x2="542" y2="100" stroke="#22d3ee" stroke-dasharray="10 6">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="0.4s" repeatCount="indefinite"/>
            </line>
            <line x1="58" y1="160" x2="542" y2="160" stroke="#22d3ee" stroke-dasharray="10 6">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="0.4s" begin="0.1s" repeatCount="indefinite"/>
            </line>
            <line x1="58" y1="220" x2="542" y2="220" stroke="#22d3ee" stroke-dasharray="10 6">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="0.4s" begin="0.2s" repeatCount="indefinite"/>
            </line>
            <line x1="58" y1="280" x2="542" y2="280" stroke="#22d3ee" stroke-dasharray="10 6">
              <animate attributeName="stroke-dashoffset" values="16;0" dur="0.4s" begin="0.3s" repeatCount="indefinite"/>
            </line>
          </g>

          <!-- Code label -->
          <text id="ir-code" x="300" y="32" text-anchor="middle" font-size="12" fill="#22d3ee" font-family="monospace" opacity="0" font-weight="600">
            … 01101001 11010010 01101001 11010010 …
          </text>

          <!-- Person walking through (animated) -->
          <g id="ir-person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="-30 0; 580 0" dur="14s" repeatCount="indefinite"/>
              <ellipse cx="0" cy="190" rx="22" ry="46" fill="#ef4444" opacity=".25"/>
              <circle cx="0" cy="150" r="14" fill="#e8edf7"/>
              <rect x="-11" y="164" width="22" height="56" rx="5" fill="#ef4444"/>
            </g>
          </g>

          <!-- Block indicator -->
          <g id="ir-block" opacity="0">
            <text x="300" y="316" text-anchor="middle" font-size="12" fill="#ef4444" font-family="system-ui" font-weight="600">Multi-Strahl-AND-Logik → ALARM</text>
          </g>

          <!-- Alarm -->
          <g id="ir-alarm" opacity="0">
            <rect x="240" y="0" width="120" height="36" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="300" y="24" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['ir-tx','ir-rx'],              text: '① Sender (TX) und Empfänger (RX) gegenüber, exakt fluchtend. Distanz: 5 m (innen) bis 250 m (außen).' },
        { t: 4000,  h: ['ir-beams','ir-code'],         text: '② TX sendet GEPULSTE IR-Strahlen bei 940 nm — für das Auge unsichtbar. Die Pulse sind digital codiert.' },
        { t: 8500,  h: ['ir-person','ir-block'],       text: '③ Person durchquert → mehrere Strahlen werden gleichzeitig unterbrochen. Multi-Strahl-AND-Logik schützt gegen Fehlalarm.' },
        { t: 14000, h: ['ir-alarm'],                   text: '④ Auswertung erkennt die Unterbrechung der codierten Pulse → ALARM! Fremde IR-Quellen können den Code nicht nachahmen.' },
      ],
      cycle: 18500,
    },

    // ============== KAPAZITIV ==============
    'kapazitiv': {
      title: 'Kapazitiver Feldmelder',
      intro: 'Elektrostatisches Feld erkennt Annäherung VOR Berührung',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Vitrine -->
          <rect x="220" y="80" width="160" height="220" fill="#162542" stroke="#c084fc" stroke-width="3"/>
          <text x="300" y="200" text-anchor="middle" font-size="20" font-weight="800" fill="#c084fc" font-family="system-ui">KUNST</text>
          <text x="300" y="70" text-anchor="middle" font-size="11" fill="#c084fc" font-family="system-ui" font-weight="600">Tresor / Vitrine</text>

          <!-- Field rings (continuous pulse) -->
          <g id="cap-field" fill="none" stroke="#c084fc" stroke-width="1.8" opacity="0">
            <ellipse cx="300" cy="190" rx="120" ry="140">
              <animate attributeName="opacity" values=".2;.7;.2" dur="2.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="300" cy="190" rx="100" ry="120">
              <animate attributeName="opacity" values=".2;.7;.2" dur="2.5s" begin="0.3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="300" cy="190" rx="80" ry="100">
              <animate attributeName="opacity" values=".2;.7;.2" dur="2.5s" begin="0.6s" repeatCount="indefinite"/>
            </ellipse>
          </g>
          <text id="cap-label" x="300" y="50" text-anchor="middle" font-size="12" fill="#c084fc" font-family="system-ui" font-weight="600" opacity="0">
            Elektrostatisches Feld
          </text>

          <!-- Hand approaching (slow) -->
          <g id="cap-hand" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="600 190; 440 190; 600 190" dur="8s" repeatCount="indefinite"/>
              <ellipse cx="0" cy="0" rx="16" ry="24" fill="#fbbf24"/>
              <rect x="-50" y="-5" width="40" height="12" rx="3" fill="#fbbf24"/>
              <text x="-30" y="40" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="600">Hand</text>
            </g>
          </g>

          <!-- Field disturbance indicator -->
          <g id="cap-disturb" opacity="0">
            <text x="475" y="100" text-anchor="middle" font-size="12" fill="#ef4444" font-family="system-ui" font-weight="600">Feld-Kapazität ändert sich</text>
            <path d="M430,180 Q445,150 460,180 Q475,210 490,180" stroke="#ef4444" stroke-width="2.5" fill="none">
              <animate attributeName="stroke-dasharray" values="0,200;200,0;0,200" dur="2s" repeatCount="indefinite"/>
            </path>
          </g>

          <!-- Alarm BEFORE touch -->
          <g id="cap-alarm" transform="translate(40, 110)" opacity="0">
            <rect x="0" y="0" width="190" height="46" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="95" y="30" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM VOR Berührung!</text>
            <text x="95" y="70" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui">~0,5 m Annäherung erkannt</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['cap-field','cap-label'],   text: '① Der Sensor erzeugt um das geschützte Objekt ein elektrostatisches Feld — sehr geringe Energie, harmlos.' },
        { t: 4000,  h: ['cap-hand'],                text: '② Eine Hand nähert sich. Der menschliche Körper hat eine eigene Kapazität.' },
        { t: 8000,  h: ['cap-disturb'],             text: '③ Der Körper stört das Feld → die gemessene Kapazität ändert sich messbar.' },
        { t: 12000, h: ['cap-alarm'],               text: '④ Bei Überschreiten der Schwelle → ALARM, BEVOR das Objekt überhaupt berührt wird (typ. 0,5 m Vorwarnung).' },
      ],
      cycle: 17000,
    },

    // ============== ULTRASCHALL ==============
    'ultraschall': {
      title: 'Ultraschallmelder · 40 kHz Doppler',
      intro: 'Sendet 40 kHz Ultraschall, erkennt Bewegung über Doppler in geschlossenen Räumen',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="20" y="40" width="560" height="260" fill="rgba(56,189,248,.05)" stroke="#1f3358" stroke-width="2.5"/>
          <text x="300" y="30" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui" font-weight="600">Geschlossener Raum (Schall reflektiert)</text>

          <g id="us-sensor">
            <rect x="22" y="150" width="34" height="44" rx="4" fill="#162542" stroke="#22d3ee" stroke-width="2.5"/>
            <circle cx="39" cy="172" r="6" fill="#22d3ee">
              <animate attributeName="opacity" values="1;.3;1" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            <text x="39" y="214" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui" font-weight="700">US 40 kHz</text>
          </g>

          <!-- US waves continuously emanating -->
          <g id="us-out" opacity="0" fill="none" stroke="#22d3ee" stroke-width="1.8" stroke-dasharray="4 4">
            <circle cx="56" cy="172" r="0">
              <animate attributeName="r" values="0;280" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="56" cy="172" r="0">
              <animate attributeName="r" values="0;280" dur="3s" begin="1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0" dur="3s" begin="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="56" cy="172" r="0">
              <animate attributeName="r" values="0;280" dur="3s" begin="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0" dur="3s" begin="2s" repeatCount="indefinite"/>
            </circle>
          </g>
          <text id="us-label" x="300" y="74" text-anchor="middle" font-size="12" fill="#22d3ee" font-family="system-ui" font-weight="600" opacity="0">40 kHz Ultraschall füllt das Raumvolumen</text>

          <!-- Person -->
          <g id="us-person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="500 190; 250 190; 500 190" dur="8s" repeatCount="indefinite"/>
              <circle cx="0" cy="-14" r="12" fill="#e8edf7"/>
              <rect x="-9" y="-4" width="18" height="36" rx="4" fill="#818cf8"/>
            </g>
            <text x="300" y="62" text-anchor="middle" font-size="11" fill="#818cf8" font-family="system-ui">Mensch bewegt sich</text>
          </g>

          <!-- Return wave with shifted freq -->
          <g id="us-return" opacity="0">
            <path d="M395,180 Q330,170 285,180 Q240,190 195,180 Q150,170 105,180 Q60,190 56,180"
              stroke="#ef4444" stroke-width="2" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-60" dur="0.5s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="6 6" begin="0s"/>
            </path>
            <text x="200" y="270" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="600">Reflektierte Welle: f₁ ≠ f₀ → Doppler</text>
          </g>

          <!-- Alarm -->
          <g id="us-alarm" opacity="0">
            <rect x="430" y="70" width="140" height="36" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="500" y="94" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['us-sensor'],                text: '① Der Ultraschallmelder ist AKTIV — er sendet 40 kHz Schallwellen aus (für Menschen unhörbar).' },
        { t: 3500,  h: ['us-out','us-label'],        text: '② Die Wellen füllen den geschlossenen Raum durch vielfache Reflexion an Wänden und Möbeln.' },
        { t: 8000,  h: ['us-person','us-return'],    text: '③ Eine Person bewegt sich → die reflektierte Welle hat eine verschobene Frequenz (Doppler-Effekt).' },
        { t: 12500, h: ['us-alarm'],                 text: '④ Die Auswerteinheit erkennt die Frequenzdifferenz → ALARM. Achtung: funktioniert NUR in geschlossenen Räumen.' },
      ],
      cycle: 17000,
    },

    // ============== BRANDMELDER ==============
    'rauch-streulicht': {
      title: 'Optischer Rauchmelder · Streulicht-Prinzip',
      intro: 'Tyndall-Effekt: Rauchpartikel streuen LED-Licht zum Foto-Sensor',
      svg: `
        <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Ceiling -->
          <rect x="0" y="0" width="600" height="14" fill="#1f3358"/>
          <text x="300" y="10" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui">DECKE</text>

          <!-- Detector body -->
          <g id="rm-body">
            <ellipse cx="300" cy="34" rx="28" ry="14" fill="#162542" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="300" cy="34" r="7" fill="#ef4444">
              <animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Chamber zoomed-in -->
          <g id="rm-chamber">
            <rect x="350" y="80" width="220" height="200" rx="8" fill="#0b1424" stroke="#94a3c4" stroke-width="2"/>
            <text x="460" y="74" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui" font-weight="600">DUNKLE DETEKTIONS-KAMMER</text>
            <circle id="rm-led" cx="380" cy="120" r="12" fill="#fbbf24">
              <animate attributeName="opacity" values="1;.5;1" dur="1s" repeatCount="indefinite"/>
            </circle>
            <text x="380" y="148" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">LED</text>
            <rect x="540" y="190" width="22" height="16" fill="#22d3ee"/>
            <text x="550" y="226" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">PD</text>
            <line id="rm-beam" x1="392" y1="120" x2="560" y2="120" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 4" opacity=".5">
              <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.5s" repeatCount="indefinite"/>
            </line>
          </g>

          <!-- Smoke rising -->
          <g id="rm-smoke" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="0 220; 0 -40" dur="6s" repeatCount="indefinite"/>
              <circle cx="120" cy="200" r="16" fill="#94a3c4" opacity=".5"/>
              <circle cx="140" cy="180" r="20" fill="#94a3c4" opacity=".4"/>
              <circle cx="100" cy="175" r="17" fill="#94a3c4" opacity=".5"/>
              <circle cx="130" cy="160" r="14" fill="#94a3c4" opacity=".4"/>
            </g>
            <text x="120" y="280" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui" font-weight="600">Rauch dringt in Kammer</text>
          </g>

          <!-- Smoke in chamber + scattered light -->
          <g id="rm-scatter" opacity="0">
            <circle cx="460" cy="160" r="7" fill="#94a3c4" opacity=".5"/>
            <circle cx="480" cy="170" r="6" fill="#94a3c4" opacity=".5"/>
            <circle cx="440" cy="170" r="7" fill="#94a3c4" opacity=".5"/>
            <line x1="460" y1="160" x2="545" y2="200" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="1.5s" repeatCount="indefinite"/>
            </line>
            <line x1="480" y1="170" x2="545" y2="200" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
            </line>
            <line x1="440" y1="170" x2="545" y2="200" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
            </line>
            <text x="460" y="260" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="600">Tyndall-Effekt: gestreutes Licht trifft Sensor</text>
          </g>

          <!-- Fire -->
          <g id="rm-fire">
            <path d="M110,290 Q90,250 120,230 Q140,255 130,290 Z" fill="#ef4444">
              <animateTransform attributeName="transform" type="scale" values="1 1; 1 1.1; 1 1" dur="0.5s" repeatCount="indefinite"/>
            </path>
            <path d="M115,290 Q100,260 120,245 Q135,262 127,290 Z" fill="#fbbf24">
              <animateTransform attributeName="transform" type="scale" values="1 1; 1 1.15; 1 1" dur="0.3s" repeatCount="indefinite"/>
            </path>
            <text x="120" y="316" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="600">Brand</text>
          </g>

          <!-- Alarm -->
          <g id="rm-alarm" opacity="0">
            <rect x="30" y="60" width="160" height="42" rx="8" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="110" y="86" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ FEUER-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['rm-body','rm-chamber'],   text: '① Der Rauchmelder sitzt an der Decke. In ihm: eine dunkle Kammer mit LED und Foto-Sensor (PD), zueinander im 90°-Winkel angeordnet.' },
        { t: 4000,  h: ['rm-beam'],                text: '② Die LED leuchtet permanent. Normalerweise gelangt KEIN Licht zum Foto-Sensor (dunkle Kammer, kein Streumedium).' },
        { t: 8000,  h: ['rm-fire','rm-smoke'],     text: '③ Ein Brand entsteht → Rauchpartikel steigen auf und dringen durch Lüftungsschlitze in die Kammer.' },
        { t: 12500, h: ['rm-scatter'],             text: '④ Die Rauchpartikel streuen das LED-Licht (Tyndall-Effekt) → das Streulicht trifft jetzt den Foto-Sensor.' },
        { t: 17000, h: ['rm-alarm'],               text: '⑤ Der Foto-Sensor registriert das Licht → die Auswerteinheit löst den Brand-Alarm aus.' },
      ],
      cycle: 21000,
    },

  };

  /* ============== PLAYER UI ============== */

  function player(key, container) {
    const def = EXPLAINERS[key];
    if (!def) return null;

    const wrap = el('div', { class: 'expl-wrap' });
    wrap.innerHTML = `
      <div class="expl-head">
        <h3>${def.title}</h3>
        <div class="expl-sub">${def.intro}</div>
      </div>
      <div class="expl-stage">${def.svg}</div>
      <div class="expl-narration">
        <div class="expl-text"></div>
        <div class="expl-bar"><div class="expl-fill"></div></div>
      </div>
      <div class="expl-controls">
        <button class="btn expl-toggle" data-state="play"><i class="fas fa-play"></i> <span>Abspielen</span></button>
        <button class="btn ghost expl-restart"><i class="fas fa-rotate-left"></i> <span>Neu</span></button>
        <div class="expl-speed-wrap">
          <label class="muted small">Tempo</label>
          <button class="btn ghost expl-speed" data-speed="1">1×</button>
        </div>
        <div class="expl-step-counter muted small"></div>
      </div>
    `;
    container.appendChild(wrap);

    const svg = wrap.querySelector('svg');
    const text = wrap.querySelector('.expl-text');
    const fill = wrap.querySelector('.expl-fill');
    const toggle = wrap.querySelector('.expl-toggle');
    const restart = wrap.querySelector('.expl-restart');
    const speedBtn = wrap.querySelector('.expl-speed');
    const counter = wrap.querySelector('.expl-step-counter');

    let playing = false;
    let elapsed = 0;
    let lastTick = 0;
    let raf = null;
    let speed = 1.0; // 0.5x, 1x, 2x

    function applyStep(stepIndex) {
      // Reset: only steps up to current
      def.steps.forEach((s, i) => {
        s.h.forEach(id => {
          const e = svg.querySelector('#'+id);
          if (!e) return;
          const shouldShow = i <= stepIndex;
          e.style.transition = 'opacity .8s ease';
          e.style.opacity = shouldShow ? 1 : 0;
          // Active step → pulsing highlight class
          if (i === stepIndex && shouldShow) {
            e.classList.add('expl-active');
          } else {
            e.classList.remove('expl-active');
          }
        });
      });
      const newText = def.steps[stepIndex]?.text || '';
      if (text.dataset.cur !== newText) {
        text.style.opacity = 0;
        setTimeout(() => {
          text.textContent = newText;
          text.dataset.cur = newText;
          text.style.opacity = 1;
        }, 200);
      }
      counter.textContent = `Schritt ${stepIndex+1} / ${def.steps.length}`;
    }

    function getCurrentStep(ms) {
      let idx = 0;
      for (let i = 0; i < def.steps.length; i++) {
        if (def.steps[i].t <= ms) idx = i;
      }
      return idx;
    }

    function reset() {
      elapsed = 0;
      applyStep(0);
      fill.style.width = '0%';
    }

    function tick(now) {
      if (!playing) return;
      const dt = (now - lastTick) * speed;
      lastTick = now;
      elapsed += dt;
      if (elapsed > def.cycle) elapsed = 0;
      fill.style.width = (elapsed / def.cycle * 100) + '%';
      applyStep(getCurrentStep(elapsed));
      raf = requestAnimationFrame(tick);
    }

    toggle.addEventListener('click', () => {
      playing = !playing;
      if (playing) {
        toggle.querySelector('i').className = 'fas fa-pause';
        toggle.querySelector('span').textContent = 'Pause';
        toggle.dataset.state = 'pause';
        lastTick = performance.now();
        raf = requestAnimationFrame(tick);
      } else {
        toggle.querySelector('i').className = 'fas fa-play';
        toggle.querySelector('span').textContent = 'Abspielen';
        toggle.dataset.state = 'play';
        if (raf) cancelAnimationFrame(raf);
      }
    });

    restart.addEventListener('click', () => {
      reset();
      if (!playing) toggle.click();
    });

    speedBtn.addEventListener('click', () => {
      const speeds = [0.5, 1, 1.5, 2];
      const i = speeds.indexOf(speed);
      speed = speeds[(i+1) % speeds.length];
      speedBtn.textContent = speed + '×';
      speedBtn.dataset.speed = speed;
    });

    reset();
    setTimeout(() => toggle.click(), 400);

    return wrap;
  }

  function hasExplainer(key) { return !!EXPLAINERS[key]; }

  return { player, hasExplainer, EXPLAINERS };
})();
