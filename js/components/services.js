/* ==========================================================================
   USLUGE I CENE — cenovnik kao emajlirana tabla u drvenom ramu.
   Red se otvara klikom (detalji + "Zakaži ovu uslugu").
   Kad tabla uđe u kadar, linija mašinice prelazi preko nje i otkriva redove.
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, price, mins, motion, demoTag, preselect, icon } from '../lib.js';

export function renderServices() {
  $('#usluge').innerHTML = `
  <div class="wrap services__grid">
    <div class="services__intro">
      <p class="label">Cenovnik</p>
      <h2 id="services-title" class="h2">Usluge i cene</h2>
      <p class="lead">Trajanje je okvirno. Ako nisi siguran šta ti treba, izaberi šišanje, a ostalo ćemo dogovoriti u stolici.</p>
      <a class="btn btn--dark" href="#zakazivanje" data-book>Zakaži termin ${icon('arrow')}</a>
      ${content.demo ? `<p class="services__note">${demoTag('primer cena')} <span>${esc(content.servicesNote)}</span></p>` : ''}
    </div>

    <div class="board" data-board>
      <div class="board__frame">
        <div class="board__face">
          <div class="board__head">
            <span class="board__brand">${esc(content.brand.name)}</span>
            <span class="board__unit">${esc(content.currency)}</span>
          </div>
          <div class="board__groups">
            ${content.services.map((g, gi) => `
              <div class="board__group">
                <h3 class="board__group-title">${esc(g.group)}</h3>
                <ul>
                  ${g.items.map((s) => `
                    <li class="svc${s.featured ? ' svc--featured' : ''}">
                      <button class="svc__row" type="button" aria-expanded="false" aria-controls="svc-${s.id}">
                        <span class="svc__name">${esc(s.name)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</span>
                        <span class="svc__dots" aria-hidden="true"></span>
                        <span class="svc__price">${price(s.price).replace(` ${content.currency}`, '')}<span class="sr-only"> ${esc(content.currency)}</span></span>
                        <span class="svc__plus" aria-hidden="true"></span>
                      </button>
                      <div class="svc__detail" id="svc-${s.id}" hidden>
                        <div class="svc__detail-in">
                          <p>${esc(s.detail)}</p>
                          <p class="svc__meta">${icon('clock')} oko ${mins(s.duration)}</p>
                          <a class="svc__book" href="#zakazivanje" data-service="${s.id}">Zakaži ovu uslugu ${icon('arrow')}</a>
                        </div>
                      </div>
                    </li>`).join('')}
                </ul>
              </div>`).join('')}
          </div>
        </div>
        <span class="board__blade" aria-hidden="true"></span>
      </div>
    </div>
  </div>`;
}

export function initServices() {
  const sec = $('#usluge');

  $$('.svc__row', sec).forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      // jedan otvoren red u isto vreme
      $$('.svc__row[aria-expanded="true"]', sec).forEach((b) => { if (b !== btn) toggle(b, false); });
      toggle(btn, open);
    });
  });

  function toggle(btn, open) {
    const panel = $('.svc__detail', btn.closest('.svc'));
    btn.setAttribute('aria-expanded', String(open));
    btn.closest('.svc').classList.toggle('is-open', open);
    if (!motion.full) { panel.hidden = !open; return; }
    const { gsap } = window;
    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.45, ease: 'power3.out' });
      gsap.fromTo($('.svc__detail-in', panel), { x: -18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, delay: 0.08, ease: 'power3.out' });
    } else {
      gsap.to(panel, { height: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { panel.hidden = true; panel.style.height = ''; } });
    }
  }

  $$('[data-service]', sec).forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    preselect({ service: a.dataset.service });
  }));

  if (!motion.full) return;
  // Linija mašinice: jedan prolaz odozgo nadole otkriva tablu
  const { gsap } = window;
  const face = $('.board__face', sec);
  const blade = $('.board__blade', sec);
  gsap.set(face, { clipPath: 'inset(0 0 100% 0)' });
  gsap.set(blade, { autoAlpha: 0 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-board]', start: 'top 72%', once: true } });
  tl.set(blade, { autoAlpha: 1, top: '0%' })
    .to(face, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power2.inOut' }, 0)
    .to(blade, { top: '100%', duration: 1.3, ease: 'power2.inOut' }, 0)
    .to(blade, { autoAlpha: 0, duration: 0.25 }, 1.2)
    .from($$('.svc', sec), { x: -10, duration: 0.6, stagger: 0.05, ease: 'power2.out' }, 0.2);
}
