/* ============================================================
   Shared behaviour for every design concept.
   EDIT ME — wedding details used by the countdown & calendar link.
   Date format: YYYY, MM (1-12), DD, HH, MM
   ============================================================ */
const WEDDING = {
  // Ceremony start (used for the countdown + "Add to Calendar")
  year: 2026,
  month: 11,  // November
  day: 7,
  hour: 9,    // EDIT ME: placeholder time — update once the ceremony time is confirmed
  minute: 0,
  durationHours: 3,
  title: "Jins & Sneha's Wedding",
  details: "Holy Matrimony of Jins Thomas & Sneha Elizabeth Thomas. We look forward to celebrating with you!",
  location: "Holy Cross Syro-Malabar Church, Kappadu, Kanjirappally",
};

document.addEventListener('DOMContentLoaded', () => {
  const targetDate = new Date(
    WEDDING.year,
    WEDDING.month - 1,
    WEDDING.day,
    WEDDING.hour,
    WEDDING.minute,
    0
  );

  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- NAV: scrolled state ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- NAV: mobile toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', closeMenu)
    );
  }

  /* ---------- COUNTDOWN ---------- */
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');
  const timerEl = document.getElementById('countdown-timer');
  const doneEl = document.getElementById('countdown-done');

  const tick = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) {
      if (timerEl) timerEl.hidden = true;
      if (doneEl) doneEl.hidden = false;
      return false;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (elDays) elDays.textContent = String(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(mins);
    if (elSecs) elSecs.textContent = pad(secs);
    return true;
  };

  if (elDays || elHours || elMins || elSecs) {
    if (tick()) {
      const interval = setInterval(() => {
        if (!tick()) clearInterval(interval);
      }, 1000);
    }
  }

  /* ---------- ADD TO CALENDAR (Google Calendar) ---------- */
  const calBtns = document.querySelectorAll('#addToCalendar, .js-add-to-calendar');
  if (calBtns.length) {
    const fmt = (d) =>
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      '00Z';
    const end = new Date(targetDate.getTime() + WEDDING.durationHours * 3600000);
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', WEDDING.title);
    url.searchParams.set('dates', `${fmt(targetDate)}/${fmt(end)}`);
    url.searchParams.set('details', WEDDING.details);
    url.searchParams.set('location', WEDDING.location);
    calBtns.forEach((btn) => {
      btn.setAttribute('href', url.toString());
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener');
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
});
