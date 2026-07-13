import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/useCatalog';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Shop by Category</h1>
        <p className="mt-2 text-muted-foreground">
          Explore our full range of handcrafted jewellery collections.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 11 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
            ))
          : categories?.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/shop?category=${c.slug}`}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="relative p-4 text-white">
                    <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                    <p className="text-xs text-white/80">{c.productCount ?? 0} products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
