import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadBlogImage, UploadResult } from '@/lib/blogService'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  onImageRemoved?: () => void
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  onImageRemoved,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const result = await uploadBlogImage(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadResult(result)

      if (result.success && result.url) {
        onImageUploaded(result.url)
        setTimeout(() => {
          setUploadResult(null)
          setUploadProgress(0)
        }, 2000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadResult({
        success: false,
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved()
    }
    setUploadResult(null)
    setUploadProgress(0)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={currentImage}
                alt="Current"
                className="w-full h-48 object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      {!currentImage && (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <CardContent className="p-6 text-center">
            {isUploading ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Mengupload gambar...</p>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP hingga 5MB
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Pilih Gambar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          uploadResult.success 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {uploadResult.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>
            {uploadResult.success 
              ? 'Gambar berhasil diupload!' 
              : uploadResult.error
            }
          </span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  )
}

export default ImageUpload
