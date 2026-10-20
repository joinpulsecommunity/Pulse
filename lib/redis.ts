// Minimal client for Upstash Redis (the free database from Vercel's Storage tab), using its REST API.
const URL_ENV = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const dbConfigured = () => !!(URL_ENV && TOKEN_ENV);

export async function redis<T = any>(command: (string | number)[]): Promise<T> {
  if (!URL_ENV || !TOKEN_ENV) throw new Error("DB_NOT_CONFIGURED");
  const res = await fetch(URL_ENV, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_ENV}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error || `Database error (${res.status})`);
  return json.result as T;
}
