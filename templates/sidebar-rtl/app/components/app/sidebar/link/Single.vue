<script setup lang="ts">
import type { LinkType } from '../Content.vue'

defineProps<{
  link: LinkType
}>()
const route = useRoute()
function isCurrentRoute(link: string) {
  if (link === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(link)
}
</script>

<template>
  <NuxtLink :to="link.to" :class="cn('relative flex flex-row font-medium items-center gap-2 rounded-xl p-2 text-start [overflow-wrap:anywhere] text-muted-foreground hover',
    { 'text-primary bg-primary/10 ': isCurrentRoute(link.to!) },
    { 'hover:bg-accent/50 hover:text-accent-foreground/80': !isCurrentRoute(link.to!) },
  )">
    <i :class="cn('size-5  duration-200', link.icon,
    )" />
    <p class="text-sm duration-200">
      {{ link.label }}
    </p>
  </NuxtLink>
</template>
