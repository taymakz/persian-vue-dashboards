<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/cn'
import { ChevronLeft } from 'lucide-vue-next'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    :class="cn('[&>svg]:h-3.5 [&>svg]:w-3.5', props.class)"
  >
    <slot>
      <ChevronLeft />
    </slot>
  </li>
</template>
