/* Animation-Export · PNGs + SVG für LinkedIn-Beiträge
   - Pro Komponente: 5 Step-PNGs (1200×720) + Original-SVG + Beschreibungs-TXT als ZIP
   - Bulk-Export aller Animationen als großes ZIP
   - Verwendet JSZip von CDN (lazy load) */

window.ANIM_EXPORT = (() => {

  let JSZipReady = null;

  function loadJSZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (JSZipReady) return JSZipReady;
    JSZipReady = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      s.onload = () => resolve(window.JSZip);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return JSZipReady;
  }

  /* SVG-String → PNG-Blob */
  function svgToPng(svgString, w = 1200, h = 720) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0a0f1a';
        ctx.fillRect(0, 0, w, h);
        const aspect = img.width / img.height;
        let dw, dh, dx, dy;
        if (aspect > w / h) {
          dw = w; dh = w / aspect;
        } else {
          dh = h; dw = h * aspect;
        }
        dx = (w - dw) / 2;
        dy = (h - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
        URL.revokeObjectURL(url);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
      img.src = url;
    });
  }

  /* SVG für einen bestimmten Step bauen (Sichtbarkeiten setzen + Step-Text overlay) */
  function buildStepSVG(def, stepIndex, brand = '') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(def.svg, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) throw new Error('SVG parse error');

    // Step-Visibility setzen
    def.steps.forEach((s, i) => {
      const visible = i <= stepIndex;
      (s.h || []).forEach(id => {
        const el = svg.querySelector('#' + id);
        if (el) {
          el.setAttribute('opacity', visible ? '1' : '0');
          if (visible) el.style.opacity = '1';
        }
      });
    });

    // Text-Overlay unten
    const vb = (svg.getAttribute('viewBox') || '0 0 600 360').split(/\s+/).map(Number);
    const [, , vw, vh] = vb;
    const stepText = (def.steps[stepIndex] && def.steps[stepIndex].text) || '';
    const cleanText = stepText.replace(/<[^>]+>/g, '').slice(0, 180);

    // Overlay-Gruppe anhängen
    const ns = 'http://www.w3.org/2000/svg';
    const overlay = doc.createElementNS(ns, 'g');

    // Step-Indikator oben rechts
    const indRect = doc.createElementNS(ns, 'rect');
    indRect.setAttribute('x', vw - 80);
    indRect.setAttribute('y', 10);
    indRect.setAttribute('width', 70);
    indRect.setAttribute('height', 26);
    indRect.setAttribute('rx', 13);
    indRect.setAttribute('fill', 'rgba(34,211,238,.9)');
    overlay.appendChild(indRect);
    const indText = doc.createElementNS(ns, 'text');
    indText.setAttribute('x', vw - 45);
    indText.setAttribute('y', 28);
    indText.setAttribute('text-anchor', 'middle');
    indText.setAttribute('font-size', '13');
    indText.setAttribute('fill', '#0b1424');
    indText.setAttribute('font-family', 'system-ui, sans-serif');
    indText.setAttribute('font-weight', '900');
    indText.textContent = `${stepIndex + 1}/${def.steps.length}`;
    overlay.appendChild(indText);

    // Titel-Banner oben
    if (def.title) {
      const titleRect = doc.createElementNS(ns, 'rect');
      titleRect.setAttribute('x', 10);
      titleRect.setAttribute('y', 10);
      titleRect.setAttribute('width', vw - 100);
      titleRect.setAttribute('height', 26);
      titleRect.setAttribute('rx', 6);
      titleRect.setAttribute('fill', 'rgba(0,0,0,.6)');
      overlay.appendChild(titleRect);
      const titleText = doc.createElementNS(ns, 'text');
      titleText.setAttribute('x', 18);
      titleText.setAttribute('y', 28);
      titleText.setAttribute('font-size', '13');
      titleText.setAttribute('fill', '#22d3ee');
      titleText.setAttribute('font-family', 'system-ui, sans-serif');
      titleText.setAttribute('font-weight', '800');
      titleText.textContent = def.title.slice(0, 50);
      overlay.appendChild(titleText);
    }

    // Step-Text-Banner unten
    if (cleanText) {
      const textRect = doc.createElementNS(ns, 'rect');
      textRect.setAttribute('x', 10);
      textRect.setAttribute('y', vh - 50);
      textRect.setAttribute('width', vw - 20);
      textRect.setAttribute('height', 40);
      textRect.setAttribute('rx', 6);
      textRect.setAttribute('fill', 'rgba(0,0,0,.78)');
      textRect.setAttribute('stroke', 'rgba(34,211,238,.4)');
      textRect.setAttribute('stroke-width', '1');
      overlay.appendChild(textRect);

      // Text in 2 Zeilen brechen
      const words = cleanText.split(' ');
      const maxChars = Math.floor((vw - 30) / 6.2);
      let line1 = '', line2 = '';
      for (const w of words) {
        if (!line2 && (line1 + ' ' + w).length <= maxChars) line1 += (line1 ? ' ' : '') + w;
        else if ((line2 + ' ' + w).length <= maxChars) line2 += (line2 ? ' ' : '') + w;
      }
      const t1 = doc.createElementNS(ns, 'text');
      t1.setAttribute('x', vw / 2);
      t1.setAttribute('y', vh - 32);
      t1.setAttribute('text-anchor', 'middle');
      t1.setAttribute('font-size', '12');
      t1.setAttribute('fill', 'white');
      t1.setAttribute('font-family', 'system-ui, sans-serif');
      t1.textContent = line1;
      overlay.appendChild(t1);
      if (line2) {
        const t2 = doc.createElementNS(ns, 'text');
        t2.setAttribute('x', vw / 2);
        t2.setAttribute('y', vh - 17);
        t2.setAttribute('text-anchor', 'middle');
        t2.setAttribute('font-size', '12');
        t2.setAttribute('fill', 'white');
        t2.setAttribute('font-family', 'system-ui, sans-serif');
        t2.textContent = line2;
        overlay.appendChild(t2);
      }
    }

    // Brand
    if (brand) {
      const b = doc.createElementNS(ns, 'text');
      b.setAttribute('x', 18);
      b.setAttribute('y', vh - 55);
      b.setAttribute('font-size', '10');
      b.setAttribute('fill', 'rgba(255,255,255,.4)');
      b.setAttribute('font-family', 'system-ui, sans-serif');
      b.textContent = brand;
      overlay.appendChild(b);
    }

    svg.appendChild(overlay);

    // Schwarzer Hintergrund-Rect davor wenn nicht vorhanden
    const existingBg = svg.querySelector('rect[fill="#0a0f1a"]');
    if (!existingBg) {
      const bg = doc.createElementNS(ns, 'rect');
      bg.setAttribute('width', vw);
      bg.setAttribute('height', vh);
      bg.setAttribute('fill', '#0a0f1a');
      svg.insertBefore(bg, svg.firstChild);
    }

    return new XMLSerializer().serializeToString(svg);
  }

  function saveAs(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
  }

  function slugify(s) {
    return s.toString().toLowerCase()
      .replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'})[c])
      .replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  }

  /* === Einzeln · alle Steps + SVG + TXT als ZIP === */
  async function exportSingle(key, name = '') {
    if (!window.EXPL || !EXPL.EXPLAINERS[key]) {
      alert('Keine Animation für diese Komponente gefunden.');
      return;
    }
    const JSZip = await loadJSZip();
    const def = EXPL.EXPLAINERS[key];
    const compName = name || def.title || key;
    const zip = new JSZip();

    for (let i = 0; i < def.steps.length; i++) {
      try {
        const svgStr = buildStepSVG(def, i, 'Sicherheitstechnik · ' + compName);
        const png = await svgToPng(svgStr, 1200, 720);
        zip.file(`step_${String(i + 1).padStart(2, '0')}.png`, png);
        // Auch SVG pro Step (skalierbar)
        zip.file(`step_${String(i + 1).padStart(2, '0')}.svg`, svgStr);
      } catch (e) {
        console.warn('Step export failed:', e);
      }
    }

    // Original-SVG (animiert)
    zip.file('original-animation.svg', def.svg);

    // Beschreibung
    let txt = `${def.title}\n${def.intro || ''}\n${'='.repeat(50)}\n\n`;
    def.steps.forEach((s, i) => {
      txt += `Schritt ${i + 1}:\n${(s.text || '').replace(/<[^>]+>/g, '')}\n\n`;
    });
    txt += `\nErstellt mit Sicherheitstechnik-App\nKomponente: ${compName}\nDatum: ${new Date().toISOString().slice(0, 10)}\n`;
    zip.file('beschreibung.txt', txt);

    // README für LinkedIn
    const linkedinTip = `LinkedIn-Beitrag-Tipps:
======================

1) Beste Schritt-Bilder auswählen (oder alle als Karussell-Post hochladen)
2) Empfohlene Größe für LinkedIn: 1200×627 oder 1080×1080 (Square)
   → unsere Bilder: 1200×720 → in LinkedIn ggf. anpassen
3) Beispiel-Text für deinen Post:

──────────────────────────────────────
🛡️ ${compName} · So funktioniert's

${(def.intro || '').slice(0, 200)}

${def.steps.slice(0, 3).map((s, i) => `${i+1}. ${(s.text || '').replace(/<[^>]+>/g, '').slice(0, 120)}`).join('\n\n')}

#Sicherheitstechnik #${slugify(compName).replace(/-/g, '')} #Werkschutz #SecurityTech
──────────────────────────────────────

4) Karussell-Reihenfolge: step_01.png → step_05.png
`;
    zip.file('LINKEDIN-tipps.txt', linkedinTip);

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${slugify(compName)}-animation.zip`);
  }

  /* === Bulk · alle Animationen exportieren === */
  async function exportAll(progressCallback) {
    if (!window.EXPL) return;
    const JSZip = await loadJSZip();
    const zip = new JSZip();

    // Alle Komponenten mit Explainer sammeln
    const allComps = [];
    if (window.ENCY && ENCY.list) {
      ENCY.list.forEach(m => {
        if (EXPL.hasExplainer(m.key)) allComps.push({ key: m.key, name: m.name, kat: m.kat });
      });
    }
    if (window.MECH_ENCY && MECH_ENCY.LIST) {
      MECH_ENCY.LIST.forEach(m => {
        if (EXPL.hasExplainer(m.key)) allComps.push({ key: m.key, name: m.name, kat: m.kat });
      });
    }
    if (window.KATALOG) {
      ['VIDEO_DB','BRAND_DB','ZKA_DB','EMA_DB'].forEach(db => {
        (KATALOG[db] || []).forEach(m => {
          if (EXPL.hasExplainer(m.key)) allComps.push({ key: m.key, name: m.name, kat: m.kat });
        });
      });
    }

    if (progressCallback) progressCallback({ total: allComps.length, done: 0, current: '' });

    for (let i = 0; i < allComps.length; i++) {
      const comp = allComps[i];
      const def = EXPL.EXPLAINERS[comp.key];
      if (!def) continue;
      const folder = zip.folder(`${slugify(comp.kat || 'misc')}/${slugify(comp.name)}`);

      for (let s = 0; s < def.steps.length; s++) {
        try {
          const svgStr = buildStepSVG(def, s, 'Sicherheitstechnik · ' + comp.name);
          const png = await svgToPng(svgStr, 1200, 720);
          folder.file(`step_${String(s + 1).padStart(2, '0')}.png`, png);
        } catch (e) {
          console.warn(`Export error ${comp.key} step ${s + 1}:`, e);
        }
      }
      folder.file('original.svg', def.svg);

      let txt = `${def.title}\n${def.intro || ''}\n\n`;
      def.steps.forEach((s, idx) => {
        txt += `Step ${idx + 1}: ${(s.text || '').replace(/<[^>]+>/g, '')}\n\n`;
      });
      folder.file('info.txt', txt);

      if (progressCallback) progressCallback({ total: allComps.length, done: i + 1, current: comp.name });
    }

    const blob = await zip.generateAsync({ type: 'blob' }, (meta) => {
      if (progressCallback && meta.percent) {
        progressCallback({ total: allComps.length, done: allComps.length, current: `ZIP packen ${meta.percent.toFixed(0)} %` });
      }
    });
    saveAs(blob, `sicherheitstechnik-alle-animationen-${new Date().toISOString().slice(0, 10)}.zip`);
  }

  /* === UI: Modal für Download-Auswahl === */
  function openDownloadModal(comp) {
    const bg = document.createElement('div');
    bg.className = 'anim-export-bg';
    bg.innerHTML = `
      <div class="anim-export-modal">
        <button class="anim-export-close"><i class="fas fa-xmark"></i></button>
        <h3><i class="fas fa-download"></i> Animation für LinkedIn herunterladen</h3>
        <p class="muted small">${comp ? comp.name : 'Alle Animationen'}</p>
        <div class="anim-export-options">
          ${comp ? `
            <button class="anim-export-opt" data-act="single">
              <i class="fas fa-image"></i>
              <strong>Diese Animation (ZIP)</strong>
              <span>5 Step-Bilder als PNG (1200×720) + SVG + LinkedIn-Tipps</span>
            </button>
          ` : ''}
          <button class="anim-export-opt" data-act="bulk">
            <i class="fas fa-layer-group"></i>
            <strong>ALLE Animationen (großes ZIP)</strong>
            <span>~100+ Komponenten × 5 PNGs in Kategorie-Ordnern · kann mehrere Minuten dauern</span>
          </button>
        </div>
        <div class="anim-export-progress" id="ae-progress" style="display:none">
          <div class="ae-bar"><div class="ae-fill"></div></div>
          <div class="ae-status">Starte…</div>
        </div>
        <p class="muted small">
          <i class="fas fa-circle-info"></i>
          Tipp: Lade die PNGs als LinkedIn-Karussell hoch (1080×1080 oder 1200×627 ideal, ggf. zuschneiden).
        </p>
      </div>
    `;
    document.body.appendChild(bg);

    const close = () => { bg.remove(); };
    bg.querySelector('.anim-export-close').onclick = close;
    bg.onclick = (e) => { if (e.target === bg) close(); };

    bg.querySelectorAll('.anim-export-opt').forEach(btn => {
      btn.onclick = async () => {
        const act = btn.dataset.act;
        bg.querySelectorAll('.anim-export-opt').forEach(b => b.disabled = true);
        const progress = bg.querySelector('#ae-progress');
        const fill = bg.querySelector('.ae-fill');
        const stat = bg.querySelector('.ae-status');
        progress.style.display = '';

        try {
          if (act === 'single' && comp) {
            stat.textContent = 'Erstelle Bilder…';
            fill.style.width = '30%';
            await exportSingle(comp.key, comp.name);
            fill.style.width = '100%';
            stat.textContent = '✓ Download fertig';
            setTimeout(close, 1500);
          } else if (act === 'bulk') {
            await exportAll(({ total, done, current }) => {
              fill.style.width = `${(done / total) * 100}%`;
              stat.textContent = `${done}/${total} · ${current}`;
            });
            fill.style.width = '100%';
            stat.textContent = '✓ Großes ZIP erstellt';
            setTimeout(close, 2500);
          }
        } catch (e) {
          stat.textContent = 'Fehler: ' + e.message;
          bg.querySelectorAll('.anim-export-opt').forEach(b => b.disabled = false);
        }
      };
    });
  }

  return {
    exportSingle, exportAll,
    openDownloadModal,
    buildStepSVG, svgToPng,
  };
})();
