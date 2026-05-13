import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await login({ email, password })
      if (!response.token) {
        setError('Missing token from server')
        return
      }

      setAuth(response.user, response.token)
      navigate('/admin/books')
    } catch {
      setError('Admin login failed. Check the admin credentials.')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          מנהל מערכת
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="שם משתמש"
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
            התחבר כמנהל
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
