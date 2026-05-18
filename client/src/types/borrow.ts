import type { Book } from './book'
import type { User } from './user'

export interface Borrow {
  _id: string
  user: string | User | null
  book: string | Book | null
  borrowDate: string
  dueDate: string
  returned: boolean
}
