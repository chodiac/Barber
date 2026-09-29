/* ==========================================================================
   Scena berbernice — ilustrovani slojevi (SVG), viewBox 1600×1000.
   Isti crteži se koriste u heroju (slojevi sa paralaksom) i u galeriji
   (isečci preko <use>), pa je cela vizuelna priča dosledna.
   ========================================================================== */

export const VB = { w: 1600, h: 1000 };

/* Pozicije ključnih objekata — koriste ih hero (fokus kamere) i hotspotovi */
export const ANCHORS = {
  mirrorGlass: { x: 790, y: 150, w: 420, h: 490 },
  mirror: { x: 750, y: 110, w: 500, h: 570 },
  tools: { x: 1160, y: 612, w: 330, h: 96 },
  shelf: { x: 1320, y: 270, w: 260, h: 210 },
  chair: { x: 850, y: 470, w: 300, h: 500 },
};

/* Isečci za galeriju (viewBox) */
export const CROPS = {
  chair: '800 430 400 560',
  mirror: '690 80 620 640',
  tools: '1150 590 360 150',
  lamp: '1330 0 300 330',
  shelf: '1300 250 300 260',
  counter: '560 560 420 280',
};

const bulbPositions = (() => {
  const out = [];
  const cx = 1000, cy = 360, r = 230;
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI + (i * Math.PI) / 6;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  for (const y of [440, 530, 620]) { out.push([770, y]); out.push([1230, y]); }
  // redosled paljenja: od dna ka vrhu luka, naizmenično levo/desno
  return out.sort((a, b) => b[1] - a[1]);
})();

export const defs = /* svg */ `
<svg class="scene-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
  <defs>
    <linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#20150e"/>
      <stop offset=".45" stop-color="#3f2a1c"/>
      <stop offset="1" stop-color="#2a1b12"/>
    </linearGradient>
    <radialGradient id="g-pool" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#f2b35e" stop-opacity=".42"/>
      <stop offset=".55" stop-color="#c77a3a" stop-opacity=".12"/>
      <stop offset="1" stop-color="#c77a3a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-glow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#ffe3b0" stop-opacity=".9"/>
      <stop offset=".25" stop-color="#f2b35e" stop-opacity=".45"/>
      <stop offset="1" stop-color="#f2b35e" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-bulb" cx=".42" cy=".38" r=".62">
      <stop offset="0" stop-color="#fffaf0"/>
      <stop offset=".45" stop-color="#ffd996"/>
      <stop offset="1" stop-color="#e59a45"/>
    </radialGradient>
    <radialGradient id="g-bulb-off" cx=".42" cy=".38" r=".62">
      <stop offset="0" stop-color="#8d8174"/>
      <stop offset="1" stop-color="#4a3f35"/>
    </radialGradient>
    <linearGradient id="g-walnut" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a2416"/>
      <stop offset="1" stop-color="#1d120b"/>
    </linearGradient>
    <linearGradient id="g-oak" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c49565"/>
      <stop offset=".5" stop-color="#9a6b3f"/>
      <stop offset="1" stop-color="#6e4526"/>
    </linearGradient>
    <linearGradient id="g-oak-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c29467"/>
      <stop offset="1" stop-color="#8a5c35"/>
    </linearGradient>
    <linearGradient id="g-glass" x1="0" y1="0" x2=".3" y2="1">
      <stop offset="0" stop-color="#3a322b"/>
      <stop offset=".6" stop-color="#2a2420"/>
      <stop offset="1" stop-color="#1c1814"/>
    </linearGradient>
    <linearGradient id="g-daylight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b9c4bb" stop-opacity=".55"/>
      <stop offset="1" stop-color="#6f7c73" stop-opacity=".25"/>
    </linearGradient>
    <radialGradient id="g-glass-vig" cx=".5" cy=".45" r=".7">
      <stop offset=".5" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </radialGradient>
    <linearGradient id="g-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".5" stop-color="#fff4e2" stop-opacity=".16"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="g-leather" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2a130c"/>
      <stop offset=".3" stop-color="#6b3421"/>
      <stop offset=".55" stop-color="#7c3e27"/>
      <stop offset=".8" stop-color="#4e2416"/>
      <stop offset="1" stop-color="#220f09"/>
    </linearGradient>
    <linearGradient id="g-leather-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffcf92" stop-opacity=".22"/>
      <stop offset=".35" stop-color="#ffcf92" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".45"/>
    </linearGradient>
    <linearGradient id="g-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4c4a47"/>
      <stop offset=".35" stop-color="#e9e1d4"/>
      <stop offset=".55" stop-color="#8f8a82"/>
      <stop offset="1" stop-color="#3a3835"/>
    </linearGradient>
    <linearGradient id="g-steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1ebe0"/>
      <stop offset="1" stop-color="#8a847b"/>
    </linearGradient>
    <linearGradient id="g-brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e2b77a"/>
      <stop offset=".5" stop-color="#a8733c"/>
      <stop offset="1" stop-color="#6d4520"/>
    </linearGradient>
    <linearGradient id="g-copper-shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3b2014"/>
      <stop offset=".4" stop-color="#b06f42"/>
      <stop offset=".6" stop-color="#d49a68"/>
      <stop offset="1" stop-color="#4a2818"/>
    </linearGradient>
    <linearGradient id="g-amber-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3f1c07"/>
      <stop offset=".4" stop-color="#9b5419"/>
      <stop offset=".6" stop-color="#c47a2f"/>
      <stop offset="1" stop-color="#3f1c07"/>
    </linearGradient>
    <linearGradient id="g-jar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2d3b33" stop-opacity=".9"/>
      <stop offset=".45" stop-color="#6f8f78" stop-opacity=".75"/>
      <stop offset="1" stop-color="#2d3b33" stop-opacity=".9"/>
    </linearGradient>
    <linearGradient id="g-cream" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f2e8d5"/>
      <stop offset="1" stop-color="#cdbd9f"/>
    </linearGradient>
    <linearGradient id="g-shelf-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".35"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </linearGradient>

    <clipPath id="clip-glass"><path d="M790 640 L790 360 A210 210 0 0 1 1210 360 L1210 640 Z"/></clipPath>

    <!-- Tekstura drveta: istegnut šum pomnožen sa bojom -->
    <filter id="f-wood" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="3" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .42  0 0 0 0 .34  0 0 0 1.1 -.35" result="g"/>
      <feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/>
      <feBlend in="SourceGraphic" in2="gi" mode="multiply"/>
    </filter>
    <filter id="f-wood-h" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.09 0.005" numOctaves="3" seed="3" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .42  0 0 0 0 .34  0 0 0 1.1 -.35" result="g"/>
      <feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/>
      <feBlend in="SourceGraphic" in2="gi" mode="multiply"/>
    </filter>
    <filter id="f-plaster" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="11"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .07  0 0 0 0 .05  0 0 0 .5 0"/>
    </filter>
    <filter id="f-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="f-soft-s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>

    <!-- Profil glave za tablu frizura na zidu -->
    <path id="p-profile" d="M292 116 C352 112 398 146 404 206 C407 232 403 252 410 266 C414 274 410 282 414 292 L436 340 C440 348 434 356 424 358 C418 359 414 362 414 368 C414 374 420 378 419 384 C418 390 412 392 414 398 C417 404 416 412 409 416 C404 420 404 428 408 438 C411 452 402 466 384 470 C360 474 338 468 326 478 C322 500 326 530 330 580 L236 580 C238 530 232 480 218 440 C200 400 184 360 182 300 C180 200 222 120 292 116 Z"/>
  </defs>
</svg>`;

/* ---------- ZID ---------- */
const panels = Array.from({ length: 8 }, (_, i) => {
  const x = i * 200 + 22;
  return `<rect x="${x}" y="592" width="156" height="390" rx="3" fill="none" stroke="#130b06" stroke-opacity=".7" stroke-width="3"/>
          <rect x="${x + 3}" y="595" width="150" height="384" rx="2" fill="none" stroke="#c9905a" stroke-opacity=".12" stroke-width="2"/>`;
}).join('');

const shelfItems = /* svg */ `
  <!-- gornja polica -->
  <g>
    <rect x="1348" y="236" width="30" height="94" rx="6" fill="url(#g-amber-glass)"/>
    <rect x="1356" y="214" width="14" height="26" rx="3" fill="#2b1a10"/>
    <rect x="1350" y="270" width="26" height="34" fill="#e8dcc4" opacity=".85"/>
    <rect x="1353" y="279" width="20" height="3" fill="#3b4130"/>
    <rect x="1394" y="262" width="40" height="68" rx="4" fill="#3b4130"/>
    <rect x="1394" y="262" width="40" height="10" fill="#2a2e22"/>
    <rect x="1398" y="286" width="32" height="22" fill="#e8dcc4" opacity=".8"/>
    <rect x="1448" y="296" width="56" height="34" rx="4" fill="url(#g-brass)"/>
    <rect x="1448" y="293" width="56" height="8" rx="3" fill="#6d4520"/>
    <rect x="1448" y="306" width="56" height="12" fill="#241812" opacity=".75"/>
    <rect x="1516" y="244" width="26" height="86" rx="10" fill="url(#g-amber-glass)" opacity=".9"/>
    <rect x="1522" y="226" width="14" height="20" rx="2" fill="#16120f"/>
  </g>
  <!-- donja polica -->
  <g>
    <rect x="1344" y="416" width="58" height="54" rx="4" fill="#e8dcc4"/>
    <rect x="1344" y="412" width="58" height="10" rx="3" fill="#b06f42"/>
    <text x="1373" y="450" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#3b2416" letter-spacing="1">POMADA</text>
    <rect x="1414" y="386" width="34" height="84" rx="5" fill="url(#g-jar)"/>
    <rect x="1411" y="380" width="40" height="10" rx="2" fill="#16120f"/>
    <rect x="1462" y="428" width="50" height="42" rx="4" fill="#5a3a24"/>
    <rect x="1462" y="424" width="50" height="8" rx="3" fill="#2b1a10"/>
    <rect x="1468" y="440" width="38" height="14" fill="#e8dcc4" opacity=".75"/>
    <rect x="1524" y="400" width="30" height="70" rx="12" fill="#e8dcc4" opacity=".92"/>
    <rect x="1530" y="388" width="18" height="14" fill="#3b4130"/>
  </g>`;

const chart = /* svg */ `
  <g transform="translate(404 92) scale(.9)">
    <rect x="-8" y="-8" width="196" height="246" fill="#1a100a" opacity=".5" filter="url(#f-soft-s)"/>
    <rect width="180" height="230" fill="url(#g-oak)" filter="url(#f-wood)"/>
    <rect x="12" y="12" width="156" height="206" fill="#e2d4b8"/>
    <rect x="12" y="12" width="156" height="206" fill="#6b4a2a" opacity=".12"/>
    <text x="90" y="36" text-anchor="middle" font-family="Georgia,serif" font-size="12" letter-spacing="2" fill="#3b2416">FRIZURE</text>
    <line x1="30" y1="44" x2="150" y2="44" stroke="#3b2416" stroke-width=".8"/>
    ${[[34, 58], [96, 58], [34, 136], [96, 136]].map(([x, y]) => `
      <g transform="translate(${x} ${y}) scale(.105)">
        <use href="#p-profile" fill="none" stroke="#3b2416" stroke-width="10"/>
        <path d="M190 300 C182 180 240 110 300 106 C360 104 408 150 410 208 C360 190 250 180 190 300 Z" fill="#3b2416"/>
      </g>`).join('')}
  </g>`;

export const wall = /* svg */ `
<g id="sc-wall">
  <rect y="-420" width="1600" height="440" fill="#130c08"/>
  <rect width="1600" height="1000" fill="url(#g-wall)"/>
  <rect width="1600" height="560" filter="url(#f-plaster)"/>
  <ellipse cx="1000" cy="380" rx="760" ry="520" fill="url(#g-pool)"/>
  <ellipse cx="230" cy="260" rx="420" ry="360" fill="url(#g-pool)" opacity=".7"/>
  <!-- venac -->
  <rect width="1600" height="26" fill="#150d08"/>
  <rect y="26" width="1600" height="9" fill="#7a5233"/>
  <rect y="35" width="1600" height="5" fill="#1c120b"/>
  <rect y="40" width="1600" height="40" fill="url(#g-shelf-fade)"/>
  ${chart}
  <!-- lamperija -->
  <rect y="560" width="1600" height="440" fill="url(#g-walnut)" filter="url(#f-wood)"/>
  ${panels}
  <rect y="548" width="1600" height="16" fill="url(#g-oak-top)" filter="url(#f-wood-h)"/>
  <rect y="548" width="1600" height="2" fill="#f2c894" opacity=".35"/>
  <rect y="564" width="1600" height="22" fill="url(#g-shelf-fade)"/>
  <!-- polica -->
  <g>
    <rect x="1320" y="330" width="270" height="12" fill="url(#g-oak-top)" filter="url(#f-wood-h)"/>
    <rect x="1320" y="342" width="270" height="18" fill="url(#g-shelf-fade)"/>
    <rect x="1320" y="470" width="270" height="12" fill="url(#g-oak-top)" filter="url(#f-wood-h)"/>
    <rect x="1320" y="482" width="270" height="18" fill="url(#g-shelf-fade)"/>
    <path d="M1340 342 l0 26 l14 0 z M1566 342 l0 26 l-14 0 z M1340 482 l0 26 l14 0 z M1566 482 l0 26 l-14 0 z" fill="#1c120b"/>
    ${shelfItems}
  </g>
</g>`;

/* ---------- OGLEDALO ---------- */
const bulbs = bulbPositions.map(([x, y], i) => /* svg */ `
  <g class="bulb" style="--i:${i}">
    <circle class="bulb-glow" cx="${x}" cy="${y}" r="46" fill="url(#g-glow)"/>
    <circle cx="${x}" cy="${y + 1}" r="14" fill="#2b1a10"/>
    <circle class="bulb-off" cx="${x}" cy="${y}" r="11" fill="url(#g-bulb-off)"/>
    <circle class="bulb-on" cx="${x}" cy="${y}" r="11" fill="url(#g-bulb)"/>
  </g>`).join('');

export const mirror = /* svg */ `
<g id="sc-mirror">
  <path d="M750 690 L750 360 A250 250 0 0 1 1250 360 L1250 690 Z" transform="translate(10 16)" fill="#0b0705" opacity=".6" filter="url(#f-soft)"/>
  <path d="M750 680 L750 360 A250 250 0 0 1 1250 360 L1250 680 Z" fill="url(#g-oak)" filter="url(#f-wood)"/>
  <path d="M750 680 L750 360 A250 250 0 0 1 1250 360 L1250 680 Z" fill="none" stroke="#f2c894" stroke-opacity=".25" stroke-width="2"/>
  <path d="M776 660 L776 360 A224 224 0 0 1 1224 360 L1224 660 Z" fill="none" stroke="#3b2416" stroke-width="6"/>
  <path class="mirror-glass" d="M790 640 L790 360 A210 210 0 0 1 1210 360 L1210 640 Z" fill="url(#g-glass)"/>
  <g clip-path="url(#clip-glass)">
    <g class="mirror-reflection">
      <!-- suprotni zid u odrazu -->
      <rect x="780" y="140" width="440" height="520" fill="#33241a" opacity=".7"/>
      <ellipse cx="1000" cy="330" rx="280" ry="220" fill="url(#g-pool)" opacity=".6"/>
      <!-- ulazna vrata sa staklom (dnevno svetlo spolja) -->
      <g transform="translate(846 238)">
        <rect width="132" height="420" fill="#1e140d"/>
        <rect x="12" y="12" width="108" height="210" fill="url(#g-daylight)"/>
        <rect x="12" y="236" width="108" height="170" fill="#2b1c12"/>
        <line x1="66" y1="12" x2="66" y2="222" stroke="#1e140d" stroke-width="5"/>
        <text transform="translate(66 104) scale(-1 1)" text-anchor="middle" font-family="Young Serif, Georgia, serif" font-size="13" letter-spacing="1.5" fill="#f1d7a3" opacity=".75">BRIJAČNICA</text>
        <text transform="translate(66 124) scale(-1 1)" text-anchor="middle" font-family="Young Serif, Georgia, serif" font-size="12" letter-spacing="3" fill="#f1d7a3" opacity=".75">1920</text>
        <circle cx="100" cy="320" r="5" fill="url(#g-brass)"/>
      </g>
      <!-- klupa za čekanje i čiviluk u odrazu -->
      <rect x="1030" y="520" width="190" height="14" fill="#4a2e1d"/>
      <rect x="1040" y="534" width="8" height="80" fill="#2b1a10"/>
      <rect x="1200" y="534" width="8" height="80" fill="#2b1a10"/>
      <line x1="1060" y1="300" x2="1190" y2="300" stroke="#6d4520" stroke-width="5"/>
      <path d="M1100 300 q-6 40 -20 60 q30 10 46 -2 q-10 -30 -14 -58z" fill="#3b4130" opacity=".9"/>
      <!-- odraz viseće lampe -->
      <line x1="1120" y1="140" x2="1120" y2="204" stroke="#120b07" stroke-width="2"/>
      <path d="M1094 228 Q1094 204 1120 202 Q1146 204 1146 228 Z" fill="url(#g-copper-shade)" opacity=".8"/>
      <circle cx="1120" cy="236" r="44" fill="url(#g-glow)" opacity=".55"/>
      <!-- odsjaj zadnjeg dela stolice -->
      <path d="M905 640 Q905 560 940 548 L1060 548 Q1095 560 1095 640 Z" fill="#1a0c07" opacity=".85"/>
    </g>
    <rect x="780" y="140" width="440" height="520" fill="url(#g-glass-vig)"/>
    <g class="mirror-sheen">
      <polygon points="820,640 900,640 1080,140 1000,140" fill="url(#g-sheen)"/>
      <polygon points="930,640 950,640 1130,140 1110,140" fill="url(#g-sheen)" opacity=".7"/>
    </g>
  </g>
  <path d="M790 640 L790 360 A210 210 0 0 1 1210 360 L1210 640 Z" fill="none" stroke="#f7e7cc" stroke-opacity=".28" stroke-width="3"/>
  ${bulbs}
</g>`;

/* ---------- PULT SA ALATOM ---------- */
export const counter = /* svg */ `
<g id="sc-counter">
  <rect y="714" width="1600" height="400" fill="url(#g-walnut)" filter="url(#f-wood)"/>
  ${[0, 1, 2, 3].map(i => `
    <rect x="${40 + i * 400}" y="748" width="360" height="104" rx="3" fill="#000" fill-opacity=".12" stroke="#0e0804" stroke-width="3"/>
    <rect x="${200 + i * 400}" y="792" width="40" height="10" rx="5" fill="url(#g-brass)"/>
    <rect x="${40 + i * 400}" y="876" width="360" height="130" rx="3" fill="#000" fill-opacity=".12" stroke="#0e0804" stroke-width="3"/>`).join('')}
  <rect y="686" width="1600" height="30" fill="url(#g-oak-top)" filter="url(#f-wood-h)"/>
  <rect y="686" width="1600" height="3" fill="#ffd9a6" opacity=".45"/>
  <rect y="708" width="1600" height="8" fill="#3a2314"/>
  <rect y="716" width="1600" height="30" fill="url(#g-shelf-fade)"/>

  <!-- levo: tegla sa češljevima, tonik, raspršivač -->
  <g>
    <ellipse cx="610" cy="690" rx="28" ry="5" fill="#000" opacity=".4"/>
    <rect x="596" y="612" width="30" height="78" rx="4" fill="#e8dcc4"/>
    <rect x="600" y="600" width="22" height="14" fill="#16120f"/>
    <path d="M604 600 l-6 -16 l22 0 l2 16z" fill="#16120f"/>
    <rect x="596" y="640" width="30" height="20" fill="#3b4130"/>

    <ellipse cx="704" cy="690" rx="44" ry="6" fill="#000" opacity=".45"/>
    ${[676, 688, 700, 712, 724].map((x, i) => `<rect x="${x}" y="${566 + (i % 2) * 10}" width="6" height="90" rx="2" fill="${i % 2 ? '#16120f' : '#5a3a24'}"/>`).join('')}
    <rect x="664" y="596" width="80" height="94" rx="7" fill="url(#g-jar)"/>
    <rect x="664" y="596" width="80" height="12" fill="#b9c4bb" opacity=".25"/>
    <rect x="676" y="604" width="6" height="80" rx="3" fill="#fff" opacity=".18"/>
    <rect x="660" y="590" width="88" height="10" rx="3" fill="url(#g-steel)"/>

    <ellipse cx="800" cy="690" rx="22" ry="5" fill="#000" opacity=".45"/>
    <path d="M784 690 L784 624 Q784 606 794 600 L794 572 L806 572 L806 600 Q816 606 816 624 L816 690 Z" fill="url(#g-amber-glass)"/>
    <rect x="792" y="562" width="16" height="12" fill="#16120f"/>
    <rect x="784" y="638" width="32" height="30" fill="#e8dcc4" opacity=".9"/>
    <rect x="788" y="646" width="24" height="2" fill="#5a3a24"/>
    <rect x="788" y="652" width="16" height="2" fill="#5a3a24"/>
  </g>

  <!-- desno: alat (hotspot "usluge") -->
  <g class="tools">
    <!-- složen peškir -->
    <ellipse cx="1240" cy="690" rx="70" ry="6" fill="#000" opacity=".4"/>
    <rect x="1176" y="664" width="132" height="24" rx="6" fill="url(#g-cream)"/>
    <rect x="1176" y="672" width="132" height="4" fill="#3b4130" opacity=".8"/>
    <rect x="1182" y="652" width="120" height="16" rx="6" fill="url(#g-cream)"/>
    <!-- makaze na peškiru -->
    <g class="tool tool-scissors" transform="translate(1196 646)">
      <path d="M8 4 L96 -2 L100 1 L10 8 Z" fill="url(#g-steel)"/>
      <path d="M8 6 L92 10 L94 13 L8 10 Z" fill="url(#g-steel)"/>
      <circle cx="-2" cy="2" r="9" fill="none" stroke="#1a1411" stroke-width="4"/>
      <circle cx="-2" cy="12" r="9" fill="none" stroke="#1a1411" stroke-width="4"/>
      <circle cx="30" cy="6" r="2" fill="#5a524a"/>
    </g>
    <!-- britva -->
    <g class="tool tool-razor" transform="translate(1330 676)">
      <ellipse cx="40" cy="12" rx="50" ry="4" fill="#000" opacity=".35"/>
      <rect x="0" y="0" width="58" height="10" rx="5" fill="#16120f"/>
      <path d="M56 1 L96 -2 Q102 4 96 9 L56 9 Z" fill="url(#g-steel)"/>
      <circle cx="56" cy="5" r="2.4" fill="url(#g-brass)"/>
    </g>
    <!-- mašinica sa kablom -->
    <g class="tool tool-clipper" transform="translate(1418 640)">
      <ellipse cx="34" cy="50" rx="46" ry="5" fill="#000" opacity=".4"/>
      <path d="M0 18 Q0 4 14 4 L64 8 Q74 10 74 22 L74 34 Q74 46 64 46 L14 48 Q0 48 0 34 Z" fill="#1d1a17"/>
      <path d="M8 12 L60 14" stroke="#4a4540" stroke-width="3" stroke-linecap="round"/>
      <rect x="72" y="12" width="10" height="30" rx="2" fill="url(#g-steel)"/>
      <rect x="26" y="20" width="18" height="8" rx="3" fill="#b06f42"/>
      <path d="M0 30 Q-30 34 -36 60 Q-40 90 -20 110" fill="none" stroke="#120e0b" stroke-width="4"/>
    </g>
    <!-- češalj -->
    <g class="tool tool-comb" transform="translate(1180 700) rotate(-4)">
      <rect x="0" y="-12" width="110" height="7" rx="2" fill="#16120f"/>
      ${Array.from({ length: 22 }, (_, i) => `<rect x="${3 + i * 4.8}" y="-6" width="2.2" height="${i < 11 ? 6 : 8}" fill="#16120f"/>`).join('')}
    </g>
    <!-- četka za brijanje na postolju -->
    <g class="tool tool-brush" transform="translate(1520 604)">
      <ellipse cx="18" cy="86" rx="30" ry="5" fill="#000" opacity=".45"/>
      <rect x="-4" y="80" width="44" height="6" rx="2" fill="url(#g-brass)"/>
      <rect x="15" y="44" width="6" height="38" fill="url(#g-brass)"/>
      <path d="M0 44 L36 44 L32 26 L4 26 Z" fill="#5a3a24"/>
      <path d="M4 26 Q-6 0 18 -8 Q42 0 32 26 Z" fill="url(#g-cream)"/>
      <path d="M10 22 Q8 4 18 -2" stroke="#b8a482" stroke-width="1.5" fill="none"/>
    </g>
  </g>
</g>`;

/* ---------- STOLICA (pogled s leđa) ---------- */
const tufts = (() => {
  const pts = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4 + (r % 2); c++) {
    const off = r % 2 ? 0 : 30;
    pts.push([905 + off + c * 60, 630 + r * 70]);
  }
  return pts;
})();

export const chair = /* svg */ `
<g id="sc-chair">
  <ellipse cx="1000" cy="700" rx="200" ry="26" fill="#000" opacity=".45" filter="url(#f-soft)"/>
  <!-- naslon za glavu -->
  <rect x="992" y="512" width="16" height="70" fill="url(#g-chrome)"/>
  <rect x="936" y="466" width="128" height="58" rx="26" fill="url(#g-leather)"/>
  <rect x="936" y="466" width="128" height="58" rx="26" fill="url(#g-leather-v)"/>
  <rect x="936" y="466" width="128" height="58" rx="26" fill="none" stroke="#1a0904" stroke-width="3"/>
  <!-- rukohvati -->
  <path d="M770 790 Q770 766 800 764 L880 764 L880 806 L800 806 Q770 806 770 790Z" fill="url(#g-leather)"/>
  <path d="M1230 790 Q1230 766 1200 764 L1120 764 L1120 806 L1200 806 Q1230 806 1230 790Z" fill="url(#g-leather)"/>
  <rect x="800" y="806" width="10" height="200" fill="url(#g-chrome)"/>
  <rect x="1190" y="806" width="10" height="200" fill="url(#g-chrome)"/>
  <!-- naslon -->
  <path d="M864 606 Q866 568 904 564 L1096 564 Q1134 568 1136 606 L1152 968 Q1152 994 1124 994 L876 994 Q848 994 848 968 Z" fill="url(#g-leather)"/>
  <path d="M864 606 Q866 568 904 564 L1096 564 Q1134 568 1136 606 L1152 968 Q1152 994 1124 994 L876 994 Q848 994 848 968 Z" fill="url(#g-leather-v)"/>
  <g stroke="#1b0a05" stroke-opacity=".55" stroke-width="2" fill="none">
    ${tufts.map(([x, y]) => `<path d="M${x} ${y} l30 35 M${x} ${y} l-30 35"/>`).join('')}
  </g>
  ${tufts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#1e0c06"/><circle cx="${x - 1}" cy="${y - 1.5}" r="1.6" fill="#c07a55" opacity=".6"/>`).join('')}
  <path d="M864 606 Q866 568 904 564 L1096 564 Q1134 568 1136 606 L1152 968 Q1152 994 1124 994 L876 994 Q848 994 848 968 Z" fill="none" stroke="#150803" stroke-width="4"/>
  <path d="M880 586 Q900 574 940 574 L1060 574" fill="none" stroke="#ffcf92" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
  <!-- hromirani okvir sa strane -->
  <path d="M846 700 L854 994" stroke="url(#g-chrome)" stroke-width="8"/>
  <path d="M1154 700 L1146 994" stroke="url(#g-chrome)" stroke-width="8"/>
</g>`;

/* ---------- PREDNJI PLAN: viseće lampe ---------- */
const pendant = (x, s = 1, drop = 150) => /* svg */ `
  <g transform="translate(${x} 0) scale(${s})">
    <line x1="0" y1="-440" x2="0" y2="${drop}" stroke="#0e0906" stroke-width="3"/>
    <rect x="-9" y="${drop - 6}" width="18" height="18" rx="2" fill="url(#g-brass)"/>
    <path d="M-86 ${drop + 92} Q-86 ${drop + 10} 0 ${drop + 8} Q86 ${drop + 10} 86 ${drop + 92} Z" fill="url(#g-copper-shade)"/>
    <ellipse cx="0" cy="${drop + 92}" rx="86" ry="10" fill="#2a160c"/>
    <ellipse class="lamp-bulb" cx="0" cy="${drop + 96}" rx="30" ry="12" fill="url(#g-bulb)"/>
    <circle class="lamp-glow" cx="0" cy="${drop + 110}" r="190" fill="url(#g-glow)" opacity=".55"/>
  </g>`;

export const front = /* svg */ `
<g id="sc-front">
  ${pendant(230, 1.05, 110)}
  ${pendant(1470, .9, 60)}
</g>`;

/* Kompletna scena za isečke u galeriji */
export function cropSVG(crop, label) {
  return `<svg viewBox="${CROPS[crop]}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
    <use href="#sc-wall"/><use href="#sc-mirror"/><use href="#sc-counter"/><use href="#sc-chair"/><use href="#sc-front"/>
  </svg>`;
}
