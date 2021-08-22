import * as Yup from 'yup'
import { Regex } from '../constants'

export const defaultInput = {
  name: {
    min: 2,
    max: 30,
  },
  password: {
    min: 6,
    max: 30,
  },
 
  text: {
    invalid: (title: string) => `${title} không hợp lệ`,
    empty: (title: string) => `${title} không được để trống`,
    min: (title: string, number: number) => `${title} phải tối thiểu ${number} ký tự`,
    max: (title: string) => `${title} quá dài`,
    notMatch: (title: string) => `${title} không trùng khớp`
  },
}

const { name, password, text } = defaultInput

export const validation = {
  name: (title: string) =>
    Yup.string()
      .min(name.min, text.min(title, name.min))
      .max(name.max, text.max(title))
      .required(text.empty(title)),

  email: (title: string) => Yup.string().email(text.invalid(title)).required(text.empty(title)),

  phone: (title: string) =>
    Yup.string()
      .matches(Regex.vietnamPhoneNumber, text.invalid(title))
      .required(text.invalid(title)),

  password: (title: string) =>
    Yup.string()
      .min(password.min, text.min(title, password.min))
      .max(password.max, text.max(title))
      .required(text.empty(title)),

  password_confirmation: (title: string) =>
    Yup.string()
      .required(text.empty(title))
      .oneOf([Yup.ref('password')], text.notMatch(title)),
  string: (title: string) => Yup.string().required(text.empty(title)),
  inputCode: () =>
        Yup.string()
        .required()
        .max(1)


}
