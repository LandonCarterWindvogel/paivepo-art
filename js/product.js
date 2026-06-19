// product.js — Product detail page with schema and carousel
import { products } from './data.js';
import { addToCart } from './cart.js';
import { openZoom, showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';
import { toggleWishlist, isWishlisted } from './wishlist.js';

let currentProduct = null;

export function getCurrentProduct() { return currentProduct; }

function pic(jpgSrc, webpSrc, alt, cls = '', w = '', h = '', lazy = true, extra = '') {
  const dims = (w && h) ? ` width="${w}" height="${h}"` : '';
  const load = lazy ? ' loading="lazy"' : '';
  const clsStr = cls ? ` class="${cls}"` : '';
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <img src="${webpSrc}" alt="${alt}"${clsStr}${dims}${load}${extra}>
  </picture>`;
}

function renderProductSchema(p) {
  const existing = document.querySelector('script[data-product-schema]');
  if (existing) existing.remove();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.name,
    "description": p.desc,
    "image": `https://paivepo.co.za/${p.imageWebp}`,
    "sku": `PAIVEPO-${p.id}`,
    "offers": {
      "@type": "Offer",
      "price": p.price,
      "priceCurrency": "ZAR",
      "availability": p.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Paivepo Art & Decor"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Paivepo"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": p.artist || "Paivepo Studio"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.productSchema = 'true';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function renderBreadcrumbSchema(p) {
  const existing = document.querySelector('script[data-breadcrumb-schema]');
  if (existing) existing.remove();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://paivepo.co.za/" },
      { "@type": "ListItem", "position": 2, "name": "Collection", "item": "https://paivepo.co.za/#gallery" },
      { "@type": "ListItem", "position": 3, "name": p.name, "item": `https://paivepo.co.za/#product` }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.breadcrumbSchema = 'true';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function showProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) { showToast('Product not found'); return; }
  currentProduct = p;

  document.getElementById('prodBc').textContent = p.name;
  document.getElementById('prodTitle').textContent = p.name;
  document.getElementById('prodDesc').textContent = p.desc;

  renderPrice(p);
  renderSoldState(p);
  renderSpecs(p);
  renderRelated(p);
  renderWishlistState(p);

  renderProductSchema(p);
  renderBreadcrumbSchema(p);

  document.title = `${p.name} — African Art from Paivepo, Plettenberg Bay`;
  go('product');
}

function renderPrice(p) {
  const el = document.getElementById('prodPrice');
  el.textContent = `R${p.price.toLocaleString()}`;
  el.className = `prod-price${p.sold ? ' sold-price' : ''}`;
}

function renderSoldState(p) {
  const notice = document.getElementById('prodSoldNotice');
  const atcBtn = document.getElementById('atcBtn');
  const commBtn = document.getElementById('commissionBtn');

  notice.classList.toggle('show', p.sold);

  const imgAlt = p.alt || `${p.name} — handmade ${p.cat ? p.cat.toLowerCase() : ''} artwork by ${p.artist || 'Paivepo'}`;
  const soldClass = p.sold ? 'prod-main sold-img' : 'prod-main zoomable';

  // Use container for stable image replacement
  const container = document.querySelector('.prod-imgs');
  if (container) {
    container.innerHTML = `<picture id="prodMainPicture">
      <source srcset="${p.imageWebp}" type="image/webp">
      <img id="prodMain" src="${p.imageWebp}" alt="${imgAlt}" class="${soldClass}" width="800" height="1000" fetchpriority="low">
    </picture>`;
  }

  const mainImg = document.getElementById('prodMain');

  if (p.sold) {
    atcBtn.style.display = 'none';
    commBtn.classList.add('show');
    sounds.sold();
  } else {
    atcBtn.style.display = '';
    atcBtn.textContent = 'Add to Bag';
    atcBtn.disabled = false;
    atcBtn.style.background = '';
    commBtn.classList.remove('show');

    // Replace button to remove old listeners
    const newAtc = atcBtn.cloneNode(true);
    atcBtn.parentNode.replaceChild(newAtc, atcBtn);
    newAtc.addEventListener('click', () => {
      addToCart(p);
      newAtc.textContent = 'Added ✓';
      newAtc.disabled = true;
      // subtle scale feedback
      newAtc.style.transform = 'scale(0.96)';
      setTimeout(() => {
        newAtc.style.transform = '';
      }, 150);
      setTimeout(() => {
        newAtc.textContent = 'Add to Bag';
        newAtc.disabled = false;
      }, 2000);
    });

    if (mainImg) {
      mainImg.removeEventListener('click', openZoom);
      mainImg.addEventListener('click', openZoom);
    }
  }
}

function renderSpecs(p) {
  const specs = [
    { l: 'Dimensions', v: p.size },
    { l: 'Materials', v: p.mats },
    { l: 'Bead Count', v: p.beads },
    { l: 'Time to Create', v: p.time },
    { l: 'Artist', v: p.artist || 'Paivepo Studio' },
    { l: 'Edition', v: p.sold ? 'Sold — One of a Kind' : 'One of a Kind' },
  ].filter(s => s.v && s.v !== 'To be confirmed');

  document.getElementById('prodSpecs').innerHTML = specs.map(s => `
    <div class="spec-row">
      <div class="spec-lbl">${s.l}</div>
      <div class="spec-val">${s.v}</div>
    </div>
  `).join('');
}

function renderRelated(p) {
  const same = products.filter(r => r.id !== p.id && r.cat === p.cat);
  const others = products.filter(r => r.id !== p.id && r.cat !== p.cat);
  const related = [...same, ...others].slice(0, 8);

  const grid = document.getElementById('relGrid');
  if (!grid) return;

  // Make grid full width by breaking out of parent padding
  grid.style.cssText = `
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    padding: 0 var(--side, 40px);
    overflow: hidden;
  `;

  if (!related.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);font-family:var(--font-sans);font-size:14px;padding:40px 0;">More pieces coming soon…</p>`;
    return;
  }

  // Build carousel container
  const carousel = document.createElement('div');
  carousel.className = 'rel-carousel';
  carousel.style.cssText = `
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 10px 0 20px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    width: 100%;
  `;
  carousel.innerHTML = related.map(r => {
    const imgAlt = r.alt || `${r.name} — handmade ${r.cat} artwork by ${r.artist || 'Paivepo'}`;
    return `
      <div class="rel-card${r.sold ? ' is-sold' : ''}"
           ${r.sold ? '' : `data-prod-id="${r.id}" role="button" tabindex="0"`}
           style="
             flex: 0 0 280px;
             max-width: 280px;
             scroll-snap-align: start;
             cursor: pointer;
           "
           aria-label="${r.name}${r.sold ? ' — sold' : `, R${r.price.toLocaleString()}`}">
        <picture>
          <source srcset="${r.imageWebp}" type="image/webp">
          <img class="rel-img" src="${r.imageWebp}" alt="${imgAlt}" width="400" height="533" loading="lazy" style="width:100%; aspect-ratio:3/4; object-fit:cover; border-radius:2px;">
        </picture>
        <div class="rel-name" style="margin-top:8px; font-family:var(--font-serif); font-size:15px; font-weight:400; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${r.name}</div>
        <div class="rel-price${r.sold ? ' struck' : ''}" style="font-size:13px; color:var(--muted);">
          ${r.sold
            ? '<span style="text-decoration:line-through;opacity:.45">Sold</span>'
            : `R${r.price.toLocaleString()}`}
        </div>
      </div>
    `;
  }).join('');

  // Wrap with relative container for arrows
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position: relative; display: flex; align-items: center; width: 100%;';
  wrapper.appendChild(carousel);

  // Arrows only if more than 4 items
  if (related.length > 4) {
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '‹';
    leftArrow.setAttribute('aria-label', 'Previous works');
    leftArrow.style.cssText = `
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--white, #FFFFFF);
      border: 1px solid var(--ivory-border, #DDD8CF);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 22px;
      color: var(--charcoal, #1B1B1B);
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      opacity: 0;
      pointer-events: none;
    `;
    // Show on hover
    wrapper.addEventListener('mouseenter', () => {
      leftArrow.style.opacity = '1';
      leftArrow.style.pointerEvents = 'auto';
      rightArrow.style.opacity = '1';
      rightArrow.style.pointerEvents = 'auto';
    });
    wrapper.addEventListener('mouseleave', () => {
      leftArrow.style.opacity = '0';
      leftArrow.style.pointerEvents = 'none';
      rightArrow.style.opacity = '0';
      rightArrow.style.pointerEvents = 'none';
    });
    leftArrow.addEventListener('mouseenter', () => {
      leftArrow.style.background = 'var(--charcoal, #1B1B1B)';
      leftArrow.style.color = 'var(--white, #FFFFFF)';
    });
    leftArrow.addEventListener('mouseleave', () => {
      leftArrow.style.background = 'var(--white, #FFFFFF)';
      leftArrow.style.color = 'var(--charcoal, #1B1B1B)';
    });
    leftArrow.addEventListener('click', () => {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
      sounds.click();
    });

    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '›';
    rightArrow.setAttribute('aria-label', 'Next works');
    rightArrow.style.cssText = `
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--white, #FFFFFF);
      border: 1px solid var(--ivory-border, #DDD8CF);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 22px;
      color: var(--charcoal, #1B1B1B);
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      opacity: 0;
      pointer-events: none;
    `;
    rightArrow.addEventListener('mouseenter', () => {
      rightArrow.style.background = 'var(--charcoal, #1B1B1B)';
      rightArrow.style.color = 'var(--white, #FFFFFF)';
    });
    rightArrow.addEventListener('mouseleave', () => {
      rightArrow.style.background = 'var(--white, #FFFFFF)';
      rightArrow.style.color = 'var(--charcoal, #1B1B1B)';
    });
    rightArrow.addEventListener('click', () => {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
      sounds.click();
    });

    wrapper.appendChild(leftArrow);
    wrapper.appendChild(rightArrow);
  }

  // Clear grid and append wrapper
  grid.innerHTML = '';
  grid.appendChild(wrapper);

  // Attach click listeners to all cards
  grid.querySelectorAll('[data-prod-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = Number(card.dataset.prodId);
      if (!isNaN(id)) showProduct(id);
    });
    // Keyboard support
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = Number(card.dataset.prodId);
        if (!isNaN(id)) showProduct(id);
      }
    });
  });
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
  // Events bound dynamically in showProduct()
}