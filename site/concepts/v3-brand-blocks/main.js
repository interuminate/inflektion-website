/* Version 3, Brand blocks. Progressive enhancement only: with JS off or reduced motion, every section reads top to bottom. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wide = window.matchMedia('(min-width: 1024px)');

  /* Overscroll fill: switch the root colour to the footer's once past halfway (see style.css) */
  {
    const setEnd = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.classList.toggle('is-lower', window.scrollY > max / 2);
    };
    window.addEventListener('scroll', setEnd, { passive: true });
    window.addEventListener('resize', setEnd);
    setEnd();
  }
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Mobile menu */
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
    });
  }

  /* Logo marquee (pauses on hover and focus; static wrapped row under reduced motion) */
  const marquee = $('[data-marquee]');
  if (marquee && !reduce.matches) {
    const track = $('.marquee__track', marquee);
    [...track.children].forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('img', clone).forEach((img) => { img.alt = ''; });
      track.append(clone);
    });
    marquee.classList.add('is-ready');
  }

  /* Hero load-in: the class is set in <head>; clear it after the run, or right away if the page reopened mid-scroll */
  if (root.classList.contains('intro')) {
    if (window.scrollY > 40) root.classList.remove('intro'); /* reopened mid-page: skip it */
    else setTimeout(() => root.classList.remove('intro'), 2000);
  }

  /* Review toggle: ?phase=plain shows the phase markers without icon tiles */
  if (new URLSearchParams(location.search).get('phase') === 'plain') $('.phase-tiles')?.classList.remove('phase-tiles');

  /* Reveal, bar growth and count-up when elements enter the viewport */
  $$('[data-grow]').forEach((g) => [...g.children].forEach((bar, i) => bar.style.setProperty('--n', i)));
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (reduce.matches) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1100;
    const step = (t) => {
      const k = clamp((t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    /* After the reveal has played, drop the helper classes so hover transitions are the element's own again */
    const settle = (el) => { el.classList.remove('reveal', 'is-in'); el.style.removeProperty('--d'); };
    const io = new IntersectionObserver((entries) => {
      /* Elements that arrive together are staggered top to bottom, left to right (70ms apart, capped) */
      const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target)
        .sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
      let n = 0;
      arriving.forEach((el) => {
        if (el.classList.contains('reveal')) {
          const d = Math.min(n++ * 70, 420);
          el.style.setProperty('--d', d + 'ms');
          if (!el.classList.contains('roas')) setTimeout(() => settle(el), d + 900);
        }
        el.classList.add('is-in');
        if (el.dataset.count) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    /* Section entry reveal: each section's title, lead and main content fade in and rise once.
       Elements already on screen at load stay put. */
    const revealTargets = [
      '.problem-copy > *', '.why-now > *', '.pain-strip > li',
      '.how-head > *', '.how-viewport', '.how-progress',
      '.portal-head > *', '.explorer__list > li', '.explorer__stage',
      '.funnels .split-head > *', '.browser', '.stat-box',
      '.recognition-title', '.award-grid > li',
      '.proof-head > *', '.deck',
      '.creator-visual', '.creators-copy > *',
      '.final-row > *',
      '[data-reveal]',
    ];
    $$(revealTargets.join(',')).forEach((el) => {
      if (el.hidden || el.classList.contains('visually-hidden')) return;
      const below = el.getBoundingClientRect().top > window.innerHeight;
      if (!reduce.matches && below) {
        el.classList.add('reveal');
      }
      if (el.classList.contains('roas')) el.classList.add('reveal');
      io.observe(el);
    });
    $$('[data-grow], [data-count]').forEach((el) => io.observe(el));
  } else {
    $$('[data-grow]').forEach((el) => el.classList.add('is-in'));
  }

  /* Portal explorer: feature buttons change the portal view; swatches change the brand theme */
  const explorer = $('[data-explorer]');
  if (explorer) {
    const app = $('.portal-app', explorer);
    const status = $('[data-explorer-status]', explorer);
    const feats = $$('[data-view]', explorer);
    feats.forEach((btn) => btn.addEventListener('click', () => {
      feats.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      app.dataset.viewCurrent = btn.dataset.view;
      status.textContent = 'Portal preview shows ' + $('.feature-btn__title', btn).textContent + '.';
    }));
    const swatches = $$('[data-brand-key]', explorer);
    swatches.forEach((btn) => btn.addEventListener('click', () => {
      swatches.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      app.dataset.brand = btn.dataset.brandKey;
      explorer.closest('section').dataset.brand = btn.dataset.brandKey;
      status.textContent = 'Portal preview shown in the ' + btn.textContent.trim() + ' theme.';
    }));
  }

  /* Funnel frame: the Oura pages rotate on a timer shown by the pink progress bar (pausable; starts paused under reduced motion) */
  const audience = $('[data-audience]');
  if (audience) {
    const shots = $$('.shot', audience);
    const tag = $('[data-audience-tag]', audience);
    const bar = $('[data-audience-progress]', audience);
    const toggle = $('[data-audience-toggle]', audience);
    const toggleLabel = $('[data-audience-toggle-label]', audience);
    let i = 0, userPaused = reduce.matches, visible = false, hovered = false;
    const show = (n) => {
      i = (n + shots.length) % shots.length;
      shots.forEach((s, j) => s.classList.toggle('is-active', j === i));
      tag.textContent = shots[i].dataset.label;
    };
    const restart = () => { bar.classList.remove('is-running'); void bar.offsetWidth; bar.classList.add('is-running'); };
    const sync = () => {
      const paused = userPaused || !visible || hovered;
      audience.classList.toggle('is-paused', paused);
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggleLabel.textContent = userPaused ? 'Play the page rotation' : 'Pause the page rotation';
    };
    bar.addEventListener('animationend', () => { show(i + 1); restart(); });
    toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
    audience.addEventListener('pointerenter', () => { hovered = true; sync(); });
    audience.addEventListener('pointerleave', () => { hovered = false; sync(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.35 }).observe(audience);
    } else { visible = true; }
    toggle.hidden = false;
    audience.classList.add('is-rotating');
    show(0); restart(); sync();
  }

  /* Testimonial deck */
  const deck = $('[data-deck]');
  if (deck) {
    const section = deck.closest('section');
    const cards = $$('.deck-card', deck);
    const controls = $('[data-deck-controls]', section);
    const index = $('[data-deck-index]', section);
    $('[data-deck-total]', section).textContent = cards.length;
    const status = $('[data-deck-status]', section);
    let order = cards.map((_, i) => i);
    const paint = () => {
      order.forEach((cardIdx, pos) => {
        const c = cards[cardIdx];
        c.style.setProperty('--i', pos);
        c.classList.toggle('is-top', pos === 0);
        c.setAttribute('aria-hidden', String(pos !== 0));
      });
      const top = cards[order[0]];
      index.textContent = order[0] + 1;
      status.textContent = 'Testimonial ' + (order[0] + 1) + ' of ' + cards.length + ': ' + $('.q-name', top).textContent + ', ' + $('.q-role', top).textContent + '.';
    };
    const go = (dir) => {
      const top = cards[order[0]];
      if (dir > 0) {
        if (reduce.matches) { order.push(order.shift()); paint(); return; }
        top.classList.add('is-out');
        setTimeout(() => { top.classList.remove('is-out'); order.push(order.shift()); paint(); }, 300);
      } else {
        order.unshift(order.pop());
        paint();
        if (!reduce.matches) { const c = cards[order[0]]; c.classList.add('is-in'); setTimeout(() => c.classList.remove('is-in'), 460); }
      }
    };
    section.classList.add('is-deck');
    controls.hidden = false;
    $('[data-deck-next]', section).addEventListener('click', () => go(1));
    $('[data-deck-prev]', section).addEventListener('click', () => go(-1));
    paint();
    status.textContent = '';
  }

  /* Long quotes: clamp to a line count with a Read more button; the full text opens in a dialog */
  const dialog = $('.quote-dialog');
  const quotes = $$('[data-quote]');
  if (quotes.length && dialog && typeof dialog.showModal === 'function') {
    const items = quotes.map((fig) => {
      const bq = $('blockquote', fig);
      const paras = $$('p', bq).map((p) => p.textContent);
      const start = Number(fig.dataset.start || 0);
      const full = (start ? '“… ' : '') + paras.slice(start).join(' ');
      const p = document.createElement('p');
      bq.replaceChildren(p);
      const name = $('.q-name', fig).textContent;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-more';
      btn.innerHTML = 'Read more<span class="visually-hidden">: ' + name + '’s full testimonial</span>';
      btn.addEventListener('click', () => openQuote(fig, paras, btn));
      return { p, full, btn, lines: Number(fig.dataset.lines) };
    });
    const fit = ({ p, full, btn, lines }) => {
      p.textContent = full;
      const max = parseFloat(getComputedStyle(p).lineHeight) * lines + 2;
      if (p.offsetHeight <= max) return;
      const ws = full.split(' ');
      let lo = 1, hi = ws.length - 1;
      const tryK = (k) => { p.textContent = ws.slice(0, k).join(' ').replace(/[\s,.;:!?—–-]+$/, '') + '… '; p.append(btn); return p.offsetHeight <= max; };
      while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (tryK(mid)) lo = mid; else hi = mid - 1; }
      tryK(lo);
    };
    const fitAll = () => items.forEach(fit);
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fitAll, 120); });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitAll);

    const body = $('[data-body]', dialog);
    let opener = null;
    function openQuote(fig, paras, btn) {
      opener = btn;
      const logo = $('img', fig);
      $('[data-logo]', dialog).replaceChildren(...(logo ? [logo.cloneNode()] : []));
      body.replaceChildren(...paras.map((t) => { const q = document.createElement('p'); q.textContent = t; return q; }));
      $('[data-name]', dialog).textContent = $('.q-name', fig).textContent;
      $('[data-role]', dialog).textContent = $('.q-role', fig).textContent;
      dialog.showModal();
      body.scrollTop = 0;
    }
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  }

  /* ---------- Scroll-driven layer (off under reduced motion) ---------- */
  const how = $('[data-hscroll]');
  const track = how && $('[data-hscroll-track]', how);
  const hProgress = how && $('[data-hprogress]', how);
  const mosaic = $('[data-mosaic]');
  const floats = $$('[data-float]');
  const painList = $('[data-scrub-list]');
  const pains = painList ? $$('li', painList) : [];
  let vh = window.innerHeight, vw = root.clientWidth, hDist = 0, ticking = false, active = false;

  const arts = $$('.how-card__art');
  const measure = () => {
    vh = window.innerHeight; vw = root.clientWidth;
    if (arts.length) {
      arts.forEach((a) => a.style.removeProperty('--art-h'));
      const tallest = Math.max(...arts.map((a) => a.offsetHeight));
      arts.forEach((a) => a.style.setProperty('--art-h', tallest + 'px'));
    }
    if (how && track) {
      const on = active && wide.matches;
      root.classList.toggle('is-hscroll', on);
      how.style.height = '';
      if (on) {
        hDist = Math.max(0, track.scrollWidth - vw);
        how.style.height = (vh + hDist) + 'px';
      }
    }
  };

  const update = () => {
    ticking = false;
    if (!active) return;
    if (mosaic) {
      const r = mosaic.getBoundingClientRect();
      const drift = clamp((vh / 2 - (r.top + r.height / 2)) * 0.05, -24, 24);
      floats.forEach((f) => f.style.setProperty('--drift', drift.toFixed(1)));
    }
    pains.forEach((li) => {
      const t = li.getBoundingClientRect().top;
      li.style.setProperty('--o', clamp(1 - (t - vh * 0.6) / (vh * 0.22), 0.35, 1).toFixed(2));
    });
    if (how && root.classList.contains('is-hscroll')) {
      const r = how.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, how.offsetHeight - vh));
      how.style.setProperty('--hx', (p * hDist).toFixed(1));
      if (hProgress) hProgress.style.setProperty('--f', p.toFixed(3));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  const setMode = () => {
    active = !reduce.matches;
    if (!active) {
      floats.forEach((f) => f.style.removeProperty('--drift'));
    }
    measure();
    update();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { measure(); update(); }, 100); });
  reduce.addEventListener('change', setMode);
  wide.addEventListener('change', () => { measure(); update(); });
  if (document.fonts) document.fonts.ready.then(() => { measure(); update(); });
  window.addEventListener('load', () => { measure(); update(); });
  setMode();
})();
