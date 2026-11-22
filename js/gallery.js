// gallery.js — Renders gallery with captions and smooth transitions
import { products, FEATURED_IDS } from './data.js';
import { showProduct } from './product.js';
import { sounds } from './sound.js';

let activeFilter = 'ALL WORKS';
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
  const source = webpSrc && webpSrc.toLowerCase().endsWith('.webp')
    ? `<source srcset="${webpSrc}" type="image/webp">`
    : '';
  return `<figure class="gallery-figure">
    <picture>
      ${source}
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

function getCategoryLabel(cat) {
  return cat || 'ARTWORK';
}

function formatPrice(price) {
  return price == null ? 'Price coming soon' : `R${price.toLocaleString()}`;
}

export function renderFeatured() {
  const grid = document.getElementById('featGrid');
  if (!grid) return;

  grid.innerHTML = FEATURED_IDS.map((id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return '';

    const price = formatPrice(p.price);
    const priceHTML = p.sold && p.price != null
      ? `<span style="text-decoration:line-through;opacity:.4">${price}</span>`
      : price;
    const soldBadge = p.sold
      ? '<div class="feat-sold-badge" aria-label="Sold">Sold</div>'
      : '';
    const imgAlt = p.alt || `${p.name} — Paivepo Art & Decor`;
    const caption = p.name;

    return `
      <div class="feat-item${p.sold ? ' is-sold' : ''}"
           ${p.sold ? '' : `data-prod-id="${p.id}" role="button" tabindex="0"`}
           aria-label="${p.name}${p.sold ? ' — sold' : `, ${price}`}">
        <div class="feat-img-wrap">
          ${picWithCaption(p.image, p.imageWebp, imgAlt, caption, 'feat-img', '800', '1000')}
        </div>
        ${soldBadge}
        <div class="feat-info" aria-hidden="true">
          <div class="feat-name">${p.name}</div>
          <div class="feat-meta">
            <div class="feat-price">${priceHTML}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderGallery() {
  const availOnly = document.getElementById('availOnly')?.checked ?? false;

  let list = activeFilter === 'ALL WORKS'
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
    grid.innerHTML = itemsToShow.length
      ? itemsToShow.map(buildCard).join('')
      : '<p role="status" style="grid-column:1/-1;text-align:center;padding:48px 16px;color:var(--muted);font-family:var(--font-sans);font-size:14px;">New works in this category are coming soon.</p>';

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

  const imgAlt = p.alt || `${p.name} — ${categoryLabel}, Paivepo Art & Decor`;
  const categoryLabel = getCategoryLabel(p.cat);
  const caption = p.name;

  return `
    <div class="gal-card${p.sold ? ' is-sold' : ''}"
         ${p.sold ? 'aria-disabled="true"' : `data-prod-id="${p.id}" role="button" tabindex="0"`}
         aria-label="${p.name}, ${categoryLabel}${p.sold ? ', Sold' : `, ${formatPrice(p.price)}`}">
      <div class="gal-img-wrap">
        ${picWithCaption(p.image, p.imageWebp, imgAlt, caption, 'gal-img', '600', '800', false)}
        <div class="gal-ov" aria-hidden="true">${p.sold ? '' : '<div class="gal-view">View Details</div>'}</div>
        ${soldOverlay}
      </div>
      <div class="gal-name">${p.name}</div>
      <div class="gal-meta">
        <div>
          <span class="gal-cat-tag">${categoryLabel}</span>
        </div>
        <span class="gal-price${p.sold ? ' struck' : ''}">${formatPrice(p.price)}</span>
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