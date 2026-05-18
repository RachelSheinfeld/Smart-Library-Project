// דף ספרים שבו אפשר לסנן לפי קטגוריה ולראות כרטיס לכל ספר
import { useEffect, useState } from 'react'
import { Box, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography, Alert } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { getBooks } from '../api/booksApi'
import { getCategories } from '../api/categoriesApi'
import { getAllBorrows } from '../api/borrowApi'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'
import type { Category } from '../types/category'

const BooksPage = () => {
  // דף הספרים הראשי - מציג רשימת ספרים עם סינון קטגוריות
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // טוען ספרים וקטגוריות מתוך ה־API, ומסנן קטגוריות שלא שייכות לספרים הטעונים
  useEffect(() => {
    // טוען את הספרים, הקטגוריות וההשאלות כדי לחשב זמינות
    const loadAll = async () => {
      setLoading(true)
      setError('')

      try {
        const [categoriesData, booksData, borrowsData] = await Promise.all([
          getCategories(),
          getBooks(selectedCategory || undefined),
          getAllBorrows(),
        ])

        const unavailableBookIds = new Set(
          borrowsData
            .filter((borrow) => !borrow.returned && new Date(borrow.dueDate) > new Date())
            .map((borrow) => (typeof borrow.book === 'string' ? borrow.book : borrow.book?._id))
            .filter((id): id is string => Boolean(id)),
        )

        const availableBooks = booksData.map((book) => ({
          ...book,
          isAvailable: !unavailableBookIds.has(book._id),
        }))

        const activeCategoryIds = new Set(
          availableBooks
            .map((book) => (typeof book.category === 'string' ? book.category : book.category?._id))
            .filter(Boolean),
        )

        setCategories(categoriesData.filter((category) => activeCategoryIds.has(category._id)))
        setBooks(availableBooks)
      } catch {
        setError('Failed to load books or categories')
      } finally {
        setLoading(false)
      }
    }

    void loadAll()
  }, [selectedCategory])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Typography variant="h4">Books Page</Typography>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory}
            label="Category"
            onChange={(event: SelectChangeEvent) => setSelectedCategory(event.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && books.length === 0 && <Alert severity="info">No books found.</Alert>}

      {!loading && !error && books.length > 0 && (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default BooksPage
