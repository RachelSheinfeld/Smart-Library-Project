
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material'
import theme from './theme'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import BookDetailsPage from './pages/BookDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyBooksPage from './pages/MyBooksPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminBooksPage from './pages/AdminBooksPage'
import AdminBorrowsPage from './pages/AdminBorrowsPage'
import AddBookPage from './pages/AddBookPage'
import EditBookPage from './pages/EditBookPage'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Box component="main" sx={{ py: 4, minHeight: 'calc(100vh - 84px)', bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                {/* Categories page removed per admin request */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/my-books" element={<MyBooksPage />} />
                <Route path="/admin/books" element={<AdminBooksPage />} />
                <Route path="/admin/borrows" element={<AdminBorrowsPage />} />
                <Route path="/admin/books/new" element={<AddBookPage />} />
                <Route path="/admin/books/:id/edit" element={<EditBookPage />} />
              </Routes>
            </Container>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
