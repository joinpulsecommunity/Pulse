import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { Reveal, T } from "./ui";

export type Announcement = { id: string; title: string; message: string; createdAt: number };

export const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Public announcements: loaded live, so new posts show up right away without a rebuild. */
export default function Announcements({ a }: { a: any }) {
  const [items, setItems] = useState<Announcement[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/announcements", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => alive && setItems(d.items || []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, []);

  const tf = (f: string) => (a ? tinaField(a, f as any) : undefined);

  return (
    <section className="section section-tint" id="announcements">
      <div className="container">
        <Reveal as="header" className="section-head">
          <T className="eyebrow" v={a?.eyebrow} tina={tf("eyebrow")} />
          <T as="h2" v={a?.heading} tina={tf("heading")} />
        </Reveal>

        <div className="announce-list" aria-live="polite">
          {items === null && <div className="announce-loading" />}
          {items?.length === 0 && <T className="announce-empty" v={a?.emptyText} tina={tf("emptyText")} />}
          {items?.map((it, i) => (
            <Reveal as="article" className="announce" key={it.id} delay={i}>
              <div className="announce-date">
                <span>{formatDate(it.createdAt)}</span>
              </div>
              <div className="announce-body">
                <h3>{it.title}</h3>
                <p>{it.message}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
