/**
 * animations.js — Scroll reveal, counters, parallax, page transitions, marquee
 */

let transitioning = false;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollReveal() {
  if (prefersReduced) return;

  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  const els = activePage.querySelectorAll(
    '.sec-title, .sec-lbl, .ap-heading, .ap-body, .stat,' +
    '.proc-n, .proc-t, .proc-p, .testi-card, .ms-quote,' +
    '.ms-attr, .ms-shona, .pg-title, .pg-sub, .abt-big,' +
    '.abt-bio, .con-title, .meaning-strip, .feat-grid,' +
    '.about-prev, .abt-photos, .commission-panel, .testi-grid'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const delay = (i % 4) * 80;
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => {
    if (getComputedStyle(el).opacity === '0') return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1)';
    observer.observe(el);
  });
}

export function initCounters() {
  if (prefersReduced) return;

  const stats = document.querySelectorAll('.stat-n');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      if (raw === '∞' || raw === '100%' || isNaN(parseInt(raw))) return;

      const target   = parseInt(raw);
      const duration = 1800;
      const start    = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

export function initParallax() {
  if (prefersReduced) return;

  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

export function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  if (prefersReduced) {
    return function transitionTo(fn) { fn(); };
  }

  return function transitionTo(fn) {
    if (transitioning) return;
    transitioning = true;

    overlay.style.transformOrigin = 'bottom';
    overlay.style.transform       = 'scaleY(1)';

    setTimeout(() => {
      fn();
      overlay.style.transformOrigin = 'top';
      overlay.style.transform       = 'scaleY(0)';
      setTimeout(() => {
        transitioning = false;
        initScrollReveal();
      }, 440);
    }, 420);
  };
}

export function initSplitText() {
  if (prefersReduced) return;

  const heroH = document.querySelector('.hero-h');
  if (!heroH) return;

  heroH.style.overflow = 'hidden';
  const lines = heroH.innerHTML.split('<br>');
  heroH.innerHTML = lines.map((line, i) => `
    <span style="display:block;overflow:hidden;">
      <span style="display:block;animation:lineReveal 1s ${0.3 + i * 0.18}s cubic-bezier(.16,1,.3,1) both;">
        ${line}
      </span>
    </span>
  `).join('');
}

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
