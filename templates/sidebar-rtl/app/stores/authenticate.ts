import { toast } from 'vue-sonner'
import FetchApi from '~/composables/api'
import { AccountUserCurrentDetail, AccountUserLogout } from '~/services/account/user'
import type { AccountUserAuthenticateResultType, AccountUserType } from '~/types/account'

export const useAuthenticateStore = defineStore('authenticate', () => {
  // State
  const userTokens = ref<AccountUserAuthenticateResultType | null>(null)
  const userDetail = ref<AccountUserType | null>(null)
  const loading = ref<boolean>(false)

  // Computed Properties
  const isLogin = computed((): boolean => userDetail.value != null)
  const getUserTokens = computed(() => userTokens.value)
  const getUserDetail = computed(() => userDetail.value)
  const getLoading = computed((): boolean => loading.value)
  const getFullname = computed(() => {
    const firstName = userDetail.value?.first_name ?? ''
    const lastName = userDetail.value?.last_name ?? ''
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : ''
  })
  const getPhone = computed(() => userDetail.value?.phone)
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

  const SetUserTokens = (tokens: AccountUserAuthenticateResultType) => {
    if (tokens) {
      userTokens.value = tokens
      clearLocalStorageTokens()
      updateLocalStorageTokens(tokens)
    }
  }
  function updateLocalStorageTokens(tokens: AccountUserAuthenticateResultType) {
    localStorage.setItem('authTokens', JSON.stringify(tokens))
  }
  function clearLocalStorageTokens() {
    localStorage.removeItem('authTokens')
  }
  const RefreshToken = useMemoize(async () => {
    const tokens = getAuthenticateTokens()
    if (!tokens || !tokens.refresh) {
      clearUserDetail()
      return { tokens: null, status: 401 }
    }

    let retries = 0
    const maxRetries = 3
    const retryDelay = 800 // ms

    while (retries < maxRetries) {
      try {
        const result = await FetchApi<{
          access: string
          access_exp: number
        }>('/app/account/authenticate/token-refresh/', {
          method: 'POST',
          body: { refresh: tokens.refresh },
        })
        if (result.success) {
          const new_tokens = {
            access: result.data.access,
            access_exp: result.data.access_exp,
            refresh: tokens.refresh, // Keep the same refresh token
          }
          userTokens.value = new_tokens
          updateLocalStorageTokens(new_tokens)
          return { tokens: new_tokens, status: result.status || 401 }
        }
        else {
          // Only clear on explicit auth failure (e.g. 401)
          if (result.status === 401 || result.status === 403) {
            clearUserDetail()
          }
          return { tokens: null, status: result.status || 401 }
        }
      }
      catch (error: any) {
        // Only retry on network/connection errors
        if (error && (error.name === 'TypeError' || error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch'))) {
          retries++
          if (retries < maxRetries) {
            await new Promise(res => setTimeout(res, retryDelay))
            continue
          }
          // After retries, do NOT clear tokens, just return error
          return { tokens: null, status: 0, error: 'connection' }
        }
        else {
          // Other errors (not network), log and do not clear tokens
          console.error('Error during token refresh:', error)
          return { tokens: null, status: 0, error: 'unknown' }
        }
      }
    }
    // If all retries failed
    return { tokens: null, status: 0, error: 'connection' }
  }, { cache: createSimpleMemoizeExpiringCache(4000) })
  // Actions - Authentication
  const SetUserDetail = useMemoize(
    async () => {
      loading.value = true
      if (import.meta.server) {
        loading.value = false
        return
      }
      const tokens = getAuthenticateTokens()
      if (!tokens) {
        loading.value = false
        return null
      }
      userTokens.value = tokens

      // If the access token is expired, refresh it
      if (isAuthenticateAccessTokenExpired()) {
        try {
          await RefreshToken() // Refresh token
        }
        catch (error) {
          console.error('Error refreshing token:', error)
          loading.value = false
          return // Exit if token refresh fails
        }
      }

      try {
        const result = await AccountUserCurrentDetail()
        if (result.success) {
          userDetail.value = result.data
        }
        else {
          if (result.status) {
            clearUserDetail()
          }
        }
      }
      catch (error) {
        console.error('Error fetching user detail:', error)
        // Handle error appropriately
      }
      finally {
        loading.value = false // Reset loading state
      }
    },
    { cache: createSimpleMemoizeExpiringCache(2000) },
  )
  function clearUserDetail() {
    userTokens.value = null
    userDetail.value = null
    clearLocalStorageTokens()
  }

  const RedirectToLogin = () => {
    const route = useRoute()
    return navigateTo(`/auth/login?backUrl=${route.fullPath}`)
  }
  const Logout = async () => {
    const tokens = userTokens.value
    if (!tokens)
      return
    loading.value = true
    const result = await AccountUserLogout(tokens.refresh)
    if (result.message)
      toast(result.message)

    if (result.success) {
      // Clear the login data and user data from the store and local storage
      userTokens.value = null
      userDetail.value = null
      clearLocalStorageTokens()

      // Redirect to the login page with the current URL as the backUrl parameter
      await RedirectToLogin()
    }
    loading.value = false
  }

  const Login = async (result: AccountUserAuthenticateResultType) => {
    const route = useRoute()
    clearLocalStorageTokens()
    localStorage.setItem('authTokens', JSON.stringify(result))
    SetUserTokens(result)
    await SetUserDetail()
    const backUrl: any = route.query.backUrl || '/'
    return await navigateTo(backUrl)
  }

  // Return Store
  return {
    isLogin,
    getUserTokens,
    getUserDetail,
    getLoading,
    getFullname,
    getPhone,
    SetLoading,
    UpdateUserDetail,
    SetUserTokens,
    SetUserDetail,
    Logout,
    Login,
    RedirectToLogin,
    RefreshToken,
  }
})
