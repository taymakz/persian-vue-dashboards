<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'dark'
  },
  title: 'Persian Vue Dashboards',
})
</script>

<template>
  <div>

      <NuxtLoadingIndicator :size="3" />
      <div>
        <NuxtPage />
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
