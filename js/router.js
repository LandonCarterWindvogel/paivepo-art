/**
 * router.js — SPA page-swap router with hash-based URLs
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

  // Update document title per page
  const titles = {
    home:     'Paivepo Art & Decor — Handmade Beaded Animal Sculptures | Plettenberg Bay',
    gallery:  'The Collection — Paivepo Art & Decor',
    product:  document.getElementById('prodTitle')?.textContent
              ? `${document.getElementById('prodTitle').textContent} — Paivepo Art & Decor`
              : 'Sculpture — Paivepo Art & Decor',
    about:    'The Artist — Tinashe Kachama | Paivepo Art & Decor',
    contact:  'Contact & Commissions — Paivepo Art & Decor',
    checkout: 'Checkout — Paivepo Art & Decor',
  };
  document.title = titles[pageId] || titles.home;

  // Update URL hash
  const hashes = { home: '', gallery: 'gallery', about: 'about', contact: 'contact', product: 'product', checkout: 'checkout' };
  const hash = hashes[pageId];
  history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);

  // Announce page change to screen readers
  const announcer = document.getElementById('page-announcer');
  if (announcer) {
    announcer.textContent = '';
    requestAnimationFrame(() => {
      announcer.textContent = `Navigated to ${pageId} page`;
    });
  }

  if (pageId === 'gallery') renderGallery();
}

export function getCurrentPage() {
  return currentPage;
}

export function initRouter() {
  // Create SR announcer
  const ann = document.createElement('div');
  ann.id = 'page-announcer';
  ann.setAttribute('aria-live', 'polite');
  ann.setAttribute('aria-atomic', 'true');
  ann.className = 'sr-only';
  document.body.appendChild(ann);

  // Handle hash on load
  const hash = window.location.hash.replace('#', '');
  const validPages = ['gallery', 'about', 'contact'];
  if (validPages.includes(hash)) {
    _swap(hash);
  }

  // Delegate all data-page clicks
  document.body.addEventListener('click', e => {
    const target = e.target.closest('[data-page]');
    if (!target) return;

    const page   = target.dataset.page;
    const filter = target.dataset.filter;

    // Play nav sound safely — never block navigation if audio fails
    try { sounds.nav(); } catch (_) {}

    if (filter) setFilter(filter);

    // Allow re-clicking the same page (e.g. logo → home resets scroll)
    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    go(page);
  });

  // Browser back/forward
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    _swap(hash || 'home');
  });
}
