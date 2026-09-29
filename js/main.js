/* ==========================================================================
   Pokretanje: tema iz content.js → iscrtavanje komponenti → interakcije.
   Ako GSAP ne stigne sa CDN-a ili korisnik traži manje kretanja, sve
   sekcije rade u mirnom režimu (bez kačenja i skrol-animacija).
   ========================================================================== */
import { content } from './content.js';
import { $$, motion } from './lib.js';
import { renderNav, initNav } from './components/nav.js';
import { renderHero, initHero } from './components/hero.js';
import { renderIntro, initIntro } from './components/intro.js';
import { renderServices, initServices } from './components/services.js';
import { renderStyles, initStyles } from './components/styles.js';
import { renderGallery, initGallery } from './components/gallery.js';
import { renderProcess, initProcess } from './components/process.js';
import { renderTeam, initTeam } from './components/team.js';
import { renderBridge, initBridge } from './components/bridge.js';
import { renderBooking, initBooking } from './components/booking.js';
import { renderContact, renderFooter } from './components/contact.js';

const root = document.documentElement;

// Tema
const cssVar = { walnut: '--walnut', tobacco: '--tobacco', oak: '--oak', parchment: '--parchment', copper: '--copper', olive: '--olive', amber: '--amber', charcoal: '--charcoal' };
Object.entries(content.theme || {}).forEach(([k, v]) => cssVar[k] && root.style.setProperty(cssVar[k], v));
root.classList.toggle('is-demo', !!content.demo);

// Bez GSAP-a nema punog kretanja
if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('motion-full'); root.classList.add('motion-reduce'); }
else window.gsap.registerPlugin(window.ScrollTrigger);

// Iscrtavanje
renderNav();
renderHero();
renderIntro();
renderServices();
renderStyles();
renderGallery();
renderProcess();
renderTeam();
renderBridge();
renderBooking();
renderContact();
renderFooter();

// Interakcije (redosled prati stranicu — bitno za ScrollTrigger kačenja)
const inits = [initNav, initHero, initIntro, initServices, initStyles, initGallery, initProcess, initTeam, initBridge, initBooking];
for (const fn of inits) {
  try { fn(); } catch (err) { console.error(`[${fn.name}]`, err); }
}

// Spoljni sistem za zakazivanje otvara se u novom prozoru
if (content.booking.mode === 'external' && content.booking.externalUrl) {
  $$('[data-book]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
}

if (motion.full) {
  const { ScrollTrigger } = window;
  // fontovi menjaju visine — preračunaj kačenja kad stignu
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
