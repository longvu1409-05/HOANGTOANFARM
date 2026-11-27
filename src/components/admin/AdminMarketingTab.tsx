import React, { useState } from 'react';
import { createKnowledgeArticle, KnowledgeArticleDto } from '../../services/contentApi';
import { SubscriberDto } from '../../services/newsletterApi';
import { ImageUploaderField } from './ImageUploaderField';

interface AdminMarketingTabProps {
  subscribers: SubscriberDto[];
  articles: KnowledgeArticleDto[];
  onReload: () => Promise<void>;
  onNotify: (msg: string) => void;
}

/**
 * Tab Quản lý Email nhận tin & Đăng bài Kiến thức lựa chọn (hỗ trợ tải ảnh bài viết lên Supabase)
 */
export const AdminMarketingTab: React.FC<AdminMarketingTabProps> = ({
  subscribers,
  articles,
  onReload,
  onNotify,
}) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState('imgRectangle222.png');
  const [saving, setSaving] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createKnowledgeArticle({ title, excerpt, content, imageFile });
      onNotify(res.message || 'Đã đăng bài viết mới.');
      setTitle('');
      setExcerpt('');
      setContent('');
      setImageFile('imgRectangle222.png');
      await onReload();
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Không thể đăng bài viết.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="htf-admin__split">
      <section className="htf-admin__panel">
        <h2>Đăng bài Kiến thức mới</h2>
        <form className="htf-admin__form" onSubmit={handlePublish}>
          <label>
            Tiêu đề bài viết *
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bí quyết bảo quản vú sữa Hoàng Kim tươi lâu"
              required
            />
          </label>
          <label>
            Mô tả ngắn *
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Tóm tắt nội dung hiển thị trên thẻ bài viết..."
              required
            />
          </label>

          <ImageUploaderField
            value={imageFile}
            onChange={setImageFile}
            onNotify={onNotify}
            label="Ảnh bìa bài viết"
          />

          <label>
            Nội dung chi tiết *
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung hướng dẫn chi tiết cho khách hàng..."
              required
            />
          </label>
          <button type="submit" className="htf-admin__btn-primary" disabled={saving}>
            {saving ? 'Đang đăng...' : '+ Đăng bài viết'}
          </button>
        </form>

        <h3 style={{ marginTop: 18, fontSize: 15 }}>Bài viết hiện có ({articles.length})</h3>
        <ul className="htf-admin__subs">
          {articles.map((art) => (
            <li key={art.id}>
              <span>{art.title}</span>
              <small>{art.is_featured ? 'Nổi bật' : 'Thường'}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="htf-admin__panel">
        <h2>Email đăng ký nhận ưu đãi ({subscribers.length})</h2>
        {subscribers.length === 0 ? (
          <p className="htf-admin__empty">Chưa có email đăng ký.</p>
        ) : (
          <ul className="htf-admin__subs">
            {subscribers.map((sub) => (
              <li key={sub.id}>
                <span>{sub.email}</span>
                <small>{sub.created_at}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
