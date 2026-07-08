# Wollongong Implant Institute — landing page

A single-page, liquid-glass landing page for dental implant / All-on-4 enquiries,
with a lead-capture form that sends submissions to the SmileSearch CRM.

## Files
- `index.html` — the entire site (HTML, CSS and JS inline; fonts load from Google Fonts)
- `api/lead.js` — serverless function that emails each lead to the CRM intake over SMTP/TLS
- `package.json` — declares the one dependency (nodemailer) the function needs
- `SETUP-crm-form.md` — how to connect the form to your CRM and go live

## Deploy (Vercel)
1. Push these files to a GitHub repo — **keep the `api/` folder and its path intact**.
2. Import the repo at vercel.com (Framework Preset: **Other**; leave Build Command and Output Directory blank).
3. Add your SMTP environment variables (see `SETUP-crm-form.md`) and redeploy.
4. Add your custom domain in Vercel → Settings → Domains, then add the matching record at your DNS provider.

The form posts to `/api/lead` on the same domain, so no extra configuration is needed once deployed.

## Image assets
All images referenced by `index.html` are included in this folder and load as relative paths:
`why-implant.webp`, `before-after-1.webp` … `before-after-7.webp`, `dental-corner-team.webp`,
`dr-bedeir.webp`, `practice.webp`. Keep them alongside `index.html` when you deploy.

## The "See the transformations" section
This section now holds three videos:
- A featured self-hosted practice intro (`HXUJ7555.mp4`, served from the WordPress site).
- Two patient videos hosted on Vimeo (`1206371270` and `1206370333`).

Each video sits behind a click-to-play poster so it never shows a black frame on load; the Vimeo
players are only requested when a visitor clicks. Notes:
- The two Vimeo posters use Vimeo's own thumbnail URLs (`i.vimeocdn.com`). If you'd rather host them
  yourself, download each thumbnail, drop it in this folder, and point the poster `background-image` at it.
- The featured intro uses `practice.webp` as a placeholder poster — swap it for an exported frame from
  the intro video if you'd like a true still.
- The Vimeo videos are unlisted, so the `h=` hash in each embed URL is required. If a video is
  domain-restricted, add the live domain under the video's Privacy → Embed settings in Vimeo.

## Still to fill in before launch
- Optional hero background photo
- Your AHPRA registration number — placeholder in the footer and the mobile booking panel
