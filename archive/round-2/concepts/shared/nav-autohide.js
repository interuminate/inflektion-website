/* Auto-hiding sticky header, shared by all three versions.
   Scrolling down slides the header out of view; any scroll up brings it back.
   It stays visible near the top of the page, while the mobile menu is open and while focus is inside it.
   Without JS the header is simply sticky. Under reduced motion it still hides and shows, without the slide. */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const nav = header.querySelector('.site-nav');
  const THRESHOLD = 8;        /* px of travel before the direction counts, so small jitters don't toggle it */
  let lastY = window.scrollY;
  let ticking = false;

  const show = () => header.classList.remove('is-hidden');
  const update = () => {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    const pinned = y <= header.offsetHeight || (nav && nav.classList.contains('is-open')) || header.contains(document.activeElement);
    if (pinned) show();
    else if (delta > THRESHOLD) header.classList.add('is-hidden');
    else if (delta < -THRESHOLD) show();
    if (Math.abs(delta) > THRESHOLD || pinned) lastY = y;
  };

  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  header.addEventListener('focusin', show);
})();
