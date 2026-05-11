import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <main className="home-page">
      <div className="home-card">
        <h1>ברוכה הבאה ל-Smart Library</h1>
        <p>מצאי ספרים, העברי השאלות וניהול הספרייה נעשה קל ומהיר.</p>

        {!user ? (
          <div className="home-actions">
            <RouterLink to="/login" className="button">
              התחברות
            </RouterLink>
            <RouterLink to="/register" className="button outlined">
              לקוח חדש
            </RouterLink>
            <RouterLink to="/admin/login" className="button outlined">
              כניסה כמנהל
            </RouterLink>
          </div>
        ) : (
          <div className="home-actions">
            <RouterLink to="/books" className="button">
              ספרים
            </RouterLink>
            <RouterLink to="/my-books" className="button outlined">
              הספרים שלי
            </RouterLink>
          </div>
        )}
      </div>
    </main>
  )
}

export default HomePage