import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, MessageSquareText, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/shared/Rating';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/format';
import { adminService } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => adminService.listReviews(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });

  const approve = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      adminService.approveReview(id, approved),
    onSuccess: (_, vars) => {
      toast.success(vars.approved ? 'Review approved' : 'Review unpublished');
      invalidate();
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted');
      invalidate();
    },
  });

  const pending = reviews?.filter((r) => !r.approved).length ?? 0;

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description={`${reviews?.length ?? 0} reviews · ${pending} awaiting approval`}
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.userName}</span>
                      <span className="text-xs text-muted-foreground">on</span>
                      <span className="text-sm font-medium text-primary">{r.productName}</span>
                    </div>
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
                  <div className="flex gap-1">
                    {r.approved ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approve.mutate({ id: r.id, approved: false })}
                      >
                        <X className="h-3.5 w-3.5" /> Unpublish
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => approve.mutate({ id: r.id, approved: true })}>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove.mutate(r.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <h4 className="mt-3 font-semibold">{r.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={MessageSquareText} title="No reviews yet" />
      )}
    </div>
  );
}
