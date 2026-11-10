// v3 Portal views: progressive enhancement only. Without JS every section is readable in order.
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

  /* White-label brand switcher */
  const demo = document.querySelector('[data-brand-demo]');
  if (demo) {
    const mock = demo.querySelector('.portal-mock');
    const status = demo.querySelector('[data-theme-status]');
    const buttons = [...demo.querySelectorAll('[data-theme-key]')];
    buttons.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      const apply = () => { mock.dataset.brand = b.dataset.themeKey; mock.classList.remove('is-swapping'); };
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

  /* Testimonials: clamp each quote to a few lines with "… Read more", full text in a dialog */
  const quotes = document.querySelector('[data-quotes]');
  const dialog = document.querySelector('.quote-dialog');
  if (quotes && dialog && typeof dialog.showModal === 'function') {
    const cards = [...quotes.querySelectorAll('.t-card')].map((card) => {
      const p = card.querySelector('blockquote p');
      const name = card.querySelector('.t-name').textContent;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 't-more';
      btn.innerHTML = 'Read more<span class="visually-hidden">: ' + name + '’s full testimonial</span>';
      btn.addEventListener('click', () => openQuote(card, full, btn));
      const full = p.textContent;
      return { card, p, full, btn, lines: card.classList.contains('t-card--feature') ? 8 : 4 };
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
    let opener = null;
    function openQuote(card, full, btn) {
      opener = btn;
      const logo = card.querySelector('.t-logo');
      dialog.querySelector('[data-logo]').replaceChildren(...(logo ? [logo.cloneNode()] : []));
      const q = document.createElement('p'); q.textContent = full;
      body.replaceChildren(q);
      dialog.querySelector('[data-name]').textContent = card.querySelector('.t-name').textContent;
      dialog.querySelector('[data-role]').textContent = card.querySelector('.t-role').textContent;
      dialog.showModal();
      body.scrollTop = 0;
      body.classList.toggle('is-scrollable', body.scrollHeight > body.clientHeight + 1);
    }
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  }

  /* Section reveal */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-head, .problem-copy, .why-now, .brand-demo, .funnels-head, .plaques, .proof-grid, .creators-copy, .final-inner');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach((t) => {
      if (t.getBoundingClientRect().top < window.innerHeight) return;
      t.classList.add('reveal'); io.observe(t);
    });
  }
})();
