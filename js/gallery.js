import { products } from './data.js';
import { showProduct } from './product.js';

let activeFilter = 'All';

export function setFilter(filter) {
  activeFilter = filter;
}

export function renderGallery() {
  const availOnly = document.getElementById('availOnly')?.checked ?? false;

  let list = activeFilter === 'All'
    ? products
    : products.filter(p => p.cat === activeFilter);

  if (availOnly) list = list.filter(p => !p.sold);

  document.getElementById('galGrid').innerHTML = list.map(buildGalleryCard).join('');

  syncFilterButtons();
}

function buildGalleryCard(p) {
  const soldOverlay = p.sold
    ? `<div class="sold-overlay">
         <div class="sold-label">Sold</div>
         <div class="sold-sub">This piece has found its home</div>
       </div>`
    : '';

  const viewButton = p.sold ? '' : '<div class="gal-view">View Sculpture</div>';

  return `
    <div class="gal-card${p.sold ? ' is-sold' : ''}"
         ${p.sold ? '' : `data-prod-id="${p.id}"`}>
      <div class="gal-img-wrap">
        <img class="gal-img" src="${p.imgs[0]}" alt="${p.name}" loading="lazy">
        <div class="gal-ov">${viewButton}</div>
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
    activeFilter = btn.dataset.filter;
    renderGallery();
  });

  document.getElementById('availOnly').addEventListener('change', renderGallery);

  document.getElementById('galGrid').addEventListener('click', e => {
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    showProduct(Number(card.dataset.prodId));
  });

  document.getElementById('featGrid').addEventListener('click', e => {
    const item = e.target.closest('[data-prod-id]');
    if (!item) return;
    showProduct(Number(item.dataset.prodId));
  });
}
