/* Foto-Management für Komponenten
   - User-Upload mit IndexedDB-Persistenz
   - Pro Komponente bis zu 6 Fotos
   - Google-Bildersuche-Link
   - Verwendet in Master-Ency Drawer + Karten-Vorschau */

window.COMP_PHOTOS = (() => {

  const DB_NAME = 'CompPhotosDB';
  const STORE = 'photos';
  let dbInstance = null;
  const memoryCache = {};  // key → array of dataUrls
  let cacheLoaded = false;

  /* === IndexedDB-Wrapper === */
  function openDB() {
    return new Promise((resolve, reject) => {
      if (dbInstance) return resolve(dbInstance);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE, { keyPath: 'key' });
      };
      req.onsuccess = () => { dbInstance = req.result; resolve(dbInstance); };
      req.onerror = () => reject(req.error);
    });
  }

  async function loadAll() {
    if (cacheLoaded) return memoryCache;
    try {
      const db = await openDB();
      return new Promise(resolve => {
        const tx = db.transaction(STORE, 'readonly');
        const store = tx.objectStore(STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          (req.result || []).forEach(r => { memoryCache[r.key] = r.photos || []; });
          cacheLoaded = true;
          resolve(memoryCache);
        };
        req.onerror = () => { cacheLoaded = true; resolve(memoryCache); };
      });
    } catch (e) {
      cacheLoaded = true;
      return memoryCache;
    }
  }

  async function savePhotos(key, photos) {
    memoryCache[key] = photos;
    try {
      const db = await openDB();
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ key, photos });
    } catch (e) {
      console.warn('IDB save failed', e);
    }
  }

  function getPhotos(key) {
    return memoryCache[key] || [];
  }

  async function addPhoto(key, dataUrl) {
    const photos = (memoryCache[key] || []).slice();
    if (photos.length >= 6) photos.shift();
    photos.push(dataUrl);
    await savePhotos(key, photos);
    return photos;
  }

  async function removePhoto(key, idx) {
    const photos = (memoryCache[key] || []).filter((_, i) => i !== idx);
    await savePhotos(key, photos);
    return photos;
  }

  async function clearAll(key) {
    if (key) await savePhotos(key, []);
    else {
      Object.keys(memoryCache).forEach(k => delete memoryCache[k]);
      try {
        const db = await openDB();
        db.transaction(STORE, 'readwrite').objectStore(STORE).clear();
      } catch {}
    }
  }

  function googleImagesURL(name, hersteller) {
    const q = [name, hersteller && hersteller[0], 'Sicherheitstechnik']
      .filter(Boolean).join(' ');
    return `https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=isch`;
  }

  /* === Renderer: Foto-Sektion im Drawer === */
  function renderSection(m, container) {
    const wrap = document.createElement('div');
    wrap.className = 'comp-photo-section';

    function rebuild() {
      const photos = getPhotos(m.key);
      const googleUrl = googleImagesURL(m.name, m.hersteller);
      wrap.innerHTML = `
        <div class="cps-head">
          <h3><i class="fas fa-camera"></i> Echte Fotos${photos.length ? ` (${photos.length})` : ''}</h3>
          <a href="${googleUrl}" target="_blank" rel="noopener" class="cps-google">
            <i class="fab fa-google"></i> Bilder im Web suchen
          </a>
        </div>
        ${photos.length === 0 ? `
          <div class="cps-empty">
            <i class="fas fa-image"></i>
            <p>Noch kein echtes Foto vorhanden. Lade ein Hersteller-Foto oder eigenes Bild hoch — es bleibt nur lokal auf deinem Gerät gespeichert.</p>
          </div>
        ` : `
          <div class="cps-gallery">
            ${photos.map((src, i) => `
              <div class="cps-thumb">
                <img src="${src}" alt="${m.name} Foto ${i+1}" data-idx="${i}">
                <button class="cps-rm" data-rm="${i}" title="Entfernen"><i class="fas fa-xmark"></i></button>
              </div>
            `).join('')}
          </div>
        `}
        <div class="cps-actions">
          <label class="cps-upload">
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden>
            <i class="fas fa-upload"></i> Foto(s) hochladen
          </label>
          <span class="cps-hint">JPG/PNG/WebP · max. 6 Fotos · max. 800 KB pro Foto</span>
        </div>
      `;
      const input = wrap.querySelector('input[type=file]');
      input.onchange = async (e) => {
        for (const file of Array.from(e.target.files || [])) {
          if (!file.type.startsWith('image/')) continue;
          if (file.size > 800 * 1024) {
            // Komprimieren
            const compressed = await compressImage(file, 800, 800, 0.85);
            await addPhoto(m.key, compressed);
          } else {
            const dataUrl = await fileToDataUrl(file);
            await addPhoto(m.key, dataUrl);
          }
        }
        rebuild();
        input.value = '';
      };
      wrap.querySelectorAll('[data-rm]').forEach(btn => {
        btn.onclick = async () => {
          await removePhoto(m.key, parseInt(btn.dataset.rm));
          rebuild();
        };
      });
      wrap.querySelectorAll('.cps-thumb img').forEach(img => {
        img.onclick = () => openLightbox(img.src, m.name);
      });
    }
    rebuild();
    container.appendChild(wrap);
  }

  /* === Lightbox === */
  function openLightbox(src, title) {
    const lb = document.createElement('div');
    lb.className = 'cps-lightbox';
    lb.innerHTML = `
      <button class="cps-lb-close"><i class="fas fa-xmark"></i></button>
      <img src="${src}" alt="${title}">
      <div class="cps-lb-title">${title}</div>
    `;
    document.body.appendChild(lb);
    requestAnimationFrame(() => lb.classList.add('open'));
    const close = () => { lb.classList.remove('open'); setTimeout(() => lb.remove(), 200); };
    lb.querySelector('.cps-lb-close').onclick = close;
    lb.onclick = (e) => { if (e.target === lb) close(); };
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  /* === Helpers === */
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  async function compressImage(file, maxW, maxH, quality) {
    const dataUrl = await fileToDataUrl(file);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  }

  // Bei Module-Load: alle aus DB cachen
  loadAll();

  return {
    getPhotos, addPhoto, removePhoto, clearAll,
    googleImagesURL, renderSection,
  };
})();
