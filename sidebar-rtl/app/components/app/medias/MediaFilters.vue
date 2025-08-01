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
        <Icon name="lucide:filter" class="size-4" />
        فیلتر نوع رسانه
        <div v-if="selectedCount > 0" class="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs">
          {{ selectedCount }}
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-64" align="end">
      <div class="space-y-3">
        <div class="space-y-2">
          <h4 class="font-medium text-sm">
            نوع رسانه
          </h4>
          <p class="text-xs text-muted-foreground">
            نوع رسانه‌هایی که می‌خواهید مشاهده کنید را انتخاب کنید
          </p>
        </div>

        <div class="space-y-2">
          <div
            v-for="type in mediaTypes"
            :key="type"
            class="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Button
              variant="ghost"
              size="sm"
              class="w-full justify-start gap-2"
              :class="isSelected(type) ? 'bg-primary/10 text-primary' : ''"
              @click="toggleType(type)"
            >
              <div
                class="w-4 h-4 rounded border-2 flex items-center justify-center"
                :class="isSelected(type) ? 'bg-primary border-primary' : 'border-muted-foreground'"
              >
                <Icon
                  v-if="isSelected(type)"
                  name="lucide:check"
                  class="size-3 text-primary-foreground"
                />
              </div>
              {{ typeLabels[type] }}
            </Button>
          </div>
        </div>

        <div v-if="selectedCount > 0" class="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            class="w-full text-muted-foreground hover:text-foreground"
            @click="selectedTypes = []"
          >
            <Icon name="lucide:x" class="size-4 ml-2" />
            پاک کردن همه
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
