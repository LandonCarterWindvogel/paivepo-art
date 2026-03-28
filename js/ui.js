let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

export function openZoom() {
  const src = document.getElementById('prodMain').src;
  document.getElementById('zmImg').src = src;
  document.getElementById('zm').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeZoom() {
  document.getElementById('zm').classList.remove('open');
  document.body.style.overflow = '';
}

export function initNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
  });
}

export function initZoom() {
  document.getElementById('zoomClose').addEventListener('click', e => {
    e.stopPropagation();
    closeZoom();
  });
  document.getElementById('zm').addEventListener('click', closeZoom);
}

export function initKeyboard(cartIsOpen, closeCart) {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeZoom();
    if (cartIsOpen()) closeCart();
  });
}
