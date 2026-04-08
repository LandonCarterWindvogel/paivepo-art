/**
 * gallery.js — Gallery rendering with WebP picture elements + keyboard accessibility
 */
import { products } from './data.js';
import { showProduct } from './product.js';
import { sounds } from './sound.js';

const FEATURED_IDS = [0, 3, 4, 1];
let activeFilter = 'All';

export function setFilter(filter) {
  activeFilter = filter;
}

/* Helper: emit a <picture> with WebP source + JPG fallback */
function pic(webpSrc, jpgSrc, alt, cls = '', w = '', h = '', lazy = true) {
  const dims   = (w && h) ? ` width="${w}" height="${h}"` : '';
  const load   = lazy ? ' loading="lazy"' : '';
  const clsAttr = cls ? ` class="${cls}"` : '';
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <img src="${jpgSrc}" alt="${alt}"${clsAttr}${dims}${load}>
  </picture>`;
}

export function renderFeatured() {
  const grid = document.getElementById('featGrid');
  if (!grid) return;

  grid.innerHTML = FEATURED_IDS.map(id => {
    const p = products.find(x => x.id === id);
    if (!p) return '';

    const priceHTML = p.sold
      ? `<span style="text-decoration:line-through;opacity:.45">R${p.price.toLocaleString()}</span>`
      : `R${p.price.toLocaleString()}`;
    const soldBadge = p.sold ? '<div class="feat-sold-badge">Sold</div>' : '';
    const imgAlt = `${p.name} — handmade beaded sculpture by Tinashe Kachama`;

    return `
      <div class="feat-item${p.sold ? ' is-sold' : ''}"
           ${p.sold ? '' : `data-prod-id="${p.id}" role="button" tabindex="0"`}
           aria-label="${p.name}${p.sold ? ' — sold' : `, R${p.price.toLocaleString()}`}">
        ${pic(p.webp[0], p.imgs[0], imgAlt, 'feat-img', '800', '1000')}
        ${soldBadge}
        <div class="feat-info" aria-hidden="true">
          <div class="feat-name">${p.name}</div>
          <div class="feat-price">${priceHTML}</div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderGallery() {
  const availOnly = document.getElementById('availOnly')?.checked ?? false;

  let list = activeFilter === 'All'
    ? products
    : products.filter(p => p.cat === activeFilter);

  if (availOnly) list = list.filter(p => !p.sold);

  document.getElementById('galGrid').innerHTML = list.map(buildCard).join('');
  syncFilterButtons();
}

function buildCard(p) {
  const soldOverlay = p.sold ? `
    <div class="sold-overlay" aria-hidden="true">
      <div class="sold-label">Sold</div>
      <div class="sold-sub">This piece has found its home</div>
    </div>` : '';
  const imgAlt = `${p.name} — hand-beaded ${p.cat.toLowerCase()} sculpture by Tinashe Kachama, Plettenberg Bay`;

  return `
    <div class="gal-card${p.sold ? ' is-sold' : ''}"
         ${p.sold ? 'aria-disabled="true"' : `data-prod-id="${p.id}" role="button" tabindex="0"`}
         aria-label="${p.name}, ${p.cat}${p.sold ? ', Sold' : `, R${p.price.toLocaleString()}`}">
      <div class="gal-img-wrap">
        ${pic(p.webp[0], p.imgs[0], imgAlt, 'gal-img', '600', '800')}
        <div class="gal-ov" aria-hidden="true">${p.sold ? '' : '<div class="gal-view">View Sculpture</div>'}</div>
        ${soldOverlay}
      </div>
      <div class="gal-name">${p.name}</div>
      <div class="gal-meta">
        <span>${p.cat}</span>
        <span class="gal-price${p.sold ? ' struck' : ''}">R${p.price.toLocaleString()}</span>
        ${p.sold ? '<span class="gal-sold-tag">Sold</span>' : ''}
      </div>
    </div>
  `;
}

function syncFilterButtons() {
  document.querySelectorAll('.f-btn').forEach(btn => {
    const active = btn.dataset.filter === activeFilter;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

export function initGallery() {
  document.getElementById('galFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('.f-btn');
    if (!btn) return;
    sounds.click();
    activeFilter = btn.dataset.filter;
    renderGallery();
  });

  document.getElementById('availOnly')?.addEventListener('change', renderGallery);

  document.addEventListener('click', e => {
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    const id = Number(card.dataset.prodId);
    // No sounds.click() here — router.go() → sounds.nav() is sufficient
    if (!isNaN(id)) showProduct(id);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    e.preventDefault();
    const id = Number(card.dataset.prodId);
    if (!isNaN(id)) showProduct(id);
  });
}
