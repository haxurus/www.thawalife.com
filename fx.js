/* ============================================================
   WALIFE - home interactions
   i18n (IT/EN), loader, cursor, reveals,
   3D carousel, archive parallax, marquees, counters, previews.
   Content lives in data.js. Badge / lanyard physics: app.js.
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
     DATA + LANGUAGE
     ---------------------------------------------------------- */
  const W = window.WALIFE;
  const { PROJECTS, ARCHIVE_URL } = W;
  const bySlug = (s) => PROJECTS.find((p) => p.slug === s);

  let lang = W.DEFAULT_LANG;
  try {
    const saved = localStorage.getItem('walife-lang');
    if (W.LANGS.includes(saved)) lang = saved;
  } catch (e) { /* storage unavailable */ }

  const t = (key, vars) => {
    let v = W.DICT[lang][key];
    if (v === undefined) v = W.DICT[W.DEFAULT_LANG][key];
    if (typeof v === 'string' && vars) Object.keys(vars).forEach((k) => { v = v.replace(`{${k}}`, vars[k]); });
    return v === undefined ? '' : v;
  };
  const L = (o) => (typeof o === 'string' ? o : (o[lang] || o[W.DEFAULT_LANG]));

  const artHTML = (p, eager) =>
    `<div class="art"><img src="${p.img}" alt="" loading="${eager ? 'eager' : 'lazy'}" decoding="async" draggable="false"></div>`;
  const hrefOf = (p) => p.url || `project.html?p=${encodeURIComponent(p.slug)}`;
  const yearOf = (p) => p.date.slice(0, 4);
  const pad = (n) => String(n).padStart(2, '0');

  /* ----------------------------------------------------------
     RENDER: carousel, archive tiles, socials
     ---------------------------------------------------------- */

  const cfItemsEl = $('#cf-items');
  cfItemsEl.innerHTML = PROJECTS.map((p, i) =>
    `<a class="cf-item" href="${hrefOf(p)}" data-i="${i}" data-slug="${p.slug}" draggable="false">${artHTML(p, true)}</a>`
  ).join('');

  const COLS = [[0, 3, 6, 1, 4], [2, 5, 8, 7, 0], [4, 7, 1, 6, 3]];
  $('#ar-cols').innerHTML = COLS.map((col) =>
    `<div class="ar-col">${col.map((idx, k) =>
      `<div class="ar-tile${(k + idx) % 3 === 0 ? ' wide' : ''}">${artHTML(PROJECTS[idx % PROJECTS.length])}</div>`).join('')}</div>`
  ).join('');
  $$('.ar-col').forEach((c) => { c.style.marginTop = '-240px'; });

  $('#socials').innerHTML = W.SOCIALS.map((s) => {
    const ext = /^https?:/.test(s.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li><a href="${s.url}"${ext} data-cursor="OPEN">${s.name}<span aria-hidden="true">↗</span></a></li>`;
  }).join('');

  $('#badge-links').innerHTML = W.SOCIALS.map((s) =>
    `<li><a href="${s.url}"><span>${s.name}</span><b>${s.handle}</b></a></li>`).join('');

  /* ----------------------------------------------------------
     TEXT SPLITTING (headings, about lead, contact letters)
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

  function splitHeading(el) {
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
  }

  const contactText = $('#contact-text');
  const cLetters = [];
  function splitContact() {
    cLetters.length = 0;
    const txt = contactText.textContent;
    contactText.parentElement.setAttribute('aria-label', txt);
    contactText.textContent = '';
    [...txt].forEach((ch) => {
      if (ch === ' ') { contactText.append(' '); return; }
      const s = document.createElement('span');
      s.className = 'cl';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      contactText.append(s);
      cLetters.push(s);
    });
  }

  /* ----------------------------------------------------------
     I18N: apply strings, then re-split the animated texts
     ---------------------------------------------------------- */
  let rotI = 0;
  function applyStatic() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n, {}); });
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));

    document.title = t('docTitle');
    const md = $('meta[name="description"]');
    if (md) md.content = t('docDesc');
    const ogt = $('meta[property="og:title"]');
    if (ogt) ogt.content = t('docTitle');
    const ogd = $('meta[property="og:description"]');
    if (ogd) ogd.content = t('docDesc');

    $('#h1').setAttribute('aria-label', t('h1aria'));
    rotI = 0;
    $('#rotator').textContent = t('rot')[0];
    $('#orb-text').textContent = t('arOrb');

    $$('[data-pt]').forEach((el) => { el.textContent = L(bySlug(el.dataset.pt).title); });
    $$('[data-ptag]').forEach((el) => { el.textContent = L(bySlug(el.dataset.ptag).tags); });
    $$('.cf-item').forEach((a) => a.setAttribute('aria-label', L(bySlug(a.dataset.slug).title)));

    $$('.split').forEach(splitHeading);
    splitContact();

    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  applyStatic();

  /* ----------------------------------------------------------
     LOADER + REVEALS
     ---------------------------------------------------------- */
  const loader = $('#loader');
  const loaderCount = $('#loader-count');
  const loaderBar = $('#loader-bar');
  const loaderFill = $('#loader-fill');
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
        if (e.isIntersecting) {
          e.target.classList.add('in');
          if (e.target.classList.contains('section-index')) scramble(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal], .split').forEach((el) => io.observe(el));

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
      loaderFill.style.clipPath = `inset(${((1 - eased) * 100).toFixed(1)}% 0 0 0)`;
      if (p >= 1) setTimeout(startSite, 150);
      else requestAnimationFrame(loadTick);
    };
    requestAnimationFrame(loadTick);
    setTimeout(startSite, 3500); // failsafe
  }

  /* ----------------------------------------------------------
     HERO: rotating word + spotlight
     ---------------------------------------------------------- */
  function initRotator() {
    const el = $('#rotator');
    if (!el || reduce) return;
    setInterval(async () => {
      if (document.hidden) return;
      const words = t('rot');
      rotI = (rotI + 1) % words.length;
      const next = words[rotI];
      await el.animate(
        [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-70%)', opacity: 0 }],
        { duration: 380, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' }
      ).finished;
      el.textContent = next;
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
      $('#cf-title').textContent = L(p.title);
      $('#cf-tags').textContent = `${L(p.tags)}  ·  ${yearOf(p)}`;
      $('#cf-desc').textContent = L(p.desc);
      $('#cf-link').href = hrefOf(p);
      cfGhost.textContent = pad(idx + 1);
      cfInfo.classList.remove('swap');
      updateGlow(idx);
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
        svcPrev.innerHTML = artHTML(bySlug(row.dataset.preview));
        if (!svcPrev.classList.contains('show')) { px = tx = e.clientX; py = ty = e.clientY; }
        svcPrev.classList.add('show');
      });
    });
    svcList.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
    svcList.addEventListener('pointerleave', () => svcPrev.classList.remove('show'));
  }


  /* ----------------------------------------------------------
     TEXT SCRAMBLE (decode effect)
     ---------------------------------------------------------- */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>+*#';
  function scramble(el) {
    if (reduce || el._sc) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
    if (!nodes.length) return;
    const orig = nodes.map((n) => n.textContent);
    const total = 16;
    let frame = 0;
    el._sc = true;
    (function stepFn() {
      frame++;
      nodes.forEach((n, k) => {
        const o = orig[k];
        let out = '';
        for (let i = 0; i < o.length; i++) {
          const ch = o[i];
          if (/\s/.test(ch)) out += ch;
          else out += i < (o.length * frame) / total ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        n.textContent = out;
      });
      if (frame < total) setTimeout(stepFn, 30);
      else { nodes.forEach((n, k) => { n.textContent = orig[k]; }); el._sc = false; }
    })();
  }
  $$('.site-nav a, .button, .cf-link, .to-top, .menu a').forEach((el) =>
    el.addEventListener('pointerenter', () => scramble(el)));

  /* ----------------------------------------------------------
     SMOOTH SCROLL (Lenis, optional)
     ---------------------------------------------------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: .085, wheelMultiplier: 1 });
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const t = id.length > 1 ? $(id) : null;
        if (id === '#home') { e.preventDefault(); lenis.scrollTo(0, { duration: 1.8 }); }
        else if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.8, offset: 0 }); }
      });
    });
  }

  /* ----------------------------------------------------------
     WEBGL BACKGROUND (flowing aurora, reacts to mouse + scroll)
     ---------------------------------------------------------- */
  const GL = (() => {
    const c = $('#gl');
    if (!c) return null;
    const gl = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { c.style.display = 'none'; return null; }
    const vs = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    const fs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r; uniform float t; uniform vec2 m; uniform float s;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
  vec2 mm=(m-.5*r)/r.y;
  float d=length(p-mm);
  vec2 q=p*1.5+vec2(0.,s*2.);
  vec2 w=vec2(fbm(q+t*.06),fbm(q+vec2(5.2,1.3)-t*.05));
  float f=fbm(q+2.4*w+(p-mm)*exp(-d*3.2)*.7);
  vec3 c1=vec3(.0,.02,.012),c2=vec3(.03,.62,.34),c3=vec3(.55,1.,.74);
  vec3 col=mix(c1,c2,smoothstep(.34,.72,f));
  col=mix(col,c3,smoothstep(.6,.9,f)*.8);
  col+=c3*.45*exp(-d*3.6);
  col=mix(col,col.gbr*vec3(.7,1.,1.25),clamp(s*1.4,0.,.5));
  col*=1.15*(.9-.55*length(uv-.5));
  gl_FragColor=vec4(col,1.);
}`;
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { c.style.display = 'none'; return null; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = { r: gl.getUniformLocation(prog, 'r'), t: gl.getUniformLocation(prog, 't'), m: gl.getUniformLocation(prog, 'm'), s: gl.getUniformLocation(prog, 's') };
    let q = fine ? .5 : .32;
    let ema = 16, frames = 0;
    const api = {
      off: false,
      /* adaptive quality: lower resolution when frames are slow, switch off if still too slow */
      adapt(ms) {
        if (api.off) return;
        ema = ema * .93 + Math.min(ms, 200) * .07;
        if (++frames < 45 || ema < 34) return;
        frames = 0; ema = 20;
        if (q > .22) { q *= .7; api.size(); }
        else { api.off = true; c.style.display = 'none'; }
      },
      size() {
        c.width = Math.ceil(innerWidth * q);
        c.height = Math.ceil(innerHeight * q);
        gl.viewport(0, 0, c.width, c.height);
      },
      draw(t, x, y, sc) {
        gl.uniform2f(U.r, c.width, c.height);
        gl.uniform1f(U.t, t);
        gl.uniform2f(U.m, x * q, (innerHeight - y) * q);
        gl.uniform1f(U.s, sc);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
    api.size();
    return api;
  })();
  let gmx = innerWidth * .65, gmy = innerHeight * .4;

  /* ----------------------------------------------------------
     HERO: mouse trail of projects + scroll parallax
     ---------------------------------------------------------- */
  const heroCopy = $('.hero-copy');
  let trailAcc = 0, trailIdx = 0, tlx = null, tly = null, trailCount = 0;
  if (fine && !reduce) {
    hero.addEventListener('pointermove', (e) => {
      if (e.target.closest('.hero-copy a, .hero-copy button')) return;
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      let dx = 0, dy = 0;
      if (tlx !== null) { dx = x - tlx; dy = y - tly; trailAcc += Math.hypot(dx, dy); }
      tlx = x; tly = y;
      if (trailAcc < 26 || trailCount > 28) return;
      trailAcc = 0;

      /* small particle: a tiny crop of a project cover that drifts and fades */
      const size = 22 + Math.random() * 28;
      const el = document.createElement('div');
      el.className = 'trail' + (Math.random() < .5 ? ' round' : '');
      el.innerHTML = artHTML(PROJECTS[trailIdx++ % PROJECTS.length]);
      el.style.width = el.style.height = size.toFixed(0) + 'px';
      el.style.left = (x - size / 2 + (Math.random() - .5) * 14) + 'px';
      el.style.top = (y - size / 2 + (Math.random() - .5) * 14) + 'px';
      hero.append(el);
      trailCount++;

      const rot = (Math.random() - .5) * 140;
      const driftX = (Math.random() - .5) * 46 + dx * 1.4;
      const driftY = 18 + Math.random() * 38 + dy * 1.4;
      el.animate([
        { transform: 'translate(0,0) scale(.2) rotate(0deg)', opacity: 0 },
        { transform: `translate(${driftX * .15}px,${driftY * .1}px) scale(1) rotate(${rot * .2}deg)`, opacity: 1, offset: .15 },
        { transform: `translate(${driftX}px,${driftY}px) scale(.1) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: 650 + Math.random() * 450, easing: 'cubic-bezier(.2,.6,.3,1)' }).finished
        .then(() => { el.remove(); trailCount--; }, () => { el.remove(); trailCount--; });
    });
    hero.addEventListener('pointerleave', () => { tlx = tly = null; });
  }

  /* ----------------------------------------------------------
     GLARE + PARALLAX (active carousel card)
     ---------------------------------------------------------- */
  function addGlare(host) {
    const g = document.createElement('i');
    g.className = 'glare';
    host.append(g);
    return g;
  }
  if (fine && !reduce) {
    cfEls.forEach((el) => {
      const g = addGlare(el);
      const art = $('.art', el);
      el.addEventListener('pointermove', (e) => {
        if (!el.classList.contains('is-active') || cfDrag) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        art.style.transform = `translate3d(${((.5 - px) * 22).toFixed(1)}px,${((.5 - py) * 22).toFixed(1)}px,0)`;
        g.style.setProperty('--gx', (px * 100) + '%');
        g.style.setProperty('--gy', (py * 100) + '%');
        el.classList.add('is-tilting');
      });
      el.addEventListener('pointerleave', () => { art.style.transform = ''; el.classList.remove('is-tilting'); });
    });
  }

  /* spotlight (stats cells + service rows) */
  $$('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    });
  });

  /* click burst */
  if (!reduce) {
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      for (let i = 0; i < 10; i++) {
        const b = document.createElement('i');
        b.className = 'burst';
        b.style.left = e.clientX + 'px';
        b.style.top = e.clientY + 'px';
        document.body.append(b);
        const a = (Math.PI * 2 * i) / 10 + Math.random() * .5;
        const d = 34 + Math.random() * 46;
        b.animate([
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(0)`, opacity: 0 }
        ], { duration: 650 + Math.random() * 250, easing: 'cubic-bezier(.1,.7,.3,1)' }).finished
          .then(() => b.remove(), () => b.remove());
      }
    });
  }

  /* contact: wave letters (letters are built by splitContact) */
  const contactLink = $('.contact-main a');
  if (fine && !reduce) {
    contactLink.addEventListener('pointermove', (e) => {
      cLetters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const k = Math.max(0, 1 - Math.hypot(dx, dy) / 190);
        l.style.transform = `translateY(${(-k * 26).toFixed(1)}px) scale(${(1 + k * .12).toFixed(3)})`;
        l.style.color = k > .35 ? 'var(--accent-bright)' : '';
      });
    });
    contactLink.addEventListener('pointerleave', () => cLetters.forEach((l) => { l.style.transform = ''; l.style.color = ''; }));
  }

  /* clock */
  const clock = $('#clock');
  const fmt = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
  const tickClock = () => { clock.textContent = fmt.format(new Date()) + ' CET'; };
  tickClock();
  setInterval(tickClock, 15000);

  /* carousel ambient glow */
  const cfGlow = $('#cf-glow');
  function updateGlow(idx) {
    cfGlow.innerHTML = artHTML(PROJECTS[idx]);
    if (!reduce) cfGlow.firstElementChild.animate([{ opacity: 0 }, { opacity: .2 }], { duration: 900, easing: 'ease-out' });
  }

  /* ----------------------------------------------------------
     MAIN LOOP
     ---------------------------------------------------------- */
  const progress = $('#scroll-progress');
  let lastY = scrollY, lastT = performance.now();

  function tick(now) {
    if (lenis) lenis.raf(now);
    const frameMs = now - lastT;
    const dt = clamp(frameMs / 16.67, .5, 3);
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

    // hero parallax
    if (y < innerHeight * 1.2) {
      heroCopy.style.transform = `translate3d(0,${(y * .16).toFixed(1)}px,0)`;
      heroCopy.style.opacity = clamp(1 - y / (innerHeight * .85), 0, 1).toFixed(3);
    }

    // shader background
    if (GL && !GL.off && !reduce && !document.hidden) {
      GL.adapt(frameMs);
      gmx = lerp(gmx, mx, .05); gmy = lerp(gmy, my, .05);
      GL.draw(now / 1000, gmx, gmy, max > 0 ? y / max : 0);
    }

    updateCf(now);
    updateArchive();

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
     LANGUAGE SWITCH
     ---------------------------------------------------------- */
  function setLang(next) {
    if (next === lang || !W.LANGS.includes(next)) return;
    lang = next;
    try { localStorage.setItem('walife-lang', lang); } catch (e) { /* ignore */ }
    applyStatic();
    if (cfActive >= 0) setActive(cfActive, true);
    layout();
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ----------------------------------------------------------
     LAYOUT + BOOT
     ---------------------------------------------------------- */
  function layout() {
    if (GL) { GL.size(); if (reduce) GL.draw(12, innerWidth * .65, innerHeight * .4, 0); }
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
