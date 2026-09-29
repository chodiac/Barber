/* ==========================================================================
   PROSTOR — galerija kadrova. Na desktopu vertikalni skrol pomera traku
   vodoravno (bez prisiljavanja na vodoravno skrolovanje); na mobilnom i uz
   smanjeno kretanje: obična traka sa prevlačenjem i dugmadima.
   Bez fotografija prikazuje isečke iz ilustrovane scene + opis kadra.
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, motion, isWide, icon } from '../lib.js';
import { cropSVG } from '../art/scene-art.js';

const SHAPES = ['tall', 'wide', 'square', 'tall', 'wide', 'square'];

export function renderGallery() {
  $('#prostor').innerHTML = `
  <div class="gallery__pin">
    <div class="wrap gallery__head">
      <div>
        <p class="label">Prostor</p>
        <h2 id="gallery-title" class="h2">Drvo, koža i toplo svetlo</h2>
      </div>
      <p class="lead">Mala prostorija sa jednim ogledalom koje sve vidi. Evo kako izgleda pre nego što uđeš.</p>
      <div class="gallery__ctrl">
        <button class="round-btn" type="button" data-g-prev aria-label="Prethodni kadar">${icon('left')}</button>
        <button class="round-btn" type="button" data-g-next aria-label="Sledeći kadar">${icon('arrow')}</button>
      </div>
    </div>
    <div class="gallery__viewport" tabindex="0" aria-label="Kadrovi prostora — prevuci ili koristi strelice">
      <ul class="gallery__track">
        ${content.gallery.map((g, i) => `
          <li class="shot shot--${SHAPES[i % SHAPES.length]}">
            <figure>
              <div class="shot__media">
                ${g.src
                  ? `<img src="${esc(g.src)}" ${g.srcset ? `srcset="${esc(g.srcset)}" sizes="(min-width: 900px) 40vw, 85vw"` : ''} alt="${esc(g.alt || g.title)}" loading="lazy" decoding="async">`
                  : `${cropSVG(g.crop, `Ilustracija: ${g.title}`)}
                     <span class="shot__todo demo-tag">Foto · ${esc(g.id)}.jpg</span>`}
              </div>
              <figcaption>
                <span class="shot__title">${esc(g.title)}</span>
                <span class="shot__cap">${esc(g.caption)}</span>
                ${!g.src && content.demo ? `<span class="shot__brief">Snimiti: ${esc(g.shot)}</span>` : ''}
              </figcaption>
            </figure>
          </li>`).join('')}
      </ul>
    </div>
  </div>`;
}

export function initGallery() {
  const sec = $('#prostor');
  const vp = $('.gallery__viewport', sec);
  const track = $('.gallery__track', sec);
  const step = () => ($('.shot', track).offsetWidth + 24);

  const pinned = motion.full && isWide();
  let st = null;
  $('[data-g-prev]', sec).addEventListener('click', () => move(-1));
  $('[data-g-next]', sec).addEventListener('click', () => move(1));
  function move(d) {
    if (st) {
      const dist = st.end - st.start;
      const per = step() / Math.max(1, track.scrollWidth - vp.clientWidth);
      window.scrollTo({ top: st.start + Math.min(1, Math.max(0, st.progress + d * per)) * dist, behavior: 'smooth' });
    } else vp.scrollBy({ left: d * step(), behavior: motion.full ? 'smooth' : 'auto' });
  }

  if (!pinned) { sec.classList.add('is-free'); return; }

  const { gsap } = window;
  sec.classList.add('is-pinned');
  const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: sec, pin: $('.gallery__pin', sec), start: 'top top', end: () => `+=${dist()}`,
      scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
    },
  });
  st = tween.scrollTrigger;
  // Blagi "dolly" unutar svakog kadra dok prolazi kroz ekran
  $$('.shot__media > svg, .shot__media > img', sec).forEach((m) => {
    gsap.fromTo(m, { scale: 1.18, xPercent: -4 }, {
      scale: 1.02, xPercent: 4, ease: 'none',
      scrollTrigger: { trigger: m.closest('.shot'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    });
  });
}
