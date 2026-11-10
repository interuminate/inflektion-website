# Inflektion Website

Landing page concepts for Inflektion.

## Structure

- `index.html` — version picker for client review
- `concepts/v1-minimal/` — V1, minimal and brand-led (the "inflection curve" line motif)
- `concepts/v2-illustrated/` — V2, illustrated and graphic (colour blocks, sticker cards, drawn scenes)
- `assets/` — logo, favicon, client logos, `switcher.js` (the floating review switcher, remove for production)

## Run locally

Static HTML, no build. From the repo root:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321.
