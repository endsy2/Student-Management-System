import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services/auth.service';
import { tokenStore } from '@/services/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  async login(email, password) {
    const user = await authService.login(email, password);
    set({ user, loading: false });
    return user;
  },

  async loadSession() {
    if (!tokenStore.access) {
      set({ user: null, loading: false });
      return;
    }
    try {
      const user = await authService.me();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  async logout() {
    await authService.logout();
    set({ user: null });
  },
}));
