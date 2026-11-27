import { apiRequest, withApiFallback } from './apiClient';
import { localFallbackStore } from './localFallbackStore';

export interface SubscriberDto {
  id: number;
  email: string;
  created_at: string;
}

export async function subscribeNewsletterEmail(email: string) {
  return withApiFallback(
    () =>
      apiRequest<{ subscriber: SubscriberDto; alreadySubscribed: boolean }>('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    () => {
      const data = localFallbackStore.subscribeNewsletter(email);
      return {
        success: true,
        message: data.alreadySubscribed
          ? `Email ${email} đã đăng ký nhận tin trước đó rồi!`
          : `Đã đăng ký nhận ưu đãi thành công cho ${data.subscriber.email}!`,
        data,
      };
    }
  );
}

export async function fetchSubscribers() {
  return withApiFallback(
    async () => {
      const res = await apiRequest<SubscriberDto[]>('/api/newsletter');
      return res.data;
    },
    () => localFallbackStore.listSubscribers()
  );
}
