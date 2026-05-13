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

const placeholderImage = 'https://via.placeholder.com/640x360/1A686D/ffffff?text=No+Image'

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h4">Admin Books Page</Typography>
        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/admin/books/new" variant="contained">
            Add Book
          </Button>
          <Button component={RouterLink} to="/admin/borrows" variant="outlined">
            View Borrows
          </Button>
        </Stack>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  image={book.imageUrl || placeholderImage}
                  alt={book.title}
                  sx={{ height: 220, objectFit: 'cover' }}
                />
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
