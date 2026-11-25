import React, { useState } from 'react';
import { PRODUCTS } from '../../data/productsData';
import { ProductItem } from '../../types/farm.types';
import './Modals.css';

interface OrderModalProps {
  selectedProduct: ProductItem | null;
  onClose: () => void;
  onConfirmOrder: (productName: string, customerName: string, phone: string) => void;
}

/**
 * Popup điền thông tin đặt quà nhanh
 */
export const OrderModal: React.FC<OrderModalProps> = ({
  selectedProduct,
  onClose,
  onConfirmOrder,
}) => {
  const [chosenId, setChosenId] = useState<string>(selectedProduct?.id ?? PRODUCTS[0].id);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const chosen = PRODUCTS.find((p) => p.id === chosenId) ?? PRODUCTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onConfirmOrder(chosen.name, name.trim(), phone.trim());
  };

  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <h3 className="htf-modal__title htf-green-grad-text">Đặt quà trái cây tươi</h3>
        <p className="htf-modal__sub">
          Tuyển chọn trực tiếp từ vườn Hoàng Toàn Farm – kiểm tra hàng trước khi nhận.
        </p>

        <form className="htf-modal__form" onSubmit={handleSubmit}>
          <label className="htf-modal__label">
            Sản phẩm lựa chọn
            <select
              value={chosenId}
              onChange={(e) => setChosenId(e.target.value)}
              className="htf-modal__input"
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.unit} – {p.price})
                </option>
              ))}
            </select>
          </label>

          <label className="htf-modal__label">
            Họ và tên người đặt
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Minh Anh"
              className="htf-modal__input"
              required
            />
          </label>

          <label className="htf-modal__label">
            Số điện thoại liên hệ
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0989.xxx.xxx"
              className="htf-modal__input"
              required
            />
          </label>

          <label className="htf-modal__label">
            Ghi chú lời chúc / địa chỉ giao
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi thiệp chúc mừng hoặc khung giờ nhận hàng..."
              className="htf-modal__input htf-modal__textarea"
              rows={2}
            />
          </label>

          <button type="submit" className="htf-modal__submit">
            Xác nhận đặt quà ({chosen.price})
          </button>
        </form>
      </div>
    </div>
  );
};
