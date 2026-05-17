// ייבוא חיבורים מהספריות שאנחנו משתמשים בהן
// useEffect ו־useState הם hooks של React שנדרשים לניהול מצב וטעינה
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getBooks, deleteBook } from '../api/booksApi'
import type { Book } from '../types/book'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'

// כתובת של תמונה זמנית עבור ספרים בלי תמונה
const placeholderImage = 'https://via.placeholder.com/640x360/1A686D/ffffff?text=No+Image'

const AdminBooksPage = () => {
  // כאן יאוחסנו הספרים מהשרת
  const [books, setBooks] = useState<Book[]>([])

  // מצב לטעינה בזמן שהנתונים עדיין נשלחים מהשרת
  const [loading, setLoading] = useState(true)

  // אם יש טעות בעבודה עם ה־API, נשמור את הטקסט שלה כאן
  const [error, setError] = useState('')

  // פונקציה טהורה שאחראית להביא את כל הספרים מהשרת
  const loadBooks = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getBooks()
      setBooks(data)
    } catch {
      // אם הבקשה לשרת נכשלת, נעדכן הודעה לשגיאה
      setError('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  // useEffect מריץ את loadBooks פעם אחת כשהדף נטען
  useEffect(() => {
    void loadBooks()
  }, [])

  // לחיצה על כפתור מחיקה שולחת בקשה לשרת ומטעינה מחדש את הספרים
  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId)
      void loadBooks()
    } catch {
      setError('Failed to delete book')
    }
  }

  return (
    // Container מספק שוליים ויישור כללי לדף
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* קופסה עליונה עם כותרת וכפתורי ניווט */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h4">Admin Books Page</Typography>
        <Stack direction="row" spacing={1}>
          {/* כפתור שיוביל לדף יצירת ספר חדש */}
          <Button component={RouterLink} to="/admin/books/new" variant="contained">
            Add Book
          </Button>
          {/* כפתור שמוביל לעמוד ההשאלות של המנהל */}
          <Button component={RouterLink} to="/admin/borrows" variant="outlined">
            View Borrows
          </Button>
        </Stack>
      </Box>

      {/* ספינר טעינה בזמן שמודדים את השרת */}
      {loading && <CircularProgress />}

      {/* הודעת שגיאה אם משהו השתבש */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* טבלת ספרים שמוצגת רק אחרי הטעינה וללא שגיאה */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* תמונת הספר */}
                <CardMedia
                  component="img"
                  image={book.imageUrl || placeholderImage}
                  alt={book.title}
                  sx={{ height: 220, objectFit: 'cover' }}
                />

                {/* תוכן הכרטיס: כותרת, מחבר ותיאור */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {book.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {book.description || 'No description available.'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    קטגוריה: {typeof book.category === 'string' ? 'Unknown' : book.category?.name ?? 'Unknown'}
                  </Typography>
                </CardContent>

                {/* כפתורי פעולות לעריכה ומחיקה */}
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Button component={RouterLink} to={`/admin/books/${book._id}/edit`} size="small" variant="outlined">
                    Edit
                  </Button>
                  <Button size="small" color="error" variant="contained" onClick={() => void handleDelete(book._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default AdminBooksPage
