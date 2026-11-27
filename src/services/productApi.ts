import { ProductItem } from '../types/farm.types';
import { apiRequest } from './apiClient';

/**
 * Gọi API lấy danh sách hoặc tìm kiếm sản phẩm
 */
export async function fetchProducts(query?: string): Promise<ProductItem[]> {
  const qs = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
  const res = await apiRequest<ProductItem[]>(`/api/products${qs}`);
  return res.data;
}
