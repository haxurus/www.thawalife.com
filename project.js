/* ============================================================
   WALIFE - single project page (project.html?p=<slug>)
   Content: data.js (PROJECTS) + project-pages.js (PAGES).
   Blocks: text / heading / quote / label / cta / gallery /
   video / youtube / book (page-by-page viewer) + lightbox.
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------
     DATA + LANGUAGE
     ---------------------------------------------------------- */
  const W = window.WALIFE;
  const { PROJECTS, CATEGORIES } = W;
  const PAGES = W.PAGES || {};
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  let lang = W.LANGS.includes(store.get('walife-lang')) ? store.get('walife-lang') : W.DEFAULT_LANG;
  const t = (key, vars) => {
    let v = W.DICT[lang][key];
    if (v === undefined) v = W.DICT[W.DEFAULT_LANG][key];
    if (typeof v === 'string' && vars) Object.keys(vars).forEach((k) => { v = v.split(`{${k}}`).join(vars[k]); });
    return v === undefined ? '' : v;
  };
  const L = (o) => (typeof o === 'string' ? o : (o[lang] || o[W.DEFAULT_LANG]));
  const projectUrl = (p) => `project.html?p=${encodeURIComponent(p.slug)}`;
  const yearOf = (p) => p.date.slice(0, 4);

  const slug = new URLSearchParams(location.search).get('p');
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const P = PROJECTS[idx];
  const PAGE = P ? (PAGES[P.slug] || { links: [], blocks: [] }) : null;
  const N = PROJECTS.length;

  const textEls = [];  // { el, block } -> re-translated on language change
  const lbList = [];   // images of the galleries, in page order

  /* ----------------------------------------------------------
     RENDER: intro, cover, blocks, prev/next
     ---------------------------------------------------------- */
  function renderMeta() {
    if (!P) return;
    const cats = (P.cats || []).map((c) => L(CATEGORIES[c])).join(' · ');
    const links = (PAGE.links || []).map((l) =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" data-cursor="OPEN">${esc(L(l))} <span aria-hidden="true">↗</span></a>`).join('');
    $('#pg-meta').innerHTML =
      `<div><dt>${esc(t('pgYear'))}</dt><dd>${yearOf(P)}</dd></div>` +
      (cats ? `<div><dt>${esc(t('pgCats'))}</dt><dd>${esc(cats)}</dd></div>` : '') +
      (links ? `<div><dt>${esc(t('pgLinks'))}</dt><dd>${links}</dd></div>` : '');
  }

  function textBlock(tag, cls, b) {
    const wrap = document.createElement('div');
    wrap.className = 'pg-text pg-block';
    const el = document.createElement(tag);
    el.className = cls;
    wrap.append(el);
    textEls.push({ el, b });
    return wrap;
  }

  /* split a gallery into runs of similar orientation, each with its own grid */
  function galleryRuns(items) {
    const kind = (it) => {
      const r = it.w / it.h;
      if (r >= 1.9) return 'wide';
      if (r >= 1.1) return 'land';
      if (r >= 0.9) return 'square';
      return 'port';
    };
    const runs = [];
    items.forEach((it) => {
      const k = kind(it);
      const last = runs[runs.length - 1];
      if (last && last.kind === k) last.items.push(it);
      else runs.push({ kind: k, items: [it] });
    });
    return runs.map((run) => {
      const n = run.items.length;
      let cls = 'cols-1';
      if (run.kind === 'land' && n > 1) cls = 'cols-2';
      if (run.kind === 'square') cls = n === 1 ? 'cols-1 narrow' : (n >= 3 ? 'cols-3' : 'cols-2');
      if (run.kind === 'port') cls = n === 1 ? 'cols-1 narrow' : (n === 2 || n === 4 ? 'cols-2' : 'cols-3');
      return { cls, items: run.items };
    });
  }

  function renderGallery(b) {
    const frag = document.createDocumentFragment();
    galleryRuns(b.items).forEach((run) => {
      const g = document.createElement('div');
      g.className = `pg-gal ${run.cls} pg-block`;
      run.items.forEach((it) => {
        const i = lbList.push({ src: it.src, w: it.w, h: it.h }) - 1;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pg-shot';
        btn.dataset.lb = i;
        btn.dataset.cursor = 'ZOOM';
        btn.style.aspectRatio = `${it.w} / ${it.h}`;
        btn.innerHTML = `<img src="${it.src}" width="${it.w}" height="${it.h}" alt="" loading="lazy" decoding="async">`;
        btn.addEventListener('click', () => openLightbox(lbList, i));
        g.append(btn);
      });
      frag.append(g);
    });
    return frag;
  }

  function renderVideo(b) {
    const box = document.createElement('div');
    box.className = 'pg-media pg-block';
    box.style.aspectRatio = `${b.w} / ${b.h}`;
    const v = document.createElement('video');
    v.src = b.src;
    v.poster = b.poster;
    v.playsInline = true;
    if (b.loop) {
      v.muted = true;
      v.loop = true;
      v.preload = 'metadata';
      if (!reduce) {
        new IntersectionObserver((en) => {
          en.forEach((e) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
        }, { threshold: .25 }).observe(v);
      } else v.controls = true;
    } else {
      v.controls = true;
      v.preload = 'none';
    }
    box.append(v);
    return box;
  }

  function renderYoutube(b) {
    const box = document.createElement('div');
    box.className = 'pg-media pg-yt pg-block';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.cursor = 'PLAY';
    btn.innerHTML = `<img src="https://i.ytimg.com/vi/${b.id}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶ <b></b></span>`;
    textEls.push({ el: $('b', btn), key: 'pgPlay' });
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${b.id}?autoplay=1&rel=0`;
      f.title = 'YouTube video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      box.replaceChildren(f);
    });
    box.append(btn);
    return box;
  }

  /* page-by-page viewer: cover alone, then spreads (desktop) or single pages (mobile) */
  let bookApi = null;
  function renderBook(b) {
    const pages = b.pages;
    const box = document.createElement('div');
    box.className = 'pg-book pg-block';
    box.innerHTML = `
      <div class="pg-book-stage" tabindex="0"></div>
      <div class="pg-book-bar">
        <button type="button" class="bk-prev" aria-label="">←</button>
        <input type="range" min="0" value="0" aria-label="">
        <span class="pg-book-count"></span>
        <button type="button" class="bk-next" aria-label="">→</button>
      </div>
      <p class="pg-book-hint"></p>`;
    const stage = $('.pg-book-stage', box);
    const range = $('input', box);
    const count = $('.pg-book-count', box);
    const bPrev = $('.bk-prev', box);
    const bNext = $('.bk-next', box);
    const pageList = pages.map((p) => ({ src: p.src, w: p.w, h: p.h }));
    const isWide = () => innerWidth >= 760;
    let spreads = [];
    let s = 0;
    const build = () => {
      spreads = [];
      if (isWide()) {
        spreads.push([0]);
        for (let i = 1; i < pages.length; i += 2) spreads.push(i + 1 < pages.length ? [i, i + 1] : [i]);
      } else {
        pages.forEach((_, i) => spreads.push([i]));
      }
      range.max = spreads.length - 1;
    };
    const pageBtn = (i) => {
      if (i === undefined) return '<span class="pg-page empty"></span>';
      return `<button type="button" class="pg-page" data-i="${i}" data-cursor="ZOOM"><img src="${pages[i].src}" alt="${t('pgPage')} ${i + 1}" decoding="async"></button>`;
    };
    const show = (next, dir) => {
      s = clamp(next, 0, spreads.length - 1);
      const sp = spreads[s];
      const single = sp.length === 1;
      stage.classList.toggle('single', single);
      stage.innerHTML = single ? pageBtn(sp[0]) : pageBtn(sp[0]) + pageBtn(sp[1]);
      stage.classList.remove('turn-next', 'turn-prev');
      if (dir && !reduce) { void stage.offsetWidth; stage.classList.add(dir > 0 ? 'turn-next' : 'turn-prev'); }
      $$('.pg-page', stage).forEach((el) => el.addEventListener('click', () => openLightbox(pageList, +el.dataset.i)));
      range.value = s;
      label();
      bPrev.disabled = s === 0;
      bNext.disabled = s === spreads.length - 1;
      /* preload the following spread */
      (spreads[s + 1] || []).forEach((i) => { const im = new Image(); im.src = pages[i].src; });
    };
    const label = () => {
      const sp = spreads[s];
      const a = sp[0] + 1;
      const z = sp[sp.length - 1] + 1;
      count.textContent = `${t('pgPage')} ${a === z ? a : `${a}–${z}`} ${t('pgOf')} ${pages.length}`;
      bPrev.setAttribute('aria-label', t('pgBookPrev'));
      bNext.setAttribute('aria-label', t('pgBookNext'));
      range.setAttribute('aria-label', t('pgPage'));
      $('.pg-book-hint', box).textContent = t('pgBookHint');
    };
    bPrev.addEventListener('click', () => show(s - 1, -1));
    bNext.addEventListener('click', () => show(s + 1, 1));
    range.addEventListener('input', () => show(+range.value, +range.value > s ? 1 : -1));
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(s + 1, 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(s - 1, -1); }
    });
    let wasWide = isWide();
    window.addEventListener('resize', () => {
      if (isWide() === wasWide) return;
      wasWide = isWide();
      const first = spreads[s][0];
      build();
      show(spreads.findIndex((sp) => sp.includes(first)));
    });
    build();
    show(0);
    bookApi = { label };
    return box;
  }

  function renderBody() {
    const body = $('#pg-body');
    if (!P) {
      body.innerHTML = `<div class="pg-missing pg-text"><a href="projects.html" data-i18n="pgNotFoundLink"></a></div>`;
      return;
    }
    let firstP = true;
    PAGE.blocks.forEach((b) => {
      let node = null;
      switch (b.type) {
        case 'p': node = textBlock('p', 'pg-p' + (firstP ? ' lead' : ''), b); firstP = false; break;
        case 'h': node = textBlock('h3', 'pg-h', b); break;
        case 'label': node = textBlock('p', 'pg-label', b); break;
        case 'quote': node = textBlock('blockquote', 'pg-quote', b); break;
        case 'cta': {
          const a = document.createElement('a');
          a.className = 'pg-cta pg-block magnetic';
          a.href = b.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.dataset.cursor = 'OPEN';
          a.innerHTML = '<span></span><span aria-hidden="true">↗</span>';
          textEls.push({ el: a.firstElementChild, b });
          node = a;
          break;
        }
        case 'gallery': node = renderGallery(b); break;
        case 'video': node = renderVideo(b); break;
        case 'youtube': node = renderYoutube(b); break;
        case 'book': node = renderBook(b); break;
        default: break;
      }
      if (node) body.append(node);
    });
  }

  function renderNav() {
    if (!P) { $('#pg-nav').hidden = true; return; }
    const prev = PROJECTS[(idx - 1 + N) % N];
    const next = PROJECTS[(idx + 1) % N];
    $('#pg-nav').innerHTML =
      `<a class="prev" href="${projectUrl(prev)}" data-cursor="PREV"><img src="${prev.img}" alt="" loading="lazy"><span data-i18n="pgPrev"></span><strong data-pt="${prev.slug}"></strong></a>` +
      `<a class="next" href="${projectUrl(next)}" data-cursor="NEXT"><img src="${next.img}" alt="" loading="lazy"><span data-i18n="pgNext"></span><strong data-pt="${next.slug}"></strong></a>`;
  }

  if (P) {
    $('#pg-cover').src = P.img;
  } else {
    $('#pg-cover-wrap').hidden = true;
  }
  renderBody();
  renderNav();

  $('#socials').innerHTML = W.SOCIALS.map((s) => {
    const ext = /^https?:/.test(s.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li><a href="${s.url}"${ext} data-cursor="OPEN">${s.name}<span aria-hidden="true">↗</span></a></li>`;
  }).join('');
  $('#year').textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     I18N
     ---------------------------------------------------------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-pt]').forEach((el) => { el.textContent = L(PROJECTS.find((x) => x.slug === el.dataset.pt).title); });
    textEls.forEach(({ el, b, key }) => { el.textContent = key ? t(key) : L(b); });

    if (P) {
      document.title = `${L(P.title)} – Walife`;
      $('#pg-title').textContent = L(P.title);
      $('#pg-idx').textContent = t('pgIdx', { n: pad(idx + 1), t: pad(N) });
      const md = $('meta[name="description"]');
      if (md) md.content = L(P.desc);
      renderMeta();
    } else {
      document.title = `${t('pgNotFound')} – Walife`;
      $('#pg-title').textContent = t('pgNotFound');
      $('#pg-idx').textContent = t('pjIdx');
    }
    if (bookApi) bookApi.label();
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
     LIGHTBOX
     ---------------------------------------------------------- */
  const lb = $('#lb');
  const lbImg = $('#lb-img');
  let lbItems = [];
  let lbI = 0;
  let lastFocus = null;
  function lbShow(i, animate) {
    lbI = (i + lbItems.length) % lbItems.length;
    const go = () => {
      lbImg.src = lbItems[lbI].src;
      lbImg.classList.remove('swap');
      $('#lb-count').textContent = `${pad(lbI + 1)} / ${pad(lbItems.length)}`;
      const nx = lbItems[(lbI + 1) % lbItems.length];
      if (nx) { const im = new Image(); im.src = nx.src; }
    };
    if (animate && !reduce) { lbImg.classList.add('swap'); setTimeout(go, 180); } else go();
    const multi = lbItems.length > 1;
    $('#lb-prev').hidden = !multi;
    $('#lb-next').hidden = !multi;
  }
  function openLightbox(items, i) {
    lbItems = items;
    lastFocus = document.activeElement;
    lbShow(i, false);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    $('#lb-close').focus();
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  $('#lb-close').addEventListener('click', closeLightbox);
  $('#lb-prev').addEventListener('click', () => lbShow(lbI - 1, true));
  $('#lb-next').addEventListener('click', () => lbShow(lbI + 1, true));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLightbox(); });
  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbShow(lbI + 1, true);
    if (e.key === 'ArrowLeft') lbShow(lbI - 1, true);
  });
  let swipeX = null;
  lb.addEventListener('pointerdown', (e) => { swipeX = e.clientX; });
  lb.addEventListener('pointerup', (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 60 && lbItems.length > 1) lbShow(lbI + (dx < 0 ? 1 : -1), true);
  });

  /* ----------------------------------------------------------
     REVEALS + HERO GLOW
     ---------------------------------------------------------- */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    $$('.pg-block').forEach((el) => io.observe(el));
  }
  const hero = $('.pg-hero');
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
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });

  let lenis = null;
  if (window.Lenis && !reduce) lenis = new window.Lenis({ lerp: .085 });
  $$('a[href="#contact"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo($('#contact'), { duration: 1.6 }); else $('#contact').scrollIntoView({ behavior: 'smooth' });
  }));
  $('#to-top').addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     MAIN LOOP
     ---------------------------------------------------------- */
  const progress = $('#scroll-progress');
  const coverWrap = $('#pg-cover-wrap');
  const coverImg = $('#pg-cover');
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
    if (P && !reduce) {
      const r = coverWrap.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        coverImg.style.transform = `translate3d(0,${(clamp(-r.top, -innerHeight, innerHeight) * .18).toFixed(1)}px,0)`;
      }
    }
    if (fine) {
      rx = lerp(rx, mx, .18); ry = lerp(ry, my, .18);
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* boot with a timer (not rAF) so it also runs in background tabs */
  setTimeout(() => {
    document.body.classList.add('ready');
    initReveal();
  }, 30);
})();
