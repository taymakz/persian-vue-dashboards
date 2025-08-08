<script setup lang="ts">
const cards = [
  {
    title: 'سفارش‌ها',
    value: '۴۲۷٬۲۹۶',
    percent: '+۱۲٪',
    percentColor: 'text-success',
    arrow: '↗',
    description: 'نسبت به هفته قبل',
  },
  {
    title: 'مشتریان',
    value: '۳۷٬۴۲۹',
    percent: '+۴۲٪',
    percentColor: 'text-success',
    arrow: '↗',
    description: 'نسبت به هفته قبل',
  },
  {
    title: 'درآمد',
    value: '۱۲٬۸۰۰٬۰۰۰ تومان',
    percent: '+۸٪',
    percentColor: 'text-success',
    arrow: '↗',
    description: 'نسبت به هفته قبل',
  },
  {
    title: 'بازدیدها',
    value: '۳٬۴۹۷',
    percent: '-۱۷٪',
    percentColor: 'text-warning',
    arrow: '↘',
    description: 'نسبت به هفته قبل',
  },
]
</script>

<template>
  <div class="grid grid-cols-2 min-xl:grid-cols-4 border border-border rounded-xl bg-card bg-gradient-to-br from-sidebar/60 to-sidebar">
    <div v-for="(card, i) in cards" :key="i" class="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div class="relative flex items-center gap-4">
        <!-- Icon placeholder, you can add a dynamic icon if needed -->
        <div class="max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center text-emerald-500">
          <!-- Static SVG for now -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><circle cx="10" cy="10" r="8" /></svg>
        </div>
        <div>
          <a href="#" class="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0">{{ card.title }}</a>
          <div class="text-sm lg:text-base xl:text-lg font-semibold mb-2 ">
            {{ card.value }}
          </div>
          <div class="text-xs text-muted-foreground/60">
            <span class="font-medium" :class="card.percentColor">{{ card.arrow }} {{ card.percent }}</span> {{ card.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
