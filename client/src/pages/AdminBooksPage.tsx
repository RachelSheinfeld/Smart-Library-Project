import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getBooks, deleteBook } from '../api/booksApi'
import type { Book } from '../types/book'

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBooks = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getBooks()
      setBooks(data)
    } catch {
      setError('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBooks()
  }, [])

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId)
      void loadBooks()
    } catch {
      setError('Failed to delete book')
    }
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Admin Books Page</h1>
        <RouterLink to="/admin/books/new" className="button">
          Add Book
        </RouterLink>
      </div>

      {loading && <div className="spinner"></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="grid">
          {books.map((book) => (
            <article key={book._id} className="card">
              <div className="card-content">
                <h3 className="card-title">{book.title}</h3>
                <p className="card-subtitle">{book.author}</p>
                <p className="card-text">
                  {book.description || 'No description'}
                </p>
              </div>
              <div className="card-actions">
                <RouterLink to={`/admin/books/${book._id}/edit`} className="button" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  Edit
                </RouterLink>
                <button className="button error" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => void handleDelete(book._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBooksPage
