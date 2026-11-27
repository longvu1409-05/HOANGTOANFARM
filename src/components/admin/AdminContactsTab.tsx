import React from 'react';
import { ContactDto, updateContactStatus } from '../../services/contactApi';
import { ReviewDto } from '../../services/contentApi';

interface AdminContactsTabProps {
  contacts: ContactDto[];
  reviews: ReviewDto[];
  onReload: () => Promise<void>;
  onNotify: (msg: string) => void;
}

/**
 * Tab Quản lý Yêu cầu Liên hệ & Đánh giá khách hàng
 */
export const AdminContactsTab: React.FC<AdminContactsTabProps> = ({
  contacts,
  reviews,
  onReload,
  onNotify,
}) => {
  const handleToggleContact = async (item: ContactDto) => {
    const next = item.status === 'new' ? 'replied' : 'new';
    await updateContactStatus(item.id, next);
    onNotify('Đã cập nhật trạng thái liên hệ.');
    await onReload();
  };

  return (
    <div className="htf-admin__stack">
      <section className="htf-admin__panel">
        <h2>Yêu cầu liên hệ &amp; tư vấn ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <p className="htf-admin__empty">Chưa có tin nhắn liên hệ nào.</p>
        ) : (
          <div className="htf-admin__table-wrap">
            <table className="htf-admin__table">
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Chủ đề</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.full_name}</strong>
                      <small>{c.phone}</small>
                      {c.email && <div className="htf-admin__note">{c.email}</div>}
                    </td>
                    <td>{c.subject}</td>
                    <td>{c.message}</td>
                    <td>
                      <button
                        type="button"
                        className={c.status === 'replied' ? 'htf-admin__btn-light' : 'htf-admin__btn-sm'}
                        onClick={() => handleToggleContact(c)}
                      >
                        {c.status === 'replied' ? '✓ Đã phản hồi' : 'Đánh dấu đã gọi'}
                      </button>
                    </td>
                    <td>{c.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="htf-admin__panel">
        <h2>Đánh giá của khách hàng ({reviews.length})</h2>
        <ul className="htf-admin__subs">
          {reviews.map((rev) => (
            <li key={rev.id}>
              <div>
                <strong>{rev.author}</strong> ({rev.rating}★)
                <div className="htf-admin__note">{rev.quote}</div>
              </div>
              <small>{rev.created_at}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
