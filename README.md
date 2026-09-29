# BRIJAČNICA 1920 — koncept sajta berbernice

This is a concept site for a fictional barbershop. **None of the business data is real.** The name, address, prices, team and contact details are sample content and must be replaced before the site is shown as a real business.

## Running locally

```
python tools/serve.py 5190
```
Then open `http://localhost:5190/`. It is also registered in `D:\CLAUDE\.claude\launch.json` as `brijacnica-1920`.

Dev flags:
- `?motion=full` / `?motion=reduce` override `prefers-reduced-motion`
- `?team=1` previews the one-barber layout
- `tools/hair-sheet.html` shows all five hairstyles side by side

## Stack and why

- **Plain HTML, CSS and ES modules, no build step.** The site is small, loads fast, and runs on any static host (Netlify, GitHub Pages, cPanel). A future developer can edit it without a toolchain.
- **GSAP 3.13 + ScrollTrigger** (cdnjs, about 40 KB gzipped) handle the scroll-scrubbed scenes: the camera push into the mirror, the pinned hairstyle section, the horizontal gallery, the process path and the turning chair. No other animation library is used. Smooth scrolling stays native, so the page never fights the user.
- **All artwork is inline SVG:** the room scene, the mannequin and the chair. There are no heavy images and no 3D renderer. The hero is 5 layers with a small pointer parallax that runs only while the scene is visible and stops when it settles.
- If GSAP doesn't load, or the visitor prefers reduced motion, every section works in a static mode: no pinning, instant hairstyle swaps, and a gallery you can swipe.

## Structure

```
index.html                 section shells + CDN scripts
css/base.css               tokens, typography, buttons, navigation, mobile bar
css/hero.css               scene, hotspots, entry door
css/sections.css           intro, price list, hairstyles, gallery, process, team, chair bridge
css/booking.css            booking, contact, footer
js/content.js              ← ALL business content and brand colours
js/main.js                 start-up: theme, render, interactions
js/lib.js                  helpers (prices, hours, scrolling, booking state)
js/art/scene-art.js        barbershop scene (layers + gallery crops)
js/art/hair-art.js         mannequin + 5 hair shapes
js/components/*.js         one module per section (render + init)
```

## Booking

`content.booking.mode`:
- `'demo'` (current): shows the full flow. At the end it says **the appointment was not saved**. It never shows a false confirmation.
- `'endpoint'`: sends a POST with JSON to `booking.endpoint`. The integration point is `submitBooking()` in `js/components/booking.js`. After a successful response the site says "request sent" (not "confirmed").
- `'external'`: every "Zakaži" button opens `booking.externalUrl` (Booksy, Fresha, Setmore…) in a new window.

Phone, WhatsApp and Viber are always offered as alternatives (`content.contact`). Set any of them to `null` to hide it.

The available times are calculated only from working hours. Real availability has to come from the booking system.

## Checklist before showing it to a real client

### Business details (everything in `js/content.js`)
| What | Where | Current state |
|---|---|---|
| Brand name, wordmark, logo | `brand` | "BRIJAČNICA 1920", temporary name, no logo |
| Colours | `theme` | proposed palette |
| Prices and durations | `services[].price / duration` | **sample**, marked `// PRIMER` |
| Descriptions of services | `services[].detail` | sample |
| Barbers (name, bio, specialties, photo) | `team` | **placeholders**; delete an entry and the layout adapts |
| Phone, WhatsApp, Viber, email | `contact` | invented numbers `+381 60 000 0000`, `zdravo@primer.rs` |
| Address and directions | `contact.address`, `mapsUrl`, `mapEmbed` | "Ulica i broj, Grad"; no map pin on purpose |
| Social media | `contact.social[].href` | `null` (shown struck through) |
| Working hours | `hours` | sample: Mon–Fri 09–20, Sat 09–16 |
| Booking method | `booking` | `demo` |
| Demo labels | `demo: true` | set to `false` once the data is real |

Also check the texts in `hero`, `intro`, `process` and `footer`. They are written as the shop's voice, and the client should approve them. The "1920" in the name must not be read as a founding year. Nowhere does the site say "since 1920".

### Images (with none, the site uses the illustrated scene)
| File (`images/`) | Where | Brief |
|---|---|---|
| `prostor-stolica.jpg` | gallery | barber chair at 3/4 angle, warm side light, mirror out of focus |
| `prostor-ogledalo.jpg` | gallery | wood-framed mirror with lit bulbs, no people |
| `prostor-alat.jpg` | gallery | counter detail from above: scissors, comb, razor, clipper |
| `prostor-svetlo.jpg` | gallery | pendant lamps or bulbs close up, warm light |
| `prostor-polica.jpg` | gallery | product shelf, labels facing the camera |
| `prostor-zavrsno.jpg` | gallery | barber's hands with a hand mirror or towel, no client face |
| `tim-1.jpg`, `tim-2.jpg` … | team | portrait 4:5, same light and background for everyone |
| `stil-1.webp` … `stil-5.webp` | hairstyles (optional) | **the same model, same angle (profile), same light and crop** for all 5 styles |

How to switch images on:
- gallery: `gallery[].src` (optionally `srcset`, `alt`)
- team: `team[].photo`
- hairstyles: `styles[].image` for **all five**. Until every style has one, the section stays on the illustration, so it never mixes people.

Recommended export: JPEG/WebP, 1600 px on the long side for the gallery, 900×1125 for portraits.

### Hero scene
The entrance scene is an illustration made of layers (`js/art/scene-art.js`). It can stay as the brand's visual signature. If the client wants photography instead, the layers are replaced with separate PNG/WebP layers of the real interior (wall, mirror, counter, chair, foreground) shot from a tripod in one position. The anchor coordinates of the hotspots are in `ANCHORS`.

## Checks performed
- Desktop (1345×1320 and 1440×900) and mobile (375×812), full and reduced motion
- The whole booking flow: validation, keyboard, pre-selection from the price list, hairstyles and team, the honest demo ending
- Hairstyle tabs with arrow keys, swipe on mobile, mobile menu with focus trap
- No errors in the console
