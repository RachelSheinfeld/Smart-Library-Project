
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import BookDetailsPage from './pages/BookDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyBooksPage from './pages/MyBooksPage'
import AdminBooksPage from './pages/AdminBooksPage'
import AddBookPage from './pages/AddBookPage'
import EditBookPage from './pages/EditBookPage'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Box component="main" sx={{ py: 3 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-books" element={<MyBooksPage />} />
              <Route path="/admin/books" element={<AdminBooksPage />} />
              <Route path="/admin/books/new" element={<AddBookPage />} />
              <Route path="/admin/books/:id/edit" element={<EditBookPage />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
