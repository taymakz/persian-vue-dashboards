/**
 * Regular expression for validating email addresses.
 * Ensures that the email contains at least one character before and after the "@" symbol,
 * followed by a valid domain name with at least one dot.
 */
export const emailRegex = /^\S[^\s@]*@\S[^\s.]*\.\S+$/

/**
 * Regular expression for validating Iranian phone numbers.
 * Accepts numbers starting with "+98", "0", or no prefix, followed by a 9-digit number.
 */
export const phoneRegex = /^(\+98|0)?9\d{9}$/

/**
 * Regular expression for validating Iranian postal codes.
 * Ensures the postal code consists of exactly 10 digits.
 */
export const postalCodeRegex = /^\d{10}$/

/**
 * Regular expression for validating Iranian national codes.
 * Ensures the national code consists of exactly 10 digits.
 */
export const nationalCodeRegex = /^\d{10}$/

/**
 * Regular expression for validating passwords.
 * Requires at least one uppercase letter, one lowercase letter, and a length between 6 and 18 characters.
 */
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,18}$/

/**
 * Regular expression to check if a password contains at least one lowercase letter.
 */
export const passwordLowercaseRegex = /[a-z]/

/**
 * Regular expression to check if a password contains at least one uppercase letter.
 */
export const passwordUppercaseRegex = /[A-Z]/

/**
 * Regular expression to check if a password contains at least one numeric digit.
 */
export const passwordNumberRegex = /\d/

/**
 * Regular expression to check if a password length is between 6 and 18 characters.
 */
export const passwordLengthRegex = /^.{6,18}$/

/**
 * Checks if a password contains at least one lowercase letter.
 *
 * @param password - The password to validate.
 * @returns True if the password contains a lowercase letter, otherwise false.
 */
export function passwordHasLowercase(password: string): boolean {
  return passwordLowercaseRegex.test(password)
}

/**
 * Checks if a password contains at least one uppercase letter.
 *
 * @param password - The password to validate.
 * @returns True if the password contains an uppercase letter, otherwise false.
 */
export function passwordHasUppercase(password: string): boolean {
  return passwordUppercaseRegex.test(password)
}

/**
 * Checks if a password contains at least one numeric digit.
 *
 * @param password - The password to validate.
 * @returns True if the password contains a number, otherwise false.
 */
export function passwordHasNumber(password: string): boolean {
  return passwordNumberRegex.test(password)
}

/**
 * Checks if a password length is between 6 and 18 characters.
 *
 * @param password - The password to validate.
 * @returns True if the password length is valid, otherwise false.
 */
export function passwordIsValidPasswordLength(password: string): boolean {
  return passwordLengthRegex.test(password)
}

/**
 * Validates a password based on predefined criteria.
 * Requires at least one uppercase letter, one lowercase letter, and a valid length.
 *
 * @param password - The password to validate.
 * @returns True if the password meets the requirements, otherwise false.
 */
export function validatePassword(password: string): boolean {
  return passwordRegex.test(password)
}
/**
 * Validates a password against all rules at once:
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one numeric digit
 * - Length between 6 and 18 characters
 *
 * @param password - The password to validate.
 * @returns True if the password meets all requirements, otherwise false.
 */
export function FullPasswordValidator(password: string): boolean {
  return (
    passwordLowercaseRegex.test(password)
    && passwordUppercaseRegex.test(password)
    && passwordNumberRegex.test(password)
    && passwordLengthRegex.test(password)
  )
}
/**
 * Validates an Iranian phone number.
 *
 * @param phoneNumber - The phone number to validate.
 * @returns True if the phone number is valid, otherwise false.
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  return phoneRegex.test(phoneNumber)
}

/**
 * Validates an email address.
 *
 * @param email - The email to validate.
 * @returns True if the email is valid, otherwise false.
 */
export function validateEmail(email: string): boolean {
  return emailRegex.test(email)
}

/**
 * Validates a username as either a phone number or an email address.
 *
 * @param username - The username to validate.
 * @returns True if the username is a valid phone number or email, otherwise false.
 */
export function validateUsername(username: string): boolean {
  return phoneRegex.test(username) || emailRegex.test(username)
}

/**
 * Validates an Iranian postal code.
 *
 * @param postalCode - The postal code to validate.
 * @returns True if the postal code is valid, otherwise false.
 */
export function validatePostalCode(postalCode: string): boolean {
  return postalCodeRegex.test(postalCode)
}

/**
 * Validates an Iranian national code.
 *
 * The validation includes:
 * - Ensuring the input is exactly 10 digits.
 * - Performing a checksum calculation to verify its authenticity.
 *
 * @param nationalCode - The national code to validate.
 * @returns True if the national code is valid, otherwise false.
 */
export function validateNationalCode(nationalCode?: string): boolean {
  if (
    !nationalCode
    || nationalCode.length !== 10
    || !nationalCodeRegex.test(nationalCode)
  ) {
    return false
  }

  const check = Number.parseInt(nationalCode[9]!)
  let sum = 0

  for (let i = 0; i < 9; i++)
    sum += Number.parseInt(nationalCode[i]!) * (10 - i)

  const remainder = sum % 11

  return (
    (remainder < 2 && check === remainder)
    || (remainder >= 2 && check + remainder === 11)
  )
}
