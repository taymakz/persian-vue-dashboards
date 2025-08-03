import type { SubscriptionType } from './subscription'

export interface AccountUserType {
  phone: string
  referral_code: string
  first_name: string
  last_name: string
  has_password: boolean
  subscription: SubscriptionType
  balance: number
  gift_balance: number
}

// Check if the user is exist or not by phone number, base on that Section will be returned if otp user not exist or user don't have password,
export type AccountUserAuthenticateCheckResultType = 'OTP' | 'PASSWORD'
export enum AccountUserAuthenticateSectionStepEnum {
  CHECK,
  PASSWORD,
  OTP,
}
export enum AccountUserAuthenticateForgetPasswordSectionStepEnum {
  CHECK,
  OTP,
  RESET,
}
export interface AccountUserAuthenticateSectionResultType {
  section: AccountUserAuthenticateCheckResultType
}

// Success result of user authentication
export interface AccountUserAuthenticateResultType {
  refresh: string
  access: string
  access_exp: number
}

export interface AccountUserAuthenticateForgetPasswordVerifyOtpResultType {
  token: string
}

export interface AccountUserWalletTransactionType {
  id: number
  amount: number
  description: string
  type: 'DEPOSIT' | 'WITHDRAW' | 'SUBSCRIPTION' | 'UPGRADE_SUBSCRIPTION'
  created_at: string // ISO date string
}
