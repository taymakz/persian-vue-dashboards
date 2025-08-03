<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { motion } from 'motion-v'

defineProps<{
  state: boolean
  class?: HTMLAttributes['class']
}>()
const rotateStep = ref(0)
let rotateInterval: ReturnType<typeof setInterval> | null = null

// Function to rotate by 45 degrees with delay
function rotate() {
  rotateInterval = setInterval(() => {
    rotateStep.value = rotateStep.value + 1
  }, 1500) // Rotate every 1.5 seconds
}

onMounted(() => {
  rotate()
})

onUnmounted(() => {
  if (rotateInterval) {
    clearInterval(rotateInterval)
  }
})
</script>

<template>
  <AnimatePresence :initial="false">
    <motion.div v-if="state" :variants="{
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    }" initial="hidden" animate="visible" exit="hidden"
      class="absolute inset-0 z-100 flex items-center justify-center backdrop-blur-md">
      <motion.div class="bg-primary/25 flex size-14 rotate-45 items-center justify-center duration-1000"
        :class="[rotateStep % 2 === 0 ? 'rounded-lg' : 'rounded-2xl']" :animate="{
          transform: `rotate(${rotateStep * 90}deg)`,
          transition: { duration: 1 },
        }" />
      <i class="icon-[eos-icons--three-dots-loading] text-primary absolute size-10" />
    </motion.div>
  </AnimatePresence>
</template>
