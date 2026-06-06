/* Anti-Terror-Sperren (HVM = Hostile Vehicle Mitigation):
   Poller, Sperrkissen, Crash-Tore, Reifentöter, Schikanen, Naturhindernisse.
   Mit Live-Animation eines Fahrzeug-Anpralls und Hersteller-Übersicht.
   window.HVM.view(). */
window.HVM = (() => {
  const { el } = U;

  /* ============ Datenbank: Sperr-Arten ============ */
  const TYPES = [
    {
      key: 'bollard-fixed',
      icon: 'fa-circle',
      name: 'Fester Anti-Ram-Poller',
      short: 'Bollard fix',
      lead: 'Tief gegründeter Stahlpoller (50–150 cm). Stoppt LKW bis 7,5 t bei 80 km/h (K12/PAS 68).',
      norms: ['PAS 68', 'IWA 14-1', 'ASTM F2656'],
      stops: 'PKW · Transporter · LKW bis 7,5 t',
      kineticMJ: 1.85,
      typPlace: 'Botschaften · Regierung · Flughäfen · Stadien · Fußgängerzonen',
      color: '#ef4444',
    },
    {
      key: 'bollard-retract',
      icon: 'fa-arrow-down-to-line',
      name: 'Versenkbarer Poller',
      short: 'Bollard versenkbar',
      lead: 'Hydraulisch oder elektromechanisch versenkbar – Fahrzeuge dürfen normal passieren, im Alarmfall Hochfahren in 1,5–3 s.',
      norms: ['PAS 68', 'IWA 14-1'],
      stops: 'PKW · Transporter (je nach Modell auch LKW)',
      kineticMJ: 1.10,
      typPlace: 'Fußgängerzonen · Lieferzonen · Veranstaltungs-Perimeter',
      color: '#f97316',
    },
    {
      key: 'wedge',
      icon: 'fa-mountain',
      name: 'Hochsicherheits-Schranke / Sperrkissen (Wedge)',
      short: 'Wedge-Barrier',
      lead: 'Aufstellbare Stahlplatte am Boden, fährt in 1,5 s schräg hoch. Lenkt das Fahrzeug nach oben/links – Motor- und Vorderachs-Zerstörung.',
      norms: ['PAS 68 V/7500 [N3]', 'ASTM F2656'],
      stops: 'PKW · Transporter · LKW bis 7,5 t',
      kineticMJ: 1.85,
      typPlace: 'Militär · Flughäfen · Atomkraftwerke',
      color: '#a855f7',
    },
    {
      key: 'gate',
      icon: 'fa-door-closed',
      name: 'Crash-Tor (Schiebe-/Drehtor)',
      short: 'Crash-Tor',
      lead: 'Schwer-Stahltor, mit gegründetem Riegel ins Fundament. Manueller oder motorischer Betrieb. Stoppt 7,5-t-LKW bei 50–80 km/h.',
      norms: ['PAS 68 (V/7500 [N2])', 'IWA 14-1'],
      stops: 'PKW · Transporter · LKW bis 7,5 t',
      kineticMJ: 1.85,
      typPlace: 'Kasernen · Industrie-Werkstore · KRITIS',
      color: '#22d3ee',
    },
    {
      key: 'gate-arm',
      icon: 'fa-minus',
      name: 'Drehbalken-Schranke (Hochsicherheit)',
      short: 'Schranke HVM',
      lead: 'Verstärkte Schranke mit Stahlseil im Balken, gegründete Pfosten. Bremst ein 2,5-t-Fahrzeug bei 64 km/h.',
      norms: ['PAS 68 V/2500 [N1]'],
      stops: 'PKW · Transporter',
      kineticMJ: 0.40,
      typPlace: 'Zufahrten · Parkhäuser · Werkstore',
      color: '#fbbf24',
    },
    {
      key: 'tire-killer',
      icon: 'fa-burst',
      name: 'Reifentöter (Tyre-Killer)',
      short: 'Reifentöter',
      lead: 'Aufstellbare Stahlzacken im Boden – durchschlagen Reifen + Felgen bei Auffahrt. Halten Fahrzeuge nicht direkt, aber sofortiges Stehenbleiben durch Felgen-Auflage.',
      norms: ['ASTM F2656', 'CEN 1317'],
      stops: 'PKW · Transporter (Reifen-Defekt)',
      kineticMJ: 0.30,
      typPlace: 'Werks-Ausfahrten · Mautstellen · Gegenrichtungs-Schutz',
      color: '#dc2626',
    },
    {
      key: 'cushion',
      icon: 'fa-cubes',
      name: 'Mobiles Sperrkissen / Mobile Barrier',
      short: 'Mobil-Sperre',
      lead: 'Schwerer Stahl-Block, zwischen 800–4500 kg. Wird per LKW gestellt – temporär für Events (Weihnachtsmarkt, Demo).',
      norms: ['IWA 14-1', 'PAS 68'],
      stops: 'PKW · Transporter (je nach Gewicht auch LKW)',
      kineticMJ: 1.10,
      typPlace: 'Events · Weihnachtsmärkte · Volksfeste · temporäre Veranstaltungen',
      color: '#22c55e',
    },
    {
      key: 'planter',
      icon: 'fa-seedling',
      name: 'Pflanzkübel / Stadtmöbel',
      short: 'Pflanzkübel',
      lead: 'Massivkonstruktion aus Beton/Stahl mit Bepflanzung. Wirkt als Sperre, sieht aber freundlich aus – urbane Tarnung.',
      norms: ['PAS 68'],
      stops: 'PKW',
      kineticMJ: 0.40,
      typPlace: 'Innenstädte · Plätze · Fußgängerzonen',
      color: '#65a30d',
    },
    {
      key: 'bench',
      icon: 'fa-couch',
      name: 'Hochsicherheits-Sitzbank',
      short: 'Crash-Bank',
      lead: 'Stahlkern in massiver Bank. Verschmilzt mit Stadtmöbel-Design – stoppt PKW bei 50 km/h.',
      norms: ['PAS 68'],
      stops: 'PKW',
      kineticMJ: 0.40,
      typPlace: 'Innenstädte · Plätze · Marktbereiche',
      color: '#84cc16',
    },
    {
      key: 'ditch',
      icon: 'fa-water',
      name: 'Graben / Natur-Hindernis',
      short: 'Graben',
      lead: 'Künstlicher Graben (1,5–2 m tief, 3 m breit) oder Wassergraben. Permanent, wartungsarm, optisch unauffällig.',
      norms: ['—'],
      stops: 'Alle Fahrzeuge',
      kineticMJ: 2.50,
      typPlace: 'Militär · Botschaften · Industrie-Perimeter',
      color: '#0891b2',
    },
    {
      key: 'zigzag',
      icon: 'fa-route',
      name: 'Verkehrs-Schikane (Slalom)',
      short: 'Schikane',
      lead: 'Versetzte Poller/Beton-Elemente zwingen das Fahrzeug zum Schritttempo. Verhindert Anlauf-Geschwindigkeit.',
      norms: ['CWA 16221'],
      stops: 'Reduziert auf < 20 km/h',
      kineticMJ: 0.05,
      typPlace: 'Zufahrten · Lieferanteneingänge · KRITIS-Ausfahrten',
      color: '#fbbf24',
    },
    {
      key: 'cable',
      icon: 'fa-grip-lines',
      name: 'Stahlseil-Sperre',
      short: 'Stahlseil',
      lead: 'Gespanntes Stahlseil zwischen tief gegründeten Posten. Fängt das Fahrzeug ein wie ein Netz.',
      norms: ['ASTM F2656 K4 / K8'],
      stops: 'PKW · Transporter · LKW (je nach Auslegung)',
      kineticMJ: 0.80,
      typPlace: 'Mittelstreifen Autobahn · Militär · Industrie',
      color: '#94a3b8',
    },
  ];

  /* ============ Hersteller ============ */
  const HERSTELLER = [
    {
      group: 'Anti-Ram-Poller & Wedge-Barriers (PAS 68 / IWA 14-1)',
      color: '#ef4444',
      firms: [
        { n: 'ATG Access', land: 'UK', spec: 'Marktführer Hochsicherheits-Poller, Pas 68 K12, militärisch zugelassen.', klassen: 'PAS 68 / IWA 14-1', tag: 'Top', web: 'atgaccess.com' },
        { n: 'Heald Ltd', land: 'UK', spec: 'Custom Crash-Poller, FORT/HT2 Wedge, mobile Lösungen.', klassen: 'PAS 68 V/7500', tag: 'Highend', web: 'heald.uk.com' },
        { n: 'Avon Barrier', land: 'UK · Bristol', spec: 'Anti-Ram-Schranken, AvonGuard versenkbare Poller.', klassen: 'PAS 68 / IWA 14-1', tag: 'Highend', web: 'avon-barrier.com' },
        { n: 'Frontier Pitts', land: 'UK', spec: 'Compact Terra Blocker, Truckstopper, breite Bandbreite.', klassen: 'PAS 68', tag: 'Top', web: 'frontierpitts.com' },
        { n: 'Hörmann', land: 'DE · Steinhagen', spec: 'Industrie-Crash-Tore HSE-Serie, Schiebe-/Anschlagtore.', klassen: 'PAS 68', tag: 'Top', web: 'hoermann.com' },
        { n: 'FAAC', land: 'IT', spec: 'J355 HA Anti-Ram-Poller, hydraulische Hochsicherheit.', klassen: 'PAS 68 V/7500', tag: 'Top', web: 'faac.de' },
        { n: 'Heras', land: 'NL/DE', spec: 'High-Security-Zäune + Crash-Tore.', klassen: 'PAS 68', tag: 'Top', web: 'heras.com' },
        { n: 'Marshalls', land: 'UK', spec: 'RhinoGuard Stadtmöbel-Poller mit PAS 68 Kern.', klassen: 'PAS 68', tag: '', web: 'marshalls.co.uk' },
        { n: 'Pitagone (Pollenex)', land: 'BE', spec: 'Mobile temporäre Sperren für Events.', klassen: 'IWA 14-1', tag: '', web: 'pitagone.com' },
        { n: 'Pas68.de (Securiton)', land: 'DE', spec: 'Versenkbare und feste Crash-Poller-Programme.', klassen: 'PAS 68', tag: '', web: 'pas68.de' },
        { n: 'KASI (Kaiser Sicherheit)', land: 'DE', spec: 'Massivpoller, Stadtmöbel mit Crash-Kern.', klassen: 'PAS 68', tag: '', web: 'kasi-poller.de' },
      ],
    },
    {
      group: 'Versenkbare Standard-Poller (K4–K8, Stadt)',
      color: '#f97316',
      firms: [
        { n: 'BFT', land: 'IT', spec: 'STOPPY Hydraulik-Poller, Stadt + Privat.', klassen: 'K4 – K8', tag: 'Top', web: 'bft-automation.com' },
        { n: 'CAME', land: 'IT', spec: 'GARD-Schranken + automatische Poller.', klassen: 'K4', tag: '', web: 'came.com' },
        { n: 'Magnetic Autocontrol', land: 'DE · Schopfheim', spec: 'Schranken + Pollersysteme für Industrie.', klassen: 'EN 12453', tag: '', web: 'magnetic-access.com' },
        { n: 'Pilomat', land: 'IT', spec: 'Hochfeste Hydraulikpoller, sehr schnelle Heb-Geschwindigkeit.', klassen: 'PAS 68 / K12', tag: 'Highend', web: 'pilomat.com' },
        { n: 'Beckers Bollards', land: 'DE/NL', spec: 'Versenkbare und feste Stadtpoller.', klassen: 'PAS 68 / K12', tag: '', web: 'beckersbollards.com' },
        { n: 'Bremicker Verkehrstechnik', land: 'DE · Bottrop', spec: 'Verkehrs- und Stadtmöbel-Poller (DIN/CE).', klassen: '—', tag: '', web: 'bremicker-vt.de' },
      ],
    },
    {
      group: 'Crash-Tore & Schranken',
      color: '#22d3ee',
      firms: [
        { n: 'Hörmann HSE', land: 'DE', spec: 'Schiebe-Crash-Tore für Werk-/Militärtore.', klassen: 'PAS 68', tag: 'Top', web: 'hoermann.com' },
        { n: 'Heras Mistral', land: 'NL', spec: 'Schiebetor mit PAS 68 N2 7,5 t bei 50 km/h.', klassen: 'PAS 68 V/7500 [N2]', tag: 'Top', web: 'heras.com' },
        { n: 'Frontier Pitts Terra', land: 'UK', spec: 'Terra Sliding Gate Plus, IWA 14-1.', klassen: 'IWA 14-1', tag: 'Top', web: 'frontierpitts.com' },
        { n: 'FAAC 950N2', land: 'IT', spec: 'Schiebe-Schwerlast-Tore mit Crash-Test.', klassen: 'PAS 68', tag: '', web: 'faac.de' },
        { n: 'Came STYLO', land: 'IT', spec: 'Crash-Schranken für Park- und Industriezufahrten.', klassen: 'PAS 68 V/2500', tag: '', web: 'came.com' },
        { n: 'Nice S.p.A.', land: 'IT', spec: 'Schrankensysteme inkl. Hochsicherheit.', klassen: 'CE / EN 12453', tag: '', web: 'niceforyou.com' },
      ],
    },
    {
      group: 'Mobile Sperrkissen & Event-Schutz',
      color: '#22c55e',
      firms: [
        { n: 'Pitagone P36 / P56', land: 'BE', spec: 'Mobile leichte Sperren für temporäre Events.', klassen: 'IWA 14-1', tag: 'Top', web: 'pitagone.com' },
        { n: 'ATG Access SP400', land: 'UK', spec: 'Standalone Sperrlinie, ohne Tiefgründung.', klassen: 'IWA 14-1', tag: 'Top', web: 'atgaccess.com' },
        { n: 'Hörmann LB55', land: 'DE', spec: 'Mobile Stahl-Sperre, modular kuppelbar.', klassen: 'PAS 68', tag: '', web: 'hoermann.com' },
        { n: 'Heald HT1 Mantis', land: 'UK', spec: 'Mobiler Wedge-Sperrkamm für Veranstaltungen.', klassen: 'PAS 68 V/7500', tag: 'Highend', web: 'heald.uk.com' },
        { n: 'Securiton DefenderCity', land: 'DE/CH', spec: 'Innenstadt-Sperrkonzepte für Weihnachtsmärkte.', klassen: 'IWA 14-1', tag: '', web: 'securiton.de' },
        { n: 'Carbon Solutions', land: 'AT', spec: 'Mobile Event-Sperrlinien, schnelle Aufstellung.', klassen: 'IWA 14-1', tag: '', web: 'carbon.at' },
      ],
    },
    {
      group: 'Stadtmöbel als Sperre (urbane Tarnung)',
      color: '#65a30d',
      firms: [
        { n: 'Marshalls RhinoGuard', land: 'UK', spec: 'Bänke, Poller, Pflanzkübel mit PAS-68-Kern.', klassen: 'PAS 68', tag: 'Top', web: 'marshalls.co.uk' },
        { n: 'Hardstaff Barriers', land: 'UK', spec: 'Surface-mount Barriers (kein Aufgraben).', klassen: 'PAS 68', tag: '', web: 'hardstaffbarriers.com' },
        { n: 'Streetspace', land: 'UK', spec: 'Sitzbänke und Stadtmöbel mit Crash-Schutz.', klassen: 'PAS 68', tag: '', web: 'streetspace.uk.com' },
        { n: 'Fineline Aluminium', land: 'UK', spec: 'Pflanzkübel mit eingebautem Stahlkern.', klassen: 'PAS 68', tag: '', web: 'finelinealuminium.co.uk' },
      ],
    },
    {
      group: 'Reifentöter & Spezialsperren',
      color: '#dc2626',
      firms: [
        { n: 'Heald TPK / Pitstop', land: 'UK', spec: 'Reifentöter, manuell oder automatisch.', klassen: 'ASTM F2656', tag: 'Top', web: 'heald.uk.com' },
        { n: 'Avon TPK', land: 'UK', spec: 'Klappbare Stahlzacken-Sperre.', klassen: 'PAS 68', tag: '', web: 'avon-barrier.com' },
        { n: 'ATG Access', land: 'UK', spec: 'Klappdorne (Tiger Teeth).', klassen: 'PAS 68', tag: '', web: 'atgaccess.com' },
        { n: 'Pollenex', land: 'BE', spec: 'Mobile Reifensperren.', klassen: 'IWA 14-1', tag: '', web: 'pitagone.com' },
      ],
    },
  ];

  /* ============ Animation: LKW gegen Sperre ============ */
  function renderCrashAnim() {
    const wrap = el('div', { class: 'hvm-anim-card' });
    wrap.appendChild(el('div', { class: 'hvm-anim-head' }, [
      el('h3', { html: '<i class="fas fa-truck-arrow-right"></i> Crash-Test · Live' }),
      el('p', { text: 'Wähle eine Sperr-Art und ein Fahrzeug, schieb am Tempo-Regler und schau zu, ob es hält. Energie wird live nach E = ½ · m · v² berechnet.' }),
    ]));
    const W = 600, H = 230;
    const canvas = el('canvas', { class: 'hvm-canvas', width: W, height: H });
    const ctx = canvas.getContext('2d');
    wrap.appendChild(canvas);

    /* Steuerung */
    let activeType = 'bollard-fixed';
    let activeVehicle = { name: 'LKW 7,5 t', m: 7500, icon: '🚚' };
    let speedKmh = 50;
    let trigger = null;   // {start, hit, max} – Wechsel = neuer Lauf
    let outcome = null;   // 'stop' / 'pass'

    // Type-Buttons
    const typeRow = el('div', { class: 'hvm-typerow' });
    TYPES.forEach(t => {
      const b = el('button', { class: 'hvm-typebtn' + (t.key === activeType ? ' on' : ''), type: 'button', dataset: { k: t.key }, style: `--c:${t.color}` });
      b.innerHTML = `<i class="fas ${t.icon}"></i> ${t.short}`;
      b.addEventListener('click', () => { activeType = t.key; updateType(); startRun(); });
      typeRow.appendChild(b);
    });
    wrap.appendChild(typeRow);

    // Vehicle + Speed
    const ctrl = el('div', { class: 'hvm-ctrl' });
    const vehicles = [
      { name: 'PKW (1,5 t)', m: 1500, icon: '🚗' },
      { name: 'Transporter (3,5 t)', m: 3500, icon: '🚐' },
      { name: 'LKW 7,5 t', m: 7500, icon: '🚚' },
      { name: 'LKW 30 t', m: 30000, icon: '🚛' },
    ];
    const vRow = el('div', { class: 'hvm-vrow' });
    vehicles.forEach((v, i) => {
      const b = el('button', { class: 'hvm-vbtn' + (v.name === activeVehicle.name ? ' on' : ''), type: 'button' });
      b.innerHTML = `${v.icon} <span>${v.name}</span>`;
      b.addEventListener('click', () => { activeVehicle = v; vRow.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); startRun(); });
      vRow.appendChild(b);
    });
    const speedLabel = el('span', { class: 'hvm-speed-val', text: '50 km/h' });
    const speed = el('input', { type: 'range', min: '10', max: '110', step: '5', value: '50', class: 'hvm-slider' });
    speed.addEventListener('input', () => { speedKmh = +speed.value; speedLabel.textContent = speedKmh + ' km/h'; startRun(); });
    const btnGo = el('button', { class: 'hvm-go', html: '<i class="fas fa-play"></i> Test starten' });
    btnGo.addEventListener('click', startRun);

    ctrl.appendChild(vRow);
    ctrl.appendChild(el('div', { class: 'hvm-speed' }, [
      el('label', { text: 'Tempo:' }),
      speed,
      speedLabel,
      btnGo,
    ]));
    wrap.appendChild(ctrl);

    // Live-Werte unten
    const stats = el('div', { class: 'hvm-stats' });
    wrap.appendChild(stats);

    // Status-Box
    const status = el('div', { class: 'hvm-status' });
    wrap.appendChild(status);

    function getType() { return TYPES.find(t => t.key === activeType); }
    function energyMJ() {
      const v = speedKmh / 3.6;
      return 0.5 * activeVehicle.m * v * v / 1e6;
    }
    function updateType() {
      typeRow.querySelectorAll('.hvm-typebtn').forEach(b => b.classList.toggle('on', b.dataset.k === activeType));
    }
    function startRun() {
      trigger = { start: performance.now(), hit: null, max: 4000 };
      outcome = null;
    }
    startRun();

    function draw(now) {
      if (!canvas.isConnected) return;
      const t = (now - trigger.start) / 1000;  // seconds elapsed
      const type = getType();
      // Fahrzeug fährt von rechts nach links
      const startX = W - 60;
      const targetX = W * 0.50;
      const px = Math.max(targetX, startX - (speedKmh * 6) * t);
      const hit = px <= targetX + 1;
      if (hit && !trigger.hit) {
        trigger.hit = now;
        // Entscheidung: hält die Sperre die Energie?
        const e = energyMJ();
        outcome = (e <= type.kineticMJ * 1.2) ? 'stop' : 'pass';
      }

      ctx.clearRect(0, 0, W, H);
      // Hintergrund
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b1424'); g.addColorStop(1, '#060a13');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Boden
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, H - 30, W, 30);
      ctx.fillStyle = '#334155';
      for (let i = 0; i < W; i += 30) ctx.fillRect(i, H - 24, 18, 3);

      // Sperre zeichnen (links der Aufprall-Linie)
      drawBarrier(ctx, type, targetX, H - 30, trigger.hit ? (now - trigger.hit) / 1000 : 0, outcome);

      // Fahrzeug
      drawVehicle(ctx, activeVehicle, px + (outcome === 'pass' && trigger.hit ? -(now - trigger.hit) / 1000 * 30 : 0), H - 30, t, trigger.hit ? (now - trigger.hit) / 1000 : 0, outcome);

      // Energie-Bar oben
      const e = energyMJ();
      const cap = type.kineticMJ;
      const ratio = Math.min(1.5, e / cap);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(20, 14, W - 40, 14);
      ctx.fillStyle = ratio > 1 ? '#ef4444' : '#22c55e';
      ctx.fillRect(20, 14, Math.min(1, ratio) * (W - 40), 14);
      if (ratio > 1) {
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        const overshoot = Math.min(1, (ratio - 1) / 0.5) * (W - 40);
        ctx.strokeRect(20, 14, overshoot, 14);
      }
      // Marker bei Kapazität
      const capX = 20 + (1 / Math.max(1, ratio)) * (W - 40);
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(20 + (W - 40), 12); ctx.lineTo(20 + (W - 40), 30); ctx.stroke();
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'right';
      ctx.fillText('Kapazität', W - 22, 10);
      ctx.textAlign = 'left'; ctx.fillStyle = '#94a3b8';
      ctx.fillText('Aufprall-Energie', 22, 10);

      stats.innerHTML = `
        <div class="hvm-stat"><span>Tempo</span><strong>${speedKmh} km/h</strong></div>
        <div class="hvm-stat"><span>Masse</span><strong>${(activeVehicle.m/1000).toFixed(1)} t</strong></div>
        <div class="hvm-stat"><span>Energie</span><strong style="color:${ratio>1?'#ef4444':'#22c55e'}">${e.toFixed(2)} MJ</strong></div>
        <div class="hvm-stat"><span>Sperre hält bis</span><strong>${cap.toFixed(2)} MJ</strong></div>`;

      if (trigger.hit) {
        if (outcome === 'stop') {
          status.className = 'hvm-status hvm-status-ok';
          status.textContent = '✅ Sperre hält. Fahrzeug abrupt gestoppt. Insassen-Verletzungen sind sehr wahrscheinlich, aber das geschützte Objekt bleibt unberührt.';
        } else {
          status.className = 'hvm-status hvm-status-bad';
          status.textContent = '⛔ Sperre überlastet. Fahrzeug durchbricht oder wird auf der Sperre durchgeschleudert. → höhere Klasse oder Schikane davorsetzen.';
        }
      } else {
        status.className = 'hvm-status';
        status.textContent = `Anfahrt mit ${speedKmh} km/h … Aufprall in ${Math.max(0, (targetX - (px - 60)) / (speedKmh * 6)).toFixed(1)} s`;
      }
      // Loop / Restart nach 5s
      if (trigger.hit && (now - trigger.hit) / 1000 > 4) startRun();
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    return wrap;
  }

  function drawBarrier(ctx, type, x, ground, sinceHit, outcome) {
    // Schäden zeigen
    const tilt = (outcome === 'pass' && sinceHit > 0) ? Math.min(1, sinceHit / 0.6) * 0.6 : 0;
    ctx.save(); ctx.translate(x, ground); ctx.rotate(tilt);
    const col = outcome === 'stop' ? '#22c55e' : (outcome === 'pass' ? '#ef4444' : type.color);
    switch (type.key) {
      case 'bollard-fixed': {
        ctx.fillStyle = col; ctx.fillRect(-10, -90, 20, 90);
        ctx.fillStyle = '#1e293b'; ctx.fillRect(-12, -10, 24, 10);
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(-10, -75, 20, 4); ctx.fillRect(-10, -55, 20, 4);
        break;
      }
      case 'bollard-retract': {
        const up = outcome !== 'pass';
        const h = up ? 60 : 10;
        ctx.fillStyle = col; ctx.fillRect(-10, -h, 20, h);
        ctx.fillStyle = '#1e293b'; ctx.fillRect(-14, -8, 28, 8);
        ctx.fillStyle = '#22d3ee'; ctx.fillRect(-9, -h + 4, 18, 3);
        break;
      }
      case 'wedge': {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(25, 0); ctx.lineTo(25, -50); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case 'gate': {
        ctx.fillStyle = col; ctx.fillRect(-50, -110, 100, 110);
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
        for (let i = 1; i < 5; i++) {
          ctx.beginPath(); ctx.moveTo(-50, -22 * i); ctx.lineTo(50, -22 * i); ctx.stroke();
        }
        break;
      }
      case 'gate-arm': {
        ctx.fillStyle = col; ctx.fillRect(-5, -90, 10, 90);
        ctx.fillRect(-90, -65, 180, 8);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-86, -64, 4, 6); ctx.fillRect(82, -64, 4, 6);
        break;
      }
      case 'tire-killer': {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(-40, -8, 80, 8);
        ctx.fillStyle = col;
        for (let i = -40; i < 40; i += 10) {
          ctx.beginPath(); ctx.moveTo(i, -8); ctx.lineTo(i + 5, -22); ctx.lineTo(i + 10, -8); ctx.closePath(); ctx.fill();
        }
        break;
      }
      case 'cushion': {
        ctx.fillStyle = col; ctx.fillRect(-35, -45, 70, 45);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.strokeRect(-35, -45, 70, 45);
        ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('LB55', 0, -20);
        break;
      }
      case 'planter': {
        ctx.fillStyle = '#92400e'; ctx.fillRect(-40, -40, 80, 40);
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(-40, -40, 80, 40);
        ctx.fillStyle = '#65a30d';
        for (let i = -30; i < 35; i += 8) {
          ctx.beginPath(); ctx.arc(i, -45, 5, 0, 7); ctx.fill();
        }
        break;
      }
      case 'bench': {
        ctx.fillStyle = col; ctx.fillRect(-50, -30, 100, 10);
        ctx.fillStyle = '#475569'; ctx.fillRect(-46, -20, 6, 20); ctx.fillRect(40, -20, 6, 20);
        break;
      }
      case 'ditch': {
        ctx.fillStyle = '#0c1929';
        ctx.beginPath();
        ctx.moveTo(-50, 0); ctx.lineTo(-20, 30); ctx.lineTo(20, 30); ctx.lineTo(50, 0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(-25, 22, 50, 6);
        break;
      }
      case 'zigzag': {
        ctx.fillStyle = col;
        for (let i = -50; i <= 50; i += 25) {
          ctx.beginPath(); ctx.arc(i, -10, 6, 0, 7); ctx.fill();
        }
        break;
      }
      case 'cable': {
        ctx.fillStyle = '#475569';
        ctx.fillRect(-80, -55, 6, 55); ctx.fillRect(74, -55, 6, 55);
        ctx.strokeStyle = col; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-80, -45); ctx.lineTo(80, -45); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-80, -30); ctx.lineTo(80, -30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-80, -15); ctx.lineTo(80, -15); ctx.stroke();
        break;
      }
    }
    ctx.restore();
    // Boden-Marker
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 1, ground - 4, 2, 4);
  }

  function drawVehicle(ctx, v, x, ground, t, sinceHit, outcome) {
    const wobble = (sinceHit > 0 && outcome === 'stop') ? Math.sin(sinceHit * 30) * Math.max(0, 8 - sinceHit * 16) : 0;
    ctx.save(); ctx.translate(x + wobble, ground);
    ctx.font = (v.m > 20000 ? '60px' : (v.m > 5000 ? '52px' : (v.m > 2000 ? '44px' : '40px'))) + ' sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(v.icon, 0, -2);
    ctx.restore();
    // Schaden bei Stop
    if (sinceHit > 0 && outcome === 'stop' && sinceHit < 1) {
      ctx.fillStyle = '#ef4444'; ctx.font = '32px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('💥', x - 30, ground - 40);
    }
  }

  /* ============ Hersteller-Liste rendern ============ */
  function renderHerstellerCard(data) {
    const wrap = el('div', { class: 'hvm-hst-card', style: `--c:${data.color}` });
    wrap.appendChild(el('div', { class: 'hvm-hst-head' }, [
      el('div', { class: 'hvm-hst-ico', html: '<i class="fas fa-industry"></i>' }),
      el('h3', { text: data.group }),
      el('span', { class: 'hvm-hst-count', text: data.firms.length + ' Hersteller' }),
    ]));
    const grid = el('div', { class: 'hvm-hst-grid' });
    data.firms.forEach(f => {
      const card = el('div', { class: 'hvm-hst-firm' + (f.tag === 'Top' ? ' top' : (f.tag === 'Highend' ? ' highend' : '')) });
      if (f.tag) card.appendChild(el('span', { class: 'hvm-hst-tag', text: f.tag }));
      card.appendChild(el('div', { class: 'hvm-hst-firm-head' }, [
        el('strong', { text: f.n }),
        el('span', { class: 'hvm-hst-firm-land', text: f.land }),
      ]));
      card.appendChild(el('p', { class: 'hvm-hst-firm-spec', text: f.spec }));
      if (f.klassen) card.appendChild(el('div', { class: 'hvm-hst-firm-klass', text: f.klassen }));
      if (f.web) {
        const a = el('a', { class: 'hvm-hst-firm-web', href: 'https://' + f.web, target: '_blank', rel: 'noopener', html: '<i class="fas fa-globe"></i> ' + f.web });
        card.appendChild(a);
      }
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  /* ============ Typen-Übersicht ============ */
  function renderTypesOverview() {
    const wrap = el('div', { class: 'hvm-types-card' });
    wrap.appendChild(el('h3', { html: '<i class="fas fa-list"></i> Alle Sperr-Arten im Überblick' }));
    const grid = el('div', { class: 'hvm-types-grid' });
    TYPES.forEach(t => {
      const c = el('div', { class: 'hvm-type', style: `--c:${t.color}` });
      c.appendChild(el('div', { class: 'hvm-type-ic', html: `<i class="fas ${t.icon}"></i>` }));
      c.appendChild(el('h4', { text: t.name }));
      c.appendChild(el('p', { text: t.lead }));
      const tags = el('div', { class: 'hvm-type-tags' });
      t.norms.forEach(n => tags.appendChild(el('span', { class: 'hvm-type-norm', text: n })));
      c.appendChild(tags);
      c.appendChild(el('div', { class: 'hvm-type-stops' }, [
        el('span', { html: '<i class="fas fa-truck-arrow-right"></i> Stoppt' }),
        el('strong', { text: t.stops }),
      ]));
      c.appendChild(el('div', { class: 'hvm-type-place' }, [
        el('span', { html: '<i class="fas fa-location-dot"></i> Einsatz' }),
        el('em', { text: t.typPlace }),
      ]));
      grid.appendChild(c);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  /* ============ Hauptview ============ */
  function view() {
    const root = el('div', { class: 'hvm-wrap' });
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Technik · Perimeter' }),
      el('h1', { html: '🛡 Anti-Terror-Sperren · HVM' }),
      el('p', { text: 'Hostile Vehicle Mitigation: Poller, Sperrkissen, Crash-Tore, Reifentöter und mehr. Mit Live-Crash-Test und Hersteller-Verzeichnis nach Normen PAS 68 · IWA 14-1 · ASTM F2656.' }),
    ]));
    // Tabs
    const tabs = el('div', { class: 'hvm-tabs' });
    let active = 'crash';
    const stage = el('div', { class: 'hvm-stage' });
    function setActive(k) {
      active = k;
      tabs.querySelectorAll('.hvm-tab').forEach(t => t.classList.toggle('on', t.dataset.k === k));
      stage.innerHTML = '';
      if (k === 'crash') {
        stage.appendChild(renderCrashAnim());
        stage.appendChild(renderTypesOverview());
      } else if (k === 'hst') {
        HERSTELLER.forEach(g => stage.appendChild(renderHerstellerCard(g)));
      }
    }
    [['crash', '💥 Crash-Test & Arten', '#ef4444'], ['hst', '🏭 Hersteller', '#22d3ee']].forEach(([k, lbl, c]) => {
      const b = el('button', { class: 'hvm-tab' + (k === active ? ' on' : ''), type: 'button', dataset: { k }, text: lbl, style: `--c:${c}` });
      b.addEventListener('click', () => setActive(k));
      tabs.appendChild(b);
    });
    root.appendChild(tabs); root.appendChild(stage);
    setActive('crash');
    return root;
  }

  return { view };
})();
