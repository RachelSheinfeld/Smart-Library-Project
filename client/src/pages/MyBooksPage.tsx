// דף הספרים שלי למשתמש רגיל, מציג את הספרים שהשאלתי ומאפשר החזרה
import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material'
import { getUserBorrows, returnBook } from '../api/borrowApi'
import { useAppSelector } from '../store/hooks'
import type { Borrow } from '../types/borrow'

const MyBooksPage = () => {
  // דף הספרים של המשתמש - מציג ספרים מושאלים והתראת החזרה קרובה
  const user = useAppSelector((state) => state.auth.user)
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [soonBorrows, setSoonBorrows] = useState<Borrow[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // בונה רשימת השאלות שמסתיימות בתוך שבוע
  // כאן אפשר לשנות את הערך כדי להקפיץ הודעה מוקדם יותר או מאוחר יותר
  const findSoonBorrows = (borrowsList: Borrow[]) => {
    const now = new Date().getTime()
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000
    return borrowsList.filter((borrow) => {
      const dueTime = new Date(borrow.dueDate).getTime()
      return dueTime > now && dueTime <= weekFromNow
    })
  }

  // טוען את כל ההשאלות של המשתמש ונבדק אם צריך להציג התראה
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

  // טוען את ההשאלות כאשר המשתמש משתנה
  useEffect(() => {
    void loadBorrows()
  }, [user])

  // מחזיר ספר שנבחר ודרש טעינת הנתונים מחדש
  const handleReturn = async (borrowId: string) => {
    try {
      await returnBook(borrowId)
      await loadBorrows()
    } catch {
      setError('Failed to return the book. Try again.')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>Reminder: Return Due Soon</DialogTitle>
        <DialogContent>
          <Typography>
            You have {soonBorrows.length} book{soonBorrows.length === 1 ? '' : 's'} due soon. Please make sure to return it on time to avoid late fees.
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 2 }}>
            {soonBorrows.map((borrow) => {
              const book = typeof borrow.book === 'string' ? null : borrow.book
              return (
                <li key={borrow._id}>
                  {book ? book.title : 'Book'} - Return date: {new Date(borrow.dueDate).toLocaleDateString('en-US')}
                </li>
              )
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" component="h1" gutterBottom>
        My Books Page
      </Typography>

      {!user && <Alert severity="info">You need to be logged in to see your books.</Alert>}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && user && borrows.length === 0 && <Alert severity="info">You have no borrowed books at the moment.</Alert>}

      {!loading && borrows.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {borrows.map((borrow) => {
            const book = typeof borrow.book === 'string' ? null : borrow.book
            return (
              <Grid item xs={12} md={6} key={borrow._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography variant="h6">{book ? book.title : 'Book'}</Typography>
                    {book && (
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                    )}
                    <Typography sx={{ mt: 1 }}>Return by: {new Date(borrow.dueDate).toLocaleDateString('he-IL')}</Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button fullWidth variant="contained" onClick={() => void handleReturn(borrow._id)}>
                      Return
                    </Button>
                  </Box>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Container>
  )
}

export default MyBooksPage
