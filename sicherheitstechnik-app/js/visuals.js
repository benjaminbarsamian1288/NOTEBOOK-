/* Interactive visualizations: coverage simulator, floor plan, animated counters */
window.VIZ = (() => {

  const { el } = U;

  // ---------- Animated counter ----------
  function animateCounter(node, to, duration=900) {
    const from = 0;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (to - from) * eased);
      node.textContent = v;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Coverage range visualizer ----------
  // Compares multiple sensors' coverage on a 20m x 14m room
  const COVERAGE_PRESETS = [
    { name: 'PIR Standard',    type: 'cone', range: 12, angle: 90,  color: '#fbbf24' },
    { name: 'PIR Vorhang',     type: 'cone', range: 20, angle: 6,   color: '#f59e0b' },
    { name: 'PIR Long Range',  type: 'cone', range: 30, angle: 25,  color: '#ef4444' },
    { name: 'PIR Decke 360°',  type: 'circle', range: 6,            color: '#22d3ee' },
    { name: 'Dualmelder',      type: 'cone', range: 15, angle: 90,  color: '#22c55e' },
    { name: 'Mikrowelle',      type: 'cone', range: 20, angle: 110, color: '#818cf8' },
    { name: 'Ultraschall',     type: 'circle', range: 5,            color: '#c084fc' },
    { name: 'IR-Lichtschranke',type: 'beam',  range: 20,            color: '#22d3ee' },
  ];

  function coverageView() {
    const root = el('div', { class: 'viz-coverage card', style: 'padding:18px' });
    root.appendChild(el('div', { class: 'card-h' }, [
      el('div', { class: 'ico', html: '<i class="fas fa-bullseye"></i>' }),
      el('h3', { text: 'Coverage-Simulator – Erfassungsbereiche im Vergleich' })
    ]));
    root.appendChild(el('p', { class: 'muted small', text: 'Wähle Sensoren – sie werden auf einem 20×14m Raum eingezeichnet. Klick zum An/Abwählen.' }));

    const chips = el('div', { class: 'filterbar' });
    const active = new Set([0, 4]); // PIR Standard, Dualmelder
    COVERAGE_PRESETS.forEach((p, i) => {
      const c = el('button', { class: 'chip' + (active.has(i) ? ' active' : ''), text: p.name });
      c.style.borderLeftColor = p.color;
      c.addEventListener('click', () => {
        if (active.has(i)) active.delete(i); else active.add(i);
        c.classList.toggle('active');
        draw();
      });
      chips.appendChild(c);
    });
    root.appendChild(chips);

    const cv = el('canvas', { width: '900', height: '440', class: 'viz-canvas' });
    root.appendChild(cv);

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const W = cv.parentElement.clientWidth - 36;
      const H = 360;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      const ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.clearRect(0,0,W,H);
      // Room: 20m x 14m -> scale to canvas
      const roomW_m = 20, roomH_m = 14;
      const scale = Math.min((W-60)/roomW_m, (H-60)/roomH_m);
      const ox = (W - roomW_m*scale)/2, oy = 20;
      // Draw room
      ctx.fillStyle = 'rgba(56,189,248,.04)';
      ctx.strokeStyle = getCss('--border');
      ctx.lineWidth = 2;
      ctx.fillRect(ox, oy, roomW_m*scale, roomH_m*scale);
      ctx.strokeRect(ox, oy, roomW_m*scale, roomH_m*scale);
      // Grid 1m
      ctx.strokeStyle = 'rgba(148,163,196,.10)';
      ctx.lineWidth = 1;
      for (let x = 1; x < roomW_m; x++) {
        ctx.beginPath(); ctx.moveTo(ox+x*scale, oy); ctx.lineTo(ox+x*scale, oy+roomH_m*scale); ctx.stroke();
      }
      for (let y = 1; y < roomH_m; y++) {
        ctx.beginPath(); ctx.moveTo(ox, oy+y*scale); ctx.lineTo(ox+roomW_m*scale, oy+y*scale); ctx.stroke();
      }
      // Scale label
      ctx.fillStyle = getCss('--text-dim');
      ctx.font = '11px system-ui';
      ctx.fillText('20 m', ox + roomW_m*scale - 28, oy - 6);
      ctx.fillText('14 m', ox + 4, oy + roomH_m*scale + 14);

      // Sensor positions (corners/center)
      const positions = [
        { x: 0, y: 0, dir: 0 },           // top-left corner facing right-down
        { x: roomW_m, y: 0, dir: Math.PI }, // top-right
        { x: 0, y: roomH_m, dir: 0 },     // bottom-left
        { x: roomW_m, y: roomH_m, dir: Math.PI },
        { x: roomW_m/2, y: 0, dir: Math.PI/2 },
        { x: roomW_m/2, y: roomH_m/2, dir: 0 }, // center for ceiling
        { x: 0, y: roomH_m/2, dir: 0 },
        { x: 0, y: roomH_m/2, dir: 0 },
      ];

      let n = 0;
      Array.from(active).sort().forEach(idx => {
        const p = COVERAGE_PRESETS[idx];
        const pos = positions[n % positions.length];
        n++;
        const sx = ox + pos.x*scale, sy = oy + pos.y*scale;
        // Coverage shape clipped to room
        ctx.save();
        ctx.beginPath();
        ctx.rect(ox, oy, roomW_m*scale, roomH_m*scale);
        ctx.clip();
        ctx.globalAlpha = .35;
        ctx.fillStyle = p.color;
        if (p.type === 'cone') {
          const half = (p.angle/2) * Math.PI/180;
          const dir = pos.dir + (pos.x===roomW_m/2 ? Math.PI/2 : (pos.x===0 ? -Math.PI/4 : Math.PI + Math.PI/4));
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.arc(sx, sy, p.range*scale, dir-half, dir+half);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = .8;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(sx, sy, p.range*scale, 0, Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = .8;
          ctx.stroke();
        } else if (p.type === 'beam') {
          ctx.fillRect(sx, sy-3, Math.min(p.range, roomW_m)*scale, 6);
          ctx.strokeStyle = p.color;
          ctx.strokeRect(sx, sy-3, Math.min(p.range, roomW_m)*scale, 6);
        }
        ctx.restore();
        // Sensor dot
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#0b1424';
        ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI*2); ctx.fill();
      });

      // Legend
      let legY = H - 32;
      let legX = 14;
      ctx.font = '12px system-ui';
      Array.from(active).sort().forEach(idx => {
        const p = COVERAGE_PRESETS[idx];
        ctx.fillStyle = p.color;
        ctx.fillRect(legX, legY+1, 14, 12);
        ctx.fillStyle = getCss('--text');
        const lbl = `${p.name} · ${p.range}m${p.type==='cone' ? ` · ${p.angle}°` : ''}`;
        ctx.fillText(lbl, legX + 20, legY + 11);
        legX += ctx.measureText(lbl).width + 60;
        if (legX > W - 200) { legX = 14; legY += 18; }
      });
    }

    function getCss(v) {
      return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    }

    requestAnimationFrame(draw);
    window.addEventListener('resize', draw);
    return { root, draw };
  }

  // ---------- Floor plan simulator ----------
  // Drag sensor icons onto a floor plan, see coverage
  function floorPlan() {
    const root = el('div', { class: 'card', style: 'padding:18px' });
    root.appendChild(el('div', { class: 'card-h' }, [
      el('div', { class: 'ico', html: '<i class="fas fa-vector-square"></i>' }),
      el('h3', { text: 'Floor-Plan-Simulator – Sensoren platzieren' })
    ]));
    root.appendChild(el('p', { class: 'muted small', text: 'Klick auf ein Sensor-Icon, dann auf den Grundriss zum Platzieren. Rechtsklick zum Entfernen.' }));

    const SENSORS = [
      { id:'pir',  label:'PIR',         color:'#fbbf24', range:6,  angle:90,  type:'cone',   icon:'fa-eye' },
      { id:'dual', label:'Dual',        color:'#22c55e', range:7,  angle:90,  type:'cone',   icon:'fa-shield-halved' },
      { id:'mag',  label:'Magnet',      color:'#c084fc', range:0.5, type:'circle', icon:'fa-magnet' },
      { id:'glass',label:'Glasbruch',   color:'#38bdf8', range:6,  type:'circle', icon:'fa-window-maximize' },
      { id:'fire', label:'Rauch',       color:'#ef4444', range:5,  type:'circle', icon:'fa-fire' },
      { id:'cam',  label:'Kamera',      color:'#a3e635', range:10, angle:70,  type:'cone',   icon:'fa-video' },
    ];

    const toolbar = el('div', { class: 'filterbar' });
    let selected = SENSORS[0];
    SENSORS.forEach(s => {
      const c = el('button', { class: 'chip'+(s.id===selected.id?' active':''), html: `<i class="fas ${s.icon}"></i> ${s.label}` });
      c.style.color = s.color;
      c.addEventListener('click', () => {
        selected = s;
        toolbar.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      });
      toolbar.appendChild(c);
    });
    const clearBtn = el('button', { class: 'btn ghost', html: '<i class="fas fa-trash"></i> Alles löschen' });
    toolbar.appendChild(clearBtn);
    root.appendChild(toolbar);

    const cv = el('canvas', { width: '900', height: '480', style: 'cursor:crosshair; max-width:100%;' });
    root.appendChild(cv);

    // Floor plan rooms (rough house plan in 16x10 meters)
    const ROOMS = [
      { x: 0,    y: 0,    w: 6,  h: 5,  name: 'Wohnen' },
      { x: 6,    y: 0,    w: 5,  h: 5,  name: 'Küche' },
      { x: 11,   y: 0,    w: 5,  h: 5,  name: 'Bad' },
      { x: 0,    y: 5,    w: 4,  h: 5,  name: 'Schlaf' },
      { x: 4,    y: 5,    w: 4,  h: 5,  name: 'Flur' },
      { x: 8,    y: 5,    w: 4,  h: 5,  name: 'Kind' },
      { x: 12,   y: 5,    w: 4,  h: 5,  name: 'Büro' },
    ];
    // Doors / Windows
    const OPENINGS = [
      { type:'door',   x: 4,   y: 5,   d:'h', length: .8 },
      { type:'door',   x: 8,   y: 5,   d:'h', length: .8 },
      { type:'door',   x: 6,   y: 5,   d:'h', length: .8 },
      { type:'door',   x: 12,  y: 5,   d:'h', length: .8 },
      { type:'window', x: 0,   y: 1.5, d:'v', length: 1.5 },
      { type:'window', x: 0,   y: 7.5, d:'v', length: 1.5 },
      { type:'window', x: 16,  y: 7.5, d:'v', length: 1.5 },
      { type:'window', x: 3,   y: 0,   d:'h', length: 1.5 },
      { type:'window', x: 12,  y: 0,   d:'h', length: 1.5 },
    ];

    let placed = []; // {x,y, sensor, dir}
    let hover = null;
    let scale, ox, oy;

    function fit() {
      const W = cv.parentElement.clientWidth - 36;
      const H = 480;
      const dpr = window.devicePixelRatio || 1;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      scale = Math.min((W-30)/16, (H-30)/10);
      ox = (W - 16*scale)/2; oy = 15;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return ctx;
    }

    function draw() {
      const ctx = fit();
      const W = cv.parentElement.clientWidth - 36;
      ctx.clearRect(0, 0, W, 480);
      // Rooms
      ctx.lineJoin = 'round';
      ROOMS.forEach(r => {
        const x = ox + r.x*scale, y = oy + r.y*scale, w = r.w*scale, h = r.h*scale;
        ctx.fillStyle = 'rgba(56,189,248,.04)';
        ctx.fillRect(x,y,w,h);
        ctx.strokeStyle = getCss('--border');
        ctx.lineWidth = 2;
        ctx.strokeRect(x,y,w,h);
        ctx.fillStyle = getCss('--text-dim');
        ctx.font = '11px system-ui';
        ctx.fillText(r.name, x+4, y+14);
      });
      // Openings
      OPENINGS.forEach(o => {
        const x = ox + o.x*scale, y = oy + o.y*scale;
        ctx.strokeStyle = o.type==='door' ? '#fbbf24' : '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (o.d==='h') { ctx.moveTo(x,y); ctx.lineTo(x+o.length*scale, y); }
        else { ctx.moveTo(x,y); ctx.lineTo(x, y+o.length*scale); }
        ctx.stroke();
      });
      // Placed sensors coverage
      placed.forEach(p => drawCoverage(ctx, p));
      // Hover preview
      if (hover) drawCoverage(ctx, { x: hover.x, y: hover.y, sensor: selected, dir: 0 }, true);

      // Stats
      const total = placed.length;
      const byType = {};
      placed.forEach(p => byType[p.sensor.id] = (byType[p.sensor.id]||0)+1);
      ctx.fillStyle = getCss('--text');
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`${total} Sensoren platziert`, 14, 470);
    }

    function drawCoverage(ctx, p, isPreview) {
      const x = ox + p.x*scale, y = oy + p.y*scale;
      const s = p.sensor;
      ctx.save();
      ctx.globalAlpha = isPreview ? .25 : .35;
      ctx.fillStyle = s.color;
      if (s.type==='cone') {
        const half = (s.angle/2) * Math.PI/180;
        const dir = p.dir || -Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.arc(x, y, s.range*scale, dir-half, dir+half);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, s.range*scale, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
      // dot
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0b1424';
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI*2); ctx.fill();
    }

    function getMouse(e) {
      const r = cv.getBoundingClientRect();
      const cx = (e.clientX - r.left), cy = (e.clientY - r.top);
      return { x: (cx - ox)/scale, y: (cy - oy)/scale };
    }

    cv.addEventListener('mousemove', e => {
      hover = getMouse(e);
      draw();
    });
    cv.addEventListener('mouseleave', () => { hover = null; draw(); });
    cv.addEventListener('click', e => {
      const m = getMouse(e);
      if (m.x<0||m.y<0||m.x>16||m.y>10) return;
      placed.push({ x: m.x, y: m.y, sensor: selected, dir: -Math.PI/2 });
      draw();
    });
    cv.addEventListener('contextmenu', e => {
      e.preventDefault();
      const m = getMouse(e);
      let bestI=-1, bestD=999;
      placed.forEach((p,i) => {
        const d = Math.hypot(p.x-m.x, p.y-m.y);
        if (d<bestD) { bestD=d; bestI=i; }
      });
      if (bestI>=0 && bestD<1.0) { placed.splice(bestI, 1); draw(); }
    });
    clearBtn.addEventListener('click', () => { placed = []; draw(); });
    window.addEventListener('resize', draw);
    requestAnimationFrame(draw);

    function getCss(v) {
      return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    }
    return root;
  }

  // ---------- Comparison view ----------
  function compareView(detectors) {
    const root = el('div', { class: 'card', style:'padding:18px;' });
    root.appendChild(el('div', { class: 'card-h' }, [
      el('div', { class: 'ico', html: '<i class="fas fa-table-cells-large"></i>' }),
      el('h3', { text: 'Vergleich – PIR vs MW vs Dualmelder vs Lichtschranke' })
    ]));
    const grid = el('div', { class: 'grid cols-2', style: 'margin-top:12px' });
    const items = [
      { name:'PIR (Passiv-IR)', svg: ILL.pir(), points: ['Passiv – sendet nicht', 'Erfasst Wärme 8–14µm', '12×12m / 90°', 'Fehlalarm: Sonne, Heizung'] },
      { name:'Mikrowelle', svg: ILL.mw(),       points: ['Aktiv – sendet 10,525 GHz', 'Doppler-Effekt', '20×20m, durchdringt Glas/Holz', 'Fehlalarm: Neonröhren, Wasserrohre'] },
      { name:'Dualmelder', svg: ILL.dual(),     points: ['PIR + MW AND-verknüpft', '–95% Fehlalarmrate', 'Ab SÜ 3 empfohlen', 'Hallen, Werkstätten'] },
      { name:'IR-Lichtschranke', svg: ILL.irBeam(), points:['Aktiv – codierte 940nm Pulse', 'Multi-Strahl-Logik', '5m (innen) – 250m (außen)', 'Outdoor wetterfest, beheizt'] },
    ];
    items.forEach(it => {
      const c = el('div', { class:'card', style: 'background:var(--bg-2); padding:14px' });
      c.appendChild(el('h4', { text: it.name, style:'margin:0 0 8px; color:var(--accent)' }));
      const ill = el('div', { html: it.svg, class:'mt-12' });
      c.appendChild(ill);
      const ul = el('ul', { class: 'mt-12', style:'margin:8px 0 0; padding-left:18px; color:var(--text-dim); font-size:13px' });
      it.points.forEach(p => ul.appendChild(el('li', { text: p })));
      c.appendChild(ul);
      grid.appendChild(c);
    });
    root.appendChild(grid);
    return root;
  }

  return { animateCounter, coverageView, floorPlan, compareView };
})();
