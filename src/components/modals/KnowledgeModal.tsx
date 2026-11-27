import React from 'react';
import { KnowledgeArticleDto } from '../../services/contentApi';
import './Modals.css';

interface KnowledgeModalProps {
  article: KnowledgeArticleDto | null;
  articles: KnowledgeArticleDto[];
  showAll: boolean;
  onSelectArticle: (article: KnowledgeArticleDto | null) => void;
  onClose: () => void;
}

/**
 * Popup đọc chi tiết bài viết hoặc xem toàn bộ chuyên mục Kiến thức lựa chọn
 */
export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  article,
  articles,
  showAll,
  onSelectArticle,
  onClose,
}) => {
  if (!article && !showAll) return null;

  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal htf-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        {article ? (
          <>
            <div className="htf-modal__media">
              <img
                src={`./assets/figma/${article.image_file}`}
                alt={article.title}
                className="htf-img-cover"
              />
            </div>
            <span className="htf-badge-pill">Kiến thức lựa chọn Hoàng Toàn Farm</span>
            <h3 className="htf-modal__title htf-green-grad-text">{article.title}</h3>
            <p className="htf-modal__sub">{article.excerpt}</p>
            <p className="htf-modal__detail">{article.content}</p>
            {articles.length > 1 && (
              <div className="htf-modal__footer-actions">
                <button
                  type="button"
                  className="htf-modal__btn-outline"
                  onClick={() => onSelectArticle(null)}
                >
                  ← Xem tất cả bài viết ({articles.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="htf-modal__title htf-green-grad-text">
              Thư viện Kiến thức lựa chọn ({articles.length} bài viết)
            </h3>
            <p className="htf-modal__sub">
              Kinh nghiệm chọn trái cây chuẩn vị tự nhiên, bảo quản và thưởng thức đúng cách.
            </p>
            <div className="htf-knowledge-modal-list">
              {articles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="htf-knowledge-modal-item"
                  onClick={() => onSelectArticle(item)}
                >
                  <img
                    src={`./assets/figma/${item.image_file}`}
                    alt={item.title}
                    className="htf-knowledge-modal-item__img"
                  />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.excerpt}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
