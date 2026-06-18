# Connecting the form to your SmileSearch CRM

Your CRM receives leads **by email** — you send an email (over SMTP/TLS) to your unique
intake address with the lead data as a JSON body. A web browser can't send SMTP email on
its own, so the form needs a tiny backend to relay it. That backend is `api/lead.js`,
already written for you.

The flow:

```
visitor submits form  →  POST JSON to /api/lead  →  api/lead.js emails it (SMTP/TLS)  →  SmileSearch creates the lead
```

The JSON sent matches the CRM schema exactly:

```json
{ "firstName": "Taylor", "lastName": "Ray", "email": "taylor@example.com", "phoneNumber": "+61412345678" }
```

---

## Option A — Deploy the included relay (recommended)

Files in this folder: `index.html`, `api/lead.js`, `package.json`.

1. **Put them in one project and deploy to Vercel** (free): create a project, drag this
   folder in (or push to GitHub and import). Vercel serves `index.html` and turns
   `api/lead.js` into an endpoint at `https://YOUR-SITE.vercel.app/api/lead`.
   *(Netlify works too — move the file to `netlify/functions/lead.js`; the code is the same.)*

2. **Add your SMTP credentials** as environment variables in the host dashboard
   (Project → Settings → Environment Variables). You need an SMTP provider — the
   easiest free option is **Brevo** (smtp-relay.brevo.com, 300 emails/day, no card).
   SendGrid, Mailgun and Amazon SES also work. Example using Brevo:

   | Variable     | Example                                   |
   |--------------|-------------------------------------------|
   | `SMTP_HOST`  | `smtp-relay.brevo.com`                    |
   | `SMTP_PORT`  | `587`                                     |
   | `SMTP_USER`  | your Brevo login email                    |
   | `SMTP_PASS`  | your Brevo **SMTP key** (not the API key) |
   | `SMTP_FROM`  | a sender address you've verified in Brevo, e.g. `no-reply@yourdomain.com` |

3. **The form is already pointed at the relay.** `FORM_ENDPOINT` in `index.html` is
   set to `/api/lead` — a same-origin path, since the page and the function are on the
   same Vercel project. There's nothing to change here; just redeploy if you edit env vars.

4. **Test.** Submit the form, then confirm a new lead appears in your CRM pipeline with all
   four fields. (Tip: temporarily check the function logs in your host if it doesn't arrive.)

The intake address (`form+dac5fb33-…@intake.smilesearch.com.au`) is already baked into
`api/lead.js`, so there's nothing to paste there.

---

## Option B — No-code relay (if you'd rather not deploy code)

Use an automation tool to do the same email step:

- **Make.com / Zapier:** create a "Custom webhook" trigger (its URL becomes your
  `FORM_ENDPOINT`), then add an **email** step that sends **to** your intake address with the
  body set to the raw JSON `{ firstName, lastName, email, phoneNumber }` as plain text, over a
  TLS-enabled mail account. Make.com gives you the most control over the exact body.

This avoids hosting code but ties lead capture to that third-party automation.

---

## Notes
- Until `FORM_ENDPOINT` is set, the form runs in **demo mode**: it shows the success flow and
  the thank-you screen but doesn't send anything — handy for previewing.
- The CRM **de-duplicates** by matching email + phone, so re-submissions update the same lead
  rather than creating duplicates. You can also send a `"action": "UPDATE_TARGET_STATUS"` field
  later to move a lead's status (see the CRM docs) — not needed for this simple intake form.
- Keep TLS on. The CRM may reject mail sent without it.
