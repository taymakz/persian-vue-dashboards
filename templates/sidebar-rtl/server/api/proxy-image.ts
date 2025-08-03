import { createError, defineEventHandler, getQuery, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { url } = query

  if (!url || typeof url !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL parameter is required',
    })
  }

  try {
    // Validate that the URL is from Telegram
    const telegramDomains = [
      'cdn1.telegram-cdn.org',
      'cdn2.telegram-cdn.org',
      'cdn3.telegram-cdn.org',
      'cdn4.telegram-cdn.org',
      'cdn5.telegram-cdn.org',
      't.me',
    ]

    const urlObj = new URL(url)
    const isValidTelegramDomain = telegramDomains.some(
      domain =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
    )

    if (!isValidTelegramDomain) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only Telegram image URLs are allowed',
      })
    }

    // Fetch the image from Telegram
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://web.telegram.org/',
      },
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch image: ${response.statusText}`,
      })
    }

    // Get the content type from the response
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Validate that it's actually an image
    if (!contentType.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL does not point to an image',
      })
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()

    // Set appropriate headers
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

    // Return the buffer
    return new Uint8Array(imageBuffer)
  }
  catch (error: any) {
    console.error('Proxy image error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Failed to proxy image: ${error.message}`,
    })
  }
})
