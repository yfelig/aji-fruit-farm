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
  }
];

const quoteText   = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const dots        = document.querySelectorAll('.dot');

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
    current = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => showQuote(+dot.dataset.index));
  });

  // Manual prev/next arrows — no auto-rotation, the visitor decides.
  const prevBtn = document.getElementById('quote-prev');
  const nextBtn = document.getElementById('quote-next');
  const gotoPrev = () => showQuote((current - 1 + quotes.length) % quotes.length, 'prev');
  const gotoNext = () => showQuote((current + 1) % quotes.length, 'next');
  if (prevBtn) prevBtn.addEventListener('click', gotoPrev);
  if (nextBtn) nextBtn.addEventListener('click', gotoNext);

  // Register the testimonial as a navable so the global keyboard handler
  // can route arrow keys to it when the reviews section is in view.
  registerNavable(document.querySelector('.reviews'), { prev: gotoPrev, next: gotoNext });
}

// ─── IMAGE CAROUSELS ──────────────────────────────────────────────
document.querySelectorAll('.image-slider').forEach((slider) => {
  const slides  = slider.querySelectorAll('.slide');
  const prev    = slider.querySelector('.slider-arrow--prev');
  const next    = slider.querySelector('.slider-arrow--next');
  const counter = slider.querySelector('.slider-counter');
  const total   = slides.length;
  let current = 0;

  function show(n) {
    slides[current].classList.remove('active');
    current = (n + total) % total;
    slides[current].classList.add('active');
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }
  const api = { prev: () => show(current - 1), next: () => show(current + 1) };

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
