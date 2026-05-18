import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { Book } from '../types/book'

// BookCard מציג כרטיס ספר ב־BooksPage
// ומאפשר ניווט לדף פרטי הספר בלחיצה
interface BookCardProps {
  book: Book
}

const placeholderImage = 'https://via.placeholder.com/600x360/1A686D/ffffff?text=Smart+Library'

const BookCard = ({ book }: BookCardProps) => {
  // אם התמונה לא נטענת, נציג תמונה אלטרנטיבית
  const { _id, title, author, description, publishedYear, imageUrl, category, isAvailable = true } = book
  const [imageSrc, setImageSrc] = useState(imageUrl || placeholderImage)
  const categoryName = typeof category === 'string' ? category : category?.name ?? 'Unknown'
  const shortDescription = description ? `${description.slice(0, 120)}${description.length > 120 ? '...' : ''}` : 'No description available.'

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/books/${_id}`} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia
          component="img"
          image={imageSrc}
          alt={title}
          sx={{ height: 220, objectFit: 'cover' }}
          onError={(event) => {
            if (event.currentTarget.src !== placeholderImage) {
              event.currentTarget.src = placeholderImage
              setImageSrc(placeholderImage)
            }
          }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: isAvailable ? 'success.main' : 'error.main',
                border: '1px solid',
                borderColor: isAvailable ? 'success.dark' : 'error.dark',
              }}
              aria-label={isAvailable ? 'Available' : 'Not available'}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {author}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 64 }}>
            {shortDescription}
          </Typography>
          <Chip label={publishedYear ?? 'Unknown year'} color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
          <Chip label={categoryName} variant="outlined" size="small" />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default BookCard
