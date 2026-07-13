import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Category } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.listCategories(),
  });

  useEffect(() => {
    if (dialogOpen) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setActive(editing?.active ?? true);
    }
  }, [dialogOpen, editing]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] });

  const save = useMutation({
    mutationFn: () =>
      editing
        ? adminService.updateCategory(editing.id, { name, description, active })
        : adminService.createCategory({ name, description, active }),
    onSuccess: () => {
      toast.success(editing ? 'Category updated' : 'Category created');
      setDialogOpen(false);
      invalidate();
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err: ApiError) => {
      toast.error(err.message);
      setDeleteTarget(null);
    },
  });

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Organise your jewellery catalogue"
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex gap-4 p-4">
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="h-16 w-16 rounded-md border border-border object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{c.name}</h3>
                    {!c.active && <Badge variant="secondary">Hidden</Badge>}
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{c.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.productCount ?? 0} products</p>
                  <div className="mt-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(c);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
            className="space-y-4"
          >
            <FormField label="Name" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rings" required />
            </FormField>
            <FormField label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description…"
                rows={2}
              />
            </FormField>
            <label className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              Active (visible to customers)
              <Switch checked={active} onCheckedChange={setActive} />
            </label>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={save.isPending}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete category?"
        description={`"${deleteTarget?.name}" will be removed. Categories with products cannot be deleted.`}
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
    </div>
  );
}
