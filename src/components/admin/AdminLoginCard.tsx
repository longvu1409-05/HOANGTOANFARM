import React, { useState } from 'react';
import { HEADER_ASSETS } from '../../constants/assets';
import { AdminSessionDto, loginAdmin } from '../../services/authApi';

interface AdminLoginCardProps {
  onLoginSuccess: (session: AdminSessionDto) => void;
}

/**
 * Màn hình đăng nhập bảo mật trước khi vào trang Quản trị Hoàng Toàn Farm (?admin=1)
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
    <div className="htf-admin htf-admin--login">
      <div className="htf-admin-login">
        <div className="htf-admin-login__logo">
          <img src={HEADER_ASSETS.headerLogo} alt="Hoàng Toàn Farm" />
        </div>
        <h1 className="htf-admin-login__title">Đăng nhập Quản trị</h1>
        <p className="htf-admin-login__sub">
          Khu vực dành riêng cho Quản trị viên Hoàng Toàn Farm
        </p>

        <form className="htf-admin__form" onSubmit={handleSubmit}>
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
            <div className="htf-admin-login__pass-wrap">
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
                className="htf-admin-login__eye"
                onClick={() => setShowPass((prev) => !prev)}
              >
                {showPass ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </label>

          {errorMsg && <div className="htf-admin__error">{errorMsg}</div>}

          <button type="submit" className="htf-admin__btn-primary" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
          </button>
        </form>

        <a href="./" className="htf-admin-login__home-link">
          ← Quay về trang chủ cửa hàng
        </a>
      </div>
    </div>
  );
};
