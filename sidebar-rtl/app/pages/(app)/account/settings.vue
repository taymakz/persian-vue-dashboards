<script setup lang="ts">
useHead({
  title: 'تنظیمات حساب',
})
definePageMeta({
  layout: 'account',
})

import { toast } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import InputSecondary from '~/components/ui/input/InputSecondary.vue'

const authStore = useAuthenticateStore()

// Form states
const nameForm = reactive({
  first_name: '',
  last_name: '',
  loading: false,
})

const passwordForm = reactive({
  password: '',
  confirm_password: '',
  loading: false,
})

// Computed values from store
const userDetail = computed(() => authStore.getUserDetail)
const hasPassword = computed(() => userDetail.value?.has_password || false)

// Initialize form data from store
watchEffect(() => {
  if (userDetail.value) {
    nameForm.first_name = userDetail.value.first_name || ''
    nameForm.last_name = userDetail.value.last_name || ''
  }
})

// Computed for form validation
const isNameChanged = computed(() =>
  nameForm.first_name !== (userDetail.value?.first_name || '')
  || nameForm.last_name !== (userDetail.value?.last_name || ''),
)
const isPasswordValid = computed(() =>
  passwordForm.password.length >= 8
  && passwordForm.password === passwordForm.confirm_password,
)

async function updateName() {
  if (!isNameChanged.value)
    return

  nameForm.loading = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Static success response
  toast.success('نام و نام خانوادگی با موفقیت تغییر کرد')
  // Update store
  authStore.UpdateUserDetail({
    first_name: nameForm.first_name,
    last_name: nameForm.last_name,
  })
  nameForm.loading = false
}

async function updatePassword() {
  if (!isPasswordValid.value) {
    toast.error('کلمه عبور باید حداقل 8 کاراکتر باشد و با تکرار آن مطابقت داشته باشد')
    return
  }

  passwordForm.loading = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Static success response
  toast.success('کلمه عبور با موفقیت تغییر کرد')
  passwordForm.password = ''
  passwordForm.confirm_password = ''
  // Update store
  authStore.UpdateUserDetail({ has_password: true })
  passwordForm.loading = false
}
</script>

<template>
  <div>
    <AppLayoutPageContent>
      <div class="space-y-4 ">
        <div class="space-y-10">
          <!-- Name Section -->
          <Card class="p-0 gap-0">
            <div class="space-y-4 mb-4 pt-6 px-6">
              <div class="font-semibold text-lg">
                نام و نام خانوادگی
              </div>
              <p class="text-muted-foreground text-sm">
                لطفا نام و نام خانوادگی خود را وارد کنید
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-6 border-b px-6 pb-6">
              <InputSecondary v-model="nameForm.first_name" label="نام" class="w-full" name="first_name" />
              <InputSecondary v-model="nameForm.last_name" label="نام خانوادگی" class="w-full" name="last_name" />
            </div>
            <div class="px-6 py-3 flex justify-between items-center">
              <p class="text-muted-foreground text-sm">
                لطفا از 32 کاراکتر کمتر استفاده کنید
              </p>
              <div class="flex gap-2">
                <Button variant="outline" :disabled="!isNameChanged || nameForm.loading" @click="() => { nameForm.first_name = userDetail?.first_name || ''; nameForm.last_name = userDetail?.last_name || '' }">
                  لغو
                </Button>
                <Button variant="default" :disabled="!isNameChanged || nameForm.loading" @click="updateName">
                  {{ nameForm.loading ? 'در حال ذخیره...' : 'ذخیره' }}
                </Button>
              </div>
            </div>
          </Card>

          <!-- Password Section -->
          <Card class="p-0 gap-0">
            <div class="space-y-4 mb-4 pt-6 px-6">
              <div class="font-semibold text-lg">
                {{ hasPassword ? 'تغییر کلمه عبور' : 'تنظیم کلمه عبور' }}
              </div>
              <p class="text-muted-foreground text-sm">
                {{ hasPassword ? 'در این بخش می‌توانید کلمه عبور خود را تغییر دهید' : 'برای امنیت بیشتر، کلمه عبور تنظیم کنید' }}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-6 border-b px-6 pb-6">
              <InputSecondary
                v-model="passwordForm.password" label="کلمه عبور" class="w-full" type="password"
                name="password"
              />
              <InputSecondary
                v-model="passwordForm.confirm_password" label="تکرار کلمه عبور" class="w-full"
                type="password" name="confirm_password"
              />
            </div>
            <div class="px-6 py-3 flex justify-between items-center">
              <p class="text-muted-foreground text-sm">
                حداقل 8 کاراکتر شامل حروف بزرگ، کوچک و اعداد
              </p>
              <div class="flex gap-2">
                <Button variant="outline" :disabled="!isPasswordValid || passwordForm.loading" @click="() => { passwordForm.password = ''; passwordForm.confirm_password = '' }">
                  لغو
                </Button>
                <Button variant="default" :disabled="!isPasswordValid || passwordForm.loading" @click="updatePassword">
                  {{ passwordForm.loading ? 'در حال ذخیره...' : 'ذخیره' }}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayoutPageContent>
  </div>
</template>
