/* ============================================================
   8 CODING CONCEPTS — BOOK CONFIG + PAGE NAVIGATION
   Handles book metadata injection, page switching, progress
   bar, indicator, TOC links, and keyboard navigation.
   ============================================================ */

/* ------------------------------------------------------------
   BOOK CONFIG
   Change these values to re-brand the book. The HTML contains
   static fallbacks so the book still reads correctly without JS.

   `topic` is the subject noun. The book title is derived from
   `conceptWord` + `topic` (e.g. "Eight Coding Concepts").
   ------------------------------------------------------------ */
const BOOK = {
  topic:            'Coding Concepts',
  conceptCount:     8,
  conceptWord:      'Eight',       // Capitalized word form
  conceptWordLower: 'eight',       // lowercase word form
  tagline:          "A Beginner's Book for Ages 5–7",
  series:           "A Beginner's Book",
  author:           'Agunechemba Ekene',
  authorUrl:        'https://agunechemba.name.ng',
  ages:             '5 – 7',
};

// Derived title — always in sync with topic + conceptWord.
BOOK.title = `${BOOK.conceptWord} ${BOOK.topic}`;

/* ------------------------------------------------------------
   Apply BOOK config to the document.
   - Sets <title>
   - Populates any element with data-book="<key>"
   - Populates any element with data-book-url="<key>" (href)
   ------------------------------------------------------------ */
function applyBookConfig() {
  document.title = `${BOOK.title} — ${BOOK.tagline}`;

  document.querySelectorAll('[data-book]').forEach(function (el) {
    const key = el.dataset.book;
    if (!(key in BOOK)) return;

    const value = BOOK[key];

    if (key === 'conceptCount') {
      // Always render the number, even if the config changes it
      el.textContent = String(value);
    } else {
      el.textContent = String(value);
    }
  });

  document.querySelectorAll('[data-book-url]').forEach(function (el) {
    const key = el.dataset.bookUrl;
    if (key in BOOK) el.href = BOOK[key];
  });
}

/* ------------------------------------------------------------
   PAGE NAVIGATION
   ------------------------------------------------------------ */
(function () {
  'use strict';

  const pages = Array.from(document.querySelectorAll('.book-page'));
  const progressFill = document.querySelector('.reading-progress-fill');
  const pageIndicator = document.querySelector('.page-indicator');
  let currentPage = 0;

  // Enable JS mode
  document.body.classList.add('js-ready');

  function showPage(index) {
    if (index < 0 || index >= pages.length) return;

    pages.forEach(function (p) {
      p.classList.remove('active', 'page-enter');
    });

    currentPage = index;
    const page = pages[currentPage];
    page.classList.add('active', 'page-enter');
    window.setTimeout(function () {
      page.classList.remove('page-enter');
    }, 500);

    // Update progress bar
    const pct = ((currentPage + 1) / pages.length) * 100;
    progressFill.style.width = pct + '%';

    // Update page indicator
    pageIndicator.textContent = (currentPage + 1) + ' / ' + pages.length;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // Expose navigation globally so inline onclick can use them
  window.goToPage = showPage;
  window.nextPage = function () { showPage(currentPage + 1); };
  window.prevPage = function () { showPage(currentPage - 1); };

  // Handle TOC and other internal links with data-goto
  document.addEventListener('click', function (e) {
    const link = e.target.closest('[data-goto]');
    if (link) {
      e.preventDefault();
      showPage(parseInt(link.dataset.goto, 10));
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      showPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      showPage(currentPage - 1);
    } else if (e.key === 'Home') {
      showPage(0);
    } else if (e.key === 'End') {
      showPage(pages.length - 1);
    }
  });

  // Inject book metadata, then start on the first page
  applyBookConfig();
  showPage(0);
})();