<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h1 :class="cn('font-medium text-clamp-xl container', $props.class)">
    <slot />
  </h1>
</template>
