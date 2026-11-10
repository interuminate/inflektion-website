# Publishing the review site at inflektion.codeart.mk

## How Power Plate is hosted (checked from its public response headers)

`powerplate.codeart.mk` is served by **GitHub Pages** (`x-github-request-id`, Fastly cache) behind **Cloudflare** (the `codeart.mk` DNS zone uses Cloudflare name servers and the record is proxied). So the same setup should work here: GitHub Pages builds the site from a repo, and Cloudflare points `inflektion.codeart.mk` at it.

## What this repo already provides

- `site/` holds everything that should be public: the version picker and the two versions. Docs, design notes, tools and the round 1 archive live outside it and are never published.
- `.github/workflows/pages.yml` publishes `site/` to GitHub Pages on every push to `main` that touches `site/`, and can be run by hand from the Actions tab.
- `site/robots.txt` and the picker's `noindex` meta keep the review site out of search engines.

## Steps

1. **Merge the PR into `main`.** The workflow only publishes from `main`.
2. **Decide where the repo lives** (ask the Codeart admin, email below). The repo is currently **private** under the personal account `interuminate`. GitHub Pages for a private repo needs a paid plan (GitHub Pro, Team or Enterprise). The usual options:
   - transfer the repo, or a copy of it, to the Codeart GitHub organisation that hosts Power Plate, or
   - keep it here on a paid personal plan, or
   - make it public. This is not recommended, because the docs folder contains client research.
3. **Turn on Pages** in the repo that will publish: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. **Add the custom domain**: Settings → Pages → Custom domain: `inflektion.codeart.mk`. If the owning account or org has verified `codeart.mk` (Settings → Pages → Verified domains), this is immediate.
5. **DNS (Codeart admin, in Cloudflare):** add `CNAME inflektion → <owner>.github.io`, where `<owner>` is the account or org that owns the repo. Use **DNS only** (grey cloud) until GitHub has issued the certificate. After that, turn the proxy on if Codeart wants to match Power Plate, with SSL mode **Full**.
6. **Enforce HTTPS** in Settings → Pages once the certificate is ready.
7. **Run the workflow** (Actions → Deploy review site → Run workflow), or push any change under `site/`.
8. Check https://inflektion.codeart.mk, then open both versions from the picker and go back with the browser's back button.

## Email to the Codeart admin (draft)

> **Subject:** New review subdomain: inflektion.codeart.mk (same setup as powerplate.codeart.mk)
>
> Hi,
>
> I'd like to publish the Inflektion homepage concepts for client review the same way as Power Plate, at **inflektion.codeart.mk**.
>
> The site is plain static HTML with no build step, in the GitHub repo `interuminate/inflektion-website` (currently private). The repo includes a GitHub Actions workflow that publishes only the `site/` folder to GitHub Pages, plus a `robots.txt` that keeps it out of search engines.
>
> Could you help with the following?
>
> 1. **Where should the repo live?** Should I transfer it, or a copy, to the Codeart GitHub organisation that hosts Power Plate, or keep it on my account? (Pages on a private repo needs a paid plan, so I'd rather follow whatever Power Plate uses.)
> 2. **DNS:** please add `CNAME inflektion` pointing to `<owner>.github.io` in the `codeart.mk` Cloudflare zone. Please keep it DNS only until GitHub issues the certificate, then proxy it like Power Plate, with SSL set to Full.
> 3. **Domain verification:** if `codeart.mk` is already verified for GitHub Pages in the Codeart org, the custom domain should attach straight away once the repo is there.
>
> Once the repo is in place, I'll turn on Pages (source: GitHub Actions), set the custom domain to `inflektion.codeart.mk` and run the deploy.
>
> Thanks!

## Updating the site later

Merge changes into `main`. The workflow republishes within a minute or two. Browsers may cache for about 10 minutes (GitHub Pages sends `max-age=600`), so reviewers may need a hard refresh.
