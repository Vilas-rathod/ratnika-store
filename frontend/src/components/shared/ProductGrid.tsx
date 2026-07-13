import type { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({ products, loading, skeletonCount = 8 }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products?.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
