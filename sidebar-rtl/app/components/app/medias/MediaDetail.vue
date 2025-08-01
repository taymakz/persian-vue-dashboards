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
      return 'lucide:image'
    case 'VIDEO':
      return 'lucide:video'
    case 'ANIMATION':
      return 'lucide:film'
    case 'DOCUMENT':
      return 'lucide:file-text'
    default:
      return 'lucide:file'
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
        <div class="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          <template v-if="item.file_type === 'PHOTO' && item.media_url">
            <img
              :src="item.media_url"
              :alt="item.caption"
              class="w-full h-full object-contain"
            >
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center text-muted-foreground">
              <Icon :name="fileTypeIcon" class="size-16 mb-3" />
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
            <span class="text-muted-foreground">نوع:</span>
            <div class="flex items-center gap-2">
              <Icon :name="fileTypeIcon" class="size-4" />
              {{ fileTypeLabel }}
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-muted-foreground">حجم:</span>
            <span>{{ formatSize(item.size) }}</span>
          </div>

          <div class="col-span-2 space-y-1">
            <span class="text-muted-foreground">تاریخ ایجاد:</span>
            <span>{{ formatDate(item.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-2 pt-2">
        <Button class="flex-1" @click="handleDownload">
          <Icon name="lucide:download" class="size-4 ml-2" />
          دانلود
        </Button>

        <AlertDialog v-model:open="deleteModal">
          <AlertDialogTrigger as-child>
            <Button variant="alert" class="flex-1">
              <Icon name="lucide:trash-2" class="size-4 ml-2" />
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
              <AlertDialogAction :disabled="loading" @click="handleDelete">
                <Icon v-if="loading" name="lucide:loader-2" class="size-4 ml-2 animate-spin" />
                <Icon v-else name="lucide:trash-2" class="size-4 ml-2" />
                {{ loading ? 'در حال حذف...' : 'حذف' }}
              </AlertDialogAction>
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
      <DrawerHeader class="text-left">
        <DrawerTitle>جزئیات رسانه</DrawerTitle>
        <DrawerDescription>
          مشاهده اطلاعات کامل رسانه انتخاب شده
        </DrawerDescription>
      </DrawerHeader>
      <div class="overflow-y-auto">
        <!-- Use the reusable template here -->
        <MediaDetailContent />
      </div>
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline">
            بستن
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
