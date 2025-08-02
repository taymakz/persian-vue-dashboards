<script setup lang="ts">
import { motion } from 'motion-v'
import Content from './Content.vue'
import Theme from './theme.vue'
import UserOverview from './UserOverview.vue'

const mobileState = ref(false)
const route = useRoute()
watch(
  route,
  () => {
    mobileState.value = false
  },
)
</script>

<template>
  <div>
    <AnimatePresence>
      <motion.div
        v-if="mobileState" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
        class="fixed z-40 bg-black/60 backdrop-blur-xs inset-0" @click="mobileState = false"
      />
    </AnimatePresence>
    <!-- mobile -->
    <div class="lg:hidden fixed top-0 z-30 inset-x-0   bg-card border-b">
      <div class="container py-2 flex items-center justify-between ">
        <button class="size-10 p-1 rounded-md border flex items-center justify-center" @click="mobileState = !mobileState">
          <span class="icon-[material-symbols-light--menu-rounded] size-full" />
        </button>
      </div>
    </div>
    <!-- overlay -->
    <div
      :class="cn('h-svh w-70 sm:w-66 bg-card  flex flex-col overflow-hidden max-lg:fixed left-full top-0  z-50 max-lg:border-e max-lg:rounded-e-xl transition-transform duration-300',
                 { 'max-lg:-translate-x-full': mobileState },
      )"
    >
      <UserOverview />
      <Content />
      <div class="flex items-center justify-between border-t p-4 ">
        <Theme />
        <NuxtLink
          external target="_blank" class="flex items-center justify-center text-muted-foreground
         hover:text-primary duration-200 rounded-full border size-7" to="https://github.com/taymakz/vue-dashboards/tree/main/sidebar-rtl"
        >
          <span class="icon-[hugeicons--github] size-4" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
