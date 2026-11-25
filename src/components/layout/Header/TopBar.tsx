import React from 'react';
import { HEADER_ASSETS } from '../../../constants/assets';

/**
 * Thanh thông tin màu xanh đậm trên cùng (Slogan, Giao hàng, Kiểm tra hàng, Hotline)
 */
export const TopBar: React.FC = () => {
  return (
    <div className="htf-topbar" data-node-id="675:127">
      <div className="htf-container htf-topbar__inner">
        <div className="htf-topbar__item" data-node-id="675:132">
          <img src={HEADER_ASSETS.iconLocationTop} alt="" className="htf-svg-intrinsic" />
          <span className="htf-gold-text htf-topbar__text">
            Vườn sạch - Trái ngọt - Giá trị thật
          </span>
        </div>

        <div className="htf-topbar__center">
          <div className="htf-topbar__item" data-node-id="675:133">
            <img src={HEADER_ASSETS.iconTruckTop} alt="" className="htf-svg-intrinsic" />
            <span className="htf-gold-text htf-topbar__text">Giao hàng tận tay</span>
          </div>
          <div className="htf-topbar__item" data-node-id="675:136">
            <img src={HEADER_ASSETS.iconCheckTop} alt="" className="htf-svg-intrinsic" />
            <span className="htf-gold-text htf-topbar__text">Kiểm tra trước khi nhận</span>
          </div>
        </div>

        <a
          href="tel:0989604818"
          className="htf-topbar__item htf-topbar__hotline"
          data-node-id="675:128"
        >
          <img src={HEADER_ASSETS.iconPhoneTop} alt="" className="htf-svg-intrinsic" />
          <span className="htf-gold-text htf-topbar__text">
            <span className="htf-fw-regular">Hotline:</span> 0989.604.818 - 0979.784.149
          </span>
        </a>
      </div>
    </div>
  );
};
