<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <img src="/logo.png" alt="منوفای - منوی دیجیتال رستوران و کافی‌شاپ" :class="cn('h-10 w-auto', $props.class)">
</template>
