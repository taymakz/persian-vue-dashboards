import { defineEventHandler, getHeader, readBody } from 'h3'

interface BackendRequestBody {
  url: string
  config: any
}

export default defineEventHandler(async (event) => {
  const body = await readBody<BackendRequestBody>(event)
  const { url, config } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required',
    })
  }

  try {
    const runtimeConfig = useRuntimeConfig()
    const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'

    // Extract token from request headers
    const token = getHeader(event, 'Authorization')

    // Add the token to the headers of the outgoing request if it exists
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: token,
      }
    }

    // Make the request to the backend
    const response = await $fetch(url, {
      baseURL: `${baseApi}/api/`,
      ...config,
    })

    return response
  }
  catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.message || 'An error occurred',
      data: null,
    }
  }
})
