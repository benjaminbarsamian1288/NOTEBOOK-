/* Mechanische Sicherheit — Türen · Tore · Zäune · Poller · Tresore · Fenster
   Mit Animationen, Widerstandsklassen, Varianten, Tech-Details */

window.MECHANIK = (() => {
  const { el } = U;

  /* ========================================================================
     1. TÜREN — Sicherheits-Mehrfachverriegelung
     ======================================================================== */

  function tueren() {
    const wrap = el('div', { class:'mech-section' });
    wrap.innerHTML = `
      <div class="mech-hero" style="--c1:#7c3aed; --c2:#3b82f6">
        <div class="mech-hero-text">
          <div class="mech-hero-tag">ZONE 2 · AUSSENHAUT</div>
          <h2>Sicherheitstüren</h2>
          <p>Einbruchhemmende Türen nach <strong>DIN EN 1627</strong>. Klassifizierung RC1N bis RC6 — von Wohnungs-Eingangstür bis zur Tresorraum-Tür.</p>
        </div>
        <div class="mech-hero-vis">
          <svg viewBox="0 0 280 320" class="mech-hero-svg" id="mech-tuer-svg">
            <defs>
              <linearGradient id="tuerWood" x2="1" y2="1">
                <stop offset="0" stop-color="#92400e"/>
                <stop offset="1" stop-color="#451a03"/>
              </linearGradient>
              <linearGradient id="tuerMetal" x2="1" y2="0">
                <stop offset="0" stop-color="#cbd5e1"/>
                <stop offset=".5" stop-color="#f1f5f9"/>
                <stop offset="1" stop-color="#94a3b8"/>
              </linearGradient>
            </defs>
            <!-- Zarge -->
            <rect x="20" y="20" width="240" height="280" fill="#1e293b" rx="2"/>
            <!-- Türblatt -->
            <rect x="35" y="35" width="210" height="250" fill="url(#tuerWood)" rx="1"/>
            <!-- Füllungen -->
            <rect x="50" y="55" width="180" height="80" fill="rgba(0,0,0,.2)" rx="2"/>
            <rect x="50" y="155" width="180" height="110" fill="rgba(0,0,0,.2)" rx="2"/>
            <!-- Knauf -->
            <circle cx="60" cy="170" r="6" fill="#fbbf24"/>
            <!-- Drücker -->
            <rect x="200" y="167" width="35" height="6" rx="3" fill="url(#tuerMetal)"/>
            <circle cx="218" cy="170" r="4" fill="#94a3b8"/>
            <!-- Schloss-Schild -->
            <rect x="195" y="175" width="35" height="20" rx="2" fill="#475569"/>
            <circle cx="212" cy="185" r="3" fill="#1e293b"/>

            <!-- 3 RIEGEL (animiert) -->
            <!-- Oben -->
            <g id="riegel-top">
              <rect x="240" y="60" width="14" height="10" fill="url(#tuerMetal)" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="x" values="244;220;220;244" keyTimes="0;.3;.7;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <text x="265" y="68" font-size="9" fill="#94a3b8" font-family="system-ui" font-weight="700">RIEGEL 1</text>
            </g>
            <!-- Mitte (Hauptschloss) -->
            <g id="riegel-mid">
              <rect x="240" y="180" width="18" height="14" fill="url(#tuerMetal)" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="x" values="248;215;215;248" keyTimes="0;.3;.7;1" dur="6s" begin=".15s" repeatCount="indefinite"/>
              </rect>
              <text x="266" y="191" font-size="9" fill="#94a3b8" font-family="system-ui" font-weight="700">HAUPT</text>
            </g>
            <!-- Unten -->
            <g id="riegel-bot">
              <rect x="240" y="250" width="14" height="10" fill="url(#tuerMetal)" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="x" values="244;220;220;244" keyTimes="0;.3;.7;1" dur="6s" begin=".3s" repeatCount="indefinite"/>
              </rect>
              <text x="265" y="258" font-size="9" fill="#94a3b8" font-family="system-ui" font-weight="700">RIEGEL 2</text>
            </g>

            <!-- Status LED -->
            <circle cx="170" cy="185" r="3" fill="#22c55e">
              <animate attributeName="fill" values="#22c55e;#ef4444;#22c55e" keyTimes="0;.5;1" dur="6s" repeatCount="indefinite"/>
            </circle>
            <text x="100" y="190" font-size="9" fill="#22c55e" font-family="monospace" font-weight="800">
              <animate attributeName="textContent" values="ENTRIEGELT;⚠ VERRIEGELT;⚠ VERRIEGELT;ENTRIEGELT" keyTimes="0;.3;.7;1" dur="6s" repeatCount="indefinite"/>
              VERRIEGELT
            </text>

            <!-- Band/Scharniere -->
            <rect x="34" y="60" width="6" height="20" fill="#475569"/>
            <rect x="34" y="150" width="6" height="20" fill="#475569"/>
            <rect x="34" y="240" width="6" height="20" fill="#475569"/>
          </svg>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(124,58,237,.15); color:#7c3aed"><i class="fas fa-medal"></i></div>
          <h3>Widerstandsklassen RC1N — RC6 (DIN EN 1627)</h3>
        </div>
        <div class="mech-rc-grid">
          ${rcKlassen('tuer').map(k => mechRcCard(k)).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(34,211,238,.15); color:#22d3ee"><i class="fas fa-cubes"></i></div>
          <h3>Konstruktions-Komponenten einer Sicherheitstür</h3>
        </div>
        <div class="mech-comp-grid">
          ${[
            { i:'fa-shield', t:'Türblatt', d:'Sandwichaufbau: Stahlblech 1–2 mm außen, Wabenkern oder Hartstein-Füllung, innen Stahl. Bei RC4+: Vollstahl mit Verstärkungsplatten.' },
            { i:'fa-grip-lines-vertical', t:'Zarge', d:'Stahl-Eckzarge, mehrfach im Mauerwerk verankert (mind. 8 Befestigungspunkte bei RC3+). Bei RC5–6 zusätzliche Hintergreifhaken.' },
            { i:'fa-lock', t:'Mehrfachverriegelung', d:'3-fach (Standard), 5-fach (RC4+) oder 7-fach Verriegelung. Schwenkriegel (Falle) + Stahlbolzen (Riegel). Materialhärte ≥ 60 HRC.' },
            { i:'fa-key', t:'Schließzylinder', d:'Profilzylinder mit Bohrschutz, Ziehschutz, Kernziehschutz (VdS-Klasse BZ+). Bei RC4+: BS-Schutz + Aufbohrhülse aus Mangan-Stahl.' },
            { i:'fa-arrows-up-down', t:'Bänder (Scharniere)', d:'3 Stahlbänder, kugelgelagert. Hintergreifhaken (Bandseite) verhindern Aushebeln. RC5+: 4 Bänder pflicht.' },
            { i:'fa-eye', t:'Türspion / Glas', d:'Falls Türspion: zertifizierter, durchwurfhemmender Spion. Glas: P4A (durchwurfhemmend) bis P8B (durchbruchhemmend).' },
            { i:'fa-magnet', t:'Magnetkontakt', d:'EMA-Kopplung über VdS-anerkannten Reedkontakt im Bandbereich oder Schlossfalle-Kontakt — bei Öffnen → Alarm.' },
            { i:'fa-bell-concierge', t:'Panikfunktion', d:'Antipanikschloss (EN 179/1125) für Fluchttüren: jederzeit innen ohne Schlüssel öffenbar, außen gesichert.' },
          ].map(c => `
            <div class="mech-comp">
              <div class="mech-comp-icon"><i class="fas ${c.i}"></i></div>
              <div>
                <strong>${c.t}</strong>
                <p>${c.d}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.HERSTELLER) wrap.appendChild(HERSTELLER.renderSection('tueren'));
    return wrap;
  }

  /* ========================================================================
     2. TORE — Schiebetor, Drehtor, Schranke, Sektionaltor
     ======================================================================== */

  function tore() {
    const wrap = el('div', { class:'mech-section' });
    wrap.innerHTML = `
      <div class="mech-hero" style="--c1:#0891b2; --c2:#0e7490">
        <div class="mech-hero-text">
          <div class="mech-hero-tag">ZONE 1 · PERIMETER</div>
          <h2>Tore & Schranken</h2>
          <p>Schiebetore (freitragend bis 12 m), Drehtore, Drehkreuze und hydraulische Schranken. Antrieb via Funk, RFID, ANPR-Kennzeichenerkennung oder Sprechanlage.</p>
        </div>
        <div class="mech-hero-vis">
          <svg viewBox="0 0 380 220" class="mech-hero-svg">
            <defs>
              <linearGradient id="torMetal" x2="0" y2="1">
                <stop offset="0" stop-color="#cbd5e1"/>
                <stop offset="1" stop-color="#64748b"/>
              </linearGradient>
            </defs>
            <!-- Boden -->
            <rect y="190" width="380" height="30" fill="#1e293b"/>
            <line x1="0" y1="195" x2="380" y2="195" stroke="#475569" stroke-width="1.5"/>

            <!-- Tor-Pfosten links -->
            <rect x="40" y="60" width="12" height="130" fill="url(#torMetal)"/>
            <rect x="38" y="56" width="16" height="6" fill="#475569"/>
            <!-- Tor-Pfosten rechts -->
            <rect x="328" y="60" width="12" height="130" fill="url(#torMetal)"/>
            <rect x="326" y="56" width="16" height="6" fill="#475569"/>

            <!-- SCHIEBETOR (animiert) -->
            <g>
              <animateTransform attributeName="transform" type="translate"
                values="0 0; -180 0; -180 0; 0 0; 0 0" keyTimes="0; .25; .55; .8; 1" dur="8s" repeatCount="indefinite"/>
              <!-- Rahmen -->
              <rect x="60" y="80" width="260" height="110" fill="none" stroke="#94a3b8" stroke-width="3"/>
              <!-- Vertikale Stäbe -->
              ${Array.from({length: 13}, (_,i) => `<rect x="${66 + i*20}" y="84" width="3" height="102" fill="#94a3b8"/>`).join('')}
              <!-- Horizontaler Querbalken -->
              <rect x="62" y="130" width="256" height="4" fill="#94a3b8"/>
              <!-- Tor-Mitte-Schild -->
              <rect x="170" y="142" width="40" height="30" fill="#dc2626" stroke="#fbbf24" stroke-width="1.5"/>
              <text x="190" y="155" text-anchor="middle" font-size="8" fill="white" font-family="system-ui" font-weight="800">PRIVAT</text>
              <text x="190" y="167" text-anchor="middle" font-size="6" fill="#fbbf24" font-family="system-ui">Zutritt verboten</text>
            </g>

            <!-- Antriebsmotor -->
            <rect x="20" y="170" width="22" height="20" rx="2" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
            <circle cx="31" cy="180" r="3" fill="#22c55e">
              <animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="31" y="208" text-anchor="middle" font-size="8" fill="#22c55e" font-family="system-ui" font-weight="700">ANTRIEB</text>

            <!-- ANPR-Kamera -->
            <g transform="translate(355, 30)">
              <rect x="-4" y="0" width="2" height="30" fill="#475569"/>
              <rect x="-12" y="28" width="20" height="14" rx="2" fill="#0c0a1a" stroke="#22d3ee" stroke-width="1.5"/>
              <circle cx="-2" cy="35" r="3" fill="#22d3ee"/>
            </g>
            <!-- ANPR-Reichweite -->
            <path d="M340 65 L100 130 L100 155 L340 90 Z" fill="rgba(34,211,238,.12)" stroke="rgba(34,211,238,.3)" stroke-dasharray="3 2"/>
            <text x="180" y="115" font-size="9" fill="#22d3ee" font-family="system-ui" font-weight="700">ANPR · Kennzeichen</text>

            <!-- Status -->
            <g>
              <rect x="10" y="10" width="120" height="22" rx="4" fill="#22c55e">
                <animate attributeName="fill" values="#22c55e;#fbbf24;#22c55e;#22c55e" keyTimes="0;.25;.5;1" dur="8s" repeatCount="indefinite"/>
              </rect>
              <text x="70" y="25" text-anchor="middle" font-size="11" fill="#0b1424" font-family="system-ui" font-weight="800">
                <animate attributeName="textContent" values="GESCHLOSSEN;ÖFFNET...;OFFEN;SCHLIESST...;GESCHLOSSEN" keyTimes="0;.15;.4;.75;1" dur="8s" repeatCount="indefinite"/>
                GESCHLOSSEN
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(8,145,178,.15); color:#0891b2"><i class="fas fa-grip-lines-vertical"></i></div>
          <h3>4 Tor-Typen im Vergleich</h3>
        </div>
        <div class="mech-tortypen">
          ${[
            { n:'Schiebetor freitragend', d:'Bis 12 m Durchfahrtsbreite ohne Bodenschiene. Antrieb seitlich. Vorteil: kein Schwenkbereich.', specs:['Antrieb 230 V / 400 V','Endschalter elektronisch','RC2 — RC4 möglich','Klemmschutz nach EN 13241'], c:'#0891b2' },
            { n:'Drehflügeltor', d:'1- oder 2-flügelig. Ideal für Wohngrundstücke. Schwenkbereich beachten (mind. 50 cm).', specs:['Flügelbreite 1,5 — 5 m','Hydraulik- oder Spindelantrieb','RC2 — RC3','Mit / ohne Fußgängertor'], c:'#06b6d4' },
            { n:'Schranke (Industrie)', d:'Hubzeiten 1–6 Sek. Häufig kombiniert mit ANPR/RFID. Auch für Parkhäuser.', specs:['Schrankenbaumlänge 3–8 m','Hub &lt; 1,5 s (Hochleistung)','Crashschutz K4–K12','Induktionsschleifen-Sensorik'], c:'#0e7490' },
            { n:'Sektionaltor (Industrie)', d:'Großflächige Hallen-Tore mit Lamellen. Öffnet nach oben, platzsparend.', specs:['Bis 8 m × 6 m','Sandwich-Lamellen 40–80 mm','Wärmedämmung U &lt; 1,0 W/m²K','Lichtgitter / Sicherheitskontaktleiste'], c:'#155e75' },
          ].map(t => `
            <div class="mech-tor-card" style="--c:${t.c}">
              <h4>${t.n}</h4>
              <p>${t.d}</p>
              <ul>${t.specs.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(251,191,36,.15); color:#fbbf24"><i class="fas fa-microchip"></i></div>
          <h3>Zugangskontrolle am Tor — wie öffnet sich das Ding?</h3>
        </div>
        <div class="mech-comp-grid">
          ${[
            { i:'fa-id-card', t:'RFID / Mifare-Karte', d:'13,56 MHz, Lesedistanz 2–10 cm. Mit DESFire-Verschlüsselung. Karte/Token am Leser → Tor öffnet.' },
            { i:'fa-camera', t:'ANPR · Kennzeichenerkennung', d:'Spezialkamera + KI liest Nummernschild → Whitelist-Abgleich → öffnet automatisch. Reichweite 5–15 m.' },
            { i:'fa-fingerprint', t:'Biometrie', d:'Fingerprint, Handvenen-Scan oder Gesichtserkennung. Für Hochsicherheit, kombiniert mit PIN (2-Faktor).' },
            { i:'fa-microphone-lines', t:'Sprechanlage', d:'Audio/Video-Sprechanlage mit Türöffner-Funktion. Telefonie über GSM oder VoIP. Mit Smartphone-App.' },
            { i:'fa-radio', t:'Funkfernbedienung', d:'433 MHz oder 868 MHz, Rolling-Code-Verschlüsselung (KeeLoq). Bis 100 m Reichweite.' },
            { i:'fa-key-skeleton', t:'Notschlüssel', d:'Mechanische Backup-Öffnung bei Stromausfall (Profilzylinder am Antriebsgehäuse).' },
          ].map(c => `
            <div class="mech-comp">
              <div class="mech-comp-icon"><i class="fas ${c.i}"></i></div>
              <div>
                <strong>${c.t}</strong>
                <p>${c.d}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.HERSTELLER) wrap.appendChild(HERSTELLER.renderSection('tore'));
    return wrap;
  }

  /* ========================================================================
     3. ZÄUNE — 6 Arten im Vergleich
     ======================================================================== */

  function zaeune() {
    const wrap = el('div', { class:'mech-section' });
    const zaunarten = [
      {
        n:'Maschendrahtzaun', c:'#22c55e', icon:'fa-border-all',
        beschreibung:'Klassischer Garten-Zaun. Geknüpftes Drahtgewebe, kunststoffummantelt. Günstig, aber wenig einbruchhemmend.',
        höhe:'80–200 cm', kosten:'12–25 €/m', schutz:'Niedrig (5–10 Sek mit Bolzenschneider)',
        einsatz:'Privatgärten, Sichtschutz, Tierhaltung',
        svg:`<g><rect x="60" y="140" width="180" height="80" fill="none" stroke="#22c55e" stroke-width="1" stroke-dasharray="6 3 2 3"/>
              ${Array.from({length: 10}, (_,i)=>`<line x1="${60+i*20}" y1="140" x2="${60+i*20}" y2="220" stroke="#475569" stroke-width="1"/>`).join('')}
              ${Array.from({length: 5}, (_,i)=>`<line x1="60" y1="${140+i*20}" x2="240" y2="${140+i*20}" stroke="#475569" stroke-width="1"/>`).join('')}
              <rect x="56" y="135" width="6" height="100" fill="#64748b"/>
              <rect x="234" y="135" width="6" height="100" fill="#64748b"/>
              </g>`
      },
      {
        n:'Doppelstabmatte', c:'#3b82f6', icon:'fa-grip-lines-vertical',
        beschreibung:'Verschweißte Stahlmatte, doppelte Horizontalstäbe. Sehr stabil, häufig bei Gewerbe.',
        höhe:'120–250 cm', kosten:'45–80 €/m', schutz:'Mittel (30–60 Sek mit Bolzenschneider)',
        einsatz:'Gewerbe, Industrie, Schulen, öffentliche Gebäude',
        svg:`<g><rect x="60" y="140" width="180" height="80" fill="rgba(59,130,246,.05)" stroke="#3b82f6" stroke-width="1"/>
              ${Array.from({length: 19}, (_,i)=>`<rect x="${62+i*10}" y="140" width="2" height="80" fill="#3b82f6"/>`).join('')}
              <rect x="60" y="148" width="180" height="3" fill="#3b82f6"/>
              <rect x="60" y="152" width="180" height="3" fill="#3b82f6"/>
              <rect x="60" y="200" width="180" height="3" fill="#3b82f6"/>
              <rect x="60" y="204" width="180" height="3" fill="#3b82f6"/>
              <rect x="56" y="135" width="8" height="100" fill="#64748b"/>
              <rect x="236" y="135" width="8" height="100" fill="#64748b"/>
              </g>`
      },
      {
        n:'Streckmetall / Industrie', c:'#fbbf24', icon:'fa-table',
        beschreibung:'Eingeschnittenes, gezogenes Blech (Rautenstruktur). Sehr schnitt-resistent, schwer zu durchsteigen.',
        höhe:'180–300 cm', kosten:'120–250 €/m', schutz:'Hoch (3–10 Min mit professionellen Werkzeugen)',
        einsatz:'KRITIS, Substations, Trafostationen, Anlagensicherheit',
        svg:`<g><rect x="60" y="140" width="180" height="80" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>
              ${Array.from({length: 7}, (_,i)=>Array.from({length: 4}, (_,j)=>`<polygon points="${70+i*25},${145+j*18} ${85+i*25},${155+j*18} ${70+i*25},${165+j*18} ${55+i*25},${155+j*18}" fill="none" stroke="#fbbf24" stroke-width=".8"/>`).join('')).join('')}
              <rect x="56" y="135" width="8" height="100" fill="#64748b"/>
              <rect x="236" y="135" width="8" height="100" fill="#64748b"/>
              </g>`
      },
      {
        n:'Palisadenzaun', c:'#ea580c', icon:'fa-bars',
        beschreibung:'Vertikale Stahlspitzen, oft mit Speerspitzen oder gewölbten Köpfen. Optisch abschreckend, klassisches Hochsicherheits-Symbol.',
        höhe:'200–350 cm', kosten:'180–400 €/m', schutz:'Sehr hoch (Übersteigen extrem schwer)',
        einsatz:'Hochsicherheit, JVA, Botschaften, Militär',
        svg:`<g><line x1="60" y1="220" x2="240" y2="220" stroke="#64748b" stroke-width="3"/>
              ${Array.from({length: 13}, (_,i)=>`
                <rect x="${66+i*13}" y="135" width="4" height="85" fill="#ea580c"/>
                <polygon points="${68+i*13},130 ${64+i*13},135 ${72+i*13},135" fill="#ea580c"/>
              `).join('')}
              </g>`
      },
      {
        n:'NATO-Draht / Stacheldraht', c:'#dc2626', icon:'fa-skull-crossbones',
        beschreibung:'Rasiermesserdraht (Razor wire) als Übersteigschutz auf bestehenden Zäunen. Schneidende Klingen.',
        höhe:'+50 cm Aufsatz', kosten:'30–80 €/m', schutz:'Übersteig fast unmöglich (Verletzungsrisiko)',
        einsatz:'Hochsicherheit, JVA, Militär (rechtlich problematisch in DE für Privat)',
        svg:`<g><line x1="60" y1="220" x2="240" y2="220" stroke="#64748b" stroke-width="3"/>
              <rect x="60" y="170" width="180" height="50" fill="none" stroke="#3b82f6" stroke-width="1" opacity=".4" stroke-dasharray="3 2"/>
              <path d="M60 170 Q90 130 120 170 Q150 130 180 170 Q210 130 240 170" fill="none" stroke="#dc2626" stroke-width="2.5"/>
              ${Array.from({length: 8}, (_,i)=>`<polygon points="${75+i*22},148 ${78+i*22},155 ${72+i*22},155" fill="#dc2626"/>`).join('')}
              <rect x="56" y="165" width="8" height="55" fill="#64748b"/>
              <rect x="236" y="165" width="8" height="55" fill="#64748b"/>
              </g>`
      },
      {
        n:'Elektrozaun', c:'#c084fc', icon:'fa-bolt',
        beschreibung:'Spannung 2.000–10.000 V (Pulse, ungefährlich aber schmerzhaft). Mit Erschütterungs-Detektoren zur EMA-Kopplung.',
        höhe:'150–250 cm', kosten:'80–200 €/m + Anlage', schutz:'Hoch + sofortige Detektion bei Berührung',
        einsatz:'KRITIS, Substations, agro-Industrie, Wildschutz',
        svg:`<g><line x1="60" y1="220" x2="240" y2="220" stroke="#64748b" stroke-width="3"/>
              ${Array.from({length: 4}, (_,i)=>`
                <line x1="60" y1="${150+i*18}" x2="240" y2="${150+i*18}" stroke="#c084fc" stroke-width="2"/>
                <circle cx="60" cy="${150+i*18}" r="3" fill="#c084fc"/>
                <circle cx="240" cy="${150+i*18}" r="3" fill="#c084fc"/>
              `).join('')}
              <rect x="56" y="135" width="8" height="85" fill="#64748b"/>
              <rect x="236" y="135" width="8" height="85" fill="#64748b"/>
              <g transform="translate(150,135)">
                <polygon points="-6,-8 0,4 4,2 -4,12 0,0 -6,2" fill="#fbbf24"/>
                <animate attributeName="opacity" values="1;0;1;0;1" keyTimes="0;.25;.5;.75;1" dur="1.5s" repeatCount="indefinite"/>
              </g>
              </g>`
      },
    ];

    wrap.innerHTML = `
      <div class="mech-hero" style="--c1:#22c55e; --c2:#0891b2">
        <div class="mech-hero-text">
          <div class="mech-hero-tag">ZONE 1 · PERIMETER</div>
          <h2>Zäune & Umfriedung</h2>
          <p>6 Zaunarten von Maschendraht bis Hochsicherheits-Palisade. Plus aktive Zaunsicherung: Erschütterungsmelder, Spanndraht-Detektion, Elektro-Pulszäune.</p>
        </div>
        <div class="mech-hero-vis">
          <svg viewBox="0 0 300 240" class="mech-hero-svg">
            <rect width="300" height="240" fill="#0a0f1a"/>
            <line x1="0" y1="220" x2="300" y2="220" stroke="#1e293b" stroke-width="2"/>
            <!-- Doppelstabmatte als Hero -->
            <rect x="40" y="60" width="220" height="160" fill="rgba(59,130,246,.06)" stroke="#3b82f6" stroke-width="1.5"/>
            ${Array.from({length: 21}, (_,i)=>`<rect x="${44+i*10}" y="60" width="3" height="160" fill="#3b82f6"/>`).join('')}
            ${[70,75,150,155,210,215].map(y => `<rect x="40" y="${y}" width="220" height="3" fill="#3b82f6"/>`).join('')}
            <rect x="34" y="55" width="10" height="170" fill="#64748b"/>
            <rect x="256" y="55" width="10" height="170" fill="#64748b"/>
            <!-- NATO-Draht Aufsatz -->
            <path d="M40 50 Q70 20 100 50 Q130 20 160 50 Q190 20 220 50 Q250 20 260 50" fill="none" stroke="#dc2626" stroke-width="2">
              <animate attributeName="d" values="
                M40 50 Q70 20 100 50 Q130 20 160 50 Q190 20 220 50 Q250 20 260 50;
                M40 52 Q70 22 100 52 Q130 22 160 52 Q190 22 220 52 Q250 22 260 52;
                M40 50 Q70 20 100 50 Q130 20 160 50 Q190 20 220 50 Q250 20 260 50
              " dur="3s" repeatCount="indefinite"/>
            </path>
            ${Array.from({length: 9}, (_,i)=>`<polygon points="${50+i*25},35 ${54+i*25},42 ${46+i*25},42" fill="#dc2626"/>`).join('')}
            <!-- Sensor-Box -->
            <rect x="200" y="120" width="20" height="14" rx="2" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
            <circle cx="210" cy="127" r="2" fill="#22c55e"><animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
            <text x="210" y="146" text-anchor="middle" font-size="6" fill="#22c55e" font-family="monospace" font-weight="700">ERSCH.</text>
            <!-- Vibration wellen -->
            <g stroke="#22c55e" fill="none" stroke-width="1.2" opacity=".7">
              <circle cx="210" cy="127" r="14"><animate attributeName="r" values="6;30" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="1.5s" repeatCount="indefinite"/></circle>
            </g>
          </svg>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(34,197,94,.15); color:#22c55e"><i class="fas fa-table-list"></i></div>
          <h3>6 Zaunarten im Detail</h3>
        </div>
        <div class="mech-zaun-grid">
          ${zaunarten.map(z => `
            <div class="mech-zaun-card" style="--c:${z.c}">
              <div class="mech-zaun-head">
                <div class="mech-zaun-icon"><i class="fas ${z.icon}"></i></div>
                <h4>${z.n}</h4>
              </div>
              <svg viewBox="0 0 300 240" class="mech-zaun-svg">
                <rect width="300" height="240" fill="#0a0f1a"/>
                <line x1="0" y1="220" x2="300" y2="220" stroke="#1e293b" stroke-width="2"/>
                ${z.svg}
              </svg>
              <p class="mech-zaun-desc">${z.beschreibung}</p>
              <div class="mech-zaun-specs">
                <div class="mech-zaun-spec"><span>Höhe</span><strong>${z.höhe}</strong></div>
                <div class="mech-zaun-spec"><span>Kosten</span><strong>${z.kosten}</strong></div>
                <div class="mech-zaun-spec"><span>Schutz</span><strong>${z.schutz}</strong></div>
                <div class="mech-zaun-spec"><span>Einsatz</span><strong>${z.einsatz}</strong></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(192,132,252,.15); color:#c084fc"><i class="fas fa-tower-broadcast"></i></div>
          <h3>Aktive Zaunsicherung · Sensorik</h3>
        </div>
        <div class="mech-comp-grid">
          ${[
            { i:'fa-wave-square', t:'Erschütterungsmelder', d:'Piezo- oder MEMS-Sensoren am Zaun-Pfosten. Erkennt Klettern, Schneiden, Klopfen. Über Glasfaser oder LAN am Zaunlauf entlang.' },
            { i:'fa-mountain', t:'Spanndraht-System', d:'Drahtfeld unter Vorspannung — Schnitt oder Druck löst Alarm. Klassisch in militärischen Liegenschaften.' },
            { i:'fa-bolt', t:'Elektrozaun mit Detektion', d:'Pulszaun (10 kV, ungefährlich) + Detektion bei Berührung/Schnitt. Doppelfunktion: abschrecken + melden.' },
            { i:'fa-eye', t:'Lichtschranken-Riegel', d:'IR-Strahlen entlang des Zauns. Bei Unterbrechung Alarm. Bis 300 m Strahllänge.' },
            { i:'fa-broadcast-tower', t:'Radar-Detektion', d:'Mikrowellen-Radar 24/77 GHz erkennt Bewegung 100–200 m vor dem Zaun — Frühwarnung.' },
            { i:'fa-camera', t:'Kamera-IVS Tripwire', d:'Wärmebild oder optische Kamera mit virtueller Linie. KI klassifiziert Mensch/Tier.' },
          ].map(c => `
            <div class="mech-comp">
              <div class="mech-comp-icon"><i class="fas ${c.i}"></i></div>
              <div><strong>${c.t}</strong><p>${c.d}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.HERSTELLER) wrap.appendChild(HERSTELLER.renderSection('zaeune'));
    return wrap;
  }

  /* ========================================================================
     4. POLLER — versenkbar, fest, hydraulisch
     ======================================================================== */

  function poller() {
    const wrap = el('div', { class:'mech-section' });
    wrap.innerHTML = `
      <div class="mech-hero" style="--c1:#ea580c; --c2:#dc2626">
        <div class="mech-hero-text">
          <div class="mech-hero-tag">ZONE 1 · PERIMETER · ANTI-RAM</div>
          <h2>Poller & Anti-Ram-Schutz</h2>
          <p>Versenkbare hydraulische Poller stoppen einen 7,5-t-LKW bei 80 km/h (Klasse <strong>K12 / PAS 68</strong>). Schutz vor Rammattacken auf Eingänge, Fußgängerzonen, KRITIS-Anlagen.</p>
        </div>
        <div class="mech-hero-vis">
          <svg viewBox="0 0 360 240" class="mech-hero-svg">
            <defs>
              <linearGradient id="pollerMetal" x2="0" y2="1">
                <stop offset="0" stop-color="#cbd5e1"/>
                <stop offset=".5" stop-color="#f1f5f9"/>
                <stop offset="1" stop-color="#475569"/>
              </linearGradient>
            </defs>
            <!-- Himmel/Hintergrund -->
            <rect width="360" height="160" fill="url(#cinSky)" opacity=".4"/>
            <!-- Boden -->
            <rect y="160" width="360" height="80" fill="#1e293b"/>
            <!-- Asphalt-Linie -->
            <line x1="0" y1="160" x2="360" y2="160" stroke="#475569" stroke-width="2"/>
            <line x1="0" y1="200" x2="360" y2="200" stroke="#475569" stroke-width="1" stroke-dasharray="10 8"/>

            <!-- POLLER 1 - eingefahren -->
            <rect x="60" y="158" width="22" height="4" fill="#94a3b8"/>
            <rect x="62" y="159" width="18" height="2" fill="#fbbf24"/>

            <!-- POLLER 2 - ausgefahren (animiert hoch und runter) -->
            <g>
              <rect x="170" y="80" width="22" height="80" fill="url(#pollerMetal)" stroke="#0b1424" stroke-width=".8" rx="2">
                <animate attributeName="y" values="160;80;80;160;160" keyTimes="0;.25;.7;.95;1" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="height" values="0;80;80;0;0" keyTimes="0;.25;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <!-- Reflektoren -->
              <rect x="170" y="95" width="22" height="5" fill="#fbbf24">
                <animate attributeName="y" values="155;95;95;155;155" keyTimes="0;.25;.7;.95;1" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <rect x="170" y="130" width="22" height="5" fill="#fbbf24">
                <animate attributeName="y" values="155;130;130;155;155" keyTimes="0;.25;.7;.95;1" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <!-- LED Top -->
              <circle cx="181" cy="84" r="3" fill="#22c55e">
                <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </circle>
            </g>

            <!-- POLLER 3 - eingefahren -->
            <rect x="280" y="158" width="22" height="4" fill="#94a3b8"/>
            <rect x="282" y="159" width="18" height="2" fill="#fbbf24"/>

            <!-- Schacht-Bodenelement (für Poller 2) -->
            <rect x="168" y="160" width="26" height="4" fill="#0a0f1a"/>
            <rect x="168" y="160" width="26" height="60" fill="rgba(0,0,0,.4)"/>

            <!-- Hydraulik unter Poller 2 -->
            <rect x="174" y="200" width="14" height="20" fill="#dc2626" opacity=".6"/>
            <text x="181" y="232" text-anchor="middle" font-size="7" fill="#94a3b8" font-family="monospace" font-weight="700">HYDRAULIK</text>

            <!-- Status oben -->
            <g>
              <rect x="120" y="20" width="120" height="22" rx="4" fill="#22c55e">
                <animate attributeName="fill" values="#22c55e;#fbbf24;#ef4444;#fbbf24;#22c55e" keyTimes="0;.2;.5;.85;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <text x="180" y="35" text-anchor="middle" font-size="11" fill="#0b1424" font-family="system-ui" font-weight="800">
                <animate attributeName="textContent" values="POLLER UNTEN;FÄHRT AUS...;⚠ BLOCKIERT;FÄHRT EIN...;POLLER UNTEN" keyTimes="0;.2;.5;.85;1" dur="6s" repeatCount="indefinite"/>
                POLLER UNTEN
              </text>
            </g>

            <!-- Approaching truck (animation) -->
            <g>
              <animateTransform attributeName="transform" type="translate" values="380 0; 380 0; 230 0; 230 0; 380 0; 380 0" keyTimes="0;.4;.55;.7;.9;1" dur="6s" repeatCount="indefinite"/>
              <rect x="-50" y="125" width="60" height="32" rx="3" fill="#475569" stroke="#1e293b"/>
              <rect x="-15" y="118" width="20" height="12" fill="#0f172a"/>
              <circle cx="-40" cy="158" r="6" fill="#0a0f1a" stroke="#475569"/>
              <circle cx="0" cy="158" r="6" fill="#0a0f1a" stroke="#475569"/>
            </g>
          </svg>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(234,88,12,.15); color:#ea580c"><i class="fas fa-medal"></i></div>
          <h3>K-Klassen · Anti-Ram-Schutz nach PAS 68 / IWA 14-1</h3>
        </div>
        <div class="mech-rc-grid">
          ${[
            { k:'K4', t:'7,5 t @ 50 km/h', d:'Stoppt Transporter bei 50 km/h. Standard für Verwaltungsgebäude.', c:'#22c55e' },
            { k:'K8', t:'7,5 t @ 65 km/h', d:'Höhere Energie. Empfehlung für KRITIS-Tore und Botschaften.', c:'#fbbf24' },
            { k:'K12', t:'7,5 t @ 80 km/h', d:'Höchste Klasse. Stoppt einen voll beladenen LKW bei Autobahn-Tempo.', c:'#ef4444' },
            { k:'M50', t:'6,8 t @ 80 km/h', d:'US-Standard nach ASTM F2656 (entspricht K12).', c:'#dc2626' },
          ].map(k => `
            <div class="mech-rc-card" style="--c:${k.c}">
              <div class="mech-rc-klass">${k.k}</div>
              <div class="mech-rc-werk">${k.t}</div>
              <div class="mech-rc-time muted small">${k.d}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(34,211,238,.15); color:#22d3ee"><i class="fas fa-grip-lines-vertical"></i></div>
          <h3>4 Poller-Typen</h3>
        </div>
        <div class="mech-tortypen">
          ${[
            { n:'Hydraulische Versenkpoller', d:'Vollautomatisch, Hub 0,5–2 s. Verkehrsfähig bei Versenkung. Höchste Sicherheit.', specs:['K4 — K12 zertifiziert','Notbetrieb mit Druckspeicher','Heizung für Winter','Anbindung via SPS / KNX'], c:'#dc2626' },
            { n:'Pneumatische Poller', d:'Druckluft-betrieben, weniger Wartung als Hydraulik. Geringer Energieverbrauch.', specs:['K4 — K8','Wartungsarm','Schaltspiele &gt; 500.000','Anschluss an Hauptpressluft-Netz'], c:'#0891b2' },
            { n:'Elektromechanische Poller', d:'Spindel-Antrieb, langsamer aber sehr zuverlässig. Geringer Bauaufwand.', specs:['K4','Hub 4–8 Sek','Wartungsfrei bis 100.000 Zyklen','Geräuscharm'], c:'#22d3ee' },
            { n:'Feste Poller (Anti-Ram)', d:'Fest verankert, nicht versenkbar. Schutz für Fußgängerzonen, Hauseingänge.', specs:['K8 — K12','Stahl- oder Edelstahl','Mit Beleuchtung','Designvarianten möglich'], c:'#fbbf24' },
          ].map(t => `
            <div class="mech-tor-card" style="--c:${t.c}">
              <h4>${t.n}</h4>
              <p>${t.d}</p>
              <ul>${t.specs.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.HERSTELLER) wrap.appendChild(HERSTELLER.renderSection('poller'));
    return wrap;
  }

  /* ========================================================================
     5. TRESORE — Riegelwerk-Animation + EN 1143 Klassen
     ======================================================================== */

  function tresore() {
    const wrap = el('div', { class:'mech-section' });
    wrap.innerHTML = `
      <div class="mech-hero" style="--c1:#0b1424; --c2:#1e293b">
        <div class="mech-hero-text">
          <div class="mech-hero-tag">ZONE 4 · KERN · WERTSCHUTZ</div>
          <h2>Tresore & Wertschutzschränke</h2>
          <p>Klassifikation nach <strong>EN 1143-1</strong> (Wertschutzschränke) und <strong>EN 14450</strong> (Möbeltresore). Versicherungswerte 5.000 € (Klasse 0) bis &gt; 500.000 € (Klasse VI).</p>
        </div>
        <div class="mech-hero-vis">
          <svg viewBox="0 0 280 320" class="mech-hero-svg">
            <defs>
              <linearGradient id="trMetal" x2="1" y2="1">
                <stop offset="0" stop-color="#475569"/>
                <stop offset=".5" stop-color="#94a3b8"/>
                <stop offset="1" stop-color="#1e293b"/>
              </linearGradient>
              <linearGradient id="trDoor" x2="0" y2="1">
                <stop offset="0" stop-color="#334155"/>
                <stop offset="1" stop-color="#0f172a"/>
              </linearGradient>
            </defs>
            <!-- Body -->
            <rect x="30" y="30" width="220" height="270" fill="url(#trMetal)" stroke="#0b1424" stroke-width="2" rx="3"/>
            <!-- Inner door area -->
            <rect x="50" y="50" width="180" height="230" fill="url(#trDoor)" stroke="#475569" stroke-width="2"/>

            <!-- 4-Speichen-Drehgriff (rotates) -->
            <g transform="translate(140, 165)">
              <animateTransform attributeName="transform" type="rotate" values="0; 90; 90; 0; 0" keyTimes="0; .2; .7; .95; 1" dur="6s" additive="sum" repeatCount="indefinite"/>
              <circle r="32" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
              <circle r="8" fill="#cbd5e1"/>
              <rect x="-3" y="-32" width="6" height="64" fill="#cbd5e1"/>
              <rect x="-32" y="-3" width="64" height="6" fill="#cbd5e1"/>
              <circle cx="0" cy="-28" r="4" fill="#475569"/>
              <circle cx="0" cy="28" r="4" fill="#475569"/>
              <circle cx="-28" cy="0" r="4" fill="#475569"/>
              <circle cx="28" cy="0" r="4" fill="#475569"/>
            </g>

            <!-- 8-fach Riegelwerk (Bolzen fahren raus bei "verriegelt") -->
            <!-- Oben (3 Bolzen) -->
            <g>
              <rect x="80" y="42" width="10" height="12" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="y" values="50;42;42;50;50" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <rect x="135" y="42" width="10" height="12" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="y" values="50;42;42;50;50" keyTimes="0;.3;.7;.95;1" dur="6s" begin=".1s" repeatCount="indefinite"/>
              </rect>
              <rect x="190" y="42" width="10" height="12" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="y" values="50;42;42;50;50" keyTimes="0;.3;.7;.95;1" dur="6s" begin=".2s" repeatCount="indefinite"/>
              </rect>
            </g>
            <!-- Rechts (3 Bolzen) -->
            <g>
              <rect x="226" y="100" width="14" height="10" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="x" values="218;236;236;218;218" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <rect x="226" y="155" width="14" height="10" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="x" values="218;236;236;218;218" keyTimes="0;.3;.7;.95;1" dur="6s" begin=".1s" repeatCount="indefinite"/>
              </rect>
              <rect x="226" y="210" width="14" height="10" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="x" values="218;236;236;218;218" keyTimes="0;.3;.7;.95;1" dur="6s" begin=".2s" repeatCount="indefinite"/>
              </rect>
            </g>
            <!-- Unten (2 Bolzen) -->
            <g>
              <rect x="105" y="276" width="10" height="12" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="y" values="268;276;276;268;268" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <rect x="165" y="276" width="10" height="12" fill="#cbd5e1" stroke="#0b1424" stroke-width=".5">
                <animate attributeName="y" values="268;276;276;268;268" keyTimes="0;.3;.7;.95;1" dur="6s" begin=".1s" repeatCount="indefinite"/>
              </rect>
            </g>

            <!-- Combination dial -->
            <g transform="translate(80, 90)">
              <circle r="14" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.5"/>
              <circle r="11" fill="none" stroke="#475569"/>
              <line x1="0" y1="-12" x2="0" y2="-9" stroke="#dc2626" stroke-width="2"/>
              <text y="3" text-anchor="middle" font-size="6" fill="#94a3b8" font-family="monospace">DIAL</text>
            </g>

            <!-- Electronic display -->
            <g transform="translate(200, 90)">
              <rect x="-18" y="-10" width="36" height="20" fill="#0a0f1a" stroke="#22c55e" stroke-width="1" rx="2"/>
              <text y="4" text-anchor="middle" font-size="8" fill="#22c55e" font-family="monospace" font-weight="800">
                <animate attributeName="textContent" values="****;1234;****;****" keyTimes="0;.3;.6;1" dur="6s" repeatCount="indefinite"/>
                ****
              </text>
            </g>

            <!-- VdS-Logo -->
            <g transform="translate(140, 270)">
              <rect x="-25" y="-8" width="50" height="16" fill="#dc2626"/>
              <text y="3" text-anchor="middle" font-size="9" fill="white" font-family="system-ui" font-weight="900">VdS · EN1143</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(168,85,247,.15); color:#a855f7"><i class="fas fa-medal"></i></div>
          <h3>Widerstandsklassen EN 1143-1 · Versicherungssumme</h3>
        </div>
        <div class="mech-rc-grid">
          ${[
            { k:'N (S2)', t:'EN 14450', d:'Möbeltresor, Bürotresor. RU 30, Versicherung 5.000 € privat / 2.500 € gewerblich', c:'#94a3b8' },
            { k:'0', t:'EN 1143-1', d:'Wertschutzschrank Einsteiger. 20.000 € privat / 10.000 € gewerblich', c:'#22c55e' },
            { k:'I', t:'EN 1143-1', d:'Standard. 40.000 € privat / 20.000 € gewerblich. WS 30 / RU 50', c:'#0891b2' },
            { k:'II', t:'EN 1143-1', d:'Höhere Sicherheit. 100.000 € / 50.000 €. WS 50 / RU 80', c:'#3b82f6' },
            { k:'III', t:'EN 1143-1', d:'200.000 € / 100.000 €. WS 80 / RU 120. Beliebt für Edelmetallhändler', c:'#7c3aed' },
            { k:'IV', t:'EN 1143-1', d:'300.000 € / 150.000 €. WS 120 / RU 180', c:'#a855f7' },
            { k:'V', t:'EN 1143-1', d:'500.000 € / 250.000 €. WS 180 / RU 270', c:'#c084fc' },
            { k:'VI', t:'EN 1143-1', d:'&gt; 500.000 €. Bankraum-Niveau. WS 270 / RU 400', c:'#ec4899' },
          ].map(k => `
            <div class="mech-rc-card" style="--c:${k.c}">
              <div class="mech-rc-klass">${k.k}</div>
              <div class="mech-rc-werk">${k.t}</div>
              <div class="mech-rc-time muted small">${k.d}</div>
            </div>
          `).join('')}
        </div>
        <p class="muted small" style="margin: 10px 0 0">
          <i class="fas fa-circle-info"></i>
          <strong>WS</strong> = Widerstandseinheiten beim Werkzeugangriff · <strong>RU</strong> = bei Teilaufbruch ·
          Werte ohne Bohrwerkzeuge in Min × Schwierigkeitsfaktor
        </p>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(34,211,238,.15); color:#22d3ee"><i class="fas fa-cubes"></i></div>
          <h3>Tresor-Bauarten</h3>
        </div>
        <div class="mech-tortypen">
          ${[
            { n:'Möbeltresor (Standtresor)', d:'Freistehend, 50–200 kg. Klasse N–II. Privatkunden, kleine Büros.', specs:['Höhe 30–80 cm','Verankerung mit Boden/Wand','Klassen N — II','Optional Innentresor'], c:'#22c55e' },
            { n:'Wandtresor', d:'Eingemauert, Tür bündig mit Wand. Versteckbar hinter Bildern.', specs:['Klasse 0 — III','Einbau-Bohrung Ø 30–40 cm','Innenmaß optimiert','Schlüssel + Zahlenschloss'], c:'#3b82f6' },
            { n:'Bodentresor', d:'Im Estrich versenkt, deckelbar. Höchste Widerstandsklasse pro Volumen.', specs:['Klasse I — IV','Stahl-Beton-Stahl-Wandung','Wasserdicht-Option','Verstecktes Riegelwerk'], c:'#0891b2' },
            { n:'Großraumtresor', d:'Schrank-Format. Banken, Pfandhäuser, Wertstofftrenner.', specs:['Klasse III — VI','Höhe 150–220 cm','Innenraum mit Trennwänden','Mit Aufzug-Option'], c:'#7c3aed' },
            { n:'Datentresor', d:'Spezialschutz vor Feuer (S 60 P / S 120 DIS) und Wasser. Für Festplatten, Bänder.', specs:['ECB-S S 60 P / S 120 DIS','Hitzedämmung &gt; 1000 °C/30 min','Wasserdicht IP 67','Klasse 0 — II'], c:'#fbbf24' },
            { n:'Waffenschrank', d:'Nach Waffengesetz §13 / Klassen N — I für Langwaffen. Mit Innentresor für Munition.', specs:['Klasse 0 — I (legal in DE)','Munitionsfach nach §13','Höhe 130–180 cm','Mit Zertifizierungs-Plakette'], c:'#ef4444' },
          ].map(t => `
            <div class="mech-tor-card" style="--c:${t.c}">
              <h4>${t.n}</h4>
              <p>${t.d}</p>
              <ul>${t.specs.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(192,132,252,.15); color:#c084fc"><i class="fas fa-key"></i></div>
          <h3>Schloss-Systeme</h3>
        </div>
        <div class="mech-comp-grid">
          ${[
            { i:'fa-key', t:'Doppelbart-Schlüsselschloss', d:'Klassisch, mechanisch. Bartschlüssel 8–11 mm. Robust, kein Strom, dafür langsamer.' },
            { i:'fa-circle-dot', t:'Zahlenkombinations-Schloss', d:'4-Scheiben-Mechanik, 1.000.000 Kombinationen. Drehknauf-Bedienung. Komplett mechanisch.' },
            { i:'fa-keyboard', t:'Elektronikschloss', d:'PIN über Tastenfeld. Mit Notstrom-Batterie. Audit-Log letzter Öffnungen. Bedienzeit-Sperre nach Fehlversuchen.' },
            { i:'fa-fingerprint', t:'Biometrie', d:'Fingerprint, Handvenen, Gesichtserkennung. Häufig kombiniert mit PIN für 2-Faktor.' },
            { i:'fa-mobile-screen', t:'Bluetooth / NFC', d:'Smartphone als Schlüssel. Mit Audit, Berechtigungs-Zeitfenster, Multi-User-Profile.' },
            { i:'fa-shield-virus', t:'Manipulations-Schutz', d:'Schock-Riegel sperrt bei Bohrangriff/Sprengversuch. Glasplatten-Schloss (zerbricht bei Angriff, blockiert).' },
          ].map(c => `
            <div class="mech-comp">
              <div class="mech-comp-icon"><i class="fas ${c.i}"></i></div>
              <div><strong>${c.t}</strong><p>${c.d}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.HERSTELLER) wrap.appendChild(HERSTELLER.renderSection('tresore'));
    return wrap;
  }

  /* ========================================================================
     6. FENSTER — Sicherheits-Beschlag-Animation
     ======================================================================== */

  function fenster() {
    const wrap = el('div', { class:'mech-section' });
    wrap.innerHTML = `
      <div class="mech-hero" style="--c1:#0891b2; --c2:#3b82f6">
        <div class="mech-hero-text">
          <div class="mech-hero-tag">ZONE 2 · AUSSENHAUT</div>
          <h2>Sicherheitsfenster</h2>
          <p>Einbruchhemmend nach <strong>DIN EN 1627</strong> (RC1N — RC6). Sicherheitsglas <strong>P4A — P8B</strong> + Pilzkopf-Beschläge. <strong>~80 % aller Einbrüche</strong> erfolgen durch das Fenster.</p>
        </div>
        <div class="mech-hero-vis">
          <svg viewBox="0 0 280 320" class="mech-hero-svg">
            <defs>
              <linearGradient id="fensterFrame" x2="1" y2="0">
                <stop offset="0" stop-color="#f1f5f9"/>
                <stop offset="1" stop-color="#cbd5e1"/>
              </linearGradient>
              <linearGradient id="glass" x2="1" y2="1">
                <stop offset="0" stop-color="rgba(34,211,238,.18)"/>
                <stop offset=".5" stop-color="rgba(34,211,238,.05)"/>
                <stop offset="1" stop-color="rgba(34,211,238,.15)"/>
              </linearGradient>
            </defs>
            <!-- Rahmen -->
            <rect x="20" y="20" width="240" height="280" fill="url(#fensterFrame)" stroke="#94a3b8" stroke-width="2" rx="4"/>
            <!-- Glasflächen -->
            <rect x="40" y="40" width="95" height="240" fill="url(#glass)" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="145" y="40" width="95" height="240" fill="url(#glass)" stroke="#3b82f6" stroke-width="1.5"/>
            <!-- Sprosse Mitte -->
            <rect x="135" y="20" width="10" height="280" fill="url(#fensterFrame)" stroke="#94a3b8"/>

            <!-- Pilzkopf-Zapfen (verriegeln animiert) -->
            <!-- Links: 4 Zapfen am rechten Flügelrand -->
            ${[60,130,200,270].map((y,i) => `
              <g>
                <circle cx="135" cy="${y}" r="5" fill="#1e293b">
                  <animate attributeName="r" values="2;5;5;2;2" keyTimes="0;.3;.7;.95;1" dur="6s" begin="${i*0.1}s" repeatCount="indefinite"/>
                </circle>
                <rect x="125" y="${y-2}" width="10" height="4" fill="#475569">
                  <animate attributeName="width" values="2;14;14;2;2" keyTimes="0;.3;.7;.95;1" dur="6s" begin="${i*0.1}s" repeatCount="indefinite"/>
                  <animate attributeName="x" values="135;125;125;135;135" keyTimes="0;.3;.7;.95;1" dur="6s" begin="${i*0.1}s" repeatCount="indefinite"/>
                </rect>
              </g>
            `).join('')}

            <!-- Griff (rotiert beim Schließen) -->
            <g transform="translate(40, 170)">
              <rect x="-3" y="-3" width="6" height="6" fill="#1e293b"/>
              <rect x="-4" y="-25" width="8" height="25" rx="2" fill="#1e293b">
                <animateTransform attributeName="transform" type="rotate" values="0; -90; -90; 0; 0" keyTimes="0;.25;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
            </g>

            <!-- Glasaufbau (Schnitt-Indikator) -->
            <g transform="translate(85, 290)">
              <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#0a0f1a" stroke="#22d3ee" stroke-width="1"/>
              <text x="0" y="3" text-anchor="middle" font-size="9" fill="#22d3ee" font-family="system-ui" font-weight="800">P4A · 8 mm</text>
            </g>
            <g transform="translate(190, 290)">
              <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#0a0f1a" stroke="#22c55e" stroke-width="1"/>
              <text x="0" y="3" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui" font-weight="800">VSG 44.4</text>
            </g>

            <!-- Status -->
            <g>
              <rect x="80" y="0" width="120" height="18" rx="3" fill="#22c55e">
                <animate attributeName="fill" values="#22c55e;#dc2626;#dc2626;#22c55e;#22c55e" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
              </rect>
              <text x="140" y="12" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">
                <animate attributeName="textContent" values="OFFEN;⚠ VERRIEGELT;⚠ VERRIEGELT;OFFEN;OFFEN" keyTimes="0;.3;.7;.95;1" dur="6s" repeatCount="indefinite"/>
                OFFEN
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(8,145,178,.15); color:#0891b2"><i class="fas fa-medal"></i></div>
          <h3>Widerstandsklassen Fenster · DIN EN 1627</h3>
        </div>
        <div class="mech-rc-grid">
          ${rcKlassen('fenster').map(k => mechRcCard(k)).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(34,211,238,.15); color:#22d3ee"><i class="fas fa-layer-group"></i></div>
          <h3>Sicherheitsglas-Klassen · DIN EN 356 (P4A — P8B) & EN 1063 (BR1 — BR7)</h3>
        </div>
        <div class="mech-glass-grid">
          ${[
            { k:'P1A', t:'Durchwurfhemmend', d:'1× Wurfkugel (4,11 kg) aus 1,5 m. Sicherheitsglas Wohngebäude.', c:'#22c55e' },
            { k:'P4A', t:'Durchwurfhemmend ↑', d:'3× Wurfkugel aus 9 m. RC2-Standard für Schaufenster.', c:'#06b6d4' },
            { k:'P6B', t:'Durchbruchhemmend', d:'Axt-Test: 30–50 Schläge halten. RC3 — RC4.', c:'#3b82f6' },
            { k:'P8B', t:'Durchbruchhemmend ↑↑', d:'70+ Axtschläge. Höchste P-Klasse. Banken, Juweliere.', c:'#7c3aed' },
            { k:'BR3', t:'Beschuss .357 Magnum', d:'Kugelsicher gegen Revolver-Munition. Banken-Schalterglas.', c:'#a855f7' },
            { k:'BR6', t:'Beschuss 7,62 × 51', d:'Kugelsicher gegen Gewehr-Munition (Sturmgewehr).', c:'#dc2626' },
            { k:'BR7', t:'Beschuss .308 Win AP', d:'Höchste zivile Klasse. Hartkern-Munition.', c:'#7f1d1d' },
            { k:'EX1', t:'Sprengwirkungshemmend', d:'Schutz gegen Druckwellen. Botschaften, KRITIS.', c:'#fbbf24' },
          ].map(k => `
            <div class="mech-glass-card" style="--c:${k.c}">
              <div class="mech-glass-klass">${k.k}</div>
              <div class="mech-glass-typ">${k.t}</div>
              <div class="mech-glass-desc">${k.d}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-h">
          <div class="ico" style="background:rgba(168,85,247,.15); color:#a855f7"><i class="fas fa-cubes"></i></div>
          <h3>Komponenten eines RC-Sicherheitsfensters</h3>
        </div>
        <div class="mech-comp-grid">
          ${[
            { i:'fa-grip-vertical', t:'Pilzkopf-Beschlag', d:'Statt einfacher Zapfen → kegelförmige Pilzköpfe, die in Stahl-Schließbleche hinter-greifen. Mind. 4 Pilzköpfe pro Flügel (RC2+).' },
            { i:'fa-layer-group', t:'VSG Verbund-Sicherheitsglas', d:'2 oder 3 Glasscheiben mit PVB-Folie (0,76 mm) verklebt. Bei Bruch bleiben Splitter haften. RC2: VSG 33.2, RC3: VSG 44.4.' },
            { i:'fa-key', t:'Abschließbarer Griff', d:'Pflicht ab RC2. Verhindert Öffnen durch eingedrücktes Loch oder vom Bohrer-Angriff.' },
            { i:'fa-shield-halved', t:'Anbohr-/Aufhebelschutz', d:'Stahl-Verstärkungen in Profil. Verhindert Aufstemmen mit Schraubenzieher.' },
            { i:'fa-bell', t:'Glasbruchmelder (EMA)', d:'Akustisch (passiv) oder seismisch (Klebesensor). Bei Bruch → sofortiger Alarm.' },
            { i:'fa-magnet', t:'Magnetkontakt', d:'In der Flügeloberkante / Falz. Erkennt Öffnen unabhängig von Glasbruch.' },
            { i:'fa-arrow-up-from-bracket', t:'Fenstergitter (innen/außen)', d:'Edelstahl- oder Schmiedeeisengitter. Klassen FG1 — FG4. Häufige Nachrüstung.' },
            { i:'fa-shield-virus', t:'Folierung', d:'Sicherheits-Folie als Nachrüstung (4 — 12 mil). Macht Standard-Glas teilweise durchwurfhemmend.' },
          ].map(c => `
            <div class="mech-comp">
              <div class="mech-comp-icon"><i class="fas ${c.i}"></i></div>
              <div><strong>${c.t}</strong><p>${c.d}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.HERSTELLER) wrap.appendChild(HERSTELLER.renderSection('fenster'));
    return wrap;
  }

  /* ========================================================================
     COMMON helpers
     ======================================================================== */

  function rcKlassen(typ) {
    const map = {
      tuer: [
        { k:'RC1N', t:'Körperkraft, einfaches Werkzeug', z:'3 Min', d:'Gegen Gelegenheitstäter mit Tritten/Schultern. Mindestschutz Wohnung in oberen Stockwerken.', c:'#94a3b8' },
        { k:'RC2N', t:'Schraubendreher, Zange, Keil', z:'3 Min', d:'„N"-Variante: Glas nicht zwingend einbruchhemmend. Standard Wohnungseingang.', c:'#22c55e' },
        { k:'RC2', t:'+ Sicherheitsglas P4A', z:'3 Min', d:'Polizei-Empfehlung für Privatwohnungen, EFH. Polizei-Beratung empfiehlt mind. RC2.', c:'#06b6d4' },
        { k:'RC3', t:'+ Brecheisen, Schraubenzieher', z:'5 Min', d:'Schaufenster, Juweliere, höherwertige Gewerbe.', c:'#3b82f6' },
        { k:'RC4', t:'+ Säge, Schlagaxt, Akku-Schrauber', z:'10 Min', d:'Erfahrene Täter mit elektrischen Werkzeugen. Apotheken, Banken.', c:'#7c3aed' },
        { k:'RC5', t:'+ Akku-Trennschleifer', z:'15 Min', d:'Profi-Werkzeug. Bahnhöfe, KRITIS.', c:'#a855f7' },
        { k:'RC6', t:'+ Plasmaschneider, Schlaghammer', z:'20 Min', d:'Schwerverbrecher. Banken-Tresortrakt, Botschaften.', c:'#dc2626' },
      ],
      fenster: [
        { k:'RC1N', t:'Körperkraft', z:'3 Min', d:'Schulter, Tritt, Hebel. Mindestschutz Wohnung oben.', c:'#94a3b8' },
        { k:'RC2N', t:'Schraubendreher, Zange', z:'3 Min', d:'Ohne durchwurfhemmendes Glas. Für Fenster oberhalb 4 m.', c:'#22c55e' },
        { k:'RC2', t:'+ Sicherheitsglas P4A', z:'3 Min', d:'POLIZEI-EMPFEHLUNG für alle erreichbaren Fenster im EFH/Wohnung.', c:'#06b6d4' },
        { k:'RC3', t:'+ Kuhfuß, Akku-Bohrer', z:'5 Min', d:'Glas P5A. Gewerbe-Fenster, Erdgeschoss.', c:'#3b82f6' },
        { k:'RC4', t:'+ Säge, Akku-Schrauber', z:'10 Min', d:'Glas P6B/P7B. Banken, Juweliere.', c:'#7c3aed' },
        { k:'RC5', t:'+ Trennschleifer', z:'15 Min', d:'Glas P8B. KRITIS, Hochsicherheit.', c:'#a855f7' },
        { k:'RC6', t:'+ Plasma', z:'20 Min', d:'Glas BR-Klassen. Bankschalter, JVA.', c:'#dc2626' },
      ],
    };
    return map[typ] || [];
  }

  function mechRcCard(k) {
    return `
      <div class="mech-rc-card" style="--c:${k.c}">
        <div class="mech-rc-klass">${k.k}</div>
        <div class="mech-rc-werk">${k.t}</div>
        <div class="mech-rc-zeit">⏱ ${k.z}</div>
        <div class="mech-rc-time muted small">${k.d}</div>
      </div>
    `;
  }

  /* ========================================================================
     MAIN VIEW with TAB-NAVIGATION
     ======================================================================== */

  const TABS = [
    { id:'tueren',  icon:'fa-door-closed',       name:'Türen',   c:'#7c3aed', build: tueren },
    { id:'tore',    icon:'fa-grip-lines-vertical',name:'Tore',    c:'#0891b2', build: tore },
    { id:'zaeune',  icon:'fa-border-all',        name:'Zäune',   c:'#22c55e', build: zaeune },
    { id:'poller',  icon:'fa-circle-stop',       name:'Poller',  c:'#ea580c', build: poller },
    { id:'tresore', icon:'fa-vault',             name:'Tresore', c:'#a855f7', build: tresore },
    { id:'fenster', icon:'fa-window-maximize',   name:'Fenster', c:'#0891b2', build: fenster },
  ];

  function view(d) {
    const root = el('div');
    if (window.TEKANIM) root.appendChild(TEKANIM.zone('mechanik'));

    // Hero
    const hero = el('div', { class:'mech-mainhero' });
    hero.innerHTML = `
      <div class="mech-mainhero-bg"></div>
      <div class="mech-mainhero-content">
        <div class="mech-mainhero-tag">MECHANISCHE SICHERHEIT · GRUNDSCHUTZ</div>
        <h1>Türen · Tore · Zäune · Poller · Tresore · Fenster</h1>
        <p>
          Mechanik schlägt jeden Sensor: Sie verhindert den Einbruch, statt ihn nur zu melden.
          Hier findest du alle 6 Kategorien mit Animationen, Widerstandsklassen und Konstruktionsdetails.
        </p>
        <div class="mech-mainhero-stats">
          <div><strong>RC1N — RC6</strong><span>Türen/Fenster · DIN EN 1627</span></div>
          <div><strong>Klasse N — VI</strong><span>Tresore · EN 1143-1</span></div>
          <div><strong>K4 — K12</strong><span>Poller · PAS 68</span></div>
          <div><strong>P1A — P8B</strong><span>Glas · DIN EN 356</span></div>
        </div>
      </div>
    `;
    root.appendChild(hero);

    // Tab nav
    const tabBar = el('div', { class:'mech-tabs' });
    TABS.forEach((tab, i) => {
      const b = el('button', { class:'mech-tab' + (i === 0 ? ' active' : ''), style:`--c:${tab.c}` });
      b.innerHTML = `<i class="fas ${tab.icon}"></i><span>${tab.name}</span>`;
      b.dataset.tab = tab.id;
      tabBar.appendChild(b);
    });
    root.appendChild(tabBar);

    // Content
    const content = el('div', { class:'mech-content' });
    root.appendChild(content);

    function activate(id) {
      const tab = TABS.find(t => t.id === id);
      if (!tab) return;
      content.innerHTML = '';
      content.appendChild(tab.build());
      // append globale Fachfirmen-Sektion
      if (window.HERSTELLER) content.appendChild(HERSTELLER.renderFachfirmen());
      tabBar.querySelectorAll('.mech-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
      // Scroll content into view
      content.scrollIntoView({ behavior:'smooth', block:'start' });
    }

    tabBar.querySelectorAll('.mech-tab').forEach(b => b.onclick = () => activate(b.dataset.tab));
    activate(TABS[0].id);

    return root;
  }

  return { view };
})();
