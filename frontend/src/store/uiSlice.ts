import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const THEME_KEY = 'ratnika_theme';

type Theme = 'light' | 'dark';

function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored) return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface UiState {
  theme: Theme;
  mobileNavOpen: boolean;
  cartDrawerOpen: boolean;
  searchOpen: boolean;
}

const initialState: UiState = {
  theme: loadTheme(),
  mobileNavOpen: false,
  cartDrawerOpen: false,
  searchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem(THEME_KEY, action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, state.theme);
    },
    setMobileNav(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    setCartDrawer(state, action: PayloadAction<boolean>) {
      state.cartDrawerOpen = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setMobileNav, setCartDrawer, setSearchOpen } =
  uiSlice.actions;
export default uiSlice.reducer;
