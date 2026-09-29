/* ==========================================================================
   Berberska lutka u profilu + pet frizura na ISTOJ glavi, istom uglu,
   istom svetlu. Profil je namerno izabran: tako izgledaju stare table
   sa frizurama koje vise u berbernicama, i svaka frizura se jasno čita.
   viewBox 0 0 600 720. Kosa je nacrtana kao spoljni obris + zajednička
   donja ivica (zulufi, oko uha, vrat), pa se oblik stvarno menja.
   ========================================================================== */

export const HEAD_VB = '14 24 580 690';

const HEAD = 'M292 116 C352 112 398 146 404 206 C407 232 403 252 410 266 C414 274 410 282 414 292 L436 340 C440 348 434 356 424 358 C418 359 414 362 414 368 C414 374 420 378 419 384 C418 390 412 392 414 398 C417 404 416 412 409 416 C404 420 404 428 408 438 C411 452 402 466 384 470 C360 474 338 468 326 478 C322 500 326 530 330 580 L236 580 C238 530 232 480 218 440 C200 400 184 360 182 300 C180 200 222 120 292 116 Z';
const EAR = 'M258 276 C250 262 276 254 285 270 C295 290 295 322 285 342 C277 356 262 352 262 340 C260 330 268 322 262 312 C256 300 262 290 258 276 Z';

/* Donja ivica kose: od čela preko zulufa, oko uha, do vrata (ide od napred ka nazad) */
const LOWER = 'C380 214 352 222 330 236 C316 250 310 280 306 330 L294 330 C296 300 294 282 284 266 C272 252 256 256 250 272 C242 300 236 350 222 404 Z';
const LOWER_SHORT = 'C380 212 350 220 330 232 C318 246 314 276 310 312 L300 312 C298 290 294 276 284 264 C272 252 256 256 250 272 C242 300 236 346 224 396 Z';

const S = (d) => d.replace(/\s+/g, ' ').trim();

export const STYLES = {
  sidePart: {
    tilt: -1.5, light: 0,
    outer: 'M222 404 C202 392 180 346 176 290 C170 206 212 106 290 98 C350 94 400 118 416 158 C422 178 416 198 404 208',
    lower: LOWER,
    sides: 'solid',
    strands: [
      'M408 196 C404 160 370 128 318 118 C270 110 226 130 202 176',
      'M412 178 C396 142 356 116 304 110',
      'M398 204 C388 176 360 152 316 142 C274 134 236 150 214 190',
      'M392 206 C372 188 330 176 290 180 C250 184 222 212 208 250',
      'M360 216 C334 212 300 214 272 230 C246 246 230 280 222 320',
      'M320 236 C296 246 270 262 254 292',
      'M204 300 C200 330 206 360 218 390',
      'M194 250 C188 290 192 330 204 364',
    ],
    part: 'M402 170 C372 150 330 140 286 142 C252 144 226 154 206 170',
  },
  crop: {
    tilt: 1, light: 18,
    outer: 'M224 396 C204 388 184 346 178 290 C172 208 214 106 290 100 C352 96 400 122 414 168 C420 192 420 216 417 242 L409 235 L403 244 L395 236 L388 245 L380 236 L371 242 L364 234',
    lower: 'C354 232 342 234 332 240 C318 250 314 276 310 312 L300 312 C298 290 294 276 284 264 C272 252 256 256 250 272 C242 300 236 346 224 396 Z',
    sides: 'short',
    strands: [
      'M232 150 C270 118 320 110 368 128',
      'M408 188 L410 236',
      'M258 136 C300 118 346 120 384 142',
      'M396 176 L397 238',
      'M290 124 C330 118 370 132 398 160',
      'M382 168 L384 236',
      'M226 180 C262 150 310 142 356 150',
      'M368 164 L369 232',
      'M214 214 C250 190 296 182 340 190',
    ],
  },
  lowFade: {
    tilt: -.5, light: 34,
    outer: 'M222 404 C200 382 180 332 176 282 C170 200 214 100 292 96 C366 92 410 132 416 180 C418 196 414 204 404 208',
    lower: LOWER,
    sides: 'fade',
    strands: [
      'M410 190 C402 150 372 122 330 110',
      'M396 200 C384 164 354 138 312 126 C280 118 250 124 226 142',
      'M380 206 C362 180 330 162 292 158 C258 156 228 170 208 196',
      'M354 214 C330 200 296 194 262 202',
      'M300 108 C320 100 344 102 362 110',
    ],
  },
  pompadour: {
    tilt: 2, light: 8,
    outer: 'M222 404 C204 394 184 350 178 290 C172 210 204 124 260 98 C298 78 340 56 384 54 C424 52 448 78 442 114 C438 146 422 172 408 192 L404 208',
    lower: LOWER,
    sides: 'tight',
    strands: [
      'M404 200 C428 160 440 110 414 76 C390 58 350 62 316 80',
      'M398 204 C420 164 428 118 404 88 C380 70 340 76 300 98 C262 118 232 150 212 194',
      'M390 206 C408 170 412 128 392 104 C368 86 330 94 294 116 C260 136 236 170 222 214',
      'M380 208 C394 178 394 144 378 124 C356 108 322 116 290 138',
      'M432 96 C436 120 430 146 418 170',
      'M360 60 C390 56 420 64 434 86',
    ],
  },
  buzz: {
    tilt: .5, light: 26,
    outer: 'M224 396 C204 386 186 350 180 298 C176 210 216 112 292 108 C356 106 400 142 408 200 L404 206',
    lower: LOWER_SHORT,
    sides: 'buzz',
    strands: [],
  },
};

export const STYLE_KEYS = Object.keys(STYLES);

export function hairPath(key) {
  const s = STYLES[key];
  return S(`${s.outer} ${s.lower}`);
}

/* SVG definicije za sekciju frizura (jednom u dokumentu) */
export const hairDefs = /* svg */ `
<defs>
  <linearGradient id="h-skin" x1="1" y1="0" x2="0" y2=".3">
    <stop offset="0" stop-color="#e6cba8"/>
    <stop offset=".45" stop-color="#cfae88"/>
    <stop offset="1" stop-color="#8c6848"/>
  </linearGradient>
  <radialGradient id="h-skin-hi" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#fff3dc" stop-opacity=".55"/>
    <stop offset="1" stop-color="#fff3dc" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="h-hair" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4d3223"/>
    <stop offset=".5" stop-color="#2c1b12"/>
    <stop offset="1" stop-color="#170e09"/>
  </linearGradient>
  <linearGradient id="h-wood" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2a180d"/>
    <stop offset=".45" stop-color="#8a5a33"/>
    <stop offset=".6" stop-color="#b08352"/>
    <stop offset="1" stop-color="#2a180d"/>
  </linearGradient>
  <pattern id="h-stipple" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
    <circle cx="1.5" cy="1.5" r=".8" fill="#140b06"/>
    <circle cx="4.5" cy="4.2" r=".7" fill="#140b06"/>
  </pattern>
  <linearGradient id="h-fade-g" gradientUnits="userSpaceOnUse" x1="0" y1="230" x2="0" y2="390">
    <stop offset="0" stop-color="#fff"/>
    <stop offset=".35" stop-color="#fff" stop-opacity=".75"/>
    <stop offset=".75" stop-color="#fff" stop-opacity=".18"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="h-tight-g" gradientUnits="userSpaceOnUse" x1="0" y1="220" x2="0" y2="400">
    <stop offset="0" stop-color="#fff"/>
    <stop offset=".5" stop-color="#fff" stop-opacity=".7"/>
    <stop offset="1" stop-color="#fff" stop-opacity=".45"/>
  </linearGradient>
  <mask id="h-mask-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="720"><rect width="600" height="720" fill="url(#h-fade-g)"/></mask>
  <mask id="h-mask-tight" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="720"><rect width="600" height="720" fill="url(#h-tight-g)"/></mask>
  <clipPath id="h-clip-new"><rect class="h-clip-new" x="0" y="0" width="600" height="720"/></clipPath>
  <clipPath id="h-clip-old"><rect class="h-clip-old" x="0" y="0" width="600" height="720"/></clipPath>
  <radialGradient id="h-spot" cx=".5" cy=".4" r=".55">
    <stop offset="0" stop-color="#f2b35e" stop-opacity=".35"/>
    <stop offset="1" stop-color="#f2b35e" stop-opacity="0"/>
  </radialGradient>
</defs>`;

export function hairGroup(key) {
  const s = STYLES[key];
  const d = hairPath(key);
  const mask = s.sides === 'fade' ? 'url(#h-mask-fade)' : s.sides === 'tight' || s.sides === 'short' ? 'url(#h-mask-tight)' : null;
  const buzz = s.sides === 'buzz';
  return /* svg */ `
    <g class="hair" data-style="${key}" ${mask ? `mask="${mask}"` : ''}>
      <path d="${d}" fill="url(#h-hair)" ${buzz ? 'opacity=".78"' : ''}/>
      ${buzz || s.sides !== 'solid' ? `<path d="${d}" fill="url(#h-stipple)" opacity="${buzz ? .45 : .4}"/>` : ''}
      <g fill="none" stroke-linecap="round">
        ${s.strands.map((p, i) => `<path d="${p}" stroke="${i % 2 ? '#7a5238' : '#0f0805'}" stroke-opacity="${i % 2 ? .55 : .5}" stroke-width="${i % 2 ? 1.6 : 2.2}"/>`).join('')}
      </g>
      ${s.part ? `<path d="${s.part}" fill="none" stroke="#c9a47c" stroke-width="2.4" stroke-opacity=".8" stroke-linecap="round"/>` : ''}
      ${buzz ? `<path d="${S(s.outer)}" fill="none" stroke="#0f0805" stroke-opacity=".35" stroke-width="1.5"/>` : ''}
    </g>`;
}

/* Glava (lutka) — bez kose */
export const mannequin = /* svg */ `
  <g class="mannequin">
    <!-- postolje -->
    <ellipse cx="284" cy="676" rx="150" ry="14" fill="#000" opacity=".45"/>
    <path d="M150 664 L418 664 L402 640 L166 640 Z" fill="url(#h-wood)"/>
    <rect x="150" y="662" width="268" height="10" fill="#1a0f08"/>
    <path d="M258 640 L310 640 L304 600 L264 600 Z" fill="url(#h-wood)"/>
    <rect x="248" y="592" width="72" height="10" rx="3" fill="#6d4520"/>
    <g class="head-tilt">
      <path d="${HEAD}" fill="url(#h-skin)"/>
      <ellipse class="skin-hi" cx="370" cy="300" rx="90" ry="140" fill="url(#h-skin-hi)"/>
      <path d="M236 580 C238 530 232 480 218 440 C240 470 270 490 300 494 C318 520 324 550 330 580 Z" fill="#6b4a32" opacity=".35"/>
      <path d="${EAR}" fill="#c9a37c"/>
      <path d="M270 282 C284 290 286 316 276 334" fill="none" stroke="#8c6848" stroke-width="3" stroke-linecap="round"/>
      <path d="M360 292 Q372 298 385 291" fill="none" stroke="#6b4a32" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M356 272 Q373 264 392 269" fill="none" stroke="#6b4a32" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
      <path d="M404 398 Q410 400 416 398" stroke="#8c6848" stroke-width="2"/>
      <path d="${HEAD}" fill="none" stroke="#3b2416" stroke-opacity=".35" stroke-width="2"/>
      <g class="hair-slot"></g>
    </g>
  </g>`;

/* Mašinica koja prelazi preko glave pri promeni frizure */
export const clipper = /* svg */ `
  <g class="h-clipper" transform="translate(-200 0)" aria-hidden="true">
    <g transform="rotate(90)">
      <path d="M-18 -60 Q-20 -76 0 -78 Q20 -76 18 -60 L22 40 Q22 58 0 60 Q-22 58 -22 40 Z" fill="#1d1a17"/>
      <rect x="-20" y="-88" width="40" height="12" rx="2" fill="#d9d2c6"/>
      <rect x="-8" y="-40" width="16" height="30" rx="4" fill="#b06f42"/>
    </g>
  </g>`;
