# Inflektion website: design foundations

These are the foundations for the round 2 homepage concepts (`concepts/v3-portal-views`, `concepts/v4-lifestyle-frame`). They are anchored in the product design system (Partner Portal, Figma): **Inter**, the **pink primary** and **violet secondary** ramps, and Tailwind grays. The website can carry more emotion and emphasis than the product. The brand anchors stay the same.

Tokens live in `concepts/shared/tokens.css`. The soft-UI illustration kit lives in `concepts/shared/kit.css`. Pages use token names, never raw values.

No real-site library was available (UXKIN not connected). The direction comes from the product DS and the references named by the user: Ramp for Startups and Cohere for v3; Gumroad, the client mockup and Fluz for v4.

## Color

All pairs below are checked (WCAG 2.x ratios). Text needs at least 4.5:1. UI parts and large text need at least 3:1.

### Brand anchors (fixed in both themes)
| Token | Value | Role |
|---|---|---|
| `--brand-pink` | `#FF14B9` | Logo mark, decorative accents, illustration fills. **Never text on white** (3.6:1) |
| `--brand-navy` | `#04093F` | Logo wordmark, ink colour in v4, dark surfaces |
| `--brand-violet` | `#6946F4` | Secondary emphasis, charts, focus ring on light |
| `--brand-violet-deep` | `#391296` | Deep surfaces, product sidebar in illustrations |

### Roles: light
| Token | Value | Role | Contrast |
|---|---|---|---|
| `--bg` | `#FFFFFF` | Page | – |
| `--bg-subtle` | `#F9FAFB` | Alternating section | – |
| `--bg-tint` | `#F4F4FB` | Violet-50 band, illustration stage | – |
| `--surface` | `#FFFFFF` | Cards, panels | – |
| `--text` | `#04093F` | Headings, body | 18.8 on white |
| `--text-muted` | `#4B5563` | Secondary text | 7.6 on white, 6.9 on tint |
| `--border` | `#E5E7EB` | Hairlines (decorative only) | – |
| `--border-ui` | `#6B7280` | Borders that carry meaning (inputs, toggles) | 4.8 |
| `--primary` | `#D32691` | Primary button fill (pink-700) | white text 4.7 |
| `--primary-hover` | `#B01E78` | Hover/active | white text 6.4 |
| `--link` | `#B01E78` | Inline links (underlined) | 6.4 on white |
| `--accent` | `#6946F4` | Violet emphasis, charts | 5.6 on white |
| `--focus` | `#6946F4` | 3px focus ring + 2px offset | 5.6 |

### Roles: dark (`prefers-color-scheme: dark`, or `[data-theme="dark"]`)
| Token | Value | Contrast |
|---|---|---|
| `--bg` | `#070B2E` | – |
| `--bg-subtle` / `--surface` | `#0D1238` / `#111845` | – |
| `--text` | `#F3F4F6` | 17.4 |
| `--text-muted` | `#A9AFCF` | 8.9 on bg, 7.8 on surface |
| `--border-ui` | `#7A82B8` | ≥3 on bg and surface |
| `--primary` | `#D32691` (white text) | 4.7 |
| `--link` | `#FF6CCB` | 7.5 |
| `--accent` / `--focus` | `#9D86FF` | 6.7 |

### Chart and illustration hues (from the product DS)
`--chart-green #34D399`, `--chart-indigo #818CF8`, `--chart-blue #60A5FA`, `--chart-orange #FB923C`. Use them for bars, dots and chips inside illustrations only. Never use colour alone to carry meaning.

### v4 shelf palette (thematic layer, pastel blocks with navy ink)
`--shelf-cream #FFF6E5`, `--shelf-pink #FF9BD8`, `--shelf-lilac #B9A8FF`, `--shelf-mint #7CE0B5`, `--shelf-butter #FFD84D`. Navy ink on each block is ≥ 6.5:1.

## Typography

One family: **Inter** (Google Fonts). At most three weights per concept: 400/600/700. Both concepts now set titles at 600. Body ≥ 16px, line length 60–72ch.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--fs-display` | `clamp(2.5rem, 1.8rem + 3vw, 3.75rem)` | 1.05 | 700 (v4: 800) | H1 only |
| `--fs-h2` | `clamp(1.875rem, 1.45rem + 1.8vw, 2.75rem)` | 1.12 | 700 | Section headings |
| `--fs-h3` | `clamp(1.25rem, 1.12rem + 0.55vw, 1.5rem)` | 1.25 | 600 | Sub-heads, card titles |
| `--fs-lead` | `clamp(1.125rem, 1.06rem + 0.3vw, 1.25rem)` | 1.55 | 400 | Intro paragraph |
| `--fs-body` | `1rem` | 1.6 | 400 | Body |
| `--fs-small` | `0.875rem` | 1.45 | 500 | Source notes, legal, kit labels |

Heading tracking is `-0.02em` (display `-0.03em`). Headings use sentence case. At most four sizes per section.

**Overlines** appear only as chapter markers in the sticky "How it works" sequence: `--fs-small`, 600, no tracking, sentence case. Not used anywhere else.

## Breakpoints
Two queries, three bands: narrow `max-width: 767.98px`, medium `max-width: 1023.98px` (two columns stack, nav collapses), wide `min-width: 1024px` (sticky scrollytelling). Prove at 375 and 1280.

## Spacing
4/8 grid: `--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 24 · `--sp-6` 32 · `--sp-7` 48 · `--sp-8` 64 · `--sp-9` 96 · `--sp-10` 128 (px).
- Section padding: `--section-y: clamp(4rem, 2.8rem + 5vw, 8rem)`; v3 uses the tighter `--section-y-compact: clamp(3.5rem, 1rem + 6.5vw, 6.25rem)` (56px to 100px)
- Page gutter: `--gutter: clamp(1rem, 0.5rem + 2.5vw, 2.5rem)` (16px at 375)
- Content width: `--w-page 1200px`, `--w-text 40rem`

## Shape and depth
| Token | v3 Portal views | v4 Lifestyle frame |
|---|---|---|
| `--radius-sm` | 8px | 6px |
| `--radius-md` | 14px | 12px |
| `--radius-lg` | 24px | 20px |
| `--radius-pill` | 999px | 999px |
| `--stroke` | 1px `--border` | 2px `--brand-navy` |
| `--shadow-1` | `0 1px 2px rgb(4 9 63 / .06)` | `3px 3px 0 var(--ink)` |
| `--shadow-2` | `0 2px 4px rgb(4 9 63 / .04), 0 12px 32px -8px rgb(4 9 63 / .07)` | `6px 6px 0 var(--ink)` |

In v3, depth comes from a border first and then a soft shadow. In v4 (after the first v4 review), depth is a 1px hairline plus a flat offset shadow in pale violet (`6px 6px 0 #ECE9FB`, pink variant `#FBE3F1`), with no blur and no ink outline. The earlier thick-stroke Gumroad style is retired.

## Motion
| Token | Value | Use |
|---|---|---|
| `--dur-1` | 100ms | Hover, press |
| `--dur-2` | 150ms | Toggles, tabs |
| `--dur-3` | 200ms | Panel state swaps |
| `--dur-4` | 300ms | Section reveal |
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | Entering |
| `--ease-in-out` | `cubic-bezier(.6,0,.3,1)` | State swaps |

Animate only `opacity` and `transform`. Under `prefers-reduced-motion: reduce`, durations collapse to 0ms (opacity fades of at most 120ms are allowed). Sticky scrollytelling falls back to stacked static chapters, and all content stays visible without JS.

## Components
- **Buttons**: primary (pink fill, white text), secondary (border-ui outline, text colour), quiet (text link with arrow). Minimum height 44px, labels start with a verb. Focus is a 3px `--focus` ring with a 2px offset. Hover darkens by one step; press translates 1px (v4: the shadow collapses).
- **Links**: `--link`, underlined with a 0.12em thickness and a 0.2em offset.
- **Nav**: logo, three inactive page items (`aria-disabled="true"`, "coming soon" for screen readers, muted), Log in, Book a demo. On mobile it collapses to a menu button.
- **Footer**: three link groups, legal line.
- **Quote**: blockquote plus figcaption with name, role and company. No avatars unless real photos exist.

## Soft-UI illustration kit (`kit.css`)
Primitives: `.k-panel`, `.k-side`, `.k-bar`, `.k-stat`, `.k-chip`, `.k-row`, `.k-avatar`, `.k-btn`, `.k-line` (skeleton text), `.k-chart` (inline SVG). Each reads `--kit-*` tokens (surface, ink, stroke, radius, shadow, accent), so v3 and v4 render the same primitives in their own style. Kit compositions are decorative (`aria-hidden="true"`) and carry a visually hidden one-sentence description where the image adds meaning. Hand-drawn product illustrations from the designer replace them later.

## Particle field and inflection curve (`concepts/shared/fx-particles.js`)
A canvas background: a particle cloud that drifts up a logistic inflection curve, optionally with the curve drawn as a faint line. Dark surfaces animate it subtly; light surfaces use a static render (`motion: "static"`). It pauses off-screen and in hidden tabs, and draws a single still frame under `prefers-reduced-motion`. It's always `aria-hidden` and sits behind the content (`z-index: -1` inside an isolated section).

Tune it per preset in the page's `window.INFLEKTION_FX` block, or per canvas with `data-*` attributes: `density`, `size`, `speed`, `opacity`, `colors`, `spread`, `rise`, `bend`, `steepness`, `curve`, `curveOpacity`, `curveColor`, `motion`, `seed`. The defaults are documented in the file header. The continuous loop is a deliberate, user-requested exception to the "no infinite decorative loops" rule.

## v3 background rhythm
v3 is a fixed light page (`data-theme="light"`) with dark bookends:
- Dark navy hero (animated particles), then a lighter navy logo band.
- Violet-50 and white alternating: problem, how it works, portal, funnels, recognition, proof (static particles), creators (static particles).
- A compact two-column final CTA in the footer navy `#02052A`, so it reads as one block with the footer.
- `.surface-dark` re-maps the role tokens for navy sections. Product-UI kit panels stay light everywhere.

Testimonials use one card style everywhere (`.t-card`): a white card with the brand logo top left, the quote at one size, and the name in pink-700 `#D32691`. Brand pink `#FF14B9` fails text contrast on white (3.6:1), so it isn't used for the name.

## Imagery and icons
There are no stock photos. Icons are inline SVG at a 1.5px stroke in 20/24px boxes. Client logos are monochrome (inverted in dark mode).

## v3 icon tiles and chapter chips

- Icon tiles (`.icon-tile`, feature, pain-point and check-list tiles): white, 1px `#E4E0FB` stroke, violet glyph, soft violet shadow.
- Chapter chips: Lucide-style icon plus label in pink-700 at `--fs-lead`. The active chapter gets a pink outline, a `#FFF9FC` fill (4.54:1 with the label) and a 4% scale-up. The fill stays that pale so the label passes AA.

## v4 frame (first v4 review)

- Light header and footer; no dark bands.
- Sections are divided by 1px `#E7E5F3` hairlines. Side rails (desktop only) appear just on the logos, how-it-works, portal and recognition sections (`.railed`); there are no crosshair marks. The hero and final CTA add a faint 48px grid that fades out.
- Logos, the four stages and the award plaques sit in hairline cells that run to the rails.
- All five testimonials sit in one looping carousel: the arrows run forever in either direction, cards bleed past the content margin and are clipped only by the viewport. Without JS it is a horizontally scrollable list.
- Creator decals use three designer-supplied portraits as rounded squares with no white frame (sources in `assets/lifestyle/CREDITS.md`).
- Lifestyle photos (from the client's mockup, placeholders until licensed or replaced) carry the hero and portal; soft UI is reduced to small white cards with a hairline and a flat violet block shadow.
