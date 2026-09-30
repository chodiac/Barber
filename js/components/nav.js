import { content } from '../content.js';
import { $, $$, esc, icon, goTo, bookingHref } from '../lib.js';

const LINKS = [
  ['#usluge', 'Usluge i cene'],
  ['#stilovi', 'Frizure'],
  ['#prostor', 'Prostor'],
  ['#tim', 'Tim'],
  ['#kontakt', 'Kontakt'],
];

export const brandMark = () => content.brand.logo
  ? `<img src="${esc(content.brand.logo)}" alt="${esc(content.brand.name)}">`
  : `<span class="brand__a">${esc(content.brand.wordmark[0])}</span><span class="brand__b">${esc(content.brand.wordmark[1])}</span>`;

export function renderNav() {
  const c = content.contact;
  $('#nav-root').outerHTML = `
  <header class="nav" id="nav">
    <div class="nav__in">
      <a class="brand" href="#pocetak" aria-label="${esc(content.brand.name)} — na početak">${brandMark()}</a>
      <nav class="nav__links" aria-label="Glavna navigacija">
        ${LINKS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
      </nav>
      <a class="btn btn--small nav__cta" href="${bookingHref()}" data-book>Zakaži termin</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="drawer"><span></span><span class="sr-only">Otvori meni</span></button>
    </div>
  </header>
  <div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Meni">
    <button class="drawer__close" type="button" aria-label="Zatvori meni">×</button>
    <nav aria-label="Mobilna navigacija">
      ${[['#o-nama', 'Kako radimo'], ...LINKS].map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
    </nav>
    <div class="drawer__foot">
      <a class="btn" href="${bookingHref()}" data-book>Zakaži termin</a>
      <a class="btn btn--ghost" href="tel:${esc(c.phoneHref)}">${icon('phone')} ${esc(c.phone)}</a>
    </div>
  </div>`;

  $('#dock-root').outerHTML = `
  <div class="dock" id="dock">
    <a class="btn" href="${bookingHref()}" data-book>Zakaži termin</a>
    <a class="btn btn--ghost" href="tel:${esc(c.phoneHref)}" aria-label="Pozovi ${esc(c.phone)}">${icon('phone')}</a>
  </div>`;
}

export function initNav() {
  const nav = $('#nav');
  const drawer = $('#drawer');
  const menuBtn = $('.nav__menu');
  const dock = $('#dock');

  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector('a').focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setOpen(true));
  $('.drawer__close').addEventListener('click', () => setOpen(false));
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') { // zadrži fokus u meniju
      const f = $$('a, button', drawer); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Svi interni linkovi idu kroz goTo (glatko + fokus)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2 || !document.querySelector(id)) return;
    e.preventDefault();
    if (drawer.classList.contains('is-open')) { drawer.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    goTo(id);
  });

  // Pozadina navigacije posle heroja, donja traka na mobilnom, aktivni link
  const hero = $('#pocetak');
  const booking = $('#zakazivanje');
  // Pozadina se pojavljuje tek kada scena heroja ode (ne preko scene)
  const updateSolid = () => {
    const r = hero.getBoundingClientRect();
    nav.classList.toggle('is-solid', r.bottom < window.innerHeight * .15);
    const b = booking.getBoundingClientRect();
    const inBooking = b.top < window.innerHeight * .8 && b.bottom > 0;
    dock.classList.toggle('is-visible', r.bottom < window.innerHeight * .4 && !inBooking);
  };
  window.addEventListener('scroll', updateSolid, { passive: true });
  window.addEventListener('resize', updateSolid);
  updateSolid();

  const links = $$('.nav__links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => { if (l.getAttribute('href') === `#${en.target.id}`) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['#pocetak', '#o-nama', ...LINKS.map(([h]) => h), '#zakazivanje'].forEach((h) => { const s = document.querySelector(h); if (s) io.observe(s); });
}
