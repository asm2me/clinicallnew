import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/auth';
import { clearAuthTokens, setAuthTokens, fetchCurrentUser } from '@/lib/auth';
import { authApi } from '@/lib/api';

interface AuthState {
  user: AuthUser | null;
  tenantId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string, tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenantId: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password, tenantId) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login({ email, password });
          setAuthTokens(data.access_token, tenantId);
          set({ user: data.user, tenantId, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          clearAuthTokens();
          set({ user: null, tenantId: null, isAuthenticated: false });
          window.location.href = '/auth/login';
        }
      },

      hydrate: async () => {
        set({ isLoading: true });
        const user = await fetchCurrentUser();
        set({ user, isAuthenticated: !!user, isLoading: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'clinic-auth',
      partialize: (state) => ({ tenantId: state.tenantId }),
    }
  )
);
