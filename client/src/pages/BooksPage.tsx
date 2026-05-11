import { useEffect, useState } from 'react'
import { getBooks } from '../api/booksApi'
import { getCategories } from '../api/categoriesApi'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'
import type { Category } from '../types/category'

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      setError('')

      try {
        const [categoriesData, booksData] = await Promise.all([
          getCategories(),
          getBooks(selectedCategory || undefined),
        ])
        setCategories(categoriesData)
        setBooks(booksData)
      } catch {
        setError('Failed to load books or categories')
      } finally {
        setLoading(false)
      }
    }

    void loadAll()
  }, [selectedCategory])

  return (
    <>
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Books Page</h1>
        <div className="form-group" style={{ minWidth: 220 }}>
          <label htmlFor="category-filter">סינון לפי קטגוריה</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">כל הקטגוריות</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading && <div className="spinner"></div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && (
        <div className="grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </>
  )
}

export default BooksPage