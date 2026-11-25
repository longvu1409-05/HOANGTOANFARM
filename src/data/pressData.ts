import { PRESS_KNOWLEDGE_ASSETS } from '../constants/assets';
import { FeaturedPressArticle, PressVideoItem } from '../types/farm.types';

/**
 * Các bài báo tiêu điểm trong khối Bento Báo chí & Truyền thông
 */
export const FEATURED_PRESS_ARTICLES: FeaturedPressArticle[] = [
  {
    id: 'press-1',
    title: 'Hoàng Toàn Farm: Hành trình xây dựng niềm tin từ những trái ngọt',
    lead: 'Trong bối cảnh người tiêu dùng ngày càng quan tâm đến sức khỏe và chất lượng thực phẩm, thị trường trái cây cao cấp tại Việt Nam đang chứng kiến sự chuyển mình mạnh mẽ. Giữa làn sóng đó, ',
    brand: 'Hoàng Toàn Farm',
    tail: ' khẳng định vị thế là thương hiệu trái cây cao cấp uy tín, đề cao sự minh bạch và chất lượng dinh dưỡng trong từng sản phẩm.',
  },
  {
    id: 'press-2',
    title: 'Vú sữa Hoàng Kim (HK-2): Sản phẩm chất lượng cao chinh phục người tiêu dùng',
    lead: 'Được tuyển chọn từ vùng trồng liên kết đạt chuẩn tại HTX Dịch vụ Nông nghiệp Mường Khoe Xanh, dòng vú sữa Hoàng Kim của ',
    brand: 'Hoàng Toàn Farm',
    tail: ' ghi dấu ấn nhờ vị ngọt thanh tự nhiên, vỏ mỏng, ít hạt và quy trình truy xuất nguồn gốc minh bạch.',
  },
];

/**
 * 3 video phóng sự truyền hình phía dưới mục Báo chí
 */
export const PRESS_VIDEOS: PressVideoItem[] = [
  {
    id: 'video-1',
    nodeId: '874:232',
    title: 'Khi sáng tạo trở thành lợi thế cạnh tranh | Sáng tạo mỗi ngày 6-4-2026 | Điện Biên TV',
    thumbnail: PRESS_KNOWLEDGE_ASSETS.pressVideo1,
  },
  {
    id: 'video-2',
    nodeId: '874:233',
    title: 'Vú sữa Hoàng Kim (HK-2) - Hướng đi mới của nền nông sản Điện Biên, năng suất cao, giá trị',
    thumbnail: PRESS_KNOWLEDGE_ASSETS.pressVideo2,
  },
  {
    id: 'video-3',
    nodeId: '874:240',
    title: 'Tham quan vú sữa Hoàng Kim (HK-2)  của Hoàng Toàn Farm tại Mường Ảng, Điện Biên',
    thumbnail: PRESS_KNOWLEDGE_ASSETS.pressVideo3,
  },
];
