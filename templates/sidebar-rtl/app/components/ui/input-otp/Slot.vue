<script setup lang="ts">
import type { SlotProps } from 'vue-input-otp'

defineProps<SlotProps>()
</script>

<template>
  <div
    :class="
      cn(
        'relative size-14 text-xl',
        'flex items-center justify-center',
        'transition-all duration-300',
        'rounded-lg border',
        { 'border-primary': isActive },
      )
    "
  >
    <div v-if="char !== null">
      {{ char }}
    </div>

    <!-- Emulate a Fake Caret -->
    <div
      v-if="char === null && isActive"
      class="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center"
    >
      <div class="h-8 w-px rounded-full bg-white" />
    </div>
  </div>
</template>
