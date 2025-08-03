<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

const uptimeData = Array.from({ length: 125 }, (_, i) => {
  const value = Math.round(Math.random()) // 0 or 1
  return {
    day: i + 1,
    value,
    label: value === 1 ? 'آنلاین' : 'آفلاین',
  }
})
</script>

<template>
  <Card>
    <CardHeader class="border-b p-6">
      <CardTitle>
        آپتایم
      </CardTitle>
      <CardDescription>
        وضعیت آپتایم سیستم در ۱۲۵ روز گذشته
      </CardDescription>
    </CardHeader>
    <CardContent class="p-6">
      <TooltipProvider>
        <div class="flex gap-0.5 overflow-x-auto scrollbar-hide justify-center">
          <Tooltip v-for="item in uptimeData" :key="item.day">
            <TooltipTrigger>
              <div class="w-2 h-8 rounded-xs" :class="[item.value === 1 ? 'bg-success' : 'bg-warning']" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ item.label }}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </CardContent>
  </Card>
</template>
