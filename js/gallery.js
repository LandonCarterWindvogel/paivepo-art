// gallery.js — Renders gallery with captions and smooth transitions
import { products, FEATURED_IDS } from './data.js';
import { showProduct } from './product.js';
import { sounds } from './sound.js';

let activeFilter = 'All';
let visibleCount = 6; // Number of items to show initially
const LOAD_MORE_STEP = 6;

export function setFilter(filter) {
  activeFilter = filter;
  visibleCount = 6; // Reset visible count when filter changes
  renderGallery();
}

export function refreshGallery() {
  renderGallery();
}

function picWithCaption(jpgSrc, webpSrc, alt, caption, cls = '', w = '', h = '', lazy = true) {
  const dims = (w && h) ? ` width="${w}" height="${h}"` : '';
  const load = lazy ? ' loading="lazy"' : '';
  const clsAttr = cls ? ` class="${cls}"` : '';
  return `<figure class="gallery-figure">
    <picture>
      <source srcset="${webpSrc}" type="image/webp">
      <img src="${jpgSrc}" alt="${alt}"${clsAttr}${dims}${load}>
    </picture>
    <figcaption>${caption}</figcaption>
  </figure>`;
}

function pic(jpgSrc, webpSrc, alt, cls = '', w = '', h = '', lazy = true) {
  const dims = (w && h) ? ` width="${w}" height="${h}"` : '';
  const load = lazy ? ' loading="lazy"' : '';
  const clsStr = cls ? ` class="${cls}"` : '';
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <img src="${webpSrc}" alt="${alt}"${clsStr}${dims}${load}>
  </picture>`;
}

function artistLabel(p) {
  if (!p.artist || p.artist === 'Paivepo Studio') return '';
  return `<span class="gal-artist">${p.artist}</span>`;
}

function getCategoryLabel(cat) {
  const map = {
    Birds: 'Beaded Sculpture',
    Wild: 'Beaded Sculpture',
    Floral: 'Beaded Sculpture',
    Wire: 'Wire Art',
    Paintings: 'Painting',
    Furniture: 'Furniture',
  };
  return map[cat] || cat;
}

export function renderFeatured() {
  const grid = document.getElementById('featGrid');
  if (!grid) return;

  grid.innerHTML = FEATURED_IDS.map((id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return '';

    const priceHTML = p.sold
      ? `<span style="text-decoration:line-through;opacity:.4">R${p.price.toLocaleString()}</span>`
      : `R${p.price.toLocaleString()}`;
    const soldBadge = p.sold
      ? '<div class="feat-sold-badge" aria-label="Sold">Sold</div>'
      : '';
    const imgAlt = p.alt || `${p.name}${p.artist ? ` by ${p.artist}` : ''} — Paivepo Art & Decor`;
    const caption = `${p.name}${p.artist ? ` by ${p.artist}` : ''}`;

    return `
      <div class="feat-item${p.sold ? ' is-sold' : ''}"
           ${p.sold ? '' : `data-prod-id="${p.id}" role="button" tabindex="0"`}
           aria-label="${p.name}${p.sold ? ' — sold' : `, R${p.price.toLocaleString()}`}">
        <div class="feat-img-wrap">
          ${picWithCaption(p.image, p.imageWebp, imgAlt, caption, 'feat-img', '800', '1000')}
        </div>
        ${soldBadge}
        <div class="feat-info" aria-hidden="true">
          <div class="feat-name">${p.name}</div>
          <div class="feat-meta">
            ${p.artist ? `<span class="feat-artist">${p.artist}</span>` : ''}
            <div class="feat-price">${priceHTML}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderGallery() {
  const availOnly = document.getElementById('availOnly')?.checked ?? false;

  let list = activeFilter === 'All'
    ? products
    : products.filter((p) => p.cat === activeFilter);

  if (availOnly) list = list.filter((p) => !p.sold);

  const totalItems = list.length;
  const hasMore = visibleCount < totalItems;
  const itemsToShow = list.slice(0, visibleCount);

  const grid = document.getElementById('galGrid');
  if (!grid) return;

  // Fade out existing items, then replace with new ones
  grid.style.transition = 'opacity 0.25s ease';
  grid.style.opacity = '0';

  setTimeout(() => {
    grid.innerHTML = itemsToShow.map(buildCard).join('');

    // Add "Load More" button if needed
    if (hasMore) {
      const loadMoreBtn = document.createElement('div');
      loadMoreBtn.className = 'load-more-wrap';
      loadMoreBtn.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px 0 20px;
      `;
      loadMoreBtn.innerHTML = `
        <button class="load-more-btn btn btn-outline" aria-label="Load more works">
          Load More
        </button>
      `;
      grid.appendChild(loadMoreBtn);
      grid.querySelector('.load-more-btn')?.addEventListener('click', () => {
        sounds.click();
        visibleCount += LOAD_MORE_STEP;
        renderGallery();
      });
    }

    // Fade in after a short delay
    requestAnimationFrame(() => {
      grid.style.opacity = '1';
    });

    syncFilterButtons();
  }, 250);
}

function buildCard(p) {
  const soldOverlay = p.sold ? `
    <div class="sold-overlay" aria-hidden="true">
      <div class="sold-label">Sold</div>
      <div class="sold-sub">This piece has found its home</div>
    </div>` : '';

  const imgAlt = p.alt || `${p.name}${p.artist ? ` by ${p.artist}` : ''} — ${p.cat}, Paivepo Art & Decor`;
  const categoryLabel = getCategoryLabel(p.cat);
  const caption = `${p.name}${p.artist ? ` by ${p.artist}` : ''}`;

  return `
    <div class="gal-card${p.sold ? ' is-sold' : ''}"
         ${p.sold ? 'aria-disabled="true"' : `data-prod-id="${p.id}" role="button" tabindex="0"`}
         aria-label="${p.name}, ${categoryLabel}${p.sold ? ', Sold' : `, R${p.price.toLocaleString()}`}">
      <div class="gal-img-wrap">
        ${picWithCaption(p.image, p.imageWebp, imgAlt, caption, 'gal-img', '600', '800', false)}
        <div class="gal-ov" aria-hidden="true">${p.sold ? '' : '<div class="gal-view">View Details</div>'}</div>
        ${soldOverlay}
      </div>
      <div class="gal-name">${p.name}</div>
      <div class="gal-meta">
        <div>
          ${p.artist && p.artist !== 'Paivepo Studio' ? `<div class="gal-artist">${p.artist}</div>` : ''}
          <span class="gal-cat-tag">${categoryLabel}</span>
        </div>
        <span class="gal-price${p.sold ? ' struck' : ''}">R${p.price.toLocaleString()}</span>
        ${p.sold ? '<span class="gal-sold-tag">Sold</span>' : ''}
      </div>
    </div>
  `;
}

function syncFilterButtons() {
  document.querySelectorAll('.f-btn').forEach((btn) => {
    const active = btn.dataset.filter === activeFilter;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

export function initGallery() {
  document.getElementById('galFilters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.f-btn');
    if (!btn) return;
    sounds.click();
    activeFilter = btn.dataset.filter;
    visibleCount = 6;
    renderGallery();
  });

  document.getElementById('availOnly')?.addEventListener('change', () => {
    visibleCount = 6;
    renderGallery();
  });

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    const id = Number(card.dataset.prodId);
    if (!isNaN(id)) showProduct(id);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    e.preventDefault();
    const id = Number(card.dataset.prodId);
    if (!isNaN(id)) showProduct(id);
  });
}