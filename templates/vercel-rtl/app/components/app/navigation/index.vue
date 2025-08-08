<script setup lang="ts">
import type { NavigationLinkType } from '~/types/layout'
import { motion } from 'motion-v'

defineProps<{
  links: NavigationLinkType[]
}>()
const route = useRoute()
const hoveredLink = ref<string | null>(null)
const showScrollButton = ref(false)
const activeLink = ref<string | null>(route.path)
const { range } = useRange(0, 50, 0, 36)

function setActiveLink(to: string) {
  activeLink.value = to
}

function handleScroll() {
  const scrollY = window.scrollY
  showScrollButton.value = scrollY > 80
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'auto', // Immediate scroll without smooth animation
  })
}

onMounted(() => {
  // Set activeLink to current route on mount
  setTimeout(() => {
    activeLink.value = route.path
  }, 100)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="sticky top-0 bg-card border-b px-4 z-30 ">
    <div

      class="overflow-x-auto overflow-y-hidden scrollbar-none flex justify-between items-center gap-2"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <motion.div
        :animate="{
          translateX: -range,
        }"
        :transition="{ bounce: 0, duration: 0 }" class="flex items-center  text-sm w-fit min-w-max" @mouseleave="hoveredLink = null"
      >
        <NuxtLink
          v-for="link in links" :key="link.to" :to="link.to" :class="cn(
            'relative text-muted-foreground hover:text-foreground cursor-pointer py-4 px-4 no-underline whitespace-nowrap flex-shrink-0',
            { 'text-foreground': activeLink === link.to },
          )" @mouseenter="hoveredLink = link.to" @click.prevent="setActiveLink(link.to)"
        >
          <motion.span
            v-if="hoveredLink === link.to" layout-id="navigation-tab-hover"
            class="absolute inset-0 w-full h-10 top-1.5 bg-accent/40 rounded-md" :transition="{ duration: 0.2 }"
            :exit="{ opacity: 0 }" :initial="{ opacity: 1 }" :animate="{ opacity: 1 }"
          />

          <span class="relative">
            {{ link.title }}
          </span>

          <!-- Active link border -->
          <motion.span
            v-if="activeLink === link.to" layout-id="navigation-tab" :transition="{ duration: 0.1 }"
            class="absolute top-12.5 left-0 w-full h-0.5 bg-primary rounded-full pointer-events-none"
          />
        </NuxtLink>
      </motion.div>
      <button
        :class="cn('size-8 rounded-full hover:bg-accent/50 duration-200 flex items-center justify-center text-muted-foreground scale-80 opacity-0',
                   { 'opacity-100 scale-100': showScrollButton },
        )" @click="scrollToTop"
      >
        <span class="icon-[ic--round-arrow-upward] size-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
