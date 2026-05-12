const scoreColor = (n) => {
  if (n >= 75) return '#3fb950'
  if (n >= 50) return '#d29922'
  return '#f85149'
}

const verdict = (n) => {
  if (n >= 80) return ['Strong Hire', 'Active, consistent work with solid project quality.']
  if (n >= 60) return ['Worth a Look', 'Good foundation. A few gaps, but generally promising.']
  if (n >= 40) return ['Needs Review', 'Limited public activity — hard to assess from GitHub alone.']
  return ['Insufficient Data', 'Profile is either private or largely inactive.']
}

export default function HireScore({ score }) {
  const circumference = 314
  const offset = circumference - (circumference * score / 100)
  const color = scoreColor(score)
  const [label, desc] = verdict(score)

  return (
    <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-7 flex items-center gap-9 mb-5">
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#21262d" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="font-mono text-[10px] text-zinc-500">/100</span>
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] text-zinc-500 tracking-[2px] uppercase mb-2">
          Overall Hire Score
        </p>
        <p className="text-xl font-semibold mb-2" style={{ color }}>{label}</p>
        <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}