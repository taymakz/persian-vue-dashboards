import type { AccountUserSessionAccessJWTType, AccountUserSessionRefreshJWTType, AccountUserSessionType, AccountUserTokensType } from '#shared/types/account'
import type { JWTPayload } from 'jose'
import { getCookie, setCookie } from 'h3'
import { jwtVerify, SignJWT } from 'jose'
import { jwtDecode } from 'jwt-decode'

const runtimeConfig = useRuntimeConfig()
const JWT_SECRET = runtimeConfig.jwtSecret || 'default_secret_key'
const encodedKey = new TextEncoder().encode(JWT_SECRET)

export async function encryptSession(session: AccountUserSessionType): Promise<string> {
  return new SignJWT(session as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(encodedKey)
}

export async function decryptSession(session: string) {
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function getSession(event: any): Promise<AccountUserSessionType | null> {
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
export async function setAuthCookieSession(event: any, tokens: AccountUserTokensType) {
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

  setCookie(event, 'session', encryptedSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  })
}
