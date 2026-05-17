import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'
import Logo from './Logo'

const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <AppBar position="sticky" color="primary" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'common.white' }}>
          <Logo mini size={36} />
          <Typography variant="h6" component="span" sx={{ ml: 1, fontWeight: 700, letterSpacing: '0.08em' }}>
            Smart Library
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button component={RouterLink} to="/books" variant="contained" color="secondary">
            Books
          </Button>
          {user?.role === 'admin' ? (
            <>
              <Button component={RouterLink} to="/admin/books" variant="outlined" color="inherit">
                Admin Books
              </Button>
              <Button component={RouterLink} to="/admin/borrows" variant="outlined" color="inherit">
                All Borrows
              </Button>
              <Button onClick={handleLogout} variant="outlined" color="inherit">
                Logout
              </Button>
            </>
          ) : user ? (
            <>
              <Button component={RouterLink} to="/my-books" variant="outlined" color="inherit">
                My Books
              </Button>
              <Button onClick={handleLogout} variant="outlined" color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" variant="outlined" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/register" variant="outlined" color="inherit">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
