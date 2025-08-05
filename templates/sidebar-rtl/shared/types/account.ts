export interface AccountUserType {
  email: string
  first_name: string
  last_name: string
  has_password: boolean
}

export interface AccountUserTokensType {
  refresh: string
  access: string
}

export interface AccountUserSessionAccessJWTType extends AccountUserType {
  exp: number
}
export interface AccountUserSessionRefreshJWTType {
  exp: number
}

export type AccountUserSessionType = AccountUserType & AccountUserTokensType & {
  access_exp: number
  refresh_exp: number
}
