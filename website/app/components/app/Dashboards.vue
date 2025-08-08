<script setup lang="ts">
import Button from '../ui/button/Button.vue'
import Card from '../ui/card/Card.vue'

const baseGithubUrl = 'https://github.com/taymakz/persian-vue-dashboards/tree/main/templates'
</script>

<template>
  <div class="container max-w-screen-md">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <!-- Sidebar Rtl -->
      <Card class="p-4 ">
        <div class="h-44 border rounded-md overflow-hidden bg-secondary mb-4">
          <div class="flex h-full">
            <div class="h-full w-full bg-neutral-900 rounded-r-xl" />
            <div class="h-full w-20 bg-secondary" />
          </div>
        </div>
        <h2 class="mb-4 font-medium">
          Sidebar rtl
        </h2>
        <div class="flex gap-2">
          <Button class="w-full" as-child variant="outline">
            <NuxtLink :to="`${baseGithubUrl}/sidebar-rtl`" external target="_blank">
              <span class="icon-[lucide--github] size-4.5" />
              Github
            </NuxtLink>
          </Button>
          <Button class="w-full" as-child variant="outline">
            <NuxtLink to="https://vue-dashboards-sidebar-rtl.netlify.app/" external target="_blank">
              <span class="icon-[mage--preview] size-4.5" />
              Demo
            </NuxtLink>
          </Button>
        </div>
      </Card>
      <!-- Vercel Rtl -->
      <Card class="p-4 ">
        <div class="h-44 border rounded-md overflow-hidden bg-secondary mb-4">
          <div class="flex h-full flex-col">
            <div class=" h-6 bg-neutral-900" />
            <div class=" h-6 bg-neutral-900 border-b" />
            <div class="h-full w-full bg-neutral-900 " />
          </div>
        </div>
        <h2 class="mb-4 font-medium">
          Vercel rtl
        </h2>
        <div class="flex gap-2">
          <Button class="w-full" as-child variant="outline">
            <NuxtLink :to="`${baseGithubUrl}/vercel-rtl`" external target="_blank">
              <span class="icon-[lucide--github] size-4.5" />
              Github
            </NuxtLink>
          </Button>
          <Button class="w-full" as-child variant="outline">
            <NuxtLink to="https://vue-dashboards-vercel-rtl.netlify.app/" external target="_blank">
              <span class="icon-[mage--preview] size-4.5" />
              Demo
            </NuxtLink>
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>
