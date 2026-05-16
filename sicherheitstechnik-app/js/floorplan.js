/* Floor-Plan-Planner · Drag & Drop Komponenten mit FoV-Vorschau
   Persistiert in localStorage */

window.FLOORPLAN = (() => {
  const { el } = U;

  const STORE = 'floorplan_v1';

  const COMPONENTS = [
    { id:'pir', name:'PIR-Melder', icon:'fa-broadcast-tower', color:'#22d3ee', fov:{ angle:110, range:80 }, w:18, h:18 },
    { id:'mw',  name:'Mikrowellen', icon:'fa-satellite-dish', color:'#a855f7', fov:{ angle:120, range:120 }, w:18, h:18 },
    { id:'cam-bullet', name:'Kamera Bullet', icon:'fa-video', color:'#06b6d4', fov:{ angle:90, range:140 }, w:20, h:14 },
    { id:'cam-ptz', name:'PTZ-Kamera', icon:'fa-camera', color:'#dc2626', fov:{ angle:360, range:180 }, w:22, h:22 },
    { id:'cam-thermal', name:'Wärmebild', icon:'fa-fire', color:'#ef4444', fov:{ angle:25, range:250 }, w:20, h:14 },
    { id:'magnet', name:'Magnetkontakt', icon:'fa-magnet', color:'#22c55e', fov:null, w:14, h:8 },
    { id:'glass', name:'Glasbruch', icon:'fa-wine-glass', color:'#fbbf24', fov:{ angle:360, range:40 }, w:14, h:14 },
    { id:'siren', name:'Sirene 110 dB', icon:'fa-bell', color:'#dc2626', fov:{ angle:360, range:100 }, w:16, h:16 },
    { id:'door', name:'Tür', icon:'fa-door-closed', color:'#7c3aed', fov:null, w:30, h:8 },
    { id:'window', name:'Fenster', icon:'fa-window-maximize', color:'#06b6d4', fov:null, w:30, h:6 },
    { id:'tresor', name:'Tresor', icon:'fa-vault', color:'#a855f7', fov:null, w:18, h:24 },
    { id:'poller', name:'Poller K12', icon:'fa-circle-stop', color:'#ea580c', fov:null, w:10, h:10 },
    { id:'fence', name:'Zaun-Element', icon:'fa-grip-lines-vertical', color:'#94a3b8', fov:null, w:60, h:4 },
    { id:'lock', name:'Smart-Lock', icon:'fa-key', color:'#7c3aed', fov:null, w:14, h:14 },
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || { items: [] }; }
    catch { return { items: [] }; }
  }
  function save(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {}
  }

  function view(d) {
    const root = el('div');
    let data = load();
    let selected = null;
    let rotation = 0;

    // Hero
    const hero = el('div', { class:'fp-hero' });
    hero.innerHTML = `
      <div class="fp-hero-content">
        <div class="fp-hero-tag">FLOOR-PLAN-PLANNER · INTERAKTIV</div>
        <h1>🏗️ Sensoren-Planungs-Tool</h1>
        <p>
          Ziehe Komponenten aus der Palette ins Layout. Live-FoV-Vorschau für Kameras und Melder.
          Bewegen: ziehen · Rotieren: <kbd>R</kbd>-Taste · Löschen: <kbd>Entf</kbd>-Taste · Lokal gespeichert.
        </p>
      </div>
    `;
    root.appendChild(hero);

    // Layout
    const layout = el('div', { class:'fp-layout' });
    root.appendChild(layout);

    // Palette
    const palette = el('div', { class:'fp-palette' });
    palette.innerHTML = `
      <h3>Komponenten-Palette</h3>
      <div class="fp-palette-grid">
        ${COMPONENTS.map(c => `
          <div class="fp-pal-item" draggable="true" data-id="${c.id}" style="--c:${c.color}">
            <div class="fp-pal-icon"><i class="fas ${c.icon}"></i></div>
            <span>${c.name}</span>
            ${c.fov ? `<small>${c.fov.angle}° · ${c.fov.range}px</small>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="fp-actions">
        <button class="fp-btn" id="fp-clear"><i class="fas fa-trash"></i> Alles löschen</button>
        <button class="fp-btn primary" id="fp-print"><i class="fas fa-print"></i> PDF</button>
        <button class="fp-btn" id="fp-save"><i class="fas fa-floppy-disk"></i> Sichern</button>
      </div>
      <div class="fp-stats">
        <div class="fp-stat-row"><span>Komponenten</span><strong id="fp-count">0</strong></div>
        <div class="fp-stat-row"><span>Kameras</span><strong id="fp-cams">0</strong></div>
        <div class="fp-stat-row"><span>Melder</span><strong id="fp-sens">0</strong></div>
        <div class="fp-stat-row"><span>FoV-Abdeckung</span><strong id="fp-cov">— m²</strong></div>
      </div>
    `;
    layout.appendChild(palette);

    // Canvas
    const canvasWrap = el('div', { class:'fp-canvas-wrap' });
    layout.appendChild(canvasWrap);

    const canvas = el('div', { class:'fp-canvas' });
    canvas.id = 'fp-canvas';
    canvasWrap.appendChild(canvas);

    // Grid-Background
    canvas.innerHTML = `
      <svg viewBox="0 0 800 600" class="fp-grid" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34,211,238,.08)" stroke-width="1"/>
          </pattern>
          <pattern id="grid-big" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(34,211,238,.18)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)"/>
        <rect width="800" height="600" fill="url(#grid-big)"/>
      </svg>
    `;

    // Drag from palette
    palette.querySelectorAll('.fp-pal-item').forEach(item => {
      item.ondragstart = (e) => {
        e.dataTransfer.setData('comp-id', item.dataset.id);
      };
    });

    // Drop on canvas
    canvas.ondragover = (e) => e.preventDefault();
    canvas.ondrop = (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('comp-id');
      if (!id) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 800;
      const y = ((e.clientY - rect.top) / rect.height) * 600;
      data.items.push({ id, x, y, r: 0, uid: Date.now() + Math.random() });
      save(data);
      render();
    };

    function render() {
      // Remove all items except grid SVG
      Array.from(canvas.querySelectorAll('.fp-item, .fp-fov-svg')).forEach(e => e.remove());

      // FoV overlay SVG
      const fovSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      fovSvg.setAttribute('class', 'fp-fov-svg');
      fovSvg.setAttribute('viewBox', '0 0 800 600');
      fovSvg.setAttribute('preserveAspectRatio', 'none');
      data.items.forEach(item => {
        const comp = COMPONENTS.find(c => c.id === item.id);
        if (!comp || !comp.fov) return;
        const cx = item.x, cy = item.y, r = comp.fov.range, a = comp.fov.angle;
        const rRad = (a / 2) * Math.PI / 180;
        const baseRot = item.r * Math.PI / 180;
        if (a >= 360) {
          fovSvg.innerHTML += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hexA(comp.color, 0.12)}" stroke="${hexA(comp.color, 0.5)}" stroke-width="1" stroke-dasharray="3 3"/>`;
        } else {
          const x1 = cx + r * Math.cos(baseRot - rRad);
          const y1 = cy + r * Math.sin(baseRot - rRad);
          const x2 = cx + r * Math.cos(baseRot + rRad);
          const y2 = cy + r * Math.sin(baseRot + rRad);
          fovSvg.innerHTML += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${hexA(comp.color, 0.15)}" stroke="${hexA(comp.color, 0.5)}" stroke-width="1" stroke-dasharray="3 3"/>`;
        }
      });
      canvas.appendChild(fovSvg);

      // Items
      data.items.forEach(item => {
        const comp = COMPONENTS.find(c => c.id === item.id);
        if (!comp) return;
        const dom = el('div', { class:'fp-item' + (selected === item.uid ? ' selected' : '') });
        dom.style.cssText = `
          left: ${(item.x/800)*100}%;
          top: ${(item.y/600)*100}%;
          width: ${comp.w}px;
          height: ${comp.h}px;
          background: ${comp.color};
          transform: translate(-50%, -50%) rotate(${item.r}deg);
        `;
        dom.innerHTML = `<i class="fas ${comp.icon}"></i>`;
        dom.dataset.uid = item.uid;
        dom.onmousedown = (e) => {
          e.stopPropagation();
          selected = item.uid;
          rotation = item.r;
          startDrag(e, item);
        };
        canvas.appendChild(dom);
      });

      // Update stats
      const c = canvas.querySelector('#fp-count');
      document.getElementById('fp-count').textContent = data.items.length;
      const cams = data.items.filter(i => i.id.startsWith('cam')).length;
      const sens = data.items.filter(i => ['pir','mw','glass','magnet'].includes(i.id)).length;
      document.getElementById('fp-cams').textContent = cams;
      document.getElementById('fp-sens').textContent = sens;
      // FoV coverage (estimate)
      let cov = 0;
      data.items.forEach(item => {
        const comp = COMPONENTS.find(c => c.id === item.id);
        if (comp && comp.fov) {
          const r = comp.fov.range / 4; // scale to ~m
          const a = comp.fov.angle;
          cov += Math.PI * r * r * (a / 360);
        }
      });
      document.getElementById('fp-cov').textContent = cov.toFixed(0) + ' m²';
    }

    function startDrag(e, item) {
      const rect = canvas.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = item.x;
      const origY = item.y;

      const onMove = (ev) => {
        const dx = ((ev.clientX - startX) / rect.width) * 800;
        const dy = ((ev.clientY - startY) / rect.height) * 600;
        item.x = Math.max(0, Math.min(800, origX + dx));
        item.y = Math.max(0, Math.min(600, origY + dy));
        render();
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        save(data);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }

    function hexA(hex, alpha) {
      const m = hex.replace('#', '');
      const r = parseInt(m.slice(0,2), 16);
      const g = parseInt(m.slice(2,4), 16);
      const b = parseInt(m.slice(4,6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    // Keyboard: R rotate, Del delete
    const keyHandler = (e) => {
      if (!selected) return;
      const item = data.items.find(x => x.uid === selected);
      if (!item) return;
      if (e.key.toLowerCase() === 'r') {
        item.r = (item.r + 15) % 360;
        save(data);
        render();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        data.items = data.items.filter(x => x.uid !== selected);
        selected = null;
        save(data);
        render();
      }
    };
    document.addEventListener('keydown', keyHandler);

    canvas.onclick = (e) => {
      if (e.target === canvas || e.target.tagName === 'svg' || e.target.tagName === 'rect') {
        selected = null;
        render();
      }
    };

    palette.querySelector('#fp-clear').onclick = () => {
      if (confirm('Alle Komponenten vom Plan entfernen?')) {
        data.items = [];
        save(data);
        render();
      }
    };
    palette.querySelector('#fp-print').onclick = () => window.print();
    palette.querySelector('#fp-save').onclick = () => {
      save(data);
      alert('Plan im Browser gespeichert.');
    };

    setTimeout(render, 0);
    return root;
  }

  return { view };
})();
