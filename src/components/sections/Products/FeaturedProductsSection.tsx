import React, { useState } from 'react';
import { PRODUCT_ASSETS } from '../../../constants/assets';
import { ProductItem } from '../../../types/farm.types';
import { SectionHeader } from '../../common/SectionHeader';
import { ProductCard } from './ProductCard';
import './Products.css';

interface FeaturedProductsSectionProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onInspectProduct: (product: ProductItem) => void;
}

const CATEGORIES = ['Tất cả', 'Trái cây tươi', 'Quà biếu', 'Combo'];

/**
 * Khu vực "Sản phẩm tuyển chọn":
 * Mặc định hiện 4 sản phẩm nổi bật theo Figma; bấm "Xem toàn bộ sản phẩm" để mở rộng cả 7+ sản phẩm & lọc danh mục.
 */
export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  onSelectProduct,
  onInspectProduct,
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  const featuredProducts = products.filter((p) => p.isFeatured !== false).slice(0, 4);
  const baseList = showAll
    ? products
    : featuredProducts.length > 0
      ? featuredProducts
      : products.slice(0, 4);

  const visibleProducts =
    showAll && activeCategory !== 'Tất cả'
      ? baseList.filter((p) => (p.category || 'Trái cây tươi') === activeCategory)
      : baseList;

  return (
    <section className="htf-products-section" id="san-pham">
      <div className="htf-container">
        <SectionHeader
          title="Sản phẩm tuyển chọn"
          subtitle="Từ vùng trồng đạt chuẩn, kiểm soát chất lượng"
          titleNodeId="683:345"
          subtitleNodeId="683:346"
        />

        {showAll && (
          <div className="htf-products-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`htf-filter-pill ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="htf-products-grid" data-node-id="874:257">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onInspect={onInspectProduct}
            />
          ))}
        </div>

        <div className="htf-products-more-row">
          <div className="htf-products-more-row__line" data-node-id="683:421">
            <img src={PRODUCT_ASSETS.sectionFlankLine} alt="" className="htf-line-svg" />
          </div>

          <button
            type="button"
            className="htf-btn-all-products"
            onClick={() => {
              setShowAll((prev) => !prev);
              setActiveCategory('Tất cả');
            }}
            data-node-id="683:431"
          >
            <span className="htf-btn-all-products__text" data-node-id="683:432">
              {showAll ? `thu gọn (${products.length} sản phẩm)` : 'xem toàn bộ sản phẩm'}
            </span>
            <span className="htf-btn-all-products__sep" data-node-id="683:434">
              <img src={PRODUCT_ASSETS.btnVerticalDivider} alt="" className="htf-svg-intrinsic" />
            </span>
            <span
              className={`htf-btn-all-products__chevron ${showAll ? 'is-rotated' : ''}`}
              data-node-id="683:433"
            >
              <img src={PRODUCT_ASSETS.btnRightChevron} alt="" className="htf-svg-intrinsic" />
            </span>
          </button>

          <div className="htf-products-more-row__line" data-node-id="683:422">
            <img src={PRODUCT_ASSETS.sectionFlankLine} alt="" className="htf-line-svg" />
          </div>
        </div>
      </div>
    </section>
  );
};
