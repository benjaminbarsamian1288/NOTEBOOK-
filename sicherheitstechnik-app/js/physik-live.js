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

  /* Web-Audio-Soundeffekte – funktioniert auch über file:// (kein Server nötig).
     Wird erst durch Klick auf den Ton-Schalter freigeschaltet (Autoplay-Regeln). */
  const SFX = (() => {
    let actx = null, on = false, siren = null;
    function ctx() {
      if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
      if (actx && actx.state === 'suspended') actx.resume();
      return actx;
    }
    function enable(v) { on = v; if (v) ctx(); else stopSiren(); }
    function isOn() { return on; }
    function tone(freq, dur, type = 'sine', vol = 0.06) {
      const a = ctx(); if (!on || !a) return;
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
      o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + dur);
    }
    function noise(dur = 0.5, vol = 0.14) {
      const a = ctx(); if (!on || !a) return;
      const n = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.6);
      const s = a.createBufferSource(); s.buffer = buf;
      const hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2200;
      const g = a.createGain(); g.gain.value = vol;
      s.connect(hp).connect(g).connect(a.destination); s.start();
    }
    function startSiren() {
      const a = ctx(); if (!on || !a || siren) return;
      const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
      o.type = 'sawtooth'; o.frequency.value = 620;
      lfo.type = 'sine'; lfo.frequency.value = 3.5; lg.gain.value = 260;
      lfo.connect(lg).connect(o.frequency);
      g.gain.value = 0.05; o.connect(g).connect(a.destination);
      o.start(); lfo.start(); siren = { o, lfo };
    }
    function stopSiren() { if (siren) { try { siren.o.stop(); siren.lfo.stop(); } catch (e) {} siren = null; } }
    return { enable, isOn, tone, noise, startSiren, stopSiren };
  })();

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

    function trigger(type) { event = { type, start: performance.now() }; SFX.tone(90, 0.16, 'sine', 0.09); }

    function draw(now) {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.beginPath();
      ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

      let stage = '–', alarm = false;
      let amp = 0, freq = 0.05;
      if (event) {
        const dt = (now - event.start);
        if (dt < 350) { amp = 60 * Math.exp(-dt / 250); freq = 0.04; stage = 'Stufe 1: Tieffrequenter Schlag (Anprall)'; }
        else if (dt < 1100 && event.type === 'break') { amp = 80 * Math.exp(-(dt - 350) / 380); freq = 0.55; stage = 'Stufe 2: Hochfrequentes Splittern'; if (!event.snd) { event.snd = true; SFX.noise(0.55); } }
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
        if (da < 0.25) { t.lit = 1; if (!t.beep) { t.beep = true; SFX.tone(900, 0.05, 'square', 0.05); } } else { t.beep = false; }
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
      if (!pulse || (now - pulse.start) / 1000 * SPEED > Math.hypot(W, H)) { pulse = { start: now }; SFX.tone(170, 0.14, 'square', 0.08); }
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
     16) CCTV-Kamera · Sichtfeld & DORI
     ============================================================ */
  function cctvSim() {
    const W = 720, H = 320;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const cam = { x: 56, y: H / 2 };
    let focal = 6;                       // mm
    const person = { x: 360, y: H / 2, auto: true, dragging: false };
    let ta = 0;

    const roFocal = readout('Brennweite');
    const roAngle = readout('Bildwinkel');
    const roZone = readout('Erkennungsstufe');

    function down(e) { person.dragging = true; person.auto = false; move(e); }
    function move(e) { if (!person.dragging) return; e.preventDefault(); const p = pos(canvas, e); person.x = Math.max(cam.x + 30, Math.min(W - 12, p.x)); person.y = p.y; }
    function up() { person.dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);

    function draw() {
      if (person.auto) { ta += 0.012; person.x = W * 0.5 + Math.sin(ta) * (W * 0.4); person.y = H / 2; }
      const ang = 2 * Math.atan(4.8 / (2 * focal));   // rad
      const half = ang / 2;
      const zones = [
        { d: focal * 13, c: 'rgba(34,197,94,0.30)', n: 'Identifizieren' },
        { d: focal * 25, c: 'rgba(125,211,252,0.22)', n: 'Wiedererkennen' },
        { d: focal * 44, c: 'rgba(251,191,36,0.16)', n: 'Beobachten' },
        { d: focal * 72, c: 'rgba(148,163,184,0.12)', n: 'Detektieren' },
      ];
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // DORI-Zonen (von außen nach innen zeichnen)
      for (let i = zones.length - 1; i >= 0; i--) {
        ctx.beginPath(); ctx.moveTo(cam.x, cam.y);
        ctx.lineTo(cam.x + Math.cos(-half) * zones[i].d, cam.y + Math.sin(-half) * zones[i].d);
        ctx.lineTo(cam.x + Math.cos(half) * zones[i].d, cam.y + Math.sin(half) * zones[i].d);
        ctx.closePath(); ctx.fillStyle = zones[i].c; ctx.fill();
      }
      // Zonengrenzen-Beschriftung
      ctx.fillStyle = '#cbd5e1'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      zones.forEach(z => { if (z.d < W - 20) ctx.fillText(z.n, cam.x + z.d - 18, cam.y - half * z.d - 4 > 12 ? cam.y - Math.sin(half) * z.d - 4 : 14); });
      // Kamera
      ctx.fillStyle = '#7dd3fc'; ctx.fillRect(cam.x - 18, cam.y - 12, 22, 24);
      ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(cam.x + 4, cam.y, 6, 0, 7); ctx.fill();
      // Person + aktuelle Stufe
      const dx = person.x - cam.x;
      let zoneName = 'außerhalb';
      for (const z of zones) { if (dx <= z.d) { zoneName = z.n; break; } }
      const inView = Math.abs(Math.atan2(person.y - cam.y, dx)) < half && dx < zones[3].d;
      ctx.fillStyle = inView ? '#e2e8f0' : '#64748b'; ctx.beginPath(); ctx.arc(person.x, person.y, 13, 0, 7); ctx.fill();
      ctx.font = '15px sans-serif'; ctx.fillText('🚶', person.x, person.y + 5);

      roFocal.set(focal.toFixed(1) + ' mm');
      roAngle.set((ang * 180 / Math.PI).toFixed(0) + '°');
      roZone.set(inView ? zoneName : 'außerhalb', inView && (zoneName === 'Identifizieren' || zoneName === 'Wiedererkennen') ? 'ok' : inView ? 'warn' : 'bad');
    }
    loop(canvas, draw);

    const slider = el('input', { type: 'range', min: '2.8', max: '16', step: '0.2', value: '6', class: 'phys-slider' });
    slider.addEventListener('input', () => { focal = +slider.value; });
    const body = el('div', {}, [
      canvas,
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Brennweite (Zoom)' }), slider]),
      el('div', { class: 'phys-hint', text: '⟶ Zieh die Person; mit dem Zoom verschieben sich die DORI-Zonen. Mehr Zoom = enger, aber weiter erkennbar.' }),
      el('div', { class: 'phys-ros' }, [roFocal.wrap, roAngle.wrap, roZone.wrap]),
    ]);
    return simCard({
      icon: 'fa-video', title: 'CCTV-Kamera · Sichtfeld & DORI', sub: 'Erkennen · Wiedererkennen · Identifizieren',
      was: 'Die Brennweite bestimmt Bildwinkel und Reichweite. DORI teilt die Sicht in Stufen: <b>D</b>etektieren (etwas ist da), <b>O</b>bservieren, <b>R</b>ecognize (wiedererkennen), <b>I</b>dentify (Person eindeutig).',
      warum: 'Für Gerichtsverwertbarkeit braucht man genug Pixel pro Meter → die Identify-Zone. Weitwinkel sieht viel, aber erkennt Gesichter nur nah; Tele erkennt weit, sieht aber einen schmalen Ausschnitt.',
      body,
    });
  }

  /* ============================================================
     17) Zutrittskontrolle · PIN & RFID
     ============================================================ */
  function zutrittSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const PIN = '1234';
    let entered = '', doorOpen = 0, target = 0, result = '', resultT = 0, fails = 0, locked = 0;

    const roEntry = readout('Eingabe');
    const roStat = readout('Status');

    function grant(how) { result = '✓ Zutritt gewährt (' + how + ')'; resultT = 150; target = 1; fails = 0; SFX.tone(880, 0.08, 'sine', 0.06); setTimeout(() => { target = 0; }, 1800); pushLog(result); }
    function deny(how) { result = '✕ Zutritt verweigert (' + how + ')'; resultT = 150; fails++; SFX.tone(160, 0.18, 'square', 0.08); if (fails >= 3) { locked = 360; result = '⛔ Gesperrt – zu viele Versuche'; } pushLog(result); }
    const log = [];
    function pushLog(t) { log.unshift(new Date().toLocaleTimeString('de-DE', { hour12: false }) + ' · ' + t); if (log.length > 5) log.pop(); renderLog(); }
    const logWrap = el('div', { class: 'scene-log', html: '<div style="opacity:.6">Noch keine Zutritte …</div>' });
    function renderLog() { logWrap.innerHTML = log.map(l => `<div>${l}</div>`).join(''); }

    function key(d) {
      if (locked > 0) return;
      if (d === 'C') { entered = ''; return; }
      if (d === 'OK') { (entered === PIN ? grant('PIN') : deny('PIN')); entered = ''; return; }
      if (entered.length < 4) entered += d;
    }

    function draw() {
      if (locked > 0) locked--;
      if (resultT > 0) resultT--;
      doorOpen += (target - doorOpen) * 0.12;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Rahmen + Tür (öffnet nach rechts)
      const fx = 90, fw = 240, fh = 220, fy = H / 2 - fh / 2;
      ctx.fillStyle = '#0f1b2e'; ctx.fillRect(fx, fy, fw, fh);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.strokeRect(fx, fy, fw, fh);
      ctx.save(); ctx.translate(fx, fy); ctx.transform(1, 0, 0, 1, doorOpen * (fw - 20), 0);
      ctx.fillStyle = doorOpen > 0.5 ? '#14532d' : '#334155'; ctx.fillRect(0, 0, fw - 20, fh);
      ctx.fillStyle = '#64748b'; ctx.fillRect(fw - 60, fh / 2 - 12, 12, 24);
      ctx.restore();
      // Leser + LED
      const led = locked > 0 ? '#ef4444' : doorOpen > 0.5 ? '#22c55e' : '#fbbf24';
      ctx.fillStyle = '#1e293b'; ctx.fillRect(fx + fw + 40, fy + 30, 150, 110);
      ctx.fillStyle = led; ctx.beginPath(); ctx.arc(fx + fw + 115, fy + 50, 8, 0, 7); ctx.fill();
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Leser', fx + fw + 115, fy + 30);
      // PIN-Display
      ctx.fillStyle = '#0b1424'; ctx.fillRect(fx + fw + 50, fy + 70, 130, 30);
      ctx.fillStyle = '#22d3ee'; ctx.font = '20px monospace'; ctx.fillText(entered.replace(/./g, '• ') || '– – – –', fx + fw + 115, fy + 92);
      // Ergebnis
      if (resultT > 0) { ctx.fillStyle = result.startsWith('✓') ? '#22c55e' : '#ef4444'; ctx.font = '14px sans-serif'; ctx.fillText(result, W / 2, H - 16); }

      roEntry.set(entered ? entered.replace(/./g, '•') : '–');
      roStat.set(locked > 0 ? 'gesperrt (' + Math.ceil(locked / 60) + 's)' : doorOpen > 0.5 ? 'offen' : 'verriegelt', locked > 0 ? 'bad' : doorOpen > 0.5 ? 'ok' : 'warn');
    }
    loop(canvas, draw);

    // Tastenfeld
    const pad = el('div', { class: 'zk-pad' });
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].forEach(d => {
      const b = el('button', { class: 'zk-key' + (d === 'OK' ? ' ok' : d === 'C' ? ' clr' : ''), text: d });
      b.addEventListener('click', () => key(d)); pad.appendChild(b);
    });
    const rfidOk = el('button', { class: 'btn primary', html: '<i class="fas fa-id-card"></i> Gültige Karte' });
    rfidOk.addEventListener('click', () => { if (locked <= 0) grant('RFID'); });
    const rfidBad = el('button', { class: 'btn', html: '<i class="fas fa-ban"></i> Fremde Karte' });
    rfidBad.addEventListener('click', () => { if (locked <= 0) deny('RFID'); });

    const body = el('div', {}, [
      canvas,
      el('div', { class: 'zk-wrap' }, [pad, el('div', { class: 'zk-side' }, [
        el('div', { class: 'phys-hint', html: 'PIN ist <b>1234</b>. Tippe + OK, oder nutze eine Karte. 3 Fehlversuche → Sperre.' }),
        rfidOk, rfidBad,
      ])]),
      el('div', { class: 'scene-panel-h', text: 'Zutritts-Log' }), logWrap,
      el('div', { class: 'phys-ros' }, [roEntry.wrap, roStat.wrap]),
    ]);
    return simCard({
      icon: 'fa-id-card', title: 'Zutrittskontrolle · PIN & RFID', sub: 'Identifikation → Berechtigung → Tür',
      was: 'Der Leser prüft eine Berechtigung (PIN-Wissen oder RFID-Karte). Stimmt sie, gibt der Controller die Tür frei. Falsche Eingaben werden gezählt – nach mehreren Fehlversuchen folgt eine <b>Sperre</b>.',
      warum: 'Grundprinzip jeder Zutrittsanlage (ZKA): Wissen, Besitz oder Biometrie. Logging und Sperren schützen vor Durchprobieren; alle Zutritte sind protokolliert.',
      body,
    });
  }

  /* ============================================================
     18) Mikrowellen-Schranke (bistatisch · 2 Masten)
     ============================================================ */
  function mwSchrankeSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const A = { x: 70, y: H / 2 }, B = { x: W - 70, y: H / 2 };
    const obj = { x: W / 2, y: -100, auto: true, drag: false };
    let phase = 0, ta = 0;
    const roDist = readout('Felddämpfung'), roStat = readout('Status');
    function down(e) { obj.drag = true; obj.auto = false; mv(e); }
    function mv(e) { if (!obj.drag) return; e.preventDefault(); const p = pos(canvas, e); obj.x = p.x; obj.y = p.y; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', mv); window.addEventListener('mouseup', () => obj.drag = false);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', () => obj.drag = false);
    function draw() {
      phase += 0.2; if (obj.auto) { ta += 0.02; obj.x = W / 2 + Math.sin(ta) * 250; obj.y = H / 2; }
      const block = distSeg(obj.x, obj.y, A.x, A.y, B.x, B.y) < 40 && obj.x > A.x && obj.x < B.x;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Feld-Ellipsoid zwischen den Masten
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(${block ? '239,68,68' : '34,211,238'},${0.4 - i * 0.1})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse((A.x + B.x) / 2, H / 2, (B.x - A.x) / 2, 28 + i * 12 + Math.sin(phase) * 3, 0, 0, 7); ctx.stroke(); }
      ctx.strokeStyle = block ? 'rgba(239,68,68,0.8)' : 'rgba(34,211,238,0.8)'; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = A.x; x <= B.x; x += 6) ctx.lineTo(x, H / 2 + Math.sin(x * 0.1 + phase) * 6); ctx.stroke();
      [A, B].forEach(m => { ctx.fillStyle = '#64748b'; ctx.fillRect(m.x - 7, 40, 14, H - 80); ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(m.x, 40, 7, 0, 7); ctx.fill(); });
      ctx.fillStyle = block ? '#ef4444' : '#e2e8f0'; ctx.beginPath(); ctx.arc(obj.x, obj.y, 14, 0, 7); ctx.fill();
      ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🥷', obj.x, obj.y + 5);
      roDist.set(block ? 'stark gestört' : 'frei'); roStat.set(block ? 'ALARM (Feld unterbrochen)' : 'ruhig', block ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-hint', text: '⟶ Zieh den Eindringling zwischen die Masten – das Mikrowellenfeld wird gedämpft.' }), el('div', { class: 'phys-ros' }, [roDist.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-tower-cell', title: 'Mikrowellen-Schranke (bistatisch)', sub: 'Sender + Empfänger an zwei Masten',
      was: 'Zwischen zwei Masten spannt sich ein zigarrenförmiges Mikrowellenfeld. Tritt jemand hinein, <b>dämpft</b> sein Körper das Empfangssignal messbar.',
      warum: 'Perimeterschutz für lange Zaunlinien – unsichtbar und wetterfest. Mehrere Strecken überlappen, damit es keine toten Winkel gibt.', body });
  }

  /* ============================================================
     19) Glasfaser-Zaun (interferometrisch)
     ============================================================ */
  function glasfaserSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const climber = { x: W / 2, y: H - 60, auto: true, drag: false };
    let phase = 0, ta = 0, hitX = -1, ripple = 0;
    const roPos = readout('Störort'), roStat = readout('Status');
    function down(e) { climber.drag = true; climber.auto = false; mv(e); }
    function mv(e) { if (!climber.drag) return; e.preventDefault(); const p = pos(canvas, e); climber.x = Math.max(40, Math.min(W - 40, p.x)); climber.y = p.y; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', mv); window.addEventListener('mouseup', () => climber.drag = false);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', () => climber.drag = false);
    function draw() {
      phase += 0.3; if (climber.auto) { ta += 0.015; climber.x = W / 2 + Math.sin(ta) * 280; climber.y = H - 60 + Math.cos(ta * 2) * 40; }
      const fiberY = 70; const touching = climber.y < fiberY + 70;
      if (touching) { hitX = climber.x; ripple = 1; } ripple *= 0.95;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Zaun-Gitter
      ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.lineWidth = 1;
      for (let x = 40; x < W - 30; x += 22) { ctx.beginPath(); ctx.moveTo(x, fiberY); ctx.lineTo(x + 22, H - 30); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 22, fiberY); ctx.lineTo(x, H - 30); ctx.stroke(); }
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, H - 30); ctx.lineTo(W - 30, H - 30); ctx.stroke();
      // Faser mit Lichtpuls + Interferenz
      ctx.strokeStyle = ripple > 0.1 ? '#ef4444' : '#7dd3fc'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = 30; x < W - 30; x++) { const dist = Math.abs(x - hitX); const dist2 = ripple * 14 * Math.exp(-dist * dist / 600) * Math.sin(phase); ctx.lineTo(x, fiberY + Math.sin(x * 0.3 + phase) * 2 + dist2); } ctx.stroke();
      for (let i = 0; i < 4; i++) { const px = 30 + ((phase * 20 + i * 180) % (W - 60)); ctx.fillStyle = 'rgba(125,211,252,0.9)'; ctx.beginPath(); ctx.arc(px, fiberY, 3, 0, 7); ctx.fill(); }
      // Kletterer
      ctx.fillStyle = touching ? '#ef4444' : '#e2e8f0'; ctx.beginPath(); ctx.arc(climber.x, climber.y, 14, 0, 7); ctx.fill();
      ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🧗', climber.x, climber.y + 5);
      roPos.set(ripple > 0.1 ? 'Mast ' + (1 + Math.floor(hitX / (W / 6))) : '—'); roStat.set(ripple > 0.1 ? 'ALARM + lokalisiert' : 'ruhig', ripple > 0.1 ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-hint', text: '⟶ Lass den Kletterer den Zaun berühren – die Erschütterung stört das Licht in der Faser.' }), el('div', { class: 'phys-ros' }, [roPos.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-grip-lines-vertical', title: 'Glasfaser-Zaun (interferometrisch)', sub: 'Sensorkabel im Zaun', was: 'Licht läuft durch eine Faser am Zaun. Rüttelt jemand am Zaun, ändert die winzige Dehnung die <b>Lichtinterferenz</b> – und zwar genau an der berührten Stelle.', warum: 'Kilometerlange Zäune mit <b>metergenauer</b> Ortung – keine Elektronik im Feld, unempfindlich gegen Blitz/EMV.', body });
  }

  /* ============================================================
     20) Induktionsschleife (Fahrzeugdetektor)
     ============================================================ */
  function induktionSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const loopX = 300, loopW = 150, roadY = H / 2;
    const car = { x: 60, auto: true, drag: false };
    let barrier = 0;
    const roInd = readout('Induktivität'), roStat = readout('Schranke');
    function down(e) { car.drag = true; car.auto = false; mv(e); }
    function mv(e) { if (!car.drag) return; e.preventDefault(); car.x = pos(canvas, e).x; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', mv); window.addEventListener('mouseup', () => car.drag = false);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', () => car.drag = false);
    function draw() {
      if (car.auto) { car.x += 1.8; if (car.x > W + 30) car.x = -30; }
      const over = car.x > loopX - 20 && car.x < loopX + loopW + 20;
      barrier += ((over ? 1 : 0) - barrier) * 0.1;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, roadY - 46, W, 92);
      ctx.strokeStyle = '#475569'; ctx.setLineDash([20, 16]); ctx.beginPath(); ctx.moveTo(0, roadY); ctx.lineTo(W, roadY); ctx.stroke(); ctx.setLineDash([]);
      // Induktionsschleife (Kupfer)
      ctx.strokeStyle = over ? '#fbbf24' : '#b45309'; ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) ctx.strokeRect(loopX + i * 4, roadY - 30 + i * 4, loopW - i * 8, 60 - i * 8);
      // Auto
      ctx.font = '34px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🚗', car.x, roadY + 12);
      // Schranke
      const sx = 600; ctx.fillStyle = '#94a3b8'; ctx.fillRect(sx - 4, roadY - 46, 8, 30);
      ctx.save(); ctx.translate(sx, roadY - 46); ctx.rotate(-barrier * Math.PI / 2); ctx.fillStyle = barrier > 0.5 ? '#22c55e' : '#ef4444'; ctx.fillRect(0, -6, 110, 12); ctx.restore();
      roInd.set((over ? 72 : 100) + ' %'); roStat.set(over ? 'Fahrzeug erkannt → offen' : 'geschlossen', over ? 'ok' : 'warn');
    }
    loop(canvas, draw);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-hint', text: '⟶ Zieh das Auto über die Schleife – das Metall senkt die Induktivität, die Schranke öffnet.' }), el('div', { class: 'phys-ros' }, [roInd.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-car', title: 'Induktionsschleife · Fahrzeugdetektor', sub: 'Im Boden eingelassene Spule', was: 'Eine stromdurchflossene Spule im Asphalt bildet ein Magnetfeld. Fährt Metall (Auto) darüber, <b>sinkt die Induktivität</b> – der Detektor erkennt das Fahrzeug.', warum: 'Standard an Schranken, Toren und Ampeln. Reagiert auf Metallmasse, nicht auf Personen – deshalb gezielt für Fahrzeuge.', body });
  }

  /* ============================================================
     21) Trittmatte / Bodendrucksensor
     ============================================================ */
  function trittmatteSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const cols = 6, rows = 3, ox = 90, oy = 50, tw = 90, th = 60;
    const foot = { x: W / 2, y: H / 2, auto: true, drag: false };
    let ta = 0;
    const roTile = readout('Aktive Matte'), roStat = readout('Status');
    function down(e) { foot.drag = true; foot.auto = false; mv(e); }
    function mv(e) { if (!foot.drag) return; e.preventDefault(); const p = pos(canvas, e); foot.x = p.x; foot.y = p.y; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', mv); window.addEventListener('mouseup', () => foot.drag = false);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', () => foot.drag = false);
    function draw() {
      if (foot.auto) { ta += 0.012; foot.x = ox + tw * 3 + Math.sin(ta) * tw * 2.6; foot.y = oy + th * 1.5 + Math.cos(ta * 1.7) * th; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      let active = -1;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = ox + c * tw, y = oy + r * th; const on = foot.x > x && foot.x < x + tw && foot.y > y && foot.y < y + th;
        if (on) active = r * cols + c + 1;
        ctx.fillStyle = on ? 'rgba(239,68,68,0.45)' : 'rgba(34,211,238,0.08)'; ctx.fillRect(x + 2, y + 2, tw - 4, th - 4);
        ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.strokeRect(x + 2, y + 2, tw - 4, th - 4);
      }
      ctx.font = '30px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('👣', foot.x, foot.y + 10);
      roTile.set(active > 0 ? 'Feld ' + active : '—'); roStat.set(active > 0 ? 'Druck erkannt → ALARM' : 'ruhig', active > 0 ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-hint', text: '⟶ Zieh den Fuß über die Matten – jeder Tritt erzeugt Druck und meldet das Feld.' }), el('div', { class: 'phys-ros' }, [roTile.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-shoe-prints', title: 'Trittmatte · Bodendrucksensor', sub: 'Druckschalter unter dem Boden', was: 'Unter dem Bodenbelag liegen druckempfindliche Felder. Ein Schritt schließt den Kontakt im betretenen Feld → Meldung mit Position.', warum: 'Unsichtbarer Innenraumschutz vor Tresoren, Vitrinen oder in Fluren – funktioniert auch, wenn optische Melder verdeckt werden.', body });
  }

  /* ============================================================
     22) Laser-Abhörmikrofon (Spionage)
     ============================================================ */
  function laserMicSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let vol = 40, phase = 0; const buf = new Array(W).fill(H - 50);
    const roVib = readout('Scheibenvibration'), roStat = readout('Mithören');
    function draw() {
      phase += 0.35;
      const winX = W - 110, src = { x: 60, y: 80 }, rec = { x: 60, y: 200 };
      const vib = (vol / 100) * Math.sin(phase) * 8;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Gebäude + Fenster
      ctx.fillStyle = '#1e293b'; ctx.fillRect(winX - 10, 30, 120, H - 60);
      ctx.fillStyle = '#0ea5e9'; ctx.globalAlpha = 0.5; ctx.fillRect(winX, 60 + vib, 50, 120); ctx.globalAlpha = 1;
      // Lautsprecher im Raum
      ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🔊', winX + 80, H / 2);
      for (let i = 1; i <= 3; i++) { ctx.strokeStyle = `rgba(251,191,36,${vol / 100 * (0.5 - i * 0.1)})`; ctx.beginPath(); ctx.arc(winX + 80, H / 2, i * 12 + (phase * 6 % 12), -0.8, 0.8); ctx.stroke(); }
      // Laser hin + reflektiert (wackelt mit Vibration)
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(winX + 25, 70 + vib); ctx.stroke();
      ctx.strokeStyle = '#f87171'; ctx.beginPath(); ctx.moveTo(winX + 25, 70 + vib); ctx.lineTo(rec.x, 200 + vib * 1.6); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.fillRect(src.x - 16, src.y - 8, 18, 16); ctx.fillStyle = '#22c55e'; ctx.fillRect(rec.x - 16, 200 - 8, 18, 16);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText('Laser', src.x, src.y + 26); ctx.fillText('Empfänger', rec.x, 230);
      // zurückgewonnenes Audio
      buf.push(H - 30 + vib * 1.5); buf.shift();
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x < W - 130; x++) x ? ctx.lineTo(x, buf[x]) : ctx.moveTo(x, buf[x]); ctx.stroke();
      roVib.set((vol / 100 * 8).toFixed(1) + ' µm'); roStat.set(vol > 5 ? 'Gespräch rekonstruierbar' : 'still', vol > 5 ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const sl = el('input', { type: 'range', min: '0', max: '100', value: '40', class: 'phys-slider' }); sl.addEventListener('input', () => vol = +sl.value);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Lautstärke im Raum' }), sl]), el('div', { class: 'phys-ros' }, [roVib.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-satellite', title: 'Laser-Abhörmikrofon (Angriff)', sub: 'Wie ein Lauschangriff über Glas läuft', was: 'Schall im Raum lässt die Fensterscheibe minimal vibrieren. Ein Laser auf das Glas wird mit genau dieser Vibration zurückgeworfen – daraus lässt sich das <b>Gespräch rekonstruieren</b>.', warum: 'Reale Lauschtechnik. Gegenmaßnahmen: Scheiben-Schwinger, Vorhänge, abhörsichere Räume – wichtig für Lagebesprechungen.', body });
  }

  /* ============================================================
     23) Schwarzkörperstrahlung · Wärme-Spektrum
     ============================================================ */
  function schwarzkoerperSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let T = 310; // Kelvin
    const roPeak = readout('Strahlungsmaximum'), roT = readout('Temperatur');
    function draw() {
      const peak = 2898000 / T; // nm (Wien)
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Achsen
      ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.beginPath(); ctx.moveTo(50, H - 30); ctx.lineTo(W - 20, H - 30); ctx.stroke();
      // Planck-ähnliche Kurve (skaliert)
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.beginPath();
      for (let px = 0; px < W - 80; px++) {
        const lam = 200 + px / (W - 80) * 14000; // nm
        const x = lam / 1e9, a = 1.19e-16 / Math.pow(x, 5), b = Math.exp(1.439e-2 / (x * T)) - 1; const I = a / b;
        const y = (H - 35) - Math.min(H - 60, I * 4e-13);
        px ? ctx.lineTo(50 + px, y) : ctx.moveTo(50, y);
      }
      ctx.stroke();
      // sichtbarer Bereich markieren
      const vx0 = 50 + (380 - 200) / 14000 * (W - 80), vx1 = 50 + (750 - 200) / 14000 * (W - 80);
      ctx.fillStyle = 'rgba(125,211,252,0.08)'; ctx.fillRect(vx0, 20, vx1 - vx0, H - 50);
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('sichtbar', (vx0 + vx1) / 2, 16); ctx.fillText('IR →', W - 50, H - 14);
      // glühendes Objekt in Farbe der Temperatur
      const col = T < 800 ? '#7f1d1d' : T < 1000 ? '#dc2626' : T < 1300 ? '#f97316' : T < 1700 ? '#fbbf24' : '#fef3c7';
      const g = ctx.createRadialGradient(W - 70, 70, 2, W - 70, 70, 40); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W - 70, 70, 40, 0, 7); ctx.fill();
      roPeak.set(peak > 1000 ? (peak / 1000).toFixed(1) + ' µm (IR)' : peak.toFixed(0) + ' nm'); roT.set(T + ' K · ' + (T - 273) + ' °C');
    }
    loop(canvas, draw);
    const sl = el('input', { type: 'range', min: '300', max: '2000', value: '310', class: 'phys-slider' }); sl.addEventListener('input', () => T = +sl.value);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Temperatur' }), sl]), el('div', { class: 'phys-ros' }, [roT.wrap, roPeak.wrap])]);
    return simCard({ icon: 'fa-fire', title: 'Wärmestrahlung · Schwarzkörper', sub: 'Warum Wärmekameras funktionieren', was: 'Jeder Körper strahlt – das Maximum wandert mit steigender Temperatur zu kürzeren Wellen (Wien). Ein 37-°C-Mensch strahlt im <b>Infrarot</b> (~9 µm), erst sehr heiße Objekte glühen sichtbar.', warum: 'Genau dieses IR fängt die Wärmebildkamera ein – deshalb sieht sie Personen im Dunkeln, ganz ohne Licht.', body });
  }

  /* ============================================================
     24) Nebelmaschine · Sicherheitsnebel
     ============================================================ */
  function nebelSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const intr = { x: W * 0.72, y: H * 0.62 };
    let particles = [], fog = false;
    const roSight = readout('Sicht'), roStat = readout('Status');
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.strokeRect(20, 20, W - 40, H - 40);
      if (fog && particles.length < 520) for (let i = 0; i < 7; i++) particles.push({ x: 60, y: H - 50, vx: 1.2 + Math.random() * 2.6, vy: -Math.random() * 1.8 - 0.3, life: 1, r: 8 + Math.random() * 16 });
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.006; p.vx *= 0.992; p.life -= 0.0035; p.r += 0.35; });
      particles = particles.filter(p => p.life > 0 && p.x < W - 20 && p.y > 10);
      const density = Math.min(1, particles.length / 460);
      // Düse
      ctx.fillStyle = '#475569'; ctx.fillRect(40, H - 56, 26, 14);
      // Eindringling (verschwindet im Nebel)
      ctx.globalAlpha = Math.max(0.08, 1 - density * 1.1); ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(intr.x, intr.y, 14, 0, 7); ctx.fill();
      ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🥷', intr.x, intr.y + 5); ctx.globalAlpha = 1;
      // Nebel
      particles.forEach(p => { ctx.fillStyle = `rgba(226,232,240,${p.life * 0.16})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); });
      roSight.set(Math.round((1 - density) * 100) + ' %'); roStat.set(fog ? (density > 0.3 ? '🌫️ Nebel aktiv – Sicht weg' : 'Nebel baut auf…') : 'bereit', density > 0.3 ? 'ok' : 'warn');
    }
    loop(canvas, draw);
    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-smog"></i> Alarm → Nebel' }); b1.addEventListener('click', () => fog = true);
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-wind"></i> Lüften' }); b2.addEventListener('click', () => { fog = false; particles = []; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2]), el('div', { class: 'phys-ros' }, [roSight.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-smog', title: 'Nebelmaschine · Sicherheitsnebel', sub: 'Aktive Abwehr bei Einbruch', was: 'Bei Alarm flutet eine Nebelmaschine den Raum in Sekunden mit dichtem, ungiftigem Nebel – der Täter <b>sieht nichts mehr</b> und kann nichts finden/mitnehmen.', warum: 'Aktive Intervention statt nur Melden: Beute bleibt unauffindbar, bis Hilfe da ist. Beliebt bei Juwelieren, Apotheken, Tankstellen.', body });
  }

  /* ============================================================
     25) Sabotage- / Deckelkontakt (Tamper)
     ============================================================ */
  function tamperSim() {
    const W = 720, H = 280;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    let cover = 0, target = 0, armed = false;
    const roCover = readout('Deckel'), roStat = readout('Status');
    function draw() {
      cover += (target - cover) * 0.12;
      const tamper = cover > 0.4;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const bx = 230, by = 70, bw = 260, bh = 150;
      // Gerät-Innenleben
      ctx.fillStyle = '#0f1b2e'; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(bx + 20, by + 30, 70, 40); ctx.fillRect(bx + 110, by + 30, 50, 50);
      ctx.fillStyle = tamper ? '#ef4444' : '#22c55e'; ctx.beginPath(); ctx.arc(bx + 210, by + 40, 9, 0, 7); ctx.fill();
      // Tamper-Federkontakt (gedrückt = zu, gelöst = offen)
      ctx.strokeStyle = tamper ? '#ef4444' : '#22c55e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + 40, by + 110); ctx.lineTo(bx + 40, by + 110 - (tamper ? 18 : 4)); ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Sabotagekontakt', bx + 40, by + 135);
      // Deckel (klappt auf)
      ctx.save(); ctx.translate(bx, by); ctx.transform(1, 0, -cover * 0.9, 1 - cover * 0.5, 0, -cover * 70);
      ctx.fillStyle = 'rgba(71,85,105,0.92)'; ctx.fillRect(0, -16, bw, 18); ctx.restore();
      ctx.fillStyle = '#e2e8f0'; ctx.font = '13px sans-serif'; ctx.fillText('Melder-Gehäuse', bx + bw / 2, by - 22);
      roCover.set(cover > 0.4 ? 'offen' : 'geschlossen'); roStat.set(tamper ? '🚨 SABOTAGEALARM' + (armed ? '' : ' (auch unscharf!)') : (armed ? 'scharf · ok' : 'unscharf · ok'), tamper ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-screwdriver"></i> Deckel öffnen' });
    b1.addEventListener('click', () => { target = target > 0.4 ? 0 : 1; b1.innerHTML = target > 0.4 ? '<i class="fas fa-screwdriver"></i> Deckel schließen' : '<i class="fas fa-screwdriver"></i> Deckel öffnen'; });
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-lock-open"></i> Anlage unscharf' });
    b2.addEventListener('click', () => { armed = !armed; b2.className = 'btn' + (armed ? ' primary' : ''); b2.innerHTML = armed ? '<i class="fas fa-lock"></i> Anlage scharf' : '<i class="fas fa-lock-open"></i> Anlage unscharf'; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2]), el('div', { class: 'phys-ros' }, [roCover.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-screwdriver-wrench', title: 'Sabotage- / Deckelkontakt', sub: 'Schutz rund um die Uhr', was: 'Ein Federkontakt im Gehäuse ist gedrückt, solange der Deckel zu ist. Öffnet jemand das Gerät (oder schneidet die Leitung), löst der Kontakt aus – <b>auch wenn die Anlage „unscharf" ist</b>.', warum: 'Verhindert Manipulation: Niemand kann Melder unbemerkt öffnen, überbrücken oder abklemmen. Pflicht für höhere VdS-/EN-Grade.', body });
  }

  /* ============================================================
     26) Drohnen-Detektion (RF · Akustik · Radar)
     ============================================================ */
  function drohneSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const drone = { x: W / 2, y: 90, auto: true, drag: false };
    const layers = { rf: { on: true, r: 320, y: H - 30, x: 120, c: '#22d3ee', label: 'RF-Scanner' }, akustik: { on: true, r: 150, y: H - 30, x: 360, c: '#fbbf24', label: 'Akustik' }, radar: { on: true, r: 240, y: H - 30, x: 600, c: '#22c55e', label: 'Radar' } };
    let ta = 0;
    const roDet = readout('Erfasst von'), roStat = readout('Status');
    function down(e) { drone.drag = true; drone.auto = false; mv(e); }
    function mv(e) { if (!drone.drag) return; e.preventDefault(); const p = pos(canvas, e); drone.x = p.x; drone.y = Math.min(H - 80, p.y); }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', mv); window.addEventListener('mouseup', () => drone.drag = false);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', () => drone.drag = false);
    function draw() {
      ta += 0.01; if (drone.auto) { drone.x = W / 2 + Math.sin(ta) * 300; drone.y = 80 + Math.cos(ta * 1.6) * 40; }
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0a1830'); sky.addColorStop(1, '#0b1424'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#13202f'; ctx.fillRect(0, H - 30, W, 30);
      let det = [];
      Object.values(layers).forEach(l => {
        ctx.fillStyle = l.on ? l.c + '18' : 'rgba(148,163,184,0.05)'; ctx.beginPath(); ctx.arc(l.x, l.y, l.r, Math.PI, 0); ctx.fill();
        ctx.fillStyle = l.on ? l.c : '#475569'; ctx.fillRect(l.x - 8, l.y - 14, 16, 18);
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(l.label, l.x, l.y + 16);
        if (l.on && Math.hypot(drone.x - l.x, drone.y - l.y) < l.r) { det.push(l.label); ctx.strokeStyle = l.c; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(drone.x, drone.y); ctx.stroke(); }
      });
      // Drohne
      ctx.fillStyle = det.length ? '#ef4444' : '#e2e8f0'; ctx.beginPath(); ctx.arc(drone.x, drone.y, 13, 0, 7); ctx.fill();
      ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🛸', drone.x, drone.y + 6);
      roDet.set(det.length ? det.join(', ') : '—'); roStat.set(det.length ? 'Drohne erkannt' : 'frei', det.length ? 'bad' : 'ok');
    }
    loop(canvas, draw);
    const btns = Object.entries(layers).map(([k, l]) => { const b = el('button', { class: 'btn primary', html: '<i class="fas fa-toggle-on"></i> ' + l.label }); b.addEventListener('click', () => { l.on = !l.on; b.className = 'btn' + (l.on ? ' primary' : ''); }); return b; });
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns), el('div', { class: 'phys-hint', text: '⟶ Zieh die Drohne; schalte die Erkennungsarten ein/aus.' }), el('div', { class: 'phys-ros' }, [roDet.wrap, roStat.wrap])]);
    return simCard({ icon: 'fa-helicopter', title: 'Drohnen-Detektion', sub: 'Mehrschichtige Luftraum-Überwachung', was: 'Drohnen erkennt man über mehrere Wege: <b>RF-Scanner</b> (Funk-Steuerlink, große Reichweite), <b>Akustik</b> (Rotorgeräusch, nah), <b>Radar</b> (Echo). Erst die Kombination ist zuverlässig.', warum: 'Schutz vor Spionage/Schmuggel über den Luftweg – relevant für KRITIS, Gefängnisse, Events. Eine Methode allein hat Lücken.', body });
  }

  /* ============================================================
     27) FFT-Analyser · Live-Spektrum (synthetisch)
     ============================================================ */
  function fftSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const N = 128; let type = 'sin', phase = 0;
    const roType = readout('Signal'), roPeak = readout('Hauptfrequenz');
    function signal(n) {
      const t = n / N * Math.PI * 2;
      if (type === 'sin') return Math.sin(t * 6 + phase);
      if (type === 'dual') return 0.6 * Math.sin(t * 4 + phase) + 0.5 * Math.sin(t * 11 + phase);
      if (type === 'noise') return Math.random() * 2 - 1;
      // Glas: tieffrequenter Schlag + hochfrequentes Splittern
      return 0.5 * Math.sin(t * 2 + phase) * Math.exp(-((n - 20) ** 2) / 200) + Math.sin(t * 24 + phase) * Math.exp(-((n - 70) ** 2) / 600);
    }
    function draw() {
      phase += 0.15;
      const buf = []; for (let n = 0; n < N; n++) buf.push(signal(n));
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Wellenform oben
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
      for (let n = 0; n < N; n++) { const x = n / N * W, y = 75 + buf[n] * 55; n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Zeitsignal', 8, 18); ctx.fillText('Frequenzspektrum (FFT)', 8, 168);
      // DFT
      const bins = 56; let peak = 0, peakMag = 0;
      const mags = [];
      for (let k = 1; k <= bins; k++) { let re = 0, im = 0; for (let n = 0; n < N; n++) { const a = -2 * Math.PI * k * n / N; re += buf[n] * Math.cos(a); im += buf[n] * Math.sin(a); } const m = Math.hypot(re, im) / N; mags.push(m); if (m > peakMag) { peakMag = m; peak = k; } }
      const bw = W / bins;
      mags.forEach((m, i) => { const h = Math.min(110, m * 240); ctx.fillStyle = `hsl(${190 - i * 2},80%,55%)`; ctx.fillRect(i * bw, H - 25 - h, bw - 1, h); });
      roType.set({ sin: 'Sinus', dual: 'Zwei Töne', noise: 'Rauschen', glas: 'Glasbruch' }[type]); roPeak.set(type === 'noise' ? 'breitbandig' : 'Bin ' + peak);
    }
    loop(canvas, draw);
    const mk = (k, lbl) => { const b = el('button', { class: 'btn' + (type === k ? ' primary' : '') }); b.textContent = lbl; b.addEventListener('click', () => { type = k; body.querySelectorAll('.phys-ctrl-btns .btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; };
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [mk('sin', 'Sinus'), mk('dual', 'Zwei Töne'), mk('noise', 'Rauschen'), mk('glas', 'Glasbruch')]), el('div', { class: 'phys-ros' }, [roType.wrap, roPeak.wrap])]);
    return simCard({ icon: 'fa-chart-column', title: 'FFT-Analyser · Live-Spektrum', sub: 'So „hört" ein Melder Frequenzen', was: 'Oben das Zeitsignal, unten sein Frequenzspektrum (FFT). Ein reiner Ton ist ein Balken, zwei Töne zwei Balken, Rauschen ist breit – und Glasbruch hat eine typische tief+hoch-Signatur.', warum: 'Genau diese Spektralanalyse steckt in Glasbruch-, Akustik- und Körperschallmeldern: sie erkennen Muster, nicht nur Lautstärke.', body });
  }

  /* ============================================================
     28) Vereinzelung · Drehkreuz (Anti-Tailgating)
     ============================================================ */
  function drehkreuzSim() {
    const W = 720, H = 300;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const cx = W / 2, cy = H / 2 + 10, R = 70;
    let ang = 0, target = 0, p1 = -120, p2 = -180, alarmT = 0, mode = null;
    const roStat = readout('Status'), roLog = readout('Letzte Aktion');
    function valid() { mode = 'ok'; target += Math.PI * 2 / 3; }
    function tail() { mode = 'tail'; alarmT = 60; }
    function draw() {
      ang += (target - ang) * 0.1;
      if (mode === 'ok') { p1 += 2.5; if (p1 > 140) { p1 = -120; mode = null; } }
      if (alarmT > 0) alarmT--;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Geländer
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, cy - R - 30); ctx.lineTo(cx - 20, cy - R - 30); ctx.moveTo(0, cy + R + 30); ctx.lineTo(cx - 20, cy + R + 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 20, cy - R - 30); ctx.lineTo(W, cy - R - 30); ctx.moveTo(cx + 20, cy + R + 30); ctx.lineTo(W, cy + R + 30); ctx.stroke();
      // Drehkreuz (3 Arme)
      ctx.strokeStyle = alarmT > 0 ? '#ef4444' : '#22d3ee'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const a = ang + i * Math.PI * 2 / 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); }
      ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 7); ctx.fill();
      // Personen
      ctx.font = '26px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🧍', cx + p1, cy); if (alarmT > 0 || mode === 'tail') ctx.fillText('🧍', cx + p2 + 40, cy);
      // Leser
      ctx.fillStyle = mode === 'ok' ? '#22c55e' : alarmT > 0 ? '#ef4444' : '#fbbf24'; ctx.fillRect(cx - 30, cy - R - 24, 16, 14);
      roStat.set(alarmT > 0 ? '🚨 Tailgating blockiert!' : mode === 'ok' ? 'Durchgang frei (1 Person)' : 'verriegelt', alarmT > 0 ? 'bad' : mode === 'ok' ? 'ok' : 'warn');
      roLog.set(alarmT > 0 ? 'Mitläufer abgewiesen' : mode === 'ok' ? 'Karte gültig → 1 dreht durch' : 'wartet');
    }
    loop(canvas, draw);
    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-id-card"></i> Gültige Karte' }); b1.addEventListener('click', valid);
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-users"></i> Mitläufer (Tailgating)' }); b2.addEventListener('click', tail);
    const body = el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2]), el('div', { class: 'phys-ros' }, [roStat.wrap, roLog.wrap])]);
    return simCard({ icon: 'fa-arrows-spin', title: 'Vereinzelung · Drehkreuz', sub: 'Genau eine Person pro Freigabe', was: 'Eine gültige Karte gibt das Drehkreuz für <b>genau eine</b> Person frei (es dreht um ein Drittel). Ein Mitläufer ohne eigene Freigabe wird mechanisch blockiert.', warum: 'Verhindert „Tailgating" – das unbemerkte Mitschlüpfen. Kernprinzip der Zutrittskontrolle in Rechenzentren, Werken, Stadien.', body });
  }

  /* ============================================================
     ★ FLAGGSCHIFF: Live-Einsatz – ganzes Objekt, alle Sensoren
     ============================================================ */
  function szeneSim() {
    const W = 1000, H = 440;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const radar = { x: 80, y: 80, r: 350 };
    const bld = { x: 380, y: 80, w: 480, h: 300 };
    const win1 = { x: 480, y: 80 }, win2 = { x: 660, y: 80 };
    const doorR = { x: 380, y: 300, w: 12, h: 64 };
    const pir1 = { x: 480, y: 250, r: 78 }, pir2 = { x: 760, y: 185, r: 78 };
    const laser = [700, 100, 700, 360];
    const cam = { x: 360, y: 66, dir: Math.atan2(300 - 66, 150 - 360), half: 0.5, rDay: 340, rNight: 150 };
    const path = [
      { x: 30, y: 360 }, { x: 180, y: 300 }, { x: 300, y: 200 }, { x: 480, y: 86 },
      { x: 480, y: 175 }, { x: 480, y: 250 }, { x: 620, y: 300 }, { x: 700, y: 300 },
      { x: 760, y: 185 }, { x: 840, y: 140 }, { x: 600, y: 405 }, { x: 120, y: 415 }, { x: 30, y: 360 },
    ];
    const stars = Array.from({ length: 40 }, () => ({ x: 20 + Math.random() * 320, y: 24 + Math.random() * 380, r: Math.random() * 1.4 + 0.3 }));
    function mkIntr(s) { return { seg: s % (path.length - 1), f: Math.random(), x: 30, y: 360, spd: 2.2 + Math.random() * 1.1 }; }
    let intruders = [mkIntr(0)];
    let sweep = 0, dragging = false, armed = true, night = false;
    let glassT = 0, contactT = 0, winLatch = false, doorLatch = false;
    const prev = {}; let prevState = 'SCHARF';
    const nsl = { active: false, t: 0 };
    const events = [];

    // --- HTML-Leitstand ---
    const statusBadge = el('div', { class: 'scene-status scharf', text: 'SCHARF · ruhig' });
    const nslRow = el('div', { class: 'scene-nsl', text: 'NSL: bereit' });
    const lampWrap = el('div', { class: 'scene-lamps' });
    const lamps = {};
    [['perimeter', 'Perimeter · Radar'], ['kamera', 'Kamera · Video (Tag/Nacht)'], ['glass', 'Glasbruch Fenster'], ['contact', 'Magnetkontakt Tür/Fenster'], ['pir', 'Bewegung innen · PIR'], ['laser', 'Laser-Korridor']]
      .forEach(([k, label]) => {
        const row = el('div', { class: 'scene-lamp' });
        const dot = el('span', { class: 'sl-dot' });
        row.appendChild(dot); row.appendChild(el('span', { text: label }));
        lampWrap.appendChild(row); lamps[k] = dot;
      });
    const logWrap = el('div', { class: 'scene-log' });
    function renderLog() {
      logWrap.innerHTML = events.length
        ? events.map(e => `<div><b>${e.time}</b> · ${e.label}</div>`).join('')
        : '<div style="opacity:.6">Noch keine Ereignisse …</div>';
    }
    renderLog();
    function pushEvent(label) {
      if (!armed) return;
      const time = new Date().toLocaleTimeString('de-DE', { hour12: false });
      events.unshift({ time, label }); if (events.length > 7) events.pop(); renderLog();
    }

    function down(e) { dragging = true; move(e); }
    function move(e) { if (!dragging) return; e.preventDefault(); const p = pos(canvas, e); intruders[0].x = p.x; intruders[0].y = p.y; }
    function up() { dragging = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);

    function camSees(p) {
      const dx = p.x - cam.x, dy = p.y - cam.y, dist = Math.hypot(dx, dy);
      const da = Math.abs(((Math.atan2(dy, dx) - cam.dir) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      return dist < (night ? cam.rNight : cam.rDay) && da < cam.half;
    }

    function draw() {
      sweep = (sweep + 0.035) % (Math.PI * 2);
      // Eindringlinge bewegen
      intruders.forEach((it, idx) => {
        if (dragging && idx === 0) return;
        const a = path[it.seg], b = path[it.seg + 1];
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        it.f += it.spd / len;
        if (it.f >= 1) { it.f = 0; it.seg = (it.seg + 1) % (path.length - 1); }
        it.x = a.x + (b.x - a.x) * it.f; it.y = a.y + (b.y - a.y) * it.f;
      });
      // Fenster/Tür-Auslöser (über alle Eindringlinge)
      const dWin = Math.min(...intruders.map(it => Math.min(Math.hypot(it.x - win1.x, it.y - win1.y), Math.hypot(it.x - win2.x, it.y - win2.y))));
      if (dWin < 30 && !winLatch) { winLatch = true; glassT = 210; contactT = 260; pushEvent('Glasbruch + Fensterkontakt Nord'); }
      if (dWin > 70) winLatch = false;
      const inDoor = intruders.some(it => it.x > doorR.x - 24 && it.x < doorR.x + 24 && it.y > doorR.y - 10 && it.y < doorR.y + doorR.h + 10);
      if (inDoor && !doorLatch) { doorLatch = true; contactT = 260; pushEvent('Türkontakt geöffnet'); }
      if (!inDoor) doorLatch = false;
      if (glassT > 0) glassT--; if (contactT > 0) contactT--;

      const inBld = it => it.x > bld.x && it.x < bld.x + bld.w && it.y > bld.y && it.y < bld.y + bld.h;
      const act = {
        perimeter: intruders.some(it => it.x < bld.x - 5 && Math.hypot(it.x - radar.x, it.y - radar.y) < radar.r),
        kamera: intruders.some(it => camSees(it)),
        glass: glassT > 0,
        contact: contactT > 0,
        pir: intruders.some(it => inBld(it) && (Math.hypot(it.x - pir1.x, it.y - pir1.y) < pir1.r || Math.hypot(it.x - pir2.x, it.y - pir2.y) < pir2.r)),
        laser: intruders.some(it => distSeg(it.x, it.y, laser[0], laser[1], laser[2], laser[3]) < 16),
      };
      const labels = { perimeter: 'Perimeter: Bewegung erfasst', kamera: 'Kamera: Objekt im Bild', pir: 'PIR: Bewegung im Innenraum', laser: 'Laser-Korridor unterbrochen' };
      if (armed) ['perimeter', 'kamera', 'pir', 'laser'].forEach(k => { if (act[k] && !prev[k]) { pushEvent(labels[k]); SFX.tone(660, 0.06, 'triangle', 0.05); } });
      Object.assign(prev, act);

      const hard = act.glass || act.contact || act.pir || act.laser;
      const outer = act.perimeter || act.kamera;
      const state = !armed ? 'UNSCHARF' : hard ? 'ALARM' : outer ? 'VORALARM' : 'SCHARF';
      if (state !== prevState) {
        if (state === 'VORALARM') SFX.tone(880, 0.12, 'square', 0.05);
        if (state === 'ALARM') SFX.tone(1200, 0.1, 'square', 0.07);
        prevState = state;
      }
      if (state === 'ALARM') SFX.startSiren(); else SFX.stopSiren();
      // NSL-Aufschaltung
      if (state === 'ALARM') {
        if (!nsl.active) { nsl.active = true; nsl.t = 8; pushEvent('🚓 Alarm an NSL aufgeschaltet'); }
        else if (nsl.t > 0) nsl.t = Math.max(0, nsl.t - 1 / 60);
      } else { nsl.active = false; }

      // ===== Zeichnen =====
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = night ? '#03060d' : '#08111f'; ctx.fillRect(0, 0, W, H);
      if (night) { ctx.fillStyle = 'rgba(226,232,240,0.7)'; stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); }); }
      // Zaun
      ctx.strokeStyle = act.perimeter ? '#fbbf24' : 'rgba(34,211,238,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([8, 5]);
      ctx.strokeRect(16, 16, W - 32, H - 32); ctx.setLineDash([]);
      ctx.fillStyle = '#475569'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(night ? 'HOF / PERIMETER · NACHT' : 'HOF / PERIMETER · TAG', 28, 36);
      // Radar
      ctx.strokeStyle = 'rgba(34,197,94,0.18)'; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(radar.x, radar.y, radar.r * i / 3, 0, 7); ctx.stroke(); }
      ctx.save(); ctx.beginPath(); ctx.moveTo(radar.x, radar.y);
      for (let k = 0; k <= 16; k++) { const a = sweep - 0.4 + k / 16 * 0.4; ctx.lineTo(radar.x + Math.cos(a) * radar.r, radar.y + Math.sin(a) * radar.r); }
      ctx.closePath(); const g = ctx.createRadialGradient(radar.x, radar.y, 0, radar.x, radar.y, radar.r);
      g.addColorStop(0, 'rgba(34,197,94,0.30)'); g.addColorStop(1, 'rgba(34,197,94,0)'); ctx.fillStyle = g; ctx.fill(); ctx.restore();
      ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(radar.x, radar.y, 7, 0, 7); ctx.fill();
      // Kamera-Sichtfeld
      const rng = night ? cam.rNight : cam.rDay;
      ctx.beginPath(); ctx.moveTo(cam.x, cam.y);
      for (let k = 0; k <= 14; k++) { const a = cam.dir - cam.half + k / 14 * 2 * cam.half; ctx.lineTo(cam.x + Math.cos(a) * rng, cam.y + Math.sin(a) * rng); }
      ctx.closePath(); ctx.fillStyle = act.kamera ? 'rgba(251,191,36,0.22)' : `rgba(125,211,252,${night ? 0.05 : 0.12})`; ctx.fill();
      ctx.fillStyle = '#7dd3fc'; ctx.fillRect(cam.x - 9, cam.y - 7, 18, 14);
      // Gebäude
      ctx.fillStyle = night ? 'rgba(20,28,42,0.9)' : 'rgba(30,41,59,0.85)'; ctx.fillRect(bld.x, bld.y, bld.w, bld.h);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3; ctx.strokeRect(bld.x, bld.y, bld.w, bld.h);
      ctx.fillStyle = '#475569'; ctx.fillText('GEBÄUDE', bld.x + 14, bld.y + 24);
      // PIR-Zonen
      [pir1, pir2].forEach(p => {
        const on = intruders.some(it => inBld(it) && Math.hypot(it.x - p.x, it.y - p.y) < p.r);
        ctx.fillStyle = on ? 'rgba(251,191,36,0.22)' : 'rgba(34,211,238,0.07)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        ctx.fillStyle = on ? '#fbbf24' : '#22d3ee'; ctx.beginPath(); ctx.arc(p.x, p.y - p.r, 5, 0, 7); ctx.fill();
      });
      // Laser
      ctx.strokeStyle = act.laser ? '#ef4444' : 'rgba(248,113,113,0.8)'; ctx.lineWidth = act.laser ? 3 : 2;
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(laser[0], laser[1]); ctx.lineTo(laser[2], laser[3]); ctx.stroke(); ctx.shadowBlur = 0;
      // Fenster / Tür
      [win1, win2].forEach(w => { ctx.fillStyle = act.glass ? '#ef4444' : '#38bdf8'; ctx.fillRect(w.x - 22, w.y - 4, 44, 8); });
      ctx.fillStyle = act.contact ? '#ef4444' : '#22c55e'; ctx.fillRect(doorR.x - 6, doorR.y, doorR.w + 12, doorR.h);
      // NSL-Aufschaltung (pulsierende Linie zur Leitstelle oben rechts)
      if (nsl.active) {
        const nx = W - 60, ny = 40;
        ctx.strokeStyle = `rgba(239,68,68,${0.4 + 0.4 * Math.sin(Date.now() / 100)})`; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(bld.x + bld.w / 2, bld.y); ctx.lineTo(nx, ny); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(nx, ny, 14, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('NSL', nx, ny + 3);
      }
      // Eindringlinge
      intruders.forEach(it => {
        const onIt = intruders.indexOf(it) === 0 && (hard || outer);
        ctx.fillStyle = hard ? '#ef4444' : outer ? '#fbbf24' : '#e2e8f0';
        ctx.beginPath(); ctx.arc(it.x, it.y, 13, 0, 7); ctx.fill();
        ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🥷', it.x, it.y + 5);
      });
      if (state === 'ALARM') { ctx.fillStyle = `rgba(239,68,68,${0.05 + 0.05 * Math.sin(Date.now() / 120)})`; ctx.fillRect(0, 0, W, H); }

      // Panel
      Object.keys(lamps).forEach(k => lamps[k].className = 'sl-dot' + (act[k] ? ' on' : ''));
      const sc = state === 'ALARM' ? 'alarm' : state === 'VORALARM' ? 'vor' : state === 'UNSCHARF' ? 'unscharf' : 'scharf';
      statusBadge.className = 'scene-status ' + sc;
      statusBadge.textContent = state === 'ALARM' ? '🚨 ALARM – Eindringling im Objekt'
        : state === 'VORALARM' ? '⚠ VORALARM – Außenhaut/Perimeter'
        : state === 'UNSCHARF' ? '○ UNSCHARF – Anlage aus' : 'SCHARF · ruhig';
      nslRow.className = 'scene-nsl' + (nsl.active ? ' on' : '');
      nslRow.textContent = nsl.active ? (nsl.t > 0 ? `🚓 NSL alarmiert · Streife in ${nsl.t.toFixed(0)} s` : '🚓 Streife vor Ort') : 'NSL: bereit';
    }
    function frame() { if (!canvas.isConnected) { SFX.stopSiren(); return; } draw(); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);

    // --- Steuerung ---
    const bArm = el('button', { class: 'btn primary', html: '<i class="fas fa-lock"></i> Scharf' });
    bArm.addEventListener('click', () => { armed = !armed; bArm.className = 'btn' + (armed ? ' primary' : ''); bArm.innerHTML = armed ? '<i class="fas fa-lock"></i> Scharf' : '<i class="fas fa-lock-open"></i> Unscharf'; if (!armed) { SFX.stopSiren(); nsl.active = false; } });
    const bNight = el('button', { class: 'btn', html: '<i class="fas fa-sun"></i> Tag' });
    bNight.addEventListener('click', () => { night = !night; bNight.innerHTML = night ? '<i class="fas fa-moon"></i> Nacht' : '<i class="fas fa-sun"></i> Tag'; bNight.className = 'btn' + (night ? ' primary' : ''); });
    const bAdd = el('button', { class: 'btn', html: '<i class="fas fa-user-plus"></i>' });
    bAdd.addEventListener('click', () => { if (intruders.length < 3) intruders.push(mkIntr(Math.floor(Math.random() * (path.length - 1)))); });
    const bRem = el('button', { class: 'btn', html: '<i class="fas fa-user-minus"></i>' });
    bRem.addEventListener('click', () => { if (intruders.length > 1) intruders.pop(); });
    const reset = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Log leeren' });
    reset.addEventListener('click', () => { events.length = 0; renderLog(); });
    const ctrls = el('div', { class: 'scene-ctrls' }, [bArm, bNight, bAdd, bRem]);

    const panel = el('div', { class: 'scene-panel' }, [
      statusBadge, nslRow, ctrls,
      el('div', { class: 'scene-panel-h', text: 'Sensorzustände' }), lampWrap,
      el('div', { class: 'scene-panel-h', text: 'Ereignis-Log' }), logWrap, reset,
    ]);
    const body = el('div', { class: 'scene-body' }, [canvas, panel]);

    const c = simCard({
      icon: 'fa-shield-halved', title: '★ Live-Leitstand · ganzes Objekt', sub: 'Alle Sensoren + Scharf/Unscharf · Tag/Nacht · NSL',
      was: 'Ein kompletter Standort mit Radar, Kamera, Glasbruch, Magnetkontakten, PIR-Zonen & Laser-Korridor. <b>Schalte scharf/unscharf, wechsle Tag/Nacht, schicke mehrere Eindringlinge</b> – oder zieh einen selbst. Bei Alarm läuft die Aufschaltung zur Notruf-Leitstelle (NSL).',
      warum: 'Zeigt das echte Zusammenspiel: nachts trägt die Kamera weniger weit (Radar/Wärme übernehmen), unscharf bleibt alles still, und ab „Alarm" geht die Meldung mit Streifen-Disposition an die NSL.',
      body,
    });
    c.classList.add('phys-card-wide');
    return c;
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
      <p class="lead">29 Echtzeit-Simulationen zum Anfassen, sortiert nach Wirkprinzip – inkl. kompletter
      <b>Live-Einsatz-Szene</b> mit Alarmzentrale. Ziehen, schieben, klicken. Ton einschalten für Sirene & Effekte.</p>
      <div class="phys-legend">
        <span><i class="fas fa-hand-pointer"></i> ziehen / schieben / klicken</span>
        <span><i class="fas fa-circle" style="color:#22c55e"></i> Ruhe</span>
        <span><i class="fas fa-circle" style="color:#ef4444"></i> Alarm</span>
      </div>`;
    const sndBtn = el('button', { class: 'phys-snd' + (SFX.isOn() ? ' on' : ''), html: SFX.isOn() ? '<i class="fas fa-volume-high"></i> Ton an' : '<i class="fas fa-volume-xmark"></i> Ton aus' });
    sndBtn.addEventListener('click', () => {
      const next = !SFX.isOn(); SFX.enable(next);
      sndBtn.className = 'phys-snd' + (next ? ' on' : '');
      sndBtn.innerHTML = next ? '<i class="fas fa-volume-high"></i> Ton an' : '<i class="fas fa-volume-xmark"></i> Ton aus';
    });
    intro.appendChild(sndBtn);
    root.appendChild(intro);

    root.appendChild(el('div', { class: 'phys-cat', text: '★ Live-Einsatz · ganzes Objekt' }));
    const sgrid = el('div', { class: 'phys-grid' }); sgrid.appendChild(szeneSim()); root.appendChild(sgrid);

    const cats = [
      { label: 'Bewegung & Präsenz', sims: [pirSim, dopplerSim, ultraschallSim, radarSim, thermalSim, dualSim] },
      { label: 'Perimeter & Außenhaut', sims: [mwSchrankeSim, glasfaserSim, induktionSim, trittmatteSim, drohneSim] },
      { label: 'Video & Zutritt', sims: [cctvSim, zutrittSim, drehkreuzSim] },
      { label: 'Öffnung & Mechanik', sims: [reedSim, lockSim, seismikSim, kapazitivSim] },
      { label: 'Licht & Laser', sims: [beamSim, laserSim, laserMicSim] },
      { label: 'Akustik & Spektrum', sims: [glassSim, triSim, fftSim] },
      { label: 'Abwehr & Reaktion', sims: [nebelSim, tamperSim] },
      { label: 'Funk & Übertragung', sims: [funkSim] },
      { label: 'Grundlagen & Spektrum', sims: [schwarzkoerperSim] },
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
