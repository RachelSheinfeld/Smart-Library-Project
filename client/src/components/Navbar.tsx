import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <RouterLink to="/" className="navbar-title nav-button nav-brand">
        Smart Library
      </RouterLink>

      <nav className="navbar-menu">
        <RouterLink to="/books" className="nav-button">
          ספרים
        </RouterLink>
        {user ? (
          <>
            <RouterLink to="/my-books" className="nav-button">
              הספרים שלי
            </RouterLink>
            <button onClick={handleLogout} className="nav-button navbar-button">
              התנתק
            </button>
          </>
        ) : null}
      </nav>
    </header>
  )
}

export default Navbar
