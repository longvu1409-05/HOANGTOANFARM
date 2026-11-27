/** Trạng thái xử lý của đơn hàng */
export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

/** Trạng thái xử lý tin nhắn liên hệ */
export type ContactStatus = 'new' | 'replied';

export interface ProductRecord {
  id: string;
  node_id: string;
  name: string;
  category: string;
  description: string;
  spec_1: string;
  spec_2: string;
  unit: string;
  price_vnd: number;
  price_label: string;
  image_file: string;
  crop_json: string | null;
  stock: number;
  is_featured: number;
  is_active: number;
  created_at: string;
}

export interface CreateProductInput {
  id?: string;
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

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  promoCode?: string;
  address?: string;
  note?: string;
}

export interface OrderItemRecord {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  unit_price_vnd: number;
  quantity: number;
  subtotal_vnd: number;
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
  customer_email: string;
  address: string;
  note: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
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

export interface ContactRecord {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}
