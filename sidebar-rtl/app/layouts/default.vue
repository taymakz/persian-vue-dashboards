<script setup lang="ts">

</script>

<template>
  <div class="flex h-svh w-full overflow-hidden bg-card">
    <AppSidebar />
    <main id="main" class="relative min-h-svh overflow-y-auto h-full bg-background  lg:rounded-s-4xl lg:border-s w-full grow">
      <div class="w-full">
        <AppLayoutPageContent>
          <slot />
        </AppLayoutPageContent>
      </div>
    </main>
  </div>
</template>
