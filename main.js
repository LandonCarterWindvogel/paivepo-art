import { initRouter, setTransition }                          from './router.js';
import { initCursor }                                          from './cursor.js';
import { initNav, initZoom, initKeyboard, initSoundToggle }   from './ui.js';
import { initGallery, renderGallery, renderFeatured }         from './gallery.js';
import { initCart, isCartOpen, closeCart }                    from './cart.js';
import { initProduct }                                        from './product.js';
import { showToast }                                          from './ui.js';
import { sounds, initSound }                                  from './sound.js';
import { initScrollReveal, initCounters, initParallax,
         initPageTransition, initSplitText,
         initHorizontalMarquee }                              from './animations.js';

initSound();
initRouter();
initCursor();
initNav();
initZoom();
initGallery();
initCart();
initProduct();
initSoundToggle();
initParallax();
initSplitText();
initHorizontalMarquee();

const transitionTo = initPageTransition();
setTransition(transitionTo);

initKeyboard(isCartOpen, closeCart);

renderGallery();
renderFeatured();

setTimeout(initScrollReveal, 100);
setTimeout(initCounters, 200);

document.getElementById('contactSubmitBtn').addEventListener('click', function () {
  sounds.addCart();
  this.textContent      = 'Message Sent ✓';
  this.style.background = 'var(--dark)';
  this.disabled         = true;
  showToast('Message sent — Tinashe will reply within 48 hours');
  setTimeout(() => {
    this.textContent      = 'Send Message';
    this.style.background = '';
    this.disabled         = false;
  }, 4000);
});
