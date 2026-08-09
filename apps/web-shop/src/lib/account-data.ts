/**
 * Client-side persistence for the user's saved addresses and payment methods.
 *
 * There is no backend profile API yet (auth-service only exposes
 * register/login/refresh), so these are stored per-user in localStorage and
 * survive page reloads on the same device.
 */

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  line: string;
  city: string;
  phone: string;
}

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expires: string;
  name: string;
}

const addressesKey = (userId: string) => `skyline:${userId}:addresses`;
const cardsKey = (userId: string) => `skyline:${userId}:cards`;

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / private mode — ignore
  }
}

export function getSavedAddresses(userId: string): SavedAddress[] {
  return read<SavedAddress>(addressesKey(userId));
}

export function upsertSavedAddress(userId: string, address: SavedAddress): SavedAddress[] {
  const all = getSavedAddresses(userId);
  const idx = all.findIndex((a) => a.id === address.id);
  if (idx >= 0) all[idx] = address;
  else all.unshift(address);
  write(addressesKey(userId), all);
  return all;
}

export function removeSavedAddress(userId: string, addressId: string): SavedAddress[] {
  const all = getSavedAddresses(userId).filter((a) => a.id !== addressId);
  write(addressesKey(userId), all);
  return all;
}

export function getSavedCards(userId: string): SavedCard[] {
  return read<SavedCard>(cardsKey(userId));
}

export function addSavedCard(userId: string, card: SavedCard): SavedCard[] {
  const all = [card, ...getSavedCards(userId)];
  write(cardsKey(userId), all);
  return all;
}

export function removeSavedCard(userId: string, cardId: string): SavedCard[] {
  const all = getSavedCards(userId).filter((c) => c.id !== cardId);
  write(cardsKey(userId), all);
  return all;
}
