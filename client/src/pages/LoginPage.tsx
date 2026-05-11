import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

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
    <div className="flex-center mt-6">
      <div className="paper" style={{ width: '100%', maxWidth: 420 }}>
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit">
            Login
          </button>
        </form>
        <p className="mt-2">
          Need an account?{' '}
          <RouterLink to="/register">
            Register
          </RouterLink>
        </p>
        {error && (
          <div className="alert alert-error mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage