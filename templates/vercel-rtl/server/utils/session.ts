import type { AccountUserSessionAccessJWTType, AccountUserSessionRefreshJWTType, AccountUserSessionType, AccountUserTokensType } from '#shared/types/account'
import type { H3Event } from 'h3'
import type { JWTPayload } from 'jose'
import { getCookie, setCookie } from 'h3'
import { jwtVerify, SignJWT } from 'jose'
import { jwtDecode } from 'jwt-decode'

// eslint-disable-next-line node/prefer-global/process
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key'
const encodedKey = new TextEncoder().encode(JWT_SECRET)

export async function encryptSession(session: AccountUserSessionType): Promise<string> {
  return new SignJWT(session as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(encodedKey)
}

export async function decryptSession(session: string): Promise<AccountUserSessionType | null> {
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ['HS256'],
  })
  return payload as unknown as AccountUserSessionType
}

export async function getSession(event: H3Event): Promise<AccountUserSessionType | null> {
  const sessionCookie = getCookie(event, 'session')
  if (!sessionCookie)
    return null

  try {
    const session = await decryptSession(sessionCookie) as unknown as AccountUserSessionType
    return session
  }
  catch {
    return null
  }
}
export async function setAuthCookieSession(event: H3Event, tokens: AccountUserTokensType) {
  const decodedAccess = jwtDecode<AccountUserSessionAccessJWTType>(tokens.access)
  const decodedRefresh = jwtDecode<AccountUserSessionRefreshJWTType>(tokens.refresh)

  const session: AccountUserSessionType = {
    email: decodedAccess.email,
    first_name: decodedAccess.first_name,
    last_name: decodedAccess.last_name,
    has_password: decodedAccess.has_password,
    refresh: tokens.refresh,
    access: tokens.access,
    access_exp: decodedAccess.exp * 1000,
    refresh_exp: decodedRefresh.exp * 1000,
  }

  // Encrypt session before storing in cookie
  const encryptedSession = await encryptSession(session)
  deleteCookie(event, 'session') // Clear existing cookie
  // Set new session cookie with encrypted session data
  setCookie(event, 'session', encryptedSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  })
  
  return session
}
export function isExpiredTokenSafe(exp: number): boolean {
  const currentTime = Date.now() - 1000 // Subtract 1 second to avoid issues with token expiry during fetch
  return exp <= currentTime
}
export function isExpiredToken(exp: number): boolean {
  const currentTime = Date.now()
  return exp <= currentTime
}
