/* ==========================================================================
   HERO — ulazak u berbernicu.
   1) vrata se otvore (jednom po sesiji, preskače se klikom/tasterom)
   2) sijalice oko ogledala se pale redom
   3) pomeranje miša pomera slojeve po dubini (desktop)
   4) skrol gura kameru u ogledalo; staklo postaje pozadina sledeće sekcije
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, icon, motion, isDesktop, bookingHref } from '../lib.js';
import { defs, wall, mirror, counter, chair, front, ANCHORS } from '../art/scene-art.js';

const LAYERS = [
  { key: 'wall', art: wall, depth: 0.25, push: 1 },
  { key: 'mirror', art: mirror, depth: 0.4, push: 1 },
  { key: 'counter', art: counter, depth: 0.65, push: 1.18 },
  { key: 'chair', art: chair, depth: 1, push: 1.9 },
  { key: 'front', art: front, depth: 1.5, push: 2.6 },
];
const HOTSPOT_LAYER = { shelf: 'wall', mirror: 'mirror', tools: 'counter', chair: 'chair' };

const VB_WIDE = [0, 0, 1600, 1000];
const VB_TALL = [600, -70, 800, 1200];
const VB_MID = [280, -30, 1060, 1040]; // skoro kvadratni prozori: scena desno od naslova

export function renderHero() {
  $('#scene-defs').outerHTML = defs;
  const h = content.hero;
  const hs = h.hotspots;

  const hotspotHTML = (key) => {
    const s = hs[key]; if (!s) return '';
    return `<a class="hotspot" href="${key === 'chair' ? bookingHref() : s.target}" data-hotspot="${key}" ${key === 'chair' ? 'data-book' : ''}>
      <span class="hotspot__dot" aria-hidden="true"></span>
      <span class="hotspot__label">${esc(s.label)}</span>
    </a>`;
  };

  $('#pocetak').innerHTML = `
  <div class="hero__track">
    <div class="hero__stage">
      <div class="scene" data-scene>
        ${LAYERS.map((l) => `
          <div class="layer layer--${l.key}" data-layer="${l.key}">
            <div class="layer__in">
              <svg viewBox="${VB_WIDE.join(' ')}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${l.art}
                ${l.key === 'mirror' ? `<path class="mirror-fog" d="M790 640 L790 360 A210 210 0 0 1 1210 360 L1210 640 Z" style="fill:var(--mirror)" opacity="0"/>` : ''}
              </svg>
              ${Object.keys(HOTSPOT_LAYER).filter((k) => HOTSPOT_LAYER[k] === l.key).map(hotspotHTML).join('')}
            </div>
          </div>`).join('')}
        <div class="scene__grade" aria-hidden="true"></div>
      </div>

      <div class="hero__copy">
        <p class="label hero__eyebrow">${esc(h.eyebrow)}</p>
        <h1 id="hero-title" class="hero__title">
          ${h.title.map((t) => `<span class="reveal-line"><span>${esc(t)}</span></span>`).join('')}
        </h1>
        <p class="hero__lead">${esc(h.lead)}</p>
        <div class="hero__actions">
          <a class="btn" href="${bookingHref()}" data-book>${esc(h.primary)} ${icon('arrow')}</a>
          <a class="btn btn--ghost" href="#o-nama">${esc(h.secondary)}</a>
        </div>
      </div>

      <p class="hero__hint" aria-hidden="true">
        <span class="hero__hint-line"></span>
        <span class="hint-pointer">${esc(h.hint)}</span><span class="hint-touch">${esc(h.hintTouch)}</span>
      </p>
    </div>
  </div>`;

  if (motion.full && !sessionStorage.getItem('b1920-door')) {
    $('#door-root').outerHTML = `
    <div class="door" aria-hidden="true">
      <div class="door__leaf">
        <div class="door__panel door__panel--glass">
          <span class="door__word">${esc(content.brand.wordmark[0])}</span>
          <span class="door__num">${esc(content.brand.wordmark[1])}</span>
          <span class="door__small">${esc(content.brand.tagline)}</span>
        </div>
        <div class="door__panel door__panel--low"></div>
        <span class="door__handle"></span>
        <span class="door__sign">Otvoreno</span>
      </div>
    </div>`;
  } else {
    $('#door-root').remove();
  }
}

export function initHero() {
  const hero = $('#pocetak');
  const stage = $('.hero__stage', hero);
  const scene = $('[data-scene]', hero);
  const layers = $$('.layer', scene);
  const svgs = $$('.layer svg', scene);
  const sheen = $('.layer--mirror .mirror-sheen', scene);
  let vb = VB_WIDE;

  /* ---- raspored: viewBox (uspravno/položeno) + položaj hotspotova ---- */
  const geom = { s: 1, ox: 0, oy: 0, W: 0, H: 0 };
  const mapPt = (x, y) => [geom.ox + (x - vb[0]) * geom.s, geom.oy + (y - vb[1]) * geom.s];
  function layout() {
    const lin = $('.layer__in', scene);
    geom.W = lin.offsetWidth; geom.H = lin.offsetHeight;
    const ar = geom.W / geom.H;
    vb = ar < 0.95 ? VB_TALL : ar < 1.35 ? VB_MID : VB_WIDE;
    svgs.forEach((s) => s.setAttribute('viewBox', vb.join(' ')));
    geom.s = Math.max(geom.W / vb[2], geom.H / vb[3]);
    geom.ox = (geom.W - vb[2] * geom.s) / 2;
    geom.oy = (geom.H - vb[3] * geom.s) / 2;
    $$('.hotspot', scene).forEach((a) => {
      const k = a.dataset.hotspot; const r = ANCHORS[k];
      const [x, y] = mapPt(r.x + r.w / 2, r.y + r.h * (k === 'chair' ? .32 : .45));
      a.style.left = `${(x / geom.W) * 100}%`;
      a.style.top = `${(y / geom.H) * 100}%`;
    });
  }
  layout();
  window.addEventListener('resize', layout);

  /* ---- hover na objekat: rasveta tog objekta ---- */
  $$('.hotspot', scene).forEach((a) => {
    const on = () => scene.dataset.focus = a.dataset.hotspot;
    const off = () => delete scene.dataset.focus;
    a.addEventListener('pointerenter', on); a.addEventListener('pointerleave', off);
    a.addEventListener('focus', on); a.addEventListener('blur', off);
  });

  /* ---- vrata i sijalice ---- */
  const door = $('.door');
  const lightUp = () => setTimeout(() => scene.classList.add('is-lit'), 60);
  if (door) {
    scene.classList.add('is-dark');
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      sessionStorage.setItem('b1920-door', '1');
      door.classList.add('is-open');
      setTimeout(() => { scene.classList.remove('is-dark'); lightUp(); hero.classList.add('is-in'); }, 520);
      setTimeout(() => door.remove(), 1500);
    };
    setTimeout(finish, 450);
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => window.addEventListener(ev, finish, { once: true, passive: true }));
  } else {
    lightUp(); hero.classList.add('is-in');
  }

  if (!motion.full) { scene.classList.add('is-static'); return; }

  /* ---- paralaksa pokazivačem (samo desktop, samo dok je scena mirna) ---- */
  const target = { x: 0, y: 0 }; const cur = { x: 0, y: 0 };
  let raf = 0; let pushP = 0; let visible = true;
  const ins = layers.map((l) => ({ el: $('.layer__in', l), d: LAYER_DEPTH(l.dataset.layer) }));
  function tick() {
    const k = pushP > 0.02 ? 0 : 1;
    cur.x += (target.x * k - cur.x) * 0.07;
    cur.y += (target.y * k - cur.y) * 0.07;
    ins.forEach(({ el, d }) => { el.style.transform = `translate3d(${(-cur.x * d * 16).toFixed(2)}px, ${(-cur.y * d * 9).toFixed(2)}px, 0)`; });
    if (sheen) sheen.setAttribute('transform', `translate(${(cur.x * 60).toFixed(1)} 0)`);
    raf = (Math.abs(target.x * k - cur.x) + Math.abs(target.y * k - cur.y) > 0.001 && visible) ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  if (isDesktop()) {
    stage.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    });
    stage.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; kick(); });
  }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }).observe(stage);

  /* ---- skrol: kamera ulazi u ogledalo ---- */
  const { gsap, ScrollTrigger } = window;
  hero.classList.add('is-pinned');
  const glass = ANCHORS.mirrorGlass;
  const origin = () => mapPt(glass.x + glass.w / 2, glass.y + glass.h * .52);
  const endScale = () => {
    const gw = glass.w * geom.s, gh = glass.h * geom.s;
    return Math.max(stage.offsetWidth / gw, stage.offsetHeight / gh) * 1.35;
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: $('.hero__track', hero), start: 'top top', end: 'bottom bottom', scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate: (st) => { pushP = st.progress; if (pushP > 0.02) kick(); hero.classList.toggle('is-pushing', pushP > 0.02); },
      onRefreshInit: layout,
    },
  });
  tl.to('.hero__copy', { y: -70, autoAlpha: 0, duration: 0.22 }, 0)
    .to('.hero__hint', { autoAlpha: 0, duration: 0.1 }, 0);
  layers.forEach((l) => {
    const cfg = LAYERS.find((x) => x.key === l.dataset.layer);
    gsap.set(l, { transformOrigin: () => `${origin()[0]}px ${origin()[1]}px` });
    tl.fromTo(l, { scale: 1 }, {
      scale: () => 1 + (endScale() - 1) * cfg.push,
      // kamera se istovremeno poravna sa sredinom stakla
      x: () => stage.offsetWidth / 2 - origin()[0] + geom.W * 0.03,
      y: () => stage.offsetHeight / 2 - origin()[1] + geom.H * 0.03,
      yPercent: cfg.key === 'chair' ? 18 : cfg.key === 'front' ? -22 : 0,
      transformOrigin: () => `${origin()[0]}px ${origin()[1]}px`,
      ease: 'power2.in', duration: 1,
    }, 0);
  });
  tl.to('.mirror-fog', { attr: { opacity: 1 }, duration: 0.42, ease: 'power1.in' }, 0.58)
    .to('.scene__grade', { opacity: 0, duration: 0.5 }, 0.5);

  ScrollTrigger.addEventListener('refreshInit', layout);
}

function LAYER_DEPTH(key) { return LAYERS.find((l) => l.key === key).depth; }

