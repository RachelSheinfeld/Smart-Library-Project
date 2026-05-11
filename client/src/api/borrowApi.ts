import apiClient from './http'
import type { Borrow } from '../types/borrow'

export const getUserBorrows = async (userId: string) => {
  const { data } = await apiClient.get<Borrow[]>(`/borrow/user/${userId}`)
  return data
}

export const borrowBook = async (payload: { user: string; book: string; dueDate: string }) => {
  const { data } = await apiClient.post('/borrow', payload)
  return data
}

export const returnBook = async (borrowId: string) => {
  const { data } = await apiClient.put(`/borrow/return/${borrowId}`, {})
  return data
}
