import { useParams, Link } from 'react-router-dom'
import { byKey, titles, languageName } from '../../data/titles.js'
import { useUserData } from '../../context/UserDataContext.jsx'
import { combinedRating, similar } from '../../utils/recommend.js'
import RatingBadge from '../../components/RatingBadge/RatingBadge.jsx'
import ReviewSection from '../../components/ReviewSection/ReviewSection.jsx'
import ShareButtons from '../../components/ShareButtons/ShareButtons.jsx'
import TitleCard from '../../components/TitleCard/TitleCard.jsx'
import NotFound from '../NotFound/NotFound.jsx'

export default function Details() {
  const { type, id } = useParams()
  const t = byKey[`${type}-${id}`]
  const { watchlist, setWatch, reviewsFor } = useUserData()
  if (!t) return <NotFound />
  const reviews = reviewsFor(t.key)
  const score = combinedRating(t, reviews)
  const status = watchlist[t.key]?.status || ''
  return (
    <div>
      <div className="h-64 md:h-80 bg-cover bg-center relative" style={{ backgroundImage: `url(${t.backdrop || t.poster})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
      </div>
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={t.poster} alt={t.title} className="w-48 rounded-2xl shadow-glass self-start" />
          <div className="glass rounded-2xl p-5 flex-1">
            <h1 className="font-display text-3xl font-bold">{t.title}</h1>
            <p className="text-secondary text-sm mt-1">{t.typeLabel} · {t.year} · {languageName(t.language)}{t.runtime ? ` · ${t.runtime}m` : ''}{t.seasons ? ` · ${t.seasons} seasons` : ''}{t.episodes ? ` · ${t.episodes} eps` : ''}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <RatingBadge rating={score.toFixed(1)} size="lg" />
              <span className="text-xs text-secondary">{reviews.length} user review{reviews.length === 1 ? '' : 's'}</span>
              <select value={status} onChange={(e) => setWatch(t.key, e.target.value)} className="glass rounded-full px-3 py-2 text-sm bg-transparent outline-none">
                <option value="">+ Add to watchlist</option><option value="want">Want to watch</option><option value="watching">Watching</option><option value="watched">Watched</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">{t.genres.map((g) => <Link key={g} to={`/browse?genre=${g}`} className="glass rounded-full px-3 py-1 text-xs">{g}</Link>)}</div>
            <p className="mt-4 text-sm leading-relaxed">{t.description}</p>
            {t.director && <p className="mt-3 text-sm"><b>Director:</b> {t.director}</p>}
            {!!t.cast.length && <p className="mt-1 text-sm"><b>Cast:</b> {t.cast.join(', ')}</p>}
            <div className="mt-4"><ShareButtons title={t.title} text={`Check out ${t.title} (${score.toFixed(1)}/10) on CineTrack`} /></div>
          </div>
        </div>
        <ReviewSection titleKey={t.key} />
        <h2 className="font-display text-2xl font-bold mt-12">More like this</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 pb-12">{similar(t, titles).map((x) => <TitleCard key={x.key} t={x} />)}</div>
      </div>
    </div>
  )
}
