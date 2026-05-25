/* Videotechnik – interaktiver Deep-Dive durch die komplette Bildkette einer
   Überwachungskamera. Jede Sim mit 3-teiliger Erklärung (Was / Im Detail /
   Praxis). window.VIDEOTECH.view() liefert den Ansichts-Knoten. */
window.VIDEOTECH = (() => {
  const { el } = U;

  function loop(canvas, draw) {
    function frame(t) { if (!canvas.isConnected) return; draw(t); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  }
  function readout(label) {
    const wrap = el('div', { class: 'phys-ro' }); const val = el('span', { class: 'phys-ro-v', text: '–' });
    wrap.appendChild(el('span', { class: 'phys-ro-l', text: label })); wrap.appendChild(val);
    return { wrap, set: (t, cls) => { val.textContent = t; val.className = 'phys-ro-v' + (cls ? ' ' + cls : ''); } };
  }
  function vcard(o) {
    const c = el('div', { class: 'phys-card' });
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
  // Statischer Bildhintergrund (Wand + helles Fenster + Boden) – skaliert mit W/H
  function backdrop(ctx, W, H) {
    const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#26384f'); sky.addColorStop(1, '#33506b');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#2a2f3a'; ctx.fillRect(0, 0, W * 0.46, H * 0.66);
    ctx.fillStyle = '#bfe3ff'; ctx.fillRect(W * 0.07, H * 0.13, W * 0.3, H * 0.34);  // helles Fenster
    ctx.strokeStyle = '#2a2f3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * 0.22, H * 0.13); ctx.lineTo(W * 0.22, H * 0.47); ctx.stroke();
    ctx.fillStyle = '#3a3a44'; ctx.fillRect(0, H * 0.66, W, H * 0.34);             // Boden
  }
  function person(ctx, x, y, s, col) {
    ctx.fillStyle = col || '#1b2330';
    ctx.beginPath(); ctx.arc(x, y, 11 * s, 0, 7); ctx.fill();
    ctx.fillRect(x - 10 * s, y + 8 * s, 20 * s, 46 * s);
    ctx.fillRect(x - 9 * s, y + 52 * s, 7 * s, 22 * s); ctx.fillRect(x + 2 * s, y + 52 * s, 7 * s, 22 * s);
  }
  function noise(ctx, W, H, amt) {
    const n = Math.floor(amt * 1400);
    for (let i = 0; i < n; i++) { const g = Math.random() * 255 | 0; ctx.fillStyle = `rgba(${g},${g},${g},0.28)`; ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  }

  /* 1) Belichtungsdreieck */
  function exposureSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    let f = 4, sh = 120, gain = 6, t = 0;
    const roF = readout('Blende'), roS = readout('Verschluss'), roG = readout('Gain'), roB = readout('Helligkeit');
    function draw() {
      t += 0.025; const cx = W * 0.62 + Math.sin(t) * W * 0.22;
      const light = (1 / (f * f)) * (1 / sh) * Math.pow(10, gain / 20) * 980;
      const bright = Math.max(0.18, Math.min(2.4, light));
      const blur = sh < 250 ? Math.min(9, (250 - sh) / 28 + Math.abs(Math.cos(t)) * 3) : 0;
      ctx.filter = `brightness(${bright})`; backdrop(ctx, W, H);
      ctx.filter = `brightness(${bright}) blur(${blur}px)`; ctx.font = (30) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🚗', cx, H * 0.7);
      ctx.filter = 'none'; noise(ctx, W, H, gain / 48);
      roF.set('f/' + f.toFixed(1)); roS.set('1/' + sh + ' s'); roG.set(gain + ' dB'); roB.set((bright * 100).toFixed(0) + ' %', bright < 0.5 ? 'bad' : bright > 1.8 ? 'warn' : 'ok');
    }
    loop(canvas, draw);
    const mk = (lbl, min, max, step, val, cb) => { const s = el('input', { type: 'range', min, max, step, value: val, class: 'phys-slider' }); s.addEventListener('input', () => cb(+s.value)); return el('div', { class: 'phys-ctrl' }, [el('label', { text: lbl }), s]); };
    const body = el('div', {}, [canvas,
      mk('Blende (f)', '1.4', '16', '0.1', '4', v => f = v),
      mk('Verschluss (1/x s)', '15', '2000', '5', '120', v => sh = v),
      mk('Gain (dB)', '0', '48', '1', '6', v => gain = v),
      el('div', { class: 'phys-ros' }, [roF.wrap, roS.wrap, roG.wrap, roB.wrap])]);
    return vcard({ icon: 'fa-camera-retro', title: '1 · Belichtungsdreieck', sub: 'Blende · Verschluss · Gain',
      was: 'Drei Stellschrauben steuern, wie viel Licht auf den Sensor fällt – und damit Helligkeit, Bewegungsschärfe und Rauschen.',
      detail: '<b>Blende</b> (f-Zahl, klein = offen = viel Licht + wenig Schärfentiefe). <b>Verschlusszeit</b> (lang = viel Licht, aber Bewegungsunschärfe). <b>Gain/ISO</b> (verstärkt das Signal – holt Helligkeit raus, erzeugt aber Bildrauschen).',
      praxis: 'Nachts will man Licht: Blende auf, längere Zeit (Vorsicht Blur bei Bewegung), erst zuletzt Gain hoch. Für scharfe schnelle Szenen braucht man kurze Zeit – also gute Beleuchtung.', body });
  }

  /* 2) Tag/Nacht & IR-Cut-Filter */
  function tagNachtSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    let night = false, t = 0;
    const roMode = readout('Modus'), roFilter = readout('IR-Cut-Filter');
    function draw() {
      t += 0.02; const cx = W * 0.6 + Math.sin(t) * W * 0.2;
      if (night) { ctx.filter = 'grayscale(1) brightness(0.8) contrast(1.1)'; } else { ctx.filter = 'none'; }
      backdrop(ctx, W, H); person(ctx, cx, H * 0.5, 1, night ? '#0a0d12' : '#1b2330'); ctx.filter = 'none';
      if (night) {
        const g = ctx.createRadialGradient(cx, H * 0.5, 5, cx, H * 0.5, 130); g.addColorStop(0, 'rgba(180,200,180,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 8; i++) { ctx.fillStyle = '#7f1d1d'; ctx.beginPath(); ctx.arc(W - 40 + Math.cos(i / 8 * 7) * 16, 40 + Math.sin(i / 8 * 7) * 16, 3, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#ef4444'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('IR-LED', W - 40, 70);
      }
      // IR-Cut-Filter-Symbol vor dem Sensor
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(night ? 'IR-Cut: weggeklappt → Sensor sieht IR' : 'IR-Cut: davor → echte Farben', 12, H - 12);
      roMode.set(night ? 'Nacht (IR · S/W)' : 'Tag (Farbe)', night ? 'warn' : 'ok'); roFilter.set(night ? 'weggeklappt' : 'aktiv');
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn primary', html: '<i class="fas fa-sun"></i> Tag' });
    b.addEventListener('click', () => { night = !night; b.className = 'btn' + (night ? '' : ' primary'); b.innerHTML = night ? '<i class="fas fa-moon"></i> Nacht' : '<i class="fas fa-sun"></i> Tag'; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b]), el('div', { class: 'phys-ros' }, [roMode.wrap, roFilter.wrap])]);
    return vcard({ icon: 'fa-circle-half-stroke', title: '2 · Tag/Nacht & IR-Cut-Filter', sub: 'Warum Nachtbilder Schwarz-Weiß sind',
      was: 'Tagsüber liefert die Kamera Farbe, nachts schaltet sie auf empfindliches Infrarot um – dann monochrom.',
      detail: 'Der Bildsensor sieht auch <b>Infrarot</b>. Am Tag sitzt ein <b>IR-Cut-Filter</b> davor (sonst falsche Farben). Bei Dunkelheit klappt der Filter mechanisch weg, IR-LEDs leuchten die Szene unsichtbar aus – das Bild wird S/W, weil Farbe ohne sichtbares Licht nicht rekonstruierbar ist.',
      praxis: 'Daher das hörbare „Klick" beim Umschalten und der rote Schimmer der IR-LEDs. Reichweite der IR-Ausleuchtung begrenzt die Nachtsicht – Wärmebild sieht weiter.', body });
  }

  /* 3) WDR / Gegenlicht */
  function wdrSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    let wdr = false, t = 0;
    const roDyn = readout('Dynamikumfang'), roFace = readout('Gesicht erkennbar');
    function draw() {
      t += 0.02; ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f1b2e'; ctx.fillRect(0, 0, W, H);
      // helles Fenster (Gegenlicht)
      ctx.fillStyle = wdr ? '#9cc3e0' : '#ffffff'; ctx.fillRect(W * 0.55, 0, W * 0.45, H);
      // Person davor
      const cx = W * 0.4;
      if (wdr) { person(ctx, cx, H * 0.42, 1.4, '#5b6573'); ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(cx, H * 0.42, 15, 0, 7); ctx.fill(); ctx.fillStyle = '#1b2330'; ctx.fillRect(cx - 6, H * 0.42 - 2, 4, 4); ctx.fillRect(cx + 3, H * 0.42 - 2, 4, 4); }
      else { person(ctx, cx, H * 0.42, 1.4, '#05080d'); }  // reine Silhouette
      // Histogramm-Hinweis
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(wdr ? 'helle + dunkle Bereiche zugleich sichtbar' : 'Fenster überstrahlt – Person nur Schatten', 12, H - 12);
      roDyn.set(wdr ? '~120 dB (WDR)' : '~70 dB', wdr ? 'ok' : 'bad'); roFace.set(wdr ? 'ja' : 'nein', wdr ? 'ok' : 'bad');
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn', html: '<i class="fas fa-circle-half-stroke"></i> WDR aus' });
    b.addEventListener('click', () => { wdr = !wdr; b.className = 'btn' + (wdr ? ' primary' : ''); b.innerHTML = wdr ? '<i class="fas fa-circle-half-stroke"></i> WDR an' : '<i class="fas fa-circle-half-stroke"></i> WDR aus'; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b]), el('div', { class: 'phys-ros' }, [roDyn.wrap, roFace.wrap])]);
    return vcard({ icon: 'fa-sun-plant-wilt', title: '3 · WDR · Gegenlicht', sub: 'Hell und Dunkel gleichzeitig', was: 'Eine Person vor einem hellen Fenster wird ohne Gegenmaßnahme zur schwarzen Silhouette. WDR macht beide Bereiche sichtbar.', detail: 'WDR (Wide Dynamic Range) nimmt <b>mehrere Belichtungen</b> auf (kurz für Helles, lang für Dunkles) und rechnet sie zu einem Bild zusammen. Der Dynamikumfang steigt von ~70 dB auf 120 dB+.', praxis: 'Pflicht an Eingängen, Toren, Fenstern, Tiefgaragen-Ausfahrten – überall mit starkem Hell/Dunkel-Kontrast, sonst ist das Gesicht im Gegenlicht verloren.', body });
  }

  /* 4) Auflösung & px/m */
  function aufloesungSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const off = document.createElement('canvas'); const octx = off.getContext('2d');
    const RES = [{ n: 'CIF', w: 60, mp: '0,1 MP' }, { n: 'D1', w: 110, mp: '0,4 MP' }, { n: '720p', w: 170, mp: '1 MP' }, { n: '1080p', w: 250, mp: '2 MP' }, { n: '4K', w: 480, mp: '8 MP' }];
    let ri = 2, t = 0;
    const roRes = readout('Auflösung'), roPx = readout('px/m @ 10 m'), roId = readout('DORI');
    function draw() {
      t += 0.02; const r = RES[ri]; off.width = r.w; off.height = Math.round(r.w * H / W);
      octx.imageSmoothingEnabled = true; backdrop(octx, off.width, off.height);
      person(octx, off.width * 0.62, off.height * 0.5, off.height / H, '#1b2330');
      ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, W, H); ctx.drawImage(off, 0, 0, W, H);
      const pxm = Math.round(r.w / 6); // grobe px/m bei ~10 m Bildbreite 6 m
      const dori = pxm >= 250 ? 'Identifizieren' : pxm >= 125 ? 'Wiedererkennen' : pxm >= 60 ? 'Beobachten' : 'nur Detektieren';
      roRes.set(r.n + ' · ' + r.mp); roPx.set(pxm + ' px/m'); roId.set(dori, pxm >= 125 ? 'ok' : pxm >= 60 ? 'warn' : 'bad');
    }
    loop(canvas, draw);
    const btns = RES.map((r, i) => { const b = el('button', { class: 'btn' + (i === ri ? ' primary' : ''), text: r.n }); b.addEventListener('click', () => { ri = i; body.querySelectorAll('.phys-ctrl-btns .btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns), el('div', { class: 'phys-ros' }, [roRes.wrap, roPx.wrap, roId.wrap])]);
    return vcard({ icon: 'fa-table-cells', title: '4 · Auflösung & px/m', sub: 'Wie viel Detail bleibt übrig', was: 'Mehr Megapixel = mehr Bildpunkte pro Meter Szene = mehr erkennbares Detail. Schalte die Auflösung durch und sieh den Unterschied.', detail: 'Entscheidend ist nicht die MP-Zahl allein, sondern <b>px pro Meter</b> am Zielort. Faustregel (EN 62676): Detektieren ≥25, Beobachten ≥62, Wiedererkennen ≥125, Identifizieren ≥250 px/m.', praxis: 'Eine 4K-Kamera weit weg kann schlechter „identifizieren" als 1080p nah dran. Planung immer über px/m am wichtigsten Punkt – nicht über Megapixel-Marketing.', body });
  }

  /* 5) Kompression & Bitrate */
  function kompressionSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const off = document.createElement('canvas'); const octx = off.getContext('2d');
    let kbps = 2000, h265 = false, t = 0;
    const roRate = readout('Bitrate'), roDay = readout('Speicher/Tag'), roBlock = readout('Qualität');
    function draw() {
      t += 0.02; const eff = h265 ? kbps * 2 : kbps; // H.265 ~ doppelte Effizienz
      const block = Math.max(1, Math.round(40 - eff / 130)); const ow = Math.max(20, Math.round(W / block));
      off.width = ow; off.height = Math.round(ow * H / W); octx.imageSmoothingEnabled = false;
      backdrop(octx, off.width, off.height); person(octx, off.width * (0.6 + Math.sin(t) * 0.06), off.height * 0.5, off.height / H, '#1b2330');
      ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, W, H); ctx.drawImage(off, 0, 0, W, H);
      const gbDay = (kbps * 1000 / 8 * 86400) / 1e9;
      roRate.set(kbps + ' kbps' + (h265 ? ' (H.265)' : ' (H.264)')); roDay.set(gbDay.toFixed(1) + ' GB/Tag'); roBlock.set(eff > 3000 ? 'sehr gut' : eff > 1500 ? 'ok' : 'klötzchen', eff > 3000 ? 'ok' : eff > 1500 ? 'warn' : 'bad');
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '256', max: '8000', step: '128', value: '2000', class: 'phys-slider' }); s.addEventListener('input', () => kbps = +s.value);
    const b = el('button', { class: 'btn', html: 'H.264' }); b.addEventListener('click', () => { h265 = !h265; b.className = 'btn' + (h265 ? ' primary' : ''); b.textContent = h265 ? 'H.265 (HEVC)' : 'H.264'; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Bitrate' }), s]), el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b]), el('div', { class: 'phys-ros' }, [roRate.wrap, roDay.wrap, roBlock.wrap])]);
    return vcard({ icon: 'fa-compress', title: '5 · Kompression & Bitrate', sub: 'H.264 / H.265 · Datenrate', was: 'Video wird komprimiert. Zu wenig Bitrate → grobe „Klötzchen" (Makroblöcke). Mehr Bitrate → bessere Qualität, aber mehr Speicher.', detail: 'Codecs speichern nur <b>Änderungen</b>: ein vollständiges I-Frame, dann viele kleine P-Frames (nur Bewegung). <b>H.265</b> schafft gleiche Qualität mit ~halber Bitrate von H.264. Bei zu niedriger Bitrate brechen die 16×16-Makroblöcke sichtbar auf.', praxis: 'Speicher/Tag = Bitrate × Zeit. Mehr Kameras + lange Aufbewahrung = schnell Terabytes. H.265 + smarte Codecs (nur bei Bewegung volle Rate) sparen massiv.', body });
  }

  /* 6) Bildrate & Verschluss (Bewegung) */
  function bildrateSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    let fps = 25, sh = 500, rolling = false, t = 0, lastX = 0;
    const roFps = readout('Bildrate'), roSh = readout('Verschluss'), roMo = readout('Bewegung');
    function draw() {
      t += 0.03; const realX = W * 0.5 + Math.sin(t) * W * 0.34;
      // Bildrate: Position quantisiert (ruckelt bei wenig fps)
      const q = Math.max(1, Math.round(30 / fps)); if (Math.floor(t * 60) % q === 0) lastX = realX;
      const blur = sh < 250 ? Math.min(14, (250 - sh) / 16) : 0;
      ctx.clearRect(0, 0, W, H); backdrop(ctx, W, H);
      ctx.save();
      if (rolling && Math.abs(Math.cos(t)) > 0.3) { ctx.transform(1, 0, 0.5 * Math.sign(Math.cos(t)), 1, -H * 0.25, 0); }
      ctx.filter = `blur(${blur}px)`; ctx.font = '34px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🏃', lastX, H * 0.62); ctx.filter = 'none';
      ctx.restore();
      roFps.set(fps + ' fps', fps < 8 ? 'bad' : 'ok'); roSh.set('1/' + sh + ' s'); roMo.set(rolling ? 'Rolling-Shutter-Skew' : blur > 4 ? 'Bewegungsunschärfe' : 'scharf', blur > 4 || rolling ? 'warn' : 'ok');
    }
    loop(canvas, draw);
    const mk = (lbl, min, max, val, cb) => { const s = el('input', { type: 'range', min, max, value: val, class: 'phys-slider' }); s.addEventListener('input', () => cb(+s.value)); return el('div', { class: 'phys-ctrl' }, [el('label', { text: lbl }), s]); };
    const rb = el('button', { class: 'btn', html: '<i class="fas fa-bolt"></i> Rolling-Shutter' }); rb.addEventListener('click', () => { rolling = !rolling; rb.className = 'btn' + (rolling ? ' primary' : ''); });
    const body = el('div', {}, [canvas, mk('Bildrate (fps)', '1', '30', '25', v => fps = v), mk('Verschluss (1/x s)', '30', '2000', '500', v => sh = v), el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [rb]), el('div', { class: 'phys-ros' }, [roFps.wrap, roSh.wrap, roMo.wrap])]);
    return vcard({ icon: 'fa-gauge-high', title: '6 · Bildrate & Verschluss', sub: 'Flüssig vs. ruckeln · Schärfe vs. Skew', was: 'Bildrate (fps) bestimmt die Flüssigkeit, die Verschlusszeit die Bewegungsschärfe – und der Sensortyp, ob schnelle Objekte verzerren.', detail: 'Wenig <b>fps</b> = ruckelige Bewegung, Lücken zwischen Bildern. Lange <b>Verschlusszeit</b> = Bewegungsunschärfe. <b>Rolling Shutter</b> (CMOS) liest Zeilen nacheinander aus → schnelle Objekte „kippen" (Skew); Global Shutter belichtet alles gleichzeitig.', praxis: 'Kennzeichen-/Sport-Erfassung braucht kurze Verschlusszeit + genug fps + ggf. Global Shutter. 25 fps reichen meist; bei Beweismitteln lieber mehr.', body });
  }

  /* 7) Video-Analytics · Linienüberschreitung */
  function analyticsSim() {
    const W = 560, H = 280; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const line = { a: { x: W * 0.5, y: 30 }, b: { x: W * 0.5, y: H - 30 } };
    const obj = { x: 60, dir: 1 }; let count = 0, flash = 0, prevSide = 0, drag = null, t = 0;
    const roCount = readout('Überschreitungen'), roStat = readout('Status');
    function side(px, py) { return Math.sign((line.b.x - line.a.x) * (py - line.a.y) - (line.b.y - line.a.y) * (px - line.a.x)); }
    function near(p, x, y) { return Math.hypot(p.x - x, p.y - y) < 18; }
    canvas.addEventListener('mousedown', e => { const r = canvas.getBoundingClientRect(); const x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height; drag = near(line.a, x, y) ? line.a : near(line.b, x, y) ? line.b : null; });
    canvas.addEventListener('mousemove', e => { if (!drag) return; const r = canvas.getBoundingClientRect(); drag.x = (e.clientX - r.left) * W / r.width; drag.y = (e.clientY - r.top) * H / r.height; });
    window.addEventListener('mouseup', () => drag = null);
    function draw() {
      t += 0.02; obj.x += obj.dir * 2.2; if (obj.x > W - 40 || obj.x < 40) obj.dir *= -1;
      const oy = H * 0.55; const s = side(obj.x, oy);
      if (prevSide && s !== prevSide && s !== 0) { count++; flash = 18; }
      if (s !== 0) prevSide = s; if (flash > 0) flash--;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); backdrop(ctx, W, H);
      ctx.strokeStyle = flash > 0 ? '#ef4444' : '#22d3ee'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(line.a.x, line.a.y); ctx.lineTo(line.b.x, line.b.y); ctx.stroke(); ctx.setLineDash([]);
      [line.a, line.b].forEach(p => { ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fill(); });
      ctx.fillStyle = flash > 0 ? '#ef4444' : '#e2e8f0'; ctx.beginPath(); ctx.arc(obj.x, oy, 13, 0, 7); ctx.fill(); ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🚶', obj.x, oy + 5);
      if (flash > 0) { ctx.fillStyle = '#ef4444'; ctx.font = '14px sans-serif'; ctx.fillText('● LINIE ÜBERSCHRITTEN ' + (obj.dir > 0 ? 'A→B' : 'B→A'), W / 2, 20); }
      roCount.set(String(count)); roStat.set(flash > 0 ? 'Ereignis ausgelöst' : 'überwacht', flash > 0 ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-hint', text: '⟶ Zieh die Linien-Endpunkte. Jede Überschreitung wird mit Richtung gezählt.' }), el('div', { class: 'phys-ros' }, [roCount.wrap, roStat.wrap])]);
    return vcard({ icon: 'fa-arrow-right-arrow-left', title: '7 · Video-Analytics · Linienüberschreitung', sub: 'Aus Pixeln werden Ereignisse', was: 'Die Kamera-KI legt virtuelle Linien/Zonen ins Bild und meldet, wenn etwas sie überschreitet – inklusive Richtung.', detail: 'Bewegungserkennung (VMD) findet veränderte Pixel; <b>Objekt-Analytics</b> klassifiziert (Mensch/Fahrzeug) und verfolgt Pfade. Regeln wie „Linienüberschreitung", „Bereich betreten", „Herumlungern" erzeugen gezielte Alarme statt Dauer-Aufzeichnung.', praxis: 'Spart Personal und Speicher: nur relevante Ereignisse alarmieren/aufzeichnen. Richtungslogik unterscheidet z.B. „rein" von „raus" an einer Tür.', body });
  }

  /* === GRUNDLAGEN (einfach, animiert) === */
  function kameraGrundlageSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const cols = 8, rows = 6, sx = 415, sy = 78, pw = 120 / cols, ph = 120 / rows; const px = new Array(cols * rows).fill(0);
    let parts = [], t = 0;
    const pc = i => ({ x: sx + (i % cols) * pw + pw / 2, y: sy + ((i / cols) | 0) * ph + ph / 2 });
    function draw() {
      t++; if (t % 2 === 0) parts.push({ x: 60, y: 70 + Math.random() * 150, tp: (Math.random() * cols * rows) | 0 });
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('☀️', 60, 75); ctx.fillText('🏠', 60, 150); ctx.fillText('🌳', 60, 210);
      ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif'; ctx.fillText('Motiv', 60, 250);
      ctx.fillStyle = 'rgba(125,211,252,0.22)'; ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(295, H / 2, 15, 72, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#475569'; ctx.fillText('Objektiv', 295, H / 2 + 90);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(sx - 6, sy - 6, 132, 132);
      for (let i = 0; i < px.length; i++) { ctx.fillStyle = `rgba(34,211,238,${0.08 + px[i] * 0.9})`; ctx.fillRect(sx + (i % cols) * pw + 1, sy + ((i / cols) | 0) * ph + 1, pw - 2, ph - 2); px[i] *= 0.97; }
      ctx.fillStyle = '#475569'; ctx.fillText('Bildsensor · Pixel', sx + 60, sy + 150);
      parts.forEach(p => { const tg = p.x < 295 ? { x: 295, y: H / 2 } : pc(p.tp); const dx = tg.x - p.x, dy = tg.y - p.y, d = Math.hypot(dx, dy) || 1; p.x += dx / d * 5; p.y += dy / d * 5; if (d < 6) { if (p.x < 305) p.x = 300; else { px[p.tp] = 1; p.dead = true; } } ctx.fillStyle = 'rgba(251,191,36,0.9)'; ctx.fillRect(p.x, p.y, 2.5, 2.5); });
      parts = parts.filter(p => !p.dead && p.x < sx + 130);
    }
    loop(canvas, draw);
    return vcard({ icon: 'fa-camera', title: 'A · Wie die Kamera ein Bild macht', sub: 'Licht → Objektiv → Sensor → Bild',
      was: 'Licht vom Motiv fällt durchs Objektiv auf den Bildsensor. Jeder winzige <b>Pixel</b> misst, wie viel Licht ankommt – zusammen ergeben sie das Bild.',
      detail: 'Das Objektiv bündelt das Licht und wirft das Motiv auf den Sensor. Millionen lichtempfindliche Pixel wandeln Licht in elektrische Signale; der Bildprozessor macht daraus ein digitales Bild. Viele Bilder pro Sekunde = bewegtes Video.',
      praxis: 'Mehr/empfindlichere Pixel = besseres Bild (v.a. bei wenig Licht). Das Objektiv bestimmt Bildwinkel und Schärfe.', body: el('div', {}, [canvas]) });
  }

  function analogIpSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let ip = false, t = 0;
    function draw() {
      t += 2; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const camX = 60, recX = 330, monX = 490, y = H / 2 + 10;
      ctx.fillStyle = ip ? '#22c55e' : '#fbbf24'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ip ? 'IP-Kamera: 1 Netzwerkkabel (RJ45) für Strom + Daten · PoE · ~100 m' : 'Analog-Kamera: Koaxkabel + BNC · CVBS/AHD/TVI · ~300 m', W / 2, 36);
      ctx.font = '32px sans-serif'; ctx.fillText('🎥', camX, y);
      ctx.strokeStyle = ip ? '#22c55e' : '#fbbf24'; ctx.lineWidth = ip ? 4 : 7; ctx.beginPath(); ctx.moveTo(camX + 22, y - 6); ctx.lineTo(recX - 22, y - 6); ctx.stroke();
      if (ip) { for (let i = 0; i < 6; i++) { const x = camX + 24 + ((t + i * 45) % (recX - camX - 46)); ctx.fillStyle = '#22c55e'; ctx.fillRect(x, y - 11, 9, 10); } }
      else { ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = camX + 24; x < recX - 22; x += 2) ctx.lineTo(x, y - 22 + Math.sin((x + t) * 0.22) * 7); ctx.stroke(); }
      ctx.font = '28px sans-serif'; ctx.fillText(ip ? '🗄️' : '📼', recX, y);
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(recX + 20, y - 6); ctx.lineTo(monX - 20, y - 6); ctx.stroke();
      ctx.font = '28px sans-serif'; ctx.fillText('🖥️', monX, y); if (ip) { ctx.font = '20px sans-serif'; ctx.fillText('☁️', monX, y - 40); ctx.fillText('📱', monX + 34, y); }
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
      ctx.fillText('Kamera', camX, y + 34); ctx.fillText(ip ? 'NVR + Switch' : 'DVR', recX, y + 34); ctx.fillText(ip ? 'Monitor + App' : 'Monitor', monX, y + 40);
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn', html: '<i class="fas fa-toggle-off"></i> Analog' });
    b.addEventListener('click', () => { ip = !ip; b.className = 'btn' + (ip ? ' primary' : ''); b.innerHTML = ip ? '<i class="fas fa-toggle-on"></i> IP / Netzwerk' : '<i class="fas fa-toggle-off"></i> Analog'; });
    return vcard({ icon: 'fa-diagram-project', title: 'B · Analog oder IP-Kamera?', sub: 'Zwei Welten der Übertragung',
      was: 'Eine <b>Analog-Kamera</b> schickt ein durchgehendes Videosignal über ein Koaxkabel zum DVR. Eine <b>IP-Kamera</b> ist ein kleiner Computer und sendet einen digitalen Datenstrom übers Netzwerk zum NVR.',
      detail: 'Analog: BNC-Stecker, separates Stromkabel, Signalarten CVBS (SD) oder AHD/TVI/CVI (HD über Koax), bis ~300 m. IP: ein einziges Netzwerkkabel liefert per <b>PoE</b> Strom und Daten zugleich, bis ~100 m, dafür hohe Auflösung, Verschlüsselung und Fernzugriff.',
      praxis: 'Bestandsanlagen sind oft analog (AHD spart Neuverkabelung). Neubau heute fast immer IP/PoE – flexibler, hochauflösend, per App erreichbar.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b])]) });
  }

  function recorderSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const N = 28, ring = new Array(N).fill(0); let head = 0, t = 0, mode = 'dauer';
    function draw() {
      t++; let moving = false, write = false;
      if (mode === 'dauer') write = true;
      else if (mode === 'bewegung') { moving = Math.floor(t / 70) % 3 === 0; write = moving; }
      else { write = Math.floor(t / 90) % 2 === 0; }
      if (t % 5 === 0 && write) { ring[head] = t; head = (head + 1) % N; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ['🎥', '🎥', '🎥'].forEach((c, i) => ctx.fillText(c, 50, 70 + i * 60));
      ctx.fillStyle = '#1e293b'; ctx.fillRect(150, 70, 120, 120); ctx.strokeStyle = '#475569'; ctx.strokeRect(150, 70, 120, 120);
      ctx.fillStyle = '#7dd3fc'; ctx.font = '24px sans-serif'; ctx.fillText('🗄️', 210, 120); ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.fillText('Recorder (DVR/NVR)', 210, 175);
      [70, 130, 190].forEach(yy => { ctx.strokeStyle = write ? '#22c55e' : '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(66, yy); ctx.lineTo(150, 120); ctx.stroke(); });
      if (mode === 'bewegung') { ctx.fillStyle = moving ? '#ef4444' : '#475569'; ctx.font = '12px sans-serif'; ctx.fillText(moving ? '● Bewegung → schreibt' : 'keine Bewegung', 110, 230); }
      // Ringspeicher
      const bx = 300, bw = 240, cw = bw / N;
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Festplatte · Ringspeicher', bx, 70);
      for (let i = 0; i < N; i++) { const age = ring[i] ? Math.max(0, 1 - (t - ring[i]) / 600) : 0; ctx.fillStyle = ring[i] ? `rgba(34,197,94,${0.25 + age * 0.7})` : 'rgba(148,163,184,0.12)'; ctx.fillRect(bx + i * cw, 84, cw - 1.5, 90); if (i === head) { ctx.fillStyle = '#fbbf24'; ctx.fillRect(bx + i * cw, 84, cw - 1.5, 5); } }
      ctx.fillStyle = '#fbbf24'; ctx.font = '11px sans-serif'; ctx.fillText('▲ Schreibkopf – ältestes wird überschrieben', bx, 192);
    }
    loop(canvas, draw);
    const mk = (k, l) => { const b = el('button', { class: 'btn' + (k === mode ? ' primary' : '') }); b.textContent = l; b.addEventListener('click', () => { mode = k; body.querySelectorAll('.phys-ctrl-btns .btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; };
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [mk('dauer', 'Daueraufnahme'), mk('bewegung', 'Bei Bewegung'), mk('zeitplan', 'Zeitplan')])]);
    return vcard({ icon: 'fa-hard-drive', title: 'C · Aufzeichnung · DVR & NVR', sub: 'Wie das Video gespeichert wird',
      was: 'Der Recorder schreibt die Kamerabilder auf eine Festplatte. Ist sie voll, werden die <b>ältesten</b> Aufnahmen automatisch überschrieben (Ringspeicher).',
      detail: 'Aufnahmemodi: <b>Daueraufnahme</b> (alles), <b>bei Bewegung</b> (nur wenn sich etwas tut – spart enorm Platz) oder <b>Zeitplan</b> (z. B. nur nachts). DVR = für Analogkameras, NVR = für IP-Kameras.',
      praxis: 'Speicherbedarf = Bitrate × Kameras × Aufbewahrungstage. „Bei Bewegung" + H.265 reduziert das drastisch. Wichtige Vorfälle rechtzeitig sichern, bevor sie überschrieben werden.', body });
  }

  function uebertragungSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const lanes = [
      ['Koax (BNC)', '#fbbf24', 'Analog · bis ~300 m'],
      ['Netzwerk + PoE', '#22c55e', 'IP · Strom+Daten · ~100 m'],
      ['WLAN', '#22d3ee', 'Funk · bequem, störanfällig'],
      ['Glasfaser', '#a855f7', 'km-weit · störungsfrei'],
    ];
    let t = 0;
    function draw() {
      t += 2.5; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      lanes.forEach(([name, c, info], i) => {
        const y = 50 + i * 58; ctx.fillStyle = c; ctx.font = '13px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(name, 14, y - 8);
        ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, y); ctx.lineTo(W - 30, y); ctx.stroke();
        for (let k = 0; k < 5; k++) { const x = 150 + ((t + k * 80) % (W - 180)); ctx.fillStyle = c; if (i === 2) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin((t + k * 80) / 20); } ctx.fillRect(x, y - 4, i === 0 ? 14 : 8, 8); ctx.globalAlpha = 1; }
        ctx.fillStyle = '#94a3b8'; ctx.font = '10.5px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(info, W - 32, y - 8);
      });
    }
    loop(canvas, draw);
    return vcard({ icon: 'fa-network-wired', title: 'D · Übertragungswege & Kabel', sub: 'Wie das Bild zum Recorder kommt',
      was: 'Das Kamerabild muss zum Recorder. Dafür gibt es mehrere Wege – jeder mit Reichweite und Eigenheiten.',
      detail: '<b>Koax/BNC</b>: klassisch analog, robust, lang. <b>Netzwerk + PoE</b>: ein Kabel für Strom & Daten, Standard bei IP. <b>WLAN</b>: kabellos, aber störanfällig/abhörbar. <b>Glasfaser</b>: riesige Reichweite, immun gegen Blitz/EMV – für Gelände & KRITIS.',
      praxis: 'Distanz und Umgebung entscheiden: kurze Strecke → PoE; sehr lang/Außengelände → Glasfaser; nur als Notlösung WLAN.', body: el('div', {}, [canvas]) });
  }

  function systemSim() {
    const W = 560, H = 250, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const steps = [['🎥', 'Kamera'], ['🔌', 'Kabel/PoE'], ['🗄️', 'Recorder'], ['🖥️', 'Monitor'], ['☁️', 'Cloud'], ['📱', 'App']];
    let t = 0;
    function draw() {
      t += 1; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const n = steps.length, gap = (W - 60) / (n - 1), y = H / 2; const active = Math.floor(t / 35) % n;
      ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(W - 30, y); ctx.stroke();
      steps.forEach(([em, lbl], i) => { const x = 30 + i * gap; const on = i === active; ctx.fillStyle = on ? 'rgba(34,211,238,0.25)' : 'rgba(15,23,42,0.8)'; ctx.beginPath(); ctx.arc(x, y, 24, 0, 7); ctx.fill(); ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(em, x, y); ctx.textBaseline = 'alphabetic'; ctx.fillStyle = on ? '#22d3ee' : '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText(lbl, x, y + 44); });
      const px = 30 + (active * gap); ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(px, y - 36, 6, 0, 7); ctx.fill();
      ctx.fillStyle = '#475569'; ctx.font = '12px sans-serif'; ctx.fillText('Das Bild wandert: Motiv → Kamera → Kabel → Recorder → Anzeige & Fernzugriff', W / 2, 28);
    }
    loop(canvas, draw);
    return vcard({ icon: 'fa-sitemap', title: 'E · Das ganze System', sub: 'Von der Szene bis aufs Handy',
      was: 'Eine Videoanlage ist eine Kette: Kamera nimmt auf → Kabel überträgt → Recorder speichert → Monitor/App zeigt an.',
      detail: 'Moderne Systeme schicken den Stream zusätzlich in die <b>Cloud</b> oder direkt aufs <b>Smartphone</b> – so siehst du live und Aufnahmen von überall, bekommst Push-Alarme und kannst exportieren.',
      praxis: 'Beim Planen alle Glieder bedenken: Kameraposition, Kabelweg/Strom, Recorder-Speicher, Anzeige/Fernzugriff und Datenschutz (Hinweisschild, Speicherdauer).', body: el('div', {}, [canvas]) });
  }

  /* === GERÄTE & PLANUNG === */
  function kameraTypenSim() {
    const W = 560, H = 300, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const types = [
      { k: 'dome', n: 'Dome', use: 'Decke innen/außen, unauffällig, vandalismusgeschützt – Blickrichtung von außen schwer erkennbar.' },
      { k: 'bullet', n: 'Bullet', use: 'Außen, gerichtet (Einfahrt, Zaun), mit Sonnenblende – sichtbare Abschreckung.' },
      { k: 'turret', n: 'Turret', use: 'Innen/außen, weniger Reflexionen als Dome, leicht auszurichten – sehr beliebt.' },
      { k: 'ptz', n: 'PTZ', use: 'Schwenken/Neigen/Zoom – große Flächen aktiv verfolgen, von der Leitstelle steuerbar.' },
      { k: 'fisheye', n: 'Fisheye 360°', use: 'Eine Kamera für den ganzen Raum (360°), Bild wird per Software entzerrt.' },
    ];
    let sel = 'dome'; const ro = (function () { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v', text: '–' }); w.appendChild(el('span', { class: 'phys-ro-l', text: 'Einsatz' })); w.appendChild(v); return { wrap: w, set: t => v.textContent = t }; })();
    function cam(type, cx, cy, s, c) {
      ctx.strokeStyle = c; ctx.fillStyle = c + '33'; ctx.lineWidth = 3;
      if (type === 'dome') { ctx.fillStyle = '#334155'; ctx.fillRect(cx - 55 * s, cy - 70 * s, 110 * s, 16 * s); ctx.fillStyle = c + '33'; ctx.beginPath(); ctx.arc(cx, cy - 54 * s, 48 * s, 0, Math.PI); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cx, cy - 30 * s, 12 * s, 0, 7); ctx.fill(); }
      else if (type === 'bullet') { ctx.fillStyle = c + '33'; ctx.beginPath(); ctx.roundRect(cx - 70 * s, cy - 22 * s, 130 * s, 44 * s, 12 * s); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#334155'; ctx.fillRect(cx - 80 * s, cy - 30 * s, 120 * s, 8 * s); ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cx + 58 * s, cy, 16 * s, 0, 7); ctx.fill(); ctx.strokeStyle = '#475569'; ctx.beginPath(); ctx.moveTo(cx - 60 * s, cy + 22 * s); ctx.lineTo(cx - 60 * s, cy + 50 * s); ctx.stroke(); }
      else if (type === 'turret') { ctx.fillStyle = '#334155'; ctx.fillRect(cx - 50 * s, cy + 30 * s, 100 * s, 12 * s); ctx.fillStyle = c + '22'; ctx.beginPath(); ctx.arc(cx, cy + 30 * s, 50 * s, Math.PI, 0); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cx + 8 * s, cy + 6 * s, 24 * s, 0, 7); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + 14 * s, cy + 2 * s, 7 * s, 0, 7); ctx.fill(); }
      else if (type === 'ptz') { ctx.fillStyle = '#334155'; ctx.fillRect(cx - 40 * s, cy - 78 * s, 80 * s, 14 * s); ctx.fillStyle = c + '33'; ctx.beginPath(); ctx.arc(cx, cy - 30 * s, 50 * s, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cx, cy - 14 * s, 18 * s, 0, 7); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2; for (let a = 0; a < 4; a++) { const an = a * Math.PI / 2 + Date.now() / 600; ctx.beginPath(); ctx.arc(cx, cy - 30 * s, 60 * s, an, an + 0.5); ctx.stroke(); } }
      else { ctx.fillStyle = c + '22'; ctx.beginPath(); ctx.arc(cx, cy, 56 * s, 0, 7); ctx.fill(); ctx.stroke(); ctx.setLineDash([4, 4]); for (let a = 0; a < 12; a++) { const an = a * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * 56 * s, cy + Math.sin(an) * 56 * s); ctx.stroke(); } ctx.setLineDash([]); ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cx, cy, 16 * s, 0, 7); ctx.fill(); ctx.fillStyle = c; ctx.font = (11 * s) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('360°', cx, cy + 4); }
    }
    function draw() { ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); cam(sel, W / 2, H / 2, 1.5, '#22d3ee'); ctx.fillStyle = '#cbd5e1'; ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(types.find(t => t.k === sel).n, W / 2, H - 16); }
    loop(canvas, draw);
    const btns = types.map(t => { const b = el('button', { class: 'btn' + (t.k === sel ? ' primary' : ''), text: t.n }); b.addEventListener('click', () => { sel = t.k; ro.set(t.use); row.querySelectorAll('.btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const row = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns); ro.set(types[0].use);
    return vcard({ icon: 'fa-camera', title: 'F · Kamera-Bauformen', sub: 'Dome · Bullet · Turret · PTZ · Fisheye',
      was: 'Die Bauform bestimmt Montage, Abschreckung und Blickfeld – wähle nach Einsatzort.',
      detail: '<b>Dome</b> dezent an der Decke; <b>Bullet</b> gerichtet mit Sonnenblende; <b>Turret</b> reflexionsarm & beliebt; <b>PTZ</b> motorisiert schwenk-/zoombar; <b>Fisheye</b> deckt 360° ab (Software-Entzerrung).',
      praxis: 'Einfahrt/Zaun → Bullet; Eingang/Raum innen → Dome/Turret; große Fläche aktiv → PTZ; ganzer Raum mit einer Kamera → Fisheye.',
      body: el('div', {}, [canvas, row, el('div', { class: 'phys-ros' }, [ro.wrap])]) });
  }

  function anschluesseSim() {
    const W = 560, H = 300, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let ip = false;
    function bnc(x, y, s) { ctx.strokeStyle = '#fbbf24'; ctx.fillStyle = '#1e293b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 16 * s, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(x, y, 5 * s, 0, 7); ctx.fill(); ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(x, y, 11 * s, 0, 7); ctx.stroke(); }
    function rj45(x, y, s) { ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.fillRect(x - 16 * s, y - 12 * s, 32 * s, 22 * s); ctx.strokeRect(x - 16 * s, y - 12 * s, 32 * s, 22 * s); ctx.fillStyle = '#22c55e'; ctx.fillRect(x - 5 * s, y + 10 * s, 10 * s, 5 * s); ctx.fillStyle = '#fbbf24'; for (let i = 0; i < 8; i++) ctx.fillRect(x - 14 * s + i * 3.6 * s, y - 12 * s, 2 * s, 7 * s); }
    function dc(x, y, s) { ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 14 * s, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(x, y, 4 * s, 0, 7); ctx.fill(); }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#22d3ee'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(ip ? 'IP-Kamera: 1 Buchse genügt' : 'Analog-Kamera: Video + Strom getrennt', W / 2, 30);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(W / 2 - 130, 55, 260, 90); ctx.strokeStyle = '#475569'; ctx.strokeRect(W / 2 - 130, 55, 260, 90);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText('Anschlussfeld der Kamera', W / 2, 70);
      if (ip) { rj45(W / 2, 110, 1.4); ctx.fillStyle = '#22c55e'; ctx.fillText('RJ45 · PoE (Strom + Daten)', W / 2, 138); }
      else { bnc(W / 2 - 50, 110, 1.3); ctx.fillStyle = '#fbbf24'; ctx.fillText('BNC · Video', W / 2 - 50, 138); dc(W / 2 + 55, 110, 1.3); ctx.fillStyle = '#ef4444'; ctx.fillText('DC · 12 V Strom', W / 2 + 55, 138); }
      // Legende
      ctx.textAlign = 'center'; const ly = 210;
      bnc(120, ly, 1.2); ctx.fillStyle = '#fbbf24'; ctx.fillText('BNC', 120, ly + 30); ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.fillText('Koax · Analog', 120, ly + 44); ctx.font = '11px sans-serif';
      rj45(280, ly, 1.2); ctx.fillStyle = '#22c55e'; ctx.fillText('RJ45', 280, ly + 30); ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.fillText('Netzwerk · PoE', 280, ly + 44); ctx.font = '11px sans-serif';
      dc(440, ly, 1.2); ctx.fillStyle = '#ef4444'; ctx.fillText('DC-Hohlstecker', 440, ly + 30); ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.fillText('12 V Strom', 440, ly + 44);
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn', html: '<i class="fas fa-plug"></i> Analog-Anschluss' });
    b.addEventListener('click', () => { ip = !ip; b.className = 'btn' + (ip ? ' primary' : ''); b.innerHTML = ip ? '<i class="fas fa-plug"></i> IP-Anschluss (PoE)' : '<i class="fas fa-plug"></i> Analog-Anschluss'; });
    return vcard({ icon: 'fa-plug-circle-bolt', title: 'G · Anschlüsse & Stecker', sub: 'BNC · RJ45 · DC – was wohin',
      was: 'Jede Kamera hat passende Buchsen. Analog braucht meist zwei Kabel (Video + Strom), IP nur eines.',
      detail: '<b>BNC</b> (runder Bajonett-Stecker) führt das analoge Videosignal übers Koaxkabel. <b>RJ45</b> ist der Netzwerkstecker; mit <b>PoE</b> kommen Strom und Daten über dasselbe Kabel. Der <b>DC-Hohlstecker</b> versorgt analoge Kameras mit 12 V.',
      praxis: 'IP/PoE spart Verkabelung (1 Kabel, 1 Switch). Bei Analog immer Video- und Stromweg getrennt planen.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b])]) });
  }

  function speicherRechnerSim() {
    const W = 560, H = 180, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const RES = [['2 MP · 1080p', 4000], ['4 MP', 8000], ['8 MP · 4K', 16000]];
    let cams = 8, ri = 1, fps = 15, tage = 14, h265 = true, motion = true;
    const roCam = (function () { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v' }); w.append(el('span', { class: 'phys-ro-l', text: 'pro Kamera/Tag' }), v); return { wrap: w, set: t => v.textContent = t }; })();
    const roTot = (function () { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v' }); w.append(el('span', { class: 'phys-ro-l', text: 'Gesamt-Speicher' }), v); return { wrap: w, set: (t, c) => { v.textContent = t; v.className = 'phys-ro-v ' + (c || ''); } }; })();
    function calc() { const base = RES[ri][1]; const per = base * (fps / 25) * (h265 ? 0.5 : 1) * (motion ? 0.4 : 1); const gbDay = per * 1000 / 8 * 86400 / 1e9; const tb = gbDay * cams * tage / 1000; return { gbDay, tb }; }
    function draw() {
      const r = calc(); ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // HDD
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.strokeRect(30, 40, 150, 90); const fill = Math.min(1, r.tb / 20);
      ctx.fillStyle = r.tb > 16 ? '#ef4444' : r.tb > 8 ? '#fbbf24' : '#22c55e'; ctx.fillRect(34, 44 + (82) * (1 - fill), 142, 82 * fill);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Festplatte', 105, 148);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '900 40px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(r.tb.toFixed(1) + ' TB', 220, 80);
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif'; ctx.fillText(cams + ' Kameras · ' + tage + ' Tage · ' + (h265 ? 'H.265' : 'H.264') + ' · ' + (motion ? 'bei Bewegung' : 'Dauer'), 220, 105);
      roCam.set(r.gbDay.toFixed(1) + ' GB'); roTot.set(r.tb.toFixed(1) + ' TB', r.tb > 16 ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const sl = (lbl, min, max, val, step, cb) => { const s = el('input', { type: 'range', min, max, step: step || '1', value: val, class: 'phys-slider' }); s.addEventListener('input', () => cb(+s.value)); return el('div', { class: 'phys-ctrl' }, [el('label', { text: lbl, style: 'min-width:130px' }), s]); };
    const resBtns = RES.map((r, i) => { const b = el('button', { class: 'btn' + (i === ri ? ' primary' : '') }); b.textContent = r[0]; b.addEventListener('click', () => { ri = i; resRow.querySelectorAll('.btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const resRow = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, resBtns);
    const h = el('button', { class: 'btn primary', text: 'H.265' }); h.addEventListener('click', () => { h265 = !h265; h.className = 'btn' + (h265 ? ' primary' : ''); h.textContent = h265 ? 'H.265' : 'H.264'; });
    const mo = el('button', { class: 'btn primary', text: 'bei Bewegung' }); mo.addEventListener('click', () => { motion = !motion; mo.className = 'btn' + (motion ? ' primary' : ''); mo.textContent = motion ? 'bei Bewegung' : 'Daueraufnahme'; });
    const body = el('div', {}, [canvas, resRow,
      sl('Kameras', '1', '64', '8', '1', v => cams = v), sl('Bildrate (fps)', '1', '30', '15', '1', v => fps = v), sl('Aufbewahrung (Tage)', '1', '90', '14', '1', v => tage = v),
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [h, mo]), el('div', { class: 'phys-ros' }, [roCam.wrap, roTot.wrap])]);
    return vcard({ icon: 'fa-database', title: 'H · Speicher-Rechner', sub: 'Wie viele TB brauche ich?',
      was: 'Schätzt den nötigen Festplatten-Speicher aus Kamerazahl, Auflösung, Bildrate, Aufbewahrungsdauer, Codec und Aufnahmemodus.',
      detail: 'Speicher = Bitrate × Zeit × Kameras. Höhere Auflösung/fps → mehr Bitrate. <b>H.265</b> halbiert sie, <b>Aufnahme bei Bewegung</b> spart oft ~60 %. Faustwerte – reale Werte je nach Szene/Hersteller.',
      praxis: 'Immer Reserve einplanen (RAID, Ausfall, Mehraufnahmen). Lange Aufbewahrung + viele 4K-Kameras = schnell zweistellige TB.', body });
  }

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Videotechnik · Deep-Dive</span>
      <h1>Videotechnik – die ganze Bildkette 📹</h1>
      <p class="lead">Erst <b>einfach & animiert</b>: wie eine Kamera aus Licht ein Bild macht, analog vs. IP, Aufzeichnung (DVR/NVR),
      Kabel/Übertragung und das ganze System. Danach die <b>Details</b> (Belichtung, IR, WDR, Auflösung, Codec, Analytics) – je mit <b>Was · Im Detail · Praxis</b>.</p>`;
    root.appendChild(intro);
    const cats = [
      { label: 'Grundlagen · So funktioniert es (einfach & animiert)', sims: [kameraGrundlageSim, analogIpSim, recorderSim, uebertragungSim, systemSim] },
      { label: 'Aufnahme · Belichtung & Licht', sims: [exposureSim, tagNachtSim, wdrSim] },
      { label: 'Bild · Auflösung & Kompression', sims: [aufloesungSim, kompressionSim, bildrateSim] },
      { label: 'Geräte & Planung', sims: [kameraTypenSim, anschluesseSim, speicherRechnerSim] },
      { label: 'Auswertung · Analytics', sims: [analyticsSim] },
    ];
    cats.forEach(c => { root.appendChild(el('div', { class: 'phys-cat', text: c.label })); const g = el('div', { class: 'phys-grid' }); c.sims.forEach(fn => g.appendChild(fn())); root.appendChild(g); });
    return root;
  }
  return { view };
})();
