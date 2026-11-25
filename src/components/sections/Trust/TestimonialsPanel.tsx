import React from 'react';
import { TRUST_ASSETS } from '../../../constants/assets';
import { TESTIMONIALS } from '../../../data/trustData';

/**
 * Bảng bên phải: "Khách hàng nói về chúng tôi" (danh sách cảm nhận 5 sao)
 */
export const TestimonialsPanel: React.FC = () => {
  return (
    <div className="htf-reviews-panel" data-node-id="505:135">
      <h2 className="htf-panel-title htf-green-grad-text" data-node-id="505:136">
        Khách hàng nói về chúng tôi
      </h2>

      <div className="htf-reviews-list">
        {TESTIMONIALS.map((review) => (
          <article key={review.id} className="htf-review-card" data-node-id={review.nodeId}>
            <div className="htf-review-card__body">
              <p className="htf-review-card__quote">{review.quote}</p>
              <div className="htf-review-card__stars">
                <img
                  src={TRUST_ASSETS.testimonialStars}
                  alt="5 sao"
                  className="htf-svg-intrinsic"
                />
              </div>
              <p className="htf-review-card__author">{review.author}</p>
            </div>

            <div className="htf-review-card__avatar-wrap">
              <img
                src={review.avatar}
                alt={review.author}
                width={92}
                height={92}
                className="htf-review-card__avatar"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="htf-reviews-dots" data-node-id="542:113">
        <img src={TRUST_ASSETS.testimonialDots} alt="" className="htf-svg-intrinsic" />
      </div>
    </div>
  );
};
