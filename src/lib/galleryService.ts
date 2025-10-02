import { supabase, GalleryImage, CreateGalleryImage } from './supabase';

// Fungsi untuk membuat slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Fungsi untuk mengambil semua gambar galeri
export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching gallery images:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in getAllGalleryImages:', error);
    throw error;
  }
};

// Fungsi untuk mengambil gambar galeri yang published
export const getPublishedGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching published gallery images:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in getPublishedGalleryImages:', error);
    throw error;
  }
};

// Fungsi untuk mengambil gambar galeri berdasarkan kategori
export const getGalleryImagesByCategory = async (category: string): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching gallery images by category:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in getGalleryImagesByCategory:', error);
    throw error;
  }
};

// Fungsi untuk mengambil gambar galeri featured
export const getFeaturedGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching featured gallery images:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in getFeaturedGalleryImages:', error);
    throw error;
  }
};

// Fungsi untuk mengambil gambar galeri berdasarkan slug
export const getGalleryImageBySlug = async (slug: string): Promise<GalleryImage | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('❌ Error fetching gallery image by slug:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Error in getGalleryImageBySlug:', error);
    throw error;
  }
};

// Fungsi untuk membuat gambar galeri dengan slug otomatis
export const createGalleryImageWithSlug = async (imageData: Omit<CreateGalleryImage, 'slug'>): Promise<boolean> => {
  try {
    const slug = generateSlug(imageData.title);
    
    // Check if slug already exists
    const { data: existingImage } = await supabase
      .from('gallery_images')
      .select('slug')
      .eq('slug', slug)
      .single();

    let finalSlug = slug;
    if (existingImage) {
      // If slug exists, add timestamp to make it unique
      finalSlug = `${slug}-${Date.now()}`;
    }

    const galleryImageWithSlug = {
      ...imageData,
      slug: finalSlug
    };

    const { error } = await supabase
      .from('gallery_images')
      .insert([galleryImageWithSlug]);

    if (error) {
      console.error('❌ Error creating gallery image:', error);
      return false;
    }

    console.log('✅ Gallery image created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in createGalleryImageWithSlug:', error);
    return false;
  }
};

// Fungsi untuk update gambar galeri berdasarkan slug
export const updateGalleryImageBySlug = async (slug: string, imageData: Partial<CreateGalleryImage>): Promise<boolean> => {
  try {
    // If title is being updated, generate new slug
    let updateData = { ...imageData };
    if (imageData.title) {
      const newSlug = generateSlug(imageData.title);
      if (newSlug !== slug) {
        // Check if new slug already exists
        const { data: existingImage } = await supabase
          .from('gallery_images')
          .select('slug')
          .eq('slug', newSlug)
          .single();

        let finalSlug = newSlug;
        if (existingImage) {
          finalSlug = `${newSlug}-${Date.now()}`;
        }
        updateData = { ...updateData, slug: finalSlug };
      }
    }

    const { error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('slug', slug);

    if (error) {
      console.error('❌ Error updating gallery image:', error);
      return false;
    }

    console.log('✅ Gallery image updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in updateGalleryImageBySlug:', error);
    return false;
  }
};

// Fungsi untuk update gambar galeri berdasarkan ID
export const updateGalleryImageById = async (id: string, imageData: Partial<CreateGalleryImage>): Promise<boolean> => {
  try {
    // If title is being updated, generate new slug
    let updateData = { ...imageData };
    if (imageData.title) {
      const newSlug = generateSlug(imageData.title);
      
      // Check if new slug already exists (but not for current image)
      const { data: existingImage } = await supabase
        .from('gallery_images')
        .select('slug')
        .eq('slug', newSlug)
        .neq('id', id)
        .single();

      let finalSlug = newSlug;
      if (existingImage) {
        finalSlug = `${newSlug}-${Date.now()}`;
      }
      updateData = { ...updateData, slug: finalSlug };
    }

    const { error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('❌ Error updating gallery image:', error);
      return false;
    }

    console.log('✅ Gallery image updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in updateGalleryImageById:', error);
    return false;
  }
};

// Fungsi untuk menghapus gambar galeri
export const deleteGalleryImage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting gallery image:', error);
      return false;
    }

    console.log('✅ Gallery image deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in deleteGalleryImage:', error);
    return false;
  }
};

// Fungsi untuk mendapatkan statistik galeri
export const getGalleryStats = async () => {
  try {
    const [totalResult, publishedResult, draftResult, categoriesResult] = await Promise.all([
      supabase.from('gallery_images').select('id', { count: 'exact' }),
      supabase.from('gallery_images').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('gallery_images').select('id', { count: 'exact' }).eq('status', 'draft'),
      supabase.from('gallery_images').select('category').eq('status', 'published')
    ]);

    const uniqueCategories = [...new Set((categoriesResult.data || []).map(item => item.category))];

    return {
      total: totalResult.count || 0,
      published: publishedResult.count || 0,
      draft: draftResult.count || 0,
      categories: uniqueCategories.length
    };
  } catch (error) {
    console.error('❌ Error getting gallery stats:', error);
    return {
      total: 0,
      published: 0,
      draft: 0,
      categories: 0
    };
  }
};

// Fungsi untuk search gambar galeri
export const searchGalleryImages = async (query: string): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error searching gallery images:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in searchGalleryImages:', error);
    throw error;
  }
};
