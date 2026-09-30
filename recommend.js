export const combinedRating = (t, reviews = []) => {
  const sum = reviews.reduce((a, r) => a + r.rating * 2, 0)
  return (t.rating * 10 + sum) / (10 + reviews.length)
}

// Content-based "more like this": genre overlap (Jaccard) + language + type + quality
export function similar(t, all, n = 6) {
  return all
    .filter((x) => x.key !== t.key)
    .map((x) => {
      const inter = x.genres.filter((g) => t.genres.includes(g)).length
      const union = new Set([...x.genres, ...t.genres]).size || 1
      return { x, s: (inter / union) * 3 + (x.language === t.language ? 1 : 0) + (x.type === t.type ? 0.5 : 0) + x.rating / 20 }
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((o) => o.x)
}

// Personal taste profile from your ratings (1-5 stars => -2..+2) and watchlist activity
export function buildProfile(byKey, reviews, watchlist) {
  const w = { g: {}, l: {}, t: {} }
  const add = (t, v) => {
    t.genres.forEach((g) => (w.g[g] = (w.g[g] || 0) + v))
    w.l[t.language] = (w.l[t.language] || 0) + v
    w.t[t.type] = (w.t[t.type] || 0) + v
  }
  const seen = new Set()
  Object.entries(reviews).forEach(([key, list]) => {
    const mine = list.find((r) => r.mine)
    if (mine && byKey[key]) { add(byKey[key], mine.rating - 3); seen.add(key) }
  })
  Object.entries(watchlist).forEach(([key, e]) => {
    if (!byKey[key]) return
    add(byKey[key], e.status === 'want' ? 0.5 : 1)
    if (e.status === 'watched') seen.add(key)
  })
  return { w, seen, hasSignal: Object.keys(w.g).length > 0 }
}

export function recommend(all, profile, n = 12) {
  const { w, seen, hasSignal } = profile
  return all
    .filter((t) => !seen.has(t.key))
    .map((t) => {
      const gs = t.genres.map((g) => [g, w.g[g] || 0]).sort((a, b) => b[1] - a[1])[0]
      const score = hasSignal
        ? t.genres.reduce((a, g) => a + (w.g[g] || 0), 0) + (w.l[t.language] || 0) * 0.7 + (w.t[t.type] || 0) * 0.3 + t.rating / 5
        : t.rating
      return { t, score, reason: hasSignal && gs && gs[1] > 0 ? `Because you like ${gs[0]}` : 'Top rated pick' }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}
