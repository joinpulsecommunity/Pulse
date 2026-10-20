import type { NextApiRequest, NextApiResponse } from "next";
import { authConfigured, clientIp, passwordMatches, startSession } from "../../../lib/auth";
import { dbConfigured, redis } from "../../../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!authConfigured()) {
    return res.status(503).json({ error: "Admin login is not set up yet (ADMIN_PASSWORD is missing)." });
  }

  // slow down password guessing: 10 tries per 15 minutes per visitor
  if (dbConfigured()) {
    try {
      const key = `pulse:login:${clientIp(req)}`;
      const tries = await redis<number>(["INCR", key]);
      if (tries === 1) await redis(["EXPIRE", key, 900]);
      if (tries > 10) return res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
    } catch {
      /* if the database is down, still allow login */
    }
  }

  const attempt = typeof req.body?.password === "string" ? req.body.password : "";
  if (!passwordMatches(attempt)) return res.status(401).json({ error: "Incorrect password." });

  startSession(res);
  return res.status(200).json({ ok: true });
}
