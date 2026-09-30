/* Male pomoćne funkcije koje dele sve komponente */
import { content } from './content.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const motion = {
  get full() { return document.documentElement.classList.contains('motion-full') && !!window.gsap; },
};

export const isDesktop = () => matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
export const isWide = () => matchMedia('(min-width: 900px)').matches;

export const price = (n) => `${new Intl.NumberFormat('sr-Latn-RS').format(n)} ${content.currency}`;
export const mins = (n) => (n >= 60 ? `${Math.floor(n / 60)} h${n % 60 ? ` ${n % 60} min` : ''}` : `${n} min`);

export const allServices = () => content.services.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
export const serviceById = (id) => allServices().find((s) => s.id === id);

export const demoTag = (text = 'primer') => (content.demo ? `<span class="demo-tag">${esc(text)}</span>` : '');

/* Ikonice (tanka linija, 24×24) */
export const icon = (name) => {
  const p = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chat: '<path d="M4 20l1.5-4A8 8 0 1 1 9 19z"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
  }[name];
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
};

/* Glatko skrolovanje do sekcije; poštuje smanjeno kretanje */
export function goTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const reduce = !motion.full;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  // fokus za tastaturu/čitače ekrana, bez skoka
  const h = el.querySelector('h2, h1') || el;
  if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
  setTimeout(() => h.focus({ preventScroll: true }), reduce ? 0 : 700);
}

/* Ponovo izračunaj pozicije skrol-scena kad se promeni visina sadržaja */
let relayoutT = 0;
export function relayout() {
  if (!window.ScrollTrigger || !motion.full) return;
  clearTimeout(relayoutT);
  relayoutT = setTimeout(() => window.ScrollTrigger.refresh(), 120);
}

/* Radno vreme */
export const dayNames = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
export const dayShort = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export { toMin };

export function openStatus(now = new Date()) {
  const h = content.hours[now.getDay()];
  const m = now.getHours() * 60 + now.getMinutes();
  if (h && m >= toMin(h[0]) && m < toMin(h[1])) return { open: true, text: `Otvoreno do ${h[1]}` };
  // sledeće otvaranje
  for (let i = 0; i < 8; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    const hh = content.hours[d.getDay()];
    if (!hh) continue;
    if (i === 0 && m >= toMin(hh[0])) continue;
    const when = i === 0 ? 'danas' : i === 1 ? 'sutra' : dayNames[d.getDay()].toLowerCase();
    return { open: false, text: `Zatvoreno · otvaramo ${when} u ${hh[0]}` };
  }
  return { open: false, text: 'Zatvoreno' };
}

/* Kuda vodi "Zakaži": sekcija na sajtu ili spoljni sistem (content.booking.mode) */
export const bookingHref = () => (content.booking.mode === 'external' && content.booking.externalUrl ? content.booking.externalUrl : '#zakazivanje');

/* Deljeno stanje zakazivanja (frizura/usluga izabrana negde drugde na sajtu) */
export const bookingBus = new EventTarget();
export function preselect(detail) {
  bookingBus.dispatchEvent(new CustomEvent('preselect', { detail }));
  goTo('#zakazivanje');
}
