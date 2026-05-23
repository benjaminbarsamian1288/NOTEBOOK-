/* „Dein Handy als Sensor" – nutzt echte Geräte-Hardware:
   Mikrofon (Akustik/Glasbruch), Bewegungssensor (Erschütterung) und
   Kamera (Bewegungserkennung + Thermal-Filter, AR-Overlay).
   Kamera/Mikro/Bewegung brauchen einen sicheren Kontext (https oder localhost).
   window.SENSOREN.view() liefert den Ansichts-Knoten. */
window.SENSOREN = (() => {
  const { el } = U;

  function iron(t) {
    t = Math.max(0, Math.min(1, t));
    const s = [[0, 4, 2, 18], [0.25, 70, 0, 100], [0.45, 170, 25, 70], [0.62, 232, 75, 20], [0.8, 255, 175, 35], [1, 255, 255, 235]];
    for (let i = 1; i < s.length; i++) if (t <= s[i][0]) { const a = s[i - 1], b = s[i], f = (t - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f]; }
    return [255, 255, 235];
  }

  function card(icon, title, sub, was) {
    const c = el('div', { class: 'phys-card' });
    c.appendChild(el('div', { class: 'phys-head' }, [
      el('div', { class: 'phys-ico', html: `<i class="fas ${icon}"></i>` }),
      el('div', {}, [el('h3', { text: title }), el('div', { class: 'phys-sub', text: sub })]),
    ]));
    c.appendChild(el('div', { class: 'phys-explain' }, [el('div', { class: 'phys-ex-row', html: was })]));
    return c;
  }

  /* ---------- Mikrofon ---------- */
  function micCard() {
    const c = card('fa-microphone-lines', 'Mikrofon · Akustik-Melder', 'Echtes Mikrofon → Glasbruch/Klatsch',
      '<b>Das passiert hier:</b> Dein Mikrofon liefert ein Live-Frequenzspektrum. Ein lauter, hochfrequenter Knall (Klatschen, Glas) lässt den Pegel kurz hochschnellen → Auslösung.');
    const canvas = el('canvas', { class: 'phys-canvas', width: 700, height: 220 });
    const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' });
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-microphone"></i> Mikrofon aktivieren' });
    let analyser = null, data = null, stream = null, hit = 0;

    btn.addEventListener('click', async () => {
      if (analyser) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const src = ac.createMediaStreamSource(stream);
        analyser = ac.createAnalyser(); analyser.fftSize = 512; data = new Uint8Array(analyser.frequencyBinCount);
        src.connect(analyser);
        btn.style.display = 'none'; status.textContent = 'aktiv – mach mal Lärm!';
      } catch (e) { status.textContent = '⚠ Kein Zugriff: ' + (window.isSecureContext ? 'Mikrofon abgelehnt' : 'nur über https-Adresse möglich'); status.classList.add('bad'); }
    });

    function draw() {
      if (!canvas.isConnected) { if (stream) stream.getTracks().forEach(t => t.stop()); return; }
      ctx.clearRect(0, 0, 700, 220); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 700, 220);
      if (analyser) {
        analyser.getByteFrequencyData(data);
        const bars = data.length, bw = 700 / bars; let hi = 0;
        for (let i = 0; i < bars; i++) {
          const v = data[i] / 255; const h = v * 200;
          if (i > bars * 0.5) hi = Math.max(hi, v);
          ctx.fillStyle = `hsl(${190 - v * 120},80%,${40 + v * 25}%)`;
          ctx.fillRect(i * bw, 220 - h, bw - 1, h);
        }
        if (hi > 0.62) hit = 20;
        if (hit > 0) { hit--; ctx.fillStyle = `rgba(239,68,68,${hit / 28})`; ctx.fillRect(0, 0, 700, 220); }
        status.textContent = hit > 0 ? '🔊 AKUSTIK-EREIGNIS erkannt!' : 'aktiv – mach mal Lärm!';
        status.className = 'sens-status' + (hit > 0 ? ' bad' : ' ok');
      } else { ctx.fillStyle = '#334155'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Mikrofon aktivieren, um das Spektrum zu sehen', 350, 110); }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]));
    return c;
  }

  /* ---------- Bewegungssensor ---------- */
  function motionCard() {
    const c = card('fa-mobile-screen-button', 'Bewegungssensor · Erschütterung', 'Handy = echter Erschütterungsmelder',
      '<b>Das passiert hier:</b> Der Beschleunigungssensor deines Handys misst Erschütterungen. Klopf gegen das Gerät oder beweg es ruckartig – übersteigt die Beschleunigung die Schwelle, schlägt es an. (Nur auf Smartphones)');
    const canvas = el('canvas', { class: 'phys-canvas', width: 700, height: 200 });
    const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' });
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-arrows-up-down-left-right"></i> Bewegungssensor aktivieren' });
    const buf = new Array(700).fill(100); let active = false, alarmT = 0, handler = null;

    function onMotion(e) {
      const a = e.accelerationIncludingGravity || e.acceleration || {};
      const mag = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
      buf.push(100 - Math.min(90, Math.abs(mag - 9.8) * 8)); buf.shift();
      if (Math.abs(mag - 9.8) > 6) alarmT = 24;
    }
    btn.addEventListener('click', async () => {
      try {
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          const p = await DeviceMotionEvent.requestPermission(); if (p !== 'granted') throw 0;
        } else if (typeof DeviceMotionEvent === 'undefined') { throw 0; }
        handler = onMotion; window.addEventListener('devicemotion', handler);
        active = true; btn.style.display = 'none'; status.textContent = 'aktiv – schüttel/klopf das Handy!';
      } catch (e) { status.textContent = '⚠ Bewegungssensor nicht verfügbar (Smartphone + https nötig)'; status.classList.add('bad'); }
    });
    function draw() {
      if (!canvas.isConnected) { if (handler) window.removeEventListener('devicemotion', handler); return; }
      if (alarmT > 0) alarmT--;
      ctx.clearRect(0, 0, 700, 200); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 700, 200);
      ctx.strokeStyle = alarmT > 0 ? '#ef4444' : '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 0; x < 700; x++) x ? ctx.lineTo(x, buf[x]) : ctx.moveTo(x, buf[x]); ctx.stroke();
      if (!active) { ctx.fillStyle = '#334155'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Auf dem Smartphone aktivieren', 350, 100); }
      status.className = 'sens-status' + (alarmT > 0 ? ' bad' : active ? ' ok' : '');
      if (alarmT > 0) status.textContent = '💥 ERSCHÜTTERUNG erkannt!';
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]));
    return c;
  }

  /* ---------- Kamera + AR + Thermal ---------- */
  function cameraCard() {
    const c = card('fa-camera', 'Kamera · Bewegung & Thermal (AR)', 'Echte Kamera → Bewegungsboxen + Wärmebild-Look',
      '<b>Das passiert hier:</b> Das Live-Kamerabild wird Bild für Bild verglichen – wo sich etwas <b>bewegt</b>, erscheint ein Rahmen (wie eine Überwachungskamera mit Bewegungserkennung). Mit „Thermal" wird die Helligkeit in ein Wärmebild-Falschfarbenbild übersetzt.');
    const W = 640, H = 360;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const video = el('video', { autoplay: '', playsinline: '', muted: '', style: 'display:none' });
    const small = el('canvas', { width: 80, height: 45 }); const sctx = small.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' });
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-camera"></i> Kamera aktivieren' });
    const tBtn = el('button', { class: 'btn', html: '<i class="fas fa-temperature-half"></i> Thermal' });
    let stream = null, thermal = false, prev = null;
    tBtn.addEventListener('click', () => { thermal = !thermal; tBtn.className = 'btn' + (thermal ? ' primary' : ''); });

    btn.addEventListener('click', async () => {
      if (stream) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream; await video.play(); btn.style.display = 'none'; status.textContent = 'aktiv'; status.classList.add('ok');
      } catch (e) { status.textContent = '⚠ Kein Kamerazugriff: ' + (window.isSecureContext ? 'abgelehnt' : 'nur über https-Adresse'); status.classList.add('bad'); }
    });

    function draw() {
      if (!canvas.isConnected) { if (stream) stream.getTracks().forEach(t => t.stop()); return; }
      if (stream && video.videoWidth) {
        ctx.drawImage(video, 0, 0, W, H);
        // Thermal-Filter
        if (thermal) {
          const img = ctx.getImageData(0, 0, W, H), d = img.data;
          for (let i = 0; i < d.length; i += 4) { const l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255; const [r, g, b] = iron(l); d[i] = r; d[i + 1] = g; d[i + 2] = b; }
          ctx.putImageData(img, 0, 0);
        }
        // Bewegungserkennung über Mini-Frame-Differenz
        sctx.drawImage(video, 0, 0, 80, 45);
        const cur = sctx.getImageData(0, 0, 80, 45).data;
        if (prev) {
          let minx = 80, miny = 45, maxx = 0, maxy = 0, moved = 0;
          for (let y = 0; y < 45; y++) for (let x = 0; x < 80; x++) {
            const i = (y * 80 + x) * 4; const diff = Math.abs(cur[i] - prev[i]) + Math.abs(cur[i + 1] - prev[i + 1]) + Math.abs(cur[i + 2] - prev[i + 2]);
            if (diff > 90) { moved++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
          }
          if (moved > 12) {
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
            ctx.strokeRect(minx / 80 * W, miny / 45 * H, (maxx - minx) / 80 * W, (maxy - miny) / 45 * H);
            ctx.fillStyle = '#ef4444'; ctx.font = '14px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('● BEWEGUNG', 12, 24);
            status.textContent = '🎯 Bewegung erkannt!'; status.className = 'sens-status bad';
          } else { status.textContent = 'aktiv – ruhig'; status.className = 'sens-status ok'; }
        }
        prev = cur;
        // AR-Scanlinie
        ctx.strokeStyle = 'rgba(34,211,238,0.4)'; ctx.lineWidth = 2; const sy = (Date.now() / 8 % H); ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      } else { ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#334155'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Kamera aktivieren (Handy: Rückkamera)', W / 2, H / 2); }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, tBtn, status]));
    return c;
  }

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Krass · echte Hardware</span>
      <h1>Dein Handy wird zum Sensor 📱</h1>
      <p class="lead">Diese Seite nutzt die <b>echte Hardware</b> deines Geräts: Mikrofon, Bewegungssensor und Kamera werden
      zu echten Sicherheits-Sensoren. Tippe auf „aktivieren" und erlaube den Zugriff.</p>`;
    if (!window.isSecureContext) {
      const warn = el('div', { class: 'sens-warn' });
      warn.innerHTML = '⚠ <b>Wichtig:</b> Kamera, Mikrofon und Bewegungssensor funktionieren nur über eine <b>https-Web-Adresse</b> (oder localhost) – <u>nicht</u> beim Doppelklick auf die Datei. Öffne die App über den Online-Link (GitHub Pages), dann gehen alle Funktionen.';
      intro.appendChild(warn);
    }
    root.appendChild(intro);
    const grid = el('div', { class: 'phys-grid' });
    [cameraCard(), micCard(), motionCard()].forEach(c => grid.appendChild(c));
    root.appendChild(grid);
    return root;
  }

  return { view };
})();
