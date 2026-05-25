/* Plan-Zeichnen – Stift/S-Pen-Skizzentool mit Bemaßung, Auswahl/Verschieben,
   benannten Projekten und PDF-Export. window.PLAN.view(). */
window.PLAN = (() => {
  const { el } = U;
  const W = 1180, H = 760, CELL = 40;
  const COLORS = ['#e2e8f0', '#22d3ee', '#ef4444', '#22c55e', '#fbbf24', '#a855f7', '#f97316', '#0b1424'];
  const STAMPS = [['📹', 'Kamera'], ['📡', 'Melder'], ['🚪', 'Tür'], ['🪟', 'Fenster'], ['🔒', 'Schloss'], ['🚨', 'Sirene'], ['💡', 'Strahler'], ['🛡️', 'Schutz'], ['💰', 'Tresor'], ['🚗', 'Tor'], ['🐕', 'Hund'], ['🌳', 'Außen']];
  const PKEY = 'st-plans';
  const getPlans = () => { try { return JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch (e) { return {}; } };
  const setPlans = o => { try { localStorage.setItem(PKEY, JSON.stringify(o)); } catch (e) {} };

  function view() {
    const root = el('div', { class: 'phys-view plan-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Werkzeug · Plan zeichnen</span>
      <h1>Plan-Zeichnen ✏️ (Stift / S-Pen)</h1>
      <p class="lead">Skizziere Sicherheitspläne von Hand – druckempfindlich. Wände & Räume, <b>Bemaßung in Metern</b>,
      Sicherheitstechnik-Stempel (verschiebbar), Grundriss als Vorlage, mehrere <b>benannte Projekte</b> und Export als Bild oder PDF.</p>`;
    root.appendChild(intro);

    const canvas = el('canvas', { class: 'plan-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const gridC = document.createElement('canvas'); gridC.width = W; gridC.height = H;
    const drawC = document.createElement('canvas'); drawC.width = W; drawC.height = H; const dctx = drawC.getContext('2d');
    let bgImg = null, raster = true;
    let ops = [], tool = 'stift', color = COLORS[0], width = 3, penOnly = false, stamp = null;
    let metersPerCell = 1, selected = null, dragSel = false, dragOff = { x: 0, y: 0 };
    let drawing = false, cur = null, start = null;
    const pxPerM = () => CELL / metersPerCell;

    function drawGrid() {
      const g = gridC.getContext('2d'); g.clearRect(0, 0, W, H); g.fillStyle = '#0e1726'; g.fillRect(0, 0, W, H);
      if (!raster) return; g.strokeStyle = 'rgba(148,163,184,0.13)'; g.lineWidth = 1;
      for (let x = 0; x <= W; x += CELL) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 0; y <= H; y += CELL) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    }
    function segDraw(c, a, b, op) { c.strokeStyle = op.type === 'erase' ? '#000' : op.color; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = op.type === 'erase' ? op.w * 6 : op.w * (0.5 + 1.4 * ((a.p + b.p) / 2)); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
    function massDraw(c, a, b) {
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, m = len / pxPerM();
      const ux = -dy / len, uy = dx / len;
      c.strokeStyle = '#fbbf24'; c.lineWidth = 2; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      [a, b].forEach(p => { c.beginPath(); c.moveTo(p.x - ux * 7, p.y - uy * 7); c.lineTo(p.x + ux * 7, p.y + uy * 7); c.stroke(); });
      c.fillStyle = '#fbbf24'; c.font = '700 14px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
      c.fillText(m.toFixed(2).replace('.', ',') + ' m', (a.x + b.x) / 2, (a.y + b.y) / 2 - 6);
    }
    function drawOp(c, op) {
      c.globalCompositeOperation = op.type === 'erase' ? 'destination-out' : 'source-over';
      if (op.type === 'pen' || op.type === 'erase') { for (let i = 1; i < op.pts.length; i++) segDraw(c, op.pts[i - 1], op.pts[i], op); }
      else if (op.type === 'line') { c.strokeStyle = op.color; c.lineCap = 'round'; c.lineWidth = op.w * 2; c.beginPath(); c.moveTo(op.x1, op.y1); c.lineTo(op.x2, op.y2); c.stroke(); }
      else if (op.type === 'rect') { c.strokeStyle = op.color; c.lineWidth = op.w * 2; c.strokeRect(op.x, op.y, op.wd, op.ht); }
      else if (op.type === 'mass') { massDraw(c, { x: op.x1, y: op.y1 }, { x: op.x2, y: op.y2 }); }
      else if (op.type === 'stamp') { c.font = op.size + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(op.emoji, op.x, op.y); }
      else if (op.type === 'text') { c.fillStyle = op.color; c.font = '600 ' + op.size + 'px sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(op.text, op.x, op.y); }
      c.globalCompositeOperation = 'source-over';
    }
    function renderDraw() { dctx.clearRect(0, 0, W, H); ops.forEach(op => drawOp(dctx, op)); }
    function blit(preview) {
      ctx.clearRect(0, 0, W, H);
      if (bgImg) { const s = Math.min(W / bgImg.width, H / bgImg.height), iw = bgImg.width * s, ih = bgImg.height * s; ctx.globalAlpha = 0.55; ctx.drawImage(bgImg, (W - iw) / 2, (H - ih) / 2, iw, ih); ctx.globalAlpha = 1; }
      ctx.drawImage(gridC, 0, 0); ctx.drawImage(drawC, 0, 0);
      if (selected != null && ops[selected] && (ops[selected].type === 'stamp' || ops[selected].type === 'text')) { const o = ops[selected]; ctx.strokeStyle = '#22d3ee'; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x + (o.type === 'text' ? 30 : 0), o.y, (o.size || 24) * 0.8 + 6, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
      if (preview) preview();
    }
    function pt(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height, p: e.pointerType === 'pen' ? Math.max(0.15, e.pressure || 0.5) : 0.6 }; }
    function hitTest(p) { for (let i = ops.length - 1; i >= 0; i--) { const o = ops[i]; if (o.type === 'stamp' && Math.hypot(p.x - o.x, p.y - o.y) < o.size * 0.8) return i; if (o.type === 'text' && p.x > o.x - 8 && p.x < o.x + o.text.length * o.size * 0.6 + 10 && Math.abs(p.y - o.y) < o.size) return i; } return -1; }
    function delSel() { if (selected != null) { ops.splice(selected, 1); selected = null; renderDraw(); blit(); } }

    function down(e) {
      if (penOnly && e.pointerType === 'touch') return; e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
      const p = pt(e);
      if (tool === 'auswahl') { const i = hitTest(p); selected = i >= 0 ? i : null; if (i >= 0) { dragSel = true; dragOff = { x: p.x - ops[i].x, y: p.y - ops[i].y }; } blit(); return; }
      if (tool === 'stempel' && stamp) { ops.push({ type: 'stamp', emoji: stamp, x: p.x, y: p.y, size: 22 + width * 7 }); selected = ops.length - 1; renderDraw(); blit(); return; }
      if (tool === 'text') { const t = prompt('Beschriftung:'); if (t) { ops.push({ type: 'text', x: p.x, y: p.y, text: t, color, size: 14 + width * 4 }); renderDraw(); blit(); } return; }
      drawing = true; start = p;
      if (tool === 'stift' || tool === 'radierer') cur = { type: tool === 'radierer' ? 'erase' : 'pen', color, w: width, pts: [p] };
    }
    function move(e) {
      const p = pt(e);
      if (tool === 'auswahl' && dragSel && selected != null) { e.preventDefault(); ops[selected].x = p.x - dragOff.x; ops[selected].y = p.y - dragOff.y; renderDraw(); blit(); return; }
      if (!drawing) return; if (penOnly && e.pointerType === 'touch') return; e.preventDefault();
      if (tool === 'stift' || tool === 'radierer') { const a = cur.pts[cur.pts.length - 1]; cur.pts.push(p); dctx.globalCompositeOperation = cur.type === 'erase' ? 'destination-out' : 'source-over'; segDraw(dctx, a, p, cur); dctx.globalCompositeOperation = 'source-over'; blit(); }
      else if (tool === 'linie') blit(() => { ctx.strokeStyle = color; ctx.lineWidth = width * 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(p.x, p.y); ctx.stroke(); });
      else if (tool === 'rechteck') blit(() => { ctx.strokeStyle = color; ctx.lineWidth = width * 2; ctx.strokeRect(start.x, start.y, p.x - start.x, p.y - start.y); });
      else if (tool === 'mass') blit(() => massDraw(ctx, start, p));
    }
    function up(e) {
      if (tool === 'auswahl') { dragSel = false; return; }
      if (!drawing) return; drawing = false; const p = pt(e);
      if (tool === 'stift' || tool === 'radierer') ops.push(cur);
      else if (tool === 'linie') ops.push({ type: 'line', color, w: width, x1: start.x, y1: start.y, x2: p.x, y2: p.y });
      else if (tool === 'rechteck') ops.push({ type: 'rect', color, w: width, x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), wd: Math.abs(p.x - start.x), ht: Math.abs(p.y - start.y) });
      else if (tool === 'mass') ops.push({ type: 'mass', x1: start.x, y1: start.y, x2: p.x, y2: p.y });
      cur = null; renderDraw(); blit();
    }
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    function keyHandler(e) { if (!canvas.isConnected) { window.removeEventListener('keydown', keyHandler); return; } if ((e.key === 'Delete' || e.key === 'Backspace') && selected != null) { e.preventDefault(); delSel(); } }
    window.addEventListener('keydown', keyHandler);

    // ---- Werkzeuge ----
    function tbtn(icon, label, t) { const b = el('button', { class: 'plan-tool', title: label, html: `<i class="fas ${icon}"></i>` }); b.dataset.tool = t; b.addEventListener('click', () => { tool = t; stamp = null; selected = null; refresh(); blit(); }); return b; }
    const toolRow = el('div', { class: 'plan-toolbar' }, [
      tbtn('fa-pen', 'Stift', 'stift'), tbtn('fa-ruler', 'Linie / Wand', 'linie'), tbtn('fa-vector-square', 'Rechteck / Raum', 'rechteck'),
      tbtn('fa-ruler-horizontal', 'Bemaßung (Meter)', 'mass'), tbtn('fa-eraser', 'Radierer', 'radierer'), tbtn('fa-font', 'Text', 'text'),
      tbtn('fa-arrows-up-down-left-right', 'Auswählen / Verschieben', 'auswahl'),
    ]);
    function refresh() { toolRow.querySelectorAll('.plan-tool').forEach(b => b.classList.toggle('sel', b.dataset.tool === tool && !stamp)); stampRow.querySelectorAll('.plan-stamp').forEach(b => b.classList.toggle('sel', stamp === b.dataset.s)); }

    const colorRow = el('div', { class: 'plan-colors' });
    COLORS.forEach(cc => { const s = el('button', { class: 'plan-sw' + (cc === color ? ' sel' : ''), style: `background:${cc}` }); s.addEventListener('click', () => { color = cc; colorRow.querySelectorAll('.plan-sw').forEach(x => x.classList.remove('sel')); s.classList.add('sel'); }); colorRow.appendChild(s); });
    const wRange = el('input', { type: 'range', min: '1', max: '12', value: '3', class: 'phys-slider', style: 'max-width:110px' }); wRange.addEventListener('input', () => width = +wRange.value);
    const scaleIn = el('input', { type: 'number', min: '0.1', step: '0.1', value: '1', class: 'plan-num' }); scaleIn.addEventListener('input', () => { metersPerCell = Math.max(0.1, +scaleIn.value || 1); renderDraw(); blit(); });
    const penChk = el('button', { class: 'btn', html: '<i class="fas fa-hand"></i> Handballen-Schutz' }); penChk.addEventListener('click', () => { penOnly = !penOnly; penChk.className = 'btn' + (penOnly ? ' primary' : ''); });

    const stampRow = el('div', { class: 'plan-stamps' });
    STAMPS.forEach(([em, lbl]) => { const b = el('button', { class: 'plan-stamp', title: lbl, text: em }); b.dataset.s = em; b.addEventListener('click', () => { tool = 'stempel'; stamp = em; refresh(); }); stampRow.appendChild(b); });

    const rasterBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-table-cells"></i> Raster' }); rasterBtn.addEventListener('click', () => { raster = !raster; rasterBtn.className = 'btn' + (raster ? ' primary' : ''); drawGrid(); blit(); });
    const undoBtn = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Zurück' }); undoBtn.addEventListener('click', () => { ops.pop(); selected = null; renderDraw(); blit(); });
    const delBtn = el('button', { class: 'btn', html: '<i class="fas fa-scissors"></i> Auswahl löschen' }); delBtn.addEventListener('click', delSel);
    const clrBtn = el('button', { class: 'btn', html: '<i class="fas fa-trash"></i> Leeren' }); clrBtn.addEventListener('click', () => { if (confirm('Ganzen Plan löschen?')) { ops = []; selected = null; renderDraw(); blit(); } });
    const bgIn = el('input', { type: 'file', accept: 'image/*', style: 'display:none' }); bgIn.addEventListener('change', () => { const f = bgIn.files[0]; if (!f) return; const im = new Image(); im.onload = () => { bgImg = im; blit(); }; im.src = URL.createObjectURL(f); });
    const bgBtn = el('button', { class: 'btn', html: '<i class="fas fa-image"></i> Grundriss laden' }); bgBtn.addEventListener('click', () => bgIn.click());
    const expBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-image"></i> PNG' }); expBtn.addEventListener('click', () => { blit(); const a = el('a', { href: canvas.toDataURL('image/png'), download: 'sicherheitsplan.png' }); a.click(); });
    const pdfBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-file-pdf"></i> PDF' });
    pdfBtn.addEventListener('click', () => { blit(); const url = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (!w) { alert('Bitte Popups erlauben, um das PDF zu drucken.'); return; } w.document.write('<title>Sicherheitsplan</title><style>@page{size:landscape}body{margin:0}img{width:100%}</style><img src="' + url + '" onload="setTimeout(()=>{print()},200)">'); w.document.close(); });

    // ---- Projekte ----
    const sel = el('select', { class: 'plan-num', style: 'min-width:150px' });
    function refreshSel(active) { const plans = getPlans(); sel.innerHTML = '<option value="">— Projekt wählen —</option>' + Object.keys(plans).map(n => `<option ${n === active ? 'selected' : ''}>${n}</option>`).join(''); }
    sel.addEventListener('change', () => { const n = sel.value; if (!n) return; const plans = getPlans(); if (plans[n]) { try { ops = JSON.parse(plans[n]); selected = null; renderDraw(); blit(); } catch (e) {} } });
    const saveBtn = el('button', { class: 'btn', html: '<i class="fas fa-floppy-disk"></i> Speichern als…' });
    saveBtn.addEventListener('click', () => { const n = prompt('Projektname:', sel.value || 'Mein Plan'); if (!n) return; const plans = getPlans(); plans[n] = JSON.stringify(ops); setPlans(plans); refreshSel(n); });
    const delPlanBtn = el('button', { class: 'btn', html: '<i class="fas fa-folder-minus"></i> Projekt löschen' });
    delPlanBtn.addEventListener('click', () => { const n = sel.value; if (!n) return; if (confirm('Projekt „' + n + '" löschen?')) { const plans = getPlans(); delete plans[n]; setPlans(plans); refreshSel(); } });
    refreshSel();

    const card = el('div', { class: 'phys-card phys-card-wide' });
    card.append(
      toolRow,
      el('div', { class: 'plan-row' }, [el('span', { class: 'plan-lbl', text: 'Farbe' }), colorRow, el('span', { class: 'plan-lbl', text: 'Stärke' }), wRange, el('span', { class: 'plan-lbl', text: 'm / Rasterfeld' }), scaleIn, penChk]),
      el('div', { class: 'plan-row' }, [el('span', { class: 'plan-lbl', text: 'Stempel' }), stampRow]),
      canvas,
      el('div', { class: 'plan-row' }, [rasterBtn, bgBtn, undoBtn, delBtn, clrBtn, expBtn, pdfBtn]),
      el('div', { class: 'plan-row' }, [el('span', { class: 'plan-lbl', text: 'Projekt' }), sel, saveBtn, delPlanBtn]),
      el('div', { class: 'phys-hint', text: '✏️ Stift/S-Pen druckempfindlich. Auswahl-Werkzeug: Stempel/Text antippen → verschieben oder „Auswahl löschen" / Entf-Taste. Bemaßung nutzt „m / Rasterfeld".' }),
      bgIn,
    );
    root.appendChild(card);
    drawGrid(); renderDraw(); blit(); refresh();
    return root;
  }
  return { view };
})();
