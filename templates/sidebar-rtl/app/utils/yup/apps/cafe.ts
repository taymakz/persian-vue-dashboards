import { Yup } from '../base'

export const createCafeSchema = Yup.object({
  logo: Yup.mixed().nullable(),
  banner: Yup.mixed().nullable(),
  slug: Yup.string()
    .required('آدرس منو الزامی است')
    .min(3, 'حداقل ۳ کاراکتر')
    .max(24, 'حداکثر ۲۴ کاراکتر')
    .matches(/^[a-z1-9_-]+$/, 'فقط حروف کوچک انگلیسی (a-z)، اعداد (1-9)، خط تیره (-) و زیرخط (_)'),
  name_fa: Yup.string()
    .required('نام فارسی الزامی است')
    .min(2, 'حداقل ۲ کاراکتر')
    .max(24, 'حداکثر ۲۴ کاراکتر'),
  name_en: Yup.string()
    .required('نام انگلیسی الزامی است')
    .min(2, 'حداقل ۲ کاراکتر')
    .max(24, 'حداکثر ۲۴ کاراکتر')
    .matches(/^[a-z\s]+$/i, 'فقط حروف انگلیسی'),
  title_fa: Yup.string()
    .required('عنوان فارسی الزامی است')
    .max(32, 'حداکثر ۳۲ کاراکتر'),
  title_en: Yup.string()
    .required('عنوان انگلیسی الزامی است')
    .max(32, 'حداکثر ۳۲ کاراکتر')
    .matches(/^[a-z\s]+$/i, 'فقط حروف انگلیسی'),
  instagram: Yup.string()
    .nullable()
    .matches(/^[\w.]+$/, 'فقط حروف انگلیسی، اعداد و نقطه')
    .min(3, 'حداقل ۳ کاراکتر')
    .max(255, 'حداکثر ۲۵۵ کاراکتر'),
})
