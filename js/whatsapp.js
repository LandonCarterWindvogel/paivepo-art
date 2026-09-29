// whatsapp.js — Paivepo ordering links
//
// WhatsApp creates the individual catalog-item URLs inside WhatsApp Business.
// Keep the generated links here so the website's artwork/data never depends on
// WhatsApp's image hosting quality. Replace each empty value with the exact
// "Share link" copied from the matching WhatsApp catalog item.

export const WHATSAPP_CATALOG_URL = 'https://wa.me/c/27629131440';
export const WHATSAPP_CHAT_URL = 'https://wa.me/27629131440';

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
