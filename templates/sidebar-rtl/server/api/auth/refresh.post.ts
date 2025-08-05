import type { AccountUserTokensType } from '#shared/types/account'
import type { ApiResponseType } from '~~/shared/types/request'
import { readBody, setResponseStatus } from 'h3'
import FetchServerApi, { errorResponse } from '~~/server/utils/api'
import { setAuthCookieSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const { refresh } = await readBody(event)
  try {
    // Send refresh token to backend refresh endpoint
    // const result = await FetchServerApi<AccountUserTokensType>(event, '/account/authenticate/refresh/', {
    //   method: 'POST',
    //   body: { refresh },
    // })
    // TODO - Implement real refresh logic here (you can use the commented code above as a reference)
    const result = await $fetch<ApiResponseType<AccountUserTokensType>>('/api/test/refresh', {
      method: 'POST',
      body: { refresh },
    })
    if (!result.success) {
      setResponseStatus(event, result.status || 500)
      return errorResponse(result.status, result.message)
    }
    // If new tokens are provided, update session cookies
    if (result.data?.access) {
      await setAuthCookieSession(event, result.data)
    }
    return {
      status: 200,
      success: true,
      message: result.message,
      data: null,
    }
  }
  catch (error: any) {
    setResponseStatus(event, error.status || 500)
    return errorResponse(error.status, error.message)
  }
})
