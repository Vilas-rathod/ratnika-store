import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Price } from './Price';
import { Rating } from './Rating';
import { cn } from '@/lib/utils';
import { discountPercent } from '@/lib/format';
import { useAppDispatch, useIsWishlisted } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/wishlistSlice';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wishlisted = useIsWishlisted(product.id);
  const off = discountPercent(product.mrp, product.price);
  const outOfStock = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.images[0]?.url ?? '',
        price: product.price,
        mrp: product.mrp,
        quantity: 1,
        stock: product.stock,
      }),
    );
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      toggleWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.images[0]?.url ?? '',
        price: product.price,
        mrp: product.mrp,
      }),
    );
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="group relative"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.altText ?? product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {off > 0 && <Badge variant="success">{off}% OFF</Badge>}
            {product.newArrival && <Badge variant="gold">New</Badge>}
            {product.bestSeller && <Badge variant="info">Bestseller</Badge>}
          </div>
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                wishlisted ? 'fill-destructive text-destructive' : 'text-foreground',
              )}
            />
          </button>
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="space-y-2 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {product.categoryName}
          </p>
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug">{product.name}</h3>
          <Rating value={product.rating} count={product.reviewCount} />
          <Price price={product.price} mrp={product.mrp} size="sm" />
          <Button
            onClick={handleAdd}
            disabled={outOfStock}
            size="sm"
            className="w-full opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
