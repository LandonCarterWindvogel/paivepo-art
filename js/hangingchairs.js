const SHOPIFY_STORE_URL = "https://paivepoart.myshopify.com";
const CART_STORAGE_KEY = "hangingchairs_cart_v1";
const WHATSAPP_BASE = "https://wa.me/27629131440?text=";
const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const products = [
  {
    id: "curve-bench",
    shopifyProductId: 15580840558781,
    handle: "the-barrel-curve-bench-reclaimed-wine-barrel-wood",
    name: "The Barrel Curve Bench",
    category: "Benches",
    image: "/images/bench.jpg",
    imageAlt: "Curved bench made from reclaimed wine-barrel timber",
    detailImage: "/images/bench_zoom.jpg",
    detailImageAlt: "Close detail of the curved wine-barrel wood bench",
    price: 3400,
    description:
      "A beautiful curve, with a history worth preserving. Reclaimed wine-barrel wood becomes a striking, flowing seat, its natural grain and individual character left in view.",
    details: [
      ["Material", "Reclaimed wine-barrel wood"],
      ["Design", "Distinctive curved seating with natural timber grain"],
      ["Packed dimensions", "50 × 100 × 36 cm"],
    ],
    variants: [
      { id: 68360178729149, option: "", price: 3400, inventory: 1 },
    ],
  },
  {
    id: "backrest-bench",
    shopifyProductId: 15580891971773,
    handle: "the-barrel-backrest-bench-reclaimed-wine-barrel-wood",
    name: "The Barrel Backrest Bench",
    category: "Benches",
    image: "/images/backbench.jpg",
    imageAlt: "Reclaimed timber bench with a distinctive slatted backrest",
    detailImage: "/images/backbench_zoom.jpg",
    detailImageAlt: "Close detail of the reclaimed timber backrest bench",
    price: 3800,
    description:
      "A curved wooden seat and distinctive slatted back bring warmth to outdoor spaces and garden settings. Natural variations in the reclaimed timber make each piece individual.",
    details: [
      ["Material", "Reclaimed wine-barrel wood"],
      ["Design", "Curved seat with a traditional slatted backrest"],
      ["Packed dimensions", "80 × 100 × 90 cm"],
    ],
    variants: [
      { id: 68360234795197, option: "", price: 3800, inventory: 1 },
    ],
  },
  {
    id: "bar-stool",
    shopifyProductId: 15580929491133,
    handle: "the-barrel-bar-stool-reclaimed-wine-barrel-wood",
    name: "The Barrel Bar Stool",
    category: "Bar seating",
    image: "/images/bars_stool.jpg",
    imageAlt: "Tall reclaimed wine-barrel wood bar stool with metal footrest",
    detailImage: "/images/bars_stool_zoom.jpg",
    detailImageAlt: "Close detail of the timber and footrest on the bar stool",
    price: 1800,
    description:
      "A tall, distinctive seat with an individual wooden backrest and integrated metal footrest. Reclaimed barrel timber gives this functional piece its bold, industrial-rustic character.",
    details: [
      ["Material", "Reclaimed wine-barrel wood"],
      ["Design", "Wooden backrest with an integrated metal footrest"],
      ["Packed dimensions", "50 × 50 × 95 cm"],
    ],
    variants: [
      { id: 68360275689661, option: "", price: 1800, inventory: 1 },
    ],
  },
  {
    id: "backrest-swing",
    shopifyProductId: 15581429530813,
    handle: "the-barrel-backrest-swing-reclaimed-wine-barrel-wood",
    name: "The Barrel Backrest Swing",
    category: "Hanging chairs",
    image: "/images/hanging_bench.jpg",
    imageAlt: "Reclaimed timber hanging swing with a backrest and armrests",
    detailImage: "/images/hanging_bench_zoom.jpg",
    detailImageAlt: "Close detail of the hanging swing timber and rope",
    price: 4300,
    description:
      "A suspended seat with curved wooden seating and an individual slatted backrest. Choose black or white rope; natural timber variations make every piece unique.",
    details: [
      ["Material", "Reclaimed wine-barrel wood"],
      ["Design", "Curved seat with a slatted backrest"],
      ["Suspension", "Rope; choose black or white"],
      ["Packed dimensions", "60 × 100 × 100 cm"],
    ],
    variants: [
      { id: 68363835408573, option: "Black", price: 4300, inventory: 1 },
      { id: 68363835441341, option: "White", price: 4300, inventory: 1 },
    ],
  },
  {
    id: "swing-seat",
    shopifyProductId: 15581430808765,
    handle: "the-barrel-swing-seat-reclaimed-wine-barrel-wood",
    name: "The Barrel Swing Seat",
    category: "Hanging chairs",
    image: "/images/hanging_chair.jpg",
    imageAlt: "Curved reclaimed wine-barrel wood swing seat on rope",
    detailImage: null,
    detailImageAlt: "",
    price: 1600,
    description:
      "A simple suspended seat that lets the curves, wooden slats and natural grain of reclaimed wine-barrel timber take centre stage. Available with black or white rope.",
    details: [
      ["Material", "Reclaimed wine-barrel wood"],
      ["Design", "Simple suspended seat with curved wooden construction"],
      ["Suspension", "Rope; choose black or white"],
      ["Packed dimensions", "40 × 80 × 60 cm"],
    ],
    variants: [
      { id: 68363833049277, option: "Black", price: 1600, inventory: 1 },
      { id: 68363833082045, option: "White", price: 1600, inventory: 1 },
    ],
  },
];

const productGrid = document.querySelector("#hc-products");
const cartToggle = document.querySelector("#hc-cart-toggle");
const cartPanel = document.querySelector("#hc-cart");
const cartOverlay = document.querySelector("#hc-cart-overlay");
const cartBody = document.querySelector("#hc-cart-body");
const toast = document.querySelector("#hc-toast");
const lightbox = document.querySelector("#hc-lightbox");
const lightboxImage = document.querySelector("#hc-lightbox-image");
const lightboxProductName = document.querySelector("#hc-lightbox-product");
const lightboxDescription = document.querySelector("#hc-lightbox-description");
const lightboxCounter = document.querySelector("#hc-lightbox-counter");
const lightboxPrevious = document.querySelector("#hc-lightbox-previous");
const lightboxNext = document.querySelector("#hc-lightbox-next");
let cart = loadCart();
let toastTimer;
let returnFocus;
let lightboxGallery = [];
let lightboxProduct = null;
let lightboxCard = null;
let lightboxIndex = 0;
let previousImageOverflow = "";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 3200);
}

function findVariant(id) {
  for (const product of products) {
    const variant = product.variants.find((candidate) => candidate.id === id);
    if (variant) return { product, variant };
  }
  return null;
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) throw new TypeError("Saved bag is not an array");

    return saved.reduce((items, entry) => {
      if (!Number.isSafeInteger(entry?.variantId) ||
          !Number.isSafeInteger(entry?.quantity) ||
          entry.quantity < 1) {
        return items;
      }

      const item = findVariant(entry.variantId);
      if (!item || item.variant.inventory < 1) return items;

      const existing = items.find((line) => line.variantId === entry.variantId);
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + entry.quantity,
          item.variant.inventory,
        );
      } else {
        items.push({
          variantId: entry.variantId,
          quantity: Math.min(entry.quantity, item.variant.inventory),
        });
      }
      return items;
    }, []);
  } catch (error) {
    console.error("Unable to load the saved shopping bag:", error);
    showToast("Your saved bag could not be loaded. You can start a new bag.");
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Unable to save the shopping bag:", error);
    showToast("Your bag is available for this visit but could not be saved.");
  }
}

function createEnquiryUrl(product, variant) {
  const option = variant.option ? ` Rope colour: ${variant.option}.` : "";
  const message =
    `Hi, I would like to enquire about ${product.name}.${option} ` +
    "Please confirm availability and delivery options.";
  return `${WHATSAPP_BASE}${encodeURIComponent(message)}`;
}

function getProductImages(product) {
  const images = [{ src: product.image, alt: product.imageAlt }];
  if (product.detailImage) {
    images.push({ src: product.detailImage, alt: product.detailImageAlt });
  }
  return images;
}

function renderImage(product) {
  const images = getProductImages(product);
  const firstImage = images[0];
  return `
    <div class="hc-product__gallery" data-product-gallery="${product.id}">
      <figure class="hc-product__image">
        <button class="hc-product__image-trigger" type="button"
          data-image-preview="${product.id}" data-image-index="0"
          aria-label="Preview image 1 of ${images.length} for ${escapeHtml(product.name)}">
          <img src="${firstImage.src}" alt="${escapeHtml(firstImage.alt)}"
            loading="lazy" decoding="async" />
          <span class="hc-product__zoom-hint">View larger image <span aria-hidden="true">↗</span></span>
        </button>
      </figure>
      ${images.length > 1 ? `
        <div class="hc-product__thumbs" role="group"
          aria-label="More images of ${escapeHtml(product.name)}">
          ${images.map((image, index) => `
            <button class="hc-product__thumb${index === 0 ? " is-active" : ""}"
              type="button" data-image-select="${product.id}" data-image-index="${index}"
              aria-label="Show image ${index + 1} of ${images.length}: ${escapeHtml(image.alt)}"
              aria-pressed="${index === 0}">
              <img src="${image.src}" alt="" loading="lazy" decoding="async" />
            </button>`).join("")}
        </div>` : ""}
    </div>`;
}

function selectProductImage(product, card, index) {
  const images = getProductImages(product);
  const image = images[index];
  const trigger = card.querySelector(".hc-product__image-trigger");
  const mainImage = trigger?.querySelector("img");
  if (!image || !trigger || !mainImage) return;

  mainImage.src = image.src;
  mainImage.alt = image.alt;
  trigger.dataset.imageIndex = String(index);
  trigger.setAttribute(
    "aria-label",
    `Preview image ${index + 1} of ${images.length} for ${product.name}`,
  );

  card.querySelectorAll(".hc-product__thumb").forEach((thumb, thumbIndex) => {
    const active = thumbIndex === index;
    thumb.classList.toggle("is-active", active);
    thumb.setAttribute("aria-pressed", String(active));
  });
}

function updateLightboxImage(index) {
  if (!lightboxProduct || !lightboxCard || !Number.isInteger(index) ||
      index < 0 || index >= lightboxGallery.length) return;

  lightboxIndex = index;
  const image = lightboxGallery[index];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxProductName.textContent = lightboxProduct.name;
  lightboxDescription.textContent = image.alt;
  lightboxCounter.textContent = `${index + 1} / ${lightboxGallery.length}`;
  lightboxCounter.hidden = lightboxGallery.length < 2;
  lightboxPrevious.hidden = lightboxGallery.length < 2;
  lightboxNext.hidden = lightboxGallery.length < 2;
  selectProductImage(lightboxProduct, lightboxCard, index);
}

function openImagePreview(productId, card, index) {
  const product = products.find((item) => item.id === productId);
  if (!product || !card || !lightbox || lightbox.open) return;

  lightboxProduct = product;
  lightboxCard = card;
  lightboxGallery = getProductImages(product);
  previousImageOverflow = document.body.style.overflow;
  lightbox.showModal();
  document.body.style.overflow = "hidden";
  updateLightboxImage(index);
}

function renderVariantSelector(product) {
  if (product.variants.length < 2) return "";

  const options = product.variants
    .map((variant) => {
      const status = variant.inventory > 0 ? "" : " — Sold out";
      return `
        <option value="${variant.id}" ${variant.inventory < 1 ? "disabled" : ""}>
          ${escapeHtml(variant.option)}${status}
        </option>`;
    })
    .join("");

  return `
    <label class="hc-product__variant-label" for="variant-${product.id}">
      Rope colour
      <select class="hc-product__variant" id="variant-${product.id}"
        data-product-id="${product.id}">
        ${options}
      </select>
    </label>`;
}

function renderSpecifications(product) {
  const rows = product.details
    .map(
      ([label, value]) => `
        <div class="hc-spec">
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>`,
    )
    .join("");

  return `
    <details class="hc-product__details">
      <summary>Product details <span aria-hidden="true">+</span></summary>
      <div class="hc-product__detail-body">
        <dl>${rows}</dl>
      </div>
    </details>`;
}

function renderProduct(product, index) {
  const firstVariant = product.variants[0];
  const stockMessage = firstVariant.inventory > 0
    ? `${firstVariant.inventory} available`
    : "Currently unavailable";

  return `
    <article class="hc-product" aria-labelledby="product-${product.id}"
      data-product-id="${product.id}">
      <div class="hc-product__visual">
        ${renderImage(product)}
        <span class="hc-product__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="hc-product__copy">
        <p class="hc-product__category">${escapeHtml(product.category)}</p>
        <h3 id="product-${product.id}">${escapeHtml(product.name)}</h3>
        <p class="hc-product__description">${escapeHtml(product.description)}</p>
        ${renderVariantSelector(product)}
        <div class="hc-product__purchase">
          <p class="hc-product__price">${currency.format(firstVariant.price)}</p>
          <p class="hc-product__stock" data-available="${firstVariant.inventory > 0}">
            ${stockMessage}
          </p>
        </div>
        <p class="hc-product__availability" aria-live="polite">
          ${firstVariant.inventory > 0 ? "Secure checkout via Shopify." : "This option is sold out."}
        </p>
        <div class="hc-product__actions">
          <button class="hc-product__add" type="button"
            data-add-to-cart="${product.id}" ${firstVariant.inventory < 1 ? "disabled" : ""}>
            ${firstVariant.inventory > 0 ? "Add to bag" : "Sold out"}
            <span aria-hidden="true">↗</span>
          </button>
          <a class="hc-product__enquire" href="${createEnquiryUrl(product, firstVariant)}"
            target="_blank" rel="noopener noreferrer">
            Ask a question <span aria-hidden="true">↗</span>
          </a>
        </div>
        ${renderSpecifications(product)}
      </div>
    </article>`;
}

function getSelectedVariant(product, card) {
  const selector = card.querySelector(".hc-product__variant");
  const id = selector ? Number(selector.value) : product.variants[0].id;
  return product.variants.find((variant) => variant.id === id);
}

function updateProductCard(card, product) {
  const variant = getSelectedVariant(product, card);
  if (!variant) return;

  const available = variant.inventory > 0;
  const price = card.querySelector(".hc-product__price");
  const stock = card.querySelector(".hc-product__stock");
  const availability = card.querySelector(".hc-product__availability");
  const addButton = card.querySelector(".hc-product__add");
  const enquiryLink = card.querySelector(".hc-product__enquire");

  price.textContent = currency.format(variant.price);
  stock.textContent = available ? `${variant.inventory} available` : "Sold out";
  stock.dataset.available = String(available);
  availability.textContent = available
    ? "Secure checkout via Shopify."
    : "This option is sold out.";
  addButton.disabled = !available;
  addButton.firstChild.textContent = available ? "Add to bag " : "Sold out ";
  enquiryLink.href = createEnquiryUrl(product, variant);
}

function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const count = getCartItemCount();
  const countElement = document.querySelector("#hc-cart-count");
  const headingCount = document.querySelector("#hc-cart-heading-count");
  const subtotal = cart.reduce((total, item) => {
    const entry = findVariant(item.variantId);
    return entry ? total + entry.variant.price * item.quantity : total;
  }, 0);

  if (countElement) countElement.textContent = String(count);
  if (headingCount) headingCount.textContent = `(${count})`;
  if (cartToggle) {
    cartToggle.setAttribute("aria-label", `Open shopping bag, ${count} items`);
  }
  document.querySelector("#hc-cart-subtotal").textContent = currency.format(subtotal);
  document.querySelector("#hc-cart-checkout").disabled = cart.length === 0;
}

function renderCart() {
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <p class="hc-cart__empty">
        Your bag is empty.<br />
        <a href="#collection" id="hc-cart-empty-link">Discover the collection</a>
      </p>`;
    const emptyLink = document.querySelector("#hc-cart-empty-link");
    emptyLink?.addEventListener("click", closeCart);
    updateCartCount();
    return;
  }

  cartBody.innerHTML = cart
    .map((item) => {
      const entry = findVariant(item.variantId);
      if (!entry) return "";
      const { product, variant } = entry;
      const option = variant.option
        ? `<p class="hc-cart__item-variant">Rope colour: ${escapeHtml(variant.option)}</p>`
        : "";

      return `
        <article class="hc-cart__item">
          <img src="${product.image}" alt="${escapeHtml(product.imageAlt)}" />
          <div class="hc-cart__item-info">
            <div>
              <h3 class="hc-cart__item-name">${escapeHtml(product.name)}</h3>
              ${option}
              <p class="hc-cart__item-price">${currency.format(variant.price)}</p>
            </div>
            <div class="hc-cart__item-controls">
              <div class="hc-cart__quantity" role="group"
                aria-label="Quantity for ${escapeHtml(product.name)}">
                <button type="button" data-cart-action="decrease"
                  data-variant-id="${variant.id}" aria-label="Decrease quantity">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-cart-action="increase"
                  data-variant-id="${variant.id}" aria-label="Increase quantity"
                  ${item.quantity >= variant.inventory ? "disabled" : ""}>+</button>
              </div>
              <button class="hc-cart__remove" type="button"
                data-cart-action="remove" data-variant-id="${variant.id}">
                Remove
              </button>
            </div>
          </div>
        </article>`;
    })
    .join("");

  updateCartCount();
}

function addToCart(product, variant) {
  if (!variant || variant.inventory < 1) {
    showToast("This option is currently unavailable.");
    return;
  }

  const existing = cart.find((item) => item.variantId === variant.id);
  if (existing) {
    if (existing.quantity >= variant.inventory) {
      showToast(`Only ${variant.inventory} available for this option.`);
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({ variantId: variant.id, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast(`${product.name}${variant.option ? ` — ${variant.option}` : ""} added to your bag.`);
}

function openCart() {
  if (!cartPanel || !cartOverlay) return;
  returnFocus = document.activeElement;
  renderCart();
  cartOverlay.hidden = false;
  cartPanel.removeAttribute("inert");
  cartPanel.setAttribute("aria-hidden", "false");
  cartToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  cartOverlay.classList.add("open");
  cartPanel.classList.add("open");
  window.setTimeout(() => {
    if (cartPanel.getAttribute("aria-hidden") === "false") {
      document.querySelector("#hc-cart-close").focus();
    }
  }, 50);
}

function closeCart() {
  if (!cartPanel || !cartOverlay || cartPanel.getAttribute("aria-hidden") === "true") return;
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartPanel.setAttribute("inert", "");
  cartToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  window.setTimeout(() => {
    if (cartPanel.getAttribute("aria-hidden") === "true") cartOverlay.hidden = true;
  }, 360);
  if (returnFocus instanceof HTMLElement) returnFocus.focus();
}

function handleCartActions(event) {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;

  const variantId = Number(button.dataset.variantId);
  const item = cart.find((line) => line.variantId === variantId);
  const entry = findVariant(variantId);
  if (!item || !entry) return;

  if (button.dataset.cartAction === "increase") {
    if (item.quantity >= entry.variant.inventory) {
      showToast(`Only ${entry.variant.inventory} available for this option.`);
      return;
    }
    item.quantity += 1;
  } else if (button.dataset.cartAction === "decrease") {
    item.quantity -= 1;
    if (item.quantity < 1) cart = cart.filter((line) => line.variantId !== variantId);
  } else {
    cart = cart.filter((line) => line.variantId !== variantId);
  }

  saveCart();
  renderCart();
}

function goToShopifyCheckout() {
  if (cart.length === 0) {
    showToast("Your bag is empty.");
    return;
  }

  for (const item of cart) {
    const entry = findVariant(item.variantId);
    if (!entry || entry.variant.inventory < item.quantity) {
      showToast("An item in your bag is no longer available. Please review your bag.");
      renderCart();
      return;
    }
  }

  const lines = cart
    .map((item) => `${item.variantId}:${item.quantity}`)
    .join(",");
  window.location.assign(`${SHOPIFY_STORE_URL}/cart/${lines}`);
}

function trapCartFocus(event) {
  if (event.key === "Escape") {
    closeCart();
    return;
  }
  if (event.key !== "Tab" || cartPanel.getAttribute("aria-hidden") === "true") return;

  const focusable = [...cartPanel.querySelectorAll(
    'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
  )];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

if (productGrid) {
  productGrid.innerHTML = products.map(renderProduct).join("");
  productGrid.addEventListener("change", (event) => {
    const selector = event.target.closest(".hc-product__variant");
    if (!selector) return;
    const product = products.find((item) => item.id === selector.dataset.productId);
    const card = selector.closest(".hc-product");
    if (product && card) updateProductCard(card, product);
  });
  productGrid.addEventListener("click", (event) => {
    const thumbnail = event.target.closest("[data-image-select]");
    if (thumbnail) {
      const product = products.find((item) => item.id === thumbnail.dataset.imageSelect);
      const card = thumbnail.closest(".hc-product");
      if (product && card) {
        selectProductImage(product, card, Number(thumbnail.dataset.imageIndex));
      }
      return;
    }

    const preview = event.target.closest("[data-image-preview]");
    if (preview) {
      openImagePreview(
        preview.dataset.imagePreview,
        preview.closest(".hc-product"),
        Number(preview.dataset.imageIndex),
      );
      return;
    }

    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.addToCart);
    const card = button.closest(".hc-product");
    if (!product || !card) return;
    addToCart(product, getSelectedVariant(product, card));
  });
}

document.querySelector("#hc-lightbox-close")?.addEventListener("click", () => {
  lightbox?.close();
});
lightboxPrevious?.addEventListener("click", () => {
  if (lightboxGallery.length < 2) return;
  updateLightboxImage((lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length);
});
lightboxNext?.addEventListener("click", () => {
  if (lightboxGallery.length < 2) return;
  updateLightboxImage((lightboxIndex + 1) % lightboxGallery.length);
});
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener("close", () => {
  document.body.style.overflow = previousImageOverflow;
  lightboxGallery = [];
  lightboxProduct = null;
  lightboxCard = null;
});
lightbox?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    lightbox.close();
    return;
  }
  if (lightboxGallery.length < 2) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    updateLightboxImage((lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    updateLightboxImage((lightboxIndex + 1) % lightboxGallery.length);
  }
});

let swipeStartX = 0;
let swipeStartY = 0;
lightboxImage?.addEventListener("touchstart", (event) => {
  swipeStartX = event.touches[0].clientX;
  swipeStartY = event.touches[0].clientY;
}, { passive: true });
lightboxImage?.addEventListener("touchend", (event) => {
  if (lightboxGallery.length < 2) return;
  const deltaX = event.changedTouches[0].clientX - swipeStartX;
  const deltaY = event.changedTouches[0].clientY - swipeStartY;
  if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  const direction = deltaX < 0 ? 1 : -1;
  updateLightboxImage((lightboxIndex + direction + lightboxGallery.length) % lightboxGallery.length);
}, { passive: true });

cartToggle?.addEventListener("click", () => {
  if (cartPanel.getAttribute("aria-hidden") === "false") closeCart();
  else openCart();
});
document.querySelector("#hc-cart-close")?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);
cartBody?.addEventListener("click", handleCartActions);
document.querySelector("#hc-cart-checkout")?.addEventListener("click", goToShopifyCheckout);
document.querySelector("#hc-cart-continue")?.addEventListener("click", closeCart);
document.addEventListener("keydown", trapCartFocus);

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
renderCart();
