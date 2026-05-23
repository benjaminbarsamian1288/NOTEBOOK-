/* Sandbox „Plane dein Objekt" – Sensoren auf einen Grundriss setzen,
   Live-Abdeckungs-Heatmap + Schwachstellen-Analyse + Kostenschätzung.
   window.SANDBOX.view() liefert den Ansichts-Knoten. */
window.SANDBOX = (() => {
  const { el } = U;

  const TYPES = {
    pir:    { name: 'PIR',    icon: 'fa-person-walking-arrow-right', shape: 'circle', range: 95,  cost: 60,  color: '#22d3ee' },
    radar:  { name: 'Radar',  icon: 'fa-satellite-dish',            shape: 'circle', range: 165, cost: 170, color: '#22c55e' },
    kamera: { name: 'Kamera', icon: 'fa-video',                     shape: 'cone',   range: 220, half: 0.55, cost: 110, color: '#7dd3fc' },
  };

  function view() {
    const root = el('div', { class: 'spiel-view' });
    const W = 760, H = 460;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H, style: 'cursor:crosshair' });
    const ctx = canvas.getContext('2d');

    // Grundriss: Außenmauer + ein paar Innenwände
    const bx = 60, by = 70, bw = 640, bh = 330;
    const walls = [
      [bx, by, bx + bw, by], [bx + bw, by, bx + bw, by + bh], [bx + bw, by + bh, bx, by + bh], [bx, by + bh, bx, by],
      [bx + 230, by, bx + 230, by + 180], [bx + 230, by + bh, bx + 230, by + 240],
      [bx + 440, by + 90, bx + bw, by + 90],
    ];
    const sensors = [];
    const state = { sel: null, type: null, dragging: false };

    function dist(x, y, x2, y2) { return Math.hypot(x - x2, y - y2); }
    function covered(cx, cy) {
      for (const s of sensors) {
        if (s.shape === 'circle') { if (dist(cx, cy, s.x, s.y) < s.range) return true; }
        else { const d = dist(cx, cy, s.x, s.y); if (d < s.range) { const da = Math.abs(((Math.atan2(cy - s.y, cx - s.x) - s.dir) + Math.PI * 3) % (Math.PI * 2) - Math.PI); if (da < s.half) return true; } }
      }
      return false;
    }

    // ---- Palette ----
    const shop = el('div', { class: 'spiel-shop' });
    const shopBtns = {};
    Object.entries(TYPES).forEach(([k, t]) => {
      const b = el('button', { class: 'spiel-tower' });
      b.innerHTML = `<i class="fas ${t.icon}"></i><span>${t.name}</span><em>${t.cost} €</em>`;
      b.addEventListener('click', () => { state.type = state.type === k ? null : k; state.sel = null; updateShop(); });
      shop.appendChild(b); shopBtns[k] = b;
    });
    function updateShop() { Object.entries(shopBtns).forEach(([k, b]) => b.classList.toggle('sel', state.type === k)); }

    // ---- Analyse-Panel ----
    const covBar = el('div', { class: 'sb-bar' }); const covFill = el('div', { class: 'sb-fill' }); covBar.appendChild(covFill);
    const covPct = el('div', { class: 'sb-big', text: '0 %' });
    const stCount = el('span', {}), stCost = el('span', {}), verdict = el('div', { class: 'sb-verdict' });
    const selInfo = el('div', { class: 'sb-sel', text: 'Klicke einen Sensor an zum Drehen/Löschen.' });
    const delBtn = el('button', { class: 'btn', html: '<i class="fas fa-trash"></i> Löschen', style: 'display:none' });
    delBtn.addEventListener('click', () => { if (state.sel) { sensors.splice(sensors.indexOf(state.sel), 1); state.sel = null; } });
    const rotWrap = el('div', { class: 'phys-ctrl', style: 'display:none' });
    const rot = el('input', { type: 'range', min: '0', max: '360', value: '0', class: 'phys-slider' });
    rot.addEventListener('input', () => { if (state.sel && state.sel.shape === 'cone') state.sel.dir = +rot.value * Math.PI / 180; });
    rotWrap.append(el('label', { text: 'Kamera drehen' }), rot);
    const panel = el('div', { class: 'scene-panel' }, [
      el('div', { class: 'scene-panel-h', text: 'Abdeckung' }), covPct, covBar, verdict,
      el('div', { class: 'sb-stats' }, [
        el('span', { class: 'sh-item' }, [el('i', { class: 'fas fa-microchip' }), stCount]),
        el('span', { class: 'sh-item' }, [el('i', { class: 'fas fa-euro-sign' }), stCost]),
      ]),
      el('div', { class: 'scene-panel-h', text: 'Ausgewählt' }), selInfo, rotWrap, delBtn,
    ]);

    // ---- Interaktion ----
    function at(e) { const r = canvas.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return { x: (p.clientX - r.left) * W / r.width, y: (p.clientY - r.top) * H / r.height }; }
    function hit(x, y) { return sensors.find(s => dist(x, y, s.x, s.y) < 16); }
    canvas.addEventListener('mousedown', (e) => {
      const p = at(e); const h = hit(p.x, p.y);
      if (h) { state.sel = h; state.dragging = true; }
      else if (state.type) { const t = TYPES[state.type]; const s = { ...t, x: p.x, y: p.y, dir: 0, shape: t.shape }; sensors.push(s); state.sel = s; }
      else state.sel = null;
      syncSel();
    });
    canvas.addEventListener('mousemove', (e) => { if (state.dragging && state.sel) { const p = at(e); state.sel.x = p.x; state.sel.y = p.y; } });
    window.addEventListener('mouseup', () => { state.dragging = false; });
    canvas.addEventListener('wheel', (e) => { if (state.sel && state.sel.shape === 'cone') { e.preventDefault(); state.sel.dir += e.deltaY > 0 ? 0.15 : -0.15; rot.value = ((state.sel.dir * 180 / Math.PI) % 360 + 360) % 360; } }, { passive: false });
    function syncSel() {
      if (state.sel) { selInfo.textContent = TYPES[Object.keys(TYPES).find(k => TYPES[k].name === state.sel.name)] ? state.sel.name + ' ausgewählt' : 'ausgewählt'; delBtn.style.display = ''; rotWrap.style.display = state.sel.shape === 'cone' ? 'flex' : 'none'; if (state.sel.shape === 'cone') rot.value = ((state.sel.dir * 180 / Math.PI) % 360 + 360) % 360; }
      else { selInfo.textContent = 'Klicke einen Sensor an zum Drehen/Löschen.'; delBtn.style.display = 'none'; rotWrap.style.display = 'none'; }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Abdeckungs-Heatmap im Gebäude
      const cs = 18; let tot = 0, cov = 0;
      for (let x = bx; x < bx + bw; x += cs) for (let y = by; y < by + bh; y += cs) {
        const cx = x + cs / 2, cy = y + cs / 2; tot++;
        if (covered(cx, cy)) { cov++; ctx.fillStyle = 'rgba(34,197,94,0.16)'; } else { ctx.fillStyle = 'rgba(239,68,68,0.14)'; }
        ctx.fillRect(x, y, cs - 1, cs - 1);
      }
      // Sensor-Flächen
      sensors.forEach(s => {
        ctx.fillStyle = s.color + '22';
        if (s.shape === 'circle') { ctx.beginPath(); ctx.arc(s.x, s.y, s.range, 0, 7); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(s.x, s.y); for (let k = 0; k <= 16; k++) { const a = s.dir - s.half + k / 16 * 2 * s.half; ctx.lineTo(s.x + Math.cos(a) * s.range, s.y + Math.sin(a) * s.range); } ctx.closePath(); ctx.fill(); }
      });
      // Wände
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      walls.forEach(w => { ctx.beginPath(); ctx.moveTo(w[0], w[1]); ctx.lineTo(w[2], w[3]); ctx.stroke(); });
      // Sensoren
      sensors.forEach(s => {
        if (s === state.sel) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.x, s.y, 17, 0, 7); ctx.stroke(); }
        ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x, s.y, 12, 0, 7); ctx.fill();
      });
      // Vorschau
      if (state.type && !state.dragging) { const t = TYPES[state.type]; ctx.strokeStyle = t.color + '99'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(mouse.x, mouse.y, t.range, 0, 7); ctx.stroke(); ctx.setLineDash([]); }

      // Panel
      const pct = tot ? Math.round(cov / tot * 100) : 0;
      covPct.textContent = pct + ' %'; covFill.style.width = pct + '%';
      covFill.style.background = pct >= 80 ? '#22c55e' : pct >= 50 ? '#fbbf24' : '#ef4444';
      verdict.textContent = pct >= 80 ? '✓ Sehr gute Abdeckung' : pct >= 50 ? '⚠ Lücken vorhanden' : '✕ Große Schwachstellen (rot)';
      verdict.className = 'sb-verdict ' + (pct >= 80 ? 'ok' : pct >= 50 ? 'warn' : 'bad');
      stCount.textContent = sensors.length + ' Sensoren';
      stCost.textContent = sensors.reduce((a, s) => a + s.cost, 0) + ' €';
    }
    const mouse = { x: -100, y: -100 };
    canvas.addEventListener('mousemove', (e) => { const p = at(e); mouse.x = p.x; mouse.y = p.y; });
    function frame() { if (!canvas.isConnected) return; draw(); requestAnimationFrame(frame); }
    requestAnimationFrame(frame); updateShop();

    const clearBtn = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Alles leeren' });
    clearBtn.addEventListener('click', () => { sensors.length = 0; state.sel = null; syncSel(); });

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Werkzeug · Planung</span>
      <h1>Plane dein Objekt 🏢</h1>
      <p class="lead">Wähle einen Sensor und <b>klick in den Grundriss</b>, um ihn zu setzen (Sensoren lassen sich ziehen).
      Die <b>Heatmap</b> zeigt grün = abgedeckt, rot = Schwachstelle. Rechts siehst du Abdeckung, Anzahl und geschätzte Kosten.
      Kamera ausgewählt? Mit dem Mausrad oder dem Regler drehen.</p>`;

    const body = el('div', { class: 'scene-body' }, [canvas, panel]);
    root.append(intro, shop, body, clearBtn);
    return root;
  }

  return { view };
})();
