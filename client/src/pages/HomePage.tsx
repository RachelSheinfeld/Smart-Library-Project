import { Box, Container, Typography } from '@mui/material'

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          ברוכה הבאה ל-Smart Library
        </Typography>
        <Typography variant="body1">
          מצאי ספרים, העברי השאלות וניהול הספרייה נעשה קל ומהיר.
        </Typography>
      </Box>
    </Container>
  )
}

export default HomePage