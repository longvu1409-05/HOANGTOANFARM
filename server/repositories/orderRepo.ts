import { getDatabase } from '../db/database.js';
import { OrderRecord, OrderStatus } from '../types/backend.types.js';

interface InsertOrderParams {
  orderCode: string;
  productId: string;
  productName: string;
  unitPriceVnd: number;
  quantity: number;
  totalPriceVnd: number;
  customerName: string;
  customerPhone: string;
  note: string;
}

/**
 * Truy vấn và cập nhật đơn hàng trong bảng orders
 */
export const orderRepo = {
  create(params: InsertOrderParams): OrderRecord {
    const db = getDatabase();
    const result = db
      .prepare(
        `INSERT INTO orders (
          order_code, product_id, product_name, unit_price_vnd,
          quantity, total_price_vnd, customer_name, customer_phone, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        params.orderCode,
        params.productId,
        params.productName,
        params.unitPriceVnd,
        params.quantity,
        params.totalPriceVnd,
        params.customerName,
        params.customerPhone,
        params.note
      );

    return this.findById(Number(result.lastInsertRowid))!;
  },

  findAll(filters?: { phone?: string; code?: string; status?: string }): OrderRecord[] {
    const db = getDatabase();
    const conditions: string[] = [];
    const values: string[] = [];

    if (filters?.phone?.trim()) {
      conditions.push('customer_phone LIKE ?');
      values.push(`%${filters.phone.trim()}%`);
    }
    if (filters?.code?.trim()) {
      conditions.push('order_code = ?');
      values.push(filters.code.trim().toUpperCase());
    }
    if (filters?.status?.trim()) {
      conditions.push('status = ?');
      values.push(filters.status.trim());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return db
      .prepare(`SELECT * FROM orders ${whereClause} ORDER BY id DESC`)
      .all(...values) as unknown as OrderRecord[];
  },

  findById(id: number): OrderRecord | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as unknown as
      | OrderRecord
      | undefined;
  },

  updateStatus(id: number, status: OrderStatus): OrderRecord | undefined {
    const db = getDatabase();
    db.prepare(
      `UPDATE orders SET status = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`
    ).run(status, id);
    return this.findById(id);
  },

  getSummary() {
    const db = getDatabase();
    return db
      .prepare(
        `SELECT
          COUNT(*) AS totalOrders,
          COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_price_vnd ELSE 0 END), 0) AS totalRevenueVnd,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pendingOrders
        FROM orders`
      )
      .get() as unknown as {
      totalOrders: number;
      totalRevenueVnd: number;
      pendingOrders: number;
    };
  },
};
