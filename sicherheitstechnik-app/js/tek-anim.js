/* Technik-Live-Animationen für alle Komponenten-Bereiche.
   window.TEKANIM.zone(name) → Animationsblock für Perimeter / Aussenhaut /
   Melder / Mechanik / EMA / Video. Jedes Mal ein kleines Canvas-Theater
   passend zum Thema. */
window.TEKANIM = (() => {
  const { el } = U;

  function loop(c, draw) {
    function f(t) { if (!c.isConnected) return; draw(t); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }

  /* Card-Wrapper */
  function card(opts) {
    const c = el('div', { class: 'tek-card', style: `--c:${opts.color}` });
    c.appendChild(el('div', { class: 'tek-card-head' }, [
      el('div', { class: 'tek-card-ico', html: `<i class="fas ${opts.icon}"></i>` }),
      el('div', {}, [
        el('h3', { text: opts.title }),
        el('p', { text: opts.sub }),
      ]),
      el('span', { class: 'tek-live', text: 'LIVE' }),
    ]));
    // opts.body kann sein: Canvas oder { canvas, controls }
    if (opts.body && opts.body.canvas) {
      c.appendChild(opts.body.canvas);
      if (opts.body.controls && opts.body.controls.length) {
        const bar = el('div', { class: 'tek-ctrl' });
        opts.body.controls.forEach(ctrl => bar.appendChild(makeControl(ctrl)));
        c.appendChild(bar);
      }
    } else {
      c.appendChild(opts.body);
    }
    if (opts.legend) c.appendChild(el('div', { class: 'tek-legend', html: opts.legend }));
    return c;
  }

  /* Steuer-Element bauen */
  function makeControl(ctrl) {
    if (ctrl.type === 'slider') {
      const wrap = el('div', { class: 'tek-ctrl-item tek-ctrl-slider' });
      const valSpan = el('span', { class: 'tek-ctrl-val', text: ctrl.value + (ctrl.unit || '') });
      wrap.appendChild(el('label', { text: ctrl.label }));
      const sl = el('input', { type: 'range', min: String(ctrl.min), max: String(ctrl.max), step: String(ctrl.step), value: String(ctrl.value) });
      sl.addEventListener('input', () => { const v = +sl.value; ctrl.onChange(v); valSpan.textContent = v + (ctrl.unit || ''); });
      wrap.appendChild(sl);
      wrap.appendChild(valSpan);
      return wrap;
    }
    if (ctrl.type === 'toggle') {
      const wrap = el('label', { class: 'tek-ctrl-item tek-ctrl-toggle' });
      const cb = el('input', { type: 'checkbox' });
      if (ctrl.value) cb.checked = true;
      cb.addEventListener('change', () => ctrl.onChange(cb.checked));
      const slider = el('span', { class: 'tek-toggle-slider' });
      wrap.appendChild(cb); wrap.appendChild(slider);
      wrap.appendChild(el('span', { class: 'tek-ctrl-lbl', text: ctrl.label }));
      return wrap;
    }
    if (ctrl.type === 'button') {
      const b = el('button', { class: 'tek-ctrl-btn', type: 'button', text: ctrl.label });
      if (ctrl.color) b.style.setProperty('--bc', ctrl.color);
      b.addEventListener('click', () => ctrl.onClick(b));
      return b;
    }
    return el('span');
  }

  /* ============ PERIMETER · Zaun-Sensorik (Faseroptik, Mikrowelle) ============ */
  function perimeterAnim() {
    const W = 600, H = 220;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let intruder = -50, speed = 0.7, mwOn = true, fiberOn = true;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, H - 30, W, 30);
      ctx.fillStyle = '#16302b'; ctx.fillRect(0, H - 35, W, 5);

      // Zaun
      const fy = H - 35, ftop = fy - 100;
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 6; i++) {
        const x = 40 + i * 90; ctx.fillRect(x - 3, ftop, 6, fy - ftop);
      }
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
      for (let y = ftop + 10; y < fy; y += 12) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke(); }
      for (let x = 40; x < W - 40; x += 12) { ctx.beginPath(); ctx.moveTo(x, ftop); ctx.lineTo(x, fy); ctx.stroke(); }
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      for (let x = 40; x < W - 40; x += 24) { ctx.beginPath(); ctx.arc(x + 12, ftop - 5, 8, 0, Math.PI, true); ctx.stroke(); }

      const tT = t / 1000;
      // Glasfaser
      if (fiberOn) {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let x = 40; x < W - 40; x += 4) {
          const close = Math.max(0, 1 - Math.abs(x - intruder) / 60);
          const y = ftop + 50 + Math.sin(tT * 3 + x * 0.04) * 2 + close * Math.sin(tT * 20) * 6;
          x === 40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.shadowBlur = 0;
      }
      // MW-Barrier
      if (mwOn) {
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(30, ftop + 30, 14, 30); ctx.fillRect(W - 44, ftop + 30, 14, 30);
        const beamCut = Math.abs(intruder - W / 2) < 18;
        ctx.strokeStyle = beamCut ? '#ef4444' : 'rgba(34,211,238,.55)';
        ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(44, ftop + 45); ctx.lineTo(W - 44, ftop + 45); ctx.stroke();
        ctx.setLineDash([]);
      }

      intruder += speed; if (intruder > W + 50) intruder = -50;
      ctx.font = '36px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🥷', intruder, fy - 8);

      const touching = (fiberOn && intruder > 70 && intruder < W - 70) ||
                       (mwOn && Math.abs(intruder - W / 2) < 18);
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      if (touching) {
        const a = 0.5 + 0.5 * Math.sin(t / 50);
        ctx.fillStyle = `rgba(239,68,68,${a})`;
        ctx.fillText('🚨 ALARM · Sensor erkennt Eindringling', 16, 30);
      } else {
        ctx.fillStyle = '#22c55e';
        ctx.fillText('● Zaun überwacht · alles ruhig', 16, 30);
      }
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'slider', label: 'Tempo', min: 0.1, max: 3, step: 0.1, value: 0.7, onChange: v => speed = v, unit: '×' },
      { type: 'toggle', label: 'Faseroptik', value: true, onChange: v => fiberOn = v },
      { type: 'toggle', label: 'MW-Schranke', value: true, onChange: v => mwOn = v },
    ]};
  }

  /* ============ AUSSENHAUT · Tür + Fenster mit Magnetkontakt & Glasbruch ============ */
  function aussenhautAnim() {
    const W = 600, H = 220;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let phase = 0;       // 0=ruhe, 1=tür-öffnet, 2=glas-bruch
    let phaseT = 0;
    let timer = setInterval(() => { phase = (phase + 1) % 3; phaseT = 0; }, 4500);
    function setPhase(p) { phase = p; phaseT = 0; clearInterval(timer); timer = setInterval(() => { phase = (phase + 1) % 3; phaseT = 0; }, 4500); }
    function draw(t) {
      phaseT += 1/60;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Boden
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, H - 30, W, 30);

      // ===== TÜR (links) =====
      const tx = 40, ty = 30, tw = 100, th = 160;
      // Rahmen
      ctx.fillStyle = '#7c5018'; ctx.fillRect(tx - 6, ty - 6, tw + 12, th + 6);
      // Türblatt – schwenkt bei phase 1
      const tilt = phase === 1 ? Math.min(0.6, phaseT * 0.4) : 0;
      ctx.save();
      ctx.translate(tx, ty + th);
      ctx.rotate(-tilt);
      ctx.translate(-tx, -(ty + th));
      ctx.fillStyle = '#3a2a18';
      ctx.fillRect(tx, ty, tw, th);
      ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 3; ctx.strokeRect(tx, ty, tw, th);
      // Knauf
      ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(tx + tw - 14, ty + th / 2, 5, 0, 7); ctx.fill();
      // Magnetkontakt (oben auf Tür + Rahmen)
      ctx.fillStyle = phase === 1 ? '#ef4444' : '#22c55e';
      ctx.fillRect(tx + tw - 22, ty + 6, 14, 7);
      ctx.restore();
      // Gegenstück am Rahmen
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(tx + tw - 22, ty - 2, 14, 7);

      // Pfeile / Linien zur Erklärung
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(tx + tw + 4, ty + 6); ctx.lineTo(tx + tw + 50, ty + 6); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Magnetkontakt', tx + tw + 4, ty - 4);

      // ===== FENSTER (rechts) =====
      const fx = W - 200, fy = 40, fw = 160, fh = 130;
      // Rahmen
      ctx.fillStyle = '#475569'; ctx.fillRect(fx - 6, fy - 6, fw + 12, fh + 12);
      // Scheibe
      ctx.fillStyle = phase === 2 && phaseT < 1.5 ? '#0c4a6e' : '#155e75';
      ctx.fillRect(fx, fy, fw, fh);
      // Mittelteilung
      ctx.fillStyle = '#475569'; ctx.fillRect(fx + fw / 2 - 3, fy, 6, fh);
      // Reflexion
      ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(fx + 10, fy + 10); ctx.lineTo(fx + 50, fy + 50); ctx.stroke();
      // Glasbruchmelder-Punkt
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(fx + 12, fy + 12, 4, 0, 7); ctx.fill();
      // Riss bei phase 2
      if (phase === 2) {
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
        const k = Math.min(1, phaseT / 0.6);
        ctx.beginPath();
        ctx.moveTo(fx + 80, fy + 65);
        ctx.lineTo(fx + 80 + 30 * k, fy + 30);
        ctx.moveTo(fx + 80, fy + 65);
        ctx.lineTo(fx + 80 - 25 * k, fy + 35);
        ctx.moveTo(fx + 80, fy + 65);
        ctx.lineTo(fx + 80 + 20 * k, fy + 100);
        ctx.stroke();
        // Schall-Wellen vom Sensor
        for (let r = 12; r < 80; r += 14) {
          const a = 1 - r / 80;
          ctx.strokeStyle = `rgba(251,191,36,${a})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(fx + 12, fy + 12, r + (phaseT * 40) % 14, 0, 7); ctx.stroke();
        }
      }

      // Status
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      if (phase === 1) { ctx.fillStyle = '#ef4444'; ctx.fillText('🚨 TÜR-Magnetkontakt geöffnet', 16, 24); }
      else if (phase === 2) { ctx.fillStyle = '#ef4444'; ctx.fillText('🚨 GLASBRUCH erkannt', 16, 24); }
      else { ctx.fillStyle = '#22c55e'; ctx.fillText('● Außenhaut OK · Tür zu · Fenster intakt', 16, 24); }
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '● Ruhe',       color: '#22c55e', onClick: () => setPhase(0) },
      { type: 'button', label: '🚪 Tür auf',   color: '#fbbf24', onClick: () => setPhase(1) },
      { type: 'button', label: '💥 Glasbruch', color: '#ef4444', onClick: () => setPhase(2) },
    ]};
  }

  /* ============ MELDER · PIR-Kegel, MW-Doppler, Dual-Logik ============ */
  function melderAnim() {
    const W = 600, H = 220;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let person = 30, speed = 0.6, pirOn = true, mwOn = true, mode = 'dual';
    function draw(t) {
      person += speed; if (person > W - 30) person = 30;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, H - 30, W, 30);

      const pirX = 80, pirY = 50;
      if (pirOn) {
        drawMelderBox(ctx, pirX, pirY, '#fbbf24', 'PIR');
        const cone = ctx.createRadialGradient(pirX, pirY, 5, pirX, pirY, 200);
        cone.addColorStop(0, 'rgba(251,191,36,.35)'); cone.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = cone; ctx.beginPath();
        ctx.moveTo(pirX, pirY); ctx.lineTo(pirX + 200, pirY + 130); ctx.lineTo(pirX - 30, pirY + 130); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(251,191,36,.5)'; ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
          ctx.beginPath();
          const a = -0.4 + i * 0.18;
          ctx.moveTo(pirX, pirY); ctx.lineTo(pirX + Math.cos(a) * 200, pirY + Math.sin(a + 1) * 130);
          ctx.stroke();
        }
      }
      const mwX = W - 100, mwY = 50;
      if (mwOn) {
        drawMelderBox(ctx, mwX, mwY, '#22d3ee', 'MW');
        for (let r = 20; r < 180; r += 18) {
          const a = 1 - r / 200;
          ctx.strokeStyle = `rgba(34,211,238,${a * 0.55})`; ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mwX, mwY, r + (t / 80) % 18, Math.PI * 0.3, Math.PI * 0.9); ctx.stroke();
        }
      }

      const py = H - 38;
      ctx.font = '40px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🚶', person, py);

      const inPir = pirOn && Math.abs(person - (pirX + 80)) < 110;
      const inMw  = mwOn  && Math.abs(person - (mwX - 80))  < 110;

      // PIR-LED
      ctx.fillStyle = inPir ? '#ef4444' : '#1e293b';
      if (inPir) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 14; }
      ctx.beginPath(); ctx.arc(pirX, pirY + 18, 4, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      // MW-LED
      ctx.fillStyle = inMw ? '#ef4444' : '#1e293b';
      if (inMw) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 14; }
      ctx.beginPath(); ctx.arc(mwX, mwY + 18, 4, 0, 7); ctx.fill(); ctx.shadowBlur = 0;

      // Logik (UND oder ODER)
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(mode === 'dual' ? 'PIR & MW = DUAL (UND)' : 'PIR ODER MW (mehr Sensibilität)', W / 2, H / 2 - 6);
      const triggered = mode === 'dual' ? (inPir && inMw) : (inPir || inMw);
      ctx.fillStyle = triggered ? '#ef4444' : '#22c55e';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(triggered ? '🚨 ALARM' : '● bereit', W / 2, H / 2 + 14);

      // Untertitel
      ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#fbbf24';
      ctx.fillText('PIR (Wärme · passiv)', 10, 20);
      ctx.textAlign = 'right'; ctx.fillStyle = '#22d3ee';
      ctx.fillText('MW (Doppler · aktiv)', W - 10, 20);
    }
    function drawMelderBox(ctx, x, y, col, lbl) {
      ctx.fillStyle = '#0f172a'; ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.fillRect(x - 22, y - 12, 44, 24); ctx.strokeRect(x - 22, y - 12, 44, 24);
      ctx.fillStyle = col; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(lbl, x, y + 4);
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'slider', label: 'Geh-Tempo', min: 0.1, max: 2.5, step: 0.1, value: 0.6, onChange: v => speed = v, unit: '×' },
      { type: 'toggle', label: 'PIR aktiv', value: true, onChange: v => pirOn = v },
      { type: 'toggle', label: 'MW aktiv',  value: true, onChange: v => mwOn = v },
      { type: 'button', label: 'Logik: DUAL (UND)', color: '#22d3ee', onClick: btn => { mode = mode === 'dual' ? 'or' : 'dual'; btn.textContent = 'Logik: ' + (mode === 'dual' ? 'DUAL (UND)' : 'ODER'); } },
    ]};
  }

  /* ============ MECHANIK · Tresor mit Riegelwerk ============ */
  function mechanikAnim() {
    const W = 600, H = 220;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let dial = 0, riegel = 0, locked = true, dialSpeed = 0.04;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, H - 30, W, 30);

      // Tresor-Körper
      const cx = W / 2 - 30, cy = H / 2, sw = 220, sh = 160;
      const sx = cx - sw / 2, sy = cy - sh / 2;
      ctx.fillStyle = '#334155'; ctx.fillRect(sx - 12, sy - 12, sw + 24, sh + 24);
      ctx.fillStyle = '#475569'; ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.strokeRect(sx + 4, sy + 4, sw - 8, sh - 8);

      // Zahlenrad (links)
      const dx = sx + 50, dy = cy;
      dial += dialSpeed;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(dx, dy, 30, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6 + dial;
        ctx.fillStyle = '#fbbf24'; ctx.fillText(String(i*5), dx + Math.cos(a) * 22 - 4, dy + Math.sin(a) * 22 + 4);
      }
      // Drehzeiger
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(-Math.PI/2) * 24, dy + Math.sin(-Math.PI/2) * 24); ctx.stroke();
      ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(dx, dy, 4, 0, 7); ctx.fill();

      // Riegelwerk
      const target = locked ? 1 : 0;
      riegel += (target - riegel) * 0.08;
      const rx = sx + sw - 20;
      for (let i = 0; i < 4; i++) {
        const ry = sy + 30 + i * 30;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(rx, ry, 14 + riegel * 16, 12);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(rx + 14 + riegel * 16 - 4, ry - 1, 4, 14);
      }
      // Tür-Anzeige
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      if (riegel > 0.7) { ctx.fillStyle = '#22c55e'; ctx.fillText('🔒 verriegelt · 4 Bolzen ausgefahren', 16, 24); }
      else if (riegel > 0.3) { ctx.fillStyle = '#fbbf24'; ctx.fillText('⚙️ Riegelwerk in Bewegung', 16, 24); }
      else { ctx.fillStyle = '#94a3b8'; ctx.fillText('🔓 entriegelt · Tür kann geöffnet werden', 16, 24); }

      ctx.fillStyle = '#22d3ee'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Wertschutzschrank', cx, sy + sh - 12);
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '🔒 Verriegeln',   color: '#22c55e', onClick: () => locked = true },
      { type: 'button', label: '🔓 Entriegeln',   color: '#fbbf24', onClick: () => locked = false },
      { type: 'slider', label: 'Rad-Tempo', min: 0, max: 0.15, step: 0.01, value: 0.04, onChange: v => dialSpeed = v, unit: '' },
    ]};
  }

  /* ============ EMA · Zentrale + Bedienteil + Sirene + NSL ============ */
  function emaAnim() {
    const W = 600, H = 230;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let phase = 0, phaseT = 0, auto = true, period = 2200;
    let timer = setInterval(() => { if (auto) { phase = (phase + 1) % 5; phaseT = 0; } }, period);
    function setPhase(p) { phase = p; phaseT = 0; auto = false; }
    function resumeAuto() { auto = true; }
    function draw(t) {
      phaseT += 1/60;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Komponenten-Positionen
      const sensor = { x: 60, y: 80, lbl: 'Melder' };
      const central = { x: W/2, y: 110, lbl: 'EMA-Zentrale' };
      const sirene = { x: W - 90, y: 70, lbl: 'Sirene' };
      const nsl = { x: W - 60, y: 180, lbl: 'NSL' };

      // Verbindungen + Signal-Pulse
      drawWire(ctx, sensor, central, phase >= 1 ? phaseT * 1.0 : null);
      drawWire(ctx, central, sirene, phase >= 3 ? phaseT * 1.0 : null);
      drawWire(ctx, central, nsl,     phase >= 3 ? phaseT * 1.0 : null);

      // Sensor (PIR)
      drawBoxLabel(ctx, sensor.x, sensor.y, 56, 36, '#fbbf24', 'PIR', phase >= 1);
      // Zentrale
      drawBoxLabel(ctx, central.x, central.y, 110, 70, '#22d3ee', 'EMA-Zentrale', phase >= 2);
      ctx.fillStyle = '#fff'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('VdS C', central.x, central.y + 28);
      // Bedienteil neben Zentrale
      const kp = { x: central.x - 80, y: central.y + 30 };
      drawBoxLabel(ctx, kp.x, kp.y, 48, 28, '#a855f7', 'KP', phase === 4);
      // Sirene
      drawBoxLabel(ctx, sirene.x, sirene.y, 64, 36, '#ef4444', 'Sirene', phase >= 3);
      if (phase === 3) {
        // Schallwellen
        for (let r = 6; r < 60; r += 12) {
          const a = 1 - r / 60;
          ctx.strokeStyle = `rgba(239,68,68,${a})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(sirene.x, sirene.y, r + (phaseT * 40) % 12, 0, 7); ctx.stroke();
        }
      }
      // NSL
      drawBoxLabel(ctx, nsl.x, nsl.y, 56, 36, '#22c55e', 'NSL', phase >= 3);

      // Status-Text oben
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      const labels = [
        ['● Anlage scharf · alle Melder OK', '#22c55e'],
        ['🚨 Melder löst aus → Signal an Zentrale', '#fbbf24'],
        ['⚙️ Zentrale prüft Logik & Zeitfenster', '#22d3ee'],
        ['🔊 Sirene + 📡 NSL-Aufschaltung', '#ef4444'],
        ['🔐 Quittierung am Bedienteil', '#a855f7'],
      ];
      ctx.fillStyle = labels[phase][1]; ctx.fillText(labels[phase][0], 16, 24);
      if (auto) {
        ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'right';
        ctx.fillStyle = '#4ade80'; ctx.fillText('▶ AUTO', W - 12, 24);
      }
    }
    function drawWire(ctx, a, b, pulse) {
      ctx.strokeStyle = pulse != null ? '#22d3ee' : '#1e293b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (pulse != null) {
        const k = Math.min(1, pulse);
        const px = a.x + (b.x - a.x) * k;
        const py = a.y + (b.y - a.y) * k;
        ctx.fillStyle = '#22d3ee'; ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      }
    }
    function drawBoxLabel(ctx, x, y, w, h, col, lbl, on) {
      ctx.fillStyle = '#0f172a'; ctx.strokeStyle = col; ctx.lineWidth = on ? 3 : 2;
      ctx.fillRect(x - w/2, y - h/2, w, h); ctx.strokeRect(x - w/2, y - h/2, w, h);
      if (on) { ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.strokeRect(x - w/2, y - h/2, w, h); ctx.shadowBlur = 0; }
      ctx.fillStyle = col; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(lbl, x, y + 4);
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '● Standby',    color: '#22c55e', onClick: () => setPhase(0) },
      { type: 'button', label: '🚨 Auslösung', color: '#fbbf24', onClick: () => setPhase(1) },
      { type: 'button', label: '⚙ Zentrale',   color: '#22d3ee', onClick: () => setPhase(2) },
      { type: 'button', label: '🔊 Sirene/NSL', color: '#ef4444', onClick: () => setPhase(3) },
      { type: 'button', label: '🔐 Quittierung', color: '#a855f7', onClick: () => setPhase(4) },
      { type: 'button', label: '▶ Auto',       color: '#4ade80', onClick: () => resumeAuto() },
    ]};
  }

  /* ============ VIDEO · Kamera + IR-LED Nacht-Modus + Recorder ============ */
  function videoAnim() {
    const W = 600, H = 220;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let day = true, auto = true;
    let timer = setInterval(() => { if (auto) day = !day; }, 4000);
    let person = 30, speed = 0.5, aiOn = true;
    function draw(t) {
      person += speed; if (person > W - 100) person = 30;
      ctx.clearRect(0, 0, W, H);
      // Hintergrund Tag/Nacht
      const g = ctx.createLinearGradient(0, 0, 0, H);
      if (day) { g.addColorStop(0, '#1e3a5f'); g.addColorStop(1, '#0c1e3a'); }
      else     { g.addColorStop(0, '#070a14'); g.addColorStop(1, '#03060c'); }
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Boden
      ctx.fillStyle = day ? '#475569' : '#1e293b'; ctx.fillRect(0, H - 30, W, 30);

      // Kamera oben links (Wandhalterung)
      const cx = 70, cy = 50;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - 6, cy - 30, 12, 30);
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.moveTo(cx - 22, cy); ctx.lineTo(cx + 50, cy);
      ctx.lineTo(cx + 40, cy + 22); ctx.lineTo(cx - 12, cy + 22); ctx.closePath(); ctx.fill();
      // Linse
      ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cx + 28, cy + 11, 9, 0, 7); ctx.fill();
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5; ctx.stroke();
      // IR-LEDs (rote Ringe)
      const ledCols = ['#ef4444', '#ef4444', '#ef4444', '#ef4444'];
      ledCols.forEach((c, i) => {
        const lx = cx - 8 + i * 12, ly = cy + 6;
        ctx.fillStyle = !day ? c : '#3a1f1f';
        if (!day) { ctx.shadowColor = c; ctx.shadowBlur = 8; }
        ctx.beginPath(); ctx.arc(lx, ly, 2, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      });
      // Beschriftung
      ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8'; ctx.fillText('IP-Kamera 4K · Day/Night', cx + 50, cy + 38);

      // Sichtfeld-Kegel
      const beamCol = day ? 'rgba(255,255,255,.10)' : 'rgba(239,68,68,.16)';
      const beamEdge = day ? 'rgba(255,255,255,.30)' : 'rgba(239,68,68,.5)';
      ctx.fillStyle = beamCol;
      ctx.beginPath(); ctx.moveTo(cx + 28, cy + 18); ctx.lineTo(cx + 300, H - 30); ctx.lineTo(cx - 30, H - 30); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = beamEdge; ctx.lineWidth = 1; ctx.stroke();

      // Person läuft im Bild
      const py = H - 38;
      ctx.font = '40px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText('🚶', person, py);
      // Detektions-Box (KI)
      if (aiOn && person > cx && person < cx + 280) {
        ctx.strokeStyle = day ? '#22c55e' : '#fbbf24'; ctx.lineWidth = 2;
        ctx.strokeRect(person - 22, py - 36, 44, 44);
        ctx.fillStyle = day ? '#22c55e' : '#fbbf24'; ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Person 92%', person - 22, py - 40);
      }

      // Recorder rechts
      const rx = W - 90, ry = H - 80, rw = 70, rh = 50;
      ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2;
      ctx.fillRect(rx, ry, rw, rh); ctx.strokeRect(rx, ry, rw, rh);
      ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('NVR', rx + rw/2, ry + 16);
      // REC-LED blinkt
      ctx.fillStyle = (t / 500) % 2 < 1 ? '#ef4444' : '#3a1f1f';
      ctx.beginPath(); ctx.arc(rx + 12, ry + 30, 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('REC', rx + 22, ry + 33);
      // PoE-Kabel zur Kamera
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy + 20); ctx.lineTo(cx, cy + 60);
      ctx.lineTo(rx, cy + 60); ctx.lineTo(rx, ry); ctx.stroke();
      ctx.fillStyle = '#fbbf24'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('PoE+ (Strom + Daten)', cx + 6, cy + 56);

      // Mode-Label
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'right';
      ctx.fillStyle = day ? '#fbbf24' : '#ef4444';
      ctx.fillText(day ? '☀ TAG · Farb-Modus' : '🌙 NACHT · IR-Cut deaktiviert · S/W', W - 14, 24);
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '☀ Tag',  color: '#fbbf24', onClick: () => { day = true;  auto = false; } },
      { type: 'button', label: '🌙 Nacht', color: '#ef4444', onClick: () => { day = false; auto = false; } },
      { type: 'button', label: '▶ Auto', color: '#22c55e', onClick: () => { auto = true; } },
      { type: 'slider', label: 'Person-Tempo', min: 0.1, max: 2, step: 0.1, value: 0.5, onChange: v => speed = v, unit: '×' },
      { type: 'toggle', label: 'KI-Detektion', value: true, onChange: v => aiOn = v },
    ]};
  }

  /* ============ Öffentliche Wrapper ============ */
  function zone(name) {
    switch (name) {
      case 'perimeter': return card({
        color: '#22c55e', icon: 'fa-border-all', title: 'Perimeter-Live · Zaun-Sensorik',
        sub: 'Faseroptik am Maschendraht + Mikrowellen-Lichtschranke. Eindringling löst aus.',
        body: perimeterAnim(),
        legend: '🥷 Eindringling · 🟡 Faseroptik · ◯◯ Mikrowellen-Schranke (rot = unterbrochen)',
      });
      case 'aussenhaut': return card({
        color: '#fbbf24', icon: 'fa-door-closed', title: 'Außenhaut-Live · Magnetkontakt & Glasbruch',
        sub: 'Tür mit Magnetkontakt, Fenster mit Glasbruchmelder. Wechselt alle 4 s zwischen Ruhe → Tür auf → Glasbruch.',
        body: aussenhautAnim(),
        legend: '🟢 Kontakt geschlossen · 🔴 Kontakt offen · ⭕ Glasbruchmelder',
      });
      case 'melder': return card({
        color: '#22d3ee', icon: 'fa-bell', title: 'Melder-Live · PIR · MW · Dual-Logik',
        sub: 'Person läuft durch. PIR und MW erfassen unabhängig. Dual-Melder gibt erst Alarm wenn BEIDE auslösen.',
        body: melderAnim(),
        legend: '🟡 PIR-Kegel (Wärme passiv) · 🔵 MW-Doppler-Wellen (Bewegung aktiv) · UND-Verknüpfung gegen Fehlalarme',
      });
      case 'mechanik': return card({
        color: '#a855f7', icon: 'fa-vault', title: 'Mechanik-Live · Tresor-Riegelwerk',
        sub: 'Zahlenschloss + 4-Bolzen-Riegelwerk. Verriegelt/entriegelt automatisch im Wechsel.',
        body: mechanikAnim(),
        legend: '🟡 Zahlenrad · ⚙️ Riegelwerk · 4 ausfahrende Stahlbolzen',
      });
      case 'ema': return card({
        color: '#22d3ee', icon: 'fa-tower-broadcast', title: 'EMA-Live · Komplette Alarm-Kette',
        sub: 'Melder → Zentrale → Sirene + NSL → Quittierung am Bedienteil. Pulse zeigen die Signal-Wege.',
        body: emaAnim(),
        legend: '🟡 PIR · 🔵 Zentrale (VdS C) · 🔴 Sirene · 🟢 NSL-Aufschaltung · 🟣 Bedienteil (KP)',
      });
      case 'video': return card({
        color: '#ef4444', icon: 'fa-video', title: 'Video-Live · Tag/Nacht & KI-Detektion',
        sub: '4K-IP-Kamera wechselt zwischen Tag (Farbe) und Nacht (IR-LED + S/W). KI markiert die Person mit Konfidenz.',
        body: videoAnim(),
        legend: '☀ Tag = Farb-Modus · 🌙 Nacht = IR-LEDs an + S/W · KI-Bounding-Box mit Klasse + Score · PoE+ verbindet Kamera ↔ NVR',
      });
    }
    return el('div');
  }

  /* Generischer Wrapper: hängt eine vorhandene Canvas/Control-Karte mit
     einheitlichem Look um Inhalt anderer Module (Zylinder, HVM, …). */
  function wrap(opts) { return card(opts); }

  return { zone, card, makeControl };
})();
