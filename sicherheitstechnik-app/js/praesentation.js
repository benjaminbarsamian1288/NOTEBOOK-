/* Präsentations-/Slideshow-Modus „krass++". window.PRAESENTATION.view(d).
   Features: Tilt-3D-Kacheln, Konfetti, Counter-Anim, Mini-Map mit Thumbs,
   Inhaltsverzeichnis, Vergleichs-Folien, Quiz/Karteikarten, Lese-Modus,
   Marker-/Stift-Overlay, Soundeffekte, Tempo-Regler, Suche im Deck. */
window.PRAESENTATION = (() => {
  const { el } = U;

  /* ---------- Tages-Fortschritt (localStorage) ---------- */
  const PR_STATE = (() => {
    const KEY = 'pp-state-v1';
    function todayStr() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    function diffDays(a, b) { const da = new Date(a), db = new Date(b); return Math.round((db - da) / 86400000); }
    let s = {};
    try { s = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
    s.learned = s.learned || {}; s.review = s.review || {};
    s.streak = s.streak || 0; s.lastVisit = s.lastVisit || null; s.totalDays = s.totalDays || 0;
    function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
    let lastStreakBump = -1;
    return {
      today: todayStr,
      visit() {
        const t = todayStr();
        if (s.lastVisit === t) return s;
        lastStreakBump = s.streak;
        if (s.lastVisit && diffDays(s.lastVisit, t) === 1) s.streak = (s.streak || 0) + 1;
        else s.streak = 1;
        s.lastVisit = t; s.totalDays = (s.totalDays || 0) + 1; save(); return s;
      },
      learned: id => !!s.learned[id],
      review:  id => !!s.review[id],
      setLearned(id) { s.learned[id] = todayStr(); delete s.review[id]; save(); },
      setReview(id)  { s.review[id]  = todayStr(); delete s.learned[id]; save(); },
      clearMark(id)  { delete s.learned[id]; delete s.review[id]; save(); },
      all: () => s,
      milestoneJust() {
        const ms = [3, 7, 14, 21, 30, 50, 100];
        if (ms.includes(s.streak) && lastStreakBump < s.streak) { lastStreakBump = s.streak; return s.streak; }
        return 0;
      },
      deckProgress(deck) {
        const ids = deck.slides.filter(x => x.id).map(x => x.id);
        if (!ids.length) return { learned: 0, total: 0 };
        return { learned: ids.filter(id => s.learned[id]).length, total: ids.length };
      },
    };
  })();

  /* ---------- Klein-Hilfen: Illustration, Callout, Highlight, TTS ---------- */
  function illustrationFor(slide) {
    const txt = ((slide.title || '') + ' ' + (slide.summary || '') + ' ' + (slide.tags || []).join(' ')).toLowerCase();
    const MAP = [
      { re: /versicher|haftpflicht|1\.000\.000|250\.000/, ic: 'fa-shield-halved', emoji: '€', col: '#22c55e' },
      { re: /ausweis|kennzeichnung|schild/, ic: 'fa-id-badge', emoji: 'ID', col: '#38bdf8' },
      { re: /register|bewacherreg|datei/, ic: 'fa-clipboard-list', emoji: '📋', col: '#a855f7' },
      { re: /schweige|geheim/, ic: 'fa-user-secret', emoji: '🤐', col: '#64748b' },
      { re: /waffe|munition|gewehr/, ic: 'fa-gun', emoji: '⚠', col: '#ef4444' },
      { re: /hund/, ic: 'fa-dog', emoji: '🐕', col: '#fbbf24' },
      { re: /datenschutz|dsgvo/, ic: 'fa-lock', emoji: '🔒', col: '#22d3ee' },
      { re: /notwehr|nothilfe/, ic: 'fa-hand-fist', emoji: '✊', col: '#f97316' },
      { re: /jedermann/, ic: 'fa-hand', emoji: '✋', col: '#22d3ee' },
      { re: /erste hilfe|ersthelf|unfall/, ic: 'fa-kit-medical', emoji: '✚', col: '#ef4444' },
      { re: /prüf|sachkund|unterricht/, ic: 'fa-graduation-cap', emoji: '🎓', col: '#fbbf24' },
      { re: /dienstanweisung|schriftform|antrag|formular/, ic: 'fa-file-signature', emoji: '✍', col: '#a855f7' },
      { re: /uniform|kleidung/, ic: 'fa-shirt', emoji: '👔', col: '#38bdf8' },
      { re: /kritis|bsi|cyber|nis-?2|sektor/, ic: 'fa-server', emoji: '🛡', col: '#ef4444' },
      { re: /notruf|nsl|leitstelle/, ic: 'fa-phone', emoji: '📞', col: '#22c55e' },
      { re: /40\s*h|stunde|stunden|monat|jahre|tage|inkraft/, ic: 'fa-clock', emoji: '⏱', col: '#fbbf24' },
      { re: /eigentum|hausrecht|besitz/, ic: 'fa-house', emoji: '🏠', col: '#22c55e' },
      { re: /strafe|bußgeld|haft|geldstrafe|owig/, ic: 'fa-gavel', emoji: '⚖', col: '#ef4444' },
      { re: /diebstahl|raub|einbruch/, ic: 'fa-user-ninja', emoji: '🥷', col: '#ef4444' },
      { re: /alarm|melder|einbruchmelde/, ic: 'fa-bell', emoji: '🔔', col: '#fbbf24' },
      { re: /perimeter|zaun|tor/, ic: 'fa-border-all', emoji: '🚧', col: '#22c55e' },
      { re: /buchführung|aufbewahr/, ic: 'fa-book-open', emoji: '📖', col: '#a855f7' },
    ];
    for (const m of MAP) if (m.re.test(txt)) return m;
    return { ic: 'fa-section', emoji: '§', col: slide.accent || '#22d3ee' };
  }

  function extractCallout(text) {
    if (!text) return null;
    const re = /\b\d[\d.]*\s*(?:€|EUR|Euro|Minuten?|Min\.?|Std\.?|h|Stunden?|Monate?|Jahre?|Jahren|Tage?n?|%|Prozent|Mio\.?)\b/i;
    const m = text.match(re); if (!m) return null;
    return m[0];
  }

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function spotlightHTML(text, tags) {
    if (!text) return '';
    let out = (window.U && U.escapeHtml) ? U.escapeHtml(text) : String(text);
    const words = new Set();
    (tags || []).forEach(t => {
      String(t).split(/[\s,/]+/).forEach(w => { if (w && w.length > 3) words.add(w); });
    });
    Array.from(words).sort((a, b) => b.length - a.length).forEach(w => {
      const re = new RegExp('(?<![\\wäöüÄÖÜß])(' + escapeRe(w) + ')', 'gi');
      out = out.replace(re, '<mark class="pp-mark">$1</mark>');
    });
    return out;
  }

  let _speaking = false, _speakUtt = null;
  function ttsToggle(text, btn) {
    if (!('speechSynthesis' in window)) return;
    if (_speaking) { window.speechSynthesis.cancel(); _speaking = false; if (btn) btn.classList.remove('on'); return; }
    const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE'; u.rate = 1.0; u.pitch = 1.0;
    u.onend = () => { _speaking = false; if (btn) btn.classList.remove('on'); };
    u.onerror = u.onend;
    _speakUtt = u; _speaking = true; if (btn) btn.classList.add('on');
    window.speechSynthesis.speak(u);
  }
  function ttsStop() { if (_speaking) { window.speechSynthesis.cancel(); _speaking = false; } }

  /* Pulsierende Mini-Illustration für jede §-Folie. */
  function illustrationCanvas(info, accent) {
    const W = 220, H = 220, c = el('canvas', { class: 'pp-illu-c', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0;
    function draw() {
      t += 0.04;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      // Rotierender Ring
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.5);
      ctx.strokeStyle = info.col; ctx.lineWidth = 2;
      ctx.setLineDash([6, 7]); ctx.beginPath(); ctx.arc(0, 0, 95, 0, 7); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      // Glühen
      ctx.save(); ctx.translate(cx, cy);
      const g = ctx.createRadialGradient(0, 0, 5, 0, 0, 80);
      g.addColorStop(0, info.col + 'cc'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 80, 0, 7); ctx.fill();
      ctx.restore();
      // Kreis
      const pulse = 1 + Math.sin(t * 2) * 0.04;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(pulse, pulse);
      ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.fill();
      ctx.strokeStyle = info.col; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = info.col; ctx.font = '900 56px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(info.emoji || '§', 0, 6);
      ctx.restore();
    }
    function f() { if (!c.isConnected) return; draw(); requestAnimationFrame(f); }
    requestAnimationFrame(f);
    return c;
  }

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

  /* Typewriter: schreibt den Originaltext zeichenweise nach. */
  function typewriter(node, dur) {
    if (!node) return;
    const text = node.dataset.tw || node.textContent;
    node.dataset.tw = text; node.classList.add('pp-tw');
    const N = text.length, D = dur || Math.max(450, Math.min(1300, N * 30));
    node.textContent = '';
    const start = performance.now();
    function tick(now) {
      if (!node.isConnected) return;
      const k = Math.min(1, (now - start) / D);
      const i = Math.floor(k * N);
      node.textContent = text.slice(0, i);
      if (k < 1) requestAnimationFrame(tick); else { node.textContent = text; node.classList.add('pp-tw-done'); }
    }
    requestAnimationFrame(tick);
  }

  /* Maus-Parallax: bewegt alle Elemente mit Klasse .pp-px im Wirkungsbereich. */
  function attachParallax(scope) {
    function onMove(e) {
      const r = scope.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      scope.querySelectorAll('.pp-px').forEach(n => {
        const d = +(n.dataset.px || 12);
        n.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
      });
    }
    function onLeave() { scope.querySelectorAll('.pp-px').forEach(n => n.style.transform = ''); }
    scope.addEventListener('mousemove', onMove);
    scope.addEventListener('mouseleave', onLeave);
  }

  /* Click-Ripple direkt auf der Folie. */
  function attachRipple(scope) {
    scope.addEventListener('click', e => {
      if (e.target.closest('button, a, input, .pp-card, .pp-toc-row')) return;
      const r = scope.getBoundingClientRect();
      const rip = el('span', { class: 'pp-ripple' });
      rip.style.left = (e.clientX - r.left) + 'px';
      rip.style.top = (e.clientY - r.top) + 'px';
      scope.appendChild(rip);
      setTimeout(() => rip.remove(), 720);
    });
  }

  /* Sparkles auf Cover/Outro – kleine schwebende Lichtpunkte. */
  function addSparkles(slide, accent) {
    const layer = el('div', { class: 'pp-sparkles' });
    for (let i = 0; i < 22; i++) {
      const s = el('span', { class: 'pp-sparkle' });
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.background = i % 3 === 0 ? '#22d3ee' : (i % 5 === 0 ? '#a855f7' : accent);
      s.style.animationDelay = (Math.random() * 4) + 's';
      s.style.animationDuration = (3 + Math.random() * 4) + 's';
      s.style.opacity = (0.4 + Math.random() * 0.6);
      layer.appendChild(s);
    }
    slide.appendChild(layer);
  }

  /* Feuerwerks-Loop für die Schlussfolie. */
  function startFireworks(stage) {
    const c = el('canvas', { class: 'pp-fw' }); stage.appendChild(c);
    const ctx = c.getContext('2d');
    function fit() { c.width = stage.clientWidth; c.height = stage.clientHeight; }
    fit();
    const COLORS = ['#22d3ee', '#fbbf24', '#a855f7', '#22c55e', '#ef4444', '#38bdf8', '#f97316'];
    const parts = [];
    let lastBurst = 0;
    function burst() {
      const cx = c.width * (0.15 + Math.random() * 0.7), cy = c.height * (0.2 + Math.random() * 0.4);
      const col = COLORS[(Math.random() * COLORS.length) | 0];
      const N = 70 + Math.random() * 40;
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2, v = Math.random() * 4 + 2.5;
        parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.05, col, life: 0, max: 70 + Math.random() * 50, r: Math.random() * 2.4 + 1.2 });
      }
      ping(700 + Math.random() * 400, 0.18, 'sine');
    }
    let raf = 0, last = performance.now();
    function tick(now) {
      if (!c.isConnected) return;
      if (now - lastBurst > (700 + Math.random() * 800)) { burst(); lastBurst = now; }
      ctx.fillStyle = 'rgba(6,10,19,0.18)'; ctx.fillRect(0, 0, c.width, c.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life++;
        const a = 1 - p.life / p.max;
        if (a <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = a; ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    burst(); raf = requestAnimationFrame(tick);
    return () => { c.remove(); cancelAnimationFrame(raf); };
  }

  /* Übergangsklasse je Folientyp – sorgt für Abwechslung. */
  function transitionFor(type, dir) {
    if (type === 'cover' || type === 'outro' || type === 'stats') return 'pp-fx-zoom';
    if (type === 'section' || type === 'quiz') return 'pp-fx-flip';
    if (type === 'visual') return 'pp-fx-fade';
    if (type === 'compare' || type === 'toc') return 'pp-fx-rise';
    if (type === 'wave') return 'pp-fx-rise';
    return dir < 0 ? 'pp-from-left' : 'pp-from-right';
  }

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
          id: g.id + '/' + (p.p || '').replace(/\s+/g, ''),
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
    decks.push(wavesDeck()); // „Wellen einfach erklärt" zuerst
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
      slide.appendChild(el('div', { class: 'pp-cover-ico pp-px', dataset: { px: '18' }, html: `<i class="fas ${s.icon || 'fa-file-lines'}"></i>` }));
      slide.appendChild(el('div', { class: 'pp-kicker pp-px', dataset: { px: '6' }, text: s.kicker || '' }));
      slide.appendChild(el('h1', { class: 'pp-cover-title pp-px', dataset: { px: '14' }, text: s.title }));
      if (s.subtitle) slide.appendChild(el('div', { class: 'pp-cover-sub pp-px', dataset: { px: '10' }, text: s.subtitle }));
      if (s.lead) slide.appendChild(el('p', { class: 'pp-lead pp-px', dataset: { px: '5' }, text: s.lead }));
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
    if (s.type === 'wave') return renderWaveSlide(s);
    // content
    const top = el('div', { class: 'pp-top' });
    top.appendChild(el('span', { class: 'pp-kicker', text: s.kicker || '' }));
    const flags = el('div', { class: 'pp-flags' });
    if (s.wichtig) flags.appendChild(el('span', { class: 'pp-flag pp-flag-star', html: '<i class="fas fa-star"></i> WICHTIG' }));
    if (s.jedermann) flags.appendChild(el('span', { class: 'pp-flag pp-flag-hand', html: '<i class="fas fa-hand"></i> JEDERMANNSRECHT' }));
    if (s.id && PR_STATE.learned(s.id)) flags.appendChild(el('span', { class: 'pp-flag pp-flag-ok', html: '<i class="fas fa-check"></i> GELERNT' }));
    else if (s.id && PR_STATE.review(s.id)) flags.appendChild(el('span', { class: 'pp-flag pp-flag-todo', html: '<i class="fas fa-rotate"></i> WIEDERHOLEN' }));
    top.appendChild(flags);
    slide.appendChild(top);

    const head = el('div', { class: 'pp-head' });
    if (s.badge) head.appendChild(el('span', { class: 'pp-badge', text: s.badge }));
    head.appendChild(el('h2', { class: 'pp-title', text: s.title || '' }));
    slide.appendChild(head);

    // Illustration + Summary nebeneinander; Mega-Zahl als Callout
    const info = illustrationFor(s);
    const callout = extractCallout(s.summary);
    const body = el('div', { class: 'pp-body' });
    const left = el('div', { class: 'pp-illu pp-px', dataset: { px: '14' } });
    left.appendChild(illustrationCanvas(info, s.accent));
    if (callout) left.appendChild(el('div', { class: 'pp-callout pp-num', dataset: { target: callout }, text: callout }));
    body.appendChild(left);
    const right = el('div', { class: 'pp-body-r' });
    if (s.summary) right.appendChild(el('p', { class: 'pp-summary', html: spotlightHTML(s.summary, s.tags) }));
    body.appendChild(right);
    slide.appendChild(body);

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

  /* ---------- Mini-Animationen für „Wellen einfach erklärt" ---------- */
  function lightAnim() {
    const W = 560, H = 220, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0;
    function draw() {
      t += 0.03;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const on = Math.floor(t) % 2 === 0;
      const cx = W / 2, cy = H / 2 + 10, r = 56;
      if (on) { ctx.save(); ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 50; ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.restore(); }
      else { ctx.fillStyle = '#16202f'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.fillStyle = on ? '#fbbf24' : '#64748b';
      ctx.font = '900 64px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(on ? '1' : '0', cx, cy + 22);
      ctx.fillStyle = '#94a3b8'; ctx.font = '700 18px sans-serif';
      ctx.fillText(on ? 'AN  =  Strom da  =  1' : 'AUS  =  kein Strom  =  0', cx, H - 18);
    }
    loop(c, draw); return c;
  }
  function pipelineAnim() {
    const W = 600, H = 230, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0;
    const bin = '01001000'; // H
    function draw() {
      t += 0.02;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center'; ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif';
      ctx.fillText('Buchstabe', 70, 30); ctx.fillText('Zahl (ASCII)', W / 2, 30); ctx.fillText('Bits (Schalter)', W - 80, 30);
      // Buchstabe
      ctx.fillStyle = '#e8edf7'; ctx.font = '900 56px monospace'; ctx.fillText('H', 70, 100);
      // Zahl
      ctx.fillStyle = '#fbbf24'; ctx.font = '900 44px monospace'; ctx.fillText('72', W / 2, 95);
      // Pfeile
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(110, 85); ctx.lineTo(W / 2 - 60, 85); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 + 60, 85); ctx.lineTo(W - 130, 85); ctx.stroke();
      ctx.fillStyle = '#475569'; ctx.font = '20px sans-serif'; ctx.fillText('→', W / 2 - 50, 92); ctx.fillText('→', W - 122, 92);
      // Bits (laufendes Highlight)
      const i = Math.floor(t * 4) % 8;
      for (let k = 0; k < 8; k++) {
        const x = W - 168 + k * 22, on = k === i;
        ctx.fillStyle = on ? '#22d3ee' : (bin[k] === '1' ? '#fbbf24' : '#475569');
        ctx.font = '900 22px monospace'; ctx.fillText(bin[k], x, 105);
      }
      ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif';
      ctx.fillText("z. B. 'H' = 72 = 01001000", W / 2, 175);
    }
    loop(c, draw); return c;
  }
  function streamAnim() {
    const W = 620, H = 220, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    const bits = [1, 0, 1, 1, 0, 0, 1, 0];
    let pos = 0;
    function draw() {
      pos += 0.015; if (pos >= bits.length + 0.5) pos = 0;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Sender / Empfänger Boxen
      ctx.fillStyle = '#16202f'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.fillRect(20, 70, 70, 70); ctx.strokeRect(20, 70, 70, 70);
      ctx.fillRect(W - 90, 70, 70, 70); ctx.strokeRect(W - 90, 70, 70, 70);
      ctx.fillStyle = '#94a3b8'; ctx.font = '34px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('📤', 55, 116); ctx.fillText('📥', W - 55, 116);
      // Kabel
      ctx.strokeStyle = '#3a3320'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(90, 105); ctx.lineTo(W - 90, 105); ctx.stroke();
      ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(90, 105); ctx.lineTo(W - 90, 105); ctx.stroke();
      // Wanderpuls
      const bi = Math.floor(pos), frac = pos - bi;
      if (bi < bits.length) {
        const x = 90 + (W - 180) * frac, cur = bits[bi];
        if (cur === 1) { ctx.save(); ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 22; ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(x, 105, 11, 0, 7); ctx.fill(); ctx.restore(); }
        else { ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, 105, 8, 0, 7); ctx.stroke(); }
        ctx.fillStyle = cur ? '#fbbf24' : '#64748b'; ctx.font = '900 20px monospace'; ctx.textAlign = 'center';
        ctx.fillText(cur ? '1' : '0', x, 80);
      }
      // Beschriftung
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sender', 55, 162); ctx.fillText('Empfänger', W - 55, 162);
      ctx.fillStyle = '#64748b'; ctx.font = '13px sans-serif';
      ctx.fillText('1 = Blitz   ·   0 = nichts', W / 2, 192);
    }
    loop(c, draw); return c;
  }
  function ropeWaveAnim() {
    const W = 620, H = 230, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0;
    function draw() {
      t += 0.08;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Hand links
      ctx.font = '40px sans-serif'; ctx.textAlign = 'center';
      const hy = H / 2 + Math.sin(t) * 50; ctx.fillText('✋', 40, hy);
      // Seil (Sinuswelle, an Hand befestigt)
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = 60; x <= W - 30; x += 2) {
        const k = (x - 60) / (W - 90);
        const amp = 50 * (1 - k * 0.4);
        const y = H / 2 + Math.sin((x - 60) * 0.06 - t) * amp * (1 - Math.exp(-k * 5));
        x === 60 ? ctx.moveTo(60, hy) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Beschriftung
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Eine Welle ist Bewegung, die sich fortpflanzt –', 40, 30);
      ctx.fillText('wie wenn du an einem Seil rüttelst.', 40, 48);
    }
    loop(c, draw); return c;
  }
  function emFieldsAnim() {
    const W = 620, H = 230, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0;
    function draw() {
      t += 0.05;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const x0 = 50, x1 = W - 30, y0 = H / 2 + 6, A = 56;
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      // E-Feld rot
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = x0; x <= x1; x += 2) { const y = y0 - Math.sin((x - x0) * 0.06 - t) * A; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      // B-Feld blau (perspektivisch versetzt)
      ctx.strokeStyle = 'rgba(56,189,248,0.85)'; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = x0; x <= x1; x += 2) {
        const s = Math.sin((x - x0) * 0.06 - t) * A * 0.55;
        ctx.lineTo(x + s * 0.1, y0 + s * 0.55);
      }
      ctx.stroke();
      ctx.fillStyle = '#f87171'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('— elektrisch (wackelt rot)', x0, 26);
      ctx.fillStyle = '#38bdf8'; ctx.fillText('— magnetisch (wackelt blau)', x0 + 190, 26);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.fillText('beide schwingen im Takt – das ist die Welle', x0, H - 20);
    }
    loop(c, draw); return c;
  }
  function freqAnim() {
    const W = 620, H = 230, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0;
    function draw() {
      t += 0.05;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const xs = 40, xe = W - 30;
      // Langsame Welle (lang)
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = xs; x <= xe; x += 2) { const y = 70 - Math.sin((x - xs) * 0.025 - t) * 22; x === xs ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = '#22c55e'; ctx.font = '900 14px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('langsam = lange Welle', xs, 30);
      // Mittlere Welle
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = xs; x <= xe; x += 2) { const y = 130 - Math.sin((x - xs) * 0.08 - t * 2) * 18; x === xs ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = '#fbbf24'; ctx.fillText('mittel', xs, 100);
      // Schnelle Welle (kurz)
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.beginPath();
      for (let x = xs; x <= xe; x += 2) { const y = 195 - Math.sin((x - xs) * 0.22 - t * 4) * 16; x === xs ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.fillText('schnell = kurze Welle', xs, 165);
    }
    loop(c, draw); return c;
  }
  function modAnim() {
    const W = 620, H = 230, c = el('canvas', { class: 'pp-canvas', width: W, height: H }), ctx = c.getContext('2d');
    const bits = [1, 0, 1, 1, 0, 1, 0, 0];
    let t = 0;
    function draw() {
      t += 0.07;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      const xs = 50, xe = W - 20, bw = (xe - xs) / bits.length;
      // Bit-Reihe
      ctx.textAlign = 'center';
      for (let i = 0; i < bits.length; i++) {
        ctx.fillStyle = bits[i] ? '#fbbf24' : '#475569'; ctx.font = '900 18px monospace';
        ctx.fillText(bits[i], xs + i * bw + bw / 2, 38);
        ctx.strokeStyle = '#13203a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xs + i * bw, 50); ctx.lineTo(xs + i * bw, 200); ctx.stroke();
      }
      // ASK-Welle
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2.5; ctx.beginPath(); let st = false;
      for (let x = xs; x <= xe; x += 1.5) {
        const i = Math.min(bits.length - 1, Math.floor((x - xs) / bw));
        const amp = bits[i] ? 40 : 0;
        const y = 130 - Math.sin((x - xs) * 0.28 - t * 3) * amp;
        st ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), st = true);
      }
      ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('1 = Welle sendet · 0 = Welle ist aus', xs, H - 16);
    }
    loop(c, draw); return c;
  }

  /* Folientyp „wave": eine schöne Folie mit Mini-Animation, Vergleich und Schritten. */
  function renderWaveSlide(s) {
    const slide = el('div', { class: 'pp-slide pp-wave', style: `--a:${s.accent}` });
    slide.appendChild(el('div', { class: 'pp-kicker', text: s.kicker || '' }));
    const head = el('div', { class: 'pp-head' });
    if (s.badge) head.appendChild(el('span', { class: 'pp-badge', text: s.badge }));
    head.appendChild(el('h2', { class: 'pp-title', text: s.title || '' }));
    slide.appendChild(head);
    if (s.lead) slide.appendChild(el('p', { class: 'pp-summary', text: s.lead }));
    if (s.anim) {
      const wrap = el('div', { class: 'pp-anim' });
      const made = s.anim();
      wrap.appendChild(made);
      slide.appendChild(wrap);
    }
    if (s.like) slide.appendChild(el('div', { class: 'pp-box pp-box-merk pp-like' }, [
      el('span', { class: 'pp-box-l', html: '<i class="fas fa-equals"></i> So wie:' }),
      el('span', { class: 'pp-box-v', text: s.like }),
    ]));
    if (s.steps && s.steps.length) {
      const list = el('div', { class: 'pp-steps' });
      s.steps.forEach((stp, i) => list.appendChild(
        el('div', { class: 'pp-step' }, [
          el('span', { class: 'pp-step-n', text: String(i + 1) }),
          el('span', { class: 'pp-step-t', text: stp }),
        ])
      ));
      slide.appendChild(list);
    }
    if (s.note) slide.appendChild(el('div', { class: 'pp-box pp-box-beispiel' }, [
      el('span', { class: 'pp-box-l', html: '<i class="fas fa-lightbulb"></i> Merken' }),
      el('span', { class: 'pp-box-v', text: s.note }),
    ]));
    return slide;
  }

  /* Eigenes Deck „Wellen einfach erklärt". */
  function wavesDeck() {
    const A = '#22d3ee';
    const slides = [
      { type: 'cover', accent: A, icon: 'fa-satellite-dish', kicker: 'Einfach erklärt',
        title: 'Wellen & Signale',
        subtitle: 'Vom Lichtschalter bis zur Funkwelle',
        lead: 'In 7 großen Folien: was ein Bit ist, wie es durchs Kabel reist und wie es als Welle fliegt.',
        count: '7 Folien' },
      { type: 'wave', accent: A, kicker: 'Schritt 1', badge: '1', title: 'Ein Bit ist ein Lichtschalter',
        lead: 'Ein Bit kann nur zwei Sachen: AN oder AUS. Mehr nicht.',
        anim: lightAnim,
        like: 'ein Lichtschalter an der Wand. Drück ihn rauf = 1, drück ihn runter = 0.',
        steps: ['1 bedeutet: Strom da – Licht an', '0 bedeutet: kein Strom – Licht aus', 'Ganze Wörter sind viele Schalter hintereinander'] },
      { type: 'wave', accent: A, kicker: 'Schritt 2', badge: '2', title: 'Buchstabe → Zahl → 8 Schalter',
        lead: 'Im Computer ist jeder Buchstabe eine Zahl. Die Zahl wird zu 8 Schaltern.',
        anim: pipelineAnim,
        like: 'Geheimsprache: aus „H" wird 72, und aus 72 wird 0 1 0 0 1 0 0 0.',
        steps: ['„H" → Zahl 72', '72 → 8 Schalter (01001000)', '8 Schalter = 1 Byte = 1 Buchstabe'] },
      { type: 'wave', accent: A, kicker: 'Schritt 3', badge: '3', title: 'Im Kabel: Strom-Blitze',
        lead: 'Jeder Schalter schickt einen kleinen Blitz übers Kabel. Blitz = 1, nichts = 0.',
        anim: streamAnim,
        like: 'eine Reihe von Morsezeichen, die durch einen Draht laufen.',
        steps: ['Sender schickt Bit für Bit', 'Bei 1 fließt Strom (Blitz)', 'Empfänger zählt mit und setzt zurück zum Buchstaben'],
        note: 'Genau so reden Melder, Zentrale und Bedienteil über den BUS-Draht.' },
      { type: 'wave', accent: A, kicker: 'Schritt 4', badge: '4', title: 'Was ist eine Welle?',
        lead: 'Eine Welle ist Bewegung, die sich fortpflanzt. Wir sehen sie im Wasser – bei Funk ist sie unsichtbar.',
        anim: ropeWaveAnim,
        like: 'ein Seil, an dem du rüttelst – die Bewegung läuft weiter.',
        steps: ['Du rüttelst am Anfang', 'Die Bewegung wandert nach vorn', 'So wandert auch eine Funkwelle durch die Luft'] },
      { type: 'wave', accent: A, kicker: 'Schritt 5', badge: '5', title: 'Die elektromagnetische Welle',
        lead: 'Funk besteht aus zwei Wellen gleichzeitig: einer elektrischen (rot) und einer magnetischen (blau).',
        anim: emFieldsAnim,
        like: 'zwei Tänzer Hand in Hand – einer wackelt hoch/runter, der andere vor/zurück.',
        steps: ['Beide schwingen im Takt', 'Beide sind unsichtbar', 'Sie fliegen mit Lichtgeschwindigkeit'] },
      { type: 'wave', accent: A, kicker: 'Schritt 6', badge: '6', title: 'Schnell oder langsam',
        lead: 'Eine Welle kann schnell oder langsam wackeln. Schnell = kurze Welle. Langsam = lange Welle.',
        anim: freqAnim,
        like: 'Klavier: links tiefe, lange Töne – rechts hohe, kurze.',
        steps: ['Funk-Melder: 433 Millionen Mal pro Sekunde', 'WLAN: 2,4 Milliarden Mal', 'Licht: noch viel öfter – darum sehen wir es'] },
      { type: 'wave', accent: A, kicker: 'Schritt 7', badge: '7', title: 'Bits reiten auf der Welle',
        lead: 'Die leere Welle „sagt" noch nichts. Wir lassen sie im Takt der Bits arbeiten – das nennt man Modulieren.',
        anim: modAnim,
        like: 'Taschenlampe blinken: kurz an = 1, kurz aus = 0 – nur viel schneller.',
        steps: ['Bei 1 sendet die Welle', 'Bei 0 ist Stille', 'Der Empfänger liest das Muster und kennt die Bits'],
        note: 'Einfache Funk-Türöffner machen genau das (ASK).' },
      { type: 'outro', accent: A, icon: 'fa-circle-check', kicker: 'Geschafft',
        title: 'Fertig!',
        subtitle: 'Du verstehst jetzt: Bit · Kabel · Welle',
        lead: 'Drück Esc, um zur Übersicht zurück.',
        count: '7 Folien' },
    ];
    return { id: 'waves', group: 'Wellen & Signale', title: 'Wellen einfach erklärt', sub: '7 Folien mit Animationen', accent: A, icon: 'fa-satellite-dish', count: slides.length, slides };
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

  /* ---------- „Heute lernen": Tages-Deck aus 5 §§ ---------- */
  function dailyDeck(allLawDecks) {
    // Sammelt alle Content-Slides, priorisiert WIEDERHOLEN, dann unbekannt, dann wichtig, dann jedermann.
    const allP = [];
    allLawDecks.forEach(dk => dk.slides.forEach(s => { if (s.type === 'content' && s.id) allP.push({ s, dk }); }));
    function seed() {
      const t = PR_STATE.today();
      let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
      return Math.abs(h);
    }
    function score(it) {
      let sc = 0;
      if (PR_STATE.review(it.s.id)) sc += 1000;
      if (!PR_STATE.learned(it.s.id)) sc += 500;
      if (it.s.wichtig) sc += 80;
      if (it.s.jedermann) sc += 60;
      // Tages-Pseudozufall, stabil pro Tag
      sc += (((seed() ^ hashStr(it.s.id)) >>> 0) % 100);
      return sc;
    }
    function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
    const pool = allP.slice().sort((a, b) => score(b) - score(a));
    const today = pool.slice(0, 5);
    if (!today.length) return null;
    const slides = [];
    slides.push({
      type: 'cover', accent: '#22d3ee', icon: 'fa-calendar-day', kicker: 'Heute · ' + PR_STATE.today(),
      title: 'Tagesportion', subtitle: '5 Paragraphen für heute',
      lead: 'Jeden Tag eine kleine Portion – nach Plan: erst Wiederholungen, dann neue Wichtige.',
      count: '5 §§',
    });
    today.forEach(({ s, dk }) => {
      slides.push({ ...s, kicker: dk.title + ' · ' + (s.kicker || '') });
    });
    slides.push({
      type: 'outro', accent: '#22d3ee', icon: 'fa-circle-check', kicker: 'Geschafft',
      title: 'Tagesportion erledigt', subtitle: 'Komm morgen wieder – die Serie wächst.',
      lead: 'Jeden Tag 5 §§ – nach 30 Tagen kennst du die wichtigsten 150.',
    });
    return { id: 'daily', group: '⭐ Tagesplan', title: 'Heute lernen · 5 §§', sub: PR_STATE.today(), accent: '#22d3ee', icon: 'fa-calendar-day', count: slides.length, slides };
  }

  /* ---------- Hauptansicht ---------- */
  function view(d) {
    PR_STATE.visit();
    const decks = buildDecks(d);
    const lawDecks = decks.filter(x => x.id && x.id.startsWith('law-'));
    const daily = dailyDeck(lawDecks);
    if (daily) decks.unshift(daily);
    const root = el('div', { class: 'pp-wrap' });

    function streakBanner() {
      const state = PR_STATE.all();
      const banner = el('div', { class: 'pp-streak' });
      banner.appendChild(el('div', { class: 'pp-streak-fire', html: '<i class="fas fa-fire"></i>' }));
      banner.appendChild(el('div', { class: 'pp-streak-num pp-num', dataset: { target: String(state.streak || 0) }, text: '0' }));
      banner.appendChild(el('div', { class: 'pp-streak-l' }, [
        el('strong', { text: (state.streak === 1 ? 'Tag in Folge' : 'Tage in Folge') }),
        el('span', { text: 'Insgesamt aktiv an ' + (state.totalDays || 1) + ' Tagen · ' + Object.keys(state.learned || {}).length + ' §§ als gelernt markiert' }),
      ]));
      if (daily) {
        const go = el('button', { class: 'pp-streak-go', html: '<i class="fas fa-play"></i> Heute lernen' });
        go.addEventListener('click', () => startDeck(daily));
        banner.appendChild(go);
      }
      const ms = PR_STATE.milestoneJust();
      if (ms) banner.appendChild(el('span', { class: 'pp-streak-ms', text: '🎉 ' + ms + ' Tage – stark!' }));
      return banner;
    }

    function showPicker() {
      root.innerHTML = '';
      const head = el('div', { class: 'view-head' }, [
        el('span', { class: 'crumb', text: 'Lernen · Präsentation' }),
        el('h1', { text: 'Präsentation · Tagesplan & Slideshow' }),
        el('p', { text: 'Komm jeden Tag rein – die App schlägt 5 Paragraphen vor, du markierst sie als gelernt oder zur Wiederholung. Streak wächst.' }),
      ]);
      root.appendChild(head);
      root.appendChild(streakBanner());
      const groups = {};
      decks.forEach(dk => (groups[dk.group] = groups[dk.group] || []).push(dk));
      Object.entries(groups).forEach(([gname, list]) => {
        root.appendChild(el('div', { class: 'pp-group-label', text: gname }));
        const grid = el('div', { class: 'pp-picker-grid' });
        list.forEach(dk => {
          const card = el('button', { class: 'pp-deck', type: 'button', style: `--a:${dk.accent}` });
          card.appendChild(el('div', { class: 'pp-deck-ico', html: `<i class="fas ${dk.icon}"></i>` }));
          const pr = PR_STATE.deckProgress(dk);
          const body = el('div', { class: 'pp-deck-body' }, [
            el('strong', { text: dk.title }),
            el('span', { text: dk.sub }),
            el('em', { html: `<i class="fas fa-film"></i> ${dk.count} Folien` + (pr.total ? `  ·  <i class="fas fa-check"></i> ${pr.learned}/${pr.total} gelernt` : '') }),
          ]);
          if (pr.total) {
            const bar = el('div', { class: 'pp-deck-bar' });
            bar.appendChild(el('div', { class: 'pp-deck-fill', style: 'width:' + (pr.learned / pr.total * 100).toFixed(1) + '%' }));
            body.appendChild(bar);
          }
          card.appendChild(body);
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
      const ttsBtn = el('button', { class: 'pp-btn pp-btn-icon', title: 'Vorlesen (V)', html: '<i class="fas fa-volume-low"></i>' });
      const fsBtn = el('button', { class: 'pp-btn pp-btn-icon', title: 'Vollbild (F)', html: '<i class="fas fa-expand"></i>' });
      const bar = el('div', { class: 'pp-bar' }, [
        exit,
        el('div', { class: 'pp-bar-title' }, [el('strong', { text: deck.title }), el('span', { text: deck.sub })]),
        search,
        el('div', { class: 'pp-bar-actions' }, [autoBtn, speedBtn, markerBtn, soundBtn, ttsBtn, readBtn, fsBtn]),
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

      let stopFw = null;
      function render() {
        host.innerHTML = '';
        ttsStop();
        if (stopFw) { stopFw(); stopFw = null; }
        const s = deck.slides[idx];
        const slideEl = renderSlide(s, jumpToTitle);
        slideEl.classList.add(transitionFor(s.type, lastDir));
        if (s.type === 'cover' || s.type === 'outro') slideEl.classList.add('pp-neon');
        host.appendChild(slideEl);

        // Lern-Aktionsleiste für Content-Folien mit ID
        if (s.id && s.type === 'content') {
          const learnedNow = PR_STATE.learned(s.id);
          const reviewNow = PR_STATE.review(s.id);
          const actions = el('div', { class: 'pp-learn' });
          const okBtn = el('button', { class: 'pp-learn-btn pp-learn-ok' + (learnedNow ? ' on' : ''), html: '<i class="fas fa-check"></i> <span>Gelernt</span>' });
          const reBtn = el('button', { class: 'pp-learn-btn pp-learn-re' + (reviewNow ? ' on' : ''), html: '<i class="fas fa-rotate"></i> <span>Wiederholen</span>' });
          okBtn.addEventListener('click', () => { PR_STATE.setLearned(s.id); render(); setTimeout(() => go(1), 350); });
          reBtn.addEventListener('click', () => { PR_STATE.setReview(s.id); render(); setTimeout(() => go(1), 350); });
          actions.append(okBtn, reBtn);
          slideEl.appendChild(actions);
        }

        fill.style.width = ((idx + 1) / deck.slides.length * 100) + '%';
        counter.textContent = (idx + 1) + ' / ' + deck.slides.length;
        prev.disabled = idx === 0;
        next.disabled = idx === deck.slides.length - 1;
        thumbs.forEach((t, i) => t.classList.toggle('on', i === idx));
        const onT = thumbs[idx]; if (onT) onT.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        // Anim-Effekte
        requestAnimationFrame(() => {
          animateNumbers(slideEl);
          const tw = slideEl.querySelector('.pp-cover-title, .pp-title, .pp-section-title');
          if (tw) typewriter(tw);
          attachParallax(slideEl);
          attachRipple(slideEl);
          if (s.type === 'cover' || s.type === 'outro') addSparkles(slideEl, s.accent);
        });
        setupMarkerOnce();
        if (idx === deck.slides.length - 1) {
          fxBoom(); fireConfetti(stage);
          stopFw = startFireworks(stage);
        }
      }
      function speakCurrent() {
        const s = deck.slides[idx]; if (!s) return;
        const parts = [];
        if (s.badge) parts.push(s.badge);
        if (s.title) parts.push(s.title);
        if (s.summary) parts.push(s.summary);
        if (s.beispiel) parts.push('Praxisfall: ' + s.beispiel);
        if (s.merksatz) parts.push('Merksatz: ' + s.merksatz);
        ttsToggle(parts.join('. '), ttsBtn);
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
      exit.addEventListener('click', () => { stopAuto(); ttsStop(); if (document.fullscreenElement) document.exitFullscreen(); showPicker(); });
      autoBtn.addEventListener('click', toggleAuto);
      speedBtn.addEventListener('click', bumpSpeed);
      soundBtn.addEventListener('click', toggleSound);
      markerBtn.addEventListener('click', toggleMarker);
      readBtn.addEventListener('click', showReader);
      ttsBtn.addEventListener('click', speakCurrent);
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
        else if (e.key.toLowerCase() === 'v') { speakCurrent(); }
        else if (e.key.toLowerCase() === 'g') { const s = deck.slides[idx]; if (s && s.id) { PR_STATE.setLearned(s.id); render(); go(1); } }
        else if (e.key.toLowerCase() === 'w') { const s = deck.slides[idx]; if (s && s.id) { PR_STATE.setReview(s.id); render(); go(1); } }
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
