import { PARTNER_FOOTER_ASSETS } from '../constants/assets';
import { PreFooterFeatureItem } from '../types/farm.types';

/**
 * 3 dòng cam kết dịch vụ tại banner đặt hàng trước chân trang
 */
export const PREFOOTER_FEATURES: PreFooterFeatureItem[] = [
  {
    id: 'pf-1',
    nodeId: '507:375',
    icon: PARTNER_FOOTER_ASSETS.preFooterIconTruck,
    text: 'Tuyển chọn kỹ lưỡng - Chọn lọc theo tiêu chí trước khi giao hàng',
  },
  {
    id: 'pf-2',
    nodeId: '507:377',
    icon: PARTNER_FOOTER_ASSETS.preFooterIconPackage,
    text: 'Đóng gói cẩn thận - Hạn chế dập hỏng trong quá trình vận chuyển',
  },
  {
    id: 'pf-3',
    nodeId: '510:386',
    icon: PARTNER_FOOTER_ASSETS.preFooterIconSupport,
    text: 'Tư vấn và hỗ trợ tận tâm - Luôn sẵn sàng giải đáp khi bạn cần',
  },
];

/**
 * Liên kết cột "Về chúng tôi" ở chân trang
 */
export const FOOTER_ABOUT_LINKS = [
  { label: 'Câu chuyện thương hiệu', href: '#cau-chuyen' },
  { label: 'Vùng trồng và quy trình', href: '#vung-trong' },
  { label: 'Kiểm soát chất lượng', href: '#vung-trong' },
  { label: 'Liên hệ', href: '#lien-he' },
];

/**
 * Liên kết cột "Hỗ trợ khách hàng" ở chân trang
 */
export const FOOTER_SUPPORT_LINKS = [
  { label: 'Hướng dẫn mua hàng', href: '#san-pham' },
  { label: 'Giao hàng & Thanh toán', href: '#san-pham' },
  { label: 'Đổi trả sản phẩm', href: '#lien-he' },
  { label: 'Câu hỏi thường gặp', href: '#kien-thuc' },
];
