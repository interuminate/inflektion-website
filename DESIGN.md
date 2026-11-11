# Inflektion website: design foundations

These are the foundations for the round 2 homepage concepts (`site/concepts/v1-portal-views` (Version 1, Portal views) and `site/concepts/v2-lifestyle-frame` (Version 2, Lifestyle frame); they were called v3 and v4 during round 2). They are anchored in the product design system (Partner Portal, Figma): **Inter**, the **pink primary** and **violet secondary** ramps, and Tailwind grays. The website can carry more emotion and emphasis than the product. The brand anchors stay the same.

Tokens live in `site/concepts/shared/tokens.css`. The soft-UI illustration kit lives in `site/concepts/shared/kit.css`. Pages use token names, never raw values.

No real-site library was available (UXKIN not connected). The direction comes from the product DS and the references named by the user: Ramp for Startups and Cohere for Version 1; Gumroad, the client mockup and Fluz for Version 2.

## Color

All pairs below are checked (WCAG 2.x ratios). Text needs at least 4.5:1. UI parts and large text need at least 3:1.

### Brand anchors (fixed in both themes)
| Token | Value | Role |
|---|---|---|
| `--brand-pink` | `#FF14B9` | Logo mark, decorative accents, illustration fills. **Never text on white** (3.6:1) |
| `--brand-navy` | `#04093F` | Logo wordmark, ink colour in Version 2, dark surfaces |
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

### Version 2 shelf palette (thematic layer, pastel blocks with navy ink)
`--shelf-cream #FFF6E5`, `--shelf-pink #FF9BD8`, `--shelf-lilac #B9A8FF`, `--shelf-mint #7CE0B5`, `--shelf-butter #FFD84D`. Navy ink on each block is ≥ 6.5:1.

## Typography

One family: **Inter** (Google Fonts). At most three weights per concept: 400/600/700. Both concepts now set titles at 600. Body ≥ 16px, line length 60–72ch.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--fs-display` | `clamp(2.5rem, 1.8rem + 3vw, 3.75rem)` | 1.05 | 700 (Version 2: 800) | H1 only |
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
- Section padding: `--section-y: clamp(4rem, 2.8rem + 5vw, 8rem)`; Version 1 uses the tighter `--section-y-compact: clamp(3.5rem, 1rem + 6.5vw, 6.25rem)` (56px to 100px)
- Page gutter: `--gutter: clamp(1rem, 0.5rem + 2.5vw, 2.5rem)` (16px at 375)
- Content width: `--w-page 1200px`, `--w-text 40rem`

## Shape and depth
| Token | Version 1 Portal views | Version 2 Lifestyle frame |
|---|---|---|
| `--radius-sm` | 8px | 6px |
| `--radius-md` | 14px | 12px |
| `--radius-lg` | 24px | 20px |
| `--radius-pill` | 999px | 999px |
| `--stroke` | 1px `--border` | 2px `--brand-navy` |
| `--shadow-1` | `0 1px 2px rgb(4 9 63 / .06)` | `3px 3px 0 var(--ink)` |
| `--shadow-2` | `0 2px 4px rgb(4 9 63 / .04), 0 12px 32px -8px rgb(4 9 63 / .07)` | `6px 6px 0 var(--ink)` |

In Version 1, depth comes from a border first and then a soft shadow. In Version 2 (after the first Version 2 review), depth is a 1px hairline plus a flat offset shadow in pale violet (`6px 6px 0 #ECE9FB`, pink variant `#FBE3F1`), with no blur and no ink outline. The earlier thick-stroke Gumroad style is retired.

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
- **Buttons**: primary (pink fill, white text), secondary (border-ui outline, text colour), quiet (text link with arrow). Minimum height 44px, labels start with a verb. Focus is a 3px `--focus` ring with a 2px offset. Hover darkens by one step; press translates 1px (Version 2: the shadow collapses).
- **Links**: `--link`, underlined with a 0.12em thickness and a 0.2em offset.
- **Nav**: logo, three inactive page items (`aria-disabled="true"`, "coming soon" for screen readers, muted), Log in, Book a demo. On mobile it collapses to a menu button.
- **Footer**: three link groups, legal line.
- **Quote**: blockquote plus figcaption with name, role and company. No avatars unless real photos exist.

## Soft-UI illustration kit (`kit.css`)
Primitives: `.k-panel`, `.k-side`, `.k-bar`, `.k-stat`, `.k-chip`, `.k-row`, `.k-avatar`, `.k-btn`, `.k-line` (skeleton text), `.k-chart` (inline SVG). Each reads `--kit-*` tokens (surface, ink, stroke, radius, shadow, accent), so Version 1 and Version 2 render the same primitives in their own style. Kit compositions are decorative (`aria-hidden="true"`) and carry a visually hidden one-sentence description where the image adds meaning. Hand-drawn product illustrations from the designer replace them later.

## Particle field and inflection curve (`site/concepts/shared/fx-particles.js`)
A canvas background: a particle cloud that drifts up a logistic inflection curve, optionally with the curve drawn as a faint line. Dark surfaces animate it subtly; light surfaces use a static render (`motion: "static"`). It pauses off-screen and in hidden tabs, and draws a single still frame under `prefers-reduced-motion`. It's always `aria-hidden` and sits behind the content (`z-index: -1` inside an isolated section).

Tune it per preset in the page's `window.INFLEKTION_FX` block, or per canvas with `data-*` attributes: `density`, `size`, `speed`, `opacity`, `colors`, `spread`, `rise`, `bend`, `steepness`, `curve`, `curveOpacity`, `curveColor`, `motion`, `seed`. The defaults are documented in the file header. The continuous loop is a deliberate, user-requested exception to the "no infinite decorative loops" rule.

## Version 1 background rhythm
Version 1 is a fixed light page (`data-theme="light"`) with dark bookends:
- Dark navy hero (animated particles), then a lighter navy logo band.
- Violet-50 and white alternating: problem, how it works, portal, funnels, recognition, proof (static particles), creators (static particles).
- A compact two-column final CTA in the footer navy `#02052A`, so it reads as one block with the footer.
- `.surface-dark` re-maps the role tokens for navy sections. Product-UI kit panels stay light everywhere.

Testimonials use one card style everywhere (`.t-card`): a white card with the brand logo top left, the quote at one size, and the name in pink-700 `#D32691`. Brand pink `#FF14B9` fails text contrast on white (3.6:1), so it isn't used for the name.

## Imagery and icons
There are no stock photos. Icons are inline SVG at a 1.5px stroke in 20/24px boxes. Client logos are monochrome (inverted in dark mode).

## Version 1 icon tiles and chapter chips

- Icon tiles (`.icon-tile`, feature, pain-point and check-list tiles): white, 1px `#E4E0FB` stroke, violet glyph, soft violet shadow.
- Chapter chips: Lucide-style icon plus label in pink-700 at `--fs-lead`. The active chapter gets a pink outline, a `#FFF9FC` fill (4.54:1 with the label) and a 4% scale-up. The fill stays that pale so the label passes AA.

## Version 2 frame (first Version 2 review)

- Light header and footer; no dark bands.
- Sections are divided by 1px `#E7E5F3` hairlines. Side rails (desktop only) appear just on the logos, how-it-works, portal and recognition sections (`.railed`); there are no crosshair marks. The hero and final CTA add a faint 48px grid that fades out.
- Logos, the four stages and the award plaques sit in hairline cells that run to the rails.
- All five testimonials sit in one looping carousel: the arrows run forever in either direction, cards bleed past the content margin and are clipped only by the viewport. Without JS it is a horizontally scrollable list.
- Creator decals use three designer-supplied portraits as rounded squares with no white frame (sources in `docs/image-credits.md`).
- Lifestyle photos (from the client's mockup, placeholders until licensed or replaced) carry the hero and portal; soft UI is reduced to small white cards with a hairline and a flat violet block shadow.

## Version 3, Brand blocks (`site/concepts/v3-brand-blocks`)

Same copy as Versions 1 and 2, told with saturated full-bleed colour blocks, light large type and a blockier take on the soft UI, held back toward the restraint of the client's mockup. It loads `tokens.css` only (not `kit.css`); its own tokens sit at the top of its `style.css`.

- **Section fills**, in order: white hero and logos, pink `#DF0D99` (problem), violet `#6946F4` (how it works), lilac `#E9E5FF` (portal), navy `#04093F` (funnels), white (recognition), pink `#DF0D99` (proof), deep violet `#391296` (creators), navy (final CTA and footer). Each `.fill-*` class sets the role tokens `--ink`, `--ink-2`, `--line`, `--shadow-c` and `--focus` for its block. Blocks are square, full-bleed and scroll normally: no rounded section corners, no stacking transition (both removed after the second Version 3 review).
- **Contrast**: the pink sections use `--c-pink-fill` `#DF0D99`, the brightest pink that keeps white body text at AA (4.51:1). **Client-directed exception (sixth review):** like the client's mockup, Version 3 uses brand pink `#FF14B9` for primary CTAs (white label, 3.47:1, below the 4.5:1 AA minimum for 16–20px text), the hero accent line "Not the work." (passes as large text, 3:1), the chapter markers in the How it works cards (20px semibold, below AA) and all decorative illustration pinks. If AA becomes a launch requirement, the fix is navy labels on the pink buttons (5.4:1) or `--c-pink-fill` behind white labels. White on violet 5.6, white on deep violet 12.4, `#D1D2EE` on deep violet 8.3, `#A9AFCF` on navy 8.7, `#FF14B9` on navy 5.4 (used for the 200% figure and the final headline accent). The focus ring is white on pink, violet, deep violet and navy.
- **Type**: Inter, two weights. Large display type (hero, section headings, final headline, big figures) is set at 400 (`--fw-display`); 600 is kept for small headings, labels and UI. `--fs-mega` up to 96px, `--fs-d2` up to 60px, `--fs-num` up to 128px. Tracking -0.04em / -0.03em.
- **Hero**: compact and centred. On desktop (≥1024px) the hero and the logo strip share one block at least a viewport tall (minus the 73px header): the hero centres its content in the remaining space and the strip sits on the fold, with no padding between the strip and the pink section (checked at 1280×800, 1366×768, 1440×900 and 1920×1080; screens under 800px tall get tighter hero padding and 76px logo rows). A small award line (medal icon + link to Recognition) sits as an overline above the title; the lead and CTAs sit under the title, flanked by two square lifestyle photos (supplement creator left, fitness creator right, from the Version 2 image set) at about CTA height, each paired with an overlapping block-UI card (partner match, partner funnel) on its outer bottom corner. No dashboard illustration. The photos drift a few pixels in opposite directions on scroll (capped at ±24px, off under reduced motion). Below 1180px the photos move under the CTAs, side by side; on phones the cards hide.
- **Block UI kit** (`.b-*`): white panels with a 1px navy stroke and a flat offset shadow (4px, 6px for large panels; colour from the block: navy, violet or pink). Radii 6/10/14px. Stat tiles are filled colour blocks, like the product dashboard. No blur shadows anywhere.
- **Icons**: inline line icons use a 2px stroke (2.25px for the few 1.75px originals), half a pixel heavier than Versions 1 and 2, so they hold up next to the 1px navy strokes and flat shadows.
- **Buttons**: flat pill fills with no outline and no offset shadow; primary is brand pink `#FF14B9` with a white label, hover `#E6119F`, press moves 1px.
- **Problem section**: title ("In health, trust sells. Manual work can’t keep up.", rewritten with short words so it wraps cleanly in the half-width column at display size) and lead in the left column; the 81% card and the ROAS card stacked in the right column, top-aligned with the title; the four pain points run as a horizontal strip (icon tile + text, 48px below the divider, 64px between pairs) below both columns. Note: `ul[role="list"]` resets padding with higher specificity than a class, so list padding needs `.x[role="list"]`.
- **Portal section**: centred title and subtitle ("Every partner logs into a portal styled as your brand, not ours." / "Links, assets, payments and performance live in one place…"), then the explorer. Picking a swatch ("Try a different brand theme") re-tints the whole section through `.portal[data-brand]`: Sleep tech (default) lilac `#E9E5FF` / violet accent / navy ink, with white text on the portal's pink buttons and active tab; Supplements `#E6F1EA` / `#2E7D5B` / `#0F3D2E`; Fitness `#FFEDE0` / `#EA6A12` / `#1F2937`; Skincare `#F9E6EF` / `#B45886` / `#4A1D3F`. The accent drives the active feature and portal shadows; the ink drives text, strokes and the swatch ring.
- **Funnels section**: title left, lead right (the same `.split-head` as How it works). The Oura frame sits at the left content edge (76% wide) in a lighter-navy browser chrome `#141B52`; the pages rotate every 5s, timed by a 4px pink progress bar under the window bar, with the current page named in the bar. Rotation pauses on hover, when the frame is off-screen and with the pause button; it starts paused under reduced motion. The "Up to 200%" stat sits in a violet box with a pink offset shadow over the frame's lower-right corner (below it, right-aligned, on tablets and phones).
- **Recognition section**: centred one-line title "Industry recognized innovation.", no subtitle, four award cards in a row (two per row below 1024px).
- **How it works pin**: the pinned panel is a full viewport tall and centres its content vertically, so at common laptop heights the space above the title and below the progress bar (≈106px at 1280×800) matches the normal section padding. The four lilac art boxes share one height, set by script to the tallest, with their content centred. Inside them, brand pink `#FF14B9` is the only pink (buttons, the active pipeline step, the highlighted bar, the payouts tile, the active avatar); avatars are lilac and the highlighted row is violet-50.
- **Creators section**: imagery left, copy right (on wide screens). A skincare-creator photo with three simplified asset tiles (Email, Social, Video script: brand-pink line icon, semibold label, gray status) overlapping its edges, after the client mockup. The checklist uses a plain white check icon, no tile.
- **Final CTA**: the title is a normal section heading (`--fs-d2`), with the CTAs to its right; the Book a demo button uses the same brand-pink fill and white text as every other primary button. No subtitle.
- **Footer**: the logo is twice the header size (292px; 220px on phones).
- **Hero load-in** (tenth review): a one-off, ~1.5s choreography when the page opens at the top. Overline fades and rises 8px (0ms); the two title lines rise 24px (80ms, 180ms); lead and CTAs rise 16px (340ms, 420ms); the photos slide 24px in from their own side (520ms, 600ms); the partner-match and funnel cards pop from 96% with a 12px rise (780ms, 860ms); the logo strip fades in (900ms). The start state is set in an inline `<head>` script so nothing flashes; `main.js` clears it after 2s, or at once if the page reopens mid-scroll. Uses `animation-fill-mode: backwards` so the photo drift and the marquee keep their own transforms. Skipped under reduced motion, without JS, and with `?intro=off` (for comparison).
- **Section entry reveal** (eighth review): as each section scrolls in, its title, lead and main content groups (cards, award tiles, pain points, the Oura frame and stat box, the testimonial deck, the creator visual) fade in and rise 24px once (opacity 450ms, transform 700ms). Items that arrive together are staggered 70ms apart, top to bottom, capped at 420ms. Anything already on screen at load stays put, the helper classes are removed after the reveal so hover transitions are unaffected, and nothing is hidden under reduced motion or without JS. The final headline uses the same reveal (its scroll-linked word fill was removed in the ninth review); the stat count-ups and bar growth stay as they were.
- **Scroll motion**: "How it works" pins and moves sideways through the four chapters (≥1024px), with a single progress bar below the cards (the same gap above and below the cards);
- **Phase markers**: each chapter card opens with a Lucide-style icon and the phase name in brand pink at `--fs-lead`. The icon sits in a 44px brand-pink tile with a white icon, a 1px navy stroke and a 3px navy offset shadow, after the pain-point tiles. It is opt-in through the `phase-tiles` class on the How it works section; remove that class (or open the page with `?phase=plain`) to return to plain icons.
- **Interactions**: portal explorer (feature buttons swap the portal view, swatches swap the brand theme), audience buttons for the Oura funnel, a five-card testimonial deck (Truly Free, Oura, Aires Tech, Upgraded Formulas, Muse), and Read more dialogs (always a white fill over a 78% navy backdrop, one scroll area for the quote body with a slim 6px lilac scrollbar, never a scrolling dialog) for the long Truly Free and Oura quotes. All are buttons with `aria-pressed` or labelled controls, with a polite live region.
- **Logo strip**: centred "Trusted by…" line above a scrolling marquee. The visible pause button was removed at the client's request (seventh review); the marquee pauses on hover and keyboard focus and is a static wrapped row under reduced motion. Strictly, WCAG 2.2.2 asks for a visible pause control on motion that runs longer than five seconds.
- **Testimonial cards**: the quote sits at the top and the divider plus author block is pinned to the bottom of every card (flex column, `margin-top: auto`), with at least 32px between the quote and the divider.
- **Reduced motion and no JS**: no pinning, scrubbing or parallax; the chapters stack vertically, every block reads top to bottom, and the logo marquee becomes a static wrapped row.
