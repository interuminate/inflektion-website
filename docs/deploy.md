# Publishing the review site at inflektion.codeart.mk

## Agreed setup (matches Power Plate)

Power Plate is published from a public repo on its owner's GitHub account with GitHub Pages. A `CNAME` file names the custom domain, and a single DNS record in the `codeart.mk` zone points the subdomain at the account's `github.io` host. Inflektion follows the same pattern:

| | Power Plate | Inflektion |
|---|---|---|
| Repo | public, owner's account (`krworkin-tech`) | public, owner's account (`interuminate/inflektion-website`) |
| Pages | one repo, a folder per version, a small picker at `/` | one repo, `site/` holds the picker at `/` and the three versions |
| Version links | `/classic/`, `/dynamic/` | `/concepts/v1-personalized-funnels/`, `/concepts/v2-portal-views/`, `/concepts/v3-brand-blocks/` (the pre-Nov 2026 addresses redirect) |
| Custom domain | `CNAME` file + Pages settings | `site/CNAME` + Pages settings |
| DNS | `CNAME powerplate → krworkin-tech.github.io` | `CNAME inflektion → interuminate.github.io` |

The one difference is how GitHub publishes. Power Plate publishes the repo as it is. Here a GitHub Actions workflow (`.github/workflows/pages.yml`) publishes only `site/`, so the docs, design notes, tools and round 1 archive stay out of the live site. The outcome is the same.

## Steps

1. **Make the repo public** (Settings → General → Danger zone → Change visibility). The repo, its history and the `round-1-concepts` tag become readable by anyone. The team has accepted this.
2. **Switch on Pages** (Settings → Pages → Build and deployment → Source: **GitHub Actions**).
3. **Set the custom domain** (Settings → Pages → Custom domain: `inflektion.codeart.mk`, then Save). `site/CNAME` carries the same value.
4. **DNS, done by the Codeart admin.** In the `codeart.mk` zone, add:
   - Type: `CNAME`
   - Name/Host: `inflektion`
   - Value: `interuminate.github.io`
5. **Turn on Enforce HTTPS** (Settings → Pages) once GitHub has seen the DNS record. The certificate usually takes a few minutes to an hour.
6. **Publish**: Actions → Deploy review site → Run workflow (or re-run the first run, which failed only because Pages was off).
7. **Test**: open https://inflektion.codeart.mk, open both versions, and use the browser's back button to return to the picker.

Until the DNS record is live, the site is also reachable at `https://interuminate.github.io/inflektion-website/`. All links are relative, so they work there too.

## Email to the Codeart admin (draft)

> **Subject:** DNS record for inflektion.codeart.mk (same setup as powerplate.codeart.mk)
>
> Hi,
>
> Could you add one DNS record in the codeart.mk zone, set up the same way as Power Plate?
>
> - Type: CNAME
> - Name/Host: inflektion
> - Value: interuminate.github.io
>
> The site is published with GitHub Pages from the public repo `interuminate/inflektion-website`. The custom domain is already set on the GitHub side, so once the record is live I'll turn on HTTPS and send the link around.
>
> If the zone is proxied through Cloudflare like Power Plate, please keep this record **DNS only** until GitHub has issued the certificate. After that it can be proxied, with SSL set to **Full**.
>
> Thanks!

## Updating the site later

Merge changes into `main`. The workflow republishes within a minute or two. Browsers may cache for about 10 minutes (GitHub Pages sends `max-age=600`), so reviewers may need a hard refresh.
