import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { Category, Product } from '@/types';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MATERIALS, OCCASIONS } from '@/lib/constants';
import { jewelleryImage } from '@/lib/placeholder';
import { productSchema, type ProductForm } from '@/lib/validation';
import { adminService, type ProductInput } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Product | null;
  categories: Category[];
  onSaved: () => void;
}

const flags = [
  { key: 'featured', label: 'Featured' },
  { key: 'trending', label: 'Trending' },
  { key: 'bestSeller', label: 'Best Seller' },
  { key: 'newArrival', label: 'New Arrival' },
  { key: 'active', label: 'Active' },
] as const;

export function ProductFormDialog({
  open,
  onOpenChange,
  editing,
  categories,
  onSaved,
}: ProductFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      trending: false,
      bestSeller: false,
      newArrival: true,
      active: true,
      material: 'GOLD_PLATED',
      occasion: 'FESTIVE',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        name: editing.name,
        description: editing.description,
        categoryId: editing.categoryId,
        price: editing.price,
        mrp: editing.mrp,
        stock: editing.stock,
        material: editing.attributes.material,
        occasion: editing.attributes.occasion,
        color: editing.attributes.color,
        weightGrams: editing.attributes.weightGrams,
        stoneType: editing.attributes.stoneType ?? '',
        supplierName: editing.supplierName ?? '',
        supplierUrl: editing.supplierUrl ?? '',
        costPrice: editing.costPrice ?? 0,
        featured: editing.featured,
        trending: editing.trending,
        bestSeller: editing.bestSeller,
        newArrival: editing.newArrival,
        active: editing.active,
      });
    } else {
      reset({
        name: '',
        description: '',
        categoryId: categories[0]?.id ?? '',
        price: 0,
        mrp: 0,
        stock: 0,
        material: 'GOLD_PLATED',
        occasion: 'FESTIVE',
        color: '',
        weightGrams: 0,
        stoneType: '',
        supplierName: '',
        supplierUrl: '',
        costPrice: 0,
        featured: false,
        trending: false,
        bestSeller: false,
        newArrival: true,
        active: true,
      });
    }
  }, [open, editing, categories, reset]);

  const onSubmit = async (data: ProductForm) => {
    const category = categories.find((c) => c.id === data.categoryId);
    const motifMap: Record<string, string> = {
      Rings: 'ring',
      Earrings: 'earring',
      Necklaces: 'necklace',
      Chains: 'chain',
      Pendants: 'pendant',
      Bangles: 'bangle',
      Bracelets: 'bracelet',
      Anklets: 'anklet',
      Mangalsutra: 'mangalsutra',
      'Nose Pins': 'nosepin',
      'Jewellery Sets': 'set',
    };
    const motif = motifMap[category?.name ?? ''] ?? 'ring';
    const seed = Math.floor(Math.random() * 6);

    const payload: ProductInput = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      mrp: data.mrp,
      stock: data.stock,
      images: editing
        ? editing.images.map((i) => i.url)
        : [0, 1, 2].map((k) => jewelleryImage(motif, seed + k, k === 0 ? category?.name : '')),
      variants: editing?.variants ?? [],
      attributes: {
        material: data.material,
        occasion: data.occasion,
        color: data.color,
        weightGrams: data.weightGrams,
        stoneType: data.stoneType || undefined,
      },
      featured: data.featured,
      trending: data.trending,
      bestSeller: data.bestSeller,
      newArrival: data.newArrival,
      active: data.active,
      supplierName: data.supplierName || undefined,
      supplierUrl: data.supplierUrl || undefined,
      costPrice: data.costPrice,
    };

    try {
      if (editing) await adminService.updateProduct(editing.id, payload);
      else await adminService.createProduct(payload);
      toast.success(editing ? 'Product updated' : 'Product created');
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Product Name" error={errors.name?.message} required>
            <Input placeholder="Elegant Blossom Ring" {...register('name')} />
          </FormField>

          <FormField label="Description" error={errors.description?.message} required>
            <Textarea rows={3} placeholder="Describe the product…" {...register('description')} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Category" error={errors.categoryId?.message} required>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Stock" error={errors.stock?.message} required>
              <Input type="number" {...register('stock')} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Selling Price (₹)" error={errors.price?.message} required>
              <Input type="number" {...register('price')} />
            </FormField>
            <FormField label="MRP (₹)" error={errors.mrp?.message} required>
              <Input type="number" {...register('mrp')} />
            </FormField>
            <FormField label="Cost Price (₹)" error={errors.costPrice?.message} hint="Supplier cost">
              <Input type="number" {...register('costPrice')} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Material" error={errors.material?.message} required>
              <Controller
                control={control}
                name="material"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIALS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Occasion" error={errors.occasion?.message} required>
              <Controller
                control={control}
                name="occasion"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OCCASIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Color" error={errors.color?.message} required>
              <Input placeholder="Gold" {...register('color')} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Weight (grams)" error={errors.weightGrams?.message}>
              <Input type="number" step="0.1" {...register('weightGrams')} />
            </FormField>
            <FormField label="Stone Type" error={errors.stoneType?.message}>
              <Input placeholder="American Diamond (optional)" {...register('stoneType')} />
            </FormField>
          </div>

          {/* Dropshipping */}
          <div className="rounded-lg border border-dashed border-border p-4">
            <p className="mb-3 text-sm font-semibold">Dropshipping / Supplier Info</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Supplier Name" error={errors.supplierName?.message}>
                <Input placeholder="Jaipur Gems Wholesale" {...register('supplierName')} />
              </FormField>
              <FormField label="Supplier URL" error={errors.supplierUrl?.message}>
                <Input placeholder="https://…" {...register('supplierUrl')} />
              </FormField>
            </div>
          </div>

          {/* Flags */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {flags.map((f) => (
              <Controller
                key={f.key}
                control={control}
                name={f.key}
                render={({ field }) => (
                  <label className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    {f.label}
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </label>
                )}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editing ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
