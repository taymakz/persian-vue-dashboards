export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return
  const tokens = getAuthenticateTokens()
  // if no tokens in localStorage
  if (!tokens)
    return navigateTo(`/auth/login?backUrl=${to.fullPath}`)
  if (!isAuthenticateAccessTokenExpired())
    return
  const authStore = useAuthenticateStore()

  // If access token is expired, try refreshing it
  if (isAuthenticateAccessTokenExpired()) {
    const { tokens: newTokens } = await authStore.RefreshToken()
    if (!newTokens) {
      return navigateTo(`/auth/login?backUrl=${encodeURIComponent(to.fullPath)}`)
    }
  }

  // Optional: Retrieve user details if not already loaded
  if (!authStore.isLogin && !authStore.getLoading) {
    await authStore.SetUserDetail()
  }

  // Redirect to login if user is still not logged in after attempting refresh
  if (!authStore.isLogin) {
    return navigateTo(`/auth/login?backUrl=${encodeURIComponent(to.fullPath)}`)
  }
})
