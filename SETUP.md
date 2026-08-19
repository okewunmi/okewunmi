# Setup

This repo is your GitHub profile README (`github.com/okewunmi`) plus the
automation that keeps the hero banner and package stat cards up to date.

## How it works

1. `scripts/generate-hero.js` builds `assets/hero.svg` — a plain SVG banner,
   no image dependencies required.
2. `scripts/generate-stats.js` calls the GitHub API (stars) and the npm
   downloads API (weekly downloads) for each package listed in that file,
   and writes one `assets/card-<repo>.svg` per package.
3. `.github/workflows/update-stats.yml` runs both scripts nightly (06:00 UTC),
   on every push to `main` that touches `scripts/` or `package.json`, and on
   manual trigger. It then copies the freshly generated `assets/` folder onto
   an orphan `live-stats` branch and pushes it.
4. `README.md` on `main` embeds those files via stable raw URLs, e.g.:
   `https://raw.githubusercontent.com/okewunmi/okewunmi/live-stats/assets/hero.svg`
   Because only the `live-stats` branch changes, the README on `main` never
   needs to be edited when stats change.

## First-time setup

1. Push this repo to `github.com/okewunmi/okewunmi` (the special repo name
   that GitHub renders as your profile README).
2. No extra secrets are needed — the workflow uses the default
   `GITHUB_TOKEN`, which already has `contents: write` permission granted in
   the workflow file. If your org has restricted default token permissions,
   go to **Settings → Actions → General → Workflow permissions** and enable
   "Read and write permissions".
3. Run the workflow once manually: **Actions → Update live stats → Run
   workflow**. This creates the `live-stats` branch and populates it.
4. After that first run, confirm the images load in `README.md` on `main` —
   GitHub caches raw URLs briefly, so give it a minute if a card looks stale.

## Adding or removing a featured package

Edit the `PACKAGES` array at the top of `scripts/generate-stats.js` — each
entry needs the GitHub repo name, the npm package name, a short label, and a
one-line description. Then update the corresponding `<img>` block and table
row in `README.md`.

## Running locally

```bash
npm run generate
```

This writes into `assets/` on whatever branch you're on. Note that stars and
downloads will show as "publishing soon" for any package not yet on
GitHub/npm, or if run somewhere without outbound network access.
