/* Engineering-Lab · 8 Live-Formel-Rechner mit physikalischen Modellen */

window.LAB = (() => {
  const { el } = U;

  /* ============ Helper ============ */
  function slider(id, label, min, max, step, init, unit = '', fix = 0) {
    return `
      <div class="lab-slider">
        <label>
          <span>${label}</span>
          <span class="lab-val" id="${id}-v">${parseFloat(init).toFixed(fix).replace(/\.0+$/, '')}${unit}</span>
        </label>
        <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${init}" data-fix="${fix}" data-unit="${unit}">
      </div>
    `;
  }

  function attachSliders(card, callback) {
    card.querySelectorAll('input[type=range]').forEach(s => {
      const lbl = card.querySelector('#' + s.id + '-v');
      const fix = +s.dataset.fix;
      const unit = s.dataset.unit || '';
      s.oninput = () => {
        lbl.textContent = parseFloat(s.value).toFixed(fix).replace(/\.0+$/, '') + unit;
        callback();
      };
    });
  }

  /* ============ FORMEL 1: Schalldruck (Inverse-Square-Law) ============ */
  function calcSchall() {
    const card = el('div', { class:'lab-card lab-schall' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#dc2626">
        <div class="lab-icon"><i class="fas fa-volume-high"></i></div>
        <div>
          <h3>Schalldruck-Reichweite</h3>
          <span>Inverse-Square-Law · Pegel-Abnahme mit Distanz</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>L₂</em> = <em>L₁</em> − 20·log₁₀(<em>r₂</em>/<em>r₁</em>)
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('sch-l1', 'Schallquelle (Sirene)', 80, 130, 1, 110, ' dB', 0)}
          ${slider('sch-d',  'Distanz', 1, 200, 1, 50, ' m', 0)}
        </div>
        <div class="lab-vis" id="sch-vis"></div>
        <div class="lab-result" id="sch-result"></div>
      </div>
    `;

    function update() {
      const L1 = +card.querySelector('#sch-l1').value;
      const d = +card.querySelector('#sch-d').value;
      const L2 = L1 - 20 * Math.log10(d / 1);
      const horSchwelle = 30; // dB unter Tiefe Nachtruhe
      const lautstaerke = L2 > 100 ? 'Schmerzhaft' : L2 > 85 ? 'Sehr laut' : L2 > 60 ? 'Wahrnehmbar' : L2 > 40 ? 'Leise' : L2 > 0 ? 'Sehr leise' : 'Unhörbar';
      const farbe = L2 > 100 ? '#ef4444' : L2 > 85 ? '#fbbf24' : L2 > 60 ? '#22c55e' : '#94a3b8';

      const r = Math.min(180, d * 2);
      card.querySelector('#sch-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <line x1="0" y1="180" x2="400" y2="180" stroke="#475569"/>
          ${[50,100,150,200].map(d => `<line x1="${50 + d/0.6}" y1="178" x2="${50 + d/0.6}" y2="184" stroke="#475569"/><text x="${50 + d/0.6}" y="195" text-anchor="middle" font-size="9" fill="#64748b">${d}m</text>`).join('')}
          <!-- Sirene -->
          <rect x="30" y="100" width="40" height="40" rx="6" fill="#dc2626" stroke="#fbbf24" stroke-width="2"/>
          <circle cx="50" cy="120" r="12" fill="#1e293b"/>
          <circle cx="50" cy="120" r="6" fill="#dc2626"/>
          <!-- Schall-Kreise -->
          ${[40,80,120,160].map(rad => `
            <circle cx="50" cy="120" r="${rad}" fill="none" stroke="${farbe}" stroke-width="1.5" opacity="${0.6 - rad/250}" stroke-dasharray="4 3">
              <animate attributeName="r" values="${rad-5};${rad+10};${rad-5}" dur="${2 + rad/50}s" repeatCount="indefinite"/>
            </circle>
          `).join('')}
          <!-- Beobachter -->
          <g transform="translate(${Math.min(380, 50 + d * 1.7)}, 130)">
            <circle cx="0" cy="-12" r="5" fill="#e8edf7"/>
            <rect x="-4" y="-7" width="8" height="14" fill="#3b82f6"/>
            <line x1="-2" y1="7" x2="-4" y2="20" stroke="#1e3a8a" stroke-width="2"/>
            <line x1="2" y1="7" x2="4" y2="20" stroke="#1e3a8a" stroke-width="2"/>
          </g>
          <!-- Pegel-Label am Beobachter -->
          <rect x="${Math.min(330, 50 + d * 1.7 - 35)}" y="60" width="70" height="22" rx="4" fill="${farbe}"/>
          <text x="${Math.min(365, 50 + d * 1.7)}" y="74" text-anchor="middle" font-size="11" fill="#0b1424" font-weight="900">${L2.toFixed(0)} dB</text>
        </svg>
      `;

      card.querySelector('#sch-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#dc2626">
            <strong>${L1} dB</strong><span>am Ursprung (1 m)</span>
          </div>
          <div class="lab-result-stat" style="--c:${farbe}">
            <strong>${L2.toFixed(1)} dB</strong><span>bei ${d} m</span>
          </div>
          <div class="lab-result-stat" style="--c:${farbe}">
            <strong>${(L1 - L2).toFixed(1)} dB</strong><span>Pegel-Abnahme</span>
          </div>
          <div class="lab-result-stat" style="--c:${farbe}">
            <strong>${lautstaerke}</strong><span>Empfinden</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Bei einer Pegel-Verdoppelung der Distanz fällt der Schallpegel um 6 dB. Lärmschutz-Grenzwert nachts: 40 dB im Wohngebiet.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 2: PIR-Erfassungsbereich ============ */
  function calcPIR() {
    const card = el('div', { class:'lab-card lab-pir' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#22d3ee">
        <div class="lab-icon"><i class="fas fa-broadcast-tower"></i></div>
        <div>
          <h3>PIR-Erfassungs-Geometrie</h3>
          <span>Detektionsbereich aus Sichtwinkel + Distanz</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>b</em> = 2·<em>d</em>·tan(<em>α</em>/2) &nbsp;·&nbsp; <em>A</em> = π·<em>d</em>²·(<em>α</em>/360°)
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('pir-a', 'Sichtwinkel α', 30, 360, 5, 110, '°', 0)}
          ${slider('pir-d', 'Reichweite', 1, 30, 0.5, 12, ' m', 1)}
        </div>
        <div class="lab-vis" id="pir-vis"></div>
        <div class="lab-result" id="pir-result"></div>
      </div>
    `;
    function update() {
      const a = +card.querySelector('#pir-a').value;
      const d = +card.querySelector('#pir-d').value;
      const rad = a * Math.PI / 180;
      const b = 2 * d * Math.tan(rad / 2);
      const A = Math.PI * d * d * (a / 360);

      // PIR-Kegel in SVG
      const cx = 50, cy = 100;
      const scale = 8;
      const r = Math.min(280, d * scale);
      const x1 = cx + r * Math.cos(-rad/2);
      const y1 = cy + r * Math.sin(-rad/2);
      const x2 = cx + r * Math.cos(rad/2);
      const y2 = cy + r * Math.sin(rad/2);
      const isFullCircle = a >= 360;

      card.querySelector('#pir-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          ${isFullCircle
            ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(34,211,238,.2)" stroke="#22d3ee" stroke-width="1.5"/>`
            : `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="rgba(34,211,238,.2)" stroke="#22d3ee" stroke-width="1.5"/>`}
          <!-- Distanz-Radius-Linien -->
          ${[0.25, 0.5, 0.75, 1].map(p => `<circle cx="${cx}" cy="${cy}" r="${r*p}" fill="none" stroke="#22d3ee" stroke-width=".5" stroke-dasharray="3 3" opacity=".5"/>`).join('')}
          <!-- PIR -->
          <rect x="${cx-12}" y="${cy-12}" width="24" height="24" rx="4" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
          <circle cx="${cx}" cy="${cy}" r="5" fill="#22d3ee"/>
          <!-- Distanz-Label -->
          <text x="${cx + r/2 * Math.cos(0)}" y="${cy - 4 + r/2 * Math.sin(0)}" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="800">${d.toFixed(1)} m</text>
          <!-- Person im Detektionsbereich -->
          ${(() => {
            const px = cx + r * 0.8 * Math.cos(0);
            const py = cy + r * 0.8 * Math.sin(0);
            return `
              <g transform="translate(${px}, ${py})">
                <circle cx="0" cy="-8" r="4" fill="#fbbf24"/>
                <rect x="-3" y="-4" width="6" height="10" fill="#fbbf24"/>
                <text x="0" y="20" text-anchor="middle" font-size="8" fill="#fbbf24" font-weight="700">PERSON</text>
              </g>
            `;
          })()}
        </svg>
      `;

      card.querySelector('#pir-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${a}°</strong><span>Sichtwinkel</span>
          </div>
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${b.toFixed(1)} m</strong><span>Bildbreite</span>
          </div>
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${A.toFixed(1)} m²</strong><span>Fläche</span>
          </div>
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${(A * 0.2).toFixed(1)}</strong><span>~Personen-Kapazität</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Standard-PIR: 90—110° / 12 m. Decken-PIR: 360° / 5—8 m. Vorhang-PIR: 5—15° / 20 m.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 3: Stefan-Boltzmann (Wärmestrahlung) ============ */
  function calcThermal() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#ef4444">
        <div class="lab-icon"><i class="fas fa-temperature-three-quarters"></i></div>
        <div>
          <h3>Wärmestrahlungs-Detektion</h3>
          <span>Stefan-Boltzmann · Was sieht eine Wärmebild-Kamera?</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>P</em> = <em>ε</em>·<em>σ</em>·<em>A</em>·(<em>T</em>⁴ − <em>T₀</em>⁴) &nbsp;·&nbsp; <em>σ</em> = 5,67·10⁻⁸ W/m²K⁴
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('th-t', 'Körper-Temperatur', 20, 40, 0.5, 36.6, ' °C', 1)}
          ${slider('th-tu', 'Umgebung', -10, 30, 0.5, 15, ' °C', 1)}
          ${slider('th-a', 'Strahlende Fläche', 0.5, 3, 0.1, 1.7, ' m²', 1)}
        </div>
        <div class="lab-vis" id="th-vis"></div>
        <div class="lab-result" id="th-result"></div>
      </div>
    `;
    function update() {
      const tC = +card.querySelector('#th-t').value;
      const tuC = +card.querySelector('#th-tu').value;
      const A = +card.querySelector('#th-a').value;
      const eps = 0.97;       // Haut-Emissivität
      const sigma = 5.67e-8;
      const T = tC + 273.15;
      const T0 = tuC + 273.15;
      const P = eps * sigma * A * (Math.pow(T,4) - Math.pow(T0,4));
      const dT = tC - tuC;

      // Kontrast - typische Wärmebild-Sensoren detektieren 0.05K (50 mK)
      const detectability = dT > 5 ? 'Exzellent' : dT > 2 ? 'Gut' : dT > 0.5 ? 'Schwierig' : 'Kaum';
      const col = dT > 5 ? '#22c55e' : dT > 2 ? '#fbbf24' : dT > 0.5 ? '#ef4444' : '#94a3b8';

      // SVG: Mensch mit IR-Glow
      const tColor = `hsl(${Math.min(60, dT * 8)}, 90%, 55%)`;
      card.querySelector('#th-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Hintergrund-Wärmemap -->
          <defs>
            <radialGradient id="thBg"><stop offset="0" stop-color="${tColor}" stop-opacity=".4"/><stop offset="1" stop-color="${tColor}" stop-opacity="0"/></radialGradient>
          </defs>
          <ellipse cx="200" cy="120" rx="80" ry="60" fill="url(#thBg)"/>
          <!-- Mensch -->
          <g transform="translate(200, 100)">
            <circle cx="0" cy="-30" r="14" fill="${tColor}"/>
            <ellipse cx="0" cy="10" rx="20" ry="30" fill="${tColor}"/>
            <rect x="-25" y="-5" width="8" height="40" rx="4" fill="${tColor}" transform="rotate(-10)"/>
            <rect x="17" y="-5" width="8" height="40" rx="4" fill="${tColor}" transform="rotate(10)"/>
            <rect x="-8" y="38" width="6" height="40" rx="3" fill="${tColor}"/>
            <rect x="2" y="38" width="6" height="40" rx="3" fill="${tColor}"/>
          </g>
          <!-- Kamera -->
          <rect x="320" y="80" width="60" height="40" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
          <circle cx="350" cy="100" r="12" fill="#0c0a1a" stroke="#ef4444"/>
          <circle cx="350" cy="100" r="6" fill="#ef4444"/>
          <text x="350" y="140" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="800">THERMAL</text>
          <!-- Strahlung-Pfeile -->
          ${[0,1,2,3].map(i => `<path d="M${230 + i*8} ${85 + i*5} L ${320 + i*2} ${95 + i*3}" stroke="${tColor}" stroke-width="1" stroke-dasharray="2 2" opacity=".6"/>`).join('')}
          <!-- Skala -->
          <rect x="20" y="170" width="200" height="14" rx="2" fill="url(#thBg2)"/>
          <defs>
            <linearGradient id="thBg2" x2="1" y2="0">
              <stop offset="0" stop-color="#1e3a8a"/>
              <stop offset=".5" stop-color="#fbbf24"/>
              <stop offset="1" stop-color="#dc2626"/>
            </linearGradient>
          </defs>
          <text x="20" y="195" font-size="9" fill="#1e3a8a">−20</text>
          <text x="220" y="195" font-size="9" fill="#dc2626">+40 °C</text>
        </svg>
      `;

      card.querySelector('#th-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#ef4444">
            <strong>${P.toFixed(1)} W</strong><span>Strahlungsleistung</span>
          </div>
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${dT.toFixed(1)} K</strong><span>Temperatur-Δ</span>
          </div>
          <div class="lab-result-stat" style="--c:${col}">
            <strong>${detectability}</strong><span>Detektierbarkeit</span>
          </div>
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>~${(P/1000 * 24).toFixed(2)} kWh</strong><span>pro Tag</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Mensch (37 °C) strahlt typisch 100—150 W ab. Wärmebildkamera detektiert ΔT &gt; 0,05 K. Bei Sommer-Hitze (Hintergrund nah Körpertemperatur) wird Detektion schwer.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 4: CCTV-Storage (Bandbreite × Tage) ============ */
  function calcStorage() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#c084fc">
        <div class="lab-icon"><i class="fas fa-hard-drive"></i></div>
        <div>
          <h3>CCTV-Storage-Kalkulation</h3>
          <span>Bandbreite × Cams × Tage → TB</span>
        </div>
      </div>
      <div class="lab-formula">
        TB = (Cams × Mbit/s × 86400 × Tage) / (8 × 1024²) &nbsp;·&nbsp; mit H.265+ ~ −40 %
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('st-c',  'Kameras',    1, 64, 1, 8,  '', 0)}
          ${slider('st-br', 'Bitrate/Cam', 1, 16, 0.5, 5, ' Mbit/s', 1)}
          ${slider('st-d',  'Retention',  1, 365, 1, 30, ' Tage', 0)}
          ${slider('st-e',  'Event-Faktor',  10, 100, 5, 100, ' %', 0)}
        </div>
        <div class="lab-vis" id="st-vis"></div>
        <div class="lab-result" id="st-result"></div>
      </div>
    `;
    function update() {
      const c = +card.querySelector('#st-c').value;
      const br = +card.querySelector('#st-br').value;
      const d = +card.querySelector('#st-d').value;
      const e = +card.querySelector('#st-e').value / 100;
      const mbitTotal = c * br * e;
      const gbPerDay = mbitTotal * 86400 / 8 / 1024;
      const tbTotal = gbPerDay * d / 1024;
      const drive = tbTotal <= 2 ? '2 TB' : tbTotal <= 4 ? '4 TB' : tbTotal <= 8 ? '8 TB' : tbTotal <= 12 ? '12 TB' : tbTotal <= 16 ? '16 TB' : tbTotal <= 24 ? '24 TB' : Math.ceil(tbTotal/4)*4 + ' TB';
      const raid = tbTotal > 8 ? 'RAID 5 empfohlen' : tbTotal > 4 ? 'Mirror sinnvoll' : 'Einzelplatte ok';

      card.querySelector('#st-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Cams -->
          ${Array.from({length: Math.min(16, c)}, (_,i) => {
            const x = 30 + (i % 8) * 28;
            const y = 40 + Math.floor(i / 8) * 36;
            return `<rect x="${x-10}" y="${y-7}" width="20" height="14" rx="2" fill="#1e293b" stroke="#22d3ee"/><circle cx="${x}" cy="${y}" r="3" fill="#22d3ee"/>`;
          }).join('')}
          ${c > 16 ? `<text x="270" y="56" font-size="11" fill="#94a3b8">+${c-16}</text>` : ''}
          <!-- Stream-Pfeile -->
          ${Array.from({length: 4}, (_,i) => `<line x1="${50 + i*60}" y1="80" x2="200" y2="130" stroke="#22d3ee" stroke-dasharray="2 2" opacity=".6">
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="${0.5+i*0.1}s" repeatCount="indefinite"/>
          </line>`).join('')}
          <!-- NVR Box -->
          <rect x="160" y="120" width="100" height="60" rx="6" fill="#1e293b" stroke="#c084fc" stroke-width="2"/>
          <text x="210" y="142" text-anchor="middle" font-size="11" fill="#c084fc" font-weight="800">NVR</text>
          <text x="210" y="158" text-anchor="middle" font-size="14" fill="#fbbf24" font-weight="900">${tbTotal.toFixed(1)} TB</text>
          <text x="210" y="172" text-anchor="middle" font-size="8" fill="#94a3b8">${drive}</text>
          <!-- Bandwidth meter -->
          <rect x="280" y="120" width="100" height="60" rx="6" fill="#0a0f1a" stroke="#475569"/>
          <text x="330" y="140" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="700">${mbitTotal.toFixed(1)} Mbit/s</text>
          <text x="330" y="155" text-anchor="middle" font-size="9" fill="#94a3b8">Bandbreite</text>
          <text x="330" y="170" text-anchor="middle" font-size="9" fill="#22c55e">${gbPerDay.toFixed(0)} GB/Tag</text>
        </svg>
      `;

      card.querySelector('#st-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${mbitTotal.toFixed(1)}</strong><span>Mbit/s total</span>
          </div>
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${gbPerDay.toFixed(0)}</strong><span>GB pro Tag</span>
          </div>
          <div class="lab-result-stat" style="--c:#c084fc">
            <strong>${tbTotal.toFixed(2)}</strong><span>TB total</span>
          </div>
          <div class="lab-result-stat" style="--c:#22c55e">
            <strong>${drive}</strong><span>NVR-Empfehlung</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> ${raid}. WD Purple / Seagate Skyhawk speziell für 24/7-Schreiblast. H.265+ Smart-Codec reduziert nochmal ~40 % bei wenig Bewegung.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 5: Beleuchtungsstärke (Lux) ============ */
  function calcLux() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#fbbf24">
        <div class="lab-icon"><i class="fas fa-sun"></i></div>
        <div>
          <h3>Beleuchtungsstärke-Rechner</h3>
          <span>Lux am Boden aus Flutlicht-Konfiguration</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>E</em> = (<em>Φ</em>·<em>η</em>·cos<em>θ</em>) / <em>d</em>² &nbsp;[Lux = lm/m²]
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('lx-lm', 'Lumen je Strahler', 1000, 30000, 500, 10000, ' lm', 0)}
          ${slider('lx-n',  'Anzahl Strahler', 1, 8, 1, 2, '', 0)}
          ${slider('lx-h',  'Montagehöhe', 2, 12, 0.5, 6, ' m', 1)}
          ${slider('lx-eff','Reflektor-Wirkungsgrad', 30, 95, 5, 75, ' %', 0)}
        </div>
        <div class="lab-vis" id="lx-vis"></div>
        <div class="lab-result" id="lx-result"></div>
      </div>
    `;
    function update() {
      const lm = +card.querySelector('#lx-lm').value;
      const n = +card.querySelector('#lx-n').value;
      const h = +card.querySelector('#lx-h').value;
      const eff = +card.querySelector('#lx-eff').value / 100;
      const totalLm = lm * n;
      // E ~ Φ·η / A_eff (vereinfacht, Abstrahlbereich Kegel)
      const beamArea = Math.PI * Math.pow(h * 0.7, 2);
      const lux = (totalLm * eff) / beamArea;
      const empf = lux > 500 ? 'Hell (Sportplatz)' : lux > 200 ? 'Sehr gut (Parkplatz)' : lux > 50 ? 'Ausreichend (Geh-weg)' : lux > 20 ? 'Schwach' : 'Dunkel';
      const c = lux > 500 ? '#fbbf24' : lux > 200 ? '#22c55e' : lux > 50 ? '#06b6d4' : '#94a3b8';

      card.querySelector('#lx-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <line x1="0" y1="180" x2="400" y2="180" stroke="#475569"/>
          <!-- Mast -->
          <rect x="195" y="${180 - h*10}" width="10" height="${h*10}" fill="#475569"/>
          <!-- Strahler -->
          ${Array.from({length: Math.min(4, n)}, (_,i) => {
            const offx = (i - n/2 + 0.5) * 8;
            return `<rect x="${190 + offx}" y="${178 - h*10 - 5}" width="6" height="10" rx="1" fill="#fbbf24"/>`;
          }).join('')}
          <!-- Lichtkegel -->
          <defs>
            <radialGradient id="lxGlow"><stop offset="0" stop-color="${c}" stop-opacity=".5"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
          </defs>
          <path d="M 200 ${178 - h*10} L 100 178 L 300 178 Z" fill="url(#lxGlow)"/>
          <!-- Lux-Skala -->
          <rect x="80" y="178" width="240" height="2" fill="${c}" opacity=".6"/>
          <text x="200" y="160" text-anchor="middle" font-size="14" fill="${c}" font-weight="900">${lux.toFixed(0)} lx</text>
          <text x="200" y="200" text-anchor="middle" font-size="9" fill="#94a3b8">Abstrahl-Bereich</text>
        </svg>
      `;

      card.querySelector('#lx-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${totalLm.toLocaleString('de-DE')}</strong><span>Lumen total</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${lux.toFixed(0)} lx</strong><span>am Boden</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${beamArea.toFixed(0)} m²</strong><span>Ausleuchtung</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${empf}</strong><span>Bewertung</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Standards: 5 lx Gehweg · 50 lx Parkplatz · 200 lx Wachposten · 500 lx Sportfeld · 100.000 lx Sonne mittags.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 6: Tresor-Versicherungssumme ============ */
  function calcInsurance() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#a855f7">
        <div class="lab-icon"><i class="fas fa-piggy-bank"></i></div>
        <div>
          <h3>Tresor → Versicherungssumme</h3>
          <span>EN 1143-1 Klasse · Privat- vs. Gewerbe-Wert</span>
        </div>
      </div>
      <div class="lab-formula">
        Klasse → max. Wertinhalt (privat oder gewerblich versicherbar)
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          <div class="lab-cls-picker" id="ins-pick"></div>
          ${slider('ins-w', 'Tatsächlicher Wertinhalt', 1000, 1000000, 5000, 50000, ' €', 0)}
          <div class="lab-cls-toggle">
            <button data-mode="privat" class="active">Privat</button>
            <button data-mode="gewerbe">Gewerblich</button>
          </div>
        </div>
        <div class="lab-vis" id="ins-vis"></div>
        <div class="lab-result" id="ins-result"></div>
      </div>
    `;
    const TABLE = [
      { k:'N (S2)',  p:5000,   g:2500,   c:'#94a3b8' },
      { k:'0',       p:20000,  g:10000,  c:'#22c55e' },
      { k:'I',       p:40000,  g:20000,  c:'#0891b2' },
      { k:'II',      p:100000, g:50000,  c:'#3b82f6' },
      { k:'III',     p:200000, g:100000, c:'#7c3aed' },
      { k:'IV',      p:300000, g:150000, c:'#a855f7' },
      { k:'V',       p:500000, g:250000, c:'#c084fc' },
      { k:'VI',      p:1000000,g:500000, c:'#ec4899' },
    ];
    let mode = 'privat';
    let selected = 'II';

    function updatePicker() {
      const pick = card.querySelector('#ins-pick');
      pick.innerHTML = TABLE.map(t => `
        <button data-k="${t.k}" class="lab-cls-btn${selected===t.k?' active':''}" style="--c:${t.c}">
          <strong>${t.k}</strong>
          <span>${(mode === 'privat' ? t.p : t.g).toLocaleString('de-DE')} €</span>
        </button>
      `).join('');
      pick.querySelectorAll('button').forEach(b => b.onclick = () => { selected = b.dataset.k; update(); });
    }

    function update() {
      const w = +card.querySelector('#ins-w').value;
      const t = TABLE.find(x => x.k === selected);
      const allowed = mode === 'privat' ? t.p : t.g;
      const ratio = w / allowed;
      const status = w <= allowed ? 'Versichert ✓' : 'NICHT versichert ⚠';
      const cStatus = w <= allowed ? '#22c55e' : '#ef4444';
      updatePicker();

      card.querySelectorAll('.lab-cls-toggle button').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === mode);
        b.onclick = () => { mode = b.dataset.mode; update(); };
      });

      card.querySelector('#ins-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Tresor -->
          <rect x="40" y="40" width="120" height="140" rx="4" fill="#1e293b" stroke="${t.c}" stroke-width="2"/>
          <rect x="50" y="50" width="100" height="120" fill="#0a0f1a"/>
          <circle cx="100" cy="105" r="22" fill="#1e293b" stroke="${t.c}" stroke-width="2"/>
          <line x1="100" y1="85" x2="100" y2="125" stroke="${t.c}" stroke-width="3"/>
          <line x1="80" y1="105" x2="120" y2="105" stroke="${t.c}" stroke-width="3"/>
          <text x="100" y="195" text-anchor="middle" font-size="11" fill="${t.c}" font-weight="900">Klasse ${selected}</text>
          <!-- Bar Chart -->
          <rect x="200" y="60" width="180" height="20" rx="2" fill="#1e293b" stroke="#475569"/>
          <rect x="200" y="60" width="${Math.min(180, 180 * ratio)}" height="20" rx="2" fill="${cStatus}"/>
          <text x="200" y="55" font-size="9" fill="#94a3b8">Wertinhalt</text>
          <text x="380" y="55" text-anchor="end" font-size="9" fill="#94a3b8">${w.toLocaleString('de-DE')} €</text>
          <rect x="200" y="100" width="180" height="20" rx="2" fill="#1e293b" stroke="#475569"/>
          <rect x="200" y="100" width="180" height="20" rx="2" fill="${t.c}"/>
          <text x="200" y="95" font-size="9" fill="#94a3b8">Versichert bis</text>
          <text x="380" y="95" text-anchor="end" font-size="9" fill="${t.c}" font-weight="700">${allowed.toLocaleString('de-DE')} €</text>
          <text x="290" y="155" text-anchor="middle" font-size="14" fill="${cStatus}" font-weight="900">${status}</text>
        </svg>
      `;

      card.querySelector('#ins-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:${t.c}">
            <strong>${selected}</strong><span>EN 1143-1 Klasse</span>
          </div>
          <div class="lab-result-stat" style="--c:${t.c}">
            <strong>${allowed.toLocaleString('de-DE')} €</strong><span>Max. versicherbar</span>
          </div>
          <div class="lab-result-stat" style="--c:${cStatus}">
            <strong>${(ratio*100).toFixed(0)} %</strong><span>Auslastung</span>
          </div>
          <div class="lab-result-stat" style="--c:${cStatus}">
            <strong>${status.split(' ')[0]}</strong><span>Status</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Versicherungs-Werte gem. VdS-Empfehlung. ${mode === 'privat' ? 'Privatkunden' : 'Gewerbe'} ${mode === 'privat' ? 'doppelter Wert vs. Gewerbe' : 'halbierter Wert wegen erhöhtem Risiko'}.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 7: Risiko-Index (E[Schaden]/Jahr) ============ */
  function calcRisk() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#f59e0b">
        <div class="lab-icon"><i class="fas fa-balance-scale"></i></div>
        <div>
          <h3>Risiko-Index</h3>
          <span>Erwarteter Verlust = Wahrscheinlichkeit × Schaden</span>
        </div>
      </div>
      <div class="lab-formula">
        E[<em>Verlust</em>] = <em>P</em>(<em>Einbruch</em>) × <em>S</em>(<em>Schaden</em>) − <em>Schutz</em>×<em>P</em>×<em>S</em>
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('rk-p', 'P(Einbruch) ohne Schutz', 1, 30, 1, 8, ' %/Jahr', 0)}
          ${slider('rk-s', 'Schaden je Vorfall', 5000, 500000, 5000, 50000, ' €', 0)}
          ${slider('rk-r', 'Schutz-Effektivität', 0, 95, 5, 70, ' %', 0)}
          ${slider('rk-i', 'Schutz-Investition', 0, 100000, 500, 8000, ' €', 0)}
        </div>
        <div class="lab-vis" id="rk-vis"></div>
        <div class="lab-result" id="rk-result"></div>
      </div>
    `;
    function update() {
      const p = +card.querySelector('#rk-p').value / 100;
      const s = +card.querySelector('#rk-s').value;
      const r = +card.querySelector('#rk-r').value / 100;
      const i = +card.querySelector('#rk-i').value;

      const verlustOhne = p * s;
      const verlustMit = p * s * (1 - r);
      const ersparnis = verlustOhne - verlustMit;
      const roi = (ersparnis - i / 10) / (i || 1) * 100;
      const amort = ersparnis > 0 ? i / ersparnis : 999;

      card.querySelector('#rk-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Bar Ohne Schutz -->
          <rect x="40" y="40" width="320" height="36" rx="4" fill="#1e293b" stroke="#475569"/>
          <rect x="40" y="40" width="${Math.min(320, verlustOhne / 1000)}" height="36" rx="4" fill="#ef4444"/>
          <text x="50" y="35" font-size="10" fill="#94a3b8">Ohne Schutz</text>
          <text x="55" y="65" font-size="14" fill="white" font-weight="900">${verlustOhne.toLocaleString('de-DE', {maximumFractionDigits:0})} €</text>
          <!-- Bar Mit Schutz -->
          <rect x="40" y="100" width="320" height="36" rx="4" fill="#1e293b" stroke="#475569"/>
          <rect x="40" y="100" width="${Math.min(320, verlustMit / 1000)}" height="36" rx="4" fill="#22c55e"/>
          <text x="50" y="95" font-size="10" fill="#94a3b8">Mit Schutz (−${(r*100).toFixed(0)} %)</text>
          <text x="55" y="125" font-size="14" fill="white" font-weight="900">${verlustMit.toLocaleString('de-DE', {maximumFractionDigits:0})} €</text>
          <!-- Ersparnis -->
          <text x="200" y="175" text-anchor="middle" font-size="16" fill="#fbbf24" font-weight="900">Ersparnis ${ersparnis.toLocaleString('de-DE', {maximumFractionDigits:0})} €/Jahr</text>
        </svg>
      `;

      card.querySelector('#rk-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#ef4444">
            <strong>${verlustOhne.toLocaleString('de-DE', {maximumFractionDigits:0})} €</strong><span>Verlust/Jahr (ohne)</span>
          </div>
          <div class="lab-result-stat" style="--c:#22c55e">
            <strong>${verlustMit.toLocaleString('de-DE', {maximumFractionDigits:0})} €</strong><span>Verlust/Jahr (mit)</span>
          </div>
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${amort.toFixed(1)} J</strong><span>Amortisation</span>
          </div>
          <div class="lab-result-stat" style="--c:${roi > 0 ? '#22c55e':'#ef4444'}">
            <strong>${roi > 0 ? '+' : ''}${roi.toFixed(0)}%</strong><span>ROI (10 J)</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Mittlere Einbruchs-Wahrscheinlichkeit DE: 2—5 % je Wohnung/Jahr, 8—15 % je Gewerbe. Mechanik RC2 + EMA: typisch 60—75 % Effektivität.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 8: Sprinkler-Wasserbedarf ============ */
  function calcSprinkler() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#06b6d4">
        <div class="lab-icon"><i class="fas fa-droplet"></i></div>
        <div>
          <h3>Sprinkler-Auslegung</h3>
          <span>VdS CEA 4001 · Brandlast → Wasserbedarf</span>
        </div>
      </div>
      <div class="lab-formula">
        Q = <em>A</em> × <em>ρ</em> &nbsp;·&nbsp; LH 1 (5 mm/min) — OH 3 (12,5 mm/min) — HH (30 mm/min)
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('sp-a', 'Geschützte Fläche', 50, 5000, 50, 500, ' m²', 0)}
          <div class="lab-cls-toggle" id="sp-haz">
            <button data-h="lh" data-r="5" class="active">LH (Wohnen)</button>
            <button data-h="oh1" data-r="7.5">OH 1</button>
            <button data-h="oh3" data-r="12.5">OH 3</button>
            <button data-h="hh" data-r="30">HH (Hochregal)</button>
          </div>
          ${slider('sp-t', 'Bemessungs-Brand-Zeit', 30, 90, 5, 60, ' min', 0)}
        </div>
        <div class="lab-vis" id="sp-vis"></div>
        <div class="lab-result" id="sp-result"></div>
      </div>
    `;
    let rate = 5;
    let hazard = 'LH';

    function update() {
      const a = +card.querySelector('#sp-a').value;
      const t = +card.querySelector('#sp-t').value;
      const qLpm = a * rate;          // l/min
      const totalL = qLpm * t;        // l über Bemessungsdauer
      const totalM3 = totalL / 1000;
      const tankSize = totalM3 < 30 ? '30 m³' : totalM3 < 60 ? '60 m³' : totalM3 < 120 ? '120 m³' : Math.ceil(totalM3/60)*60 + ' m³';
      const c = hazard === 'HH' ? '#dc2626' : hazard === 'OH3' ? '#fbbf24' : hazard === 'OH1' ? '#06b6d4' : '#22c55e';

      card.querySelector('#sp-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Tank -->
          <rect x="30" y="60" width="80" height="120" rx="4" fill="#1e293b" stroke="${c}" stroke-width="2"/>
          <rect x="35" y="${180 - Math.min(115, totalM3*1.5)}" width="70" height="${Math.min(115, totalM3*1.5)}" fill="${c}" opacity=".7"/>
          <text x="70" y="195" text-anchor="middle" font-size="10" fill="${c}" font-weight="800">${tankSize}</text>
          <!-- Pipes -->
          <line x1="110" y1="100" x2="140" y2="100" stroke="${c}" stroke-width="4"/>
          <line x1="140" y1="80" x2="140" y2="120" stroke="${c}" stroke-width="4"/>
          <!-- Sprinkler-Köpfe -->
          ${[1,2,3,4].map(i => {
            const x = 150 + i * 50;
            return `
              <line x1="${x}" y1="100" x2="${x}" y2="120" stroke="#94a3b8" stroke-width="2"/>
              <circle cx="${x}" cy="125" r="5" fill="${c}"/>
              ${Array.from({length: 4}, (_,j) => {
                const ang = -45 + j * 30;
                return `<line x1="${x}" y1="130" x2="${x + Math.sin(ang*Math.PI/180)*30}" y2="${130 + Math.cos(ang*Math.PI/180)*45}" stroke="${c}" stroke-width="1.5" opacity=".6">
                  <animate attributeName="opacity" values=".3;.8;.3" dur="1s" begin="${j*0.15}s" repeatCount="indefinite"/>
                </line>`;
              }).join('')}
            `;
          }).join('')}
          <line x1="150" y1="100" x2="350" y2="100" stroke="${c}" stroke-width="3"/>
        </svg>
      `;

      card.querySelector('#sp-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${rate} mm/min</strong><span>Beregnung</span>
          </div>
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${qLpm.toLocaleString('de-DE')}</strong><span>l/min</span>
          </div>
          <div class="lab-result-stat" style="--c:#06b6d4">
            <strong>${totalM3.toFixed(0)}</strong><span>m³ Bemessung</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${tankSize}</strong><span>Tank-Empfehlung</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Brandlast-Klassen nach VdS: LH = Hotel/Wohnen · OH 1—4 = Büro/Gewerbe · HH = Hochregal/Lager &gt;4,5 m.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#sp-haz button').forEach(b => b.onclick = () => {
        rate = +b.dataset.r;
        hazard = b.dataset.h.toUpperCase();
        card.querySelectorAll('#sp-haz button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MAIN VIEW ============ */

  function view(d) {
    const root = el('div');

    const hero = el('div', { class:'lab-hero' });
    hero.innerHTML = `
      <div class="lab-hero-bg"></div>
      <div class="lab-hero-content">
        <div class="lab-hero-tag">ENGINEERING-LAB · LIVE-FORMELN</div>
        <h1>🧮 8 physikalische Live-Rechner</h1>
        <p>
          Echte Physik-Formeln mit Live-Berechnung. Stelle Slider ein und sieh, wie sich Sicherheitstechnik in deinem Szenario verhält:
          Schalldruck, PIR-Geometrie, Wärmestrahlung, CCTV-Speicher, Beleuchtung, Tresor-Versicherung, Risiko-Index, Sprinkler-Auslegung.
        </p>
      </div>
    `;
    root.appendChild(hero);

    // 4×2 Grid mit allen Rechnern
    const grid = el('div', { class:'lab-grid' });
    grid.appendChild(calcSchall());
    grid.appendChild(calcPIR());
    grid.appendChild(calcThermal());
    grid.appendChild(calcStorage());
    grid.appendChild(calcLux());
    grid.appendChild(calcInsurance());
    grid.appendChild(calcRisk());
    grid.appendChild(calcSprinkler());
    root.appendChild(grid);

    return root;
  }

  return { view };
})();
