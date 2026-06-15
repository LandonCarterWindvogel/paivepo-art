/**
 * router.js — SPA page-swap router with hash-based URLs
 * FIXED: Re-render gallery when gallery page becomes active
 */
import { renderGallery, setFilter } from './gallery.js';
import { sounds } from './sound.js';

let currentPage  = 'home';
let transitionFn = null;

export function setTransition(fn) {
  transitionFn = fn;
}

export function go(pageId, skipTransition = false, force = false) {
  if (pageId === currentPage && !force) return;
  if (skipTransition || !transitionFn) {
    _swap(pageId);
  } else {
    transitionFn(() => _swap(pageId));
  }
}

function _swap(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-hidden', 'true');
  });

  const next = document.getElementById(`page-${pageId}`);
  if (!next) return;
  next.classList.add('active');
  next.removeAttribute('aria-hidden');

  window.scrollTo({ top: 0, behavior: 'instant' });
  currentPage = pageId;

  // Page titles
  const titles = {
    home:     'Paivepo Art & Decor — Luxury African Art, Design & Storytelling | Plettenberg Bay',
    gallery:  'The Collection — Paivepo Art & Decor',
    artists:  'The Artists — Paivepo Art & Decor',
    about:    'Our Story — Paivepo Art & Decor',
    journal:  'Stories of Becoming — Paivepo Journal',
    contact:  'Contact & Commissions — Paivepo Art & Decor',
    checkout: 'Checkout — Paivepo Art & Decor',
    product:  document.getElementById('prodTitle')?.textContent
              ? `${document.getElementById('prodTitle').textContent} — Paivepo Art & Decor`
              : 'Work — Paivepo Art & Decor',
  };
  document.title = titles[pageId] || titles.home;

  // URL hashes
  const hashes = {
    home: '', gallery: 'gallery', artists: 'artists',
    about: 'story', journal: 'journal',
    contact: 'contact', product: 'product', checkout: 'checkout'
  };
  const hash = hashes[pageId];
  history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);

  // Screen reader announcement
  const announcer = document.getElementById('page-announcer');
  if (announcer) {
    announcer.textContent = '';
    requestAnimationFrame(() => {
      announcer.textContent = `Navigated to ${pageId} page`;
    });
  }

  // 🔧 FIX: Re-render gallery when gallery page becomes active
  if (pageId === 'gallery') {
    // Small delay to ensure the page is fully visible and DOM ready
    setTimeout(() => renderGallery(), 50);
  }
}

export function getCurrentPage() {
  return currentPage;
}

export function initRouter() {
  // SR announcer
  const ann = document.createElement('div');
  ann.id = 'page-announcer';
  ann.setAttribute('aria-live', 'polite');
  ann.setAttribute('aria-atomic', 'true');
  ann.className = 'sr-only';
  document.body.appendChild(ann);

  // Handle hash on load
  const hash = window.location.hash.replace('#', '');
  const validPages = ['gallery', 'artists', 'story', 'journal', 'contact'];
  if (validPages.includes(hash)) {
    _swap(hash === 'story' ? 'about' : hash);
  } else {
    // If no valid hash, ensure home page is active (optional)
    // _swap('home'); // uncomment if needed
  }

  // Delegate all data-page clicks
  document.body.addEventListener('click', e => {
    const target = e.target.closest('[data-page]');
    if (!target) return;

    const page   = target.dataset.page;
    const filter = target.dataset.filter;

    try { sounds.nav(); } catch (_) {}

    if (filter) setFilter(filter);

    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    go(page);
  });

  // Browser back/forward
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    _swap(hash === 'story' ? 'about' : (hash || 'home'));
  });
}