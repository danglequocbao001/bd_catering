const API_CONSTANTS = {
  AUTH: {
    SIGN_UP: '/user/sign-up',
    LOGIN: '/user/sign-in',
  },
  PROFILE: {
    GET_ONE: '/user/profile',
    UPDATE_ONE: '/user/profile/update',
  },
  HOME_PAGE: {
    GET_ALL: (date: string, limit: number) => `/food/list/${date}/${limit}`,
  },
  SEARCH: {
    SEARCH: `/food/search`,
  },
  CATEGORY: {
    GET_ALL: `/cate/list`,
    GET_ALL_DETAIL: (cateId: string, date: string, limit: number) => `/cate/food/${cateId}/${date}/${limit}`
  },
  FOOD_DETAIL: {
    GET: (foodId: string) => `/food/detail/${foodId}`
  },
  CART: {
    GET_COUNT: `/order/count/shopping-cart`,
    GET_ALL: `/order/shopping-cart`,
    ADD_ONE: `/order/add-to-cart`,
    UPDATE_ONE: `/order/update`,
    DELETE_ONE: `/order/delete`
  },
  ORDER: {
    GET_ALL: `/order/user/list`,
    GET_ONE: (orderId: string) => `/order/user/detail/${orderId}`,
    CONFIRM: `/order/confirm`
  }
}

export default API_CONSTANTS