import { api } from '@/lib/api';
import type { AuthResponse } from '@/types';

export const authService = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  demoAdmin: () =>
    api.post<AuthResponse>('/auth/demo/admin').then((r) => r.data),

  demoManager: () =>
    api.post<AuthResponse>('/auth/demo/manager').then((r) => r.data),

  demoMember: () =>
    api.post<AuthResponse>('/auth/demo/member').then((r) => r.data),
};
