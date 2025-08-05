import type { AccountUserType } from '#shared/types/account'

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
  // Actions - Setters
  const SetLoading = (value?: boolean) => {
    if (value)
      loading.value = value
    else loading.value = !loading.value
  }

  const UpdateUserDetail = (data: Partial<AccountUserType>) => {
    userDetail.value = {
      ...userDetail.value,
      ...data,
    } as AccountUserType
  }

  // Return Store
  return {
    isLogin,
    getUserDetail,
    getLoading,
    getFullname,
    SetLoading,
    UpdateUserDetail,
  }
})
