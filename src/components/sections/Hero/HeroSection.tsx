import React from 'react';
import { HERO_ASSETS } from '../../../constants/assets';
import './Hero.css';

interface HeroSectionProps {
  onOpenOrderModal: () => void;
}

/**
 * Khu vực Banner lớn đầu trang (Hero Section)
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOrderModal }) => {
  return (
    <section className="htf-hero" aria-label="Banner giới thiệu Hoàng Toàn Farm">
      <div className="htf-hero__bg" data-node-id="675:207">
        <img
          src={HERO_ASSETS.heroBanner}
          alt="Vườn trái cây Hoàng Toàn Farm"
          className="htf-hero__bg-img"
        />
      </div>

      <div className="htf-container htf-hero__content">
        <div className="htf-hero__text-col">
          <h1 className="htf-hero__title">
            <span className="htf-gold-text htf-hero__title-line" data-node-id="675:212">
              Trái cây tuyển chọn
            </span>
            <span className="htf-gold-text htf-hero__title-line" data-node-id="675:213">
              từ vườn - Chuẩn vị tự nhiên
            </span>
          </h1>

          <ul className="htf-hero__features">
            <li className="htf-hero__feature-item">
              <span className="htf-hero__check-icon" data-node-id="683:436">
                <img src={HERO_ASSETS.heroCheckCircle} alt="" className="htf-svg-intrinsic" />
              </span>
              <span data-node-id="675:214">Canh tác theo quy trình VietGap</span>
            </li>
            <li className="htf-hero__feature-item">
              <span className="htf-hero__check-icon" data-node-id="683:448">
                <img src={HERO_ASSETS.heroCheckCircle} alt="" className="htf-svg-intrinsic" />
              </span>
              <span data-node-id="675:215">Thu hoạch theo độ chín tự nhiên</span>
            </li>
          </ul>

          <div className="htf-hero__cta-row">
            <a href="#san-pham" className="htf-btn-hero-secondary" data-node-id="675:217">
              <span className="htf-gold-text" data-node-id="675:219">
                xem sản phẩm
              </span>
            </a>

            <button
              type="button"
              className="htf-btn-hero-primary"
              onClick={onOpenOrderModal}
              data-node-id="675:221"
            >
              <span
                className="htf-btn-hero-primary__tri htf-btn-hero-primary__tri--left"
                data-node-id="675:224"
              >
                <img src={HERO_ASSETS.heroGiftArrowLeft} alt="" className="htf-svg-intrinsic" />
              </span>
              <span className="htf-btn-hero-primary__label" data-node-id="675:223">
                Đặt quà
              </span>
              <span
                className="htf-btn-hero-primary__tri htf-btn-hero-primary__tri--right"
                data-node-id="675:225"
              >
                <img src={HERO_ASSETS.heroGiftArrowRight} alt="" className="htf-svg-intrinsic" />
              </span>
            </button>
          </div>

          <div className="htf-hero__social-proof">
            <div className="htf-hero__avatars" data-node-id="1018:186">
              <img
                src={HERO_ASSETS.heroAvatar1}
                alt="Khách hàng"
                width={32}
                height={32}
                className="htf-hero__avatar"
                data-node-id="675:227"
              />
              <img
                src={HERO_ASSETS.heroAvatar2}
                alt="Khách hàng"
                width={32}
                height={32}
                className="htf-hero__avatar"
                data-node-id="675:228"
              />
              <img
                src={HERO_ASSETS.heroAvatar3}
                alt="Khách hàng"
                width={32}
                height={32}
                className="htf-hero__avatar"
                data-node-id="675:229"
              />
            </div>
            <p className="htf-hero__trust-text" data-node-id="675:216">
              1.000 + khách hàng tin chọn mỗi tháng
            </p>
          </div>
        </div>
      </div>

      <div className="htf-hero__dots" data-node-id="675:208">
        <img src={HERO_ASSETS.heroSliderDots} alt="" className="htf-svg-intrinsic" />
      </div>
    </section>
  );
};
