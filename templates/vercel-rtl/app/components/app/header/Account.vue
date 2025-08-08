<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const authStore = useAuthenticateStore()
const user = computed(() => authStore.getUserDetail)
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div
        class="size-8 border rounded-full flex items-center justify-center  cursor-default  hover:border-border-lighter hover:bg-accent/40 duration-200  "
      >
        <span class="icon-[lucide--user]" />
      </div>
    </PopoverTrigger>
    <PopoverContent align="end" class="p-0 w-64 text-sm">
      <div class="p-2 border-b">
        <div class="p-2  text-foreground">
          <div class="truncate mb-1">
            <template v-if="user?.first_name">
              {{ user?.first_name }} {{ user?.last_name }}
             </template>
            <template v-else>
              شما
            </template>
          </div>
          <p class="text-muted-foreground">
            {{ user?.email }}
          </p>
        </div>
      </div>
      <ul class="p-2">
        <li>
          <NuxtLink
            to="/account/settings"
            class="block text-muted-foreground px-2 py-2.5 hover:bg-accent/50 hover:text-accent-foreground rounded-md duration-200"
          >
            تنظیمات حساب
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/account/activity"
            class="block text-muted-foreground px-2 py-2.5 hover:bg-accent/50 hover:text-accent-foreground rounded-md duration-200"
          >
            فعالیت ها
          </NuxtLink>
        </li>
        <li>
          <button
            :disabled="authStore.getLoading"
            class="w-full cursor-pointer flex items-center justify-between text-muted-foreground px-2 py-2.5 hover:bg-accent/50 hover:text-accent-foreground rounded-md duration-200"
            @click="authStore.LogoutUser()"
          >
            <span>
              خروج
            </span>
            <span class="icon-[lucide--log-out] size-4.5" />
          </button>
        </li>
      </ul>
    </PopoverContent>
  </Popover>
</template>
