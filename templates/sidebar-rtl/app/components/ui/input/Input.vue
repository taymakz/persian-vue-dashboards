<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { useField } from 'vee-validate'
import { cn } from '@/utils/cn'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  label?: string
  inputClass?: HTMLAttributes['class']
  labelClass?: HTMLAttributes['class']
  id?: string
  name?: string
  withErrorMessage?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
const id = props.id || useId()
const { errorMessage } = useField(props.name || id, undefined)
</script>

<template>
  <div class="my-1 w-full">
    <div class="relative">
      <input v-bind="$attrs" :id v-model="modelValue" :class="cn(
        'peer bg-input focus:border-border-lighter hover:border-border-lighter disabled:hover:border-border disabled:text-muted-foreground block w-full appearance-none rounded-md border px-2.5 pt-5 pb-3 text-sm focus:ring-0 focus:outline-none disabled:cursor-not-allowed',
        props.inputClass,
      )
        " placeholder=" ">
      <label :for="id" :class="cn(
        'text-muted-foreground peer-focus:text-muted-foreground peer-placeholder-shown:text-sc-muted peer-disabled:text-muted-foreground absolute top-2 right-2 z-10 origin-right -translate-y-1.5 scale-75 transform cursor-text rounded-md px-2 text-sm font-thin duration-200 select-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-1.5 peer-focus:scale-75 peer-focus:px-2 peer-disabled:cursor-not-allowed',
        props.labelClass,
      )
        ">
        {{ label }}
      </label>
    </div>
    <p v-if="withErrorMessage" class="text-warning mt-3 h-5 text-right text-sm">
      <span v-show="errorMessage">
        {{ errorMessage }}
      </span>
    </p>
  </div>
</template>
