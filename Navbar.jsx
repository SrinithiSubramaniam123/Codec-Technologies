import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaSun, FaMoon, FaBars, FaTimes, FaFilm } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/browse?type=movie', label: 'Movies' },
  { to: '/browse?type=webseries', label: 'Web Series' },
  { to: '/browse?type=drama', label: 'Dramas' },
  { to: '/trending', label: 'Trending' },
  { to: '/for-you', label: 'For You' },
  { to: '/watchlist', label: 'Watchlist' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="glass max-w-7xl mx-auto rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between shadow-glass">
          <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <FaFilm className="text-primary-500" />
            <span className="gradient-text">CineTrack</span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to==='/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition-colors hover:bg-white/10 ${isActive ? 'text-primary-500 font-semibold' : 'text-secondary'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="glass rounded-full p-2.5 hover:scale-105 transition-transform"
            >
              <FaSearch />
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="glass rounded-full p-2.5 hover:scale-105 transition-transform"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="glass rounded-full p-2.5 lg:hidden"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass max-w-7xl mx-auto rounded-2xl mt-2 p-4 lg:hidden overflow-hidden shadow-glass"
            >
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-xl text-sm font-medium ${isActive ? 'text-primary-500 font-semibold' : 'text-secondary'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
