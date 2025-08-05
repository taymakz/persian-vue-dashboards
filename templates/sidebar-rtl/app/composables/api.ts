import type { ApiResponseType } from '#shared/types/request'
import { toast } from 'vue-sonner'

/**
 * FetchApi - A function to handle API requests with default configuration and error handling.
 * @param {string} url - The endpoint URL.
 * @param {any} config - Optional Axios-like configuration object.
 * @returns {Promise<ApiResponseType<T>>} - The API response wrapped in a generic type.
 */
export default async function FetchApi<T>(
  url: string,
  config: any = {},
): Promise<ApiResponseType<T>> {
  // Set default configuration values
  config = {
    method: 'GET',
    ...config,
  }

  try {
    // Fetch directly from backend
    const runtimeConfig = useRuntimeConfig()
    const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'
    const result = (await $fetch(url, {
      baseURL: `${baseApi}/api/`,
      ...config,
    })) as ApiResponseType<T>

    return result
    // Old code (Nuxt API backend proxy):
    // const result = (await $fetch('/api/backend', {
    //   method: 'POST',
    //   body: { url, config },
    // })) as ApiResponseType<T>
    // return result
  }
  catch (error: any) {
    // Handle error based on HTTP status or specific error message
    return handleFetchError<T>(error)
  }
}

/**
 * ClientApi - Function to make authenticated API requests with automatic token refresh handling.
 * @param {string} url - The API endpoint URL.
 * @param {any} config - Optional Axios-like configuration object.
 * @returns {Promise<ApiResponseType<T>>} - The API response wrapped in a generic type.
 */
export async function ClientApi<T>(
  url: string,
  config: any = {},
): Promise<ApiResponseType<T>> {
  let tokens = getAuthenticateTokens()
  if (!tokens) {
    return {
      success: false,
      status: 0,
      message: 'لطفاً دوباره وارد شوید',
      data: null,
    } as ApiResponseType<T>
  }

  // If access token is expired, try refreshing it
  if (isAuthenticateAccessTokenExpired(tokens.access_exp)) {
    const authStore = useAuthenticateStore()
    const { tokens: newTokens } = await authStore.RefreshToken()
    tokens = newTokens

    if (!tokens) {
      return {
        success: false,
        status: 401,
        message: 'لطفاً دوباره وارد شوید',
        data: null,
      } as ApiResponseType<T>
    }
  }

  // Set default config and attach access token to headers if available
  config = {
    method: 'GET',
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${tokens.access}`,
    },
  }

  try {
    // Fetch directly from backend
    const runtimeConfig = useRuntimeConfig()
    const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'
    const result = (await $fetch(url, {
      baseURL: `${baseApi}/api/`,
      ...config,
    })) as ApiResponseType<T>
    return result
  }
  catch (error: any) {
    // Handle unauthorized errors and attempt token refresh if needed
    if (error.status === 401) {
      const authStore = useAuthenticateStore()
      const { tokens: refreshedTokens } = await authStore.RefreshToken()

      if (refreshedTokens) {
        config.headers.Authorization = `Bearer ${refreshedTokens.access}`
        // Retry the request after token refresh
        try {
          const runtimeConfig = useRuntimeConfig()
          const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'
          const result = (await $fetch(url, {
            baseURL: `${baseApi}/api/`,
            ...config,
          })) as ApiResponseType<T>
          return result
        }
        catch (newError: any) {
          return handleAuthError<T>(newError)
        }
      }
      else {
        return handleAuthError<T>(error)
      }
    }
    return handleFetchError<T>(error)
  }
}

/**
 * handleFetchError - Function to handle general API errors.
 * @param {any} error - Error object from $fetch.
 * @returns {ApiResponseType<T>} - Error response in the expected format.
 */
function handleFetchError<T>(error: any): ApiResponseType<T> {
  if (error.status === 429) {
    if (import.meta.client)
      toast('لطفا لحظاتی بعد تلاش کنید')
    return {
      success: false,
      status: error.response?.status,
      message: 'لطفا لحظاتی بعد تلاش کنید',
      data: null,
    } as ApiResponseType<T>
  }
  else if (error.message.includes('<no response> Failed to fetch')) {
    if (import.meta.client)
      toast('درحال حاضر سرور در دسترس نمیباشد')
    return {
      success: false,
      status: 503,
      message: 'درحال حاضر سرور در دسترس نمیباشد',
      data: null,
    } as ApiResponseType<T>
  }
  else {
    return {
      success: false,
      status: error.response?.status,
      message: 'مشکلی در عملیات رخ داده',
      data: null,
    } as ApiResponseType<T>
  }
}

/**
 * handleAuthError - Function to handle authentication-specific errors during retry.
 * @param {any} error - Error object after retry.
 * @returns {ApiResponseType<T>} - Error response in the expected format.
 */
function handleAuthError<T>(error: any): ApiResponseType<T> {
  const authStore = useAuthenticateStore()
  const router = useRouter()

  if (error.status === 401 && authStore.getUserTokens) {
    if (!router.currentRoute.value.fullPath.includes('/account')) {
      navigateTo({
        path: '/account',
        query: { backUrl: router.currentRoute.value.fullPath || '/' },
      })
    }
    return {
      success: false,
      status: error.response?.status,
      message: 'لطفا مجددا وارد حساب خود شوید',
      data: null,
    } as ApiResponseType<T>
  }
  return handleFetchError<T>(error)
}
