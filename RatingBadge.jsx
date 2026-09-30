import { FaStar } from 'react-icons/fa'

export default function RatingBadge({ rating, size = 'md' }) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold glass ${sizes[size]}`}
      style={{ color: '#ffb347' }}
    >
      <FaStar />
      <span className="text-secondary" style={{ color: 'inherit' }}>{rating}</span>
    </span>
  )
}
