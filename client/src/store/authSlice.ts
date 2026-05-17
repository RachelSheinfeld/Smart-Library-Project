import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/user'

interface AuthState {
  user: User | null
  token: string | null
}

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
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
