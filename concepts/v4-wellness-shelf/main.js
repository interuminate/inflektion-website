// v4 · The wellness shelf. Progressive enhancement only: the page reads fully without this file.
(function () {
  document.body.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  // Audience switch for the personalised funnel demo
  const copy = {
    generic: { kicker: 'Sleep support', head: 'Better sleep starts tonight', label: 'the generic page' },
    biohackers: { kicker: 'For biohackers', head: 'Track it. Tune it. Sleep deeper.', label: 'the page for biohackers' },
    mothers: { kicker: 'For mothers', head: 'Rest that fits around family life', label: 'the page for mothers' },
    hcp: { kicker: 'For health care professionals', head: 'Evidence-led sleep support for your patients', label: 'the page for health care professionals' }
  };
  const frame = document.querySelector('.funnel-frame');
  const status = document.getElementById('funnel-status');
  const buttons = document.querySelectorAll('.switch-buttons button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.audience;
      if (!copy[key] || !frame) return;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      frame.dataset.audience = key;
      frame.querySelector('[data-for="kicker"]').textContent = copy[key].kicker;
      frame.querySelector('[data-for="head"]').textContent = copy[key].head;
      if (status) status.textContent = 'Showing ' + copy[key].label + '.';
    });
  });

  // "What's inside" label tracks the chapter in view
  const rows = document.querySelectorAll('.inside-rows a');
  const chapters = document.querySelectorAll('.chapter');
  if ('IntersectionObserver' in window && rows.length && chapters.length) {
    const setActive = (step) => rows.forEach((a) => {
      if (a.dataset.step === step) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.dataset.step); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    chapters.forEach((c) => io.observe(c));
  }

  // Gentle reveal of sticker elements (skipped entirely with reduced motion)
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.label-card, .sticker-quote, .seal, .asset-card, .claim-sticker');
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io2.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach((t) => {
      const r = t.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // already on screen: leave as is
      t.classList.add('reveal');
      io2.observe(t);
    });
  }
})();
