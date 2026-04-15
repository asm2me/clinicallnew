import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/api';
import { router } from 'expo-router';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  tenantId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrated: boolean;

  login:   (email: string, password: string, tenantId: string) => Promise<void>;
  logout:  () => Promise<void>;
  hydrate: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  tenantId:        null,
  isLoading:       false,
  isAuthenticated: false,
  hydrated:        false,

  login: async (email, password, tenantId) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.login(email, password);
      await SecureStore.setItemAsync('access_token', data.access_token);
      await SecureStore.setItemAsync('tenant_id',    tenantId);
      set({ user: data.user, tenantId, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try { await authService.logout(); } catch {}
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('tenant_id');
    set({ user: null, tenantId: null, isAuthenticated: false });
    router.replace('/auth/login');
  },

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const token    = await SecureStore.getItemAsync('access_token');
      const tenantId = await SecureStore.getItemAsync('tenant_id');
      if (token && tenantId) {
        const { data } = await authService.me();
        set({ user: data.user, tenantId, isAuthenticated: true });
      }
    } catch {
      await SecureStore.deleteItemAsync('access_token');
    } finally {
      set({ isLoading: false, hydrated: true });
    }
  },

  setUser: (user) => set({ user }),
}));
