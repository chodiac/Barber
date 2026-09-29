/* ==========================================================================
   ZAKAZIVANJE — tok u pet koraka: usluga → berberin → dan i vreme →
   podaci → pregled. Radi u tri režima (content.booking.mode):
     'demo'     — prikazuje ceo tok, ništa ne čuva, i to jasno kaže
     'endpoint' — šalje zahtev na server (vidi submitBooking ispod)
     'external' — umesto forme vodi na spoljni sistem za zakazivanje
   ========================================================================== */
import { content } from '../content.js';
import { $, $$, esc, icon, price, mins, allServices, serviceById, bookingBus, motion, dayShort, toMin, demoTag } from '../lib.js';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/* ------------------------------------------------------------------------
   MESTO ZA POVEZIVANJE SA PRAVIM SISTEMOM ZA ZAKAZIVANJE
   Vraća { saved: true } samo ako je server potvrdio prijem zahteva.
   U demo režimu vraća { saved: false } i sajt NE prikazuje potvrdu.
   ------------------------------------------------------------------------ */
export async function submitBooking(data) {
  const b = content.booking;
  if (b.mode === 'endpoint' && b.endpoint) {
    const res = await fetch(b.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Server je vratio ${res.status}`);
    return { saved: true };
  }
  await new Promise((r) => setTimeout(r, 500)); // samo da demo izgleda kao pravi zahtev
  return { saved: false };
}

const contactButtons = () => {
  const c = content.contact;
  return `
    <a class="btn btn--ghost" href="tel:${esc(c.phoneHref)}">${icon('phone')} Pozovi</a>
    ${c.whatsapp ? `<a class="btn btn--ghost" href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">${icon('chat')} WhatsApp</a>` : ''}
    ${c.viber ? `<a class="btn btn--ghost" href="viber://chat?number=%2B${esc(c.viber)}">${icon('chat')} Viber</a>` : ''}`;
};

export function renderBooking() {
  const b = content.booking;
  const external = b.mode === 'external' && b.externalUrl;
  const team = content.team;
  $('#zakazivanje').innerHTML = `
  <div class="wrap booking__grid">
    <div class="booking__aside">
      <p class="label">Zakazivanje</p>
      <h2 id="booking-title" class="h2">Rezerviši stolicu</h2>
      <p class="lead">Izaberi uslugu, dan i vreme. Ceo postupak traje manje od minuta.</p>
      ${b.mode === 'demo' ? `<p class="booking__demo">${demoTag('demo')} <span>Ovo je pregled toka zakazivanja. Termini se još ne čuvaju.</span></p>` : ''}
      <div class="booking__alt">
        <p>Radije bi da se čujemo?</p>
        <div class="booking__alt-btns">${contactButtons()}</div>
        ${b.externalUrl && !external ? `<a class="link-arrow" href="${esc(b.externalUrl)}" target="_blank" rel="noopener">Zakaži preko spoljnog sistema ${icon('ext')}</a>` : ''}
      </div>
    </div>

    ${external ? `
    <div class="ticket ticket--external">
      <h3>Termini se zakazuju online</h3>
      <p>Otvoriće se stranica sistema za zakazivanje u novom prozoru.</p>
      <a class="btn" href="${esc(b.externalUrl)}" target="_blank" rel="noopener">Otvori zakazivanje ${icon('ext')}</a>
    </div>` : `
    <form class="ticket" novalidate data-ticket aria-describedby="ticket-status">
      <div class="ticket__top">
        <span class="ticket__stub" aria-hidden="true">${esc(content.brand.name)}</span>
        <ol class="ticket__steps" aria-label="Koraci zakazivanja"></ol>
      </div>

      <fieldset data-step="usluga">
        <legend>Šta radimo?</legend>
        <div class="style-chip" data-style-chip hidden></div>
        <div class="opts opts--services">
          ${allServices().map((s) => `
            <label class="opt">
              <input type="radio" name="service" value="${s.id}">
              <span class="opt__body">
                <span class="opt__name">${esc(s.name)}</span>
                <span class="opt__meta">${mins(s.duration)} · ${price(s.price)}</span>
              </span>
            </label>`).join('')}
        </div>
        <p class="field-error" data-err="service" role="alert"></p>
      </fieldset>

      ${team.length ? `
      <fieldset data-step="berberin" hidden>
        <legend>Kod koga? <span class="optional">nije obavezno</span></legend>
        <div class="opts opts--barbers">
          <label class="opt"><input type="radio" name="barber" value="any" checked><span class="opt__body"><span class="opt__name">Prvi slobodan</span><span class="opt__meta">najviše termina</span></span></label>
          ${team.map((t) => `<label class="opt"><input type="radio" name="barber" value="${esc(t.id)}"><span class="opt__body"><span class="opt__name">${esc(t.name)}</span><span class="opt__meta">${esc(t.role)}</span></span></label>`).join('')}
        </div>
      </fieldset>` : ''}

      <fieldset data-step="termin" hidden>
        <legend>Kada?</legend>
        <div class="days" data-days role="radiogroup" aria-label="Dan"></div>
        <p class="field-error" data-err="date" role="alert"></p>
        <div class="times" data-times aria-live="polite"></div>
        <p class="field-error" data-err="time" role="alert"></p>
        ${content.demo ? `<p class="hint-small">${demoTag('primer')} Termini se računaju iz radnog vremena. Pravu zauzetost daje sistem za zakazivanje.</p>` : ''}
      </fieldset>

      <fieldset data-step="podaci" hidden>
        <legend>Kome da javimo?</legend>
        <div class="field">
          <label for="bk-name">Ime</label>
          <input id="bk-name" name="name" type="text" autocomplete="given-name" required aria-describedby="err-name">
          <p class="field-error" id="err-name" data-err="name" role="alert"></p>
        </div>
        <div class="field">
          <label for="bk-phone">Broj telefona</label>
          <input id="bk-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="06x xxx xxxx" required aria-describedby="err-phone">
          <p class="field-error" id="err-phone" data-err="phone" role="alert"></p>
        </div>
        <div class="field">
          <label for="bk-note">Napomena <span class="optional">nije obavezno</span></label>
          <textarea id="bk-note" name="note" rows="3" placeholder="Npr. želim kraće sa strane nego prošli put"></textarea>
        </div>
      </fieldset>

      <fieldset data-step="pregled" hidden>
        <legend>Proveri pa pošalji</legend>
        <dl class="summary" data-summary></dl>
      </fieldset>

      <div class="ticket__nav">
        <button type="button" class="btn btn--ghost" data-back>${icon('left')} Nazad</button>
        <button type="button" class="btn" data-next>Dalje ${icon('arrow')}</button>
        <button type="submit" class="btn" data-submit hidden>${b.mode === 'demo' ? 'Završi pregled' : 'Pošalji zahtev'} ${icon('check')}</button>
      </div>

      <div class="ticket__result" data-result hidden tabindex="-1" id="ticket-status"></div>
    </form>`}
  </div>`;
}

export function initBooking() {
  const form = $('[data-ticket]');
  if (!form) return;
  const hours = content.hours;
  const steps = $$('fieldset[data-step]', form);
  const stepNames = { usluga: 'Usluga', berberin: 'Berberin', termin: 'Termin', podaci: 'Podaci', pregled: 'Pregled' };
  const stepList = $('.ticket__steps', form);
  const btnBack = $('[data-back]', form), btnNext = $('[data-next]', form), btnSubmit = $('[data-submit]', form);
  const state = { service: null, style: null, barber: 'any', date: null, time: null };
  let idx = 0;

  stepList.innerHTML = steps.map((f, i) => `<li><button type="button" data-goto="${i}" disabled><span>${i + 1}</span> ${stepNames[f.dataset.step]}</button></li>`).join('');
  const gotoBtns = $$('[data-goto]', stepList);

  /* ---- dani ---- */
  const days = $('[data-days]', form);
  const today = new Date();
  const list = [];
  for (let i = 0; i < content.booking.daysAhead; i++) { const d = new Date(today); d.setDate(today.getDate() + i); list.push(d); }
  days.innerHTML = list.map((d, i) => {
    const h = hours[d.getDay()];
    const label = i === 0 ? 'Danas' : i === 1 ? 'Sutra' : dayShort[d.getDay()];
    return `<button type="button" class="day" role="radio" aria-checked="false" data-date="${iso(d)}" ${h ? '' : 'disabled'}
      aria-label="${label}, ${d.getDate()}. ${MONTHS[d.getMonth()]}${h ? '' : ', zatvoreno'}">
      <span class="day__w">${label}</span><span class="day__d">${d.getDate()}</span><span class="day__m">${h ? MONTHS[d.getMonth()] : 'zatv.'}</span>
    </button>`;
  }).join('');
  days.addEventListener('click', (e) => {
    const b = e.target.closest('.day'); if (!b || b.disabled) return;
    state.date = b.dataset.date; state.time = null;
    $$('.day', days).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    renderTimes(); clearErr('date');
  });

  /* ---- vremena ---- */
  const times = $('[data-times]', form);
  function slotsFor(dateStr) {
    const d = fromIso(dateStr); const h = hours[d.getDay()]; if (!h) return [];
    const dur = serviceById(state.service)?.duration || 30;
    const out = []; const step = content.booking.slotMinutes;
    const isToday = dateStr === iso(new Date());
    const nowM = new Date().getHours() * 60 + new Date().getMinutes() + 30;
    for (let m = toMin(h[0]); m + dur <= toMin(h[1]); m += step) if (!isToday || m >= nowM) out.push(m);
    return out;
  }
  function renderTimes() {
    if (!state.date) { times.innerHTML = '<p class="times__empty">Prvo izaberi dan.</p>'; return; }
    const s = slotsFor(state.date);
    if (!s.length) { times.innerHTML = '<p class="times__empty">Za taj dan više nema termina. Izaberi drugi dan.</p>'; return; }
    const group = (title, arr) => arr.length ? `<div class="times__group"><p class="times__label">${title}</p><div class="times__row" role="radiogroup" aria-label="${title}">
      ${arr.map((m) => `<button type="button" class="time" role="radio" aria-checked="${state.time === hm(m)}" data-time="${hm(m)}">${hm(m)}</button>`).join('')}</div></div>` : '';
    times.innerHTML = group('Pre podne', s.filter((m) => m < 720)) + group('Posle podne', s.filter((m) => m >= 720));
  }
  times.addEventListener('click', (e) => {
    const b = e.target.closest('.time'); if (!b) return;
    state.time = b.dataset.time;
    $$('.time', times).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    clearErr('time');
  });
  // strelice unutar grupa radio-dugmadi (dani i vremena)
  form.addEventListener('keydown', (e) => {
    const b = e.target.closest('.day, .time'); if (!b) return;
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
    e.preventDefault();
    const all = $$(b.classList.contains('day') ? '.day:not(:disabled)' : '.time', form);
    const n = all[(all.indexOf(b) + k + all.length) % all.length]; n.focus(); n.click();
  });

  /* ---- izbor usluge / frizure ---- */
  const chip = $('[data-style-chip]', form);
  function renderChip() {
    chip.hidden = !state.style;
    if (state.style) chip.innerHTML = `<span>Frizura: <strong>${esc(state.style)}</strong></span><button type="button" aria-label="Ukloni izabranu frizuru">${icon('close')}</button>`;
  }
  chip.addEventListener('click', (e) => { if (e.target.closest('button')) { state.style = null; renderChip(); } });
  form.addEventListener('change', (e) => {
    if (e.target.name === 'service') { state.service = e.target.value; clearErr('service'); if (state.date) renderTimes(); }
    if (e.target.name === 'barber') state.barber = e.target.value;
  });

  /* ---- greške ---- */
  const err = (k, msg) => { const el = $(`[data-err="${k}"]`, form); if (el) el.textContent = msg; const inp = form.elements[k]; if (inp && inp.setAttribute) inp.setAttribute('aria-invalid', 'true'); };
  const clearErr = (k) => { const el = $(`[data-err="${k}"]`, form); if (el) el.textContent = ''; const inp = form.elements[k]; if (inp && inp.removeAttribute) inp.removeAttribute('aria-invalid'); };
  ['name', 'phone'].forEach((k) => form.elements[k].addEventListener('input', () => clearErr(k)));

  function validate(i) {
    const name = steps[i].dataset.step;
    if (name === 'usluga' && !state.service) { err('service', 'Izaberi uslugu da bismo znali koliko vremena da rezervišemo.'); return false; }
    if (name === 'termin') {
      if (!state.date) { err('date', 'Izaberi dan.'); return false; }
      if (!state.time) { err('time', 'Izaberi vreme.'); return false; }
    }
    if (name === 'podaci') {
      let ok = true;
      const nm = form.elements.name.value.trim(); const ph = form.elements.phone.value.trim();
      if (nm.length < 2) { err('name', 'Upiši ime (bar dva slova).'); ok = false; }
      if (!/^\+?[\d\s/-]{8,}$/.test(ph)) { err('phone', 'Upiši broj telefona, npr. 064 123 4567.'); ok = false; }
      if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return false; }
    }
    return true;
  }

  function summary() {
    const s = serviceById(state.service);
    const barber = state.barber === 'any' ? 'Prvi slobodan' : content.team.find((t) => t.id === state.barber)?.name;
    const d = fromIso(state.date);
    const rows = [
      ['Usluga', `${s.name} · ${mins(s.duration)} · ${price(s.price)}`],
      state.style && ['Frizura', state.style],
      content.team.length && ['Berberin', barber],
      ['Termin', `${dayShort[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} u ${state.time}`],
      ['Ime', form.elements.name.value.trim()],
      ['Telefon', form.elements.phone.value.trim()],
      form.elements.note.value.trim() && ['Napomena', form.elements.note.value.trim()],
    ].filter(Boolean);
    $('[data-summary]', form).innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  }

  /* ---- koraci ---- */
  function show(i, dir = 1) {
    const prev = steps[idx];
    idx = i;
    const f = steps[i];
    if (f.dataset.step === 'pregled') summary();
    if (f.dataset.step === 'termin') renderTimes();
    steps.forEach((s) => { s.hidden = s !== f; });
    btnBack.style.visibility = i === 0 ? 'hidden' : 'visible';
    btnNext.hidden = i === steps.length - 1;
    btnSubmit.hidden = i !== steps.length - 1;
    gotoBtns.forEach((b, k) => { b.disabled = k > i; b.closest('li').classList.toggle('is-done', k < i); b.closest('li').classList.toggle('is-current', k === i); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    if (motion.full && prev !== f) window.gsap.fromTo(f, { x: 30 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
  }
  btnNext.addEventListener('click', () => { if (validate(idx)) { show(idx + 1, 1); focusStep(); } });
  btnBack.addEventListener('click', () => { show(idx - 1, -1); focusStep(); });
  stepList.addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b && !b.disabled) { show(+b.dataset.goto, -1); focusStep(); } });
  function focusStep() { const l = $('legend', steps[idx]); l.tabIndex = -1; l.focus({ preventScroll: true }); }

  /* ---- slanje ---- */
  const result = $('[data-result]', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    for (let i = 0; i < steps.length; i++) if (!validate(i)) { show(i); return; }
    btnSubmit.disabled = true; btnSubmit.textContent = 'Šaljem…';
    const data = {
      serviceId: state.service, style: state.style, barberId: state.barber, date: state.date, time: state.time,
      name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), note: form.elements.note.value.trim(),
    };
    let html;
    try {
      const r = await submitBooking(data);
      html = r.saved
        ? `<p class="result__eyebrow">${icon('check')} Zahtev je poslat</p><h3>Javljamo se uskoro.</h3><p>Termin važi kada ga potvrdimo porukom na ${esc(data.phone)}.</p>`
        : `<p class="result__eyebrow">Pregled toka zakazivanja</p><h3>Termin nije sačuvan.</h3><p>Ovo je demo verzija sajta i zahtev nije nikome poslat. Kada se poveže sistem za zakazivanje, ovde će stajati potvrda prijema. Za pravi termin pozovi ili pošalji poruku.</p>`;
    } catch (ex) {
      html = `<p class="result__eyebrow">Zahtev nije poslat</p><h3>Veza sa sistemom nije uspela.</h3><p>Pokušaj ponovo za minut ili nas pozovi. Tvoji podaci su i dalje u formi.</p>`;
    }
    result.innerHTML = `${html}<div class="result__btns">${contactButtons()}<button type="button" class="btn btn--small" data-restart>Počni ispočetka</button></div>`;
    result.hidden = false;
    steps.forEach((s) => { s.hidden = true; });
    $('.ticket__nav', form).hidden = true;
    result.focus();
    btnSubmit.disabled = false; btnSubmit.innerHTML = `${content.booking.mode === 'demo' ? 'Završi pregled' : 'Pošalji zahtev'} ${icon('check')}`;
  });
  result.addEventListener('click', (e) => {
    if (!e.target.closest('[data-restart]')) return;
    result.hidden = true; $('.ticket__nav', form).hidden = false;
    show(0, -1); focusStep();
  });

  /* ---- izbor sa drugih mesta na sajtu (cenovnik, frizure, tim) ---- */
  bookingBus.addEventListener('preselect', (e) => {
    const { service, style, barber } = e.detail;
    if (!result.hidden) { result.hidden = true; $('.ticket__nav', form).hidden = false; }
    if (service) { state.service = service; const r = form.querySelector(`input[name="service"][value="${service}"]`); if (r) r.checked = true; clearErr('service'); }
    if (style !== undefined) state.style = style || null; else if (service) state.style = null;
    if (barber) { state.barber = barber; const r = form.querySelector(`input[name="barber"][value="${barber}"]`); if (r) r.checked = true; }
    renderChip();
    const at = (n) => steps.findIndex((s) => s.dataset.step === n);
    show(state.service ? Math.max(0, at(content.team.length && !barber ? 'berberin' : 'termin')) : 0);
  });

  renderTimes();
  show(0);
}
