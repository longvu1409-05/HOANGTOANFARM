import React, { useState } from 'react';
import { PRESS_KNOWLEDGE_ASSETS } from '../../../constants/assets';
import { FEATURED_PRESS_ARTICLES } from '../../../data/pressData';
import { CroppedImage } from '../../common/CroppedImage';

/**
 * Cụm Bento bất đối xứng phía trên mục Báo chí:
 * Gồm thẻ bài báo nổi bật bên trái + ảnh gian hàng cao ở giữa + 2 ảnh sự kiện bên phải
 */
export const PressFeaturedBento: React.FC = () => {
  const [articleIdx, setArticleIdx] = useState<number>(0);
  const current = FEATURED_PRESS_ARTICLES[articleIdx];

  const handlePrev = () => {
    setArticleIdx((prev) => (prev === 0 ? FEATURED_PRESS_ARTICLES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setArticleIdx((prev) => (prev === FEATURED_PRESS_ARTICLES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="htf-press-bento">
      <div className="htf-press-bento__story-col">
        <article className="htf-press-bento__story-card" data-node-id="899:271">
          <div className="htf-press-bento__story-inner">
            <h3 className="htf-press-bento__story-title" data-node-id="714:534">
              {current.title}
            </h3>
            <p className="htf-press-bento__story-excerpt" data-node-id="714:544">
              <span>{current.lead}</span>
              <strong>{current.brand}</strong>
              <span>{current.tail}</span>
            </p>
            <a href="#kien-thuc" className="htf-btn-read-green" data-node-id="714:555">
              <span data-node-id="714:556">Đọc chi tiết</span>
              <img
                src={PRESS_KNOWLEDGE_ASSETS.pressReadMoreWhiteArrow}
                alt=""
                className="htf-svg-intrinsic"
              />
            </a>
          </div>
        </article>

        <div className="htf-press-bento__nav" data-node-id="785:411">
          <img
            src={PRESS_KNOWLEDGE_ASSETS.pressNavButtons}
            alt=""
            className="htf-svg-intrinsic"
          />
          <button
            type="button"
            className="htf-press-bento__nav-hit htf-press-bento__nav-hit--prev"
            onClick={handlePrev}
            aria-label="Bài trước"
          />
          <button
            type="button"
            className="htf-press-bento__nav-hit htf-press-bento__nav-hit--next"
            onClick={handleNext}
            aria-label="Bài tiếp theo"
          />
        </div>
      </div>

      <div className="htf-press-bento__tall-photo" data-node-id="874:215">
        <div className="htf-press-bento__photo-clip">
          <CroppedImage
            src={PRESS_KNOWLEDGE_ASSETS.pressBentoCenter}
            alt="Gian hàng Hoàng Toàn Farm tại Diễn đàn Thương mại Điện tử 2026"
            crop={{
              width: '100%',
              height: '107.85%',
              left: '0%',
              top: '-3.92%',
            }}
          />
        </div>
      </div>

      <div className="htf-press-bento__side-photos">
        <div className="htf-press-bento__side-photo" data-node-id="874:213">
          <CroppedImage
            src={PRESS_KNOWLEDGE_ASSETS.pressBentoTopRight}
            alt="Khách tham quan trải nghiệm sản phẩm Hoàng Toàn Farm"
            className="htf-img-bottom"
          />
        </div>
        <div className="htf-press-bento__side-photo" data-node-id="874:214">
          <div className="htf-press-bento__photo-clip">
            <CroppedImage
              src={PRESS_KNOWLEDGE_ASSETS.pressBentoBottomRight}
              alt="Trưng bày sản phẩm vú sữa Hoàng Toàn Farm"
              crop={{
                width: '244.57%',
                height: '172.43%',
                left: '-56.66%',
                top: '-72.43%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
