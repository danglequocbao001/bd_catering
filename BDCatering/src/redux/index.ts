import { addressActions, addressReducers } from './address'
import { authActions, authReducers } from './auth'
import { searchActions, searchReducers } from './search'
import { cartAmountReducers, cartAmountActions } from './cart-amount';


const actions = {
  auth: authActions,
  address: addressActions,
  search: searchActions,
  cartAmount: cartAmountActions
}

const reducers = {
  authReducers,
  addressReducers,
  searchReducers,
  cartAmountReducers
}

export { actions, reducers }
