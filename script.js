// Nav — scrolled state
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// Testimonial carousel
const quotes = [
  {
    text: '"This was probably the best Airbnb we\'ve ever stayed at. The calmness and nature are breathtaking. The highlight is the bathroom with open sky — and the fireflies by night."',
    author: '— Sarah & Felix, Germany'
  },
  {
    text: '"We felt like part of the family from the first moment. Ajith takes care of his guests with so much dedication. The farewell was incredibly difficult — our heart definitely stayed there."',
    author: '— Katharina, Germany'
  },
  {
    text: '"A real haven of peace. The view over the lake is breathtaking, especially during sunrise. If we had known, we would have extended our stay."',
    author: '— Pierre, France'
  }
];

const quoteText   = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const dots        = document.querySelectorAll('.dot');
let current = 0;

function showQuote(index) {
  quoteText.style.opacity   = '0';
  quoteAuthor.style.opacity = '0';
  setTimeout(() => {
    quoteText.textContent   = quotes[index].text;
    quoteAuthor.textContent = quotes[index].author;
    quoteText.style.opacity   = '1';
    quoteAuthor.style.opacity = '1';
  }, 300);
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  current = index;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => showQuote(+dot.dataset.index));
});

setInterval(() => showQuote((current + 1) % quotes.length), 6000);
