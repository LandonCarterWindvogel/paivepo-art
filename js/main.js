import { initRouter }              from './router.js';
import { initCursor }              from './cursor.js';
import { initNav, initZoom, initKeyboard } from './ui.js';
import { initGallery, renderGallery }      from './gallery.js';
import { initCart, isCartOpen, closeCart } from './cart.js';
import { initProduct }             from './product.js';
import { showToast }               from './ui.js';

initRouter();
initCursor();
initNav();
initZoom();
initGallery();
initCart();
initProduct();
initKeyboard(isCartOpen, closeCart);

renderGallery();

document.getElementById('contactSubmitBtn').addEventListener('click', function () {
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
