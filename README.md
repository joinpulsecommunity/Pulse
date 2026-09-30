# PULSE — South Forsyth High School

Public Unified Leadership and Service Enterprise. Static site (HTML/CSS/JS) with a TinaCMS editor at `/admin`.

## Structure

```
index.html          page layout
css/styles.css      styling (colors are variables at the top)
js/main.js          loads content/site.json into the page + menu + animations
content/site.json   ALL editable text and image paths (edited through /admin)
tina/config.ts      defines what editors see in /admin
assets/images/      uploaded photos
scripts/build.js    copies the site into dist/ for deployment
vercel.json         Vercel settings
```

## Editing the site (for editors)

1. Go to `https://YOUR-SITE.vercel.app/admin` (or use the "Editor Login" link in the footer).
2. Log in with your Tina Cloud account.
3. Open **Website Content**, change text, upload photos, add or remove directors / officers / events, and press **Save**.
4. The site updates itself in about a minute.

New editors are added in Tina Cloud: [app.tina.io](https://app.tina.io) → your project → **Users**.

## One-time setup in Vercel

In the Vercel project: **Settings → Environment Variables**, add both (from your Tina Cloud project → **Overview**):

| Name | Value |
| --- | --- |
| `TINA_PUBLIC_CLIENT_ID` | your Client ID |
| `TINA_TOKEN` | your Read Only Token |

Then redeploy. In Tina Cloud, set **Site URLs** to your Vercel address so logins are allowed.

Vercel settings are already in `vercel.json` (build command `npm run build`, output `dist`).

## Running locally

```
npm install
npm run dev
```

Site: http://localhost:3000 · Editor: http://localhost:3000/admin/index.html (local mode, no login, saves to your files).

## Deploy

Push to GitHub → Vercel builds and deploys automatically.
