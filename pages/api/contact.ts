import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";
import { clientIp } from "../../lib/auth";
import { dbConfigured, redis } from "../../lib/redis";

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return res.status(503).json({ error: "Messaging isn't available right now. Please try again later." });
  }

  // Hidden field that real visitors never fill in; bots do.
  if (req.body?.website) return res.status(200).json({ ok: true });

  const name = clean(req.body?.name, 100);
  const email = clean(req.body?.email, 200);
  const message = String(req.body?.message ?? "").trim().slice(0, 3000);

  if (!name || !email || message.length < 5) {
    return res.status(400).json({ error: "Please fill in your name, email, and a message." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look right." });
  }

  // limit to 5 messages per hour per visitor
  if (dbConfigured()) {
    try {
      const key = `pulse:contact:${clientIp(req)}`;
      const count = await redis<number>(["INCR", key]);
      if (count === 1) await redis(["EXPIRE", key, 3600]);
      if (count > 5) return res.status(429).json({ error: "Too many messages. Please try again later." });
    } catch {
      /* if the database is down, still send the message */
    }
  }

  const transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 25), secure: false, tls: { rejectUnauthorized: false } })
    : nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

  try {
    await transporter.sendMail({
      from: `"PULSE Website" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `PULSE website message from ${name}`,
      text: `New message from the PULSE website\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\n---\nReply to this email to answer ${name} directly.`,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "We couldn't send your message. Please try again in a moment." });
  }
}
