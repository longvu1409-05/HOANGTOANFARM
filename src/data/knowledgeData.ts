import { PRESS_KNOWLEDGE_ASSETS } from '../constants/assets';
import type { KnowledgeArticleDto } from '../services/contentApi';
import { KnowledgeArticleItem } from '../types/farm.types';

/**
 * Bài viết lớn nổi bật bên trái mục "Kiến thức lựa chọn"
 */
export const FEATURED_KNOWLEDGE_ARTICLE: KnowledgeArticleItem = {
  id: 'nhan-biet-vu-sua-chin',
  nodeId: '720:575',
  title: 'Cách nhận biết vú sữa chín tự nhiên',
  excerpt: 'Hướng dẫn nhận biết độ chín phù hợp để lựa chọn quả có chất lượng ổn định khi sử dụng',
  image: PRESS_KNOWLEDGE_ASSETS.knowledgeFeatured,
  imageCrop: {
    width: '100%',
    height: '145.3%',
    left: '0%',
    top: '-31.91%',
  },
};

/**
 * 2 bài viết ngang bên phải mục "Kiến thức lựa chọn"
 */
export const SIDE_KNOWLEDGE_ARTICLES: KnowledgeArticleItem[] = [
  {
    id: 'dau-hieu-nhan-biet',
    nodeId: '722:590',
    title: 'Dấu hiệu nhận biết vú sữa ngon khi chọn mua',
    excerpt: 'Một số đặc điểm giúp bạn nhận biết và lựa chọn quả phù hợp theo nhu cầu sử dụng',
    image: PRESS_KNOWLEDGE_ASSETS.knowledgeCard1,
    imageCrop: {
      width: '100%',
      height: '158.55%',
      left: '0%',
      top: '-29.27%',
    },
  },
  {
    id: 'cach-su-dung',
    nodeId: '722:621',
    title: 'Cách sử dụng vú sữa đúng cách để giữ hương vị tốt',
    excerpt: 'Gợi ý cách bảo quản và sử dụng giúp giữ được chất lượng và trải nghiệm khi dùng',
    image: PRESS_KNOWLEDGE_ASSETS.knowledgeCard2,
  },
];

/**
 * Danh sách đầy đủ nội dung chi tiết 3 bài viết khởi tạo sẵn cho Modal "Kiến thức lựa chọn"
 */
export const DEFAULT_KNOWLEDGE_DTOS: KnowledgeArticleDto[] = [
  {
    id: 'nhan-biet-vu-sua-chin',
    title: 'Cách nhận biết vú sữa chín tự nhiên',
    excerpt:
      'Hướng dẫn nhận biết độ chín phù hợp để lựa chọn quả có chất lượng ổn định khi sử dụng',
    content:
      'Vú sữa Hoàng Kim (HK-2) chín tự nhiên trên cây có màu vàng óng đều, bề mặt vỏ căng bóng, phần cuống vẫn còn tươi xanh và tỏa mùi thơm dịu nhẹ đặc trưng. Khi bóp nhẹ bằng đầu ngón tay, quả cho cảm giác mềm đàn hồi vừa phải chứ không bị nhũn. Tránh chọn quả có vết dập thâm sâu ở phần đáy hoặc vỏ bị héo nhăn.',
    image_file: 'imgRectangle131.png',
    is_featured: 1,
    created_at: '2026-11-27 08:00:00',
  },
  {
    id: 'dau-hieu-nhan-biet',
    title: 'Dấu hiệu nhận biết vú sữa ngon khi chọn mua',
    excerpt: 'Một số đặc điểm giúp bạn nhận biết và lựa chọn quả phù hợp theo nhu cầu sử dụng',
    content:
      'Để chọn được trái vú sữa Hoàng Kim ngon chuẩn vị vườn: ưu tiên quả có trọng lượng từ 450g – 550g, cầm chắc tay, vỏ mỏng bóng mịn và phần núm quả hơi nhọn tự nhiên. Dòng vú sữa chuẩn VietGAP tại HTX Mường Khoe Xanh thường ít mủ, thịt quả dày, dẻo thơm và ít hạt.',
    image_file: 'imgRectangle222.png',
    is_featured: 0,
    created_at: '2026-11-27 08:00:00',
  },
  {
    id: 'cach-su-dung',
    title: 'Cách sử dụng vú sữa đúng cách để giữ hương vị tốt',
    excerpt: 'Gợi ý cách bảo quản và sử dụng giúp giữ được chất lượng và trải nghiệm khi dùng',
    content:
      'Sau khi nhận hàng, bạn có thể nắn nhẹ đều quanh vỏ trước khi bổ để phần sữa hòa quyện với thịt quả. Bảo quản vú sữa chưa ăn ở ngăn mát tủ lạnh nhiệt độ 8–12°C, dùng ngon nhất trong 3–5 ngày. Khi thưởng thức nên cắt làm 4 hoặc 6 múi để giữ trọn độ giòn ngọt và hương thơm tự nhiên.',
    image_file: 'imgRectangle223.png',
    is_featured: 0,
    created_at: '2026-11-27 08:00:00',
  },
];
