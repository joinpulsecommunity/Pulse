import Head from "next/head";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatDate, type Announcement } from "../components/Announcements";

type Session = { admin: boolean; loginReady: boolean; databaseReady: boolean };

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export default function Manage() {
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<Announcement[]>([]);
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const loadItems = useCallback(async () => {
    const d = await api("/api/announcements");
    setItems(d.items || []);
  }, []);

  useEffect(() => {
    api("/api/admin/session")
      .then((s) => {
        setSession(s);
        if (s.admin) loadItems();
      })
      .catch(() => setSession({ admin: false, loginReady: false, databaseReady: false }));
  }, [loadItems]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setNote(null);
    try {
      await fn();
    } catch (e: any) {
      setNote({ kind: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const login = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      setPassword("");
      setSession((s) => ({ ...(s as Session), admin: true }));
      await loadItems();
    });
  };

  const logout = () =>
    run(async () => {
      await api("/api/admin/logout", { method: "POST" });
      setSession((s) => ({ ...(s as Session), admin: false }));
    });

  const post = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api("/api/announcements", { method: "POST", body: JSON.stringify({ title, message }) });
      setTitle("");
      setMessage("");
      setNote({ kind: "ok", text: "Posted! It's now live on the website." });
      await loadItems();
    });
  };

  const remove = (it: Announcement) => {
    if (!window.confirm(`Delete "${it.title}"? This can't be undone.`)) return;
    run(async () => {
      await api(`/api/announcements?id=${encodeURIComponent(it.id)}`, { method: "DELETE" });
      setNote({ kind: "ok", text: "Deleted." });
      await loadItems();
    });
  };

  return (
    <>
      <Head>
        <title>Admin | PULSE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="brand" aria-label="PULSE home">
            <svg className="brand-mark" viewBox="0 0 40 24" aria-hidden="true">
              <path d="M1 13h9l4-10 6 19 5-14 3 5h11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="brand-text">PULSE<small>Admin</small></span>
          </a>
          <div className="manage-actions">
            <a href="/" className="btn btn-navy btn-sm">View Website</a>
            {session?.admin && (
              <button className="btn btn-outline-dark btn-sm" onClick={logout} disabled={busy}>Log Out</button>
            )}
          </div>
        </div>
      </header>

      <main className="manage">
        <div className="container manage-inner">
          {session === null && <p className="manage-muted">Loading…</p>}

          {session && !session.admin && (
            <form className="manage-card manage-login" onSubmit={login}>
              <p className="eyebrow">Admin</p>
              <h1>Log in</h1>
              {!session.loginReady ? (
                <p className="manage-alert error">Admin login isn&apos;t set up yet. Add an ADMIN_PASSWORD in Vercel, then redeploy.</p>
              ) : (
                <>
                  <label htmlFor="pw">Admin password</label>
                  <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
                  <button className="btn btn-gold" type="submit" disabled={busy || !password}>
                    {busy ? "Checking…" : "Log In"}
                  </button>
                </>
              )}
              {note && <p className={`manage-alert ${note.kind}`}>{note.text}</p>}
            </form>
          )}

          {session?.admin && (
            <>
              {!session.databaseReady && (
                <p className="manage-alert error">
                  The database isn&apos;t connected yet, so announcements can&apos;t be saved. Connect an Upstash Redis database to this project in Vercel (Storage tab), then redeploy.
                </p>
              )}

              <form className="manage-card" onSubmit={post}>
                <p className="eyebrow">New</p>
                <h1>Post an announcement</h1>
                <label htmlFor="title">Title</label>
                <input id="title" type="text" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} required />
                <label htmlFor="msg">Message</label>
                <textarea id="msg" rows={5} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} required />
                <small className="manage-muted">{message.length}/2000</small>
                <button className="btn btn-gold" type="submit" disabled={busy || !title.trim() || !message.trim()}>
                  {busy ? "Working…" : "Post Announcement"}
                </button>
                {note && <p className={`manage-alert ${note.kind}`}>{note.text}</p>}
              </form>

              <div className="manage-card">
                <p className="eyebrow">Live now</p>
                <h2>Current announcements</h2>
                {items.length === 0 && <p className="manage-muted">Nothing posted yet.</p>}
                <ul className="manage-list">
                  {items.map((it) => (
                    <li key={it.id}>
                      <div>
                        <strong>{it.title}</strong>
                        <span>{formatDate(it.createdAt)}</span>
                        <p>{it.message}</p>
                      </div>
                      <button className="btn btn-outline-dark btn-sm" onClick={() => remove(it)} disabled={busy}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
