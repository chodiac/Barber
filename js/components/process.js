/* ==========================================================================
   TOK POSETE — putanja kroz berbernicu. Linija se crta skrolom, makaze
   putuju po njoj, a stanice se pale kad ih makaze stignu. Putanja se
   računa iz stvarnih položaja stanica, pa radi i vodoravno i uspravno.
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, motion } from '../lib.js';

const ICONS = {
  chart: '<rect x="8" y="6" width="32" height="38" rx="2"/><path d="M16 30c0-8 3-13 9-13s8 4 8 9l3 5-3 1v4h-4M16 30v6"/><path d="M13 12h22"/>',
  comb: '<rect x="6" y="14" width="36" height="6" rx="2"/><path d="M10 20v14M14 20v14M18 20v14M22 20v14M26 20v10M30 20v10M34 20v10M38 20v10"/>',
  scissors: '<circle cx="12" cy="34" r="6"/><circle cx="12" cy="14" r="6"/><path d="M17 17l25 15M17 31l25-15"/>',
  mirror: '<ellipse cx="24" cy="18" rx="12" ry="14"/><path d="M24 32v12M20 44h8"/><path class="glint" d="M18 12l6-4M17 18l10-7"/>',
};

export function renderProcess() {
  const steps = content.process;
  $('#proces').innerHTML = `
  <div class="wrap">
    <header class="process__head">
      <p class="label">Tok posete</p>
      <h2 id="process-title" class="h2">Od vrata do ogledala</h2>
    </header>
    <div class="journey" data-journey>
      <svg class="journey__path" aria-hidden="true" focusable="false">
        <path class="journey__base" d=""/>
        <path class="journey__line" d=""/>
        <g class="journey__marker"><circle r="16"/><g transform="translate(-10 -10) scale(.42)" fill="none" stroke-width="3.6"><circle cx="12" cy="34" r="6"/><circle cx="12" cy="14" r="6"/><path d="M17 17l25 15M17 31l25-15"/></g></g>
      </svg>
      <ol class="stations">
        ${steps.map((s, i) => `
          <li class="station" data-i="${i}">
            <span class="station__icon icon-${esc(s.icon)}" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.icon] || ''}</svg>
            </span>
            <span class="station__n">Korak ${i + 1}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
          </li>`).join('')}
      </ol>
    </div>
  </div>`;
}

export function initProcess() {
  const root = $('[data-journey]');
  const svg = $('.journey__path', root);
  const base = $('.journey__base', svg);
  const line = $('.journey__line', svg);
  const marker = $('.journey__marker', svg);
  const stations = $$('.station', root);
  let len = 1; let fracs = [];

  function build() {
    const r = root.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    svg.setAttribute('width', r.width); svg.setAttribute('height', r.height);
    const pts = stations.map((s) => {
      const b = $('.station__icon', s).getBoundingClientRect();
      return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2];
    });
    const vertical = pts.length > 1 && Math.abs(pts[1][0] - pts[0][0]) < 10;
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      if (vertical) { const w = i % 2 ? 26 : -26; d += ` C${x0 + w} ${y0 + (y1 - y0) * .4} ${x1 + w} ${y1 - (y1 - y0) * .4} ${x1} ${y1}`; }
      else { const lift = i % 2 ? -70 : 70; d += ` C${x0 + (x1 - x0) * .45} ${y0 + lift} ${x1 - (x1 - x0) * .45} ${y1 + lift} ${x1} ${y1}`; }
    }
    base.setAttribute('d', d); line.setAttribute('d', d);
    len = line.getTotalLength();
    line.style.strokeDasharray = `${len}`;
    // udeo dužine na kojem je svaka stanica
    fracs = pts.map((p, i) => (i === 0 ? 0 : i === pts.length - 1 ? 1 : nearest(p)));
    set(cur);
  }
  function nearest([x, y]) {
    let best = 0, bd = Infinity;
    for (let t = 0; t <= 1; t += 0.005) { const q = line.getPointAtLength(t * len); const dd = (q.x - x) ** 2 + (q.y - y) ** 2; if (dd < bd) { bd = dd; best = t; } }
    return best;
  }
  let cur = motion.full ? 0 : 1;
  function set(p) {
    cur = p;
    line.style.strokeDashoffset = `${len * (1 - p)}`;
    const q = line.getPointAtLength(p * len);
    marker.setAttribute('transform', `translate(${q.x} ${q.y})`);
    stations.forEach((s, i) => s.classList.toggle('is-on', p >= fracs[i] - 0.01));
  }

  build();
  new ResizeObserver(() => build()).observe(root);

  if (!motion.full) { root.classList.add('is-static'); return; }
  window.gsap.to({ p: 0 }, {
    p: 1, ease: 'none',
    scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 55%', scrub: 0.6 },
    onUpdate() { set(this.targets()[0].p); },
  });
}
