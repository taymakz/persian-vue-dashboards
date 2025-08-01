<script setup lang="ts">
import type { MediaFileType, MediaType } from '~/types/media'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'
import { appDesktopStartMinWidth } from '~/constants'
import MediaUpload from './MediaUpload.vue'
import MediaUploadZone from './MediaUploadZone.vue'

const emit = defineEmits<{
  (e: 'created', data: MediaType): void
}>()

// Reuse form section
const [UseTemplate, MediaForm] = createReusableTemplate()
const isDesktop = useMediaQuery(appDesktopStartMinWidth)

const isOpen = ref(false)
const formData = ref({
  caption: '',
  media: undefined as File | undefined,
})

function handleFileSelect(file: File | undefined) {
  formData.value.media = file
}

function submit() {
  if (!formData.value.media) {
    toast.error('لطفاً یک فایل رسانه انتخاب کنید')
    return
  }

  // Create mock media item
  const newMedia: MediaType = {
    id: Date.now(),
    media_url: URL.createObjectURL(formData.value.media),
    file_type: getFileType(formData.value.media.name),
    caption: formData.value.caption || 'بدون توضیحات',
    size: formData.value.media.size,
    created_at: new Date().toISOString(),
  }

  emit('created', newMedia)
  toast.success('رسانه با موفقیت اضافه شد')

  // Reset form
  formData.value = { caption: '', media: undefined }
  isOpen.value = false
}

function getFileType(filename: string): MediaFileType {
  const extension = filename.split('.').pop()?.toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'PHOTO'
  }
  else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
    return 'VIDEO'
  }
  else if (['gif'].includes(extension || '')) {
    return 'ANIMATION'
  }
  else {
    return 'DOCUMENT'
  }
}
</script>

<template>
  <!-- Define the reusable template -->
  <UseTemplate>
    <form class="grid items-start gap-4 px-4 space-y-4" @submit.prevent="submit">
      <div class="grid gap-2">
        <Label for="caption">توضیحات رسانه</Label>
        <InputSecondary
          id="caption"
          v-model="formData.caption"
          label="توضیحاتی برای رسانه وارد کنید..."
        />
      </div>

      <div class="grid gap-2">
        <MediaUpload
          v-model="formData.media"
          file-type="ALL"
          @change="handleFileSelect"
        />
      </div>

      <Button type="submit" :disabled="!formData.media">
        اضافه کردن رسانه
      </Button>
    </form>
  </UseTemplate>

  <!-- Desktop Dialog -->
  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <MediaUploadZone>
        <div class="flex items-center gap-2">
          <span class="icon-[lucide--plus] size-5" />
          اضافه کردن رسانه جدید
        </div>
      </MediaUploadZone>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>اضافه کردن رسانه جدید</DialogTitle>
        <DialogDescription>
          فایل مورد نظر را انتخاب کرده و توضیحات آن را وارد کنید.
        </DialogDescription>
      </DialogHeader>
      <!-- Use the reusable template here -->
      <MediaForm />
    </DialogContent>
  </Dialog>

  <!-- Mobile Drawer -->
  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <MediaUploadZone>
        <div class="flex items-center gap-2">
          <span class="icon-[lucide--plus] size-5" />
          اضافه کردن رسانه جدید
        </div>
      </MediaUploadZone>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>اضافه کردن رسانه جدید</DrawerTitle>
        <DrawerDescription>
          فایل مورد نظر را انتخاب کرده و توضیحات آن را وارد کنید.
        </DrawerDescription>
      </DrawerHeader>
      <!-- Use the reusable template here -->
      <MediaForm />
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline">
            لغو
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
