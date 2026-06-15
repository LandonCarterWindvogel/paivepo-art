/**
 * product.js — Product page with single main image (no thumbnails)
 * FIXED: Use WebP for both <source> and <img src> to avoid 404 on zoom
 */
import { products } from './data.js';
import { addToCart } from './cart.js';
import { openZoom, showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';
import { toggleWishlist, isWishlisted } from './wishlist.js';

let currentProduct = null;

export function getCurrentProduct() { return currentProduct; }

function pic(jpgSrc, webpSrc, alt, cls = '', w = '', h = '', lazy = true, extra = '') {
  // Note: this function is not used in product page directly, but kept for consistency
  const dims   = (w && h) ? ` width="${w}" height="${h}"` : '';
  const load   = lazy ? ' loading="lazy"' : '';
  const clsStr = cls ? ` class="${cls}"` : '';
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <img src="${webpSrc}" alt="${alt}"${clsStr}${dims}${load}${extra}>
  </picture>`;
}

export function showProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) { showToast('Product not found'); return; }
  currentProduct = p;

  document.getElementById('prodBc').textContent    = p.name;
  document.getElementById('prodTitle').textContent = p.name;
  document.getElementById('prodDesc').textContent  = p.desc;

  renderPrice(p);
  renderSoldState(p);
  renderSpecs(p);
  renderRelated(p);
  renderWishlistState(p);

  document.title = `${p.name} — Paivepo Art & Decor`;
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

  notice.classList.toggle('show', p.sold);

  const imgAlt = `${p.name} — handmade ${p.cat ? p.cat.toLowerCase() : ''} artwork by ${p.artist || 'Paivepo'}`;
  const soldClass = p.sold ? 'prod-main sold-img' : 'prod-main zoomable';

  // IMPORTANT FIX: Use the WebP file for both <source> and the fallback <img> src
  // This ensures the zoom modal copies a valid URL (the WebP that actually exists)
  const pictureHTML = `<picture id="prodMainPicture">
    <source srcset="${p.imageWebp}" type="image/webp">
    <img id="prodMain" src="${p.imageWebp}" alt="${imgAlt}" class="${soldClass}" width="800" height="1000" fetchpriority="low">
  </picture>`;

  const mainContainer = document.querySelector('.prod-imgs');
  if (mainContainer) {
    const existingPic = document.getElementById('prodMainPicture');
    if (existingPic) existingPic.outerHTML = pictureHTML;
    else {
      const oldImg = document.getElementById('prodMain');
      if (oldImg) oldImg.outerHTML = pictureHTML;
    }
  }

  const mainImg = document.getElementById('prodMain');

  if (p.sold) {
    atcBtn.style.display = 'none';
    commBtn.classList.add('show');
    sounds.sold();
  } else {
    atcBtn.style.display    = '';
    atcBtn.textContent      = 'Add to Bag';
    atcBtn.disabled         = false;
    atcBtn.style.background = '';
    commBtn.classList.remove('show');

    // Re-bind ATC without stale listeners
    const newAtc = atcBtn.cloneNode(true);
    atcBtn.parentNode.replaceChild(newAtc, atcBtn);
    newAtc.addEventListener('click', () => {
      addToCart(p);
      newAtc.textContent = 'Added ✓';
      newAtc.disabled    = true;
      setTimeout(() => {
        newAtc.textContent = 'Add to Bag';
        newAtc.disabled    = false;
      }, 2000);
    });

    // Zoom on main image click – now the src points to a valid WebP
    if (mainImg) {
      mainImg.removeEventListener('click', openZoom);
      mainImg.addEventListener('click', openZoom);
    }
  }
}

function renderSpecs(p) {
  const specs = [
    { l: 'Dimensions', v: p.size },
    { l: 'Materials',  v: p.mats },
    { l: 'Bead Count', v: p.beads },
    { l: 'Time to Create', v: p.time },
    { l: 'Artist',     v: p.artist || 'Paivepo Studio' },
    { l: 'Edition',    v: p.sold ? 'Sold — One of a Kind' : 'One of a Kind' },
  ].filter(s => s.v && s.v !== 'To be confirmed');

  document.getElementById('prodSpecs').innerHTML = specs.map(s => `
    <div class="spec-row">
      <div class="spec-lbl">${s.l}</div>
      <div class="spec-val">${s.v}</div>
    </div>
  `).join('');
}

function renderRelated(p) {
  const same   = products.filter(r => r.id !== p.id && r.cat === p.cat);
  const others = products.filter(r => r.id !== p.id && r.cat !== p.cat);
  const related = [...same, ...others].slice(0, 4);

  document.getElementById('relGrid').innerHTML = related.map(r => {
    const imgAlt = `${r.name} — handmade ${r.cat} artwork by ${r.artist || 'Paivepo'}`;
    return `
      <div class="rel-card${r.sold ? ' is-sold' : ''}"
           ${r.sold ? '' : `data-prod-id="${r.id}" role="button" tabindex="0"`}
           aria-label="${r.name}${r.sold ? ' — sold' : `, R${r.price.toLocaleString()}`}">
        <picture>
          <source srcset="${r.imageWebp}" type="image/webp">
          <img class="rel-img" src="${r.imageWebp}" alt="${imgAlt}" width="400" height="533" loading="lazy">
        </picture>
        <div class="rel-name">${r.name}</div>
        <div class="rel-price${r.sold ? ' struck' : ''}">
          ${r.sold
            ? '<span style="text-decoration:line-through;opacity:.45">Sold</span>'
            : `R${r.price.toLocaleString()}`}
        </div>
      </div>
    `;
  }).join('');
}

function renderWishlistState(p) {
  const btn = document.getElementById('wlBtn');
  if (!btn) return;
  const wishlisted = isWishlisted(p.id);
  btn.setAttribute('aria-pressed', String(wishlisted));
  btn.classList.toggle('wishlisted', wishlisted);

  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', () => {
    const on = toggleWishlist(p);
    newBtn.setAttribute('aria-pressed', String(on));
    newBtn.classList.toggle('wishlisted', on);
  });
}

export function initProduct() {
  // All events are bound dynamically in showProduct()
}