export interface Book {
  _id: string
  title: string
  author: string
  description?: string
  publishedYear?: number
  imageUrl?: string
  category: string | { _id: string; name?: string }
  isAvailable?: boolean
}
