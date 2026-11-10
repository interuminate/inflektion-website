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
        }, { rootMargin: '-45% 0px -45% 0px' });
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
      setTimeout(() => { label.textContent = shots[i].dataset.label; label.classList.remove('is-swapping'); }, swapDelay());
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
