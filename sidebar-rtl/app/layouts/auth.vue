<script setup lang="ts">
import { motion } from 'motion-v'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ArtPlum from '~/components/ui/backgrounds/ArtPlum.vue'
import Grid from '~/components/ui/backgrounds/Grid.vue'

const cardWrapper = ref<HTMLDivElement | null>(null)
const { height } = useElementSize(cardWrapper)
</script>

<template>
  <div
    class="bg-background relative flex w-full items-center justify-center overflow-x-hidden sm:min-h-screen"
  >
    <!-- background effects -->
    <ArtPlum />
    <Grid />

    <!-- Content -->
    <main class="sm:container">
      <Card
        class="relative mx-auto p-6 rounded-xl border max-sm:flex max-sm:min-h-screen max-sm:min-w-screen max-sm:items-center max-sm:justify-center max-sm:overflow-y-auto sm:h-auto sm:max-w-96 "
      >
        <motion.div
          
          :animate="{
            height: `${height}px`,
          }"
          class="overflow-hidden w-full max-sm:container"
        >
          <div ref="cardWrapper">
            <CardHeader>
              <div class="flex justify-center mb-8">
                <NuxtLink to="/">
                  <AppLogo />
                </NuxtLink>
              </div>
            </CardHeader>
            <CardContent class="grid gap-4 ">
              <slot />
            </CardContent>
          </div>
        </motion.div>
      </Card>
    </main>
  </div>
</template>
