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
    if (!accessTokenExpired) {
      return { valid: true }
    }
    if (accessTokenExpired && refreshTokenExpired) {
      deleteCookie(event, 'session')
      return { valid: false }
    }
    return { valid: true }
  }
  catch {
    return { valid: false }
  }
})
