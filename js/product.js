import { products } from './data.js';
import { addToCart } from './cart.js';
import { openZoom, showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';

let currentProduct = null;

export function getCurrentProduct() { return currentProduct; }

export function showProduct(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;
  const p = currentProduct;

  document.getElementById('prodBc').textContent    = p.name;
  document.getElementById('prodTitle').textContent = p.name;
  document.getElementById('prodDesc').textContent  = p.desc;

  renderPrice(p);
  renderSoldState(p);
  renderSpecs(p);
  renderThumbnails(p);
  renderRelated(p);

  go('product');
}

function renderPrice(p) {
  const el       = document.getElementById('prodPrice');
  el.textContent = `R${p.price.toLocaleString()}`;
  el.className   = `prod-price${p.sold ? ' sold-price' : ''}`;
}

function renderSoldState(p) {
  const notice  = document.getElementById('prodSoldNotice');
  const atcBtn  = document.getElementById('atcBtn');
  const commBtn = document.getElementById('commissionBtn');
  const mainImg = document.getElementById('prodMain');

  notice.classList.toggle('show', p.sold);
  mainImg.src = p.imgs[0];
  mainImg.alt = p.name;

  if (p.sold) {
    mainImg.className    = 'prod-main sold-img';
    atcBtn.style.display = 'none';
    commBtn.classList.add('show');
    sounds.sold();
  } else {
    mainImg.className       = 'prod-main zoomable';
    atcBtn.style.display    = '';
    atcBtn.textContent      = 'Add to Bag';
    atcBtn.disabled         = false;
    atcBtn.style.background = '';
    commBtn.classList.remove('show');
  }
}

function renderSpecs(p) {
  document.getElementById('prodSpecs').innerHTML = `
    <div class="spec"><div class="spec-l">Dimensions</div><div class="spec-v">${p.size}</div></div>
    <div class="spec"><div class="spec-l">Materials</div><div class="spec-v">${p.mats}</div></div>
    <div class="spec"><div class="spec-l">Bead Count</div><div class="spec-v">${p.beads}</div></div>
    <div class="spec"><div class="spec-l">Time to Create</div><div class="spec-v">${p.time}</div></div>
    <div class="spec"><div class="spec-l">Artist</div><div class="spec-v">Tinashe Kachama</div></div>
    <div class="spec"><div class="spec-l">Edition</div><div class="spec-v">${p.sold ? 'Sold — One of a Kind' : 'One of a Kind'}</div></div>
  `;
}

function renderThumbnails(p) {
  document.getElementById('prodThumbs').innerHTML = p.imgs.map((src, i) => `
    <img class="thumb ${i === 0 ? 'on' : ''}" src="${src}" alt="View ${i + 1}" data-thumb-src="${src}">
  `).join('');
}

function renderRelated(p) {
  const related = products.filter(r => r.id !== p.id).slice(0, 4);
  document.getElementById('relGrid').innerHTML = related.map(r => `
    <div class="rel-card${r.sold ? ' is-sold' : ''}" ${r.sold ? '' : `data-prod-id="${r.id}"`}>
      <div class="rel-img-wrap">
        <img class="rel-img" src="${r.imgs[0]}" alt="${r.name}" loading="lazy">
        ${r.sold ? '<div class="rel-sold-bar">Sold</div>' : ''}
      </div>
      <div class="rel-name">${r.name}</div>
      <div class="rel-price${r.sold ? ' struck' : ''}">R${r.price.toLocaleString()}</div>
    </div>
  `).join('');
}

export function initProduct() {
  document.getElementById('atcBtn').addEventListener('click', () => {
    if (!currentProduct || currentProduct.sold) return;
    addToCart(currentProduct);
    const btn            = document.getElementById('atcBtn');
    btn.textContent      = 'Added ✓';
    btn.style.background = '#3a3632';
    setTimeout(() => { btn.textContent = 'Add to Bag'; btn.style.background = ''; }, 2200);
  });

  document.getElementById('wlBtn').addEventListener('click', () => {
    sounds.click();
    showToast('Saved to your wishlist');
  });

  document.getElementById('prodMain').addEventListener('click', () => {
    if (currentProduct && !currentProduct.sold) openZoom();
  });

  document.getElementById('prodThumbs').addEventListener('click', e => {
    const thumb = e.target.closest('.thumb');
    if (!thumb) return;
    sounds.click();
    document.getElementById('prodMain').src = thumb.dataset.thumbSrc;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('on'));
    thumb.classList.add('on');
  });

  document.getElementById('relGrid').addEventListener('click', e => {
    const card = e.target.closest('[data-prod-id]');
    if (!card) return;
    sounds.click();
    showProduct(Number(card.dataset.prodId));
  });
}
