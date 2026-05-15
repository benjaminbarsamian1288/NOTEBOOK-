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
      title: 'KWS Video Control · Cinematic Scenario',
      intro: 'Nächtlicher Einbruchsversuch · Detektion → Intervention in <2 Min',
      svg: `
        <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <defs>
            <linearGradient id="cinSky" x2="0" y2="1">
              <stop offset="0" stop-color="#020617"/>
              <stop offset=".5" stop-color="#0c1429"/>
              <stop offset="1" stop-color="#1e2a44"/>
            </linearGradient>
            <linearGradient id="cinGround" x2="0" y2="1">
              <stop offset="0" stop-color="#16223e"/>
              <stop offset="1" stop-color="#070b18"/>
            </linearGradient>
            <radialGradient id="moonGlow" cx=".5" cy=".5">
              <stop offset="0" stop-color="rgba(226,232,240,.5)"/>
              <stop offset="1" stop-color="rgba(226,232,240,0)"/>
            </radialGradient>
            <radialGradient id="lampGlow" cx=".5" cy=".5">
              <stop offset="0" stop-color="rgba(254,243,199,.7)"/>
              <stop offset="1" stop-color="rgba(254,243,199,0)"/>
            </radialGradient>
            <linearGradient id="irBeam" x2="1" y2="0">
              <stop offset="0" stop-color="rgba(34,211,238,.35)"/>
              <stop offset="1" stop-color="rgba(34,211,238,0)"/>
            </linearGradient>
            <linearGradient id="floodBeam" x2="1" y2="1">
              <stop offset="0" stop-color="rgba(254,243,199,.55)"/>
              <stop offset="1" stop-color="rgba(254,243,199,0)"/>
            </linearGradient>
            <filter id="blur1"><feGaussianBlur stdDeviation="2"/></filter>
            <filter id="glow"><feGaussianBlur stdDeviation="3"/></filter>
          </defs>

          <!-- ===== SKY + STARS + MOON ===== -->
          <rect width="900" height="340" fill="url(#cinSky)"/>
          <rect y="340" width="900" height="160" fill="url(#cinGround)"/>
          <g fill="#e2e8f0" opacity=".8">
            <circle cx="80" cy="40" r="0.8"/><circle cx="180" cy="70" r="0.6"/>
            <circle cx="260" cy="30" r="1"/><circle cx="340" cy="90" r="0.7"/>
            <circle cx="420" cy="50" r="0.6"/><circle cx="540" cy="80" r="0.9"/>
            <circle cx="640" cy="30" r="0.7"/><circle cx="740" cy="60" r="0.8"/>
            <circle cx="820" cy="90" r="0.6"/><circle cx="60" cy="120" r="0.6"/>
            <circle cx="490" cy="120" r="0.5"/><circle cx="710" cy="110" r="0.7"/>
            <circle cx="220" cy="140" r="0.5"/><circle cx="380" cy="160" r="0.4"/>
            <animate attributeName="opacity" values=".8;.4;.8" dur="3s" repeatCount="indefinite"/>
          </g>
          <!-- Moon -->
          <circle cx="780" cy="80" r="42" fill="url(#moonGlow)"/>
          <circle cx="780" cy="80" r="22" fill="#f1f5f9"/>
          <circle cx="772" cy="73" r="3" fill="#cbd5e1" opacity=".6"/>
          <circle cx="785" cy="85" r="4" fill="#cbd5e1" opacity=".5"/>
          <circle cx="775" cy="92" r="2" fill="#cbd5e1" opacity=".4"/>

          <!-- ===== FOG layers ===== -->
          <ellipse cx="450" cy="380" rx="500" ry="22" fill="rgba(148,163,184,.12)" filter="url(#blur1)">
            <animate attributeName="cx" values="430;470;430" dur="20s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="700" cy="420" rx="350" ry="18" fill="rgba(148,163,184,.10)" filter="url(#blur1)">
            <animate attributeName="cx" values="680;720;680" dur="25s" repeatCount="indefinite"/>
          </ellipse>

          <!-- ===== BACKGROUND BUILDINGS (silhouettes) ===== -->
          <g fill="#0b1424" opacity=".95">
            <rect x="180" y="220" width="120" height="120"/>
            <rect x="310" y="260" width="80"  height="80"/>
            <rect x="600" y="240" width="140" height="100"/>
            <rect x="750" y="280" width="80"  height="60"/>
          </g>
          <!-- Windows of buildings (yellow squares) -->
          <g fill="#fbbf24" opacity=".5">
            <rect x="195" y="240" width="8" height="10"/><rect x="215" y="240" width="8" height="10"/>
            <rect x="235" y="240" width="8" height="10"/><rect x="255" y="240" width="8" height="10"/>
            <rect x="195" y="270" width="8" height="10"/><rect x="235" y="270" width="8" height="10"/>
            <rect x="195" y="300" width="8" height="10"/><rect x="255" y="300" width="8" height="10"/>
            <rect x="620" y="260" width="10" height="12"/><rect x="650" y="260" width="10" height="12"/>
            <rect x="680" y="260" width="10" height="12"/><rect x="710" y="260" width="10" height="12"/>
            <rect x="620" y="290" width="10" height="12"/><rect x="680" y="290" width="10" height="12"/>
            <rect x="620" y="320" width="10" height="12"/><rect x="710" y="320" width="10" height="12"/>
          </g>

          <!-- ===== Industrial floodlight pole (left) ===== -->
          <g>
            <rect x="40" y="220" width="3" height="140" fill="#475569"/>
            <rect x="32" y="216" width="20" height="6" fill="#475569"/>
            <ellipse cx="42" cy="225" rx="80" ry="60" fill="url(#lampGlow)" opacity=".4"/>
          </g>

          <!-- ===== FENCE (chain-link silhouette) ===== -->
          <g stroke="#1e293b" stroke-width="1.2" fill="none">
            <line x1="0" y1="380" x2="900" y2="380"/>
            <line x1="0" y1="450" x2="900" y2="450"/>
            <line x1="0" y1="380" x2="0" y2="450"/>
            ${Array.from({length: 30}, (_,i) => `<line x1="${i*30}" y1="380" x2="${i*30}" y2="450"/>`).join('')}
            ${Array.from({length: 30}, (_,i) => `<line x1="${i*30}" y1="385" x2="${(i+1)*30}" y2="445" stroke-width=".6" opacity=".6"/>`).join('')}
            ${Array.from({length: 30}, (_,i) => `<line x1="${i*30}" y1="445" x2="${(i+1)*30}" y2="385" stroke-width=".6" opacity=".6"/>`).join('')}
          </g>
          <!-- Hinweisschild am Zaun -->
          <g transform="translate(740,388)">
            <rect width="60" height="36" fill="#dc2626" stroke="#fbbf24" stroke-width="1.5"/>
            <text x="30" y="14" text-anchor="middle" font-size="8" fill="white" font-family="system-ui" font-weight="800">VIDEO-</text>
            <text x="30" y="24" text-anchor="middle" font-size="8" fill="white" font-family="system-ui" font-weight="800">ÜBERWACHT</text>
            <text x="30" y="32" text-anchor="middle" font-size="6" fill="#fbbf24" font-family="system-ui">WWD · 24/7</text>
          </g>

          <!-- ===== TOWER (always visible, ALL features built-in) ===== -->
          <g id="tower">
            <!-- Beton-Sockel -->
            <rect x="120" y="380" width="80" height="50" fill="#334155"/>
            <rect x="115" y="378" width="90" height="6" fill="#475569"/>
            <text x="160" y="408" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui" font-weight="700">KWS</text>
            <!-- Hauptmast -->
            <rect x="155" y="80" width="10" height="300" fill="#94a3b8"/>
            <line x1="155" y1="200" x2="165" y2="220" stroke="#64748b" stroke-width="1"/>
            <line x1="155" y1="240" x2="165" y2="260" stroke="#64748b" stroke-width="1"/>
            <line x1="155" y1="280" x2="165" y2="300" stroke="#64748b" stroke-width="1"/>
            <line x1="155" y1="320" x2="165" y2="340" stroke="#64748b" stroke-width="1"/>
            <!-- Top platform -->
            <rect x="115" y="68" width="90" height="14" rx="2" fill="#1e293b" stroke="#94a3b8"/>
            <rect x="118" y="62" width="84" height="6" fill="#475569"/>
            <!-- 4 Dome-Kameras am Top -->
            <g id="cam1"><circle cx="125" cy="74" r="6" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/><circle cx="125" cy="74" r="2" fill="#dc2626"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></circle></g>
            <g id="cam2"><circle cx="160" cy="58" r="6" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/><circle cx="160" cy="58" r="2" fill="#dc2626"><animate attributeName="opacity" values="1;.4;1" dur="2s" begin=".5s" repeatCount="indefinite"/></circle></g>
            <g id="cam3"><circle cx="195" cy="74" r="6" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/><circle cx="195" cy="74" r="2" fill="#dc2626"><animate attributeName="opacity" values="1;.4;1" dur="2s" begin="1s" repeatCount="indefinite"/></circle></g>
            <!-- LED-Strahler (Doppelpaar) -->
            <rect x="120" y="52" width="22" height="10" rx="1" fill="#334155" stroke="#fbbf24" stroke-width=".5"/>
            <rect x="124" y="55" width="14" height="4" fill="#fbbf24"/>
            <rect x="178" y="52" width="22" height="10" rx="1" fill="#334155" stroke="#fbbf24" stroke-width=".5"/>
            <rect x="182" y="55" width="14" height="4" fill="#fbbf24"/>
            <!-- Antenne -->
            <line x1="160" y1="62" x2="160" y2="38" stroke="#94a3b8" stroke-width="1.5"/>
            <circle cx="160" cy="38" r="2" fill="#dc2626"><animate attributeName="opacity" values="1;.2;1" dur="1.5s" repeatCount="indefinite"/></circle>
            <!-- Solar panels (auf der Seite) -->
            <g transform="translate(110,140) rotate(-20)">
              <rect width="40" height="22" fill="#1e3a8a" stroke="#3b82f6"/>
              <line x1="10" y1="0" x2="10" y2="22" stroke="#3b82f6" stroke-width=".3"/>
              <line x1="20" y1="0" x2="20" y2="22" stroke="#3b82f6" stroke-width=".3"/>
              <line x1="30" y1="0" x2="30" y2="22" stroke="#3b82f6" stroke-width=".3"/>
            </g>
            <!-- Lautsprecher -->
            <rect x="148" y="100" width="14" height="18" rx="2" fill="#dc2626"/>
            <rect x="150" y="103" width="10" height="12" fill="#7f1d1d"/>
            <!-- NVR-Box am Boden -->
            <rect x="125" y="395" width="20" height="12" rx="1" fill="#1e293b" stroke="#22c55e" stroke-width=".8"/>
            <circle cx="142" cy="401" r="1.2" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
          </g>

          <!-- ===== STEP 1: Camera SWEEP beams (idle scanning) ===== -->
          <g id="s1-sweep" opacity="0">
            <path d="M160 64 L320 220 L600 200 L160 64 Z" fill="url(#irBeam)">
              <animateTransform attributeName="transform" type="rotate" values="0 160 64;5 160 64;0 160 64;-5 160 64;0 160 64" dur="6s" repeatCount="indefinite"/>
            </path>
            <text x="450" y="180" font-size="13" fill="#22d3ee" font-family="system-ui" font-weight="800" filter="url(#glow)">25× ZOOM · IR 100m · IVS-KI</text>
            <text x="450" y="200" font-size="11" fill="#22d3ee" font-family="system-ui" opacity=".9">Beobachten &gt; 900m · Identifizieren &gt; 200m</text>
          </g>

          <!-- ===== STEP 2: Car approaches (intruder vehicle) ===== -->
          <g id="s2-vehicle" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="950 0; 580 0; 580 0" keyTimes="0; .5; 1" dur="9s" repeatCount="indefinite"/>
              <!-- Schatten -->
              <ellipse cx="0" cy="468" rx="55" ry="4" fill="#000" opacity=".5"/>
              <!-- Body -->
              <rect x="-50" y="430" width="100" height="22" rx="3" fill="#1e293b" stroke="#475569"/>
              <rect x="-40" y="412" width="60" height="22" rx="6" fill="#0f172a" stroke="#475569"/>
              <!-- Windows -->
              <rect x="-35" y="416" width="22" height="14" fill="#1e293b"/>
              <rect x="-10" y="416" width="22" height="14" fill="#1e293b"/>
              <!-- Wheels -->
              <circle cx="-30" cy="455" r="8" fill="#0a0f1a" stroke="#475569" stroke-width="1.5"/>
              <circle cx="30" cy="455" r="8" fill="#0a0f1a" stroke="#475569" stroke-width="1.5"/>
              <circle cx="-30" cy="455" r="3" fill="#475569"/>
              <circle cx="30" cy="455" r="3" fill="#475569"/>
              <!-- Headlights -->
              <rect x="-52" y="436" width="4" height="6" rx="1" fill="#fef3c7"/>
              <path d="M-52 432 L-110 420 L-110 458 L-52 446 Z" fill="rgba(254,243,199,.35)" filter="url(#blur1)"/>
              <!-- Tail lights -->
              <rect x="48" y="436" width="4" height="6" rx="1" fill="#ef4444"/>
            </g>
          </g>

          <!-- ===== STEP 3: Person sneaking out of car ===== -->
          <g id="s3-person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="600 0; 600 0; 450 0; 380 0" keyTimes="0; .15; .6; 1" dur="11s" repeatCount="indefinite"/>
              <!-- Body shadow -->
              <ellipse cx="0" cy="468" rx="14" ry="3" fill="#000" opacity=".4"/>
              <!-- Hoodie body -->
              <ellipse cx="0" cy="416" rx="12" ry="14" fill="#1e293b"/>
              <!-- Head -->
              <circle cx="0" cy="404" r="9" fill="#0f172a"/>
              <circle cx="0" cy="406" r="6" fill="#1e293b"/>
              <!-- Eyes -->
              <circle cx="-2.5" cy="406" r="0.8" fill="#fbbf24"/>
              <circle cx="2.5" cy="406" r="0.8" fill="#fbbf24"/>
              <!-- Torso -->
              <rect x="-9" y="426" width="18" height="26" rx="3" fill="#1e293b"/>
              <!-- Legs (walking cycle) -->
              <rect x="-6" y="452" width="5" height="16" rx="2" fill="#0f172a">
                <animate attributeName="height" values="16;18;16" dur="0.5s" repeatCount="indefinite"/>
              </rect>
              <rect x="1" y="452" width="5" height="16" rx="2" fill="#0f172a">
                <animate attributeName="height" values="18;16;18" dur="0.5s" repeatCount="indefinite"/>
              </rect>
              <!-- Arms holding bag -->
              <rect x="-13" y="430" width="4" height="14" rx="1.5" fill="#1e293b" transform="rotate(-15 -11 437)"/>
              <rect x="9" y="430" width="4" height="14" rx="1.5" fill="#1e293b" transform="rotate(15 11 437)"/>
              <!-- Bag (Beute) -->
              <rect x="-8" y="442" width="16" height="10" rx="2" fill="#3f3f46"/>
            </g>
          </g>

          <!-- ===== STEP 4: AI Bounding boxes (vehicle + person classified) ===== -->
          <g id="s4-bbox-veh" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="580 0; 580 0" dur="11s" repeatCount="indefinite"/>
              <rect x="-58" y="408" width="116" height="58" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 3">
                <animate attributeName="stroke-dashoffset" values="0;-18" dur="0.5s" repeatCount="indefinite"/>
              </rect>
              <rect x="-58" y="392" width="100" height="14" fill="#fbbf24"/>
              <text x="-8" y="402" text-anchor="middle" font-size="9" fill="#0b1424" font-family="monospace" font-weight="800">VEHICLE · 94%</text>
            </g>
          </g>
          <g id="s4-bbox-person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="600 0; 600 0; 450 0; 380 0" keyTimes="0; .15; .6; 1" dur="11s" repeatCount="indefinite"/>
              <rect x="-15" y="394" width="30" height="76" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 3">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.4s" repeatCount="indefinite"/>
              </rect>
              <rect x="-30" y="378" width="80" height="14" fill="#ef4444"/>
              <text x="10" y="388" text-anchor="middle" font-size="9" fill="white" font-family="monospace" font-weight="800">PERSON · 97%</text>
              <!-- Crosshair -->
              <line x1="-22" y1="430" x2="-18" y2="430" stroke="#ef4444" stroke-width="1.5"/>
              <line x1="18" y1="430" x2="22" y2="430" stroke="#ef4444" stroke-width="1.5"/>
              <line x1="0" y1="386" x2="0" y2="390" stroke="#ef4444" stroke-width="1.5"/>
            </g>
          </g>

          <!-- ===== STEP 5: Leitstelle Multi-Monitor ===== -->
          <g id="s5-leitstelle" opacity="0">
            <!-- Signal line tower → leitstelle -->
            <path d="M205 70 Q500 20 800 30" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="6 4" fill="none">
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="0.4s" repeatCount="indefinite"/>
            </path>
            <!-- Leitstelle Container -->
            <rect x="600" y="20" width="290" height="160" rx="6" fill="#0a0f1a" stroke="#fbbf24" stroke-width="2"/>
            <rect x="605" y="22" width="280" height="14" fill="#1e293b"/>
            <text x="745" y="32" text-anchor="middle" font-size="9" fill="#fbbf24" font-family="monospace" font-weight="800">WWD LEITSTELLE · LIVE</text>
            <circle cx="615" cy="29" r="2" fill="#ef4444"><animate attributeName="opacity" values="1;.3;1" dur="0.5s" repeatCount="indefinite"/></circle>
            <circle cx="622" cy="29" r="2" fill="#fbbf24"/>
            <circle cx="629" cy="29" r="2" fill="#22c55e"/>
            <!-- 4 monitor cells -->
            <g stroke="#334155" stroke-width=".5">
              <rect x="610" y="40" width="65" height="38" fill="#0c1018"/>
              <rect x="680" y="40" width="65" height="38" fill="#0c1018"/>
              <rect x="750" y="40" width="65" height="38" fill="#1f2937"/>
              <rect x="820" y="40" width="65" height="38" fill="#0c1018"/>
              <rect x="610" y="83" width="135" height="60" fill="#0c1018"/>
              <rect x="750" y="83" width="135" height="60" fill="#0c1018"/>
            </g>
            <!-- Cam 1 thumbnail (mit person silhouette) -->
            <text x="613" y="49" font-size="6" fill="#22d3ee" font-family="monospace">CAM01</text>
            <circle cx="642" cy="64" r="2.5" fill="#94a3b8"/>
            <rect x="640" y="67" width="4" height="7" fill="#94a3b8"/>
            <rect x="612" y="74" width="61" height="3" fill="#ef4444" opacity=".5"/>
            <!-- Cam 2 -->
            <text x="683" y="49" font-size="6" fill="#22d3ee" font-family="monospace">CAM02</text>
            <rect x="710" y="60" width="20" height="10" fill="#475569"/>
            <circle cx="715" cy="73" r="2" fill="#0a0f1a"/>
            <circle cx="727" cy="73" r="2" fill="#0a0f1a"/>
            <!-- Cam 3 highlighted (active) -->
            <rect x="750" y="40" width="65" height="38" fill="none" stroke="#ef4444" stroke-width="1.5"/>
            <text x="753" y="49" font-size="6" fill="#ef4444" font-family="monospace" font-weight="700">CAM03 ⚠</text>
            <circle cx="782" cy="63" r="3" fill="#0f172a"/>
            <rect x="779" y="66" width="6" height="9" fill="#1e293b"/>
            <rect x="751" y="74" width="63" height="3" fill="#ef4444">
              <animate attributeName="opacity" values="1;.4;1" dur=".4s" repeatCount="indefinite"/>
            </rect>
            <!-- Cam 4 -->
            <text x="823" y="49" font-size="6" fill="#22d3ee" font-family="monospace">CAM04</text>
            <!-- Big monitor: zoomed PERSON view -->
            <rect x="613" y="88" width="129" height="50" fill="#0a0f1a"/>
            <circle cx="678" cy="108" r="8" fill="#0f172a"/>
            <rect x="670" y="115" width="16" height="22" fill="#1e293b"/>
            <rect x="613" y="138" width="129" height="5" fill="#ef4444"/>
            <text x="678" y="142.5" text-anchor="middle" font-size="5" fill="white" font-family="monospace" font-weight="800">⚠ INTRUDER 97%</text>
            <text x="618" y="96" font-size="5" fill="#22d3ee" font-family="monospace">REC ●</text>
            <circle cx="635" cy="94" r="1.5" fill="#ef4444"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></circle>
            <!-- Right: Operator stats + map -->
            <rect x="752" y="88" width="131" height="50" fill="#0a0f1a"/>
            <text x="758" y="98" font-size="6" fill="#22c55e" font-family="monospace">STATUS: ALARM</text>
            <text x="758" y="108" font-size="6" fill="#94a3b8" font-family="monospace">TIME: 02:47:18</text>
            <text x="758" y="118" font-size="6" fill="#94a3b8" font-family="monospace">SITE: AREAL-NORD</text>
            <text x="758" y="128" font-size="6" fill="#fbbf24" font-family="monospace">DISPATCHING...</text>
            <!-- Operator -->
            <g transform="translate(620,150)">
              <circle cx="0" cy="6" r="5" fill="#fbbf24"/>
              <rect x="-7" y="12" width="14" height="14" fill="#1e3a8a"/>
              <text x="20" y="14" font-size="7" fill="#fbbf24" font-family="system-ui" font-weight="700">Operator · ${'>'}30 Sek Verifikation</text>
            </g>
            <!-- Headset mic glow -->
            <circle cx="615" cy="160" r="8" fill="#fbbf24" opacity=".2"><animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/></circle>
          </g>

          <!-- ===== STEP 6: 10.000 Lumen FLOOD LIGHT + 120dB Lautsprecher ===== -->
          <g id="s6-flood" opacity="0">
            <!-- Flood-Beam, animiert pulsierend -->
            <path d="M140 60 L520 280 L520 420 L140 75 Z" fill="url(#floodBeam)">
              <animate attributeName="opacity" values=".5;1;.5" dur=".3s" repeatCount="indefinite"/>
            </path>
            <path d="M180 60 L580 280 L580 420 L180 75 Z" fill="url(#floodBeam)" opacity=".7"/>
            <!-- Strobe rings on light heads -->
            <circle cx="130" cy="57" r="6" fill="#fef3c7"><animate attributeName="opacity" values="0;1;0" dur=".25s" repeatCount="indefinite"/></circle>
            <circle cx="190" cy="57" r="6" fill="#fef3c7"><animate attributeName="opacity" values="1;0;1" dur=".25s" repeatCount="indefinite"/></circle>
            <text x="380" y="220" font-size="14" fill="#fef3c7" font-family="system-ui" font-weight="900" filter="url(#glow)">10.000 LUMEN</text>
          </g>

          <g id="s6-speaker" opacity="0">
            <!-- Sound waves cascading -->
            <g stroke="#dc2626" stroke-width="2.5" fill="none" filter="url(#glow)">
              <path d="M165 108 q15 8 0 18"><animate attributeName="opacity" values="0;1;0" dur=".5s" repeatCount="indefinite"/></path>
              <path d="M180 100 q25 14 0 32"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin=".15s" repeatCount="indefinite"/></path>
              <path d="M200 90 q40 22 0 50"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin=".3s" repeatCount="indefinite"/></path>
              <path d="M225 80 q55 30 0 70"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin=".45s" repeatCount="indefinite"/></path>
            </g>
            <!-- Speech bubble -->
            <g>
              <rect x="280" y="170" width="280" height="60" rx="8" fill="#dc2626" stroke="#fbbf24" stroke-width="2"/>
              <polygon points="280,200 260,210 280,215" fill="#dc2626"/>
              <text x="420" y="190" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="900">⚠ STOPP!</text>
              <text x="420" y="206" text-anchor="middle" font-size="10" fill="white" font-family="system-ui">Sie befinden sich im VIDEOÜBERWACHTEN</text>
              <text x="420" y="218" text-anchor="middle" font-size="10" fill="white" font-family="system-ui">Bereich. Die Polizei ist unterwegs.</text>
            </g>
            <!-- 120 dB Badge -->
            <g transform="translate(260,242)">
              <rect width="80" height="22" rx="11" fill="#fbbf24"/>
              <text x="40" y="15" text-anchor="middle" font-size="11" fill="#7f1d1d" font-family="system-ui" font-weight="900">120 dB</text>
            </g>
          </g>

          <!-- ===== STEP 7: Police arriving (red/blue strobes) ===== -->
          <g id="s7-police" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="-200 0; 60 0; 60 0" keyTimes="0; .5; 1" dur="6s" repeatCount="indefinite"/>
              <!-- Schatten -->
              <ellipse cx="0" cy="468" rx="60" ry="4" fill="#000" opacity=".5"/>
              <!-- Body -->
              <rect x="-55" y="430" width="110" height="22" rx="3" fill="#e2e8f0" stroke="#1e293b"/>
              <rect x="-45" y="412" width="65" height="22" rx="6" fill="#cbd5e1" stroke="#1e293b"/>
              <!-- POLIZEI streifen (blau) -->
              <rect x="-55" y="445" width="110" height="4" fill="#22d3ee" opacity=".8"/>
              <text x="-15" y="447" font-size="7" fill="#1e293b" font-family="system-ui" font-weight="900">POLIZEI</text>
              <!-- Windows -->
              <rect x="-40" y="416" width="25" height="14" fill="#1e293b"/>
              <rect x="-10" y="416" width="25" height="14" fill="#1e293b"/>
              <!-- Wheels -->
              <circle cx="-35" cy="455" r="8" fill="#0a0f1a" stroke="#475569" stroke-width="1.5"/>
              <circle cx="35" cy="455" r="8" fill="#0a0f1a" stroke="#475569" stroke-width="1.5"/>
              <!-- Blaulicht-Balken auf dem Dach -->
              <rect x="-25" y="406" width="50" height="6" rx="1" fill="#0a0f1a"/>
              <!-- 4 alternating strobes -->
              <circle cx="-18" cy="409" r="3.5" fill="#22d3ee"><animate attributeName="opacity" values="1;0;1;0;1" dur=".6s" repeatCount="indefinite"/></circle>
              <circle cx="-6" cy="409" r="3.5" fill="#ef4444"><animate attributeName="opacity" values="0;1;0;1;0" dur=".6s" repeatCount="indefinite"/></circle>
              <circle cx="6" cy="409" r="3.5" fill="#22d3ee"><animate attributeName="opacity" values="0;1;0;1;0" dur=".6s" repeatCount="indefinite"/></circle>
              <circle cx="18" cy="409" r="3.5" fill="#ef4444"><animate attributeName="opacity" values="1;0;1;0;1" dur=".6s" repeatCount="indefinite"/></circle>
              <!-- Light glow above car -->
              <ellipse cx="0" cy="408" rx="60" ry="20" fill="#22d3ee" opacity=".15"><animate attributeName="opacity" values=".15;.35;.15" dur=".6s" repeatCount="indefinite"/></ellipse>
              <ellipse cx="0" cy="408" rx="55" ry="18" fill="#ef4444" opacity=".15"><animate attributeName="opacity" values=".35;.15;.35" dur=".6s" repeatCount="indefinite"/></ellipse>
              <!-- Headlights cone -->
              <path d="M-57 432 L-130 422 L-130 458 L-57 446 Z" fill="rgba(254,243,199,.3)" filter="url(#blur1)"/>
            </g>
          </g>

          <!-- ===== STEP 8: NVR Archive ===== -->
          <g id="s8-archive" opacity="0">
            <rect x="50" y="260" width="180" height="100" rx="8" fill="#0a0f1a" stroke="#c084fc" stroke-width="2.5"/>
            <text x="140" y="280" text-anchor="middle" font-size="13" fill="#c084fc" font-family="system-ui" font-weight="900">📼 NVR · 2 TB</text>
            <text x="140" y="296" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui">7 Tage · DSGVO-konform</text>
            <!-- Clip thumbnails -->
            <g fill="#1e293b" stroke="#22c55e" stroke-width=".8">
              <rect x="62" y="306" width="36" height="22"/>
              <rect x="102" y="306" width="36" height="22"/>
              <rect x="142" y="306" width="36" height="22"/>
              <rect x="182" y="306" width="36" height="22"/>
            </g>
            <text x="80" y="318" text-anchor="middle" font-size="5" fill="#22c55e" font-family="monospace">02:47:18</text>
            <text x="120" y="318" text-anchor="middle" font-size="5" fill="#22c55e" font-family="monospace">02:47:35</text>
            <text x="160" y="318" text-anchor="middle" font-size="5" fill="#22c55e" font-family="monospace">02:47:52</text>
            <text x="200" y="318" text-anchor="middle" font-size="5" fill="#22c55e" font-family="monospace">02:48:09</text>
            <text x="140" y="346" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui" font-weight="700">✓ Beweissicher gespeichert</text>
          </g>

          <!-- ===== STATUS HEADER (top, switches) ===== -->
          <g id="status-idle">
            <rect x="20" y="14" width="200" height="22" rx="4" fill="#22c55e" opacity=".85"/>
            <circle cx="30" cy="25" r="3" fill="#0b1424"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
            <text x="124" y="29" text-anchor="middle" font-size="11" fill="#0b1424" font-family="system-ui" font-weight="800">🛡 SYSTEM AKTIV · 24/7</text>
          </g>
          <g id="status-alarm" opacity="0">
            <rect x="20" y="14" width="240" height="22" rx="4" fill="#ef4444">
              <animate attributeName="opacity" values=".4;1;.4" dur=".4s" repeatCount="indefinite"/>
            </rect>
            <text x="140" y="29" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="900">⚠⚠⚠ ALARM · EINBRUCH DETEKTIERT</text>
          </g>

          <!-- ===== TIMESTAMP overlay (top-right corner) ===== -->
          <g>
            <rect x="720" y="14" width="160" height="22" rx="3" fill="rgba(0,0,0,.7)" stroke="#22d3ee" stroke-width=".5"/>
            <circle cx="732" cy="25" r="3" fill="#ef4444"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></circle>
            <text x="740" y="29" font-size="10" fill="#22d3ee" font-family="monospace" font-weight="700">REC ● 02:47:18</text>
          </g>

          <!-- ===== Screen shake on alarm (subtle camera shake) ===== -->
          <g id="shake-screen" opacity="0">
            <rect width="900" height="500" fill="none" stroke="#ef4444" stroke-width="6" opacity=".4"/>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,     h: ['status-idle','s1-sweep'],                                                  text:'🌙 <strong>02:46 Uhr · Nacht</strong> — Industriegelände 15.000 m². Der KWS-Turm scannt mit 25× Zoom und Laser-IR (100 m). 24/7 wachsam.' },
        { t: 4000,  h: ['status-idle','s2-vehicle'],                                                 text:'🚗 <strong>VERDÄCHTIGES FAHRZEUG</strong> — Ein Wagen fährt mit Scheinwerfern langsam aufs Areal. Die Dome-Kamera erfasst es bei > 200 m.' },
        { t: 8000,  h: ['s2-vehicle','s4-bbox-veh','s3-person'],                                     text:'👤 <strong>PERSON STEIGT AUS</strong> — KI-Klassifikation: VEHICLE 94 %. Sekunden später erkennt das System: vermummte Person, dunkle Kleidung, Tasche.' },
        { t: 12000, h: ['s3-person','s4-bbox-person','status-alarm','shake-screen'],                 text:'🚨 <strong>KI-ALARM · &lt; 30 SEK</strong> — Bounding-Box PERSON 97 %. Crosshair-Tracking, automatische Klassifikation, Alarm an Leitstelle ausgelöst.' },
        { t: 16500, h: ['s3-person','s4-bbox-person','s5-leitstelle','status-alarm'],                text:'📡 <strong>LEITSTELLE</strong> — Hochauflösender Live-Feed bei WWD-Operator. Verifikation, Dispatch, Polizei wird kontaktiert. Vorgang läuft.' },
        { t: 21000, h: ['s3-person','s4-bbox-person','s5-leitstelle','s6-flood','s6-speaker','status-alarm'], text:'💡🔊 <strong>INTERVENTION</strong> — 10.000-Lumen-Flutlicht knallt an, 120-dB-Durchsage: „STOPP! Polizei unterwegs!". Täter wird konfrontiert.' },
        { t: 25500, h: ['s7-police','s5-leitstelle','status-alarm'],                                 text:'🚓 <strong>POLIZEI EINTREFFEND</strong> — Streifenwagen mit Blaulicht trifft in &lt; 3 Min ein. Täter aufgegeben oder verhaftet — Vorfall vereitelt.' },
        { t: 30000, h: ['s8-archive','status-idle'],                                                  text:'📼 <strong>BEWEISSICHER</strong> — Vollständige Clips werden DSGVO-konform 7 Tage auf 2-TB-NVR archiviert. Beweismaterial steht Polizei & Versicherung zur Verfügung.' },
      ],
      cycle: 35000,
    };
  }

  return { view };
})();
