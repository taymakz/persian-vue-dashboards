<script setup lang="ts">
import type { ProductCardType } from '~/types/product'
import Badge from '~/components/ui/badge/Badge.vue'
import Card from '~/components/ui/card/Card.vue'
import { useFaTimeAgo } from '~/composables/time/useFaTimeAgo'

const props = defineProps<{
  item: ProductCardType
}>()
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<template>
  <Card class="p-0 overflow-hidden relative hover:border-border-lighter duration-300">
    <NuxtLink :to="`/products/${item.id}`" class="absolute inset-0 z-10" />
    <div>
      <!-- image -->
      <div class="w-full h-60  bg-accent/50 border-b p-4 ">
        <img :src="`https://picsum.photos/400/400?random=${getRandomInt(1, 100)}`" :alt="item.title" class="rounded-lg w-full h-full object-cover border ">
        <!-- <div v-else class="icon-[carbon--no-image] size-full text-muted-foreground"></div> -->
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-1.5 h-5.5">
          <p class="text-xs text-card-muted ">
            #{{ item.id }}
          </p>
          <Badge v-if="item.is_public" variant="success">
            عمومی
          </Badge>
        </div>
        <p class="mb-4 text-xs text-muted-foreground">
          آخرین بروزرسانی {{ useFaTimeAgo(item.updated_at) }}
        </p>
        <div class="text-sm  line-clamp-2 h-10 mb-1">
          {{ item.title }}
        </div>
      </div>
    </div>
  </Card>
</template>
