document.documentElement.classList.add('js');

/* ---------- Content (edited through /admin, stored in content/site.json) ---------- */

const ICON_IMAGE = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="10" width="38" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="21" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 36l11-10 8 7 7-6 11 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const ICON_PERSON = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="18" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 42c1-9 8-14 16-14s15 5 16 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const isBlank = (t) => /^[_\s· ]*$/.test(t || '');

function make(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) setText(node, text);
  return node;
}

// Underscore-only text keeps the gray placeholder look; real text gets normal styling.
function setText(node, text) {
  node.textContent = text || '';
  node.classList.toggle('placeholder', isBlank(text));
  return node;
}

function slot(cls, icon, src, alt) {
  const div = make('div', 'img-slot ' + cls);
  div.setAttribute('role', 'img');
  div.setAttribute('aria-label', alt || 'Image');
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    div.appendChild(img);
  } else {
    div.innerHTML = icon;
  }
  return div;
}

const reveal = (node) => { node.classList.add('reveal'); return node; };

const builders = {
  'about.pillars': (p, i) => {
    const a = reveal(make('article', 'pillar'));
    a.append(make('span', 'pillar-num', String(i + 1).padStart(2, '0')), make('h3', '', p.title), make('p', '', p.text));
    a.querySelector('span').classList.remove('placeholder');
    a.querySelector('h3').classList.remove('placeholder');
    return a;
  },
  programs: (p) => {
    const a = reveal(make('article', 'card'));
    const body = make('div', 'card-body');
    body.append(make('h3', '', p.title), make('p', '', p.text));
    a.append(slot('img-slot--card', ICON_IMAGE, p.image, p.title), body);
    return a;
  },
  events: (e) => {
    const li = reveal(make('li', 'event'));
    const date = make('div', 'event-date');
    date.append(make('strong', '', e.day), make('span', '', e.month));
    date.querySelectorAll('*').forEach((n) => n.classList.remove('placeholder'));
    const info = make('div', 'event-info');
    info.append(make('h3', '', e.title), make('p', '', [e.time, e.location].filter(Boolean).join('  ·  ')));
    const link = make('a', 'event-link');
    link.href = '#contact';
    link.setAttribute('aria-label', 'Event details');
    link.innerHTML = 'Details <span aria-hidden="true">&rarr;</span>';
    li.append(date, info, link);
    return li;
  },
  impact: (s) => {
    const d = reveal(make('div', 'stat'));
    const n = make('strong', '', s.number);
    n.classList.remove('placeholder');
    d.append(n, make('span', '', s.label));
    return d;
  },
  directors: (p) => person(p),
  officers: (p) => person(p),
  gallery: (g, i) => reveal(slot('g' + (i + 1), ICON_IMAGE, g.image, 'Gallery photo')),
  contact: (c) => {
    const d = reveal(make('div', 'contact-item'));
    const h = make('h3', '', c.label);
    h.classList.remove('placeholder');
    d.append(h, make('p', '', c.value));
    return d;
  },
};

function person(p) {
  const a = reveal(make('article', 'person'));
  const name = make('h4', '', p.name);
  const role = make('p', 'role', p.role);
  const bio = make('p', 'bio', p.bio);
  a.append(slot('img-slot--portrait', ICON_PERSON, p.photo, p.name), name, role, bio);
  return a;
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

function renderContent(data) {
  document.querySelectorAll('[data-bind]').forEach((node) => {
    const v = get(data, node.dataset.bind);
    if (typeof v === 'string') setText(node, v);
  });

  document.querySelectorAll('[data-image]').forEach((node) => {
    const src = get(data, node.dataset.image);
    if (src) {
      node.textContent = '';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      node.appendChild(img);
    }
  });

  document.querySelectorAll('[data-list]').forEach((container) => {
    const key = container.dataset.list;
    const items = get(data, key);
    if (!Array.isArray(items)) return;

    if (key === 'involve') {
      // keep the existing icons/layout; update text and buttons in place
      const cards = [...container.querySelectorAll('.involve')];
      const frag = document.createDocumentFragment();
      items.forEach((it, i) => {
        const card = cards[i] || cards[0].cloneNode(true);
        setText(card.querySelector('h3'), it.title).classList.remove('placeholder');
        setText(card.querySelector('p'), it.text);
        const btn = card.querySelector('a');
        btn.textContent = it.buttonText || '';
        btn.href = it.buttonUrl || '#contact';
        if (/^https?:/i.test(btn.href) && !btn.href.startsWith(location.origin)) {
          btn.target = '_blank';
          btn.rel = 'noopener';
        }
        frag.appendChild(card);
      });
      container.replaceChildren(frag);
      return;
    }

    const build = builders[key];
    if (build) container.replaceChildren(...items.map(build));
  });
}

async function loadContent() {
  try {
    const res = await fetch('content/site.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    renderContent(await res.json());
  } catch (err) {
    // Falls back to the placeholder text already in index.html
    console.warn('PULSE: using built-in placeholder content.', err);
  }
}

/* ---------- Page behaviour ---------- */

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Counts up numbers like "500+" when they scroll into view
function countUp(el) {
  if (!el) return;
  const m = /^(\D*)(\d[\d,]*)(.*)$/.exec(el.textContent.trim());
  if (!m) return;
  const target = parseInt(m[2].replace(/,/g, ''), 10);
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / 1400, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = m[1] + Math.round(target * eased).toLocaleString() + m[3];
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initMotion() {
  // header shadow + gold scroll progress bar
  const header = document.querySelector('.site-header');
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    header.classList.toggle('scrolled', scrollY > 8);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // stagger items that share a parent
  document.querySelectorAll('.reveal').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 5) * 0.09 + 's');
  });
}

function initReveal() {
  initMotion();
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('in');
          if (e.target.classList.contains('stat')) countUp(e.target.querySelector('strong'));
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }
}

document.getElementById('year').textContent = new Date().getFullYear();
initNav();
loadContent().then(initReveal);
