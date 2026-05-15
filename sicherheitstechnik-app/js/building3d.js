/* 3D-Gebäudeplaner v4 – PROFESSIONELL
   - Default: TOP-DOWN 2D-Grundriss (Pitch 85°)
   - Klare Modi: ANSEHEN (default) / PLATZIEREN (explizit) / BEARBEITEN
   - Sensor-Sidebar: klicken aktiviert "Platzieren"-Modus, nach Klick auf Raum = einer wird platziert,
     Modus geht zurück auf "Ansehen"
   - In Ansehen-Modus: Tap = nur Sensor auswählen oder Pan/Rotate (drag)
   - 2D/3D Toggle für Ansicht */

window.BLDG3D = (() => {
  const { el, toast } = U;

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
    { id:'pir',  label:'PIR-Bewegungsmelder', color:'#fbbf24', range:6,  coneAngle:90,  type:'cone',   icon:'fa-eye',           desc:'Wärme-Bewegung' },
    { id:'dual', label:'Dualmelder',          color:'#22c55e', range:7,  coneAngle:90,  type:'cone',   icon:'fa-shield-halved', desc:'PIR + MW' },
    { id:'mw',   label:'Mikrowelle',          color:'#22d3ee', range:10, coneAngle:110, type:'cone',   icon:'fa-tower-broadcast',desc:'Doppler-Radar' },
    { id:'us',   label:'Ultraschall',         color:'#a78bfa', range:5,  type:'sphere', icon:'fa-volume-high',   desc:'40 kHz' },
    { id:'mag',  label:'Magnetkontakt',       color:'#c084fc', range:0.4,type:'sphere', icon:'fa-magnet',        desc:'Tür/Fenster' },
    { id:'glass',label:'Glasbruchmelder',     color:'#38bdf8', range:6,  type:'sphere', icon:'fa-window-maximize',desc:'Akustisch' },
    { id:'fire', label:'Rauchmelder',         color:'#ef4444', range:5,  type:'sphere', icon:'fa-fire',          desc:'Brand' },
    { id:'cam',  label:'Kamera',              color:'#a3e635', range:10, coneAngle:70,  type:'cone',   icon:'fa-video',         desc:'Video' },
  ];

  // View state
  let yaw = 0, pitch = 85, zoom = 1.0;  // Default = TOP-DOWN
  let floorVisible = [true, false, false];  // Default = nur EG
  let placed = [];
  let selectedIdx = -1;
  let drag = null;
  let canvasW = 800, canvasH = 600;
  const SCALE_BASE = 38;
  let mode = 'view';   // 'view' | 'place'
  let placeSensor = null;  // sensor type when in place mode
  let view2DMode = true;  // start in 2D top-down

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
      sy: canvasH/2 - ry * s,
      depth: rrz
    };
  }
  function screenToWorldAtY(mx, my, worldY) {
    const s = SCALE_BASE * zoom;
    const rx = (mx - canvasW/2) / s;
    const ry = (canvasH/2 - my) / s;
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
    selectedIdx = -1;
    mode = 'view'; placeSensor = null;
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
      el('h1', { text: 'Gebäudeplaner' }),
      el('p', { text: 'Klare 2D/3D-Ansicht · Sensor wählen → in Raum tippen. Sensor antippen zum Bearbeiten.' })
    ]));

    // ===== Mode banner =====
    const modeBanner = el('div', { class:'gp-modebanner' });
    root.appendChild(modeBanner);

    // ===== Layout: sidebar + canvas =====
    const layout = el('div', { class:'gp-layout' });
    root.appendChild(layout);

    // --- Sidebar with action button on top + sensor list ---
    const sidebar = el('div', { class:'gp-sidebar' });

    const addCard = el('div', { class:'gp-add-card' });
    addCard.innerHTML = `
      <div class="gp-add-icon"><i class="fas fa-plus"></i></div>
      <div class="gp-add-body">
        <strong>Sensor hinzufügen</strong>
        <div class="muted small">Wähle einen Typ →</div>
      </div>
    `;
    sidebar.appendChild(addCard);

    SENSORS.forEach(s => {
      const tile = el('button', { class:'gp-sensor-tile', dataset:{id: s.id} });
      tile.style.setProperty('--c', s.color);
      tile.innerHTML = `
        <div class="gp-sensor-icon"><i class="fas ${s.icon}"></i></div>
        <div class="gp-sensor-body">
          <div class="gp-sensor-lbl">${s.label}</div>
          <div class="gp-sensor-desc">${s.desc}</div>
        </div>
      `;
      tile.addEventListener('click', () => {
        if (mode === 'place' && placeSensor === s) {
          // toggle off
          mode = 'view'; placeSensor = null;
        } else {
          mode = 'place'; placeSensor = s;
        }
        updateUI();
      });
      sidebar.appendChild(tile);
    });
    layout.appendChild(sidebar);

    // --- Canvas area ---
    const canvasArea = el('div', { class:'gp-canvas-area' });
    layout.appendChild(canvasArea);
    const cv = el('canvas', { class:'gp-canvas' });
    canvasArea.appendChild(cv);

    // 2D/3D toggle
    const viewToggle = el('div', { class:'gp-floating gp-view-toggle' });
    viewToggle.innerHTML = `
      <button data-mode="2d" class="active"><i class="fas fa-square"></i> 2D</button>
      <button data-mode="3d"><i class="fas fa-cube"></i> 3D</button>
    `;
    canvasArea.appendChild(viewToggle);

    // Floor chips
    const floorBox = el('div', { class:'gp-floating gp-floors' });
    FLOORS.forEach((f, i) => {
      const b = el('button', { class:'gp-floor-chip' + (floorVisible[i]?' active':''), dataset:{i}, text: f.name });
      b.addEventListener('click', () => {
        floorVisible[i] = !floorVisible[i];
        b.classList.toggle('active', floorVisible[i]);
        draw();
      });
      floorBox.appendChild(b);
    });
    canvasArea.appendChild(floorBox);

    // View controls (rotate, zoom) – hidden in 2D mode
    const viewCtrl = el('div', { class:'gp-floating gp-viewctrl' });
    viewCtrl.innerHTML = `
      <button data-rot="-20" title="Links drehen"><i class="fas fa-rotate-left"></i></button>
      <button data-rot="20"  title="Rechts drehen"><i class="fas fa-rotate-right"></i></button>
      <button data-zoom="+" title="Heran"><i class="fas fa-plus"></i></button>
      <button data-zoom="-" title="Heraus"><i class="fas fa-minus"></i></button>
    `;
    canvasArea.appendChild(viewCtrl);

    // Selection panel
    const selPanel = el('div', { class:'gp-floating gp-selpanel', style:'display:none' });
    canvasArea.appendChild(selPanel);

    // ===== Status bar =====
    const status = el('div', { class:'gp-status' });
    root.appendChild(status);

    // Actions
    const actions = el('div', { class:'gp-actions' });
    const autoBtn = el('button', { class:'btn primary', html:'<i class="fas fa-wand-magic-sparkles"></i> Auto-Plan' });
    const saveBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-floppy-disk"></i> Speichern' });
    const loadBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-folder-open"></i> Laden' });
    const clearBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-trash"></i> Alle löschen' });
    actions.appendChild(autoBtn); actions.appendChild(saveBtn);
    actions.appendChild(loadBtn); actions.appendChild(clearBtn);
    root.appendChild(actions);

    // ===== Logic =====
    function updateUI() {
      // Sidebar tile highlight
      sidebar.querySelectorAll('.gp-sensor-tile').forEach(x => {
        x.classList.toggle('active', placeSensor && x.dataset.id === placeSensor.id);
      });
      // Mode banner
      if (mode === 'place' && placeSensor) {
        modeBanner.innerHTML = `
          <div class="gp-modebanner-inner place-mode">
            <span class="gp-mode-pulse"></span>
            <strong>PLATZIEREN-MODUS</strong>
            <span class="muted">→ Tippe in einen Raum, um <strong style="color:${placeSensor.color}">${placeSensor.label}</strong> zu setzen</span>
            <button class="gp-mode-cancel" data-cancel="1">Abbrechen ✕</button>
          </div>`;
      } else if (selectedIdx >= 0) {
        modeBanner.innerHTML = `
          <div class="gp-modebanner-inner edit-mode">
            <strong>BEARBEITEN</strong>
            <span class="muted">→ Sensor wird verschoben/gedreht. Werte unten anpassen.</span>
            <button class="gp-mode-cancel" data-cancel="1">Auswahl aufheben ✕</button>
          </div>`;
      } else {
        modeBanner.innerHTML = `
          <div class="gp-modebanner-inner view-mode">
            <i class="fas fa-hand-pointer"></i>
            <strong>ANSEHEN</strong>
            <span class="muted">→ Links Sensor wählen zum Platzieren · Drag = ${view2DMode ? 'Verschieben' : 'Rotieren'} · Tap auf Sensor = Bearbeiten</span>
          </div>`;
      }
      const cancel = modeBanner.querySelector('[data-cancel]');
      if (cancel) cancel.addEventListener('click', () => {
        mode = 'view'; placeSensor = null; selectedIdx = -1;
        updateUI();
        renderSel();
        draw();
      });
      // Cursor
      cv.style.cursor = mode === 'place' ? 'crosshair' : (view2DMode ? 'move' : 'grab');
      // View ctrl visibility
      viewCtrl.style.display = view2DMode ? 'none' : 'grid';
    }

    // Set initial 2D state
    viewToggle.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const m = b.dataset.mode;
      if (m === '2d') {
        view2DMode = true; yaw = 0; pitch = 85; zoom = 1.2;
      } else {
        view2DMode = false; yaw = 35; pitch = 28; zoom = 1.0;
      }
      viewToggle.querySelectorAll('button').forEach(x => x.classList.toggle('active', x.dataset.mode === m));
      updateUI();
      draw();
    });

    // Auto Plan
    autoBtn.addEventListener('click', () => {
      if (placed.length && !confirm(`${placed.length} bestehende Sensoren werden überschrieben. Fortfahren?`)) return;
      const nPlaced = [];
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        f.rooms.forEach(r => {
          nPlaced.push({
            x: r.x + 0.6, y: f.y + 2.2, z: r.z + 0.6,
            dir: Math.PI/4,
            range: Math.min(r.w, r.d, 6),
            sensor: SENSORS.find(s=>s.id==='pir')
          });
          if (r.name !== 'Bad') {
            nPlaced.push({
              x: r.x + r.w/2, y: f.y + 2.2, z: r.z + r.d/2,
              dir: 0, range: Math.min(r.w/2, r.d/2, 4),
              sensor: SENSORS.find(s=>s.id==='fire')
            });
          }
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
      selectedIdx = -1; mode = 'view'; placeSensor = null;
      autoSave(); updateUI(); renderSel(); draw();
      toast(`${nPlaced.length} Sensoren platziert`);
    });

    saveBtn.addEventListener('click', () => {
      const name = prompt('Plan-Name?', `Plan · ${new Date().toLocaleDateString('de-DE')}`);
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
      selectedIdx = -1; mode='view'; placeSensor=null;
      updateUI(); renderSel(); autoSave(); draw();
    });
    clearBtn.addEventListener('click', () => {
      if (!placed.length) return;
      if (!confirm(`Alle ${placed.length} Sensoren löschen?`)) return;
      placed = []; selectedIdx = -1; mode='view'; placeSensor=null;
      updateUI(); renderSel(); autoSave(); draw();
    });

    function autoSave() {
      localStorage.setItem('st-b3d-last', JSON.stringify(
        placed.map(p => ({ x:p.x, y:p.y, z:p.z, dir:p.dir, range:p.range, sid:p.sensor.id }))
      ));
    }

    function fit() {
      const W = cv.parentElement.clientWidth - 2;
      const H = 580;
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
      const bg = ctx.createLinearGradient(0,0,0,canvasH);
      bg.addColorStop(0, 'rgba(11,20,36,.8)');
      bg.addColorStop(1, 'rgba(56,189,248,.06)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,canvasW,canvasH);

      // In 2D mode → simpler floor plan drawing
      if (view2DMode) {
        drawTopDown(ctx);
      } else {
        draw3D(ctx);
      }

      // Stats
      let totalCount = 0, byType = {};
      placed.forEach(p => { totalCount++; byType[p.sensor.id] = (byType[p.sensor.id]||0)+1; });
      const typeChips = Object.entries(byType).map(([id, n]) => {
        const s = SENSORS.find(x=>x.id===id);
        return `<span class="gp-typechip" style="--c:${s.color}"><i class="fas ${s.icon}"></i> ${n}× ${s.label}</span>`;
      }).join('');
      status.innerHTML = `
        <div class="gp-stats-main">
          <div class="gp-stat-pill"><i class="fas fa-microchip"></i> <strong>${totalCount}</strong> Sensoren</div>
          <div class="gp-stat-pill"><i class="fas fa-layer-group"></i> ${FLOORS.filter((_,i)=>floorVisible[i]).map(f=>f.name).join(' · ') || '—'}</div>
        </div>
        <div class="gp-stat-chips">${typeChips}</div>
      `;
    }

    function drawTopDown(ctx) {
      // Simple, clear top-down floor plan
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        // Use scale
        const scale = SCALE_BASE * zoom;
        const ox = canvasW/2 - BUILDING_W*scale/2;
        const oy = canvasH/2 - BUILDING_D*scale/2;
        // Building shadow
        ctx.fillStyle = 'rgba(0,0,0,.3)';
        ctx.fillRect(ox+6, oy+6, BUILDING_W*scale, BUILDING_D*scale);
        // House fill
        ctx.fillStyle = shade(f.color, 0.5);
        ctx.fillRect(ox, oy, BUILDING_W*scale, BUILDING_D*scale);
        // Floor label
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.font = `bold 14px system-ui`;
        ctx.fillText(f.name, ox + 6, oy + 18);
        // Rooms
        f.rooms.forEach(r => {
          const rx = ox + r.x*scale, ry = oy + r.z*scale, rw = r.w*scale, rh = r.d*scale;
          ctx.fillStyle = 'rgba(255,255,255,.04)';
          ctx.fillRect(rx, ry, rw, rh);
          ctx.strokeStyle = 'rgba(255,255,255,.4)';
          ctx.lineWidth = 2;
          ctx.strokeRect(rx, ry, rw, rh);
          // Room label
          ctx.fillStyle = 'rgba(255,255,255,.85)';
          ctx.font = `600 ${Math.max(11, scale*0.16)}px system-ui`;
          ctx.fillText(r.name, rx + 8, ry + 20);
          // Furniture
          if (window.FURN) FURN.render(ctx, r.name, rx, ry, scale, r.w, r.d);
        });
        // Outer wall (thicker)
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255,255,255,.7)';
        ctx.strokeRect(ox, oy, BUILDING_W*scale, BUILDING_D*scale);
      });

      // Place mode hint - highlight rooms with shimmer
      if (mode === 'place' && placeSensor) {
        const scale = SCALE_BASE * zoom;
        const ox = canvasW/2 - BUILDING_W*scale/2;
        const oy = canvasH/2 - BUILDING_D*scale/2;
        FLOORS.forEach((f, fi) => {
          if (!floorVisible[fi]) return;
          f.rooms.forEach(r => {
            const rx = ox + r.x*scale, ry = oy + r.z*scale, rw = r.w*scale, rh = r.d*scale;
            const t = (Date.now() / 800) % 1;
            ctx.fillStyle = `rgba(${parseInt(placeSensor.color.slice(1,3),16)},${parseInt(placeSensor.color.slice(3,5),16)},${parseInt(placeSensor.color.slice(5,7),16)},${0.05 + 0.05*Math.sin(t*Math.PI*2)})`;
            ctx.fillRect(rx, ry, rw, rh);
          });
        });
        // animate pulse
        if (mode === 'place') {
          if (!draw._raf) draw._raf = requestAnimationFrame(() => { draw._raf = 0; draw(); });
        }
      }

      // Placed sensors
      placed.forEach((p, i) => drawSensor2D(ctx, p, i === selectedIdx));
    }

    function drawSensor2D(ctx, p, isSelected) {
      const scale = SCALE_BASE * zoom;
      const ox = canvasW/2 - BUILDING_W*scale/2;
      const oy = canvasH/2 - BUILDING_D*scale/2;
      const x = ox + p.x*scale, y = oy + p.z*scale;
      const s = p.sensor;
      const range = p.range != null ? p.range : s.range;
      // Coverage
      ctx.save();
      ctx.globalAlpha = isSelected ? 0.55 : 0.4;
      ctx.fillStyle = s.color;
      if (s.type === 'cone') {
        const half = (s.coneAngle/2) * Math.PI/180;
        const dir = p.dir != null ? p.dir : Math.PI/4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, range*scale, dir-half, dir+half);
        ctx.closePath();
        ctx.fill();
        if (isSelected) {
          ctx.strokeStyle = s.color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.9; ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(x, y, range*scale, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
      // Body
      const r = isSelected ? 12 : 10;
      const grd = ctx.createRadialGradient(x-r*0.3, y-r*0.3, 0, x, y, r);
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.4, s.color);
      grd.addColorStop(1, 'rgba(0,0,0,.5)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(0,0,0,.5)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      // Label
      ctx.fillStyle = s.color;
      ctx.font = `bold 10px system-ui`;
      ctx.textAlign = 'center';
      ctx.fillText(s.label.split(' ')[0], x, y + r + 13);
      ctx.textAlign = 'start';
      // Selection ring + handle
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5,5]);
        ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        if (s.type === 'cone') {
          const dir = p.dir || Math.PI/4;
          const hx = x + Math.cos(dir) * 36, hy = y + Math.sin(dir) * 36;
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(hx,hy); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(hx, hy, 10, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#0b1424'; ctx.font = 'bold 12px system-ui';
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText('↻', hx, hy+1);
          ctx.textAlign='start'; ctx.textBaseline='alphabetic';
        }
      }
    }

    function draw3D(ctx) {
      const items = [];
      drawGround3D(ctx, items);
      FLOORS.forEach((f, fi) => {
        if (!floorVisible[fi]) return;
        drawFloor3D(ctx, items, f, fi);
      });
      placed.forEach((p, i) => {
        const proj = project(p.x, p.y, p.z);
        items.push({ depth: proj.depth - 1.5, fn: () => drawSensor3D(ctx, p, proj, i === selectedIdx) });
      });
      items.sort((a,b) => b.depth - a.depth);
      items.forEach(it => it.fn());
    }

    function drawGround3D(ctx, items) {
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
        grd.addColorStop(0, 'rgba(34,197,94,.14)');
        grd.addColorStop(1, 'rgba(34,197,94,.02)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(c[0].sx, c[0].sy);
        c.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath(); ctx.fill();
      }});
    }

    function drawFloor3D(ctx, items, f, fi) {
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      f.rooms.forEach(r => {
        minX = Math.min(minX, r.x); maxX = Math.max(maxX, r.x+r.w);
        minZ = Math.min(minZ, r.z); maxZ = Math.max(maxZ, r.z+r.d);
      });
      const fy = f.y, fh = f.h;
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
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
          ctx.lineTo(bt.sx, bt.sy); ctx.lineTo(at.sx, at.sy);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        }});
      });
      // Room labels
      f.rooms.forEach(r => {
        const ctr = project(r.x + r.w/2, fy+0.02, r.z + r.d/2);
        items.push({ depth: slabDepth - 0.02, fn: () => {
          ctx.fillStyle = 'rgba(255,255,255,.85)';
          ctx.font = `${10*zoom}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText(r.name, ctr.sx, ctr.sy);
          ctx.textAlign = 'start';
        }});
      });
    }

    function drawSensor3D(ctx, p, proj, isSelected) {
      const s = p.sensor;
      const range = p.range != null ? p.range : s.range;
      if (s.type === 'sphere') {
        const slices = 9;
        for (let i = 0; i < slices; i++) {
          const t = i/(slices-1);
          const yy = p.y + (t - .5) * range * 1.6;
          const rr = range * Math.sqrt(Math.max(0, 1 - Math.pow(2*t-1, 2)));
          if (rr < 0.05) continue;
          ctx.globalAlpha = 0.20 * (1 - Math.abs(2*t-1) * 0.7);
          ctx.fillStyle = s.color;
          ctx.beginPath();
          for (let a = 0; a < 32; a++) {
            const ang = a/32 * Math.PI*2;
            const pp = project(p.x + Math.cos(ang)*rr, yy, p.z + Math.sin(ang)*rr);
            if (a === 0) ctx.moveTo(pp.sx, pp.sy); else ctx.lineTo(pp.sx, pp.sy);
          }
          ctx.closePath(); ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else if (s.type === 'cone') {
        const dir = p.dir || 0;
        const halfAngle = s.coneAngle/2 * Math.PI/180;
        for (let i = 1; i <= 8; i++) {
          const t = i/8;
          const r = range * t;
          const rr = r * Math.tan(halfAngle);
          const cx = p.x + Math.cos(dir) * r;
          const cz = p.z + Math.sin(dir) * r;
          ctx.globalAlpha = 0.12;
          ctx.fillStyle = s.color;
          const ux = -Math.sin(dir), uz = Math.cos(dir);
          ctx.beginPath();
          for (let a = 0; a < 32; a++) {
            const ang = a/32 * Math.PI*2;
            const px = cx + ux*Math.cos(ang)*rr;
            const py = p.y + Math.sin(ang)*rr;
            const pz = cz + uz*Math.cos(ang)*rr;
            const pp = project(px, py, pz);
            if (a === 0) ctx.moveTo(pp.sx, pp.sy); else ctx.lineTo(pp.sx, pp.sy);
          }
          ctx.closePath(); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      const r = isSelected ? 10 : 8;
      const grd = ctx.createRadialGradient(proj.sx-r*0.3, proj.sy-r*0.3, 0, proj.sx, proj.sy, r);
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.4, s.color);
      grd.addColorStop(1, 'rgba(0,0,0,.5)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(proj.sx, proj.sy, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(0,0,0,.4)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5,5]);
        ctx.beginPath(); ctx.arc(proj.sx, proj.sy, 22, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // ===== Interaction =====
    function findSensorAt(mx, my) {
      const scale = SCALE_BASE * zoom;
      const ox = canvasW/2 - BUILDING_W*scale/2;
      const oy = canvasH/2 - BUILDING_D*scale/2;
      let bestI = -1, bestD = 28;
      for (let i = 0; i < placed.length; i++) {
        const p = placed[i];
        let sx, sy;
        if (view2DMode) {
          sx = ox + p.x*scale; sy = oy + p.z*scale;
        } else {
          const proj = project(p.x, p.y, p.z);
          sx = proj.sx; sy = proj.sy;
        }
        const d = Math.hypot(sx - mx, sy - my);
        if (d < bestD) { bestD = d; bestI = i; }
      }
      return bestI;
    }
    function findRotateHandleAt(mx, my) {
      if (selectedIdx < 0) return false;
      const p = placed[selectedIdx];
      if (p.sensor.type !== 'cone') return false;
      const scale = SCALE_BASE * zoom;
      const ox = canvasW/2 - BUILDING_W*scale/2;
      const oy = canvasH/2 - BUILDING_D*scale/2;
      const dir = p.dir || Math.PI/4;
      let hx, hy;
      if (view2DMode) {
        hx = ox + p.x*scale + Math.cos(dir)*36;
        hy = oy + p.z*scale + Math.sin(dir)*36;
      } else {
        const hp = project(p.x + Math.cos(dir)*1.2, p.y, p.z + Math.sin(dir)*1.2);
        hx = hp.sx; hy = hp.sy;
      }
      return Math.hypot(hx-mx, hy-my) < 16;
    }
    function pointInRoom(x, z, f) {
      return f.rooms.find(r =>
        x >= r.x && x <= r.x+r.w &&
        z >= r.z && z <= r.z+r.d
      );
    }
    function getMouse(e) {
      const r = cv.getBoundingClientRect();
      return { mx: e.clientX - r.left, my: e.clientY - r.top };
    }

    cv.addEventListener('mousedown', e => {
      const { mx, my } = getMouse(e);

      if (mode === 'place' && placeSensor) {
        // Place sensor on click in valid room
        const firstVisible = floorVisible.findIndex(v => v);
        if (firstVisible < 0) return;
        const f = FLOORS[firstVisible];
        let wx, wz;
        if (view2DMode) {
          const scale = SCALE_BASE * zoom;
          const ox = canvasW/2 - BUILDING_W*scale/2;
          const oy = canvasH/2 - BUILDING_D*scale/2;
          wx = (mx - ox) / scale;
          wz = (my - oy) / scale;
        } else {
          const wp = screenToWorldAtY(mx, my, f.y + 2.2);
          wx = wp.x; wz = wp.z;
        }
        const room = pointInRoom(wx, wz, f);
        if (room) {
          placed.push({
            x: wx, y: f.y + 2.2, z: wz,
            dir: Math.PI/4, range: placeSensor.range,
            sensor: placeSensor
          });
          selectedIdx = placed.length - 1;
          mode = 'view'; placeSensor = null;  // auto-exit place mode
          autoSave();
          renderSel(); updateUI(); draw();
          toast(`${SENSORS.find(s=>s.id===placed[selectedIdx].sensor.id).label} platziert`);
        } else {
          toast('Tippe in einen Raum');
        }
        return;
      }

      // View mode: check rotate handle first
      if (findRotateHandleAt(mx, my)) {
        drag = { mode:'rotate', idx: selectedIdx, lastX: mx, lastY: my };
        return;
      }
      // Then sensor select
      const hit = findSensorAt(mx, my);
      if (hit >= 0) {
        selectedIdx = hit;
        drag = { mode:'move', idx: hit, lastX: mx, lastY: my };
        renderSel(); updateUI(); draw();
        return;
      }
      // Empty area = view drag (pan in 2D, rotate in 3D)
      drag = { mode: view2DMode ? 'pan' : 'orbit', lastX: mx, lastY: my };
    });

    cv.addEventListener('mousemove', e => {
      if (!drag) return;
      const { mx, my } = getMouse(e);
      const dx = mx - drag.lastX, dy = my - drag.lastY;
      const scale = SCALE_BASE * zoom;
      if (drag.mode === 'orbit') {
        yaw = yaw + dx * 0.5;
        pitch = Math.max(5, Math.min(89, pitch - dy * 0.3));
      } else if (drag.mode === 'pan') {
        // In 2D, pan = zoom-pan
        // Simplest: shift origin via canvas-relative pan = not implemented yet, ignore
      } else if (drag.mode === 'move') {
        const p = placed[drag.idx];
        if (view2DMode) {
          p.x = Math.max(0, Math.min(BUILDING_W, p.x + dx/scale));
          p.z = Math.max(0, Math.min(BUILDING_D, p.z + dy/scale));
        } else {
          const wp = screenToWorldAtY(mx, my, p.y);
          p.x = Math.max(0, Math.min(BUILDING_W, wp.x));
          p.z = Math.max(0, Math.min(BUILDING_D, wp.z));
        }
      } else if (drag.mode === 'rotate') {
        const p = placed[drag.idx];
        let cx, cy;
        if (view2DMode) {
          const ox = canvasW/2 - BUILDING_W*scale/2;
          const oy = canvasH/2 - BUILDING_D*scale/2;
          cx = ox + p.x*scale; cy = oy + p.z*scale;
        } else {
          const sp = project(p.x, p.y, p.z);
          cx = sp.sx; cy = sp.sy;
        }
        p.dir = Math.atan2(my - cy, mx - cx);
      }
      drag.lastX = mx; drag.lastY = my;
      draw();
    });

    cv.addEventListener('mouseup', () => {
      if (drag && (drag.mode === 'move' || drag.mode === 'rotate')) autoSave();
      drag = null;
    });
    cv.addEventListener('mouseleave', () => { drag = null; });
    cv.addEventListener('contextmenu', e => e.preventDefault());

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
      if (b.dataset.zoom === '+') { zoom = Math.min(3, zoom * 1.15); draw(); }
      if (b.dataset.zoom === '-') { zoom = Math.max(.4, zoom / 1.15); draw(); }
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
      const head = el('div', { class:'gp-sel-head' }, [
        el('div', { class:'gp-sel-icon', style:`background:${p.sensor.color}` }, [
          el('i', { class:`fas ${p.sensor.icon}` })
        ]),
        el('div', { class:'gp-sel-info' }, [
          el('strong', { text: p.sensor.label }),
          el('div', { class:'small muted', text: `R ${(p.range||p.sensor.range).toFixed(1)}m · H ${p.y.toFixed(1)}m` })
        ]),
        el('button', { class:'btn ghost', html:'<i class="fas fa-xmark"></i>',
          onClick: () => { selectedIdx = -1; renderSel(); updateUI(); draw(); } }),
        el('button', { class:'btn', style:'border-color:var(--bad); color:var(--bad)', html:'<i class="fas fa-trash"></i>',
          onClick: () => {
            placed.splice(selectedIdx, 1); selectedIdx = -1; renderSel(); updateUI(); autoSave(); draw();
          }})
      ]);
      selPanel.appendChild(head);

      const r1 = el('div', { class:'fp-control' });
      r1.appendChild(el('label', { text: 'Reichweite' }));
      const rs = el('input', { type:'range', min:'0.5', max:'20', step:'0.5', value: String(p.range || p.sensor.range), class:'fp-slider' });
      const ro = el('span', { class:'fp-out', text: (p.range||p.sensor.range).toFixed(1)+' m' });
      rs.addEventListener('input', () => { p.range = +rs.value; ro.textContent = p.range.toFixed(1)+' m'; autoSave(); draw(); });
      r1.appendChild(rs); r1.appendChild(ro);
      selPanel.appendChild(r1);

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
    updateUI();
    return root;
  }

  return { view };
})();
