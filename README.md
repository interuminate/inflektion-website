# Inflektion website

Homepage concepts for Inflektion, prepared for client review.

## Structure

- `site/`: everything that is published (and nothing else)
  - `index.html`: the version picker
  - `concepts/v1-portal-views/`: Version 1, Portal views
  - `concepts/v2-lifestyle-frame/`: Version 2, Lifestyle frame
  - `concepts/shared/`: tokens, soft-UI kit and the particle field shared by both versions
  - `assets/`: logo, favicon, client logos, awards, funnel screenshots, lifestyle photos
  - `robots.txt`: keeps the review site out of search engines
- `archive/round-1/`: the round 1 concepts (Minimal, Illustrated). Not deployed. Also tagged `round-1-concepts`.
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
