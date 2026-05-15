/* WWD Interactive Modules — Konfigurator, Visualizer, Kalkulator, Audio, Charts */

window.WWD_IX = (() => {
  const { el } = U;

  /* ========================================================================
     TOWER-KONFIGURATOR — Komponenten wählen, Live-SVG zeichnet sich neu
     ======================================================================== */

  function towerConfigurator() {
    const card = el('div', { class:'card wwd-cfg' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', style:'background:rgba(220,38,38,.15); color:#dc2626', html:'<i class="fas fa-sliders"></i>' }),
      el('h3', { text:'Live-Tower-Konfigurator · stelle dir deinen KWS zusammen' })
    ]));

    const state = {
      cams: 4,
      bullet: false,
      led: 100,
      solar: false,
      speaker: true,
      mast: 6,
    };

    const grid = el('div', { class:'wwd-cfg-grid' });
    const controls = el('div', { class:'wwd-cfg-controls' });
    const preview = el('div', { class:'wwd-cfg-preview' });
    const summary = el('div', { class:'wwd-cfg-summary' });
    grid.appendChild(controls);
    grid.appendChild(preview);
    card.appendChild(grid);
    card.appendChild(summary);

    function buildToggleGroup(label, key, options) {
      const wrap = el('div', { class:'wwd-cfg-group' });
      wrap.appendChild(el('label', { class:'wwd-cfg-label', text: label }));
      const grp = el('div', { class:'wwd-cfg-toggle' });
      options.forEach(opt => {
        const btn = el('button', { class:'wwd-cfg-btn', html:opt.html || opt.label });
        if (state[key] === opt.val) btn.classList.add('active');
        btn.onclick = () => {
          state[key] = opt.val;
          grp.querySelectorAll('.wwd-cfg-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          redraw();
        };
        grp.appendChild(btn);
      });
      wrap.appendChild(grp);
      return wrap;
    }

    controls.appendChild(buildToggleGroup('Anzahl Dome-Kameras', 'cams', [
      { val:2, label:'2× Dome' }, { val:4, label:'4× Dome' },
    ]));
    controls.appendChild(buildToggleGroup('Zusätzliche Bullet-Kameras', 'bullet', [
      { val:false, label:'Nein' }, { val:true, label:'+ 2× Bullet' },
    ]));
    controls.appendChild(buildToggleGroup('LED-Strahler', 'led', [
      { val:50, label:'2× 50 W' }, { val:100, label:'2× 100 W' },
    ]));
    controls.appendChild(buildToggleGroup('Stromversorgung', 'solar', [
      { val:false, html:'<i class="fas fa-plug"></i> Netz' },
      { val:true,  html:'<i class="fas fa-sun"></i> Solar/Autark' },
    ]));
    controls.appendChild(buildToggleGroup('Lautsprecher 120 dB', 'speaker', [
      { val:true, label:'Mit' }, { val:false, label:'Ohne' },
    ]));

    // Mast slider
    const mastWrap = el('div', { class:'wwd-cfg-group' });
    mastWrap.innerHTML = `
      <label class="wwd-cfg-label">Masthöhe: <span class="wwd-cfg-val" id="cfg-mast-val">6 m</span></label>
      <input type="range" min="3" max="6" step="0.5" value="6" class="wwd-cfg-range" id="cfg-mast">
    `;
    controls.appendChild(mastWrap);
    setTimeout(() => {
      const slider = mastWrap.querySelector('#cfg-mast');
      const val = mastWrap.querySelector('#cfg-mast-val');
      slider.oninput = () => { state.mast = parseFloat(slider.value); val.textContent = state.mast.toFixed(1).replace(/\.0$/, '') + ' m'; redraw(); };
    }, 0);

    function redraw() {
      // SVG rebuild
      const mastY = 380 - (state.mast * 50);  // Range top of mast
      const camR = 6;
      const cams = state.cams === 4
        ? [{x:80,y:mastY+10},{x:120,y:mastY},{x:160,y:mastY+10},{x:140,y:mastY-8}]
        : [{x:90,y:mastY+8},{x:150,y:mastY+8}];

      const bullets = state.bullet
        ? `<rect x="74" y="${mastY+30}" width="14" height="6" rx="1" fill="#0c0a1a" stroke="#dc2626"/>
           <rect x="160" y="${mastY+30}" width="14" height="6" rx="1" fill="#0c0a1a" stroke="#dc2626"/>`
        : '';

      const ledColor = state.led === 100 ? '#fbbf24' : '#fde68a';
      const ledOpacity = state.led === 100 ? 1 : 0.8;

      const solar = state.solar ? `
        <g transform="translate(50,${mastY+60}) rotate(-15)">
          <rect width="40" height="22" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="10" y1="0" x2="10" y2="22" stroke="#3b82f6" stroke-width=".5"/>
          <line x1="20" y1="0" x2="20" y2="22" stroke="#3b82f6" stroke-width=".5"/>
          <line x1="30" y1="0" x2="30" y2="22" stroke="#3b82f6" stroke-width=".5"/>
        </g>
        <g transform="translate(160,${mastY+60}) rotate(15)">
          <rect width="40" height="22" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="10" y1="0" x2="10" y2="22" stroke="#3b82f6" stroke-width=".5"/>
          <line x1="20" y1="0" x2="20" y2="22" stroke="#3b82f6" stroke-width=".5"/>
          <line x1="30" y1="0" x2="30" y2="22" stroke="#3b82f6" stroke-width=".5"/>
        </g>
        <text x="125" y="${mastY+100}" text-anchor="middle" font-size="9" fill="#3b82f6" font-weight="700">SOLAR · 2×305W</text>
      ` : '';

      const speaker = state.speaker ? `
        <rect x="118" y="${mastY+50}" width="14" height="18" rx="2" fill="#dc2626"/>
        <rect x="120" y="${mastY+53}" width="10" height="12" fill="#7f1d1d"/>
        <text x="140" y="${mastY+62}" font-size="8" fill="#dc2626" font-weight="700">120dB</text>
      ` : '';

      preview.innerHTML = `
        <svg viewBox="0 0 250 420" xmlns="http://www.w3.org/2000/svg" class="wwd-cfg-svg">
          <defs>
            <linearGradient id="cfgSky" x2="0" y2="1">
              <stop offset="0" stop-color="#0c1429"/>
              <stop offset="1" stop-color="#1e293b"/>
            </linearGradient>
            <radialGradient id="ledGlow"><stop offset="0" stop-color="${ledColor}" stop-opacity=".5"/><stop offset="1" stop-color="${ledColor}" stop-opacity="0"/></radialGradient>
          </defs>
          <rect width="250" height="380" fill="url(#cfgSky)"/>
          <rect y="380" width="250" height="40" fill="#0f1a2e"/>

          <!-- Sockel -->
          <rect x="100" y="380" width="50" height="35" fill="#475569"/>
          <text x="125" y="402" text-anchor="middle" font-size="9" fill="#cbd5e1" font-weight="700">KWS</text>

          <!-- Mast -->
          <rect x="120" y="${mastY+5}" width="10" height="${380 - mastY - 5}" fill="#94a3b8"/>

          <!-- Top platform -->
          <rect x="68" y="${mastY-4}" width="114" height="14" rx="2" fill="#1e293b" stroke="#94a3b8"/>

          <!-- Cameras -->
          ${cams.map(c => `
            <circle cx="${c.x}" cy="${c.y}" r="${camR}" fill="#0c0a1a" stroke="#dc2626" stroke-width="1.5"/>
            <circle cx="${c.x}" cy="${c.y}" r="2" fill="#dc2626">
              <animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          `).join('')}

          <!-- LEDs -->
          <ellipse cx="100" cy="${mastY-12}" rx="40" ry="14" fill="url(#ledGlow)"/>
          <ellipse cx="150" cy="${mastY-12}" rx="40" ry="14" fill="url(#ledGlow)"/>
          <rect x="80"  y="${mastY-18}" width="18" height="8" rx="1" fill="#334155"/>
          <rect x="82"  y="${mastY-15}" width="14" height="3" fill="${ledColor}" opacity="${ledOpacity}"/>
          <rect x="152" y="${mastY-18}" width="18" height="8" rx="1" fill="#334155"/>
          <rect x="154" y="${mastY-15}" width="14" height="3" fill="${ledColor}" opacity="${ledOpacity}"/>

          <!-- Bullet cams -->
          ${bullets}

          <!-- Antenne -->
          <line x1="125" y1="${mastY-4}" x2="125" y2="${mastY-22}" stroke="#94a3b8" stroke-width="1.5"/>
          <circle cx="125" cy="${mastY-22}" r="2" fill="#dc2626"><animate attributeName="opacity" values="1;.2;1" dur="1.5s" repeatCount="indefinite"/></circle>

          <!-- Speaker -->
          ${speaker}

          <!-- Solar -->
          ${solar}

          <!-- Mast height label -->
          <line x1="195" y1="${mastY+5}" x2="195" y2="380" stroke="#22d3ee" stroke-width="1" stroke-dasharray="3 2"/>
          <line x1="190" y1="${mastY+5}" x2="200" y2="${mastY+5}" stroke="#22d3ee" stroke-width="1"/>
          <line x1="190" y1="380" x2="200" y2="380" stroke="#22d3ee" stroke-width="1"/>
          <text x="208" y="${(mastY+390)/2}" font-size="10" fill="#22d3ee" font-weight="700">${state.mast} m</text>
        </svg>
      `;

      // Summary
      const totalCams = state.cams + (state.bullet ? 2 : 0);
      const verbrauch = state.cams * 7.5 + (state.bullet ? 10 : 0) + 25 + 10 + (state.speaker ? 2 : 0);
      const ledWatt = state.led * 2;
      const features = [];
      features.push(`<strong>${totalCams}× Kameras</strong> (${state.cams} Dome${state.bullet ? ' + 2 Bullet' : ''})`);
      features.push(`<strong>2× ${state.led} W</strong> LED-Strahler (${(state.led * 100).toLocaleString('de-DE')} Lumen)`);
      features.push(`Mast <strong>${state.mast} m</strong>`);
      if (state.speaker) features.push('<strong>120 dB</strong> Lautsprecher');
      if (state.solar) features.push('<strong>Autark</strong> mit 2×305 W Solar');

      summary.innerHTML = `
        <div class="wwd-cfg-sum-grid">
          <div class="wwd-cfg-sum-stat"><strong>${totalCams}</strong><span>Kameras gesamt</span></div>
          <div class="wwd-cfg-sum-stat"><strong>${verbrauch} W</strong><span>Grundverbrauch</span></div>
          <div class="wwd-cfg-sum-stat"><strong>${ledWatt} W</strong><span>LED bei Alarm</span></div>
          <div class="wwd-cfg-sum-stat"><strong>${state.solar ? 'JA' : 'NEIN'}</strong><span>Autark</span></div>
        </div>
        <div class="wwd-cfg-sum-feat">
          ${features.map(f => `<span class="wwd-aus-pill">${f}</span>`).join('')}
        </div>
        <a href="tel:043197994692" class="wwd-cfg-cta">
          <i class="fas fa-phone"></i> Diese Konfiguration anfragen
        </a>
      `;
    }
    redraw();
    return card;
  }

  /* ========================================================================
     REICHWEITEN-VISUALIZER — Brennweite ändert FoV live
     ======================================================================== */

  function rangeVisualizer() {
    const card = el('div', { class:'card mt-16 wwd-range' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', style:'background:rgba(34,211,238,.15); color:#22d3ee', html:'<i class="fas fa-binoculars"></i>' }),
      el('h3', { text:'Reichweiten-Visualizer · Brennweite & FoV in Echtzeit' })
    ]));

    const state = { focal: 50, sensor: 8 }; // 8 MP = 4K
    const wrap = el('div', { class:'wwd-range-wrap' });
    card.appendChild(wrap);

    // Controls
    const ctrl = el('div', { class:'wwd-range-ctrl' });
    ctrl.innerHTML = `
      <div class="wwd-cfg-group">
        <label class="wwd-cfg-label">Brennweite: <span class="wwd-cfg-val" id="rng-focal-val">50 mm</span></label>
        <input type="range" min="4.8" max="120" step="0.1" value="50" class="wwd-cfg-range" id="rng-focal">
        <div class="wwd-range-presets">
          <button data-f="4.8">Weitwinkel</button>
          <button data-f="25">Standard</button>
          <button data-f="50" class="active">Tele</button>
          <button data-f="120">Max Tele 25×</button>
        </div>
      </div>
      <div class="wwd-cfg-group">
        <label class="wwd-cfg-label">Sensor-Auflösung</label>
        <div class="wwd-cfg-toggle">
          <button class="wwd-cfg-btn" data-r="4">4 MP (2560×1440)</button>
          <button class="wwd-cfg-btn active" data-r="8">8 MP / 4K (3840×2160)</button>
        </div>
      </div>
    `;
    wrap.appendChild(ctrl);

    const out = el('div', { class:'wwd-range-out' });
    wrap.appendChild(out);

    function redraw() {
      // Calculations (vereinfacht, sensor 1/1.8" ~ 7.4 mm Breite)
      const sensorWidth = 7.4;
      const aov = 2 * Math.atan(sensorWidth / (2 * state.focal)) * (180 / Math.PI);
      // Pixel-density: bei 200m, Auflösungsbreite des Sensors / Bildbreite in m
      const breiteAt200 = 2 * 200 * Math.tan(aov * Math.PI / 360);
      const horRes = state.sensor === 8 ? 3840 : 2560;
      const pxPerM = horRes / breiteAt200;
      const beobachtenDist = (horRes / 12) * sensorWidth / (2 * state.focal) * 2; // very approx
      const erkennenDist = beobachtenDist * (12/50);
      const identDist = beobachtenDist * (12/125);

      // FoV cone SVG
      const beamLength = Math.min(720, beobachtenDist * 0.8);
      const beamHalfAngle = aov / 2;
      const beamHalfWidth = beamLength * Math.tan(beamHalfAngle * Math.PI / 180);

      out.innerHTML = `
        <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" class="wwd-range-svg">
          <defs>
            <linearGradient id="rngBg" x2="0" y2="1">
              <stop offset="0" stop-color="#0a0f1a"/>
              <stop offset="1" stop-color="#1e2a44"/>
            </linearGradient>
            <linearGradient id="fovGrad" x2="1" y2="0">
              <stop offset="0" stop-color="rgba(34,211,238,.55)"/>
              <stop offset="1" stop-color="rgba(34,211,238,0)"/>
            </linearGradient>
          </defs>
          <rect width="800" height="320" fill="url(#rngBg)"/>

          <!-- Distance grid (every 100m) -->
          ${[100,200,300,400,500,600,700,800,900].map((d,i)=> {
            const x = 60 + (d/1000) * 720;
            return `<line x1="${x}" y1="280" x2="${x}" y2="290" stroke="#475569" stroke-width="1"/>
                    <text x="${x}" y="305" text-anchor="middle" font-size="9" fill="#64748b">${d}m</text>`;
          }).join('')}
          <line x1="60" y1="285" x2="780" y2="285" stroke="#475569" stroke-width="1.5"/>

          <!-- Tower icon -->
          <g transform="translate(40,140)">
            <rect x="-2" y="0" width="4" height="140" fill="#94a3b8"/>
            <rect x="-12" y="-10" width="24" height="14" fill="#1e293b" stroke="#dc2626" stroke-width="1.5"/>
            <circle cx="0" cy="-3" r="3" fill="#dc2626"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
          </g>

          <!-- FoV beam -->
          <path d="M 50 140 L ${50 + beamLength} ${140 - beamHalfWidth} L ${50 + beamLength} ${140 + beamHalfWidth} Z" fill="url(#fovGrad)" stroke="rgba(34,211,238,.5)" stroke-width="1"/>

          <!-- Distance markers: Beobachten / Erkennen / Identifizieren -->
          ${[
            { d: identDist, label:'IDENTIFIZIEREN', sub:'125 px/m · Gesicht', c:'#22c55e' },
            { d: erkennenDist, label:'ERKENNEN', sub:'50 px/m · jemand bekannt', c:'#fbbf24' },
            { d: beobachtenDist, label:'BEOBACHTEN', sub:'12 px/m · Bewegung sehen', c:'#22d3ee' },
          ].map(m => {
            const x = Math.min(780, 50 + (m.d/1000) * 720);
            return `
              <line x1="${x}" y1="50" x2="${x}" y2="270" stroke="${m.c}" stroke-width="1.5" stroke-dasharray="4 3"/>
              <rect x="${x-55}" y="55" width="110" height="32" rx="4" fill="${m.c}" opacity=".9"/>
              <text x="${x}" y="69" text-anchor="middle" font-size="9" fill="#0b1424" font-weight="800">${m.label}</text>
              <text x="${x}" y="80" text-anchor="middle" font-size="7" fill="#0b1424">${m.d.toFixed(0)} m</text>
            `;
          }).join('')}

          <!-- Person figure at identify distance -->
          ${(() => {
            const x = Math.min(770, 50 + (identDist/1000) * 720);
            return `
              <g transform="translate(${x}, 220)">
                <circle cx="0" cy="-25" r="5" fill="#e8edf7"/>
                <rect x="-4" y="-19" width="8" height="14" fill="#3b82f6"/>
                <line x1="-3" y1="-5" x2="-5" y2="6" stroke="#1e3a8a" stroke-width="2"/>
                <line x1="3" y1="-5" x2="5" y2="6" stroke="#1e3a8a" stroke-width="2"/>
              </g>
            `;
          })()}
        </svg>

        <div class="wwd-range-stats">
          <div class="wwd-range-stat" style="--c:#22d3ee">
            <div class="wwd-range-stat-lbl">Sichtwinkel (AoV)</div>
            <div class="wwd-range-stat-val">${aov.toFixed(1)}°</div>
            <div class="wwd-range-stat-sub">horizontal</div>
          </div>
          <div class="wwd-range-stat" style="--c:#22c55e">
            <div class="wwd-range-stat-lbl">Identifizieren</div>
            <div class="wwd-range-stat-val">${identDist.toFixed(0)} m</div>
            <div class="wwd-range-stat-sub">125 px/m</div>
          </div>
          <div class="wwd-range-stat" style="--c:#fbbf24">
            <div class="wwd-range-stat-lbl">Erkennen</div>
            <div class="wwd-range-stat-val">${erkennenDist.toFixed(0)} m</div>
            <div class="wwd-range-stat-sub">50 px/m</div>
          </div>
          <div class="wwd-range-stat" style="--c:#3b82f6">
            <div class="wwd-range-stat-lbl">Beobachten</div>
            <div class="wwd-range-stat-val">${beobachtenDist.toFixed(0)} m</div>
            <div class="wwd-range-stat-sub">12 px/m</div>
          </div>
          <div class="wwd-range-stat" style="--c:#c084fc">
            <div class="wwd-range-stat-lbl">Bildbreite @ 200 m</div>
            <div class="wwd-range-stat-val">${breiteAt200.toFixed(1)} m</div>
            <div class="wwd-range-stat-sub">${pxPerM.toFixed(0)} px/m</div>
          </div>
        </div>
      `;
    }

    // Wire up controls
    setTimeout(() => {
      const focalSlider = ctrl.querySelector('#rng-focal');
      const focalVal = ctrl.querySelector('#rng-focal-val');
      focalSlider.oninput = () => {
        state.focal = parseFloat(focalSlider.value);
        focalVal.textContent = state.focal.toFixed(1).replace(/\.0$/, '') + ' mm';
        ctrl.querySelectorAll('.wwd-range-presets button').forEach(b => b.classList.remove('active'));
        redraw();
      };
      ctrl.querySelectorAll('.wwd-range-presets button').forEach(btn => {
        btn.onclick = () => {
          state.focal = parseFloat(btn.dataset.f);
          focalSlider.value = state.focal;
          focalVal.textContent = state.focal + ' mm';
          ctrl.querySelectorAll('.wwd-range-presets button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          redraw();
        };
      });
      ctrl.querySelectorAll('[data-r]').forEach(btn => {
        btn.onclick = () => {
          state.sensor = parseInt(btn.dataset.r);
          ctrl.querySelectorAll('[data-r]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          redraw();
        };
      });
    }, 0);

    redraw();
    return card;
  }

  /* ========================================================================
     ENERGIE-KALKULATOR — Verbrauch vs. Solar/Akku
     ======================================================================== */

  function energyCalculator() {
    const card = el('div', { class:'card mt-16 wwd-calc' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', style:'background:rgba(251,191,36,.18); color:#fbbf24', html:'<i class="fas fa-bolt"></i>' }),
      el('h3', { text:'Energie-Kalkulator · Verbrauch, Solar, Autonomie' })
    ]));

    const state = { cams: 4, sunHours: 4, batteryAh: 440, alarmsPerDay: 4 };
    const wrap = el('div', { class:'wwd-calc-grid' });
    const ctrl = el('div', { class:'wwd-calc-ctrl' });
    const out = el('div', { class:'wwd-calc-out' });
    wrap.appendChild(ctrl); wrap.appendChild(out);
    card.appendChild(wrap);

    function slider(id, label, min, max, step, unit, init) {
      const g = el('div', { class:'wwd-cfg-group' });
      g.innerHTML = `
        <label class="wwd-cfg-label">${label}: <span class="wwd-cfg-val" id="${id}-v">${init}${unit}</span></label>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${init}" class="wwd-cfg-range" id="${id}">
      `;
      return g;
    }

    ctrl.appendChild(slider('e-cams', '🎥 Anzahl Kameras', 1, 8, 1, '', state.cams));
    ctrl.appendChild(slider('e-sun', '☀ Sonnenstunden/Tag (Standort)', 1, 8, 0.5, ' h', state.sunHours));
    ctrl.appendChild(slider('e-batt', '🔋 Akkukapazität', 110, 880, 110, ' Ah', state.batteryAh));
    ctrl.appendChild(slider('e-alarm', '⚠ Alarme/Tag (LED + Lautsprecher)', 0, 30, 1, '', state.alarmsPerDay));

    function redraw() {
      // Verbrauch in Watt
      const camsW = state.cams * 7.5;     // 7.5 W/Cam mit IR
      const nvrW = 25;
      const netzwerkW = 10;
      const standbyW = camsW + nvrW + netzwerkW;
      // Alarme: 200W LED + 30W Speaker für je 30s = 230Wh / 30 = 1.92Wh pro Alarm. Pro Tag: 1.92 × alarms / 1000 für kWh
      const alarmWhProTag = state.alarmsPerDay * 230 * (30/3600);
      const dailyConsumption = (standbyW * 24) + alarmWhProTag;  // Wh

      // Solar: 2x 305 W Peak = 610W. Ertrag = sunHours * 610 * 0.85 (Wirkungsgrad) [Wh/Tag]
      const dailySolarYield = state.sunHours * 610 * 0.85;

      // Akku-Kapazität (Wh, 12V)
      const batteryWh = state.batteryAh * 12;
      const usableWh = batteryWh * 0.5;  // 50% DoD

      const balance = dailySolarYield - dailyConsumption;
      const autonomieTage = usableWh / dailyConsumption;
      const balanceOK = balance >= 0;

      out.innerHTML = `
        <div class="wwd-calc-bigstats">
          <div class="wwd-calc-bs" style="--c:#ef4444">
            <i class="fas fa-arrow-down"></i>
            <strong>${(dailyConsumption/1000).toFixed(2)} kWh</strong>
            <span>Verbrauch/Tag</span>
          </div>
          <div class="wwd-calc-bs" style="--c:#fbbf24">
            <i class="fas fa-sun"></i>
            <strong>${(dailySolarYield/1000).toFixed(2)} kWh</strong>
            <span>Solar-Ertrag/Tag</span>
          </div>
          <div class="wwd-calc-bs" style="--c:${balanceOK?'#22c55e':'#ef4444'}">
            <i class="fas fa-${balanceOK?'check':'triangle-exclamation'}"></i>
            <strong>${balance>=0?'+':''}${(balance/1000).toFixed(2)} kWh</strong>
            <span>Tages-Bilanz</span>
          </div>
          <div class="wwd-calc-bs" style="--c:#22d3ee">
            <i class="fas fa-battery-three-quarters"></i>
            <strong>${autonomieTage.toFixed(1)} Tage</strong>
            <span>Autonomie ohne Sonne</span>
          </div>
        </div>

        <!-- Visuelle Balance-Bar -->
        <div class="wwd-calc-bar">
          <div class="wwd-calc-bar-lbl">⚡ Energie-Bilanz pro Tag</div>
          <div class="wwd-calc-bar-graph">
            <div class="wwd-calc-bar-side left">
              <div class="wwd-calc-bar-fill cons" style="width:${Math.min(100, dailyConsumption / Math.max(dailyConsumption,dailySolarYield) * 100)}%">
                <span>${(dailyConsumption/1000).toFixed(2)} kWh Verbrauch</span>
              </div>
            </div>
            <div class="wwd-calc-bar-side right">
              <div class="wwd-calc-bar-fill solar" style="width:${Math.min(100, dailySolarYield / Math.max(dailyConsumption,dailySolarYield) * 100)}%">
                <span>${(dailySolarYield/1000).toFixed(2)} kWh Solar</span>
              </div>
            </div>
          </div>
        </div>

        <div class="wwd-calc-empfehlung ${balanceOK ? 'ok':'warn'}">
          <i class="fas fa-${balanceOK?'circle-check':'triangle-exclamation'}"></i>
          ${balanceOK
            ? `<strong>Autarker Betrieb möglich.</strong> Mit ${autonomieTage.toFixed(1)} Tagen Reserve übersteht das System auch eine Schlechtwetter-Periode.`
            : `<strong>Achtung: Ertrag &lt; Verbrauch.</strong> ${state.cams > 4 ? 'Weniger Kameras pro Turm' : 'Mehr Solar-Panels'} oder größerer Akku nötig — wir kalkulieren individuell.`}
        </div>
      `;
    }

    setTimeout(() => {
      const sliders = [
        { id:'e-cams', key:'cams', unit:'', fix:0 },
        { id:'e-sun', key:'sunHours', unit:' h', fix:1 },
        { id:'e-batt', key:'batteryAh', unit:' Ah', fix:0 },
        { id:'e-alarm', key:'alarmsPerDay', unit:'', fix:0 },
      ];
      sliders.forEach(s => {
        const slider = ctrl.querySelector('#' + s.id);
        const v = ctrl.querySelector('#' + s.id + '-v');
        slider.oninput = () => {
          state[s.key] = parseFloat(slider.value);
          v.textContent = parseFloat(slider.value).toFixed(s.fix).replace(/\.0$/, '') + s.unit;
          redraw();
        };
      });
    }, 0);
    redraw();
    return card;
  }

  /* ========================================================================
     SPEICHER-KALKULATOR — Bitrate × Cams × Tage → TB
     ======================================================================== */

  function storageCalculator() {
    const card = el('div', { class:'card mt-16 wwd-calc' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', style:'background:rgba(192,132,252,.15); color:#c084fc', html:'<i class="fas fa-database"></i>' }),
      el('h3', { text:'Speicher-Kalkulator · NVR-Auslegung & Retention' })
    ]));

    const state = { cams: 4, bitrate: 5, days: 7, mode: 'continuous' };
    const wrap = el('div', { class:'wwd-calc-grid' });
    const ctrl = el('div', { class:'wwd-calc-ctrl' });
    const out = el('div', { class:'wwd-calc-out' });
    wrap.appendChild(ctrl); wrap.appendChild(out);
    card.appendChild(wrap);

    ctrl.innerHTML = `
      <div class="wwd-cfg-group">
        <label class="wwd-cfg-label">🎥 Anzahl Kameras: <span class="wwd-cfg-val" id="s-cams-v">4</span></label>
        <input type="range" min="1" max="16" step="1" value="4" class="wwd-cfg-range" id="s-cams">
      </div>
      <div class="wwd-cfg-group">
        <label class="wwd-cfg-label">📡 Bitrate/Kamera (H.265): <span class="wwd-cfg-val" id="s-rate-v">5 Mbit/s</span></label>
        <input type="range" min="1" max="16" step="0.5" value="5" class="wwd-cfg-range" id="s-rate">
        <div class="wwd-range-presets">
          <button data-r="2">720p Sub</button>
          <button data-r="4">1080p</button>
          <button data-r="6" class="active">4MP</button>
          <button data-r="8">4K UHD</button>
        </div>
      </div>
      <div class="wwd-cfg-group">
        <label class="wwd-cfg-label">📅 Speicher-Retention: <span class="wwd-cfg-val" id="s-days-v">7 Tage</span></label>
        <input type="range" min="1" max="90" step="1" value="7" class="wwd-cfg-range" id="s-days">
        <div class="wwd-range-presets">
          <button data-d="7" class="active">7 Tage</button>
          <button data-d="14">14 Tage</button>
          <button data-d="30">30 Tage</button>
          <button data-d="90">90 Tage</button>
        </div>
      </div>
      <div class="wwd-cfg-group">
        <label class="wwd-cfg-label">⚙ Aufzeichnungs-Modus</label>
        <div class="wwd-cfg-toggle">
          <button class="wwd-cfg-btn active" data-m="continuous">24/7 Vollaufzeichnung</button>
          <button class="wwd-cfg-btn" data-m="event">Nur bei Ereignis (×0.15)</button>
        </div>
      </div>
    `;

    function redraw() {
      const factor = state.mode === 'event' ? 0.15 : 1;
      const mbitPerSecAll = state.cams * state.bitrate * factor;
      const mbPerSec = mbitPerSecAll / 8;
      const gbPerDay = mbPerSec * 86400 / 1024;
      const tbTotal = gbPerDay * state.days / 1024;
      const recommendedDrive = tbTotal <= 2 ? '2 TB' : tbTotal <= 4 ? '4 TB' : tbTotal <= 6 ? '6 TB' : tbTotal <= 8 ? '8 TB' : tbTotal <= 12 ? '12 TB' : tbTotal <= 16 ? '16 TB' : '20 TB';
      const fits2TB = (2048 / gbPerDay).toFixed(1);

      out.innerHTML = `
        <div class="wwd-calc-bigstats">
          <div class="wwd-calc-bs" style="--c:#22d3ee">
            <i class="fas fa-gauge-high"></i>
            <strong>${mbitPerSecAll.toFixed(1)} Mbit/s</strong>
            <span>Gesamt-Bandbreite</span>
          </div>
          <div class="wwd-calc-bs" style="--c:#fbbf24">
            <i class="fas fa-calendar-day"></i>
            <strong>${gbPerDay.toFixed(0)} GB</strong>
            <span>pro Tag</span>
          </div>
          <div class="wwd-calc-bs" style="--c:#c084fc">
            <i class="fas fa-hard-drive"></i>
            <strong>${tbTotal.toFixed(2)} TB</strong>
            <span>für ${state.days} Tage</span>
          </div>
          <div class="wwd-calc-bs" style="--c:#22c55e">
            <i class="fas fa-circle-check"></i>
            <strong>${recommendedDrive}</strong>
            <span>NVR-Empfehlung</span>
          </div>
        </div>

        <div class="wwd-calc-progress">
          <div class="wwd-calc-progress-lbl">2 TB Standard-NVR-Auslastung</div>
          <div class="wwd-calc-progress-bar">
            <div class="wwd-calc-progress-fill" style="width:${Math.min(100, tbTotal/2*100)}%; background:${tbTotal>2?'linear-gradient(90deg,#fbbf24,#ef4444)':'linear-gradient(90deg,#22c55e,#22d3ee)'}">
              ${(tbTotal/2*100).toFixed(0)}%
            </div>
          </div>
          <div class="wwd-calc-progress-sub">Standard-NVR reicht für <strong>${fits2TB} Tage</strong> bei dieser Konfiguration.</div>
        </div>
      `;
    }

    setTimeout(() => {
      const camsS = ctrl.querySelector('#s-cams'), camsV = ctrl.querySelector('#s-cams-v');
      const rateS = ctrl.querySelector('#s-rate'), rateV = ctrl.querySelector('#s-rate-v');
      const daysS = ctrl.querySelector('#s-days'), daysV = ctrl.querySelector('#s-days-v');
      camsS.oninput = () => { state.cams = +camsS.value; camsV.textContent = camsS.value; redraw(); };
      rateS.oninput = () => { state.bitrate = +rateS.value; rateV.textContent = rateS.value + ' Mbit/s'; ctrl.querySelectorAll('[data-r]').forEach(b=>b.classList.remove('active')); redraw(); };
      daysS.oninput = () => { state.days = +daysS.value; daysV.textContent = daysS.value + ' Tage'; ctrl.querySelectorAll('[data-d]').forEach(b=>b.classList.remove('active')); redraw(); };
      ctrl.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { state.bitrate = +b.dataset.r; rateS.value = state.bitrate; rateV.textContent = state.bitrate + ' Mbit/s'; ctrl.querySelectorAll('[data-r]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); redraw(); });
      ctrl.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { state.days = +b.dataset.d; daysS.value = state.days; daysV.textContent = state.days + ' Tage'; ctrl.querySelectorAll('[data-d]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); redraw(); });
      ctrl.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { state.mode = b.dataset.m; ctrl.querySelectorAll('[data-m]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); redraw(); });
    }, 0);
    redraw();
    return card;
  }

  /* ========================================================================
     AUDIO-DEMO — 120 dB Lautsprecher mit Web Audio + Wellenform-Canvas
     ======================================================================== */

  function audioDemo() {
    const card = el('div', { class:'card mt-16 wwd-audio' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', style:'background:rgba(239,68,68,.2); color:#ef4444', html:'<i class="fas fa-volume-high"></i>' }),
      el('h3', { text:'120-dB-Lautsprecher · Sound-Demo (gefährliche Lautstärke nur in der Realität)' })
    ]));

    card.innerHTML += `
      <p class="muted small" style="margin: 6px 0 12px"><i class="fas fa-circle-info"></i>
        Im Browser ist die Lautstärke auf normale Wiedergabe begrenzt — es geht hier um <strong>Frequenz- und Wellenform-Demo</strong>.
        Reale 120 dB würden das Gehör in &lt; 1 Sek schädigen.
      </p>
      <div class="wwd-audio-controls">
        <button class="wwd-audio-btn" data-mode="warn"><i class="fas fa-bullhorn"></i> Warnton (1 kHz Sweep)</button>
        <button class="wwd-audio-btn" data-mode="speech"><i class="fas fa-microphone"></i> Durchsage-Simulation</button>
        <button class="wwd-audio-btn" data-mode="siren"><i class="fas fa-tower-broadcast"></i> Sirene</button>
        <button class="wwd-audio-btn stop" data-mode="stop"><i class="fas fa-stop"></i> Stopp</button>
      </div>
      <canvas class="wwd-audio-canvas" id="wwd-audio-canvas" width="900" height="160"></canvas>
      <div class="wwd-audio-stats">
        <div class="wwd-audio-stat" style="--c:#ef4444">
          <strong>120 dB</strong><span>bei 1 m</span>
        </div>
        <div class="wwd-audio-stat" style="--c:#fbbf24">
          <strong>≈ Düsenjet</strong><span>30 m Abstand</span>
        </div>
        <div class="wwd-audio-stat" style="--c:#22d3ee">
          <strong>Halb-Duplex</strong><span>Hören + Sprechen</span>
        </div>
        <div class="wwd-audio-stat" style="--c:#22c55e">
          <strong>1 kHz</strong><span>max. Stör-Frequenz</span>
        </div>
      </div>
    `;

    setTimeout(() => {
      const canvas = card.querySelector('#wwd-audio-canvas');
      const ctx2d = canvas.getContext('2d');
      let audioCtx, oscillator, gainNode, analyser, animId, running = false;

      function ensureCtx() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          gainNode = audioCtx.createGain();
          gainNode.gain.value = 0.15;
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          gainNode.connect(analyser);
          analyser.connect(audioCtx.destination);
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
      }

      function stopAll() {
        running = false;
        if (oscillator) { try { oscillator.stop(); } catch{} oscillator.disconnect(); oscillator = null; }
        if (animId) cancelAnimationFrame(animId);
        drawIdle();
      }

      function drawIdle() {
        ctx2d.fillStyle = '#0a0f1a';
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);
        ctx2d.strokeStyle = '#1e293b';
        ctx2d.lineWidth = 1;
        ctx2d.beginPath();
        ctx2d.moveTo(0, canvas.height/2);
        ctx2d.lineTo(canvas.width, canvas.height/2);
        ctx2d.stroke();
        ctx2d.fillStyle = '#475569';
        ctx2d.font = '13px system-ui';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('— Drücke einen Button für Audio-Demo —', canvas.width/2, canvas.height/2 - 16);
      }
      drawIdle();

      function draw() {
        if (!running) return;
        const buf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(buf);

        // Gradient bg
        const g = ctx2d.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, '#1e0a0a');
        g.addColorStop(1, '#0a0f1a');
        ctx2d.fillStyle = g;
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx2d.strokeStyle = 'rgba(239,68,68,.15)';
        ctx2d.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          ctx2d.beginPath();
          ctx2d.moveTo(0, (canvas.height/10)*i);
          ctx2d.lineTo(canvas.width, (canvas.height/10)*i);
          ctx2d.stroke();
        }

        // Wave
        ctx2d.strokeStyle = '#ef4444';
        ctx2d.shadowColor = '#ef4444';
        ctx2d.shadowBlur = 8;
        ctx2d.lineWidth = 2.5;
        ctx2d.beginPath();
        const slice = canvas.width / buf.length;
        let x = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = buf[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx2d.moveTo(x, y); else ctx2d.lineTo(x, y);
          x += slice;
        }
        ctx2d.stroke();
        ctx2d.shadowBlur = 0;

        // Frequency bars at bottom
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);
        const barW = canvas.width / 64;
        for (let i = 0; i < 64; i++) {
          const v = freqData[i*4] / 255;
          const h = v * 30;
          ctx2d.fillStyle = `rgba(251,191,36,${v})`;
          ctx2d.fillRect(i * barW + 1, canvas.height - h - 2, barW - 2, h);
        }

        animId = requestAnimationFrame(draw);
      }

      function play(mode) {
        stopAll();
        ensureCtx();
        running = true;
        oscillator = audioCtx.createOscillator();
        oscillator.connect(gainNode);

        if (mode === 'warn') {
          // 1 kHz pulsed
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
          oscillator.frequency.linearRampToValueAtTime(1400, audioCtx.currentTime + 0.5);
          oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 1.0);
          // Gain pulse
          const t = audioCtx.currentTime;
          for (let i = 0; i < 8; i++) {
            gainNode.gain.setValueAtTime(0.18, t + i * 0.25);
            gainNode.gain.setValueAtTime(0.03, t + i * 0.25 + 0.12);
          }
          oscillator.start();
          setTimeout(stopAll, 2200);
        } else if (mode === 'siren') {
          // Sweep up/down
          oscillator.type = 'sawtooth';
          const t = audioCtx.currentTime;
          for (let i = 0; i < 4; i++) {
            oscillator.frequency.setValueAtTime(400, t + i * 0.8);
            oscillator.frequency.linearRampToValueAtTime(1200, t + i * 0.8 + 0.4);
            oscillator.frequency.linearRampToValueAtTime(400, t + i * 0.8 + 0.8);
          }
          oscillator.start();
          setTimeout(stopAll, 3300);
        } else if (mode === 'speech') {
          // Modulated 200-400 Hz like vocal
          oscillator.type = 'sine';
          const t = audioCtx.currentTime;
          const freqs = [220, 280, 240, 200, 320, 240, 180, 280, 240, 200, 250, 200];
          freqs.forEach((f, i) => {
            oscillator.frequency.setValueAtTime(f, t + i * 0.2);
          });
          gainNode.gain.setValueAtTime(0.12, t);
          oscillator.start();
          setTimeout(stopAll, freqs.length * 200 + 100);
        }
        draw();
      }

      card.querySelectorAll('.wwd-audio-btn').forEach(b => {
        b.onclick = () => {
          const mode = b.dataset.mode;
          card.querySelectorAll('.wwd-audio-btn').forEach(x => x.classList.remove('playing'));
          if (mode === 'stop') { stopAll(); return; }
          b.classList.add('playing');
          play(mode);
        };
      });
    }, 0);

    return card;
  }

  /* ========================================================================
     KPI-DASHBOARD — animierte Zähler & Donut (-80%, +ROI)
     ======================================================================== */

  function kpiDashboard() {
    const card = el('div', { class:'card mt-16 wwd-kpi' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', style:'background:rgba(34,197,94,.18); color:#22c55e', html:'<i class="fas fa-chart-line"></i>' }),
      el('h3', { text:'Live-Kennzahlen · Erfolg messbar (Industriepark-Referenz)' })
    ]));

    const grid = el('div', { class:'wwd-kpi-grid' });
    grid.innerHTML = `
      <!-- Donut: -80% Vorfälle -->
      <div class="wwd-kpi-card">
        <h4>Bestätigte Vorfälle · Reduktion</h4>
        <svg viewBox="0 0 200 200" class="wwd-donut">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" stroke-width="20"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#22c55e" stroke-width="20"
            stroke-dasharray="0 502.65" stroke-linecap="round"
            transform="rotate(-90 100 100)" class="wwd-donut-fill"/>
          <text x="100" y="92" text-anchor="middle" font-size="40" font-weight="900" fill="#22c55e" class="wwd-donut-pct">0%</text>
          <text x="100" y="118" text-anchor="middle" font-size="11" fill="#94a3b8">REDUKTION</text>
        </svg>
        <p class="muted small">Vorfälle nach 6 Monaten KWS-Einsatz</p>
      </div>

      <!-- Counter Card -->
      <div class="wwd-kpi-card">
        <div class="wwd-kpi-counter" data-target="180" data-suffix="s"></div>
        <div class="wwd-kpi-lbl">⚡ Reaktionszeit</div>
        <div class="wwd-kpi-sub muted small">≙ &lt; 3 Min bei Alarmverifikation</div>
        <div class="wwd-kpi-bar"><div class="wwd-kpi-barfill" style="width:0%" data-target="92"></div></div>
        <p class="muted small" style="margin: 6px 0 0">92 % aller Alarme &lt; 3 Min bestätigt</p>
      </div>

      <div class="wwd-kpi-card">
        <div class="wwd-kpi-counter" data-target="30" data-suffix=" Sek"></div>
        <div class="wwd-kpi-lbl">🧠 KI-Verifikation</div>
        <div class="wwd-kpi-sub muted small">PERSON/VEHICLE Klassifikation</div>
        <div class="wwd-kpi-bar"><div class="wwd-kpi-barfill" style="width:0%" data-target="97"></div></div>
        <p class="muted small" style="margin: 6px 0 0">Durchschnittliche Konfidenz 97 %</p>
      </div>

      <div class="wwd-kpi-card">
        <div class="wwd-kpi-counter" data-target="200" data-suffix=" m"></div>
        <div class="wwd-kpi-lbl">🎯 Identifizierungs-Reichweite</div>
        <div class="wwd-kpi-sub muted small">Person identifizierbar (8 MP + 25× Zoom)</div>
        <div class="wwd-kpi-bar"><div class="wwd-kpi-barfill" style="width:0%" data-target="80"></div></div>
        <p class="muted small" style="margin: 6px 0 0">125 px/m Auflösungsdichte</p>
      </div>

      <div class="wwd-kpi-card">
        <div class="wwd-kpi-counter" data-target="120" data-suffix=" dB"></div>
        <div class="wwd-kpi-lbl">🔊 Schallpegel Durchsage</div>
        <div class="wwd-kpi-sub muted small">@ 1 m Abstand</div>
        <div class="wwd-kpi-bar"><div class="wwd-kpi-barfill" style="width:0%" data-target="100"></div></div>
        <p class="muted small" style="margin: 6px 0 0">Wirkung auf 50–80 m</p>
      </div>

      <div class="wwd-kpi-card">
        <div class="wwd-kpi-counter" data-target="24" data-suffix="/7"></div>
        <div class="wwd-kpi-lbl">👁 Überwachung</div>
        <div class="wwd-kpi-sub muted small">Operator-besetzte Leitstelle</div>
        <div class="wwd-kpi-bar"><div class="wwd-kpi-barfill" style="width:0%" data-target="100"></div></div>
        <p class="muted small" style="margin: 6px 0 0">Mehrfach-Redundanz, BDSW-zertifiziert</p>
      </div>
    `;
    card.appendChild(grid);

    // Animate on viewport entry
    setTimeout(() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !e.target.dataset.animated) {
            e.target.dataset.animated = '1';
            // Animate donut
            const donutFill = e.target.querySelector('.wwd-donut-fill');
            const donutPct = e.target.querySelector('.wwd-donut-pct');
            if (donutFill) {
              animateNumber(donutPct, 0, 80, 1800, '%');
              animateDash(donutFill, 0, 502.65 * 0.8, 1800);
            }
            // Counters
            e.target.querySelectorAll('.wwd-kpi-counter').forEach(c => {
              const target = +c.dataset.target;
              const suffix = c.dataset.suffix || '';
              animateNumber(c, 0, target, 1500, suffix);
            });
            // Bars
            e.target.querySelectorAll('.wwd-kpi-barfill').forEach(b => {
              const target = +b.dataset.target;
              setTimeout(() => { b.style.width = target + '%'; }, 200);
            });
          }
        });
      }, { threshold: 0.2 });
      grid.querySelectorAll('.wwd-kpi-card').forEach(c => obs.observe(c));
    }, 100);

    return card;
  }

  function animateNumber(el, from, to, dur, suffix) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      el.textContent = (Number.isInteger(to) ? Math.round(v) : v.toFixed(1)) + (suffix || '');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function animateDash(el, from, to, dur) {
    const start = performance.now();
    const max = 502.65;
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      el.setAttribute('stroke-dasharray', `${v} ${max - v}`);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ========================================================================
     EXPORT
     ======================================================================== */
  return {
    towerConfigurator,
    rangeVisualizer,
    energyCalculator,
    storageCalculator,
    audioDemo,
    kpiDashboard,
  };
})();
