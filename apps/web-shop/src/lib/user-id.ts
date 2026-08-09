import { useAuthStore } from '../modules/auth/stores/auth.store';

const GUEST_ID_KEY = 'skyline-guest-id';

function getGuestId(): string {
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = `guest-${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

export function getUserId(): string {
  const user = useAuthStore.getState().user;
  return user?.id || getGuestId();
}
