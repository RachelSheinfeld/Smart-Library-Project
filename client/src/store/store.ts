import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

//הגדרת הסטור של הרדקס
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
// הגדרת סוגים לסלקטורים ולדיספאצ'ים
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
