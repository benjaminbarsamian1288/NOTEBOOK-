/* WWD Video-Türme · Technik – animierter Deep-Dive aller Subsysteme des
   mobilen Überwachungsturms (KWS Video Control). window.WWDTECH.view(). */
window.WWDTECH = (() => {
  const { el } = U;
  function loop(c, d) { function f(t) { if (!c.isConnected) return; d(t); requestAnimationFrame(f); } requestAnimationFrame(f); }
  function ro(label) { const w = el('div', { class: 'phys-ro' }); const v = el('span', { class: 'phys-ro-v', text: '–' }); w.append(el('span', { class: 'phys-ro-l', text: label }), v); return { wrap: w, set: (t, c) => { v.textContent = t; v.className = 'phys-ro-v' + (c ? ' ' + c : ''); } }; }
  function vcard(o) {
    const c = el('div', { class: 'phys-card' });
    c.appendChild(el('div', { class: 'phys-head' }, [el('div', { class: 'phys-ico', html: `<i class="fas ${o.icon}"></i>` }), el('div', {}, [el('h3', { text: o.title }), el('div', { class: 'phys-sub', text: o.sub })])]));
    c.appendChild(el('div', { class: 'phys-explain' }, [el('div', { class: 'phys-ex-row', html: `<b>Was:</b> ${o.was}` }), el('div', { class: 'phys-ex-row', html: `<b>Im Detail:</b> ${o.detail}` }), el('div', { class: 'phys-ex-row', html: `<b>Praxis:</b> ${o.praxis}` })]));
    c.appendChild(o.body); return c;
  }

  /* 1 · Aufbau des Turms */
  function aufbauSim() {
    const W = 560, H = 330, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const parts = [
      { k: 'kamera', n: 'Kamerakopf', bb: [248, 40, 64, 36], info: '4× Dome-Kameras · 25× optischer Zoom · 360° schwenkbar / 90° neigbar · Auto-Tracking · Laser-IR (IR = Infrarot, unsichtbares Licht) bis 100 m.' },
      { k: 'led', n: 'LED-Strahler', bb: [220, 46, 24, 18], info: '2× 100 W LED-Flutlicht (LED = Leuchtdiode/Light Emitting Diode) – schreckt ab und liefert Licht für die Kameras.' },
      { k: 'speaker', n: 'Lautsprecher', bb: [316, 46, 22, 18], info: 'Lautsprecher für Live-Durchsagen aus der Leitstelle (akustische Intervention).' },
      { k: 'mast', n: 'Teleskop-Mast', bb: [273, 76, 14, 150], info: 'Mast bis ca. 6 m – Überblick über große Flächen, schwer erreichbar für Täter.' },
      { k: 'solar', n: 'Solarpanels', bb: [120, 150, 90, 50], info: '2× 305 W Solarpanel – lädt die Akkus, ermöglicht netzunabhängigen Betrieb (Variante Autark).' },
      { k: 'nvr', n: 'NVR / Technik', bb: [250, 248, 40, 30], info: 'Netzwerk-Videorekorder (NVR = Network Video Recorder) zeichnet auf · Mobilfunk-Router (4G/5G = vierte/fünfte Mobilfunk-Generation) · Steuerung – im verschlossenen, sabotagegeschützten Gehäuse.' },
      { k: 'akku', n: 'Akku', bb: [296, 248, 38, 30], info: '2× 220 Ah Akku – puffert Strom für Nacht und sonnenarme Tage.' },
      { k: 'basis', n: 'Standfuß / Anhänger', bb: [200, 278, 160, 22], info: 'Schwerer Standfuß oder Anhänger – schnell aufgestellt, standsicher, mobil versetzbar.' },
    ];
    let sel = 'kamera'; const info = ro('Bauteil');
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0a1a30'); sky.addColorStop(0.7, '#0b1424'); sky.addColorStop(1, '#070d18'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      const gr = ctx.createLinearGradient(0, 296, 0, H); gr.addColorStop(0, '#1a2942'); gr.addColorStop(1, '#0d1726'); ctx.fillStyle = gr; ctx.fillRect(0, 300, W, 30);
      const bg2 = ctx.createLinearGradient(200, 0, 360, 0); bg2.addColorStop(0, '#3a4861'); bg2.addColorStop(1, '#27344a'); ctx.fillStyle = bg2; ctx.fillRect(200, 278, 160, 22); // Basis
      ctx.fillStyle = '#1e293b'; ctx.fillRect(250, 248, 40, 30); ctx.fillRect(296, 248, 38, 30); // NVR, Akku
      ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#94a3b8'; ctx.save(); ctx.translate(165, 175); ctx.rotate(-0.3); ctx.fillRect(-45, -25, 90, 50); ctx.strokeRect(-45, -25, 90, 50); for (let i = -1; i < 2; i++) { ctx.strokeStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(i * 22, -25); ctx.lineTo(i * 22, 25); ctx.stroke(); } ctx.restore(); // Solar
      ctx.fillStyle = '#475569'; ctx.fillRect(273, 76, 14, 172);                 // Mast
      ctx.fillStyle = '#1e293b'; ctx.fillRect(248, 40, 64, 36);                  // Kopf
      ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(280, 60, 12, 0, 7); ctx.fill();
      ctx.save(); ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 16; ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(280, 60, 5 + Math.sin(Date.now() / 400) * 1.2, 0, 7); ctx.fill(); ctx.restore(); // Linse mit Glühen
      ctx.save(); ctx.shadowColor = '#fde68a'; ctx.shadowBlur = 14; ctx.fillStyle = '#fde68a'; ctx.fillRect(220, 46, 24, 18); ctx.restore(); // LED-Strahler glüht
      ctx.fillStyle = '#7dd3fc'; ctx.fillRect(316, 46, 22, 18); // Lautsprecher
      const p = parts.find(x => x.k === sel); ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.strokeRect(p.bb[0] - 4, p.bb[1] - 4, p.bb[2] + 8, p.bb[3] + 8); ctx.setLineDash([]);
      ctx.fillStyle = '#22d3ee'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(p.n, p.bb[0] + p.bb[2] / 2, p.bb[1] - 10);
    }
    loop(canvas, draw);
    const btns = parts.map(p => { const b = el('button', { class: 'btn' + (p.k === sel ? ' primary' : ''), text: p.n }); b.addEventListener('click', () => { sel = p.k; info.set(p.info); row.querySelectorAll('.btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const row = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns); info.set(parts[0].info);
    return vcard({ icon: 'fa-tower-cell', title: '1 · Aufbau des Video-Turms', sub: 'KWS Video Control – die Bauteile',
      was: 'Ein mobiler Überwachungsturm vereint Kameras, Licht, Lautsprecher, Recorder, Mobilfunk und Stromversorgung in einer schnell aufstellbaren Einheit.',
      detail: 'Oben der <b>Kamerakopf</b> (4× Dome, Zoom, IR = Infrarot) mit <b>LED-Strahlern</b> (LED = Leuchtdiode) und <b>Lautsprecher</b>, am <b>Teleskopmast</b> (bis 6 m) für freie Sicht. Unten im sabotagegeschützten Gehäuse der <b>NVR</b> (Netzwerk-Videorekorder), <b>Mobilfunk-Router</b> und <b>Akkus</b>, oft mit <b>Solarpanels</b> auf schwerem Standfuß/Anhänger.',
      praxis: 'In Minuten aufgestellt, ohne Bauarbeiten – ideal für Baustellen, Events und temporäre Lagen. Klick die Bauteile an.',
      body: el('div', {}, [canvas, row, el('div', { class: 'phys-ros' }, [info.wrap])]) });
  }

  /* 2 · Kameras: PTZ, Zoom, IR */
  function kamerasSim() {
    const W = 560, H = 300, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let zoom = 1, t = 0; const roZ = ro('Zoom'), roFov = ro('Sichtfeld'), roR = ro('Nacht-Reichweite');
    function draw() {
      t += 0.02; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const cx = 70, cy = H / 2; ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 7); ctx.fill();
      const half = (0.7 / zoom), aim = Math.sin(t) * 0.5; const range = 80 + zoom * 16;
      // Sichtkegel (schwenkt)
      ctx.beginPath(); ctx.moveTo(cx, cy); for (let k = 0; k <= 16; k++) { const a = aim - half + k / 16 * 2 * half; ctx.lineTo(cx + Math.cos(a) * range * 4.2, cy + Math.sin(a) * range * 4.2); } ctx.closePath(); ctx.fillStyle = 'rgba(34,211,238,0.14)'; ctx.fill();
      // IR-Reichweite (bis 100 m)
      ctx.strokeStyle = 'rgba(239,68,68,0.5)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, range * 4.2, aim - half, aim + half); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 7); ctx.fill();
      // Person am Rand
      const px = cx + Math.cos(aim) * range * 4.0, py = cy + Math.sin(aim) * range * 4.0;
      ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🚶', Math.min(W - 20, px), py);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText('Auto-Tracking · 360° schwenkbar', W / 2, 24);
      roZ.set(zoom.toFixed(0) + '×'); roFov.set((half * 2 * 57).toFixed(0) + '°'); roR.set('≈ ' + Math.round(range) + ' m (Laser-IR)');
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '1', max: '25', value: '1', class: 'phys-slider' }); s.addEventListener('input', () => zoom = +s.value);
    return vcard({ icon: 'fa-video', title: '2 · Kameras · PTZ · Zoom · IR', sub: '4× Dome, 25× Zoom, 360°, Nachtsicht',
      was: 'Die Domekameras schwenken/neigen motorisch (PTZ = Pan-Tilt-Zoom, also Schwenken-Neigen-Zoomen), zoomen optisch bis 25× und sehen dank Laser-Infrarot (IR) auch nachts ~100 m weit.',
      detail: 'Mehr <b>Zoom</b> = engerer Bildwinkel, dafür mehr Detail in der Ferne. <b>Auto-Tracking</b> verfolgt erkannte Objekte automatisch. <b>Laser-IR</b> leuchtet die Szene unsichtbar aus – Nachtbild in S/W. 360° Rundumblick durch Schwenken.',
      praxis: 'Weite Zufahrt → starker Zoom; Übersicht → Weitwinkel. Auto-Tracking hält Eindringlinge im Bild, bis die Leitstelle übernimmt.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Optischer Zoom' }), s]), el('div', { class: 'phys-ros' }, [roZ.wrap, roFov.wrap, roR.wrap])]) });
  }

  /* 3 · KI-Videoanalyse */
  function kiSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let filter = true, t = 0; const objs = [{ x: 60, kind: 'person', e: '🚶', v: 1.1 }, { x: 200, kind: 'tier', e: '🐈', v: 0.8 }, { x: 360, kind: 'fahrzeug', e: '🚗', v: 1.6 }];
    const lineX = 300; let count = 0, prev = objs.map(() => 0);
    function draw() {
      t++; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#13202f'; ctx.fillRect(0, H - 40, W, 40);
      ctx.strokeStyle = '#fbbf24'; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(lineX, 30); ctx.lineTo(lineX, H - 40); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#fbbf24'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Linie', lineX, 24);
      objs.forEach((o, i) => {
        o.x += o.v; if (o.x > W + 20) o.x = -20;
        const relevant = !filter || o.kind !== 'tier';
        const y = H - 70;
        ctx.strokeStyle = relevant ? (o.kind === 'fahrzeug' ? '#22d3ee' : '#22c55e') : '#475569'; ctx.lineWidth = 2; ctx.strokeRect(o.x - 18, y - 24, 36, 44);
        ctx.fillStyle = relevant ? '#e2e8f0' : '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText(relevant ? o.kind : 'ignoriert', o.x, y - 30);
        ctx.font = '20px sans-serif'; ctx.fillText(o.e, o.x, y + 4);
        const s = Math.sign(o.x - lineX); if (prev[i] && s !== prev[i] && s !== 0 && relevant) { count++; o.flash = 14; } if (s !== 0) prev[i] = s; if (o.flash > 0) { o.flash--; ctx.fillStyle = '#ef4444'; ctx.font = '11px sans-serif'; ctx.fillText('● ALARM', o.x, y + 36); }
      });
      ctx.fillStyle = '#cbd5e1'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Linienüberschreitungen: ' + count, 14, H - 14);
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn primary', html: '<i class="fas fa-filter"></i> Mensch/Fahrzeug-Filter AN' });
    b.addEventListener('click', () => { filter = !filter; b.className = 'btn' + (filter ? ' primary' : ''); b.innerHTML = filter ? '<i class="fas fa-filter"></i> Mensch/Fahrzeug-Filter AN' : '<i class="fas fa-filter"></i> Filter AUS (alles alarmiert)'; });
    return vcard({ icon: 'fa-brain', title: '3 · KI-Videoanalyse (IVS / SMD)', sub: 'Erkennt, klassifiziert, filtert',
      was: 'Die Kamera-KI erkennt Bewegung, <b>klassifiziert</b> Person/Fahrzeug/Tier und löst gezielt Regeln aus (z. B. Linienüberschreitung) – statt bei jedem Pixel Alarm zu schlagen.',
      detail: '<b>SMD</b> (Smart Motion Detection = intelligente Bewegungserkennung) + <b>IVS</b> (Intelligent Video System = intelligente Videoanalyse): Objekt-Erkennung, Verfolgung (Tracking), Zonen/Linien, „Herumlungern". Der Mensch/Fahrzeug-<b>Filter</b> ignoriert Tiere, Regen und Laub → drastisch weniger Fehlalarme.',
      praxis: 'Nur relevante Ereignisse erreichen die Leitstelle – das spart Personal und verhindert „Alarmmüdigkeit". Schalte den Filter um und sieh den Unterschied.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b])]) });
  }

  /* 4 · Energie / Autarkie */
  function energieSim() {
    const W = 560, H = 280, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let sun = 70, soc = 75, t = 0; const roIn = ro('Solar-Leistung'), roOut = ro('Verbrauch'), roSoc = ro('Akku-Ladung');
    function draw() {
      t += 0.04; const night = sun < 12; const solarW = sun / 100 * 610;
      const consum = 110 + (night ? 200 : 0); // Kameras + nachts LED
      soc += (solarW - consum) / 5280 * 100 * 0.18; soc = Math.max(0, Math.min(100, soc));
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = night ? '#04060d' : '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Sonne
      ctx.fillStyle = night ? '#334155' : '#fbbf24'; ctx.beginPath(); ctx.arc(90, 60, 26, 0, 7); ctx.fill(); if (night) { ctx.fillStyle = '#cbd5e1'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌙', 90, 67); }
      // Panel
      ctx.fillStyle = '#1e3a5f'; ctx.fillRect(60, 120, 120, 60); ctx.strokeStyle = '#22d3ee'; ctx.strokeRect(60, 120, 120, 60);
      // Akku
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.strokeRect(360, 110, 130, 70); const col = soc > 50 ? '#22c55e' : soc > 20 ? '#fbbf24' : '#ef4444'; ctx.fillStyle = col; ctx.fillRect(364, 114, 122 * soc / 100, 62); ctx.fillStyle = '#fff'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(Math.round(soc) + '%', 425, 152);
      // Fluss Panel→Akku
      if (solarW > 5) for (let i = 0; i < 5; i++) { const x = 180 + ((t * 40 + i * 40) % 180); ctx.fillStyle = '#fbbf24'; ctx.fillRect(x, 145, 7, 4); }
      // Verbraucher
      ctx.font = '16px sans-serif'; ctx.fillText('🎥', 425, 215); if (night) ctx.fillText('💡', 455, 215);
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText('Solar', 120, 196); ctx.fillText('Akku 2× 220 Ah', 425, 196);
      const days = consum > solarW ? (soc / 100 * 5280 / (consum - solarW) / 24) : Infinity;
      roIn.set(Math.round(solarW) + ' W'); roOut.set(consum + ' W' + (night ? ' (LED an)' : '')); roSoc.set(Math.round(soc) + '%' + (isFinite(days) ? ' · ~' + days.toFixed(1) + ' Tage' : ' · lädt'), soc > 20 ? 'ok' : 'bad');
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '0', max: '100', value: '70', class: 'phys-slider' }); s.addEventListener('input', () => sun = +s.value);
    return vcard({ icon: 'fa-solar-panel', title: '4 · Energie & Autarkie', sub: 'Solar + Akku – netzunabhängig',
      was: 'Die Autark-Variante versorgt sich selbst: Solarpanels laden tagsüber die Akkus, nachts läuft alles aus dem Akku – ganz ohne Stromanschluss.',
      detail: '2× 305 W Solar + 2× 220 Ah Akku (≈ 5 kWh). Tagsüber lädt der Überschuss den Akku, nachts ziehen Kameras + LED-Licht Strom. Bei wenig Sonne sinkt die Ladung – optional helfen Brennstoffzelle, Windrad oder Netzanschluss.',
      praxis: 'Schieb die Sonne rauf/runter: bei „Nacht" springt das LED-Licht an und der Akku entlädt. Standort & Jahreszeit bestimmen die Autarkie-Tage.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Sonneneinstrahlung' }), s]), el('div', { class: 'phys-ros' }, [roIn.wrap, roOut.wrap, roSoc.wrap])]) });
  }

  /* 5 · Übertragung & Leitstelle */
  function nslSim() {
    const W = 560, H = 270, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let t = 0;
    function draw() {
      t += 2; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const y = H / 2; ctx.font = '30px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🗼', 60, y); ctx.fillText('📡', 250, y - 50); ctx.fillText('🏢', 500, y);
      // Turm → Mast (Funk)
      for (let i = 0; i < 3; i++) { const r = ((t * 1.2 + i * 26) % 70); ctx.strokeStyle = `rgba(34,211,238,${0.5 - i * 0.13})`; ctx.beginPath(); ctx.arc(60, y - 12, r, -1, 1); ctx.stroke(); }
      // Mast → Leitstelle (Pakete, verschlüsselt)
      ctx.strokeStyle = 'rgba(34,197,94,0.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(280, y - 40); ctx.lineTo(470, y - 10); ctx.stroke();
      for (let i = 0; i < 5; i++) { const f = ((t + i * 40) % 200) / 200; const x = 280 + (470 - 280) * f, yy = (y - 40) + (-30) * f + 30 * f; ctx.fillStyle = '#22c55e'; ctx.fillRect(x, yy - 4, 9, 8); }
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText('Video-Turm', 60, y + 40); ctx.fillText('4G/5G-Mobilfunk', 250, y - 78); ctx.fillText('NSL · Leitstelle 24/7', 500, y + 40);
      ctx.fillStyle = '#22c55e'; ctx.fillText('🔒 verschlüsselt · Live + Aufzeichnung', W / 2, H - 16);
    }
    loop(canvas, draw);
    return vcard({ icon: 'fa-tower-broadcast', title: '5 · Übertragung & Leitstelle (NSL)', sub: 'Mobilfunk → 24/7-Aufschaltung',
      was: 'Der Turm sendet Bild und Alarme per Mobilfunk verschlüsselt an eine ständig besetzte NSL (Notruf- und Service-Leitstelle).',
      detail: 'Ein <b>4G/5G-Router</b> (4G/5G = vierte/fünfte Mobilfunk-Generation, LTE/New Radio) überträgt den Stream (oft nur bei Ereignis, um Datenvolumen zu sparen). In der <b>NSL</b> (Notruf- und Service-Leitstelle) sehen Mitarbeiter live, bewerten den Alarm, machen <b>Lautsprecher-Durchsagen</b> und alarmieren Polizei/Wachdienst. Aufzeichnung läuft zusätzlich lokal auf dem NVR (Netzwerk-Videorekorder).',
      praxis: 'Echte Verifikation durch Menschen = kaum Fehlalarme und schnelle, rechtssichere Reaktion. Ohne NSL ist es nur Aufzeichnung.',
      body: el('div', {}, [canvas]) });
  }

  /* 6 · Abschreckung & Intervention */
  function interventionSim() {
    const W = 560, H = 270, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let phase = 0, stage = 0, t = 0; // 0 ruhe,1 erkannt,2 licht,3 durchsage
    function trigger() { phase = 1; }
    function draw() {
      t++; ctx.clearRect(0, 0, W, H); const lit = phase >= 2; ctx.fillStyle = lit ? '#1a1a0a' : '#04060d'; ctx.fillRect(0, 0, W, H);
      if (phase >= 1) phaseAdvance();
      // Turm
      ctx.fillStyle = '#475569'; ctx.fillRect(70, 60, 10, 150); ctx.fillStyle = '#1e293b'; ctx.fillRect(55, 44, 40, 22);
      // Flutlicht-Kegel
      if (lit) { const g = ctx.createRadialGradient(75, 55, 5, 75, 55, 320); g.addColorStop(0, 'rgba(253,230,138,0.5)'); g.addColorStop(1, 'rgba(253,230,138,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(75, 55); ctx.arc(75, 55, 320, -0.1, 1.1); ctx.fill(); }
      // Eindringling
      if (phase >= 1) { ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('🥷', 360, 200); if (phase >= 1) { ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.strokeRect(338, 168, 44, 50); } }
      // Strobe
      if (phase >= 2 && Math.floor(t / 6) % 2) { ctx.fillStyle = 'rgba(96,165,250,0.5)'; ctx.beginPath(); ctx.arc(75, 50, 14, 0, 7); ctx.fill(); }
      // Durchsage
      if (phase >= 3) { ctx.fillStyle = 'rgba(2,6,12,0.8)'; ctx.fillRect(150, 60, 360, 46); ctx.strokeStyle = '#7dd3fc'; ctx.strokeRect(150, 60, 360, 46); ctx.fillStyle = '#7dd3fc'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🔊 „Sie befinden sich in einem', 330, 80); ctx.fillText('videoüberwachten Bereich. Verlassen Sie das Gelände!"', 330, 98); }
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(['Bereit – „Eindringling" drücken', '1) Erkannt + Alarm an NSL', '2) Flutlicht + Blaulicht an', '3) Live-Durchsage aus der Leitstelle'][Math.min(3, phase)], 14, H - 14);
    }
    function phaseAdvance() { if (!draw._t) draw._t = 0; draw._t++; if (draw._t === 35) phase = 2; if (draw._t === 75) phase = 3; if (draw._t > 260) { phase = 0; draw._t = 0; } }
    loop(canvas, draw);
    const b = el('button', { class: 'btn primary', html: '<i class="fas fa-person-running"></i> Eindringling' }); b.addEventListener('click', () => { draw._t = 0; trigger(); });
    return vcard({ icon: 'fa-bullhorn', title: '6 · Abschreckung & Intervention', sub: 'Licht · Strobe · Live-Durchsage',
      was: 'Der Turm reagiert aktiv: bei Erkennung schaltet er Flutlicht und Warnblitz ein und die Leitstelle spricht den Täter direkt an.',
      detail: 'Eskalationskette: KI erkennt → Aufschaltung zur NSL → <b>LED-Flutlicht</b> + <b>Blaulicht/Strobe</b> → <b>Live-Lautsprecher-Durchsage</b> („Sie werden gefilmt …") → bei Bedarf Polizei/Streife. Die meisten Täter flüchten schon bei der Ansprache.',
      praxis: 'Aktive Intervention verhindert die Tat, statt sie nur aufzuzeichnen. Drück „Eindringling" und sieh die Eskalation.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b])]) });
  }

  /* 7 · Eigenschutz des Turms */
  function eigenschutzSim() {
    const W = 560, H = 250, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    let tilt = 0, alarmT = 0, t = 0;
    function draw() {
      t++; if (alarmT > 0) alarmT--; tilt *= 0.92; ctx.clearRect(0, 0, W, H); ctx.fillStyle = alarmT > 0 ? '#2a0a0a' : '#0b1424'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#13202f'; ctx.fillRect(0, H - 30, W, 30);
      ctx.save(); ctx.translate(W / 2, H - 30); ctx.rotate(tilt); ctx.fillStyle = '#475569'; ctx.fillRect(-6, -150, 12, 150); ctx.fillStyle = '#1e293b'; ctx.fillRect(-24, -172, 48, 24); ctx.fillStyle = alarmT > 0 ? '#ef4444' : '#22c55e'; ctx.beginPath(); ctx.arc(0, -160, 5, 0, 7); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🛰️ GPS-Tracking aktiv', W / 2, 30);
      if (alarmT > 0) { ctx.fillStyle = '#ef4444'; ctx.font = '15px sans-serif'; ctx.fillText('🚨 SABOTAGE! Neigung erkannt · Position an NSL gemeldet', W / 2, 56); }
    }
    loop(canvas, draw);
    const b = el('button', { class: 'btn primary', html: '<i class="fas fa-hand-back-fist"></i> Am Turm rütteln' }); b.addEventListener('click', () => { tilt = 0.18; alarmT = 150; });
    return vcard({ icon: 'fa-shield-halved', title: '7 · Eigenschutz des Turms', sub: 'Sabotage-, Neigungs- & GPS-Schutz',
      was: 'Der Turm schützt sich selbst: Neigungs-/Erschütterungssensor, Sabotagekontakte und GPS verhindern Manipulation und Diebstahl.',
      detail: 'Ein <b>Neigungs-/Bewegungssensor</b> meldet Anrütteln oder Umkippen sofort an die NSL (Notruf- und Service-Leitstelle). <b>Sabotagekontakte</b> sichern die Technikklappe. <b>GPS</b> (Global Positioning System = satellitengestützte Ortung) ortet den Turm – bei Abtransport wird Alarm ausgelöst und die Position gesendet.',
      praxis: 'Da der Turm selbst ein Wertobjekt im Freien ist, ist Eigenschutz Pflicht. Rüttle am Turm und sieh den Sabotagealarm.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl phys-ctrl-btns' }, [b])]) });
  }

  /* 8 · Varianten */
  function variantenSim() {
    const W = 560, H = 250, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const V = [
      { id: '4×', n: 'Video Control 4×', a: ['4× Dome-Kameras', '2× 100 W LED', 'NVR + Lautsprecher', 'Mast bis 6 m'], u: 'Große Areale, Logistik, Energieanlagen', c: '#dc2626' },
      { id: '2+2', n: 'Video Control 2+2', a: ['2× Dome + 2× Bullet', '2× 100 W LED', 'NVR + Lautsprecher', 'Mast bis 6 m'], u: 'Bauhöfe, Produktionsgelände', c: '#ea580c' },
      { id: 'Autark', n: 'Video Control Autark', a: ['4× Dome-Kameras', '2× Solar 305 W', '2× Akku 220 Ah', 'netzunabhängig'], u: 'Abgelegen, ohne Stromanschluss', c: '#fbbf24' },
      { id: 'Mini', n: 'Video Control Mini', a: ['Kompakt ~40×40 cm', 'volle Videoüberwachung', 'für innen/enge Flächen'], u: 'Hallen, Lager, Innenhöfe', c: '#22c55e' },
    ];
    let sel = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H); const v = V[sel];
      ctx.fillStyle = v.c; ctx.font = '700 18px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('KWS ' + v.n, 20, 38);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.fillText('Einsatz: ' + v.u, 20, 60);
      v.a.forEach((x, i) => { ctx.fillStyle = v.c; ctx.beginPath(); ctx.arc(28, 92 + i * 30, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#cbd5e1'; ctx.font = '14px sans-serif'; ctx.fillText(x, 42, 96 + i * 30); });
    }
    loop(canvas, draw);
    const btns = V.map((v, i) => { const b = el('button', { class: 'btn' + (i === sel ? ' primary' : ''), text: v.id }); b.addEventListener('click', () => { sel = i; row.querySelectorAll('.btn').forEach(x => x.className = 'btn'); b.className = 'btn primary'; }); return b; });
    const row = el('div', { class: 'phys-ctrl phys-ctrl-btns' }, btns);
    return vcard({ icon: 'fa-layer-group', title: '8 · Varianten (KWS Video Control)', sub: '4× · 2+2 · Autark · Mini',
      was: 'Es gibt mehrere Turm-Varianten für unterschiedliche Flächen, Anbindungen und Platzverhältnisse.',
      detail: '<b>4×</b>: vier Domes für große Areale. <b>2+2</b>: Domes + gerichtete Bullets. <b>Autark</b>: Solar+Akku ohne Netz. <b>Mini</b>: kompakt für innen/enge Stellen.',
      praxis: 'Wähle nach Fläche, Stromanbindung und Stellplatz – die Variante bestimmt Kameraanzahl, Energie und Mobilität.',
      body: el('div', {}, [canvas, row]) });
  }

  /* 5b · Datenübertragung – Bits im Kabel */
  function bitsSim() {
    const W = 560, H = 300, canvas = el('canvas', { class: 'phys-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const sample = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0];
    let scroll = 0, speed = 1.6; const bw = 32, y = 175;
    const bitAt = i => sample[((i % sample.length) + sample.length) % sample.length];
    function draw() {
      scroll += speed; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('📷 Bild → Bytes → Bits (0/1) → ⚡ Spannungspulse im Kupferkabel → 🖥️ Empfänger baut es zusammen', W / 2, 24);
      // Datenpaket-Struktur
      let cxp = 175; [['Kopf', 60, '#a855f7'], ['Nutzdaten (Bild)', 195, '#22d3ee'], ['Prüfsumme', 70, '#22c55e']].forEach(([seg, w, c]) => { ctx.fillStyle = c + '33'; ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.fillRect(cxp, 38, w, 18); ctx.strokeRect(cxp, 38, w, 18); ctx.fillStyle = c; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(seg, cxp + w / 2, 51); cxp += w; });
      ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('1 Datenpaket →', 170, 51);
      // Sender / Empfänger
      ctx.font = '26px sans-serif'; ctx.fillText('🎥', 30, y + 36); ctx.fillText('🖥️', W - 30, y + 36);
      // Kabelmantel
      ctx.strokeStyle = '#3a3320'; ctx.lineWidth = 30; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(55, y - 10); ctx.lineTo(W - 55, y - 10); ctx.stroke();
      ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(55, y - 10); ctx.lineTo(W - 55, y - 10); ctx.stroke();
      // NRZ-Rechtecksignal (1 = HIGH, 0 = LOW)
      ctx.save(); ctx.beginPath(); ctx.rect(55, 60, W - 110, H - 90); ctx.clip();
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 12;
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3; ctx.beginPath(); let started = false;
      const n = Math.ceil((W - 110) / bw) + 2;
      for (let i = -1; i < n; i++) {
        const idx = Math.floor(scroll / bw) + i; const bit = bitAt(idx);
        const x0 = 55 + i * bw - (scroll % bw); const x1 = x0 + bw; const ly = bit ? y - 40 : y + 18;
        if (!started) { ctx.moveTo(x0, ly); started = true; } else ctx.lineTo(x0, ly);
        ctx.lineTo(x1, ly);
        const cx = x0 + bw / 2; if (cx > 55 && cx < W - 55) { ctx.save(); ctx.fillStyle = bit ? '#22d3ee' : '#475569'; ctx.font = 'bold 14px monospace'; ctx.fillText(bit, cx, bit ? y - 50 : y + 40); ctx.restore(); }
      }
      ctx.stroke(); ctx.restore();
      // Pegel-Linien
      ctx.strokeStyle = 'rgba(148,163,184,0.25)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(55, y - 40); ctx.lineTo(W - 55, y - 40); ctx.moveTo(55, y + 18); ctx.lineTo(W - 55, y + 18); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#22d3ee'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('„1" = Spannung HIGH', 60, y - 46); ctx.fillStyle = '#64748b'; ctx.fillText('„0" = Spannung LOW', 60, y + 56);
      ctx.fillStyle = '#cbd5e1'; ctx.font = '11.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('1 Bit = 0 oder 1  ·  8 Bit = 1 Byte  ·  Video ≈ mehrere Mbit/s (Millionen Bit pro Sekunde)', W / 2, H - 12);
    }
    loop(canvas, draw);
    const s = el('input', { type: 'range', min: '0.4', max: '5', step: '0.2', value: '1.6', class: 'phys-slider' }); s.addEventListener('input', () => speed = +s.value);
    return vcard({ icon: 'fa-ethernet', title: '5b · Datenübertragung – Bits im Kabel', sub: 'Wie aus dem Bild Spannungspulse werden',
      was: 'Das Kamerabild wird in winzige Einheiten zerlegt: in <b>Bits</b> (jeweils 0 oder 1). Diese Bits reisen als <b>Spannungspulse</b> durch das Kupferkabel zum Empfänger.',
      detail: 'Jeder Pixel wird zu Zahlen (Bytes), jedes Byte aus 8 Bit. Auf dem Kabel steht „1" für einen höheren, „0" für einen niedrigeren Spannungspegel (hier als Rechtecksignal/NRZ = Non-Return-to-Zero gezeigt). Der Empfänger misst die Pegel im Takt und setzt Bits → Bytes → Pixel → Bild wieder zusammen. Bei PoE (Power over Ethernet = Strom über das Netzwerkkabel) fließt zusätzlich der Strom über dieselbe Leitung.',
      praxis: 'Je mehr Bits pro Sekunde (Bandbreite), desto mehr Auflösung/Bildrate möglich. Lange/schlechte Kabel oder Störungen verfälschen Pegel → Bildfehler. Schieb das Tempo rauf/runter.',
      body: el('div', {}, [canvas, el('div', { class: 'phys-ctrl' }, [el('label', { text: 'Tempo (Bitrate)' }), s])]) });
  }

  function view() {
    const root = el('div', { class: 'phys-view' });
    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">WWD Video-Türme · Technik</span>
      <h1>Mobiler Video-Turm – komplett erklärt 🗼</h1>
      <p class="lead">Der mobile Überwachungsturm (KWS Video Control) bis ins Detail: <b>Aufbau, Kameras (PTZ = Schwenken-Neigen-Zoomen), KI-Analyse,
      Energie-Autarkie, Datenübertragung als Bits im Kabel, Leitstelle (NSL), Intervention, Eigenschutz und Varianten</b> – jede Station animiert, alle Abkürzungen ausgeschrieben, mit <b>Was · Im Detail · Praxis</b>.</p>`;
    root.appendChild(intro);
    const cats = [
      { label: 'Aufbau & Technik', sims: [aufbauSim, kamerasSim, kiSim, energieSim] },
      { label: 'Betrieb & Einsatz', sims: [nslSim, bitsSim, interventionSim, eigenschutzSim, variantenSim] },
    ];
    cats.forEach(c => { root.appendChild(el('div', { class: 'phys-cat', text: c.label })); const g = el('div', { class: 'phys-grid' }); c.sims.forEach(fn => g.appendChild(fn())); root.appendChild(g); });
    return root;
  }
  return { view };
})();
