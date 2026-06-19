import { initRouter, setTransition } from './router.js';
import { initCursor } from './cursor.js';
import { initNav, initZoom, initKeyboard, initSoundToggle, initBackToTop } from './ui.js';
import { initGallery, renderGallery, renderFeatured } from './gallery.js';
import { initCart, isCartOpen, closeCart } from './cart.js';
import { initProduct } from './product.js';
import { sounds, initSound } from './sound.js';
import {
  initScrollReveal,
  initCounters,
  initParallax,
  initPageTransition,
  initHorizontalMarquee,
} from './animations.js';
import { initMobileMenu } from './mobile-menu.js';
import { initContactForm } from './forms.js';
import { initWishlist } from './wishlist.js';

// ── LOADING SCREEN ──
function initLoadingScreen() {
  if (document.getElementById('loading-screen')) return;

  const loadingScreen = document.createElement('div');
  loadingScreen.id = 'loading-screen';
  loadingScreen.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: var(--ivory, #F5F2EC);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: opacity 0.8s cubic-bezier(.16,1,.3,1), visibility 0.8s ease;
    opacity: 1;
    visibility: visible;
  `;

  loadingScreen.innerHTML = `
    <div class="loader" style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    ">
      <div class="loader-text" style="
        font-family: var(--font-serif, 'Cormorant Garamond', serif);
        font-size: clamp(24px, 4vw, 48px);
        font-weight: 300;
        letter-spacing: 0.2em;
        color: var(--charcoal, #1B1B1B);
      ">PAIVEPO</div>
      <div class="loader-dots" style="
        display: flex;
        gap: 10px;
      ">
        <span style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold, #B89464);
          animation: loaderBounce 1.2s ease-in-out infinite;
          animation-delay: 0s;
        "></span>
        <span style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold, #B89464);
          animation: loaderBounce 1.2s ease-in-out infinite;
          animation-delay: 0.2s;
        "></span>
        <span style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold, #B89464);
          animation: loaderBounce 1.2s ease-in-out infinite;
          animation-delay: 0.4s;
        "></span>
      </div>
    </div>
  `;

  // Inject loader keyframes if not already present
  if (!document.getElementById('loader-keyframes')) {
    const style = document.createElement('style');
    style.id = 'loader-keyframes';
    style.textContent = `
      @keyframes loaderBounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1.2); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(loadingScreen);

  // Hide loading screen when page is fully loaded
  function hideLoading() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    screen.style.opacity = '0';
    screen.style.visibility = 'hidden';
    setTimeout(() => {
      screen.remove();
    }, 900);
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoading, 300);
  } else {
    window.addEventListener('load', hideLoading);
    setTimeout(hideLoading, 4000);
  }
}

// ── BLUR-UP IMAGE LOADING ──
function initBlurUpImages() {
  const images = document.querySelectorAll('img[loading="lazy"], img:not([loading])');

  images.forEach(img => {
    if (img.closest('.loader-dots')) return;
    if (img.dataset.blurProcessed) return;

    img.dataset.blurProcessed = 'true';

    img.classList.add('blur-up');

    if (img.complete && img.naturalWidth !== 0) {
      img.classList.add('loaded');
      img.classList.remove('blur-up');
      return;
    }

    img.addEventListener('load', () => {
      img.classList.add('loaded');
      img.classList.remove('blur-up');
    });

    img.addEventListener('error', () => {
      img.classList.remove('blur-up');
      img.classList.add('loaded');
    });
  });
}

// ── CORE INIT ──
initLoadingScreen();
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
initBackToTop();

// ── Page transitions ──
const transitionTo = initPageTransition();
setTransition(transitionTo);

// ── Keyboard & focus ──
initKeyboard(isCartOpen, closeCart);

// ── Render dynamic content ──
renderGallery();
renderFeatured();
initContactForm();
initHorizontalMarquee();

// ── Image loading (blur-up) ──
initBlurUpImages();

// Watch for dynamically added images
const observer = new MutationObserver(() => {
  initBlurUpImages();
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// ── If gallery hash, re-render ──
if (window.location.hash === '#gallery') {
  setTimeout(() => renderGallery(), 100);
}

// ── Deferred heavy work ──
setTimeout(initScrollReveal, 200);
setTimeout(initCounters, 300);
setTimeout(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    initParallax();
  }
}, 400);

// ── Nav dark/light state ──
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
  document.body.addEventListener('click', (e) => {
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
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.nl-btn');
    const orig = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;

    try {
      const body = new URLSearchParams(new FormData(form));
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      btn.textContent = 'Subscribed ✓';
      form.querySelector('.nl-input').value = '';
    } catch {
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
})();

const year = new Date().getFullYear();
document.querySelectorAll('#footerYear, .footerYear').forEach((el) => {
  el.textContent = year;
});