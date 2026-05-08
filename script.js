// Nav — hide on scroll down, reveal on scroll up. Always visible near
// the top so the page never opens with a hidden nav. Special case: when
// the user is in the hero's bottom fade-to-cream area, the nav stays
// hidden regardless of direction so it doesn't appear washed out
// against the cream gradient.
const nav  = document.querySelector('.nav');
const hero = document.querySelector('.hero');
let lastY = window.scrollY;
let ticking = false;

function updateNav() {
  const y  = window.scrollY;
  const dy = y - lastY;
  const heroH = hero ? hero.offsetHeight : 0;
  const inFog = heroH && y > heroH * 0.78 && y < heroH;

  if (inFog) {
    nav.classList.add('hidden');
  } else if (y < 60) {
    nav.classList.remove('hidden');
  } else if (dy > 20) {
    nav.classList.add('hidden');
  } else if (dy < -20) {
    nav.classList.remove('hidden');
  }

  lastY = y;
  ticking = false;
}

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
