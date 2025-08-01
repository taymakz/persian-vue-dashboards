import type { UseTimeAgoMessages } from '@vueuse/core'
import { useTimeAgo } from '@vueuse/core'

const FA_MESSAGES: UseTimeAgoMessages = {
  justNow: 'همین حالا',
  past: n => n.match(/\d/) ? `${n} قبل` : n,
  future: n => n.match(/\d/) ? `در ${n}` : n,
  month: (n, past) => n === 1
    ? past
      ? 'ماه قبل'
      : 'ماه بعد'
    : `${n} ماه`,
  year: (n, past) => n === 1
    ? past
      ? 'سال قبل'
      : 'سال بعد'
    : `${n} سال`,
  day: (n, past) => n === 1
    ? past
      ? 'دیروز'
      : 'فردا'
    : `${n} روز`,
  week: (n, past) => n === 1
    ? past
      ? 'هفته قبل'
      : 'هفته بعد'
    : `${n} هفته`,
  hour: n => `${n} ساعت`,
  minute: n => `${n} دقیقه`,
  second: n => `${n} ثانیه`,
  invalid: 'نامعتبر',
}

/**
 * useFaTimeAgo composable for Persian locale
 *
 * @param time - The time to calculate relative time for
 * @returns Reactive string of time ago in Persian
 */
export function useFaTimeAgo(
  time: Date | number | string,
) {
  return useTimeAgo(time, {
    messages: FA_MESSAGES,
  })
}
