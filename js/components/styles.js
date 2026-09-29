/* ==========================================================================
   FRIZURE — ista lutka, isti ugao, isto svetlo; menja se samo kosa.
   Promena ide "prolazom mašinice": nova frizura se otkriva tačno iza
   mašinice, a stara nestaje ispred nje. Na desktopu sekcija se kratko
   zakači i skrol vodi kroz pet stilova; dugmad rade uvek (i na mobilnom).
   Fotografije: dodajte `image` svakom stilu u content.js i sekcija prelazi
   na sličice (isti prelaz kao brisanje).
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, motion, isWide, serviceById, price, preselect, icon } from '../lib.js';
import { HEAD_VB, hairDefs, hairGroup, mannequin, clipper, STYLES } from '../art/hair-art.js';

const pad = (n) => String(n).padStart(2, '0');

export function renderStyles() {
  const list = content.styles;
  const useImages = list.every((s) => s.image);
  $('#stilovi').innerHTML = `
  <div class="styles__pin">
    <div class="wrap styles__grid">
      <header class="styles__head">
        <p class="label">Tabla frizura</p>
        <h2 id="styles-title" class="h2">Pronađi svoj sledeći izgled</h2>
      </header>

      <div class="styles__stage" data-stage>
        <div class="styles__mirror">
          ${useImages ? `
            <div class="styles__frames">
              ${list.map((s, i) => `<img src="${esc(s.image)}" alt="${esc(s.name)} — frizura na modelu" loading="lazy" decoding="async" class="${i === 0 ? 'is-current' : ''}" data-i="${i}">`).join('')}
            </div>` : `
            <svg class="styles__svg" viewBox="${HEAD_VB}" role="img" aria-labelledby="style-img-label">
              <title id="style-img-label">${esc(list[0].name)} — ilustracija frizure na berberskoj lutki</title>
              ${hairDefs}
              <ellipse cx="300" cy="300" rx="300" ry="330" fill="url(#h-spot)" class="styles__spot"/>
              ${mannequin}
              <line class="h-edge" x1="-50" y1="60" x2="-50" y2="440" stroke="#f2b35e" stroke-width="2" opacity="0"/>
              <g class="h-clippings"></g>
              ${clipper}
            </svg>`}
          <span class="styles__plaque" aria-hidden="true"><span data-plaque-n>01</span> / ${pad(list.length)}</span>
        </div>
        <div class="styles__arrows">
          <button class="round-btn" type="button" data-prev aria-label="Prethodna frizura">${icon('left')}</button>
          <button class="round-btn" type="button" data-next aria-label="Sledeća frizura">${icon('arrow')}</button>
        </div>
      </div>

      <div class="styles__info" id="styles-panel" role="tabpanel" aria-live="polite">
        <div class="styles__info-in" data-info></div>
      </div>

      <div class="styles__tabs" role="tablist" aria-label="Frizure">
        ${list.map((s, i) => `
          <button role="tab" type="button" id="style-tab-${i}" aria-controls="styles-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
            <span class="tab__n">${pad(i + 1)}</span><span class="tab__name">${esc(s.name)}</span>
          </button>`).join('')}
        <span class="styles__progress" aria-hidden="true"><span></span></span>
      </div>
      <p class="styles__hint">${useImages ? '' : 'Ilustracija na berberskoj lutki. U produkciji: fotografije istog modela iz istog ugla.'}</p>
    </div>
  </div>`;
}

function infoHTML(s, i) {
  const svc = serviceById(s.service);
  return `
    <p class="styles__en">${pad(i + 1)} · ${esc(s.en)}</p>
    <h3 class="styles__name">${esc(s.name)}</h3>
    <p class="styles__text">${esc(s.text)}</p>
    <dl class="styles__facts">
      <div><dt>Kome pristaje</dt><dd>${esc(s.suits)}</dd></div>
      <div><dt>Održavanje</dt><dd>${esc(s.upkeep)}</dd></div>
      ${svc ? `<div><dt>Usluga</dt><dd>${esc(svc.name)} · ${price(svc.price)}</dd></div>` : ''}
    </dl>
    <a class="btn btn--dark" href="#zakazivanje" data-book-style="${i}">Zakaži ovu frizuru ${icon('arrow')}</a>`;
}

export function initStyles() {
  const sec = $('#stilovi');
  const list = content.styles;
  const n = list.length;
  const info = $('[data-info]', sec);
  const tabs = $$('[role="tab"]', sec);
  const svg = $('.styles__svg', sec);
  const slot = svg && $('.hair-slot', svg);
  const imgs = $$('.styles__frames img', sec);
  const plaqueN = $('[data-plaque-n]', sec);
  const bar = $('.styles__progress span', sec);
  const full = motion.full;
  const gsap = window.gsap;
  let current = -1;
  let tl = null;
  let st = null; // ScrollTrigger kad je sekcija zakačena
  let lockUntil = 0; // dok traje programski skrol, skrol ne menja frizuru

  if (slot) slot.innerHTML = hairGroup(list[0].art);

  function setInfo(i) {
    info.innerHTML = infoHTML(list[i], i);
    if (full) gsap.fromTo(info.children, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
    plaqueN.textContent = pad(i + 1);
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    if (svg) $('title', svg).textContent = `${list[i].name} — ilustracija frizure na berberskoj lutki`;
    if (!st) bar.style.transform = `scaleX(${n > 1 ? i / (n - 1) : 1})`;
  }

  function show(i) {
    i = Math.max(0, Math.min(n - 1, i));
    if (i === current) return;
    const prev = current; current = i;
    setInfo(i);
    if (prev < 0) return;
    if (imgs.length) return swapImage(prev, i);
    swapHair(prev, i);
  }

  function swapImage(prev, i) {
    imgs.forEach((im, k) => im.classList.toggle('is-current', k === i));
    if (!full) return;
    gsap.fromTo(imgs[i], { clipPath: prev < i ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 0.9, ease: 'power2.inOut' });
  }

  function swapHair(prev, i) {
    if (tl) tl.progress(1).kill();
    const oldG = $('.hair', slot);
    slot.insertAdjacentHTML('beforeend', hairGroup(list[i].art));
    const newG = slot.lastElementChild;
    const s = STYLES[list[i].art];
    if (!full) { oldG.remove(); return; }

    const fwd = i > prev; // napred: mašinica ide od potiljka ka čelu
    const clipNew = $('.h-clip-new', svg), clipOld = $('.h-clip-old', svg);
    const cl = $('.h-clipper', svg), edge = $('.h-edge', svg);
    newG.setAttribute('clip-path', 'url(#h-clip-new)');
    oldG.setAttribute('clip-path', 'url(#h-clip-old)');
    const from = fwd ? 150 : 470, to = fwd ? 470 : 150;
    const p = { x: from };
    const apply = () => {
      const x = p.x;
      if (fwd) { clipNew.setAttribute('x', 0); clipNew.setAttribute('width', Math.max(0, x)); clipOld.setAttribute('x', x); clipOld.setAttribute('width', 600); }
      else { clipNew.setAttribute('x', x); clipNew.setAttribute('width', 600); clipOld.setAttribute('x', 0); clipOld.setAttribute('width', Math.max(0, x)); }
      const y = 64 + 0.0062 * (x - 292) ** 2;
      cl.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${fwd ? 0 : 180} 0 0)`);
      edge.setAttribute('x1', x); edge.setAttribute('x2', x);
    };
    apply();
    let lastDrop = 0;
    tl = gsap.timeline({
      onComplete: () => {
        oldG.remove(); newG.removeAttribute('clip-path');
        cl.setAttribute('transform', 'translate(-200 0)');
        tl = null;
      },
    });
    tl.to(p, {
      x: to, duration: 1.05, ease: 'power1.inOut',
      onUpdate: () => {
        apply();
        if (Math.abs(p.x - lastDrop) > 26) { lastDrop = p.x; dropClippings(p.x, 64 + 0.0062 * (p.x - 292) ** 2 + 40); }
      },
    }, 0)
      .fromTo(edge, { attr: { opacity: 0 } }, { attr: { opacity: 0.7 }, duration: 0.2 }, 0)
      .to(edge, { attr: { opacity: 0 }, duration: 0.25 }, 0.85)
      .to($('.head-tilt', svg), { rotation: s.tilt, svgOrigin: '284 590', duration: 1.2, ease: 'power2.inOut' }, 0)
      .to($('.skin-hi', svg), { attr: { cx: 370 - s.light, cy: 300 - s.light * .6 }, duration: 1.2, ease: 'power2.inOut' }, 0)
      .to($('.styles__spot', svg), { attr: { cx: 300 + s.light * 1.5 }, duration: 1.2, ease: 'power2.inOut' }, 0);
  }

  function dropClippings(x, y) {
    const g = $('.h-clippings', svg);
    for (let k = 0; k < 4; k++) {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const a = Math.random() * Math.PI;
      const len = 3 + Math.random() * 5;
      l.setAttribute('x1', x); l.setAttribute('y1', y);
      l.setAttribute('x2', x + Math.cos(a) * len); l.setAttribute('y2', y + Math.sin(a) * len);
      l.setAttribute('stroke', '#2c1b12'); l.setAttribute('stroke-width', '1.4'); l.setAttribute('stroke-linecap', 'round');
      g.appendChild(l);
      gsap.to(l, {
        x: (Math.random() - 0.5) * 60, y: 180 + Math.random() * 200, rotation: (Math.random() - 0.5) * 240,
        opacity: 0, duration: 1.1 + Math.random() * 0.6, ease: 'power1.in', onComplete: () => l.remove(),
      });
    }
  }

  /* Kontrole: tabovi (strelice na tastaturi), strelice, prevlačenje */
  const go = (i) => {
    i = Math.max(0, Math.min(n - 1, i));
    if (st) { // zakačeno: pomeri skrol na tačku te frizure, stanje prati skrol
      const y = st.start + (st.end - st.start) * (i / (n - 1)) + 2;
      lockUntil = performance.now() + 1100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      show(i);
    } else show(i);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => go(i));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (e.key === 'Home' || e.key === 'End' || k) {
        e.preventDefault();
        const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + k + n) % n;
        tabs[j].focus(); go(j);
      }
    });
  });
  $('[data-prev]', sec).addEventListener('click', () => go(current - 1));
  $('[data-next]', sec).addEventListener('click', () => go(current + 1));

  const stage = $('[data-stage]', sec);
  let sx = null, sy = 0;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  stage.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) go(current + (dx < 0 ? 1 : -1));
  });

  sec.addEventListener('click', (e) => {
    const a = e.target.closest('[data-book-style]');
    if (!a) return;
    e.preventDefault(); e.stopPropagation();
    const s = list[+a.dataset.bookStyle];
    preselect({ service: s.service, style: s.name });
  });

  show(0);

  /* Zakačeni skrol samo na širokim ekranima sa punim kretanjem */
  if (full && isWide()) {
    const { ScrollTrigger } = window;
    sec.classList.add('is-pinned');
    st = ScrollTrigger.create({
      trigger: sec, pin: $('.styles__pin', sec), start: 'top top', end: () => `+=${window.innerHeight * 0.7 * (n - 1)}`,
      invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
        if (performance.now() > lockUntil) show(Math.round(self.progress * (n - 1)));
      },
    });
  }
}
