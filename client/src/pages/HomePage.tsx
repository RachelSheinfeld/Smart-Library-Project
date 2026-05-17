// דף הבית של האפליקציה, מציג קישורים לפי סוג המשתמש
import { Link as RouterLink } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import type { RootState } from '../store/store'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import Logo from '../components/Logo'

const HomePage = () => {
  const user = useAppSelector((state: RootState) => state.auth.user)

  // דף הבית מציג כפתורים שונים לפי סטטוס המשתמש והרשאותיו
  return (
    <Box sx={{ py: 8, minHeight: 'calc(100vh - 84px)', background: 'linear-gradient(180deg, rgba(26,104,109,0.08) 0%, rgba(255,255,255,1) 100%)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            maxWidth: 780,
            width: '100%',
            mx: 2,
            borderRadius: 4,
            border: '1px solid rgba(26,104,109,0.12)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Logo size={90} />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Smart Library
              </Typography>
              <Typography variant="h6" color="text.secondary">
                הספרייה החכמה שלך לניהול ספרים, קטגוריות וההשאלות עם חוויית משתמש מודרנית.
              </Typography>
              {user ? (
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 700 }}>
                  WELCOME {user.role === 'admin' ? 'ADMIN' : user.name.toUpperCase()}
                </Typography>
              ) : null}
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" width="100%">
              {!user ? (
                <>
                  <Button component={RouterLink} to="/login" variant="contained" color="primary" size="large" fullWidth>
                    Login
                  </Button>
                  <Button component={RouterLink} to="/register" variant="outlined" color="primary" size="large" fullWidth>
                    Register
                  </Button>
                  <Button component={RouterLink} to="/admin/login" variant="outlined" color="secondary" size="large" fullWidth>
                    Admin Login
                  </Button>
                </>
              ) : user.role === 'admin' ? (
                <>
                  <Button component={RouterLink} to="/admin/books" variant="contained" color="primary" size="large" fullWidth>
                    Admin Dashboard
                  </Button>
                  <Button component={RouterLink} to="/admin/borrows" variant="outlined" color="primary" size="large" fullWidth>
                    All Borrows
                  </Button>
                </>
              ) : (
                <>
                  <Button component={RouterLink} to="/books" variant="contained" color="primary" size="large" fullWidth>
                    Browse Books
                  </Button>
                  <Button component={RouterLink} to="/my-books" variant="outlined" color="primary" size="large" fullWidth>
                    My Books
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}

export default HomePage