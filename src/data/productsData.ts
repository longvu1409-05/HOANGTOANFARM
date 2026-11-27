import { PRODUCT_ASSETS } from '../constants/assets';
import { ProductItem } from '../types/farm.types';

/**
 * Danh sách 4 sản phẩm hiển thị tại mục "Sản phẩm tuyển chọn"
 */
export const PRODUCTS: ProductItem[] = [
  {
    id: 'vu-sua-tuyen-chon',
    nodeId: '683:344',
    name: 'Vú sữa Hoàng Toàn – Tuyển chọn',
    image: PRODUCT_ASSETS.product1,
    imageCrop: {
      width: '104.39%',
      height: '214.89%',
      left: '-1.54%',
      top: '-114.89%',
    },
    spec1: 'Quả to 450 - 550g',
    spec2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Hộp 6 quả',
    price: '1.080.000đ',
    priceVnd: 1080000,
  },
  {
    id: 'vu-sua-tieu-chuan',
    nodeId: '683:355',
    name: 'Vú sữa Hoàng Toàn  - Tiêu chuẩn',
    image: PRODUCT_ASSETS.product2,
    spec1: 'Quả to 450 - 550g',
    spec2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Hộp 6 quả',
    price: '720.000đ',
    priceVnd: 720000,
  },
  {
    id: 'gio-qua-cao-cap',
    nodeId: '683:377',
    name: 'Giỏ quà trái cây cao cấp',
    image: PRODUCT_ASSETS.product3,
    imageCrop: {
      width: '146.02%',
      height: '112.11%',
      left: '-23.01%',
      top: '-6.06%',
    },
    spec1: 'Quả to 450 - 550g',
    spec2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Giỏ quà',
    price: '499.000đ',
    priceVnd: 499000,
  },
  {
    id: 'combo-gia-dinh',
    nodeId: '683:399',
    name: 'Combo Trái cây gia đình',
    image: PRODUCT_ASSETS.product4,
    imageCrop: {
      width: '130.24%',
      height: '100%',
      left: '-15.12%',
      top: '0%',
    },
    spec1: 'Quả to 450 - 550g',
    spec2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Combo',
    price: '349.000đ',
    priceVnd: 349000,
  },
];
