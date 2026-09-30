import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { titles, byKey } from '../../data/titles.js'
import { useUserData } from '../../context/UserDataContext.jsx'
import { buildProfile, recommend, combinedRating } from '../../utils/recommend.js'
import TitleCard from '../../components/TitleCard/TitleCard.jsx'

const Row = ({ title, to, children }) => (
  <section className="mt-12">
    <div className="flex items-end justify-between"><h2 className="font-display text-2xl font-bold">{title}</h2>{to && <Link to={to} className="text-primary-500 text-sm">See all →</Link>}</div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">{children}</div>
  </section>
)

export default function Home() {
  const { reviews, watchlist, reviewsFor } = useUserData()
  const top = [...titles].sort((a, b) => combinedRating(b, reviewsFor(b.key)) - combinedRating(a, reviewsFor(a.key))).slice(0, 6)
  const profile = buildProfile(byKey, reviews, watchlist)
  const recs = recommend(titles, profile, 6)
  const recent = Object.entries(reviews).flatMap(([k, l]) => l.filter((r) => r.mine).map((r) => ({ t: byKey[k], date: r.date }))).filter((x) => x.t).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 md:p-14 text-center shadow-glass">
        <h1 className="font-display text-4xl md:text-6xl font-bold gradient-text">Rate. Review. Discover.</h1>
        <p className="text-secondary mt-4 max-w-xl mx-auto">CineTrack is a movie & TV review platform: rate what you watch, keep a watchlist, and get recommendations that learn your taste.</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/browse" className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-primary-500 to-accent-500">Browse titles</Link>
          <Link to="/trending" className="glass px-6 py-3 rounded-full font-semibold">See what's trending</Link>
        </div>
      </motion.div>
      {recent.length > 0 && <Row title="Your recent reviews" to="/watchlist">{recent.map((x) => <TitleCard key={x.t.key} t={x.t} />)}</Row>}
      <Row title={profile.hasSignal ? 'Recommended for you' : 'Top picks'} to="/for-you">{recs.map((r) => <TitleCard key={r.t.key} t={r.t} note={r.reason} />)}</Row>
      <Row title="Highest rated" to="/browse?sort=rating">{top.map((t) => <TitleCard key={t.key} t={t} />)}</Row>
    </div>
  )
}
