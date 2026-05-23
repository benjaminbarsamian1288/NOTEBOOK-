/* Spiel: „Stoppe den Einbrecher" – Tower-Defense mit Sicherheitstechnik.
   Einbrecher laufen einen Pfad zum Tresor. Platziere Sensoren (Türme), die
   Erkennung aufbauen – wer rechtzeitig erfasst wird, wird gestoppt.
   window.SPIEL.view() liefert den Ansichts-Knoten. */
window.SPIEL = (() => {
  const { el } = U;

  const TYPES = {
    pir:    { name: 'PIR',    icon: 'fa-person-walking-arrow-right', range: 95,  rate: 0.85, cost: 60,  color: '#22d3ee' },
    kamera: { name: 'Kamera', icon: 'fa-video',                     range: 155, rate: 0.6,  cost: 110, color: '#7dd3fc' },
    radar:  { name: 'Radar',  icon: 'fa-satellite-dish',            range: 205, rate: 1.5,  cost: 170, color: '#22c55e' },
  };

  function view() {
    const root = el('div', { class: 'spiel-view' });
    const W = 760, H = 460;
    const canvas = el('canvas', { class: 'phys-canvas', width: W, height: H, style: 'cursor:crosshair' });
    const ctx = canvas.getContext('2d');

    const path = [
      { x: 30, y: 410 }, { x: 30, y: 130 }, { x: 250, y: 130 }, { x: 250, y: 360 },
      { x: 470, y: 360 }, { x: 470, y: 120 }, { x: 660, y: 120 }, { x: 660, y: 410 }, { x: 730, y: 410 },
    ];
    const segs = []; let totalLen = 0;
    for (let i = 0; i < path.length - 1; i++) { const a = path[i], b = path[i + 1]; const len = Math.hypot(b.x - a.x, b.y - a.y); segs.push({ a, b, len }); totalLen += len; }
    function ptAt(dist) { let d = dist; for (const s of segs) { if (d <= s.len) { const f = d / s.len; return { x: s.a.x + (s.b.x - s.a.x) * f, y: s.a.y + (s.b.y - s.a.y) * f }; } d -= s.len; } return path[path.length - 1]; }
    function distToPath(x, y) { let m = 1e9; for (const s of segs) m = Math.min(m, distSeg(x, y, s.a.x, s.a.y, s.b.x, s.b.y)); return m; }
    function distSeg(px, py, x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy; let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)); }

    const state = { money: 320, lives: 5, score: 0, wave: 0, running: false, sel: null, towers: [], intr: [], spawnQ: 0, spawnT: 0, msg: 'Türme platzieren, dann Welle starten!' };

    // ---- HUD ----
    const hud = el('div', { class: 'spiel-hud' });
    const hMoney = el('span', {}), hLives = el('span', {}), hWave = el('span', {}), hScore = el('span', {});
    hud.append(
      el('span', { class: 'sh-item' }, [el('i', { class: 'fas fa-euro-sign' }), hMoney]),
      el('span', { class: 'sh-item' }, [el('i', { class: 'fas fa-heart', style: 'color:#ef4444' }), hLives]),
      el('span', { class: 'sh-item' }, [el('i', { class: 'fas fa-wave-square' }), hWave]),
      el('span', { class: 'sh-item' }, [el('i', { class: 'fas fa-trophy', style: 'color:#fbbf24' }), hScore]),
    );

    // ---- Shop ----
    const shop = el('div', { class: 'spiel-shop' });
    const shopBtns = {};
    Object.entries(TYPES).forEach(([k, t]) => {
      const b = el('button', { class: 'spiel-tower' });
      b.innerHTML = `<i class="fas ${t.icon}"></i><span>${t.name}</span><em>${t.cost} €</em>`;
      b.addEventListener('click', () => { state.sel = state.sel === k ? null : k; updateShop(); });
      shop.appendChild(b); shopBtns[k] = b;
    });
    const startBtn = el('button', { class: 'btn primary spiel-start', html: '<i class="fas fa-play"></i> Welle starten' });
    startBtn.addEventListener('click', startWave);
    shop.appendChild(startBtn);
    function updateShop() { Object.entries(shopBtns).forEach(([k, b]) => { b.classList.toggle('sel', state.sel === k); b.classList.toggle('poor', state.money < TYPES[k].cost); }); }

    function startWave() {
      if (state.running) return;
      state.wave++; state.running = true;
      state.spawnQ = 3 + state.wave; state.spawnT = 0;
      state.msg = 'Welle ' + state.wave + ' läuft!';
      startBtn.disabled = true; startBtn.classList.add('disabled');
    }

    canvas.addEventListener('click', (e) => {
      if (!state.sel) return;
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
      const t = TYPES[state.sel];
      if (state.money < t.cost) { state.msg = 'Zu wenig Geld!'; return; }
      if (distToPath(x, y) < 26) { state.msg = 'Nicht auf den Weg bauen!'; return; }
      if (state.towers.some(tw => Math.hypot(tw.x - x, tw.y - y) < 34)) { state.msg = 'Zu nah an einem Turm!'; return; }
      state.towers.push({ x, y, type: state.sel, range: t.range, rate: t.rate, color: t.color, icon: t.icon, cool: 0 });
      state.money -= t.cost; state.msg = t.name + ' platziert.'; updateShop();
    });

    function spawn() {
      const need = 70 + state.wave * 16;
      state.intr.push({ dist: 0, speed: 0.9 + state.wave * 0.12, det: 0, need, dead: false, flash: 0 });
    }

    function draw() {
      // Spawnen
      if (state.running && state.spawnQ > 0) { state.spawnT++; if (state.spawnT > 50) { state.spawnT = 0; state.spawnQ--; spawn(); } }
      // Türme erkennen
      state.intr.forEach(it => {
        if (it.dead) return;
        it.dist += it.speed;
        const p = ptAt(it.dist);
        it.x = p.x; it.y = p.y;
        state.towers.forEach(tw => { if (Math.hypot(tw.x - it.x, tw.y - it.y) < tw.range) it.det += tw.rate; });
        if (it.det >= it.need) { it.dead = true; it.flash = 20; state.money += 30; state.score += 10 * state.wave; state.msg = '🎯 Einbrecher erfasst! +30 €'; SFX_tone(880, 0.06); }
        else if (it.dist >= totalLen) { it.dead = true; it.through = true; state.lives--; state.msg = '💥 Durchgekommen! −1 Leben'; SFX_tone(150, 0.18); }
      });
      // Welle vorbei?
      if (state.running && state.spawnQ === 0 && state.intr.every(i => i.dead)) {
        state.running = false; state.money += 60 + state.wave * 15; state.msg = 'Welle ' + state.wave + ' geschafft! +' + (60 + state.wave * 15) + ' €';
        startBtn.disabled = false; startBtn.classList.remove('disabled'); updateShop();
      }
      const gameOver = state.lives <= 0;

      // ===== Zeichnen =====
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 0, W, H);
      // Weg
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); path.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
      ctx.strokeStyle = '#0f1b2e'; ctx.lineWidth = 22; ctx.stroke();
      // Start + Tresor
      ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.arc(path[0].x, path[0].y, 16, 0, 7); ctx.fill();
      const safe = path[path.length - 1];
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(safe.x - 16, safe.y - 18, 32, 36);
      ctx.fillStyle = '#0b1424'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('💰', safe.x, safe.y + 5);
      // Türme + Reichweite
      state.towers.forEach(tw => {
        ctx.fillStyle = tw.color + '22'; ctx.beginPath(); ctx.arc(tw.x, tw.y, tw.range, 0, 7); ctx.fill();
        ctx.fillStyle = tw.color; ctx.beginPath(); ctx.arc(tw.x, tw.y, 14, 0, 7); ctx.fill();
      });
      // Auswahl-Vorschau
      if (state.sel) { ctx.strokeStyle = TYPES[state.sel].color + '88'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(mouse.x, mouse.y, TYPES[state.sel].range, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
      // Einbrecher
      state.intr.forEach(it => {
        if (it.dead) { if (it.flash > 0) { it.flash--; ctx.fillStyle = it.through ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.6)'; ctx.beginPath(); ctx.arc(it.x, it.y, 16, 0, 7); ctx.fill(); } return; }
        ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(it.x, it.y, 12, 0, 7); ctx.fill();
        ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🥷', it.x, it.y + 5);
        // Erkennungsbalken
        const pct = Math.min(1, it.det / it.need);
        ctx.fillStyle = 'rgba(15,23,42,0.8)'; ctx.fillRect(it.x - 14, it.y - 22, 28, 5);
        ctx.fillStyle = pct > 0.66 ? '#22c55e' : pct > 0.33 ? '#fbbf24' : '#ef4444'; ctx.fillRect(it.x - 14, it.y - 22, 28 * pct, 5);
      });
      // Nachricht
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(state.msg, 14, H - 14);
      if (gameOver) {
        ctx.fillStyle = 'rgba(2,6,12,0.82)'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', W / 2, H / 2 - 10);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '18px sans-serif'; ctx.fillText('Punkte: ' + state.score + ' · Welle ' + state.wave, W / 2, H / 2 + 24);
        ctx.font = '13px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.fillText('„Neu starten" für noch einen Versuch', W / 2, H / 2 + 50);
      }

      // HUD
      hMoney.textContent = state.money + ' €'; hLives.textContent = Math.max(0, state.lives); hWave.textContent = 'Welle ' + state.wave; hScore.textContent = state.score + ' Pkt';
    }

    const mouse = { x: -100, y: -100 };
    canvas.addEventListener('mousemove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * W / r.width; mouse.y = (e.clientY - r.top) * H / r.height; });

    function SFX_tone(f, d) { if (window.AudioContext && SPIEL._actx === undefined) { try { SPIEL._actx = new AudioContext(); } catch (e) { SPIEL._actx = null; } } const a = SPIEL._actx; if (!a) return; if (a.state === 'suspended') a.resume(); const o = a.createOscillator(), g = a.createGain(); o.frequency.value = f; g.gain.value = 0.05; g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + d); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + d); }

    function frame() { if (!canvas.isConnected) return; draw(); requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
    updateShop();

    const restart = el('button', { class: 'btn', html: '<i class="fas fa-rotate-left"></i> Neu starten' });
    restart.addEventListener('click', () => { Object.assign(state, { money: 320, lives: 5, score: 0, wave: 0, running: false, sel: null, towers: [], intr: [], spawnQ: 0, msg: 'Türme platzieren, dann Welle starten!' }); startBtn.disabled = false; startBtn.classList.remove('disabled'); updateShop(); });

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Spiel · Tower-Defense</span>
      <h1>Stoppe den Einbrecher 🥷</h1>
      <p class="lead">Einbrecher laufen zum Tresor 💰. Platziere Sensoren entlang des Wegs – sie bauen <b>Erkennung</b> auf.
      Wer rechtzeitig voll erfasst ist, wird gestoppt (+Geld). Kommt einer durch, kostet es ein Leben. Überlebe so viele Wellen wie möglich!</p>`;

    root.append(intro, hud, canvas, shop, restart);
    return root;
  }

  return { view };
})();
