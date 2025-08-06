export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    await handleClient()
  }
  else {
    await handleServer()
  }
})

async function handleClient() {
  const isSessionValid = await $fetch('/api/auth/is-valid-session')
  if (isSessionValid.valid) {
    return useRouter().push('/')
  }
}
async function handleServer() {
  const cookie = useCookie('session')
  if (cookie.value) {
    return navigateTo('/')
  }
}
