import { motion } from 'framer-motion';
import { BadgeCheck, Gem, Headphones, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Card } from '@/components/ui/card';
import { useBanners, useCategories, useProducts } from '@/hooks/useCatalog';

const trustBadges = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Razorpay & COD' },
  { icon: BadgeCheck, title: 'Quality Assured', desc: 'Handpicked designs' },
  { icon: Headphones, title: '7-Day Support', desc: 'Easy returns' },
];

export default function HomePage() {
  const { data: banners, isLoading: bannersLoading } = useBanners();
  const { data: categories } = useCategories();
  const { data: featured, isLoading: fLoading } = useProducts({ featured: true, size: 8 });
  const { data: trending, isLoading: tLoading } = useProducts({ trending: true, size: 8 });
  const { data: newArrivals, isLoading: nLoading } = useProducts({ newArrival: true, size: 8 });
  const { data: bestSellers, isLoading: bLoading } = useProducts({ bestSeller: true, size: 4 });

  const promo = banners?.find((b) => b.placement === 'PROMO');

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-6">
      <HeroCarousel banners={banners} loading={bannersLoading} />

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {trustBadges.map((b) => (
          <Card key={b.title} className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <b.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Categories */}
      <section>
        <SectionHeading title="Shop by Category" subtitle="Find the perfect piece for every occasion" viewAllTo="/categories" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {categories?.slice(0, 12).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={`/shop?category=${c.slug}`} className="group flex flex-col items-center gap-2">
                <div className="aspect-square w-full overflow-hidden rounded-full border border-border bg-muted">
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="text-center text-xs font-medium sm:text-sm">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <SectionHeading title="Featured Jewellery" subtitle="Our curated picks" viewAllTo="/shop?featured=true" />
        <ProductGrid products={featured?.content} loading={fLoading} />
      </section>

      {/* Promo banner */}
      {promo && (
        <Link
          to={promo.ctaLink}
          className="relative flex min-h-[180px] items-center overflow-hidden rounded-xl border border-border"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(28,18,6,0.85), rgba(28,18,6,0.45)), url("${promo.imageUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="px-8 py-8 text-white">
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">{promo.title}</h3>
            <p className="mt-1 text-white/85">{promo.subtitle}</p>
          </div>
        </Link>
      )}

      {/* Trending */}
      <section>
        <SectionHeading title="Trending Now" subtitle="What everyone's loving" viewAllTo="/shop?trending=true" />
        <ProductGrid products={trending?.content} loading={tLoading} />
      </section>

      {/* Best sellers highlight */}
      <section className="rounded-xl bg-secondary/40 p-6">
        <SectionHeading title="Best Sellers" subtitle="Tried, tested & adored" viewAllTo="/shop?bestSeller=true" />
        <ProductGrid products={bestSellers?.content} loading={bLoading} skeletonCount={4} />
      </section>

      {/* New arrivals */}
      <section>
        <SectionHeading title="New Arrivals" subtitle="Fresh off the design table" viewAllTo="/shop?newArrival=true" />
        <ProductGrid products={newArrivals?.content} loading={nLoading} />
      </section>

      {/* Brand story */}
      <section className="grid items-center gap-8 rounded-xl border border-border bg-card p-8 md:grid-cols-2">
        <div>
          <Gem className="mb-3 h-8 w-8 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Crafted in Pune, Loved Everywhere</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Ratnika brings you thoughtfully designed jewellery that blends timeless Indian
            craftsmanship with contemporary style. Every piece is quality-checked, skin-friendly and
            delivered in premium packaging — because you deserve nothing less.
          </p>
          <div className="mt-5 flex gap-6">
            <div>
              <p className="font-display text-2xl font-semibold text-primary">10k+</p>
              <p className="text-xs text-muted-foreground">Happy customers</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-primary">500+</p>
              <p className="text-xs text-muted-foreground">Unique designs</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-primary">4.8★</p>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories?.slice(0, 4).map((c) => (
            <img
              key={c.id}
              src={c.imageUrl}
              alt={c.name}
              loading="lazy"
              className="aspect-square w-full rounded-lg border border-border object-cover"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
