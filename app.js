(function () {
  'use strict';

  // -----------------------------------------------------------------
  // Footer year
  // -----------------------------------------------------------------
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // -----------------------------------------------------------------
  // Theme picker  (dark | light | beige | gold)
  // -----------------------------------------------------------------
  var STORAGE_KEY = 'jt-resume-theme';
  var VALID = ['dark', 'light', 'beige', 'gold'];
  var root = document.documentElement;
  var swatches = document.querySelectorAll('.swatch[data-theme]');

  function applyTheme(theme) {
    if (!theme || theme === 'dark') {
      root.removeAttribute('data-theme');
      theme = 'dark';
    } else {
      root.setAttribute('data-theme', theme);
    }
    swatches.forEach(function (s) {
      s.setAttribute('aria-checked', s.dataset.theme === theme ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var color = ({
        dark:  '#0b1220',
        light: '#f6f8fc',
        beige: '#f4ecd8',
        gold:  '#0c0a06'
      })[theme] || '#0b1220';
      meta.setAttribute('content', color);
    }
  }

  // initial: stored value (if valid) → otherwise BEIGE default
  var initial = null;
  try { initial = localStorage.getItem(STORAGE_KEY); } catch (_) {}
  if (VALID.indexOf(initial) === -1) initial = 'beige';
  applyTheme(initial);

  swatches.forEach(function (s) {
    s.addEventListener('click', function () {
      var theme = s.dataset.theme;
      applyTheme(theme);
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    });
  });

  // -----------------------------------------------------------------
  // Reveal-on-scroll animation
  // -----------------------------------------------------------------
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Targets that should fade up when scrolled into view
  var revealTargets = document.querySelectorAll('[data-reveal], .stagger');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Just show everything immediately
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Hero is at top of page → reveal it after a short tick so the
  // initial paint shows the animation rather than already-visible state.
  var hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(function () { hero.classList.add('is-visible'); }, 80);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold:  0.12
  });

  revealTargets.forEach(function (el) {
    if (el === hero) return; // already handled above
    io.observe(el);
  });
})();
