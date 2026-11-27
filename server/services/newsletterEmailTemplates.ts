function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Mẫu Email Chào mừng gửi ngay lập tức khi khách điền email vào ô "ĐĂNG KÝ NHẬN TIN"
 */
export function buildNewsletterWelcomeEmail(email: string, siteUrl: string) {
  return {
    subject: '[Hoàng Toàn Farm] Chào mừng bạn – Tặng mã ưu đãi 10% (HTF10)',
    html: `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f7f2;padding:24px 12px;color:#1b2e1b;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;border:2px solid #2d5e29;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1b3b1a,#32602e);padding:24px;color:#f7e49c;text-align:center;">
          <div style="font-size:12.5px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Hoàng Toàn Farm · Vườn sạch Trái ngọt</div>
          <h2 style="margin:8px 0 0;font-size:22px;color:#ffffff;">Cảm ơn bạn đã đăng ký nhận tin!</h2>
        </div>

        <div style="padding:24px;line-height:1.6;font-size:14.5px;color:#2c3e2d;">
          <p style="margin:0 0 12px;">Xin chào <strong>${escapeHtml(email)}</strong>,</p>
          <p style="margin:0 0 18px;">
            Từ nay bạn sẽ là người đầu tiên nhận thông báo khi <strong>Vú sữa Hoàng Kim HK-2</strong> chín rộ tại vườn cùng các chương trình ưu đãi giỏ quà theo mùa của Hoàng Toàn Farm.
          </p>

          <div style="background:#f6faf5;border:1.5px dashed #2d5e29;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px;">
            <div style="font-size:12px;color:#4f6450;text-transform:uppercase;">Quà tặng dành riêng cho thành viên mới</div>
            <div style="font-size:26px;font-weight:800;color:#1b3b1a;letter-spacing:2px;margin:6px 0;">HTF10</div>
            <div style="font-size:13.5px;color:#2d5e29;font-weight:600;">
              Giảm ngay 10% khi nhập mã này lúc Đặt quà trên website!
            </div>
          </div>

          <div style="text-align:center;margin:20px 0 6px;">
            <a href="${siteUrl}/#san-pham" style="display:inline-block;padding:12px 26px;border-radius:999px;background:#2d5e29;color:#f7e49c;text-decoration:none;font-weight:700;font-size:14px;">
              Khám phá trái cây tươi &amp; Áp mã ngay →
            </a>
          </div>
        </div>

        <div style="background:#eef4ed;padding:12px 20px;text-align:center;font-size:12px;color:#4f6450;">
          Hotline tư vấn: <strong>0989.604.818 - 0979.784.149</strong> · HTX Mường Khoe Xanh
        </div>
      </div>
    </div>`,
  };
}

/**
 * Mẫu Email Chiến dịch Bản tin / Khuyến mãi gửi hàng loạt từ trang Admin
 */
export function buildNewsletterCampaignEmail(params: {
  subject: string;
  content: string;
  promoCode?: string;
  ctaUrl: string;
}) {
  const paragraphs = params.content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p style="margin:0 0 12px;">${escapeHtml(line)}</p>`)
    .join('');

  const promoBlock = params.promoCode?.trim()
    ? `
      <div style="background:#f6faf5;border:1.5px dashed #2d5e29;border-radius:12px;padding:14px;text-align:center;margin:18px 0;">
        <div style="font-size:12px;color:#4f6450;text-transform:uppercase;">Mã ưu đãi áp dụng trên website</div>
        <div style="font-size:24px;font-weight:800;color:#1b3b1a;letter-spacing:1.5px;margin-top:4px;">
          ${escapeHtml(params.promoCode.trim().toUpperCase())}
        </div>
      </div>`
    : '';

  return {
    subject: `[Hoàng Toàn Farm] ${params.subject.trim()}`,
    html: `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f7f2;padding:24px 12px;color:#1b2e1b;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;border:2px solid #2d5e29;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1b3b1a,#32602e);padding:22px 24px;color:#f7e49c;text-align:center;">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Bản tin Hoàng Toàn Farm</div>
          <h2 style="margin:8px 0 0;font-size:21px;color:#ffffff;">${escapeHtml(params.subject.trim())}</h2>
        </div>

        <div style="padding:24px;line-height:1.6;font-size:14.5px;color:#2c3e2d;">
          ${paragraphs}
          ${promoBlock}
          <div style="text-align:center;margin:22px 0 6px;">
            <a href="${params.ctaUrl}" style="display:inline-block;padding:12px 26px;border-radius:999px;background:#2d5e29;color:#f7e49c;text-decoration:none;font-weight:700;font-size:14px;">
              Đặt trái cây tươi tại vườn →
            </a>
          </div>
        </div>

        <div style="background:#eef4ed;padding:12px 20px;text-align:center;font-size:12px;color:#4f6450;">
          Hoàng Toàn Farm · Hotline: <strong>0989.604.818 - 0979.784.149</strong>
        </div>
      </div>
    </div>`,
  };
}
