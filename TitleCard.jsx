import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import RatingBadge from '../RatingBadge/RatingBadge.jsx'
import { useUserData } from '../../context/UserDataContext.jsx'
import { combinedRating } from '../../utils/recommend.js'
import { languageName } from '../../data/titles.js'

export default function TitleCard({ t, note }) {
  const { watchlist, setWatch, reviewsFor } = useUserData()
  const inList = !!watchlist[t.key]
  return (
    <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl overflow-hidden shadow-glass relative group">
      <Link to={`/title/${t.type}/${t.id}`}>
        <div className="aspect-[2/3] overflow-hidden"><img src={t.poster} alt={t.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
      </Link>
      <span className="absolute top-3 left-3 glass rounded-full px-2 py-0.5 text-[10px] font-semibold">{t.typeLabel}</span>
      <button onClick={() => setWatch(t.key, inList ? null : 'want')} aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'} className="absolute top-3 right-3 glass rounded-full p-2 text-accent-500 hover:scale-110 transition-transform">
        {inList ? <FaBookmark /> : <FaRegBookmark />}
      </button>
      <div className="p-3">
        <Link to={`/title/${t.type}/${t.id}`}><h3 className="font-display font-semibold text-sm md:text-base truncate">{t.title}</h3></Link>
        <p className="text-secondary text-xs mt-1 truncate">{languageName(t.language)} · {t.year}</p>
        <div className="mt-2 flex items-center justify-between">
          <RatingBadge rating={combinedRating(t, reviewsFor(t.key)).toFixed(1)} size="sm" />
          {note && <span className="text-[10px] text-secondary truncate ml-2">{note}</span>}
        </div>
      </div>
    </motion.div>
  )
}
