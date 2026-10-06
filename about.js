/* ============================================================
   WALIFE - about page
   Content in data.js (ABOUT + DICT). Software levels, education,
   experience, contacts; IT/EN switch shared with the other pages.
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------
     DATA + LANGUAGE
     ---------------------------------------------------------- */
  const W = window.WALIFE;
  const A = W.ABOUT;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  let lang = W.LANGS.includes(store.get('walife-lang')) ? store.get('walife-lang') : W.DEFAULT_LANG;
  const t = (key) => {
    let v = W.DICT[lang][key];
    if (v === undefined) v = W.DICT[W.DEFAULT_LANG][key];
    return v === undefined ? '' : v;
  };
  const L = (o) => (typeof o === 'string' ? o : (o[lang] || o[W.DEFAULT_LANG]));
  const LEVELS = { adv: { on: 3, key: 'abLvAdv' }, int: { on: 2, key: 'abLvInt' }, base: { on: 1, key: 'abLvBase' } };
  const meter = (on) => `<span class="ab-meter" aria-hidden="true">${[0, 1, 2].map((k) =>
    `<i class="${k < on ? 'on' : ''}" style="--k:${k}"></i>`).join('')}</span>`;

  /* ----------------------------------------------------------
     RENDER
     ---------------------------------------------------------- */
  const photo = $('#ab-photo');
  photo.addEventListener('error', () => { if (!photo.dataset.fb) { photo.dataset.fb = '1'; photo.src = A.photoFallback; } });
  photo.src = A.photo;

  function renderTools() {
    $('#ab-tools').innerHTML = A.tools.map((tl) => {
      const lv = LEVELS[tl.level] || LEVELS.int;
      return `<li class="ab-tool ab-rv" style="--fg:${tl.fg};--bg:${tl.bg}">
        <span class="ab-icon" aria-hidden="true">${esc(tl.abbr)}</span>
        <span class="ab-tool-info">
          <span class="ab-tool-name">${esc(tl.name)}</span>
          <span class="ab-tool-level"><span>${esc(t(lv.key))}</span>${meter(lv.on)}</span>
        </span>
      </li>`;
    }).join('');
    $('#ab-legend').innerHTML =
      `<span>${meter(3)}${esc(t('abLvAdv'))}</span><span>${meter(2)}${esc(t('abLvInt'))}</span>`;
    $$('.ab-tool').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    });
  }

  function renderTimeline(sel, items) {
    $(sel).innerHTML = items.map((it) => `
      <li class="ab-rv">
        <span class="ab-years">${esc(it.years)}</span>
        <h3 class="ab-item-title">${esc(L(it.title))}</h3>
        <p class="ab-item-place">${esc(L(it.place))}</p>
        ${it.desc ? `<p class="ab-item-desc">${esc(L(it.desc))}</p>` : ''}
      </li>`).join('');
  }

  $('#socials').innerHTML = W.SOCIALS.map((s) => {
    const ext = /^https?:/.test(s.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li><a href="${s.url}"${ext} data-cursor="OPEN">${s.name}<span aria-hidden="true">↗</span></a></li>`;
  }).join('');
  $('#year').textContent = new Date().getFullYear();

  let revealIO = null;
  function render() {
    renderTools();
    renderTimeline('#ab-edu', A.education);
    renderTimeline('#ab-exp', A.experience);
    if (revealIO) observe();
  }

  /* ----------------------------------------------------------
     I18N
     ---------------------------------------------------------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    document.title = t('abDocTitle');
    const md = $('meta[name="description"]');
    if (md) md.content = t('abDocDesc');
    render();
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
     REVEALS + HERO GLOW
     ---------------------------------------------------------- */
  function observe() {
    $$('.ab-rv:not(.in)').forEach((el, i) => {
      el.style.transitionDelay = reduce ? '0s' : `${(i % 4) * 0.07}s`;
      revealIO.observe(el);
    });
  }
  function initReveal() {
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    observe();
  }
  const hero = $('.ab-hero');
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
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .2}px, ${(e.clientY - (r.top + r.height / 2)) * .2}px)`;
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
  $$('a[href="#contact"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo($('#contact'), { duration: 1.6 }); else $('#contact').scrollIntoView({ behavior: 'smooth' });
  }));

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
    if (fine) {
      rx = lerp(rx, mx, .18); ry = lerp(ry, my, .18);
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* intro loader (loader.js), then start the reveals */
  window.walifeLoader(() => {
    document.body.classList.add('ready');
    initReveal();
  });
})();
