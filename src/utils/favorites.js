// src/utils/favorites.js
const KEY = "sewna:favorites";

function safeParse(v) {
  try {
    return JSON.parse(v || "[]");
  } catch {
    return [];
  }
}

function emitToast(message) {
  try {
    window.dispatchEvent(new CustomEvent("sewna:toast", { detail: { message } }));
  } catch {}
}

export function getFavorites() {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY));
}

export function isFavorited(id) {
  const fav = getFavorites();
  return fav.includes(id);
}

export function toggleFavorite(id) {
  const fav = getFavorites();
  const idx = fav.indexOf(id);
  let added = false;
  if (idx > -1) {
    fav.splice(idx, 1);
  } else {
    fav.push(id);
    added = true;
  }
  localStorage.setItem(KEY, JSON.stringify(fav));

  // emit toast
  if (added) emitToast("Saved to favorites");
  else emitToast("Removed from favorites");

  return fav;
}
