type GenderType = "MALE" | "FEMALE"
export function translateGender(value: GenderType): string {
  const translations: Record<GenderType, string> = {
    MALE: 'مرد',
    FEMALE: 'زن',
  }
  return translations[value] || value
}
