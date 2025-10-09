import { supabase } from './supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

class AuthService {
  private adminEmails = [
    import.meta.env.VITE_ADMIN_EMAIL || 'admin@dpr-ri.com'
  ]

  constructor() {
    // Debug: Log admin emails
    console.log('🔧 Admin emails configured:', this.adminEmails)
    console.log('🔧 VITE_ADMIN_EMAIL from env:', import.meta.env.VITE_ADMIN_EMAIL)
  }

  // Cek apakah user sudah login
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session?.user) {
        return null
      }

      return {
        id: session.user.id,
        email: session.user.email || '',
        role: this.isAdmin(session.user.email) ? 'admin' : 'user'
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Login dengan email dan password
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'Login gagal' }
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: this.isAdmin(data.user.email) ? 'admin' : 'user'
      }

      return { user, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { user: null, error: 'Terjadi kesalahan saat login' }
    }
  }

  // Register user baru
  async register(credentials: RegisterCredentials): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'Registrasi gagal' }
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: 'user' // Default role untuk user baru
      }

      return { user, error: null }
    } catch (error) {
      console.error('Register error:', error)
      return { user: null, error: 'Terjadi kesalahan saat registrasi' }
    }
  }

  // Logout
  async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { error: 'Terjadi kesalahan saat logout' }
    }
  }

  // Cek apakah user adalah admin
  private isAdmin(email: string | undefined): boolean {
    if (!email) {
      console.log('🔍 isAdmin: No email provided')
      return false
    }
    
    const isAdminUser = this.adminEmails.includes(email.toLowerCase())
    console.log('🔍 isAdmin check:', {
      email: email,
      adminEmails: this.adminEmails,
      isAdmin: isAdminUser
    })
    
    return isAdminUser
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: 'Terjadi kesalahan saat reset password' }
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: 'Terjadi kesalahan saat update password' }
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: this.isAdmin(session.user.email) ? 'admin' : 'user'
        }
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()
