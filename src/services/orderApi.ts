import { apiRequest } from './apiClient';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface OrderLinePayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderLinePayload[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  note?: string;
}

export interface OrderItemDto {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  unit_price_vnd: number;
  quantity: number;
  subtotal_vnd: number;
}

export interface OrderDto {
  id: number;
  order_code: string;
  product_id: string;
  product_name: string;
  unit_price_vnd: number;
  quantity: number;
  total_price_vnd: number;
  totalPriceLabel?: string;
  emailSent?: boolean;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  note: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItemDto[];
}

export interface OrderListResponse {
  summary: {
    totalOrders: number;
    totalRevenueVnd: number;
    pendingOrders: number;
  };
  orders: OrderDto[];
}

export async function createOrder(payload: CreateOrderPayload) {
  return apiRequest<OrderDto>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchOrders(filters?: {
  phone?: string;
  code?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.phone?.trim()) params.set('phone', filters.phone.trim());
  if (filters?.code?.trim()) params.set('code', filters.code.trim());
  if (filters?.status?.trim()) params.set('status', filters.status.trim());
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiRequest<OrderListResponse>(`/api/orders${qs}`);
  return res.data;
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  return apiRequest<OrderDto>(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
