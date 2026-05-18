// דף להוספת ספר חדש על ידי המנהל
// משתמש ב־React hooks לניהול טופס, טעינה ומעבר בין דפים
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, Box, Button, Card, Container, Stack, TextField, Typography, Alert } from '@mui/material'
import { createBook, type BookPayload } from '../api/booksApi'
import { getCategories } from '../api/categoriesApi'
import type { Category } from '../types/category'

const AddBookPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [form, setForm] = useState<BookPayload>({
    title: '',
    author: '',
    description: '',
    publishedYear: undefined,
    imageUrl: '',
    category: '',
  })
  const [error, setError] = useState('')
  const [selectedImageName, setSelectedImageName] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  // מנהל שינויים בכל אחד מהשדות בטופס
  const handleChange = (field: keyof BookPayload) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === 'publishedYear' ? (value ? Number(value) : undefined) : value,
    }))
  }

  // טוען תמונה מקובץ וממיר אותה ל־Base64 כדי לשמור ב־form
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }))
        setSelectedImageName(file.name)
      }
    }
    reader.readAsDataURL(file)
  }

  // שומר את הספר החדש דרך ה־API ומעביר למסך הספרים בממשק הניהול
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      await createBook(form)
      navigate('/admin/books')
    } catch {
      setError('Failed to create book')
    }
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch {
        // ignore category load errors for this form
      }
    }

    void loadCategories()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
         Add New Book
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            required
            fullWidth
          />
          <TextField
            label="Author"
            value={form.author}
            onChange={handleChange('author')}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            label="Published Year"
            type="number"
            value={form.publishedYear ?? ''}
            onChange={handleChange('publishedYear')}
            fullWidth
          />
          <TextField
            label="Image URL"
            value={form.imageUrl?.startsWith('data:') ? selectedImageName : form.imageUrl ?? ''}
            onChange={handleChange('imageUrl')}
            placeholder="Enter image URL or select file from computer"
            fullWidth
          />
          <Button variant="outlined" onClick={openFilePicker} sx={{ width: 'fit-content' }}>
            Upload from Computer
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          {form.imageUrl && (
            <Box
              component="img"
              src={form.imageUrl}
              alt="תצוגת תמונה"
              sx={{ width: '100%', borderRadius: 2, maxHeight: 320, objectFit: 'cover' }}
            />
          )}
          <Autocomplete
            freeSolo
            options={categories.map((category) => category.name)}
            inputValue={form.category}
            onInputChange={(_, value) => setForm((prev) => ({ ...prev, category: value }))}
            renderInput={(params) => (
              <TextField {...params} label="Category" required fullWidth />
            )}
          />
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button type="submit" variant="contained">
              Create Book
            </Button>
            <Button type="button" onClick={() => navigate('/admin/books')}>
              Cancel
            </Button>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Card>
    </Container>
  )
}

export default AddBookPage
