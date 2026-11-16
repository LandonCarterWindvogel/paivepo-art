// router.js — SPA router with auto‑detected base path for GitHub Pages + Netlify compatibility
import { renderGallery, setFilter } from './gallery.js';
import { sounds } from './sound.js';
import { showProduct } from './product.js';

let currentPage = 'home';
let transitionFn = null;

const pageTitles = {
  home: 'Paivepo Art & Decor — Premier African Art Gallery in Plettenberg Bay',
  gallery: 'African Art Gallery — Browse Paintings & Sculptures in Plettenberg Bay',
  artists: 'African Artists in Plettenberg Bay — Meet the Makers at Paivepo',
  about: 'Our Story — How Paivepo Became Plettenberg Bay\'s Premier African Art Gallery',
  journal: 'African Art Stories — Journal from Paivepo Art & Decor, Plettenberg Bay',
  contact: 'Contact Paivepo — African Art Gallery in Plettenberg Bay, Old Nick Village',
  product: 'Work — Paivepo Art & Decor'
};

const pageDescriptions = {
  home: 'Discover African art at Paivepo, Plettenberg Bay\'s premier gallery. View wildlife paintings and handmade beaded sculptures. Visit Old Nick Village.',
  gallery: 'Shop African art at Paivepo: wildlife paintings, beaded sculptures, and wire art. Handmade in South Africa. Visit our Plettenberg Bay gallery.',
  artists: 'Meet the African artists behind Paivepo: William Mwale, Allick & Tinashe Kachama. Based at Old Nick Village, Plettenberg Bay. Visit the studio.',
  about: 'From a grandmother\'s Shona word to Plettenberg Bay\'s premier African art gallery. Discover the story behind Paivepo Art & Decor at Old Nick Village.',
  journal: 'Read stories from African artists at Paivepo. Behind-the-scenes, artist journeys, and the inspiration behind our Plettenberg Bay gallery\'s works.',
  contact: 'Visit Paivepo Art & Decor at Old Nick Village, Plettenberg Bay. Commission custom African art, inquire about pieces, or just say hello. Open daily 9am-5pm.',
  product: 'Handcrafted African art from Paivepo, Plettenberg Bay. Browse unique wildlife paintings and beaded sculptures. Visit our gallery.'
};

const canonicalUrls = {
  home: 'https://paivepo.co.za/',
  gallery: 'https://paivepo.co.za/gallery',
  artists: 'https://paivepo.co.za/artists',
  about: 'https://paivepo.co.za/story',
  journal: 'https://paivepo.co.za/journal',
  contact: 'https://paivepo.co.za/contact',
  product: 'https://paivepo.co.za/product'
};

const cleanPaths = {
  home: '/',
  gallery: '/gallery',
  artists: '/artists',
  about: '/story',
  journal: '/journal',
  contact: '/contact',
  product: '/product'
};

// ── AUTO‑DETECT BASE PATH ──
// Works for: localhost (root), Netlify (root), GitHub Pages (/paivepo-art/)
const BASE_PATH = (() => {
  const path = window.location.pathname;
  // If the URL contains the known repo name, use it as the base
  if (path.startsWith('/paivepo-art')) {
    return '/paivepo-art';
  }
  return '';
})();

function getPageIdFromPath(path) {
  // Strip BASE_PATH from the path if present
  let clean = path;
  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    clean = path.slice(BASE_PATH.length) || '/';
  }
  // Remove trailing slash
  clean = clean.replace(/\/$/, '') || '/';

  const map = {
    '/': 'home',
    '/gallery': 'gallery',
    '/artists': 'artists',
    '/story': 'about',
    '/journal': 'journal',
    '/contact': 'contact',
    '/product': 'product'
  };
  return map[clean] || 'home';
}

function getProductTitle() {
  const el = document.getElementById('prodTitle');
  return el && el.textContent ? `${el.textContent} — Handmade African Art | Paivepo, Plettenberg Bay` : pageTitles.product;
}

function getProductDescription() {
  const el = document.getElementById('prodDesc');
  if (el && el.textContent) {
    const desc = el.textContent.slice(0, 120);
    return `${desc}... Browse more African art at Paivepo, Plettenberg Bay.`;
  }
  return pageDescriptions.product;
}

function updateMeta(title, description) {
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = description;
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
}

function setCanonical(pageId, productId = null) {
  const existing = document.querySelector('link[rel="canonical"]');
  if (existing) existing.remove();

  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = canonicalUrls[pageId] || 'https://paivepo.co.za/';
  if (pageId === 'product' && productId !== null) {
    link.href += `?id=${encodeURIComponent(productId)}`;
  }
  document.head.appendChild(link);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', link.href);
}

export function setTransition(fn) {
  transitionFn = fn;
}

export function go(pageId, skipTransition = false, force = false, historyMode = 'push', productId = null) {
  if (pageId === currentPage && !force) return;
  if (skipTransition || !transitionFn) {
    _swap(pageId, historyMode, productId);
  } else {
    transitionFn(() => _swap(pageId, historyMode, productId));
  }
}

function _swap(pageId, historyMode = 'push', productId = null) {
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-hidden', 'true');
    const focusable = p.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
    focusable.forEach(el => {
      if (el === document.activeElement) {
        el.blur();
      }
    });
  });

  const next = document.getElementById(`page-${pageId}`);
  if (!next) return;
  next.classList.add('active');
  next.removeAttribute('aria-hidden');

  const focusTarget = next.querySelector('h1, h2, [data-page="home"], .pg-hero, .hero-cnt');
  if (focusTarget && focusTarget !== document.activeElement) {
    if (focusTarget.hasAttribute('tabindex') || focusTarget.tagName.match(/^H[1-6]$/)) {
      focusTarget.focus({ preventScroll: true });
    } else {
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
      setTimeout(() => {
        focusTarget.removeAttribute('tabindex');
      }, 100);
    }
  } else {
    const logo = document.getElementById('navLogo');
    if (logo) logo.focus({ preventScroll: true });
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  currentPage = pageId;

  let title = pageTitles[pageId] || pageTitles.home;
  let desc = pageDescriptions[pageId] || pageDescriptions.home;

  if (pageId === 'product') {
    title = getProductTitle();
    desc = getProductDescription();
  }

  const targetPath = BASE_PATH + (cleanPaths[pageId] || '/');
  const targetUrl = pageId === 'product' && productId !== null
    ? `${targetPath}?id=${encodeURIComponent(productId)}`
    : targetPath;
  if (historyMode === 'replace') {
    history.replaceState(null, '', targetUrl);
  } else {
    history.pushState(null, '', targetUrl);
  }

  updateMeta(title, desc);
  setCanonical(pageId, productId);

  const announcer = document.getElementById('page-announcer');
  if (announcer) {
    announcer.textContent = '';
    requestAnimationFrame(() => {
      announcer.textContent = `Navigated to ${pageId} page`;
    });
  }

  if (pageId === 'gallery') {
    setTimeout(() => renderGallery(), 50);
  }
}

export function getCurrentPage() {
  return currentPage;
}

export function initRouter() {
  const ann = document.createElement('div');
  ann.id = 'page-announcer';
  ann.setAttribute('aria-live', 'polite');
  ann.setAttribute('aria-atomic', 'true');
  ann.className = 'sr-only';
  document.body.appendChild(ann);

  // ── Initial page from URL (auto‑detects base path) ──
  const initialPage = getPageIdFromPath(window.location.pathname);
  if (initialPage === 'product') {
    const rawProductId = new URLSearchParams(window.location.search).get('id');
    if (rawProductId && /^\d+$/.test(rawProductId)) {
      if (!showProduct(Number(rawProductId), 'replace')) _swap('gallery', 'replace');
    } else {
      _swap('gallery', 'replace');
    }
  } else {
    _swap(initialPage);
  }

  document.body.addEventListener('click', e => {
    const target = e.target.closest('[data-page]');
    if (!target) return;

    const page = target.dataset.page;
    const filter = target.dataset.filter;

    try { sounds.nav(); } catch (_) {}

    if (filter) setFilter(filter);

    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    go(page);
  });

  window.addEventListener('popstate', () => {
    const page = getPageIdFromPath(window.location.pathname);
    if (page === 'product') {
      const rawProductId = new URLSearchParams(window.location.search).get('id');
      if (rawProductId && /^\d+$/.test(rawProductId)) {
        if (!showProduct(Number(rawProductId), 'replace')) _swap('gallery', 'replace');
      } else {
        _swap('gallery', 'replace');
      }
      return;
    }
    _swap(page, 'replace');
  });
}