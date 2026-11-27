const ADMIN_TOKEN_KEY = 'htf_admin_token_v1';

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string): void {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
}

export function clearStoredAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

export interface AdminSessionDto {
  token?: string;
  username: string;
  expiresAt: string;
}

export async function loginAdmin(username: string, password: string): Promise<AdminSessionDto> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: AdminSessionDto;
  } | null;

  if (!response.ok || !payload?.success || !payload.data?.token) {
    throw new Error(payload?.message || 'Đăng nhập thất bại.');
  }

  setStoredAdminToken(payload.data.token);
  return payload.data;
}

export async function verifyAdminSession(): Promise<AdminSessionDto | null> {
  const token = getStoredAdminToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      clearStoredAdminToken();
      return null;
    }
    const payload = (await response.json()) as { success?: boolean; data?: AdminSessionDto };
    return payload?.success && payload.data ? payload.data : null;
  } catch {
    return null;
  }
}
