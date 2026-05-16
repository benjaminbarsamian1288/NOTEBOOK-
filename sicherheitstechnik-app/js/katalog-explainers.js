/* Katalog-Animationen · Detaillierte Explainer-Animationen für
   mechanische, Video-, Brand-, Zutritts- und Alarm-Komponenten.
   Hängt sich an das bestehende EXPL-System (explainers.js) */

(function() {
  if (!window.EXPL) {
    console.warn('EXPL system missing');
    return;
  }
  const ANIMS = {};

  /* SVG-Wrapper */
  const wrap = (vbox, inner) => `<svg viewBox="${vbox}" xmlns="http://www.w3.org/2000/svg" class="expl-svg">${inner}</svg>`;

  /* =========================================================
     MECHANIK
     ========================================================= */

  // RC2-Tür Verriegelung
  ANIMS['tuer-rc2'] = {
    title: 'RC2-Sicherheitstür · Mehrfach-Verriegelung',
    intro: '3-fach-Verriegelung mit Pilzkopf-Beschlag · DIN EN 1627',
    cycle: 14000,
    svg: wrap('0 0 600 360', `
      <defs>
        <linearGradient id="tw" x2="1" y2="1"><stop offset="0" stop-color="#9a7b4f"/><stop offset="1" stop-color="#4a3a23"/></linearGradient>
        <linearGradient id="tm" x2="1" y2="0"><stop offset="0" stop-color="#cbd5e1"/><stop offset=".5" stop-color="#f1f5f9"/><stop offset="1" stop-color="#94a3b8"/></linearGradient>
      </defs>
      <rect width="600" height="360" fill="#0a0f1a"/>
      <line x1="0" y1="320" x2="600" y2="320" stroke="#1e293b" stroke-width="3"/>
      <!-- Zarge -->
      <rect x="180" y="30" width="240" height="290" fill="#1e293b"/>
      <!-- Türblatt -->
      <rect x="200" y="40" width="200" height="270" fill="url(#tw)"/>
      <!-- Füllungen -->
      <rect x="220" y="60" width="160" height="90" fill="rgba(0,0,0,.25)"/>
      <rect x="220" y="170" width="160" height="130" fill="rgba(0,0,0,.25)"/>
      <!-- Knauf -->
      <circle cx="220" cy="180" r="5" fill="#fbbf24"/>
      <!-- Drücker -->
      <g id="t-griff">
        <rect x="345" y="178" width="40" height="6" rx="3" fill="url(#tm)"/>
        <circle cx="362" cy="181" r="4" fill="#94a3b8"/>
        <rect x="340" y="190" width="40" height="22" rx="2" fill="#475569"/>
        <circle cx="360" cy="200" r="3" fill="#0a0f1a"/>
      </g>
      <!-- Riegel-Schließbleche in der Zarge -->
      <rect x="402" y="68" width="6" height="14" fill="#1e293b" stroke="#475569"/>
      <rect x="402" y="190" width="6" height="18" fill="#1e293b" stroke="#475569"/>
      <rect x="402" y="285" width="6" height="14" fill="#1e293b" stroke="#475569"/>

      <!-- STEP s1: Schlüssel im Schloss -->
      <g id="s1-key" opacity="0">
        <rect x="320" y="195" width="20" height="6" fill="#fbbf24"/>
        <rect x="318" y="192" width="6" height="12" fill="#fbbf24"/>
        <text x="280" y="240" font-size="12" fill="#fbbf24" font-family="system-ui" font-weight="800">Schlüssel</text>
      </g>

      <!-- STEP s2: Riegel fahren raus -->
      <g id="s2-r1" opacity="0">
        <rect x="395" y="70" width="12" height="10" fill="url(#tm)" stroke="#0b1424" stroke-width=".5">
          <animate attributeName="x" values="380;398;398" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/>
        </rect>
      </g>
      <g id="s2-r2" opacity="0">
        <rect x="395" y="192" width="14" height="14" fill="url(#tm)" stroke="#0b1424" stroke-width=".5">
          <animate attributeName="x" values="375;395;395" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/>
        </rect>
      </g>
      <g id="s2-r3" opacity="0">
        <rect x="395" y="285" width="12" height="10" fill="url(#tm)" stroke="#0b1424" stroke-width=".5">
          <animate attributeName="x" values="380;398;398" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/>
        </rect>
      </g>

      <!-- STEP s3: Pilzkopf-Zapfen -->
      <g id="s3-pilz" opacity="0">
        ${[90,130,250,290].map(y => `
          <circle cx="398" cy="${y}" r="4" fill="#fbbf24"/>
          <rect x="394" y="${y-1.5}" width="8" height="3" fill="#fbbf24"/>
        `).join('')}
        <text x="425" y="180" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">+ 4 Pilzköpfe</text>
      </g>

      <!-- STEP s4: LED + Status -->
      <g id="s4-status" opacity="0">
        <circle cx="350" cy="225" r="5" fill="#22c55e">
          <animate attributeName="opacity" values="1;.4;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <rect x="20" y="20" width="200" height="32" rx="6" fill="#22c55e"/>
        <text x="120" y="40" text-anchor="middle" font-size="14" fill="#0b1424" font-family="system-ui" font-weight="900">✓ VERRIEGELT · RC2</text>
      </g>

      <!-- STEP s5: Angreifer mit Brecheisen -->
      <g id="s5-attack" opacity="0">
        <line x1="500" y1="180" x2="420" y2="200" stroke="#475569" stroke-width="6"/>
        <line x1="420" y1="200" x2="415" y2="195" stroke="#475569" stroke-width="6"/>
        <text x="475" y="160" text-anchor="middle" font-size="12" fill="#ef4444" font-family="system-ui" font-weight="700">Brecheisen</text>
        <text x="475" y="220" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">3+ Min Widerstand</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                         text: '① Sicherheitstür RC2 nach DIN EN 1627. Türblatt 50—65 mm mit Stahleinlage, verstärkter Zylinder, Stahl-Schließbleche.' },
      { t: 2200, h: ['s1-key'],                 text: '② Schlüssel einstecken und drehen. Profilzylinder VdS BZ+ mit Bohr- und Ziehschutz.' },
      { t: 4200, h: ['s1-key','s2-r1','s2-r2','s2-r3'], text: '③ 3 Stahl-Riegel fahren simultan in die Schließbleche der Zarge. Mehrfachverriegelung über Treibstangen.' },
      { t: 7400, h: ['s1-key','s2-r1','s2-r2','s2-r3','s3-pilz'], text: '④ Zusätzlich 4 Pilzkopf-Zapfen greifen hinter die Stahl-Schließbleche → Aufhebeln verhindert.' },
      { t: 10000, h: ['s2-r1','s2-r2','s2-r3','s3-pilz','s4-status'], text: '⑤ Status: VERRIEGELT. Polizei-Empfehlung für Wohnung — 3 Minuten Widerstand gegen Standardwerkzeug.' },
      { t: 12000, h: ['s2-r1','s2-r2','s2-r3','s3-pilz','s4-status','s5-attack'], text: '⑥ Brecheisen-Angriff: keine Chance zum Aufhebeln dank 3+4 Verriegelungspunkten. Polizei in 3 Min vor Ort.' },
    ],
  };

  // Tresor-Riegelwerk
  ANIMS['tresor-1'] = {
    title: 'Wertschutzschrank Klasse I · 4-Speichen-Riegelwerk',
    intro: 'EN 1143-1 · Doppelschloss + 8-fach Bolzen-Verriegelung',
    cycle: 13000,
    svg: wrap('0 0 600 360', `
      <defs>
        <linearGradient id="trm" x2="1" y2="1"><stop offset="0" stop-color="#475569"/><stop offset=".5" stop-color="#94a3b8"/><stop offset="1" stop-color="#1e293b"/></linearGradient>
        <linearGradient id="trd" x2="0" y2="1"><stop offset="0" stop-color="#334155"/><stop offset="1" stop-color="#0f172a"/></linearGradient>
      </defs>
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Korpus -->
      <rect x="180" y="40" width="240" height="280" fill="url(#trm)" stroke="#0b1424" stroke-width="2"/>
      <!-- Innentür -->
      <rect x="200" y="60" width="200" height="240" fill="url(#trd)" stroke="#475569" stroke-width="2"/>

      <!-- STEP s1: Schloss + Dial -->
      <g id="s1-locks" opacity="0">
        <g transform="translate(240, 110)">
          <circle r="20" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5"/>
          <circle r="16" fill="none" stroke="#475569"/>
          <line x1="0" y1="-18" x2="0" y2="-14" stroke="#dc2626" stroke-width="2.5"/>
          <text y="34" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui" font-weight="700">DIAL</text>
        </g>
        <g transform="translate(360, 110)">
          <rect x="-22" y="-12" width="44" height="24" fill="#0a0f1a" stroke="#22c55e" stroke-width="1.5" rx="3"/>
          <text y="5" text-anchor="middle" font-size="11" fill="#22c55e" font-family="monospace" font-weight="800">1234</text>
        </g>
      </g>

      <!-- STEP s2: Drehgriff -->
      <g id="s2-handle" opacity="0">
        <g transform="translate(300, 200)">
          <animateTransform attributeName="transform" type="rotate" values="0;90;90" keyTimes="0;.5;1" dur="3s" additive="sum" repeatCount="indefinite"/>
          <circle r="42" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5"/>
          <circle r="10" fill="#cbd5e1"/>
          <rect x="-3" y="-42" width="6" height="84" fill="#cbd5e1"/>
          <rect x="-42" y="-3" width="84" height="6" fill="#cbd5e1"/>
          <circle cx="0" cy="-38" r="5" fill="#475569"/>
          <circle cx="0" cy="38" r="5" fill="#475569"/>
          <circle cx="-38" cy="0" r="5" fill="#475569"/>
          <circle cx="38" cy="0" r="5" fill="#475569"/>
        </g>
      </g>

      <!-- STEP s3: 8 Bolzen fahren raus -->
      <g id="s3-bolts" opacity="0">
        <!-- Oben 3 -->
        <rect x="232" y="46" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="y" values="55;46;46" dur="3s" repeatCount="indefinite"/></rect>
        <rect x="290" y="46" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="y" values="55;46;46" dur="3s" begin=".1s" repeatCount="indefinite"/></rect>
        <rect x="348" y="46" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="y" values="55;46;46" dur="3s" begin=".2s" repeatCount="indefinite"/></rect>
        <!-- Rechts 3 -->
        <rect x="406" y="118" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="x" values="394;414;414" dur="3s" begin=".1s" repeatCount="indefinite"/></rect>
        <rect x="406" y="180" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="x" values="394;414;414" dur="3s" begin=".2s" repeatCount="indefinite"/></rect>
        <rect x="406" y="240" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="x" values="394;414;414" dur="3s" begin=".3s" repeatCount="indefinite"/></rect>
        <!-- Unten 2 -->
        <rect x="260" y="298" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="y" values="290;298;298" dur="3s" begin=".4s" repeatCount="indefinite"/></rect>
        <rect x="320" y="298" width="14" height="14" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5"><animate attributeName="y" values="290;298;298" dur="3s" begin=".5s" repeatCount="indefinite"/></rect>
      </g>

      <!-- STEP s4: Sabotage-Sensor blinkt -->
      <g id="s4-sense" opacity="0">
        <circle cx="450" cy="60" r="6" fill="#dc2626"><animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/></circle>
        <text x="465" y="65" font-size="10" fill="#dc2626" font-family="system-ui" font-weight="800">VdS-Kontakt</text>
      </g>

      <!-- STEP s5: Status -->
      <g id="s5-status" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="14" fill="#0b1424" font-family="system-ui" font-weight="900">✓ TRESOR · KLASSE I · VERSICHERT</text>
      </g>

      <!-- STEP s6: Angriffs-Bohrer (rot vibrierend) -->
      <g id="s6-attack" opacity="0">
        <line x1="480" y1="200" x2="430" y2="200" stroke="#dc2626" stroke-width="5">
          <animate attributeName="x2" values="430;425;430" dur=".3s" repeatCount="indefinite"/>
        </line>
        <circle cx="430" cy="200" r="4" fill="#fbbf24"/>
        <text x="500" y="180" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">Bohrer</text>
        <text x="500" y="225" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">WS 30 / RU 50</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                         text: '① Wertschutzschrank Klasse I nach EN 1143-1. Wandung 100—140 mm Stahl-Beton-Stahl. Versichert 40.000 € privat.' },
      { t: 2000, h: ['s1-locks'],               text: '② Doppelschloss-System: mechanischer Drei-Scheiben-Code-Schloss + elektronisches PIN-Schloss (Audit-Log).' },
      { t: 4000, h: ['s1-locks','s2-handle'],   text: '③ Nach Auth dreht sich der 4-Speichen-Drehgriff um 90° und entriegelt das Schloss-Mechanismus.' },
      { t: 6800, h: ['s2-handle','s3-bolts'],   text: '④ 8 Stahl-Bolzen Ø 25 mm fahren simultan in den Korpus (3 oben, 3 rechts, 2 unten). Riegelwerk verriegelt.' },
      { t: 9200, h: ['s3-bolts','s4-sense','s5-status'], text: '⑤ VdS-Sabotage-Kontakt überwacht jeden Werkzeugangriff. EMA-Anbindung optional.' },
      { t: 11400,h: ['s3-bolts','s4-sense','s5-status','s6-attack'], text: '⑥ Bei Angriff: Wandung hält 30 min Werkzeug (WS 30) bzw. 50 min Teilaufbruch (RU 50). Versicherbar.' },
    ],
  };

  // Fenster RC2 + Pilzkopf
  ANIMS['fenster-rc2'] = {
    title: 'RC2-Sicherheitsfenster · Pilzkopf-Beschlag',
    intro: 'P4A-Glas + Pilzköpfe + abschließbarer Griff',
    cycle: 12000,
    svg: wrap('0 0 600 360', `
      <defs>
        <linearGradient id="ff" x2="1" y2="0"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient>
        <linearGradient id="fg" x2="1" y2="1"><stop offset="0" stop-color="rgba(34,211,238,.2)"/><stop offset="1" stop-color="rgba(34,211,238,.05)"/></linearGradient>
      </defs>
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Rahmen -->
      <rect x="120" y="40" width="360" height="280" fill="url(#ff)" stroke="#94a3b8" stroke-width="3" rx="4"/>
      <rect x="290" y="40" width="20" height="280" fill="url(#ff)" stroke="#94a3b8"/>
      <!-- Glas -->
      <rect x="135" y="55" width="155" height="250" fill="url(#fg)" stroke="#3b82f6" stroke-width="2"/>
      <rect x="310" y="55" width="155" height="250" fill="url(#fg)" stroke="#3b82f6" stroke-width="2"/>

      <!-- s1: VSG-Glas Detail -->
      <g id="s1-glass" opacity="0">
        <rect x="500" y="100" width="80" height="160" fill="#0a0f1a" stroke="#22d3ee" rx="3"/>
        <rect x="510" y="115" width="60" height="6" fill="#22d3ee" opacity=".7"/>
        <rect x="510" y="124" width="60" height="2" fill="#fbbf24"/>
        <rect x="510" y="129" width="60" height="6" fill="#22d3ee" opacity=".7"/>
        <rect x="510" y="138" width="60" height="2" fill="#fbbf24"/>
        <rect x="510" y="143" width="60" height="6" fill="#22d3ee" opacity=".7"/>
        <text x="540" y="180" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">P4A · VSG</text>
        <text x="540" y="200" text-anchor="middle" font-size="9" fill="#94a3b8">5+0,76+5 mm</text>
      </g>

      <!-- s2: Griff dreht -->
      <g id="s2-grip" opacity="0">
        <g transform="translate(140, 180)">
          <rect x="-4" y="-4" width="8" height="8" fill="#1e293b"/>
          <rect x="-5" y="-30" width="10" height="30" rx="3" fill="#1e293b">
            <animateTransform attributeName="transform" type="rotate" values="0;-90;-90" keyTimes="0;.5;1" dur="2.5s" repeatCount="indefinite"/>
          </rect>
        </g>
        <text x="180" y="220" font-size="10" fill="#22c55e" font-weight="700">Griff drehen</text>
      </g>

      <!-- s3: 4 Pilzkopfzapfen -->
      <g id="s3-pilz" opacity="0">
        ${[80,140,220,280].map((y, i) => `
          <g>
            <rect x="284" y="${y-2}" width="14" height="4" fill="#475569">
              <animate attributeName="width" values="2;14;14" keyTimes="0;.5;1" dur="2.5s" begin="${i*0.1}s" repeatCount="indefinite"/>
              <animate attributeName="x" values="296;284;284" keyTimes="0;.5;1" dur="2.5s" begin="${i*0.1}s" repeatCount="indefinite"/>
            </rect>
            <circle cx="290" cy="${y}" r="5" fill="#1e293b">
              <animate attributeName="r" values="2;5;5" keyTimes="0;.5;1" dur="2.5s" begin="${i*0.1}s" repeatCount="indefinite"/>
            </circle>
          </g>
        `).join('')}
        <text x="370" y="180" font-size="10" fill="#fbbf24" font-weight="800">Pilzköpfe · 4×</text>
      </g>

      <!-- s4: Status -->
      <g id="s4-status" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="14" fill="#0b1424" font-family="system-ui" font-weight="900">✓ VERRIEGELT · RC2</text>
      </g>

      <!-- s5: Wurfkugel-Test -->
      <g id="s5-test" opacity="0">
        <g>
          <circle cx="100" cy="180" r="14" fill="#475569" stroke="#0b1424" stroke-width="2">
            <animate attributeName="cx" values="50;200;50" dur="2s" repeatCount="indefinite"/>
          </circle>
        </g>
        <text x="100" y="240" font-size="10" fill="#ef4444" font-weight="700">P4A: Hält 3× Wurfkugel 4,11 kg</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                         text: '① RC2-Sicherheitsfenster nach DIN EN 1627. Polizei-Empfehlung für alle erreichbaren Fenster im Wohnbereich.' },
      { t: 1800, h: ['s1-glass'],               text: '② P4A-Sicherheitsglas: Verbundsicherheitsglas mit 0,76 mm PVB-Folie zwischen 2 Glasscheiben. Splitterbindung.' },
      { t: 4000, h: ['s1-glass','s2-grip'],     text: '③ Griff um 90° drehen — der Beschlag aktiviert sich. Abschließbar gegen Aufdrücken von außen.' },
      { t: 6500, h: ['s2-grip','s3-pilz'],      text: '④ 4 Pilzkopfzapfen greifen hinter Stahl-Schließbleche im Rahmen → Aufhebeln ausgeschlossen.' },
      { t: 9000, h: ['s3-pilz','s4-status','s5-test'], text: '⑤ Glas hält 3-fach Wurfkugel-Test (4,11 kg aus 9 m). Beschläge halten 3 Min mech. Aufbruch.' },
    ],
  };

  // Hydraulischer Versenkpoller
  ANIMS['poller-versenk-hydr'] = {
    title: 'Hydraulischer Versenkpoller · K12 Anti-Ram',
    intro: 'Stoppt 7,5-t-LKW @ 80 km/h · PAS 68',
    cycle: 12000,
    svg: wrap('0 0 600 360', `
      <defs>
        <linearGradient id="pm" x2="0" y2="1"><stop offset="0" stop-color="#cbd5e1"/><stop offset=".5" stop-color="#f1f5f9"/><stop offset="1" stop-color="#475569"/></linearGradient>
      </defs>
      <rect width="600" height="360" fill="#0a0f1a"/>
      <rect y="240" width="600" height="120" fill="#1e293b"/>
      <line x1="0" y1="240" x2="600" y2="240" stroke="#475569" stroke-width="2"/>
      <line x1="0" y1="300" x2="600" y2="300" stroke="#475569" stroke-dasharray="12 10"/>

      <!-- Poller versenkt -->
      <rect x="270" y="238" width="40" height="4" fill="#94a3b8"/>
      <rect x="278" y="239" width="24" height="2" fill="#fbbf24"/>

      <!-- s1: Auto fährt heran -->
      <g id="s1-truck" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="700 0;360 0;360 0" keyTimes="0;.6;1" dur="4s" repeatCount="indefinite"/>
          <rect x="-50" y="190" width="80" height="40" rx="4" fill="#475569" stroke="#1e293b"/>
          <rect x="-30" y="170" width="40" height="22" rx="6" fill="#0f172a" stroke="#475569"/>
          <circle cx="-30" cy="232" r="8" fill="#0a0f1a" stroke="#475569"/>
          <circle cx="20" cy="232" r="8" fill="#0a0f1a" stroke="#475569"/>
          <rect x="-52" y="210" width="4" height="6" rx="1" fill="#fef3c7"/>
        </g>
      </g>

      <!-- s2: Poller fährt aus -->
      <g id="s2-up" opacity="0">
        <rect x="270" y="160" width="40" height="80" fill="url(#pm)" stroke="#0b1424" stroke-width="1" rx="3">
          <animate attributeName="y" values="240;160;160" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="height" values="0;80;80" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect x="270" y="180" width="40" height="8" fill="#fbbf24"><animate attributeName="y" values="240;180;180" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/></rect>
        <rect x="270" y="210" width="40" height="8" fill="#fbbf24"><animate attributeName="y" values="240;210;210" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/></rect>
      </g>

      <!-- s3: Hydraulik unten -->
      <g id="s3-hyd" opacity="0">
        <rect x="278" y="280" width="24" height="50" fill="#dc2626" opacity=".7"/>
        <text x="290" y="345" text-anchor="middle" font-size="10" fill="#dc2626" font-family="monospace" font-weight="800">100 bar</text>
      </g>

      <!-- s4: Truck stoppt -->
      <g id="s4-stop" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#ef4444"><animate attributeName="opacity" values=".5;1;.5" dur=".5s" repeatCount="indefinite"/></rect>
        <text x="140" y="40" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="900">⚠ FAHRZEUG GESTOPPT</text>
      </g>

      <!-- s5: K12 Label -->
      <g id="s5-class" opacity="0">
        <rect x="430" y="60" width="140" height="36" rx="6" fill="#dc2626"/>
        <text x="500" y="78" text-anchor="middle" font-size="14" fill="white" font-weight="900">PAS 68 K12</text>
        <text x="500" y="92" text-anchor="middle" font-size="9" fill="#fbbf24">7,5t @ 80 km/h</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text: '① Versenkbarer Hydraulik-Poller im Bereitschafts-Modus. Versenkt: Verkehr fährt darüber.' },
      { t: 1800, h: ['s1-truck'],              text: '② Unbefugtes Fahrzeug nähert sich der gesicherten Zone. Kamera + ANPR erkennen.' },
      { t: 4000, h: ['s1-truck','s2-up','s3-hyd'], text: '③ Hydraulik-Steuerung lässt 100-bar-Druck aus dem Druckspeicher → Poller fährt in &lt; 2 Sek hoch.' },
      { t: 7000, h: ['s2-up','s3-hyd','s4-stop'],  text: '④ Fahrzeug rammt gegen den Poller → wird gestoppt. Energieumwandlung in Hydraulik + Stahl-Verformung.' },
      { t: 9500, h: ['s2-up','s4-stop','s5-class'], text: '⑤ Klasse PAS 68 K12: 7,5-t-LKW @ 80 km/h stoppt mit maximal 25 m Restlauf. KRITIS-Standard.' },
    ],
  };

  // PTZ-Kamera
  ANIMS['cam-ptz'] = {
    title: 'PTZ-Kamera · Pan/Tilt/Zoom + Auto-Tracking',
    intro: '25× optisches Zoom · Identifizieren > 200 m',
    cycle: 12000,
    svg: wrap('0 0 600 360', `
      <defs>
        <linearGradient id="ptzSky" x2="0" y2="1"><stop offset="0" stop-color="#020617"/><stop offset="1" stop-color="#1e2a44"/></linearGradient>
        <linearGradient id="irBeam" x2="1" y2="0"><stop offset="0" stop-color="rgba(34,211,238,.5)"/><stop offset="1" stop-color="rgba(34,211,238,0)"/></linearGradient>
      </defs>
      <rect width="600" height="300" fill="url(#ptzSky)"/>
      <rect y="300" width="600" height="60" fill="#0a0f1a"/>
      <line x1="0" y1="300" x2="600" y2="300" stroke="#1e293b" stroke-width="2"/>
      <!-- Mast -->
      <rect x="48" y="80" width="8" height="220" fill="#94a3b8"/>
      <rect x="44" y="78" width="16" height="6" fill="#475569"/>

      <!-- Kamera-Kopf (mit Pan-Rotation) -->
      <g id="cam-head">
        <g>
          <animateTransform id="cam-anim" attributeName="transform" type="rotate" values="0 52 70; -45 52 70; 45 52 70; 0 52 70" keyTimes="0;.33;.66;1" dur="6s" repeatCount="indefinite"/>
          <rect x="32" y="55" width="40" height="30" rx="6" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
          <ellipse cx="52" cy="80" rx="18" ry="12" fill="#0c0a1a" stroke="#475569"/>
          <circle cx="52" cy="83" r="8" fill="#0c0a1a"/>
          <circle cx="52" cy="83" r="3" fill="#22d3ee"/>
        </g>
      </g>

      <!-- s1: IR-Strahl folgt der Pan-Bewegung -->
      <g id="s1-beam" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 52 70; -45 52 70; 45 52 70; 0 52 70" keyTimes="0;.33;.66;1" dur="6s" repeatCount="indefinite"/>
          <path d="M 52 70 L 580 90 L 580 200 L 52 80 Z" fill="url(#irBeam)" opacity=".4"/>
        </g>
      </g>

      <!-- s2: Person läuft -->
      <g id="s2-person" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="580 0;200 0;200 0" keyTimes="0;.5;1" dur="6s" repeatCount="indefinite"/>
          <circle cx="0" cy="240" r="8" fill="#e8edf7"/>
          <rect x="-6" y="248" width="12" height="22" rx="3" fill="#3b82f6"/>
          <line x1="-3" y1="270" x2="-5" y2="285" stroke="#1e3a8a" stroke-width="3"><animate attributeName="x2" values="-5;-2;-5" dur=".6s" repeatCount="indefinite"/></line>
          <line x1="3" y1="270" x2="5" y2="285" stroke="#1e3a8a" stroke-width="3"><animate attributeName="x2" values="5;2;5" dur=".6s" repeatCount="indefinite"/></line>
        </g>
      </g>

      <!-- s3: Bounding Box folgt der Person -->
      <g id="s3-bbox" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="580 0;200 0;200 0" keyTimes="0;.5;1" dur="6s" repeatCount="indefinite"/>
          <rect x="-12" y="225" width="24" height="60" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 3">
            <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.5s" repeatCount="indefinite"/>
          </rect>
          <rect x="-22" y="212" width="60" height="12" fill="#22c55e"/>
          <text x="8" y="221" text-anchor="middle" font-size="8" fill="#0b1424" font-family="monospace" font-weight="800">PERSON 97%</text>
        </g>
      </g>

      <!-- s4: Zoom-Stufen -->
      <g id="s4-zoom" opacity="0">
        <rect x="430" y="40" width="150" height="40" rx="6" fill="#0a0f1a" stroke="#22d3ee" stroke-width="2"/>
        <text x="505" y="58" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">25× ZOOM AKTIV</text>
        <text x="505" y="72" text-anchor="middle" font-size="9" fill="#94a3b8">Identifizieren > 200 m</text>
      </g>

      <!-- s5: Distanz-Skala -->
      <g id="s5-dist" opacity="0">
        ${[200,500,900].map((d, i) => {
          const x = 100 + i * 180;
          return `<line x1="${x}" y1="290" x2="${x}" y2="305" stroke="#22d3ee" stroke-width="1.5"/>
                  <text x="${x}" y="320" text-anchor="middle" font-size="10" fill="#22d3ee">${d}m</text>`;
        }).join('')}
        <text x="100" y="335" text-anchor="middle" font-size="9" fill="#22c55e">IDENTIFIZIEREN</text>
        <text x="280" y="335" text-anchor="middle" font-size="9" fill="#fbbf24">ERKENNEN</text>
        <text x="460" y="335" text-anchor="middle" font-size="9" fill="#06b6d4">BEOBACHTEN</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text: '① PTZ-Dome-Kamera mit 4 oder 8 MP Sensor und 25× optischem Zoom. Schwenkt 360°, neigt 0—90°.' },
      { t: 1800, h: ['s1-beam'],                 text: '② Kamera-Kopf schwenkt aktiv (Pan), das Field-of-View streicht über das Gelände. Laser-IR bis 100 m für Nacht.' },
      { t: 4000, h: ['s1-beam','s2-person'],     text: '③ Bewegung erkannt — eine Person betritt den Erfassungsbereich.' },
      { t: 6200, h: ['s2-person','s3-bbox'],     text: '④ KI-Auto-Tracking: Bounding-Box mit Konfidenz folgt automatisch der Person, PTZ-Motor regelt nach.' },
      { t: 8500, h: ['s2-person','s3-bbox','s4-zoom','s5-dist'], text: '⑤ 25× optisches Zoom rückt Person formatfüllend. Bei 200 m noch identifizierbar (Gesicht erkennbar).' },
    ],
  };

  // Wärmebildkamera
  ANIMS['cam-thermal'] = {
    title: 'Wärmebildkamera · Stefan-Boltzmann-Detektion',
    intro: 'Detektiert Personen unabhängig von Licht · ΔT 0,05 K',
    cycle: 11000,
    svg: wrap('0 0 600 360', `
      <defs>
        <linearGradient id="thSky" x2="0" y2="1"><stop offset="0" stop-color="#020617"/><stop offset="1" stop-color="#0c1429"/></linearGradient>
        <radialGradient id="thG"><stop offset="0" stop-color="rgba(255,140,0,.6)"/><stop offset=".5" stop-color="rgba(220,38,38,.3)"/><stop offset="1" stop-color="rgba(220,38,38,0)"/></radialGradient>
      </defs>
      <rect width="600" height="300" fill="url(#thSky)"/>
      <rect y="300" width="600" height="60" fill="#0a0f1a"/>

      <!-- Kamera -->
      <g>
        <rect x="40" y="120" width="60" height="40" rx="4" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
        <circle cx="70" cy="140" r="12" fill="#0c0a1a" stroke="#dc2626"/>
        <circle cx="70" cy="140" r="6" fill="#dc2626"/>
      </g>

      <!-- s1: Sichtkegel -->
      <g id="s1-fov" opacity="0">
        <path d="M 100 140 L 560 60 L 560 280 L 100 145 Z" fill="rgba(220,38,38,.08)" stroke="rgba(220,38,38,.3)" stroke-dasharray="3 2"/>
        <text x="350" y="50" font-size="12" fill="#dc2626" font-weight="800">THERMAL · 8—14 µm</text>
      </g>

      <!-- s2: Person mit Wärme-Glow -->
      <g id="s2-person" opacity="0">
        <g transform="translate(400, 200)">
          <ellipse cx="0" cy="0" rx="35" ry="50" fill="url(#thG)"/>
          <circle cx="0" cy="-30" r="12" fill="#ef4444"/>
          <ellipse cx="0" cy="10" rx="14" ry="28" fill="#fbbf24" opacity=".9"/>
          <rect x="-16" y="-5" width="6" height="30" rx="3" fill="#fbbf24" transform="rotate(-8)"/>
          <rect x="10" y="-5" width="6" height="30" rx="3" fill="#fbbf24" transform="rotate(8)"/>
          <rect x="-7" y="35" width="5" height="30" rx="2" fill="#fef3c7"/>
          <rect x="2" y="35" width="5" height="30" rx="2" fill="#fef3c7"/>
        </g>
      </g>

      <!-- s3: Temperatur-Anzeige -->
      <g id="s3-temp" opacity="0">
        <rect x="350" y="100" width="100" height="50" rx="5" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="400" y="118" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">37,2 °C</text>
        <text x="400" y="135" text-anchor="middle" font-size="9" fill="#94a3b8">Hintergrund 15 °C</text>
        <text x="400" y="146" text-anchor="middle" font-size="9" fill="#22c55e">ΔT = 22,2 K ✓</text>
      </g>

      <!-- s4: Skala unten -->
      <g id="s4-scale" opacity="0">
        <defs>
          <linearGradient id="thScale" x2="1" y2="0">
            <stop offset="0" stop-color="#1e3a8a"/>
            <stop offset=".25" stop-color="#06b6d4"/>
            <stop offset=".5" stop-color="#22c55e"/>
            <stop offset=".75" stop-color="#fbbf24"/>
            <stop offset="1" stop-color="#dc2626"/>
          </linearGradient>
        </defs>
        <rect x="100" y="320" width="400" height="14" rx="3" fill="url(#thScale)"/>
        <text x="100" y="350" font-size="10" fill="#1e3a8a">−20 °C</text>
        <text x="500" y="350" font-size="10" fill="#dc2626" text-anchor="end">+50 °C</text>
      </g>

      <!-- s5: Detektion -->
      <g id="s5-detect" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#dc2626"><animate attributeName="opacity" values=".5;1;.5" dur=".5s" repeatCount="indefinite"/></rect>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="white" font-weight="900">⚠ HEAT SIGNATURE DETECTED</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                            text: '① Wärmebildkamera mit Mikrobolometer-Sensor. Detektiert Strahlung im fernen Infrarot (8—14 µm).' },
      { t: 1500, h: ['s1-fov','s4-scale'],         text: '② Sichtfeld erfasst Wärme-Signaturen unabhängig von Beleuchtung. Auflösung typisch 384×288 oder 640×512.' },
      { t: 3500, h: ['s1-fov','s2-person','s4-scale'], text: '③ Person betritt das Sichtfeld. Körper strahlt ca. 100—150 W ab (Stefan-Boltzmann: P = εσA T⁴).' },
      { t: 5800, h: ['s2-person','s3-temp','s4-scale'], text: '④ Sensor misst 37,2 °C bei 15 °C Hintergrund — ΔT 22 K. Detektion eindeutig.' },
      { t: 8500, h: ['s2-person','s3-temp','s4-scale','s5-detect'], text: '⑤ Alarm an Leitstelle. Bei Nacht, Nebel und Tarnkleidung weiterhin sichtbar.' },
    ],
  };

  // Sprinkler
  ANIMS['sprinkler-nass'] = {
    title: 'Sprinkler-Anlage Nass · VdS CEA 4001',
    intro: 'Glasfass-Auslösung bei 68/79/93 °C',
    cycle: 11000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Decke + Rohrleitung -->
      <rect width="600" height="35" fill="#475569"/>
      <line x1="0" y1="35" x2="600" y2="35" stroke="#1e293b" stroke-width="2"/>
      <line x1="0" y1="50" x2="600" y2="50" stroke="#94a3b8" stroke-width="6"/>
      <text x="40" y="22" font-size="10" fill="#0b1424" font-weight="700">RING-DRUCK 8 bar</text>

      <!-- Sprinkler-Köpfe -->
      ${[150,300,450].map((x, i) => `
        <g>
          <line x1="${x}" y1="50" x2="${x}" y2="75" stroke="#94a3b8" stroke-width="3"/>
          <circle cx="${x}" cy="80" r="6" fill="#dc2626"/>
          <rect id="glas-${i}" x="${x-1.5}" y="83" width="3" height="14" fill="#22d3ee" stroke="#fbbf24" stroke-width=".5"/>
        </g>
      `).join('')}

      <!-- s1: Feuer entsteht -->
      <g id="s1-fire" opacity="0">
        <g transform="translate(300, 280)">
          <path d="M-22 -10 Q-12 -45 0 -25 Q12 -50 18 -15 Q26 -10 12 5 Q0 12 -10 0 Z" fill="#dc2626">
            <animate attributeName="fill" values="#dc2626;#fbbf24;#dc2626" dur=".5s" repeatCount="indefinite"/>
          </path>
          <path d="M-12 -20 Q-5 -35 0 -20 Q5 -38 10 -22 Q12 -15 5 -5 Q-5 -5 -12 -20 Z" fill="#fbbf24" opacity=".8">
            <animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/>
          </path>
        </g>
        <!-- Rauch steigt -->
        ${Array.from({length: 5}, (_,i) => `<circle cx="${290 + i*5}" cy="${240 - i*30}" r="${10+i*3}" fill="#94a3b8" opacity=".4"><animate attributeName="cy" values="${260 - i*30};${100 - i*30}" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".4;0" dur="3s" repeatCount="indefinite"/></circle>`).join('')}
      </g>

      <!-- s2: Glasfass platzt am mittleren Sprinkler -->
      <g id="s2-burst" opacity="0">
        <text x="300" y="115" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="800">93 °C — GLAS PLATZT</text>
        ${Array.from({length: 6}, (_,i) => `<circle cx="300" cy="95" r="2" fill="#22d3ee"><animate attributeName="cx" values="300;${280 + i*8}" dur=".4s" repeatCount="indefinite"/><animate attributeName="cy" values="95;${88 + i*2}" dur=".4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur=".4s" repeatCount="indefinite"/></circle>`).join('')}
      </g>

      <!-- s3: Wasser fließt aus Mitte -->
      <g id="s3-water" opacity="0">
        ${Array.from({length: 12}, (_,i) => {
          const ang = -75 + i * 15;
          const x2 = 300 + Math.sin(ang*Math.PI/180) * 80;
          const y2 = 95 + Math.cos(ang*Math.PI/180) * 100;
          return `<line x1="300" y1="95" x2="${x2}" y2="${y2}" stroke="#22d3ee" stroke-width="2">
            <animate attributeName="opacity" values="0;1;0" dur=".5s" begin="${i*0.05}s" repeatCount="indefinite"/>
          </line>`;
        }).join('')}
      </g>

      <!-- s4: Feuer gelöscht -->
      <g id="s4-extinguished" opacity="0">
        <rect x="20" y="20" width="200" height="28" rx="4" fill="#22c55e"/>
        <text x="120" y="38" text-anchor="middle" font-size="12" fill="#0b1424" font-weight="900">✓ BRAND GELÖSCHT</text>
      </g>

      <!-- s5: Wasser-Bedarf -->
      <g id="s5-flow" opacity="0">
        <rect x="380" y="20" width="200" height="42" rx="4" fill="#0a0f1a" stroke="#22d3ee"/>
        <text x="480" y="35" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="700">FLOW · OH 3 Klasse</text>
        <text x="480" y="50" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="900">1.250 l/min @ 12,5 mm/min</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text: '① Sprinkler-Anlage Nass nach VdS CEA 4001. Rohrnetz unter Wasserdruck (8 bar), Sprinkler mit Glasfass-Auslöser.' },
      { t: 1800, h: ['s1-fire'],                 text: '② Brand entsteht — heiße Luft + Rauch steigen zur Decke. Temperatur steigt direkt unter dem Sprinkler-Kopf.' },
      { t: 4500, h: ['s1-fire','s2-burst'],      text: '③ Glasfass (Alkohol-Wasser-Mischung) erreicht 93 °C, dehnt sich aus → Glas platzt → Ventil öffnet sich.' },
      { t: 6800, h: ['s1-fire','s3-water'],      text: '④ Wasser fließt nur an betroffenem Sprinkler aus (lokale Löschung). Andere Sprinkler bleiben geschlossen.' },
      { t: 8800, h: ['s3-water','s4-extinguished','s5-flow'], text: '⑤ Brand gelöscht. Bei OH-3-Klasse: 12,5 mm/min Beregnung — 1.250 l/min für 100 m².' },
    ],
  };

  // RFID-Leser
  ANIMS['rfid-mifare'] = {
    title: 'RFID-Zutritt · Mifare DESFire mit AES-128',
    intro: 'NFC 13,56 MHz · Auth → Tür-Öffner',
    cycle: 10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Tür -->
      <rect x="380" y="40" width="180" height="280" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <rect x="395" y="55" width="150" height="250" fill="#92400e"/>
      <rect x="540" y="170" width="6" height="14" fill="#1e293b"/>

      <!-- Leser -->
      <g>
        <rect x="240" y="140" width="80" height="100" rx="8" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <rect x="250" y="155" width="60" height="30" rx="3" fill="#0a0f1a"/>
        <text x="280" y="175" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">RFID</text>
        <circle id="leser-led" cx="280" cy="220" r="5" fill="#fbbf24">
          <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>

      <!-- s1: Karte erscheint -->
      <g id="s1-card" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;160 0;160 0" keyTimes="0;.5;1" dur="2s" repeatCount="indefinite"/>
          <rect x="20" y="170" width="80" height="50" rx="4" fill="#fbbf24" stroke="#0b1424"/>
          <rect x="28" y="180" width="64" height="6" fill="#0b1424"/>
          <text x="60" y="205" text-anchor="middle" font-size="9" fill="#0b1424" font-weight="800">DESFire</text>
        </g>
      </g>

      <!-- s2: Welle -->
      <g id="s2-wave" opacity="0">
        ${[1,2,3].map(i => `<path d="M 270 ${195+i*10} q 8 5 0 10" stroke="#22d3ee" stroke-width="2" fill="none"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="${i*.15}s" repeatCount="indefinite"/></path>`).join('')}
        <text x="240" y="280" font-size="10" fill="#22d3ee" font-weight="700">13,56 MHz NFC</text>
      </g>

      <!-- s3: AES-Crypto -->
      <g id="s3-crypto" opacity="0">
        <rect x="80" y="60" width="200" height="60" rx="6" fill="#0a0f1a" stroke="#a855f7"/>
        <text x="180" y="80" text-anchor="middle" font-size="11" fill="#a855f7" font-weight="800">AES-128 Challenge</text>
        <text x="180" y="98" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">4F2A8B3C9E1D...</text>
        <text x="180" y="112" text-anchor="middle" font-size="9" fill="#22c55e">✓ Authenticated</text>
      </g>

      <!-- s4: Status grün -->
      <g id="s4-ok" opacity="0">
        <rect x="20" y="20" width="200" height="28" rx="4" fill="#22c55e"/>
        <text x="120" y="38" text-anchor="middle" font-size="12" fill="#0b1424" font-weight="900">✓ ZUTRITT GEWÄHRT</text>
      </g>

      <!-- s5: Tür öffnet -->
      <g id="s5-open" opacity="0">
        <rect x="395" y="55" width="150" height="250" fill="#92400e">
          <animateTransform attributeName="transform" type="rotate" values="0 545 180;-25 545 180;0 545 180" keyTimes="0;.5;1" dur="3s" repeatCount="indefinite"/>
        </rect>
        <text x="470" y="350" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="700">Türöffner aktiviert</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text: '① Mifare DESFire RFID-Leser an der Tür. Standard 13,56 MHz NFC mit AES-128 Verschlüsselung.' },
      { t: 1500, h: ['s1-card'],                 text: '② Mitarbeiter hält die Karte vor den Leser. Lesedistanz 2—10 cm.' },
      { t: 3500, h: ['s1-card','s2-wave'],       text: '③ Leser sendet 13,56-MHz-Feld und energetisiert die passive Karte. Karte antwortet mit UID.' },
      { t: 5500, h: ['s2-wave','s3-crypto'],     text: '④ Mutual Authentication: Leser sendet AES-Challenge, Karte verschlüsselt mit Sektor-Schlüssel zurück.' },
      { t: 7800, h: ['s3-crypto','s4-ok','s5-open'], text: '⑤ Berechtigung geprüft → ZKA-Controller öffnet Tür-Magnet 1 Sekunde. Audit-Log gespeichert.' },
    ],
  };

  // EMA-Zentrale
  ANIMS['ema-zentrale'] = {
    title: 'EMA-Zentrale VdS Grad 2 · Alarm-Verarbeitung',
    intro: 'Einbruchmeldeanlage mit NSL-Übertragung',
    cycle: 13000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Zentrale -->
      <rect x="60" y="60" width="220" height="240" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
      <rect x="80" y="80" width="180" height="50" rx="4" fill="#0a0f1a"/>
      <text id="zent-status" x="170" y="100" text-anchor="middle" font-size="11" fill="#22c55e" font-family="monospace" font-weight="800">SYSTEM SCHARF</text>
      <text x="170" y="118" text-anchor="middle" font-size="9" fill="#94a3b8">12:45 · GSM ▮▮▮▮ · 8 Linien</text>

      <!-- Linien-LEDs -->
      ${[0,1,2,3,4,5,6,7].map(i => `
        <rect x="${85 + (i%4)*42}" y="${145 + Math.floor(i/4)*40}" width="32" height="28" rx="3" fill="#0a0f1a" stroke="#475569"/>
        <circle id="line-${i}" cx="${101 + (i%4)*42}" cy="${159 + Math.floor(i/4)*40}" r="4" fill="#22c55e"/>
        <text x="${101 + (i%4)*42}" y="${175 + Math.floor(i/4)*40}" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="monospace">L${i+1}</text>
      `).join('')}

      <!-- s1: Magnetkontakt-Fenster wird ausgelöst -->
      <g id="s1-trigger" opacity="0">
        <rect x="370" y="80" width="200" height="100" rx="6" fill="rgba(34,197,94,.08)" stroke="#22c55e"/>
        <text x="470" y="100" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="700">FENSTER (L3)</text>
        <rect x="385" y="115" width="80" height="50" fill="rgba(34,211,238,.18)" stroke="#3b82f6"/>
        <rect x="475" y="115" width="80" height="50" fill="rgba(34,211,238,.18)" stroke="#3b82f6">
          <animateTransform attributeName="transform" type="rotate" values="0 555 130;-30 555 130;0 555 130" keyTimes="0;.5;1" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect id="magnet" x="463" y="135" width="14" height="10" fill="#fbbf24"/>
      </g>

      <!-- s2: Alarm-Linie blinkt rot -->
      <g id="s2-alarm" opacity="0">
        <text x="170" y="100" text-anchor="middle" font-size="11" fill="#ef4444" font-family="monospace" font-weight="800">⚠ ALARM L3 ⚠</text>
        <circle cx="143" cy="159" r="6" fill="#ef4444"><animate attributeName="opacity" values="1;.3;1" dur=".4s" repeatCount="indefinite"/></circle>
      </g>

      <!-- s3: Akustik + Sirene-Signal -->
      <g id="s3-siren" opacity="0">
        <rect x="370" y="200" width="200" height="60" rx="6" fill="#7f1d1d" stroke="#fbbf24" stroke-width="2"/>
        <circle cx="430" cy="230" r="14" fill="#1e293b"/>
        <circle cx="430" cy="230" r="8" fill="#dc2626"/>
        ${[1,2,3].map(i => `<path d="M 448 ${224+i*2} q 12 6 0 12" stroke="#dc2626" stroke-width="2" fill="none"><animate attributeName="opacity" values="0;1;0" dur=".6s" begin="${i*0.15}s" repeatCount="indefinite"/></path>`).join('')}
        <text x="510" y="225" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">SIRENE 110 dB</text>
        <text x="510" y="240" text-anchor="middle" font-size="9" fill="#fbbf24">+ Blitzleuchte</text>
      </g>

      <!-- s4: GSM-Übertragung NSL -->
      <g id="s4-nsl" opacity="0">
        <path d="M 280 95 Q 400 25 500 35" stroke="#fbbf24" stroke-width="2" fill="none" stroke-dasharray="6 4">
          <animate attributeName="stroke-dashoffset" values="0;-20" dur=".5s" repeatCount="indefinite"/>
        </path>
        <rect x="450" y="20" width="140" height="40" rx="4" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="520" y="36" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">NSL · VdS 2465</text>
        <text x="520" y="50" text-anchor="middle" font-size="9" fill="#22c55e">Operator alarmiert</text>
      </g>

      <!-- s5: Akku-Versorgung -->
      <g id="s5-battery" opacity="0">
        <rect x="60" y="305" width="220" height="36" fill="#0a0f1a" stroke="#22c55e"/>
        <rect x="76" y="316" width="14" height="20" rx="2" fill="#22c55e"/>
        <text x="170" y="328" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="700">AKKU 72h Notstrom</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text: '① EMA-Zentrale VdS Grad 2 mit 8 Linien. System scharf, alle Linien grün, GSM-Verbindung zu NSL aktiv.' },
      { t: 2000, h: ['s1-trigger'],              text: '② Einbrecher öffnet das gesicherte Fenster. Magnetkontakt an Linie 3 trennt sich.' },
      { t: 4200, h: ['s1-trigger','s2-alarm'],   text: '③ Zentrale erkennt Linien-Bruch in &lt; 100 ms → Alarm-Zustand. Linie 3 blinkt rot.' },
      { t: 6500, h: ['s2-alarm','s3-siren'],     text: '④ Alarm-Output schaltet: Außensirene 110 dB + Blitzleuchte. Innensirene wirkt zusätzlich.' },
      { t: 8800, h: ['s2-alarm','s4-nsl'],       text: '⑤ Parallel: GSM-Übertragung sendet Alarm-Telegramm an NSL (VdS-2465-Protokoll). Operator alarmiert Polizei.' },
      { t: 11000, h: ['s4-nsl','s5-battery'],    text: '⑥ Akku-Pufferung garantiert 72 h Notstrom — Sabotage am Stromnetz greift nicht.' },
    ],
  };

  // Glasbruch-Melder
  ANIMS['glasbruch-akustisch'] = {
    title: 'Glasbruch-Melder · 7—15 kHz Doppel-Peak',
    intro: 'Akustische Frequenzanalyse',
    cycle: 10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Fenster -->
      <rect x="60" y="60" width="280" height="240" fill="rgba(34,211,238,.15)" stroke="#3b82f6" stroke-width="3"/>
      <!-- Melder -->
      <rect x="370" y="100" width="80" height="60" rx="4" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
      <text x="410" y="120" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="800">GLAS</text>
      <text x="410" y="135" text-anchor="middle" font-size="9" fill="#94a3b8">DSP-Mikrofon</text>
      <circle id="g-led" cx="410" cy="150" r="4" fill="#22c55e">
        <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
      </circle>

      <!-- s1: Schlag -->
      <g id="s1-strike" opacity="0">
        <line x1="200" y1="100" x2="200" y2="60" stroke="#ef4444" stroke-width="5"/>
        <circle cx="200" cy="55" r="8" fill="#475569" stroke="#ef4444" stroke-width="2"/>
        <text x="200" y="40" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="800">Schlag (Tiefton)</text>
      </g>

      <!-- s2: Glas bricht -->
      <g id="s2-break" opacity="0">
        <path d="M200 100 L 120 200 M 200 100 L 280 220 M 200 100 L 100 280 M 200 100 L 300 290 M 200 100 L 240 260 M 200 100 L 80 150" stroke="#fbbf24" stroke-width="2"/>
        <text x="200" y="320" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">Glas splittert (Hochton)</text>
      </g>

      <!-- s3: Spektrum -->
      <g id="s3-spectrum" opacity="0">
        <rect x="370" y="200" width="200" height="120" rx="4" fill="#0a0f1a" stroke="#94a3b8"/>
        <text x="470" y="218" text-anchor="middle" font-size="10" fill="#94a3b8">FREQUENZ-SPEKTRUM</text>
        <!-- Tiefton-Peak -->
        <rect x="385" y="280" width="20" height="30" fill="#dc2626"/>
        <text x="395" y="316" text-anchor="middle" font-size="7" fill="#dc2626">800 Hz</text>
        <!-- Hochton-Peak -->
        <rect x="510" y="240" width="20" height="70" fill="#fbbf24"/>
        <text x="520" y="316" text-anchor="middle" font-size="7" fill="#fbbf24">12 kHz</text>
        <!-- Frequenz-Achse -->
        <line x1="380" y1="310" x2="565" y2="310" stroke="#475569"/>
        <text x="380" y="235" font-size="8" fill="#94a3b8">dB</text>
      </g>

      <!-- s4: DSP-Match -->
      <g id="s4-match" opacity="0">
        <text x="410" y="155" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="800">⚠ MATCH</text>
        <rect x="20" y="20" width="280" height="32" rx="6" fill="#ef4444"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></rect>
        <text x="160" y="40" text-anchor="middle" font-size="13" fill="white" font-weight="900">⚠ GLASBRUCH DETEKTIERT</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text: '① Akustischer Glasbruch-Melder mit Mikrofon und DSP. Lauscht permanent auf typische Frequenz-Profile.' },
      { t: 1500, h: ['s1-strike'],               text: '② Einbrecher schlägt mit Stein gegen Glas. Erst Tiefton (Schlag, &lt; 1 kHz) — noch nicht ausreichend.' },
      { t: 4000, h: ['s1-strike','s2-break'],    text: '③ Glas zerbricht — Splitter erzeugen Hochton (7—15 kHz). Charakteristischer Doppel-Peak.' },
      { t: 6200, h: ['s2-break','s3-spectrum'],  text: '④ DSP führt FFT-Analyse durch. Frequenz-Spektrum zeigt typisches Glas-Bruch-Profil mit beiden Peaks.' },
      { t: 8200, h: ['s2-break','s3-spectrum','s4-match'], text: '⑤ Pattern-Match bestätigt → Alarm. Doppel-Detektion verhindert Fehl-Alarme durch nur einen Schlag.' },
    ],
  };

  /* =========================================================
     WEITERE ANIMATIONEN — 12 zusätzliche
     ========================================================= */

  // Magnetkontakt
  ANIMS['magnet-kontakt'] = {
    title:'Magnet-Kontakt · Reed-Schalter Wirkprinzip',
    intro:'Tür/Fenster öffnet → Magnetfeld trennt → Alarm',
    cycle:9000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Rahmen -->
      <rect x="60" y="60" width="180" height="240" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <!-- Türflügel -->
      <g id="mk-door">
        <rect x="80" y="80" width="140" height="200" fill="#92400e">
          <animateTransform attributeName="transform" type="rotate" values="0 220 180;-30 220 180;0 220 180" keyTimes="0;.5;1" dur="3s" repeatCount="indefinite"/>
        </rect>
      </g>
      <!-- Reed-Schalter (im Rahmen) -->
      <rect x="245" y="120" width="60" height="36" rx="3" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
      <text x="275" y="142" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="800">REED</text>
      <line id="mk-reed-l" x1="251" y1="148" x2="269" y2="148" stroke="#22c55e" stroke-width="2.5"/>
      <line id="mk-reed-r" x1="281" y1="148" x2="299" y2="148" stroke="#22c55e" stroke-width="2.5"/>
      <!-- Magnet (an Türflügel) -->
      <g id="mk-mag">
        <rect x="206" y="120" width="36" height="36" rx="3" fill="#fbbf24">
          <animate attributeName="x" values="206;120;206" dur="3s" repeatCount="indefinite"/>
        </rect>
        <text x="224" y="142" text-anchor="middle" font-size="10" fill="#0b1424" font-family="system-ui" font-weight="900">N · S</text>
      </g>

      <!-- s1: Feld-Linien -->
      <g id="s1-field" opacity="0">
        ${[1,2,3].map(i => `<path d="M 224 ${135-i*5} q -10 -8 -20 0" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity="${0.7-i*0.15}"/>`).join('')}
        ${[1,2,3].map(i => `<path d="M 224 ${161+i*5} q -10 8 -20 0" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity="${0.7-i*0.15}"/>`).join('')}
      </g>

      <!-- s2: Reed geschlossen -->
      <g id="s2-closed" opacity="0">
        <text x="350" y="142" font-size="11" fill="#22c55e" font-family="monospace" font-weight="800">→ KONTAKT GESCHLOSSEN</text>
        <text x="350" y="160" font-size="9" fill="#94a3b8">Linie OK · Tür zu</text>
      </g>

      <!-- s3: Tür öffnet sich → Magnet weg -->
      <g id="s3-open" opacity="0">
        ${[1,2,3].map(i => `<path d="M 269 ${148-i*4} q 5 -8 12 0" stroke="#475569" stroke-width="1.5" fill="none" stroke-dasharray="2 2" opacity=".5"/>`).join('')}
        <text x="350" y="170" font-size="11" fill="#ef4444" font-family="monospace" font-weight="800">→ KONTAKT OFFEN</text>
        <text x="350" y="186" font-size="9" fill="#94a3b8">Magnetfeld &lt; Schwelle</text>
      </g>

      <!-- s4: Alarm -->
      <g id="s4-alarm" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#ef4444"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></rect>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="900">⚠ EINBRUCH-LINIE 3</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Magnetkontakt: Reed-Schalter im Rahmen, Permanentmagnet am Tür-/Fensterflügel. Bei geschlossener Tür sitzt Magnet direkt neben Reed.' },
      { t: 1800, h: ['s1-field','s2-closed'], text:'② Magnetfeld des Permanentmagneten zieht die zwei ferromagnetischen Plättchen im Glasröhrchen zusammen → Stromkreis geschlossen.' },
      { t: 4000, h: ['s3-open'],              text:'③ Tür wird geöffnet → Magnet entfernt sich. Sobald das Feld unter Schwelle fällt, federn die Reed-Kontakte auseinander.' },
      { t: 6500, h: ['s3-open','s4-alarm'],   text:'④ Stromkreis bricht → EMA-Zentrale erkennt Linien-Unterbrechung in &lt; 100 ms → Alarm. VdS-Variante erkennt zusätzlich Magnet-Sabotage (Anhalten eines Fremd-Magneten).' },
    ],
  };

  // PIR-Standard
  ANIMS['pir-standard'] = {
    title:'PIR-Bewegungsmelder · Pyroelektrik',
    intro:'Wärmestrahlung 8—14 µm · Fresnel-Linsen-Optik',
    cycle:11000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <line x1="0" y1="320" x2="600" y2="320" stroke="#1e293b" stroke-width="3"/>
      <!-- PIR-Gehäuse -->
      <rect x="40" y="60" width="60" height="60" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
      <rect x="48" y="84" width="44" height="20" fill="#0a0f1a"/>
      <circle cx="70" cy="94" r="6" fill="#22d3ee"/>
      <text x="70" y="138" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">PIR</text>

      <!-- s1: Fresnel-Zonen -->
      <g id="s1-zones" opacity="0">
        ${Array.from({length: 12}, (_,i) => {
          const ang = -55 + i * 10;
          return `<path d="M 70 100 L ${70 + Math.sin(ang*Math.PI/180)*500} ${100 + Math.cos(ang*Math.PI/180)*500}" stroke="#22d3ee" stroke-width=".8" stroke-dasharray="2 4" opacity=".4"/>`;
        }).join('')}
        <text x="300" y="50" font-size="11" fill="#22d3ee" font-weight="700">Fresnel-Linse · 12 Zonen</text>
      </g>

      <!-- s2: Wärmequelle Person -->
      <g id="s2-person" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="580 0;280 0;100 0;100 0" keyTimes="0;.4;.7;1" dur="6s" repeatCount="indefinite"/>
          <circle cx="0" cy="230" r="12" fill="#ef4444" opacity=".7"/>
          <ellipse cx="0" cy="260" rx="14" ry="22" fill="#fbbf24" opacity=".7"/>
          <rect x="-12" y="246" width="6" height="20" rx="3" fill="#fbbf24" opacity=".6" transform="rotate(-10)"/>
          <rect x="6" y="246" width="6" height="20" rx="3" fill="#fbbf24" opacity=".6" transform="rotate(10)"/>
          <rect x="-5" y="282" width="4" height="30" rx="2" fill="#fbbf24" opacity=".6"/>
          <rect x="1" y="282" width="4" height="30" rx="2" fill="#fbbf24" opacity=".6"/>
        </g>
      </g>

      <!-- s3: Element pyroelektrisch -->
      <g id="s3-elem" opacity="0">
        <rect x="370" y="60" width="200" height="80" rx="6" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="470" y="80" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">LiTaO₃ DUAL-ELEMENT</text>
        <rect x="395" y="95" width="60" height="30" fill="#1e293b" stroke="#fbbf24"/>
        <rect x="485" y="95" width="60" height="30" fill="#1e293b" stroke="#fbbf24"/>
        <line x1="455" y1="110" x2="485" y2="110" stroke="#475569"/>
        <text x="395" y="135" font-size="9" fill="#94a3b8">+</text>
        <text x="540" y="135" font-size="9" fill="#94a3b8">−</text>
      </g>

      <!-- s4: Spannungs-Wechsel -->
      <g id="s4-signal" opacity="0">
        <rect x="370" y="150" width="200" height="80" rx="6" fill="#0a0f1a" stroke="#22c55e"/>
        <text x="470" y="168" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="800">DIFFERENZ-SPANNUNG</text>
        <path d="M 380 200 L 395 200 L 405 180 L 420 180 L 430 200 L 445 200 L 455 220 L 470 220 L 480 200 L 495 200 L 505 180 L 520 180 L 530 200 L 560 200" stroke="#22c55e" stroke-width="2" fill="none"/>
      </g>

      <!-- s5: Alarm -->
      <g id="s5-alarm" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#ef4444"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></rect>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="white" font-weight="900">⚠ BEWEGUNG DETEKTIERT</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① PIR-Bewegungsmelder. Detektiert pyroelektrisch — Spannungsänderung bei wechselnder Wärmestrahlung.' },
      { t: 2000, h: ['s1-zones'],              text:'② Fresnel-Linse teilt das Sichtfeld in 12 schmale Sektoren — quasi 12 Mikro-Mess-Bereiche.' },
      { t: 4200, h: ['s1-zones','s2-person'],  text:'③ Person bewegt sich durch die Zonen. Jede Zone wird kurz "warm" → kurz "kalt" → wechselndes Wärmesignal.' },
      { t: 6500, h: ['s2-person','s3-elem','s4-signal'], text:'④ LiTaO₃-Dual-Element vergleicht zwei Halb-Felder. Bewegung erzeugt Differenz-Spannung im µV-Bereich.' },
      { t: 9000, h: ['s3-elem','s4-signal','s5-alarm'],   text:'⑤ Verstärker + Auswerter → bei Schwelle Überschreitung → Alarm. Anti-Tier-Maskierung filtert Haustiere (Größe).' },
    ],
  };

  // CO2-Anlage
  ANIMS['co2-anlage'] = {
    title:'CO₂-Löschanlage · Vollflutung',
    intro:'Sauerstoff-Verdrängung · LEBENSGEFAHR',
    cycle:13000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Flasche -->
      <rect x="40" y="50" width="80" height="240" rx="40" fill="#0a0f1a" stroke="#22d3ee" stroke-width="3"/>
      <text x="80" y="175" text-anchor="middle" font-size="28" fill="#22d3ee" font-weight="900">CO₂</text>
      <text x="80" y="200" text-anchor="middle" font-size="10" fill="#94a3b8">60 bar</text>
      <!-- Raum -->
      <rect x="200" y="60" width="360" height="240" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <text x="220" y="80" font-size="10" fill="#94a3b8" font-weight="700">SERVER-RAUM</text>
      <!-- Server-Schränke -->
      ${[230,290,350,410,470].map(x => `<rect x="${x}" y="180" width="40" height="100" fill="#475569" stroke="#1e293b"/><circle cx="${x+20}" cy="195" r="2" fill="#22c55e"/>`).join('')}

      <!-- s1: Brandmelder -->
      <g id="s1-detect" opacity="0">
        <circle cx="380" cy="100" r="14" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <circle cx="380" cy="100" r="6" fill="#22c55e"/>
        <text x="380" y="138" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="800">SENSOR</text>
        <g transform="translate(310, 240)">
          <path d="M-10 -8 Q-5 -25 0 -15 Q8 -28 12 -10 Q15 -3 5 5 Q-5 5 -10 -8 Z" fill="#dc2626">
            <animate attributeName="fill" values="#dc2626;#fbbf24;#dc2626" dur=".4s" repeatCount="indefinite"/>
          </path>
        </g>
      </g>

      <!-- s2: Vorwarnung -->
      <g id="s2-warn" opacity="0">
        <rect x="220" y="100" width="200" height="38" rx="4" fill="#fbbf24"><animate attributeName="opacity" values=".5;1;.5" dur=".5s" repeatCount="indefinite"/></rect>
        <text x="320" y="118" text-anchor="middle" font-size="11" fill="#0b1424" font-weight="900">⚠ VORWARNUNG · 30 s</text>
        <text x="320" y="132" text-anchor="middle" font-size="9" fill="#7f1d1d">Raum verlassen!</text>
      </g>

      <!-- s3: CO2-Stroming -->
      <g id="s3-flow" opacity="0">
        <line x1="120" y1="170" x2="200" y2="170" stroke="#22d3ee" stroke-width="4"/>
        <line x1="200" y1="170" x2="200" y2="100" stroke="#22d3ee" stroke-width="4"/>
        ${[230,290,350,410,470].map((x,i) => `<line x1="200" y1="80" x2="${x+20}" y2="80" stroke="#22d3ee" stroke-width="2"/><line x1="${x+20}" y1="80" x2="${x+20}" y2="100" stroke="#22d3ee" stroke-width="2"/>`).join('')}
        ${[230,290,350,410,470].map((x,i) => `<g transform="translate(${x+20}, 100)">${Array.from({length: 4}, (_,j) => `<line x1="0" y1="0" x2="${(j-1.5)*8}" y2="${20+j*5}" stroke="#22d3ee" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin="${j*0.1}s" repeatCount="indefinite"/></line>`).join('')}</g>`).join('')}
      </g>

      <!-- s4: Raum füllt sich -->
      <g id="s4-flood" opacity="0">
        ${Array.from({length: 30}, (_,i) => `<circle cx="${210 + (i%6)*60}" cy="${${80} + Math.floor(i/6)*40}" r="${6 + Math.random()*3}" fill="#22d3ee" opacity=".3"><animate attributeName="opacity" values=".1;.5;.1" dur="1s" begin="${i*0.04}s" repeatCount="indefinite"/></circle>`).join('')}
      </g>

      <!-- s5: gelöscht -->
      <g id="s5-done" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ BRAND GELÖSCHT</text>
        <text x="380" y="100" text-anchor="middle" font-size="9" fill="#22c55e">Konzentration &gt; 30 %</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text:'① CO₂-Löschanlage für Server-Raum. CO₂-Flaschen unter 60 bar Druck. Brandmelder überwachen Raum.' },
      { t: 2000, h: ['s1-detect'],               text:'② Brandmelder detektiert Feuer → Auslösung der Löschsequenz. Brand vorhanden.' },
      { t: 4200, h: ['s1-detect','s2-warn'],     text:'③ 30 Sek Vorwarnung mit Alarm + Sirene. Personen müssen den Raum verlassen — sonst Erstickungsgefahr!' },
      { t: 7000, h: ['s2-warn','s3-flow'],       text:'④ Magnetventile öffnen → CO₂ strömt unter Druck zu den Düsen im Raum. Rohrleitung in &lt; 5 Sek voll.' },
      { t: 9500, h: ['s3-flow','s4-flood'],      text:'⑤ Vollflutung: CO₂-Konzentration steigt auf &gt; 30 %. Sauerstoff-Anteil sinkt auf &lt; 14 % → Verbrennung unterbrochen.' },
      { t: 11500,h: ['s4-flood','s5-done'],      text:'⑥ Brand gelöscht. Keine Rückstände — perfekt für Server-/Daten-Räume. Danach Raum 30 min lüften vor Betreten.' },
    ],
  };

  // ASD-Aspirations-Melder
  ANIMS['asd'] = {
    title:'ASD · Aspirations-Rauchmelder',
    intro:'Aktiv-Luftansaugung · 1.000× empfindlicher als Punkt-Melder',
    cycle:11000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Deckenleitung mit Bohrungen -->
      <rect x="0" y="60" width="600" height="14" fill="#475569"/>
      ${[60,140,220,300,380,460,540].map(x => `<circle cx="${x}" cy="80" r="3" fill="#0a0f1a"/>`).join('')}
      <text x="20" y="55" font-size="10" fill="#94a3b8">PVC-ROHRNETZ (Ø 25 mm)</text>

      <!-- ASD-Box -->
      <rect x="60" y="180" width="120" height="100" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
      <text x="120" y="200" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">ASD</text>
      <rect x="80" y="215" width="80" height="50" fill="#0a0f1a" stroke="#475569"/>
      <text x="120" y="240" text-anchor="middle" font-size="14" fill="#22c55e" font-family="monospace" font-weight="800">0,03%</text>
      <text x="120" y="255" text-anchor="middle" font-size="8" fill="#94a3b8">obs/m</text>
      <line x1="120" y1="180" x2="120" y2="74" stroke="#94a3b8" stroke-width="3"/>

      <!-- s1: Lüfter -->
      <g id="s1-fan" opacity="0">
        <circle cx="120" cy="155" r="14" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <g transform="translate(120,155)">
          <animateTransform attributeName="transform" type="rotate" values="0;360" dur=".5s" repeatCount="indefinite"/>
          ${[0,60,120,180,240,300].map(a => `<rect x="-1" y="-10" width="2" height="10" fill="#22d3ee" transform="rotate(${a})"/>`).join('')}
        </g>
        <text x="155" y="158" font-size="9" fill="#22d3ee" font-weight="700">SAUG-LÜFTER</text>
      </g>

      <!-- s2: Luftstrom-Pfeile -->
      <g id="s2-flow" opacity="0">
        ${[60,140,220,300,380,460,540].map(x => `
          <line x1="${x}" y1="85" x2="${x}" y2="76" stroke="#22d3ee" stroke-width="2">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
          </line>
          <polygon points="${x},85 ${x-3},81 ${x+3},81" fill="#22d3ee">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
          </polygon>
        `).join('')}
      </g>

      <!-- s3: Brand -->
      <g id="s3-fire" opacity="0">
        <g transform="translate(440, 320)">
          <path d="M-12 -8 Q-6 -25 0 -15 Q8 -28 12 -10 Q15 -3 6 5 Q-4 5 -12 -8 Z" fill="#dc2626">
            <animate attributeName="fill" values="#dc2626;#fbbf24;#dc2626" dur=".4s" repeatCount="indefinite"/>
          </path>
        </g>
        <!-- Rauch -->
        ${Array.from({length: 4}, (_,i) => `<circle cx="${440}" cy="${280-i*30}" r="${10+i*5}" fill="#94a3b8" opacity=".5"><animate attributeName="cy" values="${290-i*30};${100-i*30}" dur="2s" begin="${i*0.5}s" repeatCount="indefinite"/></circle>`).join('')}
      </g>

      <!-- s4: Anstieg -->
      <g id="s4-rise" opacity="0">
        <text x="120" y="240" text-anchor="middle" font-size="14" fill="#fbbf24" font-family="monospace" font-weight="800">0,52%</text>
        <rect x="200" y="100" width="180" height="60" rx="6" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="290" y="120" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">FRÜHWARNUNG</text>
        <text x="290" y="135" text-anchor="middle" font-size="9" fill="#94a3b8">Anstieg messbar bevor</text>
        <text x="290" y="148" text-anchor="middle" font-size="9" fill="#94a3b8">Punkt-Melder reagiert</text>
      </g>

      <!-- s5: Voll-Alarm -->
      <g id="s5-alarm" opacity="0">
        <text x="120" y="240" text-anchor="middle" font-size="14" fill="#ef4444" font-family="monospace" font-weight="800">3,2%</text>
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#ef4444"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></rect>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="white" font-weight="900">⚠ ALARM · BRAND</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Aspirations-Rauchmelder. PVC-Rohrnetz mit Ansaug-Bohrungen entlang der Decke des überwachten Bereichs.' },
      { t: 2000, h: ['s1-fan','s2-flow'],     text:'② Eingebauter Saug-Lüfter zieht permanent Raumluft durch das Rohrnetz an. Hochempfindlicher Laser- oder Wolkenkammer-Sensor analysiert.' },
      { t: 4500, h: ['s2-flow','s3-fire'],    text:'③ Schwelbrand entsteht — produziert kaum sichtbaren Rauch. Punkt-Rauchmelder reagieren noch nicht.' },
      { t: 7000, h: ['s3-fire','s4-rise'],    text:'④ ASD detektiert minimal erhöhte Partikel-Konzentration (0,03 → 0,52 % Trübung/m). Frühwarnung lange vor sichtbarem Rauch.' },
      { t: 9500, h: ['s3-fire','s5-alarm'],   text:'⑤ Wenn Konzentration weiter steigt → Voll-Alarm. Reaktionszeit gegen Server-Schäden entscheidend.' },
    ],
  };

  // Gesichtserkennung
  ANIMS['gesichtserkennung'] = {
    title:'Face-ID · 3D-Gesichtserkennung mit Liveness',
    intro:'IR-Tiefenscan + KI · Anti-Spoof gegen Fotos',
    cycle:11000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Kamera -->
      <rect x="40" y="140" width="120" height="80" rx="8" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
      <circle cx="80" cy="180" r="14" fill="#0c0a1a" stroke="#22d3ee"/>
      <circle cx="80" cy="180" r="6" fill="#22d3ee"/>
      <circle cx="120" cy="170" r="6" fill="#0c0a1a" stroke="#a855f7"/>
      <text x="120" y="200" text-anchor="middle" font-size="8" fill="#a855f7" font-weight="700">IR</text>

      <!-- Gesicht (rechts) -->
      <g>
        <ellipse cx="450" cy="180" rx="55" ry="70" fill="#fbbf24" opacity=".15"/>
        <circle cx="450" cy="170" r="50" fill="rgba(251,191,36,.25)" stroke="#fbbf24"/>
        <circle cx="430" cy="160" r="4" fill="#0a0f1a"/>
        <circle cx="470" cy="160" r="4" fill="#0a0f1a"/>
        <path d="M435 195 Q450 205 465 195" stroke="#0a0f1a" stroke-width="2" fill="none"/>
      </g>

      <!-- s1: IR-Punkte (Dot Projector) -->
      <g id="s1-dots" opacity="0">
        ${Array.from({length: 30}, (_,i) => {
          const a = (i * 137.5) % 360;
          const r = 5 + (i % 8) * 6;
          const x = 450 + Math.cos(a*Math.PI/180) * r;
          const y = 180 + Math.sin(a*Math.PI/180) * r;
          return `<circle cx="${x}" cy="${y}" r="1.5" fill="#a855f7"><animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="${i*0.03}s" repeatCount="indefinite"/></circle>`;
        }).join('')}
        <text x="450" y="280" text-anchor="middle" font-size="10" fill="#a855f7" font-weight="700">30.000 IR-PUNKTE</text>
      </g>

      <!-- s2: Tiefen-Map / Landmarks -->
      <g id="s2-landmarks" opacity="0">
        ${[
          [430,150],[470,150],[450,165],[450,180],[450,195],[440,205],[460,205],[420,195],[480,195]
        ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#22d3ee" stroke="white" stroke-width=".5"/>`).join('')}
        <rect x="395" y="120" width="110" height="120" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="4 2"/>
      </g>

      <!-- s3: Vektor-Encoding -->
      <g id="s3-vector" opacity="0">
        <rect x="200" y="40" width="200" height="60" rx="6" fill="#0a0f1a" stroke="#a855f7"/>
        <text x="300" y="60" text-anchor="middle" font-size="10" fill="#a855f7" font-weight="800">128-DIM EMBEDDING</text>
        <text x="300" y="80" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">[0.34, -0.89, 0.12, ...]</text>
        <text x="300" y="93" text-anchor="middle" font-size="9" fill="#22c55e">cosine-similarity: 0.97</text>
      </g>

      <!-- s4: Liveness-Check -->
      <g id="s4-liveness" opacity="0">
        <rect x="200" y="110" width="200" height="40" rx="4" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="300" y="125" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">LIVENESS-CHECK</text>
        <text x="300" y="142" text-anchor="middle" font-size="9" fill="#22c55e">✓ 3D-Tiefe · ✓ Mikro-Bewegung</text>
      </g>

      <!-- s5: Auth -->
      <g id="s5-ok" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ MITARBEITER #1247</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text:'① Face-ID-Leser mit RGB-Kamera + IR-Tiefen-Sensor. Person tritt vor das Gerät.' },
      { t: 1800, h: ['s1-dots'],                 text:'② Dot-Projector wirft ~30.000 unsichtbare IR-Punkte auf das Gesicht. IR-Kamera misst Deformation des Musters.' },
      { t: 4000, h: ['s1-dots','s2-landmarks'],  text:'③ KI extrahiert 30+ Gesichts-Landmarks (Augen, Mund, Nase, Konturen). 3D-Tiefen-Map wird erstellt.' },
      { t: 6300, h: ['s2-landmarks','s3-vector'],text:'④ Deep-Neural-Network konvertiert Gesicht in 128-dim Vektor (Face-Embedding). Cosine-Vergleich mit Datenbank.' },
      { t: 8500, h: ['s3-vector','s4-liveness'], text:'⑤ Liveness-Check: 3D-Tiefen-Verteilung + Mikro-Augenbewegung verhindert Foto-/Maske-Spoofing.' },
      { t: 10000,h: ['s3-vector','s4-liveness','s5-ok'], text:'⑥ Match-Score &gt; 0,95 → Authentifiziert. Tür öffnet. Audit-Log mit Zeitstempel.' },
    ],
  };

  // Fingerprint
  ANIMS['fingerprint'] = {
    title:'Fingerprint · Kapazitiver Sensor + Minutien-Match',
    intro:'Hautlinien-Auswertung · FAR < 0,001 %',
    cycle:10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Sensor -->
      <rect x="180" y="60" width="240" height="240" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
      <rect x="200" y="80" width="200" height="200" rx="6" fill="#0c0a1a"/>

      <!-- Fingerprint-Muster -->
      <g id="fp-pattern">
        <g stroke="#a855f7" fill="none" stroke-width="1.5">
          <path d="M250 160 Q300 130 350 160 Q360 200 300 220 Q240 200 250 160 Z"/>
          <path d="M260 165 Q300 145 340 165 Q350 195 300 210 Q250 195 260 165 Z"/>
          <path d="M275 175 Q300 165 325 175 Q330 195 300 200 Q270 195 275 175 Z"/>
          <path d="M285 185 Q300 180 315 185 Q318 195 300 195 Q282 195 285 185 Z"/>
          <line x1="290" y1="240" x2="310" y2="240"/>
          <line x1="285" y1="250" x2="315" y2="250"/>
          <line x1="280" y1="260" x2="320" y2="260"/>
        </g>
      </g>

      <!-- s1: Scan-Linie -->
      <g id="s1-scan" opacity="0">
        <line x1="200" y1="80" x2="400" y2="80" stroke="#a855f7" stroke-width="2"><animate attributeName="y1" values="80;280;80" dur="2s" repeatCount="indefinite"/><animate attributeName="y2" values="80;280;80" dur="2s" repeatCount="indefinite"/></line>
        <text x="300" y="320" text-anchor="middle" font-size="10" fill="#a855f7" font-weight="700">KAPAZITIVER SCAN</text>
      </g>

      <!-- s2: Minutien finden -->
      <g id="s2-minutien" opacity="0">
        ${[[270,165],[330,170],[280,190],[320,195],[300,210],[295,235]].map(([x,y]) => `
          <circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#22c55e" stroke-width="2"/>
          <circle cx="${x}" cy="${y}" r="2" fill="#22c55e"/>
        `).join('')}
        <text x="450" y="180" font-size="11" fill="#22c55e" font-weight="800">15-40 Minutien</text>
        <text x="450" y="200" font-size="9" fill="#94a3b8">Verzweigungen,</text>
        <text x="450" y="213" font-size="9" fill="#94a3b8">Endpunkte</text>
      </g>

      <!-- s3: Match-Score -->
      <g id="s3-match" opacity="0">
        <rect x="60" y="60" width="100" height="240" rx="6" fill="#0a0f1a" stroke="#22c55e"/>
        <text x="110" y="80" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="800">DB-MATCH</text>
        <text x="110" y="110" text-anchor="middle" font-size="9" fill="#94a3b8">Template-ID</text>
        <text x="110" y="128" text-anchor="middle" font-size="13" fill="#fbbf24" font-family="monospace" font-weight="800">#1247</text>
        <text x="110" y="160" text-anchor="middle" font-size="9" fill="#94a3b8">Score</text>
        <text x="110" y="178" text-anchor="middle" font-size="20" fill="#22c55e" font-family="monospace" font-weight="900">0.97</text>
        <text x="110" y="220" text-anchor="middle" font-size="9" fill="#94a3b8">FAR &lt; 10⁻⁶</text>
        <text x="110" y="240" text-anchor="middle" font-size="9" fill="#94a3b8">FRR &lt; 1 %</text>
      </g>

      <!-- s4: Ergebnis -->
      <g id="s4-ok" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ ZUTRITT GEWÄHRT</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Kapazitiver Fingerprint-Sensor. Microchip-Array misst elektrische Felder unter den Fingerlinien.' },
      { t: 1800, h: ['s1-scan'],               text:'② Scan: Hautlinien (Höhen) und Vertiefungen erzeugen unterschiedliche Kapazitäts-Messwerte → 2D-Bild.' },
      { t: 4000, h: ['s1-scan','s2-minutien'], text:'③ Bildverarbeitung findet 15—40 Minutien-Punkte: Linien-Endpunkte und Verzweigungen (charakteristisch).' },
      { t: 6500, h: ['s2-minutien','s3-match'], text:'④ Template wird mit Datenbank verglichen. Score &gt; 0,95 = Match. False-Accept-Rate &lt; 0,001 %.' },
      { t: 8500, h: ['s2-minutien','s3-match','s4-ok'], text:'⑤ Authentifiziert. Tür öffnet. Optional 2-Faktor mit PIN.' },
    ],
  };

  // ANPR-Kamera
  ANIMS['cam-anpr'] = {
    title:'ANPR · Kennzeichen-Erkennung mit KI',
    intro:'IR-LEDs + Deep Learning · Whitelist-Abgleich',
    cycle:10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <rect y="240" width="600" height="120" fill="#1e293b"/>
      <line y1="240" x2="600" y2="240" stroke="#475569" stroke-width="2"/>
      <line y1="290" x2="600" y2="290" stroke="#475569" stroke-dasharray="12 8"/>
      <!-- Kamera oben -->
      <rect x="40" y="50" width="100" height="50" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
      <circle cx="65" cy="75" r="12" fill="#0c0a1a" stroke="#dc2626"/>
      <circle cx="65" cy="75" r="5" fill="#dc2626"/>
      <text x="105" y="80" font-size="11" fill="#22d3ee" font-weight="800">ANPR</text>
      <text x="105" y="92" font-size="8" fill="#94a3b8">940nm IR</text>

      <!-- s1: IR-Beleuchtung -->
      <g id="s1-ir" opacity="0">
        <path d="M 65 100 L 250 220 L 250 270 L 65 100 Z" fill="rgba(220,38,38,.1)" stroke="rgba(220,38,38,.3)" stroke-dasharray="3 2"/>
        <text x="180" y="140" font-size="10" fill="#dc2626" font-weight="700">IR-Blitz · Reflektor-Schild</text>
      </g>

      <!-- s2: Auto fährt heran -->
      <g id="s2-car" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="700 0;200 0;200 0" keyTimes="0;.5;1" dur="3s" repeatCount="indefinite"/>
          <rect x="-50" y="220" width="100" height="36" rx="3" fill="#475569"/>
          <rect x="-40" y="200" width="60" height="22" rx="6" fill="#0f172a"/>
          <circle cx="-30" cy="258" r="8" fill="#0a0f1a"/>
          <circle cx="30" cy="258" r="8" fill="#0a0f1a"/>
          <!-- Kennzeichen -->
          <rect x="-30" y="235" width="60" height="14" fill="#fef3c7" stroke="#fbbf24"/>
          <text x="0" y="246" text-anchor="middle" font-size="10" fill="#0b1424" font-family="monospace" font-weight="900">B-XK 1288</text>
        </g>
      </g>

      <!-- s3: OCR-Box auf Schild -->
      <g id="s3-ocr" opacity="0">
        <rect x="170" y="235" width="60" height="14" fill="none" stroke="#22d3ee" stroke-width="2" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" values="0;-12" dur=".5s" repeatCount="indefinite"/></rect>
        <rect x="148" y="220" width="100" height="12" fill="#22d3ee"/>
        <text x="200" y="229" text-anchor="middle" font-size="8" fill="#0b1424" font-weight="900">PLATE DETECTED</text>
      </g>

      <!-- s4: Deep Learning Engine -->
      <g id="s4-cnn" opacity="0">
        <rect x="280" y="40" width="280" height="70" rx="6" fill="#0a0f1a" stroke="#a855f7"/>
        <text x="420" y="60" text-anchor="middle" font-size="11" fill="#a855f7" font-weight="800">CNN · YOLO + CRNN</text>
        <text x="420" y="80" text-anchor="middle" font-size="11" fill="#22c55e" font-family="monospace" font-weight="900">B-XK 1288</text>
        <text x="420" y="98" text-anchor="middle" font-size="9" fill="#94a3b8">Confidence 0,99</text>
      </g>

      <!-- s5: Whitelist-Match -->
      <g id="s5-list" opacity="0">
        <rect x="380" y="130" width="180" height="70" rx="6" fill="#0a0f1a" stroke="#22c55e"/>
        <text x="470" y="148" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="800">WHITELIST</text>
        <text x="470" y="166" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">B-XK 1288 ✓</text>
        <text x="470" y="180" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">M-AB 4567</text>
        <text x="470" y="194" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">F-ZZ 9999</text>
      </g>

      <!-- s6: Tor öffnet -->
      <g id="s6-open" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ TOR ÖFFNET · Mitarbeiter</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text:'① ANPR-Kamera am Werkstor. Spezial-Sensor mit IR-Cut-Filter und 940-nm-LEDs für reflektierende Schilder.' },
      { t: 1500, h: ['s1-ir'],                   text:'② IR-Blitz beleuchtet den Bereich. 940 nm ist für menschliches Auge unsichtbar, reflektiert von Kennzeichen-Folie.' },
      { t: 3500, h: ['s1-ir','s2-car'],          text:'③ Fahrzeug fährt heran. Kamera nimmt Bild mit 1/2000 s Verschluss → scharfes Schild trotz Bewegung.' },
      { t: 5500, h: ['s2-car','s3-ocr'],         text:'④ Computer-Vision: YOLO-Network lokalisiert das Kennzeichen-Rechteck in &lt; 50 ms.' },
      { t: 7000, h: ['s3-ocr','s4-cnn'],         text:'⑤ CRNN (Convolutional Recurrent NN) liest die einzelnen Zeichen. Konfidenz 0,99 ohne Schmutz/Folie.' },
      { t: 8500, h: ['s4-cnn','s5-list','s6-open'], text:'⑥ Datenbank-Abgleich → Whitelist-Hit → Tor-Steuerung öffnet. Audit-Log mit Foto + Zeitstempel.' },
    ],
  };

  // Sirene außen
  ANIMS['sirene-aussen'] = {
    title:'Außensirene · 110 dB + Blitzleuchte',
    intro:'Akustische + optische Abschreckung',
    cycle:10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#020617"/>
      <!-- Hausfassade -->
      <rect x="0" y="280" width="600" height="80" fill="#1e293b"/>
      <rect x="0" y="100" width="600" height="180" fill="#0c1429"/>
      <!-- Fenster vergangen -->
      <rect x="60" y="160" width="60" height="80" fill="rgba(34,211,238,.08)" stroke="#475569"/>
      <rect x="480" y="160" width="60" height="80" fill="rgba(34,211,238,.08)" stroke="#475569"/>
      <!-- Sirene -->
      <g>
        <rect x="270" y="120" width="60" height="60" rx="4" fill="#dc2626" stroke="#0b1424" stroke-width="2"/>
        <circle cx="300" cy="150" r="18" fill="#1e293b"/>
        <circle cx="300" cy="150" r="12" fill="#7f1d1d"/>
        <circle cx="300" cy="150" r="6" fill="#dc2626"/>
        <!-- Stroboskop -->
        <rect id="strobe" x="278" y="186" width="44" height="22" rx="3" fill="#475569"/>
      </g>

      <!-- s1: Alarm aus -->
      <g id="s1-silent" opacity="0">
        <text x="20" y="40" font-size="12" fill="#22c55e" font-family="monospace" font-weight="700">▮ Standby</text>
      </g>

      <!-- s2: Auslösung -->
      <g id="s2-trigger" opacity="0">
        <rect x="20" y="20" width="200" height="32" rx="6" fill="#ef4444"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></rect>
        <text x="120" y="40" text-anchor="middle" font-size="13" fill="white" font-weight="900">⚠ EMA AUSGELÖST</text>
      </g>

      <!-- s3: Stroboskop blinkt -->
      <g id="s3-strobe" opacity="0">
        <rect x="278" y="186" width="44" height="22" rx="3" fill="#fbbf24"><animate attributeName="opacity" values="0;1;0;1;0" dur=".25s" repeatCount="indefinite"/></rect>
        <text x="300" y="200" text-anchor="middle" font-size="9" fill="#0b1424" font-weight="900">⚡</text>
        <!-- Glow -->
        <ellipse cx="300" cy="200" rx="100" ry="40" fill="#fbbf24" opacity=".2"><animate attributeName="opacity" values="0;.4;0" dur=".25s" repeatCount="indefinite"/></ellipse>
      </g>

      <!-- s4: Schallwellen -->
      <g id="s4-sound" opacity="0">
        ${[1,2,3,4,5].map(i => `<circle cx="300" cy="150" r="${i*30}" fill="none" stroke="#dc2626" stroke-width="2" opacity="${0.7 - i*0.12}"><animate attributeName="r" values="${i*15};${i*40};${i*15}" dur="1.2s" begin="${i*0.2}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${0.7 - i*0.12};0;${0.7 - i*0.12}" dur="1.2s" begin="${i*0.2}s" repeatCount="indefinite"/></circle>`).join('')}
        <text x="450" y="60" text-anchor="middle" font-size="18" fill="#dc2626" font-weight="900">110 dB</text>
        <text x="450" y="80" text-anchor="middle" font-size="9" fill="#94a3b8">bei 1 m</text>
      </g>

      <!-- s5: NSL -->
      <g id="s5-nsl" opacity="0">
        <rect x="380" y="280" width="200" height="60" rx="6" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="480" y="300" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">NSL alarmiert</text>
        <text x="480" y="318" text-anchor="middle" font-size="9" fill="#22c55e">Operator → Polizei</text>
        <text x="480" y="333" text-anchor="middle" font-size="9" fill="#22c55e">Streife in &lt; 3 Min</text>
      </g>
    `),
    steps: [
      { t: 0,    h: ['s1-silent'],          text:'① Außensirene VdS-zertifiziert · 110 dB Schallleistung + Blitzleuchte. Im Standby unsichtbar an Hausfassade.' },
      { t: 2000, h: ['s2-trigger'],          text:'② EMA-Zentrale löst aus. Relais-Output schaltet die Sirene + Stroboskop ein.' },
      { t: 4000, h: ['s2-trigger','s3-strobe'], text:'③ Stroboskop (LED oder Xenon) blitzt mit 3—5 Hz → Aufmerksamkeit für Nachbarn auch wenn taub.' },
      { t: 6000, h: ['s3-strobe','s4-sound'], text:'④ Sirene fährt auf 110 dB hoch → für Einbrecher schwer auszuhalten. Lärmschutz: max. 3 min Auslösedauer.' },
      { t: 8000, h: ['s3-strobe','s4-sound','s5-nsl'], text:'⑤ Parallel: NSL erhält Alarm via GSM. Operator verifiziert und ruft Polizei.' },
    ],
  };

  // Elektrozaun
  ANIMS['zaun-elektro'] = {
    title:'Elektrozaun · Pulsspannung + Sabotage-Detektion',
    intro:'2.000—10.000 V Puls · ungefährlich aber schmerzhaft',
    cycle:10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <line x1="0" y1="320" x2="600" y2="320" stroke="#1e293b" stroke-width="3"/>
      <!-- Pfosten -->
      <rect x="60" y="80" width="14" height="240" fill="#64748b"/>
      <rect x="526" y="80" width="14" height="240" fill="#64748b"/>
      <!-- 5 Drähte -->
      <g id="wires">
        ${[100,135,170,205,240].map(y => `<line x1="70" y1="${y}" x2="540" y2="${y}" stroke="#c084fc" stroke-width="2.5"/>`).join('')}
        ${[100,135,170,205,240].map(y => `<circle cx="70" cy="${y}" r="4" fill="#c084fc"/><circle cx="540" cy="${y}" r="4" fill="#c084fc"/>`).join('')}
      </g>
      <!-- Energiegerät -->
      <rect x="430" y="280" width="80" height="40" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
      <text x="470" y="298" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">10 kV PULS</text>
      <text x="470" y="314" text-anchor="middle" font-size="9" fill="#94a3b8">1 Hz · &lt; 5 J</text>

      <!-- s1: Puls fließt -->
      <g id="s1-pulse" opacity="0">
        ${[100,135,170,205,240].map((y, i) => `<circle cx="70" cy="${y}" r="6" fill="#fbbf24" opacity=".8"><animate attributeName="cx" values="70;540" dur="1s" begin="${i*0.2}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="1s" begin="${i*0.2}s" repeatCount="indefinite"/></circle>`).join('')}
        <text x="300" y="55" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">PULS · alle 1 Sek</text>
      </g>

      <!-- s2: Eindringling kommt -->
      <g id="s2-intruder" opacity="0">
        <g transform="translate(380, 260)">
          <circle cx="0" cy="-8" r="6" fill="#475569"/>
          <rect x="-5" y="-2" width="10" height="18" fill="#1e293b"/>
          <line x1="-3" y1="16" x2="-5" y2="35" stroke="#0f172a" stroke-width="2"/>
          <line x1="3" y1="16" x2="5" y2="35" stroke="#0f172a" stroke-width="2"/>
          <!-- Arm zum Zaun -->
          <line x1="5" y1="0" x2="40" y2="-30" stroke="#1e293b" stroke-width="3"/>
        </g>
      </g>

      <!-- s3: Blitz -->
      <g id="s3-spark" opacity="0">
        <polygon points="420,240 410,225 425,228 415,212 430,218 422,200" fill="#fbbf24" stroke="#fef3c7" stroke-width="1.5">
          <animate attributeName="opacity" values="1;0;1;0;1" dur=".2s" repeatCount="indefinite"/>
        </polygon>
        <text x="400" y="180" font-size="14" fill="#fbbf24" font-weight="900">ZAP! 10 kV</text>
      </g>

      <!-- s4: Schmerz + Rückzug -->
      <g id="s4-back" opacity="0">
        <g transform="translate(440, 260)">
          <circle cx="0" cy="-8" r="6" fill="#dc2626"/>
          <text x="0" y="-15" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="900">!</text>
        </g>
      </g>

      <!-- s5: Detektion -->
      <g id="s5-detect" opacity="0">
        <rect x="20" y="20" width="280" height="32" rx="6" fill="#dc2626"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></rect>
        <text x="160" y="40" text-anchor="middle" font-size="12" fill="white" font-weight="900">⚠ ZAUN-BERÜHRUNG · Linie 2</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Elektrozaun mit isolierten Spanndrähten. Spannungserzeuger pulst 10 kV (5 J Energie pro Puls).' },
      { t: 1800, h: ['s1-pulse'],              text:'② Spannungspulse breiten sich über die Drahtlänge aus. Tier-/Tot-Berührung erzeugt kurzen schmerzhaften Schlag.' },
      { t: 3800, h: ['s2-intruder'],           text:'③ Eindringling versucht über den Zaun zu klettern.' },
      { t: 5800, h: ['s2-intruder','s3-spark'],text:'④ Kontakt → Stromschlag. 10 kV bei 5 J ist ungefährlich aber sehr schmerzhaft. Abschreckung wirkt.' },
      { t: 7500, h: ['s3-spark','s4-back','s5-detect'], text:'⑤ Energiegerät erkennt Lasten-Änderung am Draht → Alarm an EMA. Bei Drahtbruch: ebenfalls Alarm.' },
    ],
  };

  // LiDAR-Scanner
  ANIMS['lidar-perim'] = {
    title:'LiDAR-Perimeter · 360°-Laser-3D-Scan',
    intro:'Time-of-Flight · KI-Klassifikation',
    cycle:11000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <line x1="0" y1="300" x2="600" y2="300" stroke="#1e293b" stroke-width="3"/>

      <!-- LiDAR-Mast -->
      <rect x="296" y="100" width="8" height="200" fill="#475569"/>
      <circle cx="300" cy="100" r="22" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
      <circle cx="300" cy="100" r="14" fill="#0c0a1a"/>
      <circle cx="300" cy="100" r="6" fill="#a855f7"/>

      <!-- s1: Rotierender Strahl -->
      <g id="s1-beam" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 300 100;360 300 100" dur="3s" repeatCount="indefinite"/>
          <line x1="300" y1="100" x2="540" y2="100" stroke="#a855f7" stroke-width="3" opacity=".7"/>
          ${[40,80,120,160,200].map(d => `<circle cx="${300+d}" cy="100" r="2" fill="#fbbf24"/>`).join('')}
        </g>
      </g>

      <!-- s2: Punktewolke -->
      <g id="s2-points" opacity="0">
        ${Array.from({length: 80}, (_,i) => {
          const a = (i / 80) * Math.PI * 2;
          const r = 80 + Math.random() * 120;
          const x = 300 + Math.cos(a) * r;
          const y = 100 + Math.sin(a) * r * 0.8;
          if (y > 295) return '';
          return `<circle cx="${x}" cy="${y}" r="1.5" fill="#22d3ee" opacity=".7"><animate attributeName="opacity" values="0;.7;0" dur="3s" begin="${i*0.04}s" repeatCount="indefinite"/></circle>`;
        }).join('')}
      </g>

      <!-- s3: Person erkannt -->
      <g id="s3-person" opacity="0">
        <g transform="translate(450, 260)">
          <circle cx="0" cy="-12" r="6" fill="#fbbf24"/>
          <ellipse cx="0" cy="5" rx="8" ry="18" fill="#fbbf24"/>
          <rect x="-4" y="20" width="3" height="20" fill="#fbbf24"/>
          <rect x="1" y="20" width="3" height="20" fill="#fbbf24"/>
        </g>
        <rect x="440" y="220" width="50" height="80" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur=".5s" repeatCount="indefinite"/>
        </rect>
        <rect x="420" y="206" width="100" height="14" fill="#ef4444"/>
        <text x="470" y="216" text-anchor="middle" font-size="9" fill="white" font-family="monospace" font-weight="800">HUMAN 0.96</text>
      </g>

      <!-- s4: Distanz -->
      <g id="s4-dist" opacity="0">
        <line x1="304" y1="105" x2="450" y2="265" stroke="#22c55e" stroke-width="1" stroke-dasharray="3 2"/>
        <text x="380" y="180" font-size="11" fill="#22c55e" font-weight="800">d = 87 m</text>
      </g>

      <!-- s5: Klassifikation -->
      <g id="s5-class" opacity="0">
        <rect x="20" y="20" width="240" height="50" rx="6" fill="#0a0f1a" stroke="#a855f7"/>
        <text x="140" y="38" text-anchor="middle" font-size="11" fill="#a855f7" font-weight="800">KLASSE: PERSON</text>
        <text x="140" y="55" text-anchor="middle" font-size="9" fill="#22c55e">Tracking aktiv · Geschw. 1,2 m/s</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                          text:'① LiDAR-Perimeter-Scanner. Rotierender Laser (905 nm) misst Zeit-bis-Reflexion → exakte 3D-Punktposition.' },
      { t: 1800, h: ['s1-beam'],                 text:'② Scanner rotiert 10—20 Hz und sendet Tausende Laserpulse pro Sekunde. Reichweite 50—300 m.' },
      { t: 3800, h: ['s1-beam','s2-points'],     text:'③ Jeder reflektierte Puls liefert einen 3D-Punkt → dichte Punktewolke des Geländes.' },
      { t: 6200, h: ['s2-points','s3-person','s4-dist'], text:'④ Hindernis-Detektion: Cluster von Punkten in „leerem" Bereich identifiziert ein Objekt. Distanz exakt messbar.' },
      { t: 8500, h: ['s3-person','s4-dist','s5-class'], text:'⑤ KI klassifiziert Cluster nach Form/Bewegung: Person, PKW, LKW oder Tier. Mit Geschwindigkeits-Schätzung.' },
    ],
  };

  // Smart-Lock
  ANIMS['smartlock'] = {
    title:'Smart-Lock · BLE-Pairing + Motor-Verriegelung',
    intro:'Bluetooth 5 · App-Steuerung · Audit-Log',
    cycle:10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Türschloss -->
      <rect x="380" y="60" width="140" height="240" rx="10" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
      <rect x="400" y="80" width="100" height="180" rx="6" fill="#0a0f1a"/>
      <!-- Drehknauf -->
      <g id="sl-knob">
        <circle cx="450" cy="170" r="32" fill="#475569" stroke="#0b1424" stroke-width="2">
          <animateTransform attributeName="transform" type="rotate" values="0 450 170;0 450 170;90 450 170;90 450 170;0 450 170" keyTimes="0;.3;.5;.85;1" dur="4s" repeatCount="indefinite"/>
        </circle>
        <rect x="447" y="142" width="6" height="20" fill="#cbd5e1"/>
      </g>
      <rect x="420" y="270" width="60" height="14" rx="3" fill="#475569"/>

      <!-- Smartphone -->
      <g>
        <rect x="60" y="100" width="100" height="160" rx="12" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
        <rect x="68" y="110" width="84" height="120" rx="3" fill="#0a0f1a"/>
        <text x="110" y="135" text-anchor="middle" font-size="9" fill="#06b6d4" font-weight="800">SMART-LOCK</text>
        <circle cx="110" cy="170" r="22" fill="#0c0a1a" stroke="#06b6d4" stroke-width="2"/>
        <text x="110" y="175" text-anchor="middle" font-size="20" fill="#06b6d4">🔓</text>
        <text x="110" y="220" text-anchor="middle" font-size="9" fill="#22c55e">Verbunden ✓</text>
        <rect x="92" y="240" width="36" height="14" rx="7" fill="#475569"/>
      </g>

      <!-- s1: BLE-Wellen -->
      <g id="s1-ble" opacity="0">
        ${[1,2,3,4].map(i => `<path d="M 160 180 q ${20+i*15} 0 ${40+i*30} 0" stroke="#06b6d4" stroke-width="2" fill="none" opacity="${0.7-i*0.15}"><animate attributeName="opacity" values="0;${0.7-i*0.15};0" dur="1s" begin="${i*0.15}s" repeatCount="indefinite"/></path>`).join('')}
        <text x="280" y="150" text-anchor="middle" font-size="11" fill="#06b6d4" font-weight="800">BLE 5.x · 2,4 GHz</text>
      </g>

      <!-- s2: Crypto -->
      <g id="s2-crypto" opacity="0">
        <rect x="180" y="200" width="200" height="46" rx="4" fill="#0a0f1a" stroke="#a855f7"/>
        <text x="280" y="218" text-anchor="middle" font-size="10" fill="#a855f7" font-weight="800">AES-128 + Rolling Code</text>
        <text x="280" y="235" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">CHAL: 4B7E1A...</text>
      </g>

      <!-- s3: Motor läuft -->
      <g id="s3-motor" opacity="0">
        <text x="450" y="100" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">⚙ MOTOR</text>
        <circle cx="450" cy="170" r="40" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6 3"><animate attributeName="stroke-dashoffset" values="0;-18" dur=".5s" repeatCount="indefinite"/></circle>
      </g>

      <!-- s4: Audit-Log -->
      <g id="s4-log" opacity="0">
        <rect x="20" y="280" width="380" height="60" rx="4" fill="#0a0f1a" stroke="#22c55e"/>
        <text x="210" y="297" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="800">AUDIT-LOG</text>
        <text x="35" y="316" font-size="9" fill="#94a3b8" font-family="monospace">12:45:32  Anna  ENTRIEGELT</text>
        <text x="35" y="330" font-size="9" fill="#94a3b8" font-family="monospace">12:46:18  Anna  VERRIEGELT (Auto)</text>
      </g>

      <!-- s5: Status -->
      <g id="s5-ok" opacity="0">
        <rect x="20" y="20" width="200" height="32" rx="6" fill="#22c55e"/>
        <text x="120" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ TÜR OFFEN</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Smart-Lock am Profilzylinder. App auf Smartphone, BLE 5.x-Pairing. Batterie-Betrieb mit 6—12 Monaten Laufzeit.' },
      { t: 1500, h: ['s1-ble'],                text:'② Bluetooth-Verbindung: Smartphone wird in Nähe erkannt (BLE-Advertising), Lock authentifiziert Gerät.' },
      { t: 3500, h: ['s1-ble','s2-crypto'],    text:'③ AES-128 Challenge-Response: Lock sendet Random-Challenge, App verschlüsselt mit Geräte-Schlüssel.' },
      { t: 5500, h: ['s2-crypto','s3-motor'],  text:'④ Auth OK → Motor dreht den Profilzylinder elektrisch. Riegel fährt zurück. Auch ohne App via PIN-Tastatur.' },
      { t: 7500, h: ['s3-motor','s4-log','s5-ok'], text:'⑤ Audit-Log speichert jede Aktion mit Zeit + Benutzer. Auto-Lock nach X Sekunden möglich.' },
    ],
  };

  // Schiebetor mit ANPR
  ANIMS['tor-schiebe'] = {
    title:'Schiebetor freitragend · Automatik mit ANPR',
    intro:'Bis 12 m Durchfahrtsbreite · ohne Bodenschiene',
    cycle:12000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <line x1="0" y1="300" x2="600" y2="300" stroke="#475569" stroke-width="2"/>
      <line x1="0" y1="340" x2="600" y2="340" stroke="#475569" stroke-dasharray="10 8" opacity=".5"/>
      <!-- Pfosten -->
      <rect x="100" y="120" width="14" height="180" fill="#64748b"/>
      <rect x="480" y="120" width="14" height="180" fill="#64748b"/>
      <!-- Tor -->
      <g id="tor-gate">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 0;-260 0;-260 0;0 0;0 0" keyTimes="0;.2;.4;.7;.9;1" dur="9s" repeatCount="indefinite"/>
          <rect x="125" y="160" width="350" height="120" fill="rgba(8,145,178,.2)" stroke="#0891b2" stroke-width="2"/>
          ${Array.from({length: 18}, (_,i) => `<rect x="${130+i*19}" y="165" width="3" height="110" fill="#0891b2"/>`).join('')}
          <rect x="125" y="218" width="350" height="3" fill="#0891b2"/>
          <rect x="285" y="226" width="30" height="28" fill="#dc2626" stroke="#fbbf24" stroke-width="1.5"/>
          <text x="300" y="244" text-anchor="middle" font-size="8" fill="white" font-weight="800">PRIVAT</text>
        </g>
      </g>

      <!-- ANPR Kamera -->
      <g>
        <rect x="514" y="60" width="50" height="30" rx="3" fill="#1e293b" stroke="#22d3ee" stroke-width="1.5"/>
        <circle cx="525" cy="75" r="8" fill="#0c0a1a" stroke="#dc2626"/>
        <circle cx="525" cy="75" r="3" fill="#dc2626"/>
        <text x="555" y="80" font-size="9" fill="#22d3ee" font-weight="800">ANPR</text>
      </g>

      <!-- s1: Auto kommt -->
      <g id="s1-car" opacity="0">
        <g>
          <animateTransform attributeName="transform" type="translate" values="700 0;420 0;420 0;100 0;100 0" keyTimes="0;.2;.4;.7;1" dur="9s" repeatCount="indefinite"/>
          <rect x="-50" y="260" width="100" height="36" rx="3" fill="#475569"/>
          <rect x="-38" y="240" width="56" height="22" rx="6" fill="#0f172a"/>
          <circle cx="-30" cy="298" r="8" fill="#0a0f1a"/>
          <circle cx="30" cy="298" r="8" fill="#0a0f1a"/>
          <rect x="-30" y="275" width="60" height="14" fill="#fef3c7" stroke="#fbbf24"/>
          <text x="0" y="286" text-anchor="middle" font-size="10" fill="#0b1424" font-family="monospace" font-weight="900">B-XK 1288</text>
        </g>
      </g>

      <!-- s2: ANPR liest -->
      <g id="s2-scan" opacity="0">
        <path d="M 525 92 L 460 270 L 380 270 Z" fill="rgba(34,211,238,.18)" stroke="rgba(34,211,238,.4)" stroke-dasharray="3 2"/>
        <rect x="380" y="40" width="200" height="40" rx="4" fill="#0a0f1a" stroke="#22d3ee"/>
        <text x="480" y="60" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">B-XK 1288</text>
        <text x="480" y="74" text-anchor="middle" font-size="9" fill="#22c55e">✓ Whitelist</text>
      </g>

      <!-- s3: Antrieb -->
      <g id="s3-motor" opacity="0">
        <rect x="40" y="280" width="60" height="20" rx="2" fill="#1e293b" stroke="#22c55e"/>
        <text x="70" y="295" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="700">ANTRIEB</text>
        <circle cx="20" cy="290" r="4" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur=".5s" repeatCount="indefinite"/></circle>
      </g>

      <!-- s4: Status -->
      <g id="s4-open" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#fbbf24"/>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">TOR ÖFFNET...</text>
      </g>

      <!-- s5: Klemmschutz -->
      <g id="s5-safety" opacity="0">
        <rect x="380" y="100" width="200" height="40" rx="4" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="480" y="115" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">KLEMMSCHUTZ EN 12453</text>
        <text x="480" y="130" text-anchor="middle" font-size="9" fill="#94a3b8">&lt; 150 N Schliesskraft</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Schiebetor freitragend bis 12 m Durchfahrtsbreite. Antrieb 230 V mit Endschaltern. ANPR-Kamera oben am Pfosten.' },
      { t: 2000, h: ['s1-car','s2-scan'],     text:'② Fahrzeug nähert sich. ANPR-Kamera erfasst Kennzeichen. KI liest in &lt; 1 s und vergleicht mit Whitelist.' },
      { t: 4500, h: ['s2-scan','s3-motor','s4-open'], text:'③ Berechtigung erkannt → Antriebsmotor startet. Tor öffnet seitlich auf einer Rolle.' },
      { t: 7000, h: ['s3-motor','s5-safety'],  text:'④ Klemm-/Quetschschutz nach EN 12453: Bei Hindernis sofort Stopp + Reverse. Schließkraft &lt; 150 N.' },
      { t: 9500, h: [],                        text:'⑤ Nach Durchfahrt fährt das Tor automatisch zu (Endschalter + Lichtschranke). Komplett-Zyklus 30—45 Sek.' },
    ],
  };

  // Drehkreuz
  ANIMS['drehkreuz'] = {
    title:'Vollhöhen-Drehkreuz · Anti-Tailgating',
    intro:'EN 16005 · 1 Person je Berechtigung',
    cycle:10000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <line x1="0" y1="320" x2="600" y2="320" stroke="#1e293b" stroke-width="3"/>
      <!-- Drehkreuz-Gehäuse -->
      <rect x="220" y="40" width="160" height="280" rx="4" fill="#0a0f1a" stroke="#a855f7" stroke-width="2"/>
      <!-- 3-Arm-Rotor -->
      <g id="dk-rotor">
        <g transform="translate(300, 180)">
          <animateTransform attributeName="transform" type="rotate" values="0 0 0;0 0 0;120 0 0;120 0 0;120 0 0" keyTimes="0;.3;.55;.95;1" dur="4s" additive="sum" repeatCount="indefinite"/>
          ${[0,120,240].map(ang => `<line x1="0" y1="0" x2="${Math.cos(ang*Math.PI/180)*60}" y2="${Math.sin(ang*Math.PI/180)*60}" stroke="#a855f7" stroke-width="5"/>`).join('')}
          <circle r="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        </g>
      </g>
      <!-- RFID-Leser oben -->
      <rect x="240" y="50" width="120" height="30" rx="3" fill="#1e293b" stroke="#22d3ee"/>
      <text x="300" y="70" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">RFID-LESER</text>

      <!-- s1: Person + Karte -->
      <g id="s1-person" opacity="0">
        <g transform="translate(120, 220)">
          <circle cx="0" cy="-30" r="10" fill="#fbbf24"/>
          <ellipse cx="0" cy="0" rx="18" ry="35" fill="#3b82f6"/>
          <rect x="-22" y="-5" width="6" height="30" rx="3" fill="#3b82f6" transform="rotate(-15)"/>
          <rect x="15" y="-5" width="6" height="30" rx="3" fill="#3b82f6" transform="rotate(20)"/>
          <!-- Karte in Hand -->
          <rect x="22" y="-10" width="20" height="14" rx="2" fill="#fbbf24"/>
        </g>
      </g>

      <!-- s2: Karte vor Leser -->
      <g id="s2-rfid" opacity="0">
        <rect x="260" y="62" width="20" height="14" rx="2" fill="#fbbf24"/>
        ${[1,2,3].map(i => `<path d="M 260 ${64+i*3} q -8 5 0 10" stroke="#22d3ee" stroke-width="2" fill="none"><animate attributeName="opacity" values="0;1;0" dur=".8s" begin="${i*0.15}s" repeatCount="indefinite"/></path>`).join('')}
      </g>

      <!-- s3: Drehung & Person geht durch -->
      <g id="s3-pass" opacity="0">
        <text x="300" y="280" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="700">→ Sektor entriegelt</text>
        <g transform="translate(300, 240)">
          <circle cx="0" cy="-12" r="6" fill="#22c55e"/>
          <ellipse cx="0" cy="0" rx="10" ry="14" fill="#22c55e"/>
        </g>
      </g>

      <!-- s4: Anti-Tailgating-Sensor -->
      <g id="s4-anti" opacity="0">
        <circle cx="300" cy="40" r="6" fill="#fbbf24"><animate attributeName="opacity" values="1;.3;1" dur=".5s" repeatCount="indefinite"/></circle>
        <text x="320" y="45" font-size="10" fill="#fbbf24" font-weight="700">Anti-Tailgating-Sensor</text>
      </g>

      <!-- s5: Status -->
      <g id="s5-ok" opacity="0">
        <rect x="20" y="20" width="240" height="32" rx="6" fill="#22c55e"/>
        <text x="140" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ DURCHGANG · 1 PERSON</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Vollhöhen-Drehkreuz mit 3 Edelstahl-Armen (220 cm hoch). RFID-Leser oben, gesperrte Sektoren.' },
      { t: 1500, h: ['s1-person'],             text:'② Mitarbeiter tritt vor das Drehkreuz mit RFID-Karte in der Hand.' },
      { t: 3500, h: ['s1-person','s2-rfid'],   text:'③ Karte vor Leser → 13,56-MHz-Auth. Bei Whitelist-Hit Sektor entriegelt.' },
      { t: 5500, h: ['s3-pass'],               text:'④ Rotor dreht 120° → Person passiert. Mechanik verhindert zweite Person mitzugehen.' },
      { t: 7500, h: ['s3-pass','s4-anti','s5-ok'], text:'⑤ Anti-Tailgating-Sensor (Decken-Stereo-Kamera oder Bodengewichts-Sensor) zählt Personen.' },
    ],
  };

  // Wandhydrant
  ANIMS['wandhydrant'] = {
    title:'Wandhydrant Typ S · Selbsthilfe-Löschung',
    intro:'Schlauch + Strahlrohr für Mieter/Personal',
    cycle:9000,
    svg: wrap('0 0 600 360', `
      <rect width="600" height="360" fill="#0a0f1a"/>
      <!-- Wandkasten -->
      <rect x="180" y="80" width="240" height="220" rx="6" fill="#dc2626" stroke="#fbbf24" stroke-width="3"/>
      <text x="300" y="105" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="900">WANDHYDRANT TYP S</text>
      <!-- Glasfach -->
      <rect x="200" y="115" width="200" height="170" fill="#1e293b" stroke="#fbbf24"/>
      <rect x="200" y="115" width="200" height="170" fill="rgba(34,211,238,.05)" stroke="#fbbf24"/>

      <!-- Schlauchhaspel (statisch) -->
      <g id="haspel">
        <circle cx="300" cy="200" r="60" fill="#dc2626" stroke="#0b1424" stroke-width="2"/>
        <circle cx="300" cy="200" r="45" fill="none" stroke="#0b1424"/>
        <circle cx="300" cy="200" r="30" fill="none" stroke="#0b1424"/>
        <circle cx="300" cy="200" r="15" fill="#1e293b" stroke="#fbbf24"/>
        <text x="300" y="204" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">30 m</text>
      </g>

      <!-- s1: Brand -->
      <g id="s1-fire" opacity="0">
        <g transform="translate(490, 300)">
          <path d="M-15 -10 Q-8 -35 0 -20 Q10 -38 15 -12 Q22 -5 8 8 Q-5 8 -15 -10 Z" fill="#dc2626">
            <animate attributeName="fill" values="#dc2626;#fbbf24;#dc2626" dur=".4s" repeatCount="indefinite"/>
          </path>
        </g>
      </g>

      <!-- s2: Schlauch ausziehen -->
      <g id="s2-pull" opacity="0">
        <path d="M 300 200 Q 350 250 450 270 Q 480 285 510 290" stroke="#94a3b8" stroke-width="4" fill="none"/>
        <text x="200" y="335" font-size="10" fill="#fbbf24" font-weight="700">Schlauch ausziehen</text>
      </g>

      <!-- s3: Strahlrohr -->
      <g id="s3-rohr" opacity="0">
        <rect x="500" y="288" width="30" height="6" fill="#fbbf24"/>
        <rect x="500" y="290" width="20" height="2" fill="#0b1424"/>
        <text x="515" y="320" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="700">DIN 14365</text>
      </g>

      <!-- s4: Wasserstrahl -->
      <g id="s4-water" opacity="0">
        <path d="M 528 290 L 580 270" stroke="#22d3ee" stroke-width="4"><animate attributeName="opacity" values="0;1;0;1" dur=".3s" repeatCount="indefinite"/></path>
        ${[1,2,3,4].map(i => `<circle cx="${540+i*8}" cy="${288-i}" r="2" fill="#22d3ee"><animate attributeName="opacity" values="0;1;0" dur=".4s" begin="${i*0.05}s" repeatCount="indefinite"/></circle>`).join('')}
        <text x="560" y="240" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">2—4 bar</text>
        <text x="560" y="255" text-anchor="middle" font-size="9" fill="#94a3b8">~100 l/min</text>
      </g>

      <!-- s5: Brand gelöscht -->
      <g id="s5-done" opacity="0">
        <rect x="20" y="20" width="200" height="32" rx="6" fill="#22c55e"/>
        <text x="120" y="40" text-anchor="middle" font-size="13" fill="#0b1424" font-weight="900">✓ ENTSTEHUNGSBRAND</text>
      </g>
    `),
    steps: [
      { t: 0,    h: [],                       text:'① Wandhydrant Typ S in Treppenraum/Flur. 30 m Schlauch (Ø 25 mm) auf Haspel. Anschluss an Löschwasser-Leitung.' },
      { t: 1500, h: ['s1-fire'],               text:'② Entstehungsbrand entdeckt — Bewohner alarmiert. Schnelle Reaktion entscheidend (innerhalb 3 Min).' },
      { t: 3500, h: ['s1-fire','s2-pull','s3-rohr'], text:'③ Schlauch wird ausgerollt und das Strahlrohr (DIN 14365) bis zum Brandherd gebracht.' },
      { t: 6000, h: ['s2-pull','s3-rohr','s4-water'], text:'④ Ventil öffnen → Wasserdruck 2—4 bar treibt ~100 l/min Wasser. Auch von Laien bedienbar.' },
      { t: 8000, h: ['s4-water','s5-done'],    text:'⑤ Entstehungsbrand gelöscht. Pflicht in vielen Gebäuden — kostet keine Energie, immer einsatzbereit.' },
    ],
  };

  /* =========================================================
     REGISTER · alle Animationen in EXPL einhängen
     ========================================================= */
  Object.keys(ANIMS).forEach(key => {
    EXPL.EXPLAINERS[key] = ANIMS[key];
  });

  console.info(`✓ Katalog-Explainers: ${Object.keys(ANIMS).length} Animationen registriert`);
})();
