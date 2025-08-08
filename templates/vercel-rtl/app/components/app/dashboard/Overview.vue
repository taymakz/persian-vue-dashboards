<script setup lang="ts">
import { Briefcase, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-vue-next'
import Badge from '@/components/ui/badge/Badge.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

const cards = [
  {
    icon: ShoppingCart,
    iconColor: 'text-blue-600',
    title: 'سفارش‌های جدید',
    badge: {
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      text: '+۵٪ رشد',
    },
    value: 128,
    dateRange: '۷ روز گذشته',
  },
  {
    icon: Briefcase,
    iconColor: 'text-green-600',
    title: 'درآمد کل',
    badge: {
      color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
      icon: TrendingUp,
      iconColor: 'text-green-500',
      text: '+۲٪ افزایش',
    },
    value: 24500000,
    dateRange: 'ماه جاری',
  },
  {
    icon: Users,
    iconColor: 'text-pink-600',
    title: 'مشتریان جدید',
    badge: {
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
      icon: TrendingDown,
      iconColor: 'text-pink-500',
      text: '-۱٪ کاهش',
    },
    value: 34,
    dateRange: '۷ روز گذشته',
  },
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card v-for="(card, i) in cards" :key="i">
      <CardContent class="flex flex-col h-full ">
        <div class="flex items-center justify-between mb-8 px-6 pt-6">
          <component :is="card.icon" class="size-6" :class="card.iconColor" />
          <Badge class="px-2 py-1 rounded-full" :class="[card.badge.color]">
            <component :is="card.badge.icon" class="size-4" :class="card.badge.iconColor" />
            {{ card.badge.text }}
          </Badge>
        </div>
        <div class="flex-1 flex flex-col justify-between grow ">
          <div class="px-6">
            <div class="text-base font-medium text-muted-foreground mb-1">
              {{ card.title }}
            </div>
            <div class="text-3xl font-medium text-foreground mb-6">
              {{ card.value.toLocaleString() }}
            </div>
          </div>
          <div class="py-3 border-t text-xs text-muted-foreground font-medium px-6">
            {{ card.dateRange }}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
