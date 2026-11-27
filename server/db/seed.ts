import { DatabaseSync } from 'node:sqlite';

/**
 * Nạp dữ liệu mẫu ban đầu khi cơ sở dữ liệu còn trống
 */
export function seedDatabase(db: DatabaseSync): void {
  seedProducts(db);
  seedReviews(db);
  seedKnowledge(db);
}

function seedProducts(db: DatabaseSync): void {
  const countRow = db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number };
  if (countRow.count > 0) return;

  const insert = db.prepare(`
    INSERT INTO products (id, node_id, name, spec_1, spec_2, unit, price_vnd, price_label, image_file, crop_json, stock, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    [
      'vu-sua-tuyen-chon',
      '683:344',
      'Vú sữa Hoàng Toàn – Tuyển chọn',
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
  ] as const;

  for (const item of products) {
    insert.run(...item);
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
    'Vú sữa Hoàng Kim chín tự nhiên có lớp vỏ vàng óng đều, phần đáy quả hơi căng nhẹ và tỏa hương thơm dịu đặc trưng. Tránh chọn quả bị dập cuống hoặc có vết thâm sâu.',
    'imgRectangle131.png',
    1
  );
  insert.run(
    'dau-hieu-nhan-biet',
    'Dấu hiệu nhận biết vú sữa ngon khi chọn mua',
    'Một số đặc điểm giúp bạn nhận biết và lựa chọn quả phù hợp theo nhu cầu sử dụng',
    'Quả ngon thường cầm chắc tay, vỏ bóng mịn, trọng lượng đạt 450g – 550g cho thịt dày, ít hạt và độ ngọt thanh tự nhiên.',
    'imgRectangle222.png',
    0
  );
  insert.run(
    'cach-su-dung',
    'Cách sử dụng vú sữa đúng cách để giữ hương vị tốt',
    'Gợi ý cách bảo quản và sử dụng giúp giữ được chất lượng và trải nghiệm khi dùng',
    'Nên bảo quản vú sữa ở ngăn mát 8–12°C và thưởng thức trong vòng 3–5 ngày kể từ khi nhận để cảm nhận trọn vẹn độ tươi ngọt.',
    'imgRectangle223.png',
    0
  );
}
