import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser, setUser } from '@/store/authSlice';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service';
import type { ApiError } from '@/services/http';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const res = await authService.login(payload);
      dispatch(setUser(res.user));
      return res.user;
    },
    [dispatch],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await authService.register(payload);
      dispatch(setUser(res.user));
      return res.user;
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    dispatch(clearUser());
    toast.info('You have been signed out.');
  }, [dispatch]);

  const refreshProfile = useCallback(async () => {
    try {
      const me = await authService.me();
      dispatch(setUser(me));
      return me;
    } catch (err) {
      if ((err as ApiError).status === 401) dispatch(clearUser());
      return null;
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    refreshProfile,
    setUser: (u: Parameters<typeof setUser>[0]) => dispatch(setUser(u)),
  };
}
