/**
 * ui.js — UI utilities: nav scroll, zoom, keyboard, sound toggle, toast
 */
import { sounds, toggleSound } from './sound.js';

let toastTimer = null;
let zoomPreviousFocus = null;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Focus trap for zoom modal ──
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  zoomPreviousFocus = document.activeElement;

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
  if (zoomPreviousFocus && zoomPreviousFocus.focus) {
    zoomPreviousFocus.focus();
  }
}

export function openZoom() {
  const img = document.getElementById('prodMain');
  if (!img) {
    showToast('Image not found');
    return;
  }
  // Wait if the image is still loading
  if (!img.complete || img.naturalWidth === 0) {
    showToast('Image is still loading, please try again');
    return;
  }
  const src = img.src;
  const alt = img.alt || '';
  const zmImg = document.getElementById('zmImg');
  const zm = document.getElementById('zm');
  if (!src || !zm) return;
  zmImg.src = src;
  zmImg.alt = alt;
  zm.classList.add('open');
  zm.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('zoomClose')?.focus();
  trapFocus(zm); // Trap focus inside the modal
  sounds.click();
}

export function closeZoom() {
  const zm = document.getElementById('zm');
  if (!zm) return;
  zm.classList.remove('open');
  zm.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  releaseFocus(); // Return focus to where it was
}

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 50);
  }, { passive: true });
}

export function initZoom() {
  const zoomClose = document.getElementById('zoomClose');
  const zm = document.getElementById('zm');
  if (!zoomClose || !zm) return;
  zoomClose.addEventListener('click', e => { e.stopPropagation(); closeZoom(); });
  zm.addEventListener('click', closeZoom);
}

export function initKeyboard(cartIsOpen, closeCart) {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeZoom();
    if (cartIsOpen()) closeCart();
  });
}

export function initSoundToggle() {
  const btn = document.getElementById('soundToggleBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const on = toggleSound();
    btn.setAttribute('aria-pressed', String(on));
    btn.title = on ? 'Sound on' : 'Sound off';
    btn.classList.toggle('sound-off', !on);
  });
}