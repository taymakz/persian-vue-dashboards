<script setup lang="ts">
import type { NavigationLinkType } from '../types/layout'

useHead({
  bodyAttrs: {
    class: 'overflow-y-scroll',
  },
})
const links: NavigationLinkType[] = [
  { to: '/dashboard', title: 'داشبورد' },
  { to: '/fields', title: 'فیلد ها' },
]
</script>

<template>
  <div class="flex h-svh w-full bg-background">
    <main class="relative min-h-svh h-full  w-full grow ">
      <!-- header -->
      <AppHeader />
      <AppNavigation :links />
      <div class="w-full">

    
            <slot />
      
  
      </div>
    </main>
  </div>
</template>
