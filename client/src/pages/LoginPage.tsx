// דף התחברות רגיל למשתמשים רגילים, קובע את ההתחברות דרך ההקשר
import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { setAuth } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import { Box, Button, Container, Paper, TextField, Typography, Alert, Link } from '@mui/material'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  
  // ניהול הטופס של התחברות, קריאה ל־API ועדכון שגיאה במידת הצורך
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError('')

    try {
      //ההתחברות
      const response = await login({ email, password })
      if (!response.token) {
        setError('Missing token from server')
        return
      }
      //הגדרת המשתמש והטוקן
      dispatch(setAuth({ user: response.user, token: response.token }))
      navigate('/')
    } catch {
      //הודעת שגיאה
      setError('Login failed. Check your details.')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Need an account?{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            Register
          </Link>
        </Typography>
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </Paper>
    </Container>
  )
}

export default LoginPage