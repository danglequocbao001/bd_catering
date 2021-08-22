import { createSlice } from '@reduxjs/toolkit'
import { storage } from '../helpers'

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
      storage.clear()
    },
  },
})

export const authActions = slice.actions
export const authReducers = slice.reducer
