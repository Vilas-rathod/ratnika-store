import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME, HQ_CITY, SUPPORT_EMAIL, SUPPORT_PHONE } from '@/lib/constants';

const shopLinks = [
  { label: 'All Jewellery', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?newArrival=true' },
  { label: 'Best Sellers', to: '/shop?bestSeller=true' },
  { label: 'Categories', to: '/categories' },
];

const helpLinks = [
  { label: 'My Account', to: '/account' },
  { label: 'Track Order', to: '/account/orders' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'About Us', to: '/about' },
];

export function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! Watch your inbox for exclusive offers.');
    setEmail('');
  };

  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <img src="/favicon.svg" alt="" className="h-6 w-6" />
              </span>
              <span className="font-display text-xl font-semibold">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Exquisite handcrafted jewellery for every occasion — thoughtfully designed and
              delivered across India.
            </p>
            <div className="mt-4 flex gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {shopLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {helpLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Stay in the loop</h4>
            <form onSubmit={subscribe} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {HQ_CITY}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {SUPPORT_PHONE}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> {SUPPORT_EMAIL}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
