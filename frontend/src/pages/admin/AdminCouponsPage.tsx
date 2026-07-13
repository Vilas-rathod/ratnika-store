import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgePercent, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import type { Coupon } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatINR } from '@/lib/format';
import { couponSchema, type CouponForm } from '@/lib/validation';
import { adminService } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminService.listCoupons(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: { type: 'PERCENT', active: true },
  });

  const couponType = watch('type');

  useEffect(() => {
    if (!dialogOpen) return;
    reset(
      editing
        ? {
            code: editing.code,
            description: editing.description,
            type: editing.type,
            value: editing.value,
            minOrderAmount: editing.minOrderAmount,
            maxDiscount: editing.maxDiscount ?? 0,
            expiresAt: editing.expiresAt.slice(0, 10),
            usageLimit: editing.usageLimit,
            active: editing.active,
          }
        : {
            code: '',
            description: '',
            type: 'PERCENT',
            value: 10,
            minOrderAmount: 499,
            maxDiscount: 0,
            expiresAt: '',
            usageLimit: 1000,
            active: true,
          },
    );
  }, [dialogOpen, editing, reset]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });

  const save = async (data: CouponForm) => {
    const payload = {
      ...data,
      expiresAt: new Date(data.expiresAt).toISOString(),
      maxDiscount: data.type === 'PERCENT' ? data.maxDiscount : undefined,
    };
    try {
      if (editing) await adminService.updateCoupon(editing.id, payload);
      else await adminService.createCoupon(payload);
      toast.success(editing ? 'Coupon updated' : 'Coupon created');
      setDialogOpen(false);
      invalidate();
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    onSuccess: () => {
      toast.success('Coupon deleted');
      setDeleteTarget(null);
      invalidate();
    },
  });

  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        description="Create and manage discount codes"
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Coupon
          </Button>
        }
      />

      <Card>
        {isLoading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        ) : coupons && coupons.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => {
                const expired = new Date(c.expiresAt) < new Date();
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-mono font-semibold">{c.code}</p>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                    </TableCell>
                    <TableCell>
                      {c.type === 'PERCENT' ? `${c.value}%` : formatINR(c.value)}
                      {c.maxDiscount ? (
                        <span className="text-xs text-muted-foreground"> (max {formatINR(c.maxDiscount)})</span>
                      ) : null}
                    </TableCell>
                    <TableCell>{formatINR(c.minOrderAmount)}</TableCell>
                    <TableCell>
                      {c.usedCount}/{c.usageLimit}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(c.expiresAt)}
                    </TableCell>
                    <TableCell>
                      {expired ? (
                        <Badge variant="secondary">Expired</Badge>
                      ) : c.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(c);
                            setDialogOpen(true);
                          }}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(c)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState icon={BadgePercent} title="No coupons yet" className="border-none" />
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(save)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Code" error={errors.code?.message} required>
                <Input placeholder="WELCOME15" className="uppercase" {...register('code')} />
              </FormField>
              <FormField label="Type" required>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                        <SelectItem value="FLAT">Flat (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <FormField label="Description" error={errors.description?.message} required>
              <Input placeholder="15% off your first order" {...register('description')} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label={couponType === 'PERCENT' ? 'Discount (%)' : 'Discount (₹)'}
                error={errors.value?.message}
                required
              >
                <Input type="number" {...register('value')} />
              </FormField>
              {couponType === 'PERCENT' && (
                <FormField label="Max Discount (₹)" error={errors.maxDiscount?.message}>
                  <Input type="number" {...register('maxDiscount')} />
                </FormField>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Min Order (₹)" error={errors.minOrderAmount?.message}>
                <Input type="number" {...register('minOrderAmount')} />
              </FormField>
              <FormField label="Usage Limit" error={errors.usageLimit?.message} required>
                <Input type="number" {...register('usageLimit')} />
              </FormField>
              <FormField label="Expires On" error={errors.expiresAt?.message} required>
                <Input type="date" {...register('expiresAt')} />
              </FormField>
            </div>

            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <label className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  Active
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete coupon?"
        description={`Coupon "${deleteTarget?.code}" will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
    </div>
  );
}
