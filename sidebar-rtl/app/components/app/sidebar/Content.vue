<script setup lang="ts">
import Link from './link/index.vue'

export interface LinkType {
  to?: string
  icon: string
  label: string
  children?: (Omit<LinkType, 'to' | 'children' | 'icon'> & { to: string })[]
}

const links: LinkType[] = [
  {
    to: '/dashboard',
    icon: 'icon-[mage--dashboard-chart]',
    label: 'داشبورد',
  },

  {
    icon: 'icon-[carbon--carbon-for-ibm-product]',
    label: 'مدیریت محصولات',
    children: [
      { to: '/products', label: 'لیست' },
      { to: '/products/categories', label: 'دسته‌بندی‌ها' },
      { to: '/products/brands', label: 'برندها' },
    ],
  },
  {
    to: '/account/settings',
    icon: 'icon-[clarity--administrator-line]',
    label: 'حساب کاربری',
  },
]
</script>

<template>
  <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-4">
    <Link
      v-for="link in links"
      :key="link.to"
      :link
    />
  </div>
</template>
