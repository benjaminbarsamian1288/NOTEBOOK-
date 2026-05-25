/* Animierte Übersichten für RC-Widerstandsklassen (DIN EN 1627) und
   VdS-Sicherungsklassen (SÜ). window.KLASSENVIS.overview(d) → DOM-Knoten.
   Liest die echten Daten aus d.sicherungsklassen. */
window.KLASSENVIS = (() => {
  const { el } = U;
  function loop(c, d) { function f(t) { if (!c.isConnected) return; d(t); requestAnimationFrame(f); } requestAnimationFrame(f); }
  function ro(label) { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v', text: '–' }); w.append(el('span', { class: 'phys-ro-l', text: label }), v); return { wrap: w, set: t => v.textContent = t || '–' }; }
  const num = s => { const m = (s || '').match(/\d+/); return m ? +m[0] : 0; };

  /* ---------- RC-Widerstandsklassen ---------- */
  function rcCard(d) {
    const tbl = d.sicherungsklassen.tables.find(t => /RC|Widerstand/i.test(t.title));
    if (!tbl) return el('div');
    const tools = ['👊', '🔧', '🪛', '⛏️', '🔨', '🪚', '⚡'];
    const rc = tbl.rows.map((r, i) => ({
      name: r['RC-Klasse'], zeit: r['Widerstandszeit'] || '—', min: num(r['Widerstandszeit']),
      taeter: r['Tätertyp'], werk: r['Werkzeuge'], glas: r['Verglasung'], anw: r['Typische Anwendung'],
      pol: r['Polizei-Empf.'], preis: r['Richtpreis Tür (€)'], tool: tools[Math.min(i, tools.length - 1)],
    }));
    let si = Math.min(2, rc.length - 1), p = 0, t = 0;
    const W = 560, H = 250, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const roT = ro('Tätertyp'), roW = ro('Werkzeuge'), roG = ro('Verglasung'), roA = ro('Anwendung'), roP = ro('Richtpreis Tür');
    function setInfo() { const r = rc[si]; roT.set(r.taeter); roW.set(r.werk); roG.set(r.glas); roA.set(r.anw); roP.set(r.preis ? r.preis + ' €' : '–'); }
    function draw() {
      t += 0.05; const r = rc[si]; const dur = Math.max(1.0, r.min * 0.5);
      p += 1 / (dur * 60); let breached = p >= 1; if (p >= 1.25) p = 0;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Tür
      const dx = 330, dy = 40, dw = 150, dh = 170;
      ctx.fillStyle = breached ? '#3b1010' : '#3a2a18'; ctx.fillRect(dx, dy, dw, dh);
      ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 4; ctx.strokeRect(dx, dy, dw, dh);
      ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(dx + dw - 22, dy + dh / 2, 6, 0, 7); ctx.fill();
      // Widerstands-Schild (schrumpft)
      const shieldH = dh * Math.max(0, 1 - Math.min(1, p));
      ctx.fillStyle = breached ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.35)'; ctx.fillRect(dx, dy + (dh - shieldH), dw, shieldH);
      if (breached) { ctx.fillStyle = '#ef4444'; ctx.font = '34px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('💥', dx + dw / 2, dy + dh / 2 + 12); }
      // Werkzeug/Täter schlägt
      const hit = breached ? 0 : Math.abs(Math.sin(t * 4)) * 18; ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🥷', dx - 70, dy + dh / 2 + 14);
      ctx.font = '30px sans-serif'; ctx.fillText(r.tool, dx - 30 + hit, dy + dh / 2 + 10);
      // Große Widerstandszeit
      ctx.fillStyle = '#22d3ee'; ctx.font = '900 26px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(r.name, 24, 50);
      ctx.fillStyle = '#fbbf24'; ctx.font = '900 30px sans-serif'; ctx.fillText('⏱ ' + (r.min ? r.min + ' Min' : 'kein Schutz'), 24, 92);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.fillText('hält den Einbrecher auf', 24, 112);
      ctx.fillStyle = '#cbd5e1'; ctx.font = '12px sans-serif'; ctx.fillText(breached ? 'durchbrochen → erneuter Versuch' : 'Widerstand …', 24, 150);
      ctx.fillStyle = '#475569'; ctx.fillText('Polizei-Empfehlung: ' + (r.pol || '—'), 24, 200);
    }
    loop(canvas, draw); setInfo();
    const btns = rc.map((r, i) => { const b = el('button', { class: 'btn' + (i === si ? ' primary' : ''), text: r.name }); b.addEventListener('click', () => { si = i; p = 0; setInfo(); row.querySelectorAll('.btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const row = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns);
    // Leiter aller RC mit Zeitbalken
    const ladder = el('div', { class: 'kv-ladder' });
    const maxMin = Math.max(...rc.map(r => r.min), 20);
    rc.forEach(r => { const rr = el('div', { class: 'kv-lrow' }); rr.append(el('span', { class: 'kv-lname', text: r.name }), (() => { const bar = el('div', { class: 'kv-lbar' }); const f = el('div', { class: 'kv-lfill', style: `width:${(r.min / maxMin * 100).toFixed(0)}%` }); bar.appendChild(f); return bar; })(), el('span', { class: 'kv-lval', text: r.zeit })); ladder.appendChild(rr); });

    const c = el('div', { class: 'phys-card phys-card-wide' });
    c.appendChild(el('div', { class: 'phys-head' }, [el('div', { class: 'phys-ico', html: '<i class="fas fa-stopwatch"></i>' }), el('div', {}, [el('h3', { text: 'RC-Widerstandsklassen (DIN EN 1627)' }), el('div', { class: 'phys-sub', text: 'Wie lange hält die Tür dem Einbrecher stand?' })])]));
    c.appendChild(el('div', { class: 'phys-explain' }, [el('div', { class: 'phys-ex-row', html: '<b>RC = Resistance Class</b> (Widerstandsklasse). Sie sagt, wie lange Tür/Fenster einem Aufbruch mit bestimmten Werkzeugen <b>standhalten</b> – je höher, desto länger und desto schwereres Werkzeug nötig. Wähle eine Klasse und sieh den Angriff.' })]));
    c.appendChild(el('div', { class: 'kv-split' }, [canvas, el('div', { class: 'phys-ros kv-rcinfo' }, [roT.wrap, roW.wrap, roG.wrap, roA.wrap, roP.wrap])]));
    c.append(row, el('div', { class: 'scene-panel-h', text: 'Alle Klassen · Widerstandszeit' }), ladder);
    return c;
  }

  /* ---------- VdS-Sicherungsklassen SÜ ---------- */
  function sueCard(d) {
    const tbl = d.sicherungsklassen.tables.find(t => /Sicherungsklass/i.test(t.title)) || d.sicherungsklassen.tables[0];
    const sue = tbl.rows.map(r => ({ name: r['Sicherungsklasse'], risk: r['Risikograd'], besch: r['Beschreibung'], ema: r['EMA-Grad (EN 50131)'], rc: r['Min. RC-Tür'], nsl: r['NSL-Aufschaltung'], interv: r['Empf. Intervention'], obj: r['Beispiel-Objekte'], vers: r['Versicherung'] }));
    let si = 0;
    const W = 560, H = 250, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const cols = ['#22c55e', '#84cc16', '#fbbf24', '#f97316', '#ef4444', '#dc2626'];
    const roR = ro('Risiko'), roE = ro('EMA-Grad'), roC = ro('Min. RC-Tür'), roN = ro('NSL-Aufschaltung'), roI = ro('Intervention'), roV = ro('Versicherung');
    function setInfo() { const s = sue[si]; roR.set(s.risk); roE.set(s.ema); roC.set(s.rc); roN.set(s.nsl); roI.set(s.interv); roV.set(s.vers); }
    let t = 0;
    function draw() {
      t += 0.05; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const n = sue.length, bw = (W - 40) / n, base = H - 30;
      sue.forEach((s, i) => {
        const h = 40 + (i + 1) / n * 150; const x = 20 + i * bw, c = cols[Math.min(i, 5)]; const on = i === si;
        ctx.fillStyle = on ? c : c + '55'; if (on) { ctx.shadowColor = c; ctx.shadowBlur = 16 + Math.sin(t * 3) * 4; } ctx.fillRect(x + 6, base - h, bw - 12, h); ctx.shadowBlur = 0;
        ctx.fillStyle = '#0b1424'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🛡', x + bw / 2, base - h + 20);
        ctx.fillStyle = on ? '#fff' : '#94a3b8'; ctx.font = (on ? 'bold ' : '') + '12px sans-serif'; ctx.fillText('SÜ ' + (i + 1), x + bw / 2, base + 18);
      });
      ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('geringes Risiko', 22, 26); ctx.textAlign = 'right'; ctx.fillText('hohes Risiko →', W - 22, 26);
    }
    loop(canvas, draw); setInfo();
    canvas.addEventListener('click', e => { const r = canvas.getBoundingClientRect(); const x = (e.clientX - r.left) * W / r.width; const n = sue.length, bw = (W - 40) / n; const i = Math.floor((x - 20) / bw); if (i >= 0 && i < n) { si = i; setInfo(); btnRow.querySelectorAll('.btn').forEach((b, j) => b.className = 'btn' + (j === i ? ' primary' : '')); } });
    const btns = sue.map((s, i) => { const b = el('button', { class: 'btn' + (i === si ? ' primary' : ''), text: 'SÜ ' + (i + 1) }); b.addEventListener('click', () => { si = i; setInfo(); btnRow.querySelectorAll('.btn').forEach((x, j) => x.className = 'btn' + (j === i ? ' primary' : '')); }); return b; });
    const btnRow = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns);

    const c = el('div', { class: 'phys-card phys-card-wide' });
    c.appendChild(el('div', { class: 'phys-head' }, [el('div', { class: 'phys-ico', html: '<i class="fas fa-medal"></i>' }), el('div', {}, [el('h3', { text: 'VdS-Sicherungsklassen SÜ 1–6 (VdS 2333)' }), el('div', { class: 'phys-sub', text: 'Welches Schutzniveau für welches Objekt?' })])]));
    c.appendChild(el('div', { class: 'phys-explain' }, [el('div', { class: 'phys-ex-row', html: '<b>SÜ = Sicherungsklasse</b> (Sicherungsüberprüfung nach VdS 2333). Sie ordnet einem Objekt je nach Risiko ein Schutzniveau zu – mit passendem EMA-Grad, Mindest-RC-Tür, NSL-Aufschaltung und Intervention. Klick eine Stufe.' })]));
    c.appendChild(el('div', { class: 'kv-split' }, [canvas, el('div', { class: 'phys-ros kv-rcinfo' }, [roR.wrap, roE.wrap, roC.wrap, roN.wrap, roI.wrap, roV.wrap])]));
    c.appendChild(btnRow);
    const beisp = el('div', { class: 'phys-hint' }); const upd = () => beisp.textContent = '🏠 Beispiel-Objekte: ' + (sue[si].obj || '–'); upd();
    btns.forEach((b, i) => b.addEventListener('click', upd)); canvas.addEventListener('click', upd);
    c.appendChild(beisp);
    return c;
  }

  function overview(d) {
    const wrap = el('div', { class: 'phys-view', style: 'margin-bottom:8px' });
    const grid = el('div', { class: 'phys-grid' });
    try { grid.appendChild(rcCard(d)); grid.appendChild(sueCard(d)); } catch (e) { /* Daten unerwartet → still überspringen */ }
    wrap.appendChild(grid);
    return wrap;
  }
  return { overview };
})();
