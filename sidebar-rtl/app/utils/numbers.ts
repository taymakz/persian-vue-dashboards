/**
 * Calculates the discount percentage based on the original price and the discount amount.
 *
 * This function computes the percentage of discount applied to an item by taking the original
 * price and the discount amount, then calculating the relative percentage reduction.
 *
 * @param originalPrice - The original price of the item.
 * @param discount - The discount amount applied to the item.
 * @returns The percentage of the discount, rounded down to the nearest whole number.
 */
export function calcDiffPercentage(originalPrice: number, discount: number) {
  return Math.floor(((originalPrice - discount) / originalPrice) * 100)
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * This function rounds a given number to a specified number of decimal places using standard
 * rounding rules. If no number of decimals is provided, it defaults to rounding to two decimal places.
 *
 * @param num - The number to be rounded.
 * @param decimals - The number of decimal places to round to (default is 2).
 * @returns The rounded number, with the specified number of decimal places.
 */
export function roundToDecimals(num: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round(num * factor) / factor
}

/**
 * Formats a number by inserting commas as thousands separators.
 *
 * This function converts a number into a string, with commas placed appropriately to separate
 * every three digits from the right. It is useful for improving the readability of large numbers.
 *
 * @param num - The number to be formatted.
 * @returns A string representing the formatted number with commas as thousands separators.
 */
export function splitNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Generates a random number within a specified range (inclusive).
 *
 * This function generates a random number that is greater than or equal to the minimum value
 * and less than or equal to the maximum value. It is useful for scenarios where randomization
 * within a given range is required.
 *
 * @param min - The minimum value in the range.
 * @param max - The maximum value in the range.
 * @returns A random number between the specified minimum and maximum values.
 */
export function getRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Formats a size in bytes into a human-readable string with appropriate units (B, KB, MB, GB, TB).
 *
 * This function takes a size in bytes and converts it into a more readable format, displaying
 * the size with the correct unit (e.g., KB for kilobytes, MB for megabytes). The size is rounded
 * to two decimal places for clarity.
 *
 * @param sizeInBytes - The size in bytes to be formatted.
 * @returns A string representing the size, with an appropriate unit (e.g., "10.5 MB").
 */
export default function formatSize(sizeInBytes: number): string {
  if (sizeInBytes === 0)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024))
  const size = sizeInBytes / 1024 ** i

  // Round the size to two decimal places
  const formattedSize = size.toFixed(2)

  // Return the formatted string
  return `${formattedSize} ${units[i]}`
}

/**
 * Formats a number with spaces as thousands separators.
 *
 * This function formats a number by inserting spaces every three digits from the left,
 * which is commonly used in countries where spaces are preferred over commas for large numbers.
 *
 * @param num - The number to be formatted.
 * @returns A string representing the formatted number with spaces as thousands separators.
 */
export function formatNumberWithSpaces(num: number | string): string {
  // Convert number to string if it's not already
  const numStr = num.toString()

  // Regular expression to insert spaces every three digits from the left
  const formattedStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  // Return the formatted string
  return formattedStr
}

/**
 * Converts Persian digits to English digits in a string.
 *
 * This function takes a string containing Persian digits and converts them to their
 * English counterparts. It is particularly useful for handling Persian numerals in
 * web applications or systems that need to support multiple numeral systems.
 *
 * @param persianNumber - The string containing Persian digits to be converted.
 * @returns A string with Persian digits replaced by English digits.
 */
export function convertPersianToEnglishNumber(persianNumber: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  return persianNumber.replace(/[\u06F0-\u06F9]/g, (char: string): string => {
    const index = persianDigits.indexOf(char)
    return index !== -1 ? (englishDigits[index] ?? char) : char
  })
}
