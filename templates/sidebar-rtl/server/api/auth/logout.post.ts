import type { AccountUserTokensType } from '#shared/types/account'
import { deleteCookie, getCookie } from 'h3'
import FetchServerApi, { errorResponse } from '~~/server/utils/api'
import { decryptSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) {
    setResponseStatus(event, 400)
    return errorResponse(400)
  }
  try {
    const session = await decryptSession(sessionCookie)
    const result = await FetchServerApi<AccountUserTokensType>(event, '/account/authenticate/logout/', {
      method: 'POST',
      body: { refresh: session.refresh },
    })
    if (result.success) {
      // Clear session cookie
      deleteCookie(event, 'session')
    }
    return result
  }
  catch (error: any) {
    setResponseStatus(event, error.status || 500)
    return errorResponse(error.status, error.message)
  }
})
