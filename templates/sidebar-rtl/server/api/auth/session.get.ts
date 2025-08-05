import type { AccountUserType } from '#shared/types/account'
import { deleteCookie, getCookie } from 'h3'
import { errorResponse, successResponse } from '~~/server/utils/api'
import { decryptSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) {
    return {}
  }
  try {
    const session = await decryptSession(sessionCookie)
    // Failed to decrypt session or session is invalid
    if (!session) {
      // Delete the session cookie if decryption fails
      deleteCookie(event, 'session')
      return {}
    }
    const data: AccountUserType = {
      email: session.email,
      first_name: session.first_name,
      last_name: session.last_name,
      has_password: session.has_password,
    }
    return successResponse(data)
  }
  catch (error: any) {
    setResponseStatus(event, error.status || 500)
    return errorResponse(error.status, error.message)
  }
})
