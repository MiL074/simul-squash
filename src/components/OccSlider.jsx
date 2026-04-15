import { useCallback, useRef, useState } from 'react'

// Slider à 2 thumbs indépendants (HC et HP) + marqueur de moyenne pondérée.
// Les valeurs sont des taux 0-1. Le marqueur "global" n'est pas déplaçable :
// il est calculé comme moyenne pondérée par hcShare.
export default function OccSlider({ hc, hp, hcShare, onChange }) {
  const trackRef = useRef(null)
  const [drag, setDrag] = useState(null) // 'hc' | 'hp' | null

  const xToPct = useCallback((clientX) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return 0
    const x = (clientX - r.left) / r.width
    return Math.max(0, Math.min(1, x))
  }, [])

  const onDown = (which) => (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(which)
  }

  const onMove = (e) => {
    if (!drag) return
    const pos = Math.round(xToPct(e.clientX) * 100) / 100
    onChange({ hc, hp, [drag]: pos })
  }

  const onUp = (e) => {
    if (drag && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setDrag(null)
  }

  const global = hcShare * hc + (1 - hcShare) * hp

  return (
    <div className="isolate">
      <div className="flex justify-between items-baseline mb-1 text-sm">
        <span className="text-slate-300">Taux d'occupation</span>
        <span className="font-mono text-slate-400">
          <span className="text-cyan-400">HC {Math.round(hc * 100)}%</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-orange-400">HP {Math.round(hp * 100)}%</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-sky-300">Moy {Math.round(global * 100)}%</span>
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-3 bg-slate-800 rounded-full cursor-pointer select-none"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* Barre de remplissage (visuel informatif : affiche la moyenne) */}
        <div
          className="absolute top-0 left-0 h-full bg-sky-500/20 rounded-full"
          style={{ width: `${global * 100}%` }}
        />

        {/* Thumb HC */}
        <Thumb
          pos={hc}
          color="bg-cyan-400"
          z={20}
          onPointerDown={onDown('hc')}
          ariaLabel="Taux d'occupation heures creuses"
        />
        {/* Thumb HP */}
        <Thumb
          pos={hp}
          color="bg-orange-400"
          z={20}
          onPointerDown={onDown('hp')}
          ariaLabel="Taux d'occupation heures pleines"
        />
        {/* Marqueur global (non draggable) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-5 bg-sky-300 rounded-sm pointer-events-none"
          style={{ left: `${global * 100}%`, zIndex: 10 }}
          title={`Moyenne pondérée : ${Math.round(global * 100)}%`}
        />
      </div>

      <p className="text-xs text-slate-500 mt-2">
        La moyenne est pondérée par la part HC/HP des créneaux
        ({Math.round(hcShare * 100)}% HC).
      </p>
    </div>
  )
}

function Thumb({ pos, color, z, onPointerDown, ariaLabel }) {
  return (
    <div
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(pos * 100)}
      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 ${color} rounded-full shadow border-2 border-slate-900 cursor-grab active:cursor-grabbing`}
      style={{ left: `${pos * 100}%`, zIndex: z }}
      onPointerDown={onPointerDown}
    />
  )
}
