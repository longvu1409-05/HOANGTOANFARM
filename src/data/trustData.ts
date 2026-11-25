import { TRUST_ASSETS } from '../constants/assets';
import { CommitmentItem, TestimonialItem } from '../types/farm.types';

/**
 * Danh sách 3 cam kết chất lượng bên trái
 */
export const COMMITMENTS: CommitmentItem[] = [
  {
    id: 'vietgap',
    nodeId: '706:514',
    title: 'Canh tác theo quy trình VietGAP',
    description: 'Kiểm soát chất lượng chặt chẽ từ vườn tới tay khách hàng',
    icon: TRUST_ASSETS.commitmentIcon1,
  },
  {
    id: 'do-chin',
    nodeId: '706:515',
    title: 'Thu hoạch theo độ chín phù hợp',
    description: 'Giao hàng nhanh để giữ trọn độ tươi ngon của sản phẩm',
    icon: TRUST_ASSETS.commitmentIcon2,
  },
  {
    id: 'ho-tro',
    nodeId: '706:520',
    title: 'Hỗ trợ tận tâm',
    description: 'Đổi trả khi sản phẩm chưa đạt, theo chính sách áp dụng',
    icon: TRUST_ASSETS.commitmentIcon3,
  },
];

/**
 * Danh sách đánh giá của khách hàng bên phải
 */
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'chi-mai',
    nodeId: '507:185',
    quote:
      'Trái cây tươi, ngọt tự nhiên, đóng gói cẩn thận. Gia đình mình rất yên tâm khi mua ở Hoàng Toàn Farm.',
    author: 'Chị Mai - TP Hồ Chí Minh',
    avatar: TRUST_ASSETS.testimonialAvatar1,
  },
  {
    id: 'anh-van',
    nodeId: '507:186',
    quote: 'Mua làm quà rất thích, giỏ quà đẹp và sang trọng, sẽ ủng hộ lâu dài',
    author: 'Anh Văn - Hà Nội',
    avatar: TRUST_ASSETS.testimonialAvatar2,
  },
];
