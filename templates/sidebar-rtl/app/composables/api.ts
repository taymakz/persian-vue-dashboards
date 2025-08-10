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
  try {
    return await $fetch(`/api/backend?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      ...config,
    }) as ApiResponseType<T>
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
  const isValidSession = await $fetch('/api/auth/validate-session')

  if (!isValidSession.valid) {
    return {
      success: false,
      status: 0,
      message: 'لطفاً دوباره وارد شوید',
      data: null,
    } as ApiResponseType<T>
  }
  try {
    return await $fetch(`/api/backend/client?url=${encodeURIComponent(url)}&method=${config.method || 'GET'}`, {
      method: 'POST',
      ...config,
    }) as ApiResponseType<T>
    // }
  }
  catch (error: any) {
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
