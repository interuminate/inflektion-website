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

  /* Hero: objects fade in, then drift with pointer and scroll */
  var hero = document.querySelector('[data-hero]');
  var objs = hero.querySelectorAll('[data-depth]');
  setTimeout(function () { hero.classList.add('is-ready'); }, reduce ? 0 : 500);
  if (!reduce) {
    var mx = 0, my = 0;
    function paint() {
      var sy = Math.min(window.scrollY, innerHeight) / innerHeight;
      objs.forEach(function (o) {
        var d = parseFloat(o.dataset.depth);
        o.style.transform = 'translate3d(' + (mx * d) + 'px,' + (my * d - sy * d * 4) + 'px,0)';
      });
    }
    hero.addEventListener('pointermove', function (e) {
      mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
      requestAnimationFrame(paint);
    });
    window.addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
  }

  /* Word-by-word reveal tied to scroll (Unifi) */
  var para = document.querySelector('[data-words]');
  var words = para.textContent.trim().split(/\s+/);
  para.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  var ws = para.querySelectorAll('.w');
  function wordsPaint() {
    var r = para.getBoundingClientRect();
    var start = innerHeight * .85, end = innerHeight * .35;
    var p = Math.min(Math.max((start - r.top) / (start - end + r.height * .6), 0), 1);
    var n = Math.round(p * ws.length);
    ws.forEach(function (w, i) { w.classList.toggle('on', i < n); });
  }
  if (reduce) ws.forEach(function (w) { w.classList.add('on'); });
  else { window.addEventListener('scroll', function () { requestAnimationFrame(wordsPaint); }, { passive: true }); wordsPaint(); }

  /* Why tabs: auto-advance with progress (Attio) */
  var tabsWrap = document.querySelector('[data-tabs]');
  var tabs = Array.prototype.slice.call(tabsWrap.querySelectorAll('.wtab'));
  var panels = tabsWrap.querySelectorAll('.wpanel');
  var ti = 0, timer = null, DUR = 6000;
  tabsWrap.style.setProperty('--dur', DUR + 'ms');
  function show(i, focus) {
    ti = i;
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      var bar = t.querySelector('.wtab__bar'); bar.style.animation = 'none'; bar.offsetHeight; bar.style.animation = '';
      panels[j].hidden = !on; panels[j].classList.toggle('is-active', on);
    });
    if (focus) tabs[i].focus();
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (reduce || tabsWrap.classList.contains('is-manual') || tabsWrap.classList.contains('is-paused') || !tabsWrap.dataset.visible) return;
    timer = setTimeout(function () { show((ti + 1) % tabs.length); }, DUR);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { tabsWrap.classList.add('is-manual'); show(i); });
    t.addEventListener('keydown', function (e) {
      var dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!dir) return; e.preventDefault(); tabsWrap.classList.add('is-manual');
      show((i + dir + tabs.length) % tabs.length, true);
    });
  });
  tabsWrap.addEventListener('pointerenter', function () { tabsWrap.classList.add('is-paused'); clearTimeout(timer); });
  tabsWrap.addEventListener('pointerleave', function () { tabsWrap.classList.remove('is-paused'); if (!tabsWrap.classList.contains('is-manual')) show(ti); });
  if (hasIO) {
    new IntersectionObserver(function (es) {
      tabsWrap.dataset.visible = es[0].isIntersecting ? '1' : '';
      if (es[0].isIntersecting) show(ti); else clearTimeout(timer);
    }, { threshold: .35 }).observe(tabsWrap);
  }

  /* Quote rail: buttons + drag */
  var rail = document.querySelector('.rail');
  document.querySelectorAll('.qnav button').forEach(function (b) {
    b.addEventListener('click', function () {
      var w = rail.querySelector('.qcard').getBoundingClientRect().width + 20;
      rail.scrollBy({ left: w * parseInt(b.dataset.dir, 10), behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  var down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 4) { moved = true; rail.classList.add('is-dragging'); }
    rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('is-dragging'); });
  rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  /* Reveal */
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.badge, .display, .lede, .lgrid, .cat, .wtabs, .wpanels, .mcell, .aff, .qcard, .awards li, .cta__inner').forEach(function (el) {
      el.classList.add('reveal');
      if (/\b(cat|mcell|qcard)\b/.test(el.className) || el.parentElement.classList.contains('awards')) {
        el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentElement.children, el) * 70) + 'ms';
      }
      io.observe(el);
    });
  }
})();
