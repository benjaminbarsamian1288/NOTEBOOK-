/* Wellen & Signale – wie aus einer einfachen Nachricht Bits, Spannungs-
   impulse und elektromagnetische Wellen werden. window.WELLEN.view().
   Drei interaktive, animierte Stationen mit echtem Texteingabe-Beispiel. */
window.WELLEN = (() => {
  const { el } = U;
  const C = 299792458; // Lichtgeschwindigkeit m/s

  function loop(canvas, draw) {
    function f() { if (!canvas.isConnected) return; draw(); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  function ro(label) {
    const w = el('div', { class: 'phys-ro' });
    const v = el('span', { class: 'phys-ro-v', text: '–' });
    w.append(el('span', { class: 'phys-ro-l', text: label }), v);
    return { wrap: w, set: (t, c) => { v.textContent = t; v.className = 'phys-ro-v' + (c ? ' ' + c : ''); } };
  }
  function vcard(o) {
    const c = el('div', { class: 'phys-card' + (o.wide ? ' phys-card-wide' : '') });
    c.appendChild(el('div', { class: 'phys-head' }, [
      el('div', { class: 'phys-ico', html: `<i class="fas ${o.icon}"></i>` }),
      el('div', {}, [el('h3', { text: o.title }), el('div', { class: 'phys-sub', text: o.sub })]),
    ]));
    c.appendChild(el('div', { class: 'phys-explain' }, [
      el('div', { class: 'phys-ex-row', html: `<b>Was:</b> ${o.was}` }),
      el('div', { class: 'phys-ex-row', html: `<b>Im Detail:</b> ${o.detail}` }),
      el('div', { class: 'phys-ex-row', html: `<b>Praxis:</b> ${o.praxis}` }),
    ]));
    c.appendChild(o.body);
    return c;
  }
  const cleanMsg = s => s.replace(/[^\x20-\x7E]/g, '').slice(0, 6) || 'Hi';
  const toBin = code => code.toString(2).padStart(8, '0');
  function buildBits(msg) {
    const bits = [];
    for (const ch of msg) {
      const code = ch.charCodeAt(0), b = toBin(code);
      for (let i = 0; i < 8; i++) bits.push({ v: +b[i], ch, code, bin: b, k: i });
    }
    return bits;
  }
  const fmtLambda = m => m >= 1000 ? (m / 1000).toFixed(m >= 1e4 ? 0 : 1) + ' km'
    : m >= 1 ? m.toFixed(m >= 10 ? 0 : 2) + ' m'
    : m >= 1e-3 ? (m * 1e3).toFixed(m >= 1e-2 ? 0 : 1) + ' mm'
    : m >= 1e-6 ? (m * 1e6).toFixed(m >= 1e-5 ? 0 : 1) + ' µm'
    : (m * 1e9).toFixed(0) + ' nm';
  const fmtHz = f => f >= 1e12 ? (f / 1e12).toFixed(0) + ' THz'
    : f >= 1e9 ? (f / 1e9).toFixed(f >= 1e10 ? 0 : 1) + ' GHz'
    : f >= 1e6 ? (f / 1e6).toFixed(f >= 1e7 ? 0 : 1) + ' MHz'
    : f >= 1e3 ? (f / 1e3).toFixed(0) + ' kHz' : Math.round(f) + ' Hz';

  /* ============ 1 · Nachricht → Bits → Impulse auf der Leitung ============ */
  function leitungSim() {
    const W = 580, H = 360, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const state = { msg: 'Hi', bits: [], pos: 0, speed: 1, playing: true };
    const PER = 55;
    const rebuild = () => { state.bits = buildBits(state.msg); state.pos = 0; };
    rebuild();

    function draw() {
      const total = state.bits.length;
      if (state.playing) state.pos += state.speed / PER;
      if (state.pos >= total + 1.6) state.pos = 0;
      const bi = Math.floor(state.pos), frac = state.pos - bi;
      const done = bi >= total;
      const cIdx = Math.min(Math.floor(bi / 8), state.msg.length - 1);
      const kBit = done ? 8 : bi - cIdx * 8;
      const curBin = state.bits[Math.min(bi, total - 1)].bin;
      const curCh = state.msg[cIdx], curCode = state.msg.charCodeAt(cIdx);
      const cur = done ? null : state.bits[bi].v;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'left';

      // Kopfzeile: Nachricht + Fortschritt
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif';
      ctx.fillText('Nachricht: ', 24, 24);
      ctx.fillStyle = '#22d3ee'; ctx.font = '900 14px monospace';
      ctx.fillText('"' + state.msg + '"', 100, 24);
      ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(done ? 'fertig ✓' : 'Zeichen ' + (cIdx + 1) + ' / ' + state.msg.length, W - 24, 24);
      ctx.textAlign = 'left';

      // Pipeline: Zeichen → ASCII → Binär
      ctx.fillStyle = '#e2e8f0'; ctx.font = '900 22px monospace';
      ctx.fillText("'" + curCh + "'", 24, 60);
      ctx.fillStyle = '#475569'; ctx.font = '16px sans-serif'; ctx.fillText('→', 64, 58);
      ctx.fillStyle = '#fbbf24'; ctx.font = '900 18px monospace'; ctx.fillText('ASCII ' + curCode, 88, 60);
      ctx.fillStyle = '#475569'; ctx.font = '16px sans-serif'; ctx.fillText('→', 210, 58);
      // Binär gross, aktuelles Bit hervorgehoben
      const bx = 238;
      for (let i = 0; i < 8; i++) {
        const on = !done && i === kBit;
        ctx.fillStyle = on ? '#22d3ee' : '#cbd5e1';
        ctx.font = (on ? '900 ' : 'bold ') + '20px monospace';
        ctx.fillText(curBin[i], bx + i * 18, 60);
      }

      // Leitung mit Sender/Empfänger
      const sx = 80, rx = W - 80, wy = 120;
      ctx.fillStyle = '#16202f'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.fillRect(sx - 38, wy - 26, 50, 52); ctx.strokeRect(sx - 38, wy - 26, 50, 52);
      ctx.fillRect(rx - 12, wy - 26, 50, 52); ctx.strokeRect(rx - 12, wy - 26, 50, 52);
      ctx.fillStyle = '#94a3b8'; ctx.font = '24px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('📤', sx - 13, wy + 8); ctx.fillText('📥', rx + 13, wy + 8);
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
      ctx.fillText('Sender', sx - 13, wy + 40); ctx.fillText('Empfänger', rx + 13, wy + 40);
      // Kabel
      ctx.strokeStyle = '#3a3320'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(sx + 12, wy); ctx.lineTo(rx - 12, wy); ctx.stroke();
      ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx + 12, wy); ctx.lineTo(rx - 12, wy); ctx.stroke();
      // Lampe am Sender
      if (cur === 1) { ctx.save(); ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 22; ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(sx + 12, wy, 9, 0, 7); ctx.fill(); ctx.restore(); }
      // Wanderpuls
      if (!done) {
        const px = sx + 12 + (rx - sx - 24) * frac;
        if (cur === 1) { ctx.save(); ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 18; ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(px, wy, 8, 0, 7); ctx.fill(); ctx.restore(); }
        else { ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, wy, 6, 0, 7); ctx.stroke(); }
        // Bit-Wert über dem Puls
        ctx.fillStyle = cur ? '#fbbf24' : '#64748b'; ctx.font = '900 16px monospace'; ctx.textAlign = 'center';
        ctx.fillText(cur ? '1' : '0', px, wy - 16);
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
        ctx.fillText(cur ? 'Strom AN = hohe Spannung' : 'Strom AUS = tiefe Spannung', W / 2, wy - 36);
      } else {
        ctx.fillStyle = '#22c55e'; ctx.font = '900 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('✓ Nachricht komplett übertragen', W / 2, wy - 30);
      }
      ctx.textAlign = 'left';

      // Bit-Zellen des aktuellen Zeichens
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
      ctx.fillText('Bits von ' + "'" + curCh + "'" + ' (8 Bit = 1 Byte):', 24, 180);
      const cellW = 40, cy = 188, cx0 = 80;
      for (let i = 0; i < 8; i++) {
        const x = cx0 + i * cellW, on = !done && i === kBit, sent = done || i < kBit;
        ctx.fillStyle = on ? '#3a2f10' : (sent ? '#142033' : '#16202f');
        ctx.fillRect(x, cy, cellW - 6, 30);
        ctx.strokeStyle = on ? '#fbbf24' : '#22344d'; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(x, cy, cellW - 6, 30);
        ctx.fillStyle = sent || on ? (curBin[i] === '1' ? '#fbbf24' : '#cbd5e1') : '#475569';
        ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
        ctx.fillText(curBin[i], x + (cellW - 6) / 2, cy + 21);
      }
      ctx.textAlign = 'left';

      // Spannungs-Treppe (NRZ) – baut sich auf
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
      ctx.fillText('Spannung auf der Leitung (1 = hoch, 0 = tief):', 24, 252);
      const gy = 330, gh = 46, upto = done ? 8 : Math.min(kBit + (frac > 0.05 ? 1 : 0), 8);
      // Achse
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx0, gy); ctx.lineTo(cx0 + 8 * cellW - 6, gy); ctx.stroke();
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2.5; ctx.beginPath();
      let started = false;
      for (let i = 0; i < upto; i++) {
        const x0 = cx0 + i * cellW, x1 = x0 + cellW - 6, y = curBin[i] === '1' ? gy - gh : gy;
        if (!started) { ctx.moveTo(x0, y); started = true; } else ctx.lineTo(x0, y);
        ctx.lineTo(x1, y);
      }
      ctx.stroke();
      // High/Low Beschriftung
      ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('5V', cx0 - 6, gy - gh + 4); ctx.fillText('0V', cx0 - 6, gy + 4);

      // Empfangener Text
      ctx.textAlign = 'left'; ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
      ctx.fillText('empfangen & dekodiert:', 320, 252);
      const recv = state.msg.slice(0, done ? state.msg.length : cIdx);
      ctx.fillStyle = '#22c55e'; ctx.font = '900 18px monospace';
      ctx.fillText('"' + recv + (done ? '' : '▌') + '"', 320, 276);
    }
    loop(canvas, draw);

    // Steuerung
    const input = el('input', { class: 'wl-input', type: 'text', value: state.msg, maxlength: '6', placeholder: 'Text…' });
    input.addEventListener('input', () => { state.msg = cleanMsg(input.value); rebuild(); });
    const presetWrap = el('div', { class: 'wl-presets' });
    ['Hi', 'A', 'OK', 'SOS', '7'].forEach(p => {
      const b = el('button', { class: 'chip', text: p });
      b.addEventListener('click', () => { state.msg = p; input.value = p; rebuild(); });
      presetWrap.appendChild(b);
    });
    const send = el('button', { class: 'btn primary', html: '<i class="fas fa-paper-plane"></i> Senden' });
    send.addEventListener('click', () => { rebuild(); state.playing = true; pp.innerHTML = '<i class="fas fa-pause"></i> Pause'; });
    const pp = el('button', { class: 'btn', html: '<i class="fas fa-pause"></i> Pause' });
    pp.addEventListener('click', () => { state.playing = !state.playing; pp.innerHTML = state.playing ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Weiter'; });
    const sp = el('input', { type: 'range', min: '0.3', max: '3', step: '0.1', value: '1', class: 'phys-slider' });
    sp.addEventListener('input', () => state.speed = +sp.value);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'wl-inputrow' }, [el('label', { text: 'Deine Nachricht:' }), input, presetWrap]),
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [send, pp]),
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Tempo' }), sp]),
    ]);
    return vcard({
      icon: 'fa-paper-plane', wide: true,
      title: '1 · Von der Nachricht zum Impuls auf der Leitung',
      sub: 'Tippe ein Wort – sieh, wie es als Strom-Impulse durchs Kabel reist',
      was: 'Ein <b>Bit</b> ist wie ein <b>Lichtschalter</b>: <b>1 = Licht an</b> 💡, <b>0 = Licht aus</b> ⚫. Mehr nicht.',
      detail: 'Tippe ein Wort. Jeder Buchstabe ist eine <b>Zahl</b> (z. B. „H" = 72). Die Zahl wird zu <b>8 Schaltern</b> (8 Bit). Diese Schalter schicken kleine <b>Strom-Blitze</b> übers Kabel: <b>Blitz da = 1</b>, <b>keiner = 0</b>.',
      praxis: 'So reden Melder, Zentrale und Bedienteil miteinander. Stell das Tempo langsam – dann siehst du jeden Blitz einzeln.',
      body,
    });
  }

  /* ============ 2 · Elektromagnetische Welle ============ */
  function emWelleSim() {
    const W = 580, H = 320, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let sv = 45, t = 0; // slider 0..100
    const fOf = s => Math.pow(10, 5 + s / 100 * 10); // 100 kHz .. 1 PHz
    const bandOf = f => f < 3e9 ? { n: 'Funk / Radio', c: '#22c55e' }
      : f < 3e11 ? { n: 'Mikrowelle', c: '#fbbf24' }
      : f < 4e14 ? { n: 'Infrarot (Wärme)', c: '#f97316' }
      : f < 8e14 ? { n: 'Sichtbares Licht', c: '#a855f7' }
      : { n: 'UV / Röntgen', c: '#ef4444' };
    const useOf = f => f < 1e6 ? 'Langwelle, U-Boot-Funk'
      : f < 5e8 ? '433/868 MHz – Funk-Melder, Handsender'
      : f < 6e9 ? '2,4/5 GHz – WLAN, Bluetooth, DECT'
      : f < 3e11 ? 'Radar, Richtfunk, 5G mmWave'
      : f < 4e14 ? 'IR-Bewegungsmelder, Fernbedienung, Wärmebild'
      : f < 8e14 ? 'Lichtschranke, Kamera, sichtbares Licht'
      : 'UV-Prüfung, Röntgen-Scanner';
    const roF = ro('Frequenz f'), roL = ro('Wellenlänge λ'), roC = ro('Tempo c'), roB = ro('Bereich'), roU = ro('Anwendung');

    function draw() {
      t += 0.04;
      const f = fOf(sv), lambda = C / f, band = bandOf(f);
      roF.set(fmtHz(f)); roL.set(fmtLambda(lambda)); roC.set('300.000 km/s');
      roB.set(band.n, band.c === '#22c55e' ? 'ok' : band.c === '#ef4444' ? 'bad' : 'warn');
      roU.set(useOf(f));

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const x0 = 60, x1 = W - 30, y0 = H / 2 + 10, A = 70;
      const cycles = 1.2 + sv / 100 * 6; // sichtbare Wellenzüge
      const k = cycles * 2 * Math.PI / (x1 - x0);
      const skewX = -16, skewY = 10; // Pseudo-3D für B-Feld (in die Tiefe)

      // Ausbreitungs-Achse
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('Ausbreitung →', x1, y0 + 26);

      // B-Feld (blau, in die Tiefe geneigt)
      ctx.strokeStyle = 'rgba(56,189,248,0.85)'; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = x0; x <= x1; x += 3) {
        const s = Math.sin(k * (x - x0) - t) * A * 0.6;
        const pxx = x + (s / A) * skewX, pyy = y0 - (s / A) * skewY; // in die Tiefe geneigt
        if (x === x0) ctx.moveTo(pxx, pyy); else ctx.lineTo(pxx, pyy);
      }
      ctx.stroke();

      // E-Feld (rot, vertikal) + Pfeile
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let x = x0; x <= x1; x += 2) {
        const y = y0 - Math.sin(k * (x - x0) - t) * A;
        if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(248,113,113,0.55)'; ctx.lineWidth = 1.5;
      for (let x = x0 + 14; x <= x1; x += 26) {
        const y = y0 - Math.sin(k * (x - x0) - t) * A;
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y); ctx.stroke();
      }

      // Eine Wellenlänge markieren
      const lamPx = (2 * Math.PI / k);
      const mx0 = x0 + 10, mx1 = x0 + 10 + lamPx;
      if (mx1 < x1) {
        ctx.strokeStyle = '#64748b'; ctx.setLineDash([4, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mx0, y0 - A - 14); ctx.lineTo(mx1, y0 - A - 14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx0, y0 - A - 18); ctx.lineTo(mx0, y0 - A - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx1, y0 - A - 18); ctx.lineTo(mx1, y0 - A - 10); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#94a3b8'; ctx.font = 'italic 12px serif'; ctx.textAlign = 'center';
        ctx.fillText('λ', (mx0 + mx1) / 2, y0 - A - 20);
      }

      // Legende
      ctx.textAlign = 'left'; ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#f87171'; ctx.fillText('— E-Feld (elektrisch)', x0, 24);
      ctx.fillStyle = '#38bdf8'; ctx.fillText('— B-Feld (magnetisch)', x0 + 160, 24);
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
      ctx.fillText('stehen senkrecht zueinander & schwingen im Takt', x0, 40);
    }
    loop(canvas, draw);

    const sp = el('input', { type: 'range', min: '0', max: '100', step: '1', value: String(sv), class: 'phys-slider' });
    sp.addEventListener('input', () => sv = +sp.value);
    const presets = el('div', { class: 'wl-presets' });
    [['433 MHz Funk-Melder', 433e6], ['2,4 GHz WLAN', 2.4e9], ['IR-Melder', 3e13], ['Licht', 5.5e14]].forEach(([lbl, f]) => {
      const b = el('button', { class: 'chip', text: lbl });
      b.addEventListener('click', () => { sv = (Math.log10(f) - 5) / 10 * 100; sp.value = String(sv); });
      presets.appendChild(b);
    });
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ros' }, [roF.wrap, roL.wrap, roC.wrap, roB.wrap, roU.wrap]),
      el('div', { class: 'wl-inputrow' }, [el('label', { text: 'Sprung zu:' }), presets]),
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Frequenz' }), sp]),
    ]);
    return vcard({
      icon: 'fa-wave-square', wide: true,
      title: '2 · Die elektromagnetische Welle',
      sub: 'Funk schickt dieselbe Information ohne Kabel – als Welle durch die Luft',
      was: 'Eine Welle ist <b>Energie, die durch die Luft schwingt</b> – wie Wellen im Wasser, nur unsichtbar. So funkt das Handy, das WLAN und die Fernbedienung.',
      detail: 'Sie wackelt <b>elektrisch (rot)</b> und <b>magnetisch (blau)</b> gleichzeitig. <b>Schnelles Wackeln = kurze Welle</b>, <b>langsames Wackeln = lange Welle</b>. Schieb am Regler und schau zu.',
      praxis: 'Funk-Melder wackeln 433 Millionen Mal pro Sekunde. WLAN sogar 2,4 Milliarden Mal. Licht noch viel öfter.',
      body,
    });
  }

  /* ============ 3 · Bits reiten auf der Welle (Modulation) ============ */
  function modSim() {
    const W = 580, H = 320, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let mode = 'ASK', t = 0, bits = [1, 0, 1, 1, 0, 1, 0, 0];
    function draw() {
      t += 0.05;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const x0 = 70, x1 = W - 20, n = bits.length, bw = (x1 - x0) / n;
      const lanes = [
        { y: 60, label: 'Daten-Bits (0/1)', col: '#fbbf24' },
        { y: 160, label: 'Trägerwelle (konstant)', col: '#64748b' },
        { y: 260, label: 'gesendetes Funk-Signal (' + mode + ')', col: '#22d3ee' },
      ];
      lanes.forEach(l => { ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(l.label, x0, l.y - 40); });

      // Bit-Trennlinien + Werte
      ctx.textAlign = 'center';
      for (let i = 0; i < n; i++) {
        const xc = x0 + i * bw + bw / 2;
        ctx.strokeStyle = '#13203a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0 + i * bw, 40); ctx.lineTo(x0 + i * bw, 300); ctx.stroke();
        ctx.fillStyle = bits[i] ? '#fbbf24' : '#475569'; ctx.font = 'bold 13px monospace';
        ctx.fillText(bits[i], xc, 34);
      }

      // 1) digitale Treppe
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const xa = x0 + i * bw, xb = xa + bw, y = bits[i] ? lanes[0].y - 26 : lanes[0].y + 26;
        if (i === 0) ctx.moveTo(xa, y); else ctx.lineTo(xa, y);
        ctx.lineTo(xb, y);
      }
      ctx.stroke();

      // 2) Träger (konstante Sinuswelle)
      const carK = 0.18;
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let x = x0; x <= x1; x += 2) { const y = lanes[1].y - Math.sin((x - x0) * carK - t * 3) * 28; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();

      // 3) moduliertes Signal
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
      let started = false;
      for (let x = x0; x <= x1; x += 1.5) {
        const i = Math.min(n - 1, Math.floor((x - x0) / bw)); const b = bits[i];
        let y;
        if (mode === 'ASK') { const amp = b ? 30 : 0; y = lanes[2].y - Math.sin((x - x0) * carK - t * 3) * amp; }
        else { const kk = b ? 0.32 : 0.12; y = lanes[2].y - Math.sin((x - x0) * kk - t * 3) * 28; }
        started ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), started = true);
      }
      ctx.stroke();
      if (mode === 'ASK') { ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('1 = Welle an · 0 = Welle aus', x0, lanes[2].y + 46); }
      else { ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('1 = schnelle Welle · 0 = langsame Welle', x0, lanes[2].y + 46); }
    }
    loop(canvas, draw);

    const mkBtn = (m, lbl) => { const b = el('button', { class: 'btn' + (m === mode ? ' primary' : ''), text: lbl }); b.addEventListener('click', () => { mode = m; row.querySelectorAll('.btn').forEach(x => x.classList.remove('primary')); b.classList.add('primary'); }); return b; };
    const row = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [mkBtn('ASK', 'ASK (An/Aus)'), mkBtn('FSK', 'FSK (Frequenz)')]);
    const rnd = el('button', { class: 'btn', html: '<i class="fas fa-shuffle"></i> Neue Bits' });
    rnd.addEventListener('click', () => bits = Array.from({ length: 8 }, () => Math.random() < 0.5 ? 0 : 1));
    row.appendChild(rnd);

    const body = el('div', {}, [canvas, row]);
    return vcard({
      icon: 'fa-tower-broadcast',
      title: '3 · Bits reiten auf der Welle (Modulation)',
      sub: 'Wie kommen 0 und 1 auf eine Funkwelle?',
      was: 'Eine leere Welle „sagt" noch nichts. Wir müssen sie im <b>Takt der Bits verändern</b> – das nennt man <b>Modulieren</b>.',
      detail: '<b>ASK = An/Aus:</b> bei 1 sendet die Welle, bei 0 ist Stille. <b>FSK = schnell/langsam:</b> 1 = schnelles Wackeln, 0 = langsames Wackeln. Der Empfänger erkennt das Muster und liest die 0/1 wieder ab.',
      praxis: 'Einfache Funk-Handsender und Türöffner nutzen <b>ASK</b>. Bessere Melder nutzen <b>FSK</b> – das ist störsicherer.',
      body,
    });
  }

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Wellen & Signale einfach erklärt</span>
      <h1>Von der Nachricht zur Welle 📡</h1>
      <p class="lead">Stell dir ein <b>Bit</b> wie einen <b>Lichtschalter</b> vor: <b>1 = an</b>, <b>0 = aus</b>.
      Tippe ein Wort – die App zeigt, wie es als Strom-Blitze durchs <b>Kabel</b> reist und dann als <b>Welle durch die Luft</b>.
      Drei kurze Stationen, jede mit einem Bild und einem Vergleich aus dem Alltag.</p>`;
    root.appendChild(intro);
    const g = el('div', { class: 'phys-grid' });
    [leitungSim(), emWelleSim(), modSim()].forEach(s => g.appendChild(s));
    root.appendChild(g);
    return root;
  }
  return { view };
})();
