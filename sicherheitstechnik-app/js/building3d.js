/* 3D-Gebäudeplaner – isometrische Canvas-Engine, rotierbar, mit Etagen,
   3D-Coverage-Visualisierung und Sensor-Platzierung im Raum.
   Kein Three.js – pure 2D-Canvas mit isometrischer Projektion. */

window.BLDG3D = (() => {
  const { el, toast } = U;

  // World coordinates in meters. (0,0,0) = bottom-left-back corner.
  // x = west-east, y = up (height), z = north-south
  const FLOORS = [
    { name:'EG',  y: 0, h: 2.6, rooms: [
      { x:0,  z:0, w:6, d:5, name:'Wohnen' },
      { x:6,  z:0, w:5, d:5, name:'Küche' },
      { x:11, z:0, w:5, d:5, name:'Bad' },
      { x:0,  z:5, w:4, d:5, name:'Schlaf' },
      { x:4,  z:5, w:4, d:5, name:'Flur' },
      { x:8,  z:5, w:4, d:5, name:'Kind' },
      { x:12, z:5, w:4, d:5, name:'Büro' },
    ]},
    { name:'OG',  y: 2.6, h: 2.4, rooms: [
      { x:0,  z:0, w:8, d:5, name:'Bad/Schlaf' },
      { x:8,  z:0, w:8, d:5, name:'Wohnen' },
      { x:0,  z:5, w:8, d:5, name:'Kind1' },
      { x:8,  z:5, w:8, d:5, name:'Kind2' },
    ]},
    { name:'DG',  y: 5.0, h: 2.0, rooms: [
      { x:2,  z:2, w:12, d:6, name:'Dachboden' },
    ]},
  ];

  const SENSORS = [
    { id:'pir',  label:'PIR',         color:'#fbbf24', range:6,   coneAngle:90,  type:'cone',   icon:'fa-eye' },
    { id:'dual', label:'Dual',        color:'#22c55e', range:7,   coneAngle:90,  type:'cone',   icon:'fa-shield-halved' },
    { id:'mw',   label:'Mikrowelle',  color:'#22d3ee', range:10,  coneAngle:110, type:'cone',   icon:'fa-tower-broadcast' },
    { id:'us',   label:'Ultraschall', color:'#a78bfa', range:5,   type:'sphere', icon:'fa-volume-high' },
    { id:'mag',  label:'Magnet',      color:'#c084fc', range:0.5, type:'sphere', icon:'fa-magnet' },
    { id:'glass',label:'Glasbruch',   color:'#38bdf8', range:6,   type:'sphere', icon:'fa-window-maximize' },
    { id:'fire', label:'Rauch',       color:'#ef4444', range:5,   type:'sphere', icon:'fa-fire' },
    { id:'cam',  label:'Kamera',      color:'#a3e635', range:10,  coneAngle:70, type:'cone',   icon:'fa-video' },
  ];

  function view(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'3D · Räumliche Planung' }),
      el('h1', { text: '3D-Gebäudeplaner' }),
      el('p', { text: '3-stöckiges Gebäude in isometrischer 3D-Ansicht. Etagen ein/ausblenden, Gebäude rotieren, Sensoren in den Raum platzieren — 3D-Coverage als transparente Kugeln/Kegel.' })
    ]));

    const card = el('div', { class:'card', style:'padding:18px; overflow:visible' });

    // Sensor toolbar
    const toolbar = el('div', { class: 'filterbar' });
    let placeMode = SENSORS[0];
    SENSORS.forEach(s => {
      const c = el('button', { class: 'chip'+(s.id===placeMode.id?' active':''), html: `<i class="fas ${s.icon}"></i> ${s.label}` });
      c.style.color = s.color;
      c.dataset.id = s.id;
      c.addEventListener('click', () => {
        placeMode = s;
        toolbar.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.dataset.id===s.id));
      });
      toolbar.appendChild(c);
    });
    card.appendChild(toolbar);

    // View controls
    const ctrlBar = el('div', { class: 'filterbar' });
    const floorChips = el('div', { class: 'row', style:'gap:6px' });
    ctrlBar.appendChild(floorChips);
    card.appendChild(ctrlBar);

    // View canvas
    const cv = el('canvas', { class: 'b3d-canvas' });
    card.appendChild(cv);

    // Rotation + zoom controls
    const viewCtrl = el('div', { class: 'b3d-viewctrl' });
    viewCtrl.innerHTML = `
      <button class="btn ghost" data-rot="-15"><i class="fas fa-rotate-left"></i></button>
      <button class="btn ghost" data-tilt="up"><i class="fas fa-angle-up"></i></button>
      <button class="btn ghost" data-tilt="down"><i class="fas fa-angle-down"></i></button>
      <button class="btn ghost" data-rot="15"><i class="fas fa-rotate-right"></i></button>
      <span class="b3d-sep"></span>
      <button class="btn ghost" data-zoom="-"><i class="fas fa-minus"></i></button>
      <button class="btn ghost" data-zoom="+"><i class="fas fa-plus"></i></button>
      <button class="btn ghost" data-reset="1"><i class="fas fa-arrows-to-circle"></i></button>
    `;
    card.appendChild(viewCtrl);

    // Stats + selection panel
    const stat = el('div', { class:'b3d-stat' });
    card.appendChild(stat);
    const selPanel = el('div', { class: 'fp-selpanel', style:'display:none' });
    card.appendChild(selPanel);

    root.appendChild(card);

    // ===== State =====
    let yaw = 35;    // rotation around Y in degrees
    let pitch = 30;  // tilt (camera elevation), default 30
    let zoom = 1.0;
    let floorVisible = [true, true, true];
    let placed = [];
    let selectedIdx = -1;
    let drag = null; // {mode, idx, lastX, lastY}

    // Restore last
    try {
      const last = JSON.parse(localStorage.getItem('st-b3d-last')||'null');
      if (last && Array.isArray(last)) {
        placed = last.map(p => ({
          x: p.x, y: p.y, z: p.z, dir: p.dir, range: p.range,
          sensor: SENSORS.find(s => s.id === p.sid) || SENSORS[0]
        }));
      }
    } catch {}

    // Build floor chips
    function rebuildFloorChips() {
      floorChips.innerHTML = '';
      FLOORS.forEach((f, i) => {
        const c = el('button', { class: 'chip'+(floorVisible[i] ? ' active' : ''), html: `<i class="fas fa-layer-group"></i> ${f.name}` });
        c.addEventListener('click', () => {
          floorVisible[i] = !floorVisible[i];
          c.classList.toggle('active', floorVisible[i]);
          draw();
        });
        floorChips.appendChild(c);
      });
    }
    rebuildFloorChips();

    // Save/Load/Clear
    const acts = el('div', { class:'filterbar' });
    const saveBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-floppy-disk"></i> Speichern' });
    const loadBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-folder-open"></i> Laden' });
    const clearBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-trash"></i> Alle löschen' });
    acts.appendChild(saveBtn); acts.appendChild(loadBtn); acts.appendChild(clearBtn);
    card.insertBefore(acts, cv);

    saveBtn.addEventListener('click', () => {
      const name = prompt('3D-Plan-Name?', `3D-Plan · ${new Date().toLocaleDateString('de-DE')}`);
      if (!name) return;
      let plans = [];
      try { plans = JSON.parse(localStorage.getItem('st-b3d-plans')||'[]'); } catch {}
      plans.push({ name, ts: Date.now(), data: placed.map(p => ({ x:p.x, y:p.y, z:p.z, dir:p.dir, range:p.range, sid:p.sensor.id })) });
      localStorage.setItem('st-b3d-plans', JSON.stringify(plans));
      toast(`„${name}" gespeichert`);
    });
    loadBtn.addEventListener('click', () => {
      let plans = [];
      try { plans = JSON.parse(localStorage.getItem('st-b3d-plans')||'[]'); } catch {}
      if (!plans.length) { toast('Keine gespeicherten Pläne'); return; }
      const choices = plans.map((p,i) => `${i+1}. ${p.name}`).join('\n');
      const sel = prompt('Welcher Plan?\n\n'+choices, '1');
      const idx = +sel - 1;
      if (idx<0||idx>=plans.length) return;
      placed = plans[idx].data.map(it => ({
        x:it.x, y:it.y, z:it.z, dir:it.dir, range:it.range,
        sensor: SENSORS.find(s => s.id===it.sid) || SENSORS[0]
      }));
      selectedIdx = -1; renderSel(); autoSave(); draw();
    });
    clearBtn.addEventListener('click', () => {
      if (!placed.length) return;
      if (!confirm('Alle '+placed.length+' Sensoren löschen?')) return;
      placed = []; selectedIdx = -1; renderSel(); autoSave(); draw();
    });

    function autoSave() {
      localStorage.setItem('st-b3d-last', JSON.stringify(
        placed.map(p => ({ x:p.x, y:p.y, z:p.z, dir:p.dir, range:p.range, sid:p.sensor.id }))
      ));
    }

    // ===== Isometric projection =====
    // Convert world (x,y,z) to screen (x,y) using current yaw/pitch
    // Use cabinet projection: rotate around Y then around X
    let canvasW = 800, canvasH = 540;
    const SCALE_BASE = 32; // pixels per meter at zoom 1.0
    const CENTER_X = () => canvasW/2;
    const CENTER_Y = () => canvasH/2 + 80;

    function project(x, y, z) {
      // Center the building around 8, _, 5
      const cx = x - 8, cy = y, cz = z - 5;
      const yawR = yaw * Math.PI/180;
      const pitchR = pitch * Math.PI/180;
      // Rotate around Y (yaw)
      const rx = cx * Math.cos(yawR) - cz * Math.sin(yawR);
      const rz = cx * Math.sin(yawR) + cz * Math.cos(yawR);
      // Rotate around X (pitch)
      const ry = cy * Math.cos(pitchR) - rz * Math.sin(pitchR);
      const rrz = cy * Math.sin(pitchR) + rz * Math.cos(pitchR);
      // Project (orthographic)
      const s = SCALE_BASE * zoom;
      const sx = CENTER_X() + rx * s;
      const sy = CENTER_Y() - ry * s; // up is negative
      return { sx, sy, depth: rrz };
    }

    function getCss(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

    function fit() {
      const W = cv.parentElement.clientWidth - 36;
      const H = 540;
      const dpr = window.devicePixelRatio || 1;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      canvasW = W; canvasH = H;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return ctx;
    }

    function draw() {
      const ctx = fit();
      ctx.clearRect(0,0,canvasW,canvasH);

      // Sort drawables by depth
      const items = [];

      // Ground plane
      items.push({ depth: 100, fn: () => drawGround(ctx) });

      // Floors
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        f.rooms.forEach(r => {
          // Floor slab
          const corners = [
            project(r.x,         f.y, r.z),
            project(r.x + r.w,   f.y, r.z),
            project(r.x + r.w,   f.y, r.z + r.d),
            project(r.x,         f.y, r.z + r.d),
          ];
          const avgDepth = corners.reduce((s,c)=>s+c.depth,0) / 4 + f.y*0.2;
          items.push({ depth: avgDepth, fn: () => drawSlab(ctx, corners, fi) });

          // Walls (4 walls)
          drawWalls(ctx, r, f, items);

          // Floor label
          const ctr = project(r.x + r.w/2, f.y + 0.01, r.z + r.d/2);
          items.push({ depth: avgDepth - 0.01, fn: () => {
            ctx.fillStyle = getCss('--text-mute');
            ctx.font = `${10*zoom}px system-ui`;
            ctx.textAlign = 'center';
            ctx.fillText(r.name, ctr.sx, ctr.sy);
            ctx.textAlign = 'start';
          }});
        });
      });

      // Sensors
      placed.forEach((p, i) => {
        const proj = project(p.x, p.y, p.z);
        items.push({ depth: proj.depth - 1, fn: () => drawSensor(ctx, p, proj, i === selectedIdx) });
      });

      // Draw sorted back-to-front
      items.sort((a,b) => b.depth - a.depth);
      items.forEach(it => it.fn());

      // Stats
      const total = placed.length;
      stat.innerHTML = `
        <div class="b3d-stat-block">
          <div class="b3d-stat-n">${total}</div>
          <div class="b3d-stat-l">Sensoren</div>
        </div>
        <div class="b3d-stat-block">
          <div class="b3d-stat-n">${yaw.toFixed(0)}°</div>
          <div class="b3d-stat-l">Rotation</div>
        </div>
        <div class="b3d-stat-block">
          <div class="b3d-stat-n">${(zoom*100).toFixed(0)}%</div>
          <div class="b3d-stat-l">Zoom</div>
        </div>
      `;
    }

    function drawGround(ctx) {
      const W = 25, D = 15;
      const c = [
        project(-4, -0.02, -3),
        project(-4 + W, -0.02, -3),
        project(-4 + W, -0.02, -3 + D),
        project(-4, -0.02, -3 + D),
      ];
      ctx.fillStyle = 'rgba(34,197,94,.06)';
      ctx.strokeStyle = 'rgba(34,197,94,.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(c[0].sx, c[0].sy);
      c.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    function drawSlab(ctx, corners, fi) {
      const colors = [
        'rgba(56,189,248,.08)',
        'rgba(129,140,248,.08)',
        'rgba(192,132,252,.08)',
      ];
      ctx.fillStyle = colors[fi % 3];
      ctx.strokeStyle = getCss('--border');
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(corners[0].sx, corners[0].sy);
      corners.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    function drawWalls(ctx, r, f, items) {
      // For each room edge, draw a translucent wall (only outer-facing for clarity, but we'll draw all)
      const corners = [
        [r.x,       f.y,         r.z],
        [r.x + r.w, f.y,         r.z],
        [r.x + r.w, f.y,         r.z + r.d],
        [r.x,       f.y,         r.z + r.d],
      ];
      const edges = [[0,1],[1,2],[2,3],[3,0]];
      edges.forEach(([a,b]) => {
        const A = corners[a], B = corners[b];
        const pA = project(A[0], A[1], A[2]);
        const pB = project(B[0], B[1], B[2]);
        const pAt = project(A[0], A[1]+f.h, A[2]);
        const pBt = project(B[0], B[1]+f.h, B[2]);
        const avgDepth = (pA.depth + pB.depth + pAt.depth + pBt.depth)/4;
        items.push({ depth: avgDepth, fn: () => {
          ctx.fillStyle = 'rgba(56,189,248,.06)';
          ctx.strokeStyle = getCss('--border-soft');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pA.sx, pA.sy);
          ctx.lineTo(pB.sx, pB.sy);
          ctx.lineTo(pBt.sx, pBt.sy);
          ctx.lineTo(pAt.sx, pAt.sy);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        }});
      });
    }

    function drawSensor(ctx, p, proj, isSelected) {
      const s = p.sensor;
      const range = p.range != null ? p.range : s.range;
      // 3D coverage
      if (s.type === 'sphere') {
        drawSphere(ctx, p.x, p.y, p.z, range, s.color, .25);
      } else if (s.type === 'cone') {
        drawCone(ctx, p.x, p.y, p.z, range, s.coneAngle, p.dir||0, s.color, .25);
      }
      // Sensor body
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, isSelected ? 10 : 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0b1424';
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, isSelected ? 5 : 4, 0, Math.PI*2); ctx.fill();
      // Vertical "stem" to floor
      const floorPoint = project(p.x, 0, p.z);
      ctx.strokeStyle = s.color;
      ctx.setLineDash([2,2]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(proj.sx, proj.sy);
      ctx.lineTo(floorPoint.sx, floorPoint.sy);
      ctx.stroke();
      ctx.setLineDash([]);
      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.arc(proj.sx, proj.sy, 18, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        // Direction handle
        if (s.type === 'cone') {
          const dir = p.dir || 0;
          const hx = p.x + Math.cos(dir) * 1.2;
          const hz = p.z + Math.sin(dir) * 1.2;
          const hp = project(hx, p.y, hz);
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(proj.sx, proj.sy); ctx.lineTo(hp.sx, hp.sy); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(hp.sx, hp.sy, 7, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#0b1424';
          ctx.font = 'bold 11px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText('↻', hp.sx, hp.sy+1);
          ctx.textAlign='start'; ctx.textBaseline='alphabetic';
        }
      }
    }

    function drawSphere(ctx, x, y, z, r, color, alpha) {
      // Draw ring at sensor height + a few stacked smaller rings for 3D feel
      const layers = 5;
      ctx.fillStyle = color;
      for (let i = 0; i < layers; i++) {
        const t = i / (layers-1);  // 0..1
        const yy = y + (t - .5) * r * 1.4;  // span height
        const rr = r * Math.sqrt(1 - Math.pow(2*t-1, 2)); // sphere radius at this slice
        if (rr < 0.1) continue;
        // Project ellipse with 16 points
        ctx.globalAlpha = alpha * (1 - Math.abs(2*t-1));
        ctx.beginPath();
        for (let a = 0; a < 32; a++) {
          const ang = a / 32 * Math.PI * 2;
          const p = project(x + Math.cos(ang)*rr, yy, z + Math.sin(ang)*rr);
          if (a === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawCone(ctx, x, y, z, range, angle, dir, color, alpha) {
      // Cone with apex at sensor, opening in direction dir
      const halfAngle = angle/2 * Math.PI/180;
      // Number of slices along the cone axis
      const slices = 6;
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      for (let i = 1; i <= slices; i++) {
        const t = i/slices;
        const r = range * t;
        const rr = r * Math.tan(halfAngle); // radius at this distance
        // Center of ring
        const cx = x + Math.cos(dir) * r;
        const cz = z + Math.sin(dir) * r;
        ctx.beginPath();
        for (let a = 0; a < 32; a++) {
          const ang = a / 32 * Math.PI * 2;
          // ring perpendicular to dir vector (in XZ plane + Y)
          const ux = -Math.sin(dir), uz = Math.cos(dir);
          const px = cx + ux*Math.cos(ang)*rr;
          const py = y + Math.sin(ang)*rr; // y-axis for vertical component
          const pz = cz + uz*Math.cos(ang)*rr;
          const p = project(px, py, pz);
          if (a === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.fill();
      }
      // Draw connecting lines from apex to edge of base ring for outline
      ctx.globalAlpha = alpha * 1.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      const apex = project(x, y, z);
      const slices2 = 8;
      for (let a = 0; a < slices2; a++) {
        const ang = a/slices2 * Math.PI * 2;
        const ux = -Math.sin(dir), uz = Math.cos(dir);
        const baseR = range * Math.tan(halfAngle);
        const ex = x + Math.cos(dir)*range + ux*Math.cos(ang)*baseR;
        const ey = y + Math.sin(ang)*baseR;
        const ez = z + Math.sin(dir)*range + uz*Math.cos(ang)*baseR;
        const ep = project(ex, ey, ez);
        ctx.beginPath();
        ctx.moveTo(apex.sx, apex.sy); ctx.lineTo(ep.sx, ep.sy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // ===== Picking & Interaction =====
    function findSensorAt(mx, my) {
      // Pick by screen-distance to projected sensor
      let bestI = -1, bestD = 22;
      for (let i = 0; i < placed.length; i++) {
        const p = placed[i];
        const sp = project(p.x, p.y, p.z);
        const d = Math.hypot(sp.sx - mx, sp.sy - my);
        if (d < bestD) { bestD = d; bestI = i; }
      }
      return bestI;
    }

    function findRotateHandleAt(mx, my) {
      if (selectedIdx < 0) return false;
      const p = placed[selectedIdx];
      if (p.sensor.type !== 'cone') return false;
      const dir = p.dir || 0;
      const hx = p.x + Math.cos(dir) * 1.2;
      const hz = p.z + Math.sin(dir) * 1.2;
      const hp = project(hx, p.y, hz);
      return Math.hypot(hp.sx - mx, hp.sy - my) < 14;
    }

    // World-coordinate from screen pos using ray cast onto current floor (y=0)
    function screenToWorldY(mx, my, y) {
      // Iteratively search: we want world (x,?,z) such that project(x,y,z) = (mx,my)
      // For our orthographic projection it's invertible.
      // Reverse the rotations:
      // Given (mx, my), reconstruct rx, ry, rrz:
      // sx = CENTER_X + rx * S  -> rx = (sx - CENTER_X)/S
      // sy = CENTER_Y - ry * S  -> ry = (CENTER_Y - sy)/S
      // We have ry = cy*cos(pitch) - rz*sin(pitch), where cy = y
      // So: rz = (cy*cos(pitch) - ry) / sin(pitch)
      const s = SCALE_BASE * zoom;
      const rx = (mx - CENTER_X())/s;
      const ry = (CENTER_Y() - my)/s;
      const pitchR = pitch * Math.PI/180;
      const yawR = yaw * Math.PI/180;
      let rz;
      if (Math.abs(Math.sin(pitchR)) > 0.001) {
        rz = (y * Math.cos(pitchR) - ry) / Math.sin(pitchR);
      } else {
        rz = 0;
      }
      // Undo yaw rotation:
      // rx = cx*cos(yaw) - cz*sin(yaw)
      // rz = cx*sin(yaw) + cz*cos(yaw)
      // cx = rx*cos(yaw) + rz*sin(yaw)
      // cz = -rx*sin(yaw) + rz*cos(yaw)
      const cx = rx * Math.cos(yawR) + rz * Math.sin(yawR);
      const cz = -rx * Math.sin(yawR) + rz * Math.cos(yawR);
      return { x: cx + 8, y, z: cz + 5 };
    }

    function getMouse(e) {
      const r = cv.getBoundingClientRect();
      return { mx: e.clientX - r.left, my: e.clientY - r.top };
    }

    cv.addEventListener('mousedown', e => {
      const { mx, my } = getMouse(e);
      if (findRotateHandleAt(mx, my)) {
        drag = { mode:'rotate', idx: selectedIdx, lastX: mx, lastY: my };
        return;
      }
      const hit = findSensorAt(mx, my);
      if (hit >= 0) {
        selectedIdx = hit;
        drag = { mode:'move', idx: hit, lastX: mx, lastY: my };
        renderSel(); draw();
      } else {
        // Place a new sensor at floor 0 (EG), mounted at 2.2m
        // Use floor 0 or first visible floor
        const firstVisible = floorVisible.findIndex(v => v);
        if (firstVisible < 0) { toast('Mindestens eine Etage einblenden'); return; }
        const f = FLOORS[firstVisible];
        const wp = screenToWorldY(mx, my, f.y + 2.2);
        // Inside any room?
        const inRoom = f.rooms.some(r =>
          wp.x >= r.x && wp.x <= r.x+r.w &&
          wp.z >= r.z && wp.z <= r.z+r.d
        );
        if (!inRoom) {
          // empty area click -> start view drag
          drag = { mode:'view', lastX: mx, lastY: my };
          return;
        }
        placed.push({
          x: wp.x, y: f.y + 2.2, z: wp.z,
          dir: 0, range: placeMode.range,
          sensor: placeMode
        });
        selectedIdx = placed.length - 1;
        renderSel(); autoSave(); draw();
      }
    });

    cv.addEventListener('mousemove', e => {
      if (!drag) return;
      const { mx, my } = getMouse(e);
      const dx = mx - drag.lastX, dy = my - drag.lastY;
      if (drag.mode === 'view') {
        yaw = (yaw + dx * 0.5) % 360;
        pitch = Math.max(5, Math.min(80, pitch - dy * 0.3));
      } else if (drag.mode === 'move') {
        const p = placed[drag.idx];
        const wp = screenToWorldY(mx, my, p.y);
        p.x = wp.x; p.z = wp.z;
      } else if (drag.mode === 'rotate') {
        const p = placed[drag.idx];
        const sp = project(p.x, p.y, p.z);
        p.dir = Math.atan2(my - sp.sy, mx - sp.sx);
      }
      drag.lastX = mx; drag.lastY = my;
      draw();
    });

    cv.addEventListener('mouseup', () => {
      if (drag && (drag.mode === 'move' || drag.mode === 'rotate')) autoSave();
      drag = null;
    });
    cv.addEventListener('mouseleave', () => { drag = null; });

    // Touch
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
    cv.addEventListener('touchend', () => cv.dispatchEvent(new MouseEvent('mouseup', { bubbles:true })));

    // View buttons
    viewCtrl.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.rot) { yaw = (yaw + +b.dataset.rot) % 360; draw(); }
      if (b.dataset.tilt === 'up')   { pitch = Math.max(5,  pitch - 5); draw(); }
      if (b.dataset.tilt === 'down') { pitch = Math.min(80, pitch + 5); draw(); }
      if (b.dataset.zoom === '+') { zoom = Math.min(3, zoom * 1.15); draw(); }
      if (b.dataset.zoom === '-') { zoom = Math.max(.4, zoom / 1.15); draw(); }
      if (b.dataset.reset) { yaw = 35; pitch = 30; zoom = 1.0; draw(); }
    });

    // Wheel zoom
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.deltaY < 0) zoom = Math.min(3, zoom * 1.1);
      else              zoom = Math.max(.4, zoom / 1.1);
      draw();
    }, { passive: false });

    function renderSel() {
      selPanel.innerHTML = '';
      if (selectedIdx < 0) { selPanel.style.display = 'none'; return; }
      const p = placed[selectedIdx];
      selPanel.style.display = '';
      const head = el('div', { class:'fp-selhead' }, [
        el('div', { class:'fp-selicon', html:`<i class="fas ${p.sensor.icon}"></i>`, style:`background:${p.sensor.color}; color:#0b1424;` }),
        el('div', { class:'fp-seltitle' }, [
          el('strong', { text: p.sensor.label + ' · #' + (selectedIdx+1) }),
          el('div', { class:'small muted', text: `x=${p.x.toFixed(1)}m, y=${p.y.toFixed(1)}m, z=${p.z.toFixed(1)}m · Reichweite ${(p.range||p.sensor.range).toFixed(1)}m` })
        ]),
        el('button', { class:'btn ghost', html:'<i class="fas fa-xmark"></i> Auswahl', onClick: () => { selectedIdx = -1; renderSel(); draw(); } }),
        el('button', { class:'btn', style:'border-color:var(--bad); color:var(--bad)', html:'<i class="fas fa-trash"></i> Löschen', onClick: () => {
          placed.splice(selectedIdx, 1); selectedIdx = -1; renderSel(); autoSave(); draw();
        }})
      ]);
      selPanel.appendChild(head);

      // Range slider
      const rRow = el('div', { class:'fp-control' });
      rRow.appendChild(el('label', { text: 'Reichweite' }));
      const rSlider = el('input', { type:'range', min:'1', max:'20', step:'0.5', value: String(p.range || p.sensor.range), class:'fp-slider' });
      const rOut = el('span', { class:'fp-out', text: (p.range||p.sensor.range).toFixed(1)+' m' });
      rSlider.addEventListener('input', () => { p.range = +rSlider.value; rOut.textContent = p.range.toFixed(1)+' m'; autoSave(); draw(); });
      rRow.appendChild(rSlider); rRow.appendChild(rOut);
      selPanel.appendChild(rRow);

      // Height slider
      const yRow = el('div', { class:'fp-control' });
      yRow.appendChild(el('label', { text: 'Höhe' }));
      const ySlider = el('input', { type:'range', min:'0', max:'8', step:'0.1', value: String(p.y), class:'fp-slider' });
      const yOut = el('span', { class:'fp-out', text: p.y.toFixed(1)+' m' });
      ySlider.addEventListener('input', () => { p.y = +ySlider.value; yOut.textContent = p.y.toFixed(1)+' m'; autoSave(); draw(); });
      yRow.appendChild(ySlider); yRow.appendChild(yOut);
      selPanel.appendChild(yRow);

      // Direction slider (cone only)
      if (p.sensor.type === 'cone') {
        const dRow = el('div', { class:'fp-control' });
        dRow.appendChild(el('label', { text: 'Richtung' }));
        const dSlider = el('input', { type:'range', min:'-180', max:'180', step:'5', value: String(Math.round((p.dir||0) * 180/Math.PI)), class:'fp-slider' });
        const dOut = el('span', { class:'fp-out', text: Math.round((p.dir||0)*180/Math.PI)+'°' });
        dSlider.addEventListener('input', () => { p.dir = +dSlider.value * Math.PI/180; dOut.textContent = dSlider.value+'°'; autoSave(); draw(); });
        dRow.appendChild(dSlider); dRow.appendChild(dOut);
        selPanel.appendChild(dRow);
      }
    }

    window.addEventListener('resize', draw);
    requestAnimationFrame(draw);
    renderSel();
    return root;
  }

  return { view };
})();
