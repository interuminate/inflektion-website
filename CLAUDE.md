# Inflektion website: working rules

Static HTML/CSS/JS homepage concepts. Read `DESIGN.md` (tokens) and `docs/content-architecture.md` (approved narrative) before changing any page. Preview with `.claude/launch.json` ("concepts", `python3 -m http.server 4321`).

## Scope
- Only the homepage is built. Other pages (Who we help, Why Inflektion, Pricing) appear as **inactive** nav items: `aria-disabled="true"`, no `href`, with "(coming soon)" for screen readers.
- Each concept lives in its own folder under `concepts/`. Shared foundations are in `concepts/shared/`. Reusable brand assets are in `assets/` (logo, favicon, client logos).

## Accessibility (WCAG 2.2 AA)
- Text contrast ≥ 4.5:1. Large text (≥ 24px, or ≥ 18.66px bold) and UI parts or focus indicators ≥ 3:1. Check new colour pairs before using them.
- `--brand-pink` (#FF14B9) is never used for text on light backgrounds.
- Every interactive element has a visible focus style (3px `--focus` ring, 2px offset). Never remove an outline without a replacement.
- Targets are at least 44×44px for primary controls and at least 24×24px for everything else.
- **Motion**: every animation and transition respects `prefers-reduced-motion: reduce`. With motion off and with JS off, all content is present and reads in DOM order. Scroll-driven effects are progressive enhancement only.
- **SVG**: decorative SVG and illustration compositions get `aria-hidden="true"` (plus `focusable="false"`). Informative SVG gets `role="img"` and a `<title>` (with `aria-labelledby`).
- One `h1` per page. Headings don't skip levels. Landmarks are header, nav, main and footer, plus a skip link.
- Interactive demos (audience switch) use real buttons with `aria-pressed` or a proper tablist, and they work with the keyboard.

## Typography
- Body text is at least 16px. Line length is 60–72ch.
- Use at most 3–4 type sizes per section, all from the `--fs-*` tokens.
- Overline/eyebrow labels are allowed only where they mark place (chapter markers in the scrollytelling sequence).
- Don't put a tracked all-caps label above every heading. No middle-dot meta lines. No decorative 01/02/03 numbering. No identical three-up card grids.
- Headings use sentence case. No gradient text.

## Copy
- Never invent testimonials, metrics, logos, awards or urgency. Use only the facts listed as approved in `docs/content-architecture.md`.
- Third-party stats carry a visible source note.
- Button labels start with a verb ("Book a demo", "Join the network"). No "Submit", "Learn more" or "Click here".

## Code
- Use tokens, never raw colour, size or spacing values in page CSS (illustration-only values inside `kit.css` are the exception).
- No frameworks or build step. Vanilla JS, deferred. Pages must render and read correctly with JS disabled.
- No console errors at 375px and 1280px. No horizontal page scroll at 375px.
- Commits use the global git identity. Don't change git config.
