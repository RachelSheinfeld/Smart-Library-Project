import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookById, updateBook, type BookPayload } from '../api/booksApi'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

const EditBookPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<BookPayload>({
    title: '',
    author: '',
    description: '',
    publishedYear: undefined,
    imageUrl: '',
    category: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError('Missing book id')
        setLoading(false)
        return
      }

      try {
        const book = await getBookById(id)
        setForm({
          title: book.title,
          author: book.author,
          description: book.description ?? '',
          publishedYear: book.publishedYear,
          imageUrl: book.imageUrl ?? '',
          category: typeof book.category === 'string' ? book.category : book.category?._id ?? '',
        })
      } catch {
        setError('Failed to load book details')
      } finally {
        setLoading(false)
      }
    }

    void loadBook()
  }, [id])

  const handleChange = (field: keyof BookPayload) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === 'publishedYear' ? (value ? Number(value) : undefined) : value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!id) {
      setError('Missing book id')
      return
    }

    try {
      await updateBook(id, form)
      navigate('/admin/books')
    } catch {
      setError('Failed to update book')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ width: '100%', maxWidth: 600, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Book Page
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Title" value={form.title} onChange={handleChange('title')} required />
            <TextField label="Author" value={form.author} onChange={handleChange('author')} required />
            <TextField label="Description" value={form.description} onChange={handleChange('description')} multiline minRows={3} />
            <TextField
              label="Published Year"
              type="number"
              value={form.publishedYear ?? ''}
              onChange={handleChange('publishedYear')}
            />
            <TextField label="Image URL" value={form.imageUrl ?? ''} onChange={handleChange('imageUrl')} />
            <TextField label="Category ID" value={form.category} onChange={handleChange('category')} required />
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

export default EditBookPage
