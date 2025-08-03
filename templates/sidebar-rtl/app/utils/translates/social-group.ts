import type {
  SocialGroupCategoryType,
  SocialGroupGroupType,
  SocialGroupPlatformType,
} from '~/types/social-group'

// Translation for SocialGroupCategoryType
export function translateSocialGroupCategory(
  value: SocialGroupCategoryType,
): string {
  const translations: Record<SocialGroupCategoryType, string> = {
    OFFICIAL: 'رسمی',
    CASUAL: 'دورهمی',
    STUDY: 'درسی',
  }
  return translations[value] || value
}

// Translation for SocialGroupGroupType
export function translateSocialGroupGroupType(
  value: SocialGroupGroupType,
): string {
  const translations: Record<SocialGroupGroupType, string> = {
    GROUP: 'گروه',
    CHANNEL: 'کانال',
  }
  return translations[value] || value
}

// Translation for SocialGroupPlatformType
export function translateSocialGroupPlatform(
  value: SocialGroupPlatformType,
): string {
  const translations: Record<SocialGroupPlatformType, string> = {
    TELEGRAM: 'تلگرام',
    WHATSAPP: 'واتساپ',
  }
  return translations[value] || value
}
