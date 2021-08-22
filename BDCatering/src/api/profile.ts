import api from "./api"
import API_CONSTANTS from "./constants"

export default {
  getOne: (): any => {
    return api.get(API_CONSTANTS.PROFILE.GET_ONE)
  },

  updateOne: (): any => {
    return api.put(API_CONSTANTS.PROFILE.UPDATE_ONE)
  },
}