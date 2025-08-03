<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Badge from '~/components/ui/badge/Badge.vue'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
</script>

<template>
  <Card class="col-span-3 h-full xl:col-span-2 ">
    <CardHeader class="mb-8 flex items-center justify-between px-4 pt-6 border-b">
      <CardTitle class="2xl:text-lg">
        تراکنش های اخیر
      </CardTitle>

      <NuxtLink to="/" class="text-muted-foreground text-link flex items-center text-sm gap-1.5">
        همه
        <span class="icon-[lucide--chevron-left] size-4" />
      </NuxtLink>
    </CardHeader>
    <CardContent>
      <div class="space-y-2 max-h-100 overflow-y-auto px-4 pb-4">
        <div
          v-for="i in 5"
          :key="i"
          class="relative bg-background rounded-lg shadow-xs border p-4 hover:shadow-md transition-shadow duration-200"
        >
          <!-- Header Row - User and Actions -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <Avatar class="border h-10 w-10">
                <AvatarFallback class="flex items-center justify-center">
                  <span class="icon-[lucide--user] size-5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm truncate">0900000000</span>
                  <Badge v-if="i === 1" variant="success" class="text-xs">
                    موفق
                  </Badge>
                  <Badge v-else-if="i === 2" variant="alert" class="text-xs">
                    نا معلوم
                  </Badge>
                  <Badge v-else variant="warning" class="text-xs">
                    نا موفق
                  </Badge>
                </div>
                <span class="text-xs text-muted-foreground">کاربر</span>
              </div>
            </div>

            <div class="absolute left-4 top-4">
              <div

                class="relative flex items-center justify-center text-muted-foreground"
              >
                <span class="icon-[heroicons--arrow-top-right-on-square-20-solid] size-5" />
                <NuxtLink to="/" class="absolute size-10 lg:hover:bg-accent/50 rounded-md duration-200" />
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <!-- Transaction ID -->
            <div class="flex flex-col space-y-1">
              <span class="text-xs text-muted-foreground">شناسه</span>
              <span>126523 #</span>
            </div>

            <!-- Amount -->
            <div class="flex flex-col space-y-1">
              <span class="text-xs text-muted-foreground">مبلغ</span>
              <div
                class="flex items-center gap-1 font-medium"
                :class="[
                  i === 1 ? 'text-success' : i === 2 ? 'text-alert' : 'text-warning',
                ]"
              >
                <span>120,000,000</span>
                <span class="text-lg icon-toman" />
              </div>
            </div>

            <!-- Date -->
            <div class="flex flex-col space-y-1">
              <span class="text-xs text-muted-foreground">تاریخ</span>
              <span class="font-medium">امروز</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
