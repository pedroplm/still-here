const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export type UploadProgressHandler = (percent: number | ((prev: number) => number)) => void

export function validateImageFile(file: File | null): string | null {
  if (!file) return null
  if (!file.type.startsWith('image/')) {
    return 'Selecione um arquivo de imagem válido.'
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Imagem muito grande. Máximo de ${MAX_IMAGE_SIZE_MB}MB.`
  }
  return null
}

async function compressImage(file: File, maxDimension = 1200, quality = 0.8): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })
  if (!blob) return file

  return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
}

export async function uploadImage(
  file: File,
  onProgress?: UploadProgressHandler
): Promise<string> {
  onProgress?.(10)
  const compressed = await compressImage(file)
  onProgress?.(30)

  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('upload_preset', UPLOAD_PRESET)

  const progressTimer = setInterval(() => {
    if (onProgress) {
      onProgress((prev) => Math.min(95, (typeof prev === 'number' ? prev : 30) + 1))
    }
  }, 200)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload failed')
    }

    onProgress?.(100)
    const data = await res.json()
    return data.secure_url
  } finally {
    clearInterval(progressTimer)
  }
}

export function getOptimizedUrl(publicId: string, width = 500, height = 500): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${publicId}`
}
