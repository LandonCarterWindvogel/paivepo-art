import { products } from './data.js';
import { showProduct } from './product.js';
import { sounds } from './sound.js';

const FEATURED_IDS = [0, 3, 4, 1];

let activeFilter = 'All';

export function setFilter(filter) {
  activeFilter = filter;
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

    const soldBadge = p.sold
      ? '<div class="feat-sold-badge">Sold</div>'
      : '';

    return `
      <div class="feat-item${p.sold ? ' is-sold' : ''}"
           ${p.sold ? '' : `data-prod-id="${p.id}"`}>
        <img class="feat-img" src="${p.imgs[0]}" alt="${p.name}">
        ${soldBadge}
        <div class="feat-info">
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
    <div class="sold-overlay">
      <div class="sold-label">Sold</div>
      <div class="sold-sub">This piece has found its home</div>
    </div>` : '';

  return `
    <div class="gal-card${p.sold ? ' is-sold' : ''}"
         ${p.sold ? '' : `data-prod-id="${p.id}"`}>
      <div class="gal-img-wrap">
        <img class="gal-img" src="${p.imgs[0]}" alt="${p.name}" loading="lazy">
        <div class="gal-ov">${p.sold ? '' : '<div class="gal-view">View Sculpture</div>'}</div>
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
  document.querySelectorAll('#galFilters .f-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === activeFilter);
  });
}

export function initGallery() {
  document.getElementById('galFilters').addEventListener('click', e => {
    const btn = e.target.closest('.f-btn');
    if (!btn) return;
    sounds.click();
    activeFilter = btn.dataset.filter;
    renderGallery();
  });

  document.getElementById('availOnly').addEventListener('change', renderGallery);

  document.getElementById('galGrid').addEventListener('click', e => {
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    sounds.click();
    showProduct(Number(card.dataset.prodId));
  });

  document.getElementById('featGrid').addEventListener('click', e => {
    const item = e.target.closest('[data-prod-id]');
    if (!item) return;
    sounds.click();
    showProduct(Number(item.dataset.prodId));
  });
}
