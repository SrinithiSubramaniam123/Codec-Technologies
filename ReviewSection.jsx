import { useState } from 'react'
import Stars from '../Stars/Stars.jsx'
import { useUserData } from '../../context/UserDataContext.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function ReviewSection({ titleKey }) {
  const { reviewsFor, myReview, saveReview, deleteReview, name, setName } = useUserData()
  const mine = myReview(titleKey)
  const [rating, setRating] = useState(mine?.rating || 0)
  const [text, setText] = useState(mine?.text || '')
  const list = reviewsFor(titleKey)
  const submit = (e) => { e.preventDefault(); if (rating) saveReview(titleKey, { rating, text: text.trim() }) }
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold">Ratings & Reviews ({list.length})</h2>
      <form onSubmit={submit} className="glass rounded-2xl p-4 mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Stars value={rating} onChange={setRating} size="text-2xl" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={30} className="glass rounded-full px-3 py-1.5 text-sm outline-none" />
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={600} placeholder="Write your review (optional)…" className="glass rounded-xl w-full p-3 text-sm outline-none" />
        <div className="flex gap-2">
          <button disabled={!rating} className="px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-primary-500 to-accent-500 disabled:opacity-40">{mine ? 'Update review' : 'Post review'}</button>
          {mine && <button type="button" onClick={() => { deleteReview(titleKey); setRating(0); setText('') }} className="glass px-4 py-2 rounded-full text-sm">Delete</button>}
        </div>
      </form>
      <div className="mt-4 space-y-3">
        {list.length === 0 && <p className="text-secondary text-sm">No reviews yet — be the first.</p>}
        {list.map((r) => (
          <article key={r.id} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between"><strong className="text-sm">{r.author}{r.mine && ' (you)'}</strong><span className="text-xs text-secondary">{formatDate(r.date)}</span></div>
            <Stars value={r.rating} size="text-sm" />
            {r.text && <p className="text-sm mt-2 text-secondary whitespace-pre-line">{r.text}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}
