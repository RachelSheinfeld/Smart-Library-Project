import { useEffect, useState } from 'react'
import { getAllBorrows, returnBook } from '../api/borrowApi'
import type { Borrow } from '../types/borrow'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

const AdminBorrowsPage = () => {
  // כאן נשמור את רשימת ההשאלות שהבאת מה־API
  const [borrows, setBorrows] = useState<Borrow[]>([])

  // סימן שמראה אם עדיין טוענים נתונים מהשרת
  const [loading, setLoading] = useState(true)

  // אם יש שגיאת רשת או בעיה אחרת, נציג אותה למנהל
  const [error, setError] = useState('')

  // זיהוי של ההשאלה שהחזרנו כרגע, כדי לנטר את הכפתור
  const [returningBorrowId, setReturningBorrowId] = useState<string | null>(null)

  // פונקציה שמביאה את כל ההשאלות מהסטטוס של המערכת
  const loadBorrows = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAllBorrows()
      setBorrows(data)
    } catch {
      // אם הבקשה נכשלה, נעדכן את המשתמש בשורת שגיאה
      setError('שגיאה בטעינת ההשאלות')
    } finally {
      setLoading(false)
    }
  }

  // useEffect מריץ את loadBorrows פעם אחת כשמרכיב נטען
  // [] זה תלות ריקה: הפונקציה קורית רק אחרי הרינדור הראשוני ולא בכל שינוי
  // void משמש כדי להדחיק את ההבטחה המוחזרת ולעזור ל־TypeScript שלא יתלונן
  useEffect(() => {
    void loadBorrows()
  }, [])

  // כאן נבחר רק את ההשאלות הפעילות, בלי ההשאלות שהוחזרו ובלי שאלות חסרות לקוח
  const visibleBorrows = borrows.filter((borrow) => borrow.user && !borrow.returned)

  // לחיצה על כפתור החזר סורקת את ההשאלה ויוצרת קריאה ל־API
  const handleReturn = async (borrowId: string) => {
    setReturningBorrowId(borrowId)
    try {
      await returnBook(borrowId)

      // אחרי החזרה מוציאים את ההשאלה מהרשימה המקומית
      setBorrows((current) => current.filter((borrow) => borrow._id !== borrowId))
    } catch {
      setError('לא הצלחנו לרשום את ההחזרה, נסה שוב')
    } finally {
      setReturningBorrowId(null)
    }
  }

  return (
    // Container נותן ריווח סביב כל העמוד
    // maxWidth=lg קובע רוחב מקסימלי טוב למסכים רחבים
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* כותרת עליונה עם הסבר */}
      {/* Paper נותן רקע לבן עם צל קטן כדי להבליט את הכותרת */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Stack מסדר את התוכן בשורה או בעמודה לפי רוחב המסך */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h4" component="h1">
             The Borrows Page
            </Typography>
            <Typography color="text.secondary">The list of all active borrows.</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* אם עדיין טוענים, מציגים ספינר loading */}
      {loading && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          {/* CircularProgress הוא הספינר של MUI שמראה טעינה */}
          <CircularProgress />
          <Typography sx={{ mt: 2 }}> Loading borrows...</Typography>
        </Paper>
      )}

      {/* אם יש שגיאה, מציגים הודעת Alert */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* אם אין שאלות פעילות, מציגים הודעת מידע */}
      {!loading && !error && visibleBorrows.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
        No active borrows found. All books have been returned or no borrows exist.
        </Alert>
      )}

      {/* רשימת הכרטיסים של ההשאלות הפעילות */}
      {/* Grid container יוצרת רשת, ו־Grid item מגדיר כל כרטיס בקורטון */}
      <Grid container spacing={3}>
        {visibleBorrows.map((borrow) => {
          // אם borrow.book הוא מחרוזת, זה מזהה בלבד.
          // אם הוא אובייקט, נתן להציג את הכותרת.
          const bookTitle = typeof borrow.book === 'string'
            ? borrow.book
            : borrow.book?.title || 'שם הספר לא זמין'

          const userEmail = typeof borrow.user === 'string' ? borrow.user : borrow.user?.email || 'לקוח לא ידוע'

          return (
            <Grid item xs={12} md={6} key={borrow._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* CardHeader מציג את שם הספר והמייל של הלקוח */}
                {/* sx זו הדרך של MUI להוסיף עיצוב ישירות לרכיב */}
                <CardHeader
                  title={bookTitle}
                  subheader={userEmail ? `לקוח: ${userEmail}` : 'לקוח לא ידוע'}
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip label="תאריך השאלה" color="info" size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(borrow.borrowDate).toLocaleDateString('he-IL')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip label="תאריך החזרה" color="secondary" size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(borrow.dueDate).toLocaleDateString('he-IL')}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <Divider />
                {/* CardActions הוא החלק שמתאים לכפתורים בתוך כרטיס */}
                <CardActions sx={{ p: 2 }}>
                  {/* כפתור להגשת החזרת הספר */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => void handleReturn(borrow._id)}
                    disabled={returningBorrowId === borrow._id}
                  >
                    {returningBorrowId === borrow._id ? 'מעבד החזרה...' : 'החזר ספר'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default AdminBorrowsPage
