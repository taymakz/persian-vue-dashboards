<script setup lang="ts">
import type { ProductCardType } from '~/types/product'
import { watchDebounced } from '@vueuse/core'

import { motion } from 'motion-v'
import { reactive, ref, watch } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'
import Popover from '~/components/ui/popover/Popover.vue'
import PopoverContent from '~/components/ui/popover/PopoverContent.vue'
import PopoverTrigger from '~/components/ui/popover/PopoverTrigger.vue'
import { usePaginatedData } from '~/composables/search'

// Static sort options
const sortOptions = [
  { label: 'جدیدترین', value: '-updated_at' },
  { label: 'قدیمی‌ترین', value: 'updated_at' },
  { label: 'تاریخ ایجاد (جدیدترین)', value: '-created_at' },
  { label: 'تاریخ ایجاد (قدیمی‌ترین)', value: 'created_at' },
]

// Static product data
const products = ref<ProductCardType[]>([
  {
    id: 1,
    title: 'محصول شماره یک',

    is_public: true,
    updated_at: '2025-07-30T12:00:00Z',
    price: '120000',
  },
  {
    id: 2,
    title: 'محصول شماره دو',

    is_public: false,
    updated_at: '2025-07-29T09:30:00Z',
    price: '95000',
  },
  {
    id: 3,
    title: 'محصول شماره سه',

    is_public: true,
    updated_at: '2025-07-28T15:45:00Z',
    price: '78000',
  },
  {
    id: 4,
    title: 'محصول شماره چهار',

    is_public: true,
    updated_at: '2025-07-27T18:20:00Z',
    price: '150000',
  },
])

const filters = reactive({
  search: '',
  ordering: '-updated_at',
})
const searchValue = ref('')
const sortValue = ref('-updated_at')
const showSort = ref(false)

// Static loading states for demo
const isLoading = ref(false)
const hasMore = ref(false)
const firstInitLoading = ref(false)
</script>

<template>
  <div>
    <AppLayoutPageHeader>
      <div class="flex items-center justify-between container">
        <div>
          <AppLayoutPageTitle>
            لیست محصولات
          </AppLayoutPageTitle>
          <AppLayoutPageDescription>
            لیست محصولات شما در اینجا نمایش داده می‌شود. می‌توانید محصولات را جستجو و مرتب کنید.
          </AppLayoutPageDescription>
        </div>
      </div>
    </AppLayoutPageHeader>

    <AppLayoutPageContent>
      <!-- Filters -->
      <div class="flex items-center justify-between mb-10">
        <div class="flex gap-2 w-full justify-between">
          <InputSecondary
            v-model="searchValue" label="جستجو..." autocomplete="off" class="max-w-sm w-full"
            icon="icon-[ep--search]"
          />
          <Popover v-model:open="showSort">
            <PopoverTrigger as-child>
              <Button variant="outline" class="w-[180px] flex items-center justify-between">
                <span class="truncate">{{ sortOptions.find(o => o.value === sortValue)?.label || 'مرتب سازی' }}</span>
                <span class="icon-[lucide--chevron-down] ml-2 text-base" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="max-w-[200px] p-0 overflow-hidden">
              <div class="flex flex-col">
                <button
                  v-for="option in sortOptions" :key="option.value"
                  class="px-4 py-2 text-sm text-right hover:bg-accent/50  w-full"
                  :class="{ 'font-semibold text-brand': sortValue === option.value }"
                  @click="sortValue = option.value; showSort = false"
                >
                  {{ option.label }}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <!-- Result -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 ">
        <template v-if="firstInitLoading">
          <AppProductsCardSkeleton v-for="i in 10" :key="i" />
        </template>
        <template v-else>
          <AnimatePresence>
            <motion.div v-for="item in products" :key="item.id" layout>
              <AppProductsCard :item />
            </motion.div>
          </AnimatePresence>

          <template v-if="isLoading">
            <AppProductsCardSkeleton v-for="i in 10" :key="i" />
          </template>
        </template>
      </div>
      <!-- empty message -->
      <template v-if="!isLoading && products.length === 0">
        <AppLayoutEmptyMessage />
      </template>
      <div v-if="!hasMore && products.length > 0" class="text-center text-muted-foreground mt-10 text-xs">
        هیچ محصول دیگری برای نمایش وجود ندارد.
      </div>
    </AppLayoutPageContent>
  </div>
</template>
