import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getAllBorrows } from '../api/borrowApi'
import type { Borrow } from '../types/borrow'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
} from '@mui/material'

const AdminBorrowsPage = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBorrows = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAllBorrows()
      setBorrows(data)
    } catch {
      setError('Failed to load borrow history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBorrows()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h4" component="h1">
          כל ההשאלות במערכת
        </Typography>
        <Button component={RouterLink} to="/admin/books" variant="contained">
          חזרה לספרים של המנהל
        </Button>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Paper sx={{ p: 2, bgcolor: 'error.lighter', color: 'error.dark' }}>{error}</Paper>}

      {!loading && !error && borrows.length === 0 && (
        <Typography>אין השאלות להצגה כרגע.</Typography>
      )}

      <Grid container spacing={3}>
        {borrows.map((borrow) => {
          const book = typeof borrow.book === 'string' ? null : borrow.book
          const user = typeof borrow.user === 'string' ? null : borrow.user
          return (
            <Grid item xs={12} md={6} key={borrow._id}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title={book?.title ?? 'ספר לא ידוע'}
                  subheader={user?.name ? `לקוח: ${user.name}` : 'לקוח לא ידוע'}
                />
                <CardContent>
                  <Stack spacing={1}>
                    <Typography>
                      סופר: {book?.author ?? 'לא ידוע'}
                    </Typography>
                    <Typography>
                      תאריך השאלה: {new Date(borrow.borrowDate).toLocaleDateString('he-IL')}
                    </Typography>
                    <Typography>
                      תאריך החזרה: {new Date(borrow.dueDate).toLocaleDateString('he-IL')}
                    </Typography>
                    <Chip
                      label={borrow.returned ? 'הוחזר' : 'פעיל'}
                      color={borrow.returned ? 'default' : 'secondary'}
                      size="small"
                      sx={{ width: 'fit-content' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default AdminBorrowsPage
