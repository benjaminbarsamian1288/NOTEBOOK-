/* Frequenzen-Tabelle (Hz → THz) + Datenraten-Tabelle (Bit/s, Datei-Größen).
   Zwei übersichtliche, voll responsive Listen mit Mini-Wellenanimation
   und Lade-Zeit-Vergleichen. window.FREQTAB.view(). */
window.FREQTAB = (() => {
  const { el } = U;

  /* ---------- FREQUENZEN (Hz → THz) ---------- */
  // Aufsteigend sortiert. f = numerische Frequenz in Hz.
  const FREQ = [
    { f: 16,     band: 'Infraschall',   name: 'Erdbeben, U-Boot-Brummen',   icon: 'fa-house-crack',     col: '#475569' },
    { f: 50,     band: 'Niederfrequenz',name: 'Strom aus der Steckdose (50 Hz)', icon: 'fa-plug',       col: '#475569' },
    { f: 100,    band: 'Hörschall tief',name: 'Bass · Brummen',             icon: 'fa-volume-low',      col: '#22c55e' },
    { f: 440,    band: 'Hörschall',     name: 'Kammerton A (Musik-Stimmung)', icon: 'fa-music',         col: '#22c55e' },
    { f: 1e3,    band: 'Hörschall',     name: '1 kHz – Test-Pfeifton',      icon: 'fa-music',           col: '#22c55e' },
    { f: 4e3,    band: 'Sprache',       name: 'Telefon-Stimme',             icon: 'fa-phone',           col: '#22c55e' },
    { f: 15e3,   band: 'Hörgrenze',     name: 'Was Jüngere noch hören',     icon: 'fa-ear-listen',      col: '#22c55e' },
    { f: 20e3,   band: 'Ultraschall',   name: 'Hunde-Pfeife (oberes Ende des Hörens)', icon: 'fa-dog',  col: '#84cc16' },
    { f: 40e3,   band: 'Ultraschall',   name: 'Ultraschall-Reiniger · Bewegungsmelder', icon: 'fa-wave-square', col: '#84cc16' },
    { f: 150e3,  band: 'Langwelle (LF)',name: 'DCF77 Funkuhr (77,5 kHz)',   icon: 'fa-clock',           col: '#a3e635' },
    { f: 540e3,  band: 'Mittelwelle (MW)', name: 'AM-Radio (Mittelwelle)',  icon: 'fa-radio',           col: '#fde047' },
    { f: 6e6,    band: 'Kurzwelle (KW)',name: 'Weltempfänger · Funkamateure', icon: 'fa-globe',         col: '#fbbf24' },
    { f: 27e6,   band: 'CB-Funk',       name: 'CB-Funk (LKW, Hobbyfunk)',   icon: 'fa-truck',           col: '#fbbf24' },
    { f: 100e6,  band: 'UKW (VHF)',     name: 'UKW-Radio · Babyphon',       icon: 'fa-radio',           col: '#f59e0b' },
    { f: 161e6,  band: 'BOS-Funk',      name: 'Polizei · Feuerwehr (Analog)', icon: 'fa-truck-medical', col: '#f59e0b' },
    { f: 174e6,  band: 'DAB+',          name: 'Digital-Radio',              icon: 'fa-tower-broadcast', col: '#f59e0b' },
    { f: 380e6,  band: 'TETRA',         name: 'BOS-Digitalfunk (Polizei)',  icon: 'fa-shield-halved',   col: '#f97316' },
    { f: 433e6,  band: 'ISM 433 MHz',   name: 'Funk-Melder · Garagentor · Wetterstation', icon: 'fa-key', col: '#f97316' },
    { f: 700e6,  band: 'Mobilfunk LTE', name: '4G LTE Band 28',             icon: 'fa-mobile-screen',   col: '#f97316' },
    { f: 800e6,  band: 'DVB-T2',        name: 'Digitales Antennen-Fernsehen', icon: 'fa-tv',            col: '#f97316' },
    { f: 868e6,  band: 'ISM 868 MHz',   name: 'EMA-Funkmelder · KNX-RF · LoRaWAN', icon: 'fa-bell',     col: '#ef4444' },
    { f: 900e6,  band: 'GSM 900',       name: 'Handy 2G',                   icon: 'fa-mobile-screen',   col: '#ef4444' },
    { f: 1.8e9,  band: 'GSM 1800',      name: 'Handy 2G · DECT-Telefon',    icon: 'fa-phone-volume',    col: '#ef4444' },
    { f: 2.4e9,  band: 'WLAN/BT',       name: 'WLAN 2,4 GHz · Bluetooth · ZigBee · Mikrowellen-Ofen', icon: 'fa-wifi', col: '#ec4899' },
    { f: 5e9,    band: 'WLAN 5 GHz',    name: 'WLAN Wi-Fi 5/6 · Wetter-Radar', icon: 'fa-wifi',         col: '#d946ef' },
    { f: 5.8e9,  band: 'ISM 5,8 GHz',   name: 'WLAN · Drohnen-Steuerung',   icon: 'fa-helicopter',      col: '#d946ef' },
    { f: 10e9,   band: 'Mikrowelle',    name: 'Mikrowellen-Bewegungsmelder · Wetter-Radar', icon: 'fa-satellite-dish', col: '#a855f7' },
    { f: 24e9,   band: 'K-Band Radar',  name: 'Verkehrs-Radar (Polizei)',    icon: 'fa-gauge-high',     col: '#a855f7' },
    { f: 28e9,   band: '5G mmWave',     name: '5G Millimeterwelle',          icon: 'fa-tower-cell',     col: '#8b5cf6' },
    { f: 77e9,   band: 'Auto-Radar',    name: 'Adaptive Tempomat im Auto',   icon: 'fa-car',            col: '#8b5cf6' },
    { f: 300e9,  band: 'Terahertz',     name: 'Body-Scanner am Flughafen',   icon: 'fa-person',         col: '#6366f1' },
    { f: 3e12,   band: 'Ferne IR',      name: 'Wärmebildkamera',             icon: 'fa-temperature-high', col: '#6366f1' },
    { f: 30e12,  band: 'Mittel-IR',     name: 'PIR-Bewegungsmelder (Mensch ~10 µm)', icon: 'fa-person-walking', col: '#3b82f6' },
    { f: 100e12, band: 'Nah-IR',        name: 'Fernbedienung · IR-Lichtschranke · Nacht-Kamera', icon: 'fa-magnifying-glass', col: '#3b82f6' },
    { f: 384e12, band: 'Licht rot',     name: 'Sichtbares Licht: ROT',        icon: 'fa-circle',         col: '#ef4444' },
    { f: 484e12, band: 'Licht gelb',    name: 'Sichtbares Licht: GELB',       icon: 'fa-circle',         col: '#fbbf24' },
    { f: 540e12, band: 'Licht grün',    name: 'Sichtbares Licht: GRÜN',       icon: 'fa-circle',         col: '#22c55e' },
    { f: 600e12, band: 'Licht blau',    name: 'Sichtbares Licht: BLAU',       icon: 'fa-circle',         col: '#3b82f6' },
    { f: 750e12, band: 'Licht violett', name: 'Sichtbares Licht: VIOLETT',    icon: 'fa-circle',         col: '#a855f7' },
    { f: 1e15,   band: 'UV-A',          name: 'Schwarzlicht · Solarium',      icon: 'fa-sun',            col: '#a855f7' },
    { f: 1.5e15, band: 'UV-C',          name: 'Desinfektion (254 nm)',        icon: 'fa-virus-slash',    col: '#7c3aed' },
    { f: 3e16,   band: 'Röntgen weich', name: 'Zahn-Röntgen',                 icon: 'fa-tooth',          col: '#7c3aed' },
    { f: 3e18,   band: 'Röntgen hart',  name: 'Gepäck-Scanner am Flughafen',  icon: 'fa-suitcase',       col: '#7c3aed' },
    { f: 1e20,   band: 'Gamma',         name: 'Radioaktive Strahlung',        icon: 'fa-radiation',      col: '#dc2626' },
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
    return Math.round(f) + ' Hz';
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

  // Mini-Wellenanimation – schneller bei höherer Frequenz
  function waveCell(f, color) {
    const W = 110, H = 38, c = el('canvas', { class: 'ft-mini', width: W, height: H });
    const ctx = c.getContext('2d');
    const period = Math.max(0.6, 3.4 - Math.log10(Math.max(1, f)) / 6);
    const cycles = 2 + (Math.log10(Math.max(1, f)) % 1) * 4;
    let t = 0;
    function draw() {
      if (!c.isConnected) return;
      t += 1 / period / 60;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 2; x <= W - 2; x += 1) {
        const k = (x - 2) / (W - 4);
        const y = H / 2 - Math.sin(k * Math.PI * 2 * cycles - t * Math.PI * 2) * (H / 2 - 4);
        x === 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    return c;
  }

  function frequenzTabelle() {
    const wrap = el('div', { class: 'ft-section' });
    wrap.appendChild(el('div', { class: 'ft-sec-head' }, [
      el('div', { class: 'ft-sec-ico', html: '<i class="fas fa-wave-square"></i>' }),
      el('div', {}, [
        el('h3', { text: '📡 Frequenzen · vom Brummen bis Gamma' }),
        el('div', { class: 'ft-sec-sub', text: 'Aufsteigend sortiert · 44 Beispiele · Funk, Licht, Röntgen' }),
      ]),
      el('span', { class: 'ft-sec-count', text: FREQ.length + ' Beispiele' }),
    ]));
    const list = el('div', { class: 'ft-list' });
    list.appendChild(el('div', { class: 'ft-row ft-head' }, [
      el('span', { class: 'ft-c1', text: 'Frequenz' }),
      el('span', { class: 'ft-c2', text: 'Welle' }),
      el('span', { class: 'ft-c3', text: 'Wellenlänge λ' }),
      el('span', { class: 'ft-c4', text: 'Bereich' }),
      el('span', { class: 'ft-c5', text: 'Beispiel' }),
    ]));
    FREQ.forEach(b => {
      const row = el('div', { class: 'ft-row', style: `--lv:${b.col}` });
      row.appendChild(el('span', { class: 'ft-c1 ft-freq', text: fmtHz(b.f) }));
      const c2 = el('span', { class: 'ft-c2' }); c2.appendChild(waveCell(b.f, b.col));
      row.appendChild(c2);
      row.appendChild(el('span', { class: 'ft-c3 ft-lam', text: fmtLambda(C / b.f) }));
      row.appendChild(el('span', { class: 'ft-c4' }, [el('span', { class: 'ft-band', text: b.band })]));
      row.appendChild(el('span', { class: 'ft-c5' }, [
        el('span', { class: 'ft-ic', html: `<i class="fas ${b.icon}"></i>` }),
        el('span', { class: 'ft-ex', text: b.name }),
      ]));
      list.appendChild(row);
    });
    wrap.appendChild(list);
    // Erklärung am Ende
    const help = el('div', { class: 'ft-help' });
    help.innerHTML = `
      <b>Wie lese ich das?</b>
      <ul>
        <li><b>Hz, kHz, MHz, GHz, THz</b> sagt: <i>wie oft pro Sekunde wackelt es</i> – Hz = 1 ×, kHz = 1.000 ×, MHz = 1 Mio. ×, GHz = 1 Milliarde ×, THz = 1 Billion ×</li>
        <li><b>Wellenlänge λ</b> = wie lang ist eine Welle: lange Welle = kleine Frequenz, kurze Welle = große Frequenz</li>
        <li><b>Faustregel:</b> Funk wackelt millionenfach, Mikrowellen milliardenfach, Licht billionenfach</li>
      </ul>`;
    wrap.appendChild(help);
    return wrap;
  }

  /* ---------- DATENRATEN ---------- */
  // Aufsteigende Geschwindigkeiten in Bit/s.
  const RATES = [
    { bps: 300,         name: 'Akustik-Koppler (1980er)',  icon: 'fa-phone',          col: '#475569', note: '300 Bit/s · alte Modems am Telefon' },
    { bps: 9600,        name: 'EMA-BUS · BMA',              icon: 'fa-bell',          col: '#22c55e', note: '9,6 kBit/s · BUS-Leitung zwischen Melder & Zentrale' },
    { bps: 56000,       name: 'Telefon-Modem (analog)',     icon: 'fa-phone-volume',  col: '#22c55e', note: '56 kBit/s · Internet vor DSL' },
    { bps: 384000,      name: 'ISDN (2 Kanäle)',            icon: 'fa-network-wired', col: '#84cc16', note: '384 kBit/s · digitales Telefon' },
    { bps: 6e6,         name: 'DSL Basis · MP3-Stream',     icon: 'fa-music',         col: '#fbbf24', note: '6 MBit/s · Musik streamen' },
    { bps: 16e6,        name: 'DSL Standard · HD-Video',    icon: 'fa-tv',            col: '#fbbf24', note: '16 MBit/s · YouTube HD' },
    { bps: 25e6,        name: 'Netflix 4K UHD',             icon: 'fa-tv',            col: '#f59e0b', note: '25 MBit/s · 4K-Streaming Minimum' },
    { bps: 50e6,        name: 'DSL Highspeed (VDSL)',       icon: 'fa-bolt',          col: '#f59e0b', note: '50 MBit/s · Familien-Anschluss' },
    { bps: 100e6,       name: 'Kabel-Internet · Fast-Ethernet', icon: 'fa-ethernet',  col: '#f97316', note: '100 MBit/s · Standard-Netzwerk-Kabel' },
    { bps: 100e6,       name: '4K-Kamera (IP-Cam)',          icon: 'fa-video',        col: '#f97316', note: '~50–100 MBit/s · 4K-IP-Kamera' },
    { bps: 300e6,       name: 'WLAN-AC · Wi-Fi 5',           icon: 'fa-wifi',         col: '#ef4444', note: '300 MBit/s typisch · 2,4/5 GHz' },
    { bps: 1e9,         name: 'Glasfaser (FTTH) · Gigabit-LAN', icon: 'fa-bolt',      col: '#ec4899', note: '1 GBit/s · modernes Heim-Netz' },
    { bps: 5e9,         name: '5G Mobilfunk · USB 3.0',      icon: 'fa-tower-cell',   col: '#d946ef', note: '5 GBit/s · Spitzenwert' },
    { bps: 10e9,        name: '10-Gigabit-Ethernet · Rechenzentrum', icon: 'fa-server', col: '#a855f7', note: '10 GBit/s · Server-Verbindung' },
    { bps: 100e9,       name: '100-Gigabit-Backbone',        icon: 'fa-network-wired', col: '#8b5cf6', note: '100 GBit/s · Internet-Knoten' },
  ];

  // Dateien zum Lade-Zeit-Vergleich (in Byte).
  const FILES = [
    { name: 'E-Mail (kurz, nur Text)',   bytes: 10 * 1024,           ic: 'fa-envelope',     col: '#22c55e' },
    { name: 'WhatsApp-Nachricht (Text)', bytes: 1 * 1024,            ic: 'fa-comment',      col: '#22c55e' },
    { name: 'Foto vom Handy (JPG)',      bytes: 3 * 1024 * 1024,     ic: 'fa-image',        col: '#84cc16' },
    { name: 'MP3-Song (4 Min)',          bytes: 5 * 1024 * 1024,     ic: 'fa-music',        col: '#fbbf24' },
    { name: 'E-Book (PDF mit Bildern)',  bytes: 10 * 1024 * 1024,    ic: 'fa-book',         col: '#fbbf24' },
    { name: 'Video 5 Min · 1080p',       bytes: 350 * 1024 * 1024,   ic: 'fa-film',         col: '#f59e0b' },
    { name: 'Video 5 Min · 4K UHD',      bytes: 1.5 * 1024 * 1024 * 1024, ic: 'fa-tv',      col: '#f97316' },
    { name: 'Spielfilm 2 h · HD',        bytes: 4 * 1024 * 1024 * 1024, ic: 'fa-film',      col: '#ef4444' },
    { name: 'Spielfilm 2 h · 4K UHD',    bytes: 25 * 1024 * 1024 * 1024, ic: 'fa-clapperboard', col: '#ec4899' },
    { name: 'Video-Spiel (modern)',      bytes: 80 * 1024 * 1024 * 1024, ic: 'fa-gamepad', col: '#a855f7' },
    { name: 'IP-Kamera 24 h · 1080p',    bytes: 15 * 1024 * 1024 * 1024, ic: 'fa-video',   col: '#8b5cf6' },
  ];

  function fmtBps(bps) {
    if (bps >= 1e9) return (bps / 1e9).toFixed(bps >= 1e10 ? 0 : 1) + ' GBit/s';
    if (bps >= 1e6) return (bps / 1e6).toFixed(bps >= 1e7 ? 0 : 1) + ' MBit/s';
    if (bps >= 1e3) return (bps / 1e3).toFixed(bps >= 1e4 ? 0 : 1) + ' kBit/s';
    return Math.round(bps) + ' Bit/s';
  }
  function fmtBytes(b) {
    if (b >= 1024 ** 4) return (b / 1024 ** 4).toFixed(1) + ' TB';
    if (b >= 1024 ** 3) return (b / 1024 ** 3).toFixed(b >= 10 * 1024 ** 3 ? 0 : 1) + ' GB';
    if (b >= 1024 ** 2) return (b / 1024 ** 2).toFixed(b >= 10 * 1024 ** 2 ? 0 : 1) + ' MB';
    if (b >= 1024) return (b / 1024).toFixed(0) + ' KB';
    return b + ' B';
  }
  function fmtTime(s) {
    if (s < 1e-3) return '< 1 ms';
    if (s < 1)    return Math.round(s * 1000) + ' ms';
    if (s < 90)   return s.toFixed(s < 10 ? 1 : 0) + ' s';
    if (s < 5400) return (s / 60).toFixed(s < 600 ? 1 : 0) + ' min';
    if (s < 90 * 3600) return (s / 3600).toFixed(s < 10 * 3600 ? 1 : 0) + ' h';
    return (s / 86400).toFixed(s < 10 * 86400 ? 1 : 0) + ' Tage';
  }
  function downloadTime(bytes, bps) { return bytes * 8 / bps; }

  function datenTabelle() {
    const wrap = el('div', { class: 'ft-section' });
    wrap.appendChild(el('div', { class: 'ft-sec-head' }, [
      el('div', { class: 'ft-sec-ico ft-sec-ico-2', html: '<i class="fas fa-gauge-high"></i>' }),
      el('div', {}, [
        el('h3', { text: '⚡ Datenraten · vom Modem bis zur Glasfaser' }),
        el('div', { class: 'ft-sec-sub', text: 'Aufsteigend sortiert · mit Lade-Zeit-Vergleich' }),
      ]),
      el('span', { class: 'ft-sec-count', text: RATES.length + ' Geschwindigkeiten' }),
    ]));

    // Auswahl-Datei
    let pickIdx = FILES.findIndex(f => /4K UHD/i.test(f.name)); if (pickIdx < 0) pickIdx = 4;
    const pickRow = el('div', { class: 'ft-pick' });
    pickRow.appendChild(el('span', { class: 'ft-pick-l', text: 'Lade-Zeit für:' }));
    const chips = el('div', { class: 'ft-pick-chips' });
    FILES.forEach((f, i) => {
      const c = el('button', { class: 'ft-chip' + (i === pickIdx ? ' on' : ''), type: 'button' });
      c.innerHTML = `<i class="fas ${f.ic}" style="color:${f.col}"></i> ${f.name} · ${fmtBytes(f.bytes)}`;
      c.addEventListener('click', () => { pickIdx = i; refresh(); });
      chips.appendChild(c);
    });
    pickRow.appendChild(chips);
    wrap.appendChild(pickRow);

    const list = el('div', { class: 'ft-list' });
    list.appendChild(el('div', { class: 'ft-row ft-head' }, [
      el('span', { class: 'ft-c1', text: 'Geschwindigkeit' }),
      el('span', { class: 'ft-c2 ft-c-bar', text: 'relativ' }),
      el('span', { class: 'ft-c3', text: 'Lade-Zeit' }),
      el('span', { class: 'ft-c4', text: 'Beispiel' }),
      el('span', { class: 'ft-c5', text: 'Wofür reicht das' }),
    ]));
    wrap.appendChild(list);

    function refresh() {
      list.querySelectorAll('.ft-row:not(.ft-head)').forEach(r => r.remove());
      chips.querySelectorAll('.ft-chip').forEach((c, i) => c.classList.toggle('on', i === pickIdx));
      const file = FILES[pickIdx];
      const maxBps = RATES[RATES.length - 1].bps;
      RATES.forEach(r => {
        const row = el('div', { class: 'ft-row', style: `--lv:${r.col}` });
        row.appendChild(el('span', { class: 'ft-c1 ft-freq', text: fmtBps(r.bps) }));
        const bar = el('span', { class: 'ft-c2 ft-c-bar' });
        const barIn = el('span', { class: 'ft-bar' });
        const fill = el('span', { class: 'ft-bar-fill', style: `width:${(Math.log10(r.bps) / Math.log10(maxBps) * 100).toFixed(1)}%` });
        barIn.appendChild(fill); bar.appendChild(barIn); row.appendChild(bar);
        row.appendChild(el('span', { class: 'ft-c3 ft-lam', text: fmtTime(downloadTime(file.bytes, r.bps)) }));
        row.appendChild(el('span', { class: 'ft-c4' }, [
          el('span', { class: 'ft-ic', html: `<i class="fas ${r.icon}"></i>` }),
          el('span', { class: 'ft-ex', text: r.name }),
        ]));
        row.appendChild(el('span', { class: 'ft-c5', text: r.note }));
        list.appendChild(row);
      });
    }
    refresh();

    const help = el('div', { class: 'ft-help' });
    help.innerHTML = `
      <b>Was bedeutet das?</b>
      <ul>
        <li><b>Bit/s</b> = Wie viele 0/1 pro Sekunde durch die Leitung fließen</li>
        <li><b>1 Byte = 8 Bit</b>. Heißt: <b>1 MB Datei</b> sind <b>8 MBit</b> die übertragen werden müssen</li>
        <li><b>Faustformel:</b> Lade-Zeit ≈ Datei-Größe ÷ Geschwindigkeit (umgerechnet auf gleiche Einheit)</li>
        <li>Tippe oben eine andere <b>Beispiel-Datei</b> an, um die Lade-Zeiten neu zu berechnen</li>
      </ul>`;
    wrap.appendChild(help);
    return wrap;
  }

  function view() {
    const root = el('div', { class: 'ft-wrap' });
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Verstehen · Übersicht' }),
      el('h1', { text: '📡 Frequenzen & ⚡ Datenraten' }),
      el('p', { text: 'Zwei große Tabellen zum Nachschlagen: links Frequenzen mit Mini-Welle, rechts Datenraten mit Lade-Zeit für deine Lieblings-Datei (E-Mail bis 4K-Spielfilm). Alles sortiert von klein nach groß.' }),
    ]));
    root.appendChild(frequenzTabelle());
    root.appendChild(datenTabelle());
    return root;
  }
  return { view };
})();
