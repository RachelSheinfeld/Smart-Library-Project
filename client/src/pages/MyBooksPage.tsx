import { useEffect, useState } from 'react'
import { getUserBorrows, returnBook } from '../api/borrowApi'
import { useAuth } from '../context/AuthContext'
import type { Borrow } from '../types/borrow'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

const MyBooksPage = () => {
  const { user } = useAuth()
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBorrows = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const data = await getUserBorrows(user.id)
      setBorrows(data)
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
    await returnBook(borrowId)
    await loadBorrows()
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Books Page
      </Typography>

      {!user && <Alert severity="info">צריך להתחבר כדי לראות את הספרים שלך.</Alert>}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && user && borrows.length === 0 && <Alert severity="info">אין השאלות כרגע.</Alert>}

      {!loading && borrows.length > 0 && (
        <Paper>
          <List>
            {borrows.map((borrow) => {
              const book = typeof borrow.book === 'string' ? null : borrow.book
              return (
                <ListItem key={borrow._id} divider>
                  <ListItemText
                    primary={book ? book.title : 'Book'}
                    secondary={book ? book.author : undefined}
                  />
                  <ListItemSecondaryAction>
                    <Button variant="contained" onClick={() => void handleReturn(borrow._id)}>
                      Return
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
        </Paper>
      )}
    </Box>
  )
}

export default MyBooksPage
