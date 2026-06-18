/**
 * cart.js — Shopping bag with Shopify redirect
 */
import { showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';

let cart     = loadCart();
let cartOpen = false;
let previousFocus = null;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('paivepo_cart') || '[]');
  } catch { return []; }
}

function saveCart() {
  try { localStorage.setItem('paivepo_cart', JSON.stringify(cart)); } catch {}
}

export function isCartOpen() { return cartOpen; }

function trapFocus(element) {
  const focusable = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  previousFocus = document.activeElement;

  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  element.addEventListener('keydown', handler);
  element._trapHandler = handler;
  first.focus();
}

function releaseFocus() {
  if (previousFocus && previousFocus.focus) previousFocus.focus();
}

export function toggleCart() {
  cartOpen = !cartOpen;
  const sb  = document.getElementById('cartSb');
  const ov  = document.getElementById('cartOv');
  const btn = document.getElementById('cartToggleBtn');
  sb.classList.toggle('open', cartOpen);
  ov.classList.toggle('open', cartOpen);
  sb.setAttribute('aria-hidden', String(!cartOpen));
  ov.setAttribute('aria-hidden', String(!cartOpen));
  btn.setAttribute('aria-expanded', String(cartOpen));
  document.body.style.overflow = cartOpen ? 'hidden' : '';
  if (cartOpen) {
    sounds.cartOpen();
    renderCart();
    setTimeout(() => trapFocus(sb), 50);
  } else {
    releaseFocus();
  }
}

export function closeCart() {
  if (!cartOpen) return;
  cartOpen = false;
  const sb = document.getElementById('cartSb');
  const ov = document.getElementById('cartOv');
  const btn = document.getElementById('cartToggleBtn');
  sb.classList.remove('open');
  ov.classList.remove('open');
  sb.setAttribute('aria-hidden', 'true');
  ov.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  releaseFocus();
}

export function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      qty:   1,
      jpg:   product.image,
      webp:  product.imageWebp,
      shopifyVariantId: product.shopifyVariantId || null,
    });
  }
  updateCount();
  saveCart();
  sounds.addCart();
  showToast(`"${product.name}" added to your bag`);
}

export function renderCart() {
  const body = document.getElementById('cartBody');
  if (!body) return;

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty">Your bag is empty</div>';
    document.getElementById('cartTot').textContent = 'R0';
    updateCount();
    return;
  }

  body.innerHTML = cart.map(item => {
    const jpg  = item.jpg || '';
    const webp = item.webp || jpg;
    return `<div class="cart-item">
      <picture>
        <source srcset="${webp}" type="image/webp">
        <img class="ci-img" src="${jpg}" alt="${item.name}" width="80" height="100" loading="lazy">
      </picture>
      <div>
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">R${item.price.toLocaleString()}</div>
        <div class="ci-row">
          <div class="ci-qty" role="group" aria-label="Quantity for ${item.name}">
            <button class="q-btn" data-cart-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="q-n">${item.qty}</span>
            <button class="q-btn" data-cart-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="ci-rm" data-cart-action="remove" data-id="${item.id}" aria-label="Remove ${item.name} from bag">Remove</button>
        </div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('cartTot').textContent = `R${total.toLocaleString()}`;
  updateCount();
}

// ── Redirect to Shopify checkout ──
export function goCheckout() {
  if (!cart.length) { 
    showToast('Your bag is empty');
    return;
  }

  // Check if all items have a Shopify variant ID
  const missingIds = cart.filter(item => !item.shopifyVariantId);
  if (missingIds.length) {
    console.warn('Missing Shopify variant IDs for:', missingIds.map(i => i.name).join(', '));
    showToast('Some items cannot be checked out yet – please contact us directly');
    return;
  }

  const items = cart.map(item => `${item.shopifyVariantId}:${item.qty}`).join(',');
  const shopifyStoreUrl = 'https://paivepoart.myshopify.com';
  const checkoutUrl = `${shopifyStoreUrl}/cart/${items}`;

  closeCart();

  window.location.href = checkoutUrl;
}

export function updateCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cc');
  if (el) {
    el.textContent = count;
    el.setAttribute('aria-label', `${count} items in bag`);
  }
}

export function initCart() {
  document.getElementById('cartToggleBtn')?.addEventListener('click', toggleCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOv')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', goCheckout);

  document.getElementById('cartBody')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cart-action]');
    if (!btn) return;
    sounds.click();
    const id     = Number(btn.dataset.id);
    const action = btn.dataset.cartAction;
    const item   = cart.find(i => i.id === id);
    if (!item) return;
    if (action === 'inc')    { item.qty++; }
    if (action === 'dec')    { item.qty--; if (item.qty <= 0) cart = cart.filter(i => i.id !== id); }
    if (action === 'remove') { cart = cart.filter(i => i.id !== id); }
    updateCount();
    saveCart();
    renderCart();
  });

  updateCount();
}