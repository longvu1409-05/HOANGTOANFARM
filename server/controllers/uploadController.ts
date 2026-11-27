import { Request, Response } from 'express';
import { requireSupabaseClient } from '../db/supabaseClient.js';
import { slugifyVietnamese } from '../utils/formatters.js';
import { sendBadRequest, sendCreated } from '../utils/response.js';

const BUCKET_NAME = 'product-images';
const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

let bucketChecked = false;

async function ensureBucketExists() {
  if (bucketChecked) return;
  const supabase = requireSupabaseClient();
  const { data } = await supabase.storage.getBucket(BUCKET_NAME);
  if (!data) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    });
  }
  bucketChecked = true;
}

/**
 * API tải ảnh sản phẩm / bài viết trực tiếp lên Supabase Storage (yêu cầu quyền Admin)
 */
export const uploadController = {
  async uploadImage(req: Request, res: Response) {
    const rawFileName = String(req.body?.fileName ?? 'anh-san-pham').trim();
    const contentType = String(req.body?.contentType ?? '').toLowerCase().trim();
    const base64Data = String(req.body?.base64Data ?? '').trim();

    const ext = ALLOWED_MIME[contentType];
    if (!ext) {
      return sendBadRequest(res, 'Chỉ hỗ trợ định dạng ảnh JPG, PNG, WEBP hoặc GIF.');
    }
    if (!base64Data) {
      return sendBadRequest(res, 'Không nhận được dữ liệu tệp ảnh.');
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.byteLength === 0 || buffer.byteLength > 5 * 1024 * 1024) {
      return sendBadRequest(res, 'Dung lượng ảnh không hợp lệ (tối đa 5MB).');
    }

    await ensureBucketExists();

    const supabase = requireSupabaseClient();
    const nameWithoutExt = rawFileName.replace(/\.[^.]+$/, '');
    const filePath = `uploads/${Date.now()}-${slugifyVietnamese(nameWithoutExt)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, buffer, {
      contentType,
      cacheControl: '31536000',
      upsert: false,
    });

    if (error) {
      return sendBadRequest(res, `Tải ảnh lên Supabase thất bại: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return sendCreated(
      res,
      {
        path: filePath,
        publicUrl: data.publicUrl,
      },
      'Đã tải ảnh lên Supabase Storage thành công!'
    );
  },
};
