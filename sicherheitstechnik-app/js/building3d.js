/* 3D-Gebäudeplaner v3 – ÜBERSICHTLICH:
   - Sensor-Sidebar links mit großen Karten
   - Schwebende View-Controls oben rechts im Canvas
   - Floor-Toggle als Pille oben links
   - Status + Actions am unteren Rand
   - Klar getrennte Bereiche */

window.BLDG3D = (() => {
  const { el, toast } = U;

  // ---- Welt-Modell ----
  const FLOORS = [
    { name:'EG',  y: 0,   h: 2.6, color:'#3b5b8a', rooms: [
      { x:0,  z:0, w:6, d:5, name:'Wohnen' },
      { x:6,  z:0, w:5, d:5, name:'Küche' },
      { x:11, z:0, w:5, d:5, name:'Bad' },
      { x:0,  z:5, w:4, d:5, name:'Schlaf' },
      { x:4,  z:5, w:4, d:5, name:'Flur' },
      { x:8,  z:5, w:4, d:5, name:'Kind' },
      { x:12, z:5, w:4, d:5, name:'Büro' },
    ]},
    { name:'OG',  y: 2.6, h: 2.4, color:'#2f4670', rooms: [
      { x:0,  z:0, w:8, d:5, name:'Bad/Schlaf' },
      { x:8,  z:0, w:8, d:5, name:'Wohnen' },
      { x:0,  z:5, w:8, d:5, name:'Kind 1' },
      { x:8,  z:5, w:8, d:5, name:'Kind 2' },
    ]},
    { name:'DG',  y: 5.0, h: 2.2, color:'#243453', rooms: [
      { x:2,  z:2, w:12, d:6, name:'Dachboden' },
    ]},
  ];
  const BUILDING_W = 16, BUILDING_D = 10;

  const SENSORS = [
    { id:'pir',  label:'PIR',         color:'#fbbf24', range:6,   coneAngle:90,  type:'cone',   icon:'fa-eye',           desc:'Wärme-Bewegung' },
    { id:'dual', label:'Dual',        color:'#22c55e', range:7,   coneAngle:90,  type:'cone',   icon:'fa-shield-halved', desc:'PIR + Mikrowelle' },
    { id:'mw',   label:'Mikrowelle',  color:'#22d3ee', range:10,  coneAngle:110, type:'cone',   icon:'fa-tower-broadcast',desc:'Doppler-Radar' },
    { id:'us',   label:'Ultraschall', color:'#a78bfa', range:5,   type:'sphere', icon:'fa-volume-high',   desc:'40 kHz' },
    { id:'mag',  label:'Magnet',      color:'#c084fc', range:0.4, type:'sphere', icon:'fa-magnet',        desc:'Tür/Fenster' },
    { id:'glass',label:'Glasbruch',   color:'#38bdf8', range:6,   type:'sphere', icon:'fa-window-maximize',desc:'Akustisch' },
    { id:'fire', label:'Rauch',       color:'#ef4444', range:5,   type:'sphere', icon:'fa-fire',          desc:'Brandmelder' },
    { id:'cam',  label:'Kamera',      color:'#a3e635', range:10,  coneAngle:70,  type:'cone',   icon:'fa-video',         desc:'Video' },
  ];

  // ---- Status ----
  let yaw = 35, pitch = 28, zoom = 1.0;
  let floorVisible = [true, true, true];
  let placed = [];
  let selectedIdx = -1;
  let drag = null;
  let canvasW = 800, canvasH = 560;
  const SCALE_BASE = 34;
  let placeMode = SENSORS[0];

  function project(x, y, z) {
    const cx = x - BUILDING_W/2;
    const cy = y;
    const cz = z - BUILDING_D/2;
    const yawR = yaw * Math.PI/180;
    const pitchR = pitch * Math.PI/180;
    const rx = cx * Math.cos(yawR) - cz * Math.sin(yawR);
    const rz = cx * Math.sin(yawR) + cz * Math.cos(yawR);
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
    const s = SCALE_BASE * zoom;
    const rx = (mx - canvasW/2) / s;
    const ry = (canvasH/2 + 60 - my) / s;
    const pitchR = pitch * Math.PI/180;
    const yawR = yaw * Math.PI/180;
    let rz;
    if (Math.abs(Math.sin(pitchR)) > 0.001) {
      rz = (worldY * Math.cos(pitchR) - ry) / Math.sin(pitchR);
    } else rz = 0;
    const cx = rx * Math.cos(yawR) + rz * Math.sin(yawR);
    const cz = -rx * Math.sin(yawR) + rz * Math.cos(yawR);
    return { x: cx + BUILDING_W/2, y: worldY, z: cz + BUILDING_D/2 };
  }
  function shade(hex, b) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const bl = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.round(r*b)},${Math.round(g*b)},${Math.round(bl*b)})`;
  }
  function getCss(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  function view(d) {
    // Reset state on entry
    selectedIdx = -1;
    try {
      const last = JSON.parse(localStorage.getItem('st-b3d-last')||'null');
      if (last && Array.isArray(last)) {
        placed = last.map(p => ({
          x: p.x, y: p.y, z: p.z, dir: p.dir, range: p.range,
          sensor: SENSORS.find(s => s.id === p.sid) || SENSORS[0]
        }));
      }
    } catch {}

    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'3D · Räumliche Planung' }),
      el('h1', { text: '3D-Gebäudeplaner' }),
    ]));

    // ===== Step-hint at top =====
    const hint = el('div', { class:'b3d-howto' });
    hint.innerHTML = `
      <div class="b3d-step"><span class="b3d-step-n">1</span><span>Sensor links wählen</span></div>
      <div class="b3d-step"><span class="b3d-step-n">2</span><span>In Raum tippen</span></div>
      <div class="b3d-step"><span class="b3d-step-n">3</span><span>Sensor antippen → bearbeiten</span></div>
      <div class="b3d-step"><span class="b3d-step-n">4</span><span>Leeren Bereich draggen → drehen</span></div>
    `;
    root.appendChild(hint);

    // ===== Main two-column layout =====
    const layout = el('div', { class:'b3d-layout' });
    root.appendChild(layout);

    // --- LEFT: sensor sidebar ---
    const sidebar = el('div', { class:'b3d-sidebar' });
    sidebar.appendChild(el('div', { class:'b3d-side-title', text:'SENSOREN' }));
    SENSORS.forEach(s => {
      const tile = el('button', { class: 'b3d-sensor-tile' + (s.id===placeMode.id?' active':''), dataset:{id: s.id} });
      tile.style.setProperty('--c', s.color);
      tile.innerHTML = `
        <div class="b3d-sensor-icon"><i class="fas ${s.icon}"></i></div>
        <div class="b3d-sensor-body">
          <div class="b3d-sensor-lbl">${s.label}</div>
          <div class="b3d-sensor-desc">${s.desc}</div>
        </div>
      `;
      tile.addEventListener('click', () => {
        placeMode = s;
        sidebar.querySelectorAll('.b3d-sensor-tile').forEach(x => x.classList.toggle('active', x.dataset.id===s.id));
      });
      sidebar.appendChild(tile);
    });
    layout.appendChild(sidebar);

    // --- RIGHT: canvas area ---
    const canvasArea = el('div', { class:'b3d-canvas-area' });
    layout.appendChild(canvasArea);

    // Canvas
    const cv = el('canvas', { class: 'b3d-canvas-clean' });
    canvasArea.appendChild(cv);

    // Floating: floor toggle (top-left)
    const floorBox = el('div', { class:'b3d-floating b3d-floors' });
    FLOORS.forEach((f, i) => {
      const b = el('button', { class:'b3d-floor-chip active', dataset:{i}, text: f.name });
      b.addEventListener('click', () => {
        floorVisible[i] = !floorVisible[i];
        b.classList.toggle('active', floorVisible[i]);
        draw();
      });
      floorBox.appendChild(b);
    });
    canvasArea.appendChild(floorBox);

    // Floating: view controls (top-right)
    const viewBox = el('div', { class:'b3d-floating b3d-viewbox' });
    viewBox.innerHTML = `
      <button class="b3d-vbtn" data-rot="-20" title="Links drehen"><i class="fas fa-rotate-left"></i></button>
      <button class="b3d-vbtn" data-rot="20"  title="Rechts drehen"><i class="fas fa-rotate-right"></i></button>
      <button class="b3d-vbtn" data-tilt="up"   title="Mehr Aufsicht"><i class="fas fa-angle-up"></i></button>
      <button class="b3d-vbtn" data-tilt="down" title="Seitenansicht"><i class="fas fa-angle-down"></i></button>
      <button class="b3d-vbtn" data-zoom="+" title="Heran"><i class="fas fa-plus"></i></button>
      <button class="b3d-vbtn" data-zoom="-" title="Heraus"><i class="fas fa-minus"></i></button>
      <button class="b3d-vbtn b3d-vbtn-acc" data-reset="1" title="Reset"><i class="fas fa-arrows-to-circle"></i></button>
    `;
    canvasArea.appendChild(viewBox);

    // Floating: selection panel (bottom of canvas when something selected)
    const selPanel = el('div', { class:'b3d-floating b3d-selpanel', style:'display:none' });
    canvasArea.appendChild(selPanel);

    // ===== Bottom status bar =====
    const status = el('div', { class:'b3d-status' });
    root.appendChild(status);

    // Bottom action bar
    const actions = el('div', { class:'b3d-actions' });
    const autoBtn = el('button', { class:'btn primary', html:'<i class="fas fa-wand-magic-sparkles"></i> Auto-Plan' });
    const saveBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-floppy-disk"></i> Speichern' });
    const loadBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-folder-open"></i> Laden' });
    const clearBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-trash"></i> Alle löschen' });
    actions.appendChild(autoBtn); actions.appendChild(saveBtn);
    actions.appendChild(loadBtn); actions.appendChild(clearBtn);
    root.appendChild(actions);

    // --- Auto Plan ---
    autoBtn.addEventListener('click', () => {
      if (placed.length && !confirm(`${placed.length} bestehende Sensoren werden überschrieben. Fortfahren?`)) return;
      const nPlaced = [];
      // For visible floors: place PIR in each room corner, Rauchmelder in center
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        f.rooms.forEach(r => {
          // PIR in corner
          nPlaced.push({
            x: r.x + 0.6, y: f.y + 2.2, z: r.z + 0.6,
            dir: Math.PI/4,
            range: Math.min(r.w, r.d, 6),
            sensor: SENSORS.find(s=>s.id==='pir')
          });
          // Rauchmelder middle
          if (r.name !== 'Bad') {
            nPlaced.push({
              x: r.x + r.w/2, y: f.y + 2.2, z: r.z + r.d/2,
              dir: 0,
              range: Math.min(r.w/2, r.d/2, 4),
              sensor: SENSORS.find(s=>s.id==='fire')
            });
          }
          // Glasbruch in wertvollen Räumen
          if (['Wohnen','Schlaf','Büro','Kind','Kind 1','Kind 2'].includes(r.name)) {
            nPlaced.push({
              x: r.x + r.w/2, y: f.y + 2.2, z: r.z + r.d*0.7,
              dir: 0, range: 6,
              sensor: SENSORS.find(s=>s.id==='glass')
            });
          }
        });
      });
      placed = nPlaced;
      selectedIdx = -1;
      autoSave();
      renderSel(); draw();
      toast(`${nPlaced.length} Sensoren platziert`);
    });

    saveBtn.addEventListener('click', () => {
      const name = prompt('3D-Plan-Name?', `Plan · ${new Date().toLocaleDateString('de-DE')}`);
      if (!name) return;
      let plans = []; try { plans = JSON.parse(localStorage.getItem('st-b3d-plans')||'[]'); } catch {}
      plans.push({ name, ts: Date.now(), data: placed.map(p => ({ x:p.x, y:p.y, z:p.z, dir:p.dir, range:p.range, sid:p.sensor.id })) });
      localStorage.setItem('st-b3d-plans', JSON.stringify(plans));
      toast(`„${name}" gespeichert`);
    });
    loadBtn.addEventListener('click', () => {
      let plans = []; try { plans = JSON.parse(localStorage.getItem('st-b3d-plans')||'[]'); } catch {}
      if (!plans.length) { toast('Keine Pläne gespeichert'); return; }
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
      if (!confirm(`Alle ${placed.length} Sensoren löschen?`)) return;
      placed = []; selectedIdx = -1; renderSel(); autoSave(); draw();
    });

    function autoSave() {
      localStorage.setItem('st-b3d-last', JSON.stringify(
        placed.map(p => ({ x:p.x, y:p.y, z:p.z, dir:p.dir, range:p.range, sid:p.sensor.id }))
      ));
    }

    function fit() {
      const W = cv.parentElement.clientWidth - 2;
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
      // Background
      const bg = ctx.createLinearGradient(0,0,0,canvasH);
      bg.addColorStop(0, 'rgba(11,20,36,.8)');
      bg.addColorStop(1, 'rgba(56,189,248,.06)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,canvasW,canvasH);

      const items = [];
      drawGround(ctx, items);
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        drawFloor(ctx, items, f, fi);
      });
      placed.forEach((p, i) => {
        const proj = project(p.x, p.y, p.z);
        items.push({ depth: proj.depth - 1.5, fn: () => drawSensor(ctx, p, proj, i === selectedIdx) });
      });
      items.push({ depth: -10000, fn: () => drawCompass(ctx) });
      items.sort((a,b) => b.depth - a.depth);
      items.forEach(it => it.fn());

      // Stats
      let totalCount = 0, byType = {};
      placed.forEach(p => { totalCount++; byType[p.sensor.id] = (byType[p.sensor.id]||0)+1; });
      const typeChips = Object.entries(byType).map(([id, n]) => {
        const s = SENSORS.find(x=>x.id===id);
        return `<span class="b3d-typechip" style="--c:${s.color}"><i class="fas ${s.icon}"></i> ${n}× ${s.label}</span>`;
      }).join('');
      status.innerHTML = `
        <div class="b3d-stats-main">
          <div class="b3d-stat-pill"><i class="fas fa-microchip"></i> <strong>${totalCount}</strong> Sensoren</div>
          <div class="b3d-stat-pill"><i class="fas fa-cube"></i> <strong>${yaw.toFixed(0)}°</strong> / <strong>${pitch.toFixed(0)}°</strong></div>
          <div class="b3d-stat-pill"><i class="fas fa-magnifying-glass"></i> <strong>${(zoom*100).toFixed(0)}%</strong></div>
        </div>
        <div class="b3d-stat-chips">${typeChips}</div>
      `;
    }

    function drawGround(ctx, items) {
      const m = 6;
      const c = [
        project(-m, -0.01, -m),
        project(BUILDING_W + m, -0.01, -m),
        project(BUILDING_W + m, -0.01, BUILDING_D + m),
        project(-m, -0.01, BUILDING_D + m),
      ];
      const avgD = (c[0].depth + c[2].depth) / 2;
      items.push({ depth: avgD + 200, fn: () => {
        const grd = ctx.createRadialGradient(canvasW/2, canvasH/2, 0, canvasW/2, canvasH/2, 400);
        grd.addColorStop(0, 'rgba(34,197,94,.16)');
        grd.addColorStop(1, 'rgba(34,197,94,.02)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(c[0].sx, c[0].sy);
        c.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,.18)';
        ctx.lineWidth = 1;
        for (let x = -m; x <= BUILDING_W + m; x += 2) {
          const a = project(x, -0.01, -m);
          const b = project(x, -0.01, BUILDING_D + m);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
        for (let z = -m; z <= BUILDING_D + m; z += 2) {
          const a = project(-m, -0.01, z);
          const b = project(BUILDING_W + m, -0.01, z);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }});
    }

    function drawFloor(ctx, items, f, fi) {
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      f.rooms.forEach(r => {
        minX = Math.min(minX, r.x); maxX = Math.max(maxX, r.x+r.w);
        minZ = Math.min(minZ, r.z); maxZ = Math.max(maxZ, r.z+r.d);
      });
      const fy = f.y, fh = f.h;
      // Slab
      const slabCorners = [
        project(minX, fy, minZ), project(maxX, fy, minZ),
        project(maxX, fy, maxZ), project(minX, fy, maxZ),
      ];
      const slabDepth = (slabCorners[0].depth + slabCorners[2].depth) / 2;
      items.push({ depth: slabDepth + 0.1, fn: () => {
        ctx.fillStyle = shade(f.color, 0.55);
        ctx.strokeStyle = 'rgba(255,255,255,.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(slabCorners[0].sx, slabCorners[0].sy);
        slabCorners.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Floor label
        const ctr = project((minX+maxX)/2, fy+0.02, (minZ+maxZ)/2);
        ctx.fillStyle = 'rgba(255,255,255,.5)';
        ctx.font = `bold ${14*zoom}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(f.name, ctr.sx, ctr.sy);
        ctx.textAlign = 'start';
      }});
      // Walls
      const walls = [
        { p1:[minX, fy, minZ], p2:[maxX, fy, minZ], b:0.95 },
        { p1:[maxX, fy, minZ], p2:[maxX, fy, maxZ], b:0.7 },
        { p1:[maxX, fy, maxZ], p2:[minX, fy, maxZ], b:0.55 },
        { p1:[minX, fy, maxZ], p2:[minX, fy, minZ], b:0.8 },
      ];
      walls.forEach(w => {
        const [x1,y1,z1] = w.p1, [x2,y2,z2] = w.p2;
        const a = project(x1, y1, z1), b = project(x2, y2, z2);
        const at = project(x1, y1+fh, z1), bt = project(x2, y2+fh, z2);
        const dep = (a.depth + b.depth + at.depth + bt.depth) / 4;
        items.push({ depth: dep, fn: () => {
          ctx.fillStyle = shade(f.color, w.b);
          ctx.strokeStyle = 'rgba(255,255,255,.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
          ctx.lineTo(bt.sx, bt.sy); ctx.lineTo(at.sx, at.sy);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        }});
      });
      // Inner walls + room labels
      f.rooms.forEach(r => {
        const edges = [
          [[r.x, r.z], [r.x+r.w, r.z]],
          [[r.x+r.w, r.z], [r.x+r.w, r.z+r.d]],
          [[r.x+r.w, r.z+r.d], [r.x, r.z+r.d]],
          [[r.x, r.z+r.d], [r.x, r.z]],
        ];
        edges.forEach(([a,b]) => {
          const isOuter =
            (a[0]===minX && b[0]===minX) || (a[0]===maxX && b[0]===maxX) ||
            (a[1]===minZ && b[1]===minZ) || (a[1]===maxZ && b[1]===maxZ);
          if (isOuter) return;
          const p1 = project(a[0], fy, a[1]);
          const p2 = project(b[0], fy, b[1]);
          const p1t = project(a[0], fy + fh*0.85, a[1]);
          const p2t = project(b[0], fy + fh*0.85, b[1]);
          const wd = (p1.depth + p2.depth) / 2;
          items.push({ depth: wd - 0.05, fn: () => {
            ctx.fillStyle = shade(f.color, 0.4);
            ctx.strokeStyle = 'rgba(255,255,255,.15)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
            ctx.lineTo(p2t.sx, p2t.sy); ctx.lineTo(p1t.sx, p1t.sy);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
          }});
        });
        const ctr = project(r.x + r.w/2, fy+0.02, r.z + r.d/2);
        items.push({ depth: slabDepth - 0.02, fn: () => {
          ctx.fillStyle = 'rgba(232,237,247,.85)';
          ctx.font = `${10.5*zoom}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText(r.name, ctr.sx, ctr.sy);
          ctx.textAlign = 'start';
        }});
      });
      // Roof on DG
      if (f.name === 'DG') drawRoof(ctx, items, f);
    }

    function drawRoof(ctx, items, f) {
      const fy = f.y + f.h;
      const peakY = fy + 2.5;
      const peakX = BUILDING_W/2;
      const lN = project(0, fy, 0), rN = project(BUILDING_W, fy, 0), peakN = project(peakX, peakY, 0);
      const lS = project(0, fy, BUILDING_D), rS = project(BUILDING_W, fy, BUILDING_D), peakS = project(peakX, peakY, BUILDING_D);
      [['#5a2e2e',0.95,lN,rN,peakN],['#5a2e2e',0.65,lS,rS,peakS]].forEach(([col,b,a1,a2,a3]) => {
        items.push({ depth: a1.depth - 0.5, fn: () => {
          ctx.fillStyle = shade(col, b);
          ctx.strokeStyle = 'rgba(255,255,255,.25)';
          ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy); ctx.lineTo(a3.sx, a3.sy);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }});
      });
      [[lN,lS,peakS,peakN,0.85],[rN,rS,peakS,peakN,0.7]].forEach(([a1,a2,a3,a4,b]) => {
        items.push({ depth: a1.depth - 0.3, fn: () => {
          ctx.fillStyle = shade('#5a2e2e', b);
          ctx.strokeStyle = 'rgba(255,255,255,.25)';
          ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy); ctx.lineTo(a3.sx, a3.sy); ctx.lineTo(a4.sx, a4.sy);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }});
      });
    }

    function drawSensor(ctx, p, proj, isSelected) {
      const s = p.sensor;
      const range = p.range != null ? p.range : s.range;
      if (s.type === 'sphere') drawSphereCov(ctx, p.x, p.y, p.z, range, s.color);
      else if (s.type === 'cone') drawConeCov(ctx, p.x, p.y, p.z, range, s.coneAngle, p.dir||0, s.color);
      // Stem
      const floorPt = project(p.x, 0, p.z);
      ctx.save();
      ctx.strokeStyle = s.color; ctx.globalAlpha = 0.4;
      ctx.setLineDash([3,3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(proj.sx, proj.sy); ctx.lineTo(floorPt.sx, floorPt.sy); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      // Halo
      const haloR = isSelected ? 22 : 14;
      const haloGrd = ctx.createRadialGradient(proj.sx, proj.sy, 0, proj.sx, proj.sy, haloR);
      haloGrd.addColorStop(0, s.color);
      haloGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haloGrd;
      ctx.globalAlpha = isSelected ? 0.9 : 0.55;
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, haloR, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      // Body
      const r = isSelected ? 10 : 8;
      const bgrd = ctx.createRadialGradient(proj.sx - r*0.3, proj.sy - r*0.3, 0, proj.sx, proj.sy, r);
      bgrd.addColorStop(0, '#ffffff');
      bgrd.addColorStop(0.4, s.color);
      bgrd.addColorStop(1, shade('#000000', 0.4));
      ctx.fillStyle = bgrd;
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(0,0,0,.5)';
      ctx.lineWidth = isSelected ? 2 : 1; ctx.stroke();
      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5,5]);
        ctx.beginPath(); ctx.arc(proj.sx, proj.sy, 24, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        if (s.type === 'cone') {
          const dir = p.dir || 0;
          const hp = project(p.x + Math.cos(dir)*1.2, p.y, p.z + Math.sin(dir)*1.2);
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(proj.sx, proj.sy); ctx.lineTo(hp.sx, hp.sy); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(hp.sx, hp.sy, 9, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#0b1424'; ctx.font = 'bold 12px system-ui';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('↻', hp.sx, hp.sy+1);
          ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
        }
      }
    }

    function drawSphereCov(ctx, x, y, z, r, color) {
      ctx.save();
      const slices = 9;
      for (let i = 0; i < slices; i++) {
        const t = i/(slices-1);
        const yy = y + (t - .5) * r * 1.6;
        const rr = r * Math.sqrt(Math.max(0, 1 - Math.pow(2*t-1, 2)));
        if (rr < 0.05) continue;
        ctx.globalAlpha = 0.20 * (1 - Math.abs(2*t-1) * 0.7);
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let a = 0; a < 32; a++) {
          const ang = a/32 * Math.PI*2;
          const p = project(x + Math.cos(ang)*rr, yy, z + Math.sin(ang)*rr);
          if (a === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 0.65;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let a = 0; a < 64; a++) {
        const ang = a/64 * Math.PI*2;
        const p = project(x + Math.cos(ang)*r, y, z + Math.sin(ang)*r);
        if (a === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      ctx.closePath(); ctx.stroke();
      ctx.restore();
    }

    function drawConeCov(ctx, x, y, z, range, angleDeg, dir, color) {
      const halfAngle = angleDeg/2 * Math.PI/180;
      const slices = 8;
      ctx.save();
      for (let i = 1; i <= slices; i++) {
        const t = i/slices;
        const r = range * t;
        const rr = r * Math.tan(halfAngle);
        const cx = x + Math.cos(dir) * r;
        const cz = z + Math.sin(dir) * r;
        ctx.globalAlpha = 0.12;
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
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
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
        ctx.beginPath(); ctx.moveTo(apex.sx, apex.sy); ctx.lineTo(ep.sx, ep.sy); ctx.stroke();
      }
      ctx.restore();
    }

    function drawCompass(ctx) {
      const cx = 50, cy = 50;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI*2); ctx.stroke();
      const yawR = yaw * Math.PI/180;
      const tipX = cx + Math.sin(yawR) * 20;
      const tipY = cy - Math.cos(yawR) * 20;
      const baseX = cx - Math.sin(yawR) * 10;
      const baseY = cy + Math.cos(yawR) * 10;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      const perpX = Math.cos(yawR) * 5, perpY = Math.sin(yawR) * 5;
      ctx.lineTo(baseX - perpX, baseY - perpY);
      ctx.lineTo(baseX + perpX, baseY + perpY);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('N', tipX, tipY - 4);
      ctx.textAlign = 'start';
      ctx.restore();
    }

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
    function getMouse(e) {
      const r = cv.getBoundingClientRect();
      return { mx: e.clientX - r.left, my: e.clientY - r.top };
    }
    function pointInRoom(wp, f) {
      return f.rooms.find(r =>
        wp.x >= r.x && wp.x <= r.x+r.w &&
        wp.z >= r.z && wp.z <= r.z+r.d
      );
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
      drag = { mode:'view', lastX: mx, lastY: my, downX: mx, downY: my, moved: false };
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
      if (drag.mode === 'view' && !drag.moved) {
        const firstVisible = floorVisible.findIndex(v => v);
        if (firstVisible >= 0) {
          const f = FLOORS[firstVisible];
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
    cv.addEventListener('contextmenu', e => e.preventDefault());

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

    viewBox.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.rot)  { yaw = yaw + +b.dataset.rot; draw(); }
      if (b.dataset.tilt === 'up')   { pitch = Math.max(5,  pitch - 7); draw(); }
      if (b.dataset.tilt === 'down') { pitch = Math.min(80, pitch + 7); draw(); }
      if (b.dataset.zoom === '+') { zoom = Math.min(3, zoom * 1.15); draw(); }
      if (b.dataset.zoom === '-') { zoom = Math.max(.4, zoom / 1.15); draw(); }
      if (b.dataset.reset) { yaw = 35; pitch = 28; zoom = 1.0; draw(); }
    });

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
      const head = el('div', { class:'b3d-sel-head' }, [
        el('div', { class:'b3d-sel-icon', style:`background:${p.sensor.color}` }, [
          el('i', { class:`fas ${p.sensor.icon}` })
        ]),
        el('div', { class:'b3d-sel-info' }, [
          el('strong', { text: p.sensor.label }),
          el('div', { class:'small muted', text: `Höhe ${p.y.toFixed(1)}m · R ${(p.range||p.sensor.range).toFixed(1)}m` })
        ]),
        el('button', { class:'btn ghost', html:'<i class="fas fa-xmark"></i>',
          onClick: () => { selectedIdx = -1; renderSel(); draw(); } }),
        el('button', { class:'btn', style:'border-color:var(--bad); color:var(--bad)', html:'<i class="fas fa-trash"></i>',
          onClick: () => {
            placed.splice(selectedIdx, 1); selectedIdx = -1; renderSel(); autoSave(); draw();
          }})
      ]);
      selPanel.appendChild(head);
      // Range
      const r1 = el('div', { class:'fp-control' });
      r1.appendChild(el('label', { text: 'Reichweite' }));
      const rs = el('input', { type:'range', min:'0.5', max:'20', step:'0.5', value: String(p.range || p.sensor.range), class:'fp-slider' });
      const ro = el('span', { class:'fp-out', text: (p.range||p.sensor.range).toFixed(1)+' m' });
      rs.addEventListener('input', () => { p.range = +rs.value; ro.textContent = p.range.toFixed(1)+' m'; autoSave(); draw(); });
      r1.appendChild(rs); r1.appendChild(ro);
      selPanel.appendChild(r1);
      // Height
      const r2 = el('div', { class:'fp-control' });
      r2.appendChild(el('label', { text: 'Höhe' }));
      const ys = el('input', { type:'range', min:'0', max:'8', step:'0.1', value: String(p.y), class:'fp-slider' });
      const yo = el('span', { class:'fp-out', text: p.y.toFixed(1)+' m' });
      ys.addEventListener('input', () => { p.y = +ys.value; yo.textContent = p.y.toFixed(1)+' m'; autoSave(); draw(); });
      r2.appendChild(ys); r2.appendChild(yo);
      selPanel.appendChild(r2);
      // Direction
      if (p.sensor.type === 'cone') {
        const r3 = el('div', { class:'fp-control' });
        r3.appendChild(el('label', { text: 'Richtung' }));
        const ds = el('input', { type:'range', min:'-180', max:'180', step:'5', value: String(Math.round((p.dir||0) * 180/Math.PI)), class:'fp-slider' });
        const dO = el('span', { class:'fp-out', text: Math.round((p.dir||0)*180/Math.PI)+'°' });
        ds.addEventListener('input', () => { p.dir = +ds.value * Math.PI/180; dO.textContent = ds.value+'°'; autoSave(); draw(); });
        r3.appendChild(ds); r3.appendChild(dO);
        selPanel.appendChild(r3);
      }
    }

    window.addEventListener('resize', draw);
    requestAnimationFrame(draw);
    renderSel();
    // Auto fly-in
    setTimeout(() => {
      const startYaw = 0, startPitch = 85, startZoom = 0.45;
      const endYaw = 35, endPitch = 28, endZoom = 1.0;
      const dur = 1800;
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
    }, 200);
    return root;
  }

  return { view };
})();
