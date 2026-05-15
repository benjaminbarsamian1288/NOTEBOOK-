/* WWD Intelligente Video-Türme — komplette Sektion
   Basierend auf WWD-Technik-Broschüre 10/2025 */

window.WWD = (() => {
  const { el, drawer } = U;

  const VARIANTS = [
    {
      id:'4x', name:'KWS Video Control 4×', icon:'fa-tower-cell',
      einsatz:'Große Areale, Logistikzentren, Flughafenvorfelder, Energieanlagen',
      ausstattung:['4× Dome-Kameras','2× 100W LED-Strahler','NVR','Lautsprecher','Mast (bis 6 m)'],
      color:'#dc2626',
    },
    {
      id:'2+2', name:'KWS Video Control 2+2', icon:'fa-tower-cell',
      einsatz:'Mittelgroße Flächen, Bauhöfe, Produktionsgelände',
      ausstattung:['2× Dome + 2× Bullet-Kameras','2× 100W LED-Strahler','NVR','Lautsprecher','Mast (bis 6 m)'],
      color:'#ea580c',
    },
    {
      id:'autark', name:'KWS Video Control Autark', icon:'fa-sun',
      einsatz:'Abgelegene Standorte, temporäre Einsätze ohne Netzanbindung',
      ausstattung:['4× Dome-Kameras','2× Solarpanel 305 W','2× Akku 220 Ah','NVR','Lautsprecher','Mast (bis 6 m)'],
      color:'#fbbf24',
    },
    {
      id:'mini', name:'KWS Video Control Mini', icon:'fa-box',
      einsatz:'Innenräume, enge Flächen, Orte ohne Stellfläche',
      ausstattung:['Kompakt ca. 40×40 cm','Volle Videoüberwachung','Ideal für Hallen, Lager, Innenhöfe'],
      color:'#22c55e',
    },
  ];

  const SPECS = [
    { kat:'Dome-Kameras (2× oder 4×)', items:[
      '25× optischer Zoom',
      'Laser-IR-Distanz bis 100 m',
      'Schwenkbereich 360° · Neigung 90°',
      'Auto-Tracking',
      'Intelligente Videoanalyse (IVS, SMD/KI)',
      'Fahrzeug- und Personenerkennung',
      'Beobachten >900 m · Erkennen >450 m · Identifizieren >200 m',
    ]},
    { kat:'Bullet-Kameras (2×)', items:[
      'Weitwinkel 110°',
      'IR-Nachtsicht bis 50 m',
      'IVS / SMD / KI',
    ]},
    { kat:'LED-Beleuchtung', items:[
      '2× 100W oder 2× 50W',
      '10.000 Lumen',
      'Abstrahlwinkel 120°',
      'Farbtemperatur 6500 K (Kaltweiß)',
      'Schutzklasse IP66',
    ]},
    { kat:'Lautsprecher', items:[
      'Direkte Täteransprache bis 120 dB',
      'Integriertes Mikrofon für Gegengespräche',
    ]},
    { kat:'Netzwerk-Rekorder (NVR)', items:[
      '7 Tage Aufzeichnung (DSGVO-konform)',
      'Festplatte 2 TB HDD',
      '„Made in Germany"',
    ]},
    { kat:'Mast & Mechanik', items:[
      'Ausfahrbar bis 6 m (elektr. Seilwinde oder Handbetrieb)',
      'Gesamtgewicht ≈ 450 kg (klein) bis ≈ 700 kg (erweitert)',
    ]},
    { kat:'Autarkie-Option', items:[
      '2× Solarpanel je 305 W',
      '2× Akku je 220 Ah',
      'Dauerhafter autarker Betrieb (abhängig von Last & Standort)',
    ]},
  ];

  const STEPS = [
    { n:1, title:'DETEKTION', desc:'Bewegung wird durch Kameras/IVS erkannt — automatisch.', icon:'fa-eye', color:'#22d3ee' },
    { n:2, title:'ALARM-MELDUNG', desc:'Hochauflösende Videosequenz wird an die 24/7 besetzte Leitstelle gesendet.', icon:'fa-bell', color:'#fbbf24' },
    { n:3, title:'VERIFIKATION', desc:'Geschulte Operatoren prüfen via IVS-Meta-Infos: Person/Fahrzeug in <30 Sek.', icon:'fa-user-check', color:'#22c55e' },
    { n:4, title:'INTERVENTION', desc:'Operator spricht Täter über Lautsprecher (120 dB) an + initiiert Streifendienst.', icon:'fa-bullhorn', color:'#ef4444' },
    { n:5, title:'DOKUMENTATION', desc:'Clips werden DSGVO-konform 7 Tage gespeichert.', icon:'fa-folder-open', color:'#c084fc' },
  ];

  const EMA_BMA = [
    { l:'Zentrale mit Akku', d:'GSM-Modul & Antenne' },
    { l:'Funk-Repeater', d:'Inkl. Akku' },
    { l:'Funk-Bewegungsmelder', d:'Standard + Variante mit integrierter Kamera' },
    { l:'Funk-Magnetkontakt', d:'Fenster & Türen' },
    { l:'Funk-Glasbruchmelder', d:'Akustisch' },
    { l:'Funk-Rauchmelder & Hitzemelder', d:'BMA-Komponenten' },
    { l:'Funk-Außensirene', d:'Inkl. Akku & Gehäuse' },
    { l:'Funk-Innensirene', d:'Akustische Warnung' },
    { l:'Funk-Bedienteil', d:'Display, PIN & RFID + Akku' },
    { l:'RFID-Schlüsselanhänger', d:'Schnelle Identifikation' },
    { l:'Funk-Fernbedienung', d:'4 Tasten' },
  ];

  function view(d) {
    const root = el('div');

    // Hero
    const hero = el('div', { class:'wwd-hero' });
    hero.innerHTML = `
      <div class="wwd-hero-bg"></div>
      <div class="wwd-hero-content">
        <div class="wwd-brand">
          <span class="wwd-brand-mark">WWD</span>
          <span class="wwd-brand-sub">Dienstleistung GmbH · Partner-Technik</span>
        </div>
        <h1>Intelligente Video-Türme</h1>
        <p class="wwd-hero-lead">
          KWS Video Control · KI-gestützte Bildanalyse · 24/7 Leitstelle ·
          autarke Lösungen · mobile EMA/BMA — alles aus einer Hand
        </p>
        <div class="wwd-hero-stats">
          <div class="wwd-hero-stat"><strong>&lt; 2 Min</strong><span>Alarmverfolgung</span></div>
          <div class="wwd-hero-stat"><strong>&lt; 30 Sek</strong><span>Verifikation</span></div>
          <div class="wwd-hero-stat"><strong>&gt; 200 m</strong><span>Identifizieren</span></div>
          <div class="wwd-hero-stat"><strong>120 dB</strong><span>Lautsprecher</span></div>
        </div>
        <a href="tel:043197994692" class="wwd-cta">
          <i class="fas fa-phone"></i> Angebot anfordern · 0431 97 99 46 92
        </a>
      </div>
    `;
    root.appendChild(hero);

    // Big Tower-Animation
    const animCard = el('div', { class:'card wwd-anim-card' });
    animCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-circle-play"></i>' }),
      el('h3', { text:'Live-Demo · Detektion in Echtzeit' })
    ]));
    if (window.EXPL) {
      // Inject custom WWD explainer
      if (!EXPL.EXPLAINERS['wwd-tower']) {
        EXPL.EXPLAINERS['wwd-tower'] = wwdExplainer();
      }
      EXPL.player('wwd-tower', animCard);
    }
    root.appendChild(animCard);

    // 5-Step Process
    const procCard = el('div', { class:'card mt-16' });
    procCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-shield-halved"></i>' }),
      el('h3', { text:'5-Schritte-Workflow · Detektion bis Intervention' })
    ]));
    const procGrid = el('div', { class:'wwd-steps' });
    STEPS.forEach((s, i) => {
      const stepEl = el('div', { class:'wwd-step', style:`--c:${s.color}` });
      stepEl.innerHTML = `
        <div class="wwd-step-num">${s.n}</div>
        <div class="wwd-step-icon"><i class="fas ${s.icon}"></i></div>
        <div class="wwd-step-title">${s.title}</div>
        <div class="wwd-step-desc">${s.desc}</div>
        ${i < STEPS.length-1 ? '<div class="wwd-step-arrow"><i class="fas fa-arrow-right"></i></div>' : ''}
      `;
      procGrid.appendChild(stepEl);
    });
    procCard.appendChild(procGrid);
    root.appendChild(procCard);

    // Varianten Grid
    const varCard = el('div', { class:'card mt-16' });
    varCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-layer-group"></i>' }),
      el('h3', { text:'4 System-Varianten' })
    ]));
    const varGrid = el('div', { class:'wwd-vars' });
    VARIANTS.forEach(v => {
      const c = el('div', { class:'wwd-var', style:`--c:${v.color}` });
      c.innerHTML = `
        <div class="wwd-var-head">
          <div class="wwd-var-icon"><i class="fas ${v.icon}"></i></div>
          <div>
            <div class="wwd-var-id">VARIANTE ${v.id.toUpperCase()}</div>
            <h4>${v.name}</h4>
          </div>
        </div>
        <div class="wwd-var-einsatz"><strong>Geeignet für:</strong> ${v.einsatz}</div>
        <div class="wwd-var-aus">
          ${v.ausstattung.map(a => `<span class="wwd-aus-pill">${a}</span>`).join('')}
        </div>
      `;
      varGrid.appendChild(c);
    });
    varCard.appendChild(varGrid);
    root.appendChild(varCard);

    // Tech-Specs
    const specCard = el('div', { class:'card mt-16' });
    specCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-microchip"></i>' }),
      el('h3', { text:'Technische Daten · Komplettübersicht' })
    ]));
    const specWrap = el('div', { class:'wwd-specs' });
    SPECS.forEach(s => {
      const sec = el('div', { class:'wwd-spec-sec' });
      sec.appendChild(el('div', { class:'wwd-spec-kat', text: s.kat }));
      const ul = el('ul', { class:'wwd-spec-list' });
      s.items.forEach(it => ul.appendChild(el('li', { text: it })));
      sec.appendChild(ul);
      specWrap.appendChild(sec);
    });
    specCard.appendChild(specWrap);
    root.appendChild(specCard);

    // Mobile EMA/BMA
    const emaCard = el('div', { class:'card mt-16' });
    emaCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-bell"></i>' }),
      el('h3', { text:'Mobile EMA & BMA · Modulare Bausteine (Jablotron)' })
    ]));
    emaCard.appendChild(el('p', { class:'muted', text:'Modulare Funk-Basislösung flexibel als EMA, BMA oder Kombination einsetzbar. Schnelle Montage, ohne Kabelarbeit, skalierbar.' }));
    const emaGrid = el('div', { class:'wwd-ema-grid' });
    EMA_BMA.forEach(e => {
      const c = el('div', { class:'wwd-ema-card' });
      c.innerHTML = `
        <div class="wwd-ema-icon"><i class="fas fa-tower-broadcast"></i></div>
        <div>
          <strong>${e.l}</strong>
          <div class="muted small">${e.d}</div>
        </div>
      `;
      emaGrid.appendChild(c);
    });
    emaCard.appendChild(emaGrid);

    // Kombinationsbeispiele
    const komb = el('div', { class:'wwd-komb' });
    komb.innerHTML = `
      <h4>Kombinationsbeispiele:</h4>
      <div class="wwd-komb-grid">
        <div class="wwd-komb-card">
          <div class="wwd-komb-title">🏗️ Baustellenpaket</div>
          <p>Mobile BMA (Rauch + Hitze) + EMA-Basis mit Bewegungsmeldern + Video Control Mini für Innenbereiche</p>
        </div>
        <div class="wwd-komb-card">
          <div class="wwd-komb-title">🎪 Event-Schutz</div>
          <p>Mobile EMA + 1–2 autarke Video Control Mini als visuelle Überwachung</p>
        </div>
        <div class="wwd-komb-card">
          <div class="wwd-komb-title">🏭 Kombilösung</div>
          <p>Vollständige Integration (EMA + BMA) mit Verifikation über Video Control & Leitstelle</p>
        </div>
      </div>
    `;
    emaCard.appendChild(komb);
    root.appendChild(emaCard);

    // Referenz-Szenario
    const refCard = el('div', { class:'card wwd-ref mt-16' });
    refCard.innerHTML = `
      <div class="card-h">
        <div class="ico"><i class="fas fa-chart-line"></i></div>
        <h3>Referenz-Szenario · Industriepark 15.000 m²</h3>
      </div>
      <div class="wwd-ref-grid">
        <div class="wwd-ref-col">
          <h4>📌 Ausgangslage</h4>
          <p>Industriepark mit hohen Wertgütern – wiederholte Vandalismus-Vorfälle nachts</p>
        </div>
        <div class="wwd-ref-col">
          <h4>🛡️ Lösung</h4>
          <ul>
            <li>KWS Video Control 4x</li>
            <li>Autarker Betrieb</li>
            <li>Integrierte EMA-Sensorik in Lagertoren</li>
            <li>24/7 Leitstellenüberwachung</li>
            <li>Punktuelle Streifendienste bei Verifikation</li>
          </ul>
        </div>
        <div class="wwd-ref-col">
          <h4>📈 Ergebnis nach 6 Monaten</h4>
          <div class="wwd-ref-stat"><strong>−80%</strong><span>bestätigte Vorfälle</span></div>
          <div class="wwd-ref-stat"><strong>&lt; 3 Min</strong><span>Reaktionszeit</span></div>
          <div class="wwd-ref-stat"><strong>0</strong><span>größere Verluste</span></div>
        </div>
      </div>
    `;
    root.appendChild(refCard);

    // DSGVO
    const dsgvoCard = el('div', { class:'card mt-16' });
    dsgvoCard.innerHTML = `
      <div class="card-h">
        <div class="ico" style="color:#c084fc"><i class="fas fa-lock"></i></div>
        <h3>Rechtliches & DSGVO</h3>
      </div>
      <div class="wwd-dsgvo">
        <div class="wwd-dsgvo-item"><i class="fas fa-clock"></i> <strong>Speicherdauer:</strong> Standardmäßig 7 Tage, anpassbar (DSGVO-konform)</div>
        <div class="wwd-dsgvo-item"><i class="fas fa-user-shield"></i> <strong>Zugangskontrolle:</strong> Nur autorisiertes Personal erhält Zugriff</div>
        <div class="wwd-dsgvo-item"><i class="fas fa-sign"></i> <strong>Hinweisschilder:</strong> Sichtbare Kennzeichnung wird mitgeliefert (Schilder + Zaunbanner)</div>
        <div class="wwd-dsgvo-item"><i class="fas fa-shield-halved"></i> <strong>Datensicherheit:</strong> Verschlüsselte Übertragung, gesicherte Speicherung, kontrollierter Zugriff</div>
      </div>
    `;
    root.appendChild(dsgvoCard);

    // Final CTA
    const cta = el('div', { class:'wwd-final-cta' });
    cta.innerHTML = `
      <h3>Sicherheit aus einer Hand</h3>
      <p>Sicherheit entsteht durch sorgfältige Planung, konsequente Qualität und zielgerichtete Umsetzung.</p>
      <a href="tel:043197994692" class="wwd-cta">
        <i class="fas fa-phone"></i> Jetzt Angebot anfordern · 0431 97 99 46 92
      </a>
    `;
    root.appendChild(cta);

    return root;
  }

  function wwdExplainer() {
    return {
      title: 'KWS Video Control · Workflow in Echtzeit',
      intro: 'Detektion → Verifikation → Intervention in <2 Min',
      svg: `
        <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="wwdSky" x2="0" y2="1">
              <stop offset="0" stop-color="#0a0f1a"/>
              <stop offset="1" stop-color="#1e2a44"/>
            </linearGradient>
            <linearGradient id="wwdGround" x2="0" y2="1">
              <stop offset="0" stop-color="#1f3358"/>
              <stop offset="1" stop-color="#0f1a2e"/>
            </linearGradient>
          </defs>
          <rect width="600" height="240" fill="url(#wwdSky)"/>
          <rect y="240" width="600" height="120" fill="url(#wwdGround)"/>

          <!-- ===== TOWER (always visible) ===== -->
          <g id="tower">
            <!-- Base -->
            <rect x="60" y="280" width="60" height="40" fill="#475569"/>
            <!-- Mast -->
            <rect x="84" y="60" width="12" height="220" fill="#94a3b8"/>
            <!-- Top platform -->
            <rect x="50" y="50" width="80" height="14" rx="2" fill="#1e293b" stroke="#94a3b8"/>
            <!-- Cameras (4 dome cameras around top) -->
            <circle cx="60" cy="56" r="6" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/>
            <circle cx="120" cy="56" r="6" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/>
            <circle cx="90" cy="44" r="6" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/>
            <!-- LED strahler -->
            <rect x="68" y="38" width="14" height="8" rx="1" fill="#fbbf24"/>
            <rect x="98" y="38" width="14" height="8" rx="1" fill="#fbbf24"/>
            <!-- Status LED -->
            <circle cx="90" cy="76" r="3" fill="#22c55e">
              <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <!-- Label -->
            <text x="90" y="332" text-anchor="middle" font-size="10" fill="#dc2626" font-family="system-ui" font-weight="800">KWS</text>
          </g>

          <!-- ===== STEP 1: Detection (FOV beam) ===== -->
          <g id="s1-fov" opacity="0">
            <path d="M120 56 L580 80 L580 220 L120 80 Z" fill="rgba(34,211,238,.15)"/>
            <text x="430" y="120" font-size="11" fill="#22d3ee" font-family="system-ui" font-weight="700">25× Zoom · IVS-KI</text>
            <text x="430" y="136" font-size="10" fill="#22d3ee" font-family="system-ui">Beobachten &gt; 900m</text>
          </g>

          <!-- LED-Flutlicht (Step 4) -->
          <g id="s4-light" opacity="0">
            <path d="M75 50 L420 220 L420 280 L75 60 Z" fill="rgba(254,243,199,.18)"/>
            <text x="200" y="200" font-size="11" fill="#fbbf24" font-family="system-ui" font-weight="700">10.000 Lumen</text>
          </g>

          <!-- ===== Person walking (animated) ===== -->
          <g id="person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="540 0; 280 0; 280 0" keyTimes="0; 0.45; 1" dur="14s" repeatCount="indefinite"/>
              <!-- Body -->
              <circle cx="0" cy="244" r="10" fill="#e8edf7"/>
              <rect x="-8" y="254" width="16" height="34" rx="3" fill="#3b82f6"/>
              <!-- Walking legs -->
              <line x1="-5" y1="288" x2="-9" y2="306" stroke="#1e3a8a" stroke-width="4">
                <animate attributeName="x2" values="-9;-5;-9" dur="0.8s" repeatCount="indefinite"/>
              </line>
              <line x1="5" y1="288" x2="9" y2="306" stroke="#1e3a8a" stroke-width="4">
                <animate attributeName="x2" values="9;5;9" dur="0.8s" repeatCount="indefinite"/>
              </line>
              <!-- arms -->
              <line x1="-8" y1="258" x2="-12" y2="278" stroke="#1e3a8a" stroke-width="3"/>
              <line x1="8" y1="258" x2="12" y2="278" stroke="#1e3a8a" stroke-width="3"/>
            </g>
          </g>

          <!-- ===== STEP 2: AI Bounding box around person ===== -->
          <g id="s2-bbox" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="540 0; 280 0; 280 0" keyTimes="0; 0.45; 1" dur="14s" repeatCount="indefinite"/>
              <rect x="-16" y="232" width="32" height="78" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="5 3">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.6s" repeatCount="indefinite"/>
              </rect>
              <rect x="-30" y="218" width="80" height="14" fill="#22c55e"/>
              <text x="10" y="228" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">PERSON 97%</text>
            </g>
          </g>

          <!-- ===== STEP 3: Alarm signal to leitstelle ===== -->
          <g id="s3-leitstelle" opacity="0">
            <!-- Signal arrows from tower to monitor -->
            <path d="M120 76 Q300 30 480 60" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5 5" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="0.5s" repeatCount="indefinite"/>
            </path>
            <!-- Monitor with operator -->
            <rect x="440" y="40" width="120" height="80" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
            <rect x="448" y="48" width="104" height="58" fill="#22d3ee" opacity=".18"/>
            <rect x="450" y="50" width="100" height="54" fill="#0a0f1a"/>
            <circle cx="475" cy="78" r="8" fill="#e8edf7"/>
            <rect x="467" y="86" width="16" height="14" fill="#3b82f6"/>
            <rect x="495" y="56" width="50" height="4" fill="#22d3ee" opacity=".5"/>
            <rect x="495" y="64" width="40" height="3" fill="#94a3b8" opacity=".5"/>
            <rect x="495" y="71" width="44" height="3" fill="#94a3b8" opacity=".5"/>
            <circle cx="540" cy="56" r="3" fill="#ef4444">
              <animate attributeName="opacity" values="1;.3;1" dur="0.6s" repeatCount="indefinite"/>
            </circle>
            <text x="500" y="135" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="system-ui" font-weight="700">24/7 Leitstelle</text>
          </g>

          <!-- ===== STEP 4: Loudspeaker announcement ===== -->
          <g id="s4-speaker" opacity="0">
            <!-- Speaker icon on tower -->
            <rect x="84" y="86" width="12" height="14" rx="2" fill="#dc2626"/>
            <!-- Sound waves -->
            <g stroke="#dc2626" stroke-width="2" fill="none">
              <path d="M100 88 q8 5 0 10">
                <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite"/>
              </path>
              <path d="M108 84 q14 9 0 18">
                <animate attributeName="opacity" values="0;1;0" dur="0.6s" begin="0.15s" repeatCount="indefinite"/>
              </path>
              <path d="M118 80 q20 13 0 26">
                <animate attributeName="opacity" values="0;1;0" dur="0.6s" begin="0.3s" repeatCount="indefinite"/>
              </path>
            </g>
            <!-- Bubble text -->
            <rect x="140" y="110" width="180" height="36" rx="6" fill="#dc2626"/>
            <text x="230" y="124" text-anchor="middle" font-size="10" fill="white" font-family="system-ui" font-weight="700">"Sie befinden sich im</text>
            <text x="230" y="138" text-anchor="middle" font-size="10" fill="white" font-family="system-ui" font-weight="700">überwachten Bereich!"</text>
            <text x="230" y="158" text-anchor="middle" font-size="10" fill="#dc2626" font-family="system-ui" font-weight="800">120 dB</text>
          </g>

          <!-- ===== STEP 5: Storage + intervention ===== -->
          <g id="s5-storage" opacity="0">
            <rect x="430" y="270" width="140" height="70" rx="6" fill="#1e293b" stroke="#c084fc" stroke-width="2"/>
            <text x="500" y="288" text-anchor="middle" font-size="10" fill="#c084fc" font-family="system-ui" font-weight="800">NVR · 2 TB</text>
            <text x="500" y="306" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">7 Tage</text>
            <text x="500" y="320" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">DSGVO-konform</text>
            <circle cx="465" cy="288" r="3" fill="#22c55e"><animate attributeName="opacity" values="1;.4;1" dur="1.5s" repeatCount="indefinite"/></circle>
          </g>

          <!-- ===== Status badge (top-right) ===== -->
          <g id="status" opacity="0">
            <rect x="420" y="14" width="160" height="22" rx="4" fill="#ef4444">
              <animate attributeName="opacity" values=".5;1;.5" dur="0.6s" repeatCount="indefinite"/>
            </rect>
            <text x="500" y="29" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="800">⚠ EINDRINGEN DETEKTIERT</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['tower'],                                text:'① Der KWS Video Control Tower überwacht das Gelände rund um die Uhr — 24/7 mit Auto-Tracking und KI-Bildanalyse.' },
        { t: 3500, h: ['s1-fov','person'],                      text:'② DETEKTION: Eine Person betritt den Erfassungsbereich der Dome-Kamera (25× Zoom, IR bis 100 m). Die IVS-KI erkennt die Bewegung automatisch.' },
        { t: 7500, h: ['s2-bbox','status'],                     text:'③ KI-VERIFIKATION: Die Bildanalyse klassifiziert das Objekt in &lt; 30 Sek: PERSON 97% Konfidenz. Bounding-Box und Meta-Infos werden generiert.' },
        { t: 11500,h: ['s3-leitstelle'],                        text:'④ ALARM-MELDUNG: Hochauflösende Videosequenz geht an die 24/7 besetzte Leitstelle. Operator sieht das Geschehen live.' },
        { t: 15500,h: ['s4-light','s4-speaker'],                text:'⑤ INTERVENTION: Operator schaltet 10.000-Lumen-Flutlicht ein und spricht den Eindringling über 120-dB-Lautsprecher an. Funkstreife wird parallel alarmiert.' },
        { t: 19500,h: ['s5-storage'],                           text:'⑥ DOKUMENTATION: Der gesamte Vorgang wird DSGVO-konform 7 Tage gespeichert. Beweissichere Aufzeichnung für Polizei und Versicherung.' },
      ],
      cycle: 24000,
    };
  }

  return { view };
})();
