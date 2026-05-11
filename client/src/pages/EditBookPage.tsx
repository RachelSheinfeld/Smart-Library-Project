import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

  const handleChange = (field: keyof BookPayload) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === 'publishedYear' ? (value ? Number(value) : undefined) : value,
    }))
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="flex-center mt-6">
      <div className="paper" style={{ width: '100%', maxWidth: 600 }}>
        <h1>עדכון ספר</h1>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="title">כותרת</label>
              <input
                id="title"
                value={form.title}
                onChange={handleChange('title')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">מחבר</label>
              <input
                id="author"
                value={form.author}
                onChange={handleChange('author')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">תיאור</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="publishedYear">שנת פרסום</label>
              <input
                id="publishedYear"
                type="number"
                value={form.publishedYear ?? ''}
                onChange={handleChange('publishedYear')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">קישור תמונה</label>
              <div className="flex gap-2">
                <input
                  id="imageUrl"
                  value={form.imageUrl?.startsWith('data:') ? selectedImageName : form.imageUrl ?? ''}
                  onChange={handleChange('imageUrl')}
                  placeholder="הזן URL תמונה או בחר קובץ מהמחשב"
                  style={{ flex: 1 }}
                />
                <button type="button" className="button outlined" onClick={openFilePicker}>
                  העלה מהמחשב
                </button>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="תצוגת תמונה" className="preview-image" />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="category">קטגוריה</label>
              <input
                id="category"
                list="category-list"
                value={form.category}
                placeholder="בחר קטגוריה או הזן קטגוריה חדשה"
                onChange={handleChange('category')}
                required
              />
              <datalist id="category-list">
                {categories.map((category) => (
                  <option key={category._id} value={category.name} />
                ))}
              </datalist>
            </div>
            <button type="submit">
              Save Changes
            </button>
          </form>
        )}
        {error && (
          <div className="alert alert-error mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default EditBookPage
