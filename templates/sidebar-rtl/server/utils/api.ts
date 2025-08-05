import type { ApiResponseType } from '#shared/types/request'
import type { H3Event } from 'h3'

export default async function FetchServerApi<T>(
  event: H3Event,
  url: string,
  config: any = {},
): Promise<ApiResponseType<T>> {
  // Set default configuration values
  config = {
    method: 'GET',
    ...config,
  }
  try {
    const runtimeConfig = useRuntimeConfig(event)
    const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'
    return await $fetch(url, {
      baseURL: `${baseApi}/api/`,
      ...config,
    }) as ApiResponseType<T>
  }
  catch (error: any) {
    return {
      status: error.status || 500,
      success: false,
      message: 'مشکلی در عملیات رخ داده است',
      data: null,
    } as ApiResponseType<T>
  }
}
export function errorResponse(status: number, message?: string): ApiResponseType<null> {
  return {
    status: status || 500,
    success: false,
    message: message || 'مشکلی در عملیات رخ داده است',
    data: null,
  }
}
