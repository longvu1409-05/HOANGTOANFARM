import { apiRequest } from './apiClient';

export interface SubscriberDto {
  id: number;
  email: string;
  created_at: string;
}

export async function subscribeNewsletterEmail(email: string) {
  return apiRequest<{ subscriber: SubscriberDto; alreadySubscribed: boolean }>('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function fetchSubscribers() {
  const res = await apiRequest<SubscriberDto[]>('/api/newsletter');
  return res.data;
}
