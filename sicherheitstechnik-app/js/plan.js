/* Plan-Zeichnen – Stift/S-Pen-fähiges Skizzen- & Planungstool.
   Freihand (druckempfindlich), Linie/Wand, Rechteck/Raum, Radierer, Text,
   Sicherheitstechnik-Stempel, Grundriss als Hintergrund, Raster, Undo,
   PNG-Export, Speichern (localStorage). window.PLAN.view(). */
window.PLAN = (() => {
  const { el } = U;
  const W = 1180, H = 760;
  const COLORS = ['#e2e8f0', '#22d3ee', '#ef4444', '#22c55e', '#fbbf24', '#a855f7', '#f97316', '#0b1424'];
  const STAMPS = [
    ['📹', 'Kamera'], ['📡', 'Melder'], ['🚪', 'Tür'], ['🪟', 'Fenster'], ['🔒', 'Schloss'], ['🚨', 'Sirene'],
    ['💡', 'Strahler'], ['🛡️', 'Schutz'], ['💰', 'Tresor'], ['🚗', 'Tor'], ['🐕', 'Hund'], ['🌳', 'Außen'],
  ];

  function view() {
    const root = el('div', { class: 'phys-view plan-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Werkzeug · Plan zeichnen</span>
      <h1>Plan-Zeichnen ✏️ (Stift / S-Pen)</h1>
      <p class="lead">Skizziere Sicherheitspläne von Hand – druckempfindlich mit dem S-Pen/Stift. Zeichne Wände & Räume,
      setze Sicherheitstechnik-Stempel (Kamera, Melder, Tür, Sirene …), lade einen Grundriss als Vorlage, und exportiere alles als Bild.</p>`;
    root.appendChild(intro);

    const canvas = el('canvas', { class: 'plan-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const gridC = document.createElement('canvas'); gridC.width = W; gridC.height = H;
    const drawC = document.createElement('canvas'); drawC.width = W; drawC.height = H;
    const dctx = drawC.getContext('2d');
    let bgImg = null, raster = true;

    let ops = [], tool = 'stift', color = COLORS[0], width = 3, penOnly = false, stamp = null;
    let drawing = false, cur = null, start = null;

    function drawGrid() {
      const g = gridC.getContext('2d'); g.clearRect(0, 0, W, H);
      g.fillStyle = '#0e1726'; g.fillRect(0, 0, W, H);
      if (!raster) return;
      g.strokeStyle = 'rgba(148,163,184,0.13)'; g.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 0; y <= H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    }
    function seg(c, a, b, op) {
      c.strokeStyle = op.type === 'erase' ? '#000' : op.color; c.lineCap = 'round'; c.lineJoin = 'round';
      c.lineWidth = op.type === 'erase' ? op.w * 6 : op.w * (0.5 + 1.4 * ((a.p + b.p) / 2));
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    }
    function drawOp(c, op) {
      c.globalCompositeOperation = op.type === 'erase' ? 'destination-out' : 'source-over';
      if (op.type === 'pen' || op.type === 'erase') { for (let i = 1; i < op.pts.length; i++) seg(c, op.pts[i - 1], op.pts[i], op); }
      else if (op.type === 'line') { c.strokeStyle = op.color; c.lineCap = 'round'; c.lineWidth = op.w * 2; c.beginPath(); c.moveTo(op.x1, op.y1); c.lineTo(op.x2, op.y2); c.stroke(); }
      else if (op.type === 'rect') { c.strokeStyle = op.color; c.lineWidth = op.w * 2; c.strokeRect(op.x, op.y, op.wd, op.ht); }
      else if (op.type === 'stamp') { c.font = op.size + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(op.emoji, op.x, op.y); }
      else if (op.type === 'text') { c.fillStyle = op.color; c.font = '600 ' + op.size + 'px sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(op.text, op.x, op.y); }
      c.globalCompositeOperation = 'source-over';
    }
    function renderDraw() { dctx.clearRect(0, 0, W, H); ops.forEach(op => drawOp(dctx, op)); }
    function blit(preview) {
      ctx.clearRect(0, 0, W, H);
      if (bgImg) { const s = Math.min(W / bgImg.width, H / bgImg.height); const iw = bgImg.width * s, ih = bgImg.height * s; ctx.globalAlpha = 0.55; ctx.drawImage(bgImg, (W - iw) / 2, (H - ih) / 2, iw, ih); ctx.globalAlpha = 1; }
      ctx.drawImage(gridC, 0, 0);
      ctx.drawImage(drawC, 0, 0);
      if (preview) preview();
    }

    function pt(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height, p: e.pointerType === 'pen' ? Math.max(0.15, e.pressure || 0.5) : 0.6 }; }
    function down(e) {
      if (penOnly && e.pointerType === 'touch') return; e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
      const p = pt(e);
      if (tool === 'stempel' && stamp) { ops.push({ type: 'stamp', emoji: stamp, x: p.x, y: p.y, size: 22 + width * 7 }); renderDraw(); blit(); return; }
      if (tool === 'text') { const t = prompt('Beschriftung:'); if (t) { ops.push({ type: 'text', x: p.x, y: p.y, text: t, color, size: 14 + width * 4 }); renderDraw(); blit(); } return; }
      drawing = true; start = p;
      if (tool === 'stift' || tool === 'radierer') cur = { type: tool === 'radierer' ? 'erase' : 'pen', color, w: width, pts: [p] };
    }
    function move(e) {
      if (!drawing) return; if (penOnly && e.pointerType === 'touch') return; e.preventDefault();
      const p = pt(e);
      if (tool === 'stift' || tool === 'radierer') { const a = cur.pts[cur.pts.length - 1]; cur.pts.push(p); dctx.globalCompositeOperation = cur.type === 'erase' ? 'destination-out' : 'source-over'; seg(dctx, a, p, cur); dctx.globalCompositeOperation = 'source-over'; blit(); }
      else if (tool === 'linie') blit(() => { ctx.strokeStyle = color; ctx.lineWidth = width * 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(p.x, p.y); ctx.stroke(); });
      else if (tool === 'rechteck') blit(() => { ctx.strokeStyle = color; ctx.lineWidth = width * 2; ctx.strokeRect(start.x, start.y, p.x - start.x, p.y - start.y); });
    }
    function up(e) {
      if (!drawing) return; drawing = false; const p = pt(e);
      if (tool === 'stift' || tool === 'radierer') ops.push(cur);
      else if (tool === 'linie') ops.push({ type: 'line', color, w: width, x1: start.x, y1: start.y, x2: p.x, y2: p.y });
      else if (tool === 'rechteck') ops.push({ type: 'rect', color, w: width, x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), wd: Math.abs(p.x - start.x), ht: Math.abs(p.y - start.y) });
      cur = null; renderDraw(); blit();
    }
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

    // ---- Toolbar ----
    function tbtn(icon, label, t) { const b = el('button', { class: 'plan-tool' + (t === tool ? ' sel' : ''), title: label, html: `<i class="fas ${icon}"></i>` }); b.addEventListener('click', () => { tool = t; stamp = null; refreshTools(); }); b.dataset.tool = t; return b; }
    const toolRow = el('div', { class: 'plan-toolbar' });
    const tools = [tbtn('fa-pen', 'Stift', 'stift'), tbtn('fa-ruler', 'Linie / Wand', 'linie'), tbtn('fa-vector-square', 'Rechteck / Raum', 'rechteck'), tbtn('fa-eraser', 'Radierer', 'radierer'), tbtn('fa-font', 'Text', 'text')];
    tools.forEach(b => toolRow.appendChild(b));
    function refreshTools() { toolRow.querySelectorAll('.plan-tool').forEach(b => b.classList.toggle('sel', b.dataset.tool === tool && !stamp)); stampRow.querySelectorAll('.plan-stamp').forEach(b => b.classList.toggle('sel', stamp === b.dataset.s)); }

    const colorRow = el('div', { class: 'plan-colors' });
    COLORS.forEach(cc => { const s = el('button', { class: 'plan-sw' + (cc === color ? ' sel' : ''), style: `background:${cc}` }); s.addEventListener('click', () => { color = cc; colorRow.querySelectorAll('.plan-sw').forEach(x => x.classList.remove('sel')); s.classList.add('sel'); }); colorRow.appendChild(s); });
    const wRange = el('input', { type: 'range', min: '1', max: '12', value: '3', class: 'phys-slider', style: 'max-width:120px' }); wRange.addEventListener('input', () => width = +wRange.value);

    const stampRow = el('div', { class: 'plan-stamps' });
    STAMPS.forEach(([em, lbl]) => { const b = el('button', { class: 'plan-stamp', title: lbl, text: em }); b.dataset.s = em; b.addEventListener('click', () => { tool = 'stempel'; stamp = em; refreshTools(); }); stampRow.appendChild(b); });

    const penChk = el('button', { class: 'btn', html: '<i class="fas fa-hand"></i> Handballen-Schutz' });
    penChk.addEventListener('click', () => { penOnly = !penOnly; penChk.className = 'btn' + (penOnly ? ' primary' : ''); });
    const rasterBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-table-cells"></i> Raster' });
    rasterBtn.addEventListener('click', () => { raster = !raster; rasterBtn.className = 'btn' + (raster ? ' primary' : ''); drawGrid(); blit(); });
    const undoBtn = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Zurück' });
    undoBtn.addEventListener('click', () => { ops.pop(); renderDraw(); blit(); });
    const clrBtn = el('button', { class: 'btn', html: '<i class="fas fa-trash"></i> Leeren' });
    clrBtn.addEventListener('click', () => { if (confirm('Ganzen Plan löschen?')) { ops = []; renderDraw(); blit(); } });
    const bgIn = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
    bgIn.addEventListener('change', () => { const f = bgIn.files[0]; if (!f) return; const im = new Image(); im.onload = () => { bgImg = im; blit(); }; im.src = URL.createObjectURL(f); });
    const bgBtn = el('button', { class: 'btn', html: '<i class="fas fa-image"></i> Grundriss laden' }); bgBtn.addEventListener('click', () => bgIn.click());
    const expBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-download"></i> Als Bild' });
    expBtn.addEventListener('click', () => { blit(); const a = el('a', { href: canvas.toDataURL('image/png'), download: 'sicherheitsplan.png' }); a.click(); });
    const saveBtn = el('button', { class: 'btn', html: '<i class="fas fa-floppy-disk"></i> Speichern' });
    saveBtn.addEventListener('click', () => { try { localStorage.setItem('st-plan', JSON.stringify(ops)); saveBtn.innerHTML = '<i class="fas fa-check"></i> Gespeichert'; setTimeout(() => saveBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> Speichern', 1500); } catch (e) {} });
    const loadBtn = el('button', { class: 'btn', html: '<i class="fas fa-folder-open"></i> Laden' });
    loadBtn.addEventListener('click', () => { try { const s = localStorage.getItem('st-plan'); if (s) { ops = JSON.parse(s); renderDraw(); blit(); } } catch (e) {} });

    const card = el('div', { class: 'phys-card phys-card-wide' });
    card.append(
      toolRow,
      el('div', { class: 'plan-row' }, [el('span', { class: 'plan-lbl', text: 'Farbe' }), colorRow, el('span', { class: 'plan-lbl', text: 'Stärke' }), wRange, penChk]),
      el('div', { class: 'plan-row' }, [el('span', { class: 'plan-lbl', text: 'Stempel' }), stampRow]),
      canvas,
      el('div', { class: 'plan-row' }, [rasterBtn, bgBtn, undoBtn, clrBtn, expBtn, saveBtn, loadBtn]),
      el('div', { class: 'phys-hint', text: '✏️ Mit Stift/S-Pen druckempfindlich zeichnen. „Handballen-Schutz" ignoriert Finger-Berührungen, damit nur der Stift malt.' }),
      bgIn,
    );
    root.appendChild(card);

    drawGrid(); renderDraw(); blit();
    return root;
  }
  return { view };
})();
