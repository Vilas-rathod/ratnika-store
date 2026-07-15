import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProductVariant } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ReviewSection } from '@/components/product/ReviewSection';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Price } from '@/components/shared/Price';
import { Rating } from '@/components/shared/Rating';
import { PageLoader } from '@/components/shared/Spinner';
import { titleCase } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useProduct, useRelatedProducts } from '@/hooks/useCatalog';
import { useAppDispatch, useIsWishlisted } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/wishlistSlice';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug ?? '');
  const { data: related } = useRelatedProducts(product?.id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlisted = useIsWishlisted(product?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState<ProductVariant | null>(null);

  if (isLoading) return <PageLoader label="Loading product…" />;
  if (isError || !product)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button asChild className="mt-4">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );

  const effectivePrice = product.price + (variant?.priceDelta ?? 0);
  const effectiveStock = variant ? variant.stock : product.stock;
  const outOfStock = effectiveStock <= 0;
  const needsVariant = product.variants.length > 0 && !variant;

  const addItemToCart = (): boolean => {
    if (needsVariant) {
      toast.warn('Please select a size first');
      return false;
    }
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.images[0]?.url ?? '',
        price: effectivePrice,
        mrp: product.mrp,
        quantity,
        stock: effectiveStock,
        variantId: variant?.id,
        variantLabel: variant ? `${variant.name}: ${variant.value}` : undefined,
      }),
    );
    return true;
  };

  const handleAdd = () => {
    if (addItemToCart()) toast.success(`${product.name} added to cart`);
  };

  // Buy Now: add to cart and jump straight to checkout.
  const handleBuyNow = () => {
    if (addItemToCart()) navigate('/checkout');
  };

  const handleWishlist = () => {
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

  const attrs = [
    { label: 'Material', value: titleCase(product.attributes.material) },
    { label: 'Occasion', value: titleCase(product.attributes.occasion) },
    { label: 'Color', value: product.attributes.color },
    { label: 'Weight', value: `${product.attributes.weightGrams} g` },
    ...(product.attributes.stoneType ? [{ label: 'Stone', value: product.attributes.stoneType }] : []),
    { label: 'SKU', value: product.sku },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/shop?category=${product.categoryId}`} className="hover:text-foreground">
          {product.categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {product.bestSeller && <Badge variant="info">Bestseller</Badge>}
            {product.trending && <Badge variant="gold">Trending</Badge>}
            {product.newArrival && <Badge variant="success">New Arrival</Badge>}
          </div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.categoryName}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} showValue />
          </div>

          <div className="mt-4">
            <Price price={effectivePrice} mrp={product.mrp} size="lg" />
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>

          <Separator className="my-5" />

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold">
                Select {product.variants[0].name}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v)}
                    disabled={v.stock <= 0}
                    className={cn(
                      'min-w-12 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                      variant?.id === v.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:border-primary',
                    )}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + stock */}
          <div className="mb-5 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-input">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center hover:bg-accent"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
                className="flex h-10 w-10 items-center justify-center hover:bg-accent"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {outOfStock ? (
              <span className="text-sm font-medium text-destructive">Out of stock</span>
            ) : effectiveStock < 10 ? (
              <span className="text-sm font-medium text-[var(--warning)]">
                Only {effectiveStock} left!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-[var(--success)]">
                <Check className="h-4 w-4" /> In stock
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleBuyNow} disabled={outOfStock}>
                <Zap className="h-5 w-5" /> Buy Now
              </Button>
              <Button size="lg" variant="outline" onClick={handleWishlist} aria-label="Wishlist">
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-destructive text-destructive')} />
              </Button>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleAdd}
              disabled={outOfStock}
            >
              <ShoppingBag className="h-5 w-5" /> Add to Cart
            </Button>
          </div>

          {/* Assurances */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free shipping over ₹999' },
              { icon: RotateCcw, label: '7-day easy returns' },
              { icon: ShieldCheck, label: 'Secure checkout' },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 text-center">
                <a.icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] text-muted-foreground">{a.label}</span>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          {/* Attributes */}
          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Product Details</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {attrs.map((a) => (
                <div key={a.label} className="flex justify-between border-b border-border py-1.5">
                  <dt className="text-muted-foreground">{a.label}</dt>
                  <dd className="font-medium">{a.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} />

      {related && related.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="You May Also Like" />
          <ProductGrid products={related.slice(0, 4)} skeletonCount={4} />
        </section>
      )}
    </div>
  );
}
