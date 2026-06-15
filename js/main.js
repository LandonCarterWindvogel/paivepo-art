import { initRouter, setTransition }                          from './router.js';
import { initCursor }                                         from './cursor.js';
import { initNav, initZoom, initKeyboard, initSoundToggle }  from './ui.js';
import { initGallery, renderGallery, renderFeatured }        from './gallery.js';
import { initCart, isCartOpen, closeCart }                   from './cart.js';
import { initProduct }                                       from './product.js';
import { sounds, initSound }                                 from './sound.js';
import { initScrollReveal, initCounters, initParallax,
         initPageTransition, initSplitText,
         initHorizontalMarquee }                             from './animations.js';
import { initMobileMenu }                                    from './mobile-menu.js';
import { initContactForm }                                   from './forms.js';
import { initWishlist }                                      from './wishlist.js';

// ── Core init ──
initSound();
initRouter();
initCursor();
initNav();
initZoom();
initGallery();
initCart();
initProduct();
initSoundToggle();
initMobileMenu();
initWishlist();

// ── Page transitions ──
const transitionTo = initPageTransition();
setTransition(transitionTo);

// ── Keyboard & focus ──
initKeyboard(isCartOpen, closeCart);

// ── Render dynamic content ──
renderGallery();
renderFeatured();
initContactForm();
initSplitText();
initHorizontalMarquee();

// Make lazy-loaded images visible by adding .loaded class on load
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if (img.complete && img.naturalWidth !== 0) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.classList.add('loaded')); // optional: show broken image
  }
});

// If the initial page is gallery (hash), ensure it renders again after a tiny delay
if (window.location.hash === '#gallery') {
  setTimeout(() => renderGallery(), 100);
}

// ── Deferred heavy work ──
setTimeout(initScrollReveal, 120);
setTimeout(initCounters, 200);
setTimeout(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    initParallax();
  }
}, 300);

// ── Nav dark/light state over hero ──
(function initNavState() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function update() {
    const isHome = document.querySelector('#page-home.active');
    const scrolled = window.scrollY > 60;

    if (scrolled) {
      nav.classList.remove('nav-top', 'nav-dark');
      nav.classList.add('nav-scrolled');
    } else if (isHome) {
      nav.classList.remove('nav-scrolled');
      nav.classList.add('nav-top', 'nav-dark');
    } else {
      nav.classList.remove('nav-top', 'nav-dark');
      nav.classList.add('nav-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  document.body.addEventListener('click', e => {
    if (e.target.closest('[data-page]')) {
      setTimeout(update, 50);
    }
  });
  update();
})();

// ── Newsletter form ──
(function initNewsletter() {
  const form = document.querySelector('.nl-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.nl-btn');
    const orig = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;

    try {
      const body = new URLSearchParams(new FormData(form));
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      btn.textContent = 'Subscribed ✓';
      form.querySelector('.nl-input').value = '';
    } catch {
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
})();

// ── Footer year (all pages) ──
const year = new Date().getFullYear();
document.querySelectorAll('#footerYear, .footerYear').forEach(el => {
  el.textContent = year;
});
