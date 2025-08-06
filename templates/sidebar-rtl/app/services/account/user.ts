import type { AccountUserType } from '~/types/account'
import type { ApiResponseType } from '~/types/request'

const basePrefix = '/app/account'

// Get the current authenticated user details
export async function AccountUserCurrentDetail(): Promise<ApiResponseType<AccountUserType>> {
  return ClientApi(`${basePrefix}/authenticate/current/`)
}

// Authenticate user with password (now handled by server endpoint)
export async function AccountUserAuthenticatePassword({
  email,
  password,
}: {
  email: string
  password: string
}) {
  return $fetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

// Logout user (now handled by server endpoint)
export async function AccountUserLogout() {
  return $fetch('/api/auth/logout', {
    method: 'POST',
  })
}
