import { defineEventHandler, readBody } from 'h3'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  // Simulate validation (always success for test)
  if (!email || !password) {
    return {
      success: false,
      status: 400,
      message: 'Email and password required',
      data: null,
    }
  }

  // Static user data
  const user = {
    email,
    first_name: 'Test',
    last_name: 'User',
    has_password: true,
  }

  // Static JWT payloads
  const accessPayload = { ...user, exp: Math.floor(Date.now() / 1000) + 10 }
  const refreshPayload = { exp: Math.floor(Date.now() / 1000) + 30 }

  // Sign JWTs with a static secret
  const secret = new TextEncoder().encode('test_secret')
  const access = await new SignJWT(accessPayload).setProtectedHeader({ alg: 'HS256' }).sign(secret)
  const refresh = await new SignJWT(refreshPayload).setProtectedHeader({ alg: 'HS256' }).sign(secret)

  return {
    success: true,
    status: 200,
    message: 'Authenticated',
    data: {
      access,
      refresh,
    },
  }
})
