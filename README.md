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

## Still to fill in before launch
- Real before/after image URLs — the `BEFORE_AFTER` array near the top of the `<script>` in `index.html`
- Optional hero background photo
- Your AHPRA registration number — placeholder in the footer and the mobile booking panel
