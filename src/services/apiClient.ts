export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Hàm gọi HTTP chung tới Backend (/api/...)
 */
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Lỗi kết nối máy chủ (${response.status})`);
  }

  return payload;
}
