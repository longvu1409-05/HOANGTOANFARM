import React from 'react';
import './Modals.css';

interface ToastNotificationProps {
  message: string | null;
}

/**
 * Hộp thông báo nhỏ hiển thị ở góc phải dưới màn hình khi đặt hàng / đăng ký thành công
 */
export const ToastNotification: React.FC<ToastNotificationProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="htf-toast" role="status">
      {message}
    </div>
  );
};
