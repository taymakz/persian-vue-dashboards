export interface ImageCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
  format?: 'jpeg' | 'webp' | 'png'
  maintainAspectRatio?: boolean
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

/**
 * Compress an image file to meet size and quality requirements
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {},
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxSizeKB = 100,
    format = 'webp',
    maintainAspectRatio = true,
  } = options

  const originalSize = file.size

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate dimensions
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight,
          maintainAspectRatio,
        )

        canvas.width = width
        canvas.height = height

        // Draw and compress
        if (!ctx) {
          throw new Error('Could not get canvas context')
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Try different quality levels to meet size requirement
        compressToTargetSize(canvas, format, quality, maxSizeKB, file.name)
          .then((compressedFile) => {
            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: compressedFile.size,
              compressionRatio: Math.round((1 - compressedFile.size / originalSize) * 100),
            })
          })
          .catch(reject)
      }
      catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean,
): { width: number, height: number } {
  if (!maintainAspectRatio) {
    return { width: maxWidth, height: maxHeight }
  }

  const aspectRatio = originalWidth / originalHeight

  let width = originalWidth
  let height = originalHeight

  // Scale down if necessary
  if (width > maxWidth) {
    width = maxWidth
    height = width / aspectRatio
  }

  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  }
}

/**
 * Compress canvas to target file size
 */
async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  format: string,
  initialQuality: number,
  maxSizeKB: number,
  fileName: string,
): Promise<File> {
  const maxSizeBytes = maxSizeKB * 1024
  let quality = initialQuality
  let attempt = 0
  const maxAttempts = 10

  while (attempt < maxAttempts) {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, `image/${format}`, quality)
    })

    if (!blob) {
      throw new Error('Failed to create blob from canvas')
    }

    // If size is acceptable, return the file
    if (blob.size <= maxSizeBytes || quality <= 0.1) {
      const extension = format === 'jpeg' ? 'jpg' : format
      const newFileName = fileName.replace(/\.[^/.]+$/, `.${extension}`)
      return new File([blob], newFileName, { type: `image/${format}` })
    }

    // Reduce quality for next attempt
    quality *= 0.8
    attempt++
  }

  // If we can't meet the size requirement, return the smallest version
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, `image/${format}`, 0.1)
  })

  if (!blob) {
    throw new Error('Failed to create final blob')
  }

  const extension = format === 'jpeg' ? 'jpg' : format
  const newFileName = fileName.replace(/\.[^/.]+$/, `.${extension}`)
  return new File([blob], newFileName, { type: `image/${format}` })
}

/**
 * Preset configurations for different image types
 */
export const compressionPresets = {
  banner: {
    maxWidth: 1920,
    maxHeight: 800,
    quality: 0.8,
    maxSizeKB: 100,
    format: 'webp' as const,
  },
  logo: {
    maxWidth: 80,
    maxHeight: 80,
    quality: 0.9,
    maxSizeKB: 100,
    format: 'webp' as const,
  },
  product: {
    maxWidth: 450,
    maxHeight: 325,
    quality: 0.85,
    maxSizeKB: 50,
    format: 'webp' as const,
  },
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
}
