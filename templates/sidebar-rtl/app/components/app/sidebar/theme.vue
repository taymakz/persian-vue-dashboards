<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

const isLight = computed(() => colorMode.preference === 'light')
const isDark = computed(() => colorMode.preference === 'dark')
</script>

<template>
  
    <button
      class="inline-flex items-center rounded-full border p-0"
      aria-label="Toggle Theme"
      @click="toggleTheme"
    >
      <!-- Light theme icon (Sun) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide size-6.5 rounded-full p-1.5 transition-colors"
        :class="isLight ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      <!-- Dark theme icon (Moon) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide size-6.5 rounded-full p-1.5 transition-colors"
        :class="isDark ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
 
</template>
