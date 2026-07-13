import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

const USER_KEY = 'ratnika_user';

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

interface AuthState {
  user: User | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: loadUser(),
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem(USER_KEY);
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
  },
});

export const { setUser, clearUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;
