import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Rating, RatingInput } from '@/components/shared/Rating';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/format';
import { catalogService } from '@/services/catalog.service';
import { catalogKeys, useReviews } from '@/hooks/useCatalog';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/services/http';

export function ReviewSection({ productId }: { productId: string }) {
  const { data: reviews, isLoading } = useReviews(productId);
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const addReview = useMutation({
    mutationFn: () => catalogService.addReview(productId, { rating, title, comment }),
    onSuccess: () => {
      toast.success('Review submitted! It will appear once approved.');
      setOpen(false);
      setTitle('');
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: catalogKeys.reviews(productId) });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => catalogService.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: catalogKeys.reviews(productId) });
    },
  });

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Customer Reviews</h2>
        {isAuthenticated && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquarePlus className="h-4 w-4" /> Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addReview.mutate();
                }}
                className="space-y-4"
              >
                <FormField label="Your Rating" required>
                  <RatingInput value={rating} onChange={setRating} />
                </FormField>
                <FormField label="Title" required>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarise your experience"
                    required
                  />
                </FormField>
                <FormField label="Your Review" required>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    rows={4}
                    required
                  />
                </FormField>
                <Button type="submit" className="w-full" loading={addReview.isPending}>
                  Submit Review
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews && reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r: Review) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.userName}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                    </div>
                    <Rating value={r.rating} className="mt-1" />
                  </div>
                  {user?.id === r.userId && (
                    <button
                      onClick={() => deleteReview.mutate(r.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h4 className="mt-3 font-semibold">{r.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquarePlus}
          title="No reviews yet"
          description="Be the first to share your thoughts on this piece."
        />
      )}
    </section>
  );
}
