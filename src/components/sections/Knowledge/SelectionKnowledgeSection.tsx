import React from 'react';
import { PRESS_KNOWLEDGE_ASSETS } from '../../../constants/assets';
import {
  FEATURED_KNOWLEDGE_ARTICLE,
  SIDE_KNOWLEDGE_ARTICLES,
} from '../../../data/knowledgeData';
import { SectionHeader } from '../../common/SectionHeader';
import { FeaturedArticleCard } from './FeaturedArticleCard';
import { KnowledgeArticleCard } from './KnowledgeArticleCard';
import './Knowledge.css';

interface SelectionKnowledgeSectionProps {
  onReadArticle: (idOrTitle: string) => void;
  onOpenAllKnowledge: () => void;
}

/**
 * Khu vực "Kiến thức lựa chọn": gồm 1 bài nổi bật lớn bên trái & 2 bài ngang bên phải
 */
export const SelectionKnowledgeSection: React.FC<SelectionKnowledgeSectionProps> = ({
  onReadArticle,
  onOpenAllKnowledge,
}) => {
  return (
    <section className="htf-knowledge-section" id="kien-thuc" data-node-id="785:416">
      <div className="htf-knowledge-section__bg" aria-hidden="true">
        <img src={PRESS_KNOWLEDGE_ASSETS.knowledgeBg} alt="" className="htf-img-cover" />
      </div>

      <div className="htf-container htf-knowledge-section__inner">
        <SectionHeader
          title="Kiến thức lựa chọn"
          subtitle="Cung cấp thông tin giúp bạn lựa chọn trái cây chất lượng và an tâm khi sử dụng"
          titleNodeId="714:564"
          subtitleNodeId="714:563"
        />

        <div className="htf-knowledge-grid">
          <FeaturedArticleCard
            article={FEATURED_KNOWLEDGE_ARTICLE}
            onReadArticle={onReadArticle}
          />

          <div className="htf-knowledge-side">
            {SIDE_KNOWLEDGE_ARTICLES.map((article) => (
              <KnowledgeArticleCard
                key={article.id}
                article={article}
                onReadArticle={onReadArticle}
              />
            ))}
          </div>
        </div>

        <div className="htf-knowledge-more">
          <button
            type="button"
            className="htf-btn-all-knowledge"
            onClick={onOpenAllKnowledge}
            data-node-id="722:634"
          >
            <img
              src={PRESS_KNOWLEDGE_ASSETS.knowledgeBookIcon}
              alt=""
              className="htf-svg-intrinsic"
              data-node-id="777:400"
            />
            <span data-node-id="722:636">xem toàn bộ kiến thức</span>
          </button>
        </div>
      </div>
    </section>
  );
};
