import type { AccountUserTokensType } from '#shared/types/account'
import { deleteCookie, getCookie } from 'h3'
import FetchServerApi, { errorResponse } from '~~/server/utils/api'
import { decryptSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) {

    return errorResponse(400)
  }
  const session = await decryptSession(sessionCookie)
  if (!session) {

    return errorResponse(400)
  }
  try {
    // const result = await FetchServerApi<AccountUserTokensType>(event, '/account/authenticate/logout/', {
    //   method: 'POST',
    //   body: { refresh: session.refresh },
    // })
    // if (result.success) {
    //   // Clear session cookie
    //   deleteCookie(event, 'session')
    // }
    deleteCookie(event, 'session')
    return successResponse(null, 'با موفقیت خارج شدید')
  }
  catch (error: any) {

    return errorResponse(error.status, error.message)
  }
})
