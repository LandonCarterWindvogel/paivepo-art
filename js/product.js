// product.js — Product detail page with schema and carousel
import { products } from './data.js';
import { openZoom, showToast } from './ui.js';
import { go } from './router.js';
import { sounds } from './sound.js';
import { getWhatsAppLink, hasSpecificWhatsAppLink } from './whatsapp.js';

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
    "sku": "PAIVEPO-" + p.id,
    "brand": {
      "@type": "Brand",
      "name": "Paivepo"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": p.artist || "Paivepo Studio"
    }
  };

  if (p.imageWebp) {
    schema.image = "https://paivepo.co.za/" + p.imageWebp;
  }

  if (p.price != null) {
    schema.offers = {
      "@type": "Offer",
      "price": p.price,
      "priceCurrency": "ZAR",
      "availability": p.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Paivepo Art & Decor"
      }
    };
  }

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
  renderProductGallery(p);
  renderSoldState(p);
  renderSpecs(p);
  renderRelated(p);
  renderWhatsAppCta(p);

  renderProductSchema(p);
  renderBreadcrumbSchema(p);

  document.title = `${p.name} — African Art from Paivepo, Plettenberg Bay`;
  go('product');
}

function renderPrice(p) {
  const el = document.getElementById('prodPrice');
  if (!el) return;
  el.textContent = p.price == null ? 'Price on WhatsApp' : 'R' + p.price.toLocaleString();
  el.className = 'prod-price' + (p.sold ? ' sold-price' : '');
}

export function renderProductGallery(p) {
  const container = document.querySelector('.prod-imgs');
  if (!container) return;

  const mainSrc = p.imageWebp || p.image;
  const mainAlt = p.alt || p.name;

  if (mainSrc) {
    container.innerHTML = `
      <div class="prod-main-wrap">
        <img id="prodMain"
             src="${mainSrc}"
             alt="${mainAlt}"
             class="zoomable"
             width="800"
             height="1000"
             fetchpriority="high"
             decoding="async">
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="prod-main-wrap">
        <div id="prodMain" class="image-placeholder prod-placeholder" role="img" aria-label="${mainAlt}">
          Artwork image coming soon
        </div>
      </div>
    `;
  }

  const mainImg = document.getElementById('prodMain');
  if (mainImg && mainImg.tagName === 'IMG') {
    mainImg.addEventListener('click', openZoom);
  }
}

function renderSoldState(p) {
  const notice = document.getElementById('prodSoldNotice');
  const orderBtn = document.getElementById('atcBtn');
  const commBtn = document.getElementById('commissionBtn');
  const orderNote = document.getElementById('prodOrderNote');

  if (!notice || !orderBtn || !commBtn) return;

  notice.classList.toggle('show', p.sold);

  const mainImg = document.getElementById('prodMain');
  if (mainImg) {
    mainImg.classList.toggle('sold-img', p.sold);
    mainImg.classList.add('zoomable');
  }

  if (p.sold) {
    orderBtn.style.display = 'none';
    commBtn.classList.add('show');
    if (orderNote) orderNote.textContent = '';
    sounds.sold();
    return;
  }

  const hasExactLink = hasSpecificWhatsAppLink(p);
  const label = hasExactLink ? 'Order on WhatsApp' : 'Enquire on WhatsApp';

  orderBtn.style.display = 'inline-flex';
  orderBtn.href = getWhatsAppLink(p);
  orderBtn.target = '_blank';
  orderBtn.rel = 'noopener noreferrer';
  orderBtn.textContent = label;
  orderBtn.setAttribute('aria-label', label + ' — ' + p.name);
  orderBtn.classList.toggle('atc--fallback', !hasExactLink);

  commBtn.classList.remove('show');

  if (orderNote) {
    orderNote.textContent = hasExactLink
      ? 'Opens this piece directly in the Paivepo WhatsApp catalogue.'
      : 'The direct catalogue link still needs to be connected for this piece; WhatsApp opens with the artwork name pre-filled.';
  }

  if (mainImg) {
    mainImg.removeEventListener('click', openZoom);
    mainImg.addEventListener('click', openZoom);
  }
}

function renderWhatsAppCta(p) {
  // Kept as a separate render step so product state and ordering logic stay easy to maintain.
  renderSoldState(p);
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
            : (r.price == null ? 'View on WhatsApp' : 'R' + r.price.toLocaleString())}
        </div>
      </div>
    `;
  }).join('');

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position: relative; display: flex; align-items: center; width: 100%;';
  wrapper.appendChild(carousel);

  if (related.length > 4) {
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

  grid.innerHTML = '';
  grid.appendChild(wrapper);

  grid.querySelectorAll('[data-prod-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = Number(card.dataset.prodId);
      if (!isNaN(id)) showProduct(id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = Number(card.dataset.prodId);
        if (!isNaN(id)) showProduct(id);
      }
    });
  });
}

export function initProduct() {
  // Events bound dynamically in showProduct()
}