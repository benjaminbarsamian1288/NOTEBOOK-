/* Präsentations-/Slideshow-Modus „krass++". window.PRAESENTATION.view(d).
   Features: Tilt-3D-Kacheln, Konfetti, Counter-Anim, Mini-Map mit Thumbs,
   Inhaltsverzeichnis, Vergleichs-Folien, Quiz/Karteikarten, Lese-Modus,
   Marker-/Stift-Overlay, Soundeffekte, Tempo-Regler, Suche im Deck. */
window.PRAESENTATION = (() => {
  const { el } = U;

  /* ---------- helpers ---------- */
  function lvColor(idx, count) {
    const hue = Math.round(140 - (idx / Math.max(1, count - 1)) * 140);
    return `hsl(${hue} 70% 50%)`;
  }
  function loop(canvas, draw) {
    function f() { if (!canvas.isConnected) return; draw(); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  const numOf = s => { const m = (s || '').match(/\d+/); return m ? +m[0] : 0; };

  /* Sound-FX (Web Audio, nur leichtes Klick/Pling) */
  let AC = null, soundOn = false;
  function ensureAC() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return AC; }
  function ping(freq, dur, type) {
    if (!soundOn) return; const ac = ensureAC(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.value = 0; o.connect(g); g.connect(ac.destination);
    const t = ac.currentTime;
    g.gain.linearRampToValueAtTime(0.06, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.18));
    o.start(t); o.stop(t + (dur || 0.18) + 0.05);
  }
  const fxNext = () => ping(720, 0.14, 'triangle');
  const fxPrev = () => ping(420, 0.14, 'triangle');
  const fxBoom = () => { ping(540, 0.16, 'sine'); setTimeout(() => ping(720, 0.16, 'sine'), 120); setTimeout(() => ping(960, 0.22, 'sine'), 240); };

  /* Tilt-3D für Kacheln */
  function attachTilt(elt) {
    elt.style.transformStyle = 'preserve-3d';
    elt.addEventListener('mousemove', e => {
      const r = elt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      elt.style.transform = `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-3px) scale(1.015)`;
      elt.style.setProperty('--mx', (x * 100 + 50) + '%');
      elt.style.setProperty('--my', (y * 100 + 50) + '%');
    });
    elt.addEventListener('mouseleave', () => { elt.style.transform = ''; });
  }

  /* Konfetti (beim letzten Slide) */
  function fireConfetti(host) {
    const c = el('canvas', { class: 'pp-confetti' }); host.appendChild(c);
    const ctx = c.getContext('2d');
    function fit() { c.width = host.clientWidth; c.height = host.clientHeight; }
    fit();
    const cols = ['#22d3ee', '#fbbf24', '#a855f7', '#22c55e', '#ef4444', '#38bdf8'];
    const parts = Array.from({ length: 160 }, () => ({
      x: c.width / 2 + (Math.random() - .5) * 60, y: c.height + 10,
      vx: (Math.random() - .5) * 9, vy: -(Math.random() * 14 + 11),
      g: 0.32, r: Math.random() * 5 + 3, a: Math.random() * 6.28,
      va: (Math.random() - .5) * 0.3, col: cols[(Math.random() * cols.length) | 0], life: 0,
    }));
    let raf = 0, frame = 0;
    function draw() {
      frame++; ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      for (const p of parts) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life++;
        if (p.y < c.height + 30) alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.col; ctx.globalAlpha = Math.max(0, 1 - p.life / 180);
        ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r); ctx.restore();
      }
      if (alive && frame < 220) raf = requestAnimationFrame(draw); else c.remove();
    }
    raf = requestAnimationFrame(draw);
  }

  /* Counter-Animation auf Zahlen in Strings ("12 Min", "1.000.000 €" …) */
  function animateNumbers(scope) {
    scope.querySelectorAll('.pp-num').forEach(node => {
      const raw = node.dataset.target || node.textContent;
      const m = raw.match(/^(.*?)(\d[\d.]*)(.*)$/);
      if (!m) return;
      const pre = m[1], post = m[3];
      const target = parseInt(m[2].replace(/\./g, ''), 10);
      if (!isFinite(target) || target < 2) return;
      const dur = 900, start = performance.now();
      function tick(now) {
        const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
        const v = Math.round(target * e).toLocaleString('de-DE');
        node.textContent = pre + v + post;
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* Animierter Partikel-/Glow-Hintergrund */
  function startBg(canvas, sizeEl, accent) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, parts = [], t = 0; const N = 52;
    function ensure() {
      const w = sizeEl.clientWidth || 900, h = sizeEl.clientHeight || 520;
      if (w !== W || h !== H) {
        W = canvas.width = w; H = canvas.height = h;
        if (!parts.length) parts = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 2 + 1 }));
      }
    }
    function draw() {
      ensure(); t += 0.005;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      [{ s: 1, c: accent, a: 0.20 }, { s: 0.7, c: '#22d3ee', a: 0.12 }, { s: 1.3, c: '#a855f7', a: 0.08 }].forEach((b, i) => {
        const bx = W * (0.3 + 0.3 * Math.sin(t * (1 + i * 0.4) + i)),
              by = H * (0.4 + 0.3 * Math.cos(t * (0.8 + i * 0.3) + i));
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(W, H) * 0.55 * b.s);
        g.addColorStop(0, b.c); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = b.a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      ctx.globalCompositeOperation = 'source-over';
      for (const p of parts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      ctx.fillStyle = accent; ctx.globalAlpha = 0.55;
      for (const p of parts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
      ctx.strokeStyle = accent; ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { ctx.globalAlpha = 0.16 * (1 - d / 140); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(() => loop(canvas, draw));
  }

  /* Animiertes Stufen-Meter (Klassen) + RC-Countdown */
  function animMeter(o) {
    const W = 540, H = 176, canvas = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const labels = o.labels, n = labels.length, cur = o.current;
    const hasClock = o.minutes > 0;
    let t = 0, p = 0, anim = 0;
    function draw() {
      t += 0.04; anim = Math.min(1, anim + 0.04);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Stufe im Vergleich', 18, 18);
      const areaR = hasClock ? W * 0.6 : W - 18, base = H - 34, bw = (areaR - 28) / n;
      for (let i = 0; i < n; i++) {
        const x = 18 + i * bw, hFull = 26 + (i / Math.max(1, n - 1)) * 78;
        const h = hFull * Math.min(1, Math.max(0, anim * n - i));
        const c = lvColor(i, n), on = i === cur, filled = i <= cur;
        if (on) { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 16 + Math.sin(t * 3) * 6; }
        ctx.fillStyle = filled ? (on ? c : c + '99') : '#16202f';
        ctx.fillRect(x + 3, base - h, bw - 6, h);
        if (on) ctx.restore();
        ctx.strokeStyle = on ? '#fff' : '#22344d'; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(x + 3, base - hFull, bw - 6, hFull);
        ctx.fillStyle = on ? '#fff' : '#64748b'; ctx.font = (on ? 'bold ' : '') + '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + bw / 2, base + 16);
      }
      ctx.fillStyle = '#475569'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('gering', 18, 34);
      ctx.textAlign = hasClock ? 'left' : 'right'; ctx.fillText('hoch →', areaR - 40, 34);
      if (hasClock) {
        const cx = W * 0.8, cy = H / 2 + 6, r = 44;
        const period = Math.min(4, Math.max(1.4, o.minutes * 0.4));
        p += 1 / (period * 60); let breached = p >= 1; if (p >= 1.3) p = 0;
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
        ctx.strokeStyle = breached ? '#ef4444' : o.accent; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.min(1, p) * 2 * Math.PI); ctx.stroke(); ctx.lineCap = 'butt';
        ctx.fillStyle = breached ? '#ef4444' : '#e2e8f0'; ctx.font = '900 20px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(o.minutes + ' Min', cx, cy + 6);
        ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
        ctx.fillText(breached ? 'durchbrochen' : 'Widerstand…', cx, cy + r + 18);
        const shake = breached ? 0 : Math.abs(Math.sin(t * 6)) * 5;
        ctx.font = '22px sans-serif'; ctx.fillText('🥷', cx - r - 18 + shake, cy + 8);
      }
    }
    requestAnimationFrame(() => loop(canvas, draw));
    return canvas;
  }

  /* ---------- Decks aus den vorhandenen Daten bauen ---------- */
  function lawDeck(g) {
    const pCount = g.abschnitte.reduce((s, a) => s + a.paragraphen.length, 0);
    const slides = [];
    slides.push({
      type: 'cover', accent: g.farbe, icon: g.icon, kicker: g.kategorie,
      title: g.short, subtitle: g.title, lead: g.intro,
      meta: [g.datum, g.anwender], count: pCount + ' Paragraphen',
    });
    // Inhaltsverzeichnis
    slides.push({
      type: 'toc', accent: g.farbe, kicker: g.short, title: 'Inhaltsverzeichnis',
      items: g.abschnitte.map(a => ({ label: 'Abschnitt ' + a.nr + ' · ' + a.title, count: a.paragraphen.length + ' §§', jumpTitle: 'Abschnitt ' + a.nr })),
    });
    // Bild-Folien
    const visMap = [
      [g.visualisierung, 'Überblick'],
      [g.visualisierung2, 'Praxis-Beispiele'],
      [g.visualisierung4, 'Jedermannsrechte'],
      [g.visualisierung3, 'Notwehr-Prüfschema'],
    ];
    visMap.forEach(([key, label]) => {
      if (key && window.GESETZE_DB && GESETZE_DB.VIS[key]) {
        slides.push({ type: 'visual', accent: g.farbe, kicker: g.short, title: label, html: GESETZE_DB.VIS[key] });
      }
    });
    // Stats-Folie
    let wichtig = 0, jeder = 0;
    g.abschnitte.forEach(a => a.paragraphen.forEach(p => { if (p.wichtig) wichtig++; if (p.jedermann) jeder++; }));
    slides.push({
      type: 'stats', accent: g.farbe, kicker: g.short, title: 'Das Wichtigste in Zahlen',
      stats: [
        { v: pCount, l: 'Paragraphen', ic: 'fa-section' },
        { v: g.abschnitte.length, l: 'Abschnitte', ic: 'fa-layer-group' },
        { v: wichtig, l: 'wichtige §§', ic: 'fa-star' },
        { v: jeder, l: 'Jedermannsrechte', ic: 'fa-hand' },
      ],
    });
    g.abschnitte.forEach(a => {
      slides.push({
        type: 'section', accent: g.farbe, kicker: g.short,
        title: 'Abschnitt ' + a.nr, subtitle: a.title, count: a.paragraphen.length + ' §§',
      });
      a.paragraphen.forEach(p => {
        slides.push({
          type: 'content', accent: g.farbe, kicker: 'Abschnitt ' + a.nr + ' · ' + g.short,
          badge: p.p, title: p.t, summary: p.s,
          beispiel: p.beispiel, merksatz: p.merksatz, fehler: p.fehler,
          tags: p.tags || [], wichtig: p.wichtig, jedermann: p.jedermann,
        });
      });
    });
    // Quiz aus wichtigen §§ (max 6 Karten)
    const flat = []; g.abschnitte.forEach(a => a.paragraphen.forEach(p => flat.push(p)));
    const quizPool = flat.filter(p => p.wichtig || p.jedermann).slice(0, 6);
    if (quizPool.length >= 3) {
      slides.push({
        type: 'quiz', accent: g.farbe, kicker: g.short, title: 'Schnelltest · Karteikarten',
        cards: quizPool.map(p => ({ q: p.p + ' · ' + p.t, a: p.s, tag: p.jedermann ? 'Jedermannsrecht' : (p.wichtig ? 'WICHTIG' : '') })),
      });
    }
    // Outro
    slides.push({
      type: 'outro', accent: g.farbe, kicker: g.short, icon: g.icon,
      title: 'Geschafft!', subtitle: g.title,
      lead: 'Du hast alle ' + pCount + ' Paragraphen durchgeblättert. Zeit für die nächste Präsentation oder den Schnelltest.',
    });
    return { id: 'law-' + g.id, group: 'Gesetze', title: g.short, sub: g.title, accent: g.farbe, icon: g.icon, count: slides.length, slides };
  }

  const CLASS_CFG = [
    {
      match: /Sicherungsklass/i, id: 'sue', icon: 'fa-medal', norm: 'VdS 2333',
      title: 'VdS-Sicherungsklassen', sub: 'SÜ 1 – 6 · Schutzniveau je Objekt-Risiko',
      lead: 'Die Sicherungsklasse ordnet einem Objekt je nach Risiko ein Schutzniveau zu – mit passendem EMA-Grad, Mindest-RC-Tür, NSL-Aufschaltung und Intervention.',
      badge: r => (r['Sicherungsklasse'] || '').split('/')[0].trim(),
      heading: r => r['Risikograd'] || '', desc: r => r['Beschreibung'] || '',
      fields: [['EMA-Grad (EN 50131)', 'EMA-Grad (EN 50131)'], ['Min. RC-Tür', 'Min. RC-Tür'], ['Min. Verglasung', 'Min. Verglasung'], ['NSL-Aufschaltung', 'NSL-Aufschaltung'], ['Empf. Intervention', 'Empf. Intervention'], ['Versicherung', 'Versicherung']],
      compareKeys: ['Risikograd', 'EMA-Grad (EN 50131)', 'Min. RC-Tür', 'NSL-Aufschaltung'],
      example: r => r['Beispiel-Objekte'] || '',
    },
    {
      match: /EMA-SICHERHEITSGRADE|EMA-Grad/i, id: 'ema', icon: 'fa-bell', norm: 'DIN EN 50131-1',
      title: 'EMA-Sicherheitsgrade', sub: 'Grad 1 – 4 · gegen welchen Tätertyp',
      lead: 'Der EMA-Grad legt fest, gegen welchen Tätertyp die Einbruchmeldeanlage schützt – vom Gelegenheitstäter bis zum organisierten Profi.',
      badge: r => { const m = (r['EMA-Grad'] || '').match(/Grad\s*\d/i); return m ? m[0] : (r['EMA-Grad'] || ''); },
      heading: r => { const p = (r['EMA-Grad'] || '').split('–')[1]; return (p ? p.trim() : '') || r['Risikostufe'] || ''; },
      desc: r => r['Bemerkung'] || '',
      fields: [['Tätertyp', 'Tätertyp'], ['Täter-Kenntnisse', 'Täter-Kenntnisse'], ['Werkzeug', 'Werkzeug'], ['Sabotage-Schutz', 'Sabotage-Schutz'], ['Alarmübertragung', 'Alarmübertragung'], ['Richtpreis EMA-System', 'Richtpreis EMA-System']],
      compareKeys: ['Tätertyp', 'Werkzeug', 'Alarmübertragung', 'Richtpreis EMA-System'],
      example: r => r['Typische Objekte'] || '',
    },
    {
      match: /WIDERSTANDSKLASSEN|RC-Klasse/i, id: 'rc', icon: 'fa-stopwatch', norm: 'DIN EN 1627',
      title: 'RC-Widerstandsklassen', sub: 'RC 1 – 6 · wie lange hält die Tür stand',
      lead: 'Die Widerstandsklasse (Resistance Class) gibt an, wie lange Tür oder Fenster einem Einbruch mit bestimmten Werkzeugen standhalten.',
      badge: r => r['RC-Klasse'] || '',
      heading: r => (r['Widerstandszeit'] && r['Widerstandszeit'] !== '—') ? '⏱ ' + r['Widerstandszeit'] : 'Kein Zeitwert',
      desc: r => r['Typische Anwendung'] || '',
      fields: [['Tätertyp', 'Tätertyp'], ['Werkzeuge', 'Werkzeuge'], ['Verglasung', 'Verglasung'], ['Polizei-Empf.', 'Polizei-Empf.'], ['Richtpreis Tür', 'Richtpreis Tür (€)'], ['Richtpreis Fenster', 'Richtpreis Fenster (€)']],
      compareKeys: ['Widerstandszeit', 'Werkzeuge', 'Verglasung', 'Richtpreis Tür (€)'],
      example: r => r['Empfehlung'] || '',
    },
  ];

  function classDeck(cfg, tbl) {
    const slides = [];
    const labels = tbl.rows.map(r => cfg.badge(r));
    slides.push({
      type: 'cover', accent: 'hsl(190 80% 50%)', icon: cfg.icon, kicker: cfg.norm,
      title: cfg.title, subtitle: cfg.sub, lead: cfg.lead, count: tbl.rows.length + ' Klassen',
    });
    slides.push({
      type: 'toc', accent: 'hsl(190 80% 50%)', kicker: cfg.title, title: 'Inhaltsverzeichnis',
      items: tbl.rows.map((r, i) => ({ label: cfg.badge(r) + ' · ' + cfg.heading(r), count: '', jumpTitle: cfg.badge(r) })),
    });
    tbl.rows.forEach((r, i) => {
      const color = lvColor(i, tbl.rows.length);
      const minutes = cfg.id === 'rc' ? numOf(r['Widerstandszeit']) : 0;
      slides.push({
        type: 'content', accent: color, kicker: cfg.title,
        badge: cfg.badge(r), title: cfg.heading(r), summary: cfg.desc(r),
        fields: cfg.fields.map(([label, key]) => ({ label, value: r[key] })).filter(f => f.value),
        beispiel: cfg.example(r) ? cfg.example(r) : null, beispielLabel: 'Beispiel-Objekte',
        tags: [],
        anim: { labels, current: i, accent: color, minutes },
      });
    });
    // Vergleichs-Folie
    slides.push({
      type: 'compare', accent: 'hsl(190 80% 50%)', kicker: cfg.title, title: 'Alle Klassen im Vergleich',
      headers: ['Klasse', ...cfg.compareKeys],
      rows: tbl.rows.map((r, i) => [
        { v: cfg.badge(r), color: lvColor(i, tbl.rows.length), badge: true },
        ...cfg.compareKeys.map(k => ({ v: r[k] || '–' })),
      ]),
    });
    slides.push({
      type: 'outro', accent: 'hsl(190 80% 50%)', kicker: cfg.title, icon: cfg.icon,
      title: 'Geschafft!', subtitle: cfg.title,
      lead: 'Alle ' + tbl.rows.length + ' Klassen durchgeblättert. Zeit für die nächste Präsentation.',
    });
    return { id: 'class-' + cfg.id, group: 'Klassen & Grade', title: cfg.title, sub: cfg.sub, accent: 'hsl(190 80% 50%)', icon: cfg.icon, count: slides.length, slides };
  }

  function buildDecks(d) {
    const decks = [];
    if (window.GESETZE_DB) GESETZE_DB.getAll().forEach(g => decks.push(lawDeck(g)));
    if (d && d.sicherungsklassen && d.sicherungsklassen.tables) {
      d.sicherungsklassen.tables.forEach(tbl => {
        const cfg = CLASS_CFG.find(c => c.match.test(tbl.title || ''));
        if (cfg) decks.push(classDeck(cfg, tbl));
      });
    }
    return decks;
  }

  /* ---------- Folie rendern ---------- */
  function renderSlide(s, jumpTo) {
    const slide = el('div', { class: 'pp-slide pp-' + s.type, style: `--a:${s.accent}` });

    if (s.type === 'cover' || s.type === 'outro') {
      slide.appendChild(el('div', { class: 'pp-cover-ico', html: `<i class="fas ${s.icon || 'fa-file-lines'}"></i>` }));
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h1', { class: 'pp-cover-title', text: s.title }));
      if (s.subtitle) slide.appendChild(el('div', { class: 'pp-cover-sub', text: s.subtitle }));
      if (s.lead) slide.appendChild(el('p', { class: 'pp-lead', text: s.lead }));
      const meta = el('div', { class: 'pp-meta' });
      (s.meta || []).forEach(m => m && meta.appendChild(el('span', { class: 'pp-meta-chip', text: m })));
      if (s.count) meta.appendChild(el('span', { class: 'pp-meta-chip pp-meta-strong pp-num', dataset: { target: s.count }, text: '0 ' + s.count.replace(/^\d[\d.]*\s*/, '') }));
      slide.appendChild(meta);
      return slide;
    }
    if (s.type === 'section') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('div', { class: 'pp-section-nr', text: s.title }));
      slide.appendChild(el('h2', { class: 'pp-section-title', text: s.subtitle || '' }));
      if (s.count) slide.appendChild(el('div', { class: 'pp-meta-chip pp-meta-strong pp-num', text: s.count }));
      return slide;
    }
    if (s.type === 'visual') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h2', { class: 'pp-title', text: s.title || 'Visualisierung' }));
      slide.appendChild(el('div', { class: 'pp-vis', html: s.html || '' }));
      return slide;
    }
    if (s.type === 'toc') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h2', { class: 'pp-title', text: s.title }));
      const list = el('div', { class: 'pp-toc' });
      s.items.forEach((it, i) => {
        const row = el('button', { class: 'pp-toc-row', type: 'button' });
        row.appendChild(el('span', { class: 'pp-toc-n', text: String(i + 1).padStart(2, '0') }));
        row.appendChild(el('span', { class: 'pp-toc-l', text: it.label }));
        if (it.count) row.appendChild(el('span', { class: 'pp-toc-c', text: it.count }));
        row.appendChild(el('i', { class: 'fas fa-chevron-right pp-toc-go' }));
        row.addEventListener('click', () => jumpTo && jumpTo(it.jumpTitle));
        list.appendChild(row);
      });
      slide.appendChild(list);
      return slide;
    }
    if (s.type === 'stats') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h2', { class: 'pp-title', text: s.title }));
      const g = el('div', { class: 'pp-stats' });
      s.stats.forEach(st => {
        const c = el('div', { class: 'pp-stat' });
        c.appendChild(el('div', { class: 'pp-stat-i', html: `<i class="fas ${st.ic}"></i>` }));
        c.appendChild(el('div', { class: 'pp-stat-v pp-num', dataset: { target: String(st.v) }, text: '0' }));
        c.appendChild(el('div', { class: 'pp-stat-l', text: st.l }));
        g.appendChild(c);
      });
      slide.appendChild(g);
      return slide;
    }
    if (s.type === 'compare') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h2', { class: 'pp-title', text: s.title }));
      const wrap = el('div', { class: 'pp-cmp-wrap' });
      const tbl = el('table', { class: 'pp-cmp' });
      const thead = el('thead'); const trh = el('tr');
      s.headers.forEach(h => trh.appendChild(el('th', { text: h })));
      thead.appendChild(trh); tbl.appendChild(thead);
      const tb = el('tbody');
      s.rows.forEach(row => {
        const tr = el('tr');
        row.forEach(cell => {
          const td = el('td');
          if (cell.badge) {
            const b = el('span', { class: 'pp-cmp-badge', style: `--a:${cell.color}`, text: cell.v });
            td.appendChild(b);
          } else td.textContent = cell.v;
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      tbl.appendChild(tb); wrap.appendChild(tbl);
      slide.appendChild(wrap);
      return slide;
    }
    if (s.type === 'quiz') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h2', { class: 'pp-title', text: s.title }));
      slide.appendChild(el('p', { class: 'pp-quiz-hint', text: 'Tippe auf eine Karte – sie dreht sich um und zeigt die Antwort.' }));
      const grid = el('div', { class: 'pp-quiz' });
      s.cards.forEach(card => {
        const c = el('div', { class: 'pp-card' });
        const inner = el('div', { class: 'pp-card-inner' });
        const front = el('div', { class: 'pp-card-front' }, [
          el('div', { class: 'pp-card-icon', html: '<i class="fas fa-circle-question"></i>' }),
          el('div', { class: 'pp-card-q', text: card.q }),
          card.tag ? el('div', { class: 'pp-card-tag', text: card.tag }) : null,
          el('div', { class: 'pp-card-hint', text: 'tippen für Antwort' }),
        ]);
        const back = el('div', { class: 'pp-card-back' }, [
          el('div', { class: 'pp-card-icon', html: '<i class="fas fa-lightbulb"></i>' }),
          el('div', { class: 'pp-card-a', text: card.a }),
          el('div', { class: 'pp-card-hint', text: 'nochmal tippen' }),
        ]);
        inner.append(front, back); c.appendChild(inner);
        c.addEventListener('click', () => c.classList.toggle('flip'));
        grid.appendChild(c);
      });
      slide.appendChild(grid);
      return slide;
    }
    // content
    const top = el('div', { class: 'pp-top' });
    top.appendChild(el('span', { class: 'pp-kicker', text: s.kicker || '' }));
    const flags = el('div', { class: 'pp-flags' });
    if (s.wichtig) flags.appendChild(el('span', { class: 'pp-flag pp-flag-star', html: '<i class="fas fa-star"></i> WICHTIG' }));
    if (s.jedermann) flags.appendChild(el('span', { class: 'pp-flag pp-flag-hand', html: '<i class="fas fa-hand"></i> JEDERMANNSRECHT' }));
    top.appendChild(flags);
    slide.appendChild(top);

    const head = el('div', { class: 'pp-head' });
    if (s.badge) head.appendChild(el('span', { class: 'pp-badge', text: s.badge }));
    head.appendChild(el('h2', { class: 'pp-title', text: s.title || '' }));
    slide.appendChild(head);

    if (s.summary) slide.appendChild(el('p', { class: 'pp-summary', text: s.summary }));
    if (s.anim) slide.appendChild(el('div', { class: 'pp-anim' }, [animMeter(s.anim)]));
    if (s.fields && s.fields.length) {
      const grid = el('div', { class: 'pp-fields' });
      s.fields.forEach(f => grid.append(
        el('div', { class: 'pp-field' }, [
          el('span', { class: 'pp-f-l', text: f.label }),
          el('span', { class: 'pp-f-v', text: f.value }),
        ])
      ));
      slide.appendChild(grid);
    }
    if (s.beispiel) slide.appendChild(el('div', { class: 'pp-box pp-box-beispiel' }, [
      el('span', { class: 'pp-box-l', html: '<i class="fas fa-lightbulb"></i> ' + (s.beispielLabel || 'Praxisfall') }),
      el('span', { class: 'pp-box-v', text: s.beispiel }),
    ]));
    if (s.merksatz) slide.appendChild(el('div', { class: 'pp-box pp-box-merk' }, [
      el('span', { class: 'pp-box-l', html: '<i class="fas fa-bookmark"></i> Merksatz' }),
      el('span', { class: 'pp-box-v', text: s.merksatz }),
    ]));
    if (s.fehler && s.fehler.length) {
      const box = el('div', { class: 'pp-box pp-box-fehler' });
      box.appendChild(el('span', { class: 'pp-box-l', html: '<i class="fas fa-triangle-exclamation"></i> Typische Fehler' }));
      const ul = el('ul', { class: 'pp-fehler' });
      s.fehler.forEach(f => ul.appendChild(el('li', { text: f })));
      box.appendChild(ul);
      slide.appendChild(box);
    }
    if (s.tags && s.tags.length) {
      const tg = el('div', { class: 'pp-tags' });
      s.tags.forEach(t => tg.appendChild(el('span', { class: 'pp-tag', text: t })));
      slide.appendChild(tg);
    }
    return slide;
  }

  /* Mini-Thumbnail einer Folie (Punkt-Indikator + Mini-Text) */
  function renderThumb(s, i, n) {
    const t = el('button', { class: 'pp-th pp-th-' + s.type, style: `--a:${s.accent}`, type: 'button', title: thumbTitle(s, i, n) });
    t.appendChild(el('span', { class: 'pp-th-n', text: String(i + 1) }));
    return t;
  }
  function thumbTitle(s, i, n) {
    const base = (i + 1) + ' / ' + n + ' · ';
    if (s.type === 'cover') return base + 'Titel · ' + (s.title || '');
    if (s.type === 'toc') return base + 'Inhalt';
    if (s.type === 'section') return base + (s.title || '') + ' · ' + (s.subtitle || '');
    if (s.type === 'visual') return base + 'Grafik · ' + (s.title || '');
    if (s.type === 'stats') return base + 'Statistik';
    if (s.type === 'compare') return base + 'Vergleich';
    if (s.type === 'quiz') return base + 'Schnelltest';
    if (s.type === 'outro') return base + 'Abschluss';
    return base + (s.badge ? s.badge + ' · ' : '') + (s.title || '');
  }

  /* ---------- Hauptansicht ---------- */
  function view(d) {
    const decks = buildDecks(d);
    const root = el('div', { class: 'pp-wrap' });

    function showPicker() {
      root.innerHTML = '';
      const head = el('div', { class: 'view-head' }, [
        el('span', { class: 'crumb', text: 'Lernen · Präsentation' }),
        el('h1', { text: 'Präsentation · Slideshow' }),
        el('p', { text: 'Wähle ein Thema. Pfeiltasten / Wischen / Knöpfe. Vollbild (F), Lese-Modus, Marker, Tempo-Regler – alles drin.' }),
      ]);
      root.appendChild(head);
      const groups = {};
      decks.forEach(dk => (groups[dk.group] = groups[dk.group] || []).push(dk));
      Object.entries(groups).forEach(([gname, list]) => {
        root.appendChild(el('div', { class: 'pp-group-label', text: gname }));
        const grid = el('div', { class: 'pp-picker-grid' });
        list.forEach(dk => {
          const card = el('button', { class: 'pp-deck', type: 'button', style: `--a:${dk.accent}` });
          card.appendChild(el('div', { class: 'pp-deck-ico', html: `<i class="fas ${dk.icon}"></i>` }));
          card.appendChild(el('div', { class: 'pp-deck-body' }, [
            el('strong', { text: dk.title }),
            el('span', { text: dk.sub }),
            el('em', { html: `<i class="fas fa-film"></i> ${dk.count} Folien` }),
          ]));
          card.appendChild(el('div', { class: 'pp-deck-go', html: '<i class="fas fa-play"></i>' }));
          attachTilt(card);
          card.addEventListener('click', () => startDeck(dk));
          grid.appendChild(card);
        });
        root.appendChild(grid);
      });
    }

    function startDeck(deck) {
      root.innerHTML = '';
      let idx = 0, autoTimer = null, lastDir = 1, autoSpeed = 3500;
      let markerOn = false, markerCtx = null, markerCanvas = null;

      const player = el('div', { class: 'pp-player', style: `--a:${deck.accent}` });
      const exit = el('button', { class: 'pp-btn', html: '<i class="fas fa-arrow-left"></i> <span>Übersicht</span>' });
      const search = el('input', { class: 'pp-search', type: 'search', placeholder: 'Folie suchen…' });
      const autoBtn = el('button', { class: 'pp-btn', title: 'Automatisch abspielen (A)', html: '<i class="fas fa-play"></i>' });
      const speedBtn = el('button', { class: 'pp-btn pp-btn-mini', title: 'Tempo', text: '3.5s' });
      const markerBtn = el('button', { class: 'pp-btn pp-btn-icon', title: 'Marker (M)', html: '<i class="fas fa-pen"></i>' });
      const soundBtn = el('button', { class: 'pp-btn pp-btn-icon', title: 'Sound', html: '<i class="fas fa-volume-xmark"></i>' });
      const readBtn = el('button', { class: 'pp-btn pp-btn-icon', title: 'Lese-Modus (L)', html: '<i class="fas fa-book-open"></i>' });
      const fsBtn = el('button', { class: 'pp-btn pp-btn-icon', title: 'Vollbild (F)', html: '<i class="fas fa-expand"></i>' });
      const bar = el('div', { class: 'pp-bar' }, [
        exit,
        el('div', { class: 'pp-bar-title' }, [el('strong', { text: deck.title }), el('span', { text: deck.sub })]),
        search,
        el('div', { class: 'pp-bar-actions' }, [autoBtn, speedBtn, markerBtn, soundBtn, readBtn, fsBtn]),
      ]);

      const host = el('div', { class: 'pp-slide-host' });
      const prev = el('button', { class: 'pp-nav pp-prev', html: '<i class="fas fa-chevron-left"></i>' });
      const next = el('button', { class: 'pp-nav pp-next', html: '<i class="fas fa-chevron-right"></i>' });
      const bg = el('canvas', { class: 'pp-bg' });
      const stage = el('div', { class: 'pp-stage' }, [bg, prev, host, next]);

      const fill = el('div', { class: 'pp-progress-fill' });
      const counter = el('div', { class: 'pp-counter' });
      const foot = el('div', { class: 'pp-foot' }, [el('div', { class: 'pp-progress' }, [fill]), counter]);

      // Mini-Map (Thumbnails)
      const strip = el('div', { class: 'pp-strip' });
      const thumbs = deck.slides.map((s, i) => {
        const t = renderThumb(s, i, deck.slides.length);
        t.addEventListener('click', () => { stopAuto(); lastDir = i >= idx ? 1 : -1; idx = i; render(); });
        strip.appendChild(t);
        return t;
      });

      player.append(bar, stage, foot, strip);
      root.appendChild(player);
      startBg(bg, stage, deck.accent);

      function clearMarker() {
        if (markerCanvas) { markerCanvas.remove(); markerCanvas = null; markerCtx = null; }
      }
      function setupMarkerOnce() {
        if (!markerOn) { clearMarker(); return; }
        clearMarker();
        markerCanvas = el('canvas', { class: 'pp-marker' });
        const slideEl = host.querySelector('.pp-slide');
        if (!slideEl) return;
        slideEl.appendChild(markerCanvas);
        function fit() { markerCanvas.width = slideEl.clientWidth; markerCanvas.height = slideEl.clientHeight; }
        fit();
        markerCtx = markerCanvas.getContext('2d');
        markerCtx.lineWidth = 4; markerCtx.lineCap = 'round'; markerCtx.lineJoin = 'round';
        markerCtx.strokeStyle = deck.accent;
        let drawing = false, lx = 0, ly = 0;
        function pos(ev) { const r = markerCanvas.getBoundingClientRect(); const t = ev.touches ? ev.touches[0] : ev; return [t.clientX - r.left, t.clientY - r.top]; }
        function down(e) { e.preventDefault(); drawing = true; [lx, ly] = pos(e); }
        function move(e) { if (!drawing) return; e.preventDefault(); const [x, y] = pos(e); markerCtx.beginPath(); markerCtx.moveTo(lx, ly); markerCtx.lineTo(x, y); markerCtx.stroke(); lx = x; ly = y; }
        function up() { drawing = false; }
        markerCanvas.addEventListener('mousedown', down); markerCanvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
        markerCanvas.addEventListener('touchstart', down, { passive: false }); markerCanvas.addEventListener('touchmove', move, { passive: false }); markerCanvas.addEventListener('touchend', up);
      }

      function jumpToTitle(t) {
        const i = deck.slides.findIndex(s => s.title === t);
        if (i >= 0) { lastDir = i >= idx ? 1 : -1; idx = i; render(); }
      }

      function render() {
        host.innerHTML = '';
        const s = deck.slides[idx];
        const slideEl = renderSlide(s, jumpToTitle);
        slideEl.classList.add(lastDir < 0 ? 'pp-from-left' : 'pp-from-right');
        host.appendChild(slideEl);
        fill.style.width = ((idx + 1) / deck.slides.length * 100) + '%';
        counter.textContent = (idx + 1) + ' / ' + deck.slides.length;
        prev.disabled = idx === 0;
        next.disabled = idx === deck.slides.length - 1;
        thumbs.forEach((t, i) => t.classList.toggle('on', i === idx));
        const onT = thumbs[idx]; if (onT) onT.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        // Anim-Effekte
        requestAnimationFrame(() => animateNumbers(slideEl));
        setupMarkerOnce();
        if (idx === deck.slides.length - 1) { fxBoom(); fireConfetti(stage); }
      }
      function go(delta) {
        const n = Math.min(deck.slides.length - 1, Math.max(0, idx + delta));
        if (n === idx) { if (delta > 0) stopAuto(); return; }
        lastDir = delta < 0 ? -1 : 1; (delta > 0 ? fxNext : fxPrev)(); idx = n; render();
        if (autoTimer && idx === deck.slides.length - 1) stopAuto();
      }
      function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; autoBtn.innerHTML = '<i class="fas fa-play"></i>'; } }
      function toggleAuto() {
        if (autoTimer) { stopAuto(); return; }
        if (idx === deck.slides.length - 1) { idx = 0; render(); }
        autoBtn.innerHTML = '<i class="fas fa-pause"></i>';
        autoTimer = setInterval(() => { if (!stage.isConnected) { stopAuto(); return; } go(1); }, autoSpeed);
      }
      function bumpSpeed() {
        const opts = [2000, 3500, 5500, 8000];
        autoSpeed = opts[(opts.indexOf(autoSpeed) + 1) % opts.length];
        speedBtn.textContent = (autoSpeed / 1000).toFixed(1) + 's';
        if (autoTimer) { stopAuto(); toggleAuto(); }
      }
      function toggleSound() { soundOn = !soundOn; ensureAC(); soundBtn.innerHTML = '<i class="fas ' + (soundOn ? 'fa-volume-high' : 'fa-volume-xmark') + '"></i>'; soundBtn.classList.toggle('active', soundOn); if (soundOn) ping(660, 0.1); }
      function toggleMarker() { markerOn = !markerOn; markerBtn.classList.toggle('active', markerOn); player.classList.toggle('pp-marker-on', markerOn); setupMarkerOnce(); }
      function toggleFs() {
        try {
          if (!document.fullscreenElement) { player.requestFullscreen && player.requestFullscreen(); player.classList.add('pp-fs'); }
          else { document.exitFullscreen && document.exitFullscreen(); }
        } catch (e) {}
      }
      function showReader() {
        stopAuto();
        const ov = el('div', { class: 'pp-reader' });
        const head = el('div', { class: 'pp-reader-head' }, [
          el('h3', { html: `<i class="fas ${deck.icon}"></i> ${deck.title} · alle Folien` }),
          el('button', { class: 'pp-btn', html: '<i class="fas fa-xmark"></i> Schließen', onclick: () => ov.remove() }),
        ]);
        ov.appendChild(head);
        deck.slides.forEach((s, i) => {
          const wrap = el('div', { class: 'pp-reader-slide' });
          wrap.appendChild(el('div', { class: 'pp-reader-no', text: 'Folie ' + (i + 1) + ' / ' + deck.slides.length }));
          wrap.appendChild(renderSlide(s, t => { const j = deck.slides.findIndex(x => x.title === t); if (j >= 0) { idx = j; render(); ov.remove(); } }));
          ov.appendChild(wrap);
        });
        root.appendChild(ov);
        animateNumbers(ov);
        ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
      }
      document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) player.classList.remove('pp-fs'); });

      prev.addEventListener('click', () => { stopAuto(); go(-1); });
      next.addEventListener('click', () => { stopAuto(); go(1); });
      exit.addEventListener('click', () => { stopAuto(); if (document.fullscreenElement) document.exitFullscreen(); showPicker(); });
      autoBtn.addEventListener('click', toggleAuto);
      speedBtn.addEventListener('click', bumpSpeed);
      soundBtn.addEventListener('click', toggleSound);
      markerBtn.addEventListener('click', toggleMarker);
      readBtn.addEventListener('click', showReader);
      fsBtn.addEventListener('click', toggleFs);

      // Live-Suche im Deck
      search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        if (!q) { thumbs.forEach(t => t.classList.remove('dim', 'match')); return; }
        deck.slides.forEach((s, i) => {
          const hay = JSON.stringify(s).toLowerCase();
          const m = hay.includes(q);
          thumbs[i].classList.toggle('dim', !m);
          thumbs[i].classList.toggle('match', m);
        });
      });
      search.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const i = deck.slides.findIndex((s, j) => thumbs[j].classList.contains('match'));
          if (i >= 0) { lastDir = i >= idx ? 1 : -1; idx = i; render(); }
        }
      });

      function onKey(e) {
        if (!stage.isConnected) { document.removeEventListener('keydown', onKey); stopAuto(); return; }
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); stopAuto(); go(1); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); stopAuto(); go(-1); }
        else if (e.key === 'Escape') { if (!document.fullscreenElement) { stopAuto(); showPicker(); } }
        else if (e.key === 'Home') { stopAuto(); lastDir = -1; idx = 0; render(); }
        else if (e.key === 'End') { stopAuto(); lastDir = 1; idx = deck.slides.length - 1; render(); }
        else if (e.key.toLowerCase() === 'f') { toggleFs(); }
        else if (e.key.toLowerCase() === 'a') { toggleAuto(); }
        else if (e.key.toLowerCase() === 'm') { toggleMarker(); }
        else if (e.key.toLowerCase() === 'l') { showReader(); }
        else if (e.key.toLowerCase() === 's') { toggleSound(); }
      }
      document.addEventListener('keydown', onKey);

      // Wischen (Touch)
      let tsx = null;
      stage.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', e => {
        if (tsx == null || markerOn) { tsx = null; return; }
        const dx = e.changedTouches[0].clientX - tsx;
        if (Math.abs(dx) > 45) { stopAuto(); go(dx < 0 ? 1 : -1); }
        tsx = null;
      }, { passive: true });

      render();
    }

    showPicker();
    return root;
  }
  return { view };
})();
