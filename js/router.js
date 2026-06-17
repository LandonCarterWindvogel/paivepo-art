// router.js — SPA router with dynamic meta
import { renderGallery, setFilter } from './gallery.js';
import { sounds } from './sound.js';

let currentPage  = 'home';
let transitionFn = null;

const pageTitles = {
  home:     'Paivepo Art & Decor — Premier African Art Gallery in Plettenberg Bay',
  gallery:  'African Art Gallery — Browse Paintings & Sculptures in Plettenberg Bay',
  artists:  'African Artists in Plettenberg Bay — Meet the Makers at Paivepo',
  about:    'Our Story — How Paivepo Became Plettenberg Bay\'s Premier African Art Gallery',
  journal:  'African Art Stories — Journal from Paivepo Art & Decor, Plettenberg Bay',
  contact:  'Contact Paivepo — African Art Gallery in Plettenberg Bay, Old Nick Village',
  checkout: 'Checkout — Secure Art Order | Paivepo, Plettenberg Bay',
  product:  'Work — Paivepo Art & Decor'
};

const pageDescriptions = {
  home:     'Discover African art at Paivepo, Plettenberg Bay\'s premier gallery. View wildlife paintings, handmade beaded sculptures & furniture. Visit Old Nick Village.',
  gallery:  'Shop African art at Paivepo: wildlife paintings, beaded sculptures, wire art & furniture. Handmade in South Africa. Visit our Plettenberg Bay gallery.',
  artists:  'Meet the African artists behind Paivepo: William Mwale, Allick & Tinashe Kachama. Based at Old Nick Village, Plettenberg Bay. Visit the studio.',
  about:    'From a grandmother\'s Shona word to Plettenberg Bay\'s premier African art gallery. Discover the story behind Paivepo Art & Decor at Old Nick Village.',
  journal:  'Read stories from African artists at Paivepo. Behind-the-scenes, artist journeys, and the inspiration behind our Plettenberg Bay gallery\'s works.',
  contact:  'Visit Paivepo Art & Decor at Old Nick Village, Plettenberg Bay. Commission custom African art, inquire about pieces, or just say hello. Open daily 9am-5pm.',
  checkout: 'Complete your order for African art from Paivepo, Plettenberg Bay. We\'ll confirm your purchase and arrange shipping within 24 hours.',
  product:  'Handcrafted African art from Paivepo, Plettenberg Bay. Browse unique wildlife paintings, beaded sculptures, and furniture. Visit our gallery.'
};

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
}

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

  // Set title and description
  let title = pageTitles[pageId] || pageTitles.home;
  let desc  = pageDescriptions[pageId] || pageDescriptions.home;

  if (pageId === 'product') {
    title = getProductTitle();
    desc  = getProductDescription();
  }

  updateMeta(title, desc);

  // URL hash
  const hashes = {
    home: '', gallery: 'gallery', artists: 'artists',
    about: 'story', journal: 'journal',
    contact: 'contact', product: 'product', checkout: 'checkout'
  };
  const hash = hashes[pageId];
  history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);

  // Screen reader announcer
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

  const hash = window.location.hash.replace('#', '');
  const validPages = ['gallery', 'artists', 'story', 'journal', 'contact'];
  if (validPages.includes(hash)) {
    _swap(hash === 'story' ? 'about' : hash);
  }

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

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    _swap(hash === 'story' ? 'about' : (hash || 'home'));
  });
}