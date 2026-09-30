import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TitleCard from '../../components/TitleCard/TitleCard.jsx'
import { titles, allGenres, allLanguages, languageName, typeLabels } from '../../data/titles.js'
import { useUserData } from '../../context/UserDataContext.jsx'
import { combinedRating } from '../../utils/recommend.js'

const sel = 'glass rounded-full px-3 py-2 text-sm outline-none bg-transparent'

export default function Browse() {
  const [sp, setSp] = useSearchParams()
  const { reviewsFor } = useUserData()
  const f = { q: sp.get('q') || '', type: sp.get('type') || '', genre: sp.get('genre') || '', lang: sp.get('lang') || '', min: sp.get('min') || '0', sort: sp.get('sort') || 'rating' }
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }

  const list = useMemo(() => {
    const q = f.q.toLowerCase()
    const r = (t) => combinedRating(t, reviewsFor(t.key))
    return titles
      .filter((t) => (!f.type || t.type === f.type) && (!f.genre || t.genres.includes(f.genre)) && (!f.lang || t.language === f.lang)
        && r(t) >= Number(f.min) && (!q || [t.title, ...t.cast, ...t.genres, t.director || ''].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => f.sort === 'newest' ? b.year - a.year : f.sort === 'reviews' ? reviewsFor(b.key).length - reviewsFor(a.key).length : f.sort === 'title' ? a.title.localeCompare(b.title) : r(b) - r(a))
  }, [f.q, f.type, f.genre, f.lang, f.min, f.sort, reviewsFor])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{f.type ? typeLabels[f.type] : 'Browse all'}</h1>
      <p className="text-secondary mt-1">{list.length} titles</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Search title, cast, genre…" className="glass rounded-full px-4 py-2 text-sm outline-none w-full md:w-64" />
        <select className={sel} value={f.type} onChange={(e) => set('type', e.target.value)}><option value="">All types</option>{Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select className={sel} value={f.genre} onChange={(e) => set('genre', e.target.value)}><option value="">All genres</option>{allGenres.map((g) => <option key={g}>{g}</option>)}</select>
        <select className={sel} value={f.lang} onChange={(e) => set('lang', e.target.value)}><option value="">All languages</option>{allLanguages.map((l) => <option key={l} value={l}>{languageName(l)}</option>)}</select>
        <select className={sel} value={f.min} onChange={(e) => set('min', e.target.value)}>{[0, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n ? `${n}+ rating` : 'Any rating'}</option>)}</select>
        <select className={sel} value={f.sort} onChange={(e) => set('sort', e.target.value)}><option value="rating">Top rated</option><option value="newest">Newest</option><option value="reviews">Most reviewed</option><option value="title">A–Z</option></select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">{list.map((t) => <TitleCard key={t.key} t={t} />)}</div>
      {!list.length && <p className="text-secondary text-center mt-10">No titles match your filters.</p>}
    </div>
  )
}
