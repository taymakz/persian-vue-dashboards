<script setup lang="ts">
import type { MediaType } from '~/types/media'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'

const { item } = defineProps<{
  item: MediaType
}>()

const emit = defineEmits<{
  (e: 'selected', data: MediaType): void
}>()

// Get file type icon
const fileTypeIcon = computed(() => {
  switch (item.file_type) {
    case 'PHOTO':
      return 'icon-[lucide--image]'
    case 'VIDEO':
      return 'icon-[lucide--video]'
    case 'ANIMATION':
      return 'icon-[lucide--film]'
    case 'DOCUMENT':
      return 'icon-[lucide--file-text]'
    default:
      return 'icon-[lucide--file]'
  }
})

// Get file type label
const fileTypeLabel = computed(() => {
  switch (item.file_type) {
    case 'PHOTO':
      return 'عکس'
    case 'VIDEO':
      return 'ویدیو'
    case 'ANIMATION':
      return 'انیمیشن'
    case 'DOCUMENT':
      return 'سند'
    default:
      return 'فایل'
  }
})

// Format file size
function formatSize(bytes: number): string {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function handleSelect() {
  emit('selected', item)
}
</script>

<template>
  <Card class="group cursor-pointer transition-transform duration-200 hover:scale-[1.02]" @click="handleSelect">
    <CardHeader>
      <div class="flex items-center justify-between p-2">
        <div class="flex items-center gap-2 ">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span class="size-4 text-primary" :class="fileTypeIcon" />
          </div>
          <span class="text-sm font-medium text-muted-foreground">
            {{ fileTypeLabel }}
          </span>
        </div>

        <span class="icon-[lucide--eye] size-4 text-muted-foreground opacity-0 group-hover:opacity-100 duration-200" />
      </div>
    </CardHeader>

    <CardContent class="space-y-3">
      <!-- Preview Area -->
      <div class="aspect-video w-full  bg-muted flex items-center justify-center overflow-hidden">
        <template v-if="item.placeholder_url || item.media_url">
          <img
            :src="item.media_url || item.placeholder_url"
            :alt="item.caption"
            class="w-full h-full object-cover"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          >
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center text-muted-foreground">
            <span class="size-12 mb-2" :class="fileTypeIcon" />

            <span class="text-xs">پیش‌نمایش در دسترس نیست</span>
          </div>
        </template>
      </div>

      <!-- Caption -->
      <div>
        <p class="text-sm  line-clamp-2 px-4 h-10" :title="item.caption">
          {{ item.caption }}
        </p>
      </div>
    </CardContent>

    <CardFooter class="p-4 space-y-2">
      <div class="w-full space-y-1">
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>حجم:
            <span class="font-comfortaa">{{ formatSize(item.size) }}</span>
          </span>
          <span>{{ formatDate(item.created_at) }}</span>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
