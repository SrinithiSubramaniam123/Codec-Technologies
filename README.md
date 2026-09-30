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

# Parley — MERN Social Media Dashboard

Profiles with media uploads, real-time messaging (Socket.IO), likes / comments / follows,
an engagement analytics dashboard and a Redis-backed notification system.

## Features
- **Profiles**: display name, bio, avatar upload, follower / following counts, follow button
- **Posts**: text plus up to 4 photos or videos (drag and drop), optimistic likes, comments, delete, "load older" paging
- **Messaging**: real-time chat over WebSockets with online presence, typing indicator and unread badges
- **Notifications (Redis)**: likes, comments, follows and messages to offline users are pushed to Redis (list + unread counter), broadcast over Redis pub/sub, and delivered live to the browser as a toast and bell badge. If Redis isn't running the server falls back to in-memory storage and logs a warning
- **Analytics**: 14-day likes / comments / new-follower charts (Recharts), week-over-week trends, averages and top posts

## Run it
Requires Node 18+, MongoDB and Redis (`docker compose up -d` starts both).

```bash
# 1. API + sockets
cd server
cp .env.example .env        # set JWT_SECRET
npm install
npm run seed                # optional demo users, posts and follows
npm run dev                 # http://localhost:5000

# 2. Web app (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```
Demo logins after seeding: `ava`, `milo`, `noor`, `dev` or `sana` with password `password123`.
Open two browsers (or a private window) as different users to see real-time chat and notifications.

## Structure
```
server/src  models/ routes/ lib/(store.js = Redis, auth, upload) socket.js index.js seed.js
client/src  pages/ components/ context/(Auth, Live = socket + notifications) styles.css
```
Uploads are stored in `server/uploads` (swap `lib/upload.js` for S3 or Cloudinary in production).

