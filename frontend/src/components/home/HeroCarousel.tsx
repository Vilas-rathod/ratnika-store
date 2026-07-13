import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Banner } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroCarouselProps {
  banners?: Banner[];
  loading?: boolean;
}

export function HeroCarousel({ banners, loading }: HeroCarouselProps) {
  const heroes = (banners ?? []).filter((b) => b.placement === 'HERO');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (heroes.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % heroes.length), 5500);
    return () => clearInterval(t);
  }, [heroes.length]);

  if (loading) return <Skeleton className="h-[320px] w-full rounded-xl sm:h-[420px]" />;
  if (!heroes.length) return null;

  const banner = heroes[index];
  const go = (dir: number) => setIndex((i) => (i + dir + heroes.length) % heroes.length);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex min-h-[320px] items-center sm:min-h-[420px]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(28,18,6,0.88) 0%, rgba(28,18,6,0.65) 55%, rgba(28,18,6,0.4) 100%), url("${banner.imageUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-xl px-6 py-10 text-white sm:px-12">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl font-semibold leading-tight sm:text-5xl"
            >
              {banner.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 max-w-md text-sm text-white/85 sm:text-base"
            >
              {banner.subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Button asChild size="lg" variant="gold">
                <Link to={banner.ctaLink}>{banner.ctaLabel}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {heroes.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {heroes.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
