import { OrderRecord, OrderStatus } from '../types/backend.types.js';
import { formatVnd } from '../utils/formatters.js';

const STATUS_INFO: Record<OrderStatus, { badge: string; color: string; description: string }> = {
  pending: {
    badge: 'Chờ xác nhận',
    color: '#92400e',
    description:
      'Hoàng Toàn Farm đã tiếp nhận đơn đặt quà của bạn và sẽ liên hệ xác nhận trong thời gian sớm nhất.',
  },
  confirmed: {
    badge: 'Đã xác nhận',
    color: '#1e40af',
    description:
      'Đơn hàng của bạn đã được xác nhận! Đội ngũ tại vườn đang tuyển chọn và đóng gói trái cây tươi chuẩn VietGAP.',
  },
  shipping: {
    badge: 'Đang giao hàng',
    color: '#0f766e',
    description:
      'Đơn quà trái cây tươi của bạn đã xuất kho và đang trên đường giao tới địa chỉ nhận hàng. Vui lòng để ý điện thoại nhé!',
  },
  completed: {
    badge: 'Giao thành công',
    color: '#166534',
    description:
      'Đơn hàng đã được giao thành công. Cảm ơn bạn đã tin chọn nông sản sạch từ Hoàng Toàn Farm!',
  },
  cancelled: {
    badge: 'Đã hủy',
    color: '#991b1b',
    description:
      'Đơn hàng của bạn đã chuyển sang trạng thái Đã hủy. Nếu cần đặt lại hoặc hỗ trợ, vui lòng gọi Hotline 0989.604.818.',
  },
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderOrderItemsHtml(order: OrderRecord): string {
  if (order.items && order.items.length > 0) {
    return order.items
      .map(
        (it) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #e6eee6;">${escapeHtml(it.product_name)}</td>
            <td style="padding:8px 0;border-bottom:1px solid #e6eee6;text-align:center;">×${it.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #e6eee6;text-align:right;font-weight:600;">${formatVnd(it.subtotal_vnd)}</td>
          </tr>`
      )
      .join('');
  }

  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e6eee6;">${escapeHtml(order.product_name)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e6eee6;text-align:center;">×${order.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e6eee6;text-align:right;font-weight:600;">${formatVnd(order.total_price_vnd)}</td>
    </tr>`;
}

function renderEmailLayout(params: {
  heading: string;
  intro: string;
  order: OrderRecord;
  siteUrl: string;
}): string {
  const { heading, intro, order, siteUrl } = params;
  const st = STATUS_INFO[order.status] ?? STATUS_INFO.pending;
  const trackingUrl = `${siteUrl}/?lookup=${encodeURIComponent(order.order_code)}`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f7f2;padding:24px 12px;color:#1b2e1b;">
    <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:14px;border:2px solid #2d5e29;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1b3b1a,#32602e);padding:22px 24px;color:#f7e49c;text-align:center;">
        <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Hoàng Toàn Farm · Nông sản sạch Điện Biên</div>
        <h2 style="margin:8px 0 0;font-size:22px;color:#ffffff;">${escapeHtml(heading)}</h2>
      </div>

      <div style="padding:24px;">
        <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">
          Xin chào <strong>${escapeHtml(order.customer_name)}</strong>,
        </p>
        <p style="margin:0 0 18px;font-size:14.5px;line-height:1.55;color:#2f4330;">
          ${escapeHtml(intro)}
        </p>

        <div style="background:#f6faf5;border:1.5px dashed #2d5e29;border-radius:10px;padding:14px 16px;text-align:center;margin-bottom:18px;">
          <div style="font-size:12px;color:#4f6450;text-transform:uppercase;">Mã đơn hàng / Mã tra cứu giao hàng</div>
          <div style="font-size:22px;font-weight:700;color:#1b3b1a;margin-top:4px;letter-spacing:0.5px;">
            ${escapeHtml(order.order_code)}
          </div>
          <div style="margin-top:8px;">
            <span style="display:inline-block;padding:4px 12px;border-radius:999px;background:#eef5ee;color:${st.color};font-size:12.5px;font-weight:700;">
              Trạng thái: ${st.badge}
            </span>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:14px;">
          <thead>
            <tr style="color:#4f6450;font-size:12.5px;text-transform:uppercase;">
              <th style="text-align:left;padding-bottom:6px;border-bottom:2px solid #d5e3d5;">Sản phẩm</th>
              <th style="text-align:center;padding-bottom:6px;border-bottom:2px solid #d5e3d5;">SL</th>
              <th style="text-align:right;padding-bottom:6px;border-bottom:2px solid #d5e3d5;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${renderOrderItemsHtml(order)}
          </tbody>
        </table>

        <div style="text-align:right;font-size:16px;margin-bottom:18px;">
          Tổng thanh toán: <strong style="color:#2d5e29;font-size:18px;">${formatVnd(order.total_price_vnd)}</strong>
        </div>

        <div style="background:#fafcf9;border-radius:8px;padding:12px 14px;font-size:13.5px;line-height:1.6;color:#354835;margin-bottom:20px;">
          <div><strong>Người nhận:</strong> ${escapeHtml(order.customer_name)} (${escapeHtml(order.customer_phone)})</div>
          ${order.address ? `<div><strong>Địa chỉ giao:</strong> ${escapeHtml(order.address)}</div>` : ''}
          ${order.note ? `<div><strong>Ghi chú:</strong> ${escapeHtml(order.note)}</div>` : ''}
        </div>

        <div style="text-align:center;margin:22px 0 8px;">
          <a href="${trackingUrl}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#2d5e29;color:#f7e49c;text-decoration:none;font-weight:700;font-size:14px;">
            Tra cứu tiến độ đơn hàng →
          </a>
        </div>
      </div>

      <div style="background:#eef4ed;padding:14px 20px;text-align:center;font-size:12.5px;color:#4f6450;">
        Hotline hỗ trợ: <strong>0989.604.818 - 0979.784.149</strong> · Kiểm tra hàng trước khi nhận
      </div>
    </div>
  </div>`;
}

export function buildOrderCreatedEmail(order: OrderRecord, siteUrl: string) {
  return {
    subject: `[Hoàng Toàn Farm] Đặt hàng thành công – Mã đơn ${order.order_code}`,
    html: renderEmailLayout({
      heading: 'Đặt quà trái cây tươi thành công!',
      intro: STATUS_INFO.pending.description,
      order,
      siteUrl,
    }),
  };
}

export function buildOrderStatusUpdatedEmail(order: OrderRecord, siteUrl: string) {
  const st = STATUS_INFO[order.status] ?? STATUS_INFO.pending;
  return {
    subject: `[Hoàng Toàn Farm] Đơn hàng ${order.order_code} – ${st.badge}`,
    html: renderEmailLayout({
      heading: `Cập nhật trạng thái: ${st.badge}`,
      intro: st.description,
      order,
      siteUrl,
    }),
  };
}
