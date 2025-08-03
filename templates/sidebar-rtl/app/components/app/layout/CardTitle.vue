<script setup lang="ts">
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <div class="flex items-center gap-2 mb-6">
    <div class=" size-10 rounded-full bg-background border text-primary-lighter flex items-center justify-center">
      <i class=" size-5" :class="icon" />
    </div>
    <p class="font-medium text-sm   bg-gradient-to-l bg-clip-text text-transparent from-brand-lighter to-brand/80">
      {{ title }}
    </p>
  </div>
</template>
