import React, { useState } from 'react';
import { OrderDto, OrderStatus } from '../../services/orderApi';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

interface AdminOrdersTabProps {
  orders: OrderDto[];
  onFilter: (filters: { phone?: string; status?: string }) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

/**
 * Tab Quản lý Đơn hàng: lọc theo SĐT/trạng thái, xem chi tiết món hàng, đổi trạng thái đơn
 */
export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onFilter,
  onUpdateStatus,
}) => {
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ phone: phoneFilter, status: statusFilter });
  };

  return (
    <section className="htf-admin__panel">
      <div className="htf-admin__panel-head">
        <h2>Danh sách đơn hàng ({orders.length})</h2>
        <form className="htf-admin__filter" onSubmit={handleSubmit}>
          <input
            type="search"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            placeholder="Tìm theo SĐT..."
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              onFilter({ phone: phoneFilter, status: e.target.value });
            }}
            className="htf-admin__select"
          >
            <option value="">Tất cả trạng thái</option>
            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((st) => (
              <option key={st} value={st}>
                {STATUS_LABELS[st]}
              </option>
            ))}
          </select>
          <button type="submit">Lọc</button>
        </form>
      </div>

      {orders.length === 0 ? (
        <p className="htf-admin__empty">Chưa có đơn hàng nào phù hợp.</p>
      ) : (
        <div className="htf-admin__table-wrap">
          <table className="htf-admin__table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Chi tiết sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.order_code}</strong>
                  </td>
                  <td>
                    <div>{order.customer_name}</div>
                    <small>{order.customer_phone}</small>
                    {order.address && <div className="htf-admin__note">ĐC: {order.address}</div>}
                    {order.note && <div className="htf-admin__note">Ghi chú: {order.note}</div>}
                  </td>
                  <td>
                    {order.items && order.items.length > 0 ? (
                      <ul className="htf-admin__order-items">
                        {order.items.map((it) => (
                          <li key={it.id}>
                            {it.product_name} × <strong>{it.quantity}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>
                        {order.product_name} × {order.quantity}
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>{order.total_price_vnd.toLocaleString('vi-VN')}đ</strong>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="htf-admin__select"
                    >
                      {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
