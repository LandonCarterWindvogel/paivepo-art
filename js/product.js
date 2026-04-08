/**
 * product.js — Product page rendering with WebP <picture> support
 */
import { products } from './data.js';
import { addToCart } from './cart.js';
import { openZoom, showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';
import { toggleWishlist, isWishlisted } from './wishlist.js';

let currentProduct = null;

export function getCurrentProduct() { return currentProduct; }

/* Helper: emit a <picture> with WebP + JPG fallback */
function pic(webpSrc, jpgSrc, alt, cls = '', w = '', h = '', lazy = true, extra = '') {
  const dims   = (w && h) ? ` width="${w}" height="${h}"` : '';
  const load   = lazy ? ' loading="lazy"' : '';
  const clsStr = cls ? ` class="${cls}"` : '';
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <img src="${jpgSrc}" alt="${alt}"${clsStr}${dims}${load}${extra}>
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
  renderThumbnails(p);
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
  const imgWrap = document.getElementById('prodMain').parentElement;

  notice.classList.toggle('show', p.sold);

  // Replace the main image with a proper picture element
  const oldPic = imgWrap.querySelector('picture');
  const oldImg = document.getElementById('prodMain');
  const imgAlt = `${p.name} — handmade beaded ${p.cat ? p.cat.toLowerCase() : ''} sculpture by Tinashe Kachama`;

  const soldClass = p.sold ? 'prod-main sold-img' : 'prod-main zoomable';
  const pictureHTML = `<picture id="prodMainPicture">
    <source srcset="${p.webp[0]}" type="image/webp">
    <img id="prodMain" src="${p.imgs[0]}" alt="${imgAlt}" class="${soldClass}" width="800" height="1000" fetchpriority="low">
  </picture>`;

  if (oldPic) {
    oldPic.outerHTML = pictureHTML;
  } else if (oldImg) {
    oldImg.outerHTML = pictureHTML;
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

    // Re-bind ATC — clone to remove stale listeners
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

    // Zoom on main image click — remove first to prevent stacking listeners
    mainImg.removeEventListener('click', openZoom);
    mainImg.addEventListener('click', openZoom);
  }
}

function renderSpecs(p) {
  const specs = [
    { l: 'Dimensions',     v: p.size  },
    { l: 'Materials',      v: p.mats  },
    { l: 'Bead Count',     v: p.beads },
    { l: 'Time to Create', v: p.time  },
    { l: 'Artist',         v: 'Tinashe Kachama' },
    { l: 'Edition',        v: p.sold ? 'Sold — One of a Kind' : 'One of a Kind' },
  ].filter(s => s.v && s.v !== 'To be confirmed');

  document.getElementById('prodSpecs').innerHTML = specs.map(s => `
    <div class="spec">
      <div class="spec-l">${s.l}</div>
      <div class="spec-v">${s.v}</div>
    </div>
  `).join('');
}

function renderThumbnails(p) {
  const container = document.getElementById('prodThumbs');

  container.innerHTML = p.imgs.map((src, i) => {
    const webpSrc = p.webp[i] || src;
    return `<picture class="thumb-wrap">
      <source srcset="${webpSrc}" type="image/webp">
      <img class="thumb ${i === 0 ? 'on' : ''}"
           src="${src}"
           alt="View ${i + 1} of ${p.name}"
           role="button" tabindex="0"
           data-thumb-jpg="${src}"
           data-thumb-webp="${webpSrc}"
           width="72" height="90"
           loading="lazy">
    </picture>`;
  }).join('');

  // Bind click/keyboard once per render using cloneNode trick
  const fresh = container.cloneNode(true);
  container.parentNode.replaceChild(fresh, container);

  fresh.addEventListener('click',   e => handleThumbClick(e, p));
  fresh.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleThumbClick(e, p); }
  });
}

function handleThumbClick(e, p) {
  const thumb = e.target.closest('.thumb');
  if (!thumb) return;

  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('on'));
  thumb.classList.add('on');

  const jpgSrc  = thumb.dataset.thumbJpg;
  const webpSrc = thumb.dataset.thumbWebp;
  const idx     = [...document.querySelectorAll('.thumb')].indexOf(thumb);

  // Update the main <picture> source and <img>
  const mainPic = document.getElementById('prodMainPicture');
  const mainImg = document.getElementById('prodMain');
  if (mainPic) {
    const src = mainPic.querySelector('source');
    if (src) src.srcset = webpSrc;
  }
  if (mainImg) {
    mainImg.src = jpgSrc;
    mainImg.alt = `View ${idx + 1} of ${p ? p.name : ''}`;
  }

  sounds.click();
}

function renderRelated(p) {
  const same   = products.filter(r => r.id !== p.id && r.cat === p.cat);
  const others = products.filter(r => r.id !== p.id && r.cat !== p.cat);
  const related = [...same, ...others].slice(0, 4);

  document.getElementById('relGrid').innerHTML = related.map(r => {
    const imgAlt = `${r.name} — handmade ${r.cat} sculpture by Tinashe Kachama`;
    return `
      <div class="rel-card${r.sold ? ' is-sold' : ''}"
           ${r.sold ? '' : `data-prod-id="${r.id}" role="button" tabindex="0"`}
           aria-label="${r.name}${r.sold ? ' — sold' : `, R${r.price.toLocaleString()}`}">
        <picture>
          <source srcset="${r.webp[0]}" type="image/webp">
          <img class="rel-img" src="${r.imgs[0]}" alt="${imgAlt}" width="400" height="533" loading="lazy">
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
