<script lang="ts" setup>
import { Field, Form } from 'vee-validate'
import { toast } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'
import { schemaLogin } from '~/utils/yup/schemas/account'

definePageMeta({
  layout: 'auth',
})
useHead({
  title: 'ورود / ثبت نام',
})

const loading = ref<boolean>(false)

async function submit(_values: any) {
  if (loading.value)
    return
    
  loading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Show success toast
  toast.success('ورود با موفقیت انجام شد!')

  loading.value = false
}
</script>

<template>
  <div>
    <!-- Title -->
    <div class="mb-2 text-center font-medium">
      ورود
    </div>
    <p class="text-center text-sm text-muted-foreground mb-8">
      خوش آمدید. لطفا اطلاعات زیر را پر کنید
    </p>
    
    <Form v-slot="{ meta }" :validation-schema="schemaLogin" @submit="submit">
      <div class="space-y-4 mb-6">
        <Field v-slot="{ field }" name="email" validate-on-blur>
          <InputSecondary 
            v-bind="field"
            type="email"
            label="ایمیل" 
            dir="ltr"
            autofocus
            with-error-message
          />
        </Field>
        
        <Field v-slot="{ field }" name="password" validate-on-blur>
          <InputSecondary 
            v-bind="field"
            type="password"
            label="کلمه عبور"
            dir="ltr"
            with-error-message
          />
        </Field>
      </div>
      
      <Button 
        type="submit" 
        class="w-full" 
        size="lg" 
        :loading="loading" 
        :disabled="!meta.valid || loading"
      >
        ورود
      </Button>
    </Form>
  </div>
</template>
