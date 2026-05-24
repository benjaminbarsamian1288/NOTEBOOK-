/* 3D-Begehung – First-Person durch das gesicherte Gebäude (Raycaster, ohne
   Abhängigkeiten). Laufen mit WASD/Pfeilen oder Touch-Buttons, ziehen zum
   Umsehen. Sensoren lösen aus, wenn man in Reichweite + Sichtlinie ist.
   Ziel: zum Tresor, ohne erfasst zu werden. window.BEGEHUNG.view(). */
window.BEGEHUNG = (() => {
  const { el } = U;

  const MAP = [
    '111111111111',
    '1..........1',
    '1..1111....1',
    '1.....1....1',
    '1.....1.11.1',
    '1.....1....1',
    '1.11.......1',
    '1..........1',
    '111111111111',
  ];
  const MH = MAP.length, MW = MAP[0].length;
  function wall(x, y) { if (x < 0 || y < 0 || x >= MW || y >= MH) return true; return MAP[Math.floor(y)][Math.floor(x)] === '1'; }

  const SENSORS = [
    { x: 3.5, y: 6.5, type: 'pir', range: 2.4, color: '#22d3ee', icon: '📡', label: 'PIR Flur' },
    { x: 8.5, y: 2.5, type: 'kamera', range: 3.2, color: '#7dd3fc', icon: '📹', label: 'Kamera Lager' },
    { x: 9.0, y: 6.0, type: 'radar', range: 2.8, color: '#22c55e', icon: '🛰️', label: 'Radar Halle' },
  ];
  const TRESOR = { x: 9.5, y: 7.4 };

  function los(ax, ay, bx, by) {
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay) * 8);
    for (let i = 1; i < steps; i++) { const t = i / steps; if (wall(ax + (bx - ax) * t, ay + (by - ay) * t)) return false; }
    return true;
  }

  function view() {
    const root = el('div', { class: 'spiel-view' });
    const W = 760, H = 440;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H, style: 'cursor:grab' });
    const ctx = canvas.getContext('2d');
    const player = { x: 2.5, y: 7.5, ang: 0 };
    const keys = {};
    const triggered = new Set();
    let won = false;
    const zbuf = new Array(W);

    const status = el('div', { class: 'sens-status', text: 'Bring dich zum Tresor 💰' });
    const detected = el('div', { class: 'sens-status', text: '' });

    // Steuerung: Tastatur
    window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) e.preventDefault(); });
    window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
    // Ziehen zum Umsehen
    let drag = null;
    canvas.addEventListener('mousedown', e => drag = e.clientX);
    window.addEventListener('mouseup', () => drag = null);
    window.addEventListener('mousemove', e => { if (drag != null) { player.ang += (e.clientX - drag) * 0.005; drag = e.clientX; } });
    canvas.addEventListener('touchstart', e => drag = e.touches[0].clientX, { passive: true });
    canvas.addEventListener('touchmove', e => { if (drag != null) { player.ang += (e.touches[0].clientX - drag) * 0.006; drag = e.touches[0].clientX; } }, { passive: true });
    window.addEventListener('touchend', () => drag = null);

    function tryMove(nx, ny) { if (!wall(nx, player.y)) player.x = nx; if (!wall(player.x, ny)) player.y = ny; }

    function update() {
      const spd = 0.055, rot = 0.045;
      const f = (keys['w'] || keys['arrowup'] ? 1 : 0) - (keys['s'] || keys['arrowdown'] ? 1 : 0);
      if (keys['arrowleft']) player.ang -= rot;
      if (keys['arrowright']) player.ang += rot;
      const strafe = (keys['d'] ? 1 : 0) - (keys['a'] ? 1 : 0);
      if (f) tryMove(player.x + Math.cos(player.ang) * spd * f, player.y + Math.sin(player.ang) * spd * f);
      if (strafe) tryMove(player.x + Math.cos(player.ang + Math.PI / 2) * spd * strafe, player.y + Math.sin(player.ang + Math.PI / 2) * spd * strafe);
      // Sensoren
      let activeNow = [];
      SENSORS.forEach(s => { const d = Math.hypot(s.x - player.x, s.y - player.y); if (d < s.range && los(player.x, player.y, s.x, s.y)) { activeNow.push(s); triggered.add(s.label); } s._on = d < s.range && los(player.x, player.y, s.x, s.y); });
      if (Math.hypot(TRESOR.x - player.x, TRESOR.y - player.y) < 0.7) won = true;
      if (won) { status.textContent = '🏁 Tresor erreicht!'; status.className = 'sens-status ok'; }
      else if (activeNow.length) { status.textContent = '🚨 Erfasst von: ' + activeNow.map(s => s.label).join(', '); status.className = 'sens-status bad'; }
      else { status.textContent = 'Bring dich zum Tresor 💰 (WASD / Pfeile / ziehen)'; status.className = 'sens-status'; }
      detected.textContent = 'Bisher erfasst: ' + (triggered.size ? [...triggered].join(' · ') : 'noch nichts (Stealth!)');
    }

    function render() {
      // Himmel + Boden
      const grd = ctx.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, '#0a1626'); grd.addColorStop(0.5, '#0b1424'); ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H / 2);
      ctx.fillStyle = '#0d1828'; ctx.fillRect(0, H / 2, W, H / 2);
      const dirX = Math.cos(player.ang), dirY = Math.sin(player.ang);
      const planeX = -dirY * 0.66, planeY = dirX * 0.66;
      const step = 2;
      for (let x = 0; x < W; x += step) {
        const camX = 2 * x / W - 1; const rayX = dirX + planeX * camX, rayY = dirY + planeY * camX;
        let mapX = Math.floor(player.x), mapY = Math.floor(player.y);
        const dDX = Math.abs(1 / rayX), dDY = Math.abs(1 / rayY);
        let stepX, stepY, sideDX, sideDY;
        if (rayX < 0) { stepX = -1; sideDX = (player.x - mapX) * dDX; } else { stepX = 1; sideDX = (mapX + 1 - player.x) * dDX; }
        if (rayY < 0) { stepY = -1; sideDY = (player.y - mapY) * dDY; } else { stepY = 1; sideDY = (mapY + 1 - player.y) * dDY; }
        let hit = 0, side = 0, guard = 0;
        while (!hit && guard++ < 64) { if (sideDX < sideDY) { sideDX += dDX; mapX += stepX; side = 0; } else { sideDY += dDY; mapY += stepY; side = 1; } if (wall(mapX, mapY)) hit = 1; }
        const perp = side === 0 ? (sideDX - dDX) : (sideDY - dDY);
        const lh = Math.min(H * 3, H / perp);
        const y0 = H / 2 - lh / 2, shade = Math.max(0.15, 1 - perp / 9) * (side ? 0.7 : 1);
        ctx.fillStyle = `rgb(${Math.round(40 * shade + 30)},${Math.round(70 * shade + 30)},${Math.round(110 * shade + 35)})`;
        ctx.fillRect(x, y0, step, lh);
        for (let z = x; z < x + step; z++) zbuf[z] = perp;
      }
      // Sprites (Sensoren + Tresor)
      const sprites = [...SENSORS.map(s => ({ x: s.x, y: s.y, on: s._on, icon: s.icon, color: s.color })), { x: TRESOR.x, y: TRESOR.y, icon: '💰', color: '#fbbf24', tres: true }];
      sprites.map(s => ({ s, d: (player.x - s.x) ** 2 + (player.y - s.y) ** 2 })).sort((a, b) => b.d - a.d).forEach(({ s }) => {
        const relX = s.x - player.x, relY = s.y - player.y;
        const inv = 1 / (planeX * dirY - dirX * planeY);
        const tX = inv * (dirY * relX - dirX * relY);
        const tY = inv * (-planeY * relX + planeX * relY);
        if (tY <= 0.2) return;
        const scrX = (W / 2) * (1 + tX / tY);
        const sz = Math.min(H, H / tY * 0.6);
        if (scrX > -sz && scrX < W + sz && zbuf[Math.max(0, Math.min(W - 1, Math.floor(scrX)))] > tY) {
          ctx.globalAlpha = Math.max(0.3, 1 - tY / 10);
          ctx.fillStyle = s.on ? '#ef4444' : s.color;
          ctx.beginPath(); ctx.arc(scrX, H / 2 + sz * 0.1, sz * 0.42, 0, 7); ctx.fill();
          ctx.globalAlpha = 1; ctx.font = (sz * 0.5) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(s.icon, scrX, H / 2 + sz * 0.1);
          ctx.textBaseline = 'alphabetic';
        }
      });
      // Minimap
      const ms = 11, ox = 12, oy = 12;
      ctx.fillStyle = 'rgba(2,6,12,0.7)'; ctx.fillRect(ox - 4, oy - 4, MW * ms + 8, MH * ms + 8);
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { ctx.fillStyle = MAP[y][x] === '1' ? '#334155' : '#0f1b2e'; ctx.fillRect(ox + x * ms, oy + y * ms, ms - 1, ms - 1); }
      SENSORS.forEach(s => { ctx.fillStyle = s._on ? '#ef4444' : s.color; ctx.beginPath(); ctx.arc(ox + s.x * ms, oy + s.y * ms, 3, 0, 7); ctx.fill(); });
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(ox + TRESOR.x * ms - 3, oy + TRESOR.y * ms - 3, 6, 6);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ox + player.x * ms, oy + player.y * ms, 3, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(ox + player.x * ms, oy + player.y * ms); ctx.lineTo(ox + (player.x + Math.cos(player.ang) * 1.2) * ms, oy + (player.y + Math.sin(player.ang) * 1.2) * ms); ctx.stroke();
    }

    function frame() { if (!canvas.isConnected) return; update(); render(); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);

    // Touch-Steuerkreuz
    function padBtn(icon, key) {
      const b = el('button', { class: 'beg-pad', html: `<i class="fas ${icon}"></i>` });
      const set = v => () => keys[key] = v;
      b.addEventListener('mousedown', set(true)); b.addEventListener('mouseup', set(false)); b.addEventListener('mouseleave', set(false));
      b.addEventListener('touchstart', e => { e.preventDefault(); keys[key] = true; }, { passive: false });
      b.addEventListener('touchend', e => { e.preventDefault(); keys[key] = false; }, { passive: false });
      return b;
    }
    const pad = el('div', { class: 'beg-pad-wrap' }, [
      el('div', {}, [padBtn('fa-arrow-up', 'w')]),
      el('div', {}, [padBtn('fa-rotate-left', 'arrowleft'), padBtn('fa-arrow-down', 's'), padBtn('fa-rotate-right', 'arrowright')]),
    ]);
    const reset = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Neu starten' });
    reset.addEventListener('click', () => { player.x = 2.5; player.y = 7.5; player.ang = 0; triggered.clear(); won = false; });

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">3D · Begehung</span>
      <h1>Begeh das gesicherte Gebäude 🚶</h1>
      <p class="lead">Lauf in der Ego-Perspektive durchs Objekt – <b>WASD/Pfeiltasten</b> oder die Touch-Tasten, <b>ziehen</b> zum Umsehen.
      Die Sensoren (📡 PIR, 📹 Kamera, 🛰️ Radar) erfassen dich in Reichweite + Sichtlinie. Schaffst du es <b>ungesehen</b> zum Tresor 💰?</p>`;

    root.append(intro, canvas, el('div', { class: 'phys-ros' }, [status, detected]), pad, reset);
    return root;
  }

  return { view };
})();
