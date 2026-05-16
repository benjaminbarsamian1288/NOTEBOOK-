/* Hersteller- & Fachfirmen-Datenbank für mechanische Sicherheit */

window.HERSTELLER = (() => {

  const DB = {
    // ============ TÜREN ============
    tueren: {
      title: 'Türen-Hersteller (DIN EN 1627)',
      groups: [
        {
          name: 'Stahl- & Sicherheitstüren',
          color: '#7c3aed',
          firms: [
            { n:'Hörmann', land:'DE · Steinhagen', spec:'Marktführer Industrie- & Sicherheitstüren', klassen:'RC2 — RC4', tag:'Top' },
            { n:'Teckentrup', land:'DE · Verl', spec:'Sicherheitstüren, Brand-/Rauchschutz', klassen:'RC2 — RC4', tag:'' },
            { n:'Schörghuber Spezialtüren', land:'DE · Ampfing', spec:'Hochsicherheits-Holztüren', klassen:'RC2 — RC6', tag:'' },
            { n:'Pilz GmbH', land:'DE · Berlin', spec:'Stahl-Sicherheitstüren', klassen:'RC2 — RC4', tag:'' },
            { n:'Jeld-Wen', land:'DK/DE', spec:'Holzsicherheitstüren', klassen:'RC1N — RC3', tag:'' },
            { n:'Westag', land:'DE · Rheda-Wiedenbrück', spec:'Holztüren, Brandschutz', klassen:'RC2 — RC3', tag:'' },
            { n:'KSI Köhler', land:'DE · Berlin', spec:'Hochsicherheits-Stahltüren', klassen:'RC4 — RC6', tag:'Highend' },
            { n:'BOS Sicherheitstüren', land:'DE', spec:'Bankraum-/Tresorraumtüren', klassen:'EN 1143-1', tag:'Highend' },
          ],
        },
        {
          name: 'Beschläge & Schließtechnik',
          color: '#a855f7',
          firms: [
            { n:'ABUS', land:'DE · Wetter', spec:'Schlösser, Zylinder, Stangenschlösser', klassen:'VdS BZ+', tag:'Top' },
            { n:'BKS Sicherheitstechnik', land:'DE · Velbert', spec:'Mehrfachverriegelung, Zylinder', klassen:'VdS A — BZ+', tag:'Top' },
            { n:'KFV (Karl Fliether)', land:'DE · Velbert', spec:'Mehrfachverriegelung-Spezialist', klassen:'RC2 — RC6', tag:'Top' },
            { n:'WINKHAUS', land:'DE · Telgte', spec:'Schlösser, Beschläge, Schließsysteme', klassen:'VdS-zertifiziert', tag:'' },
            { n:'DOM Sicherheitstechnik', land:'DE · Brühl', spec:'Schließzylinder, Schließanlagen', klassen:'VdS BZ+', tag:'' },
            { n:'ASSA ABLOY', land:'SE/DE', spec:'Globaler Schließtechnik-Konzern', klassen:'EN-Klassen', tag:'Top' },
            { n:'ROTO Frank', land:'DE · Leinfelden', spec:'Fenster-/Türbeschläge', klassen:'RC2 — RC3', tag:'' },
            { n:'GEZE', land:'DE · Leonberg', spec:'Automatiktüren, Türschließer', klassen:'EN 179/1125', tag:'' },
            { n:'Mottura', land:'IT', spec:'Premium-Schlösser', klassen:'EN 1300', tag:'Highend' },
            { n:'Mauer Locking Systems', land:'DE', spec:'Hochsicherheits-Schlösser', klassen:'EN 1300 D', tag:'Highend' },
          ],
        },
      ],
    },

    // ============ TORE ============
    tore: {
      title: 'Tor-, Schranken- & Antriebshersteller',
      groups: [
        {
          name: 'Industrie-Tore & Schiebetore',
          color: '#0891b2',
          firms: [
            { n:'Hörmann', land:'DE · Steinhagen', spec:'Industrie-Sektional-, Schiebe-, Drehflügeltore', klassen:'EN 13241', tag:'Top' },
            { n:'Teckentrup', land:'DE · Verl', spec:'Sektional-, Roll-, Schiebetore', klassen:'EN 13241', tag:'Top' },
            { n:'Heras', land:'NL/DE', spec:'Hochsicherheits-Schiebetore, Drehkreuze', klassen:'PAS 68 / K12', tag:'Highend' },
            { n:'Berner Torantriebe', land:'DE · Verl', spec:'Tor- & Schrankenantriebe', klassen:'BG-zertifiziert', tag:'' },
            { n:'SOMMER Antriebs- & Funktechnik', land:'DE · Kirchheim', spec:'Garagen- & Schiebetorantriebe', klassen:'EN 12453', tag:'' },
            { n:'Marantec', land:'DE · Marienfeld', spec:'Antriebe für Tore & Schranken', klassen:'EN 12453', tag:'' },
            { n:'Wisniowski', land:'PL', spec:'Industrie- & Garagen-Tore', klassen:'EN 13241', tag:'' },
            { n:'Gilgen Door Systems', land:'CH', spec:'Automatik-, Schiebe-, Drehkreuze', klassen:'EN 16005', tag:'' },
          ],
        },
        {
          name: 'Schranken & Anti-Ram',
          color: '#06b6d4',
          firms: [
            { n:'FAAC', land:'IT', spec:'Schranken, Schiebetorantriebe, Poller', klassen:'PAS 68', tag:'Top' },
            { n:'CAME', land:'IT', spec:'Tore, Schranken, Parkmanagement', klassen:'EN 12453', tag:'Top' },
            { n:'Magnetic Autocontrol', land:'DE · Schopfheim', spec:'Industrieschranken, Parkhaus', klassen:'EN 13241', tag:'' },
            { n:'Nice', land:'IT', spec:'Tor- & Schrankenantriebe', klassen:'EN 12453', tag:'' },
            { n:'Avon Barrier', land:'UK', spec:'Hochsicherheits-Schranken (Anti-Terror)', klassen:'PAS 68 / IWA 14', tag:'Highend' },
          ],
        },
        {
          name: 'Drehkreuze & Personenschleusen',
          color: '#0e7490',
          firms: [
            { n:'Magnetic Access', land:'DE', spec:'Drehkreuze, Schleusen, Boarding-Gates', klassen:'EN 16005', tag:'' },
            { n:'Boon Edam', land:'NL', spec:'Sicherheitsdrehkreuze, Karuselltüren', klassen:'EN 16005', tag:'Top' },
            { n:'Gunnebo', land:'SE', spec:'Personenschleusen, Anti-Tailgating', klassen:'EN 16005', tag:'Top' },
            { n:'KABA / dormakaba', land:'CH/DE', spec:'Schleusen, Zutrittskontrolle', klassen:'EN 16005', tag:'Top' },
          ],
        },
      ],
    },

    // ============ ZÄUNE ============
    zaeune: {
      title: 'Zaunhersteller & Sicherheitszäune',
      groups: [
        {
          name: 'Standard- & Industriezäune',
          color: '#22c55e',
          firms: [
            { n:'Betafence', land:'BE/DE', spec:'Doppelstabmatten, Industriezäune', klassen:'EN 13241', tag:'Top' },
            { n:'Heras', land:'NL/DE', spec:'Industrie- & Hochsicherheitszäune', klassen:'Loss-Prevention Standard', tag:'Top' },
            { n:'Legi Zaunsysteme', land:'DE', spec:'Doppelstabmatten, Stabgitter', klassen:'EN 10223', tag:'' },
            { n:'AVG Bau-Chemie und Metall', land:'DE', spec:'Industriezäune', klassen:'', tag:'' },
            { n:'Sülzle Stahltechnik', land:'DE · Rosenfeld', spec:'Stahlzäune, Tore', klassen:'EN 13241', tag:'' },
            { n:'Carl Stahl', land:'DE · Süßen', spec:'Edelstahl-Netze, Architekturzäune', klassen:'', tag:'' },
          ],
        },
        {
          name: 'Hochsicherheit & Perimeter',
          color: '#16a34a',
          firms: [
            { n:'DIRICKX', land:'FR', spec:'High-Security-Zäune, Anti-Klettern', klassen:'LPS 1175', tag:'Highend' },
            { n:'Zaun-Krings', land:'DE · Aachen', spec:'Hochsicherheitszäune, JVA', klassen:'EN 12604', tag:'' },
            { n:'Kraiburg Austria', land:'AT', spec:'Hochleistungszäune, Streckmetall', klassen:'', tag:'' },
            { n:'Procter Cast Iron', land:'UK', spec:'Anti-Ram-Zäune, Industrial', klassen:'PAS 68', tag:'Highend' },
            { n:'Briefer Zaunsysteme', land:'DE', spec:'Industriezäune, NATO-Draht', klassen:'', tag:'' },
          ],
        },
        {
          name: 'Zaun-Detektion (Aktiv-Sicherung)',
          color: '#15803d',
          firms: [
            { n:'GPS Standard', land:'IT', spec:'Erschütterungs-Detektion-Kabel', klassen:'EN 50131', tag:'' },
            { n:'Geoquip', land:'UK', spec:'Glasfaser-Zaundetektion (DAS)', klassen:'EN 50131', tag:'Highend' },
            { n:'Senstar', land:'CA', spec:'Aktive Zaunsicherung, Mikrowellen', klassen:'EN 50131', tag:'' },
            { n:'Optellios', land:'US', spec:'Glasfaser-Detektion', klassen:'', tag:'' },
            { n:'Pulsar Security', land:'IT', spec:'Mikrowellen-Schranken am Zaun', klassen:'EN 50131', tag:'' },
          ],
        },
      ],
    },

    // ============ POLLER ============
    poller: {
      title: 'Poller-Hersteller (Anti-Ram & versenkbar)',
      groups: [
        {
          name: 'Anti-Ram-Poller (PAS 68 / K12)',
          color: '#ea580c',
          firms: [
            { n:'ATG Access', land:'UK', spec:'High-Security-Poller, Crash-tested K12', klassen:'PAS 68 / IWA 14-1', tag:'Top' },
            { n:'Heald Ltd', land:'UK', spec:'Hochsicherheits-Poller, Spezialprojekte', klassen:'PAS 68 K12', tag:'Highend' },
            { n:'Avon Barrier', land:'UK', spec:'Crash-Schranken, Poller', klassen:'PAS 68 / IWA 14-1', tag:'Highend' },
            { n:'Frontier Pitts', land:'UK', spec:'Anti-Ram-Poller, Schranken', klassen:'PAS 68', tag:'Top' },
            { n:'Marshalls', land:'UK', spec:'Stadtmöbel + Anti-Ram-Poller', klassen:'PAS 68', tag:'' },
            { n:'Beckers Bollards', land:'DE/NL', spec:'Versenkbare Hochsicherheits-Poller', klassen:'PAS 68', tag:'' },
          ],
        },
        {
          name: 'Versenkbare & Standard-Poller',
          color: '#dc2626',
          firms: [
            { n:'FAAC', land:'IT', spec:'Hydraulische Versenkpoller', klassen:'K4 — K8', tag:'Top' },
            { n:'CAME', land:'IT', spec:'Automatik-Poller, Stadt & Privat', klassen:'K4', tag:'' },
            { n:'Magnetic Autocontrol', land:'DE', spec:'Industriepoller, Schranken', klassen:'EN 12453', tag:'' },
            { n:'Bremicker Verkehrstechnik', land:'DE', spec:'Verkehrssicherheits-Poller', klassen:'', tag:'' },
            { n:'Lehnen Industrial Services', land:'DE', spec:'Edelstahl- & Stahlpoller', klassen:'', tag:'' },
            { n:'INOX-Color', land:'DE', spec:'Designpoller, Edelstahl', klassen:'', tag:'' },
          ],
        },
      ],
    },

    // ============ TRESORE ============
    tresore: {
      title: 'Tresor- & Wertschutzschrank-Hersteller',
      groups: [
        {
          name: 'Premium-Tresorbau (DE)',
          color: '#a855f7',
          firms: [
            { n:'BURG-WÄCHTER', land:'DE · Wetter', spec:'Möbel-, Wand-, Boden-, Waffentresore', klassen:'EN 14450 / EN 1143-1 N — V', tag:'Top' },
            { n:'Format Tresorbau', land:'DE · Hattingen', spec:'Wertschutzschränke, Datentresore', klassen:'EN 1143-1 0 — VI', tag:'Top' },
            { n:'Hartmann Tresore', land:'DE · Paderborn', spec:'Großhändler & eigene Marke', klassen:'EN 14450 / 1143-1', tag:'Top' },
            { n:'Müller Safe', land:'DE · Pinneberg', spec:'Wertschutzschränke, Bankraum', klassen:'EN 1143-1 II — VI', tag:'Highend' },
            { n:'Sistec Tresore', land:'DE · Heinsberg', spec:'Wertschutzschränke, Datensafes', klassen:'EN 14450 / 1143-1', tag:'' },
            { n:'Eisenbach Tresore', land:'DE', spec:'Möbeltresore, Waffenschränke', klassen:'EN 14450', tag:'' },
            { n:'Karl Otto Knauf', land:'DE · Diemelsee', spec:'Maßanfertigung Bankraum-Tresorraum', klassen:'EN 1143-2', tag:'Highend' },
            { n:'Westag', land:'DE', spec:'Datentresore, Brandschutz', klassen:'ECB-S S 60 P', tag:'' },
          ],
        },
        {
          name: 'Internationale Top-Marken',
          color: '#c084fc',
          firms: [
            { n:'Chubbsafes', land:'SE/UK', spec:'Globale Premium-Marke', klassen:'EN 1143-1 0 — VI', tag:'Top' },
            { n:'Phoenix Safe', land:'UK', spec:'Brandschutz- & Daten-Tresore', klassen:'EN 14450 / 1143-1', tag:'' },
            { n:'KASO Group', land:'ES', spec:'Bankraum-Tresore, Großraum', klassen:'EN 1143-1 III — VI', tag:'Highend' },
            { n:'Diplomat Safes', land:'KR', spec:'Premium-Wohntresore', klassen:'EN 14450', tag:'' },
            { n:'Yale (Salto-Gruppe)', land:'UK/ES', spec:'Smart-Tresore, Hotel-Safes', klassen:'EN 14450', tag:'' },
            { n:'Liberty Safe', land:'US', spec:'Waffen- & Wohntresore', klassen:'UL TL-30', tag:'' },
          ],
        },
        {
          name: 'Schlösser für Tresore',
          color: '#7c3aed',
          firms: [
            { n:'Wittkopp (CARL WITTKOPP)', land:'DE · Velbert', spec:'Mechanische Tresorschlösser', klassen:'EN 1300 A — D', tag:'Top' },
            { n:'Sargent & Greenleaf', land:'US', spec:'Hochsicherheits-Tresorschlösser', klassen:'UL Class 2 / EN 1300', tag:'Top' },
            { n:'LA GARD', land:'US/DE', spec:'Elektronik-Tresorschlösser, Audit-Log', klassen:'EN 1300 B+', tag:'Top' },
            { n:'KABA Mauer', land:'CH/DE', spec:'Premium-Tresorschlösser', klassen:'EN 1300 D', tag:'Highend' },
            { n:'TecnoSicurezza', land:'IT', spec:'Elektronikschlösser, Bankenmarkt', klassen:'EN 1300 B+', tag:'' },
          ],
        },
      ],
    },

    // ============ FENSTER ============
    fenster: {
      title: 'Fenster- & Sicherheitsglas-Hersteller',
      groups: [
        {
          name: 'Fenster-Systeme (Profile)',
          color: '#0891b2',
          firms: [
            { n:'Schüco', land:'DE · Bielefeld', spec:'Alu-/PVC-Sicherheitsfenster, Premium', klassen:'RC1N — RC6', tag:'Top' },
            { n:'VEKA', land:'DE · Sendenhorst', spec:'PVC-Profile, weltgrößter Hersteller', klassen:'RC1N — RC3', tag:'Top' },
            { n:'Internorm', land:'AT', spec:'Premium-Fenster (Holz/Alu/PVC)', klassen:'RC1N — RC3', tag:'Top' },
            { n:'Salamander', land:'DE · Türkheim', spec:'PVC-Profile, Sicherheitsglas-Optionen', klassen:'RC1N — RC2', tag:'' },
            { n:'Aluprof', land:'PL', spec:'Alu-Profile, Hochsicherheit MB-86 SI', klassen:'RC2 — RC4', tag:'' },
            { n:'Reynaers Aluminium', land:'BE', spec:'Alu-Sicherheitsfenster, Großformate', klassen:'RC1N — RC3', tag:'' },
            { n:'Heroal', land:'DE · Verl', spec:'Alu-Systeme, RC-zertifiziert', klassen:'RC2 — RC3', tag:'' },
            { n:'WERU', land:'DE · Rudersberg', spec:'PVC-/Alu-Fenster, Sicherheits-Optionen', klassen:'RC1N — RC3', tag:'' },
          ],
        },
        {
          name: 'Sicherheitsglas-Hersteller',
          color: '#3b82f6',
          firms: [
            { n:'Saint-Gobain (Sécurit)', land:'FR', spec:'Welt-Marktführer Sicherheitsglas', klassen:'P1A — P8B / BR1 — BR7', tag:'Top' },
            { n:'Pilkington (NSG Group)', land:'UK/JP', spec:'Sicherheits- & Beschussglas', klassen:'P1A — P8B / BR3 — BR7', tag:'Top' },
            { n:'Glas Trösch', land:'CH', spec:'Sicherheits- & Sonderverglasung', klassen:'P5A — P8B', tag:'Top' },
            { n:'Schollglas', land:'DE · Barsinghausen', spec:'VSG, Brand-, Schussglas', klassen:'P5A — P8B / EI 30 — 120', tag:'' },
            { n:'AGC Interpane', land:'JP/DE', spec:'Sonderglas, Beschuss, Sprengung', klassen:'BR1 — BR7 / EX1 — EX5', tag:'' },
            { n:'Eckelt Glas', land:'AT', spec:'Sicherheits- & Sonderglas', klassen:'P5A — P8B', tag:'' },
            { n:'arGlas (AGC Interpane Marke)', land:'DE', spec:'Hochwertige Beschuss-Verglasung', klassen:'BR3 — BR7', tag:'Highend' },
          ],
        },
        {
          name: 'Fensterbeschläge',
          color: '#06b6d4',
          firms: [
            { n:'ROTO Frank', land:'DE · Leinfelden', spec:'Pilzkopf-Beschläge, NT Designo', klassen:'RC1N — RC3', tag:'Top' },
            { n:'MACO', land:'AT · Salzburg', spec:'Beschläge, Mehrfachverr.', klassen:'RC1N — RC3', tag:'Top' },
            { n:'SIEGENIA', land:'DE · Wilnsdorf', spec:'Beschläge, automatische Verriegelung', klassen:'RC1N — RC3', tag:'Top' },
            { n:'WINKHAUS', land:'DE · Telgte', spec:'Fenster- & Türbeschläge', klassen:'RC2 — RC4', tag:'' },
            { n:'GU Gretsch-Unitas', land:'DE · Ditzingen', spec:'Beschläge, Stangenverriegelung', klassen:'RC2 — RC3', tag:'' },
          ],
        },
      ],
    },
  };

  /* ============ Fachfirmen & Spezialisten allgemein ============ */
  const FACHFIRMEN = {
    title: 'Fachfirmen · Beratung & Installation',
    groups: [
      {
        name: 'VdS-anerkannte Errichter (EMA/ZKA/Video)',
        color: '#dc2626',
        firms: [
          { n:'Securitas Technology', land:'DE/Global', spec:'EMA, Video, ZKA, Brandmeldetechnik', klassen:'VdS A — C', tag:'Top' },
          { n:'Telenot', land:'DE · Aalen', spec:'EMA-Hersteller + Errichternetz', klassen:'VdS A — C', tag:'Top' },
          { n:'Bosch Sicherheitssysteme', land:'DE', spec:'EMA-/Video-/ZKA-Komplettsysteme', klassen:'VdS A — C', tag:'Top' },
          { n:'Honeywell Security', land:'US/DE', spec:'Galaxy-EMA-Systeme', klassen:'VdS A — C', tag:'' },
          { n:'Siemens Smart Infrastructure', land:'DE', spec:'BMA, Video, ZKA Großanlagen', klassen:'VdS Großanlagen', tag:'Top' },
        ],
      },
      {
        name: 'Sicherheits-Fachgeschäfte (Endkunde)',
        color: '#a855f7',
        firms: [
          { n:'Tresore24', land:'DE · online', spec:'Tresore, Schließanlagen, Beratung', klassen:'EN 1143', tag:'' },
          { n:'Hartmann Tresore (Showroom)', land:'DE · 10 Standorte', spec:'Tresor-Showrooms in DE-Großstädten', klassen:'EN 14450 / 1143-1', tag:'Top' },
          { n:'Secureshop', land:'DE · online', spec:'Schließtechnik, Beschläge, Tresore', klassen:'', tag:'' },
          { n:'Tresor-Discount', land:'DE · online', spec:'Tresore, Schlüsselsafes', klassen:'EN 14450', tag:'' },
        ],
      },
      {
        name: 'Polizeiliche Beratung (kostenfrei)',
        color: '#3b82f6',
        firms: [
          { n:'Polizei-Beratungsstellen', land:'DE · alle Länder', spec:'Kostenlose technische Beratung', klassen:'Empfehlung RC2', tag:'Pflicht-Anlaufstelle' },
          { n:'K-EINBRUCH (BKA)', land:'DE · k-einbruch.de', spec:'Aufklärung & Förder-Infos', klassen:'', tag:'' },
        ],
      },
      {
        name: 'KfW-Förderung (Wohnen)',
        color: '#22c55e',
        firms: [
          { n:'KfW 159 Altersgerecht Umbauen', land:'DE', spec:'Kredit bis 50.000 € für Einbruchschutz', klassen:'-', tag:'Förderung' },
          { n:'KfW 455-E Investitionszuschuss', land:'DE', spec:'Zuschuss bis 1.600 € (Stand 2024)', klassen:'-', tag:'Zuschuss' },
        ],
      },
    ],
  };

  /* ============ Render-Helper ============ */

  function renderSection(cat) {
    const data = DB[cat];
    if (!data) return el('div');

    const wrap = el('div', { class:'card mt-16 hst-section' });
    wrap.innerHTML = `
      <div class="card-h">
        <div class="ico" style="background:rgba(34,211,238,.15); color:#22d3ee"><i class="fas fa-industry"></i></div>
        <h3>${data.title}</h3>
      </div>
      <p class="muted small" style="margin: 0 0 14px"><i class="fas fa-circle-info"></i> Etablierte Hersteller mit relevanten Zertifizierungen. Liste ohne Anspruch auf Vollständigkeit — wir empfehlen je nach Projekt individuell.</p>
      ${data.groups.map(g => `
        <div class="hst-group" style="--c:${g.color}">
          <div class="hst-group-head">
            <span class="hst-group-dot"></span>
            <h4>${g.name}</h4>
          </div>
          <div class="hst-firms">
            ${g.firms.map(f => `
              <div class="hst-firm">
                <div class="hst-firm-tag${f.tag === 'Top' ? ' top' : f.tag === 'Highend' ? ' highend' : f.tag ? ' default' : ''}">${f.tag || ''}</div>
                <div class="hst-firm-main">
                  <strong>${f.n}</strong>
                  <span class="hst-firm-land">${f.land}</span>
                </div>
                <div class="hst-firm-spec">${f.spec}</div>
                ${f.klassen ? `<div class="hst-firm-klass">${f.klassen}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    `;
    return wrap;
  }

  function renderFachfirmen() {
    const data = FACHFIRMEN;
    const wrap = el('div', { class:'card mt-16 hst-section' });
    wrap.innerHTML = `
      <div class="card-h">
        <div class="ico" style="background:rgba(220,38,38,.15); color:#dc2626"><i class="fas fa-handshake"></i></div>
        <h3>${data.title}</h3>
      </div>
      ${data.groups.map(g => `
        <div class="hst-group" style="--c:${g.color}">
          <div class="hst-group-head">
            <span class="hst-group-dot"></span>
            <h4>${g.name}</h4>
          </div>
          <div class="hst-firms">
            ${g.firms.map(f => `
              <div class="hst-firm">
                <div class="hst-firm-tag${f.tag === 'Top' ? ' top' : f.tag === 'Pflicht-Anlaufstelle' ? ' pflicht' : f.tag === 'Förderung' || f.tag === 'Zuschuss' ? ' foerder' : f.tag ? ' default' : ''}">${f.tag || ''}</div>
                <div class="hst-firm-main">
                  <strong>${f.n}</strong>
                  <span class="hst-firm-land">${f.land}</span>
                </div>
                <div class="hst-firm-spec">${f.spec}</div>
                ${f.klassen ? `<div class="hst-firm-klass">${f.klassen}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    `;
    return wrap;
  }

  // Helper "el" - uses global U.el if defined
  function el(tag, attrs = {}) {
    const e = document.createElement(tag);
    if (attrs.class) e.className = attrs.class;
    if (attrs.html) e.innerHTML = attrs.html;
    if (attrs.text) e.textContent = attrs.text;
    if (attrs.style) e.style.cssText = attrs.style;
    return e;
  }

  return {
    DB,
    FACHFIRMEN,
    renderSection,
    renderFachfirmen,
  };
})();
