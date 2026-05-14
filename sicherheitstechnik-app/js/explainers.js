/* Explainer-"Videos" – Step-für-Step-Animationen mit Player-UI
   Jeder Explainer ist eine SVG + Sequenz von Steps mit:
     - elements: SVG-IDs die in dem Step sichtbar/aktiv werden
     - text: Narration für diesen Step
     - duration: ms wie lange dieser Step läuft */

window.EXPL = (() => {
  const { el } = U;

  /* ============== EXPLAINER DEFINITIONS ============== */

  // Helper colors
  const C = {
    sensor:'#22d3ee', wave:'#22d3ee', pirCone:'#fbbf24',
    person:'#e8edf7', heat:'#ef4444', signal:'#22c55e',
    text:'#94a3c4', accent:'#38bdf8', danger:'#ef4444'
  };

  const EXPLAINERS = {

    // ============== PIR ==============
    'pir-standard': {
      title: 'PIR-Melder · Funktionsprinzip',
      intro: 'Passiv-Infrarot · Erfasst Wärmestrahlung 8–14 µm bewegter Wärmequellen',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="pirZone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#fbbf24" stop-opacity=".55"/>
              <stop offset="1" stop-color="#fbbf24" stop-opacity=".05"/>
            </linearGradient>
            <radialGradient id="pirHeatGrad" cx=".5" cy=".5" r=".5">
              <stop offset="0" stop-color="#ef4444"/>
              <stop offset="1" stop-color="#ef4444" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Wall -->
          <rect x="0" y="0" width="22" height="320" fill="#1f3358"/>

          <!-- Sensor housing -->
          <g id="sensor-housing">
            <rect x="22" y="140" width="28" height="44" rx="6" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="36" cy="162" r="8" fill="#0b1424"/>
            <circle id="sensor-eye" cx="36" cy="162" r="4" fill="#22d3ee"/>
          </g>

          <!-- Fresnel lens segments (zones) -->
          <g id="fresnel" opacity="0">
            <path d="M50,162 L580,30 L580,80 Z" fill="url(#pirZone)" opacity=".55"/>
            <path d="M50,162 L580,90 L580,130 Z" fill="url(#pirZone)" opacity=".55"/>
            <path d="M50,162 L580,140 L580,180 Z" fill="url(#pirZone)" opacity=".55"/>
            <path d="M50,162 L580,190 L580,230 Z" fill="url(#pirZone)" opacity=".55"/>
            <path d="M50,162 L580,240 L580,290 Z" fill="url(#pirZone)" opacity=".55"/>
          </g>
          <text id="fresnel-label" x="320" y="20" font-size="11" fill="#fbbf24" font-family="system-ui" text-anchor="middle" opacity="0">Fresnel-Linse teilt Sichtfeld in Zonen</text>

          <!-- Person walking through -->
          <g id="walker" transform="translate(500, 220)" opacity="0">
            <circle cx="0" cy="0" r="14" fill="url(#pirHeatGrad)" opacity=".5"/>
            <circle cx="0" cy="-2" r="9" fill="#e8edf7"/>
            <rect x="-7" y="6" width="14" height="26" rx="3" fill="#38bdf8"/>
            <text x="20" y="-8" font-size="11" fill="#fbbf24" font-family="system-ui">37°C IR</text>
          </g>

          <!-- Pyro element representation (close-up) -->
          <g id="pyro" transform="translate(80, 250)" opacity="0">
            <rect x="0" y="0" width="220" height="60" rx="6" fill="#162542" stroke="#94a3c4"/>
            <text x="110" y="14" font-size="9" fill="#94a3c4" font-family="system-ui" text-anchor="middle">PYROELEKTRISCHES ELEMENT (LiTaO₃)</text>
            <rect x="10" y="22" width="95" height="30" fill="#0b1424" stroke="#fbbf24"/>
            <text x="57" y="42" font-size="11" fill="#fbbf24" font-family="system-ui" text-anchor="middle">+</text>
            <rect x="115" y="22" width="95" height="30" fill="#0b1424" stroke="#fbbf24"/>
            <text x="162" y="42" font-size="11" fill="#fbbf24" font-family="system-ui" text-anchor="middle">−</text>
          </g>

          <!-- Spannungs-Diagramm -->
          <g id="voltage" transform="translate(330, 250)" opacity="0">
            <rect x="0" y="0" width="260" height="60" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="130" y="14" font-size="9" fill="#22c55e" font-family="system-ui" text-anchor="middle">Δ-SPANNUNG</text>
            <path id="voltage-curve" d="M10,42 Q40,42 60,30 T120,42 T180,42 T250,42"
              stroke="#22c55e" stroke-width="2" fill="none" stroke-dasharray="200" stroke-dashoffset="200"/>
          </g>

          <!-- Alarm flash -->
          <g id="alarm" opacity="0">
            <rect x="240" y="40" width="120" height="32" rx="6" fill="#ef4444"/>
            <text x="300" y="60" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="700">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['sensor-housing'],    text: '① Der PIR-Sensor sitzt passiv an der Wand und schaut in den Raum — er sendet selbst KEINE Strahlung aus.' },
        { t: 1200, h: ['fresnel', 'fresnel-label'], text: '② Die Fresnel-Linse vor dem Sensor teilt das Sichtfeld in viele schmale Zonen (typisch 5–15 Zonen bei 90°).' },
        { t: 2800, h: ['walker'],            text: '③ Ein Mensch (37 °C Körpertemperatur) strahlt unsichtbares Infrarot 8–14 µm ab und bewegt sich durch die Zonen.' },
        { t: 4400, h: ['pyro'],              text: '④ Das pyroelektrische Element (LiTaO₃-Kristall) besteht aus zwei gegenpolig geschalteten Sensorfeldern.' },
        { t: 5800, h: ['voltage'],           text: '⑤ Tritt die Wärmequelle nacheinander in die Zonen → es entsteht eine wechselnde Spannungsdifferenz (Δ-Signal).' },
        { t: 7600, h: ['alarm'],             text: '⑥ Signalprozessor analysiert Amplitude + Frequenz → bei Übereinstimmung mit Bewegungsmuster: ALARM!' },
      ],
      cycle: 9500,
    },

    // ============== MIKROWELLE ==============
    'mikrowelle': {
      title: 'Mikrowellenmelder · Doppler-Radar',
      intro: 'Aktiver Sensor · sendet 10,525 GHz Mikrowellen aus, wertet Frequenzverschiebung aus',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="0" y="0" width="22" height="320" fill="#1f3358"/>

          <!-- Sensor -->
          <g id="mw-sensor">
            <rect x="22" y="135" width="32" height="50" rx="6" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="38" cy="160" r="5" fill="#22d3ee"/>
            <text x="38" y="200" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui">10,525 GHz</text>
          </g>

          <!-- Outgoing waves -->
          <g id="mw-out" opacity="0" stroke="#22d3ee" stroke-width="1.8" fill="none">
            <path id="mw-out-1" d="M54,160 Q100,130 150,160 T250,160 T350,160 T450,160 T560,160" opacity=".9"/>
            <path id="mw-out-2" d="M54,140 Q100,110 150,140 T250,140 T350,140 T450,140 T560,140" opacity=".7"/>
            <path id="mw-out-3" d="M54,180 Q100,150 150,180 T250,180 T350,180 T450,180 T560,180" opacity=".7"/>
          </g>
          <text id="mw-out-label" x="300" y="80" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" opacity="0">f₀ = 10,525 GHz · Welle wird ausgesendet</text>

          <!-- Static reflection: same frequency back -->
          <g id="mw-static" opacity="0">
            <rect x="450" y="120" width="50" height="80" fill="#94a3c4"/>
            <text x="475" y="116" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">WAND</text>
            <path d="M450,160 Q400,130 350,160 T250,160 T150,160 T54,160" stroke="#94a3c4" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>
            <text x="300" y="290" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui">f₁ = f₀ · gleiche Frequenz → kein Bewegungssignal</text>
          </g>

          <!-- Moving person + compressed reflection -->
          <g id="mw-moving" opacity="0">
            <g transform="translate(380, 200)">
              <circle cx="0" cy="-8" r="10" fill="#e8edf7"/>
              <rect x="-7" y="2" width="14" height="28" rx="3" fill="#818cf8"/>
              <text x="-30" y="-22" font-size="11" fill="#818cf8" font-family="system-ui">←</text>
            </g>
            <!-- compressed return -->
            <path d="M380,200 q-25,-20 -50,0 q-25,20 -50,0 q-25,-20 -50,0 q-25,20 -50,0 q-25,-20 -50,0 q-25,20 -50,0" stroke="#ef4444" stroke-width="1.8" fill="none"/>
            <text x="200" y="290" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui">f₁ ≠ f₀ → Δf = Doppler-Verschiebung!</text>
          </g>

          <!-- Mixer / output -->
          <g id="mw-mixer" opacity="0">
            <rect x="380" y="60" width="160" height="48" rx="6" fill="#162542" stroke="#22c55e" stroke-width="2"/>
            <text x="460" y="78" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700">Mischer (XOR)</text>
            <text x="460" y="96" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">f₁ − f₀ = Bewegungssignal</text>
          </g>

          <!-- Alarm -->
          <g id="mw-alarm" opacity="0">
            <rect x="380" y="20" width="160" height="32" rx="6" fill="#ef4444"/>
            <text x="460" y="40" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="700">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['mw-sensor'],     text: '① Der MW-Melder ist AKTIV — er sendet permanent Mikrowellen bei 10,525 GHz (X-Band).' },
        { t: 1400, h: ['mw-out', 'mw-out-label'], text: '② Die Wellen breiten sich in den Raum aus mit Sendefrequenz f₀.' },
        { t: 3000, h: ['mw-static'],     text: '③ Ruhende Objekte reflektieren mit IDENTISCHER Frequenz f₁ = f₀ → kein Bewegungssignal.' },
        { t: 5000, h: ['mw-moving'],     text: '④ Ein bewegtes Objekt reflektiert mit VERSCHOBENER Frequenz (Doppler-Effekt). Δf ist proportional zur Geschwindigkeit.' },
        { t: 7000, h: ['mw-mixer'],      text: '⑤ Der Mischer subtrahiert: f₁ − f₀ = Δf = Bewegungssignal.' },
        { t: 8500, h: ['mw-alarm'],      text: '⑥ Auswertung erkennt Bewegungsmuster → ALARM!' },
      ],
      cycle: 10500,
    },

    // ============== DUALMELDER ==============
    'dualmelder': {
      title: 'Dualmelder · PIR + MW · AND-Verknüpfung',
      intro: 'Beide Sensoren müssen gleichzeitig auslösen — drastische Fehlalarm-Reduktion',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="0" y="0" width="22" height="320" fill="#1f3358"/>

          <!-- Sensor housing with TWO eyes -->
          <g id="dual-sensor">
            <rect x="22" y="120" width="40" height="80" rx="6" fill="#162542" stroke="#94a3c4"/>
            <circle id="d-pir" cx="42" cy="138" r="6" fill="#fbbf24"/>
            <circle id="d-mw"  cx="42" cy="180" r="6" fill="#22d3ee"/>
            <text x="42" y="216" text-anchor="middle" font-size="9" fill="#94a3c4" font-family="system-ui">PIR + MW</text>
          </g>

          <!-- Two cones -->
          <g id="dual-pir-cone" opacity="0">
            <path d="M62,138 L560,40 L560,140 Z" fill="#fbbf24" opacity=".3"/>
            <text x="540" y="90" text-anchor="end" font-size="11" fill="#fbbf24" font-family="system-ui">PIR (Wärme)</text>
          </g>
          <g id="dual-mw-cone" opacity="0">
            <path d="M62,180 L560,160 L560,280 Z" fill="#22d3ee" opacity=".3"/>
            <text x="540" y="240" text-anchor="end" font-size="11" fill="#22d3ee" font-family="system-ui">MW (Bewegung)</text>
          </g>

          <!-- AND-Gate -->
          <g id="dual-and" transform="translate(300, 80)" opacity="0">
            <path d="M0,0 L40,0 Q90,0 90,50 Q90,100 40,100 L0,100 Z" fill="#162542" stroke="#22c55e" stroke-width="2"/>
            <text x="45" y="58" text-anchor="middle" font-size="18" font-family="system-ui" font-weight="800" fill="#22c55e">AND</text>
            <line id="d-line-pir" x1="-50" y1="20" x2="0" y2="20" stroke="#fbbf24" stroke-width="2"/>
            <line id="d-line-mw"  x1="-50" y1="80" x2="0" y2="80" stroke="#22d3ee" stroke-width="2"/>
            <line id="d-line-out" x1="90" y1="50" x2="160" y2="50" stroke="#22c55e" stroke-width="2"/>
            <text id="d-pir-state" x="-55" y="14" text-anchor="end" font-size="10" fill="#fbbf24" font-family="system-ui">0</text>
            <text id="d-mw-state"  x="-55" y="74" text-anchor="end" font-size="10" fill="#22d3ee" font-family="system-ui">0</text>
            <text id="d-out-state" x="170" y="44" font-size="10" fill="#22c55e" font-family="system-ui">→ 0</text>
          </g>

          <!-- Case 1: only heat (sun on heater) -->
          <g id="d-case1" opacity="0">
            <circle cx="450" cy="100" r="20" fill="#ef4444"/>
            <text x="450" y="160" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">Heizkörper (Wärme, keine Bewegung)</text>
          </g>

          <!-- Case 2: only motion (curtain in wind) -->
          <g id="d-case2" opacity="0">
            <path d="M460,90 q15,15 0,40 q-15,15 0,40 q15,15 0,30" stroke="#94a3c4" stroke-width="3" fill="none"/>
            <text x="460" y="220" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">Vorhang (Bewegung, kalt)</text>
          </g>

          <!-- Case 3: real intruder (both) -->
          <g id="d-case3" opacity="0">
            <g transform="translate(440, 180)">
              <circle cx="0" cy="-10" r="10" fill="#e8edf7"/>
              <rect x="-7" y="0" width="14" height="28" rx="3" fill="#ef4444"/>
              <circle cx="0" cy="-10" r="14" fill="#ef4444" opacity=".2"/>
            </g>
            <text x="440" y="240" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">Einbrecher (Wärme + Bewegung)</text>
          </g>

          <!-- Final alarm -->
          <g id="d-alarm" opacity="0">
            <rect x="460" y="30" width="120" height="32" rx="6" fill="#ef4444"/>
            <text x="520" y="50" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="700">⚠ ALARM!</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['dual-sensor'],                                  text: '① Dualmelder hat ZWEI Sensoren in einem Gehäuse: oben PIR (Wärme), unten Mikrowelle (Bewegung).' },
        { t: 1400, h: ['dual-pir-cone', 'dual-mw-cone'],                text: '② Beide Sensoren erfassen das gleiche Volumen mit ihrer eigenen Physik.' },
        { t: 3000, h: ['dual-and'],                                     text: '③ Beide Ausgänge werden mit AND verknüpft: Alarm NUR wenn BEIDE gleichzeitig auslösen.' },
        { t: 4500, h: ['d-case1'],                                      text: '④ Heizkörper sendet IR-Wärme → PIR=1, aber keine Bewegung → MW=0 → 1 AND 0 = 0. KEIN Alarm.' },
        { t: 6500, h: ['d-case2'],                                      text: '⑤ Vorhang bewegt sich → MW=1, aber keine Wärme → PIR=0 → 0 AND 1 = 0. KEIN Alarm.' },
        { t: 8500, h: ['d-case3', 'd-alarm'],                           text: '⑥ Echter Einbrecher: Wärme UND Bewegung → PIR=1 AND MW=1 = 1 → ALARM! −95 % Fehlalarme.' },
      ],
      cycle: 11500,
    },

    // ============== MAGNETKONTAKT ==============
    'magnetkontakt': {
      title: 'Magnetkontakt · Reed-Schalter',
      intro: 'Ruhestrom-Prinzip: Permanentmagnet schließt Reed-Kontakt — Tür auf = Strom unterbrochen',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <radialGradient id="magField" cx=".5" cy=".5" r=".5">
              <stop offset="0" stop-color="#c084fc" stop-opacity=".8"/>
              <stop offset="1" stop-color="#c084fc" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Frame (left) -->
          <rect x="0" y="40" width="240" height="240" fill="#162542" stroke="#1f3358"/>
          <text x="120" y="34" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui">RAHMEN (fest)</text>

          <!-- Reed contact -->
          <g id="reed">
            <rect x="210" y="140" width="30" height="40" rx="4" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <text x="225" y="200" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui">REED</text>
            <!-- Internal contacts -->
            <g id="reed-contacts">
              <line x1="218" y1="148" x2="232" y2="172" stroke="#fbbf24" stroke-width="1.8"/>
              <line x1="232" y1="148" x2="218" y2="172" stroke="#fbbf24" stroke-width="1.8"/>
            </g>
          </g>

          <!-- Door (right) - animated -->
          <g id="door" transform="translate(0, 0)">
            <rect x="240" y="40" width="240" height="240" fill="#0f1a2e" stroke="#1f3358"/>
            <rect x="250" y="50" width="220" height="220" fill="#111c33"/>
            <circle cx="460" cy="160" r="5" fill="#fbbf24"/>
            <text x="360" y="34" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui">TÜR (beweglich)</text>

            <!-- Magnet on door -->
            <g id="magnet">
              <rect x="248" y="150" width="26" height="32" rx="3" fill="#c084fc"/>
              <text x="261" y="170" text-anchor="middle" font-size="11" fill="#0b1424" font-family="system-ui" font-weight="800">N</text>
              <text x="261" y="195" text-anchor="middle" font-size="9" fill="#c084fc" font-family="system-ui">Magnet</text>
            </g>
            <!-- Magnetic field -->
            <circle id="mag-field" cx="225" cy="160" r="22" fill="url(#magField)" opacity="0"/>
          </g>

          <!-- Circuit -->
          <g id="circuit" transform="translate(40, 250)">
            <rect x="0" y="0" width="180" height="60" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="90" y="16" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui">STROMKREIS</text>
            <text id="circuit-status" x="90" y="38" text-anchor="middle" font-size="13" fill="#22c55e" font-family="system-ui" font-weight="700">GESCHLOSSEN</text>
            <text id="circuit-flow" x="90" y="52" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui">→ Ruhestrom fließt ✓</text>
          </g>

          <!-- Alarm -->
          <g id="reed-alarm" transform="translate(280, 250)" opacity="0">
            <rect x="0" y="0" width="200" height="60" rx="6" fill="#ef4444"/>
            <text x="100" y="38" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="700">⚠ EINBRUCH-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['reed','magnet'],         text: '① Reed-Kontakt im Rahmen + Permanentmagnet an der Tür. Beide gegenüber wenn die Tür zu ist.' },
        { t: 1400, h: ['mag-field'],             text: '② Tür geschlossen → Magnetfeld erreicht den Reed → die beiden magnetisierbaren Zungen ziehen sich an und schließen den Kontakt.' },
        { t: 3000, h: ['circuit'],               text: '③ Stromkreis ist geschlossen, Ruhestrom fließt permanent. EMA-Zentrale sieht: alles OK.' },
        { t: 4500, h: ['door'],                  text: '④ Tür wird geöffnet → Magnet entfernt sich → Magnetfeld am Reed verschwindet.', anim: 'door-open' },
        { t: 6000, h: ['circuit','reed-alarm'],  text: '⑤ Reed-Zungen federn auseinander → Stromkreis unterbrochen → ALARM! (Auch bei Kabelbruch oder Sabotage = sofort Alarm)', anim:'circuit-break' },
      ],
      cycle: 8500,
    },

    // ============== GLASBRUCH (Passiv-akustisch) ==============
    'glas-passiv': {
      title: 'Passiv-akustischer Glasbruchmelder',
      intro: 'Zwei-Phasen-Analyse: Tieffrequenz Aufprall + Hochfrequenz Splittern',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="gpg" x2="0" y2="1">
              <stop offset="0" stop-color="#38bdf8" stop-opacity=".2"/>
              <stop offset="1" stop-color="#22d3ee" stop-opacity=".05"/>
            </linearGradient>
          </defs>

          <!-- Window pane -->
          <rect x="80" y="50" width="320" height="180" fill="url(#gpg)" stroke="#38bdf8" stroke-width="2"/>
          <line x1="240" y1="50" x2="240" y2="230" stroke="#38bdf8" opacity=".5"/>
          <line x1="80" y1="140" x2="400" y2="140" stroke="#38bdf8" opacity=".5"/>

          <!-- Crack: appears in phases -->
          <g id="crack-low" stroke="#fbbf24" stroke-width="2" fill="none" opacity="0">
            <path d="M250,110 L270,140"/>
          </g>
          <g id="crack-high" stroke="#ef4444" stroke-width="1.6" fill="none" opacity="0">
            <path d="M270,140 L290,160 L275,180 L300,200"/>
            <path d="M290,160 L320,155"/>
            <path d="M275,180 L255,190"/>
          </g>

          <!-- Detector -->
          <g id="gb-detector">
            <rect x="200" y="14" width="80" height="26" rx="4" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="240" cy="27" r="5" fill="#22d3ee"/>
            <text x="240" y="50" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui">Akustischer Sensor (6m Radius)</text>
          </g>

          <!-- Phase 1: Low frequency curve (slow wave) -->
          <g id="phase1" transform="translate(440, 70)" opacity="0">
            <rect x="0" y="0" width="150" height="60" rx="4" fill="#0b1424" stroke="#fbbf24"/>
            <text x="75" y="14" text-anchor="middle" font-size="9" fill="#fbbf24" font-family="system-ui">PHASE 1: Tieffrequenz</text>
            <path d="M5,40 Q25,15 45,40 T85,40 T125,40 L145,40" stroke="#fbbf24" stroke-width="2" fill="none"/>
            <text x="75" y="55" text-anchor="middle" font-size="9" fill="#94a3c4" font-family="system-ui">≈ 100 Hz · Aufprall/Biegung</text>
          </g>

          <!-- Phase 2: High frequency (fast wave) -->
          <g id="phase2" transform="translate(440, 150)" opacity="0">
            <rect x="0" y="0" width="150" height="60" rx="4" fill="#0b1424" stroke="#ef4444"/>
            <text x="75" y="14" text-anchor="middle" font-size="9" fill="#ef4444" font-family="system-ui">PHASE 2: Hochfrequenz</text>
            <path d="M5,40 q3,-12 6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0 t6,0" stroke="#ef4444" stroke-width="1.5" fill="none"/>
            <text x="75" y="55" text-anchor="middle" font-size="9" fill="#94a3c4" font-family="system-ui">≈ 100 kHz · Splittern</text>
          </g>

          <!-- Decision -->
          <g id="gb-decision" transform="translate(440, 230)" opacity="0">
            <rect x="0" y="0" width="150" height="60" rx="4" fill="#162542" stroke="#22c55e" stroke-width="2"/>
            <text x="75" y="20" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui">Beide Phasen ✓</text>
            <text x="75" y="40" text-anchor="middle" font-size="13" fill="#ef4444" font-family="system-ui" font-weight="700">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['gb-detector'],             text: '① Der passiv-akustische Sensor sitzt an der Decke / Wand und horcht in den Raum (6 m Radius). Er deckt mehrere Scheiben gleichzeitig ab.' },
        { t: 1500, h: ['crack-low','phase1'],      text: '② Phase 1: Etwas trifft die Scheibe → niederfrequente Vibration (~100 Hz) breitet sich aus. Sensor erkennt Aufprall-/Biegungssignatur.' },
        { t: 3500, h: ['crack-high','phase2'],     text: '③ Phase 2: Glas zerbricht → hochfrequentes Splittern (~100 kHz). Charakteristische Bruchschall-Signatur.' },
        { t: 5500, h: ['gb-decision'],             text: '④ Logik: NUR wenn BEIDE Phasen in richtiger Reihenfolge auftreten → ALARM. Schützt gegen Fehlalarm durch laute Geräusche.' },
      ],
      cycle: 7500,
    },

    // ============== ERSCHÜTTERUNG ==============
    'piezo-erschuetterung': {
      title: 'Piezo-Erschütterungsmelder',
      intro: 'Piezokeramik wandelt mechanische Vibration in elektrische Spannung',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tresor -->
          <rect x="50" y="50" width="280" height="220" rx="8" fill="#162542" stroke="#94a3c4" stroke-width="3"/>
          <rect x="70" y="70" width="240" height="180" fill="#0b1424"/>
          <text x="190" y="170" text-anchor="middle" font-size="32" font-weight="800" fill="#94a3c4" font-family="system-ui">TRESOR</text>
          <circle cx="240" cy="200" r="14" fill="#fbbf24" opacity=".7"/>

          <!-- Piezo sensor on tresor -->
          <g id="piezo-sensor">
            <rect x="320" y="140" width="44" height="44" rx="4" fill="#38bdf8" stroke="#22d3ee" stroke-width="2"/>
            <text x="342" y="166" text-anchor="middle" font-size="11" fill="#0b1424" font-family="system-ui" font-weight="800">PZT</text>
            <text x="342" y="195" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui">Piezo</text>
          </g>

          <!-- Drill attacker -->
          <g id="drill" transform="translate(380, 156)" opacity="0">
            <rect x="0" y="-6" width="60" height="20" rx="2" fill="#fbbf24"/>
            <rect x="60" y="0" width="50" height="8" fill="#94a3c4"/>
            <text x="80" y="-12" font-size="10" fill="#fbbf24" font-family="system-ui">Bohrer</text>
          </g>

          <!-- Vibration waves emanating from drill point through metal -->
          <g id="vibration" opacity="0">
            <path d="M362,162 q-20,-10 -40,0 t-40,0 t-40,0" stroke="#ef4444" stroke-width="1.8" fill="none" opacity=".9"/>
            <path d="M362,168 q-20,10 -40,0 t-40,0 t-40,0" stroke="#ef4444" stroke-width="1.8" fill="none" opacity=".7"/>
            <path d="M362,156 q-20,-12 -40,0 t-40,0 t-40,0" stroke="#ef4444" stroke-width="1.8" fill="none" opacity=".5"/>
          </g>

          <!-- Voltage output -->
          <g id="piezo-output" transform="translate(400, 230)" opacity="0">
            <rect x="0" y="0" width="180" height="60" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="90" y="14" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui">SPANNUNG aus Piezo</text>
            <path d="M5,40 L20,40 L25,15 L30,55 L35,20 L40,50 L45,25 L50,45 L55,30 L60,40 L80,40 L100,40 L105,18 L110,55 L115,25 L120,40 L180,40"
              stroke="#22c55e" stroke-width="1.8" fill="none"/>
            <text x="90" y="55" text-anchor="middle" font-size="9" fill="#94a3c4" font-family="system-ui">Amplitude + Dauer > Schwelle</text>
          </g>

          <!-- Alarm -->
          <g id="piezo-alarm" transform="translate(400, 60)" opacity="0">
            <rect x="0" y="0" width="180" height="40" rx="6" fill="#ef4444"/>
            <text x="90" y="26" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="700">⚠ TRESOR-ANGRIFF</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['piezo-sensor'],         text: '① Piezo-Sensor wird DIREKT auf den Tresor geschraubt — Reichweite ~2 m auf gleicher Fläche.' },
        { t: 1400, h: ['drill','vibration'],    text: '② Angreifer bohrt/stemmt/flext am Tresor → mechanische Vibration breitet sich durch das Metall aus.' },
        { t: 3000, h: ['piezo-output'],         text: '③ Die Piezokeramik (PZT-Kristall) wandelt mechanische Verformung in elektrische Spannung um — quasi ein "Vibration-zu-Strom-Umsetzer".' },
        { t: 4500, h: ['piezo-alarm'],          text: '④ Auswerteinheit: Wenn Amplitude UND Dauer den Schwellwert überschreiten → ALARM. Schützt gegen Fehlalarme durch kurze Stöße.' },
      ],
      cycle: 7000,
    },

    // ============== IR-LICHTSCHRANKE ==============
    'ir-schranke': {
      title: 'IR-Lichtschranke · Mehrstrahl-System',
      intro: 'Codierte IR-Pulse 940 nm · Strahlunterbrechung = Alarm',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Sender -->
          <g id="ir-tx">
            <rect x="20" y="50" width="34" height="220" rx="6" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <text x="37" y="40" text-anchor="middle" font-size="12" fill="#22d3ee" font-family="system-ui" font-weight="700">TX</text>
            <text x="37" y="290" text-anchor="middle" font-size="9" fill="#22d3ee" font-family="system-ui">Sender</text>
          </g>

          <!-- Receiver -->
          <g id="ir-rx">
            <rect x="546" y="50" width="34" height="220" rx="6" fill="#162542" stroke="#38bdf8" stroke-width="2"/>
            <text x="563" y="40" text-anchor="middle" font-size="12" fill="#38bdf8" font-family="system-ui" font-weight="700">RX</text>
            <text x="563" y="290" text-anchor="middle" font-size="9" fill="#38bdf8" font-family="system-ui">Empfänger</text>
          </g>

          <!-- 4 beams -->
          <g id="ir-beams">
            <line id="b1" x1="54" y1="80"  x2="546" y2="80"  stroke="#22d3ee" stroke-width="2.5" opacity=".8" stroke-dasharray="6 4"/>
            <line id="b2" x1="54" y1="140" x2="546" y2="140" stroke="#22d3ee" stroke-width="2.5" opacity=".8" stroke-dasharray="6 4"/>
            <line id="b3" x1="54" y1="200" x2="546" y2="200" stroke="#22d3ee" stroke-width="2.5" opacity=".8" stroke-dasharray="6 4"/>
            <line id="b4" x1="54" y1="260" x2="546" y2="260" stroke="#22d3ee" stroke-width="2.5" opacity=".8" stroke-dasharray="6 4"/>
          </g>

          <!-- Code label -->
          <text id="ir-code" x="300" y="32" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="monospace" opacity="0">
            … 01101001 11010010 01101001 11010010 …
          </text>

          <!-- Person blocks 2 beams -->
          <g id="ir-person" transform="translate(300, 0)" opacity="0">
            <ellipse cx="0" cy="170" rx="20" ry="40" fill="#ef4444" opacity=".25"/>
            <circle cx="0" cy="140" r="12" fill="#e8edf7"/>
            <rect x="-10" y="152" width="20" height="48" rx="4" fill="#ef4444"/>
          </g>

          <!-- Block indicator -->
          <g id="ir-block" opacity="0">
            <line x1="54" y1="140" x2="546" y2="140" stroke="#ef4444" stroke-width="3"/>
            <line x1="54" y1="200" x2="546" y2="200" stroke="#ef4444" stroke-width="3"/>
            <text x="300" y="290" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui">Strahl 2 + 3 unterbrochen → AND-Logik → ALARM</text>
          </g>

          <!-- Sabotage attempt with foreign IR -->
          <g id="ir-sabotage" opacity="0">
            <text x="300" y="60" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui">Fremde IR-Lampe versucht Überbrücken — Codierung passt nicht → erkannt</text>
          </g>

          <!-- Alarm -->
          <g id="ir-alarm" opacity="0">
            <rect x="240" y="2" width="120" height="32" rx="6" fill="#ef4444"/>
            <text x="300" y="22" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="700">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['ir-tx','ir-rx'],              text: '① Sender (TX) und Empfänger (RX) gegenüber, exakt fluchtend. Distanz: 5 m (innen) bis 250 m (außen).' },
        { t: 1400, h: ['ir-beams','ir-code'],         text: '② TX sendet GEPULSTE IR-Strahlen bei 940 nm (für das Auge unsichtbar). Die Pulse sind digital codiert.' },
        { t: 3000, h: ['ir-person','ir-block'],       text: '③ Person durchquert → mehrere Strahlen werden gleichzeitig unterbrochen. Multi-Strahl-AND-Logik gegen Fehlalarm.' },
        { t: 5000, h: ['ir-sabotage'],                text: '④ Sabotage-Schutz: Externe IR-Lampe kann den Code nicht nachahmen → wird erkannt.' },
        { t: 6500, h: ['ir-alarm'],                   text: '⑤ Auswertung erkennt Unterbrechung der codierten Pulse → ALARM!' },
      ],
      cycle: 9000,
    },

    // ============== KAPAZITIV ==============
    'kapazitiv': {
      title: 'Kapazitiver Feldmelder',
      intro: 'Elektrostatisches Feld erkennt Annäherung VOR Berührung',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <radialGradient id="capGrad" cx=".5" cy=".5" r=".5">
              <stop offset="0" stop-color="#c084fc" stop-opacity=".05"/>
              <stop offset="1" stop-color="#c084fc" stop-opacity=".4"/>
            </radialGradient>
          </defs>

          <!-- Vitrine -->
          <rect x="220" y="80" width="160" height="200" fill="#162542" stroke="#c084fc" stroke-width="3"/>
          <text x="300" y="190" text-anchor="middle" font-size="18" font-weight="800" fill="#c084fc" font-family="system-ui">KUNST</text>
          <text x="300" y="70" text-anchor="middle" font-size="10" fill="#c084fc" font-family="system-ui">Tresor / Vitrine</text>

          <!-- Field rings -->
          <g id="cap-field" fill="none" stroke="#c084fc" stroke-width="1.5" opacity="0">
            <ellipse cx="300" cy="180" rx="120" ry="140"/>
            <ellipse cx="300" cy="180" rx="100" ry="120"/>
            <ellipse cx="300" cy="180" rx="80" ry="100"/>
          </g>
          <text id="cap-label" x="300" y="48" text-anchor="middle" font-size="11" fill="#c084fc" font-family="system-ui" opacity="0">
            Elektrostatisches Feld (sehr niedrige Energie)
          </text>

          <!-- Hand approaching -->
          <g id="cap-hand" transform="translate(540, 180)" opacity="0">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#fbbf24"/>
            <rect x="-14" y="-4" width="-40" height="10" rx="3" fill="#fbbf24"/>
            <text x="-30" y="40" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="system-ui">Hand</text>
          </g>

          <!-- Field disturbance -->
          <g id="cap-disturb" opacity="0">
            <text x="450" y="100" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui">Feld-Kapazität ändert sich</text>
            <path d="M420,170 Q430,150 440,170 Q450,190 460,170" stroke="#ef4444" stroke-width="2" fill="none"/>
          </g>

          <!-- Alarm BEFORE touch -->
          <g id="cap-alarm" transform="translate(40, 100)" opacity="0">
            <rect x="0" y="0" width="180" height="40" rx="6" fill="#ef4444"/>
            <text x="90" y="26" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="700">⚠ ALARM VOR Berührung!</text>
            <text x="90" y="58" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">~0,5 m Annäherung erkannt</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['cap-field','cap-label'],   text: '① Der Sensor erzeugt um das geschützte Objekt ein elektrostatisches Feld (sehr geringe Energie, harmlos).' },
        { t: 1600, h: ['cap-hand'],                text: '② Eine Hand nähert sich — der menschliche Körper hat eigene Kapazität.' },
        { t: 3200, h: ['cap-disturb'],             text: '③ Der Körper stört das Feld → die gemessene Kapazität ändert sich messbar.' },
        { t: 4600, h: ['cap-alarm'],               text: '④ Bei Überschreiten der Schwelle → ALARM, BEVOR das Objekt überhaupt berührt wird (typ. 0,5 m Vorwarnung)!' },
      ],
      cycle: 7500,
    },

    // ============== ULTRASCHALL ==============
    'ultraschall': {
      title: 'Ultraschallmelder · Doppler 40 kHz',
      intro: 'Sendet 40 kHz Ultraschall, erkennt Bewegung über Doppler in geschlossenen Räumen',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Room walls -->
          <rect x="20" y="40" width="560" height="240" fill="rgba(56,189,248,.04)" stroke="#1f3358" stroke-width="2"/>
          <text x="300" y="32" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">Geschlossener Raum (Schall reflektiert)</text>

          <!-- Sensor on wall -->
          <g id="us-sensor">
            <rect x="22" y="140" width="30" height="40" rx="4" fill="#162542" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="37" cy="160" r="5" fill="#22d3ee"/>
            <text x="37" y="200" text-anchor="middle" font-size="9" fill="#22d3ee" font-family="system-ui">US 40 kHz</text>
          </g>

          <!-- Outgoing US waves filling the room -->
          <g id="us-out" opacity="0">
            <circle cx="52" cy="160" r="60" fill="none" stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="3 3"/>
            <circle cx="52" cy="160" r="120" fill="none" stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="3 3" opacity=".7"/>
            <circle cx="52" cy="160" r="180" fill="none" stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="3 3" opacity=".5"/>
            <circle cx="52" cy="160" r="240" fill="none" stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="3 3" opacity=".3"/>
            <text x="300" y="60" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui" opacity=".9">40 kHz Ultraschall füllt das Raumvolumen</text>
          </g>

          <!-- Person -->
          <g id="us-person" transform="translate(380, 180)" opacity="0">
            <circle cx="0" cy="-10" r="10" fill="#e8edf7"/>
            <rect x="-7" y="0" width="14" height="30" rx="3" fill="#818cf8"/>
            <text x="0" y="50" text-anchor="middle" font-size="10" fill="#818cf8" font-family="system-ui">Mensch bewegt sich</text>
          </g>

          <!-- Returning wave with different frequency -->
          <g id="us-return" opacity="0">
            <path d="M375,180 Q330,170 285,180 Q240,190 195,180 Q150,170 105,180 Q60,190 52,180"
              stroke="#ef4444" stroke-width="1.6" fill="none"/>
            <text x="300" y="240" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">Reflektierte Welle: f₁ ≠ f₀ → Doppler</text>
          </g>

          <!-- Alarm -->
          <g id="us-alarm" opacity="0">
            <rect x="430" y="60" width="140" height="32" rx="6" fill="#ef4444"/>
            <text x="500" y="80" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="700">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['us-sensor'],          text: '① Ultraschallmelder ist AKTIV — sendet 40 kHz Schallwellen (für Menschen unhörbar).' },
        { t: 1300, h: ['us-out'],             text: '② Die Wellen füllen den geschlossenen Raum durch vielfache Reflexion an Wänden / Möbeln.' },
        { t: 3000, h: ['us-person','us-return'], text: '③ Mensch bewegt sich → reflektierte Welle hat verschobene Frequenz (Doppler-Effekt).' },
        { t: 4800, h: ['us-alarm'],           text: '④ Auswertung erkennt Frequenzdifferenz → ALARM. Achtung: funktioniert NUR in geschlossenen Räumen!' },
      ],
      cycle: 7000,
    },

    // ============== BRANDMELDER ==============
    'rauch-streulicht': {
      title: 'Optischer Rauchmelder · Streulicht-Prinzip',
      intro: 'Tyndall-Effekt: Rauchpartikel streuen LED-Licht in dunkle Detektionskammer',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Ceiling -->
          <rect x="0" y="0" width="600" height="14" fill="#1f3358"/>
          <text x="300" y="10" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui">DECKE</text>

          <!-- Detector body -->
          <g id="rm-body">
            <ellipse cx="300" cy="34" rx="26" ry="14" fill="#162542" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="300" cy="34" r="6" fill="#ef4444"/>
          </g>

          <!-- Detection chamber zoomed in (right) -->
          <g id="rm-chamber">
            <rect x="350" y="80" width="220" height="180" rx="8" fill="#0b1424" stroke="#94a3c4" stroke-width="2"/>
            <text x="460" y="74" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">DUNKLE DETEKTIONS-KAMMER</text>
            <!-- LED -->
            <circle id="rm-led" cx="380" cy="120" r="10" fill="#fbbf24"/>
            <text x="380" y="142" text-anchor="middle" font-size="9" fill="#fbbf24" font-family="system-ui">LED</text>
            <!-- Photo sensor right-angle -->
            <rect x="540" y="180" width="20" height="14" fill="#22d3ee"/>
            <text x="550" y="208" text-anchor="middle" font-size="9" fill="#22d3ee" font-family="system-ui">PD</text>
            <!-- LED beam (light only goes straight, no reflection initially) -->
            <line id="rm-beam" x1="390" y1="120" x2="560" y2="120" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="3 3" opacity=".4"/>
          </g>

          <!-- Smoke rising up -->
          <g id="rm-smoke" opacity="0">
            <circle cx="300" cy="120" r="14" fill="#94a3c4" opacity=".5"/>
            <circle cx="320" cy="110" r="18" fill="#94a3c4" opacity=".4"/>
            <circle cx="280" cy="105" r="15" fill="#94a3c4" opacity=".5"/>
            <text x="300" y="170" text-anchor="middle" font-size="10" fill="#94a3c4" font-family="system-ui">Rauch dringt in Kammer</text>
          </g>

          <!-- Smoke inside chamber + scattered light -->
          <g id="rm-scatter" opacity="0">
            <circle cx="460" cy="160" r="6" fill="#94a3c4" opacity=".5"/>
            <circle cx="480" cy="170" r="5" fill="#94a3c4" opacity=".5"/>
            <circle cx="440" cy="170" r="6" fill="#94a3c4" opacity=".5"/>
            <!-- Scattered light beams to photo sensor -->
            <line x1="460" y1="160" x2="540" y2="190" stroke="#fbbf24" stroke-width="1.5"/>
            <line x1="480" y1="170" x2="540" y2="190" stroke="#fbbf24" stroke-width="1.5"/>
            <line x1="440" y1="170" x2="540" y2="190" stroke="#fbbf24" stroke-width="1.5"/>
            <text x="460" y="240" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="system-ui">Tyndall-Effekt: gestreutes Licht trifft Sensor</text>
          </g>

          <!-- Fire below -->
          <g id="rm-fire">
            <path d="M100,260 Q80,220 110,200 Q130,225 120,260 Z" fill="#ef4444"/>
            <path d="M105,260 Q90,230 110,215 Q125,232 117,260 Z" fill="#fbbf24"/>
            <text x="110" y="280" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="system-ui">Brand</text>
          </g>

          <!-- Alarm -->
          <g id="rm-alarm" opacity="0">
            <rect x="30" y="40" width="140" height="32" rx="6" fill="#ef4444"/>
            <text x="100" y="60" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="700">⚠ FEUER-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['rm-body','rm-chamber'],   text: '① Rauchmelder an der Decke. Innen: dunkle Kammer mit LED und Foto-Sensor (PD), zueinander im 90°-Winkel.' },
        { t: 1500, h: ['rm-beam'],                text: '② LED leuchtet permanent — normalerweise gelangt KEIN Licht zum Foto-Sensor (dunkle Kammer, kein Streumedium).' },
        { t: 3000, h: ['rm-fire','rm-smoke'],     text: '③ Brand entsteht → Rauchpartikel steigen auf → dringen durch Lüftungsschlitze in die Kammer.' },
        { t: 4800, h: ['rm-scatter'],             text: '④ Rauchpartikel streuen das LED-Licht (Tyndall-Effekt) → Streulicht trifft den Foto-Sensor.' },
        { t: 6600, h: ['rm-alarm'],               text: '⑤ Foto-Sensor registriert Licht → Auswerteinheit löst Brand-Alarm aus.' },
      ],
      cycle: 9000,
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
        <button class="btn ghost expl-restart"><i class="fas fa-rotate-left"></i> Neu</button>
        <div class="expl-step-counter muted small"></div>
      </div>
    `;
    container.appendChild(wrap);

    const svg = wrap.querySelector('svg');
    const text = wrap.querySelector('.expl-text');
    const fill = wrap.querySelector('.expl-fill');
    const toggle = wrap.querySelector('.expl-toggle');
    const restart = wrap.querySelector('.expl-restart');
    const counter = wrap.querySelector('.expl-step-counter');

    let playing = false;
    let elapsed = 0;
    let lastTick = 0;
    let raf = null;

    function applyStep(stepIndex) {
      // Reset all opacities to start
      def.steps.forEach((s, i) => {
        if (i > stepIndex) {
          s.h.forEach(id => {
            const e = svg.querySelector('#'+id);
            if (e) e.style.opacity = 0;
          });
        }
      });
      // Show steps up to this one
      for (let i=0; i<=stepIndex; i++) {
        const s = def.steps[i];
        s.h.forEach(id => {
          const e = svg.querySelector('#'+id);
          if (e) {
            e.style.transition = 'opacity .5s ease';
            e.style.opacity = 1;
          }
        });
      }
      text.textContent = def.steps[stepIndex]?.text || '';
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
      const dt = now - lastTick;
      lastTick = now;
      elapsed += dt;
      if (elapsed > def.cycle) {
        elapsed = 0;
      }
      fill.style.width = (elapsed / def.cycle * 100) + '%';
      const step = getCurrentStep(elapsed);
      applyStep(step);
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
      if (!playing) {
        toggle.click();
      }
    });

    reset();
    // Auto-start
    setTimeout(() => toggle.click(), 400);

    return wrap;
  }

  function hasExplainer(key) { return !!EXPLAINERS[key]; }

  return { player, hasExplainer, EXPLAINERS };
})();
