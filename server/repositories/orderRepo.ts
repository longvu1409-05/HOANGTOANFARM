import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { OrderItemRecord, OrderRecord, OrderStatus } from '../types/backend.types';

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
  address: string;
  note: string;
}

/**
 * Truy vấn và cập nhật đơn hàng (hỗ trợ SQLite + JSON fallback)
 */
export const orderRepo = {
  create(params: InsertOrderParams): OrderRecord {
    const first = params.lines[0];
    const totalQty = params.lines.reduce((sum, l) => sum + l.quantity, 0);
    const summaryName =
      params.lines.length === 1
        ? first.productName
        : `${first.productName} (+${params.lines.length - 1} sản phẩm khác)`;

    const db = getSqliteDb();
    if (db) {
      db.exec('BEGIN IMMEDIATE;');
      try {
        const insertOrder = db.prepare(
          `INSERT INTO orders (
            order_code, product_id, product_name, unit_price_vnd,
            quantity, total_price_vnd, customer_name, customer_phone, address, note
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        const orderResult = insertOrder.run(
          params.orderCode,
          first.productId,
          summaryName,
          first.unitPriceVnd,
          totalQty,
          params.totalPriceVnd,
          params.customerName,
          params.customerPhone,
          params.address,
          params.note
        );
        const orderId = Number(orderResult.lastInsertRowid);

        const insertItem = db.prepare(
          `INSERT INTO order_items (
            order_id, product_id, product_name, unit_price_vnd, quantity, subtotal_vnd
          ) VALUES (?, ?, ?, ?, ?, ?)`
        );
        const decStock = db.prepare(
          'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?'
        );

        for (const line of params.lines) {
          const stockUpdate = decStock.run(line.quantity, line.productId, line.quantity);
          if (Number(stockUpdate.changes) === 0) {
            throw new Error(`Sản phẩm "${line.productName}" không đủ số lượng trong kho.`);
          }
          insertItem.run(
            orderId,
            line.productId,
            line.productName,
            line.unitPriceVnd,
            line.quantity,
            line.subtotalVnd
          );
        }

        db.exec('COMMIT;');
        return this.findById(orderId)!;
      } catch (err) {
        db.exec('ROLLBACK;');
        throw err;
      }
    }

    const store = getJsonStore();
    for (const line of params.lines) {
      const prod = store.products.find((p) => p.id === line.productId && p.is_active === 1);
      if (!prod || prod.stock < line.quantity) {
        throw new Error(`Sản phẩm "${line.productName}" không đủ số lượng trong kho.`);
      }
    }
    for (const line of params.lines) {
      const prod = store.products.find((p) => p.id === line.productId)!;
      prod.stock -= line.quantity;
    }

    const orderId = ++store.counters.orderId;
    const now = nowTimestamp();
    const items: OrderItemRecord[] = params.lines.map((line) => ({
      id: ++store.counters.orderItemId,
      order_id: orderId,
      product_id: line.productId,
      product_name: line.productName,
      unit_price_vnd: line.unitPriceVnd,
      quantity: line.quantity,
      subtotal_vnd: line.subtotalVnd,
    }));

    const order: OrderRecord = {
      id: orderId,
      order_code: params.orderCode,
      product_id: first.productId,
      product_name: summaryName,
      unit_price_vnd: first.unitPriceVnd,
      quantity: totalQty,
      total_price_vnd: params.totalPriceVnd,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      address: params.address,
      note: params.note,
      status: 'pending',
      created_at: now,
      updated_at: now,
      items,
    };
    store.orders.unshift(order);
    saveJsonStore();
    return order;
  },

  findAll(filters?: { phone?: string; code?: string; status?: string }): OrderRecord[] {
    const db = getSqliteDb();
    if (db) {
      const conditions: string[] = [];
      const values: string[] = [];

      if (filters?.phone?.trim()) {
        conditions.push('customer_phone LIKE ?');
        values.push(`%${filters.phone.trim()}%`);
      }
      if (filters?.code?.trim()) {
        conditions.push('UPPER(order_code) = ?');
        values.push(filters.code.trim().toUpperCase());
      }
      if (filters?.status?.trim()) {
        conditions.push('status = ?');
        values.push(filters.status.trim());
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const orders = db
        .prepare(`SELECT * FROM orders ${whereClause} ORDER BY id DESC`)
        .all(...values) as unknown as OrderRecord[];

      const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
      return orders.map((order) => {
        const items = getItems.all(order.id) as unknown as OrderItemRecord[];
        return { ...order, items };
      });
    }

    const store = getJsonStore();
    const phone = filters?.phone?.trim();
    const code = filters?.code?.trim().toUpperCase();
    const status = filters?.status?.trim();

    return store.orders.filter((o) => {
      if (phone && !o.customer_phone.includes(phone)) return false;
      if (code && o.order_code.toUpperCase() !== code) return false;
      if (status && o.status !== status) return false;
      return true;
    });
  },

  findById(id: number): OrderRecord | undefined {
    const db = getSqliteDb();
    if (db) {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as unknown as
        | OrderRecord
        | undefined;
      if (!order) return undefined;

      const items = db
        .prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC')
        .all(order.id) as unknown as OrderItemRecord[];
      return { ...order, items };
    }

    return getJsonStore().orders.find((o) => o.id === id);
  },

  updateStatus(id: number, nextStatus: OrderStatus): OrderRecord | undefined {
    const db = getSqliteDb();
    if (db) {
      const current = this.findById(id);
      if (!current) return undefined;

      db.exec('BEGIN IMMEDIATE;');
      try {
        if (current.status !== 'cancelled' && nextStatus === 'cancelled' && current.items) {
          const restoreStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
          for (const item of current.items) {
            restoreStock.run(item.quantity, item.product_id);
          }
        }

        db.prepare(
          `UPDATE orders SET status = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`
        ).run(nextStatus, id);

        db.exec('COMMIT;');
        return this.findById(id);
      } catch (err) {
        db.exec('ROLLBACK;');
        throw err;
      }
    }

    const store = getJsonStore();
    const order = store.orders.find((o) => o.id === id);
    if (!order) return undefined;

    if (order.status !== 'cancelled' && nextStatus === 'cancelled' && order.items) {
      for (const item of order.items) {
        const prod = store.products.find((p) => p.id === item.product_id);
        if (prod) prod.stock += item.quantity;
      }
    }
    order.status = nextStatus;
    order.updated_at = nowTimestamp();
    saveJsonStore();
    return order;
  },

  getSummary() {
    const db = getSqliteDb();
    if (db) {
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
    }

    const orders = getJsonStore().orders;
    return {
      totalOrders: orders.length,
      totalRevenueVnd: orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_price_vnd, 0),
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
    };
  },
};
