/* Schließzylinder · Hersteller + interaktive Animation mechanisch/elektronisch.
   window.ZYLINDER.view(). */
window.ZYLINDER = (() => {
  const { el } = U;

  /* ============ Hersteller-Datenbank ============ */
  const HERSTELLER = {
    mechanisch: {
      title: 'Mechanische Schließzylinder',
      icon: 'fa-key',
      color: '#fbbf24',
      lead: 'Klassischer Stiftzylinder (DIN EN 1303). Sicherheit kommt aus der Geometrie: mehr Stifte, harte Bohrschutz-Pins, Sägeschutz-Hülse, Karten-System mit Patentschutz.',
      firms: [
        { n:'ABUS', land:'DE · Wetter (Ruhr)', spec:'XP20S, Bravus, Wavy Line, Pfaffenhain. Sehr breite Produktpalette.', klassen:'VdS A / B / BZ+', tag:'Top', web:'abus.com' },
        { n:'BKS (Gretsch-Unitas)', land:'DE · Velbert', spec:'PZ 88, Janus, Detect3. Marktführer Beschläge + Zylinder.', klassen:'VdS BZ+ / Klasse 4', tag:'Top', web:'bks.de' },
        { n:'dormakaba (penta/Kaba)', land:'DE/CH · Ennepetal', spec:'Kaba penta, Kaba star, Kaba expert plus. Reversible Wendeschlüssel.', klassen:'VdS BZ+', tag:'Top', web:'dormakaba.com' },
        { n:'KESO (dormakaba-Gruppe)', land:'CH · Richterswil', spec:'8000Ω², 4000S Omega — Hochsicherheit, drei Wirkflächen.', klassen:'VdS BZ+ / Klasse 5', tag:'Highend', web:'keso.com' },
        { n:'Winkhaus', land:'DE · Münster', spec:'blueChip, keyTec X-tra, RPE. Patent bis ~2034.', klassen:'VdS BZ+', tag:'Top', web:'winkhaus.de' },
        { n:'EVVA', land:'AT · Wien', spec:'MCS (Magnet-Code-System), 4KS, 3KS Plus, EPS. Magnet-Patent.', klassen:'VdS BZ+ / Klasse 5', tag:'Highend', web:'evva.com' },
        { n:'CES (C. Ed. Schulte)', land:'DE · Velbert', spec:'OMEGA Plus, OMEGA Flex. Bohrschutz aus gehärtetem Stahl.', klassen:'VdS BZ+', tag:'', web:'ces.eu' },
        { n:'IKON (ASSA ABLOY)', land:'DE · Berlin', spec:'IKON RW6, Vector. Reversible Wendeschlüssel.', klassen:'VdS BZ+', tag:'', web:'ikon.de' },
        { n:'DOM Sicherheitstechnik', land:'DE · Brühl', spec:'Diamant, IX 6N/7N. Patentschutz bis ca. 2030.', klassen:'VdS BZ+', tag:'', web:'dom-group.eu' },
        { n:'Mul-T-Lock (ASSA ABLOY)', land:'IL · Yavne', spec:'Interactive+, MT5+. Telescopic-Pin-Technologie.', klassen:'VdS BZ+ / Klasse 5', tag:'Highend', web:'mul-t-lock.com' },
        { n:'Wilka', land:'DE · Velbert', spec:'Carat, Carat S2. Solide Mittelklasse, gutes Preis-/Leistungs-Verhältnis.', klassen:'VdS A / BZ+', tag:'', web:'wilka.de' },
        { n:'GeGe (Pfaffenhain)', land:'DE/AT', spec:'pextra+, AP3000. Modulares System.', klassen:'VdS BZ+', tag:'', web:'gege.at' },
      ],
    },
    elektronisch: {
      title: 'Elektronische Schließzylinder',
      icon: 'fa-microchip',
      color: '#22d3ee',
      lead: 'Statt mechanischer Stifte entscheidet eine Elektronik per RFID/Funk/BLE über die Freigabe. Batteriebetrieb (4–8 Jahre), beliebige Zutrittsrechte, Audit-Trail, Sperren beim Schlüsselverlust ohne Zylindertausch.',
      firms: [
        { n:'SimonsVoss (Allegion)', land:'DE · Unterföhring', spec:'System 3060, MobileKey, AX-Serie. Funk 25 kHz / Bluetooth. Marktführer DACH.', klassen:'BLE/RFID · Online + Offline', tag:'Top', web:'simons-voss.com' },
        { n:'dormakaba evolo', land:'CH/DE', spec:'evolo smart, c-lever. RFID Mifare/LEGIC, Online via WLAN/BLE.', klassen:'RFID 13,56 MHz · BLE', tag:'Top', web:'dormakaba.com' },
        { n:'Salto Systems', land:'ES · Oiartzun', spec:'XS4 Mini, Neo, Aelement Fusion. Virtuelles Netzwerk SVN.', klassen:'RFID · BLE · SVN', tag:'Top', web:'saltosystems.com' },
        { n:'ASSA ABLOY Aperio', land:'SE · Stockholm', spec:'Aperio (C100, E100, KS100). Drahtloses Add-On zu jedem Online-System.', klassen:'IEEE 802.15.4 · DESFire', tag:'Top', web:'assaabloy.com' },
        { n:'Nuki Home Solutions', land:'AT · Graz', spec:'Smart Lock 4 Pro, Keypad. Aufsatz-Lösung, Smartphone-zentriert.', klassen:'BLE · WiFi · Matter', tag:'', web:'nuki.io' },
        { n:'ABUS HomeTec Pro / wAppLoxx', land:'DE · Wetter', spec:'wAppLoxx Pro System, CFS3000 Tür-Funkzylinder.', klassen:'BLE · RFID · WiFi', tag:'', web:'abus.com' },
        { n:'Winkhaus blueSmart', land:'DE · Münster', spec:'blueSmart Active, blueCompact. Schlüssel-getrieben (Strom aus Schlüssel).', klassen:'RFID · proprietär', tag:'', web:'winkhaus.de' },
        { n:'BKS B-SmartConnect', land:'DE · Velbert', spec:'Mechatronische Zylinder, IXALO-Plattform.', klassen:'RFID · BLE', tag:'', web:'bks.de' },
        { n:'Iseo Libra', land:'IT · Pisogne', spec:'Libra Smart, Argo. App-basiert, BLE.', klassen:'BLE · Cloud', tag:'', web:'iseo.com' },
        { n:'Burg-Wächter secuENTRY', land:'DE · Wetter', spec:'5000 PIN, Smart Pro. Codetastatur + Fingerprint.', klassen:'BLE · Fingerprint', tag:'', web:'burg.biz' },
        { n:'Yale Linus / Conexis', land:'UK/SE (ASSA ABLOY)', spec:'Smart-Lock Linus L2, Conexis L1. App, Zigbee, Matter.', klassen:'BLE · Zigbee · Matter', tag:'', web:'yalehome.de' },
        { n:'EVVA Xesar / AirKey', land:'AT · Wien', spec:'Xesar (Offline-System), AirKey (Cloud, NFC-Smartphones).', klassen:'NFC · BLE · Cloud', tag:'', web:'evva.com' },
        { n:'KIWI.KI', land:'DE · Berlin', spec:'Funk-Mietshaus-System, kein Schlüssel, schwarzer Knopf.', klassen:'BLE · Funk-Box', tag:'', web:'kiwi.ki' },
        { n:'Tedee', land:'PL', spec:'Tedee GO / PRO Smart-Lock, sehr kompakt.', klassen:'BLE · WiFi-Bridge', tag:'', web:'tedee.com' },
      ],
    },
    hybrid: {
      title: 'Mechatronik / Hybrid',
      icon: 'fa-puzzle-piece',
      color: '#a855f7',
      lead: 'Mechanik + Elektronik kombiniert: Schlüssel muss mechanisch UND elektronisch passen. Bei Schlüsselverlust nur Berechtigung sperren — kein Zylindertausch.',
      firms: [
        { n:'KESO dynamic', land:'CH', spec:'Mechatronik-Variante des 8000Ω². Schlüssel mit Chip + Zacken.', klassen:'VdS BZ+ · RFID', tag:'Top', web:'keso.com' },
        { n:'Mul-T-Lock Smart-Air', land:'IL', spec:'Standalone Mechatronik, Audit-Trail.', klassen:'BLE · MT5+', tag:'', web:'mul-t-lock.com' },
        { n:'CES OMEGA Flex Cliq', land:'DE', spec:'OEM für ASSA ABLOY CLIQ-Plattform.', klassen:'VdS BZ+ · ASSA CLIQ', tag:'', web:'ces.eu' },
        { n:'ASSA ABLOY CLIQ', land:'SE', spec:'Universelle CLIQ-Plattform (eCliq, Verso Cliq, IKON Cliq).', klassen:'Mech. + ID + Audit', tag:'Top', web:'assaabloy.com' },
        { n:'dormakaba penta+', land:'CH/DE', spec:'penta + RFID-Chip im Kopf. Master-/Schlüsselplan online.', klassen:'VdS BZ+ · RFID', tag:'', web:'dormakaba.com' },
      ],
    },
  };

  /* ============ Animation: Stiftzylinder Cutaway ============ */
  function renderMechanicalAnim() {
    const wrap = el('div', { class: 'zyl-anim-card' });
    wrap.appendChild(el('div', { class: 'zyl-anim-head' }, [
      el('h3', { html: '<i class="fas fa-key"></i> Mechanischer Stiftzylinder · Live' }),
      el('p', { text: 'So funktioniert ein Schließzylinder: der Schlüssel hebt die Stifte genau auf die Scherlinie. Probier es selbst — Schlüssel hineinschieben oder „Richtiger / Falscher Schlüssel" testen.' }),
    ]));
    const W = 580, H = 260;
    const canvas = el('canvas', { class: 'zyl-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    wrap.appendChild(canvas);

    // Steuerung
    const ctrl = el('div', { class: 'zyl-ctrl' });
    let keyPos = 0;           // 0 = außen, 1 = ganz eingesteckt
    let rotation = 0;         // 0 = nicht gedreht, 1 = 90° offen
    let keyKind = 'right';    // right / wrong
    let auto = true;
    const slider = el('input', { type: 'range', min: '0', max: '100', value: '0', class: 'zyl-slider' });
    slider.addEventListener('input', () => { keyPos = +slider.value / 100; auto = false; });
    ctrl.appendChild(el('label', { text: 'Schlüssel einstecken:' }));
    ctrl.appendChild(slider);
    const btnR = el('button', { class: 'zyl-btn zyl-btn-on', text: '🔑 Richtiger Schlüssel' });
    const btnW = el('button', { class: 'zyl-btn',           text: '🪛 Falscher Schlüssel' });
    btnR.addEventListener('click', () => { keyKind = 'right'; btnR.classList.add('zyl-btn-on'); btnW.classList.remove('zyl-btn-on'); });
    btnW.addEventListener('click', () => { keyKind = 'wrong'; btnW.classList.add('zyl-btn-on'); btnR.classList.remove('zyl-btn-on'); });
    const ctrlBtns = el('div', { class: 'zyl-ctrl-btns' }, [btnR, btnW]);
    wrap.appendChild(ctrl);
    wrap.appendChild(ctrlBtns);

    // Status-Box
    const status = el('div', { class: 'zyl-status' });
    wrap.appendChild(status);

    // Pin-Konfiguration (5 Stifte) – Höhen für „richtigen" Schlüssel
    const pins = [
      { rightY: 18, wrongY: 28 },
      { rightY: 26, wrongY: 16 },
      { rightY: 14, wrongY: 22 },
      { rightY: 22, wrongY: 32 },
      { rightY: 20, wrongY: 12 },
    ];

    function draw(t) {
      if (!canvas.isConnected) return;
      // Auto-Demo
      if (auto) {
        const cycle = (t / 1000) % 6;
        if (cycle < 2) keyPos = cycle / 2;
        else if (cycle < 3) keyPos = 1;
        else if (cycle < 5) keyPos = 1 - (cycle - 3) / 2;
        else keyPos = 0;
        slider.value = String(Math.round(keyPos * 100));
      }
      // Rotation nur wenn Schlüssel ganz drin und richtig
      const target = (keyPos > 0.95 && keyKind === 'right') ? 1 : 0;
      rotation += (target - rotation) * 0.08;

      ctx.clearRect(0, 0, W, H);
      // Hintergrund Verlauf
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Gehäuse (Plug + Body)
      const cx = W / 2, cy = H / 2 + 10;
      const bodyW = 360, bodyH = 130;
      const bx = cx - bodyW / 2, by = cy - bodyH / 2;

      // Body (außen, fest)
      ctx.fillStyle = '#2a3441'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.fillRect(bx, by, bodyW, bodyH); ctx.strokeRect(bx, by, bodyW, bodyH);
      // Innen-Trommel-Kreis
      const plugX = cx, plugY = cy + 24;
      const plugR = 44;
      // Schlüsselkanal
      ctx.save();
      ctx.translate(plugX, plugY);
      ctx.rotate(rotation * Math.PI / 2);
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(0, 0, plugR, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();
      // Schlüsselschlitz im Plug
      ctx.fillStyle = '#0b1424'; ctx.fillRect(-plugR + 4, -4, plugR * 2 - 8, 8);
      ctx.restore();

      // Trennlinie (Scherlinie)
      const shear = plugY - plugR;
      ctx.strokeStyle = 'rgba(251,191,36,.45)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(bx, shear); ctx.lineTo(bx + bodyW, shear); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('← Scherlinie', bx + 8, shear - 4);

      // Schlüssel zeichnen (Bart links der Trommel, wandert rein)
      const keyStartX = bx - 200;
      const keyEndX = plugX - plugR + 18;
      const keyX = keyStartX + (keyEndX - keyStartX) * keyPos;
      const keyY = plugY;
      // Schlüssel-Reide (Griff)
      ctx.save();
      ctx.translate(keyX - 18, keyY);
      ctx.rotate(rotation * Math.PI / 2);
      ctx.fillStyle = keyKind === 'right' ? '#fbbf24' : '#94a3b8';
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-30, 0, 22, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0b1424'; ctx.beginPath(); ctx.arc(-30, 0, 7, 0, 7); ctx.fill();
      ctx.restore();
      // Schlüssel-Bart (Schaft + Kerben)
      ctx.save();
      ctx.translate(keyX, keyY);
      ctx.rotate(rotation * Math.PI / 2);
      ctx.fillStyle = keyKind === 'right' ? '#fbbf24' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(-50, -5); ctx.lineTo(160, -5);
      // Unterseite: Kerben für die Pins
      ctx.lineTo(160, 5);
      pins.slice().reverse().forEach((p, idx) => {
        const i = pins.length - 1 - idx;
        const cutY = (keyKind === 'right' ? p.rightY : p.wrongY) - 4;
        const xL = 30 + i * 28, xR = xL + 20;
        ctx.lineTo(xR, 5); ctx.lineTo(xR - 5, cutY); ctx.lineTo(xL + 5, cutY); ctx.lineTo(xL, 5);
      });
      ctx.lineTo(-50, 5); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();

      // Pins zeichnen (5 Stück)
      const pinStartX = plugX - plugR + 12;
      const pinGap = 16;
      pins.forEach((p, i) => {
        const px = pinStartX + i * pinGap;
        // Federn oben
        const housingTop = by + 8;
        // Bei keyPos > 0.95 = Schlüssel da: Stifte werden hochgehoben
        const lift = keyPos > 0.5 ? Math.max(0, (keyPos - 0.5) * 2) : 0;  // 0..1
        const cutHeight = keyKind === 'right' ? p.rightY : p.wrongY;
        // Untere (Schlüsselstifte) Position: Boden = Schlüsseloberkante
        const lowerBottom = plugY + 5 - rotation * 4;
        const lowerTop = lowerBottom - cutHeight * lift;
        // Obere (Gehäusestifte) liegen darüber
        const upperBottom = lowerTop;
        const upperTop = upperBottom - 22;
        // Feder
        ctx.strokeStyle = '#6b7c9e'; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let y = upperTop; y > housingTop; y -= 4) {
          ctx.moveTo(px - 3, y); ctx.lineTo(px + 3, y - 2);
        }
        ctx.stroke();
        // Oberer Stift (rot/grün je nach passend)
        const passes = keyKind === 'right' && Math.abs((lowerTop) - shear) < 2.5 && lift > 0.9;
        ctx.fillStyle = passes ? '#22c55e' : '#94a3b8';
        ctx.fillRect(px - 4, upperTop, 8, upperBottom - upperTop);
        // Unterer Stift (Schlüsselstift)
        ctx.fillStyle = keyKind === 'right' ? '#fbbf24' : '#ef4444';
        ctx.fillRect(px - 4, lowerTop, 8, lowerBottom - lowerTop);
      });

      // Label "OFFEN" / "BLOCKIERT"
      ctx.font = '900 18px sans-serif'; ctx.textAlign = 'center';
      if (rotation > 0.6) {
        ctx.fillStyle = '#22c55e';
        ctx.fillText('🔓 OFFEN', cx, by + 24);
        status.textContent = '✅ Schlüssel passt. Alle Stifte auf der Scherlinie → Trommel dreht.';
        status.className = 'zyl-status zyl-status-ok';
      } else if (keyPos > 0.95 && keyKind === 'wrong') {
        ctx.fillStyle = '#ef4444';
        ctx.fillText('🚫 BLOCKIERT', cx, by + 24);
        status.textContent = '❌ Falscher Schlüssel. Stifte stehen über/unter der Scherlinie → Trommel blockiert.';
        status.className = 'zyl-status zyl-status-bad';
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Schlüssel einstecken…', cx, by + 24);
        status.textContent = 'Schieb den Schlüssel langsam ein und schau, wie die Stifte hochgedrückt werden.';
        status.className = 'zyl-status';
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    return wrap;
  }

  /* ============ Animation: Elektronischer Zylinder ============ */
  function renderElectronicAnim() {
    const wrap = el('div', { class: 'zyl-anim-card zyl-anim-elec' });
    wrap.appendChild(el('div', { class: 'zyl-anim-head' }, [
      el('h3', { html: '<i class="fas fa-microchip"></i> Elektronischer Schließzylinder · Live' }),
      el('p', { text: 'Kein mechanischer Bart mehr — der Schlüssel (Transponder/Karte/Handy) funkt eine ID, der Zylinder prüft sie gegen seine Liste und kuppelt den Knauf nur dann mit dem Riegel.' }),
    ]));
    const W = 580, H = 260;
    const canvas = el('canvas', { class: 'zyl-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    wrap.appendChild(canvas);

    const ctrl = el('div', { class: 'zyl-ctrl-btns' });
    let mode = 'rfid';   // rfid / ble / fingerprint
    let auth = 'right';
    const bRFID = el('button', { class: 'zyl-btn zyl-btn-on', text: '🔑 RFID-Transponder' });
    const bBLE  = el('button', { class: 'zyl-btn',           text: '📱 Smartphone (BLE)' });
    const bFP   = el('button', { class: 'zyl-btn',           text: '👆 Fingerprint' });
    const bGood = el('button', { class: 'zyl-btn zyl-btn-on', text: '✅ Berechtigt' });
    const bBad  = el('button', { class: 'zyl-btn',           text: '⛔ Gesperrt' });
    [[bRFID, 'rfid'], [bBLE, 'ble'], [bFP, 'fingerprint']].forEach(([b, m]) => {
      b.addEventListener('click', () => {
        mode = m; [bRFID, bBLE, bFP].forEach(x => x.classList.remove('zyl-btn-on')); b.classList.add('zyl-btn-on');
      });
      ctrl.appendChild(b);
    });
    const ctrl2 = el('div', { class: 'zyl-ctrl-btns' });
    bGood.addEventListener('click', () => { auth = 'right'; bGood.classList.add('zyl-btn-on'); bBad.classList.remove('zyl-btn-on'); restartAuth(); });
    bBad.addEventListener('click',  () => { auth = 'wrong'; bBad.classList.add('zyl-btn-on');  bGood.classList.remove('zyl-btn-on'); restartAuth(); });
    ctrl2.appendChild(bGood); ctrl2.appendChild(bBad);
    wrap.appendChild(ctrl); wrap.appendChild(ctrl2);

    const status = el('div', { class: 'zyl-status' });
    wrap.appendChild(status);

    // Auth-Sequenz: 0 = idle, 1 = lesen, 2 = prüfen, 3 = entscheidung
    let phase = 0, phaseT = 0, lastDecision = 0;
    function restartAuth() { phase = 1; phaseT = 0; }
    setInterval(() => { if (phase === 0) restartAuth(); }, 4500);

    function draw(t) {
      if (!canvas.isConnected) return;
      phaseT += 1/60;
      if (phase === 1 && phaseT > 1.0) { phase = 2; phaseT = 0; }
      else if (phase === 2 && phaseT > 0.9) { phase = 3; phaseT = 0; lastDecision = auth === 'right' ? 1 : -1; }
      else if (phase === 3 && phaseT > 2.0) { phase = 0; phaseT = 0; }

      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2 + 10;
      // Zylinder-Body
      const bodyW = 280, bodyH = 110;
      const bx = cx - bodyW / 2 + 20, by = cy - bodyH / 2;
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2;
      ctx.fillRect(bx, by, bodyW, bodyH); ctx.strokeRect(bx, by, bodyW, bodyH);
      // Innen-Elektronik (PCB-Linien)
      ctx.strokeStyle = 'rgba(34,211,238,.35)'; ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(bx + 16, by + 20 + i * 18);
        ctx.lineTo(bx + 80, by + 20 + i * 18);
        ctx.lineTo(bx + 80, by + 30 + i * 18);
        ctx.lineTo(bx + 160, by + 30 + i * 18);
        ctx.stroke();
      }
      // Chip
      ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5;
      ctx.fillRect(bx + 40, by + 36, 30, 30); ctx.strokeRect(bx + 40, by + 36, 30, 30);
      ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('MCU', bx + 55, by + 54);
      // Batterie
      ctx.fillStyle = '#22c55e'; ctx.fillRect(bx + 100, by + 76, 26, 12);
      ctx.fillRect(bx + 126, by + 80, 4, 4);
      ctx.fillStyle = '#0b1424'; ctx.font = 'bold 8px sans-serif';
      ctx.fillText('BATT', bx + 113, by + 85);
      // Antenne
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + 80, by + 30); ctx.lineTo(bx + 80, by + 8);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(bx + 80, by + 8, 4, 0, 7); ctx.fillStyle = '#fbbf24'; ctx.fill();

      // Knauf rechts (außen)
      const knaufX = bx + bodyW + 24, knaufY = cy;
      const knaufR = 36;
      // Drehung des Knaufs wenn freigegeben
      const knaufRot = lastDecision > 0 && phase === 3 ? Math.min(1, phaseT / 0.4) : 0;
      ctx.save(); ctx.translate(knaufX, knaufY); ctx.rotate(knaufRot * Math.PI / 2);
      const knaufGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, knaufR);
      knaufGrad.addColorStop(0, '#475569'); knaufGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = knaufGrad; ctx.beginPath(); ctx.arc(0, 0, knaufR, 0, 7); ctx.fill();
      ctx.strokeStyle = lastDecision > 0 && phase === 3 ? '#22c55e' : '#94a3b8'; ctx.lineWidth = 3; ctx.stroke();
      // Knauf-Griff-Strich
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(-4, -knaufR + 6, 8, knaufR - 6);
      ctx.restore();
      // Riegel (extending zur Tür)
      const riegelExt = lastDecision > 0 && phase === 3 ? Math.min(1, phaseT / 0.6) : 0;
      ctx.fillStyle = lastDecision > 0 && phase === 3 ? '#22c55e' : '#94a3b8';
      ctx.fillRect(knaufX + knaufR + 4, cy - 6, 12 + riegelExt * 30, 12);

      // Schlüssel/Transponder/Handy LINKS
      const tagX = bx - 80, tagY = cy;
      ctx.save(); ctx.translate(tagX, tagY);
      if (mode === 'rfid') {
        // Transponder = kleine Karte
        ctx.fillStyle = '#a855f7'; ctx.fillRect(-22, -14, 44, 28);
        ctx.strokeStyle = '#0b1424'; ctx.lineWidth = 1.5; ctx.strokeRect(-22, -14, 44, 28);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('RFID', 0, 3);
      } else if (mode === 'ble') {
        // Smartphone
        ctx.fillStyle = '#0b1424'; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2;
        ctx.fillRect(-14, -22, 28, 44); ctx.strokeRect(-14, -22, 28, 44);
        ctx.fillStyle = '#22d3ee'; ctx.font = '18px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('📱', 0, 4);
      } else {
        // Finger
        ctx.fillStyle = '#fbbf24'; ctx.font = '34px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('👆', 0, 12);
      }
      ctx.restore();

      // Funk-Wellen während Auth-Phase 1+2
      if (phase >= 1 && phase <= 2) {
        const cnt = 3;
        for (let i = 0; i < cnt; i++) {
          const phaseShift = (t / 600 + i / cnt) % 1;
          const r = 8 + phaseShift * 60;
          ctx.strokeStyle = `rgba(34,211,238,${(1 - phaseShift) * 0.7})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(tagX, tagY, r, -Math.PI/3, Math.PI/3); ctx.stroke();
        }
      }
      // Phase-Label
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      let pTxt = ''; let pCol = '#94a3b8';
      if (phase === 1) { pTxt = '📡 Lese ID…'; pCol = '#22d3ee'; }
      else if (phase === 2) { pTxt = '🔍 Prüfe Berechtigung…'; pCol = '#fbbf24'; }
      else if (phase === 3) {
        if (lastDecision > 0) { pTxt = '✅ Freigegeben · Knauf gekuppelt'; pCol = '#22c55e'; }
        else                  { pTxt = '⛔ Gesperrt · Knauf läuft leer'; pCol = '#ef4444'; }
      } else { pTxt = '💤 Bereit'; pCol = '#64748b'; }
      ctx.fillStyle = pCol;
      ctx.fillText(pTxt, cx, by - 12);

      // Status-Text unten
      if (phase === 3) {
        if (lastDecision > 0) {
          status.className = 'zyl-status zyl-status-ok';
          status.textContent = '✅ ID gefunden und gültig. Motor/Kupplung verbindet Knauf mit Schließnase → Tür auf.';
        } else {
          status.className = 'zyl-status zyl-status-bad';
          status.textContent = '⛔ ID unbekannt oder gesperrt. Knauf dreht im Leerlauf — Riegel bleibt zu. Versuch wird mit Zeitstempel geloggt.';
        }
      } else if (phase === 0) {
        status.className = 'zyl-status';
        status.textContent = 'Wähle oben Schlüssel-Typ und Berechtigung. Alle 4 s startet ein neuer Versuch automatisch.';
      } else {
        status.className = 'zyl-status';
        status.textContent = phase === 1 ? '📡 Der Zylinder weckt den Transponder und liest dessen ID.' : '🔍 Der Zylinder prüft die ID gegen seine interne Whitelist.';
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    return wrap;
  }

  /* ============ Hersteller-Liste rendern ============ */
  function renderHerstellerCard(cat) {
    const data = HERSTELLER[cat];
    const wrap = el('div', { class: 'zyl-hst-card', style: `--c:${data.color}` });
    wrap.appendChild(el('div', { class: 'zyl-hst-head' }, [
      el('div', { class: 'zyl-hst-ico', html: `<i class="fas ${data.icon}"></i>` }),
      el('div', {}, [
        el('h3', { text: data.title }),
        el('p', { text: data.lead }),
      ]),
      el('span', { class: 'zyl-hst-count', text: data.firms.length + ' Hersteller' }),
    ]));
    const grid = el('div', { class: 'zyl-hst-grid' });
    data.firms.forEach(f => {
      const card = el('div', { class: 'zyl-hst-firm' + (f.tag === 'Top' ? ' top' : (f.tag === 'Highend' ? ' highend' : '')) });
      if (f.tag) card.appendChild(el('span', { class: 'zyl-hst-tag', text: f.tag }));
      card.appendChild(el('div', { class: 'zyl-hst-firm-head' }, [
        el('strong', { text: f.n }),
        el('span', { class: 'zyl-hst-firm-land', text: f.land }),
      ]));
      card.appendChild(el('p', { class: 'zyl-hst-firm-spec', text: f.spec }));
      if (f.klassen) card.appendChild(el('div', { class: 'zyl-hst-firm-klass', text: f.klassen }));
      if (f.web) {
        const link = el('a', { class: 'zyl-hst-firm-web', href: 'https://' + f.web, target: '_blank', rel: 'noopener', html: '<i class="fas fa-globe"></i> ' + f.web });
        card.appendChild(link);
      }
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  /* ============ Vergleichs-Tabelle mechanisch vs elektronisch ============ */
  function renderCompare() {
    const wrap = el('div', { class: 'zyl-cmp-card' });
    wrap.appendChild(el('h3', { html: '<i class="fas fa-table-columns"></i> Mechanisch vs. Elektronisch' }));
    const rows = [
      ['Schlüssel',           'Metall-Schlüssel mit Profilkerben',     'Transponder, RFID-Karte, Smartphone, Finger'],
      ['Stromversorgung',     'Keine',                                  'Batterie (typ. 4–8 Jahre) oder Schlüssel-Energie'],
      ['Schlüsselverlust',    'Kompletter Zylindertausch notwendig',    'In Software sperren · Zylinder bleibt'],
      ['Zutrittsrechte',      'Schließanlage mit Master/Untermaster',   'Pro Person/Zeitfenster individuell, jederzeit änderbar'],
      ['Audit-Trail',         'Nicht möglich',                          'Wer hat wann geöffnet — sekundengenau geloggt'],
      ['Anschaffungspreis',   '€ 50 – 300 / Zylinder',                  '€ 250 – 800 / Zylinder + Software/Server'],
      ['Folgekosten',         'Schlüssel nachbestellen',                'Batterie tauschen, ggf. Cloud-Gebühr'],
      ['VdS-Zulassung',       'Klasse A · B · BZ+ · Klasse 4/5',         'Klasse 1–3 nach VdS 3112 / EN 15684'],
      ['Norm',                'DIN EN 1303, DIN 18252',                 'EN 15684 (mechatronisch), VdS 3112'],
      ['Aufbruch-Schutz',     'Bohrschutz · Picking · SmartKey',         'Mechanisch + verschlüsselte Funkstrecke (AES)'],
    ];
    const tbl = el('table', { class: 'zyl-cmp' });
    const thead = el('thead');
    thead.appendChild(el('tr', {}, [
      el('th', { text: 'Eigenschaft' }),
      el('th', { html: '<i class="fas fa-key" style="color:#fbbf24"></i> Mechanisch' }),
      el('th', { html: '<i class="fas fa-microchip" style="color:#22d3ee"></i> Elektronisch' }),
    ]));
    tbl.appendChild(thead);
    const tbody = el('tbody');
    rows.forEach(r => {
      const tr = el('tr');
      r.forEach((c, i) => tr.appendChild(el('td', { text: c, class: i === 0 ? 'zyl-cmp-l' : '' })));
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    return wrap;
  }

  /* ============ Hauptview ============ */
  function view() {
    const root = el('div', { class: 'zyl-wrap' });
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Technik · Mechanik' }),
      el('h1', { html: '🔑 Schließzylinder · Hersteller &amp; Funktion' }),
      el('p', { text: 'Mechanisch und elektronisch erklärt – mit Live-Animationen, namhaften Herstellern und einem direkten Vergleich.' }),
    ]));
    // Tab-Bar
    const tabs = el('div', { class: 'zyl-tabs' });
    const sections = { mech: null, elec: null, cmp: null };
    let active = 'mech';
    sections.mech = el('div', {});
    sections.mech.appendChild(renderMechanicalAnim());
    sections.mech.appendChild(renderHerstellerCard('mechanisch'));
    sections.elec = el('div', {});
    sections.elec.appendChild(renderElectronicAnim());
    sections.elec.appendChild(renderHerstellerCard('elektronisch'));
    sections.elec.appendChild(renderHerstellerCard('hybrid'));
    sections.cmp = el('div', {});
    sections.cmp.appendChild(renderCompare());

    const stage = el('div', { class: 'zyl-stage' });

    function setActive(k) {
      active = k;
      tabs.querySelectorAll('.zyl-tab').forEach(t => t.classList.toggle('on', t.dataset.k === k));
      stage.innerHTML = '';
      stage.appendChild(sections[k]);
    }
    [['mech', '🔑 Mechanisch', '#fbbf24'], ['elec', '🔌 Elektronisch', '#22d3ee'], ['cmp', '⚖️ Vergleich', '#a855f7']].forEach(([k, lbl, c]) => {
      const b = el('button', { class: 'zyl-tab' + (k === 'mech' ? ' on' : ''), type: 'button', dataset: { k }, text: lbl, style: `--c:${c}` });
      b.addEventListener('click', () => setActive(k));
      tabs.appendChild(b);
    });
    root.appendChild(tabs);
    root.appendChild(stage);
    setActive('mech');
    return root;
  }

  return { view };
})();
