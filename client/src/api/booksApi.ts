import apiClient from './http'
import type { Book } from '../types/book'

export interface BookPayload {
  title: string
  author: string
  description?: string
  publishedYear?: number
  imageUrl?: string
  category: string
}

export const getBooks = async () => {
  const { data } = await apiClient.get<Book[]>('/books')
  return data
}

export const getBookById = async (id: string) => {
  const { data } = await apiClient.get<Book>(`/books/${id}`)
  return data
}

export const createBook = async (payload: BookPayload) => {
  const { data } = await apiClient.post<Book>('/books', payload)
  return data
}

export const updateBook = async (id: string, payload: BookPayload) => {
  const { data } = await apiClient.put<Book>(`/books/${id}`, payload)
  return data
}

export const deleteBook = async (id: string) => {
  const { data } = await apiClient.delete<{ message: string }>(`/books/${id}`)
  return data
}
