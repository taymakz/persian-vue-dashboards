import type { MediaType } from '~/types/media'

export const mockMediaData: MediaType[] = [
  {
    id: 1,
    message_id: 'MSG_001',
    file_id: 'FILE_12345',
    caption: 'تصویر نمونه برای تست',
    size: 2048576, // 2MB
    type: 'image/jpeg',
    file_type: 'PHOTO',
    download_link: 'https://picsum.photos/800/600?random=1',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    message_id: 'MSG_002',
    file_id: 'FILE_23456',
    caption: 'فایل PDF مهم',
    size: 5242880, // 5MB
    type: 'application/pdf',
    file_type: 'DOCUMENT',
    download_link: '#',
    created_at: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    message_id: 'MSG_003',
    file_id: 'FILE_34567',
    caption: 'ویدیو آموزشی',
    size: 15728640, // 15MB
    type: 'video/mp4',
    file_type: 'VIDEO',
    download_link: '#',
    created_at: '2024-01-13T09:15:00Z',
  },
  {
    id: 4,
    message_id: 'MSG_004',
    file_id: 'FILE_45678',
    caption: 'انیمیشن GIF',
    size: 1048576, // 1MB
    type: 'image/gif',
    file_type: 'ANIMATION',
    download_link: 'https://picsum.photos/400/300?random=2',
    created_at: '2024-01-12T16:45:00Z',
  },
  {
    id: 5,
    message_id: 'MSG_005',
    file_id: 'FILE_56789',
    caption: 'عکس طبیعت زیبا',
    size: 3145728, // 3MB
    type: 'image/png',
    file_type: 'PHOTO',
    download_link: 'https://picsum.photos/800/600?random=3',
    created_at: '2024-01-11T12:00:00Z',
  },
  {
    id: 6,
    message_id: 'MSG_006',
    file_id: 'FILE_67890',
    caption: 'مستندات پروژه',
    size: 7340032, // 7MB
    type: 'application/pdf',
    file_type: 'DOCUMENT',
    download_link: '#',
    created_at: '2024-01-10T08:30:00Z',
  },
]
