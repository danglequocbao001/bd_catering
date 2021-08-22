import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import cartItemApi from '../api/user'
import { storage } from '../helpers'

// const cart = createAsyncThunk('auth/user', async () => {
//   const cart = await cartItemApi.get()
//   return cart.data
// })

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    token: null,
    cartAmount: null
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload
      state.isLogin = true
      storage.set('token', action.payload)
    },
    logout: state => {
      state.isLogin = false;
      state.token = null
      storage.clearWithout(['idAddressActive', 'address','phone', 'cartAmount'])
    },
  },
  // extraReducers: builder =>{
  //   builder.addCase(cart.fulfilled, (state, actions) =>{
  //     console.log('set', actions.payload)
  //     state.cartAmount = actions.payload
  //   })
  // }
})

export const authActions = slice.actions
export const authReducers = slice.reducer
