import React from 'react';
import { PRESS_KNOWLEDGE_ASSETS } from '../../../constants/assets';
import { KnowledgeArticleItem } from '../../../types/farm.types';
import { CroppedImage } from '../../common/CroppedImage';

interface KnowledgeArticleCardProps {
  article: KnowledgeArticleItem;
  onReadArticle: (idOrTitle: string) => void;
}

/**
 * Thẻ bài viết ngang nền xanh đậm bên phải mục Kiến thức lựa chọn
 */
export const KnowledgeArticleCard: React.FC<KnowledgeArticleCardProps> = ({
  article,
  onReadArticle,
}) => {
  return (
    <article className="htf-knowledge-card" data-node-id={article.nodeId}>
      <div className="htf-knowledge-card__thumb">
        <CroppedImage src={article.image} alt={article.title} crop={article.imageCrop} />
      </div>

      <div className="htf-knowledge-card__content">
        <h3 className="htf-knowledge-card__title">{article.title}</h3>
        <p className="htf-knowledge-card__excerpt">{article.excerpt}</p>
        <button
          type="button"
          className="htf-btn-read-cream"
          onClick={() => onReadArticle(article.id)}
        >
          <span>Đọc chi tiết</span>
          <img
            src={PRESS_KNOWLEDGE_ASSETS.readMoreGreenArrow}
            alt=""
            className="htf-svg-intrinsic"
          />
        </button>
      </div>
    </article>
  );
};
