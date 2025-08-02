<script setup lang="ts">
import type { MediaFileType, MediaType } from '~/types/media'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import InputSecondary from '@/components/ui/input/InputSecondary.vue'
import { appDesktopStartMinWidth } from '~/constants'
import { mockMediaData } from '~/data/media'
import MediaAdd from './MediaAdd.vue'
import MediaFilters from './MediaFilters.vue'

interface Props {
  modelValue?: MediaType[]
  multiple?: boolean
  types?: MediaFileType[]
  title?: string
  description?: string
  triggerText?: string
  triggerIcon?: string
  maxSelections?: number
  immediate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: false,
  types: () => ['PHOTO', 'VIDEO', 'DOCUMENT', 'ANIMATION'],
  title: 'انتخاب رسانه',
  description: 'رسانه‌های مورد نظر خود را انتخاب کنید',
  triggerText: 'انتخاب رسانه',
  triggerIcon: 'icon-[lucide--image]',
  maxSelections: undefined,
  immediate: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: MediaType[]): void
}>()

// Reuse template section
const [UseTemplate, MediaSelectContent] = createReusableTemplate()
const isDesktop = useMediaQuery(appDesktopStartMinWidth)

const isOpen = ref(false)
const searchValue = ref('')
const selectedTypes = ref<MediaFileType[]>([])
const medias = ref<MediaType[]>([...mockMediaData])
const localSelectedMedias = ref<MediaType[]>([...props.modelValue])

// Computed filtered medias based on search, type filters, and allowed types
const filteredMedias = computed(() => {
  let filtered = medias.value

  // Filter by allowed types from props
  filtered = filtered.filter(media => props.types.includes(media.file_type))

  // Filter by search query
  if (searchValue.value.trim()) {
    const query = searchValue.value.toLowerCase()
    filtered = filtered.filter(media =>
      media.caption.toLowerCase().includes(query),
    )
  }

  // Filter by selected types
  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(media =>
      selectedTypes.value.includes(media.file_type),
    )
  }

  return filtered
})

// Check if media is selected
function isMediaSelected(media: MediaType): boolean {
  return localSelectedMedias.value.some(selected => selected.id === media.id)
}

// Toggle media selection
function toggleMediaSelection(media: MediaType) {
  const isSelected = isMediaSelected(media)

  if (isSelected) {
    // Remove from selection
    localSelectedMedias.value = localSelectedMedias.value.filter(
      selected => selected.id !== media.id,
    )
  }
  else {
    // Add to selection
    if (props.multiple) {
      // Check max selections limit
      if (props.maxSelections && localSelectedMedias.value.length >= props.maxSelections) {
        toast.error(`حداکثر ${props.maxSelections} رسانه قابل انتخاب است`)
        return
      }
      localSelectedMedias.value.push(media)
    }
    else {
      // Single selection - replace current selection
      localSelectedMedias.value = [media]
    }
  }

  // If immediate mode is enabled and it's single selection, emit immediately
  if (props.immediate && !props.multiple && !isSelected && localSelectedMedias.value.length > 0) {
    emit('update:modelValue', [...localSelectedMedias.value])
    isOpen.value = false
    toast.success('رسانه انتخاب شد')
  }
}

// Handle media creation from upload
function handleMediaCreation(newMedia: MediaType) {
  medias.value.unshift(newMedia)
  toast.success('رسانه جدید اضافه شد')
}

// Confirm selection and close modal
function confirmSelection() {
  emit('update:modelValue', [...localSelectedMedias.value])
  isOpen.value = false
  toast.success(
    props.multiple
      ? `${localSelectedMedias.value.length} رسانه انتخاب شد`
      : 'رسانه انتخاب شد',
  )
}

// Cancel selection and revert changes
function cancelSelection() {
  localSelectedMedias.value = [...props.modelValue]
  isOpen.value = false
}

// Clear all selections
function clearSelections() {
  localSelectedMedias.value = []
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  localSelectedMedias.value = [...newValue]
}, { deep: true })

// Get selection count text
const selectionCountText = computed(() => {
  const count = localSelectedMedias.value.length
  if (count === 0)
    return 'هیچ رسانه‌ای انتخاب نشده'
  if (props.multiple) {
    return `${count} رسانه انتخاب شده`
  }
  return '1 رسانه انتخاب شده'
})
</script>

<template>
  <!-- Define the reusable template -->
  <UseTemplate>
    <div class="flex flex-col gap-3">
      <!-- Search and Filters -->
      <div class="flex items-center justify-between gap-4">
        <InputSecondary
          v-model="searchValue"
          label="جستجو در رسانه‌ها..."
          autocomplete="off"
          class="max-w-sm w-full"
          icon="icon-[ep--search]"
        />
        <MediaFilters v-model="selectedTypes" :allowed-types="types" />
      </div>

      <!-- Selection Info -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">{{ selectionCountText }}</span>
          <Badge v-if="maxSelections" variant="secondary" class="text-xs">
            حداکثر {{ maxSelections }}
          </Badge>
        </div>
        <Button
          v-if="localSelectedMedias.length > 0"
          variant="ghost"
          size="sm"
          @click="clearSelections"
        >
          پاک کردن همه
        </Button>
      </div>

      <!-- Media Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        <div
          v-for="item in filteredMedias"
          :key="item.id"
          class="relative group cursor-pointer"
          @click="toggleMediaSelection(item)"
        >
          <!-- Media Card -->
          <div
            class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200"
            :class="[
              isMediaSelected(item)
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50',
            ]"
          >
            <!-- Image Preview -->
            <template v-if="item.file_type === 'PHOTO' && item.media_url">
              <img
                :src="item.media_url"
                :alt="item.caption"
                class="w-full h-full object-cover"
              >
            </template>

            <!-- File Type Icon for non-images -->
            <template v-else>
              <div class="w-full h-full flex items-center justify-center bg-muted">
                <span
                  class="size-12 text-muted-foreground"
                  :class="[
                    item.file_type === 'VIDEO'
                      ? 'icon-[lucide--video]'
                      : item.file_type === 'ANIMATION'
                        ? 'icon-[lucide--film]'
                        : 'icon-[lucide--file-text]',
                  ]"
                />
              </div>
            </template>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

            <!-- Selected Overlay -->
            <div
              v-if="isMediaSelected(item)"
              class="absolute left-2 top-2 bg-primary text-primary-foreground rounded-full size-6 p-0.5 flex items-center justify-center"
            >
              <span class="icon-[lucide--check] size-full " />
            </div>
          </div>

          <!-- Media Info -->
          <div class="mt-2 space-y-1">
            <p class="text-xs text-muted-foreground truncate">
              {{ item.caption }}
            </p>
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {{
                  item.file_type === 'PHOTO'
                    ? 'عکس'
                    : item.file_type === 'VIDEO'
                      ? 'ویدیو'
                      : item.file_type === 'ANIMATION'
                        ? 'انیمیشن'
                        : 'سند'
                }}
              </span>
              <span>{{ Math.round(item.size / 1024) }} KB</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMedias.length === 0" class="text-center py-8">
        <span class="icon-[lucide--image-off] size-12 text-muted-foreground mx-auto mb-3 block" />
        <h3 class="text-sm font-medium text-foreground mb-1">
          هیچ رسانه‌ای یافت نشد
        </h3>
        <p class="text-xs text-muted-foreground">
          {{ searchValue || selectedTypes.length > 0 ? 'فیلترهای خود را تغییر دهید' : 'رسانه جدیدی اضافه کنید' }}
        </p>
      </div>
    </div>
  </UseTemplate>

  <!-- Desktop Dialog -->
  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" class=" w-full">
        <span :class="triggerIcon" class="size-4" />
        {{ triggerText }}
        <Badge v-if="modelValue.length > 0" variant="secondary" class="ml-2">
          {{ modelValue.length }}
        </Badge>
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-4xl grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
      <DialogHeader class="pt-4 px-4">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <!-- Use the reusable template here -->
      <div class="p-4 overflow-y-auto">
        <MediaSelectContent />
      </div>
      <!-- Action Buttons -->
      <DialogFooter class=" flex gap-2 pt-4 bg-card z-10 border-t p-4">
        <Button variant="outline" @click="cancelSelection">
          بستن
        </Button>
        <MediaAdd @created="handleMediaCreation">
          <Button variant="success">
            رسانه جدید
          </Button>
        </MediaAdd>
        <Button
          class="flex-1"
          :disabled="localSelectedMedias.length === 0"
          @click="confirmSelection"
        >
          <span class="icon-[lucide--check] size-4 ml-2" />
          {{ localSelectedMedias.length > 0 ? 'تأیید انتخاب' : 'انتخاب کنید' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Mobile Drawer -->
  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <Button variant="outline" class=" w-full">
        <span :class="triggerIcon" class="size-4" />
        {{ triggerText }}
        <Badge v-if="modelValue.length > 0" variant="secondary" class="ml-2">
          {{ modelValue.length }}
        </Badge>
      </Button>
    </DrawerTrigger>
    <DrawerContent class="max-h-[90vh] ">
      <DrawerHeader>
        <DrawerTitle>{{ title }}</DrawerTitle>
        <DrawerDescription>{{ description }}</DrawerDescription>
      </DrawerHeader>
      <div class="h-full overflow-y-auto px-4  pb-20">
        <!-- Use the reusable template here -->

        <MediaSelectContent />

        <!-- Action Buttons -->
        <div class="fixed bottom-0 inset-x-0 flex gap-2 pt-4 bg-card z-10 border-t p-4">
          <Button variant="outline" @click="cancelSelection">
            بستن
          </Button>
          <MediaAdd @created="handleMediaCreation">
            <Button variant="success">
              رسانه جدید
            </Button>
          </MediaAdd>
          <Button
            class="flex-1"
            :disabled="localSelectedMedias.length === 0"
            @click="confirmSelection"
          >
            <span class="icon-[lucide--check] size-4 ml-2" />
            {{ localSelectedMedias.length > 0 ? 'تأیید انتخاب' : 'انتخاب کنید' }}
          </Button>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>
