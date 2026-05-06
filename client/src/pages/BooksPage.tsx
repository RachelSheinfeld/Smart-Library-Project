import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { getBooks } from '../api/booksApi'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await getBooks()
        setBooks(data)
      } catch {
        setError('Failed to load books')
      } finally {
        setLoading(false)
      }
    }

    void loadBooks()
  }, [])

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Books Page
      </Typography>
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
            <BookCard key={book._id} book={book} />
          ))}
        </Box>
      )}
    </>
  )
}

export default BooksPage