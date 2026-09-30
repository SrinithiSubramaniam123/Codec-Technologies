MONTH-2


# CineTrack — Movie & TV Show Review Platform (Topic 7)

React 18 + Vite + Tailwind + Recharts + Framer Motion. No backend needed: all user data lives in `localStorage`.

## Features
- **Ratings & reviews** – 1–5 star rating + written review per title (edit/delete your own); the displayed score blends the catalog score with user ratings.
- **Watchlist** – Want to watch / Watching / Watched, one-tap bookmark on every card.
- **Search & filters** – global search overlay, plus Browse page with type, genre, language, min-rating filters and sorting (URL-synced).
- **Recommendation engine** (`src/utils/recommend.js`) – content-based: builds a taste profile from your ratings (−2…+2) and watchlist activity, scores unseen titles by genre/language/type affinity, and shows a reason ("Because you like Thriller"). "More like this" on each title uses genre Jaccard similarity. Cold start falls back to top-rated.
- **Trending analytics** – Recharts dashboard (top-10 score, weekly views, genre share). Note: view counts are seeded sample data; reviews and watchlist adds are real local activity.
- **Social sharing** – native Web Share API, copy link, WhatsApp, X, Facebook.
- Dark/light theme, responsive glassmorphism UI.

## Converted from "Global Entertainment Explorer"
Kept: movies, web series, dramas datasets (merged into `src/data/titles.js`), theme, styling, rating badge.
Removed: songs, artists, music genres, games, profile/analytics pages, TMDB/axios stub.

## Run
```bash
npm install
npm run dev
```
Posters are placeholder images (picsum.photos); swap URLs in `src/data/*.js` for real artwork.
