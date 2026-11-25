import React from 'react';
import { PRODUCT_ASSETS } from '../../../constants/assets';
import { ProductItem } from '../../../types/farm.types';
import { CroppedImage } from '../../common/CroppedImage';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

/**
 * Thẻ hiển thị 1 sản phẩm (viền kép xanh đậm + ảnh + thông số + giá + nút Đặt quà)
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <article className="htf-product-card" data-node-id={product.nodeId}>
      <div className="htf-product-card__outer" />

      <div className="htf-product-card__inner">
        <div className="htf-product-card__img-box">
          <CroppedImage src={product.image} alt={product.name} crop={product.imageCrop} />
        </div>

        <h3 className="htf-product-card__title htf-green-grad-text">{product.name}</h3>

        <ul className="htf-product-card__specs">
          <li>
            <img src={PRODUCT_ASSETS.productSpecIcon1} alt="" className="htf-svg-intrinsic" />
            <span>{product.spec1}</span>
          </li>
          <li>
            <img src={PRODUCT_ASSETS.productSpecIcon2} alt="" className="htf-svg-intrinsic" />
            <span>{product.spec2}</span>
          </li>
        </ul>

        <div className="htf-product-card__divider">
          <img src={PRODUCT_ASSETS.productDivider} alt="" className="htf-line-svg" />
        </div>

        <div className="htf-product-card__footer">
          <div className="htf-product-card__price-group">
            <div className="htf-product-card__box-badge">
              <img src={PRODUCT_ASSETS.productBoxBadgeIcon} alt="" className="htf-svg-intrinsic" />
            </div>
            <div className="htf-product-card__price-meta">
              <span className="htf-product-card__unit">{product.unit}</span>
              <strong className="htf-product-card__price">{product.price}</strong>
            </div>
          </div>

          <button
            type="button"
            className="htf-product-card__order-btn"
            onClick={() => onSelect(product)}
          >
            <img src={PRODUCT_ASSETS.productOrderGiftIcon} alt="" className="htf-svg-intrinsic" />
            <span>Đặt quà</span>
          </button>
        </div>
      </div>
    </article>
  );
};
