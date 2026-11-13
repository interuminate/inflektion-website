// Version 2, Lifestyle frame: progressive enhancement only. Without JS every section reads in order and all four funnel pages show.
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

  /* Testimonials: clamp each quote to a few lines with "… Read more"; the full quote opens in a dialog.
     Runs after the carousel has cloned its cards, so clones get the same treatment. */
  const dialog = document.querySelector('.quote-dialog');
  const qCards = [...document.querySelectorAll('.carousel .q-card')];
  if (qCards.length && dialog && typeof dialog.showModal === 'function') {
    const body = dialog.querySelector('[data-body]');
    const scroller = dialog.querySelector('[data-scroll]');
    let opener = null;
    const openQuote = (card, paras, btn) => {
      opener = btn;
      const logo = card.querySelector('.q-logo');
      dialog.querySelector('[data-logo]').replaceChildren(...(logo ? [logo.cloneNode()] : []));
      body.replaceChildren(...paras.map((t) => { const q = document.createElement('p'); q.textContent = t; return q; }));
      dialog.querySelector('[data-name]').textContent = card.querySelector('.q-name').textContent;
      dialog.querySelector('[data-role]').textContent = card.querySelector('.q-role').textContent;
      dialog.showModal();
      body.scrollTop = 0;
      scroller.classList.toggle('is-scrollable', body.scrollHeight > body.clientHeight + 1);
      scroller.classList.remove('is-end');
    };
    const cards = qCards.map((card) => {
      const bq = card.querySelector('blockquote');
      const paras = [...bq.querySelectorAll('p')].map((p) => p.textContent);
      const full = paras.join(' ');
      const p = document.createElement('p');
      bq.replaceChildren(p);
      const name = card.querySelector('.q-name').textContent;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 't-more';
      btn.innerHTML = 'Read more<span class="visually-hidden">: ' + name + '’s full testimonial</span>';
      if (card.closest('.is-clone')) btn.tabIndex = -1;
      btn.addEventListener('click', () => openQuote(card, paras, btn));
      return { p, full, btn };
    });
    const LINES = 6;
    const fit = ({ p, full, btn }) => {
      p.textContent = full;
      const max = parseFloat(getComputedStyle(p).lineHeight) * LINES + 2;
      if (p.offsetHeight <= max) return;
      const words = full.split(' ');
      let lo = 1, hi = words.length - 1;
      const tryK = (k) => { p.textContent = words.slice(0, k).join(' ').replace(/[\s,.;:!?—–-]+$/, '') + '… '; p.append(btn); return p.offsetHeight <= max; };
      while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (tryK(mid)) lo = mid; else hi = mid - 1; }
      tryK(lo);
    };
    const fitAll = () => cards.forEach(fit);
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fitAll, 120); });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitAll);
    body.addEventListener('scroll', () => scroller.classList.toggle('is-end', body.scrollTop + body.clientHeight >= body.scrollHeight - 2), { passive: true });
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
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

  /* Portal themes: cycle automatically with a long idle; arrows let visitors switch by hand
     (manual use stops the automatic cycle). Each theme changes the decal, the mini portal and the photo. */
  const themeBox = document.querySelector('[data-theme-cycle]');
  if (themeBox) {
    const stage = themeBox.querySelector('.portal-stage');
    const section = themeBox.closest('section'); /* the whole section takes the theme's colours */
    const themes = [['sleep', 'Sleep tech'], ['supps', 'Supplements'], ['fit', 'Fitness'], ['skin', 'Skincare']];
    const decal = stage.querySelector('.theme-decal');
    const label = stage.querySelector('[data-theme-label]');
    const photos = [...stage.querySelectorAll('.theme-photo')];
    const status = themeBox.querySelector('[data-theme-status]');
    let k = 0, timer = 0, hover = false, onScreen = false, manual = false;
    photos.forEach((p) => { p.loading = 'eager'; if (!p.classList.contains('is-active')) p.setAttribute('aria-hidden', 'true'); });
    const show = (to, announce) => {
      k = (to + themes.length) % themes.length;
      const [key, name] = themes[k];
      decal.classList.add('is-swapping');
      photos.forEach((p) => { const on = p.dataset.theme === key; p.classList.toggle('is-active', on); p.toggleAttribute('aria-hidden', !on); });
      setTimeout(() => { stage.dataset.brand = key; section.dataset.brand = key; label.textContent = name; decal.classList.remove('is-swapping'); }, reduce.matches ? 0 : 300);
      if (announce) status.textContent = `Portal theme: ${name}`;
    };
    const update = () => { clearInterval(timer); if (!manual && !reduce.matches && onScreen && !hover) timer = setInterval(() => show(k + 1, false), 4200); };
    stage.addEventListener('mouseenter', () => { hover = true; update(); });
    stage.addEventListener('mouseleave', () => { hover = false; update(); });
    themeBox.querySelector('[data-theme-prev]').addEventListener('click', () => { manual = true; update(); show(k - 1, true); });
    themeBox.querySelector('[data-theme-next]').addEventListener('click', () => { manual = true; update(); show(k + 1, true); });
    whenVisible(stage, (v) => { onScreen = v; update(); });
  }

  /* Section reveal: V2 "Lifestyle frame": a 28px rise, hairline cells fill in left to right 80ms apart, photo frames ease out of a zoom.
     Fires once an element is about a fifth of the way up the screen. Elements that arrive together are
     staggered top to bottom, left to right. Anything on screen at load stays put; helper classes are
     removed after the reveal so hover transitions are the element's own again. */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const settle = (el) => { el.classList.remove('reveal', 'is-in'); el.style.removeProperty('--d'); };
    const io = new IntersectionObserver((entries) => {
      const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target)
        .sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
      arriving.forEach((el, n) => {
        const d = Math.min(n * 80, 480);
        el.style.setProperty('--d', d + 'ms');
        el.classList.add('is-in');
        setTimeout(() => settle(el), d + 1000);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -20% 0px' });
    const targets = [
      '.sec-head > *',
      '.problem-copy > *',
      '.pain-list > li',
      '.stat-panel',
      '.stages > li',
      '.portal-copy > *',
      '.feature-list > li',
      '.portal-visual',
      '.audience-tabs',
      '.browser',
      '.award-cells > li',
      '.carousel',
      '.creators-copy > *',
      '.creators-stage',
      '.final-inner > *',
    ];
    document.querySelectorAll(targets.join(',')).forEach((el) => {
      if (el.hidden || el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* Hero load-in: the class is set in <head>; clear it after the run, or at once if the page reopened mid-scroll */
  if (document.documentElement.classList.contains('intro')) {
    if (window.scrollY > 40) document.documentElement.classList.remove('intro');
    else setTimeout(() => document.documentElement.classList.remove('intro'), 2400);
  }
})();
