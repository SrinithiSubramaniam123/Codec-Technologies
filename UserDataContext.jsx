import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)
export const useUserData = () => useContext(Ctx)
const KEY = 'ctr-user-data'
const empty = { name: 'You', reviews: {}, watchlist: {} }

export default function UserDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return empty }
  })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {} }, [data])

  const reviewsFor = (key) => data.reviews[key] || []
  const myReview = (key) => reviewsFor(key).find((r) => r.mine)

  const saveReview = (key, { rating, text }) =>
    setData((d) => {
      const others = (d.reviews[key] || []).filter((r) => !r.mine)
      const review = { id: Date.now(), mine: true, author: d.name || 'You', rating, text, date: new Date().toISOString() }
      return { ...d, reviews: { ...d.reviews, [key]: [review, ...others] } }
    })
  const deleteReview = (key) =>
    setData((d) => ({ ...d, reviews: { ...d.reviews, [key]: (d.reviews[key] || []).filter((r) => !r.mine) } }))

  const setWatch = (key, status) =>
    setData((d) => {
      const wl = { ...d.watchlist }
      if (!status) delete wl[key]
      else wl[key] = { status, added: wl[key]?.added || Date.now() }
      return { ...d, watchlist: wl }
    })
  const setName = (name) => setData((d) => ({ ...d, name }))

  return (
    <Ctx.Provider value={{ ...data, reviewsFor, myReview, saveReview, deleteReview, setWatch, setName }}>
      {children}
    </Ctx.Provider>
  )
}
