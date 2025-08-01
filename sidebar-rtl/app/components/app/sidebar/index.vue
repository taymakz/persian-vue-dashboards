<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { motion } from 'motion-v'
import Content from './Content.vue'
import Theme from './theme.vue'
import UserOverview from './UserOverview.vue'

const mobileState = useStorage('mobile-sidebar-state', false)
</script>

<template>
  <div >
    <AnimatePresence>
      <motion.div v-if="mobileState" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
        class="fixed z-40 bg-black/60 backdrop-blur-xs inset-0" @click="mobileState = false" />
    </AnimatePresence>
    <!-- overlay -->

    <div :class="cn('h-svh w-70 sm:w-66 bg-card  flex flex-col overflow-hidden max-lg:fixed left-full top-0  z-50 max-lg:border-e max-lg:rounded-e-xl transition-transform duration-300',
      { '-translate-x-full': mobileState },
    )">
      <UserOverview />
      <Content />
      <Theme />
    </div>
  </div>
</template>
