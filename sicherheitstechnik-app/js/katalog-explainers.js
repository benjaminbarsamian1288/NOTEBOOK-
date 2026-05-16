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
     REGISTER · alle Animationen in EXPL einhängen
     ========================================================= */
  Object.keys(ANIMS).forEach(key => {
    EXPL.EXPLAINERS[key] = ANIMS[key];
  });

  console.info(`✓ Katalog-Explainers: ${Object.keys(ANIMS).length} Animationen registriert`);
})();
