/* ============================================================
   THAWALIFE - home interactions
   Loader, cursor, reveals, pinned showcase, 3D carousel,
   archive parallax, marquees, counters, service previews.
   (Badge / lanyard physics live in app.js)
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------
     PROJECTS
     Edit this list to add real work. To use a real image instead
     of the generative placeholder art, set `img: 'img/projects/xyz.jpg'`.
     `art` picks the placeholder style (1-8). The first 5 entries
     appear in the pinned showcase, all of them in the carousel.
     `url` is the project link (defaults to the archive page).
     ---------------------------------------------------------- */
  const ARCHIVE_URL = 'projects.html';
  const PROJECTS = [
    { slug: 'form',          title: 'Form',            tags: 'Brand identity / Logo system',     year: '2025', art: 1, img: '' },
    { slug: 'objects',       title: 'Objects in Motion', tags: 'Poster system / Typography',      year: '2025', art: 2, img: '' },
    { slug: 'cards',         title: 'Cards',           tags: 'Digital campaign / Social assets', year: '2024', art: 3, img: '' },
    { slug: 'orbit',         title: 'Orbit',           tags: 'Visual identity / Motion',         year: '2024', art: 4, img: '' },
    { slug: 'grid-theory',   title: 'Grid Theory',     tags: 'Editorial / Layout',               year: '2024', art: 5, img: '' },
    { slug: 'nova',          title: 'Nova',            tags: 'Packaging / Art direction',        year: '2023', art: 6, img: '' },
    { slug: 'voltage',       title: 'Voltage',         tags: 'Event branding / Poster',          year: '2023', art: 7, img: '' },
    { slug: 'sundown',       title: 'Sundown',         tags: '3D / Environment art',             year: '2023', art: 8, img: '' }
  ];
  const FEATURED = PROJECTS.slice(0, 5);

  const ART = {
    1: '<span class="big">FORM</span><span class="tag">Brand identity / 01</span><i class="sun"></i><i class="ring"></i>',
    2: '<span class="t">OBJECTS<br>IN MOTION</span><i class="dot">S02</i><span class="tag">Poster system / Series 02</span>',
    3: '<i class="c c1">A</i><i class="c c2">B</i><i class="c c3">C</i><span class="tag">Digital / 03</span>',
    4: '<span class="tag">Orbit / 04</span><i class="r r4"></i><i class="r r3"></i><i class="r r2"></i><i class="r r1"></i><i class="core"></i>',
    5: '<span class="aa">Aa</span><i class="sq"></i><i class="ln1"></i><i class="ln2"></i><i class="bar"></i><span class="tag">Grid theory / 05</span>',
    6: '<i class="b b1"></i><i class="b b2"></i><i class="b b3"></i><span class="t">NOVA</span><span class="tag">Packaging / 06</span>',
    7: '<span class="n">07</span><span class="tag">Voltage / 07</span>',
    8: '<i class="sun"></i><i class="floor"></i><span class="tag">Sundown / 08</span>'
  };
  const artHTML = (p) =>
    `<div class="art a${p.art}">${p.img ? `<img src="${p.img}" alt="" loading="lazy" draggable="false">` : ART[p.art]}</div>`;
  const hrefOf = (p) => p.url || `${ARCHIVE_URL}#${p.slug}`;
  const pad = (n) => String(n).padStart(2, '0');

  /* ----------------------------------------------------------
     RENDER: showcase, carousel, archive tiles
     ---------------------------------------------------------- */
  const scTrack = $('#showcase-track');
  scTrack.innerHTML =
    `<div class="sc-intro">
       <p class="section-index">FEATURED</p>
       <h3>${FEATURED.length} stories,<br>one scroll.</h3>
       <p>Identity, typography and digital work, each built around one strong idea.</p>
       <div class="arrow-line"><i></i>KEEP SCROLLING</div>
     </div>` +
    FEATURED.map((p, i) =>
      `<a class="sc-card" href="${hrefOf(p)}" data-cursor="VIEW">
         <div class="sc-media">
           <div class="sc-art">${artHTML(p)}</div>
           <span class="sc-chip"><b>${pad(i + 1)}</b> / ${p.year}</span>
           <span class="sc-view" aria-hidden="true">↗</span>
         </div>
         <div class="sc-meta"><h3>${p.title}</h3><p>${p.tags}</p></div>
       </a>`).join('') +
    `<div class="sc-end">
       <p class="section-index">AND THERE'S MORE</p>
       <h3>The full<br>archive.</h3>
       <p>Every project, filterable and in full detail, lives on its own page.</p>
       <a class="button button-primary magnetic" href="${ARCHIVE_URL}">All projects <span aria-hidden="true">↗</span></a>
     </div>`;
  $('#hud-total').textContent = pad(FEATURED.length);

  const cfItemsEl = $('#cf-items');
  cfItemsEl.innerHTML = PROJECTS.map((p, i) =>
    `<a class="cf-item" href="${hrefOf(p)}" data-i="${i}" draggable="false" aria-label="${p.title}">${artHTML(p)}</a>`
  ).join('');

  const COLS = [[0, 3, 6, 1, 5], [2, 5, 7, 4, 0], [4, 1, 0, 6, 3]];
  $('#ar-cols').innerHTML = COLS.map((col) =>
    `<div class="ar-col">${col.map((idx, k) =>
      `<div class="ar-tile${(k + idx) % 3 === 0 ? ' wide' : ''}">${artHTML(PROJECTS[idx])}</div>`).join('')}</div>`
  ).join('');
  $$('.ar-col').forEach((c) => { c.style.marginTop = '-240px'; });

  /* ----------------------------------------------------------
     TEXT SPLITTING
     ---------------------------------------------------------- */
  function wrapWords(root, make) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((ch) => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(' ');
            else frag.append(make(part, i++));
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    walk(root);
    return i;
  }

  $$('.split').forEach((el) => {
    el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    wrapWords(el, (word, i) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      const s = document.createElement('span');
      s.textContent = word;
      s.style.setProperty('--i', i);
      w.append(s);
      return w;
    });
  });

  const lead = $('#about-lead');
  lead.setAttribute('aria-label', lead.textContent.trim().replace(/\s+/g, ' '));
  wrapWords(lead, (word) => {
    const s = document.createElement('span');
    s.className = 'sw';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = word;
    return s;
  });
  const leadWords = $$('.sw', lead);
  let leadOn = -1;

  /* ----------------------------------------------------------
     LOADER + REVEALS
     ---------------------------------------------------------- */
  const loader = $('#loader');
  const loaderCount = $('#loader-count');
  const loaderBar = $('#loader-bar');
  let started = false;

  function startSite() {
    if (started) return;
    started = true;
    document.body.classList.remove('loading');
    loader.classList.add('done');
    setTimeout(() => {
      document.body.classList.add('ready');
      initReveals();
      initRotator();
    }, reduce ? 0 : 450);
  }

  function initReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal], .split').forEach((el) => io.observe(el));

    const statsIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        statsIO.unobserve(e.target);
        $$('b[data-count]', e.target).forEach(countUp);
      });
    }, { threshold: .4 });
    const stats = $('.stats');
    if (stats) statsIO.observe(stats);
  }

  function countUp(el) {
    const end = +el.dataset.count;
    const dur = reduce ? 0 : 1900;
    const t0 = performance.now();
    const step = (t) => {
      const p = dur ? clamp((t - t0) / dur, 0, 1) : 1;
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(end * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (reduce) {
    loader.remove();
    startSite();
  } else {
    document.body.classList.add('loading');
    let loaded = document.readyState === 'complete';
    window.addEventListener('load', () => { loaded = true; });
    const t0 = performance.now();
    const MIN = 1500;
    const loadTick = (t) => {
      let p = clamp((t - t0) / MIN, 0, 1);
      if (!loaded) p = Math.min(p, .9);
      const eased = 1 - Math.pow(1 - p, 3);
      loaderCount.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      loaderBar.style.transform = `scaleX(${eased})`;
      if (p >= 1) setTimeout(startSite, 150);
      else requestAnimationFrame(loadTick);
    };
    requestAnimationFrame(loadTick);
    setTimeout(startSite, 6000); // failsafe
  }

  /* ----------------------------------------------------------
     HERO: rotating word + spotlight
     ---------------------------------------------------------- */
  function initRotator() {
    const el = $('#rotator');
    if (!el || reduce) return;
    const words = ['visuals.', 'brands.', 'posters.', 'identities.', 'worlds.'];
    let i = 0;
    setInterval(async () => {
      if (document.hidden) return;
      i = (i + 1) % words.length;
      await el.animate(
        [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-70%)', opacity: 0 }],
        { duration: 380, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' }
      ).finished;
      el.textContent = words[i];
      await el.animate(
        [{ transform: 'translateY(70%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
        { duration: 600, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
      ).finished;
    }, 2900);
  }

  const hero = $('#home');
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
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('hidden');
    });
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

  $$('.magnetic').forEach((el) => {
    if (!fine || reduce) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * .28;
      const y = (e.clientY - (r.top + r.height / 2)) * .28;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* ----------------------------------------------------------
     HEADER, MENU, NAV
     ---------------------------------------------------------- */
  const header = $('#site-header');
  const burger = $('#burger');
  const menu = $('#menu');
  const navLinks = $$('[data-nav]');
  const navTargets = navLinks.map((a) => $(a.getAttribute('href')));

  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ----------------------------------------------------------
     MARQUEES
     ---------------------------------------------------------- */
  const marquees = $$('.marquee').map((el) => {
    const track = $('.marquee-track', el);
    track.innerHTML += track.innerHTML;
    return { track, speed: +el.dataset.speed || 1, offset: 0, half: 1 };
  });
  const measureMarquees = () => marquees.forEach((m) => { m.half = m.track.scrollWidth / 2; });

  /* ----------------------------------------------------------
     SHOWCASE (pinned horizontal scroll)
     ---------------------------------------------------------- */
  const showcase = $('#showcase');
  const scSticky = $('.showcase-sticky');
  const scCards = $$('.sc-card');
  const hudCur = $('#hud-current');
  const hudBar = $('#hud-bar');
  let scMax = 0, scCur = 0, hudIdx = -1;

  function measureShowcase() {
    scMax = Math.max(0, scTrack.scrollWidth - scSticky.clientWidth);
    showcase.style.height = (scMax + innerHeight) + 'px';
  }

  function updateShowcase() {
    const r = showcase.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const prog = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
    scCur = reduce ? prog * scMax : lerp(scCur, prog * scMax, .12);
    scTrack.style.transform = `translate3d(${-scCur.toFixed(2)}px,0,0)`;
    hudBar.style.transform = `scaleX(${prog})`;

    const mid = scSticky.getBoundingClientRect();
    const cx = mid.left + mid.width / 2;
    let best = 0, bestD = Infinity;
    scCards.forEach((c, i) => {
      const cr = c.getBoundingClientRect();
      const off = cr.left + cr.width / 2 - cx;
      const art = c.firstElementChild.firstElementChild;
      art.style.transform = `translate3d(${(-off * .1).toFixed(1)}px,0,0)`;
      if (Math.abs(off) < bestD) { bestD = Math.abs(off); best = i; }
    });
    if (best !== hudIdx) { hudIdx = best; hudCur.textContent = pad(best + 1); }
  }

  /* ----------------------------------------------------------
     3D CAROUSEL
     ---------------------------------------------------------- */
  const cfStage = $('#cf-stage');
  const cfEls = $$('.cf-item');
  const N = cfEls.length;
  const cfInfo = $('#cf-info');
  const cfGhost = $('#cf-ghost');
  let cfW = 340, pos = 0, tgt = 0, cfActive = -1;
  let cfDrag = false, cfMoved = false, cfStartX = 0, cfLastX = 0, cfVel = 0;
  let cfLastInteract = 0, cfNextAuto = 0, cfHover = false, cfVisible = false, snapT;

  const wrap = (d) => (((d + N / 2) % N) + N) % N - N / 2;
  const measureCf = () => { cfW = cfEls[0].offsetWidth || 340; };

  function setActive(idx, instant) {
    cfActive = idx;
    cfEls.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    const p = PROJECTS[idx];
    const apply = () => {
      $('#cf-num').textContent = `${pad(idx + 1)} / ${pad(N)}`;
      $('#cf-title').textContent = p.title;
      $('#cf-tags').textContent = `${p.tags}  ·  ${p.year}`;
      $('#cf-link').href = hrefOf(p);
      cfGhost.textContent = pad(idx + 1);
      cfInfo.classList.remove('swap');
    };
    if (instant || reduce) return apply();
    cfInfo.classList.add('swap');
    setTimeout(apply, 220);
  }

  function renderCf() {
    for (let i = 0; i < N; i++) {
      const el = cfEls[i];
      const d = wrap(i - pos);
      const ad = Math.abs(d);
      if (ad > 3.3) { el.style.visibility = 'hidden'; continue; }
      el.style.visibility = '';
      const sg = Math.sign(d);
      const x = sg * (Math.min(ad, 1) * cfW * .74 + Math.max(0, ad - 1) * cfW * .3);
      const z = -Math.min(ad, 3) * 150;
      const ry = -clamp(d, -1.4, 1.4) * 40;
      const s = 1 - Math.min(ad, 3) * .06;
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.setProperty('--dim', clamp(ad * .38, 0, .8).toFixed(3));
    }
    const idx = ((Math.round(pos) % N) + N) % N;
    if (idx !== cfActive) setActive(idx, cfActive === -1);
  }

  const goTo = (i) => {
    const base = Math.round(tgt);
    tgt = base + wrap(i - base);
    cfLastInteract = performance.now();
  };
  const step = (n) => { tgt = Math.round(tgt) + n; cfLastInteract = performance.now(); };

  cfStage.addEventListener('dragstart', (e) => e.preventDefault());
  cfStage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cfDrag = true; cfMoved = false;
    cfStartX = cfLastX = e.clientX;
    cfVel = 0;
    cfLastInteract = performance.now();
    cfStage.classList.add('dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!cfDrag) return;
    const dx = e.clientX - cfLastX;
    if (Math.abs(e.clientX - cfStartX) > 6) cfMoved = true;
    tgt -= dx / (cfW * .55);
    cfVel = lerp(cfVel, dx, .4);
    cfLastX = e.clientX;
  });
  const endDrag = () => {
    if (!cfDrag) return;
    cfDrag = false;
    cfStage.classList.remove('dragging');
    const fling = clamp(-cfVel / (cfW * .55) * 6, -2, 2);
    tgt = Math.round(tgt + fling);
    cfLastInteract = performance.now();
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  cfStage.addEventListener('click', (e) => {
    if (cfMoved) { e.preventDefault(); cfMoved = false; return; }
    const item = e.target.closest('.cf-item');
    if (item && +item.dataset.i !== ((Math.round(pos) % N) + N) % N) {
      e.preventDefault();
      goTo(+item.dataset.i);
    }
  }, true);

  cfStage.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    tgt += e.deltaX * .006;
    cfLastInteract = performance.now();
    clearTimeout(snapT);
    snapT = setTimeout(() => { tgt = Math.round(tgt); }, 140);
  }, { passive: false });

  cfStage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  $('#cf-next').addEventListener('click', () => step(1));
  $('#cf-prev').addEventListener('click', () => step(-1));
  cfStage.addEventListener('pointerenter', () => { cfHover = true; });
  cfStage.addEventListener('pointerleave', () => { cfHover = false; });
  new IntersectionObserver((en) => { cfVisible = en[0].isIntersecting; }, { threshold: .35 })
    .observe(cfStage);

  function updateCf(now) {
    if (!cfDrag && !reduce && cfVisible && !cfHover && now - cfLastInteract > 4500 && now > cfNextAuto) {
      tgt = Math.round(tgt) + 1;
      cfNextAuto = now + 3800;
    }
    pos = reduce ? tgt : lerp(pos, tgt, cfDrag ? .35 : .09);
    if (Math.abs(pos - tgt) < .0005) pos = tgt;
    renderCf();
  }

  /* ----------------------------------------------------------
     ARCHIVE parallax
     ---------------------------------------------------------- */
  const archive = $('#archive');
  const arCols = $$('.ar-col');
  const arSpeed = [-1, 1.5, -.8];
  function updateArchive() {
    const r = archive.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
    arCols.forEach((c, i) => {
      c.style.transform = `translate3d(0,${((p - .5) * arSpeed[i] * 360).toFixed(1)}px,0)`;
    });
  }

  /* ----------------------------------------------------------
     SERVICES hover preview
     ---------------------------------------------------------- */
  const svcPrev = $('#svc-preview');
  const svcList = $('.service-list');
  let px = 0, py = 0, tx = 0, ty = 0;
  if (fine) {
    $$('.service-row').forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        svcPrev.innerHTML = artHTML(PROJECTS[+row.dataset.preview]);
        if (!svcPrev.classList.contains('show')) { px = tx = e.clientX; py = ty = e.clientY; }
        svcPrev.classList.add('show');
      });
    });
    svcList.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
    svcList.addEventListener('pointerleave', () => svcPrev.classList.remove('show'));
  }

  /* ----------------------------------------------------------
     MAIN LOOP
     ---------------------------------------------------------- */
  const progress = $('#scroll-progress');
  let lastY = scrollY, lastT = performance.now();

  function tick(now) {
    const dt = clamp((now - lastT) / 16.67, .5, 3);
    lastT = now;
    const y = scrollY;
    const dy = y - lastY;
    lastY = y;

    // progress + header
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 20);
    if (!menu.classList.contains('open')) {
      if (y > 240 && dy > 2) header.classList.add('hide');
      else if (dy < -2 || y < 240) header.classList.remove('hide');
    }

    // nav highlight
    let act = -1;
    navTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= innerHeight * .5) act = i; });
    navLinks.forEach((a, i) => a.classList.toggle('active', i === act));

    // marquees
    const vel = clamp(dy, -80, 80);
    marquees.forEach((m) => {
      const dir = Math.sign(m.speed);
      m.offset += (Math.abs(m.speed) * .9 + Math.abs(vel) * .22) * dir * dt;
      const x = -(((m.offset % m.half) + m.half) % m.half);
      m.track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-vel * .12).toFixed(2)}deg)`;
    });

    updateShowcase();
    updateCf(now);
    updateArchive();

    // about text fill
    const lr = lead.getBoundingClientRect();
    const lp = clamp((innerHeight * .88 - lr.top) / (innerHeight * .5), 0, 1);
    const on = Math.round(lp * leadWords.length);
    if (on !== leadOn) {
      leadWords.forEach((w, i) => w.classList.toggle('on', i < on));
      leadOn = on;
    }

    // cursor + preview
    if (fine) {
      rx = lerp(rx, mx, .18); ry = lerp(ry, my, .18);
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      px = lerp(px, tx, .14); py = lerp(py, ty, .14);
      svcPrev.style.transform = `translate3d(${px + 36}px,${py - 100}px,0) rotate(${clamp((tx - px) * .06, -8, 8)}deg)`;
    }

    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------
     LAYOUT + BOOT
     ---------------------------------------------------------- */
  function layout() {
    measureShowcase();
    measureCf();
    measureMarquees();
  }
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(layout, 120); });
  window.addEventListener('load', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

  layout();
  renderCf();
  requestAnimationFrame(tick);
})();
