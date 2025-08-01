<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

defineProps<{
  message?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(
    'text-muted-foreground flex flex-col items-center justify-center gap-2 text-lg',
    $props.class,
  )
    ">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g fill="none">
        <path fill="#995AA8" d="M7.617 26.06h3.348v3.348H7.617zm13.393 0h3.348v3.348H21.01z" />
        <path fill="#B574C3" d="M7.62 2.628h3.347v3.347H7.62zm13.39 0h3.348v3.347H21.01z" />
        <path fill="url(#unjsUncrypto0)"
          d="M24.365 16.02V9.325H21.01v-3.35h-3.347v3.35h-3.348v-3.35h-3.347v3.35H7.62v6.695H4.272v3.348H7.62v3.35h3.347v3.345h3.348v-3.345h3.348v3.345h3.347v-3.345h3.355v-3.35h3.343V16.02zm-10.052 0h-3.348v-3.347h3.348zm6.695 0H17.66v-3.347h3.348z" />
        <path fill="url(#unjsUncrypto1)" d="M27.705 9.323h3.35v6.7h-3.35z" />
        <path fill="url(#unjsUncrypto2)" d="M.925 9.32h3.35v6.7H.925z" />
        <defs>
          <radialGradient id="unjsUncrypto0" cx="0" cy="0" r="1" gradientTransform="translate(16.086 2.35)scale(20.764)"
            gradientUnits="userSpaceOnUse">
            <stop offset=".508" stop-color="#B574C3" />
            <stop offset=".684" stop-color="#B070BF" />
            <stop offset=".878" stop-color="#A363B2" />
            <stop offset=".981" stop-color="#995AA8" />
          </radialGradient>
          <radialGradient id="unjsUncrypto1" cx="0" cy="0" r="1"
            gradientTransform="matrix(16.3203 0 0 16.3202 15.78 6.029)" gradientUnits="userSpaceOnUse">
            <stop offset=".508" stop-color="#B574C3" />
            <stop offset=".684" stop-color="#B070BF" />
            <stop offset=".878" stop-color="#A363B2" />
            <stop offset=".981" stop-color="#995AA8" />
          </radialGradient>
          <radialGradient id="unjsUncrypto2" cx="0" cy="0" r="1"
            gradientTransform="translate(15.703 3.27)scale(18.7725)" gradientUnits="userSpaceOnUse">
            <stop offset=".508" stop-color="#B574C3" />
            <stop offset=".684" stop-color="#B070BF" />
            <stop offset=".878" stop-color="#A363B2" />
            <stop offset=".981" stop-color="#995AA8" />
          </radialGradient>
        </defs>
      </g>
    </svg>
    {{ message || "هیچ موردی یافت نشد" }}
  </div>
</template>
