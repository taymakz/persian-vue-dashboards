import { Yup } from '../base'

export const schemaLogin = Yup.object().shape({
  email: Yup.string()
    .required('ایمیل الزامی است')
    .email('ایمیل وارد شده نامعتبر است'),
  password: Yup.string()
    .required('کلمه عبور الزامی است')
    .min(8, 'کلمه عبور باید حداقل 8 کاراکتر باشد')
    .max(16, 'کلمه عبور باید حداکثر 16 کاراکتر باشد')
    .matches(/[a-z]/, 'کلمه عبور باید شامل حروف کوچک باشد')
    .matches(/\d/, 'کلمه عبور باید شامل اعداد باشد'),
})
