import { requireSupabaseClient } from '../db/supabaseClient.js';
import { ContactRecord, ContactStatus } from '../types/backend.types.js';

interface InsertContactParams {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

function toContact(r: Record<string, unknown>): ContactRecord {
  return {
    id: Number(r.id),
    full_name: String(r.full_name),
    phone: String(r.phone),
    email: String(r.email ?? ''),
    subject: String(r.subject ?? ''),
    message: String(r.message ?? ''),
    status: String(r.status ?? 'new') as ContactStatus,
    created_at: String(r.created_at ?? ''),
  };
}

export const contactRepo = {
  async create(params: InsertContactParams): Promise<ContactRecord> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        full_name: params.fullName,
        phone: params.phone,
        email: params.email,
        subject: params.subject,
        message: params.message,
        status: 'new',
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return toContact(data as Record<string, unknown>);
  },

  async findAll(): Promise<ContactRecord[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => toContact(r as Record<string, unknown>));
  },

  async updateStatus(id: number, status: ContactStatus): Promise<ContactRecord | undefined> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toContact(data as Record<string, unknown>) : undefined;
  },
};
