/* KI-Assistent · wissensbasierter Chat mit allen App-Daten
   - Schwebender Chat-Button
   - Suche durch alle Komponenten/Gesetze
   - Intelligente Antworten aus den Daten
   - Text-to-Speech (Web Speech API)
   - Voice-Input (SpeechRecognition wenn verfügbar) */

window.KI = (() => {
  let isOpen = false;
  let conversation = [];
  let speak = true;
  let voice = null;

  /* ====== Wissensbasis aufbauen ====== */
  function knowledge() {
    const kb = { components: [], laws: [], topics: [] };
    if (window.ENCY && ENCY.list) {
      ENCY.list.forEach(m => kb.components.push({
        type: 'melder', key: m.key, name: m.name, kat: m.kat, principle: m.principle,
        physik: m.physik, staerken: m.staerken, schwaechen: m.schwaechen,
        hersteller: m.hersteller, normen: m.normen,
      }));
    }
    if (window.MECH_ENCY && MECH_ENCY.LIST) {
      MECH_ENCY.LIST.forEach(m => kb.components.push({
        type: 'mechanik', key: m.key, name: m.name, kat: m.kat, klasse: m.klasse,
        wzeit: m.wzeit, norm: m.norm, principle: m.principle, physik: m.physik,
        staerken: m.staerken, schwaechen: m.schwaechen, hersteller: m.hersteller,
        einsatz: m.einsatz, preis: m.preis,
      }));
    }
    if (window.KATALOG) {
      ['VIDEO_DB','BRAND_DB','ZKA_DB','EMA_DB'].forEach(dbKey => {
        const db = KATALOG[dbKey];
        if (!db) return;
        const t = dbKey === 'VIDEO_DB' ? 'video' : dbKey === 'BRAND_DB' ? 'brand' : dbKey === 'ZKA_DB' ? 'zutritt' : 'alarm';
        db.forEach(m => kb.components.push({ type: t, key: m.key, name: m.name, kat: m.kat,
          klasse: m.klasse, principle: m.principle, physik: m.physik, hersteller: m.hersteller, preis: m.preis,
        }));
      });
    }
    if (window.GESETZE_DB && GESETZE_DB.getAllParagraphs) {
      GESETZE_DB.getAllParagraphs().forEach(({ gesetz, abschnitt, paragraph }) => {
        kb.laws.push({
          gesetz: gesetz.short, gesetzTitle: gesetz.title,
          paragraph: paragraph.p, title: paragraph.t,
          summary: paragraph.s, tags: paragraph.tags, abschnitt: abschnitt.title,
        });
      });
    }
    return kb;
  }

  let KB = null;

  /* ====== Antwort-Engine ====== */
  function answer(question) {
    if (!KB) KB = knowledge();
    const q = question.toLowerCase().trim();

    // 1) Begrüßung
    if (/^(hallo|hi|hey|servus|moin)/.test(q)) {
      return {
        text: `Hallo! Ich bin dein KI-Assistent für Sicherheitstechnik. Frag mich nach Komponenten (z.B. „Was ist ein PIR-Melder?"), nach Gesetzen („Welche Versicherungssumme nach § 14 BeWachV?") oder nach Praxis-Themen („Welche Klasse-Tresor brauche ich für 50.000 €?").`,
        suggestions: ['Was ist ein PIR-Melder?', 'Erkläre RC2-Türen', 'BeWachV § 14 Haftpflicht', 'Welcher Tresor für 30.000 €?'],
      };
    }
    if (/(dank|danke|merci)/.test(q)) {
      return { text: 'Gerne! Frag jederzeit weiter.' };
    }
    if (/^(hilfe|help|was kannst du)/.test(q)) {
      return {
        text: 'Ich kenne ~140 Komponenten, ~180 Paragraphen und alle Klassen/Normen dieser App. Beispiele:\n• „Was ist ein Mikrowellenmelder?"\n• „Wie funktioniert eine Sprinkler-Anlage?"\n• „Welche RC-Klasse für ein Bürofenster?"\n• „§ 32 NIS-2 Meldepflicht"\n• „Unterschied PIR und MW"',
        suggestions: ['Wie funktioniert Wärmebild?', 'Was kostet ein RC3-Tresor?', 'Was ist KRITIS?', 'Wer ist Hörmann?'],
      };
    }

    // 2) Gesetz / Paragraph
    const gesetzMatch = q.match(/(§|paragra[fph]+)\s*(\d+\w*)/i);
    if (gesetzMatch || /(bewachv|kritis|nis[\s-]?2|bsig|dguv|waffg|gewo|s[uü]g|gesetz)/.test(q)) {
      const matches = KB.laws.filter(l => {
        const hay = `${l.gesetz} ${l.gesetzTitle} ${l.paragraph} ${l.title} ${l.summary} ${(l.tags||[]).join(' ')}`.toLowerCase();
        return q.split(/\s+/).filter(w => w.length > 2).every(w => hay.includes(w)) ||
               (gesetzMatch && l.paragraph.toLowerCase().includes(gesetzMatch[2]));
      }).slice(0, 3);
      if (matches.length) {
        const m = matches[0];
        let text = `📜 <strong>${m.gesetz} · ${m.paragraph} ${m.title}</strong>\n\n${m.summary}`;
        if (m.tags && m.tags.length) text += `\n\n<em>Schlagworte:</em> ${m.tags.join(', ')}`;
        text += `\n\n<em>Gesetz:</em> ${m.gesetzTitle}\n<em>Abschnitt:</em> ${m.abschnitt}`;
        if (matches.length > 1) {
          text += '\n\n📌 Weitere relevante Paragraphen: ' + matches.slice(1).map(x => `${x.gesetz} ${x.paragraph}`).join(', ');
        }
        return { text, suggestions: ['Mehr zum Thema', 'Hersteller dafür'] };
      }
    }

    // 3) Komponenten-Suche
    const componentMatches = KB.components.filter(c => {
      const hay = `${c.name} ${c.kat} ${c.principle||''} ${(c.hersteller||[]).join(' ')}`.toLowerCase();
      const words = q.split(/\s+/).filter(w => w.length > 2);
      return words.some(w => hay.includes(w));
    });

    if (componentMatches.length) {
      // Wenn Frage nach „Unterschied" → vergleichen
      if (/unterschied|vergleich|vs|oder/.test(q) && componentMatches.length >= 2) {
        const [a, b] = componentMatches;
        return {
          text: `<strong>Vergleich: ${a.name} vs. ${b.name}</strong>\n\n` +
            `🔹 <strong>${a.name}</strong> (${a.kat}):\n${a.principle || '—'}\n\n` +
            `🔹 <strong>${b.name}</strong> (${b.kat}):\n${b.principle || '—'}\n\n` +
            `💡 Unterschied: ${a.kat === b.kat ? 'Beide gleiche Kategorie — unterscheiden sich in Klasse/Schutz.' : 'Unterschiedliche Kategorien für unterschiedliche Schutzaufgaben.'}`,
        };
      }
      // Einzelne Komponente
      const m = componentMatches[0];
      let text = `🔧 <strong>${m.name}</strong> (${m.kat})\n\n`;
      if (m.principle) text += `<strong>Wirkprinzip:</strong> ${m.principle}\n\n`;
      if (m.physik) text += `<strong>Aufbau:</strong> ${m.physik}\n\n`;
      if (m.klasse) text += `<strong>Klasse:</strong> ${m.klasse}\n`;
      if (m.wzeit) text += `<strong>Widerstandszeit:</strong> ${m.wzeit}\n`;
      if (m.preis) text += `<strong>Preisrahmen:</strong> ${m.preis}\n`;
      if (m.hersteller && m.hersteller.length) text += `\n🏭 <strong>Hersteller:</strong> ${m.hersteller.slice(0, 5).join(', ')}`;
      if (m.staerken && m.staerken.length) text += `\n\n✅ <strong>Stärken:</strong> ${m.staerken.slice(0, 3).join(' · ')}`;
      if (m.schwaechen && m.schwaechen.length) text += `\n⚠ <strong>Schwächen:</strong> ${m.schwaechen.slice(0, 3).join(' · ')}`;
      const sug = componentMatches.slice(1, 4).map(x => x.name);
      return { text, suggestions: sug.length ? sug : ['Weitere Details', 'Hersteller-Liste'] };
    }

    // 4) Praxis-Fragen
    if (/welche.*tresor|tresor.*klasse|tresor.*\d+/.test(q)) {
      const wert = parseInt((q.match(/\d{2,7}/) || ['0'])[0]);
      let klasse = 'N (S2)';
      if (wert > 5000) klasse = '0';
      if (wert > 20000) klasse = 'I';
      if (wert > 50000) klasse = 'II';
      if (wert > 100000) klasse = 'III';
      if (wert > 200000) klasse = 'IV';
      if (wert > 500000) klasse = 'VI';
      return {
        text: `Für einen Wert von <strong>${wert.toLocaleString('de-DE')} €</strong> brauchst du mindestens einen <strong>Tresor der Klasse ${klasse}</strong> nach EN 1143-1.\n\n📌 Versicherungsgrenzen (privat):\n• Klasse 0: 20.000 €\n• Klasse I: 40.000 €\n• Klasse II: 100.000 €\n• Klasse III: 200.000 €\n• Klasse IV: 300.000 €\n• Klasse VI: 1.000.000 €\n\n⚠ Tipp: Im Boden oder in der Wand verankern! Sonst Versicherung nicht voll.`,
        suggestions: ['Wo kaufen?', 'Hersteller Tresore', 'Klasse III erklären'],
      };
    }
    if (/(rc[\s-]?\d|wk[\s-]?\d).*(tür|fenster)/.test(q) || /welche.*rc.*klasse/.test(q)) {
      return {
        text: `📌 <strong>RC-Klassen nach DIN EN 1627:</strong>\n\n• <strong>RC1N:</strong> Mindestschutz, nur Körperkraft\n• <strong>RC2:</strong> Polizei-Empfehlung für Wohnen (Schraubendreher/Zange, 3 Min Widerstand)\n• <strong>RC3:</strong> Schaufenster, Gewerbe EG (5 Min)\n• <strong>RC4:</strong> Banken, Juweliere (10 Min, Akku-Werkzeug)\n• <strong>RC5:</strong> Hochsicherheit (15 Min, Trennschleifer)\n• <strong>RC6:</strong> Tresorraum-Niveau (20 Min)`,
        suggestions: ['Was kostet RC2-Tür?', 'P4A Glas erklären', 'Welche Hersteller?'],
      };
    }
    if (/kritis|kritische infrastruktur/.test(q)) {
      return {
        text: `🏛 <strong>KRITIS = Kritische Infrastrukturen</strong>\n\nNach KRITIS-Dachgesetz (in Kraft 29.01.2026): 10 Sektoren mit zentraler Registrierung beim BBK.\n\n<strong>Sektoren:</strong> Energie · Transport/Verkehr · Finanzwesen · Sozialversicherung · Gesundheit · Wasser · Ernährung · IT/TK · Weltraum · Siedlungsabfall\n\n<strong>Schwellwert:</strong> ≥ 500.000 versorgte Einwohner\n<strong>Pflichten:</strong> Registrierung · Risikoanalyse · Resilienzplan · Meldepflicht bei Vorfällen\n<strong>Bußgeld:</strong> bis 10 Mio € oder 2 % Umsatz`,
        suggestions: ['NIS-2 erklären', 'BBK Meldepflicht', 'Tank-Anlage KRITIS?'],
      };
    }
    if (/nis[\s-]?2|cyber|it[\s-]?sicherheit/.test(q)) {
      return {
        text: `💻 <strong>NIS-2 / BSIG 2025</strong>\n\nUmsetzt EU-Richtlinie 2022/2555. Ab Dez 2025 in Kraft. ~30.000 Unternehmen in DE betroffen (vs. 4.500 bei NIS-1).\n\n<strong>2 Kategorien:</strong> Besonders wichtige + Wichtige Einrichtungen in 18 Sektoren\n\n<strong>Meldepflichten (§ 32):</strong>\n• 24 h: Frühwarnung\n• 72 h: Vorfall-Meldung\n• 1 Monat: Abschlussbericht\n\n<strong>10 Risikomanagement-Maßnahmen:</strong> Risiko-Analyse · Vorfallbewältigung · Backup · Lieferketten · IT-Sicherheit · Pen-Tests · Krypto · Personal · Zugang · Anlagen\n\n<strong>Bußgeld:</strong> bis 10 Mio € / 2 % Umsatz`,
        suggestions: ['BSI Meldestelle', 'KRITIS Unterschied', '§ 30 BSIG erklären'],
      };
    }
    if (/dsgvo|datenschutz|videoüberwachung/.test(q)) {
      return {
        text: `📷 <strong>Video-Überwachung & DSGVO</strong>\n\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).\n\n<strong>Pflichten:</strong>\n• Hinweisschild PFLICHT (Art. 13)\n• Datenschutz-Folgenabschätzung bei öffentlichen Bereichen (Art. 35)\n• Verzeichnis Verarbeitungstätigkeiten (Art. 30)\n• Speicherbegrenzung: 7 Tage Standard\n• Zugangsprotokoll (Wer/Wann/Was/Warum)\n• Privacy-Masken auf Nachbargrundstücken/öffentlichen Wegen`,
        suggestions: ['NVR Speicher berechnen', 'Hinweisschild kaufen?', 'Aufbewahrungsdauer'],
      };
    }
    if (/wie viel|kostet|preis/.test(q) && componentMatches.length === 0) {
      return {
        text: `💰 <strong>Preisrahmen typischer Komponenten:</strong>\n\n• PIR-Melder: 30—150 €\n• RC2-Tür: 900—2.500 €\n• RC2-Fenster: 650—1.400 €\n• Tresor Klasse I: 1.000—2.500 €\n• Tresor Klasse III: 5.000—12.000 €\n• PTZ-Kamera 25× Zoom: 1.500—6.000 €\n• Wärmebildkamera: 2.500—25.000 €\n• EMA-Zentrale Grad 2/3: 500—5.000 €\n• Versenkpoller K12: 8.000—35.000 €/Stk\n• Sprinkler-Anlage: 40—80 €/m²`,
        suggestions: ['Welche Klasse für Wohnung?', 'KfW-Förderung?'],
      };
    }
    if (/kfw|förderung|zuschuss/.test(q)) {
      return {
        text: `💶 <strong>KfW-Förderung für Einbruchschutz:</strong>\n\n• <strong>KfW 159</strong> „Altersgerecht Umbauen" — Kredit bis 50.000 €\n• <strong>KfW 455-E</strong> Investitionszuschuss — bis 1.600 € direkt\n\nGefördert: RC2-Türen/Fenster · Mehrfachverr. · Querriegel · Smart-Locks · Alarmanlagen · Bewegungsmelder\n\n📌 Beantragung VOR dem Kauf! Über die KfW-Website.`,
        suggestions: ['Welche RC-Klasse?', 'Polizei-Beratung'],
      };
    }

    // 5) Fallback
    return {
      text: `Hmm, dazu hab ich keine direkte Antwort. Versuch konkretere Begriffe:\n• Komponente: „PIR-Melder", „RC2-Tür", „Tresor Klasse III"\n• Gesetz: „§ 14 BeWachV", „NIS-2", „KRITIS"\n• Praxis: „Welche Klasse für Wohnung?", „Was kostet ein Tresor?"`,
      suggestions: ['Was ist NIS-2?', 'Erkläre PIR', 'Welche Tresor-Klasse?', 'KfW-Förderung'],
    };
  }

  /* ====== UI ====== */
  function init() {
    // Floating Button
    const fab = document.createElement('button');
    fab.className = 'ki-fab';
    fab.innerHTML = '<i class="fas fa-robot"></i>';
    fab.title = 'KI-Assistent öffnen (Strg+J)';
    fab.onclick = toggle;
    document.body.appendChild(fab);

    // Chat-Panel
    const panel = document.createElement('div');
    panel.className = 'ki-panel';
    panel.id = 'ki-panel';
    panel.innerHTML = `
      <div class="ki-head">
        <div class="ki-head-avatar"><i class="fas fa-robot"></i></div>
        <div class="ki-head-meta">
          <strong>KI-Assistent</strong>
          <span>Sicherheitstechnik · ~320 Wissens-Einträge</span>
        </div>
        <button class="ki-toggle-voice" title="Sprachausgabe an/aus"><i class="fas fa-volume-high"></i></button>
        <button class="ki-close" title="Schließen"><i class="fas fa-xmark"></i></button>
      </div>
      <div class="ki-messages" id="ki-msg-list"></div>
      <div class="ki-suggestions" id="ki-sug"></div>
      <div class="ki-input-row">
        <button class="ki-mic" id="ki-mic" title="Spracheingabe"><i class="fas fa-microphone"></i></button>
        <input type="text" id="ki-input" placeholder="Frage stellen... z.B. 'Was ist ein PIR-Melder?'"/>
        <button class="ki-send" id="ki-send"><i class="fas fa-paper-plane"></i></button>
      </div>
    `;
    document.body.appendChild(panel);

    const input = panel.querySelector('#ki-input');
    const send = panel.querySelector('#ki-send');
    const list = panel.querySelector('#ki-msg-list');
    const sugBox = panel.querySelector('#ki-sug');
    const closeBtn = panel.querySelector('.ki-close');
    const voiceBtn = panel.querySelector('.ki-toggle-voice');
    const mic = panel.querySelector('#ki-mic');

    closeBtn.onclick = () => toggle(false);
    send.onclick = handleSend;
    input.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };
    voiceBtn.onclick = () => {
      speak = !speak;
      voiceBtn.innerHTML = speak ? '<i class="fas fa-volume-high"></i>' : '<i class="fas fa-volume-xmark"></i>';
      if (!speak && window.speechSynthesis) window.speechSynthesis.cancel();
    };

    // Voice-Input (wenn verfügbar)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const recog = new SR();
      recog.lang = 'de-DE';
      recog.continuous = false;
      recog.interimResults = false;
      mic.onclick = () => {
        mic.classList.add('recording');
        recog.start();
      };
      recog.onresult = (e) => {
        const txt = e.results[0][0].transcript;
        input.value = txt;
        mic.classList.remove('recording');
        handleSend();
      };
      recog.onerror = () => mic.classList.remove('recording');
      recog.onend = () => mic.classList.remove('recording');
    } else {
      mic.style.display = 'none';
    }

    // Cmd/Ctrl+J Shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        toggle();
      }
    });

    // Initial Greeting
    showMessage('assistant', 'Hi! 👋 Ich bin dein KI-Assistent für Sicherheitstechnik. Stell mir Fragen zu Komponenten, Gesetzen oder Praxis-Themen.', [
      'Was ist ein PIR-Melder?',
      'Welcher Tresor für 50.000 €?',
      'Was ist NIS-2?',
      'Erkläre RC-Klassen',
    ]);

    function handleSend() {
      const q = input.value.trim();
      if (!q) return;
      showMessage('user', q);
      input.value = '';
      setTimeout(() => {
        const ans = answer(q);
        showMessage('assistant', ans.text, ans.suggestions || []);
        if (speak) speakText(ans.text);
      }, 350);
    }

    function showMessage(role, text, suggestions) {
      const msg = document.createElement('div');
      msg.className = `ki-msg ki-msg-${role}`;
      msg.innerHTML = `
        <div class="ki-msg-avatar"><i class="fas fa-${role === 'user' ? 'user' : 'robot'}"></i></div>
        <div class="ki-msg-body">${text.replace(/\n/g, '<br>')}</div>
      `;
      list.appendChild(msg);
      list.scrollTop = list.scrollHeight;

      // Suggestions
      sugBox.innerHTML = '';
      if (suggestions && suggestions.length) {
        suggestions.forEach(s => {
          const b = document.createElement('button');
          b.className = 'ki-sug-chip';
          b.textContent = s;
          b.onclick = () => { input.value = s; handleSend(); };
          sugBox.appendChild(b);
        });
      }
    }

    function speakText(html) {
      if (!speak || !window.speechSynthesis) return;
      const text = html.replace(/<[^>]+>/g, '').replace(/[•⚠✓📌🏭💰💶🔧📜🏛💻📷🎯]/g, '').slice(0, 500);
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 1.05;
      u.pitch = 1.0;
      // Versuch deutsche Stimme zu wählen
      const voices = window.speechSynthesis.getVoices();
      const deVoice = voices.find(v => v.lang.startsWith('de'));
      if (deVoice) u.voice = deVoice;
      window.speechSynthesis.speak(u);
    }
  }

  function toggle(force) {
    const panel = document.getElementById('ki-panel');
    if (!panel) return;
    isOpen = force === undefined ? !isOpen : force;
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      setTimeout(() => panel.querySelector('#ki-input').focus(), 200);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }

  // Init nach DOM-Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Preload voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  return { toggle, answer };
})();
