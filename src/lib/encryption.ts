import CryptoJS from 'crypto-js'

// Key untuk enkripsi (dalam production, gunakan environment variable)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-encryption-key-2024'

/**
 * Enkripsi data sebelum disimpan ke localStorage
 * @param data - Data yang akan dienkripsi
 * @returns Data yang sudah dienkripsi
 */
export function encryptData(data: string): string {
  try {
    if (!data) return ''
    
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Error encrypting data:', error)
    return ''
  }
}

/**
 * Dekripsi data dari localStorage
 * @param encryptedData - Data yang sudah dienkripsi
 * @returns Data yang sudah didekripsi
 */
export function decryptData(encryptedData: string): string {
  try {
    if (!encryptedData) return ''
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    
    if (!result) {
      console.warn('Failed to decrypt data - possibly corrupted or wrong key')
      return ''
    }
    
    return result
  } catch (error) {
    console.error('Error decrypting data:', error)
    return ''
  }
}

/**
 * Simpan data terenkripsi ke localStorage
 * @param key - Key untuk localStorage
 * @param data - Data yang akan disimpan
 * @returns boolean apakah berhasil disimpan
 */
export function setEncryptedItem(key: string, data: string): boolean {
  try {
    const encryptedData = encryptData(data)
    if (!encryptedData) return false
    
    localStorage.setItem(key, encryptedData)
    return true
  } catch (error) {
    console.error('Error setting encrypted item:', error)
    return false
  }
}

/**
 * Ambil data terenkripsi dari localStorage
 * @param key - Key untuk localStorage
 * @returns Data yang sudah didekripsi atau null jika gagal
 */
export function getEncryptedItem(key: string): string | null {
  try {
    const encryptedData = localStorage.getItem(key)
    if (!encryptedData) return null
    
    const decryptedData = decryptData(encryptedData)
    return decryptedData || null
  } catch (error) {
    console.error('Error getting encrypted item:', error)
    return null
  }
}

/**
 * Hapus data terenkripsi dari localStorage
 * @param key - Key untuk localStorage
 */
export function removeEncryptedItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing encrypted item:', error)
  }
}

/**
 * Simpan data JSON terenkripsi ke localStorage
 * @param key - Key untuk localStorage
 * @param data - Object yang akan disimpan
 * @returns boolean apakah berhasil disimpan
 */
export function setEncryptedJSON(key: string, data: unknown): boolean {
  try {
    const jsonString = JSON.stringify(data)
    return setEncryptedItem(key, jsonString)
  } catch (error) {
    console.error('Error setting encrypted JSON:', error)
    return false
  }
}

/**
 * Ambil data JSON terenkripsi dari localStorage
 * @param key - Key untuk localStorage
 * @returns Object yang sudah didekripsi atau null jika gagal
 */
export function getEncryptedJSON(key: string): unknown | null {
  try {
    const decryptedData = getEncryptedItem(key)
    if (!decryptedData) return null
    
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Error getting encrypted JSON:', error)
    return null
  }
}

/**
 * Cek apakah data di localStorage terenkripsi
 * @param key - Key untuk localStorage
 * @returns boolean apakah data terenkripsi
 */
export function isEncryptedItem(key: string): boolean {
  try {
    const data = localStorage.getItem(key)
    if (!data) return false
    
    // Cek apakah data mengandung karakter enkripsi AES
    return data.includes('U2FsdGVkX1') || data.length > 100
  } catch (error) {
    console.error('Error checking encrypted item:', error)
    return false
  }
}

/**
 * Migrasi data dari unencrypted ke encrypted
 * @param key - Key untuk localStorage
 * @returns boolean apakah migrasi berhasil
 */
export function migrateToEncrypted(key: string): boolean {
  try {
    const unencryptedData = localStorage.getItem(key)
    if (!unencryptedData) return true // Tidak ada data untuk dimigrasi
    
    // Cek apakah sudah terenkripsi
    if (isEncryptedItem(key)) return true
    
    // Enkripsi data yang ada
    const success = setEncryptedItem(key, unencryptedData)
    if (success) {
      console.log(`Successfully migrated ${key} to encrypted storage`)
    }
    
    return success
  } catch (error) {
    console.error('Error migrating to encrypted storage:', error)
    return false
  }
}

/**
 * Bersihkan semua data terenkripsi
 */
export function clearEncryptedData(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (isEncryptedItem(key)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing encrypted data:', error)
  }
}
