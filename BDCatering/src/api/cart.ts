import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  getCount: (): any => {
    return api.get(API_CONSTANTS.CART.GET_COUNT);
  },
  getAll: (): any => {
    return api.get(API_CONSTANTS.CART.GET_ALL);
  },
  addOne: (param: any): any => {
    return api.post(API_CONSTANTS.CART.ADD_ONE, param);
  },
  updateOne: (param: any): any => {
    return api.post(API_CONSTANTS.CART.UPDATE_ONE, param);
  },
  deleteOne: (param: any): any => {
    return api.delete(API_CONSTANTS.CART.DELETE_ONE, param);
  },
};
