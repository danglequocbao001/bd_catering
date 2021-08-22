import api from "./api"
import API_CONSTANTS from "./constants"

export default {
  getAll: (): any => {
    return api.get(API_CONSTANTS.CATEGORY.GET_ALL)
  },
  getAllDetail: (cateId: string, date: string, limit: number): any => {
    return api.get(API_CONSTANTS.CATEGORY.GET_ALL_DETAIL(cateId, date, limit))
  }
}