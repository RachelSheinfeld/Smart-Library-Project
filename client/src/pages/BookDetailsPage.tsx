import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { getBookById } from '../api/booksApi'
import { borrowBook } from '../api/borrowApi'
import { useAuth } from '../context/AuthContext'
import type { Book } from '../types/book'
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'

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
  const borrowSeverity = borrowMessage.includes('הושאל') ? 'success' : 'warning'

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Details
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && book && (
        <Card>
          {book.imageUrl && <CardMedia component="img" height="280" image={book.imageUrl} alt={book.title} />}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {book.author}
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              {book.description || 'No description'}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="body2">Year: {book.publishedYear ?? 'Unknown'}</Typography>
              <Typography variant="body2">Category: {categoryName}</Typography>
            </Stack>
            <Button variant="contained" onClick={() => void handleBorrow()}>
              Borrow this book
            </Button>
            {borrowMessage && (
              <Alert severity={borrowSeverity} sx={{ mt: 2 }}>
                {borrowMessage}
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default BookDetailsPage