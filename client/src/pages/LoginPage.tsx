import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

const LoginPage = () => {
  // שימוש ב-useNavigate כדי לנווט לדף הבית
  const navigate = useNavigate()
  // שימוש ב-useAuth כדי להגדיר את המשתמש והטוקן
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  
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
      setAuth(response.user, response.token)
      navigate('/')
    } catch {
      //הודעת שגיאה
      setError('Login failed. Check your details.')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ width: '100%', maxWidth: 420, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login Page
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Need an account?{' '}
          <Link component={RouterLink} to="/register">
            Register
          </Link>
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

export default LoginPage