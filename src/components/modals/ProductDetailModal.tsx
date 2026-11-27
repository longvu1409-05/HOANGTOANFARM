import React, { useState } from 'react';
import { ProductItem } from '../../types/farm.types';
import { CroppedImage } from '../common/CroppedImage';
import './Modals.css';

interface ProductDetailModalProps {
  product: ProductItem;
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number) => void;
  onOrderNow: (product: ProductItem) => void;
}

/**
 * Popup xem chi tiết thông tin 1 sản phẩm, số lượng tồn kho và thêm vào giỏ / đặt mua ngay
 */
export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOrderNow,
}) => {
  const [qty, setQty] = useState<number>(1);

  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal htf-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        <div className="htf-detail-grid">
          <div className="htf-detail-grid__media">
            <CroppedImage src={product.image} alt={product.name} crop={product.imageCrop} />
          </div>

          <div className="htf-detail-grid__info">
            <span className="htf-badge-pill">{product.category || 'Trái cây tuyển chọn'}</span>
            <h3 className="htf-modal__title htf-green-grad-text">{product.name}</h3>
            <p className="htf-detail-price">
              {product.price} <span>/ {product.unit}</span>
            </p>

            <ul className="htf-detail-specs">
              <li>• {product.spec1}</li>
              <li>• {product.spec2}</li>
              <li>
                • Tình trạng:{' '}
                <strong>
                  {typeof product.stock === 'number' && product.stock > 0
                    ? `Còn ${product.stock} phần tại vườn`
                    : 'Đặt trước thu hoạch'}
                </strong>
              </li>
            </ul>

            <p className="htf-modal__detail">
              {product.description ||
                'Sản phẩm tuyển chọn trực tiếp từ vùng trồng đạt chuẩn VietGAP tại HTX Nông nghiệp Mường Khoe Xanh, đảm bảo độ chín tự nhiên và giao nhanh trong ngày.'}
            </p>

            <div className="htf-detail-qty">
              <span>Số lượng:</span>
              <div className="htf-qty-stepper">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(50, q + 1))}>
                  +
                </button>
              </div>
            </div>

            <div className="htf-detail-actions">
              <button
                type="button"
                className="htf-modal__btn-outline"
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
              >
                + Thêm vào giỏ hàng
              </button>
              <button
                type="button"
                className="htf-modal__submit"
                onClick={() => {
                  onClose();
                  onOrderNow(product);
                }}
              >
                Đặt quà ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
