import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/shared/Rating';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/format';
import { catalogService } from '@/services/catalog.service';

export default function MyReviewsPage() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => catalogService.myReviews(),
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => catalogService.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">My Reviews</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/product/${r.productId}`} className="font-medium hover:text-primary">
                      {r.productName}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <Rating value={r.rating} />
                      <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                      {r.approved ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReview.mutate(r.id)}
                    aria-label="Delete review"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <h4 className="mt-3 font-semibold">{r.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Reviews you write on products will appear here."
          action={
            <Button asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
