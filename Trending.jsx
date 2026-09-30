import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts'
import { titles } from '../../data/titles.js'
import { useUserData } from '../../context/UserDataContext.jsx'
import { combinedRating } from '../../utils/recommend.js'
import TitleCard from '../../components/TitleCard/TitleCard.jsx'

const COLORS = ['#7c5cff', '#ff4fc3', '#ffb347', '#38bdf8', '#34d399', '#f87171', '#a78bfa', '#fb923c']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Trending() {
  const { reviewsFor, watchlist } = useUserData()
  const ranked = useMemo(() => titles.map((t) => ({
    t, score: Math.round(t.views / 1000 + combinedRating(t, reviewsFor(t.key)) * 5 + reviewsFor(t.key).length * 10 + (watchlist[t.key] ? 5 : 0)),
  })).sort((a, b) => b.score - a.score), [reviewsFor, watchlist])
  const top = ranked.slice(0, 10)
  const weekly = days.map((d, i) => Object.fromEntries([['day', d], ...top.slice(0, 3).map((r, j) => [r.t.title, Math.round(r.t.views / 7 * (0.7 + ((i * 3 + j * 5 + r.t.id) % 7) / 10))])]))
  const genreViews = useMemo(() => {
    const m = {}
    titles.forEach((t) => t.genres.forEach((g) => (m[g] = (m[g] || 0) + t.views)))
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [])
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Trending Analytics</h1>
      <p className="text-secondary text-sm mt-1">Trending score blends sample view counts, rating, your reviews and watchlist adds. View data is seeded sample data; reviews/watchlist are yours.</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">{top.slice(0, 5).map((r, i) => <TitleCard key={r.t.key} t={r.t} note={`#${i + 1} · ${r.score}`} />)}</div>
      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        <div className="glass rounded-2xl p-4"><h2 className="font-semibold mb-2">Top 10 by trending score</h2>
          <ResponsiveContainer width="100%" height={320}><BarChart data={top.map((r) => ({ name: r.t.title, score: r.score }))} layout="vertical" margin={{ left: 40 }}>
            <XAxis type="number" stroke="#999" /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} stroke="#999" /><Tooltip /><Bar dataKey="score" fill="#7c5cff" radius={4} /></BarChart></ResponsiveContainer></div>
        <div className="glass rounded-2xl p-4"><h2 className="font-semibold mb-2">Weekly views — top 3</h2>
          <ResponsiveContainer width="100%" height={320}><LineChart data={weekly}><XAxis dataKey="day" stroke="#999" /><YAxis stroke="#999" /><Tooltip /><Legend />
            {top.slice(0, 3).map((r, i) => <Line key={r.t.key} type="monotone" dataKey={r.t.title} stroke={COLORS[i]} strokeWidth={2} />)}</LineChart></ResponsiveContainer></div>
        <div className="glass rounded-2xl p-4 lg:col-span-2"><h2 className="font-semibold mb-2">Genre popularity (share of views)</h2>
          <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={genreViews} dataKey="value" nameKey="name" outerRadius={110} label>{genreViews.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
      </div>
    </div>
  )
}
