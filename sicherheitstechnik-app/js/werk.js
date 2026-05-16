/* Sicherheits-Werk · Komplettes Industriegelände mit Werkschutz
   Interaktives SVG-Layout mit klickbaren Hotspots */

window.WERK = (() => {
  const { el } = U;

  /* ====== Hotspot-Definitionen ====== */
  const HOTSPOTS = [
    // === Tor + Pförtnerhaus ===
    { id:'tor', x:540, y:520, type:'tor', name:'Werkstor mit Schranke',
      info:'Schiebetor + Schranke mit ANPR-Kennzeichenerkennung. Mitarbeiter-RFID, Besucher-Anmeldung im Pförtnerhaus.',
      tech:'ANPR-Kamera 4 MP · RFID Mifare DESFire · Hub 1,5 Sek · Klemmschutz EN 12453', icon:'fa-grip-lines-vertical' },
    { id:'pfoertner', x:600, y:540, type:'gebaeude', name:'Pförtnerhaus 24/7',
      info:'Wachpersonal mit Sichtkontakt zum Tor. Live-Monitor aller Kameras, EMA-Bedienteil, Notruf direkt zur NSL.',
      tech:'2× 24"-Multi-Monitor · GSM-Notruf · Kamera-Wandbild · Logbuch', icon:'fa-warehouse' },
    // === Zaun + Sensoren ===
    { id:'zaun-n', x:400, y:60, type:'zaun', name:'Doppelstabmatten-Zaun · Nord',
      info:'2,4 m hoher Industriezaun mit NATO-Draht-Aufsatz und Glasfaser-Erschütterungs-Detektion.',
      tech:'DSM 2,4m · NATO-Draht Aufsatz · Senstar FiberPatrol DAS · Lokalisierung ±10m', icon:'fa-border-all' },
    { id:'erschuett-zaun', x:200, y:120, type:'melder', name:'Erschütterungs-Detektion',
      info:'Glasfaser-Kabel am Zaun erkennt Schneiden, Klettern, Schütteln in &lt; 1 Sek.',
      tech:'Phase-OTDR · 50 km Reichweite · KI-Klassifikation', icon:'fa-wave-pulse' },
    // === Hallen ===
    { id:'halle-prod', x:280, y:280, type:'halle', name:'Produktionshalle',
      info:'2.500 m². PIR-Melder im 25-m-Raster, Glasbruch an Oberlichtern, Magnetkontakte an allen 4 Toren.',
      tech:'8× PIR · 4× Glasbruch · 4× Magnetkontakt · Sprinkler-Anlage Nass', icon:'fa-industry' },
    { id:'halle-lager', x:480, y:240, type:'halle', name:'Hochregal-Lager',
      info:'Hochwert-Lager. ASD-Aspirationsrauchmelder, CO₂-Löschanlage (Daten-Korridor), Bewegungsmelder zwischen Regalen.',
      tech:'ASD Wagner TITANUS · CO₂-Flutung · 12× PIR · Wärmebild zur Decke', icon:'fa-boxes-stacked' },
    { id:'halle-tech', x:660, y:280, type:'halle', name:'Trafostation',
      info:'KRITIS-relevant! Vollständig eingezäunt mit Streckmetall. UV/IR-Flammenmelder, Sprinkler trocken, Türschloss RC4.',
      tech:'Streckmetall-Innenzaun · UV/IR-Flammen · RC4-Tür · Erschütterungs-Wand', icon:'fa-bolt-lightning' },
    // === Verwaltung ===
    { id:'verwaltung', x:380, y:440, type:'verwaltung', name:'Verwaltungsgebäude',
      info:'Eingangskontrolle mit Drehkreuz + Iris-Scan. RC3-Tür, Sicherheitsglas P5A im EG.',
      tech:'Drehkreuz HH 220cm · Iris-Scan IDEMIA · RC3-Tür · P5A-Glas im EG', icon:'fa-building' },
    // === Tank-Anlage ===
    { id:'tank', x:740, y:420, type:'tank', name:'Tank-Anlage (Brennstoff)',
      info:'500.000 L Diesel + 50.000 L Heizöl. Hochsicherheits-Bereich mit Anti-Ram-Pollern + Wärmebild-Kameras.',
      tech:'4× K12 Versenkpoller · Wärmebild FLIR · Schaum-Löschanlage', icon:'fa-oil-can' },
    // === Video-Türme ===
    { id:'turm1', x:120, y:200, type:'turm', name:'KWS Video-Tower 1 · Nord-West',
      info:'4× PTZ-Kamera 25× Zoom + Wärmebild + Laser-IR 100 m + Lautsprecher 120 dB.',
      tech:'4× PTZ Dahua · 1× Thermal FLIR · IR 100m · Auto-Tracking', icon:'fa-tower-cell' },
    { id:'turm2', x:780, y:140, type:'turm', name:'KWS Video-Tower 2 · Nord-Ost',
      info:'Identisch mit Turm 1. Überschneidende Sichtfelder für lückenlose Abdeckung.',
      tech:'4× PTZ Dahua · 1× Thermal · IR 100m', icon:'fa-tower-cell' },
    { id:'turm3', x:120, y:540, type:'turm', name:'KWS Video-Tower 3 · Süd-West',
      info:'Beobachtet Süd-West-Bereich inkl. Mitarbeiterparkplatz und Verwaltung.',
      tech:'4× PTZ Dahua · 1× ANPR', icon:'fa-tower-cell' },
    { id:'turm4', x:780, y:540, type:'turm', name:'KWS Video-Tower 4 · Süd-Ost',
      info:'Tank-Anlage + Werkstor-Bereich.',
      tech:'4× PTZ + 1× Thermal · 2× ANPR · 1× Lautsprecher 120dB', icon:'fa-tower-cell' },
    // === LiDAR Perimeter ===
    { id:'lidar', x:450, y:130, type:'melder', name:'LiDAR-Perimeter-Scanner',
      info:'Frühwarnung vor dem Zaun. 300 m Reichweite. KI klassifiziert Mensch/Tier/Fahrzeug.',
      tech:'Velodyne 905nm · 10 Hz · 360° · Auto-Klassifikation', icon:'fa-satellite-dish' },
    // === Flutlicht-Mast ===
    { id:'flutlicht', x:420, y:340, type:'licht', name:'Flutlicht-Mast 12 m',
      info:'4× 400 W LED bei Bedarf. Aktiviert sich automatisch bei Alarm. 50.000 Lumen Gesamt.',
      tech:'4× LED 400W · 6500K · IP66 · Smart-Activation', icon:'fa-lightbulb' },
    // === Mitarbeiter-Parkplatz ===
    { id:'parkplatz', x:280, y:520, type:'parkplatz', name:'Mitarbeiter-Parkplatz',
      info:'30 Stellplätze. Beleuchtet + 2× Dome-Kamera. Schranke mit RFID.',
      tech:'2× Dome IK10 · LED-Beleuchtung 30 lx · RFID-Schranke', icon:'fa-square-parking' },
    // === Wachroute ===
    { id:'route1', x:480, y:380, type:'wachroute', name:'Wachroute Süd (alle 2h)',
      info:'Wachmann mit Diensthund läuft die Route 6× pro Nacht ab. Stempel-Punkte an 8 Stellen.',
      tech:'8× Stempelpunkte · NFC-Tags · Routen-App · Diensthund pflicht', icon:'fa-route' },
    // === Sirene + Blitz ===
    { id:'sirene', x:610, y:430, type:'alarm', name:'Außen-Sirene + Blitz',
      info:'110 dB Schall + Stroboskop. Hängt zentral, hörbar im ganzen Werk.',
      tech:'Bosch BSL-S · 110 dB @ 1m · Xenon-Blitz · 72h Akku', icon:'fa-bell' },
    // === Notrufknopf ===
    { id:'notruf', x:380, y:480, type:'alarm', name:'Notruf-Knopf (Verwaltung)',
      info:'Stiller Alarm an NSL. Bewachtungs-Streife in &lt; 5 Min.',
      tech:'Telenot · Stiller Alarm · Direktdraht zur NSL', icon:'fa-circle-exclamation' },
  ];

  const TYPE_COLORS = {
    tor: '#0891b2',
    gebaeude: '#fbbf24',
    zaun: '#22c55e',
    melder: '#22d3ee',
    halle: '#475569',
    verwaltung: '#a855f7',
    tank: '#ea580c',
    turm: '#dc2626',
    licht: '#fbbf24',
    parkplatz: '#64748b',
    wachroute: '#3b82f6',
    alarm: '#dc2626',
  };

  function view(d) {
    const root = el('div');

    // Hero
    const hero = el('div', { class:'werk-hero' });
    hero.innerHTML = `
      <div class="werk-hero-bg"></div>
      <div class="werk-hero-content">
        <div class="werk-tag">SICHERHEITS-WERK · INDUSTRIEGELÄNDE 15.000 m²</div>
        <h1>🏭 Komplett-Werkschutz · Live-Visualisierung</h1>
        <p>
          Klick auf einen <strong>orangen Punkt</strong> im Werk für Details:
          Tor · Zaun · Hallen · Verwaltung · Tank · Video-Türme · Sensoren · Flutlicht · Wachroute.
        </p>
        <div class="werk-stats">
          <div><i class="fas fa-camera"></i><strong>16</strong><span>Kameras</span></div>
          <div><i class="fas fa-broadcast-tower"></i><strong>4</strong><span>Video-Türme</span></div>
          <div><i class="fas fa-bell"></i><strong>32</strong><span>Sensoren</span></div>
          <div><i class="fas fa-shield-halved"></i><strong>4×</strong><span>Anti-Ram K12</span></div>
          <div><i class="fas fa-user-shield"></i><strong>2</strong><span>Wachen + Hund</span></div>
        </div>
      </div>
    `;
    root.appendChild(hero);

    // Steuerung
    const controls = el('div', { class:'werk-controls' });
    controls.innerHTML = `
      <div class="werk-mode-row">
        <button class="werk-btn active" data-mode="day"><i class="fas fa-sun"></i> Tag</button>
        <button class="werk-btn" data-mode="night"><i class="fas fa-moon"></i> Nacht</button>
        <button class="werk-btn" data-mode="anpr"><i class="fas fa-car"></i> ANPR-Einfahrt</button>
        <button class="werk-btn" data-mode="patrouille"><i class="fas fa-route"></i> Patrouille</button>
        <button class="werk-btn" data-mode="fire"><i class="fas fa-fire"></i> Brand-Szenario</button>
        <button class="werk-btn" data-mode="alarm"><i class="fas fa-triangle-exclamation"></i> ALARM</button>
      </div>
      <div class="werk-legende">
        ${Object.entries(TYPE_COLORS).map(([t, c]) => `
          <span class="werk-leg-item"><span class="werk-leg-dot" style="background:${c}"></span>${t}</span>
        `).join('')}
      </div>
    `;
    root.appendChild(controls);

    // SVG-Werk
    const stage = el('div', { class:'werk-stage' });
    root.appendChild(stage);

    let mode = 'day';

    function render() {
      const isNight = mode === 'night' || mode === 'alarm' || mode === 'fire';
      const isAlarm = mode === 'alarm';
      const isANPR = mode === 'anpr';
      const isFire = mode === 'fire';
      const isPatrouille = mode === 'patrouille';
      stage.innerHTML = `
        <svg viewBox="0 0 880 620" xmlns="http://www.w3.org/2000/svg" class="werk-svg ${isAlarm?'alarm-mode':''}">
          <defs>
            <linearGradient id="werk-sky" x2="0" y2="1">
              <stop offset="0" stop-color="${isNight?'#020617':'#3b82f6'}"/>
              <stop offset="1" stop-color="${isNight?'#0c1429':'#22d3ee'}"/>
            </linearGradient>
            <linearGradient id="werk-ground" x2="0" y2="1">
              <stop offset="0" stop-color="${isNight?'#0a0f1a':'#475569'}"/>
              <stop offset="1" stop-color="${isNight?'#020617':'#1e293b'}"/>
            </linearGradient>
            <radialGradient id="werk-light">
              <stop offset="0" stop-color="rgba(254,243,199,.4)"/>
              <stop offset="1" stop-color="rgba(254,243,199,0)"/>
            </radialGradient>
            <linearGradient id="halle-wall" x2="0" y2="1">
              <stop offset="0" stop-color="#94a3b8"/>
              <stop offset="1" stop-color="#475569"/>
            </linearGradient>
            <linearGradient id="halle-roof" x2="0" y2="1">
              <stop offset="0" stop-color="#1e293b"/>
              <stop offset="1" stop-color="#0a0f1a"/>
            </linearGradient>
            <pattern id="grass" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="${isNight?'#14532d':'#22c55e'}" opacity=".3"/>
              <circle cx="5" cy="5" r="1" fill="${isNight?'#166534':'#16a34a'}"/>
              <circle cx="15" cy="12" r="1" fill="${isNight?'#166534':'#16a34a'}"/>
            </pattern>
            <pattern id="asphalt" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="${isNight?'#0a0f1a':'#475569'}"/>
              <line x1="0" y1="20" x2="40" y2="20" stroke="#64748b" stroke-width=".3"/>
            </pattern>
          </defs>

          <!-- Himmel + Boden -->
          <rect width="880" height="620" fill="url(#werk-ground)"/>

          <!-- Gras-Bereich -->
          <rect width="880" height="620" fill="url(#grass)" opacity=".6"/>

          <!-- Asphalt-Hof -->
          <rect x="100" y="170" width="680" height="370" fill="url(#asphalt)"/>
          <line x1="430" y1="170" x2="430" y2="540" stroke="#fbbf24" stroke-width="1" stroke-dasharray="10 8" opacity=".5"/>
          <line x1="100" y1="370" x2="780" y2="370" stroke="#fbbf24" stroke-width="1" stroke-dasharray="10 8" opacity=".5"/>

          <!-- Zaun rundum -->
          <rect x="60" y="50" width="760" height="540" fill="none" stroke="#22c55e" stroke-width="3"/>
          <!-- Vertikale Zaun-Stäbe -->
          ${Array.from({length: 38}, (_,i) => `<line x1="${60 + i*20}" y1="50" x2="${60 + i*20}" y2="590" stroke="#22c55e" stroke-width=".5" opacity=".7"/>`).join('')}
          ${Array.from({length: 27}, (_,i) => `<line x1="60" y1="${50 + i*20}" x2="820" y2="${50 + i*20}" stroke="#22c55e" stroke-width=".5" opacity=".7"/>`).join('')}
          <!-- NATO-Draht Aufsatz -->
          <path d="M60 38 Q90 22 120 38 Q150 22 180 38 Q210 22 240 38 Q270 22 300 38 Q330 22 360 38 Q390 22 420 38 Q450 22 480 38 Q510 22 540 38 Q570 22 600 38 Q630 22 660 38 Q690 22 720 38 Q750 22 780 38 Q810 22 820 38" fill="none" stroke="#dc2626" stroke-width="2"/>

          <!-- Hallen -->
          <!-- Produktion -->
          <g>
            <rect x="180" y="220" width="200" height="130" fill="url(#halle-wall)" stroke="#0a0f1a" stroke-width="2"/>
            <path d="M180 220 L 280 195 L 380 220 Z" fill="url(#halle-roof)"/>
            <rect x="200" y="260" width="50" height="50" fill="${isNight?'#fbbf24':'#1e293b'}" opacity="${isNight?'.7':'.8'}"/>
            <rect x="310" y="260" width="50" height="50" fill="${isNight?'#fbbf24':'#1e293b'}" opacity="${isNight?'.7':'.8'}"/>
            <rect x="265" y="320" width="30" height="30" fill="#1e3a8a"/>
            <text x="280" y="240" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="900">PRODUKTION</text>
          </g>

          <!-- Lager -->
          <g>
            <rect x="400" y="190" width="180" height="130" fill="url(#halle-wall)" stroke="#0a0f1a" stroke-width="2"/>
            <path d="M400 190 L 490 165 L 580 190 Z" fill="url(#halle-roof)"/>
            <rect x="420" y="230" width="40" height="40" fill="${isNight?'#fbbf24':'#1e293b'}" opacity=".75"/>
            <rect x="475" y="230" width="40" height="40" fill="${isNight?'#fbbf24':'#1e293b'}" opacity=".75"/>
            <rect x="530" y="230" width="40" height="40" fill="${isNight?'#fbbf24':'#1e293b'}" opacity=".75"/>
            <rect x="475" y="285" width="30" height="35" fill="#1e3a8a"/>
            <text x="490" y="210" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="900">LAGER</text>
          </g>

          <!-- Trafostation (mit Innenzaun) -->
          <g>
            <rect x="600" y="240" width="120" height="90" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
            <!-- Innenzaun Streckmetall -->
            <rect x="590" y="230" width="140" height="110" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3 2"/>
            <text x="660" y="290" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="900">TRAFO</text>
            <text x="660" y="304" text-anchor="middle" font-size="8" fill="#dc2626">KRITIS</text>
            <!-- Hochspannungs-Schilder -->
            <polygon points="615,255 625,272 605,272" fill="#fbbf24"/>
            <text x="615" y="270" text-anchor="middle" font-size="9" fill="#0a0f1a" font-weight="900">!</text>
          </g>

          <!-- Verwaltung -->
          <g>
            <rect x="320" y="400" width="160" height="80" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
            <path d="M320 400 L 400 380 L 480 400 Z" fill="#0f172a"/>
            ${Array.from({length: 4}, (_,i) => `<rect x="${340 + i*30}" y="420" width="20" height="20" fill="${isNight?'#fbbf24':'#3b82f6'}" opacity=".7"/>`).join('')}
            ${Array.from({length: 4}, (_,i) => `<rect x="${340 + i*30}" y="450" width="20" height="20" fill="${isNight?'#fbbf24':'#3b82f6'}" opacity=".7"/>`).join('')}
            <text x="400" y="395" text-anchor="middle" font-size="9" fill="#a855f7" font-weight="900">VERWALTUNG</text>
          </g>

          <!-- Tank-Anlage -->
          <g>
            <!-- Anti-Ram Poller um Tanks -->
            <rect x="690" y="370" width="120" height="110" fill="rgba(234,88,12,.08)" stroke="#ea580c" stroke-dasharray="3 2"/>
            <circle cx="720" cy="420" r="22" fill="#475569" stroke="#0a0f1a" stroke-width="2"/>
            <circle cx="720" cy="420" r="18" fill="#1e293b"/>
            <text x="720" y="424" text-anchor="middle" font-size="10" fill="#ea580c" font-weight="900">DIESEL</text>
            <circle cx="780" cy="430" r="18" fill="#475569" stroke="#0a0f1a" stroke-width="2"/>
            <text x="780" y="433" text-anchor="middle" font-size="8" fill="#ea580c" font-weight="900">HEIZÖL</text>
            <!-- Poller (4 Punkte) -->
            ${[[695,378],[805,378],[805,478],[695,478]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#ea580c" stroke="#0a0f1a" stroke-width="1"/>`).join('')}
          </g>

          <!-- Mitarbeiter-Parkplatz -->
          <g>
            <rect x="190" y="475" width="180" height="80" fill="${isNight?'#1e293b':'#64748b'}" stroke="#475569"/>
            ${Array.from({length: 6}, (_,i) => `<line x1="${200 + i*28}" y1="475" x2="${200 + i*28}" y2="555" stroke="#fbbf24" stroke-width="1" opacity=".6"/>`).join('')}
            ${[210,235,270,300,335].map((x, i) => `<rect x="${x}" y="${i%2===0?490:520}" width="22" height="14" rx="2" fill="${['#dc2626','#0891b2','#fbbf24','#22c55e','#a855f7'][i]}"/>`).join('')}
            <text x="280" y="487" text-anchor="middle" font-size="8" fill="#fbbf24" font-weight="700">P · 30 Stellpl.</text>
          </g>

          <!-- Tor -->
          <g>
            <rect x="520" y="510" width="100" height="6" fill="#475569"/>
            ${Array.from({length: 10}, (_,i) => `<rect x="${523 + i*9}" y="514" width="2" height="20" fill="#94a3b8"/>`).join('')}
            <!-- Schranke -->
            <rect x="500" y="490" width="6" height="60" fill="#475569"/>
            <rect x="500" y="494" width="80" height="4" fill="#dc2626"/>
            ${[510,524,538,552,566].map(x => `<rect x="${x}" y="494" width="8" height="4" fill="#fbbf24"/>`).join('')}
            <!-- Pförtnerhaus -->
            <rect x="582" y="520" width="40" height="36" fill="#92400e" stroke="#0a0f1a" stroke-width="1.5"/>
            <rect x="588" y="526" width="14" height="12" fill="${isNight?'#fbbf24':'#22d3ee'}" opacity=".8"/>
            <rect x="606" y="526" width="14" height="12" fill="${isNight?'#fbbf24':'#22d3ee'}" opacity=".8"/>
          </g>

          <!-- Video-Türme -->
          ${[[120,200],[780,140],[120,540],[780,540]].map(([tx,ty]) => `
            <g>
              <rect x="${tx-2}" y="${ty-50}" width="4" height="50" fill="#94a3b8"/>
              <rect x="${tx-12}" y="${ty-58}" width="24" height="10" fill="#1e293b" stroke="#dc2626"/>
              <circle cx="${tx-6}" cy="${ty-53}" r="3" fill="#0c0a1a" stroke="#dc2626"/>
              <circle cx="${tx+6}" cy="${ty-53}" r="3" fill="#0c0a1a" stroke="#dc2626"/>
              <circle cx="${tx}" cy="${ty-53}" r="2" fill="#dc2626"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
              ${isNight ? `<ellipse cx="${tx}" cy="${ty-30}" rx="60" ry="80" fill="url(#werk-light)" opacity=".4"/>` : ''}
            </g>
          `).join('')}

          <!-- Flutlicht-Mast Mitte -->
          <g>
            <rect x="418" y="280" width="4" height="60" fill="#94a3b8"/>
            <rect x="410" y="278" width="20" height="8" fill="#fbbf24"/>
            ${isAlarm || isNight ? `<ellipse cx="420" cy="340" rx="120" ry="120" fill="url(#werk-light)" opacity="${isAlarm?'.7':'.3'}"/>` : ''}
          </g>

          <!-- Wachmann mit Hund (Patrouille) -->
          ${!isAlarm ? `
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="450 380; 550 400; 600 450; 500 470; 400 450; 450 380"
                dur="35s" repeatCount="indefinite"/>
              ${SPRITES.wachmannWalking('wach-route', 0, 0, 0.5, 0.55)}
              ${SPRITES.hund('hund-route', 18, 38, 0.5)}
            </g>
          ` : ''}

          <!-- Eindringling im Alarm-Modus -->
          ${isAlarm ? `
            <g>
              ${SPRITES.eindringling('intruder', 200, 100, 0.6)}
              <circle cx="200" cy="100" r="35" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 3">
                <animate attributeName="r" values="30;45;30" dur="1s" repeatCount="indefinite"/>
              </circle>
              <text x="200" y="55" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="900">⚠ INTRUDER · CAM-3</text>
            </g>
            <!-- Alarm-Banner -->
            <rect x="0" y="0" width="880" height="32" fill="#ef4444">
              <animate attributeName="opacity" values=".7;1;.7" dur=".4s" repeatCount="indefinite"/>
            </rect>
            <text x="440" y="22" text-anchor="middle" font-size="16" fill="white" font-weight="900">⚠⚠⚠ ALARM · PERIMETER NORD VERLETZT · POLIZEI ALARMIERT ⚠⚠⚠</text>
          ` : ''}

          <!-- Mitarbeiter im Tag-Modus -->
          ${mode === 'day' ? `
            ${SPRITES.mitarbeiter('mit-1', 360, 510, 0.45)}
            ${SPRITES.mitarbeiter('mit-2', 410, 500, 0.45)}
          ` : ''}

          <!-- ANPR-EINFAHRT-Szenario -->
          ${isANPR ? `
            <!-- Auto fährt zum Tor -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="860 0; 580 0; 580 0; 580 0; 380 0"
                keyTimes="0; .3; .55; .8; 1" dur="9s" repeatCount="indefinite"/>
              <rect x="-40" y="540" width="80" height="30" rx="3" fill="#1e293b" stroke="#475569"/>
              <rect x="-30" y="524" width="50" height="18" rx="6" fill="#0f172a"/>
              <circle cx="-25" cy="572" r="6" fill="#0a0f1a"/>
              <circle cx="20" cy="572" r="6" fill="#0a0f1a"/>
              <rect x="-25" y="555" width="40" height="10" fill="#fef3c7" stroke="#fbbf24"/>
              <text x="-5" y="563" text-anchor="middle" font-size="7" fill="#0b1424" font-family="monospace" font-weight="900">B-XK 1288</text>
              <rect x="-42" y="548" width="4" height="6" rx="1" fill="#fef3c7"/>
            </g>
            <!-- ANPR-Sichtkegel -->
            <path d="M 540 524 L 660 540 L 660 580 L 540 540 Z" fill="rgba(34,211,238,.15)" stroke="rgba(34,211,238,.4)" stroke-dasharray="3 2"/>
            <!-- ANPR-Display -->
            <rect x="450" y="450" width="180" height="50" rx="6" fill="#0a0f1a" stroke="#22d3ee" stroke-width="2"/>
            <text x="540" y="470" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">ANPR · B-XK 1288</text>
            <text x="540" y="486" text-anchor="middle" font-size="9" fill="#22c55e">✓ WHITELIST · MITARBEITER</text>
            <!-- Schranke öffnet -->
            <rect x="500" y="490" width="6" height="60" fill="#475569"/>
            <rect x="500" y="494" width="80" height="4" fill="#dc2626">
              <animateTransform attributeName="transform" type="rotate" values="0 503 496; -75 503 496; -75 503 496; 0 503 496" keyTimes="0; .4; .8; 1" dur="9s" repeatCount="indefinite"/>
            </rect>
          ` : ''}

          <!-- BRAND-Szenario -->
          ${isFire ? `
            <!-- Flammen aus Halle Lager -->
            <g transform="translate(490, 250)">
              ${Array.from({length: 5}, (_,i) => `
                <path d="M${-10+i*4} -5 Q${-5+i*4} -25 ${i*4} -10 Q${5+i*4} -28 ${10+i*4} -8 Q${12+i*4} 0 ${5+i*4} 5 Q${-5+i*4} 5 ${-10+i*4} -5 Z"
                      fill="#dc2626">
                  <animate attributeName="fill" values="#dc2626;#fbbf24;#ea580c;#dc2626" dur=".4s" begin="${i*0.1}s" repeatCount="indefinite"/>
                </path>
              `).join('')}
            </g>
            <!-- Rauchsäule -->
            ${Array.from({length: 10}, (_,i) => `
              <circle cx="${480 + Math.sin(i*0.7)*15}" cy="${230 - i*22}" r="${12 + i*2}" fill="#475569" opacity="${0.7 - i*0.06}">
                <animate attributeName="cy" values="${230 - i*22};${100 - i*22}" dur="${4+i*0.2}s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="${0.7 - i*0.06};0" dur="${4+i*0.2}s" repeatCount="indefinite"/>
              </circle>
            `).join('')}
            <!-- Sprinkler-Aktiv-Marker -->
            <rect x="400" y="190" width="180" height="130" fill="rgba(34,211,238,.15)" stroke="#22d3ee" stroke-width="3" stroke-dasharray="6 3">
              <animate attributeName="stroke-dashoffset" values="0;-18" dur="1s" repeatCount="indefinite"/>
            </rect>
            <text x="490" y="178" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="900">💧 SPRINKLER AKTIV</text>
            <!-- Feuerwehr fährt rein -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="-150 0; 350 0; 350 0"
                keyTimes="0; .5; 1" dur="6s" repeatCount="indefinite"/>
              <rect x="60" y="530" width="110" height="30" rx="3" fill="#dc2626" stroke="#0b1424"/>
              <rect x="70" y="510" width="60" height="22" rx="4" fill="#dc2626" stroke="#0b1424"/>
              <text x="100" y="550" text-anchor="middle" font-size="7" fill="white" font-weight="900">FEUERWEHR 112</text>
              <circle cx="70" cy="565" r="7" fill="#0a0f1a"/>
              <circle cx="150" cy="565" r="7" fill="#0a0f1a"/>
              <!-- Blaulicht -->
              <rect x="80" y="500" width="40" height="6" rx="2" fill="#1e293b"/>
              <circle cx="90" cy="503" r="4" fill="#22d3ee"><animate attributeName="opacity" values="1;0;1;0;1" dur=".5s" repeatCount="indefinite"/></circle>
              <circle cx="110" cy="503" r="4" fill="#22d3ee"><animate attributeName="opacity" values="0;1;0;1;0" dur=".5s" repeatCount="indefinite"/></circle>
            </g>
            <!-- Brand-Banner -->
            <rect x="0" y="0" width="880" height="32" fill="#ea580c">
              <animate attributeName="opacity" values=".7;1;.7" dur=".5s" repeatCount="indefinite"/>
            </rect>
            <text x="440" y="22" text-anchor="middle" font-size="14" fill="white" font-weight="900">🔥 BRAND IN LAGER · SPRINKLER AKTIV · FEUERWEHR ALARMIERT (112)</text>
          ` : ''}

          <!-- PATROUILLE-Modus: detaillierter Wachmann + Hund + Route -->
          ${isPatrouille ? `
            <!-- Routen-Linie sichtbar -->
            <path d="M 450 380 Q 550 400 600 450 Q 500 470 400 450 Q 350 410 450 380 Z"
                  fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5 4" opacity=".6"/>
            <!-- Stempelpunkte -->
            ${[[450,380],[550,400],[600,450],[500,470],[400,450],[350,410]].map(([x,y], i) => `
              <circle cx="${x}" cy="${y}" r="6" fill="#fbbf24" stroke="#0a0f1a" stroke-width="1"/>
              <text x="${x}" y="${y+2}" text-anchor="middle" font-size="8" fill="#0a0f1a" font-weight="900">${i+1}</text>
            `).join('')}
            <!-- Wachmann + Hund größer und prominent -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="450 380; 550 400; 600 450; 500 470; 400 450; 350 410; 450 380"
                dur="30s" repeatCount="indefinite"/>
              ${SPRITES.wachmannWalking('wach-detail', 0, 0, 0.65, 0.5)}
              ${SPRITES.hund('hund-detail', 25, 45, 0.6)}
              <!-- NFC-Stempel-Aktion -->
              <rect x="-30" y="-35" width="60" height="14" rx="2" fill="#22c55e"/>
              <text x="0" y="-25" text-anchor="middle" font-size="8" fill="#0a0f1a" font-weight="800">NFC-CHECK</text>
            </g>
          ` : ''}

          <!-- Hotspots -->
          ${HOTSPOTS.map(h => `
            <g class="werk-hotspot" data-id="${h.id}" style="cursor:pointer">
              <circle cx="${h.x}" cy="${h.y}" r="14" fill="${TYPE_COLORS[h.type]}" opacity=".25">
                <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="${h.x}" cy="${h.y}" r="10" fill="${TYPE_COLORS[h.type]}" stroke="white" stroke-width="2"/>
              <foreignObject x="${h.x-6}" y="${h.y-6}" width="12" height="12">
                <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:12px;height:12px;color:white;font-size:7px"><i class="fas ${h.icon}"></i></div>
              </foreignObject>
            </g>
          `).join('')}
        </svg>
      `;

      // Hotspot-Klicks
      stage.querySelectorAll('.werk-hotspot').forEach(g => {
        g.onclick = () => {
          const h = HOTSPOTS.find(x => x.id === g.dataset.id);
          if (h) openHotspot(h);
        };
      });
    }

    controls.querySelectorAll('.werk-btn').forEach(btn => {
      btn.onclick = () => {
        mode = btn.dataset.mode;
        controls.querySelectorAll('.werk-btn').forEach(b => b.classList.toggle('active', b === btn));
        render();
      };
    });

    function openHotspot(h) {
      const c = TYPE_COLORS[h.type] || '#22d3ee';
      const drawer = el('div', { class:'mency-drawer-bg' });
      const inner = el('div', { class:'mency-drawer wide' });
      const extra = buildHotspotExtra(h);
      inner.innerHTML = `
        <div class="mency-drawer-head" style="--c:${c}">
          <button class="mency-drawer-close"><i class="fas fa-xmark"></i></button>
          <div class="mency-drawer-kat"><i class="fas ${h.icon}"></i> ${h.type.toUpperCase()}</div>
          <h2>${h.name}</h2>
        </div>
        ${extra}
        <div class="mency-drawer-body">
          <section>
            <h3><i class="fas fa-info-circle"></i> Beschreibung</h3>
            <p>${h.info}</p>
          </section>
          <section>
            <h3><i class="fas fa-microchip"></i> Technische Ausstattung</h3>
            <p>${h.tech}</p>
          </section>
        </div>
      `;
      drawer.appendChild(inner);
      document.body.appendChild(drawer);
      requestAnimationFrame(() => drawer.classList.add('open'));
      const close = () => { drawer.classList.remove('open'); setTimeout(() => drawer.remove(), 250); };
      drawer.querySelector('.mency-drawer-close').onclick = close;
      drawer.onclick = (e) => { if (e.target === drawer) close(); };
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
    }

    function buildHotspotExtra(h) {
      // Pförtnerhaus-Innenansicht
      if (h.id === 'pfoertner') {
        return `
          <div class="werk-detail-vis">
            <svg viewBox="0 0 800 360" class="werk-detail-svg">
              <defs>
                <linearGradient id="pf-wall" x2="0" y2="1">
                  <stop offset="0" stop-color="#cbd5e1"/>
                  <stop offset="1" stop-color="#475569"/>
                </linearGradient>
              </defs>
              <rect width="800" height="360" fill="url(#pf-wall)"/>
              <!-- Boden -->
              <rect y="280" width="800" height="80" fill="#92400e"/>
              <line x1="0" y1="280" x2="800" y2="280" stroke="#0a0f1a" stroke-width="2"/>
              <!-- Decke -->
              <line x1="0" y1="50" x2="800" y2="50" stroke="#0a0f1a" stroke-width="2"/>
              <!-- Fenster zum Tor -->
              <rect x="40" y="80" width="140" height="100" fill="rgba(34,211,238,.25)" stroke="#0a0f1a" stroke-width="3"/>
              <line x1="110" y1="80" x2="110" y2="180" stroke="#0a0f1a" stroke-width="2"/>
              <line x1="40" y1="130" x2="180" y2="130" stroke="#0a0f1a" stroke-width="2"/>
              <text x="110" y="200" text-anchor="middle" font-size="9" fill="#0a0f1a" font-weight="700">Sicht zum Tor</text>
              <!-- Multi-Monitor-Wand -->
              <rect x="250" y="80" width="320" height="160" rx="4" fill="#0a0f1a" stroke="#1e293b" stroke-width="3"/>
              ${[0,1,2,3].map(i => {
                const x = 260 + (i%2)*155;
                const y = 90 + Math.floor(i/2)*75;
                return `
                  <rect x="${x}" y="${y}" width="150" height="70" fill="#1e293b" stroke="#475569"/>
                  <text x="${x+8}" y="${y+12}" font-size="8" fill="#22d3ee" font-family="monospace">CAM 0${i+1}</text>
                  <circle cx="${x+140}" cy="${y+10}" r="2" fill="#ef4444"><animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/></circle>
                  <!-- Live-Bild-Inhalt -->
                  ${i === 0 ? `<rect x="${x+50}" y="${y+25}" width="50" height="30" fill="#475569"/><text x="${x+75}" y="${y+45}" text-anchor="middle" font-size="8" fill="#fbbf24">TOR LIVE</text>` : ''}
                  ${i === 1 ? `<circle cx="${x+75}" cy="${y+40}" r="10" fill="#fbd7a0"/><rect x="${x+68}" y="${y+48}" width="14" height="18" fill="#1e3a8a"/><text x="${x+75}" y="${y+65}" text-anchor="middle" font-size="6" fill="#22c55e">PERIMETER</text>` : ''}
                  ${i === 2 ? `<rect x="${x+30}" y="${y+30}" width="90" height="30" fill="#1e293b"/>${Array.from({length: 5}, (_,j) => `<rect x="${x+35+j*16}" y="${y+33}" width="12" height="24" fill="#475569"/>`).join('')}<text x="${x+75}" y="${y+65}" text-anchor="middle" font-size="6" fill="#fbbf24">LAGER</text>` : ''}
                  ${i === 3 ? `<text x="${x+75}" y="${y+40}" text-anchor="middle" font-size="14" fill="#fbbf24" font-weight="900">TANK</text><text x="${x+75}" y="${y+58}" text-anchor="middle" font-size="6" fill="#22d3ee">THERMAL OK</text>` : ''}
                `;
              }).join('')}
              <!-- Schreibtisch -->
              <rect x="240" y="260" width="340" height="20" fill="#92400e" stroke="#0a0f1a"/>
              <rect x="240" y="280" width="340" height="80" fill="#451a03"/>
              <!-- Wachmann am Schreibtisch -->
              ${SPRITES.wachmann('pf-wach', 410, 240, 1.2)}
              <!-- EMA-Bedienteil -->
              <rect x="620" y="100" width="100" height="140" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
              <rect x="630" y="110" width="80" height="32" fill="#0a0f1a"/>
              <text x="670" y="124" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace" font-weight="800">SCHARF</text>
              <text x="670" y="136" text-anchor="middle" font-size="6" fill="#94a3b8">8 LINIEN OK</text>
              ${[0,1,2].map(r => [0,1,2].map(c => {
                const n = r*3+c+1;
                return `<rect x="${636+c*22}" y="${152+r*22}" width="18" height="16" rx="2" fill="#475569"/><text x="${645+c*22}" y="${164+r*22}" text-anchor="middle" font-size="8" fill="#fbbf24" font-weight="700">${n}</text>`;
              }).join('')).join('')}
              <text x="670" y="252" text-anchor="middle" font-size="8" fill="#fbbf24" font-weight="800">EMA-PANEL</text>
              <!-- Notruf-Knopf rot -->
              <rect x="240" y="270" width="40" height="12" rx="2" fill="#1e293b"/>
              <circle cx="260" cy="276" r="6" fill="#dc2626" stroke="white" stroke-width="1.5"><animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/></circle>
              <text x="260" y="298" text-anchor="middle" font-size="7" fill="#dc2626" font-weight="900">NOTRUF</text>
              <!-- Funkgerät auf Tisch -->
              <rect x="500" y="266" width="20" height="14" rx="1" fill="#0a0f1a"/>
              <circle cx="510" cy="269" r="1.5" fill="#22c55e"/>
              <!-- Kaffee + Notizblock -->
              <rect x="540" y="266" width="14" height="14" rx="2" fill="#fbf24" stroke="#0a0f1a"/>
              <text x="547" y="276" text-anchor="middle" font-size="8" fill="#92400e">📋</text>
              <rect x="560" y="262" width="16" height="18" rx="1" fill="white" stroke="#0a0f1a"/>
              <line x1="563" y1="268" x2="573" y2="268" stroke="#0a0f1a"/>
              <line x1="563" y1="272" x2="573" y2="272" stroke="#0a0f1a"/>
              <line x1="563" y1="276" x2="571" y2="276" stroke="#0a0f1a"/>
            </svg>
            <p class="werk-detail-cap">Pförtnerhaus-Innenansicht · Wachmann am Multi-Monitor-Arbeitsplatz · EMA-Panel · Notruf-Knopf · GSM-Funkgerät</p>
          </div>
        `;
      }
      // Video-Tower Sichtfeld
      if (h.type === 'turm') {
        return `
          <div class="werk-detail-vis">
            <svg viewBox="0 0 800 360" class="werk-detail-svg">
              <defs>
                <linearGradient id="t-sky" x2="0" y2="1">
                  <stop offset="0" stop-color="#020617"/>
                  <stop offset="1" stop-color="#1e293b"/>
                </linearGradient>
              </defs>
              <rect width="800" height="300" fill="url(#t-sky)"/>
              <rect y="300" width="800" height="60" fill="#0a0f1a"/>
              <!-- Turm -->
              <rect x="40" y="80" width="10" height="220" fill="#94a3b8"/>
              <rect x="20" y="70" width="50" height="14" rx="2" fill="#1e293b" stroke="#dc2626"/>
              <circle cx="30" cy="77" r="3" fill="#0c0a1a" stroke="#dc2626"/>
              <circle cx="45" cy="77" r="3" fill="#0c0a1a" stroke="#dc2626"/>
              <circle cx="60" cy="77" r="3" fill="#0c0a1a" stroke="#dc2626"/>
              <!-- Sichtkegel 25× Zoom -->
              <path d="M 50 80 L 780 100 L 780 240 L 50 100 Z" fill="rgba(34,211,238,.15)" stroke="rgba(34,211,238,.4)" stroke-dasharray="3 2"/>
              <!-- Distanz-Marker -->
              ${[200,500,900].map((d,i) => {
                const x = 60 + (d/1000)*720;
                const lab = ['IDENTIFIZIEREN','ERKENNEN','BEOBACHTEN'][i];
                const col = ['#22c55e','#fbbf24','#06b6d4'][i];
                return `
                  <line x1="${x}" y1="80" x2="${x}" y2="300" stroke="${col}" stroke-width="1" stroke-dasharray="3 2"/>
                  <rect x="${x-50}" y="85" width="100" height="20" rx="3" fill="${col}"/>
                  <text x="${x}" y="98" text-anchor="middle" font-size="9" fill="#0b1424" font-weight="800">${d}m · ${lab}</text>
                `;
              }).join('')}
              <!-- Person bei 200m -->
              ${SPRITES.eindringling('t-int', 200, 240, 0.7)}
              <!-- Bounding Box -->
              <rect x="180" y="200" width="40" height="80" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2"/>
              <rect x="160" y="184" width="80" height="14" fill="#ef4444"/>
              <text x="200" y="194" text-anchor="middle" font-size="8" fill="white" font-family="monospace" font-weight="800">PERSON 97%</text>
            </svg>
            <p class="werk-detail-cap">Sichtfeld des Video-Towers · 4 PTZ-Kameras + Thermal · 25× optisches Zoom · Identifizieren > 200m</p>
          </div>
        `;
      }
      return '';
    }

    setTimeout(render, 0);
    return root;
  }

  return { view };
})();
