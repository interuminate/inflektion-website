/* Inflektion particle field: a cloud of particles drifting up an inflection curve.
 *
 * Usage: <canvas class="fx-particles" data-fx="hero" aria-hidden="true"></canvas>
 * inside a positioned element. The canvas fills its parent.
 *
 * Parameters (set as data-* attributes on the canvas, or globally per preset
 * via window.INFLEKTION_FX = { hero: { density: 1.2, ... } } before this script):
 *   density       particles per 10,000 px² of canvas (default 0.9)
 *   size          "min,max" radius in px (default "0.6,2.2")
 *   speed         drift speed in px/second along the curve (default 14)
 *   opacity       max particle opacity, 0–1 (default 0.45)
 *   colors        comma-separated colours (default "#FF14B9,#9D86FF,#FFFFFF")
 *   spread        how far particles scatter from the curve, 0–1 of height (default 0.22)
 *   rise          how high the curve climbs, 0–1 of height (default 0.7)
 *   bend          where the curve bends upward, 0–1 of width (default 0.62)
 *   steepness     how sharp the bend is (default 9)
 *   curve         draw the inflection curve line: "true" | "false" (default "true")
 *   curveOpacity  opacity of that line (default 0.35)
 *   curveColor    colour of that line (default first colour)
 *   motion        "auto" (animate unless reduced motion) | "static" (default "auto")
 *   seed          integer for a repeatable layout (default 7)
 */
(() => {
  const DEFAULTS = {
    density: 0.9, size: '0.6,2.2', speed: 14, opacity: 0.45,
    colors: '#FF14B9,#9D86FF,#FFFFFF', spread: 0.22, rise: 0.7, bend: 0.62,
    steepness: 9, curve: 'true', curveOpacity: 0.35, curveColor: '', motion: 'auto', seed: 7,
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function gauss(r) { return (r() + r() + r() - 1.5) / 1.5; }

  function readConfig(canvas) {
    const preset = (window.INFLEKTION_FX || {})[canvas.dataset.fx] || {};
    const cfg = { ...DEFAULTS, ...preset };
    Object.keys(DEFAULTS).forEach((k) => { if (canvas.dataset[k] !== undefined) cfg[k] = canvas.dataset[k]; });
    ['density', 'speed', 'opacity', 'spread', 'rise', 'bend', 'steepness', 'curveOpacity', 'seed'].forEach((k) => { cfg[k] = Number(cfg[k]); });
    cfg.size = String(cfg.size).split(',').map(Number);
    cfg.colors = String(cfg.colors).split(',').map((c) => c.trim());
    cfg.curve = String(cfg.curve) !== 'false';
    cfg.curveColor = cfg.curveColor || cfg.colors[0];
    return cfg;
  }

  function Field(canvas) {
    const ctx = canvas.getContext('2d');
    const cfg = readConfig(canvas);
    const animate = cfg.motion !== 'static';
    let w = 0, h = 0, dpr = 1, parts = [], raf = 0, last = 0, visible = true;

    // Logistic inflection curve: flat on the left, bending upward toward the right.
    const yAt = (x) => {
      const t = x / w;
      const l = 1 / (1 + Math.exp(-cfg.steepness * (t - cfg.bend)));
      return h * (0.92 - cfg.rise * l);
    };
    const slope = (x) => (yAt(x + 1) - yAt(x - 1)) / 2;

    function spawn(r, anywhere) {
      const x = anywhere ? r() * w : -10 - r() * w * 0.15;
      const off = gauss(r) * cfg.spread * h;
      return {
        x, off,
        r: cfg.size[0] + r() * (cfg.size[1] - cfg.size[0]),
        c: cfg.colors[Math.floor(r() * cfg.colors.length)],
        a: cfg.opacity * (0.35 + r() * 0.65),
        v: 0.6 + r() * 0.8,
        tw: r() * Math.PI * 2,
        lift: r() * 0.4,
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = rng(cfg.seed);
      const n = Math.round((w * h) / 10000 * cfg.density);
      parts = Array.from({ length: n }, () => spawn(r, true));
      draw(0);
    }

    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      if (cfg.curve) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.45, cfg.curveColor);
        grad.addColorStop(1, cfg.curveColor);
        ctx.globalAlpha = cfg.curveOpacity;
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) { const y = yAt(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }
      const r = rng(Math.floor(performance.now()));
      for (const p of parts) {
        if (dt) {
          // Move along the curve's tangent, so the cloud trends upward as it travels right.
          const s = slope(p.x);
          const len = Math.hypot(1, s);
          const step = cfg.speed * p.v * dt;
          p.x += step / len;
          p.off -= step * p.lift * 0.5; // gentle extra lift
          p.tw += dt * 1.2;
          const y = yAt(p.x) + p.off;
          if (p.x > w + 10 || y < -10) Object.assign(p, spawn(r, false));
        }
        const y = yAt(p.x) + p.off;
        // Fade near the curve's flat start so the cloud reads as rising, not uniform noise.
        const fade = Math.min(1, Math.max(0, p.x / (w * 0.25)));
        ctx.globalAlpha = p.a * fade * (animate ? 0.75 + 0.25 * Math.sin(p.tw) : 1);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t; draw(dt);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (animate && !reduce.matches && visible && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(loop); } }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    new ResizeObserver(() => resize()).observe(canvas);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    reduce.addEventListener('change', () => { stop(); draw(0); start(); });
    resize(); start();
  }

  const init = () => document.querySelectorAll('canvas.fx-particles').forEach((c) => Field(c));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
