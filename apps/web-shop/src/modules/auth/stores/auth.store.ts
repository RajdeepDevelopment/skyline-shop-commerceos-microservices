import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('token', response.accessToken);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({
            error: message,
            isLoading: false,
          });
          throw new Error(message);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('token', response.accessToken);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: message,
            isLoading: false,
          });
          throw new Error(message);
        }
      },

      logout: async () => {
        const state = get();
        const token = state.token;
        if (token) {
          try {
            await authService.logout();
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        localStorage.removeItem('token');
      },

      refreshToken: async () => {
        const state = get();
        const token = state.token;
        if (!token) return;

        try {
          const response = await authService.refreshToken(token);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
          });
          localStorage.setItem('token', response.accessToken);
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'Token refresh failed',
          });
          localStorage.removeItem('token');
        }
      },

      setUser: (user: User) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
