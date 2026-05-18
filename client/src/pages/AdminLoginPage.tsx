// דף התחברות של המנהל, משתמש ב־API של auth כדי לקבל טוקן ולשמור אותו ב־Redux
import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { setAuth } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // שולח את פרטי מנהל למערכת ומעדכן את ה־AuthContext במקרה של הצלחה
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await login({ email, password })
      if (!response.token) {
        setError('Missing token from server')
        return
      }

      dispatch(setAuth({ user: response.user, token: response.token }))
      navigate('/admin/books')
    } catch {
      setError('Admin login failed. Check the admin credentials.')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
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
            Login as Admin
          </Button>
        </Box>
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </Paper>
    </Container>
  )
}

export default AdminLoginPage
