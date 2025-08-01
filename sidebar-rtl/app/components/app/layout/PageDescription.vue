<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h4 :class="cn('text-muted-foreground text-sm mt-1.5', $props.class)">
    <slot />
  </h4>
</template>
