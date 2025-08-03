<script setup lang="ts">
import type { MediaFileType } from '~/types/media'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Define the model for selected types
const selectedTypes = defineModel<MediaFileType[]>({ required: true, default: [] })

// List of all possible media types
const mediaTypes: MediaFileType[] = ['PHOTO', 'DOCUMENT', 'VIDEO', 'ANIMATION']

// Human-readable labels for display
const typeLabels: Record<MediaFileType, string> = {
  PHOTO: 'عکس',
  DOCUMENT: 'سند',
  VIDEO: 'ویدیو',
  ANIMATION: 'انیمیشن',
}

// Toggle a type in the selected types array
function toggleType(selectedType: MediaFileType) {
  if (selectedTypes.value.includes(selectedType)) {
    // Remove the type if already selected
    selectedTypes.value = selectedTypes.value.filter(t => t !== selectedType)
  }
  else {
    // Add the type if not selected
    selectedTypes.value = [...selectedTypes.value, selectedType]
  }
}

// Check if a type is selected
const isSelected = computed(() => (selectedType: MediaFileType) =>
  selectedTypes.value.includes(selectedType),
)

// Count of selected filters
const selectedCount = computed(() => selectedTypes.value.length)
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" class="gap-2">
        <span class="icon-[lucide--filter] size-4" />
        فیلتر نوع رسانه
        <div v-if="selectedCount > 0" class="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs">
          {{ selectedCount }}
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-64 p-0" align="end">
      <div>
        <div class="space-y-2 border-b pb-2 px-4 pt-4">
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-medium text-sm">
              نوع رسانه
            </h4>
            <div v-if="selectedCount > 0">
              <div

                class="flex items-center text-xs text-warning cursor-pointer  hover:text-warning/80 duration-200"
                @click="selectedTypes = []"
              >
                <span class="icon-[lucide--x] size-4" />
                پاک کردن 
              </div>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">
            نوع رسانه‌هایی که می‌خواهید مشاهده کنید را انتخاب کنید
          </p>
        </div>

        <div class="space-y-2 p-2">
          <div
            v-for="type in mediaTypes"
            :key="type"
            class="flex items-center "
          >
            <div
              class="w-full flex items-center py-1.5 px-4 text-sm
               rounded-md gap-2 cursor-pointer duration-200"
              :class="isSelected(type) ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'"
              @click="toggleType(type)"
            >
              <div
                class="w-4 h-4 rounded border-2 flex items-center justify-center"
                :class="isSelected(type) ? 'bg-primary border-primary' : 'border-muted-foreground'"
              >
                <span class="icon-[lucide--check] size-3 text-primary-foreground" />
              </div>
              {{ typeLabels[type] }}
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
