<script setup lang="ts">
import type { MediaFileType, MediaType } from '~/types/media'
import Input from '~/components/ui/input/Input.vue'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'
import { mockMediaData } from '~/data/media'

useHead({
  title: 'رسانه ها',
})

const searchValue = ref('')
const selectedTypes = ref<MediaFileType[]>([])
const medias = ref<MediaType[]>([...mockMediaData])
const selectedMedia = ref<MediaType | null>(null)
const isOpenMediaDetail = ref(false)

// Computed filtered medias based on search and type filters
const filteredMedias = computed(() => {
  let filtered = medias.value

  // Filter by search query
  if (searchValue.value.trim()) {
    const query = searchValue.value.toLowerCase()
    filtered = filtered.filter(media =>
      media.caption.toLowerCase().includes(query),
    )
  }

  // Filter by types
  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(media =>
      selectedTypes.value.includes(media.file_type),
    )
  }

  return filtered
})

function handleCreation(newItem: MediaType) {
  medias.value.unshift(newItem)
}

function selectMedia(media: MediaType) {
  selectedMedia.value = media
  isOpenMediaDetail.value = true
}

function handleDeletion(id: number) {
  medias.value = medias.value.filter(i => i.id !== id)
}
</script>

<template>
  <div>
    <AppLayoutPageHeader>
      <div class="container">
        <AppLayoutPageTitle>
          مدیریت رسانه ها
        </AppLayoutPageTitle>
        <AppLayoutPageDescription>
          مشاهده لیست , اضافه کردن , ویرایش و حذف رسانه ها
        </AppLayoutPageDescription>
      </div>
    </AppLayoutPageHeader>

    <AppLayoutPageContent>
      <div class="container space-y-6">
        <!-- Upload Section -->
        <div class="mx-auto max-w-2xl">
          <AppMediasMediaAdd @created="handleCreation" />
        </div>

      <!-- Filters Section -->
        <div class="flex items-center justify-between">
          <InputSecondary
            v-model="searchValue" label="جستجو..." autocomplete="off" class="max-w-sm w-full"
            icon="icon-[ep--search]"
          />

          <AppMediasMediaFilters v-model="selectedTypes" />
        </div>

        <!-- Media Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in filteredMedias" :key="item.id">
            <AppMediasMediaCard :item="item" @selected="selectMedia" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredMedias.length === 0" class="text-center py-12">
          <Icon name="lucide:file-x" class="size-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-medium text-foreground mb-2">
            هیچ رسانه‌ای یافت نشد
          </h3>
          <p class="text-muted-foreground">
            {{ searchValue || selectedTypes.length > 0 ? 'فیلترهای خود را تغییر دهید یا جستجوی جدیدی انجام دهید' : 'برای شروع، رسانه جدیدی اضافه کنید' }}
          </p>
        </div>
      </div>
    </AppLayoutPageContent>

    <!-- Media Detail Modal -->
    <AppMediasMediaDetail
      v-if="isOpenMediaDetail && selectedMedia"
      v-model="isOpenMediaDetail"
      :item="selectedMedia"
      @deleted="handleDeletion"
    />
  </div>
</template>
