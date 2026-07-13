import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import type { Material, Occasion, ProductFilters, ProductSort } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { MATERIALS, OCCASIONS, SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCategories, useProducts } from '@/hooks/useCatalog';

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();
  const [mobileFilters, setMobileFilters] = useState(false);

  const filters: ProductFilters = useMemo(
    () => ({
      q: params.get('q') ?? undefined,
      category: params.get('category') ?? undefined,
      materials: params.getAll('material') as Material[],
      occasions: params.getAll('occasion') as Occasion[],
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      sort: (params.get('sort') as ProductSort) ?? 'newest',
      featured: params.get('featured') === 'true' || undefined,
      trending: params.get('trending') === 'true' || undefined,
      bestSeller: params.get('bestSeller') === 'true' || undefined,
      newArrival: params.get('newArrival') === 'true' || undefined,
      page: params.get('page') ? Number(params.get('page')) : 0,
      size: 12,
    }),
    [params],
  );

  const { data, isLoading, isFetching } = useProducts(filters);

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutate(next);
    next.delete('page'); // reset to first page on filter change
    setParams(next);
  };

  const toggleMulti = (key: 'material' | 'occasion', value: string) => {
    update((p) => {
      const current = p.getAll(key);
      p.delete(key);
      if (current.includes(value)) current.filter((v) => v !== value).forEach((v) => p.append(key, v));
      else [...current, value].forEach((v) => p.append(key, v));
    });
  };

  const setSort = (sort: string) => update((p) => p.set('sort', sort));
  const setCategory = (slug: string) =>
    update((p) => (slug ? p.set('category', slug) : p.delete('category')));
  const setPage = (page: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(page));
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  const activeCount =
    filters.materials!.length +
    filters.occasions!.length +
    (filters.category ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0);

  const currentCategory = categories?.find((c) => c.slug === filters.category);

  const FilterPanel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setCategory('')}
            className={cn(
              'block w-full rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent',
              !filters.category && 'bg-accent font-medium',
            )}
          >
            All Categories
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={cn(
                'flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                filters.category === c.slug && 'bg-accent font-medium',
              )}
            >
              {c.name}
              <span className="text-xs text-muted-foreground">{c.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Material</h3>
        <div className="space-y-2">
          {MATERIALS.map((m) => (
            <label key={m.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={filters.materials!.includes(m.value)}
                onCheckedChange={() => toggleMulti('material', m.value)}
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Occasion</h3>
        <div className="space-y-2">
          {OCCASIONS.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={filters.occasions!.includes(o.value)}
                onCheckedChange={() => toggleMulti('occasion', o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Price Range (₹)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={filters.minPrice ?? ''}
            onBlur={(e) => update((p) => (e.target.value ? p.set('minPrice', e.target.value) : p.delete('minPrice')))}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={filters.maxPrice ?? ''}
            onBlur={(e) => update((p) => (e.target.value ? p.set('maxPrice', e.target.value) : p.delete('maxPrice')))}
          />
        </div>
      </div>

      {activeCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAll}>
          <X className="h-4 w-4" /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">
          {currentCategory ? currentCategory.name : filters.q ? `Results for "${filters.q}"` : 'All Jewellery'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {data ? `${data.totalElements} products found` : 'Loading products…'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-4">{FilterPanel}</div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilters(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Label className="hidden text-sm text-muted-foreground sm:inline">Sort by</Label>
              <Select value={filters.sort} onValueChange={setSort}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className={cn(isFetching && 'opacity-60 transition-opacity')}>
            {!isLoading && data?.content.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No products found"
                description="Try adjusting your filters or search for something else."
                action={<Button onClick={clearAll}>Clear filters</Button>}
              />
            ) : (
              <ProductGrid products={data?.content} loading={isLoading} skeletonCount={12} />
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] overflow-y-auto bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFilters(false)} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            {FilterPanel}
            <Button className="mt-6 w-full" onClick={() => setMobileFilters(false)}>
              Show {data?.totalElements ?? 0} results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
