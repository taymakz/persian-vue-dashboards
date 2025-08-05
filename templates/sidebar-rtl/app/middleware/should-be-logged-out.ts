export default defineNuxtRouteMiddleware(async () => {
  const cookies = useCookie('session')
  if (cookies.value) {
    return navigateTo('/')
  }
})
