import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import type { Book } from '../types/book'

interface BookCardProps {
  book: Book
}

const placeholderImage = 'https://via.placeholder.com/400x220/222/aaa?text=No+Cover'

const BookCard = ({ book }: BookCardProps) => {
  const { _id, title, author, description, publishedYear, imageUrl, category } = book
  const [imageSrc, setImageSrc] = useState(imageUrl || placeholderImage)
  const categoryName = typeof category === 'string' ? category : category?.name ?? 'Unknown'
  const shortDescription = description ? `${description.slice(0, 120)}${description.length > 120 ? '...' : ''}` : 'No description available.'

  return (
    <article className="card">
      <RouterLink to={`/books/${_id}`} style={{ textDecoration: 'none' }}>
        <img
          src={imageSrc}
          alt={title}
          className="card-image"
          onError={(event) => {
            if (event.currentTarget.src !== placeholderImage) {
              event.currentTarget.src = placeholderImage
              setImageSrc(placeholderImage)
            }
          }}
        />
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{author}</p>
          <p className="card-text">{shortDescription}</p>
          <div className="flex gap-2">
            <span className="chip">{publishedYear ?? 'Unknown year'}</span>
            <span className="chip">{categoryName}</span>
          </div>
        </div>
      </RouterLink>
    </article>
  )
}

export default BookCard
