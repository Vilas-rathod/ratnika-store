import { motion } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { bannerImage } from '@/lib/placeholder';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(120,80,20,0.85), rgba(60,40,10,0.9)), url("${bannerImage(0)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
          </span>
          <span className="font-display text-2xl font-semibold">{APP_NAME}</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >
          <h1 className="font-display text-4xl font-semibold leading-tight">{APP_TAGLINE}</h1>
          <p className="mt-4 text-white/80">
            Discover handcrafted rings, earrings, necklaces and more — designed in Pune, loved
            across India.
          </p>
        </motion.div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} {APP_NAME}</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <img src="/favicon.svg" alt="" className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-semibold">{APP_NAME}</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
