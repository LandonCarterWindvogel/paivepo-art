let transitioning = false;

export function initScrollReveal() {
  const els = document.querySelectorAll(
    '.sec-title, .sec-lbl, .ap-heading, .ap-body, .stat, .proc-n, .proc-t, .proc-p, .testi-card, .ms-quote, .ms-attr, .ms-shona, .pg-title, .pg-sub, .abt-big, .abt-bio, .con-title, .meaning-strip, .feat-grid, .about-prev, .abt-photos, .commission-panel'
  );

  els.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1)';
  });

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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

export function initCounters() {
  const stats = document.querySelectorAll('.stat-n');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();

      if (raw === '∞' || raw === '100%' || isNaN(parseInt(raw))) return;

      const target   = parseInt(raw);
      const suffix   = raw.replace(/[0-9]/g, '');
      const duration = 1800;
      const start    = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

export function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `scale(1) translateY(${y * 0.28}px)`;
  }, { passive: true });
}

export function initPageTransition(callback) {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: #100F0D;
    z-index: 9000; pointer-events: none;
    transform: scaleY(0); transform-origin: bottom;
    transition: transform 0.42s cubic-bezier(.76,0,.24,1);
  `;
  document.body.appendChild(overlay);

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
  if (!track) return;
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}
