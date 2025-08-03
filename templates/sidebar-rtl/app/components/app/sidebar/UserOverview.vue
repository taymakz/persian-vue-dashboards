<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Badge from '~/components/ui/badge/Badge.vue'

// Uncomment the following lines if you need to use the auth store

// const authStore = useAuthenticateStore()

// const username = computed(() => {
//   const user = authStore.getUserDetail
//   if (user?.first_name && user?.last_name) {
//     return `${user.first_name} ${user.last_name}`
//   }
//   if (user?.first_name || user?.last_name) {
//     return user?.first_name || user?.last_name
//   }
//   return user?.phone || ''
// })
</script>

<template>
  <div class="border-b p-4">
    <div class="flex items-center gap-3.5 mb-2">
      <Avatar class="border">
        <AvatarFallback class="flex items-center justify-center">
          <span class="icon-[lucide--user] size-5 text-muted-foreground " />
        </AvatarFallback>
      </Avatar>
      <div>
        <p class="font-medium text-sm mb-1">
          تایماز اکبری
        </p>
        <p class="font-medium text-muted-foreground text-xs font-comfortaa line-clamp-1">
          taymazak1382@gmail.com
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <Badge variant="outline">
        <span class="font-semibold">
          1,200,000
        </span>
        <span class="text-base ms-1 icon-toman" />
      </Badge>
      <Badge variant="success">
        اشتراک فعال
      </Badge>
    </div>
  </div>
</template>
