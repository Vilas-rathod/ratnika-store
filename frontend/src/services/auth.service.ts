import type { AuthResponse, AuthTokens, User } from '@/types';
import { http, tokenStore } from './http';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await http.post<AuthResponse>('/auth/register', payload);
    tokenStore.set(res.tokens);
    return res;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await http.post<AuthResponse>('/auth/login', payload);
    tokenStore.set(res.tokens);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await http.post('/auth/logout', { refreshToken: tokenStore.refresh });
    } finally {
      tokenStore.clear();
    }
  },

  refresh(refreshToken: string) {
    return http.post<AuthTokens>('/auth/refresh', { refreshToken });
  },

  me() {
    return http.get<User>('/users/me');
  },

  forgotPassword(email: string) {
    return http.post<{ message: string }>('/auth/forgot-password', { email });
  },

  resetPassword(payload: { email: string; otp: string; password: string }) {
    return http.post<{ message: string }>('/auth/reset-password', payload);
  },

  verifyOtp(payload: { email: string; otp: string }) {
    return http.post<User>('/auth/verify-otp', payload);
  },

  resendOtp(email: string) {
    return http.post<{ message: string }>('/auth/resend-otp', { email });
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return http.post<{ message: string }>('/auth/change-password', payload);
  },
};
