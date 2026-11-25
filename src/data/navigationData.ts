import { NavItem } from '../types/farm.types';

/**
 * Danh sách các mục trên thanh Menu điều hướng chính
 */
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', href: '#trang-chu' },
  { id: 'products', label: 'sản phẩm', href: '#san-pham' },
  {
    id: 'process',
    label: 'Vùng trồng & quy trình',
    href: '#vung-trong',
    hasDropdown: true,
    dropdownItems: [
      'Vùng trồng chọn lọc',
      'Quy trình canh tác VietGAP',
      'Thu hoạch & bảo quản tự nhiên',
    ],
  },
  { id: 'story', label: 'Câu chuyện thương hiệu', href: '#cau-chuyen' },
  { id: 'knowledge', label: 'Kiến thức lựa chọn', href: '#kien-thuc' },
  { id: 'contact', label: 'Liên hệ', href: '#lien-he' },
];
