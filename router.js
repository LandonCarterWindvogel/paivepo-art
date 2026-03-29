import { renderGallery, setFilter } from './gallery.js';
import { sounds } from './sound.js';

let currentPage   = 'home';
let transitionTo  = null;

export function setTransition(fn) {
  transitionTo = fn;
}

export function go(pageId, skipTransition = false) {
  if (skipTransition || !transitionTo) {
    _swap(pageId);
  } else {
    transitionTo(() => _swap(pageId));
  }
}

function _swap(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
  window.scrollTo(0, 0);
  currentPage = pageId;
  if (pageId === 'gallery') renderGallery();
}

export function getCurrentPage() {
  return currentPage;
}

export function initRouter() {
  document.body.addEventListener('click', e => {
    const target = e.target.closest('[data-page]');
    if (!target) return;

    const page   = target.dataset.page;
    const filter = target.dataset.filter;

    sounds.nav();

    if (filter) setFilter(filter);
    go(page);
  });
}
