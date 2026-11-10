/* Review-only concept switcher. Injected into each concept page; remove for production. */
(function () {
  var here = location.pathname;
  var versions = [
    { id: 'v1', n: '01', name: 'Minimal', dir: 'v1-minimal' },
    { id: 'v2', n: '02', name: 'Illustrated', dir: 'v2-illustrated' },
    { id: 'v3', n: '03', name: 'Portal views', dir: 'v3-portal-views' },
    { id: 'v4', n: '04', name: 'Wellness shelf', dir: 'v4-wellness-shelf' }
  ];
  var current = 'v1';
  versions.forEach(function (v) { v.href = '../' + v.dir + '/'; if (here.indexOf(v.dir) > -1) current = v.id; });

  var css = '' +
    '.ifx-switch{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:4px;padding:4px;border-radius:999px;background:rgba(20,20,20,.86);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#fff;font:500 13px/1 ui-sans-serif,system-ui,-apple-system,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.18);transition:transform .3s ease,opacity .3s ease}' +
    '.ifx-switch.is-hidden{transform:translate(-50%,calc(100% + 24px));opacity:0}' +
    '.ifx-switch a{color:inherit;text-decoration:none;padding:9px 14px;border-radius:999px;white-space:nowrap;outline-offset:2px}' +
    '.ifx-switch a:hover{background:rgba(255,255,255,.1)}' +
    '.ifx-switch a[aria-current="page"]{background:#fff;color:#111}' +
    '.ifx-switch a:focus-visible{outline:2px solid #fff}' +
    '.ifx-switch .ifx-all{color:rgba(255,255,255,.7);padding:9px 12px 9px 10px}' +
    '.ifx-switch .ifx-sep{width:1px;height:18px;background:rgba(255,255,255,.18)}' +
    '.ifx-switch a{min-height:36px;display:inline-flex;align-items:center;gap:.4em}' +
    '@media (max-width:640px){.ifx-switch{font-size:12px}.ifx-switch a{padding:9px 12px}.ifx-switch .ifx-all span,.ifx-switch .ifx-name{display:none}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var nav = document.createElement('nav');
  nav.className = 'ifx-switch';
  nav.setAttribute('aria-label', 'Concept versions');
  var html = '<a class="ifx-all" href="../../" title="All versions" aria-label="All versions">←<span> All versions</span></a><span class="ifx-sep" aria-hidden="true"></span>';
  versions.forEach(function (v) {
    html += '<a href="' + v.href + '" aria-label="' + v.n + ' ' + v.name + '"' + (v.id === current ? ' aria-current="page"' : '') + '>' + v.n + '<span class="ifx-name">' + v.name + '</span></a>';
  });
  nav.innerHTML = html;
  document.body.appendChild(nav);

  // Hide while scrolling down, show on scroll up / near the end, so it never sits on content for long.
  var last = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var nearEnd = y + innerHeight > document.documentElement.scrollHeight - 200;
    nav.classList.toggle('is-hidden', y > last && y > 400 && !nearEnd);
    last = y;
  }, { passive: true });
})();
