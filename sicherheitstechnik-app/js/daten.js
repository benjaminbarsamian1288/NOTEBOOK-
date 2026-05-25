/* Datenübertragung verstehen – animierter Deep-Dive: Spannungsimpulse & Takt,
   Bandbreite, Bits→Bild, Störung/Reichweite. window.DATEN.view(). */
window.DATEN = (() => {
  const { el } = U;
  function loop(c, d) { function f(t) { if (!c.isConnected) return; d(t); requestAnimationFrame(f); } requestAnimationFrame(f); }
  function ro(label) { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v', text: '–' }); w.append(el('span', { class: 'phys-ro-l', text: label }), v); return { wrap: w, set: (t, c) => { v.textContent = t; v.className = 'phys-ro-v' + (c ? ' ' + c : ''); } }; }
  function vcard(o) {
    const c = el('div', { class: 'phys-card' });
    c.appendChild(el('div', { class: 'phys-head' }, [el('div', { class: 'phys-ico', html: `<i class="fas ${o.icon}"></i>` }), el('div', {}, [el('h3', { text: o.title }), el('div', { class: 'phys-sub', text: o.sub })])]));
    c.appendChild(el('div', { class: 'phys-explain' }, [el('div', { class: 'phys-ex-row', html: `<b>Was:</b> ${o.was}` }), el('div', { class: 'phys-ex-row', html: `<b>Im Detail:</b> ${o.detail}` }), el('div', { class: 'phys-ex-row', html: `<b>Praxis:</b> ${o.praxis}` })]));
    c.appendChild(o.body); return c;
  }
  const fmtbw = b => b >= 1e9 ? (b / 1e9).toFixed(b >= 1e10 ? 0 : 1) + ' Gbit/s' : b >= 1e6 ? (b / 1e6).toFixed(0) + ' Mbit/s' : b >= 1e3 ? (b / 1e3).toFixed(0) + ' kbit/s' : Math.round(b) + ' bit/s';
  const fmtT = s => s < 1e-3 ? (s * 1e6).toFixed(0) + ' µs' : s < 1 ? (s * 1e3).toFixed(0) + ' ms' : s < 90 ? s.toFixed(1) + ' s' : (s / 60).toFixed(1) + ' min';

  /* 1 · Spannungsimpulse & Takt */
  function spannungSim() {
    const W = 560, H = 300, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let byte = [1, 0, 1, 1, 0, 0, 1, 0], prog = 0, recv = [], speed = 1; const PER = 60;
    function rnd() { byte = Array.from({ length: 8 }, () => Math.random() < 0.5 ? 0 : 1); prog = 0; recv = []; }
    function lamp(x, y, on, col) { if (on) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 26; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fill(); ctx.restore(); } else { ctx.fillStyle = '#16202f'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fill(); ctx.stroke(); } }
    function draw() {
      prog += speed / PER; const bi = Math.floor(prog), frac = prog - bi;
      if (bi < 8 && frac > 0.82 && recv.length === bi) recv.push(byte[bi]);
      while (recv.length < Math.min(bi, 8)) recv.push(byte[recv.length]);
      if (prog > 9.2) { prog = 0; recv = []; }
      const cur = bi < 8 ? byte[bi] : null;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      if (bi < 8) { ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif'; ctx.fillText('Bit ' + (bi + 1) + ' von 8 wird gesendet:', W / 2, 22); ctx.fillStyle = cur ? '#fbbf24' : '#64748b'; ctx.font = '900 24px sans-serif'; ctx.fillText(cur ? '1  →  Strom AN  💡' : '0  →  Strom AUS  ⚫', W / 2, 50); }
      else { const dec = parseInt(recv.join(''), 2); const ch = dec >= 33 && dec < 127 ? String.fromCharCode(dec) : '·'; ctx.fillStyle = '#22c55e'; ctx.font = '900 19px sans-serif'; ctx.fillText('✓ 8 Bit = 1 Byte = Zahl ' + dec + ' = „' + ch + '"', W / 2, 44); }
      const sx = 70, rx = W - 70, wy = 95;
      ctx.strokeStyle = '#3a3320'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(sx + 16, wy); ctx.lineTo(rx - 16, wy); ctx.stroke();
      ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx + 16, wy); ctx.lineTo(rx - 16, wy); ctx.stroke();
      if (bi < 8) { const px = sx + 16 + (rx - sx - 32) * frac; if (cur) { ctx.save(); ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 18; ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(px, wy, 8, 0, 7); ctx.fill(); ctx.restore(); } else { ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, wy, 7, 0, 7); ctx.stroke(); } }
      lamp(sx, wy, cur === 1, '#fbbf24'); lamp(rx, wy, bi < 8 && frac > 0.82 && cur === 1, '#22c55e');
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Sender', sx, wy + 32); ctx.fillText('Empfänger', rx, wy + 32);
      ctx.textAlign = 'left'; ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.fillText('Byte:', 24, 146);
      for (let i = 0; i < 8; i++) { const x = 78 + i * 50; ctx.fillStyle = i === bi ? (cur ? '#3a2f10' : '#1e293b') : '#16202f'; ctx.fillRect(x - 14, 150, 28, 26); if (i === bi) { ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.strokeRect(x - 14, 150, 28, 26); } ctx.fillStyle = i <= bi ? '#e2e8f0' : '#475569'; ctx.textAlign = 'center'; ctx.font = 'bold 14px monospace'; ctx.fillText(byte[i], x, 168); }
      ctx.textAlign = 'left'; ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.fillText('empfangen:', 24, 198);
      for (let i = 0; i < 8; i++) { const x = 78 + i * 50; ctx.fillStyle = i < recv.length ? '#14331f' : '#16202f'; ctx.fillRect(x - 14, 202, 28, 26); ctx.strokeStyle = 'rgba(34,197,94,0.3)'; ctx.lineWidth = 1; ctx.strokeRect(x - 14, 202, 28, 26); ctx.fillStyle = '#22c55e'; ctx.textAlign = 'center'; ctx.font = 'bold 14px monospace'; ctx.fillText(i < recv.length ? recv[i] : '', x, 220); }
      ctx.textAlign = 'left'; ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.fillText('als Spannung (1 = hoch, 0 = tief):', 24, 250);
      const gy = 284, gh = 24; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath(); let stt = false;
      for (let i = 0; i < recv.length; i++) { const x0 = 78 + i * 50 - 14, x1 = x0 + 28, y = recv[i] ? gy - gh : gy; stt ? ctx.lineTo(x0, y) : (ctx.moveTo(x0, y), stt = true); ctx.lineTo(x1, y); } ctx.stroke();
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn primary', html: '<i class="fas fa-shuffle"></i> Neues Byte senden' }); b.addEventListener('click', rnd);
    const sp = el('input', { type: 'range', min: '0.4', max: '3', step: '0.2', value: '1', class: 'phys-slider' }); sp.addEventListener('input', () => speed = +sp.value);
    return vcard({ icon: 'fa-lightbulb', title: '1 · Was ist ein Bit? (Strom an / aus)', sub: 'Ganz einfach: 1 = an, 0 = aus',
      was: 'Ein <b>Bit</b> ist die kleinste Information – nur <b>0 oder 1</b>. Stell es dir wie einen Lichtschalter vor: <b>1 = Strom AN</b> 💡, <b>0 = Strom AUS</b> ⚫. Der Sender schaltet, der Empfänger schaut: leuchtet es (1) oder nicht (0)?',
      detail: 'Bit für Bit wandert ein kleiner Strom-Puls durchs Kabel. <b>8 Bit = 1 Byte</b> = eine Zahl von 0 bis 255 = z. B. ein Buchstabe. „AN/AUS" ist technisch nur eine höhere/niedrigere <b>Spannung</b> – siehst du unten als Treppen-Kurve.',
      praxis: 'Alles Digitale – Bild, Ton, Text – besteht am Ende aus ganz vielen 0/1. Mit dem <b>Tempo</b>-Regler langsamer stellen und Bit für Bit zuschauen.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b]), el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Tempo' }), sp])]) });
  }

  /* 2 · Bandbreite */
  function bandbreiteSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let v = 62, t = 0, fill = 0; // slider 0..100
    const bps = () => Math.pow(10, 3 + v / 100 * 6); // 1 kbit/s .. 1 Gbit/s
    const roBw = ro('Bandbreite'), roFoto = ro('1 Foto (3 MB)'), roVid = ro('1 Min Video (60 MB)');
    function draw() {
      t += 2; const B = bps(); const bitsInWindow = Math.max(2, Math.min(64, Math.round(2 + v / 100 * 60)));
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Mehr Bandbreite = mehr Impulse pro Sekunde durch dieselbe Leitung', W / 2, 26);
      // Impulsdichte
      const L = 30, R = W - 30, y = 70, bw = (R - L) / bitsInWindow;
      ctx.save(); ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 8; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= bitsInWindow; i++) { const bit = (Math.floor((t / 6) + i)) % 2; const x0 = L + i * bw, x1 = x0 + bw, yy = bit ? y - 22 : y + 14; i ? ctx.lineTo(x0, yy) : ctx.moveTo(x0, yy); ctx.lineTo(Math.min(x1, R), yy); } ctx.stroke(); ctx.restore();
      // Datei-Transfer-Balken (Tempo ~ Bandbreite, visuell)
      fill += (0.004 + v / 100 * 0.05); if (fill > 1) fill = 0;
      ctx.fillStyle = 'rgba(148,163,184,0.15)'; ctx.fillRect(40, 150, W - 80, 26); ctx.fillStyle = '#22c55e'; ctx.fillRect(40, 150, (W - 80) * fill, 26);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('📷 Foto wird übertragen … ' + Math.round(fill * 100) + '%', W / 2, 168);
      ctx.fillStyle = '#22d3ee'; ctx.font = '900 30px sans-serif'; ctx.fillText(fmtbw(B), W / 2, 220);
      const fotoBits = 3e6 * 8, vidBits = 60e6 * 8;
      roBw.set(fmtbw(B)); roFoto.set(fmtT(fotoBits / B), fotoBits / B < 1 ? 'ok' : 'warn'); roVid.set(fmtT(vidBits / B), vidBits / B < 5 ? 'ok' : 'warn');
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '0', max: '100', value: '62', class: 'phys-slider' }); s.addEventListener('input', () => v = +s.value);
    return vcard({ icon: 'fa-gauge-high', title: '2 · Bandbreite – wie schnell?', sub: 'bit/s · kbit/s · Mbit/s · Gbit/s',
      was: 'Die <b>Bandbreite</b> sagt, wie viele Bits pro Sekunde durch die Leitung passen. Mehr Bandbreite = schnellere Übertragung und höhere Auflösung/Bildrate möglich.',
      detail: 'Gemessen in <b>bit/s</b>: 1.000 = 1 kbit/s (Kilobit), 1.000.000 = 1 Mbit/s (Megabit), 1.000.000.000 = 1 Gbit/s (Gigabit). Übertragungsdauer = <b>Datenmenge ÷ Bandbreite</b>. Ein 3-MB-Foto sind 24 Millionen Bit – bei 24 Mbit/s also ~1 Sekunde, bei 1 Mbit/s ~24 Sekunden.',
      praxis: 'Viele/hochauflösende Kameras brauchen viel Bandbreite. Reicht sie nicht, ruckelt das Bild oder die Qualität sinkt. Schieb den Regler und sieh Foto-/Video-Dauer.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Bandbreite' }), s]), el('div', { class: 'phys-ros' }, [roBw.wrap, roFoto.wrap, roVid.wrap])]) });
  }

  /* 3 · Bits → Bild */
  function bildSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const cols = 28, rows = 18, total = cols * rows; let reveal = 0, speedV = 40;
    function px(i) { return { c: i % cols, r: (i / cols) | 0 }; }
    function shield(c, r) { const x = (c + 0.5) / cols, y = (r + 0.5) / rows; const dx = (x - 0.5) * 1.6; const top = y < 0.55 ? dx * dx + (y - 0.18) * (y - 0.18) * 3 < 0.16 : (Math.abs(dx) < (1 - (y - 0.55) / 0.45) * 0.5); return top; }
    function draw() {
      reveal += 0.2 + speedV / 100 * 6; if (reveal > total + 40) reveal = 0;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const gx = 150, gy = 30, cw = 240 / cols, ch = 220 / rows;
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('So baut sich ein Bild Pixel für Pixel auf:', 20, 22);
      for (let i = 0; i < Math.min(total, reveal | 0); i++) { const p = px(i); ctx.fillStyle = shield(p.c, p.r) ? '#22d3ee' : '#16243a'; ctx.fillRect(gx + p.c * cw, gy + p.r * ch, cw - 0.5, ch - 0.5); }
      // aktueller Schreibkopf
      if (reveal < total) { const p = px(reveal | 0); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.strokeRect(gx + p.c * cw, gy + p.r * ch, cw, ch); }
      const pct = Math.min(100, Math.round(reveal / total * 100));
      ctx.fillStyle = '#22d3ee'; ctx.font = '900 22px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(pct + '%', 40, 90); ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText('empfangen', 40, 108);
      ctx.fillStyle = '#cbd5e1'; ctx.font = '11px sans-serif'; ctx.fillText('Jeder Pixel = Bits.', 20, 150); ctx.fillText('Sie kommen nach-', 20, 166); ctx.fillText('einander an –', 20, 182); ctx.fillText('mehr Bandbreite', 20, 198); ctx.fillText('= schneller fertig.', 20, 214);
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '5', max: '100', value: '40', class: 'phys-slider' }); s.addEventListener('input', () => speedV = +s.value);
    return vcard({ icon: 'fa-image', title: '3 · Von Bits zum Bild', sub: 'Pixel für Pixel über die Leitung',
      was: 'Ein Bild besteht aus vielen Pixeln, jeder Pixel aus Bits. Diese Bits kommen nacheinander an – das Bild baut sich Stück für Stück auf.',
      detail: 'Erst werden die Bits zu Bytes, die Bytes zu Pixel-Farbwerten, die Pixel zum Bild zusammengesetzt. Je höher die <b>Bandbreite</b>, desto schneller sind alle Pixel da. Bei Video passiert das viele Male pro Sekunde (Bildrate).',
      praxis: 'Bei schwacher Verbindung siehst du das „Aufbauen" oder Verpixeln – die Daten kommen einfach zu langsam. Schieb das Tempo.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Tempo (Bandbreite)' }), s]), el('div', { class: 'phys-hint', text: '⟶ Mehr Tempo = das Bild ist schneller komplett.' })]) });
  }

  /* 4 · Störung & Reichweite */
  function stoerungSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let noise = 25, t = 0; const bits = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1];
    const roN = ro('Störpegel'), roErr = ro('Lesefehler');
    function draw() {
      t += 1; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const L = 30, R = W - 30, n = bits.length, bw = (R - L) / n, hi = 80, lo = 180, thr = 130;
      ctx.setLineDash([5, 4]); ctx.strokeStyle = 'rgba(251,191,36,0.6)'; ctx.beginPath(); ctx.moveTo(L, thr); ctx.lineTo(R, thr); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#fbbf24'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Schwelle', L, thr - 5);
      // Ideal (blass)
      ctx.strokeStyle = 'rgba(34,211,238,0.25)'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < n; i++) { const x0 = L + i * bw, x1 = x0 + bw, y = bits[i] ? hi : lo; i ? ctx.lineTo(x0, y) : ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
      // Verrauscht (gedämpft + Rauschen)
      const att = 1 - noise / 140; let err = 0;
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i < n; i++) { const base = bits[i] ? hi : lo; const mid = (hi + lo) / 2; const damp = mid + (base - mid) * att; for (let s2 = 0; s2 <= 8; s2++) { const x = L + i * bw + s2 / 8 * bw; const yv = damp + (Math.random() - 0.5) * noise * 1.6; (i === 0 && s2 === 0) ? ctx.moveTo(x, yv) : ctx.lineTo(x, yv); } const read = (mid + (base - mid) * att) < thr ? 1 : 0; if (read !== bits[i]) err++; }
      ctx.stroke();
      // Abtastpunkte + Fehler markieren
      for (let i = 0; i < n; i++) { const base = bits[i] ? hi : lo; const mid = (hi + lo) / 2; const damp = mid + (base - mid) * att; const read = damp < thr ? 1 : 0; const x = L + (i + 0.5) * bw; ctx.fillStyle = read === bits[i] ? '#22c55e' : '#ef4444'; ctx.beginPath(); ctx.arc(x, damp, 5, 0, 7); ctx.fill(); if (read !== bits[i]) { ctx.fillStyle = '#ef4444'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✗', x, damp - 9); } }
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('blass = ideales Signal · hell = real (gedämpft + Rauschen)', L, 215);
      roN.set(noise + ' %'); roErr.set(err + ' von ' + n + (err ? ' Bit falsch' : ''), err ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '0', max: '90', value: '25', class: 'phys-slider' }); s.addEventListener('input', () => noise = +s.value);
    return vcard({ icon: 'fa-bolt', title: '4 · Störung, Dämpfung & Reichweite', sub: 'Warum Bandbreite begrenzt ist',
      was: 'Auf langen oder schlechten Leitungen werden die Spannungspulse schwächer (<b>Dämpfung</b>) und von <b>Störungen/Rauschen</b> überlagert. Dann liest der Empfänger Bits falsch.',
      detail: 'Je höher die Bandbreite (schnellere/engere Pulse), desto empfindlicher reagiert das Signal auf Dämpfung und Störungen – die Pegel verwischen und können die Schwelle falsch überschreiten → <b>Bitfehler</b>. Deshalb gibt es Reichweiten-Grenzen (z. B. Netzwerkkabel ~100 m, Koax ~300 m) und Glasfaser für weite Strecken.',
      praxis: 'Gegenmittel: kürzere/bessere Kabel, geschirmte Leitungen, Repeater/Switches, Glasfaser. Prüfsummen erkennen Fehler und fordern erneutes Senden an. Dreh den Störpegel hoch und beobachte die roten Lesefehler.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Störpegel / Kabellänge' }), s]), el('div', { class: 'phys-ros' }, [roN.wrap, roErr.wrap])]) });
  }

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Datenübertragung verstehen</span>
      <h1>Wie Daten durchs Kabel reisen ⚡</h1>
      <p class="lead">Vier animierte Stationen erklären es Schritt für Schritt: <b>Spannungsimpulse & Takt</b> (wie 0/1 zu Spannung werden),
      <b>Bandbreite</b> (wie schnell, in bit/s), <b>Bits → Bild</b> (wie ein Bild ankommt) und <b>Störung & Reichweite</b> (warum es Grenzen gibt) – mit <b>Was · Im Detail · Praxis</b>.</p>`;
    root.appendChild(intro);
    const g = el('div', { class: 'phys-grid' });
    [spannungSim(), bandbreiteSim(), bildSim(), stoerungSim()].forEach(s => g.appendChild(s));
    root.appendChild(g);
    return root;
  }
  return { view };
})();
