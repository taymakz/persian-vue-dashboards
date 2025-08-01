<script setup lang="ts">
const isActive = ref<boolean>(false)

function handleEnter() {
  isActive.value = true
}

function handleLeave() {
  isActive.value = false
}
</script>

<template>
  <div
    class="w-full cursor-pointer"
    @mouseover="handleEnter"
    @mouseleave="handleLeave"
  >
    <div class="group/file relative block w-full overflow-hidden rounded-lg px-6">
      <!-- Content -->
      <div class="flex flex-col items-center justify-center mt-4">
        <div class="relative mx-auto w-full space-y-4">
          <div
            class="relative z-40 mx-auto mt-4 flex gap-2 h-32 w-full items-center justify-center rounded-md bg-secondary border transition-all duration-200"
            :class="isActive ? 'transform translate-x-2 -translate-y-2 opacity-90' : ''"
          >
            <Icon name="lucide:upload" class="size-6 text-muted-foreground" />
            <span class="text-sm text-muted-foreground">
              <slot />
            </span>
          </div>

          <div
            class="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full items-center justify-center rounded-md border border-dashed border-primary bg-transparent transition-opacity"
            :class="{ 'opacity-100': isActive, 'opacity-0': !isActive }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
