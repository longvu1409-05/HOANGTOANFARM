import { resolveAssetUrl } from '../constants/assets/assetPath';
import { DEFAULT_KNOWLEDGE_DTOS } from '../data/knowledgeData';
import { PRODUCTS } from '../data/productsData';
import { DEFAULT_REVIEW_DTOS } from '../data/trustData';
import { ProductItem } from '../types/farm.types';
import type { ContactDto, ContactStatus, CreateContactPayload } from './contactApi';
import type { KnowledgeArticleDto, ReviewDto } from './contentApi';
import type { SubscriberDto } from './newsletterApi';
import type {
  CreateOrderPayload,
  OrderDto,
  OrderListResponse,
  OrderStatus,
} from './orderApi';
import type { ProductPayload } from './productApi';

const STORAGE_KEY = 'htf_local_store_v1';

interface LocalStoreSchema {
  products: ProductItem[];
  orders: OrderDto[];
  contacts: ContactDto[];
  subscribers: SubscriberDto[];
  reviews: ReviewDto[];
  knowledge: KnowledgeArticleDto[];
}

function nowText(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

function slugify(text: string): string {
  const base = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base || 'muc'}-${Date.now().toString(36).slice(-4)}`;
}

function validatePhoneText(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed || !/^[0-9+\s().-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function readStore(): LocalStoreSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalStoreSchema>;
      return {
        products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : [...PRODUCTS],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
        subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
        reviews: Array.isArray(parsed.reviews) && parsed.reviews.length > 0 ? parsed.reviews : [...DEFAULT_REVIEW_DTOS],
        knowledge:
          Array.isArray(parsed.knowledge) && parsed.knowledge.length > 0
            ? parsed.knowledge
            : [...DEFAULT_KNOWLEDGE_DTOS],
      };
    }
  } catch {
    // Khởi tạo mặc định nếu localStorage bị khóa
  }

  return {
    products: [...PRODUCTS],
    orders: [],
    contacts: [],
    subscribers: [],
    reviews: [...DEFAULT_REVIEW_DTOS],
    knowledge: [...DEFAULT_KNOWLEDGE_DTOS],
  };
}

function writeStore(store: LocalStoreSchema): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Bỏ qua nếu bộ nhớ trình duyệt đầy
  }
}

/**
 * Kho dự phòng & đồng bộ trên trình duyệt:
 * - Đảm bảo web tĩnh (GitHub Pages / mất mạng) vẫn đặt hàng, tra cứu, quản trị đầy đủ 100%
 * - Lưu bản sao đơn hàng đã đặt trên Serverless để không mất lịch sử sau cold start
 */
export const localFallbackStore = {
  listProducts(filters?: { q?: string; category?: string; featuredOnly?: boolean }): ProductItem[] {
    const store = readStore();
    const q = filters?.q?.trim().toLowerCase();
    return store.products.filter((p) => {
      if (filters?.featuredOnly && !p.isFeatured) return false;
      if (filters?.category && filters.category !== 'Tất cả' && p.category !== filters.category) {
        return false;
      }
      if (q) {
        const hay = `${p.name} ${p.description ?? ''} ${p.spec1} ${p.spec2} ${p.unit}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  },

  createProduct(payload: ProductPayload): ProductItem {
    if (payload.name.trim().length < 3) throw new Error('Tên sản phẩm phải có ít nhất 3 ký tự.');
    const store = readStore();
    const id = slugify(payload.name);
    const created: ProductItem = {
      id,
      nodeId: `custom:${id}`,
      name: payload.name.trim(),
      category: payload.category || 'Trái cây tươi',
      description: payload.description.trim(),
      spec1: payload.spec1.trim(),
      spec2: payload.spec2.trim(),
      unit: payload.unit.trim(),
      priceVnd: Math.round(payload.priceVnd),
      price: formatVnd(Math.round(payload.priceVnd)),
      imageFile: payload.imageFile || 'imgRectangle16.png',
      image: resolveAssetUrl(payload.imageFile || 'imgRectangle16.png'),
      stock: payload.stock,
      isFeatured: payload.isFeatured,
    };
    store.products.push(created);
    writeStore(store);
    return created;
  },

  updateProduct(id: string, payload: ProductPayload): ProductItem {
    const store = readStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Không tìm thấy sản phẩm cần cập nhật.');
    const updated: ProductItem = {
      ...store.products[idx],
      name: payload.name.trim(),
      category: payload.category || 'Trái cây tươi',
      description: payload.description.trim(),
      spec1: payload.spec1.trim(),
      spec2: payload.spec2.trim(),
      unit: payload.unit.trim(),
      priceVnd: Math.round(payload.priceVnd),
      price: formatVnd(Math.round(payload.priceVnd)),
      imageFile: payload.imageFile || store.products[idx].imageFile,
      image: resolveAssetUrl(payload.imageFile || store.products[idx].imageFile),
      stock: payload.stock,
      isFeatured: payload.isFeatured,
    };
    store.products[idx] = updated;
    writeStore(store);
    return updated;
  },

  deleteProduct(id: string) {
    const store = readStore();
    store.products = store.products.filter((p) => p.id !== id);
    writeStore(store);
    return { id, deleted: true, softDeleted: false };
  },

  mirrorOrder(order: OrderDto): void {
    const store = readStore();
    const idx = store.orders.findIndex((o) => o.order_code === order.order_code);
    if (idx >= 0) {
      store.orders[idx] = order;
    } else {
      store.orders.unshift(order);
    }
    writeStore(store);
  },

  mergeServerOrders(
    serverRes: OrderListResponse,
    filters?: { phone?: string; code?: string; status?: string }
  ): OrderListResponse {
    const store = readStore();
    const byCode = new Map<string, OrderDto>();
    for (const o of serverRes.orders) byCode.set(o.order_code, o);
    for (const localOrder of store.orders) {
      if (!byCode.has(localOrder.order_code)) {
        const matchPhone =
          !filters?.phone?.trim() || localOrder.customer_phone.includes(filters.phone.trim());
        const matchCode =
          !filters?.code?.trim() ||
          localOrder.order_code.toUpperCase() === filters.code.trim().toUpperCase();
        const matchStatus = !filters?.status?.trim() || localOrder.status === filters.status.trim();
        if (matchPhone && matchCode && matchStatus) {
          byCode.set(localOrder.order_code, localOrder);
        }
      }
    }
    const merged = Array.from(byCode.values());
    return {
      orders: merged,
      summary: {
        totalOrders: Math.max(serverRes.summary.totalOrders, merged.length),
        totalRevenueVnd: Math.max(
          serverRes.summary.totalRevenueVnd,
          merged
            .filter((o) => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total_price_vnd, 0)
        ),
        pendingOrders: Math.max(
          serverRes.summary.pendingOrders,
          merged.filter((o) => o.status === 'pending').length
        ),
      },
    };
  },

  createOrder(payload: CreateOrderPayload): OrderDto {
    const name = payload.customerName.trim();
    const phone = payload.customerPhone.trim();
    if (name.length < 2) throw new Error('Họ và tên cần tối thiểu 2 ký tự.');
    if (!validatePhoneText(phone)) {
      throw new Error('Số điện thoại cần từ 7–15 chữ số (ví dụ: 0989604818).');
    }
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Giỏ hàng trống, vui lòng chọn ít nhất 1 sản phẩm.');
    }

    const store = readStore();
    const orderId = Date.now();
    let totalVnd = 0;
    let totalQty = 0;

    const items = payload.items.map((line, idx) => {
      const prod = store.products.find((p) => p.id === line.productId) ?? store.products[0];
      const unitPrice = prod.priceVnd ?? 0;
      const subtotal = unitPrice * line.quantity;
      totalVnd += subtotal;
      totalQty += line.quantity;
      if (typeof prod.stock === 'number' && prod.stock >= line.quantity) {
        prod.stock -= line.quantity;
      }
      return {
        id: orderId + idx + 1,
        order_id: orderId,
        product_id: prod.id,
        product_name: prod.name,
        unit_price_vnd: unitPrice,
        quantity: line.quantity,
        subtotal_vnd: subtotal,
      };
    });

    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const orderCode = `HTF-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = nowText();
    const first = items[0];

    const order: OrderDto = {
      id: orderId,
      order_code: orderCode,
      product_id: first.product_id,
      product_name:
        items.length === 1
          ? first.product_name
          : `${first.product_name} (+${items.length - 1} sản phẩm khác)`,
      unit_price_vnd: first.unit_price_vnd,
      quantity: totalQty,
      total_price_vnd: totalVnd,
      totalPriceLabel: formatVnd(totalVnd),
      customer_name: name,
      customer_phone: phone.replace(/[\s().-]/g, ''),
      address: (payload.address ?? '').trim(),
      note: (payload.note ?? '').trim(),
      status: 'pending',
      created_at: now,
      updated_at: now,
      items,
    };

    store.orders.unshift(order);
    writeStore(store);
    return order;
  },

  listOrders(filters?: { phone?: string; code?: string; status?: string }): OrderListResponse {
    const store = readStore();
    const phone = filters?.phone?.trim();
    const code = filters?.code?.trim().toUpperCase();
    const status = filters?.status?.trim();

    const filtered = store.orders.filter((o) => {
      if (phone && !o.customer_phone.includes(phone)) return false;
      if (code && o.order_code.toUpperCase() !== code) return false;
      if (status && o.status !== status) return false;
      return true;
    });

    return {
      orders: filtered,
      summary: {
        totalOrders: store.orders.length,
        totalRevenueVnd: store.orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((s, o) => s + o.total_price_vnd, 0),
        pendingOrders: store.orders.filter((o) => o.status === 'pending').length,
      },
    };
  },

  updateOrderStatus(orderId: number, status: OrderStatus): OrderDto {
    const store = readStore();
    const target = store.orders.find((o) => o.id === orderId);
    if (!target) throw new Error('Không tìm thấy đơn hàng.');
    target.status = status;
    target.updated_at = nowText();
    writeStore(store);
    return target;
  },

  subscribeNewsletter(email: string): { subscriber: SubscriberDto; alreadySubscribed: boolean } {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      throw new Error('Địa chỉ email không hợp lệ.');
    }
    const store = readStore();
    const existing = store.subscribers.find((s) => s.email === clean);
    if (existing) return { subscriber: existing, alreadySubscribed: true };

    const created: SubscriberDto = { id: Date.now(), email: clean, created_at: nowText() };
    store.subscribers.unshift(created);
    writeStore(store);
    return { subscriber: created, alreadySubscribed: false };
  },

  listSubscribers(): SubscriberDto[] {
    return readStore().subscribers;
  },

  submitContact(payload: CreateContactPayload): ContactDto {
    if (payload.fullName.trim().length < 2) {
      throw new Error('Vui lòng nhập họ và tên tối thiểu 2 ký tự.');
    }
    if (!validatePhoneText(payload.phone)) {
      throw new Error('Số điện thoại cần từ 7–15 chữ số.');
    }
    if (payload.message.trim().length < 5) {
      throw new Error('Nội dung cần tư vấn phải có ít nhất 5 ký tự.');
    }
    const store = readStore();
    const created: ContactDto = {
      id: Date.now(),
      full_name: payload.fullName.trim(),
      phone: payload.phone.trim(),
      email: (payload.email ?? '').trim(),
      subject: payload.subject ?? 'Tư vấn đặt hàng',
      message: payload.message.trim(),
      status: 'new',
      created_at: nowText(),
    };
    store.contacts.unshift(created);
    writeStore(store);
    return created;
  },

  listContacts(): ContactDto[] {
    return readStore().contacts;
  },

  updateContactStatus(id: number, status: ContactStatus): ContactDto {
    const store = readStore();
    const target = store.contacts.find((c) => c.id === id);
    if (!target) throw new Error('Không tìm thấy yêu cầu liên hệ.');
    target.status = status;
    writeStore(store);
    return target;
  },

  listKnowledge(): KnowledgeArticleDto[] {
    return readStore().knowledge;
  },

  createKnowledge(payload: {
    title: string;
    excerpt: string;
    content: string;
    imageFile?: string;
  }): KnowledgeArticleDto {
    const store = readStore();
    const created: KnowledgeArticleDto = {
      id: slugify(payload.title),
      title: payload.title.trim(),
      excerpt: payload.excerpt.trim(),
      content: payload.content.trim(),
      image_file: payload.imageFile || 'imgRectangle222.png',
      is_featured: 0,
      created_at: nowText(),
    };
    store.knowledge.push(created);
    writeStore(store);
    return created;
  },

  listReviews(): ReviewDto[] {
    return readStore().reviews;
  },

  createReview(payload: { author: string; quote: string; rating: number }): ReviewDto {
    const store = readStore();
    const created: ReviewDto = {
      id: Date.now(),
      author: payload.author.trim(),
      quote: payload.quote.trim(),
      rating: payload.rating,
      avatar_file: 'imgEllipse47.png',
      created_at: nowText(),
    };
    store.reviews.unshift(created);
    writeStore(store);
    return created;
  },
};
