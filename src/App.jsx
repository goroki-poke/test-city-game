import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const CITIES = [
  { name: 'New York', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80' },
  { name: 'Tokyo', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=80' },
  { name: 'Paris', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80' },
  { name: 'Dubai', url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1400&q=80' },
  { name: 'London', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80' },
  { name: 'Sydney', url: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=1400&q=80' },
  { name: 'Hong Kong', url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1400&q=80' },
  { name: 'San Francisco', url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=1400&q=80' },
]

const BTN_COLORS = ['#00d4ff', '#ff00d4', '#00ff88']
const BTN_LABELS = ['Catch me!', 'Too slow!', 'Try again!']

function randPos() {
  return {
    x: Math.random() * (window.innerWidth - 160),
    y: Math.random() * (window.innerHeight - 60),
  }
}

function MovingButton({ color, label, onCatch }) {
  const [pos, setPos] = useState(randPos)
  const [hide, setHide] = useState(false)
  const lastMove = useRef(0)

  const handleMove = useCallback(() => {
    if (Date.now() - lastMove.current < 120) return
    lastMove.current = Date.now()
    setPos(randPos())
  }, [])

  const handleClick = useCallback(() => {
    setHide(true)
    onCatch()
    setTimeout(() => { setHide(false); setPos(randPos()) }, 1500)
  }, [onCatch])

  if (hide) return null

  return (
    <button
      className="moving-btn"
      style={{ left: pos.x, top: pos.y, '--clr': color }}
      onMouseEnter={handleMove}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}

export default function App() {
  const [displayIdx, setDisplayIdx] = useState(0)
  const [nextDisplayIdx, setNextDisplayIdx] = useState(1)
  const [phase, setPhase] = useState('show')
  const [toast, setToast] = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    CITIES.forEach(c => { const i = new Image(); i.src = c.url })
  }, [])

  useEffect(() => {
    let t
    const schedule = () => {
      t = setTimeout(() => {
        setPhase('fading')
        t = setTimeout(() => {
          idxRef.current = (idxRef.current + 1) % CITIES.length
          setDisplayIdx(idxRef.current)
          setNextDisplayIdx((idxRef.current + 1) % CITIES.length)
          setPhase('show')
          schedule()
        }, 1200)
      }, 4500)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  const onCatch = useCallback(() => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }, [])

  const isFading = phase === 'fading'

  return (
    <div className="app">
      <div className="scanlines" />
      <div className="grid-overlay" />

      <div className="city-stack">
        <img
          className={`city-img ${isFading ? 'fade-out' : ''}`}
          src={CITIES[displayIdx].url}
          alt={CITIES[displayIdx].name}
        />
        <img
          className={`city-img ${isFading ? 'fade-in' : 'hidden'}`}
          src={CITIES[nextDisplayIdx].url}
          alt={CITIES[nextDisplayIdx].name}
        />
        <div className="city-overlay" />
        <div className="city-label">
          {isFading ? CITIES[nextDisplayIdx].name : CITIES[displayIdx].name}
        </div>
      </div>

      <div className="title">
        <h1>NEON CITY</h1>
        <p className="subtitle">Try to click the buttons...</p>
      </div>

      {BTN_LABELS.map((l, i) => (
        <MovingButton key={i} color={BTN_COLORS[i]} label={l} onCatch={onCatch} />
      ))}

      <div className={`toast ${toast ? 'show' : ''}`}>Nice try!</div>
    </div>
  )
}
