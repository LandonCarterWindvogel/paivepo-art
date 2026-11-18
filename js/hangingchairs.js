const WHATSAPP_BASE = "https://wa.me/27629131440?text=";

const products = [
  {
    id: "curve-bench",
    name: "The Barrel Curve Bench",
    category: "Benches",
    image: "/images/bench.jpg",
    imageAlt: "Curved bench made from reclaimed wine-barrel timber",
    detailImage: "/images/bench_zoom.jpg",
    detailImageAlt: "Close detail of the curved wine-barrel wood bench",
    price: 3400,
    description:
      "A low, curved seat that lets the oak set the tone. Barrel staves bring their deep grain and traces of use to a bench made for a garden, terrace or quiet corner indoors.",
    details: [
      ["Dimensions", "Approx. 500 × 1,000 × 360 mm (H × W × D)"],
      ["Material", "Reclaimed oak wine-barrel wood"],
      ["Finish", "ProNature Outdoor Matt Sealer"],
      ["Weight", "Approx. 11 kg"],
      [
        "Care",
        "Wipe clean and promptly clean spills. For outdoor use, periodically reapply a suitable exterior timber sealer.",
      ],
      ["Suitable spaces", "Indoor and outdoor"],
    ],
  },
  {
    id: "backrest-bench",
    name: "The Barrel Backrest Bench",
    category: "Benches",
    image: "/images/backbench.jpg",
    imageAlt: "Reclaimed timber bench with a distinctive slatted backrest",
    detailImage: "/images/backbench_zoom.jpg",
    detailImageAlt: "Close detail of the reclaimed timber backrest bench",
    price: 3800,
    description:
      "A generous seat with a slatted back, shaped from reclaimed barrel oak. Its curve, colour and marks give the backrest a presence that feels at home around a long table or outdoors.",
    details: [
      ["Dimensions", "Approx. 800 × 1,000 × 900 mm (H × W × D)"],
      ["Material", "Reclaimed oak wine-barrel wood"],
      ["Finish", "Please enquire for the finish available on this piece."],
      ["Weight", "Approx. 22 kg"],
      ["Suitable spaces", "Outdoor seating"],
    ],
  },
  {
    id: "bar-stool",
    name: "The Barrel Bar Stool",
    category: "Bar seating",
    image: "/images/bars_stool.jpg",
    imageAlt: "Tall reclaimed wine-barrel wood bar stool with metal footrest",
    detailImage: "/images/bars_stool_zoom.jpg",
    detailImageAlt: "Close detail of the timber and footrest on the bar stool",
    price: 1800,
    description:
      "A compact bar seat with a wooden backrest and integrated metal footrest. The oak retains traces of its former life in a piece made to draw the eye without asking for attention.",
    details: [
      ["Dimensions", "Please enquire for current measurements."],
      ["Material", "Reclaimed oak wine-barrel wood"],
      ["Finish", "Please enquire for the finish available on this piece."],
      ["Weight", "Approx. 5 kg"],
      ["Design", "Wooden backrest with integrated metal footrest"],
    ],
  },
  {
    id: "backrest-swing",
    name: "The Barrel Backrest Swing",
    category: "Hanging chairs",
    image: "/images/hanging_bench.jpg",
    imageAlt: "Reclaimed timber hanging swing with a backrest and armrests",
    detailImage: "/images/hanging_bench_zoom.jpg",
    detailImageAlt: "Close detail of the hanging swing timber and rope",
    price: 4300,
    ropeColors: ["Black", "White"],
    description:
      "A suspended seat with a curved oak base, slatted back and armrests. Its barrel wood carries its own shifts of tone; choose black or white yachting rope.",
    details: [
      ["Dimensions", "Approx. 600 × 1,000 × 1,000 mm (H × W × D)"],
      ["Material", "Reclaimed oak wine-barrel wood"],
      ["Finish", "Outdoor ProNature Sealer"],
      ["Weight", "Approx. 20 kg"],
      ["Suspension", "Yachting rope; black or white colour options"],
      ["Assembly", "Flat-packed; simple assembly required"],
      [
        "Care",
        "Wipe with a soft, damp cloth, inspect the rope periodically and reapply a suitable exterior timber sealer as needed.",
      ],
    ],
  },
  {
    id: "swing-seat",
    name: "The Barrel Swing Seat",
    category: "Hanging chairs",
    image: "/images/hanging_chair.jpg",
    imageAlt: "Curved reclaimed wine-barrel wood swing seat on rope",
    price: 1600,
    ropeColors: ["Black", "White"],
    description:
      "A quiet, pared-back swing seat that leaves the curve and grain of the oak in view. Finished with outdoor sealer and available with black or white yachting rope.",
    details: [
      ["Dimensions", "Approx. 400 × 800 × 600 mm (H × W × D)"],
      ["Material", "Reclaimed oak wine-barrel wood"],
      ["Finish", "Outdoor ProNature Sealer"],
      ["Weight", "Approx. 6 kg"],
      ["Suspension", "Yachting rope; black or white colour options"],
      [
        "Care",
        "Wipe with a soft, damp cloth, inspect the rope periodically and reapply a suitable exterior timber sealer as needed.",
      ],
    ],
  },
];

const productGrid = document.querySelector("#hc-products");

function createEnquiryUrl(product, ropeColor) {
  const variant = ropeColor ? ` Rope colour: ${ropeColor}.` : "";
  const message =
    `Hi, I would like to enquire about ${product.name}.${variant} ` +
    "Please confirm availability and delivery options.";
  return `${WHATSAPP_BASE}${encodeURIComponent(message)}`;
}

function renderImage(product) {
  return `
    <figure class="hc-product__image">
      <img src="${product.image}" alt="${product.imageAlt}" loading="lazy" />
    </figure>`;
}

function renderRopeSelector(product) {
  if (!product.ropeColors) return "";

  const options = product.ropeColors
    .map((color) => `<option value="${color}">${color}</option>`)
    .join("");

  return `
    <label class="hc-product__variant-label" for="rope-${product.id}">
      Suspension rope
      <select class="hc-product__variant" id="rope-${product.id}"
        data-product-id="${product.id}">
        ${options}
      </select>
    </label>`;
}

function renderSpecifications(product) {
  const specifications = [...product.details];
  specifications.push(
    [
      "Oak provenance",
      "Reclaimed oak from genuine wine barrels that held wine for years. Natural colour and markings vary; each barrel yields only a limited number of pieces.",
    ],
    [
      "Availability & lead time",
      "Confirmed on enquiry for the selected piece and delivery destination.",
    ],
  );

  const rows = specifications
    .map(
      ([label, value]) => `
        <div class="hc-spec">
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>`,
    )
    .join("");

  return `
    <details class="hc-product__details">
      <summary>Product details <span aria-hidden="true">+</span></summary>
      <div class="hc-product__detail-body">
        <dl>${rows}</dl>
        ${
          product.detailImage
            ? `<figure class="hc-product__detail-photo">
                <img src="${product.detailImage}" alt="${product.detailImageAlt}" loading="lazy" />
                <figcaption>Detail of the reclaimed timber and finish.</figcaption>
              </figure>`
            : ""
        }
      </div>
    </details>`;
}

function renderCard(product) {
  const ropeColor = product.ropeColors ? product.ropeColors[0] : null;
  return `
    <article class="hc-product" aria-labelledby="product-${product.id}">
      <div class="hc-product__visual">
        ${renderImage(product)}
        <span class="hc-product__number" aria-hidden="true">${String(
          products.indexOf(product) + 1,
        ).padStart(2, "0")}</span>
      </div>
      <div class="hc-product__copy">
        <p class="hc-product__category">${product.category}</p>
        <h3 id="product-${product.id}">${product.name}</h3>
        <p class="hc-product__description">${product.description}</p>
        ${renderRopeSelector(product)}
        <div class="hc-product__purchase">
          <p class="hc-product__price">R ${product.price.toLocaleString("en-ZA")}</p>
          <p class="hc-product__stock">Limited yield from each barrel · Enquire for availability</p>
        </div>
        <div class="hc-product__actions">
          <a class="hc-product__enquire" href="${createEnquiryUrl(
            product,
            ropeColor,
          )}" target="_blank" rel="noopener noreferrer">
            Ask about this piece <span aria-hidden="true">↗</span>
          </a>
        </div>
        ${renderSpecifications(product)}
      </div>
    </article>`;
}

if (productGrid) {
  productGrid.innerHTML = products.map(renderCard).join("");

  productGrid.querySelectorAll(".hc-product__variant").forEach((selector) => {
    const product = products.find(
      (item) => item.id === selector.dataset.productId,
    );
    const enquiryLink = selector
      .closest(".hc-product")
      .querySelector(".hc-product__enquire");

    selector.addEventListener("change", () => {
      enquiryLink.href = createEnquiryUrl(product, selector.value);
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
