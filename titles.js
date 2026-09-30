import { movies } from './movies.js'
import { webseries } from './webseries.js'
import { dramas } from './dramas.js'
import { languages } from './languages.js'

const norm = (t, type, typeLabel, seed) => ({
  ...t,
  type,
  typeLabel,
  key: `${type}-${t.id}`,
  year: Number(String(t.releaseDate || t.year || '').slice(0, 4)) || 2012 + ((t.id * 7) % 13),
  rating: Number(t.rating) || 6 + ((t.id * 13 + seed) % 35) / 10,
  genres: t.genres || [],
  cast: t.cast || [],
  description: t.description || '',
  views: 5000 + ((t.id * 9301 + seed * 49297) % 90000),
})

export const titles = [
  ...movies.map((m) => norm(m, 'movie', 'Movie', 1)),
  ...webseries.map((m) => norm(m, 'webseries', 'Web Series', 2)),
  ...dramas.map((m) => norm(m, 'drama', 'Drama', 3)),
]
export const byKey = Object.fromEntries(titles.map((t) => [t.key, t]))
export const allGenres = [...new Set(titles.flatMap((t) => t.genres))].sort()
export const allLanguages = [...new Set(titles.map((t) => t.language))].sort()
export const languageName = (id) => languages.find((l) => l.id === id)?.name || id
export const typeLabels = { movie: 'Movies', webseries: 'Web Series', drama: 'Dramas' }
