import api from "./api"
import API_CONSTANTS from "./constants"

export default {
  getAll: (date: string, limit: number): any => {
    return api.get(API_CONSTANTS.HOME_PAGE.GET_ALL(date, limit))
  },
}