import type {
  DegreeType,
  EntryYearSemesterType,
  EntryYearType,
  GenderType,
} from '~/types/user'

export function translateEntryYear(value: EntryYearType): string {
  const translations: Record<EntryYearType, string> = {
    BEFORE_400: '۴۰۰ و ما قبل',
    YEAR_401: '۴۰۱',
    YEAR_402: '۴۰۲',
    YEAR_403: '۴۰۳',
  }
  return translations[value] || value
}

export function translateEntryYearSemester(
  value: EntryYearSemesterType,
): string {
  const translations: Record<EntryYearSemesterType, string> = {
    MEHR: 'مهر',
    BAHMAN: 'بهمن',
  }
  return translations[value] || value
}

export function translateGender(value: GenderType): string {
  const translations: Record<GenderType, string> = {
    MALE: 'مرد',
    FEMALE: 'زن',
  }
  return translations[value] || value
}

export function translateDegree(value: DegreeType): string {
  const translations: Record<DegreeType, string> = {
    BACHELOR: 'کارشناسی',
  }
  return translations[value] || value
}
