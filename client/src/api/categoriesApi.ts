import apiClient from './http'
import type { Category } from '../types/category'

export const getCategories = async () => {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export const createCategory = async (payload: { name: string; description?: string }) => {
  const { data } = await apiClient.post<Category>('/categories', payload)
  return data
}
