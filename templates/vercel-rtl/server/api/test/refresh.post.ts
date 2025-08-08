import { defineEventHandler, readBody } from 'h3'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { refresh } = await readBody(event)

  // Simulate refresh validation (always success for test)
  if (!refresh) {
    return {
      success: false,
      status: 400,
      message: 'Refresh token required',
      data: null,
    }
  }

  // Static user data
  const user = {
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    has_password: true,
  }

  // Static JWT payloads
  const accessPayload = { ...user, exp: Math.floor(Date.now() / 1000) + 60 * 15 } // 15 minutes
  const refreshPayload = { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30} // 30 days

  // Sign JWTs with a static secret
  const secret = new TextEncoder().encode('test_secret')
  const newAccess = await new SignJWT(accessPayload).setProtectedHeader({ alg: 'HS256' }).sign(secret)
  const newRefresh = await new SignJWT(refreshPayload).setProtectedHeader({ alg: 'HS256' }).sign(secret)

  return {
    success: true,
    status: 200,
    message: 'Token refreshed',
    data: {
      access: newAccess,
      refresh: newRefresh,
    },
  }
})
