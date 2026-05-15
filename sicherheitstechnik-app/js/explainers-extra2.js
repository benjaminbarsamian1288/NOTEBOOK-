/* Erklär-Videos für die neuen Spezialmelder (alarmdraht-tapete, etc.) */
(function() {
  function add() {
    if (!window.EXPL) return;
    const E = window.EXPL.EXPLAINERS;

    // ============== ALARMDRAHT-TAPETE ==============
    E['alarmdraht-tapete'] = {
      title: 'Alarmdraht-Tapete · Flächenschutz',
      intro: 'Drähte in der Tapete · Wand-Durchbruch sofort erkannt',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Wand -->
          <rect x="40" y="40" width="520" height="240" fill="#92602a" stroke="#5a3a14" stroke-width="3"/>
          <!-- Tapete pattern -->
          <g opacity=".15" fill="#fef3c7">
            ${Array.from({length:14}).map((_,i)=>`<rect x="${52+i*38}" y="52" width="20" height="216" rx="2"/>`).join('')}
          </g>
          <!-- Alarmdraht-Netz (sichtbar gemacht im Animationsschritt) -->
          <g id="wires" opacity="0">
            ${Array.from({length:8}).map((_,r)=>{
              return `<path d="M ${50+(r%2)*16} ${60+r*30} Q 300 ${50+r*30} 550 ${60+r*30}" stroke="#fbbf24" stroke-width="1.5" fill="none"/>`;
            }).join('')}
            <text x="300" y="36" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">Drahtnetz unter Tapete</text>
          </g>
          <!-- Stromkreis-Indikator -->
          <g id="circuit-ok" opacity="0">
            <circle cx="60" cy="60" r="6" fill="#22c55e"/>
            <circle cx="540" cy="60" r="6" fill="#22c55e"/>
            <text x="40" y="32" font-size="9" fill="#22c55e" font-family="system-ui" font-weight="700">+</text>
            <text x="540" y="32" font-size="9" fill="#22c55e" font-family="system-ui" font-weight="700">−</text>
          </g>
          <!-- Einbrecher Bohrt -->
          <g id="break" opacity="0">
            <circle cx="300" cy="160" r="14" fill="#0c0a1a" stroke="#ef4444" stroke-width="2"/>
            <circle cx="300" cy="160" r="6" fill="#ef4444"/>
            <line x1="262" y1="120" x2="262" y2="200" stroke="#ef4444" stroke-width="2"/>
            <line x1="338" y1="120" x2="338" y2="200" stroke="#ef4444" stroke-width="2"/>
            <text x="300" y="100" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Wand-Durchbruch</text>
          </g>
          <!-- Stromkreis unterbrochen -->
          <g id="break-circuit" opacity="0">
            <line x1="260" y1="155" x2="340" y2="170" stroke="#ef4444" stroke-width="4" stroke-dasharray="6 4"/>
          </g>
          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="40" y="280" width="520" height="38" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="300" y="306" text-anchor="middle" font-size="15" fill="white" font-family="system-ui" font-weight="800">⚠ WAND-DURCHBRUCH ERKANNT</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: [],                       text:'① Eine Wand sieht völlig normal aus — der Schutz ist unsichtbar.' },
        { t: 3500, h: ['wires'],                text:'② Unter der Tapete (oder im Putz) ist ein engmaschiges Drahtnetz versteckt.' },
        { t: 7000, h: ['circuit-ok'],           text:'③ Ein permanenter Ruhestrom fließt durch das Netz — Status: alles OK.' },
        { t: 10500,h: ['break','break-circuit'],text:'④ Jemand versucht, durch die Wand zu bohren → mindestens ein Draht wird durchtrennt.' },
        { t: 14000,h: ['alarm'],                text:'⑤ Stromfluss unterbrochen → sofort ALARM! Eingesetzt in Tresorräumen, Edelmetall-Lagern.' },
      ],
      cycle: 18000,
    };

    // ============== ALARMSPINNE ==============
    E['alarmspinne'] = {
      title: 'Alarmspinne · Geflechtschutz',
      intro: 'Hauchdünnes Drahtgeflecht direkt auf der Schutzfläche',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tresor-Tür -->
          <rect x="80" y="30" width="440" height="260" rx="8" fill="#475569" stroke="#0f172a" stroke-width="3"/>
          <rect x="100" y="50" width="400" height="220" fill="#1e293b"/>
          <text x="300" y="170" text-anchor="middle" font-size="32" font-weight="800" fill="#94a3b8" font-family="system-ui">TRESOR</text>
          <!-- Spinnen-Geflecht -->
          <g id="web" opacity="0" stroke="#22d3ee" stroke-width="0.6" fill="none">
            ${(()=>{ let r='';
              for(let i=0;i<8;i++){
                const x=120+i*48;
                r+=`<line x1="${x}" y1="50" x2="${x}" y2="270"/>`;
              }
              for(let i=0;i<6;i++){
                const y=70+i*40;
                r+=`<line x1="100" y1="${y}" x2="500" y2="${y}"/>`;
              }
              // Diagonal
              r+='<line x1="100" y1="50" x2="500" y2="270"/>';
              r+='<line x1="500" y1="50" x2="100" y2="270"/>';
              return r;
            })()}
            <text x="300" y="22" text-anchor="middle" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">Drahtgeflecht (Alarmspinne)</text>
          </g>
          <!-- Einbruch -->
          <g id="break" opacity="0">
            <circle cx="280" cy="180" r="20" fill="#0c0a1a" stroke="#ef4444" stroke-width="3"/>
            <line x1="200" y1="100" x2="380" y2="270" stroke="#ef4444" stroke-width="3" opacity=".6"/>
            <text x="280" y="240" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Drähte durchtrennt</text>
          </g>
          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="80" y="290" width="440" height="28" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="300" y="310" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="800">⚠ TRESOR-DURCHBRUCH</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: [],         text:'① Auf der zu schützenden Fläche (Tresor-Tür, Vitrinen-Rückwand) ist nichts sichtbar.' },
        { t: 3500, h: ['web'],    text:'② Ein engmaschiges Drahtgeflecht — wie ein Spinnennetz — ist aufgebracht. Hauchdünn, oft transparent.' },
        { t: 7500, h: ['break'],  text:'③ Jeder Versuch, durch die Fläche zu bohren oder zu schneiden, durchtrennt mindestens einen Draht.' },
        { t: 11500,h: ['alarm'],  text:'④ Stromkreis unterbrochen → ALARM. Höchstwirksam, weil kein Bohrpunkt unentdeckt bleibt.' },
      ],
      cycle: 15000,
    };

    // ============== ALARMSCHLINGE ==============
    E['alarmschlinge'] = {
      title: 'Alarmschlinge · Objekt-Schutz',
      intro: 'Schlinge um wertvolles Objekt · Entfernen = Drahtbruch',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Object (vase / sculpture) -->
          <g id="object">
            <ellipse cx="300" cy="280" rx="50" ry="6" fill="rgba(0,0,0,.4)"/>
            <path d="M270 250 L270 180 Q270 130 250 100 Q260 70 300 70 Q340 70 350 100 Q330 130 330 180 L330 250 Z"
              fill="url(#objGrd)" stroke="#475569" stroke-width="2"/>
            <defs>
              <linearGradient id="objGrd" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stop-color="#cbd5e0"/>
                <stop offset="0.5" stop-color="#f8fafc"/>
                <stop offset="1" stop-color="#94a3b8"/>
              </linearGradient>
            </defs>
            <text x="300" y="190" text-anchor="middle" font-size="11" fill="#475569" font-family="system-ui" font-weight="700">KUNST-OBJEKT</text>
          </g>
          <!-- Schlinge -->
          <g id="loop" opacity="0">
            <ellipse cx="300" cy="210" rx="80" ry="14" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="4 3">
              <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.6s" repeatCount="indefinite"/>
            </ellipse>
            <circle cx="220" cy="210" r="4" fill="#22c55e"/>
            <circle cx="380" cy="210" r="4" fill="#22c55e"/>
            <path d="M220 210 Q180 240 140 250" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
            <path d="M380 210 Q420 240 460 250" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
            <text x="300" y="240" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">Alarmschlinge (Strom +/−)</text>
          </g>
          <!-- Object lifted -->
          <g id="lift" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -60" dur="2.5s" repeatCount="indefinite"/>
              <line x1="245" y1="100" x2="280" y2="60" stroke="#ef4444" stroke-width="2"/>
              <line x1="355" y1="100" x2="320" y2="60" stroke="#ef4444" stroke-width="2"/>
              <text x="300" y="50" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Objekt wird angehoben</text>
            </g>
          </g>
          <!-- Break -->
          <g id="break" opacity="0">
            <line x1="220" y1="210" x2="240" y2="190" stroke="#ef4444" stroke-width="4"/>
            <line x1="240" y1="210" x2="220" y2="190" stroke="#ef4444" stroke-width="4"/>
          </g>
          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="80" y="290" width="440" height="28" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="300" y="310" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="800">⚠ OBJEKT ENTFERNT</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['object'],         text:'① Ein wertvolles Objekt (Vase, Gemälde, Pokal) im Museum oder Vitrine.' },
        { t: 3500, h: ['loop'],            text:'② Eine hauchdünne Alarmschlinge wird um den Sockel/Objekt gespannt. Ruhestrom fließt.' },
        { t: 7000, h: ['lift','break'],    text:'③ Versucht jemand das Objekt anzuheben oder zu entfernen, wird die Schlinge gedehnt oder durchtrennt.' },
        { t: 11000,h: ['alarm'],           text:'④ Stromkreis unterbrochen → sofort ALARM. Standard in Museen, Galerien, Sammlungen.' },
      ],
      cycle: 14000,
    };

    // ============== KONTAKTMATTE HUB ==============
    E['kontaktmatte-hub'] = {
      title: 'Hub-Kontaktmatte · Vitrinenschutz',
      intro: 'Glas-Anheben unterbricht den Kontakt unter dem Rand',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Sockel -->
          <rect x="100" y="220" width="400" height="60" fill="#5a3a14" stroke="#3d2810" stroke-width="2"/>
          <rect x="80" y="240" width="440" height="40" fill="#7c4a1c"/>
          <!-- Kontaktmatte -->
          <g id="mat">
            <rect x="100" y="216" width="400" height="6" fill="#22c55e" stroke="#0f172a" stroke-width="0.5"/>
            <text x="300" y="212" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="700">Kontaktmatte (geschlossen)</text>
          </g>
          <!-- Hubglas -->
          <g id="glass">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="0 0; 0 0; 0 -120; 0 -120; 0 0"
                keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
              <rect x="120" y="80" width="360" height="140" fill="rgba(56,189,248,.2)" stroke="#38bdf8" stroke-width="3"/>
              <text x="300" y="160" text-anchor="middle" font-size="18" fill="#0ea5e9" font-family="system-ui" font-weight="800" opacity=".8">HUBGLAS-VITRINE</text>
            </g>
          </g>
          <!-- Object inside -->
          <ellipse cx="300" cy="200" rx="50" ry="8" fill="rgba(0,0,0,.3)"/>
          <rect x="270" y="160" width="60" height="40" rx="3" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <!-- Status indicator -->
          <g id="state-ok" opacity="1">
            <rect x="40" y="40" width="180" height="36" rx="4" fill="#22c55e" opacity=".9"/>
            <text x="130" y="64" text-anchor="middle" font-size="12" fill="white" font-family="system-ui" font-weight="700">KONTAKT GESCHLOSSEN ✓</text>
            <animate attributeName="opacity" values="1; 1; 0; 0; 1" keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
          </g>
          <g id="state-alarm" opacity="0">
            <rect x="40" y="40" width="180" height="36" rx="4" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="130" y="64" text-anchor="middle" font-size="12" fill="white" font-family="system-ui" font-weight="800">⚠ HUB ERKANNT</text>
            <animate attributeName="opacity" values="0; 0; 1; 1; 0" keyTimes="0; 0.3; 0.5; 0.8; 1" dur="12s" repeatCount="indefinite"/>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['mat'],            text:'① Unter dem Rand der Hubglas-Vitrine liegt eine Kontaktmatte. Sie wird vom Glas-Gewicht zusammengedrückt.' },
        { t: 3500, h: ['glass'],          text:'② Im Normalzustand: Hubglas auf der Matte → Kontakt geschlossen → Ruhestrom fließt.' },
        { t: 6500, h: [],                 text:'③ Hebt jemand das Glas an, entlastet sich die Matte → Kontakt öffnet → ALARM.' },
        { t: 10000,h: [],                 text:'④ Oft kombiniert mit Magnetkontakt für doppelte Sicherheit. Standard in Museen & Schmuckläden.' },
      ],
      cycle: 13000,
    };

    // ============== LWL-BRUCH ==============
    E['lwl-bruch'] = {
      title: 'Lichtwellenleiter-Bruchmelder',
      intro: 'Laser durch Glasfaser unter Putz · Bruch unterbricht das Signal',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Wand -->
          <rect x="40" y="40" width="520" height="240" fill="#92602a" stroke="#5a3a14" stroke-width="3"/>
          <!-- Glasfaser-Schleifen -->
          <g id="fiber" opacity="0">
            <path d="M60 60 L540 60 L540 95 L60 95 L60 130 L540 130 L540 165 L60 165 L60 200 L540 200 L540 235 L60 235"
              stroke="#a78bfa" stroke-width="2.5" fill="none"/>
            <circle cx="60" cy="60" r="6" fill="#fbbf24"/>
            <circle cx="60" cy="235" r="6" fill="#22d3ee"/>
            <text x="40" y="30" font-size="9" fill="#fbbf24" font-family="system-ui">TX (Laser)</text>
            <text x="40" y="252" font-size="9" fill="#22d3ee" font-family="system-ui">RX (Detektor)</text>
          </g>
          <!-- Laser-Pulse durchlaufen -->
          <g id="pulses" opacity="0">
            <circle cx="60" cy="60" r="5" fill="#fbbf24">
              <animateMotion path="M0 0 L480 0 L480 35 L-480 35 L-480 70 L480 70 L480 105 L-480 105 L-480 140 L480 140 L480 175 L-480 175" dur="3s" repeatCount="indefinite"/>
            </circle>
          </g>
          <!-- Einbrecher schlägt durch Wand -->
          <g id="impact" opacity="0">
            <circle cx="300" cy="160" r="22" fill="#0c0a1a" stroke="#ef4444" stroke-width="3"/>
            <g stroke="#ef4444" stroke-width="2">
              <line x1="240" y1="100" x2="360" y2="220"/>
              <line x1="360" y1="100" x2="240" y2="220"/>
            </g>
            <text x="300" y="92" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Wand-Bruch</text>
          </g>
          <!-- Fiber broken -->
          <g id="brk" opacity="0">
            <line x1="280" y1="165" x2="320" y2="165" stroke="#ef4444" stroke-width="5"/>
          </g>
          <!-- Signal verloren -->
          <g id="alarm" opacity="0">
            <rect x="40" y="290" width="520" height="28" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="300" y="310" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="800">⚠ LWL-SIGNAL VERLOREN</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: [],               text:'① Eine Wand sieht völlig normal aus — kein Sensor sichtbar.' },
        { t: 3000, h: ['fiber'],        text:'② Unter dem Putz/Tapete ist eine Glasfaser in Schleifen verlegt — Telekom-Wellenlänge 1550 nm.' },
        { t: 6500, h: ['pulses'],       text:'③ Ein Laser sendet permanent Lichtpulse durch die Faser. Ein Photodetektor empfängt sie.' },
        { t: 10000,h: ['impact','brk'], text:'④ Versucht jemand, durch die Wand zu brechen → die Glasfaser bricht.' },
        { t: 13500,h: ['alarm'],        text:'⑤ Lichtsignal weg → SOFORT ALARM. EMV-fest, schwer sabotierbar (Glasfaser leitet keinen Strom).' },
      ],
      cycle: 17000,
    };

    // ============== TÜRGRIFF-SENSOR ==============
    E['tuergriff-sensor'] = {
      title: 'Türgriff-Berührungssensor · Kapazitiv',
      intro: 'Erkennt schon das Berühren des Griffs · Vorwarnung VOR Tür-Öffnung',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tür -->
          <rect x="80" y="30" width="420" height="260" rx="4" fill="#92602a" stroke="#5a3a14" stroke-width="3"/>
          <rect x="100" y="50" width="380" height="220" fill="#a87534"/>
          <!-- Türgriff -->
          <g id="handle">
            <rect x="380" y="155" width="80" height="14" rx="7" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
            <circle cx="380" cy="162" r="14" fill="#cbd5e0" stroke="#475569" stroke-width="2"/>
            <text x="420" y="200" text-anchor="middle" font-size="11" fill="#cbd5e0" font-family="system-ui" font-weight="700">Griff (kapazitiv)</text>
          </g>
          <!-- Field rings around handle -->
          <g id="field" opacity="0" fill="none" stroke="#c084fc" stroke-width="1.5">
            <circle cx="420" cy="162" r="25"><animate attributeName="opacity" values=".2;.7;.2" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="420" cy="162" r="40"><animate attributeName="opacity" values=".2;.7;.2" dur="2s" begin="0.3s" repeatCount="indefinite"/></circle>
            <circle cx="420" cy="162" r="55"><animate attributeName="opacity" values=".2;.7;.2" dur="2s" begin="0.6s" repeatCount="indefinite"/></circle>
          </g>
          <!-- Hand approaching -->
          <g id="hand" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="100 0; 0 0; 100 0" dur="6s" repeatCount="indefinite"/>
              <ellipse cx="540" cy="162" rx="14" ry="20" fill="#fbbf24"/>
              <rect x="480" y="158" width="60" height="10" rx="3" fill="#fbbf24"/>
            </g>
          </g>
          <!-- Capacitance change graph -->
          <g id="cap-graph" opacity="0" transform="translate(80, 290)">
            <text x="200" y="-280" text-anchor="middle" font-size="11" fill="#c084fc" font-family="system-ui" font-weight="700">Kapazität ändert sich messbar</text>
          </g>
          <!-- Alarm -->
          <g id="warn" opacity="0">
            <rect x="80" y="30" width="180" height="36" rx="4" fill="#fbbf24">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="170" y="54" text-anchor="middle" font-size="13" fill="#0b1424" font-family="system-ui" font-weight="800">⚠ BERÜHRUNG</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['handle'],          text:'① Im Türgriff ist eine kapazitive Elektrode integriert — von außen unsichtbar.' },
        { t: 3500, h: ['field'],           text:'② Die Elektrode erzeugt ein elektrostatisches Feld direkt am Griff.' },
        { t: 7000, h: ['hand'],            text:'③ Sobald eine Hand sich nähert / den Griff berührt, ändert sich die Kapazität.' },
        { t: 11000,h: ['cap-graph','warn'],text:'④ Auswertung erkennt Δ-Kapazität → VORWARNUNG noch BEVOR die Tür gedrückt wird!' },
      ],
      cycle: 14000,
    };

    // ============== HALL-SENSOR ==============
    E['hall-sensor'] = {
      title: 'Hall-Effekt-Sensor · Werkzeug-Detektor',
      intro: 'Misst Magnetfeld-Verzerrung durch Metallwerkzeuge in der Nähe',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Tresor -->
          <rect x="60" y="60" width="240" height="200" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
          <rect x="80" y="80" width="200" height="160" fill="#0b1424"/>
          <text x="180" y="170" text-anchor="middle" font-size="22" font-weight="800" fill="#94a3b8" font-family="system-ui">TRESOR</text>
          <!-- Hall sensor inside -->
          <g id="hall">
            <rect x="170" y="60" width="20" height="14" rx="2" fill="#22c55e" stroke="#0f172a"/>
            <circle cx="180" cy="67" r="3" fill="white"/>
            <text x="180" y="55" text-anchor="middle" font-size="8" fill="#22c55e" font-family="system-ui" font-weight="700">HALL</text>
          </g>
          <!-- Earth magnetic field lines (normal) -->
          <g id="field-normal" opacity="0" stroke="#22c55e" stroke-width="1" fill="none">
            <path d="M0 100 L600 100" stroke-dasharray="6 4"/>
            <path d="M0 150 L600 150" stroke-dasharray="6 4"/>
            <path d="M0 200 L600 200" stroke-dasharray="6 4"/>
            <text x="500" y="92" font-size="10" fill="#22c55e" font-family="system-ui">Erdmagnetfeld</text>
          </g>
          <!-- Tool (hammer/crowbar) approaching -->
          <g id="tool" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; -200 0; 0 0" dur="5s" repeatCount="indefinite"/>
              <rect x="450" y="120" width="100" height="20" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
              <rect x="510" y="100" width="40" height="60" fill="#475569"/>
              <text x="500" y="92" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui" font-weight="700">Stahl-Werkzeug</text>
            </g>
          </g>
          <!-- Field distortion -->
          <g id="distort" opacity="0">
            <path d="M0 100 Q300 70 600 100" stroke="#ef4444" stroke-width="2" fill="none"/>
            <path d="M0 150 Q300 120 600 150" stroke="#ef4444" stroke-width="2" fill="none"/>
            <text x="500" y="60" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Feld verzerrt!</text>
          </g>
          <!-- Hall voltage signal -->
          <g id="signal" opacity="0" transform="translate(60, 270)">
            <rect x="0" y="0" width="500" height="40" rx="4" fill="#0b1424" stroke="#ef4444" stroke-width="2"/>
            <text x="250" y="14" text-anchor="middle" font-size="9" fill="#ef4444" font-family="monospace" font-weight="700">HALL-SPANNUNG</text>
            <path d="M5 28 L100 28 L120 18 L140 28 L240 28 L260 14 L280 28 L380 28 L400 22 L420 28 L495 28"
              stroke="#ef4444" stroke-width="2" fill="none"/>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['hall'],             text:'① Ein Hall-Sensor sitzt im Tresor-Innern. Er misst kontinuierlich die Stärke des umgebenden Magnetfelds.' },
        { t: 3500, h: ['field-normal'],     text:'② Normalfall: Erdmagnetfeld ist konstant und schwach (~50 µT). Hall-Spannung stabil.' },
        { t: 7000, h: ['tool','distort'],   text:'③ Annäherung eines Stahl-Werkzeugs (Hammer, Hebeleisen, Säge) verzerrt das Feld lokal.' },
        { t: 11000,h: ['signal'],           text:'④ Hall-Sensor registriert die Feld-Änderung als Spannungs-Signal — Werkzeug-Annäherung erkannt → VORWARNUNG.' },
      ],
      cycle: 14000,
    };

    // ============== WANDUNGSMELDER ==============
    E['wandungsmelder'] = {
      title: 'Wandungsmelder · Tresor-Stahlbeton',
      intro: 'Drahtgitter in der Wand · Durchbruch unmöglich unentdeckt',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Cross-section of wall -->
          <rect x="60" y="40" width="480" height="240" fill="#475569" stroke="#1e293b" stroke-width="3"/>
          <!-- Concrete texture -->
          <g fill="#3a4858" opacity=".6">
            ${Array.from({length:30}).map(()=>`<circle cx="${80+Math.random()*440}" cy="${60+Math.random()*200}" r="${2+Math.random()*4}"/>`).join('')}
          </g>
          <text x="300" y="30" text-anchor="middle" font-size="11" fill="#94a3b8" font-family="system-ui" font-weight="700">STAHLBETON-WAND (Querschnitt)</text>
          <!-- Mesh embedded -->
          <g id="mesh" opacity="0" stroke="#fbbf24" stroke-width="1.5" fill="none">
            ${Array.from({length:14}).map((_,i)=>`<line x1="${70+i*34}" y1="50" x2="${70+i*34}" y2="270"/>`).join('')}
            ${Array.from({length:8}).map((_,i)=>`<line x1="60" y1="${60+i*30}" x2="540" y2="${60+i*30}"/>`).join('')}
            <text x="300" y="305" text-anchor="middle" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">Eingegossenes Drahtgitter</text>
          </g>
          <!-- Drill -->
          <g id="drill" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="-150 0; 50 0; -150 0" dur="4s" repeatCount="indefinite"/>
              <rect x="0" y="150" width="80" height="20" fill="#fbbf24"/>
              <rect x="80" y="157" width="80" height="6" fill="#94a3b8"/>
              <circle cx="170" cy="160" r="5" fill="#ef4444"><animate attributeName="r" values="3;7;3" dur="0.3s" repeatCount="indefinite"/></circle>
            </g>
          </g>
          <!-- Wire breaks -->
          <g id="breaks" opacity="0">
            <line x1="190" y1="155" x2="220" y2="170" stroke="#ef4444" stroke-width="5"/>
            <line x1="220" y1="155" x2="190" y2="170" stroke="#ef4444" stroke-width="5"/>
          </g>
          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="350" y="50" width="180" height="38" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="440" y="74" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ DURCHBRUCH</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: [],          text:'① Spezial-Tresorwand aus Stahlbeton (oft 30 cm dick).' },
        { t: 3500, h: ['mesh'],    text:'② Beim Bau wird ein engmaschiges Drahtgitter (1-3 cm Raster) MIT EINGEGOSSEN. Ruhestrom fließt.' },
        { t: 7000, h: ['drill'],   text:'③ Egal wo ein Einbrecher zu bohren oder zu fräsen versucht: er trifft auf das Gitter.' },
        { t: 11000,h: ['breaks','alarm'], text:'④ Mindestens ein Draht wird durchtrennt → Stromkreis-Unterbrechung → SOFORT-ALARM.' },
      ],
      cycle: 14500,
    };

    // ============== INERTIALER SENSOR ==============
    E['inertialer-sensor'] = {
      title: 'Inertialsensor (MEMS-Beschleunigung)',
      intro: '3-Achsen Mikro-Beschleunigung erkennt jede Bewegung',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <!-- Geldautomat -->
          <g id="atm">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="0 0; 0 0; 0 -12; 0 0"
                keyTimes="0; 0.4; 0.5; 0.55" additive="sum" dur="8s" repeatCount="indefinite"/>
              <animateTransform attributeName="transform" type="rotate"
                values="0 200 220; 0 200 220; 8 200 220; 0 200 220"
                keyTimes="0; 0.4; 0.5; 0.55" additive="sum" dur="8s" repeatCount="indefinite"/>
              <rect x="120" y="60" width="160" height="240" rx="6" fill="#475569" stroke="#0f172a" stroke-width="3"/>
              <rect x="135" y="75" width="130" height="80" fill="#0c0a1a"/>
              <text x="200" y="120" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700">GELDAUTOMAT</text>
              <rect x="145" y="170" width="110" height="100" fill="#1e293b"/>
              <!-- Sensor -->
              <g id="mems">
                <rect x="180" y="180" width="40" height="20" rx="2" fill="#22c55e" stroke="#0f172a"/>
                <text x="200" y="194" text-anchor="middle" font-size="8" fill="white" font-weight="800">MEMS</text>
              </g>
            </g>
          </g>
          <!-- Hammer/Attacker -->
          <g id="hammer" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-30 380 180; 30 380 180; -30 380 180"
                dur="1s" repeatCount="indefinite"/>
              <rect x="340" y="170" width="80" height="20" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
              <rect x="395" y="150" width="25" height="60" fill="#475569"/>
            </g>
            <text x="400" y="130" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700">Angriff!</text>
          </g>
          <!-- 3-axis accelerometer display -->
          <g id="display" opacity="0" transform="translate(330, 240)">
            <rect x="0" y="0" width="240" height="70" rx="6" fill="#0b1424" stroke="#22d3ee" stroke-width="2"/>
            <text x="120" y="14" text-anchor="middle" font-size="10" fill="#22d3ee" font-family="monospace" font-weight="700">3-ACHSEN-BESCHLEUNIGUNG</text>
            <text x="20" y="36" font-size="11" fill="#ef4444" font-family="monospace">X: ±15 m/s² 🔴</text>
            <text x="20" y="52" font-size="11" fill="#fbbf24" font-family="monospace">Y: ±8 m/s²  🟡</text>
            <text x="120" y="36" font-size="11" fill="#ef4444" font-family="monospace">Z: ±12 m/s² 🔴</text>
            <text x="120" y="52" font-size="11" fill="#ef4444" font-family="monospace">→ ANGRIFF</text>
          </g>
          <!-- Alarm -->
          <g id="alarm" opacity="0">
            <rect x="330" y="60" width="240" height="38" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <text x="450" y="84" text-anchor="middle" font-size="14" fill="white" font-family="system-ui" font-weight="800">⚠ GELDAUTOMAT-ANGRIFF</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['atm','mems'],     text:'① Im Geldautomat / Tresor / Kunst-Objekt sitzt ein winziger MEMS-Beschleunigungssensor (~5×5 mm).' },
        { t: 3500, h: [],                 text:'② Ruhezustand: alle 3 Achsen messen nur die Erdbeschleunigung (1 g = 9,81 m/s²).' },
        { t: 6500, h: ['hammer','display'], text:'③ Bei Angriff (Hammer, Stoßen, Anheben) treten Beschleunigungen >5 m/s² auf – das ist nicht normaler Bedien-Vibrationen.' },
        { t: 10500,h: ['alarm'],          text:'④ KI-Algorithmus unterscheidet zwischen normaler Bedienung und Angriff → ALARM bei verdächtigem Muster.' },
      ],
      cycle: 14000,
    };
  }
  if (window.EXPL) add(); else document.addEventListener('DOMContentLoaded', add);
})();
