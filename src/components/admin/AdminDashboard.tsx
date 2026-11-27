import React, { useEffect, useState } from 'react';
import { fetchSubscribers, SubscriberDto } from '../../services/newsletterApi';
import {
  fetchOrders,
  OrderDto,
  OrderStatus,
  updateOrderStatus,
} from '../../services/orderApi';
import './AdminDashboard.css';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

/**
 * Trang quản lý đơn hàng & danh sách đăng ký nhận tin (truy cập qua ?admin=1)
 */
export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenueVnd: 0,
    pendingOrders: 0,
  });
  const [subscribers, setSubscribers] = useState<SubscriberDto[]>([]);
  const [phoneFilter, setPhoneFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async (phone?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [orderData, subList] = await Promise.all([
        fetchOrders(phone ? { phone } : undefined),
        fetchSubscribers(),
      ]);
      setOrders(orderData.orders);
      setSummary(orderData.summary);
      setSubscribers(subList);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Không kết nối được Backend API (cổng 4000).'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    await loadData(phoneFilter);
  };

  return (
    <div className="htf-admin">
      <div className="htf-admin__container">
        <header className="htf-admin__header">
          <div>
            <h1 className="htf-admin__title">Quản lý Hoàng Toàn Farm</h1>
            <p className="htf-admin__sub">Theo dõi đơn đặt quà &amp; email đăng ký nhận ưu đãi</p>
          </div>
          <a href="./" className="htf-admin__back-btn">
            ← Về trang chủ
          </a>
        </header>

        {errorMsg && <div className="htf-admin__error">{errorMsg}</div>}

        <div className="htf-admin__stats">
          <div className="htf-admin__stat-card">
            <span>Tổng đơn hàng</span>
            <strong>{summary.totalOrders}</strong>
          </div>
          <div className="htf-admin__stat-card">
            <span>Chờ xác nhận</span>
            <strong>{summary.pendingOrders}</strong>
          </div>
          <div className="htf-admin__stat-card">
            <span>Doanh thu tạm tính</span>
            <strong>{summary.totalRevenueVnd.toLocaleString('vi-VN')}đ</strong>
          </div>
          <div className="htf-admin__stat-card">
            <span>Email đăng ký tin</span>
            <strong>{subscribers.length}</strong>
          </div>
        </div>

        <section className="htf-admin__panel">
          <div className="htf-admin__panel-head">
            <h2>Danh sách đơn hàng</h2>
            <form
              className="htf-admin__filter"
              onSubmit={(e) => {
                e.preventDefault();
                loadData(phoneFilter);
              }}
            >
              <input
                type="search"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                placeholder="Lọc theo số điện thoại..."
              />
              <button type="submit">Tìm</button>
            </form>
          </div>

          {loading ? (
            <p className="htf-admin__empty">Đang tải dữ liệu...</p>
          ) : orders.length === 0 ? (
            <p className="htf-admin__empty">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="htf-admin__table-wrap">
              <table className="htf-admin__table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>SL</th>
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
                        {order.note && <div className="htf-admin__note">Ghi chú: {order.note}</div>}
                      </td>
                      <td>{order.product_name}</td>
                      <td>{order.quantity}</td>
                      <td>{order.total_price_vnd.toLocaleString('vi-VN')}đ</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
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

        <section className="htf-admin__panel">
          <h2>Email đăng ký nhận tin ({subscribers.length})</h2>
          {subscribers.length === 0 ? (
            <p className="htf-admin__empty">Chưa có email đăng ký.</p>
          ) : (
            <ul className="htf-admin__subs">
              {subscribers.map((sub) => (
                <li key={sub.id}>
                  <span>{sub.email}</span>
                  <small>{sub.created_at}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
