import type { ProfessorSpecializationType } from '~/types/professor'

export function translateProfessorSpecialization(
  value: ProfessorSpecializationType,
): string {
  const translations: Record<ProfessorSpecializationType, string> = {
    GENERAL: 'عمومی',
    RELIGIOUS: 'معارف',
    SPECIALIZED: 'تخصصی',
  }
  return translations[value] || value
}
