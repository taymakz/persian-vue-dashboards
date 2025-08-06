import type { AccountUserType } from '#shared/types/account'
import { toast } from 'vue-sonner'

export const useAuthenticateStore = defineStore('authenticate', () => {
  // State
  const userDetail = ref<AccountUserType | null>(null)
  const loading = ref<boolean>(false)

  // Computed Properties
  const isLogin = computed((): boolean => userDetail.value != null)
  const getUserDetail = computed(() => userDetail.value)
  const getLoading = computed((): boolean => loading.value)
  const getFullname = computed(() => {
    const firstName = userDetail.value?.first_name ?? ''
    const lastName = userDetail.value?.last_name ?? ''
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : ''
  })
  const sessionCookie = useCookie('session', { watch: true })
  const route = useRoute()
  // Actions - Setters
  const SetLoading = (value?: boolean) => {
    if (value)
      loading.value = value
    else loading.value = !loading.value
  }

  const ModifyUserDetail = (data: Partial<AccountUserType>) => {
    userDetail.value = {
      ...userDetail.value,
      ...data,
    } as AccountUserType
  }
  const UpdateUserSession = async () => {
    if (!sessionCookie.value)
      return
    loading.value = true
    try {
      const result = await $fetch<AccountUserType>('/api/auth/session')
      if (result) {
        userDetail.value = result
      }
    }
    catch (error) {
      console.error('Failed to update session:', error)
    }
    finally {
      loading.value = false
    }
  }
  const LoginUser = async (data: AccountUserType) => {
    ModifyUserDetail(data)
    toast.success('ورود با موفقیت انجام شد!')
    const backUrl: any = route.query.backUrl || '/'
    return await navigateTo(backUrl)
  }
  const LogoutUser = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      toast.success('با موفقیت خارج شدید')
      userDetail.value = null
      sessionCookie.value = null
      await navigateTo('/')
    }
    catch (error) {
      console.error('Logout failed:', error)
    }
  }
  // Return Store
  return {
    isLogin,
    getUserDetail,
    getLoading,
    getFullname,
    SetLoading,
    ModifyUserDetail,
    UpdateUserSession,
    LoginUser,
    LogoutUser
  }
})
