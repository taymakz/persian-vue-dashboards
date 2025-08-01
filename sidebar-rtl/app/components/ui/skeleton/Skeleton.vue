<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('skeleton bg-secondary rounded-lg', props.class)" />
</template>

<style scoped>
.dark .skeleton {
  --skeleton-bg: #141414;
}

.skeleton {
  --skeleton-bg: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.skeleton::before {
  position: absolute;
  width: 100%;
  height: 100%;
  content: "";
  background: linear-gradient(
    110deg,
    rgba(0, 0, 0, 0) 25%,
    var(--skeleton-bg) 50%,
    rgba(0, 0, 0, 0) 75%
  );
  background-size: 400% 100%;
  animation: shimmer 4s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
