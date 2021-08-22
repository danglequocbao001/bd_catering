import { configureStore } from '@reduxjs/toolkit'
import { reducers } from './redux/index'

const rootReducer = {
  auth: reducers.authReducers,
  address: reducers.addressReducers,
  search: reducers.searchReducers,
  cart: reducers.cartAmountReducers
}

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
