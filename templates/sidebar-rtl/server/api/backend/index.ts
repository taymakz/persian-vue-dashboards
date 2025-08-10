import type { RequestMethod } from '~~/server/types'
import {
  defineEventHandler,
  getHeaders,
  getQuery,
  readBody,
  readMultipartFormData,
  setResponseStatus,
} from 'h3'
import { errorResponse } from '~~/server/utils/api'

export default defineEventHandler(async (event) => {
  const url = getQuery(event).targetUrl as string | undefined
  const method = (getQuery(event).method?.toString().toUpperCase() as RequestMethod) || 'GET'

  if (!url) {
    setResponseStatus(event, 400)
    return errorResponse(400, 'URL is required')
  }

  try {
    const incomingContentType = getHeaders(event)['content-type'] || ''
    let body: any
    const fetchHeaders = { ...getHeaders(event) }

    if (['GET', 'HEAD'].includes(method)) {
      body = undefined
    }
    else if (incomingContentType.includes('multipart/form-data')) {
      const formData = await readMultipartFormData(event)
      if (!formData) {
        setResponseStatus(event, 400)
        return errorResponse(400, 'Invalid form data')
      }

      const newFormData = new FormData()
      for (const item of formData) {
        if (!item.name)
          continue

        if (item.filename) {
          // Convert Node.js Buffer to Uint8Array for Blob constructor
          newFormData.append(item.name, new Blob([new Uint8Array(item.data)], { type: item.type }), item.filename)
        }
        else {
          newFormData.append(item.name, item.data.toString())
        }
      }
      body = newFormData
      // Let $fetch set content-type and content-length
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
    // Remove undefined values from headers object
    const filteredHeaders = Object.fromEntries(
      Object.entries(fetchHeaders).filter(([_, v]) => v !== undefined),
    ) as Record<string, string>

    const runtimeConfig = useRuntimeConfig(event)
    const baseApi = runtimeConfig.public.baseApi || 'http://localhost:8000'
    const fullUrl = `${baseApi}${url.startsWith('/') ? url : `/${url}`}`

    return await $fetch(fullUrl, {
      method,
      headers: filteredHeaders,
      body,
    })
  }
  catch (error: any) {
    setResponseStatus(event, error.status || 500)
    return errorResponse(error.status || 500, error.message || 'An error occurred')
  }
})
