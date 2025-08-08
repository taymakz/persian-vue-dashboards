<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import Badge from '~/components/ui/badge/Badge.vue'

const value = 200000
</script>

<template>
  <NuxtLink to="/account/settings">
    <Badge variant="outline" class="h-8 px-3 font-medium flex gap-1.5 hover:border-border-lighter hover:bg-accent/20 transition-colors duration-300 text-primary">
      <span class="icon-[lucide--wallet] size-4 " />
      <div v-if="value" class="flex items-center gap-1  font-bold">
        <NumberFlow :value />
        <span class="icon-toman size-4.5" />
      </div>
      <div v-else>
        افزایش اعتبار
      </div>
    </Badge>
  </NuxtLink>
</template>
