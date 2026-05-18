import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/user'

interface AuthState {
  user: User | null
  token: string | null
}

// שכבת Auth אחראית על שמירת המשתמש והטוקן בזיכרון גלובלי
// ומשמרת אותם גם ב־localStorage בין טעינות של הדפדפן.

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: (() => {
    const rawUser = localStorage.getItem('user')
    return rawUser ? (JSON.parse(rawUser) as User) : null
  })(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      // שומר רענון משתמש כך שיישמר גם לאחר רענון הדף
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      // מנקה את המידע של המשתמש כאשר יוצאים מהמערכת
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
