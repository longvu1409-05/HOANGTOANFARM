import React from 'react';
import { PRODUCT_ASSETS } from '../../../constants/assets';
import { PRODUCTS } from '../../../data/productsData';
import { ProductItem } from '../../../types/farm.types';
import { SectionHeader } from '../../common/SectionHeader';
import { ProductCard } from './ProductCard';
import './Products.css';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: ProductItem) => void;
}

/**
 * Khu vực "Sản phẩm tuyển chọn": hiển thị lưới 4 sản phẩm chủ lực & nút Xem toàn bộ
 */
export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
}) => {
  return (
    <section className="htf-products-section" id="san-pham">
      <div className="htf-container">
        <SectionHeader
          title="Sản phẩm tuyển chọn"
          subtitle="Từ vùng trồng đạt chuẩn, kiểm soát chất lượng"
          titleNodeId="683:345"
          subtitleNodeId="683:346"
        />

        <div className="htf-products-grid" data-node-id="874:257">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>

        <div className="htf-products-more-row">
          <div className="htf-products-more-row__line" data-node-id="683:421">
            <img src={PRODUCT_ASSETS.sectionFlankLine} alt="" className="htf-line-svg" />
          </div>

          <a href="#san-pham" className="htf-btn-all-products" data-node-id="683:431">
            <span className="htf-btn-all-products__text" data-node-id="683:432">
              xem toàn bộ sản phẩm
            </span>
            <span className="htf-btn-all-products__sep" data-node-id="683:434">
              <img src={PRODUCT_ASSETS.btnVerticalDivider} alt="" className="htf-svg-intrinsic" />
            </span>
            <span className="htf-btn-all-products__chevron" data-node-id="683:433">
              <img src={PRODUCT_ASSETS.btnRightChevron} alt="" className="htf-svg-intrinsic" />
            </span>
          </a>

          <div className="htf-products-more-row__line" data-node-id="683:422">
            <img src={PRODUCT_ASSETS.sectionFlankLine} alt="" className="htf-line-svg" />
          </div>
        </div>
      </div>
    </section>
  );
};
