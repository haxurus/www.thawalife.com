(() => {
  const stage = document.getElementById('badge-stage');
  const shell = document.getElementById('badge-shell');
  const card = document.getElementById('badge-card');
  const canvas = document.getElementById('lanyard-canvas');
  const ctx = canvas.getContext('2d');

  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  let targetX = 0;
  let targetY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastT = performance.now();
  let moved = false;
  let pointerId = null;

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function center() {
    targetX = 0;
    targetY = 0;
  }

  function pointerDown(e) {
    if (!e.isPrimary) return;
    dragging = true;
    moved = false;
    pointerId = e.pointerId;
    stage.setPointerCapture(pointerId);
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
  }

  function pointerMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;

    const now = performance.now();
    const dt = Math.max(12, now - lastT);
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;

    targetX += dx;
    targetY += dy;
    vx = (dx / dt) * 15;
    vy = (dy / dt) * 15;

    const rect = stage.getBoundingClientRect();
    const limitX = Math.max(40, rect.width / 2 - 120);
    const limitY = Math.max(70, rect.height / 2 - 160);
    targetX = Math.max(-limitX, Math.min(limitX, targetX));
    targetY = Math.max(-limitY, Math.min(limitY, targetY));

    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
  }

  function pointerUp(e) {
    if (e.pointerId !== pointerId) return;
    dragging = false;
    try { stage.releasePointerCapture(pointerId); } catch {}
    pointerId = null;

    if (!moved && e.target.closest('#badge-card')) {
      card.classList.toggle('flipped');
    }
  }

  stage.addEventListener('pointerdown', pointerDown);
  stage.addEventListener('pointermove', pointerMove);
  stage.addEventListener('pointerup', pointerUp);
  stage.addEventListener('pointercancel', pointerUp);

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });

  stage.addEventListener('dblclick', center);
  window.addEventListener('resize', resize);

  function drawLanyard(rect) {
    ctx.clearRect(0, 0, rect.width, rect.height);

    const badgeRect = shell.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const attachX = badgeRect.left - stageRect.left + badgeRect.width / 2;
    const attachY = badgeRect.top - stageRect.top + 5;

    const anchorLeft = rect.width * .34;
    const anchorRight = rect.width * .66;
    const anchorY = -20;

    const pull = Math.min(1, Math.abs(x) / Math.max(1, rect.width * .4));
    const sag = 96 + Math.abs(y) * .08 + pull * 25;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#191919';

    ctx.beginPath();
    ctx.moveTo(anchorLeft, anchorY);
    ctx.bezierCurveTo(
      anchorLeft + 10, sag,
      attachX - 58, attachY - 130,
      attachX - 17, attachY
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(anchorRight, anchorY);
    ctx.bezierCurveTo(
      anchorRight - 10, sag,
      attachX + 58, attachY - 130,
      attachX + 17, attachY
    );
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(201,255,61,.18)';

    ctx.beginPath();
    ctx.moveTo(anchorLeft + 1, anchorY);
    ctx.bezierCurveTo(
      anchorLeft + 11, sag,
      attachX - 57, attachY - 130,
      attachX - 16, attachY
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(anchorRight - 1, anchorY);
    ctx.bezierCurveTo(
      anchorRight - 11, sag,
      attachX + 57, attachY - 130,
      attachX + 16, attachY
    );
    ctx.stroke();

    ctx.fillStyle = '#202020';
    ctx.fillRect(attachX - 28, attachY - 8, 56, 18);
    ctx.strokeStyle = 'rgba(255,255,255,.16)';
    ctx.lineWidth = 1;
    ctx.strokeRect(attachX - 28, attachY - 8, 56, 18);
  }

  function tick() {
    const rect = stage.getBoundingClientRect();

    if (!dragging) {
      targetX += vx;
      targetY += vy;
      vx *= .91;
      vy *= .91;

      targetX *= .985;
      targetY *= .985;
    }

    x += (targetX - x) * (dragging ? .32 : .115);
    y += (targetY - y) * (dragging ? .32 : .115);

    const angle = Math.max(-16, Math.min(16, (targetX - x) * .15 + vx * .65));
    const lift = Math.min(1.02, 1 + Math.abs(vx + vy) * .002);

    shell.style.transform =
      `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg) scale(${lift})`;

    drawLanyard(rect);
    requestAnimationFrame(tick);
  }

  resize();
  tick();
})();
