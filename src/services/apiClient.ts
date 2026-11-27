import { getStoredAdminToken } from './authApi';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export class ApiHttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Hàm gọi HTTP chuẩn tới Backend API (/api/...), tự động đính kèm token Admin nếu đã đăng nhập
 */
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const adminToken = getStoredAdminToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.success) {
    throw new ApiHttpError(
      payload?.message || `Lỗi kết nối máy chủ (${response.status})`,
      response.status
    );
  }

  return payload;
}
