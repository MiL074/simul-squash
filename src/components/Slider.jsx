export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  help,
}) {
  return (
    <label className="block">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm font-mono text-white">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
      {help && <p className="text-xs text-slate-500 mt-1">{help}</p>}
    </label>
  )
}
