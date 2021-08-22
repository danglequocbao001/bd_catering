import api from "./api"
import { ILogin, ISignUp } from "./apiInterfaces"
import API_CONSTANTS from "./constants"

export default {
  login: (params: ILogin): any => {
    return api.post(API_CONSTANTS.AUTH.LOGIN, params)
  },

  signUp: (params: ISignUp): any => {
    return api.post(API_CONSTANTS.AUTH.SIGN_UP, params)
  },
}