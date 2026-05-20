'use client';

import { create } from 'zustand';
import { apiService } from '@/lib/api-client';
import { LoginData, RegisterData, User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getClient().post('/auth/login', data);
      const payload = response.data.data;
      apiService.setToken(payload.access_token);
      set({ user: payload.user, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.response?.data?.message || 'Login failed' });
      throw error;
    }
  },
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getClient().post('/auth/register', data);
      const payload = response.data.data;
      apiService.setToken(payload.access_token || '');
      set({ user: payload, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.response?.data?.message || 'Register failed' });
      throw error;
    }
  },
  logout: () => {
    apiService.clearToken();
    set({ user: null, loading: false, error: null });
  },
}));
