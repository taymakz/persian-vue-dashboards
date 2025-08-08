<script setup lang="ts">
import Card from '~/components/ui/card/Card.vue'
import Skeleton from '~/components/ui/skeleton/Skeleton.vue'
</script>

<template>
  <Card class="p-0 overflow-hidden relative ">
    <div>
      <!-- image skeleton -->
      <div class="w-full h-60 2xl:h-70 bg-secondary-lighter p-4 flex items-center justify-center">
        <Skeleton class="w-full h-full rounded-lg" />
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-1">
          <Skeleton class="h-4 w-12 rounded" />
          <Skeleton class="h-4 w-10 rounded" />
        </div>
        <Skeleton class="h-3 w-24 mb-4 rounded" />
        <Skeleton class="h-5 w-3/4 mb-2 rounded" />
        <Skeleton class="h-5 w-1/2 rounded" />
      </div>
    </div>
  </Card>
</template>
