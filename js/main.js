/**
 * Paivepo Art & Decor — main.js
 * Entry point — imports and initialises all modules
 */
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

const transitionTo = initPageTransition();
setTransition(transitionTo);

initKeyboard(isCartOpen, closeCart);

renderGallery();
renderFeatured();
initContactForm();
initSplitText();
initHorizontalMarquee();

setTimeout(initScrollReveal, 120);
setTimeout(initCounters, 200);
setTimeout(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    initParallax();
  }
}, 300);

document.getElementById('footerYear').textContent = new Date().getFullYear();
document.querySelectorAll('.footerYear').forEach(el => {
  el.textContent = new Date().getFullYear();
});
