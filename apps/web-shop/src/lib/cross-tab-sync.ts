const CHANNEL_NAME = 'skyline-auth';
const LOGOUT_EVENT = 'logout';

type AuthMessage = {
  type: typeof LOGOUT_EVENT;
};

class CrossTabSync {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<AuthMessage>) => {
        if (event.data.type === LOGOUT_EVENT) {
          this.listeners.forEach((listener) => listener());
        }
      };
    } else {
      // Fallback: use localStorage event for older browsers
      window.addEventListener('storage', (event) => {
        if (event.key === 'skyline-auth-logout') {
          this.listeners.forEach((listener) => listener());
        }
      });
    }
  }

  broadcastLogout() {
    if (this.channel) {
      this.channel.postMessage({ type: LOGOUT_EVENT } satisfies AuthMessage);
    } else {
      // Fallback: set a timestamp in localStorage to trigger storage event in other tabs
      localStorage.setItem('skyline-auth-logout', Date.now().toString());
      localStorage.removeItem('skyline-auth-logout');
    }
  }

  onLogout(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const crossTabSync = new CrossTabSync();
