/** Trạng thái xử lý của đơn hàng */
export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface ProductRecord {
  id: string;
  node_id: string;
  name: string;
  spec_1: string;
  spec_2: string;
  unit: string;
  price_vnd: number;
  price_label: string;
  image_file: string;
  crop_json: string | null;
  stock: number;
  is_featured: number;
  created_at: string;
}

export interface OrderRecord {
  id: number;
  order_code: string;
  product_id: string;
  product_name: string;
  unit_price_vnd: number;
  quantity: number;
  total_price_vnd: number;
  customer_name: string;
  customer_phone: string;
  note: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  productId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  note?: string;
}

export interface SubscriberRecord {
  id: number;
  email: string;
  created_at: string;
}

export interface ReviewRecord {
  id: number;
  author: string;
  quote: string;
  rating: number;
  avatar_file: string;
  created_at: string;
}

export interface KnowledgeArticleRecord {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_file: string;
  is_featured: number;
  created_at: string;
}
