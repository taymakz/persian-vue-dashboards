<script setup lang="ts">
import type { MediaType } from '~/types/media'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { appDesktopStartMinWidth } from '~/constants'

const { item } = defineProps<{
  item: MediaType
}>()
const emit = defineEmits<{
  (e: 'deleted', data: number): void
}>()

// Reuse template section
const [UseTemplate, MediaDetailContent] = createReusableTemplate()
const isDesktop = useMediaQuery(appDesktopStartMinWidth)

const isOpen = defineModel<boolean>({ required: false, default: false })

const deleteModal = ref(false)
const loading = ref(false)

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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function handleDelete() {
  if (loading.value)
    return

  loading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  emit('deleted', item.id)
  toast.success('رسانه با موفقیت حذف شد')
  deleteModal.value = false
  isOpen.value = false

  loading.value = false
}

function handleDownload() {
  if (item.media_url) {
    const link = document.createElement('a')
    link.href = item.media_url
    link.download = `media_${item.id}`
    link.click()
    toast.success('دانلود فایل شروع شد')
  }
  else {
    toast.error('لینک دانلود در دسترس نیست')
  }
}
</script>

<template>
  <!-- Define the reusable template -->
  <UseTemplate>
    <div class="grid items-start gap-4 px-4">
      <!-- Media Preview -->
      <div class="space-y-4">
        <div class="aspect-video w-full rounded-lg bg-card border flex items-center justify-center overflow-hidden">
          <template v-if="item.placeholder_url || item.media_url">
            <img
              :src="item.media_url || item.placeholder_url"

              :alt="item.caption"
              class="w-full h-full object-cover"
            >
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center text-muted-foreground">
              <span :class="fileTypeIcon" class="size-16 mb-3" />
              <span class="text-sm">پیش‌نمایش در دسترس نیست</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Media Info -->
      <div class="space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">
            جزئیات رسانه
          </h3>
          <p class="text-muted-foreground">
            {{ item.caption }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="space-y-1">
            <p class="text-muted-foreground">
              نوع:
            </p>
            <div class="flex items-center gap-2">
              <span :class="fileTypeIcon" class="size-4" />
              {{ fileTypeLabel }}
            </div>
          </div>

          <div class="space-y-1">
            <p class="text-muted-foreground">
              حجم:
            </p>
            <p class="font-comfortaa">
              {{ formatSize(item.size) }}
            </p>
          </div>

          <div class="col-span-2 space-y-1">
            <p class="text-muted-foreground">
              تاریخ ایجاد:
            </p>
            <p>{{ formatDate(item.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-2 pt-2">
        <Button class="w-full" @click="handleDownload">
          <span class="icon-[lucide--download] size-4" />
          دانلود
        </Button>

        <AlertDialog v-model:open="deleteModal">
          <AlertDialogTrigger as-child>
            <Button variant="warning" class="w-full">
              <span class="icon-[lucide--trash-2] size-4" />

              حذف
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأیید حذف</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف این رسانه اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
                <Button variant="warning" :loading @click="handleDelete">
                  <span class="icon-[lucide--trash-2] size-4" />
                  حذف
                </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </UseTemplate>

  <!-- Desktop Dialog -->
  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogContent class="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>جزئیات رسانه</DialogTitle>
        <DialogDescription>
          مشاهده اطلاعات کامل رسانه انتخاب شده
        </DialogDescription>
      </DialogHeader>
      <!-- Use the reusable template here -->
      <MediaDetailContent />
    </DialogContent>
  </Dialog>

  <!-- Mobile Drawer -->
  <Drawer v-else v-model:open="isOpen">
    <DrawerContent class="max-h-[90vh]">
      <DrawerHeader>
        <DrawerTitle>جزئیات رسانه</DrawerTitle>
        <DrawerDescription>
          مشاهده اطلاعات کامل رسانه انتخاب شده
        </DrawerDescription>
      </DrawerHeader>
      <div class="overflow-y-auto container pb-4">
        <!-- Use the reusable template here -->
        <MediaDetailContent />
      </div>
    </DrawerContent>
  </Drawer>
</template>
