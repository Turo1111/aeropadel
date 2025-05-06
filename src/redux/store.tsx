import { configureStore } from '@reduxjs/toolkit'
import loadingSlice from './loadingSlice'
import alertSlice from './alertSlice'
import saleSlice from './saleSlice'

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        alert: alertSlice,
        sale: saleSlice,
    }
})

