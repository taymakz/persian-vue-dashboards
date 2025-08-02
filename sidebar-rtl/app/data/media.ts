import type { MediaType } from '~/types/media'

export type MediaFileType = 'PHOTO' | 'DOCUMENT' | 'VIDEO' | 'ANIMATION'

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFileType(): MediaFileType {
  const types: MediaFileType[] = ['PHOTO', 'DOCUMENT', 'VIDEO', 'ANIMATION']
  const index = getRandomInt(0, types.length - 1)
  return types[index] ?? 'PHOTO'
}

function getRandomCaption(type: MediaFileType): string {
  switch (type) {
    case 'PHOTO': return 'عکس تصادفی'
    case 'DOCUMENT': return 'سند تصادفی'
    case 'VIDEO': return 'ویدیو تصادفی'
    case 'ANIMATION': return 'انیمیشن تصادفی'
    default: return 'فایل تصادفی'
  }
}

function getRandomUrl(type: MediaFileType): string {
  switch (type) {
    case 'PHOTO': return `https://picsum.photos/800/600?random=${getRandomInt(1, 100)}`
    case 'DOCUMENT': return ''
    case 'VIDEO': return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
    case 'ANIMATION': return `https://picsum.photos/400/300?random=${getRandomInt(1, 100)}`
    default: return ''
  }
}

function getPlaceholderUrl(type: MediaFileType): string {
  if (type === 'PHOTO')
    return ''
  // Use a generic placeholder image for non-photo types
  return `https://picsum.photos/400/300?random=${getRandomInt(1, 100)}`
}

export function generateRandomMedia(count: number): MediaType[] {
  const media: MediaType[] = []
  for (let i = 1; i <= count; i++) {
    const fileType = getRandomFileType()
    media.push({
      id: i,
      media_url: getRandomUrl(fileType),
      placeholder_url: getPlaceholderUrl(fileType),
      file_type: fileType,
      caption: getRandomCaption(fileType),
      size: getRandomInt(500_000, 20_000_000),
      created_at: new Date(Date.now() - getRandomInt(0, 30) * 86400000).toISOString(),
    })
  }
  return media
}

// Example usage:
export const mockMediaData: MediaType[] = generateRandomMedia(10)
