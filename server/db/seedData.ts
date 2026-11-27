import { KnowledgeArticleRecord, ProductRecord, ReviewRecord } from '../types/backend.types';

const DEFAULT_CREATED_AT = '2026-11-27 08:00:00';

/**
 * Dữ liệu mẫu gốc dùng chung cho cả SQLite và kho dự phòng JSON (Serverless)
 */
export const SEED_PRODUCTS: ProductRecord[] = [
  {
    id: 'vu-sua-tuyen-chon',
    node_id: '683:344',
    name: 'Vú sữa Hoàng Toàn – Tuyển chọn',
    category: 'Trái cây tươi',
    description:
      'Những trái vú sữa Hoàng Kim HK-2 loại 1 nặng từ 450–550g/quả, tuyển chọn kỹ lưỡng tại HTX Mường Khoe Xanh, vỏ vàng óng, ngọt đậm thanh mát.',
    spec_1: 'Quả to 450 - 550g',
    spec_2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Hộp 6 quả',
    price_vnd: 1080000,
    price_label: '1.080.000đ',
    image_file: 'imgRectangle16.png',
    crop_json: JSON.stringify({
      width: '104.39%',
      height: '214.89%',
      left: '-1.54%',
      top: '-114.89%',
    }),
    stock: 50,
    is_featured: 1,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'vu-sua-tieu-chuan',
    node_id: '683:355',
    name: 'Vú sữa Hoàng Toàn  - Tiêu chuẩn',
    category: 'Trái cây tươi',
    description:
      'Dòng vú sữa Hoàng Kim đạt chuẩn VietGAP, thu hoạch đúng độ chín tự nhiên trên cây, phù hợp thưởng thức hằng ngày cho cả gia đình.',
    spec_1: 'Quả to 450 - 550g',
    spec_2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Hộp 6 quả',
    price_vnd: 720000,
    price_label: '720.000đ',
    image_file: 'imgRectangle17.png',
    crop_json: null,
    stock: 80,
    is_featured: 1,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'gio-qua-cao-cap',
    node_id: '683:377',
    name: 'Giỏ quà trái cây cao cấp',
    category: 'Quà biếu',
    description:
      'Giỏ quà thiết kế trang nhã kết hợp vú sữa Hoàng Toàn cùng các loại trái cây tuyển chọn theo mùa, thích hợp biếu tặng đối tác và người thân.',
    spec_1: 'Quả to 450 - 550g',
    spec_2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Giỏ quà',
    price_vnd: 499000,
    price_label: '499.000đ',
    image_file: 'imgRectangle18.png',
    crop_json: JSON.stringify({
      width: '146.02%',
      height: '112.11%',
      left: '-23.01%',
      top: '-6.06%',
    }),
    stock: 40,
    is_featured: 1,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'combo-gia-dinh',
    node_id: '683:399',
    name: 'Combo Trái cây gia đình',
    category: 'Combo',
    description:
      'Combo trái cây tươi sạch cân bằng dinh dưỡng cho gia đình, được đóng gói cẩn thận và giao nhanh trong ngày giữ trọn độ tươi ngon.',
    spec_1: 'Quả to 450 - 550g',
    spec_2: 'Ngọt đậm, vỏ mỏng, ít hạt',
    unit: 'Combo',
    price_vnd: 349000,
    price_label: '349.000đ',
    image_file: 'imgRectangle19.png',
    crop_json: JSON.stringify({
      width: '130.24%',
      height: '100%',
      left: '-15.12%',
      top: '0%',
    }),
    stock: 65,
    is_featured: 1,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'vu-sua-hoang-kim-hop-12',
    node_id: 'custom:p5',
    name: 'Vú sữa Hoàng Kim – Hộp Quà 12 Quả',
    category: 'Quà biếu',
    description:
      'Hộp quà 12 trái vú sữa Hoàng Kim HK-2 kích thước đồng đều, lót xốp chống sốc cao cấp kèm thiệp chúc mừng sang trọng.',
    spec_1: 'Quả đều 400 - 500g',
    spec_2: 'Hộp biếu sang trọng, kèm thiệp',
    unit: 'Hộp 12 quả',
    price_vnd: 1390000,
    price_label: '1.390.000đ',
    image_file: 'imgRectangle222.png',
    crop_json: null,
    stock: 35,
    is_featured: 0,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'vu-sua-hoang-kim-tui-2kg',
    node_id: 'custom:p6',
    name: 'Vú sữa Hoàng Kim HK-2 (Túi 2kg)',
    category: 'Trái cây tươi',
    description:
      'Túi 2kg gồm 4–5 quả vú sữa tươi hái trong ngày tại vườn Điện Biên, vị ngọt dịu tự nhiên, thịt quả dày và mọng nước.',
    spec_1: '4 - 5 quả tuyển tại vườn',
    spec_2: 'Thu hoạch sáng sớm trong ngày',
    unit: 'Túi 2kg',
    price_vnd: 289000,
    price_label: '289.000đ',
    image_file: 'imgRectangle223.png',
    crop_json: null,
    stock: 90,
    is_featured: 0,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'set-qua-trai-cay-doanh-nghiep',
    node_id: 'custom:p7',
    name: 'Set Quà Biếu Doanh Nghiệp Hoàng Toàn',
    category: 'Quà biếu',
    description:
      'Bộ quà tặng tri ân khách hàng & đối tác doanh nghiệp gồm vú sữa Hoàng Toàn và hoa quả đặc sản sạch đạt chứng nhận VietGAP/OCOP.',
    spec_1: 'Vú sữa HK-2 & quả theo mùa',
    spec_2: 'Hỗ trợ in thiệp logo doanh nghiệp',
    unit: 'Set quà',
    price_vnd: 890000,
    price_label: '890.000đ',
    image_file: 'imgRectangle21.png',
    crop_json: null,
    stock: 45,
    is_featured: 0,
    is_active: 1,
    created_at: DEFAULT_CREATED_AT,
  },
];

export const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: 1,
    author: 'Chị Mai - TP Hồ Chí Minh',
    quote:
      'Trái cây tươi, ngọt tự nhiên, đóng gói cẩn thận. Gia đình mình rất yên tâm khi mua ở Hoàng Toàn Farm.',
    rating: 5,
    avatar_file: 'imgEllipse47.png',
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 2,
    author: 'Anh Văn - Hà Nội',
    quote: 'Mua làm quà rất thích, giỏ quà đẹp và sang trọng, sẽ ủng hộ lâu dài',
    rating: 5,
    avatar_file: 'imgEllipse48.png',
    created_at: DEFAULT_CREATED_AT,
  },
];

export const SEED_KNOWLEDGE_ARTICLES: KnowledgeArticleRecord[] = [
  {
    id: 'nhan-biet-vu-sua-chin',
    title: 'Cách nhận biết vú sữa chín tự nhiên',
    excerpt:
      'Hướng dẫn nhận biết độ chín phù hợp để lựa chọn quả có chất lượng ổn định khi sử dụng',
    content:
      'Vú sữa Hoàng Kim (HK-2) chín tự nhiên trên cây có màu vàng óng đều, bề mặt vỏ căng bóng, phần cuống vẫn còn tươi xanh và tỏa mùi thơm dịu nhẹ đặc trưng. Khi bóp nhẹ bằng đầu ngón tay, quả cho cảm giác mềm đàn hồi vừa phải chứ không bị nhũn. Tránh chọn quả có vết dập thâm sâu ở phần đáy hoặc vỏ bị héo nhăn.',
    image_file: 'imgRectangle131.png',
    is_featured: 1,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'dau-hieu-nhan-biet',
    title: 'Dấu hiệu nhận biết vú sữa ngon khi chọn mua',
    excerpt:
      'Một số đặc điểm giúp bạn nhận biết và lựa chọn quả phù hợp theo nhu cầu sử dụng',
    content:
      'Để chọn được trái vú sữa Hoàng Kim ngon chuẩn vị vườn: ưu tiên quả có trọng lượng từ 450g – 550g, cầm chắc tay, vỏ mỏng bóng mịn và phần núm quả hơi nhọn tự nhiên. Dòng vú sữa chuẩn VietGAP tại HTX Mường Khoe Xanh thường ít mủ, thịt quả dày, dẻo thơm và ít hạt.',
    image_file: 'imgRectangle222.png',
    is_featured: 0,
    created_at: DEFAULT_CREATED_AT,
  },
  {
    id: 'cach-su-dung',
    title: 'Cách sử dụng vú sữa đúng cách để giữ hương vị tốt',
    excerpt:
      'Gợi ý cách bảo quản và sử dụng giúp giữ được chất lượng và trải nghiệm khi dùng',
    content:
      'Sau khi nhận hàng, bạn có thể nắn nhẹ đều quanh vỏ trước khi bổ để phần sữa hòa quyện với thịt quả. Bảo quản vú sữa chưa ăn ở ngăn mát tủ lạnh nhiệt độ 8–12°C, dùng ngon nhất trong 3–5 ngày. Khi thưởng thức nên cắt làm 4 hoặc 6 múi để giữ trọn độ giòn ngọt và hương thơm tự nhiên.',
    image_file: 'imgRectangle223.png',
    is_featured: 0,
    created_at: DEFAULT_CREATED_AT,
  },
];
