/* Small DOM + formatting utilities */
window.U = (() => {

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function el(tag, attrs={}, children) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') { for (const d in v) e.dataset[d] = v[d]; }
      else e.setAttribute(k, v);
    }
    if (children) {
      const list = Array.isArray(children) ? children : [children];
      for (const c of list) {
        if (c == null || c === false) continue;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return e;
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;');
  }

  function parsePriceRange(s) {
    // matches "25 – 80" "1.500 – 3.500 €" "35–55 €/lfm" "500 – 2.000 €" "20 – 40/Monat"
    if (s == null) return null;
    s = String(s).replace(/ /g,' ').replace(/\./g,'').replace(',','.');
    const m = s.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
    if (m) return { lo: +m[1], hi: +m[2] };
    const single = s.match(/(\d+(?:\.\d+)?)/);
    if (single) return { lo: +single[1], hi: +single[1] };
    return null;
  }

  function fmtEUR(n) {
    if (n == null || isNaN(n)) return '—';
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' €';
  }

  function pillFor(text) {
    if (!text) return null;
    const t = String(text).toLowerCase();
    let cls = 'pill';
    if (/sü\s*6|grad\s*4|rc\s*6|p8b|kritis/.test(t)) cls = 'pill r';
    else if (/sü\s*5|grad\s*3|rc\s*[45]/.test(t)) cls = 'pill w';
    else if (/sü\s*[34]|grad\s*[23]|rc\s*3/.test(t)) cls = 'pill b';
    else if (/sü\s*[12]|grad\s*[12]|rc\s*[12]/.test(t)) cls = 'pill g';
    return U.el('span', { class: cls, text: text });
  }

  function toast(msg, ms=1700) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.add('hidden'), ms);
  }

  function drawer(title, bodyEl) {
    $('#drawer-title').textContent = title;
    const body = $('#drawer-body');
    body.innerHTML = '';
    if (bodyEl) body.appendChild(bodyEl);
    $('#drawer').classList.remove('hidden');
  }

  function closeDrawer() { $('#drawer').classList.add('hidden'); }

  function debounce(fn, ms=200) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function buildTable(headers, rows, options={}) {
    const wrap = el('div', { class: 'tbl-scroll' });
    const tbl = el('table', { class: 'data' });
    const thead = el('thead');
    const trh = el('tr');
    headers.forEach(h => trh.appendChild(el('th', { text: h })));
    thead.appendChild(trh); tbl.appendChild(thead);
    const tbody = el('tbody');
    rows.forEach(row => {
      const tr = el('tr', { class: options.onRow ? 'clickable' : '' });
      if (options.onRow) tr.addEventListener('click', () => options.onRow(row));
      headers.forEach(h => {
        const v = row[h];
        const td = el('td');
        const isPriceCol = /preis|richtpreis/i.test(h);
        if (isPriceCol) td.classList.add('num');
        if (options.pillCols && options.pillCols.includes(h) && v) {
          const p = pillFor(v);
          if (p) td.appendChild(p); else td.textContent = v;
        } else {
          td.textContent = v ?? '';
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    return wrap;
  }

  return { $, $$, el, escapeHtml, parsePriceRange, fmtEUR, pillFor, toast, drawer, closeDrawer, debounce, buildTable };
})();
