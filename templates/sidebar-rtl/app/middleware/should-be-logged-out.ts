export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server)
    return
  const tokens = getAuthenticateTokens()
  // if no tokens in localStorage
  if (tokens)
    return navigateTo('/')
})
