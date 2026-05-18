import { Box, Button, Stack } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/authSlice'

const AdminNav = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
        <Button component={RouterLink} to="/admin/books" variant="contained">
          All Books
        </Button>
        <Button component={RouterLink} to="/admin/borrows" variant="outlined">
          All Borrows
        </Button>
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button>
      </Stack>
    </Box>
  )
}

export default AdminNav
