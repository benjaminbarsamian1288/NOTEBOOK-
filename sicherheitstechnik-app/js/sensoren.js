/* „Dein Handy als Sensor" – nutzt echte Geräte-Hardware als Sicherheits-Tools.
   Kamera-Studio (Front/Rück, Infrarot, Thermal, Kanten, Zoom, Heatmap, Foto,
   Taschenlampe, Lux), Mikrofon (Spektrum + dB), Erschütterung, Wasserwaage,
   Kompass, GPS/Geofence. Hardware braucht sicheren Kontext (https/localhost).
   window.SENSOREN.view(). */
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
    c.appendChild(el('div', { class: 'phys-head' }, [el('div', { class: 'phys-ico', html: `<i class="fas ${icon}"></i>` }), el('div', {}, [el('h3', { text: title }), el('div', { class: 'phys-sub', text: sub })])]));
    c.appendChild(el('div', { class: 'phys-explain' }, [el('div', { class: 'phys-ex-row', html: was })]));
    return c;
  }
  function ro(label) { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v', text: '–' }); w.appendChild(el('span', { class: 'phys-ro-l', text: label })); w.appendChild(v); return { wrap: w, set: (t, c) => { v.textContent = t; v.className = 'phys-ro-v' + (c ? ' ' + c : ''); } }; }
  async function askMotion() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') { return (await DeviceMotionEvent.requestPermission()) === 'granted'; }
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') { return (await DeviceOrientationEvent.requestPermission()) === 'granted'; }
    return true;
  }

  let _ac = null;
  function AC() { if (!_ac) { try { _ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { _ac = null; } } if (_ac && _ac.state === 'suspended') _ac.resume(); return _ac; }
  function beep(f, d) { const a = AC(); if (!a) return; const o = a.createOscillator(), g = a.createGain(); o.frequency.value = f; g.gain.value = 0.08; g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + d); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + d); }

  /* ===================== KAMERA-STUDIO ===================== */
  function cameraCard() {
    const c = card('fa-camera', 'Kamera-Studio · Front/Rück · IR · Thermal', 'Echte Kamera mit Sicherheits-Filtern',
      '<b>Das passiert hier:</b> Live-Bild deiner Kamera mit echten Überwachungs-Tools: Front/Rück umschalten, <b>Infrarot-Nachtsicht</b>, <b>Wärmebild-Look</b>, Kantenerkennung, Digitalzoom, Bewegungs-Erkennung + Heatmap, Schnappschuss und Taschenlampe.');
    c.classList.add('phys-card-wide');
    const W = 560, H = 315;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    const video = el('video', { autoplay: '', playsinline: '', muted: '', style: 'display:none' });
    const small = el('canvas', { width: 96, height: 54 }); const sctx = small.getContext('2d');
    const heat = el('canvas', { width: W, height: H }); const hctx = heat.getContext('2d');
    const edge = el('canvas', { width: 200, height: 112 }); const ectx = edge.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' });
    let stream = null, facing = 'environment', mode = 'normal', zoom = 1, motion = false, heatmap = false, prev = null, track = null, torchOn = false;
    const roLux = ro('Helligkeit'), roMode = ro('Modus'), roMov = ro('Bewegung');

    async function start() {
      try { if (stream) stream.getTracks().forEach(t => t.stop()); stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } }); video.srcObject = stream; await video.play(); track = stream.getVideoTracks()[0]; status.textContent = 'aktiv'; status.className = 'sens-status ok'; actBtn.style.display = 'none'; }
      catch (e) { status.textContent = '⚠ Kein Kamerazugriff: ' + (window.isSecureContext ? 'abgelehnt' : 'nur über https-Adresse'); status.className = 'sens-status bad'; }
    }
    const actBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-camera"></i> Kamera starten' }); actBtn.addEventListener('click', start);
    const flipBtn = el('button', { class: 'btn', html: '<i class="fas fa-camera-rotate"></i> Front/Rück' });
    flipBtn.addEventListener('click', () => { facing = facing === 'environment' ? 'user' : 'environment'; if (stream) start(); });
    const modes = [['normal', 'Normal'], ['infrarot', 'Infrarot'], ['thermal', 'Thermal'], ['kanten', 'Kanten'], ['negativ', 'Negativ']];
    const modeBtns = modes.map(([k, lbl]) => { const b = el('button', { class: 'btn' + (k === 'normal' ? ' primary' : ''), text: lbl }); b.addEventListener('click', () => { mode = k; modeRow.querySelectorAll('.btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const modeRow = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, modeBtns);
    const zoomS = el('input', { type: 'range', min: '1', max: '5', step: '0.1', value: '1', class: 'phys-slider' }); zoomS.addEventListener('input', () => zoom = +zoomS.value);
    const motBtn = el('button', { class: 'btn', html: '<i class="fas fa-person-running"></i> Bewegung' }); motBtn.addEventListener('click', () => { motion = !motion; motBtn.className = 'btn' + (motion ? ' primary' : ''); });
    const heatBtn = el('button', { class: 'btn', html: '<i class="fas fa-fire"></i> Heatmap' }); heatBtn.addEventListener('click', () => { heatmap = !heatmap; heatBtn.className = 'btn' + (heatmap ? ' primary' : ''); if (!heatmap) hctx.clearRect(0, 0, W, H); });
    const snapBtn = el('button', { class: 'btn', html: '<i class="fas fa-circle-dot"></i> Foto' });
    const shots = el('div', { class: 'sens-shots' });
    snapBtn.addEventListener('click', () => { const url = canvas.toDataURL('image/png'); const a = el('a', { href: url, download: 'schnappschuss.png' }); const im = el('img', { src: url, class: 'sens-shot' }); im.title = 'Zum Speichern klicken'; im.addEventListener('click', () => a.click()); shots.prepend(im); while (shots.children.length > 4) shots.lastChild.remove(); });
    const torchBtn = el('button', { class: 'btn', html: '<i class="fas fa-bolt"></i> Licht' });
    torchBtn.addEventListener('click', async () => { try { torchOn = !torchOn; await track.applyConstraints({ advanced: [{ torch: torchOn }] }); torchBtn.className = 'btn' + (torchOn ? ' primary' : ''); } catch (e) { status.textContent = '⚠ Taschenlampe nicht unterstützt (meist nur Rückkamera)'; } });

    function process() {
      if (mode === 'thermal') { const img = ctx.getImageData(0, 0, W, H), d = img.data; for (let i = 0; i < d.length; i += 4) { const l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255; const [r, g, b] = iron(l); d[i] = r; d[i + 1] = g; d[i + 2] = b; } ctx.putImageData(img, 0, 0); }
      else if (mode === 'kanten') {
        ectx.drawImage(video, 0, 0, 200, 112); const s = ectx.getImageData(0, 0, 200, 112).data; const out = ectx.createImageData(200, 112), o = out.data;
        const gray = i => (s[i] * 0.3 + s[i + 1] * 0.59 + s[i + 2] * 0.11);
        for (let y = 1; y < 111; y++) for (let x = 1; x < 199; x++) { const i = (y * 200 + x) * 4; const gx = gray(i - 4) - gray(i + 4), gy = gray(i - 800) - gray(i + 800); const m = Math.min(255, Math.hypot(gx, gy)); o[i] = o[i + 1] = m; o[i + 2] = Math.min(255, m * 1.3); o[i + 3] = 255; }
        ectx.putImageData(out, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.imageSmoothingEnabled = true; ctx.drawImage(edge, 0, 0, W, H);
      }
    }

    function draw() {
      if (!canvas.isConnected) { if (stream) stream.getTracks().forEach(t => t.stop()); return; }
      if (stream && video.videoWidth) {
        const vw = video.videoWidth, vh = video.videoHeight; const sw = vw / zoom, sh = vh / zoom, sx = (vw - sw) / 2, sy = (vh - sh) / 2;
        ctx.filter = mode === 'negativ' ? 'invert(1)' : mode === 'infrarot' ? 'grayscale(1) brightness(1.5) contrast(1.25)' : 'none';
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H); ctx.filter = 'none';
        if (mode === 'infrarot') { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(34,197,94,0.45)'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
        process();
        // Helligkeit/Lux schätzen
        sctx.drawImage(video, 0, 0, 96, 54); const sd = sctx.getImageData(0, 0, 96, 54).data; let sum = 0; for (let i = 0; i < sd.length; i += 4) sum += (sd[i] + sd[i + 1] + sd[i + 2]); const bright = sum / (96 * 54 * 3 * 255);
        roLux.set('~' + Math.round(bright * bright * 1000) + ' lx (' + Math.round(bright * 100) + '%)');
        // Bewegung
        let moved = 0;
        if (motion || heatmap) {
          const cur = sd;
          if (prev) { let minx = 96, miny = 54, maxx = 0, maxy = 0; for (let y = 0; y < 54; y++) for (let x = 0; x < 96; x++) { const i = (y * 96 + x) * 4; const df = Math.abs(cur[i] - prev[i]) + Math.abs(cur[i + 1] - prev[i + 1]) + Math.abs(cur[i + 2] - prev[i + 2]); if (df > 70) { moved++; if (heatmap) { hctx.fillStyle = 'rgba(239,68,68,0.05)'; hctx.fillRect(x / 96 * W - 4, y / 54 * H - 4, 10, 10); } if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; } }
            if (motion && moved > 6) { ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.strokeRect(minx / 96 * W, miny / 54 * H, (maxx - minx) / 96 * W, (maxy - miny) / 54 * H); } }
          prev = cur.slice();
        }
        if (heatmap) { hctx.fillStyle = 'rgba(0,0,0,0.012)'; hctx.fillRect(0, 0, W, H); ctx.globalAlpha = 0.6; ctx.drawImage(heat, 0, 0); ctx.globalAlpha = 1; }
        // AR-HUD
        ctx.strokeStyle = 'rgba(34,211,238,0.4)'; ctx.lineWidth = 1; const ln = (Date.now() / 8) % H; ctx.beginPath(); ctx.moveTo(0, ln); ctx.lineTo(W, ln); ctx.stroke();
        ctx.fillStyle = 'rgba(34,211,238,0.9)'; ctx.font = '11px monospace'; ctx.textAlign = 'left'; ctx.fillText((facing === 'user' ? 'FRONT' : 'RÜCK') + ' · ' + mode.toUpperCase() + ' · ' + zoom.toFixed(1) + 'x', 10, 18);
        roMov.set(moved > 6 ? 'erkannt' : '–', moved > 6 ? 'bad' : 'ok');
      } else { ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#334155'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Kamera starten', W / 2, H / 2); }
      roMode.set({ normal: 'Normal', infrarot: 'Infrarot-Nachtsicht', thermal: 'Wärmebild-Look', kanten: 'Kantenerkennung', negativ: 'Negativ' }[mode]);
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    c.append(canvas,
      el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [actBtn, flipBtn, motBtn, heatBtn, snapBtn, torchBtn]),
      modeRow,
      el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Zoom' }), zoomS]),
      shots,
      el('div', { class: 'phys-ros' }, [roMode.wrap, roLux.wrap, roMov.wrap]),
      status);
    return c;
  }

  /* ===================== MIKROFON ===================== */
  function micCard() {
    const c = card('fa-microphone-lines', 'Mikrofon · Akustik + dB-Pegel', 'Spektrum, Lautstärke & Glasbruch',
      '<b>Das passiert hier:</b> Live-Frequenzspektrum + Schallpegel in dB. Ein lauter, hochfrequenter Knall (Klatschen, Glas) löst aus.');
    const canvas = el('canvas', { class: 'phys-canvas', width: 700, height: 200 }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' });
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-microphone"></i> Mikrofon aktivieren' });
    const roDb = ro('Pegel'); let analyser = null, data = null, time = null, stream = null, hit = 0;
    btn.addEventListener('click', async () => { if (analyser) return; try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const ac = new (window.AudioContext || window.webkitAudioContext)(); const src = ac.createMediaStreamSource(stream); analyser = ac.createAnalyser(); analyser.fftSize = 1024; data = new Uint8Array(analyser.frequencyBinCount); time = new Uint8Array(analyser.fftSize); src.connect(analyser); btn.style.display = 'none'; status.textContent = 'aktiv'; status.className = 'sens-status ok'; } catch (e) { status.textContent = '⚠ ' + (window.isSecureContext ? 'Mikrofon abgelehnt' : 'nur über https'); status.className = 'sens-status bad'; } });
    function draw() { if (!canvas.isConnected) { if (stream) stream.getTracks().forEach(t => t.stop()); return; } ctx.clearRect(0, 0, 700, 200); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 700, 200); if (analyser) { analyser.getByteFrequencyData(data); analyser.getByteTimeDomainData(time); let rms = 0; for (let i = 0; i < time.length; i++) { const v = (time[i] - 128) / 128; rms += v * v; } rms = Math.sqrt(rms / time.length); const db = Math.max(0, Math.round(20 * Math.log10(rms + 1e-4) + 90)); const bars = data.length; let hi = 0; for (let i = 0; i < bars; i++) { const v = data[i] / 255; const h = v * 180; if (i > bars * 0.5) hi = Math.max(hi, v); ctx.fillStyle = `hsl(${190 - v * 120},80%,${40 + v * 25}%)`; ctx.fillRect(i / bars * 700, 200 - h, 700 / bars + 1, h); } if (hi > 0.6) hit = 18; if (hit > 0) { hit--; ctx.fillStyle = `rgba(239,68,68,${hit / 26})`; ctx.fillRect(0, 0, 700, 200); } roDb.set(db + ' dB'); status.textContent = hit > 0 ? '🔊 AKUSTIK-EREIGNIS!' : 'aktiv'; status.className = 'sens-status' + (hit > 0 ? ' bad' : ' ok'); } else { ctx.fillStyle = '#334155'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Mikrofon aktivieren', 350, 100); } requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]), el('div', { class: 'phys-ros' }, [roDb.wrap]));
    return c;
  }

  /* ===================== ERSCHÜTTERUNG ===================== */
  function motionCard() {
    const c = card('fa-wave-square', 'Bewegungssensor · Erschütterung', 'Handy = Erschütterungsmelder',
      '<b>Das passiert hier:</b> Der Beschleunigungssensor misst Erschütterungen. Klopf/beweg das Handy ruckartig → Auslösung. (Nur auf Smartphones)');
    const canvas = el('canvas', { class: 'phys-canvas', width: 700, height: 160 }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' });
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-arrows-up-down-left-right"></i> aktivieren' });
    const buf = new Array(700).fill(80); let active = false, alarmT = 0, handler = null;
    btn.addEventListener('click', async () => { try { if (!(await askMotion()) || typeof DeviceMotionEvent === 'undefined') throw 0; handler = e => { const a = e.accelerationIncludingGravity || {}; const m = Math.hypot(a.x || 0, a.y || 0, a.z || 0); buf.push(80 - Math.min(72, Math.abs(m - 9.8) * 7)); buf.shift(); if (Math.abs(m - 9.8) > 6) alarmT = 22; }; window.addEventListener('devicemotion', handler); active = true; btn.style.display = 'none'; status.textContent = 'aktiv'; status.className = 'sens-status ok'; } catch (e) { status.textContent = '⚠ nur Smartphone + https'; status.className = 'sens-status bad'; } });
    function draw() { if (!canvas.isConnected) { if (handler) window.removeEventListener('devicemotion', handler); return; } if (alarmT > 0) alarmT--; ctx.clearRect(0, 0, 700, 160); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 700, 160); ctx.strokeStyle = alarmT > 0 ? '#ef4444' : '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x < 700; x++) x ? ctx.lineTo(x, buf[x]) : ctx.moveTo(x, buf[x]); ctx.stroke(); if (!active) { ctx.fillStyle = '#334155'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Auf dem Smartphone aktivieren', 350, 84); } status.textContent = alarmT > 0 ? '💥 ERSCHÜTTERUNG!' : (active ? 'aktiv' : 'inaktiv'); status.className = 'sens-status' + (alarmT > 0 ? ' bad' : active ? ' ok' : ''); requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]));
    return c;
  }

  /* ===================== WASSERWAAGE ===================== */
  function levelCard() {
    const c = card('fa-ruler-combined', 'Wasserwaage · Montagehilfe', 'Kameras gerade ausrichten',
      '<b>Das passiert hier:</b> Der Lagesensor zeigt die Neigung deines Handys – ideal, um Kameras und Halterungen <b>exakt waagerecht</b> zu montieren.');
    const canvas = el('canvas', { class: 'phys-canvas', width: 360, height: 260 }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' }); const roT = ro('Neigung');
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-mobile-screen"></i> aktivieren' });
    let beta = 0, gamma = 0, on = false, handler = null;
    btn.addEventListener('click', async () => { try { if (!(await askMotion())) throw 0; handler = e => { beta = e.beta || 0; gamma = e.gamma || 0; }; window.addEventListener('deviceorientation', handler); on = true; btn.style.display = 'none'; status.textContent = 'aktiv'; status.className = 'sens-status ok'; } catch (e) { status.textContent = '⚠ nur Smartphone + https'; status.className = 'sens-status bad'; } });
    function draw() { if (!canvas.isConnected) { if (handler) window.removeEventListener('deviceorientation', handler); return; } ctx.clearRect(0, 0, 360, 260); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 360, 260); const cx = 180, cy = 130; const lvl = Math.abs(gamma) < 2 && Math.abs(beta) < 2; ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.beginPath(); ctx.arc(cx, cy, 90, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.stroke(); ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.beginPath(); ctx.moveTo(cx - 100, cy); ctx.lineTo(cx + 100, cy); ctx.moveTo(cx, cy - 100); ctx.lineTo(cx, cy + 100); ctx.stroke(); const bx = cx + Math.max(-85, Math.min(85, gamma * 3)), by = cy + Math.max(-85, Math.min(85, beta * 3)); ctx.fillStyle = lvl ? '#22c55e' : '#fbbf24'; ctx.beginPath(); ctx.arc(bx, by, 16, 0, 7); ctx.fill(); roT.set('β ' + beta.toFixed(0) + '° · γ ' + gamma.toFixed(0) + '°', lvl ? 'ok' : 'warn'); status.textContent = on ? (lvl ? '✓ waagerecht' : 'neigen…') : 'inaktiv'; status.className = 'sens-status' + (lvl ? ' ok' : on ? ' warn' : ''); requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]), el('div', { class: 'phys-ros' }, [roT.wrap]));
    return c;
  }

  /* ===================== KOMPASS ===================== */
  function compassCard() {
    const c = card('fa-compass', 'Kompass · Blickrichtung', 'Kamera-Ausrichtung dokumentieren',
      '<b>Das passiert hier:</b> Zeigt die Himmelsrichtung, in die das Handy zeigt – praktisch, um die <b>Blickrichtung einer Kamera</b> im Plan festzuhalten.');
    const canvas = el('canvas', { class: 'phys-canvas', width: 300, height: 300 }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' }); const roH = ro('Richtung');
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-compass"></i> aktivieren' });
    let head = 0, on = false, handler = null;
    btn.addEventListener('click', async () => { try { if (!(await askMotion())) throw 0; handler = e => { head = (e.webkitCompassHeading != null) ? e.webkitCompassHeading : (360 - (e.alpha || 0)); }; window.addEventListener('deviceorientation', handler); on = true; btn.style.display = 'none'; status.textContent = 'aktiv'; status.className = 'sens-status ok'; } catch (e) { status.textContent = '⚠ nur Smartphone + https'; status.className = 'sens-status bad'; } });
    function draw() { if (!canvas.isConnected) { if (handler) window.removeEventListener('deviceorientation', handler); return; } ctx.clearRect(0, 0, 300, 300); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 300, 300); const cx = 150, cy = 150; ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.beginPath(); ctx.arc(cx, cy, 110, 0, 7); ctx.stroke(); ctx.save(); ctx.translate(cx, cy); ctx.rotate(-head * Math.PI / 180); ['N', 'O', 'S', 'W'].forEach((d, i) => { const a = i * Math.PI / 2 - Math.PI / 2; ctx.fillStyle = d === 'N' ? '#ef4444' : '#94a3b8'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(d, Math.cos(a) * 88, Math.sin(a) * 88 + 6); }); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, -90); ctx.stroke(); ctx.restore(); ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.moveTo(cx, cy - 120); ctx.lineTo(cx - 8, cy - 105); ctx.lineTo(cx + 8, cy - 105); ctx.fill(); const dir = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'][Math.round(head / 45) % 8]; roH.set(Math.round(head) + '° ' + dir); status.textContent = on ? 'aktiv' : 'inaktiv'; status.className = 'sens-status' + (on ? ' ok' : ''); requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]), el('div', { class: 'phys-ros' }, [roH.wrap]));
    return c;
  }

  /* ===================== GPS / GEOFENCE ===================== */
  function gpsCard() {
    const c = card('fa-location-dot', 'GPS · Standort & Geofence', 'Position + virtueller Zaun',
      '<b>Das passiert hier:</b> Zeigt deine Position und Genauigkeit. Setze einen <b>Geofence</b>-Radius – verlässt du ihn, schlägt es an (Prinzip von Asset-Tracking & Ausbruchsmeldung).');
    const canvas = el('canvas', { class: 'phys-canvas', width: 360, height: 260 }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' }); const roPos = ro('Position'), roAcc = ro('Genauigkeit');
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-satellite-dish"></i> Standort' });
    const rad = el('input', { type: 'range', min: '20', max: '500', value: '100', class: 'phys-slider' });
    let pos = null, home = null, acc = 0, geo = 100; rad.addEventListener('input', () => geo = +rad.value);
    btn.addEventListener('click', () => { if (!navigator.geolocation) { status.textContent = '⚠ kein GPS'; status.className = 'sens-status bad'; return; } navigator.geolocation.watchPosition(p => { pos = p.coords; acc = p.coords.accuracy; if (!home) home = { lat: pos.latitude, lon: pos.longitude }; status.textContent = 'aktiv'; status.className = 'sens-status ok'; btn.style.display = 'none'; }, e => { status.textContent = '⚠ ' + e.message; status.className = 'sens-status bad'; }, { enableHighAccuracy: true }); });
    function dist(a, b) { const R = 6371000, dLat = (b.lat - a.lat) * Math.PI / 180, dLon = (b.lon - a.lon) * Math.PI / 180, la = a.lat * Math.PI / 180, lb = b.lat * Math.PI / 180; const h = Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }
    function draw() { if (!canvas.isConnected) return; ctx.clearRect(0, 0, 360, 260); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, 360, 260); const cx = 180, cy = 130; const d = (pos && home) ? dist(home, { lat: pos.latitude, lon: pos.longitude }) : 0; const out = d > geo; ctx.strokeStyle = out ? '#ef4444' : '#22c55e'; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(cx, cy, 90, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Geofence ' + geo + ' m', cx, cy - 96); if (pos) { const ang = Date.now() / 2000; const r = Math.min(88, d / geo * 88); ctx.fillStyle = out ? '#ef4444' : '#22d3ee'; ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 8, 0, 7); ctx.fill(); roPos.set(pos.latitude.toFixed(5) + ', ' + pos.longitude.toFixed(5)); roAcc.set('±' + Math.round(acc) + ' m'); status.textContent = out ? '🚨 Geofence verlassen!' : '✓ im Bereich'; status.className = 'sens-status ' + (out ? 'bad' : 'ok'); } else { ctx.fillStyle = '#334155'; ctx.font = '13px sans-serif'; ctx.fillText('Standort freigeben', cx, cy); } requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, status]), el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Geofence-Radius' }), rad]), el('div', { class: 'phys-ros' }, [roPos.wrap, roAcc.wrap]));
    return c;
  }

  /* ===================== ANTI-DIEBSTAHL-ALARM ===================== */
  function theftCard() {
    const c = card('fa-bell', 'Anti-Diebstahl · Bewegungsalarm', 'Handy bewegt → Sirene + Vibration + Blitz',
      '<b>Das passiert hier:</b> Scharf schalten und das Handy hinlegen. Wird es bewegt oder angehoben, heult sofort eine Sirene, das Gerät vibriert und der Bildschirm blitzt rot. (Bewegungssensor + Ton + Vibration)');
    const W = 560, H = 180; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'entschärft' });
    let armed = false, alarm = false, base = null, handler = null, siren = null, t = 0, armT = 0;
    function startSiren() { const a = AC(); if (!a || siren) return; const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain(); o.type = 'sawtooth'; o.frequency.value = 700; lfo.frequency.value = 5; lg.gain.value = 350; lfo.connect(lg).connect(o.frequency); g.gain.value = 0.09; o.connect(g).connect(a.destination); o.start(); lfo.start(); siren = { o, lfo }; }
    function stopSiren() { if (siren) { try { siren.o.stop(); siren.lfo.stop(); } catch (e) {} siren = null; } }
    function trigger() { if (alarm) return; alarm = true; startSiren(); if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 600]); }
    const armBtn = el('button', { class: 'btn primary', html: '<i class="fas fa-lock"></i> Scharf schalten' });
    armBtn.addEventListener('click', async () => {
      if (armed) { armed = false; alarm = false; stopSiren(); base = null; if (handler) { window.removeEventListener('devicemotion', handler); handler = null; } armBtn.className = 'btn primary'; armBtn.innerHTML = '<i class="fas fa-lock"></i> Scharf schalten'; return; }
      if (!(await askMotion()) || typeof DeviceMotionEvent === 'undefined') { status.textContent = '⚠ Bewegungssensor nötig (Smartphone + https)'; status.className = 'sens-status bad'; return; }
      AC(); armT = 180; armed = true; base = null; armBtn.className = 'btn'; armBtn.innerHTML = '<i class="fas fa-lock-open"></i> Entschärfen';
      handler = e => { const a = e.accelerationIncludingGravity || {}; const m = Math.hypot(a.x || 0, a.y || 0, a.z || 0); if (base == null) base = m; if (armT <= 0 && Math.abs(m - base) > 3.5) trigger(); };
      window.addEventListener('devicemotion', handler);
    });
    function draw() {
      if (!canvas.isConnected) { stopSiren(); if (handler) window.removeEventListener('devicemotion', handler); return; }
      t++; if (armT > 0) armT--;
      ctx.fillStyle = alarm ? (Math.floor(t / 8) % 2 ? '#3b0a0a' : '#7f1d1d') : '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center'; ctx.font = '42px sans-serif'; ctx.fillText(alarm ? '🚨' : armed ? '🔒' : '🔓', W / 2, H / 2 - 4);
      ctx.font = '14px sans-serif'; ctx.fillStyle = '#cbd5e1'; ctx.fillText(alarm ? 'ALARM – bewegt!' : armed ? (armT > 0 ? 'scharf in ' + Math.ceil(armT / 60) + ' s …' : 'scharf – nicht bewegen!') : 'entschärft', W / 2, H / 2 + 32);
      status.textContent = alarm ? '🚨 ALARM' : armed ? 'scharf' : 'entschärft'; status.className = 'sens-status' + (alarm ? ' bad' : armed ? ' warn' : '');
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [armBtn, status]));
    return c;
  }

  /* ===================== METALLDETEKTOR ===================== */
  function metalCard() {
    const c = card('fa-magnet', 'Metalldetektor · Magnetometer', 'Magnetfeld in µT messen',
      '<b>Das passiert hier:</b> Das Magnetometer misst das Erdmagnetfeld. Näher das Handy an Metall/einen Magneten – die Feldstärke ändert sich, Zeiger + Ton zeigen den Fund. (Android/Chrome + https)');
    const W = 560, H = 200; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: 'inaktiv' }); const roF = ro('Feldstärke');
    let sensor = null, base = null, val = 0, beepT = 0;
    const btn = el('button', { class: 'btn primary', html: '<i class="fas fa-magnet"></i> aktivieren' });
    btn.addEventListener('click', () => {
      if (typeof Magnetometer === 'undefined') { status.textContent = '⚠ Magnetometer nicht unterstützt (Android Chrome + https)'; status.className = 'sens-status bad'; return; }
      try { sensor = new Magnetometer({ frequency: 20 }); sensor.addEventListener('reading', () => { val = Math.hypot(sensor.x, sensor.y, sensor.z); if (base == null) base = val; }); sensor.addEventListener('error', ev => { status.textContent = '⚠ ' + ev.error.name; status.className = 'sens-status bad'; }); sensor.start(); btn.style.display = 'none'; cal.style.display = ''; status.textContent = 'aktiv'; status.className = 'sens-status ok'; AC(); } catch (e) { status.textContent = '⚠ kein Zugriff (https + Berechtigung)'; status.className = 'sens-status bad'; }
    });
    const cal = el('button', { class: 'btn', html: '<i class="fas fa-crosshairs"></i> Nullen', style: 'display:none' }); cal.addEventListener('click', () => base = val);
    function draw() {
      if (!canvas.isConnected) { if (sensor) try { sensor.stop(); } catch (e) {} return; }
      const dev = base != null ? Math.abs(val - base) : 0;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = 160; ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 110, Math.PI, 0); ctx.stroke();
      const ang = Math.PI + Math.min(1, dev / 80) * Math.PI; ctx.strokeStyle = dev > 15 ? '#ef4444' : '#22d3ee'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * 100, cy + Math.sin(ang) * 100); ctx.stroke();
      ctx.fillStyle = dev > 15 ? '#ef4444' : '#cbd5e1'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'; ctx.fillText(val ? Math.round(val) + ' µT' : '– µT', cx, 70);
      if (dev > 15 && beepT <= 0) { beep(700 + dev * 4, 0.05); beepT = 8; } if (beepT > 0) beepT--;
      roF.set((val ? Math.round(val) : '–') + ' µT (Δ ' + Math.round(dev) + ')', dev > 15 ? 'bad' : 'ok');
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [btn, cal, status]), el('div', { class: 'phys-ros' }, [roF.wrap]));
    return c;
  }

  /* ===================== SIRENE / TONGENERATOR ===================== */
  function sirenCard() {
    const c = card('fa-volume-high', 'Sirene & Tongenerator', 'Handy als Signal/Abschreckung',
      '<b>Das passiert hier:</b> Erzeuge laute Signaltöne über den Lautsprecher: Polizei-Sirene, Daueralarm oder Ultraschall (~17,5 kHz – v.a. für junge Ohren hörbar). „Stop" beendet.');
    const W = 560, H = 130; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    let node = null, mode = 'aus', t = 0;
    function stop() { if (node) { try { Array.isArray(node) ? node.forEach(n => n.stop()) : node.stop(); } catch (e) {} node = null; } mode = 'aus'; }
    function siren() { stop(); const a = AC(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain(); o.type = 'sawtooth'; o.frequency.value = 650; lfo.frequency.value = 0.8; lg.gain.value = 360; lfo.connect(lg).connect(o.frequency); g.gain.value = 0.12; o.connect(g).connect(a.destination); o.start(); lfo.start(); node = [o, lfo]; mode = 'Sirene'; }
    function tone(f, m) { stop(); const a = AC(); if (!a) return; const o = a.createOscillator(), g = a.createGain(); o.frequency.value = f; g.gain.value = 0.12; o.connect(g).connect(a.destination); o.start(); node = o; mode = m; }
    const b1 = el('button', { class: 'btn primary', html: '<i class="fas fa-tower-broadcast"></i> Sirene' }); b1.addEventListener('click', siren);
    const b2 = el('button', { class: 'btn', html: '<i class="fas fa-triangle-exclamation"></i> Daueralarm' }); b2.addEventListener('click', () => tone(1000, 'Alarm'));
    const b3 = el('button', { class: 'btn', html: '<i class="fas fa-wave-square"></i> Ultraschall' }); b3.addEventListener('click', () => tone(17500, 'Ultraschall'));
    const b4 = el('button', { class: 'btn', html: '<i class="fas fa-stop"></i> Stop' }); b4.addEventListener('click', stop);
    function draw() { if (!canvas.isConnected) { stop(); return; } t += 0.2; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); const on = mode !== 'aus'; ctx.strokeStyle = on ? '#22d3ee' : '#334155'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x < W; x++) { ctx.lineTo(x, H / 2 + Math.sin(x * 0.1 + t) * (on ? 30 : 4)); } ctx.stroke(); ctx.fillStyle = on ? '#22d3ee' : '#475569'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Modus: ' + mode, W / 2, 24); requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2, b3, b4]));
    return c;
  }

  /* ===================== VIBRATION / HAPTIK ===================== */
  function vibroCard() {
    const c = card('fa-mobile-screen-button', 'Vibration · Haptik', 'Vibrationsmotor ansteuern',
      '<b>Das passiert hier:</b> Das Handy als stiller Melder – verschiedene Vibrationsmuster (kurz, lang, SOS, Puls). Ideal als unauffälliges Signal. (Nur Smartphone)');
    const W = 560, H = 130; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: navigator.vibrate ? 'bereit' : '⚠ nicht unterstützt' });
    if (!navigator.vibrate) status.className = 'sens-status bad';
    let shake = 0;
    function go(p, total) { if (navigator.vibrate) { navigator.vibrate(p); shake = total; } }
    const b1 = el('button', { class: 'btn primary', html: 'Kurz' }); b1.addEventListener('click', () => go(200, 20));
    const b2 = el('button', { class: 'btn', html: 'Lang' }); b2.addEventListener('click', () => go(800, 50));
    const b3 = el('button', { class: 'btn', html: 'SOS' }); b3.addEventListener('click', () => go([150, 100, 150, 100, 150, 300, 400, 100, 400, 100, 400, 300, 150, 100, 150, 100, 150], 180));
    const b4 = el('button', { class: 'btn', html: 'Puls' }); b4.addEventListener('click', () => go([120, 120, 120, 120, 120, 120], 60));
    function draw() { if (!canvas.isConnected) return; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); const dx = shake > 0 ? (Math.random() - 0.5) * 12 : 0; if (shake > 0) shake--; ctx.font = '46px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('📳', W / 2 + dx, H / 2 + 16); requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b1, b2, b3, b4, status]));
    return c;
  }

  /* ===================== BATTERIE / NOTSTROM ===================== */
  function batteryCard() {
    const c = card('fa-battery-three-quarters', 'Batterie · Notstrom-Check', 'Akku-Status & Restlaufzeit',
      '<b>Das passiert hier:</b> Zeigt Ladezustand und ob geladen wird – wie die Anzeige einer USV (unterbrechungsfreie Stromversorgung). So sieht man, wie lange ein akkubetriebenes Gerät noch durchhält.');
    const W = 560, H = 170; const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }); const ctx = canvas.getContext('2d');
    const status = el('div', { class: 'sens-status', text: '…' }); const roL = ro('Ladung'), roT = ro('Restlaufzeit');
    let level = null, charging = false, dt = 0;
    if (navigator.getBattery) { navigator.getBattery().then(b => { const up = () => { level = b.level; charging = b.charging; dt = b.dischargingTime; }; up(); b.addEventListener('levelchange', up); b.addEventListener('chargingchange', up); b.addEventListener('dischargingtimechange', up); status.textContent = 'aktiv'; status.className = 'sens-status ok'; }); }
    else { status.textContent = '⚠ Battery-API nicht unterstützt (z.B. iOS/Safari)'; status.className = 'sens-status bad'; }
    function draw() { if (!canvas.isConnected) return; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); const bx = 160, by = 50, bw = 240, bh = 80; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4; ctx.strokeRect(bx, by, bw, bh); ctx.fillStyle = '#94a3b8'; ctx.fillRect(bx + bw, by + 24, 12, 32); if (level != null) { const col = level > 0.5 ? '#22c55e' : level > 0.2 ? '#fbbf24' : '#ef4444'; ctx.fillStyle = col; ctx.fillRect(bx + 6, by + 6, (bw - 12) * level, bh - 12); ctx.fillStyle = '#fff'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(Math.round(level * 100) + '%', bx + bw / 2, by + bh / 2 + 9); if (charging) ctx.fillText('⚡', bx + bw / 2, by - 8); const tt = (dt && isFinite(dt) && dt > 0) ? Math.round(dt / 60) + ' min' : (charging ? 'lädt' : '—'); roL.set(Math.round(level * 100) + '%' + (charging ? ' ⚡' : ''), level > 0.2 ? 'ok' : 'bad'); roT.set(tt); } else { ctx.fillStyle = '#475569'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Batterie-Status …', W / 2, H / 2); } requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
    c.append(canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [status]), el('div', { class: 'phys-ros' }, [roL.wrap, roT.wrap]));
    return c;
  }

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Krass · echte Hardware</span>
      <h1>Dein Handy wird zum Sensor 📱</h1>
      <p class="lead">11 echte Geräte-Tools: Kamera (IR/Thermal/Kanten), Anti-Diebstahl-Alarm, Mikrofon + dB, Sirene & Ultraschall,
      Erschütterung, Metalldetektor, Vibration, Wasserwaage, Kompass, Batterie/Notstrom und GPS-Geofence.</p>`;
    if (!window.isSecureContext) intro.appendChild(el('div', { class: 'sens-warn', html: '⚠ <b>Wichtig:</b> Kamera, Mikrofon, Lage-/Bewegungssensor und GPS funktionieren nur über eine <b>https-Adresse</b> (oder localhost) – nicht beim Doppelklick auf die Datei. Öffne die App über den Online-Link (GitHub Pages).' }));
    root.appendChild(intro);
    const grid = el('div', { class: 'phys-grid' });
    [cameraCard(), theftCard(), micCard(), sirenCard(), motionCard(), metalCard(), vibroCard(), levelCard(), compassCard(), batteryCard(), gpsCard()].forEach(c => grid.appendChild(c));
    root.appendChild(grid);
    return root;
  }
  return { view };
})();
