import { deleteCookie, getCookie } from 'h3'
import { decryptSession, isExpiredToken } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'session')

  if (!sessionCookie) {
    return { valid: false }
  }
  try {
    const session = await decryptSession(sessionCookie)

    if (!session) {
      deleteCookie(event, 'session')
      return { valid: false }
    }
    const accessTokenExpired = isExpiredToken(session.access_exp)
    const refreshTokenExpired = isExpiredToken(session.refresh_exp)

    if (accessTokenExpired && refreshTokenExpired) {
      deleteCookie(event, 'session')
      return { valid: false }
    }
    if (accessTokenExpired && !refreshTokenExpired) {
      const result = await event.$fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refresh: session.refresh },
      })

      if (!result.success || !result.data) {
        deleteCookie(event, 'session')
        return { valid: false }
      }
      // If new tokens are provided, update session cookies
      await setAuthCookieSession(event, result.data)
    }
    return { valid: true }
  }
  catch {
    return { valid: false }
  }
})
