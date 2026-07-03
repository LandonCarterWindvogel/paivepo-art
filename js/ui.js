/**
 * ui.js — UI utilities: nav scroll, zoom, keyboard, sound toggle, toast
 * Enhanced with zoom gallery navigation (arrows, keyboard, touch swipe)
 */
import { sounds, toggleSound } from './sound.js';
import { products } from './data.js';

let toastTimer = null;
let zoomPreviousFocus = null;

// ── ZOOM STATE ──
let zoomImages = [];
let zoomCurrentIndex = 0;
let zoomProductId = null;
let isZoomOpen = false;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── FOCUS TRAP ──
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

// ── UPDATE ZOOM IMAGE ──
function updateZoomImage(index) {
  if (!zoomImages.length || index < 0 || index >= zoomImages.length) return;
  zoomCurrentIndex = index;
  const img = document.getElementById('zmImg');
  const counter = document.getElementById('zoomCounter');
  const currentIdxEl = document.getElementById('zoomCurrentIdx');
  const totalIdxEl = document.getElementById('zoomTotalIdx');

  if (!img) return;

  // Fade out, change src, fade in
  img.classList.add('fading');
  setTimeout(() => {
    img.src = zoomImages[index].src;
    img.alt = zoomImages[index].alt || '';
    img.classList.remove('fading');
  }, 200);

  // Update counter
  if (counter && currentIdxEl && totalIdxEl) {
    currentIdxEl.textContent = index + 1;
    totalIdxEl.textContent = zoomImages.length;
    counter.style.display = zoomImages.length > 1 ? 'block' : 'none';
  }

  // Update main product image
  const mainImg = document.getElementById('prodMain');
  if (mainImg && mainImg.dataset.productId === String(zoomProductId)) {
    mainImg.src = zoomImages[index].src;
    mainImg.alt = zoomImages[index].alt || '';
    mainImg.dataset.imageIndex = index;

    // Update active thumbnail
    const thumbs = document.querySelectorAll('.thumb-btn');
    thumbs.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  sounds.click();
}

// ── NAVIGATION ──
export function zoomPrev() {
  if (!zoomImages.length) return;
  const newIndex = (zoomCurrentIndex - 1 + zoomImages.length) % zoomImages.length;
  updateZoomImage(newIndex);
}

export function zoomNext() {
  if (!zoomImages.length) return;
  const newIndex = (zoomCurrentIndex + 1) % zoomImages.length;
  updateZoomImage(newIndex);
}

// ── OPEN ZOOM ──
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
  const prevBtn = document.getElementById('zoomPrev');
  const nextBtn = document.getElementById('zoomNext');
  const counter = document.getElementById('zoomCounter');
  const currentIdxEl = document.getElementById('zoomCurrentIdx');
  const totalIdxEl = document.getElementById('zoomTotalIdx');

  if (!zm) return;

  // ── Detect if this product has multiple images ──
  const productId = img.dataset.productId;
  const imageIndex = parseInt(img.dataset.imageIndex) || 0;
  let hasGallery = false;
  zoomImages = [];
  zoomProductId = null;

  if (productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product && product.images && product.images.length > 1) {
      zoomImages = product.images;
      zoomProductId = parseInt(productId);
      zoomCurrentIndex = Math.min(imageIndex, zoomImages.length - 1);
      hasGallery = true;
    }
  }

  // Fallback: single image
  if (!hasGallery) {
    zoomImages = [{ src, alt }];
    zoomCurrentIndex = 0;
    zoomProductId = null;
  }

  // Set the image
  const currentImg = zoomImages[zoomCurrentIndex];
  zmImg.src = currentImg.src;
  zmImg.alt = currentImg.alt || '';

  // Show/hide arrows
  const showArrows = zoomImages.length > 1;
  if (prevBtn) prevBtn.style.display = showArrows ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = showArrows ? 'flex' : 'none';

  // Update counter
  if (counter && currentIdxEl && totalIdxEl) {
    if (showArrows) {
      currentIdxEl.textContent = zoomCurrentIndex + 1;
      totalIdxEl.textContent = zoomImages.length;
      counter.style.display = 'block';
    } else {
      counter.style.display = 'none';
    }
  }

  // Open modal
  zm.classList.add('open');
  zm.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  isZoomOpen = true;

  // Focus management
  document.getElementById('zoomClose')?.focus();
  trapFocus(zm);
  sounds.click();
}

// ── CLOSE ZOOM ──
export function closeZoom() {
  const zm = document.getElementById('zm');
  if (!zm) return;
  zm.classList.remove('open');
  zm.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  isZoomOpen = false;
  releaseFocus();
}

// ── INIT ──
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
  const prevBtn = document.getElementById('zoomPrev');
  const nextBtn = document.getElementById('zoomNext');

  if (!zoomClose || !zm) return;

  // Close on X
  zoomClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeZoom();
  });

  // Close on overlay click (background)
  zm.addEventListener('click', (e) => {
    if (e.target === zm) closeZoom();
  });

  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomPrev();
    });
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      zoomNext();
    });
  }

  // ── Keyboard support ──
  document.addEventListener('keydown', (e) => {
    if (!isZoomOpen) return;

    if (e.key === 'Escape') {
      closeZoom();
      return;
    }

    if (zoomImages.length > 1) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        zoomPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        zoomNext();
      }
    }
  });

  // ── Touch swipe support ──
  let touchStartX = 0;
  let touchStartY = 0;
  const zmImg = document.getElementById('zmImg');

  if (zmImg) {
    zmImg.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    zmImg.addEventListener('touchend', (e) => {
      if (!isZoomOpen || zoomImages.length <= 1) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          zoomNext();
        } else {
          zoomPrev();
        }
      }
    }, { passive: true });
  }

  // Close on window resize (safety)
  window.addEventListener('resize', () => {
    if (isZoomOpen) {
      // Keep open, but ensure modal is still visible
    }
  });
}

export function initKeyboard(cartIsOpen, closeCart) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isZoomOpen) {
        closeZoom();
        return;
      }
      if (cartIsOpen && cartIsOpen()) {
        closeCart();
        return;
      }
    }
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

// ── BACK TO TOP ──
export function initBackToTop() {
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

  wrapper.addEventListener('click', () => {
    sounds.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sounds.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.body.appendChild(wrapper);

  const progressCircle = document.getElementById('progress-circle');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

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