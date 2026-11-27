import { apiRequest } from './apiClient';

export interface SubscriberDto {
  id: number;
  email: string;
  created_at: string;
}

export async function subscribeNewsletterEmail(email: string) {
  return apiRequest<{
    subscriber: SubscriberDto;
    alreadySubscribed: boolean;
    emailSent?: boolean;
  }>('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function fetchSubscribers() {
  const res = await apiRequest<SubscriberDto[]>('/api/newsletter');
  return res.data;
}

export async function broadcastNewsletter(payload: {
  subject: string;
  content: string;
  promoCode?: string;
}) {
  return apiRequest<{ sentCount: number; total: number }>('/api/newsletter/broadcast', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteSubscriber(id: number) {
  return apiRequest<{ id: number; deleted: boolean }>(`/api/newsletter/${id}`, {
    method: 'DELETE',
  });
}
