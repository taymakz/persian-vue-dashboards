<script setup lang="ts">
const authStore = useAuthenticateStore()

const links = [
  {
    to: '/account/settings',
    label: 'تنظیمات حساب',
  },

]
</script>

<template>
  <ul class="p-2">
    <li v-for="link in links" :key="link.to">
      <NuxtLink
        :to="link.to" active-class="!text-accent-foreground"
        class="block text-muted-foreground px-2 py-2.5 hover:bg-accent/50 hover:text-accent-foreground rounded-md duration-200"
      >
        {{ link.label }}
      </NuxtLink>
    </li>
    <li>
      <button
        class="block w-full text-start cursor-pointer text-muted-foreground px-2 py-2.5 hover:bg-accent/50 hover:text-accent-foreground rounded-md duration-200"
        :disabled="authStore.getLoading" @click="authStore.LogoutUser()"
      >
        خروج از حساب
      </button>
    </li>
  </ul>
</template>
