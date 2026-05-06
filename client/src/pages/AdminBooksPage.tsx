import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getBooks, deleteBook } from '../api/booksApi'
import type { Book } from '../types/book'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Books Page
        </Typography>
        <Button variant="contained" component={RouterLink} to="/admin/books/new">
          Add Book
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {books.map((book) => (
            <Card key={book._id}>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography color="text.secondary">{book.author}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {book.description || 'No description'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to={`/admin/books/${book._id}/edit`} size="small">
                  Edit
                </Button>
                <Button color="error" size="small" onClick={() => void handleDelete(book._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default AdminBooksPage
