import { ProductItem } from '../types/farm.types';
import { apiRequest } from './apiClient';

export interface ProductPayload {
  name: string;
  category: string;
  description: string;
  spec1: string;
  spec2: string;
  unit: string;
  priceVnd: number;
  imageFile: string;
  stock: number;
  isFeatured: boolean;
}

export async function fetchProducts(filters?: {
  q?: string;
  category?: string;
  featuredOnly?: boolean;
}): Promise<ProductItem[]> {
  const params = new URLSearchParams();
  if (filters?.q?.trim()) params.set('q', filters.q.trim());
  if (filters?.category && filters.category !== 'Tất cả') {
    params.set('category', filters.category);
  }
  if (filters?.featuredOnly) params.set('featured', '1');

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiRequest<ProductItem[]>(`/api/products${qs}`);
  return res.data;
}

export async function createProduct(payload: ProductPayload) {
  return apiRequest<ProductItem>('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: string, payload: ProductPayload) {
  return apiRequest<ProductItem>(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string) {
  return apiRequest<{ id: string; deleted: boolean; softDeleted: boolean }>(
    `/api/products/${encodeURIComponent(id)}`,
    { method: 'DELETE' }
  );
}
