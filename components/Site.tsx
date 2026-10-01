import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { CountNumber, Reveal, Slot, T, isBlank, ph, useInEditor } from "./ui";

type Data = any;
const list = (v: any): any[] => (Array.isArray(v) ? v : []);
const tf = (obj: any, field?: string) => (obj ? tinaField(obj, field as any) : undefined);

function isExternal(url?: string | null) {
  return !!url && /^https?:\/\//i.test(url);
}
const linkProps = (url?: string | null) =>
  isExternal(url) ? { target: "_blank", rel: "noopener noreferrer" } : {};

/* ---------------- Header ---------------- */

function Header({ s }: { s: Data }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);
  const links = [
    ["#about", "About"],
    ["#programs", "Programs"],
    ["#events", "Events"],
    ["#impact", "Impact"],
    ["#leadership", "Leadership"],
    ["#gallery", "Gallery"],
    ["#contact", "Contact"],
  ];

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      <header className={`site-header${scrolled ? " scrolled" : ""}`} id="top">
        <div className="container header-inner">
          <a href="#top" className="brand" aria-label="PULSE home">
            <svg className="brand-mark" viewBox="0 0 40 24" aria-hidden="true">
              <path d="M1 13h9l4-10 6 19 5-14 3 5h11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="brand-text">
              PULSE
              <small data-tina-field={tf(s.header, "subtitle")}>{s.header?.subtitle}</small>
            </span>
          </a>
          <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
            <span />
            <span />
            <span />
          </button>
          <nav id="nav" className={`nav${open ? " open" : ""}`}>
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={close}>
                {label}
              </a>
            ))}
            <a href="#get-involved" className="btn btn-gold btn-sm" onClick={close} data-tina-field={tf(s.header, "cta")}>
              {s.header?.cta}
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}

/* ---------------- Section heading ---------------- */

function Head({ obj, light = false }: { obj: any; light?: boolean }) {
  return (
    <Reveal as="header" className={`section-head${light ? " section-head--light" : ""}`}>
      <T className="eyebrow" v={obj?.eyebrow} tina={tf(obj, "eyebrow")} />
      <T as="h2" v={obj?.heading} tina={tf(obj, "heading")} />
    </Reveal>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ h }: { h: Data }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <T className="eyebrow" v={h.eyebrow} tina={tf(h, "eyebrow")} />
          <T as="h1" v={h.title} tina={tf(h, "title")} />
          <T className="hero-full" v={h.fullName} tina={tf(h, "fullName")} />
          <T className="hero-text" v={h.text} tina={tf(h, "text")} />
          <div className="hero-actions">
            <a href={h.primaryUrl || "#get-involved"} className="btn btn-gold" data-tina-field={tf(h, "primaryLabel")} {...linkProps(h.primaryUrl)}>
              {h.primaryLabel}
            </a>
            <a href={h.secondaryUrl || "#get-involved"} className="btn btn-outline" data-tina-field={tf(h, "secondaryLabel")} {...linkProps(h.secondaryUrl)}>
              {h.secondaryLabel}
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <Slot className="img-slot--hero" src={h.image} tina={tf(h, "image")} alt="" />
        </div>
      </div>
      <svg className="hero-line" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40h420l30-28 40 62 36-52 24 18h650" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      </svg>
    </section>
  );
}

function Strip({ items }: { items: any[] }) {
  return (
    <section className="strip">
      <div className="container strip-inner">
        {items.map((w, i) => (
          <div key={i}>
            <span data-tina-field={tf(w, "word")}>{w.word}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

function About({ a }: { a: Data }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <Head obj={a} />
        <div className="about-grid">
          <Reveal>
            <Slot className="img-slot--tall" src={a.image} tina={tf(a, "image")} />
          </Reveal>
          <Reveal className="about-copy">
            <T className="lead" v={a.lead} tina={tf(a, "lead")} />
            <T v={a.p1} tina={tf(a, "p1")} />
            <T v={a.p2} tina={tf(a, "p2")} />
          </Reveal>
        </div>
        <div className="pillars">
          {list(a.pillars).map((p, i) => (
            <Reveal as="article" className="pillar" key={i} delay={i}>
              <span className="pillar-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 data-tina-field={tf(p, "title")}>{p.title}</h3>
              <T v={p.text} tina={tf(p, "text")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Programs ---------------- */

function Programs({ p }: { p: Data }) {
  return (
    <section className="section section-tint" id="programs">
      <div className="container">
        <Head obj={p} />
        <div className="card-grid">
          {list(p.items).map((it, i) => (
            <Reveal as="article" className="card" key={i} delay={i}>
              <Slot className="img-slot--card" src={it.image} tina={tf(it, "image")} alt={it.title || ""} />
              <div className="card-body">
                <T as="h3" v={it.title} tina={tf(it, "title")} />
                <T v={it.text} tina={tf(it, "text")} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Events ---------------- */

function Events({ e }: { e: Data }) {
  return (
    <section className="section" id="events">
      <div className="container">
        <Head obj={e} />
        <ul className="events">
          {list(e.items).map((it, i) => (
            <Reveal as="li" className="event" key={i} delay={i}>
              <div className="event-date">
                <strong data-tina-field={tf(it, "day")}>{it.day}</strong>
                <span data-tina-field={tf(it, "month")}>{it.month}</span>
              </div>
              <div className="event-info">
                <T as="h3" v={it.title} tina={tf(it, "title")} />
                <p className={ph([it.time, it.location].join(" "))}>
                  <span data-tina-field={tf(it, "time")}>{it.time}</span>
                  {it.time && it.location ? "  ·  " : ""}
                  <span data-tina-field={tf(it, "location")}>{it.location}</span>
                </p>
              </div>
              <a href="#contact" className="event-link" aria-label="Event details" data-tina-field={tf(e, "detailsLabel")}>
                {e.detailsLabel} <span aria-hidden="true">&rarr;</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Impact ---------------- */

function Impact({ i }: { i: Data }) {
  return (
    <section className="impact" id="impact">
      <div className="container">
        <Head obj={i} light />
        <div className="stats">
          {list(i.items).map((it, n) => (
            <Reveal className="stat" key={n} delay={n}>
              <CountNumber value={it.number} tina={tf(it, "number")} />
              <T as="span" v={it.label} tina={tf(it, "label")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Leadership ---------------- */

function People({ items, cls }: { items: any[]; cls: string }) {
  return (
    <div className={`people ${cls}`}>
      {items.map((p, i) => (
        <Reveal as="article" className="person" key={i} delay={i}>
          <Slot className="img-slot--portrait" person src={p.photo} tina={tf(p, "photo")} alt={p.name || ""} />
          <T as="h4" v={p.name} tina={tf(p, "name")} />
          <T className="role" v={p.role} tina={tf(p, "role")} />
          <T className="bio" v={p.bio} tina={tf(p, "bio")} />
        </Reveal>
      ))}
    </div>
  );
}

function Leadership({ l }: { l: Data }) {
  return (
    <section className="section" id="leadership">
      <div className="container">
        <Head obj={l} />
        <Reveal as="h3" className="group-title" data-tina-field={tf(l, "directorsTitle")}>
          {l.directorsTitle}
        </Reveal>
        <People items={list(l.directors)} cls="people--directors" />
        <Reveal as="h3" className="group-title" data-tina-field={tf(l, "officersTitle")}>
          {l.officersTitle}
        </Reveal>
        <People items={list(l.officers)} cls="people--officers" />
        <Reveal as="h3" className="group-title group-title--spaced" data-tina-field={tf(l, "leadsTitle")}>
          {l.leadsTitle}
        </Reveal>
        <People items={list(l.leads)} cls="people--leads" />
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */

function Gallery({ g }: { g: Data }) {
  return (
    <section className="section section-tint" id="gallery">
      <div className="container">
        <Head obj={g} />
        <div className="gallery">
          {list(g.images).map((it, i) => (
            <Slot key={i} reveal delay={i} className={`g${i + 1}`} src={it.image} tina={tf(it, "image")} alt="Gallery photo" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Get involved ---------------- */

const involveIcons = [
  <svg key="a" viewBox="0 0 48 48"><path d="M24 40S7 30 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /></svg>,
  <svg key="b" viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M24 14v20M29 18.5c-1.5-2-8-2.5-9 1.5s9 3 9 8-8 4-10 1.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>,
  <svg key="c" viewBox="0 0 48 48"><circle cx="17" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="33" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M5 40c1-8 6-12 12-12s11 4 12 12M30 30c6-1 11 3 13 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>,
];

function Involve({ v }: { v: Data }) {
  return (
    <section className="section" id="get-involved">
      <div className="container">
        <Head obj={v} />
        <div className="involve-grid">
          {list(v.items).map((it, i) => (
            <Reveal as="article" className={`involve${i === 1 ? " involve--featured" : ""}`} key={i} delay={i}>
              <div className="involve-icon" aria-hidden="true">
                {involveIcons[i % involveIcons.length]}
              </div>
              <h3 data-tina-field={tf(it, "title")}>{it.title}</h3>
              <T v={it.text} tina={tf(it, "text")} />
              <a href={it.buttonUrl || "#contact"} className={`btn btn-sm ${i === 1 ? "btn-gold" : "btn-navy"}`} data-tina-field={tf(it, "buttonText")} {...linkProps(it.buttonUrl)}>
                {it.buttonText}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

function Contact({ c }: { c: Data }) {
  const inEditor = useInEditor();
  // Entries left empty stay hidden on the live site (but show up while editing).
  const items = list(c.items).filter((it) => inEditor || (it.value && it.value.trim()));
  return (
    <section className="section section-tint" id="contact">
      <div className="container">
        <Head obj={c} />
        <div className="contact-grid">
          {items.map((it, i) => (
            <Reveal className="contact-item" key={i} delay={i}>
              <h3 data-tina-field={tf(it, "label")}>{it.label}</h3>
              <T v={it.value || (inEditor ? "____________" : "")} tina={tf(it, "value")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer({ f }: { f: Data }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-name">PULSE</span>
          <p data-tina-field={tf(f, "tagline")}>{f?.tagline}</p>
          <p data-tina-field={tf(f, "school")}>{f?.school}</p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#events">Events</a>
          <a href="#leadership">Leadership</a>
          <a href="#get-involved">Get Involved</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>
          &copy; {year} PULSE &middot; {f?.school}
        </p>
        <p className="footer-links">
          <a href="/admin/index.html" className="editor-link">
            Editor Login
          </a>
          <a href="#top">Back to top &uarr;</a>
        </p>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */

export default function Site({ s }: { s: Data }) {
  return (
    <>
      <Header s={s} />
      <main>
        <Hero h={s.hero} />
        <Strip items={list(s.strip)} />
        <About a={s.about} />
        <Programs p={s.programs} />
        <Events e={s.events} />
        <Impact i={s.impact} />
        <Leadership l={s.leadership} />
        <Gallery g={s.gallery} />
        <Involve v={s.involve} />
        <Contact c={s.contact} />
      </main>
      <Footer f={s.footer} />
    </>
  );
}
