/* ============================================================
   WALIFE - intro loader for the inner pages (archive, project)
   Same leaf-filling animation as the home page.
   Usage: walifeLoader(() => { ...start page reveals... });
   ============================================================ */
window.walifeLoader = function walifeLoader(done) {
  'use strict';
  const loader = document.getElementById('loader');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!loader || reduce) {
    if (loader) loader.remove();
    done();
    return;
  }

  const count = document.getElementById('loader-count');
  const bar = document.getElementById('loader-bar');
  const fill = document.getElementById('loader-fill');
  const MIN = 1100;
  const t0 = performance.now();
  let loaded = document.readyState === 'complete';
  let finished = false;

  document.body.classList.add('loading');
  window.addEventListener('load', () => { loaded = true; });

  const finish = () => {
    if (finished) return;
    finished = true;
    document.body.classList.remove('loading');
    loader.classList.add('done');
    setTimeout(done, 450);
  };

  const step = (t) => {
    let p = Math.min(1, Math.max(0, (t - t0) / MIN));
    if (!loaded) p = Math.min(p, .9);
    const eased = 1 - Math.pow(1 - p, 3);
    count.textContent = String(Math.round(eased * 100)).padStart(3, '0');
    bar.style.transform = `scaleX(${eased})`;
    fill.style.clipPath = `inset(${((1 - eased) * 100).toFixed(1)}% 0 0 0)`;
    if (p >= 1) setTimeout(finish, 150);
    else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  setTimeout(finish, 3500); // failsafe (e.g. background tabs)
};
