import apiClient from './http'
import type { AuthResponse } from '../types/user'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export const login = async (payload: LoginPayload) => {

// שולח את פרטי ההתחברות לשרת,
// מחכה לתשובה,
// ומחלץ מתוך תגובת Axios את ה־data
// שמכיל את הטוקן ופרטי המשתמש 
 const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export const register = async (payload: RegisterPayload) => {
// שולח את פרטי ההתחברות לשרת,
// מחכה לתשובה,
// ומחלץ מתוך תגובת Axios את ה־data
// שמכיל את הטוקן ופרטי המשתמש 
 const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
  return data
}
