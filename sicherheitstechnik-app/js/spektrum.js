/* Frequenz-Spektrum + animierte Wellenformen + Video-Technik
   ÜBERKRASS-VERSION mit kontinuierlichen Animationen, interaktivem Slider,
   3D-Wellenpaketen, Farb-Spektrum sichtbarer Wellenlängen. */

window.SPEK = (() => {
  const { el } = U;

  // 11 Bänder von Gamma bis Infraschall
  const BANDS = [
    { name:'Gamma',         freq:'> 10²⁰ Hz',     lambda:'< 10⁻¹² m',    color:'#a78bfa', use:'Medizin · Strahlentherapie · Sterilisation', f:1e21, lam:1e-13 },
    { name:'Röntgen',       freq:'10¹⁶–10²⁰ Hz', lambda:'10⁻¹⁰–10⁻⁸ m', color:'#7c3aed', use:'Medizin · Materialprüfung · Sicherheitsscanner', f:1e18, lam:1e-10 },
    { name:'UV',            freq:'10¹⁵–10¹⁶ Hz', lambda:'10⁻⁸–4·10⁻⁷ m', color:'#6366f1', use:'Flammenmelder · Desinfektion · Schwarzlicht', f:1e16, lam:3e-8 },
    { name:'Sichtbar',      freq:'4·10¹⁴–8·10¹⁴ Hz', lambda:'400–700 nm', color:'#22c55e', use:'Auge · Kameras · Video · LED-Licht', f:5e14, lam:550e-9 },
    { name:'Nahes IR',      freq:'10¹⁴ Hz',     lambda:'700–1000 nm',  color:'#fbbf24', use:'IR-Lichtschranke (940 nm) · Nachtsicht-Kameras', f:3e14, lam:940e-9 },
    { name:'Thermisches IR',freq:'10¹²–10¹⁴ Hz', lambda:'1–14 µm',     color:'#ef4444', use:'PIR-Bewegungsmelder (8–14 µm) · Thermalkamera', f:3e13, lam:10e-6 },
    { name:'Mikrowelle',    freq:'1–300 GHz',    lambda:'1 mm–1 m',    color:'#22d3ee', use:'MW-Melder (10,5 GHz) · Radar · Mobilfunk 5G', f:10e9, lam:3e-2 },
    { name:'Funk / Radio',  freq:'30 kHz–1 GHz', lambda:'> 1 m',       color:'#38bdf8', use:'EMA-Funk 868 MHz · GSM · WLAN · FM-Radio', f:868e6, lam:0.35 },
    { name:'Ultraschall',   freq:'20 kHz–500 kHz', lambda:'mm–cm',     color:'#a3e635', use:'Ultraschall-Melder (40 kHz) · Distanz-Sensoren', f:40e3, lam:8e-3, acoustic: true },
    { name:'Schall (Audio)',freq:'20 Hz–20 kHz', lambda:'17 m–17 mm',  color:'#84cc16', use:'Glasbruch akustisch · Mikrofone · Hören', f:1000, lam:0.34, acoustic: true },
    { name:'Infraschall',   freq:'< 20 Hz',      lambda:'> 17 m',      color:'#65a30d', use:'Erschütterungsmelder · Geophone · Seismik', f:5, lam:68, acoustic: true },
  ];

  // Animation-killer: stop loops when view unmounts
  let activeLoops = [];
  function clearLoops() {
    activeLoops.forEach(l => l.alive = false);
    activeLoops = [];
  }
  function addLoop(loopRef) { activeLoops.push(loopRef); }

  function view() {
    clearLoops();
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Physik · Wellen & Spektrum' }),
      el('h1', { text:'Frequenz-Spektrum · Wellenarten · Video' }),
      el('p', { text:'Vom Infraschall (5 Hz) bis zu Gammastrahlen (10²² Hz) – welche Welle nutzt welcher Melder? Mit live-animierten Wellenformen.' })
    ]));

    // ===================== HERO: Animated EM Spectrum =====================
    const heroCard = el('div', { class:'spek-hero' });
    heroCard.innerHTML = `
      <div class="spek-hero-title">
        <i class="fas fa-wave-square"></i>
        <h2>Elektromagnetisches Spektrum</h2>
      </div>
      <div class="spek-hero-sub">Klick eine Band — Wellenform, Frequenz, Wellenlänge erscheinen unten</div>
    `;
    const specCv = el('canvas', { class:'spek-hero-canvas' });
    heroCard.appendChild(specCv);
    root.appendChild(heroCard);

    let activeBand = 5; // Thermisches IR (PIR)
    const heroLoop = { alive: true };
    addLoop(heroLoop);

    function drawSpec() {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(300, specCv.parentElement.clientWidth - 36);
      const H = 220;
      specCv.width = W*dpr; specCv.height = H*dpr;
      specCv.style.width = W + 'px'; specCv.style.height = H + 'px';
      const ctx = specCv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return { ctx, W, H };
    }

    let heroT0 = performance.now();
    function heroTick(now) {
      if (!heroLoop.alive) return;
      const { ctx, W, H } = drawSpec();
      ctx.clearRect(0, 0, W, H);
      const t = (now - heroT0) / 1000;

      // Background
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0, 'rgba(0,0,0,.5)');
      bg.addColorStop(1, 'rgba(0,0,0,.15)');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,W,H);

      // Band rectangles with glow
      const bw = W / BANDS.length;
      BANDS.forEach((b, i) => {
        const x = i*bw + 2, y = 30, h = H-90;
        const grd = ctx.createLinearGradient(x, y, x+bw-4, y);
        grd.addColorStop(0, b.color);
        grd.addColorStop(1, b.color + '40');
        ctx.fillStyle = grd;
        ctx.fillRect(x, y, bw-4, h);
        // Active highlight w/ pulsing glow
        if (i === activeBand) {
          const pulse = 0.7 + 0.3 * Math.sin(t * 4);
          ctx.shadowBlur = 20 * pulse;
          ctx.shadowColor = b.color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, bw-4, h);
          ctx.shadowBlur = 0;
        }
        // Label rotation
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.min(13, bw*0.18)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + (bw-4)/2, y + h/2);
        if (bw < 90) ctx.rotate(-Math.PI/2);
        ctx.fillText(b.name, 0, 4);
        ctx.restore();
        // Frequency label below
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.font = '9.5px system-ui';
        if (bw > 60) ctx.fillText(b.freq, x + (bw-4)/2, y + h + 18);
        ctx.textAlign = 'start';
      });

      // Animated wave that runs across the entire spectrum
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = BANDS[activeBand].color;
      ctx.beginPath();
      const cyc = 30 + activeBand * 20;
      for (let x = 0; x <= W; x++) {
        const sy = H - 50 + Math.sin((x / W * cyc) - t * 6) * 14;
        if (x === 0) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Title arrows
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.font = '11px system-ui';
      ctx.fillText('← Höhere Frequenz · Kürzere λ', 10, 18);
      ctx.textAlign = 'end';
      ctx.fillText('Niedrigere Frequenz · Längere λ →', W-10, 18);
      ctx.textAlign = 'start';

      requestAnimationFrame(heroTick);
    }
    requestAnimationFrame(heroTick);

    specCv.addEventListener('click', e => {
      const r = specCv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const W = Math.max(300, specCv.parentElement.clientWidth - 36);
      const bw = W / BANDS.length;
      activeBand = Math.max(0, Math.min(BANDS.length-1, Math.floor(x / bw)));
      updateActiveBandInfo();
    });

    // Active band info display
    const bandInfo = el('div', { class:'spek-band-info' });
    root.appendChild(bandInfo);
    function updateActiveBandInfo() {
      const b = BANDS[activeBand];
      bandInfo.innerHTML = `
        <div class="spek-band-card" style="--c:${b.color}">
          <div class="spek-band-color"></div>
          <div class="spek-band-body">
            <h3>${b.name}</h3>
            <div class="spek-band-stats">
              <span class="spek-pill" style="background:${b.color}; color:#0b1424">${b.freq}</span>
              <span class="spek-pill outline">λ = ${b.lambda}</span>
            </div>
            <p>${b.use}</p>
          </div>
        </div>
      `;
    }
    updateActiveBandInfo();

    // ===================== Interactive Wave-Tuner =====================
    const tunerCard = el('div', { class:'card mt-16' });
    tunerCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-tachograph-digital"></i>' }),
      el('h3', { text:'Wellen-Tuner · Frequenz live verändern' })
    ]));
    const tunerInner = el('div', { class:'spek-tuner' });
    tunerCard.appendChild(tunerInner);
    const tunerCv = el('canvas', { class:'spek-tuner-canvas' });
    tunerInner.appendChild(tunerCv);
    const tunerCtrl = el('div', { class:'spek-tuner-ctrl' });
    tunerInner.appendChild(tunerCtrl);

    let tunerFreq = 5;  // 0..10 log scale
    let tunerAmp = 0.6;
    const tunerLoop = { alive: true };
    addLoop(tunerLoop);

    const slider = el('input', { type:'range', min:'0', max:'100', value:'50', class:'fp-slider' });
    slider.addEventListener('input', () => {
      tunerFreq = +slider.value / 10;
      updateTunerLabel();
    });
    const ampSlider = el('input', { type:'range', min:'10', max:'100', value:'60', class:'fp-slider' });
    ampSlider.addEventListener('input', () => {
      tunerAmp = +ampSlider.value / 100;
    });
    const lblFreq = el('div', { class:'spek-tuner-label' });
    const lblWave = el('div', { class:'spek-tuner-label small muted' });

    tunerCtrl.appendChild(el('div', { class:'fp-control' }, [el('label', { text:'Frequenz' }), slider]));
    tunerCtrl.appendChild(lblFreq);
    tunerCtrl.appendChild(lblWave);
    tunerCtrl.appendChild(el('div', { class:'fp-control' }, [el('label', { text:'Amplitude' }), ampSlider]));
    root.appendChild(tunerCard);

    function updateTunerLabel() {
      // Map slider 0..10 → log frequency 1 Hz .. 10²² Hz
      const power = 0 + tunerFreq * 2.2;  // 0..22
      const f = Math.pow(10, power);
      let fStr;
      if (f < 1e3) fStr = f.toFixed(1) + ' Hz';
      else if (f < 1e6) fStr = (f/1e3).toFixed(1) + ' kHz';
      else if (f < 1e9) fStr = (f/1e6).toFixed(1) + ' MHz';
      else if (f < 1e12) fStr = (f/1e9).toFixed(2) + ' GHz';
      else fStr = f.toExponential(2) + ' Hz';
      const c_lambda = 3e8 / f;
      let lStr;
      if (c_lambda > 1e3) lStr = (c_lambda/1e3).toFixed(1) + ' km';
      else if (c_lambda > 1) lStr = c_lambda.toFixed(1) + ' m';
      else if (c_lambda > 1e-3) lStr = (c_lambda*1e3).toFixed(1) + ' mm';
      else if (c_lambda > 1e-6) lStr = (c_lambda*1e6).toFixed(1) + ' µm';
      else if (c_lambda > 1e-9) lStr = (c_lambda*1e9).toFixed(1) + ' nm';
      else lStr = c_lambda.toExponential(2) + ' m';
      // Where in the spectrum?
      const inBand = whichBand(f);
      lblFreq.innerHTML = `<strong style="color:${inBand.color}; font-size:18px">${fStr}</strong>`;
      lblWave.innerHTML = `λ ≈ ${lStr} · ${inBand.name} (${inBand.use.split(' · ')[0]})`;
    }
    function whichBand(f) {
      // Find the closest band by log distance
      let best = BANDS[0], bd = 999;
      BANDS.forEach(b => {
        if (!b.f) return;
        const d = Math.abs(Math.log10(f) - Math.log10(b.f));
        if (d < bd) { bd = d; best = b; }
      });
      return best;
    }
    updateTunerLabel();

    let tunerT0 = performance.now();
    function tunerTick(now) {
      if (!tunerLoop.alive) return;
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(300, tunerCv.parentElement.clientWidth - 36);
      const H = 220;
      tunerCv.width = W*dpr; tunerCv.height = H*dpr;
      tunerCv.style.width = W + 'px'; tunerCv.style.height = H + 'px';
      const ctx = tunerCv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,W,H);
      const t = (now - tunerT0) / 1000;
      const inBand = whichBand(Math.pow(10, tunerFreq * 2.2));
      // Background gradient based on color
      const grd = ctx.createLinearGradient(0,0,0,H);
      grd.addColorStop(0, inBand.color + '15');
      grd.addColorStop(1, '#00000000');
      ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);
      // Wave (sine with current freq)
      const cycles = 2 + tunerFreq * tunerFreq * 4;
      ctx.strokeStyle = inBand.color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = inBand.color;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const sy = H/2 + Math.sin((x/W * cycles * 2 * Math.PI) - t * (4 + tunerFreq * 2)) * (H/2 - 20) * tunerAmp;
        if (x === 0) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Center axis
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
      // Wavelength markers
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      ctx.font = '9px system-ui';
      for (let i = 0; i < cycles; i++) {
        const x = W * (i + 1) / cycles;
        ctx.fillText('λ', x - 4, H - 4);
      }
      requestAnimationFrame(tunerTick);
    }
    requestAnimationFrame(tunerTick);

    // ===================== Wave Types Comparison =====================
    const wavesCard = el('div', { class:'card mt-16' });
    wavesCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-chart-line"></i>' }),
      el('h3', { text:'Wellenformen der Sensortechnik · LIVE' })
    ]));
    wavesCard.appendChild(el('p', { class:'muted small', text:'Jeder Sensor hat seine charakteristische Wellenform – hier alle nebeneinander animiert.' }));

    const WAVE_DEMOS = [
      { label:'PIR · Wärmestrahlung 8–14 µm', color:'#ef4444', freq:25, type:'thermal', detail:'Schwarzkörper-Spektrum · Maximum bei 9,3 µm bei 37 °C Körper.' },
      { label:'Mikrowelle · 10,525 GHz', color:'#22d3ee', freq:60, type:'sine', detail:'X-Band Doppler-Radar. Sehr regelmäßige, hochfrequente Welle.' },
      { label:'Ultraschall · 40 kHz', color:'#a78bfa', freq:80, type:'sine', detail:'Akustische Welle oberhalb der menschlichen Hörgrenze (20 kHz).' },
      { label:'IR-Schranke · 940 nm gepulst', color:'#fbbf24', freq:14, type:'pulse', detail:'Codierte Lichtpulse – Sender-Empfänger-Synchronisation.' },
      { label:'Glasbruch · Phase 1 (~100 Hz)', color:'#fb923c', freq:3, type:'sine', detail:'Tieffrequente Biegung der Scheibe vor dem Bruch.' },
      { label:'Glasbruch · Phase 2 (~100 kHz)', color:'#22c55e', freq:90, type:'noise', detail:'Hochfrequentes Splittern beim Glasbruch.' },
      { label:'Erschütterung · 5–500 Hz', color:'#84cc16', freq:8, type:'burst', detail:'Vibrationswellen durch Bohren oder Hämmern.' },
      { label:'Funk 868 MHz · EMA-Standard', color:'#38bdf8', freq:120, type:'modulated', detail:'Funkstandard für EU-EMA-Anlagen. Modulierte Träger­frequenz.' },
    ];
    const waveGrid = el('div', { class:'spek-wavegrid' });
    wavesCard.appendChild(waveGrid);
    WAVE_DEMOS.forEach(w => {
      const card = el('div', { class:'spek-wavecard' });
      card.style.setProperty('--wcolor', w.color);
      card.innerHTML = `
        <div class="spek-wavelbl">${w.label}</div>
        <canvas class="spek-wavecv"></canvas>
        <div class="spek-wavefacts">${w.detail}</div>
      `;
      waveGrid.appendChild(card);
      const cv = card.querySelector('canvas');
      const loop = { alive: true };
      addLoop(loop);
      animateWave(cv, w, loop);
    });
    root.appendChild(wavesCard);

    // ===================== Wave Classes =====================
    const cls = el('div', { class:'card mt-16' });
    cls.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-sitemap"></i>' }),
      el('h3', { text:'Wellenarten · Klassifikation' })
    ]));
    cls.appendChild(el('div', { class:'spek-classgrid' }, [
      makeClassCard('Elektromagnetische Wellen', '#22d3ee', 'fa-bolt', [
        'Brauchen kein Medium (auch im Vakuum)',
        'c = 3·10⁸ m/s (Lichtgeschwindigkeit)',
        'λ · f = c',
        'PIR, Mikrowelle, IR-Schranke, Radar, Funk, Kameras'
      ]),
      makeClassCard('Akustische Wellen (Schall)', '#a3e635', 'fa-volume-high', [
        'Brauchen ein Medium (Luft, Wasser, Festkörper)',
        'c ≈ 343 m/s in Luft, ≈ 5900 m/s in Stahl',
        'Frequenzbereich: 20 Hz – 20 kHz (Audio)',
        'Ultraschall, Glasbruch, Mikrofone, Körperschall'
      ]),
      makeClassCard('Mechanische Schwingungen', '#fbbf24', 'fa-bolt-lightning', [
        'Vibration im Festkörper (Wand, Tür, Tresor)',
        'Frequenz < 20 Hz (Infraschall)',
        'Geophon, Piezo, Seismik-Sensoren',
        'Erschütterungsmelder, Tresor-Überwachung'
      ]),
      makeClassCard('Elektrostatische Felder', '#c084fc', 'fa-circle-nodes', [
        'Stationäres E-Feld um geladenes Objekt',
        'Stört durch Annäherung leitfähiger Objekte',
        'Reichweite ≈ 0,5–2 m',
        'Kapazitive Feldmelder (Tresore, Vitrinen)'
      ]),
    ]));
    root.appendChild(cls);

    // ===================== Video-Technik =====================
    const vidCard = el('div', { class:'card mt-16' });
    vidCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-video"></i>' }),
      el('h3', { text:'Video-Technik · CCTV mit KI-Auswertung' })
    ]));
    if (window.EXPL) {
      const slot = el('div');
      vidCard.appendChild(slot);
      if (!window.EXPL.EXPLAINERS['video-kamera']) {
        window.EXPL.EXPLAINERS['video-kamera'] = videoExplainer();
      }
      window.EXPL.player('video-kamera', slot);
    }
    root.appendChild(vidCard);

    return root;
  }

  function makeClassCard(title, color, icon, points) {
    const c = el('div', { class:'spek-class', style:`--c:${color}` });
    c.innerHTML = `
      <div class="spek-class-head">
        <div class="spek-class-icon"><i class="fas ${icon}"></i></div>
        <strong>${title}</strong>
      </div>
      <ul>${points.map(p => `<li>${p}</li>`).join('')}</ul>
    `;
    return c;
  }

  function animateWave(cv, def, loop) {
    function size() {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(150, cv.parentElement.clientWidth - 24);
      const H = 90;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return { ctx, W, H };
    }
    const t0 = performance.now();
    function tick(now) {
      if (!loop.alive) return;
      const { ctx, W, H } = size();
      const t = (now - t0) / 1000;
      // Background
      ctx.fillStyle = 'rgba(0,0,0,.4)';
      ctx.fillRect(0,0,W,H);
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
      // Wave with glow
      ctx.strokeStyle = def.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = def.color;
      ctx.beginPath();
      const amp = H/2 - 12;
      for (let x = 0; x <= W; x++) {
        const px = x / W;
        let y = 0;
        if (def.type === 'sine') {
          y = Math.sin(px * def.freq - t * 4) * 0.5;
        } else if (def.type === 'pulse') {
          const phase = (px * def.freq - t * 4) % 1;
          y = phase < 0.15 ? 0.6 : (phase < 0.3 ? -0.6 : 0);
        } else if (def.type === 'noise') {
          y = (Math.sin(px * def.freq + t * 3) + (Math.random()-.5)*0.8) * 0.4;
        } else if (def.type === 'burst') {
          const envCycle = (px * 4 - t * 0.3) % 4;
          const env = Math.exp(-Math.pow(envCycle - 2, 2) * 3);
          y = Math.sin(px * def.freq * 4 + t * 10) * env * 0.6;
        } else if (def.type === 'modulated') {
          y = Math.sin(px * def.freq - t * 5) * (0.4 + 0.3 * Math.sin(px*8 - t*1.5));
        } else if (def.type === 'thermal') {
          // Continuous blackbody curve shape
          y = (Math.sin(px * def.freq - t * 2) * 0.3 + Math.sin(px * def.freq * 1.7 - t * 3) * 0.15 + Math.sin(px * def.freq * 2.3 + t * 1) * 0.12) * 1.4;
        }
        const sy = H/2 - y * amp;
        if (x === 0) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function videoExplainer() {
    return {
      title: 'Video-Technik · CCTV + KI-Analyse',
      intro: 'Kamera nimmt Bild auf · NVR speichert · KI erkennt Objekte und alarmiert',
      svg: `
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="expl-svg">
          <g id="vid-cam">
            <rect x="20" y="40" width="90" height="55" rx="6" fill="#162542" stroke="#a3e635" stroke-width="2.5"/>
            <circle cx="105" cy="67" r="20" fill="#0b1424"/>
            <circle cx="105" cy="67" r="13" fill="url(#camLg)"/>
            <circle cx="105" cy="67" r="6" fill="#000"/>
            <defs>
              <radialGradient id="camLg" cx=".35" cy=".35">
                <stop offset="0" stop-color="#94a3b8"/><stop offset="1" stop-color="#000"/>
              </radialGradient>
            </defs>
            <g fill="#a3e635">
              <circle cx="85" cy="50" r="2"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
              <circle cx="105" cy="42" r="2"><animate attributeName="opacity" values="1;.3;1" dur="2s" begin="0.3s" repeatCount="indefinite"/></circle>
              <circle cx="125" cy="50" r="2"><animate attributeName="opacity" values="1;.3;1" dur="2s" begin="0.6s" repeatCount="indefinite"/></circle>
            </g>
            <text x="65" y="110" text-anchor="middle" font-size="10" fill="#a3e635" font-family="system-ui" font-weight="700">2.7K · IR-Nacht</text>
          </g>
          <g id="vid-fov" opacity="0">
            <path d="M125,67 L580,30 L580,120 Z" fill="#a3e635" opacity=".18"/>
            <text x="350" y="50" font-size="11" fill="#a3e635" font-family="system-ui">2.7K · 60° · 30 fps</text>
          </g>
          <g id="vid-person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="540 80; 200 80; 540 80" dur="10s" repeatCount="indefinite"/>
              <circle cx="0" cy="-14" r="12" fill="#e8edf7"/>
              <rect x="-10" y="-2" width="20" height="36" rx="4" fill="#818cf8"/>
              <rect x="-13" y="-2" width="6" height="20" fill="#818cf8"/>
              <rect x="7" y="-2" width="6" height="20" fill="#818cf8"/>
            </g>
          </g>
          <g id="vid-bbox" opacity="0">
            <rect x="280" y="50" width="50" height="80" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="6 3">
              <animate attributeName="stroke-dashoffset" values="0;-18" dur="1s" repeatCount="indefinite"/>
            </rect>
            <rect x="280" y="32" width="80" height="14" fill="#22c55e"/>
            <text x="320" y="42" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">PERSON 97%</text>
          </g>
          <g id="vid-nvr" opacity="0">
            <rect x="60" y="200" width="120" height="60" rx="6" fill="#162542" stroke="#94a3c4" stroke-width="2"/>
            <rect x="70" y="210" width="100" height="6" fill="#94a3c4"/>
            <rect x="70" y="220" width="100" height="6" fill="#94a3c4"/>
            <text x="120" y="276" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui" font-weight="600">NVR · 30 Tage</text>
            <line x1="120" y1="200" x2="120" y2="100" stroke="#a3e635" stroke-width="1.5" stroke-dasharray="3 3">
              <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.5s" repeatCount="indefinite"/>
            </line>
          </g>
          <g id="vid-ai" opacity="0">
            <rect x="240" y="200" width="180" height="60" rx="6" fill="#162542" stroke="#22c55e" stroke-width="2"/>
            <text x="330" y="218" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700">⚙ KI-Analyse</text>
            <text x="250" y="236" font-size="9" fill="#94a3c4" font-family="system-ui">Person: ✓ erkannt</text>
            <text x="250" y="248" font-size="9" fill="#94a3c4" font-family="system-ui">Fahrzeug: −</text>
            <text x="250" y="260" font-size="9" fill="#94a3c4" font-family="system-ui">Tier: − (gefiltert)</text>
          </g>
          <g id="vid-alarm" opacity="0">
            <rect x="450" y="200" width="120" height="60" rx="6" fill="#ef4444">
              <animate attributeName="opacity" values=".6;1;.6" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="510" y="226" text-anchor="middle" font-size="13" fill="white" font-family="system-ui" font-weight="800">⚠ ALARM</text>
            <text x="510" y="248" text-anchor="middle" font-size="9" fill="white" font-family="system-ui">Push + NSL</text>
          </g>
        </svg>
      `,
      steps: [
        { t: 0,    h: ['vid-cam'],    text:'① IP-Kamera mit IR-Nachtsicht-LEDs nimmt 2.7K-Video mit 30 fps auf.' },
        { t: 3500, h: ['vid-fov'],    text:'② Sichtfeld (60°-90°) deckt einen Bereich ab. Mehrere Kameras geben Vollabdeckung.' },
        { t: 7000, h: ['vid-person'], text:'③ Personen oder Fahrzeuge bewegen sich im Bildausschnitt.' },
        { t: 10500,h: ['vid-bbox'],   text:'④ KI (YOLO/CNN) zeichnet Bounding-Box mit Klassifikation + Konfidenz.' },
        { t: 14000,h: ['vid-nvr'],    text:'⑤ NVR speichert Bildmaterial 30-60 Tage gemäß DSGVO.' },
        { t: 17500,h: ['vid-ai'],     text:'⑥ KI filtert: nur RELEVANTE Objekte zählen, Tiere/Lichtwechsel ignoriert.' },
        { t: 21000,h: ['vid-alarm'],  text:'⑦ Bei Eindringen → Push-Benachrichtigung + NSL-Weiterleitung.' },
      ],
      cycle: 25000,
    };
  }

  return { view };
})();
