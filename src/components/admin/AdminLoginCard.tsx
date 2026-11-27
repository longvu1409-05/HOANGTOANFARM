import React, { useState } from 'react';
import { AdminSessionDto, loginAdmin } from '../../services/authApi';

interface AdminLoginCardProps {
  onLoginSuccess: (session: AdminSessionDto) => void;
}

/**
 * Màn hình Đăng nhập Quản trị E-Shop hiện đại
 */
export const AdminLoginCard: React.FC<AdminLoginCardProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const session = await loginAdmin(username.trim(), password);
      onLoginSuccess(session);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="htf-adm-login-page">
      <div className="htf-adm-login-card">
        <div className="htf-adm-login-card__badge">
          <div className="htf-adm-brand__ring">
            <div className="htf-adm-brand__ring-inner">HT</div>
          </div>
        </div>
        <h1 className="htf-adm-login-card__title">Hoàng Toàn Admin</h1>
        <p className="htf-adm-login-card__sub">
          Đăng nhập hệ thống quản trị E-Shop &amp; Supabase Cloud
        </p>

        <form className="htf-admin__form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleSubmit}>
          <label>
            Tài khoản Quản trị
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Mật khẩu
            <div className="htf-adm-login-card__pass">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="htf-adm-login-card__eye"
                onClick={() => setShowPass((prev) => !prev)}
              >
                {showPass ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </label>

          {errorMsg && <div className="htf-admin__error">{errorMsg}</div>}

          <button type="submit" className="htf-admin__btn-primary" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
          </button>
        </form>

        <a href="./" className="htf-adm-login-card__back">
          ← Quay về trang chủ cửa hàng
        </a>
      </div>
    </div>
  );
};
