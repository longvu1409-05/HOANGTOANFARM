import { STORY_PROCESS_ASSETS } from '../constants/assets';
import { ProcessStep } from '../types/farm.types';

/**
 * 4 bước trong mục "Vùng trồng & Quy trình"
 */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'vung-trong',
    nodeId: '500:105',
    title: 'Vùng trồng chọn lọc',
    description: 'Canh tác tại vùng đất phù hợp thổ nhưỡng, cho chất lượng ổn định',
    image: STORY_PROCESS_ASSETS.process1,
  },
  {
    id: 'canh-tac',
    nodeId: '500:106',
    title: 'Canh tác tự nhiên',
    description: 'Không hóa chất độc hại – ưu tiên tự nhiên',
    image: STORY_PROCESS_ASSETS.process2,
  },
  {
    id: 'thu-hoach',
    nodeId: '500:115',
    title: 'Thu hoạch đúng độ',
    description: 'Chỉ thu khi đạt độ ngọt và hương vị tốt nhất',
    image: STORY_PROCESS_ASSETS.process3,
  },
  {
    id: 'giao-nhanh',
    nodeId: '500:124',
    title: 'Giao nhanh trong ngày',
    description: 'Giữ trọn độ tươi khi đến tay khách hàng',
    image: STORY_PROCESS_ASSETS.process4,
    imageCrop: {
      width: '100%',
      height: '184.79%',
      left: '0%',
      top: '-66.9%',
    },
  },
];
