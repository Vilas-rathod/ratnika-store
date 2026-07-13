import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Price } from '@/components/shared/Price';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { removeFromWishlist } from '@/store/wishlistSlice';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold">My Wishlist</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save your favourite pieces here and never lose track of them."
          action={
            <Button asChild>
              <Link to="/shop">Explore Jewellery</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.productId} className="flex gap-4 p-3">
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-24 w-24 rounded-md border border-border object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to={`/product/${item.slug}`} className="font-medium hover:text-primary line-clamp-2">
                  {item.name}
                </Link>
                <Price price={item.price} mrp={item.mrp} size="sm" className="mt-1" />
                <div className="mt-auto flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      dispatch(
                        addToCart({
                          productId: item.productId,
                          name: item.name,
                          slug: item.slug,
                          imageUrl: item.imageUrl,
                          price: item.price,
                          mrp: item.mrp,
                          quantity: 1,
                          stock: 99,
                        }),
                      );
                      toast.success('Added to cart');
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      dispatch(removeFromWishlist(item.productId));
                      toast.info('Removed from wishlist');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
