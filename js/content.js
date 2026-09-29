/* ==========================================================================
   BRIJAČNICA 1920 — CENTRALNI SADRŽAJ
   --------------------------------------------------------------------------
   Sve poslovne informacije sajta nalaze se u ovom fajlu. Ovo je KONCEPT:
   ime, adresa, cene, berberi, telefoni i linkovi su PRIMERI i moraju se
   zameniti pravim podacima klijenta pre objavljivanja.

   Oznaka  // PRIMER  = izmišljen sadržaj za prezentaciju, obavezno zameniti.
   Oznaka  // OPCIONO = može da ostane prazno (null / []) i sekcija se prilagodi.
   ========================================================================== */

export const content = {
  /* Kada je `true`, sajt prikazuje male oznake "primer sadržaja" kod cena,
     tima i kontakta, a zakazivanje radi u demo režimu. Za pravog klijenta: false. */
  demo: true,

  brand: {
    name: 'BRIJAČNICA 1920',            // PRIMER — privremeno ime
    wordmark: ['BRIJAČNICA', '1920'],   // dva reda znaka u navigaciji i na vratima
    logo: null,                          // OPCIONO — npr. 'images/logo.svg' (zamenjuje tekstualni znak)
    tagline: 'Šišanje · brada · brijanje britvom',
  },

  /* Boje sajta. Menjanjem ovih vrednosti menja se cela paleta. */
  theme: {
    walnut: '#241812',
    tobacco: '#5A3A24',
    oak: '#B08352',
    parchment: '#E8DCC4',
    copper: '#B06F42',
    olive: '#3B4130',
    amber: '#F2B35E',
    charcoal: '#16120F',
  },

  hero: {
    eyebrow: 'Berbernica · po zakazivanju',
    title: ['Sedni.', 'Ostalo je zanat.'],
    lead: 'Šišanje, brada i brijanje britvom, s dovoljno vremena da sve bude urađeno kako treba.',
    primary: 'Zakaži termin',
    secondary: 'Istraži berbernicu',
    hint: 'Pomeri miš po prostoriji ili skroluj',
    hintTouch: 'Dodirni predmete ili skroluj',
    /* Tačke u sceni: šta piše na etiketi i gde vodi klik. */
    hotspots: {
      mirror: { label: 'Pronađi svoj stil', target: '#stilovi' },
      tools:  { label: 'Naše usluge', target: '#usluge' },
      shelf:  { label: 'Upoznaj prostor', target: '#prostor' },
      chair:  { label: 'Tvoje mesto — zakaži', target: '#zakazivanje' },
    },
  },

  intro: {
    eyebrow: 'Kako radimo',
    title: 'Dobra frizura počinje razgovorom.',
    body: 'Pre nego što mašinica krene, pitamo kako nosiš kosu, koliko vremena imaš ujutru i šta ti je smetalo prošli put. Onda radimo polako i rezultat ti pokažemo iz svih uglova.',
    principles: [
      { title: 'Termin je tvoj', text: 'Šišanje traje onoliko koliko posao traži, a ne koliko je sledeći nestrpljiv.' },
      { title: 'Čist alat, sveže sečivo', text: 'Pribor se čisti posle svakog klijenta, a za svako brijanje ide novo sečivo.' },
      { title: 'Kažeš šta misliš', text: 'Ako nešto nije kako si zamislio, doterujemo odmah, dok si još u stolici.' },
    ],
  },

  /* ------------------------------------------------------------------------
     USLUGE I CENE — SVE CENE SU PRIMER I NISU PROVERENE.
     id se koristi u zakazivanju; frizure iz sekcije "stilovi" upućuju na njega.
     ------------------------------------------------------------------------ */
  currency: 'RSD',
  services: [
    { group: 'Kosa', items: [
      { id: 'sisanje', name: 'Muško šišanje', price: 1800, duration: 40, // PRIMER
        detail: 'Razgovor, pranje, šišanje makazama i mašinicom, stilizovanje i savet kako da frizuru održavaš kod kuće.' },
      { id: 'fade', name: 'Fade šišanje', price: 2000, duration: 45, // PRIMER
        detail: 'Postepeni prelaz mašinicom od kože do dužine na temenu, sa oštrim konturama oko ušiju i na vratu.' },
      { id: 'masinica', name: 'Mašinica, jedna dužina', price: 1000, duration: 20, // PRIMER
        detail: 'Jedna dužina po celoj glavi i čiste konture. Brzo i uredno.' },
      { id: 'decje', name: 'Dečje šišanje', note: 'do 12 godina', price: 1200, duration: 30, // PRIMER
        detail: 'Kraće i mirnije, uz pauzu kad zatreba.' },
    ]},
    { group: 'Brada i brijanje', items: [
      { id: 'brada', name: 'Oblikovanje brade', price: 1200, duration: 25, // PRIMER
        detail: 'Skraćivanje, oblikovanje linije obraza i vrata britvom, ulje za bradu.' },
      { id: 'brijanje', name: 'Tradicionalno brijanje', note: 'britva i topli peškir', price: 1800, duration: 35, // PRIMER
        detail: 'Topli peškir, pena nanesena četkom, dva prolaza britvom, hladan peškir i balzam.' },
    ]},
    { group: 'Paketi', items: [
      { id: 'kosa-brada', name: 'Šišanje i brada', price: 2700, duration: 60, featured: true, // PRIMER
        detail: 'Kompletno šišanje i oblikovanje brade u jednom terminu, uz topli peškir na kraju.' },
      { id: 'kompletno', name: 'Šišanje i brijanje', price: 3200, duration: 75, // PRIMER
        detail: 'Šišanje po izboru i tradicionalno brijanje britvom. Planiraj sat i četvrt.' },
    ]},
  ],
  servicesNote: 'Cene su primer za prezentaciju koncepta.', // prikazuje se samo kad je demo: true

  /* ------------------------------------------------------------------------
     FRIZURE — ilustracije su u js/art/hair-art.js (isti model, isti ugao).
     Da biste koristili fotografije: dodajte `image: 'images/stil-1.webp'`
     za SVE stilove (isti model, isto svetlo, isti kadar) — sekcija će
     automatski preći na fotografije.
     ------------------------------------------------------------------------ */
  styles: [
    { id: 'razdeljak', art: 'sidePart', name: 'Klasičan razdeljak', en: 'Classic side part',
      text: 'Uredna dužina na temenu, začešljana u stranu preko jasnog razdeljka. Strane kraće, ali ne do kože.',
      suits: 'Ovalno i četvrtasto lice, ravna ili blago talasasta kosa. Dobro stoji uz odelo i u kancelariji.',
      upkeep: 'Doterivanje na 4–5 nedelja', service: 'sisanje', image: null },
    { id: 'kratko-teksturisano', art: 'crop', name: 'Kratko teksturisano', en: 'Textured crop',
      text: 'Kratko teme sa isečenom teksturom i ravnim šiškama spuštenim na čelo. Strane idu kratko.',
      suits: 'Gusta kosa, visoko čelo ili razređena linija kose. Jutarnji stajling traje minut.',
      upkeep: 'Doterivanje na 3–4 nedelje', service: 'sisanje', image: null },
    { id: 'nizak-fade', art: 'lowFade', name: 'Nizak fade', en: 'Low fade',
      text: 'Prelaz od kože počinje nisko, iznad uha i na vratu, pa se postepeno podiže do prirodne dužine na temenu.',
      suits: 'Skoro svako lice. Dobar izbor ako želiš uredne strane bez previše kontrasta.',
      upkeep: 'Doterivanje na 2–3 nedelje', service: 'fade', image: null },
    { id: 'pompadur', art: 'pompadour', name: 'Pompadur', en: 'Pompadour',
      text: 'Volumen napred, podignut i začešljan unazad. Strane su kratke i priležu, a ceo oblik drži pomada.',
      suits: 'Okruglo lice kome treba visina i gusta kosa srednje dužine. Traži malo vežbe ujutru.',
      upkeep: 'Doterivanje na 3–4 nedelje', service: 'sisanje', image: null },
    { id: 'buzz', art: 'buzz', name: 'Kratko mašinicom', en: 'Buzz cut',
      text: 'Jedna kratka dužina po celoj glavi i čiste konture. Najmanje održavanja od svih.',
      suits: 'Izražene crte lica i pravilan oblik glave. Dobra opcija i kad kosa počne da se proređuje.',
      upkeep: 'Doterivanje na 2 nedelje', service: 'masinica', image: null },
  ],

  /* ------------------------------------------------------------------------
     PROSTOR — galerija. `src: null` prikazuje ilustrovani kadar iz scene
     sa oznakom koju fotografiju treba snimiti. Za pravu fotografiju:
     src: 'images/prostor-stolica.jpg' (+ opciono srcset).
     ------------------------------------------------------------------------ */
  gallery: [
    { id: 'prostor-stolica', title: 'Stolica', caption: 'Koža, hrom i oslonac za glavu, podešeni pre nego što sedneš.',
      shot: 'Berberska stolica iz 3/4 ugla, toplo bočno svetlo, ogledalo u pozadini van fokusa.', crop: 'chair', src: null, alt: '' },
    { id: 'prostor-ogledalo', title: 'Ogledalo', caption: 'Ovde vidiš svaki korak, a ne samo kraj.',
      shot: 'Ogledalo u drvenom ramu sa upaljenim sijalicama, bez ljudi, odraz prostorije.', crop: 'mirror', src: null, alt: '' },
    { id: 'prostor-alat', title: 'Alat', caption: 'Makaze, češljevi, britva. Očišćeni i složeni pred svaki termin.',
      shot: 'Detalj pulta odozgo: makaze, češalj, britva i mašinica na drvetu ili peškiru.', crop: 'tools', src: null, alt: '' },
    { id: 'prostor-svetlo', title: 'Svetlo', caption: 'Toplo svetlo, ali dovoljno jako da se vidi svaka linija.',
      shot: 'Viseće lampe ili sijalice izbliza, plitka dubina polja, topla boja.', crop: 'lamp', src: null, alt: '' },
    { id: 'prostor-polica', title: 'Polica', caption: 'Pomade, ulja i tonici koje i sami koristimo.',
      shot: 'Polica sa proizvodima, uredno složena, etikete okrenute ka kameri.', crop: 'shelf', src: null, alt: '' },
    { id: 'prostor-zavrsno', title: 'Završni detalj', caption: 'Topao peškir, malo tonika i pogled u ogledalo pozadi.',
      shot: 'Ruke berberina sa ručnim ogledalom ili peškirom, bez lica klijenta.', crop: 'counter', src: null, alt: '' },
  ],

  process: [
    { title: 'Izbor stila', text: 'Doneseš sliku, ideju ili samo osećaj da je vreme za promenu. I to je dovoljno.', icon: 'chart' },
    { title: 'Razgovor', text: 'Pogledamo oblik glave, pravac rasta kose i koliko vremena imaš ujutru. Tek onda biramo dužinu.', icon: 'comb' },
    { title: 'Šišanje ili brijanje', text: 'Makaze, mašinica ili britva, redom i bez žurbe. Topli peškir ide kad mu je vreme.', icon: 'scissors' },
    { title: 'Završni pogled', text: 'Ručno ogledalo iza glave, pa pogled sa svih strana. Ako treba, doterujemo na licu mesta.', icon: 'mirror' },
  ],

  /* ------------------------------------------------------------------------
     TIM — SVI UNOSI SU PLACEHOLDERI. Nema izmišljenih imena ni biografija.
     Radi sa jednim ili više berberina. photo: 'images/tim-1.jpg' (portret 4:5).
     ------------------------------------------------------------------------ */
  team: [
    { id: 'berberin-1', name: 'Ime i prezime', role: 'Berberin', placeholder: true, // PRIMER
      bio: 'Ovde ide nekoliko rečenica koje berberin sam napiše: čime se najviše bavi i kako voli da radi.',
      specialties: ['Specijalnost 1', 'Specijalnost 2'], photo: null, instagram: null },
    { id: 'berberin-2', name: 'Ime i prezime', role: 'Berberin', placeholder: true, // PRIMER
      bio: 'Kratak opis drugog berberina. Ako radi samo jedan berberin, obrišite ovaj unos i raspored se prilagođava sam.',
      specialties: ['Specijalnost 1', 'Specijalnost 2'], photo: null, instagram: null },
  ],

  /* ------------------------------------------------------------------------
     ZAKAZIVANJE
     mode: 'demo'     — prikazuje ceo tok, ali NIŠTA ne čuva (poštena poruka).
           'endpoint' — šalje POST JSON na `endpoint` (vidi js/components/booking.js → submitBooking).
           'external' — dugmad "Zakaži" vode na `externalUrl` (npr. Setmore, Fresha, Booksy…).
     ------------------------------------------------------------------------ */
  booking: {
    mode: 'demo',
    endpoint: null,            // npr. 'https://api.primer.rs/termini'
    externalUrl: null,         // PRIMER — npr. 'https://booksy.com/...'
    slotMinutes: 30,
    daysAhead: 14,
  },

  contact: {
    phone: '+381 60 000 0000',       // PRIMER — izmišljen broj
    phoneHref: '+381600000000',      // PRIMER
    whatsapp: '381600000000',        // PRIMER — bez + i razmaka; null da se sakrije
    viber: '381600000000',           // PRIMER — null da se sakrije
    email: 'zdravo@primer.rs',       // PRIMER
    address: {
      street: 'Ulica i broj',        // PRIMER — nije prava adresa
      city: 'Grad',                   // PRIMER
      postal: '00000',                // PRIMER
      note: 'Opis ulaza, npr. „ulaz iz dvorišta, pored pekare"', // PRIMER
    },
    mapsUrl: null,     // PRIMER — link ka Google mapi; dok je null, dugme za putanju je neaktivno
    mapEmbed: null,    // OPCIONO — src za <iframe> mape
    social: [          // PRIMER — href: null prikazuje oznaku umesto linka
      { name: 'Instagram', href: null },
      { name: 'Facebook', href: null },
      { name: 'TikTok', href: null },
    ],
  },

  /* Radno vreme: 0 = nedelja … 6 = subota. null = zatvoreno. PRIMER. */
  hours: {
    1: ['09:00', '20:00'],
    2: ['09:00', '20:00'],
    3: ['09:00', '20:00'],
    4: ['09:00', '20:00'],
    5: ['09:00', '20:00'],
    6: ['09:00', '16:00'],
    0: null,
  },

  footer: {
    farewell: 'Hvala što si svratio.',
    line: 'Vidimo se za tri, četiri nedelje.',
  },
};
