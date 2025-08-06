<script setup lang="ts">
import { useTextDirection } from '@vueuse/core'

import { Toaster } from '@/components/ui/sonner'
import { appDesktopStartMinWidth, appTitle } from './constants'
import 'vue-sonner/style.css'

const textDirection = useTextDirection({ initialValue: 'rtl' })
const dir = computed(() => textDirection.value === 'rtl' ? 'rtl' : 'ltr')
const color = useColorMode()
const isDesktop = useMediaQuery(appDesktopStartMinWidth)

callOnce(() => {
  useAuthenticateStore().UpdateUserSession()
})

useHead({
  titleTemplate: (titleChunk) => {
    // If the page has a title, use: "Page Title | {appTitle}"
    // Otherwise, use the full {appTitle}
    return titleChunk ? `${titleChunk} | ${appTitle}` : appTitle
  },
  templateParams: {
    siteName: appTitle,
    separator: '|',
  },
  bodyAttrs: {
    class: 'overflow-hidden',
  },
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :size="3" />
      <div>
        <NuxtPage />
      </div>
    </NuxtLayout>
    <!-- Toast -->
    <div class="fixed z-100">
      <Toaster
        :theme="(color.value as 'dark') || 'light'"
        :position="!isDesktop ? 'top-center' : dir === 'rtl' ? 'bottom-left' : 'bottom-right'"
        close-button
        rich-colors
        :toast-options="{
          style: {
            padding: '24px 32px',
            fontSize: '14px',
            fontFamily: 'Vazir',
          },
          duration: 5000,
        }"
      />
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to,
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
