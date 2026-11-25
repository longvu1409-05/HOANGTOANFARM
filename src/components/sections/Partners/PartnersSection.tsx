import React, { useState } from 'react';
import { PARTNER_FOOTER_ASSETS } from '../../../constants/assets';
import { PARTNER_LOGOS } from '../../../data/partnersData';
import { SectionHeader } from '../../common/SectionHeader';
import { PartnerLogoCard } from './PartnerLogoCard';
import './Partners.css';

/**
 * Khu vực "Đối tác phân phối": thanh trượt 6 logo đối tác có nút chuyển trái/phải
 */
export const PartnersSection: React.FC = () => {
  const [offset, setOffset] = useState<number>(0);

  const visiblePartners = PARTNER_LOGOS.map(
    (_, idx) => PARTNER_LOGOS[(idx + offset) % PARTNER_LOGOS.length]
  );

  const handlePrev = () => {
    setOffset((prev) => (prev - 1 + PARTNER_LOGOS.length) % PARTNER_LOGOS.length);
  };

  const handleNext = () => {
    setOffset((prev) => (prev + 1) % PARTNER_LOGOS.length);
  };

  return (
    <section className="htf-partners-section">
      <div className="htf-container">
        <SectionHeader title="Đối tác phân phối" titleNodeId="722:676" />
      </div>

      <div className="htf-partners-carousel">
        <button
          type="button"
          className="htf-partners-arrow htf-partners-arrow--prev"
          onClick={handlePrev}
          aria-label="Đối tác trước"
          data-node-id="785:412"
        >
          <img
            src={PARTNER_FOOTER_ASSETS.partnerPrevCircle}
            alt=""
            className="htf-svg-intrinsic htf-partners-arrow__bg"
          />
          <img
            src={PARTNER_FOOTER_ASSETS.partnerPrevChevron}
            alt=""
            className="htf-svg-intrinsic htf-partners-arrow__icon htf-flip-x"
            data-node-id="785:413"
          />
        </button>

        <div className="htf-partners-track" data-node-id="722:714">
          {visiblePartners.map((partner, idx) => (
            <PartnerLogoCard key={`${partner.id}-${idx}`} partner={partner} />
          ))}
        </div>

        <button
          type="button"
          className="htf-partners-arrow htf-partners-arrow--next"
          onClick={handleNext}
          aria-label="Đối tác tiếp theo"
          data-node-id="785:414"
        >
          <img
            src={PARTNER_FOOTER_ASSETS.partnerNextCircle}
            alt=""
            className="htf-svg-intrinsic htf-partners-arrow__bg"
          />
          <img
            src={PARTNER_FOOTER_ASSETS.partnerNextChevron}
            alt=""
            className="htf-svg-intrinsic htf-partners-arrow__icon"
            data-node-id="785:415"
          />
        </button>
      </div>

      <div className="htf-partners-dots" data-node-id="722:685">
        <img src={PARTNER_FOOTER_ASSETS.partnerDots} alt="" className="htf-svg-intrinsic" />
      </div>
    </section>
  );
};
