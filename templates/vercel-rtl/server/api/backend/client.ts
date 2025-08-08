import { defineEventHandler, deleteCookie, readBody } from 'h3'
import FetchServerApi, { errorResponse } from '~~/server/utils/api'
import { decryptSession, getSession, isExpiredTokenSafe } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, config = {} } = body

  if (!url) {
    setResponseStatus(event, 400)
    return errorResponse(400, 'آدرسی برای درخواست مشخص نشده است')
  }

  try {
    // Get session from cookie
    const session = await getSession(event)
    if (!session) {
      setResponseStatus(event, 401)
      return errorResponse(401, 'لطفا دوباره وارد شوید')
    }
    // Check if refresh token is expired
    const refreshTokenExpired = isExpiredTokenSafe(session.refresh_exp)
    if (refreshTokenExpired) {
      // Refresh token is expired, clear session cookie
      deleteCookie(event, 'session')
      setResponseStatus(event, 401)
      return errorResponse(401, 'لطفا دوباره وارد شوید')
    }
    // Check if access token is expired
    const accessTokenExpired = isExpiredTokenSafe(session.access_exp)

    // If access token is expired, refresh it
    if (accessTokenExpired) {
      const result = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refresh: session.refresh },
      })
      if (!result.success) {
        // Refresh failed, clear session cookie
        deleteCookie(event, 'session')
        setResponseStatus(event, 401)
        return errorResponse(401, 'لطفا دوباره وارد شوید')
      }
    }

    // Prepare headers with Authorization
    const headers = {
      ...config.headers,
      Authorization: `Bearer ${session.access}`,
    }

    return await FetchServerApi(event, url, {
      ...config,
      headers,
    })
  }
  catch (error: any) {
    // Handle authentication errors specifically
    if (error.statusCode === 401) {
      deleteCookie(event, 'session') // Clear session cookie
      setResponseStatus(event, 401)
      return errorResponse(401, 'لطفا دوباره وارد شوید')
    }

    setResponseStatus(event, error.status)
    return errorResponse(error.status, 'مشکلی در عملیات رخ داده است')
  }
})
