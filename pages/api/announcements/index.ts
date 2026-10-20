import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdmin } from "../../../lib/auth";
import { dbConfigured, redis } from "../../../lib/redis";

const KEY = "pulse:announcements";
const MAX_SHOWN = 50;

type Announcement = { id: string; title: string; message: string; createdAt: number };

async function readAll(): Promise<Announcement[]> {
  const flat = (await redis<string[]>(["HGETALL", KEY])) || [];
  const items: Announcement[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      items.push(JSON.parse(flat[i]));
    } catch {
      /* skip unreadable entries */
    }
  }
  return items.sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_SHOWN);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  // Everyone can read announcements
  if (req.method === "GET") {
    if (!dbConfigured()) return res.status(200).json({ items: [], databaseReady: false });
    try {
      return res.status(200).json({ items: await readAll(), databaseReady: true });
    } catch {
      return res.status(200).json({ items: [], databaseReady: true, error: true });
    }
  }

  // Only the admin can add or remove
  if (!isAdmin(req)) return res.status(401).json({ error: "Please log in as admin." });
  if (!dbConfigured()) {
    return res.status(503).json({ error: "The database is not connected yet. See the setup steps." });
  }

  try {
    if (req.method === "POST") {
      const title = String(req.body?.title ?? "").trim().slice(0, 120);
      const message = String(req.body?.message ?? "").trim().slice(0, 2000);
      if (!title || !message) return res.status(400).json({ error: "Please enter a title and a message." });
      const item: Announcement = { id: randomUUID(), title, message, createdAt: Date.now() };
      await redis(["HSET", KEY, item.id, JSON.stringify(item)]);
      return res.status(201).json({ item });
    }

    if (req.method === "DELETE") {
      const id = String(req.query.id ?? "");
      if (!id) return res.status(400).json({ error: "Missing id." });
      await redis(["HDEL", KEY, id]);
      return res.status(200).json({ ok: true });
    }
  } catch {
    return res.status(500).json({ error: "Something went wrong saving that. Please try again." });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
