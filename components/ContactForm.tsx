import { FormEvent, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { Reveal } from "./ui";

/** "Send us a message" form. Messages are emailed to the club's inbox through /api/contact. */
export default function ContactForm({ c }: { c: any }) {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const tf = (f: string) => (c ? tinaField(c, f as any) : undefined);
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("sent");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err: any) {
      setError(err.message);
      setState("error");
    }
  };

  return (
    <Reveal as="div" className="contact-form-wrap">
      <h3 className="contact-form-title" data-tina-field={tf("formTitle")}>
        {c?.formTitle}
      </h3>

      {state === "sent" ? (
        <div className="form-success" role="status">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M14 25l7 7 13-15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p data-tina-field={tf("successText")}>{c?.successText}</p>
          <button type="button" className="btn btn-navy btn-sm" onClick={() => setState("idle")}>
            Send Another
          </button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <div className="form-row">
            <div>
              <label htmlFor="cf-name">Name</label>
              <input id="cf-name" type="text" autoComplete="name" maxLength={100} value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label htmlFor="cf-email">Email</label>
              <input id="cf-email" type="email" autoComplete="email" maxLength={200} value={form.email} onChange={set("email")} required />
            </div>
          </div>
          <label htmlFor="cf-msg">Message</label>
          <textarea id="cf-msg" rows={6} maxLength={3000} value={form.message} onChange={set("message")} required />
          {/* hidden spam trap */}
          <input className="hp-field" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set("website")} />
          {state === "error" && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-gold" type="submit" disabled={state === "sending"} data-tina-field={tf("buttonText")}>
            {state === "sending" ? "Sending…" : c?.buttonText}
          </button>
        </form>
      )}
    </Reveal>
  );
}
