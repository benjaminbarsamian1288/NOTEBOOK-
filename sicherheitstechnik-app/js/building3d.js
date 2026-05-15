/* 3D-Gebäudeplaner v2 – richtige isometrische 3D-Engine
   Solide, schattierte Wände, Dach, Türen/Fenster, glühende Sensoren,
   3D-Coverage als shaded Kegel/Sphären, animiertes Intro, sauberes Picking. */

window.BLDG3D = (() => {
  const { el, toast } = U;

  // World: x=west-east, y=up, z=north-south. (0,0,0) at SW-corner of EG.
  const FLOORS = [
    { name:'EG',  y: 0,   h: 2.6, color:'#3b5b8a', rooms: [
      { x:0,  z:0, w:6, d:5, name:'Wohnen', doors:[ {side:'S', at:3, w:1.0} ] },
      { x:6,  z:0, w:5, d:5, name:'Küche',  windows:[{side:'N', at:2.5, w:1.5}] },
      { x:11, z:0, w:5, d:5, name:'Bad',    windows:[{side:'E', at:2,   w:1.0}] },
      { x:0,  z:5, w:4, d:5, name:'Schlaf', windows:[{side:'W', at:2,   w:1.5}] },
      { x:4,  z:5, w:4, d:5, name:'Flur' },
      { x:8,  z:5, w:4, d:5, name:'Kind',   windows:[{side:'S', at:2,   w:1.2}] },
      { x:12, z:5, w:4, d:5, name:'Büro',   windows:[{side:'E', at:2,   w:1.2}] },
    ]},
    { name:'OG',  y: 2.6, h: 2.4, color:'#2f4670', rooms: [
      { x:0,  z:0, w:8, d:5, name:'Bad/Schlaf' },
      { x:8,  z:0, w:8, d:5, name:'Wohnen' },
      { x:0,  z:5, w:8, d:5, name:'Kind 1' },
      { x:8,  z:5, w:8, d:5, name:'Kind 2' },
    ]},
    { name:'DG',  y: 5.0, h: 2.2, color:'#243453', rooms: [
      { x:2,  z:2, w:12, d:6, name:'Dachboden', isAttic: true },
    ]},
  ];
  const BUILDING_W = 16, BUILDING_D = 10;

  const SENSORS = [
    { id:'pir',  label:'PIR',         color:'#fbbf24', range:6,   coneAngle:90,  type:'cone',   icon:'fa-eye' },
    { id:'dual', label:'Dual',        color:'#22c55e', range:7,   coneAngle:90,  type:'cone',   icon:'fa-shield-halved' },
    { id:'mw',   label:'Mikrowelle',  color:'#22d3ee', range:10,  coneAngle:110, type:'cone',   icon:'fa-tower-broadcast' },
    { id:'us',   label:'Ultraschall', color:'#a78bfa', range:5,   type:'sphere', icon:'fa-volume-high' },
    { id:'mag',  label:'Magnet',      color:'#c084fc', range:0.4, type:'sphere', icon:'fa-magnet' },
    { id:'glass',label:'Glasbruch',   color:'#38bdf8', range:6,   type:'sphere', icon:'fa-window-maximize' },
    { id:'fire', label:'Rauch',       color:'#ef4444', range:5,   type:'sphere', icon:'fa-fire' },
    { id:'cam',  label:'Kamera',      color:'#a3e635', range:10,  coneAngle:70, type:'cone',   icon:'fa-video' },
  ];

  // --- View state ---
  let yaw = 35;       // degrees, around Y
  let pitch = 28;     // degrees, around X
  let zoom = 1.0;
  let floorVisible = [true, true, true];
  let placed = [];
  let selectedIdx = -1;
  let drag = null;
  let canvasW = 800, canvasH = 560;
  const SCALE_BASE = 34;

  // --- Math helpers ---
  function project(x, y, z) {
    const cx = x - BUILDING_W/2;
    const cy = y;
    const cz = z - BUILDING_D/2;
    const yawR = yaw * Math.PI/180;
    const pitchR = pitch * Math.PI/180;
    // Yaw around Y
    const rx = cx * Math.cos(yawR) - cz * Math.sin(yawR);
    const rz = cx * Math.sin(yawR) + cz * Math.cos(yawR);
    // Pitch around X
    const ry = cy * Math.cos(pitchR) - rz * Math.sin(pitchR);
    const rrz = cy * Math.sin(pitchR) + rz * Math.cos(pitchR);
    const s = SCALE_BASE * zoom;
    return {
      sx: canvasW/2 + rx * s,
      sy: canvasH/2 + 60 - ry * s,
      depth: rrz
    };
  }
  function screenToWorldAtY(mx, my, worldY) {
    // Invert the projection chain for a given target world Y.
    const s = SCALE_BASE * zoom;
    const rx = (mx - canvasW/2) / s;
    const ry = (canvasH/2 + 60 - my) / s;
    const pitchR = pitch * Math.PI/180;
    const yawR = yaw * Math.PI/180;
    // rz from inverse pitch: ry = cy*cos(p) - rz*sin(p)  ->  rz = (cy*cos(p) - ry)/sin(p)
    let rz;
    if (Math.abs(Math.sin(pitchR)) > 0.001) {
      rz = (worldY * Math.cos(pitchR) - ry) / Math.sin(pitchR);
    } else {
      rz = 0;
    }
    // Inverse yaw: rx_world = rx*cos+rz*sin ; rz_world = -rx*sin+rz*cos
    const cx = rx * Math.cos(yawR) + rz * Math.sin(yawR);
    const cz = -rx * Math.sin(yawR) + rz * Math.cos(yawR);
    return { x: cx + BUILDING_W/2, y: worldY, z: cz + BUILDING_D/2 };
  }
  function getCss(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  // --- Lighting helper: shade based on wall normal direction ---
  function shade(baseHex, brightness) {
    // baseHex like '#3b5b8a'; brightness 0..1 (1=full)
    const r = parseInt(baseHex.slice(1,3), 16);
    const g = parseInt(baseHex.slice(3,5), 16);
    const b = parseInt(baseHex.slice(5,7), 16);
    const nr = Math.round(r * brightness);
    const ng = Math.round(g * brightness);
    const nb = Math.round(b * brightness);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }

  function view(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'3D · Räumliche Planung' }),
      el('h1', { text: '3D-Gebäudeplaner' }),
      el('p', { text: 'Echtes 3D-Haus mit Etagen, Wänden, Türen und Fenstern. Drag in leeren Bereich = Gebäude rotieren / kippen. Sensor wählen, dann in einen Raum tippen zum Platzieren. Sensor antippen, um zu drehen/verschieben.' })
    ]));

    const card = el('div', { class:'card b3d-card' });

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

    // Floor visibility chips + save/load
    const ctrlBar = el('div', { class: 'filterbar' });
    FLOORS.forEach((f, i) => {
      const c = el('button', { class: 'chip active', html: `<i class="fas fa-layer-group"></i> ${f.name}` });
      c.addEventListener('click', () => {
        floorVisible[i] = !floorVisible[i];
        c.classList.toggle('active', floorVisible[i]);
        draw();
      });
      ctrlBar.appendChild(c);
    });
    const saveBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-floppy-disk"></i>' });
    saveBtn.title = 'Speichern';
    const loadBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-folder-open"></i>' });
    loadBtn.title = 'Laden';
    const clearBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-trash"></i>' });
    clearBtn.title = 'Alles löschen';
    ctrlBar.appendChild(saveBtn); ctrlBar.appendChild(loadBtn); ctrlBar.appendChild(clearBtn);
    card.appendChild(ctrlBar);

    // Canvas
    const cv = el('canvas', { class: 'b3d-canvas' });
    card.appendChild(cv);

    // Compass + hint overlay
    const hint = el('div', { class:'b3d-hint' });
    hint.innerHTML = `<i class="fas fa-hand-pointer"></i> Drag zum Rotieren · Pinch / Wheel zum Zoomen · Tipp in Raum platziert Sensor`;
    card.appendChild(hint);

    // View controls
    const viewCtrl = el('div', { class: 'b3d-viewctrl' });
    viewCtrl.innerHTML = `
      <button class="btn ghost" data-rot="-20" title="Links drehen"><i class="fas fa-rotate-left"></i></button>
      <button class="btn ghost" data-rot="20"  title="Rechts drehen"><i class="fas fa-rotate-right"></i></button>
      <span class="b3d-sep"></span>
      <button class="btn ghost" data-tilt="up"   title="Mehr Aufsicht"><i class="fas fa-angle-up"></i></button>
      <button class="btn ghost" data-tilt="down" title="Seitenansicht"><i class="fas fa-angle-down"></i></button>
      <span class="b3d-sep"></span>
      <button class="btn ghost" data-zoom="-" title="Heraus"><i class="fas fa-minus"></i></button>
      <button class="btn ghost" data-zoom="+" title="Heran"><i class="fas fa-plus"></i></button>
      <span class="b3d-sep"></span>
      <button class="btn ghost" data-reset="1" title="Reset"><i class="fas fa-arrows-to-circle"></i></button>
      <button class="btn primary" data-fly="1" title="Animation"><i class="fas fa-helicopter"></i> Fly-In</button>
    `;
    card.appendChild(viewCtrl);

    // Stats + selection
    const stat = el('div', { class:'b3d-stat' });
    card.appendChild(stat);
    const selPanel = el('div', { class: 'fp-selpanel', style:'display:none' });
    card.appendChild(selPanel);

    root.appendChild(card);

    // Restore previous placement
    try {
      const last = JSON.parse(localStorage.getItem('st-b3d-last')||'null');
      if (last && Array.isArray(last)) {
        placed = last.map(p => ({
          x: p.x, y: p.y, z: p.z, dir: p.dir, range: p.range,
          sensor: SENSORS.find(s => s.id === p.sid) || SENSORS[0]
        }));
      }
    } catch {}

    // ===== Save/Load =====
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

    // ===== Canvas size =====
    function fit() {
      const W = cv.parentElement.clientWidth - 36;
      const H = 560;
      const dpr = window.devicePixelRatio || 1;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      canvasW = W; canvasH = H;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return ctx;
    }

    // ===== DRAWING =====
    function draw() {
      const ctx = fit();
      ctx.clearRect(0,0,canvasW,canvasH);

      // Background sky gradient
      const grd = ctx.createLinearGradient(0, 0, 0, canvasH);
      grd.addColorStop(0, 'rgba(11,20,36,.7)');
      grd.addColorStop(1, 'rgba(56,189,248,.05)');
      ctx.fillStyle = grd;
      ctx.fillRect(0,0,canvasW,canvasH);

      // Build a list of drawables {depth, fn}
      const items = [];

      // Ground plane (large, grid)
      drawGround(ctx, items);

      // Floors: draw slab + 4 outer walls + inner walls + roof (DG=roof shape)
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        drawFloor(ctx, items, f, fi);
      });

      // Sensors
      placed.forEach((p, i) => {
        const proj = project(p.x, p.y, p.z);
        items.push({ depth: proj.depth - 1.5, fn: () => drawSensor(ctx, p, proj, i === selectedIdx) });
      });

      // Compass (always on top)
      items.push({ depth: -10000, fn: () => drawCompass(ctx) });

      items.sort((a,b) => b.depth - a.depth);
      items.forEach(it => it.fn());

      // Stats
      stat.innerHTML = `
        <div class="b3d-stat-block"><div class="b3d-stat-n">${placed.length}</div><div class="b3d-stat-l">Sensoren</div></div>
        <div class="b3d-stat-block"><div class="b3d-stat-n">${yaw.toFixed(0)}°</div><div class="b3d-stat-l">Rotation</div></div>
        <div class="b3d-stat-block"><div class="b3d-stat-n">${pitch.toFixed(0)}°</div><div class="b3d-stat-l">Pitch</div></div>
        <div class="b3d-stat-block"><div class="b3d-stat-n">${(zoom*100).toFixed(0)}%</div><div class="b3d-stat-l">Zoom</div></div>
      `;
    }

    function drawGround(ctx, items) {
      const margin = 6;
      const c = [
        project(-margin, -0.01, -margin),
        project(BUILDING_W + margin, -0.01, -margin),
        project(BUILDING_W + margin, -0.01, BUILDING_D + margin),
        project(-margin, -0.01, BUILDING_D + margin),
      ];
      const avgD = (c[0].depth + c[2].depth) / 2;
      items.push({ depth: avgD + 200, fn: () => {
        ctx.save();
        // gradient
        const grd = ctx.createRadialGradient(
          (c[0].sx + c[2].sx)/2, (c[0].sy + c[2].sy)/2, 0,
          (c[0].sx + c[2].sx)/2, (c[0].sy + c[2].sy)/2, 400
        );
        grd.addColorStop(0, 'rgba(34,197,94,.16)');
        grd.addColorStop(1, 'rgba(34,197,94,.02)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(c[0].sx, c[0].sy);
        c.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.fill();
        // Grid lines (every 2m)
        ctx.strokeStyle = 'rgba(34,197,94,.18)';
        ctx.lineWidth = 1;
        for (let x = -margin; x <= BUILDING_W + margin; x += 2) {
          const a = project(x, -0.01, -margin);
          const b = project(x, -0.01, BUILDING_D + margin);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
        for (let z = -margin; z <= BUILDING_D + margin; z += 2) {
          const a = project(-margin, -0.01, z);
          const b = project(BUILDING_W + margin, -0.01, z);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
        ctx.restore();
      }});
    }

    function drawFloor(ctx, items, f, fi) {
      // Outer walls (building envelope, not per-room) for cleaner look
      // Determine extents of all rooms on this floor:
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      f.rooms.forEach(r => {
        minX = Math.min(minX, r.x); maxX = Math.max(maxX, r.x+r.w);
        minZ = Math.min(minZ, r.z); maxZ = Math.max(maxZ, r.z+r.d);
      });
      const fy = f.y, fh = f.h;

      // Floor slab (semi-translucent)
      const slabCorners = [
        project(minX, fy, minZ),
        project(maxX, fy, minZ),
        project(maxX, fy, maxZ),
        project(minX, fy, maxZ),
      ];
      const slabDepth = (slabCorners[0].depth + slabCorners[2].depth) / 2;
      items.push({ depth: slabDepth + 0.1, fn: () => {
        ctx.save();
        ctx.fillStyle = shade(f.color, 0.55);
        ctx.strokeStyle = 'rgba(255,255,255,.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(slabCorners[0].sx, slabCorners[0].sy);
        slabCorners.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Floor label
        const ctr = project((minX+maxX)/2, fy+0.02, (minZ+maxZ)/2);
        ctx.fillStyle = 'rgba(255,255,255,.5)';
        ctx.font = `bold ${14*zoom}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(f.name, ctr.sx, ctr.sy);
        ctx.textAlign = 'start';
        ctx.restore();
      }});

      // 4 outer walls with shading
      // Wall faces: N(z=minZ), E(x=maxX), S(z=maxZ), W(x=minX)
      const walls = [
        { side:'N', p1:[minX, fy, minZ], p2:[maxX, fy, minZ], normal:'N', bright:0.95 },
        { side:'E', p1:[maxX, fy, minZ], p2:[maxX, fy, maxZ], normal:'E', bright:0.7 },
        { side:'S', p1:[maxX, fy, maxZ], p2:[minX, fy, maxZ], normal:'S', bright:0.55 },
        { side:'W', p1:[minX, fy, maxZ], p2:[minX, fy, minZ], normal:'W', bright:0.8 },
      ];
      walls.forEach(w => {
        const [x1,y1,z1] = w.p1, [x2,y2,z2] = w.p2;
        const a = project(x1, y1, z1);
        const b = project(x2, y2, z2);
        const at = project(x1, y1+fh, z1);
        const bt = project(x2, y2+fh, z2);
        const wallDepth = (a.depth + b.depth + at.depth + bt.depth) / 4;
        items.push({ depth: wallDepth, fn: () => {
          ctx.save();
          ctx.fillStyle = shade(f.color, w.bright);
          ctx.strokeStyle = 'rgba(255,255,255,.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.lineTo(bt.sx, bt.sy);
          ctx.lineTo(at.sx, at.sy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }});
      });

      // Doors & Windows on EG
      if (fi === 0) {
        f.rooms.forEach(r => {
          (r.doors || []).forEach(door => drawOpening(ctx, items, f, r, door, 'door'));
          (r.windows || []).forEach(win => drawOpening(ctx, items, f, r, win, 'window'));
        });
      }

      // Inner walls (room separators) – darker, slim
      f.rooms.forEach(r => {
        const edges = [
          [[r.x, r.z], [r.x+r.w, r.z]],
          [[r.x+r.w, r.z], [r.x+r.w, r.z+r.d]],
          [[r.x+r.w, r.z+r.d], [r.x, r.z+r.d]],
          [[r.x, r.z+r.d], [r.x, r.z]],
        ];
        edges.forEach(([a,b]) => {
          // Only inner walls (not on outer envelope)
          const isOuter =
            (a[0]===minX && b[0]===minX) ||
            (a[0]===maxX && b[0]===maxX) ||
            (a[1]===minZ && b[1]===minZ) ||
            (a[1]===maxZ && b[1]===maxZ);
          if (isOuter) return;
          const p1 = project(a[0], fy, a[1]);
          const p2 = project(b[0], fy, b[1]);
          const p1t = project(a[0], fy + fh*0.85, a[1]);
          const p2t = project(b[0], fy + fh*0.85, b[1]);
          const wd = (p1.depth + p2.depth) / 2;
          items.push({ depth: wd - 0.05, fn: () => {
            ctx.save();
            ctx.fillStyle = shade(f.color, 0.4);
            ctx.strokeStyle = 'rgba(255,255,255,.15)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.lineTo(p2t.sx, p2t.sy);
            ctx.lineTo(p1t.sx, p1t.sy);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }});
        });

        // Room name label on slab
        const ctr = project(r.x + r.w/2, fy+0.02, r.z + r.d/2);
        items.push({ depth: slabDepth - 0.02, fn: () => {
          ctx.fillStyle = 'rgba(232,237,247,.85)';
          ctx.font = `${10.5*zoom}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText(r.name, ctr.sx, ctr.sy);
          ctx.textAlign = 'start';
        }});
      });

      // Roof for DG (pitched roof for top floor)
      if (f.name === 'DG') {
        drawRoof(ctx, items, f);
      } else if (fi === FLOORS.length - 1 || !floorVisible[fi+1]) {
        // flat slab on top (ceiling)
        const tc = [
          project(minX, fy+fh, minZ),
          project(maxX, fy+fh, minZ),
          project(maxX, fy+fh, maxZ),
          project(minX, fy+fh, maxZ),
        ];
        const td = (tc[0].depth + tc[2].depth) / 2;
        items.push({ depth: td + 0.05, fn: () => {
          ctx.save();
          ctx.fillStyle = shade(f.color, 1.1);
          ctx.strokeStyle = 'rgba(255,255,255,.2)';
          ctx.beginPath();
          ctx.moveTo(tc[0].sx, tc[0].sy);
          tc.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
          ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }});
      }
    }

    function drawOpening(ctx, items, f, r, op, kind) {
      const fy = f.y, fh = f.h;
      let p1, p2;
      const yBottom = (kind === 'window') ? fy + 0.9 : fy;
      const yTop    = (kind === 'window') ? fy + 2.0 : fy + 2.1;
      if (op.side === 'N') { p1 = [r.x + op.at, yBottom, r.z];          p2 = [r.x + op.at + op.w, yTop, r.z]; }
      if (op.side === 'S') { p1 = [r.x + op.at, yBottom, r.z + r.d];    p2 = [r.x + op.at + op.w, yTop, r.z + r.d]; }
      if (op.side === 'W') { p1 = [r.x,         yBottom, r.z + op.at];  p2 = [r.x, yTop, r.z + op.at + op.w]; }
      if (op.side === 'E') { p1 = [r.x + r.w,   yBottom, r.z + op.at];  p2 = [r.x + r.w, yTop, r.z + op.at + op.w]; }
      if (!p1) return;
      const a = project(p1[0], p1[1], p1[2]);
      const b = project(p2[0], p1[1], p2[2]);
      const c = project(p2[0], p2[1], p2[2]);
      const dd = project(p1[0], p2[1], p1[2]);
      const dep = (a.depth + b.depth + c.depth + dd.depth) / 4;
      items.push({ depth: dep - 0.02, fn: () => {
        ctx.save();
        ctx.fillStyle = (kind === 'window') ? 'rgba(56,189,248,.5)' : 'rgba(251,191,36,.6)';
        ctx.strokeStyle = (kind === 'window') ? '#38bdf8' : '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.lineTo(c.sx, c.sy); ctx.lineTo(dd.sx, dd.sy);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        if (kind === 'window') {
          // cross frame
          const mid1 = { sx:(a.sx+b.sx)/2, sy:(a.sy+b.sy)/2 };
          const mid2 = { sx:(c.sx+dd.sx)/2, sy:(c.sy+dd.sy)/2 };
          const mid3 = { sx:(a.sx+dd.sx)/2, sy:(a.sy+dd.sy)/2 };
          const mid4 = { sx:(b.sx+c.sx)/2, sy:(b.sy+c.sy)/2 };
          ctx.beginPath(); ctx.moveTo(mid1.sx, mid1.sy); ctx.lineTo(mid2.sx, mid2.sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(mid3.sx, mid3.sy); ctx.lineTo(mid4.sx, mid4.sy); ctx.stroke();
        }
        ctx.restore();
      }});
    }

    function drawRoof(ctx, items, f) {
      // Simple pitched roof over building extents
      const fy = f.y + f.h;
      const peakY = fy + 2.5;
      const peakX = BUILDING_W/2;
      // 4 surfaces: 2 sloped + 2 gables
      // Gable triangles
      const lN = project(0, fy, 0), rN = project(BUILDING_W, fy, 0), peakN = project(peakX, peakY, 0);
      const lS = project(0, fy, BUILDING_D), rS = project(BUILDING_W, fy, BUILDING_D), peakS = project(peakX, peakY, BUILDING_D);
      items.push({ depth: lN.depth - 0.5, fn: () => {
        ctx.save();
        ctx.fillStyle = shade('#5a2e2e', 0.95);
        ctx.strokeStyle = 'rgba(255,255,255,.25)';
        ctx.beginPath();
        ctx.moveTo(lN.sx, lN.sy); ctx.lineTo(rN.sx, rN.sy); ctx.lineTo(peakN.sx, peakN.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }});
      items.push({ depth: lS.depth - 0.5, fn: () => {
        ctx.save();
        ctx.fillStyle = shade('#5a2e2e', 0.65);
        ctx.strokeStyle = 'rgba(255,255,255,.25)';
        ctx.beginPath();
        ctx.moveTo(lS.sx, lS.sy); ctx.lineTo(rS.sx, rS.sy); ctx.lineTo(peakS.sx, peakS.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }});
      // West slope
      items.push({ depth: lN.depth - 0.3, fn: () => {
        ctx.save();
        ctx.fillStyle = shade('#5a2e2e', 0.85);
        ctx.strokeStyle = 'rgba(255,255,255,.25)';
        ctx.beginPath();
        ctx.moveTo(lN.sx, lN.sy); ctx.lineTo(lS.sx, lS.sy);
        ctx.lineTo(peakS.sx, peakS.sy); ctx.lineTo(peakN.sx, peakN.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }});
      // East slope
      items.push({ depth: rN.depth - 0.3, fn: () => {
        ctx.save();
        ctx.fillStyle = shade('#5a2e2e', 0.7);
        ctx.strokeStyle = 'rgba(255,255,255,.25)';
        ctx.beginPath();
        ctx.moveTo(rN.sx, rN.sy); ctx.lineTo(rS.sx, rS.sy);
        ctx.lineTo(peakS.sx, peakS.sy); ctx.lineTo(peakN.sx, peakN.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }});
    }

    function drawSensor(ctx, p, proj, isSelected) {
      const s = p.sensor;
      const range = p.range != null ? p.range : s.range;
      // 3D coverage
      if (s.type === 'sphere') drawSphereCoverage(ctx, p.x, p.y, p.z, range, s.color);
      else if (s.type === 'cone') drawConeCoverage(ctx, p.x, p.y, p.z, range, s.coneAngle, p.dir||0, s.color);

      // Vertical stem from sensor to floor (faded line)
      const floorPt = project(p.x, 0, p.z);
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = 0.4;
      ctx.setLineDash([3,3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(proj.sx, proj.sy);
      ctx.lineTo(floorPt.sx, floorPt.sy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Glow halo
      const haloR = isSelected ? 22 : 14;
      const haloGrd = ctx.createRadialGradient(proj.sx, proj.sy, 0, proj.sx, proj.sy, haloR);
      haloGrd.addColorStop(0, s.color);
      haloGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haloGrd;
      ctx.globalAlpha = isSelected ? 0.9 : 0.55;
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, haloR, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;

      // Sensor body (3D ball with shading)
      const r = isSelected ? 9 : 7;
      const bodyGrd = ctx.createRadialGradient(proj.sx - r*0.3, proj.sy - r*0.3, 0, proj.sx, proj.sy, r);
      bodyGrd.addColorStop(0, '#ffffff');
      bodyGrd.addColorStop(0.4, s.color);
      bodyGrd.addColorStop(1, shade('#000000', 0.4));
      ctx.fillStyle = bodyGrd;
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(0,0,0,.5)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Selection markers
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5,5]);
        ctx.beginPath(); ctx.arc(proj.sx, proj.sy, 22, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        // Rotation handle
        if (s.type === 'cone') {
          const dir = p.dir || 0;
          const hp = project(p.x + Math.cos(dir)*1.2, p.y, p.z + Math.sin(dir)*1.2);
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(proj.sx, proj.sy); ctx.lineTo(hp.sx, hp.sy); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(hp.sx, hp.sy, 9, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#0b1424'; ctx.font = 'bold 12px system-ui';
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText('↻', hp.sx, hp.sy+1);
          ctx.textAlign='start'; ctx.textBaseline='alphabetic';
        }
      }
    }

    function drawSphereCoverage(ctx, x, y, z, r, color) {
      // 7 stacked elliptical slices for nice 3D-sphere look
      ctx.save();
      const slices = 9;
      for (let i = 0; i < slices; i++) {
        const t = i / (slices-1);
        const yy = y + (t - .5) * r * 1.6;
        const rr = r * Math.sqrt(Math.max(0, 1 - Math.pow(2*t-1, 2)));
        if (rr < 0.05) continue;
        ctx.globalAlpha = 0.22 * (1 - Math.abs(2*t-1) * 0.7);
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let a = 0; a < 32; a++) {
          const ang = a/32 * Math.PI*2;
          const p = project(x + Math.cos(ang)*rr, yy, z + Math.sin(ang)*rr);
          if (a === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.fill();
      }
      // Outline at equator
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let a = 0; a < 64; a++) {
        const ang = a/64 * Math.PI*2;
        const p = project(x + Math.cos(ang)*r, y, z + Math.sin(ang)*r);
        if (a === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    function drawConeCoverage(ctx, x, y, z, range, angleDeg, dir, color) {
      const halfAngle = angleDeg/2 * Math.PI/180;
      const slices = 8;
      ctx.save();
      // Fan of filled triangles (from apex to ring slices) for layered transparency
      for (let i = 1; i <= slices; i++) {
        const t = i/slices;
        const r = range * t;
        const rr = r * Math.tan(halfAngle);
        const cx = x + Math.cos(dir) * r;
        const cz = z + Math.sin(dir) * r;
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = color;
        const ux = -Math.sin(dir), uz = Math.cos(dir);
        ctx.beginPath();
        for (let a = 0; a < 32; a++) {
          const ang = a/32 * Math.PI*2;
          const px = cx + ux*Math.cos(ang)*rr;
          const py = y + Math.sin(ang)*rr;
          const pz = cz + uz*Math.cos(ang)*rr;
          const p = project(px, py, pz);
          if (a === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.fill();
      }
      // Outline rays from apex
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      const apex = project(x, y, z);
      const slices2 = 12;
      for (let a = 0; a < slices2; a++) {
        const ang = a/slices2 * Math.PI*2;
        const ux = -Math.sin(dir), uz = Math.cos(dir);
        const baseR = range * Math.tan(halfAngle);
        const ex = x + Math.cos(dir)*range + ux*Math.cos(ang)*baseR;
        const ey = y + Math.sin(ang)*baseR;
        const ez = z + Math.sin(dir)*range + uz*Math.cos(ang)*baseR;
        const ep = project(ex, ey, ez);
        ctx.beginPath();
        ctx.moveTo(apex.sx, apex.sy); ctx.lineTo(ep.sx, ep.sy); ctx.stroke();
      }
      ctx.restore();
    }

    function drawCompass(ctx) {
      const cx = 60, cy = 60;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.stroke();
      // North arrow
      const yawR = yaw * Math.PI/180;
      const tipX = cx + Math.sin(yawR) * 22;
      const tipY = cy - Math.cos(yawR) * 22;
      const baseX = cx - Math.sin(yawR) * 12;
      const baseY = cy + Math.cos(yawR) * 12;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      const perpX = Math.cos(yawR) * 6, perpY = Math.sin(yawR) * 6;
      ctx.lineTo(baseX - perpX, baseY - perpY);
      ctx.lineTo(baseX + perpX, baseY + perpY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('N', tipX, tipY - 4);
      ctx.textAlign = 'start';
      ctx.restore();
    }

    // ===== Interaction =====
    function findSensorAt(mx, my) {
      let bestI = -1, bestD = 28;
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
      const hp = project(p.x + Math.cos(dir)*1.2, p.y, p.z + Math.sin(dir)*1.2);
      return Math.hypot(hp.sx - mx, hp.sy - my) < 16;
    }
    function pointInRoom(wp, f) {
      return f.rooms.find(r =>
        wp.x >= r.x && wp.x <= r.x+r.w &&
        wp.z >= r.z && wp.z <= r.z+r.d
      );
    }
    function getMouse(e) {
      const r = cv.getBoundingClientRect();
      return { mx: e.clientX - r.left, my: e.clientY - r.top };
    }

    cv.addEventListener('mousedown', e => {
      const { mx, my } = getMouse(e);
      if (findRotateHandleAt(mx, my)) {
        drag = { mode:'rotate', idx: selectedIdx, lastX: mx, lastY: my, moved: false };
        return;
      }
      const hit = findSensorAt(mx, my);
      if (hit >= 0) {
        selectedIdx = hit;
        drag = { mode:'move', idx: hit, lastX: mx, lastY: my, moved: false };
        renderSel(); draw();
        return;
      }
      // Try placing on top visible floor (use first visible)
      drag = { mode:'view', lastX: mx, lastY: my, downX: mx, downY: my, moved: false,
               clickMx: mx, clickMy: my };
    });

    cv.addEventListener('mousemove', e => {
      if (!drag) return;
      const { mx, my } = getMouse(e);
      const dx = mx - drag.lastX, dy = my - drag.lastY;
      if (Math.hypot(mx - (drag.downX||drag.lastX), my - (drag.downY||drag.lastY)) > 4) drag.moved = true;
      if (drag.mode === 'view') {
        yaw = (yaw + dx * 0.5);
        pitch = Math.max(5, Math.min(80, pitch - dy * 0.3));
      } else if (drag.mode === 'move') {
        const p = placed[drag.idx];
        const wp = screenToWorldAtY(mx, my, p.y);
        // Clamp to building
        p.x = Math.max(0, Math.min(BUILDING_W, wp.x));
        p.z = Math.max(0, Math.min(BUILDING_D, wp.z));
      } else if (drag.mode === 'rotate') {
        const p = placed[drag.idx];
        const sp = project(p.x, p.y, p.z);
        p.dir = Math.atan2(my - sp.sy, mx - sp.sx);
      }
      drag.lastX = mx; drag.lastY = my;
      draw();
    });

    cv.addEventListener('mouseup', e => {
      if (!drag) return;
      const { mx, my } = getMouse(e);
      // If empty area click (no move) → try place
      if (drag.mode === 'view' && !drag.moved) {
        const firstVisible = floorVisible.findIndex(v => v);
        if (firstVisible >= 0) {
          const f = FLOORS[firstVisible];
          // Try place at f.y + 2.2m
          const wp = screenToWorldAtY(mx, my, f.y + 2.2);
          const room = pointInRoom(wp, f);
          if (room) {
            placed.push({
              x: wp.x, y: f.y + 2.2, z: wp.z,
              dir: 0, range: placeMode.range,
              sensor: placeMode
            });
            selectedIdx = placed.length - 1;
            renderSel(); autoSave(); draw();
          }
        }
      }
      if (drag.mode === 'move' || drag.mode === 'rotate') autoSave();
      drag = null;
    });

    cv.addEventListener('mouseleave', () => { drag = null; });
    cv.addEventListener('contextmenu', e => { e.preventDefault(); });

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
    cv.addEventListener('touchend', e => {
      const t = e.changedTouches[0];
      cv.dispatchEvent(new MouseEvent('mouseup', { clientX: t.clientX, clientY: t.clientY, bubbles:true }));
    });

    viewCtrl.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.rot)  { yaw = yaw + +b.dataset.rot; draw(); }
      if (b.dataset.tilt === 'up')   { pitch = Math.max(5,  pitch - 7); draw(); }
      if (b.dataset.tilt === 'down') { pitch = Math.min(80, pitch + 7); draw(); }
      if (b.dataset.zoom === '+') { zoom = Math.min(3, zoom * 1.15); draw(); }
      if (b.dataset.zoom === '-') { zoom = Math.max(.4, zoom / 1.15); draw(); }
      if (b.dataset.reset) { yaw = 35; pitch = 28; zoom = 1.0; draw(); }
      if (b.dataset.fly)   { flyIn(); }
    });

    cv.addEventListener('wheel', e => {
      e.preventDefault();
      if (e.deltaY < 0) zoom = Math.min(3, zoom * 1.1);
      else              zoom = Math.max(.4, zoom / 1.1);
      draw();
    }, { passive: false });

    // Fly-In animation
    function flyIn() {
      const startYaw = 0, startPitch = 85, startZoom = 0.45;
      const endYaw = 35, endPitch = 28, endZoom = 1.0;
      const dur = 2200;
      const t0 = performance.now();
      function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        yaw = startYaw + (endYaw - startYaw) * e;
        pitch = startPitch + (endPitch - startPitch) * e;
        zoom = startZoom + (endZoom - startZoom) * e;
        draw();
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function renderSel() {
      selPanel.innerHTML = '';
      if (selectedIdx < 0) { selPanel.style.display = 'none'; return; }
      const p = placed[selectedIdx];
      selPanel.style.display = '';
      const head = el('div', { class:'fp-selhead' }, [
        el('div', { class:'fp-selicon', html:`<i class="fas ${p.sensor.icon}"></i>`, style:`background:${p.sensor.color}; color:#0b1424;` }),
        el('div', { class:'fp-seltitle' }, [
          el('strong', { text: p.sensor.label + ' · #' + (selectedIdx+1) }),
          el('div', { class:'small muted', text: `x=${p.x.toFixed(1)}m, y=${p.y.toFixed(1)}m, z=${p.z.toFixed(1)}m · R=${(p.range||p.sensor.range).toFixed(1)}m` })
        ]),
        el('button', { class:'btn ghost', html:'<i class="fas fa-xmark"></i>', onClick: () => { selectedIdx = -1; renderSel(); draw(); } }),
        el('button', { class:'btn', style:'border-color:var(--bad); color:var(--bad)', html:'<i class="fas fa-trash"></i>', onClick: () => {
          placed.splice(selectedIdx, 1); selectedIdx = -1; renderSel(); autoSave(); draw();
        }})
      ]);
      selPanel.appendChild(head);

      const rRow = el('div', { class:'fp-control' });
      rRow.appendChild(el('label', { text: 'Reichweite' }));
      const rSlider = el('input', { type:'range', min:'0.5', max:'20', step:'0.5', value: String(p.range || p.sensor.range), class:'fp-slider' });
      const rOut = el('span', { class:'fp-out', text: (p.range||p.sensor.range).toFixed(1)+' m' });
      rSlider.addEventListener('input', () => { p.range = +rSlider.value; rOut.textContent = p.range.toFixed(1)+' m'; autoSave(); draw(); });
      rRow.appendChild(rSlider); rRow.appendChild(rOut);
      selPanel.appendChild(rRow);

      const yRow = el('div', { class:'fp-control' });
      yRow.appendChild(el('label', { text: 'Höhe' }));
      const ySlider = el('input', { type:'range', min:'0', max:'8', step:'0.1', value: String(p.y), class:'fp-slider' });
      const yOut = el('span', { class:'fp-out', text: p.y.toFixed(1)+' m' });
      ySlider.addEventListener('input', () => { p.y = +ySlider.value; yOut.textContent = p.y.toFixed(1)+' m'; autoSave(); draw(); });
      yRow.appendChild(ySlider); yRow.appendChild(yOut);
      selPanel.appendChild(yRow);

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
    setTimeout(flyIn, 300);  // intro animation
    return root;
  }

  return { view };
})();
