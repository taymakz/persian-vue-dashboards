<script setup lang="ts">
import Overview from '@/components/app/dashboard/Overview.vue'
import Uptime from '~/components/app/dashboard/Uptime.vue'
</script>

<template>
  <div>
    <AppLayoutPageHeader>
      <AppLayoutPageTitle>
        داشبورد
      </AppLayoutPageTitle>
    </AppLayoutPageHeader>
    <AppLayoutPageContent class="container space-y-6">
      <Overview />
      <Uptime />

      <div class="grid grid-cols-3 items-center gap-4">
        <AppDashboardRecentTransactions />
        <AppDashboardRecentComments />
      </div>
    </AppLayoutPageContent>
  </div>
</template>
