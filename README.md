# Inflektion website

Homepage concepts for Inflektion, prepared for client review.

## Structure

- `site/`: everything that is published (and nothing else)
  - `index.html`: the version picker
  - `concepts/v1-personalized-funnels/`: Version 1, Personalized funnels (a colleague's design, imported 1-for-1; self-contained)
  - `concepts/v2-portal-views/`: Version 2, Portal views
  - `concepts/v3-brand-blocks/`: Version 3, Brand blocks
  - `concepts/v1-portal-views/`, `concepts/v2-lifestyle-frame/`: redirects for links shared before the Nov 2026 renumbering
  - `concepts/shared/`: tokens, soft-UI kit and the particle field shared by the versions
  - `assets/`: logo, favicon, client logos, awards, funnel screenshots, lifestyle photos
  - `robots.txt`: keeps the review site out of search engines
- `archive/round-1/`: the round 1 concepts (Minimal, Illustrated). Not deployed. Also tagged `round-1-concepts`.
- `archive/round-2/`: Lifestyle frame (Version 2 until Nov 2026), with its own copy of `shared/` and its assets. Not deployed.
- `docs/`: content architecture, deploy notes, image credits
- `DESIGN.md`, `CLAUDE.md`: design tokens and working rules
- `tools/serve.py`: local preview server with caching turned off
- `.github/workflows/pages.yml`: publishes `site/` to GitHub Pages

## Run locally

Static HTML, no build. From the repo root:

```bash
python3 tools/serve.py 4321 site
```

Then open http://localhost:4321. To look at the archived round 1 concepts:

```bash
python3 tools/serve.py 4322 archive/round-1
```

## Publish

See `docs/deploy.md`. The live review site is planned for https://inflektion.codeart.mk.
