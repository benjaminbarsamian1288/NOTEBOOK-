/* Letzte fehlende Explainer-Videos für die komplette Enzyklopädie. */

(function() {
  if (!window.EXPL) {
    document.addEventListener('DOMContentLoaded', addRest);
  } else {
    addRest();
  }

  function addRest() {
    if (!window.EXPL) return;
    const E = window.EXPL.EXPLAINERS;

    // ============== DRUCKMATTE ==============
    E['druckmatte'] = {
      title: 'Druckmatte / Trittmelder',
      intro: 'Zwei Folien · beim Betreten berühren sich die Kontakte',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Floor -->
          <rect x="0" y="220" width="600" height="100" fill="#1f3358"/>
          <line x1="0" y1="220" x2="600" y2="220" stroke="#475569" stroke-width="2"/>

          <!-- Carpet covering mat -->
          <g id="carpet">
            <rect x="100" y="208" width="400" height="14" fill="#7c2d12" stroke="#5a2010" stroke-width="1"/>
            <text x="300" y="218" text-anchor="middle" font-size="8" fill="#fef3c7" font-family="system-ui">Teppich</text>
          </g>

          <!-- Mat exposed (cutaway) -->
          <g id="mat" opacity="0">
            <!-- Top foil -->
            <rect x="180" y="195" width="240" height="6" fill="#22d3ee" stroke="#0ea5e9" stroke-width="1"/>
            <!-- Gap with spacers -->
            <rect x="180" y="201" width="240" height="4" fill="#0c0a1a"/>
            <rect x="186" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="216" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="246" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="276" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="306" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="336" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="366" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="396" y="201" width="3" height="4" fill="#94a3b8"/>
            <rect x="416" y="201" width="3" height="4" fill="#94a3b8"/>
            <!-- Bottom foil -->
            <rect x="180" y="205" width="240" height="6" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
            <text x="300" y="190" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui" font-weight="700">2 Kontaktfolien mit Spacern</text>
          </g>

          <!-- Person stepping on -->
          <g id="person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="600 0; 300 0; 300 0; 300 0" keyTimes="0; 0.5; 0.8; 1" dur="10s" repeatCount="indefinite"/>
              <circle cx="0" cy="60" r="18" fill="#e8edf7"/>
              <rect x="-15" y="80" width="30" height="60" rx="5" fill="#475569"/>
              <rect x="-20" y="140" width="40" height="50" rx="3" fill="#1e293b"/>
            </g>
          </g>

          <!-- Pressure arrow when person on -->
          <g id="press" opacity="0">
            <path d="M280 170 L280 195" stroke="#ef4444" stroke-width="3" marker-end="url(#prarrow)"/>
            <path d="M300 170 L300 195" stroke="#ef4444" stroke-width="3" marker-end="url(#prarrow)"/>
            <path d="M320 170 L320 195" stroke="#ef4444" stroke-width="3" marker-end="url(#prarrow)"/>
            <defs>
              <marker id="prarrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/>
              </marker>
            </defs>
          </g>

          <!-- Circuit closed indicator -->
          <g id="circuit" opacity="0" transform="translate(40, 50)">
            <rect x="0" y="0" width="200" height="60" rx="6" fill="#0b1424" stroke="#ef4444" stroke-width="2"/>
            <text x="100" y="18" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui" font-weight="700">KONTAKT GESCHLOSSEN</text>
            <text x="100" y="40" text-anchor="middle" font-size="14" fill="#ef4444" font-family="system-ui" font-weight="800">⚠ ALARM</text>
            <text x="100" y="54" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">Folien berühren sich</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['carpet'],   text:'① Die Druckmatte liegt UNSICHTBAR unter dem Teppich, Fliesen oder Boden. Niemand sieht sie.' },
        { t: 4000, h: ['mat'],      text:'② Im Querschnitt: zwei dünne Kontaktfolien, durch kleine Spacer auf Abstand gehalten. Normalerweise kein Stromfluss.' },
        { t: 8000, h: ['person'],   text:'③ Eine Person tritt auf den Bodenbelag → das Gewicht drückt die obere Folie auf die untere.' },
        { t: 12000,h: ['press','circuit'], text:'④ Die Folien berühren sich → Stromkreis geschlossen → ALARM! Pro Matte typ. 1–2 m². Schutz für SÜ 4–6.' },
      ],
      cycle: 16000,
    };

    // ============== WASSERMELDER ==============
    E['wassermelder'] = {
      title: 'Wassermelder · Leitfähigkeit',
      intro: 'Zwei Elektroden – Wasser dazwischen schließt den Stromkreis',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Floor -->
          <rect x="0" y="220" width="600" height="100" fill="#1f3358"/>

          <!-- Sensor unit -->
          <g id="sensor">
            <rect x="240" y="160" width="120" height="50" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="270" cy="185" r="6" fill="#38bdf8">
              <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="320" y="190" font-size="11" fill="#475569" font-family="system-ui" font-weight="700">H₂O</text>
            <!-- Electrodes hanging down -->
            <rect x="266" y="210" width="3" height="20" fill="#fbbf24"/>
            <rect x="330" y="210" width="3" height="20" fill="#fbbf24"/>
            <text x="267" y="244" text-anchor="middle" font-size="8" fill="#fbbf24" font-family="system-ui">+</text>
            <text x="331" y="244" text-anchor="middle" font-size="8" fill="#fbbf24" font-family="system-ui">−</text>
          </g>

          <!-- Drip animation -->
          <g id="drip" opacity="0">
            <g>
              <ellipse cx="160" cy="50" rx="14" ry="20" fill="#0ea5e9" opacity=".7">
                <animate attributeName="cy" values="50; 220" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7; 0.7; 0" keyTimes="0; 0.8; 1" dur="1.5s" repeatCount="indefinite"/>
              </ellipse>
              <ellipse cx="160" cy="50" rx="6" ry="10" fill="#38bdf8" opacity=".9">
                <animate attributeName="cy" values="50; 220" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9; 0.9; 0" keyTimes="0; 0.8; 1" dur="1.5s" repeatCount="indefinite"/>
              </ellipse>
            </g>
            <text x="160" y="40" text-anchor="middle" font-size="10" fill="#0ea5e9" font-family="system-ui">Wasserschaden</text>
          </g>

          <!-- Water puddle building up -->
          <g id="puddle" opacity="0">
            <ellipse cx="300" cy="222" rx="180" ry="10" fill="#0ea5e9" opacity=".55"/>
            <ellipse cx="300" cy="220" rx="160" ry="6" fill="#38bdf8" opacity=".7"/>
            <text x="300" y="260" text-anchor="middle" font-size="11" fill="#38bdf8" font-family="system-ui">Wasser auf Boden</text>
          </g>

          <!-- Circuit closed by water -->
          <g id="conduct" opacity="0">
            <path d="M267 230 L333 230" stroke="#22c55e" stroke-width="3" stroke-dasharray="6 4">
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="0.5s" repeatCount="indefinite"/>
            </path>
            <text x="300" y="284" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui">Strom fließt durch Wasser ↗</text>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="40" y="50" width="180" height="46" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="130" y="78" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ WASSER-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['sensor'],         text:'① Der Wassermelder hat zwei Elektroden am Boden, im trockenen Zustand: Luft dazwischen, KEIN Stromfluss.' },
        { t: 3500, h: ['drip'],           text:'② Ein Leck entsteht → Wasser tropft auf den Boden.' },
        { t: 7000, h: ['puddle'],         text:'③ Eine Pfütze bildet sich – das Wasser erreicht die Elektroden.' },
        { t: 10500,h: ['conduct','alarm'],text:'④ Wasser leitet Strom → Stromkreis geschlossen → ALARM! Ideal für Server-Räume, Keller, unter Spülmaschinen.' },
      ],
      cycle: 14000,
    };

    // ============== GASMELDER ==============
    E['gasmelder'] = {
      title: 'Gasmelder (CO / Methan)',
      intro: 'Katalytisches Element verbrennt Gas und ändert Temperatur → Signal',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Wall + sensor mount -->
          <rect x="0" y="0" width="22" height="320" fill="#1f3358"/>
          <g id="sensor">
            <rect x="22" y="120" width="80" height="80" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <!-- Gas inlet grille -->
            <g stroke="#94a3b8" stroke-width="1" fill="none">
              <ellipse cx="62" cy="160" rx="22" ry="18"/>
              <ellipse cx="62" cy="160" rx="15" ry="12"/>
              <ellipse cx="62" cy="160" rx="8" ry="6"/>
            </g>
            <text x="62" y="212" text-anchor="middle" font-size="10" fill="#475569" font-family="system-ui" font-weight="700">CO</text>
          </g>

          <!-- Gas cloud rising -->
          <g id="gas" opacity="0">
            <g fill="#fbbf24">
              <circle cx="200" cy="280" r="12" opacity=".4">
                <animate attributeName="cy" values="280;130" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".4;0" dur="4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="220" cy="270" r="16" opacity=".4">
                <animate attributeName="cy" values="270;130" dur="4s" begin="0.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".4;0" dur="4s" begin="0.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="180" cy="290" r="14" opacity=".4">
                <animate attributeName="cy" values="290;130" dur="4s" begin="1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".4;0" dur="4s" begin="1s" repeatCount="indefinite"/>
              </circle>
              <circle cx="240" cy="280" r="10" opacity=".4">
                <animate attributeName="cy" values="280;130" dur="4s" begin="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".4;0" dur="4s" begin="1.5s" repeatCount="indefinite"/>
              </circle>
            </g>
            <text x="220" y="310" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="600">CO-Gas steigt auf</text>
          </g>

          <!-- Catalytic element (heated bead) -->
          <g id="catalyst" opacity="0" transform="translate(380, 100)">
            <rect x="0" y="0" width="180" height="120" rx="6" fill="#0b1424" stroke="#475569" stroke-width="2"/>
            <text x="90" y="18" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui" font-weight="700">KATALYTISCHES ELEMENT</text>
            <!-- Heated bead -->
            <circle cx="90" cy="65" r="22" fill="#ef4444" opacity=".6">
              <animate attributeName="r" values="20;26;20" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="90" cy="65" r="14" fill="#fbbf24"/>
            <text x="90" y="100" text-anchor="middle" font-size="9" fill="#fbbf24" font-family="system-ui">+ Gas → exotherm</text>
          </g>

          <!-- Temperature reading -->
          <g id="temp" opacity="0" transform="translate(380, 230)">
            <rect x="0" y="0" width="180" height="50" rx="6" fill="#0b1424" stroke="#ef4444" stroke-width="2"/>
            <text x="90" y="18" text-anchor="middle" font-size="10" fill="#ef4444" font-family="monospace" font-weight="700">TEMP-SIGNAL</text>
            <text x="90" y="40" text-anchor="middle" font-size="14" fill="#ef4444" font-family="monospace" font-weight="800">→ ALARM</text>
          </g>

          <!-- Big alarm -->
          <g id="alarm" opacity="0">
            <rect x="22" y="40" width="280" height="50" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="162" y="72" text-anchor="middle" font-size="16" fill="white" font-family="system-ui" font-weight="800">⚠ CO-VERGIFTUNGS-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['sensor'],          text:'① Der Gasmelder hat eine offene Detektor-Kammer, durch die Raumluft natürlich strömt.' },
        { t: 4000, h: ['gas'],             text:'② Tritt aus einem defekten Gerät Kohlenmonoxid (CO) aus, dringt es in die Kammer ein.' },
        { t: 8000, h: ['catalyst'],        text:'③ Im Sensor sitzt ein heißes katalytisches Element. Trifft Gas darauf → exotherme Reaktion → Element heizt zusätzlich.' },
        { t: 12000,h: ['temp'],            text:'④ Eine zweite Spule misst die Temperatur. Differenz wird ausgewertet.' },
        { t: 16000,h: ['alarm'],           text:'⑤ Bei Überschreiten der Schwelle (typ. 30 ppm CO) → ALARM. LEBENSRETTEND – CO ist geruchlos und tödlich.' },
      ],
      cycle: 20000,
    };

    // ============== MULTISENSOR (Rauch + Wärme) ==============
    E['multisensor'] = {
      title: 'Multisensor-Brandmelder · Rauch + Wärme',
      intro: 'Kombiniert optisches Streulicht UND Wärme — beste Erkennung mit wenig Fehlalarmen',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="0" y="0" width="600" height="14" fill="#1f3358"/>

          <!-- Detector body -->
          <g id="detector">
            <ellipse cx="300" cy="34" rx="32" ry="16" fill="#162542" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="300" cy="34" r="7" fill="#ef4444">
              <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Two sensors inside (close-up) -->
          <g id="sensors" opacity="0">
            <!-- Optical chamber -->
            <rect x="320" y="100" width="120" height="80" rx="6" fill="#0b1424" stroke="#fbbf24" stroke-width="2"/>
            <text x="380" y="118" text-anchor="middle" font-size="9" fill="#fbbf24" font-family="system-ui" font-weight="700">OPTISCHE KAMMER</text>
            <circle cx="340" cy="140" r="6" fill="#fbbf24"/>
            <rect x="420" y="155" width="14" height="10" fill="#22d3ee"/>
            <line x1="346" y1="140" x2="430" y2="155" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2 2"/>
            <text x="380" y="172" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">Streulicht</text>

            <!-- Thermal element -->
            <rect x="170" y="100" width="120" height="80" rx="6" fill="#0b1424" stroke="#ef4444" stroke-width="2"/>
            <text x="230" y="118" text-anchor="middle" font-size="9" fill="#ef4444" font-family="system-ui" font-weight="700">THERMISTOR</text>
            <circle cx="230" cy="145" r="14" fill="#ef4444" opacity=".5">
              <animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="230" cy="145" r="8" fill="#fbbf24"/>
            <text x="230" y="172" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">Δ Temperatur</text>
          </g>

          <!-- Fire scene -->
          <g id="fire">
            <path d="M120 290 Q100 250 130 230 Q160 255 145 290 Z" fill="#ef4444">
              <animateTransform attributeName="transform" type="scale" values="1 1; 1 1.1; 1 1" dur="0.4s" repeatCount="indefinite" additive="sum"/>
            </path>
            <path d="M125 290 Q108 260 130 240 Q150 258 142 290 Z" fill="#fbbf24"/>
            <text x="130" y="312" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui">Brand</text>
          </g>

          <!-- Smoke + heat rising -->
          <g id="rising" opacity="0">
            <!-- Smoke particles -->
            <circle cx="140" cy="210" r="10" fill="#94a3b8" opacity=".5"><animate attributeName="cy" values="210;30" dur="4s" repeatCount="indefinite"/></circle>
            <circle cx="155" cy="220" r="12" fill="#94a3b8" opacity=".4"><animate attributeName="cy" values="220;30" dur="4s" begin="0.5s" repeatCount="indefinite"/></circle>
            <!-- Heat shimmer -->
            <path d="M125 220 Q130 200 125 180" stroke="#ef4444" stroke-width="1.5" fill="none" opacity=".5">
              <animate attributeName="d" values="M125 220 Q130 200 125 180; M125 220 Q120 200 125 180; M125 220 Q130 200 125 180" dur="0.6s" repeatCount="indefinite"/>
            </path>
          </g>

          <!-- Combined decision -->
          <g id="combine" opacity="0" transform="translate(50, 230)">
            <rect x="0" y="0" width="500" height="60" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="250" y="16" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">FUSION (UND-Verknüpfung mit Schwellen)</text>
            <text x="80" y="38" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">Rauch: ✓</text>
            <text x="250" y="38" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Wärme: ✓</text>
            <text x="420" y="38" text-anchor="middle" font-size="13" fill="#22c55e" font-family="system-ui" font-weight="800">→ ECHTER BRAND</text>
            <text x="250" y="54" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">Staub allein → ignoriert · Hitze allein → ignoriert</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['detector'],          text:'① Der Multisensor sitzt an der Decke und vereint ZWEI Detektoren in einem Gehäuse.' },
        { t: 4000, h: ['sensors'],           text:'② Innen: links der Thermistor (misst Temperatur), rechts die optische Kammer mit LED + Foto-Sensor.' },
        { t: 8000, h: ['fire','rising'],     text:'③ Bei einem Brand entstehen GLEICHZEITIG Rauchpartikel UND Wärme – beides steigt zur Decke.' },
        { t: 12000,h: ['combine'],           text:'④ Beide Signale werden kombiniert ausgewertet. Wenn BEIDE auslösen → echter Brand-Alarm.' },
        { t: 16000,h: [],                    text:'⑤ Staub allein (kein Hitze) → kein Alarm. Heißer Föhn (kein Rauch) → kein Alarm. → Beste Fehlalarm-Reduktion!' },
      ],
      cycle: 20000,
    };

    // ============== ZAUN-FOS (Glasfaser) ==============
    E['zaun-fos'] = {
      title: 'Glasfaser-Zaunsensorik (FOS)',
      intro: 'Laser durch Glasfaser am Zaun – Vibration ändert Lichtlaufzeit (OTDR)',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect y="200" width="600" height="120" fill="#1f3358"/>
          <rect width="600" height="200" fill="rgba(11,20,36,.6)"/>

          <!-- Long fence -->
          <g stroke="#94a3b8" stroke-width="1.5">
            ${Array.from({length:8}).map((_,i)=>`<line x1="${30+i*72}" y1="200" x2="${30+i*72}" y2="80"/>`).join('')}
            <line x1="30" y1="100" x2="582" y2="100" stroke-dasharray="4 4"/>
            <line x1="30" y1="140" x2="582" y2="140" stroke-dasharray="4 4"/>
            <line x1="30" y1="180" x2="582" y2="180" stroke-dasharray="4 4"/>
          </g>

          <!-- Fiber cable -->
          <g id="fiber" opacity="0">
            <line x1="30" y1="90" x2="582" y2="90" stroke="#a78bfa" stroke-width="3"/>
            <text x="300" y="76" text-anchor="middle" font-size="11" fill="#a78bfa" font-family="system-ui" font-weight="700">Glasfaser entlang Zaun</text>
          </g>

          <!-- Laser pulses traveling -->
          <g id="pulses" opacity="0">
            <circle cx="50" cy="90" r="6" fill="#fbbf24">
              <animate attributeName="cx" values="50; 582" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50" cy="90" r="6" fill="#fbbf24">
              <animate attributeName="cx" values="50; 582" dur="2s" begin="0.7s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0" dur="2s" begin="0.7s" repeatCount="indefinite"/>
            </circle>
            <text x="300" y="52" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="system-ui">Laser-Pulse</text>
          </g>

          <!-- Intruder cutting -->
          <g id="intruder" opacity="0">
            <g transform="translate(380, 150)">
              <circle cx="0" cy="0" r="10" fill="#ef4444"/>
              <rect x="-7" y="10" width="14" height="22" fill="#ef4444"/>
              <line x1="0" y1="14" x2="20" y2="0" stroke="#ef4444" stroke-width="3"/>
            </g>
            <!-- Vibration on fiber -->
            <g>
              <path d="M370 90 q5 -10 10 0 t10 0 t10 0" stroke="#fbbf24" stroke-width="2" fill="none">
                <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite"/>
              </path>
            </g>
          </g>

          <!-- OTDR processing -->
          <g id="otdr" opacity="0" transform="translate(40, 240)">
            <rect x="0" y="0" width="520" height="60" rx="6" fill="#0b1424" stroke="#22d3ee" stroke-width="2"/>
            <text x="260" y="18" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="monospace" font-weight="700">OTDR · LICHTLAUFZEIT-MESSUNG</text>
            <!-- Trace -->
            <path d="M10 50 L80 50 L100 45 L160 45 L180 42 L240 42 L260 38 L320 38 L340 22 L360 22 L380 36 L440 36 L460 32 L510 32"
              stroke="#22d3ee" stroke-width="1.5" fill="none">
              <animate attributeName="d"
                values="M10 50 L80 50 L100 45 L160 45 L180 42 L240 42 L260 38 L320 38 L340 22 L360 22 L380 36 L440 36 L460 32 L510 32; M10 50 L80 50 L100 45 L160 45 L180 42 L240 42 L260 38 L320 38 L340 22 L360 22 L380 36 L440 36 L460 32 L510 32"
                dur="0.5s" repeatCount="indefinite"/>
            </path>
            <!-- Spike at intruder position -->
            <circle cx="350" cy="22" r="6" fill="#ef4444">
              <animate attributeName="r" values="4;8;4" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            <text x="350" y="8" text-anchor="middle" font-size="8" fill="#ef4444" font-family="system-ui" font-weight="700">↓ ANOMALIE</text>
          </g>

          <!-- Location indicator -->
          <g id="loc" opacity="0">
            <rect x="320" y="35" width="120" height="22" rx="4" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="380" y="50" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="800">⚠ Position 1.2 km</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: [],                text:'① Ein Zaun erstreckt sich oft über mehrere Kilometer. Pro Sensor ist das teuer.' },
        { t: 3500, h: ['fiber'],         text:'② Eine einzige Glasfaser wird entlang des kompletten Zauns verlegt – bis zu 40 km lang.' },
        { t: 7000, h: ['pulses'],        text:'③ Eine zentrale Einheit sendet Laser-Pulse durch die Faser und misst die Lichtlaufzeit (OTDR-Verfahren).' },
        { t: 10500,h: ['intruder'],      text:'④ Wenn jemand am Zaun klettert oder schneidet, ändert sich die Faser-Geometrie minimal (Vibration).' },
        { t: 14000,h: ['otdr','loc'],    text:'⑤ Diese Änderung verursacht eine Anomalie im Reflexions-Profil → Position auf wenige Meter genau lokalisierbar!' },
      ],
      cycle: 18000,
    };

    // ============== THERMALKAMERA ==============
    E['thermalkam'] = {
      title: 'Thermalkamera · Wärmebild + KI',
      intro: 'Passiver Mikrobolometer-Sensor erkennt jede Wärmequelle bei Nacht und Nebel',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Camera on pole -->
          <g id="cam">
            <rect x="22" y="100" width="20" height="180" fill="#475569"/>
            <rect x="14" y="80" width="60" height="40" rx="6" fill="#0c0a1a" stroke="#ef4444" stroke-width="2"/>
            <circle cx="70" cy="100" r="20" fill="#0c0a1a"/>
            <circle cx="70" cy="100" r="14" fill="url(#thermLens)"/>
            <defs>
              <radialGradient id="thermLens" cx=".4" cy=".4">
                <stop offset="0" stop-color="#fbbf24"/>
                <stop offset=".5" stop-color="#ef4444"/>
                <stop offset="1" stop-color="#7c3aed"/>
              </radialGradient>
            </defs>
          </g>

          <!-- View frustum -->
          <g id="view" opacity="0">
            <path d="M85 100 L580 30 L580 240 Z" fill="rgba(239,68,68,.08)"/>
            <text x="350" y="40" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="600">8–14 µm Wärmebild</text>
          </g>

          <!-- Heat sources in scene -->
          <g id="scene" opacity="0">
            <!-- Background gradient -->
            <rect x="100" y="50" width="480" height="220" fill="url(#thermBg)" opacity=".6"/>
            <defs>
              <linearGradient id="thermBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#1e1b4b"/>
                <stop offset="1" stop-color="#0c0a1a"/>
              </linearGradient>
            </defs>
            <!-- Person (red hot blob) -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="500 50; 200 50; 500 50" dur="10s" repeatCount="indefinite"/>
              <radialGradient id="hotBody" cx=".5" cy=".5">
                <stop offset="0" stop-color="#fbbf24"/>
                <stop offset=".5" stop-color="#ef4444"/>
                <stop offset="1" stop-color="#7c3aed"/>
              </radialGradient>
              <ellipse cx="0" cy="80" rx="22" ry="40" fill="url(#hotBody)" opacity=".95"/>
              <circle cx="0" cy="40" r="20" fill="url(#hotBody)"/>
            </g>
            <!-- Background warm: building -->
            <rect x="380" y="160" width="100" height="100" fill="#312e81" opacity=".4"/>
            <!-- Tree (cold) -->
            <ellipse cx="180" cy="200" rx="22" ry="44" fill="#0c4a6e" opacity=".5"/>
          </g>

          <!-- AI Bounding box -->
          <g id="ai" opacity="0">
            <rect x="180" y="60" width="60" height="120" fill="none" stroke="#22c55e" stroke-width="3" stroke-dasharray="6 3">
              <animate attributeName="stroke-dashoffset" values="0;-18" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="180" y="44" width="100" height="14" fill="#22c55e"/>
            <text x="230" y="54" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">MENSCH 99%</text>
          </g>

          <!-- Use case: 100% darkness -->
          <g id="dark" opacity="0">
            <rect x="40" y="240" width="540" height="50" rx="6" fill="#0b1424" stroke="#475569"/>
            <text x="310" y="260" text-anchor="middle" font-size="11" fill="#94a3b8" font-family="system-ui">Funktioniert bei:</text>
            <text x="60" y="282" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">✓ 100% Dunkelheit</text>
            <text x="240" y="282" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">✓ Nebel</text>
            <text x="360" y="282" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">✓ Regen</text>
            <text x="460" y="282" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">✓ Tarnkleidung</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['cam'],          text:'① Die Thermalkamera ist PASSIV – sie sendet keine Strahlung, sondern misst die natürliche IR-Strahlung jedes Objekts (8–14 µm).' },
        { t: 4000, h: ['view'],         text:'② Der Mikrobolometer-Sensor scannt das Bild und erstellt ein Wärmebild: heiß = gelb/rot, kalt = blau/violett.' },
        { t: 8000, h: ['scene'],        text:'③ Eine Person hat ~37 °C Körperwärme — sticht im kalten Hintergrund deutlich hervor.' },
        { t: 12000,h: ['ai'],           text:'④ Eine KI klassifiziert: ist das ein Mensch, ein Reh, oder ein Auto? Verifizierte Boundbox + Konfidenz.' },
        { t: 16000,h: ['dark'],         text:'⑤ Funktioniert auch bei kompletter Dunkelheit, Nebel, Regen oder Tarnkleidung – wo normale Kameras versagen.' },
      ],
      cycle: 20000,
    };

    // ============== LIDAR ==============
    E['lidar'] = {
      title: 'LiDAR · Laser-3D-Scanner',
      intro: 'Rotierender Laser misst Laufzeit und erstellt 3D-Punktwolke',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- LiDAR unit -->
          <g id="unit">
            <rect x="22" y="220" width="20" height="80" fill="#475569"/>
            <circle cx="32" cy="200" r="22" fill="#0c0a1a" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="32" cy="200" r="14" fill="#22d3ee" opacity=".6"/>
            <!-- Spinning laser -->
            <g transform="translate(32 200)">
              <line x1="-14" y1="0" x2="14" y2="0" stroke="#fbbf24" stroke-width="3">
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"/>
              </line>
            </g>
            <text x="32" y="248" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui" font-weight="700">LiDAR</text>
          </g>

          <!-- Sweep beams emanating -->
          <g id="sweep" opacity="0">
            <g stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 2">
              ${Array.from({length:24}).map((_,i)=>{
                const ang = (i/24) * 2 * Math.PI;
                return `<line x1="42" y1="200" x2="${42 + Math.cos(ang)*250}" y2="${200 + Math.sin(ang)*180}" opacity=".3">
                  <animate attributeName="opacity" values=".3;1;.3" dur="2s" begin="${i*0.08}s" repeatCount="indefinite"/>
                </line>`;
              }).join('')}
            </g>
          </g>

          <!-- 3D point cloud (dots forming shapes) -->
          <g id="cloud" opacity="0">
            <!-- Person shape made of dots -->
            <g fill="#22d3ee">
              ${(()=>{ let r=''; for(let i=0; i<70; i++){
                const x = 380 + (Math.random()-.5) * 50;
                const y = 80 + Math.random()*180;
                r += `<circle cx="${x}" cy="${y}" r="2"/>`;
              } return r; })()}
            </g>
            <!-- Vehicle shape (longer) -->
            <g fill="#a3e635">
              ${(()=>{ let r=''; for(let i=0; i<90; i++){
                const x = 480 + (Math.random()-.5) * 100;
                const y = 220 + Math.random()*30;
                r += `<circle cx="${x}" cy="${y}" r="2"/>`;
              } return r; })()}
            </g>
            <text x="380" y="60" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="system-ui" font-weight="700">Punktwolke</text>
          </g>

          <!-- Classified objects with labels -->
          <g id="classes" opacity="0">
            <rect x="350" y="60" width="100" height="24" fill="none" stroke="#22d3ee" stroke-width="2"/>
            <rect x="350" y="38" width="120" height="14" fill="#22d3ee"/>
            <text x="410" y="48" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">PERSON · 1.4m/s</text>

            <rect x="430" y="210" width="120" height="34" fill="none" stroke="#a3e635" stroke-width="2"/>
            <rect x="430" y="186" width="140" height="14" fill="#a3e635"/>
            <text x="500" y="196" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">FAHRZEUG · 12m/s</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['unit'],     text:'① Das LiDAR hat einen rotierenden Laser, der bis zu 100.000 Pulse pro Sekunde aussendet.' },
        { t: 3500, h: ['sweep'],    text:'② Jeder Puls misst die Laufzeit bis zum Objekt → Entfernung (c · t / 2).' },
        { t: 7000, h: ['cloud'],    text:'③ Aus Millionen Messpunkten entsteht eine 3D-Punktwolke der gesamten Umgebung.' },
        { t: 11000,h: ['classes'],  text:'④ KI klassifiziert Objekte nach Form (Person aufrecht, Fahrzeug länglich, Tier viel kleiner).' },
        { t: 15000,h: [],           text:'⑤ Sehr präzise (cm-genau), wetterrobust, schwer zu täuschen. Für KRITIS und Hochsicherheit.' },
      ],
      cycle: 18000,
    };

    // ============== ERDDRUCK / GEOPHON ==============
    E['erddruck'] = {
      title: 'Erddruck-Sensor (Geophon)',
      intro: 'Vergrabener Sensor erkennt Schritte und Fahrzeuge anhand der Bodenvibration',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Sky -->
          <rect width="600" height="120" fill="rgba(11,20,36,.5)"/>
          <!-- Ground -->
          <rect y="120" width="600" height="200" fill="#4b3a2a"/>
          <line x1="0" y1="120" x2="600" y2="120" stroke="#92602a" stroke-width="2"/>

          <!-- Geophon buried -->
          <g id="geophon">
            <rect x="280" y="180" width="40" height="40" rx="4" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
            <circle cx="300" cy="200" r="6" fill="#22d3ee">
              <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <!-- Cable to surface -->
            <path d="M300 180 Q260 140 260 120" stroke="#22d3ee" stroke-width="2" fill="none"/>
            <text x="300" y="248" text-anchor="middle" font-size="9" fill="#22d3ee" font-family="system-ui" font-weight="700">GEOPHON</text>
            <text x="300" y="262" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">15 cm tief</text>
          </g>

          <!-- Person walking on surface -->
          <g id="person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="540 0; 100 0; 540 0" dur="10s" repeatCount="indefinite"/>
              <circle cx="0" cy="60" r="14" fill="#e8edf7"/>
              <rect x="-10" y="74" width="20" height="40" rx="4" fill="#475569"/>
              <!-- Footstep ripples below -->
              <ellipse cx="0" cy="118" rx="14" ry="3" fill="#fbbf24" opacity=".8">
                <animate attributeName="rx" values="14;30;14" dur="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".8;0;.8" dur="0.6s" repeatCount="indefinite"/>
              </ellipse>
            </g>
          </g>

          <!-- Underground vibration waves -->
          <g id="ground-waves" opacity="0">
            <path d="M120 150 Q160 145 200 150 Q240 155 280 150" stroke="#fbbf24" stroke-width="1.8" fill="none" opacity=".6">
              <animate attributeName="d"
                values="M120 150 Q160 145 200 150 Q240 155 280 150; M120 150 Q160 155 200 150 Q240 145 280 150; M120 150 Q160 145 200 150 Q240 155 280 150"
                dur="0.6s" repeatCount="indefinite"/>
            </path>
            <path d="M120 170 Q160 165 200 170 Q240 175 280 170" stroke="#fbbf24" stroke-width="1.8" fill="none" opacity=".5">
              <animate attributeName="d"
                values="M120 170 Q160 165 200 170 Q240 175 280 170; M120 170 Q160 175 200 170 Q240 165 280 170; M120 170 Q160 165 200 170 Q240 175 280 170"
                dur="0.6s" begin="0.1s" repeatCount="indefinite"/>
            </path>
          </g>

          <!-- Signal display -->
          <g id="signal" opacity="0" transform="translate(380, 200)">
            <rect x="0" y="0" width="200" height="80" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="100" y="16" text-anchor="middle" font-size="10" fill="#22c55e" font-family="monospace" font-weight="700">SEISMISCHES SIGNAL</text>
            <!-- Periodic spikes for steps -->
            <path d="M10 50 L20 50 L25 30 L30 50 L60 50 L65 32 L70 50 L100 50 L105 30 L110 50 L140 50 L145 32 L150 50 L180 50 L190 50"
              stroke="#22c55e" stroke-width="2" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-50" dur="1s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="0 0"/>
            </path>
            <text x="100" y="70" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">Schritte detektiert</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['geophon'],          text:'① Das Geophon wird 10–20 cm tief in der Erde vergraben. Komplett unsichtbar von außen.' },
        { t: 4000, h: ['person'],           text:'② Eine Person geht über das Freigelände → erzeugt mit jedem Schritt Bodenvibration.' },
        { t: 8000, h: ['ground-waves'],     text:'③ Die seismischen Wellen pflanzen sich im Boden fort und erreichen den Geophon-Sensor.' },
        { t: 12000,h: ['signal'],           text:'④ Das Geophon misst Bodenschall (5–500 Hz) → Mustererkennung unterscheidet Schritte von Fahrzeugen oder Tieren.' },
        { t: 16000,h: [],                   text:'⑤ Reichweite typ. 200 m pro Sensor. Unsichtbar, unüberbrückbar – ideal für sensible Perimeter.' },
      ],
      cycle: 19000,
    };

    // ============== NEIGUNG ==============
    E['neigung'] = {
      title: 'Neigungssensor',
      intro: 'MEMS-Gyrosensor erkennt Kippen / Umwerfen sofort',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- ATM or safe -->
          <g id="safe">
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="0 200 300; 0 200 300; 15 200 300; 25 200 300; 0 200 300"
                keyTimes="0; 0.4; 0.55; 0.75; 1" dur="14s" repeatCount="indefinite"/>
              <rect x="120" y="140" width="160" height="160" rx="6" fill="#475569" stroke="#1e293b" stroke-width="3"/>
              <rect x="140" y="160" width="120" height="120" fill="#1e293b"/>
              <text x="200" y="226" text-anchor="middle" font-size="20" fill="#94a3b8" font-family="system-ui" font-weight="800">SAFE</text>
              <circle cx="240" cy="240" r="10" fill="#fbbf24"/>

              <!-- Inside: sensor at top -->
              <g id="sensor-marker">
                <rect x="190" y="148" width="20" height="14" rx="2" fill="#22c55e" stroke="#0f172a"/>
                <text x="200" y="158" text-anchor="middle" font-size="6" fill="white" font-weight="800">G</text>
              </g>
            </g>
          </g>

          <!-- Reference horizon -->
          <g id="horizon" opacity="0">
            <line x1="20" y1="300" x2="580" y2="300" stroke="#22c55e" stroke-width="1" stroke-dasharray="6 4"/>
            <text x="30" y="296" font-size="8" fill="#22c55e" font-family="system-ui">Horizontal-Referenz</text>
          </g>

          <!-- Gyro indicator -->
          <g id="gyro" opacity="0" transform="translate(380, 60)">
            <rect x="0" y="0" width="200" height="100" rx="6" fill="#0b1424" stroke="#22d3ee" stroke-width="2"/>
            <text x="100" y="16" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="monospace" font-weight="700">MEMS-GYROSENSOR</text>
            <!-- Tilt arc indicator -->
            <circle cx="100" cy="60" r="28" fill="none" stroke="#475569" stroke-width="1.5"/>
            <line id="gyro-needle" x1="100" y1="60" x2="100" y2="35" stroke="#22d3ee" stroke-width="3">
              <animateTransform attributeName="transform" type="rotate"
                values="0 100 60; 0 100 60; 15 100 60; 25 100 60; 0 100 60"
                keyTimes="0; 0.4; 0.55; 0.75; 1" dur="14s" repeatCount="indefinite"/>
            </line>
            <text x="100" y="82" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">0° → 25°</text>
            <text x="100" y="94" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">
              <animate attributeName="opacity" values="0; 0; 1; 1; 0"
                keyTimes="0; 0.4; 0.55; 0.95; 1" dur="14s" repeatCount="indefinite"/>
              SCHWELLE!
            </text>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="380" y="180" width="200" height="50" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="480" y="212" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ TRESOR GEKIPPT!</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['safe'],            text:'① Im Safe / Geldautomat ist ein winziger MEMS-Gyrosensor verbaut. Er misst die Lage in 3D.' },
        { t: 4000, h: ['horizon','gyro'],  text:'② Normaler Zustand: Sensor horizontal, Neigung = 0°. Auch leichte Bewegungen werden gefiltert.' },
        { t: 8000, h: ['safe'],            text:'③ Versucht jemand den Tresor wegzukippen / umzuwerfen, ändert sich die Lage messbar.' },
        { t: 12000,h: ['gyro','alarm'],    text:'④ Bei Überschreitung der Winkel-Schwelle (typ. 15°) → SOFORT-ALARM. Ideal für Geldautomaten, Vitrinen.' },
      ],
      cycle: 16000,
    };

    // ============== SEISMISCH ==============
    E['seismisch'] = {
      title: 'Seismischer Tresorsensor',
      intro: 'Hochempfindlicher Geophon-artiger Sensor erkennt jede Erschütterung am Tresor',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tresor -->
          <rect x="60" y="60" width="280" height="220" rx="10" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
          <rect x="80" y="80" width="240" height="180" fill="#0b1424"/>
          <text x="200" y="200" text-anchor="middle" font-size="34" font-weight="800" fill="#94a3b8" font-family="system-ui">TRESOR</text>
          <circle cx="260" cy="220" r="16" fill="#fbbf24" opacity=".7"/>

          <!-- Seismic sensor (small device on side of safe) -->
          <g id="seism">
            <rect x="340" y="170" width="36" height="36" rx="3" fill="#22d3ee" stroke="#0ea5e9" stroke-width="2"/>
            <circle cx="358" cy="188" r="8" fill="#0c0a1a"/>
            <circle cx="358" cy="188" r="4" fill="#22d3ee">
              <animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="358" y="222" text-anchor="middle" font-size="9" fill="#22d3ee" font-family="system-ui" font-weight="700">SEISMIC</text>
          </g>

          <!-- Different attack types -->
          <g id="attacks" opacity="0">
            <!-- Drill -->
            <g transform="translate(150, 120)">
              <rect x="0" y="-6" width="50" height="14" fill="#fbbf24"/>
              <rect x="-30" y="0" width="30" height="3" fill="#94a3b8"/>
              <text x="0" y="-12" font-size="8" fill="#fbbf24">Bohrer</text>
            </g>
            <!-- Hammer -->
            <g transform="translate(200, 250)">
              <rect x="-20" y="-3" width="40" height="14" fill="#94a3b8"/>
              <line x1="20" y1="0" x2="20" y2="-20" stroke="#92602a" stroke-width="6"/>
              <text x="0" y="-22" font-size="8" fill="#94a3b8">Hammer</text>
            </g>
          </g>

          <!-- Vibration radiating -->
          <g id="vibrations" opacity="0">
            <circle cx="200" cy="200" r="60" fill="none" stroke="#ef4444" stroke-width="2">
              <animate attributeName="r" values="30;90;30" dur="1.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="200" r="60" fill="none" stroke="#ef4444" stroke-width="2">
              <animate attributeName="r" values="30;90;30" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0;0.6" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Spectrogram -->
          <g id="spec" opacity="0" transform="translate(420, 60)">
            <rect x="0" y="0" width="160" height="100" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="80" y="14" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace" font-weight="700">SPEKTRUM 5–500 Hz</text>
            <g fill="#22c55e">
              ${Array.from({length:16}).map((_,i)=>{
                const h = 14 + Math.random()*50;
                return `<rect x="${10+i*9}" y="${82-h}" width="6" height="${h}"><animate attributeName="height" values="${h};${h*1.4};${h}" dur="${0.3 + Math.random()*0.5}s" repeatCount="indefinite"/></rect>`;
              }).join('')}
            </g>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="420" y="200" width="160" height="50" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="500" y="232" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ ANGRIFF</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['seism'],         text:'① Der seismische Sensor wird direkt auf den Tresor montiert — winzig, aber hochempfindlich.' },
        { t: 4000, h: ['attacks','vibrations'], text:'② Egal ob Bohren, Hämmern, Schweißbrenner oder Sprengung: jede Methode erzeugt seismische Vibration im Material.' },
        { t: 8500, h: ['spec'],          text:'③ Der Sensor scannt das ganze Spektrum von 5 bis 500 Hz und analysiert es laufend.' },
        { t: 13000,h: ['alarm'],         text:'④ Charakteristische Angriffs-Signatur erkannt → ALARM. Höchste Tresor-Sicherheit (SÜ 5–6).' },
      ],
      cycle: 17000,
    };
  }
})();
