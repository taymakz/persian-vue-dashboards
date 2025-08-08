<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner'
import { Toaster as Sonner } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner class="toaster group" v-bind="props" :toast-options="{
    classes: {
      toast:
        'group toast !safe-top group-[.toaster]:!bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg !rounded-2xl',
      description: 'font-iranyekan group-[.toast]:text-muted-foreground',
      actionButton:
        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-iranyekan',
      cancelButton:
        'group-[.toast]:bg-sc-backround group-[.toast]:text-muted-foreground',
      title: 'font-iranyekan',
      success: '!text-success',
      warning: '!text-alert',
      error: '!text-warning',
    },
  }" />
</template>
