import type { AccountUserAuthenticateForgetPasswordVerifyOtpResultType, AccountUserAuthenticateResultType, AccountUserAuthenticateSectionResultType,  AccountUserType } from '~/types/account'
import type { ApiResponseType } from '~/types/request'
import FetchApi from '~/composables/api'

const basePrefix = '/app/account'

// Get the current authenticated user details
export async function AccountUserCurrentDetail(): Promise<ApiResponseType<AccountUserType>> {
  return ClientApi(`${basePrefix}/authenticate/current/`)
}

// check if the user is exist or not by phone number, base on that Section will be returned if otp user not exist or user don't have password,
// otherwise section will be password
export async function AccountUserAuthenticateCheck(phone: string): Promise<ApiResponseType<AccountUserAuthenticateSectionResultType>> {
  return FetchApi(`${basePrefix}/authenticate/check/`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })
}
// Authenticate user with password
export async function AccountUserAuthenticatePassword({
  phone,
  password,
}: {
  phone: string
  password: string
}): Promise<ApiResponseType<AccountUserAuthenticateResultType>> {
  return FetchApi(`${basePrefix}/authenticate/password/`, {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
}

// Authenticate user with OTP
export async function AccountUserAuthenticateOTP({
  phone,
  otp,
  referral_code = '',
}: {
  phone: string
  otp: string
  referral_code?: string
}): Promise<ApiResponseType<AccountUserAuthenticateResultType>> {
  return FetchApi(`${basePrefix}/authenticate/otp/`, {
    method: 'POST',
    body: JSON.stringify({ phone, otp, referral_code }),
  })
}

// Logout user
export async function AccountUserLogout(refresh: string): Promise<ApiResponseType<null>> {
  return ClientApi(`${basePrefix}/authenticate/logout/`, {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
}

// Forgot password: check user and send OTP
export async function AccountUserForgetPasswordCheck(phone: string): Promise<ApiResponseType<null>> {
  return FetchApi(`${basePrefix}/authenticate/forget-password/check/`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })
}

// Forgot password: verify OTP
export async function AccountUserForgetPasswordOTP({
  phone,
  otp,
}: {
  phone: string
  otp: string
}): Promise<ApiResponseType<AccountUserAuthenticateForgetPasswordVerifyOtpResultType>> {
  return FetchApi(`${basePrefix}/authenticate/forget-password/otp/`, {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  })
}

// Forgot password: reset password
export async function AccountUserForgetPasswordReset({
  phone,
  token,
  password,
  confirm_password,
}: {
  phone: string
  token: string
  password: string
  confirm_password: string
}): Promise<ApiResponseType<any>> {
  return FetchApi(`${basePrefix}/authenticate/forget-password/reset/`, {
    method: 'POST',
    body: JSON.stringify({ phone, token, password, confirm_password }),
  })
}

