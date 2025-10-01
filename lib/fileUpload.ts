import { FILE_UPLOAD_CONFIGS, FileUploadConfig } from '@/types/api'

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  maxFiles?: number
  configKey?: keyof typeof FILE_UPLOAD_CONFIGS
}

export class FileUploadValidator {
  private config: FileUploadConfig

  constructor(options: FileUploadOptions = {}) {
    if (options.configKey) {
      this.config = FILE_UPLOAD_CONFIGS[options.configKey]
    } else {
      this.config = {
        maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB default
        allowedTypes: options.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png'],
        maxFiles: options.maxFiles || 5
      }
    }
  }

  validateFiles(files: File[]): FileValidationResult {
    const errors: string[] = []

    // Check file count
    if (files.length > this.config.maxFiles) {
      errors.push(`Maximum ${this.config.maxFiles} files allowed`)
    }

    // Check each file
    files.forEach((file, index) => {
      // Check file size
      if (file.size > this.config.maxSize) {
        errors.push(`File ${index + 1} (${file.name}) exceeds maximum size of ${this.formatFileSize(this.config.maxSize)}`)
      }

      // Check file type
      if (!this.config.allowedTypes.includes(file.type)) {
        errors.push(`File ${index + 1} (${file.name}) has unsupported type. Allowed types: ${this.config.allowedTypes.join(', ')}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateSingleFile(file: File): FileValidationResult {
    return this.validateFiles([file])
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle array of files or strings
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(key, item)
          } else if (typeof item === 'string') {
            formData.append(`${key}[${index}]`, item)
          }
        })
      } else if (value instanceof File) {
        formData.append(key, value)
      } else if (typeof value === 'object') {
        // Handle nested objects (like socialLinks)
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null) {
            formData.append(`${key}.${subKey}`, subValue as string)
          }
        })
      } else {
        formData.append(key, value.toString())
      }
    }
  })

  return formData
}

// Specific validators for different upload types
export const validateProfilePicture = (file: File): FileValidationResult => {
  const validator = new FileUploadValidator({ configKey: 'profilePicture' })
  return validator.validateSingleFile(file)
}

export const validatePortfolioMedia = (files: File[]): FileValidationResult => {
  const validator = new FileUploadValidator({ configKey: 'portfolioMedia' })
  return validator.validateFiles(files)
}

export const validateServiceMedia = (files: File[]): FileValidationResult => {
  const validator = new FileUploadValidator({ configKey: 'serviceMedia' })
  return validator.validateFiles(files)
}

export const validateMeetingAttachment = (file: File): FileValidationResult => {
  const validator = new FileUploadValidator({ configKey: 'meetingAttachment' })
  return validator.validateSingleFile(file)
}

export const validateServiceRequestImages = (files: File[]): FileValidationResult => {
  const validator = new FileUploadValidator({ configKey: 'serviceRequestImages' })
  return validator.validateFiles(files)
}

export const validateRatingAttachments = (files: File[]): FileValidationResult => {
  const validator = new FileUploadValidator({ configKey: 'ratingAttachments' })
  return validator.validateFiles(files)
}

// Utility function to compress images before upload
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Utility function to preview files before upload
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    } else {
      reject(new Error('File is not an image'))
    }
  })
}

// Utility function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Utility function to format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Utility function to check if file is image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

// Utility function to check if file is video
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/')
}

// Utility function to check if file is document
export const isDocumentFile = (file: File): boolean => {
  return file.type.startsWith('application/') || file.type === 'text/plain'
}
