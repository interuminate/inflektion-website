// Version 1, Portal views: progressive enhancement only. Without JS every section is readable in order.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const swapDelay = () => (reduce.matches ? 0 : 150);

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

  /* Sticky chapters: move each chapter's visual into the shared stage on wide screens */
  const chapters = document.querySelector('[data-chapters]');
  if (chapters) {
    const stage = chapters.querySelector('[data-stage]');
    const items = [...chapters.querySelectorAll('[data-chapter]')];
    const bars = [...stage.querySelectorAll('.chapters__progress span')];
    const visuals = items.map((item) => item.querySelector('.chapter__visual'));
    const wide = window.matchMedia('(min-width: 1024px)');
    let observer;

    const setActive = (i) => {
      items.forEach((el, n) => el.classList.toggle('is-active', n === i));
      visuals.forEach((el, n) => { el.classList.toggle('is-active', n === i); el.classList.toggle('is-before', n < i); });
      bars.forEach((el, n) => el.classList.toggle('is-done', n <= i));
    };

    const mount = () => {
      if (wide.matches) {
        visuals.forEach((v) => stage.insertBefore(v, stage.lastElementChild));
        setActive(0);
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) setActive(items.indexOf(entry.target)); });
        }, { rootMargin: '-28% 0px -62% 0px' });
        items.forEach((el) => observer.observe(el));
      } else {
        if (observer) observer.disconnect();
        visuals.forEach((v, n) => { v.classList.remove('is-active', 'is-before'); items[n].appendChild(v); });
        items.forEach((el) => el.classList.remove('is-active'));
      }
    };
    mount();
    wide.addEventListener('change', mount);
  }

  /* V1 colour review: ?colour=original shows the page without the review colours, for comparison */
  if (new URLSearchParams(location.search).get('colour') === 'original') document.body.classList.remove('colour-review');

  /* White-label brand switcher */
  const demo = document.querySelector('[data-brand-demo]');
  if (demo) {
    const mock = demo.querySelector('.portal-mock');
    const status = demo.querySelector('[data-theme-status]');
    const buttons = [...demo.querySelectorAll('[data-theme-key]')];
    buttons.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      const apply = () => { mock.dataset.brand = b.dataset.themeKey; demo.closest('section').dataset.brand = b.dataset.themeKey; mock.classList.remove('is-swapping'); };
      mock.classList.add('is-swapping');
      setTimeout(apply, swapDelay());
      status.textContent = `Portal preview shown in the ${b.textContent.trim()} theme.`;
    }));
  }

  /* Funnel: scroll position picks the audience variation */
  const funnel = document.querySelector('[data-funnel]');
  if (funnel) {
    const shots = [...funnel.querySelectorAll('.funnel-shot')];
    const dots = [...funnel.querySelectorAll('.funnel-progress span')];
    const label = funnel.querySelector('[data-funnel-label]');
    const url = funnel.querySelector('[data-funnel-url]');
    let current = 0, ticking = false;

    const show = (i) => {
      if (i === current) return;
      current = i;
      shots.forEach((s, n) => s.classList.toggle('is-active', n === i));
      dots.forEach((d, n) => d.classList.toggle('is-active', n === i));
      url.textContent = shots[i].dataset.url;
      label.classList.add('is-swapping');
      setTimeout(() => {
        const { label: prefix, audience } = shots[i].dataset;
        const strong = document.createElement('strong');
        strong.textContent = audience;
        label.replaceChildren(...(prefix ? [`${prefix} `, strong] : [strong]));
        label.classList.remove('is-swapping');
      }, swapDelay());
    };
    const update = () => {
      ticking = false;
      const r = funnel.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? Math.min(0.999, Math.max(0, -r.top / travel)) : 0;
      show(Math.floor(p * shots.length));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* Testimonials: clamp each quote to its card's line count with "… Read more"; full text in a dialog */
  const dialog = document.querySelector('.quote-dialog');
  const quoteCards = document.querySelectorAll('.t-card[data-lines]');
  if (quoteCards.length && dialog && typeof dialog.showModal === 'function') {
    const cards = [...quoteCards].map((card) => {
      const bq = card.querySelector('blockquote');
      const paras = [...bq.querySelectorAll('p')].map((p) => p.textContent);
      const start = Number(card.dataset.start || 0);
      const full = (start ? '“… ' : '') + paras.slice(start).join(' ');
      const p = document.createElement('p');
      bq.replaceChildren(p);
      const name = card.querySelector('.t-name').textContent;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 't-more';
      btn.innerHTML = 'Read more<span class="visually-hidden">: ' + name + '’s full testimonial</span>';
      btn.addEventListener('click', () => openQuote(card, paras, btn));
      return { p, full, btn, lines: Number(card.dataset.lines) };
    });

    const fit = ({ p, full, btn, lines }) => {
      p.textContent = full;
      const max = parseFloat(getComputedStyle(p).lineHeight) * lines + 2;
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

    const body = dialog.querySelector('[data-body]');
    const scroller = dialog.querySelector('[data-scroll]');
    body.addEventListener('scroll', () => scroller.classList.toggle('is-end', body.scrollTop + body.clientHeight >= body.scrollHeight - 2), { passive: true });
    let opener = null;
    function openQuote(card, paras, btn) {
      opener = btn;
      const logo = card.querySelector('.t-logo');
      dialog.querySelector('[data-logo]').replaceChildren(...(logo ? [logo.cloneNode()] : []));
      body.replaceChildren(...paras.map((t) => { const q = document.createElement('p'); q.textContent = t; return q; }));
      dialog.querySelector('[data-name]').textContent = card.querySelector('.t-name').textContent;
      dialog.querySelector('[data-role]').textContent = card.querySelector('.t-role').textContent;
      dialog.showModal();
      body.scrollTop = 0;
      scroller.classList.toggle('is-scrollable', body.scrollHeight > body.clientHeight + 1);
      scroller.classList.remove('is-end');
    }
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  }

  /* Section reveal: V1 "Portal views": a 40px rise with a soft scale-in, rows ripple 90ms apart.
     Fires once an element is about a fifth of the way up the screen. Elements that arrive together are
     staggered top to bottom, left to right. Anything on screen at load stays put; helper classes are
     removed after the reveal so hover transitions are the element's own again. */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const settle = (el) => { el.classList.remove('reveal', 'is-in'); el.style.removeProperty('--d'); };
    const io = new IntersectionObserver((entries) => {
      const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target)
        .sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
      arriving.forEach((el, n) => {
        const d = Math.min(n * 90, 540);
        el.style.setProperty('--d', d + 'ms');
        el.classList.add('is-in');
        setTimeout(() => settle(el), d + 1100);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -20% 0px' });
    const targets = [
      '.section-head > *',
      '.problem-copy > *',
      '.pain-list > li',
      '.why-now',
      '.brand-switch',
      '.brand-stage',
      '.feature-strip > li',
      '.funnels-head > *',
      '.t-card--wide',
      '.plaques > li',
      '.proof-grid > *',
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
