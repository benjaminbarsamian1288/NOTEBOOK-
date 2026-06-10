/* Technik-Live-Animationen V2 – realistisch & krass.
   window.TEKANIM.zone(name) → Karte mit Canvas + Controls.
   Mehr Details: Texturen, LEDs, Logos, Schatten, Glow, weiche Übergänge. */
window.TEKANIM = (() => {
  const { el } = U;

  function loop(c, draw) {
    function f(t) { if (!c.isConnected) return; draw(t); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }

  // Hilfsfunktionen für realistischen Look
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  function metalGradient(ctx, x, y, w, h, base) {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, base[0]); g.addColorStop(0.5, base[1]); g.addColorStop(1, base[2]);
    return g;
  }
  function led(ctx, x, y, r, color, glow) {
    if (glow) { ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 18; }
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    g.addColorStop(0, '#fff'); g.addColorStop(0.3, color); g.addColorStop(1, color);
    ctx.fillStyle = glow ? g : '#1a1a1a';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    if (glow) ctx.restore();
    // Rand
    ctx.strokeStyle = '#000'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  }
  function screw(ctx, x, y, r) {
    const g = ctx.createRadialGradient(x - r/3, y - r/3, 0, x, y, r);
    g.addColorStop(0, '#cbd5e1'); g.addColorStop(0.5, '#94a3b8'); g.addColorStop(1, '#475569');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
    // Kreuzschlitz
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - r * 0.6, y); ctx.lineTo(x + r * 0.6, y);
    ctx.moveTo(x, y - r * 0.6); ctx.lineTo(x, y + r * 0.6); ctx.stroke();
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
    if (opts.body && opts.body.canvas) {
      c.appendChild(opts.body.canvas);
      if (opts.body.controls && opts.body.controls.length) {
        const bar = el('div', { class: 'tek-ctrl' });
        opts.body.controls.forEach(ctrl => bar.appendChild(makeControl(ctrl)));
        c.appendChild(bar);
      }
    } else c.appendChild(opts.body);
    if (opts.legend) c.appendChild(el('div', { class: 'tek-legend', html: opts.legend }));
    return c;
  }

  function makeControl(ctrl) {
    if (ctrl.type === 'slider') {
      const wrap = el('div', { class: 'tek-ctrl-item tek-ctrl-slider' });
      const valSpan = el('span', { class: 'tek-ctrl-val', text: ctrl.value + (ctrl.unit || '') });
      wrap.appendChild(el('label', { text: ctrl.label }));
      const sl = el('input', { type: 'range', min: String(ctrl.min), max: String(ctrl.max), step: String(ctrl.step), value: String(ctrl.value) });
      sl.addEventListener('input', () => { const v = +sl.value; ctrl.onChange(v); valSpan.textContent = v + (ctrl.unit || ''); });
      wrap.appendChild(sl); wrap.appendChild(valSpan); return wrap;
    }
    if (ctrl.type === 'toggle') {
      const wrap = el('label', { class: 'tek-ctrl-item tek-ctrl-toggle' });
      const cb = el('input', { type: 'checkbox' }); if (ctrl.value) cb.checked = true;
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

  /* ============ PERIMETER · Zaun mit Sensorik (realistisch) ============ */
  function perimeterAnim() {
    const W = 600, H = 240;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let intruder = -60, speed = 0.7, mwOn = true, fiberOn = true, night = false;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      // Himmel mit Sternen (nachts)
      const sky = ctx.createLinearGradient(0, 0, 0, H - 50);
      if (night) { sky.addColorStop(0, '#0a0e1a'); sky.addColorStop(1, '#1a2238'); }
      else { sky.addColorStop(0, '#1e3a5f'); sky.addColorStop(1, '#3b5d8c'); }
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H - 50);
      if (night) {
        for (let i = 0; i < 30; i++) {
          const x = (i * 91) % W, y = (i * 37) % (H - 80);
          ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t/500 + i) * 0.2})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Hügel im Hintergrund
      ctx.fillStyle = night ? '#0d1828' : '#2a4060';
      ctx.beginPath(); ctx.moveTo(0, H - 70);
      for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H - 70 - Math.sin(x * 0.02) * 8);
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      // Gras vorne
      const grass = ctx.createLinearGradient(0, H - 50, 0, H);
      grass.addColorStop(0, night ? '#152319' : '#2d4a30'); grass.addColorStop(1, night ? '#0a1410' : '#1a2e1f');
      ctx.fillStyle = grass; ctx.fillRect(0, H - 50, W, 50);
      // Gras-Halme
      for (let i = 0; i < 40; i++) {
        const x = (i * 79) % W;
        ctx.strokeStyle = night ? '#2a3d2e' : '#4a6b48';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, H - 40); ctx.lineTo(x + Math.sin(t/300 + i) * 2, H - 48); ctx.stroke();
      }

      // Zaun – realistischer Maschendrahtzaun
      const fy = H - 50, ftop = fy - 110;
      // Pfosten (Stahl-Look)
      for (let i = 0; i < 6; i++) {
        const x = 50 + i * 100;
        const pg = ctx.createLinearGradient(x - 4, 0, x + 4, 0);
        pg.addColorStop(0, '#64748b'); pg.addColorStop(0.5, '#cbd5e1'); pg.addColorStop(1, '#475569');
        ctx.fillStyle = pg; ctx.fillRect(x - 4, ftop - 8, 8, fy - ftop + 8);
        // Pfosten-Kappe
        ctx.fillStyle = '#1e293b'; ctx.fillRect(x - 5, ftop - 10, 10, 4);
      }
      // Maschendraht (rauten-Muster)
      ctx.strokeStyle = night ? 'rgba(180,200,220,.4)' : 'rgba(150,170,190,.7)';
      ctx.lineWidth = 0.8;
      for (let x = 50; x <= W - 50; x += 14) {
        ctx.beginPath();
        for (let y = ftop; y < fy; y += 7) {
          if ((y - ftop) % 14 === 0) { ctx.moveTo(x, y); ctx.lineTo(x + 14, y + 7); }
          else { ctx.moveTo(x + 14, y); ctx.lineTo(x, y + 7); }
        }
        ctx.stroke();
      }
      // NATO-Draht (Spiralen)
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      for (let x = 50; x < W - 50; x += 26) {
        ctx.beginPath();
        ctx.arc(x + 13, ftop - 6, 9, 0, Math.PI, true);
        ctx.stroke();
        // Stacheln
        for (let a = 0.3; a < Math.PI - 0.3; a += 0.5) {
          const sx = x + 13 + Math.cos(a) * 9, sy = ftop - 6 - Math.sin(a) * 9;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * 4, sy - Math.sin(a) * 4); ctx.stroke();
        }
      }

      // Glasfaser-Sensor am Zaun (mit Glow)
      const tT = t / 1000;
      if (fiberOn) {
        ctx.save();
        ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 12;
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 50; x < W - 50; x += 3) {
          const close = Math.max(0, 1 - Math.abs(x - intruder) / 50);
          const y = ftop + 45 + Math.sin(tT * 2.5 + x * 0.04) * 1.5 + close * Math.sin(tT * 25) * 8;
          x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.restore();
        // Sensor-Endboxen
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(44, ftop + 40, 8, 12);
        ctx.fillStyle = '#92400e'; ctx.fillRect(46, ftop + 42, 4, 8);
      }

      // Mikrowellen-Barrier
      if (mwOn) {
        // Sender-Box (links)
        const sx = 20, sy = ftop + 25;
        roundRect(ctx, sx, sy, 22, 40, 3);
        ctx.fillStyle = metalGradient(ctx, sx, sy, 22, 40, ['#475569','#64748b','#334155']); ctx.fill();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.stroke();
        // Linse
        ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(sx + 11, sy + 20, 6, 0, 7); ctx.fill();
        // LED
        led(ctx, sx + 11, sy + 32, 2, '#22c55e', true);
        // Empfänger
        const rx = W - 42;
        roundRect(ctx, rx, sy, 22, 40, 3);
        ctx.fillStyle = metalGradient(ctx, rx, sy, 22, 40, ['#475569','#64748b','#334155']); ctx.fill();
        ctx.strokeStyle = '#1e293b'; ctx.stroke();
        ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(rx + 11, sy + 20, 6, 0, 7); ctx.fill();
        const beamCut = Math.abs(intruder - W / 2) < 18;
        led(ctx, rx + 11, sy + 32, 2, beamCut ? '#ef4444' : '#22c55e', true);
        // Strahl (mit Wellen)
        ctx.save();
        if (beamCut) {
          ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 14;
          ctx.strokeStyle = '#ef4444';
        } else {
          ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 8;
          ctx.strokeStyle = 'rgba(34,211,238,.7)';
        }
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = sx + 22; x <= rx; x += 4) {
          const y = sy + 20 + Math.sin((x + t/30) * 0.3) * 1.5;
          x === sx + 22 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke(); ctx.restore();
      }

      intruder += speed; if (intruder > W + 60) intruder = -60;

      // Eindringling mit Schatten
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowOffsetY = 3; ctx.shadowBlur = 4;
      ctx.font = '38px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🥷', intruder, fy + 5);
      ctx.restore();

      const touching = (fiberOn && intruder > 80 && intruder < W - 80) ||
                       (mwOn && Math.abs(intruder - W / 2) < 18);
      // HUD-Box oben links
      roundRect(ctx, 12, 12, 230, 30, 6);
      ctx.fillStyle = touching ? 'rgba(239,68,68,.25)' : 'rgba(34,197,94,.18)';
      ctx.fill();
      ctx.strokeStyle = touching ? '#ef4444' : '#22c55e'; ctx.lineWidth = 1; ctx.stroke();
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = touching ? '#ef4444' : '#22c55e';
      ctx.fillText(touching ? '🚨 ALARM · Sensor ausgelöst' : '● Zaun überwacht · OK', 22, 28);
      ctx.textBaseline = 'alphabetic';
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'slider', label: 'Tempo', min: 0.1, max: 3, step: 0.1, value: 0.7, onChange: v => speed = v, unit: '×' },
      { type: 'toggle', label: 'Faseroptik', value: true, onChange: v => fiberOn = v },
      { type: 'toggle', label: 'MW-Schranke', value: true, onChange: v => mwOn = v },
      { type: 'toggle', label: 'Nacht', value: false, onChange: v => night = v },
    ]};
  }

  /* ============ AUSSENHAUT · Tür mit Beschlägen + Fenster mit Detail ============ */
  function aussenhautAnim() {
    const W = 600, H = 240;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let phase = 0, phaseT = 0;
    let timer = setInterval(() => { phase = (phase + 1) % 3; phaseT = 0; }, 4500);
    function setPhase(p) { phase = p; phaseT = 0; clearInterval(timer); timer = setInterval(() => { phase = (phase + 1) % 3; phaseT = 0; }, 4500); }
    function draw(t) {
      phaseT += 1/60;
      ctx.clearRect(0, 0, W, H);
      // Wand-Hintergrund mit Tapete-Textur
      const wall = ctx.createLinearGradient(0, 0, 0, H);
      wall.addColorStop(0, '#3a4660'); wall.addColorStop(1, '#1e293b');
      ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
      // Boden mit Holz-Textur
      const floor = ctx.createLinearGradient(0, H - 35, 0, H);
      floor.addColorStop(0, '#5a3e2a'); floor.addColorStop(1, '#2d1f15');
      ctx.fillStyle = floor; ctx.fillRect(0, H - 35, W, 35);
      // Bodenfugen
      ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, H - 35); ctx.lineTo(x, H); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H - 35); ctx.lineTo(W, H - 35); ctx.stroke();

      // ===== TÜR (links) =====
      const tx = 50, ty = 35, tw = 110, th = 170;
      // Türrahmen (dunkles Holz)
      ctx.fillStyle = '#4a2818';
      ctx.fillRect(tx - 8, ty - 8, tw + 16, 8); // oben
      ctx.fillRect(tx - 8, ty - 8, 8, th + 8); // links
      ctx.fillRect(tx + tw, ty - 8, 8, th + 8); // rechts

      const tilt = phase === 1 ? Math.min(0.55, phaseT * 0.4) : 0;
      ctx.save();
      ctx.translate(tx, ty + th);
      ctx.rotate(-tilt);
      ctx.translate(-tx, -(ty + th));
      // Türblatt mit Holz-Maserung
      const door = ctx.createLinearGradient(tx, ty, tx + tw, ty);
      door.addColorStop(0, '#6b4423'); door.addColorStop(0.5, '#7a5128'); door.addColorStop(1, '#5a371b');
      ctx.fillStyle = door; ctx.fillRect(tx, ty, tw, th);
      // Holz-Maserung
      ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 0.4;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(tx + 5, ty + 18 + i * 20);
        for (let x = tx + 5; x < tx + tw - 5; x += 8) {
          ctx.lineTo(x, ty + 18 + i * 20 + Math.sin(x * 0.05 + i) * 1.5);
        }
        ctx.stroke();
      }
      // Kassetten (2 Felder)
      ctx.strokeStyle = '#3a2410'; ctx.lineWidth = 2;
      ctx.strokeRect(tx + 10, ty + 12, tw - 20, 65);
      ctx.strokeRect(tx + 10, ty + 90, tw - 20, 65);
      // Innen-Highlight
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
      ctx.strokeRect(tx + 12, ty + 14, tw - 24, 61);
      ctx.strokeRect(tx + 12, ty + 92, tw - 24, 61);
      // Türknauf (Messing-Look)
      const knaufY = ty + th / 2 + 10;
      const kg = ctx.createRadialGradient(tx + tw - 12, knaufY - 2, 0, tx + tw - 14, knaufY, 7);
      kg.addColorStop(0, '#fef3c7'); kg.addColorStop(0.4, '#fbbf24'); kg.addColorStop(1, '#92400e');
      ctx.fillStyle = kg;
      ctx.beginPath(); ctx.arc(tx + tw - 14, knaufY, 7, 0, 7); ctx.fill();
      // Schlüsselloch
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(tx + tw - 14, knaufY + 14, 3, 0, 7); ctx.fill();
      ctx.fillRect(tx + tw - 15.5, knaufY + 14, 3, 6);
      // Scharniere (links, oben + unten)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(tx, ty + 15, 5, 16); ctx.fillRect(tx, ty + th - 31, 5, 16);
      screw(ctx, tx + 2.5, ty + 19, 1.2); screw(ctx, tx + 2.5, ty + 27, 1.2);
      screw(ctx, tx + 2.5, ty + th - 27, 1.2); screw(ctx, tx + 2.5, ty + th - 19, 1.2);
      // Magnetkontakt (oben rechts der Tür)
      const open = phase === 1;
      const mcg = ctx.createLinearGradient(tx + tw - 26, ty + 8, tx + tw - 26, ty + 18);
      mcg.addColorStop(0, '#e5e7eb'); mcg.addColorStop(1, '#9ca3af');
      ctx.fillStyle = mcg; ctx.fillRect(tx + tw - 26, ty + 8, 18, 10);
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 0.6; ctx.strokeRect(tx + tw - 26, ty + 8, 18, 10);
      led(ctx, tx + tw - 22, ty + 13, 1.5, open ? '#ef4444' : '#22c55e', true);
      ctx.restore();

      // Gegenstück am Rahmen
      ctx.fillStyle = '#9ca3af'; ctx.fillRect(tx + tw - 26, ty - 4, 18, 6);
      ctx.strokeStyle = '#374151'; ctx.strokeRect(tx + tw - 26, ty - 4, 18, 6);

      // ===== FENSTER (rechts) =====
      const fx = W - 220, fy = 50, fw = 180, fh = 130;
      // Rahmen (Aluminium-Look)
      const rg = ctx.createLinearGradient(0, fy - 8, 0, fy + fh + 8);
      rg.addColorStop(0, '#cbd5e1'); rg.addColorStop(0.5, '#94a3b8'); rg.addColorStop(1, '#475569');
      ctx.fillStyle = rg; ctx.fillRect(fx - 8, fy - 8, fw + 16, fh + 16);
      // Scheibe – mit Himmel-Reflexion
      const broken = phase === 2;
      const sky = ctx.createLinearGradient(0, fy, 0, fy + fh);
      if (broken) { sky.addColorStop(0, '#3a1010'); sky.addColorStop(1, '#1a0808'); }
      else { sky.addColorStop(0, '#7dd3fc'); sky.addColorStop(1, '#0c4a6e'); }
      ctx.fillStyle = sky; ctx.fillRect(fx, fy, fw, fh);
      // Wolken (nur wenn intakt)
      if (!broken) {
        ctx.fillStyle = 'rgba(255,255,255,.4)';
        for (let i = 0; i < 3; i++) {
          const cx = fx + 30 + i * 60 + Math.sin(t/2000 + i) * 5;
          ctx.beginPath();
          ctx.arc(cx, fy + 30 + i * 8, 12, 0, 7); ctx.arc(cx + 12, fy + 30 + i * 8, 9, 0, 7);
          ctx.arc(cx - 10, fy + 32 + i * 8, 8, 0, 7); ctx.fill();
        }
      }
      // Mittelsteg (Kreuz)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(fx + fw / 2 - 3, fy, 6, fh);
      ctx.fillRect(fx, fy + fh / 2 - 3, fw, 6);
      // Reflexion
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(fx + 12, fy + 12); ctx.lineTo(fx + 55, fy + 55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx + 22, fy + 12); ctx.lineTo(fx + 45, fy + 35); ctx.stroke();
      // Glasbruchmelder (Ecke oben links)
      const gbmg = ctx.createRadialGradient(fx + 14, fy + 14, 0, fx + 14, fy + 14, 6);
      gbmg.addColorStop(0, '#fef3c7'); gbmg.addColorStop(1, '#92400e');
      ctx.fillStyle = gbmg; ctx.beginPath(); ctx.arc(fx + 14, fy + 14, 5, 0, 7); ctx.fill();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5; ctx.stroke();
      led(ctx, fx + 14, fy + 14, 1.5, broken ? '#ef4444' : '#22c55e', true);
      // Riss bei phase 2
      if (broken) {
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.2;
        const k = Math.min(1, phaseT / 0.6);
        const rcx = fx + fw * 0.6, rcy = fy + fh * 0.5;
        ctx.beginPath();
        for (let a = 0; a < 8; a++) {
          const ang = a * Math.PI / 4 + Math.sin(a) * 0.3;
          ctx.moveTo(rcx, rcy);
          ctx.lineTo(rcx + Math.cos(ang) * 50 * k, rcy + Math.sin(ang) * 50 * k);
          // Verzweigungen
          if (k > 0.5) {
            const bx = rcx + Math.cos(ang) * 25, by = rcy + Math.sin(ang) * 25;
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(ang + 0.5) * 20 * k, by + Math.sin(ang + 0.5) * 20 * k);
          }
        }
        ctx.stroke();
        // Splitter
        if (k > 0.3) {
          ctx.fillStyle = 'rgba(255,255,255,.5)';
          for (let i = 0; i < 6; i++) {
            const ang = i * Math.PI / 3, d = 15 + i * 4;
            ctx.beginPath();
            ctx.moveTo(rcx + Math.cos(ang) * d, rcy + Math.sin(ang) * d);
            ctx.lineTo(rcx + Math.cos(ang + 0.2) * d * 0.7, rcy + Math.sin(ang + 0.2) * d * 0.7);
            ctx.lineTo(rcx + Math.cos(ang - 0.2) * d * 0.8, rcy + Math.sin(ang - 0.2) * d * 0.8);
            ctx.fill();
          }
        }
        // Schallwellen vom Sensor
        for (let r = 12; r < 80; r += 14) {
          const a = 1 - r / 80;
          ctx.strokeStyle = `rgba(251,191,36,${a})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(fx + 14, fy + 14, r + (phaseT * 40) % 14, 0, 7); ctx.stroke();
        }
      }
      // Fensterbank
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(fx - 12, fy + fh + 8, fw + 24, 6);
      ctx.strokeStyle = '#475569'; ctx.strokeRect(fx - 12, fy + fh + 8, fw + 24, 6);

      // HUD
      roundRect(ctx, 12, 12, 260, 30, 6);
      const states = ['● Außenhaut OK', '🚨 TÜR-Magnetkontakt offen', '🚨 GLASBRUCH erkannt'];
      const cols = ['#22c55e', '#ef4444', '#ef4444'];
      ctx.fillStyle = cols[phase] === '#22c55e' ? 'rgba(34,197,94,.18)' : 'rgba(239,68,68,.25)';
      ctx.fill(); ctx.strokeStyle = cols[phase]; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = cols[phase]; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(states[phase], 22, 28);
      ctx.textBaseline = 'alphabetic';
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '● Ruhe', color: '#22c55e', onClick: () => setPhase(0) },
      { type: 'button', label: '🚪 Tür auf', color: '#fbbf24', onClick: () => setPhase(1) },
      { type: 'button', label: '💥 Glasbruch', color: '#ef4444', onClick: () => setPhase(2) },
    ]};
  }

  /* ============ MELDER · realistische Decken-Melder ============ */
  function melderAnim() {
    const W = 600, H = 240;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let person = 30, speed = 0.6, pirOn = true, mwOn = true, mode = 'dual';

    function drawMelderUnit(x, y, col, lbl, active) {
      // Decken-Halterung
      ctx.fillStyle = '#475569'; ctx.fillRect(x - 4, 0, 8, 18);
      // Gehäuse (3D)
      roundRect(ctx, x - 30, y - 10, 60, 36, 6);
      const housingG = ctx.createLinearGradient(x - 30, y, x + 30, y);
      housingG.addColorStop(0, '#f1f5f9'); housingG.addColorStop(0.5, '#cbd5e1'); housingG.addColorStop(1, '#94a3b8');
      ctx.fillStyle = housingG; ctx.fill();
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.stroke();
      // Linse / Fresnel
      ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.ellipse(x, y + 8, 20, 8, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 0.8;
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x - 18, y + 8 + i * 2.2); ctx.lineTo(x + 18, y + 8 + i * 2.2); ctx.stroke(); }
      // LED
      led(ctx, x + 22, y - 3, 2.5, active ? '#ef4444' : '#22c55e', active);
      // Schrauben
      screw(ctx, x - 25, y - 5, 1.5); screw(ctx, x + 25, y - 5, 1.5);
      screw(ctx, x - 25, y + 21, 1.5); screw(ctx, x + 25, y + 21, 1.5);
      // Logo
      ctx.fillStyle = '#475569'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(lbl, x, y + 22);
    }

    function draw(t) {
      person += speed; if (person > W - 30) person = 30;
      ctx.clearRect(0, 0, W, H);
      // Raum: Decke + Wände + Boden
      const room = ctx.createLinearGradient(0, 0, 0, H);
      room.addColorStop(0, '#1e293b'); room.addColorStop(0.5, '#334155'); room.addColorStop(1, '#1e293b');
      ctx.fillStyle = room; ctx.fillRect(0, 0, W, H);
      // Decke (oben Streifen)
      ctx.fillStyle = '#475569'; ctx.fillRect(0, 0, W, 18);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(W, 18); ctx.stroke();
      // Boden mit Perspektiv-Linien
      ctx.fillStyle = '#283344'; ctx.fillRect(0, H - 35, W, 35);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H - 35); ctx.lineTo(W, H - 35); ctx.stroke();
      for (let x = 0; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, H - 35); ctx.lineTo(x + 20, H); ctx.stroke(); }

      const pirX = 100, pirY = 30;
      const mwX = W - 100, mwY = 30;

      // PIR-Kegel
      if (pirOn) {
        const cone = ctx.createRadialGradient(pirX, pirY, 5, pirX, pirY, 220);
        cone.addColorStop(0, 'rgba(251,191,36,.4)'); cone.addColorStop(0.6, 'rgba(251,191,36,.15)'); cone.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = cone; ctx.beginPath();
        ctx.moveTo(pirX, pirY + 8); ctx.lineTo(pirX + 180, H - 35); ctx.lineTo(pirX - 60, H - 35); ctx.closePath(); ctx.fill();
        // Fresnel-Streifen
        ctx.strokeStyle = 'rgba(251,191,36,.5)'; ctx.lineWidth = 1;
        for (let i = 0; i < 7; i++) {
          const a = -1.0 + i * 0.32;
          ctx.beginPath();
          ctx.moveTo(pirX, pirY + 8);
          ctx.lineTo(pirX + Math.cos(a) * 180, pirY + 8 + Math.sin(a + 1.5) * 180);
          ctx.stroke();
        }
      }
      // MW-Wellen
      if (mwOn) {
        ctx.save();
        for (let r = 20; r < 200; r += 16) {
          const a = 1 - r / 220;
          ctx.strokeStyle = `rgba(34,211,238,${a * 0.6})`; ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mwX, mwY + 8, r + (t / 60) % 16, Math.PI * 0.4, Math.PI * 0.85); ctx.stroke();
        }
        ctx.restore();
      }

      const inPir = pirOn && Math.abs(person - pirX) < 130 && person > 40;
      const inMw  = mwOn  && Math.abs(person - mwX)  < 130 && person < W - 40;

      drawMelderUnit(pirX, pirY, '#fbbf24', 'PIR', inPir);
      drawMelderUnit(mwX, mwY, '#22d3ee', 'MW', inMw);

      // Person mit Schatten
      const py = H - 45;
      ctx.save();
      // Schatten am Boden
      ctx.fillStyle = 'rgba(0,0,0,.4)';
      ctx.beginPath(); ctx.ellipse(person, H - 32, 20, 5, 0, 0, 7); ctx.fill();
      ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 2;
      ctx.font = '42px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText('🚶', person, py);
      ctx.restore();

      // Zentrale Logik-Anzeige
      const triggered = mode === 'dual' ? (inPir && inMw) : (inPir || inMw);
      const cx = W / 2, cy = H / 2 + 30;
      roundRect(ctx, cx - 90, cy - 22, 180, 44, 10);
      const logicCol = triggered ? '#ef4444' : '#22c55e';
      const logicBg = ctx.createLinearGradient(cx - 90, cy, cx + 90, cy);
      logicBg.addColorStop(0, triggered ? 'rgba(239,68,68,.18)' : 'rgba(34,197,94,.15)');
      logicBg.addColorStop(1, triggered ? 'rgba(220,38,38,.25)' : 'rgba(22,163,74,.2)');
      ctx.fillStyle = logicBg; ctx.fill();
      ctx.strokeStyle = logicCol; ctx.lineWidth = 1.5;
      if (triggered) { ctx.shadowColor = logicCol; ctx.shadowBlur = 14; }
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(mode === 'dual' ? 'PIR · UND · MW (DUAL)' : 'PIR · ODER · MW', cx, cy - 6);
      ctx.fillStyle = logicCol; ctx.font = 'bold 14px sans-serif';
      ctx.fillText(triggered ? '🚨 ALARM' : '● BEREIT', cx, cy + 14);
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'slider', label: 'Geh-Tempo', min: 0.1, max: 2.5, step: 0.1, value: 0.6, onChange: v => speed = v, unit: '×' },
      { type: 'toggle', label: 'PIR', value: true, onChange: v => pirOn = v },
      { type: 'toggle', label: 'MW',  value: true, onChange: v => mwOn = v },
      { type: 'button', label: 'Logik: DUAL', color: '#22d3ee', onClick: btn => { mode = mode === 'dual' ? 'or' : 'dual'; btn.textContent = 'Logik: ' + (mode === 'dual' ? 'DUAL' : 'ODER'); } },
    ]};
  }

  /* ============ MECHANIK · Tresor mit Detail ============ */
  function mechanikAnim() {
    const W = 600, H = 240;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let dial = 0, riegel = 0, locked = true, dialSpeed = 0.04;
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      // Hintergrund (Bank-Tresorraum)
      const bg = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, 400);
      bg.addColorStop(0, '#1e293b'); bg.addColorStop(1, '#0a0f1a');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // Boden
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, H - 30, W, 30);
      // Wand-Fließen
      ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 30); ctx.stroke(); }
      for (let y = 0; y < H - 30; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const cx = W / 2 - 30, cy = H / 2 + 5, sw = 240, sh = 180;
      const sx = cx - sw / 2, sy = cy - sh / 2;
      // Tresor-Schatten am Boden
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      ctx.beginPath(); ctx.ellipse(cx, H - 30, sw / 2, 8, 0, 0, 7); ctx.fill();
      ctx.restore();
      // Tresor-Außen (Stahl)
      roundRect(ctx, sx - 14, sy - 14, sw + 28, sh + 28, 10);
      const outerG = ctx.createLinearGradient(0, sy - 14, 0, sy + sh + 14);
      outerG.addColorStop(0, '#475569'); outerG.addColorStop(0.5, '#64748b'); outerG.addColorStop(1, '#1e293b');
      ctx.fillStyle = outerG; ctx.fill();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.stroke();
      // Tresortür innen
      roundRect(ctx, sx, sy, sw, sh, 6);
      const doorG = ctx.createLinearGradient(0, sy, 0, sy + sh);
      doorG.addColorStop(0, '#334155'); doorG.addColorStop(0.5, '#475569'); doorG.addColorStop(1, '#1e293b');
      ctx.fillStyle = doorG; ctx.fill();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
      // Innen-Rand mit Highlight
      ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 1;
      roundRect(ctx, sx + 4, sy + 4, sw - 8, sh - 8, 4); ctx.stroke();
      // Schrauben am Rahmen
      for (let i = 0; i < 5; i++) {
        screw(ctx, sx - 8, sy + 10 + i * (sh - 20) / 4, 2.5);
        screw(ctx, sx + sw + 8, sy + 10 + i * (sh - 20) / 4, 2.5);
      }

      // Zahlenrad
      const dx = sx + 60, dy = cy;
      dial += dialSpeed;
      // Schatten
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 12; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(dx, dy, 36, 0, 7); ctx.fill();
      ctx.restore();
      // Messingring
      const ringG = ctx.createRadialGradient(dx - 10, dy - 10, 0, dx, dy, 38);
      ringG.addColorStop(0, '#fef3c7'); ringG.addColorStop(0.5, '#fbbf24'); ringG.addColorStop(1, '#92400e');
      ctx.fillStyle = ringG;
      ctx.beginPath(); ctx.arc(dx, dy, 38, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(dx, dy, 30, 0, 7);
      ctx.fillStyle = '#1a1a1a'; ctx.fill();
      // Zahlen
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6 + dial;
        ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(String(i * 5), dx + Math.cos(a) * 24, dy + Math.sin(a) * 24 + 3);
      }
      // Striche zwischen Zahlen
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        const a = i * Math.PI / 30 + dial;
        const r1 = i % 5 === 0 ? 27 : 28, r2 = 30;
        ctx.beginPath();
        ctx.moveTo(dx + Math.cos(a) * r1, dy + Math.sin(a) * r1);
        ctx.lineTo(dx + Math.cos(a) * r2, dy + Math.sin(a) * r2);
        ctx.stroke();
      }
      // Drehknauf in Mitte
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.arc(dx, dy, 8, 0, 7); ctx.fill();
      ctx.fillStyle = '#475569'; ctx.fillRect(dx - 1, dy - 8, 2, 16);
      // Fester Zeiger oben
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(dx, dy - 40); ctx.lineTo(dx - 4, dy - 32); ctx.lineTo(dx + 4, dy - 32); ctx.closePath(); ctx.fill();

      // Riegelwerk
      const target = locked ? 1 : 0;
      riegel += (target - riegel) * 0.08;
      const rx = sx + sw - 30;
      for (let i = 0; i < 4; i++) {
        const ry = sy + 30 + i * 32;
        // Bolzen-Tasche
        roundRect(ctx, rx, ry, 12, 14, 2);
        ctx.fillStyle = '#0f172a'; ctx.fill();
        // Bolzen (silber)
        roundRect(ctx, rx + 2, ry + 2, 16 + riegel * 22, 10, 2);
        const boltG = ctx.createLinearGradient(0, ry, 0, ry + 14);
        boltG.addColorStop(0, '#f1f5f9'); boltG.addColorStop(0.5, '#cbd5e1'); boltG.addColorStop(1, '#64748b');
        ctx.fillStyle = boltG; ctx.fill();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5; ctx.stroke();
        // Bolzen-Kopf
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(rx + 16 + riegel * 22, ry + 1, 3, 12);
      }
      // Schlüsselrosette
      const krx = sx + sw - 70, kry = sy + sh - 50;
      const krG = ctx.createRadialGradient(krx - 4, kry - 4, 0, krx, kry, 14);
      krG.addColorStop(0, '#fef3c7'); krG.addColorStop(0.6, '#fbbf24'); krG.addColorStop(1, '#92400e');
      ctx.fillStyle = krG;
      ctx.beginPath(); ctx.arc(krx, kry, 14, 0, 7); ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(krx, kry, 4, 0, 7); ctx.fill();
      ctx.fillRect(krx - 1.5, kry, 3, 8);
      // Logo Plakette
      ctx.fillStyle = '#92400e'; ctx.fillRect(cx + 20, sy + sh - 20, 80, 12);
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('WERTHEIM', cx + 60, sy + sh - 11);

      // Status-HUD
      roundRect(ctx, 12, 12, 280, 30, 6);
      const stateColors = ['#22c55e', '#fbbf24', '#94a3b8'];
      const stateTexts = ['🔒 VERRIEGELT · 4 Bolzen', '⚙️ in Bewegung…', '🔓 entriegelt · offen'];
      const idx = riegel > 0.7 ? 0 : (riegel > 0.3 ? 1 : 2);
      const col = stateColors[idx];
      ctx.fillStyle = col === '#22c55e' ? 'rgba(34,197,94,.18)' : col === '#fbbf24' ? 'rgba(251,191,36,.18)' : 'rgba(148,163,184,.18)';
      ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = col; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(stateTexts[idx], 22, 28);
      ctx.textBaseline = 'alphabetic';
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '🔒 Verriegeln', color: '#22c55e', onClick: () => locked = true },
      { type: 'button', label: '🔓 Entriegeln', color: '#fbbf24', onClick: () => locked = false },
      { type: 'slider', label: 'Rad-Tempo', min: 0, max: 0.15, step: 0.01, value: 0.04, onChange: v => dialSpeed = v, unit: '' },
    ]};
  }

  /* ============ EMA · System mit echten Boxen + Signal-Pulse ============ */
  function emaAnim() {
    const W = 600, H = 250;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let phase = 0, phaseT = 0, auto = true, period = 2200;
    let timer = setInterval(() => { if (auto) { phase = (phase + 1) % 5; phaseT = 0; } }, period);
    function setPhase(p) { phase = p; phaseT = 0; auto = false; }
    function resumeAuto() { auto = true; }

    function drawComponent(x, y, w, h, col, lbl, on, ic) {
      // Schatten
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
      // Gehäuse
      roundRect(ctx, x - w/2, y - h/2, w, h, 6);
      const g = ctx.createLinearGradient(0, y - h/2, 0, y + h/2);
      g.addColorStop(0, '#334155'); g.addColorStop(1, '#1e293b');
      ctx.fillStyle = g; ctx.fill();
      ctx.restore();
      // Border + Glow wenn aktiv
      if (on) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 16; }
      ctx.strokeStyle = on ? col : '#475569';
      ctx.lineWidth = on ? 2.5 : 1.5;
      roundRect(ctx, x - w/2, y - h/2, w, h, 6); ctx.stroke();
      if (on) ctx.restore();
      // Label
      ctx.fillStyle = on ? col : '#94a3b8'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(lbl, x, y + 4);
      // Icon
      if (ic) { ctx.font = '16px sans-serif'; ctx.fillText(ic, x, y - 6); ctx.font = 'bold 9px sans-serif'; ctx.fillText(lbl, x, y + 12); }
      // Status-LED
      led(ctx, x + w/2 - 6, y - h/2 + 6, 2, on ? col : '#22c55e', on);
    }

    function drawBusLine(a, b, pulse, col) {
      // BUS-Leitung mit Glow
      ctx.save();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.strokeStyle = pulse != null ? col : '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      // Pulse-Punkt
      if (pulse != null) {
        const k = Math.min(1, pulse);
        const px = a.x + (b.x - a.x) * k, py = a.y + (b.y - a.y) * k;
        ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px - 1, py - 1, 2, 0, 7); ctx.fill();
      }
      ctx.restore();
    }

    function draw(t) {
      phaseT += 1/60;
      ctx.clearRect(0, 0, W, H);
      // Hintergrund mit Grid
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0b1424'); bg.addColorStop(1, '#060a13');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(34,211,238,.06)'; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const sensor = { x: 70, y: 100 };
      const central = { x: W / 2, y: 130 };
      const sirene = { x: W - 100, y: 70 };
      const nsl = { x: W - 70, y: 200 };
      const kp = { x: central.x - 90, y: central.y + 50 };

      // BUS-Linien mit Pulses
      drawBusLine(sensor, central, phase === 1 ? phaseT * 1.0 : null, '#fbbf24');
      drawBusLine(central, sirene, phase === 3 ? phaseT * 1.0 : null, '#ef4444');
      drawBusLine(central, nsl, phase === 3 ? phaseT * 1.0 : null, '#22c55e');
      drawBusLine(central, kp, phase === 4 ? phaseT * 1.0 : null, '#a855f7');

      // Sensor: PIR
      drawComponent(sensor.x, sensor.y, 60, 40, '#fbbf24', 'PIR', phase >= 1, '👁');
      // Zentrale: groß, mit Logo
      drawComponent(central.x, central.y, 130, 80, '#22d3ee', 'EMA · VdS C', phase >= 2);
      ctx.fillStyle = phase >= 2 ? '#22d3ee' : '#475569'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🏛', central.x, central.y - 5);
      ctx.fillStyle = '#94a3b8'; ctx.font = '8px sans-serif';
      ctx.fillText('EMA-Zentrale', central.x, central.y + 22);
      ctx.fillText('VdS C / Grad 3', central.x, central.y + 32);
      // Bedienteil
      drawComponent(kp.x, kp.y, 60, 32, '#a855f7', 'KP', phase === 4, '🔢');
      // Sirene
      drawComponent(sirene.x, sirene.y, 72, 40, '#ef4444', 'Sirene', phase === 3, '🔊');
      // Sirenenwellen
      if (phase === 3) {
        for (let r = 8; r < 70; r += 12) {
          const a = 1 - r / 70;
          ctx.strokeStyle = `rgba(239,68,68,${a})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(sirene.x, sirene.y, r + (phaseT * 50) % 14, 0, 7); ctx.stroke();
        }
      }
      // NSL
      drawComponent(nsl.x, nsl.y, 60, 36, '#22c55e', 'NSL', phase === 3, '📡');

      // HUD oben
      roundRect(ctx, 12, 12, 320, 30, 6);
      const labels = [
        ['● Anlage scharf · alle Melder OK', '#22c55e'],
        ['🚨 Melder löst aus → Signal an Zentrale', '#fbbf24'],
        ['⚙️ Zentrale prüft Logik & Zeitfenster', '#22d3ee'],
        ['🔊 Sirene + 📡 NSL-Aufschaltung', '#ef4444'],
        ['🔐 Quittierung am Bedienteil', '#a855f7'],
      ];
      const lc = labels[phase][1];
      ctx.fillStyle = lc === '#22c55e' ? 'rgba(34,197,94,.18)' : `${lc}33`;
      ctx.fill(); ctx.strokeStyle = lc; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = lc; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(labels[phase][0], 22, 28);
      ctx.textBaseline = 'alphabetic';
      if (auto) {
        ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'right';
        ctx.fillStyle = '#4ade80'; ctx.fillText('▶ AUTO', W - 14, 24);
      }
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '● Standby', color: '#22c55e', onClick: () => setPhase(0) },
      { type: 'button', label: '🚨 Auslösung', color: '#fbbf24', onClick: () => setPhase(1) },
      { type: 'button', label: '⚙ Zentrale', color: '#22d3ee', onClick: () => setPhase(2) },
      { type: 'button', label: '🔊 Sirene/NSL', color: '#ef4444', onClick: () => setPhase(3) },
      { type: 'button', label: '🔐 Quittierung', color: '#a855f7', onClick: () => setPhase(4) },
      { type: 'button', label: '▶ Auto', color: '#4ade80', onClick: () => resumeAuto() },
    ]};
  }

  /* ============ VIDEO · Dome-Kamera mit Detail ============ */
  function videoAnim() {
    const W = 600, H = 240;
    const cv = el('canvas', { class: 'tek-canvas', width: W, height: H });
    const ctx = cv.getContext('2d');
    let day = true, auto = true;
    let timer = setInterval(() => { if (auto) day = !day; }, 4000);
    let person = 30, speed = 0.5, aiOn = true;
    function draw(t) {
      person += speed; if (person > W - 100) person = 30;
      ctx.clearRect(0, 0, W, H);
      // Himmel mit Sonne/Mond
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      if (day) { sky.addColorStop(0, '#0ea5e9'); sky.addColorStop(0.7, '#1e40af'); sky.addColorStop(1, '#0c1e3a'); }
      else { sky.addColorStop(0, '#020617'); sky.addColorStop(0.8, '#0f1729'); sky.addColorStop(1, '#020617'); }
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      // Sonne/Mond
      if (day) {
        const sg = ctx.createRadialGradient(W - 80, 50, 5, W - 80, 50, 40);
        sg.addColorStop(0, '#fef3c7'); sg.addColorStop(0.6, '#fbbf24'); sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(W - 80, 50, 40, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(W - 80, 50, 18, 0, 7); ctx.fill();
        ctx.fillStyle = '#0f1729';
        ctx.beginPath(); ctx.arc(W - 88, 46, 14, 0, 7); ctx.fill();
        // Sterne
        for (let i = 0; i < 25; i++) {
          const x = (i * 73) % W, y = (i * 41) % 120;
          ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t/500 + i) * 0.3})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Boden
      ctx.fillStyle = day ? '#1e293b' : '#070e1a'; ctx.fillRect(0, H - 35, W, 35);
      // Markierung am Boden
      ctx.strokeStyle = day ? '#475569' : '#1e293b'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, H - 35); ctx.lineTo(x + 30, H); ctx.stroke(); }

      // Wand-Mast für Kamera
      ctx.fillStyle = '#475569';
      ctx.fillRect(60, 0, 16, 70);
      // Halterung
      ctx.fillStyle = '#334155';
      ctx.fillRect(76, 60, 30, 8);
      // Dome-Kamera
      const camX = 130, camY = 75;
      // Dome-Gehäuse (Halbkugel)
      const domeG = ctx.createRadialGradient(camX - 8, camY - 8, 0, camX, camY, 28);
      domeG.addColorStop(0, '#f1f5f9'); domeG.addColorStop(0.5, '#cbd5e1'); domeG.addColorStop(1, '#475569');
      ctx.fillStyle = domeG;
      ctx.beginPath(); ctx.arc(camX, camY, 26, Math.PI, 0); ctx.fill();
      // Dome-Boden
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(camX - 26, camY, 52, 8);
      // Linse (dunkel mit Reflexion)
      ctx.fillStyle = '#0b1424';
      ctx.beginPath(); ctx.arc(camX, camY, 14, 0, 7); ctx.fill();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
      // Linsenring innen
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(camX, camY, 11, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(camX, camY, 8, 0, 7); ctx.stroke();
      // Reflexion
      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.beginPath(); ctx.arc(camX - 4, camY - 4, 3, 0, 7); ctx.fill();
      // IR-LEDs um Linse
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        const lx = camX + Math.cos(a) * 18, ly = camY + Math.sin(a) * 18;
        led(ctx, lx, ly, 1.8, !day ? '#ef4444' : '#3a1f1f', !day);
      }
      // Marke "AXIS" Logo
      ctx.fillStyle = day ? '#0f172a' : '#475569';
      ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('AXIS 4K', camX, camY + 18);
      // Schrauben am Boden
      screw(ctx, camX - 22, camY + 4, 1.5); screw(ctx, camX + 22, camY + 4, 1.5);

      // Sichtfeld-Kegel
      const beamCol = day ? 'rgba(255,255,255,.12)' : 'rgba(239,68,68,.20)';
      const beamEdge = day ? 'rgba(255,255,255,.35)' : 'rgba(239,68,68,.55)';
      ctx.fillStyle = beamCol;
      ctx.beginPath(); ctx.moveTo(camX, camY + 8); ctx.lineTo(camX + 280, H - 35); ctx.lineTo(camX - 30, H - 35); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = beamEdge; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(camX - 30, H - 35); ctx.lineTo(camX, camY + 8); ctx.lineTo(camX + 280, H - 35); ctx.stroke();

      // Person mit Schatten
      const py = H - 42;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.4)';
      ctx.beginPath(); ctx.ellipse(person, H - 32, 18, 5, 0, 0, 7); ctx.fill();
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3;
      ctx.font = '42px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText('🚶', person, py);
      ctx.restore();

      // KI-Bounding-Box
      if (aiOn && person > camX - 30 && person < camX + 280) {
        ctx.strokeStyle = day ? '#22c55e' : '#fbbf24'; ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(person - 22, py - 40, 44, 48);
        ctx.setLineDash([]);
        // Eck-Markierungen
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(person - 22, py - 32); ctx.lineTo(person - 22, py - 40); ctx.lineTo(person - 14, py - 40);
        ctx.moveTo(person + 22, py - 40); ctx.lineTo(person + 22, py - 32);
        ctx.moveTo(person + 22, py + 8); ctx.lineTo(person + 22, py); ctx.lineTo(person + 14, py + 8);
        ctx.moveTo(person - 22, py + 8); ctx.lineTo(person - 22, py); ctx.lineTo(person - 14, py + 8);
        ctx.stroke();
        // Label-Box
        ctx.fillStyle = day ? 'rgba(34,197,94,.9)' : 'rgba(251,191,36,.9)';
        ctx.fillRect(person - 22, py - 56, 70, 14);
        ctx.fillStyle = '#0b1424'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Person 92%', person - 19, py - 46);
      }

      // NVR rechts
      const rx = W - 120, ry = H - 95, rw = 95, rh = 55;
      // Schatten
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 4;
      roundRect(ctx, rx, ry, rw, rh, 4);
      const nvrG = ctx.createLinearGradient(0, ry, 0, ry + rh);
      nvrG.addColorStop(0, '#1e293b'); nvrG.addColorStop(1, '#0f172a');
      ctx.fillStyle = nvrG; ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5; ctx.stroke();
      // NVR-LCD
      ctx.fillStyle = '#0a2640'; ctx.fillRect(rx + 6, ry + 6, 50, 18);
      ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
      ctx.fillText('REC', rx + 10, ry + 18);
      // REC-LED blinkt
      const blink = (t / 500) % 2 < 1;
      led(ctx, rx + 46, ry + 14, 2, blink ? '#ef4444' : '#3a1f1f', blink);
      // Knöpfe
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#475569';
        ctx.beginPath(); ctx.arc(rx + 12 + i * 12, ry + 38, 3, 0, 7); ctx.fill();
      }
      // Marke
      ctx.fillStyle = '#475569'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Hikvision NVR', rx + rw / 2, ry + rh - 4);
      // PoE-Kabel
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(camX + 26, camY); ctx.bezierCurveTo(camX + 80, 80, rx - 30, 100, rx, ry + 15);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('PoE+', camX + 80, 78);

      // HUD oben
      roundRect(ctx, 12, 12, 250, 30, 6);
      const modeC = day ? '#fbbf24' : '#ef4444';
      ctx.fillStyle = day ? 'rgba(251,191,36,.18)' : 'rgba(239,68,68,.22)';
      ctx.fill(); ctx.strokeStyle = modeC; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = modeC; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(day ? '☀ TAG · Farb-Modus · 30 fps' : '🌙 NACHT · IR aktiv · S/W', 22, 28);
      ctx.textBaseline = 'alphabetic';
    }
    requestAnimationFrame(loop.bind(null, cv, draw));
    return { canvas: cv, controls: [
      { type: 'button', label: '☀ Tag', color: '#fbbf24', onClick: () => { day = true; auto = false; } },
      { type: 'button', label: '🌙 Nacht', color: '#ef4444', onClick: () => { day = false; auto = false; } },
      { type: 'button', label: '▶ Auto', color: '#22c55e', onClick: () => { auto = true; } },
      { type: 'slider', label: 'Person-Tempo', min: 0.1, max: 2, step: 0.1, value: 0.5, onChange: v => speed = v, unit: '×' },
      { type: 'toggle', label: 'KI', value: true, onChange: v => aiOn = v },
    ]};
  }

  /* ============ Öffentliche API ============ */
  function zone(name) {
    switch (name) {
      case 'perimeter': return card({
        color: '#22c55e', icon: 'fa-border-all', title: 'Perimeter-Live · Zaun-Sensorik',
        sub: 'Faseroptik + MW-Schranke gegen den Eindringling. Tempo, Sensoren und Tageszeit live regeln.',
        body: perimeterAnim(),
        legend: '🥷 Eindringling · 🟡 Faseroptik (schwingt bei Berührung) · 🔵 MW-Lichtschranke',
      });
      case 'aussenhaut': return card({
        color: '#fbbf24', icon: 'fa-door-closed', title: 'Außenhaut-Live · Tür & Fenster',
        sub: 'Realistische Tür mit Beschlägen + Aluminium-Fenster mit Glasbruchmelder.',
        body: aussenhautAnim(),
        legend: '🟢 Kontakt geschlossen · 🔴 Kontakt offen / Glasbruch · ⭕ Glasbruchmelder (Schallwellen + Risse)',
      });
      case 'melder': return card({
        color: '#22d3ee', icon: 'fa-bell', title: 'Melder-Live · PIR + MW · Dual-Logik',
        sub: 'Decken-Melder mit echten Fresnel-Linsen, LEDs und Schrauben. Erfassungskegel + Doppler-Wellen.',
        body: melderAnim(),
        legend: '🟡 PIR (Wärme passiv, Kegel) · 🔵 MW (Doppler aktiv, Wellen) · UND / ODER umschaltbar',
      });
      case 'mechanik': return card({
        color: '#a855f7', icon: 'fa-vault', title: 'Mechanik-Live · Tresor mit Riegelwerk',
        sub: 'Wertheim-Tresor mit Messing-Zahlenrad, 4-Bolzen-Riegelwerk und Schlüsselrosette.',
        body: mechanikAnim(),
        legend: '🟡 Zahlenrad mit 60 Strichen + Zeiger · ⚙ Riegelwerk · 4 ausfahrende Stahlbolzen',
      });
      case 'ema': return card({
        color: '#22d3ee', icon: 'fa-tower-broadcast', title: 'EMA-Live · Komplette Alarm-Kette',
        sub: 'Melder → Zentrale → Sirene + NSL → Bedienteil. Signale wandern als Lichtpunkte über BUS.',
        body: emaAnim(),
        legend: '🟡 PIR · 🔵 EMA-Zentrale VdS C · 🔴 Sirene · 🟢 NSL · 🟣 Bedienteil · BUS-Pulse',
      });
      case 'video': return card({
        color: '#ef4444', icon: 'fa-video', title: 'Video-Live · 4K Dome + KI',
        sub: 'AXIS 4K Dome-Kamera mit Linse, IR-LEDs und Hikvision NVR. Tag/Nacht-Wechsel + KI-Erkennung.',
        body: videoAnim(),
        legend: '☀ Tag = Farbe · 🌙 Nacht = IR + S/W · KI-Bounding-Box · PoE+ Kabel verbindet Kamera ↔ NVR',
      });
    }
    return el('div');
  }

  return { zone, card, makeControl };
})();
