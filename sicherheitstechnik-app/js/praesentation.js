/* Präsentations-/Slideshow-Modus: Gesetze (BeWachV, DGUV …) und
   Sicherungsklassen (SÜ, EMA-Grade, RC) als durchblätterbare Folien.
   window.PRAESENTATION.view(d). Reine DOM-Folien (scharfer Text, Theme-fähig). */
window.PRAESENTATION = (() => {
  const { el } = U;

  function lvColor(idx, count) {
    const hue = Math.round(140 - (idx / Math.max(1, count - 1)) * 140);
    return `hsl(${hue} 70% 50%)`;
  }
  function loop(canvas, draw) {
    function f() { if (!canvas.isConnected) return; draw(); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  const numOf = s => { const m = (s || '').match(/\d+/); return m ? +m[0] : 0; };

  /* Animierter Partikel-/Glow-Hintergrund (in Deck-Farbe) */
  function startBg(canvas, sizeEl, accent) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, parts = [], t = 0;
    const N = 44;
    function ensure() {
      const w = sizeEl.clientWidth || 900, h = sizeEl.clientHeight || 520;
      if (w !== W || h !== H) {
        W = canvas.width = w; H = canvas.height = h;
        if (!parts.length) parts = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 2 + 1 }));
        else parts.forEach(p => { if (p.x > W) p.x = Math.random() * W; if (p.y > H) p.y = Math.random() * H; });
      }
    }
    function draw() {
      ensure(); t += 0.005;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const b1x = W * (0.3 + 0.2 * Math.sin(t)), b1y = H * (0.35 + 0.2 * Math.cos(t * 0.8));
      const g1 = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, Math.max(W, H) * 0.5);
      g1.addColorStop(0, accent); g1.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.18; ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      const b2x = W * (0.72 + 0.2 * Math.cos(t * 0.7)), b2y = H * (0.62 + 0.2 * Math.sin(t));
      const g2 = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, Math.max(W, H) * 0.45);
      g2.addColorStop(0, '#22d3ee'); g2.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.11; ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      for (const p of parts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      ctx.fillStyle = accent; ctx.globalAlpha = 0.55;
      for (const p of parts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
      ctx.strokeStyle = accent; ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.globalAlpha = 0.15 * (1 - d / 130); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(() => loop(canvas, draw));
  }

  /* Animiertes Stufen-Meter für Klassen-Folien (+ optionaler RC-Countdown) */
  function animMeter(o) {
    const W = 540, H = 176, canvas = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = canvas.getContext('2d');
    const labels = o.labels, n = labels.length, cur = o.current;
    const hasClock = o.minutes > 0;
    let t = 0, p = 0;
    function draw() {
      t += 0.04;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Stufe im Vergleich', 18, 18);
      const areaR = hasClock ? W * 0.6 : W - 18, base = H - 34, bw = (areaR - 28) / n;
      for (let i = 0; i < n; i++) {
        const x = 18 + i * bw, h = 26 + (i / Math.max(1, n - 1)) * 78, c = lvColor(i, n), on = i === cur;
        const filled = i <= cur;
        if (on) { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 16 + Math.sin(t * 3) * 6; }
        ctx.fillStyle = filled ? (on ? c : c + '99') : '#16202f';
        ctx.fillRect(x + 3, base - h, bw - 6, h);
        if (on) ctx.restore();
        ctx.strokeStyle = on ? '#fff' : '#22344d'; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(x + 3, base - h, bw - 6, h);
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
    // Bild-Folien aus den vorhandenen Visualisierungen
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
  function renderSlide(s) {
    const slide = el('div', { class: 'pp-slide pp-' + s.type, style: `--a:${s.accent}` });
    if (s.type === 'cover') {
      slide.appendChild(el('div', { class: 'pp-cover-ico', html: `<i class="fas ${s.icon || 'fa-file-lines'}"></i>` }));
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h1', { class: 'pp-cover-title', text: s.title }));
      if (s.subtitle) slide.appendChild(el('div', { class: 'pp-cover-sub', text: s.subtitle }));
      if (s.lead) slide.appendChild(el('p', { class: 'pp-lead', text: s.lead }));
      const meta = el('div', { class: 'pp-meta' });
      (s.meta || []).forEach(m => m && meta.appendChild(el('span', { class: 'pp-meta-chip', text: m })));
      if (s.count) meta.appendChild(el('span', { class: 'pp-meta-chip pp-meta-strong', text: s.count }));
      slide.appendChild(meta);
      return slide;
    }
    if (s.type === 'section') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('div', { class: 'pp-section-nr', text: s.title }));
      slide.appendChild(el('h2', { class: 'pp-section-title', text: s.subtitle || '' }));
      if (s.count) slide.appendChild(el('div', { class: 'pp-meta-chip pp-meta-strong', text: s.count }));
      return slide;
    }
    if (s.type === 'visual') {
      slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
      slide.appendChild(el('h2', { class: 'pp-title', text: s.title || 'Visualisierung' }));
      slide.appendChild(el('div', { class: 'pp-vis', html: s.html || '' }));
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

  /* ---------- Hauptansicht ---------- */
  function view(d) {
    const decks = buildDecks(d);
    const root = el('div', { class: 'pp-wrap' });

    function showPicker() {
      root.innerHTML = '';
      const head = el('div', { class: 'view-head' }, [
        el('span', { class: 'crumb', text: 'Lernen · Präsentation' }),
        el('h1', { text: 'Präsentation · Slideshow' }),
        el('p', { text: 'Wähle ein Thema und blättere wie in einer Präsentation durch – mit Pfeiltasten, Wischen oder den Knöpfen. Ideal zum Lernen & Vortragen.' }),
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
          card.addEventListener('click', () => startDeck(dk));
          grid.appendChild(card);
        });
        root.appendChild(grid);
      });
    }

    function startDeck(deck) {
      root.innerHTML = '';
      let idx = 0, autoTimer = null, lastDir = 1;

      const player = el('div', { class: 'pp-player', style: `--a:${deck.accent}` });
      const exit = el('button', { class: 'pp-btn', html: '<i class="fas fa-arrow-left"></i> <span>Übersicht</span>' });
      const autoBtn = el('button', { class: 'pp-btn', title: 'Automatisch abspielen', html: '<i class="fas fa-play"></i>' });
      const fsBtn = el('button', { class: 'pp-btn', title: 'Vollbild', html: '<i class="fas fa-expand"></i>' });
      const bar = el('div', { class: 'pp-bar' }, [
        exit,
        el('div', { class: 'pp-bar-title' }, [el('strong', { text: deck.title }), el('span', { text: deck.sub })]),
        el('div', { class: 'pp-bar-actions' }, [autoBtn, fsBtn]),
      ]);

      const host = el('div', { class: 'pp-slide-host' });
      const prev = el('button', { class: 'pp-nav pp-prev', html: '<i class="fas fa-chevron-left"></i>' });
      const next = el('button', { class: 'pp-nav pp-next', html: '<i class="fas fa-chevron-right"></i>' });
      const bg = el('canvas', { class: 'pp-bg' });
      const stage = el('div', { class: 'pp-stage' }, [bg, prev, host, next]);

      const fill = el('div', { class: 'pp-progress-fill' });
      const counter = el('div', { class: 'pp-counter' });
      const foot = el('div', { class: 'pp-foot' }, [el('div', { class: 'pp-progress' }, [fill]), counter]);

      player.append(bar, stage, foot);
      root.appendChild(player);
      startBg(bg, stage, deck.accent);

      function render() {
        host.innerHTML = '';
        const slideEl = renderSlide(deck.slides[idx]);
        slideEl.classList.add(lastDir < 0 ? 'pp-from-left' : 'pp-from-right');
        host.appendChild(slideEl);
        fill.style.width = ((idx + 1) / deck.slides.length * 100) + '%';
        counter.textContent = (idx + 1) + ' / ' + deck.slides.length;
        prev.disabled = idx === 0;
        next.disabled = idx === deck.slides.length - 1;
      }
      function go(delta) {
        const n = Math.min(deck.slides.length - 1, Math.max(0, idx + delta));
        if (n === idx) { if (delta > 0) stopAuto(); return; }
        lastDir = delta < 0 ? -1 : 1; idx = n; render();
        if (autoTimer && idx === deck.slides.length - 1) stopAuto();
      }
      function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; autoBtn.innerHTML = '<i class="fas fa-play"></i>'; } }
      function toggleAuto() {
        if (autoTimer) { stopAuto(); return; }
        if (idx === deck.slides.length - 1) idx = 0, render();
        autoBtn.innerHTML = '<i class="fas fa-pause"></i>';
        autoTimer = setInterval(() => { if (!stage.isConnected) { stopAuto(); return; } go(1); }, 3500);
      }
      function toggleFs() {
        try {
          if (!document.fullscreenElement) { player.requestFullscreen && player.requestFullscreen(); player.classList.add('pp-fs'); }
          else { document.exitFullscreen && document.exitFullscreen(); }
        } catch (e) { /* Vollbild nicht verfügbar */ }
      }
      document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) player.classList.remove('pp-fs'); });

      prev.addEventListener('click', () => { stopAuto(); go(-1); });
      next.addEventListener('click', () => { stopAuto(); go(1); });
      exit.addEventListener('click', () => { stopAuto(); if (document.fullscreenElement) document.exitFullscreen(); showPicker(); });
      autoBtn.addEventListener('click', toggleAuto);
      fsBtn.addEventListener('click', toggleFs);

      // Tastatur (selbst-aufräumend, wenn die Bühne nicht mehr im DOM ist)
      function onKey(e) {
        if (!stage.isConnected) { document.removeEventListener('keydown', onKey); stopAuto(); return; }
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); stopAuto(); go(1); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); stopAuto(); go(-1); }
        else if (e.key === 'Escape') { if (!document.fullscreenElement) { stopAuto(); showPicker(); } }
        else if (e.key === 'Home') { stopAuto(); idx = 0; render(); }
        else if (e.key === 'End') { stopAuto(); idx = deck.slides.length - 1; render(); }
        else if (e.key.toLowerCase() === 'f') { toggleFs(); }
      }
      document.addEventListener('keydown', onKey);

      // Wischen (Touch)
      let tsx = null;
      stage.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', e => {
        if (tsx == null) return;
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
