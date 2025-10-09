import { z } from 'zod'

// Schema untuk validasi form pendaftaran
export const registrationSchema = z.object({
  name: z.string()
    .min(2, 'Nama harus minimal 2 karakter')
    .max(100, 'Nama tidak boleh lebih dari 100 karakter')
    .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  
  email: z.string()
    .email('Format email tidak valid')
    .max(255, 'Email tidak boleh lebih dari 255 karakter'),
  
  phone: z.string()
    .min(10, 'Nomor telepon harus minimal 10 digit')
    .max(15, 'Nomor telepon tidak boleh lebih dari 15 digit')
    .regex(/^[0-9+\-\s()]+$/, 'Nomor telepon hanya boleh mengandung angka, +, -, spasi, dan tanda kurung'),
  
  address: z.string()
    .min(10, 'Alamat harus minimal 10 karakter')
    .max(500, 'Alamat tidak boleh lebih dari 500 karakter'),
  
  birthdate: z.string()
    .min(1, 'Tanggal lahir harus diisi')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 17 && age <= 100
    }, 'Usia harus antara 17-100 tahun'),
  
  gender: z.enum(['Laki-laki', 'Perempuan'], {
    errorMap: () => ({ message: 'Pilih jenis kelamin yang valid' })
  }),
  
  education: z.string()
    .max(50, 'Pendidikan tidak boleh lebih dari 50 karakter')
    .optional(),
  
  occupation: z.string()
    .max(100, 'Pekerjaan tidak boleh lebih dari 100 karakter')
    .optional()
})

// Schema untuk validasi blog post
export const blogPostSchema = z.object({
  title: z.string()
    .min(5, 'Judul harus minimal 5 karakter')
    .max(255, 'Judul tidak boleh lebih dari 255 karakter')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F\-_.,!?]+$/, 'Judul mengandung karakter yang tidak diizinkan'),
  
  content: z.string()
    .min(50, 'Konten harus minimal 50 karakter')
    .max(50000, 'Konten tidak boleh lebih dari 50.000 karakter'),
  
  excerpt: z.string()
    .min(20, 'Ringkasan harus minimal 20 karakter')
    .max(500, 'Ringkasan tidak boleh lebih dari 500 karakter'),
  
  slug: z.string()
    .min(3, 'Slug harus minimal 3 karakter')
    .max(100, 'Slug tidak boleh lebih dari 100 karakter')
    .regex(/^[a-z0-9\-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  
  author: z.string()
    .min(2, 'Penulis harus minimal 2 karakter')
    .max(100, 'Penulis tidak boleh lebih dari 100 karakter'),
  
  tags: z.array(z.string())
    .max(10, 'Maksimal 10 tag')
    .optional(),
  
  status: z.enum(['draft', 'published'], {
    errorMap: () => ({ message: 'Status harus draft atau published' })
  })
})

// Schema untuk validasi portfolio
export const portfolioSchema = z.object({
  title: z.string()
    .min(5, 'Judul harus minimal 5 karakter')
    .max(255, 'Judul tidak boleh lebih dari 255 karakter'),
  
  description: z.string()
    .min(20, 'Deskripsi harus minimal 20 karakter')
    .max(5000, 'Deskripsi tidak boleh lebih dari 5.000 karakter'),
  
  slug: z.string()
    .min(3, 'Slug harus minimal 3 karakter')
    .max(100, 'Slug tidak boleh lebih dari 100 karakter')
    .regex(/^[a-z0-9\-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  
  client: z.string()
    .min(2, 'Nama klien harus minimal 2 karakter')
    .max(100, 'Nama klien tidak boleh lebih dari 100 karakter'),
  
  category: z.string()
    .min(2, 'Kategori harus minimal 2 karakter')
    .max(50, 'Kategori tidak boleh lebih dari 50 karakter'),
  
  technologies: z.array(z.string())
    .min(1, 'Minimal 1 teknologi')
    .max(20, 'Maksimal 20 teknologi'),
  
  project_url: z.string()
    .url('URL proyek tidak valid')
    .optional()
    .or(z.literal('')),
  
  github_url: z.string()
    .url('URL GitHub tidak valid')
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['draft', 'published'], {
    errorMap: () => ({ message: 'Status harus draft atau published' })
  }),
  
  featured: z.boolean()
})

// Schema untuk validasi gallery image
export const galleryImageSchema = z.object({
  title: z.string()
    .min(3, 'Judul harus minimal 3 karakter')
    .max(255, 'Judul tidak boleh lebih dari 255 karakter'),
  
  description: z.string()
    .min(10, 'Deskripsi harus minimal 10 karakter')
    .max(1000, 'Deskripsi tidak boleh lebih dari 1.000 karakter'),
  
  slug: z.string()
    .min(3, 'Slug harus minimal 3 karakter')
    .max(100, 'Slug tidak boleh lebih dari 100 karakter')
    .regex(/^[a-z0-9\-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  
  image_url: z.string()
    .url('URL gambar tidak valid')
    .or(z.string().startsWith('data:image/', 'Format data URL tidak valid')),
  
  location: z.string()
    .min(2, 'Lokasi harus minimal 2 karakter')
    .max(100, 'Lokasi tidak boleh lebih dari 100 karakter'),
  
  category: z.string()
    .min(2, 'Kategori harus minimal 2 karakter')
    .max(50, 'Kategori tidak boleh lebih dari 50 karakter'),
  
  photographer: z.string()
    .min(2, 'Nama photographer harus minimal 2 karakter')
    .max(100, 'Nama photographer tidak boleh lebih dari 100 karakter'),
  
  status: z.enum(['draft', 'published'], {
    errorMap: () => ({ message: 'Status harus draft atau published' })
  }),
  
  featured: z.boolean()
})

// Schema untuk validasi admin login
export const adminLoginSchema = z.object({
  email: z.string()
    .email('Format email tidak valid')
    .max(255, 'Email tidak boleh lebih dari 255 karakter'),
  
  password: z.string()
    .min(8, 'Password harus minimal 8 karakter')
    .max(255, 'Password tidak boleh lebih dari 255 karakter')
})

// Schema untuk validasi search query
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Kata kunci pencarian harus diisi')
    .max(100, 'Kata kunci pencarian tidak boleh lebih dari 100 karakter')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F\-_.,!?]+$/, 'Kata kunci mengandung karakter yang tidak diizinkan')
})

// Utility functions untuk validasi
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: ['Terjadi kesalahan validasi'] } }
  }
}

// Sanitasi input berdasarkan schema
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  let sanitized = input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .trim()

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  return sanitized
}
