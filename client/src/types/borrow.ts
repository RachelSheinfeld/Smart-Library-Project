import type { Book } from './book'
import type { User } from './user'

export interface Borrow {
  _id: string
  user: string | User
  book: string | Book
  borrowDate: string
  dueDate: string
}
