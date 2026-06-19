/**
 * animations.js — Scroll reveal, counters, parallax, page transitions, marquee
 * Enhanced with staggered reveals and directional animations
 */

let transitioning = false;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── SCROLL REVEAL (Enhanced) ──
export function initScrollReveal() {
  if (prefersReduced) return;

  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  // Elements to reveal with different animation types
  const revealElements = activePage.querySelectorAll(
    '.sec-title, .sec-lbl, .ap-heading, .ap-body, .stat,' +
    '.proc-n, .proc-t, .proc-p, .testi-card, .ms-quote,' +
    '.ms-attr, .ms-shona, .pg-title, .pg-sub, .abt-big,' +
    '.abt-bio, .con-title, .meaning-strip, .feat-grid,' +
    '.about-prev, .abt-photos, .commission-panel, .testi-grid,' +
    '.hero-brand-tagline, .hero-brand-name, .hero-tagline, .hero-cta,' +
    '.story-body p, .story-headline, .story-kicker,' +
    '.coll-item, .artist-card, .journal-card, .nl-inner'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      // Determine animation type based on element
      const type = getRevealType(el);
      const delay = (i % 6) * 100;

      setTimeout(() => {
        el.classList.add('reveal-visible');
        // Add direction class for directional reveals
        if (type === 'left') el.classList.add('reveal-left');
        if (type === 'right') el.classList.add('reveal-right');
        if (type === 'scale') el.classList.add('reveal-scale');
        // Default is 'fade-up'
      }, delay);

      observer.unobserve(el);
    });
  }, { 
    threshold: 0.12, 
    rootMargin: '0px 0px -60px 0px' 
  });

  revealElements.forEach(el => {
    // Skip if already revealed
    if (el.classList.contains('reveal-visible')) return;
    el.classList.add('reveal');
    observer.observe(el);
  });
}

function getRevealType(el) {
  // Different animations for different elements
  if (el.matches('.hero-brand-tagline, .hero-brand-name, .hero-tagline')) return 'fade-up';
  if (el.matches('.coll-item, .artist-card, .journal-card')) return 'scale';
  if (el.matches('.stat, .proc-n, .sec-lbl')) return 'fade-up';
  if (el.matches('.abt-photo, .commission-img')) return 'left';
  if (el.matches('.commission-text, .ap-body')) return 'right';
  if (el.matches('.story-body p')) return 'fade-up';
  return 'fade-up';
}

// ── COUNTERS ──
export function initCounters() {
  if (prefersReduced) return;

  const stats = document.querySelectorAll('.stat-n');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      if (raw === '∞' || raw === '100%' || isNaN(parseInt(raw))) return;

      const target = parseInt(raw);
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

// ── PARALLAX (Enhanced) ──
export function initParallax() {
  if (prefersReduced) return;

  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Also add parallax to other images
  const parallaxImages = document.querySelectorAll(
    '.abt-photo img, .commission-img img, .fa-portrait img'
  );

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Hero background parallax
        if (heroBg) {
          heroBg.style.transform = `translateY(${scrollY * 0.28}px) scale(1.02)`;
        }
        // Image parallax for about page
        parallaxImages.forEach((img, i) => {
          const rect = img.getBoundingClientRect();
          const offset = (rect.top + rect.height / 2) / window.innerHeight;
          const speed = 0.05 + (i % 3) * 0.02;
          img.style.transform = `translateY(${(offset - 0.5) * speed * 200}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── PAGE TRANSITION ──
export function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 11500;
    background: var(--charcoal, #1B1B1B);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.5s cubic-bezier(.76,0,.24,1);
    pointer-events: none;
  `;
  document.body.appendChild(overlay);

  if (prefersReduced) {
    return function transitionTo(fn) { fn(); };
  }

  return function transitionTo(fn) {
    if (transitioning) return;
    transitioning = true;

    overlay.style.transformOrigin = 'bottom';
    overlay.style.transform = 'scaleY(1)';

    setTimeout(() => {
      fn();
      overlay.style.transformOrigin = 'top';
      overlay.style.transform = 'scaleY(0)';
      setTimeout(() => {
        transitioning = false;
        initScrollReveal();
      }, 500);
    }, 500);
  };
}

// ── MARQUEE ──
export function initHorizontalMarquee() {
  const track = document.querySelector('.mq-track');
  if (!track || prefersReduced) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}