export interface AccountUserType {
  phone: string
  referral_code: string
  first_name: string
  last_name: string
  has_password: boolean
}

export interface AccountUserSessionType {
  refresh: string
  access: string
  access_exp: number
}
