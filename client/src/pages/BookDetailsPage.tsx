// דף פרטי ספר שבו ניתן לראות מידע על הספר ולהשאיל אותו
import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { getBookById } from '../api/booksApi'
import { borrowBook } from '../api/borrowApi'
import { useAppSelector } from '../store/hooks'
import type { RootState } from '../store/store'
import type { Book } from '../types/book'

const BookDetailsPage = () => {
  // דף פרטי ספר - טוען את פרטי הספר לפי מזהה מה-url
  const { id } = useParams()
  const user = useAppSelector((state: RootState) => state.auth.user)
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [borrowMessage, setBorrowMessage] = useState('')

  // טוען את פרטי הספר לפי ה־id שמתקבל מהנתיב
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

  // מבצע השאלה של הספר דרך ה־API ומציג הודעה מתאימה
  // את תאריך ההחזרה מגדירים כאן ב־14 ימים מהיום
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
      setBorrowMessage('The book was borrowed successfully')
    } catch (err) {
      if (isAxiosError(err)) {
        const days = err.response?.data?.daysUntilAvailable
        if (typeof days === 'number') {
          setBorrowMessage(`The book is not available yet. It will be available in ${days} days.`)
          return
        }
      }
      setBorrowMessage('Not able to borrow the book at the moment')
    }
  }

  const categoryName = typeof book?.category === 'string' ? book?.category : book?.category?.name ?? 'Unknown'

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Details
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && book && (
        <Card sx={{ boxShadow: 4 }}>
          {book.imageUrl && (
            <CardMedia
              component="img"
              image={book.imageUrl}
              alt={book.title}
              sx={{ height: 360, objectFit: 'cover' }}
            />
          )}
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5" component="h2">
                {book.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {book.author}
              </Typography>
              <Typography>{book.description || 'No description'}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`Year: ${book.publishedYear ?? 'Unknown'}`} />
                <Chip label={`Category: ${categoryName}`} variant="outlined" />
              </Stack>
              <Button variant="contained" size="large" onClick={handleBorrow}>
                Borrow this book
              </Button>
              {borrowMessage && (
                <Alert severity={borrowMessage.includes('was borrowed') ? 'success' : 'warning'}>
                  {borrowMessage}
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default BookDetailsPage
