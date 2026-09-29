/* ==========================================================================
   MOST između tima i zakazivanja: stolica iz početne scene se okreće
   ka posetiocu. Ista stolica sa leđa (iz scene) → spreda.
   ========================================================================== */
import { $, motion } from '../lib.js';

const chairFront = /* svg */ `
<svg class="bridge__front" viewBox="0 0 400 520" aria-hidden="true" focusable="false">
  <ellipse cx="200" cy="505" rx="150" ry="12" fill="#000" opacity=".35"/>
  <rect x="120" y="486" width="160" height="14" rx="7" fill="url(#g-chrome)"/>
  <rect x="186" y="380" width="28" height="110" fill="url(#g-chrome)"/>
  <path d="M130 440 L270 440 L262 460 L138 460 Z" fill="url(#g-chrome)"/>
  <rect x="170" y="18" width="60" height="16" fill="url(#g-chrome)" opacity=".9"/>
  <rect x="140" y="0" width="120" height="44" rx="20" fill="url(#g-leather)"/>
  <path d="M110 80 Q110 50 140 48 L260 48 Q290 50 290 80 L300 290 L100 290 Z" fill="url(#g-leather)"/>
  <path d="M110 80 Q110 50 140 48 L260 48 Q290 50 290 80 L300 290 L100 290 Z" fill="url(#g-leather-v)"/>
  ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<circle cx="${140 + c * 40 + (r % 2) * 20}" cy="${100 + r * 58}" r="3.6" fill="#1e0c06"/>`).join('')).join('')}
  <path d="M60 300 Q60 272 90 270 L310 270 Q340 272 340 300 L340 330 L60 330 Z" fill="url(#g-leather)"/>
  <path d="M90 330 L310 330 L300 380 L100 380 Z" fill="#3a1a10"/>
  <path d="M40 250 Q40 230 60 228 L96 228 L96 262 L60 262 Q40 262 40 250Z" fill="url(#g-leather)"/>
  <path d="M360 250 Q360 230 340 228 L304 228 L304 262 L340 262 Q360 262 360 250Z" fill="url(#g-leather)"/>
  <rect x="62" y="262" width="10" height="70" fill="url(#g-chrome)"/>
  <rect x="328" y="262" width="10" height="70" fill="url(#g-chrome)"/>
</svg>`;

const chairBack = /* svg */ `
<svg class="bridge__back" viewBox="760 440 480 560" aria-hidden="true" focusable="false"><use href="#sc-chair"/></svg>`;

export function renderBridge() {
  $('#most').innerHTML = `
  <div class="bridge__in">
    <div class="bridge__chair">${chairBack}${chairFront}</div>
    <p class="bridge__line">Stolica je slobodna.<br><span>Izaberi kada.</span></p>
  </div>`;
}

export function initBridge() {
  const root = $('#most');
  if (!motion.full) { root.classList.add('is-static'); return; }
  const { gsap } = window;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: 'top 85%', end: 'bottom 35%', scrub: 0.7 },
  });
  tl.fromTo('.bridge__back', { scaleX: 1 }, { scaleX: 0, duration: 0.45, ease: 'power2.in' })
    .fromTo('.bridge__front', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out' })
    .fromTo('.bridge__chair', { y: 40, scale: 0.92 }, { y: -10, scale: 1, duration: 0.9 }, 0)
    .fromTo('.bridge__line', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.5);
}
