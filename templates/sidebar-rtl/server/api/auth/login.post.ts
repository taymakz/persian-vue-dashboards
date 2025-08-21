import type { AccountUserTokensType, AccountUserType } from '#shared/types/account'
import type { ApiResponseType } from '~~/shared/types/request'
import { errorResponse } from '~~/server/utils/api'
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
      return errorResponse(result.status, result.message)
    }
    const session = await setAuthCookieSession(event, result.data)
    const user: AccountUserType = {
      email: session.email,
      first_name: session.first_name,
      last_name: session.last_name,
      has_password: session.has_password,
    }
    return {
      status: 200,
      success: true,
      message: result.message,
      data: user,
    }
  }
  catch (error: any) {
    return errorResponse(error.status, error.message)
  }
})
