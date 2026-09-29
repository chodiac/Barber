/* UVOD — tekst se pojavljuje kao da neko briše zamagljeno ogledalo */
import { content } from '../content.js';
import { $, esc, motion } from '../lib.js';

export function renderIntro() {
  const c = content.intro;
  $('#o-nama').innerHTML = `
  <div class="wrap intro__grid">
    <p class="label">${esc(c.eyebrow)}</p>
    <h2 id="intro-title" class="intro__title h2">
      <span class="intro__fog" aria-hidden="true">${esc(c.title)}</span>
      <span class="intro__clear">${esc(c.title)}</span>
    </h2>
    <p class="intro__body lead">${esc(c.body)}</p>
    <ul class="principles">
      ${c.principles.map((p) => `
        <li class="principle">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.text)}</p>
        </li>`).join('')}
    </ul>
  </div>`;
}

export function initIntro() {
  const sec = $('#o-nama');
  if (!motion.full) { sec.style.setProperty('--wipe', '100%'); return; }
  const { gsap } = window;
  gsap.fromTo(sec, { '--wipe': '0%' }, {
    '--wipe': '100%', ease: 'none',
    scrollTrigger: { trigger: '.intro__title', start: 'top 85%', end: 'top 35%', scrub: 0.6 },
  });
  gsap.from('.principle', {
    y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '.principles', start: 'top 85%' },
  });
}
