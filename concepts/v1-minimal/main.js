(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Nav */
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var menuBtn = document.querySelector('.nav__menu'), menu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', function () {
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    menuBtn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.hidden = open;
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menuBtn.click(); });

  /* Hero cards: drift with scroll and pointer */
  var stage = document.querySelector('[data-parallax]');
  var cards = stage ? stage.querySelectorAll('[data-depth]') : [];
  var px = 0, py = 0;
  function paint() {
    var r = stage.getBoundingClientRect();
    var t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1..1 around centre
    cards.forEach(function (c) {
      var d = parseFloat(c.dataset.depth);
      c.style.transform = 'translate3d(' + (px * d * .6) + 'px,' + (t * d * 3 + py * d * .6) + 'px,0)';
    });
  }
  if (stage && !reduce) {
    window.addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5;
      requestAnimationFrame(paint);
    });
    stage.addEventListener('pointerleave', function () { px = py = 0; requestAnimationFrame(paint); });
    paint();
  }

  /* Count up */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    if (reduce) return;
    var end = parseInt(el.dataset.count, 10), t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 600);
  });

  /* Funnel audiences (copy follows the client reference; images are placeholders) */
  var AUD = {
    generic: { url: 'brand.com', partner: null, headline: 'A Sleep Lab, Wrapped Around Your Finger', sub: 'Leverage cutting-edge tech to track, analyze and enhance your body’s performance with precision.', cta: 'Shop Now', img: 'Hero product' },
    biohackers: { url: 'brand.com/longevity-lab', partner: ['LL', 'Recommended by Longevity Lab'], headline: 'Your HRV Will Notice First', sub: 'Track recovery, sleep stages and readiness with the precision your protocol deserves.', cta: 'Start Your Protocol', img: 'Product with recovery data' },
    mothers: { url: 'brand.com/fourth-trimester', partner: ['FT', 'Recommended by The Fourth Trimester'], headline: 'Rest, Even on the Short Nights', sub: 'Gentle insight into your sleep, so you can make the most of every hour you get.', cta: 'Shop for New Moms', img: 'Product in a calm night scene' },
    clinicians: { url: 'brand.com/practitioners', partner: ['DR', 'For health care professionals'], headline: 'Evidence You Can Recommend', sub: 'Validated sleep and recovery data, with practitioner pricing for your patients.', cta: 'Get Practitioner Access', img: 'Product with clinical data sheet' }
  };
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var page = document.querySelector('.page');
  var f = function (k) { return document.querySelector('[data-f="' + k + '"]'); };
  var swap;
  function select(tab, focus) {
    var key = tab.dataset.aud, d = AUD[key];
    tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    if (focus) tab.focus();
    clearTimeout(swap);
    page.classList.add('is-swapping');
    swap = setTimeout(function () {
      page.dataset.aud = key;
      f('url').textContent = d.url; f('headline').textContent = d.headline; f('sub').textContent = d.sub; f('cta').textContent = d.cta; f('img').textContent = d.img;
      var p = f('partner');
      if (d.partner) { p.hidden = false; p.dataset.initials = d.partner[0]; p.textContent = d.partner[1]; } else p.hidden = true;
      page.classList.remove('is-swapping');
    }, reduce ? 0 : 200);
  }
  var auto = null, autoI = 0, autoOff = false;
  function stopAuto() { autoOff = true; clearInterval(auto); auto = null; }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { stopAuto(); select(t); });
    t.addEventListener('keydown', function (e) {
      var dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!dir) return; e.preventDefault(); stopAuto();
      select(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });
  if (!reduce && hasIO) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (autoOff) return;
        if (e.isIntersecting && !auto) auto = setInterval(function () { autoI = (autoI + 1) % tabs.length; select(tabs[autoI]); }, 3000);
        else if (!e.isIntersecting && auto) { clearInterval(auto); auto = null; }
      });
    }, { threshold: .4 }).observe(document.querySelector('.funnel__card'));
  }

  /* Platform: sticky index follows panels */
  var panels = document.querySelectorAll('.ppanel');
  var idx = document.querySelectorAll('.pindex li');
  var bar = document.querySelector('.pindex__bar');
  var wrap = document.querySelector('.ppanels');
  function platform() {
    var mid = innerHeight * .5, active = 0;
    panels.forEach(function (p, i) { if (p.getBoundingClientRect().top < mid) active = i; });
    idx.forEach(function (li, i) { li.classList.toggle('is-active', i === active); });
    var r = wrap.getBoundingClientRect();
    var prog = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
    bar.style.setProperty('--p', (prog * 100).toFixed(1) + '%');
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(platform); }, { passive: true });
  platform();

  /* Quotes: autoplay with progress bars */
  var qwrap = document.querySelector('[data-quotes]');
  var qs = qwrap.querySelectorAll('.q');
  var qb = Array.prototype.slice.call(qwrap.querySelectorAll('.qbars button'));
  var qi = 0, qt = null, DUR = 7000;
  qwrap.style.setProperty('--qdur', DUR + 'ms');
  function showQ(i) {
    qs[qi].classList.remove('is-active');
    qi = i;
    qs[qi].classList.add('is-active');
    qb.forEach(function (b, j) {
      b.setAttribute('aria-selected', String(j === qi));
      b.classList.toggle('is-done', j < qi);
      var bar = b.querySelector('i'); bar.style.animation = 'none'; bar.offsetHeight; bar.style.animation = '';
    });
    clearTimeout(qt);
    if (!reduce && !qwrap.classList.contains('is-paused')) qt = setTimeout(function () { showQ((qi + 1) % qs.length); }, DUR);
  }
  qb.forEach(function (b, i) { b.addEventListener('click', function () { showQ(i); }); });
  qwrap.addEventListener('pointerenter', function () { qwrap.classList.add('is-paused'); clearTimeout(qt); });
  qwrap.addEventListener('pointerleave', function () { qwrap.classList.remove('is-paused'); showQ(qi); });
  if (hasIO && !reduce) {
    var started = false;
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; showQ(0); } }, { threshold: .4 }).observe(qwrap);
  }

  /* Reveal + in-view triggers */
  if (hasIO) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.label, .display, .h2, .lede, .xgrid, .pcard, .ppanel, .aff__media, .aff__copy, .cta__inner').forEach(function (el) {
      if (!reduce) {
        el.classList.add('reveal');
        if (el.classList.contains('pcard')) el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentElement.children, el) * 90) + 'ms';
      }
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.pcard, .aff__media').forEach(function (el) { el.classList.add('is-in'); });
  }
})();
