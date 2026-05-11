// ─── MOBILE HAMBURGER OVERLAY ─────────────────────────────────────
// Full-screen menu: burger (in nav) opens it, X (in overlay) or any
// link click closes it. Body scroll is locked while open so the
// background doesn't drift. Escape also closes for keyboard users.
const burger      = document.querySelector('.nav-burger');
const overlay     = document.getElementById('nav-overlay');
const overlayClose = overlay && overlay.querySelector('.nav-overlay-close');

function openOverlay() {
  if (!overlay) return;
  // Drop the [hidden] attribute first (it was a safety net so the
  // overlay couldn't leak into the document if a stale CSS bundle was
  // cached). Wait one frame so the browser registers the new display
  // value before applying .open — otherwise the opacity transition
  // gets skipped.
  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add('open');
  });
  overlay.setAttribute('aria-hidden', 'false');
  if (burger) burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeOverlay() {
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  if (burger) burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  // Re-add [hidden] after the close transition finishes (440ms = 420 + slack).
  setTimeout(() => {
    if (!overlay.classList.contains('open')) overlay.hidden = true;
  }, 460);
}
if (burger && overlay) {
  burger.addEventListener('click', openOverlay);
  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
  // Tapping any in-overlay link closes the menu (so same-page anchors
  // like #contact don't leave the menu sitting on top of the target).
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeOverlay));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });
}

// Nav — hide on scroll down, reveal on scroll up. Always visible near
// the top so the page never opens with a hidden nav. Special case: when
// the user is in the hero's bottom fade-to-cream area, the nav stays
// hidden regardless of direction so it doesn't appear washed out
// against the cream gradient.
const nav  = document.querySelector('.nav');
const hero = document.querySelector('.hero');
const isSubpage = document.body.classList.contains('subpage');
const stickyCta = document.querySelector('.sticky-cta');
const bookCta   = document.querySelector('.book-cta, #contact');
let lastY = window.scrollY;
let ticking = false;

function updateNav() {
  const y  = window.scrollY;
  const dy = y - lastY;

  // ── over-hero state ──
  // Behaviour matches the homepage everywhere: the page has ONE hero
  // photo at the top — while the user is on it, the nav is
  // transparent; as soon as they scroll past, the sage glass returns
  // for the rest of the page.
  //   - Homepage: hero = .hero
  //   - Subpages on mobile: hero = first .split-image (full-bleed)
  //   - Subpages on desktop: no over-hero (split-image is half-width,
  //     transparent over the text column reads as broken)
  let overHero = false;
  let inFog = false;
  const isMobile = window.matchMedia('(max-width: 860px)').matches;
  let heroEl = hero;
  if (!heroEl && isSubpage && isMobile) {
    heroEl = document.querySelector('.split-image');
  }
  if (heroEl) {
    // Transparent while in the top zone (y < 100). Threshold matched
    // to .at-top below so size and transparency cross-fade together
    // in a single dissolve rather than landing in two snaps.
    overHero = y < 100;
    if (hero) {
      const heroH = hero.offsetHeight;
      inFog = y > heroH * 0.78 && y < heroH;
    }
  }
  nav.classList.toggle('over-hero', overHero);

  // .at-top — bigger nav sizes while the user is glued to the very
  // top of any page. Same y=100 threshold as .over-hero so the two
  // transitions move as one. The 0.9s eases on background, color,
  // font-size, and padding all blend into a single 100→shrunk flow.
  nav.classList.toggle('at-top', y < 100);

  if (inFog) {
    nav.classList.add('hidden');
  } else if (y < 60) {
    nav.classList.remove('hidden');
  } else if (dy > 20) {
    nav.classList.add('hidden');
  } else if (dy < -20) {
    nav.classList.remove('hidden');
  }

  // ── Mobile sticky CTA ──
  // Show after the user has scrolled past the hero — they've seen the
  // value, now keep "Check availability with Aji" one tap away. Hide
  // again when the page's own in-content book CTA enters the viewport,
  // so the two don't compete for attention.
  if (stickyCta && isMobile) {
    let show = false;
    if (heroEl) {
      const r = heroEl.getBoundingClientRect();
      // Hero is mostly out of view → start showing.
      show = r.bottom < 80;
    }
    // If the in-page book CTA / contact section is already on screen,
    // don't double-up — the user already has the primary action visible.
    if (show && bookCta) {
      const br = bookCta.getBoundingClientRect();
      if (br.top < window.innerHeight - 40) show = false;
    }
    stickyCta.classList.toggle('visible', show);
    document.body.classList.toggle('sticky-cta-visible', show);
  }

  lastY = y;
  ticking = false;
}
// Initial paint — set the over-hero state on load so the first frame
// renders with the right text color before any scroll event fires.
updateNav();

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNav);
    ticking = true;
  }
}, { passive: true });

// ─── NAV-ABLE REGISTRY ────────────────────────────────────────────
// Every interactive nav-able element (image sliders + the testimonial
// carousel) registers itself; the global keyboard handler routes
// ArrowLeft/ArrowRight to whichever nav-able is most centered in the
// current viewport, so multiple sliders on a page never compete.
const navables = [];
function registerNavable(element, api) {
  if (element) navables.push({ element, api });
}

// Testimonial carousel
const quotes = [
  {
    text: '"This was probably <strong>the best Airbnb we\'ve ever stayed at</strong>. The calmness and nature are breathtaking. The highlight is the bathroom with open sky — and the fireflies by night."',
    author: '— Sarah & Felix, Germany'
  },
  {
    text: '"<strong>We felt like part of the family from the first moment.</strong> Ajith takes care of his guests with so much dedication. The farewell was incredibly difficult — our heart definitely stayed there."',
    author: '— Katharina, Germany'
  },
  {
    text: '"A real haven of peace. <strong>The view over the lake is breathtaking</strong>, especially during sunrise. If we had known, we would have extended our stay."',
    author: '— Pierre, France'
  },
  {
    text: '"This is the best farm stay. A wonderful mango farm at the foot of the lake. The family is very kind and the food is delicious. <strong>I don\'t think there is any other place like this.</strong>"',
    author: '— Momoyo, Japan'
  },
  {
    text: '"Beautiful and serene location to enjoy a relaxed time at the lake. <strong>The host and his family are very warm and welcoming</strong> — they make sure you have a pleasant stay and don\'t lack anything."',
    author: '— Sjak, Netherlands'
  },
  {
    text: '"<strong>Like in the Garden of Eden.</strong> Located in the middle of the farm by a beautiful lake where you can also swim. Breakfast and dinner were delicious. We\'d love to come back!"',
    author: '— Ronald & Anni, Germany'
  },
  {
    text: '"<strong>This is the best place I\'ve ever visited.</strong> I\'ve already started planning my next visit."',
    author: '— Donovan'
  },
  {
    text: '"A peaceful place, a true haven of peace. <strong>Had we known, we would have extended our stay.</strong>"',
    author: '— Maxime, Paris'
  }
];

const quoteText    = document.getElementById('quote-text');
const quoteAuthor  = document.getElementById('quote-author');
const quoteCounter = document.getElementById('quote-counter');
const dots         = document.querySelectorAll('.dot');

// Carousel only exists on index.html — bail on other pages so this
// shared script can be loaded everywhere without errors.
if (quoteText && quoteAuthor) {
  let current = 0;

  // Sliding carousel — outgoing quote slides off in the travel
   // direction, incoming quote slides in from the opposite side.
  function showQuote(index, direction) {
    if (typeof direction !== 'string') {
      // Inferred direction when called from a dot click: forward if the
      // target is later in the list (with wraparound), backward otherwise.
      const len = quotes.length;
      const fwd = ((index - current) + len) % len;
      direction = fwd <= len / 2 ? 'next' : 'prev';
    }
    const outX = direction === 'next' ? '-32px' : '32px';
    const inX  = direction === 'next' ? '32px'  : '-32px';

    quoteText.style.transform   = `translateX(${outX})`;
    quoteText.style.opacity     = '0';
    quoteAuthor.style.transform = `translateX(${outX})`;
    quoteAuthor.style.opacity   = '0';

    setTimeout(() => {
      // innerHTML so <strong> highlight tags inside each quote render
      // as styled emphasis rather than literal markup.
      quoteText.innerHTML     = quotes[index].text;
      quoteAuthor.textContent = quotes[index].author;

      // Snap to the "incoming" position with no transition, then animate
      // back to center on the next frame.
      quoteText.style.transition   = 'none';
      quoteAuthor.style.transition = 'none';
      quoteText.style.transform    = `translateX(${inX})`;
      quoteAuthor.style.transform  = `translateX(${inX})`;
      void quoteText.offsetWidth;
      quoteText.style.transition   = '';
      quoteAuthor.style.transition = '';
      quoteText.style.transform    = 'translateX(0)';
      quoteText.style.opacity      = '1';
      quoteAuthor.style.transform  = 'translateX(0)';
      quoteAuthor.style.opacity    = '1';
    }, 350);

    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    if (quoteCounter) quoteCounter.textContent = `${index + 1} / ${quotes.length}`;
    current = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => showQuote(+dot.dataset.index));
  });

  // Auto-rotate quotes every 7s for the passive visitor — but the moment
  // the visitor takes manual control (clicks an arrow, taps a dot, hits
  // a keyboard arrow), the rotation stops permanently. Respects
  // prefers-reduced-motion: visitors who opted out of motion never see
  // an auto-advancing carousel.
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoTimer = null;
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function startAuto() {
    if (reduced || autoTimer) return;
    autoTimer = setInterval(() => {
      showQuote((current + 1) % quotes.length, 'next');
    }, 7000);
  }

  const prevBtn = document.getElementById('quote-prev');
  const nextBtn = document.getElementById('quote-next');
  const gotoPrev = () => { stopAuto(); showQuote((current - 1 + quotes.length) % quotes.length, 'prev'); };
  const gotoNext = () => { stopAuto(); showQuote((current + 1) % quotes.length, 'next'); };
  if (prevBtn) prevBtn.addEventListener('click', gotoPrev);
  if (nextBtn) nextBtn.addEventListener('click', gotoNext);
  // Manual dot click also stops the auto-rotation.
  dots.forEach(dot => dot.addEventListener('click', stopAuto));

  // Only kick off the auto-rotation once the reviews section actually
  // enters the viewport, so the timer doesn't burn cycles on visitors
  // who never scroll that far down.
  const reviewsEl = document.querySelector('.reviews');
  if (reviewsEl && 'IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { startAuto(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(reviewsEl);
  }

  // Register the testimonial as a navable so the global keyboard handler
  // can route arrow keys to it when the reviews section is in view.
  registerNavable(document.querySelector('.reviews'), {
    prev: gotoPrev,
    next: gotoNext
  });
}

// ─── IMAGE CAROUSELS ──────────────────────────────────────────────
// Slide transition (not fade). Each slide is positioned absolutely with
// its own transform — incoming slides come from the side and the active
// one moves to the opposite side. The browser tweens; no strip jump.
document.querySelectorAll('.image-slider').forEach((slider) => {
  const slides  = Array.from(slider.querySelectorAll('.slide'));
  const prev    = slider.querySelector('.slider-arrow--prev');
  const next    = slider.querySelector('.slider-arrow--next');
  const counter = slider.querySelector('.slider-counter');
  const total   = slides.length;
  let current = 0;

  function show(n, direction) {
    const newIdx = (n + total) % total;
    if (newIdx === current) return;
    const oldSlide = slides[current];
    const newSlide = slides[newIdx];
    const dir = direction || 'next';

    // Always snap the incoming slide to its starting side WITHOUT a
    // transition first, so wrap-arounds (last→first or first→last)
    // don't accidentally come from the wrong direction because of an
    // accumulated .prev class from earlier interactions.
    newSlide.style.transition = 'none';
    if (dir === 'prev') {
      newSlide.classList.add('prev');     // start on the LEFT
    } else {
      newSlide.classList.remove('prev');  // start on the RIGHT (default)
    }
    void newSlide.offsetWidth;            // force reflow
    newSlide.style.transition = '';

    // Animate: incoming slides to center, outgoing slides exits the
    // opposite side.
    newSlide.classList.remove('prev');
    newSlide.classList.add('active');
    oldSlide.classList.remove('active');
    if (dir === 'next') {
      oldSlide.classList.add('prev');     // exit LEFT
    } else {
      oldSlide.classList.remove('prev');  // exit RIGHT (default)
    }

    current = newIdx;
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }
  const api = {
    prev: () => show(current - 1, 'prev'),
    next: () => show(current + 1, 'next')
  };

  if (prev) prev.addEventListener('click', api.prev);
  if (next) next.addEventListener('click', api.next);

  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) (dx > 0 ? api.next : api.prev)();
  });

  registerNavable(slider, api);
});

// Pick the nav-able whose center is closest to the viewport center.
function activeNavable() {
  const vpCenter = window.innerHeight / 2;
  let best = null;
  let bestDist = Infinity;
  for (const { element, api } of navables) {
    const r = element.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) continue;
    const d = Math.abs((r.top + r.bottom) / 2 - vpCenter);
    if (d < bestDist) { bestDist = d; best = api; }
  }
  return best;
}

document.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const target = activeNavable();
  if (!target) return;
  e.key === 'ArrowLeft' ? target.prev() : target.next();
});

// ─── DATE-AWARE WHATSAPP PICKER ───────────────────────────────────
// On the index contact section: turns three light inputs (arrival,
// nights, guests) into a tailored WhatsApp message so Aji doesn't
// have to ask "when?" before a conversation can start. Pure
// client-side — the link's href is rebuilt on every input change.
const dpArrival = document.getElementById('dp-arrival');
const dpNights  = document.getElementById('dp-nights');
const dpGuests  = document.getElementById('dp-guests');
const dpSend    = document.getElementById('dp-send');

if (dpArrival && dpNights && dpGuests && dpSend) {
  // Block past dates from the calendar picker
  const today = new Date();
  dpArrival.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  function buildMessage() {
    const nights = Math.max(1, parseInt(dpNights.value, 10) || 1);
    const guests = Math.max(1, parseInt(dpGuests.value, 10) || 1);
    const nightWord = nights === 1 ? 'night' : 'nights';
    const guestWord = guests === 1 ? 'guest' : 'guests';
    let msg;
    if (dpArrival.value) {
      const d = new Date(dpArrival.value + 'T00:00');
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      msg = `Hi Aji, I'd love to book a cottage from ${dateStr} for ${nights} ${nightWord} (${guests} ${guestWord}). Are dates available?`;
    } else {
      msg = `Hi Aji, I'd love to book a cottage for ${guests} ${guestWord}. Could you tell me about availability?`;
    }
    return `https://wa.me/94705065061?text=${encodeURIComponent(msg)}`;
  }

  function updateLink() { dpSend.href = buildMessage(); }
  ['input', 'change'].forEach(ev => {
    [dpArrival, dpNights, dpGuests].forEach(el => el.addEventListener(ev, updateLink));
  });
  // Final safety on click — guarantees the latest values are used
  dpSend.addEventListener('click', updateLink);
  updateLink();
}

// ─── MOBILE PAGE SWIPE ────────────────────────────────────────────
// On phones, swipe horizontally between all four pages so the site
// feels like a flippable booklet: Home → Our Story → Cottages → Farm.
// Swiping right (finger moves right) advances to the next page in
// sequence, swiping left goes back. Wraps around at the ends.
// Touches that start on a horizontal scroller (sliders, the day-card
// strip, the activities strip, testimonial arrows) are ignored so
// those carousels still work normally.
(function setupPageSwipe() {
  if (!window.matchMedia('(max-width: 860px)').matches) return;

  const order = ['index.html', 'story.html', 'rooms.html', 'farm.html'];
  let here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (here === '' || here === '/') here = 'index.html';
  const idx = order.indexOf(here);
  if (idx === -1) return;

  let startX = 0, startY = 0, blocked = false;

  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    blocked = !!e.target.closest(
      '.image-slider, .slider, .activities, .itinerary, .itinerary-days, ' +
      '.testimonial-row, .nav-overlay, [data-no-swipe], input, textarea, button'
    );
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (blocked) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const len = order.length;
    const target = dx > 0
      ? order[(idx + 1) % len]
      : order[(idx - 1 + len) % len];
    location.href = target;
  }, { passive: true });
})();
