import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** Underscore-only text keeps the gray placeholder look; real text gets normal styling. */
export const isBlank = (t?: string | null) => /^[_\s· ]*$/.test(t || "");
export const ph = (t?: string | null) => (isBlank(t) ? " placeholder" : "");

/** True when the page is shown inside the Tina editor (admin) preview frame. */
export function useInEditor() {
  const [inEditor, setInEditor] = useState(false);
  useEffect(() => setInEditor(typeof window !== "undefined" && window.self !== window.top), []);
  return inEditor;
}

export const IconImage = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <rect x="5" y="10" width="38" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="17" cy="21" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M6 36l11-10 8 7 7-6 11 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const IconPerson = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 42c1-9 8-14 16-14s15 5 16 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children?: ReactNode;
  [key: string]: any;
};

/** Fades/slides an element in as it scrolls into view. */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.self !== window.top || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style = delay ? ({ "--d": `${Math.min(delay, 5) * 0.09}s` } as any) : undefined;
  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/** Text element: placeholder styling for underscores + click-to-edit hook for Tina. */
export function T({
  as: Tag = "p",
  v,
  className = "",
  tina,
  ...rest
}: {
  as?: ElementType;
  v?: string | null;
  className?: string;
  tina?: string;
  [key: string]: any;
}) {
  return (
    <Tag className={`${className}${ph(v)}`.trim()} data-tina-field={tina} {...rest}>
      {v ?? ""}
    </Tag>
  );
}

/** Photo area: shows the image if there is one, otherwise a gray placeholder box. */
export function Slot({
  src,
  className = "",
  person = false,
  alt = "",
  tina,
  reveal = false,
  delay = 0,
}: {
  src?: string | null;
  className?: string;
  person?: boolean;
  alt?: string;
  tina?: string;
  reveal?: boolean;
  delay?: number;
}) {
  const Wrapper: any = reveal ? Reveal : "div";
  const extra = reveal ? { delay } : {};
  return (
    <Wrapper
      className={`img-slot ${className}`.trim()}
      role="img"
      aria-label={alt || "Image"}
      data-tina-field={tina}
      {...extra}
    >
      {src ? <img src={src} alt={alt} loading="lazy" /> : person ? <IconPerson /> : <IconImage />}
    </Wrapper>
  );
}

/** Counts up numbers like "500+" when they scroll into view. */
export function CountNumber({ value, tina }: { value?: string | null; tina?: string }) {
  const [shown, setShown] = useState(value ?? "");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    setShown(value ?? "");
    const el = ref.current;
    const m = /^(\D*)(\d[\d,]*)(.*)$/.exec((value ?? "").trim());
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!el || !m || reduced || window.self !== window.top || !("IntersectionObserver" in window)) return;
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1400, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(m[1] + Math.round(target * eased).toLocaleString() + m[3]);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <strong ref={ref} data-tina-field={tina}>
      {shown}
    </strong>
  );
}
