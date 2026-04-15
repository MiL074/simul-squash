import { useCallback, useRef, useState } from 'react'

// Slider à 4 zones (C12, C24, C48, Plein Tarif) avec 3 thumbs-frontières.
// parts = [p0, p1, p2, p3], somme toujours ≤ 1 (la 4ème zone absorbe le reste).
// Chaque zone peut être verrouillée : ses 2 frontières deviennent fixes.
const COLORS = [
  { bg: 'bg-cyan-500/40', solid: 'bg-cyan-400' },        // C12
  { bg: 'bg-teal-500/40', solid: 'bg-teal-400' },        // C24
  { bg: 'bg-emerald-500/40', solid: 'bg-emerald-400' },  // C48
  { bg: 'bg-orange-500/40', solid: 'bg-orange-400' },    // PT
]

export default function MixSlider({ parts, labels, locked, onParts, onLocked }) {
  const trackRef = useRef(null)
  const [drag, setDrag] = useState(null) // index de la frontière 0..2

  const b0 = parts[0]
  const b1 = parts[0] + parts[1]
  const b2 = parts[0] + parts[1] + parts[2]
  const boundaries = [b0, b1, b2]
  const values = parts // 4 zones directement

  const xToPct = useCallback((clientX) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return 0
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width))
  }, [])

  const onDown = (i) => (e) => {
    const leftZone = i
    const rightZone = i + 1
    if (locked[leftZone] || locked[rightZone]) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(i)
  }

  const onMove = (e) => {
    if (drag === null) return
    const leftZone = drag
    const rightZone = drag + 1
    if (locked[leftZone] || locked[rightZone]) return

    const pos = xToPct(e.clientX)
    const minB = drag > 0 ? boundaries[drag - 1] : 0
    const maxB = drag < 2 ? boundaries[drag + 1] : 1
    const newPos = Math.round(Math.max(minB, Math.min(maxB, pos)) * 100) / 100

    const nb = [...boundaries]
    nb[drag] = newPos
    const next = [nb[0], nb[1] - nb[0], nb[2] - nb[1], 1 - nb[2]].map(
      (v) => Math.round(Math.max(0, v) * 100) / 100,
    )
    onParts(next)
  }

  const onUp = (e) => {
    if (drag !== null && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setDrag(null)
  }

  const toggleLock = (i) => () => {
    const next = [...locked]
    next[i] = !next[i]
    onLocked(next)
  }

  const total = values.reduce((s, v) => s + v, 0)

  return (
    <div className="isolate">
      <div className="flex justify-between items-baseline mb-2 text-sm">
        <span className="text-slate-300">Mix d'usage</span>
        <span className="font-mono text-xs text-slate-400">
          Total {Math.round(total * 100)}%
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-8 bg-slate-800 rounded-md cursor-pointer select-none overflow-hidden"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* Zones */}
        {values.map((v, i) => {
          const start = i === 0 ? 0 : boundaries[i - 1]
          return (
            <div
              key={i}
              className={`absolute top-0 h-full ${COLORS[i].bg} ${
                locked[i] ? 'opacity-60' : ''
              }`}
              style={{ left: `${start * 100}%`, width: `${v * 100}%` }}
            />
          )
        })}

        {/* Frontières draggables */}
        {boundaries.map((b, i) => {
          const blocked = locked[i] || locked[i + 1]
          return (
            <div
              key={i}
              role="slider"
              aria-label={`Frontière ${labels[i]} / ${labels[i + 1]}`}
              aria-valuenow={Math.round(b * 100)}
              className={`absolute top-0 h-full w-1.5 -translate-x-1/2 border-x border-slate-900 ${
                blocked ? 'bg-slate-500 cursor-not-allowed' : 'bg-white cursor-ew-resize'
              }`}
              style={{ left: `${b * 100}%`, zIndex: 20 }}
              onPointerDown={onDown(i)}
            />
          )
        })}
      </div>

      {/* Légende + verrous par zone */}
      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
        {values.map((v, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 rounded-md border p-2 ${
              locked[i]
                ? 'border-slate-600 bg-slate-800/70'
                : 'border-slate-700 bg-slate-800/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${COLORS[i].solid}`} />
              <span className="text-slate-300">{labels[i]}</span>
            </div>
            <span className="font-mono text-white">{Math.round(v * 100)}%</span>
            <button
              type="button"
              onClick={toggleLock(i)}
              className={`text-[10px] px-2 py-0.5 rounded ${
                locked[i]
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:text-slate-200'
              }`}
            >
              {locked[i] ? '🔒 verrouillé' : 'verrouiller'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
