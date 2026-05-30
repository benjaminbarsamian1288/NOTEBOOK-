/* Notizbuch – globale, persistente Sammlung von Lerninhalten quer durch die App.
   window.NOTEBOOK: pin / unpin / isPinned / getAll / view / buildDeck.
   Geteilte Streak-/Lern-Daten teilt es sich mit PRAESENTATION (gleicher Storage). */
window.NOTEBOOK = (() => {
  const { el } = U;
  const KEY = 'nb-items-v1';

  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { items = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }

  const listeners = new Set();
  function emit() { listeners.forEach(fn => { try { fn(items); } catch (e) {} }); }
  function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  function isPinned(id) { return items.some(x => x.id === id); }
  function pin(item) {
    if (!item || !item.id) return false;
    if (isPinned(item.id)) return false;
    items.unshift({ ...item, pinnedAt: Date.now() });
    save(); emit(); return true;
  }
  function unpin(id) {
    const i = items.findIndex(x => x.id === id);
    if (i < 0) return false;
    items.splice(i, 1); save(); emit(); return true;
  }
  function toggle(item) {
    if (isPinned(item.id)) { unpin(item.id); return false; }
    pin(item); return true;
  }
  function clearAll() { items = []; save(); emit(); }
  function getAll() { return items.slice(); }
  function count() { return items.length; }

  /* Baut aus den Pins ein Slideshow-Deck. */
  function buildDeck() {
    if (!items.length) return null;
    const A = '#a855f7';
    const slides = [{
      type: 'cover', accent: A, icon: 'fa-bookmark', kicker: 'Mein Notizbuch',
      title: 'Eigenes Deck', subtitle: items.length + ' gepinnte Lern-Inhalte',
      lead: 'Alle gemerkten Paragraphen und Klassen als eine Präsentation.',
      count: items.length + ' Folien',
    }];
    items.forEach(it => {
      if (it.kind === 'law' || it.kind === 'class') {
        slides.push({
          id: it.id, type: 'content', accent: it.accent || A, kicker: it.kicker || 'Notizbuch',
          badge: it.badge || '', title: it.title || '', summary: it.summary || '',
          beispiel: it.beispiel, merksatz: it.merksatz, fehler: it.fehler,
          tags: it.tags || [], wichtig: it.wichtig, jedermann: it.jedermann,
        });
      }
    });
    slides.push({
      type: 'outro', accent: A, icon: 'fa-circle-check', kicker: 'Geschafft',
      title: 'Notizbuch durchgegangen', subtitle: 'Stark gemacht!',
      lead: 'Du hast alle deine Pins wiederholt. Komm morgen wieder.',
    });
    return { id: 'notebook', group: '📌 Mein Notizbuch', title: 'Notizbuch · Eigenes Deck',
      sub: items.length + ' Pins', accent: A, icon: 'fa-bookmark', count: slides.length, slides };
  }

  /* Export als Markdown (für eigene Notizen / Drucken). */
  function exportMarkdown() {
    if (!items.length) return '';
    const lines = ['# Mein Sicherheitstechnik-Notizbuch', '', 'Stand: ' + new Date().toLocaleDateString('de-DE'), ''];
    items.forEach((it, i) => {
      lines.push('## ' + (i + 1) + '. ' + (it.badge ? it.badge + ' · ' : '') + (it.title || ''));
      if (it.kicker) lines.push('*' + it.kicker + '*', '');
      if (it.summary) lines.push(it.summary, '');
      if (it.beispiel) lines.push('**Praxisfall:** ' + it.beispiel, '');
      if (it.merksatz) lines.push('**Merksatz:** ' + it.merksatz, '');
      if (it.tags && it.tags.length) lines.push('Tags: ' + it.tags.join(', '), '');
      lines.push('---', '');
    });
    return lines.join('\n');
  }

  function downloadMd() {
    const md = exportMarkdown(); if (!md) return;
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'notizbuch-' + new Date().toISOString().slice(0, 10) + '.md';
    document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 100);
  }

  /* Pin-Toggle-Button als wiederverwendbares Mini-UI. */
  function pinBtn(item, opts) {
    const o = opts || {};
    const b = el('button', { class: 'nb-pin' + (o.size === 'sm' ? ' nb-pin-sm' : ''), type: 'button', title: 'Im Notizbuch merken' });
    function refresh() {
      const on = isPinned(item.id);
      b.classList.toggle('on', on);
      b.innerHTML = on ? '<i class="fas fa-bookmark"></i><span>Gemerkt</span>' : '<i class="far fa-bookmark"></i><span>Merken</span>';
      b.title = on ? 'Aus Notizbuch entfernen' : 'Im Notizbuch merken';
    }
    refresh();
    b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      toggle(item); refresh();
      try { U.toast(isPinned(item.id) ? 'Im Notizbuch gemerkt ✓' : 'Aus Notizbuch entfernt'); } catch (_) {}
    });
    const stop = onChange(refresh); b.addEventListener('remove', stop);
    return b;
  }

  /* Komplette Ansicht für die Route „notebook". */
  function view() {
    const root = el('div', { class: 'nb-wrap' });

    function render() {
      root.innerHTML = '';
      root.appendChild(el('div', { class: 'view-head' }, [
        el('span', { class: 'crumb', text: 'Mein Notizbuch' }),
        el('h1', { text: '📌 Notizbuch' }),
        el('p', { text: 'Alles, was du dir in der App gemerkt hast – Paragraphen, Klassen, EMA-Grade. Daraus baust du dein eigenes Lern-Deck.' }),
      ]));

      const bar = el('div', { class: 'nb-bar' });
      bar.appendChild(el('div', { class: 'nb-bar-count' }, [
        el('strong', { text: String(items.length) }),
        el('span', { text: items.length === 1 ? ' Eintrag im Notizbuch' : ' Einträge im Notizbuch' }),
      ]));
      const play = el('button', { class: 'nb-btn nb-btn-primary', html: '<i class="fas fa-play"></i> Als Präsentation abspielen' });
      play.disabled = !items.length;
      play.addEventListener('click', () => {
        const deck = buildDeck(); if (deck && window.PRAESENTATION && PRAESENTATION.play) PRAESENTATION.play(deck);
        else location.hash = '#praesentation';
      });
      const exp = el('button', { class: 'nb-btn', html: '<i class="fas fa-file-arrow-down"></i> Als Markdown' });
      exp.disabled = !items.length;
      exp.addEventListener('click', downloadMd);
      const clr = el('button', { class: 'nb-btn nb-btn-danger', html: '<i class="fas fa-trash"></i> Alle entfernen' });
      clr.disabled = !items.length;
      clr.addEventListener('click', () => { if (confirm('Wirklich alle ' + items.length + ' Notizen löschen?')) clearAll(); });
      bar.appendChild(play); bar.appendChild(exp); bar.appendChild(clr);
      root.appendChild(bar);

      if (!items.length) {
        const empty = el('div', { class: 'nb-empty' });
        empty.innerHTML = `
          <i class="far fa-bookmark"></i>
          <h3>Noch nichts gemerkt</h3>
          <p>Tippe in der <b>Präsentation</b> auf einer Paragraph-Folie oben auf <i class="fas fa-bookmark"></i> Merken,
          oder bei den <b>Sicherungsklassen-Kacheln</b> auf das Lesezeichen-Symbol. Hier findest du dann alles wieder.</p>
          <button class="nb-btn nb-btn-primary"><i class="fas fa-person-chalkboard"></i> Zur Präsentation</button>`;
        empty.querySelector('button').addEventListener('click', () => location.hash = '#praesentation');
        root.appendChild(empty);
        return;
      }

      const grid = el('div', { class: 'nb-grid' });
      items.forEach((it, i) => {
        const card = el('div', { class: 'nb-card', style: `--a:${it.accent || '#a855f7'}` });
        card.appendChild(el('div', { class: 'nb-no', text: '#' + (i + 1) }));
        const head = el('div', { class: 'nb-head' });
        if (it.badge) head.appendChild(el('span', { class: 'nb-badge', text: it.badge }));
        head.appendChild(el('h3', { text: it.title || '' }));
        card.appendChild(head);
        if (it.kicker) card.appendChild(el('div', { class: 'nb-kicker', text: it.kicker }));
        if (it.summary) card.appendChild(el('p', { class: 'nb-summary', text: it.summary }));
        const flags = el('div', { class: 'nb-flags' });
        if (it.wichtig) flags.appendChild(el('span', { class: 'nb-flag nb-flag-star', html: '<i class="fas fa-star"></i> WICHTIG' }));
        if (it.jedermann) flags.appendChild(el('span', { class: 'nb-flag nb-flag-hand', html: '<i class="fas fa-hand"></i> JEDERMANNSRECHT' }));
        card.appendChild(flags);
        const foot = el('div', { class: 'nb-foot' });
        const goOne = el('button', { class: 'nb-btn nb-btn-mini', html: '<i class="fas fa-play"></i> Einzeln üben' });
        goOne.addEventListener('click', () => {
          const single = { id: 'nb-one', group: '📌 Notizbuch', title: it.title || 'Einzeln', sub: it.kicker || '', accent: it.accent || '#a855f7', icon: 'fa-bookmark', count: 1,
            slides: [{ ...it, type: 'content', kicker: it.kicker || 'Notizbuch' }] };
          if (window.PRAESENTATION && PRAESENTATION.play) PRAESENTATION.play(single);
        });
        const rem = el('button', { class: 'nb-btn nb-btn-mini nb-btn-danger', html: '<i class="fas fa-xmark"></i> Entfernen' });
        rem.addEventListener('click', () => unpin(it.id));
        foot.append(goOne, rem);
        card.appendChild(foot);
        grid.appendChild(card);
      });
      root.appendChild(grid);
    }

    onChange(render);
    render();
    return root;
  }

  return { pin, unpin, toggle, isPinned, getAll, count, view, buildDeck, pinBtn, onChange, exportMarkdown };
})();
