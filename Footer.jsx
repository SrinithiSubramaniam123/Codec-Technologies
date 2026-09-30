import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="mt-16 px-4 pb-8">
      <div className="glass max-w-7xl mx-auto rounded-2xl p-6 flex flex-wrap gap-4 justify-between text-sm text-secondary">
        <span>© {new Date().getFullYear()} CineTrack — Movie & TV Show Review Platform</span>
        <div className="flex gap-4"><Link to="/browse">Browse</Link><Link to="/trending">Trending</Link><Link to="/for-you">For You</Link><Link to="/watchlist">Watchlist</Link></div>
      </div>
    </footer>
  )
}
