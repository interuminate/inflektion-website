// v4: progressive enhancement only. Without JS every section reads in order and all four funnel pages show.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Mobile menu */
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (btn && nav) {
    const close = () => { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a[href]')) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { close(); btn.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', close);
  }

  /* Funnel: audience buttons swap the Oura page */
  const funnel = document.querySelector('[data-funnel]');
  if (funnel) {
    const shots = [...funnel.querySelectorAll('.shot')];
    const buttons = [...funnel.querySelectorAll('[data-shot]')];
    const status = funnel.querySelector('[data-funnel-status]');
    buttons.forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.shot);
      buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      shots.forEach((s, n) => s.classList.toggle('is-active', n === i));
      status.textContent = `Showing the Oura page for ${b.textContent.trim().toLowerCase()}.`;
    }));
  }

  /* Testimonial carousel: a looping track. Clones before and after the real cards let the
     arrows run forever; the cards bleed past the margin and are clipped by the viewport. */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const section = carousel.closest('section');
    const track = carousel.querySelector('.carousel__track');
    const originals = [...track.querySelectorAll('.slide')];
    const n = originals.length;
    const clone = (el) => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.classList.add('is-clone'); return c; };
    track.prepend(...originals.map(clone));
    track.append(...originals.map(clone));
    track.removeAttribute('tabindex');
    let index = n;
    const step = () => { const s = track.querySelector('.slide'); return s.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap); };
    const place = (animate) => {
      track.classList.toggle('is-animating', animate && !reduce.matches);
      track.style.transform = `translateX(${-index * step()}px)`;
    };
    const jump = (to) => { index = to; place(false); void track.offsetWidth; };
    const move = (dir) => {
      if (index + dir >= 2 * n) jump(index - n);
      if (index + dir < n) jump(index + n);
      index += dir;
      place(true);
    };
    track.addEventListener('transitionend', () => { if (index >= 2 * n) jump(index - n); else if (index < n) jump(index + n); });
    section.querySelector('[data-prev]').addEventListener('click', () => move(-1));
    section.querySelector('[data-next]').addEventListener('click', () => move(1));
    let x0 = null;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    track.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1); });
    window.addEventListener('resize', () => place(false));
    place(false);
  }

  /* Pausable timers: stop when off screen, when the tab is hidden, or under reduced motion */
  const whenVisible = (el, onChange) => {
    let seen = false;
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; onChange(seen && !document.hidden); }).observe(el);
    document.addEventListener('visibilitychange', () => onChange(seen && !document.hidden));
  };

  /* Logo cells: each cell rotates its own logos upward on its own interval */
  const cellsEl = document.querySelector('[data-logo-cells]');
  if (cellsEl && !reduce.matches) {
    const pauseBtn = document.querySelector('[data-logo-pause]');
    const intervals = [3400, 4300, 3800, 4800, 4100, 4500];
    const cells = [...cellsEl.querySelectorAll('.logo-cell__stack')].map((stack, n) => ({ imgs: [...stack.querySelectorAll('img')], i: 0, ms: intervals[n % intervals.length], offset: 700 + n * 650, timer: 0 }));
    let running = false, userPaused = false, onScreen = false;
    const swap = (c) => {
      if (c.imgs.length < 2) return;
      const out = c.imgs[c.i];
      c.i = (c.i + 1) % c.imgs.length;
      const inn = c.imgs[c.i];
      inn.classList.remove('is-leaving');
      out.classList.remove('is-active'); out.classList.add('is-leaving');
      inn.classList.add('is-active');
      setTimeout(() => out.classList.remove('is-leaving'), 900);
    };
    const start = () => {
      if (running) return; running = true;
      cells.forEach((c) => { c.timer = setTimeout(function tick() { swap(c); c.timer = setTimeout(tick, c.ms); }, c.offset); });
    };
    const stop = () => { running = false; cells.forEach((c) => clearTimeout(c.timer)); };
    const update = () => (onScreen && !userPaused ? start() : stop());
    whenVisible(cellsEl, (v) => { onScreen = v; update(); });
    pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.querySelector('.visually-hidden').textContent = userPaused ? 'Play logo animation' : 'Pause logo animation';
      update();
    });
  }

  /* Portal themes: cycle the brand theme with a long idle between swaps */
  const themeStage = document.querySelector('[data-theme-cycle]');
  if (themeStage && !reduce.matches) {
    const themes = [['sleep', 'Sleep tech'], ['supps', 'Supplements'], ['fit', 'Fitness'], ['skin', 'Skincare']];
    const decal = themeStage.querySelector('.theme-decal');
    const label = themeStage.querySelector('[data-theme-label]');
    let k = 0, timer = 0, hover = false, onScreen = false;
    const next = () => {
      k = (k + 1) % themes.length;
      decal.classList.add('is-swapping');
      setTimeout(() => {
        themeStage.dataset.brand = themes[k][0];
        label.textContent = themes[k][1];
        decal.classList.remove('is-swapping');
      }, 300);
    };
    const update = () => { clearInterval(timer); if (onScreen && !hover) timer = setInterval(next, 3600); };
    themeStage.addEventListener('mouseenter', () => { hover = true; update(); });
    themeStage.addEventListener('mouseleave', () => { hover = false; update(); });
    whenVisible(themeStage, (v) => { onScreen = v; update(); });
  }

  /* Section reveal */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.sec-head, .stat-panel, .stages, .portal-stage, .browser, .award-cells, .carousel, .creators-stage');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach((t) => {
      if (t.getBoundingClientRect().top < window.innerHeight) return;
      t.classList.add('reveal'); io.observe(t);
    });
  }
})();
