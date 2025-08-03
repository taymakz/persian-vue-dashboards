/**
 * Capitalizes the first letter of a string.
 *
 * This function takes an input string and returns a new string with the first letter capitalized,
 * leaving the rest of the string unchanged.
 *
 * @param str - The input string to be modified.
 * @returns A new string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * This function capitalizes the first letter of each word in the input string, making it suitable
 * for formatting titles or headings.
 *
 * @param str - The input string to be transformed.
 * @returns A new string with each word's first letter capitalized.
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Truncates a string to the specified length and appends ellipsis if necessary.
 *
 * This function takes a string and truncates it to a specified length, appending an ellipsis ("...") 
 * if the string exceeds the maximum length. If the string is already shorter than the specified length, 
 * it remains unchanged.
 *
 * @param str - The input string to be truncated.
 * @param length - The maximum length to which the string should be truncated.
 * @returns A truncated string with an ellipsis if it exceeds the specified length.
 */
export function truncateString(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str
}

/**
 * Converts a string to kebab-case.
 *
 * This function converts an input string to kebab-case by replacing spaces and underscores with dashes,
 * and ensuring all letters are lowercase. It is commonly used in URLs or for generating slugs.
 *
 * @param str - The input string to be converted to kebab-case.
 * @returns A string in kebab-case format.
 */
export function toSlug(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')  // Adds hyphen between lowercase and uppercase letters
    .replace(/[\s_]+/g, '-')             // Replaces spaces and underscores with hyphens
    .toLowerCase()                      // Converts all letters to lowercase
}

/**
 * Checks if a given character is a Persian (Farsi) character.
 *
 * This function checks if the input character is part of the Persian or Arabic Unicode range.
 * It is useful for validating Persian text input or determining the language of a character.
 *
 * @param char - The character to check.
 * @returns True if the character is Persian, false otherwise.
 */
export function isPersian(char: string) {
  const persianRegex = /^[\u0600-\u06FF]/ // Persian/Arabic Unicode range
  return persianRegex.test(char)
}

/**
 * Generates a random string of gibberish with the specified length.
 *
 * This function creates a random string consisting of lowercase alphabetic characters of a specified length.
 * It is useful for generating placeholders or random test data.
 *
 * @param length - The length of the random string to generate.
 * @returns A random string of gibberish with the specified length.
 */
export function generateRandomGibberish(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
