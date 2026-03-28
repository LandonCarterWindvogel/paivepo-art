import { showToast } from './ui.js';
import { go } from './router.js';

let cart = [];
let cartOpen = false;

export function isCartOpen() {
  return cartOpen;
}

export function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cartSb').classList.toggle('open', cartOpen);
  document.getElementById('cartOv').classList.toggle('open', cartOpen);
  document.body.style.overflow = cartOpen ? 'hidden' : '';
  if (cartOpen) renderCart();
}

export function closeCart() {
  cartOpen = false;
  document.getElementById('cartSb').classList.remove('open');
  document.getElementById('cartOv').classList.remove('open');
  document.body.style.overflow = '';
}

export function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartCount();
  showToast(`"${product.name}" added to your bag`);
}

export function renderCart() {
  const body = document.getElementById('cartBody');
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty">Your bag is empty</div>';
    document.getElementById('cartTot').textContent = 'R0';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="ci-img" src="${item.imgs[0]}" alt="${item.name}">
      <div>
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">R${item.price.toLocaleString()}</div>
        <div class="ci-row">
          <div class="ci-qty">
            <button class="q-btn" data-cart-action="dec" data-id="${item.id}">−</button>
            <span class="q-n">${item.qty}</span>
            <button class="q-btn" data-cart-action="inc" data-id="${item.id}">+</button>
          </div>
          <button class="ci-rm" data-cart-action="remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('cartTot').textContent = `R${total.toLocaleString()}`;
}

export function goCheckout() {
  if (!cart.length) {
    showToast('Your bag is empty');
    return;
  }
  closeCart();

  document.getElementById('coContent').style.display = '';
  document.getElementById('oSuccess').classList.remove('show');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  document.getElementById('coItems').innerHTML = cart.map(i => `
    <div class="oi">
      <img class="oi-img" src="${i.imgs[0]}" alt="${i.name}">
      <div>
        <div class="oi-name">${i.name}</div>
        <div class="oi-qty">Qty: ${i.qty}</div>
      </div>
      <div class="oi-price">R${(i.price * i.qty).toLocaleString()}</div>
    </div>
  `).join('');

  document.getElementById('coSummary').innerHTML = `
    <div class="o-row"><span>Subtotal</span><span>R${total.toLocaleString()}</span></div>
    <div class="o-row"><span>Shipping</span><span>To be arranged</span></div>
    <div class="o-row tot"><span>Total</span><span>R${total.toLocaleString()}</span></div>
  `;

  go('checkout');
}

export function placeOrder() {
  document.getElementById('coContent').style.display = 'none';
  document.getElementById('oSuccess').classList.add('show');
  cart = [];
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cc').textContent = total;
}

export function initCart() {
  document.getElementById('cartToggleBtn').addEventListener('click', toggleCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
  document.getElementById('cartOv').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', goCheckout);
  document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
  document.getElementById('checkoutLogo').addEventListener('click', () => go('home'));

  document.getElementById('cartBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-cart-action]');
    if (!btn) return;

    const id     = Number(btn.dataset.id);
    const action = btn.dataset.cartAction;
    const item   = cart.find(i => i.id === id);
    if (!item) return;

    if (action === 'inc')    { item.qty++; }
    if (action === 'dec')    { item.qty--; if (item.qty <= 0) cart = cart.filter(i => i.id !== id); }
    if (action === 'remove') { cart = cart.filter(i => i.id !== id); }

    updateCartCount();
    renderCart();
  });
}
