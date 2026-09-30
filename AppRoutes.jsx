import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home.jsx'
import Browse from '../pages/Browse/Browse.jsx'
import Details from '../pages/Details/Details.jsx'
import Watchlist from '../pages/Watchlist/Watchlist.jsx'
import Trending from '../pages/Trending/Trending.jsx'
import ForYou from '../pages/ForYou/ForYou.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/title/:type/:id" element={<Details />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/for-you" element={<ForYou />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
