import type { Banner, Category, Page, Product, ProductFilters, Review } from '@/types';
import { http } from './http';

function filtersToParams(f: ProductFilters): Record<string, unknown> {
  return {
    q: f.q,
    category: f.category,
    material: f.materials,
    occasion: f.occasions,
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    sort: f.sort,
    featured: f.featured,
    trending: f.trending,
    bestSeller: f.bestSeller,
    newArrival: f.newArrival,
    page: f.page,
    size: f.size,
  };
}

export const catalogService = {
  listProducts(filters: ProductFilters = {}) {
    return http.get<Page<Product>>('/products', filtersToParams(filters));
  },

  getProductBySlug(slug: string) {
    return http.get<Product>(`/products/slug/${slug}`);
  },

  getProductById(id: string) {
    return http.get<Product>(`/products/${id}`);
  },

  getRelated(id: string) {
    return http.get<Product[]>(`/products/${id}/related`);
  },

  listCategories() {
    return http.get<Category[]>('/categories');
  },

  listBanners() {
    return http.get<Banner[]>('/banners');
  },

  getReviews(productId: string) {
    return http.get<Review[]>(`/products/${productId}/reviews`);
  },

  addReview(productId: string, payload: { rating: number; title: string; comment: string }) {
    return http.post<Review>(`/products/${productId}/reviews`, payload);
  },

  updateReview(reviewId: string, payload: { rating: number; title: string; comment: string }) {
    return http.put<Review>(`/reviews/${reviewId}`, payload);
  },

  deleteReview(reviewId: string) {
    return http.delete<{ ok: boolean }>(`/reviews/${reviewId}`);
  },

  myReviews() {
    return http.get<Review[]>('/reviews/mine');
  },
};
