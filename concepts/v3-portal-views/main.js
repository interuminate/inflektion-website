// v3 Portal views: progressive enhancement only. Without JS every section is readable in order.
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

  /* Sticky chapters: move each chapter's visual into the shared stage on wide screens */
  const chapters = document.querySelector('[data-chapters]');
  if (chapters) {
    const stage = chapters.querySelector('[data-stage]');
    const items = [...chapters.querySelectorAll('[data-chapter]')];
    const dots = [...stage.querySelectorAll('.chapters__progress span')];
    const visuals = items.map((item) => item.querySelector('.chapter__visual'));
    const wide = window.matchMedia('(min-width: 1024px)');
    let observer;

    const setActive = (i) => {
      items.forEach((el, n) => el.classList.toggle('is-active', n === i));
      visuals.forEach((el, n) => el.classList.toggle('is-active', n === i));
      dots.forEach((el, n) => el.classList.toggle('is-active', n === i));
    };

    const mount = () => {
      if (wide.matches) {
        visuals.forEach((v) => stage.insertBefore(v, stage.lastElementChild));
        setActive(0);
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(items.indexOf(entry.target));
          });
        }, { rootMargin: '-45% 0px -45% 0px' });
        items.forEach((el) => observer.observe(el));
      } else {
        if (observer) observer.disconnect();
        visuals.forEach((v, n) => items[n].appendChild(v));
        items.forEach((el) => el.classList.remove('is-active'));
      }
    };
    mount();
    wide.addEventListener('change', mount);
  }

  /* Funnel audience tabs */
  const variants = {
    generic: { url: 'brand.com', partner: 'Your brand’s homepage', headline: 'A sleep lab, wrapped around your finger.', body: 'Track, analyse and improve how your body recovers.' },
    bio: { url: 'brand.com/biohackers', partner: 'Shared by a biohacking creator', headline: 'Recovery data you can actually act on.', body: 'Sleep stages, HRV and readiness, tracked every night.' },
    moms: { url: 'brand.com/mothers', partner: 'Shared by a parenting creator', headline: 'Better rest that fits around real life.', body: 'Gentle insights for broken nights and busy days.' },
    hcp: { url: 'brand.com/practitioners', partner: 'Shared by a health care professional', headline: 'Sleep insights to share with your patients.', body: 'Long-term trends that make conversations easier.' },
  };
  const tablist = document.querySelector('.funnel-tabs');
  const panel = document.getElementById('funnel-panel');
  if (tablist && panel) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const page = panel.querySelector('[data-page]');
    const copy = panel.querySelector('.browser__copy');
    const fields = {
      url: panel.querySelector('[data-url]'), partner: panel.querySelector('[data-partner]'),
      headline: panel.querySelector('[data-headline]'), body: panel.querySelector('[data-body]'),
    };
    const select = (tab, focus) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panel.setAttribute('aria-labelledby', tab.id);
      const key = tab.dataset.variant;
      const apply = () => {
        Object.entries(fields).forEach(([k, el]) => { el.textContent = variants[key][k]; });
        page.dataset.page = key;
        copy.classList.remove('is-swapping');
      };
      if (reduce.matches) apply();
      else { copy.classList.add('is-swapping'); setTimeout(apply, 150); }
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n], true); }
      });
    });
  }

  /* Section reveal */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-head, .problem-copy, .why-now, .portal-copy, .funnels-head, .awards, .proof-grid, .creators-copy, .final-inner');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach((t) => {
      const r = t.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // already in view: leave visible
      t.classList.add('reveal'); io.observe(t);
    });
  }
})();
