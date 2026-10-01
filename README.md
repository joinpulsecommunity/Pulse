# PULSE — South Forsyth High School

Public Unified Leadership and Service Enterprise. A Next.js site with TinaCMS click-to-edit.

## Editing the site (for editors)

1. Go to `https://YOUR-SITE.vercel.app/admin` (or use "Editor Login" in the footer) and log in with your Tina Cloud account.
2. The website opens with the editing panel on the left. **Click any text or photo on the page** to edit it, or use the sidebar to add/remove directors, officers, events, gallery photos, and more.
3. Press **Save**. The site updates itself in about a minute.

New editors are added in Tina Cloud: [app.tina.io](https://app.tina.io) → your project → **Users**.

## Structure

```
pages/index.tsx       the page (loads content from Tina)
components/Site.tsx   every section of the page
components/ui.tsx     shared pieces (animations, photo slots, click-to-edit text)
styles/styles.css     all styling (colors are variables at the top)
content/site.json     ALL editable text and photo paths
tina/config.ts        defines what editors can change
public/assets/images  photos (credits in CREDITS.md)
```

## One-time Vercel setup

**Settings → Environment Variables** (values from Tina Cloud → your project → Overview):

| Name | Value |
| --- | --- |
| `TINA_PUBLIC_CLIENT_ID` | your Client ID |
| `TINA_TOKEN` | your Read Only Token |

Then redeploy. In Tina Cloud, set **Site URLs** to your Vercel address.

## Running locally

```
npm install
npm run dev
```

Site: http://localhost:3000 · Editor: http://localhost:3000/admin (local mode, no login, saves to your files).

## Deploy

Push to GitHub → Vercel builds (`tinacms build && next build`) and deploys automatically.
