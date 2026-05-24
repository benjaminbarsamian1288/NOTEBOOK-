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

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Videotechnik · Deep-Dive</span>
      <h1>Videotechnik – die ganze Bildkette 📹</h1>
      <p class="lead">Von einzelnen Photonen bis zum ausgewerteten Ereignis: 7 interaktive Stationen erklären die Videoüberwachung
      <b>Schritt für Schritt</b> – jeweils mit <b>Was</b>, <b>Im Detail</b> und <b>Praxis</b>. Schieber und Schalter zeigen die Wirkung sofort im Bild.</p>`;
    root.appendChild(intro);
    const cats = [
      { label: 'Aufnahme · Belichtung & Licht', sims: [exposureSim, tagNachtSim, wdrSim] },
      { label: 'Bild · Auflösung & Kompression', sims: [aufloesungSim, kompressionSim, bildrateSim] },
      { label: 'Auswertung · Analytics', sims: [analyticsSim] },
    ];
    cats.forEach(c => { root.appendChild(el('div', { class: 'phys-cat', text: c.label })); const g = el('div', { class: 'phys-grid' }); c.sims.forEach(fn => g.appendChild(fn())); root.appendChild(g); });
    return root;
  }
  return { view };
})();
