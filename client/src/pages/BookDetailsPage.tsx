import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { getBookById } from '../api/booksApi'
import { borrowBook } from '../api/borrowApi'
import { useAuth } from '../context/AuthContext'
import type { Book } from '../types/book'

const BookDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [borrowMessage, setBorrowMessage] = useState('')

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError('Missing book id')
        setLoading(false)
        return
      }

      try {
        const data = await getBookById(id)
        setBook(data)
      } catch {
        setError('Failed to load book details')
      } finally {
        setLoading(false)
      }
    }

    void loadBook()
  }, [id])

  const handleBorrow = async () => {
    if (!user || !book) {
      setBorrowMessage('צריך להתחבר כדי להשאיל ספר')
      return
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    try {
      await borrowBook({
        user: user.id,
        book: book._id,
        dueDate: dueDate.toISOString(),
      })
      setBorrowMessage('הספר הושאל בהצלחה')
    } catch (err) {
      if (isAxiosError(err)) {
        const days = err.response?.data?.daysUntilAvailable
        if (typeof days === 'number') {
          setBorrowMessage(`הספר לא זמין כרגע. ניתן להשאיל בעוד ${days} ימים.`)
          return
        }
      }
      setBorrowMessage('לא ניתן להשאיל כרגע את הספר')
    }
  }

  const categoryName = typeof book?.category === 'string' ? book?.category : book?.category?.name ?? 'Unknown'
  const borrowSeverity = borrowMessage.includes('הושאל') ? 'alert-success' : 'alert-warning'

  return (
    <>
      <h1>Book Details</h1>
      {loading && <div className="spinner"></div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && book && (
        <article className="card">
          {book.imageUrl && <img src={book.imageUrl} alt={book.title} className="card-image" style={{ maxHeight: 280 }} />}
          <div className="card-content">
            <h2 className="card-title">{book.title}</h2>
            <p className="card-subtitle">{book.author}</p>
            <p className="card-text">
              {book.description || 'No description'}
            </p>
            <div className="flex gap-2 mb-3">
              <span className="chip">Year: {book.publishedYear ?? 'Unknown'}</span>
              <span className="chip">Category: {categoryName}</span>
            </div>
            <button onClick={() => void handleBorrow()} className="button">
              Borrow this book
            </button>
            {borrowMessage && (
              <div className={`alert ${borrowSeverity} mt-2`}>
                {borrowMessage}
              </div>
            )}
          </div>
        </article>
      )}
    </>
  )
}

export default BookDetailsPage