import { FaStar } from 'react-icons/fa'
export default function Stars({ value = 0, onChange, size = 'text-xl' }) {
  return (
    <span className={`inline-flex gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} stars`}
          className={n <= value ? 'text-yellow-400' : 'text-gray-400/50'}>
          <FaStar />
        </button>
      ))}
    </span>
  )
}
