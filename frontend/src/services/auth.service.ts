import { api, tokenStore } from './api';
import type { Role, User } from '@/types';

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post('/auth/login', { email, password });
    const payload = data.data as LoginResponse;
    tokenStore.set(payload.accessToken, payload.refreshToken);
    return payload.user;
  },

  async register(input: RegisterInput): Promise<User> {
    const { data } = await api.post('/auth/register', input);
    return data.data as User;
  },

  async me(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data as User;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      tokenStore.clear();
    }
  },
};
