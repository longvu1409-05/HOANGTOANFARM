import { requireSupabaseClient } from '../db/supabaseClient.js';
import { SubscriberRecord } from '../types/backend.types.js';

export const newsletterRepo = {
  async findByEmail(email: string): Promise<SubscriberRecord | undefined> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .ilike('email', email.trim().toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data
      ? { id: Number(data.id), email: String(data.email), created_at: String(data.created_at) }
      : undefined;
  },

  async create(email: string): Promise<SubscriberRecord> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return { id: Number(data.id), email: String(data.email), created_at: String(data.created_at) };
  },

  async findAll(): Promise<SubscriberRecord[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: Number(r.id),
      email: String(r.email),
      created_at: String(r.created_at),
    }));
  },

  async remove(id: number): Promise<boolean> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  },
};
