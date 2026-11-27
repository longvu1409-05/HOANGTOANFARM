import React, { useState } from 'react';
import { CreateOrderPayload, previewPromoDiscount } from '../../services/orderApi';
import { CartItem } from '../../types/farm.types';
import './Modals.css';

interface CartDrawerProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (payload: CreateOrderPayload) => Promise<void>;
  onOpenOrderLookup: () => void;
}

/**
 * Ngăn kéo Giỏ hàng trượt từ cạnh phải: chỉnh số lượng, nhập email nhận mã vận đơn, đặt nhiều món
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onOpenOrderLookup,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subtotalVnd = items.reduce(
    (sum, item) => sum + (item.product.priceVnd ?? 0) * item.quantity,
    0
  );
  const promoPreview = previewPromoDiscount(subtotalVnd, promoCode);
  const totalVnd = promoPreview.finalVnd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await onCheckout({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        promoCode: promoCode.trim().toUpperCase(),
        address: address.trim(),
        note: note.trim(),
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Đặt hàng thất bại, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="htf-drawer-backdrop" onClick={onClose}>
      <aside className="htf-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="htf-drawer__head">
          <div>
            <h3 className="htf-drawer__title htf-green-grad-text">Giỏ hàng của bạn</h3>
            <button
              type="button"
              className="htf-drawer__lookup-link"
              onClick={() => {
                onClose();
                onOpenOrderLookup();
              }}
            >
              Tra cứu đơn hàng đã đặt →
            </button>
          </div>
          <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="htf-drawer__empty">
            <p>Giỏ hàng đang trống.</p>
            <p className="htf-drawer__empty-sub">
              Hãy chọn những phần vú sữa Hoàng Toàn hoặc giỏ quà tươi ngon từ danh sách sản phẩm!
            </p>
          </div>
        ) : (
          <div className="htf-drawer__body">
            <ul className="htf-cart-list">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="htf-cart-item">
                  <img src={product.image} alt={product.name} className="htf-cart-item__img" />
                  <div className="htf-cart-item__info">
                    <strong>{product.name}</strong>
                    <span>
                      {product.unit} · {product.price}
                    </span>
                    <div className="htf-cart-item__controls">
                      <div className="htf-qty-stepper htf-qty-stepper--sm">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, quantity - 1)}
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="htf-cart-item__del"
                        onClick={() => onRemoveItem(product.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="htf-drawer__total">
              <span>Tổng cộng tạm tính:</span>
              <strong>{totalVnd.toLocaleString('vi-VN')}đ</strong>
            </div>

            <form className="htf-modal__form" onSubmit={handleSubmit}>
              <label className="htf-modal__label">
                Họ và tên người nhận *
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  className="htf-modal__input"
                  required
                />
              </label>

              <label className="htf-modal__label">
                Số điện thoại liên hệ *
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ví dụ: 0989604818"
                  className="htf-modal__input"
                  required
                />
              </label>

              <label className="htf-modal__label">
                Email nhận mã đơn &amp; thông báo giao hàng
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="ban@gmail.com"
                  className="htf-modal__input"
                />
              </label>

              <label className="htf-modal__label">
                Mã ưu đãi (ví dụ: HTF10)
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã giảm giá từ bản tin..."
                  className="htf-modal__input"
                />
              </label>

              <label className="htf-modal__label">
                Địa chỉ giao hàng
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, quận/huyện..."
                  className="htf-modal__input"
                />
              </label>

              <label className="htf-modal__label">
                Ghi chú lời chúc
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Thiệp chúc mừng hoặc giờ nhận hàng..."
                  className="htf-modal__input htf-modal__textarea"
                  rows={2}
                />
              </label>

              {errorMsg && <p className="htf-modal__error">{errorMsg}</p>}

              <button type="submit" className="htf-modal__submit" disabled={submitting}>
                {submitting
                  ? 'Đang xử lý đơn hàng...'
                  : `Đặt hàng ngay (${totalVnd.toLocaleString('vi-VN')}đ)`}
              </button>
            </form>
          </div>
        )}
      </aside>
    </div>
  );
};
