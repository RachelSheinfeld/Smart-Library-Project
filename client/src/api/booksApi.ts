import apiClient from './http'
import type { Book } from '../types/book'
// ממשק שמגדיר את הנתונים הדרושים ליצירה או עדכון של ספר
export interface BookPayload {
  title: string
  author: string
  description?: string
  publishedYear?: number
  imageUrl?: string
  category: string
}

export const getBooks = async (categoryId?: string) => {
  const query = categoryId ? `?category=${encodeURIComponent(categoryId)}` : ''
  //encodeURIComponent מוודא שה־categoryId בטוח לשימוש בתוך URL.
  const { data } = await apiClient.get<Book[]>(`/books${query}`)
  return data
}
// מקבל ספר לפי מזהה
export const getBookById = async (id: string) => {
  const { data } = await apiClient.get<Book>(`/books/${id}`)
  return data
}
// מקבל ספרים לפי קטגוריה
export const getBooksByCategory = async (categoryId: string) => {
  const { data } = await apiClient.get<Book[]>(`/books?category=${encodeURIComponent(categoryId)}`)
  return data
}
// יוצר ספר חדש עם הנתונים שנשלחים ב־payload ומחזיר את הספר שנוצר
export const createBook = async (payload: BookPayload) => {
  const { data } = await apiClient.post<Book>('/books', payload)
  return data
}
// מעדכן ספר קיים לפי מזהה עם הנתונים שנשלחים ב־payload ומחזיר את הספר המעודכן
export const updateBook = async (id: string, payload: BookPayload) => {
  const { data } = await apiClient.put<Book>(`/books/${id}`, payload)
  return data
}
// מוחק ספר לפי מזהה ומחזיר הודעה על הצלחה
export const deleteBook = async (id: string) => {
  const { data } = await apiClient.delete<{ message: string }>(`/books/${id}`)
  return data
}
