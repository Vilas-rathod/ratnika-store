import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ban, CheckCircle2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { avatarImage } from '@/lib/placeholder';
import { formatDate, formatINR } from '@/lib/format';
import { adminService } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminService.listCustomers(),
  });

  const toggleBlock = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      adminService.setCustomerBlocked(id, blocked),
    onSuccess: (_, vars) => {
      toast.success(vars.blocked ? 'Customer blocked' : 'Customer activated');
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  return (
    <div>
      <AdminPageHeader title="Customers" description={`${customers?.length ?? 0} registered customers`} />

      <Card>
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : customers && customers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={avatarImage(`${c.firstName} ${c.lastName}`)} />
                        <AvatarFallback>{c.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell>{c.orderCount}</TableCell>
                  <TableCell className="font-medium">{formatINR(c.totalSpent)}</TableCell>
                  <TableCell>
                    {c.blocked ? (
                      <Badge variant="destructive">Blocked</Badge>
                    ) : c.emailVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="warning">Unverified</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {c.blocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBlock.mutate({ id: c.id, blocked: false })}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Activate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => toggleBlock.mutate({ id: c.id, blocked: true })}
                      >
                        <Ban className="h-3.5 w-3.5" /> Block
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState icon={Users} title="No customers yet" className="border-none" />
        )}
      </Card>
    </div>
  );
}
