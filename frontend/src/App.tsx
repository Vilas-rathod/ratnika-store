import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLoader } from '@/components/shared/Spinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { ScrollToTop } from '@/components/routing/ScrollToTop';
import { ProtectedRoute, GuestRoute } from '@/components/routing/ProtectedRoute';
import { StoreLayout } from '@/layouts/StoreLayout';
import { AccountLayout } from '@/layouts/AccountLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAppDispatch } from '@/store/hooks';
import { setInitialized } from '@/store/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { tokenStore } from '@/services/http';

// ── Public pages ────────────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

// ── Auth pages ──────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// ── Customer pages ──────────────────────────────────────────────
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const AccountDashboardPage = lazy(() => import('@/pages/account/AccountDashboardPage'));
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const OrderDetailsPage = lazy(() => import('@/pages/account/OrderDetailsPage'));
const MyReviewsPage = lazy(() => import('@/pages/account/MyReviewsPage'));

// ── Admin pages ─────────────────────────────────────────────────
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminCustomersPage = lazy(() => import('@/pages/admin/AdminCustomersPage'));
const AdminCouponsPage = lazy(() => import('@/pages/admin/AdminCouponsPage'));
const AdminReviewsPage = lazy(() => import('@/pages/admin/AdminReviewsPage'));
const AdminBannersPage = lazy(() => import('@/pages/admin/AdminBannersPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));

export default function App() {
  const dispatch = useAppDispatch();
  const { refreshProfile } = useAuth();

  // Re-hydrate the session on load if a refresh token exists.
  useEffect(() => {
    (async () => {
      if (tokenStore.access) await refreshProfile();
      dispatch(setInitialized(true));
    })();
  }, [dispatch, refreshProfile]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Storefront */}
          <Route element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="product/:slug" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="about" element={<AboutPage />} />

            {/* Checkout requires auth */}
            <Route element={<ProtectedRoute />}>
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>

            {/* Customer account */}
            <Route element={<ProtectedRoute />}>
              <Route path="account" element={<AccountLayout />}>
                <Route index element={<AccountDashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
                <Route path="reviews" element={<MyReviewsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Auth */}
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="banners" element={<AdminBannersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
