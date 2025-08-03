<script setup lang="ts">
defineProps<{
  state: boolean
  withVersion?: boolean
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

const runtime = useRuntimeConfig()
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion v-if="state" :variants="{
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    }" initial="hidden" animate="visible" exit="hidden"
      class="bg-sc-background absolute inset-0  flex flex-col items-center justify-center py-20 z-50">
      <Motion class="bg-primary/25 flex size-14 rotate-45 items-center justify-center duration-1000"
        :class="[rotateStep % 2 === 0 ? 'rounded-lg' : 'rounded-2xl']" :animate="{
          transform: `rotate(${rotateStep * 90}deg)`,
          transition: { duration: 1 },
        }" />
      <i class="icon-[eos-icons--three-dots-loading] text-primary absolute size-10" />
      <div v-if="withVersion" class="absolute bottom-10">
        <p class="text-muted-foreground safe-bottom-margin font-sans text-xs">
          {{ runtime.public.appVersion }}
        </p>
      </div>
    </Motion>
  </AnimatePresence>
</template>
