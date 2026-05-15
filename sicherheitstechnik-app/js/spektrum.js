/* Elektromagnetisches Spektrum + Wellenarten – animierte Visualisierung.
   Plus Video-Technik (CCTV / NVR / KI-Videoanalyse) als Melder-Explainer. */

window.SPEK = (() => {
  const { el } = U;

  // Color stops along the EM spectrum (wavelength in m)
  const BANDS = [
    { name:'Gamma',         freq:'> 10²⁰ Hz',  lambda:'< 10⁻¹² m', color:'#a78bfa', use:'Medizin, Strahlentherapie' },
    { name:'Röntgen',       freq:'10¹⁶–10²⁰ Hz', lambda:'10⁻¹⁰–10⁻⁸ m', color:'#7c3aed', use:'Medizin, Materialprüfung' },
    { name:'UV',            freq:'10¹⁵–10¹⁶ Hz', lambda:'10⁻⁸–4·10⁻⁷ m', color:'#6366f1', use:'Flammenmelder, Desinfektion' },
    { name:'Sichtbar',      freq:'4·10¹⁴–8·10¹⁴ Hz', lambda:'400–700 nm', color:'#22c55e', use:'Auge, Foto, Kamera' },
    { name:'Nahes IR',      freq:'10¹⁴ Hz',    lambda:'700–1000 nm', color:'#fbbf24', use:'IR-Lichtschranke (940 nm)' },
    { name:'Thermisches IR',freq:'10¹²–10¹⁴ Hz', lambda:'1–14 µm',   color:'#ef4444', use:'PIR-Bewegungsmelder (8–14 µm)' },
    { name:'Mikrowelle',    freq:'1–300 GHz',  lambda:'1 mm–1 m',   color:'#22d3ee', use:'MW-Bewegungsmelder (10,525 GHz), Radar' },
    { name:'Funk / Radio',  freq:'30 kHz–1 GHz', lambda:'> 1 m',    color:'#38bdf8', use:'EMA-Funk 868 MHz, GSM/LTE' },
    { name:'Ultraschall',   freq:'20 kHz–500 kHz', lambda:'mm–cm',  color:'#a3e635', use:'Ultraschall-Melder (40 kHz)', acoustic: true },
    { name:'Schall (Audio)',freq:'20 Hz–20 kHz', lambda:'cm–m',     color:'#84cc16', use:'Glasbruch akustisch, Mikrofone', acoustic: true },
    { name:'Infraschall',   freq:'< 20 Hz',    lambda:'> 17 m',     color:'#65a30d', use:'Erschütterungs-/Seismik-Sensoren', acoustic: true },
  ];

  // Different waveforms for the wave visualizer
  const WAVE_DEMOS = [
    { id:'pir',     label:'PIR · Wärmestrahlung 8–14 µm', color:'#ef4444', freq:30, type:'sine', detail:'Schwarzkörper-Strahlung von Körpern ~37°C, kontinuierliches IR-Spektrum mit Maximum bei 9,3 µm.' },
    { id:'mw',      label:'Mikrowelle · 10,525 GHz', color:'#22d3ee', freq:60, type:'sine', detail:'Aktiver Doppler-Radar im X-Band. Sehr regelmäßige, hochfrequente Welle.' },
    { id:'ir',      label:'IR-Lichtschranke · 940 nm gepulst', color:'#fbbf24', freq:8, type:'pulse', detail:'Codierte Lichtpulse, vom Auge unsichtbar. Codierung gegen Sabotage.' },
    { id:'us',      label:'Ultraschall · 40 kHz', color:'#a78bfa', freq:80, type:'sine', detail:'Aktiver Doppler im Audio-Bereich oberhalb der menschlichen Hörgrenze.' },
    { id:'audio',   label:'Glasbruch Phase 2 · 100 kHz', color:'#22c55e', freq:90, type:'noise', detail:'Hochfrequentes Splittern beim Glasbruch. Charakteristische Bruchschall-Signatur.' },
    { id:'audiolo', label:'Glasbruch Phase 1 · 100 Hz', color:'#fbbf24', freq:4, type:'sine', detail:'Niederfrequente Biegungs-/Aufprall-Welle.' },
    { id:'seismic', label:'Seismik · 5–500 Hz', color:'#84cc16', freq:6, type:'burst', detail:'Vibrationswellen durch Bohren/Stemmen, gemessen durch Piezo oder Geophone.' },
    { id:'radio',   label:'Funk 868 MHz · EMA', color:'#38bdf8', freq:120, type:'modulated', detail:'EMA-Funk-Standard in Europa, kurze Reichweite, geringe Störungen.' },
  ];

  function view() {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Physik · Wellen & Spektrum' }),
      el('h1', { text:'Elektromagnetisches Spektrum + Wellenarten' }),
      el('p', { text:'Vom Infraschall bis zu Gammastrahlen – welche Welle nutzt welcher Melder? Mit animierten Wellenformen und Frequenz-/Wellenlängen-Angaben.' })
    ]));

    // ============ Spektrum-Visualisierung ============
    const specCard = el('div', { class:'card' });
    specCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-wave-square"></i>' }),
      el('h3', { text:'EM-Spektrum · Klick eine Band für Details' })
    ]));
    const specCv = el('canvas', { width: '900', height: '180', class:'spek-canvas' });
    specCard.appendChild(specCv);
    const specInfo = el('div', { class:'spek-info' });
    specCard.appendChild(specInfo);
    root.appendChild(specCard);

    let activeBand = 5; // Thermisches IR (PIR)
    function drawSpec() {
      const dpr = window.devicePixelRatio || 1;
      const W = specCv.parentElement.clientWidth - 36;
      const H = 180;
      specCv.width = W*dpr; specCv.height = H*dpr;
      specCv.style.width = W + 'px'; specCv.style.height = H + 'px';
      const ctx = specCv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,W,H);
      // Background sky gradient
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0, 'rgba(0,0,0,.3)');
      bg.addColorStop(1, 'rgba(0,0,0,.1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,W,H);
      // Band rectangles
      const bw = W / BANDS.length;
      BANDS.forEach((b, i) => {
        const x = i*bw, y = 26, h = H-50;
        // gradient
        const grd = ctx.createLinearGradient(x, y, x+bw, y);
        grd.addColorStop(0, b.color);
        grd.addColorStop(1, b.color + '55');
        ctx.fillStyle = grd;
        ctx.fillRect(x+2, y, bw-4, h);
        // Active highlight
        if (i === activeBand) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeRect(x+2, y, bw-4, h);
          // Glow underline
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x+2, y+h+4, bw-4, 3);
        }
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + bw/2, y + h/2);
        if (bw < 80) ctx.rotate(-Math.PI/2);
        ctx.fillText(b.name, 0, 4);
        ctx.restore();
        // Freq below
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.font = '9px system-ui';
        if (bw > 60) ctx.fillText(b.freq, x + bw/2, y + h + 22);
        ctx.textAlign = 'start';
      });
      // Title arrow at top
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      ctx.font = '10px system-ui';
      ctx.fillText('← Höhere Frequenz / kürzere Wellenlänge', 8, 16);
      ctx.textAlign = 'end';
      ctx.fillText('Niedrigere Frequenz / längere Wellenlänge →', W-8, 16);
      ctx.textAlign = 'start';
    }
    function updateInfo() {
      const b = BANDS[activeBand];
      specInfo.innerHTML = `
        <div class="spek-info-head" style="--c:${b.color}">
          <strong>${b.name}</strong>
          <span class="spek-pill" style="background:${b.color}; color:#0b1424">${b.freq}</span>
          <span class="spek-pill outline">λ = ${b.lambda}</span>
        </div>
        <p>${b.use}</p>
      `;
    }
    specCv.addEventListener('click', e => {
      const r = specCv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const W = specCv.parentElement.clientWidth - 36;
      const bw = W / BANDS.length;
      activeBand = Math.max(0, Math.min(BANDS.length-1, Math.floor(x / bw)));
      drawSpec();
      updateInfo();
    });
    window.addEventListener('resize', drawSpec);
    requestAnimationFrame(() => { drawSpec(); updateInfo(); });

    // ============ Wellenform-Vergleich ============
    const waveCard = el('div', { class:'card mt-16' });
    waveCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-chart-line"></i>' }),
      el('h3', { text:'Wellenformen im Vergleich · Live-Animation' })
    ]));
    waveCard.appendChild(el('p', { class:'muted small', text:'Jede Sensortechnologie hat ihre charakteristische Wellenform. Klick auf eine Welle für Details.' }));
    const waveGrid = el('div', { class:'spek-wavegrid' });
    waveCard.appendChild(waveGrid);
    WAVE_DEMOS.forEach(w => {
      const c = el('div', { class:'spek-wavecard' });
      c.style.setProperty('--wcolor', w.color);
      c.innerHTML = `
        <div class="spek-wavelbl">${w.label}</div>
        <canvas class="spek-wavecv" width="320" height="80"></canvas>
        <div class="spek-wavefacts">${w.detail}</div>
      `;
      waveGrid.appendChild(c);
      const cv = c.querySelector('canvas');
      animateWave(cv, w);
    });
    root.appendChild(waveCard);

    // ============ VIDEO-TECHNIK ============
    const vidCard = el('div', { class:'card mt-16' });
    vidCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-video"></i>' }),
      el('h3', { text:'Video-Technik · CCTV mit KI-Auswertung' })
    ]));
    if (window.EXPL) {
      // Add a dedicated video explainer if we have the engine
      const slot = el('div');
      vidCard.appendChild(slot);
      // Manually create a video explainer
      const def = videoExplainer();
      // Inject into EXPL.EXPLAINERS so player can find it
      if (!EXPL.EXPLAINERS['video-kamera']) EXPL.EXPLAINERS['video-kamera'] = def;
      EXPL.player('video-kamera', slot);
    }
    root.appendChild(vidCard);

    // ============ Wellen-Typen-Klassifikation ============
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
        'PIR, Mikrowelle, IR-Schranke, Radar, Funk'
      ]),
      makeClassCard('Akustische Wellen (Schall)', '#a3e635', 'fa-volume-high', [
        'Brauchen ein Medium (Luft, Wasser, Festkörper)',
        'c ≈ 343 m/s in Luft, ≈ 5900 m/s in Stahl',
        'Frequenzbereich: 20 Hz–20 kHz (Audio)',
        'Ultraschall, Glasbruch, Mikrofone'
      ]),
      makeClassCard('Mechanische Schwingungen', '#fbbf24', 'fa-waveform', [
        'Vibration im Material (Festkörper)',
        'Frequenz < 20 Hz (Infraschall)',
        'Geophon, Piezo, Seismik',
        'Erschütterungsmelder, Tresorüberwachung'
      ]),
      makeClassCard('Elektrostatische Felder', '#c084fc', 'fa-circle-nodes', [
        'Stationäres E-Feld um geladenes Objekt',
        'Stört durch Annäherung leitfähiger Objekte',
        'Reichweite ≈ 0,5–2 m',
        'Kapazitive Feldmelder (Tresore, Vitrinen)'
      ]),
    ]));
    root.appendChild(cls);

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

  function animateWave(cv, def) {
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      const W = cv.parentElement.clientWidth - 24;
      const H = 80;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return { ctx, W, H };
    }
    let { ctx, W, H } = resize();
    let t0 = performance.now();
    function tick(now) {
      const t = (now - t0) / 1000;
      ({ ctx, W, H } = resize());
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = def.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const px = x/W; // 0..1
        let y;
        if (def.type === 'sine') {
          y = Math.sin(px * def.freq + t * 3) * 0.35;
        } else if (def.type === 'pulse') {
          const phase = (px * def.freq + t * 3) % 1;
          y = phase < 0.2 ? 0.4 : (phase < 0.4 ? -0.4 : 0);
        } else if (def.type === 'noise') {
          y = Math.sin(px * def.freq + t * 3) * 0.2 + (Math.random()-.5) * 0.3;
        } else if (def.type === 'burst') {
          const burst = Math.exp(-Math.pow((px*5 + t*0.5) % 5 - 2.5, 2) * 4);
          y = Math.sin(px * def.freq * 4 + t * 8) * burst * 0.4;
        } else if (def.type === 'modulated') {
          y = Math.sin(px * def.freq + t * 3) * (0.5 + 0.3*Math.sin(px*8 + t*2));
        }
        const sy = H/2 - y * H/2;
        if (x === 0) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
      ctx.stroke();
      // Center axis
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
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
          <!-- Camera body -->
          <g id="vid-cam">
            <rect x="20" y="40" width="80" height="50" rx="6" fill="#162542" stroke="#a3e635" stroke-width="2.5"/>
            <rect x="100" y="55" width="20" height="20" fill="#0b1424"/>
            <circle cx="110" cy="65" r="7" fill="#a3e635">
              <animate attributeName="r" values="6;9;6" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <text x="60" y="105" text-anchor="middle" font-size="10" fill="#a3e635" font-family="system-ui" font-weight="700">Bullet-Kamera</text>
          </g>

          <!-- Field of view -->
          <g id="vid-fov" opacity="0">
            <path d="M120,65 L580,30 L580,120 Z" fill="#a3e635" opacity=".18"/>
            <text x="350" y="50" font-size="11" fill="#a3e635" font-family="system-ui">2.7K · 60°</text>
          </g>

          <!-- Scene with person -->
          <g id="vid-person" opacity="0">
            <g>
              <animateTransform attributeName="transform" type="translate" values="540 80; 200 80; 540 80" dur="10s" repeatCount="indefinite"/>
              <circle cx="0" cy="-14" r="12" fill="#e8edf7"/>
              <rect x="-10" y="-2" width="20" height="36" rx="4" fill="#818cf8"/>
              <rect x="-13" y="-2" width="6" height="20" fill="#818cf8"/>
              <rect x="7" y="-2" width="6" height="20" fill="#818cf8"/>
            </g>
          </g>

          <!-- AI bounding box -->
          <g id="vid-bbox" opacity="0">
            <rect x="280" y="50" width="50" height="80" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="6 3">
              <animate attributeName="stroke-dashoffset" values="0;-18" dur="1s" repeatCount="indefinite"/>
            </rect>
            <rect x="280" y="32" width="80" height="14" fill="#22c55e"/>
            <text x="320" y="42" text-anchor="middle" font-size="9" fill="#0b1424" font-family="system-ui" font-weight="800">PERSON 97%</text>
          </g>

          <!-- NVR -->
          <g id="vid-nvr" opacity="0">
            <rect x="60" y="200" width="120" height="60" rx="6" fill="#162542" stroke="#94a3c4" stroke-width="2"/>
            <rect x="70" y="210" width="100" height="6" fill="#94a3c4"/>
            <rect x="70" y="220" width="100" height="6" fill="#94a3c4"/>
            <text x="120" y="276" text-anchor="middle" font-size="11" fill="#94a3c4" font-family="system-ui" font-weight="600">NVR · 30 Tage Storage</text>
            <line x1="120" y1="200" x2="120" y2="100" stroke="#a3e635" stroke-width="1.5" stroke-dasharray="3 3">
              <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.5s" repeatCount="indefinite"/>
            </line>
          </g>

          <!-- AI analytics box -->
          <g id="vid-ai" opacity="0">
            <rect x="240" y="200" width="180" height="60" rx="6" fill="#162542" stroke="#22c55e" stroke-width="2"/>
            <text x="330" y="218" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700">⚙ KI-Analyse</text>
            <text x="250" y="236" font-size="9" fill="#94a3c4" font-family="system-ui">Person: ✓ erkannt</text>
            <text x="250" y="248" font-size="9" fill="#94a3c4" font-family="system-ui">Fahrzeug: −</text>
            <text x="250" y="260" font-size="9" fill="#94a3c4" font-family="system-ui">Tier: − (gefiltert)</text>
          </g>

          <!-- Alarm + Notification -->
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
        { t: 0,    h: ['vid-cam'],         text:'① Eine moderne IP-Kamera nimmt Bilder auf — typisch 2K/4K, 30 fps, mit Nachtsicht-IR-LEDs.' },
        { t: 3500, h: ['vid-fov'],         text:'② Das Sichtfeld der Kamera (60°-90°) deckt einen bestimmten Bereich ab. Mehrere Kameras kombiniert geben Vollabdeckung.' },
        { t: 7000, h: ['vid-person'],      text:'③ Personen oder Fahrzeuge bewegen sich durch den Bildausschnitt. Jeder Frame wird an die Auswertung geschickt.' },
        { t: 10500,h: ['vid-bbox'],        text:'④ Auf der Kamera oder NVR läuft eine KI (typisch CNN/YOLO). Sie zeichnet Bounding-Boxes mit Klassifikation + Konfidenz.' },
        { t: 14000,h: ['vid-nvr'],         text:'⑤ Der NVR (Network Video Recorder) speichert das Bildmaterial 30/60 Tage gemäß DSGVO und Aufbewahrungsfristen.' },
        { t: 17500,h: ['vid-ai'],          text:'⑥ Die KI filtert: nur RELEVANTE Objekte (Personen/Fahrzeuge) zählen, Tiere oder Lichtwechsel werden ignoriert.' },
        { t: 21000,h: ['vid-alarm'],       text:'⑦ Bei verifiziertem Eindringen → Push-Benachrichtigung an die App + Weiterleitung an NSL/Wachdienst.' },
      ],
      cycle: 25000,
    };
  }

  return { view };
})();
