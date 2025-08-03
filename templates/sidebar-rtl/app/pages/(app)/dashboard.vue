<script setup lang="ts">
import Overview2 from '@/components/app/dashboard/Overview2.vue'
import Overview3 from '@/components/app/dashboard/Overview3.vue'
import Overview from '@/components/app/dashboard/Overview.vue'
import Uptime from '~/components/app/dashboard/Uptime.vue'
</script>

<template>
  <div>
    <AppLayoutPageHeader>
      <AppLayoutPageTitle class="container">
        داشبورد
      </AppLayoutPageTitle>
    </AppLayoutPageHeader>
    <AppLayoutPageContent class="container space-y-6">
      <Overview3 />
      <Overview2 />
      <Overview />
      <Uptime />

      <div class="grid grid-cols-3 items-center gap-4">
        <AppDashboardRecentTransactions />
        <AppDashboardRecentComments />
      </div>
    </AppLayoutPageContent>
  </div>
</template>
