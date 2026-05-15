/* Interaktives Sicherheits-Haus 3D
   Komplettes Modell: Außenzaun -> Hauswand -> Innenraum -> Tresor
   Drag zum Drehen, Klick auf Zone für Sicherheitstechnik */

window.HAUS3D = (() => {
  const { el, drawer } = U;

  // Welt-Modell: Grundstück 24×16 m, Haus 12×8 m in der Mitte
  const PROP = { w: 24, d: 16 };
  const HOUSE = { x: 6, z: 4, w: 12, d: 8, h: 3.0 };
  const ROOF_PEAK = 5.0;

  const ZONES = [
    { n:1, name:'PERIMETER',  color:'#38bdf8',
      tech:[
        { l:'Zaunmelder mikrophonisch', d:'600 m/Zone · erkennt Klettern/Schneiden' },
        { l:'IR-Lichtschranken', d:'30–250m · 4-Strahl-Vorhang' },
        { l:'Thermalkamera + KI', d:'Sieht bei Dunkelheit, Nebel, Tarnung' },
        { l:'Radar 24/77 GHz', d:'500m Reichweite · Tracking' },
        { l:'Erddruck-Geophon', d:'Vergraben · Schritte/Fahrzeuge' },
      ]},
    { n:2, name:'AUSSENHAUT', color:'#818cf8',
      tech:[
        { l:'RC-Türen (RC 1N–RC 6)', d:'3–20 Min Widerstandszeit' },
        { l:'Magnetkontakte', d:'AP/UP · an allen Türen + Fenstern' },
        { l:'Schließblechkontakte', d:'Riegel-Erkennung · ab SÜ 3 Pflicht' },
        { l:'Glasbruchmelder', d:'Akustisch (passiv) oder Aktiv-Folie' },
        { l:'P-Verglasung P4A–P8B', d:'Angriffhemmend · DIN EN 356' },
      ]},
    { n:3, name:'INNENRAUM',  color:'#c084fc',
      tech:[
        { l:'PIR-Bewegungsmelder', d:'12×12 m · Wärmestrahlung' },
        { l:'Dualmelder PIR+MW', d:'AND-Logik · −95% Fehlalarm' },
        { l:'Mikrowellenmelder', d:'20×20 m · Doppler-Radar' },
        { l:'Rauchmelder optisch', d:'Streulicht · DIN EN 54-7' },
        { l:'IR-Lichtschranken innen', d:'Vorhang für Türen/Durchgänge' },
      ]},
    { n:4, name:'OBJEKT', color:'#f472b6',
      tech:[
        { l:'Erschütterungsmelder', d:'Piezo · 2m Radius auf Tresor' },
        { l:'Körperschallmelder', d:'Bohren/Flexen/Sprengen erkennen' },
        { l:'Kapazitiver Feldmelder', d:'Alarm VOR Berührung (0,5 m)' },
        { l:'Wandungsmelder', d:'Drahtgitter im Stahlbeton' },
        { l:'Neigungssensor', d:'MEMS · erkennt Anheben/Kippen' },
      ]},
  ];

  let yaw = 25, pitch = 30, zoom = 1.0;
  let activeZone = null;
  let zoneVisible = [true, true, true, true];
  let canvasW = 800, canvasH = 600;
  let drag = null;
  let autoRotate = true;

  function project(x, y, z) {
    const cx = x - PROP.w/2;
    const cy = y;
    const cz = z - PROP.d/2;
    const yawR = yaw * Math.PI/180;
    const pitchR = pitch * Math.PI/180;
    const rx = cx * Math.cos(yawR) - cz * Math.sin(yawR);
    const rz = cx * Math.sin(yawR) + cz * Math.cos(yawR);
    const ry = cy * Math.cos(pitchR) - rz * Math.sin(pitchR);
    const rrz = cy * Math.sin(pitchR) + rz * Math.cos(pitchR);
    return {
      sx: canvasW/2 + rx * 22 * zoom,
      sy: canvasH/2 + 60 - ry * 22 * zoom,
      depth: rrz
    };
  }

  function shade(hex, b) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const bl = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.round(r*b)},${Math.round(g*b)},${Math.round(bl*b)})`;
  }

  function view(d) {
    activeZone = null;
    zoneVisible = [true, true, true, true];

    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'3D · Interaktives Modell' }),
      el('h1', { text:'Sicherheits-Haus 3D' }),
      el('p', { text:'Vom Außenzaun bis zum Tresor — alle 4 Schutzzonen interaktiv in 3D. Drag zum Drehen, Klick auf Zone für Sicherheitstechnik.' })
    ]));

    // Zone-Buttons (kompakt oben)
    const zonesBar = el('div', { class:'haus-zonebar' });
    ZONES.forEach(z => {
      const b = el('button', { class:'haus-zone-btn', dataset:{n:z.n} });
      b.style.setProperty('--c', z.color);
      b.innerHTML = `
        <div class="haus-zone-num">${z.n}</div>
        <div class="haus-zone-name">${z.name}</div>
        <button class="haus-zone-eye" data-toggle="1" title="Ein/Ausblenden"><i class="fas fa-eye"></i></button>
      `;
      // Main button area = activate zone
      b.addEventListener('click', e => {
        if (e.target.closest('[data-toggle]')) return;
        activeZone = activeZone === z.n ? null : z.n;
        zonesBar.querySelectorAll('.haus-zone-btn').forEach(x => x.classList.toggle('active', +x.dataset.n === activeZone));
        renderDetails();
        draw();
      });
      // Eye-toggle visibility
      b.querySelector('[data-toggle]').addEventListener('click', e => {
        e.stopPropagation();
        zoneVisible[z.n-1] = !zoneVisible[z.n-1];
        e.currentTarget.querySelector('i').className = zoneVisible[z.n-1] ? 'fas fa-eye' : 'fas fa-eye-slash';
        e.currentTarget.classList.toggle('off', !zoneVisible[z.n-1]);
        draw();
      });
      zonesBar.appendChild(b);
    });
    root.appendChild(zonesBar);

    // Canvas-Card
    const card = el('div', { class:'haus-card' });
    root.appendChild(card);

    const cv = el('canvas', { class:'haus-canvas' });
    card.appendChild(cv);

    // View controls top-right
    const ctrl = el('div', { class:'haus-ctrl' });
    ctrl.innerHTML = `
      <button data-rot="-20" title="Links"><i class="fas fa-rotate-left"></i></button>
      <button data-rot="20" title="Rechts"><i class="fas fa-rotate-right"></i></button>
      <button data-zoom="+" title="Heran"><i class="fas fa-plus"></i></button>
      <button data-zoom="-" title="Heraus"><i class="fas fa-minus"></i></button>
      <button data-auto="1" title="Auto-Drehen" class="active"><i class="fas fa-arrows-rotate"></i></button>
      <button data-reset="1" title="Reset"><i class="fas fa-arrows-to-circle"></i></button>
    `;
    card.appendChild(ctrl);

    ctrl.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.rot) { yaw = yaw + +b.dataset.rot; draw(); }
      if (b.dataset.zoom === '+') { zoom = Math.min(2.5, zoom * 1.15); draw(); }
      if (b.dataset.zoom === '-') { zoom = Math.max(.5, zoom / 1.15); draw(); }
      if (b.dataset.auto) {
        autoRotate = !autoRotate;
        b.classList.toggle('active', autoRotate);
      }
      if (b.dataset.reset) { yaw = 25; pitch = 30; zoom = 1.0; draw(); }
    });

    // Details panel
    const details = el('div', { class:'haus-details' });
    root.appendChild(details);

    function renderDetails() {
      if (!activeZone) {
        details.innerHTML = `
          <div class="haus-details-empty">
            <i class="fas fa-hand-pointer"></i>
            Wähle eine Zone für typische Sicherheitstechnik
          </div>`;
        return;
      }
      const z = ZONES.find(x => x.n === activeZone);
      details.innerHTML = `
        <div class="haus-details-card" style="--c:${z.color}">
          <div class="haus-d-head">
            <div class="haus-d-num">${z.n}</div>
            <h3>${z.name}</h3>
          </div>
          <div class="haus-d-tech">
            ${z.tech.map(t => `
              <div class="haus-d-item">
                <div class="haus-d-dot"></div>
                <div>
                  <div class="haus-d-lbl">${t.l}</div>
                  <div class="haus-d-desc">${t.d}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    renderDetails();

    // ===== Animation =====
    function animate() {
      if (autoRotate && !drag) yaw = (yaw + 0.18) % 360;
      draw();
      requestAnimationFrame(animate);
    }

    function fit() {
      const W = cv.parentElement.clientWidth - 2;
      const H = 520;
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
      // Sky/ground gradient
      const bg = ctx.createLinearGradient(0,0,0,canvasH);
      bg.addColorStop(0, 'rgba(11,20,36,.9)');
      bg.addColorStop(.55, 'rgba(34,86,128,.5)');
      bg.addColorStop(1, 'rgba(22,82,42,.5)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,canvasW,canvasH);

      const items = [];

      // ZONE 1: Garten/Grundstück + Außenzaun
      if (zoneVisible[0]) drawZone1(items);
      // ZONE 2: Hauswand + Dach
      if (zoneVisible[1]) drawZone2(items);
      // ZONE 3: Innenwände + Möbel
      if (zoneVisible[2]) drawZone3(items);
      // ZONE 4: Tresor
      if (zoneVisible[3]) drawZone4(items);

      // Compass
      items.push({ depth: -10000, fn: () => drawCompass(ctx) });

      items.sort((a,b) => b.depth - a.depth);
      items.forEach(i => i.fn());

      // Overlay: Zone-Label oben
      if (activeZone) {
        const z = ZONES.find(x => x.n === activeZone);
        ctx.fillStyle = z.color;
        ctx.font = 'bold 14px system-ui';
        ctx.shadowBlur = 12;
        ctx.shadowColor = z.color;
        ctx.fillText(`ZONE ${z.n} · ${z.name}`, 14, 28);
        ctx.shadowBlur = 0;
      }
    }

    function drawZone1(items) {
      const z = ZONES[0];
      const isActive = activeZone === 1;
      const hl = isActive ? 1.0 : 0.7;
      // Ground plane
      const c = [
        project(0, 0, 0), project(PROP.w, 0, 0),
        project(PROP.w, 0, PROP.d), project(0, 0, PROP.d),
      ];
      const gd = (c[0].depth + c[2].depth) / 2;
      items.push({ depth: gd + 100, fn: () => {
        const grd = ctx2(c[0].sx, c[0].sy, c[2].sx, c[2].sy);
        grd.addColorStop(0, isActive ? 'rgba(34,197,94,.35)' : 'rgba(34,197,94,.15)');
        grd.addColorStop(1, 'rgba(22,82,42,.15)');
        const ctx = cv.getContext('2d');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(c[0].sx, c[0].sy);
        c.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath(); ctx.fill();
        // Grid
        ctx.strokeStyle = 'rgba(34,197,94,.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= PROP.w; x += 2) {
          const a = project(x, 0, 0), b = project(x, 0, PROP.d);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
        for (let z = 0; z <= PROP.d; z += 2) {
          const a = project(0, 0, z), b = project(PROP.w, 0, z);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }});

      // Fence: 4 sides
      const fenceH = 1.8;
      const fenceCorners = [
        [0,0],[PROP.w,0],[PROP.w,PROP.d],[0,PROP.d]
      ];
      const fenceEdges = [[0,1],[1,2],[2,3],[3,0]];
      fenceEdges.forEach(([a,b]) => {
        const x1 = fenceCorners[a][0], z1 = fenceCorners[a][1];
        const x2 = fenceCorners[b][0], z2 = fenceCorners[b][1];
        // Gate in front edge (south side, z=PROP.d/2 missing)
        const gateInSide = (z1 === PROP.d && z2 === PROP.d);
        if (gateInSide) {
          // Split into 2 segments around gate
          const gateStart = PROP.w/2 - 1.5, gateEnd = PROP.w/2 + 1.5;
          drawFenceSegment(items, x1, z1, gateStart, z2, fenceH, z.color, hl);
          drawFenceSegment(items, gateEnd, z1, x2, z2, fenceH, z.color, hl);
        } else {
          drawFenceSegment(items, x1, z1, x2, z2, fenceH, z.color, hl);
        }
      });

      // Few trees in garden corners
      drawTree(items, 1.5, 1.5);
      drawTree(items, PROP.w - 1.5, 1.5);
      drawTree(items, 1.5, PROP.d - 1.5);
      drawTree(items, PROP.w - 1.5, PROP.d - 1.5);
    }

    function drawFenceSegment(items, x1, z1, x2, z2, h, color, hl) {
      const len = Math.hypot(x2-x1, z2-z1);
      const steps = Math.max(3, Math.floor(len * 1.5));
      const a = project(x1, 0, z1), b = project(x2, 0, z2);
      const at = project(x1, h, z1), bt = project(x2, h, z2);
      const dep = (a.depth + b.depth + at.depth + bt.depth)/4;
      items.push({ depth: dep, fn: () => {
        const ctx = cv.getContext('2d');
        // Bottom rail
        ctx.strokeStyle = color;
        ctx.globalAlpha = hl;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
        // Top rail
        ctx.beginPath();
        ctx.moveTo(at.sx, at.sy); ctx.lineTo(bt.sx, bt.sy);
        ctx.stroke();
        // Vertical posts
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const px = x1 + (x2-x1)*t;
          const pz = z1 + (z2-z1)*t;
          const bot = project(px, 0, pz);
          const top = project(px, h, pz);
          ctx.beginPath();
          ctx.moveTo(bot.sx, bot.sy); ctx.lineTo(top.sx, top.sy);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }});
    }

    function drawTree(items, x, z) {
      const trunk = project(x, 0, z);
      const top = project(x, 2.5, z);
      items.push({ depth: trunk.depth + 0.1, fn: () => {
        const ctx = cv.getContext('2d');
        // Trunk
        ctx.strokeStyle = '#7c4a1c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(trunk.sx, trunk.sy); ctx.lineTo(top.sx, top.sy);
        ctx.stroke();
        // Leaves (circle)
        ctx.fillStyle = 'rgba(34,197,94,.6)';
        ctx.strokeStyle = 'rgba(22,82,42,.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(top.sx, top.sy, 14, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
      }});
    }

    function drawZone2(items) {
      const z = ZONES[1];
      const isActive = activeZone === 2;
      const hl = isActive ? 1.0 : 0.8;
      const hx = HOUSE.x, hz = HOUSE.z, hw = HOUSE.w, hd = HOUSE.d, hh = HOUSE.h;
      // 4 walls
      const walls = [
        { p1:[hx, 0, hz], p2:[hx+hw, 0, hz], b:0.95 },  // North
        { p1:[hx+hw, 0, hz], p2:[hx+hw, 0, hz+hd], b:0.7 },  // East
        { p1:[hx+hw, 0, hz+hd], p2:[hx, 0, hz+hd], b:0.55 },  // South (front)
        { p1:[hx, 0, hz+hd], p2:[hx, 0, hz], b:0.8 },  // West
      ];
      const wallColor = '#3b5b8a';
      walls.forEach((w, i) => {
        const [x1,y1,z1] = w.p1, [x2,y2,z2] = w.p2;
        const a = project(x1, y1, z1), b = project(x2, y2, z2);
        const at = project(x1, hh, z1), bt = project(x2, hh, z2);
        const dep = (a.depth + b.depth + at.depth + bt.depth)/4;
        items.push({ depth: dep, fn: () => {
          const ctx = cv.getContext('2d');
          ctx.fillStyle = shade(wallColor, w.b * hl);
          ctx.strokeStyle = isActive ? z.color : 'rgba(255,255,255,.2)';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
          ctx.lineTo(bt.sx, bt.sy); ctx.lineTo(at.sx, at.sy);
          ctx.closePath();
          ctx.fill(); ctx.stroke();

          // Front door on south wall, middle
          if (i === 2) {
            // Door from x = hx+hw/2-0.5 to hx+hw/2+0.5
            const dx1 = hx + hw/2 - 0.6, dx2 = hx + hw/2 + 0.6;
            const da = project(dx1, 0, hz+hd);
            const dbBot = project(dx2, 0, hz+hd);
            const daTop = project(dx1, 2.1, hz+hd);
            const dbTop = project(dx2, 2.1, hz+hd);
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = isActive ? z.color : '#fff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(da.sx, da.sy); ctx.lineTo(dbBot.sx, dbBot.sy);
            ctx.lineTo(dbTop.sx, dbTop.sy); ctx.lineTo(daTop.sx, daTop.sy);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
          }
          // Windows
          const winY1 = 1.0, winY2 = 1.9;
          if (i === 0) {  // North wall: 2 windows
            [hx + 2.5, hx + hw - 4].forEach(wx => {
              drawWindow(ctx, wx, winY1, hz, wx+1.5, winY2, hz, isActive ? z.color : '#67e8f9');
            });
          } else if (i === 1) {  // East wall: 1 window
            drawWindow(ctx, hx+hw, winY1, hz+2.5, hx+hw, winY2, hz+4, isActive ? z.color : '#67e8f9');
          } else if (i === 3) {  // West wall: 1 window
            drawWindow(ctx, hx, winY1, hz+2.5, hx, winY2, hz+4, isActive ? z.color : '#67e8f9');
          } else if (i === 2) { // South: window left of door
            drawWindow(ctx, hx + 1.5, winY1, hz+hd, hx + 3.5, winY2, hz+hd, isActive ? z.color : '#67e8f9');
            drawWindow(ctx, hx + hw - 3.5, winY1, hz+hd, hx + hw - 1.5, winY2, hz+hd, isActive ? z.color : '#67e8f9');
          }
        }});
      });
      // Roof (pitched)
      const peakX = hx + hw/2;
      const peakZN = project(peakX, ROOF_PEAK, hz);
      const peakZS = project(peakX, ROOF_PEAK, hz+hd);
      const cN = project(hx, hh, hz), cNE = project(hx+hw, hh, hz);
      const cS = project(hx, hh, hz+hd), cSE = project(hx+hw, hh, hz+hd);
      // Gable N
      items.push({ depth: cN.depth - 0.5, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade('#5a2e2e', isActive ? 1 : 0.85);
        ctx.strokeStyle = isActive ? z.color : 'rgba(255,255,255,.15)';
        ctx.beginPath();
        ctx.moveTo(cN.sx, cN.sy); ctx.lineTo(cNE.sx, cNE.sy); ctx.lineTo(peakZN.sx, peakZN.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }});
      // Gable S
      items.push({ depth: cS.depth - 0.5, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade('#5a2e2e', isActive ? 0.85 : 0.7);
        ctx.strokeStyle = isActive ? z.color : 'rgba(255,255,255,.15)';
        ctx.beginPath();
        ctx.moveTo(cS.sx, cS.sy); ctx.lineTo(cSE.sx, cSE.sy); ctx.lineTo(peakZS.sx, peakZS.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }});
      // West slope
      items.push({ depth: cN.depth - 0.3, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade('#5a2e2e', isActive ? 0.95 : 0.8);
        ctx.strokeStyle = isActive ? z.color : 'rgba(255,255,255,.15)';
        ctx.beginPath();
        ctx.moveTo(cN.sx, cN.sy); ctx.lineTo(cS.sx, cS.sy);
        ctx.lineTo(peakZS.sx, peakZS.sy); ctx.lineTo(peakZN.sx, peakZN.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }});
      // East slope
      items.push({ depth: cNE.depth - 0.3, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade('#5a2e2e', isActive ? 0.75 : 0.6);
        ctx.strokeStyle = isActive ? z.color : 'rgba(255,255,255,.15)';
        ctx.beginPath();
        ctx.moveTo(cNE.sx, cNE.sy); ctx.lineTo(cSE.sx, cSE.sy);
        ctx.lineTo(peakZS.sx, peakZS.sy); ctx.lineTo(peakZN.sx, peakZN.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }});
    }

    function drawWindow(ctx, x1, y1, z1, x2, y2, z2, color) {
      const a = project(x1, y1, z1), b = project(x2, y1, z2);
      const c = project(x2, y2, z2), d = project(x1, y2, z1);
      ctx.fillStyle = color + '70';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
      ctx.lineTo(c.sx, c.sy); ctx.lineTo(d.sx, d.sy);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Cross
      const m1 = { sx:(a.sx+b.sx)/2, sy:(a.sy+b.sy)/2 };
      const m2 = { sx:(c.sx+d.sx)/2, sy:(c.sy+d.sy)/2 };
      const m3 = { sx:(a.sx+d.sx)/2, sy:(a.sy+d.sy)/2 };
      const m4 = { sx:(b.sx+c.sx)/2, sy:(b.sy+c.sy)/2 };
      ctx.beginPath(); ctx.moveTo(m1.sx, m1.sy); ctx.lineTo(m2.sx, m2.sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m3.sx, m3.sy); ctx.lineTo(m4.sx, m4.sy); ctx.stroke();
    }

    function drawZone3(items) {
      const z = ZONES[2];
      const isActive = activeZone === 3;
      const hl = isActive ? 1.0 : 0.7;
      const hx = HOUSE.x, hz = HOUSE.z, hw = HOUSE.w, hd = HOUSE.d, hh = HOUSE.h;
      // Floor slab inside
      const slabC = [
        project(hx, 0.01, hz), project(hx+hw, 0.01, hz),
        project(hx+hw, 0.01, hz+hd), project(hx, 0.01, hz+hd),
      ];
      const sd = (slabC[0].depth + slabC[2].depth) / 2;
      items.push({ depth: sd + 0.05, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade('#9f7553', hl * 0.6);
        ctx.beginPath();
        ctx.moveTo(slabC[0].sx, slabC[0].sy);
        slabC.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath(); ctx.fill();
      }});
      // 2 inner walls dividing into 3 rooms
      const wallY = 2.6;
      const wallColor = '#9aa4b3';
      // Wall at x = hx + 4
      const w1 = [
        project(hx+4, 0, hz), project(hx+4, 0, hz+hd),
        project(hx+4, wallY, hz+hd), project(hx+4, wallY, hz)
      ];
      // Door opening at z = hz + 3 to hz + 4 → split wall
      const wd1 = (w1[0].depth + w1[1].depth + w1[2].depth + w1[3].depth)/4;
      items.push({ depth: wd1 - 0.1, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade(wallColor, hl * 0.7);
        ctx.strokeStyle = isActive ? z.color : 'rgba(0,0,0,.3)';
        ctx.lineWidth = isActive ? 2 : 1;
        // Wall split by door opening at z=3 to z=4
        // Lower part: hz to hz+3
        const p1 = project(hx+4, 0, hz), p2 = project(hx+4, 0, hz+3);
        const p3 = project(hx+4, wallY, hz+3), p4 = project(hx+4, wallY, hz);
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy); ctx.lineTo(p4.sx, p4.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // Upper part: hz+4 to hz+hd
        const q1 = project(hx+4, 0, hz+4), q2 = project(hx+4, 0, hz+hd);
        const q3 = project(hx+4, wallY, hz+hd), q4 = project(hx+4, wallY, hz+4);
        ctx.beginPath();
        ctx.moveTo(q1.sx, q1.sy); ctx.lineTo(q2.sx, q2.sy);
        ctx.lineTo(q3.sx, q3.sy); ctx.lineTo(q4.sx, q4.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }});
      // Wall at x = hx + 8
      const w2 = [
        project(hx+8, 0, hz), project(hx+8, 0, hz+hd),
        project(hx+8, wallY, hz+hd), project(hx+8, wallY, hz)
      ];
      const wd2 = (w2[0].depth + w2[1].depth + w2[2].depth + w2[3].depth)/4;
      items.push({ depth: wd2 - 0.1, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = shade(wallColor, hl * 0.7);
        ctx.strokeStyle = isActive ? z.color : 'rgba(0,0,0,.3)';
        ctx.lineWidth = isActive ? 2 : 1;
        const p1 = project(hx+8, 0, hz), p2 = project(hx+8, 0, hz+3);
        const p3 = project(hx+8, wallY, hz+3), p4 = project(hx+8, wallY, hz);
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy); ctx.lineTo(p4.sx, p4.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        const q1 = project(hx+8, 0, hz+4), q2 = project(hx+8, 0, hz+hd);
        const q3 = project(hx+8, wallY, hz+hd), q4 = project(hx+8, wallY, hz+4);
        ctx.beginPath();
        ctx.moveTo(q1.sx, q1.sy); ctx.lineTo(q2.sx, q2.sy);
        ctx.lineTo(q3.sx, q3.sy); ctx.lineTo(q4.sx, q4.sy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }});
      // Room labels
      const labels = [
        { x: hx + 2, z: hz + hd/2, name: 'WOHNEN' },
        { x: hx + 6, z: hz + hd/2, name: 'KÜCHE' },
        { x: hx + 10, z: hz + hd/2, name: 'SCHLAF' },
      ];
      labels.forEach(l => {
        const p = project(l.x, 0.02, l.z);
        items.push({ depth: sd - 0.05, fn: () => {
          const ctx = cv.getContext('2d');
          ctx.fillStyle = isActive ? z.color : 'rgba(255,255,255,.5)';
          ctx.font = `bold ${10*zoom}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText(l.name, p.sx, p.sy);
          ctx.textAlign = 'start';
        }});
      });
    }

    function drawZone4(items) {
      const z = ZONES[3];
      const isActive = activeZone === 4;
      // Tresor in middle room (Küche) at hx+5.5, z+3.5
      const tx = HOUSE.x + 5.5, tz = HOUSE.z + 3.5;
      const tw = 1.2, td = 1.2, th = 1.6;
      // Box corners
      const c000 = project(tx, 0, tz);
      const c100 = project(tx+tw, 0, tz);
      const c110 = project(tx+tw, 0, tz+td);
      const c010 = project(tx, 0, tz+td);
      const c001 = project(tx, th, tz);
      const c101 = project(tx+tw, th, tz);
      const c111 = project(tx+tw, th, tz+td);
      const c011 = project(tx, th, tz+td);
      // 5 faces (no bottom)
      const faces = [
        { pts:[c001, c101, c111, c011], b:0.95 },  // top
        { pts:[c000, c100, c101, c001], b:0.7 },  // N
        { pts:[c100, c110, c111, c101], b:0.55 },  // E
        { pts:[c110, c010, c011, c111], b:0.6 },  // S
        { pts:[c010, c000, c001, c011], b:0.8 },  // W
      ];
      const depth = (c000.depth + c111.depth) / 2 - 0.5;
      faces.forEach(f => {
        const fdep = f.pts.reduce((s,p)=>s+p.depth,0) / 4;
        items.push({ depth: fdep, fn: () => {
          const ctx = cv.getContext('2d');
          ctx.fillStyle = shade('#475569', f.b);
          ctx.strokeStyle = isActive ? z.color : 'rgba(255,255,255,.3)';
          ctx.lineWidth = isActive ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.moveTo(f.pts[0].sx, f.pts[0].sy);
          f.pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }});
      });
      // Tresor-Tür-Detail + Drehknauf
      items.push({ depth: depth - 1, fn: () => {
        const ctx = cv.getContext('2d');
        const ctr = project(tx + tw/2, th * 0.55, tz + td);
        if (isActive) {
          ctx.shadowBlur = 24;
          ctx.shadowColor = z.color;
        }
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = isActive ? z.color : '#7c2d12';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ctr.sx, ctr.sy, 8, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0b1424';
        ctx.font = 'bold 9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('$', ctr.sx, ctr.sy + 3);
        ctx.textAlign = 'start';
      }});
      // Label
      const lblP = project(tx + tw/2, th + 0.3, tz + td/2);
      items.push({ depth: depth, fn: () => {
        const ctx = cv.getContext('2d');
        ctx.fillStyle = isActive ? z.color : 'rgba(255,255,255,.7)';
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        if (isActive) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = z.color;
        }
        ctx.fillText('TRESOR', lblP.sx, lblP.sy);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'start';
      }});
    }

    function ctx2(x1, y1, x2, y2) {
      const ctx = cv.getContext('2d');
      return ctx.createLinearGradient(x1, y1, x2, y2);
    }

    function drawCompass(ctx) {
      const cx = 40, cy = canvasH - 40;
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.3)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI*2); ctx.stroke();
      const yawR = yaw * Math.PI/180;
      const tipX = cx + Math.sin(yawR) * 16;
      const tipY = cy - Math.cos(yawR) * 16;
      const baseX = cx - Math.sin(yawR) * 8;
      const baseY = cy + Math.cos(yawR) * 8;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      const perpX = Math.cos(yawR) * 4, perpY = Math.sin(yawR) * 4;
      ctx.lineTo(baseX - perpX, baseY - perpY);
      ctx.lineTo(baseX + perpX, baseY + perpY);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('N', tipX, tipY - 3);
      ctx.textAlign = 'start';
    }

    // Interaction
    cv.addEventListener('mousedown', e => {
      const r = cv.getBoundingClientRect();
      drag = { lastX: e.clientX - r.left, lastY: e.clientY - r.top };
      autoRotate = false;
      ctrl.querySelector('[data-auto]').classList.remove('active');
    });
    cv.addEventListener('mousemove', e => {
      if (!drag) return;
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      yaw = yaw + (mx - drag.lastX) * 0.5;
      pitch = Math.max(10, Math.min(80, pitch - (my - drag.lastY) * 0.3));
      drag.lastX = mx; drag.lastY = my;
      draw();
    });
    cv.addEventListener('mouseup', () => { drag = null; });
    cv.addEventListener('mouseleave', () => { drag = null; });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      zoom = Math.max(.5, Math.min(2.5, zoom * (e.deltaY < 0 ? 1.1 : 1/1.1)));
      draw();
    }, { passive:false });
    cv.addEventListener('touchstart', e => {
      const t = e.touches[0];
      cv.dispatchEvent(new MouseEvent('mousedown', { clientX: t.clientX, clientY: t.clientY }));
      e.preventDefault();
    }, { passive:false });
    cv.addEventListener('touchmove', e => {
      const t = e.touches[0];
      cv.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY }));
      e.preventDefault();
    }, { passive:false });
    cv.addEventListener('touchend', () => cv.dispatchEvent(new MouseEvent('mouseup')));

    window.addEventListener('resize', draw);
    requestAnimationFrame(animate);
    return root;
  }

  return { view };
})();
