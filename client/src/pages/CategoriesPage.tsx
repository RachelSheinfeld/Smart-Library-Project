import { useEffect, useState } from 'react'
import { getBooks } from '../api/booksApi'
import { getCategories } from '../api/categoriesApi'
import type { Book } from '../types/book'
import type { Category } from '../types/category'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
} from '@mui/material'

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [categoriesData, booksData] = await Promise.all([getCategories(), getBooks()])
      setCategories(categoriesData)
      setBooks(booksData)
    } catch {
      setError('Failed to load categories or books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const categoriesWithBooks = categories
    .map((category) => ({
      category,
      books: books.filter((book) => {
        const categoryId = typeof book.category === 'string' ? book.category : book.category?._id
        return categoryId === category._id
      }),
    }))
    .filter((item) => item.books.length > 0)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          קטגוריות עם ספרים פעילים
        </Typography>
        <Typography color="text.secondary">
          כאן תראה רק קטגוריות שמכילות ספרים במערכת, גם אם הספרים כרגע מושאלים.
        </Typography>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Paper sx={{ p: 2, bgcolor: 'error.lighter', color: 'error.dark' }}>{error}</Paper>}

      {!loading && !error && categoriesWithBooks.length === 0 && (
        <Typography>לא נמצאו קטגוריות פעילות.</Typography>
      )}

      <Grid container spacing={3}>
        {categoriesWithBooks.map(({ category, books: categoryBooks }) => (
          <Grid item xs={12} md={6} key={category._id}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={category.name}
                subheader={`מספר ספרים: ${categoryBooks.length}`}
              />
              <CardContent>
                <Stack spacing={1}>
                  {categoryBooks.map((book) => (
                    <Paper key={book._id} sx={{ p: 2, bgcolor: 'background.paper' }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={book.publishedYear ?? 'לא ידוע'} size="small" />
                        <Chip label={category.name} variant="outlined" size="small" />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default CategoriesPage
