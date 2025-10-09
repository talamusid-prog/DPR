import { supabase } from './supabase';

export interface Kegiatan {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'sidang' | 'rapat' | 'kunjungan' | 'acara' | 'lainnya';
  status: 'terjadwal' | 'berlangsung' | 'selesai' | 'dibatalkan';
  participants?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateKegiatan {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'sidang' | 'rapat' | 'kunjungan' | 'acara' | 'lainnya';
  status: 'terjadwal' | 'berlangsung' | 'selesai' | 'dibatalkan';
  participants?: string[];
}

// Get all kegiatan
export const getAllKegiatan = async (): Promise<Kegiatan[]> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching kegiatan:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllKegiatan:', error);
    throw error;
  }
};

// Get kegiatan by ID
export const getKegiatanById = async (id: string): Promise<Kegiatan | null> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching kegiatan:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getKegiatanById:', error);
    throw error;
  }
};

// Create new kegiatan
export const createKegiatan = async (kegiatan: CreateKegiatan): Promise<Kegiatan> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .insert([{
        title: kegiatan.title,
        description: kegiatan.description,
        date: kegiatan.date,
        time: kegiatan.time,
        location: kegiatan.location,
        type: kegiatan.type,
        status: kegiatan.status,
        participants: kegiatan.participants || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating kegiatan:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createKegiatan:', error);
    throw error;
  }
};

// Update kegiatan
export const updateKegiatan = async (id: string, kegiatan: Partial<CreateKegiatan>): Promise<Kegiatan> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .update({
        title: kegiatan.title,
        description: kegiatan.description,
        date: kegiatan.date,
        time: kegiatan.time,
        location: kegiatan.location,
        type: kegiatan.type,
        status: kegiatan.status,
        participants: kegiatan.participants || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating kegiatan:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateKegiatan:', error);
    throw error;
  }
};

// Delete kegiatan
export const deleteKegiatan = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('kegiatan')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting kegiatan:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteKegiatan:', error);
    throw error;
  }
};

// Get kegiatan by date range
export const getKegiatanByDateRange = async (startDate: string, endDate: string): Promise<Kegiatan[]> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching kegiatan by date range:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getKegiatanByDateRange:', error);
    throw error;
  }
};

// Get kegiatan by type
export const getKegiatanByType = async (type: string): Promise<Kegiatan[]> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching kegiatan by type:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getKegiatanByType:', error);
    throw error;
  }
};

// Get kegiatan by status
export const getKegiatanByStatus = async (status: string): Promise<Kegiatan[]> => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('status', status)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching kegiatan by status:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getKegiatanByStatus:', error);
    throw error;
  }
};
