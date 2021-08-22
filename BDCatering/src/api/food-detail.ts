import api from "./api";
import API_CONSTANTS from "./constants";

export default {
  get: (foodId: string): any => {
    return api.get(API_CONSTANTS.FOOD_DETAIL.GET(foodId));
  },
};
