<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  class?: HTMLAttributes['class']
  fileType?: 'ALL' | 'PHOTO' | 'DOCUMENT' | 'VIDEO'
  title?: string
}

const props = defineProps<FileUploadProps>()

const emit = defineEmits<{
  (e: 'change', value: File | undefined): void
}>()

const selectedFile = defineModel<File | undefined>({ required: true, default: undefined })
const fileInputRef = ref<HTMLInputElement | null>(null)
const isActive = ref<boolean>(false)

const allowedExtensions = computed(() => {
  switch (props.fileType) {
    case 'PHOTO':
      return ['jpg', 'jpeg', 'png', 'gif', 'webp']
    case 'VIDEO':
      return ['mp4', 'avi', 'mov', 'wmv', 'webm']
    case 'DOCUMENT':
      return ['pdf', 'doc', 'docx', 'txt', 'rtf']
    default:
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'mov', 'wmv', 'pdf', 'doc', 'docx', 'txt']
  }
})

const displayTitle = computed(() => {
  if (props.title)
    return props.title
  switch (props.fileType) {
    case 'PHOTO':
      return 'انتخاب عکس'
    case 'VIDEO':
      return 'انتخاب ویدیو'
    case 'DOCUMENT':
      return 'انتخاب سند'
    default:
      return 'انتخاب فایل'
  }
})

function validateFile(newFile: File): boolean {
  const extension = newFile.name.split('.').pop()?.toLowerCase()
  if (!extension || !allowedExtensions.value.includes(extension)) {
    toast.error(`فرمت فایل مجاز نیست. فرمت‌های مجاز: ${allowedExtensions.value.join(', ')}`)
    return false
  }

  const sizeLimit = ['jpg', 'jpeg', 'png', 'gif'].includes(extension) ? 1 * 1024 * 1024 : 50 * 1024 * 1024 // 1MB for images, 50MB for others
  if (newFile.size > sizeLimit) {
    toast.error(`حجم فایل بیش از حد مجاز است. حداکثر حجم: ${sizeLimit / (1024 * 1024)}MB`)
    return false
  }

  return true
}

function handleFileChange(newFile: File) {
  if (validateFile(newFile)) {
    selectedFile.value = newFile
    emit('change', newFile)
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFileChange(file)
  }
}

function handleClick() {
  fileInputRef.value?.click()
}

function handleEnter() {
  isActive.value = true
}

function handleLeave() {
  isActive.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isActive.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileChange(files[0])
  }
}

function clearFile() {
  selectedFile.value = undefined
  emit('change', undefined)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}
</script>

<template>
  <div :class="props.class">
    <input
      ref="fileInputRef"
      type="file"
      :accept="allowedExtensions.map(ext => `.${ext}`).join(',')"
      class="hidden"
      @change="onFileChange"
    >

    <!-- File Upload Area -->
    <div
      v-if="!selectedFile"
      class="w-full cursor-pointer"
      @click="handleClick"
      @dragover.prevent
      @dragenter.prevent="handleEnter"
      @dragleave.prevent="handleLeave"
      @drop.prevent="handleDrop"
      @mouseover="handleEnter"
      @mouseleave="handleLeave"
    >
      <div class="group/file relative block w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary">
        <div class="flex flex-col items-center justify-center space-y-4">
          <div
            class="flex size-12 items-center justify-center rounded-lg bg-muted transition-all duration-200 text-muted-foreground"
            :class="isActive ? 'scale-105 bg-primary text-primary-foreground' : ''"
          >
            <span class="icon-[lucide--upload] size-6  " />
          </div>

          <div class="text-center">
            <p class="text-sm font-medium">
              {{ displayTitle }}
            </p>
            <p class="text-xs text-muted-foreground mt-1">
              یا فایل را اینجا بکشید و رها کنید
            </p>

          </div>
        </div>
      </div>
    </div>

    <!-- Selected File Preview -->
    <div v-else class="space-y-3">
      <div class="flex items-center justify-between rounded-lg border bg-card p-3">
        <div class="flex items-center gap-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <span class="icon-[lucide--file] size-5 text-primary " />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium truncate">
              {{ selectedFile.name }}
            </p>
            <p class="text-xs text-muted-foreground font-comfortaa">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>

        <button
          class="flex items-center justify-center size-8 rounded-md hover:bg-accent/50"
          @click="clearFile"
        >
          <span class="icon-[lucide--x] size-4  " />
        </button>
      </div>

      <Button
        variant="outline"
        class="w-full"
        @click="handleClick"
      >
        <span class="icon-[lucide--refresh-cw] size-4  " />

        تغییر فایل
      </Button>
    </div>
  </div>
</template>
