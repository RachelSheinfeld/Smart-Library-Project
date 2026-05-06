import { Card, CardActionArea, CardMedia, CardContent, Typography, Chip, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { Book } from '../types/book'

interface BookCardProps {
  book: Book
}

const BookCard = ({ book }: BookCardProps) => {
  const { _id, title, author, description, publishedYear, imageUrl, category } = book
  const categoryName = typeof category === 'string' ? category : category.name ?? 'Unknown'
  const shortDescription = description ? `${description.slice(0, 120)}${description.length > 120 ? '...' : ''}` : 'No description available.'

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/books/${_id}`}>
        {imageUrl && <CardMedia component="img" height="180" image={imageUrl} alt={title} />}
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {author}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 48 }}>
            {shortDescription}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
            <Chip label={publishedYear ?? 'Unknown year'} size="small" />
            <Chip label={categoryName} size="small" />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default BookCard
