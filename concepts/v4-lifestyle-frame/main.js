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

  /* Testimonial carousel: buttons page through the scroll-snapped track */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const step = () => { const s = track.querySelector('.slide'); return s ? s.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap) : track.clientWidth; };
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
    next.addEventListener('click', () => track.scrollBy({ left: step() }));
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync);
    sync();
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
