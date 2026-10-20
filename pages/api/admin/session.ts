import type { NextApiRequest, NextApiResponse } from "next";
import { authConfigured, isAdmin } from "../../../lib/auth";
import { dbConfigured } from "../../../lib/redis";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    admin: isAdmin(req),
    loginReady: authConfigured(),
    databaseReady: dbConfigured(),
  });
}
