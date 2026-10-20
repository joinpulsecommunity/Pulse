import { createHmac, timingSafeEqual } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

const COOKIE = "pulse_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // stay logged in for 7 days

const password = () => process.env.ADMIN_PASSWORD || "";
const secret = () => process.env.ADMIN_SESSION_SECRET || password();

export const authConfigured = () => password().length > 0;

const sign = (exp: number) => createHmac("sha256", secret()).update(`admin.${exp}`).digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(attempt: string) {
  if (!authConfigured()) return false;
  // hash both sides so the comparison always takes the same time
  const h = (s: string) => createHmac("sha256", "pulse-pw").update(s).digest("hex");
  return safeEqual(h(attempt), h(password()));
}

export function startSession(res: NextApiResponse) {
  const exp = Date.now() + MAX_AGE * 1000;
  const value = `${exp}.${sign(exp)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secure}`);
}

export function endSession(res: NextApiResponse) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
}

export function isAdmin(req: NextApiRequest) {
  if (!authConfigured()) return false;
  const raw = (req.headers.cookie || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const [expStr, sig] = raw.slice(COOKIE.length + 1).split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export const clientIp = (req: NextApiRequest) =>
  String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
