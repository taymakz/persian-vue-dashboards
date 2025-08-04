import type { ApiResponseType } from '~/types/request'
import FetchApi from '~/composables/api'
import type { AccountUserAuthenticateResultType, AccountUserType } from '~/types/account'

const basePrefix = '/app/account'

// Get the current authenticated user details
export async function AccountUserCurrentDetail(): Promise<ApiResponseType<AccountUserType>> {
  return ClientApi(`${basePrefix}/authenticate/current/`)
}

// Logout user
export async function AccountUserLogout(refresh: string): Promise<ApiResponseType<null>> {
  return ClientApi(`${basePrefix}/authenticate/logout/`, {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
}


// Authenticate user with password
export async function AccountUserAuthenticatePassword({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<ApiResponseType<AccountUserAuthenticateResultType>> {
  return FetchApi(`${basePrefix}/authenticate/password/`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
