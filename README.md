# PULSE — South Forsyth High School

Public Unified Leadership and Service Enterprise. A Next.js site with TinaCMS click-to-edit.

## Editing the site (for editors)

1. Go to `https://YOUR-SITE.vercel.app/admin` (or use "Editor Login" in the footer) and log in with your Tina Cloud account.
2. The website opens with the editing panel on the left. **Click any text or photo on the page** to edit it, or use the sidebar to add/remove directors, officers, events, gallery photos, and more.
3. Press **Save**. The site updates itself in about a minute.

New editors are added in Tina Cloud: [app.tina.io](https://app.tina.io) → your project → **Users**.

## Announcements (for admins)

1. Go to `/manage` (or "Admin Login" in the footer) and enter the admin password.
2. Type a title and message, press **Post Announcement**. It shows on the website immediately for everyone and stays until you delete it from the same page.

This is separate from the Tina editor (`/admin`), which edits the page text and photos.

## Structure

```
pages/index.tsx       the page (loads content from Tina)
pages/manage.tsx      admin login + announcement poster
pages/api/            announcements + admin login endpoints
lib/                  database + login helpers
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

**For announcements** also add `ADMIN_PASSWORD` (the password you pick), and connect a free **Upstash Redis** database from the Vercel project's **Storage** tab (this adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically).

Then redeploy. In Tina Cloud, set **Site URLs** to your Vercel address.

## Running locally

```
npm install
npm run dev
```

Site: http://localhost:3000 · Editor: http://localhost:3000/admin (local mode, no login, saves to your files).

## Deploy

Push to GitHub → Vercel builds (`tinacms build && next build`) and deploys automatically.
