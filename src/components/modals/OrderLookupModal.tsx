import React, { useCallback, useEffect, useState } from 'react';
import { fetchOrders, OrderDto, OrderStatus } from '../../services/orderApi';
import './Modals.css';

interface OrderLookupModalProps {
  onClose: () => void;
}

const STATUS_BADGES: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

/**
 * Popup tra cứu đơn hàng theo Số điện thoại hoặc Mã đơn hàng (tự động tra cứu khi mở từ link Email ?lookup=HTF-...)
 */
export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ onClose }) => {
  const initialLookup =
    new URLSearchParams(window.location.search).get('lookup')?.trim() ?? '';

  const [keyword, setKeyword] = useState(initialLookup);
  const [orders, setOrders] = useState<OrderDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runLookup = useCallback(async (rawQuery: string) => {
    const q = rawQuery.trim();
    if (!q) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const isCode = q.toUpperCase().startsWith('HTF-');
      const res = await fetchOrders(isCode ? { code: q } : { phone: q });
      setOrders(res.orders);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tra cứu đơn hàng lúc này.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLookup) {
      runLookup(initialLookup);
    }
  }, [initialLookup, runLookup]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runLookup(keyword);
  };

  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal htf-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <h3 className="htf-modal__title htf-green-grad-text">Tra cứu đơn hàng</h3>
        <p className="htf-modal__sub">
          Nhập số điện thoại đặt hàng hoặc mã đơn nhận qua Email (ví dụ: HTF-20261127-...) để kiểm tra tiến độ.
        </p>

        <form className="htf-lookup-form" onSubmit={handleSearch}>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Nhập SĐT hoặc Mã đơn hàng..."
            className="htf-modal__input"
            required
          />
          <button type="submit" className="htf-modal__submit" disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </form>

        {errorMsg && <p className="htf-modal__error">{errorMsg}</p>}

        {orders !== null && (
          <div className="htf-lookup-results">
            {orders.length === 0 ? (
              <p className="htf-modal__detail">Không tìm thấy đơn hàng nào khớp với "{keyword}".</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="htf-lookup-card">
                  <div className="htf-lookup-card__head">
                    <strong>{order.order_code}</strong>
                    <span className={`htf-status-pill htf-status-pill--${order.status}`}>
                      {STATUS_BADGES[order.status]}
                    </span>
                  </div>
                  <p className="htf-lookup-card__meta">
                    Khách hàng: {order.customer_name} ({order.customer_phone}) ·{' '}
                    {order.created_at}
                  </p>
                  {order.address && (
                    <p className="htf-lookup-card__meta">Giao tới: {order.address}</p>
                  )}
                  <ul className="htf-lookup-card__items">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <li key={item.id}>
                          {item.product_name} × {item.quantity} —{' '}
                          {item.subtotal_vnd.toLocaleString('vi-VN')}đ
                        </li>
                      ))
                    ) : (
                      <li>
                        {order.product_name} × {order.quantity}
                      </li>
                    )}
                  </ul>
                  <div className="htf-lookup-card__total">
                    Tổng thanh toán: <strong>{order.total_price_vnd.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
