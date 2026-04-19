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
        beige: '#f1e8d0',
        gold:  '#0c0a06'
      })[theme] || '#f1e8d0';
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
  //
  // Problem we're guarding against: on some mobile browsers
  // (iOS Safari, WebView in-app browsers) IntersectionObserver fires
  // unreliably for tall sections, leaving everything below the fold
  // stuck at opacity: 0. We therefore (a) use very permissive observer
  // settings, (b) reveal on first user interaction as a fallback,
  // and (c) force-reveal everything after a short timeout no matter
  // what.
  // -----------------------------------------------------------------
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll('[data-reveal], .stagger');

  function revealAll() {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
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
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    // Permissive: fire as soon as any pixel enters the viewport.
    rootMargin: '0px 0px 0px 0px',
    threshold:  0
  });

  revealTargets.forEach(function (el) {
    if (el === hero) return;
    io.observe(el);
  });

  // ----- safety nets -----

  // 1. If the user starts interacting (scroll or touch), reveal
  //    everything that's still hidden — better to show all content
  //    than have a blank page.
  var revealedByInteraction = false;
  function onFirstInteraction() {
    if (revealedByInteraction) return;
    revealedByInteraction = true;
    revealAll();
    window.removeEventListener('scroll',     onFirstInteraction, true);
    window.removeEventListener('touchstart', onFirstInteraction, true);
    window.removeEventListener('touchmove',  onFirstInteraction, true);
    window.removeEventListener('wheel',      onFirstInteraction, true);
  }
  window.addEventListener('scroll',     onFirstInteraction, { passive: true, capture: true });
  window.addEventListener('touchstart', onFirstInteraction, { passive: true, capture: true });
  window.addEventListener('touchmove',  onFirstInteraction, { passive: true, capture: true });
  window.addEventListener('wheel',      onFirstInteraction, { passive: true, capture: true });

  // 2. Hard fallback: after 2 seconds, anything still hidden gets
  //    revealed. Animation may be skipped but content will be readable.
  setTimeout(revealAll, 2000);

  // 3. When the page is fully loaded (images, fonts), do one more pass.
  window.addEventListener('load', function () {
    setTimeout(revealAll, 600);
  });
})();
