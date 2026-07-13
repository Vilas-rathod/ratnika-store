import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { Banner } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { EmptyState } from '@/components/shared/EmptyState';
import { bannerImage } from '@/lib/placeholder';
import { adminService } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

interface BannerForm {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  placement: 'HERO' | 'PROMO';
  active: boolean;
}

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const { data: banners, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminService.listBanners(),
  });

  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm<BannerForm>({
    defaultValues: { placement: 'HERO', active: true },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    reset(
      editing
        ? {
            title: editing.title,
            subtitle: editing.subtitle,
            imageUrl: editing.imageUrl,
            ctaLabel: editing.ctaLabel,
            ctaLink: editing.ctaLink,
            placement: editing.placement,
            active: editing.active,
          }
        : {
            title: '',
            subtitle: '',
            imageUrl: bannerImage(Math.floor(Math.random() * 6)),
            ctaLabel: 'Shop Now',
            ctaLink: '/shop',
            placement: 'HERO',
            active: true,
          },
    );
  }, [dialogOpen, editing, reset]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-banners'] });

  const save = async (data: BannerForm) => {
    try {
      if (editing) await adminService.updateBanner(editing.id, data);
      else await adminService.createBanner(data);
      toast.success(editing ? 'Banner updated' : 'Banner created');
      setDialogOpen(false);
      invalidate();
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => {
      toast.success('Banner deleted');
      setDeleteTarget(null);
      invalidate();
    },
  });

  return (
    <div>
      <AdminPageHeader
        title="Banners"
        description="Manage homepage hero & promotional banners"
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Banner
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : banners && banners.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {banners.map((b) => (
            <Card key={b.id} className="overflow-hidden">
              <div
                className="flex h-32 items-end p-4 text-white"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(30,20,8,0.7), rgba(30,20,8,0.2)), url("${b.imageUrl}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div>
                  <p className="font-display text-lg font-semibold">{b.title}</p>
                  <p className="text-xs text-white/80">{b.subtitle}</p>
                </div>
              </div>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={b.placement === 'HERO' ? 'gold' : 'info'}>{b.placement}</Badge>
                  {b.active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Hidden</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(b);
                      setDialogOpen(true);
                    }}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(b)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={ImageIcon} title="No banners yet" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(save)} className="space-y-4">
            <FormField label="Title" required>
              <Input placeholder="The Festive Edit" {...register('title', { required: true })} />
            </FormField>
            <FormField label="Subtitle">
              <Input placeholder="Up to 40% off" {...register('subtitle')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="CTA Label">
                <Input placeholder="Shop Now" {...register('ctaLabel')} />
              </FormField>
              <FormField label="CTA Link">
                <Input placeholder="/shop" {...register('ctaLink')} />
              </FormField>
            </div>
            <FormField label="Placement">
              <Controller
                control={control}
                name="placement"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HERO">Hero (homepage slider)</SelectItem>
                      <SelectItem value="PROMO">Promotional strip</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
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
        title="Delete banner?"
        description={`"${deleteTarget?.title}" will be removed from the store.`}
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
    </div>
  );
}
