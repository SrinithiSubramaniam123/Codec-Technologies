import { Link } from 'react-router-dom'
import { titles, byKey } from '../../data/titles.js'
import { useUserData } from '../../context/UserDataContext.jsx'
import { buildProfile, recommend } from '../../utils/recommend.js'
import TitleCard from '../../components/TitleCard/TitleCard.jsx'

export default function ForYou() {
  const { reviews, watchlist } = useUserData()
  const profile = buildProfile(byKey, reviews, watchlist)
  const recs = recommend(titles, profile, 15)
  const topGenres = Object.entries(profile.w.g).sort((a, b) => b[1] - a[1]).filter((e) => e[1] > 0).slice(0, 4)
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Recommended For You</h1>
      <p className="text-secondary mt-1 text-sm">
        {profile.hasSignal
          ? <>Based on your ratings and watchlist{topGenres.length > 0 && <> — you lean toward {topGenres.map((g) => g[0]).join(', ')}</>}.</>
          : <>Rate titles and build a watchlist to personalise this. Showing top rated picks for now. <Link to="/browse" className="text-primary-500">Browse</Link></>}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">{recs.map((r) => <TitleCard key={r.t.key} t={r.t} note={r.reason} />)}</div>
    </div>
  )
}
