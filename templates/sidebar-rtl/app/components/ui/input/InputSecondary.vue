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
  icon?: string
  iconClass?: HTMLAttributes['class']
  withErrorMessage?: boolean
  clearIcon?: boolean
  fullLtr?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
const id = props.id || useId()

// Only use useField for error handling when withErrorMessage is true
const { errorMessage } = props.withErrorMessage
  ? useField(props.name || id, undefined)
  : { errorMessage: ref(null) }
</script>

<template>
  <div>
    <div class="relative isolate">
      <label :for="id" class="sr-only">
        {{ label }}
      </label>
      <input v-bind="$attrs" :id v-model="modelValue" :class="cn(
        'bg-input focus:border-border-lighter hover:border-border-lighter disabled:hover:border-border block w-full appearance-none rounded-md border px-2.5 py-3 text-sm  placeholder:duration-200 focus:ring-0 focus:outline-none  disabled:cursor-not-allowed disabled:opacity-80 ',
        props.inputClass,
        { 'pr-9': icon },
        { 'pl-9': clearIcon },
        [fullLtr ? 'focus:placeholder:translate-x-3 focus:placeholder:text-left' : 'focus:placeholder:-translate-x-3 placeholder:text-right'],
      )
        " :placeholder="label">
      <div v-if="icon"
        class="pointer-events-none absolute top-1/2 right-2 z-50 flex -translate-y-1/2 items-center justify-center">
        <i :class="cn('text-muted-foreground size-5', [icon, iconClass])" />
      </div>
      <div v-if="modelValue && clearIcon"
        class=" absolute top-1/2 left-2 z-50 flex -translate-y-1/2 items-center justify-center cursor-pointer"
        @click="modelValue = ''">
        <i class="size-6 icon-[material-symbols--close-rounded] text-warning" />
      </div>
    </div>
    <p v-if="withErrorMessage" class="text-warning mt-3 h-5 text-sm" dir="rtl">
      <span v-show="errorMessage">
        {{ errorMessage }}
      </span>
    </p>
  </div>
</template>
