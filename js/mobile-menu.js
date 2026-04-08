/**
 * mobile-menu.js — Hamburger + slide-in drawer
 * Fixed: robust open/close, correct z-index, overlay click, focus management
 */
let menuOpen = false;

export function initMobileMenu() {
  const btn     = document.getElementById('hamburgerBtn');
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mmOverlay');
  const close   = document.getElementById('mmClose');

  if (!btn || !menu) return;

  // Ensure menu starts hidden with correct state
  menu.style.display = 'none';
  menu.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.classList.remove('open');

  function openMenu() {
    menuOpen = true;
    menu.style.display = 'block';
    // Force reflow so animation plays correctly
    menu.offsetHeight; // eslint-disable-line no-unused-expressions
    document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('open');
    menu.removeAttribute('aria-hidden');
    // Focus the close button after display is shown
    requestAnimationFrame(() => {
      if (close) close.focus();
    });
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    document.body.style.overflow = '';
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');

    // Animate the drawer out, then hide the container
    const drawer = menu.querySelector('.mm-drawer');
    if (drawer) {
      drawer.style.animation = 'mmSlideOut .28s cubic-bezier(.76,0,.24,1) forwards';
      setTimeout(() => {
        menu.style.display = 'none';
        drawer.style.animation = '';
      }, 300);
    } else {
      menu.style.display = 'none';
    }

    // Return focus to hamburger button
    requestAnimationFrame(() => {
      if (btn) btn.focus();
    });
  }

  // Toggle on hamburger click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  // Close on X button
  if (close) {
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close when a menu link is clicked (navigation will handle the rest)
  menu.querySelectorAll('.mm-link, .btn[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      setTimeout(closeMenu, 80);
    });
  });

  // Escape key closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // Focus trap inside menu
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !menuOpen) return;
    const focusable = Array.from(
      menu.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
