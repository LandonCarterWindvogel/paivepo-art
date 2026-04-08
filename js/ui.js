/**
 * ui.js — UI utilities: nav scroll, zoom, keyboard, sound toggle, toast
 */
import { sounds, toggleSound } from './sound.js';

let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

export function openZoom() {
  const src  = document.getElementById('prodMain')?.src;
  const alt  = document.getElementById('prodMain')?.alt || '';
  const zmImg = document.getElementById('zmImg');
  const zm   = document.getElementById('zm');
  if (!src || !zm) return;
  zmImg.src = src;
  zmImg.alt = alt;
  zm.classList.add('open');
  zm.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('zoomClose')?.focus();
  sounds.click();
}

export function closeZoom() {
  const zm = document.getElementById('zm');
  if (!zm) return;
  zm.classList.remove('open');
  zm.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
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
    btn.classList.toggle('muted', !on);
  });
}
