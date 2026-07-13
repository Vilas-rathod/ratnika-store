import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ProductFilters } from '@/types';
import { catalogService } from '@/services/catalog.service';

export const catalogKeys = {
  products: (filters: ProductFilters) => ['products', filters] as const,
  product: (slug: string) => ['product', slug] as const,
  related: (id: string) => ['related', id] as const,
  categories: ['categories'] as const,
  banners: ['banners'] as const,
  reviews: (id: string) => ['reviews', id] as const,
};

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: catalogKeys.products(filters),
    queryFn: () => catalogService.listProducts(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: catalogKeys.product(slug),
    queryFn: () => catalogService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useRelatedProducts(id: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.related(id ?? ''),
    queryFn: () => catalogService.getRelated(id!),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: catalogKeys.categories,
    queryFn: () => catalogService.listCategories(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBanners() {
  return useQuery({
    queryKey: catalogKeys.banners,
    queryFn: () => catalogService.listBanners(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReviews(productId: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.reviews(productId ?? ''),
    queryFn: () => catalogService.getReviews(productId!),
    enabled: !!productId,
  });
}
