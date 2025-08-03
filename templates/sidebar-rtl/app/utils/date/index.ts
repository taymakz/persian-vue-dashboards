import jalaliPlugin from '@zoomit/dayjs-jalali-plugin'
import jalaali from 'jalaali-js'

// Defines Persian weekdays starting with Saturday (Shanbe) as day 0
export const persianWeekDays = [
  'شنبه', // Saturday
  'یکشنبه', // Sunday
  'دوشنبه', // Monday
  'سه شنبه', // Tuesday
  'چهارشنبه', // Wednesday
  'پنج شنبه', // Thursday
  'جمعه', // Friday
] as const

// Creates a union type of Persian weekday names
export type PersianWeekDayType = (typeof persianWeekDays)[number]

/**
 * Returns the Persian name of the current day of the week, aligned with the Iranian week (Saturday as the first day).
 * @returns The Persian name of the current day of the week.
 */
export function getPersianWeekName(): PersianWeekDayType {
  const dayjs = useDayjs()
  const dayIndex = dayjs().locale('fa').weekday() % 7
  return persianWeekDays[dayIndex] as PersianWeekDayType // Type assertion
}

// Gets current time in Tehran timezone (HH:mm format)
export function getCurrentTime() {
  const dayjs = useDayjs()
  return dayjs().tz('Asia/Tehran').format('HH:mm')
}

// Returns current date in Persian calendar (YYYY/MM/DD)
export function getCurrentDatePersian() {
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)
  return dayjs().calendar('jalali').format('YYYY/MM/DD')
}
// Returns current date in Persian calendar (YYYY/MM/DD)
export function getCurrentYearPersian() {
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)
  return dayjs().calendar('jalali').format('YYYY')
}

// Calculates difference in days between two Persian dates
export function persianDateDiff(
  currentDate: string,
  targetDate: string,
): number {
  const dayjs = useDayjs()
  const persianDateRegex = /^\d{4}\/\d{2}\/\d{2}$/

  // Input validation
  if (
    !persianDateRegex.test(currentDate)
    || !persianDateRegex.test(targetDate)
  ) {
    throw new TypeError(
      'Invalid date format. Please provide valid Persian dates (YYYY/MM/DD).',
    )
  }

  // Helper function to convert Persian to Gregorian dates
  const convertToGregorian = (persianDate: string) => {
    const parts = persianDate.split('/').map(Number)

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      throw new Error('Invalid Persian date format. Expected YYYY/MM/DD.')
    }

    const [year, month, day] = parts as [number, number, number]
    return jalaali.toGregorian(year, month, day)
  }

  // Convert dates and calculate difference
  const currentGregorian = convertToGregorian(currentDate)
  const targetGregorian = convertToGregorian(targetDate)

  const currentDayjs = dayjs(
    `${currentGregorian.gy}-${currentGregorian.gm}-${currentGregorian.gd}`,
  )
  const targetDayjs = dayjs(
    `${targetGregorian.gy}-${targetGregorian.gm}-${targetGregorian.gd}`,
  )

  return targetDayjs.diff(currentDayjs, 'day')
}

// Gets Persian weekday name for a date offset by given days
export function getPersianWeekDayFromDays(days: number): PersianWeekDayType {
  const dayjs = useDayjs()
  dayjs.extend(jalaliPlugin)
  const currentDate = dayjs()
  const targetDate = currentDate.add(days, 'day')
  const targetDayIndex = targetDate.locale('fa').weekday() % 7
  return persianWeekDays[targetDayIndex] as PersianWeekDayType
}
export function remainDayForSubscription(
  expireDate: Date,
  formatAsDayHour: boolean = false,
): {
  isExpired: boolean
  remainValue: number | null // For display (days, hours, minutes, seconds, etc.)
  remainDays: number | null // For progress bar (always in days)
  suffix: string
} {
  const now = new Date()
  const expires = new Date(expireDate)

  if (now > expires) {
    return { isExpired: true, remainValue: null, remainDays: null, suffix: 'منقضی شده' }
  }

  const diffTime = expires.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // Total days, rounded up

  // Always calculate remaining days for the progress bar
  const remainDays = diffDays

  if (formatAsDayHour) {
    // Format with maximum days and minimum hours (or smaller units if < 1 day)
    if (diffDays >= 1) {
      return { isExpired: false, remainValue: diffDays, remainDays, suffix: 'روز' }
    }

    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    if (diffHours >= 1) {
      return { isExpired: false, remainValue: diffHours, remainDays: 1, suffix: 'ساعت' }
    }

    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    if (diffMinutes >= 1) {
      return { isExpired: false, remainValue: diffMinutes, remainDays: 1, suffix: 'دقیقه' }
    }

    const diffSeconds = Math.ceil(diffTime / 1000)
    return { isExpired: false, remainValue: diffSeconds, remainDays: 1, suffix: 'ثانیه' }
  }

  // Original behavior when formatAsDayHour is false or not provided
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365)
    return { isExpired: false, remainValue: years, remainDays, suffix: 'سال' }
  }

  if (diffDays >= 30) {
    const months = Math.floor(diffDays / 30)
    if (diffDays > 29 && diffDays < 31) {
      return { isExpired: false, remainValue: 30, remainDays, suffix: 'روز' }
    }
    return { isExpired: false, remainValue: months, remainDays, suffix: 'ماه' }
  }

  if (diffDays > 1) {
    return { isExpired: false, remainValue: diffDays, remainDays, suffix: 'روز' }
  }

  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  return { isExpired: false, remainValue: diffHours, remainDays: 1, suffix: 'ساعت' } // Less than a day still counts as 1 day for progress
}
export function formatPersianDateTime(date: string | Date): string {
  const dayjs = useDayjs()

  // Extend dayjs with jalali plugin
  dayjs.extend(jalaliPlugin)

  // Convert to Jalali with Persian locale
  const jalaliDate = dayjs(date).calendar('jalali').locale('fa')

  // Get weekday in Persian
  const weekdayIndex = dayjs(date).weekday()
  const weekDay = persianWeekDays[weekdayIndex]

  // Format date and time
  const formattedDate = jalaliDate.format('DD MMMM YYYY') // Persian date format
  const time = dayjs(date).format('HH:mm') // Time format

  return `${weekDay} ${formattedDate} ${time}`
}
