import React, { useState } from 'react';
import { CreateOrderPayload } from '../../services/orderApi';
import { ProductItem } from '../../types/farm.types';
import './Modals.css';

interface OrderModalProps {
  products: ProductItem[];
  selectedProduct: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number) => void;
  onConfirmOrder: (payload: CreateOrderPayload) => Promise<void>;
}

/**
 * Popup điền thông tin đặt quà nhanh — hỗ trợ nhập Email để nhận mã đơn & thông báo giao hàng
 */
export const OrderModal: React.FC<OrderModalProps> = ({
  products,
  selectedProduct,
  onClose,
  onAddToCart,
  onConfirmOrder,
}) => {
  const [chosenId, setChosenId] = useState<string>(
    selectedProduct?.id ?? products[0]?.id ?? ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chosen = products.find((p) => p.id === chosenId) ?? products[0];
  const unitPrice = chosen?.priceVnd ?? 0;
  const totalLabel =
    unitPrice > 0 ? `${(unitPrice * quantity).toLocaleString('vi-VN')}đ` : chosen?.price ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosen) return;
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await onConfirmOrder({
        items: [{ productId: chosen.id, quantity }],
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
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
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <h3 className="htf-modal__title htf-green-grad-text">Đặt quà trái cây tươi</h3>
        <p className="htf-modal__sub">
          Tuyển chọn trực tiếp từ vườn Hoàng Toàn Farm – nhận mã tra cứu đơn qua Email.
        </p>

        <form className="htf-modal__form" onSubmit={handleSubmit}>
          <label className="htf-modal__label">
            Sản phẩm lựa chọn
            <select
              value={chosenId}
              onChange={(e) => setChosenId(e.target.value)}
              className="htf-modal__input"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.unit} – {p.price})
                </option>
              ))}
            </select>
          </label>

          <div className="htf-modal__row-2">
            <label className="htf-modal__label">
              Số lượng
              <input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(50, Number(e.target.value) || 1)))
                }
                className="htf-modal__input"
                required
              />
            </label>

            <label className="htf-modal__label">
              Số điện thoại liên hệ *
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0989604818"
                className="htf-modal__input"
                required
              />
            </label>
          </div>

          <div className="htf-modal__row-2-eq">
            <label className="htf-modal__label">
              Họ và tên người đặt *
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Minh Anh"
                className="htf-modal__input"
                required
              />
            </label>

            <label className="htf-modal__label">
              Email nhận mã đơn
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@gmail.com"
                className="htf-modal__input"
              />
            </label>
          </div>

          <label className="htf-modal__label">
            Địa chỉ nhận hàng
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
              className="htf-modal__input"
            />
          </label>

          <label className="htf-modal__label">
            Ghi chú lời chúc / khung giờ giao
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi thiệp chúc mừng hoặc khung giờ nhận hàng..."
              className="htf-modal__input htf-modal__textarea"
              rows={2}
            />
          </label>

          {errorMsg && <p className="htf-modal__error">{errorMsg}</p>}

          <div className="htf-detail-actions">
            <button
              type="button"
              className="htf-modal__btn-outline"
              onClick={() => {
                if (chosen) onAddToCart(chosen, quantity);
                onClose();
              }}
            >
              + Thêm vào giỏ
            </button>
            <button type="submit" className="htf-modal__submit" disabled={submitting}>
              {submitting ? 'Đang gửi đơn...' : `Đặt ngay (${totalLabel})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
