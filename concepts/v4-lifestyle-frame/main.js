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

  /* Testimonial carousel: buttons page through the scroll-snapped track; ticks show what is in view */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const section = carousel.closest('section');
    const track = carousel.querySelector('.carousel__track');
    const slides = [...track.querySelectorAll('.slide')];
    const prev = section.querySelector('[data-prev]');
    const next = section.querySelector('[data-next]');
    const ticksEl = carousel.querySelector('[data-ticks]');
    const ticks = slides.map(() => ticksEl.appendChild(document.createElement('span')));
    const step = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      const box = track.getBoundingClientRect();
      slides.forEach((sl, n) => {
        const r = sl.getBoundingClientRect();
        const seen = Math.min(r.right, box.right) - Math.max(r.left, box.left);
        ticks[n].classList.toggle('is-on', seen > r.width * 0.6);
      });
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
    next.addEventListener('click', () => track.scrollBy({ left: step() }));
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync);
    sync();
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
