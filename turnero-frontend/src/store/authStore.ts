import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario, UsuarioAutenticado } from '@/types';

interface AuthStore {
  user: UsuarioAutenticado | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: UsuarioAutenticado | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: UsuarioAutenticado) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      login: (user) => {
        set({ user, token: user.token });
        localStorage.setItem('token', user.token);
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },

      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
