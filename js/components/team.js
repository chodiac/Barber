/* ==========================================================================
   TIM — radi sa jednim ili više berberina (raspored se menja po broju).
   Svi unosi u content.js su placeholderi: bez izmišljenih imena i biografija.
   Dev: ?team=1 prikazuje raspored sa jednim berberinom.
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, motion, demoTag, preselect } from '../lib.js';

const silhouette = (i) => /* svg */ `
  <svg viewBox="0 0 400 500" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMax slice">
    <defs><linearGradient id="t-bg-${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a24"/><stop offset="1" stop-color="#241812"/></linearGradient>
    <radialGradient id="t-light-${i}" cx=".7" cy=".25" r=".7"><stop offset="0" stop-color="#f2b35e" stop-opacity=".35"/><stop offset="1" stop-color="#f2b35e" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="500" fill="url(#t-bg-${i})"/>
    <rect width="400" height="500" fill="url(#t-light-${i})"/>
    <g fill="none" stroke="#e8dcc4" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round">
      <path d="M200 110c-44 0-70 34-70 80 0 50 28 96 70 96s70-46 70-96c0-46-26-80-70-80z"/>
      <path d="M138 170c10-40 36-62 62-62s54 20 64 56"/>
      <path d="M60 520c6-110 60-176 140-176s134 66 140 176"/>
      <path d="M150 360l50 120 50-120"/>
      <path d="M250 400l30 14" />
    </g>
  </svg>`;

export function renderTeam() {
  let team = content.team;
  if (new URLSearchParams(location.search).get('team') === '1') team = team.slice(0, 1);
  const solo = team.length === 1;
  $('#tim').innerHTML = `
  <div class="wrap">
    <header class="team__head">
      <p class="label">Tim</p>
      <h2 id="team-title" class="h2">Ko će te šišati</h2>
      <p class="lead">${solo ? 'Jedna stolica, jedan berberin, i uvek znaš kod koga dolaziš.' : 'Možeš da izabereš berberina pri zakazivanju ili da uzmeš prvi slobodan termin.'}</p>
    </header>
    <ul class="team__grid" data-count="${team.length}">
      ${team.map((b, i) => `
        <li class="barber">
          <figure class="barber__photo">
            ${b.photo ? `<img src="${esc(b.photo)}" alt="Portret: ${esc(b.name)}" loading="lazy" decoding="async">` : silhouette(i)}
            ${b.placeholder ? `<figcaption class="barber__todo">${demoTag('Portret 4:5 · zameniti')}</figcaption>` : ''}
          </figure>
          <div class="barber__body">
            <p class="barber__role">${esc(b.role)}</p>
            <h3 class="barber__name">${esc(b.name)} ${b.placeholder ? demoTag('placeholder') : ''}</h3>
            <p class="barber__bio">${esc(b.bio)}</p>
            ${b.specialties?.length ? `<ul class="chips">${b.specialties.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
            <a class="link-arrow" href="#zakazivanje" data-barber="${esc(b.id)}">Zakaži ${solo ? 'termin' : 'kod ovog berberina'} →</a>
          </div>
        </li>`).join('')}
    </ul>
  </div>`;
}

export function initTeam() {
  $$('[data-barber]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    preselect({ barber: a.dataset.barber });
  }));
  if (!motion.full) return;
  const { gsap } = window;
  $$('.barber').forEach((el) => {
    gsap.from($('.barber__photo', el), {
      clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.2, ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
    gsap.from($('.barber__body', el).children, {
      y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 75%' },
    });
  });
}
