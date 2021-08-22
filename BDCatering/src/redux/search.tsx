import { createSlice } from '@reduxjs/toolkit'
import { storage } from '../helpers'

const slice = createSlice({
  name: 'search',
  initialState: {
    query: ''
  },
  reducers: {
    update: (state, action) => {
        state.query = action.payload
    },
  },
})

export const searchActions = slice.actions
export const searchReducers = slice.reducer
