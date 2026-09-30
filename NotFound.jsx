import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-10 shadow-glass">
        <h1 className="font-display text-5xl font-bold gradient-text">404</h1>
        <p className="text-secondary mt-3">This page wandered off the set. Let's get you back to exploring.</p>
        <Link to="/" className="inline-block mt-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full font-semibold">
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
