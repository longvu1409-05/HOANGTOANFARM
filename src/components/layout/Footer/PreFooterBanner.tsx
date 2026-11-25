import React from 'react';
import { PARTNER_FOOTER_ASSETS } from '../../../constants/assets';
import { PREFOOTER_FEATURES } from '../../../data/footerData';
import { CroppedImage } from '../../common/CroppedImage';

interface PreFooterBannerProps {
  onOpenOrderModal: () => void;
}

/**
 * Banner kêu gọi đặt hàng kèm giỏ trái cây nổi tràn viền ngay phía trên Footer
 */
export const PreFooterBanner: React.FC<PreFooterBannerProps> = ({ onOpenOrderModal }) => {
  return (
    <div className="htf-prefooter" data-node-id="971:183">
      <div className="htf-prefooter__band" data-node-id="565:125">
        <div className="htf-prefooter__band-bg" aria-hidden="true">
          <CroppedImage
            src={PARTNER_FOOTER_ASSETS.preFooterBg}
            alt=""
            crop={{
              width: '100%',
              height: '171.24%',
              left: '0%',
              top: '-46.97%',
            }}
          />
        </div>

        <div className="htf-container htf-prefooter__inner" data-node-id="542:115">
          <div className="htf-prefooter__copy">
            <h2 className="htf-prefooter__title" data-node-id="767:393">
              <span>Đặt trái cây tươi ngon</span>
              <span>cho gia đình bạn ngay hôm nay!</span>
            </h2>

            <ul className="htf-prefooter__list">
              {PREFOOTER_FEATURES.map((feat) => (
                <li key={feat.id} className="htf-prefooter__item" data-node-id={feat.nodeId}>
                  <span className="htf-prefooter__icon">
                    <img src={feat.icon} alt="" className="htf-svg-intrinsic" />
                  </span>
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="htf-prefooter__visual">
            <div className="htf-prefooter__basket" data-node-id="899:269" aria-hidden="true">
              <CroppedImage
                src={PARTNER_FOOTER_ASSETS.preFooterBasket}
                alt=""
                crop={{
                  width: '238.58%',
                  height: '118.95%',
                  left: '-132.38%',
                  top: '-2.57%',
                }}
              />
            </div>

            <button
              type="button"
              className="htf-btn-order-now"
              onClick={onOpenOrderModal}
              data-node-id="588:138"
            >
              <span data-node-id="507:300">đặt hàng ngay</span>
              <img
                src={PARTNER_FOOTER_ASSETS.preFooterOrderCart}
                alt=""
                className="htf-svg-intrinsic"
                data-node-id="507:301"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
