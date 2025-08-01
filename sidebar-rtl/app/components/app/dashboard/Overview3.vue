<script setup lang="ts">
import { LucideMoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

const cards = [
  {
    title: 'درآمد کل',
    value: '۲۳٬۵۰۰٬۰۰۰ تومان',
    percent: '+۹٪',
    percentColor: 'text-green-600 dark:text-green-500',
    description: 'نسبت به ماه قبل',
    orders: '۳۲۱',
    customers: '۵۶',
    bgColors: [
      'bg-sky-400/20',
      'bg-fuchsia-400/20',
      'bg-amber-400/20',
    ],
  },
  {
    title: 'بازدیدها',
    value: '۵٬۸۰۰',
    percent: '+۱۵٪',
    percentColor: 'text-emerald-600 dark:text-emerald-500',
    description: 'نسبت به روز قبل',
    orders: '۱۲',
    customers: '۳',
    bgColors: [
      'bg-purple-400/20',
      'bg-green-400/20',
      'bg-orange-400/20',
    ],
  },
  {
    title: 'محصولات جدید',
    value: '۴۵',
    percent: '+۲٪',
    percentColor: 'text-pink-600 dark:text-pink-500',
    description: 'نسبت به ماه قبل',
    orders: '۰',
    customers: '۰',
    bgColors: [
      'bg-blue-400/20',
      'bg-rose-400/20',
      'bg-yellow-400/20',
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <Card v-for="(card, i) in cards" :key="i" class="relative overflow-hidden py-4">
      <div class="absolute top-0 right-0 h-full w-full translate-x-14 -translate-y-14">
        <div
          v-for="(bg, idx) in card.bgColors"
          :key="idx"
          class="absolute size-24 rounded-full blur-2xl"
          :class="[
            idx === 0 ? 'top-[20%] right-[30%]' : '',
            idx === 1 ? 'top-[30%] left-[10%]' : '',
            idx === 2 ? 'right-[30%] bottom-[20%]' : '',
            bg,
          ]"
        />
      </div>
      <CardContent class="relative flex flex-col gap-3 px-4">
        <div class="flex items-center justify-between">
          <CardTitle class="text-base font-medium">
            {{ card.title }}
          </CardTitle>
          <div class="flex items-center gap-2">
            <Button variant="ghost" class="size-8">
              <LucideMoreHorizontal class="size-4" />
            </Button>
          </div>
        </div>
        <div class="col-span-2 flex flex-col gap-2">
          <span class="xl:text-lg 2xl:text-xl font-medium tracking-tighter tabular-nums">
            {{ card.value }}
          </span>
          <div class="text-muted-foreground text-sm font-medium flex gap-1">
            <span class="font-semibold" :class="card.percentColor">
              {{ card.percent }}
            </span>
            <span>{{ card.description }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
          <div class="bg-muted flex flex-col gap-1 rounded-md p-3">
            <span class="text-muted-foreground text-xs font-medium">
              تعداد سفارش‌ها
            </span>
            <span class="text-2xl font-medium tracking-tighter tabular-nums">
              {{ card.orders }}
            </span>
          </div>
          <div class="bg-muted flex flex-col gap-1 rounded-md p-3">
            <span class="text-muted-foreground text-xs font-medium">
              تعداد مشتریان جدید
            </span>
            <span class="text-2xl font-medium tracking-tighter tabular-nums">
              {{ card.customers }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
