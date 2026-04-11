/**
 * cart.js — Shopping bag with localStorage persistence + WebP image support
 */
import { showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';

let cart     = loadCart();
let cartOpen = false;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('paivepo_cart') || '[]');
  } catch { return []; }
}

function saveCart() {
  try { localStorage.setItem('paivepo_cart', JSON.stringify(cart)); } catch {}
}

export function isCartOpen() { return cartOpen; }

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
    setTimeout(() => document.getElementById('cartCloseBtn')?.focus(), 50);
  }
}

export function closeCart() {
  cartOpen = false;
  document.getElementById('cartSb')?.classList.remove('open');
  document.getElementById('cartOv')?.classList.remove('open');
  document.getElementById('cartSb')?.setAttribute('aria-hidden', 'true');
  document.getElementById('cartOv')?.setAttribute('aria-hidden', 'true');
  document.getElementById('cartToggleBtn')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
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
      jpg:   product.imgs[0],
      webp:  product.webp ? product.webp[0] : product.imgs[0],
    });
  }
  updateCount();
  saveCart();
  sounds.addCart();
  showToast(`"${product.name}" added to your bag`);
}

export function renderCart() {
  const body  = document.getElementById('cartBody');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty">Your bag is empty</div>';
    document.getElementById('cartTot').textContent = 'R0';
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

export function goCheckout() {
  if (!cart.length) { showToast('Your bag is empty'); return; }
  closeCart();
  document.getElementById('coContent').style.display = '';
  document.getElementById('oSuccess').classList.remove('show');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('coItems').innerHTML = cart.map(i => {
    const jpg  = i.jpg || '';
    const webp = i.webp || jpg;
    return `<div class="oi">
      <picture>
        <source srcset="${webp}" type="image/webp">
        <img class="oi-img" src="${jpg}" alt="${i.name}" width="60" height="76" loading="lazy">
      </picture>
      <div><div class="oi-name">${i.name}</div><div class="oi-qty">Qty: ${i.qty}</div></div>
      <div class="oi-price">R${(i.price * i.qty).toLocaleString()}</div>
    </div>`;
  }).join('');

  document.getElementById('coSummary').innerHTML = `
    <div class="o-row"><span>Subtotal</span><span>R${total.toLocaleString()}</span></div>
    <div class="o-row"><span>Shipping</span><span>To be arranged</span></div>
    <div class="o-row tot"><span>Total</span><span>R${total.toLocaleString()}</span></div>
  `;
  go('checkout');
}

export async function placeOrder() {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) {
    btn.disabled    = true;
    btn.textContent = 'Submitting…';
  }

  const itemsSummary = cart
    .map(i => `${i.name} ×${i.qty} — R${(i.price * i.qty).toLocaleString()}`)
    .join(' | ');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const body = new URLSearchParams({
    'form-name':      'order-enquiry',
    'bot-field':      '',
    'customer-name':
      (document.getElementById('co-fname')?.value || '').trim() + ' ' +
      (document.getElementById('co-lname')?.value || '').trim(),
    'customer-email': document.getElementById('co-email')?.value   || '',
    'customer-phone': document.getElementById('co-phone')?.value   || '',
    'address':        document.getElementById('co-address')?.value || '',
    'city':           document.getElementById('co-city')?.value    || '',
    'country':        document.getElementById('co-country')?.value || '',
    'postal-code':    document.getElementById('co-postal')?.value  || '',
    'items':          itemsSummary,
    'total':          `R${total.toLocaleString()}`,
    'notes':          document.getElementById('co-notes')?.value   || '',
  });

  try {
    const response = await fetch('/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    document.getElementById('coContent').style.display = 'none';
    document.getElementById('oSuccess').classList.add('show');
    sounds.addCart();
    cart = [];
    updateCount();
    saveCart();

  } catch (err) {
    console.error('Order submission error:', err);
    if (btn) {
      btn.disabled    = false;
      btn.textContent = 'Submit Order Enquiry';
    }
    showToast('Something went wrong — please contact Tinashe directly on WhatsApp');
  }
}

function updateCount() {
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
  document.getElementById('placeOrderBtn')?.addEventListener('click', placeOrder);
  document.getElementById('checkoutLogo')?.addEventListener('click', () => go('home'));

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
