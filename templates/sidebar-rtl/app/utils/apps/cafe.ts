import type { UserCafeRoleType } from '~/types/cafe'

export function translateCafeRole(role: UserCafeRoleType): string {
  switch (role) {
    case 'ADMIN':
      return 'مدیر کل'
    case 'WAITOR':
      return 'گارسون'
    case 'ACCOUNTANT':
      return 'حسابدار'
    case 'BRANCH_MANAGER':
      return 'مدیر شعبه'
    case 'BRANCH_WAITOR':
      return 'گارسون شعبه'
    case 'BRANCH_ACCOUNTANT':
      return 'حسابدار شعبه'
    default:
      return role
  }
}
