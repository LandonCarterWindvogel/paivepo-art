/**
 * ui.js — UI utilities: nav scroll, zoom, keyboard, sound toggle, toast
 * Enhanced with back-to-top button and scroll progress indicator
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
  trapFocus(zm);
  sounds.click();
}

export function closeZoom() {
  const zm = document.getElementById('zm');
  if (!zm) return;
  zm.classList.remove('open');
  zm.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  releaseFocus();
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
  zoomClose.addEventListener('click', (e) => { e.stopPropagation(); closeZoom(); });
  zm.addEventListener('click', closeZoom);
}

export function initKeyboard(cartIsOpen, closeCart) {
  document.addEventListener('keydown', (e) => {
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

// ── BACK TO TOP BUTTON WITH SCROLL PROGRESS ──
export function initBackToTop() {
  // Create the button if it doesn't exist
  if (document.getElementById('back-to-top')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'back-to-top';
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('aria-label', 'Back to top');
  wrapper.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 28px;
    z-index: 5000;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--charcoal, #1B1B1B);
    color: var(--white, #FFFFFF);
    border: 1px solid rgba(255,255,255,0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(.16,1,.3,1),
                opacity 0.4s ease,
                visibility 0.4s ease,
                background 0.3s ease,
                box-shadow 0.3s ease;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px) scale(0.9);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    pointer-events: none;
  `;

  // Scroll progress ring (SVG)
  wrapper.innerHTML = `
    <svg viewBox="0 0 48 48" style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg);">
      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5"/>
      <circle cx="24" cy="24" r="20" fill="none" stroke="var(--gold, #B89464)" stroke-width="2.5"
              stroke-dasharray="125.6" stroke-dashoffset="125.6"
              style="transition:stroke-dashoffset 0.1s ease;"
              id="progress-circle"/>
    </svg>
    <span style="
      font-size: 18px;
      line-height: 1;
      font-family: var(--font-sans, sans-serif);
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    ">↑</span>
  `;

  // Hover effect
  wrapper.addEventListener('mouseenter', () => {
    wrapper.style.background = 'var(--gold, #B89464)';
    wrapper.style.boxShadow = '0 6px 24px rgba(184,148,100,0.4)';
    wrapper.querySelector('span').style.transform = 'translateY(-2px) scale(1.1)';
  });

  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.background = 'var(--charcoal, #1B1B1B)';
    wrapper.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    wrapper.querySelector('span').style.transform = '';
  });

  // Click to scroll to top
  wrapper.addEventListener('click', () => {
    sounds.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keyboard support
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sounds.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.body.appendChild(wrapper);

  // Update visibility and progress on scroll
  const progressCircle = document.getElementById('progress-circle');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

        // Show/hide button
        if (scrollY > 400) {
          wrapper.style.opacity = '1';
          wrapper.style.visibility = 'visible';
          wrapper.style.transform = 'translateY(0) scale(1)';
          wrapper.style.pointerEvents = 'auto';
        } else {
          wrapper.style.opacity = '0';
          wrapper.style.visibility = 'hidden';
          wrapper.style.transform = 'translateY(20px) scale(0.9)';
          wrapper.style.pointerEvents = 'none';
        }

        // Update progress ring
        if (progressCircle) {
          const circumference = 125.6;
          progressCircle.style.strokeDashoffset = circumference - progress * circumference;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}