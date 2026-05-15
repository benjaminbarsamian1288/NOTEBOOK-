/* 3D-Zwiebelmodell · Interaktives Schutzzonen-Modell
   Rotierbar, mit klickbaren Schichten, Animation und Drill-Down. */

window.ZWIEBEL3D = (() => {
  const { el } = U;

  const ZONES = [
    { n:1, name:'PERIMETER',  area:'Grundstück · Freigelände', color:'#38bdf8',
      icon:'fa-tower-broadcast', radius:200,
      mechanics:'Zäune, Tore, Poller, Schranken',
      sensors:'Zaunsensoren, IR-Schranken, Thermalkamera, Radar' },
    { n:2, name:'AUSSENHAUT', area:'Fassade · Türen · Fenster', color:'#818cf8',
      icon:'fa-door-closed', radius:150,
      mechanics:'RC-Türen, RC-Fenster, P-Glas, Rolllläden',
      sensors:'Magnetkontakte, Glasbruch, Schließblech' },
    { n:3, name:'INNENRAUM',  area:'Räume · Flure · Treppen', color:'#c084fc',
      icon:'fa-people-roof', radius:100,
      mechanics:'Innentüren, Raumtrennung',
      sensors:'PIR, Dualmelder, Mikrowelle, Ultraschall' },
    { n:4, name:'OBJEKT',     area:'Tresor · Wertbehältnis', color:'#f472b6',
      icon:'fa-vault', radius:50,
      mechanics:'EN 1143-1 Tresore, Panzerschränke',
      sensors:'Erschütterung, Körperschall, Kapazitiv, Seismisch' }
  ];

  let yaw = 25, pitch = 30, zoom = 1.0;
  let activeZone = null;
  let canvasW = 800, canvasH = 600;
  let drag = null;

  function project(x, y, z) {
    const yawR = yaw * Math.PI/180;
    const pitchR = pitch * Math.PI/180;
    const rx = x * Math.cos(yawR) - z * Math.sin(yawR);
    const rz = x * Math.sin(yawR) + z * Math.cos(yawR);
    const ry = y * Math.cos(pitchR) - rz * Math.sin(pitchR);
    const rrz = y * Math.sin(pitchR) + rz * Math.cos(pitchR);
    return {
      sx: canvasW/2 + rx * zoom,
      sy: canvasH/2 - ry * zoom,
      depth: rrz
    };
  }

  function view(d) {
    activeZone = null;
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'3D · Sicherheitskonzept' }),
      el('h1', { text:'3D-Zwiebelmodell · Schutzzonen' }),
      el('p', { text:'Das Zwiebelprinzip in 3D – 4 ineinander geschachtelte Schutzschichten. Drag zum Drehen, Klick auf eine Zone für Details.' })
    ]));

    const card = el('div', { class:'zw-card' });
    root.appendChild(card);

    const cv = el('canvas', { class:'zw-canvas' });
    card.appendChild(cv);

    // Floating zone buttons
    const zonesBox = el('div', { class:'zw-zonebox' });
    ZONES.forEach(z => {
      const b = el('button', { class:'zw-zone-btn', dataset:{n:z.n} });
      b.style.setProperty('--c', z.color);
      b.innerHTML = `
        <div class="zw-zone-num">${z.n}</div>
        <div class="zw-zone-info">
          <div class="zw-zone-name">${z.name}</div>
          <div class="zw-zone-area">${z.area}</div>
        </div>
        <i class="fas ${z.icon}"></i>
      `;
      b.addEventListener('click', () => {
        activeZone = activeZone === z.n ? null : z.n;
        zonesBox.querySelectorAll('.zw-zone-btn').forEach(x => x.classList.toggle('active', +x.dataset.n === activeZone));
        renderDetails();
        draw();
      });
      zonesBox.appendChild(b);
    });
    card.appendChild(zonesBox);

    const details = el('div', { class:'zw-details' });
    card.appendChild(details);

    function renderDetails() {
      if (!activeZone) {
        details.innerHTML = `
          <div class="zw-details-empty">
            <i class="fas fa-hand-pointer"></i>
            Wähle eine Zone für Details (Mechanik, Sensoren, Normen)
          </div>`;
        return;
      }
      const z = ZONES.find(x => x.n === activeZone);
      details.innerHTML = `
        <div class="zw-details-card" style="--c:${z.color}">
          <div class="zw-d-head">
            <div class="zw-d-num">${z.n}</div>
            <div>
              <h3>${z.name}</h3>
              <div class="zw-d-area">${z.area}</div>
            </div>
            <i class="fas ${z.icon} zw-d-icon"></i>
          </div>
          <div class="zw-d-section">
            <div class="zw-d-title"><i class="fas fa-hammer"></i> MECHANIK</div>
            <div class="zw-d-body">${z.mechanics}</div>
          </div>
          <div class="zw-d-section">
            <div class="zw-d-title"><i class="fas fa-wave-square"></i> SENSOREN</div>
            <div class="zw-d-body">${z.sensors}</div>
          </div>
        </div>
      `;
    }
    renderDetails();

    // Rotation auto + manual
    let autoYaw = true;
    function animate(now) {
      if (autoYaw && !drag) yaw = (yaw + 0.15) % 360;
      draw();
      requestAnimationFrame(animate);
    }

    function fit() {
      const W = cv.parentElement.clientWidth - 2;
      const H = 460;
      const dpr = window.devicePixelRatio || 1;
      cv.width = W*dpr; cv.height = H*dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      canvasW = W; canvasH = H;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      // Auto-scale zoom
      zoom = Math.min(W, H) / 500;
      return ctx;
    }

    function draw() {
      const ctx = fit();
      ctx.clearRect(0,0,canvasW,canvasH);

      // Background gradient
      const bg = ctx.createRadialGradient(canvasW/2, canvasH/2, 0, canvasW/2, canvasH/2, Math.max(canvasW, canvasH)/2);
      bg.addColorStop(0, 'rgba(56,189,248,.05)');
      bg.addColorStop(1, 'rgba(11,20,36,.6)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,canvasW,canvasH);

      // Sort zones by depth (back to front)
      // We render each zone as a spherical-like ring
      const items = [];
      ZONES.forEach((z, idx) => {
        const r = z.radius;
        const isActive = activeZone === z.n;
        // Draw a top "dome" + bottom "rim" for 3D effect
        // Project key points
        const top = project(0, r, 0);
        const bot = project(0, -r, 0);
        items.push({ depth: top.depth, fn: () => drawSphereLayer(ctx, z, isActive) });
      });

      // Core (golden value object)
      items.push({ depth: -1000, fn: () => drawCore(ctx) });

      items.sort((a,b) => b.depth - a.depth);
      items.forEach(i => i.fn());

      // Compass/title
      ctx.fillStyle = 'rgba(255,255,255,.6)';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('Zwiebelprinzip · 4 Schutzschichten', 14, 20);
    }

    function drawSphereLayer(ctx, z, isActive) {
      const r = z.radius;
      // Draw as set of ellipses for wireframe + filled face
      const segments = 32;
      ctx.save();
      // Filled translucent face (front half)
      const grd = ctx.createRadialGradient(canvasW/2, canvasH/2, 0, canvasW/2, canvasH/2, r*zoom);
      grd.addColorStop(0, z.color + '08');
      grd.addColorStop(1, z.color + (isActive ? '50' : '20'));
      ctx.fillStyle = grd;
      // Outline ellipse at equator (in front)
      ctx.beginPath();
      for (let i = 0; i < segments; i++) {
        const ang = i/segments * Math.PI*2;
        const p = project(Math.cos(ang)*r, 0, Math.sin(ang)*r);
        if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isActive ? z.color : z.color + 'b0';
      ctx.lineWidth = isActive ? 3 : 1.5;
      ctx.stroke();

      // Meridians (vertical lines)
      ctx.strokeStyle = z.color + (isActive ? 'a0' : '50');
      ctx.lineWidth = isActive ? 1.5 : 1;
      for (let m = 0; m < 6; m++) {
        const angM = m/6 * Math.PI*2;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const phi = i/segments * Math.PI - Math.PI/2;
          const xx = Math.cos(phi) * Math.cos(angM) * r;
          const yy = Math.sin(phi) * r;
          const zz = Math.cos(phi) * Math.sin(angM) * r;
          const p = project(xx, yy, zz);
          if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }
      // Latitudes (horizontal rings)
      for (let l = 1; l < 5; l++) {
        const phi = l/5 * Math.PI - Math.PI/2;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const ang = i/segments * Math.PI*2;
          const xx = Math.cos(phi) * Math.cos(ang) * r;
          const yy = Math.sin(phi) * r;
          const zz = Math.cos(phi) * Math.sin(ang) * r;
          const p = project(xx, yy, zz);
          if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy);
        }
        ctx.stroke();
      }

      // Label at top
      const topP = project(0, r + 16, 0);
      ctx.fillStyle = z.color;
      ctx.font = `bold 12px system-ui`;
      ctx.textAlign = 'center';
      if (isActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = z.color;
      }
      ctx.fillText(`ZONE ${z.n} · ${z.name}`, topP.sx, topP.sy);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'start';
      ctx.restore();
    }

    function drawCore(ctx) {
      // Golden inner core "WERT" — visible if Zone 4 visible
      const r = 22;
      const p = project(0, 0, 0);
      const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r);
      grd.addColorStop(0, '#fef3c7');
      grd.addColorStop(.5, '#fbbf24');
      grd.addColorStop(1, '#ef4444');
      ctx.fillStyle = grd;
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0b1424';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('WERT', p.sx, p.sy);
      ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
    }

    // Interaction
    cv.addEventListener('mousedown', e => {
      const r = cv.getBoundingClientRect();
      drag = { lastX: e.clientX - r.left, lastY: e.clientY - r.top, moved: false };
      autoYaw = false;
    });
    cv.addEventListener('mousemove', e => {
      if (!drag) return;
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      yaw = yaw + (mx - drag.lastX) * 0.6;
      pitch = Math.max(-60, Math.min(60, pitch - (my - drag.lastY) * 0.4));
      drag.lastX = mx; drag.lastY = my;
      drag.moved = true;
      draw();
    });
    cv.addEventListener('mouseup', () => { drag = null; });
    cv.addEventListener('mouseleave', () => { drag = null; });
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
