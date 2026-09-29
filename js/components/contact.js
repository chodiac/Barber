/* LOKACIJA I KONTAKT + FOOTER */
import { content } from '../content.js';
import { $, esc, icon, dayNames, openStatus, demoTag, bookingHref } from '../lib.js';
import { brandMark } from './nav.js';

const ORDER = [1, 2, 3, 4, 5, 6, 0];

function hoursRows() {
  const today = new Date().getDay();
  return ORDER.map((d) => {
    const h = content.hours[d];
    return `<div class="hours__row${d === today ? ' is-today' : ''}"><dt>${dayNames[d]}${d === today ? ' <span class="today">danas</span>' : ''}</dt><dd>${h ? `${h[0]}–${h[1]}` : 'zatvoreno'}</dd></div>`;
  }).join('');
}

const mapArt = /* svg */ `
<svg class="map__art" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="600" height="460" fill="#d9ccb1"/>
  <g stroke="#c4b595" stroke-width="1">${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 36} L600 ${i * 36 - 60}"/>`).join('')}</g>
  <path d="M-20 300 C120 280 200 330 320 300 S520 240 640 260" stroke="#b9c4bb" stroke-width="26" fill="none"/>
  <g stroke="#f3ead8" stroke-linecap="round" fill="none">
    <path d="M-10 120 L620 170" stroke-width="18"/>
    <path d="M160 -10 L230 480" stroke-width="14"/>
    <path d="M420 -10 L380 480" stroke-width="22"/>
    <path d="M-10 400 L620 360" stroke-width="10"/>
    <path d="M230 150 L400 146" stroke-width="8"/>
  </g>
  <g fill="#cbbd9e">${[[40, 20, 90, 70], [250, 20, 120, 90], [460, 30, 110, 100], [40, 190, 100, 70], [250, 190, 100, 60], [460, 200, 110, 50], [60, 330, 70, 40], [250, 330, 90, 40], [470, 300, 100, 40]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`).join('')}</g>
</svg>`;

export function renderContact() {
  const c = content.contact; const a = c.address;
  const st = openStatus();
  $('#kontakt').innerHTML = `
  <div class="wrap contact__grid">
    <div class="contact__info">
      <p class="label">Lokacija i kontakt</p>
      <h2 id="contact-title" class="h2">Svrati.</h2>
      <address class="contact__address">
        <span class="contact__street">${esc(a.street)}</span>
        <span>${esc(a.postal)} ${esc(a.city)}</span>
        ${a.note ? `<span class="contact__note">${esc(a.note)}</span>` : ''}
        ${demoTag('primer adrese')}
      </address>

      <div class="contact__actions">
        <a class="btn" href="tel:${esc(c.phoneHref)}">${icon('phone')} ${esc(c.phone)}</a>
        ${c.whatsapp ? `<a class="btn btn--ghost" href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">${icon('chat')} WhatsApp</a>` : ''}
        ${c.mapsUrl
          ? `<a class="btn btn--ghost" href="${esc(c.mapsUrl)}" target="_blank" rel="noopener">${icon('pin')} Putanja</a>`
          : `<span class="btn btn--ghost" aria-disabled="true" title="Dodaje se kada adresa bude poznata">${icon('pin')} Putanja</span>`}
      </div>

      <div class="hours">
        <div class="hours__head">
          <h3>Radno vreme</h3>
          <span class="status ${st.open ? 'is-open' : ''}">${esc(st.text)}</span>
        </div>
        <dl>${hoursRows()}</dl>
        ${demoTag('primer radnog vremena')}
      </div>

      <p class="contact__mail"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>
      <ul class="socials">${c.social.map((s) => `<li>${s.href ? `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : `<span title="Link još nije dodat">${esc(s.name)}</span>`}</li>`).join('')}</ul>
    </div>

    <div class="map">
      ${c.mapEmbed
        ? `<iframe src="${esc(c.mapEmbed)}" title="Mapa: ${esc(a.street)}, ${esc(a.city)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        : `${mapArt}<div class="map__note"><span class="demo-tag">mapa · placeholder</span><p>Ovde ide mapa sa tačnom lokacijom.</p><p class="map__small">Izmišljena adresa namerno nema oznaku na mapi.</p></div>`}
    </div>
  </div>`;
}

export function renderFooter() {
  const c = content.contact; const st = openStatus();
  $('#footer-root').innerHTML = `
  <div class="wrap footer__top">
    <div class="footer__bye">
      <div class="sign ${st.open ? 'is-open' : ''}" aria-label="${esc(st.text)}">
        <span class="sign__string" aria-hidden="true"></span>
        <span class="sign__plate"><span class="sign__face">${st.open ? 'Otvoreno' : 'Zatvoreno'}</span></span>
      </div>
      <p class="footer__farewell">${esc(content.footer.farewell)}</p>
      <p class="footer__line">${esc(content.footer.line)}</p>
      <a class="btn" href="${bookingHref()}" data-book>Zakaži sledeći termin ${icon('arrow')}</a>
    </div>
    <div class="footer__cols">
      <nav aria-label="Podnožje">
        <h3>Sajt</h3>
        <ul>
          <li><a href="#usluge">Usluge i cene</a></li><li><a href="#stilovi">Frizure</a></li>
          <li><a href="#prostor">Prostor</a></li><li><a href="#tim">Tim</a></li><li><a href="#zakazivanje">Zakazivanje</a></li>
        </ul>
      </nav>
      <div>
        <h3>Kontakt</h3>
        <ul>
          <li><a href="tel:${esc(c.phoneHref)}">${esc(c.phone)}</a></li>
          <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
          <li>${esc(c.address.street)}, ${esc(c.address.city)}</li>
        </ul>
      </div>
      <div>
        <h3>Mreže</h3>
        <ul>${c.social.map((s) => `<li>${s.href ? `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}</li>`).join('')}</ul>
      </div>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <a class="brand" href="#pocetak" aria-label="Na početak">${brandMark()}</a>
    <p>${content.demo ? 'Koncept sajta. Ime, cene, tim i kontakt podaci su primer sadržaja.' : `© ${new Date().getFullYear()} ${esc(content.brand.name)}`}</p>
  </div>`;
}
