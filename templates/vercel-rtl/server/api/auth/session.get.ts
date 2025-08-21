import type { AccountUserType } from '#shared/types/account'
import { deleteCookie, getCookie } from 'h3'
import { errorResponse, successResponse } from '~~/server/utils/api'
import { decryptSession, isExpiredToken, setAuthCookieSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie) {
    return {}
  }
  try {
    let session = await decryptSession(sessionCookie)
    // Failed to decrypt session or session is invalid
    if (!session) {
      // Delete the session cookie if decryption fails
      deleteCookie(event, 'session')
      return {}
    }
    const accessTokenExpired = isExpiredToken(session.access_exp)
    const refreshTokenExpired = isExpiredToken(session.refresh_exp)
    if (accessTokenExpired && refreshTokenExpired) {
      // If both access and refresh tokens are expired, delete the session cookie
      deleteCookie(event, 'session')
      return {}
    }
    if (accessTokenExpired && !refreshTokenExpired) {
      // refresh the access token using the refresh token
      const result = await event.$fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refresh: session.refresh },
      })
      if (!result.success) {
        // Refresh failed, clear session cookie
        deleteCookie(event, 'session')
        return {}
      }
      // If new access token is provided, update session cookie
      if (result.data) {
        session = await setAuthCookieSession(event, result.data)
      }
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

    return errorResponse(error.status, error.message)
  }
})
