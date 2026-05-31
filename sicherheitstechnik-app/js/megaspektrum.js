/* Mega-Spektrum: horizontaler logarithmischer Zeitstrahl von 1 Hz bis 1 ZHz
   mit Pan/Zoom (Maus, Touch, Buttons), 60+ Sicherheitstechnik-Markern,
   farbcodierten Bändern und Detail-Drawer pro Marker.
   window.MEGASPEKTRUM.view(). */
window.MEGASPEKTRUM = (() => {
  const { el } = U;

  /* ---------- Bänder (in Hz) ---------- */
  const BANDS = [
    { f0: 1,     f1: 20,    name: 'Infraschall',  col: '#475569' },
    { f0: 20,    f1: 20e3,  name: 'Hörschall',    col: '#22c55e' },
    { f0: 20e3,  f1: 300e3, name: 'Ultraschall',  col: '#84cc16' },
    { f0: 300e3, f1: 3e6,   name: 'Langwelle (LF/MF)', col: '#a3e635' },
    { f0: 3e6,   f1: 30e6,  name: 'Kurzwelle (HF)',col: '#facc15' },
    { f0: 30e6,  f1: 300e6, name: 'UKW (VHF)',    col: '#f59e0b' },
    { f0: 300e6, f1: 3e9,   name: 'UHF · Funk',   col: '#f97316' },
    { f0: 3e9,   f1: 30e9,  name: 'SHF · Mikrowelle', col: '#ef4444' },
    { f0: 30e9,  f1: 300e9, name: 'EHF · Millimeterwelle', col: '#dc2626' },
    { f0: 300e9, f1: 4e14,  name: 'Infrarot',     col: '#a855f7' },
    { f0: 4e14,  f1: 8e14,  name: 'Sichtbares Licht', col: '#22d3ee' },
    { f0: 8e14,  f1: 3e16,  name: 'UV',           col: '#7c3aed' },
    { f0: 3e16,  f1: 3e19,  name: 'Röntgen',      col: '#6366f1' },
    { f0: 3e19,  f1: 1e21,  name: 'Gamma',        col: '#1e293b' },
  ];

  /* ---------- Marker (Sicherheitstechnik-Fokus) ---------- */
  // kind: 'sec' (Sicherheitstechnik), 'gen' (allgemein), 'ref' (Referenz wie Steckdose/Musik)
  const MARKERS = [
    // Infra-/Hörschall
    { f: 0.1,      name: 'Erdbeben',                    kind: 'gen', icon: 'fa-house-crack', desc: 'Erdbeben-Wellen, sehr tief. Werden im Sicherheitsbereich z.B. von Tresor-Seismometern erkannt (Aufbruchschutz).', cat: 'Andere' },
    { f: 50,       name: 'Stromnetz (50 Hz)',           kind: 'ref', icon: 'fa-plug', desc: 'Brummen aus dem Stromnetz. Wichtig als Störfrequenz für Mikrofone (Brumm-Schleifen) und EMV.', cat: 'Andere' },
    { f: 440,      name: 'Kammerton A',                 kind: 'ref', icon: 'fa-music', desc: 'Mitten im hörbaren Bereich – Referenz für Musik.', cat: 'Andere' },
    { f: 1000,     name: 'Sirenen-Pfeifton',            kind: 'sec', icon: 'fa-bell', desc: 'Innensirenen einer EMA arbeiten typisch bei 1–4 kHz – maximal lästig für den Täter.', cat: 'Alarmierung' },
    { f: 3000,     name: 'Telefon-Stimme',              kind: 'ref', icon: 'fa-phone', desc: 'Verständliche Sprache braucht 300 Hz – 3,4 kHz.', cat: 'Andere' },
    // Ultraschall
    { f: 25e3,     name: 'Glasbruchmelder Ultraschall', kind: 'sec', icon: 'fa-window-maximize', desc: 'Aktive Glasbruchmelder senden Ultraschall (~25 kHz) und horchen, wie er reflektiert wird. Beim Bruch ändert sich das Echo.', cat: 'Melder' },
    { f: 40e3,     name: 'Ultraschall-Bewegungsmelder', kind: 'sec', icon: 'fa-wave-square', desc: 'Aktive Bewegungsmelder senden Ultraschall (~40 kHz) und werten Doppler-Verschiebungen aus. Heute eher selten – wird durch PIR/MW ersetzt.', cat: 'Melder' },
    // LF/MF
    { f: 125e3,    name: 'RFID 125 kHz',                kind: 'sec', icon: 'fa-id-card', desc: 'LF-RFID für Zutrittskontrolle (alte Mitarbeiter-Karten, Tiermarken). Reichweite nur wenige cm.', cat: 'Zutritt' },
    { f: 13.56e6,  name: 'NFC / RFID 13,56 MHz',        kind: 'sec', icon: 'fa-id-card', desc: 'NFC für Zutrittskarten (MIFARE), Smartphone-Bezahlen, Türschlösser. Reichweite ~10 cm.', cat: 'Zutritt' },
    { f: 27e6,     name: 'CB-Funk',                     kind: 'gen', icon: 'fa-truck', desc: 'Citizen Band Funk – Hobby/LKW.', cat: 'Andere' },
    // HF/VHF
    { f: 77.5e3,   name: 'DCF77 Funkuhr',               kind: 'gen', icon: 'fa-clock', desc: 'Atomuhr-Zeitsignal aus Mainflingen. Synchronisiert auch viele Sicherheitssysteme.', cat: 'Andere' },
    { f: 100e6,    name: 'UKW-Radio',                   kind: 'ref', icon: 'fa-radio', desc: 'Klassisches FM-Radio.', cat: 'Andere' },
    { f: 161e6,    name: 'BOS-Analog (alt)',            kind: 'sec', icon: 'fa-truck-medical', desc: 'Früherer Polizei-/Feuerwehrfunk im 4m-Band – heute durch TETRA ersetzt.', cat: 'Funk' },
    { f: 174e6,    name: 'DAB+ Digital-Radio',          kind: 'ref', icon: 'fa-tower-broadcast', desc: 'Digitales Radio.', cat: 'Andere' },
    // UHF
    { f: 380e6,    name: 'TETRA · BOS-Digitalfunk',     kind: 'sec', icon: 'fa-shield-halved', desc: 'Polizei, Feuerwehr, Rettung – verschlüsselter Digitalfunk. Auch Sicherheitsdienst-Leitstellen.', cat: 'Funk' },
    { f: 433.92e6, name: 'ISM 433 MHz – Funk-Melder',   kind: 'sec', icon: 'fa-bell', desc: 'EMA-Funkmelder, Handsender, Garagentor, Wetterstation. Beliebt aber stör-anfällig. Hauptband: 433,05–434,79 MHz.', cat: 'Melder', hot: true },
    { f: 700e6,    name: 'Mobilfunk LTE Band 28',       kind: 'sec', icon: 'fa-mobile-screen', desc: '4G LTE – auch Alarmübertragung über GSM/LTE-Module.', cat: 'Übertragung' },
    { f: 800e6,    name: 'DVB-T2 Antennen-TV',          kind: 'ref', icon: 'fa-tv', desc: 'Digitales Antennen-Fernsehen.', cat: 'Andere' },
    { f: 868e6,    name: 'ISM 868 MHz – EMA-Funk',      kind: 'sec', icon: 'fa-bell', desc: 'Premium-Funkmelder (besser als 433 MHz), KNX-RF, LoRaWAN, Smart-Home-Sicherheit. Robuste 2-Wege-Kommunikation, AES-Verschlüsselung.', cat: 'Melder', hot: true },
    { f: 900e6,    name: 'GSM 900 · Handy 2G',          kind: 'sec', icon: 'fa-mobile-screen', desc: 'Alarmübertragung per SIM-Karte. Backup-Weg falls IP ausfällt.', cat: 'Übertragung' },
    { f: 1.575e9,  name: 'GPS L1',                      kind: 'sec', icon: 'fa-location-crosshairs', desc: 'GPS für Geo-Tracking von Werttransporten, Streifen-Fahrzeugen.', cat: 'Andere' },
    { f: 1.8e9,    name: 'GSM 1800 / DECT',             kind: 'sec', icon: 'fa-phone-volume', desc: 'GSM 1800: Handy 2G. DECT (1880–1900 MHz): schnurloses Telefon, auch DECT-Funkmelder.', cat: 'Funk' },
    { f: 2.4e9,    name: 'WLAN / Bluetooth / ZigBee',   kind: 'sec', icon: 'fa-wifi', desc: 'WLAN 2,4 GHz · Bluetooth · ZigBee (Smart-Home-Sensoren) · Mikrowellen-Ofen (Störquelle!). Auch viele IP-Kameras.', cat: 'Übertragung', hot: true },
    { f: 5.2e9,    name: 'WLAN 5 GHz · Wi-Fi 5/6',      kind: 'sec', icon: 'fa-wifi', desc: 'Schnelleres, weniger gestörtes WLAN für 4K-IP-Kameras und Highspeed-Daten.', cat: 'Übertragung' },
    // Mikrowelle (SHF)
    { f: 5.8e9,    name: 'ISM 5,8 GHz · Drohnen-Steuerung', kind: 'sec', icon: 'fa-helicopter', desc: 'Drohnen-Video-Link, WLAN-Brücken, einige Mikrowellen-Lichtschranken.', cat: 'Übertragung' },
    { f: 10.525e9, name: 'MW-Bewegungsmelder 10 GHz',   kind: 'sec', icon: 'fa-satellite-dish', desc: 'Klassischer Mikrowellen-Bewegungsmelder (Innen + Außen). Sendet kurze Pulse, misst Doppler-Frequenzverschiebung – sieht durch Glas und Trockenbau.', cat: 'Melder', hot: true },
    { f: 24.125e9, name: 'MW-Melder 24 GHz · K-Band-Radar', kind: 'sec', icon: 'fa-gauge-high', desc: 'Premium Mikrowellen-Bewegungsmelder · Verkehrs-Radar der Polizei · Perimeterradar.', cat: 'Melder', hot: true },
    { f: 28e9,     name: '5G mmWave',                   kind: 'gen', icon: 'fa-tower-cell', desc: '5G Millimeterwelle – sehr hohe Datenraten, kurze Reichweite.', cat: 'Übertragung' },
    { f: 77e9,     name: 'Auto-Radar 77 GHz',           kind: 'gen', icon: 'fa-car', desc: 'Adaptiver Tempomat, Notbrems-Assistent.', cat: 'Andere' },
    { f: 122e9,    name: 'Perimeter-Radar 122 GHz',     kind: 'sec', icon: 'fa-radar', desc: 'Hochauflösendes Außenhaut-/Perimeterradar (Industrie, Flughafen).', cat: 'Melder' },
    // Terahertz / IR
    { f: 300e9,    name: 'Body-Scanner Terahertz',      kind: 'sec', icon: 'fa-person', desc: 'Sicherheits-Body-Scanner am Flughafen (300 GHz – 3 THz). Erkennt Gegenstände unter Kleidung ohne ionisierende Strahlung.', cat: 'Scanner' },
    { f: 3e12,     name: 'Wärmebildkamera (LWIR)',      kind: 'sec', icon: 'fa-temperature-high', desc: 'Langwelliges Infrarot 8–14 µm (~30 THz). Sieht Wärme = Menschen in Dunkelheit, Nebel, Rauch. Perimeter, Brandschutz, Polizei.', cat: 'Kamera', hot: true },
    { f: 30e12,    name: 'PIR-Bewegungsmelder (10 µm)', kind: 'sec', icon: 'fa-person-walking', desc: 'Mensch strahlt bei ~10 µm Wellenlänge (~30 THz) – das nutzt der PIR (Passiv-Infrarot)-Melder. Häufigster Innenmelder weltweit.', cat: 'Melder', hot: true },
    { f: 90e12,    name: 'IR-Lichtschranke · Fernbedienung', kind: 'sec', icon: 'fa-arrow-up-from-bracket', desc: 'Nahes Infrarot 850–950 nm. IR-Lichtschranken (aktiver Melder), Fernbedienungen, Nachtsicht-Kameras (IR-LEDs).', cat: 'Melder', hot: true },
    // Sichtbares Licht
    { f: 384e12,   name: 'Rotes Licht (780 nm)',        kind: 'gen', icon: 'fa-circle', desc: 'Untere Grenze des sichtbaren Lichts.', cat: 'Andere' },
    { f: 484e12,   name: 'Gelbes Licht (620 nm)',       kind: 'gen', icon: 'fa-circle', desc: 'Natrium-Dampf-Lampen, Bernstein-Warnleuchten.', cat: 'Andere' },
    { f: 540e12,   name: 'Grünes Licht (555 nm)',       kind: 'gen', icon: 'fa-circle', desc: 'Empfindlichstes für das menschliche Auge – darum „Tag-Sehen-Maximum".', cat: 'Andere' },
    { f: 600e12,   name: 'Blaues Licht (500 nm)',       kind: 'gen', icon: 'fa-circle', desc: 'Blaue LEDs, Datenträger-Lese-Laser.', cat: 'Andere' },
    { f: 750e12,   name: 'Violettes Licht (400 nm)',    kind: 'gen', icon: 'fa-circle', desc: 'Obere Grenze des sichtbaren Lichts.', cat: 'Andere' },
    { f: 600e12,   name: 'Tag-Kamera CMOS-Sensor',      kind: 'sec', icon: 'fa-video', desc: 'Normale Überwachungskameras sehen im sichtbaren Spektrum. Spezielle Day/Night-Cams schalten nachts auf NIR-LED um.', cat: 'Kamera' },
    // UV
    { f: 1e15,     name: 'UV-A · Schwarzlicht',         kind: 'sec', icon: 'fa-sun', desc: 'Geldscheine prüfen, Sicherheits-Markierungen, Forensik (Spuren).', cat: 'Scanner' },
    { f: 1.18e15,  name: 'UV-C · Desinfektion (254 nm)',kind: 'gen', icon: 'fa-virus-slash', desc: 'Wasser-Sterilisation, OP-Saal-Desinfektion.', cat: 'Andere' },
    { f: 1.5e15,   name: 'UV-Flammenmelder (200 nm)',   kind: 'sec', icon: 'fa-fire', desc: 'Solarblinder UV-Flammenmelder. Erkennt Flammen sehr schnell (<1 s), filtert Sonnenlicht raus.', cat: 'Melder', hot: true },
    // Röntgen / Gamma
    { f: 1e17,     name: 'Zahn-Röntgen (10 keV)',       kind: 'gen', icon: 'fa-tooth', desc: 'Medizinisches Röntgen mit relativ niedriger Energie.', cat: 'Andere' },
    { f: 1e18,     name: 'Gepäck-Scanner Flughafen',    kind: 'sec', icon: 'fa-suitcase', desc: 'Dual-Energy-Röntgen: durchleuchtet Koffer, zeigt Metalle/Kunststoffe in unterschiedlichen Farben (organisch=orange, Metall=blau).', cat: 'Scanner', hot: true },
    { f: 5e18,     name: 'Container-Scanner',           kind: 'sec', icon: 'fa-truck', desc: 'Hochenergie-Röntgen für ganze LKW/Container am Zoll – mehrere MeV.', cat: 'Scanner' },
    { f: 1e20,     name: 'Gamma · Radioaktive Strahlung',kind: 'sec', icon: 'fa-radiation', desc: 'Detektion in Tresor-Räumen, Atomkraftwerken, Grenz-Kontrolle. Geiger-Zähler.', cat: 'Scanner' },
  ];

  const C = 299792458;
  function fmtHz(f) {
    if (f >= 1e21) return (f / 1e21).toFixed(0) + ' ZHz';
    if (f >= 1e18) return (f / 1e18).toFixed(f >= 1e19 ? 0 : 1) + ' EHz';
    if (f >= 1e15) return (f / 1e15).toFixed(f >= 1e16 ? 0 : 1) + ' PHz';
    if (f >= 1e12) return (f / 1e12).toFixed(f >= 1e13 ? 0 : 1) + ' THz';
    if (f >= 1e9)  return (f / 1e9).toFixed(f >= 1e10 ? 0 : 1) + ' GHz';
    if (f >= 1e6)  return (f / 1e6).toFixed(f >= 1e7 ? 0 : 1) + ' MHz';
    if (f >= 1e3)  return (f / 1e3).toFixed(f >= 1e4 ? 0 : 1) + ' kHz';
    if (f >= 1)    return f.toFixed(f >= 10 ? 0 : 1) + ' Hz';
    return f.toExponential(1) + ' Hz';
  }
  function fmtLambda(m) {
    if (m >= 1000)   return (m / 1000).toFixed(m >= 1e4 ? 0 : 1) + ' km';
    if (m >= 1)      return m.toFixed(m >= 10 ? 0 : 2) + ' m';
    if (m >= 1e-3)   return (m * 1e3).toFixed(m >= 1e-2 ? 0 : 1) + ' mm';
    if (m >= 1e-6)   return (m * 1e6).toFixed(m >= 1e-5 ? 0 : 1) + ' µm';
    if (m >= 1e-9)   return (m * 1e9).toFixed(m >= 1e-8 ? 0 : 1) + ' nm';
    if (m >= 1e-12)  return (m * 1e12).toFixed(0) + ' pm';
    return m.toExponential(1) + ' m';
  }

  const CAT_COLOR = { Melder: '#22d3ee', Funk: '#fbbf24', 'Übertragung': '#a855f7', Zutritt: '#22c55e', Kamera: '#ef4444', Scanner: '#f97316', Andere: '#64748b' };

  function view() {
    const root = el('div', { class: 'ms-wrap' });
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Verstehen · Spektrum' }),
      el('h1', { text: '📡 Spektrum-Karte · 1 Hz bis Gamma' }),
      el('p', { text: 'Zoom & wisch wie auf einer Landkarte. Tipp einen Marker für die Erklärung. Sicherheitstechnik-Marker (PIR, MW, WLAN, IR-Lichtschranke …) leuchten farbig.' }),
    ]));

    // --- Kategorie-Filter ---
    const cats = ['Alle', 'Melder', 'Funk', 'Übertragung', 'Zutritt', 'Kamera', 'Scanner', 'Andere'];
    let activeCat = 'Alle';
    const filt = el('div', { class: 'ms-filter' });
    cats.forEach(c => {
      const b = el('button', { class: 'ms-chip' + (c === activeCat ? ' on' : ''), type: 'button' });
      const col = c === 'Alle' ? '#22d3ee' : CAT_COLOR[c];
      b.innerHTML = `<span class="ms-chip-dot" style="background:${col}"></span>${c}`;
      b.addEventListener('click', () => {
        activeCat = c;
        filt.querySelectorAll('.ms-chip').forEach((x, i) => x.classList.toggle('on', cats[i] === c));
        draw();
      });
      filt.appendChild(b);
    });
    root.appendChild(filt);

    // --- Zoom-Steuerung ---
    const ctrl = el('div', { class: 'ms-ctrl' });
    const btnIn = el('button', { class: 'ms-btn', html: '<i class="fas fa-plus"></i> Zoom in' });
    const btnOut = el('button', { class: 'ms-btn', html: '<i class="fas fa-minus"></i> Zoom out' });
    const btnReset = el('button', { class: 'ms-btn', html: '<i class="fas fa-expand"></i> Alles zeigen' });
    const presets = el('div', { class: 'ms-presets' });
    [
      { l: 'Ultraschall',   f0: 15e3,  f1: 100e3 },
      { l: 'Funk-Melder',   f0: 300e6, f1: 1e9 },
      { l: 'WLAN/MW',       f0: 1e9,   f1: 30e9 },
      { l: 'PIR-Bereich',   f0: 10e12, f1: 100e12 },
      { l: 'Licht',         f0: 350e12, f1: 800e12 },
      { l: 'Röntgen',       f0: 3e16,  f1: 3e19 },
    ].forEach(p => {
      const b = el('button', { class: 'ms-chip ms-chip-preset', text: p.l });
      b.addEventListener('click', () => { setRange(p.f0, p.f1); });
      presets.appendChild(b);
    });
    ctrl.appendChild(btnIn); ctrl.appendChild(btnOut); ctrl.appendChild(btnReset);
    ctrl.appendChild(el('span', { class: 'ms-ctrl-sep' }));
    ctrl.appendChild(el('span', { class: 'ms-ctrl-l', text: 'Sprung zu:' }));
    ctrl.appendChild(presets);
    root.appendChild(ctrl);

    // --- Canvas ---
    const stage = el('div', { class: 'ms-stage' });
    const canvas = el('canvas', { class: 'ms-canvas' });
    stage.appendChild(canvas);
    root.appendChild(stage);

    // --- Detail-Drawer (inline unter dem Spektrum) ---
    const detail = el('div', { class: 'ms-detail' });
    detail.innerHTML = `<div class="ms-detail-empty"><i class="fas fa-hand-pointer"></i> Tippe einen Marker oben für Details.</div>`;
    root.appendChild(detail);

    // --- Legende ---
    const legend = el('div', { class: 'ms-legend' });
    legend.appendChild(el('h3', { html: '<i class="fas fa-info-circle"></i> Bänder · Übersicht' }));
    const lgrid = el('div', { class: 'ms-legend-grid' });
    BANDS.forEach(b => {
      const c = el('div', { class: 'ms-legend-item' });
      c.innerHTML = `<span class="ms-legend-bar" style="background:${b.col}"></span>
        <strong>${b.name}</strong><span class="ms-legend-r">${fmtHz(b.f0)} – ${fmtHz(b.f1)}</span>`;
      lgrid.appendChild(c);
    });
    legend.appendChild(lgrid);
    root.appendChild(legend);

    // ============ Render-Logik ============
    const F_MIN = 1, F_MAX = 1e21;
    let lo = F_MIN, hi = F_MAX;    // sichtbarer Bereich (Hz)
    let selectedIdx = -1;
    let dragX = null, dragStart = null;

    function setRange(a, b) {
      lo = Math.max(F_MIN, a); hi = Math.min(F_MAX, b);
      if (hi <= lo) hi = lo * 10;
      draw();
    }
    function logRange(f) { return (Math.log10(f) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)); }
    function rangeLog(k)  { return Math.pow(10, Math.log10(lo) + k * (Math.log10(hi) - Math.log10(lo))); }
    function visible(f)   { return f >= lo && f <= hi; }

    function resize() {
      const W = stage.clientWidth, H = 320;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function visibleMarkers() {
      return MARKERS.filter(m => visible(m.f) && (activeCat === 'Alle' || m.cat === activeCat));
    }

    function draw() {
      resize();
      const W = canvas.clientWidth, H = canvas.clientHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, W, H);
      // Hintergrund-Verlauf
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0b1424'); bg.addColorStop(1, '#070b15');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const padL = 12, padR = 12, padT = 16, padB = 78;
      const innerW = W - padL - padR, innerH = H - padT - padB;
      const cy = padT + innerH / 2;

      // Bänder als bunte Streifen
      BANDS.forEach(b => {
        const f0 = Math.max(lo, b.f0), f1 = Math.min(hi, b.f1);
        if (f1 <= f0) return;
        const x0 = padL + logRange(f0) * innerW;
        const x1 = padL + logRange(f1) * innerW;
        const grd = ctx.createLinearGradient(0, padT, 0, padT + innerH);
        grd.addColorStop(0, b.col + '55'); grd.addColorStop(0.5, b.col + '22'); grd.addColorStop(1, b.col + '11');
        ctx.fillStyle = grd; ctx.fillRect(x0, padT, x1 - x0, innerH);
        // Band-Label oben
        const lw = x1 - x0;
        if (lw > 60) {
          ctx.fillStyle = b.col; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(b.name, (x0 + x1) / 2, padT + 4);
        }
      });

      // Mittellinie (Achse)
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5; ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.moveTo(padL, cy); ctx.lineTo(padL + innerW, cy); ctx.stroke();
      ctx.shadowBlur = 0;

      // Dekaden-Ticks
      const startE = Math.ceil(Math.log10(lo)), endE = Math.floor(Math.log10(hi));
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
      for (let e = startE; e <= endE; e++) {
        const f = Math.pow(10, e);
        const x = padL + logRange(f) * innerW;
        ctx.beginPath(); ctx.moveTo(x, cy - 6); ctx.lineTo(x, cy + 6); ctx.stroke();
        ctx.fillText(fmtHz(f), x, cy + 18);
      }

      // Marker zeichnen
      const list = visibleMarkers();
      // Höhen-Staffelung gegen Überlappung
      const occupied = [];
      list.forEach((m, idx) => {
        const x = padL + logRange(m.f) * innerW;
        // Lane-Berechnung: prüfe horizontale Überlappung gegen bisherige Marker
        let lane = 0;
        for (let li = 0; li < 6; li++) {
          const o = occupied[li] || (occupied[li] = []);
          if (o.every(ox => Math.abs(ox - x) > 90)) { o.push(x); lane = li; break; }
          if (li === 5) lane = 5;
        }
        const yOff = (lane % 2 === 0 ? -1 : 1) * (18 + Math.floor(lane / 2) * 36);
        const my = cy + yOff;
        const col = CAT_COLOR[m.cat] || '#22d3ee';
        const isSel = MARKERS.indexOf(m) === selectedIdx;
        const r = m.hot ? 9 : 7;

        // Verbindungslinie zur Achse
        ctx.strokeStyle = col + 'aa'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, my); ctx.stroke();
        // Glow bei hot/selected
        if (m.hot || isSel) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 14; }
        // Punkt
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, my, r, 0, 7); ctx.fill();
        ctx.strokeStyle = '#0b1424'; ctx.lineWidth = 2; ctx.stroke();
        if (m.hot || isSel) ctx.restore();
        // Auswahl-Ring
        if (isSel) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(x, my, r + 5, 0, 7); ctx.stroke();
        }

        // Label
        ctx.fillStyle = isSel ? '#fff' : '#e8edf7'; ctx.font = (isSel ? 'bold ' : '') + '11px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = yOff < 0 ? 'bottom' : 'top';
        ctx.fillText(m.name, x, my + (yOff < 0 ? -r - 5 : r + 5));
        // Frequenz unten
        ctx.fillStyle = col; ctx.font = '10px monospace';
        ctx.fillText(fmtHz(m.f), x, my + (yOff < 0 ? -r - 18 : r + 17));

        // Speichere für Klick-Erkennung
        m._x = x; m._y = my; m._r = r + 5;
      });

      // Mini-Übersicht ganz unten
      drawMinimap(ctx, padL, H - padB + 16, innerW, 14);
    }
    function drawMinimap(ctx, x, y, w, h) {
      ctx.save();
      // Gesamt-Bereich
      BANDS.forEach(b => {
        const f0 = Math.max(F_MIN, b.f0), f1 = Math.min(F_MAX, b.f1);
        const x0 = x + (Math.log10(f0) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN)) * w;
        const x1 = x + (Math.log10(f1) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN)) * w;
        ctx.fillStyle = b.col + '88'; ctx.fillRect(x0, y, x1 - x0, h);
      });
      // Sichtbarer Ausschnitt
      const vx0 = x + (Math.log10(lo) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN)) * w;
      const vx1 = x + (Math.log10(hi) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN)) * w;
      ctx.fillStyle = 'rgba(34,211,238,.18)'; ctx.fillRect(vx0, y - 2, vx1 - vx0, h + 4);
      ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.strokeRect(vx0, y - 2, vx1 - vx0, h + 4);
      // Label
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(fmtHz(F_MIN), x, y + h + 2);
      ctx.textAlign = 'right'; ctx.fillText(fmtHz(F_MAX), x + w, y + h + 2);
      ctx.restore();
    }

    function showDetail(m) {
      const col = CAT_COLOR[m.cat] || '#22d3ee';
      detail.innerHTML = '';
      const card = el('div', { class: 'ms-card', style: `--lv:${col}` });
      const head = el('div', { class: 'ms-card-head' });
      head.appendChild(el('div', { class: 'ms-card-ico', html: `<i class="fas ${m.icon}"></i>` }));
      const text = el('div', {});
      text.appendChild(el('span', { class: 'ms-card-cat', text: m.cat }));
      text.appendChild(el('h3', { text: m.name }));
      head.appendChild(text);
      card.appendChild(head);
      const stats = el('div', { class: 'ms-card-stats' });
      stats.appendChild(el('div', { class: 'ms-card-stat' }, [el('span', { text: 'Frequenz' }), el('strong', { text: fmtHz(m.f) })]));
      if (m.f < 1e18) stats.appendChild(el('div', { class: 'ms-card-stat' }, [el('span', { text: 'Wellenlänge λ' }), el('strong', { text: fmtLambda(C / m.f) })]));
      const band = BANDS.find(b => m.f >= b.f0 && m.f < b.f1);
      if (band) stats.appendChild(el('div', { class: 'ms-card-stat' }, [el('span', { text: 'Bereich' }), el('strong', { text: band.name })]));
      card.appendChild(stats);
      card.appendChild(el('p', { class: 'ms-card-desc', text: m.desc }));
      // Aktions-Reihe
      const act = el('div', { class: 'ms-card-actions' });
      const zoom = el('button', { class: 'ms-btn', html: '<i class="fas fa-magnifying-glass-plus"></i> Auf diesen Bereich zoomen' });
      zoom.addEventListener('click', () => setRange(m.f / 6, m.f * 6));
      act.appendChild(zoom);
      if (window.NOTEBOOK) {
        const pin = NOTEBOOK.pinBtn({
          id: 'spectrum-' + m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          kind: 'class', kicker: 'Spektrum · ' + m.cat, badge: fmtHz(m.f),
          title: m.name, summary: m.desc, tags: [m.cat], accent: col,
        }, { size: 'sm' });
        act.appendChild(pin);
      }
      card.appendChild(act);
      detail.appendChild(card);
    }

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      // Treffer ermitteln (rückwärts: oberster Marker zuerst)
      const list = visibleMarkers().slice().reverse();
      for (const m of list) {
        if (m._x == null) continue;
        if (Math.hypot(x - m._x, y - m._y) <= m._r + 4) {
          selectedIdx = MARKERS.indexOf(m);
          showDetail(m); draw(); return;
        }
      }
    });

    // Drag-Pan auf Achse
    canvas.addEventListener('mousedown', e => {
      const rect = canvas.getBoundingClientRect();
      dragX = e.clientX - rect.left; dragStart = { lo, hi };
    });
    window.addEventListener('mouseup', () => { dragX = null; dragStart = null; });
    canvas.addEventListener('mousemove', e => {
      if (dragX == null) return;
      const rect = canvas.getBoundingClientRect();
      const dx = (e.clientX - rect.left) - dragX;
      const W = canvas.clientWidth - 24;
      const logSpan = Math.log10(dragStart.hi) - Math.log10(dragStart.lo);
      const shift = (dx / W) * logSpan;
      lo = Math.max(F_MIN, Math.pow(10, Math.log10(dragStart.lo) - shift));
      hi = Math.min(F_MAX, Math.pow(10, Math.log10(dragStart.hi) - shift));
      draw();
    });

    // Maus-Wheel-Zoom
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - 12) / (canvas.clientWidth - 24);
      const focus = rangeLog(Math.max(0, Math.min(1, x)));
      const z = e.deltaY > 0 ? 1.25 : 0.8;
      const newLo = Math.max(F_MIN, Math.pow(10, Math.log10(focus) - (Math.log10(focus) - Math.log10(lo)) * z));
      const newHi = Math.min(F_MAX, Math.pow(10, Math.log10(focus) + (Math.log10(hi) - Math.log10(focus)) * z));
      lo = newLo; hi = newHi; draw();
    }, { passive: false });

    // Touch-Pan + Pinch
    let touch = null;
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        const r = canvas.getBoundingClientRect();
        touch = { type: 'pan', x: e.touches[0].clientX - r.left, lo, hi };
      } else if (e.touches.length === 2) {
        const r = canvas.getBoundingClientRect();
        const x1 = e.touches[0].clientX - r.left, x2 = e.touches[1].clientX - r.left;
        touch = { type: 'pinch', cx: (x1 + x2) / 2, dist: Math.abs(x1 - x2), lo, hi };
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', e => {
      if (!touch) return;
      const r = canvas.getBoundingClientRect();
      if (touch.type === 'pan' && e.touches.length === 1) {
        const dx = (e.touches[0].clientX - r.left) - touch.x;
        const W = canvas.clientWidth - 24;
        const logSpan = Math.log10(touch.hi) - Math.log10(touch.lo);
        const shift = (dx / W) * logSpan;
        lo = Math.max(F_MIN, Math.pow(10, Math.log10(touch.lo) - shift));
        hi = Math.min(F_MAX, Math.pow(10, Math.log10(touch.hi) - shift));
        draw();
      } else if (touch.type === 'pinch' && e.touches.length === 2) {
        const x1 = e.touches[0].clientX - r.left, x2 = e.touches[1].clientX - r.left;
        const dist = Math.abs(x1 - x2);
        const z = touch.dist / Math.max(20, dist);
        const focusX = touch.cx / (canvas.clientWidth - 24);
        const focus = Math.pow(10, Math.log10(touch.lo) + focusX * (Math.log10(touch.hi) - Math.log10(touch.lo)));
        lo = Math.max(F_MIN, Math.pow(10, Math.log10(focus) - (Math.log10(focus) - Math.log10(touch.lo)) * z));
        hi = Math.min(F_MAX, Math.pow(10, Math.log10(focus) + (Math.log10(touch.hi) - Math.log10(focus)) * z));
        draw();
      }
    }, { passive: true });
    canvas.addEventListener('touchend', () => { touch = null; });

    btnIn.addEventListener('click', () => {
      const focus = Math.sqrt(lo * hi), z = 0.6;
      lo = Math.max(F_MIN, Math.pow(10, Math.log10(focus) - (Math.log10(focus) - Math.log10(lo)) * z));
      hi = Math.min(F_MAX, Math.pow(10, Math.log10(focus) + (Math.log10(hi) - Math.log10(focus)) * z));
      draw();
    });
    btnOut.addEventListener('click', () => {
      const focus = Math.sqrt(lo * hi), z = 1.6;
      lo = Math.max(F_MIN, Math.pow(10, Math.log10(focus) - (Math.log10(focus) - Math.log10(lo)) * z));
      hi = Math.min(F_MAX, Math.pow(10, Math.log10(focus) + (Math.log10(hi) - Math.log10(focus)) * z));
      draw();
    });
    btnReset.addEventListener('click', () => { lo = F_MIN; hi = F_MAX; draw(); });

    window.addEventListener('resize', draw);
    requestAnimationFrame(draw);
    return root;
  }

  return { view };
})();
