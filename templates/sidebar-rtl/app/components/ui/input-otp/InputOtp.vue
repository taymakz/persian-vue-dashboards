<script setup lang="ts">
import { OTPInput } from 'vue-input-otp'
import Slot from './Slot.vue'

withDefaults(
  defineProps<{
    maxlength?: number
  }>(),
  {
    maxlength: 4,
  },
)
</script>

<template>
  <OTPInput
    v-slot="{ slots }"
    :maxlength="4"
    container-class="group flex items-center has-[:disabled]:opacity-30"
    inputmode="numeric"
    autofocus
  >
    <div class="flex w-full justify-evenly gap-2">
      <Slot v-for="(slot, idx) in slots" v-bind="slot" :key="idx" />
    </div>
  </OTPInput>
</template>
