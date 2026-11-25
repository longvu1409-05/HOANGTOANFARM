import React from 'react';
import { PRESS_KNOWLEDGE_ASSETS } from '../../../constants/assets';
import { KnowledgeArticleItem } from '../../../types/farm.types';
import { CroppedImage } from '../../common/CroppedImage';

interface FeaturedArticleCardProps {
  article: KnowledgeArticleItem;
}

/**
 * Thẻ bài viết lớn "BÀI NỔI BẬT" nằm bên trái mục Kiến thức lựa chọn
 */
export const FeaturedArticleCard: React.FC<FeaturedArticleCardProps> = ({ article }) => {
  return (
    <article className="htf-knowledge-featured" data-node-id={article.nodeId}>
      <div className="htf-knowledge-featured__img-wrap">
        <CroppedImage src={article.image} alt={article.title} crop={article.imageCrop} />
      </div>
      <div className="htf-knowledge-featured__gradient" data-node-id="721:579" />

      <div className="htf-knowledge-featured__badge" data-node-id="722:639">
        <img
          src={PRESS_KNOWLEDGE_ASSETS.featuredStarIcon}
          alt=""
          className="htf-svg-intrinsic"
          data-node-id="722:640"
        />
        <span data-node-id="722:641">bài nổi bật</span>
      </div>

      <div className="htf-knowledge-featured__body">
        <h3 className="htf-knowledge-featured__title" data-node-id="721:580">
          {article.title}
        </h3>
        <p className="htf-knowledge-featured__excerpt" data-node-id="722:585">
          {article.excerpt}
        </p>
        <a href="#kien-thuc" className="htf-btn-read-cream" data-node-id="755:373">
          <span data-node-id="755:375">Đọc chi tiết</span>
          <img
            src={PRESS_KNOWLEDGE_ASSETS.readMoreGreenArrow}
            alt=""
            className="htf-svg-intrinsic"
          />
        </a>
      </div>
    </article>
  );
};
