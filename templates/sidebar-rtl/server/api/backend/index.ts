import { defineEventHandler, readBody } from 'h3'
import FetchServerApi from '~~/server/utils/api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, config = {} } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required',
    })
  }

  try {
    return await FetchServerApi(event, url, ...config)
  }
  catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.message || 'An error occurred',
      data: null,
    }
  }
})
