/**
 * cart.js — Shopping bag with Shopify redirect
 * Enhanced with bead burst, smooth animations, and premium feedback
 */
import { showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';
import { burstBeads } from './cursor.js';

let cart = loadCart();
let cartOpen = false;
let previousFocus = null;

// ── LOAD / SAVE ──
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('paivepo_cart') || '[]');
  } catch { return []; }
}

function saveCart() {
  try { localStorage.setItem('paivepo_cart', JSON.stringify(cart)); } catch {}
}

export function isCartOpen() { return cartOpen; }

// ── FOCUS TRAP ──
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

// ── TOGGLE CART ──
export function toggleCart() {
  cartOpen = !cartOpen;
  const sb = document.getElementById('cartSb');
  const ov = document.getElementById('cartOv');
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

// ── ADD TO CART ──
export function addToCart(product) {
  const existing = cart.find((i) => i.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      jpg: product.image,
      webp: product.imageWebp,
      shopifyVariantId: product.shopifyVariantId || null,
    });
  }

  updateCount();
  saveCart();
  sounds.addCart();

  // ── BEAD BURST ON ADD ──
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  burstBeads(x, y, 15);

  showToast(`"${product.name}" added to your bag`);
}

// ── RENDER CART ──
export function renderCart() {
  const body = document.getElementById('cartBody');
  if (!body) return;

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty" style="
        text-align: center;
        padding: 60px 20px;
        font-family: var(--font-serif);
        font-size: 18px;
        color: var(--muted);
        font-style: italic;
      ">
        <span style="font-size: 48px; display: block; margin-bottom: 16px;">🛒</span>
        Your bag is empty
        <p style="
          font-family: var(--font-sans);
          font-size: 13px;
          font-style: normal;
          margin-top: 12px;
          color: var(--muted-lt);
        ">
          Discover something beautiful
        </p>
      </div>
    `;
    document.getElementById('cartTot').textContent = 'R0';
    updateCount();
    return;
  }

  body.innerHTML = cart
    .map((item) => {
      const jpg = item.jpg || '';
      const webp = item.webp || jpg;
      return `
        <div class="cart-item" style="
          display: flex;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--ivory-border);
          animation: fadeUp 0.3s cubic-bezier(.16,1,.3,1) both;
        ">
          <picture style="flex-shrink:0;">
            <source srcset="${webp}" type="image/webp">
            <img class="ci-img" src="${jpg}" alt="${item.name}" width="80" height="100" loading="lazy" style="width:72px; height:90px; object-fit:cover; border-radius:1px;">
          </picture>
          <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="ci-name" style="font-family:var(--font-serif); font-size:15px; margin-bottom:4px;">${item.name}</div>
              <div class="ci-price" style="font-size:13px; color:var(--muted); margin-bottom:8px;">R${item.price.toLocaleString()}</div>
            </div>
            <div class="ci-row" style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <div class="ci-qty" role="group" aria-label="Quantity for ${item.name}" style="display:flex; align-items:center; gap:8px; font-family:var(--font-sans); font-size:13px; color:var(--muted);">
                <button class="q-btn" data-cart-action="dec" data-id="${item.id}" aria-label="Decrease quantity" style="
                  width:28px; height:28px; border:1px solid var(--ivory-border); border-radius:50%;
                  background:var(--white); color:var(--charcoal); font-size:16px;
                  transition:all 0.2s;
                  display:flex; align-items:center; justify-content:center;
                ">−</button>
                <span class="q-n" style="min-width:20px; text-align:center;">${item.qty}</span>
                <button class="q-btn" data-cart-action="inc" data-id="${item.id}" aria-label="Increase quantity" style="
                  width:28px; height:28px; border:1px solid var(--ivory-border); border-radius:50%;
                  background:var(--white); color:var(--charcoal); font-size:16px;
                  transition:all 0.2s;
                  display:flex; align-items:center; justify-content:center;
                ">+</button>
              </div>
              <button class="ci-rm" data-cart-action="remove" data-id="${item.id}" aria-label="Remove ${item.name} from bag" style="
                font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted);
                transition:color .2s;
              ">Remove</button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  document.getElementById('cartTot').textContent = `R${total.toLocaleString()}`;
  updateCount();
}

// ── SHOPIFY CHECKOUT ──
export function goCheckout() {
  if (!cart.length) {
    showToast('Your bag is empty');
    return;
  }

  const missingIds = cart.filter((item) => !item.shopifyVariantId);
  if (missingIds.length) {
    console.warn('Missing Shopify variant IDs for:', missingIds.map((i) => i.name).join(', '));
    showToast('Some items cannot be checked out yet – please contact us directly');
    return;
  }

  const items = cart.map((item) => `${item.shopifyVariantId}:${item.qty}`).join(',');
  // ── Replace with your actual Shopify store URL ──
  const shopifyStoreUrl = 'https://paivepoart.myshopify.com';
  const checkoutUrl = `${shopifyStoreUrl}/cart/${items}`;

  closeCart();

  // ── Burst beads before redirect ──
  burstBeads(window.innerWidth / 2, window.innerHeight / 2, 20);

  setTimeout(() => {
    window.location.href = checkoutUrl;
  }, 300);
}

// ── UPDATE COUNT ──
export function updateCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cc');
  if (el) {
    el.textContent = count;
    el.setAttribute('aria-label', `${count} items in bag`);
  }
}

// ── INIT ──
export function initCart() {
  document.getElementById('cartToggleBtn')?.addEventListener('click', toggleCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOv')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', goCheckout);

  document.getElementById('cartBody')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cart-action]');
    if (!btn) return;
    sounds.click();
    const id = Number(btn.dataset.id);
    const action = btn.dataset.cartAction;
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    // ── Animate quantity change ──
    const qtyEl = btn.closest('.ci-qty')?.querySelector('.q-n');
    if (qtyEl) {
      qtyEl.style.transform = 'scale(1.4)';
      setTimeout(() => { qtyEl.style.transform = 'scale(1)'; }, 150);
    }

    if (action === 'inc') {
      item.qty++;
    } else if (action === 'dec') {
      item.qty--;
      if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    } else if (action === 'remove') {
      cart = cart.filter((i) => i.id !== id);
    }

    updateCount();
    saveCart();
    renderCart();
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + B to toggle cart
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      toggleCart();
    }
    // Escape to close cart (handled in ui.js)
  });

  updateCount();
}