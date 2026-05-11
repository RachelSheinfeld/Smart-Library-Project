import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="flex-center mt-6">
      <div className="paper" style={{ width: '100%', maxWidth: 600 }}>
        <h1>הוספת ספר חדש</h1>
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
              <img
                src={form.imageUrl}
                alt="תצוגת תמונה"
                className="preview-image"
              />
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
            Create Book
          </button>
        </form>
        {error && (
          <div className="alert alert-error mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddBookPage
