# Changes

Running log of changes both Yair and Rivka push to this repo. Newest on top.

---

## 2026-05-08 — SEO foundations + photo overhaul + repetitions cleanup (Rivka)
**By:** Rivka

**SEO improvements (in preparation for Google Search Console submission):**
- `sitemap.xml` rewritten with `lastmod` dates + `image:image` extensions for each URL — makes Google Image search aware of hero photos.
- `LodgingBusiness` JSON-LD on `index.html` significantly expanded: added `geo` (latitude/longitude 6.30363, 80.8581), `hasMap` link, `streetAddress` + `postalCode`, `petsAllowed`, `knowsLanguage` (en/si), `currenciesAccepted` (LKR/USD), `paymentAccepted`, plus 5 new `amenityFeature` entries (open-air bathroom, kayaks, airport pickup, Udawalawe safari, full board on request) — total 12 amenities up from 7.
- `sameAs` on the schema expanded from 2 (Facebook, Instagram) to 6 (added TripAdvisor, Booking.com, Agoda, Airbnb listing URLs) — consolidates business identity across the web for Google's knowledge graph.
- Multiple images on the schema (hero, cottage-veranda, farm-wide) instead of one.
- IndexNow API key file added at root: `a3f9c2d8b7e1f4602951836c4d5e7a8b.txt`. After push, can ping Bing/Yandex/Naver via api.indexnow.org for instant indexing.

**Photos — major overhaul:**
- Food slider rebuilt with 8 new high-quality shots from Rivka's "ארוחות" folder: Sri Lankan breakfast (eggs/dal/sambol), red juice, hoppers + chutney, Sri Lankan dinner (fish + rice + sambol), toast with hand reaching, green juice + hopper + garden, fresh fruits at shared table, papaya. Kept generic coffee + jam/butter shots out (per Rivka's call — not Sri Lankan enough).
- Itinerary Day 1: switched to `lake-gazebo.jpg` (new, atmospheric gazebo over the lake). Day 2: `lake-wide.jpg` (new, wide lake with island). Day 3: `food-breakfast-table.jpg` (new, Sri Lankan breakfast spread with hoppers + tea + garden behind).
- Farm Lake slider: replaced `cottage-veranda` and `kayak` (which appeared on multiple pages) with `lake-gazebo`, `lake-branch`, `lake-wide`, `kayaks-rack` — now 6 unique lake-themed slides instead of 4 with repetitions.
- Cottages exterior slider: 2 new shots inserted (`cottage-palms`, `cottage-brick-veranda`) — total 7 slides, interleaved wide ↔ close.
- Removed 4× and 3× repetitions across pages: `cottage-veranda` was on 3 pages; `kayak` was on 3; `food-fruits` was twice on the same page. All resolved.

**Reviews carousel:**
- Added 2 new quotes from Aji's Airbnb listing: Donovan ("This is the best place I've ever visited, I've already started planning my next visit") and Maxime, Paris ("Had we known, we would have extended our stay" — loss-aversion classic). Now 8 quotes total instead of 6.

**Sri Lankan emphasis (per Rivka's request):**
- Food section heading rewritten: "Traditional Sri Lankan, Every Day."
- Body copy emphasizes "real, traditional Sri Lankan home cooking" with explicit dishes: hoppers, dal, sambol, fish curry.
- Hero + rooms price-line copy: "Traditional Sri Lankan breakfast included · full board available/on request" (without the price number — Rivka decided to hold off on showing rates publicly until confirmed with Aji; the actual quoted rate is 15,000 LKR/night).

**Mobile layout fixes:**
- Itinerary "Three days at the farm" — converted to horizontal scroll-snap on mobile (3 cards stacked → 1 card visible + peek of next, swipe). Section dropped from 1278px to 647px.
- Explore "From the Farm" — same horizontal-scroll pattern. Dropped from 1296px to 555px.
- Itinerary on desktop: aspect-ratio changed from 4/5 (tall portrait) to 3/2 (landscape) so cards fit in one viewport. Section dropped from 841px to 573px.
- Find Us section: getting-here block compacted from 4 lines to 3, date-picker inputs from 44px to 40px height, reply note + direct-text combined into one line. Section dropped from 1042px to 923px on mobile.

**Files:** `index.html`, `rooms.html`, `farm.html`, `style.css`, `script.js`, `sitemap.xml`, `a3f9c2d8b7e1f4602951836c4d5e7a8b.txt`, plus 11 new photos in `photos/` (cottage-palms, cottage-brick-veranda, lake-gazebo, lake-branch, lake-wide, kayaks-rack, food-breakfast, food-juice-red, food-dinner, food-juice-green, food-toast, food-papaya-fresh, food-hoppers-new, food-fruits-bowl, food-breakfast-table) and 2 deletions (food-coffee, food-jam, food-fruit-plate).

---

## 2026-05-08 — pre-launch UX pass: psychology + tech (Rivka)
**By:** Rivka

**5 UX ideas (psychology + research-backed):**
- **Date-aware WhatsApp picker** in Find Us — three light inputs (arrival, nights, guests) build a tailored WA message so Aji doesn't have to ask "when?". Anchoring + commitment.
- **Aji's story** on the homepage — replaced the generic "20 years of building" paragraph with a crisis-arc version: *"By 2018, Ajith's farm was ranked Sri Lanka's #1 commercial fruit farm. Then 2020 came, and the orchard nearly broke him. He didn't sell."* Authority + narrative transportation.
- **Social proof density** — rewrote the rating line to lead with "60+ guests · 5.0 across Airbnb, Booking & Tripadvisor"; added "Recent guests from Germany · France · Japan · Netherlands"; planted a micro-quote ("Like in the Garden of Eden" — Ronald & Anni) inside the Setting section so social proof appears throughout the page, not only in the testimonial carousel.
- **"Three days at the farm" itinerary** — new section 05 between Setting and Food. Three cards (Day 1: Arrive at sunset / Day 2: Dawn on the lake / Day 3: Slow morning) with portrait photos + day badges. Narrative transportation + endowment effect ("your weekend").
- **Same-day reply signal** — every WhatsApp CTA now reads *"Aji usually replies the same day — a question is welcome too"*. Updates the floating-WA tooltip on all 4 pages, the contact-section helper, and the book-cta copy on rooms/farm/story. Reduces commitment friction.

**Bonuses:**
- **Price floor** — "From $40/night · breakfast included · full board available" under the hero CTA, and "From $40/night · breakfast included · full board on request" above the rooms.html body copy. Solves price uncertainty (one of three top abandonment drivers).
- **Getting here** — practical-distance block inside Find Us (info column): ~5h from Colombo, ~4.5h from the airport, 45 min from Udawalawe, free parking + Aji can arrange a driver/pickup.
- **Food section copy** updated to call out full board: heading now "Breakfast Every Morning. Full Board on Request." with a clear three-meals-a-day mention.

**Tech fixes (5):**
- Removed duplicate inline `<script>` carousel logic in rooms.html and farm.html — the global script.js already handles every `.image-slider` on the page (no double-firing on click/swipe).
- Mobile slider arrows enlarged 38 → 44px (Apple HIG min).
- Mobile testimonial arrows enlarged 28 → 44px (was below tap target).
- Hero scroll-down arrow hidden on mobile (28×36 was below 44 minimum; touch users already know to scroll).
- Lake slider on farm.html cleaned: removed Udawalawe + horses slides (mismatched the section text); now 4 lake-only slides.
- Removed inline `.slider-arrow`/`.image-slider` CSS duplicates in rooms.html and farm.html so the mobile media-query rules in style.css can take effect.

**Photos:**
- Two new cottage exterior shots added to rooms.html slider: `cottage-palms.jpg` (cottage among coconut palms) and `cottage-brick-veranda.jpg` (brick veranda with wooden lounge chairs). Slider grew from 5 → 7 slides, interleaved wide ↔ close.

**Files:** `index.html`, `rooms.html`, `farm.html`, `story.html`, `style.css`, `script.js`, `photos/cottage-palms.jpg`, `photos/cottage-brick-veranda.jpg`, `.gitignore`

---

## 2026-05-07 — index hero polish (Rivka pass 1)
**By:** Rivka
**Changed:**
- Removed the "EMBILIPITIYA · SRI LANKA" small label above the H1 — felt redundant against the page title and the breadcrumb-feel didn't fit the editorial direction.
- Forced "AJI FRUIT FARM" onto a single line (dropped the `<br>`, added `white-space: nowrap`, retuned the clamp from 12vw/9rem max to 9vw/8rem max so it lands as one row at desktop widths and scales down cleanly on mobile).
- Strengthened the tagline contrast against the hero photo — bumped color opacity 0.85 → 0.96, added a soft `text-shadow: 0 1px 14px rgba(0,0,0,0.45)`. The italic Cormorant now reads cleanly through the foliage gradient.
- Thinned the sticky nav from `padding: 20px` to `12px` (and `10px` once scrolled). Reads as a fine line over the hero now instead of a banner.

**Files:** `index.html`, `style.css`

## 2026-05-07 — sticky nav visible from start, more delicate (Rivka)
**By:** Rivka
**Changed:**
- Nav is now visible from the moment the page loads, not only after scroll. Uses a soft 65% cream + 8px backdrop-blur + a hairline border-bottom (rgba 27,56,38,0.06) over the hero photo. On scroll the same bar intensifies to 95% cream + the standard border.
- Logo and link colors switched from white-on-photo to dark text in both states (the cream backdrop now exists in both, so white would disappear into it).
- Slightly tighter geometry: padding 12 → 10 (default) and 10 → 9 (scrolled), gap 36 → 32, link size 0.72 → 0.7rem, logo 1.1 → 1.05rem.

**Files:** `style.css`
