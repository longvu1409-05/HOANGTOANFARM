import { PRODUCT_ASSETS, STORY_PROCESS_ASSETS, PRESS_KNOWLEDGE_ASSETS } from '../constants/assets';
import { ProductItem } from '../types/farm.types';

/**
 * Danh sách ảnh sản phẩm có sẵn trong thư viện để Admin chọn nhanh khi tạo/sửa sản phẩm
 */
export const AVAILABLE_PRODUCT_IMAGES = [
  { file: 'imgRectangle16.png', label: 'Vú sữa Hoàng Toàn (Hộp tuyển chọn)' },
  { file: 'imgRectangle17.png', label: 'Vú sữa Hoàng Toàn (Tiêu chuẩn)' },
  { file: 'imgRectangle18.png', label: 'Giỏ quà trái cây cao cấp' },
  { file: 'imgRectangle19.png', label: 'Combo Trái cây gia đình' },
  { file: 'imgRectangle222.png', label: 'Hộp quà Vú sữa Hoàng Kim 12 quả' },
  { file: 'imgRectangle223.png', label: 'Trái vú sữa Hoàng Kim hái tại vườn' },
  { file: 'imgRectangle21.png', label: 'Vú sữa chín vàng trên cành' },
  { file: 'imgRectangle131.png', label: 'Cận cảnh vú sữa chín tự nhiên' },
];

/**
 * Danh sách 7 sản phẩm mặc định (4 sản phẩm nổi bật theo Figma + 3 sản phẩm mở rộng)
 */
export const PRODUCTS: ProductItem[] = [
  {
    id: 'vu-sua-tuyen-chon',
    nodeId: '683:344',
    name: 'Vú sữa Hoàng Toàn – Tuyển chọn',
    category: 'Trái cây tươi',
    description:
      'Những trái vú sữa Hoàng Kim HK-2 loại 1 nặng từ 450–550g/quả, tuyển chọn kỹ lưỡng tại HTX Mường Khoe Xanh, vỏ vàng óng, ngọt đậm thanh mát.',
    image: PRODUCT_ASSETS.product1,
    imageFile: 'imgRectangle16.png',
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
    stock: 50,
    isFeatured: true,
  },
  {
    id: 'vu-sua-tieu-chuan',
    nodeId: '683:355',
    name: 'Vú sữa Hoàng Toàn  - Tiêu chuẩn',
    category: 'Trái cây tươi',
    description:
      'Dòng vú sữa Hoàng Kim đạt chuẩn VietGAP, thu hoạch đúng độ chín tự nhiên trên cây, phù hợp thưởng thức hằng ngày cho cả gia đình.',
    image: PRODUCT_ASSETS.product2,
    imageFile: 'imgRectangle17.png',
    spec1: 'Quả to 450 - 550g',
    spec2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Hộp 6 quả',
    price: '720.000đ',
    priceVnd: 720000,
    stock: 80,
    isFeatured: true,
  },
  {
    id: 'gio-qua-cao-cap',
    nodeId: '683:377',
    name: 'Giỏ quà trái cây cao cấp',
    category: 'Quà biếu',
    description:
      'Giỏ quà thiết kế trang nhã kết hợp vú sữa Hoàng Toàn cùng các loại trái cây tuyển chọn theo mùa, thích hợp biếu tặng đối tác và người thân.',
    image: PRODUCT_ASSETS.product3,
    imageFile: 'imgRectangle18.png',
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
    stock: 40,
    isFeatured: true,
  },
  {
    id: 'combo-gia-dinh',
    nodeId: '683:399',
    name: 'Combo Trái cây gia đình',
    category: 'Combo',
    description:
      'Combo trái cây tươi sạch cân bằng dinh dưỡng cho gia đình, được đóng gói cẩn thận và giao nhanh trong ngày giữ trọn độ tươi ngon.',
    image: PRODUCT_ASSETS.product4,
    imageFile: 'imgRectangle19.png',
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
    stock: 65,
    isFeatured: true,
  },
  {
    id: 'vu-sua-hoang-kim-hop-12',
    nodeId: 'custom:p5',
    name: 'Vú sữa Hoàng Kim – Hộp Quà 12 Quả',
    category: 'Quà biếu',
    description:
      'Hộp quà 12 trái vú sữa Hoàng Kim HK-2 kích thước đồng đều, lót xốp chống sốc cao cấp kèm thiệp chúc mừng sang trọng.',
    image: PRESS_KNOWLEDGE_ASSETS.knowledgeCard1,
    imageFile: 'imgRectangle222.png',
    spec1: 'Quả đều 400 - 500g',
    spec2: 'Hộp biếu sang trọng, kèm thiệp',
    unit: 'Hộp 12 quả',
    price: '1.390.000đ',
    priceVnd: 1390000,
    stock: 35,
    isFeatured: false,
  },
  {
    id: 'vu-sua-hoang-kim-tui-2kg',
    nodeId: 'custom:p6',
    name: 'Vú sữa Hoàng Kim HK-2 (Túi 2kg)',
    category: 'Trái cây tươi',
    description:
      'Túi 2kg gồm 4–5 quả vú sữa tươi hái trong ngày tại vườn Điện Biên, vị ngọt dịu tự nhiên, thịt quả dày và mọng nước.',
    image: PRESS_KNOWLEDGE_ASSETS.knowledgeCard2,
    imageFile: 'imgRectangle223.png',
    spec1: '4 - 5 quả tuyển tại vườn',
    spec2: 'Thu hoạch sáng sớm trong ngày',
    unit: 'Túi 2kg',
    price: '289.000đ',
    priceVnd: 289000,
    stock: 90,
    isFeatured: false,
  },
  {
    id: 'set-qua-trai-cay-doanh-nghiep',
    nodeId: 'custom:p7',
    name: 'Set Quà Biếu Doanh Nghiệp Hoàng Toàn',
    category: 'Quà biếu',
    description:
      'Bộ quà tặng tri ân khách hàng & đối tác doanh nghiệp gồm vú sữa Hoàng Toàn và hoa quả đặc sản sạch đạt chứng nhận VietGAP/OCOP.',
    image: STORY_PROCESS_ASSETS.process3,
    imageFile: 'imgRectangle21.png',
    spec1: 'Vú sữa HK-2 & quả theo mùa',
    spec2: 'Hỗ trợ in thiệp logo doanh nghiệp',
    unit: 'Set quà',
    price: '890.000đ',
    priceVnd: 890000,
    stock: 45,
    isFeatured: false,
  },
];
