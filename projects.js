/* ============================================================
   WALIFE - projects page (archive)
   Renders every project from data.js with category filters,
   grid / list views, hover previews and the IT/EN switch.
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n) => String(n).padStart(2, '0');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------
     DATA + LANGUAGE
     ---------------------------------------------------------- */
  const W = window.WALIFE;
  const { PROJECTS, CATEGORIES } = W;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  let lang = W.LANGS.includes(store.get('walife-lang')) ? store.get('walife-lang') : W.DEFAULT_LANG;
  const t = (key, vars) => {
    let v = W.DICT[lang][key];
    if (v === undefined) v = W.DICT[W.DEFAULT_LANG][key];
    if (typeof v === 'string' && vars) Object.keys(vars).forEach((k) => { v = v.replace(`{${k}}`, vars[k]); });
    return v === undefined ? '' : v;
  };
  const L = (o) => (typeof o === 'string' ? o : (o[lang] || o[W.DEFAULT_LANG]));

  /* Dedicated project pages: one page per project, addressed by slug */
  const projectUrl = (p) => p.url || `project.html?p=${encodeURIComponent(p.slug)}`;
  const yearOf = (p) => p.date.slice(0, 4);

  /* ----------------------------------------------------------
     RENDER
     ---------------------------------------------------------- */
  const grid = $('#pj-grid');
  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="pj-card" id="${p.slug}" data-slug="${p.slug}" data-cats="${(p.cats || []).join(' ')}">
      <a href="${projectUrl(p)}" data-cursor="VIEW">
        <span class="pj-lnum">${pad(i + 1)}</span>
        <div class="pj-media">
          <img src="${p.img}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" draggable="false">
          <span class="pj-num"><b>${pad(i + 1)}</b> / ${yearOf(p)}</span>
          <span class="pj-go" aria-hidden="true">↗</span>
        </div>
        <div class="pj-info">
          <h2 class="pj-name"></h2>
          <span class="pj-year">${yearOf(p)}</span>
          <p class="pj-tags"></p>
          <p class="pj-desc"></p>
        </div>
        <span class="pj-larrow" aria-hidden="true">↗</span>
      </a>
    </article>`).join('');
  const cards = $$('.pj-card', grid);

  const usedCats = Object.keys(CATEGORIES).filter((c) => PROJECTS.some((p) => (p.cats || []).includes(c)));
  const countIn = (c) => (c === 'all' ? PROJECTS.length : PROJECTS.filter((p) => (p.cats || []).includes(c)).length);
  $('#pj-filters').innerHTML = ['all', ...usedCats].map((c) =>
    `<button type="button" class="pj-chip" data-cat="${c}" aria-pressed="${c === 'all'}"><span></span><sup>${countIn(c)}</sup></button>`
  ).join('');

  $('#socials').innerHTML = W.SOCIALS.map((s) => {
    const ext = /^https?:/.test(s.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li><a href="${s.url}"${ext} data-cursor="OPEN">${s.name}<span aria-hidden="true">↗</span></a></li>`;
  }).join('');
  $('#year').textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     I18N
     ---------------------------------------------------------- */
  let currentFilter = 'all';
  function visibleCount() { return cards.filter((c) => !c.hidden).length; }
  function updateCount() {
    const n = currentFilter === 'all' ? PROJECTS.length : countIn(currentFilter);
    $('#pj-count-num').textContent = pad(n);
    $('#pj-count-label').textContent = t('pjCount', { n: '' }).trim();
  }

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    document.title = t('pjDocTitle');
    const md = $('meta[name="description"]');
    if (md) md.content = t('pjDocDesc');

    cards.forEach((card) => {
      const p = PROJECTS.find((x) => x.slug === card.dataset.slug);
      $('.pj-name', card).textContent = L(p.title);
      $('.pj-tags', card).textContent = L(p.tags);
      $('.pj-desc', card).textContent = L(p.desc);
      $('a', card).setAttribute('aria-label', `${L(p.title)} – ${L(p.tags)}, ${yearOf(p)}`);
    });
    $$('.pj-chip').forEach((b) => {
      const c = b.dataset.cat;
      $('span', b).textContent = c === 'all' ? t('pjAll') : L(CATEGORIES[c]);
    });
    updateCount();
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  applyLang();
  $$('.lang button').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    store.set('walife-lang', lang);
    applyLang();
  }));

  /* ----------------------------------------------------------
     LAYOUT HELPERS: staggered second column in grid view
     ---------------------------------------------------------- */
  function restagger() {
    let k = 0;
    cards.forEach((c) => {
      if (c.hidden) { c.classList.remove('shift'); return; }
      c.classList.toggle('shift', k % 2 === 1);
      k++;
    });
  }

  /* ----------------------------------------------------------
     FILTERS (animated)
     ---------------------------------------------------------- */
  let filterBusy = null;
  function setFilter(cat) {
    if (cat === currentFilter) return;
    currentFilter = cat;
    $$('.pj-chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    updateCount();

    const apply = () => {
      cards.forEach((c) => {
        const show = cat === 'all' || c.dataset.cats.split(' ').includes(cat);
        c.hidden = !show;
        c.classList.add('in');
      });
      restagger();
      $('#pj-empty').hidden = visibleCount() > 0;
      const shown = cards.filter((c) => !c.hidden);
      shown.forEach((c) => c.classList.add('out'));
      void grid.offsetWidth; /* commit the faded-out state before animating in */
      shown.forEach((c, i) => {
        c.style.transitionDelay = reduce ? '0s' : `${i * 0.06}s`;
        c.classList.remove('out');
      });
      setTimeout(() => { shown.forEach((c) => { c.style.transitionDelay = ''; }); }, 900);
      if (lenis) lenis.resize();
    };

    clearTimeout(filterBusy);
    if (reduce) { cards.forEach((c) => c.classList.remove('out')); apply(); return; }
    cards.forEach((c) => { c.style.transitionDelay = ''; if (!c.hidden) c.classList.add('out'); });
    filterBusy = setTimeout(apply, 320);
  }
  $$('.pj-chip').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.cat)));

  /* ----------------------------------------------------------
     VIEW: grid / list
     ---------------------------------------------------------- */
  function setView(v) {
    grid.dataset.view = v;
    $$('.pj-views button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    store.set('walife-view', v);
    hidePreview();
    if (lenis) lenis.resize();
  }
  $$('.pj-views button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));

  /* ----------------------------------------------------------
     REVEAL ON SCROLL
     ---------------------------------------------------------- */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const idx = cards.filter((c) => !c.hidden && !c.classList.contains('in')).indexOf(el);
        el.style.transitionDelay = reduce ? '0s' : `${clamp(idx, 0, 3) * 0.08}s`;
        el.classList.add('in');
        setTimeout(() => { el.style.transitionDelay = ''; }, 1100);
        io.unobserve(el);
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    cards.forEach((c) => io.observe(c));
  }

  /* ----------------------------------------------------------
     HOVER: preview in list view, tilt + glare in grid view
     ---------------------------------------------------------- */
  const preview = $('#pj-preview');
  let px = 0, py = 0, tx = 0, ty = 0;
  function hidePreview() { preview.classList.remove('show'); }
  if (fine) {
    cards.forEach((card) => {
      const p = PROJECTS.find((x) => x.slug === card.dataset.slug);
      const a = $('a', card);
      a.addEventListener('pointerenter', (e) => {
        if (grid.dataset.view !== 'list') return;
        preview.innerHTML = `<div class="art"><img src="${p.img}" alt=""></div>`;
        if (!preview.classList.contains('show')) { px = tx = e.clientX; py = ty = e.clientY; }
        preview.classList.add('show');
      });
      a.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
      a.addEventListener('pointerleave', hidePreview);

      if (reduce) return;
      const media = $('.pj-media', card);
      const glare = document.createElement('i');
      glare.className = 'glare';
      media.append(glare);
      media.addEventListener('pointermove', (e) => {
        const r = media.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height;
        media.style.transform = `perspective(1100px) rotateX(${((.5 - my) * 6).toFixed(2)}deg) rotateY(${((mx - .5) * 8).toFixed(2)}deg)`;
        glare.style.setProperty('--gx', (mx * 100) + '%');
        glare.style.setProperty('--gy', (my * 100) + '%');
        media.classList.add('is-tilting');
      });
      media.addEventListener('pointerleave', () => { media.style.transform = ''; media.classList.remove('is-tilting'); });
    });
  }

  const hero = $('.pj-hero');
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* ----------------------------------------------------------
     CURSOR + MAGNETIC
     ---------------------------------------------------------- */
  const cursor = $('#cursor');
  const dot = $('.cursor-dot', cursor);
  const ring = $('.cursor-ring', cursor);
  const ringLabel = $('b', ring);
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  if (fine) {
    document.documentElement.classList.add('has-cursor');
    window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; cursor.classList.remove('hidden'); });
    document.addEventListener('pointerleave', () => cursor.classList.add('hidden'));
    window.addEventListener('pointerdown', () => cursor.classList.add('down'));
    window.addEventListener('pointerup', () => cursor.classList.remove('down'));
    document.addEventListener('pointerover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, [role="button"]');
      cursor.classList.toggle('label', !!lab);
      if (lab) ringLabel.textContent = lab.dataset.cursor;
      cursor.classList.toggle('hover', !lab && !!hov);
    });
  }
  if (fine && !reduce) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .25}px, ${(e.clientY - (r.top + r.height / 2)) * .25}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ----------------------------------------------------------
     HEADER, MENU, SMOOTH SCROLL
     ---------------------------------------------------------- */
  const header = $('#site-header');
  const burger = $('#burger');
  const menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  let lenis = null;
  if (window.Lenis && !reduce) lenis = new window.Lenis({ lerp: .085 });
  const scrollToEl = (el, offset) => {
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('a[href="#contact"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); scrollToEl($('#contact'), 0); }));
  $('#to-top').addEventListener('click', (e) => { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ----------------------------------------------------------
     MAIN LOOP
     ---------------------------------------------------------- */
  const progress = $('#scroll-progress');
  let lastY = scrollY;
  function tick(now) {
    if (lenis) lenis.raf(now);
    const y = scrollY;
    const dy = y - lastY;
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 20);
    if (!menu.classList.contains('open')) {
      if (y > 240 && dy > 2) header.classList.add('hide');
      else if (dy < -2 || y < 240) header.classList.remove('hide');
    }
    document.body.classList.toggle('hdr-hidden', header.classList.contains('hide'));

    if (fine) {
      rx = lerp(rx, mx, .18); ry = lerp(ry, my, .18);
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      px = lerp(px, tx, .14); py = lerp(py, ty, .14);
      preview.style.transform = `translate3d(${px + 36}px,${py - 110}px,0) rotate(${clamp((tx - px) * .06, -8, 8)}deg)`;
    }
    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  setView(store.get('walife-view') === 'list' ? 'list' : 'grid');
  restagger();
  requestAnimationFrame(tick);

  /* boot with a timer (not rAF) so it also runs in background tabs */
  setTimeout(() => {
    document.body.classList.add('ready');
    initReveal();

    /* deep link from the home page: projects.html#slug
       (.pj-card has scroll-margin-top, so it lands below header + toolbar) */
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && target.classList.contains('pj-card')) {
      target.classList.add('in', 'flash');
      target.scrollIntoView({ block: 'start' });
      setTimeout(() => target.classList.remove('flash'), 2600);
    }
  }, 30);
})();
