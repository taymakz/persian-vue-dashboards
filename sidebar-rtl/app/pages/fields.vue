<script setup lang="ts">
import type { MediaType } from '~/types/media'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import SelectCity from '~/components/app/fields/SelectCity.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import { DatepickerJalali } from '~/components/ui/datepicker-jalali'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'

const selectedMedias = ref<MediaType[]>([])
const loading = ref<boolean>(false)
const selectedCity = ref('')
const selectedProvince = ref('')
const selectedDate = ref('')
const selectedDateTime = ref('')
const selectedDateNoToday = ref('')
const selectedDateWithPresets = ref('')

async function submit(_values: any) {
  if (loading.value)
    return

  loading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Show success toast with selected values
  toast.success(`ورود با موفقیت انجام شد! 
    تاریخ: ${selectedDate.value}
    تاریخ و زمان: ${selectedDateTime.value}
    تاریخ بدون امروز: ${selectedDateNoToday.value}
    تاریخ با انتخاب سریع: ${selectedDateWithPresets.value}`)

  loading.value = false
}

const editorValue = ref('')
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
      <div class="flex justify-center max-w-xl mx-auto mb-4">
        <Card class="w-full p-6">
          <Form @submit="submit">
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

              <!-- Jalali Date Picker -->
              <div class="space-y-2">
                <label class="text-sm font-medium">تاریخ ساده</label>
                <DatepickerJalali
                  v-model="selectedDate"
                  placeholder="انتخاب تاریخ"
                  class="w-full"
                />
              </div>

              <!-- Jalali Date Picker with Time -->
              <div class="space-y-2">
                <label class="text-sm font-medium">تاریخ و زمان</label>
                <DatepickerJalali
                  v-model="selectedDateTime"
                  placeholder="انتخاب تاریخ و زمان"
                  enable-time
                  class="w-full"
                />
              </div>

              <!-- Jalali Date Picker with Presets -->
              <div class="space-y-2">
                <label class="text-sm font-medium">تاریخ با انتخاب سریع</label>
                <DatepickerJalali
                  v-model="selectedDateWithPresets"
                  placeholder="انتخاب تاریخ"
                  show-presets
                  class="w-full"
                />
              </div>
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
      <div class="flex justify-center max-w-7xl mx-auto">
        <Card class="p-6 w-full">
          <AppFieldsTiptapEditor v-model="editorValue" />
        </Card>
      </div>
    </AppLayoutPageContent>
  </div>
</template>
