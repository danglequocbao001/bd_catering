import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../helpers";


const slice = createSlice({
    name: 'address',
    initialState: {
        address: null,
        phone: null,
        idAddressActive: null
    },
    reducers: {
        update:(state, action) => {
            const { address, phone, idAddressActive } = action.payload
            storage.set('address', address)
            storage.set('phone', phone)
            storage.set('idAddressActive', idAddressActive)
            state.address = address
            state.phone = phone
            state.idAddressActive = idAddressActive

        },
        clear: (state) =>{
            state.address = null
            state.phone = null
            state.idAddressActive = null
            storage.remove('phone')
            storage.remove('address')
            storage.remove('idAddressActive')

        }
    }
})
export const addressActions = slice.actions
export const addressReducers = slice.reducer