import { apiRequest } from './apiClient';

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
  return apiRequest<ContactDto>('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchContacts(): Promise<ContactDto[]> {
  const res = await apiRequest<ContactDto[]>('/api/contacts');
  return res.data;
}

export async function updateContactStatus(id: number, status: ContactStatus) {
  return apiRequest<ContactDto>(`/api/contacts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
