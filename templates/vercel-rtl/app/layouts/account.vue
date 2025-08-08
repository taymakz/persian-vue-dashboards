<script setup lang="ts">
import type { NavigationLinkType } from '~/types/layout'

const links: NavigationLinkType[] = [
  { to: '/dashboard', title: 'داشبورد' },
  { to: '/account/activity', title: 'فعالیت' },
  { to: '/account/settings', title: 'تنظیمات' },
]
useHead({
  bodyAttrs: {
    class: 'overflow-y-scroll',
  },
})
</script>

<template>
  <div class="flex h-svh w-full bg-background">
    <AppSidebar />
    <main class="relative min-h-svh h-full w-full grow ">
      <!-- header -->
      <AppHeader />
      <AppNavigation :links />
      <div class="w-full">
        <AppLayoutPageHeader>
          <AppLayoutPageTitle class="max-w-screen-lg container">
            تنظیمات حساب
          </AppLayoutPageTitle>
        </AppLayoutPageHeader>
        <AppLayoutPageContent>
          <div class="grid grid-cols-12 gap-8 container max-w-screen-lg">
            <div class="col-span-3">
              <div class="sticky top-14">
                <AppAccountSidebar />
              </div>
            </div>
            <div class="col-span-9">
              <slot />
            </div>
          </div>
        </AppLayoutPageContent>
      </div>
    </main>
  </div>
</template>
