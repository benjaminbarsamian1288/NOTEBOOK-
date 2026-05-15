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
  // Drag sensor icons onto a floor plan, see coverage. Sensors are selectable,
  // draggable, rotatable. Range adjustable. Save/Load floor plans.
  function floorPlan() {
    const root = el('div', { class: 'card', style: 'padding:18px' });
    root.appendChild(el('div', { class: 'card-h' }, [
      el('div', { class: 'ico', html: '<i class="fas fa-vector-square"></i>' }),
      el('h3', { text: 'Floor-Plan-Simulator – Sensoren platzieren · drehen · verschieben' })
    ]));
    root.appendChild(el('p', { class: 'muted small', text: 'Sensor wählen → auf Grundriss tippen zum Platzieren. Platzierten Sensor antippen zum Auswählen → verschieben mit Drag, drehen mit dem Griff, Reichweite per Slider, Löschen mit Delete-Button.' }));

    const SENSORS = [
      { id:'pir',  label:'PIR',         color:'#fbbf24', range:6,  angle:90,  type:'cone',   icon:'fa-eye' },
      { id:'dual', label:'Dual',        color:'#22c55e', range:7,  angle:90,  type:'cone',   icon:'fa-shield-halved' },
      { id:'mw',   label:'Mikrowelle',  color:'#22d3ee', range:10, angle:110, type:'cone',   icon:'fa-tower-broadcast' },
      { id:'us',   label:'Ultraschall', color:'#a78bfa', range:5,  type:'circle', icon:'fa-volume-high' },
      { id:'mag',  label:'Magnet',      color:'#c084fc', range:0.5,type:'circle', icon:'fa-magnet' },
      { id:'glass',label:'Glasbruch',   color:'#38bdf8', range:6,  type:'circle', icon:'fa-window-maximize' },
      { id:'fire', label:'Rauch',       color:'#ef4444', range:5,  type:'circle', icon:'fa-fire' },
      { id:'cam',  label:'Kamera',      color:'#a3e635', range:10, angle:70,  type:'cone',   icon:'fa-video' },
      { id:'ir',   label:'IR-Schranke', color:'#0ea5e9', range:8,  type:'beam',   icon:'fa-arrows-left-right' },
    ];

    const toolbar = el('div', { class: 'filterbar' });
    let selectedSensor = null;   // NULL = nichts platzieren bei Klick
    let selectedIdx = -1;        // selektierter platzierter Sensor

    SENSORS.forEach(s => {
      const c = el('button', { class: 'chip', html: `<i class="fas ${s.icon}"></i> ${s.label}` });
      c.style.color = s.color;
      c.dataset.id = s.id;
      c.addEventListener('click', () => {
        if (selectedSensor && selectedSensor.id === s.id) {
          selectedSensor = null;  // toggle off
        } else {
          selectedSensor = s;
        }
        toolbar.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', selectedSensor && x.dataset.id === selectedSensor.id));
        selectedIdx = -1;
        renderSelectionPanel();
        renderModeHint();
        draw();
      });
      toolbar.appendChild(c);
    });
    root.appendChild(toolbar);

    // Mode hint banner
    const modeHint = el('div', { class:'fp-mode-banner' });
    root.appendChild(modeHint);
    function renderModeHint() {
      if (selectedSensor) {
        modeHint.innerHTML = `
          <div class="fp-mode-inner fp-mode-place">
            <span class="fp-mode-pulse" style="background:${selectedSensor.color}; box-shadow: 0 0 12px ${selectedSensor.color}"></span>
            <strong>PLATZIEREN-MODUS</strong>
            <span class="fp-mode-text">→ Tippe auf den Grundriss, um <strong style="color:${selectedSensor.color}">${selectedSensor.label}</strong> zu setzen</span>
            <button class="fp-mode-cancel" data-cancel="1">Abbrechen ✕</button>
          </div>`;
        const cancel = modeHint.querySelector('[data-cancel]');
        if (cancel) cancel.addEventListener('click', () => {
          selectedSensor = null;
          toolbar.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
          renderModeHint(); draw();
        });
      } else {
        modeHint.innerHTML = `
          <div class="fp-mode-inner fp-mode-view">
            <i class="fas fa-hand-pointer"></i>
            <strong>ANSEHEN</strong>
            <span class="fp-mode-text">→ Erst Sensor oben wählen, dann auf Grundriss tippen. Bestehenden Sensor antippen zum Bearbeiten.</span>
          </div>`;
      }
    }
    renderModeHint();

    // Action toolbar (save/load/clear + AUTO-PLAN)
    const actBar = el('div', { class: 'filterbar' });
    const autoBtn = el('button', { class: 'btn primary', html:'<i class="fas fa-wand-magic-sparkles"></i> Auto-Plan' });
    const saveBtn = el('button', { class: 'btn ghost', html:'<i class="fas fa-floppy-disk"></i> Speichern' });
    const loadBtn = el('button', { class: 'btn ghost', html:'<i class="fas fa-folder-open"></i> Laden' });
    const clearBtn = el('button', { class: 'btn ghost', html:'<i class="fas fa-trash"></i> Alle löschen' });
    actBar.appendChild(autoBtn);
    actBar.appendChild(saveBtn); actBar.appendChild(loadBtn); actBar.appendChild(clearBtn);
    // Zoom buttons
    const zoomBox = el('div', { class:'fp-zoombox' });
    const zoomIn = el('button', { class:'btn ghost fp-zoom-btn', html:'<i class="fas fa-plus"></i>' });
    const zoomOut = el('button', { class:'btn ghost fp-zoom-btn', html:'<i class="fas fa-minus"></i>' });
    const zoomReset = el('button', { class:'btn ghost fp-zoom-btn', html:'<i class="fas fa-arrows-to-circle"></i>' });
    zoomIn.title = 'Vergrößern'; zoomOut.title = 'Verkleinern'; zoomReset.title = 'Zurücksetzen';
    zoomIn.addEventListener('click', () => { zoomFactor = Math.min(4, zoomFactor * 1.2); draw(); });
    zoomOut.addEventListener('click', () => { zoomFactor = Math.max(.4, zoomFactor / 1.2); draw(); });
    zoomReset.addEventListener('click', () => { zoomFactor = 1.0; panX = 0; panY = 0; draw(); });
    zoomBox.appendChild(zoomOut); zoomBox.appendChild(zoomReset); zoomBox.appendChild(zoomIn);
    actBar.appendChild(zoomBox);
    // Auto-Plan handler: fills every room with intelligent sensors
    autoBtn.addEventListener('click', () => {
      if (placed.length && !confirm(`${placed.length} bestehende Sensoren werden überschrieben. Fortfahren?`)) return;
      const nPlaced = [];
      // Magnetkontakte an allen Fenstern und Außentüren
      OPENINGS.forEach(o => {
        const sx = o.x + (o.d==='h' ? o.length/2 : 0);
        const sy = o.y + (o.d==='v' ? o.length/2 : 0);
        if (o.type === 'door' || o.type === 'window') {
          const x = Math.max(0.3, Math.min(15.7, sx + (sx<.5 ? .3 : sx>15.5 ? -.3 : 0)));
          const y = Math.max(0.3, Math.min(9.7, sy + (sy<.5 ? .3 : sy>9.5 ? -.3 : 0)));
          nPlaced.push({ x, y, sensor: SENSORS.find(s=>s.id==='mag'), dir: 0, range: 0.5 });
        }
      });
      // Pro Raum: PIR in Ecke + Rauchmelder in Mitte (Bad: kein Rauch + Glasbruch in wertvollen Räumen)
      ROOMS.forEach(r => {
        const cornerX = r.x + 0.6;
        const cornerY = r.y + 0.6;
        nPlaced.push({ x: cornerX, y: cornerY, sensor: SENSORS.find(s=>s.id==='pir'), dir: Math.PI/4, range: Math.min(r.w, r.h, 6) });
        if (r.name !== 'Bad') {
          nPlaced.push({ x: r.x + r.w/2, y: r.y + r.h/2, sensor: SENSORS.find(s=>s.id==='fire'), dir: 0, range: Math.min(r.w/2, r.h/2, 4) });
        }
        if (['Wohnen','Schlaf','Büro','Kind'].includes(r.name)) {
          nPlaced.push({ x: r.x + r.w/2, y: r.y + r.h*0.7, sensor: SENSORS.find(s=>s.id==='glass'), dir: 0, range: 6 });
        }
      });
      placed = nPlaced;
      selectedIdx = -1;
      renderSelectionPanel();
      autoSave();
      draw();
      U.toast(`${nPlaced.length} Sensoren automatisch platziert`);
    });
    const statBox = el('div', { class: 'fp-stat' });
    actBar.appendChild(statBox);
    root.appendChild(actBar);

    // Selection panel (only visible when something is selected)
    const selPanel = el('div', { class: 'fp-selpanel', style:'display:none' });
    root.appendChild(selPanel);

    const cv = el('canvas', { class: 'fp-canvas', width: '900', height: '560' });
    root.appendChild(cv);

    // Floor plan rooms (16x10 meters)
    const ROOMS = [
      { x: 0,    y: 0,    w: 6,  h: 5,  name: 'Wohnen' },
      { x: 6,    y: 0,    w: 5,  h: 5,  name: 'Küche' },
      { x: 11,   y: 0,    w: 5,  h: 5,  name: 'Bad' },
      { x: 0,    y: 5,    w: 4,  h: 5,  name: 'Schlaf' },
      { x: 4,    y: 5,    w: 4,  h: 5,  name: 'Flur' },
      { x: 8,    y: 5,    w: 4,  h: 5,  name: 'Kind' },
      { x: 12,   y: 5,    w: 4,  h: 5,  name: 'Büro' },
    ];
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

    let placed = [];   // {x, y, sensor, dir, range}
    let hover = null;
    let scale, ox, oy;
    let drag = null;   // {mode:'move'|'rotate', idx, offsetX, offsetY}

    // Load from localStorage if present
    try {
      const saved = JSON.parse(localStorage.getItem('st-floorplan-last') || 'null');
      if (saved && Array.isArray(saved)) {
        placed = saved.map(p => ({
          x: p.x, y: p.y, dir: p.dir, range: p.range,
          sensor: SENSORS.find(s => s.id === p.sid) || SENSORS[0]
        }));
      }
    } catch {}

    let zoomFactor = 1.0;
    let panX = 0, panY = 0;
    function fit() {
      const W = cv.parentElement.clientWidth - 36;
      const H = 560;
      const dpr = window.devicePixelRatio || 1;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      scale = Math.min((W-30)/16, (H-30)/10) * zoomFactor;
      ox = (W - 16*scale)/2 + panX;
      oy = 15 + panY;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return ctx;
    }
    function getCss(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

    // Wheel zoom centered on cursor
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1/1.15;
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      zoomAt(mx, my, factor);
    }, { passive: false });

    // === Pinch-Zoom + 2-Finger Pan ===
    let pinchStart = null;
    let panStart = null;  // single-finger pan when no sensor mode + not on existing sensor

    function zoomAt(cx, cy, factor) {
      // World coords at (cx,cy) before zoom:
      const oldWX = (cx - ox)/scale;
      const oldWY = (cy - oy)/scale;
      zoomFactor = Math.max(.5, Math.min(5, zoomFactor * factor));
      // Force fit recalc by drawing; then adjust pan so (oldWX, oldWY) maps to (cx, cy)
      fit();  // recompute ox, oy, scale from new zoomFactor (incl. panX,panY)
      const newSX = ox + oldWX * scale;
      const newSY = oy + oldWY * scale;
      // Shift pan so new screen pos == cx, cy
      panX += cx - newSX;
      panY += cy - newSY;
      draw();
    }

    cv.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const a = e.touches[0], b = e.touches[1];
        const r = cv.getBoundingClientRect();
        const ax = a.clientX - r.left, ay = a.clientY - r.top;
        const bx = b.clientX - r.left, by = b.clientY - r.top;
        const dx = ax - bx, dy = ay - by;
        pinchStart = {
          dist: Math.hypot(dx, dy),
          zoom: zoomFactor,
          midX: (ax + bx) / 2,
          midY: (ay + by) / 2,
          startPanX: panX, startPanY: panY,
        };
        // Cancel single-finger drag if pinch starts
        drag = null;
        panStart = null;
      } else if (e.touches.length === 1) {
        // Convert to mouse-event for the existing handlers (only if mousedown wasn't fired by browser)
      }
    }, { passive: false });

    cv.addEventListener('touchmove', e => {
      if (e.touches.length === 2 && pinchStart) {
        e.preventDefault();
        const a = e.touches[0], b = e.touches[1];
        const r = cv.getBoundingClientRect();
        const ax = a.clientX - r.left, ay = a.clientY - r.top;
        const bx = b.clientX - r.left, by = b.clientY - r.top;
        const dx = ax - bx, dy = ay - by;
        const newDist = Math.hypot(dx, dy);
        const newMidX = (ax + bx) / 2;
        const newMidY = (ay + by) / 2;
        // New zoom around midpoint
        const factor = newDist / pinchStart.dist;
        // World-coord at midpoint before pinch (using start-state)
        // We adjust panX/panY so the pinch midpoint stays anchored:
        // 1. Compute what world point was under pinchStart.midX/Y at start
        //    Actually simpler: just multiply zoomFactor and shift pan by the midpoint delta + zoom delta
        const newZoom = Math.max(.5, Math.min(5, pinchStart.zoom * factor));
        // Restore panX/panY to start values first to avoid drift
        panX = pinchStart.startPanX;
        panY = pinchStart.startPanY;
        // Save old scale (with old zoom):
        const oldScale = Math.min((cv.parentElement.clientWidth - 36 - 30)/16, (480-30)/10) * pinchStart.zoom;
        const oldOx = ((cv.parentElement.clientWidth - 36) - 16*oldScale)/2 + pinchStart.startPanX;
        const oldOy = 15 + pinchStart.startPanY;
        const worldX = (pinchStart.midX - oldOx) / oldScale;
        const worldY = (pinchStart.midY - oldOy) / oldScale;
        // Set zoom + recompute
        zoomFactor = newZoom;
        fit();  // updates scale, ox, oy
        // Now adjust pan so worldX,worldY maps to newMidX,newMidY
        const newSX = ox + worldX * scale;
        const newSY = oy + worldY * scale;
        panX += newMidX - newSX;
        panY += newMidY - newSY;
        draw();
      }
    }, { passive: false });

    cv.addEventListener('touchend', e => {
      if (e.touches.length < 2) pinchStart = null;
    });
    cv.addEventListener('touchcancel', () => { pinchStart = null; });

    function draw() {
      const ctx = fit();
      const W = cv.parentElement.clientWidth - 36;
      ctx.clearRect(0, 0, W, 560);
      // Rooms
      ROOMS.forEach(r => {
        const x = ox + r.x*scale, y = oy + r.y*scale, w = r.w*scale, h = r.h*scale;
        ctx.fillStyle = 'rgba(56,189,248,.04)';
        ctx.fillRect(x,y,w,h);
        ctx.strokeStyle = getCss('--border'); ctx.lineWidth = 2;
        ctx.strokeRect(x,y,w,h);
        ctx.fillStyle = getCss('--text-dim'); ctx.font = '11px system-ui';
        ctx.fillText(r.name, x+4, y+14);
        // Furniture (real floor-plan look)
        if (window.FURN) FURN.render(ctx, r.name, x, y, scale, r.w, r.h);
      });
      // Openings
      OPENINGS.forEach(o => {
        const x = ox + o.x*scale, y = oy + o.y*scale;
        ctx.strokeStyle = o.type==='door' ? '#fbbf24' : '#38bdf8';
        ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath();
        if (o.d==='h') { ctx.moveTo(x,y); ctx.lineTo(x+o.length*scale, y); }
        else           { ctx.moveTo(x,y); ctx.lineTo(x, y+o.length*scale); }
        ctx.stroke();
      });
      // Coverage of placed sensors
      placed.forEach((p, i) => drawCoverage(ctx, p, i === selectedIdx));
      // Hover preview – nur wenn ein Sensor explizit gewählt ist
      if (hover && selectedIdx < 0 && selectedSensor) {
        drawCoverage(ctx, { x: hover.x, y: hover.y, sensor: selectedSensor, dir: -Math.PI/2, range: selectedSensor.range }, false, true);
      }

      // Update stat box
      updateStats();
    }

    function drawCoverage(ctx, p, isSelected=false, isPreview=false) {
      const x = ox + p.x*scale, y = oy + p.y*scale;
      const s = p.sensor;
      const range = (p.range != null ? p.range : s.range);
      ctx.save();
      ctx.globalAlpha = isPreview ? .22 : (isSelected ? .5 : .35);
      ctx.fillStyle = s.color;
      if (s.type==='cone') {
        const half = (s.angle/2) * Math.PI/180;
        const dir = p.dir != null ? p.dir : -Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.arc(x, y, range*scale, dir-half, dir+half);
        ctx.closePath();
        ctx.fill();
        if (isSelected) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.5; ctx.globalAlpha = .9;
          ctx.stroke();
        }
      } else if (s.type==='beam') {
        const dir = p.dir != null ? p.dir : 0;
        ctx.translate(x, y); ctx.rotate(dir);
        ctx.fillRect(0, -3, range*scale, 6);
        if (isSelected) {
          ctx.strokeStyle = s.color; ctx.lineWidth = 1.5; ctx.globalAlpha = .9;
          ctx.strokeRect(0, -3, range*scale, 6);
        }
      } else {
        ctx.beginPath();
        ctx.arc(x, y, range*scale, 0, Math.PI*2);
        ctx.fill();
        if (isSelected) {
          ctx.strokeStyle = s.color; ctx.lineWidth = 1.5; ctx.globalAlpha = .9;
          ctx.stroke();
        }
      }
      ctx.restore();
      // BHE-Symbol als Sensor-Marker (genormt nach BHE-Sicherheitstechnik)
      const symbolSize = isSelected ? 32 : 26;
      if (window.BHE_SYMBOLS) {
        window.BHE_SYMBOLS.draw(ctx, s.id, x, y, symbolSize, s.color);
      } else {
        // Fallback
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(x, y, isSelected ? 9 : 7, 0, Math.PI*2); ctx.fill();
      }
      // Selection ring + rotate handle
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        // Rotate handle for directional sensors
        if (s.type === 'cone' || s.type === 'beam') {
          const dir = p.dir != null ? p.dir : -Math.PI/2;
          const hx = x + Math.cos(dir) * 28;
          const hy = y + Math.sin(dir) * 28;
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(hx, hy); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(hx, hy, 7, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#0b1424'; ctx.font = 'bold 11px system-ui';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('↻', hx, hy+1);
        }
      }
    }

    function getMouse(e) {
      const r = cv.getBoundingClientRect();
      const cx = (e.clientX - r.left), cy = (e.clientY - r.top);
      return { x: (cx - ox)/scale, y: (cy - oy)/scale, px: cx, py: cy };
    }

    function findSensorAt(m) {
      // Returns idx where mouse is on sensor symbol
      for (let i = placed.length - 1; i >= 0; i--) {
        const p = placed[i];
        const d = Math.hypot(p.x*scale + ox - m.px, p.y*scale + oy - m.py);
        if (d < 22) return { idx: i, mode: 'move' };
      }
      return null;
    }

    function findRotateHandleAt(m) {
      if (selectedIdx < 0) return false;
      const p = placed[selectedIdx];
      if (p.sensor.type !== 'cone' && p.sensor.type !== 'beam') return false;
      const x = ox + p.x*scale, y = oy + p.y*scale;
      const dir = p.dir != null ? p.dir : -Math.PI/2;
      const hx = x + Math.cos(dir) * 28;
      const hy = y + Math.sin(dir) * 28;
      const d = Math.hypot(m.px - hx, m.py - hy);
      return d < 12;
    }

    cv.addEventListener('mousedown', e => {
      const m = getMouse(e);
      if (findRotateHandleAt(m)) {
        drag = { mode: 'rotate', idx: selectedIdx };
        return;
      }
      const hit = findSensorAt(m);
      if (hit) {
        selectedIdx = hit.idx;
        drag = { mode: 'move', idx: hit.idx };
        renderSelectionPanel();
        draw();
      } else if (selectedSensor) {
        // Nur platzieren wenn explizit ein Sensor in der Toolbar angeklickt wurde
        if (m.x<0||m.y<0||m.x>16||m.y>10) return;
        const sCopy = selectedSensor;
        placed.push({ x: m.x, y: m.y, sensor: sCopy, dir: -Math.PI/2, range: sCopy.range });
        selectedIdx = placed.length - 1;
        // Auto-exit place mode after one placement
        selectedSensor = null;
        toolbar.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        renderModeHint();
        renderSelectionPanel();
        autoSave();
        draw();
      } else {
        // Pan-Modus: kein Sensor gewählt, klick auf leere Fläche → Pan
        drag = { mode: 'pan', startPanX: panX, startPanY: panY, startMX: m.px, startMY: m.py };
      }
    });

    cv.addEventListener('mousemove', e => {
      const m = getMouse(e);
      hover = m;
      if (drag) {
        if (drag.mode === 'move') {
          const p = placed[drag.idx];
          p.x = Math.max(0, Math.min(16, m.x));
          p.y = Math.max(0, Math.min(10, m.y));
        } else if (drag.mode === 'rotate') {
          const p = placed[drag.idx];
          const cx = ox + p.x*scale, cy = oy + p.y*scale;
          p.dir = Math.atan2(m.py - cy, m.px - cx);
        } else if (drag.mode === 'pan') {
          panX = drag.startPanX + (m.px - drag.startMX);
          panY = drag.startPanY + (m.py - drag.startMY);
        }
        draw();
      } else {
        draw();
      }
    });

    cv.addEventListener('mouseup', () => {
      if (drag) {
        autoSave();
        drag = null;
      }
    });

    cv.addEventListener('mouseleave', () => { hover = null; drag = null; draw(); });

    cv.addEventListener('contextmenu', e => {
      e.preventDefault();
      const m = getMouse(e);
      const hit = findSensorAt(m);
      if (hit) {
        placed.splice(hit.idx, 1);
        selectedIdx = -1;
        renderSelectionPanel();
        autoSave();
        draw();
      }
    });

    // Touch support (basic)
    cv.addEventListener('touchstart', e => {
      const t = e.touches[0];
      cv.dispatchEvent(new MouseEvent('mousedown', { clientX: t.clientX, clientY: t.clientY, bubbles:true }));
      e.preventDefault();
    }, { passive: false });
    cv.addEventListener('touchmove', e => {
      const t = e.touches[0];
      cv.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY, bubbles:true }));
      e.preventDefault();
    }, { passive: false });
    cv.addEventListener('touchend', e => {
      cv.dispatchEvent(new MouseEvent('mouseup', { bubbles:true }));
    });

    clearBtn.addEventListener('click', () => {
      if (!placed.length) return;
      if (!confirm('Alle '+placed.length+' Sensoren entfernen?')) return;
      placed = []; selectedIdx = -1;
      renderSelectionPanel();
      autoSave();
      draw();
    });

    saveBtn.addEventListener('click', () => {
      const name = prompt('Plan-Name?', `Plan · ${new Date().toLocaleDateString('de-DE')}`);
      if (!name) return;
      let plans = [];
      try { plans = JSON.parse(localStorage.getItem('st-floorplans')||'[]'); } catch {}
      plans.push({ name, ts: Date.now(), data: placed.map(p => ({ x:p.x, y:p.y, dir:p.dir, range:p.range, sid: p.sensor.id })) });
      localStorage.setItem('st-floorplans', JSON.stringify(plans));
      U.toast(`„${name}" gespeichert`);
    });

    loadBtn.addEventListener('click', () => {
      let plans = [];
      try { plans = JSON.parse(localStorage.getItem('st-floorplans')||'[]'); } catch {}
      if (!plans.length) { U.toast('Keine gespeicherten Pläne'); return; }
      const choices = plans.map((p,i) => `${i+1}. ${p.name} (${new Date(p.ts).toLocaleDateString('de-DE')})`).join('\n');
      const sel = prompt('Welcher Plan?\n\n'+choices, '1');
      const idx = +sel - 1;
      if (idx<0 || idx>=plans.length) return;
      const p = plans[idx];
      placed = p.data.map(it => ({
        x: it.x, y: it.y, dir: it.dir, range: it.range,
        sensor: SENSORS.find(s => s.id === it.sid) || SENSORS[0]
      }));
      selectedIdx = -1;
      renderSelectionPanel();
      autoSave();
      draw();
      U.toast(`„${p.name}" geladen`);
    });

    function autoSave() {
      localStorage.setItem('st-floorplan-last', JSON.stringify(
        placed.map(p => ({ x:p.x, y:p.y, dir:p.dir, range:p.range, sid: p.sensor.id }))
      ));
    }

    function renderSelectionPanel() {
      selPanel.innerHTML = '';
      if (selectedIdx < 0) { selPanel.style.display = 'none'; return; }
      const p = placed[selectedIdx];
      selPanel.style.display = '';
      // Header
      const head = el('div', { class:'fp-selhead' }, [
        el('div', { class:'fp-selicon', html:`<i class="fas ${p.sensor.icon}"></i>`, style:`background:${p.sensor.color}; color:#0b1424;` }),
        el('div', { class:'fp-seltitle' }, [
          el('strong', { text: p.sensor.label + ' · Sensor #' + (selectedIdx+1) }),
          el('div', { class:'small muted', text: `Position: x=${p.x.toFixed(1)}m, y=${p.y.toFixed(1)}m · Reichweite: ${(p.range||p.sensor.range).toFixed(1)}m` })
        ]),
        el('button', { class:'btn ghost', html:'<i class="fas fa-xmark"></i> Auswahl aufheben', onClick: () => { selectedIdx = -1; renderSelectionPanel(); draw(); } }),
        el('button', { class:'btn', style:'border-color:var(--bad); color:var(--bad)', html:'<i class="fas fa-trash"></i> Löschen', onClick: () => {
          placed.splice(selectedIdx, 1);
          selectedIdx = -1;
          renderSelectionPanel();
          autoSave(); draw();
        }})
      ]);
      selPanel.appendChild(head);
      // Range slider
      const rRow = el('div', { class:'fp-control' });
      rRow.appendChild(el('label', { text: 'Reichweite' }));
      const rSlider = el('input', { type:'range', min:'1', max:'20', step:'0.5', value: String(p.range || p.sensor.range), class:'fp-slider' });
      const rOut = el('span', { class:'fp-out', text: (p.range||p.sensor.range).toFixed(1)+' m' });
      rSlider.addEventListener('input', () => {
        p.range = +rSlider.value;
        rOut.textContent = p.range.toFixed(1) + ' m';
        autoSave(); draw();
      });
      rRow.appendChild(rSlider); rRow.appendChild(rOut);
      selPanel.appendChild(rRow);
      // Rotation slider (only for cone/beam)
      if (p.sensor.type === 'cone' || p.sensor.type === 'beam') {
        const aRow = el('div', { class:'fp-control' });
        aRow.appendChild(el('label', { text: 'Winkel' }));
        const aSlider = el('input', { type:'range', min:'-180', max:'180', step:'5', value: String(Math.round((p.dir || -Math.PI/2) * 180 / Math.PI)), class:'fp-slider' });
        const aOut = el('span', { class:'fp-out', text: Math.round((p.dir || -Math.PI/2) * 180 / Math.PI)+'°' });
        aSlider.addEventListener('input', () => {
          p.dir = +aSlider.value * Math.PI / 180;
          aOut.textContent = aSlider.value + '°';
          autoSave(); draw();
        });
        aRow.appendChild(aSlider); aRow.appendChild(aOut);
        selPanel.appendChild(aRow);
      }
      // Quick rotation buttons
      if (p.sensor.type === 'cone' || p.sensor.type === 'beam') {
        const qb = el('div', { class:'fp-control' });
        qb.appendChild(el('label', { text: 'Schnell' }));
        ['↑',-90, '→',0, '↓',90, '←',180].reduce((acc,v,i)=>{
          if (typeof v === 'string') acc.push({ label: v, deg: null });
          else acc[acc.length-1].deg = v;
          return acc;
        }, []).forEach(it => {
          const b = el('button', { class:'chip', text: it.label, onClick: () => {
            p.dir = it.deg * Math.PI / 180;
            autoSave(); draw();
            renderSelectionPanel();
          }});
          qb.appendChild(b);
        });
        selPanel.appendChild(qb);
      }
    }

    function updateStats() {
      // Calculate approximate coverage % by sampling
      const samplesX = 32, samplesY = 20;
      let covered = 0, total = 0;
      for (let i = 0; i < samplesX; i++) {
        for (let j = 0; j < samplesY; j++) {
          const x = (i + .5) * 16 / samplesX;
          const y = (j + .5) * 10 / samplesY;
          // Inside any room?
          if (!ROOMS.some(r => x>=r.x && x<=r.x+r.w && y>=r.y && y<=r.y+r.h)) continue;
          total++;
          // Covered by any sensor?
          if (placed.some(p => isCovered(x, y, p))) covered++;
        }
      }
      const pct = total ? Math.round(covered/total*100) : 0;
      statBox.innerHTML = `
        <div class="fp-stat-num">${placed.length}</div>
        <div class="fp-stat-lbl">Sensoren</div>
        <div class="fp-stat-num" style="background: linear-gradient(135deg, #22c55e, #34d399); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${pct}%</div>
        <div class="fp-stat-lbl">Abdeckung</div>
      `;
    }

    function isCovered(x, y, p) {
      const dx = x - p.x, dy = y - p.y;
      const dist = Math.hypot(dx, dy);
      const range = p.range != null ? p.range : p.sensor.range;
      if (dist > range) return false;
      if (p.sensor.type === 'cone') {
        const dir = p.dir != null ? p.dir : -Math.PI/2;
        const half = (p.sensor.angle/2) * Math.PI/180;
        const a = Math.atan2(dy, dx);
        let diff = Math.abs(a - dir);
        if (diff > Math.PI) diff = 2*Math.PI - diff;
        return diff <= half;
      }
      if (p.sensor.type === 'beam') {
        const dir = p.dir || 0;
        // Inside a thin rectangle along direction
        const rotX = dx * Math.cos(-dir) - dy * Math.sin(-dir);
        const rotY = dx * Math.sin(-dir) + dy * Math.cos(-dir);
        return rotX >= 0 && rotX <= range && Math.abs(rotY) < 0.3;
      }
      // circle
      return true;
    }

    window.addEventListener('resize', draw);
    requestAnimationFrame(draw);
    renderSelectionPanel();
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
