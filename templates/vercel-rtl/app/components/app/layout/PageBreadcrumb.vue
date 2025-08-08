<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

defineProps<{
  links: {
    href?: string
    text: string
  }[]
}>()
</script>

<template>
  <Breadcrumb v-if="links.length > 0" class="container mb-6">
    <BreadcrumbList>
      <BreadcrumbSeparator />

      <!-- Single -->
      <template v-if="links.length === 1">
        <BreadcrumbItem>
          <BreadcrumbPage>
            {{ links[0]?.text }}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </template>
      <!-- Multiple -->
      <template v-else>
        <BreadcrumbItem v-for="(link, index) in links.slice(0, -1)" :key="index">
          <BreadcrumbLink as-child>
            <NuxtLink :to="link.href">
              {{ link.text }}
            </NuxtLink>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>
            {{ links[links.length - 1]?.text }}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
