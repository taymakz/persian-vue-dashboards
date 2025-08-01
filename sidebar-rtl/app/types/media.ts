export type MediaFileType = 'PHOTO' | 'DOCUMENT' | 'VIDEO' | 'ANIMATION'

export interface MediaType {
  id: number
  media_url: string
  placeholder_url: string
  file_type: MediaFileType
  caption: string
  size: number
  created_at: string
}
