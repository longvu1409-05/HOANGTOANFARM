import { apiRequest, withApiFallback } from './apiClient';
import { localFallbackStore } from './localFallbackStore';

export type ContactStatus = 'new' | 'replied';

export interface ContactDto {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export interface CreateContactPayload {
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export async function submitContact(payload: CreateContactPayload) {
  return withApiFallback(
    () =>
      apiRequest<ContactDto>('/api/contacts', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    () => {
      const data = localFallbackStore.submitContact(payload);
      return {
        success: true,
        message: 'Đã gửi thông tin liên hệ! Hoàng Toàn Farm sẽ phản hồi sớm nhất.',
        data,
      };
    }
  );
}

export async function fetchContacts(): Promise<ContactDto[]> {
  return withApiFallback(
    async () => {
      const res = await apiRequest<ContactDto[]>('/api/contacts');
      return res.data;
    },
    () => localFallbackStore.listContacts()
  );
}

export async function updateContactStatus(id: number, status: ContactStatus) {
  return withApiFallback(
    () =>
      apiRequest<ContactDto>(`/api/contacts/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    () => {
      const data = localFallbackStore.updateContactStatus(id, status);
      return { success: true, message: 'Đã cập nhật trạng thái xử lý liên hệ.', data };
    }
  );
}
