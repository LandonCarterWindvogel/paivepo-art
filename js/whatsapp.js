// whatsapp.js — Paivepo ordering links
//
// WhatsApp creates the individual catalog-item URLs inside WhatsApp Business.
// Keep the generated links here so the website's artwork/data never depends on
// WhatsApp's image hosting quality. Replace each empty value with the exact
// "Share link" copied from the matching WhatsApp catalog item.

export const WHATSAPP_CATALOG_URL = 'https://wa.me/c/27629131440';
export const WHATSAPP_CHAT_URL = 'https://wa.me/27629131440';

// Current catalogue links supplied from WhatsApp Business.
// There are 10 unique items in the supplied list; two links were duplicated.
export const CURRENT_WHATSAPP_CATALOG_LINKS = Object.freeze([
  'https://wa.me/p/9021802674576203/272790754213933', // catalogue item 1
  'https://wa.me/p/9555683707812027/272790754213933', // catalogue item 2
  'https://wa.me/p/9993455604021108/272790754213933', // catalogue item 3
  'https://wa.me/p/9562012450503283/272790754213933', // catalogue item 4
  'https://wa.me/p/9989517454428586/272790754213933', // catalogue item 5
  'https://wa.me/p/9923105047782513/272790754213933', // catalogue item 6
  'https://wa.me/p/9914895738606999/272790754213933', // catalogue item 7
  'https://wa.me/p/9863370360381310/272790754213933', // catalogue item 8
  'https://wa.me/p/9155545147823927/272790754213933', // catalogue item 9
  'https://wa.me/p/8970746439615205/272790754213933', // catalogue item 10
]);

// These are intentionally not assigned to website product IDs yet.
// The WhatsApp URL does not expose the artwork/product name to our tooling,
// so we do not guess and risk pairing the wrong image with the wrong item.

export const WHATSAPP_ITEM_LINKS = Object.freeze({
  0: '', // The Rooster
  1: '', // The Elephant
  2: '', // The Lion
  3: '', // Beaded Protea
  4: '', // The Wire Fairy
  5: '', // The Peacock
  6: '', // The Zebra
  7: '', // The Flamingo
  8: '', // The Guardian
  20: '', // Elephant at Dusk
  21: '', // Lion Portrait
  30: '', // Village Morning
  32: '', // Women of Zimbabwe
  40: '', // Barrel Swing Chair
});

export function hasSpecificWhatsAppLink(product) {
  return Boolean(product && WHATSAPP_ITEM_LINKS[product.id]);
}

export function getWhatsAppLink(product) {
  if (!product) return WHATSAPP_CATALOG_URL;
  const itemLink = WHATSAPP_ITEM_LINKS[product.id];
  if (itemLink) return itemLink;

  // Safe fallback while the exact catalog-item link is being collected.
  // This opens the business chat with the piece name already typed for the customer.
  const message = encodeURIComponent(
    'Hi Paivepo, I am interested in "' + product.name + '". Please can you help me with availability and ordering?'
  );
  return WHATSAPP_CHAT_URL + '?text=' + message;
}
