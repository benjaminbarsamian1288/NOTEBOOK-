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

  /* ============ FORMEL 9: Funkreichweite (Friis-Gleichung) ============ */
  function calcRadio() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#3b82f6">
        <div class="lab-icon"><i class="fas fa-tower-broadcast"></i></div>
        <div>
          <h3>Funkreichweite (Friis)</h3>
          <span>Empfangspegel = f(P_send, G, λ, d)</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>P_r</em> = <em>P_t</em> + <em>G_t</em> + <em>G_r</em> − <em>FSPL</em> &nbsp;·&nbsp; <em>FSPL</em> = 20·log₁₀(<em>d</em>) + 20·log₁₀(<em>f</em>) − 27,55
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('rd-pt', 'Sendeleistung', -10, 30, 1, 14, ' dBm', 0)}
          ${slider('rd-g',  'Antennen-Gewinn (Σ)', 0, 30, 0.5, 5, ' dBi', 1)}
          ${slider('rd-f',  'Frequenz', 100, 6000, 100, 868, ' MHz', 0)}
          ${slider('rd-d',  'Distanz', 5, 5000, 5, 200, ' m', 0)}
          ${slider('rd-rx', 'Empfänger-Empfindlichkeit', -120, -60, 2, -100, ' dBm', 0)}
        </div>
        <div class="lab-vis" id="rd-vis"></div>
        <div class="lab-result" id="rd-result"></div>
      </div>
    `;
    function update() {
      const Pt = +card.querySelector('#rd-pt').value;
      const G = +card.querySelector('#rd-g').value;
      const f = +card.querySelector('#rd-f').value;
      const d = +card.querySelector('#rd-d').value;
      const sens = +card.querySelector('#rd-rx').value;
      const FSPL = 20*Math.log10(d) + 20*Math.log10(f) - 27.55;
      const Pr = Pt + G - FSPL;
      const margin = Pr - sens;
      const ok = margin > 10 ? 'Exzellent' : margin > 0 ? 'OK' : margin > -10 ? 'Wackelig' : 'Kein Link';
      const c = margin > 10 ? '#22c55e' : margin > 0 ? '#fbbf24' : '#ef4444';
      // Maximum range bei dieser Pegel-Reserve
      const maxFSPL = Pt + G - sens;
      const maxD = Math.pow(10, (maxFSPL - 20*Math.log10(f) + 27.55) / 20);

      card.querySelector('#rd-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Sender -->
          <rect x="20" y="80" width="40" height="60" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
          <line x1="40" y1="60" x2="40" y2="80" stroke="#3b82f6" stroke-width="3"/>
          <circle cx="40" cy="55" r="4" fill="#3b82f6"/>
          ${[1,2,3].map(i => `<circle cx="40" cy="55" r="${i*8}" fill="none" stroke="#3b82f6" stroke-width="1" opacity="${0.5-i*0.1}"><animate attributeName="r" values="${i*4};${i*12};${i*4}" dur="2s" begin="${i*0.3}s" repeatCount="indefinite"/></circle>`).join('')}
          <text x="40" y="160" text-anchor="middle" font-size="9" fill="#3b82f6" font-weight="700">TX</text>
          <text x="40" y="172" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">${Pt} dBm</text>
          <!-- Free space line -->
          <line x1="60" y1="100" x2="${Math.min(340, 60 + d/4)}" y2="100" stroke="${c}" stroke-width="2" stroke-dasharray="6 3" opacity=".7"/>
          <text x="${(60 + Math.min(340, 60 + d/4))/2}" y="90" text-anchor="middle" font-size="10" fill="${c}" font-weight="700">${d} m · ${f} MHz</text>
          <text x="${(60 + Math.min(340, 60 + d/4))/2}" y="118" text-anchor="middle" font-size="9" fill="#94a3b8">FSPL ${FSPL.toFixed(0)} dB</text>
          <!-- Empfänger -->
          <rect x="${Math.min(340, 60 + d/4)}" y="80" width="40" height="60" rx="4" fill="#1e293b" stroke="${c}" stroke-width="2"/>
          <line x1="${Math.min(360, 80 + d/4)}" y1="60" x2="${Math.min(360, 80 + d/4)}" y2="80" stroke="${c}" stroke-width="3"/>
          <circle cx="${Math.min(360, 80 + d/4)}" cy="55" r="4" fill="${c}"/>
          <text x="${Math.min(360, 80 + d/4)}" y="160" text-anchor="middle" font-size="9" fill="${c}" font-weight="700">RX</text>
          <text x="${Math.min(360, 80 + d/4)}" y="172" text-anchor="middle" font-size="11" fill="${c}" font-weight="800">${Pr.toFixed(0)} dBm</text>
        </svg>
      `;
      card.querySelector('#rd-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${FSPL.toFixed(1)} dB</strong><span>Free-Space-Loss</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${Pr.toFixed(1)} dBm</strong><span>RX-Pegel</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${margin > 0 ? '+' : ''}${margin.toFixed(1)} dB</strong><span>Link-Reserve</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${maxD < 1000 ? maxD.toFixed(0)+' m' : (maxD/1000).toFixed(1)+' km'}</strong><span>Max-Reichweite</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Status: <strong style="color:${c}">${ok}</strong>. Typische Werte: 433 MHz Funk-Sensor (14 dBm + 2 dBi → 300 m), 868 MHz Funk-Alarm (200 m), 2,4 GHz WLAN (50 m indoor).</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 10: Brandlast q (kWh/m²) ============ */
  function calcFireLoad() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#ea580c">
        <div class="lab-icon"><i class="fas fa-fire-flame-curved"></i></div>
        <div>
          <h3>Brandlast-Berechnung</h3>
          <span>q = Σ(M·H)/A · Brand-Belastung kWh/m²</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>q</em> = Σ(<em>m_i</em>·<em>H_i</em>) / <em>A</em> &nbsp;·&nbsp; Hu (Holz) ≈ 4,2 kWh/kg · (Papier) 4,1 · (Plastik) 11
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('fl-a', 'Raum-Fläche', 10, 1000, 5, 100, ' m²', 0)}
          ${slider('fl-h', 'Holz/Möbel', 0, 5000, 50, 500, ' kg', 0)}
          ${slider('fl-p', 'Papier/Akten', 0, 3000, 25, 100, ' kg', 0)}
          ${slider('fl-k', 'Kunststoffe', 0, 2000, 25, 50, ' kg', 0)}
          ${slider('fl-t', 'Textilien', 0, 1000, 25, 30, ' kg', 0)}
        </div>
        <div class="lab-vis" id="fl-vis"></div>
        <div class="lab-result" id="fl-result"></div>
      </div>
    `;
    function update() {
      const A = +card.querySelector('#fl-a').value;
      const h = +card.querySelector('#fl-h').value;
      const p = +card.querySelector('#fl-p').value;
      const k = +card.querySelector('#fl-k').value;
      const t = +card.querySelector('#fl-t').value;
      const energy = h*4.2 + p*4.1 + k*11 + t*5.5;   // kWh total
      const q = energy / A;                            // kWh/m²
      // Klassifikation nach DIN 18230
      const klasse = q < 100 ? 'Gering (≤ 100)' : q < 200 ? 'Mittel (100—200)' : q < 400 ? 'Hoch (200—400)' : 'Sehr hoch (> 400)';
      const c = q < 100 ? '#22c55e' : q < 200 ? '#fbbf24' : q < 400 ? '#ea580c' : '#dc2626';
      const sprink = q < 100 ? 'Optional' : q < 200 ? 'Empfohlen' : q < 400 ? 'Pflicht (OH)' : 'Pflicht (HH)';

      card.querySelector('#fl-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Raum -->
          <rect x="40" y="60" width="320" height="120" fill="rgba(${c==='#22c55e'?'34,197,94':c==='#fbbf24'?'251,191,36':c==='#ea580c'?'234,88,12':'220,38,38'},.08)" stroke="${c}" stroke-width="2"/>
          <!-- 4 stapelnde Bars: Holz/Papier/Kunststoff/Textil -->
          ${(() => {
            const total = h + p + k + t || 1;
            const bars = [
              { lbl:'Holz', val: h, color:'#92400e', x: 60 },
              { lbl:'Papier', val: p, color:'#fbbf24', x: 145 },
              { lbl:'Plast.', val: k, color:'#ef4444', x: 230 },
              { lbl:'Text.', val: t, color:'#7c3aed', x: 315 },
            ];
            return bars.map(b => {
              const ht = Math.min(100, (b.val / 5000) * 100);
              return `
                <rect x="${b.x-25}" y="${175 - ht}" width="50" height="${ht}" fill="${b.color}" opacity=".8"/>
                <text x="${b.x}" y="${178 - ht - 4}" text-anchor="middle" font-size="9" fill="${b.color}" font-weight="700">${b.val}</text>
                <text x="${b.x}" y="${190}" text-anchor="middle" font-size="9" fill="#94a3b8">${b.lbl}</text>
              `;
            }).join('');
          })()}
          <text x="200" y="50" text-anchor="middle" font-size="14" fill="${c}" font-weight="900">q = ${q.toFixed(0)} kWh/m²</text>
        </svg>
      `;
      card.querySelector('#fl-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${energy.toFixed(0)}</strong><span>kWh total</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${q.toFixed(0)}</strong><span>q [kWh/m²]</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${klasse.split(' ')[0]}</strong><span>Klasse</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${sprink}</strong><span>Sprinkler</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> DIN 18230: Bauteile müssen Feuerwiderstandsdauer gem. Brandlast haben. Bei q &gt; 400 kWh/m²: F90+ pflicht, automatische Löschanlage zwingend.</p>
      `;
    }
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 11: EM-Schirmung (Skin-Tiefe) ============ */
  function calcShielding() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#a855f7">
        <div class="lab-icon"><i class="fas fa-shield-virus"></i></div>
        <div>
          <h3>EM-Schirmung (Skin-Effekt)</h3>
          <span>Faraday-Käfig · Schirmdämpfung in dB</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>δ</em> = 1/√(π·<em>f</em>·<em>μ</em>·<em>σ</em>) &nbsp;·&nbsp; <em>SE</em> ≈ 8,69·(<em>t</em>/<em>δ</em>) dB
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('sh-f', 'Frequenz', 1, 6000, 1, 868, ' MHz', 0)}
          ${slider('sh-t', 'Wandstärke', 0.1, 10, 0.1, 2, ' mm', 1)}
          <div class="lab-cls-toggle" id="sh-mat">
            <button data-s="5.96e7" data-m="0.99" data-name="Kupfer" class="active">Kupfer</button>
            <button data-s="3.5e7" data-m="0.99" data-name="Alu">Alu</button>
            <button data-s="1.0e7" data-m="200" data-name="Stahl">Stahl</button>
            <button data-s="1.45e7" data-m="100000" data-name="Mu-Metall">Mu-Metall</button>
          </div>
        </div>
        <div class="lab-vis" id="sh-vis"></div>
        <div class="lab-result" id="sh-result"></div>
      </div>
    `;
    let sigma = 5.96e7, mu_r = 0.99, matName = 'Kupfer';

    function update() {
      const f = +card.querySelector('#sh-f').value * 1e6; // Hz
      const t = +card.querySelector('#sh-t').value / 1000; // m
      const mu0 = 4 * Math.PI * 1e-7;
      const delta = 1 / Math.sqrt(Math.PI * f * mu0 * mu_r * sigma); // m
      const deltaMm = delta * 1000;
      const SE = 8.686 * (t / delta);  // Absorption-Loss in dB
      const ok = SE > 80 ? 'Tresor-Niveau' : SE > 40 ? 'Bank-Server' : SE > 20 ? 'Wohnung' : SE > 10 ? 'Schwach' : 'Minimal';
      const c = SE > 80 ? '#22c55e' : SE > 40 ? '#06b6d4' : SE > 20 ? '#fbbf24' : '#ef4444';

      card.querySelector('#sh-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- TX -->
          <rect x="20" y="80" width="40" height="40" rx="4" fill="#1e293b" stroke="#dc2626" stroke-width="2"/>
          <text x="40" y="105" text-anchor="middle" font-size="10" fill="#dc2626" font-weight="700">TX</text>
          ${[1,2,3].map(i => `<circle cx="60" cy="100" r="${i*15}" fill="none" stroke="#dc2626" stroke-width="2" opacity="${0.6-i*0.15}"><animate attributeName="r" values="${i*8};${i*20};${i*8}" dur="2s" begin="${i*0.3}s" repeatCount="indefinite"/></circle>`).join('')}
          <!-- Wand -->
          <rect x="180" y="40" width="${Math.max(8, t*1000/2)}" height="120" fill="${c}" opacity=".8" stroke="#0b1424" stroke-width="2"/>
          <text x="${180 + Math.max(8, t*1000/2)/2}" y="35" text-anchor="middle" font-size="9" fill="${c}" font-weight="800">${matName}</text>
          <text x="${180 + Math.max(8, t*1000/2)/2}" y="175" text-anchor="middle" font-size="9" fill="#94a3b8">${(t*1000).toFixed(1)} mm</text>
          <!-- RX dämpft -->
          <rect x="320" y="80" width="40" height="40" rx="4" fill="#1e293b" stroke="${c}" stroke-width="2"/>
          <text x="340" y="105" text-anchor="middle" font-size="10" fill="${c}" font-weight="700">RX</text>
          ${SE > 10 ? `<text x="340" y="135" text-anchor="middle" font-size="11" fill="${c}" font-weight="800">−${SE.toFixed(0)} dB</text>` : ''}
        </svg>
      `;
      card.querySelector('#sh-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#a855f7">
            <strong>${deltaMm < 0.01 ? (deltaMm*1000).toFixed(1)+' µm' : deltaMm.toFixed(2)+' mm'}</strong><span>Skin-Tiefe δ</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${SE.toFixed(0)} dB</strong><span>Schirmdämpfung</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${(t / delta).toFixed(1)}×</strong><span>t/δ-Verhältnis</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${ok}</strong><span>Bewertung</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Für GSM-Jammer-Schutz Banken: SE &gt; 60 dB · TEMPEST/Abhörschutz: SE &gt; 100 dB. Mu-Metall für niederfrequente Magnetfelder, Kupfer/Alu für HF.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#sh-mat button').forEach(b => b.onclick = () => {
        sigma = +b.dataset.s; mu_r = +b.dataset.m; matName = b.dataset.name;
        card.querySelectorAll('#sh-mat button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ FORMEL 12: Radarquerschnitt (RCS) → Reichweite ============ */
  function calcRadar() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#22d3ee">
        <div class="lab-icon"><i class="fas fa-satellite-dish"></i></div>
        <div>
          <h3>Radar-Reichweite (RCS)</h3>
          <span>Radargleichung · R_max = f(P, G, σ, S_min)</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>R_max</em> = ⁴√(<em>P_t</em>·<em>G</em>²·<em>λ</em>²·<em>σ</em> / ((4π)³·<em>S_min</em>))
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('rs-p', 'Sendeleistung', 0.1, 100, 0.1, 1, ' W', 1)}
          ${slider('rs-g', 'Antennen-Gewinn', 5, 50, 1, 25, ' dBi', 0)}
          ${slider('rs-f', 'Frequenz', 1, 100, 0.5, 24, ' GHz', 1)}
          ${slider('rs-s', 'Empfindlichkeit', -130, -70, 2, -110, ' dBm', 0)}
          <div class="lab-cls-toggle" id="rs-tgt">
            <button data-rcs="0.01" data-name="Mensch" class="active">Mensch (0.01 m²)</button>
            <button data-rcs="1" data-name="PKW">PKW (1 m²)</button>
            <button data-rcs="10" data-name="LKW">LKW (10 m²)</button>
            <button data-rcs="100" data-name="Helikopter">Heli (100 m²)</button>
          </div>
        </div>
        <div class="lab-vis" id="rs-vis"></div>
        <div class="lab-result" id="rs-result"></div>
      </div>
    `;
    let rcs = 0.01, tgtName = 'Mensch';

    function update() {
      const Pw = +card.querySelector('#rs-p').value;       // W
      const G_dB = +card.querySelector('#rs-g').value;
      const G = Math.pow(10, G_dB / 10);
      const f = +card.querySelector('#rs-f').value * 1e9;  // Hz
      const lambda = 3e8 / f;                              // m
      const Smin_dBm = +card.querySelector('#rs-s').value;
      const Smin = Math.pow(10, Smin_dBm / 10) * 1e-3;     // W
      const Rmax = Math.pow(
        (Pw * G * G * lambda * lambda * rcs) / (Math.pow(4*Math.PI, 3) * Smin),
        0.25
      );
      const c = Rmax > 1000 ? '#22c55e' : Rmax > 200 ? '#06b6d4' : Rmax > 50 ? '#fbbf24' : '#ef4444';

      const visR = Math.min(160, Math.log10(Rmax + 1) * 30);
      card.querySelector('#rs-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Radar -->
          <g transform="translate(60, 100)">
            <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
            <circle r="6" fill="#22d3ee"/>
          </g>
          <!-- Range circles -->
          ${[0.25, 0.5, 0.75, 1].map(p => `<circle cx="60" cy="100" r="${visR*p}" fill="none" stroke="#22d3ee" stroke-width="1" opacity="${0.6-p*0.3}" stroke-dasharray="3 3"/>`).join('')}
          <!-- Target -->
          ${(() => {
            const tx = 60 + visR * 0.85;
            return `
              <g transform="translate(${tx}, 100)">
                ${tgtName === 'Mensch' ? `
                  <circle cx="0" cy="-8" r="4" fill="${c}"/>
                  <rect x="-3" y="-4" width="6" height="12" fill="${c}"/>
                ` : tgtName === 'PKW' ? `
                  <rect x="-10" y="-4" width="20" height="10" rx="2" fill="${c}"/>
                  <circle cx="-6" cy="6" r="2" fill="#0a0f1a"/>
                  <circle cx="6" cy="6" r="2" fill="#0a0f1a"/>
                ` : tgtName === 'LKW' ? `
                  <rect x="-14" y="-6" width="30" height="14" rx="2" fill="${c}"/>
                  <circle cx="-8" cy="8" r="3" fill="#0a0f1a"/>
                  <circle cx="10" cy="8" r="3" fill="#0a0f1a"/>
                ` : `
                  <ellipse cx="0" cy="0" rx="14" ry="5" fill="${c}"/>
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="${c}" stroke-width="2"><animateTransform attributeName="transform" type="rotate" values="0;360" dur=".3s" repeatCount="indefinite"/></line>
                `}
              </g>
              <text x="${tx}" y="125" text-anchor="middle" font-size="9" fill="${c}" font-weight="700">${tgtName}</text>
            `;
          })()}
          <!-- Sweep -->
          <line x1="60" y1="100" x2="${60 + visR}" y2="100" stroke="#22d3ee" stroke-width="2" opacity=".7"><animateTransform attributeName="transform" type="rotate" values="0 60 100;360 60 100" dur="3s" repeatCount="indefinite"/></line>
          <text x="200" y="180" text-anchor="middle" font-size="11" fill="${c}" font-weight="800">${Rmax < 1000 ? Rmax.toFixed(0)+' m' : (Rmax/1000).toFixed(1)+' km'}</text>
        </svg>
      `;
      card.querySelector('#rs-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${(lambda*100).toFixed(1)} cm</strong><span>Wellenlänge λ</span>
          </div>
          <div class="lab-result-stat" style="--c:#22d3ee">
            <strong>${G.toFixed(0)}×</strong><span>Antennen-Gain (lin.)</span>
          </div>
          <div class="lab-result-stat" style="--c:#fbbf24">
            <strong>${rcs} m²</strong><span>RCS (${tgtName})</span>
          </div>
          <div class="lab-result-stat" style="--c:${c}">
            <strong>${Rmax < 1000 ? Rmax.toFixed(0)+' m' : (Rmax/1000).toFixed(1)+' km'}</strong><span>R_max</span>
          </div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Radarquerschnitt typisch: Vogel 0,01 · Mensch 0,1—1 · PKW 1—5 · LKW 10—50 · Schiff 1000+ m². Stealth-Jet ~ 0,001 m². Skaliert mit ⁴√σ.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#rs-tgt button').forEach(b => b.onclick = () => {
        rcs = +b.dataset.rcs; tgtName = b.dataset.name;
        card.querySelectorAll('#rs-tgt button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MELDER 1: Magnetkontakt (Reed) · Schaltabstand ============ */
  function calcReed() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#22c55e">
        <div class="lab-icon"><i class="fas fa-magnet"></i></div>
        <div>
          <h3>Magnetkontakt · Schaltabstand</h3>
          <span>Reed-Sensor · Magnetfeld-Abfall mit Distanz</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>B(d)</em> = <em>B₀</em> · (<em>r</em>/(<em>r</em>+<em>d</em>))³ &nbsp;·&nbsp; Alarm wenn <em>B</em> &lt; <em>B<sub>schalt</sub></em>
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('reed-b0', 'Magnet-Remanenz B₀', 50, 600, 10, 200, ' mT', 0)}
          ${slider('reed-r',  'Magnet-Radius', 2, 20, 1, 6, ' mm', 0)}
          ${slider('reed-th', 'Reed-Schaltschwelle', 1, 30, 0.5, 8, ' mT', 1)}
          <div class="lab-cls-toggle" id="reed-typ">
            <button data-th="8" class="active">Standard</button>
            <button data-th="3">Hochsicher (eng)</button>
            <button data-th="15">Tor/Garage (weit)</button>
          </div>
        </div>
        <div class="lab-vis" id="reed-vis"></div>
        <div class="lab-result" id="reed-result"></div>
      </div>
    `;
    function update() {
      const B0 = +card.querySelector('#reed-b0').value;
      const r = +card.querySelector('#reed-r').value;
      const th = +card.querySelector('#reed-th').value;
      // Schaltabstand: löse B0*(r/(r+d))^3 = th  → d = r*((B0/th)^(1/3) - 1)
      const dSchalt = r * (Math.pow(B0 / th, 1/3) - 1);
      const ok = dSchalt < 8 ? 'sehr eng (manipulationssicher)' : dSchalt < 25 ? 'normal (Tür/Fenster)' : 'weit (Tor)';
      const c = dSchalt < 8 ? '#22c55e' : dSchalt < 25 ? '#06b6d4' : '#fbbf24';

      const scale = Math.min(6, 220 / Math.max(dSchalt, 5));
      const gapPx = Math.min(220, dSchalt * scale);
      card.querySelector('#reed-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <line x1="0" y1="150" x2="400" y2="150" stroke="#1e293b" stroke-width="2"/>
          <!-- Reed (Rahmen) -->
          <rect x="40" y="95" width="50" height="50" rx="5" fill="#1e293b" stroke="${c}" stroke-width="2"/>
          <text x="65" y="125" text-anchor="middle" font-size="9" fill="${c}" font-weight="800">REED</text>
          <line x1="48" y1="120" x2="82" y2="120" stroke="${c}" stroke-width="1.5"/>
          <!-- Magnet (Türflügel) -->
          <g transform="translate(${90 + gapPx}, 0)">
            <rect x="0" y="95" width="50" height="50" rx="5" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
            <rect x="0" y="95" width="25" height="50" rx="5" fill="#dc2626"/>
            <text x="12" y="125" text-anchor="middle" font-size="11" fill="#fff" font-weight="900">N</text>
            <text x="38" y="125" text-anchor="middle" font-size="11" fill="#fff" font-weight="900">S</text>
          </g>
          <!-- Feldlinien -->
          ${[0,1,2].map(i => `<path d="M ${90+gapPx} ${108+i*12} Q ${65+gapPx/2} ${70+i*20} ${90} ${108+i*12}" fill="none" stroke="#ef4444" stroke-width="1" opacity="${0.5-i*0.12}"/>`).join('')}
          <!-- Gap-Maß -->
          <line x1="90" y1="170" x2="${90+gapPx}" y2="170" stroke="${c}" stroke-width="1.5"/>
          <text x="${90+gapPx/2}" y="185" text-anchor="middle" font-size="11" fill="${c}" font-weight="800">${dSchalt.toFixed(1)} mm Schaltabstand</text>
        </svg>
      `;
      card.querySelector('#reed-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:${c}"><strong>${dSchalt.toFixed(1)} mm</strong><span>Schaltabstand</span></div>
          <div class="lab-result-stat" style="--c:#ef4444"><strong>${B0} mT</strong><span>am Magneten</span></div>
          <div class="lab-result-stat" style="--c:#22c55e"><strong>${th} mT</strong><span>Schaltschwelle</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${ok}</strong><span>Bewertung</span></div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Alarm löst aus, sobald die Tür weiter als der Schaltabstand öffnet (Feld &lt; Schwelle). VdS verlangt enge Abstände + Sabotage-Überwachung; bei Tor-Magneten größere Abstände tolerierbar.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#reed-typ button').forEach(b => b.onclick = () => {
        card.querySelector('#reed-th').value = b.dataset.th;
        card.querySelector('#reed-th-v').textContent = (+b.dataset.th).toFixed(1) + ' mT';
        card.querySelectorAll('#reed-typ button').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MELDER 2: Rauchmelder · Obscuration & Abdeckung ============ */
  function calcSmoke() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#94a3b8">
        <div class="lab-icon"><i class="fas fa-smog"></i></div>
        <div>
          <h3>Rauchmelder · Ansprechen & Abdeckung</h3>
          <span>Optische Trübung (Obscuration) · DIN 14676 / EN 14604</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>m</em> = (1 − <em>I</em>/<em>I₀</em>)·100 %/m &nbsp;·&nbsp; <em>n</em> = ⌈<em>A<sub>Raum</sub></em> / <em>A<sub>Melder</sub></em>⌉
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('smk-obs', 'Aktuelle Trübung', 0, 15, 0.1, 3, ' %/m', 1)}
          ${slider('smk-th',  'Ansprechschwelle', 1, 8, 0.1, 3.5, ' %/m', 1)}
          ${slider('smk-area','Raumfläche', 10, 200, 5, 60, ' m²', 0)}
          <div class="lab-cls-toggle" id="smk-typ">
            <button data-cov="60" data-name="Wohnraum (60 m²)" class="active">Wohnraum</button>
            <button data-cov="40" data-name="Flur ≤ 40 m²">Flur</button>
            <button data-cov="20" data-name="Industrie (eng)">Industrie</button>
          </div>
        </div>
        <div class="lab-vis" id="smk-vis"></div>
        <div class="lab-result" id="smk-result"></div>
      </div>
    `;
    let cov = 60;
    function update() {
      const obs = +card.querySelector('#smk-obs').value;
      const th = +card.querySelector('#smk-th').value;
      const area = +card.querySelector('#smk-area').value;
      const alarm = obs >= th;
      const n = Math.ceil(area / cov);
      const fillRatio = Math.min(1, obs / th);
      const c = alarm ? '#ef4444' : obs > th * 0.6 ? '#fbbf24' : '#22c55e';

      card.querySelector('#smk-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Decke + Melder -->
          <line x1="40" y1="30" x2="360" y2="30" stroke="#475569" stroke-width="3"/>
          <rect x="180" y="30" width="40" height="16" rx="8" fill="#1e293b" stroke="${c}" stroke-width="2"/>
          <circle cx="200" cy="38" r="4" fill="${c}">${alarm ? '<animate attributeName="opacity" values="1;.2;1" dur=".6s" repeatCount="indefinite"/>' : ''}</circle>
          <!-- Rauch (steigt) -->
          ${[0,1,2,3].map(i => `<ellipse cx="${150+i*30}" cy="${150-fillRatio*90}" rx="${18+i*4}" ry="${10+fillRatio*8}" fill="#94a3b8" opacity="${0.1+fillRatio*0.3}"><animate attributeName="cy" values="${160-fillRatio*60};${60};${160-fillRatio*60}" dur="${3+i}s" repeatCount="indefinite"/></ellipse>`).join('')}
          <!-- Feuerquelle -->
          <path d="M 190 175 Q 180 150 200 140 Q 220 150 210 175 Z" fill="#f97316"/>
          <path d="M 196 175 Q 192 158 200 150 Q 208 158 204 175 Z" fill="#fbbf24"/>
          <!-- Trübungsbalken -->
          <rect x="40" y="60" width="100" height="14" rx="3" fill="#1e293b"/>
          <rect x="40" y="60" width="${Math.min(100, obs/15*100)}" height="14" rx="3" fill="${c}"/>
          <line x1="${40+th/15*100}" y1="56" x2="${40+th/15*100}" y2="78" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 2"/>
          <text x="40" y="92" font-size="9" fill="#94a3b8">Trübung ${obs.toFixed(1)} %/m · Schwelle ${th.toFixed(1)}</text>
          ${alarm ? '<text x="280" y="70" font-size="14" fill="#ef4444" font-weight="900">🔔 ALARM</text>' : '<text x="280" y="70" font-size="12" fill="#22c55e" font-weight="800">überwacht</text>'}
        </svg>
      `;
      card.querySelector('#smk-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:${c}"><strong>${obs.toFixed(1)} %/m</strong><span>Trübung</span></div>
          <div class="lab-result-stat" style="--c:${alarm?'#ef4444':'#22c55e'}"><strong>${alarm?'ALARM':'OK'}</strong><span>Status</span></div>
          <div class="lab-result-stat" style="--c:#06b6d4"><strong>${n}</strong><span>Melder nötig</span></div>
          <div class="lab-result-stat" style="--c:#06b6d4"><strong>${cov} m²</strong><span>pro Melder</span></div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Optische Melder sprechen bei 2—4 %/m an (Schwelbrand). DIN 14676: max. 60 m²/Melder, Abstand ≤ 0,5 m von Wand fern, Mindestabstand zu Leuchten. Pflicht in Schlaf-/Kinderzimmern + Fluren.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#smk-typ button').forEach(b => b.onclick = () => {
        cov = +b.dataset.cov;
        card.querySelectorAll('#smk-typ button').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MELDER 3: Wärmemelder · Maximal vs Differential ============ */
  function calcHeat() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#f97316">
        <div class="lab-icon"><i class="fas fa-temperature-arrow-up"></i></div>
        <div>
          <h3>Wärmemelder · Ansprechzeit</h3>
          <span>Maximalmelder vs Differentialmelder (Rate-of-Rise)</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>t</em> = (<em>θ<sub>max</sub></em> − <em>θ₀</em>) / <em>ṙ</em> &nbsp;·&nbsp; Diff. löst bei <em>ṙ</em> &gt; <em>ṙ<sub>th</sub></em>
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('heat-t0',  'Raumtemperatur θ₀', 0, 40, 1, 21, ' °C', 0)}
          ${slider('heat-rate','Temperaturanstieg ṙ', 1, 60, 1, 12, ' K/min', 0)}
          <div class="lab-cls-toggle" id="heat-cls">
            <button data-max="58" data-name="A1" class="active">A1 (58 °C)</button>
            <button data-max="54" data-name="A2">A2 (54 °C)</button>
            <button data-max="69" data-name="B">B (69 °C)</button>
          </div>
        </div>
        <div class="lab-vis" id="heat-vis"></div>
        <div class="lab-result" id="heat-result"></div>
      </div>
    `;
    let thetaMax = 58, clsName = 'A1';
    const rateTh = 10; // K/min Differential-Schwelle
    function update() {
      const t0 = +card.querySelector('#heat-t0').value;
      const rate = +card.querySelector('#heat-rate').value;
      const tMax = (thetaMax - t0) / rate; // min bis Maximalmelder
      const diffTrig = rate > rateTh;
      const tDiff = diffTrig ? Math.max(0.3, 5 / rate) : null; // grobe Reaktionszeit Differential
      const c = diffTrig ? '#22c55e' : '#fbbf24';

      const maxH = 150;
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const tm = (tMax * 1.2) * i / 20;
        const temp = t0 + rate * tm;
        const x = 50 + (i/20) * 300;
        const y = 170 - Math.min(maxH, (temp - 0) * 1.6);
        pts.push(`${x},${y}`);
      }
      const yMax = 170 - Math.min(maxH, thetaMax * 1.6);
      card.querySelector('#heat-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <line x1="50" y1="170" x2="360" y2="170" stroke="#475569"/>
          <line x1="50" y1="20" x2="50" y2="170" stroke="#475569"/>
          <text x="30" y="25" font-size="8" fill="#64748b">°C</text>
          <text x="350" y="185" font-size="8" fill="#64748b">t</text>
          <!-- Maximal-Schwelle -->
          <line x1="50" y1="${yMax}" x2="360" y2="${yMax}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 3"/>
          <text x="355" y="${yMax-4}" text-anchor="end" font-size="9" fill="#ef4444" font-weight="700">${thetaMax}°C (${clsName})</text>
          <!-- Temperaturkurve -->
          <polyline points="${pts.join(' ')}" fill="none" stroke="#f97316" stroke-width="2.5"/>
          <!-- Ansprechpunkt -->
          ${tMax < tMax*1.2 ? `<circle cx="${50 + (tMax/(tMax*1.2))*300}" cy="${yMax}" r="5" fill="#ef4444"/>` : ''}
          <text x="60" y="40" font-size="10" fill="${c}" font-weight="800">${diffTrig ? 'Differential: SOFORT-Alarm ('+rate+' K/min)' : 'nur Maximal-Melder spricht an'}</text>
        </svg>
      `;
      card.querySelector('#heat-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#ef4444"><strong>${tMax.toFixed(1)} min</strong><span>bis Maximal (${thetaMax}°C)</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${diffTrig ? tDiff.toFixed(1)+' min' : '—'}</strong><span>Differential</span></div>
          <div class="lab-result-stat" style="--c:#f97316"><strong>${rate} K/min</strong><span>Anstieg</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${diffTrig?'aktiv':'inaktiv'}</strong><span>Rate-of-Rise</span></div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Maximalmelder lösen erst bei fester Temperatur aus (A1 58 °C). Differentialmelder erkennen schnellen Anstieg (&gt;10 K/min) und sind viel früher — ideal wo keine schnellen Temperatursprünge normal sind (nicht in Küche/Heizraum!).</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#heat-cls button').forEach(b => b.onclick = () => {
        thetaMax = +b.dataset.max; clsName = b.dataset.name;
        card.querySelectorAll('#heat-cls button').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MELDER 4: Glasbruchmelder · akustische Abdeckung ============ */
  function calcGlass() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#3b82f6">
        <div class="lab-icon"><i class="fas fa-wine-glass-crack"></i></div>
        <div>
          <h3>Glasbruchmelder · Erfassungsradius</h3>
          <span>Akustische 2-Phasen-Detektion · Flächenabdeckung</span>
        </div>
      </div>
      <div class="lab-formula">
        <em>A</em> = π·<em>r</em>² &nbsp;·&nbsp; Erkennung: Tiefton (Biegen) + Hochton (Splittern ≈ 5 kHz)
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('gls-r',   'Erfassungsradius', 1, 12, 0.5, 7.6, ' m', 1)}
          ${slider('gls-w',   'Raumbreite', 2, 20, 0.5, 8, ' m', 1)}
          ${slider('gls-h',   'Raumtiefe', 2, 20, 0.5, 6, ' m', 1)}
          <div class="lab-cls-toggle" id="gls-typ">
            <button data-r="7.6" data-name="Standard akustisch" class="active">Akustisch</button>
            <button data-r="4" data-name="Körperschall (Klebe)">Körperschall</button>
            <button data-r="9" data-name="Passiv-IR-Glas">Weit</button>
          </div>
        </div>
        <div class="lab-vis" id="gls-vis"></div>
        <div class="lab-result" id="gls-result"></div>
      </div>
    `;
    function update() {
      const r = +card.querySelector('#gls-r').value;
      const w = +card.querySelector('#gls-w').value;
      const h = +card.querySelector('#gls-h').value;
      const A = Math.PI * r * r;
      const roomA = w * h;
      const diag = Math.sqrt(w*w + h*h) / 2;
      const covered = r >= diag;
      const c = covered ? '#22c55e' : '#fbbf24';

      const scale = Math.min(160/Math.max(w,h), 14);
      const rw = w*scale, rh = h*scale;
      const ox = 200 - rw/2, oy = 110 - rh/2;
      const detPx = r*scale;
      card.querySelector('#gls-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          <!-- Raum -->
          <rect x="${ox}" y="${oy}" width="${rw}" height="${rh}" fill="rgba(59,130,246,.05)" stroke="#475569" stroke-width="1.5"/>
          <!-- Erfassungskreis (Melder an Decke Mitte) -->
          <circle cx="200" cy="110" r="${detPx}" fill="rgba(59,130,246,.18)" stroke="#3b82f6" stroke-width="1.5"/>
          <rect x="192" y="102" width="16" height="16" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
          <!-- Glasbruch-Symbol Ecke -->
          <text x="${ox+8}" y="${oy+18}" font-size="14">🪟</text>
          <text x="200" y="${oy-6}" text-anchor="middle" font-size="10" fill="${c}" font-weight="800">r = ${r.toFixed(1)} m · ${covered?'Raum abgedeckt':'Lücken!'}</text>
        </svg>
      `;
      card.querySelector('#gls-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#3b82f6"><strong>${A.toFixed(1)} m²</strong><span>Erfassungsfläche</span></div>
          <div class="lab-result-stat" style="--c:#3b82f6"><strong>${roomA.toFixed(1)} m²</strong><span>Raumfläche</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${covered?'JA':'NEIN'}</strong><span>komplett?</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${Math.ceil(roomA/A)}</strong><span>Melder min.</span></div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Akustische Glasbruchmelder (Radius ~7,6 m) brauchen freie „Sicht" zur Scheibe. Körperschallmelder werden auf die Scheibe geklebt (kleiner Radius, sehr sicher). Dual-Auswertung Tiefton+Hochton verhindert Fehlalarme durch Schlüsselklirren.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#gls-typ button').forEach(b => b.onclick = () => {
        card.querySelector('#gls-r').value = b.dataset.r;
        card.querySelector('#gls-r-v').textContent = (+b.dataset.r).toFixed(1) + ' m';
        card.querySelectorAll('#gls-typ button').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MELDER 5: Dual-Melder · Fehlalarm-Wahrscheinlichkeit ============ */
  function calcDual() {
    const card = el('div', { class:'lab-card' });
    card.innerHTML = `
      <div class="lab-head" style="--c:#a855f7">
        <div class="lab-icon"><i class="fas fa-layer-group"></i></div>
        <div>
          <h3>Dual-Melder · Fehlalarm-Analyse</h3>
          <span>PIR + Mikrowelle · UND-Verknüpfung senkt Fehlalarme</span>
        </div>
      </div>
      <div class="lab-formula">
        UND: <em>P<sub>falsch</sub></em> = <em>p₁</em>·<em>p₂</em> &nbsp;·&nbsp; <em>P<sub>detekt</sub></em> = <em>d₁</em>·<em>d₂</em>
      </div>
      <div class="lab-body">
        <div class="lab-controls">
          ${slider('dual-p1', 'Fehlalarm PIR /Monat', 0, 30, 1, 8, '', 0)}
          ${slider('dual-p2', 'Fehlalarm Mikrowelle /Monat', 0, 30, 1, 6, '', 0)}
          ${slider('dual-corr', 'Gemeinsame Ursache', 0, 50, 1, 5, ' %', 0)}
          <div class="lab-cls-toggle" id="dual-logic">
            <button data-l="and" class="active">UND (Dual)</button>
            <button data-l="or">ODER (parallel)</button>
          </div>
        </div>
        <div class="lab-vis" id="dual-vis"></div>
        <div class="lab-result" id="dual-result"></div>
      </div>
    `;
    let logic = 'and';
    function update() {
      const p1m = +card.querySelector('#dual-p1').value;
      const p2m = +card.querySelector('#dual-p2').value;
      const corr = +card.querySelector('#dual-corr').value / 100;
      // Wahrscheinlichkeit pro "Ereignisfenster" (normiert auf Monat=720h → grobe Rate)
      const p1 = p1m / 720, p2 = p2m / 720;
      let combined;
      if (logic === 'and') {
        // unabhängiger Teil + korrelierter Teil
        combined = (p1 * p2) * (1 - corr) + Math.min(p1, p2) * corr;
      } else {
        combined = p1 + p2 - p1 * p2;
      }
      const perMonth = combined * 720;
      const reduction = p1m > 0 ? (1 - perMonth / p1m) * 100 : 0;
      const c = logic === 'and' ? '#22c55e' : '#ef4444';

      const bar = (val, max, col, y, lbl) => `
        <rect x="120" y="${y}" width="${Math.min(240, val/max*240)}" height="22" rx="3" fill="${col}"/>
        <text x="115" y="${y+15}" text-anchor="end" font-size="9" fill="#94a3b8">${lbl}</text>
        <text x="${125+Math.min(240, val/max*240)}" y="${y+15}" font-size="10" fill="${col}" font-weight="800">${val.toFixed(1)}/Mon</text>`;
      const maxV = Math.max(p1m, p2m, perMonth, 1);
      card.querySelector('#dual-vis').innerHTML = `
        <svg viewBox="0 0 400 200" class="lab-svg">
          <rect width="400" height="200" fill="#0a0f1a"/>
          ${bar(p1m, maxV, '#22d3ee', 30, 'PIR allein')}
          ${bar(p2m, maxV, '#fbbf24', 70, 'MW allein')}
          ${bar(perMonth, maxV, c, 120, logic==='and'?'DUAL (UND)':'DUAL (ODER)')}
          <text x="200" y="180" text-anchor="middle" font-size="11" fill="${c}" font-weight="800">${logic==='and' ? `−${reduction.toFixed(0)}% Fehlalarme vs. PIR allein` : 'mehr Fehlalarme — nur für Detektionssicherheit'}</text>
        </svg>
      `;
      card.querySelector('#dual-result').innerHTML = `
        <div class="lab-result-row">
          <div class="lab-result-stat" style="--c:#22d3ee"><strong>${p1m}/Mon</strong><span>PIR Fehlalarm</span></div>
          <div class="lab-result-stat" style="--c:#fbbf24"><strong>${p2m}/Mon</strong><span>MW Fehlalarm</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${perMonth.toFixed(1)}/Mon</strong><span>Dual ${logic==='and'?'UND':'ODER'}</span></div>
          <div class="lab-result-stat" style="--c:${c}"><strong>${logic==='and'?'−'+reduction.toFixed(0)+'%':'+'+Math.abs(reduction).toFixed(0)+'%'}</strong><span>Änderung</span></div>
        </div>
        <p class="lab-info"><i class="fas fa-circle-info"></i> Dual-Melder (PIR UND Mikrowelle) lösen nur aus, wenn BEIDE Sensoren ansprechen → drastisch weniger Fehlalarme (Sonne, Heizung, Zugluft). Nachteil: minimal geringere Detektionsrate. Korrelierte Störungen (z. B. Erschütterung) begrenzen den Effekt.</p>
      `;
    }
    setTimeout(() => {
      card.querySelectorAll('#dual-logic button').forEach(b => b.onclick = () => {
        logic = b.dataset.l;
        card.querySelectorAll('#dual-logic button').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); update();
      });
    }, 0);
    attachSliders(card, update);
    setTimeout(update, 0);
    return card;
  }

  /* ============ MAIN VIEW ============ */

  /* Kategorie-Definition: jeder Rechner gehört zu einer Gruppe */
  const CATEGORIES = [
    { id:'melder', label:'Melder & Alarm', icon:'fa-bell', color:'#22c55e',
      desc:'Detektions-Physik: Magnetkontakt, Rauch, Wärme, Glasbruch, Bewegung, Dual-Technik.',
      calcs:[ ['Magnetkontakt', calcReed], ['PIR-Bewegung', calcPIR], ['Rauchmelder', calcSmoke], ['Wärmemelder', calcHeat], ['Glasbruch', calcGlass], ['Dual-Melder', calcDual] ] },
    { id:'video', label:'Video & Optik', icon:'fa-video', color:'#06b6d4',
      desc:'CCTV-Speicher, Wärmebild-Reichweite und Beleuchtungsstärke.',
      calcs:[ ['Wärmebild', calcThermal], ['CCTV-Speicher', calcStorage], ['Beleuchtung', calcLux] ] },
    { id:'brand', label:'Brandschutz', icon:'fa-fire', color:'#f97316',
      desc:'Sprinkler-Auslegung und Brandlast-Berechnung.',
      calcs:[ ['Sprinkler', calcSprinkler], ['Brandlast', calcFireLoad] ] },
    { id:'funk', label:'Funk, Schall & EM', icon:'fa-tower-broadcast', color:'#a855f7',
      desc:'Schalldruck, Funkreichweite (Friis), EM-Schirmung, Radar.',
      calcs:[ ['Schalldruck', calcSchall], ['Funkreichweite', calcRadio], ['EM-Schirmung', calcShielding], ['Radar', calcRadar] ] },
    { id:'risk', label:'Wirtschaft & Risiko', icon:'fa-chart-line', color:'#fbbf24',
      desc:'Tresor-Versicherung und Risiko-Index.',
      calcs:[ ['Versicherung', calcInsurance], ['Risiko-Index', calcRisk] ] },
  ];

  function view(d) {
    const root = el('div');
    const totalCalcs = CATEGORIES.reduce((s,c) => s + c.calcs.length, 0);

    const hero = el('div', { class:'lab-hero' });
    hero.innerHTML = `
      <div class="lab-hero-bg"></div>
      <div class="lab-hero-content">
        <div class="lab-hero-tag">ENGINEERING-LAB · LIVE-FORMELN</div>
        <h1>🧮 ${totalCalcs} physikalische Live-Rechner</h1>
        <p>
          Echte Physik-Formeln mit Live-Berechnung — in ${CATEGORIES.length} Kategorien sortiert.
          Schwerpunkt <strong>Melder &amp; Alarm</strong>: Magnetkontakt, Rauch-, Wärme-, Glasbruch- und Dual-Melder.
        </p>
        <div class="lab-hero-actions">
          <button class="lab-print-btn" onclick="window.print()">
            <i class="fas fa-print"></i> Als PDF drucken
          </button>
        </div>
      </div>
    `;
    root.appendChild(hero);

    // ===== Filter-Leiste =====
    const filter = el('div', { class:'lab-filter' });
    filter.innerHTML = `
      <button class="lab-filter-btn active" data-cat="all"><i class="fas fa-border-all"></i> Alle (${totalCalcs})</button>
      ${CATEGORIES.map(c => `
        <button class="lab-filter-btn" data-cat="${c.id}" style="--fc:${c.color}">
          <i class="fas ${c.icon}"></i> ${c.label} (${c.calcs.length})
        </button>
      `).join('')}
    `;
    root.appendChild(filter);

    // ===== Kategorie-Sektionen =====
    const sectionsWrap = el('div', { class:'lab-sections' });
    CATEGORIES.forEach(cat => {
      const section = el('div', { class:'lab-section' });
      section.dataset.cat = cat.id;
      const header = el('div', { class:'lab-section-head' });
      header.style.setProperty('--c', cat.color);
      header.innerHTML = `
        <div class="lab-section-icon"><i class="fas ${cat.icon}"></i></div>
        <div>
          <h2>${cat.label}</h2>
          <p>${cat.desc}</p>
        </div>
        <span class="lab-section-count">${cat.calcs.length} Rechner</span>
      `;
      section.appendChild(header);

      const grid = el('div', { class:'lab-grid' });
      cat.calcs.forEach(([, fn]) => grid.appendChild(fn()));
      section.appendChild(grid);
      sectionsWrap.appendChild(section);
    });
    root.appendChild(sectionsWrap);

    // ===== Filter-Logik =====
    filter.querySelectorAll('.lab-filter-btn').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.cat;
        filter.querySelectorAll('.lab-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sectionsWrap.querySelectorAll('.lab-section').forEach(sec => {
          sec.style.display = (cat === 'all' || sec.dataset.cat === cat) ? '' : 'none';
        });
        window.scrollTo({ top: sectionsWrap.offsetTop - 80, behavior: 'smooth' });
      };
    });

    return root;
  }

  return { view };
})();
