import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { getBookById, updateBook, type BookPayload } from '../api/booksApi'
import { getCategories } from '../api/categoriesApi'
import type { Category } from '../types/category'

const EditBookPage = () => {
  const { id } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageName, setSelectedImageName] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

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

  const handleChange = (field: keyof BookPayload) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === 'publishedYear' ? (value ? Number(value) : undefined) : value,
    }))
  }

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch {
        // ignore category load errors
      }
    }

    void loadCategories()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          עדכון ספר
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="כותרת"
              value={form.title}
              onChange={handleChange('title')}
              required
              fullWidth
            />
            <TextField
              label="מחבר"
              value={form.author}
              onChange={handleChange('author')}
              required
              fullWidth
            />
            <TextField
              label="תיאור"
              value={form.description}
              onChange={handleChange('description')}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="שנת פרסום"
              type="number"
              value={form.publishedYear ?? ''}
              onChange={handleChange('publishedYear')}
              fullWidth
            />
            <TextField
              label="קישור תמונה"
              value={form.imageUrl?.startsWith('data:') ? selectedImageName : form.imageUrl ?? ''}
              onChange={handleChange('imageUrl')}
              placeholder="הזן URL תמונה או בחר קובץ מהמחשב"
              fullWidth
            />
            <Button variant="outlined" onClick={openFilePicker} sx={{ width: 'fit-content' }}>
              העלה מהמחשב
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
              renderInput={(params) => <TextField {...params} label="קטגוריה" required fullWidth />}
            />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
              <Button type="button" onClick={() => navigate('/admin/books')}>
                Cancel
              </Button>
            </Stack>
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}
      </Card>
    </Container>
  )
}

export default EditBookPage
