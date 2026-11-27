export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  status: number;
  isEndpointUnavailable: boolean;

  constructor(message: string, status: number, isEndpointUnavailable: boolean) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isEndpointUnavailable = isEndpointUnavailable;
  }
}

/**
 * Hàm gọi HTTP chung tới Backend (/api/...)
 */
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      ...options,
    });
  } catch {
    throw new ApiError('Không kết nối được máy chủ.', 0, true);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson
    ? ((await response.json().catch(() => null)) as ApiResponse<T> | null)
    : null;

  if (!response.ok || !payload?.success) {
    // Nếu máy chủ tĩnh (ví dụ GitHub Pages) trả về HTML 404/405 hoặc lỗi 5xx, đánh dấu để chuyển sang kho dự phòng
    const endpointMissing =
      !isJson ||
      response.status >= 500 ||
      response.status === 405 ||
      (response.status === 404 && !payload?.message);

    throw new ApiError(
      payload?.message || `Lỗi kết nối máy chủ (${response.status})`,
      response.status,
      endpointMissing
    );
  }

  return payload;
}

/**
 * Ưu tiên gọi Backend API thật; nếu môi trường tĩnh không có API thì tự chuyển sang kho dự phòng trình duyệt
 */
export async function withApiFallback<T>(
  apiCall: () => Promise<T>,
  fallbackCall: () => T | Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (err) {
    if (err instanceof ApiError && !err.isEndpointUnavailable) {
      throw err;
    }
    return await fallbackCall();
  }
}
