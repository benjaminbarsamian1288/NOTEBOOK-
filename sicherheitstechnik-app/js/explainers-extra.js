/* Zusätzliche Explainer für alle übrigen Meldertypen.
   Werden in window.EXPL.EXPLAINERS gemerged sobald EXPL geladen ist. */

(function() {
  if (!window.EXPL) {
    document.addEventListener('DOMContentLoaded', addExtras);
  } else {
    addExtras();
  }

  function addExtras() {
    if (!window.EXPL) return;
    const E = window.EXPL.EXPLAINERS;

    // ============== AKTIV-FOLIE / Alarmdraht ==============
    E['glas-aktiv'] = {
      title: 'Aktiv-Folie / Alarmdraht auf Scheibe',
      intro: 'Permanente Leiterbahn auf der Scheibe — Bruch unterbricht den Stromkreis',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="gpg2" x2="0" y2="1">
              <stop offset="0" stop-color="#38bdf8" stop-opacity=".22"/>
              <stop offset="1" stop-color="#22d3ee" stop-opacity=".05"/>
            </linearGradient>
          </defs>
          <rect x="80" y="40" width="380" height="240" fill="url(#gpg2)" stroke="#38bdf8" stroke-width="3"/>
          <line x1="270" y1="40" x2="270" y2="280" stroke="#38bdf8" opacity=".5"/>

          <!-- Folie (zigzag wire) -->
          <g id="folie">
            <path d="M100 70 L450 70 L450 90 L100 90 L100 110 L450 110 L450 130 L100 130 L100 150 L450 150 L450 170 L100 170 L100 190 L450 190 L450 210 L100 210 L100 230 L450 230 L450 250 L100 250"
              stroke="#fbbf24" stroke-width="2.5" fill="none"/>
            <circle cx="100" cy="70" r="6" fill="#22c55e"/>
            <circle cx="100" cy="250" r="6" fill="#22c55e"/>
            <text x="60" y="78" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">+</text>
            <text x="60" y="258" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">−</text>
          </g>

          <!-- Current indicator (steady) -->
          <g id="current-ok" opacity="0">
            <rect x="490" y="100" width="100" height="50" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="540" y="120" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">RUHESTROM</text>
            <text x="540" y="140" text-anchor="middle" font-size="14" fill="#22c55e" font-family="system-ui" font-weight="800">✓ OK</text>
          </g>

          <!-- Break (large red cross) -->
          <g id="break" opacity="0">
            <line x1="240" y1="100" x2="320" y2="220" stroke="#ef4444" stroke-width="5"/>
            <line x1="320" y1="100" x2="240" y2="220" stroke="#ef4444" stroke-width="5"/>
            <text x="280" y="80" text-anchor="middle" font-size="13" fill="#ef4444" font-family="system-ui" font-weight="800">BRUCH!</text>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="490" y="180" width="100" height="50" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="540" y="212" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['folie'],          text:'① Die Aktiv-Folie ist als hauchdünne Leiterbahn aufgeklebt — die Bahn schlängelt sich über die ganze Scheibe.' },
        { t: 4000, h: ['current-ok'],     text:'② Ein konstanter Ruhestrom fließt permanent durch die Leiterbahn. Die EMA-Zentrale sieht: Stromkreis OK.' },
        { t: 8000, h: ['break'],          text:'③ Bricht die Scheibe (oder reißt nur die Folie), wird die Leiterbahn unterbrochen.' },
        { t: 12000,h: ['alarm'],          text:'④ Stromfluss = 0 → sofort ALARM. 100 % Erkennung, sogar bei Anschneiden / kleinem Riss.' },
      ],
      cycle: 16000,
    };

    // ============== SCHLIESSBLECH ==============
    E['schliessblech'] = {
      title: 'Schließblech-/Riegelkontakt',
      intro: 'Erkennt VERRIEGELT — nicht nur zu! Zwingend ab SÜ 3',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Door (left side) -->
          <g id="door">
            <rect x="60" y="40" width="260" height="240" fill="#92602a" stroke="#5a3a14" stroke-width="3"/>
            <rect x="80" y="60" width="220" height="200" fill="#a87534" stroke="#5a3a14" stroke-width="1"/>
            <text x="190" y="160" text-anchor="middle" font-size="14" fill="#5a3a14" font-family="system-ui">TÜR</text>
          </g>

          <!-- Lock + bolt -->
          <g id="lock">
            <rect x="290" y="140" width="50" height="40" fill="#475569" stroke="#0f172a" stroke-width="2"/>
            <text x="315" y="166" text-anchor="middle" font-size="9" fill="white" font-family="system-ui">SCHLOSS</text>
          </g>

          <!-- Bolt (animated extension) -->
          <g id="bolt-state">
            <rect id="bolt-rect" x="340" y="155" width="60" height="14" fill="#cbd5e0" stroke="#475569" stroke-width="1.5">
              <animate attributeName="x" values="340; 340; 360; 360; 340" keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
              <animate attributeName="width" values="60; 60; 40; 40; 60" keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
            </rect>
          </g>

          <!-- Frame -->
          <rect x="400" y="40" width="120" height="240" fill="#92602a" stroke="#5a3a14" stroke-width="3"/>

          <!-- Schliessblech with contact -->
          <g id="schliessblech">
            <rect x="400" y="120" width="30" height="80" fill="#cbd5e0" stroke="#475569" stroke-width="1.5"/>
            <rect x="408" y="150" width="20" height="24" fill="#0f172a"/>
            <circle id="contact-led" cx="418" cy="162" r="5" fill="#22c55e">
              <animate attributeName="fill" values="#22c55e; #22c55e; #ef4444; #ef4444; #22c55e"
                keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Status box -->
          <g id="status">
            <rect x="60" y="290" width="480" height="22" rx="4" fill="#0b1424" stroke="#475569"/>
            <text id="status-text" x="300" y="306" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700">
              <animate attributeName="fill" values="#22c55e; #22c55e; #ef4444; #ef4444; #22c55e"
                keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
              VERRIEGELT · Riegelkontakt geschlossen ✓
            </text>
          </g>

          <!-- Subtitle -->
          <g id="bigtext" opacity="0">
            <text x="300" y="30" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700">
              Magnetkontakt sagt: "Tür zu". Schließblech sagt: "Riegel eingefahren!"
            </text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['door','lock'],         text:'① Eine Tür kann ZU sein, ohne ABGESCHLOSSEN zu sein. Magnetkontakt erkennt das nicht.' },
        { t: 4000, h: ['schliessblech'],       text:'② Der Schließblechkontakt sitzt im Türrahmen, dort wo der Schlossriegel hinfahren würde.' },
        { t: 8000, h: ['bolt-state'],          text:'③ Wird der Schlüssel umgedreht, fährt der Riegel raus in das Schließblech.' },
        { t: 12000,h: ['contact-led','status'],text:'④ Der Riegel drückt den Kontakt zu → "Tür wirklich verriegelt!" An die EMA-Zentrale.' },
        { t: 16000,h: ['bigtext'],             text:'⑤ Ab VdS-Klasse SÜ 3 PFLICHT! Nur so weiß die Anlage: Eintritts-Schutz aktiv.' },
      ],
      cycle: 20000,
    };

    // ============== KÖRPERSCHALL ==============
    E['koerperschall'] = {
      title: 'Körperschallmelder · Mikrofon IM Material',
      intro: 'Hochempfindliches Mikrofon erkennt Bohren, Flexen, Sprengen im Stahl',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tresor -->
          <rect x="50" y="50" width="320" height="240" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
          <rect x="70" y="70" width="280" height="200" fill="#0b1424"/>
          <text x="210" y="200" text-anchor="middle" font-size="38" font-weight="800" fill="#94a3b8" font-family="system-ui">TRESOR</text>
          <circle cx="270" cy="240" r="18" fill="#fbbf24" opacity=".7"/>

          <!-- Körperschall-Mikrofon -->
          <g id="micro">
            <rect x="360" y="160" width="50" height="50" rx="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
            <circle cx="385" cy="185" r="15" fill="#0c0a1a"/>
            <g fill="#dc2626">
              <circle cx="385" cy="185" r="3"/>
              <circle cx="378" cy="178" r="1"/>
              <circle cx="392" cy="178" r="1"/>
              <circle cx="378" cy="192" r="1"/>
              <circle cx="392" cy="192" r="1"/>
            </g>
            <text x="385" y="226" text-anchor="middle" font-size="9" fill="#dc2626" font-family="system-ui" font-weight="700">KSM</text>
          </g>

          <!-- Attacker drilling -->
          <g id="attacker" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="380 100; 350 100; 380 100" dur="1.2s" repeatCount="indefinite"/>
              <rect x="0" y="-8" width="60" height="22" fill="#fbbf24"/>
              <rect x="60" y="-2" width="50" height="10" fill="#94a3b8"/>
              <circle cx="115" cy="3" r="5" fill="#ef4444">
                <animate attributeName="r" values="3;6;3" dur="0.3s" repeatCount="indefinite"/>
              </circle>
            </g>
          </g>

          <!-- Sound waves propagating through metal -->
          <g id="waves" opacity="0">
            <path d="M385 110 Q300 130 230 130 Q160 130 90 130" stroke="#ef4444" stroke-width="2" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-30" dur="0.5s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="8 8"/>
            </path>
            <path d="M385 130 Q300 150 230 150 Q160 150 90 150" stroke="#ef4444" stroke-width="2" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-30" dur="0.6s" repeatCount="indefinite"/>
              <animate attributeName="stroke-dasharray" values="8 8"/>
            </path>
          </g>

          <!-- Frequency analyzer -->
          <g id="freqAnal" opacity="0" transform="translate(420, 60)">
            <rect x="0" y="0" width="170" height="90" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="85" y="14" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui" font-weight="700">FREQUENZ-ANALYSE</text>
            <g fill="#22c55e">
              <rect x="10" y="60" width="6" height="22"/>
              <rect x="20" y="50" width="6" height="32"/>
              <rect x="30" y="35" width="6" height="47"><animate attributeName="height" values="20;47;20" dur="0.4s" repeatCount="indefinite"/></rect>
              <rect x="40" y="20" width="6" height="62"><animate attributeName="height" values="40;62;40" dur="0.3s" repeatCount="indefinite"/></rect>
              <rect x="50" y="40" width="6" height="42"><animate attributeName="height" values="30;42;30" dur="0.5s" repeatCount="indefinite"/></rect>
              <rect x="60" y="55" width="6" height="27"/>
              <rect x="70" y="65" width="6" height="17"/>
              <rect x="80" y="70" width="6" height="12"/>
            </g>
            <text x="85" y="80" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">Bohr-Signatur erkannt</text>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="420" y="240" width="170" height="42" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="505" y="268" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ TRESOR-ANGRIFF</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['micro'],            text:'① Der Körperschallmelder (KSM) ist hochempfindliches Mikrofon, DIREKT auf den Tresorkörper geschraubt.' },
        { t: 4000, h: ['attacker'],         text:'② Angreifer beginnt zu bohren oder zu flexen — erzeugt hochfrequenten Körperschall im Stahl.' },
        { t: 8000, h: ['waves'],            text:'③ Der Schall pflanzt sich im Material fort (c ≈ 5900 m/s in Stahl) und erreicht das Mikrofon.' },
        { t: 12000,h: ['freqAnal'],         text:'④ Die Frequenzanalyse erkennt die charakteristische Bohr-/Schneid-/Sprengsignatur — unterscheidet von Verkehrslärm.' },
        { t: 16000,h: ['alarm'],            text:'⑤ Schwelle überschritten → ALARM. Tresor-Standard ab VdS-Klasse SÜ 5.' },
      ],
      cycle: 20000,
    };

    // ============== ASD - Ansaugrauchmelder ==============
    E['asd'] = {
      title: 'Ansaugrauchmelder (ASD) · Laser-Detektion',
      intro: 'Aktive Luftansaugung + Laser-Streulicht — hochempfindlichst für Server und Archive',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Ceiling -->
          <rect x="0" y="0" width="600" height="14" fill="#1f3358"/>

          <!-- Pipe network -->
          <g id="pipes" stroke="#cbd5e0" stroke-width="6" stroke-linecap="round" fill="none">
            <line x1="120" y1="14" x2="120" y2="80"/>
            <line x1="240" y1="14" x2="240" y2="80"/>
            <line x1="360" y1="14" x2="360" y2="80"/>
            <line x1="480" y1="14" x2="480" y2="80"/>
            <line x1="120" y1="80" x2="480" y2="80"/>
            <line x1="300" y1="80" x2="300" y2="120"/>
          </g>

          <!-- Sample holes (with animated suction) -->
          <g id="holes" opacity="0">
            ${[120,240,360,480].map((x,i) => `
              <circle cx="${x}" cy="14" r="4" fill="#94a3b8"/>
              <g fill="#94a3b8">
                <circle cx="${x}" cy="30" r="3">
                  <animate attributeName="cy" values="14;80" dur="2s" begin="${i*0.3}s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0" dur="2s" begin="${i*0.3}s" repeatCount="indefinite"/>
                </circle>
                <circle cx="${x}" cy="40" r="3">
                  <animate attributeName="cy" values="14;80" dur="2s" begin="${i*0.3 + 0.7}s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0" dur="2s" begin="${i*0.3 + 0.7}s" repeatCount="indefinite"/>
                </circle>
              </g>
            `).join('')}
          </g>

          <!-- Smoke being inhaled from one branch -->
          <g id="smoke" opacity="0">
            <circle cx="240" cy="290" r="14" fill="#94a3b8" opacity=".5"><animate attributeName="cy" values="290;14" dur="5s" repeatCount="indefinite"/></circle>
            <circle cx="248" cy="280" r="16" fill="#94a3b8" opacity=".4"><animate attributeName="cy" values="280;14" dur="5s" begin="0.5s" repeatCount="indefinite"/></circle>
            <text x="240" y="310" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui">Rauch unsichtbar</text>
          </g>

          <!-- Detector unit -->
          <g id="detector">
            <rect x="240" y="120" width="120" height="80" rx="8" fill="#0c0a1a" stroke="#475569" stroke-width="2"/>
            <text x="300" y="138" text-anchor="middle" font-size="11" fill="#94a3b8" font-family="system-ui" font-weight="700">ASD-Zentrale</text>
            <!-- Laser chamber -->
            <rect x="250" y="148" width="40" height="40" rx="2" fill="#1e293b" stroke="#7c3aed"/>
            <line x1="252" y1="168" x2="290" y2="168" stroke="#7c3aed" stroke-width="1">
              <animate attributeName="opacity" values="1;.4;1" dur="0.5s" repeatCount="indefinite"/>
            </line>
            <text x="270" y="180" text-anchor="middle" font-size="6" fill="#7c3aed">LASER</text>
            <!-- Pump (turning) -->
            <circle cx="320" cy="168" r="14" fill="#0f172a" stroke="#22d3ee" stroke-width="1.5"/>
            <g transform="translate(320 168)">
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#22d3ee" stroke-width="2">
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"/>
              </line>
            </g>
            <text x="320" y="190" text-anchor="middle" font-size="6" fill="#22d3ee">PUMPE</text>
          </g>

          <!-- Display -->
          <g id="display" opacity="0" transform="translate(420, 130)">
            <rect x="0" y="0" width="150" height="60" rx="4" fill="#0b1424" stroke="#22c55e"/>
            <text x="75" y="16" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace">Partikel-Anzahl</text>
            <text x="75" y="36" text-anchor="middle" font-size="20" fill="#ef4444" font-family="monospace" font-weight="800">847</text>
            <text x="75" y="54" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">Schwelle: 100</text>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="440" y="220" width="130" height="42" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="505" y="248" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ FRÜH-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['detector','pipes'],   text:'① ASD-Zentrale mit Hochgeschwindigkeits-Pumpe + Rohrnetz an der Decke. Bis 2.000 m² überwachbar.' },
        { t: 4000, h: ['holes'],              text:'② Die Pumpe saugt kontinuierlich Luft durch Ansaugöffnungen entlang der Rohre.' },
        { t: 8500, h: ['smoke'],              text:'③ Bei einem Schwelbrand entstehen Rauchpartikel — noch unsichtbar fürs Auge.' },
        { t: 13000,h: ['display'],            text:'④ Laser-Streulicht-Sensor zählt Partikel pro Liter Luft — extrem sensibel (10x früher als optischer Melder).' },
        { t: 17000,h: ['alarm'],              text:'⑤ Bei Überschreitung der Schwelle → Frühalarm. Standard für Server-Räume, Archive, Museen.' },
      ],
      cycle: 21000,
    };

    // ============== ZAUNSENSOR ==============
    E['zaun-mikro'] = {
      title: 'Mikrophonische Zaunsensorik',
      intro: 'Sensor-Kabel am Zaun erfasst Klettern, Schneiden, Manipulieren',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Sky/ground -->
          <rect width="600" height="200" fill="rgba(11,20,36,.6)"/>
          <rect y="200" width="600" height="120" fill="#1f3358"/>

          <!-- Fence -->
          <g id="fence" stroke="#94a3b8" stroke-width="2">
            <line x1="40" y1="200" x2="40" y2="60"/>
            <line x1="160" y1="200" x2="160" y2="60"/>
            <line x1="280" y1="200" x2="280" y2="60"/>
            <line x1="400" y1="200" x2="400" y2="60"/>
            <line x1="520" y1="200" x2="520" y2="60"/>
            <line x1="40" y1="90" x2="520" y2="90" stroke-dasharray="6 4"/>
            <line x1="40" y1="130" x2="520" y2="130" stroke-dasharray="6 4"/>
            <line x1="40" y1="170" x2="520" y2="170" stroke-dasharray="6 4"/>
          </g>

          <!-- Sensor cable on top of fence -->
          <g id="cable" opacity="0">
            <line x1="40" y1="70" x2="520" y2="70" stroke="#22d3ee" stroke-width="4"/>
            <line x1="40" y1="70" x2="520" y2="70" stroke="#67e8f9" stroke-width="1.5" stroke-dasharray="3 3">
              <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.6s" repeatCount="indefinite"/>
            </line>
            <circle cx="40" cy="70" r="5" fill="#22d3ee"/>
            <circle cx="520" cy="70" r="5" fill="#22d3ee"/>
            <text x="280" y="55" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">Sensor-Kabel</text>
          </g>

          <!-- Intruder climbing -->
          <g id="intruder" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="240 200; 240 140; 240 200" dur="6s" repeatCount="indefinite"/>
              <circle cx="0" cy="0" r="12" fill="#ef4444"/>
              <rect x="-8" y="10" width="16" height="32" rx="3" fill="#ef4444"/>
              <line x1="0" y1="20" x2="20" y2="0" stroke="#ef4444" stroke-width="3"/>
              <line x1="0" y1="30" x2="-12" y2="14" stroke="#ef4444" stroke-width="3"/>
            </g>
          </g>

          <!-- Vibration burst at top -->
          <g id="vibration" opacity="0">
            <circle cx="280" cy="70" r="18" fill="none" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="r" values="10;36" dur="1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="280" cy="70" r="18" fill="none" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="r" values="10;36" dur="1s" begin="0.3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0" dur="1s" begin="0.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="280" cy="70" r="18" fill="none" stroke="#fbbf24" stroke-width="2">
              <animate attributeName="r" values="10;36" dur="1s" begin="0.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0" dur="1s" begin="0.6s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Control box -->
          <g id="control" opacity="0" transform="translate(20, 230)">
            <rect x="0" y="0" width="200" height="60" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="100" y="16" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace" font-weight="700">AUSWERTEINHEIT</text>
            <text x="100" y="34" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">ZONE 3 · 280m</text>
            <text x="100" y="50" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">Klettern erkannt</text>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="380" y="240" width="200" height="50" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="480" y="272" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ PERIMETER-ALARM</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['fence'],         text:'① Ein Zaun als physische Barriere — aber alleine reicht das nicht, ein Eindringling klettert einfach drüber.' },
        { t: 4000, h: ['cable'],         text:'② Ein Sensor-Kabel mit eingebetteten Mikrofonen wird oben angebracht — bis 600m pro Zone.' },
        { t: 8000, h: ['intruder'],      text:'③ Ein Eindringling klettert oder schneidet → erzeugt Vibrationen / Akustik direkt am Zaun.' },
        { t: 12000,h: ['vibration'],     text:'④ Die Mikrofone im Kabel detektieren die Vibration. KI-Algorithmen unterscheiden von Wind/Tieren.' },
        { t: 16000,h: ['control','alarm'],text:'⑤ Auswerteinheit lokalisiert auf 5m genau → ZONE + ALARM. Sehr robust gegen Wettereinflüsse.' },
      ],
      cycle: 20000,
    };

    // ============== RADAR ==============
    E['radar'] = {
      title: 'Perimeter-Radar · 77 GHz',
      intro: 'Aktiver Mikrowellen-Radar erkennt jede Bewegung mit Position + Geschwindigkeit',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Radar dish -->
          <g id="dish" transform="translate(60, 160)">
            <rect x="-8" y="0" width="16" height="60" fill="#475569"/>
            <path d="M-50 -80 Q-50 -110 0 -110 Q50 -110 50 -80 L50 -50 Q50 -20 0 -20 Q-50 -20 -50 -50 Z"
              fill="#94a3b8" stroke="#475569" stroke-width="2"/>
            <circle cx="0" cy="-70" r="6" fill="#22d3ee">
              <animate attributeName="r" values="3;7;3" dur="1s" repeatCount="indefinite"/>
            </circle>
            <text x="0" y="80" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui">RADAR 77 GHz</text>
          </g>

          <!-- Sweeping beam (rotating sector) -->
          <g id="sweep" opacity="0">
            <g transform="translate(60, 90)">
              <path d="M0 0 L500 -60 L500 60 Z" fill="rgba(34,211,238,.10)">
                <animateTransform attributeName="transform" type="rotate"
                  values="-15; 15; -15" dur="4s" repeatCount="indefinite"/>
              </path>
            </g>
            <text x="300" y="40" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui">Sektor-Sweep · Bis 500 m</text>
          </g>

          <!-- Targets (moving objects) -->
          <g id="targets" opacity="0">
            <!-- Person walking -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="540 90; 200 90; 540 90" dur="12s" repeatCount="indefinite"/>
              <circle cx="0" cy="-14" r="12" fill="#ef4444"/>
              <rect x="-9" y="-2" width="18" height="32" rx="4" fill="#ef4444"/>
            </g>
            <!-- Vehicle -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="100 200; 480 200; 100 200" dur="8s" repeatCount="indefinite"/>
              <rect x="-30" y="-12" width="60" height="24" rx="4" fill="#fbbf24"/>
              <circle cx="-18" cy="14" r="6" fill="#1e293b"/>
              <circle cx="18" cy="14" r="6" fill="#1e293b"/>
            </g>
          </g>

          <!-- Track display -->
          <g id="tracks" opacity="0" transform="translate(380, 200)">
            <rect x="0" y="0" width="200" height="100" rx="6" fill="#0b1424" stroke="#22c55e"/>
            <text x="100" y="16" text-anchor="middle" font-size="10" fill="#22c55e" font-family="monospace" font-weight="700">TRACKS</text>
            <g font-size="9" fill="#94a3b8" font-family="monospace">
              <text x="10" y="36">ID 1: Person · 1.4 m/s · 280 m</text>
              <text x="10" y="54">ID 2: Vehicle · 18 m/s · 120 m</text>
              <text x="10" y="72">Klassifikation: KI</text>
              <text x="10" y="90" fill="#ef4444">⚠ Pers. nähert sich!</text>
            </g>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['dish'],          text:'① Ein Perimeter-Radar mit Antennenschüssel sendet hochfrequente Mikrowellen (24 oder 77 GHz) aus.' },
        { t: 4000, h: ['sweep'],         text:'② Das Radar scannt einen Sektor (typ. 30°-120°) mit elektronischem oder mechanischem Sweep.' },
        { t: 8000, h: ['targets'],       text:'③ Reflexionen von bewegten Objekten werden gemessen — präzise Position + Geschwindigkeit über Doppler.' },
        { t: 13000,h: ['tracks'],        text:'④ Tracking-Algorithmus klassifiziert: Mensch / Fahrzeug / Tier. KI eliminiert Falschalarme. Sehr wetterrobust.' },
      ],
      cycle: 17000,
    };

    // ============== KAMERA (Video-Technik) - already exists as 'video-kamera' but we add it explicitly under 'kamera' too
    if (!E['kamera']) E['kamera'] = E['video-kamera'] || null;

    // ============== ULTRASCHALL bereits da; PIR variants share with pir-standard
    // Add aliases so they pick up the base PIR explainer
    const PIR_VARIANTS = ['pir-vorhang','pir-decke','pir-longrange','pir-tierimmun','pir-antimask','pir-outdoor'];
    PIR_VARIANTS.forEach(v => { if (!E[v]) E[v] = E['pir-standard']; });

    // Glas-Piezo: similar to passiv glasbruch
    if (!E['glas-piezo']) E['glas-piezo'] = E['glas-passiv'];

    // Wärmemelder thermisch
    E['waerme-max'] = {
      title: 'Thermischer Brandmelder · Maximum',
      intro: 'Reagiert bei Überschreiten einer Temperaturgrenze (typ. 54 °C)',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <rect x="0" y="0" width="600" height="14" fill="#1f3358"/>

          <g id="sensor">
            <ellipse cx="300" cy="34" rx="28" ry="14" fill="#162542" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="300" cy="34" r="6" fill="#fbbf24"/>
          </g>

          <!-- Thermometer -->
          <g id="thermo" opacity="0" transform="translate(450, 60)">
            <rect x="0" y="0" width="80" height="220" rx="40" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
            <rect x="20" y="20" width="40" height="180" rx="20" fill="#0c0a1a"/>
            <circle cx="40" cy="200" r="22" fill="#ef4444"/>
            <!-- Filling indicator -->
            <rect id="thermo-fill" x="32" y="180" width="16" height="20" fill="#ef4444">
              <animate attributeName="y" values="180; 30; 180" dur="14s" repeatCount="indefinite"/>
              <animate attributeName="height" values="20; 170; 20" dur="14s" repeatCount="indefinite"/>
            </rect>
            <!-- Scale -->
            <text x="-8" y="40" text-anchor="end" font-size="9" fill="#94a3b8">80°</text>
            <text x="-8" y="80" text-anchor="end" font-size="9" fill="#ef4444" font-weight="800">54° ◀</text>
            <text x="-8" y="120" text-anchor="end" font-size="9" fill="#94a3b8">40°</text>
            <text x="-8" y="160" text-anchor="end" font-size="9" fill="#94a3b8">20°</text>
          </g>

          <!-- Fire -->
          <g id="fire" opacity="0">
            <path d="M150 290 Q120 240 160 220 Q200 250 180 290 Z" fill="#ef4444">
              <animateTransform attributeName="transform" type="scale" values="1 1; 1 1.1; 1 1" dur="0.4s" repeatCount="indefinite" additive="sum"/>
            </path>
            <path d="M158 290 Q140 250 165 230 Q188 252 180 290 Z" fill="#fbbf24"/>
            <text x="160" y="310" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="600">Brand</text>
          </g>

          <!-- Heat waves -->
          <g id="heat" opacity="0">
            <path d="M170 220 Q175 200 170 180 Q175 160 170 140" stroke="#ef4444" stroke-width="2" fill="none"/>
            <path d="M180 220 Q185 200 180 180 Q185 160 180 140" stroke="#ef4444" stroke-width="2" fill="none"/>
            <path d="M160 220 Q165 200 160 180 Q165 160 160 140" stroke="#ef4444" stroke-width="2" fill="none"/>
          </g>

          <!-- Threshold reached -->
          <g id="alarm" opacity="0">
            <rect x="40" y="40" width="180" height="42" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="130" y="68" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ FEUER (>54°C)</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['sensor'],          text:'① Der thermische Maximalmelder hat einen Thermistor, der die Raumtemperatur misst.' },
        { t: 4000, h: ['thermo'],          text:'② Eine feste Auslöseschwelle von typ. 54 °C ist im Sensor hinterlegt.' },
        { t: 8000, h: ['fire','heat'],     text:'③ Bei offener Flamme steigt die Temperatur in der Umgebung schnell an.' },
        { t: 12000,h: ['alarm'],           text:'④ Sobald 54 °C erreicht werden → ALARM. Vorteil: kein Fehlalarm durch Dampf oder Staub. Geeignet für Küchen.' },
      ],
      cycle: 16000,
    };

    // Flammenmelder UV/IR
    E['flammenmelder'] = {
      title: 'Flammenmelder UV/IR',
      intro: 'Erkennt UV- und IR-Strahlung von offenen Flammen',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Sensor unit on wall -->
          <g id="sensor">
            <rect x="40" y="120" width="100" height="80" rx="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
            <circle cx="70" cy="150" r="13" fill="#1e1b4b" stroke="#7c3aed" stroke-width="2"/>
            <text x="70" y="156" text-anchor="middle" font-size="11" fill="#a78bfa" font-weight="700">UV</text>
            <circle cx="110" cy="150" r="13" fill="#1e1b4b" stroke="#ef4444" stroke-width="2"/>
            <text x="110" y="156" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="700">IR</text>
            <text x="90" y="190" text-anchor="middle" font-size="9" fill="white" font-family="system-ui">FLAMMEN</text>
          </g>

          <!-- Fire source -->
          <g id="fire">
            <g transform="translate(440, 200)">
              <path d="M0 60 Q-25 30 0 0 Q25 30 0 60 Z" fill="#ef4444">
                <animateTransform attributeName="transform" type="scale" values="1 1; 1.05 1.15; 1 1" dur="0.4s" repeatCount="indefinite" additive="sum"/>
              </path>
              <path d="M0 55 Q-15 28 0 6 Q15 30 0 55 Z" fill="#fbbf24"/>
              <path d="M0 50 Q-8 30 0 14 Q8 32 0 50 Z" fill="#fef3c7"/>
            </g>
          </g>

          <!-- UV emission lines -->
          <g id="uv-lines" opacity="0" stroke="#a78bfa" stroke-width="1.5">
            <line x1="430" y1="220" x2="70" y2="160">
              <animate attributeName="opacity" values="0; 1; 0" dur="0.4s" repeatCount="indefinite"/>
            </line>
            <line x1="438" y1="225" x2="80" y2="165">
              <animate attributeName="opacity" values="0; 1; 0" dur="0.4s" begin="0.1s" repeatCount="indefinite"/>
            </line>
            <line x1="424" y1="218" x2="60" y2="158">
              <animate attributeName="opacity" values="0; 1; 0" dur="0.4s" begin="0.2s" repeatCount="indefinite"/>
            </line>
          </g>

          <!-- IR emission (wavy) -->
          <g id="ir-lines" opacity="0" stroke="#ef4444" stroke-width="2" fill="none">
            <path d="M425 230 Q300 270 175 200 Q120 170 110 165">
              <animate attributeName="opacity" values=".3; 1; .3" dur="1s" repeatCount="indefinite"/>
            </path>
          </g>

          <!-- Spectral analysis -->
          <g id="spectrum" opacity="0" transform="translate(170, 50)">
            <rect x="0" y="0" width="250" height="60" rx="6" fill="#0b1424" stroke="#22c55e" stroke-width="2"/>
            <text x="125" y="14" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace">UV (190-260nm) + IR (~4.3µm)</text>
            <g fill="#a78bfa">
              <rect x="20" y="40" width="6" height="14"/>
              <rect x="30" y="35" width="6" height="19"/>
              <rect x="40" y="32" width="6" height="22"/>
              <rect x="50" y="30" width="6" height="24"/>
            </g>
            <g fill="#ef4444">
              <rect x="170" y="38" width="6" height="16"/>
              <rect x="180" y="32" width="6" height="22"/>
              <rect x="190" y="28" width="6" height="26"/>
              <rect x="200" y="32" width="6" height="22"/>
              <rect x="210" y="38" width="6" height="16"/>
            </g>
          </g>

          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="40" y="40" width="160" height="40" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="120" y="66" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ FLAMME</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['sensor'],          text:'① Der Flammenmelder hat zwei spezielle Sensoren: einen UV-Detektor (185-260 nm) und einen IR-Detektor (~4,3 µm).' },
        { t: 4000, h: ['fire'],            text:'② Eine offene Flamme emittiert immer UV-Strahlung (heißes Plasma) UND charakteristische IR-Wellenlängen.' },
        { t: 8000, h: ['uv-lines','ir-lines'], text:'③ Beide Strahlungstypen erreichen den Sensor — UV blitzartig, IR kontinuierlich.' },
        { t: 12000,h: ['spectrum'],        text:'④ Spektralanalyse: erkennt das eindeutige Doppel-Spektrum echter Flammen. Sonnenlicht oder Schweißlicht wird ausgefiltert.' },
        { t: 16000,h: ['alarm'],           text:'⑤ Sofort-Alarm — für Tankstellen, Industrie, Chemie. DIN EN 54-10.' },
      ],
      cycle: 20000,
    };
  }
})();
