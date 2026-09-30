import { useState } from 'react'
import { Link } from 'react-router-dom'
import { byKey } from '../../data/titles.js'
import { useUserData } from '../../context/UserDataContext.jsx'
import TitleCard from '../../components/TitleCard/TitleCard.jsx'

const tabs = [['all', 'All'], ['want', 'Want to watch'], ['watching', 'Watching'], ['watched', 'Watched']]

export default function Watchlist() {
  const { watchlist, reviews } = useUserData()
  const [tab, setTab] = useState('all')
  const items = Object.entries(watchlist).filter(([k, e]) => byKey[k] && (tab === 'all' || e.status === tab)).sort((a, b) => b[1].added - a[1].added)
  const myReviews = Object.entries(reviews).filter(([k, l]) => byKey[k] && l.some((r) => r.mine))
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold">My Watchlist</h1>
      <p className="text-secondary mt-1">{Object.keys(watchlist).length} saved · {myReviews.length} reviewed</p>
      <div className="flex gap-2 mt-6 overflow-x-auto">{tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`glass px-4 py-2 rounded-full text-sm whitespace-nowrap ${tab === k ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : ''}`}>{l}</button>)}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">{items.map(([k, e]) => <TitleCard key={k} t={byKey[k]} note={e.status} />)}</div>
      {!items.length && <p className="text-secondary text-center mt-10">Nothing here yet. <Link to="/browse" className="text-primary-500">Browse titles</Link> and tap the bookmark.</p>}
    </div>
  )
}
