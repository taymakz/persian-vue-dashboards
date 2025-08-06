import { decryptSession, isExpiredToken } from '~~/server/utils/session'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    await handleClient(to)
  }
  else {
    await handleServer(to)
  }
})

async function handleClient(to: any) {
  const isValidSession = await $fetch('/api/auth/validate-session')

  if (!isValidSession.valid) {
    return useRouter().push(`/auth/login?backUrl=${to.fullPath}`)
  }
}
async function handleServer(to: any) {
  const cookie = useCookie('session')

  if (!cookie.value) {
    return navigateTo(`/auth/login?backUrl=${to.fullPath}`)
  }
  const session = await decryptSession(cookie.value)
  if (!session) {
    // Session decryption failed, redirect to login
    return navigateTo(`/auth/login?backUrl=${to.fullPath}`)
  }
  if (isExpiredToken(session.access_exp) && isExpiredToken(session.refresh_exp)) {
    // delete session cookie
    cookie.value = null
    // Both access and refresh tokens are expired, redirect to login
    return navigateTo(`/auth/login?backUrl=${to.fullPath}`)
  }
  if (isExpiredToken(session.access_exp)) {
    // Access token is expired, but refresh token is valid
    // Redirect to refresh endpoint
    const result = await $fetch('/api/auth/refresh', {
      method: 'POST',
      body: { refresh: session.refresh },
    })
    if (!result.success) {
      // Refresh failed, redirect to login
      return navigateTo(`/auth/login?backUrl=${to.fullPath}`)
    }
  }
}
