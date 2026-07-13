import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  ShoppingBag,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { APP_NAME } from '@/lib/constants';
import { avatarImage } from '@/lib/placeholder';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCatalog';
import { useAppDispatch, useAppSelector, useCartCount, useWishlistCount } from '@/store/hooks';
import { toggleTheme } from '@/store/uiSlice';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const { data: categories } = useCategories();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-xs font-medium">
          ✨ Free shipping on orders above ₹999 · Handcrafted in Pune · COD available
        </p>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <img src="/favicon.svg" alt="" className="h-6 w-6" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={submitSearch} className="relative mx-4 hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rings, earrings, mangalsutra…"
            className="pl-9"
          />
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
            <Link to="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="Cart">
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user?.avatarUrl ?? avatarImage(`${user?.firstName} ${user?.lastName}`)} />
                    <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.firstName} {user?.lastName}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <UserIcon /> My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                  <Package /> My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="ml-1" size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden border-t border-border md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5 text-sm no-scrollbar">
          <Link to="/shop" className="whitespace-nowrap font-medium text-primary hover:opacity-80">
            All Jewellery
          </Link>
          {categories?.slice(0, 9).map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.slug}`}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
          <Link
            to="/shop?newArrival=true"
            className="whitespace-nowrap font-medium text-[var(--gold)] hover:opacity-80"
          >
            New Arrivals
          </Link>
        </div>
      </nav>

      {/* Mobile drawer — portalled to <body> so the header's backdrop-blur
          (which creates a containing block) doesn't clip the fixed overlay.
          Uses CSS transitions (reliable across StrictMode/portals). */}
      {createPortal(
        <div className="md:hidden" aria-hidden={!mobileOpen}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{ opacity: mobileOpen ? 1 : 0 }}
            className={cn(
              'fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300',
              !mobileOpen && 'pointer-events-none',
            )}
          />
          {/* Panel */}
          <aside
            style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
            className="fixed inset-y-0 left-0 z-[70] flex w-80 max-w-[85vw] flex-col bg-background shadow-xl transition-transform duration-300 ease-out"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-display text-lg font-semibold">{APP_NAME}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="relative border-b border-border p-4">
              <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jewellery…"
                className="pl-9"
              />
            </form>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Categories</p>
              <div className="flex flex-col">
                <Link
                  to="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2 font-medium hover:bg-accent"
                >
                  All Jewellery
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent"
                  >
                    {c.name}
                    {c.productCount != null && <Badge variant="secondary">{c.productCount}</Badge>}
                  </Link>
                ))}
              </div>
            </div>
            {!isAuthenticated && (
              <div className="border-t border-border p-4">
                <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                  <Link to="/login">Sign In / Register</Link>
                </Button>
              </div>
            )}
          </aside>
        </div>,
        document.body,
      )}
    </header>
  );
}
