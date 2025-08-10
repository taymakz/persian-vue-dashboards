import type { RequestMethod } from '~~/server/types'
import { defineEventHandler, deleteCookie, getQuery, readMultipartFormData, setResponseStatus } from 'h3'
import { errorResponse } from '~~/server/utils/api'
import { getSession, isExpiredTokenSafe } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string | undefined
  const method = (getQuery(event).method?.toString().toUpperCase() as RequestMethod) || 'GET'

  if (!url) {
    setResponseStatus(event, 400)
    return errorResponse(400, 'آدرسی برای درخواست مشخص نشده است')
  }

  try {
    const session = await getSession(event)
    if (!session) {
      setResponseStatus(event, 401)
      return errorResponse(401, 'لطفا دوباره وارد شوید')
    }
    if (isExpiredTokenSafe(session.refresh_exp)) {
      deleteCookie(event, 'session')
      setResponseStatus(event, 401)
      return errorResponse(401, 'لطفا دوباره وارد شوید')
    }
    if (isExpiredTokenSafe(session.access_exp)) {
      const result = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refresh: session.refresh },
      })
      if (!result.success) {
        deleteCookie(event, 'session')
        setResponseStatus(event, 401)
        return errorResponse(401, 'لطفا دوباره وارد شوید')
      }
    }

    const headers = {
      ...getHeaders(event),
      Authorization: `Bearer ${session.access}`,
    }

    const incomingContentType = getHeaders(event)['content-type'] || ''
    let body: any
    const fetchHeaders = { ...headers }

    if (['GET', 'HEAD'].includes(method)) {
      body = undefined
    }
    else if (incomingContentType.includes('multipart/form-data')) {
      const formData = await readMultipartFormData(event)
      if (!formData) {
        setResponseStatus(event, 400)
        return errorResponse(400, 'داده‌های فرم نامعتبر است')
      }

      const newFormData = new FormData()
      for (const item of formData) {
        if (!item.name)
          continue

        if (item.filename) {
          // Convert Buffer to Uint8Array before Blob
          newFormData.append(item.name, new Blob([new Uint8Array(item.data)], { type: item.type }), item.filename)
        }
        else {
          newFormData.append(item.name, item.data.toString())
        }
      }

      body = newFormData
      // Remove content-type and content-length to let $fetch handle them
      delete fetchHeaders['content-type']
      delete fetchHeaders['content-length']
    }
    else if (incomingContentType.includes('application/json')) {
      body = await readBody(event)
      fetchHeaders['content-type'] = 'application/json'
    }
    else {
      body = await readBody(event)
    }

    const runtimeConfig = useRuntimeConfig(event)
    const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'
    const fullUrl = `${baseApi}/api/admin${url.startsWith('/') ? url : `/${url}`}`

    return await $fetch(fullUrl, {
      method,
      headers: fetchHeaders,
      body,
    })
  }
  catch (error: any) {
    if (error.statusCode === 401) {
      deleteCookie(event, 'session')
      setResponseStatus(event, 401)
      return errorResponse(401, 'لطفا دوباره وارد شوید')
    }
    setResponseStatus(event, error.status || 500)
    return errorResponse(error.status || 500, 'مشکلی در عملیات رخ داده است')
  }
})
