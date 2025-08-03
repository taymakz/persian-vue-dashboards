import * as Yup from 'yup'

// Yup Option
Yup.setLocale({
  mixed: {
    default: 'ورودی نامعتبر است',
    required: 'لطفا این قسمت را خالی نگذارید',
  },
  string: {
    email: 'ایمیل وارد شده نامعتبر است',
    // eslint-disable-next-line no-template-curly-in-string
    min: ' حداقل مقدار ${path} ${min} است',
    // eslint-disable-next-line no-template-curly-in-string
    max: ' حداقل مقدار ${path} ${max} است',
    url: 'لینک وارد شده نامعتبر است',
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    min: ' حداقل مقدار ${path} ${min} است',
  },
})
export { Yup }
export function trimWhitespaceTransformer(_: any, originalValue: any) {
  if (typeof originalValue === 'string')
    return originalValue.trim() // Trim whitespace from string values

  return originalValue // Return original value for non-string values
}
