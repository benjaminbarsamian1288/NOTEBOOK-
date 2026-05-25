/* 3D-Einbruch-Spiel – First-Person-Stealth durch Perimeter → Außenhaut →
   Innenraum zum Tresor. Raycaster (ohne Abhängigkeiten). Sensoren füllen die
   Alarm-Anzeige; 100 % = erwischt. window.GAME3D.view(). */
window.GAME3D = (() => {
  const { el } = U;

  const MAP = [
    'FFFFFFFFFFFFFFFFFFFFFF',
    'F....................F',
    'F....................F',
    'F.....1111111111.....F',
    'F.....1........1.....F',
    'F.....1..111...1.....F',
    'F.....1..1S1...1.....F',
    'F.....G..........1...F',
    'F.....1........1.....F',
    'F.....1........1.....F',
    'F.....1........1.....F',
    'F.....1111D11111.....F',
    'F....................F',
    'F....................F',
    'F....................F',
    'FFFFFFFFFFgFFFFFFFFFFFF'.slice(0, 22),
  ];
  const MW = MAP[0].length, MH = MAP.length;
  const get = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? 'F' : MAP[y | 0][x | 0];

  function view() {
    const root = el('div', { class: 'spiel-view' });
    const W = 780, H = 460;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H, style: 'cursor:grab' });
    const ctx = canvas.getContext('2d');
    const zbuf = new Array(W);
    const opened = new Set();
    const keys = {};
    const player = { x: 10.5, y: 14.3, ang: -Math.PI / 2 };
    let alarm = 0, maxAlarm = 0, crack = 0, ended = 0, t0 = performance.now(), events = [];
    const ePrev = { v: false };

    const interacts = [
      { type: 'door', cx: 10.5, cy: 11.5, key: '10,11' },
      { type: 'window', cx: 6.5, cy: 7.5, key: '6,7' },
      { type: 'safe', cx: 10.5, cy: 6.5 },
    ];
    const sensors = [
      { t: 'kamera', x: 3.5, y: 13.5, dir: Math.atan2(8 - 13.5, 10 - 3.5), half: 0.62, range: 9, rate: 13, zone: 'Perimeter', icon: '📹' },
      { t: 'radar', x: 18.5, y: 12.5, range: 7, rate: 9, zone: 'Perimeter', icon: '🛰️' },
      { t: 'beam', x1: 7, y1: 12.6, x2: 14, y2: 12.6, rate: 28, zone: 'Perimeter', icon: '📡' },
      { t: 'pir', x: 10.5, y: 9.3, range: 2.6, rate: 15, zone: 'Innenraum', icon: '📡' },
      { t: 'laser', x1: 13, y1: 4, x2: 13, y2: 11, rate: 34, zone: 'Innenraum', icon: '🔴' },
      { t: 'matte', x: 10.5, y: 7.4, range: 1.0, rate: 38, zone: 'Innenraum', icon: '🦶' },
    ];

    function wall(x, y) { const c = get(x, y); if ((c === 'D' || c === 'G') && opened.has((x | 0) + ',' + (y | 0))) return false; return c === '1' || c === 'F' || c === 'S' || c === 'D' || c === 'G'; }
    function los(ax, ay, bx, by) { const n = Math.ceil(Math.hypot(bx - ax, by - ay) * 6); for (let i = 1; i < n; i++) { const t = i / n; if (wall(ax + (bx - ax) * t, ay + (by - ay) * t)) return false; } return true; }
    function distSeg(px, py, x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy; let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)); }
    const inBuilding = () => player.x > 6 && player.x < 15 && player.y > 3 && player.y < 11;

    function log(m) { events.unshift(m); if (events.length > 4) events.pop(); }
    function tryMove(nx, ny) { if (!wall(nx, player.y)) player.x = nx; if (!wall(player.x, ny)) player.y = ny; }

    function update(dt) {
      if (ended) return;
      const sneak = keys['shift'];
      const spd = (sneak ? 0.028 : 0.052), rot = 0.045;
      const f = (keys['w'] || keys['arrowup'] ? 1 : 0) - (keys['s'] || keys['arrowdown'] ? 1 : 0);
      const strafe = (keys['d'] ? 1 : 0) - (keys['a'] ? 1 : 0);
      if (keys['arrowleft']) player.ang -= rot; if (keys['arrowright']) player.ang += rot;
      if (f) tryMove(player.x + Math.cos(player.ang) * spd * f, player.y + Math.sin(player.ang) * spd * f);
      if (strafe) tryMove(player.x + Math.cos(player.ang + Math.PI / 2) * spd * strafe, player.y + Math.sin(player.ang + Math.PI / 2) * spd * strafe);

      // Sensoren
      let detecting = false;
      sensors.forEach(s => {
        let on = false;
        if (s.t === 'kamera') { const d = Math.hypot(s.x - player.x, s.y - player.y); const da = Math.abs(((Math.atan2(player.y - s.y, player.x - s.x) - s.dir) + Math.PI * 3) % (Math.PI * 2) - Math.PI); on = d < s.range && da < s.half && los(s.x, s.y, player.x, player.y); }
        else if (s.t === 'radar' || s.t === 'pir') { on = Math.hypot(s.x - player.x, s.y - player.y) < s.range && los(s.x, s.y, player.x, player.y); }
        else if (s.t === 'matte') { on = Math.hypot(s.x - player.x, s.y - player.y) < s.range; }
        else if (s.t === 'beam' || s.t === 'laser') { on = distSeg(player.x, player.y, s.x1, s.y1, s.x2, s.y2) < 0.32; }
        s.on = on;
        if (on) { detecting = true; alarm += s.rate * (sneak ? 0.55 : 1) * dt; if (!s.seen) { s.seen = true; log('⚠ ' + s.zone + ': ' + ({ kamera: 'Kamera', radar: 'Radar', beam: 'Lichtschranke', pir: 'PIR', laser: 'Laser', matte: 'Trittmatte' }[s.t]) + ' erfasst!'); } }
      });
      // Tresor knacken
      const near = interacts.find(i => Math.hypot(i.cx - player.x, i.cy - player.y) < (i.type === 'safe' ? 1.4 : 1.3));
      if (near && near.type === 'safe' && keys['e']) { crack += dt / 3.6; alarm += 13 * dt; detecting = true; if (crack >= 1) { ended = 2; } }
      if (!detecting && !ended) alarm -= 6 * dt;
      alarm = Math.max(0, Math.min(100, alarm)); maxAlarm = Math.max(maxAlarm, alarm);
      if (alarm >= 100) ended = 1;
      // E (Flanke) für Tür/Fenster
      if (keys['e'] && !ePrev.v && near) {
        if (near.type === 'door' && !opened.has(near.key)) { opened.add(near.key); alarm += 20; log('🚪 Außenhaut: Türkontakt ausgelöst!'); }
        if (near.type === 'window' && !opened.has(near.key)) { opened.add(near.key); alarm += 24; log('🪟 Außenhaut: Glasbruch ausgelöst!'); }
      }
      ePrev.v = keys['e'];
      hud(near);
    }

    function colorFor(tile, side) {
      let r, g, b;
      if (tile === 'F') { r = 30; g = 70; b = 45; } else if (tile === 'D') { r = 120; g = 72; b = 30; } else if (tile === 'G') { r = 56; g = 130; b = 170; } else if (tile === 'S') { r = 180; g = 140; b = 30; } else { r = 40; g = 60; b = 95; }
      const k = side ? 0.7 : 1; return `rgb(${r * k | 0},${g * k | 0},${b * k | 0})`;
    }
    function render() {
      const grd = ctx.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#0a1626'); grd.addColorStop(0.5, '#0b1424'); ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H / 2);
      ctx.fillStyle = '#0d1828'; ctx.fillRect(0, H / 2, W, H / 2);
      const dirX = Math.cos(player.ang), dirY = Math.sin(player.ang), planeX = -dirY * 0.66, planeY = dirX * 0.66, step = 2;
      for (let x = 0; x < W; x += step) {
        const camX = 2 * x / W - 1, rayX = dirX + planeX * camX, rayY = dirY + planeY * camX;
        let mapX = player.x | 0, mapY = player.y | 0; const dDX = Math.abs(1 / rayX), dDY = Math.abs(1 / rayY);
        let stepX, stepY, sDX, sDY;
        if (rayX < 0) { stepX = -1; sDX = (player.x - mapX) * dDX; } else { stepX = 1; sDX = (mapX + 1 - player.x) * dDX; }
        if (rayY < 0) { stepY = -1; sDY = (player.y - mapY) * dDY; } else { stepY = 1; sDY = (mapY + 1 - player.y) * dDY; }
        let hit = 0, side = 0, g = 0, tile = '1';
        while (!hit && g++ < 80) { if (sDX < sDY) { sDX += dDX; mapX += stepX; side = 0; } else { sDY += dDY; mapY += stepY; side = 1; } if (wall(mapX, mapY)) { hit = 1; tile = get(mapX, mapY); } }
        const perp = side === 0 ? (sDX - dDX) : (sDY - dDY);
        const lh = Math.min(H * 3.5, H / perp); ctx.fillStyle = colorFor(tile, side); ctx.fillRect(x, H / 2 - lh / 2, step, lh);
        for (let z = x; z < x + step; z++) zbuf[z] = perp;
      }
      // Sprites: Sensoren + Tresor
      const sp = sensors.map(s => ({ x: s.t === 'beam' || s.t === 'laser' ? (s.x1 + s.x2) / 2 : s.x, y: s.t === 'beam' || s.t === 'laser' ? (s.y1 + s.y2) / 2 : s.y, on: s.on, icon: s.icon }));
      sp.push({ x: 10.5, y: 6.5, icon: '💰', on: false, safe: 1 });
      sp.map(s => ({ s, d: (player.x - s.x) ** 2 + (player.y - s.y) ** 2 })).sort((a, b) => b.d - a.d).forEach(({ s }) => {
        const relX = s.x - player.x, relY = s.y - player.y, inv = 1 / (planeX * dirY - dirX * planeY);
        const tX = inv * (dirY * relX - dirX * relY), tY = inv * (-planeY * relX + planeX * relY);
        if (tY <= 0.25) return; const scrX = (W / 2) * (1 + tX / tY), sz = Math.min(H, H / tY * 0.55);
        if (scrX > -sz && scrX < W + sz && zbuf[Math.max(0, Math.min(W - 1, scrX | 0))] > tY) {
          ctx.globalAlpha = Math.max(0.3, 1 - tY / 11); ctx.fillStyle = s.on ? '#ef4444' : s.safe ? '#fbbf24' : '#22d3ee';
          ctx.beginPath(); ctx.arc(scrX, H / 2 + sz * 0.1, sz * 0.4, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
          ctx.font = (sz * 0.5) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s.icon, scrX, H / 2 + sz * 0.1); ctx.textBaseline = 'alphabetic';
        }
      });
      // Minimap
      const ms = 8, ox = 10, oy = 10; ctx.fillStyle = 'rgba(2,6,12,0.7)'; ctx.fillRect(ox - 3, oy - 3, MW * ms + 6, MH * ms + 6);
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const c = get(x, y); ctx.fillStyle = c === 'F' ? '#1d3b27' : c === '1' ? '#334155' : (c === 'D' || c === 'G') ? (opened.has(x + ',' + y) ? '#0f1b2e' : '#7c5018') : c === 'S' ? '#fbbf24' : '#0f1b2e'; ctx.fillRect(ox + x * ms, oy + y * ms, ms - 1, ms - 1); }
      sensors.forEach(s => { const sx = s.x1 != null ? (s.x1 + s.x2) / 2 : s.x, sy = s.y1 != null ? (s.y1 + s.y2) / 2 : s.y; ctx.fillStyle = s.on ? '#ef4444' : '#22d3ee'; ctx.fillRect(ox + sx * ms - 1, oy + sy * ms - 1, 3, 3); });
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ox + player.x * ms, oy + player.y * ms, 3, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(ox + player.x * ms, oy + player.y * ms); ctx.lineTo(ox + (player.x + Math.cos(player.ang)) * ms, oy + (player.y + Math.sin(player.ang)) * ms); ctx.stroke();
      // Alarm-Flash
      if (alarm > 60) { ctx.fillStyle = `rgba(239,68,68,${(alarm - 60) / 80 * (0.5 + 0.5 * Math.sin(Date.now() / 120))})`; ctx.fillRect(0, 0, W, H); }
    }

    // HUD
    const phaseEl = el('div', { class: 'g3-phase' }), objEl = el('div', { class: 'g3-obj' }), barFill = el('div', { class: 'g3-bar-fill' });
    const bar = el('div', { class: 'g3-bar' }, [barFill]), alarmTxt = el('div', { class: 'g3-alarm' }), logEl = el('div', { class: 'g3-log' }), hintEl = el('div', { class: 'g3-hint2' });
    const over = el('div', { class: 'g3-over', style: 'display:none' });
    function hud(near) {
      const phase = inBuilding() ? 'INNENRAUM' : 'PERIMETER';
      phaseEl.textContent = '📍 ' + phase;
      objEl.textContent = crack >= 1 ? 'Tresor geknackt!' : (inBuilding() ? 'Finde & knacke den Tresor 💰 (E halten)' : 'Komm rein – Tür (E) oder Fenster (E)');
      barFill.style.width = alarm + '%'; barFill.style.background = alarm > 66 ? '#ef4444' : alarm > 33 ? '#fbbf24' : '#22c55e';
      alarmTxt.textContent = 'ALARM ' + Math.round(alarm) + '%' + (crack > 0 && crack < 1 ? ' · Tresor ' + Math.round(crack * 100) + '%' : '');
      logEl.innerHTML = events.map(e => `<div>${e}</div>`).join('');
      let h = '';
      if (near && near.type === 'door' && !opened.has(near.key)) h = 'E = Tür öffnen';
      else if (near && near.type === 'window' && !opened.has(near.key)) h = 'E = Fenster einschlagen';
      else if (near && near.type === 'safe') h = 'E halten = Tresor knacken';
      hintEl.textContent = h;
    }
    function showOver() {
      const win = ended === 2; const secs = ((performance.now() - t0) / 1000).toFixed(1);
      over.style.display = 'grid';
      over.innerHTML = `<div><div class="g3-over-t" style="color:${win ? '#22c55e' : '#ef4444'}">${win ? '💰 GESCHAFFT!' : '🚨 ERWISCHT!'}</div>
        <div class="g3-over-s">${win ? 'Tresor geknackt in ' + secs + ' s · Spitzen-Alarm ' + Math.round(maxAlarm) + '%' : 'Alarm 100 % – Polizei vor Ort'}</div></div>`;
    }

    function frame() { if (!canvas.isConnected) { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); return; } update(1 / 60); render(); if (ended && over.style.display === 'none') showOver(); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);

    // Steuerung
    function kd(e) { const k = e.key.toLowerCase(); keys[k] = true; if (['w', 'a', 's', 'd', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(k)) e.preventDefault(); }
    function ku(e) { keys[e.key.toLowerCase()] = false; }
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    let drag = null;
    canvas.addEventListener('pointerdown', e => drag = e.clientX);
    window.addEventListener('pointerup', () => drag = null);
    window.addEventListener('pointermove', e => { if (drag != null) { player.ang += (e.clientX - drag) * 0.005; drag = e.clientX; } });

    function padBtn(icon, key, hold) { const b = el('button', { class: 'beg-pad', html: `<i class="fas ${icon}"></i>` }); const on = v => () => keys[key] = v; b.addEventListener('mousedown', on(true)); b.addEventListener('mouseup', on(false)); b.addEventListener('mouseleave', on(false)); b.addEventListener('touchstart', e => { e.preventDefault(); keys[key] = true; }, { passive: false }); b.addEventListener('touchend', e => { e.preventDefault(); keys[key] = false; }, { passive: false }); return b; }
    const pad = el('div', { class: 'g3-controls' }, [
      el('div', { class: 'beg-pad-wrap' }, [el('div', {}, [padBtn('fa-arrow-up', 'w')]), el('div', {}, [padBtn('fa-rotate-left', 'arrowleft'), padBtn('fa-arrow-down', 's'), padBtn('fa-rotate-right', 'arrowright')])]),
      el('div', { class: 'g3-actions' }, [padBtn('fa-hand-pointer', 'e'), el('span', { class: 'plan-lbl', text: 'E = Aktion · Shift = schleichen' })]),
    ]);
    const restart = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Neuer Versuch' });
    restart.addEventListener('click', () => { player.x = 10.5; player.y = 14.3; player.ang = -Math.PI / 2; alarm = 0; maxAlarm = 0; crack = 0; ended = 0; events = []; opened.clear(); sensors.forEach(s => s.seen = false); over.style.display = 'none'; t0 = performance.now(); });

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">3D · Einbruch-Spiel</span>
      <h1>Einbruch-Simulator 🥷 (3D)</h1>
      <p class="lead">Arbeite dich als Einbrecher vom <b>Perimeter</b> über die <b>Außenhaut</b> bis in den <b>Innenraum</b> zum Tresor.
      Radar, Kamera, Lichtschranke, Magnetkontakt, Glasbruch, PIR, Laser und Trittmatte füllen die Alarm-Anzeige – bei 100 % wirst du erwischt.
      WASD/Pfeile, ziehen zum Umsehen, <b>E</b> = Aktion, <b>Shift</b> = schleichen.</p>`;

    const wrap = el('div', { class: 'g3-wrap' }, [
      canvas,
      el('div', { class: 'g3-hud' }, [el('div', { class: 'g3-row' }, [phaseEl, alarmTxt]), bar, objEl, logEl]),
      hintEl, over,
    ]);
    root.append(intro, wrap, pad, restart);
    return root;
  }
  return { view };
})();
