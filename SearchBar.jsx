import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { titles } from '../../data/titles.js'

export default function SearchBar({ onClose }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return titles.filter((t) => [t.title, ...t.cast, ...t.genres].join(' ').toLowerCase().includes(s)).slice(0, 8)
  }, [q])
  const go = (path) => { nav(path); onClose() }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 pt-24" onClick={onClose}>
      <div className="glass max-w-xl mx-auto rounded-2xl p-4" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) go(`/browse?q=${encodeURIComponent(q.trim())}`); if (e.key === 'Escape') onClose() }}
          placeholder="Search titles, cast or genres — Enter for all results" className="w-full bg-transparent outline-none px-2 py-2" />
        <ul className="mt-2 divide-y divide-white/10">
          {results.map((t) => (
            <li key={t.key}>
              <button onClick={() => go(`/title/${t.type}/${t.id}`)} className="w-full flex items-center gap-3 py-2 text-left hover:bg-white/10 rounded-lg px-2">
                <img src={t.poster} alt="" className="w-8 h-12 object-cover rounded" />
                <span className="text-sm font-medium">{t.title}</span>
                <span className="text-xs text-secondary ml-auto">{t.typeLabel} · {t.year}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
