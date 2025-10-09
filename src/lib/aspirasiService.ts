import { supabase } from './supabase';
import { retryWithBackoff, fallbackData } from './errorHandler';

export type AspirasiStatus = 'baru' | 'diproses' | 'selesai';

export interface Aspirasi {
  id: string;
  created_at: string;
  updated_at: string;
  nama: string;
  email: string;
  kategori: string;
  aspirasi: string;
  status: AspirasiStatus;
}

export interface CreateAspirasiInput {
  nama: string;
  email: string;
  kategori: string;
  aspirasi: string;
}

export async function createAspirasi(input: CreateAspirasiInput): Promise<boolean> {
  const { error } = await supabase.from('aspirations').insert([{ ...input }]);
  if (error) {
    console.error('❌ createAspirasi error:', error);
    return false;
  }
  return true;
}

export async function listAspirasi(status?: AspirasiStatus): Promise<Aspirasi[]> {
  let query = supabase.from('aspirations').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) {
    console.error('❌ listAspirasi error:', error);
    return [];
  }
  return (data as Aspirasi[]) || [];
}

export async function updateAspirasiStatus(id: string, status: AspirasiStatus): Promise<boolean> {
  const { error } = await supabase.from('aspirations').update({ status }).eq('id', id);
  if (error) {
    console.error('❌ updateAspirasiStatus error:', error);
    return false;
  }
  return true;
}

export async function deleteAspirasi(id: string): Promise<boolean> {
  const { error } = await supabase.from('aspirations').delete().eq('id', id);
  if (error) {
    console.error('❌ deleteAspirasi error:', error);
    return false;
  }
  return true;
}

export async function countNewAspirasi(): Promise<number> {
  try {
    return await retryWithBackoff(async () => {
      const { count, error } = await supabase
        .from('aspirations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'baru');
      
      if (error) {
        console.error('❌ countNewAspirasi error:', error);
        throw error;
      }
      
      return count ?? 0;
    });
  } catch (error) {
    console.error('❌ countNewAspirasi final error:', error);
    return fallbackData.newAspirasiCount;
  }
}


