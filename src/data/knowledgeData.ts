import { PRESS_KNOWLEDGE_ASSETS } from '../constants/assets';
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
