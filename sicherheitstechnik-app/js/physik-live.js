/* Physik Live – interaktive Echtzeit-Simulationen der Sensorphysik
   hinter Sicherheitstechnik. Jede Simulation läuft per requestAnimationFrame,
   ist anfassbar (Slider/Ziehen/Knopf) und in Klartext erklärt.
   Aufbau: window.PHYSIK.view() liefert einen HTMLElement-Knoten. */
window.PHYSIK = (() => {
  const { el } = U;

  /* rAF-Schleife, die sich selbst stoppt, sobald die Ansicht gewechselt wird
     (Canvas nicht mehr im DOM) – verhindert Zombie-Loops/Speicherlecks. */
  function loop(canvas, draw) {
    function frame(t) {
      if (!canvas.isConnected) return;
      draw(t);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function pos(canvas, ev) {
    const r = canvas.getBoundingClientRect();
    const p = ev.touches ? ev.touches[0] : ev;
    return {
      x: (p.clientX - r.left) * canvas.width / r.width,
      y: (p.clientY - r.top) * canvas.height / r.height,
    };
  }

  // Eisen-Farbpalette für Wärmebild (t = 0..1)
  function iron(t) {
    t = Math.max(0, Math.min(1, t));
    const s = [[0, 4, 2, 18], [0.25, 70, 0, 100], [0.45, 170, 25, 70], [0.62, 232, 75, 20], [0.8, 255, 175, 35], [1, 255, 255, 235]];
    for (let i = 1; i < s.length; i++) {
      if (t <= s[i][0]) { const a = s[i - 1], b = s[i], f = (t - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f]; }
    }
    return [255, 255, 235];
  }

  // Abstand Punkt → Strecke
  function distSeg(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
    let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  /* Baukasten für eine Simulationskarte: Kopf + Erklärbox + Body. */
  function simCard(opts) {
    const c = el('div', { class: 'phys-card' });
    c.appendChild(el('div', { class: 'phys-head' }, [
      el('div', { class: 'phys-ico', html: `<i class="fas ${opts.icon}"></i>` }),
      el('div', {}, [
        el('h3', { text: opts.title }),
        el('div', { class: 'phys-sub', text: opts.sub }),
      ]),
    ]));
    c.appendChild(el('div', { class: 'phys-explain' }, [
      el('div', { class: 'phys-ex-row', html: `<b>Das passiert hier:</b> ${opts.was}` }),
      el('div', { class: 'phys-ex-row', html: `<b>Warum wichtig:</b> ${opts.warum}` }),
    ]));
    c.appendChild(opts.body);
    return c;
  }

  function readout(label) {
    const wrap = el('div', { class: 'phys-ro' });
    const val = el('span', { class: 'phys-ro-v', text: '–' });
    wrap.appendChild(el('span', { class: 'phys-ro-l', text: label }));
    wrap.appendChild(val);
    return { wrap, set: (t, cls) => { val.textContent = t; val.className = 'phys-ro-v' + (cls ? ' ' + cls : ''); } };
  }

  /* ============================================================
     1) PIR – Passiv-Infrarot-Bewegungsmelder
     ============================================================ */
  function pirSim() {
    const W = 720, H = 320;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const det = { x: 70, y: H / 2 };
    const ZONES = 8;                       // Fresnel-Segmente
    const spread = 0.95;                    // Öffnungswinkel (rad, halb)
    const person = { x: 480, y: H / 2, r: 16, auto: true, dir: 1, dragging: false };
    const buf = new Array(W).fill(H - 40);  // Signal-Graphverlauf
    let lastZone = null, signal = 0, alarmT = 0;

    function zoneOf(px, py) {
      const ang = Math.atan2(py - det.y, px - det.x);
      if (Math.abs(ang) > spread) return -1;          // außerhalb des Sichtfelds
      const f = (ang + spread) / (2 * spread);        // 0..1
      return Math.min(ZONES - 1, Math.floor(f * ZONES));
    }

    const roZone = readout('Erfasste Zone');
    const roSig = readout('Sensor-Signal');
    const roStat = readout('Status');

    function down(e) { person.dragging = true; person.auto = false; move(e); }
    function move(e) {
      if (!person.dragging) return;
      e.preventDefault();
      const p = pos(canvas, e);
      person.x = Math.max(det.x + 60, Math.min(W - 20, p.x));
      person.y = Math.max(30, Math.min(H - 30, p.y));
    }
    function up() { person.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);

    function draw() {
      // Auto-Bewegung wenn nicht gezogen
      if (person.auto) {
        person.x += person.dir * 2.4;
        if (person.x > W - 40 || person.x < det.x + 80) person.dir *= -1;
      }
      const z = zoneOf(person.x, person.y);
      // Signal = Reaktion auf Zonenwechsel (Bewegung über Segmentgrenze)
      if (lastZone !== null && z !== -1 && z !== lastZone) signal = 1;
      signal *= 0.88;                         // Abklingen
      if (lastZone !== z) lastZone = z;
      const alarm = signal > 0.45;
      if (alarm) alarmT = 16;
      if (alarmT > 0) alarmT--;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);

      // Fresnel-Erfassungszonen (abwechselnd hell/dunkel)
      for (let i = 0; i < ZONES; i++) {
        const a0 = -spread + (2 * spread) * (i / ZONES);
        const a1 = -spread + (2 * spread) * ((i + 1) / ZONES);
        ctx.beginPath();
        ctx.moveTo(det.x, det.y);
        ctx.lineTo(det.x + Math.cos(a0) * 640, det.y + Math.sin(a0) * 640);
        ctx.lineTo(det.x + Math.cos(a1) * 640, det.y + Math.sin(a1) * 640);
        ctx.closePath();
        const active = (i === z);
        ctx.fillStyle = active ? 'rgba(251,191,36,0.30)' : (i % 2 ? 'rgba(34,211,238,0.06)' : 'rgba(34,211,238,0.13)');
        ctx.fill();
      }

      // Detektor
      ctx.fillStyle = alarmT > 0 ? '#ef4444' : '#22d3ee';
      ctx.fillRect(det.x - 16, det.y - 22, 22, 44);
      ctx.fillStyle = '#0b1424'; ctx.fillRect(det.x - 11, det.y - 16, 6, 32);

      // Person (Wärmequelle) mit Glühen
      const g = ctx.createRadialGradient(person.x, person.y, 2, person.x, person.y, 34);
      g.addColorStop(0, 'rgba(248,113,113,0.9)'); g.addColorStop(1, 'rgba(248,113,113,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(person.x, person.y, 34, 0, 7); ctx.fill();
      ctx.fillStyle = '#fca5a5'; ctx.beginPath(); ctx.arc(person.x, person.y, person.r, 0, 7); ctx.fill();
      ctx.fillStyle = '#7f1d1d'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🔥', person.x, person.y + 4);

      // Signal-Graph unten
      buf.push(H - 30 - signal * 70); buf.shift();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 0; x < W; x++) { x ? ctx.lineTo(x, buf[x]) : ctx.moveTo(x, buf[x]); }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(239,68,68,0.5)'; ctx.setLineDash([5, 4]); ctx.beginPath();
      ctx.moveTo(0, H - 30 - 0.45 * 70); ctx.lineTo(W, H - 30 - 0.45 * 70); ctx.stroke(); ctx.setLineDash([]);

      roZone.set(z === -1 ? 'außerhalb' : 'Segment ' + (z + 1));
      roSig.set((signal * 100).toFixed(0) + ' %');
      roStat.set(alarmT > 0 ? 'ALARM' : 'ruhig', alarmT > 0 ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Ziehe die Wärmequelle (🔥) durch das Sichtfeld. Bewegt sie sich über die Segmentgrenzen, schlägt der Sensor aus.' }),
      el('div', { class: 'phys-ros' }, [roZone.wrap, roSig.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-person-walking-arrow-right', title: 'PIR · Passiv-Infrarot-Melder',
      sub: 'Bewegungsmelder über Körperwärme',
      was: 'Eine Fresnel-Linse teilt das Sichtfeld in viele Segmente. Eine Wärmequelle (Mensch) erzeugt beim <b>Wechsel</b> von einem Segment ins nächste einen Signalsprung im Pyro-Sensor.',
      warum: 'Deshalb erkennt ein PIR <b>Bewegung quer</b> zum Melder am besten – und eine völlig stillstehende Person kaum. Er ist „passiv": sendet nichts, misst nur Wärmeänderung.',
      body,
    });
  }

  /* ============================================================
     2) Doppler – Mikrowellen-/Radar-Melder
     ============================================================ */
  function dopplerSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const f0 = 24e9, c = 3e8;             // 24 GHz
    let speed = 30;                        // km/h, via Slider
    let phase = 0;
    const target = { x: W * 0.62, y: H / 2 };

    const roShift = readout('Doppler-Verschiebung');
    const roSpeed = readout('Zielgeschwindigkeit');
    const roStat = readout('Status');

    function draw() {
      const v = speed / 3.6;               // m/s
      target.x += (speed / 3.6) * 0.6;
      if (target.x > W - 40) target.x = W - 40;
      if (target.x < W * 0.45) target.x = W * 0.45;
      if (speed === 0) target.x = W * 0.6;
      phase += 0.06;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const emit = { x: 60, y: H / 2 };

      // ausgesandte Wellenfronten (gleichmäßig)
      ctx.strokeStyle = 'rgba(34,211,238,0.55)'; ctx.lineWidth = 2;
      for (let i = 0; i < 9; i++) {
        const r = ((phase * 18 + i * 34) % 320);
        ctx.beginPath(); ctx.arc(emit.x, emit.y, r, -1, 1); ctx.stroke();
      }
      // reflektierte Fronten (Abstand je nach Geschwindigkeit gestaucht/gedehnt)
      const refSpacing = 30 - Math.sign(speed) * Math.min(18, Math.abs(speed) * 0.3);
      ctx.strokeStyle = speed === 0 ? 'rgba(148,163,184,0.4)' : 'rgba(251,191,36,0.6)';
      for (let i = 0; i < 7; i++) {
        const r = ((phase * 18 + i * refSpacing) % 260);
        ctx.beginPath(); ctx.arc(target.x, target.y, r, Math.PI - 1, Math.PI + 1); ctx.stroke();
      }

      // Sender + Ziel
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(emit.x - 14, emit.y - 18, 18, 36);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(target.x - 14, target.y - 14, 28, 28);
      ctx.fillStyle = '#0b1424'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🚗', target.x, target.y + 5);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
      ctx.fillText('Sender 24 GHz', emit.x, emit.y + 40);

      const df = 2 * v * f0 / c;           // Doppler (Reflexion → Faktor 2)
      roShift.set(speed === 0 ? '0 Hz' : df.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' Hz');
      roSpeed.set(speed + ' km/h');
      roStat.set(speed === 0 ? 'kein Alarm (steht)' : 'Bewegung erkannt', speed === 0 ? 'ok' : 'bad');
    }
    loop(canvas, draw);

    const slider = el('input', { type: 'range', min: '0', max: '120', value: '30', class: 'phys-slider' });
    slider.addEventListener('input', () => { speed = +slider.value; });

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Geschwindigkeit des Ziels' }), slider]),
      el('div', { class: 'phys-ros' }, [roSpeed.wrap, roShift.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-tower-broadcast', title: 'Mikrowellen-Melder · Doppler-Radar',
      sub: 'Aktiv: sendet Funkwellen aus',
      was: 'Der Melder sendet Mikrowellen (z.B. 24 GHz). Reflexionen von einem <b>bewegten</b> Objekt kommen mit veränderter Frequenz zurück (Doppler-Effekt) – je schneller, desto größer die Verschiebung Δf.',
      warum: 'Ein <b>stehendes</b> Objekt erzeugt keine Verschiebung → kein Alarm. Mikrowelle durchdringt dünne Wände – deshalb oft mit PIR als „Dual-Melder" kombiniert (beide müssen auslösen).',
      body,
    });
  }

  /* ============================================================
     3) Magnetkontakt (Reed) an Tür/Fenster
     ============================================================ */
  function reedSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let gap = 4;                            // mm Türspalt, via Slider
    const THRESH = 15;                      // Auslöseschwelle mm

    const roGap = readout('Türspalt');
    const roField = readout('Magnetfeld am Reed');
    const roStat = readout('Kontakt');

    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const frameX = 300, doorX = frameX + gap * 7;   // mm → px
      // Rahmen (mit Reed)
      ctx.fillStyle = '#1e293b'; ctx.fillRect(frameX - 90, 40, 90, H - 80);
      // Tür (mit Magnet)
      ctx.fillStyle = '#334155'; ctx.fillRect(doorX, 40, 260, H - 80);
      ctx.fillStyle = '#475569'; ctx.fillRect(doorX + 220, H / 2 - 14, 10, 28); // Klinke

      const reed = { x: frameX - 8, y: H / 2 };
      const magnet = { x: doorX + 6, y: H / 2 };
      const field = Math.min(1, 90 / ((gap + 2) * (gap + 2)));  // ~1/r²
      const closed = gap < THRESH;

      // Feldlinien zwischen Magnet und Reed
      ctx.strokeStyle = `rgba(96,165,250,${0.15 + field * 0.7})`; ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        const y = H / 2 + i * 12;
        ctx.moveTo(magnet.x, y);
        ctx.bezierCurveTo((magnet.x + reed.x) / 2, y + i * 8, (magnet.x + reed.x) / 2, y + i * 8, reed.x, H / 2 + i * 6);
        ctx.stroke();
      }
      // Magnet
      ctx.fillStyle = '#ef4444'; ctx.fillRect(magnet.x, H / 2 - 22, 14, 22);
      ctx.fillStyle = '#3b82f6'; ctx.fillRect(magnet.x, H / 2, 14, 22);
      // Reed-Sensor
      ctx.fillStyle = closed ? '#22c55e' : '#ef4444';
      ctx.fillRect(reed.x - 16, H / 2 - 18, 16, 36);
      ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(closed ? '✓' : '✕', reed.x - 8, H / 2 + 4);
      // Labels
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif';
      ctx.fillText('Rahmen + Reed', frameX - 45, 30); ctx.fillText('Tür + Magnet', doorX + 120, 30);

      roGap.set(gap + ' mm');
      roField.set((field * 100).toFixed(0) + ' %');
      roStat.set(closed ? 'geschlossen (Ruhe)' : 'offen → ALARM', closed ? 'ok' : 'bad');
    }
    loop(canvas, draw);

    const slider = el('input', { type: 'range', min: '0', max: '40', value: '4', class: 'phys-slider' });
    slider.addEventListener('input', () => { gap = +slider.value; });

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Tür öffnen (Spalt in mm)' }), slider]),
      el('div', { class: 'phys-ros' }, [roGap.wrap, roField.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-door-open', title: 'Magnetkontakt · Reed-Schalter',
      sub: 'Öffnungsmelder an Tür & Fenster',
      was: 'Ein Magnet auf der Tür hält im Rahmen einen Reed-Kontakt geschlossen. Das Feld wird mit dem Abstand schnell schwächer (≈ 1/Abstand²). Ab ca. <b>15 mm</b> fällt der Kontakt ab.',
      warum: 'Der Stromkreis wird unterbrochen → <b>Alarm</b>. Einfachstes, störungsärmstes Prinzip der EMA – aber nur für „offen/zu", nicht für Bewegung im Raum.',
      body,
    });
  }

  /* ============================================================
     4) Glasbruchmelder (akustisch, zweistufig)
     ============================================================ */
  function glassSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let event = null;                       // {t, type}
    let t0 = 0;

    const roStage = readout('Erkennungsstufe');
    const roStat = readout('Status');

    function trigger(type) { event = { type, start: performance.now() }; }

    function draw(now) {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.beginPath();
      ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

      let stage = '–', alarm = false;
      let amp = 0, freq = 0.05;
      if (event) {
        const dt = (now - event.start);
        if (dt < 350) { amp = 60 * Math.exp(-dt / 250); freq = 0.04; stage = 'Stufe 1: Tieffrequenter Schlag (Anprall)'; }
        else if (dt < 1100 && event.type === 'break') { amp = 80 * Math.exp(-(dt - 350) / 380); freq = 0.55; stage = 'Stufe 2: Hochfrequentes Splittern'; }
        else {
          if (event.type === 'break') { stage = 'Sequenz vollständig'; alarm = true; }
          else stage = 'nur Schlag → verworfen';
          if (dt > 2200) event = null;
        }
        // Wellenform
        ctx.strokeStyle = freq > 0.3 ? '#f472b6' : '#fbbf24'; ctx.lineWidth = 2; ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const y = H / 2 + Math.sin(x * freq + now / 80) * amp * (1 - x / W) * Math.random() * 0.4
            + Math.sin(x * freq + now / 60) * amp * (1 - Math.abs(x - W / 2) / (W / 2));
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      // Frequenzbänder
      const lowOn = event && (now - event.start) < 350;
      const highOn = event && event.type === 'break' && (now - event.start) >= 350 && (now - event.start) < 1100;
      ctx.fillStyle = lowOn ? '#fbbf24' : 'rgba(251,191,36,0.2)'; ctx.fillRect(40, H - 50, 120, 30);
      ctx.fillStyle = highOn ? '#f472b6' : 'rgba(244,114,182,0.2)'; ctx.fillRect(W - 160, H - 50, 120, 30);
      ctx.fillStyle = '#cbd5e1'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('tieffrequent (Schlag)', 100, H - 30); ctx.fillText('hochfrequent (Splittern)', W - 100, H - 30);

      roStage.set(stage);
      roStat.set(alarm ? 'ALARM (Glasbruch)' : (event ? 'prüft…' : 'ruhig'), alarm ? 'bad' : (event ? 'warn' : 'ok'));
    }
    loop(canvas, draw);

    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-hand-fist"></i> Glas zerbrechen' });
    b1.addEventListener('click', () => trigger('break'));
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-hand"></i> Nur dagegen klopfen' });
    b2.addEventListener('click', () => trigger('thud'));

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2]),
      el('div', { class: 'phys-ros' }, [roStage.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-wine-glass-crack', title: 'Glasbruchmelder · akustisch',
      sub: 'Hört auf die typische Klang-Sequenz',
      was: 'Echtes Glasbrechen erzeugt zuerst einen <b>tieffrequenten Schlag</b> (Anprall), dann ein <b>hochfrequentes Splittern</b>. Nur diese Reihenfolge in kurzer Zeit löst aus.',
      warum: 'So werden Fehlalarme vermieden: Bloßes Klopfen (nur Stufe 1) oder ein klirrendes Glas (nur Stufe 2) reicht nicht – <b>beide Stufen</b> müssen kommen.',
      body,
    });
  }

  /* ============================================================
     5) Lichtschranke / Infrarot-Beam
     ============================================================ */
  function beamSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const obj = { x: W / 2, y: -100, auto: true, dragging: false };
    const beamY = H / 2;

    const roRecv = readout('Empfänger-Pegel');
    const roStat = readout('Status');

    function down(e) { obj.dragging = true; obj.auto = false; move(e); }
    function move(e) { if (!obj.dragging) return; e.preventDefault(); const p = pos(canvas, e); obj.x = p.x; obj.y = p.y; }
    function up() { obj.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);

    let ta = 0;
    function draw() {
      if (obj.auto) { ta += 0.02; obj.x = W / 2 + Math.sin(ta) * 230; obj.y = beamY; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);

      const blocked = Math.abs(obj.y - beamY) < 26 && obj.x > 70 && obj.x < W - 70;
      // Strahl
      ctx.strokeStyle = blocked ? 'rgba(239,68,68,0.25)' : 'rgba(248,113,113,0.85)';
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(70, beamY);
      ctx.lineTo(blocked ? obj.x : W - 70, beamY); ctx.stroke();
      if (!blocked) { ctx.strokeStyle = 'rgba(248,113,113,0.25)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(70, beamY); ctx.lineTo(W - 70, beamY); ctx.stroke(); }

      // Sender / Empfänger
      ctx.fillStyle = '#f87171'; ctx.fillRect(48, beamY - 24, 24, 48);
      ctx.fillStyle = blocked ? '#ef4444' : '#22c55e'; ctx.fillRect(W - 72, beamY - 24, 24, 48);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sender', 60, beamY + 42); ctx.fillText('Empfänger', W - 60, beamY + 42);

      // Objekt
      ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(obj.x, obj.y, 22, 0, 7); ctx.fill();
      ctx.fillStyle = '#0b1424'; ctx.font = '16px sans-serif'; ctx.fillText('🚶', obj.x, obj.y + 5);

      roRecv.set(blocked ? '0 %' : '100 %');
      roStat.set(blocked ? 'Strahl unterbrochen → ALARM' : 'frei', blocked ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Zieh die Person in den Strahl – sobald sie ihn unterbricht, fällt der Empfänger-Pegel auf 0.' }),
      el('div', { class: 'phys-ros' }, [roRecv.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-grip-lines', title: 'Lichtschranke · Infrarot-Beam',
      sub: 'Aktiv: gebündelter Lichtstrahl',
      was: 'Ein gebündelter (Infrarot-)Strahl trifft auf einen Empfänger. Wird der Strahl <b>unterbrochen</b>, bricht der Empfangspegel ein.',
      warum: 'Sehr zuverlässig für Linien: Türen, Durchgänge, Perimeter. Bei Tor-/Perimeteranlagen oft mehrere übereinander gestapelt (Lichtgitter), damit nichts „untendurch" kommt.',
      body,
    });
  }

  /* ============================================================
     6) Ultraschall-Bewegungsmelder (Doppler im Schallfeld)
     ============================================================ */
  function ultraschallSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let move = 25;                          // Bewegungsstärke 0..100
    let phase = 0;
    const cols = 60, rows = 24;

    const roMove = readout('Bewegung im Raum');
    const roField = readout('Feldänderung');
    const roStat = readout('Status');

    function draw() {
      phase += 0.16;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const emit = { x: 60, y: H / 2 };
      const obj = { x: W * 0.6 + Math.sin(phase * 0.3) * move * 1.6, y: H / 2 + Math.cos(phase * 0.2) * move * 0.6 };
      const cw = W / cols, ch = H / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cw + cw / 2, y = j * ch + ch / 2;
          const d1 = Math.hypot(x - emit.x, y - emit.y);
          let v = Math.sin(d1 * 0.08 - phase);
          if (move > 0) {
            const d2 = Math.hypot(x - obj.x, y - obj.y);
            v += Math.sin(d2 * 0.12 - phase * 1.4) * (move / 100);
          }
          const b = (v + 1.4) / 2.8;
          ctx.fillStyle = `rgba(34,211,238,${Math.max(0, b * 0.7)})`;
          ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
        }
      }
      ctx.fillStyle = '#22d3ee'; ctx.fillRect(emit.x - 14, emit.y - 18, 18, 36);
      if (move > 0) { ctx.fillStyle = 'rgba(248,113,113,0.9)'; ctx.beginPath(); ctx.arc(obj.x, obj.y, 12, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sender/Empfänger 40 kHz', emit.x + 30, emit.y + 42);

      roMove.set(move + ' %');
      roField.set(move === 0 ? 'stehendes Feld' : (move < 8 ? 'minimal' : 'stark verändert'));
      roStat.set(move < 8 ? 'kein Alarm' : 'Bewegung erkannt', move < 8 ? 'ok' : 'bad');
    }
    loop(canvas, draw);

    const slider = el('input', { type: 'range', min: '0', max: '100', value: '25', class: 'phys-slider' });
    slider.addEventListener('input', () => { move = +slider.value; });
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Bewegung im Raum' }), slider]),
      el('div', { class: 'phys-ros' }, [roMove.wrap, roField.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-volume-high', title: 'Ultraschall-Melder', sub: 'Aktiv: füllt den Raum mit Schallfeld',
      was: 'Ein Sender erzeugt ein unhörbares Schallfeld (~40 kHz), das den ganzen Raum mit einem stehenden Interferenzmuster füllt. <b>Bewegung</b> verschiebt das Muster (Doppler im Schall).',
      warum: 'Sehr empfindlich im geschlossenen Raum – reagiert aber auch auf Luftzug/Vorhänge. Daher meist als Ergänzung, nicht allein.',
      body,
    });
  }

  /* ============================================================
     7) Erschütterungs-/Körperschallmelder (Seismik am Tresor)
     ============================================================ */
  function seismikSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const buf = new Array(W).fill(H / 2);
    let energy = 0, attack = null, alarmHold = 0;

    const roEnergy = readout('Energie im Fenster');
    const roStat = readout('Status');

    function trigger(type) { attack = { type, start: performance.now() }; }

    function draw(now) {
      let amp = 0;
      if (attack) {
        const dt = now - attack.start;
        if (attack.type === 'hit') { amp = dt < 220 ? 70 * Math.exp(-dt / 90) : 0; if (dt > 600) attack = null; }
        else { amp = 38 + Math.sin(dt / 30) * 18; if (dt > 2600) attack = null; }   // Bohren: anhaltend
      }
      // Signal
      const s = (Math.random() - 0.5) * amp + Math.sin(now / 20) * amp * 0.5;
      buf.push(H / 2 + s); buf.shift();
      // Energie-Integrator (gleitendes Fenster)
      energy = energy * 0.96 + Math.abs(s) * 0.04;
      const THRESH = 1.1;
      const alarm = energy > THRESH;
      if (alarm) alarmHold = 30; if (alarmHold > 0) alarmHold--;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(148,163,184,0.2)'; ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
      ctx.strokeStyle = alarmHold > 0 ? '#ef4444' : '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 0; x < W; x++) { x ? ctx.lineTo(x, buf[x]) : ctx.moveTo(x, buf[x]); }
      ctx.stroke();
      // Energiebalken
      ctx.fillStyle = 'rgba(148,163,184,0.15)'; ctx.fillRect(20, 20, 200, 14);
      ctx.fillStyle = alarmHold > 0 ? '#ef4444' : '#fbbf24'; ctx.fillRect(20, 20, Math.min(200, energy / THRESH * 200), 14);
      ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(220, 16); ctx.lineTo(220, 38); ctx.stroke();

      roEnergy.set((energy / THRESH * 100).toFixed(0) + ' %');
      roStat.set(alarmHold > 0 ? 'ALARM (Angriff)' : (attack ? 'misst…' : 'ruhig'), alarmHold > 0 ? 'bad' : (attack ? 'warn' : 'ok'));
    }
    loop(canvas, draw);

    const b1 = el('button', { class: 'btn', html: '<i class="fas fa-hand-back-fist"></i> Einzelner Schlag' });
    b1.addEventListener('click', () => trigger('hit'));
    const b2 = el('button', { class: 'btn primary', html: '<i class="fas fa-screwdriver-wrench"></i> Bohren / Flexen' });
    b2.addEventListener('click', () => trigger('drill'));
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2]),
      el('div', { class: 'phys-ros' }, [roEnergy.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-tower-cell', title: 'Erschütterungsmelder · Körperschall', sub: 'An Tresor, Wand & Geldautomat',
      was: 'Ein Sensor misst Vibrationen im Material. Statt jeder Spitze zählt die <b>Energie über ein Zeitfenster</b>: ein einzelner Schlag verpufft, anhaltendes Bohren/Flexen lädt den Speicher bis zur Schwelle auf.',
      warum: 'So unterscheidet er einen harmlosen Stoß von einem echten Aufbruchsversuch – wichtig bei Tresoren und Geldautomaten.',
      body,
    });
  }

  /* ============================================================
     8) Schließzylinder · Pin-Tumbler (Picking)
     ============================================================ */
  function lockSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const N = 5;
    let pins = Array.from({ length: N }, () => ({ set: false, lift: 0 }));
    let angle = 0, targetAngle = 0, picking = -1;

    const roSet = readout('Stifte gesetzt');
    const roStat = readout('Zylinder');

    function pickNext() {
      const i = pins.findIndex(p => !p.set);
      if (i >= 0) { picking = i; }
    }
    function reset() { pins = Array.from({ length: N }, () => ({ set: false, lift: 0 })); targetAngle = 0; }

    function draw() {
      if (picking >= 0) {
        pins[picking].lift += 0.08;
        if (pins[picking].lift >= 1) { pins[picking].lift = 1; pins[picking].set = true; picking = -1; }
      }
      if (pins.every(p => p.set)) targetAngle = 0.5;
      angle += (targetAngle - angle) * 0.12;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2 + 20, plugR = 70;
      // Gehäuse
      ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - 220, cy - 120, 440, 200);
      // Bohrungen + Stifte
      const shearY = cy - plugR;
      const spacing = 60;
      for (let i = 0; i < N; i++) {
        const x = cx - (N - 1) / 2 * spacing + i * spacing;
        // Bohrkanal
        ctx.fillStyle = '#0b1424'; ctx.fillRect(x - 10, cy - 150, 20, 150);
        const lift = pins[i].lift * 26;
        // Treiberstift (oben, silber)
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(x - 9, cy - 150 + (pins[i].set ? -2 : 0) + lift, 18, 40 - 0);
        // Kernstift (gold) sitzt am Schließbart
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(x - 9, shearY - 26 + lift, 18, 30);
        // Feder
        ctx.strokeStyle = '#475569'; ctx.beginPath();
        for (let s = 0; s < 6; s++) { ctx.moveTo(x - 7, cy - 150 + s * 4 + lift); ctx.lineTo(x + 7, cy - 148 + s * 4 + lift); }
        ctx.stroke();
      }
      // Scherlinie
      ctx.strokeStyle = pins.every(p => p.set) ? '#22c55e' : 'rgba(239,68,68,0.7)';
      ctx.setLineDash([6, 4]); ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(cx - 200, shearY); ctx.lineTo(cx + 200, shearY); ctx.stroke(); ctx.setLineDash([]);
      // Plug (drehbar)
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.arc(0, 0, plugR, 0, 7); ctx.fill();
      ctx.fillStyle = '#475569'; ctx.fillRect(-10, -plugR, 20, plugR); // Keilnut
      ctx.restore();
      ctx.fillStyle = '#cbd5e1'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Scherlinie', cx + 250, shearY + 4);

      roSet.set(pins.filter(p => p.set).length + ' / ' + N);
      roStat.set(pins.every(p => p.set) ? 'GEÖFFNET' : 'gesperrt', pins.every(p => p.set) ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-screwdriver"></i> Nächsten Stift picken' });
    b1.addEventListener('click', pickNext);
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Zurücksetzen' });
    b2.addEventListener('click', reset);
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2]),
      el('div', { class: 'phys-ros' }, [roSet.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-key', title: 'Schließzylinder · Pin-Tumbler', sub: 'Warum mechanische Schließung wirkt',
      was: 'Federn drücken Stiftpaare über die <b>Scherlinie</b> und blockieren den Kern. Erst wenn jeder Kernstift exakt an der Scherlinie steht (durch Schlüssel oder Picking), kann sich der Kern drehen.',
      warum: 'Je mehr Stifte und je enger die Toleranzen, desto pick-sicherer. Aufbohrschutz und Not-/Gefahrenfunktion sind Themen der RC-Klassen (DIN EN 1627).',
      body,
    });
  }

  /* ============================================================
     9) Kapazitiver Näherungssensor
     ============================================================ */
  function kapazitivSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const plate = { x: 90, y: H / 2 };
    const hand = { x: W * 0.7, y: H / 2, dragging: false, auto: true };
    let ta = 0;

    const roDist = readout('Abstand');
    const roCap = readout('Kapazität');
    const roStat = readout('Status');

    function down(e) { hand.dragging = true; hand.auto = false; move(e); }
    function move(e) { if (!hand.dragging) return; e.preventDefault(); const p = pos(canvas, e); hand.x = Math.max(plate.x + 30, p.x); hand.y = p.y; }
    function up() { hand.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);

    function draw() {
      if (hand.auto) { ta += 0.018; hand.x = W * 0.55 + Math.sin(ta) * 220; hand.y = H / 2; }
      const d = Math.max(8, hand.x - plate.x);
      const C = 1200 / d;                    // C ∝ 1/d (illustrativ, pF)
      const alarm = d < 120;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Feldlinien
      const strength = Math.min(1, 120 / d);
      ctx.strokeStyle = `rgba(34,211,238,${0.15 + strength * 0.6})`;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); const y = plate.y + i * 16;
        ctx.moveTo(plate.x + 8, y);
        ctx.quadraticCurveTo((plate.x + hand.x) / 2, y + i * 10, hand.x - 14, plate.y + i * 8);
        ctx.stroke();
      }
      // Platte (Sensor)
      ctx.fillStyle = alarm ? '#ef4444' : '#22d3ee'; ctx.fillRect(plate.x - 10, plate.y - 50, 12, 100);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sensorfläche', plate.x, plate.y + 70);
      // Hand
      ctx.font = '34px sans-serif'; ctx.fillText('✋', hand.x, hand.y + 12);

      roDist.set(Math.round(d / 4) + ' cm');
      roCap.set(C.toFixed(0) + ' pF');
      roStat.set(alarm ? 'Annäherung erkannt' : 'frei', alarm ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Zieh die Hand näher an die Sensorfläche – die Kapazität steigt, je geringer der Abstand.' }),
      el('div', { class: 'phys-ros' }, [roDist.wrap, roCap.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-hand-sparkles', title: 'Kapazitiver Näherungssensor', sub: 'Reagiert ohne Berührung',
      was: 'Eine Sensorfläche bildet mit der Umgebung einen Kondensator. Nähert sich ein Körper (leitfähig, z.B. Hand), <b>steigt die Kapazität</b> (≈ 1/Abstand) – die Elektronik erkennt die Änderung.',
      warum: 'Berührungslos und versteckt einbaubar – genutzt für Objektschutz an Vitrinen, Tresoren und Bedienfeldern.',
      body,
    });
  }

  /* ============================================================
     10) Wärmebildkamera (Thermal / IR)
     ============================================================ */
  function thermalSim() {
    const W = 720, H = 320;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const SW = 160, SH = 72;
    const off = document.createElement('canvas'); off.width = SW; off.height = SH;
    const octx = off.getContext('2d'); const img = octx.createImageData(SW, SH);
    const person = { x: 0.6, y: 0.5, temp: 1, r: 0.16, auto: true, dir: 1, dragging: false };
    const fixed = [{ x: 0.86, y: 0.72, temp: 0.55, r: 0.1 }, { x: 0.2, y: 0.8, temp: 0.4, r: 0.09 }];

    const roMax = readout('Heißester Punkt');
    const roStat = readout('Status');

    function down(e) { person.dragging = true; person.auto = false; move(e); }
    function move(e) { if (!person.dragging) return; e.preventDefault(); const p = pos(canvas, e); person.x = p.x / W; person.y = p.y / H; }
    function up() { person.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);

    function draw() {
      if (person.auto) { person.x += person.dir * 0.004; if (person.x > 0.9 || person.x < 0.1) person.dir *= -1; }
      const src = [person, ...fixed];
      let maxT = 0;
      for (let j = 0; j < SH; j++) {
        for (let i = 0; i < SW; i++) {
          const nx = i / SW, ny = j / SH; let t = 0.08;
          for (const s of src) { const dx = nx - s.x, dy = ny - s.y; t += s.temp * Math.exp(-(dx * dx + dy * dy) / (2 * s.r * s.r)); }
          if (t > maxT) maxT = t;
          const [r, g, b] = iron(t); const k = (j * SW + i) * 4;
          img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = b; img.data[k + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, W, H);
      // Fadenkreuz auf Person
      const px = person.x * W, py = person.y * H;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(px - 16, py - 26, 32, 52);
      ctx.fillStyle = '#fff'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
      ctx.fillText((20 + Math.min(1, maxT) * 17).toFixed(1) + '°C', px, py - 32);

      roMax.set((20 + Math.min(1, maxT) * 17).toFixed(1) + ' °C');
      roStat.set(maxT > 0.45 ? 'Wärmequelle erkannt' : 'nur Umgebung', maxT > 0.45 ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Zieh die warme Person durchs Bild. Die Kamera sieht nicht Licht, sondern Temperatur.' }),
      el('div', { class: 'phys-ros' }, [roMax.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-temperature-three-quarters', title: 'Wärmebildkamera · Thermal', sub: 'Sieht Temperatur statt Licht',
      was: 'Jeder Körper strahlt Infrarot ab – je wärmer, desto stärker. Der Sensor übersetzt die <b>Wärmeabstrahlung</b> in ein Falschfarbenbild (dunkel = kalt, weiß = heiß).',
      warum: 'Funktioniert in <b>völliger Dunkelheit</b> und durch Rauch/Nebel – deshalb top für Perimeter bei Nacht. Verrät Personen, die optische Kameras nicht sehen.',
      body,
    });
  }

  /* ============================================================
     11) Radar-Sweep-Scope
     ============================================================ */
  function radarSim() {
    const W = 720, H = 360;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const cx = W / 2, cy = H / 2, R = H / 2 - 16;
    let sweep = 0;
    const targets = [];
    for (let i = 0; i < 5; i++) targets.push({ a: Math.random() * 7, r: 0.3 + Math.random() * 0.65, va: (Math.random() - 0.5) * 0.004, lit: 0 });

    const roCount = readout('Ziele im Bild');
    const roStat = readout('Status');

    canvas.addEventListener('click', (e) => {
      const p = pos(canvas, e); const dx = p.x - cx, dy = p.y - cy; const r = Math.hypot(dx, dy) / R;
      if (r <= 1) targets.push({ a: Math.atan2(dy, dx), r, va: (Math.random() - 0.5) * 0.004, lit: 0 });
    });

    function draw() {
      sweep = (sweep + 0.03) % (Math.PI * 2);
      ctx.fillStyle = '#04140a'; ctx.fillRect(0, 0, W, H);
      // Ringe + Speichen
      ctx.strokeStyle = 'rgba(34,197,94,0.35)'; ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * i / 4, 0, 7); ctx.stroke(); }
      for (let a = 0; a < 12; a++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a / 12 * 7) * R, cy + Math.sin(a / 12 * 7) * R); ctx.stroke(); }
      // Sweep-Sektor
      const grad = ctx.createConicGradient ? null : null;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy);
      for (let k = 0; k <= 20; k++) { const a = sweep - 0.5 + k / 20 * 0.5; ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); }
      ctx.closePath(); const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, 'rgba(34,197,94,0.4)'); g.addColorStop(1, 'rgba(34,197,94,0)'); ctx.fillStyle = g; ctx.fill(); ctx.restore();
      // Sweep-Linie
      ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R); ctx.stroke();
      // Ziele
      let lit = 0;
      targets.forEach(t => {
        t.a += t.va; const x = cx + Math.cos(t.a) * R * t.r, y = cy + Math.sin(t.a) * R * t.r;
        let da = ((sweep - t.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (da < 0.25) t.lit = 1;
        t.lit *= 0.97;
        if (t.lit > 0.05) lit++;
        ctx.fillStyle = `rgba(74,222,128,${0.15 + t.lit * 0.85})`;
        ctx.beginPath(); ctx.arc(x, y, 4 + t.lit * 5, 0, 7); ctx.fill();
      });
      roCount.set(String(targets.length));
      roStat.set(lit > 0 ? lit + ' aktiv erfasst' : 'scannt…', lit > 0 ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Klick irgendwo ins Bild, um ein Ziel zu setzen. Der Sweep „beleuchtet" es bei jeder Umdrehung.' }),
      el('div', { class: 'phys-ros' }, [roCount.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-satellite-dish', title: 'Radar-Sweep · Flächenüberwachung', sub: 'Rundum-Erfassung mit Abstand',
      was: 'Eine rotierende Keule tastet die Fläche ab. Reflexionen von Objekten erscheinen als <b>Blips</b> – die Entfernung steckt in der Laufzeit (Ring = Reichweite), die Richtung im Winkel.',
      warum: 'So überwacht ein einzelner Sensor große Freiflächen (Bodenradar, Hafen, Flughafen) und liefert Position <b>und</b> Entfernung – anders als ein simpler Bewegungsmelder.',
      body,
    });
  }

  /* ============================================================
     12) Laser-Gitter (Tripwire-Raum)
     ============================================================ */
  function laserSim() {
    const W = 720, H = 320;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const M = 30;
    const beams = [
      [M, 60, W - M, 110], [M, 150, W - M, 90], [M, 240, W - M, 200],
      [M, 100, W - M, 260], [W - M, 50, M, 200], [M, 280, W - M, 150],
    ];
    const obj = { x: W / 2, y: H / 2, r: 18, auto: true, dragging: false };
    let ta = 0;

    const roBroken = readout('Unterbrochene Strahlen');
    const roStat = readout('Status');

    function down(e) { obj.dragging = true; obj.auto = false; move(e); }
    function move(e) { if (!obj.dragging) return; e.preventDefault(); const p = pos(canvas, e); obj.x = p.x; obj.y = p.y; }
    function up() { obj.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);

    function draw() {
      if (obj.auto) { ta += 0.015; obj.x = W / 2 + Math.cos(ta) * 240; obj.y = H / 2 + Math.sin(ta * 1.6) * 110; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      let broken = 0;
      beams.forEach(b => {
        const hit = distSeg(obj.x, obj.y, b[0], b[1], b[2], b[3]) < obj.r;
        if (hit) broken++;
        ctx.strokeStyle = hit ? 'rgba(239,68,68,0.95)' : 'rgba(248,113,113,0.8)';
        ctx.lineWidth = hit ? 3 : 2; ctx.shadowColor = hit ? '#ef4444' : '#f87171'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[2], b[3]); ctx.stroke();
        ctx.shadowBlur = 0;
        [[b[0], b[1]], [b[2], b[3]]].forEach(p => { ctx.fillStyle = '#475569'; ctx.fillRect(p[0] - 5, p[1] - 5, 10, 10); });
      });
      ctx.fillStyle = broken ? 'rgba(239,68,68,0.9)' : '#e2e8f0';
      ctx.beginPath(); ctx.arc(obj.x, obj.y, obj.r, 0, 7); ctx.fill();
      ctx.fillStyle = '#0b1424'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🥷', obj.x, obj.y + 5);

      roBroken.set(broken + ' / ' + beams.length);
      roStat.set(broken ? 'ALARM (Strahl unterbrochen)' : 'alle Strahlen frei', broken ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Zieh den Eindringling durch den Raum – jeder gekreuzte Strahl löst aus (wie im Tresorraum).' }),
      el('div', { class: 'phys-ros' }, [roBroken.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-bahai', title: 'Laser-Gitter · Tripwire', sub: 'Gekreuzte Strahlen im Raum',
      was: 'Viele gebündelte Strahlen spannen ein unsichtbares Netz auf. Jeder Strahl hat einen Empfänger – wird auch nur <b>einer</b> unterbrochen, schlägt die Anlage an.',
      warum: 'Lückenloser Raum-/Objektschutz (Museen, Tresorräume). Je dichter das Gitter, desto schwerer „durchzuschlängeln".',
      body,
    });
  }

  /* ============================================================
     13) Dual-Melder · UND-Verknüpfung (Fehlalarm-Immunität)
     ============================================================ */
  function dualSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let scenario = null, t = 0;   // 'einbrecher' | 'waerme' | 'funk'

    const roPir = readout('PIR (Wärme-Bewegung)');
    const roMw = readout('Mikrowelle (Doppler)');
    const roStat = readout('UND-Ergebnis');

    function trigger(s) { scenario = s; t = 0; }

    function draw() {
      t += 1;
      if (t > 220) scenario = null;
      let pir = false, mw = false, mover = null;
      if (scenario === 'einbrecher') { pir = true; mw = true; mover = { x: 120 + (t % 200) * 2, y: H / 2, kind: '🥷' }; }
      else if (scenario === 'waerme') { pir = true; mw = false; mover = { x: 360, y: H / 2, kind: '🔥' }; }
      else if (scenario === 'funk') { mw = true; pir = false; mover = { x: 360, y: H / 2, kind: '📡' }; }
      const alarm = pir && mw;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Raum
      ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.strokeRect(40, 40, W - 80, H - 110);
      // Melder oben mittig
      ctx.fillStyle = alarm ? '#ef4444' : '#22d3ee'; ctx.fillRect(W / 2 - 22, 30, 44, 22);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Dual-Melder', W / 2, 24);
      // Beweger
      if (mover) { ctx.font = '30px sans-serif'; ctx.fillText(mover.kind, mover.x, mover.y); }
      // Zwei Kanäle + UND-Gatter
      const ly = H - 48;
      ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
      ctx.fillStyle = pir ? '#22c55e' : '#475569'; ctx.beginPath(); ctx.arc(150, ly, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.fillText('PIR', 170, ly + 4);
      ctx.fillStyle = mw ? '#22c55e' : '#475569'; ctx.beginPath(); ctx.arc(330, ly, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.fillText('Mikrowelle', 350, ly + 4);
      ctx.fillStyle = '#fbbf24'; ctx.fillText('&', 500, ly + 6); ctx.font = '20px sans-serif'; ctx.fillText('&', 498, ly + 7);
      ctx.font = '13px sans-serif'; ctx.fillStyle = alarm ? '#ef4444' : '#475569';
      ctx.beginPath(); ctx.arc(560, ly, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.fillText(alarm ? 'ALARM' : 'kein Alarm', 580, ly + 4);

      roPir.set(pir ? 'erkennt' : '—', pir ? 'warn' : '');
      roMw.set(mw ? 'erkennt' : '—', mw ? 'warn' : '');
      roStat.set(alarm ? 'ALARM (beide!)' : 'unterdrückt', alarm ? 'bad' : 'ok');
    }
    loop(canvas, draw);

    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-user-ninja"></i> Einbrecher' });
    b1.addEventListener('click', () => trigger('einbrecher'));
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-fire"></i> Heizung / Zugluft' });
    b2.addEventListener('click', () => trigger('waerme'));
    const b3 = el('button', { class: 'btn', html: '<i class="fas fa-tower-broadcast"></i> Funkstörung' });
    b3.addEventListener('click', () => trigger('funk'));
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2, b3]),
      el('div', { class: 'phys-ros' }, [roPir.wrap, roMw.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-link', title: 'Dual-Melder · UND-Logik', sub: 'Zwei Prinzipien gegen Fehlalarm',
      was: 'Ein Dual-Melder kombiniert PIR <b>und</b> Mikrowelle. Erst wenn <b>beide</b> gleichzeitig auslösen, kommt Alarm. Probiere die Störfälle: Wärme reizt nur den PIR, Funkstörung nur die Mikrowelle.',
      warum: 'Eine einzelne Störung (warmer Luftzug, Funk, bewegter Vorhang) reicht nicht mehr → drastisch <b>weniger Fehlalarme</b>, gefordert ab höheren EMA-Graden.',
      body,
    });
  }

  /* ============================================================
     14) Funkübertragung · RSSI / Reichweite
     ============================================================ */
  function funkSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let dist = 25, walls = 1, phase = 0;

    const roRssi = readout('Signalpegel');
    const roDist = readout('Distanz / Wände');
    const roStat = readout('Verbindung');

    function draw() {
      phase += 0.05;
      const rssi = -40 - 20 * Math.log10(Math.max(1, dist)) - walls * 11;   // dBm
      const quality = Math.max(0, Math.min(1, (rssi + 95) / 55));
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const panel = { x: 70, y: H / 2 }, sensor = { x: 70 + 60 + (W - 220) * (dist / 100), y: H / 2 };
      // Wellen vom Sensor zur Zentrale
      ctx.strokeStyle = `rgba(34,211,238,${0.2 + quality * 0.6})`;
      for (let i = 0; i < 6; i++) { const r = ((phase * 14 + i * 26) % 200); ctx.beginPath(); ctx.arc(sensor.x, sensor.y, r, Math.PI - 1.2, Math.PI + 1.2); ctx.stroke(); }
      // Wände
      for (let w = 0; w < walls; w++) { const wx = panel.x + 70 + (sensor.x - panel.x - 90) * (w + 1) / (walls + 1); ctx.fillStyle = 'rgba(148,163,184,0.5)'; ctx.fillRect(wx - 5, 60, 10, H - 130); }
      // Zentrale + Sensor
      ctx.fillStyle = '#10b981'; ctx.fillRect(panel.x - 20, panel.y - 26, 40, 52);
      ctx.fillStyle = quality > 0.15 ? '#22d3ee' : '#ef4444'; ctx.fillRect(sensor.x - 14, sensor.y - 18, 28, 36);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Zentrale', panel.x, panel.y + 44); ctx.fillText('Funk-Melder', sensor.x, sensor.y + 44);
      // Balken
      for (let i = 0; i < 5; i++) { ctx.fillStyle = (i / 5 < quality) ? '#22c55e' : 'rgba(148,163,184,0.2)'; ctx.fillRect(W - 130 + i * 18, H - 40 - i * 7, 12, 12 + i * 7); }

      roRssi.set(rssi.toFixed(0) + ' dBm');
      roDist.set(dist + ' m · ' + walls + ' Wand/Wände');
      roStat.set(quality > 0.45 ? 'stabil' : quality > 0.15 ? 'schwach' : 'verloren', quality > 0.45 ? 'ok' : quality > 0.15 ? 'warn' : 'bad');
    }
    loop(canvas, draw);

    const sd = el('input', { type: 'range', min: '1', max: '100', value: '25', class: 'phys-slider' });
    sd.addEventListener('input', () => { dist = +sd.value; });
    const sw = el('input', { type: 'range', min: '0', max: '4', value: '1', class: 'phys-slider' });
    sw.addEventListener('input', () => { walls = +sw.value; });
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Distanz' }), sd]),
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Wände dazwischen' }), sw]),
      el('div', { class: 'phys-ros' }, [roRssi.wrap, roDist.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-wifi', title: 'Funkübertragung · RSSI', sub: 'Wie weit trägt der Funk-Melder?',
      was: 'Ein Funk-Melder sendet zur Zentrale. Der Pegel (RSSI in dBm) fällt mit der <b>Distanz</b> (≈ 20 dB je Verzehnfachung) und mit jeder <b>Wand</b> zusätzlich ab.',
      warum: 'Erklärt, warum Funkanlagen Reichweitengrenzen haben und dicke Wände/Metall stören. Darum: Repeater einsetzen und Pegel bei der Montage messen.',
      body,
    });
  }

  /* ============================================================
     15) Akustische Triangulation (Schuss-/Glasortung)
     ============================================================ */
  function triSim() {
    const W = 720, H = 340;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const mics = [{ x: 90, y: 70 }, { x: W - 90, y: 90 }, { x: W / 2, y: H - 60 }];
    const src = { x: W / 2, y: H / 2, dragging: false };
    const SPEED = 150; // px/s "Schall"
    let pulse = null;  // {t0}

    const roTimes = readout('Eintreffzeiten Δt');
    const roStat = readout('Status');

    function down(e) { const p = pos(canvas, e); if (Math.hypot(p.x - src.x, p.y - src.y) < 40) { src.dragging = true; } move(e); }
    function move(e) { if (!src.dragging) return; e.preventDefault(); const p = pos(canvas, e); src.x = Math.max(20, Math.min(W - 20, p.x)); src.y = Math.max(20, Math.min(H - 20, p.y)); }
    function up() { src.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);

    function draw(now) {
      if (!pulse || (now - pulse.start) / 1000 * SPEED > Math.hypot(W, H)) pulse = { start: now };
      const radius = Math.max(0, (now - pulse.start) / 1000 * SPEED);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Schall-Wellenfront
      ctx.strokeStyle = 'rgba(251,191,36,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(src.x, src.y, radius, 0, 7); ctx.stroke();
      ctx.strokeStyle = 'rgba(251,191,36,0.25)'; ctx.beginPath(); ctx.arc(src.x, src.y, Math.max(0, radius - 18), 0, 7); ctx.stroke();
      // Mikrofone + Distanzlinien + Eintreffmarker
      const ds = mics.map(m => Math.hypot(m.x - src.x, m.y - src.y));
      const dmin = Math.min(...ds);
      const times = mics.map((m, i) => {
        const reached = radius >= ds[i];
        ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        ctx.fillStyle = reached ? '#22c55e' : '#64748b'; ctx.beginPath(); ctx.arc(m.x, m.y, 12, 0, 7); ctx.fill();
        ctx.fillStyle = '#0b1424'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('M' + (i + 1), m.x, m.y + 4);
        return ((ds[i] - dmin) / SPEED * 1000); // ms relativ zum ersten
      });
      // Quelle
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(src.x, src.y, 10, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '16px sans-serif'; ctx.fillText('💥', src.x, src.y - 16);

      roTimes.set('M1 ' + times[0].toFixed(0) + ' · M2 ' + times[1].toFixed(0) + ' · M3 ' + times[2].toFixed(0) + ' ms');
      roStat.set('Quelle lokalisiert', 'ok');
    }
    loop(canvas, draw);

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-hint', text: '⟶ Zieh die Schallquelle (💥). Jedes Mikrofon hört sie zu einem anderen Zeitpunkt – aus den Differenzen folgt die Position.' }),
      el('div', { class: 'phys-ros' }, [roTimes.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-tower-cell', title: 'Akustische Triangulation', sub: 'Schuss- & Glasbruch-Ortung',
      was: 'Mehrere Mikrofone hören dasselbe Geräusch zu <b>leicht verschiedenen Zeiten</b> (Schall ist langsam). Aus den Zeitdifferenzen (TDOA) lässt sich die Quelle eindeutig orten.',
      warum: 'Prinzip hinter Schussortung und großflächiger Glasbruch-Erkennung – ein Vorfall wird nicht nur erkannt, sondern <b>verortet</b>.',
      body,
    });
  }

  /* ============================================================
     Ansicht
     ============================================================ */
  function view() {
    const root = el('div', { class: 'phys-view' });

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `
      <span class="tag">Verstehen · Live-Physik</span>
      <h1>Physik Live – wie Sensoren wirklich „sehen"</h1>
      <p class="lead">15 Echtzeit-Simulationen zum Anfassen, sortiert nach Wirkprinzip. Jede zeigt in Klartext
      <b>was</b> passiert und <b>warum</b> es für die Sicherheitstechnik wichtig ist – ziehen, schieben, klicken.</p>
      <div class="phys-legend">
        <span><i class="fas fa-hand-pointer"></i> ziehen / schieben / klicken</span>
        <span><i class="fas fa-circle" style="color:#22c55e"></i> Ruhe</span>
        <span><i class="fas fa-circle" style="color:#ef4444"></i> Alarm</span>
      </div>`;
    root.appendChild(intro);

    const cats = [
      { label: 'Bewegung & Präsenz', sims: [pirSim, dopplerSim, ultraschallSim, radarSim, thermalSim, dualSim] },
      { label: 'Öffnung & Mechanik', sims: [reedSim, lockSim, seismikSim, kapazitivSim] },
      { label: 'Licht & Laser', sims: [beamSim, laserSim] },
      { label: 'Akustik', sims: [glassSim, triSim] },
      { label: 'Funk & Übertragung', sims: [funkSim] },
    ];
    cats.forEach(c => {
      root.appendChild(el('div', { class: 'phys-cat', text: c.label }));
      const grid = el('div', { class: 'phys-grid' });
      c.sims.forEach(fn => grid.appendChild(fn()));
      root.appendChild(grid);
    });

    return root;
  }

  return { view };
})();
