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
     Ansicht
     ============================================================ */
  function view() {
    const root = el('div', { class: 'phys-view' });

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `
      <span class="tag">Verstehen · Live-Physik</span>
      <h1>Physik Live – wie Sensoren wirklich „sehen"</h1>
      <p class="lead">Jeder Melder nutzt ein physikalisches Prinzip. Hier läuft jedes davon als Echtzeit-Simulation zum Anfassen –
      mit kurzer Erklärung <b>was</b> passiert und <b>warum</b> es für die Sicherheitstechnik wichtig ist.</p>
      <div class="phys-legend">
        <span><i class="fas fa-hand-pointer"></i> ziehen / schieben / klicken</span>
        <span><i class="fas fa-circle" style="color:#22c55e"></i> Ruhe</span>
        <span><i class="fas fa-circle" style="color:#ef4444"></i> Alarm</span>
      </div>`;
    root.appendChild(intro);

    const grid = el('div', { class: 'phys-grid' });
    [pirSim(), dopplerSim(), reedSim(), glassSim(), beamSim()].forEach(s => grid.appendChild(s));
    root.appendChild(grid);

    return root;
  }

  return { view };
})();
