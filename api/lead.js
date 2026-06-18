// api/lead.js
// ---------------------------------------------------------------------------
// Relays a website-form submission to your SmileSearch CRM intake address by
// email. A browser cannot speak SMTP, so the landing page POSTs the lead here
// as JSON and this function sends it on over SMTP/TLS — exactly as the
// SmileSearch "Integrate Website Form Intake" docs describe.
//
// Drop this file in an /api folder of a Vercel project (or use it as a Netlify
// function), deploy alongside index.html, then set CONFIG.FORM_ENDPOINT in
// index.html to this function's public URL, e.g. https://your-site.com/api/lead
//
// Required environment variables (set them in your host's dashboard — NOT here):
//   SMTP_HOST   your SMTP server, e.g. smtp.sendgrid.net / smtp.gmail.com / email-smtp.<region>.amazonaws.com
//   SMTP_USER   SMTP username
//   SMTP_PASS   SMTP password / app password / API key
//   SMTP_FROM   the "from" address your provider is verified to send as, e.g. no-reply@yourdomain.com
// Optional:
//   SMTP_PORT     465 (implicit TLS, default) or 587 (STARTTLS)
//   ALLOW_ORIGIN  your site's origin to lock down CORS, e.g. https://wollongongimplantinstitute.com.au
//                 (defaults to "*"; set it once you know your final domain)
// ---------------------------------------------------------------------------

import nodemailer from "nodemailer";

// Your unique SmileSearch intake address.
const INTAKE_ADDRESS = "form+dac5fb33-51e2-4fd6-b5ec-7ec1ed518e13@intake.smilesearch.com.au";

export default async function handler(req, res) {
  // --- CORS ---
  const origin = process.env.ALLOW_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    // Vercel parses JSON bodies automatically; fall back to manual parse to be safe.
    const body = typeof req.body === "object" && req.body
      ? req.body
      : JSON.parse(req.body || "{}");

    // Honeypot: bots fill the hidden "company" field. Pretend success and drop it.
    if (body.company) return res.status(200).json({ ok: true });

    const firstName   = (body.firstName   || "").toString().trim();
    const lastName    = (body.lastName    || "").toString().trim();
    const email       = (body.email       || "").toString().trim();
    const phoneNumber = (body.phoneNumber || "").toString().trim();

    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // Only forward the fields we intend to store (SmileSearch's schema).
    const payload = { firstName, lastName, email, phoneNumber };

    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,   // 465 = implicit TLS; 587 = STARTTLS (upgraded below)
      requireTLS: true,       // the CRM requires TLS — never send in the clear
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      to: INTAKE_ADDRESS,
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      replyTo: email,
      subject: "Website form submission",
      text: JSON.stringify(payload),   // plain-text JSON body, per the CRM spec
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Lead relay failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to send" });
  }
}
