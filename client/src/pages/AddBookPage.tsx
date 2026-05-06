import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook, type BookPayload } from '../api/booksApi'
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

const AddBookPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<BookPayload>({
    title: '',
    author: '',
    description: '',
    publishedYear: undefined,
    imageUrl: '',
    category: '',
  })
  const [error, setError] = useState('')

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

    try {
      await createBook(form)
      navigate('/admin/books')
    } catch {
      setError('Failed to create book')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ width: '100%', maxWidth: 600, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Book Page
        </Typography>
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
          <TextField
            label="Category ID"
            value={form.category}
            onChange={handleChange('category')}
            required
          />
          <Button type="submit" variant="contained">
            Create Book
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

export default AddBookPage
