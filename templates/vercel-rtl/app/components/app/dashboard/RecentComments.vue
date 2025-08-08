<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
</script>

<template>
  <Card class="top-2 col-span-3 h-full xl:col-span-1 ">
    <CardHeader class="mb-8 flex items-center justify-between px-4 pt-6 border-b">
      <CardTitle class="2xl:text-lg">
        دیدگاه های اخیر
      </CardTitle>
      <NuxtLink to="/" class="text-muted-foreground text-link flex items-center text-sm gap-1.5">
         همه
        <span class="icon-[lucide--chevron-left] size-4" />
      </NuxtLink>
    </CardHeader>
    <CardContent class=" overflow-hidden">
      <ul class="space-y-4 overflow-y-auto h-full max-h-100 px-4 pb-4">
        <li v-for="i in 4" :key="i">
          <NuxtLink to="/" class="bg-background group block rounded-lg p-3 shadow-xs border duration-200">
            <div class=" mb-4 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <Avatar class="border">
                  <AvatarFallback class="flex items-center justify-center">
                    <span class="icon-[lucide--user] size-5 text-muted-foreground " />
                  </AvatarFallback>
                </Avatar>
                <p class="truncate">
                  random@gmail.com
                </p>
              </div>
              <span class="icon-[heroicons--arrow-top-right-on-square-20-solid] text-muted-foreground size-5 duration-200 group-hover:opacity-100 lg:opacity-0" />
            </div>
            <div class="text-muted-foreground line-clamp-1 text-sm">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز
            </div>
          </NuxtLink>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
