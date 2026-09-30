import { useState } from 'react'
import { FaShareAlt, FaLink, FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'

export default function ShareButtons({ title, text }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href
  const msg = encodeURIComponent(`${text || title} ${url}`)
  const btn = 'glass rounded-full px-3 py-2 text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform'
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
  }
  return (
    <div className="flex flex-wrap gap-2">
      {navigator.share && <button className={btn} onClick={() => navigator.share({ title, text, url }).catch(() => {})}><FaShareAlt /> Share</button>}
      <button className={btn} onClick={copy}><FaLink /> {copied ? 'Copied!' : 'Copy link'}</button>
      <a className={btn} target="_blank" rel="noreferrer" href={`https://wa.me/?text=${msg}`}><FaWhatsapp /> WhatsApp</a>
      <a className={btn} target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${msg}`}><FaTwitter /> X</a>
      <a className={btn} target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}><FaFacebook /> Facebook</a>
    </div>
  )
}
