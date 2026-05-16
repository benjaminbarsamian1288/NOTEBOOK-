/* Master-Katalog · zentrales Sortierungs-Drehkreuz für alle Komponenten
   + 4 neue Daten-DBs: Video, Brandschutz, Zutritt, Alarmierung */

window.KATALOG = (() => {
  const { el } = U;

  /* ========================================================================
     SVG-Mini-Builder für die 4 neuen Kategorien
     ======================================================================== */

  const svg = (inner, w = 200, h = 240) => `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>
      <defs><linearGradient id="bgGrad" x2="0" y2="1">
        <stop offset="0" stop-color="#0a0f1a"/><stop offset="1" stop-color="#1e293b"/>
      </linearGradient></defs>
      ${inner}
    </svg>`;

  /* ========================================================================
     VIDEO-DATENBANK (10 Komponenten)
     ======================================================================== */

  const VIDEO_DB = [
    {
      key:'cam-bullet', name:'IP-Bullet-Kamera (Außen)', kat:'Video', typ:'aktiv',
      klasse:'IP67 / 4–8 MP', wzeit:'24/7 Aufzeichnung',
      norm:'ONVIF Profile S/T', preis:'200 — 1.200 €',
      einsatz:'Außenbereich, Eingänge, Parkplätze',
      principle:'Festinstallierte Außenkamera mit Weitwinkel und IR-Nachtsicht. Wetterfest.',
      physik:'1/2.8" oder 1/1.8" CMOS-Sensor (Starlight). H.265+ Codec. IR-LEDs bis 50 m Reichweite. PoE-Versorgung (IEEE 802.3af/at). Smart-Codec für reduzierte Bandbreite.',
      staerken:['Robust, IP67','IR-Nachtsicht','PoE-Versorgung','ONVIF-kompatibel'],
      schwaechen:['Festes Sichtfeld','Bei Zoom-Bedarf PTZ besser','Schmutz auf Linse'],
      angriffe:['Blendgranate','Spray-Lack auf Linse','Kabel-Sabotage (PoE-Switch sichern)'],
      hersteller:['Hikvision','Dahua','Axis Communications','Bosch','Hanwha (Samsung)','Mobotix'],
      svg: svg(`
        <rect x="40" y="100" width="120" height="50" rx="25" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <circle cx="55" cy="125" r="18" fill="#0c0a1a" stroke="#475569" stroke-width="2"/>
        <circle cx="55" cy="125" r="12" fill="#1e293b"/>
        <circle cx="55" cy="125" r="5" fill="#22d3ee"/>
        ${Array.from({length: 8}, (_,i) => {
          const a = i * Math.PI / 4;
          return `<circle cx="${55 + Math.cos(a) * 9}" cy="${125 + Math.sin(a) * 9}" r="1.5" fill="#dc2626"/>`;
        }).join('')}
        <rect x="100" y="155" width="60" height="20" fill="#0f172a" stroke="#475569"/>
        <text x="130" y="168" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="700">PoE+ IP67</text>
        <circle cx="155" cy="115" r="3" fill="#ef4444"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
      `),
    },
    {
      key:'cam-dome', name:'IP-Dome-Kamera (Innen/Außen)', kat:'Video', typ:'aktiv',
      klasse:'IK10 / 4–8 MP', wzeit:'24/7 Aufzeichnung',
      norm:'ONVIF Profile S/T', preis:'250 — 1.500 €',
      einsatz:'Eingänge, Lobby, Verkaufsräume, Korridore',
      principle:'Halbkugel-Kamera mit Vandalismusschutz (IK10). Diskreter Look, schwer zu fokussieren.',
      physik:'Polycarbonat-Kuppel (zerbruchsicher). Variable Brennweite 2.8 — 12 mm motorisch. Smart-IR-LEDs. 12V DC oder PoE.',
      staerken:['Diskret','Vandalismus-resistent','360°-Drehbar manuell beim Setup'],
      schwaechen:['Eingeschränktes Sichtfeld','Schmutz an Kuppel','Reflektionen bei Sonne'],
      angriffe:['Spray, schwer abzudecken wegen Kuppel','PoE-Kabel'],
      hersteller:['Hikvision','Dahua','Axis','Bosch','Hanwha','Mobotix','Avigilon'],
      svg: svg(`
        <circle cx="100" cy="80" r="6" fill="#475569"/>
        <line x1="100" y1="86" x2="100" y2="105" stroke="#475569" stroke-width="2"/>
        <path d="M50 105 Q100 80 150 105 L150 130 L50 130 Z" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <ellipse cx="100" cy="115" rx="40" ry="22" fill="#0a0f1a" stroke="#475569"/>
        <circle cx="100" cy="118" r="14" fill="#0c0a1a"/>
        <circle cx="100" cy="118" r="9" fill="#1e293b"/>
        <circle cx="100" cy="118" r="3" fill="#22d3ee"/>
        <rect x="90" y="155" width="20" height="6" fill="#22d3ee" opacity=".6"/>
        <text x="100" y="195" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="700">IK10 · IP66</text>
        <circle cx="125" cy="108" r="2.5" fill="#dc2626"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
      `),
    },
    {
      key:'cam-ptz', name:'PTZ-Dome (Pan/Tilt/Zoom, 25× Zoom)', kat:'Video', typ:'aktiv',
      klasse:'IP66 / 8 MP / 25×', wzeit:'24/7 + Auto-Track',
      norm:'ONVIF Profile S/T', preis:'1.500 — 6.000 €',
      einsatz:'Großareale, KWS Video-Tower, Stadien, KRITIS',
      principle:'Motorisierte PTZ-Kamera. Schwenkt 360°, neigt 90°, zoomt optisch 25×. Auto-Tracking.',
      physik:'Vollmotorischer Kopf. Brennweite 4.8—120 mm (25× optisch). Sensor 8 MP. Schwenk 240°/Sek. 256 Presets. KI-Edge-Processing. Laser-IR 100 m.',
      staerken:['Großer Erfassungsbereich','Auto-Tracking','Fern-bedienbar','Identifizieren bis 200 m'],
      schwaechen:['Hoher Preis','Mechanik wartungsintensiv','Punkt-Fokus, Lücken möglich'],
      angriffe:['Trick: Ablenkung in andere Richtung','Schwenker-Sabotage','Strom-Sabotage'],
      hersteller:['Hikvision','Dahua','Axis Q-Serie','Bosch MIC','Hanwha Wisenet'],
      svg: svg(`
        <line x1="100" y1="190" x2="100" y2="40" stroke="#475569" stroke-width="3"/>
        <rect x="60" y="50" width="80" height="50" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <ellipse cx="100" cy="95" rx="35" ry="22" fill="#0a0f1a" stroke="#475569"/>
        <circle cx="100" cy="98" r="14" fill="#0c0a1a"/>
        <circle cx="100" cy="98" r="6" fill="#22d3ee"/>
        <path d="M100 98 L 70 130 L 130 130 Z" fill="rgba(34,211,238,.18)"/>
        <text x="100" y="220" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="900">25× · IR 100m</text>
        <path d="M65 78 Q60 95 65 112" fill="none" stroke="#22d3ee" stroke-width="2" stroke-dasharray="2 2"><animateTransform attributeName="transform" type="rotate" values="0 100 95;5 100 95;0 100 95;-5 100 95;0 100 95" dur="4s" repeatCount="indefinite"/></path>
      `),
    },
    {
      key:'cam-thermal', name:'Wärmebildkamera (Thermal)', kat:'Video', typ:'passiv',
      klasse:'160×120 — 640×512 px', wzeit:'24/7 Detektion',
      norm:'ONVIF / EN 50132', preis:'2.500 — 25.000 €',
      einsatz:'Perimeter Hochsicherheit, Nacht-Detektion, KRITIS, JVA',
      principle:'Misst Wärmestrahlung (8—14 µm Wellenlänge). Erkennt Menschen unabhängig von Licht.',
      physik:'Mikrobolometer-Sensor (Vanadiumoxid). Detektiert Temperaturunterschiede von 0,05 K. Auflösung typisch 384×288, professionell 640×512 oder 1280×1024. Sieht durch Rauch/Nebel begrenzt.',
      staerken:['Funktioniert ohne Licht','Nicht zu täuschen mit Camouflage','Reichweite 500+ m'],
      schwaechen:['Sehr teuer','Geringe Auflösung vs. optisch','Heißer Sommer reduziert Kontrast'],
      angriffe:['Kühlanzug (sehr aufwendig)','Hinter dicker Mauer/Glas (IR-undurchlässig)'],
      hersteller:['FLIR (Teledyne)','Axis Communications','Dahua','Hikvision DeepInView','Bosch'],
      svg: svg(`
        <rect x="40" y="80" width="120" height="80" rx="8" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
        <rect x="50" y="90" width="100" height="60" rx="3" fill="#7f1d1d"/>
        <ellipse cx="100" cy="120" rx="30" ry="18" fill="#fbbf24"/>
        <ellipse cx="100" cy="120" rx="20" ry="12" fill="#ef4444"/>
        <ellipse cx="100" cy="120" rx="10" ry="6" fill="#fff"/>
        <text x="100" y="180" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="800">THERMAL · 8-14µm</text>
        <text x="100" y="200" text-anchor="middle" font-size="8" fill="#fbbf24">Auflösung 0,05K</text>
      `),
    },
    {
      key:'cam-fisheye', name:'360°-Fisheye-Kamera', kat:'Video', typ:'aktiv',
      klasse:'12 MP / 360°', wzeit:'24/7',
      norm:'ONVIF', preis:'500 — 2.500 €',
      einsatz:'Lobby, Verkaufsraum, Räume mit kompletter Übersicht',
      principle:'Hemisphärische Linse mit 360°-Sicht. Software-Entzerrung in Quadranten oder Panorama.',
      physik:'Fischaugen-Objektiv (180° Sichtwinkel, hemisphärisch). 12—20 MP Sensor für ausreichende Detail bei Entzerrung. Onboard-Software für Bereichs-Dewarping.',
      staerken:['Eine Kamera ersetzt 4','Komplette Raum-Übersicht','Spätere Aufzeichnungs-Auswertung mit Pan/Tilt im Nachhinein'],
      schwaechen:['Verzerrung an Rändern','Niedrige Detail-Auflösung pro Bereich','Decken-Montage notwendig'],
      angriffe:['Schmutzfleck verdeckt großen Bereich','Schwer mit IR auszuleuchten'],
      hersteller:['Mobotix','Axis','Hikvision','Vivotek','Bosch'],
      svg: svg(`
        <circle cx="100" cy="120" r="55" fill="#0c0a1a" stroke="#22d3ee" stroke-width="2"/>
        <circle cx="100" cy="120" r="50" fill="rgba(34,211,238,.08)"/>
        <circle cx="100" cy="120" r="35" fill="#1e293b"/>
        <circle cx="100" cy="120" r="20" fill="#22d3ee" opacity=".3"/>
        <circle cx="100" cy="120" r="8" fill="#22d3ee"/>
        <path d="M100 120 L 100 65 M 100 120 L 155 120 M 100 120 L 100 175 M 100 120 L 45 120" stroke="#22d3ee" stroke-width=".5" stroke-dasharray="2 2"/>
        <text x="100" y="200" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">360°</text>
      `),
    },
    {
      key:'cam-anpr', name:'ANPR · Kennzeichen-Erkennung', kat:'Video', typ:'aktiv',
      klasse:'4 MP / IR-Spezial', wzeit:'< 1 Sek Erkennung',
      norm:'EN 50132-7', preis:'1.500 — 6.000 €',
      einsatz:'Tor-Einfahrt, Parkhaus, Schranken, KRITIS-Zufahrt',
      principle:'Spezial-Kamera mit IR-Beleuchtung. KI liest Nummernschild → Datenbank-Abgleich.',
      physik:'CMOS-Sensor mit IR-Cut-Filter. Spezial-IR-LEDs (940 nm, für Reflektor-Schilder). Brennweite 5—50 mm. Verschlusszeit 1/1000 — 1/4000 (Bewegungsbild scharf). KI klassifiziert Schild in &lt; 1 s.',
      staerken:['Vollautomatisch','Whitelist/Blacklist','Mit Schranken-/Tor-Steuerung','Nachweis-tauglich'],
      schwaechen:['Nicht-EU-Schilder problematisch','Dreckiges Schild = Fehler','Datenschutz-Pflicht'],
      angriffe:['Schild abdecken/wechseln','Nummerntäuschung mit Folie'],
      hersteller:['Hikvision','Dahua','Axis','VaxAlarm','Genetec','Vaxtor'],
      svg: svg(`
        <rect x="40" y="70" width="120" height="50" rx="8" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <circle cx="65" cy="95" r="15" fill="#0c0a1a" stroke="#dc2626"/>
        <circle cx="65" cy="95" r="6" fill="#dc2626"/>
        <text x="120" y="100" font-size="11" fill="#22d3ee" font-weight="800">ANPR</text>
        <rect x="60" y="150" width="80" height="30" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
        <text x="100" y="170" text-anchor="middle" font-size="14" fill="#0b1424" font-family="monospace" font-weight="900">B-XK 1288</text>
        <line x1="40" y1="120" x2="60" y2="150" stroke="#22d3ee" stroke-dasharray="3 2"/>
        <line x1="160" y1="120" x2="140" y2="150" stroke="#22d3ee" stroke-dasharray="3 2"/>
        <text x="100" y="200" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="700">✓ WHITELIST</text>
      `),
    },
    {
      key:'cam-ai-edge', name:'KI-Edge-Kamera (deep learning onboard)', kat:'Video', typ:'aktiv',
      klasse:'8 MP / NPU 2-4 TOPS', wzeit:'< 50 ms Inferenz',
      norm:'ONVIF / Custom AI', preis:'600 — 3.000 €',
      einsatz:'Echtzeit-Detektion: Person/Fahrzeug/Maske/Sturz',
      principle:'Kamera mit dedizierter NPU (Neural Processing Unit) im SoC. Inferenz läuft on-device.',
      physik:'SoC mit NPU (z. B. Ambarella CV5, Hisilicon 3559). Modelle: YOLOv5/8, MobileNet. Inferenz auf vollem Bild &lt; 50 ms. Klassen: Person, PKW, LKW, Fahrrad, Tier, Paket, Sturz, Maske.',
      staerken:['Keine Cloud nötig','Echtzeit-Reaktion','Geringe Bandbreite (nur Metadata)','Datenschutz-freundlich'],
      schwaechen:['Modelle nicht so präzise wie Cloud','SoC-Hitze begrenzt Dauerleistung','Modell-Update nötig'],
      angriffe:['Adversarial Patches','Maske/Tarnung','Ungewöhnliche Posen'],
      hersteller:['Hikvision DeepInView','Dahua WizMind','Axis ARTPEC-8','Bosch IVA Pro','Hanwha P-Series'],
      svg: svg(`
        <rect x="50" y="80" width="100" height="70" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        <circle cx="100" cy="115" r="20" fill="#0c0a1a" stroke="#a855f7"/>
        <circle cx="100" cy="115" r="6" fill="#a855f7"/>
        <rect x="75" y="55" width="50" height="22" rx="3" fill="#0f172a" stroke="#22c55e"/>
        <text x="100" y="70" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="800">PERSON 97%</text>
        <rect x="40" y="170" width="120" height="30" rx="4" fill="#0a0f1a" stroke="#475569"/>
        <text x="100" y="185" text-anchor="middle" font-size="9" fill="#a855f7" font-weight="700">NPU · YOLO v8</text>
        <text x="100" y="197" text-anchor="middle" font-size="8" fill="#94a3b8">2 TOPS · &lt; 50ms</text>
      `),
    },
    {
      key:'nvr', name:'NVR · Netzwerk-Video-Rekorder', kat:'Video', typ:'aktiv',
      klasse:'16—64 Channel / 2—24 TB', wzeit:'Speicher 7—90 Tage',
      norm:'ONVIF / RAID', preis:'500 — 5.000 €',
      einsatz:'Zentrale Aufzeichnung & Verwaltung aller IP-Kameras',
      principle:'Industrie-PC mit Spezial-Software. Empfängt RTSP-Streams, archiviert, ermöglicht Wiedergabe.',
      physik:'CPU + GPU. HDDs (WD Purple, Seagate Skyhawk - speziell für 24/7). RAID 1/5/6/10 Optionen. H.265+ Hardware-Decoder. Web-Interface oder VMS-Client.',
      staerken:['Zentralisierte Aufzeichnung','Such-Funktionen','Mit IVS-Trigger','RAID-Redundanz'],
      schwaechen:['SPoF (Single Point of Failure) ohne RAID','Storage füllt schnell','Cyber-Risk wenn online'],
      angriffe:['Physisches Mitnehmen','Cyber-Angriff (Online-Zugriff)','SD-Backup empfohlen'],
      hersteller:['Hikvision','Dahua','Axis','Synology Surveillance','Milestone XProtect','Genetec'],
      svg: svg(`
        <rect x="30" y="80" width="140" height="100" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <rect x="40" y="95" width="120" height="30" fill="#0a0f1a" stroke="#475569"/>
        ${[1,2,3,4].map(i => `<rect x="${40 + i*22}" y="100" width="14" height="20" fill="#475569"/>`).join('')}
        <circle cx="50" cy="140" r="3" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite"/></circle>
        <text x="100" y="143" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">REC</text>
        <text x="100" y="160" text-anchor="middle" font-size="9" fill="#94a3b8">16 CH · 4× 4TB RAID5</text>
        <text x="100" y="175" text-anchor="middle" font-size="8" fill="#22c55e">7 Tage Retention</text>
      `),
    },
    {
      key:'vms', name:'VMS · Video-Management-System', kat:'Video', typ:'aktiv',
      klasse:'Enterprise Software', wzeit:'Echtzeit + Forensik',
      norm:'ONVIF / IEC 62676', preis:'500 — 50.000 € + Lizenzen',
      einsatz:'Multi-Standort, Großanlagen, Banken-/KRITIS-Leitstand',
      principle:'Software-Plattform für hunderte Kameras. Live-View, Aufzeichnung, KI-Analytics, Mehrbenutzer.',
      physik:'Server-basierte Plattform (Windows/Linux). Modulare Architektur: Recording-Server, Management-Server, Analytics-Server. Mobile + Desktop Clients. Smart Search durch KI.',
      staerken:['Skalierbar (100s Kameras)','Multi-Standort','Smart Search & Bookmarks','API für Integration'],
      schwaechen:['Hohe Lizenzkosten','Komplexe Administration','IT-Wartung pflicht'],
      angriffe:['Cyber-Angriff über Management-Server','Berechtigungs-Diebstahl'],
      hersteller:['Milestone XProtect','Genetec Security Center','Avigilon ACC','Hanwha Wave','Bosch BVMS'],
      svg: svg(`
        <rect x="20" y="60" width="160" height="120" rx="6" fill="#0a0f1a" stroke="#22d3ee" stroke-width="2"/>
        <rect x="28" y="68" width="68" height="50" fill="#1e293b" stroke="#475569"/>
        <rect x="104" y="68" width="68" height="50" fill="#1e293b" stroke="#475569"/>
        <rect x="28" y="125" width="68" height="50" fill="#1e293b" stroke="#475569"/>
        <rect x="104" y="125" width="68" height="50" fill="#1e293b" stroke="#475569"/>
        ${[28,104,28,104].map((x,i) => {
          const y = i < 2 ? 68 : 125;
          return `<text x="${x+34}" y="${y+10}" text-anchor="middle" font-size="6" fill="#22d3ee" font-family="monospace">CAM 0${i+1}</text>
                  <circle cx="${x+34}" cy="${y+30}" r="3" fill="#fbbf24"/>`;
        }).join('')}
        <text x="100" y="200" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">VMS · Multi-Cam</text>
      `),
    },
    {
      key:'lautsprecher', name:'IP-Lautsprecher (120 dB, Sprachdurchsage)', kat:'Video', typ:'aktiv',
      klasse:'120 dB @ 1 m', wzeit:'Sofortige Durchsage',
      norm:'IP66 / IEC 60268', preis:'400 — 1.500 €',
      einsatz:'Täteransprache, Räumungs-Ansagen, Hofdurchsage',
      principle:'Wetterfester Lautsprecher mit Netzwerk-Anbindung. Operator spricht live oder vordefinierte Audio.',
      physik:'Druckkammer-Treiber oder Konus-Lautsprecher. Klasse-D-Verstärker. PoE+ oder 230V. Mit Mikrofon für Halb-Duplex (Operator hört auch). H.264-Stream für Audio im VMS.',
      staerken:['Sofortige Abschreckung','Halb-Duplex-Kommunikation','Mit Kamera koppelbar','120 dB sehr laut'],
      schwaechen:['Hörweite begrenzt durch Lärm','Lärmschutz-Auflagen','Wartung Lautsprecher-Membrane'],
      angriffe:['Mit Kappe/Stoff dämpfen','Kabel sabotieren','PoE-Power abschalten'],
      hersteller:['Axis (C-Serie)','Bosch','TOA','BiAmp','Sennheiser SoundComfort'],
      svg: svg(`
        <rect x="60" y="80" width="80" height="80" rx="40" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
        <circle cx="100" cy="120" r="25" fill="#0c0a1a"/>
        <circle cx="100" cy="120" r="18" fill="#7f1d1d"/>
        <circle cx="100" cy="120" r="10" fill="#dc2626"/>
        <path d="M150 100 q15 20 0 40" stroke="#dc2626" stroke-width="2" fill="none">
          <animate attributeName="opacity" values="0;1;0" dur=".6s" repeatCount="indefinite"/>
        </path>
        <path d="M160 90 q25 30 0 60" stroke="#dc2626" stroke-width="2" fill="none">
          <animate attributeName="opacity" values="0;1;0" dur=".6s" begin=".2s" repeatCount="indefinite"/>
        </path>
        <text x="100" y="190" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="900">120 dB</text>
        <text x="100" y="205" text-anchor="middle" font-size="8" fill="#94a3b8">IP66 · PoE+</text>
      `),
    },
  ];

  /* ========================================================================
     BRANDSCHUTZ-DATENBANK (12 Komponenten)
     ======================================================================== */

  const BRAND_DB = [
    {
      key:'rauchmelder-optisch', name:'Optischer Rauchmelder (Streulicht)', kat:'Brandschutz', typ:'passiv',
      klasse:'EN 14604 (Heim) / EN 54-7 (BMA)', wzeit:'30—120 s Detektion',
      norm:'EN 14604 / EN 54-7', preis:'15 — 150 €',
      einsatz:'Wohnung, Büro, BMA · Standard-Heim-Rauchmelder',
      principle:'Streulicht-Prinzip: Lichtstrahl in Mess-Kammer. Bei Rauch streut Licht zum Sensor.',
      physik:'LED + Foto-Sensor in dunkler Kammer (Labyrinth gegen Insekten). Bei Raucheintritt streuen Partikel das Licht. Algorithmus erkennt Anstieg über Zeit.',
      staerken:['Standard für Wohnung (Pflicht in DE!)','Schmutz-resistent','Lange Lebensdauer (10 Jahre)','Wartungsarm'],
      schwaechen:['Reagiert träge auf flammendes Feuer','Falsch-Alarm bei Kochdunst, Sprühnebel','Reinigung pflicht (Staub)'],
      angriffe:['—'],
      hersteller:['Hekatron','Ei Electronics','Gira','Busch-Jaeger','ABUS','Bosch'],
      svg: svg(`
        <circle cx="100" cy="100" r="55" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <circle cx="100" cy="100" r="42" fill="#0a0f1a"/>
        <circle cx="100" cy="100" r="18" fill="#1e293b"/>
        <circle cx="100" cy="100" r="3" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="3s" repeatCount="indefinite"/></circle>
        ${Array.from({length: 12}, (_,i) => {
          const a = i * Math.PI / 6;
          return `<line x1="${100 + Math.cos(a) * 32}" y1="${100 + Math.sin(a) * 32}" x2="${100 + Math.cos(a) * 40}" y2="${100 + Math.sin(a) * 40}" stroke="#475569"/>`;
        }).join('')}
        <text x="100" y="190" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="800">EN 14604</text>
      `),
    },
    {
      key:'rauchmelder-co', name:'CO-Melder (Kohlenmonoxid)', kat:'Brandschutz', typ:'passiv',
      klasse:'EN 50291', wzeit:'30—180 s je Konzentration',
      norm:'EN 50291', preis:'30 — 200 €',
      einsatz:'Schlafzimmer mit Heizung, Garage, Heizungsraum, Boiler-Raum',
      principle:'Elektrochemische Zelle reagiert auf CO-Moleküle. Alarmiert bei 30—300 ppm.',
      physik:'Elektrochemischer Sensor (Säure-Elektrolyt). CO oxidiert an Elektrode, erzeugt Strom proportional zur Konzentration. Schwellen: 30 ppm/120 min, 50 ppm/60—90 min, 100 ppm/10—40 min, 300 ppm sofort.',
      staerken:['Schützt vor unsichtbarer Gefahr','Lange Lebensdauer (7—10 Jahre)','Pflicht in Neubauten mit Gas-Heizung'],
      schwaechen:['Reagiert nicht auf Rauch','Sensor altert','Wartung pflicht'],
      angriffe:['—'],
      hersteller:['Ei Electronics','Hekatron','ABUS','First Alert','Honeywell'],
      svg: svg(`
        <circle cx="100" cy="100" r="50" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
        <text x="100" y="95" text-anchor="middle" font-size="22" fill="#fbbf24" font-weight="900">CO</text>
        <text x="100" y="115" text-anchor="middle" font-size="9" fill="#94a3b8">PPM Sensor</text>
        <circle cx="100" cy="135" r="3" fill="#ef4444"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
        <text x="100" y="195" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="800">EN 50291</text>
      `),
    },
    {
      key:'thermo-diff', name:'Thermomelder (Wärmedifferenzial)', kat:'Brandschutz', typ:'passiv',
      klasse:'EN 54-5 Klasse A1—G', wzeit:'Schwell 54—78 °C',
      norm:'EN 54-5', preis:'40 — 200 €',
      einsatz:'Küchen, Werkstätten, Garagen (Bereiche mit normalem Staub/Dunst)',
      principle:'Reagiert auf schnellen Temperaturanstieg ODER absolute Schwellentemperatur.',
      physik:'Zwei NTC-Thermistoren: einer schnell exponiert, einer träge (Referenz). Differenz &gt; 5 K/min → Alarm. Plus statische Schwelle (z. B. 58 °C bei Klasse A1).',
      staerken:['Robust gegen Staub/Dampf','Wenig Fehl-Alarm','Lange Lebensdauer'],
      schwaechen:['Reagiert spät auf Glimmbrände (wenig Wärme)','Nicht für offene Bürobereiche','Wärme breitet sich langsamer aus als Rauch'],
      angriffe:['—'],
      hersteller:['Bosch','Hekatron','Siemens','ESSER (Honeywell)','Apollo'],
      svg: svg(`
        <circle cx="100" cy="100" r="50" fill="#1e293b" stroke="#ea580c" stroke-width="2"/>
        <path d="M85 120 Q85 70 100 70 Q115 70 115 120" fill="none" stroke="#ea580c" stroke-width="3"/>
        <circle cx="100" cy="130" r="8" fill="#ef4444"/>
        <line x1="100" y1="115" x2="100" y2="80" stroke="#ef4444" stroke-width="2"/>
        <text x="100" y="195" text-anchor="middle" font-size="10" fill="#ea580c" font-weight="800">A1 · 58°C</text>
      `),
    },
    {
      key:'flamm-uv-ir', name:'Flammenmelder UV/IR', kat:'Brandschutz', typ:'aktiv',
      klasse:'EN 54-10', wzeit:'&lt; 1 s Detektion',
      norm:'EN 54-10', preis:'500 — 2.500 €',
      einsatz:'Industrie, Petrochemie, Hangars, Sprinkler-Auslöser',
      principle:'Detektiert UV- oder IR-Strahlung offener Flammen. Sehr schnell.',
      physik:'UV-Sensor (200—280 nm) reagiert auf Verbrennungs-UV. IR-Sensor (4,3 µm CO2-Resonanz) auf flackernde Flammen. Kombination minimiert Fehl-Alarme (Schweißen, Sonnenlicht).',
      staerken:['Sub-Sekunden-Detektion','Reichweite 30—60 m','Für große Hallen','Mit Löschanlagen-Auslöser'],
      schwaechen:['Sehr teuer','Reine Glimmbrände werden übersehen','Sicht-Linie nötig'],
      angriffe:['Verdecken der Sensoroptik','Schweißen kann Falschalarm'],
      hersteller:['Honeywell SS-Serie','Det-Tronics','Spectrex','Siemens FlameProTec'],
      svg: svg(`
        <rect x="60" y="60" width="80" height="60" rx="8" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
        <circle cx="80" cy="90" r="10" fill="#0c0a1a" stroke="#a855f7"/>
        <text x="80" y="94" text-anchor="middle" font-size="9" fill="#a855f7" font-weight="800">UV</text>
        <circle cx="120" cy="90" r="10" fill="#0c0a1a" stroke="#ef4444"/>
        <text x="120" y="94" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="800">IR</text>
        <g transform="translate(100, 170)">
          <path d="M-15 -5 Q -10 -25 0 -20 Q 8 -30 12 -10 Q 18 -5 10 5 Q 0 10 -5 0 Z" fill="#ef4444">
            <animate attributeName="fill" values="#ef4444;#fbbf24;#ef4444" dur=".5s" repeatCount="indefinite"/>
          </path>
        </g>
      `),
    },
    {
      key:'asd', name:'ASD · Aspirations-Rauchmelder', kat:'Brandschutz', typ:'aktiv',
      klasse:'EN 54-20 Klasse A/B/C', wzeit:'Frühest-Erkennung',
      norm:'EN 54-20', preis:'2.000 — 15.000 €',
      einsatz:'Server-Räume, Reinräume, Museen, hohe Hallen',
      principle:'Saugt aktiv Raumluft an und analysiert sie auf Rauchpartikel mit hoher Empfindlichkeit.',
      physik:'Lüftermotor saugt durch Rohrnetz (PVC, 25 mm Ø) Raumluft an. Hochempfindlicher Laser- oder Wolkenkammer-Sensor analysiert. Detektiert Brand bis zu 1000-fach früher als Punkt-Melder.',
      staerken:['Frühestmöglicher Brand-Schutz','Schutz wertvoller Ausrüstung','Schwer zu täuschen','Eine Anlage für 200—1500 m²'],
      schwaechen:['Sehr teuer','Komplexe Installation (Rohrnetz)','Hohe Wartungsintensität','Empfindlich auf Staub'],
      angriffe:['Rohrnetz physisch beschädigen'],
      hersteller:['Wagner TITANUS','Securiton SecuriRAS','Honeywell ESSER','Siemens FDA'],
      svg: svg(`
        <rect x="40" y="80" width="120" height="80" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <circle cx="100" cy="120" r="20" fill="#0a0f1a" stroke="#22d3ee"/>
        <text x="100" y="124" text-anchor="middle" font-size="9" fill="#22d3ee" font-weight="800">ASD</text>
        <circle cx="100" cy="120" r="8" fill="#22d3ee" opacity=".4">
          <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite"/>
        </circle>
        ${[40,80,120,160].map(x => `<circle cx="${x}" cy="40" r="3" fill="#94a3b8"/><line x1="${x}" y1="43" x2="${x}" y2="80" stroke="#94a3b8" stroke-width="1.5"/>`).join('')}
        <text x="100" y="195" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">EN 54-20</text>
      `),
    },
    {
      key:'sprinkler-nass', name:'Sprinkler-Anlage (Nass)', kat:'Brandschutz', typ:'passiv',
      klasse:'NFPA 13 / VdS CEA 4001', wzeit:'68—79 °C Glasfass-Schmelz',
      norm:'VdS CEA 4001 / NFPA 13', preis:'40—80 €/m² + Steuerung',
      einsatz:'Industrie, Lager, Verkauf, Hotels (überall Wasser unter Druck)',
      principle:'Sprinkler-Köpfe mit Glasfass-Auslöser. Bei Wärme platzt das Fass → Wasser fließt nur an befallener Stelle.',
      physik:'Glasfass mit Alkohol-/Wasser-Mischung. Bei Schwelltemperatur (rot 68 °C, gelb 79 °C, grün 93 °C) dehnt Flüssigkeit aus und sprengt das Glas → Ventil öffnet sich. Wasserdruck 2—12 bar.',
      staerken:['Lokale Löschung am Brandherd','Bewährt seit 100+ Jahren','Versicherungs-Rabatt deutlich'],
      schwaechen:['Wasserschäden','Nicht für Server-/Daten-Räume','Vereisungs-Schutz nötig'],
      angriffe:['Pumpen-Sabotage','Wasser-Hauptabsperrung'],
      hersteller:['Tyco/Johnson Controls','Viking','Minimax','Pentair','SFFECO'],
      svg: svg(`
        <line x1="0" y1="50" x2="200" y2="50" stroke="#475569" stroke-width="6"/>
        ${[60,100,140].map((x,i) => `
          <line x1="${x}" y1="50" x2="${x}" y2="80" stroke="#94a3b8" stroke-width="3"/>
          <circle cx="${x}" cy="85" r="6" fill="#dc2626"/>
          <circle cx="${x}" cy="90" r="3" fill="#fbbf24"/>
          ${i === 1 ? `${Array.from({length: 6}, (_,j) => {
            const ang = -45 + j * 18;
            return `<line x1="${x}" y1="95" x2="${x + Math.sin(ang*Math.PI/180)*40}" y2="${95 + Math.cos(ang*Math.PI/180)*60}" stroke="#22d3ee" stroke-width="2"/>`;
          }).join('')}` : ''}
        `).join('')}
        <text x="100" y="220" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">VdS CEA 4001</text>
      `),
    },
    {
      key:'sprinkler-trocken', name:'Sprinkler-Anlage (Trocken)', kat:'Brandschutz', typ:'passiv',
      klasse:'NFPA 13 / VdS CEA 4001', wzeit:'+ 30—60 s vs. Nass',
      norm:'VdS / NFPA', preis:'50—100 €/m²',
      einsatz:'Frostgefährdete Bereiche, Tiefgaragen, unbeheizte Hallen',
      principle:'Rohrnetz mit Druckluft gefüllt. Sprinkler öffnet → Druckabfall → Ventil lässt Wasser ein.',
      physik:'Trockenrohrventil (Trocken-/Druckluft-Trennung). Druckluft 2—4 bar. Beim Schmelzen des Sprinklers → Luftaustritt → Druckverlust → Hauptventil öffnet → Wasser durch das Rohr.',
      staerken:['Frostsicher','Schützt unbeheizte Bereiche','Mit Stickstoff-Variante für Datenräume'],
      schwaechen:['Reaktion 30—60 s verzögert','Mehr Wartung','Kondensat-Korrosion'],
      angriffe:['—'],
      hersteller:['Tyco','Viking','Minimax','Pentair'],
      svg: svg(`
        <line x1="0" y1="50" x2="200" y2="50" stroke="#94a3b8" stroke-width="6"/>
        <text x="100" y="40" text-anchor="middle" font-size="10" fill="#94a3b8" font-weight="700">DRUCKLUFT 4 bar</text>
        ${[60,100,140].map(x => `
          <line x1="${x}" y1="50" x2="${x}" y2="80" stroke="#94a3b8" stroke-width="3"/>
          <circle cx="${x}" cy="85" r="6" fill="#fbbf24"/>
          <circle cx="${x}" cy="90" r="3" fill="#fbbf24"/>
        `).join('')}
        <text x="100" y="220" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="800">FROSTSICHER</text>
      `),
    },
    {
      key:'co2-anlage', name:'CO₂-Löschanlage', kat:'Brandschutz', typ:'aktiv',
      klasse:'EN 12094 / VdS', wzeit:'30—60 s Vollflutung',
      norm:'EN 12094 / DIN 14497', preis:'50—120 €/m³',
      einsatz:'Serverräume, Werkstätten, Schaltanlagen, Spritz-Kabinen',
      principle:'CO₂ verdrängt Sauerstoff. Lokale Konzentration &gt; 30 % → keine Verbrennung.',
      physik:'CO₂ unter Druck (50—60 bar) in Stahlflaschen. Auslösung via Branddetektor → Mengen-Berechnung pro Raum (Volumen × 0,7 kg/m³). Vorwarnzeit 20—30 s, dann Flutung in 60 s.',
      staerken:['Keine Rückstände (Server-Räume!)','Schnelle Löschung','Mit Sauerstoff-Verdrängung'],
      schwaechen:['LEBENSGEFAHR für Personen','Vorwarnung pflicht','Türen müssen dicht sein','Erstickung'],
      angriffe:['Manuelle Auslöse-Sperre umgehen'],
      hersteller:['Minimax','Wagner','Tyco/Ansul','Siemens Sinorix','Wormald'],
      svg: svg(`
        <rect x="40" y="50" width="40" height="120" rx="20" fill="#0a0f1a" stroke="#22d3ee" stroke-width="2"/>
        <text x="60" y="115" text-anchor="middle" font-size="18" fill="#22d3ee" font-weight="900">CO₂</text>
        <rect x="100" y="60" width="80" height="100" rx="6" fill="#1e293b" stroke="#22d3ee"/>
        <text x="140" y="90" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">Raum</text>
        ${Array.from({length: 8}, (_,i) => `<circle cx="${110 + (i%4)*15}" cy="${110 + Math.floor(i/4)*15}" r="3" fill="#22d3ee" opacity=".5"><animate attributeName="opacity" values=".2;.8;.2" dur="1.5s" begin="${i*0.1}s" repeatCount="indefinite"/></circle>`).join('')}
        <line x1="80" y1="100" x2="100" y2="120" stroke="#22d3ee" stroke-width="2" stroke-dasharray="3 2"/>
        <text x="100" y="200" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="800">⚠ LEBENSGEFAHR</text>
      `),
    },
    {
      key:'novec1230', name:'Novec 1230 / FM-200 (Saubergas)', kat:'Brandschutz', typ:'aktiv',
      klasse:'NFPA 2001 / EN 15004', wzeit:'10 s Vollflutung',
      norm:'EN 15004 / NFPA 2001', preis:'80—200 €/m³',
      einsatz:'Server-/Daten-Räume, Telekom, Schaltanlagen — wo CO₂ verboten',
      principle:'Fluorketon-Saubergas (Novec 1230) löscht ohne Sauerstoff zu verdrängen. Personen-sicher.',
      physik:'Novec 1230 ist eine Flüssigkeit bei Raumtemperatur, verdampft beim Austritt. Wirkt durch Wärme-Absorption (Hitze-Senke). Konzentration 4—6 %. GWP &lt; 1, ODP = 0.',
      staerken:['Personen-sicher (4—9 % Konzentration ungiftig)','Keine Rückstände','Umweltfreundlich (Novec)'],
      schwaechen:['Sehr teuer','Räume müssen dicht sein','Druckentlastungs-Klappen pflicht'],
      angriffe:['Manuelle Sperre umgehen'],
      hersteller:['3M (Novec)','Chemours (FM-200)','Minimax Nitrum','Wagner FirExting'],
      svg: svg(`
        <rect x="30" y="50" width="40" height="120" rx="20" fill="#0a0f1a" stroke="#22c55e" stroke-width="2"/>
        <text x="50" y="120" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="900">NOVEC</text>
        <rect x="90" y="60" width="90" height="110" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="135" y="85" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="800">SERVER</text>
        ${Array.from({length: 9}, (_,i) => `<rect x="${100 + (i%3)*22}" y="${95 + Math.floor(i/3)*22}" width="18" height="18" fill="#22c55e" opacity=".25"><animate attributeName="opacity" values=".1;.5;.1" dur="2s" begin="${i*0.15}s" repeatCount="indefinite"/></rect>`).join('')}
        <text x="100" y="200" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="800">PERSONEN-SICHER</text>
      `),
    },
    {
      key:'schaum-anlage', name:'Schaum-Löschanlage', kat:'Brandschutz', typ:'passiv',
      klasse:'EN 13565 / NFPA 11', wzeit:'30—120 s Vollabdeckung',
      norm:'EN 13565', preis:'80—200 €/m²',
      einsatz:'Tanklager, Petrochemie, Flughäfen, Heizölkeller',
      principle:'Schaum aus AFFF-Schaummittel + Wasser + Luft. Erstickt brennende Flüssigkeit.',
      physik:'AFFF (Aqueous Film Forming Foam) wird mit Wasser im Schaumzumischer gemischt (1—6 %). Im Schaumstrahlrohr wird Luft eingeschäumt. Schaum kühlt + erstickt brennende Flüssigkeit.',
      staerken:['Optimal für Flüssigkeits-Brände','Kühlt + erstickt','Lange Schutzwirkung'],
      schwaechen:['Schaum-Mittel umweltbedenklich (PFAS)','Reinigung aufwendig','Nicht für Elektrik'],
      angriffe:['Schaumzumischer sabotieren'],
      hersteller:['Tyco/Ansul','Minimax','Total Walther','Wormald'],
      svg: svg(`
        <rect x="40" y="170" width="120" height="30" fill="#475569"/>
        <line x1="40" y1="170" x2="160" y2="170" stroke="#94a3b8" stroke-width="2"/>
        ${Array.from({length: 20}, (_,i) => {
          const x = 50 + (i%10) * 12;
          const y = 130 + Math.floor(i/10) * 15;
          const r = 7 + Math.random() * 4;
          return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fef3c7" opacity=".85" stroke="#94a3b8" stroke-width=".3"/>`;
        }).join('')}
        <rect x="80" y="60" width="40" height="60" rx="4" fill="#1e293b" stroke="#94a3b8"/>
        <text x="100" y="90" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="800">AFFF</text>
        <text x="100" y="105" text-anchor="middle" font-size="7" fill="#94a3b8">3%</text>
        <line x1="100" y1="120" x2="100" y2="170" stroke="#94a3b8" stroke-width="3"/>
      `),
    },
    {
      key:'wandhydrant', name:'Wandhydrant Typ F/S', kat:'Brandschutz', typ:'passiv',
      klasse:'DIN 14461-1', wzeit:'manuell sofort',
      norm:'DIN 14461 / EN 671', preis:'500 — 1.500 €',
      einsatz:'Treppenraum, Flucht- & Rettungsweg, Hochregallager',
      principle:'Schlauchhaspel oder Schlauchhalter mit Strahlrohr. Sofort nutzbar durch Personal.',
      physik:'Schlauch 20—30 m, Ø 25 oder 33 mm. Strahlrohr DIN 14365. Anschluss an Trinkwasser-/Löschwasser-Leitung. Typ S = Selbsthilfe (Mieter), Typ F = Feuerwehr.',
      staerken:['Sofort einsetzbar','Pflicht in vielen Gebäuden','Kein Strom nötig','Wartungsfrei'],
      schwaechen:['Schulung nötig','Druck oft zu gering','Bei Großbrand unzureichend'],
      angriffe:['—'],
      hersteller:['Minimax','Tyco/Ansul','Pentair','Walther','Diverse Klein-Hersteller'],
      svg: svg(`
        <rect x="40" y="60" width="120" height="120" rx="6" fill="#dc2626" stroke="#fbbf24" stroke-width="3"/>
        <circle cx="100" cy="115" r="35" fill="#1e293b"/>
        <circle cx="100" cy="115" r="28" fill="#dc2626"/>
        <circle cx="100" cy="115" r="8" fill="#1e293b"/>
        <rect x="92" y="148" width="16" height="20" fill="#1e293b"/>
        <text x="100" y="195" text-anchor="middle" font-size="10" fill="#fbbf24" font-weight="900">WANDHYDRANT</text>
      `),
    },
    {
      key:'feuerloescher', name:'Handfeuerlöscher (Pulver/Wasser/CO₂)', kat:'Brandschutz', typ:'passiv',
      klasse:'EN 3 / DIN 14406', wzeit:'sofort manuell',
      norm:'EN 3', preis:'40 — 250 €',
      einsatz:'Pflicht in Gewerbe, jeder Etage, &lt; 25 m Wegstrecke',
      principle:'Tragbarer Löscher 2—12 kg. Klassen A (Feststoff), B (Flüssigkeit), C (Gas), D (Metall), F (Speiseöl).',
      physik:'Pulver-Treibgas (CO₂, N₂) bei 15 bar. ABC-Pulver: Ammoniumphosphat. CO₂-Löscher: flüssiges CO₂. Schaum-Löscher: AFFF.',
      staerken:['Sofort einsetzbar','Mehrere Brandklassen','Günstig','Pflicht im Gewerbe'],
      schwaechen:['Begrenzte Menge (8—20 s Spritzdauer)','Schulung nötig','Wartung alle 2 Jahre'],
      angriffe:['—'],
      hersteller:['Jockel','Gloria','Minimax','Total Walther','Hekatron','ABUS'],
      svg: svg(`
        <rect x="80" y="60" width="40" height="120" rx="6" fill="#dc2626" stroke="#0b1424" stroke-width="2"/>
        <rect x="86" y="65" width="28" height="20" fill="#fbbf24"/>
        <text x="100" y="80" text-anchor="middle" font-size="14" fill="#0b1424" font-weight="900">ABC</text>
        <rect x="88" y="155" width="24" height="20" fill="#475569"/>
        <line x1="100" y1="40" x2="100" y2="55" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="100" cy="55" r="4" fill="#1e293b"/>
        <text x="100" y="210" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="800">6 kg · 21A 144B</text>
      `),
    },
  ];

  /* ========================================================================
     ZUTRITTSKONTROLLE-DATENBANK (10)
     ======================================================================== */

  const ZKA_DB = [
    {
      key:'rfid-mifare', name:'RFID-Leser (Mifare DESFire)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Stufe B/C', wzeit:'&lt; 200 ms Lesung',
      norm:'EN 50133 / ISO 14443', preis:'100 — 400 €',
      einsatz:'Bürogebäude, Schulen, Werksgelände',
      principle:'Berührungsloser Leser für RFID-Karten/Tokens. Karte sendet ID, Leser prüft gegen Datenbank.',
      physik:'13,56 MHz NFC. Mifare DESFire mit AES-128-Verschlüsselung (Mifare Classic veraltet wegen Knacken). Lesedistanz 2—10 cm. PoE oder 12V DC. Wiegand-Protokoll oder OSDP-v2 zum Controller.',
      staerken:['Komfortabel','Skalierbar (1000+ Nutzer)','Mit Schließanlage kombinierbar','Audit-Log'],
      schwaechen:['Karten-Klau möglich','Mifare Classic UNSICHER','RFID-Skimming-Risiko'],
      angriffe:['Klonen Mifare Classic','RFID-Replay','Karten-Diebstahl','Tailgating'],
      hersteller:['HID Global','dormakaba','Salto','Bosch','Honeywell','PCS Intus'],
      svg: svg(`
        <rect x="60" y="60" width="80" height="120" rx="8" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <rect x="70" y="80" width="60" height="40" rx="4" fill="#0a0f1a"/>
        <text x="100" y="105" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">RFID</text>
        <circle cx="100" cy="140" r="12" fill="#0a0f1a" stroke="#22d3ee"/>
        <g stroke="#22d3ee" fill="none" stroke-width="1.5">
          <path d="M 92 135 q 8 5 0 10"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></path>
          <path d="M 86 130 q 14 10 0 20"><animate attributeName="opacity" values="0;1;0" dur="1s" begin=".2s" repeatCount="indefinite"/></path>
        </g>
        <rect x="76" y="160" width="48" height="12" rx="2" fill="#fbbf24"/>
        <text x="100" y="170" text-anchor="middle" font-size="7" fill="#0b1424" font-weight="800">CARD</text>
      `),
    },
    {
      key:'fingerprint', name:'Fingerprint-Leser (Biometrie)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Stufe C', wzeit:'&lt; 1 s Verifikation',
      norm:'EN 50133 / ISO 19794', preis:'200 — 1.500 €',
      einsatz:'Wohnung, Hochsicherheit-Tür, Tresor, Server-Raum',
      principle:'Kapazitiver oder optischer Sensor. Erkennt Fingerabdrucks-Muster.',
      physik:'Kapazitiver Sensor (Microchip-Array misst elektrische Felder unter Fingerlinien) oder optisch (Foto). Algorithmus erkennt 15—40 Minutien (Endpunkte, Verzweigungen). FAR &lt; 0.001 %, FRR &lt; 1 %.',
      staerken:['Schlüssellos','Personen-gebunden (nicht übertragbar)','Mit PIN/Karte kombinierbar (2-Faktor)','Audit-Log'],
      schwaechen:['Schmutzig/Verletzt → Fehler','Bei Verletzung gesperrt','Datenschutz-Pflicht (Biometrie!)'],
      angriffe:['Silikon-Finger-Replikat','Fingerabdruck vom Becher klonen'],
      hersteller:['ZKTeco','Suprema','HID','IDEMIA','Anviz','BURG-WÄCHTER'],
      svg: svg(`
        <rect x="60" y="60" width="80" height="120" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        <rect x="70" y="80" width="60" height="60" rx="4" fill="#0c0a1a"/>
        <g stroke="#a855f7" fill="none" stroke-width="1.5">
          <path d="M85 95 Q100 85 115 95 Q120 115 100 125 Q80 115 85 95 Z"/>
          <path d="M88 100 Q100 92 112 100 Q116 112 100 118 Q84 112 88 100 Z"/>
          <path d="M92 105 Q100 99 108 105 Q110 112 100 115 Q90 112 92 105 Z"/>
          <path d="M96 108 Q100 105 104 108 Q105 112 100 113 Q95 112 96 108 Z"/>
        </g>
        <text x="100" y="160" text-anchor="middle" font-size="11" fill="#a855f7" font-weight="800">BIOMETRIE</text>
        <circle cx="100" cy="170" r="4" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
      `),
    },
    {
      key:'gesichtserkennung', name:'Gesichtserkennung (Face-ID)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Stufe C', wzeit:'&lt; 1 s',
      norm:'ISO 19794-5', preis:'600 — 3.500 €',
      einsatz:'KRITIS, JVA, Hochsicherheits-Eingang, Banken',
      principle:'KI-basierte Gesichtsanalyse mit 2D + IR-Tiefe. Liveness-Check verhindert Foto-Spoof.',
      physik:'Stereo-Kamera (RGB + IR) oder mit Strukturlicht (z. B. Apple TrueDepth). DNN extrahiert Merkmals-Vektor (128—512-dim). FAR &lt; 0.0001 %. Liveness via Tiefen-Map oder Mikro-Bewegung.',
      staerken:['Berührungslos','Anti-Spoof (Liveness)','Mit Maske erkennbar (Maske-FR)','Audit'],
      schwaechen:['Sonnenbrillen/Kappe schwer','Datenschutz-Pflicht (DSFA)','Hochpreisig','Zwilling-Problem'],
      angriffe:['3D-Druck-Maske (sehr aufwendig)','Hochauflösendes Foto + Folie (mit altem System)'],
      hersteller:['Suprema FaceStation','IDEMIA VisionPass','ZKTeco SpeedFace','Anviz FaceDeep','HID Mercury'],
      svg: svg(`
        <rect x="50" y="60" width="100" height="100" rx="10" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <circle cx="100" cy="105" r="22" fill="#0c0a1a"/>
        <circle cx="92" cy="100" r="3" fill="#fbbf24"/>
        <circle cx="108" cy="100" r="3" fill="#fbbf24"/>
        <path d="M90 115 Q100 122 110 115" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <line x1="60" y1="135" x2="140" y2="135" stroke="#22d3ee" stroke-width="1" stroke-dasharray="2 2"><animate attributeName="y1" values="80;135;80" dur="2s" repeatCount="indefinite"/><animate attributeName="y2" values="80;135;80" dur="2s" repeatCount="indefinite"/></line>
        <text x="100" y="180" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">FACE-ID · LIVENESS</text>
      `),
    },
    {
      key:'iris-scan', name:'Iris-Scan', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Stufe C+', wzeit:'1—3 s',
      norm:'ISO 19794-6', preis:'2.000 — 10.000 €',
      einsatz:'Bank-Tresorraum, Rechenzentren, Militär, JVA',
      principle:'Naher-IR-Kamera scant Iris-Muster (260+ Merkmale). Fast unmöglich zu fälschen.',
      physik:'NIR-Kamera (740—900 nm) erfasst Iris bei kontrolliertem Abstand (30—50 cm). Daugman-Algorithmus generiert IrisCode (2048 Bit Hamming-Distanz). FAR &lt; 10⁻⁹.',
      staerken:['Höchste biometrische Sicherheit','Stabil über Jahrzehnte','Berührungslos','Anti-Spoof eingebaut'],
      schwaechen:['Sehr teuer','Brille/Kontaktlinse problematisch','Position kritisch','Datenschutz pflicht'],
      angriffe:['Hochauflösendes Iris-Foto + IR-Pass-Filter (sehr aufwendig, &gt; 99% Misslingen)'],
      hersteller:['IDEMIA Iris','HID Lumidigm','Iris ID','EyeLock'],
      svg: svg(`
        <rect x="40" y="60" width="120" height="80" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        <circle cx="100" cy="100" r="22" fill="#0c0a1a"/>
        <circle cx="100" cy="100" r="18" fill="#a855f7" opacity=".3"/>
        <circle cx="100" cy="100" r="12" fill="#a855f7" opacity=".5"/>
        <circle cx="100" cy="100" r="6" fill="#0c0a1a"/>
        ${Array.from({length: 16}, (_,i) => {
          const a = i * Math.PI / 8;
          return `<line x1="${100 + Math.cos(a) * 8}" y1="${100 + Math.sin(a) * 8}" x2="${100 + Math.cos(a) * 16}" y2="${100 + Math.sin(a) * 16}" stroke="#fbbf24" stroke-width=".8"/>`;
        }).join('')}
        <text x="100" y="180" text-anchor="middle" font-size="10" fill="#a855f7" font-weight="800">IRIS · 260 PUNKTE</text>
      `),
    },
    {
      key:'pin-tastatur', name:'PIN-Tastatur (Code-Schloss)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Stufe B', wzeit:'PIN-Eingabe',
      norm:'EN 50133', preis:'50 — 400 €',
      einsatz:'Wohnung, Garage, Garten, kleine Büros',
      principle:'Numerische Tastatur. Bei richtigem PIN öffnet Tür.',
      physik:'10er-Tastatur, oft mit Hintergrundbeleuchtung. PIN-Länge 4—12 Stellen. Anti-Tampering-Sensor. Manche mit randomisierter Anordnung (Anti-Schulterblick).',
      staerken:['Günstig','Kein Schlüssel','Mehrbenutzer-PINs','Mit RFID oft kombiniert'],
      schwaechen:['Schulterblick','Abnutzungs-Spuren auf Tasten','Brute-Force (selten erfolgreich)'],
      angriffe:['Schulterblick','UV-Fingerabdruck-Analyse','Brute-Force-Sequenz'],
      hersteller:['ABUS','BURG-WÄCHTER secuENTRY','Yale','BKS','Nuki'],
      svg: svg(`
        <rect x="60" y="50" width="80" height="140" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
        <rect x="70" y="60" width="60" height="20" rx="2" fill="#0a0f1a"/>
        <text x="100" y="75" text-anchor="middle" font-size="11" fill="#22c55e" font-family="monospace" font-weight="800">****</text>
        ${[0,1,2,3].map(r => [0,1,2].map(c => {
          const num = r === 3 ? (c === 1 ? '0' : '') : (r * 3 + c + 1);
          return `<rect x="${75 + c*18}" y="${90 + r*22}" width="14" height="16" rx="2" fill="#475569"/><text x="${82 + c*18}" y="${102 + r*22}" text-anchor="middle" font-size="8" fill="#fbbf24" font-weight="700">${num}</text>`;
        }).join('')).join('')}
      `),
    },
    {
      key:'bluetooth-lock', name:'Bluetooth/NFC Smart-Lock', kat:'Zutritt', typ:'aktiv',
      klasse:'BLE 5.2 / NFC', wzeit:'1—2 s',
      norm:'EN 16486', preis:'150 — 500 €',
      einsatz:'Wohnung, Ferienwohnung, kleine Büros, Hotel',
      principle:'Smartphone als Schlüssel. Bluetooth-Pairing oder NFC-Tap.',
      physik:'BLE 5.x für Distanz-Detektion, NFC für Kontakt-Auth. Schloss-Motor am Profilzylinder. App-Verwaltung mit Zeitfenster, Mehrbenutzer, Audit-Log.',
      staerken:['Schlüssellos','Zeit-/Benutzer-Profile','Mit App fernverwaltbar','Audit'],
      schwaechen:['Smartphone-Akku','BLE-Replay-Risiko','Cloud-Abhängigkeit','Stromausfall: Notschlüssel'],
      angriffe:['BLE-Sniffing/Replay','Smartphone-Diebstahl'],
      hersteller:['Nuki','Yale Linus','Tedee','BURG-WÄCHTER secuENTRY','Sesame'],
      svg: svg(`
        <rect x="60" y="50" width="80" height="140" rx="10" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
        <rect x="70" y="60" width="60" height="100" rx="3" fill="#0a0f1a"/>
        <text x="100" y="100" text-anchor="middle" font-size="22" fill="#06b6d4" font-weight="900">BLE</text>
        <g stroke="#06b6d4" fill="none">
          <path d="M85 130 Q100 125 115 130"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></path>
          <path d="M80 138 Q100 130 120 138"><animate attributeName="opacity" values="0;1;0" dur="1s" begin=".2s" repeatCount="indefinite"/></path>
        </g>
        <rect x="80" y="170" width="40" height="14" rx="3" fill="#475569"/>
      `),
    },
    {
      key:'drehkreuz-hh', name:'Vollhöhen-Drehkreuz (HH Turnstile)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 16005', wzeit:'2—4 s/Person',
      norm:'EN 16005', preis:'6.000 — 25.000 €',
      einsatz:'Industrie-Eingang, Stadium, Bahnhöfe',
      principle:'Mannshohes Drehkreuz mit 3—4 Sektoren. Nur 1 Person passiert pro Berechtigung.',
      physik:'Sektor-Konstruktion 200—220 cm hoch, Stahl mit Edelstahl-Oberfläche. Anti-Tailgating-Sensoren. RFID/Biometrie-Leser. Bei Notfall: Sektor freischwenkbar (EN 179).',
      staerken:['Echte Anti-Tailgating','Höchster Durchsatz-Anti-Cheat','Optisch abschreckend','Mit ZKA voll integrierbar'],
      schwaechen:['Großer Platzbedarf','Optik militaristisch','Behindertengerecht problematisch'],
      angriffe:['Übersteigen','Mit zweiter Person quetschen','Notfall-Knopf simulieren'],
      hersteller:['Boon Edam','Gunnebo','dormakaba','Magnetic Access','PERCo'],
      svg: svg(`
        <rect x="30" y="40" width="140" height="160" rx="4" fill="#0a0f1a" stroke="#7c3aed" stroke-width="2"/>
        <circle cx="100" cy="120" r="50" fill="rgba(124,58,237,.1)" stroke="#7c3aed"/>
        <line x1="100" y1="70" x2="100" y2="170" stroke="#7c3aed" stroke-width="3"/>
        <line x1="50" y1="120" x2="150" y2="120" stroke="#7c3aed" stroke-width="3"/>
        <line x1="65" y1="85" x2="135" y2="155" stroke="#7c3aed" stroke-width="3"/>
        <rect x="70" y="30" width="60" height="14" fill="#1e293b" stroke="#475569"/>
        <text x="100" y="40" text-anchor="middle" font-size="8" fill="#fbbf24">RFID</text>
      `),
    },
    {
      key:'schleuse-bank', name:'Personenschleuse (Bank-Vorraum)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Stufe C+', wzeit:'10—20 s/Person',
      norm:'EN 50133 / EN 16005', preis:'25.000 — 100.000 €',
      einsatz:'Bank-Vorraum, Tresor-Vorraum, Rechenzentrum-Zugang',
      principle:'2-Türen-Schleuse mit Anti-Tailgating-Sensorik und Gewichts-/Personen-Detektion.',
      physik:'Glas- oder Stahltüren mit Zwischenraum 2—3 m². Bodensensor (Gewichtsverteilung), Decken-Stereo-Kamera (Anti-Tailgating), Iris-Scan-/Karten-Leser. Tür A erst zu, dann Tür B auf.',
      staerken:['Höchste Anti-Tailgating','Mit Iris/Biometrie kombinierbar','Bankraum-Standard','Mantrap-Funktion möglich'],
      schwaechen:['Sehr teuer','Langsamer Durchsatz','Mit Behinderung schwer','Klaustrophobie'],
      angriffe:['Beide Türen gleichzeitig zerstören (sehr aufwendig)','Notentriegelung umgehen'],
      hersteller:['Boon Edam Tourlock','Gunnebo SpeedStile','dormakaba ST-FlexSecure','KABA Magnetic'],
      svg: svg(`
        <rect x="20" y="60" width="160" height="120" rx="4" fill="#0a0f1a" stroke="#a855f7" stroke-width="2"/>
        <rect x="30" y="80" width="55" height="90" fill="rgba(168,85,247,.15)" stroke="#a855f7" stroke-width="2"/>
        <rect x="115" y="80" width="55" height="90" fill="rgba(168,85,247,.15)" stroke="#a855f7" stroke-width="2"/>
        <text x="55" y="120" text-anchor="middle" font-size="11" fill="#a855f7" font-weight="800">TÜR A</text>
        <text x="145" y="120" text-anchor="middle" font-size="11" fill="#a855f7" font-weight="800">TÜR B</text>
        <circle cx="100" cy="125" r="6" fill="#fbbf24"/>
        <text x="100" y="155" text-anchor="middle" font-size="8" fill="#fbbf24">VEREINZ.</text>
      `),
    },
    {
      key:'zka-zentrale', name:'ZKA-Zentrale (Access Controller)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 50133 Grad 1—3', wzeit:'&lt; 100 ms Entscheidung',
      norm:'EN 50133 / EN 60839', preis:'500 — 5.000 €',
      einsatz:'Zentrale Steuerung aller Leser, Türen, Benutzer',
      principle:'Industrie-Controller, der bis 32+ Leser/Türen verwaltet. Berechtigungs-Datenbank.',
      physik:'ARM-/x86-Controller mit Linux/RTOS. PoE+ und Backup-Akku. Schnittstellen: Wiegand, OSDP-v2, BACnet, OPC. Verteilte Architektur: Leser → Controller → Server.',
      staerken:['Skalierbar (1000+ Türen)','Mehrstandort-Sync','Audit-Log','Lokale Logik (Offline-Modus)'],
      schwaechen:['Komplexe Konfiguration','Lizenz-/Wartungs-Kosten','Cyber-Risk wenn online'],
      angriffe:['Cyber-Angriff','Wiegand-Replay (alte Systeme)','Backup-Akku entfernen'],
      hersteller:['dormakaba B-COMM','HID Mercury','Bosch AMS','Suprema BioStar','Genetec Synergis'],
      svg: svg(`
        <rect x="40" y="60" width="120" height="100" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
        <rect x="50" y="70" width="100" height="40" fill="#0a0f1a"/>
        <text x="100" y="95" text-anchor="middle" font-size="11" fill="#3b82f6" font-weight="800">ZKA-CTRL</text>
        ${[0,1,2,3,4,5,6,7].map(i => `<rect x="${52 + (i%4)*22}" y="${120 + Math.floor(i/4)*15}" width="18" height="10" fill="#475569"/><circle cx="${61 + (i%4)*22}" cy="${125 + Math.floor(i/4)*15}" r="2" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="${1+i*0.2}s" repeatCount="indefinite"/></circle>`).join('')}
      `),
    },
    {
      key:'tueroeffner', name:'Türöffner (elektromagnet./elektromech.)', kat:'Zutritt', typ:'aktiv',
      klasse:'EN 14846', wzeit:'10—500 ms Auslösung',
      norm:'EN 14846 / EN 12209', preis:'40 — 350 €',
      einsatz:'Wohnhaus, Büro, hinter Türöffner-Klingel',
      principle:'Elektrischer Riegel-Öffner. Strom-Impuls hält oder löst Riegel.',
      physik:'Arbeitsstrom (öffnet wenn bestromt) oder Ruhestrom (öffnet wenn entstromt — Notfall-Floschluss). 12V AC/DC. Haltekraft elektromagnetisch (Fail-Safe für Brand) vs. mechanisch.',
      staerken:['Günstig','Mit jeder ZKA kombinierbar','Schnelle Montage','Mit Sprechanlage'],
      schwaechen:['Stromausfall: Tür offen (Fail-Safe) oder zu (Fail-Secure)','Wartungsbedarf','Brandschutz prüfen'],
      angriffe:['Strom kappen → fail-safe Türöffner geht auf','RFID-Sniffer'],
      hersteller:['effeff','GEZE','dormakaba','BKS','GU'],
      svg: svg(`
        <rect x="50" y="60" width="100" height="120" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
        <rect x="60" y="70" width="80" height="50" fill="#475569"/>
        <rect x="65" y="80" width="10" height="30" fill="#cbd5e1"/>
        <rect x="125" y="80" width="10" height="30" fill="#cbd5e1"/>
        <line x1="75" y1="95" x2="125" y2="95" stroke="#fbbf24" stroke-width="2"/>
        <text x="100" y="145" text-anchor="middle" font-size="10" fill="#06b6d4" font-weight="800">12V DC</text>
        <text x="100" y="165" text-anchor="middle" font-size="8" fill="#22c55e">Fail-Safe</text>
      `),
    },
  ];

  /* ========================================================================
     ALARMIERUNG/EMA-DATENBANK (10)
     ======================================================================== */

  const EMA_DB = [
    {
      key:'ema-zentrale', name:'EMA-Zentrale (VdS Grad 2/3)', kat:'Alarmierung', typ:'aktiv',
      klasse:'VdS Grad 2/3 · EN 50131 Grade 2/3', wzeit:'Live-Verarbeitung',
      norm:'VdS A/B/C · EN 50131', preis:'500 — 5.000 €',
      einsatz:'Wohnung/Büro (Grad 2) · Hochwert/KRITIS (Grad 3)',
      principle:'Zentral-Steuerung aller Melder. Verarbeitet Signale, alarmiert, ruft NSL/Polizei.',
      physik:'Microcontroller mit Hot-Backup. Mehrere Linien (8—128+) für Melder. Funk- oder Draht-Anbindung. Akku-Pufferung (24—72 h). VdS A = 8 Linien, B = 32, C = 256+. Eingebaute Übertragung.',
      staerken:['Zentrale Übersicht','Mit Funk-Meldern','Smart-Home-fähig','Mit NSL koppelbar'],
      schwaechen:['Bei Sabotage SPoF','Wartung pflicht (jährlich VdS)','Hochpreisig bei Grad 3'],
      angriffe:['Strom-Sabotage (Akku-Pufferung wichtig!)','GSM-Jammer','Kabel kappen'],
      hersteller:['Telenot','Bosch','Honeywell Galaxy','Daitem','Lupus','ABUS','Securiton'],
      svg: svg(`
        <rect x="50" y="50" width="100" height="140" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
        <rect x="60" y="60" width="80" height="40" rx="2" fill="#0a0f1a"/>
        <text x="100" y="80" text-anchor="middle" font-size="11" fill="#22c55e" font-family="monospace" font-weight="800">SCHARF</text>
        <text x="100" y="93" text-anchor="middle" font-size="8" fill="#94a3b8">12:45 · ${`8 Linien aktiv`}</text>
        ${[0,1,2,3].map(r => [0,1,2].map(c => `<circle cx="${75 + c*15}" cy="${115 + r*18}" r="4" fill="#475569"/>`).join('')).join('')}
        <circle cx="75" cy="115" r="4" fill="#22c55e"/>
        <circle cx="90" cy="115" r="4" fill="#22c55e"/>
        <circle cx="105" cy="115" r="4" fill="#22c55e"/>
        <text x="100" y="200" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="800">VdS Grad 3</text>
      `),
    },
    {
      key:'sirene-aussen', name:'Außensirene + Blitzleuchte', kat:'Alarmierung', typ:'aktiv',
      klasse:'EN 50131-4', wzeit:'105—120 dB / 360° Licht',
      norm:'EN 50131-4', preis:'150 — 600 €',
      einsatz:'Hausfassade, Werks-Gelände, Hofeinfahrt',
      principle:'Akustische + optische Eindringling-Abschreckung. Auslösung von EMA-Zentrale.',
      physik:'Piezo-Schallwandler oder elektrodynamisches Horn. Klassisch 105—120 dB bei 1 m. LED- oder Xenon-Blitzleuchte. Eigener Akku (24—36 h). Sabotagekontakte. Wasserdicht IP65/66.',
      staerken:['Massive Abschreckung','Mit Akku-Backup','Nachbar-Aufmerksamkeit','VdS-zertifiziert'],
      schwaechen:['Lärmschutz-Auflagen (max 3 min)','Mit Stroboskop pflicht','Schwer wartbar (Akku-Wechsel)'],
      angriffe:['Mit Bauschaum füllen','Akku entfernen','Übermalen Stroboskop'],
      hersteller:['ABUS','Bosch','Daitem','Telenot','Honeywell'],
      svg: svg(`
        <rect x="60" y="50" width="80" height="80" rx="6" fill="#dc2626" stroke="#0b1424" stroke-width="2"/>
        <circle cx="100" cy="90" r="20" fill="#1e293b"/>
        <circle cx="100" cy="90" r="14" fill="#7f1d1d"/>
        <circle cx="100" cy="90" r="7" fill="#dc2626"/>
        <rect x="80" y="135" width="40" height="20" rx="2" fill="#fbbf24">
          <animate attributeName="fill" values="#fbbf24;#0a0f1a;#fbbf24" dur=".3s" repeatCount="indefinite"/>
        </rect>
        <text x="100" y="148" text-anchor="middle" font-size="8" fill="#0b1424" font-weight="900">⚡</text>
        <text x="100" y="180" text-anchor="middle" font-size="10" fill="#dc2626" font-weight="900">110 dB</text>
      `),
    },
    {
      key:'sirene-innen', name:'Innensirene', kat:'Alarmierung', typ:'aktiv',
      klasse:'EN 50131-4', wzeit:'85—105 dB',
      norm:'EN 50131-4', preis:'40 — 200 €',
      einsatz:'Wohnzimmer, Flur, Schlafraum',
      principle:'Akustischer Alarm innen. Soll Einbrecher verstören & Bewohner wecken.',
      physik:'Piezo-Wandler oder Lautsprecher. 85—105 dB. Geringer Stromverbrauch, oft direkt von Zentrale gespeist. Kompakt (10—15 cm).',
      staerken:['Innen-Schock-Effekt','Weckt Bewohner','Günstig','Vandalismus-Sicher (im Haus)'],
      schwaechen:['Lärmschutz für Nachbarn','Lokal abschalten möglich','Nicht draußen hörbar'],
      angriffe:['Schaumstoff drauf','Stecker ziehen (verkabelt)'],
      hersteller:['ABUS','Bosch','Daitem','Telenot','Honeywell','Visonic'],
      svg: svg(`
        <rect x="60" y="80" width="80" height="60" rx="6" fill="#dc2626" stroke="#0b1424" stroke-width="2"/>
        <ellipse cx="100" cy="110" rx="25" ry="18" fill="#1e293b"/>
        <ellipse cx="100" cy="110" rx="18" ry="13" fill="#7f1d1d"/>
        <g stroke="#dc2626" fill="none" stroke-width="1.5">
          <path d="M140 100 q5 10 0 20"><animate attributeName="opacity" values="0;1;0" dur=".6s" repeatCount="indefinite"/></path>
          <path d="M148 95 q10 15 0 30"><animate attributeName="opacity" values="0;1;0" dur=".6s" begin=".2s" repeatCount="indefinite"/></path>
        </g>
        <text x="100" y="165" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="900">95 dB</text>
      `),
    },
    {
      key:'gsm-uebertragung', name:'GSM/LTE-Übertragungsgerät', kat:'Alarmierung', typ:'aktiv',
      klasse:'VdS C (NSL-Übertragung)', wzeit:'&lt; 30 s Verbindung',
      norm:'VdS 2465 / EN 50136', preis:'200 — 1.200 €',
      einsatz:'Übertragung von EMA-Zentrale zur Notruf-Leitstelle (NSL)',
      principle:'Mobilfunk-Modul sendet Alarm-Telegramme an NSL. Mit Redundanz (LTE + 2G + IP).',
      physik:'Multi-Band-LTE-Modul (Cat. 4/M1) + 2G-Fallback + Ethernet. SIM/eSIM. VdS-2465-Protokoll. Heartbeat alle 1—10 Min. Backup-Akku 24—72 h.',
      staerken:['Mit NSL-Kopplung','Redundant','Klassisches Backup-Verfahren','VdS-zertifiziert'],
      schwaechen:['Mobilfunk-Jammer','SIM-Diebstahl','Vertrags-Kosten monatlich'],
      angriffe:['Jammer','Faraday-Käfig um EMA','SIM blockieren'],
      hersteller:['Telenot comXline','Daitem','ABUS','Bosch','Securiton'],
      svg: svg(`
        <rect x="60" y="70" width="80" height="100" rx="6" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <rect x="70" y="80" width="60" height="40" fill="#0a0f1a"/>
        <text x="100" y="95" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="800">GSM</text>
        <text x="100" y="110" text-anchor="middle" font-size="14" fill="#22c55e" font-family="monospace" font-weight="800">▮▮▮▮▮</text>
        <line x1="100" y1="130" x2="100" y2="58" stroke="#94a3b8" stroke-width="2"/>
        ${[1,2,3].map(i => `<circle cx="100" cy="${60 - i*8}" r="${i*4}" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="r" values="${i*2};${i*5};${i*2}" dur="2s" begin="${i*0.3}s" repeatCount="indefinite"/></circle>`).join('')}
        <text x="100" y="190" text-anchor="middle" font-size="9" fill="#22d3ee" font-weight="800">VdS 2465 NSL</text>
      `),
    },
    {
      key:'notruf-knopf', name:'Notruf-Knopf (Überfall-/Bedroh-Alarm)', kat:'Alarmierung', typ:'aktiv',
      klasse:'EN 50131-2-6', wzeit:'Stiller Alarm',
      norm:'EN 50131-2-6', preis:'30 — 200 €',
      einsatz:'Banken-Schalter, Tankstellen, Apotheken, Hotels',
      principle:'Versteckter oder offen sichtbarer Taster. Bei Druck: stiller oder lauter Alarm an NSL.',
      physik:'Mechanischer Taster oder Reedkontakt. Festkopplung (lässt sich nicht zurücksetzen ohne Schlüssel). Mit EMA-Zentrale verkabelt oder per Funk. Manche mit Bewegungs-Detektion (Bewegung in 3 s = Alarm).',
      staerken:['Sofort-Alarm bei Überfall','Versteckt aktivierbar (unter Theke)','Versicherungs-Bonus','Auch für Personensicherheit (Mobil)'],
      schwaechen:['Fehl-Alarm-Risiko','Schulungsbedarf','Mit NSL-Vertrag pflicht'],
      angriffe:['Knopf zerstören (vorher meist schon aktiviert)'],
      hersteller:['Telenot','Securitas','Bosch','ABUS'],
      svg: svg(`
        <rect x="60" y="80" width="80" height="80" rx="6" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
        <circle cx="100" cy="120" r="28" fill="#dc2626" stroke="#0b1424" stroke-width="3">
          <animate attributeName="r" values="26;30;26" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x="100" y="124" text-anchor="middle" font-size="18" fill="white" font-weight="900">SOS</text>
        <text x="100" y="180" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="800">ÜBERFALL-ALARM</text>
      `),
    },
    {
      key:'funk-bedienteil', name:'Funk-Bedienteil mit Display & RFID', kat:'Alarmierung', typ:'aktiv',
      klasse:'EN 50131', wzeit:'Live-Status',
      norm:'EN 50131-3', preis:'150 — 500 €',
      einsatz:'Eingangsbereich Wohnung, Geschäftseingang',
      principle:'Funk-Bedienteil zum Scharf-/Unscharf-Schalten der EMA. PIN, RFID-Chip oder Schlüssel.',
      physik:'2,4-GHz- oder 868-MHz-Funk zur Zentrale. Touchdisplay 2—4" oder Tastatur. RFID-Leser 13,56 MHz. Eigener Akku oder Steckdose. Manchmal LAN.',
      staerken:['Komfort','Mehrere Bedienteile pro Anlage','Display zeigt Linien-Status','Mit RFID + PIN (2-Faktor)'],
      schwaechen:['Akku-Wartung','Funk-Jamming möglich','Bei Defekt Anlage nicht scharf'],
      angriffe:['Jamming 868 MHz','Replay (mit alten Systemen)'],
      hersteller:['Telenot','Daitem','ABUS','Lupus','Bosch','Honeywell'],
      svg: svg(`
        <rect x="50" y="50" width="100" height="140" rx="8" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
        <rect x="60" y="60" width="80" height="55" rx="3" fill="#0a0f1a"/>
        <text x="100" y="78" text-anchor="middle" font-size="9" fill="#22c55e" font-family="monospace">SCHARF</text>
        <text x="100" y="92" text-anchor="middle" font-size="7" fill="#94a3b8">Linie 1-8: ✓</text>
        <text x="100" y="105" text-anchor="middle" font-size="7" fill="#94a3b8">12:45 · GSM ▮▮▮▮</text>
        ${[0,1,2].map(r => [0,1,2].map(c => {
          const n = r * 3 + c + 1;
          return `<rect x="${68 + c*22}" y="${125 + r*18}" width="16" height="14" rx="2" fill="#475569"/><text x="${76 + c*22}" y="${135 + r*18}" text-anchor="middle" font-size="8" fill="#fbbf24" font-weight="700">${n}</text>`;
        }).join('')).join('')}
      `),
    },
    {
      key:'schluesselschalter', name:'Schlüsselschalter mit Sabotagekontakt', kat:'Alarmierung', typ:'passiv',
      klasse:'VdS A/B', wzeit:'instant',
      norm:'VdS', preis:'70 — 250 €',
      einsatz:'Außenmontage, robuste Bedienung, Werkstor',
      principle:'Mechanischer Schlüsselschalter zum Scharf-/Unscharfschalten. Sabotagekontakt im Gehäuse.',
      physik:'Profilzylinder (oft Halbzylinder) im Edelstahl-Gehäuse. Tamper-Switch im Gehäuse-Inneren. Mit EMA-Zentrale verkabelt oder Funk.',
      staerken:['Robust für Außen','Kein Strom nötig (mech.)','VdS-zertifiziert','Wartungsarm'],
      schwaechen:['Schlüssel kann verloren gehen','Picken theoretisch möglich','Bei Funk-Variante Jamming'],
      angriffe:['Schlüssel kopieren','Zylinder aufbohren','Profilzylinder ausziehen'],
      hersteller:['ABUS','BKS','effeff','DOM','ASSA ABLOY'],
      svg: svg(`
        <rect x="60" y="80" width="80" height="80" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <circle cx="100" cy="120" r="22" fill="#0a0f1a" stroke="#fbbf24" stroke-width="2"/>
        <rect x="93" y="115" width="14" height="10" fill="#fbbf24"/>
        <line x1="100" y1="100" x2="100" y2="80" stroke="#94a3b8" stroke-width="2"/>
        <rect x="92" y="80" width="16" height="5" fill="#94a3b8"/>
        <circle cx="83" cy="105" r="2" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
        <text x="100" y="180" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="800">SCHLÜSSEL</text>
      `),
    },
    {
      key:'magnet-kontakt', name:'Magnet-Kontakt (Tür/Fenster)', kat:'Alarmierung', typ:'passiv',
      klasse:'VdS A/B', wzeit:'instant',
      norm:'VdS', preis:'15 — 80 €',
      einsatz:'Alle Türen/Fenster, Garagentor, Schrank',
      principle:'Reedkontakt + Magnet. Bei Trennung (Tür öffnet) → Stromkreis bricht → Alarm.',
      physik:'Reed-Schalter (zwei magnetische Plättchen in Glasröhrchen) + Permanentmagnet auf Tür-/Fenster-Flügel. Beim Öffnen entfernt sich Magnet → Kontakt öffnet. VdS-Variante mit Sabotage-Linie.',
      staerken:['Sehr günstig','Wartungsarm','Bewährt','Mit jeder EMA kompatibel'],
      schwaechen:['Mit anderem Magnet umgehbar (low-end)','VdS-Variante magnet-tamper-fest','Aufputz sichtbar'],
      angriffe:['Magnet anhalten (umgeht low-end)','Reed-Schalter zerstören'],
      hersteller:['ABUS','Bosch','Honeywell','Visonic','Aritech','Magnasphere (VdS)'],
      svg: svg(`
        <rect x="40" y="100" width="60" height="40" rx="3" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <rect x="105" y="100" width="50" height="40" rx="3" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="70" y="125" text-anchor="middle" font-size="8" fill="#22c55e" font-weight="700">REED</text>
        <text x="130" y="125" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="800">N S</text>
        <line x1="100" y1="120" x2="105" y2="120" stroke="#22c55e" stroke-width="2" stroke-dasharray="2 1"/>
        <text x="100" y="170" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="800">VdS A</text>
      `),
    },
    {
      key:'glasbruch-akustisch', name:'Glasbruch-Melder (akustisch)', kat:'Alarmierung', typ:'passiv',
      klasse:'VdS A/B', wzeit:'instant',
      norm:'VdS', preis:'30 — 150 €',
      einsatz:'Räume mit Glasflächen, Schaufenster',
      principle:'Mikrofon erkennt die typische Frequenz von Glasbruch (~ 7—15 kHz Doppel-Peak).',
      physik:'Mikrofon + DSP analysiert Frequenz-Profil. Erst Tieftöner (Schlag, &lt; 1 kHz), dann Hochtöner (Splitter, 7—15 kHz). Doppel-Detektion vermeidet Fehl-Alarm.',
      staerken:['Erkennt Glas-Bruch ohne Kontakt','Schützt mehrere Scheiben gleichzeitig','Günstig'],
      schwaechen:['Fehl-Alarm bei Gewitter/Lärm','Glas-Material-spezifisch','Reichweite begrenzt'],
      angriffe:['Schmelzgas (Glas bricht ohne Splitter, schwer)'],
      hersteller:['ABUS','Bosch','Honeywell','Visonic','Aritech'],
      svg: svg(`
        <rect x="50" y="60" width="100" height="100" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <path d="M70 80 L130 80 L130 140 L70 140 Z" fill="rgba(34,211,238,.2)" stroke="#3b82f6"/>
        <path d="M85 90 L 95 110 L 88 130 M 100 85 L 110 105 L 105 135" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
        <g transform="translate(120, 75)">
          <circle r="6" fill="#dc2626"/>
          <text y="3" text-anchor="middle" font-size="7" fill="white" font-weight="900">MIC</text>
        </g>
        <text x="100" y="190" text-anchor="middle" font-size="9" fill="#22c55e" font-weight="800">7-15 kHz Doppel-Peak</text>
      `),
    },
    {
      key:'erschuett-melder', name:'Erschütterungsmelder (Geophon/Piezo)', kat:'Alarmierung', typ:'passiv',
      klasse:'VdS B/C', wzeit:'&lt; 100 ms',
      norm:'VdS C', preis:'80 — 400 €',
      einsatz:'Tresor-Außenwand, Mauerwerk, Hochsicherheit-Wände',
      principle:'Erkennt Vibrationen durch Bohrer/Hammer/Sprengstoff am Bauwerk.',
      physik:'Piezo-Sensor oder MEMS-Beschleunigungssensor. Signal-Verarbeitung: Frequenzanalyse (Bohrer: 800—3000 Hz typisch, Hammer: 50—800 Hz, Sprengung: Impuls).',
      staerken:['Schon vor dem Durchbruch reagieren','Mit Tresor-Schutz Standard','VdS C'],
      schwaechen:['Fehl-Alarm bei Bauarbeiten in Nähe','Empfindlichkeit kalibrieren','Tag/Nacht-Profile'],
      angriffe:['Vibrations-Dämpfung (extrem aufwendig)'],
      hersteller:['Securiton SISTORE','Vibration sensors (VdS)','Hekatron','Bosch'],
      svg: svg(`
        <rect x="60" y="80" width="80" height="80" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
        <circle cx="100" cy="120" r="20" fill="#0a0f1a"/>
        <circle cx="100" cy="120" r="14" fill="#475569"/>
        <circle cx="100" cy="120" r="6" fill="#fbbf24"/>
        <g stroke="#fbbf24" fill="none" stroke-width="1.5">
          <path d="M65 95 Q70 80 80 95 M 80 95 Q 85 110 75 105"/>
        </g>
        <text x="100" y="190" text-anchor="middle" font-size="9" fill="#fbbf24" font-weight="800">PIEZO · VdS C</text>
      `),
    },
  ];

  /* ========================================================================
     COMBINED DB + Kategorisierungs-Info
     ======================================================================== */

  const ALL_KATS = [
    {
      id:'detektion', name:'Detektion · Melder',
      icon:'fa-wave-square', c:'#22d3ee',
      desc:'Aktive und passive Detektoren — von PIR bis Mikrowellen-Radar',
      count: () => (window.ENCY && ENCY.list ? ENCY.list.length : 30),
      preview: ['PIR-Melder','Mikrowellen','Glasbruch','Vibration','Wärmebild','LiDAR'],
      view: 'enzyklopaedie',
      heroSvg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="20" fill="none" stroke="#22d3ee" stroke-width="3"/><circle cx="60" cy="60" r="35" fill="none" stroke="#22d3ee" stroke-width="2" opacity=".6"><animate attributeName="r" values="20;50;20" dur="2s" repeatCount="indefinite"/></circle><circle cx="60" cy="60" r="6" fill="#22d3ee"/></svg>`,
    },
    {
      id:'video', name:'Video · KI · NVR',
      icon:'fa-video', c:'#06b6d4',
      desc:'IP-Kameras, KI-Edge-Detektion, NVR, VMS, Anti-Tailgating',
      count: () => VIDEO_DB.length,
      preview: ['Bullet-Kamera','Dome','PTZ 25× Zoom','Wärmebild','360° Fisheye','ANPR'],
      view: 'kat-video',
      heroSvg: `<svg viewBox="0 0 120 120"><rect x="30" y="40" width="60" height="40" rx="8" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/><circle cx="60" cy="60" r="14" fill="#0c0a1a" stroke="#06b6d4" stroke-width="2"/><circle cx="60" cy="60" r="5" fill="#06b6d4"/><circle cx="75" cy="48" r="2" fill="#ef4444"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle></svg>`,
    },
    {
      id:'mechanik', name:'Mechanik · Bauliche Sicherheit',
      icon:'fa-shield-halved', c:'#a855f7',
      desc:'Türen, Tore, Zäune, Poller, Tresore, Fenster, Verglasung, Beschläge',
      count: () => (window.MECH_ENCY && MECH_ENCY.LIST ? MECH_ENCY.LIST.length : 50),
      preview: ['RC2-Tür','Klasse-III-Tresor','K12-Poller','Doppelstabmatte','P4A-Glas','Pilzkopf'],
      view: 'mechency',
      heroSvg: `<svg viewBox="0 0 120 120"><rect x="35" y="25" width="50" height="70" rx="3" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><circle cx="55" cy="60" r="5" fill="#fbbf24"/><rect x="85" y="55" width="14" height="10" fill="#a855f7"/></svg>`,
    },
    {
      id:'brandschutz', name:'Brandschutz · BMA · Löschen',
      icon:'fa-fire', c:'#ea580c',
      desc:'Rauchmelder, Sprinkler, CO₂-Anlage, Novec 1230, Flammenmelder',
      count: () => BRAND_DB.length,
      preview: ['Optischer Rauch','Wärmemelder','ASD','Sprinkler','CO₂-Anlage','Novec 1230'],
      view: 'kat-brand',
      heroSvg: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="30" fill="#1e293b" stroke="#ea580c" stroke-width="2"/><path d="M50 70 Q55 40 60 50 Q70 30 75 50 Q80 65 65 75 Q55 78 50 70 Z" fill="#ea580c"><animate attributeName="fill" values="#ea580c;#fbbf24;#ea580c" dur=".5s" repeatCount="indefinite"/></path></svg>`,
    },
    {
      id:'zutritt', name:'Zutritt · ZKA · Biometrie',
      icon:'fa-id-card', c:'#7c3aed',
      desc:'RFID, Fingerprint, Iris, Gesichtserkennung, Schleusen, Drehkreuze',
      count: () => ZKA_DB.length,
      preview: ['RFID DESFire','Fingerprint','Face-ID','Iris','Drehkreuz','Schleuse'],
      view: 'kat-zka',
      heroSvg: `<svg viewBox="0 0 120 120"><rect x="35" y="25" width="50" height="70" rx="6" fill="#1e293b" stroke="#7c3aed" stroke-width="2"/><circle cx="60" cy="60" r="14" fill="#0c0a1a" stroke="#7c3aed"/><circle cx="60" cy="60" r="6" fill="#7c3aed"/><rect x="48" y="80" width="24" height="6" rx="2" fill="#fbbf24"/></svg>`,
    },
    {
      id:'alarmierung', name:'Alarmierung · EMA · NSL',
      icon:'fa-bell', c:'#dc2626',
      desc:'EMA-Zentrale, Sirenen, GSM-Übertragung, Glasbruch, Magnet, Notruf',
      count: () => EMA_DB.length,
      preview: ['EMA-Zentrale','Sirene 110dB','GSM-Übertragung','Magnetkontakt','Notruf-Knopf','Erschütterung'],
      view: 'kat-ema',
      heroSvg: `<svg viewBox="0 0 120 120"><path d="M60 30 Q40 30 40 60 L40 75 L80 75 L80 60 Q80 30 60 30 Z" fill="#1e293b" stroke="#dc2626" stroke-width="2"/><line x1="60" y1="75" x2="60" y2="85" stroke="#dc2626" stroke-width="3"/><circle cx="60" cy="90" r="4" fill="#dc2626"/><circle cx="40" cy="55" r="6" fill="#dc2626"><animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite"/></circle></svg>`,
    },
  ];

  /* ========================================================================
     EXPORT — KATALOG-Module
     ======================================================================== */

  return {
    VIDEO_DB,
    BRAND_DB,
    ZKA_DB,
    EMA_DB,
    ALL_KATS,
  };
})();
