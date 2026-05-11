import { useEffect, useState } from 'react'
import { getUserBorrows, returnBook } from '../api/borrowApi'
import { useAuth } from '../context/AuthContext'
import type { Borrow } from '../types/borrow'

const MyBooksPage = () => {
  const { user } = useAuth()
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [soonBorrows, setSoonBorrows] = useState<Borrow[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const findSoonBorrows = (borrowsList: Borrow[]) => {
    const now = new Date().getTime()
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000
    return borrowsList.filter((borrow) => {
      const dueTime = new Date(borrow.dueDate).getTime()
      return dueTime > now && dueTime <= weekFromNow
    })
  }

  const loadBorrows = async () => {
    if (!user) {
      setBorrows([])
      setSoonBorrows([])
      setShowPopup(false)
      setLoading(false)
      return
    }

    try {
      const data = await getUserBorrows(user.id)
      setBorrows(data)
      const soon = findSoonBorrows(data)
      setSoonBorrows(soon)
      setShowPopup(soon.length > 0)
    } catch {
      setError('Failed to load your books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBorrows()
  }, [user])

  const handleReturn = async (borrowId: string) => {
    try {
      await returnBook(borrowId)
      await loadBorrows()
    } catch {
      setError('Failed to return the book. Try again.')
    }
  }

  return (
    <div>
      {showPopup && soonBorrows.length > 0 && (
        <div className="alert-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="alert-popup" onClick={(event) => event.stopPropagation()}>
            <h2>התראה: החזרה מתקרבת</h2>
            <p>יש {soonBorrows.length} ספר{soonBorrows.length === 1 ? '' : 'ים'} שיש להחזיר בתוך שבוע.</p>
            <ul>
              {soonBorrows.map((borrow) => {
                const book = typeof borrow.book === 'string' ? null : borrow.book
                return (
                  <li key={borrow._id}>
                    {book ? book.title : 'ספר'} - תאריך החזרה: {new Date(borrow.dueDate).toLocaleDateString('he-IL')}
                  </li>
                )
              })}
            </ul>
            <button className="button" onClick={() => setShowPopup(false)}>
              סגור
            </button>
          </div>
        </div>
      )}
      <h1>My Books Page</h1>

      {!user && <div className="alert alert-info">צריך להתחבר כדי לראות את הספרים שלך.</div>}
      {loading && <div className="spinner"></div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && user && borrows.length === 0 && <div className="alert alert-info">אין השאלות כרגע.</div>}

      {!loading && borrows.length > 0 && (
        <div className="paper">
          <div className="list">
            {borrows.map((borrow) => {
              const book = typeof borrow.book === 'string' ? null : borrow.book
              return (
                <div key={borrow._id} className="list-item">
                  <div>
                    <p className="card-title" style={{ margin: 0 }}>
                      {book ? book.title : 'Book'}
                    </p>
                    {book && <p className="card-subtitle" style={{ margin: 0 }}>{book.author}</p>}
                    <p className="card-text" style={{ margin: '0.75rem 0 0 0' }}>
                      Return by: {new Date(borrow.dueDate).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  <button className="button" onClick={() => void handleReturn(borrow._id)}>
                    Return
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBooksPage
