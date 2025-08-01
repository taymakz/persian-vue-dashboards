<script setup lang="ts">
import type { MediaType } from '~/types/media'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import SelectCity from '~/components/app/fields/SelectCity.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'

const selectedMedias = ref<MediaType[]>([])
const loading = ref<boolean>(false)
const selectedCity = ref('')
const selectedProvince = ref('')
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
    <AppLayoutPageHeader>
      <div class="container">
        <AppLayoutPageTitle>
          فیلد ها
        </AppLayoutPageTitle>
        <AppLayoutPageDescription>
          قبل از دیپلوی این صفحه را حذف کنید.
        </AppLayoutPageDescription>
      </div>
    </AppLayoutPageHeader>

    <AppLayoutPageContent>
      <div class="flex justify-center max-w-xl mx-auto">
        <Card class="w-full p-6">
          <Form v-slot="{ meta }" @submit="submit">
            <div class="space-y-4 mb-6">
              <AppMediasMediaSelect v-model="selectedMedias" multiple />
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

              <!-- City Selection Component -->
              <SelectCity v-model:city="selectedCity" v-model:province="selectedProvince" />
            </div>

            <Button
              type="submit"
              class="w-full"
            >
              ثبت
            </Button>
          </Form>
        </Card>
      </div>
    </AppLayoutPageContent>
  </div>
</template>
