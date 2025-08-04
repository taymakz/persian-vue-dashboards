export interface AccountUserType {
  phone: string
  referral_code: string
  first_name: string
  last_name: string
  has_password: boolean
}
// Success result of user authentication
export interface AccountUserAuthenticateResultType {
  refresh: string
  access: string
  access_exp: number
}
