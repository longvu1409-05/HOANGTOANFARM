import React, { useState } from 'react';
import { PARTNER_FOOTER_ASSETS } from '../../../constants/assets';
import { FOOTER_ABOUT_LINKS, FOOTER_SUPPORT_LINKS } from '../../../data/footerData';
import { CroppedImage } from '../../common/CroppedImage';

interface FooterMainProps {
  onSubscribed: (email: string) => Promise<void>;
  onOpenContact: () => void;
  onOpenOrderLookup: () => void;
  onOpenStory: () => void;
}

/**
 * Khối chân trang nền xanh đậm 5 cột + thanh bản quyền & huy hiệu chứng nhận
 */
export const FooterMain: React.FC<FooterMainProps> = ({
  onSubscribed,
  onOpenContact,
  onOpenOrderLookup,
  onOpenStory,
}) => {
  const [email, setEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubscribed(email.trim());
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="htf-footer" data-node-id="511:394">
      <div className="htf-container">
        <div className="htf-footer__grid">
          {/* Cột 1: Giới thiệu thương hiệu */}
          <div className="htf-footer__brand">
            <a href="#trang-chu" className="htf-footer__logo" data-node-id="511:434">
              <img
                src={PARTNER_FOOTER_ASSETS.footerLogo}
                alt="Hoàng Toàn Farm"
                className="htf-svg-intrinsic"
              />
            </a>
            <p className="htf-footer__desc" data-node-id="511:416">
              <strong>Hoàng Toàn Farm</strong> là thương hiệu thuộc Công ty Cổ phần Đầu tư Rau Quả
              Việt Nam, với sản phẩm được tuyển chọn từ các vùng trồng liên kết, trong đó vùng chính
              tại HTX Dịch vụ Nông nghiệp Mường Khoe Xanh, được kiểm soát chất lượng và nguồn gốc rõ
              ràng trước khi đến tay khách hàng.
            </p>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div className="htf-footer__col">
            <h3 className="htf-footer__heading htf-gold-text" data-node-id="511:399">
              về chúng tôi
            </h3>
            <ul className="htf-footer__links" data-node-id="511:402">
              {FOOTER_ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.label === 'Liên hệ' ? (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenContact();
                      }}
                    >
                      {link.label}
                    </a>
                  ) : link.label === 'Câu chuyện thương hiệu' ? (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenStory();
                      }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="htf-footer__col">
            <h3 className="htf-footer__heading htf-gold-text" data-node-id="511:401">
              Hỗ trợ khách hàng
            </h3>
            <ul className="htf-footer__links" data-node-id="511:403">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.label === 'Giao hàng & Thanh toán' ? (
                    <a
                      href="#tra-cuu"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenOrderLookup();
                      }}
                    >
                      Tra cứu đơn hàng
                    </a>
                  ) : link.label === 'Đổi trả sản phẩm' ? (
                    <a
                      href="#lien-he"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenContact();
                      }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ */}
          <div className="htf-footer__col">
            <h3 className="htf-footer__heading htf-gold-text" data-node-id="511:400">
              Thông tin liên hệ
            </h3>
            <ul className="htf-footer__contacts" data-node-id="666:108">
              <li data-node-id="511:421">
                <span className="htf-footer__contact-icon">
                  <img
                    src={PARTNER_FOOTER_ASSETS.footerContactPhone}
                    alt=""
                    className="htf-svg-intrinsic"
                  />
                </span>
                <a href="tel:0979784149" data-node-id="511:424">
                  0979.784.149 - 0989.604.818
                </a>
              </li>
              <li data-node-id="511:464">
                <span className="htf-footer__contact-icon">
                  <img
                    src={PARTNER_FOOTER_ASSETS.footerContactLocation}
                    alt=""
                    className="htf-svg-intrinsic"
                  />
                </span>
                <span data-node-id="511:467">
                  Căn NT08-151, khu đô thị Vinhomes Ocean Park, xã Gia Lâm, Hà Nội
                </span>
              </li>
              <li data-node-id="511:459">
                <span className="htf-footer__contact-icon">
                  <img
                    src={PARTNER_FOOTER_ASSETS.footerContactMail}
                    alt=""
                    className="htf-svg-intrinsic"
                  />
                </span>
                <a href="mailto:hoangtoanfarm@gmail.com" data-node-id="511:462">
                  hoangtoanfarm@gmail.com
                </a>
              </li>
              <li data-node-id="511:470">
                <span className="htf-footer__contact-icon">
                  <img
                    src={PARTNER_FOOTER_ASSETS.footerContactClock}
                    alt=""
                    className="htf-svg-intrinsic"
                  />
                </span>
                <span data-node-id="511:473">Thứ 2 - Chủ nhật (08h00 - 20h00)</span>
              </li>
            </ul>
          </div>

          {/* Cột 5: Đăng ký nhận tin & Mạng xã hội */}
          <div className="htf-footer__col">
            <h3 className="htf-footer__heading htf-gold-text" data-node-id="511:479">
              đăng ký nhận tin
            </h3>
            <p className="htf-footer__news-desc" data-node-id="511:480">
              Nhận ưu đãi và thông tin mới nhất từ Hoàng Toàn Famr
            </p>

            <form className="htf-newsletter-form" onSubmit={handleSubmit} data-node-id="511:476">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="htf-newsletter-form__input"
                aria-label="Nhập email của bạn"
                required
              />
              <button
                type="submit"
                className="htf-newsletter-form__submit"
                aria-label="Gửi đăng ký"
                data-node-id="511:482"
              >
                <img
                  src={PARTNER_FOOTER_ASSETS.footerSendPlane}
                  alt=""
                  className="htf-svg-intrinsic"
                />
              </button>
            </form>

            <div className="htf-footer__socials" data-node-id="666:85">
              <a href="#lien-he" aria-label="Facebook" data-node-id="511:405">
                <img
                  src={PARTNER_FOOTER_ASSETS.footerSocialFb}
                  alt=""
                  className="htf-svg-intrinsic"
                />
              </a>
              <a href="#lien-he" aria-label="TikTok" data-node-id="511:408">
                <img
                  src={PARTNER_FOOTER_ASSETS.footerSocialTiktok}
                  alt=""
                  className="htf-svg-intrinsic"
                />
              </a>
              <a href="#lien-he" aria-label="YouTube" data-node-id="511:411">
                <img
                  src={PARTNER_FOOTER_ASSETS.footerSocialYoutube}
                  alt=""
                  className="htf-svg-intrinsic"
                />
              </a>
              <a href="tel:0989604818" aria-label="Điện thoại" data-node-id="666:80">
                <img
                  src={PARTNER_FOOTER_ASSETS.footerSocialPhone}
                  alt=""
                  className="htf-svg-intrinsic"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="htf-footer__divider" data-node-id="511:477">
          <img src={PARTNER_FOOTER_ASSETS.footerDividerLine} alt="" className="htf-line-svg" />
        </div>

        <div className="htf-footer__bottom">
          <p className="htf-footer__copyright" data-node-id="511:484">
            © 2026 Hoàng Toàn Farm. All rights reserved. Designed by Vicogroup.vn ·{' '}
            <a href="?admin=1" style={{ textDecoration: 'underline', opacity: 0.9 }}>
              Quản trị
            </a>
          </p>

          <div className="htf-footer__certs">
            <div className="htf-cert-vietgap" data-node-id="515:100">
              <CroppedImage
                src={PARTNER_FOOTER_ASSETS.badgeVietGap}
                alt="Chứng nhận VietGAP"
                crop={{
                  width: '107.38%',
                  height: '107.38%',
                  left: '-3.69%',
                  top: '-3.69%',
                }}
              />
            </div>

            <div className="htf-cert-ocop" data-node-id="542:108">
              <div className="htf-cert-ocop__clip" data-node-id="542:104">
                <CroppedImage
                  src={PARTNER_FOOTER_ASSETS.badgeOcop}
                  alt="Chứng nhận OCOP"
                  crop={{
                    width: '167.56%',
                    height: '149.14%',
                    left: '-30.71%',
                    top: '-23.6%',
                  }}
                />
              </div>
            </div>

            <div className="htf-cert-iso" data-node-id="539:86">
              <CroppedImage src={PARTNER_FOOTER_ASSETS.badgeIso} alt="Chứng nhận ISO" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
