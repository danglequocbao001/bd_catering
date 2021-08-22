import api from "./api"
import API_CONSTANTS from "./constants"

export default {
  getAll: (): any => {
    return api.get(API_CONSTANTS.ORDER.GET_ALL)
  },
  getOne: (orderId: any): any => {
    return api.get(API_CONSTANTS.ORDER.GET_ONE(orderId))
  },
  confirm: (): any => {
    return api.post(API_CONSTANTS.ORDER.CONFIRM)
  },
}