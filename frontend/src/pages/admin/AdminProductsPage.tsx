import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Product } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatINR } from '@/lib/format';
import { useDebounce } from '@/hooks/useDebounce';
import { adminService } from '@/services/admin.service';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.listCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', debouncedSearch, page],
    queryFn: () => adminService.listProducts({ q: debouncedSearch, page, size: 10 }),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] });

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${data?.totalElements ?? 0} products in catalogue`}
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search by name or SKU…"
          className="pl-9"
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : data && data.content.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]?.url}
                        alt={p.name}
                        className="h-10 w-10 rounded border border-border object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.categoryName}</TableCell>
                  <TableCell>
                    <p className="font-medium">{formatINR(p.price)}</p>
                    {p.costPrice != null && (
                      <p className="text-xs text-muted-foreground">Cost: {formatINR(p.costPrice)}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.stock < 5 ? (
                      <Badge variant="warning">{p.stock} left</Badge>
                    ) : (
                      <span className="text-sm">{p.stock}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(p)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try a different search, or add your first product."
            action={<Button onClick={openAdd}>Add Product</Button>}
            className="border-none"
          />
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        categories={categories ?? []}
        onSaved={invalidate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete product?"
        description={`"${deleteTarget?.name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteProduct.isPending}
        onConfirm={() => deleteTarget && deleteProduct.mutate(deleteTarget.id)}
      />
    </div>
  );
}
