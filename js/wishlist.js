/**
 * wishlist.js — Persisted wishlist using localStorage
 */
import { showToast } from './ui.js';
import { sounds } from './sound.js';

const STORAGE_KEY = 'paivepo_wishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveWishlist(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function isWishlisted(id) {
  return getWishlist().includes(id);
}

export function toggleWishlist(product) {
  const wl  = getWishlist();
  const idx = wl.indexOf(product.id);
  if (idx === -1) {
    wl.push(product.id);
    saveWishlist(wl);
    sounds.addCart();
    showToast(`"${product.name}" saved to your wishlist`);
    return true;
  } else {
    wl.splice(idx, 1);
    saveWishlist(wl);
    showToast(`"${product.name}" removed from wishlist`);
    return false;
  }
}

export function initWishlist() {
  // Nothing to do at init — state is applied per product page load
}
