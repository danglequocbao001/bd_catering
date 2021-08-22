import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  get: (param: any): any => {
    return api.post(API_CONSTANTS.SEARCH.SEARCH, param);
  },
};
