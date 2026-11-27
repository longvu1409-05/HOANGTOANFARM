import { requireSupabaseClient } from '../db/supabaseClient.js';
import { OrderItemRecord, OrderRecord, OrderStatus } from '../types/backend.types.js';

interface ResolvedOrderLine {
  productId: string;
  productName: string;
  unitPriceVnd: number;
  quantity: number;
  subtotalVnd: number;
}

interface InsertOrderParams {
  orderCode: string;
  lines: ResolvedOrderLine[];
  totalPriceVnd: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  note: string;
}

function toOrderItem(row: Record<string, unknown>): OrderItemRecord {
  return {
    id: Number(row.id),
    order_id: Number(row.order_id),
    product_id: String(row.product_id),
    product_name: String(row.product_name),
    unit_price_vnd: Number(row.unit_price_vnd),
    quantity: Number(row.quantity),
    subtotal_vnd: Number(row.subtotal_vnd),
  };
}

function toOrder(row: Record<string, unknown>): OrderRecord {
  const rawItems = Array.isArray(row.items) ? row.items : [];
  return {
    id: Number(row.id),
    order_code: String(row.order_code),
    product_id: String(row.product_id),
    product_name: String(row.product_name),
    unit_price_vnd: Number(row.unit_price_vnd),
    quantity: Number(row.quantity),
    total_price_vnd: Number(row.total_price_vnd),
    customer_name: String(row.customer_name),
    customer_phone: String(row.customer_phone),
    customer_email: String(row.customer_email ?? ''),
    address: String(row.address ?? ''),
    note: String(row.note ?? ''),
    status: String(row.status ?? 'pending') as OrderStatus,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    items: rawItems.map((it) => toOrderItem(it as Record<string, unknown>)),
  };
}

export const orderRepo = {
  async create(params: InsertOrderParams): Promise<OrderRecord> {
    const supabase = requireSupabaseClient();
    const first = params.lines[0];
    const totalQty = params.lines.reduce((sum, l) => sum + l.quantity, 0);
    const summaryName =
      params.lines.length === 1
        ? first.productName
        : `${first.productName} (+${params.lines.length - 1} sản phẩm khác)`;

    for (const line of params.lines) {
      const { data: prod, error: prodErr } = await supabase
        .from('products')
        .select('id, stock')
        .eq('id', line.productId)
        .single();
      if (prodErr || !prod || Number(prod.stock) < line.quantity) {
        throw new Error(`Sản phẩm "${line.productName}" không đủ số lượng trong kho.`);
      }
      await supabase
        .from('products')
        .update({ stock: Number(prod.stock) - line.quantity })
        .eq('id', line.productId);
    }

    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_code: params.orderCode,
        product_id: first.productId,
        product_name: summaryName,
        unit_price_vnd: first.unitPriceVnd,
        quantity: totalQty,
        total_price_vnd: params.totalPriceVnd,
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        customer_email: params.customerEmail,
        address: params.address,
        note: params.note,
        status: 'pending',
      })
      .select('*')
      .single();

    if (orderErr || !orderData) throw new Error(orderErr?.message ?? 'Lỗi lưu đơn hàng.');

    const orderId = Number(orderData.id);
    const { data: itemRows, error: itemErr } = await supabase
      .from('order_items')
      .insert(
        params.lines.map((line) => ({
          order_id: orderId,
          product_id: line.productId,
          product_name: line.productName,
          unit_price_vnd: line.unitPriceVnd,
          quantity: line.quantity,
          subtotal_vnd: line.subtotalVnd,
        }))
      )
      .select('*');

    if (itemErr) throw new Error(itemErr.message);

    return toOrder({
      ...(orderData as Record<string, unknown>),
      items: itemRows ?? [],
    });
  },

  async findAll(filters?: { phone?: string; code?: string; status?: string }): Promise<OrderRecord[]> {
    const supabase = requireSupabaseClient();
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('id', { ascending: false });

    if (filters?.phone?.trim()) query = query.ilike('customer_phone', `%${filters.phone.trim()}%`);
    if (filters?.code?.trim()) query = query.ilike('order_code', filters.code.trim());
    if (filters?.status?.trim()) query = query.eq('status', filters.status.trim());

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => toOrder(row as Record<string, unknown>));
  },

  async findById(id: number): Promise<OrderRecord | undefined> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toOrder(data as Record<string, unknown>) : undefined;
  },

  async updateStatus(id: number, nextStatus: OrderStatus): Promise<OrderRecord | undefined> {
    const supabase = requireSupabaseClient();
    const current = await this.findById(id);
    if (!current) return undefined;

    if (current.status !== 'cancelled' && nextStatus === 'cancelled' && current.items) {
      for (const item of current.items) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .maybeSingle();
        if (prod) {
          await supabase
            .from('products')
            .update({ stock: Number(prod.stock) + item.quantity })
            .eq('id', item.product_id);
        }
      }
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return this.findById(id);
  },

  async getSummary() {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase.from('orders').select('status, total_price_vnd');
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    return {
      totalOrders: rows.length,
      totalRevenueVnd: rows
        .filter((r) => r.status !== 'cancelled')
        .reduce((sum, r) => sum + Number(r.total_price_vnd ?? 0), 0),
      pendingOrders: rows.filter((r) => r.status === 'pending').length,
    };
  },
};
