import { DatabaseSync } from 'node:sqlite';

/**
 * Nạp dữ liệu mẫu ban đầu (7 sản phẩm: 4 nổi bật + 3 sản phẩm mở rộng, đánh giá, bài viết)
 */
export function seedDatabase(db: DatabaseSync): void {
  seedProducts(db);
  seedReviews(db);
  seedKnowledge(db);
}

function seedProducts(db: DatabaseSync): void {
  const upsert = db.prepare(`
    INSERT INTO products (
      id, node_id, name, category, description,
      spec_1, spec_2, unit, price_vnd, price_label,
      image_file, crop_json, stock, is_featured, is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO NOTHING
  `);

  const products = [
    // 4 sản phẩm nổi bật hiển thị mặc định theo thiết kế Figma
    [
      'vu-sua-tuyen-chon',
      '683:344',
      'Vú sữa Hoàng Toàn – Tuyển chọn',
      'Trái cây tươi',
      'Những trái vú sữa Hoàng Kim HK-2 loại 1 nặng từ 450–550g/quả, tuyển chọn kỹ lưỡng tại HTX Mường Khoe Xanh, vỏ vàng óng, ngọt đậm thanh mát.',
      'Quả to 450 - 550g',
      'Ngọt đậm, vỏ mỏng, ít hạt',
      'Hộp 6 quả',
      1080000,
      '1.080.000đ',
      'imgRectangle16.png',
      JSON.stringify({ width: '104.39%', height: '214.89%', left: '-1.54%', top: '-114.89%' }),
      50,
      1,
    ],
    [
      'vu-sua-tieu-chuan',
      '683:355',
      'Vú sữa Hoàng Toàn  - Tiêu chuẩn',
      'Trái cây tươi',
      'Dòng vú sữa Hoàng Kim đạt chuẩn VietGAP, thu hoạch đúng độ chín tự nhiên trên cây, phù hợp thưởng thức hằng ngày cho cả gia đình.',
      'Quả to 450 - 550g',
      'Ngọt đậm, vỏ mỏng, ít hạt',
      'Hộp 6 quả',
      720000,
      '720.000đ',
      'imgRectangle17.png',
      null,
      80,
      1,
    ],
    [
      'gio-qua-cao-cap',
      '683:377',
      'Giỏ quà trái cây cao cấp',
      'Quà biếu',
      'Giỏ quà thiết kế trang nhã kết hợp vú sữa Hoàng Toàn cùng các loại trái cây tuyển chọn theo mùa, thích hợp biếu tặng đối tác và người thân.',
      'Quả to 450 - 550g',
      'Ngọt đậm, vỏ mỏng, ít hạt',
      'Giỏ quà',
      499000,
      '499.000đ',
      'imgRectangle18.png',
      JSON.stringify({ width: '146.02%', height: '112.11%', left: '-23.01%', top: '-6.06%' }),
      40,
      1,
    ],
    [
      'combo-gia-dinh',
      '683:399',
      'Combo Trái cây gia đình',
      'Combo',
      'Combo trái cây tươi sạch cân bằng dinh dưỡng cho gia đình, được đóng gói cẩn thận và giao nhanh trong ngày giữ trọn độ tươi ngon.',
      'Quả to 450 - 550g',
      'Ngọt đậm, vỏ mỏng, ít hạt',
      'Combo',
      349000,
      '349.000đ',
      'imgRectangle19.png',
      JSON.stringify({ width: '130.24%', height: '100%', left: '-15.12%', top: '0%' }),
      65,
      1,
    ],

    // + 3 sản phẩm mới bổ sung
    [
      'vu-sua-hoang-kim-hop-12',
      'custom:p5',
      'Vú sữa Hoàng Kim – Hộp Quà 12 Quả',
      'Quà biếu',
      'Hộp quà 12 trái vú sữa Hoàng Kim HK-2 kích thước đồng đều, lót xốp chống sốc cao cấp kèm thiệp chúc mừng sang trọng.',
      'Quả đều 400 - 500g',
      'Hộp biếu sang trọng, kèm thiệp',
      'Hộp 12 quả',
      1390000,
      '1.390.000đ',
      'imgRectangle222.png',
      null,
      35,
      0,
    ],
    [
      'vu-sua-hoang-kim-tui-2kg',
      'custom:p6',
      'Vú sữa Hoàng Kim HK-2 (Túi 2kg)',
      'Trái cây tươi',
      'Túi 2kg gồm 4–5 quả vú sữa tươi hái trong ngày tại vườn Điện Biên, vị ngọt dịu tự nhiên, thịt quả dày và mọng nước.',
      '4 - 5 quả tuyển tại vườn',
      'Thu hoạch sáng sớm trong ngày',
      'Túi 2kg',
      289000,
      '289.000đ',
      'imgRectangle223.png',
      null,
      90,
      0,
    ],
    [
      'set-qua-trai-cay-doanh-nghiep',
      'custom:p7',
      'Set Quà Biếu Doanh Nghiệp Hoàng Toàn',
      'Quà biếu',
      'Bộ quà tặng tri ân khách hàng & đối tác doanh nghiệp gồm vú sữa Hoàng Toàn và hoa quả đặc sản sạch đạt chứng nhận VietGAP/OCOP.',
      'Vú sữa HK-2 & quả theo mùa',
      'Hỗ trợ in thiệp logo doanh nghiệp',
      'Set quà',
      890000,
      '890.000đ',
      'imgRectangle21.png',
      null,
      45,
      0,
    ],
  ] as const;

  for (const item of products) {
    upsert.run(...item);
  }
}

function seedReviews(db: DatabaseSync): void {
  const countRow = db.prepare('SELECT COUNT(*) AS count FROM reviews').get() as { count: number };
  if (countRow.count > 0) return;

  const insert = db.prepare(
    'INSERT INTO reviews (author, quote, rating, avatar_file) VALUES (?, ?, ?, ?)'
  );
  insert.run(
    'Chị Mai - TP Hồ Chí Minh',
    'Trái cây tươi, ngọt tự nhiên, đóng gói cẩn thận. Gia đình mình rất yên tâm khi mua ở Hoàng Toàn Farm.',
    5,
    'imgEllipse47.png'
  );
  insert.run(
    'Anh Văn - Hà Nội',
    'Mua làm quà rất thích, giỏ quà đẹp và sang trọng, sẽ ủng hộ lâu dài',
    5,
    'imgEllipse48.png'
  );
}

function seedKnowledge(db: DatabaseSync): void {
  const countRow = db
    .prepare('SELECT COUNT(*) AS count FROM knowledge_articles')
    .get() as { count: number };
  if (countRow.count > 0) return;

  const insert = db.prepare(`
    INSERT INTO knowledge_articles (id, title, excerpt, content, image_file, is_featured)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    'nhan-biet-vu-sua-chin',
    'Cách nhận biết vú sữa chín tự nhiên',
    'Hướng dẫn nhận biết độ chín phù hợp để lựa chọn quả có chất lượng ổn định khi sử dụng',
    'Vú sữa Hoàng Kim (HK-2) chín tự nhiên trên cây có màu vàng óng đều, bề mặt vỏ căng bóng, phần cuống vẫn còn tươi xanh và tỏa mùi thơm dịu nhẹ đặc trưng. Khi bóp nhẹ bằng đầu ngón tay, quả cho cảm giác mềm đàn hồi vừa phải chứ không bị nhũn. Tránh chọn quả có vết dập thâm sâu ở phần đáy hoặc vỏ bị héo nhăn.',
    'imgRectangle131.png',
    1
  );
  insert.run(
    'dau-hieu-nhan-biet',
    'Dấu hiệu nhận biết vú sữa ngon khi chọn mua',
    'Một số đặc điểm giúp bạn nhận biết và lựa chọn quả phù hợp theo nhu cầu sử dụng',
    'Để chọn được trái vú sữa Hoàng Kim ngon chuẩn vị vườn: ưu tiên quả có trọng lượng từ 450g – 550g, cầm chắc tay, vỏ mỏng bóng mịn và phần núm quả hơi nhọn tự nhiên. Dòng vú sữa chuẩn VietGAP tại HTX Mường Khoe Xanh thường ít mủ, thịt quả dày, dẻo thơm và ít hạt.',
    'imgRectangle222.png',
    0
  );
  insert.run(
    'cach-su-dung',
    'Cách sử dụng vú sữa đúng cách để giữ hương vị tốt',
    'Gợi ý cách bảo quản và sử dụng giúp giữ được chất lượng và trải nghiệm khi dùng',
    'Sau khi nhận hàng, bạn có thể nắn nhẹ đều quanh vỏ trước khi bổ để phần sữa hòa quyện với thịt quả. Bảo quản vú sữa chưa ăn ở ngăn mát tủ lạnh nhiệt độ 8–12°C, dùng ngon nhất trong 3–5 ngày. Khi thưởng thức nên cắt làm 4 hoặc 6 múi để giữ trọn độ giòn ngọt và hương thơm tự nhiên.',
    'imgRectangle223.png',
    0
  );
}
