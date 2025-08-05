import type { AccountUserTokensType } from '#shared/types/account'
import type { ApiResponseType } from '~~/shared/types/request'
import FetchServerApi, { errorResponse } from '~~/server/utils/api'
import { setAuthCookieSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const { email, password, otp } = await readBody(event)
  try {
    // const result = await FetchServerApi<AccountUserTokensType>(event, '/account/authenticate/login/', {
    //   method: 'POST',
    //   body: { email, password, otp },
    // })
    
    // TODO - Implement real authentication logic here (you can use the commented code above as a reference)
    const result = await $fetch<ApiResponseType<AccountUserTokensType>>('/api/test/auth', {
      method: 'POST',
      body: { email, password, otp },
    })
    if (!result.success) {
      setResponseStatus(event, result.status || 500)
      return errorResponse(result.status, result.message)
    }
    await setAuthCookieSession(event, result.data)
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
