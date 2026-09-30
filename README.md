# PULSE — South Forsyth High School

Public Unified Leadership and Service Enterprise. Static site (HTML/CSS/JS) — no build step.

## Structure

```
index.html        page content
css/styles.css    all styling (colors are variables at the top)
js/main.js        mobile menu + scroll animations
assets/           favicon + images folder
vercel.json       Vercel settings
```

## Filling in content

- Every `____` line is a text placeholder — replace it in `index.html`.
- Every gray `img-slot` box is an image placeholder. Drop photos in `assets/images/` and replace the slot's contents with `<img src="assets/images/photo.jpg" alt="...">`. Hero background: see `.hero-bg` in `css/styles.css`.
- To add more directors/officers, copy an `<article class="person">` block.

## Deploy (GitHub → Vercel)

1. Create a new GitHub repo and upload this folder's contents (or `git init`, commit, push).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Leave all settings as default (Framework Preset: **Other**, no build command) and click **Deploy**.

Every push to GitHub will redeploy automatically.
