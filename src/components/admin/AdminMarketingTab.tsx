import React, { useState } from 'react';
import { createKnowledgeArticle, KnowledgeArticleDto } from '../../services/contentApi';
import {
  broadcastNewsletter,
  deleteSubscriber,
  SubscriberDto,
} from '../../services/newsletterApi';
import { ImageUploaderField } from './ImageUploaderField';

interface AdminMarketingTabProps {
  subscribers: SubscriberDto[];
  articles: KnowledgeArticleDto[];
  onReload: () => Promise<void>;
  onNotify: (msg: string) => void;
}

/**
 * Tab Quản lý Chiến dịch Bản tin Email (gửi ưu đãi hàng loạt) & Đăng bài Kiến thức
 */
export const AdminMarketingTab: React.FC<AdminMarketingTabProps> = ({
  subscribers,
  articles,
  onReload,
  onNotify,
}) => {
  // State đăng bài Kiến thức
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState('imgRectangle222.png');
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [saving, setSaving] = useState(false);

  // State gửi Chiến dịch Email khuyến mãi hàng loạt
  const [campSubject, setCampSubject] = useState(
    'Vú sữa Hoàng Kim chín rộ đầu mùa – Ưu đãi đặc biệt tuần này!'
  );
  const [campPromo, setCampPromo] = useState('VUSUA15');
  const [campBody, setCampBody] = useState(
    'Hoàng Toàn Farm vừa thu hoạch đợt vú sữa Hoàng Kim HK-2 quả to 450–550g ngọt đậm tại vườn Điện Biên.\nNhập mã ưu đãi bên dưới khi đặt quà trên website để được giảm ngay 15%!'
  );
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createKnowledgeArticle({
        title,
        excerpt,
        content,
        imageFile,
        notifySubscribers,
      });
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

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribers.length === 0) {
      onNotify('Chưa có email khách hàng nào trong danh sách nhận tin.');
      return;
    }
    setSendingBroadcast(true);
    try {
      const res = await broadcastNewsletter({
        subject: campSubject,
        content: campBody,
        promoCode: campPromo,
      });
      onNotify(
        res.message || `Đã gửi bản tin tới ${res.data.sentCount}/${res.data.total} khách hàng!`
      );
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Gửi bản tin thất bại.');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleDeleteSub = async (sub: SubscriberDto) => {
    if (!window.confirm(`Xóa "${sub.email}" khỏi danh sách nhận tin?`)) return;
    try {
      await deleteSubscriber(sub.id);
      onNotify(`Đã xóa ${sub.email}.`);
      await onReload();
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Không xóa được email.');
    }
  };

  return (
    <div className="htf-admin__split">
      {/* Cột trái: Đăng bài Kiến thức lựa chọn */}
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
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung hướng dẫn chi tiết cho khách hàng..."
              required
            />
          </label>

          <label className="htf-admin__checkbox">
            <input
              type="checkbox"
              checked={notifySubscribers}
              onChange={(e) => setNotifySubscribers(e.target.checked)}
            />
            <span>Gửi luôn email thông báo bài mới tới {subscribers.length} người đăng ký</span>
          </label>

          <button type="submit" className="htf-admin__btn-primary" disabled={saving}>
            {saving ? 'Đang đăng...' : '+ Đăng bài viết'}
          </button>
        </form>

        <h3 style={{ marginTop: 20, fontSize: 15 }}>Bài viết hiện có ({articles.length})</h3>
        <ul className="htf-admin__subs">
          {articles.map((art) => (
            <li key={art.id}>
              <span>{art.title}</span>
              <small>{art.is_featured ? '★ Nổi bật' : 'Bài viết'}</small>
            </li>
          ))}
        </ul>
      </section>

      {/* Cột phải: Gửi Chiến dịch Email Ưu đãi & Quản lý người đăng ký */}
      <div className="htf-admin__stack">
        <section className="htf-admin__panel">
          <h2>Gửi Email Khuyến mãi tới khách đăng ký ({subscribers.length})</h2>
          <p className="htf-admin__note" style={{ marginTop: 4 }}>
            Khách mới đăng ký ở chân trang đã tự động nhận Email chào mừng kèm mã <strong>HTF10</strong> (-10%).
            Tại đây bạn có thể gửi đợt ưu đãi mới tới toàn bộ danh sách bất cứ lúc nào.
          </p>

          <form className="htf-admin__form" onSubmit={handleSendCampaign}>
            <label>
              Tiêu đề Email gửi khách *
              <input
                type="text"
                value={campSubject}
                onChange={(e) => setCampSubject(e.target.value)}
                required
              />
            </label>

            <label>
              Mã ưu đãi đính kèm (HTF10 = giảm 10%, VUSUA15 = giảm 15%)
              <input
                type="text"
                value={campPromo}
                onChange={(e) => setCampPromo(e.target.value)}
                placeholder="HTF10 hoặc VUSUA15 (để trống nếu không kèm mã)"
              />
            </label>

            <label>
              Nội dung thông báo *
              <textarea
                rows={4}
                value={campBody}
                onChange={(e) => setCampBody(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="htf-admin__btn-primary"
              disabled={sendingBroadcast || subscribers.length === 0}
            >
              {sendingBroadcast
                ? 'Đang gửi email hàng loạt...'
                : `📨 Gửi ngay tới ${subscribers.length} email đăng ký`}
            </button>
          </form>
        </section>

        <section className="htf-admin__panel">
          <h2>Danh sách Email nhận ưu đãi ({subscribers.length})</h2>
          {subscribers.length === 0 ? (
            <p className="htf-admin__empty">
              Chưa có khách nào đăng ký. Hãy điền thử email ở chân trang chủ để nhận thư chào mừng!
            </p>
          ) : (
            <ul className="htf-admin__subs">
              {subscribers.map((sub) => (
                <li key={sub.id}>
                  <div>
                    <strong>{sub.email}</strong>
                    <div className="htf-admin__note">{sub.created_at}</div>
                  </div>
                  <button
                    type="button"
                    className="htf-admin__btn-danger"
                    onClick={() => handleDeleteSub(sub)}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
