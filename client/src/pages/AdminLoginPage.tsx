import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

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
    <div className="flex-center mt-6">
      <div className="paper" style={{ width: '100%', maxWidth: 420 }}>
        <h1>כניסה כמנהל</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email">שם משתמש</label>
            <input
              id="email"
              type="text"
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
          <button type="submit">התחבר כמנהל</button>
        </form>
        {error && (
          <div className="alert alert-error mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLoginPage
