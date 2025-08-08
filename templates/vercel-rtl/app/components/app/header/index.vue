<script setup lang="ts">
import { motion } from 'motion-v'
import Account from './Account.vue'
import Theme from './Theme.vue'
import Wallet from './Wallet.vue'

const { range } = useRange(0, 50, 1, 0.8)
</script>

<template>
  <div class="py-3 px-4 bg-card relative z-40">
    <div class="flex items-center justify-between">
      <div>
        <motion.div :animate="{ scale: range }" :transition="{ bounce: 0, duration: 0 }" class="flex items-center justify-center fixed z-50 top-2.5">
          <NuxtLink to="/">
            <AppLogo class="h-8" />
          </NuxtLink>
        </motion.div>
        <div class="flex items-center gap-4.5 ps-12">
          <span class="h-5 w-px bg-border-lighter rounded-full -rotate-25" />
          <p>
            منوفای
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Wallet />
        <Account />
        <Theme />
      </div>
    </div>
  </div>
</template>
